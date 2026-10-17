import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, Mail, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState('refund'); // 'refund', 'terms', 'privacy', 'legal-review'

  return (
    <div className="min-h-screen py-12 md:py-20 text-[var(--site-text)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-white/5 border border-black/5 dark:border-white/10 text-[#997328] dark:text-[#c5a059] text-xs font-mono font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TRANSPARENCY & CONSUMER PROTECTION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
            Policies, Terms & Legal Governance
          </h1>
          <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6] mt-2 font-sans">
            Clear, honest terms governing digital book acquisitions, refunds, licensing, and consumer rights under applicable Indian regulatory frameworks.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-black/10 dark:border-white/10 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('refund')}
            className={`pb-3 px-4 text-xs font-mono font-bold whitespace-nowrap border-b-2 transition ${
              activeTab === 'refund' ? 'border-[#997328] dark:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]' : 'border-transparent text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
            }`}
          >
            Digital Refund Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-4 text-xs font-mono font-bold whitespace-nowrap border-b-2 transition ${
              activeTab === 'terms' ? 'border-[#997328] dark:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]' : 'border-transparent text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
            }`}
          >
            Sovereign Licensing Terms
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-4 text-xs font-mono font-bold whitespace-nowrap border-b-2 transition ${
              activeTab === 'privacy' ? 'border-[#997328] dark:border-[#c5a059] text-[#1d1d1f] dark:text-[#f5f5f7]' : 'border-transparent text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
            }`}
          >
            Privacy & Security
          </button>
          <button
            onClick={() => setActiveTab('legal-review')}
            className={`pb-3 px-4 text-xs font-mono font-bold whitespace-nowrap border-b-2 transition ${
              activeTab === 'legal-review' ? 'border-[#997328] dark:border-[#c5a059] text-[#997328] dark:text-[#c5a059]' : 'border-transparent text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
            }`}
          >
            Legal Review Gate (Pre-Launch)
          </button>
        </div>

        {/* Tab 1: Refund Policy */}
        {activeTab === 'refund' && (
          <div className="space-y-6 text-sm text-[#515154] dark:text-[#a1a1a6] leading-relaxed font-sans">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-mono flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>CONSUMER NOTICE (DIGITAL CONTENT DELIVERY):</strong> Under the Consumer Protection (E-Commerce) Rules 2020 and standard digital goods conventions, digital products are made accessible immediately upon transaction verification. Please review our fair evaluation process below.
              </div>
            </div>

            <h2 className="text-xl font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
              1. 30-Day Fair Digital Refund Policy
            </h2>
            <p>
              Aetheria offers an evaluated 30-day refund window from the date of purchase. Because our publications are delivered as non-returnable, DRM-free vector PDF and reflowable EPUB master files, refunds are processed under the following criteria:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Corrupted or Defective Deliverables:</strong> If a downloaded file fails rendering, contains truncated chapters, or displays structural formatting errors that cannot be rectified by our technical support team within 48 hours.</li>
              <li><strong>Mismatched Description:</strong> If the delivered volume substantially departs from the approved dossier synopsis or table of contents.</li>
              <li><strong>Duplicate Transaction:</strong> Accidental double charges for the identical title via Razorpay within a 24-hour period will be automatically refunded in full.</li>
            </ul>

            <h2 className="text-xl font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
              2. Refund Request Procedure
            </h2>
            <p>
              To request an evaluation, contact our editorial desk at <a href="mailto:support@aetheria.luxury" className="text-[#0071e3] dark:text-sky-400 underline">support@aetheria.luxury</a> with your Razorpay Payment ID (`pay_...`) and Order ID (`order_...`). Our team investigates and issues a resolution within 48 business hours. Approved refunds are credited directly to the original payment source (UPI, Credit/Debit Card, Net Banking) via Razorpay settlement reversal within 5 to 7 business days.
            </p>
          </div>
        )}

        {/* Tab 2: Terms */}
        {activeTab === 'terms' && (
          <div className="space-y-6 text-sm text-[#515154] dark:text-[#a1a1a6] leading-relaxed font-sans">
            <h2 className="text-xl font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
              Personal DRM-Free Master License
            </h2>
            <p>
              When you acquire a publication on Aetheria, you receive a perpetual, royalty-free, non-exclusive license for personal reading across all devices you own (including e-ink readers, tablets, phones, and personal computers).
            </p>
            <h3 className="text-base font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
              Permitted Usages:
            </h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Conversion to personal formats (e.g. converting EPUB to Kindle formats for personal use).</li>
              <li>Storing backup copies on personal hard drives, cloud storage, or e-readers.</li>
              <li>Fair-use excerpt quoting with proper academic or journalistic attribution.</li>
            </ul>
            <h3 className="text-base font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
              Prohibited Usages:
            </h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Commercial redistribution, resale, or sublicensing of master PDF/EPUB files.</li>
              <li>Public uploading to torrent trackers, pirate repositories, or open document archives.</li>
              <li>Ingesting complete manuscripts into commercial AI training sets without prior licensing agreement.</li>
            </ul>
          </div>
        )}

        {/* Tab 3: Privacy */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 text-sm text-[#515154] dark:text-[#a1a1a6] leading-relaxed font-sans">
            <h2 className="text-xl font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
              Privacy & Cryptographic Data Integrity
            </h2>
            <p>
              Aetheria adheres to strict data minimization. We collect only what is strictly required to issue cryptographic order tokens and fulfill payment reconciliation with Razorpay.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>No Third-Party Ad Trackers:</strong> We do not deploy Meta Pixel, Google Analytics advertising pixels, or invasive behavioural telemetry.</li>
              <li><strong>Zero Payment Storage:</strong> Complete card details and UPI PINs are processed exclusively within Razorpay’s PCI-DSS Level 1 compliant gateway. We never store primary credit card numbers on our servers.</li>
              <li><strong>Download Token Expiry:</strong> Digital download URLs are generated using HMAC SHA-256 tokens expiring after 24 hours to prevent unauthorized hotlinking.</li>
            </ul>
          </div>
        )}

        {/* Tab 4: Legal Review Gate */}
        {activeTab === 'legal-review' && (
          <div className="space-y-6 text-sm text-[#515154] dark:text-[#a1a1a6] leading-relaxed font-sans">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs font-mono">
              <strong>PRE-LAUNCH LEGAL REVIEW AUDIT LOG:</strong> This gate tracks mandatory review items required before transitioning from Razorpay Test Mode to Live Production Settlement.
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#f5f5f7] dark:bg-[#14161a]">
                <h3 className="text-sm font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                  1. Razorpay Merchant Onboarding & KYC
                </h3>
                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6]">
                  Status: <em>Awaiting production merchant approval</em>. The platform currently operates in deterministic test mode with full cryptographic HMAC signature verification.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#f5f5f7] dark:bg-[#14161a]">
                <h3 className="text-sm font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                  2. Consumer Protection (E-Commerce) Rules Compliance
                </h3>
                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6]">
                  Status: <em>Compliant</em>. Authoritative pricing in INR, clear grievance contact (`support@aetheria.luxury`), total price transparency without hidden drip pricing.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#f5f5f7] dark:bg-[#14161a]">
                <h3 className="text-sm font-serif font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                  3. Ethical Authorship & Pen Name Attributions
                </h3>
                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6]">
                  Status: <em>Compliant</em>. All five author names (A. Rowan, Elias Mercer, C. Vale, Julian Ashford, Elena Voss) are clearly identified as editorial pen names. No fabricated academic degrees or false peer-review endorsements are claimed.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
