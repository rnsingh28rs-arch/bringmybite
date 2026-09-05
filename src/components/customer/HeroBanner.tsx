import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FOOD_IMAGES } from '../../assets/foodImages';
import { useCms } from '../../cms/CmsContext';
import {
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Zap,
  CalendarCheck,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageSquare,
  Flame,
  CheckCircle2,
  Gift
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const cms = useCms();
  const {
    pricing,
    setIsRegistrationOpen,
    setSelectedPackageForRegistration,
    setIsInstantOrderOpen,
    setPreselectedThaliType,
    setIsWeeklyMenuOpen,
    activeBannerIndex,
    setActiveBannerIndex
  } = useApp();

  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const fallbackBanners = [
    {
      id: 'veg',
      tag: '100% PURE VEGETARIAN',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      title: 'The Veg Classic Package',
      highlightPrice: `₹${pricing.vegMonthly.toLocaleString()}`,
      period: '/ Month',
      thaliRate: `₹${pricing.vegThaliInstant} Instant Single Thali`,
      description:
        'Pure vegetarian homely meals crafted with fresh seasonal vegetables, daily changing dal tadka, jeera/steamed rice, 4 warm rotis & papad.',
      features: ['13 Meals / Week (Mon–Sun)', 'Lunch at Gate • Dinner at Home', '18–22g Balanced Protein', '100% Hygienic 5CP Trays'],
      packageKey: 'VEG CLASSIC' as const,
      thaliKey: 'veg' as const,
      badgeBg: 'from-emerald-800 to-emerald-950',
      accentColor: 'text-emerald-400',
      btnAccent: 'bg-[#124E33] hover:bg-[#0A2A1B] text-white',
      cardBorder: 'border-emerald-600/40',
      image: FOOD_IMAGES.vegThali,
      imageAlt: 'Pure Vegetarian Homely 5CP Thali with Dal Tadka, Paneer, Sabji, Basmati Rice and Rotis',
      dishHighlights: ['Dal Tadka / Makhani', 'Paneer Butter / Aloo Gobhi', 'Jeera Basmati Rice', '4 Warm Rotis + Papad']
    },
    {
      id: 'egg',
      tag: 'HIGH PROTEIN & TASTY',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
      title: 'The Egg Delight Package',
      highlightPrice: `₹${pricing.eggMonthly.toLocaleString()}`,
      period: '/ Month',
      thaliRate: `₹${pricing.eggThaliInstant} Instant Single Thali`,
      description:
        'Specially curated for active students & professionals needing high bioavailability protein with rich Egg Curries, Bhurji Gravies, Kadhi & Paneer.',
      features: ['13 Meals / Week with Egg Delicacies', '20–24g Natural Protein per meal', 'Freshly Boiled & Farm Grade Eggs', '4 Warm Rotis in Premium Foil'],
      packageKey: 'EGG DELIGHT' as const,
      thaliKey: 'egg' as const,
      badgeBg: 'from-amber-900 to-amber-950',
      accentColor: 'text-amber-400',
      btnAccent: 'bg-[#C88A24] hover:bg-[#A97116] text-white',
      cardBorder: 'border-amber-600/40',
      image: FOOD_IMAGES.eggThali,
      imageAlt: 'High Protein Egg Curry Thali with Farm Fresh Eggs, Dal, Jeera Rice and Rotis',
      dishHighlights: ['Egg Curry (2 Eggs)', 'Egg Bhurji / Kadhi', 'Steamed Basmati Rice', '4 Butter Rotis + Salad']
    },
    {
      id: 'non-veg',
      tag: 'WEEKLY CHICKEN SPECIAL',
      tagColor: 'bg-rose-100 text-rose-900 border-rose-300',
      title: 'The Non-Veg Club Package',
      highlightPrice: `₹${pricing.nonVegMonthly.toLocaleString()}`,
      period: '/ Month',
      thaliRate: `₹${pricing.nonVegThaliInstant} Instant Single Thali`,
      description:
        'Rich, aromatic home-style Chicken Curry (3 pcs) and Egg specialties paired with hearty dals, seasonal greens, aromatic rice and rotis.',
      features: ['Chicken Curry & Egg Masala Rotations', '25–30g Muscle-Building Protein', 'Sunday Feast Included', 'Strictly Fresh & Clean Poultry'],
      packageKey: 'NON-VEG CLUB' as const,
      thaliKey: 'non-veg' as const,
      badgeBg: 'from-rose-950 to-stone-950',
      accentColor: 'text-rose-400',
      btnAccent: 'bg-[#7A1C1C] hover:bg-[#5C1111] text-white',
      cardBorder: 'border-rose-700/40',
      image: FOOD_IMAGES.nonVegThali,
      imageAlt: 'Succulent Chicken Curry Thali with 3 Tender Chicken Pieces, Dal, Rice and Warm Rotis',
      dishHighlights: ['Chicken Curry (3 pcs)', 'Egg Curry on Rotation', 'Yellow Dal Tadka', 'Basmati Rice + 4 Rotis']
    },
    {
      id: 'instant',
      tag: 'FAST 45-MIN GATE DELIVERY',
      tagColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      title: 'Instant One-Time Thali Orders',
      highlightPrice: `From ₹${pricing.vegThaliInstant}`,
      period: '/ Single Thali',
      thaliRate: `Veg: ₹${pricing.vegThaliInstant} | Egg: ₹${pricing.eggThaliInstant} | Non-Veg: ₹${pricing.nonVegThaliInstant}`,
      description:
        'Need a fresh, steaming hot meal delivered right now? Order an instant 5-compartment thali directly to your college gate or office reception with zero monthly lock-in.',
      features: ['No Monthly Lock-in Required', '45–60 Minute Direct Gate Delivery', 'Served in 5CP Leak-proof Tray', 'Includes 4 Roti, Papad, Salad & Achar'],
      packageKey: 'VEG CLASSIC' as const,
      thaliKey: 'veg' as const,
      badgeBg: 'from-emerald-900 to-amber-950',
      accentColor: 'text-[#F2C94C]',
      btnAccent: 'bg-[#C88A24] hover:bg-[#A97116] text-white',
      cardBorder: 'border-[#C88A24]/40',
      image: FOOD_IMAGES.instantTiffin,
      imageAlt: 'Fresh Hot 5-Compartment Disposable Meal Tray Packed Ready for Fast Gate Delivery',
      dishHighlights: [`Veg Thali (₹${pricing.vegThaliInstant})`, `Egg Thali (₹${pricing.eggThaliInstant})`, `Non-Veg Thali (₹${pricing.nonVegThaliInstant})`, 'Steaming Hot Gate Drop']
    }
  ];

  const cmsBanners = cms.banners.filter((b) => b.active);
  const packagePrice = (key: 'VEG CLASSIC' | 'EGG DELIGHT' | 'NON-VEG CLUB') => key === 'VEG CLASSIC' ? pricing.vegMonthly : key === 'EGG DELIGHT' ? pricing.eggMonthly : pricing.nonVegMonthly;
  const thaliPrice = (key: 'veg' | 'egg' | 'non-veg') => key === 'veg' ? pricing.vegThaliInstant : key === 'egg' ? pricing.eggThaliInstant : pricing.nonVegThaliInstant;
  const banners = cmsBanners.length ? cmsBanners.map((b) => ({
    ...b,
    tagColor: b.tag_color, badgeBg: b.badge_bg, accentColor: b.accent_color, btnAccent: b.button_accent,
    cardBorder: b.card_border, image: b.image_url, imageAlt: b.image_alt,
    dishHighlights: b.id === 'instant' ? [`Veg Thali (₹${pricing.vegThaliInstant})`, `Egg Thali (₹${pricing.eggThaliInstant})`, `Non-Veg Thali (₹${pricing.nonVegThaliInstant})`, 'Steaming Hot Gate Drop'] : b.dish_highlights,
    highlightPrice: b.id === 'instant' ? `From ₹${pricing.vegThaliInstant}` : `₹${packagePrice(b.package_key)}`,
    thaliRate: b.id === 'instant' ? `Veg: ₹${pricing.vegThaliInstant} | Egg: ₹${pricing.eggThaliInstant} | Non-Veg: ₹${pricing.nonVegThaliInstant}` : `₹${thaliPrice(b.thali_key)} Instant Single Thali`,
    packageKey: b.package_key, thaliKey: b.thali_key
  })) : fallbackBanners;

  // Keep the selected slide valid if D-Admin removes/reorders banners.
  useEffect(() => {
    if (activeBannerIndex >= banners.length) setActiveBannerIndex(0);
  }, [activeBannerIndex, banners.length, setActiveBannerIndex]);

  // Auto switch banner every 6 seconds
  useEffect(() => {
    if (!isAutoPlay || banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlay, banners.length, setActiveBannerIndex]);

  const currentBanner = banners[Math.min(activeBannerIndex, banners.length - 1)] || fallbackBanners[0];

  const handleSubscribeClick = (pkgKey: typeof banners[0]['packageKey']) => {
    setSelectedPackageForRegistration(pkgKey);
    setIsRegistrationOpen(true);
  };

  const handleInstantOrderClick = (thaliKey: typeof banners[0]['thaliKey']) => {
    setPreselectedThaliType(thaliKey);
    setIsInstantOrderOpen(true);
  };

  const handleNextSlide = () => {
    setIsAutoPlay(false);
    setActiveBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrevSlide = () => {
    setIsAutoPlay(false);
    setActiveBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section id="hero" className="relative bg-[#FAF7F2] pt-3 pb-12 overflow-hidden border-b border-[#E8E1D5]">
      
      {/* 4 Banner Tabs Switcher + Carousel Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C88A24]" />
              <span>Explore Packages & Meals:</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Tab Selector */}
            <div className="flex items-center bg-[#EDE6D6] p-1 rounded-xl gap-1 border border-[#DDD3BF] overflow-x-auto max-w-full">
              {banners.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveBannerIndex(idx);
                    setIsAutoPlay(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeBannerIndex === idx
                      ? 'bg-[#124E33] text-white shadow-xs scale-102'
                      : 'text-gray-700 hover:text-black hover:bg-white/60'
                  }`}
                >
                  <span>
                    {b.id === 'veg' ? '🥗 Veg Classic' : b.id === 'egg' ? '🥚 Egg Delight' : b.id === 'non-veg' ? '🍗 Non-Veg Club' : '⚡ Instant Orders'}
                  </span>
                </button>
              ))}
            </div>

            {/* Prev / Next Slider Arrow Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-[#EDE6D6] p-1 rounded-xl border border-[#DDD3BF]">
              <button
                onClick={handlePrevSlide}
                aria-label="Previous Slide"
                className="p-1.5 rounded-lg hover:bg-white text-gray-700 hover:text-black transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextSlide}
                aria-label="Next Slide"
                className="p-1.5 rounded-lg hover:bg-white text-gray-700 hover:text-black transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Headline & Interactive Image Slider Banner Card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            
            {/* Top Eyebrow & Headline */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${currentBanner.tagColor}`}>
                  {currentBanner.tag}
                </span>
                <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  13 Meals / Week Plan • Mon–Sun
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0C3822] tracking-tight leading-[1.15] font-serif-title">
                Homely Food. <br />
                <span className="text-[#C88A24]">Delivered with Care.</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-700 font-medium">
                Premium hygienic tiffin service for <strong className="text-[#0C3822]">Students</strong> & <strong className="text-[#0C3822]">Working Professionals</strong>.
              </p>
            </div>

            {/* Current Active Banner Card with Integrated Food Imagery */}
            <div
              className="bg-white rounded-2xl border-2 border-[#E5DAC6] shadow-md overflow-hidden relative transition-all duration-300"
              onMouseEnter={() => setIsAutoPlay(false)}
            >
              {/* Card Photo Banner Header */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-gray-900 group">
                <img
                  src={currentBanner.image || FOOD_IMAGES.instantTiffin}
                  alt={currentBanner.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                {/* Left Floating Dish Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#F2C94C]" />
                    Freshly Prepared
                  </span>
                  <span className="bg-[#124E33]/90 text-emerald-100 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-400/40">
                    5-Compartment Tray
                  </span>
                </div>

                {/* Right Floating Slide Navigation on Image */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    onClick={handlePrevSlide}
                    className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Image Bottom Info Bar */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#F2C94C] font-bold">
                      {currentBanner.id === 'instant' ? 'Instant Thali Menu' : 'Monthly Subscription Plan'}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black font-serif-title text-white drop-shadow-sm">
                      {currentBanner.title}
                    </h3>
                  </div>

                  <div className="text-right bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/20">
                    <div className="text-[10px] text-gray-300 font-semibold">Package Price</div>
                    <div className="text-xl sm:text-2xl font-black text-[#F2C94C] leading-none">
                      {currentBanner.highlightPrice}
                    </div>
                    <div className="text-[10px] text-emerald-300 font-bold">{currentBanner.period}</div>
                  </div>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-5 space-y-3.5">
                
                {/* Description & Included Highlights */}
                <div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {currentBanner.description}
                  </p>

                  {/* Visual Dish Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Included:</span>
                    {(currentBanner.dishHighlights ?? []).map((dish, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold bg-[#FAF7F2] text-gray-800 px-2 py-0.5 rounded-md border border-[#E5DAC6]"
                      >
                        ✓ {dish}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4 Feature Checkmark Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs text-gray-700">
                  {currentBanner.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#124E33] shrink-0" />
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {currentBanner.id === 'instant' ? (
                    <button
                      onClick={() => handleInstantOrderClick('veg')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#C88A24] hover:bg-[#A97116] text-black font-extrabold px-5 py-3 rounded-xl text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                      <Zap className="w-4 h-4 fill-black" />
                      <span>Order Instant Single Thali (From ₹{pricing.vegThaliInstant})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribeClick(currentBanner.packageKey)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#124E33] hover:bg-[#0A2A1B] text-white font-bold px-5 py-3 rounded-xl text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                      <CalendarCheck className="w-4 h-4 text-[#F2C94C]" />
                      <span>Subscribe Monthly Plan ({currentBanner.highlightPrice})</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleInstantOrderClick(currentBanner.thaliKey)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#FDF7E7] hover:bg-[#F9EDCF] text-[#8C5E13] border-2 border-[#C88A24] font-bold px-4 py-3 rounded-xl text-sm shadow-xs transition-all active:scale-95"
                  >
                    <Zap className="w-4 h-4 text-[#C88A24] fill-[#C88A24]" />
                    <span>Instant Thali ({currentBanner.id === 'veg' ? `₹${pricing.vegThaliInstant}` : currentBanner.id === 'egg' ? `₹${pricing.eggThaliInstant}` : `₹${pricing.nonVegThaliInstant}`})</span>
                  </button>

                  <button
                    onClick={() => setIsWeeklyMenuOpen(true)}
                    className="w-full sm:w-auto text-xs font-bold text-gray-600 hover:text-[#124E33] underline px-2 py-1"
                  >
                    View 7-Day Menu →
                  </button>
                </div>

                {/* Slider Dot Indicators */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveBannerIndex(idx);
                        setIsAutoPlay(false);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        activeBannerIndex === idx
                          ? 'w-6 bg-[#124E33]'
                          : 'w-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

              </div>
            </div>

            {/* 3 Core Trust Badges below */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-700 pt-1">
              <div className="flex items-center gap-1.5 bg-emerald-50 text-[#124E33] px-3 py-1.5 rounded-lg border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-[#C88A24]" />
                <span>Fresh & Hygienic Cooking</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 text-[#124E33] px-3 py-1.5 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#124E33]" />
                <span>Balanced Nutrition</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 text-[#124E33] px-3 py-1.5 rounded-lg border border-emerald-200">
                <Clock className="w-3.5 h-3.5 text-[#124E33]" />
                <span>Punctual Gate Delivery</span>
              </div>
            </div>

          </div>

          {/* Right Column: 5CP Meal Visual Tray Photo + One-Time Instant Thali Ordering (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Visual Meal Tray Card with Real Thali Photo & 5CP Breakdown */}
            <div className="relative rounded-3xl bg-linear-to-b from-[#124E33] to-[#0A2A1B] p-5 text-white shadow-xl border-4 border-[#C88A24]/40 overflow-hidden">
              
              {/* Background Glow */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-[#D99B26]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative space-y-3.5">
                
                {/* Header of Tray Card */}
                <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#F2C94C]" />
                    <span className="text-xs font-bold tracking-wider uppercase text-emerald-200">
                      Standard 5CP Stainless Thali
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#C88A24] text-black font-extrabold px-2 py-0.5 rounded">
                    WARM & FRESH
                  </span>
                </div>

                {/* Interactive Thali Image Preview in Card */}
                <div className="relative rounded-2xl overflow-hidden h-36 sm:h-40 border border-emerald-700/80 group">
                  <img
                    src={currentBanner.image || FOOD_IMAGES.instantTiffin}
                    alt="5CP Tray Meal Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-[#F2C94C]">
                        {currentBanner.title} Live Preview
                      </span>
                      <span className="text-[11px] bg-emerald-900/90 text-white px-2 py-0.5 rounded border border-emerald-500">
                        100% Homestyle
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5-Compartment Layout Display */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {/* Compartment 1: Dal */}
                  <div className="bg-[#1B5E20]/80 p-2 rounded-xl border border-emerald-700/60 shadow-xs">
                    <span className="text-[9px] text-emerald-300 block font-semibold uppercase">DAL TADKA</span>
                    <span className="font-bold text-white text-[11px] leading-tight">Moong / Masoor</span>
                  </div>

                  {/* Compartment 2: Dry Sabji */}
                  <div className="bg-[#1B5E20]/80 p-2 rounded-xl border border-emerald-700/60 shadow-xs">
                    <span className="text-[9px] text-emerald-300 block font-semibold uppercase">DRY SABJI</span>
                    <span className="font-bold text-white text-[11px] leading-tight">Aloo Gobhi / Bhindi</span>
                  </div>

                  {/* Compartment 3: Main Gravy / Protein */}
                  <div className="bg-[#1B5E20]/80 p-2 rounded-xl border border-emerald-700/60 shadow-xs">
                    <span className="text-[9px] text-[#F2C94C] block font-semibold uppercase">MAIN DISH</span>
                    <span className="font-bold text-white text-[11px] leading-tight">
                      {activeBannerIndex === 0 ? 'Paneer Butter' : activeBannerIndex === 1 ? 'Egg Curry (2pcs)' : activeBannerIndex === 2 ? 'Chicken Curry (3pcs)' : 'Chef Choice'}
                    </span>
                  </div>

                  {/* Compartment 4: Rice (spans 2) */}
                  <div className="col-span-2 bg-[#1B5E20]/80 p-2 rounded-xl border border-emerald-700/60 shadow-xs flex items-center justify-between px-3">
                    <div className="text-left">
                      <span className="text-[9px] text-emerald-300 block font-semibold uppercase">BASMATI RICE</span>
                      <span className="font-bold text-white text-[11px]">Steamed / Jeera Rice</span>
                    </div>
                    <span className="text-base">🍚</span>
                  </div>

                  {/* Compartment 5: Extras */}
                  <div className="bg-[#1B5E20]/80 p-2 rounded-xl border border-emerald-700/60 shadow-xs">
                    <span className="text-[9px] text-emerald-300 block font-semibold uppercase">EXTRAS</span>
                    <span className="font-bold text-white text-[11px]">Salad & Achar</span>
                  </div>
                </div>

                {/* Foil Packed Roti Badge */}
                <div className="bg-[#C88A24]/20 border border-[#C88A24]/60 p-2 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🫓</span>
                    <div>
                      <span className="font-bold text-[#F2C94C] block text-xs">4 Warm Rotis + 1 Papad</span>
                      <span className="text-[10px] text-emerald-200">Wrapped in Premium Aluminum Foil</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-bold">
                    FOIL SEALED
                  </span>
                </div>

              </div>
            </div>

            {/* ONE-TIME THALI ORDERS Floating Action Card with Food Previews */}
            <div className="bg-[#0D3823] text-white rounded-2xl p-4 sm:p-5 border-2 border-[#C88A24] shadow-xl space-y-3" id="one-time-thali-box">
              
              <div className="flex items-center justify-between border-b border-emerald-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#C88A24] text-black flex items-center justify-center">
                    <Flame className="w-4 h-4 fill-black" />
                  </div>
                  <span className="font-extrabold text-sm sm:text-base tracking-wide text-[#F2C94C] uppercase font-serif-title">
                    One-Time Thali Orders
                  </span>
                </div>
                <span className="text-[10px] bg-[#C88A24] text-black font-extrabold px-2 py-0.5 rounded">
                  45 MIN GATE DROP
                </span>
              </div>

              {/* 3 Thali Price Rows with Instant Order Trigger Buttons & Images */}
              <div className="space-y-2 text-sm font-semibold">
                
                {/* Veg Thali Item */}
                <div
                  onClick={() => handleInstantOrderClick('veg')}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#124E33]/80 hover:bg-[#124E33] border border-emerald-700/80 cursor-pointer transition-all hover:scale-[1.01] group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={FOOD_IMAGES.vegThali}
                      alt="Veg Thali"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover border border-emerald-600"
                    />
                    <div>
                      <span className="text-emerald-300 font-bold block text-xs sm:text-sm">🌿 Pure Veg Thali</span>
                      <span className="text-[10px] text-gray-300 font-normal">Dal, 2 Sabjis, Rice, 4 Roti</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base sm:text-lg font-black text-[#F2C94C]">₹{pricing.vegThaliInstant}</span>
                    <span className="text-xs bg-[#C88A24] text-black font-bold px-2.5 py-1 rounded-lg group-hover:bg-[#E5AC39] transition-colors">
                      Order →
                    </span>
                  </div>
                </div>

                {/* Egg Thali Item */}
                <div
                  onClick={() => handleInstantOrderClick('egg')}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#124E33]/80 hover:bg-[#124E33] border border-emerald-700/80 cursor-pointer transition-all hover:scale-[1.01] group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={FOOD_IMAGES.eggThali}
                      alt="Egg Thali"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover border border-emerald-600"
                    />
                    <div>
                      <span className="text-amber-300 font-bold block text-xs sm:text-sm">🥚 Egg Delight Thali</span>
                      <span className="text-[10px] text-gray-300 font-normal">Egg Curry (2pcs), Dal, Rice, 4 Roti</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base sm:text-lg font-black text-[#F2C94C]">₹{pricing.eggThaliInstant}</span>
                    <span className="text-xs bg-[#C88A24] text-black font-bold px-2.5 py-1 rounded-lg group-hover:bg-[#E5AC39] transition-colors">
                      Order →
                    </span>
                  </div>
                </div>

                {/* Non-Veg Thali Item */}
                <div
                  onClick={() => handleInstantOrderClick('non-veg')}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#124E33]/80 hover:bg-[#124E33] border border-emerald-700/80 cursor-pointer transition-all hover:scale-[1.01] group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={FOOD_IMAGES.nonVegThali}
                      alt="Chicken Thali"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover border border-emerald-600"
                    />
                    <div>
                      <span className="text-rose-300 font-bold block text-xs sm:text-sm">🍗 Chicken Curry Thali</span>
                      <span className="text-[10px] text-gray-300 font-normal">Chicken Curry (3pcs), Dal, Rice, 4 Roti</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base sm:text-lg font-black text-[#F2C94C]">₹{pricing.nonVegThaliInstant}</span>
                    <span className="text-xs bg-[#C88A24] text-black font-bold px-2.5 py-1 rounded-lg group-hover:bg-[#E5AC39] transition-colors">
                      Order →
                    </span>
                  </div>
                </div>

              </div>

              {/* Direct Help & WhatsApp Hotline */}
              <div className="pt-2 border-t border-emerald-800 flex items-center justify-between text-xs font-bold">
                <a
                  href="tel:9315075165"
                  className="flex items-center gap-1.5 text-white hover:text-[#F2C94C] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F2C94C]" />
                  <span>Call: 9315075165</span>
                </a>
                <a
                  href="https://wa.me/919315075165?text=Hi,%20I%20want%20to%20order%20an%20instant%20thali"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[#86efac] hover:text-white transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Order</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
