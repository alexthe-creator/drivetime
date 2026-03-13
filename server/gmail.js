const { google } = require("googleapis");

let _cachedOAuthClient = null;

function getOAuthClient() {
  if (_cachedOAuthClient) return _cachedOAuthClient;
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  _cachedOAuthClient = client;
  return client;
}

// dateStr format: YYYY-MM-DD -> Gmail needs YYYY/MM/DD
function toGmailDate(dateStr) {
  return dateStr.replace(/-/g, "/");
}

// Returns the date one day before dateStr (YYYY-MM-DD)
function dayBefore(dateStr) {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function searchLatestMessage(query, dateStr) {
  const auth = getOAuthClient();
  const gmail = google.gmail({ version: "v1", auth });

  const fullQuery = `${query} after:${toGmailDate(dayBefore(dateStr))}`;
  console.log(`Gmail search: ${fullQuery}`);

  const res = await gmail.users.messages.list({
    userId: "me",
    q: fullQuery,
    maxResults: 1,
  });

  console.log(`Gmail results: ${res.data.messages?.length ?? 0} messages`);
  if (!res.data.messages?.length) return null;

  const msg = await gmail.users.messages.get({
    userId: "me",
    id: res.data.messages[0].id,
    format: "full",
  });

  const from = (msg.data.payload?.headers || []).find(h => h.name.toLowerCase() === "from")?.value;
  console.log(`Found message from: ${from}`);
  return msg.data;
}

function getHeader(message, name) {
  const headers = message.payload.headers || [];
  const h = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return h ? h.value : "";
}

function decodeBody(message) {
  function findByMime(parts, mime) {
    for (const part of parts) {
      if (part.mimeType === mime && part.body?.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
      if (part.parts) {
        const found = findByMime(part.parts, mime);
        if (found) return found;
      }
    }
    return null;
  }

  function stripHtml(html) {
    return html
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  let raw = null;
  if (message.payload.parts) {
    raw = findByMime(message.payload.parts, "text/plain");
    if (!raw) {
      const html = findByMime(message.payload.parts, "text/html");
      if (html) raw = stripHtml(html);
    }
  } else if (message.payload.body?.data) {
    const decoded = Buffer.from(message.payload.body.data, "base64").toString("utf-8");
    raw = message.payload.mimeType === "text/html" ? stripHtml(decoded) : decoded;
  }

  if (!raw) return "";
  console.log(`Body length: ${raw.length} chars`);

  return raw
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

async function fetchFT(dateStr) {
  try {
    const msg = await searchLatestMessage('"FT@newsletters.ft.com"', dateStr);
    if (!msg) return null;

    const body = decodeBody(msg);
    const subjectMatch = body.match(/Subject:\s+(?:\[EXTERNAL\]\s+)?(.+)/);
    const subject = subjectMatch
      ? subjectMatch[1].trim()
      : getHeader(msg, "subject");
    const date = new Date(parseInt(msg.internalDate)).toISOString();

    return { subject, body, date };
  } catch (err) {
    console.error("FT fetch error:", err.message);
    return null;
  }
}

async function fetchAxios(dateStr) {
  try {
    const msg = await searchLatestMessage(
      'from:@axios.com subject:"Pro Rata"',
      dateStr
    );
    if (!msg) return null;

    const body = decodeBody(msg);
    const subject = getHeader(msg, "subject");
    const date = new Date(parseInt(msg.internalDate)).toISOString();

    return { subject, body, date };
  } catch (err) {
    console.error("Axios fetch error:", err.message);
    return null;
  }
}

module.exports = { fetchFT, fetchAxios };
