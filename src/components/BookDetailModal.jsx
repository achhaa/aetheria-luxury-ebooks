import React from 'react';
import { 
  X, BookOpen, ShoppingBag, ShieldCheck, Clock, CheckCircle2, FileText, Info
} from 'lucide-react';

export default function BookDetailModal({ 
  book, 
  isOpen, 
  onClose, 
  onOpenSample, 
  onBuyNow 
}) {
  if (!isOpen || !book) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label={`${book.title} Dossier`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#0c0e14] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden my-6">
        
        {/* Header */}
        <header className="h-16 px-6 bg-[#07080a] border-b border-white/10 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c5a059]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold">
              EDITORIAL DOSSIER • {book.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Main Book Presentation: Cover Artwork & Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Real Supplied Book Cover Artwork */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[280px] aspect-[2/3] rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/70 via-black/25 to-transparent pointer-events-none" />
                <div className="absolute top-0 bottom-0 left-3 w-px bg-white/20 pointer-events-none" />
              </div>
            </div>

            {/* Book Metadata & Purchase Summary */}
            <div className="md:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#c5a059]">
                  {book.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ISBN: {book.isbn}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
                {book.title}
              </h1>

              <p className="text-sm text-slate-300 font-light leading-relaxed">
                {book.subtitle}
              </p>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 space-y-1">
                <div>Author: <strong className="text-white">{book.author}</strong> <span className="text-[#c5a059]">({book.authorType})</span></div>
                <div className="text-slate-400 text-[11px]">{book.authorRole}</div>
                <div className="text-slate-400 text-[11px] pt-1 border-t border-white/5">{book.pages} pages • {book.readTime} study duration • {book.edition}</div>
              </div>

              {/* Price & Action Box */}
              <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                      OFFICIAL INR PRICE
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-display font-extrabold text-[#c5a059]">
                        ₹{book.priceINR}
                      </span>
                      <span className="text-sm font-mono text-slate-400 line-through">
                        ₹{book.originalPriceINR}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono text-right">
                    ✓ Verified Razorpay Instant Delivery
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onBuyNow(book);
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#c5a059] hover:bg-[#d4af37] text-black font-bold text-xs tracking-wider transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ACQUIRE — ₹{book.priceINR}</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenSample(book);
                    }}
                    className="w-full py-3.5 rounded-xl border border-white/15 hover:border-[#c5a059]/40 text-slate-200 hover:text-white text-xs font-mono transition flex items-center justify-center gap-2 bg-white/5"
                  >
                    <BookOpen className="w-4 h-4 text-[#c5a059]" />
                    <span>READ SAMPLE (FREE)</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400 flex justify-between">
                  <span>• Vector PDF & EPUB</span>
                  <span>• 30-Day Guarantee</span>
                  <span>• DRM-Free</span>
                </div>
              </div>
            </div>

          </div>

          {/* Description */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <h3 className="text-lg font-display font-bold text-white">
              Publication Overview
            </h3>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* Key Takeaways */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#c5a059] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> CORE ARCHITECTURAL TAKEAWAYS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {book.keyTakeaways.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 font-light leading-relaxed">
                  <span className="text-[#c5a059] font-bold shrink-0">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table of Contents */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold text-white">
              Table of Contents
            </h3>
            <div className="divide-y divide-white/5 border-y border-white/10 text-xs">
              {book.tableOfContents.map((ch) => (
                <div key={ch.number} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-mono text-[#c5a059] font-bold mr-2">Chapter {ch.number}:</span>
                    <span className="font-semibold text-white">{ch.title}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{ch.subtitle}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
