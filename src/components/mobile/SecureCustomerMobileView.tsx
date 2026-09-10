import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, ChevronRight, Clock3, MapPin, Phone, QrCode, ShieldCheck, Sparkles, User, Utensils, WalletCards, Zap } from 'lucide-react';
import { useApp, getDaysRemaining } from '../../context/AppContext';
import { useCms } from '../../cms/CmsContext';
import { getLastOrderTracking } from '../../utils/orderStore';
import { getCustomerSubscription, customerPriceLabel } from '../../utils/customerMobileAccess.mjs';
import { FOOD_IMAGES } from '../../assets/foodImages';
import { PackageType, ThaliType } from '../../types';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
type DayName = typeof DAY_NAMES[number];
type MealSlot = 'lunch' | 'dinner';

type HeroSlide = {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  action: string;
  actionType: ThaliType;
};

const HERO_SLIDES: HeroSlide[] = [
  { eyebrow: 'Freshly prepared every day', title: 'Homely food, ready when you are.', copy: 'Order a wholesome thali today or choose a monthly meal plan.', image: FOOD_IMAGES.instantTiffin, action: "Order Today's Thali", actionType: 'veg' },
  { eyebrow: 'Choose your meal style', title: 'Veg. Egg. Non-Veg. Your choice.', copy: 'Simple meals, clear pricing and convenient delivery for busy days.', image: FOOD_IMAGES.eggThali, action: 'See Egg Thali', actionType: 'egg' },
  { eyebrow: 'Monthly plans', title: 'Eat better without planning every day.', copy: 'Pick your plan and let Bring My Bite take care of the meals.', image: FOOD_IMAGES.nonVegThali, action: 'See Non-Veg Thali', actionType: 'non-veg' }
];

const PLAN_META: Array<{ type: PackageType; label: string; image: string; benefit: string }> = [
  { type: 'VEG CLASSIC', label: 'Veg Classic', image: FOOD_IMAGES.vegThali, benefit: 'Pure vegetarian homely meals' },
  { type: 'EGG DELIGHT', label: 'Egg Delight', image: FOOD_IMAGES.eggThali, benefit: 'Egg-based protein meals' },
  { type: 'NON-VEG CLUB', label: 'Non-Veg Club', image: FOOD_IMAGES.nonVegThali, benefit: 'Chicken specials and homely meals' }
];

const formatPrice = (value: number) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export const SecureCustomerMobileView: React.FC = () => {
  const { payment, pricing, menus } = useCms();
  const { subscriptions, setIsRegistrationOpen, setSelectedPackageForRegistration, setIsInstantOrderOpen, setPreselectedThaliType } = useApp();
  const [tab, setTab] = useState<'home' | 'menu' | 'instant' | 'profile'>('home');
  const [day, setDay] = useState<DayName>('Monday');
  const [meal, setMeal] = useState<MealSlot>('lunch');
  const [diet, setDiet] = useState<ThaliType>('veg');
  const [heroIndex, setHeroIndex] = useState(0);

  const tracking = getLastOrderTracking();
  const activeSub = useMemo(() => getCustomerSubscription(subscriptions, tracking?.phone || ''), [subscriptions, tracking?.phone]);
  const daysRemaining = activeSub ? getDaysRemaining(activeSub.expiryDate) : 0;
  const customerName = activeSub?.customerName || 'Guest Customer';
  const packageType: PackageType = diet === 'veg' ? 'VEG CLASSIC' : diet === 'egg' ? 'EGG DELIGHT' : 'NON-VEG CLUB';
  const menu = menus[packageType] || [];
  const selectedDayMenu = menu.find((item) => item.day === day) || menu[0];
  const currentMeal = selectedDayMenu ? (meal === 'lunch' ? selectedDayMenu.lunch : selectedDayMenu.dinner) : null;
  const instantPrice = diet === 'veg' ? pricing.vegThaliInstant : diet === 'egg' ? pricing.eggThaliInstant : pricing.nonVegThaliInstant;
  const hero = HERO_SLIDES[heroIndex];

  useEffect(() => {
    const timer = window.setInterval(() => setHeroIndex((index) => (index + 1) % HERO_SLIDES.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  const openInstant = (type: ThaliType) => {
    setDiet(type);
    setPreselectedThaliType(type);
    setIsInstantOrderOpen(true);
  };

  const openSubscription = (type: PackageType) => {
    setSelectedPackageForRegistration(type);
    setIsRegistrationOpen(true);
  };

  const selectPlan = (type: PackageType) => {
    setDiet(type === 'VEG CLASSIC' ? 'veg' : type === 'EGG DELIGHT' ? 'egg' : 'non-veg');
    setTab('menu');
  };

  const monthlyPrice = (type: PackageType) => type === 'VEG CLASSIC' ? pricing.vegMonthly : type === 'EGG DELIGHT' ? pricing.eggMonthly : pricing.nonVegMonthly;

  const instantCards: Array<{ type: ThaliType; label: string; image: string; price: number; description: string }> = [
    { type: 'veg', label: 'Veg Thali', image: FOOD_IMAGES.vegThali, price: pricing.vegThaliInstant, description: 'Comforting vegetarian meal' },
    { type: 'egg', label: 'Egg Thali', image: FOOD_IMAGES.eggThali, price: pricing.eggThaliInstant, description: 'Protein-rich egg meal' },
    { type: 'non-veg', label: 'Non-Veg Thali', image: FOOD_IMAGES.nonVegThali, price: pricing.nonVegThaliInstant, description: 'Chicken special meal' }
  ];

  const MOBILE_NAV_ITEMS = [
    ['home', 'Home', User],
    ['menu', 'Menu', Utensils],
    ['instant', 'Instant', Zap],
    ['profile', 'Profile', QrCode]
  ] as const;

  return (
    <div className="min-h-full bg-[#F8F5EF] text-[#1A261E] pb-20">
      <header className="sticky top-0 z-40 bg-[#0C3822] text-white shadow-lg">
        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
          <button onClick={() => setTab('home')} className="flex items-center gap-2 min-w-0 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#C88A24] text-black font-black flex items-center justify-center text-xs shrink-0 shadow-sm">BM</div>
            <div className="min-w-0"><div className="text-[9px] uppercase tracking-[0.16em] text-emerald-200">Bring My Bite</div><div className="text-sm font-extrabold truncate">Homely Food. Delivered.</div></div>
          </button>
          <a href="tel:9315075165" className="shrink-0 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-extrabold text-[#F2C94C] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Call</a>
        </div>
      </header>

      <main className="space-y-5 p-3.5">
        {tab === 'home' && (
          <>
            <section className="relative overflow-hidden rounded-3xl bg-[#0C3822] text-white shadow-xl border border-[#C88A24]/70">
              <img src={hero.image} alt={hero.title} className="absolute inset-0 h-full w-full object-cover opacity-60" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#061D11]/95 via-[#0C3822]/75 to-black/20" />
              <div className="relative min-h-[360px] flex flex-col justify-end p-5">
                <div className="max-w-[82%]">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F2C94C] px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#3E2B06]"><Sparkles className="w-3 h-3" /> {hero.eyebrow}</div>
                  <h1 className="mt-3 text-3xl leading-tight font-black font-serif-title">{hero.title}</h1>
                  <p className="mt-2 text-xs leading-5 text-white/85">{hero.copy}</p>
                  <button onClick={() => openInstant(hero.actionType)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-[#124E33] shadow-lg"><Zap className="w-4 h-4 text-[#C88A24]" /> {hero.action} <ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
                <div className="mt-5 flex items-center gap-1.5">{HERO_SLIDES.map((slide, index) => <button key={slide.title} aria-label={`Show banner ${index + 1}`} onClick={() => setHeroIndex(index)} className={`h-1.5 rounded-full transition-all ${index === heroIndex ? 'w-7 bg-[#F2C94C]' : 'w-1.5 bg-white/50'}`} />)}</div>
              </div>
            </section>

            <section className="grid grid-cols-3 gap-2">
              <button onClick={() => setTab('menu')} className="rounded-2xl bg-white border border-[#E5DAC6] p-3 text-center shadow-sm"><Calendar className="mx-auto w-5 h-5 text-[#124E33]" /><span className="mt-1.5 block text-[10px] font-black">7-Day Menu</span></button>
              <button onClick={() => setTab('instant')} className="rounded-2xl bg-white border border-[#E5DAC6] p-3 text-center shadow-sm"><Zap className="mx-auto w-5 h-5 text-[#C88A24]" /><span className="mt-1.5 block text-[10px] font-black">Order Today</span></button>
              <button onClick={() => setTab('profile')} className="rounded-2xl bg-white border border-[#E5DAC6] p-3 text-center shadow-sm"><User className="mx-auto w-5 h-5 text-[#124E33]" /><span className="mt-1.5 block text-[10px] font-black">My Profile</span></button>
            </section>

            {activeSub && <section className="rounded-2xl bg-white border border-[#E5DAC6] p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><div><div className="text-[9px] font-black uppercase tracking-widest text-[#C88A24]">Your active plan</div><h2 className="mt-1 text-lg font-black text-[#0C3822]">{customerName}</h2><p className="mt-0.5 text-[10px] text-gray-500">{activeSub.packageType} • {activeSub.mealPreference}</p></div><div className="rounded-xl bg-[#0C3822] px-3 py-2 text-center text-white"><div className="text-lg font-black text-[#F2C94C]">{Math.max(daysRemaining, 0)}</div><div className="text-[8px] font-bold uppercase">days left</div></div></div></section>}

            <section className="overflow-hidden rounded-2xl bg-white border border-[#E5DAC6] shadow-sm">
              <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100">
                <div><div className="text-[9px] font-black uppercase tracking-widest text-[#C88A24]">Live Central Menu</div><h2 className="mt-0.5 text-xl font-black text-[#0C3822] font-serif-title">Today's meal</h2></div>
                <button onClick={() => setTab('menu')} className="text-[10px] font-black text-[#124E33]">Full menu →</button>
              </div>
              <div className="grid grid-cols-2 gap-3 p-3">
                <img src={FOOD_IMAGES.vegThali} alt="Today's meal" className="h-28 w-full rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div className="rounded-xl bg-[#F8F5EF] p-3"><div className="text-[9px] font-black uppercase text-gray-400">Veg Classic</div><div className="mt-1 text-[10px] font-bold text-gray-800">{menus['VEG CLASSIC']?.[0]?.lunch?.dal || 'Fresh dal'} • {menus['VEG CLASSIC']?.[0]?.lunch?.dryVeg || 'Seasonal sabzi'}</div><div className="mt-2 text-[10px] text-gray-600">{menus['VEG CLASSIC']?.[0]?.lunch?.rice || 'Rice'} • {menus['VEG CLASSIC']?.[0]?.lunch?.foilPacked || 'Freshly packed'}</div><button onClick={() => openInstant('veg')} className="mt-3 rounded-lg bg-[#124E33] px-3 py-2 text-[9px] font-black text-white">Order Today</button></div>
              </div>
            </section>

            <section>
              <div className="flex items-end justify-between gap-2 mb-3"><div><div className="text-[9px] font-black uppercase tracking-widest text-[#C88A24]">Choose your meal</div><h2 className="mt-0.5 text-xl font-black text-[#0C3822] font-serif-title">Monthly Plans</h2></div><button onClick={() => setTab('menu')} className="text-[10px] font-black text-[#124E33]">View menu →</button></div>
              <div className="space-y-3">
                {PLAN_META.map((plan) => <article key={plan.type} className="overflow-hidden rounded-2xl bg-white border border-[#E5DAC6] shadow-sm"><div className="flex min-h-[126px]"><img src={plan.image} alt={plan.label} className="w-[38%] object-cover" referrerPolicy="no-referrer" /><div className="flex-1 p-3.5"><div className="flex items-start justify-between gap-2"><div><h3 className="text-base font-black text-[#0C3822]">{plan.label}</h3><p className="mt-0.5 text-[10px] text-gray-500">{plan.benefit}</p></div><div className="text-right shrink-0"><div className="text-lg font-black text-[#124E33]">{formatPrice(monthlyPrice(plan.type))}</div><div className="text-[8px] font-bold text-gray-400">/ month</div></div></div><div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-gray-600"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> 13 meals/week • Gate delivery</div><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => openSubscription(plan.type)} className="rounded-xl bg-[#124E33] py-2.5 text-[10px] font-black text-white">Subscribe</button><button onClick={() => selectPlan(plan.type)} className="rounded-xl border border-gray-200 py-2.5 text-[10px] font-black text-[#124E33]">See Menu</button></div></div></div></article>)}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl bg-[#124E33] text-white shadow-sm"><div className="grid grid-cols-[1fr_110px] items-stretch"><div className="p-4"><div className="text-[9px] font-black uppercase tracking-widest text-[#F2C94C]">Fresh & convenient</div><h2 className="mt-1 text-lg font-black">A better meal routine.</h2><div className="mt-3 space-y-1.5 text-[10px] text-emerald-100"><div className="flex gap-1.5"><ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Hygienic preparation</div><div className="flex gap-1.5"><Clock3 className="w-3.5 h-3.5 shrink-0" /> Fresh daily service</div><div className="flex gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0" /> College / office delivery</div></div></div><img src={FOOD_IMAGES.sweets} alt="Indian sweets" className="h-full w-full object-cover" referrerPolicy="no-referrer" /></div></section>
          </>
        )}

        {tab === 'menu' && <section className="space-y-4">
          <div className="rounded-2xl bg-[#0C3822] p-4 text-white shadow-sm"><div className="text-[9px] font-black uppercase tracking-widest text-[#F2C94C]">Live Central Menu</div><h2 className="mt-1 text-xl font-black font-serif-title">What are you eating?</h2><p className="mt-1 text-[10px] text-emerald-100">Select a day, meal and food preference.</p></div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">{DAY_NAMES.map((item) => <button key={item} onClick={() => setDay(item)} className={`shrink-0 rounded-xl px-3.5 py-2 text-[10px] font-black ${day === item ? 'bg-[#124E33] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>{item.slice(0, 3)}</button>)}</div>
          <div className="grid grid-cols-2 gap-2"><button onClick={() => setMeal('lunch')} className={`rounded-xl py-2.5 text-[10px] font-black ${meal === 'lunch' ? 'bg-[#C88A24] text-black' : 'bg-white border border-gray-200'}`}>☀️ Lunch</button><button onClick={() => setMeal('dinner')} className={`rounded-xl py-2.5 text-[10px] font-black ${meal === 'dinner' ? 'bg-[#C88A24] text-black' : 'bg-white border border-gray-200'}`}>🌙 Dinner</button></div>
          <div className="flex gap-2 overflow-x-auto pb-1">{instantCards.map((card) => <button key={card.type} onClick={() => setDiet(card.type)} className={`min-w-[106px] overflow-hidden rounded-2xl border ${diet === card.type ? 'border-[#C88A24] ring-2 ring-[#C88A24]/20' : 'border-gray-200'} bg-white text-left`}><img src={card.image} alt={card.label} className="h-16 w-full object-cover" referrerPolicy="no-referrer" /><div className="p-2"><div className="text-[9px] font-black">{card.label}</div><div className="mt-0.5 text-[9px] font-bold text-[#124E33]">{formatPrice(card.price)}</div></div></button>)}</div>
          <div className="overflow-hidden rounded-3xl bg-white border border-[#E5DAC6] shadow-sm"><img src={diet === 'veg' ? FOOD_IMAGES.vegThali : diet === 'egg' ? FOOD_IMAGES.eggThali : FOOD_IMAGES.nonVegThali} alt={`${diet} thali`} className="h-48 w-full object-cover" referrerPolicy="no-referrer" /><div className="p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-[9px] font-black uppercase tracking-widest text-[#C88A24]">{day} • {meal}</div><h3 className="mt-1 text-xl font-black text-[#0C3822]">5-Compartment Homely Thali</h3></div><span className="rounded-xl bg-emerald-50 px-2.5 py-1.5 text-[10px] font-black text-emerald-800">{customerPriceLabel(instantPrice)}</span></div>{currentMeal ? <div className="mt-4 grid grid-cols-2 gap-2">{[['Dal', currentMeal.dal], ['Main', currentMeal.gravyOrNonVeg], ['Dry Veg', currentMeal.dryVeg], ['Rice', currentMeal.rice], ['Packing', currentMeal.foilPacked], ['Extras', currentMeal.extras]].map(([label, value]) => <div key={label} className="rounded-xl bg-[#F8F5EF] p-2.5"><div className="text-[8px] font-black uppercase tracking-wider text-gray-400">{label}</div><div className="mt-0.5 text-[10px] font-bold text-gray-800">{value || '—'}</div></div>)}</div> : <p className="mt-4 rounded-xl bg-[#F8F5EF] p-3 text-[10px] text-gray-500">No meal configured for this slot yet.</p>}<button onClick={() => openInstant(diet)} className="mt-4 w-full rounded-xl bg-[#124E33] py-3 text-xs font-black text-white flex items-center justify-center gap-2"><Zap className="w-4 h-4 text-[#F2C94C]" /> Order This Thali</button></div></div>
        </section>}

        {tab === 'instant' && <section className="space-y-4">
          <div className="overflow-hidden rounded-3xl bg-[#0C3822] text-white shadow-lg"><img src={FOOD_IMAGES.instantTiffin} alt="Fresh instant thali" className="h-48 w-full object-cover opacity-90" referrerPolicy="no-referrer" /><div className="p-4"><div className="text-[9px] font-black uppercase tracking-widest text-[#F2C94C]">Live Central Pricing</div><h2 className="mt-1 text-2xl font-black font-serif-title">Hungry today?</h2><p className="mt-1 text-[10px] text-emerald-100">Choose your thali. Prices below come directly from the CMS.</p></div></div>
          <div className="space-y-3">{instantCards.map((card) => <article key={card.type} className="overflow-hidden rounded-2xl bg-white border border-[#E5DAC6] shadow-sm"><div className="flex min-h-[118px]"><img src={card.image} alt={card.label} className="w-[35%] object-cover" referrerPolicy="no-referrer" /><div className="flex-1 p-3.5"><div className="flex items-start justify-between gap-2"><div><h3 className="text-base font-black text-[#0C3822]">{card.label}</h3><p className="mt-0.5 text-[9px] text-gray-500">{card.description}</p></div><div className="text-lg font-black text-[#124E33]">{formatPrice(card.price)}</div></div><button onClick={() => openInstant(card.type)} className="mt-3 w-full rounded-xl bg-[#124E33] py-2.5 text-[10px] font-black text-white flex items-center justify-center gap-1.5">Order Now <ChevronRight className="w-3.5 h-3.5" /></button></div></div></article>)}</div>
          <div className="rounded-2xl bg-white border border-[#E5DAC6] p-4"><div className="flex items-center gap-2 text-[#124E33]"><WalletCards className="w-5 h-5" /><span className="text-xs font-black">Payment</span></div><p className="mt-2 text-[10px] text-gray-500">UPI payment is configured through the central CMS.</p><div className="mt-2 rounded-xl bg-[#F8F5EF] px-3 py-2 text-xs font-black text-[#0C3822] break-all">{payment.upiId || 'Configured in CMS'}</div></div>
        </section>}

        {tab === 'profile' && <section className="space-y-4">
          <div className="rounded-3xl bg-[#0C3822] p-5 text-white shadow-lg"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-[#C88A24] text-black flex items-center justify-center font-black">{customerName.slice(0, 2).toUpperCase()}</div><div><div className="text-[9px] uppercase tracking-widest text-emerald-200">My Profile</div><h2 className="text-xl font-black">{customerName}</h2></div></div>{activeSub ? <div className="mt-5 grid grid-cols-2 gap-2 text-[10px]"><div className="rounded-xl bg-white/10 p-3"><div className="text-emerald-200">Plan</div><div className="mt-1 font-black">{activeSub.packageType}</div></div><div className="rounded-xl bg-white/10 p-3"><div className="text-emerald-200">Days Left</div><div className="mt-1 font-black text-[#F2C94C]">{Math.max(daysRemaining, 0)}</div></div><div className="rounded-xl bg-white/10 p-3"><div className="text-emerald-200">Mobile</div><div className="mt-1 font-black">{activeSub.mobileNumber}</div></div><div className="rounded-xl bg-white/10 p-3"><div className="text-emerald-200">Delivery</div><div className="mt-1 font-black">{activeSub.lunchDeliveryPoint || 'Registered point'}</div></div></div> : <p className="mt-4 text-xs leading-5 text-emerald-100">No customer plan is linked to this device. Register to create your customer profile.</p>}</div>
          <div className="rounded-2xl bg-white border border-[#E5DAC6] p-4"><div className="flex items-center gap-2"><QrCode className="w-5 h-5 text-[#124E33]" /><span className="text-xs font-black">Your account</span></div><div className="mt-3 space-y-2 text-[10px] text-gray-600"><div className="flex items-center justify-between border-b pb-2"><span>Customer</span><b className="text-gray-900">{customerName}</b></div><div className="flex items-center justify-between border-b pb-2"><span>Meal preference</span><b className="text-gray-900">{activeSub?.mealPreference || 'Not registered'}</b></div><div className="flex items-center justify-between"><span>Route</span><b className="text-gray-900">{activeSub?.routeCode || 'Not assigned'}</b></div></div></div>
          <button onClick={() => activeSub ? setIsRegistrationOpen(true) : openSubscription('VEG CLASSIC')} className="w-full rounded-xl bg-[#124E33] py-3.5 text-xs font-black text-white flex items-center justify-center gap-2"><Calendar className="w-4 h-4 text-[#F2C94C]" /> {activeSub ? 'View / Renew Plan' : 'Register Monthly Plan'}</button>
        </section>}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-emerald-900 bg-[#0C3822]/95 px-2 py-2 text-white shadow-2xl backdrop-blur"><div className="mx-auto grid max-w-md grid-cols-4">{MOBILE_NAV_ITEMS.map(([value, label, Icon]) => <button key={value} onClick={() => setTab(value)} className={`flex flex-col items-center gap-1 py-1 text-[9px] font-black ${tab === value ? 'text-[#F2C94C]' : 'text-emerald-300'}`}><Icon className="h-4 w-4" />{label}</button>)}</div></nav>
    </div>
  );
};
