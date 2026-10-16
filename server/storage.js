import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify({ orders: [] }, null, 2), 'utf-8');
}

export function getAllOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return data.orders || [];
  } catch (err) {
    console.error('Failed to read orders file:', err);
    return [];
  }
}

export function saveOrder(order) {
  const orders = getAllOrders();
  const existingIndex = orders.findIndex((o) => o.orderId === order.orderId);
  if (existingIndex >= 0) {
    orders[existingIndex] = { ...orders[existingIndex], ...order, updatedAt: new Date().toISOString() };
  } else {
    orders.push({ ...order, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  fs.writeFileSync(ORDERS_FILE, JSON.stringify({ orders }, null, 2), 'utf-8');
  return order;
}

export function findOrderById(orderId) {
  const orders = getAllOrders();
  return orders.find((o) => o.orderId === orderId);
}

export function findOrdersByEmail(email) {
  if (!email) return [];
  const normalized = email.trim().toLowerCase();
  const orders = getAllOrders();
  return orders.filter((o) => o.customerEmail && o.customerEmail.trim().toLowerCase() === normalized);
}
