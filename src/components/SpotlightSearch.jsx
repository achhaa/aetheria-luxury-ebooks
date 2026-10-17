import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOKS_DATA } from '../data/booksData';

export default function SpotlightSearch({ isMobile = false, onCloseMobile = null }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  // Click outside listener to dismiss popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching books
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return BOOKS_DATA.filter((b) => {
      return (
        b.title.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    });
  }, [query]);

  // Reset selectedIndex when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleSelectBook = (bookId) => {
    setIsOpen(false);
    setQuery('');
    if (onCloseMobile) onCloseMobile();
    navigate(`/books/${bookId}`);
  };

  const handleFullCatalogueSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onCloseMobile) onCloseMobile();
      navigate(`/books?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Enter') {
        handleFullCatalogueSearch(e);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectBook(results[selectedIndex].id);
      } else {
        handleFullCatalogueSearch(e);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Bar */}
      <form onSubmit={handleFullCatalogueSearch} className="relative w-full">
        <Search className="w-3.5 h-3.5 text-[#6e6e73] dark:text-[#a1a1a6] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder={isMobile ? "Search books or topics..." : "Search titles, topics, authors... (⌘K)"}
          value={query}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-[#f5f5f7] dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 focus:border-[#997328] dark:focus:border-[#c5a059] rounded-full pl-9 pr-8 py-1.5 text-xs font-mono text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#6e6e73] dark:placeholder-[#86868b] focus:outline-none transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Floating Apple-Grade Spotlight Dropdown Popover */}
      <AnimatePresence>
        {isOpen && query.trim().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute left-0 z-50 mt-2 bg-white/95 dark:bg-[#14161a]/95 backdrop-blur-xl border border-black/10 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden text-[#1d1d1f] dark:text-[#f5f5f7] ${
              isMobile ? 'w-full' : 'w-[420px] max-w-[90vw]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-[10px] font-mono uppercase tracking-wider text-[#6e6e73] dark:text-[#a1a1a6]">
              <span>Matching Titles ({results.length})</span>
              <span className="hidden sm:inline">Use ↑ ↓ to navigate</span>
            </div>

            {/* Results List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-black/5 dark:divide-white/5 py-1">
              {results.length > 0 ? (
                results.map((book, idx) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => handleSelectBook(book.id)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                      selectedIndex === idx
                        ? 'bg-[#f5f5f7] dark:bg-white/10 text-[#1d1d1f] dark:text-white'
                        : 'hover:bg-black/[0.03] dark:hover:bg-white/5'
                    }`}
                  >
                    {/* Book Thumbnail */}
                    <img
                      src={`/assets/covers/${book.coverImage}`}
                      alt={book.title}
                      className="w-8 h-11 object-cover rounded shadow-xs shrink-0 border border-black/10 dark:border-white/10"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-xs truncate">
                          {book.title}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#997328] dark:text-[#c5a059] shrink-0 font-semibold">
                          ₹{book.priceINR}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6e6e73] dark:text-[#a1a1a6] truncate font-sans mt-0.5">
                        {book.author} • {book.category}
                      </p>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-[#6e6e73] dark:text-[#a1a1a6] opacity-0 group-hover:opacity-100 shrink-0" />
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6]">
                  <BookOpen className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p>No titles found matching &ldquo;{query}&rdquo;</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      if (onCloseMobile) onCloseMobile();
                      navigate('/books');
                    }}
                    className="mt-2 text-[11px] text-[#997328] dark:text-[#c5a059] underline cursor-pointer"
                  >
                    Browse Complete Catalogue →
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {results.length > 0 && (
              <div 
                onClick={handleFullCatalogueSearch}
                className="px-3.5 py-2 bg-[#f5f5f7] dark:bg-white/5 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-[#997328] dark:text-[#c5a059] hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition"
              >
                <span>View all results in Catalogue</span>
                <span className="flex items-center gap-1 text-[10px] text-[#6e6e73] dark:text-[#a1a1a6]">
                  <span>Press</span>
                  <kbd className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-sans font-bold">↵</kbd>
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
