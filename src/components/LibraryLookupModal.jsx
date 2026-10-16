import React, { useState } from 'react';
import { X, Download, ShieldCheck, FileText, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function LibraryLookupModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orders, setOrders] = useState(null);

  if (!isOpen) return null;

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage('');
    setOrders(null);

    try {
      const res = await fetch('/api/customer/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error('Failed to retrieve customer records.');
      }

      const data = await res.json();
      setOrders(data.orders || []);
      setIsLoading(false);
    } catch (err) {
      setErrorMessage(err.message || 'Lookup failed. Please verify your email.');
      setIsLoading(false);
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="My Digital Library"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0c0e14] border border-white/10 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <header className="p-6 border-b border-white/10 flex items-center justify-between bg-[#07080a]">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-[#c5a059]" />
            <h2 className="text-base font-display font-bold text-white tracking-wide">
              MY SOVEREIGN LIBRARY & DOWNLOAD VAULT
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Close library"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-xs text-slate-300 font-light leading-relaxed">
            Enter the email address used during Razorpay checkout. The server will verify your paid licenses and issue fresh, cryptographic 24-hour expiring download links.
          </p>

          <form onSubmit={handleLookup} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="Enter your customer email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 focus:border-[#c5a059] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 rounded-xl bg-[#c5a059] hover:bg-[#d4af37] text-black font-bold text-xs tracking-wider transition shrink-0 flex items-center gap-1.5"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>RETRIEVE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Results */}
          {orders !== null && (
            <div className="space-y-4 pt-2">
              {orders.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/5 text-center text-xs text-slate-400 font-mono">
                  No verified purchases found for this email. Check spelling or contact support@aetheria.com.
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase text-[#c5a059] font-bold block">
                    FOUND {orders.length} VERIFIED {orders.length === 1 ? 'TRANSACTION' : 'TRANSACTIONS'}:
                  </span>

                  {orders.map((order) => (
                    <div key={order.orderId} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 pb-2 border-b border-white/5">
                        <span>Order: {order.orderId}</span>
                        <span className="text-emerald-400 font-bold">VERIFIED PAID (₹{order.amountINR})</span>
                      </div>

                      <div className="space-y-2">
                        {order.downloads.map((dl) => (
                          <div key={dl.bookId} className="flex items-center justify-between gap-3 text-xs">
                            <span className="text-white font-medium truncate">{dl.title}</span>
                            <a
                              href={dl.downloadUrl}
                              download
                              className="px-3 py-1.5 rounded-lg bg-[#c5a059] text-black text-[11px] font-mono font-bold flex items-center gap-1 hover:bg-[#d4af37] transition shrink-0"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download PDF</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
