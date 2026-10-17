import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingBag, Trash2, ArrowRight, ArrowLeft, 
  ShieldCheck, Lock, Sparkles, Tag, Plus 
} from 'lucide-react';
import { BOOKS_DATA } from '../data/booksData';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onAddItem,
  onProceedCheckout 
}) {
  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotalINR = cartItems.reduce((acc, item) => acc + item.priceINR, 0);

  // Calculate discount
  let discountAmountINR = 0;
  if (appliedPromo) {
    discountAmountINR = Math.round(subtotalINR * appliedPromo.discountPercent / 100);
  }
  const finalTotalINR = Math.max(0, subtotalINR - discountAmountINR);

  // Apply promo code handler
  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'AETHERIA10') {
      setAppliedPromo({ code: 'AETHERIA10', discountPercent: 10, label: 'Patron 10% Off' });
      setPromoError('');
    } else if (code === 'PRIVEE20') {
      setAppliedPromo({ code: 'PRIVEE20', discountPercent: 20, label: 'Privé 20% Off' });
      setPromoError('');
    } else {
      setPromoError('Invalid voucher code. Try AETHERIA10 or PRIVEE20.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  // Find complementary recommendation (first book not in cart)
  const cartIds = new Set(cartItems.map((b) => b.id));
  const suggestedBook = BOOKS_DATA.find((b) => !cartIds.has(b.id));

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all animate-fade-in"
    >
      {/* Click outside backdrop */}
      <div className="flex-1 cursor-pointer" onClick={onClose} title="Click to dismiss (Esc)" />

      {/* Drawer Container */}
      <div className="w-full max-w-md h-full bg-white dark:bg-[#14161a] border-l border-black/10 dark:border-white/10 shadow-2xl flex flex-col justify-between z-10 text-[#1d1d1f] dark:text-[#f5f5f7]">
        
        {/* Header with prominent Back / Exit button */}
        <header className="p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-inherit">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="p-1 -ml-1 rounded-lg text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition mr-1 cursor-pointer"
              title="Back / Close Bag"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
            <h2 className="text-base font-serif font-bold tracking-wide">
              YOUR PRIVÉ BAG
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-[#1c1f26] border border-black/5 dark:border-white/5 opacity-80">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/10 hover:border-black/20 text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center gap-1 text-xs font-mono cursor-pointer"
            aria-label="Close bag"
            title="Dismiss & Exit (Esc)"
          >
            <span>Exit</span>
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-70">
              <div className="w-16 h-16 rounded-full bg-[#f5f5f7] dark:bg-[#1c1f26] flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="text-base font-serif font-bold mb-1">
                Your Bag is Empty
              </h3>
              <p className="text-xs max-w-xs mb-6 font-sans opacity-80">
                Discover our original publications on AI, strategy, cryptography, and leadership—all in INR under ₹500.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#1d1d1f] hover:bg-black dark:bg-[#c5a059] dark:hover:bg-[#d4af37] text-white dark:text-black font-bold text-xs tracking-wider transition shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BROWSE EDITIONS</span>
              </button>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#1c1f26] border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all"
                >
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded-lg shadow-xs shrink-0 border border-black/10 dark:border-white/10"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#c5a059] tracking-wider block font-bold">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-serif font-bold truncate leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[10px] opacity-70 font-mono block mt-0.5">
                        PDF + EPUB Master License
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-bold font-mono text-[#c5a059]">
                        ₹{item.priceINR}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="opacity-60 hover:opacity-100 hover:text-red-500 transition p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Complementary Recommendation ("Complete Your Atelier") */}
              {suggestedBook && onAddItem && (
                <div className="p-3.5 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 space-y-2 mt-4">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#997328] dark:text-[#c5a059]">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      COMPLETE YOUR COLLECTION
                    </span>
                    <span>₹{suggestedBook.priceINR}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h5 className="text-xs font-serif font-bold truncate">
                        {suggestedBook.title}
                      </h5>
                      <span className="text-[10px] font-mono opacity-70 block">
                        {suggestedBook.author} • {suggestedBook.pages} pages
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddItem(suggestedBook)}
                      className="px-3 py-1.5 rounded-lg bg-[#1d1d1f] dark:bg-[#c5a059] text-white dark:text-black font-mono font-bold text-[10px] flex items-center gap-1 hover:scale-105 active:scale-95 transition shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>ADD</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Promo Code Input Box */}
              <div className="pt-2">
                {appliedPromo ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedPromo.code} ({appliedPromo.discountPercent}% OFF)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[#6e6e73] hover:text-red-500 p-1 cursor-pointer"
                      title="Remove voucher"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Patron code (e.g. AETHERIA10)..."
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-[#f5f5f7] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono placeholder-[#86868b] focus:outline-none focus:border-[#c5a059]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-white/5 hover:border-[#c5a059] text-xs font-mono font-bold transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <span className="text-[10px] text-red-500 font-mono mt-1 block">
                    {promoError}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Summary with Prominent Back Control */}
        {cartItems.length > 0 && (
          <footer className="p-6 border-t border-black/10 dark:border-white/10 bg-[#f5f5f7] dark:bg-[#101216] space-y-4">
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between opacity-70">
                <span>Catalogue Subtotal:</span>
                <span>₹{subtotalINR}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Patron Privilege ({appliedPromo.code}):</span>
                  <span>-₹{discountAmountINR}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Direct Digital Delivery:</span>
                <span>FREE (Instant)</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-black/10 dark:border-white/10">
                <span>Final Settlement (INR):</span>
                <span className="text-[#c5a059]">₹{finalTotalINR}</span>
              </div>
            </div>

            <button
              onClick={() => onProceedCheckout(cartItems)}
              className="w-full py-4 rounded-xl bg-[#1d1d1f] hover:bg-black dark:bg-[#c5a059] dark:hover:bg-[#d4af37] text-white dark:text-black font-bold text-xs tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#c5a059] dark:text-black" />
              <span>PROCEED TO RAZORPAY CHECKOUT — ₹{finalTotalINR}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Prominent Dismiss / Back Control */}
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 text-inherit font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>CONTINUE BROWSING / BACK</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] opacity-60 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>256-Bit Encrypted Settlement • 30-Day Digital Policy</span>
            </div>
          </footer>
        )}

      </div>
    </div>
  );
}
