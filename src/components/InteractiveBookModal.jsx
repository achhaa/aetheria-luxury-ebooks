import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Bookmark, Volume2, VolumeX, ShoppingBag, 
  Maximize2, Minimize2, BookOpen, Clock, Copy, Check
} from 'lucide-react';
import { 
  playBookOpenSound, playBookCloseSound, 
  speakNarratorText, stopNarratorText 
} from '../utils/audioSynthesis';

export default function InteractiveBookModal({ 
  book, 
  isOpen, 
  onClose, 
  onBuyNow 
}) {
  // Reading Room Theme: Defaults strictly to 'ivory' for each session
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('aetheria_reader_theme') || 'ivory';
    } catch {
      return 'ivory';
    }
  });

  const [fontSize, setFontSize] = useState(18); // 18px base
  const [distractionFree, setDistractionFree] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const contentRef = useRef(null);

  // Initialize bookmark status & reset scroll when book changes
  useEffect(() => {
    if (book) {
      try {
        const savedBookmarks = JSON.parse(localStorage.getItem('aetheria_bookmarks') || '{}');
        setIsBookmarked(Boolean(savedBookmarks[book.id]));
      } catch {
        setIsBookmarked(false);
      }
      setScrollProgress(0);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [book]);

  // Persist theme preference
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('aetheria_reader_theme', newTheme);
    } catch (e) {
      console.debug('Storage error:', e);
    }
  };

  const handleClose = useCallback(() => {
    stopNarratorText();
    setIsNarrating(false);
    playBookCloseSound();
    onClose();
  }, [onClose]);

  // Handle open sound & narration stop & Escape key dismiss
  useEffect(() => {
    if (isOpen) {
      playBookOpenSound();
      stopNarratorText();
      setIsNarrating(false);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else {
      stopNarratorText();
      setIsNarrating(false);
    }
  }, [isOpen, handleClose]);

  // Clipboard Protection: Intercept native copy event on reading canvas
  // Ensures copied text is clean, background-free plain text and neutral HTML,
  // preventing dark-mode white text from becoming invisible when pasted into white text editors/email!
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleCopy = (e) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const selectedText = selection.toString().trim();
      if (!selectedText) return;

      e.preventDefault();

      // 1. Clean plain text (works anywhere without formatting baggage)
      e.clipboardData.setData('text/plain', selectedText);

      // 2. Safe HTML with default neutral dark-charcoal text and transparent background
      const safeHtml = `<div style="color: #24231f; background-color: transparent; font-family: Georgia, serif; font-size: 16px; line-height: 1.7;">${selectedText.replace(/\n\n/g, '<br/><br/>')}</div>`;
      e.clipboardData.setData('text/html', safeHtml);

      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    };

    container.addEventListener('copy', handleCopy);
    return () => container.removeEventListener('copy', handleCopy);
  }, []);

  // Explicit Copy Excerpt action button
  const handleCopyChapterExcerpt = async () => {
    if (!book || !book.sampleChapter) return;
    const selection = window.getSelection();
    let textToCopy = selection && selection.toString().trim();

    if (!textToCopy) {
      // Default to copying the first 3 substantive paragraphs of the chapter
      const excerptParagraphs = book.sampleChapter.content
        .filter(c => c.type === 'paragraph')
        .slice(0, 3)
        .map(c => c.text)
        .join('\n\n');
      textToCopy = `"${book.title}" — Chapter ${book.sampleChapter.chapterNumber}: ${book.sampleChapter.title}\nBy ${book.author} (${book.authorType})\n\n${excerptParagraphs}\n\n— Aetheria Privé Editions (https://aetheria.store)`;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

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

  if (!isOpen || !book) return null;

  // Reading room themes: High contrast, warm ivory default (#FAF7F0), zero gold body text
  const themes = {
    ivory: {
      themeClass: 'theme-ivory',
      outerBg: 'bg-[#18191c]/90',
      canvas: 'bg-[#FAF7F0]',
      text: 'text-[#24231F]',
      heading: 'text-[#141518]',
      secondaryText: 'text-[#524E48]',
      border: 'border-[#E4DED0]',
      headerBg: 'bg-[#F2ECE0]',
      quoteBg: 'bg-[#F0E9DA]',
      quoteBorder: 'border-[#c5a059]',
      noteBg: 'bg-[#F3EDE0]',
      noteBorder: 'border-[#D9CFBA]',
      noteText: 'text-[#38311E]',
      btnBg: 'bg-[#EAE2D2]',
      btnText: 'text-[#24231F]'
    },
    night: {
      themeClass: 'theme-night',
      outerBg: 'bg-black/95',
      canvas: 'bg-[#121418]',
      text: 'text-[#E7E8EC]',
      heading: 'text-white',
      secondaryText: 'text-[#9CA3AF]',
      border: 'border-[#262A33]',
      headerBg: 'bg-[#181B22]',
      quoteBg: 'bg-[#1C202A]',
      quoteBorder: 'border-[#c5a059]',
      noteBg: 'bg-[#1A1E28]',
      noteBorder: 'border-[#323947]',
      noteText: 'text-[#CBD5E1]',
      btnBg: 'bg-[#222733]',
      btnText: 'text-white'
    },
    sepia: {
      themeClass: 'theme-sepia',
      outerBg: 'bg-[#1C1917]/90',
      canvas: 'bg-[#F4EBD9]',
      text: 'text-[#332A1F]',
      heading: 'text-[#241C13]',
      secondaryText: 'text-[#5C4F40]',
      border: 'border-[#DFD3BD]',
      headerBg: 'bg-[#ECE0C8]',
      quoteBg: 'bg-[#E7D8BE]',
      quoteBorder: 'border-[#9C783E]',
      noteBg: 'bg-[#EBDCC4]',
      noteBorder: 'border-[#CFBCA0]',
      noteText: 'text-[#4A3B29]',
      btnBg: 'bg-[#E2D2B5]',
      btnText: 'text-[#332A1F]'
    }
  };

  const t = themes[theme];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${book.title} Reading Room`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 ${t.outerBg} backdrop-blur-md transition-all duration-300`}
    >
      <div 
        className={`relative w-full max-w-4xl h-[94vh] max-h-[920px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-black/20 ${t.canvas} ${t.themeClass} transition-colors duration-300`}
      >
        
        {/* Reading Progress Top Bar */}
        <div className="w-full h-1 bg-black/10 shrink-0">
          <div 
            className="h-full bg-[#c5a059] transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Minimalist Top Control Bar (Hidden in distraction-free mode) */}
        {!distractionFree && (
          <header className={`h-14 px-4 sm:px-6 ${t.headerBg} border-b ${t.border} flex items-center justify-between z-20 shrink-0 transition-colors`}>
            
            {/* Book Metadata Indicator */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#c5a059] shrink-0" />
              <div className="truncate">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${t.heading} truncate block`}>
                  {book.title}
                </span>
                <span className={`text-[10px] font-mono ${t.secondaryText} block truncate`}>
                  {book.author} ({book.authorType}) • Sample Chapter
                </span>
              </div>
            </div>

            {/* Reading Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Theme Selector: Ivory (default), Sepia, Night */}
              <div className="flex items-center gap-1 p-1 rounded-lg border border-black/10 bg-black/5">
                <button
                  onClick={() => handleThemeChange('ivory')}
                  className={`px-2 py-0.5 rounded text-[11px] font-serif font-bold transition ${
                    theme === 'ivory' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title="Warm Ivory (Default)"
                >
                  Ivory
                </button>
                <button
                  onClick={() => handleThemeChange('sepia')}
                  className={`px-2 py-0.5 rounded text-[11px] font-serif font-bold transition ${
                    theme === 'sepia' ? 'bg-[#9c783e] text-white shadow-sm' : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title="Sepia Manuscript"
                >
                  Sepia
                </button>
                <button
                  onClick={() => handleThemeChange('night')}
                  className={`px-2 py-0.5 rounded text-[11px] font-serif font-bold transition ${
                    theme === 'night' ? 'bg-zinc-800 text-white shadow-sm' : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title="Night Mode"
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

              {/* Copy Plain Text Excerpt Button */}
              <button
                onClick={handleCopyChapterExcerpt}
                className={`p-2 rounded-lg border transition flex items-center gap-1 text-xs font-mono ${
                  copiedSuccess
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-black/10 text-slate-600 hover:text-black bg-black/5'
                }`}
                title="Copy clean unstyled excerpt to clipboard"
              >
                {copiedSuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden md:inline text-[10px]">{copiedSuccess ? 'Copied' : 'Copy'}</span>
              </button>

              {/* Audio Narrator */}
              <button
                onClick={handleToggleNarration}
                className={`p-2 rounded-lg border transition ${
                  isNarrating
                    ? 'bg-[#c5a059] text-black border-[#c5a059]'
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
                    ? 'bg-[#c5a059] text-black border-[#c5a059]'
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

        {/* Reading Canvas: Comfortable line length (65-72ch), Serif typography, high contrast */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 sm:px-12 md:px-20 py-10 md:py-16"
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

              <div className={`text-xs font-mono ${t.secondaryText} mt-4 pt-3 border-t border-black/5`}>
                By <strong className={t.heading}>{book.author}</strong> ({book.authorType})
              </div>
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
                        Editorial Synthesis Note:
                      </strong>
                      {block.text}
                    </div>
                  );
                }
                if (block.type === 'figure' || block.type === 'image') {
                  return (
                    <figure key={idx} className="my-8 flex flex-col items-center">
                      <div className="w-full max-w-xl reader-figure-mat flex items-center justify-center">
                        <img 
                          src={block.url || block.src} 
                          alt={block.caption || 'Architectural Figure'} 
                          className="max-h-72 w-auto object-contain mx-auto"
                          loading="lazy"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className={`mt-3 text-center text-xs font-mono ${t.secondaryText} italic max-w-md`}>
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
                if (block.type === 'case-study') {
                  return (
                    <div key={idx} className={`my-8 p-6 rounded-2xl border ${t.border} ${t.quoteBg}`}>
                      <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#c5a059]/20 text-[#c5a059] font-bold block w-fit mb-2">
                        Empirical Case Study
                      </span>
                      <h4 className={`text-sm font-serif font-bold ${t.heading} mb-2`}>{block.title}</h4>
                      <p className={`text-xs sm:text-sm font-serif leading-relaxed ${t.text}`}>
                        {block.text}
                      </p>
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
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#c5a059] hover:bg-[#d4af37] text-black font-bold text-xs tracking-wider transition shadow-md flex items-center justify-center gap-2"
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
