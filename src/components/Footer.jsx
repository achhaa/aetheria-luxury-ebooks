import React from 'react';
import { 
  BookOpen, ShieldCheck, Download, Award, Lock, 
  RefreshCw, CheckCircle2, Mail
} from 'lucide-react';

export default function Footer({ onOpenPolicies, onOpenLibraryLookup }) {
  return (
    <footer className="relative bg-[#07080a] border-t border-white/10 pt-16 pb-12 overflow-hidden text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Pillars of Consumer Protection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-white/10 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059]">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">DRM-Free Master Files</h4>
            <p className="text-[11px] text-slate-400 font-light max-w-[200px]">
              You own your books. Clean PDF and EPUB files ready for Kindle, iPad, and reMarkable.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Peer-Reviewed Rigor</h4>
            <p className="text-[11px] text-slate-400 font-light max-w-[200px]">
              Authored by senior practitioners and researchers. Factual framing and verified citations.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">30-Day Guarantee</h4>
            <p className="text-[11px] text-slate-400 font-light max-w-[200px]">
              If any title fails to transform your operational thinking, receive a 100% refund via Razorpay.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#dfc079]">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Razorpay Encryption</h4>
            <p className="text-[11px] text-slate-400 font-light max-w-[200px]">
              256-bit TLS encrypted settlement with UPI, Cards, NetBanking, and authorized server validation.
            </p>
          </div>
        </div>

        {/* Footer Navigation & Credentials */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#c5a059] text-black flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-white tracking-wider">
              AETHERIA PRIVÉ EDITIONS
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-[11px] text-slate-400">Est. 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px]">
            <button 
              onClick={onOpenPolicies}
              className="text-[#c5a059] hover:underline"
            >
              Refund & Delivery Policies
            </button>
            <button 
              onClick={onOpenLibraryLookup}
              className="hover:text-white transition"
            >
              Retrieve My Library
            </button>
            <a href="#catalog" className="hover:text-white transition">Catalog</a>
            <a href="mailto:support@aetheria.com" className="hover:text-white transition flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>support@aetheria.com</span>
            </a>
          </div>

          <p className="font-mono text-[11px] text-slate-400">
            © 2026 Aetheria Editions. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
