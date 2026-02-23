// ============================================================
// DriveTime Newsletter Script — Google Apps Script
// ============================================================
// SETUP INSTRUCTIONS:
// 1. Go to script.google.com and create a new project
// 2. Paste this entire file into the editor (replace any existing code)
// 3. Click Deploy → New deployment
// 4. Type: Web App
// 5. Execute as: Me
// 6. Who has access: Anyone
// 7. Click Deploy and copy the Web App URL
// 8. Paste that URL into DriveTime Settings → Newsletter API URL
//
// The script will run each time DriveTime opens the Newsletter screen.
// It searches your Gmail for today's FT and Axios emails automatically.
// ============================================================

function doGet(e) {
  const tz = Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), tz, "yyyy/MM/dd");

  const result = {
    ft: fetchNewsletter("from:(@ft.com OR @news.ft.com OR @email.ft.com)", today),
    axios: fetchNewsletter("from:(@axios.com) subject:\"Pro Rata\"", today),
  };

  const output = ContentService.createTextOutput(JSON.stringify(result));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function fetchNewsletter(query, dateStr) {
  try {
    const threads = GmailApp.search(query + " after:" + dateStr, 0, 1);
    if (!threads.length) return null;

    const msg = threads[0].getMessages().pop();
    const rawBody = msg.getPlainBody();

    // Clean up the text: collapse excessive whitespace, trim
    const body = rawBody
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")        // trailing spaces
      .replace(/\n{4,}/g, "\n\n\n")      // max 3 consecutive newlines
      .trim();

    return {
      subject: msg.getSubject(),
      body: body,
      date: msg.getDate().toISOString(),
    };
  } catch (err) {
    return null;
  }
}
