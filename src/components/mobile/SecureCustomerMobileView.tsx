import React, { useMemo, useState } from 'react';
import { useApp, getDaysRemaining } from '../../context/AppContext';
import { useCms } from '../../cms/CmsContext';
import { getLastOrderTracking } from '../../utils/orderStore';
import { getCustomerSubscription, customerPriceLabel } from '../../utils/customerMobileAccess.mjs';
import { Calendar, Gift, MapPin, Phone, QrCode, User, Zap, ChevronRight } from 'lucide-react';

export const SecureCustomerMobileView: React.FC = () => {
  const { payment } = useCms();
  const { pricing, vegMenu, eggMenu, nonVegMenu, subscriptions, setIsRegistrationOpen, setIsInstantOrderOpen } = useApp();
  const [tab, setTab] = useState<'home' | 'menu' | 'instant' | 'profile'>('home');
  const [day, setDay] = useState<'Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday'|'Sunday'>('Monday');
  const [meal, setMeal] = useState<'lunch'|'dinner'>('lunch');
  const [diet, setDiet] = useState<'veg'|'egg'|'nonveg'>('veg');
  const tracking = getLastOrderTracking();
  const activeSub = useMemo(() => getCustomerSubscription(subscriptions, tracking?.phone || ''), [subscriptions, tracking?.phone]);
  const daysRemaining = activeSub ? getDaysRemaining(activeSub.expiryDate) : 0;
  const menu = diet === 'veg' ? vegMenu : diet === 'egg' ? eggMenu : nonVegMenu;
  const selected = menu.find(item => item.day === day) || menu[0];
  const currentMeal = selected ? (meal === 'lunch' ? selected.lunch : selected.dinner) : null;
  const instantPrice = diet === 'veg' ? pricing.vegThaliInstant : diet === 'egg' ? pricing.eggThaliInstant : pricing.nonVegThaliInstant;

  const customerName = activeSub?.customerName || 'Guest Customer';

  return (
    <div className="flex flex-col min-h-full bg-[#FAF7F2] text-[#1A261E] pb-2">
      <div className="sticky top-0 z-30 bg-[#0C3822] text-white px-4 pt-2 pb-3 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#C88A24] text-black font-black flex items-center justify-center text-xs shrink-0">BM</div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[10px] text-emerald-200"><MapPin className="w-3 h-3 text-[#F2C94C]"/><span>Salt Lake & New Town Hub</span></div>
              <div className="text-sm font-bold font-serif-title">Bring My Bite</div>
            </div>
          </div>
          <a href="tel:9315075165" className="px-2.5 py-1.5 bg-white/10 text-[#F2C94C] rounded-lg text-[10px] font-bold border border-white/20 flex items-center gap-1"><Phone className="w-3 h-3"/>Call</a>
        </div>
      </div>

      <main className="flex-1 p-3.5 space-y-4">
        {tab === 'home' && <>
          <section className="bg-gradient-to-br from-[#0C3822] to-[#124E33] text-white rounded-2xl p-4 border-2 border-[#C88A24] shadow-md">
            <div className="flex items-center justify-between gap-2">
              <div><div className="text-[10px] uppercase tracking-wider text-emerald-200">Customer Profile</div><h2 className="text-lg font-black font-serif-title text-[#F2C94C]">{customerName}</h2></div>
              {activeSub && <span className="text-[10px] font-black bg-[#C88A24] text-black px-2 py-1 rounded-full">{daysRemaining > 0 ? `${daysRemaining} Days Left` : 'Plan Expired'}</span>}
            </div>
            {activeSub ? <><p className="mt-1 text-[11px] text-emerald-100">{activeSub.packageType} • {activeSub.mealPreference}</p><p className="text-[10px] text-emerald-200 mt-1">Route: {activeSub.routeCode}</p></> : <p className="mt-2 text-xs text-emerald-100">No customer plan is linked to this device. Your private account details will appear after you register.</p>}
          </section>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setTab('menu')} className="bg-white p-3 rounded-2xl border border-gray-200 text-center"><Calendar className="w-5 h-5 mx-auto text-[#124E33]"/><span className="text-[10px] font-bold block mt-1">7-Day Menu</span></button>
            <button onClick={() => setTab('instant')} className="bg-white p-3 rounded-2xl border border-gray-200 text-center"><Zap className="w-5 h-5 mx-auto text-[#C88A24]"/><span className="text-[10px] font-bold block mt-1">Instant Thali</span></button>
            <button onClick={() => setTab('profile')} className="bg-white p-3 rounded-2xl border border-gray-200 text-center"><User className="w-5 h-5 mx-auto text-[#124E33]"/><span className="text-[10px] font-bold block mt-1">My Profile</span></button>
          </div>

          <section className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between"><div><div className="text-[10px] font-extrabold uppercase text-[#C88A24]">Live Menu</div><h3 className="text-base font-bold font-serif-title">Today's meal</h3></div><span className="text-sm font-black text-emerald-800">{customerPriceLabel(pricing.vegThaliInstant)}</span></div>
            <p className="text-xs text-gray-600 mt-2">{vegMenu[0]?.lunch?.dal || 'Fresh dal'} • {vegMenu[0]?.lunch?.dryVeg || 'Seasonal sabzi'} • {vegMenu[0]?.lunch?.rice || 'Rice'} • {vegMenu[0]?.lunch?.foilPacked || 'Freshly packed'}</p>
            <button onClick={() => setTab('menu')} className="mt-3 w-full py-2.5 bg-[#124E33] text-white rounded-xl text-xs font-bold">Open Live 7-Day Menu <ChevronRight className="inline w-3.5 h-3.5"/></button>
          </section>
        </>}

        {tab === 'menu' && <section className="space-y-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1">{(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] as const).map(d => <button key={d} onClick={() => setDay(d)} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold shrink-0 ${day===d?'bg-[#124E33] text-white':'bg-white border border-gray-200'}`}>{d.slice(0,3)}</button>)}</div>
          <div className="grid grid-cols-2 gap-2"><button onClick={()=>setMeal('lunch')} className={`py-2 rounded-xl text-xs font-bold ${meal==='lunch'?'bg-[#124E33] text-white':'bg-white border'}`}>☀️ Lunch</button><button onClick={()=>setMeal('dinner')} className={`py-2 rounded-xl text-xs font-bold ${meal==='dinner'?'bg-[#124E33] text-white':'bg-white border'}`}>🌙 Dinner</button></div>
          <div className="flex gap-2"><button onClick={()=>setDiet('veg')} className={`px-3 py-1 rounded-full text-xs font-bold ${diet==='veg'?'bg-emerald-600 text-white':'bg-white border'}`}>🥦 Veg</button><button onClick={()=>setDiet('egg')} className={`px-3 py-1 rounded-full text-xs font-bold ${diet==='egg'?'bg-amber-600 text-white':'bg-white border'}`}>🥚 Egg</button><button onClick={()=>setDiet('nonveg')} className={`px-3 py-1 rounded-full text-xs font-bold ${diet==='nonveg'?'bg-rose-600 text-white':'bg-white border'}`}>🍗 Chicken</button></div>
          <div className="bg-white rounded-2xl border p-4 space-y-3"><div className="flex justify-between"><div><div className="text-[10px] uppercase font-black text-[#C88A24]">{day} • {meal}</div><h3 className="font-bold font-serif-title">5-Compartment Homely Thali</h3></div><span className="font-black text-emerald-800">{customerPriceLabel(instantPrice)}</span></div>{currentMeal ? <div className="space-y-2 text-xs"><p><b>Dal:</b> {currentMeal.dal}</p><p><b>Sabzi:</b> {currentMeal.dryVeg}</p><p><b>Gravy / Main:</b> {currentMeal.gravyOrNonVeg}</p><p><b>Rice:</b> {currentMeal.rice}</p><p><b>Packing:</b> {currentMeal.foilPacked}</p><p><b>Extras:</b> {currentMeal.extras}</p></div> : <p className="text-xs text-gray-500">No meal configured for this slot yet.</p>}</div>
        </section>}

        {tab === 'instant' && <section className="space-y-3"><div className="bg-[#0C3822] text-white rounded-2xl p-4"><div className="text-[10px] text-[#F2C94C] font-black uppercase">Live Central Pricing</div><h3 className="text-base font-bold">Instant Thali</h3><p className="text-xs text-emerald-200 mt-1">Prices below are loaded from the central CMS database.</p></div>{[['Veg',pricing.vegThaliInstant],['Egg',pricing.eggThaliInstant],['Chicken',pricing.nonVegThaliInstant]].map(([name,price])=><button key={name} onClick={()=>setIsInstantOrderOpen(true)} className="w-full bg-white border rounded-2xl p-4 flex items-center justify-between text-left"><span className="font-bold text-sm">{name} Thali</span><span className="font-black text-emerald-800">{customerPriceLabel(price)}</span></button>)}<div className="bg-white rounded-2xl border p-4"><div className="text-xs text-gray-500">Payment UPI</div><div className="font-bold text-sm">{payment.upiId || 'Configured in CMS'}</div></div></section>}

        {tab === 'profile' && <section className="space-y-3"><div className="bg-white rounded-2xl border p-5"><User className="w-7 h-7 text-[#124E33]"/><div className="text-[10px] uppercase text-gray-500 font-bold mt-3">My Profile</div><h2 className="text-xl font-black text-[#124E33]">{customerName}</h2>{activeSub ? <div className="mt-3 text-xs space-y-1"><p><b>Mobile:</b> {activeSub.mobileNumber}</p><p><b>Plan:</b> {activeSub.packageType}</p><p><b>Meal:</b> {activeSub.mealPreference}</p><p><b>Delivery:</b> {activeSub.lunchDeliveryPoint || 'Registered delivery point'}</p></div> : <p className="text-xs text-gray-600 mt-2">No customer account is signed in on this device.</p>}</div><button onClick={()=>setIsRegistrationOpen(true)} className="w-full py-3 bg-[#124E33] text-white rounded-xl text-xs font-black">{activeSub ? 'View / Renew Plan' : 'Register Monthly Plan'}</button></section>}
      </main>

      <nav className="bg-[#0C3822] text-white border-t border-emerald-900 py-2 px-2 flex items-center justify-around shrink-0">
        <button onClick={()=>setTab('home')} className={`text-[10px] font-bold flex flex-col items-center gap-1 ${tab==='home'?'text-[#F2C94C]':'text-emerald-300'}`}><User className="w-4 h-4"/>Home</button>
        <button onClick={()=>setTab('menu')} className={`text-[10px] font-bold flex flex-col items-center gap-1 ${tab==='menu'?'text-[#F2C94C]':'text-emerald-300'}`}><Calendar className="w-4 h-4"/>Menu</button>
        <button onClick={()=>setTab('instant')} className={`text-[10px] font-bold flex flex-col items-center gap-1 ${tab==='instant'?'text-[#F2C94C]':'text-emerald-300'}`}><Zap className="w-4 h-4"/>Instant</button>
        <button onClick={()=>setTab('profile')} className={`text-[10px] font-bold flex flex-col items-center gap-1 ${tab==='profile'?'text-[#F2C94C]':'text-emerald-300'}`}><QrCode className="w-4 h-4"/>Profile</button>
      </nav>
    </div>
  );
};
