import React, { useState } from 'react';
import { useApp, getDaysRemaining } from '../../context/AppContext';
import { FOOD_IMAGES } from '../../assets/foodImages';
import { PaymentDetailsCard } from '../common/PaymentDetailsCard';
import { useCms } from '../../cms/CmsContext';
import {
  Home,
  Calendar,
  Zap,
  ShieldCheck,
  QrCode,
  User,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Gift,
  PartyPopper,
  Flame,
  Search,
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  Share2,
  Copy,
  Check,
  Navigation,
  RefreshCw,
  Award,
  Truck,
  Building2
} from 'lucide-react';

interface MobileAppViewProps {
  platform: 'ios' | 'android';
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({ platform }) => {
  const { payment } = useCms();
  const {
    mobileTab,
    setMobileTab,
    activeRole,
    setActiveRole,
    pricing,
    vegMenu,
    eggMenu,
    nonVegMenu,
    subscriptions,
    instantOrders,
    addInstantOrder,
    setIsRegistrationOpen,
    setIsInstantOrderOpen,
    setIsWeeklyMenuOpen,
    setIsReferralModalOpen,
    setIsBonusOffersModalOpen,
    setIsRenewalModalOpen,
    setSelectedSubscriptionForRenewal,
    setIsNativeAppModalOpen
  } = useApp();

  const isIos = platform === 'ios';

  // State for menu day and meal toggle
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedMealType, setSelectedMealType] = useState<'lunch' | 'dinner'>('lunch');
  const [selectedDiet, setSelectedDiet] = useState<'veg' | 'egg' | 'nonveg'>('veg');

  // Instant order mini state inside mobile view
  const [instantThali, setInstantThali] = useState<'veg' | 'egg' | 'non-veg'>('veg');
  const [instantGate, setInstantGate] = useState<string>('College / Office Main Gate');
  const [instantPlaced, setInstantPlaced] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Current active subscription
  const activeSub = subscriptions[0] || {
    id: 'BMB-CORP-101',
    customerName: 'TCS Gitanjali Park Account',
    packageType: 'VEG CLASSIC',
    deliverySlot: 'Both (Lunch + Dinner)',
    deliveryAddress: 'Gitanjali Park Campus, New Town',
    expiryDate: '2026-11-01',
    routeCode: 'VC-L01 / D01'
  };

  const daysRemaining = getDaysRemaining(activeSub.expiryDate);

  // Active day's menu schedule
  const activeMenuSchedule = (
    selectedDiet === 'veg' ? vegMenu : selectedDiet === 'egg' ? eggMenu : nonVegMenu
  ).find((d) => d.day === selectedDay) || vegMenu[0];

  const currentMealData =
    selectedMealType === 'lunch' ? activeMenuSchedule.lunch : activeMenuSchedule.dinner;

  const handleCopyPass = () => {
    navigator.clipboard.writeText(`BMB-PASS-${activeSub.id}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FAF7F2] text-[#1A261E] pb-20 select-none">
      
      {/* NATIVE APP TOP BAR */}
      <div className="sticky top-0 z-30 bg-[#0C3822] text-white pt-2 px-4 pb-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C88A24] text-black font-extrabold flex items-center justify-center text-xs shadow-xs">
              BM
            </div>
            <div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-200">
                <MapPin className="w-3 h-3 text-[#F2C94C]" />
                <span className="font-semibold truncate max-w-[190px]">Salt Lake & New Town Hub</span>
              </div>
              <h1 className="text-sm font-bold text-white leading-tight font-serif-title">
                Bring My Bite
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:9004848984"
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-[#F2C94C] rounded-lg text-[10px] font-bold border border-white/20 flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>Call Us</span>
            </a>
            <button
              onClick={() => setMobileTab('pass')}
              className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center text-white"
              title="View Digital Pass"
            >
              <QrCode className="w-4 h-4 text-[#F2C94C]" />
            </button>
          </div>
        </div>

        {/* Live Delivery Info Banner */}
        <div className="mt-2.5 bg-[#124E33] rounded-xl px-3 py-1.5 flex items-center justify-between border border-emerald-700/60 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-emerald-100 font-medium">
              🛵 Daily Fresh Delivery • <strong className="text-[#F2C94C]">Lunch 12:30 PM | Dinner 7:30 PM</strong>
            </span>
          </div>
          <a
            href="https://wa.me/919004848984"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-bold text-[#86efac] flex items-center gap-0.5"
          >
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="flex-1 p-3.5 space-y-4">
        
        {/* ==================== 1. HOME TAB ==================== */}
        {mobileTab === 'home' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Active Subscription Pass Mini Card */}
            <div className="bg-gradient-to-br from-[#0C3822] to-[#124E33] text-white rounded-2xl p-4 border-2 border-[#C88A24] shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#C88A24] text-black px-2 py-0.5 rounded-full">
                  Verified Monthly Plan
                </span>
                <span className="text-[11px] font-bold text-emerald-200">
                  {daysRemaining > 0 ? `${daysRemaining} Days Active` : 'Active'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif-title text-[#F2C94C]">
                    {activeSub.packageType}
                  </h3>
                  <p className="text-[11px] text-emerald-100">{activeSub.deliverySlot}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedSubscriptionForRenewal(activeSub as any);
                    setIsRenewalModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-[#C88A24] hover:bg-[#A97116] text-black font-extrabold text-xs rounded-xl shadow-xs"
                >
                  Manage Plan
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-3 w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#F2C94C] h-full rounded-full transition-all"
                  style={{ width: `${Math.max(20, Math.min(100, (daysRemaining / 90) * 100))}%` }}
                />
              </div>
            </div>

            {/* Quick 4-Grid Action Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setMobileTab('instant')}
                className="bg-white p-2.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col items-center justify-center text-center active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-1">
                  <Zap className="w-4 h-4 text-[#C88A24]" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 leading-tight">Instant Thali</span>
              </button>

              <button
                onClick={() => setMobileTab('menu')}
                className="bg-white p-2.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col items-center justify-center text-center active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1">
                  <Calendar className="w-4 h-4 text-[#124E33]" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 leading-tight">7-Day Menu</span>
              </button>

              <button
                onClick={() => setIsReferralModalOpen(true)}
                className="bg-white p-2.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col items-center justify-center text-center active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mb-1">
                  <Gift className="w-4 h-4 text-purple-700" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 leading-tight">Free Sweets</span>
              </button>

              <button
                onClick={() => setIsBonusOffersModalOpen(true)}
                className="bg-white p-2.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col items-center justify-center text-center active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center mb-1">
                  <PartyPopper className="w-4 h-4 text-rose-700" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 leading-tight">2x Feasts</span>
              </button>
            </div>

            {/* Today's Special Lunch Card with Real Food Image */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="relative h-36 w-full bg-gray-900">
                <img
                  src={FOOD_IMAGES.vegThali}
                  alt="Today's Lunch Thali"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#F2C94C] uppercase tracking-wider block">
                      ☀️ TODAY'S LIVE LUNCH
                    </span>
                    <h4 className="text-white text-base font-bold font-serif-title">
                      Royal 5CP Dal Tadka & Aloo Gobhi Thali
                    </h4>
                  </div>
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>🍛 Dal Tadka + Aloo Gobhi + 4 Rotis + Jeera Rice</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-emerald-700 font-extrabold text-sm">₹80</span>
                    <span className="text-[10px] text-gray-500">Single Box</span>
                  </div>

                  <button
                    onClick={() => setMobileTab('instant')}
                    className="px-3.5 py-1.5 bg-[#124E33] hover:bg-[#0A2A1B] text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs"
                  >
                    <span>Instant Order</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Subscription Tiers Mini Carousel */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                  Monthly Subscription Plans
                </h3>
                <button
                  onClick={() => setMobileTab('subscribe')}
                  className="text-xs font-bold text-[#124E33] flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {/* Veg */}
                <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                      <img src={FOOD_IMAGES.vegThali} alt="Veg" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Veg Classic Monthly</h4>
                      <p className="text-[10px] text-emerald-800 font-semibold">₹3,500 / Month • 5CP Tray</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileTab('subscribe');
                      setIsRegistrationOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#124E33] text-white text-[11px] font-bold rounded-xl"
                  >
                    Join
                  </button>
                </div>

                {/* Non-Veg */}
                <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                      <img src={FOOD_IMAGES.nonVegThali} alt="Non-Veg" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Non-Veg Club Monthly</h4>
                      <p className="text-[10px] text-rose-800 font-semibold">₹4,500 / Month • Chicken Curry</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileTab('subscribe');
                      setIsRegistrationOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#124E33] text-white text-[11px] font-bold rounded-xl"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== 2. MENU TAB ==================== */}
        {mobileTab === 'menu' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Day Selector Pill Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    selectedDay === day
                      ? 'bg-[#124E33] text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>

            {/* Diet & Meal Segmented Controls */}
            <div className="grid grid-cols-2 gap-2 bg-gray-200/70 p-1 rounded-xl">
              <button
                onClick={() => setSelectedMealType('lunch')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedMealType === 'lunch' ? 'bg-white text-[#124E33] shadow-xs' : 'text-gray-600'
                }`}
              >
                ☀️ Lunch
              </button>
              <button
                onClick={() => setSelectedMealType('dinner')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedMealType === 'dinner' ? 'bg-white text-[#124E33] shadow-xs' : 'text-gray-600'
                }`}
              >
                🌙 Dinner
              </button>
            </div>

            {/* Diet Filter Chips */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDiet('veg')}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  selectedDiet === 'veg' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700'
                }`}
              >
                🥦 Veg
              </button>
              <button
                onClick={() => setSelectedDiet('egg')}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  selectedDiet === 'egg' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-700'
                }`}
              >
                🥚 Egg
              </button>
              <button
                onClick={() => setSelectedDiet('nonveg')}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  selectedDiet === 'nonveg' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-700'
                }`}
              >
                🍗 Chicken
              </button>
            </div>

            {/* Selected Meal Schedule Details Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#C88A24] block">
                    {selectedDay} • {selectedMealType.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 font-serif-title">
                    5-Compartment Homely Thali
                  </h3>
                </div>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  {selectedDiet === 'veg' ? '₹80' : selectedDiet === 'egg' ? '₹100' : '₹110'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-gray-700 w-16 shrink-0">Dal:</span>
                  <span className="text-gray-900 font-medium">{currentMealData.dal}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-gray-700 w-16 shrink-0">Sabzi:</span>
                  <span className="text-gray-900 font-medium">{currentMealData.sabzi}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-gray-700 w-16 shrink-0">Breads:</span>
                  <span className="text-gray-900 font-medium">{currentMealData.rotis}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-gray-700 w-16 shrink-0">Rice:</span>
                  <span className="text-gray-900 font-medium">{currentMealData.rice}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-gray-700 w-16 shrink-0">Sides:</span>
                  <span className="text-gray-900 font-medium">{currentMealData.sides}</span>
                </div>
                {currentMealData.specialSweet && (
                  <div className="flex items-start gap-2 text-amber-800 font-bold bg-amber-50 p-2 rounded-xl border border-amber-200">
                    <span>🍬 Bonus Dessert:</span>
                    <span>{currentMealData.specialSweet}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setMobileTab('instant')}
                className="w-full py-2.5 bg-[#124E33] hover:bg-[#0A2A1B] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Order This Thali to Gate (45 Mins)</span>
              </button>
            </div>

          </div>
        )}

        {/* ==================== 3. INSTANT ORDER TAB ==================== */}
        {mobileTab === 'instant' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {instantPlaced ? (
              <div className="bg-white rounded-2xl p-5 border-2 border-emerald-600 shadow-md text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-gray-900 font-serif-title">
                  Prepaid Order Dispatched to Gate!
                </h3>
                <p className="text-xs text-gray-600">
                  Estimated Gate Arrival: <strong>40 Mins</strong>. 100% Prepaid via Axis Bank / UPI.
                </p>

                <div className="p-3 bg-emerald-50 rounded-xl text-xs text-left text-emerald-900 border border-emerald-200 space-y-1">
                  <div><strong>Meal:</strong> 1x {instantThali.toUpperCase()} Thali</div>
                  <div><strong>Gate Point:</strong> {instantGate}</div>
                  <div><strong>Payment:</strong> Verified Prepaid via Axis UPI ({payment.upiId})</div>
                  <div><strong>Delivery Captain:</strong> Ramesh Kumar (+91 9004848984)</div>
                </div>

                <button
                  onClick={() => setInstantPlaced(false)}
                  className="w-full py-2 bg-[#124E33] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Order Another Meal
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-[#0C3822] text-white p-3.5 rounded-2xl border border-emerald-800">
                  <span className="text-[10px] font-extrabold uppercase text-[#F2C94C] block">
                    45-MINUTE GATE DROP SERVICE • PREPAID ONLY
                  </span>
                  <h3 className="text-sm font-bold font-serif-title">
                    Instant Single Thali Checkout
                  </h3>
                </div>

                {/* Thali Variants */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setInstantThali('veg')}
                    className={`p-2 rounded-2xl border-2 text-center transition-all ${
                      instantThali === 'veg'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <div className="h-12 w-full rounded-lg overflow-hidden mb-1">
                      <img src={FOOD_IMAGES.vegThali} alt="Veg" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] block">Veg Thali</span>
                    <span className="text-xs text-emerald-700 font-black">₹{pricing.vegThaliInstant}</span>
                  </button>

                  <button
                    onClick={() => setInstantThali('egg')}
                    className={`p-2 rounded-2xl border-2 text-center transition-all ${
                      instantThali === 'egg'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <div className="h-12 w-full rounded-lg overflow-hidden mb-1">
                      <img src={FOOD_IMAGES.eggThali} alt="Egg" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] block">Egg Thali</span>
                    <span className="text-xs text-amber-700 font-black">₹{pricing.eggThaliInstant}</span>
                  </button>

                  <button
                    onClick={() => setInstantThali('non-veg')}
                    className={`p-2 rounded-2xl border-2 text-center transition-all ${
                      instantThali === 'non-veg'
                        ? 'border-rose-600 bg-rose-50 text-rose-950 font-bold shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <div className="h-12 w-full rounded-lg overflow-hidden mb-1">
                      <img src={FOOD_IMAGES.nonVegThali} alt="Chicken" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] block">Chicken</span>
                    <span className="text-xs text-rose-700 font-black">₹{pricing.nonVegThaliInstant}</span>
                  </button>
                </div>

                {/* Gate Selector */}
                <div className="bg-white p-3 rounded-2xl border border-gray-200 space-y-2 text-xs">
                  <label className="block font-bold text-gray-700">Select Campus Gate:</label>
                  <select
                    value={instantGate}
                    onChange={(e) => setInstantGate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none font-medium"
                  >
                    <option value="Heritage College Main Gate">Heritage Institute - Main Gate</option>
                    <option value="Techno India Gate 1">Techno India - Gate 1</option>
                    <option value="DLF 1 IT Park Reception">DLF 1 IT Park - Reception</option>
                    <option value="Ecospace Business Gate">Ecospace Business Gate</option>
                    <option value="Home Delivery Address">My Registered Home Address</option>
                  </select>
                </div>

                {/* Embedded Axis Bank & UPI Payment Details */}
                <PaymentDetailsCard
                  amount={instantThali === 'veg' ? pricing.vegThaliInstant : instantThali === 'egg' ? pricing.eggThaliInstant : pricing.nonVegThaliInstant}
                  orderReference={`MobileInstant-${instantThali}`}
                />

                {/* Place Order CTA */}
                <button
                  onClick={() => {
                    const price = instantThali === 'veg' ? pricing.vegThaliInstant : instantThali === 'egg' ? pricing.eggThaliInstant : pricing.nonVegThaliInstant;
                    addInstantOrder({
                      customerName: 'Rahul Sen (App User)',
                      customerPhone: '9004848984',
                      thaliType: instantThali,
                      thaliName: instantThali === 'veg' ? 'Veg Classic Thali' : instantThali === 'egg' ? 'Egg Delight Thali' : 'Chicken Thali',
                      quantity: 1,
                      unitPrice: price,
                      totalPrice: price,
                      mealSlot: 'Lunch',
                      deliveryCategory: 'College Student',
                      deliveryLocation: instantGate,
                      paymentMethod: 'UPI',
                      paymentStatus: 'Prepaid Verified'
                    });
                    setInstantPlaced(true);
                  }}
                  className="w-full py-3 bg-[#C88A24] hover:bg-[#A97116] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>
                    Confirm Prepaid Order (₹{instantThali === 'veg' ? pricing.vegThaliInstant : instantThali === 'egg' ? pricing.eggThaliInstant : pricing.nonVegThaliInstant})
                  </span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* ==================== 4. SUBSCRIBE TAB ==================== */}
        {mobileTab === 'subscribe' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="bg-[#0C3822] text-white p-3.5 rounded-2xl border border-emerald-800">
              <span className="text-[10px] font-extrabold uppercase text-[#F2C94C] block">
                MONTHLY TIFFIN CLUB
              </span>
              <h3 className="text-sm font-bold font-serif-title">
                Zero Cooking Hassle • Pure Ghar Ka Swaad
              </h3>
            </div>

            {/* 3 Full Subscription Package Tiers */}
            <div className="space-y-3">
              {/* Veg */}
              <div className="bg-white rounded-2xl p-4 border-2 border-emerald-600 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Most Popular for Students
                  </span>
                  <span className="text-sm font-black text-emerald-900">₹{pricing.vegMonthly}/mo</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 font-serif-title">VEG CLASSIC PLAN</h4>
                <p className="text-xs text-gray-600">5CP Homely Thali: Dal + Sabzi + 4 Rotis + Rice + Salad</p>
                <button
                  onClick={() => setIsRegistrationOpen(true)}
                  className="w-full py-2 bg-[#124E33] text-white text-xs font-bold rounded-xl"
                >
                  Subscribe Veg Plan
                </button>
              </div>

              {/* Egg */}
              <div className="bg-white rounded-2xl p-4 border-2 border-amber-600 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    High Protein Choice
                  </span>
                  <span className="text-sm font-black text-amber-900">₹{pricing.eggMonthly}/mo</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 font-serif-title">EGG DELIGHT PLAN</h4>
                <p className="text-xs text-gray-600">Egg Curry (2 Eggs) / Egg Bhurji + Dal + 4 Rotis + Rice</p>
                <button
                  onClick={() => setIsRegistrationOpen(true)}
                  className="w-full py-2 bg-[#C88A24] text-black text-xs font-bold rounded-xl"
                >
                  Subscribe Egg Plan
                </button>
              </div>

              {/* Non-Veg */}
              <div className="bg-white rounded-2xl p-4 border-2 border-rose-600 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                    Weekend Feast Special
                  </span>
                  <span className="text-sm font-black text-rose-900">₹{pricing.nonVegMonthly}/mo</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 font-serif-title">NON-VEG CLUB PLAN</h4>
                <p className="text-xs text-gray-600">Rich Chicken Curry + Dal Makhani + 4 Rotis + Jeera Rice</p>
                <button
                  onClick={() => setIsRegistrationOpen(true)}
                  className="w-full py-2 bg-[#0C3822] text-white text-xs font-bold rounded-xl"
                >
                  Subscribe Non-Veg Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. DIGITAL PASS TAB ==================== */}
        {mobileTab === 'pass' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Digital Student / Employee Gate Pass */}
            <div className="bg-gradient-to-br from-[#0C3822] to-[#124E33] text-white rounded-3xl p-5 border-2 border-[#D99B26] shadow-xl text-center space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F2C94C]">
                  CAMPUS TIFFIN VERIFICATION PASS
                </span>
                <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded-full font-mono text-emerald-200">
                  {activeSub.id}
                </span>
              </div>

              {/* QR Code Display */}
              <div className="bg-white p-3 rounded-2xl w-40 h-40 mx-auto shadow-md flex items-center justify-center border-2 border-[#C88A24]">
                <div className="w-full h-full bg-stone-900 rounded-xl flex flex-col items-center justify-center p-2 text-white text-center">
                  <QrCode className="w-20 h-20 text-[#F2C94C]" />
                  <span className="text-[9px] font-mono font-bold mt-1 text-emerald-200">SCAN AT GATE VAN</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#FAF7F2] font-serif-title">
                  {activeSub.customerName}
                </h3>
                <p className="text-xs text-emerald-200">{activeSub.packageType} • {activeSub.deliverySlot}</p>
                <p className="text-[11px] text-[#F2C94C] font-semibold mt-1">📍 {activeSub.routeCode}</p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleCopyPass}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1 border border-white/20"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Pass Copied' : 'Copy Pass ID'}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedSubscriptionForRenewal(activeSub as any);
                    setIsRenewalModalOpen(true);
                  }}
                  className="px-4 py-1.5 bg-[#C88A24] hover:bg-[#A97116] text-black font-extrabold text-xs rounded-xl shadow-xs"
                >
                  Renew Plan
                </button>
              </div>
            </div>

            {/* Referral Code Share Box */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                <Gift className="w-4 h-4 text-[#C88A24]" />
                <span>Earn 7 Days Free Sweets</span>
              </div>
              <p className="text-xs text-gray-600">
                Share your referral code <code className="font-bold text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded">RAHUL2026</code> with classmates.
              </p>
              <button
                onClick={() => setIsReferralModalOpen(true)}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-[#124E33] font-bold text-xs rounded-xl border border-emerald-300 flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share on WhatsApp & Track</span>
              </button>
            </div>

          </div>
        )}

        {/* ==================== 6. PORTAL TAB ==================== */}
        {mobileTab === 'portal' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="bg-[#0C3822] text-white p-3.5 rounded-2xl border border-emerald-800">
              <span className="text-[10px] font-extrabold uppercase text-[#F2C94C] block">
                OPERATIONS DASHBOARDS
              </span>
              <h3 className="text-sm font-bold font-serif-title">
                Switch Management Role
              </h3>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveRole('chef')}
                className="w-full p-3.5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between text-left hover:border-emerald-600 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900">👨‍🍳 Chef Kitchen Panel</h4>
                  <p className="text-[11px] text-gray-600">Live batch counting & ingredient indents</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => setActiveRole('manager')}
                className="w-full p-3.5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between text-left hover:border-emerald-600 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900">📋 Manager Operations Panel</h4>
                  <p className="text-[11px] text-gray-600">Pricing controls, stock alerts & menu editor</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => setActiveRole('admin')}
                className="w-full p-3.5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between text-left hover:border-emerald-600 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900">🛡️ Admin Executive Hub</h4>
                  <p className="text-[11px] text-gray-600">Revenue analytics, subscriber logs & exports</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => {
                  setActiveRole('customer');
                  setMobileTab('home');
                }}
                className="w-full p-3.5 bg-emerald-50 rounded-2xl border border-emerald-300 shadow-xs flex items-center justify-between text-left text-emerald-950 font-bold text-xs"
              >
                <span>Return to Customer View</span>
                <ChevronRight className="w-4 h-4 text-emerald-800" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
