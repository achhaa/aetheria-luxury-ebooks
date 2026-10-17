import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, BookOpen, ShoppingBag, Info, AlertCircle, Headphones, Plus, Check } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function BookCard({ 
  book, 
  onBuyNow,
  onAddToCart,
  activePlayingId,
  setActivePlayingId
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const videoRef = useRef(null);
  const cardRef = useRef(null);

  // 3D Apple-grade tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 250 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(springY, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-6deg', '6deg']);

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

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    handleStopVideo();
  };

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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleCardMouseLeave}
      style={{ perspective: 1000 }}
      className="group relative rounded-2xl bg-white/80 dark:bg-[#14161a]/90 backdrop-blur-sm p-4 sm:p-5 flex flex-col justify-between border border-black/10 dark:border-white/10 hover:border-[#c5a059]/40 dark:hover:border-[#c5a059]/50 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)]"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#f5f5f7] dark:bg-white/5 border border-black/5 dark:border-white/10 text-[#6e6e73] dark:text-[#a1a1a6]">
            {book.category}
          </span>
          <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-[#c5a059]/15 text-[#997328] dark:text-[#c5a059] font-bold border border-[#c5a059]/30">
            {book.badge}
          </span>
        </div>

        {/* 3D Dynamic Tilt Book Cover Frame with Inline Video Preview */}
        <motion.div 
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          onMouseEnter={handleStartVideo}
          onMouseLeave={handleStopVideo}
          className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#f5f5f7] dark:bg-black/40 border border-black/10 dark:border-white/10 shadow-sm mb-4 select-none group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-shadow duration-300"
        >
          {/* Champagne Specular Reflection Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 mix-blend-overlay"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(223, 183, 108, 0.4), transparent 70%)',
            }}
          />
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
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#f5f5f7] dark:bg-[#1c1f26]">
              <AlertCircle className="w-8 h-8 text-[#997328] dark:text-[#c5a059] mb-2" />
              <span className="text-xs font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{book.title}</span>
              <span className="text-[10px] font-mono text-[#6e6e73] dark:text-[#a1a1a6] mt-1">{book.author}</span>
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
                  ? 'bg-white/95 text-[#997328] dark:text-[#c5a059] border border-[#c5a059]/50 font-bold'
                  : 'bg-black/60 hover:bg-black/80 text-white border border-white/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#997328] dark:bg-[#c5a059] animate-pulse" />
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
            <div className="absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded-full bg-white/90 dark:bg-[#1c1f26]/90 backdrop-blur-md text-[#0071e3] dark:text-sky-400 text-[10px] font-mono font-bold flex items-center gap-1 shadow-sm">
              <Headphones className="w-3 h-3" />
              <span>Audiobook</span>
            </div>
          )}
        </motion.div>

        {/* Title & Author Info */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#6e6e73] dark:text-[#a1a1a6]">
            <span className="font-mono text-[11px]">{book.pages} pages • {book.readTime}</span>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">PDF + EPUB</span>
          </div>

          <Link
            to={`/books/${book.slug || book.id}`}
            className="block text-base sm:text-lg font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0071e3] dark:hover:text-[#c5a059] transition-colors line-clamp-1"
          >
            {book.title}
          </Link>

          <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] line-clamp-2 leading-relaxed">
            {book.subtitle}
          </p>

          <div className="text-[11px] text-[#6e6e73] dark:text-[#a1a1a6] font-mono pt-1">
            Author: <span className="text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold">{book.author}</span>
            <span className="text-[9px] text-[#997328] dark:text-[#c5a059] ml-1.5 px-1.5 py-0.2 rounded border border-[#c5a059]/30 bg-[#c5a059]/5">
              Pen Name
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-3 border-t border-black/5 dark:border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-display font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                ₹{book.priceINR}
              </span>
              <span className="text-xs text-[#86868b] dark:text-[#71717a] line-through font-mono">
                ₹{book.originalPriceINR}
              </span>
            </div>
            <span className="text-[9px] text-[#6e6e73] dark:text-[#a1a1a6] font-mono block">Lifetime DRM-Free</span>
          </div>

          <div className="flex items-center gap-2">
            {onAddToCart && (
              <button
                type="button"
                onClick={() => {
                  onAddToCart(book);
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }}
                className={`p-2.5 rounded-xl border transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer ${
                  addedToCart
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-black/15 dark:border-white/15 hover:border-[#c5a059] bg-white dark:bg-white/5 text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#997328] dark:hover:text-[#c5a059]'
                }`}
                title={addedToCart ? 'Added to Bag' : 'Add to Bag'}
                aria-label={`Add ${book.title} to shopping bag`}
              >
                {addedToCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            )}

            <button
              onClick={() => onBuyNow(book)}
              className="px-3.5 py-2.5 rounded-xl bg-[#1d1d1f] dark:bg-[#c5a059] hover:bg-black dark:hover:bg-[#dfb76c] text-white dark:text-black font-bold text-xs tracking-wider transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#c5a059] dark:text-black" />
              <span>BUY NOW</span>
            </button>
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/read/${book.id}`}
            className="py-1.5 px-2 rounded-lg border border-black/10 dark:border-white/10 text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-white/5 bg-white dark:bg-white/5 text-[11px] font-mono flex items-center justify-center gap-1 transition shadow-xs text-center"
          >
            <BookOpen className="w-3 h-3 text-[#997328] dark:text-[#c5a059]" />
            <span>Read Sample</span>
          </Link>

          <Link
            to={`/books/${book.slug || book.id}`}
            className="py-1.5 px-2 rounded-lg border border-black/10 dark:border-white/10 text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-white/5 bg-white dark:bg-white/5 text-[11px] font-mono flex items-center justify-center gap-1 transition shadow-xs text-center"
          >
            <Info className="w-3 h-3 text-[#0071e3] dark:text-sky-400" />
            <span>Dossier</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
