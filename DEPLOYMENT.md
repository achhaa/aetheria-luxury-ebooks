# AETHERIA PRIVÉ EDITIONS — PRODUCTION DEPLOYMENT & COMMERCE GUIDE

This guide details the deployment architecture, environment configuration, free-tier compatibility, and the end-to-end Razorpay production activation checklist.

---

## 1. System Architecture

Aetheria uses a high-performance, decoupled full-stack architecture:
* **Frontend**: React 19 + Tailwind CSS 3.4 + Vite 8. Compiles to static distribution assets (`dist/`).
* **Backend**: Node.js + Express 5 with server-side authoritative catalog, cryptographic HMAC order verification, and on-demand print-grade PDF vector generation via PDFKit.
* **Payment Gateway**: Razorpay Checkout SDK (Indian Rupee INR settlement via UPI, Credit/Debit Cards, NetBanking, and Wallets).
* **Delivery Engine**: Ephemeral 24-hour cryptographic HMAC-signed download tokens (`/api/download/:token`). Downloads are strictly protected and never exposed as public static URLs.

---

## 2. Environment Variables

Store all production secrets in your hosting provider's Secret Manager. **Never commit `.env` to source control.**

| Variable Name | Environment | Description | Example / Default |
| :--- | :--- | :--- | :--- |
| `PORT` | Production | Port for Express backend | `3001` or provided by `$PORT` |
| `VITE_API_BASE` | Frontend | Target API endpoint (if separate from origin) | `""` (relative) or `https://api.yourdomain.com` |
| `RAZORPAY_KEY_ID` | Server | Public Key ID from Razorpay Dashboard | `rzp_test_...` (or `rzp_live_...`) |
| `RAZORPAY_KEY_SECRET` | Server | Secret Key from Razorpay Dashboard | `32-character secret string` |
| `RAZORPAY_WEBHOOK_SECRET` | Server | Secret for validating `x-razorpay-signature` | `Custom secret entered in Webhooks` |
| `DOWNLOAD_TOKEN_SECRET` | Server | Secret used for HMAC-SHA256 download tokens | `Strong 64-char random hex string` |

---

## 3. Free-Tier Deployment Options

### Option A: Unified Full-Stack Container (Recommended: Render / Railway)
Render and Railway allow running the unified Node.js process where Express serves the compiled Vite `dist/` directory alongside `/api` routes on a single port.

* **Render (Free Web Service Tier)**:
  * **Plan**: Free Tier (750 compute hours/month, 512 MB RAM).
  * **Behavior**: Spins down after 15 minutes of inactivity; initial cold boot takes ~30 seconds.
  * **Build Command**: `npm install && npm run build`
  * **Start Command**: `node server/index.js`
* **Storage Consideration**:
  * Free instances use ephemeral filesystems. Order records in `server/data/orders.json` reset on restart unless attached to a persistent disk or connected to a free cloud database (e.g., Neon Postgres / Supabase).

### Option B: Decoupled (Vercel Frontend + Render / Railway Backend)
* **Frontend (Vercel Hobby Plan)**:
  * **Cost**: 100% Free for personal/commercial web apps.
  * **Configuration**: Set Root Directory to `./`, Build Command `npm run build`, Output Directory `dist`.
  * Set `VITE_API_BASE=https://your-backend.onrender.com`.
* **Backend**:
  * Host Express server on Render / Railway with environment variables.

---

## 4. Razorpay Production Activation Checklist

To transition from Test Mode (`rzp_test_`) to Live Payments (`rzp_live_`):

1. **Merchant KYC**:
   * Complete business verification and bank account verification on [Razorpay Dashboard](https://dashboard.razorpay.com).
   * Submit business registration documents, PAN, and cancelled cheque.
2. **Generate Live Keys**:
   * Switch the toggle in the Razorpay Dashboard header from **Test Mode** to **Live Mode**.
   * Navigate to **Settings > API Keys > Generate Key**.
   * Copy the `Key ID` (`rzp_live_...`) and `Key Secret`.
   * Immediately update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in your server environment variables.
3. **Configure Webhooks**:
   * Navigate to **Settings > Webhooks > Add New Webhook**.
   * **Webhook URL**: `https://your-domain.com/api/webhook`
   * **Secret**: Enter a secure passphrase and set as `RAZORPAY_WEBHOOK_SECRET`.
   * **Active Events**:
     * `payment.captured`
     * `order.paid`
     * `payment.failed`
     * `refund.processed`
4. **End-to-End Live Verification**:
   * Perform a test acquisition of ₹199 (*The Stoic Sovereign*) using a real UPI ID or card.
   * Verify signature validation passes and order updates to `PAID`.
   * Verify download token generates and vector PDF streams successfully.
   * Test refund functionality via Razorpay Dashboard to confirm automatic webhook handling.

---

## 5. Storage & Database Migration Guide

Currently, orders are recorded in `server/data/orders.json` with idempotent upsert capabilities.

For high-scale multi-region deployments:
1. Swap `server/storage.js` functions (`saveOrder`, `findOrderById`, `findOrdersByEmail`) with queries to a PostgreSQL or SQLite database:
```sql
CREATE TABLE orders (
  order_id VARCHAR(64) PRIMARY KEY,
  receipt VARCHAR(64) NOT NULL,
  amount_paise INT NOT NULL,
  amount_inr NUMERIC(10,2) NOT NULL,
  currency VARCHAR(8) DEFAULT 'INR',
  status VARCHAR(32) NOT NULL,
  customer_name VARCHAR(128),
  customer_email VARCHAR(128) NOT NULL,
  items JSONB NOT NULL,
  payment_id VARCHAR(64),
  signature VARCHAR(128),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX idx_orders_customer_email ON orders(customer_email);
```
2. Free PostgreSQL services:
   * **Neon.tech**: Free tier includes 0.5 GB storage and auto-suspend compute.
   * **Supabase**: Free tier includes 500 MB database and 1 GB file storage.
