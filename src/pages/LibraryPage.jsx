import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Download, BookOpen, ArrowRight, AlertCircle } from 'lucide-react';

import { BOOKS_DATA } from '../data/booksData';

export default function LibraryPage() {
  const [email, setEmail] = useState(() => localStorage.getItem('aetheria_customer_email') || '');
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

  // Auto-fetch if email saved
  useEffect(() => {
    if (email) {
      handleFetchLibrary(email);
    }
  }, [email, handleFetchLibrary]);

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
    <div className="bg-white min-h-screen py-12 md:py-20 text-[#1d1d1f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f7] text-[#997328] text-xs font-mono font-bold mb-3">
            <Download className="w-3.5 h-3.5" />
            <span>SOVEREIGN DIGITAL VAULT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#1d1d1f] tracking-tight">
            Customer Library & Master Files
          </h1>
          <p className="text-sm sm:text-base text-[#6e6e73] mt-3 font-sans leading-relaxed">
            Enter the email address used during Razorpay acquisition. The server verifies your paid cryptographic licenses and issues refreshed 24-hour master PDF and EPUB download packages.
          </p>
        </div>

        {/* Email Lookup Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#f5f5f7] border border-black/10 mb-12 shadow-xs">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="Enter customer email address (e.g. patron@aetheria.luxury)..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border border-black/10 focus:border-[#997328] rounded-xl px-4 py-3 text-xs font-mono text-[#1d1d1f] placeholder-[#86868b] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-mono font-bold text-xs tracking-wider transition shrink-0 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>VERIFYING...</span>
                </>
              ) : (
                <>
                  <span>AUTHENTICATE & RETRIEVE</span>
                  <ArrowRight className="w-4 h-4 text-[#c5a059]" />
                </>
              )}
            </button>
          </form>

          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Library Display */}
        {orders !== null && (
          <div>
            {acquiredBooks.length === 0 ? (
              <div className="p-16 rounded-3xl bg-[#f5f5f7] border border-black/10 text-center max-w-md mx-auto">
                <BookOpen className="w-12 h-12 text-[#86868b] mx-auto mb-4" />
                <h3 className="text-lg font-serif font-bold text-[#1d1d1f] mb-2">
                  No verified purchases found
                </h3>
                <p className="text-xs text-[#6e6e73] mb-6 font-sans">
                  No paid orders are registered under "{email}". If you recently completed payment, please confirm the email address matches checkout.
                </p>
                <Link
                  to="/books"
                  className="px-6 py-2.5 rounded-full bg-[#1d1d1f] text-white text-xs font-bold font-mono hover:bg-black transition"
                >
                  BROWSE CATALOGUE
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-black/10">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#997328] font-bold">
                    FOUND {acquiredBooks.length} VERIFIED {acquiredBooks.length === 1 ? 'PUBLICATION' : 'PUBLICATIONS'}
                  </span>
                  <span className="text-xs font-mono text-[#6e6e73]">
                    Licensed to {email}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {acquiredBooks.map((item) => (
                    <div 
                      key={item.id}
                      className="p-5 sm:p-6 rounded-2xl bg-white border border-black/10 shadow-xs flex flex-col sm:flex-row gap-5 items-start justify-between"
                    >
                      {/* Cover thumbnail */}
                      <div className="w-24 aspect-[2/3] rounded-lg overflow-hidden bg-[#f5f5f7] border border-black/10 shrink-0">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content & Actions */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#997328] font-bold block">
                            {item.category}
                          </span>
                          <h3 className="text-base font-serif font-bold text-[#1d1d1f]">
                            {item.title}
                          </h3>
                          <span className="text-xs font-mono text-[#6e6e73]">
                            By {item.author}
                          </span>
                        </div>

                        {/* Format Download Buttons */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <a
                            href={item.downloadPdfUrl}
                            download
                            className="px-3 py-1.5 rounded-lg bg-[#1d1d1f] hover:bg-black text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5 text-[#c5a059]" />
                            <span>PDF Master</span>
                          </a>

                          <a
                            href={item.downloadEpubUrl}
                            download
                            className="px-3 py-1.5 rounded-lg bg-[#f5f5f7] hover:bg-gray-200 text-[#1d1d1f] border border-black/10 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-700" />
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

                        <div className="text-[10px] font-mono text-[#86868b] pt-1">
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
