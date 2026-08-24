import React from 'react';
import { Logo } from './Logo';
import { useApp } from '../../context/AppContext';
import { Phone, Mail, MapPin, ShieldCheck, Heart, ArrowRight, Lock } from 'lucide-react';
import { useCms } from '../../cms/CmsContext';

export const Footer: React.FC = () => {
  const { siteSettings, pricing, payment } = useCms();
  const { setActiveRole, setIsRegistrationOpen, setIsInstantOrderOpen, setIsWeeklyMenuOpen, openStaffLogin } = useApp();

  return (
    <footer className="bg-[#0A2A1B] text-[#E0EADF] pt-14 pb-8 border-t border-emerald-950" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/60">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <Logo size="lg" variant="light" />
            <p className="text-sm text-emerald-200/80 leading-relaxed">
              Wholesome, hygienic, and authentic home-style tiffin delivery. Prepared with fresh ingredients, balanced nutrition, and delivered punctually to college gates and office desks.
            </p>
            <div className="pt-2 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F2C94C]" />
              <span>FSSAI Certified • 100% Food Grade 5CP Trays</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base tracking-wide uppercase font-serif-title">
              Our Offerings
            </h4>
            <ul className="space-y-2 text-sm text-emerald-200/90">
              <li>
                <button
                  onClick={() => setIsRegistrationOpen(true)}
                  className="hover:text-[#F2C94C] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#C88A24]" />
                  <span>Veg Classic Plan (₹{pricing.vegMonthly.toLocaleString()}/mo)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsRegistrationOpen(true)}
                  className="hover:text-[#F2C94C] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#C88A24]" />
                  <span>Egg Delight Plan (₹{pricing.eggMonthly.toLocaleString()}/mo)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsRegistrationOpen(true)}
                  className="hover:text-[#F2C94C] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#C88A24]" />
                  <span>Non-Veg Club (₹{pricing.nonVegMonthly.toLocaleString()}/mo)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsInstantOrderOpen(true)}
                  className="hover:text-[#F2C94C] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#C88A24]" />
                  <span>Instant Thalis (From ₹{pricing.vegThaliInstant})</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsWeeklyMenuOpen(true)}
                  className="hover:text-[#F2C94C] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#C88A24]" />
                  <span>Weekly 7-Day Rotational Menu</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Delivery Model */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base tracking-wide uppercase font-serif-title">
              Delivery Coverage
            </h4>
            <div className="text-xs text-emerald-200/90 space-y-2.5">
              <div className="bg-[#124E33]/60 p-2.5 rounded-lg border border-emerald-800">
                <span className="font-bold text-[#F2C94C] block">🎓 College Students</span>
                Hot lunch delivered right at the College Front Gate before break time.
              </div>
              <div className="bg-[#124E33]/60 p-2.5 rounded-lg border border-emerald-800">
                <span className="font-bold text-[#F2C94C] block">💼 Working Professionals</span>
                Delivered directly to your Office Security Gate or Main Reception.
              </div>
              <div className="bg-[#124E33]/60 p-2.5 rounded-lg border border-emerald-800">
                <span className="font-bold text-[#F2C94C] block">🏠 Dinner at Home</span>
                Delivered to your registered society or flat doorstep.
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Order Helpline */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base tracking-wide uppercase font-serif-title">
              Direct Helpline
            </h4>
            <p className="text-xs text-emerald-200/80">
              For subscriptions, bulk catering, or menu queries:
            </p>
            <div className="space-y-2 text-sm">
              <a
                href={`tel:${payment.phone}`}
                className="flex items-center gap-2 text-white hover:text-[#F2C94C] font-bold text-lg transition-colors"
              >
                <Phone className="w-5 h-5 text-[#F2C94C]" />
                <span>{payment.phone}</span>
              </a>
              <div className="flex items-center gap-2 text-emerald-200 text-xs">
                <Mail className="w-4 h-4 text-[#F2C94C]" />
                <span>{siteSettings.email || "orders@bringmybite.in"}</span>
              </div>
              <div className="flex items-start gap-2 text-emerald-200 text-xs">
                <MapPin className="w-4 h-4 text-[#F2C94C] shrink-0 mt-0.5" />
                <span>{siteSettings.address || "Central Cloud Kitchen, Shree Foods Hub, Main IT & University Zone"}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Official Banking & UPI Verification Strip */}
        <div className="my-8 p-4 bg-emerald-950/70 rounded-2xl border border-emerald-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C88A24]/20 border border-[#C88A24]/40 flex items-center justify-center text-[#F2C94C] shrink-0 font-bold text-base">
              ₹
            </div>
            <div>
              <div className="text-white font-bold flex items-center gap-2">
                <span>Official {payment.bankName} Account: {payment.accountHolder}</span>
                <span className="bg-emerald-800 text-[#F2C94C] text-[10px] px-2 py-0.5 rounded font-mono">100% Prepaid</span>
              </div>
              <p className="text-emerald-300/80 text-[11px]">
                A/C: <span className="font-mono text-white">{payment.accountNumber}</span> • IFSC: <span className="font-mono text-white">{payment.ifscCode}</span> • Signatory: {payment.authorizedSignatory}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 block font-bold">Official UPI VPA</span>
              <span className="font-mono font-bold text-white text-xs bg-emerald-900/90 px-2.5 py-1 rounded-lg border border-emerald-700">
                {payment.upiId}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Hidden Portal Access for Admin / Manager / Chef */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {siteSettings.business_name || "Bring My Bite"} by {siteSettings.legal_name || "Shree Foods"}. All rights reserved.</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-300">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for good health.
            </span>
          </div>

          {/* Discreet Authorized Staff Access */}
          <div className="flex items-center gap-3 text-[11px] text-emerald-400/80">
            <button
              onClick={() => openStaffLogin('admin')}
              className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 hover:text-white px-3 py-1.5 rounded-lg border border-emerald-800 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#F2C94C]" />
              <span>Staff Portal Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
