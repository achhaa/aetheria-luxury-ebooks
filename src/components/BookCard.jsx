import React from 'react';
import { Star, Eye, ShoppingBag, BookOpen, Film, ArrowRight } from 'lucide-react';

export default function BookCard({ 
  book, 
  onOpenSample, 
  onOpenDetail, 
  onBuyNow 
}) {
  return (
    <article className="group relative rounded-2xl bg-[#0d0f14] p-5 flex flex-col justify-between border border-white/10 hover:border-[#c5a059]/40 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]">
      
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
            {book.category}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#c5a059]/15 text-[#d4af37] border border-[#c5a059]/30">
            {book.badge}
          </span>
        </div>

        {/* Book Cover Container */}
        <div 
          onClick={() => onOpenDetail(book)}
          className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden cursor-pointer group/cover mb-5 flex items-center justify-center bg-black border border-white/10 shadow-lg"
        >
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-105 filter brightness-95"
          />

          {/* Left Spine Shadow Illusion */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-white/20 pointer-events-none" />

          {/* Quick Action Overlay on Cover Hover */}
          <div className="absolute inset-0 bg-[#07080a]/80 backdrop-blur-sm opacity-0 group-hover/cover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center gap-2">
            <span className="w-10 h-10 rounded-full bg-[#c5a059] text-black flex items-center justify-center shadow-lg font-bold">
              <Film className="w-5 h-5" />
            </span>
            <span className="text-xs font-display font-bold text-white tracking-wide">
              WATCH TRAILER & DOSSIER
            </span>
            <span className="text-[10px] font-mono text-[#c5a059]">
              10s Video • Table of Contents
            </span>
          </div>

          {/* Price Tag Overlay */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[#c5a059] text-xs font-mono font-bold border border-white/10 shadow-md">
            ₹{book.priceINR}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-mono text-[11px] text-slate-400">{book.pages} pages • {book.readTime}</span>
          <span className="font-mono text-[11px] text-[#c5a059]">Instant PDF + EPUB</span>
        </div>

        {/* Title & Subtitle */}
        <h3 
          onClick={() => onOpenDetail(book)}
          className="text-lg font-display font-bold text-white hover:text-[#c5a059] transition-colors line-clamp-1 cursor-pointer mb-1"
        >
          {book.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {book.subtitle}
        </p>

        {/* Author */}
        <div className="text-[11px] text-slate-400 font-mono mb-4">
          By <span className="text-slate-200">{book.author}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-display font-extrabold text-[#c5a059]">
                ₹{book.priceINR}
              </span>
              <span className="text-xs text-slate-400 line-through font-mono">
                ₹{book.originalPriceINR}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono block">Zero Shipping • Instant Download</span>
          </div>

          <button
            onClick={() => onBuyNow(book)}
            className="px-4 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d4af37] text-[#07080a] font-bold text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>BUY NOW</span>
          </button>
        </div>

        {/* Secondary Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onOpenSample(book)}
            className="py-1.5 px-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/20 bg-white/5 text-[11px] font-mono flex items-center justify-center gap-1 transition"
          >
            <BookOpen className="w-3 h-3 text-[#c5a059]" />
            <span>Read Sample</span>
          </button>

          <button
            onClick={() => onOpenDetail(book)}
            className="py-1.5 px-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/20 bg-white/5 text-[11px] font-mono flex items-center justify-center gap-1 transition"
          >
            <Film className="w-3 h-3 text-[#c5a059]" />
            <span>Trailer & Info</span>
          </button>
        </div>
      </div>

    </article>
  );
}
