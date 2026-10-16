import React, { useState, useRef } from 'react';
import { 
  X, Play, Pause, Volume2, VolumeX, BookOpen, ShoppingBag, 
  Sparkles, ShieldCheck, Clock, CheckCircle2, FileText, Info
} from 'lucide-react';

export default function BookDetailModal({ 
  book, 
  isOpen, 
  onClose, 
  onOpenSample, 
  onBuyNow 
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showCaptions, setShowCaptions] = useState(false);
  const videoRef = useRef(null);

  if (!isOpen || !book) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label={`${book.title} Details`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#0c0e14] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden my-6">
        
        {/* Header */}
        <header className="h-16 px-6 bg-[#07080a] border-b border-white/10 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c5a059]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold">
              EDITORIAL DOSSIER • {book.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Phase 5: Cinematic Video Trailer Showcase */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video max-h-[380px] w-full flex items-center justify-center group shadow-2xl">
            <video
              ref={videoRef}
              src={book.trailer.videoUrl}
              poster={book.trailer.poster}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Video Tag */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#c5a059] border border-[#c5a059]/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                10s Cinematic Trailer
              </span>
              <span className="hidden sm:inline px-2 py-1 rounded bg-black/50 text-[10px] font-mono text-slate-300">
                {book.trailer.sourceType}
              </span>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition"
                  title={isPlaying ? 'Pause Trailer' : 'Play Trailer'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono backdrop-blur-md transition ${
                    showCaptions ? 'bg-[#c5a059] text-black font-bold' : 'bg-white/20 text-white'
                  }`}
                >
                  CC
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-300">
                {book.trailer.duration}
              </span>
            </div>

            {/* Accessible Captions Box */}
            {showCaptions && (
              <div className="absolute bottom-16 left-6 right-6 p-3 rounded-xl bg-black/85 border border-white/20 text-xs font-sans text-slate-200 text-center">
                "{book.trailer.captions}"
              </div>
            )}
          </div>

          {/* Book Primary Details Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#c5a059]">
                  {book.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ISBN: {book.isbn}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
                {book.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                {book.subtitle}
              </p>

              <div className="pt-2 text-xs font-mono text-slate-400">
                By <strong className="text-white">{book.author}</strong> ({book.authorRole})
              </div>
            </div>

            {/* Price & Action Box */}
            <div className="md:col-span-4 p-6 rounded-2xl bg-[#131620] border border-white/10 space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  OFFICIAL PRICE (INR)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-extrabold text-[#c5a059]">
                    ₹{book.priceINR}
                  </span>
                  <span className="text-sm font-mono text-slate-400 line-through">
                    ₹{book.originalPriceINR}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono block mt-1">
                  ✓ Verified Razorpay Instant Digital Delivery
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onBuyNow(book);
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#c5a059] hover:bg-[#d4af37] text-[#07080a] font-bold text-xs tracking-wider transition shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>BUY NOW — ₹{book.priceINR}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenSample(book);
                  }}
                  className="w-full py-3 rounded-xl border border-white/15 hover:border-[#c5a059]/40 text-slate-200 hover:text-white text-xs font-mono transition flex items-center justify-center gap-2 bg-white/5"
                >
                  <BookOpen className="w-4 h-4 text-[#c5a059]" />
                  <span>READ SAMPLE IN WARM IVORY</span>
                </button>
              </div>

              <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400 space-y-1">
                <div>• Format: Vector PDF & Universal EPUB</div>
                <div>• Delivery: Immediate download + Email license</div>
                <div>• Guarantee: 30-Day Sovereign Refund</div>
              </div>
            </div>
          </div>

          {/* Substantive Description */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-lg font-display font-bold text-white">
              Publication Overview
            </h3>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* Key Takeaways */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#c5a059] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> CORE ARCHITECTURAL TAKEAWAYS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {book.keyTakeaways.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 font-light leading-relaxed">
                  <span className="text-[#c5a059] font-bold shrink-0">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table of Contents */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold text-white">
              Table of Contents
            </h3>
            <div className="divide-y divide-white/5 border-y border-white/10 text-xs">
              {book.tableOfContents.map((ch) => (
                <div key={ch.number} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-mono text-[#c5a059] font-bold mr-2">Chapter {ch.number}:</span>
                    <span className="font-semibold text-white">{ch.title}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{ch.subtitle}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
