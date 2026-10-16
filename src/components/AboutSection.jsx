import React from 'react';
import { BookOpen, ShieldCheck, Cpu, Award, FileText, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden border-t border-white/5 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#c5a059]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>EDITORIAL PROVENANCE & VALUES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white leading-tight">
            The Atelier of Modern Inquiries
          </h2>
          <p className="text-base text-slate-300 font-light leading-relaxed">
            Aetheria was established to reimagine digital publishing as an artisan craft—merging state-of-the-art computational synthesis with rigorous human editorial standards and tactile reading comfort.
          </p>
        </div>

        {/* 3 Core Editorial Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          <div className="p-8 rounded-2xl bg-[#0c0e14] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-white">
              AI-Assisted, Human-Refined
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Our manuscripts are developed with advanced AI research tools and distilled by specialist editors. We utilize consistent editorial pen names (A. Rowan, Elias Mercer, C. Vale, Julian Ashford, and Elena Voss) to represent distinct thematic inquiries with transparent authorship.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0c0e14] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-white">
              Sovereign DRM-Free Files
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              We reject predatory subscription models and restrictive walled gardens. When you acquire a volume on Aetheria, you receive master vector PDF and universal EPUB editions you can read on Kindle, Apple Books, or reMarkable forever.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0c0e14] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-white">
              Fair, Transparent Pricing
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              High-impact intellectual artifacts should not be gated behind prohibitive pricing. Every single edition in our catalogue is priced transparently in Indian Rupees between ₹199 and ₹349, with zero recurring charges.
            </p>
          </div>

        </div>

        {/* Fact-checking & Editorial Standards Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0d0f14] border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#c5a059] font-bold">
                FACT-CHECKING & RIGOR
              </span>
              <h3 className="text-2xl font-display font-bold text-white">
                Clear Demarcation of Scientific Consensus
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                In technical domains such as artificial intelligence, cryptography, and geroscience, we explicitly distinguish established empirical findings from emerging research hypotheses. We do not make unsubstantiated health promises or financial guarantees.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-2.5 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified primary citations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Transparent pen name attribution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero fabricated qualifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>30-day unconditional refund policy</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
