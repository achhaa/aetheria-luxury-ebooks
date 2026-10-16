import React from 'react';
import { 
  Sparkles, BookOpen, ArrowRight, ShieldCheck, 
  Film, CheckCircle2, ShoppingBag
} from 'lucide-react';

export default function HeroSection({ 
  featuredBook, 
  onOpenSample, 
  onOpenDetail, 
  onBuyNow 
}) {
  return (
    <section id="hero" className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden scroll-mt-20">
      {/* Ambient Radial Spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-gradient-to-tr from-[#c5a059]/10 via-sky-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Editorial Label */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c5a059]/30 bg-black/40 backdrop-blur-md text-xs font-mono text-[#c5a059]">
            <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
            <span className="font-semibold text-white">ALL PUBLICATIONS IN INR</span>
            <span>•</span>
            <span>EVERY EDITION UNDER ₹500</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left: Editorial Storytelling */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-extrabold tracking-tight leading-[1.08] text-white">
              The Digital <br />
              <span className="gold-gradient-text">Publishing Atelier</span> <br />
              for Inquiring Minds.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Aetheria creates original, peer-reviewed e-books on Artificial Agency, Asymmetric Finance, Offensive Cybersecurity, and Modern Stoic Command. Designed for effortless reading in warm ivory and delivered with instantaneous DRM-free master files.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
                <span>Warm Ivory Reader</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0ea5e9]" />
                <span>Razorpay Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span>Print-Grade Vector PDF</span>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => onOpenSample(featuredBook)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#c5a059] hover:bg-[#d4af37] text-[#07080a] font-bold text-xs tracking-wider shadow-[0_0_25px_rgba(197,160,89,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>READ SAMPLE CHAPTER (FREE)</span>
              </button>

              <button
                onClick={() => onOpenDetail(featuredBook)}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-white/15 hover:border-[#c5a059]/40 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-mono tracking-wide transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                <span>VIEW BOOK DOSSIER</span>
              </button>
            </div>

            {/* Trust Metrics */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5 text-white">
                <span className="font-bold text-[#c5a059]">₹299</span>
                <span>Fixed Transparent Pricing</span>
              </div>
              <div className="h-4 w-px bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>30-Day Sovereign Guarantee</span>
              </div>
            </div>

          </div>

          {/* Right: Featured Book Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              onClick={() => onOpenDetail(featuredBook)}
              className="relative w-72 sm:w-80 md:w-88 rounded-2xl overflow-hidden cursor-pointer group bg-[#0d0f14] border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] hover:border-[#c5a059]/50 transition-all duration-500"
            >
              <div className="relative h-[430px] w-full overflow-hidden">
                <img
                  src={featuredBook.coverImage}
                  alt={featuredBook.title}
                  className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Left Spine Crease */}
                <div className="absolute top-0 bottom-0 left-0 w-5 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />
                <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-white/20 pointer-events-none" />

                {/* Bottom Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-black/80 border border-[#c5a059]/40 text-[#c5a059] font-mono text-[10px] uppercase">
                      Featured Release
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#c5a059] text-black font-mono font-bold text-xs">
                      ₹{featuredBook.priceINR}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#c5a059] block mb-1">
                      {featuredBook.category}
                    </span>
                    <h2 className="text-2xl font-display font-bold text-white leading-tight mb-2">
                      {featuredBook.title}
                    </h2>
                    <p className="text-xs text-slate-300 line-clamp-2 mb-4 font-light">
                      {featuredBook.subtitle}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-xs font-mono text-slate-300">
                        {featuredBook.pages} Pages • DRM-Free
                      </span>
                      <span className="text-xs font-mono text-[#c5a059] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
