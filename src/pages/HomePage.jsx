import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, ShieldCheck, ArrowRight, 
  Sparkles, CheckCircle2, Award, Cpu, FileText
} from 'lucide-react';

import { BOOKS_DATA, EDITORIAL_DISPATCHES } from '../data/booksData';
import BookCard from '../components/BookCard';

// Framer Motion Animation Variants
const containerStaggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const itemSpringVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 22,
    },
  },
};

const cardSpringVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 24,
    },
  },
};

export default function HomePage({ onBuyNow, activePlayingId, setActivePlayingId }) {
  const featuredBook = BOOKS_DATA[0]; // The Artificial Mind

  return (
    <div className="text-[var(--site-text)]">
      
      {/* 1. Hero Section: Precision & Calm Editorial Authority with Translucent Scrim */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 bg-white/10 dark:bg-black/20 backdrop-blur-xs border-b border-black/5 dark:border-white/10 overflow-hidden transition-colors">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerStaggerVariants}
        >
          
          {/* Subtle Top Badge */}
          <motion.div variants={itemSpringVariants} className="flex justify-center mb-6">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('aetheria:replay-intro'))}
              title="Click to replay brand launch intro"
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 dark:bg-[#1c1f26]/90 border border-black/10 dark:border-white/10 text-xs font-mono text-[#1d1d1f] dark:text-[#f5f5f7] shadow-xs hover:border-[#997328]/40 transition-colors cursor-pointer backdrop-blur-sm group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#997328] dark:bg-[#c5a059] group-hover:scale-125 transition-transform" />
              <span className="font-semibold">AETHERIA PRIVÉ EDITIONS</span>
              <span className="text-[#86868b] dark:text-[#71717a]">•</span>
              <span className="text-[#6e6e73] dark:text-[#a1a1a6]">ALL VOLUMES UNDER ₹500</span>
              <Sparkles className="w-3 h-3 text-[#997328] dark:text-[#c5a059] opacity-70 group-hover:opacity-100" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left: Editorial Proposition */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <motion.h1 
                variants={itemSpringVariants}
                className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight leading-[1.08] text-[#1d1d1f] dark:text-[#f5f5f7]"
              >
                The Publishing Atelier <br />
                <span className="text-[#997328] dark:text-[#c5a059]">for Inquiring Minds.</span>
              </motion.h1>

              <motion.p 
                variants={itemSpringVariants}
                className="text-base sm:text-lg text-[#515154] dark:text-[#a1a1a6] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans"
              >
                Aetheria crafts authoritative nonfiction e-books on Autonomous Artificial Reason, Asymmetric Capital, Offensive Cybersecurity, and Modern Stoic Command. Designed for effortless reading in warm ivory and delivered with instantaneous DRM-free master files.
              </motion.p>

              {/* Core Feature Badges */}
              <motion.div 
                variants={itemSpringVariants}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-[#515154] dark:text-[#a1a1a6]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#997328] dark:text-[#c5a059]" />
                  <span>Warm Ivory Reader</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0071e3] dark:text-sky-400" />
                  <span>Synchronized Audiobook</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Print-Grade PDF & EPUB</span>
                </div>
              </motion.div>

              {/* Primary CTAs with Spring Feedback */}
              <motion.div 
                variants={itemSpringVariants}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
              >
                <motion.div 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }} 
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to={`/read/${featuredBook.id}`}
                    className="w-full px-7 py-3.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs font-mono tracking-wider shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>READ FREE CHAPTER</span>
                  </Link>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }} 
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to={`/books/${featuredBook.slug}`}
                    className="w-full px-6 py-3.5 rounded-xl border border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-white/30 bg-white/95 dark:bg-[#1c1f26]/90 hover:bg-gray-50 dark:hover:bg-white/10 text-[#1d1d1f] dark:text-[#f5f5f7] text-xs font-mono tracking-wide flex items-center justify-center gap-2 shadow-xs transition-colors backdrop-blur-sm"
                  >
                    <FileText className="w-4 h-4 text-[#997328] dark:text-[#c5a059]" />
                    <span>VIEW DOSSIER & CITATIONS</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Pricing Transparency */}
              <motion.div 
                variants={itemSpringVariants}
                className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#6e6e73] dark:text-[#a1a1a6] font-mono"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">₹299</span>
                  <span>Direct Authoritative Price</span>
                </div>
                <div className="h-4 w-px bg-black/15 dark:bg-white/15 hidden sm:block" />
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Lifetime Sovereign Access</span>
                </div>
              </motion.div>

            </div>

            {/* Right: Featured Book Showcase with 3D Spring Motion */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative w-72 sm:w-80 rounded-2xl overflow-hidden bg-white/95 dark:bg-[#1c1f26]/95 border border-black/10 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] group hover:shadow-[0_25px_60px_rgba(0,0,0,0.14)] dark:hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-shadow duration-500 backdrop-blur-md"
              >
                <div className="relative h-[420px] w-full overflow-hidden bg-[#f5f5f7] dark:bg-black/40">
                  <img
                    src={featuredBook.coverImage}
                    alt={featuredBook.title}
                    className="w-full h-full object-cover filter brightness-[0.98] group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Left Spine Crease Simulation */}
                  <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />

                  {/* Corner Badges */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#14161a]/90 backdrop-blur-md text-[#1d1d1f] dark:text-[#f5f5f7] font-mono text-[10px] font-bold shadow-xs">
                      Curated Release
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-lg bg-[#1d1d1f] dark:bg-[#c5a059] text-[#fde68a] dark:text-black font-mono font-bold text-xs shadow-xs">
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
              </motion.div>
            </div>

          </div>

        </motion.div>
      </section>

      {/* 2. Curated Catalogue Preview with Spring Card Lift */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#997328] dark:text-[#c5a059] font-bold block mb-2">
              CURATED PUBLICATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#1d1d1f] dark:text-[#f5f5f7]">
              Core Editorial Titles
            </h2>
            <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6] mt-2 font-sans max-w-xl">
              Original, peer-reviewed manuscripts spanning synthetic cognition, convex finance, infrastructure cryptography, and cellular longevity.
            </p>
          </div>

          <Link
            to="/books"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0071e3] dark:text-sky-400 hover:underline pb-1"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Book Cards Grid with Framer Motion Stagger & Spring Lift */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerStaggerVariants}
        >
          {BOOKS_DATA.slice(0, 3).map((book) => (
            <motion.div
              key={book.id}
              variants={cardSpringVariants}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="h-full flex flex-col"
            >
              <BookCard
                book={book}
                onBuyNow={onBuyNow}
                activePlayingId={activePlayingId}
                setActivePlayingId={setActivePlayingId}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <Link
              to="/books"
              className="px-8 py-3.5 rounded-xl border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/25 bg-white/95 dark:bg-[#1c1f26]/90 hover:bg-gray-50 dark:hover:bg-white/10 text-[#1d1d1f] dark:text-[#f5f5f7] font-mono text-xs font-bold transition shadow-xs backdrop-blur-sm"
            >
              EXPLORE ALL 5 DISCIPLINARY VOLUMES
            </Link>
          </motion.div>
        </div>

      </section>

      {/* 3. Atelier of Modern Inquiries — Brand Introduction & Editorial Provenance */}
      <section className="py-20 bg-white/10 dark:bg-black/20 backdrop-blur-xs border-y border-black/5 dark:border-white/10 transition-colors">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerStaggerVariants}
        >
          
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <motion.div variants={itemSpringVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 dark:bg-[#1c1f26]/90 border border-black/10 dark:border-white/10 text-xs font-mono text-[#997328] dark:text-[#c5a059] shadow-xs backdrop-blur-sm">
              <BookOpen className="w-3.5 h-3.5" />
              <span>EDITORIAL PROVENANCE & VALUES</span>
            </motion.div>
            <motion.h2 variants={itemSpringVariants} className="text-3xl sm:text-4xl font-serif font-extrabold text-[#1d1d1f] dark:text-[#f5f5f7]">
              The Atelier of Modern Inquiries
            </motion.h2>
            <motion.p variants={itemSpringVariants} className="text-sm sm:text-base text-[#515154] dark:text-[#a1a1a6] leading-relaxed">
              Aetheria was established to reimagine digital publishing as an artisan craft—merging state-of-the-art computational synthesis with rigorous human editorial standards, tactile reading comfort, and verified citations.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <motion.div 
              variants={cardSpringVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="p-8 rounded-2xl bg-white/95 dark:bg-[#1c1f26]/90 border border-black/10 dark:border-white/10 space-y-4 shadow-xs backdrop-blur-md"
            >
              <div className="w-12 h-12 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#997328] dark:text-[#c5a059]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                AI-Assisted, Human-Refined
              </h3>
              <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                Our manuscripts are developed with advanced AI research tools and distilled by specialist editors. We utilize consistent editorial pen names (A. Rowan, Elias Mercer, C. Vale, Julian Ashford, and Elena Voss) to represent distinct thematic inquiries with transparent authorship.
              </p>
            </motion.div>

            <motion.div 
              variants={cardSpringVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="p-8 rounded-2xl bg-white/95 dark:bg-[#1c1f26]/90 border border-black/10 dark:border-white/10 space-y-4 shadow-xs backdrop-blur-md"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Sovereign DRM-Free Master Files
              </h3>
              <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                We reject predatory subscription models and restrictive walled gardens. When you acquire a volume on Aetheria, you receive master vector PDF and universal EPUB editions you can read on Kindle, Apple Books, or reMarkable forever.
              </p>
            </motion.div>

            <motion.div 
              variants={cardSpringVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="p-8 rounded-2xl bg-white/95 dark:bg-[#1c1f26]/90 border border-black/10 dark:border-white/10 space-y-4 shadow-xs backdrop-blur-md"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Fair, Transparent Pricing
              </h3>
              <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                High-impact intellectual artifacts should not be gated behind prohibitive pricing. Every single edition in our catalogue is priced transparently in Indian Rupees between ₹199 and ₹349, with zero recurring charges.
              </p>
            </motion.div>

          </div>

        </motion.div>
      </section>

      {/* 4. Reader Perspectives & Critical Dispatches */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#997328] dark:text-[#c5a059] font-bold block">
            CRITICAL PERSPECTIVES & DISPATCHES
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#1d1d1f] dark:text-[#f5f5f7]">
            Early Reader Observations
          </h2>
          <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6] font-light">
            Reflections from early review editions exploring agency, asymmetric risk, and computational defense.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerStaggerVariants}
        >
          {EDITORIAL_DISPATCHES.map((dispatch) => (
            <motion.div
              key={dispatch.id}
              variants={cardSpringVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="p-7 rounded-2xl bg-white/95 dark:bg-[#1c1f26]/90 border border-black/5 dark:border-white/10 hover:border-black/15 dark:hover:border-white/20 transition-all flex flex-col justify-between backdrop-blur-md shadow-xs"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#997328] dark:text-[#c5a059] px-2.5 py-1 rounded-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 font-semibold inline-block mb-3">
                  {dispatch.topic}
                </span>

                <h3 className="text-base font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                  {dispatch.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#515154] dark:text-[#a1a1a6] font-serif italic leading-relaxed mb-6">
                  "{dispatch.note}"
                </p>
              </div>

              <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-[#6e6e73] dark:text-[#a1a1a6]">
                <span>Regarding: {dispatch.bookRef}</span>
                <span className="text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold">{dispatch.authorCredit}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </section>

    </div>
  );
}
