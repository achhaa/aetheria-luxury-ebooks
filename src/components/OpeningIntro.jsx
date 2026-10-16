import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX, ArrowRight, BookOpen } from 'lucide-react';
import { playBookOpenSound } from '../utils/audioSynthesis';

export default function OpeningIntro({ onComplete, onToggleAudio, isAudioOn }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // 'loading', 'ready', 'exiting'

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setPhase('ready');
          return 100;
        }
        const increment = Math.floor(Math.random() * 12) + 6;
        return Math.min(100, prev + increment);
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  const handleEnter = () => {
    setPhase('exiting');
    playBookOpenSound();
    setTimeout(() => {
      onComplete();
    }, 900);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950 transition-all duration-1000 ${
        phase === 'exiting' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,rgba(6,7,9,0.98)_70%)] pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #d4af37 1px, transparent 1px), linear-gradient(to bottom, #d4af37 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Animated Brand Monogram */}
        <div className="relative mb-8 group cursor-pointer" onClick={handleEnter}>
          <div className="w-24 h-24 rounded-2xl border border-gold-500/40 bg-obsidian-900/80 backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.25)] transition-all duration-700 group-hover:scale-105 group-hover:border-gold-400 group-hover:shadow-[0_0_70px_rgba(212,175,55,0.45)]">
            <BookOpen className="w-12 h-12 text-gold-accent animate-pulse-glow" />
          </div>
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-gold-400/20 via-cyan-500/20 to-purple-500/20 blur-xl opacity-70 group-hover:opacity-100 transition duration-700" />
        </div>

        {/* Brand Name with Staggered Glow */}
        <p className="text-xs uppercase tracking-[0.35em] text-gold-400/80 mb-3 font-mono font-medium">
          Privé Edition • Digital Atelier
        </p>
        <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight mb-4 gold-gradient-text">
          AETHERIA
        </h1>
        <p className="text-slate-300 font-light text-base md:text-lg max-w-md mx-auto leading-relaxed mb-8">
          Curating the zenith of human wisdom, artificial intelligence, and sovereign leadership.
        </p>

        {/* Progress bar or Enter button */}
        {phase === 'loading' ? (
          <div className="w-64 flex flex-col items-center gap-2">
            <div className="w-full h-1 bg-obsidian-800 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-amber-200 transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between w-full text-xs font-mono text-slate-400">
              <span>INITIALIZING ATELIER</span>
              <span>{progress}%</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
            <button
              onClick={handleEnter}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-amber-300 text-obsidian-950 font-semibold text-sm tracking-wide shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
            >
              <span>ENTER EXPERIENCE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleAudio}
              className="px-4 py-3 rounded-full border border-white/10 hover:border-gold-500/40 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-all flex items-center gap-2"
              title="Toggle Ambient Audio"
            >
              {isAudioOn ? (
                <>
                  <Volume2 className="w-4 h-4 text-gold-400 animate-pulse" />
                  <span>AMBIENCE: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>AMBIENCE: MUTED</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Subtext */}
        <div className="mt-12 text-[11px] font-mono text-slate-300 tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>INTERACTIVE 3D READERS • VECTOR AUDIOS • DRM-FREE COPIES</span>
        </div>
      </div>
    </div>
  );
}
