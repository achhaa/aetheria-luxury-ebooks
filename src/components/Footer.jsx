import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Mail, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7] border-t border-black/10 text-[#6e6e73] py-16 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Atelier */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-[#1d1d1f]">
              <div className="w-7 h-7 rounded-lg bg-[#1d1d1f] flex items-center justify-center text-[#c5a059]">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="font-display font-bold text-sm tracking-wider">AETHERIA</span>
            </div>
            <p className="text-xs leading-relaxed text-[#6e6e73]">
              The digital publishing atelier for inquiring minds. High-impact intellectual works prepared with AI research synthesis and human editorial rigor.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#997328] font-bold pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>All Volumes Under ₹500</span>
            </div>
          </div>

          {/* Col 2: Publications */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#1d1d1f] font-bold">
              Publications
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li><Link to="/books/the-artificial-mind" className="hover:text-[#1d1d1f] transition">The Artificial Mind (₹299)</Link></li>
              <li><Link to="/books/the-sovereign-mind" className="hover:text-[#1d1d1f] transition">The Sovereign Mind (₹349)</Link></li>
              <li><Link to="/books/ghost-in-the-wire" className="hover:text-[#1d1d1f] transition">Ghost in the Wire (₹299)</Link></li>
              <li><Link to="/books/the-stoic-sovereign" className="hover:text-[#1d1d1f] transition">The Stoic Sovereign (₹199)</Link></li>
              <li><Link to="/books/bio-optima" className="hover:text-[#1d1d1f] transition">Bio-Optima (₹249)</Link></li>
            </ul>
          </div>

          {/* Col 3: Reader Services */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#1d1d1f] font-bold">
              Reader Access
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li><Link to="/books" className="hover:text-[#1d1d1f] transition">Browse Catalogue</Link></li>
              <li><Link to="/library" className="hover:text-[#1d1d1f] transition">Customer Library & Downloads</Link></li>
              <li><Link to="/read/the-artificial-mind" className="hover:text-[#1d1d1f] transition">Web Reader & Audiobook</Link></li>
              <li><Link to="/refund-policy" className="hover:text-[#1d1d1f] transition">30-Day Digital Refund Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-[#1d1d1f] transition">Consumer Protection Disclosures</Link></li>
            </ul>
          </div>

          {/* Col 4: Verified Contact & Admin */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#1d1d1f] font-bold">
              Desk & Governance
            </h4>
            <div className="text-xs space-y-2">
              <p>Editorial Inquiries & Grievance Officer:</p>
              <a 
                href="mailto:support@aetheria.luxury" 
                className="font-mono font-bold text-[#1d1d1f] hover:text-[#0071e3] flex items-center gap-1.5 transition"
              >
                <Mail className="w-3.5 h-3.5 text-[#997328]" />
                <span>support@aetheria.luxury</span>
              </a>
              <p className="text-[11px] text-[#86868b] pt-1">
                Razorpay Level 1 Settlement • Indian Rupee Processing
              </p>
              <div className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#86868b] hover:text-[#1d1d1f] transition"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Console</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#86868b] gap-4">
          <div>
            © 2026 Aetheria Privé Editions. All rights reserved. Master files protected under personal DRM-free licensing.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/refund-policy" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:underline">Refunds</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
