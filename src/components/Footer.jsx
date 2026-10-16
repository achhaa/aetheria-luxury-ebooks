import React, { useState } from 'react';
import { 
  BookOpen, ShieldCheck, Download, Award, Lock, 
  ArrowRight, Check, Sparkles, Send
} from 'lucide-react';

export default function Footer({ onOpenPremiumGuide }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="relative bg-obsidian-950 border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Decorative subtle ambient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* VIP Newsletter Bar */}
        <div className="p-8 rounded-3xl glass-panel-gold border border-gold-500/30 mb-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> THE SOVEREIGN DISPATCH
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                Receive Unreleased Chapters & VIP Privileges
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl">
                Subscribe to our fortnightly dispatch for private manuscript previews, author briefings, and receive an instant <strong>$10 credit voucher</strong>.
              </p>
            </div>

            <div className="lg:col-span-5">
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your executive email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/15 focus:border-gold-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-wider transition shadow-[0_0_20px_rgba(212,175,55,0.3)] shrink-0 flex items-center gap-1.5"
                  >
                    <span>JOIN</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold block">DISPATCH ACTIVATED</span>
                    <span className="text-[11px]">Use code <strong className="text-white underline">VIP10</strong> at checkout for $10 off.</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 4 Pillars of Guarantee */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-white/10 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-400">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">DRM-Free Forever</h4>
            <p className="text-[11px] text-slate-400 font-light max-w-[180px]">
              You own your files. Download PDF, EPUB, and audio with zero vendor lock-in.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Peer-Reviewed</h4>
            <p className="text-[11px] text-slate-400 font-light max-w-[180px]">
              Authored by senior practitioners, Fellows, and field operators.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">30-Day Guarantee</h4>
            <p className="text-[11px] text-slate-400 font-light max-w-[180px]">
              If an edition doesn't transform your outlook, receive an unconditional refund.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">256-Bit Cryptography</h4>
            <p className="text-[11px] text-slate-400 font-light max-w-[180px]">
              Military-grade encrypted settlement with Apple Pay, Cards, and Web3 USDC.
            </p>
          </div>
        </div>

        {/* Footer Navigation & Copyright */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gold-500 text-obsidian-950 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-slate-200 tracking-wider">
              AETHERIA PRIVÉ EDITIONS
            </span>
            <span className="text-slate-400">|</span>
            <span className="font-mono text-[11px]">Est. 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px]">
            <button 
              onClick={onOpenPremiumGuide}
              className="text-gold-400 hover:text-gold-300 underline underline-offset-4"
            >
              Platform Blueprint
            </button>
            <a href="#catalog" className="hover:text-white transition">Collections</a>
            <a href="#" className="hover:text-white transition">Institutional Licenses</a>
            <a href="#" className="hover:text-white transition">Author Inquiries</a>
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
          </div>

          <p className="font-mono text-[11px] text-slate-400">
            © 2026 Aetheria Editions Inc. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
