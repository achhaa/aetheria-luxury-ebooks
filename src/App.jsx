import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OpeningIntro from './components/OpeningIntro';
import BackgroundVideo from './components/BackgroundVideo';

// Lazy-loaded routes for optimal initial chunk load speed
const HomePage = lazy(() => import('./pages/HomePage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const BookDetailPage = lazy(() => import('./pages/BookDetailPage'));
const ReaderPage = lazy(() => import('./pages/ReaderPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const PoliciesPage = lazy(() => import('./pages/PoliciesPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

import { toggleAmbientSound } from './utils/audioSynthesis';
import { AuthProvider, useAuth } from './context/AuthContext';
import GoogleAuthModal from './components/GoogleAuthModal';
import './styles/motion.css';

// Restrained Luxury Micro-Skeleton loader with zero layout shift
function RouteSuspenseFallback() {
  return (
    <div 
      aria-label="Loading page"
      className="min-h-[60vh] flex flex-col items-center justify-center p-8 select-none transition-opacity duration-300"
    >
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping pointer-events-none" />
        <div className="w-6 h-6 rounded-full border border-amber-500/40 border-t-amber-400 animate-spin" />
      </div>
      <span className="mt-4 text-[9px] font-mono uppercase tracking-[0.3em] text-neutral-400/70">
        Aetheria Édition
      </span>
    </div>
  );
}

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth();

  // Ambient Audio
  const [isAudioOn, setIsAudioOn] = useState(false);

  // Single active video preview across all book cards
  const [activePlayingId, setActivePlayingId] = useState(null);

  // Determine if on standalone Reader view (which has its own distraction-free top bar)
  const isReaderView = location.pathname.startsWith('/read/');

  // Apple-style brand launch intro sequence (once per session, bypassed on reader routes)
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.location.pathname.startsWith('/read/')) return false;
    try {
      return sessionStorage.getItem('aetheria_intro_shown') !== 'true';
    } catch {
      return false;
    }
  });

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('aetheria_intro_shown', 'true');
    } catch (e) {
      console.debug('sessionStorage error:', e);
    }
    setShowIntro(false);
  };

  // Listen for custom trigger to replay brand intro sequence on demand
  useEffect(() => {
    const handleReplayIntro = () => setShowIntro(true);
    window.addEventListener('aetheria:replay-intro', handleReplayIntro);
    return () => window.removeEventListener('aetheria:replay-intro', handleReplayIntro);
  }, []);

  // Cart Management
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_cart_inr');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout modal
  const [checkoutBooks, setCheckoutBooks] = useState(null);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('aetheria_cart_inr', JSON.stringify(cart));
    } catch (e) {
      console.debug('LocalStorage write error:', e);
    }
  }, [cart]);

  // Global Storefront Theme: 'dark' (luxury obsidian), 'editorial-dim' (warm twilight), 'light' (clean gallery)
  const [siteTheme, setSiteTheme] = useState(() => {
    try {
      return localStorage.getItem('aetheria_site_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Sync theme with localStorage and root <html> classes
  useEffect(() => {
    try {
      localStorage.setItem('aetheria_site_theme', siteTheme);
    } catch (e) {
      console.debug('LocalStorage write error:', e);
    }
    const root = document.documentElement;
    root.classList.remove('theme-site-dark', 'theme-site-dim', 'theme-site-light', 'dark');
    root.classList.add(`theme-site-${siteTheme}`);
    if (siteTheme !== 'light') {
      root.classList.add('dark');
    }
  }, [siteTheme]);

  // Audio Toggle
  const handleToggleAudio = () => {
    const next = !isAudioOn;
    setIsAudioOn(next);
    toggleAmbientSound(next);
  };

  const handleRemoveFromCart = (bookId) => {
    setCart((prev) => prev.filter((it) => it.id !== bookId));
  };

  // Add to Bag Action
  const handleAddToCart = (book) => {
    setCart((prev) => {
      if (prev.some((b) => b.id === book.id)) return prev;
      return [...prev, book];
    });
    setIsCartOpen(true);
  };

  // Direct 1-Click Buy Action
  const handleDirectBuy = (book) => {
    setCheckoutBooks([book]);
  };

  return (
    <div className="relative min-h-screen flex flex-col text-[var(--site-text)] selection:bg-[#c5a059]/25 selection:text-[var(--site-text)] overflow-x-hidden transition-colors duration-300">
      <ScrollToTop />

      {/* Cinematic Brand Opening Launch Sequence (Apple-style monogram reveal) */}
      <AnimatePresence mode="wait">
        {showIntro && !isReaderView && (
          <OpeningIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* Full-Bleed Ambient Luxury Background Video with Editorial Scrims */}
      <BackgroundVideo 
        isReaderView={isReaderView} 
        isDark={siteTheme !== 'light'} 
        isCardVideoPlaying={Boolean(activePlayingId)}
      />

      {/* Primary Storefront Navbar (hidden in distraction-free Reader mode) */}
      {!isReaderView && (
        <Navbar
          cartCount={cart.length}
          onOpenCart={() => setIsCartOpen(true)}
          isAudioOn={isAudioOn}
          onToggleAudio={handleToggleAudio}
          siteTheme={siteTheme}
          setSiteTheme={setSiteTheme}
        />
      )}

      {/* Main Multi-Page Routed Content */}
      <main className="flex-1 relative z-10">
        <Suspense fallback={<RouteSuspenseFallback />}>
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  onBuyNow={handleDirectBuy} 
                  onAddToCart={handleAddToCart}
                  activePlayingId={activePlayingId} 
                  setActivePlayingId={setActivePlayingId} 
                />
              } 
            />
            <Route 
              path="/books" 
              element={
                <CatalogPage 
                  onBuyNow={handleDirectBuy} 
                  onAddToCart={handleAddToCart}
                  activePlayingId={activePlayingId} 
                  setActivePlayingId={setActivePlayingId} 
                />
              } 
            />
            <Route 
              path="/books/:slug" 
              element={
                <BookDetailPage 
                  onBuyNow={handleDirectBuy} 
                  onAddToCart={handleAddToCart}
                />
              } 
            />
            <Route 
              path="/read/:bookId" 
              element={<ReaderPage />} 
            />
            <Route 
              path="/library" 
              element={<LibraryPage />} 
            />
            <Route 
              path="/refund-policy" 
              element={<PoliciesPage />} 
            />
            <Route 
              path="/terms" 
              element={<PoliciesPage />} 
            />
            <Route 
              path="/privacy" 
              element={<PoliciesPage />} 
            />
            <Route 
              path="/help" 
              element={<PoliciesPage />} 
            />
            <Route 
              path="/admin" 
              element={<AdminPage />} 
            />
          </Routes>
        </Suspense>
      </main>

      {/* Storefront Footer (hidden in distraction-free Reader mode) */}
      {!isReaderView && <Footer />}

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onAddItem={handleAddToCart}
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
          setCart([]);
        }}
      />

      {/* Google Identity Services Authentication Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
