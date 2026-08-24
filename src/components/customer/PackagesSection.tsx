import React from 'react';
import { useApp } from '../../context/AppContext';
import { PackageType } from '../../types';
import { FOOD_IMAGES } from '../../assets/foodImages';
import {
  Leaf,
  Egg,
  Utensils,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Eye,
  CalendarCheck,
  Zap,
  Sparkles,
  Flame,
  Award
} from 'lucide-react';

export const PackagesSection: React.FC = () => {
  const {
    pricing,
    setIsRegistrationOpen,
    setSelectedPackageForRegistration,
    setIsWeeklyMenuOpen,
    setSelectedMenuTab,
    setIsInstantOrderOpen,
    setPreselectedThaliType
  } = useApp();

  const handleSubscribe = (pkg: PackageType) => {
    setSelectedPackageForRegistration(pkg);
    setIsRegistrationOpen(true);
  };

  const handleViewMenu = (pkg: PackageType) => {
    setSelectedMenuTab(pkg);
    setIsWeeklyMenuOpen(true);
  };

  const handleInstant = (type: 'veg' | 'egg' | 'non-veg') => {
    setPreselectedThaliType(type);
    setIsInstantOrderOpen(true);
  };

  return (
    <section id="packages" className="py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Leaf flourishes matching Mockup */}
        <div className="text-center space-y-2 mb-12">
          <div className="flex items-center justify-center gap-2 text-emerald-800">
            <Leaf className="w-5 h-5 text-[#124E33]" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C3822] font-serif-title">
              Our Subscription Packages
            </h2>
            <Leaf className="w-5 h-5 text-[#124E33] scale-x-[-1]" />
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-medium">
            Choose the perfect plan for your daily nutrition • 13 wholesome meals every week • Zero hidden charges
          </p>
        </div>

        {/* 3 Bento Cards Grid with Food Images */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: VEG CLASSIC */}
          <div className="bg-white rounded-3xl border-2 border-emerald-600/30 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              {/* Header Visual Banner with Image */}
              <div className="relative h-44 w-full overflow-hidden bg-emerald-950">
                <img
                  src={FOOD_IMAGES.vegThali}
                  alt="Pure Veg Classic Thali Meal"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* Badge on Top Left */}
                <div className="absolute top-3 left-3">
                  <span className="bg-emerald-600/90 text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-400 flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    100% Vegetarian
                  </span>
                </div>

                {/* Price on Top Right */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs px-3 py-1 rounded-xl border border-white/20 text-right">
                  <span className="text-lg font-black text-[#F2C94C] leading-none block">
                    ₹{pricing.vegMonthly.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-gray-300 font-bold">/ month</span>
                </div>

                {/* Bottom Title */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-bold font-serif-title text-white flex items-center gap-2">
                    VEG CLASSIC
                  </h3>
                  <p className="text-[11px] text-emerald-200 line-clamp-1">
                    Dal Tadka, Seasonal Sabji, Jeera Rice & 4 Rotis
                  </p>
                </div>
              </div>

              {/* Instant Single Thali Fast Action Bar */}
              <div className="p-3.5 bg-emerald-50/70 border-b border-gray-100 flex items-center justify-between text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-base">🥗</span>
                  <div>
                    <span className="font-bold text-[#124E33]">5CP Pure Veg Platter</span>
                    <span className="text-[10px] text-gray-500 block">18–22g Balanced Protein</span>
                  </div>
                </div>
                <button
                  onClick={() => handleInstant('veg')}
                  className="text-[11px] font-extrabold bg-[#FDF7E7] hover:bg-[#F9EDCF] text-[#8C5E13] border border-[#C88A24] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-[#C88A24] fill-[#C88A24]" />
                  <span>₹{pricing.vegThaliInstant} Instant</span>
                </button>
              </div>

              {/* Package Bullets */}
              <div className="p-6 space-y-3.5">
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>13 meals every week</strong> (Mon–Sat: Lunch & Dinner | Sun: Lunch)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>College Gate / Office Gate</strong> lunch delivery included</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Dinner delivered</strong> directly to your home address</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>18–22g Protein</strong> with Dal Makhani, Paneer, Chole & Rajma</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Sunday night kitchen closed for deep sanitization</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 space-y-2.5">
              <button
                onClick={() => handleSubscribe('VEG CLASSIC')}
                className="w-full py-3 px-4 bg-[#124E33] hover:bg-[#0A2A1B] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <CalendarCheck className="w-4 h-4 text-[#F2C94C]" />
                <span>Subscribe Veg Classic (₹{pricing.vegMonthly.toLocaleString()})</span>
              </button>

              <button
                onClick={() => handleViewMenu('VEG CLASSIC')}
                className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                <span>View Full 7-Day Veg Menu</span>
              </button>
            </div>
          </div>

          {/* Card 2: EGG DELIGHT (Popular Badge) */}
          <div className="bg-white rounded-3xl border-2 border-amber-600/40 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative group scale-[1.02] lg:-translate-y-2">
            
            {/* Best Value Ribbon */}
            <div className="absolute top-0 right-12 z-10">
              <span className="bg-[#C88A24] text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-b-lg shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                MOST POPULAR
              </span>
            </div>

            <div>
              {/* Header Visual Banner with Image */}
              <div className="relative h-44 w-full overflow-hidden bg-amber-950">
                <img
                  src={FOOD_IMAGES.eggThali}
                  alt="Egg Delight Protein Thali Meal"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* Badge on Top Left */}
                <div className="absolute top-3 left-3">
                  <span className="bg-amber-600/90 text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-amber-400 flex items-center gap-1">
                    <Egg className="w-3 h-3" />
                    High Protein
                  </span>
                </div>

                {/* Price on Top Right */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs px-3 py-1 rounded-xl border border-white/20 text-right">
                  <span className="text-lg font-black text-[#F2C94C] leading-none block">
                    ₹{pricing.eggMonthly.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-gray-300 font-bold">/ month</span>
                </div>

                {/* Bottom Title */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-bold font-serif-title text-white flex items-center gap-2">
                    EGG DELIGHT
                  </h3>
                  <p className="text-[11px] text-amber-200 line-clamp-1">
                    Egg Curry (2 Eggs), Egg Bhurji, Kadhi & Rotis
                  </p>
                </div>
              </div>

              {/* Instant Single Thali Fast Action Bar */}
              <div className="p-3.5 bg-amber-50/70 border-b border-gray-100 flex items-center justify-between text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-base">🥚</span>
                  <div>
                    <span className="font-bold text-[#8C5E13]">5CP Egg Protein Platter</span>
                    <span className="text-[10px] text-gray-500 block">20–24g High Bioavailability Protein</span>
                  </div>
                </div>
                <button
                  onClick={() => handleInstant('egg')}
                  className="text-[11px] font-extrabold bg-[#FDF7E7] hover:bg-[#F9EDCF] text-[#8C5E13] border border-[#C88A24] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-[#C88A24] fill-[#C88A24]" />
                  <span>₹{pricing.eggThaliInstant} Instant</span>
                </button>
              </div>

              {/* Package Bullets */}
              <div className="p-6 space-y-3.5">
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C88A24] shrink-0 mt-0.5" />
                    <span><strong>13 meals with Egg Delicacies</strong> curated for active fitness</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C88A24] shrink-0 mt-0.5" />
                    <span><strong>Egg Curry (2 Eggs)</strong> or Egg Bhurji rotated regularly</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C88A24] shrink-0 mt-0.5" />
                    <span><strong>20–24g Natural Protein</strong> per serving for sustained energy</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C88A24] shrink-0 mt-0.5" />
                    <span><strong>College Gate / Office Gate</strong> + Dinner at Home</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C88A24] shrink-0 mt-0.5" />
                    <span>Farm fresh, grade-A sanitized eggs cooked in pure desi spices</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 space-y-2.5">
              <button
                onClick={() => handleSubscribe('EGG DELIGHT')}
                className="w-full py-3 px-4 bg-[#C88A24] hover:bg-[#A97116] text-black font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Subscribe Egg Delight (₹{pricing.eggMonthly.toLocaleString()})</span>
              </button>

              <button
                onClick={() => handleViewMenu('EGG DELIGHT')}
                className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#C88A24]" />
                <span>View Full 7-Day Egg Menu</span>
              </button>
            </div>
          </div>

          {/* Card 3: NON-VEG CLUB */}
          <div className="bg-white rounded-3xl border-2 border-rose-700/30 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              {/* Header Visual Banner with Image */}
              <div className="relative h-44 w-full overflow-hidden bg-rose-950">
                <img
                  src={FOOD_IMAGES.nonVegThali}
                  alt="Chicken Curry Non-Veg Club Thali Meal"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* Badge on Top Left */}
                <div className="absolute top-3 left-3">
                  <span className="bg-rose-700/90 text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-rose-400 flex items-center gap-1">
                    <Utensils className="w-3 h-3" />
                    Chicken Feast
                  </span>
                </div>

                {/* Price on Top Right */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs px-3 py-1 rounded-xl border border-white/20 text-right">
                  <span className="text-lg font-black text-[#F2C94C] leading-none block">
                    ₹{pricing.nonVegMonthly.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-gray-300 font-bold">/ month</span>
                </div>

                {/* Bottom Title */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-bold font-serif-title text-white flex items-center gap-2">
                    NON-VEG CLUB
                  </h3>
                  <p className="text-[11px] text-rose-200 line-clamp-1">
                    Chicken Curry (3 pcs), Egg Masala, Dal & Rotis
                  </p>
                </div>
              </div>

              {/* Instant Single Thali Fast Action Bar */}
              <div className="p-3.5 bg-rose-50/70 border-b border-gray-100 flex items-center justify-between text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-base">🍗</span>
                  <div>
                    <span className="font-bold text-[#7A1C1C]">5CP Non-Veg Feast Platter</span>
                    <span className="text-[10px] text-gray-500 block">25–30g Premium Muscle Building Protein</span>
                  </div>
                </div>
                <button
                  onClick={() => handleInstant('non-veg')}
                  className="text-[11px] font-extrabold bg-[#FDF7E7] hover:bg-[#F9EDCF] text-[#8C5E13] border border-[#C88A24] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-[#C88A24] fill-[#C88A24]" />
                  <span>₹{pricing.nonVegThaliInstant} Instant</span>
                </button>
              </div>

              {/* Package Bullets */}
              <div className="p-6 space-y-3.5">
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <span><strong>Rich Chicken Curry (3 tender pcs)</strong> cooked in aromatic gravy</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <span><strong>Egg Curry & Masala variations</strong> on designated days</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <span><strong>25–30g High Protein</strong> per meal for maximum nourishment</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <span><strong>Special Sunday Feast</strong> included in your monthly subscription</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <span>Strictly fresh poultry, hygienically trimmed and slow-simmered</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 space-y-2.5">
              <button
                onClick={() => handleSubscribe('NON-VEG CLUB')}
                className="w-full py-3 px-4 bg-[#7A1C1C] hover:bg-[#5C1111] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <CalendarCheck className="w-4 h-4 text-[#F2C94C]" />
                <span>Subscribe Non-Veg Club (₹{pricing.nonVegMonthly.toLocaleString()})</span>
              </button>

              <button
                onClick={() => handleViewMenu('NON-VEG CLUB')}
                className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-rose-700" />
                <span>View Full 7-Day Non-Veg Menu</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
