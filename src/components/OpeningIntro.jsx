import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export default function OpeningIntro({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0: ambient backdrop, 1: monogram emblem, 2: typography unveil, 3: enter CTA
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = useCallback(() => {
    try {
      sessionStorage.setItem('aetheria_intro_shown', 'true');
    } catch (e) {
      console.debug('sessionStorage write error:', e);
    }
    setIsDismissed(true);
    setTimeout(() => {
      onComplete();
    }, 550);
  }, [onComplete]);

  useEffect(() => {
    // Respect user's reduced motion preference immediately
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      try {
        sessionStorage.setItem('aetheria_intro_shown', 'true');
      } catch (e) {
        console.debug('sessionStorage error:', e);
      }
      onComplete();
      return;
    }

    // Choreographed 4-phase reveal sequence (total ~4.4s before graceful auto-fade)
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2700);
    const tAutoExit = setTimeout(() => handleDismiss(), 4400);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tAutoExit);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete, handleDismiss]);

  return (
    <motion.div
      role="dialog"
      aria-label="Aetheria Brand Introduction"
      initial={{ opacity: 0 }}
      animate={{ opacity: isDismissed ? 0 : 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#07080a] text-slate-100 select-none overflow-hidden ${
        isDismissed ? 'pointer-events-none' : ''
      }`}
    >
      {/* Ambient Brand Video Layer (Local Asset) */}
      <video
        autoPlay
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none filter contrast-125 brightness-75 mix-blend-screen"
        src="/assets/videos/brand-intro.mp4"
      />

      {/* Cinematic Ambient Radial Illumination */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: phase >= 1 ? [1, 1.08, 1.04] : 0.9,
            opacity: phase >= 1 ? 0.85 : 0.35,
          }}
          transition={{ duration: 3, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] rounded-full bg-gradient-to-tr from-amber-500/15 via-cyan-500/5 to-transparent blur-[130px]"
        />

        {/* Minimal Hairline Crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" />
          <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-[#c5a059] to-transparent" />
        </div>
      </div>

      {/* Accessible "Skip Intro" Button */}
      <div className="absolute top-6 right-6 z-30">
        <button
          type="button"
          onClick={handleDismiss}
          className="px-4 py-2 rounded-full border border-white/15 hover:border-[#c5a059]/60 bg-black/40 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c5a059]/60 active:scale-95 shadow-md"
          aria-label="Skip cinematic introduction"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3 h-3 text-[#c5a059]" />
        </button>
      </div>

      {/* Choreographed Central Emblem & Typography Reveal */}
      <div className="relative z-10 max-w-lg mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Apple-style Monogram Emblem */}
        <div className="relative mb-8">
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ scale: 0.7, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                className="w-20 h-20 rounded-2xl border border-[#c5a059]/40 bg-[#0d0f14]/85 backdrop-blur-xl flex items-center justify-center shadow-[0_0_45px_rgba(197,160,89,0.3)] relative overflow-hidden"
              >
                <BookOpen className="w-9 h-9 text-[#d4af37]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sub-label with Staggered Reveal */}
        {phase >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] uppercase tracking-[0.4em] text-[#c5a059] mb-3 font-mono font-semibold"
          >
            Atelier of Modern Thought
          </motion.p>
        )}

        {/* Brand Name */}
        {phase >= 2 && (
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-white mb-4"
          >
            AETHERIA
          </motion.h1>
        )}

        {/* Tagline */}
        {phase >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base text-slate-300 font-light max-w-sm mx-auto leading-relaxed mb-8"
          >
            Curated masterworks on Artificial Agency, Asymmetric Wealth, and Sovereign Resilience.
          </motion.p>
        )}

        {/* Enter Atelier CTA */}
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          >
            <button
              type="button"
              onClick={handleDismiss}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#c5a059] to-[#dfc079] text-[#07080a] font-semibold text-xs tracking-wider shadow-[0_0_25px_rgba(197,160,89,0.35)] hover:shadow-[0_0_35px_rgba(197,160,89,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>ENTER ATELIER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Editorial Trust Assurance */}
        <div className="mt-10 text-[10px] font-mono text-slate-400 tracking-wider flex items-center gap-2 opacity-60">
          <Sparkles className="w-3 h-3 text-[#c5a059]" />
          <span>ORIGINAL MANUSCRIPTS • VERIFIED RAZORPAY SETTLEMENT • DRM-FREE</span>
        </div>
      </div>
    </motion.div>
  );
}
