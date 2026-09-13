import React, { useEffect, useState } from 'react';
import { ArrowRight, CalendarCheck, ChevronLeft, ChevronRight, Clock3, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PackageType, MealPreference } from '../../types';
import { getSubscriptionPlanOptions } from '../../utils/subscriptionPlans.js';

const SLIDES: Array<{ slot: MealPreference; title: string; subtitle: string; badge: string; icon: React.ReactNode }> = [
  { slot: 'Lunch Only', title: 'Lunch Subscription — ₹2,099/month', subtitle: 'Veg Classic Thali • Lunch only • Simple monthly plan', badge: 'LUNCH PLAN', icon: <Sun className="w-5 h-5" /> },
  { slot: 'Dinner Only', title: 'Dinner Subscription — From ₹2,099/month', subtitle: 'Veg Classic ₹2,099 • Egg Delight ₹2,399 • Non-Veg Club ₹2,699', badge: 'DINNER PLAN', icon: <Moon className="w-5 h-5" /> },
  { slot: 'Dinner Only', title: 'Choose Your Dinner Thali', subtitle: 'Veg Classic • Egg Delight • Non-Veg Club — delivered on subscription', badge: 'NEW SUBSCRIPTION OPTION', icon: <Clock3 className="w-5 h-5" /> }
];

export const SubscriptionPlanPromoBanner: React.FC = () => {
  const { setIsRegistrationOpen, setSelectedPackageForRegistration } = useApp();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  const subscribe = (slot: MealPreference) => {
    const first = getSubscriptionPlanOptions(slot)[0];
    setSelectedPackageForRegistration((first?.packageType || 'VEG CLASSIC') as PackageType);
    setIsRegistrationOpen(true);
  };

  return (
    <section aria-label="Lunch and dinner subscription advertisement" className="px-3 sm:px-6 lg:px-8 py-3 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto relative overflow-hidden rounded-2xl border-2 border-[#C88A24]/50 bg-gradient-to-r from-[#0C3822] via-[#124E33] to-[#1B5E20] text-white shadow-lg">
        <div className="flex items-center gap-4 px-4 py-4 sm:px-6 sm:py-5">
          <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C88A24] text-black">{slide.icon}</div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-[#F2C94C]">{slide.badge}</div>
            <div className="mt-0.5 text-base sm:text-xl font-black truncate">{slide.title}</div>
            <div className="mt-1 text-[10px] sm:text-xs text-emerald-100 truncate">{slide.subtitle}</div>
          </div>
          <button onClick={() => subscribe(slide.slot)} className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#F2C94C] px-3 sm:px-4 py-2.5 text-[10px] sm:text-xs font-black text-[#3D2A05] shadow hover:bg-[#FFD866]">
            <CalendarCheck className="w-3.5 h-3.5" /> Subscribe <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <div className="hidden sm:flex items-center gap-1">
            <button aria-label="Previous subscription ad" onClick={() => setIndex((index - 1 + SLIDES.length) % SLIDES.length)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><ChevronLeft className="w-4 h-4" /></button>
            <button aria-label="Next subscription ad" onClick={() => setIndex((index + 1) % SLIDES.length)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex h-0.5">{SLIDES.map((_, i) => <span key={i} className={`flex-1 ${i === index ? 'bg-[#F2C94C]' : 'bg-white/15'}`} />)}</div>
      </div>
    </section>
  );
};
