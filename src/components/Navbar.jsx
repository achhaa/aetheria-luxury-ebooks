import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, ShoppingBag, Volume2, VolumeX, Search, 
  Download, ShieldCheck, Menu, X, ChevronDown, Check, Sparkles,
  Moon, Sun, Sunset, User, LogOut
} from 'lucide-react';
import { CATEGORIES } from '../data/booksData';
import SpotlightSearch from './SpotlightSearch';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  cartCount = 0, 
  onOpenCart, 
  isAudioOn, 
  onToggleAudio,
  siteTheme = 'dark',
  setSiteTheme
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout, setIsAuthModalOpen } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = React.useRef(null);

  // Monitor scroll state for background styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCurrent = (path) => location.pathname === path;

  return (
    <>
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 dark:bg-[#0b0c0e]/92 backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-sm py-3' 
            : 'bg-white/80 dark:bg-[#0b0c0e]/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 py-4'
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
              <div className="w-8 h-8 rounded-lg bg-[#1d1d1f] dark:bg-[#1c1f26] border border-transparent dark:border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <BookOpen className="w-4 h-4 text-[#c5a059]" />
              </div>
              <div>
                <span className="font-display font-black text-base tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7] block leading-none">
                  AETHERIA
                </span>
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#6e6e73] dark:text-[#a1a1a6] block mt-0.5">
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
                isCurrent('/') ? 'text-[#1d1d1f] dark:text-[#f5f5f7] font-bold border-[#c5a059]' : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] border-transparent'
              }`}
            >
              Home
            </Link>

            <Link
              to="/books"
              className={`transition py-1 border-b-2 ${
                isCurrent('/books') ? 'text-[#1d1d1f] dark:text-[#f5f5f7] font-bold border-[#c5a059]' : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] border-transparent'
              }`}
            >
              Catalogue
            </Link>

            {/* Disciplines Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                className="flex items-center gap-1 transition py-1 text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]"
              >
                <span>Collections</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isCategoryDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#1c1f26] border border-black/10 dark:border-white/10 shadow-xl p-2 z-50 animate-fade-in"
                >
                  <div className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest text-[#997328] dark:text-[#c5a059] font-bold border-b border-black/5 dark:border-white/5">
                    Curated Disciplines
                  </div>
                  {CATEGORIES.filter(c => c !== 'All Books').map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setIsCategoryDropdownOpen(false);
                        navigate(`/books?category=${encodeURIComponent(cat)}`);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-white/5 flex items-center justify-between"
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
                isCurrent('/library') ? 'text-[#1d1d1f] dark:text-[#f5f5f7] font-bold border-[#c5a059]' : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] border-transparent'
              }`}
            >
              My Library
            </Link>

            <Link
              to="/refund-policy"
              className={`transition py-1 border-b-2 ${
                isCurrent('/refund-policy') ? 'text-[#1d1d1f] dark:text-[#f5f5f7] font-bold border-[#c5a059]' : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] border-transparent'
              }`}
            >
              Policies
            </Link>
          </nav>

          {/* Desktop Interactive Spotlight Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-2">
            <SpotlightSearch />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* 3-Mode Storefront Theme Toggle Pill */}
            <div className="flex items-center p-0.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setSiteTheme && setSiteTheme('dark')}
                className={`p-1.5 rounded-full transition-all ${
                  siteTheme === 'dark'
                    ? 'bg-[#1d1d1f] dark:bg-[#c5a059] text-[#c5a059] dark:text-black shadow-sm'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                }`}
                title="Luxury Dark Mode"
                aria-label="Luxury Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setSiteTheme && setSiteTheme('dim')}
                className={`p-1.5 rounded-full transition-all ${
                  siteTheme === 'dim'
                    ? 'bg-[#282c35] text-[#dfb76c] shadow-sm'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                }`}
                title="Editorial Dim Mode"
                aria-label="Editorial Dim Mode"
              >
                <Sunset className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setSiteTheme && setSiteTheme('light')}
                className={`p-1.5 rounded-full transition-all ${
                  siteTheme === 'light'
                    ? 'bg-white text-[#997328] shadow-sm'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                }`}
                title="Light Gallery Mode"
                aria-label="Light Gallery Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Library Quick Access */}
            <Link
              to="/library"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 bg-white dark:bg-white/5 text-[#1d1d1f] dark:text-[#f5f5f7] text-xs font-mono transition shadow-sm"
              title="Customer Library"
            >
              <Download className="w-3.5 h-3.5 text-[#997328] dark:text-[#c5a059]" />
              <span className="hidden xl:inline">My</span>
              <span>Library</span>
            </Link>

            {/* Google Authentication / User Profile Button */}
            {isAuthenticated && user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-black/10 dark:border-white/10 hover:border-[#c5a059] bg-white dark:bg-white/5 text-xs font-mono transition shadow-sm cursor-pointer"
                  title={user.name || user.email}
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#1d1d1f] dark:bg-[#c5a059] text-white dark:text-black flex items-center justify-center text-[10px] font-bold">
                      {(user.name || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden xl:inline text-[11px] font-medium max-w-[90px] truncate text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {user.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#6e6e73] dark:text-[#a1a1a6]" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#14161a] border border-black/10 dark:border-white/15 rounded-2xl shadow-xl p-2 z-50 animate-fade-in text-xs font-mono">
                    <div className="px-3 py-2 border-b border-black/5 dark:border-white/10">
                      <p className="font-bold text-[#1d1d1f] dark:text-white truncate">{user.name || 'Aetheria Reader'}</p>
                      <p className="text-[10px] text-[#6e6e73] dark:text-[#a1a1a6] truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/library"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition text-[#1d1d1f] dark:text-[#f5f5f7]"
                    >
                      <Download className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>My Library</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-500/10 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/15 dark:border-white/15 bg-white/80 dark:bg-white/5 hover:border-[#c5a059] text-xs font-mono text-[#1d1d1f] dark:text-[#f5f5f7] transition shadow-sm cursor-pointer active:scale-95"
                title="Sign in with Google"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign In</span>
              </button>
            )}

            {/* Ambient Soundscape Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-xl border transition ${
                isAudioOn
                  ? 'bg-[#c5a059]/15 border-[#c5a059] text-[#997328] dark:text-[#c5a059]'
                  : 'border-black/10 dark:border-white/10 text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] bg-[#f5f5f7] dark:bg-white/5'
              }`}
              title="Toggle Ambient Audio"
            >
              {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="px-3.5 py-2 rounded-xl bg-[#1d1d1f] dark:bg-[#c5a059] hover:bg-black dark:hover:bg-[#dfb76c] text-white dark:text-black font-bold text-xs tracking-wider transition-all shadow-sm flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#c5a059] dark:text-black" />
              <span className="hidden sm:inline">BAG</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#c5a059] dark:bg-black text-black dark:text-white text-[9px] font-mono flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-black/10 dark:border-white/10 text-[#1d1d1f] dark:text-[#f5f5f7] bg-[#f5f5f7] dark:bg-white/5 transition"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pt-2.5 pb-1">
          <SpotlightSearch isMobile onCloseMobile={() => setIsMobileMenuOpen(false)} />
        </div>
      </header>

      {/* Mobile Slide-Out Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-4/5 max-w-sm h-full bg-white dark:bg-[#14161a] border-l border-black/10 dark:border-white/10 p-6 flex flex-col justify-between overflow-y-auto text-[#1d1d1f] dark:text-[#f5f5f7]">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
                <span className="font-display font-bold text-[#1d1d1f] dark:text-[#f5f5f7] text-base">Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Account Status & Google Sign-In */}
              <div className="p-3 rounded-2xl bg-[#f5f5f7] dark:bg-white/5 border border-black/5 dark:border-white/10">
                {isAuthenticated && user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#1d1d1f] dark:bg-[#c5a059] text-white dark:text-black flex items-center justify-center text-xs font-bold shrink-0">
                          {(user.name || user.email || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-xs truncate">{user.name || 'Aetheria Reader'}</p>
                        <p className="text-[10px] text-[#6e6e73] dark:text-[#a1a1a6] truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 text-xs font-mono cursor-pointer"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white dark:bg-[#1c1f26] border border-black/10 dark:border-white/10 text-xs font-mono font-semibold text-[#1d1d1f] dark:text-white shadow-xs cursor-pointer active:scale-98"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                )}
              </div>

              {/* Mobile Storefront Theme Toggle */}
              <div className="p-3 rounded-2xl bg-[#f5f5f7] dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#997328] dark:text-[#c5a059] font-bold block">
                  Atmosphere Theme
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setSiteTheme && setSiteTheme('dark')}
                    className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                      siteTheme === 'dark'
                        ? 'bg-[#1d1d1f] dark:bg-[#c5a059] text-[#c5a059] dark:text-black font-bold shadow-xs'
                        : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSiteTheme && setSiteTheme('dim')}
                    className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                      siteTheme === 'dim'
                        ? 'bg-[#282c35] text-[#dfb76c] font-bold shadow-xs'
                        : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <Sunset className="w-3.5 h-3.5" />
                    <span>Dim</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSiteTheme && setSiteTheme('light')}
                    className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                      siteTheme === 'light'
                        ? 'bg-white text-[#997328] font-bold shadow-xs'
                        : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full block py-2.5 px-3 rounded-xl transition ${
                    isCurrent('/') ? 'bg-[#f5f5f7] dark:bg-white/10 text-[#1d1d1f] dark:text-[#f5f5f7] font-bold' : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-[#f5f5f7] dark:hover:bg-white/5'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/books"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full block py-2.5 px-3 rounded-xl transition ${
                    isCurrent('/books') ? 'bg-[#f5f5f7] dark:bg-white/10 text-[#1d1d1f] dark:text-[#f5f5f7] font-bold' : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-[#f5f5f7] dark:hover:bg-white/5'
                  }`}
                >
                  Catalogue
                </Link>

                <div className="pt-2 pb-1 px-3 text-[10px] uppercase tracking-widest text-[#997328] dark:text-[#c5a059] font-bold">
                  Browse by Discipline
                </div>

                {CATEGORIES.filter(c => c !== 'All Books').map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(`/books?category=${encodeURIComponent(cat)}`);
                    }}
                    className="w-full text-left py-2 px-3 pl-5 rounded-xl transition text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>{cat}</span>
                  </button>
                ))}

                <div className="pt-4 border-t border-black/10 dark:border-white/10">
                  <Link
                    to="/library"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 px-3 rounded-xl text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>My Library</span>
                    <Download className="w-3.5 h-3.5 text-[#997328] dark:text-[#c5a059]" />
                  </Link>

                  <Link
                    to="/refund-policy"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 px-3 rounded-xl text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>Policies & Refunds</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#997328] dark:text-[#c5a059]" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-black/10 dark:border-white/10 text-[10px] font-mono text-[#6e6e73] dark:text-[#a1a1a6] space-y-2">
              <div className="flex items-center gap-1.5 text-[#997328] dark:text-[#c5a059]">
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
