import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, ShoppingBag, Volume2, VolumeX, Search, 
  Download, ShieldCheck, Menu, X, ChevronDown, Check, Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../data/booksData';

export default function Navbar({ 
  cartCount = 0, 
  onOpenCart, 
  isAudioOn, 
  onToggleAudio 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Monitor scroll state for background styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const isCurrent = (path) => location.pathname === path;

  return (
    <>
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl border-b border-black/10 shadow-sm py-3' 
            : 'bg-white/80 backdrop-blur-md border-b border-black/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Monogram & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group text-left"
              aria-label="Aetheria Home"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1d1d1f] flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <BookOpen className="w-4 h-4 text-[#c5a059]" />
              </div>
              <div>
                <span className="font-display font-black text-base tracking-wider text-[#1d1d1f] block leading-none">
                  AETHERIA
                </span>
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#6e6e73] block mt-0.5">
                  Privé Editions
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-mono" aria-label="Main Navigation">
            <Link
              to="/"
              className={`transition py-1 border-b-2 ${
                isCurrent('/') ? 'text-[#1d1d1f] font-bold border-[#c5a059]' : 'text-[#6e6e73] hover:text-[#1d1d1f] border-transparent'
              }`}
            >
              Home
            </Link>

            <Link
              to="/books"
              className={`transition py-1 border-b-2 ${
                isCurrent('/books') ? 'text-[#1d1d1f] font-bold border-[#c5a059]' : 'text-[#6e6e73] hover:text-[#1d1d1f] border-transparent'
              }`}
            >
              Catalogue
            </Link>

            {/* Disciplines Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                className="flex items-center gap-1 transition py-1 text-[#6e6e73] hover:text-[#1d1d1f]"
              >
                <span>Collections</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isCategoryDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-60 rounded-2xl bg-white border border-black/10 shadow-xl p-2 z-50 animate-fade-in"
                >
                  <div className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest text-[#997328] font-bold border-b border-black/5">
                    Curated Disciplines
                  </div>
                  {CATEGORIES.filter(c => c !== 'All Books').map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setIsCategoryDropdownOpen(false);
                        navigate(`/books?category=${encodeURIComponent(cat)}`);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition text-[#1d1d1f] hover:bg-[#f5f5f7] flex items-center justify-between"
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/library"
              className={`transition py-1 border-b-2 ${
                isCurrent('/library') ? 'text-[#1d1d1f] font-bold border-[#c5a059]' : 'text-[#6e6e73] hover:text-[#1d1d1f] border-transparent'
              }`}
            >
              My Library
            </Link>

            <Link
              to="/refund-policy"
              className={`transition py-1 border-b-2 ${
                isCurrent('/refund-policy') ? 'text-[#1d1d1f] font-bold border-[#c5a059]' : 'text-[#6e6e73] hover:text-[#1d1d1f] border-transparent'
              }`}
            >
              Policies
            </Link>
          </nav>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xs mx-2">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-[#6e6e73] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search titles or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-black/5 hover:border-black/15 focus:border-[#c5a059] rounded-full pl-9 pr-3 py-1.5 text-xs font-mono text-[#1d1d1f] placeholder-[#6e6e73] focus:outline-none transition-all"
              />
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Library Quick Access */}
            <Link
              to="/library"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 hover:border-black/20 bg-white text-[#1d1d1f] text-xs font-mono transition shadow-sm"
              title="Customer Library"
            >
              <Download className="w-3.5 h-3.5 text-[#997328]" />
              <span className="hidden xl:inline">My</span>
              <span>Library</span>
            </Link>

            {/* Ambient Soundscape Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-xl border transition ${
                isAudioOn
                  ? 'bg-[#c5a059]/15 border-[#c5a059] text-[#997328]'
                  : 'border-black/10 text-[#6e6e73] hover:text-[#1d1d1f] bg-[#f5f5f7]'
              }`}
              title="Toggle Ambient Audio"
            >
              {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="px-3.5 py-2 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-bold text-xs tracking-wider transition-all shadow-sm flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#c5a059]" />
              <span className="hidden sm:inline">BAG</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#c5a059] text-black text-[9px] font-mono flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-black/10 text-[#1d1d1f] bg-[#f5f5f7] transition"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pt-2.5 pb-1">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-3.5 h-3.5 text-[#6e6e73] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search catalogue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-black/10 rounded-full pl-9 pr-3 py-1.5 text-xs font-mono text-[#1d1d1f] placeholder-[#6e6e73] focus:outline-none"
            />
          </form>
        </div>
      </header>

      {/* Mobile Slide-Out Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-4/5 max-w-sm h-full bg-white border-l border-black/10 p-6 flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <span className="font-display font-bold text-[#1d1d1f] text-base">Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#6e6e73] hover:text-[#1d1d1f]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full block py-2.5 px-3 rounded-xl ${
                    isCurrent('/') ? 'bg-[#f5f5f7] text-[#1d1d1f] font-bold' : 'text-[#6e6e73] hover:bg-[#f5f5f7]'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/books"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full block py-2.5 px-3 rounded-xl ${
                    isCurrent('/books') ? 'bg-[#f5f5f7] text-[#1d1d1f] font-bold' : 'text-[#6e6e73] hover:bg-[#f5f5f7]'
                  }`}
                >
                  Catalogue
                </Link>

                <div className="pt-2 pb-1 px-3 text-[10px] uppercase tracking-widest text-[#997328] font-bold">
                  Browse by Discipline
                </div>

                {CATEGORIES.filter(c => c !== 'All Books').map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(`/books?category=${encodeURIComponent(cat)}`);
                    }}
                    className="w-full text-left py-2 px-3 pl-5 rounded-xl transition text-[#1d1d1f] hover:bg-[#f5f5f7] flex items-center justify-between"
                  >
                    <span>{cat}</span>
                  </button>
                ))}

                <div className="pt-4 border-t border-black/10">
                  <Link
                    to="/library"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 px-3 rounded-xl text-[#1d1d1f] hover:bg-[#f5f5f7] flex items-center justify-between"
                  >
                    <span>My Library</span>
                    <Download className="w-3.5 h-3.5 text-[#997328]" />
                  </Link>

                  <Link
                    to="/refund-policy"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 px-3 rounded-xl text-[#1d1d1f] hover:bg-[#f5f5f7] flex items-center justify-between"
                  >
                    <span>Policies & Refunds</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#997328]" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-black/10 text-[10px] font-mono text-[#6e6e73] space-y-2">
              <div className="flex items-center gap-1.5 text-[#997328]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>All Single Editions Under ₹500</span>
              </div>
              <p>Instant master PDF & EPUB downloads upon settlement.</p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
