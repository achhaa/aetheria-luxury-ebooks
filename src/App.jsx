import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import BookDetailPage from './pages/BookDetailPage';
import ReaderPage from './pages/ReaderPage';
import LibraryPage from './pages/LibraryPage';
import PoliciesPage from './pages/PoliciesPage';
import AdminPage from './pages/AdminPage';

import { toggleAmbientSound } from './utils/audioSynthesis';

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

  // Determine if on standalone Reader view (which has its own distraction-free top bar)
  const isReaderView = location.pathname.startsWith('/read/');

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1d1d1f] selection:bg-[#c5a059]/25 selection:text-[#1d1d1f]">
      <ScrollToTop />

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
      <main className="flex-1">
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
