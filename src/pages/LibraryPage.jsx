import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Download, BookOpen, ArrowRight, AlertCircle, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BOOKS_DATA } from '../data/booksData';

export default function LibraryPage() {
  const { user, isAuthenticated, setIsAuthModalOpen, logout } = useAuth();
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('aetheria_customer_email') || '';
  });
  const [orders, setOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFetchLibrary = useCallback(async (targetEmail) => {
    if (!targetEmail || !targetEmail.includes('@')) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/customer/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail.trim().toLowerCase() }),
      });

      if (!res.ok) {
        throw new Error('Could not retrieve orders from server.');
      }

      const data = await res.json();
      setOrders(data.orders || []);
      localStorage.setItem('aetheria_customer_email', targetEmail.trim().toLowerCase());
    } catch (err) {
      console.error('Library fetch error:', err);
      setErrorMessage(err.message || 'Lookup failed.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch if user authenticated with Google or if email saved
  useEffect(() => {
    const target = (isAuthenticated && user?.email) ? user.email : email;
    if (target) {
      if (isAuthenticated && user?.email && email !== user.email) {
        setEmail(user.email);
      }
      handleFetchLibrary(target);
    }
  }, [isAuthenticated, user?.email, email, handleFetchLibrary]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFetchLibrary(email);
  };

  // Extract all unique acquired book items from paid orders
  const acquiredBooks = [];
  const seenBookIds = new Set();

  if (orders) {
    orders.forEach((order) => {
      (order.downloads || []).forEach((dl) => {
        if (!seenBookIds.has(dl.bookId)) {
          seenBookIds.add(dl.bookId);
          const fullBook = BOOKS_DATA.find((b) => b.id === dl.bookId) || {
            id: dl.bookId,
            title: dl.title,
            author: 'Aetheria Editorial',
            category: 'Curated Edition',
            coverImage: `/assets/covers/${dl.bookId}.jpg`
          };
          acquiredBooks.push({
            ...fullBook,
            orderId: order.orderId,
            downloadPdfUrl: dl.downloadUrl,
            downloadEpubUrl: dl.downloadEpubUrl,
            paidAt: order.paidAt
          });
        }
      });
    });
  }

  return (
    <div className="min-h-screen py-12 md:py-20 text-[var(--site-text)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-white/5 border border-black/5 dark:border-white/10 text-[#997328] dark:text-[#c5a059] text-xs font-mono font-bold mb-3">
            <Download className="w-3.5 h-3.5" />
            <span>SOVEREIGN DIGITAL VAULT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
            Customer Library & Master Files
          </h1>
          <p className="text-sm sm:text-base text-[#6e6e73] dark:text-[#a1a1a6] mt-3 font-sans leading-relaxed">
            Enter the email address used during Razorpay acquisition. The server verifies your paid cryptographic licenses and issues refreshed 24-hour master PDF and EPUB download packages.
          </p>
        </div>

        {/* Authentication & Access Card */}
        {isAuthenticated && user ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-white/70 dark:bg-[#14161a]/80 backdrop-blur-md border border-black/10 dark:border-white/10 mb-12 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-black/10 dark:border-white/15 shadow-sm" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#1d1d1f] dark:bg-[#c5a059] text-white dark:text-black flex items-center justify-center font-bold text-lg">
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {user.name || 'Aetheria Reader'}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Google Verified
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">
                    {user.email} • Sovereign Bookshelf Synchronized
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleFetchLibrary(user.email)}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-[#1d1d1f] dark:bg-[#c5a059] hover:bg-black dark:hover:bg-[#dfb76c] text-white dark:text-black font-mono font-bold text-xs transition shadow-sm cursor-pointer"
                >
                  {isLoading ? 'SYNCING...' : 'REFRESH VAULT'}
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 rounded-xl border border-black/10 dark:border-white/10 text-[#6e6e73] dark:text-[#a1a1a6] hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 rounded-2xl bg-white/70 dark:bg-[#14161a]/80 backdrop-blur-md border border-black/10 dark:border-white/10 mb-12 shadow-xs space-y-6">
            {/* Google Sign-In Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5 dark:border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#997328] dark:text-[#c5a059]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RECOMMENDED PATRON ACCESS</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Sign in with Google for 1-Click Library Access
                </h3>
                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] font-sans">
                  Instantly retrieve all verified acquisitions across devices with zero password friction.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl bg-white dark:bg-[#1c1f26] border border-black/15 dark:border-white/15 hover:border-[#c5a059] text-xs font-mono font-bold text-[#1d1d1f] dark:text-white transition shadow-sm hover:shadow shrink-0 cursor-pointer active:scale-98"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Guest Email Lookup Option */}
            <div>
              <p className="text-[11px] font-mono text-[#6e6e73] dark:text-[#a1a1a6] mb-2 uppercase tracking-wider">
                Or look up guest order by purchase email:
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter order email address (e.g. patron@aetheria.luxury)..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#f5f5f7] dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[#997328] dark:focus:border-[#c5a059] rounded-xl px-4 py-2.5 text-xs font-mono text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] dark:placeholder-[#71717a] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#1d1d1f] dark:bg-[#c5a059] hover:bg-black dark:hover:bg-[#dfb76c] text-white dark:text-black font-mono font-bold text-xs tracking-wider transition shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? 'SEARCHING...' : 'LOOKUP ORDERS'}
                  <ArrowRight className="w-3.5 h-3.5 text-[#c5a059] dark:text-black" />
                </button>
              </form>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* Library Display */}
        {orders !== null && (
          <div>
            {acquiredBooks.length === 0 ? (
              <div className="p-16 rounded-3xl bg-[#f5f5f7] dark:bg-[#14161a] border border-black/10 dark:border-white/10 text-center max-w-md mx-auto">
                <BookOpen className="w-12 h-12 text-[#86868b] dark:text-[#71717a] mx-auto mb-4" />
                <h3 className="text-lg font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                  No verified purchases found
                </h3>
                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] mb-6 font-sans">
                  No paid orders are registered under "{email}". If you recently completed payment, please confirm the email address matches checkout.
                </p>
                <Link
                  to="/books"
                  className="px-6 py-2.5 rounded-full bg-[#1d1d1f] dark:bg-[#c5a059] text-white dark:text-black text-xs font-bold font-mono hover:bg-black dark:hover:bg-[#dfb76c] transition"
                >
                  BROWSE CATALOGUE
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#997328] dark:text-[#c5a059] font-bold">
                    FOUND {acquiredBooks.length} VERIFIED {acquiredBooks.length === 1 ? 'PUBLICATION' : 'PUBLICATIONS'}
                  </span>
                  <span className="text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6]">
                    Licensed to {email}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {acquiredBooks.map((item) => (
                    <div 
                      key={item.id}
                      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#14161a] border border-black/10 dark:border-white/10 shadow-xs flex flex-col sm:flex-row gap-5 items-start justify-between"
                    >
                      {/* Cover thumbnail */}
                      <div className="w-24 aspect-[2/3] rounded-lg overflow-hidden bg-[#f5f5f7] dark:bg-black/40 border border-black/10 dark:border-white/10 shrink-0">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content & Actions */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#997328] dark:text-[#c5a059] font-bold block">
                            {item.category}
                          </span>
                          <h3 className="text-base font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                            {item.title}
                          </h3>
                          <span className="text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6]">
                            By {item.author}
                          </span>
                        </div>

                        {/* Format Download Buttons */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <a
                            href={item.downloadPdfUrl}
                            download
                            className="px-3 py-1.5 rounded-lg bg-[#1d1d1f] dark:bg-[#c5a059] hover:bg-black dark:hover:bg-[#dfb76c] text-white dark:text-black text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5 text-[#c5a059] dark:text-black" />
                            <span>PDF Master</span>
                          </a>

                          <a
                            href={item.downloadEpubUrl}
                            download
                            className="px-3 py-1.5 rounded-lg bg-[#f5f5f7] dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/10 dark:border-white/10 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                            <span>EPUB Edition</span>
                          </a>

                          <Link
                            to={`/read/${item.id}`}
                            className="px-3 py-1.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-xs"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Web Reader</span>
                          </Link>
                        </div>

                        <div className="text-[10px] font-mono text-[#86868b] dark:text-[#71717a] pt-1">
                          Order Ref: {item.orderId} • DRM-Free Sovereign License
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
