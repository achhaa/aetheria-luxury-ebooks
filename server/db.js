import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { SERVER_CATALOG } from './catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'aetheria.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const sqlite = sqlite3.verbose();
export const db = new sqlite.Database(DB_FILE);

// Promisified DB helpers
export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

// Initialize tables and run migrations
export async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      payment_id TEXT,
      signature TEXT,
      status TEXT NOT NULL,
      customer_name TEXT,
      customer_email TEXT,
      amount_inr INTEGER NOT NULL,
      currency TEXT DEFAULT 'INR',
      items_json TEXT,
      download_tokens_json TEXT,
      created_at TEXT NOT NULL,
      paid_at TEXT,
      updated_at TEXT NOT NULL
    );
  `);

  await run(`CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);`);
  await run(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`);

  await run(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      author TEXT NOT NULL,
      author_type TEXT,
      author_role TEXT,
      price_inr INTEGER NOT NULL,
      original_price_inr INTEGER,
      category TEXT NOT NULL,
      badge TEXT,
      pages INTEGER,
      read_time TEXT,
      status TEXT DEFAULT 'published',
      edition TEXT,
      isbn TEXT,
      cover_image TEXT,
      video_preview TEXT,
      description TEXT,
      key_takeaways_json TEXT,
      toc_json TEXT,
      sample_chapter_json TEXT,
      audiobook_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS audiobook_tracks (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL,
      chapter_id TEXT NOT NULL,
      chapter_title TEXT NOT NULL,
      audio_url TEXT NOT NULL,
      transcript_version TEXT DEFAULT '1.0',
      duration_seconds REAL DEFAULT 0,
      timing_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await run(`CREATE INDEX IF NOT EXISTS idx_audio_book_chap ON audiobook_tracks(book_id, chapter_id);`);

  await run(`
    CREATE TABLE IF NOT EXISTS reading_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_email TEXT NOT NULL,
      book_id TEXT NOT NULL,
      chapter_index INTEGER DEFAULT 0,
      page_index INTEGER DEFAULT 0,
      scroll_ratio REAL DEFAULT 0,
      audio_time REAL DEFAULT 0,
      updated_at TEXT NOT NULL,
      UNIQUE(customer_email, book_id)
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      customer_email TEXT NOT NULL,
      book_id TEXT NOT NULL,
      chapter_index INTEGER NOT NULL,
      page_index INTEGER NOT NULL,
      excerpt TEXT,
      note TEXT,
      created_at TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      google_id TEXT UNIQUE,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      avatar_url TEXT,
      given_name TEXT,
      family_name TEXT,
      locale TEXT,
      role TEXT DEFAULT 'customer',
      created_at TEXT NOT NULL,
      last_login_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
  await run(`CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);`);

  // Safely add user_id column to orders table if it doesn't already exist
  try {
    await run(`ALTER TABLE orders ADD COLUMN user_id TEXT;`);
  } catch {
    // Column already exists
  }
  await run(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);`);

  await run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      actor TEXT NOT NULL,
      details TEXT,
      timestamp TEXT NOT NULL
    );
  `);

  // Migrate existing orders.json if present and orders table is empty
  const orderCount = await get(`SELECT COUNT(*) as count FROM orders`);
  if (orderCount && orderCount.count === 0) {
    const ordersJsonPath = path.join(DATA_DIR, 'orders.json');
    if (fs.existsSync(ordersJsonPath)) {
      try {
        const raw = fs.readFileSync(ordersJsonPath, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data.orders)) {
          for (const o of data.orders) {
            await run(`
              INSERT OR REPLACE INTO orders (
                order_id, payment_id, signature, status, customer_name,
                customer_email, amount_inr, currency, items_json,
                download_tokens_json, created_at, paid_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              o.orderId,
              o.paymentId || null,
              o.signature || null,
              o.status || 'CREATED',
              o.customerName || null,
              o.customerEmail || null,
              o.amountINR || o.amount || 0,
              o.currency || 'INR',
              JSON.stringify(o.items || []),
              JSON.stringify(o.downloadTokens || []),
              o.createdAt || new Date().toISOString(),
              o.paidAt || null,
              o.updatedAt || new Date().toISOString()
            ]);
          }
          console.log(`[Database] Migrated ${data.orders.length} orders from orders.json to SQLite.`);
        }
      } catch (e) {
        console.warn('[Database] Could not migrate orders.json:', e);
      }
    }
  }

  // Seed books table from catalog if empty
  const bookCount = await get(`SELECT COUNT(*) as count FROM books`);
  if (bookCount && bookCount.count === 0) {
    const now = new Date().toISOString();
    for (const [id, item] of Object.entries(SERVER_CATALOG)) {
      await run(`
        INSERT OR REPLACE INTO books (
          id, title, subtitle, author, author_type, author_role,
          price_inr, original_price_inr, category, badge, pages,
          read_time, status, edition, isbn, cover_image, video_preview,
          description, key_takeaways_json, toc_json, sample_chapter_json,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        item.id,
        item.title,
        item.subtitle || 'Privé Edition',
        item.author,
        'Editorial Pen Name',
        item.authorRole,
        item.priceINR,
        item.priceINR * 2,
        item.category,
        'Curated Edition',
        item.pages,
        '6 hours',
        'published',
        'First Edition (2026)',
        item.isbn,
        `/assets/covers/${item.id}.jpg`,
        `/assets/videos/${item.id}.mp4`,
        `Authoritative publication on ${item.category}.`,
        JSON.stringify(['Rigorous human editorial synthesis', 'Clear citations and empirical benchmarks']),
        JSON.stringify([{ number: '01', title: 'Foundations of Modern Inquiry' }]),
        JSON.stringify({ chapterNumber: '01', title: 'Chapter One', content: [] }),
        now,
        now
      ]);
    }
    console.log('[Database] Seeded books table with authoritative catalogue.');
  }
}

// Log audit event helper
export async function logAudit(action, actor, details = {}) {
  try {
    await run(`
      INSERT INTO audit_logs (action, actor, details, timestamp)
      VALUES (?, ?, ?, ?)
    `, [action, actor, JSON.stringify(details), new Date().toISOString()]);
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
}
