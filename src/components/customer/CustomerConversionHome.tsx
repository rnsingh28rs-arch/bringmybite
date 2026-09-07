import React, { useMemo, useState } from 'react';
import { CalendarCheck, CheckCircle2, Clock3, Eye, Leaf, MessageSquare, ShieldCheck, Utensils, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCms } from '../../cms/CmsContext';
import { FOOD_IMAGES } from '../../assets/foodImages';
import { PackageType, ThaliType } from '../../types';

const PLAN_META: Array<{
  type: PackageType;
  label: string;
  short: string;
  benefit: string;
  image: string;
  instant: ThaliType;
}> = [
  { type: 'VEG CLASSIC', label: 'Veg Classic', short: 'Pure vegetarian', benefit: 'Homely everyday meals', image: FOOD_IMAGES.vegThali, instant: 'veg' },
  { type: 'EGG DELIGHT', label: 'Egg Delight', short: 'High protein', benefit: 'Egg-based protein meals', image: FOOD_IMAGES.eggThali, instant: 'egg' },
  { type: 'NON-VEG CLUB', label: 'Non-Veg Club', short: 'Chicken specials', benefit: 'Rich home-style meals', image: FOOD_IMAGES.nonVegThali, instant: 'non-veg' }
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

const SPECIAL_NIGHT_BY_PLAN: Record<string, string> = {
  'Veg Classic': 'Homely Special Night',
  'Egg Delight': 'Protein Special Night',
  'Non-Veg Club': 'Chicken Special Night'
};

export const CustomerConversionHome: React.FC = () => {
  const cms = useCms();
  const {
    pricing,
    setIsRegistrationOpen,
    setSelectedPackageForRegistration,
    setIsWeeklyMenuOpen,
    setSelectedMenuTab,
    setIsInstantOrderOpen,
    setPreselectedThaliType
  } = useApp();
  const [menuPackage, setMenuPackage] = useState<PackageType>('VEG CLASSIC');

  const todayName = DAY_NAMES[new Date().getDay()];
  const todayMenu = useMemo(() => cms.menus[menuPackage]?.find((item) => item.day === todayName), [cms.menus, menuPackage, todayName]);
  const selectedPlanLabel = PLAN_META.find((p) => p.type === menuPackage)?.label || 'Veg Classic';
  const specialNightLabel = SPECIAL_NIGHT_BY_PLAN[selectedPlanLabel];

  const openSubscription = (type: PackageType) => {
    setSelectedPackageForRegistration(type);
    setIsRegistrationOpen(true);
  };

  const openMenu = (type: PackageType = menuPackage) => {
    setSelectedMenuTab(type);
    setIsWeeklyMenuOpen(true);
  };

  const openInstant = (type: ThaliType) => {
    setPreselectedThaliType(type);
    setIsInstantOrderOpen(true);
  };

  const monthlyPrice = (type: PackageType) => type === 'VEG CLASSIC' ? pricing.vegMonthly : type === 'EGG DELIGHT' ? pricing.eggMonthly : pricing.nonVegMonthly;
  const instantPrice = (type: ThaliType) => type === 'veg' ? pricing.vegThaliInstant : type === 'egg' ? pricing.eggThaliInstant : pricing.nonVegThaliInstant;

  const mealRows = (meal: any) => meal ? [
    ['Dal', meal.dal],
    ['Main', meal.gravyOrNonVeg],
    ['Dry Veg', meal.dryVeg],
    ['Rice', meal.rice],
    ['Extras', meal.extras]
  ] : [];

  return (
    <main className="flex-1 pb-24 sm:pb-0">
      <section id="hero" className="relative overflow-hidden border-b border-[#E8E1D5] bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
          <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                <Leaf className="w-3.5 h-3.5" /> Homely food for busy days
              </div>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-[#0C3822] font-serif-title">
                Homely Food.<br /><span className="text-[#C88A24]">Delivered with Care.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base sm:text-lg leading-7 text-gray-700">
                Fresh, hygienic tiffin meals for students and working professionals — with a simple monthly plan or a meal for today.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a href="#plans" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#124E33] px-6 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-[#0A2A1B] active:scale-[.98]">
                  <CalendarCheck className="w-4 h-4 text-[#F2C94C]" /> Monthly Meal Plan
                </a>
                <button onClick={() => openInstant('veg')} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#C88A24] bg-[#FDF7E7] px-6 py-3.5 text-sm font-extrabold text-[#6F4A10] transition hover:bg-[#F9EDCF] active:scale-[.98]">
                  <Zap className="w-4 h-4" /> Order Today's Thali
                </button>
              </div>
              <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
                {[
                  ['13 meals/week', 'Simple monthly plan'],
                  ['Fresh daily', 'Prepared for service'],
                  ['Gate delivery', 'College / office'],
                  ['WhatsApp support', 'Easy assistance']
                ].map(([title, text]) => (
                  <div key={title} className="rounded-xl bg-white/80 border border-[#E5DAC6] px-3 py-2.5">
                    <div className="text-xs font-extrabold text-[#124E33]">{title}</div>
                    <div className="mt-0.5 text-[10px] text-gray-500">{text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border-2 border-[#E5DAC6] bg-white shadow-xl">
              <img src={FOOD_IMAGES.instantTiffin} alt="Fresh prepared Bring My Bite meal thali" referrerPolicy="no-referrer" className="h-64 sm:h-80 w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6 pt-20 text-white">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#F2C94C]">Two ways to order</div>
                <div className="mt-1 text-2xl font-extrabold">Plan ahead or eat today.</div>
                <div className="mt-1 text-xs text-white/80">Choose a monthly plan or order a one-time thali.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="bg-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#C88A24]">Choose your plan</p>
              <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold text-[#0C3822] font-serif-title">Monthly Meal Plans</h2>
              <p className="mt-2 text-sm text-gray-600">One clear decision: choose your meal style, see the menu, and subscribe.</p>
            </div>
            <a href="#today-menu" className="text-sm font-bold text-[#124E33] hover:underline">See today's menu ↓</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLAN_META.map((plan, index) => (
              <article key={plan.type} className={`relative overflow-hidden rounded-2xl border ${index === 1 ? 'border-[#C88A24] ring-2 ring-[#C88A24]/15' : 'border-[#E5DAC6]'} bg-[#FAF7F2] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg`}>
                {index === 1 && <div className="absolute right-3 top-3 z-10 rounded-full bg-[#C88A24] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-black">Most Popular</div>}
                <div className="h-36 overflow-hidden">
                  <img src={plan.image} alt={`${plan.label} meal`} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-extrabold text-[#0C3822]">{plan.label}</h3>
                      <p className="mt-0.5 text-xs font-semibold text-gray-500">{plan.short}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-black text-[#124E33]">₹{monthlyPrice(plan.type).toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-gray-500">/ month</div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl bg-white px-3.5 py-3 text-xs font-bold text-[#124E33]">
                    13 meals per week • Mon–Sat lunch + dinner • Sunday lunch
                  </div>
                  <ul className="mt-4 space-y-2 text-xs text-gray-700">
                    {[plan.benefit, 'College / office gate delivery', 'Clear monthly pricing'].map((item) => (
                      <li key={item} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />{item}</li>
                    ))}
                  </ul>
                  <div className="mt-5 space-y-2">
                    <button onClick={() => openSubscription(plan.type)} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#124E33] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#0A2A1B]">
                      <CalendarCheck className="w-4 h-4 text-[#F2C94C]" /> Subscribe Now
                    </button>
                    <button onClick={() => openMenu(plan.type)} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50">
                      <Eye className="w-3.5 h-3.5 text-emerald-700" /> View 7-Day Menu
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="today-menu" className="border-y border-[#E8E1D5] bg-[#FAF7F2] py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#C88A24]">Today's menu</p>
              <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold text-[#0C3822] font-serif-title">See What You're Eating Today</h2>
              <p className="mt-2 text-sm text-gray-600"><span className="font-bold text-[#124E33]">{todayName}</span> • CMS-updated menu for the selected plan</p>
            </div>
            <button onClick={() => openMenu()} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#124E33] bg-white px-5 py-3 text-sm font-extrabold text-[#124E33] hover:bg-emerald-50">
              <Eye className="w-4 h-4" /> View Full 7-Day Menu
            </button>
          </div>

          <div className="mt-7 grid lg:grid-cols-[.75fr_1.25fr] gap-5">
            <div className="rounded-2xl border border-[#E5DAC6] bg-white p-2 flex lg:block overflow-x-auto">
              {PLAN_META.map((plan) => (
                <button key={plan.type} onClick={() => setMenuPackage(plan.type)} className={`min-w-[150px] lg:w-full lg:text-left rounded-xl px-4 py-3 transition ${menuPackage === plan.type ? 'bg-[#124E33] text-white' : 'hover:bg-gray-50 text-gray-700'}`}>
                  <div className="text-sm font-extrabold">{plan.label}</div>
                  <div className={`text-[10px] mt-0.5 ${menuPackage === plan.type ? 'text-white/75' : 'text-gray-500'}`}>₹{monthlyPrice(plan.type).toLocaleString()} / month</div>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-[#E5DAC6] bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-gray-500">{todayName} menu</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-extrabold text-[#0C3822]">{selectedPlanLabel}</h3>
                    <span className="rounded-full bg-[#FDF7E7] px-2.5 py-1 text-[10px] font-extrabold text-[#6F4A10]">{specialNightLabel}</span>
                  </div>
                </div>
                <Utensils className="h-7 w-7 text-[#C88A24]" />
              </div>

              {todayMenu ? (
                <div className="mt-4 grid xl:grid-cols-2 gap-4">
                  {[
                    { key: 'lunch', label: 'Lunch', meal: todayMenu.lunch },
                    { key: 'dinner', label: 'Dinner', meal: todayMenu.dinner }
                  ].map(({ key, label, meal }) => (
                    <div key={key} className="rounded-2xl border border-[#E8E1D5] bg-[#FAF7F2] p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-black uppercase tracking-widest text-[#124E33]">{todayName} {label}</div>
                        {label === 'Dinner' && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-extrabold text-emerald-800">Special Night</span>}
                      </div>
                      {meal ? (
                        <div className="mt-3 grid sm:grid-cols-2 gap-2">
                          {mealRows(meal).map(([field, value]) => (
                            <div key={field} className="rounded-xl bg-white p-3">
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">{field}</div>
                              <div className="mt-1 text-sm font-semibold text-gray-800">{value}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 rounded-xl bg-white p-4 text-sm text-gray-600">Kitchen closed for dinner.</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-[#FAF7F2] p-5 text-sm text-gray-600">Today's menu is not available yet. Please open the full menu or contact support.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="instant-order" className="bg-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#0C3822] px-5 py-8 sm:px-8 lg:px-10 lg:py-10 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
              <div>
                <div className="inline-flex items-center gap-2 text-[#F2C94C] text-xs font-extrabold uppercase tracking-widest"><Zap className="w-4 h-4" /> Hungry Today?</div>
                <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold font-serif-title">Order Today's Thali</h2>
                <p className="mt-2 max-w-2xl text-sm text-white/75">Choose your meal type, enter delivery details, review the order and continue to payment.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 min-w-0 lg:min-w-[520px]">
                {PLAN_META.map((plan) => (
                  <button key={plan.instant} onClick={() => openInstant(plan.instant)} className="rounded-xl border border-white/15 bg-white/10 p-3 text-left transition hover:bg-white/15">
                    <div className="text-sm font-extrabold">{plan.label}</div>
                    <div className="mt-1 text-lg font-black text-[#F2C94C]">₹{instantPrice(plan.instant)}</div>
                    <div className="mt-1 text-[10px] text-white/65">One-time thali</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="bg-[#FAF7F2] py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#C88A24]">Why Bring My Bite?</p>
            <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold text-[#0C3822] font-serif-title">Simple food. Simple ordering.</h2>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              [ShieldCheck, 'Hygienic kitchen', 'Careful preparation and clean meal packing.'],
              [Utensils, 'Homely meals', 'Familiar everyday food designed for regular eating.'],
              [Clock3, 'Convenient delivery', 'College and office gate delivery where applicable.'],
              [MessageSquare, 'WhatsApp support', 'Get assistance without searching through the site.']
            ].map(([Icon, title, text]) => (
              <div key={title as string} className="rounded-2xl border border-[#E5DAC6] bg-white p-5">
                <Icon className="h-6 w-6 text-[#124E33]" />
                <h3 className="mt-4 text-sm font-extrabold text-[#0C3822]">{title as string}</h3>
                <p className="mt-1 text-xs leading-5 text-gray-600">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sm:hidden fixed inset-x-3 bottom-3 z-40 sticky bg-white/95 backdrop-blur border border-[#DCCFB8] rounded-2xl shadow-2xl p-2 grid grid-cols-2 gap-2" aria-label="Mobile conversion actions">
        <a href="#plans" className="inline-flex items-center justify-center rounded-xl bg-[#124E33] px-3 py-3 text-xs font-extrabold text-white">View Plans</a>
        <button onClick={() => openInstant('veg')} className="inline-flex items-center justify-center rounded-xl bg-[#C88A24] px-3 py-3 text-xs font-extrabold text-black">Order Today</button>
      </div>
    </main>
  );
};
