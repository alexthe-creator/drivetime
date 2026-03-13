const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic();

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

1. "Top of the Morning" -> ONE section containing all its content
2. "The BFD" (Big F***ing Deal) -> ONE section
3. "The Bottom Line" -> ONE section
4. "By the Numbers" -> ONE section
5. "Venture Capital" -> each individual company deal is its OWN separate section. SKIP any deal under $${threshold} million raised. Start each section naturally with the company name and what they raised.
6. "Private Equity" -> each individual deal is its OWN separate section
7. "Public Offerings" -> ONE section with all items combined
8. "Liquidity Events" -> ONE section with all items combined
9. "M&A" -> ONE section with all items combined
10. "It's Personal" -> ONE section with all items combined

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

function fallbackSplit(body) {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 60);
}

async function parseWithClaude(body, type, threshold = 100) {
  const text = body.length > 15000 ? body.slice(0, 15000) : body;
  const prompt =
    type === "axios"
      ? buildAxiosPrompt(text, threshold)
      : buildFTPrompt(text);

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = message.content[0]?.text?.trim();
    if (!responseText) return fallbackSplit(body);

    const match = responseText.match(/\[[\s\S]*\]/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((s) => typeof s === "string" && s.trim().length > 20);
      }
    }
  } catch (err) {
    console.error("parseWithClaude error:", err.message);
  }

  return fallbackSplit(body);
}

module.exports = { parseWithClaude };
