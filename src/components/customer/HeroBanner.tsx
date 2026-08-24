import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FOOD_IMAGES, resolveFoodImage } from '../../assets/foodImages';

export const HeroBanner: React.FC = () => {
  const { openRegistrationModal, openInstantOrderModal } = useApp();
  const [activeSlide, setActiveSlide] = useState<'veg' | 'egg' | 'chicken'>('chicken');

  const slideData = {
    veg: {
      badge: 'WEEKLY VEG SPECIAL',
      title: 'The Veg Classic Package',
      price: '3,700',
      singlePrice: '90',
      desc: 'Daily fresh homestyle pure vegetarian meals with rich dal tadka, seasonal greens, aromatic rice and soft phulkas[cite: 1].',
      bullets: ['Fresh Dal & Seasonal Sabzi[cite: 1]', '4 Soft Tawa Butter Rotis[cite: 1]', 'Steamed Basmati Rice[cite: 1]', 'Hygienic Homestyle Cooking[cite: 1]'],
      dishName: 'Paneer / Mix Veg Special[cite: 1]',
      img: FOOD_IMAGES.vegClassic,
    },
    egg: {
      badge: 'HIGH PROTEIN ACTIVE',
      title: 'The Egg Delight Package',
      price: '4,000',
      singlePrice: '100',
      desc: 'Wholesome vegetarian diet daily with high-protein double egg curry feast served on Wednesday & Friday cycles[cite: 1].',
      bullets: ['Double Egg Curry (Wed & Fri)', '20-24g Muscle-Building Protein', 'Matar Pulao on Feast Days[cite: 1]', '4 Warm Butter Rotis[cite: 1]'],
      dishName: 'Double Egg Curry Special[cite: 1]',
      img: FOOD_IMAGES.eggDelight,
    },
    chicken: {
      badge: 'WEEKLY CHICKEN SPECIAL',
      title: 'The Non-Veg Club Package',
      price: '4,500',
      singlePrice: '120',
      desc: 'Rich, aromatic home-style Chicken Curry (3 pcs) and Egg specialties paired with hearty dal, seasonal greens and rotis[cite: 1].',
      bullets: ['Chicken Curry & Egg Masala Rotations[cite: 1]', '25-30g Muscle-Building Protein', 'Sunday Feast Included[cite: 1]', 'Strictly Fresh & Clean Poultry[cite: 1]'],
      dishName: 'Chicken Curry (3pcs)[cite: 1]',
      img: FOOD_IMAGES.chickenCurry,
    },
  };

  const current = slideData[activeSlide];

  return (
    <section className="relative pt-3 pb-8 px-4 sm:px-6 max-w-7xl mx-auto font-sans">
      
      {/* Top Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#FAF7F2] p-2 rounded-2xl border border-stone-200">
        <span className="text-xs font-black tracking-wider text-[#1A2E22] uppercase">⚡ Explore Packages & Meals:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSlide('veg')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSlide === 'veg' ? 'bg-emerald-800 text-white shadow-md' : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
            }`}
          >
            🌱 Veg Classic
          </button>
          <button
            type="button"
            onClick={() => setActiveSlide('egg')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSlide === 'egg' ? 'bg-amber-600 text-white shadow-md' : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
            }`}
          >
            🍳 Egg Delight
          </button>
          <button
            type="button"
            onClick={() => setActiveSlide('chicken')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSlide === 'chicken' ? 'bg-emerald-900 text-white shadow-md' : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
            }`}
          >
            🍗 Non-Veg Club
          </button>
          <button
            type="button"
            onClick={() => openInstantOrderModal('🌱 Pure Veg Standard Thali')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow cursor-pointer"
          >
            ⚡ Instant Orders
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: HERO TITLE & DYNAMIC PACKAGE SLIDE */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-black tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              FAST 45-MIN GATE DELIVERY • 13 Meals / Week Plan • Mon–Sun[cite: 1]
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-[#1A2E22] tracking-tight leading-[1.05] font-serif">
              Homely Food. <br />
              <span className="text-amber-600 italic font-normal">Delivered with Care.</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Premium hygienic tiffin service for <strong className="text-slate-900">Students & Working Professionals</strong>[cite: 1].
            </p>
          </div>

          {/* Active Package Slide Card */}
          <div className="bg-[#111A14] text-[#FAF7F2] rounded-3xl p-6 border border-emerald-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#243B2D] pb-3">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">{current.badge}</span>
                <h3 className="text-xl font-black text-white">{current.title}</h3>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold border border-emerald-500/30">
                ₹{current.price} / Month
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{current.desc}</p>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              {current.bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-emerald-400 text-xs">✔</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => openRegistrationModal(current.title)}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg transition text-xs cursor-pointer"
              >
                📅 Subscribe Monthly Plan (₹{current.price})
              </button>
              <button
                type="button"
                onClick={() => openInstantOrderModal(current.title)}
                className="py-3 px-5 bg-[#1A2C21] hover:bg-[#253d2e] border border-amber-500/40 text-amber-300 font-black rounded-2xl transition text-xs cursor-pointer"
              >
                ⚡ Instant Thali (₹{current.singlePrice})
              </button>
            </div>
          </div>

          {/* 3 Bottom Quality Badges */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200/80 font-bold text-emerald-900">
              🌿 Fresh & Hygienic Cooking
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200/80 font-bold text-emerald-900">
              ⚖️ Balanced Nutrition
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200/80 font-bold text-emerald-900">
              ⏱️ Punctual Gate Delivery
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 5CP STAINLESS TRAY PREVIEW + ONE-TIME THALI ORDERS BOX */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 5CP Stainless Tray Preview Card */}
          <div className="bg-[#132018] rounded-3xl p-5 border border-emerald-500/40 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#22382B] pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🍱</span>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">STANDARD 5CP STAINLESS THALI</h3>
              </div>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                WARM & FRESH
              </span>
            </div>

            {/* Direct Image Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-black/50 aspect-[16/10] shadow-inner">
              <img
                src={current.img || FOOD_IMAGES.instantTiffin}
                alt="5CP Tray Meal Preview"
                className="w-full h-full object-cover transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="font-bold text-amber-300 text-[11px]">{current.title} Live Preview</span>
                <span className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[9px]">
                  100% Homestyle
                </span>
              </div>
            </div>

            {/* 5 Compartments Grid */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
              <div className="bg-[#1A2C21] p-1.5 rounded-xl border border-[#2B4736]">
                <span className="text-[9px] text-slate-400 block font-bold">DAL TADKA</span>
                <span className="text-emerald-300 font-black text-[10px]">Moong / Masoor</span>
              </div>
              <div className="bg-[#1A2C21] p-1.5 rounded-xl border border-[#2B4736]">
                <span className="text-[9px] text-slate-400 block font-bold">DRY SABZI</span>
                <span className="text-amber-300 font-black text-[10px]">Aloo Gobhi / Bhindi[cite: 1]</span>
              </div>
              <div className="bg-[#1A2C21] p-1.5 rounded-xl border border-[#2B4736]">
                <span className="text-[9px] text-slate-400 block font-bold">MAIN DISH</span>
                <span className="text-white font-black text-[10px] truncate block">{current.dishName}</span>
              </div>
              <div className="bg-[#1A2C21] p-1.5 rounded-xl border border-[#2B4736] col-span-2">
                <span className="text-[9px] text-slate-400 block font-bold">BASMATI RICE</span>
                <span className="text-emerald-300 font-black text-[10px]">Steamed / Jeera Rice 🍚</span>
              </div>
              <div className="bg-[#1A2C21] p-1.5 rounded-xl border border-[#2B4736]">
                <span className="text-[9px] text-slate-400 block font-bold">EXTRAS</span>
                <span className="text-white font-black text-[10px]">Salad & Achar</span>
              </div>
            </div>

            <div className="bg-[#1A2C21] p-2.5 rounded-xl border border-amber-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span>🫓</span>
                <span className="text-white font-black text-[11px]">4 Warm Rotis + 1 Papad</span>
              </div>
              <span className="text-[9px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                FOIL SEALED
              </span>
            </div>
          </div>

          {/* ONE-TIME THALI ORDERS LIST CARD */}
          <div className="bg-[#132018] rounded-3xl p-5 border border-amber-500/40 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#22382B] pb-2">
              <div className="flex items-center gap-1.5">
                <span>⚡</span>
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">ONE-TIME THALI ORDERS</h3>
              </div>
              <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                45 MIN GATE DROP
              </span>
            </div>

            <div className="space-y-2">
              {/* Veg Thali Item */}
              <div className="bg-[#1A2C21] p-2.5 rounded-2xl border border-[#2B4736] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 shrink-0">
                    <img src={FOOD_IMAGES.vegClassic} alt="Veg Thali" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">🌱 Pure Veg Thali</h4>
                    <p className="text-[9px] text-slate-400">Dal, 2 Sabjis, Rice, 4 Roti[cite: 1]</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white font-mono">₹90</span>
                  <button
                    type="button"
                    onClick={() => openInstantOrderModal('🌱 Pure Veg Standard Thali')}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] rounded-lg shadow cursor-pointer"
                  >
                    Order ➔
                  </button>
                </div>
              </div>

              {/* Egg Delight Item */}
              <div className="bg-[#1A2C21] p-2.5 rounded-2xl border border-[#2B4736] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 shrink-0">
                    <img src={FOOD_IMAGES.eggDelight} alt="Egg Delight" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">🍳 Egg Delight Thali</h4>
                    <p className="text-[9px] text-slate-400">Egg Curry (2pcs), Dal, Rice, 4 Roti[cite: 1]</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white font-mono">₹100</span>
                  <button
                    type="button"
                    onClick={() => openInstantOrderModal('🍳 Egg Delight Thali')}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] rounded-lg shadow cursor-pointer"
                  >
                    Order ➔
                  </button>
                </div>
              </div>

              {/* Chicken Curry Item */}
              <div className="bg-[#1A2C21] p-2.5 rounded-2xl border border-[#2B4736] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 shrink-0">
                    <img src={FOOD_IMAGES.chickenCurry} alt="Chicken Curry" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">🍗 Chicken Curry Thali</h4>
                    <p className="text-[9px] text-slate-400">Chicken Curry (3pcs), Dal, Rice, 4 Roti[cite: 1]</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white font-mono">₹120</span>
                  <button
                    type="button"
                    onClick={() => openInstantOrderModal('🍗 Desi Chicken Curry Thali')}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] rounded-lg shadow cursor-pointer"
                  >
                    Order ➔
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Contact Bar */}
            <div className="pt-2 border-t border-[#243B2D] flex items-center justify-between text-[11px]">
              <a href="tel:9315075165" className="text-slate-300 font-bold hover:text-white flex items-center gap-1">
                <span>📞</span> +91 9315075165
              </a>
              <a
                href="https://wa.me/919315075165?text=Namaste%20Bring%20My%20Bite!%20Mujhe%20Thali%20order%20karni%20hai."
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>💬</span> WhatsApp Order
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
