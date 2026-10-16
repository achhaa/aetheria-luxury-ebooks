import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export default function OpeningIntro({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0: initial ambient light, 1: monogram reveal, 2: typography unveil, 3: ready/exit
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Respect user's reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 3200);
    const tAutoExit = setTimeout(() => handleExit(), 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tAutoExit);
    };
  }, []);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  return (
    <div
      role="dialog"
      aria-label="Aetheria Introduction"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#07080a] text-slate-100 transition-all duration-700 ease-out select-none ${
        isExiting ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Cinematic Ambient Backdrop & Light Shimmer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft focused radial illumination */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-tr from-amber-500/10 via-cyan-500/5 to-transparent blur-[120px] transition-all duration-1000 ${
            phase >= 1 ? 'opacity-90 scale-110' : 'opacity-30 scale-90'
          }`} 
        />

        {/* Subtle geometric hairline cross */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" />
          <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-[#c5a059] to-transparent" />
        </div>
      </div>

      {/* Skip Intro Button — Always immediately available */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleExit}
          className="px-4 py-2 rounded-full border border-white/10 hover:border-[#c5a059]/40 bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
          aria-label="Skip cinematic introduction"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Choreographed Central Emblem & Brand Reveal */}
      <div className="relative z-10 max-w-lg mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Apple-style Monogram with Polished Backlight */}
        <div 
          className={`relative mb-8 transition-all duration-1000 ease-out ${
            phase >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <div className="w-20 h-20 rounded-2xl border border-[#c5a059]/40 bg-[#0d0f14]/80 backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_rgba(197,160,89,0.25)] relative overflow-hidden group">
            <BookOpen className="w-9 h-9 text-[#d4af37]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Sub-label with Staggered Fade */}
        <p 
          className={`text-[10px] uppercase tracking-[0.4em] text-[#c5a059] mb-3 font-mono font-medium transition-all duration-700 delay-100 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          Atelier of Modern Thought
        </p>

        {/* Brand Name */}
        <h1 
          className={`text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-white mb-4 transition-all duration-700 delay-200 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          AETHERIA
        </h1>

        {/* Tagline */}
        <p 
          className={`text-sm sm:text-base text-slate-300 font-light max-w-sm mx-auto leading-relaxed mb-8 transition-all duration-700 delay-300 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          Curated masterworks on Artificial Agency, Asymmetric Wealth, and Sovereign Resilience.
        </p>

        {/* Subtle Indicator & Enter CTA */}
        <div 
          className={`transition-all duration-500 delay-400 ${
            phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={handleExit}
            className="px-7 py-3 rounded-full bg-gradient-to-r from-[#c5a059] to-[#dfc079] text-[#07080a] font-semibold text-xs tracking-wider shadow-[0_0_25px_rgba(197,160,89,0.35)] hover:shadow-[0_0_35px_rgba(197,160,89,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>ENTER ATELIER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-10 text-[10px] font-mono text-slate-300 tracking-wider flex items-center gap-2 opacity-50">
          <Sparkles className="w-3 h-3 text-[#c5a059]" />
          <span>ORIGINAL MANUSCRIPTS • VERIFIED RAZORPAY SETTLEMENT • DRM-FREE</span>
        </div>
      </div>
    </div>
  );
}
