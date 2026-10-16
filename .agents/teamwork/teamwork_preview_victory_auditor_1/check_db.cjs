const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('server/data/aetheria.db');

db.all("PRAGMA table_info(audiobook_tracks)", (err, rows) => {
  if (err) console.error('Error:', err);
  else {
    console.log('Columns:', rows);
    db.all("SELECT * FROM audiobook_tracks", (err2, rows2) => {
      if (err2) console.error('Error rows:', err2);
      else console.log('Rows:', rows2.map(r => ({
        ...r,
        timing_json: r.timing_json ? `JSON string (${r.timing_json.length} chars)` : null
      })));
      db.close();
    });
  }
});
