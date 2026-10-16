import React, { useState } from 'react';
import { 
  X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, 
  Sparkles, Tag, Check, Gift 
} from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onProceedCheckout, 
  currency = '$', 
  currencyRate = 1 
}) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount }
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'VIP20') {
      setAppliedCoupon({ code: 'VIP20', discount: 0.20, label: 'VIP Reader 20% Off' });
    } else if (code === 'MASTER30') {
      setAppliedCoupon({ code: 'MASTER30', discount: 0.30, label: 'Executive Mastery 30% Off' });
    } else {
      setCouponError('Invalid VIP code. Try VIP20');
    }
  };

  const rawSubtotalUSD = cartItems.reduce((acc, item) => acc + item.priceUSD, 0);
  
  // Bundle discount: If >= 2 books, give automatic 15% discount; if >= 3 books, give 25% discount
  let bundleDiscountPercent = 0;
  if (cartItems.length >= 3) {
    bundleDiscountPercent = 0.25;
  } else if (cartItems.length === 2) {
    bundleDiscountPercent = 0.15;
  }

  const effectiveDiscountPercent = Math.max(bundleDiscountPercent, appliedCoupon ? appliedCoupon.discount : 0);
  const discountAmountUSD = rawSubtotalUSD * effectiveDiscountPercent;
  const finalTotalUSD = Math.max(0, rawSubtotalUSD - discountAmountUSD);

  const formatPrice = (usd) => `${currency}${(usd * currencyRate).toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md transition-all">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-over panel */}
      <div className="w-full max-w-md h-full bg-obsidian-900 border-l border-white/10 shadow-2xl flex flex-col justify-between z-10 animate-fade-in">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-gold-400" />
            <h2 className="text-lg font-display font-bold text-white tracking-wide">
              YOUR PRIVÉ BAG
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bundle Tier Progress Bar */}
        <div className="px-6 py-3 bg-obsidian-950/80 border-b border-white/5">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-gold-400 flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" />
              {cartItems.length >= 3
                ? '🌟 MAXIMUM BUNDLE DISCOUNT (25% OFF) UNLOCKED!'
                : cartItems.length === 2
                ? 'Add 1 more e-book for 25% OFF library tier'
                : 'Add 1 more e-book for 15% OFF bundle tier'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-obsidian-800 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-gold-500 to-amber-300 transition-all duration-500"
              style={{ width: `${Math.min(100, (cartItems.length / 3) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-display font-bold text-slate-200 mb-1">
                Your Bag is Empty
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mb-6 font-light">
                Explore our curated digital boutique to discover transformative editions on AI, Wealth, and Strategy.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs tracking-wider shadow-lg hover:scale-105 transition"
              >
                EXPLORE EDITIONS
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id}
                className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/20 transition-all group"
              >
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-16 h-20 object-cover rounded-lg shadow-md shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gold-400 tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 block font-light">
                      Interactive 3D + PDF + EPUB + Audio
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-bold text-gold-400 font-mono">
                      {formatPrice(item.priceUSD)}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-red-400 transition p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Coupon & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-obsidian-950 border-t border-white/10 space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="VIP Promo Code (e.g. VIP20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none focus:border-gold-500/50 uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-gold-500 hover:text-obsidian-950 text-slate-300 font-mono text-xs font-semibold transition"
              >
                APPLY
              </button>
            </form>

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  {appliedCoupon.label}
                </span>
                <button 
                  onClick={() => setAppliedCoupon(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {couponError && (
              <p className="text-[11px] font-mono text-red-400">
                {couponError}
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-200">{formatPrice(rawSubtotalUSD)}</span>
              </div>
              {effectiveDiscountPercent > 0 && (
                <div className="flex justify-between text-gold-400">
                  <span>Exclusive Privilege Discount ({Math.round(effectiveDiscountPercent * 100)}%)</span>
                  <span>-{formatPrice(discountAmountUSD)}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Digital Delivery Fee</span>
                <span className="text-emerald-400">COMPLIMENTARY ($0.00)</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Investment</span>
                <span className="text-gold-400 font-display text-lg">{formatPrice(finalTotalUSD)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onProceedCheckout({
                  items: cartItems,
                  subtotalUSD: rawSubtotalUSD,
                  discountUSD: discountAmountUSD,
                  totalUSD: finalTotalUSD,
                  coupon: appliedCoupon
                });
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-300 text-obsidian-950 font-bold text-xs tracking-wider shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>PROCEED TO SOVEREIGN CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit Encrypted • Instant Lifetime Download</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
