import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { FOOD_IMAGES } from '../../assets/foodImages';

export const HeroBanner: React.FC = () => {
  const { openRegistration, openInstantOrder } = useAppContext();

  return (
    <section className="relative pt-6 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: BRAND PROMISE & PACKAGES */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-black tracking-wide uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              ⚡ Fast 45-Min Gate Delivery • Knowledge Park & Noida
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-[#1A2E22] tracking-tight leading-[1.08] font-serif">
              Homely Food. <br />
              <span className="text-emerald-700 italic font-normal">Delivered with Care.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed max-w-xl">
              Fresh, hygienic, pure homestyle thalis cooked twice daily for Students & Working Professionals in Greater Noida. Zero maida, zero soda, pure ghar ka swad.
            </p>
          </div>

          {/* Core Monthly Packages Card Box */}
          <div className="bg-[#132018] text-[#FAF7F2] rounded-3xl p-6 border border-emerald-500/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#22382B] pb-3">
              <div>
                <span className="text-xs uppercase font-black tracking-widest text-amber-400">🏷️ MONTHLY SAVINGS PACKAGES</span>
                <h3 className="text-xl font-black text-white">Subscribe & Save ₹1,800+ / Mo</h3>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold border border-emerald-500/30">
                13 Meals / Week
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#1A2C21] p-3.5 rounded-2xl border border-[#2B4736] space-y-1">
                <span className="text-xs text-emerald-300 font-bold">🌱 Veg Classic</span>
                <div className="text-xl font-black text-white font-mono">₹3,700<span className="text-xs font-normal text-slate-400">/mo</span></div>
                <p className="text-[10px] text-slate-400">4 Rotis, Dal, Sabzi, Rice & Salad</p>
              </div>

              <div className="bg-[#1A2C21] p-3.5 rounded-2xl border border-amber-500/40 space-y-1 relative">
                <span className="absolute -top-2.5 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                  Popular
                </span>
                <span className="text-xs text-amber-300 font-bold">🍳 Egg Delight</span>
                <div className="text-xl font-black text-white font-mono">₹4,000<span className="text-xs font-normal text-slate-400">/mo</span></div>
                <p className="text-[10px] text-slate-400">Veg + Egg Curry Wed & Fri</p>
              </div>

              <div className="bg-[#1A2C21] p-3.5 rounded-2xl border border-[#2B4736] space-y-1">
                <span className="text-xs text-rose-300 font-bold">🍗 Non-Veg Club</span>
                <div className="text-xl font-black text-white font-mono">₹4,500<span className="text-xs font-normal text-slate-400">/mo</span></div>
                <p className="text-[10px] text-slate-400">Desi Chicken Curry Twice Weekly</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => openRegistration('Veg Classic Plan')}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-2xl shadow-lg transition text-sm cursor-pointer"
              >
                📅 Subscribe Monthly Plan
              </button>
              <button
                type="button"
                onClick={() => openInstantOrder('🌱 Pure Veg Standard Thali')}
                className="py-3.5 px-6 bg-[#1A2C21] hover:bg-[#253d2e] border border-amber-500/40 text-amber-300 font-black rounded-2xl transition text-sm cursor-pointer"
              >
                ⚡ Order 1-Time Thali (₹90)
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 5CP STAINLESS TRAY PREVIEW BOX */}
        <div className="lg:col-span-5 bg-[#132018] rounded-3xl p-5 border border-emerald-500/40 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#22382B] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍱</span>
              <h3 className="text-sm font-black text-white tracking-wide uppercase">Standard 5CP Stainless Thali</h3>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
              Warm & Fresh
            </span>
          </div>

          {/* Photo Frame */}
          <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-black/40 aspect-[4/3] group shadow-inner">
            <img
              src={FOOD_IMAGES.instantTiffin}
              alt="5CP Tray Homestyle Meal Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <span className="font-bold text-amber-300">Instant One-Time Thali Live Preview</span>
              <span className="bg-emerald-500/90 text-slate-950 font-black px-2 py-0.5 rounded-md text-[10px]">
                100% Homestyle
              </span>
            </div>
          </div>

          {/* 5 Compartment Grid Spec */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#1A2C21] p-2 rounded-xl border border-[#2B4736]">
              <span className="text-[10px] text-slate-400 block font-bold">DAL TADKA</span>
              <span className="text-emerald-300 font-black text-[11px]">Moong / Masoor</span>
            </div>
            <div className="bg-[#1A2C21] p-2 rounded-xl border border-[#2B4736]">
              <span className="text-[10px] text-slate-400 block font-bold">DRY SABZI</span>
              <span className="text-amber-300 font-black text-[11px]">Aloo Gobhi / Bhindi</span>
            </div>
            <div className="bg-[#1A2C21] p-2 rounded-xl border border-[#2B4736]">
              <span className="text-[10px] text-slate-400 block font-bold">MAIN DISH</span>
              <span className="text-white font-black text-[11px]">Chef Choice</span>
            </div>
            <div className="bg-[#1A2C21] p-2 rounded-xl border border-[#2B4736] col-span-2">
              <span className="text-[10px] text-slate-400 block font-bold">BASMATI RICE</span>
              <span className="text-emerald-300 font-black text-[11px]">Steamed / Jeera Rice 🍚</span>
            </div>
            <div className="bg-[#1A2C21] p-2 rounded-xl border border-[#2B4736]">
              <span className="text-[10px] text-slate-400 block font-bold">EXTRAS</span>
              <span className="text-white font-black text-[11px]">Salad & Achar</span>
            </div>
          </div>

          {/* Roti Banner & Quick Order Trigger */}
          <div className="bg-[#1A2C21] p-3 rounded-2xl border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🫓</span>
              <div>
                <span className="text-xs font-black text-white block">4 Warm Rotis + 1 Papad</span>
                <span className="text-[10px] text-slate-400">Wrapped in Premium Aluminum Foil</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openInstantOrder('🌱 Pure Veg Standard Thali')}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer"
            >
              Order (₹90)
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
