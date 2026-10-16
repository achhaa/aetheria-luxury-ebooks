import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BookCard from './components/BookCard';
import AboutSection from './components/AboutSection';
import InteractiveBookModal from './components/InteractiveBookModal';
import BookDetailModal from './components/BookDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import LibraryLookupModal from './components/LibraryLookupModal';
import EditorialPoliciesModal from './components/EditorialPoliciesModal';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import BackgroundVideo from './components/BackgroundVideo';
import OpeningIntro from './components/OpeningIntro';

import { BOOKS_DATA, CATEGORIES } from './data/booksData';
import { toggleAmbientSound } from './utils/audioSynthesis';
import { ArrowUpDown, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  // Opening Cinematic Sequence (3-5s, respects reduced-motion)
  const [showOpeningIntro, setShowOpeningIntro] = useState(true);

  // Ambient Audio
  const [isAudioOn, setIsAudioOn] = useState(false);

  // Single active video preview across all book cards
  const [activePlayingId, setActivePlayingId] = useState(null);

  // Catalog Filtering & Search
  const [activeCategory, setActiveCategory] = useState('All Books');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'pages'

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_cart_inr');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Active Modals
  const [readingBook, setReadingBook] = useState(null); // Book currently opened in Reading Room
  const [detailBook, setDetailBook] = useState(null);   // Book currently opened in Trailer/Dossier modal
  const [checkoutBooks, setCheckoutBooks] = useState(null); // Books being purchased
  const [isLibraryLookupOpen, setIsLibraryLookupOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('aetheria_cart_inr', JSON.stringify(cart));
    } catch (e) {
      console.debug('LocalStorage write error:', e);
    }
  }, [cart]);

  // Audio Toggle
  const handleToggleAudio = () => {
    const next = !isAudioOn;
    setIsAudioOn(next);
    toggleAmbientSound(next);
  };

  // Cart Handlers
  const handleAddToCart = (book) => {
    if (!cart.some((it) => it.id === book.id)) {
      setCart((prev) => [...prev, book]);
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (bookId) => {
    setCart((prev) => prev.filter((it) => it.id !== bookId));
  };

  // Direct 1-Click Buy Action
  const handleDirectBuy = (book) => {
    setCheckoutBooks([book]);
  };

  // Filter & Sort
  const filteredBooks = BOOKS_DATA.filter((book) => {
    const matchesCategory =
      activeCategory === 'All Books' || book.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(q) ||
      book.subtitle.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.priceINR - b.priceINR;
    if (sortBy === 'price-high') return b.priceINR - a.priceINR;
    if (sortBy === 'pages') return b.pages - a.pages;
    return 0; // default order
  });

  const featuredBook = BOOKS_DATA[0];

  return (
    <div className="relative min-h-screen bg-[#07080a] text-slate-100 flex flex-col selection:bg-[#c5a059]/30 selection:text-[#fde68a]">
      
      {/* 1. Cinematic 3-5s Product Launch Intro */}
      {showOpeningIntro && (
        <OpeningIntro onComplete={() => setShowOpeningIntro(false)} />
      )}

      {/* 2. Ambient Background Atmosphere Video & Particle Canvas */}
      <BackgroundVideo />

      {/* 3. Navigation Header */}
      <Navbar
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        isAudioOn={isAudioOn}
        onToggleAudio={handleToggleAudio}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onOpenPolicies={() => setIsPoliciesOpen(true)}
        onOpenLibraryLookup={() => setIsLibraryLookupOpen(true)}
      />

      {/* Main Storefront */}
      <main className="relative z-10 flex-1">
        
        {/* 4. Editorial Hero Section */}
        <HeroSection
          featuredBook={featuredBook}
          onOpenSample={(b) => setReadingBook(b)}
          onOpenDetail={(b) => setDetailBook(b)}
          onBuyNow={handleDirectBuy}
        />

        {/* 5. Catalogue Grid */}
        <section id="catalog" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold">
                  CURATED PUBLICATIONS • ALL EDITIONS UNDER ₹500
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white">
                Original Authoritative Volumes
              </h2>
              <p className="text-sm text-slate-400 mt-2 font-light max-w-xl">
                Every purchase includes instant vector PDF downloads, universal EPUB for Kindle/Apple Books, and full lifetime access.
              </p>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#0f1118] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#c5a059]"
              >
                <option value="featured">Curated Sequence</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="pages">Length / Pages</option>
              </select>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#c5a059] text-[#07080a] font-bold shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Book Cards Grid */}
          {filteredBooks.length === 0 ? (
            <div className="p-16 rounded-3xl bg-white/5 border border-white/10 text-center max-w-md mx-auto">
              <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No publications found</h3>
              <p className="text-xs text-slate-400 mb-6 font-light">
                Try searching for "Mind", "Stoic", or "Cyber", or reset the category.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All Books');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 rounded-full bg-[#c5a059] text-black text-xs font-bold font-mono"
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
                  onOpenSample={(b) => setReadingBook(b)}
                  onOpenDetail={(b) => setDetailBook(b)}
                  onBuyNow={handleDirectBuy}
                  activePlayingId={activePlayingId}
                  setActivePlayingId={setActivePlayingId}
                />
              ))}
            </div>
          )}

          {/* Reading Comfort & Guarantee Banner */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-[#0d0f14] border border-[#c5a059]/30 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> REFINED EDITORIAL PHILOSOPHY
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  Designed for Effortless Long-Form Reading.
                </h3>
                <p className="text-sm text-slate-300 font-light leading-relaxed max-w-2xl">
                  We believe long-form digital books should feel as comfortable as an artisan hardback. Enjoy sample chapters in warm ivory paper, dark charcoal typography, distraction-free reading mode, and instant vector PDF downloads.
                </p>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="p-6 rounded-2xl bg-black/50 border border-white/10 text-center space-y-2 w-full max-w-xs">
                  <span className="text-3xl font-display font-bold text-[#c5a059]">₹199 – ₹349</span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Direct Indian Pricing
                  </h4>
                  <p className="text-[11px] text-slate-400 font-light">
                    Every title priced under ₹500. Zero hidden shipping or recurring subscriptions.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* 6. About Aetheria & Editorial Provenance */}
        <AboutSection />

        {/* 7. Testimonials & Verified Reviews */}
        <Testimonials />

      </main>

      {/* 7. Footer */}
      <Footer 
        onOpenPolicies={() => setIsPoliciesOpen(true)}
        onOpenLibraryLookup={() => setIsLibraryLookupOpen(true)}
      />

      {/* 8. Interactive Modals */}

      {/* Reading Room Modal: Warm Ivory, Charcoal Text, Distraction-Free */}
      <InteractiveBookModal
        book={readingBook}
        isOpen={Boolean(readingBook)}
        onClose={() => setReadingBook(null)}
        onBuyNow={handleDirectBuy}
      />

      {/* Book Detail & 10s Cinematic Trailer Modal */}
      <BookDetailModal
        book={detailBook}
        isOpen={Boolean(detailBook)}
        onClose={() => setDetailBook(null)}
        onOpenSample={(b) => setReadingBook(b)}
        onBuyNow={handleDirectBuy}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onProceedCheckout={(items) => {
          setIsCartOpen(false);
          setCheckoutBooks(items);
        }}
      />

      {/* Razorpay Verified Checkout Modal */}
      <CheckoutModal
        books={checkoutBooks}
        isOpen={Boolean(checkoutBooks)}
        onClose={() => setCheckoutBooks(null)}
        onSuccess={() => {
          setCart([]); // Clear cart upon verified purchase
        }}
      />

      {/* Customer Library Lookup Modal */}
      <LibraryLookupModal
        isOpen={isLibraryLookupOpen}
        onClose={() => setIsLibraryLookupOpen(false)}
      />

      {/* Editorial & Commerce Policies Modal */}
      <EditorialPoliciesModal
        isOpen={isPoliciesOpen}
        onClose={() => setIsPoliciesOpen(false)}
      />

    </div>
  );
}
