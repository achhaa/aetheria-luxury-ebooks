import React from 'react';
import { 
  BookOpen, ShoppingBag, Volume2, VolumeX, Search, 
  ShieldCheck, Download, HelpCircle
} from 'lucide-react';

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  isAudioOn, 
  onToggleAudio, 
  searchQuery, 
  onSearchChange,
  onOpenPolicies,
  onOpenLibraryLookup
}) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#07080a]/85 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Monogram & Title */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#dfc079] flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.35)] group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-5 h-5 text-[#07080a]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-wider gold-gradient-text block leading-none">
                AETHERIA
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400 block mt-1">
                Privé Editions
              </span>
            </div>
          </a>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, thesis, or author..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 hover:border-[#c5a059]/40 focus:border-[#c5a059] rounded-full pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Customer Library Retrieval / My Purchases */}
          <button
            onClick={onOpenLibraryLookup}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-[#c5a059]/40 bg-white/5 text-slate-300 hover:text-white text-xs font-mono transition"
            title="Retrieve past digital purchases by email"
          >
            <Download className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>My Library</span>
          </button>

          {/* Editorial Standards & Guarantees */}
          <button
            onClick={onOpenPolicies}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-[#c5a059]/40 bg-white/5 text-slate-300 hover:text-white text-xs font-mono transition"
            title="Read Refund, Delivery & Security Policies"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Policies</span>
          </button>

          {/* Ambient Tone Toggle */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-lg border transition ${
              isAudioOn
                ? 'bg-[#c5a059]/20 border-[#c5a059] text-[#c5a059]'
                : 'border-white/10 text-slate-400 hover:text-white bg-white/5'
            }`}
            title="Toggle Ambient Atmosphere"
          >
            {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Cart Icon with Item Counter */}
          <button
            onClick={onOpenCart}
            className="px-3.5 py-2 rounded-xl bg-[#c5a059] hover:bg-[#d4af37] text-[#07080a] font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">BAG</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#07080a] text-[#c5a059] text-[10px] font-mono flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>

      {/* Mobile Search Input */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
