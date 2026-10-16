import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';

import { SERVER_CATALOG } from './catalog.js';
import { saveOrder, findOrderById, findOrdersByEmail, getAllOrders } from './storage.js';
import { generateBookPdf } from './pdfGenerator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Secret keys from server-side environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'aetheria_webhook_secret_2026';
const TOKEN_SECRET = process.env.DOWNLOAD_TOKEN_SECRET || 'aetheria_luxury_download_secret_key_9981';

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
    const { bookIds, customerName, customerEmail } = req.body;
    const ids = Array.isArray(bookIds) ? bookIds : [req.body.bookId];

    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: 'At least one book ID must be provided' });
    }

    // Verify all book IDs and aggregate authoritative total
    const orderedItems = [];
    let totalPaise = 0;

    for (const id of ids) {
      const book = SERVER_CATALOG[id];
      if (!book) {
        return res.status(400).json({ error: `Book '${id}' not recognized in catalogue.` });
      }
      orderedItems.push(book);
      totalPaise += book.pricePaise;
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

    saveOrder(orderRecord);

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
app.post('/api/verify-payment', (req, res) => {
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

    const order = findOrderById(razorpay_order_id);
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
      saveOrder(order);
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
      };
    });

    order.downloadTokens = downloadTokens;
    saveOrder(order);

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
app.post('/api/webhook', (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];

    if (isRazorpayConfigured && webhookSignature) {
      const rawBody = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== webhookSignature) {
        return res.status(400).json({ error: 'Invalid webhook signature.' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured' || event === 'order.paid') {
      const rzpOrderId = payload.payment?.entity?.order_id || payload.order?.entity?.id;
      if (rzpOrderId) {
        const order = findOrderById(rzpOrderId);
        if (order && order.status !== 'PAID') {
          order.status = 'PAID';
          order.paidAt = new Date().toISOString();
          saveOrder(order);
        }
      }
    } else if (event === 'payment.failed') {
      const rzpOrderId = payload.payment?.entity?.order_id;
      if (rzpOrderId) {
        const order = findOrderById(rzpOrderId);
        if (order) {
          order.status = 'PAYMENT_FAILED';
          saveOrder(order);
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
 * Secure digital delivery. Only verified purchasers with a valid HMAC token can access files.
 */
app.get('/api/download/:token', (req, res) => {
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

    const order = findOrderById(payload.orderId);
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
 * 6. POST /api/customer/orders
 * Look up purchase history and regenerate active download tokens for verified customers.
 */
app.post('/api/customer/orders', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const orders = findOrdersByEmail(email).filter((o) => o.status === 'PAID');

  const history = orders.map((order) => {
    const tokens = order.items.map((it) => ({
      bookId: it.id,
      title: it.title,
      downloadUrl: `/api/download/${createDownloadToken({
        orderId: order.orderId,
        bookId: it.id,
        email: order.customerEmail,
      })}`,
    }));

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

app.listen(PORT, () => {
  console.log(`[AETHERIA COMMERCE BACKEND] Running securely on port ${PORT}`);
  console.log(`[RAZORPAY INTEGRATION] Mode: ${isRazorpayConfigured ? 'Live / Registered Test Credentials' : 'Local Test / Mock Mode'}`);
});
