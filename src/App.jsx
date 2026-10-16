import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OpeningIntro from './components/OpeningIntro';
import BackgroundVideo from './components/BackgroundVideo';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import BookDetailPage from './pages/BookDetailPage';
import ReaderPage from './pages/ReaderPage';
import LibraryPage from './pages/LibraryPage';
import PoliciesPage from './pages/PoliciesPage';
import AdminPage from './pages/AdminPage';

import { toggleAmbientSound } from './utils/audioSynthesis';
import './styles/motion.css';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();

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

  // Audio Toggle
  const handleToggleAudio = () => {
    const next = !isAudioOn;
    setIsAudioOn(next);
    toggleAmbientSound(next);
  };

  const handleRemoveFromCart = (bookId) => {
    setCart((prev) => prev.filter((it) => it.id !== bookId));
  };

  // Direct 1-Click Buy Action
  const handleDirectBuy = (book) => {
    setCheckoutBooks([book]);
  };

  return (
    <div className="relative min-h-screen flex flex-col text-[#1d1d1f] selection:bg-[#c5a059]/25 selection:text-[#1d1d1f] overflow-x-hidden">
      <ScrollToTop />

      {/* Cinematic Brand Opening Launch Sequence (Apple-style monogram reveal) */}
      <AnimatePresence mode="wait">
        {showIntro && !isReaderView && (
          <OpeningIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* Full-Bleed Ambient Luxury Background Video with Editorial Scrims */}
      <BackgroundVideo isReaderView={isReaderView} />

      {/* Primary Storefront Navbar (hidden in distraction-free Reader mode) */}
      {!isReaderView && (
        <Navbar
          cartCount={cart.length}
          onOpenCart={() => setIsCartOpen(true)}
          isAudioOn={isAudioOn}
          onToggleAudio={handleToggleAudio}
        />
      )}

      {/* Main Multi-Page Routed Content */}
      <main className="flex-1 relative z-10">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                onBuyNow={handleDirectBuy} 
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
      </main>

      {/* Storefront Footer (hidden in distraction-free Reader mode) */}
      {!isReaderView && <Footer />}

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
          setCart([]);
        }}
      />

    </div>
  );
}
