import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PackageType, CustomerCategory, MealPreference, SubscriptionDuration, PaymentMethod } from '../../types';
import { PaymentDetailsCard } from '../common/PaymentDetailsCard';
import { useCms } from '../../cms/CmsContext';
import { X, CheckCircle, Printer, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { addStoredOrder, saveLastOrderTracking } from '../../utils/orderStore';

export const RegistrationModal: React.FC = () => {
  const { registrationFields } = useCms();
  const { isRegistrationOpen, setIsRegistrationOpen, selectedPackageForRegistration, addSubscription, pricing } = useApp();
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [category, setCategory] = useState<CustomerCategory>('College Student');
  const [collegeName, setCollegeName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  const [mapLocationUrl, setMapLocationUrl] = useState('');
  const [packageType, setPackageType] = useState<PackageType>(selectedPackageForRegistration);
  const [mealPreference] = useState<MealPreference>('Lunch + Dinner');
  const [startDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState<SubscriptionDuration>('1 Month');
  const [paymentMethod] = useState<PaymentMethod>('UPI');
  const [transactionId, setTransactionId] = useState('');
  const [paymentSlip, setPaymentSlip] = useState('');
  const [registeredSub, setRegisteredSub] = useState<any | null>(null);

  useEffect(() => { setPackageType(selectedPackageForRegistration); }, [selectedPackageForRegistration]);
  if (!isRegistrationOpen) return null;

  const baseMonthlyPrice = packageType === 'VEG CLASSIC' ? pricing.vegMonthly : packageType === 'EGG DELIGHT' ? pricing.eggMonthly : pricing.nonVegMonthly;
  const durationMultiplier = duration === '1 Month' ? 1 : duration === '3 Months' ? 3 : 6;
  const discountFactor = duration === '3 Months' ? 0.95 : duration === '6 Months' ? 0.90 : 1;
  const calculatedTotal = Math.round(baseMonthlyPrice * durationMultiplier * discountFactor);
  const discountLabel = duration === '3 Months' ? '5% multi-month discount' : duration === '6 Months' ? '10% multi-month discount' : '';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => { const img = new Image(); img.onload = () => { const max = 900, scale = Math.min(1, max / Math.max(img.width, img.height)); const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(img.width * scale)); canvas.height = Math.max(1, Math.round(img.height * scale)); canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height); setPaymentSlip(canvas.toDataURL('image/jpeg', 0.72)); }; img.src = String(event.target?.result || ''); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (baseMonthlyPrice <= 0) { alert('This subscription price is not configured. Please ask the administrator to configure the current rate.'); return; }
    if (!fullName.trim() || !mobileNumber.trim()) { alert('Please enter your Full Name and Mobile Number.'); return; }
    if (!transactionId.trim()) { alert(`Please pay ₹${calculatedTotal.toLocaleString()} and enter the UTR / transaction reference.`); return; }
    if (!paymentSlip) { alert('Please attach the payment screenshot / receipt.'); return; }
    if (category === 'College Student' && !collegeName.trim()) { alert('Please enter your College Name for gate delivery.'); return; }
    if (category === 'Working Professional' && !companyName.trim()) { alert('Please enter your Company / Office Name for gate delivery.'); return; }
    const activeCustomFields = registrationFields.filter((f) => f.active && !['customerName','mobileNumber','whatsappNumber','category','collegeName','companyName','houseFlatNo','streetArea','landmark','pinCode'].includes(f.field_key));
    for (const field of activeCustomFields) { if (field.required && !String(customFieldValues[field.field_key] || '').trim()) { alert(`Please enter ${field.label}.`); return; } }

    const sub = await addSubscription({
      customerName: fullName, mobileNumber, whatsappNumber: whatsappNumber || mobileNumber, category,
      collegeName: category === 'College Student' ? collegeName : undefined,
      lunchDeliveryPoint: category === 'College Student' ? 'College Gate' : 'Office Gate',
      companyName: category === 'Working Professional' ? companyName : undefined,
      streetArea: homeAddress || (category === 'College Student' ? `${collegeName} Gate Area` : `${companyName} Vicinity`),
      pinCode: pinCode || '700091', mapLocationUrl: mapLocationUrl.trim() || undefined,
      packageType, packageCode: packageType === 'VEG CLASSIC' ? 'VC' : packageType === 'EGG DELIGHT' ? 'ED' : 'NVC',
      monthlyPrice: baseMonthlyPrice, mealPreference, startDate, duration, paymentMethod,
      transactionId: transactionId.trim(), amountPaid: calculatedTotal, totalAmount: calculatedTotal,
      paymentDate: new Date().toISOString().split('T')[0], customFields: customFieldValues,
      durationMultiplier, discountFactor
    });

    try {
      await addStoredOrder({ id: sub.id, kind: 'subscription', customerName: fullName, phone: mobileNumber, whatsapp: whatsappNumber || mobileNumber, planOrMeal: `${packageType} • ${duration} • ${mealPreference}`, amount: calculatedTotal, utrNumber: transactionId.trim(), paymentSlip, paymentStatus: 'Pending Verification', status: 'Pending Verification', details: `${category} • ${collegeName || companyName || homeAddress || ''} • ${discountLabel || 'Standard monthly pricing'}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      saveLastOrderTracking({ id: sub.id, phone: mobileNumber });
    } catch (error) { console.error('Subscription payment proof persistence failed:', error); alert('Your payment proof could not be saved. Please check your connection and submit again.'); return; }
    try { confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } }); } catch {}
    setRegisteredSub(sub);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl w-full max-w-3xl shadow-2xl border-2 border-[#124E33] overflow-hidden flex flex-col max-h-[94vh]">
        <div className="bg-gradient-to-r from-[#124E33] via-[#1B5E20] to-[#0C3822] text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-900 shrink-0"><div><h2 className="text-lg sm:text-xl font-bold font-serif-title">Monthly Subscription Registration</h2><p className="text-[11px] sm:text-xs text-emerald-200">Select duration → pay the exact calculated amount → upload payment proof.</p></div><button onClick={() => { setIsRegistrationOpen(false); setRegisteredSub(null); }} className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800"><X className="w-6 h-6" /></button></div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF7F2]">
          {registeredSub ? (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-600 shadow-md space-y-5 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto"><CheckCircle className="w-10 h-10" /></div>
              <div><span className="text-xs font-bold uppercase tracking-widest text-[#D99B26]">Subscription Submitted</span><h3 className="text-2xl font-extrabold text-[#124E33]">Welcome to Bring My Bite!</h3><p className="text-xs sm:text-sm text-gray-600">Payment proof submitted for verification. Service activates after admin verification.</p></div>
              <div className="max-w-md mx-auto bg-[#FAF7F2] p-4 rounded-xl border text-left text-xs space-y-2">
                <div className="flex justify-between border-b pb-1.5"><span>Subscription:</span><strong>{registeredSub.packageType} • {registeredSub.duration}</strong></div>
                <div className="flex justify-between border-b pb-1.5"><span>Monthly rate:</span><strong>₹{Number(registeredSub.monthlyPrice || 0).toLocaleString()}</strong></div>
                <div className="flex justify-between border-b pb-1.5"><span>Amount paid:</span><strong className="text-emerald-800">₹{Number(registeredSub.amountPaid || 0).toLocaleString()}</strong></div>
                <div className="flex justify-between"><span>Meal plan:</span><strong>{registeredSub.mealPreference}</strong></div>
              </div>
              <div className="flex items-center justify-center gap-3"><button onClick={() => window.print()} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border"><Printer className="w-3.5 h-3.5" />Print</button><button onClick={() => { setIsRegistrationOpen(false); setRegisteredSub(null); }} className="px-6 py-2 bg-[#124E33] text-white rounded-xl text-xs font-bold">Close</button></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white rounded-xl border p-4 shadow-sm space-y-4">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#124E33]" /><span className="text-xs font-bold uppercase tracking-wider text-gray-700">Subscription Plan</span></div>
                <div className="grid grid-cols-3 gap-2">
                  {(['VEG CLASSIC','EGG DELIGHT','NON-VEG CLUB'] as PackageType[]).map((pkg) => { const price=pkg==='VEG CLASSIC'?pricing.vegMonthly:pkg==='EGG DELIGHT'?pricing.eggMonthly:pricing.nonVegMonthly; return <button key={pkg} type="button" onClick={()=>setPackageType(pkg)} className={`p-3 rounded-xl border-2 ${packageType===pkg?'border-emerald-600 bg-emerald-50':'border-gray-200 bg-white'}`}><div className="text-xs font-bold">{pkg}</div><div className="text-lg font-extrabold text-emerald-800 mt-1">₹{price.toLocaleString()}</div></button>; })}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"><label className="text-xs font-semibold text-gray-700">Duration<select value={duration} onChange={(e)=>setDuration(e.target.value as SubscriptionDuration)} className="mt-1 w-full border border-gray-300 rounded-lg p-2"><option>1 Month</option><option>3 Months</option><option>6 Months</option></select></label><div className="text-xs text-gray-500">Monthly rate<strong className="block text-gray-900 text-base">₹{baseMonthlyPrice.toLocaleString()}</strong></div><div className="text-xs text-gray-500">Total payable<strong className="block text-emerald-800 text-xl">₹{calculatedTotal.toLocaleString()}</strong>{discountLabel && <span className="text-emerald-700">{discountLabel}</span>}</div></div>
              </div>
              <PaymentDetailsCard amount={calculatedTotal} orderReference={`${packageType} • ${duration}`} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-gray-700">Full Name<input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>
                <label className="text-xs font-semibold text-gray-700">Mobile Number<input value={mobileNumber} onChange={(e)=>setMobileNumber(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>
                <label className="text-xs font-semibold text-gray-700">WhatsApp Number<input value={whatsappNumber} onChange={(e)=>setWhatsappNumber(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>
                <label className="text-xs font-semibold text-gray-700">Category<select value={category} onChange={(e)=>setCategory(e.target.value as CustomerCategory)} className="mt-1 w-full border rounded-lg p-2"><option>College Student</option><option>Working Professional</option><option>Other</option></select></label>
                {category==='College Student' && <label className="text-xs font-semibold text-gray-700">College Name<input value={collegeName} onChange={(e)=>setCollegeName(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>}
                {category==='Working Professional' && <label className="text-xs font-semibold text-gray-700">Company / Office<input value={companyName} onChange={(e)=>setCompanyName(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>}
                <label className="text-xs font-semibold text-gray-700">Address / Area<input value={homeAddress} onChange={(e)=>setHomeAddress(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>
                <label className="text-xs font-semibold text-gray-700">PIN Code<input value={pinCode} onChange={(e)=>setPinCode(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>
                <label className="text-xs font-semibold text-gray-700 sm:col-span-2">UTR / Transaction ID<input value={transactionId} onChange={e=>setTransactionId(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>
                <label className="text-xs font-semibold text-gray-700 sm:col-span-2">Payment Screenshot<input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 w-full border rounded-lg p-2" /></label>
              </div>
              <div className="flex justify-end"><button type="submit" className="px-6 py-3 rounded-xl bg-[#124E33] text-white font-bold">Pay ₹{calculatedTotal.toLocaleString()} & Submit Subscription</button></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
