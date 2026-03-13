// One-time script to get a Gmail OAuth2 refresh token.
// Run once locally: node setup-oauth.js
// Then copy the printed refresh token into your .env / Railway env vars.
require("dotenv").config();
const { google } = require("googleapis");
const http = require("http");
const url = require("url");

const REDIRECT_URI = "http://localhost:8888/oauth2callback";
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

const client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
});

console.log("\nOpen this URL in your browser:\n");
console.log(authUrl);
console.log("\nWaiting for OAuth callback on http://localhost:8888/oauth2callback ...\n");

const server = http.createServer(async (req, res) => {
  const { query } = url.parse(req.url, true);
  if (!query.code) {
    res.end("No code found.");
    return;
  }

  try {
    const { tokens } = await client.getToken(query.code);
    console.log("\nAdd this to your .env file (and Railway environment variables):\n");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
    res.end("Done! You can close this tab.");
  } catch (err) {
    console.error("Error getting token:", err.message);
    res.end("Error — check the terminal.");
  } finally {
    server.close();
  }
});

server.listen(8888);
