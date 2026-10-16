import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, BookOpen, ShoppingBag, Info, AlertCircle } from 'lucide-react';

export default function BookCard({ 
  book, 
  onOpenSample, 
  onOpenDetail, 
  onBuyNow,
  activePlayingId,
  setActivePlayingId
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);
  const videoRef = useRef(null);
  const cardRef = useRef(null);

  const isCurrentActive = activePlayingId === book.id;

  // Sync state if another card took over active video playback
  useEffect(() => {
    if (!isCurrentActive && isPlaying) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    }
  }, [isCurrentActive, isPlaying]);

  // Pause video if card scrolls out of viewport
  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && isPlaying) {
            handleStopVideo();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isPlaying]);

  const handleStartVideo = () => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    if (setActivePlayingId) {
      setActivePlayingId(book.id);
    }

    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.debug('Autoplay prevented:', e);
        setIsPlaying(false);
      });
    }
  };

  const handleStopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    if (activePlayingId === book.id && setActivePlayingId) {
      setActivePlayingId(null);
    }
  };

  // Touch / Mobile toggle handler
  const handleToggleTouchVideo = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      handleStopVideo();
    } else {
      handleStartVideo();
    }
  };

  return (
    <article 
      ref={cardRef}
      className="group relative rounded-2xl bg-[#0c0e14] p-4 sm:p-5 flex flex-col justify-between border border-white/10 hover:border-[#c5a059]/40 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
            {book.category}
          </span>
          <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-[#c5a059]/15 text-[#d4af37] border border-[#c5a059]/30">
            {book.badge}
          </span>
        </div>

        {/* Book Cover Frame with Inline Video Preview */}
        <div 
          onMouseEnter={handleStartVideo}
          onMouseLeave={handleStopVideo}
          className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#07080a] border border-white/10 shadow-lg mb-4 select-none cursor-pointer"
          onClick={() => onOpenDetail(book)}
        >
          {/* Static Cover Image */}
          {!imgError ? (
            <img
              src={book.coverImage}
              alt={book.title}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
                isPlaying ? 'opacity-0' : 'opacity-100'
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#12141a]">
              <AlertCircle className="w-8 h-8 text-[#c5a059] mb-2" />
              <span className="text-xs font-serif font-bold text-white">{book.title}</span>
              <span className="text-[10px] font-mono text-slate-400 mt-1">{book.author}</span>
            </div>
          )}

          {/* Inline Video Preview (Muted, inline, exact same aspect ratio frame) */}
          <video
            ref={videoRef}
            src={book.videoPreview}
            poster={book.coverImage}
            playsInline
            muted
            preload="none"
            onEnded={handleStopVideo}
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
              isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Book Spine Crease Simulation */}
          <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-gradient-to-r from-black/70 via-black/25 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 bottom-0 left-2.5 w-px bg-white/20 pointer-events-none z-10" />

          {/* Subtle Corner Play / Preview Badge */}
          <div className="absolute top-3 right-3 z-20">
            <button
              type="button"
              onClick={handleToggleTouchVideo}
              aria-label={isPlaying ? 'Stop video preview' : 'Play video preview'}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md ${
                isPlaying
                  ? 'bg-black/85 text-[#c5a059] border border-[#c5a059]/50'
                  : 'bg-black/60 hover:bg-black/80 text-white/90 border border-white/20 group-hover:border-[#c5a059]/40'
              }`}
            >
              {isPlaying ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
                  <span>Previewing</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 fill-current text-[#c5a059]" />
                  <span>Preview</span>
                </>
              )}
            </button>
          </div>

          {/* Price Ribbon */}
          <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[#c5a059] text-xs font-mono font-bold border border-white/10 shadow-md">
            ₹{book.priceINR}
          </div>
        </div>

        {/* Title & Author Info */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px]">{book.pages} pages • {book.readTime}</span>
            <span className="font-mono text-[10px] text-emerald-400">PDF + EPUB</span>
          </div>

          <h3 
            onClick={() => onOpenDetail(book)}
            className="text-base sm:text-lg font-display font-bold text-white hover:text-[#c5a059] transition-colors line-clamp-1 cursor-pointer"
          >
            {book.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {book.subtitle}
          </p>

          <div className="text-[11px] text-slate-400 font-mono pt-1">
            Author: <span className="text-slate-200 font-semibold">{book.author}</span>
            <span className="text-[9px] text-[#c5a059]/80 ml-1.5 px-1.5 py-0.2 rounded border border-[#c5a059]/20">
              Pen Name
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-3 border-t border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-display font-bold text-[#c5a059]">
                ₹{book.priceINR}
              </span>
              <span className="text-xs text-slate-500 line-through font-mono">
                ₹{book.originalPriceINR}
              </span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono block">Lifetime DRM-Free</span>
          </div>

          <button
            onClick={() => onBuyNow(book)}
            className="px-4 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d4af37] text-black font-bold text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>BUY NOW</span>
          </button>
        </div>

        {/* Secondary Actions */}
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
            <Info className="w-3 h-3 text-[#c5a059]" />
            <span>Dossier</span>
          </button>
        </div>
      </div>
    </article>
  );
}
