import React from 'react';
import { useApp } from '../../context/AppContext';
import { PackageType, DayMealItem } from '../../types';
import { NUTRITION_DATA } from '../../data/initialData';
import { X, Calendar, Heart, Check } from 'lucide-react';

const mealEntries = (meal: DayMealItem | null) => {
  if (!meal) return [] as Array<[string, string]>;
  return ([
    ['Dal', meal.dal],
    ['Bhujia / Sabzi', meal.dryVeg],
    ['Main Dish', meal.gravyOrNonVeg],
    ['Rice', meal.rice],
    ['Roti', meal.foilPacked],
    ['Sides', meal.extras]
  ] as Array<[string, string]>).filter(([, value]) => String(value || '').trim());
};

export const WeeklyMenuModal: React.FC = () => {
  const { isWeeklyMenuOpen, setIsWeeklyMenuOpen, selectedMenuTab, setSelectedMenuTab, vegMenu, eggMenu, nonVegMenu, pricing, setIsRegistrationOpen, setSelectedPackageForRegistration } = useApp();
  if (!isWeeklyMenuOpen) return null;

  const currentMenu = selectedMenuTab === 'VEG CLASSIC' ? vegMenu : selectedMenuTab === 'EGG DELIGHT' ? eggMenu : nonVegMenu;
  const packagePrice = selectedMenuTab === 'VEG CLASSIC' ? pricing.vegMonthly : selectedMenuTab === 'EGG DELIGHT' ? pricing.eggMonthly : pricing.nonVegMonthly;
  const nutrition = NUTRITION_DATA[selectedMenuTab];
  const dinnerOnly = selectedMenuTab !== 'VEG CLASSIC';
  const handleSubscribeThis = () => { setSelectedPackageForRegistration(selectedMenuTab); setIsWeeklyMenuOpen(false); setIsRegistrationOpen(true); };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="bg-[#124E33] text-white p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#D99B26] text-black flex items-center justify-center font-bold"><Calendar className="w-5 h-5" /></div><div><h2 className="text-xl font-bold font-serif-title">Weekly Menu</h2><p className="text-xs text-emerald-200">{dinnerOnly ? 'Dinner menu • Monday to Saturday' : 'Lunch & Dinner • Monday to Saturday • Sunday Lunch'}</p></div></div>
          <button onClick={() => setIsWeeklyMenuOpen(false)} className="p-2 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="bg-[#EDE6D6] p-3 border-b border-[#DACFBC] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {(['VEG CLASSIC', 'EGG DELIGHT', 'NON-VEG CLUB'] as PackageType[]).map((tab) => {
              const price = tab === 'VEG CLASSIC' ? pricing.vegMonthly : tab === 'EGG DELIGHT' ? pricing.eggMonthly : pricing.nonVegMonthly;
              return <button key={tab} onClick={() => setSelectedMenuTab(tab)} className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${selectedMenuTab === tab ? 'bg-[#124E33] text-white shadow-md' : 'bg-white/80 text-gray-700 hover:bg-white'}`}><span>{tab === 'VEG CLASSIC' ? '🥗 Veg Classic' : tab === 'EGG DELIGHT' ? '🥚 Egg Delight' : '🍗 Non-Veg Club'}</span><span className="text-[11px] opacity-80">(₹{Number(price || 0).toLocaleString('en-IN')})</span></button>;
            })}
          </div>
          <button onClick={handleSubscribeThis} className="bg-[#C88A24] hover:bg-[#A97116] text-black text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors">Subscribe to {selectedMenuTab} →</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF7F2]">
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-900 flex items-center gap-2"><span className="font-semibold">Fresh menu from central CMS.</span><span className="text-emerald-700">All available meal components are shown without empty columns.</span></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentMenu.map((schedule) => {
              const meals = dinnerOnly ? [['Dinner', schedule.dinner, '🌙'] as const] : [['Lunch', schedule.lunch, '☀️'] as const, ['Dinner', schedule.dinner, '🌙'] as const];
              return meals.map(([label, meal, icon]) => {
                const entries = mealEntries(meal);
                if (!entries.length) return null;
                return <article key={`${schedule.day}-${label}`} className="rounded-2xl border border-[#E5DAC6] bg-white shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between bg-[#0C3822] text-white px-4 py-3"><div className="font-extrabold text-sm">{schedule.day}</div><div className="text-xs font-bold text-[#F2C94C]">{icon} {label}</div></div>
                  <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">{entries.map(([name,value]) => <div key={name} className="rounded-xl bg-[#FAF7F2] border border-gray-100 px-3 py-2"><div className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400">{name}</div><div className="mt-0.5 text-xs font-bold text-gray-800">{value}</div></div>)}</div>
                </article>;
              });
            })}
          </div>

          {nutrition && <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-3"><div className="flex items-center justify-between pb-2 border-b border-gray-100"><div className="flex items-center gap-2 text-[#124E33] font-bold text-sm font-serif-title"><Heart className="w-4 h-4 text-rose-500 fill-rose-500" /><span>Balanced Nutrition ({selectedMenuTab})</span></div><span className="text-[10px] text-gray-500">Monthly plan ₹{Number(packagePrice || 0).toLocaleString('en-IN')}</span></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs"><div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200"><span className="font-bold text-emerald-900 block text-[11px]">PROTEIN</span><span className="text-gray-700">{nutrition.protein}</span></div><div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200"><span className="font-bold text-emerald-900 block text-[11px]">CALCIUM</span><span className="text-gray-700">{nutrition.calcium}</span></div><div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200"><span className="font-bold text-emerald-900 block text-[11px]">IRON</span><span className="text-gray-700">{nutrition.iron}</span></div><div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200"><span className="font-bold text-emerald-900 block text-[11px]">FIBER</span><span className="text-gray-700">{nutrition.fiber}</span></div><div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200"><span className="font-bold text-emerald-900 block text-[11px]">VITAMIN A</span><span className="text-gray-700">{nutrition.vitA}</span></div><div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200"><span className="font-bold text-emerald-900 block text-[11px]">VITAMIN D</span><span className="text-gray-700">{nutrition.vitD}</span></div>{nutrition.vitB12 && <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200"><span className="font-bold text-emerald-900 block text-[11px]">VITAMIN B12</span><span className="text-gray-700">{nutrition.vitB12}</span></div>}<div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200"><span className="font-bold text-emerald-900 block text-[11px]">GOOD FATS</span><span className="text-gray-700">{nutrition.goodFats}</span></div></div></div>}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3"><div className="text-xs text-gray-500">Menu is controlled centrally through CMS.</div><div className="flex items-center gap-3"><button onClick={() => setIsWeeklyMenuOpen(false)} className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black">Close</button><button onClick={handleSubscribeThis} className="px-5 py-2.5 bg-[#124E33] hover:bg-[#0A2A1B] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"><Check className="w-4 h-4 text-[#F2C94C]" /><span>Register for {selectedMenuTab}</span></button></div></div>
      </div>
    </div>
  );
};
