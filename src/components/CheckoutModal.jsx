import React, { useState } from 'react';
import { 
  X, CheckCircle, ShieldCheck, Download, Sparkles, 
  CreditCard, Smartphone, Coins, Lock, ArrowRight, BookOpen, FileText, Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime } from '../utils/audioSynthesis';

export default function CheckoutModal({ 
  orderData, 
  isOpen, 
  onClose, 
  onOrderSuccess, 
  currency = '$', 
  currencyRate = 1 
}) {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'apple', 'crypto'
  const [email, setEmail] = useState('executive.reader@domain.com');
  const [name, setName] = useState('Alexander Sterling');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({});

  if (!isOpen || !orderData) return null;

  const formatPrice = (usd) => `${currency}${(usd * currencyRate).toFixed(2)}`;

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      playSuccessChime();

      // Launch luxury gold & cyan confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#fde68a', '#06b6d4', '#ffffff', '#8b5cf6']
      });

      if (onOrderSuccess) onOrderSuccess();
    }, 1400);
  };

  const handleDownloadFile = (bookTitle, format) => {
    setDownloadProgress((prev) => ({ ...prev, [`${bookTitle}-${format}`]: true }));
    
    setTimeout(() => {
      const fileData = `
=====================================================
AETHERIA PRIVÉ DIGITAL CERTIFICATE & ACCESS KEY
=====================================================
Order ID: AE-${Math.floor(100000 + Math.random() * 900000)}
Licensed To: ${name} (${email})
Edition: ${bookTitle} [Format: ${format}]
Verification Hash: sha256:0x${Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')}

DRM-FREE LIFETIME LICENSE:
This master vector package contains the full unabridged publication, high-resolution architectural schematics, interactive code sandboxes, and full studio audio narration.
      `.trim();

      const blob = new Blob([fileData], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bookTitle.replace(/\s+/g, '-').toLowerCase()}-${format.toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadProgress((prev) => ({ ...prev, [`${bookTitle}-${format}`]: false }));
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel-gold border border-gold-500/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden animate-fade-in my-8">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-gold-400" />
            <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-wide">
              {isSuccess ? 'ACQUISITION CONFIRMED' : 'SECURE SOVEREIGN CHECKOUT'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isSuccess ? (
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
            
            {/* Order Items Preview */}
            <div className="p-4 rounded-xl bg-obsidian-950/70 border border-white/5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-bold block">
                ORDER SUMMARY ({orderData.items.length} TITLES)
              </span>
              <div className="divide-y divide-white/5 text-xs">
                {orderData.items.map((it) => (
                  <div key={it.id} className="py-2 flex justify-between items-center text-slate-200">
                    <span className="truncate max-w-xs">{it.title}</span>
                    <span className="font-mono text-gold-400 font-bold shrink-0">
                      {formatPrice(it.priceUSD)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline text-sm font-bold text-white">
                <span>Total Due:</span>
                <span className="text-gold-400 font-display text-lg">
                  {formatPrice(orderData.totalUSD)}
                </span>
              </div>
            </div>

            {/* Buyer Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">
                  DELIVERY EMAIL (FOR DIGITAL VAULT)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-[11px] font-mono text-slate-300 block mb-2">
                SETTLEMENT METHOD
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs font-mono ${
                    paymentMethod === 'card'
                      ? 'bg-gold-500/20 border-gold-400 text-gold-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>CREDIT CARD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs font-mono ${
                    paymentMethod === 'apple'
                      ? 'bg-gold-500/20 border-gold-400 text-gold-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>APPLE / GOOGLE</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs font-mono ${
                    paymentMethod === 'crypto'
                      ? 'bg-gold-500/20 border-gold-400 text-gold-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  <span>USDC / CRYPTO</span>
                </button>
              </div>
            </div>

            {/* Simulated Card Inputs */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 p-4 rounded-xl bg-black/20 border border-white/5">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">CARD NUMBER</label>
                  <input
                    type="text"
                    defaultValue="•••• •••• •••• 4092"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">EXPIRY</label>
                    <input
                      type="text"
                      defaultValue="08/29"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">CVC / CVV</label>
                    <input
                      type="password"
                      defaultValue="889"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs font-mono text-cyan-300 space-y-2">
                <span className="font-bold block">⚡ Sovereign Web3 Settlement</span>
                <p className="text-[11px] opacity-80">
                  Instant smart contract verification on Ethereum / Arbitrum. Zero transaction fees.
                </p>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-300 text-obsidian-950 font-bold text-xs tracking-wider shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.7)] transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin" />
                  <span>AUTHORIZING SOVEREIGN TRANSACTION...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>COMPLETE ACQUISITION — {formatPrice(orderData.totalUSD)}</span>
                </>
              )}
            </button>

            <p className="text-center text-[10px] font-mono text-slate-400">
              🔒 100% Satisfaction Guarantee • DRM-Free Digital Assets • Instant Delivery
            </p>
          </form>
        ) : (
          /* Instant Download Portal */
          <div className="p-6 sm:p-8 space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                Acquisition Complete, {name}!
              </h3>
              <p className="text-xs text-slate-300 font-light max-w-md mx-auto">
                Your credentials have been authenticated. All digital master assets, vector PDFs, and audio recordings are now unlocked in your digital atelier.
              </p>
            </div>

            {/* List of Downloadable Deliverables */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase text-gold-400 font-bold block">
                DOWNLOAD YOUR MASTER ASSETS (LIFETIME ACCESS):
              </span>

              {orderData.items.map((book) => (
                <div 
                  key={book.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-10 h-14 object-cover rounded shadow border border-white/10" 
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{book.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {book.pages} Pages • Unabridged First Edition
                      </span>
                    </div>
                  </div>

                  {/* Format Download Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleDownloadFile(book.title, 'Vector-PDF')}
                      className="px-3 py-2 rounded-lg bg-obsidian-900 border border-white/10 hover:border-gold-400 text-slate-300 hover:text-white text-xs font-mono flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3 h-3 text-gold-400" /> PDF Master
                      </span>
                      <Download className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => handleDownloadFile(book.title, 'Kindle-EPUB')}
                      className="px-3 py-2 rounded-lg bg-obsidian-900 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white text-xs font-mono flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3 text-cyan-400" /> Kindle EPUB
                      </span>
                      <Download className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => handleDownloadFile(book.title, 'Audio-Master')}
                      className="px-3 py-2 rounded-lg bg-obsidian-900 border border-white/10 hover:border-purple-400 text-slate-300 hover:text-white text-xs font-mono flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <Headphones className="w-3 h-3 text-purple-400" /> Audio (.M4B)
                      </span>
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs tracking-wider hover:bg-gold-400 transition"
            >
              RETURN TO ATELIER
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
