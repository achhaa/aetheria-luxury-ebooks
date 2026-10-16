const Database = require('better-sqlite3');
const db = new Database('server/data/aetheria.db');
console.log('Tables:', db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all());
try {
  console.log('Timings by book:', db.prepare('SELECT book_id, count(*) as count FROM audio_timings GROUP BY book_id').all());
} catch (e) {
  console.log('Timings error:', e.message);
}
db.close();
