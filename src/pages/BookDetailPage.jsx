import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Headphones, ShoppingBag, Download, 
  ShieldCheck, CheckCircle2, FileText, Play, AlertCircle, 
  ExternalLink, Sparkles, Check
} from 'lucide-react';

import { BOOKS_DATA } from '../data/booksData';

export default function BookDetailPage({ onBuyNow }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const book = BOOKS_DATA.find((b) => b.slug === slug || b.id === slug) || BOOKS_DATA[0];

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleStartVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    }
  };

  const handleStopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsVideoPlaying(false);
    }
  };

  return (
    <div className="min-h-screen py-12 md:py-20 text-[var(--site-text)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Catalogue</span>
          </Link>
        </div>

        {/* Hero Dossier Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16 pb-16 border-b border-black/10 dark:border-white/10">
          
          {/* Cover & Video Preview Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div 
              onMouseEnter={handleStartVideo}
              onMouseLeave={handleStopVideo}
              className="relative w-full max-w-sm aspect-[2/3] rounded-2xl overflow-hidden bg-[#f5f5f7] dark:bg-black/40 border border-black/10 dark:border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.45)] group cursor-pointer"
            >
              {/* Cover Artwork */}
              <img
                src={book.coverImage}
                alt={book.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isVideoPlaying ? 'opacity-0' : 'opacity-100'
                }`}
              />

              {/* Inline Video Preview */}
              <video
                ref={videoRef}
                src={book.videoPreview}
                poster={book.coverImage}
                playsInline
                muted
                preload="none"
                onEnded={handleStopVideo}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
                  isVideoPlaying ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Spine Crease */}
              <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />

              {/* Preview Button Badge */}
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isVideoPlaying) handleStopVideo();
                    else handleStartVideo();
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#1c1f26]/90 backdrop-blur-md text-[#1d1d1f] dark:text-[#f5f5f7] text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs"
                >
                  <Play className="w-2.5 h-2.5 fill-current text-[#997328] dark:text-[#c5a059]" />
                  <span>{isVideoPlaying ? 'Playing' : 'Preview Video'}</span>
                </button>
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-3 right-3 z-10 px-3 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[#fde68a] text-xs font-mono font-bold">
                ₹{book.priceINR}
              </div>
            </div>

            <p className="text-[11px] font-mono text-[#86868b] dark:text-[#71717a] mt-3 text-center">
              Hover over cover to preview video teaser inline
            </p>
          </div>

          {/* Book Metadata & Primary Acquisition Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-mono text-[#515154] dark:text-[#a1a1a6]">
                {book.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Published Edition (2026)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#c5a059]/15 text-[#997328] dark:text-[#c5a059] font-mono text-xs font-bold border border-[#c5a059]/30">
                {book.badge}
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight">
                {book.title}
              </h1>
              <p className="text-lg text-[#515154] dark:text-[#a1a1a6] font-serif italic mt-2">
                {book.subtitle}
              </p>
            </div>

            {/* Author Attribution */}
            <div className="p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#14161a] border border-black/5 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6e6e73] dark:text-[#a1a1a6] block">
                  Author Attribution
                </span>
                <span className="text-sm font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {book.author}
                </span>
                <span className="text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] block mt-0.5">
                  {book.authorRole}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-white dark:bg-white/5 text-[#997328] dark:text-[#c5a059] border border-[#c5a059]/30 font-bold">
                Pen Name
              </span>
            </div>

            {/* Synopsis Description */}
            <p className="text-sm sm:text-base text-[#515154] dark:text-[#a1a1a6] leading-relaxed font-sans">
              {book.description}
            </p>

            {/* Specification Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-black/10 dark:border-white/10 text-xs font-mono bg-white dark:bg-[#14161a]">
              <div>
                <span className="text-[#86868b] dark:text-[#71717a] block text-[10px]">Length</span>
                <span className="font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{book.pages} Pages</span>
              </div>
              <div>
                <span className="text-[#86868b] dark:text-[#71717a] block text-[10px]">Reading Time</span>
                <span className="font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{book.readTime}</span>
              </div>
              <div>
                <span className="text-[#86868b] dark:text-[#71717a] block text-[10px]">ISBN</span>
                <span className="font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{book.isbn}</span>
              </div>
              <div>
                <span className="text-[#86868b] dark:text-[#71717a] block text-[10px]">Formats</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">PDF + EPUB + Web</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onBuyNow(book)}
                  className="flex-1 py-4 px-6 rounded-xl bg-[#1d1d1f] dark:bg-[#c5a059] hover:bg-black dark:hover:bg-[#dfb76c] text-white dark:text-black font-bold text-xs font-mono tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#c5a059] dark:text-black" />
                  <span>ACQUIRE SOVEREIGN EDITION — ₹{book.priceINR}</span>
                </button>

                <Link
                  to={`/read/${book.id}`}
                  className="py-4 px-6 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs font-mono tracking-wider transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>READ IN WEB READER</span>
                </Link>
              </div>

              {/* Audiobook Button if available */}
              {book.hasAudiobook && (
                <Link
                  to={`/read/${book.id}`}
                  className="w-full py-3.5 px-6 rounded-xl border border-[#0071e3]/30 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-950/30 text-[#0071e3] dark:text-sky-300 font-bold text-xs font-mono tracking-wider transition flex items-center justify-center gap-2 hover:bg-sky-100 dark:hover:bg-sky-900/40"
                >
                  <Headphones className="w-4 h-4" />
                  <span>LISTEN TO SYNCHRONIZED AUDIOBOOK (KARAOKE READ-ALONG)</span>
                </Link>
              )}
            </div>

            {/* DRM Guarantee Notice */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>DRM-Free Master File. Authorized for personal e-reading on all devices.</span>
            </div>

          </div>

        </div>

        {/* Detailed Dossier Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Table of Contents & Citations */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Table of Contents */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
                Table of Contents
              </h2>
              <div className="space-y-3">
                {book.tableOfContents.map((ch) => (
                  <div 
                    key={ch.number}
                    className="p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#14161a] border border-black/5 dark:border-white/10 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs text-[#997328] dark:text-[#c5a059] font-bold mt-0.5">
                        {ch.number}
                      </span>
                      <div>
                        <h3 className="text-sm font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{ch.title}</h3>
                        <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">{ch.subtitle}</p>
                      </div>
                    </div>
                    {ch.pages && (
                      <span className="text-[11px] font-mono text-[#86868b] dark:text-[#71717a] shrink-0">
                        pp. {ch.pages}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Academic Citations & References */}
            {book.references && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
                  Primary References & Citations
                </h2>
                <div className="space-y-2.5">
                  {book.references.map((ref) => (
                    <div 
                      key={ref.id}
                      className="p-3.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#14161a] text-xs font-serif text-[#515154] dark:text-[#a1a1a6] leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="font-mono text-[10px] text-[#997328] dark:text-[#c5a059] font-bold shrink-0">
                        [{ref.id}]
                      </span>
                      <span>{ref.citation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Key Takeaways & Editorial Integrity */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Key Takeaways Box */}
            <div className="p-6 rounded-2xl bg-[#f5f5f7] dark:bg-[#14161a] border border-black/10 dark:border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#997328] dark:text-[#c5a059] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Core Intellectual Takeaways</span>
              </div>
              <ul className="space-y-3">
                {book.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#515154] dark:text-[#a1a1a6] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#997328] dark:text-[#c5a059] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Editorial Provenance Notice */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#14161a] border border-black/10 dark:border-white/10 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6e6e73] dark:text-[#a1a1a6] font-bold block">
                EDITORIAL PROVENANCE
              </span>
              <h3 className="text-base font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Fact-Checked & Ethically Attributed
              </h3>
              <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                This volume was prepared using AI research synthesis and curated under strict human editorial governance. Citations represent primary empirical and peer-reviewed literature. No fabricated claims, credentials, or endorsements are used.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
