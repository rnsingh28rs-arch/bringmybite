import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PackageType, CustomerCategory, MealPreference, SubscriptionDuration, PaymentMethod } from '../../types';
import { PaymentDetailsCard } from '../common/PaymentDetailsCard';
import { useCms } from '../../cms/CmsContext';
import { X, CheckCircle, GraduationCap, Briefcase, User, ShieldCheck, QrCode, Sparkles, MapPin, Locate, Gift, Printer, Calendar, Phone, Check, PartyPopper, CreditCard, Building2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { addStoredOrder, saveLastOrderTracking } from '../../utils/orderStore';

export const RegistrationModal: React.FC = () => {
  const { registrationFields, payment, banners } = useCms();
  const { isRegistrationOpen, setIsRegistrationOpen, selectedPackageForRegistration, setSelectedPackageForRegistration, addSubscription, referrals } = useApp();
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [category, setCategory] = useState<CustomerCategory>('College Student');
  const [collegeName, setCollegeName] = useState('');
  const [studentDeliveryPoint] = useState<'College Gate'>('College Gate');
  const [companyName, setCompanyName] = useState('');
  const [proDeliveryPoint, setProDeliveryPoint] = useState<'Office Gate' | 'Office Reception'>('Office Gate');
  const [homeAddress, setHomeAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  const [mapLocationUrl, setMapLocationUrl] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [referralCodeValid, setReferralCodeValid] = useState(false);
  const [packageType, setPackageType] = useState<PackageType>(selectedPackageForRegistration);
  const [mealPreference, setMealPreference] = useState<MealPreference>('Lunch + Dinner');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState<SubscriptionDuration>('1 Month');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [transactionId, setTransactionId] = useState('');
  const [paymentSlip, setPaymentSlip] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [registeredSub, setRegisteredSub] = useState<any | null>(null);

  useEffect(() => { setPackageType(selectedPackageForRegistration); }, [selectedPackageForRegistration]);
  useEffect(() => { setReferralCodeValid(referralCodeInput.trim().length >= 4); }, [referralCodeInput]);
  if (!isRegistrationOpen) return null;

  const selectedBanner = banners.find((b) => b.active && b.package_key === packageType);
  const configuredAmount = Number(String(selectedBanner?.highlight_price || '').replace(/[^0-9.]/g, '')) || 0;

  const getPackageCode = (pkg: PackageType): 'VC' | 'ED' | 'NVC' => pkg === 'VEG CLASSIC' ? 'VC' : pkg === 'EGG DELIGHT' ? 'ED' : 'NVC';

  const handleDetectGPS = () => {
    if (!navigator.geolocation) { alert('Geolocation is not supported by your browser. Please paste your Google Maps link directly.'); return; }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude.toFixed(6), lng = position.coords.longitude.toFixed(6);
      setMapLocationUrl(`https://www.google.com/maps?q=${lat},${lng}`); setIsLocating(false); setLocationSuccess(true); setTimeout(() => setLocationSuccess(false), 3000);
    }, () => { setIsLocating(false); alert('Could not retrieve current location. Please paste your Google Maps link manually.'); }, { timeout: 10000, enableHighAccuracy: true });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => { const img = new Image(); img.onload = () => { const max = 900, scale = Math.min(1, max / Math.max(img.width, img.height)); const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(img.width * scale)); canvas.height = Math.max(1, Math.round(img.height * scale)); canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height); setPaymentSlip(canvas.toDataURL('image/jpeg', 0.72)); }; img.src = String(event.target?.result || ''); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobileNumber.trim()) { alert('Please enter your Full Name and Mobile Number.'); return; }
    if (!transactionId.trim()) { alert('Please enter the UTR / transaction reference.'); return; }
    if (!paymentSlip) { alert('Please attach the payment screenshot / receipt.'); return; }
    if (category === 'College Student' && !collegeName.trim()) { alert('Please enter your College Name for gate delivery.'); return; }
    if (category === 'Working Professional' && !companyName.trim()) { alert('Please enter your Company / Office Name for gate delivery.'); return; }
    const activeCustomFields = registrationFields.filter((f) => f.active && !['customerName','mobileNumber','whatsappNumber','category','collegeName','companyName','houseFlatNo','streetArea','landmark','pinCode'].includes(f.field_key));
    for (const field of activeCustomFields) { if (field.required && !String(customFieldValues[field.field_key] || '').trim()) { alert(`Please enter ${field.label}.`); return; } }

    const sub = await addSubscription({
      customerName: fullName, mobileNumber, whatsappNumber: whatsappNumber || mobileNumber, category,
      collegeName: category === 'College Student' ? collegeName : undefined,
      lunchDeliveryPoint: category === 'College Student' ? studentDeliveryPoint : proDeliveryPoint,
      companyName: category === 'Working Professional' ? companyName : undefined,
      streetArea: homeAddress || (category === 'College Student' ? `${collegeName} Gate Area` : `${companyName} Vicinity`),
      pinCode: pinCode || '700091', mapLocationUrl: mapLocationUrl.trim() || undefined,
      referralCodeUsed: referralCodeInput.trim() || undefined, packageType, packageCode: getPackageCode(packageType),
      monthlyPrice: configuredAmount, mealPreference, startDate, duration, paymentMethod,
      transactionId: transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      amountPaid: configuredAmount, paymentDate: new Date().toISOString().split('T')[0], customFields: customFieldValues
    });

    try {
      await addStoredOrder({ id: sub.id, kind: 'subscription', customerName: fullName, phone: mobileNumber, whatsapp: whatsappNumber || mobileNumber, planOrMeal: `${packageType} • ${duration} • ${mealPreference}`, amount: configuredAmount, utrNumber: transactionId.trim(), paymentSlip, paymentStatus: 'Pending Verification', status: 'Pending Verification', details: `${category} • ${collegeName || companyName || homeAddress || ''}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      saveLastOrderTracking({ id: sub.id, phone: mobileNumber });
    } catch (error) { console.error('Subscription payment proof persistence failed:', error); alert('Your payment proof could not be saved. Please check your connection and submit again.'); return; }
    try { confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } }); } catch {}
    setRegisteredSub(sub);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl w-full max-w-3xl shadow-2xl border-2 border-[#124E33] overflow-hidden flex flex-col max-h-[94vh]">
        <div className="bg-gradient-to-r from-[#124E33] via-[#1B5E20] to-[#0C3822] text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F2C94C] to-[#D99B26] text-black flex items-center justify-center font-black text-lg shadow-md">🍱</div><div><h2 className="text-lg sm:text-xl font-bold font-serif-title tracking-wide text-[#FAF7F2]">Monthly Subscription Registration</h2><p className="text-[11px] sm:text-xs text-emerald-200">Bring My Bite • Direct College & Office Gate Delivery</p></div></div>
          <button onClick={() => { setIsRegistrationOpen(false); setRegisteredSub(null); }} className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF7F2]">
          {registeredSub ? (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-600 shadow-md space-y-5 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle className="w-10 h-10" /></div>
              <div className="space-y-1"><span className="text-xs font-bold uppercase tracking-widest text-[#D99B26]">Subscription Submitted</span><h3 className="text-2xl font-extrabold text-[#124E33] font-serif-title">Welcome to Bring My Bite!</h3><p className="text-xs sm:text-sm text-gray-600">Your payment proof has been submitted and is currently under verification. Service activation starts after admin verification.</p></div>
              <div className="max-w-md mx-auto bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E1D5] text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-500 font-medium">Customer / Sub ID:</span><span className="font-mono font-bold text-[#124E33] text-sm">{registeredSub.id}</span></div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-500 font-medium">Selected Package:</span><span className="font-bold text-gray-800">{registeredSub.packageType} ({registeredSub.mealPreference})</span></div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-500 font-medium">Delivery Destination:</span><span className="font-bold text-gray-800">{registeredSub.lunchDeliveryPoint} ({registeredSub.collegeName || registeredSub.companyName || 'Registered Location'})</span></div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-500 font-medium">Start Date:</span><span className="font-bold text-gray-800">{registeredSub.startDate}</span></div>
                <div className="flex justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-500 font-medium">Total Paid:</span><span className="font-extrabold text-emerald-800 text-sm">₹{registeredSub.amountPaid.toLocaleString()}</span></div>
                <div className="flex justify-between pt-1"><span className="text-gray-500 font-medium">Bonus Feasts Included:</span><span className="font-bold text-[#D99B26]">2x Monthly (1st & 15th) 🎁</span></div>
                {registeredSub.referralCodeUsed && <div className="flex justify-between pt-1 border-t border-dashed border-amber-300 text-amber-800"><span className="font-semibold">Referrer Reward:</span><span className="font-bold">1 Full Week Complimentary Sweets Granted! 🍬</span></div>}
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 max-w-md mx-auto">📱 Live gate arrival notifications will be sent to <strong>+91 {registeredSub.whatsappNumber}</strong>.</div>
              <div className="flex items-center justify-center gap-3 pt-2"><button onClick={handlePrint} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-gray-300"><Printer className="w-3.5 h-3.5" />Print</button><button onClick={() => { setIsRegistrationOpen(false); setRegisteredSub(null); }} className="px-6 py-2 bg-[#124E33] hover:bg-[#0A2A1B] text-white rounded-xl text-xs font-bold shadow-md">Close</button></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white rounded-xl border border-[#E8E1D5] p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3"><Calendar className="w-4 h-4 text-[#124E33]" /><span className="text-xs font-bold uppercase tracking-wider text-gray-700">Subscription Plan</span></div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {(['VEG CLASSIC','EGG DELIGHT','NON-VEG CLUB'] as PackageType[]).map((pkg) => { const b=banners.find(x=>x.active&&x.package_key===pkg); return <button key={pkg} type="button" onClick={()=>setPackageType(pkg)} className={`p-3 rounded-xl border-2 ${packageType===pkg?'border-emerald-600 bg-emerald-50':'border-gray-200 bg-white'}`}><div className="text-xs font-bold">{pkg}</div><div className="text-lg font-extrabold text-emerald-800 mt-1">{b?.highlight_price || 'Price not set'}</div></button>; })}
                </div>
                <div className="grid grid-cols-3 gap-2"><label className="text-xs font-semibold text-gray-700">Duration<select value={duration} onChange={(e)=>setDuration(e.target.value as SubscriptionDuration)} className="mt-1 w-full border border-gray-300 rounded-lg p-2"><option>1 Month</option><option>3 Months</option><option>6 Months</option></select></label><div className="text-xs text-gray-500 flex items-end pb-2">Configured price: <strong className="text-gray-900 ml-1">{selectedBanner?.highlight_price || 'Price not set'}</strong></div></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-gray-700">Full Name<input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>
                <label className="text-xs font-semibold text-gray-700">Mobile Number<input value={mobileNumber} onChange={(e)=>setMobileNumber(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>
                <label className="text-xs font-semibold text-gray-700">WhatsApp Number<input value={whatsappNumber} onChange={(e)=>setWhatsappNumber(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>
                <label className="text-xs font-semibold text-gray-700">Category<select value={category} onChange={(e)=>setCategory(e.target.value as CustomerCategory)} className="mt-1 w-full border rounded-lg p-2"><option>College Student</option><option>Working Professional</option><option>Other</option></select></label>
                {category==='College Student' && <label className="text-xs font-semibold text-gray-700">College Name<input value={collegeName} onChange={(e)=>setCollegeName(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>}
                {category==='Working Professional' && <label className="text-xs font-semibold text-gray-700">Company / Office<input value={companyName} onChange={(e)=>setCompanyName(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>}
                <label className="text-xs font-semibold text-gray-700 sm:col-span-2">Delivery Address<input value={homeAddress} onChange={(e)=>setHomeAddress(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>
                <label className="text-xs font-semibold text-gray-700">PIN Code<input value={pinCode} onChange={(e)=>setPinCode(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>
              </div>
              <div className="flex justify-end"><button type="submit" className="px-6 py-3 rounded-xl bg-[#124E33] text-white font-bold">Submit Subscription</button></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const handlePrint = () => { window.print(); };