import React from 'react';
import { useApp } from '../../context/AppContext';
import { FOOD_IMAGES } from '../../assets/foodImages';

export const PackagesSection: React.FC = () => {
  const { openRegistrationModal, openInstantOrderModal } = useApp();

  const packages = [
    {
      id: 'veg-classic',
      name: 'The Veg Classic Package',
      tag: '🌱 100% PURE VEGETARIAN',
      price: '3,700',
      singlePrice: '90',
      image: FOOD_IMAGES.vegClassic,
      description: 'Daily fresh homestyle pure vegetarian meals with rotating seasonal vegetables, rich dal tadka & soft phulkas[cite: 1].',
      features: ['4 Butter Tawa Rotis[cite: 1]', 'Dal Tadka / Dal Fry[cite: 1]', 'Seasonal Dry / Gravy Sabzi', 'Steamed Basmati Rice[cite: 1]', 'Fresh Salad & Pickle[cite: 1]'],
      btnColor: 'from-emerald-600 to-emerald-500',
    },
    {
      id: 'egg-delight',
      name: 'The Egg Delight Package',
      tag: '🍳 HIGH PROTEIN FITNESS',
      price: '4,000',
      singlePrice: '100',
      image: FOOD_IMAGES.eggDelight,
      description: 'Pure vegetarian diet on regular days with double egg curry feast served on Wednesday & Friday dinner cycles[cite: 1].',
      features: ['Veg Thali on Normal Days', 'Double Egg Curry (Wed & Fri)', 'Pulao / Jeera Rice on Feast Days[cite: 1]', '4 Soft Butter Rotis[cite: 1]', 'Raita & Salad Included[cite: 1]'],
      btnColor: 'from-amber-600 to-amber-500',
      isPopular: true,
    },
    {
      id: 'nonveg-club',
      name: 'The Non-Veg Club Package',
      tag: '🍗 ROYAL DESI CHICKEN',
      price: '4,500',
      singlePrice: '120',
      image: FOOD_IMAGES.chickenCurry,
      description: 'Homestyle slow-cooked Desi Chicken Curry / Korma twice a week with full vegetarian meals on other days[cite: 1].',
      features: ['Desi Chicken Curry (Wed & Fri)[cite: 1]', 'Veg Classic on Remaining Days[cite: 1]', 'Matar Pulao / Biryani Rice[cite: 1]', '4 Tawa Butter Rotis[cite: 1]', 'Weekly Dessert / Sweet Dish[cite: 1]'],
      btnColor: 'from-rose-600 to-rose-500',
    },
  ];

  return (
    <section id="packages" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs uppercase font-black tracking-widest text-emerald-700">🍛 Monthly Subscriptions</span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1A2E22] font-serif">Choose Your Daily Food Plan</h2>
        <p className="text-slate-600 text-sm">Flexible 30-day plans with lunch & dinner delivery directly at your gate[cite: 1].</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-[#132018] text-[#FAF7F2] rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-xl ${
              pkg.isPopular ? 'border-amber-500/80 ring-2 ring-amber-500/40' : 'border-emerald-500/30'
            }`}
          >
            <div>
              {/* Photo Header */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#132018] via-transparent to-black/30" />
                <span className="absolute top-3 left-3 bg-[#132018]/90 text-amber-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-amber-500/30">
                  {pkg.tag}
                </span>
                {pkg.isPopular && (
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                    Most Popular ⭐
                  </span>
                )}
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white">{pkg.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{pkg.description}</p>
                </div>

                <div className="bg-[#1A2C21] p-3.5 rounded-2xl border border-[#2B4736] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Monthly Plan</span>
                    <span className="text-2xl font-black text-white font-mono">₹{pkg.price}</span>
                    <span className="text-[10px] text-slate-400">/mo</span>
                  </div>
                  <div className="text-right border-l border-[#2B4736] pl-3">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Single Thali</span>
                    <span className="text-lg font-black text-amber-300 font-mono">₹{pkg.singlePrice}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Package Highlights:</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-400 text-xs">✔</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 space-y-2">
              <button
                type="button"
                onClick={() => openRegistrationModal(pkg.name)}
                className={`w-full py-3 bg-gradient-to-r ${pkg.btnColor} hover:brightness-110 text-slate-950 font-black rounded-xl text-xs shadow-lg transition cursor-pointer`}
              >
                Subscribe {pkg.name.split(' ')[1]} (₹{pkg.price})
              </button>
              <button
                type="button"
                onClick={() => openInstantOrderModal(pkg.name)}
                className="w-full py-2 bg-[#1A2C21] hover:bg-[#233b2c] text-slate-300 hover:text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                ⚡ Order 1 Thali (₹{pkg.singlePrice})
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
