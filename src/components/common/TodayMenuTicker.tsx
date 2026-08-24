import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Utensils, Zap, Clock, ChevronRight } from 'lucide-react';

export const TodayMenuTicker: React.FC = () => {
  const { setIsWeeklyMenuOpen, setIsInstantOrderOpen } = useApp();

  return (
    <div className="bg-[#0A2E1C] text-white border-b border-emerald-900/60 overflow-hidden relative shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center">
        
        {/* Static Badge Label */}
        <div className="bg-[#C88A24] text-black px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-black shrink-0 tracking-wider uppercase z-10 shadow-md">
          <Utensils className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">TODAY'S SPECIAL MENU</span>
          <span className="sm:hidden">TODAY'S MENU</span>
        </div>

        {/* Marquee Running Strip */}
        <div className="overflow-hidden whitespace-nowrap py-1.5 text-xs font-medium text-emerald-100 flex-1 relative flex items-center group cursor-pointer"
             onClick={() => setIsWeeklyMenuOpen(true)}
             title="Click to view complete 7-Day Weekly Menu Schedule">
          <div className="inline-block animate-marquee group-hover:[animation-play-state:paused] flex items-center gap-6 pl-4">
            
            <span className="flex items-center gap-2">
              <span className="bg-emerald-800 text-[#F2C94C] text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">Lunch (12:30 - 2 PM)</span>
              <strong className="text-white">Paneer Butter Masala</strong> • Yellow Dal Tadka • 4 Ghee Phulkas • Steamed Jeera Rice • Hot Gulab Jamun • Fresh Salad
            </span>

            <span className="text-[#C88A24] font-black">•</span>

            <span className="flex items-center gap-2">
              <span className="bg-amber-900 text-amber-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">Egg & Non-Veg Today</span>
              <strong className="text-white">Egg Curry (2 Eggs) / Kolkata Chicken Curry (3 Pcs)</strong> • Dal Fry • Steamed Rice
            </span>

            <span className="text-[#C88A24] font-black">•</span>

            <span className="flex items-center gap-2">
              <span className="bg-emerald-800 text-[#F2C94C] text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">Dinner (7:30 - 9:30 PM)</span>
              <strong className="text-white">Matar Mushroom / Dal Makhani</strong> • 4 Soft Rotis • Basmati Rice • Mixed Pickle
            </span>

            <span className="text-[#C88A24] font-black">•</span>

            <span className="flex items-center gap-1.5 text-[#F2C94C] font-bold">
              <Zap className="w-3 h-3 fill-[#F2C94C]" />
              <span>⚡ 45-Min Gate Drop to Heritage, IEM, Techno, Amity, Sector V & Anandapur!</span>
            </span>

            <span className="text-[#C88A24] font-black">•</span>

            <span className="text-emerald-300">
              Freshly cooked in olive/mustard blend • Sealed 5CP Microwave-Safe Trays • 100% Homely & Hygienic
            </span>

            <span className="text-[#C88A24] font-black">•</span>
          </div>

          {/* Duplicated for seamless loop */}
          <div className="inline-block animate-marquee group-hover:[animation-play-state:paused] flex items-center gap-6 pl-4" aria-hidden="true">
            <span className="flex items-center gap-2">
              <span className="bg-emerald-800 text-[#F2C94C] text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">Lunch (12:30 - 2 PM)</span>
              <strong className="text-white">Paneer Butter Masala</strong> • Yellow Dal Tadka • 4 Ghee Phulkas • Steamed Jeera Rice • Hot Gulab Jamun • Fresh Salad
            </span>

            <span className="text-[#C88A24] font-black">•</span>

            <span className="flex items-center gap-2">
              <span className="bg-amber-900 text-amber-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">Egg & Non-Veg Today</span>
              <strong className="text-white">Egg Curry (2 Eggs) / Kolkata Chicken Curry (3 Pcs)</strong> • Dal Fry • Steamed Rice
            </span>

            <span className="text-[#C88A24] font-black">•</span>

            <span className="flex items-center gap-2">
              <span className="bg-emerald-800 text-[#F2C94C] text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">Dinner (7:30 - 9:30 PM)</span>
              <strong className="text-white">Matar Mushroom / Dal Makhani</strong> • 4 Soft Rotis • Basmati Rice • Mixed Pickle
            </span>

            <span className="text-[#C88A24] font-black">•</span>

            <span className="flex items-center gap-1.5 text-[#F2C94C] font-bold">
              <Zap className="w-3 h-3 fill-[#F2C94C]" />
              <span>⚡ 45-Min Gate Drop to Heritage, IEM, Techno, Amity, Sector V & Anandapur!</span>
            </span>

            <span className="text-[#C88A24] font-black">•</span>

            <span className="text-emerald-300">
              Freshly cooked in olive/mustard blend • Sealed 5CP Microwave-Safe Trays • 100% Homely & Hygienic
            </span>

            <span className="text-[#C88A24] font-black">•</span>
          </div>
        </div>

        {/* View Full Menu CTA button */}
        <button
          onClick={() => setIsWeeklyMenuOpen(true)}
          className="hidden md:flex items-center gap-1 bg-[#124E33] hover:bg-[#1B6946] text-[#F2C94C] text-[11px] font-bold px-3 py-1.5 shrink-0 border-l border-emerald-800 transition-colors"
        >
          <span>View 7-Day Menu</span>
          <ChevronRight className="w-3 h-3" />
        </button>

      </div>
    </div>
  );
};
