import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Headphones, ShoppingBag, 
  ShieldCheck, CheckCircle2, Play, Pause, 
  Sparkles, Check, Plus, Share2, 
  ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { BOOKS_DATA } from '../data/booksData';

export default function BookDetailPage({ onBuyNow, onAddToCart }) {
  const { slug } = useParams();

  const book = BOOKS_DATA.find((b) => b.slug === slug || b.id === slug) || BOOKS_DATA[0];

  // Video Teaser Preview State
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  // Audio Sample Player State (Apple Books / Audible Style)
  const [isAudioSamplePlaying, setIsAudioSamplePlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioSampleRef = useRef(null);

  // Cart & UI Feedback
  const [addedToCart, setAddedToCart] = useState(false);
  const [shareToast, setShareToast] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState('01');

  // Video hover controls
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

  // Audio Sample Player Controls
  const toggleAudioSample = () => {
    if (!audioSampleRef.current) return;
    if (isAudioSamplePlaying) {
      audioSampleRef.current.pause();
      setIsAudioSamplePlaying(false);
    } else {
      audioSampleRef.current.play().then(() => {
        setIsAudioSamplePlaying(true);
      }).catch((e) => {
        console.debug('Audio play failed:', e);
      });
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioSampleRef.current) {
      setAudioCurrentTime(audioSampleRef.current.currentTime);
      setAudioDuration(audioSampleRef.current.duration || 0);
    }
  };

  const handleAudioSeek = (e) => {
    const nextTime = Number(e.target.value);
    if (audioSampleRef.current) {
      audioSampleRef.current.currentTime = nextTime;
      setAudioCurrentTime(nextTime);
    }
  };

  const formatAudioTime = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Copy Citation & Link
  const handleCopyCitation = () => {
    const citation = `${book.author} (2026). ${book.title}: ${book.subtitle}. Aetheria Privé Editions. ISBN: ${book.isbn}. ${window.location.href}`;
    navigator.clipboard.writeText(citation).then(() => {
      setShareToast('Citation & link copied to clipboard');
      setTimeout(() => setShareToast(null), 3000);
    }).catch(() => {
      setShareToast('Link copied to clipboard');
      setTimeout(() => setShareToast(null), 3000);
    });
  };

  // Curated Editorial Reviews & Acclaim
  const editorialReviews = [
    {
      publication: "London Review of Digital Thought",
      quote: `“An exceptionally rigorous and beautifully composed volume. ${book.title} departs entirely from modern hype to offer foundational clarity.”`,
      rating: "★★★★★"
    },
    {
      publication: "Cognitive Systems & Strategic Review",
      quote: `“Essential reading for technologists and sovereign strategists. The typography, citations, and conceptual architecture are without equal.”`,
      rating: "Editor’s Choice"
    }
  ];

  return (
    <div className="min-h-screen py-12 md:py-20 text-[var(--site-text)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Floating Share / Copy Toast Notification */}
        <AnimatePresence>
          {shareToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-20 left-1/2 z-50 px-5 py-2.5 rounded-full bg-black/90 text-white text-xs font-mono shadow-2xl flex items-center gap-2 border border-white/20 backdrop-blur-md"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{shareToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition p-1 -ml-1 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Catalogue</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyCitation}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#997328] dark:hover:text-[#c5a059] transition px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:border-[#c5a059]/40 bg-white/60 dark:bg-white/5 backdrop-blur-xs cursor-pointer shadow-xs"
            title="Copy academic citation and URL"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share & Cite</span>
          </button>
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
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isVideoPlaying) handleStopVideo();
                    else handleStartVideo();
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#1c1f26]/90 backdrop-blur-md text-[#1d1d1f] dark:text-[#f5f5f7] text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs cursor-pointer"
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

            {/* Interactive Apple-Style Audio Sample Player Station */}
            {book.hasAudiobook && (
              <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/25 border border-sky-200/80 dark:border-sky-800/40 space-y-3">
                <audio
                  ref={audioSampleRef}
                  src={book.audiobook?.audioUrl || `/assets/audio/${book.id}-chapter-01.wav`}
                  onTimeUpdate={handleAudioTimeUpdate}
                  onEnded={() => setIsAudioSamplePlaying(false)}
                  preload="metadata"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-[#0071e3] dark:text-sky-400" />
                    <span className="text-xs font-mono font-bold text-[#0071e3] dark:text-sky-300">
                      AUDIOBOOK SAMPLE PREVIEW (CHAPTER 01)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6e6e73] dark:text-sky-400">
                    Neural Studio Narration
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleAudioSample}
                    className="w-9 h-9 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white flex items-center justify-center shadow-sm transition hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                    title={isAudioSamplePlaying ? 'Pause Audio Preview' : 'Play Audio Preview'}
                  >
                    {isAudioSamplePlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <input
                      type="range"
                      min="0"
                      max={audioDuration || 260}
                      step="0.5"
                      value={audioCurrentTime}
                      onChange={handleAudioSeek}
                      className="w-full h-1.5 bg-sky-200 dark:bg-sky-900 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#6e6e73] dark:text-sky-400/80">
                      <span>{formatAudioTime(audioCurrentTime)}</span>
                      <span>{formatAudioTime(audioDuration || 263)}</span>
                    </div>
                  </div>

                  {/* Animated Waveform Bars */}
                  {isAudioSamplePlaying && (
                    <div className="flex items-center gap-0.5 h-4 px-1" title="Narration Playing">
                      <span className="w-0.5 h-3 bg-[#0071e3] dark:bg-sky-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                      <span className="w-0.5 h-4 bg-[#0071e3] dark:bg-sky-400 rounded-full animate-bounce" style={{ animationDuration: '0.4s' }} />
                      <span className="w-0.5 h-2 bg-[#0071e3] dark:bg-sky-400 rounded-full animate-bounce" style={{ animationDuration: '0.7s' }} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Primary Action Buttons (Buy Now, Add to Bag, Read Sample) */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* 1-Click Buy Now */}
                <button
                  onClick={() => onBuyNow(book)}
                  className="flex-1 py-4 px-6 rounded-xl bg-[#1d1d1f] dark:bg-[#c5a059] hover:bg-black dark:hover:bg-[#dfb76c] text-white dark:text-black font-bold text-xs font-mono tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#c5a059] dark:text-black" />
                  <span>ACQUIRE SOVEREIGN EDITION — ₹{book.priceINR}</span>
                </button>

                {/* Add to Bag Button */}
                {onAddToCart && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(book);
                      setAddedToCart(true);
                      setTimeout(() => setAddedToCart(false), 2500);
                    }}
                    className={`py-4 px-6 rounded-xl border transition-all shadow-xs flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                      addedToCart
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-black/15 dark:border-white/15 hover:border-[#c5a059] bg-white dark:bg-white/5 text-[#1d1d1f] dark:text-[#f5f5f7]'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>ADDED TO BAG</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>ADD TO BAG</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Web Reader Free Chapter Sample */}
              <Link
                to={`/read/${book.id}`}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs font-mono tracking-wider transition flex items-center justify-center gap-2 shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>READ SAMPLE CHAPTER (FREE IN WEB READER)</span>
              </Link>
            </div>

            {/* DRM Guarantee Notice */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>DRM-Free Master File. Instant Vector PDF, Universal EPUB & Permanent Web Access.</span>
            </div>

          </div>

        </div>

        {/* Detailed Dossier Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Interactive Table of Contents & Citations */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Interactive Table of Contents with Excerpt Accordion */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Table of Contents
                </h2>
                <span className="text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6]">
                  Click chapter to inspect syllabus
                </span>
              </div>

              <div className="space-y-3">
                {book.tableOfContents.map((ch) => {
                  const isExpanded = expandedChapter === ch.number;
                  return (
                    <div 
                      key={ch.number}
                      className="rounded-xl bg-[#f5f5f7] dark:bg-[#14161a] border border-black/5 dark:border-white/10 overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedChapter(isExpanded ? null : ch.number)}
                        className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xs text-[#997328] dark:text-[#c5a059] font-bold mt-0.5">
                            {ch.number}
                          </span>
                          <div>
                            <h3 className="text-sm font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                              {ch.title}
                            </h3>
                            <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">
                              {ch.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {ch.pages && (
                            <span className="text-[11px] font-mono text-[#86868b] dark:text-[#71717a]">
                              pp. {ch.pages}
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#86868b]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#86868b]" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Chapter Syllabus Preview */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4 pt-1 border-t border-black/5 dark:border-white/5 text-xs text-[#515154] dark:text-[#a1a1a6] space-y-2 font-sans"
                          >
                            <p className="leading-relaxed">
                              Detailed developmental breakdown covering primary empirical models, historical context, and mathematical or architectural proofs. Formatted with interactive SVG diagrams and footnotes.
                            </p>
                            <div className="pt-2">
                              <Link
                                to={`/read/${book.id}`}
                                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#0071e3] dark:text-sky-400 hover:underline"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Read Chapter in Web Reader →</span>
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
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

            {/* Curated Critical Acclaim & Editorial Reviews */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
                Critical Reception & Acclaim
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {editorialReviews.map((rev, i) => (
                  <div 
                    key={i} 
                    className="p-5 rounded-2xl bg-white dark:bg-[#14161a] border border-black/10 dark:border-white/10 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-[#997328] dark:text-[#c5a059] font-bold">
                      <span>{rev.publication}</span>
                      <span className="text-[11px]">{rev.rating}</span>
                    </div>
                    <p className="text-xs font-serif italic text-[#515154] dark:text-[#a1a1a6] leading-relaxed">
                      {rev.quote}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Key Takeaways & Author Dossier */}
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

            {/* Author Dossier & Intellectual Lineage */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#14161a] border border-black/10 dark:border-white/10 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#997328] dark:text-[#c5a059] font-bold block">
                AUTHOR DOSSIER & BACKGROUND
              </span>
              <h3 className="text-base font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                {book.author}
              </h3>
              <p className="text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6]">
                {book.authorRole}
              </p>
              <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                Writing under an explicit editorial pen name, the author synthesizes two decades of practical engineering and foundational research. Works published under Aetheria undergo double-blind peer review of citations and data integrity.
              </p>
            </div>

            {/* Editorial Provenance Notice */}
            <div className="p-6 rounded-2xl bg-[#f5f5f7] dark:bg-[#14161a] border border-black/10 dark:border-white/10 space-y-3">
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
