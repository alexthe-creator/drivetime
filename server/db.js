const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "drivetime.db");

let db;
let _persistTimer = null;

async function getDb() {
  if (db) return db;
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS newsletters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      subject TEXT,
      email_date TEXT,
      sections TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(type, date)
    )
  `);
  persistNow();
  return db;
}

// Debounced persist — coalesces rapid writes into a single disk write
function persist() {
  if (_persistTimer) clearTimeout(_persistTimer);
  _persistTimer = setTimeout(persistNow, 500);
}

function persistNow() {
  if (!db) return;
  try {
    fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
  } catch (err) {
    console.error("DB persist error:", err.message);
  }
}

function getNewsletter(type, date) {
  const stmt = db.prepare("SELECT * FROM newsletters WHERE type = ? AND date = ?");
  stmt.bind([type, date]);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return { ...row, sections: JSON.parse(row.sections) };
  }
  stmt.free();
  return null;
}

function saveNewsletter(type, date, { subject, email_date, sections }) {
  db.run(
    `INSERT OR REPLACE INTO newsletters (type, date, subject, email_date, sections)
     VALUES (?, ?, ?, ?, ?)`,
    [type, date, subject, email_date, JSON.stringify(sections)]
  );
  persist();
}

module.exports = { getDb, getNewsletter, saveNewsletter };
