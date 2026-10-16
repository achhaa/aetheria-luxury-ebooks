import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onProceedCheckout 
}) {
  if (!isOpen) return null;

  const totalINR = cartItems.reduce((acc, item) => acc + item.priceINR, 0);

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md transition-all"
    >
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-md h-full bg-[#0d0f14] border-l border-white/10 shadow-2xl flex flex-col justify-between z-10 animate-fade-in">
        
        {/* Header */}
        <header className="p-6 border-b border-white/10 flex items-center justify-between bg-[#07080a]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
            <h2 className="text-base font-display font-bold text-white tracking-wide">
              YOUR PRIVÉ BAG
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-display font-bold text-white mb-1">
                Your Bag is Empty
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mb-6 font-light">
                Discover our original publications on AI, wealth, cryptography, and leadership—all in INR under ₹500.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#c5a059] text-black font-bold text-xs tracking-wider transition hover:bg-[#d4af37]"
              >
                BROWSE EDITIONS
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id}
                className="flex gap-4 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all"
              >
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-16 h-20 object-cover rounded-lg shadow-md shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#c5a059] tracking-wider block">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      PDF + EPUB Master License
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-bold text-[#c5a059] font-mono">
                      ₹{item.priceINR}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-red-400 transition p-1"
                      title="Remove item"
                      aria-label={`Remove ${item.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-[#07080a] border-t border-white/10 space-y-4">
            <div className="space-y-1.5 text-xs font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} titles)</span>
                <span className="text-slate-200">₹{totalINR}</span>
              </div>
              <div className="flex justify-between text-[11px] text-emerald-400">
                <span>Instant Digital Delivery</span>
                <span>FREE (₹0)</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Investment</span>
                <span className="text-[#c5a059] font-display text-xl">₹{totalINR}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onProceedCheckout(cartItems);
              }}
              className="w-full py-4 rounded-xl bg-[#c5a059] hover:bg-[#d4af37] text-[#07080a] font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(197,160,89,0.35)] flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>PROCEED TO RAZORPAY CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Indian Payment Gateway • 30-Day Guarantee</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
