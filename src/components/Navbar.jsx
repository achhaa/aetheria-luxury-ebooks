import React, { useState } from 'react';
import { 
  BookOpen, ShoppingBag, Volume2, VolumeX, Search, 
  Sparkles, Globe, Compass, ShieldCheck, HelpCircle
} from 'lucide-react';

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  isAudioOn, 
  onToggleAudio, 
  currency, 
  onCurrencyChange, 
  searchQuery, 
  onSearchChange,
  onOpenPremiumGuide 
}) {
  const [showSearch, setShowSearch] = useState(false);

  const currencies = [
    { code: 'USD', symbol: '$', rate: 1 },
    { code: 'EUR', symbol: '€', rate: 0.92 },
    { code: 'GBP', symbol: '£', rate: 0.79 },
    { code: 'JPY', symbol: '¥', rate: 155 },
    { code: 'INR', symbol: '₹', rate: 84 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-obsidian-950/70 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Monogram & Title */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 via-amber-500 to-yellow-600 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-5 h-5 text-obsidian-950" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-wider gold-gradient-text block leading-none">
                AETHERIA
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-300 block mt-1">
                Privé Editions
              </span>
            </div>
          </a>
        </div>

        {/* Center Search / Categories bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, thesis, or author..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 hover:border-gold-500/40 focus:border-gold-400 rounded-full pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all"
            />
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Suggestions / Strategic Roadmap Button */}
          <button
            onClick={onOpenPremiumGuide}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 text-xs font-mono transition-all animate-pulse-glow"
            title="Inspect Executive Suggestions to Make Website Ultra-Premium"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>PREMIUM BLUEPRINT</span>
          </button>

          {/* Currency Switcher */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 transition">
              <Globe className="w-3.5 h-3.5 text-gold-400" />
              <span>{currency.code} ({currency.symbol})</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-36 py-2 rounded-xl glass-panel-gold border border-gold-500/30 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all shadow-2xl z-50">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => onCurrencyChange(c)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-mono flex items-center justify-between hover:bg-white/10 ${
                    currency.code === c.code ? 'text-gold-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  <span>{c.code}</span>
                  <span className="text-slate-300">{c.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ambient Audio Drone Toggle */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 ${
              isAudioOn
                ? 'bg-gold-500/20 border-gold-400 text-gold-300 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'border-white/10 text-slate-400 hover:text-white bg-white/5'
            }`}
            title="Toggle Ambient Soundscape"
          >
            {isAudioOn ? (
              <>
                <Volume2 className="w-4 h-4 text-gold-400" />
                <span className="hidden xl:inline text-[10px] font-mono">SOUNDSCAPE</span>
              </>
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Cart Icon with Counter */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-300 hover:from-gold-400 hover:to-amber-200 text-obsidian-950 font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">BAG</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-obsidian-950 text-gold-400 text-[10px] font-mono flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Search Input */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search e-books..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
}
