import React from 'react';
import { useApp } from '../../context/AppContext';
import { PackageType } from '../../types';
import { NUTRITION_DATA } from '../../data/initialData';
import { X, Calendar, Utensils, ShieldCheck, Heart, Download, Check } from 'lucide-react';

export const WeeklyMenuModal: React.FC = () => {
  const {
    isWeeklyMenuOpen,
    setIsWeeklyMenuOpen,
    selectedMenuTab,
    setSelectedMenuTab,
    vegMenu,
    eggMenu,
    nonVegMenu,
    setIsRegistrationOpen,
    setSelectedPackageForRegistration
  } = useApp();

  if (!isWeeklyMenuOpen) return null;

  const currentMenu =
    selectedMenuTab === 'VEG CLASSIC'
      ? vegMenu
      : selectedMenuTab === 'EGG DELIGHT'
      ? eggMenu
      : nonVegMenu;

  const nutrition = NUTRITION_DATA[selectedMenuTab];

  const handleSubscribeThis = () => {
    setSelectedPackageForRegistration(selectedMenuTab);
    setIsWeeklyMenuOpen(false);
    setIsRegistrationOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#124E33] text-white p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D99B26] text-black flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif-title flex items-center gap-2">
                Weekly Rotational Menu Schedule
              </h2>
              <p className="text-xs text-emerald-200">
                13 Meals a Week • Monday to Saturday (Lunch & Dinner) | Sunday (Lunch Only)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWeeklyMenuOpen(false)}
            className="p-2 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3 Package Selection Tabs */}
        <div className="bg-[#EDE6D6] p-3 border-b border-[#DACFBC] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {(['VEG CLASSIC', 'EGG DELIGHT', 'NON-VEG CLUB'] as PackageType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedMenuTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  selectedMenuTab === tab
                    ? 'bg-[#124E33] text-white shadow-md'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <span>{tab === 'VEG CLASSIC' ? '🥗 Veg Classic' : tab === 'EGG DELIGHT' ? '🥚 Egg Delight' : '🍗 Non-Veg Club'}</span>
                <span className="text-[11px] opacity-80">
                  ({tab === 'VEG CLASSIC' ? '₹3,500' : tab === 'EGG DELIGHT' ? '₹4,000' : '₹4,500'})
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleSubscribeThis}
            className="bg-[#C88A24] hover:bg-[#A97116] text-black text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            Subscribe to {selectedMenuTab} →
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FAF7F2]">
          
          {/* Packaging & Service Rules Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-900 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>Packaging Standard:</strong> 5-Compartment (5CP) tray with Rice, Dal, Dry Veg, Gravy/Egg/Chicken, Salad & Achar + 4 Rotis & Papad warm in foil.</span>
            </div>
            <span className="text-[11px] bg-emerald-800 text-white px-2 py-0.5 rounded font-bold">
              Sunday Night Kitchen Closed
            </span>
          </div>

          {/* 7-Day Menu Schedule Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#0C3822] text-white text-[11px] uppercase tracking-wider font-bold">
                  <th className="p-3 border-r border-emerald-900 w-24">Day</th>
                  <th className="p-3 border-r border-emerald-900 w-20">Meal</th>
                  <th className="p-3 border-r border-emerald-900">Dal (Tadka)</th>
                  <th className="p-3 border-r border-emerald-900">Dry Veg (Sabji 1)</th>
                  <th className="p-3 border-r border-emerald-900">Main Gravy / Non-Veg</th>
                  <th className="p-3 border-r border-emerald-900">Rice</th>
                  <th className="p-3 border-r border-emerald-900">Foil Packed</th>
                  <th className="p-3">Extras (In Plate)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium text-gray-800">
                {currentMenu.map((schedule, idx) => (
                  <React.Fragment key={schedule.day}>
                    
                    {/* Lunch Row */}
                    <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]/60'}>
                      <td
                        rowSpan={schedule.dinner ? 2 : 1}
                        className="p-3 font-extrabold text-[#124E33] border-r border-gray-200 align-top bg-emerald-50/40"
                      >
                        {schedule.day}
                      </td>
                      <td className="p-2.5 font-bold text-amber-800 border-r border-gray-200 bg-amber-50/30">
                        ☀️ Lunch
                      </td>
                      <td className="p-2.5 border-r border-gray-200">{schedule.lunch.dal}</td>
                      <td className="p-2.5 border-r border-gray-200">{schedule.lunch.dryVeg}</td>
                      <td className="p-2.5 border-r border-gray-200 font-bold text-[#124E33]">
                        {schedule.lunch.gravyOrNonVeg}
                      </td>
                      <td className="p-2.5 border-r border-gray-200">{schedule.lunch.rice}</td>
                      <td className="p-2.5 border-r border-gray-200 text-gray-600">{schedule.lunch.foilPacked}</td>
                      <td className="p-2.5 text-emerald-800 font-semibold">{schedule.lunch.extras}</td>
                    </tr>

                    {/* Dinner Row (if exists) */}
                    {schedule.dinner ? (
                      <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]/60'}>
                        <td className="p-2.5 font-bold text-indigo-900 border-r border-gray-200 bg-indigo-50/30">
                          🌙 Dinner
                        </td>
                        <td className="p-2.5 border-r border-gray-200">{schedule.dinner.dal}</td>
                        <td className="p-2.5 border-r border-gray-200">{schedule.dinner.dryVeg}</td>
                        <td className="p-2.5 border-r border-gray-200 font-bold text-[#124E33]">
                          {schedule.dinner.gravyOrNonVeg}
                        </td>
                        <td className="p-2.5 border-r border-gray-200">{schedule.dinner.rice}</td>
                        <td className="p-2.5 border-r border-gray-200 text-gray-600">{schedule.dinner.foilPacked}</td>
                        <td className="p-2.5 text-emerald-800 font-semibold">{schedule.dinner.extras}</td>
                      </tr>
                    ) : (
                      <tr className="bg-rose-50/40 text-rose-800 italic">
                        <td className="p-2.5 font-bold text-rose-700 border-r border-gray-200">
                          🌙 Dinner
                        </td>
                        <td colSpan={6} className="p-2.5 font-semibold">
                          OFF (Sunday night kitchen closed for deep sanitization and staff rest)
                        </td>
                      </tr>
                    )}

                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Balanced Nutrition in Every Meal Section matching Posters */}
          {nutrition && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-[#124E33] font-bold text-sm font-serif-title">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Balanced Nutrition in Every Meal ({selectedMenuTab})</span>
                </div>
                <span className="text-[10px] text-gray-500">*RDA based on single meal contribution</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200">
                  <span className="font-bold text-emerald-900 block text-[11px]">PROTEIN</span>
                  <span className="text-gray-700">{nutrition.protein}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200">
                  <span className="font-bold text-emerald-900 block text-[11px]">CALCIUM</span>
                  <span className="text-gray-700">{nutrition.calcium}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200">
                  <span className="font-bold text-emerald-900 block text-[11px]">IRON</span>
                  <span className="text-gray-700">{nutrition.iron}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200">
                  <span className="font-bold text-emerald-900 block text-[11px]">FIBER</span>
                  <span className="text-gray-700">{nutrition.fiber}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200">
                  <span className="font-bold text-emerald-900 block text-[11px]">VITAMIN A</span>
                  <span className="text-gray-700">{nutrition.vitA}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200">
                  <span className="font-bold text-emerald-900 block text-[11px]">VITAMIN D</span>
                  <span className="text-gray-700">{nutrition.vitD}</span>
                </div>
                {nutrition.vitB12 && (
                  <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200">
                    <span className="font-bold text-emerald-900 block text-[11px]">VITAMIN B12</span>
                    <span className="text-gray-700">{nutrition.vitB12}</span>
                  </div>
                )}
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-gray-200">
                  <span className="font-bold text-emerald-900 block text-[11px]">GOOD FATS</span>
                  <span className="text-gray-700">{nutrition.goodFats}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-gray-500">
            *Menu items may vary slightly based on seasonal fresh market availability.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWeeklyMenuOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black"
            >
              Close
            </button>
            <button
              onClick={handleSubscribeThis}
              className="px-5 py-2.5 bg-[#124E33] hover:bg-[#0A2A1B] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-[#F2C94C]" />
              <span>Register for {selectedMenuTab}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
