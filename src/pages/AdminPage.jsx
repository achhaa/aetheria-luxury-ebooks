import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, DollarSign, BookOpen, Clock, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem('aetheria_admin_key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('books'); // 'books', 'orders', 'audit'

  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Editing state
  const [editingBook, setEditingBook] = useState(null);

  // Authenticate & Fetch
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!adminKey) return;

    setIsLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/books', {
        headers: { 'x-admin-key': adminKey }
      });

      if (!res.ok) {
        throw new Error('Invalid administrative key or unauthorized access.');
      }

      const data = await res.json();
      setBooks(data.books || []);
      setIsAuthenticated(true);
      localStorage.setItem('aetheria_admin_key', adminKey);

      // Also fetch orders and audit logs
      fetchOrders();
      fetchAuditLogs();
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'x-admin-key': adminKey }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {}
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: { 'x-admin-key': adminKey }
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch {}
  };

  useEffect(() => {
    if (adminKey) {
      handleLogin();
    }
  }, []);

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    if (!editingBook) return;

    try {
      const res = await fetch(`/api/admin/books/${editingBook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({
          price_inr: Number(editingBook.price_inr),
          status: editingBook.status,
          badge: editingBook.badge,
          subtitle: editingBook.subtitle
        })
      });

      if (!res.ok) throw new Error('Failed to update book');

      setUpdateSuccess(`Successfully updated ${editingBook.title}`);
      setEditingBook(null);
      setTimeout(() => setUpdateSuccess(''), 3000);
      handleLogin();
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-[#f5f5f7] min-h-screen py-24 flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-black/10 shadow-lg text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#1d1d1f] flex items-center justify-center text-white mx-auto shadow-md">
            <Lock className="w-7 h-7 text-[#c5a059]" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1d1d1f]">
              Administrative Console
            </h1>
            <p className="text-xs text-[#6e6e73] font-mono mt-1">
              Restricted access. Server-side key authorization required.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              required
              placeholder="Enter administrative master key..."
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-black/10 rounded-xl px-4 py-3 text-xs font-mono text-[#1d1d1f] focus:outline-none focus:border-[#997328]"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-mono text-xs font-bold tracking-wider transition shadow-sm"
            >
              {isLoading ? 'AUTHENTICATING...' : 'AUTHORIZE SESSION'}
            </button>
          </form>

          {authError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
              {authError}
            </div>
          )}

          <div className="text-[10px] font-mono text-[#86868b]">
            Default test key: <code className="bg-gray-100 px-1 py-0.5 rounded">aetheria-admin-secret-2026</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 text-[#1d1d1f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-black/10 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#997328] font-bold">
                AETHERIA MANAGEMENT SUITE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1d1d1f] mt-1">
              Editorial & Commercial Governance
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchOrders();
                fetchAuditLogs();
                handleLogin();
              }}
              className="p-2 rounded-lg border border-black/10 hover:bg-gray-50 text-xs font-mono flex items-center gap-1.5"
              title="Refresh Records"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#997328]" />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => {
                setIsAuthenticated(false);
                setAdminKey('');
                localStorage.removeItem('aetheria_admin_key');
              }}
              className="px-3 py-1.5 rounded-lg border border-black/10 hover:bg-red-50 text-red-700 text-xs font-mono"
            >
              Log Out
            </button>
          </div>
        </div>

        {updateSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{updateSuccess}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex border-b border-black/10 mb-8 space-x-6 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('books')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'books' ? 'border-[#997328] text-[#1d1d1f]' : 'border-transparent text-[#6e6e73]'
            }`}
          >
            Books & Pricing ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'orders' ? 'border-[#997328] text-[#1d1d1f]' : 'border-transparent text-[#6e6e73]'
            }`}
          >
            Real Transactions ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'audit' ? 'border-[#997328] text-[#1d1d1f]' : 'border-transparent text-[#6e6e73]'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
        </div>

        {/* Tab 1: Books Management */}
        {activeTab === 'books' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {books.map((b) => (
                <div 
                  key={b.id}
                  className="p-5 rounded-2xl bg-[#f5f5f7] border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={b.cover_image || `/assets/covers/${b.id}.jpg`} 
                      alt={b.title} 
                      className="w-12 aspect-[2/3] object-cover rounded shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-serif font-bold text-[#1d1d1f]">{b.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          b.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#6e6e73] font-mono mt-0.5">
                        Author: {b.author} • Category: {b.category}
                      </p>
                      <span className="text-xs font-mono text-[#997328] font-bold mt-1 inline-block">
                        Active Price: ₹{b.price_inr}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingBook(b)}
                    className="px-4 py-2 rounded-xl bg-white border border-black/10 hover:border-black/20 text-xs font-mono font-bold transition shadow-xs"
                  >
                    Configure
                  </button>
                </div>
              ))}
            </div>

            {/* Edit Modal */}
            {editingBook && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <div className="w-full max-w-lg p-6 rounded-3xl bg-white border border-black/10 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-black/10">
                    <h3 className="font-serif font-bold text-lg">Configure: {editingBook.title}</h3>
                    <button onClick={() => setEditingBook(null)} className="text-xs font-mono">Close</button>
                  </div>

                  <form onSubmit={handleUpdateBook} className="space-y-4 text-xs font-mono">
                    <div>
                      <label className="block text-[#6e6e73] mb-1">Authoritative Price (INR):</label>
                      <input
                        type="number"
                        min="99"
                        max="499"
                        value={editingBook.price_inr}
                        onChange={(e) => setEditingBook({ ...editingBook, price_inr: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-black/10 font-bold"
                      />
                      <span className="text-[10px] text-[#86868b]">Must remain under ₹500 in accordance with brand pricing policy.</span>
                    </div>

                    <div>
                      <label className="block text-[#6e6e73] mb-1">Publication Status:</label>
                      <select
                        value={editingBook.status}
                        onChange={(e) => setEditingBook({ ...editingBook, status: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-black/10"
                      >
                        <option value="published">Published</option>
                        <option value="in_review">In Review</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#6e6e73] mb-1">Badge Label:</label>
                      <input
                        type="text"
                        value={editingBook.badge}
                        onChange={(e) => setEditingBook({ ...editingBook, badge: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-black/10"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-bold tracking-wider mt-4"
                    >
                      SAVE CHANGES TO PERSISTENT DATABASE
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-[#86868b] bg-[#f5f5f7] rounded-2xl">
                No transactions recorded in database yet.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.orderId} className="p-4 rounded-xl border border-black/10 bg-[#f5f5f7] text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1d1d1f]">{o.orderId}</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        o.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {o.status} (₹{o.amountINR})
                      </span>
                    </div>
                    <div className="text-[#6e6e73]">
                      Customer: {o.customerName} ({o.customerEmail})
                    </div>
                    <div className="text-[10px] text-[#86868b]">
                      Created: {new Date(o.createdAt).toLocaleString()} • Items: {(o.items || []).map(i => i.title).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Audit Trail */}
        {activeTab === 'audit' && (
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-lg border border-black/5 bg-[#f5f5f7] text-[11px] font-mono flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1d1d1f] mr-2">[{log.action}]</span>
                  <span className="text-[#6e6e73]">{log.actor}: {log.details}</span>
                </div>
                <span className="text-[#86868b] text-[10px] shrink-0 ml-4">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
