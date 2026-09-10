import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Clock3, Flame, Home, MapPin, Phone, QrCode, ShieldCheck, Sparkles, User, Zap } from 'lucide-react';
import { useApp, getDaysRemaining } from '../../context/AppContext';
import { useCms } from '../../cms/CmsContext';
import { getLastOrderTracking } from '../../utils/orderStore';
import { getCustomerSubscription, customerPriceLabel } from '../../utils/customerMobileAccess.mjs';
import { FOOD_IMAGES } from '../../assets/foodImages';
import { PackageType, ThaliType } from '../../types';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] as const;
type DayName = typeof DAYS[number];
type MealSlot = 'lunch' | 'dinner';
type Tab = 'home' | 'menu' | 'instant' | 'profile';
type Diet = 'veg' | 'egg' | 'non-veg';

const PLAN_META: Array<{ type: PackageType; label: string; image: string; benefit: string; instant: ThaliType }> = [
  { type: 'VEG CLASSIC', label: 'Veg Classic', image: FOOD_IMAGES.vegThali, benefit: 'Pure vegetarian homely meals', instant: 'veg' },
  { type: 'EGG DELIGHT', label: 'Egg Delight', image: FOOD_IMAGES.eggThali, benefit: 'Egg-based protein meals', instant: 'egg' },
  { type: 'NON-VEG CLUB', label: 'Non-Veg Club', image: FOOD_IMAGES.nonVegThali, benefit: 'Chicken specials and homely meals', instant: 'non-veg' }
];

export const SecureCustomerMobileView: React.FC = () => {
  const cms = useCms();
  const { payment, pricing, menus, banners, siteSettings } = cms;
  const { subscriptions, setIsRegistrationOpen, setSelectedPackageForRegistration, setIsInstantOrderOpen, setPreselectedThaliType, setIsWeeklyMenuOpen, setSelectedMenuTab } = useApp();
  const [tab, setTab] = useState<Tab>('home');
  const [day, setDay] = useState<DayName>('Monday');
  const [meal, setMeal] = useState<MealSlot>('lunch');
  const [diet, setDiet] = useState<Diet>('veg');
  const [bannerIndex, setBannerIndex] = useState(0);

  const tracking = getLastOrderTracking();
  const activeSub = useMemo(() => getCustomerSubscription(subscriptions, tracking?.phone || ''), [subscriptions, tracking?.phone]);
  const daysRemaining = activeSub ? getDaysRemaining(activeSub.expiryDate) : 0;
  const customerName = activeSub?.customerName || 'Guest Customer';
  const packageType: PackageType = diet === 'veg' ? 'VEG CLASSIC' : diet === 'egg' ? 'EGG DELIGHT' : 'NON-VEG CLUB';
  const menu = menus[packageType] || [];
  const selectedDayMenu = menu.find(item => item.day === day) || menu[0];
  const currentMeal = selectedDayMenu ? (meal === 'lunch' ? selectedDayMenu.lunch : selectedDayMenu.dinner) : null;
  const activeBanners = banners.filter(b => b.active);
  const banner = activeBanners[bannerIndex] || activeBanners[0];
  const monthlyPrice = (type: PackageType) => type === 'VEG CLASSIC' ? pricing.vegMonthly : type === 'EGG DELIGHT' ? pricing.eggMonthly : pricing.nonVegMonthly;
  const instantPrice = (type: Diet) => type === 'veg' ? pricing.vegThaliInstant : type === 'egg' ? pricing.eggThaliInstant : pricing.nonVegThaliInstant;
  const selectedPlan = PLAN_META.find(p => p.type === packageType) || PLAN_META[0];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayMenu = menus['VEG CLASSIC']?.find(item => item.day === today) || menus['VEG CLASSIC']?.[0];

  useEffect(() => {
    if (activeBanners.length < 2) return;
    const timer = window.setInterval(() => setBannerIndex(index => (index + 1) % activeBanners.length), 5000);
    return () => window.clearInterval(timer);
  }, [activeBanners.length]);

  useEffect(() => {
    if (activeBanners.length && bannerIndex >= activeBanners.length) setBannerIndex(0);
  }, [activeBanners.length, bannerIndex]);

  const openInstant = (type: ThaliType) => {
    setDiet(type === 'non-veg' ? 'non-veg' : type);
    setPreselectedThaliType(type);
    setIsInstantOrderOpen(true);
  };
  const openSubscription = (type: PackageType) => { setSelectedPackageForRegistration(type); setIsRegistrationOpen(true); };
  const openMenu = (type: PackageType) => { setSelectedMenuTab(type); setIsWeeklyMenuOpen(true); };
  const renderImage = (src: string, alt: string, className: string) => <img src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" className={className} onError={e => { e.currentTarget.style.display = 'none'; }} />;

  return (
    <div className="min-h-full bg-[#F8F5EF] text-[#17231B] pb-20">
      <header className="sticky top-0 z-40 bg-[#073D27] text-white shadow-lg">
        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
          <button onClick={() => setTab('home')} className="flex items-center gap-2.5 min-w-0 text-left">
            {siteSettings.logo_url ? renderImage(siteSettings.logo_url, 'Bring My Bite logo', 'h-10 w-10 rounded-xl object-cover bg-[#D69A20]') : <div className="h-10 w-10 rounded-xl bg-[#D69A20] text-black font-black flex items-center justify-center text-xs">BM</div>}
            <div className="min-w-0"><div className="text-[9px] uppercase tracking-[0.16em] text-emerald-200">{siteSettings.tagline || 'Homely Tiffin Service'}</div><div className="text-sm font-extrabold truncate">{siteSettings.business_name || 'Bring My Bite'}</div></div>
          </button>
          <a href={`tel:${siteSettings.phone || payment.phone}`} className="shrink-0 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-extrabold text-[#F2C94C] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Call</a>
        </div>
      </header>

      <main className="space-y-5 p-3.5">
        {tab === 'home' && <>
          <section className="relative overflow-hidden rounded-3xl bg-[#0C3822] text-white shadow-xl border border-[#C88A24]/70">
            {banner ? renderImage(banner.image_url || FOOD_IMAGES.instantTiffin, banner.image_alt || banner.title, 'absolute inset-0 h-full w-full object-cover opacity-70') : renderImage(FOOD_IMAGES.instantTiffin, 'Fresh Bring My Bite thali', 'absolute inset-0 h-full w-full object-cover opacity-70')}
            <div className="absolute inset-0 bg-gradient-to-r from-[#061D11]/95 via-[#0C3822]/70 to-black/15" />
            <div className="relative min-h-[365px] flex flex-col justify-end p-5">
              <div className="max-w-[86%]">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F2C94C] px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#3E2B06]"><Sparkles className="w-3 h-3" /> {banner?.tag || 'Freshly prepared every day'}</div>
                <h1 className="mt-3 text-3xl leading-tight font-black font-serif-title">{banner?.title || 'Homely Food. Delivered with Care.'}</h1>
                <p className="mt-2 text-xs leading-5 text-white/85">{banner?.description || 'Fresh, hygienic tiffin meals for students and working professionals.'}</p>
                <div className="mt-4 flex gap-2"><button onClick={() => openInstant((banner?.thali_key || 'veg') as ThaliType)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F2C94C] px-3 py-3 text-[10px] font-black text-[#14311F]">Order Today <ArrowRight className="h-3.5 w-3.5" /></button><button onClick={() => openSubscription((banner?.package_key || 'VEG CLASSIC') as PackageType)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/15 px-3 py-3 text-[10px] font-black text-white backdrop-blur border border-white/25">Subscribe</button></div>
              </div>
              {activeBanners.length > 1 && <div className="mt-5 flex items-center gap-1.5">{activeBanners.map((b, i) => <button key={b.id} aria-label={`Show banner ${i + 1}`} onClick={() => setBannerIndex(i)} className={`h-1.5 rounded-full transition-all ${i === bannerIndex ? 'w-7 bg-[#F2C94C]' : 'w-1.5 bg-white/50'}`} />)}</div>}
            </div>
            {activeBanners.length > 1 && <div className="absolute right-3 top-3 flex gap-1"><button aria-label="Previous banner" onClick={() => setBannerIndex(i => (i - 1 + activeBanners.length) % activeBanners.length)} className="rounded-full bg-black/30 p-1.5"><ChevronLeft className="h-4 w-4" /></button><button aria-label="Next banner" onClick={() => setBannerIndex(i => (i + 1) % activeBanners.length)} className="rounded-full bg-black/30 p-1.5"><ChevronRight className="h-4 w-4" /></button></div>}
          </section>

          <section className="grid grid-cols-3 gap-2.5"><button onClick={() => setTab('menu')} className="rounded-2xl bg-white border border-[#E5DAC6] p-3 text-center shadow-sm"><Calendar className="mx-auto w-5 h-5 text-[#124E33]"/><span className="mt-1.5 block text-[10px] font-black">7-Day Menu</span></button><button onClick={() => setTab('instant')} className="rounded-2xl bg-white border border-[#E5DAC6] p-3 text-center shadow-sm"><Zap className="mx-auto w-5 h-5 text-[#C88A24]"/><span className="mt-1.5 block text-[10px] font-black">Order Today</span></button><button onClick={() => setTab('profile')} className="rounded-2xl bg-white border border-[#E5DAC6] p-3 text-center shadow-sm"><User className="mx-auto w-5 h-5 text-[#124E33]"/><span className="mt-1.5 block text-[10px] font-black">My Profile</span></button></section>

          {activeSub && <section className="rounded-2xl bg-white border border-[#E5DAC6] p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><div><div className="text-[9px] font-black uppercase tracking-widest text-[#C88A24]">Your active plan</div><h2 className="mt-1 text-lg font-black text-[#0C3822]">{customerName}</h2><p className="mt-0.5 text-[10px] text-gray-500">{activeSub.packageType} • {activeSub.mealPreference}</p></div><div className="rounded-xl bg-[#0C3822] px-3 py-2 text-center text-white"><div className="text-lg font-black text-[#F2C94C]">{Math.max(daysRemaining, 0)}</div><div className="text-[8px] font-bold uppercase">days left</div></div></div></section>}

          <section className="overflow-hidden rounded-2xl bg-white border border-[#E5DAC6] shadow-sm"><div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100"><div><div className="text-[9px] font-black uppercase tracking-widest text-[#C88A24]">Live central menu</div><h2 className="mt-0.5 text-xl font-black text-[#0C3822] font-serif-title">Today's meal</h2></div><button onClick={() => setTab('menu')} className="text-[10px] font-black text-[#124E33]">Full menu →</button></div><div className="grid grid-cols-2 gap-3 p-3"><img src={FOOD_IMAGES.vegThali} alt="Today's meal" className="h-28 w-full rounded-xl object-cover" referrerPolicy="no-referrer"/><div className="rounded-xl bg-[#F8F5EF] p-3"><div className="text-[9px] font-black uppercase text-gray-400">Veg Classic</div><div className="mt-1 text-[10px] font-bold text-gray-800">{todayMenu?.lunch?.dal || 'Fresh dal'} • {todayMenu?.lunch?.dryVeg || 'Seasonal sabzi'}</div><div className="mt-2 text-[10px] text-gray-600">{todayMenu?.lunch?.rice || 'Rice'} • {todayMenu?.lunch?.foilPacked || 'Freshly packed'}</div><button onClick={() => openInstant('veg')} className="mt-3 rounded-lg bg-[#124E33] px-3 py-2 text-[9px] font-black text-white">Order Today</button></div></div></section>

          <section><div className="flex items-end justify-between gap-2 mb-3"><div><div className="text-[9px] font-black uppercase tracking-widest text-[#C88A24]">Choose your meal</div><h2 className="mt-0.5 text-xl font-black text-[#0C3822] font-serif-title">Monthly Plans</h2></div></div><div className="space-y-3">{PLAN_META.map(plan => <article key={plan.type} className="overflow-hidden rounded-2xl bg-white border border-[#E5DAC6] shadow-sm"><div className="flex min-h-[126px]"><img src={plan.image} alt={plan.label} className="w-[38%] object-cover" referrerPolicy="no-referrer"/><div className="flex-1 p-3.5"><div className="flex items-start justify-between gap-2"><div><h3 className="text-base font-black text-[#0C3822]">{plan.label}</h3><p className="mt-0.5 text-[10px] text-gray-500">{plan.benefit}</p></div><div className="text-right shrink-0"><div className="text-lg font-black text-[#124E33]">₹{monthlyPrice(plan.type).toLocaleString('en-IN')}</div><div className="text-[8px] font-bold text-gray-400">/ month</div></div></div><div className="mt-2 text-[9px] font-bold text-gray-600"><span className="text-emerald-600">✓</span> 13 meals/week • Convenient delivery</div><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => openSubscription(plan.type)} className="rounded-xl bg-[#124E33] py-2.5 text-[10px] font-black text-white">Subscribe</button><button onClick={() => openMenu(plan.type)} className="rounded-xl border border-gray-200 py-2.5 text-[10px] font-black text-[#124E33]">See Menu</button></div></div></div></article>)}</div></section>

          <section className="overflow-hidden rounded-2xl bg-[#124E33] text-white shadow-sm"><div className="grid grid-cols-[1fr_100px] items-stretch"><div className="p-4"><div className="text-[9px] font-black uppercase tracking-widest text-[#F2C94C]">Fresh & convenient</div><h2 className="mt-1 text-lg font-black">A better meal routine.</h2><div className="mt-3 space-y-1.5 text-[10px] text-emerald-100"><div className="flex gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#F2C94C]"/> Hygienic packing</div><div className="flex gap-1.5"><Clock3 className="h-3.5 w-3.5 text-[#F2C94C]"/> Fresh daily preparation</div><div className="flex gap-1.5"><Flame className="h-3.5 w-3.5 text-[#F2C94C]"/> Simple ordering</div></div></div><img src={FOOD_IMAGES.deliveryGate} alt="Food delivery" className="h-full w-full object-cover" referrerPolicy="no-referrer"/></div></section>
        </>}

        {tab === 'menu' && <section className="space-y-3"><div className="flex items-center justify-between"><div><div className="text-[9px] font-black uppercase tracking-widest text-[#C88A24]">7-day menu</div><h2 className="text-2xl font-black text-[#0C3822] font-serif-title">What are we serving?</h2></div><button onClick={() => setTab('home')} className="rounded-full bg-white p-2 border"><Home className="h-4 w-4"/></button></div><div className="flex gap-1.5 overflow-x-auto pb-1">{DAYS.map(d => <button key={d} onClick={() => setDay(d)} className={`px-3.5 py-2 rounded-xl text-[10px] font-black shrink-0 ${day === d ? 'bg-[#0B4029] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>{d.slice(0,3)}</button>)}</div><div className="grid grid-cols-2 gap-2"><button onClick={() => setMeal('lunch')} className={`py-2.5 rounded-xl text-xs font-black ${meal === 'lunch' ? 'bg-[#0B4029] text-white' : 'bg-white border'}`}>☀️ Lunch</button><button onClick={() => setMeal('dinner')} className={`py-2.5 rounded-xl text-xs font-black ${meal === 'dinner' ? 'bg-[#0B4029] text-white' : 'bg-white border'}`}>🌙 Dinner</button></div><div className="flex gap-2">{([['veg','Veg','🥗'],['egg','Egg','🥚'],['non-veg','Chicken','🍗']] as const).map(([d,label,emoji]) => <button key={d} onClick={() => setDiet(d)} className={`px-3 py-1.5 rounded-full text-[10px] font-black ${diet === d ? 'bg-[#C88A24] text-black' : 'bg-white border'}`}>{emoji} {label}</button>)}</div><div className="overflow-hidden rounded-3xl bg-white border border-[#E7DED0] shadow-sm"><div className="h-44 bg-[#EEE7DB]">{renderImage(selectedPlan.image, selectedPlan.label, 'h-full w-full object-cover')}</div><div className="p-4"><div className="flex justify-between gap-3"><div><div className="text-[9px] uppercase font-black text-[#C88A24]">{day} • {meal}</div><h3 className="mt-1 text-lg font-black font-serif-title">{selectedPlan.label}</h3></div><span className="font-black text-[#0B6A45]">{customerPriceLabel(instantPrice(diet))}</span></div>{currentMeal ? <div className="mt-4 grid grid-cols-2 gap-2">{[['Dal',currentMeal.dal],['Main',currentMeal.gravyOrNonVeg],['Sabzi',currentMeal.dryVeg],['Rice',currentMeal.rice],['Packing',currentMeal.foilPacked],['Extras',currentMeal.extras]].map(([label,value]) => <div key={label} className="rounded-xl bg-[#F8F5EF] p-2.5"><div className="text-[8px] font-black uppercase text-gray-400">{label}</div><div className="mt-1 text-[10px] font-bold text-gray-700">{value || 'As per menu'}</div></div>)}</div> : <p className="mt-4 text-xs text-gray-500">No meal configured for this slot yet.</p>}<button onClick={() => openInstant(selectedPlan.instant)} className="mt-4 w-full rounded-xl bg-[#0B4029] py-3 text-xs font-black text-white">Order This Thali • {customerPriceLabel(instantPrice(diet))}</button></div></div></section>}

        {tab === 'instant' && <section className="space-y-4"><div className="rounded-3xl bg-[#0B4029] p-5 text-white shadow-lg"><div className="text-[9px] font-black uppercase tracking-widest text-[#F4C64E]">Fresh meal today</div><h2 className="mt-1 text-2xl font-black font-serif-title">Order a Thali</h2><p className="mt-1 text-xs text-emerald-100">Live prices from the central CMS. Choose your meal and continue to order.</p></div>{PLAN_META.map(p => { const price = p.type === 'VEG CLASSIC' ? pricing.vegThaliInstant : p.type === 'EGG DELIGHT' ? pricing.eggThaliInstant : pricing.nonVegThaliInstant; return <article key={p.type} className="overflow-hidden rounded-2xl bg-white border border-[#E7DED0] shadow-sm"><div className="h-32">{renderImage(p.image,p.label,'h-full w-full object-cover')}</div><div className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-black font-serif-title">{p.label.replace('Classic','Thali').replace('Delight','Thali').replace('Club','Thali')}</h3><p className="text-[10px] text-gray-500 mt-0.5">{p.benefit} • Freshly packed</p></div><span className="text-lg font-black text-[#0B6A45]">{customerPriceLabel(price)}</span></div><button onClick={() => openInstant(p.instant)} className="mt-3 w-full rounded-xl bg-[#C88A24] py-3 text-xs font-black text-black">Order Now <ArrowRight className="inline h-3.5 w-3.5" /></button></div></article>; })}<div className="rounded-2xl bg-white border p-4"><div className="flex items-center gap-2"><QrCode className="h-5 w-5 text-[#0B4029]"/><div><div className="text-xs font-black">Secure payment</div><div className="text-[9px] text-gray-500">UPI details are controlled from the central CMS.</div></div></div></div></section>}

        {tab === 'profile' && <section className="space-y-4"><div className="rounded-3xl bg-[#0B4029] p-5 text-white shadow-lg"><div className="text-[9px] font-black uppercase tracking-widest text-emerald-200">Customer profile</div><h2 className="mt-1 text-2xl font-black font-serif-title text-[#F4C64E]">{customerName}</h2>{activeSub ? <><p className="mt-2 text-xs text-emerald-100">{activeSub.packageType} • {activeSub.mealPreference}</p><div className="mt-3 inline-flex rounded-full bg-[#F4C64E] px-3 py-1 text-[9px] font-black text-black">{daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Plan expired'}</div></> : <p className="mt-2 text-xs text-emerald-100">No monthly plan is linked to this device.</p>}</div>{activeSub ? <div className="rounded-2xl bg-white border p-4 space-y-3"><div className="flex justify-between text-xs"><span className="text-gray-500">Mobile</span><b>{activeSub.mobileNumber}</b></div><div className="flex justify-between text-xs"><span className="text-gray-500">Delivery</span><b>{activeSub.lunchDeliveryPoint || 'Registered point'}</b></div><div className="flex justify-between text-xs"><span className="text-gray-500">Route</span><b>{activeSub.routeCode || 'Assigned'}</b></div><button onClick={() => setIsRegistrationOpen(true)} className="w-full rounded-xl bg-[#0B4029] py-3 text-xs font-black text-white">View / Renew Plan</button></div> : <button onClick={() => openSubscription('VEG CLASSIC')} className="w-full rounded-xl bg-[#0B4029] py-3 text-xs font-black text-white">Register Monthly Plan</button>}<div className="rounded-2xl bg-white border p-4"><div className="flex items-center gap-2"><User className="h-5 w-5 text-[#C88A24]"/><div><div className="text-xs font-black">Need help?</div><div className="text-[9px] text-gray-500">Call us for delivery, subscription or order support.</div></div></div><a href={`tel:${siteSettings.phone || payment.phone}`} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0B4029] py-2.5 text-xs font-black text-[#0B4029]"><Phone className="h-3.5 w-3.5"/> Call Support</a></div></section>}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-950 bg-[#073D27] px-2 py-2 text-white shadow-[0_-6px_20px_rgba(0,0,0,.14)]"><div className="mx-auto flex max-w-xl items-center justify-around">{([['home','Home',Home],['menu','Menu',Calendar],['instant','Order',Zap],['profile','Profile',User]] as const).map(([key,label,Icon]) => <button key={key} onClick={() => setTab(key)} className={`flex min-w-[64px] flex-col items-center gap-1 py-1 text-[10px] font-black ${tab === key ? 'text-[#F4C64E]' : 'text-emerald-200'}`}><Icon className="h-5 w-5"/>{label}</button>)}</div></nav>
    </div>
  );
};
