import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, BookOpen, ShoppingBag, Info, AlertCircle, Headphones } from 'lucide-react';

export default function BookCard({ 
  book, 
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

  const handleToggleTouchVideo = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isPlaying) {
      handleStopVideo();
    } else {
      handleStartVideo();
    }
  };

  return (
    <article 
      ref={cardRef}
      className="group relative rounded-2xl bg-white p-4 sm:p-5 flex flex-col justify-between border border-black/10 hover:border-black/20 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#f5f5f7] border border-black/5 text-[#6e6e73]">
            {book.category}
          </span>
          <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-[#c5a059]/15 text-[#997328] font-bold border border-[#c5a059]/30">
            {book.badge}
          </span>
        </div>

        {/* Book Cover Frame with Inline Video Preview */}
        <div 
          onMouseEnter={handleStartVideo}
          onMouseLeave={handleStopVideo}
          className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#f5f5f7] border border-black/10 shadow-sm mb-4 select-none"
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
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#f5f5f7]">
              <AlertCircle className="w-8 h-8 text-[#997328] mb-2" />
              <span className="text-xs font-serif font-bold text-[#1d1d1f]">{book.title}</span>
              <span className="text-[10px] font-mono text-[#6e6e73] mt-1">{book.author}</span>
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
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none z-10" />

          {/* Subtle Corner Play / Preview Badge */}
          <div className="absolute top-3 right-3 z-20">
            <button
              type="button"
              onClick={handleToggleTouchVideo}
              aria-label={isPlaying ? 'Stop video preview' : 'Play video preview'}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1.5 transition-all shadow-sm backdrop-blur-md ${
                isPlaying
                  ? 'bg-white/95 text-[#997328] border border-[#c5a059]/50 font-bold'
                  : 'bg-black/60 hover:bg-black/80 text-white border border-white/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#997328] animate-pulse" />
                  <span>Previewing</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 fill-current text-white" />
                  <span>Preview</span>
                </>
              )}
            </button>
          </div>

          {/* Price Ribbon */}
          <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[#fde68a] text-xs font-mono font-bold shadow-sm">
            ₹{book.priceINR}
          </div>

          {/* Audiobook indicator pill if available */}
          {book.hasAudiobook && (
            <div className="absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#0071e3] text-[10px] font-mono font-bold flex items-center gap-1 shadow-sm">
              <Headphones className="w-3 h-3" />
              <span>Audiobook</span>
            </div>
          )}
        </div>

        {/* Title & Author Info */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#6e6e73]">
            <span className="font-mono text-[11px]">{book.pages} pages • {book.readTime}</span>
            <span className="font-mono text-[10px] text-emerald-600 font-medium">PDF + EPUB</span>
          </div>

          <Link
            to={`/books/${book.slug || book.id}`}
            className="block text-base sm:text-lg font-serif font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors line-clamp-1"
          >
            {book.title}
          </Link>

          <p className="text-xs text-[#6e6e73] line-clamp-2 leading-relaxed">
            {book.subtitle}
          </p>

          <div className="text-[11px] text-[#6e6e73] font-mono pt-1">
            Author: <span className="text-[#1d1d1f] font-semibold">{book.author}</span>
            <span className="text-[9px] text-[#997328] ml-1.5 px-1.5 py-0.2 rounded border border-[#c5a059]/30 bg-[#c5a059]/5">
              Pen Name
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-3 border-t border-black/5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-display font-bold text-[#1d1d1f]">
                ₹{book.priceINR}
              </span>
              <span className="text-xs text-[#86868b] line-through font-mono">
                ₹{book.originalPriceINR}
              </span>
            </div>
            <span className="text-[9px] text-[#6e6e73] font-mono block">Lifetime DRM-Free</span>
          </div>

          <button
            onClick={() => onBuyNow(book)}
            className="px-4 py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-black text-white font-bold text-xs tracking-wider transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>BUY NOW</span>
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/read/${book.id}`}
            className="py-1.5 px-2 rounded-lg border border-black/10 text-[#1d1d1f] hover:bg-[#f5f5f7] bg-white text-[11px] font-mono flex items-center justify-center gap-1 transition shadow-xs text-center"
          >
            <BookOpen className="w-3 h-3 text-[#997328]" />
            <span>Read Sample</span>
          </Link>

          <Link
            to={`/books/${book.slug || book.id}`}
            className="py-1.5 px-2 rounded-lg border border-black/10 text-[#1d1d1f] hover:bg-[#f5f5f7] bg-white text-[11px] font-mono flex items-center justify-center gap-1 transition shadow-xs text-center"
          >
            <Info className="w-3 h-3 text-[#0071e3]" />
            <span>Dossier</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
