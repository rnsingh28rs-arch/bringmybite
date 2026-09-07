import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Briefcase,
  Home,
  UtensilsCrossed,
  Sparkles,
  ShieldCheck,
  PackageCheck,
  Scale,
  Clock,
  Coins,
  ArrowRight,
  HeartHandshake
} from 'lucide-react';

export const LowerFeaturesGrid: React.FC = () => {
  const {
    setIsWeeklyMenuOpen,
    setIsInstantOrderOpen
  } = useApp();

  return (
    <section className="py-14 bg-[#FAF7F2] border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 3-Card Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: OUR DELIVERY MODEL */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5DAC6] shadow-sm flex flex-col justify-between" id="delivery-model">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-500 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#124E33]" />
                <span>Our Delivery Model</span>
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                  <div className="w-9 h-9 rounded-xl bg-[#124E33] text-white flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">College Students</h4>
                    <p className="text-xs text-gray-600">Lunch delivered punctually right to your <strong>College Front Gate</strong>.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <div className="w-9 h-9 rounded-xl bg-[#0C3822] text-white flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Working Professionals</h4>
                    <p className="text-xs text-gray-600">Lunch delivered to your <strong>Office Gate / Reception</strong>.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
                  <div className="w-9 h-9 rounded-xl bg-[#C88A24] text-white flex items-center justify-center shrink-0">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Dinner Delivery</h4>
                    <p className="text-xs text-gray-600">Delivered to your <strong>Registered Home Address</strong>.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
              *Sunday service: Lunch delivered at gate/home; Sunday night kitchen closed.
            </div>
          </div>

          {/* Card 2: WHY CHOOSE BRING MY BITE? */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5DAC6] shadow-sm flex flex-col justify-between" id="why-us">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-500 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#124E33]" />
                <span>Why Choose Bring My Bite?</span>
              </h3>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-gray-200/80 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#124E33] flex items-center justify-center mb-1.5"><UtensilsCrossed className="w-4 h-4" /></div>
                  <span className="text-[11px] font-bold text-gray-800 leading-tight">Homely Taste</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-gray-200/80 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#124E33] flex items-center justify-center mb-1.5"><ShieldCheck className="w-4 h-4" /></div>
                  <span className="text-[11px] font-bold text-gray-800 leading-tight">Hygienic Kitchen</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-gray-200/80 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#124E33] flex items-center justify-center mb-1.5"><PackageCheck className="w-4 h-4" /></div>
                  <span className="text-[11px] font-bold text-gray-800 leading-tight">Premium 5CP</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-gray-200/80 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-[#C88A24] flex items-center justify-center mb-1.5"><Scale className="w-4 h-4" /></div>
                  <span className="text-[11px] font-bold text-gray-800 leading-tight">Nutrition Balanced</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-gray-200/80 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-[#C88A24] flex items-center justify-center mb-1.5"><Clock className="w-4 h-4" /></div>
                  <span className="text-[11px] font-bold text-gray-800 leading-tight">Timely Delivery</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-gray-200/80 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-[#C88A24] flex items-center justify-center mb-1.5"><Coins className="w-4 h-4" /></div>
                  <span className="text-[11px] font-bold text-gray-800 leading-tight">Affordable Plans</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-emerald-900/5 rounded-2xl border border-emerald-800/15 text-xs italic text-gray-700">
                “We don't just deliver food, we deliver care, trust, and the comfort of home.”
                <span className="block text-[10px] font-bold not-italic text-emerald-900 mt-1">— Shree Foods</span>
              </div>
            </div>

            <div className="text-[11px] text-emerald-800 font-bold mt-2 text-center">Ghar jaisa swaad, har din ke saath! ✨</div>
          </div>

          {/* Card 3: TODAY'S MENU */}
          <div className="bg-[#0D3823] text-white rounded-3xl p-6 border-2 border-emerald-700 shadow-xl flex flex-col justify-between" id="today-menu">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F2C94C]" />
                  <h3 className="font-bold text-base text-[#F2C94C] font-serif-title uppercase tracking-wider">Today's Live Menu</h3>
                </div>
                <span className="text-[10px] bg-[#124E33] border border-emerald-600 px-2 py-0.5 rounded text-emerald-200 font-bold">Fresh Batch</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                <div className="space-y-1.5 bg-[#124E33]/70 p-3 rounded-2xl border border-emerald-800">
                  <span className="font-extrabold text-[#F2C94C] block uppercase tracking-wider text-[11px]">☀️ LUNCH</span>
                  <ul className="space-y-1 text-emerald-100 text-[11px]"><li>• Dal Tadka / Masoor</li><li>• Aloo Gobhi Fry</li><li>• Jeera Basmati Rice</li><li>• 4 Warm Rotis</li><li>• Salad & Achar</li></ul>
                </div>
                <div className="space-y-1.5 bg-[#124E33]/70 p-3 rounded-2xl border border-emerald-800">
                  <span className="font-extrabold text-[#F2C94C] block uppercase tracking-wider text-[11px]">🌙 DINNER</span>
                  <ul className="space-y-1 text-emerald-100 text-[11px]"><li>• Paneer / Egg / Chicken</li><li>• Chana Dal Gravy</li><li>• Steamed Rice</li><li>• 4 Warm Rotis</li><li>• Papad & Achar</li></ul>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-800 flex items-center gap-2">
              <button onClick={() => setIsWeeklyMenuOpen(true)} className="flex-1 py-2.5 px-3 bg-[#C88A24] hover:bg-[#A97116] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs">
                <span>View Full 7-Day Menu</span><ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setIsInstantOrderOpen(true)} className="py-2.5 px-3 bg-[#124E33] hover:bg-[#1B5E20] text-emerald-200 hover:text-white font-bold text-xs rounded-xl border border-emerald-600 transition-colors">Order</button>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Statistics Banner */}
        <div className="bg-[#0A2A1B] text-white rounded-3xl p-6 border border-emerald-900 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
            <div className="space-y-1"><div className="text-2xl sm:text-3xl font-black text-[#F2C94C]">500+</div><div className="text-xs text-emerald-300 font-medium">Happy Customers</div></div>
            <div className="space-y-1"><div className="text-2xl sm:text-3xl font-black text-[#F2C94C]">99%</div><div className="text-xs text-emerald-300 font-medium">On-Time Delivery</div></div>
            <div className="space-y-1"><div className="text-2xl sm:text-3xl font-black text-[#F2C94C]">30+</div><div className="text-xs text-emerald-300 font-medium">Daily Menu Items</div></div>
            <div className="space-y-1"><div className="text-2xl sm:text-3xl font-black text-[#F2C94C]">100%</div><div className="text-xs text-emerald-300 font-medium">Hygienic & Safe</div></div>
            <div className="col-span-2 sm:col-span-1 space-y-1"><div className="text-2xl sm:text-3xl font-black text-[#F2C94C]">0%</div><div className="text-xs text-emerald-300 font-medium">Compromise on Taste</div></div>
          </div>
        </div>
      </div>
    </section>
  );
};
