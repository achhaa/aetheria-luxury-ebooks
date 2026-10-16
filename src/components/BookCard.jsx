import React, { useState, useRef } from 'react';
import { Star, Eye, ShoppingBag, Sparkles, BookOpen, Check, Headphones } from 'lucide-react';

export default function BookCard({ book, onOpenPreview, onAddToCart, isInCart, currency = '$', currencyRate = 1 }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Parallax Tilt calculation
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
    const rY = ((x - centerX) / centerX) * 10;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const discountPercent = Math.round(
    ((book.originalPriceUSD - book.priceUSD) / book.originalPriceUSD) * 100
  );

  const formattedPrice = `${currency}${(book.priceUSD * currencyRate).toFixed(2)}`;
  const formattedOriginalPrice = `${currency}${(book.originalPriceUSD * currencyRate).toFixed(2)}`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease',
      }}
      className="group relative rounded-2xl glass-panel p-5 flex flex-col justify-between border border-white/10 hover:border-gold-500/40 transition-shadow duration-500 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.2)]"
    >
      {/* Glow highlight on hover */}
      <div 
        className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-gold-500/10 via-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm pointer-events-none"
      />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium">
            {book.category}
          </span>
          {book.badge && (
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {book.badge}
            </span>
          )}
        </div>

        {/* 3D Book Cover Visual Container */}
        <div 
          onClick={() => onOpenPreview(book)}
          className="relative h-72 w-full rounded-xl overflow-hidden cursor-pointer group/cover mb-5 flex items-center justify-center bg-obsidian-900 border border-white/10 shadow-lg"
        >
          {/* Cover Image with Realistic Book Spine Shadow */}
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-105 filter brightness-95 group-hover/cover:brightness-105"
          />

          {/* Left Spine Crease Simulation */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-white/20 pointer-events-none" />

          {/* Golden Corner Trim */}
          <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none bg-gradient-to-bl from-gold-400/40 via-transparent to-transparent" />

          {/* Hover Overlay: "Open 3D Flipbook" */}
          <div className="absolute inset-0 bg-obsidian-950/70 backdrop-blur-sm opacity-0 group-hover/cover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.6)] mb-3 transform scale-75 group-hover/cover:scale-100 transition-transform duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-sm font-display font-bold text-white tracking-wide">
              OPEN 3D FLIPBOOK
            </span>
            <span className="text-[11px] font-mono text-gold-400 mt-1">
              Interactive 3-Chapter Preview
            </span>
          </div>

          {/* Discount Ribbon */}
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-red-500/80 backdrop-blur-md text-white text-[11px] font-mono font-bold shadow-md">
            -{discountPercent}% OFF
          </div>
        </div>

        {/* Rating and Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-1 text-gold-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-semibold text-slate-200">{book.rating}</span>
            <span className="text-slate-400 text-[11px]">({book.reviewsCount.toLocaleString()})</span>
          </div>
          <span className="font-mono text-[11px]">{book.pages} pages • {book.readTime}</span>
        </div>

        {/* Book Title & Subtitle */}
        <h3 
          onClick={() => onOpenPreview(book)}
          className="text-lg font-display font-bold text-slate-100 hover:text-gold-300 transition-colors line-clamp-1 cursor-pointer mb-1"
        >
          {book.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {book.subtitle}
        </p>

        {/* Formats Icons Bar */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Formats:</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
            3D Web
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
            PDF
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
            EPUB
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20 flex items-center gap-1">
            <Headphones className="w-2.5 h-2.5" /> Audio
          </span>
        </div>
      </div>

      {/* Footer / Price & Cart Trigger */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-display font-extrabold text-gold-400">
              {formattedPrice}
            </span>
            <span className="text-xs text-slate-400 line-through font-mono">
              {formattedOriginalPrice}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono block">Instant Digital Delivery</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenPreview(book)}
            className="p-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-gold-400 hover:border-gold-500/40 bg-white/5 transition"
            title="Read 3D Preview"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => onAddToCart(book)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 ${
              isInCart
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-gold-500 hover:bg-gold-400 text-obsidian-950 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] active:scale-95'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ACQUIRE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
