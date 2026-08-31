import React from 'react';
import { useApp } from '../../context/AppContext';
import { Utensils, Zap, ChevronRight, Gift, MapPin, Clock } from 'lucide-react';

export const TodayMenuTicker: React.FC = () => {
  const { setIsWeeklyMenuOpen } = useApp();

  return (
    <>
      <div className="bg-[#F2C94C] text-[#0A2E1C] overflow-hidden border-b-2 border-[#0A2E1C]/20 shadow-sm">
        <div className="max-w-7xl mx-auto min-h-[42px] flex items-center overflow-hidden">
          <div className="shrink-0 bg-[#0A2E1C] text-[#F2C94C] px-3 py-2 text-[10px] sm:text-xs font-black tracking-widest uppercase flex items-center gap-1.5 z-10 shadow-md">
            <MapPin className="w-3.5 h-3.5" /><span>Greater Noida Only</span>
          </div>
          <div className="overflow-hidden flex-1 whitespace-nowrap min-w-0">
            <div className="inline-flex items-center gap-5 pl-5 pr-5 animate-marquee font-black text-xs sm:text-sm uppercase tracking-wide">
              <span>BOOK YOUR SLOT ASAP</span><span className="opacity-50">•</span>
              <span className="inline-flex items-center gap-2"><Gift className="w-4 h-4 shrink-0" />FIRST 200 SUBSCRIBERS GET AN EXCLUSIVE GIFT</span><span className="opacity-50">•</span>
              <span>DELIVERY STARTS SEPTEMBER 1</span><span className="opacity-50">•</span><span>GREATER NOIDA ONLY</span><span className="opacity-50">•</span>
              <span>BOOK YOUR SLOT ASAP</span><span className="opacity-50">•</span>
              <span className="inline-flex items-center gap-2"><Gift className="w-4 h-4 shrink-0" />FIRST 200 SUBSCRIBERS GET AN EXCLUSIVE GIFT</span><span className="opacity-50">•</span>
              <span>DELIVERY STARTS SEPTEMBER 1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0A2E1C] border-b border-emerald-900/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-2 sm:px-0 py-1.5 sm:py-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
            <div className="flex items-stretch gap-1.5 w-full sm:w-auto">
              <button onClick={() => setIsWeeklyMenuOpen(true)} className="flex-1 sm:flex-none bg-[#C88A24] text-black px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-black tracking-wide uppercase shadow-md active:scale-[0.98] transition-transform">
                <Utensils className="w-3.5 h-3.5" /><span>Today's Menu</span><ChevronRight className="w-3 h-3" />
              </button>
              <div className="flex-1 sm:flex-none bg-[#124E33] text-white border border-emerald-700/70 rounded-lg px-2.5 py-2 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-black whitespace-nowrap">
                <Clock className="w-3.5 h-3.5 text-[#F2C94C]" /><span>Lunch <b className="text-[#F2C94C]">12:30–2:00 PM</b></span>
              </div>
              <div className="flex-1 sm:flex-none bg-[#124E33] text-white border border-emerald-700/70 rounded-lg px-2.5 py-2 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-black whitespace-nowrap">
                <Clock className="w-3.5 h-3.5 text-[#F2C94C]" /><span>Dinner <b className="text-[#F2C94C]">7:30–9:30 PM</b></span>
              </div>
            </div>
            <div className="hidden sm:flex overflow-hidden whitespace-nowrap py-1 text-xs font-medium text-emerald-100 flex-1 relative items-center group cursor-pointer min-w-0" onClick={() => setIsWeeklyMenuOpen(true)} title="Click to view complete 7-Day Weekly Menu Schedule">
              <div className="inline-flex animate-marquee group-hover:[animation-play-state:paused] items-center gap-6 pl-4">
                <span><strong className="text-white">Lunch:</strong> Paneer Butter Masala • Yellow Dal Tadka • 4 Ghee Phulkas • Steamed Jeera Rice • Hot Gulab Jamun • Fresh Salad</span>
                <span className="text-[#C88A24] font-black">•</span>
                <span><strong className="text-white">Egg & Non-Veg:</strong> Egg Curry (2 Eggs) / Kolkata Chicken Curry (3 Pcs) • Dal Fry • Steamed Rice</span>
                <span className="text-[#C88A24] font-black">•</span>
                <span><strong className="text-white">Dinner:</strong> Matar Mushroom / Dal Makhani • 4 Soft Rotis • Basmati Rice • Mixed Pickle</span>
                <span className="text-[#C88A24] font-black">•</span>
                <span className="text-[#F2C94C] font-bold"><Zap className="w-3 h-3 inline fill-[#F2C94C]" /> 45-Min Gate Drop • Freshly Cooked • Hygienic</span>
              </div>
            </div>
            <button onClick={() => setIsWeeklyMenuOpen(true)} className="hidden md:flex items-center gap-1 bg-[#124E33] hover:bg-[#1B6946] text-[#F2C94C] text-[11px] font-bold px-3 py-2 shrink-0 border border-emerald-800 rounded-lg transition-colors"><span>View 7-Day Menu</span><ChevronRight className="w-3 h-3" /></button>
          </div>
        </div>
      </div>
    </>
  );
};
