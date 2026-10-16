import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck,
  Type, Sun, Moon, Coffee, Volume2, VolumeX, Play, Pause, 
  RotateCcw, RotateCw, List, Share2, Check, Sparkles, BookOpen,
  Headphones, AlertCircle, Info, ExternalLink
} from 'lucide-react';

import { BOOKS_DATA } from '../data/booksData';
import { AudiobookSynchronizer } from '../utils/audiobookEngine';
import { playPageFlipSound } from '../utils/audioSynthesis';

// Split structured content into readable pages (~150-220 words per page)
function paginateChapter(chapter) {
  if (!chapter || !chapter.content) return [];

  const pages = [];
  let currentPageBlocks = [];
  let currentWordCount = 0;
  let runningWordIndex = 0;

  chapter.content.forEach((block) => {
    // Process block text into words with global chapter word indices
    const words = block.text.split(/(\s+)/);
    const indexedWords = [];

    for (let i = 0; i < words.length; i++) {
      const token = words[i];
      if (/\S/.test(token)) {
        indexedWords.push({
          word: token,
          isSpace: false,
          globalWordIndex: runningWordIndex++
        });
      } else {
        indexedWords.push({
          word: token,
          isSpace: true,
          globalWordIndex: -1
        });
      }
    }

    const blockWordsCount = indexedWords.filter(w => !w.isSpace).length;

    // Page budget check
    if (currentWordCount + blockWordsCount > 220 && currentPageBlocks.length > 0) {
      pages.push(currentPageBlocks);
      currentPageBlocks = [];
      currentWordCount = 0;
    }

    currentPageBlocks.push({
      ...block,
      indexedWords
    });
    currentWordCount += blockWordsCount;
  });

  if (currentPageBlocks.length > 0) {
    pages.push(currentPageBlocks);
  }

  return pages.length > 0 ? pages : [[]];
}

export default function ReaderPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const book = BOOKS_DATA.find((b) => b.id === bookId || b.slug === bookId) || BOOKS_DATA[0];

  // Reading Preferences
  const [theme, setTheme] = useState(() => localStorage.getItem('aetheria_reader_theme') || 'ivory');
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem('aetheria_reader_font_size')) || 18);
  const [isTOCSidebarOpen, setIsTOCSidebarOpen] = useState(false);
  const [copyToast, setCopyToast] = useState(null);

  // Chapter & Page State
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(`aetheria_bookmarks_${book.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Audiobook & Karaoke State
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSyncHighlightEnabled, setIsSyncHighlightEnabled] = useState(true);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [timingData, setTimingData] = useState(null);
  const [audioSourceType, setAudioSourceType] = useState('none'); // 'prerecorded', 'synthesis', 'none'

  const synchronizerRef = useRef(null);
  const readerContentRef = useRef(null);

  // Get current chapter
  const currentChapter = useMemo(() => {
    if (book.chapters && book.chapters.length > 0) {
      return book.chapters[currentChapterIndex] || book.chapters[0];
    }
    return book.sampleChapter || { chapterNumber: '01', title: 'Chapter 01', content: [] };
  }, [book, currentChapterIndex]);

  // Paginated pages for current chapter
  const pages = useMemo(() => {
    return paginateChapter(currentChapter);
  }, [currentChapter]);

  // Total pages in current chapter
  const totalPages = pages.length;

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('aetheria_reader_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('aetheria_reader_font_size', String(fontSize));
  }, [fontSize]);

  // Load reading progress
  useEffect(() => {
    const saved = localStorage.getItem(`aetheria_progress_${book.id}`);
    if (saved) {
      try {
        const { chapterIdx, pageIdx } = JSON.parse(saved);
        if (chapterIdx !== undefined) setCurrentChapterIndex(chapterIdx);
        if (pageIdx !== undefined) setCurrentPageIndex(pageIdx);
      } catch {}
    }
  }, [book.id]);

  // Save reading progress
  useEffect(() => {
    localStorage.setItem(`aetheria_progress_${book.id}`, JSON.stringify({
      chapterIdx: currentChapterIndex,
      pageIdx: currentPageIndex,
      updatedAt: new Date().toISOString()
    }));
  }, [book.id, currentChapterIndex, currentPageIndex]);

  // Fetch Audiobook Timing Data for current chapter
  useEffect(() => {
    let isCancelled = false;
    const fetchTiming = async () => {
      try {
        const chapterId = `chapter-${String(currentChapterIndex + 1).padStart(2, '0')}`;
        const res = await fetch(`/api/audiobook/${book.id}/${chapterId}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setTimingData(data);
            setAudioSourceType('prerecorded');
            setAudioDuration(data.durationSeconds || 0);
          }
        } else {
          if (!isCancelled) {
            setTimingData(null);
            setAudioSourceType('synthesis');
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setTimingData(null);
          setAudioSourceType('synthesis');
        }
      }
    };

    fetchTiming();
    return () => { isCancelled = true; };
  }, [book.id, currentChapterIndex]);

  // Initialize Synchronizer
  useEffect(() => {
    const sync = new AudiobookSynchronizer({
      timingData,
      onWordChange: (idx, seg) => {
        setActiveWordIndex(idx);
        if (idx >= 0 && isSyncHighlightEnabled) {
          // Check if word is on another page; if so, advance page!
          findAndAdvancePageForWord(idx);
        }
      },
      onEnd: () => {
        setIsPlaying(false);
        setActiveWordIndex(-1);
      },
      onError: (err) => {
        console.warn('[Reader] Audio error:', err);
        setIsPlaying(false);
      }
    });

    if (timingData && timingData.audioUrl) {
      sync.loadAudio(timingData.audioUrl);
    }

    synchronizerRef.current = sync;

    return () => {
      sync.destroy();
    };
  }, [timingData, isSyncHighlightEnabled]);

  // Synchronize synchronizer timing updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (synchronizerRef.current && isPlaying) {
        setAudioCurrentTime(synchronizerRef.current.getCurrentTime());
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Automatically advance page when active word belongs to a different page
  const findAndAdvancePageForWord = (globalWordIdx) => {
    for (let p = 0; p < pages.length; p++) {
      const pageBlocks = pages[p];
      for (const block of pageBlocks) {
        const hasWord = block.indexedWords.some(w => w.globalWordIndex === globalWordIdx);
        if (hasWord) {
          if (p !== currentPageIndex) {
            setCurrentPageIndex(p);
            playPageFlipSound();
          }
          return;
        }
      }
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, totalPages, currentChapterIndex]);

  // Selection & Copy Interceptor to prevent white-on-white text pasting
  useEffect(() => {
    const handleCopy = (e) => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const rawText = selection.toString();
      if (!rawText.trim()) return;

      e.preventDefault();
      const attribution = `\n\n— From "${book.title}" by ${book.author} (Aetheria Privé Edition)`;
      const fullText = rawText + attribution;

      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', fullText);
        e.clipboardData.setData('text/html', `<div style="font-family: Georgia, serif; color: #111111; line-height: 1.6;">${rawText.replace(/\n/g, '<br/>')}<em>${attribution}</em></div>`);
      }

      setCopyToast('Excerpt copied cleanly with attribution');
      setTimeout(() => setCopyToast(null), 3000);
    };

    const canvas = readerContentRef.current;
    if (canvas) {
      canvas.addEventListener('copy', handleCopy);
      return () => canvas.removeEventListener('copy', handleCopy);
    }
  }, [book.title, book.author]);

  // Page Navigation Handlers
  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      playPageFlipSound();
      setCurrentPageIndex(prev => prev + 1);
    } else if (currentChapterIndex < (book.chapters?.length || 1) - 1) {
      // Transition to next chapter
      playPageFlipSound();
      setCurrentChapterIndex(prev => prev + 1);
      setCurrentPageIndex(0);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      playPageFlipSound();
      setCurrentPageIndex(prev => prev - 1);
    } else if (currentChapterIndex > 0) {
      // Transition to previous chapter's last page
      playPageFlipSound();
      setCurrentChapterIndex(prev => prev - 1);
      setCurrentPageIndex(0);
    }
  };

  // Bookmark Toggle
  const isCurrentPageBookmarked = bookmarks.some(
    (b) => b.chapterIdx === currentChapterIndex && b.pageIdx === currentPageIndex
  );

  const handleToggleBookmark = () => {
    let next;
    if (isCurrentPageBookmarked) {
      next = bookmarks.filter(b => !(b.chapterIdx === currentChapterIndex && b.pageIdx === currentPageIndex));
    } else {
      const excerpt = pages[currentPageIndex]?.[0]?.text?.slice(0, 100) || `${currentChapter.title} - Page ${currentPageIndex + 1}`;
      next = [
        ...bookmarks,
        {
          id: `bm_${Date.now()}`,
          chapterIdx: currentChapterIndex,
          pageIdx: currentPageIndex,
          chapterTitle: currentChapter.title,
          excerpt,
          createdAt: new Date().toISOString()
        }
      ];
    }
    setBookmarks(next);
    localStorage.setItem(`aetheria_bookmarks_${book.id}`, JSON.stringify(next));
  };

  // Audio Controls
  const togglePlayAudio = () => {
    if (!synchronizerRef.current) return;

    if (isPlaying) {
      synchronizerRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioSourceType === 'prerecorded') {
        synchronizerRef.current.play();
        setIsPlaying(true);
      } else {
        // Fallback Web Speech Synthesis
        const textToRead = currentChapter.content.map(b => b.text).join(' ');
        synchronizerRef.current.startSpeechSynthesisFallback(textToRead);
        setIsPlaying(true);
      }
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (synchronizerRef.current) {
      synchronizerRef.current.setPlaybackRate(speed);
    }
  };

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    setAudioCurrentTime(val);
    if (synchronizerRef.current) {
      synchronizerRef.current.seek(val);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const activePageBlocks = pages[currentPageIndex] || [];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 theme-${theme}`}>
      
      {/* 1. Minimalist Editorial Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-black/5 bg-inherit/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Exit & Book Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/books/${book.slug || book.id}`)}
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-inherit opacity-70 hover:opacity-100 transition p-1.5 rounded-lg hover:bg-black/5"
            title="Return to Book Dossier"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dossier</span>
          </button>

          <div className="h-4 w-px bg-black/10 hidden sm:block" />

          <div>
            <h1 className="text-xs sm:text-sm font-serif font-bold truncate max-w-[180px] sm:max-w-xs md:max-w-md">
              {book.title}
            </h1>
            <span className="text-[10px] font-mono opacity-60 block">
              Chapter {currentChapter.chapterNumber}: {currentChapter.title}
            </span>
          </div>
        </div>

        {/* Center: Table of Contents & Quick Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTOCSidebarOpen(!isTOCSidebarOpen)}
            className="px-2.5 py-1.5 rounded-lg border border-black/10 hover:border-black/20 text-xs font-mono flex items-center gap-1.5 transition"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Contents</span>
          </button>
        </div>

        {/* Right: Controls (Theme, Font Size, Audio, Bookmark) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-lg border transition ${
              isCurrentPageBookmarked
                ? 'bg-[#c5a059]/20 border-[#c5a059] text-[#997328]'
                : 'border-black/10 hover:border-black/20 text-inherit opacity-70 hover:opacity-100'
            }`}
            title={isCurrentPageBookmarked ? 'Remove Bookmark' : 'Bookmark this page'}
          >
            {isCurrentPageBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Font Size Adjusters */}
          <div className="hidden sm:flex items-center border border-black/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
              className="px-2 py-1 text-xs font-mono font-bold hover:bg-black/5 transition"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="px-1.5 text-[10px] font-mono opacity-60">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
              className="px-2 py-1 text-xs font-mono font-bold hover:bg-black/5 transition"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center border border-black/10 rounded-lg p-0.5">
            <button
              onClick={() => setTheme('ivory')}
              className={`p-1.5 rounded text-xs transition ${
                theme === 'ivory' ? 'bg-[#faf7f0] text-black shadow-sm font-bold border border-black/20' : 'opacity-60 hover:opacity-100'
              }`}
              title="Ivory Paper Theme (Default)"
            >
              <Sun className="w-3.5 h-3.5 text-[#997328]" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`p-1.5 rounded text-xs transition ${
                theme === 'sepia' ? 'bg-[#f0e4cc] text-[#2b180a] shadow-sm font-bold border border-black/20' : 'opacity-60 hover:opacity-100'
              }`}
              title="Sepia Warm Theme"
            >
              <Coffee className="w-3.5 h-3.5 text-[#8c5828]" />
            </button>
            <button
              onClick={() => setTheme('night')}
              className={`p-1.5 rounded text-xs transition ${
                theme === 'night' ? 'bg-[#17181b] text-white shadow-sm font-bold border border-white/20' : 'opacity-60 hover:opacity-100'
              }`}
              title="Night Reading Theme"
            >
              <Moon className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </div>

          {/* Listen to Book Toggle */}
          <button
            onClick={() => setIsAudioPlayerVisible(!isAudioPlayerVisible)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              isAudioPlayerVisible
                ? 'bg-[#0071e3] text-white shadow-md'
                : 'border border-black/10 hover:border-black/20 text-inherit opacity-80 hover:opacity-100'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audiobook</span>
          </button>

        </div>

      </header>

      {/* 2. Main Page-by-Page Reading Canvas */}
      <main className="flex-1 flex flex-col justify-between max-w-3xl mx-auto w-full px-6 sm:px-10 py-8 relative">
        
        {/* Copy Toast Notification */}
        {copyToast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/90 text-white text-xs font-mono shadow-2xl flex items-center gap-2 animate-fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{copyToast}</span>
          </div>
        )}

        {/* Page Header (Chapter Number & Title) */}
        <div className="border-b border-black/5 pb-4 mb-6 flex items-center justify-between text-xs font-mono opacity-50">
          <span>CHAPTER {currentChapter.chapterNumber}</span>
          <span>{currentChapter.title}</span>
        </div>

        {/* Discrete Page Text Container */}
        <article 
          ref={readerContentRef}
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.75' }}
          className="font-serif select-text flex-1"
        >
          {activePageBlocks.length === 0 ? (
            <div className="py-20 text-center opacity-40 font-mono text-xs">
              Page content loading...
            </div>
          ) : (
            activePageBlocks.map((block, bIdx) => {
              if (block.type === 'heading') {
                return (
                  <h3 key={bIdx} className="text-xl sm:text-2xl font-serif font-bold tracking-tight mt-8 mb-4">
                    {block.indexedWords ? (
                      block.indexedWords.map((item, wIdx) => renderWordSpan(item, wIdx))
                    ) : block.text}
                  </h3>
                );
              }

              if (block.type === 'quote') {
                return (
                  <blockquote key={bIdx} className="my-6 pl-5 border-l-2 border-[#c5a059] italic opacity-90">
                    {block.indexedWords ? (
                      block.indexedWords.map((item, wIdx) => renderWordSpan(item, wIdx))
                    ) : block.text}
                  </blockquote>
                );
              }

              if (block.type === 'note') {
                return (
                  <div key={bIdx} className="my-6 p-4 rounded-xl bg-black/5 text-xs font-mono opacity-90 border border-black/5">
                    {block.indexedWords ? (
                      block.indexedWords.map((item, wIdx) => renderWordSpan(item, wIdx))
                    ) : block.text}
                  </div>
                );
              }

              return (
                <p key={bIdx} className="mb-5 text-justify hyphens-auto">
                  {block.indexedWords ? (
                    block.indexedWords.map((item, wIdx) => renderWordSpan(item, wIdx))
                  ) : block.text}
                </p>
              );
            })
          )}
        </article>

        {/* Page Footer Navigation */}
        <footer className="pt-8 mt-6 border-t border-black/5 flex items-center justify-between text-xs font-mono">
          
          {/* Previous Page Button */}
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0 && currentChapterIndex === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
              currentPageIndex === 0 && currentChapterIndex === 0
                ? 'opacity-20 cursor-not-allowed border-black/5'
                : 'border-black/10 hover:border-black/20 hover:bg-black/5 text-inherit'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Page Progress Indicator */}
          <div className="flex items-center gap-2 opacity-60">
            <span>Page {currentPageIndex + 1} of {totalPages}</span>
            <span>•</span>
            <span>Chapter {currentChapterIndex + 1}/{book.chapters?.length || 1}</span>
          </div>

          {/* Next Page Button */}
          <button
            onClick={handleNextPage}
            disabled={
              currentPageIndex === totalPages - 1 &&
              currentChapterIndex === (book.chapters?.length || 1) - 1
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
              currentPageIndex === totalPages - 1 &&
              currentChapterIndex === (book.chapters?.length || 1) - 1
                ? 'opacity-20 cursor-not-allowed border-black/5'
                : 'border-black/10 hover:border-black/20 hover:bg-black/5 text-inherit font-semibold'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </footer>

      </main>

      {/* Helper to render word with active karaoke highlight */}
      {function renderWordSpan(item, key) {
        if (item.isSpace) {
          return <span key={key}>{item.word}</span>;
        }

        const isActive = isSyncHighlightEnabled && item.globalWordIndex === activeWordIndex;
        const isPast = isSyncHighlightEnabled && activeWordIndex > 0 && item.globalWordIndex < activeWordIndex;

        return (
          <span
            key={key}
            className={`${isActive ? 'word-active' : ''} ${isPast ? 'word-completed' : ''}`}
            data-word-idx={item.globalWordIndex}
          >
            {item.word}
          </span>
        );
      }}

      {/* 3. Docked Audiobook Synchronized Player Bar */}
      {isAudioPlayerVisible && (
        <aside 
          className="sticky bottom-0 z-40 border-t border-black/10 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] px-4 sm:px-8 py-3.5 transition-all"
          style={{
            backgroundColor: theme === 'night' ? '#1c1e22' : theme === 'sepia' ? '#e9ddc3' : '#f5f2ea'
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            
            {/* Top Status & Sync Toggle */}
            <div className="flex items-center justify-between text-[11px] font-mono opacity-80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-inherit">
                  {audioSourceType === 'prerecorded' ? 'STUDIO AUDIOBOOK NARRATION' : 'TEXT-TO-SPEECH NARRATOR'}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline opacity-70">
                  {timingData ? `${timingData.totalSegments} synchronized words` : 'Chapter audio synthesis'}
                </span>
              </div>

              {/* Sync Toggle */}
              <button
                onClick={() => setIsSyncHighlightEnabled(!isSyncHighlightEnabled)}
                className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition ${
                  isSyncHighlightEnabled
                    ? 'bg-[#0071e3] text-white font-bold'
                    : 'bg-black/10 text-inherit opacity-60'
                }`}
              >
                {isSyncHighlightEnabled ? 'Karaoke Sync: Active' : 'Karaoke Sync: Off'}
              </button>
            </div>

            {/* Scrubber Timeline */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono opacity-60 w-10 text-right">
                {formatTime(audioCurrentTime)}
              </span>

              <input
                type="range"
                min="0"
                max={audioDuration || 263}
                step="0.5"
                value={audioCurrentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
              />

              <span className="text-[10px] font-mono opacity-60 w-10">
                {formatTime(audioDuration || 263)}
              </span>
            </div>

            {/* Playback Controls Bar */}
            <div className="flex items-center justify-between">
              
              {/* Left: Speed selector */}
              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="opacity-50 text-[10px] hidden sm:inline">Speed:</span>
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleSpeedChange(rate)}
                    className={`px-1.5 py-0.5 rounded text-[10px] transition ${
                      playbackSpeed === rate
                        ? 'bg-black/15 font-bold underline'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Center: Play / Pause & Seek 15s */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => synchronizerRef.current?.seekRelative(-15)}
                  className="p-1.5 rounded-lg hover:bg-black/5 opacity-70 hover:opacity-100 transition"
                  title="Rewind 15 Seconds"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlayAudio}
                  className="w-10 h-10 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white flex items-center justify-center shadow-md transition hover:scale-105 active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => synchronizerRef.current?.seekRelative(15)}
                  className="p-1.5 rounded-lg hover:bg-black/5 opacity-70 hover:opacity-100 transition"
                  title="Forward 15 Seconds"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Right: Chapter Navigation */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="opacity-50 text-[10px] hidden sm:inline">Chapter:</span>
                <button
                  onClick={() => {
                    if (currentChapterIndex > 0) {
                      setCurrentChapterIndex(prev => prev - 1);
                      setCurrentPageIndex(0);
                    }
                  }}
                  disabled={currentChapterIndex === 0}
                  className="px-2 py-1 rounded hover:bg-black/5 disabled:opacity-20"
                >
                  Prev
                </button>
                <span className="text-[11px] font-bold">{currentChapter.chapterNumber}</span>
                <button
                  onClick={() => {
                    if (currentChapterIndex < (book.chapters?.length || 1) - 1) {
                      setCurrentChapterIndex(prev => prev + 1);
                      setCurrentPageIndex(0);
                    }
                  }}
                  disabled={currentChapterIndex >= (book.chapters?.length || 1) - 1}
                  className="px-2 py-1 rounded hover:bg-black/5 disabled:opacity-20"
                >
                  Next
                </button>
              </div>

            </div>

          </div>
        </aside>
      )}

      {/* 4. Table of Contents Slide-Out Drawer */}
      {isTOCSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-sm h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-black/10"
            style={{
              backgroundColor: theme === 'night' ? '#17181b' : theme === 'sepia' ? '#f0e4cc' : '#faf7f0'
            }}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <h3 className="font-serif font-bold text-base">Table of Contents</h3>
                <button
                  onClick={() => setIsTOCSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-black/5 text-xs font-mono"
                >
                  Close
                </button>
              </div>

              {/* Chapters list */}
              <div className="space-y-2">
                {(book.chapters || [book.sampleChapter]).map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setCurrentPageIndex(0);
                      setIsTOCSidebarOpen(false);
                      playPageFlipSound();
                    }}
                    className={`w-full text-left p-3 rounded-xl transition flex items-start gap-3 ${
                      currentChapterIndex === idx
                        ? 'bg-black/10 font-bold border border-black/10'
                        : 'hover:bg-black/5 opacity-80'
                    }`}
                  >
                    <span className="font-mono text-xs opacity-50 mt-0.5">{ch.chapterNumber}</span>
                    <div>
                      <h4 className="text-sm font-serif">{ch.title}</h4>
                      <p className="text-[11px] opacity-60 font-sans mt-0.5">{ch.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Bookmarks list */}
              {bookmarks.length > 0 && (
                <div className="pt-4 border-t border-black/10">
                  <h4 className="text-xs font-mono uppercase tracking-wider opacity-60 mb-3">
                    Saved Bookmarks ({bookmarks.length})
                  </h4>
                  <div className="space-y-2">
                    {bookmarks.map((bm) => (
                      <button
                        key={bm.id}
                        onClick={() => {
                          setCurrentChapterIndex(bm.chapterIdx);
                          setCurrentPageIndex(bm.pageIdx);
                          setIsTOCSidebarOpen(false);
                          playPageFlipSound();
                        }}
                        className="w-full text-left p-2.5 rounded-lg bg-black/5 hover:bg-black/10 text-xs font-mono transition"
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>Chapter {bm.chapterIdx + 1} • Page {bm.pageIdx + 1}</span>
                          <BookmarkCheck className="w-3.5 h-3.5 text-[#997328]" />
                        </div>
                        <p className="text-[10px] opacity-60 truncate mt-1">"{bm.excerpt}"</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-6 border-t border-black/10 flex items-center justify-between text-xs font-mono">
              <Link to={`/books/${book.slug || book.id}`} className="hover:underline opacity-70">
                Book Dossier
              </Link>
              <Link to="/library" className="hover:underline opacity-70">
                My Library
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
