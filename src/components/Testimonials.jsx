import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { REVIEWS } from '../data/booksData';

export default function Testimonials() {
  return (
    <section className="py-20 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 block mb-2 font-semibold">
            DISPATCHES FROM THE AVANT-GARDE
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Endorsed by Visionaries & Operators
          </h2>
          <p className="text-sm text-slate-400 mt-3 font-light">
            Read by over 140,000 founders, researchers, and portfolio managers across 82 countries.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-gold-500/30 transition-all flex flex-col justify-between group hover:-translate-y-1 duration-300"
            >
              <div>
                {/* Stars and verified badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-gold-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> VERIFIED READER
                  </span>
                </div>

                {/* Book Title Reference */}
                <span className="text-[11px] font-mono text-gold-400/90 block mb-3 font-medium">
                  Re: {review.bookTitle}
                </span>

                {/* Review Text */}
                <p className="text-sm text-slate-300 font-light leading-relaxed italic mb-6">
                  "{review.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border border-gold-500/30"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{review.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
