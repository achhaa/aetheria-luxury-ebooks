import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ArrowUpDown, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { BOOKS_DATA, CATEGORIES } from '../data/booksData';
import BookCard from '../components/BookCard';

export default function CatalogPage({ onBuyNow, onAddToCart, activePlayingId, setActivePlayingId }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All Books';
  const initialSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    setActiveCategory(cat || 'All Books');
    setSearchQuery(q || '');
  }, [searchParams]);

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All Books') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val.trim()) {
      searchParams.set('search', val.trim());
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
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
    return 0;
  });

  return (
    <div className="min-h-screen py-12 md:py-20 text-[var(--site-text)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-white/5 border border-black/5 dark:border-white/10 text-[#997328] dark:text-[#c5a059] text-xs font-mono font-bold mb-3">
            <span>CURATED EDITIONS</span>
            <span>•</span>
            <span>ALL TITLES UNDER ₹500</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
            Original Authoritative Catalogue
          </h1>
          <p className="text-sm sm:text-base text-[#6e6e73] dark:text-[#a1a1a6] mt-3 font-sans leading-relaxed">
            Every title represents a distinct intellectual investigation. Purchases include instant vector PDF downloads, universal EPUB for Kindle/Apple Books, and permanent lifetime reading access.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-black/10 dark:border-white/10">
          
          {/* Search Box */}
          <div className="relative w-full md:max-w-sm">
            <Search className="w-4 h-4 text-[#86868b] dark:text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, author, or discipline..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#f5f5f7] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full pl-9 pr-8 py-2 text-xs font-mono text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] dark:placeholder-[#71717a] focus:outline-none focus:border-[#997328] dark:focus:border-[#c5a059]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#f5f5f7] dark:bg-[#1c1f26] border border-black/10 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:border-[#997328] dark:focus:border-[#c5a059]"
            >
              <option value="featured">Curated Sequence</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="pages">Length / Pages</option>
            </select>
          </div>

        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                activeCategory === cat
                  ? 'bg-[#1d1d1f] dark:bg-[#c5a059] text-white dark:text-black font-bold shadow-xs'
                  : 'bg-[#f5f5f7] dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[#515154] dark:text-[#a1a1a6] border border-black/5 dark:border-white/10'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#f5f5f7] dark:bg-[#14161a] border border-black/10 dark:border-white/10 text-center max-w-md mx-auto my-12">
            <BookOpen className="w-12 h-12 text-[#86868b] dark:text-[#71717a] mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">No publications found</h3>
            <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] mb-6 font-sans">
              Try searching for "Mind", "Stoic", or "Cyber", or reset your active filters.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                setActiveCategory('All Books');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="px-6 py-2.5 rounded-full bg-[#1d1d1f] dark:bg-[#c5a059] text-white dark:text-black text-xs font-bold font-mono hover:bg-black dark:hover:bg-[#dfb76c] transition shadow-xs cursor-pointer"
            >
              RESET CATALOGUE
            </motion.button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredBooks.map((book) => (
                <motion.div
                  key={book.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                >
                  <BookCard
                    book={book}
                    onBuyNow={onBuyNow}
                    onAddToCart={onAddToCart}
                    activePlayingId={activePlayingId}
                    setActivePlayingId={setActivePlayingId}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
}
