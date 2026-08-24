import React from 'react';
import { Sparkles, ShieldCheck, Phone, MessageSquare } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-[#0C3822] text-[#E8F5E9] text-xs border-b border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs">
        {/* Left Trust Pillars */}
        <div className="flex items-center flex-wrap gap-4 sm:gap-6 font-medium">
          <div className="flex items-center gap-1.5 text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-[#F2C94C]" />
            <span className="font-semibold">Fresh 100% Home Style Meals</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F2C94C]" />
            <span>Hygienic Cloud Kitchen • Shree Foods</span>
          </div>
        </div>

        {/* Right Contact & WhatsApp */}
        <div className="flex items-center gap-3 sm:gap-4 font-semibold">
          <a
            href="tel:9004848984"
            className="flex items-center gap-1.5 text-[#FAF7F2] hover:text-[#F2C94C] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#F2C94C]" />
            <span>9004848984</span>
          </a>
          <a
            href="https://wa.me/919004848984?text=Hello%20Bring%20My%20Bite,%20I%20would%20like%20to%20know%20more%20about%20tiffin%20subscriptions"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-150 px-2.5 py-1 rounded-lg border border-[#25D366]/40 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
            <span className="text-[#86efac]">WhatsApp Us</span>
          </a>
        </div>
      </div>
    </div>
  );
};
