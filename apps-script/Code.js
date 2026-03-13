// ============================================================
// DriveTime Newsletter Script — Google Apps Script
// ============================================================
// SETUP INSTRUCTIONS:
// 1. Go to script.google.com and open this project
// 2. Click the gear icon (⚙) → Project Settings → Script Properties
// 3. Add a property: Name = ANTHROPIC_API_KEY, Value = your key from console.anthropic.com
// 4. Redeploy: Deploy → Manage deployments → Edit (pencil) → New version → Deploy
//
// The Anthropic API key enables Claude to intelligently parse each newsletter
// into clean, listenable sections — no ads, no URLs, deals chunked correctly.
// ============================================================

function doGet(e) {
  const tz = Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), tz, "yyyy/MM/dd");
  const threshold = parseInt((e && e.parameter && e.parameter.threshold) || "100") || 100;

  const result = {
    ft: fetchAndParse("ft", today, threshold),
    axios: fetchAndParse("axios", today, threshold),
  };

  const output = ContentService.createTextOutput(JSON.stringify(result));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function fetchAndParse(type, dateStr, threshold) {
  const raw = type === "ft"
    ? fetchFTRaw(dateStr)
    : fetchNewsletterRaw('from:(@axios.com) subject:"Pro Rata"', dateStr);

  if (!raw) return null;

  return {
    subject: raw.subject,
    date: raw.date,
    sections: parseWithClaude(raw.body, type, threshold),
  };
}

function fetchFTRaw(dateStr) {
  try {
    // FT is forwarded internally, so search email body for the FT sender address
    const threads = GmailApp.search('"FT@newsletters.ft.com" after:' + dateStr, 0, 1);
    if (!threads.length) return null;

    const msg = threads[0].getMessages().pop();
    const rawBody = msg.getPlainBody();

    const body = rawBody
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{4,}/g, "\n\n\n")
      .trim();

    // Extract original subject from the forwarded header block
    const subjectMatch = body.match(/Subject:\s+(?:\[EXTERNAL\]\s+)?(.+)/);
    const subject = subjectMatch ? subjectMatch[1].trim() : msg.getSubject();

    return { subject, body, date: msg.getDate().toISOString() };
  } catch (err) {
    Logger.log("FT fetch error: " + err);
    return null;
  }
}

function fetchNewsletterRaw(query, dateStr) {
  try {
    const threads = GmailApp.search(query + " after:" + dateStr, 0, 1);
    if (!threads.length) return null;

    const msg = threads[0].getMessages().pop();
    const rawBody = msg.getPlainBody();

    const body = rawBody
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{4,}/g, "\n\n\n")
      .trim();

    return { subject: msg.getSubject(), body, date: msg.getDate().toISOString() };
  } catch (err) {
    Logger.log("Newsletter fetch error: " + err);
    return null;
  }
}

function parseWithClaude(body, type, threshold) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");
    if (!apiKey) {
      Logger.log("No ANTHROPIC_API_KEY set — falling back to paragraph split");
      return fallbackSplit(body);
    }

    // Truncate to avoid excessive API cost (Haiku is cheap but let's be reasonable)
    const text = body.length > 15000 ? body.slice(0, 15000) : body;

    const prompt = type === "axios"
      ? buildAxiosPrompt(text, threshold)
      : buildFTPrompt(text);

    const payload = {
      model: "claude-haiku-4-5",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    };

    const options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", options);
    const data = JSON.parse(response.getContentText());

    if (data.error) {
      Logger.log("Claude API error: " + JSON.stringify(data.error));
      return fallbackSplit(body);
    }

    if (data.content && data.content[0] && data.content[0].text) {
      const responseText = data.content[0].text.trim();
      // Extract JSON array from response (handles any extra text Claude might add)
      const match = responseText.match(/\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(s => typeof s === "string" && s.trim().length > 20);
        }
      }
    }
  } catch (err) {
    Logger.log("parseWithClaude error: " + err);
  }

  return fallbackSplit(body);
}

function fallbackSplit(body) {
  return body
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 60);
}

function buildFTPrompt(text) {
  return `You are processing a Financial Times newsletter for text-to-speech playback while driving.

Split the newsletter into readable sections. Rules:
- Each section should be 1-3 paragraphs of substantive news content
- SKIP: advertisement blocks, subscription links, unsubscribe instructions, illustration credits, lines containing only URLs (http/https), social sharing buttons, email metadata headers (From:, To:, Subject:, Sent:, CC:)
- KEEP: news articles, market commentary, analysis, opinion pieces
- Combine very short standalone sentences with adjacent content so sections feel complete when read aloud

Return ONLY a valid JSON array of strings. No explanation, no markdown code fences. Example format:
["First section text here...", "Second section text here..."]

Newsletter text:
${text}`;
}

function buildAxiosPrompt(text, threshold) {
  return `You are processing an Axios Pro Rata newsletter for text-to-speech playback while driving.

Parse this newsletter into sections using these exact rules:

1. "Top of the Morning" → ONE section containing all its content
2. "The BFD" (Big F***ing Deal) → ONE section
3. "The Bottom Line" → ONE section
4. "By the Numbers" → ONE section
5. "Venture Capital" → each individual company deal is its OWN separate section. SKIP any deal under $${threshold} million raised. Start each section naturally with the company name and what they raised.
6. "Private Equity" → each individual deal is its OWN separate section
7. "Public Offerings" → ONE section with all items combined
8. "Liquidity Events" → ONE section with all items combined
9. "M&A" → ONE section with all items combined
10. "It's Personal" → ONE section with all items combined

SKIP entirely (do not include anything from these):
- "Message from Axios HQ" or "A message from [sponsor]" sections
- Sponsored content or advertisement sections
- Illustration credits (lines like "Illustration: ...")
- Lines that are just URLs (starting with http:// or https://)
- Share / Tweet / Forward / Subscribe buttons
- Unsubscribe / manage preferences links
- Email forwarding headers (From:, To:, Subject:, Sent:)

Return ONLY a valid JSON array of strings. No explanation, no markdown. Example:
["Top of the Morning content...", "The BFD content...", "Company A raised $200M...", "Company B raised $150M..."]

Newsletter:
${text}`;
}
