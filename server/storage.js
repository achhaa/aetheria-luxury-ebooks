import { run, get, all, logAudit } from './db.js';

export async function getAllOrders() {
  try {
    const rows = await all(`SELECT * FROM orders ORDER BY created_at DESC`);
    return rows.map(formatOrderFromRow);
  } catch (err) {
    console.error('Failed to get all orders:', err);
    return [];
  }
}

export async function saveOrder(order) {
  try {
    const now = new Date().toISOString();
    const existing = await get(`SELECT order_id FROM orders WHERE order_id = ?`, [order.orderId]);

    if (existing) {
      await run(`
        UPDATE orders SET
          payment_id = ?,
          signature = ?,
          status = ?,
          customer_name = ?,
          customer_email = ?,
          amount_inr = ?,
          currency = ?,
          items_json = ?,
          download_tokens_json = ?,
          paid_at = ?,
          updated_at = ?
        WHERE order_id = ?
      `, [
        order.paymentId || null,
        order.signature || null,
        order.status || 'CREATED',
        order.customerName || null,
        order.customerEmail || null,
        order.amountINR || 0,
        order.currency || 'INR',
        JSON.stringify(order.items || []),
        JSON.stringify(order.downloadTokens || []),
        order.paidAt || null,
        now,
        order.orderId
      ]);
    } else {
      await run(`
        INSERT INTO orders (
          order_id, payment_id, signature, status, customer_name,
          customer_email, amount_inr, currency, items_json,
          download_tokens_json, created_at, paid_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        order.orderId,
        order.paymentId || null,
        order.signature || null,
        order.status || 'CREATED',
        order.customerName || null,
        order.customerEmail || null,
        order.amountINR || 0,
        order.currency || 'INR',
        JSON.stringify(order.items || []),
        JSON.stringify(order.downloadTokens || []),
        order.createdAt || now,
        order.paidAt || null,
        now
      ]);
    }

    await logAudit('SAVE_ORDER', 'SYSTEM', { orderId: order.orderId, status: order.status });
    return order;
  } catch (err) {
    console.error('Failed to save order to SQLite:', err);
    throw err;
  }
}

export async function findOrderById(orderId) {
  try {
    const row = await get(`SELECT * FROM orders WHERE order_id = ?`, [orderId]);
    return row ? formatOrderFromRow(row) : null;
  } catch (err) {
    console.error('Failed to find order by ID:', err);
    return null;
  }
}

export async function findOrdersByEmail(email) {
  if (!email) return [];
  try {
    const normalized = email.trim().toLowerCase();
    const rows = await all(
      `SELECT * FROM orders WHERE LOWER(customer_email) = ? ORDER BY created_at DESC`,
      [normalized]
    );
    return rows.map(formatOrderFromRow);
  } catch (err) {
    console.error('Failed to find orders by email:', err);
    return [];
  }
}

function formatOrderFromRow(row) {
  let items = [];
  let downloadTokens = [];
  try {
    items = JSON.parse(row.items_json || '[]');
  } catch {}
  try {
    downloadTokens = JSON.parse(row.download_tokens_json || '[]');
  } catch {}

  return {
    orderId: row.order_id,
    paymentId: row.payment_id,
    signature: row.signature,
    status: row.status,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    amountINR: row.amount_inr,
    currency: row.currency,
    items,
    downloadTokens,
    createdAt: row.created_at,
    paidAt: row.paid_at,
    updatedAt: row.updated_at
  };
}
