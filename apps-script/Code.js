function doGet(e) {
  const result = {
    ft: fetchFT(),
    axios: fetchNewsletter("subject:\"Pro Rata\""),
  };

  const output = ContentService.createTextOutput(JSON.stringify(result));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function fetchFT() {
  try {
    const threads = GmailApp.search('"FT@newsletters.ft.com"', 0, 1);
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

    return {
      subject: subject,
      body: body,
      date: msg.getDate().toISOString(),
    };
  } catch (err) {
    return null;
  }
}

function fetchNewsletter(query) {
  try {
    const threads = GmailApp.search(query, 0, 1);
    if (!threads.length) return null;

    const msg = threads[0].getMessages().pop();
    const rawBody = msg.getPlainBody();

    const body = rawBody
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{4,}/g, "\n\n\n")
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
