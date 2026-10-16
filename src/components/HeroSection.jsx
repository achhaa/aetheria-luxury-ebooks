import React, { useRef, useState } from 'react';
import { 
  Sparkles, BookOpen, ArrowRight, ShieldCheck, 
  Star, Download, Headphones, CheckCircle2, Flame
} from 'lucide-react';

export default function HeroSection({ featuredBook, onOpenPreview, onAddToCart, currency = '$', currencyRate = 1 }) {
  const [rotateX, setRotateX] = useState(-5);
  const [rotateY, setRotateY] = useState(15);
  const heroBookRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!heroBookRef.current) return;
    const rect = heroBookRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -15;
    const rY = ((x - centerX) / centerX) * 15;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(-5);
    setRotateY(15);
  };

  const formattedPrice = `${currency}${(featuredBook.priceUSD * currencyRate).toFixed(2)}`;
  const formattedOriginalPrice = `${currency}${(featuredBook.originalPriceUSD * currencyRate).toFixed(2)}`;

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Decorative ambient radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top VIP Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-gold-500/30 shadow-[0_0_20px_rgba(212,175,55,0.15)] text-xs font-mono text-gold-300">
            <Flame className="w-3.5 h-3.5 text-gold-400 animate-bounce" />
            <span className="font-semibold text-white">NEW RELEASE DROP:</span>
            <span>USE CODE <strong className="text-gold-accent underline">VIP20</strong> FOR 20% OFF</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-black tracking-tight leading-[1.08] text-white">
              The Sovereign <br />
              <span className="gold-gradient-text">E-Book Atelier</span> <br />
              for the Next Era.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              We engineer uncompromising, high-impact digital masterworks on Artificial Intelligence, Asymmetric Wealth, High-Resilience Philosophy, and Offensive Cybersecurity. Delivered with full interactive 3D readers, DRM-free vector PDFs, and studio audio companions.
            </p>

            {/* Micro-Features Bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                <span>3D Flipbook Readers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Instant DRM-Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI Narration Built-in</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => onOpenPreview(featuredBook)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-300 hover:from-gold-400 hover:to-amber-200 text-obsidian-950 font-bold text-sm tracking-wider shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>TEST 3D FLIPBOOK PREVIEW</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl glass-panel border border-white/10 hover:border-gold-500/40 text-slate-200 hover:text-white text-sm font-mono tracking-wide transition-all flex items-center justify-center gap-2"
              >
                <span>EXPLORE ALL EDITIONS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Social Proof Bar */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="flex text-gold-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-slate-200">4.98/5.0</span>
                <span className="text-slate-300">(8,500+ Verified Readers)</span>
              </div>
              <div className="h-4 w-px bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Lifetime Updates Guaranteed</span>
              </div>
            </div>

          </div>

          {/* Right Column: Featured 3D Interactive Book Showcase */}
          <div className="lg:col-span-5 flex justify-center perspective-container">
            <div
              ref={heroBookRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: 'transform 0.15s ease-out',
              }}
              className="relative w-72 sm:w-80 md:w-96 cursor-pointer transform-style-preserve-3d group"
              onClick={() => onOpenPreview(featuredBook)}
            >
              {/* Floating Glow Aura */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-gold-500/30 via-cyan-500/20 to-purple-600/30 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Realistic 3D Hardcover Book Container */}
              <div className="relative rounded-2xl overflow-hidden glass-panel-gold border border-gold-500/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] book-shadow">
                
                {/* Book Cover Image */}
                <div className="relative h-[440px] sm:h-[480px] w-full overflow-hidden">
                  <img
                    src={featuredBook.coverImage}
                    alt={featuredBook.title}
                    className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Spine Crease Reflection */}
                  <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />
                  <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-white/25 pointer-events-none" />

                  {/* Overlaid Typography Details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent p-6 flex flex-col justify-between">
                    {/* Top Pill */}
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 rounded-full bg-obsidian-900/80 border border-gold-500/40 text-gold-300 font-mono text-[10px] tracking-widest uppercase backdrop-blur-md">
                        #1 Global Bestseller
                      </span>
                      <span className="w-8 h-8 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center shadow-lg font-bold text-xs">
                        3D
                      </span>
                    </div>

                    {/* Bottom Details */}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400/90 block mb-1">
                        {featuredBook.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-tight mb-2">
                        {featuredBook.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mb-4 font-light">
                        {featuredBook.subtitle}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div>
                          <span className="text-lg font-bold text-gold-400 font-display">
                            {formattedPrice}
                          </span>
                          <span className="text-xs text-slate-300 line-through ml-2 font-mono">
                            {formattedOriginalPrice}
                          </span>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-gold-500 text-obsidian-950 font-bold text-xs flex items-center gap-1 group-hover:scale-105 transition-transform">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>READ SAMPLE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Hover Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-obsidian-900 border border-gold-500/50 shadow-xl text-[11px] font-mono text-gold-300 whitespace-nowrap flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-gold-400" />
                <span>Click to Open 3D Flipbook</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
