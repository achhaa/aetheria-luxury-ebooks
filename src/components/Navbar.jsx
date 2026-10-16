import React, { useState, useEffect } from 'react';
import { 
  BookOpen, ShoppingBag, Volume2, VolumeX, Search, 
  Download, ShieldCheck, Menu, X, ChevronDown, Check, Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../data/booksData';

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  isAudioOn, 
  onToggleAudio, 
  searchQuery, 
  onSearchChange,
  activeCategory,
  onSelectCategory,
  onOpenPolicies,
  onOpenLibraryLookup
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Monitor scroll state for background styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll and category filter helper
  const handleNavClick = (sectionId, category) => {
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);

    if (category) {
      onSelectCategory(category);
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#07080a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5' 
            : 'bg-[#07080a]/80 backdrop-blur-md border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Monogram & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => handleNavClick('hero')} 
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#dfc079] flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.3)] group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-4 h-4 text-[#07080a]" />
              </div>
              <div>
                <span className="font-display font-black text-lg tracking-wider gold-gradient-text block leading-none">
                  AETHERIA
                </span>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-slate-400 block mt-0.5">
                  Privé Editions
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono" aria-label="Main Navigation">
            <button
              onClick={() => handleNavClick('hero')}
              className="text-slate-300 hover:text-white transition py-1 hover:border-b hover:border-[#c5a059]"
            >
              Home
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                className={`flex items-center gap-1 transition py-1 hover:border-b hover:border-[#c5a059] ${
                  activeCategory !== 'All Books' ? 'text-[#c5a059] font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Collections</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-[#0c0e14] border border-white/10 shadow-2xl p-2 z-50 animate-fade-in"
                >
                  <div className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest text-[#c5a059] border-b border-white/5">
                    Select Discipline
                  </div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleNavClick('catalog', cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition flex items-center justify-between ${
                        activeCategory === cat
                          ? 'bg-[#c5a059]/15 text-[#c5a059] font-bold'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{cat}</span>
                      {activeCategory === cat && <Check className="w-3 h-3 text-[#c5a059]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('catalog', 'All Books')}
              className={`transition py-1 hover:border-b hover:border-[#c5a059] ${
                activeCategory === 'All Books' ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              All Books
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className="text-slate-300 hover:text-white transition py-1 hover:border-b hover:border-[#c5a059]"
            >
              About Aetheria
            </button>
          </nav>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-2">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search titles or topics..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 hover:border-[#c5a059]/40 focus:border-[#c5a059] rounded-full pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* My Library Button */}
            <button
              onClick={onOpenLibraryLookup}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-[#c5a059]/40 bg-white/5 text-slate-300 hover:text-white text-xs font-mono transition"
              title="Retrieve past digital purchases by email"
            >
              <Download className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="hidden xl:inline">My</span>
              <span>Library</span>
            </button>

            {/* Ambient Soundscape Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-xl border transition ${
                isAudioOn
                  ? 'bg-[#c5a059]/20 border-[#c5a059] text-[#c5a059]'
                  : 'border-white/10 text-slate-400 hover:text-white bg-white/5'
              }`}
              title="Toggle Ambient Audio"
            >
              {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="px-3.5 py-2 rounded-xl bg-[#c5a059] hover:bg-[#d4af37] text-black font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(197,160,89,0.3)] transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">BAG</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-black text-[#c5a059] text-[9px] font-mono flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-white/10 text-slate-300 hover:text-white bg-white/5 transition"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Search Bar (under header) */}
        <div className="md:hidden px-4 pt-2.5 pb-1">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search catalogue..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-4/5 max-w-sm h-full bg-[#0c0e14] border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-6">
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="font-display font-bold text-white text-base">Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Sections */}
              <div className="space-y-1 text-xs font-mono">
                <button
                  onClick={() => handleNavClick('hero')}
                  className="w-full text-left py-2.5 px-3 rounded-xl text-slate-200 hover:bg-white/5"
                >
                  Home
                </button>

                <button
                  onClick={() => handleNavClick('catalog', 'All Books')}
                  className={`w-full text-left py-2.5 px-3 rounded-xl ${
                    activeCategory === 'All Books' ? 'bg-[#c5a059]/15 text-[#c5a059] font-bold' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  All Books
                </button>

                <div className="pt-2 pb-1 px-3 text-[10px] uppercase tracking-widest text-[#c5a059] font-bold">
                  Browse by Discipline
                </div>

                {CATEGORIES.filter(c => c !== 'All Books').map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleNavClick('catalog', cat)}
                    className={`w-full text-left py-2 px-3 pl-5 rounded-xl transition flex items-center justify-between ${
                      activeCategory === cat
                        ? 'bg-[#c5a059]/15 text-[#c5a059] font-bold'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{cat}</span>
                    {activeCategory === cat && <Check className="w-3 h-3 text-[#c5a059]" />}
                  </button>
                ))}

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleNavClick('about')}
                    className="w-full text-left py-2.5 px-3 rounded-xl text-slate-200 hover:bg-white/5"
                  >
                    About Aetheria
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenLibraryLookup();
                    }}
                    className="w-full text-left py-2.5 px-3 rounded-xl text-slate-200 hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>My Library</span>
                    <Download className="w-3.5 h-3.5 text-[#c5a059]" />
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenCart();
                    }}
                    className="w-full text-left py-2.5 px-3 rounded-xl text-slate-200 hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>Shopping Bag ({cartCount})</span>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#c5a059]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Info */}
            <div className="pt-6 border-t border-white/10 text-[10px] font-mono text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 text-[#c5a059]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>All Single Editions Under ₹500</span>
              </div>
              <p>Instant digital download upon Razorpay settlement.</p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
