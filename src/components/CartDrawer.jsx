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
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-all animate-fade-in"
    >
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-md h-full bg-white border-l border-black/10 shadow-2xl flex flex-col justify-between z-10 text-[#1d1d1f]">
        
        {/* Header */}
        <header className="p-6 border-b border-black/10 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#997328]" />
            <h2 className="text-base font-serif font-bold text-[#1d1d1f] tracking-wide">
              YOUR PRIVÉ BAG
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#6e6e73] border border-black/5">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-gray-100 transition"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#6e6e73]">
              <div className="w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-4 text-[#86868b]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#1d1d1f] mb-1">
                Your Bag is Empty
              </h3>
              <p className="text-xs text-[#6e6e73] max-w-xs mb-6 font-sans">
                Discover our original publications on AI, strategy, cryptography, and leadership—all in INR under ₹500.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#1d1d1f] text-white font-bold text-xs tracking-wider transition hover:bg-black shadow-xs"
              >
                BROWSE EDITIONS
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id}
                className="flex gap-4 p-3.5 rounded-xl bg-[#f5f5f7] border border-black/5 hover:border-black/10 transition-all"
              >
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-16 h-20 object-cover rounded-lg shadow-xs shrink-0 border border-black/10"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#997328] tracking-wider block font-bold">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-serif font-bold text-[#1d1d1f] truncate leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-[#6e6e73] font-mono block mt-0.5">
                      PDF + EPUB Master License
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-bold text-[#1d1d1f] font-mono">
                      ₹{item.priceINR}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#86868b] hover:text-red-600 transition p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <footer className="p-6 border-t border-black/10 bg-[#f5f5f7] space-y-4">
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-[#6e6e73]">
                <span>Catalogue Total:</span>
                <span>₹{totalINR}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Direct Digital Delivery:</span>
                <span>FREE (Instant)</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1d1d1f] pt-2 border-t border-black/10">
                <span>Final Settlement (INR):</span>
                <span>₹{totalINR}</span>
              </div>
            </div>

            <button
              onClick={() => onProceedCheckout(cartItems)}
              className="w-full py-4 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-bold text-xs tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Lock className="w-4 h-4 text-[#c5a059]" />
              <span>PROCEED TO RAZORPAY CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#86868b] font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>256-Bit Encrypted Settlement • 30-Day Digital Policy</span>
            </div>
          </footer>
        )}

      </div>
    </div>
  );
}
