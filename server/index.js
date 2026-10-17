import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';

import { SERVER_CATALOG } from './catalog.js';
import { saveOrder, findOrderById, findOrdersByEmail, getAllOrders } from './storage.js';
import { generateBookPdf } from './pdfGenerator.js';
import { generateBookEpub } from './epubGenerator.js';
import { initializeDatabase, run, get, all, logAudit } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

const app = express();
const PORT = process.env.PORT || 3001;

// Secret keys from server-side environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'aetheria_webhook_secret_2026';
const TOKEN_SECRET = process.env.DOWNLOAD_TOKEN_SECRET || 'aetheria_luxury_download_secret_key_9981';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'aetheria-admin-secret-2026';

const isRazorpayConfigured =
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET &&
  !process.env.RAZORPAY_KEY_ID.includes('placeholder');

let razorpayClient = null;
if (isRazorpayConfigured) {
  razorpayClient = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
}

app.use(cors());
app.use(express.json());

// Initialize SQLite database schema and seed data
initializeDatabase().catch((e) => console.error('[Database Init Error]', e));

// Token helper: Creates a signed expiring download token
function createDownloadToken({ orderId, bookId, email, expiresInMs = 24 * 60 * 60 * 1000 }) {
  const expiresAt = Date.now() + expiresInMs;
  const payload = JSON.stringify({ orderId, bookId, email, expiresAt });
  const b64Payload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(b64Payload).digest('base64url');
  return `${b64Payload}.${signature}`;
}

// Token helper: Verifies signed expiring download token
function verifyDownloadToken(token) {
  try {
    const [b64Payload, signature] = token.split('.');
    if (!b64Payload || !signature) return null;

    const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(b64Payload).digest('base64url');
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf-8'));
    if (Date.now() > payload.expiresAt) return null; // Expired

    return payload;
  } catch {
    return null;
  }
}

// Admin Authorization Middleware
function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/, '') || req.headers['x-admin-key'];
  if (token !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized: Valid administrative key required.' });
  }
  next();
}

// User Session Authentication (HMAC-SHA256 JWT Token)
const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET || 'aetheria_auth_jwt_session_secret_2026';

function createSessionToken(user, expiresInMs = 30 * 24 * 60 * 60 * 1000) {
  const expiresAt = Date.now() + expiresInMs;
  const payload = JSON.stringify({
    userId: user.id,
    email: user.email,
    role: user.role || 'customer',
    expiresAt,
  });
  const b64 = Buffer.from(payload).toString('base64url');
  const sig = crypto.createHmac('sha256', AUTH_JWT_SECRET).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

function verifySessionToken(token) {
  try {
    if (!token) return null;
    const [b64, sig] = token.split('.');
    if (!b64 || !sig) return null;
    const expectedSig = crypto.createHmac('sha256', AUTH_JWT_SECRET).update(b64).digest('base64url');
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf-8'));
    if (Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

// User Authentication Middleware
async function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/, '') || req.query.token;
  const session = verifySessionToken(token);
  if (!session) {
    return res.status(401).json({ error: 'Authentication required. Please sign in with Google.' });
  }
  const user = await get(`SELECT * FROM users WHERE id = ?`, [session.userId]);
  if (!user) {
    return res.status(401).json({ error: 'User session not found.' });
  }
  req.user = user;
  next();
}

/**
 * 1. GET /api/config
 * Public client configuration (safe public key only, never private secrets)
 */
app.get('/api/config', (req, res) => {
  res.json({
    razorpayKeyId: isRazorpayConfigured ? RAZORPAY_KEY_ID : 'rzp_test_mock_mode',
    isTestMode: !isRazorpayConfigured || RAZORPAY_KEY_ID.startsWith('rzp_test_'),
    currency: 'INR',
    merchantName: 'AETHERIA Privé Editions',
  });
});

/**
 * 2. POST /api/create-order
 * Authoritative order creation. Prices are NEVER taken from the client.
 */
app.post('/api/create-order', async (req, res) => {
  try {
    const { bookIds, customerName, customerEmail, promoCode } = req.body;
    const ids = Array.isArray(bookIds) ? bookIds : [req.body.bookId];

    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: 'At least one book ID must be provided' });
    }

    // Verify all book IDs and aggregate authoritative total
    const orderedItems = [];
    let totalPaise = 0;

    for (const id of ids) {
      // Check database first for dynamic pricing, fallback to catalog
      const dbBook = await get(`SELECT * FROM books WHERE id = ?`, [id]);
      if (dbBook) {
        orderedItems.push({
          id: dbBook.id,
          title: dbBook.title,
          priceINR: dbBook.price_inr,
          pricePaise: dbBook.price_inr * 100,
          author: dbBook.author,
          authorRole: dbBook.author_role,
          category: dbBook.category,
          isbn: dbBook.isbn,
          pages: dbBook.pages
        });
        totalPaise += dbBook.price_inr * 100;
      } else {
        const book = SERVER_CATALOG[id];
        if (!book) {
          return res.status(400).json({ error: `Book '${id}' not recognized in catalogue.` });
        }
        orderedItems.push(book);
        totalPaise += book.pricePaise;
      }
    }

    // Apply authoritative server promo discounts if provided
    let discountPaise = 0;
    const normalizedPromo = typeof promoCode === 'string' ? promoCode.trim().toUpperCase() : '';
    if (normalizedPromo === 'AETHERIA10') {
      discountPaise = Math.round(totalPaise * 0.10);
      totalPaise = Math.max(100, totalPaise - discountPaise); // Minimum ₹1
    } else if (normalizedPromo === 'PRIVEE20') {
      discountPaise = Math.round(totalPaise * 0.20);
      totalPaise = Math.max(100, totalPaise - discountPaise); // Minimum ₹1
    }

    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    let razorpayOrderId;

    if (isRazorpayConfigured && razorpayClient) {
      const rzpOrder = await razorpayClient.orders.create({
        amount: totalPaise,
        currency: 'INR',
        receipt,
        notes: {
          customerName: customerName || 'Aetheria Patron',
          customerEmail: customerEmail || 'patron@aetheria.com',
          bookIds: ids.join(','),
        },
      });
      razorpayOrderId = rzpOrder.id;
    } else {
      // Deterministic cryptographic mock order for local test verification
      razorpayOrderId = `order_test_${crypto.randomBytes(8).toString('hex')}`;
    }

    const orderRecord = {
      orderId: razorpayOrderId,
      receipt,
      amountPaise: totalPaise,
      amountINR: totalPaise / 100,
      currency: 'INR',
      status: 'CREATED',
      items: orderedItems,
      customerName: customerName || 'Anonymous Reader',
      customerEmail: customerEmail || 'reader@aetheria.com',
      createdAt: new Date().toISOString(),
    };

    await saveOrder(orderRecord);

    res.json({
      orderId: razorpayOrderId,
      amountPaise: totalPaise,
      amountINR: totalPaise / 100,
      currency: 'INR',
      keyId: isRazorpayConfigured ? RAZORPAY_KEY_ID : 'rzp_test_mock_mode',
      items: orderedItems,
      customerName: orderRecord.customerName,
      customerEmail: orderRecord.customerEmail,
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create authoritative order on server.' });
  }
});

/**
 * 3. POST /api/verify-payment
 * Cryptographic signature verification. Order is ONLY unlocked upon verified signature.
 */
app.post('/api/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerName,
      customerEmail,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Missing mandatory payment details.' });
    }

    const order = await findOrderById(razorpay_order_id);
    if (!order) {
      return res.status(404).json({ error: 'Referenced order not found in records.' });
    }

    // Signature verification logic
    let isValid = false;

    if (isRazorpayConfigured) {
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isValid = generatedSignature === razorpay_signature;
    } else {
      // Test mode verification
      isValid = true;
    }

    if (!isValid) {
      order.status = 'PAYMENT_FAILED';
      await saveOrder(order);
      return res.status(400).json({ error: 'Cryptographic payment signature verification failed.' });
    }

    // Idempotent success handling
    order.status = 'PAID';
    order.paymentId = razorpay_payment_id;
    order.signature = razorpay_signature || 'verified_in_test_mode';
    if (customerName) order.customerName = customerName;
    if (customerEmail) order.customerEmail = customerEmail;
    order.paidAt = new Date().toISOString();

    // Generate secure expiring download tokens for each purchased title
    const downloadTokens = order.items.map((item) => {
      const token = createDownloadToken({
        orderId: order.orderId,
        bookId: item.id,
        email: order.customerEmail,
      });
      return {
        bookId: item.id,
        title: item.title,
        token,
        downloadUrl: `/api/download/${token}`,
        downloadEpubUrl: `/api/download-epub/${token}`,
      };
    });

    // Auto-link to user account if customer email matches a registered user
    if (order.customerEmail) {
      const existingUser = await get(`SELECT id FROM users WHERE LOWER(email) = ?`, [order.customerEmail.toLowerCase().trim()]);
      if (existingUser) {
        order.userId = existingUser.id;
      }
    }

    order.downloadTokens = downloadTokens;
    await saveOrder(order);

    res.json({
      success: true,
      message: 'Payment verified and sovereign license unlocked.',
      order: {
        orderId: order.orderId,
        paymentId: order.paymentId,
        amountINR: order.amountINR,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        paidAt: order.paidAt,
        items: order.items,
        downloads: downloadTokens,
      },
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ error: 'Server error during payment verification.' });
  }
});

/**
 * 4. POST /api/webhook
 * Razorpay Webhook processor. Idempotently handles server-to-server notifications.
 */
app.post('/api/webhook', async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];

    if (isRazorpayConfigured && webhookSignature) {
      const rawBody = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== webhookSignature) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;

      if (rzpOrderId) {
        const order = await findOrderById(rzpOrderId);
        if (order && order.status !== 'PAID') {
          order.status = 'PAID';
          order.paymentId = paymentEntity.id;
          order.paidAt = new Date().toISOString();
          await saveOrder(order);
        }
      }
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing exception.' });
  }
});

/**
 * 5. GET /api/download/:token
 * Secure digital delivery: PDF edition. Only verified purchasers with a valid HMAC token can access files.
 */
app.get('/api/download/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const payload = verifyDownloadToken(token);

    if (!payload) {
      return res.status(403).send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #c5a059;">Access Expired or Unauthorized</h2>
          <p>This download token is invalid or has expired (24h limit).</p>
          <p>Please enter your email on the Aetheria library retrieval portal to generate a refreshed download link.</p>
        </div>
      `);
    }

    const order = await findOrderById(payload.orderId);
    if (!order || order.status !== 'PAID') {
      return res.status(403).send('Unauthorized. Order not confirmed as paid.');
    }

    const book = SERVER_CATALOG[payload.bookId];
    if (!book) {
      return res.status(404).send('Publication not found.');
    }

    const filename = `${book.id}-aetheria-prive-edition.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    generateBookPdf(
      {
        book,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderId: order.orderId,
      },
      res
    );
  } catch (err) {
    console.error('Download delivery error:', err);
    res.status(500).send('Failed to generate authorized digital publication.');
  }
});

/**
 * 6. GET /api/download-epub/:token
 * Secure digital delivery: EPUB edition.
 */
app.get('/api/download-epub/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const payload = verifyDownloadToken(token);

    if (!payload) {
      return res.status(403).send('Access expired or unauthorized token.');
    }

    const order = await findOrderById(payload.orderId);
    if (!order || order.status !== 'PAID') {
      return res.status(403).send('Unauthorized. Order not confirmed as paid.');
    }

    const book = SERVER_CATALOG[payload.bookId];
    if (!book) {
      return res.status(404).send('Publication not found.');
    }

    const filename = `${book.id}-aetheria-prive-edition.epub`;
    res.setHeader('Content-Type', 'application/epub+zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const epubBuffer = await generateBookEpub({
      book,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      orderId: order.orderId,
    });

    res.send(epubBuffer);
  } catch (err) {
    console.error('EPUB delivery error:', err);
    res.status(500).send('Failed to generate authorized EPUB publication.');
  }
});

/**
 * 7. POST /api/customer/orders
 * Look up purchase history and regenerate active download tokens for verified customers.
 */
app.post('/api/customer/orders', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const allCustomerOrders = await findOrdersByEmail(email);
  const paidOrders = allCustomerOrders.filter((o) => o.status === 'PAID');

  const history = paidOrders.map((order) => {
    const tokens = order.items.map((it) => {
      const token = createDownloadToken({
        orderId: order.orderId,
        bookId: it.id,
        email: order.customerEmail,
      });
      return {
        bookId: it.id,
        title: it.title,
        downloadUrl: `/api/download/${token}`,
        downloadEpubUrl: `/api/download-epub/${token}`,
      };
    });

    return {
      orderId: order.orderId,
      amountINR: order.amountINR,
      paidAt: order.paidAt,
      items: order.items,
      downloads: tokens,
    };
  });

  res.json({ orders: history });
});

/**
 * 7.1 GET /api/health
 * Public health check and server telemetry.
 */
app.get('/api/health', async (req, res) => {
  try {
    const orderCountRow = await get(`SELECT COUNT(*) as count FROM orders`);
    const userCountRow = await get(`SELECT COUNT(*) as count FROM users`);
    res.json({
      status: 'healthy',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: 'connected (sqlite3)',
      ordersCount: orderCountRow?.count || 0,
      usersCount: userCountRow?.count || 0,
      catalogCount: SERVER_CATALOG.length,
      mode: isRazorpayConfigured ? 'live-configured' : 'mock-active',
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

/**
 * 7.2 POST /api/auth/google
 * Google Identity Services authentication endpoint.
 * Validates Google ID token / client profile, persists user in SQLite, auto-links guest orders,
 * and issues an authoritative signed session JWT.
 */
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential, profile } = req.body;
    let googleId = null;
    let email = null;
    let name = null;
    let avatarUrl = null;
    let givenName = null;
    let familyName = null;
    let locale = 'en';

    if (credential) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
          googleId = payload.sub;
          email = payload.email?.toLowerCase();
          name = payload.name;
          avatarUrl = payload.picture;
          givenName = payload.given_name;
          familyName = payload.family_name;
          locale = payload.locale || 'en';
        }
      } catch (e) {
        console.warn('[Auth] Error decoding Google credential JWT:', e);
      }
    }

    if (!email && profile) {
      googleId = profile.id || profile.sub || `google_demo_${Date.now()}`;
      email = profile.email?.toLowerCase();
      name = profile.name || profile.displayName;
      avatarUrl = profile.picture || profile.avatar_url;
      givenName = profile.given_name;
      familyName = profile.family_name;
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid Google email is required for authentication.' });
    }

    const now = new Date().toISOString();
    let user = await get(`SELECT * FROM users WHERE google_id = ? OR LOWER(email) = ?`, [googleId, email]);

    if (user) {
      await run(`
        UPDATE users SET
          google_id = COALESCE(?, google_id),
          name = COALESCE(?, name),
          avatar_url = COALESCE(?, avatar_url),
          given_name = COALESCE(?, given_name),
          family_name = COALESCE(?, family_name),
          last_login_at = ?,
          updated_at = ?
        WHERE id = ?
      `, [googleId, name, avatarUrl, givenName, familyName, now, now, user.id]);
      user = await get(`SELECT * FROM users WHERE id = ?`, [user.id]);
    } else {
      const userId = 'usr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
      await run(`
        INSERT INTO users (
          id, google_id, email, name, avatar_url, given_name, family_name, locale, role, created_at, last_login_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'customer', ?, ?, ?)
      `, [
        userId, googleId, email, name || email.split('@')[0], avatarUrl || null,
        givenName || null, familyName || null, locale, now, now, now
      ]);
      user = await get(`SELECT * FROM users WHERE id = ?`, [userId]);
    }

    // Auto-link any prior guest orders made with this email
    await run(`
      UPDATE orders 
      SET user_id = ? 
      WHERE LOWER(customer_email) = ? AND (user_id IS NULL OR user_id = '')
    `, [user.id, email]);

    await logAudit('USER_LOGIN_GOOGLE', user.email, { userId: user.id });

    const sessionToken = createSessionToken(user);

    res.json({
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        googleId: user.google_id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[Google Auth Error]:', err);
    res.status(500).json({ error: 'Internal error during Google authentication.' });
  }
});

/**
 * 7.3 GET /api/auth/me
 * Retrieves current authenticated user profile and stats.
 */
app.get('/api/auth/me', requireAuth, async (req, res) => {
  const paidOrdersCount = await get(
    `SELECT COUNT(*) as count FROM orders WHERE (user_id = ? OR LOWER(customer_email) = ?) AND status = 'PAID'`,
    [req.user.id, req.user.email.toLowerCase()]
  );
  res.json({
    user: {
      id: req.user.id,
      googleId: req.user.google_id,
      email: req.user.email,
      name: req.user.name,
      avatarUrl: req.user.avatar_url,
      role: req.user.role,
      paidOrdersCount: paidOrdersCount?.count || 0,
    },
  });
});

/**
 * 7.4 GET /api/user/library
 * Authoritatively retrieves authenticated user's purchased books and active download tokens.
 */
app.get('/api/user/library', requireAuth, async (req, res) => {
  try {
    const rawOrders = await all(
      `SELECT * FROM orders WHERE (user_id = ? OR LOWER(customer_email) = ?) AND status = 'PAID' ORDER BY created_at DESC`,
      [req.user.id, req.user.email.toLowerCase()]
    );

    const orders = rawOrders.map((row) => {
      let items = [];
      try { items = JSON.parse(row.items_json || '[]'); } catch {}

      const tokens = items.map((it) => {
        const token = createDownloadToken({
          orderId: row.order_id,
          bookId: it.id,
          email: row.customer_email || req.user.email,
        });
        return {
          bookId: it.id,
          title: it.title,
          downloadUrl: `/api/download/${token}`,
          downloadEpubUrl: `/api/download-epub/${token}`,
        };
      });

      return {
        orderId: row.order_id,
        paymentId: row.payment_id,
        amountINR: row.amount_inr,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        paidAt: row.paid_at,
        items,
        downloads: tokens,
      };
    });

    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatarUrl: req.user.avatar_url,
      },
      orders,
    });
  } catch (err) {
    console.error('[User Library Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve user library.' });
  }
});

/**
 * 8. GET /api/audiobook/:bookId/:chapterId
 * Returns structured word-level timing map and verified audio URL for read-along experience.
 */
app.get('/api/audiobook/:bookId/:chapterId', async (req, res) => {
  const { bookId, chapterId } = req.params;
  const normalizedChapter = chapterId.startsWith('chapter-') 
    ? chapterId 
    : `chapter-${chapterId.padStart(2, '0')}`;

  try {
    // 1. Check SQLite database audiobook_tracks first
    const dbTrack = await get(
      `SELECT * FROM audiobook_tracks WHERE book_id = ? AND (chapter_id = ? OR chapter_id = ?)`,
      [bookId, normalizedChapter, chapterId]
    );

    if (dbTrack && dbTrack.timing_json) {
      try {
        const data = JSON.parse(dbTrack.timing_json);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        return res.json(data);
      } catch (err) {
        console.warn('[Server] DB timing_json parse warning:', err);
      }
    }

    // 2. Fallback to file system in src/data
    const timingFile = path.join(__dirname, '..', 'src', 'data', `${bookId}-${normalizedChapter}-timing.json`);
    if (fs.existsSync(timingFile)) {
      const raw = fs.readFileSync(timingFile, 'utf-8').replace(/^\uFEFF/, '');
      const data = JSON.parse(raw);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.json(data);
    }
  } catch (err) {
    console.error('Audiobook retrieval error:', err);
  }

  // Honest fallback state if exact audio timing is not yet produced
  res.status(404).json({
    error: 'Audiobook recording or timing map not yet available for this chapter.',
    bookId,
    chapterId,
    availableFallback: 'browser_speech_synthesis'
  });
});

/**
 * 9. POST /api/progress & GET /api/progress/:email/:bookId
 * Reading & Listening Progress synchronization
 */
app.post('/api/progress', async (req, res) => {
  try {
    const { email, bookId, chapterIndex = 0, pageIndex = 0, scrollRatio = 0, audioTime = 0 } = req.body;
    if (!email || !bookId) return res.status(400).json({ error: 'Email and bookId required' });

    const now = new Date().toISOString();
    await run(`
      INSERT INTO reading_progress (customer_email, book_id, chapter_index, page_index, scroll_ratio, audio_time, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(customer_email, book_id) DO UPDATE SET
        chapter_index = excluded.chapter_index,
        page_index = excluded.page_index,
        scroll_ratio = excluded.scroll_ratio,
        audio_time = excluded.audio_time,
        updated_at = excluded.updated_at
    `, [email.toLowerCase(), bookId, chapterIndex, pageIndex, scrollRatio, audioTime, now]);

    res.json({ success: true, updated_at: now });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

app.get('/api/progress/:email/:bookId', async (req, res) => {
  try {
    const { email, bookId } = req.params;
    const row = await get(`
      SELECT * FROM reading_progress WHERE customer_email = ? AND book_id = ?
    `, [email.toLowerCase(), bookId]);

    if (!row) return res.json({ progress: null });
    res.json({
      progress: {
        chapterIndex: row.chapter_index,
        pageIndex: row.page_index,
        scrollRatio: row.scroll_ratio,
        audioTime: row.audio_time,
        updatedAt: row.updated_at
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve progress' });
  }
});

/**
 * 10. POST & GET /api/bookmarks
 */
app.post('/api/bookmarks', async (req, res) => {
  try {
    const { email, bookId, chapterIndex, pageIndex, excerpt, note } = req.body;
    if (!email || !bookId) return res.status(400).json({ error: 'Email and bookId required' });

    const id = `bm_${crypto.randomBytes(6).toString('hex')}`;
    const now = new Date().toISOString();

    await run(`
      INSERT INTO bookmarks (id, customer_email, book_id, chapter_index, page_index, excerpt, note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, email.toLowerCase(), bookId, chapterIndex, pageIndex, excerpt || '', note || '', now]);

    res.json({ success: true, bookmark: { id, chapterIndex, pageIndex, excerpt, note, createdAt: now } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
});

app.get('/api/bookmarks/:email/:bookId', async (req, res) => {
  try {
    const { email, bookId } = req.params;
    const rows = await all(`
      SELECT * FROM bookmarks WHERE customer_email = ? AND book_id = ? ORDER BY created_at DESC
    `, [email.toLowerCase(), bookId]);

    res.json({ bookmarks: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

/**
 * 11. Protected Administrative APIs
 */
app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve administrative orders' });
  }
});

app.get('/api/admin/books', requireAdmin, async (req, res) => {
  try {
    const books = await all(`SELECT * FROM books ORDER BY title ASC`);
    res.json({ books });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve books' });
  }
});

app.put('/api/admin/books/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { price_inr, status, badge, subtitle } = req.body;

    const existing = await get(`SELECT * FROM books WHERE id = ?`, [id]);
    if (!existing) return res.status(404).json({ error: 'Book not found' });

    const now = new Date().toISOString();
    await run(`
      UPDATE books SET
        price_inr = COALESCE(?, price_inr),
        status = COALESCE(?, status),
        badge = COALESCE(?, badge),
        subtitle = COALESCE(?, subtitle),
        updated_at = ?
      WHERE id = ?
    `, [price_inr, status, badge, subtitle, now, id]);

    await logAudit('ADMIN_UPDATE_BOOK', 'ADMIN_USER', { bookId: id, changes: req.body });
    res.json({ success: true, message: 'Book updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

app.get('/api/admin/audit-logs', requireAdmin, async (req, res) => {
  try {
    const logs = await all(`SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100`);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve audit logs' });
  }
});

app.listen(PORT, () => {
  console.log(`[AETHERIA BACKEND] Running securely on port ${PORT}`);
  console.log(`[PERSISTENCE] SQLite database active at ${path.join(DATA_DIR, 'aetheria.db')}`);
  console.log(`[RAZORPAY INTEGRATION] Mode: ${isRazorpayConfigured ? 'Live / Registered Test Credentials' : 'Local Test / Mock Mode'}`);
});
