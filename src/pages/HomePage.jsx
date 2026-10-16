import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Headphones, ShieldCheck, ArrowRight, 
  Sparkles, CheckCircle2, Award, Cpu, FileText
} from 'lucide-react';

import { BOOKS_DATA, EDITORIAL_DISPATCHES } from '../data/booksData';
import BookCard from '../components/BookCard';
import OpeningIntro from '../components/OpeningIntro';

export default function HomePage({ onBuyNow, activePlayingId, setActivePlayingId }) {
  const [showOpeningIntro, setShowOpeningIntro] = useState(false);
  const featuredBook = BOOKS_DATA[0]; // The Artificial Mind

  return (
    <div className="bg-white text-[#1d1d1f]">
      
      {/* 1. Optional Cinematic Opening (Can be triggered or skipped) */}
      {showOpeningIntro && (
        <OpeningIntro onComplete={() => setShowOpeningIntro(false)} />
      )}

      {/* 2. Hero Section: Precision & Calm Editorial Authority */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 bg-[#f5f5f7] border-b border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Subtle Top Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-black/10 text-xs font-mono text-[#1d1d1f] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#997328]" />
              <span className="font-semibold">AETHERIA PRIVÉ EDITIONS</span>
              <span className="text-[#86868b]">•</span>
              <span className="text-[#6e6e73]">ALL VOLUMES UNDER ₹500</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left: Editorial Proposition */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight leading-[1.08] text-[#1d1d1f]">
                The Publishing Atelier <br />
                <span className="text-[#997328]">for Inquiring Minds.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#515154] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Aetheria crafts authoritative nonfiction e-books on Autonomous Artificial Reason, Asymmetric Capital, Offensive Cybersecurity, and Modern Stoic Command. Designed for effortless reading in warm ivory and delivered with instantaneous DRM-free master files.
              </p>

              {/* Core Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-[#515154]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#997328]" />
                  <span>Warm Ivory Reader</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0071e3]" />
                  <span>Synchronized Audiobook</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Print-Grade PDF & EPUB</span>
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to={`/read/${featuredBook.id}`}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs font-mono tracking-wider shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>READ FREE CHAPTER</span>
                </Link>

                <Link
                  to={`/books/${featuredBook.slug}`}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-black/15 hover:border-black/30 bg-white hover:bg-gray-50 text-[#1d1d1f] text-xs font-mono tracking-wide transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <FileText className="w-4 h-4 text-[#997328]" />
                  <span>VIEW DOSSIER & CITATIONS</span>
                </Link>
              </div>

              {/* Pricing Transparency */}
              <div className="pt-6 border-t border-black/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#6e6e73] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#1d1d1f]">₹299</span>
                  <span>Direct Authoritative Price</span>
                </div>
                <div className="h-4 w-px bg-black/15 hidden sm:block" />
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Lifetime Sovereign Access</span>
                </div>
              </div>

            </div>

            {/* Right: Featured Book Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 sm:w-80 rounded-2xl overflow-hidden bg-white border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] group hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] transition-all duration-500">
                <div className="relative h-[420px] w-full overflow-hidden bg-[#f5f5f7]">
                  <img
                    src={featuredBook.coverImage}
                    alt={featuredBook.title}
                    className="w-full h-full object-cover filter brightness-[0.98] group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Left Spine Crease Simulation */}
                  <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />

                  {/* Corner Badges */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1d1d1f] font-mono text-[10px] font-bold shadow-xs">
                      Curated Release
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-lg bg-[#1d1d1f] text-[#fde68a] font-mono font-bold text-xs shadow-xs">
                      ₹{featuredBook.priceINR}
                    </span>
                  </div>

                  {/* Bottom Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 text-white">
                    <span className="text-[10px] font-mono uppercase text-[#fde68a] block mb-1">
                      {featuredBook.category}
                    </span>
                    <h2 className="text-xl font-serif font-bold text-white leading-snug mb-1">
                      {featuredBook.title}
                    </h2>
                    <p className="text-xs text-white/80 line-clamp-2 mb-3 font-sans font-light">
                      {featuredBook.subtitle}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs font-mono">
                      <span className="text-white/80">{featuredBook.pages} Pages • DRM-Free</span>
                      <Link 
                        to={`/books/${featuredBook.slug}`}
                        className="text-[#fde68a] font-bold flex items-center gap-1 hover:underline"
                      >
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Curated Catalogue Preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#997328] font-bold block mb-2">
              CURATED PUBLICATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#1d1d1f]">
              Core Editorial Titles
            </h2>
            <p className="text-sm text-[#6e6e73] mt-2 font-sans max-w-xl">
              Original, peer-reviewed manuscripts spanning synthetic cognition, convex finance, infrastructure cryptography, and cellular longevity.
            </p>
          </div>

          <Link
            to="/books"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0071e3] hover:underline pb-1"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Book Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BOOKS_DATA.slice(0, 3).map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onBuyNow={onBuyNow}
              activePlayingId={activePlayingId}
              setActivePlayingId={setActivePlayingId}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/books"
            className="px-8 py-3.5 rounded-xl border border-black/10 hover:border-black/20 bg-[#f5f5f7] hover:bg-gray-100 text-[#1d1d1f] font-mono text-xs font-bold transition shadow-xs"
          >
            EXPLORE ALL 5 DISCIPLINARY VOLUMES
          </Link>
        </div>

      </section>

      {/* 4. Atelier of Modern Inquiries — Brand Introduction & Editorial Provenance */}
      <section className="py-20 bg-[#f5f5f7] border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/10 text-xs font-mono text-[#997328] shadow-xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>EDITORIAL PROVENANCE & VALUES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#1d1d1f]">
              The Atelier of Modern Inquiries
            </h2>
            <p className="text-sm sm:text-base text-[#515154] leading-relaxed">
              Aetheria was established to reimagine digital publishing as an artisan craft—merging state-of-the-art computational synthesis with rigorous human editorial standards, tactile reading comfort, and verified citations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-2xl bg-white border border-black/10 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#997328]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1d1d1f]">
                AI-Assisted, Human-Refined
              </h3>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                Our manuscripts are developed with advanced AI research tools and distilled by specialist editors. We utilize consistent editorial pen names (A. Rowan, Elias Mercer, C. Vale, Julian Ashford, and Elena Voss) to represent distinct thematic inquiries with transparent authorship.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-black/10 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1d1d1f]">
                Sovereign DRM-Free Master Files
              </h3>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                We reject predatory subscription models and restrictive walled gardens. When you acquire a volume on Aetheria, you receive master vector PDF and universal EPUB editions you can read on Kindle, Apple Books, or reMarkable forever.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-black/10 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1d1d1f]">
                Fair, Transparent Pricing
              </h3>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                High-impact intellectual artifacts should not be gated behind prohibitive pricing. Every single edition in our catalogue is priced transparently in Indian Rupees between ₹199 and ₹349, with zero recurring charges.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Reader Perspectives & Critical Dispatches */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#997328] font-bold block">
            CRITICAL PERSPECTIVES & DISPATCHES
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#1d1d1f]">
            Early Reader Observations
          </h2>
          <p className="text-sm text-[#6e6e73] font-light">
            Reflections from early review editions exploring agency, asymmetric risk, and computational defense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EDITORIAL_DISPATCHES.map((dispatch) => (
            <div
              key={dispatch.id}
              className="p-7 rounded-2xl bg-[#f5f5f7] border border-black/5 hover:border-black/15 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#997328] px-2.5 py-1 rounded-full bg-white border border-black/5 font-semibold inline-block mb-3">
                  {dispatch.topic}
                </span>

                <h3 className="text-base font-serif font-bold text-[#1d1d1f] mb-3">
                  {dispatch.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#515154] font-serif italic leading-relaxed mb-6">
                  "{dispatch.note}"
                </p>
              </div>

              <div className="pt-4 border-t border-black/10 flex items-center justify-between text-[11px] font-mono text-[#6e6e73]">
                <span>Regarding: {dispatch.bookRef}</span>
                <span className="text-[#1d1d1f] font-semibold">{dispatch.authorCredit}</span>
              </div>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}
