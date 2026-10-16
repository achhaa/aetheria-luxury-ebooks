import React from 'react';
import { X, ShieldCheck, RefreshCw, Lock, Mail, FileText, CheckCircle2 } from 'lucide-react';

export default function EditorialPoliciesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Editorial & Commerce Policies"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-[#0c0e14] border border-white/10 shadow-2xl flex flex-col overflow-hidden my-6">
        
        {/* Header */}
        <header className="p-6 border-b border-white/10 flex items-center justify-between bg-[#07080a] shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#c5a059]" />
            <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-wide">
              AETHERIA COMMERCE & EDITORIAL POLICIES
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Close policies"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs text-slate-300 font-light leading-relaxed">
          
          {/* Section 1: Digital Delivery Policy */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
              1. Digital Delivery Policy (Immediate & Sovereign)
            </h3>
            <p>
              All publications on Aetheria are 100% digital products. Upon successful cryptographic verification of your Razorpay payment, you receive instantaneous access to download your vector PDF and universal EPUB editions directly in your browser. Additionally, a permanent acquisition receipt with your unique order reference is issued.
            </p>
            <p className="text-slate-400 font-mono text-[11px]">
              Expiring links: For security against unauthorized link scraping, download links remain active for 24 hours. You can regenerate fresh download links at any time using our "My Library" portal with your registered email.
            </p>
          </div>

          {/* Section 2: 30-Day Unconditional Refund Policy */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              2. 30-Day Unconditional Refund Policy
            </h3>
            <p>
              We stand behind the editorial quality and technical rigor of our manuscripts. If any publication does not meet your expectations or fails to deliver substantive intellectual value, simply send an email to <strong className="text-white">support@aetheria.com</strong> within 30 days of purchase stating your order ID. We will issue a 100% full refund through Razorpay directly to your original payment method within 3–5 business days. No interrogations.
            </p>
          </div>

          {/* Section 3: Privacy & Payment Security */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-400" />
              3. Payment Security & Privacy
            </h3>
            <p>
              Aetheria never stores or processes credit card numbers, CVVs, or UPI PINs on its servers. All financial transactions are securely handed off to Razorpay via 256-bit TLS encryption. Secret API keys remain strictly on the isolated server side. Your personal data is never sold, leased, or transmitted to advertising brokers.
            </p>
          </div>

          {/* Section 4: Terms of Sovereign License */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#dfc079]" />
              4. Terms of Sovereign License
            </h3>
            <p>
              Purchasing an edition grants the buyer a perpetual, non-exclusive, non-transferable license for personal, educational, and professional study. You are entitled to load your copies onto an unlimited number of personal devices (Kindle, iPad, reMarkable, laptop). Unauthorized public redistribution or commercial resale is strictly prohibited.
            </p>
          </div>

          {/* Section 5: Grievance Officer & Contact */}
          <div className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#c5a059]" />
              5. Editorial Contact & Support Desk
            </h3>
            <div className="text-[11px] font-mono text-slate-300 space-y-1">
              <div>• Support & Inquiries: support@aetheria.com</div>
              <div>• Operational Hours: Monday – Saturday, 09:00 to 18:00 IST</div>
              <div>• Registered Entity: Aetheria Digital Atelier LLP, Indiranagar, Bangalore, KA 560038, India</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="p-5 bg-[#07080a] border-t border-white/10 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d4af37] text-black font-bold text-xs font-mono transition"
          >
            I UNDERSTAND
          </button>
        </footer>

      </div>
    </div>
  );
}
