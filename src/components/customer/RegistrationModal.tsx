import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PackageType,
  CustomerCategory,
  MealPreference,
  SubscriptionDuration,
  PaymentMethod
} from '../../types';
import { PaymentDetailsCard } from '../common/PaymentDetailsCard';
import { useCms } from '../../cms/CmsContext';
import {
  X,
  CheckCircle,
  GraduationCap,
  Briefcase,
  User,
  ShieldCheck,
  QrCode,
  Sparkles,
  MapPin,
  Locate,
  Gift,
  Printer,
  Calendar,
  Phone,
  Check,
  PartyPopper,
  CreditCard,
  Building2,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RegistrationModal: React.FC = () => {
  const { registrationFields, payment } = useCms();
  const {
    isRegistrationOpen,
    setIsRegistrationOpen,
    selectedPackageForRegistration,
    setSelectedPackageForRegistration,
    pricing,
    addSubscription,
    referrals
  } = useApp();

  // Form State - Essential Information
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [category, setCategory] = useState<CustomerCategory>('College Student');

  // Delivery Destinations
  const [collegeName, setCollegeName] = useState('');
  const [studentDeliveryPoint] = useState<'College Gate'>('College Gate');

  const [companyName, setCompanyName] = useState('');
  const [proDeliveryPoint, setProDeliveryPoint] = useState<'Office Gate' | 'Office Reception'>('Office Gate');

  // Dinner & Home Address
  const [homeAddress, setHomeAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});

  // Map Link & GPS Location
  const [mapLocationUrl, setMapLocationUrl] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  // Referral System
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [referralCodeValid, setReferralCodeValid] = useState(false);

  // Plan Selection
  const [packageType, setPackageType] = useState<PackageType>(selectedPackageForRegistration);
  const [mealPreference, setMealPreference] = useState<MealPreference>('Lunch + Dinner');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState<SubscriptionDuration>('1 Month');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [transactionId, setTransactionId] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);

  // Success State
  const [registeredSub, setRegisteredSub] = useState<any | null>(null);

  useEffect(() => {
    setPackageType(selectedPackageForRegistration);
  }, [selectedPackageForRegistration]);

  useEffect(() => {
    if (referralCodeInput.trim().length >= 4) {
      setReferralCodeValid(true);
    } else {
      setReferralCodeValid(false);
    }
  }, [referralCodeInput]);

  if (!isRegistrationOpen) return null;

  // Calculate monthly & total price
  const baseMonthlyPrice =
    packageType === 'VEG CLASSIC'
      ? pricing.vegMonthly
      : packageType === 'EGG DELIGHT'
      ? pricing.eggMonthly
      : pricing.nonVegMonthly;

  const multiplier = duration === '1 Month' ? 1 : duration === '3 Months' ? 3 : 6;
  const discountFactor = duration === '3 Months' ? 0.95 : duration === '6 Months' ? 0.90 : 1.0;
  const calculatedTotal = Math.round(baseMonthlyPrice * multiplier * discountFactor);

  const getPackageCode = (pkg: PackageType): 'VC' | 'ED' | 'NVC' => {
    if (pkg === 'VEG CLASSIC') return 'VC';
    if (pkg === 'EGG DELIGHT') return 'ED';
    return 'NVC';
  };

  // GPS Auto-detect handler
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please paste your Google Maps link directly.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
        setMapLocationUrl(mapsLink);
        setIsLocating(false);
        setLocationSuccess(true);
        setTimeout(() => setLocationSuccess(false), 3000);
      },
      (error) => {
        setIsLocating(false);
        alert('Could not retrieve current location. Please paste your Google Maps link manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !mobileNumber.trim()) {
      alert('Please enter your Full Name and Mobile Number.');
      return;
    }

    if (category === 'College Student' && !collegeName.trim()) {
      alert('Please enter your College Name for gate delivery.');
      return;
    }

    if (category === 'Working Professional' && !companyName.trim()) {
      alert('Please enter your Company / Office Name for gate delivery.');
      return;
    }

    const activeCustomFields = registrationFields.filter((f) => f.active && !['customerName','mobileNumber','whatsappNumber','category','collegeName','companyName','houseFlatNo','streetArea','landmark','pinCode'].includes(f.field_key));
    for (const field of activeCustomFields) {
      if (field.required && !String(customFieldValues[field.field_key] || '').trim()) {
        alert(`Please enter ${field.label}.`);
        return;
      }
    }

    const sub = addSubscription({
      customerName: fullName,
      mobileNumber,
      whatsappNumber: whatsappNumber || mobileNumber,
      category,
      collegeName: category === 'College Student' ? collegeName : undefined,
      lunchDeliveryPoint:
        category === 'College Student' ? studentDeliveryPoint : proDeliveryPoint,
      companyName: category === 'Working Professional' ? companyName : undefined,
      streetArea: homeAddress || (category === 'College Student' ? `${collegeName} Gate Area` : `${companyName} Vicinity`),
      pinCode: pinCode || '700091',
      mapLocationUrl: mapLocationUrl.trim() || undefined,
      referralCodeUsed: referralCodeInput.trim() || undefined,
      packageType,
      packageCode: getPackageCode(packageType),
      monthlyPrice: baseMonthlyPrice,
      mealPreference,
      startDate,
      duration,
      paymentMethod,
      transactionId: transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      amountPaid: calculatedTotal,
      paymentDate: new Date().toISOString().split('T')[0],
      customFields: customFieldValues
    });

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    setRegisteredSub(sub);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl w-full max-w-3xl shadow-2xl border-2 border-[#124E33] overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#124E33] via-[#1B5E20] to-[#0C3822] text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F2C94C] to-[#D99B26] text-black flex items-center justify-center font-black text-lg shadow-md">
              🍱
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif-title tracking-wide text-[#FAF7F2]">
                Monthly Subscription Registration
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-200">
                Bring My Bite • Direct College & Office Gate Delivery
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsRegistrationOpen(false);
              setRegisteredSub(null);
            }}
            className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF7F2]">
          
          {registeredSub ? (
            /* Success Slip */
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-600 shadow-md space-y-5 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D99B26]">
                  Registration Confirmed
                </span>
                <h3 className="text-2xl font-extrabold text-[#124E33] font-serif-title">
                  Welcome to Bring My Bite!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Your monthly plan is active. Onboarding details dispatched to your WhatsApp.
                </p>
              </div>

              {/* Summary Details */}
              <div className="max-w-md mx-auto bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E1D5] text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-500 font-medium">Customer / Sub ID:</span>
                  <span className="font-mono font-bold text-[#124E33] text-sm">{registeredSub.id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-500 font-medium">Selected Package:</span>
                  <span className="font-bold text-gray-800">{registeredSub.packageType} ({registeredSub.mealPreference})</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-500 font-medium">Delivery Destination:</span>
                  <span className="font-bold text-gray-800">{registeredSub.lunchDeliveryPoint} ({registeredSub.collegeName || registeredSub.companyName || 'Registered Location'})</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-500 font-medium">Start Date:</span>
                  <span className="font-bold text-gray-800">{registeredSub.startDate}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5">
                  <span className="text-gray-500 font-medium">Total Paid:</span>
                  <span className="font-extrabold text-emerald-800 text-sm">₹{registeredSub.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500 font-medium">Bonus Feasts Included:</span>
                  <span className="font-bold text-[#D99B26]">2x Monthly (1st & 15th) 🎁</span>
                </div>
                {registeredSub.referralCodeUsed && (
                  <div className="flex justify-between pt-1 border-t border-dashed border-amber-300 text-amber-800">
                    <span className="font-semibold">Referrer Reward:</span>
                    <span className="font-bold">1 Full Week Complimentary Sweets Granted! 🍬</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 max-w-md mx-auto">
                📱 Live gate arrival notifications will be sent to <strong>+91 {registeredSub.whatsappNumber}</strong>.
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-gray-300"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => {
                    setIsRegistrationOpen(false);
                    setRegisteredSub(null);
                  }}
                  className="px-6 py-2.5 bg-[#124E33] hover:bg-[#0C3822] text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Streamlined Essential Registration Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* 1. Essential Customer Info */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E1D5] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-[#124E33] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h3 className="font-bold text-sm text-[#0C3822] uppercase tracking-wide">
                    Essential Contact Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124E33] focus:ring-1 focus:ring-[#124E33] outline-hidden bg-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Mobile / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9820144321"
                      value={mobileNumber}
                      onChange={(e) => {
                        setMobileNumber(e.target.value);
                        if (!whatsappNumber) setWhatsappNumber(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124E33] focus:ring-1 focus:ring-[#124E33] outline-hidden bg-[#FAF7F2]"
                    />
                  </div>
                </div>

                {/* Customer Category */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5 text-xs">
                    I am a: <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['College Student', 'Working Professional', 'Other'] as CustomerCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`p-2.5 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                          category === cat
                            ? 'bg-[#124E33] text-white border-[#124E33] shadow-xs'
                            : 'bg-[#FAF7F2] text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {cat === 'College Student' && <GraduationCap className="w-3.5 h-3.5" />}
                        {cat === 'Working Professional' && <Briefcase className="w-3.5 h-3.5" />}
                        {cat === 'Other' && <User className="w-3.5 h-3.5" />}
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Gate & Location Details (With Map Link Option) */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E1D5] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#124E33] text-white flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <h3 className="font-bold text-sm text-[#0C3822] uppercase tracking-wide">
                      Delivery Location & Gate Specification
                    </h3>
                  </div>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    Punctual Handover
                  </span>
                </div>

                {category === 'College Student' ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        College Name & Campus <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Techno India / IIT / St. Xavier's College"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124E33] outline-hidden bg-[#FAF7F2]"
                      />
                    </div>
                    <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#124E33] block">Lunch Delivery Gate:</span>
                        <span className="text-gray-700">Delivered directly to the <strong>College Main Gate</strong></span>
                      </div>
                      <span className="text-xs bg-[#124E33] text-white px-2 py-1 rounded font-bold">
                        COLLEGE GATE
                      </span>
                    </div>
                  </div>
                ) : category === 'Working Professional' ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Company / Office Park Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Infosys Tower 2 / TCS Gitanjali Park / Wipro Gate 1"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124E33] outline-hidden bg-[#FAF7F2]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setProDeliveryPoint('Office Gate')}
                        className={`p-2.5 rounded-lg border text-xs font-bold ${
                          proDeliveryPoint === 'Office Gate'
                            ? 'bg-[#124E33] text-white border-[#124E33]'
                            : 'bg-[#FAF7F2] text-gray-700 border-gray-300'
                        }`}
                      >
                        🏢 Office Gate
                      </button>
                      <button
                        type="button"
                        onClick={() => setProDeliveryPoint('Office Reception')}
                        className={`p-2.5 rounded-lg border text-xs font-bold ${
                          proDeliveryPoint === 'Office Reception'
                            ? 'bg-[#124E33] text-white border-[#124E33]'
                            : 'bg-[#FAF7F2] text-gray-700 border-gray-300'
                        }`}
                      >
                        🛎️ Office Reception
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs">
                    <label className="block font-semibold text-gray-700 mb-1">
                      Delivery Location / Landmark <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Study Library Front Gate / Clinic Gate"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden bg-[#FAF7F2]"
                    />
                  </div>
                )}

                {/* Map Link / Live Location Option */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-gray-700 text-xs flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#124E33]" />
                      <span>Current Location Map Link (Optional for precise delivery):</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      disabled={isLocating}
                      className="text-[11px] font-bold text-[#124E33] hover:text-[#0C3822] flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition-colors"
                    >
                      <Locate className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>{isLocating ? 'Detecting...' : 'Use My GPS Location'}</span>
                    </button>
                  </div>

                  <input
                    type="url"
                    placeholder="e.g. https://maps.app.goo.gl/xyz or https://maps.google.com/..."
                    value={mapLocationUrl}
                    onChange={(e) => setMapLocationUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-hidden focus:border-[#124E33] bg-[#FAF7F2]"
                  />

                  {locationSuccess && (
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>GPS Coordinates captured & attached to your delivery profile!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Package Selection & Duration */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E1D5] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#124E33] text-white flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <h3 className="font-bold text-sm text-[#0C3822] uppercase tracking-wide">
                      Select Package & Duration
                    </h3>
                  </div>
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold">
                    13 Meals / Week
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Veg Classic */}
                  <div
                    onClick={() => setPackageType('VEG CLASSIC')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      packageType === 'VEG CLASSIC'
                        ? 'border-[#124E33] bg-emerald-50/60 shadow-xs'
                        : 'border-gray-200 bg-[#FAF7F2] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#124E33]">🥗 VEG CLASSIC</span>
                      <span className="text-xs font-extrabold text-[#124E33]">₹{pricing.vegMonthly}/mo</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1">100% Pure Veg • 18–22g Protein</p>
                  </div>

                  {/* Egg Delight */}
                  <div
                    onClick={() => setPackageType('EGG DELIGHT')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      packageType === 'EGG DELIGHT'
                        ? 'border-[#D99B26] bg-amber-50/60 shadow-xs'
                        : 'border-gray-200 bg-[#FAF7F2] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#A4670E]">🥚 EGG DELIGHT</span>
                      <span className="text-xs font-extrabold text-[#A4670E]">₹{pricing.eggMonthly}/mo</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1">Egg Curries & Bhurji • 20–24g Protein</p>
                  </div>

                  {/* Non-Veg Club */}
                  <div
                    onClick={() => setPackageType('NON-VEG CLUB')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      packageType === 'NON-VEG CLUB'
                        ? 'border-[#8B2626] bg-rose-50/60 shadow-xs'
                        : 'border-gray-200 bg-[#FAF7F2] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#8B2626]">🍗 NON-VEG CLUB</span>
                      <span className="text-xs font-extrabold text-[#8B2626]">₹{pricing.nonVegMonthly}/mo</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1">Chicken Curry 3pcs • 25–30g Protein</p>
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Meal Preference</label>
                    <select
                      value={mealPreference}
                      onChange={(e) => setMealPreference(e.target.value as MealPreference)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden bg-[#FAF7F2]"
                    >
                      <option value="Lunch + Dinner">Lunch + Dinner (Standard)</option>
                      <option value="Lunch Only">Lunch Only</option>
                      <option value="Dinner Only">Dinner Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value as SubscriptionDuration)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-hidden bg-[#FAF7F2]"
                    >
                      <option value="1 Month">1 Month (Standard)</option>
                      <option value="3 Months">3 Months (5% Savings)</option>
                      <option value="6 Months">6 Months (10% Savings)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* D-Admin configurable registration fields */}
              {registrationFields.filter((f) => f.active && !['customerName','mobileNumber','whatsappNumber','category','collegeName','companyName','houseFlatNo','streetArea','landmark','pinCode'].includes(f.field_key)).length > 0 && (
                <div className="bg-white rounded-xl border border-[#E8E1D5] p-4 sm:p-5 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#C88A24]" />
                    <h3 className="text-sm font-black text-[#124E33] uppercase tracking-wide">Additional Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {registrationFields.filter((f) => f.active && !['customerName','mobileNumber','whatsappNumber','category','collegeName','companyName','houseFlatNo','streetArea','landmark','pinCode'].includes(f.field_key)).map((field) => (
                      <label key={field.id} className="text-xs font-bold text-gray-700">
                        {field.label} {field.required && <span className="text-rose-600">*</span>}
                        {field.field_type === 'textarea' ? (
                          <textarea className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm min-h-24" placeholder={field.placeholder} value={customFieldValues[field.field_key] || ''} onChange={(e) => setCustomFieldValues((v) => ({ ...v, [field.field_key]: e.target.value }))} />
                        ) : field.field_type === 'select' ? (
                          <select className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" value={customFieldValues[field.field_key] || ''} onChange={(e) => setCustomFieldValues((v) => ({ ...v, [field.field_key]: e.target.value }))}>
                            <option value="">Select {field.label}</option>
                            {field.options.map((option) => <option key={option}>{option}</option>)}
                          </select>
                        ) : (
                          <input type={field.field_type === 'tel' ? 'tel' : field.field_type === 'email' ? 'email' : field.field_type === 'number' ? 'number' : field.field_type === 'date' ? 'date' : 'text'} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" placeholder={field.placeholder} value={customFieldValues[field.field_key] || ''} onChange={(e) => setCustomFieldValues((v) => ({ ...v, [field.field_key]: e.target.value }))} />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Referral Code & Bonus Offer Box */}
              <div className="bg-gradient-to-br from-[#FFF9E6] to-[#FFF3CD] p-4 rounded-xl border border-[#D99B26] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-[#1A261E] flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-[#D99B26]" />
                    <span>Have a Friend's Referral Code?</span>
                  </label>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-[#D99B26] text-black rounded-full">
                    Sweets Reward
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter friend's code (e.g. SWEET-AARAV101) or mobile"
                    value={referralCodeInput}
                    onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 border border-[#D99B26]/60 rounded-lg text-xs font-mono font-bold uppercase bg-white outline-hidden"
                  />
                </div>

                {referralCodeValid ? (
                  <div className="text-[11px] font-bold text-[#124E33] flex items-center gap-1.5 bg-emerald-50/90 p-2 rounded-lg border border-emerald-200">
                    <PartyPopper className="w-4 h-4 text-[#D99B26] shrink-0" />
                    <span>Referral linked! Your friend will receive 1 Full Week of Complimentary Sweets in their tiffin! 🍬</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-600">
                    Enter the referral code of any existing subscriber to reward them with 7 continuous days of fresh desserts.
                  </p>
                )}

                {/* 2x Monthly Bonus reminder */}
                <div className="pt-2 border-t border-[#D99B26]/30 text-[11px] text-[#124E33] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D99B26]" />
                  <span>2x Monthly Bonus Feasts (1st & 15th) automatically included in this subscription!</span>
                </div>
              </div>

              {/* 5. Payment & Fast Checkout */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E1D5] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#124E33] text-white flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <h3 className="font-bold text-sm text-[#0C3822] uppercase tracking-wide">
                      Payment & Confirmation
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-gray-500 block">Payable:</span>
                    <span className="text-lg font-black text-[#124E33]">
                      ₹{calculatedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5">Prepaid Payment Mode</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`flex-1 p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          paymentMethod === 'UPI' || paymentMethod === 'QR Code'
                            ? 'bg-[#124E33] text-white border-[#124E33] shadow-xs'
                            : 'bg-[#FAF7F2] text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#F2C94C]" />
                        <span>UPI / QR Code</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Bank Transfer')}
                        className={`flex-1 p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          paymentMethod === 'Bank Transfer'
                            ? 'bg-[#124E33] text-white border-[#124E33] shadow-xs'
                            : 'bg-[#FAF7F2] text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5 text-[#F2C94C]" />
                        <span>Axis NetBanking</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5">
                      Transaction UTR / Reference No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UPI Ref / Axis IMPS UTR"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-hidden focus:border-[#124E33] bg-[#FAF7F2] font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Official Bank Details & QR Component */}
                <PaymentDetailsCard
                  amount={calculatedTotal}
                  orderReference={`Sub-${packageType}-${duration}`}
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegistrationOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-black"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 bg-[#124E33] hover:bg-[#0C3822] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#F2C94C]" />
                  <span>Submit Registration & Subscribe (₹{calculatedTotal.toLocaleString()})</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
