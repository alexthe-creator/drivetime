require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const { google } = require("googleapis");
const { getDb, getNewsletter, saveNewsletter } = require("./db");
const { fetchFT, fetchAxios } = require("./gmail");
const { parseWithClaude } = require("./parse");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(compression());
app.use(express.json());

// Request timeout middleware (30 seconds)
app.use((req, res, next) => {
  req.setTimeout(30000);
  res.setTimeout(30000);
  next();
});

// GET /api/newsletters?threshold=100
app.get("/api/newsletters", async (req, res) => {
  const threshold = parseInt(req.query.threshold || "100") || 100;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const [ft, axios] = await Promise.all([
      fetchAndCache("ft", today, threshold),
      fetchAndCache("axios", today, threshold),
    ]);

    res.json({ ft, axios });
  } catch (err) {
    console.error("Error fetching newsletters:", err);
    res.status(500).json({ error: "Failed to fetch newsletters" });
  }
});

async function fetchAndCache(type, date, threshold) {
  // Return cached version if available and has content
  const cached = getNewsletter(type, date);
  if (cached && cached.sections && cached.sections.length > 0) {
    console.log(`Returning cached ${type} for ${date}`);
    return { subject: cached.subject, date: cached.email_date, sections: cached.sections };
  }

  // Fetch raw email
  const raw = type === "ft" ? await fetchFT(date) : await fetchAxios(date);
  if (!raw) {
    console.log(`No ${type} newsletter found for ${date}`);
    return null;
  }

  // Parse with Claude
  const sections = await parseWithClaude(raw.body, type, threshold);

  // Cache result
  saveNewsletter(type, date, {
    subject: raw.subject,
    email_date: raw.date,
    sections,
  });

  console.log(`Fetched and cached ${type} for ${date}: ${sections.length} sections`);
  return { subject: raw.subject, date: raw.date, sections };
}

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Debug: search Gmail with a custom query and return from/subject of latest result
app.get("/debug/gmail", async (req, res) => {
  const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  const gmail = google.gmail({ version: "v1", auth });
  const q = req.query.q || "axios";
  const list = await gmail.users.messages.list({ userId: "me", q, maxResults: 5 });
  if (!list.data.messages?.length) return res.json({ results: [] });
  const results = await Promise.all(list.data.messages.map(async m => {
    const msg = await gmail.users.messages.get({ userId: "me", id: m.id, format: "metadata", metadataHeaders: ["From", "Subject", "Date"] });
    const headers = msg.data.payload?.headers || [];
    const h = name => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value;
    return { from: h("from"), subject: h("subject"), date: h("date") };
  }));
  res.json({ query: q, results });
});

// Init DB then start server
getDb().then(() => {
  app.listen(PORT, () => {
    console.log(`DriveTime server running on port ${PORT}`);
  });
});
