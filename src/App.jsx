import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BookCard from './components/BookCard';
import InteractiveBookModal from './components/InteractiveBookModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import PremiumSuggestionsModal from './components/PremiumSuggestionsModal';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import BackgroundVideo from './components/BackgroundVideo';
import OpeningIntro from './components/OpeningIntro';

import { BOOKS_DATA, CATEGORIES } from './data/booksData';
import { toggleAmbientSound } from './utils/audioSynthesis';
import { Sparkles, SlidersHorizontal, ArrowUpDown, BookOpen, Layers } from 'lucide-react';

export default function App() {
  // Opening Animation State
  const [showOpeningIntro, setShowOpeningIntro] = useState(true);

  // Audio Atmosphere State
  const [isAudioOn, setIsAudioOn] = useState(false);

  // Currency State
  const [currency, setCurrency] = useState({ code: 'USD', symbol: '$', rate: 1 });

  // Catalog Filtering & Search
  const [activeCategory, setActiveCategory] = useState('All Collections');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('bestseller'); // 'bestseller', 'rating', 'price-low', 'price-high'

  // Cart & Modals
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [previewBook, setPreviewBook] = useState(null);
  const [checkoutOrder, setCheckoutOrder] = useState(null);
  const [isPremiumGuideOpen, setIsPremiumGuideOpen] = useState(false);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('aetheria_cart', JSON.stringify(cart));
    } catch (e) {
      console.debug('LocalStorage error:', e);
    }
  }, [cart]);

  // Audio Toggle Handler
  const handleToggleAudio = () => {
    const newState = !isAudioOn;
    setIsAudioOn(newState);
    toggleAmbientSound(newState);
  };

  // Cart operations
  const handleAddToCart = (book) => {
    if (!cart.some((it) => it.id === book.id)) {
      setCart((prev) => [...prev, book]);
      setIsCartOpen(true);
    } else {
      setIsCartOpen(true);
    }
  };

  const handleRemoveFromCart = (bookId) => {
    setCart((prev) => prev.filter((it) => it.id !== bookId));
  };

  // Filter & Sort Books
  const filteredBooks = BOOKS_DATA.filter((book) => {
    const matchesCategory =
      activeCategory === 'All Collections' || book.category === activeCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-low') return a.priceUSD - b.priceUSD;
    if (sortBy === 'price-high') return b.priceUSD - a.priceUSD;
    return b.reviewsCount - a.reviewsCount; // default popular
  });

  const featuredBook = BOOKS_DATA[0];

  return (
    <div className="relative min-h-screen bg-obsidian-950 text-slate-100 flex flex-col selection:bg-gold-500/30 selection:text-gold-300">
      
      {/* 1. Website Opening Cinematic Animation */}
      {showOpeningIntro && (
        <OpeningIntro
          onComplete={() => setShowOpeningIntro(false)}
          onToggleAudio={handleToggleAudio}
          isAudioOn={isAudioOn}
        />
      )}

      {/* 2. Background Video & Interactive Dust Particles */}
      <BackgroundVideo />

      {/* 3. Luxury Sticky Header */}
      <Navbar
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        isAudioOn={isAudioOn}
        onToggleAudio={handleToggleAudio}
        currency={currency}
        onCurrencyChange={setCurrency}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPremiumGuide={() => setIsPremiumGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1">
        
        {/* 4. Hero Section with 3D Interactive Showcase */}
        <HeroSection
          featuredBook={featuredBook}
          onOpenPreview={(book) => setPreviewBook(book)}
          onAddToCart={handleAddToCart}
          currency={currency.symbol}
          currencyRate={currency.rate}
        />

        {/* 5. Catalog & E-Books Storefront Section */}
        <section id="catalog" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-gold-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-semibold">
                  CURATED PORTFOLIO • POPULAR MASTERWORKS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white">
                Bestselling Interactive Editions
              </h2>
              <p className="text-sm text-slate-400 mt-2 font-light max-w-xl">
                Each edition includes the full interactive 3D reading experience, vector PDF for reMarkable/iPad, Kindle-compatible EPUB, and audio narration.
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-gold-500/50"
              >
                <option value="bestseller">Highest Demand / Reviews</option>
                <option value="rating">Highest Rated (4.9+)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-gold-500 to-amber-300 text-obsidian-950 font-bold shadow-[0_0_20px_rgba(212,175,55,0.35)] scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-gold-500/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Book Cards Grid */}
          {filteredBooks.length === 0 ? (
            <div className="p-16 rounded-3xl glass-panel text-center max-w-lg mx-auto">
              <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No matching editions found</h3>
              <p className="text-xs text-slate-400 mb-6 font-light">
                Try searching for "AI", "Wealth", "Stoic", or reset the filter category.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All Collections');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 rounded-full bg-gold-500 text-obsidian-950 text-xs font-bold"
              >
                RESET CATALOG
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onOpenPreview={(b) => setPreviewBook(b)}
                  onAddToCart={handleAddToCart}
                  isInCart={cart.some((it) => it.id === book.id)}
                  currency={currency.symbol}
                  currencyRate={currency.rate}
                />
              ))}
            </div>
          )}

          {/* Interactive Feature Banner: "Why Aetheria Editions are 10x More Engaging" */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl glass-panel-gold border border-gold-500/30 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> THE MULTI-DIMENSIONAL READING REVOLUTION
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white">
                  Forget Boring Flat PDFs. Experience Books in Living 3D.
                </h3>
                <p className="text-sm text-slate-300 font-light leading-relaxed max-w-2xl">
                  Every book on Aetheria comes with our tactile 3D browser flipbook engine, synchronized AI narration, interactive architecture diagrams, customizable daylight/sepia/OLED paper textures, and instant DRM-free master downloads.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setPreviewBook(featuredBook)}
                    className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-wider transition shadow-lg inline-flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>LAUNCH DEMO FLIPBOOK NOW</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-center space-y-3 w-full max-w-xs">
                  <span className="text-3xl font-display font-black text-gold-400">100%</span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Sovereign Ownership
                  </h4>
                  <p className="text-[11px] text-slate-400 font-light">
                    No proprietary app requirements. Read in our web app, Kindle, Apple Books, Kobo, or your browser.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* 6. Social Proof & Endorsements */}
        <Testimonials />

      </main>

      {/* 7. Footer */}
      <Footer onOpenPremiumGuide={() => setIsPremiumGuideOpen(true)} />

      {/* 8. Modals & Drawers */}
      
      {/* 3D Flipbook Reader Modal */}
      <InteractiveBookModal
        book={previewBook}
        isOpen={Boolean(previewBook)}
        onClose={() => setPreviewBook(null)}
        onAddToCart={handleAddToCart}
        currency={currency.symbol}
        currencyRate={currency.rate}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onProceedCheckout={(order) => {
          setIsCartOpen(false);
          setCheckoutOrder(order);
        }}
        currency={currency.symbol}
        currencyRate={currency.rate}
      />

      {/* Checkout & Instant Download Portal Modal */}
      <CheckoutModal
        isOpen={Boolean(checkoutOrder)}
        orderData={checkoutOrder}
        onClose={() => setCheckoutOrder(null)}
        onOrderSuccess={() => {
          setCart([]); // Clear cart upon successful acquisition
        }}
        currency={currency.symbol}
        currencyRate={currency.rate}
      />

      {/* Suggestions Modal for Making the Website Ultra-Premium */}
      <PremiumSuggestionsModal
        isOpen={isPremiumGuideOpen}
        onClose={() => setIsPremiumGuideOpen(false)}
      />

    </div>
  );
}
