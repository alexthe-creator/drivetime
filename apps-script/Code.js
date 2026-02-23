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
