import React from 'react';
import { Sparkles, Quote } from 'lucide-react';
import { EDITORIAL_DISPATCHES } from '../data/booksData';

export default function Testimonials() {
  return (
    <section className="py-20 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#c5a059]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CRITICAL PERSPECTIVES & DISPATCHES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Early Reader Observations
          </h2>
          <p className="text-sm text-slate-400 font-light">
            Reflections from early review editions exploring agency, asymmetric risk, and computational defense.
          </p>
        </div>

        {/* Dispatches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EDITORIAL_DISPATCHES.map((dispatch) => (
            <div
              key={dispatch.id}
              className="p-7 rounded-2xl bg-[#0d0f14] border border-white/10 hover:border-[#c5a059]/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#c5a059] px-2.5 py-1 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20">
                    {dispatch.topic}
                  </span>
                  <Quote className="w-5 h-5 text-white/20 group-hover:text-[#c5a059]/40 transition-colors" />
                </div>

                <span className="text-xs font-mono text-slate-400 block mb-2">
                  Regarding: <span className="text-white font-semibold">{dispatch.bookRef}</span>
                </span>

                <h3 className="text-base font-display font-bold text-white mb-3">
                  {dispatch.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-serif italic leading-relaxed mb-6">
                  "{dispatch.note}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Pen Name Attribution:</span>
                <span className="text-slate-200 font-semibold">{dispatch.authorCredit}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

