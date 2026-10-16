import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ArrowUpDown, BookOpen, Sparkles, Filter } from 'lucide-react';

import { BOOKS_DATA, CATEGORIES } from '../data/booksData';
import BookCard from '../components/BookCard';

export default function CatalogPage({ onBuyNow, activePlayingId, setActivePlayingId }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All Books';
  const initialSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    if (cat) setActiveCategory(cat);
    if (q) setSearchQuery(q);
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
    <div className="bg-white min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f7] text-[#997328] text-xs font-mono font-bold mb-3">
            <span>CURATED EDITIONS</span>
            <span>•</span>
            <span>ALL TITLES UNDER ₹500</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#1d1d1f] tracking-tight">
            Original Authoritative Catalogue
          </h1>
          <p className="text-sm sm:text-base text-[#6e6e73] mt-3 font-sans leading-relaxed">
            Every title represents a distinct intellectual investigation. Purchases include instant vector PDF downloads, universal EPUB for Kindle/Apple Books, and permanent lifetime reading access.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-black/10">
          
          {/* Search Box */}
          <div className="relative w-full md:max-w-sm">
            <Search className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, author, or discipline..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-black/10 rounded-full pl-9 pr-4 py-2 text-xs font-mono text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#997328]"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs font-mono text-[#6e6e73] flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#f5f5f7] border border-black/10 rounded-xl px-3 py-1.5 text-xs font-mono text-[#1d1d1f] focus:outline-none focus:border-[#997328]"
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
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[#1d1d1f] text-white font-bold shadow-xs'
                  : 'bg-[#f5f5f7] hover:bg-gray-200 text-[#515154] border border-black/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#f5f5f7] border border-black/10 text-center max-w-md mx-auto my-12">
            <BookOpen className="w-12 h-12 text-[#86868b] mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold text-[#1d1d1f] mb-2">No publications found</h3>
            <p className="text-xs text-[#6e6e73] mb-6 font-sans">
              Try searching for "Mind", "Stoic", or "Cyber", or reset your active filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All Books');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="px-6 py-2.5 rounded-full bg-[#1d1d1f] text-white text-xs font-bold font-mono hover:bg-black transition shadow-xs"
            >
              RESET CATALOGUE
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onBuyNow={onBuyNow}
                activePlayingId={activePlayingId}
                setActivePlayingId={setActivePlayingId}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
