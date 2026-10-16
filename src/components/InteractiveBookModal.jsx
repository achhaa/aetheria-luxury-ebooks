import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Bookmark, Volume2, VolumeX, 
  Download, ShoppingBag, Eye, BookOpen, Sparkles, Check, 
  Layers, Sun, Moon, Type, Share2
} from 'lucide-react';
import { 
  playPageFlipSound, playBookOpenSound, playBookCloseSound, 
  speakNarratorText, stopNarratorText 
} from '../utils/audioSynthesis';

export default function InteractiveBookModal({ book, isOpen, onClose, onAddToCart, currency = '$', currencyRate = 1 }) {
  const [isOpenAnim, setIsOpenAnim] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 0 = Cover/Intro spread, 1 = Chapter 1, 2 = Chapter 2, etc.
  const [readerTheme, setReaderTheme] = useState('dark'); // 'dark', 'ivory', 'sepia'
  const [fontSize, setFontSize] = useState(16);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedDiagramNode, setSelectedDiagramNode] = useState(null);

  // Trigger book open sequence
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
      setIsNarrating(false);
      stopNarratorText();
      playBookOpenSound();
      const timer = setTimeout(() => {
        setIsOpenAnim(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setIsOpenAnim(false);
      stopNarratorText();
    }
  }, [isOpen]);

  const handleClose = () => {
    stopNarratorText();
    setIsNarrating(false);
    playBookCloseSound();
    setIsOpenAnim(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true);
      playPageFlipSound();
      stopNarratorText();
      setIsNarrating(false);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setIsFlipping(false);
      }, 250);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      playPageFlipSound();
      stopNarratorText();
      setIsNarrating(false);
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setIsFlipping(false);
      }, 250);
    }
  };

  const handleToggleNarration = () => {
    if (isNarrating) {
      stopNarratorText();
      setIsNarrating(false);
    } else {
      const currentChapter = book.sampleChapters[currentPage];
      const textToSpeak = currentChapter 
        ? `${currentChapter.title}. ${currentChapter.subtitle}. ${currentChapter.content.join(' ')}`
        : `${book.title}. ${book.description}`;

      speakNarratorText(
        textToSpeak,
        () => setIsNarrating(true),
        () => setIsNarrating(false),
        () => setIsNarrating(false)
      );
    }
  };

  const handleDownloadSample = () => {
    // Generates a clean text/markdown sample file
    const sampleText = `
=====================================================
AETHERIA PRIVÉ EDITIONS — DIGITAL SAMPLE
=====================================================
Title: ${book.title}
Subtitle: ${book.subtitle}
Author: ${book.author} (${book.authorRole})
Rating: ${book.rating}/5.0 (${book.reviewsCount} verified reviews)
Category: ${book.category}

-----------------------------------------------------
SYNOPSIS
-----------------------------------------------------
${book.description}

-----------------------------------------------------
SAMPLE CHAPTERS INCLUDED:
-----------------------------------------------------
${book.sampleChapters.map(ch => `
[Chapter ${ch.chapterNumber}] ${ch.title}
${ch.subtitle}

${ch.content.join('\n\n')}
`).join('\n-----------------------------------------------------\n')}

=====================================================
Acquire the complete unabridged edition at Aetheria.
=====================================================
    `.trim();

    const blob = new Blob([sampleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.id}-aetheria-sample.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen || !book) return null;

  const totalPages = book.sampleChapters.length;
  const currentChapter = book.sampleChapters[currentPage] || book.sampleChapters[0];

  // Reader Themes styling
  const themeStyles = {
    dark: {
      bg: 'bg-obsidian-950',
      paper: 'bg-obsidian-900 border-white/10 text-slate-200',
      title: 'text-white',
      accent: 'text-gold-400',
      border: 'border-white/10',
      quote: 'bg-white/5 border-gold-500/40 text-slate-300'
    },
    ivory: {
      bg: 'bg-stone-900',
      paper: 'bg-[#faf6ee] border-amber-900/10 text-stone-800',
      title: 'text-stone-900',
      accent: 'text-amber-700',
      border: 'border-amber-900/10',
      quote: 'bg-amber-100/60 border-amber-600 text-stone-700'
    },
    sepia: {
      bg: 'bg-[#1e1b18]',
      paper: 'bg-[#f4ecd8] border-stone-800/15 text-[#3e3427]',
      title: 'text-[#2a2217]',
      accent: 'text-[#8c5e26]',
      border: 'border-stone-800/15',
      quote: 'bg-[#e8dcbf] border-[#8c5e26] text-[#4a3f31]'
    }
  };
  const currentTheme = themeStyles[readerTheme];

  const formattedPrice = `${currency}${(book.priceUSD * currencyRate).toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* 3D Perspective Container */}
      <div 
        className={`relative w-full max-w-6xl h-[92vh] max-h-[850px] transition-all duration-700 ease-out flex flex-col rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-gold-500/30 perspective-container ${
          isOpenAnim ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 rotate-x-12'
        }`}
      >
        {/* Top Control Bar */}
        <header className="h-14 px-6 bg-obsidian-900 border-b border-white/10 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse" />
            <h2 className="text-xs md:text-sm font-mono tracking-wider text-slate-300 uppercase truncate max-w-[200px] md:max-w-md">
              {book.title}
            </h2>
            <span className="hidden sm:inline text-[11px] px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20 font-mono">
              INTERACTIVE 3D EDITION
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Narrator Button */}
            <button
              onClick={handleToggleNarration}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition-all ${
                isNarrating
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
              title="Listen to chapter read aloud"
            >
              {isNarrating ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                  <span>NARRATING...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-gold-400" />
                  <span className="hidden md:inline">LISTEN SAMPLE</span>
                </>
              )}
            </button>

            {/* Theme Picker */}
            <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setReaderTheme('dark')}
                className={`w-6 h-6 rounded flex items-center justify-center text-xs transition ${
                  readerTheme === 'dark' ? 'bg-gold-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
                title="Obsidian Dark"
              >
                <Moon className="w-3 h-3" />
              </button>
              <button
                onClick={() => setReaderTheme('ivory')}
                className={`w-6 h-6 rounded flex items-center justify-center text-xs transition ${
                  readerTheme === 'ivory' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tactile Ivory"
              >
                <Sun className="w-3 h-3" />
              </button>
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-serif font-bold transition ${
                  readerTheme === 'sepia' ? 'bg-[#8c5e26] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Vintage Sepia"
              >
                S
              </button>
            </div>

            {/* Font Sizer */}
            <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
              <button 
                onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                className="hover:text-gold-400 px-1"
                title="Decrease Font Size"
              >
                A-
              </button>
              <span className="text-[10px] text-slate-400">{fontSize}px</span>
              <button 
                onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                className="hover:text-gold-400 px-1"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* Bookmark */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-lg border transition ${
                isBookmarked 
                  ? 'bg-gold-500/20 border-gold-500 text-gold-400' 
                  : 'border-white/10 text-slate-400 hover:text-white bg-white/5'
              }`}
              title="Bookmark Page"
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>

            {/* Download Sample */}
            <button
              onClick={handleDownloadSample}
              className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-gold-400 bg-white/5 transition"
              title="Download Sample Chapter"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Close Modal */}
            <button
              onClick={handleClose}
              className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/40 bg-white/5 transition ml-2"
              title="Close 3D Reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Realistic 3D Book Stage */}
        <div className={`relative flex-1 ${currentTheme.bg} overflow-hidden p-3 md:p-8 flex items-center justify-center transition-colors duration-500`}>
          {/* Background Ambient Book Glow */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20 filter blur-3xl"
            style={{ backgroundColor: book.accentColor }}
          />

          {/* Book Spine Center Crease Visual */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 pointer-events-none z-30 hidden md:block bg-gradient-to-r from-black/40 via-black/80 to-black/40 shadow-inner" />

          {/* Realistic Dual-Page Spread */}
          <div className={`relative w-full h-full max-w-5xl rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden border ${currentTheme.border} transition-all duration-300 ${isFlipping ? 'scale-[0.98] opacity-70' : 'scale-100 opacity-100'}`}>
            
            {/* LEFT SPREAD / PAGE: Chapter Intro & Visuals */}
            <div className={`w-full md:w-1/2 h-full ${currentTheme.paper} p-6 md:p-10 flex flex-col justify-between overflow-y-auto book-page-shadow-left border-b md:border-b-0 md:border-r ${currentTheme.border}`}>
              <div>
                {/* Header Metadata */}
                <div className="flex items-center justify-between pb-4 border-b border-current border-opacity-10 mb-6">
                  <span className="font-mono text-xs uppercase tracking-widest opacity-60">
                    Chapter {currentChapter.chapterNumber} • {currentPage + 1} of {totalPages}
                  </span>
                  <span className={`text-xs font-mono font-semibold ${currentTheme.accent}`}>
                    {book.category}
                  </span>
                </div>

                {/* Chapter Title */}
                <h3 className={`text-2xl md:text-3xl font-serif font-bold ${currentTheme.title} mb-2 leading-tight`}>
                  {currentChapter.title}
                </h3>
                <p className={`text-sm italic mb-6 opacity-75 font-serif`}>
                  {currentChapter.subtitle}
                </p>

                {/* High Quality Chapter Feature Artwork */}
                <div className="relative rounded-xl overflow-hidden mb-6 shadow-md border border-black/10 group">
                  <img
                    src={currentChapter.image}
                    alt={currentChapter.title}
                    className="w-full h-48 md:h-56 object-cover filter contrast-105 group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-mono tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                      Original Curated Edition Plate
                    </span>
                  </div>
                </div>

                {/* Pull Quote */}
                <blockquote className={`p-4 rounded-xl border-l-4 ${currentTheme.quote} text-sm italic font-serif leading-relaxed mb-4`}>
                  {currentChapter.content[currentChapter.content.length - 1]}
                </blockquote>
              </div>

              {/* Left Page Footer Indicator */}
              <div className="pt-4 border-t border-current border-opacity-10 flex items-center justify-between text-xs font-mono opacity-50">
                <span>AETHERIA PRESS</span>
                <span>PAGE {currentPage * 2 + 1}</span>
              </div>
            </div>

            {/* RIGHT SPREAD / PAGE: Reading Text & Interactive Component */}
            <div className={`w-full md:w-1/2 h-full ${currentTheme.paper} p-6 md:p-10 flex flex-col justify-between overflow-y-auto book-page-shadow-right`}>
              <div className="space-y-4">
                {/* Dynamic Content Paragraphs with Customizable Font Size */}
                <div 
                  className="leading-relaxed space-y-4"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {currentChapter.content.slice(0, -1).map((paragraph, idx) => (
                    <p key={idx} className="first-letter:text-3xl first-letter:font-serif first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:text-gold-500">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Interactive Diagram / Node Component (if present in chapter) */}
                {currentChapter.diagram && (
                  <div className="p-4 rounded-xl bg-black/10 dark:bg-black/30 border border-current border-opacity-15 my-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-75 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-gold-500" />
                        {currentChapter.diagram.title}
                      </span>
                      <span className="text-[10px] font-mono opacity-60">Click node to inspect</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentChapter.diagram.nodes.map((node, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedDiagramNode(node === selectedDiagramNode ? null : node)}
                          className={`text-left p-2.5 rounded-lg text-xs font-mono transition-all border ${
                            selectedDiagramNode === node
                              ? 'bg-gold-500/20 border-gold-500 text-gold-400 font-bold'
                              : 'bg-white/5 border-current border-opacity-10 hover:border-gold-500/30'
                          }`}
                        >
                          <span className="text-[10px] opacity-60 block">STEP 0{i+1}</span>
                          <span>{node}</span>
                        </button>
                      ))}
                    </div>

                    {selectedDiagramNode && (
                      <div className="mt-3 p-3 rounded-lg bg-gold-500/10 border border-gold-500/30 text-xs font-mono text-gold-300">
                        ⚡ Active Architecture Inspection: <span className="font-bold underline">{selectedDiagramNode}</span> is executed via recursive validation sandbox before next-token emission.
                      </div>
                    )}
                  </div>
                )}

                {/* Key Takeaway Badge Card */}
                <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs">
                  <span className="font-mono uppercase font-bold text-gold-400 block mb-1">
                    EXECUTIVE TAKEAWAY
                  </span>
                  <p className="opacity-90 leading-snug">
                    Unlocking non-linear advantage requires shifting focus from incremental optimization to sovereign asymmetric architecture.
                  </p>
                </div>
              </div>

              {/* Right Page Footer Indicator */}
              <div className="pt-6 border-t border-current border-opacity-10 flex items-center justify-between text-xs font-mono opacity-50 mt-6">
                <span>INTERACTIVE SAMPLE</span>
                <span>PAGE {currentPage * 2 + 2}</span>
              </div>
            </div>

          </div>

          {/* Navigation Arrows (Floating at Edges) */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass-panel flex items-center justify-center text-slate-300 hover:text-white hover:border-gold-400 transition-all shadow-xl z-30 ${
              currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
            }`}
            title="Previous Page"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass-panel flex items-center justify-center text-slate-300 hover:text-white hover:border-gold-400 transition-all shadow-xl z-30 ${
              currentPage === totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
            }`}
            title="Next Page"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Bar / Action Footer */}
        <footer className="h-16 px-6 bg-obsidian-900 border-t border-white/10 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-4">
            {/* Chapter Jump Selector */}
            <div className="flex items-center gap-1.5">
              {book.sampleChapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playPageFlipSound();
                    setCurrentPage(idx);
                  }}
                  className={`w-7 h-7 rounded-full text-xs font-mono transition-all flex items-center justify-center ${
                    currentPage === idx
                      ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={`Jump to Chapter ${ch.chapterNumber}`}
                >
                  {ch.chapterNumber}
                </button>
              ))}
            </div>

            <span className="hidden lg:inline text-xs font-mono text-slate-400">
              {book.pages} Pages Total • DRM-Free PDF, EPUB & Audio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-xs font-mono text-slate-400 hover:text-white bg-white/5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'LINK COPIED' : 'SHARE'}</span>
            </button>

            <button
              onClick={() => {
                onAddToCart(book);
                handleClose();
              }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-amber-300 text-obsidian-950 font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>ACQUIRE FULL EDITION — {formattedPrice}</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
