import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Bookmark, Volume2, VolumeX, 
  ShoppingBag, Check, Sun, Moon, Maximize2, Minimize2, 
  BookOpen, Clock, AlignLeft
} from 'lucide-react';
import { 
  playPageFlipSound, playBookOpenSound, playBookCloseSound, 
  speakNarratorText, stopNarratorText 
} from '../utils/audioSynthesis';

export default function InteractiveBookModal({ 
  book, 
  isOpen, 
  onClose, 
  onBuyNow 
}) {
  // Reading Room Theme: Defaults to 'ivory' for optimal reading comfort
  const [theme, setTheme] = useState('ivory'); // 'ivory' (default), 'night', 'sepia'
  const [fontSize, setFontSize] = useState(18); // 18px base
  const [distractionFree, setDistractionFree] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const contentRef = useRef(null);

  // Initialize bookmark status from storage
  useEffect(() => {
    if (book) {
      try {
        const savedBookmarks = JSON.parse(localStorage.getItem('aetheria_bookmarks') || '{}');
        setIsBookmarked(Boolean(savedBookmarks[book.id]));
      } catch {
        setIsBookmarked(false);
      }
    }
  }, [book]);

  // Handle open sound & narration stop
  useEffect(() => {
    if (isOpen) {
      playBookOpenSound();
      stopNarratorText();
      setIsNarrating(false);
    } else {
      stopNarratorText();
      setIsNarrating(false);
    }
  }, [isOpen]);

  // Track reading scroll progress
  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.round((scrollTop / maxScroll) * 100)));
    }
  };

  const toggleBookmark = () => {
    if (!book) return;
    try {
      const saved = JSON.parse(localStorage.getItem('aetheria_bookmarks') || '{}');
      const nextState = !isBookmarked;
      if (nextState) {
        saved[book.id] = { bookTitle: book.title, timestamp: new Date().toISOString() };
      } else {
        delete saved[book.id];
      }
      localStorage.setItem('aetheria_bookmarks', JSON.stringify(saved));
      setIsBookmarked(nextState);
    } catch (e) {
      console.debug('Bookmark storage error:', e);
    }
  };

  const handleToggleNarration = () => {
    if (!book || !book.sampleChapter) return;

    if (isNarrating) {
      stopNarratorText();
      setIsNarrating(false);
    } else {
      const textToSpeak = `${book.sampleChapter.title}. ${book.sampleChapter.subtitle}. ${book.sampleChapter.content
        .filter(c => c.type === 'paragraph')
        .map(c => c.text)
        .join(' ')}`;

      speakNarratorText(
        textToSpeak,
        () => setIsNarrating(true),
        () => setIsNarrating(false),
        () => setIsNarrating(false)
      );
    }
  };

  const handleClose = () => {
    stopNarratorText();
    setIsNarrating(false);
    playBookCloseSound();
    onClose();
  };

  if (!isOpen || !book) return null;

  // Reading room themes: High contrast, warm ivory default, zero gold body text
  const themes = {
    ivory: {
      outerBg: 'bg-[#18191c]/90',
      canvas: 'bg-[#faf7f0]',
      text: 'text-[#1e2229]',
      heading: 'text-[#111317]',
      secondaryText: 'text-[#4b5260]',
      border: 'border-[#e4ded0]',
      headerBg: 'bg-[#f4efe4]',
      quoteBg: 'bg-[#f3edd9]',
      quoteBorder: 'border-[#c5a059]',
      noteBg: 'bg-[#f5f0e3]',
      noteBorder: 'border-[#d4c6a6]',
      noteText: 'text-[#38311e]'
    },
    night: {
      outerBg: 'bg-black/95',
      canvas: 'bg-[#121418]',
      text: 'text-[#e2e5eb]',
      heading: 'text-white',
      secondaryText: 'text-[#9ca3af]',
      border: 'border-[#262a33]',
      headerBg: 'bg-[#181b22]',
      quoteBg: 'bg-[#1c202a]',
      quoteBorder: 'border-[#c5a059]',
      noteBg: 'bg-[#1a1e28]',
      noteBorder: 'border-[#323947]',
      noteText: 'text-[#cbd5e1]'
    },
    sepia: {
      outerBg: 'bg-[#1c1917]/90',
      canvas: 'bg-[#f4ebd9]',
      text: 'text-[#332a1f]',
      heading: 'text-[#241c13]',
      secondaryText: 'text-[#615241]',
      border: 'border-[#dfd3bd]',
      headerBg: 'bg-[#ede1cb]',
      quoteBg: 'bg-[#e7d8bf]',
      quoteBorder: 'border-[#9c783e]',
      noteBg: 'bg-[#ebdcc4]',
      noteBorder: 'border-[#cfbca0]',
      noteText: 'text-[#4a3b29]'
    }
  };

  const t = themes[theme];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${book.title} Reading Room`}
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 ${t.outerBg} backdrop-blur-md transition-all duration-300`}
    >
      <div 
        className={`relative w-full max-w-4xl h-[94vh] max-h-[920px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-black/20 ${t.canvas} transition-colors duration-300`}
      >
        
        {/* Reading Progress Top Bar */}
        <div className="w-full h-1 bg-black/10 shrink-0">
          <div 
            className="h-full bg-[#c5a059] transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Minimalist Top Control Bar (Can be hidden in distraction-free mode) */}
        {!distractionFree && (
          <header className={`h-14 px-4 sm:px-6 ${t.headerBg} border-b ${t.border} flex items-center justify-between z-20 shrink-0 transition-colors`}>
            
            {/* Book Metadata Indicator */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#c5a059] shrink-0" />
              <div className="truncate">
                <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${t.heading} truncate block`}>
                  {book.title}
                </span>
                <span className={`text-[10px] font-mono ${t.secondaryText} block truncate`}>
                  {book.author} • Sample Chapter
                </span>
              </div>
            </div>

            {/* Reading Controls */}
            <div className="flex items-center gap-2">
              
              {/* Theme Selector */}
              <div className="flex items-center gap-1 p-1 rounded-lg border border-black/10 bg-black/5">
                <button
                  onClick={() => setTheme('ivory')}
                  className={`px-2 py-0.5 rounded text-[11px] font-serif font-bold transition ${
                    theme === 'ivory' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title="Warm Ivory Theme"
                >
                  Ivory
                </button>
                <button
                  onClick={() => setTheme('sepia')}
                  className={`px-2 py-0.5 rounded text-[11px] font-serif font-bold transition ${
                    theme === 'sepia' ? 'bg-[#9c783e] text-white shadow-sm' : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title="Sepia Manuscript Theme"
                >
                  Sepia
                </button>
                <button
                  onClick={() => setTheme('night')}
                  className={`px-2 py-0.5 rounded text-[11px] font-serif font-bold transition ${
                    theme === 'night' ? 'bg-zinc-800 text-white shadow-sm' : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title="Night Theme"
                >
                  Night
                </button>
              </div>

              {/* Font Size Adjuster */}
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg border border-black/10 bg-black/5 text-xs font-mono">
                <button 
                  onClick={() => setFontSize(Math.max(15, fontSize - 1))}
                  className="px-1 text-slate-500 hover:text-slate-900 transition"
                  title="Decrease font size"
                >
                  A-
                </button>
                <span className="text-[10px] text-slate-500">{fontSize}px</span>
                <button 
                  onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                  className="px-1 text-slate-500 hover:text-slate-900 transition"
                  title="Increase font size"
                >
                  A+
                </button>
              </div>

              {/* Audio Narrator */}
              <button
                onClick={handleToggleNarration}
                className={`p-2 rounded-lg border transition ${
                  isNarrating
                    ? 'bg-[#c5a059] text-white border-[#c5a059]'
                    : 'border-black/10 text-slate-600 hover:text-black bg-black/5'
                }`}
                title="Listen to chapter read aloud"
              >
                {isNarrating ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Bookmark */}
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-lg border transition ${
                  isBookmarked
                    ? 'bg-[#c5a059] text-white border-[#c5a059]'
                    : 'border-black/10 text-slate-600 hover:text-black bg-black/5'
                }`}
                title="Bookmark chapter"
              >
                <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>

              {/* Distraction-Free Toggle */}
              <button
                onClick={() => setDistractionFree(true)}
                className="hidden md:flex p-2 rounded-lg border border-black/10 text-slate-600 hover:text-black bg-black/5 transition"
                title="Distraction-Free Mode"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-2 rounded-lg border border-black/10 text-slate-600 hover:text-black bg-black/5 transition ml-1"
                title="Close Reading Room"
              >
                <X className="w-4 h-4" />
              </button>

            </div>
          </header>
        )}

        {/* Floating exit distraction-free pill */}
        {distractionFree && (
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={() => setDistractionFree(false)}
              className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs font-mono flex items-center gap-1.5 shadow-lg transition"
            >
              <Minimize2 className="w-3 h-3" />
              <span>Exit Focus</span>
            </button>
          </div>
        )}

        {/* Reading Canvas: Comfortable line length (65-72ch), Serif typography */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 sm:px-12 md:px-20 py-10 md:py-16 selection:bg-[#c5a059]/25"
        >
          <article className="max-w-2xl mx-auto space-y-6">
            
            {/* Chapter Header */}
            <header className="border-b border-black/10 pb-8 mb-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#c5a059] font-bold">
                  CHAPTER {book.sampleChapter.chapterNumber} • SAMPLE EXCERPT
                </span>
                <span className="text-black/30">•</span>
                <span className={`text-[11px] font-mono ${t.secondaryText} flex items-center gap-1`}>
                  <Clock className="w-3 h-3" /> {book.sampleChapter.readingTimeMinutes} min read
                </span>
              </div>

              <h1 className={`text-3xl sm:text-4xl font-serif font-bold ${t.heading} leading-tight mb-3`}>
                {book.sampleChapter.title}
              </h1>

              <p className={`text-base sm:text-lg font-serif italic ${t.secondaryText} leading-relaxed`}>
                {book.sampleChapter.subtitle}
              </p>
            </header>

            {/* Chapter Paragraphs & Blocks */}
            <div 
              className={`font-serif ${t.text} space-y-6 leading-[1.8]`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {book.sampleChapter.content.map((block, idx) => {
                if (block.type === 'paragraph') {
                  return (
                    <p key={idx} className="leading-[1.8] tracking-[0.01em]">
                      {block.text}
                    </p>
                  );
                }
                if (block.type === 'heading') {
                  return (
                    <h2 
                      key={idx} 
                      className={`text-2xl font-serif font-bold ${t.heading} pt-6 pb-2 leading-snug`}
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === 'quote') {
                  return (
                    <blockquote 
                      key={idx} 
                      className={`my-8 p-6 rounded-xl border-l-4 ${t.quoteBorder} ${t.quoteBg} italic font-serif text-lg leading-relaxed`}
                    >
                      "{block.text}"
                    </blockquote>
                  );
                }
                if (block.type === 'note') {
                  return (
                    <div 
                      key={idx} 
                      className={`my-8 p-5 rounded-xl border ${t.noteBorder} ${t.noteBg} ${t.noteText} text-sm font-sans leading-relaxed`}
                    >
                      <strong className="font-mono text-xs uppercase tracking-wider block mb-1">
                        Empirical Research Note:
                      </strong>
                      {block.text}
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* End of Excerpt Notice */}
            <div className={`mt-16 p-8 rounded-2xl border ${t.border} ${t.headerBg} text-center space-y-4`}>
              <BookOpen className="w-8 h-8 text-[#c5a059] mx-auto" />
              <h3 className={`text-xl font-serif font-bold ${t.heading}`}>
                End of Sample Excerpt
              </h3>
              <p className={`text-xs sm:text-sm font-sans ${t.secondaryText} max-w-md mx-auto leading-relaxed`}>
                Acquire the complete unabridged publication to unlock all {book.pages} pages, diagrams, vector PDF master, universal EPUB, and audio companion.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    handleClose();
                    onBuyNow(book);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#c5a059] hover:bg-[#d4af37] text-[#07080a] font-bold text-xs tracking-wider transition shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ACQUIRE COMPLETE EDITION — ₹{book.priceINR}</span>
                </button>
              </div>
            </div>

          </article>
        </div>

        {/* Minimal Bottom Status Bar */}
        {!distractionFree && (
          <footer className={`h-12 px-6 ${t.headerBg} border-t ${t.border} flex items-center justify-between text-xs font-mono ${t.secondaryText} shrink-0`}>
            <span>AETHERIA PRESS • UNABRIDGED SAMPLE</span>
            <span>READING PROGRESS: {scrollProgress}%</span>
          </footer>
        )}

      </div>
    </div>
  );
}
