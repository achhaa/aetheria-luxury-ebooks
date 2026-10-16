import React from 'react';
import { 
  X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, 
  Cpu, Award, Headphones, Box, Users, Lock, Zap
} from 'lucide-react';

const SUGGESTIONS = [
  {
    icon: Cpu,
    category: 'AI & Next-Gen Tech',
    title: 'AI Book Copilot ("Chat With Your E-Book")',
    status: 'High Impact • High Conversion',
    description: 'Embed a RAG (Retrieval-Augmented Generation) assistant in the reader. Readers can highlight any complex passage and ask: "Explain this for a healthcare startup" or "Generate an executive briefing checklist".'
  },
  {
    icon: Lock,
    category: 'Exclusivity & Anti-Piracy',
    title: 'Dynamic Cryptographic Watermarking',
    status: 'Industry Standard for Luxury',
    description: 'When a customer downloads their PDF or EPUB, dynamically stamp a subtle, elegant holographic watermark on page footers with their name, license hash, and purchase timestamp. This completely eliminates unauthorized distribution while making the file feel personalized.'
  },
  {
    icon: Box,
    category: 'Physical-Digital Synergy',
    title: 'Linen Hardcover Print-on-Demand Upgrade',
    status: 'Massive Profit Margins',
    description: 'Offer a 1-click upsell: "Add Custom Linen Hardcover with Gold Foil Debossing for +$39". Integrate with automated on-demand print APIs (like Prodigi, Blurb, or Lulu xPress) to drop-ship ultra-luxury physical copies automatically.'
  },
  {
    icon: Headphones,
    category: 'Multi-Sensory Immersion',
    title: 'Synced Audio & Highlight Follower ("Karaoke Mode")',
    status: 'Elevates Reading Engagement',
    description: 'As the AI or studio voice narrator reads the text, automatically highlight the active phrase in golden glow and scroll the page automatically. Perfect for busy executives listening during commutes.'
  },
  {
    icon: Zap,
    category: 'Interactive Utility',
    title: 'Interactive Embedded Financial & Risk Calculators',
    status: 'Unrivaled Practical Value',
    description: 'Rather than static text, embed live calculators (e.g., Asymmetric Risk Calculator, Longevity Biomarker Diagnostic, Zero-Trust Architecture Audit) right inside the chapters where readers can input their own data.'
  },
  {
    icon: Users,
    category: 'Community & Network Effects',
    title: 'Private Sovereign Salon (Gated Executive Community)',
    status: 'High LTV & Recurring Value',
    description: 'Purchasers gain access to an exclusive verified Discord / Circle community where they can participate in monthly live fireside Q&A sessions with the authors and network with high-caliber peers.'
  },
  {
    icon: Award,
    category: 'Credentialing',
    title: 'Verifiable Certificate of Mastery & LinkedIn Badge',
    status: 'Viral Distribution Loop',
    description: 'After finishing a book and passing an optional 5-question mastery quiz, issue an encrypted digital Certificate of Completion that readers can post directly to LinkedIn or Twitter, driving organic referral sales.'
  },
  {
    icon: Sparkles,
    category: 'Monetization Strategy',
    title: 'All-Access VIP Sovereign Membership ($199/year)',
    status: 'Predictable Annual Recurring Revenue (ARR)',
    description: 'In addition to single sales, offer an annual VIP Pass giving instant unlocked access to every existing title, plus all upcoming quarterly drops, author private briefings, and raw spreadsheet models.'
  }
];

export default function PremiumSuggestionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl glass-panel-gold border border-gold-500/40 shadow-2xl flex flex-col overflow-hidden animate-fade-in my-8">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between shrink-0 bg-obsidian-900">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
                STRATEGIC ROADMAP FOR ULTRA-PREMIUM E-BOOK COMMERCE
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white">
              8 Pillars to Make Your E-Book Website World-Class
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Suggestions Grid */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <p className="text-sm text-slate-300 font-light leading-relaxed">
            To stand out from commodity bookstores (like Amazon Kindle or Gumroad), high-ticket publication brands command <strong className="text-gold-300">$30 to $150+ per title</strong> by delivering an experience that feels tactile, authoritative, and multi-dimensional. Here are the most valuable features to incorporate:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUGGESTIONS.map((sug, i) => {
              const Icon = sug.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-obsidian-950/70 border border-white/10 hover:border-gold-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-gold-300 border border-white/10">
                        {sug.status}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      {sug.category}
                    </span>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-gold-300 transition-colors">
                      {sug.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {sug.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Golden Quote Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-gold-500/10 via-amber-500/10 to-transparent border border-gold-500/30">
            <span className="text-xs font-mono font-bold text-gold-400 block mb-2 uppercase">
              💡 CORE DESIGN PHILOSOPHY
            </span>
            <p className="text-sm text-slate-200 italic font-serif leading-relaxed">
              "People do not buy e-books simply for raw text. They buy transformation, status, and the sheer delight of interacting with an elevated intellectual artifact. When you give them 3D flip physics, ambient audio, and crisp interactive frameworks, price resistance vanishes."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-obsidian-900 border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-xs font-mono text-slate-400">
            All features above are designed for immediate implementation.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-wider transition"
          >
            CLOSE BLUEPRINT
          </button>
        </div>

      </div>
    </div>
  );
}
