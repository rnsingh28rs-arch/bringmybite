import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useCms } from '../../cms/CmsContext';
import { FOOD_IMAGES } from '../../assets/foodImages';
import { PaymentDetailsCard } from '../common/PaymentDetailsCard';
import confetti from 'canvas-confetti';
import { X, Zap, Minus, Plus, CheckCircle, Phone, Check } from 'lucide-react';
import { PaymentMethod } from '../../types';
import { addStoredOrder, saveLastOrderTracking } from '../../utils/orderStore';

export const InstantOrderModal: React.FC = () => {
  const { isInstantOrderOpen, setIsInstantOrderOpen, preselectedThaliType, addInstantOrder, pricing } = useApp();
  const { payment } = useCms();
  const [thaliType, setThaliType] = useState<'veg' | 'egg' | 'non-veg'>(preselectedThaliType);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [deliveryPointType, setDeliveryPointType] = useState<'college' | 'office' | 'home'>('college');
  const [locationDetail, setLocationDetail] = useState('');
  const [slot, setSlot] = useState<'Lunch' | 'Dinner'>('Lunch');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [transactionId, setTransactionId] = useState('');
  const [paymentSlip, setPaymentSlip] = useState('');
  const [mapLocationUrl, setMapLocationUrl] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  useEffect(() => { if (isInstantOrderOpen) setThaliType(preselectedThaliType); }, [isInstantOrderOpen, preselectedThaliType]);
  if (!isInstantOrderOpen) return null;

  const unitPrice = thaliType === 'veg' ? pricing.vegThaliInstant : thaliType === 'egg' ? pricing.eggThaliInstant : pricing.nonVegThaliInstant;
  const totalAmount = unitPrice * quantity;
  const thaliDisplayName = thaliType === 'veg' ? 'Veg Classic Thali' : thaliType === 'egg' ? 'Egg Delight Thali' : 'Chicken Non-Veg Thali (3 pcs)';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => { const img = new Image(); img.onload = () => { const max = 900, scale = Math.min(1, max / Math.max(img.width, img.height)); const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(img.width * scale)); canvas.height = Math.max(1, Math.round(img.height * scale)); canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height); setPaymentSlip(canvas.toDataURL('image/jpeg', 0.72)); }; img.src = String(event.target?.result || ''); };
    reader.readAsDataURL(file);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) { alert('Current location is not supported by this browser. Please enter your delivery location manually.'); return; }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition((position) => { const lat = position.coords.latitude.toFixed(6), lng = position.coords.longitude.toFixed(6); setMapLocationUrl(`https://www.google.com/maps?q=${lat},${lng}`); setIsLocating(false); }, () => { setIsLocating(false); alert('Could not get your current location. Please allow location permission and try again.'); }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (unitPrice <= 0) { alert('This thali price is not configured. Please ask the administrator to configure the current rate.'); return; }
    if (!customerName.trim() || !mobileNumber.trim() || !locationDetail.trim()) { alert('Please fill in your name, contact number, and delivery location.'); return; }
    if (!transactionId.trim()) { alert(`Please pay ₹${totalAmount.toLocaleString()} and enter the UTR / transaction reference.`); return; }
    if (!paymentSlip) { alert('Please attach the payment screenshot / receipt.'); return; }

    const order = addInstantOrder({ customerName, customerPhone: mobileNumber, thaliType, thaliName: thaliDisplayName, quantity, unitPrice, totalPrice: totalAmount, mealSlot: slot, deliveryCategory: deliveryPointType === 'college' ? 'College Student' : deliveryPointType === 'office' ? 'Working Professional' : 'Other', deliveryLocation: deliveryPointType === 'college' ? `College Gate: ${locationDetail}` : deliveryPointType === 'office' ? `Office Gate/Reception: ${locationDetail}` : `Home Address: ${locationDetail}`, specificInstructions: specialInstructions || undefined, paymentMethod, paymentStatus: 'Pending Verification' });
    try {
      await addStoredOrder({ id: order.id, kind: 'instant', customerName, phone: mobileNumber, planOrMeal: `${quantity}x ${thaliDisplayName} (${slot})`, amount: totalAmount, utrNumber: transactionId.trim(), paymentSlip, paymentStatus: 'Pending Verification', status: 'Pending Verification', details: `${deliveryPointType}: ${locationDetail}${mapLocationUrl ? ` | Current GPS: ${mapLocationUrl}` : ''}${specialInstructions ? ` | ${specialInstructions}` : ''}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      saveLastOrderTracking({ id: order.id, phone: mobileNumber });
    } catch (error) { console.error('Instant order persistence failed:', error); alert('Your payment proof could not be saved. Please check your connection and submit again.'); return; }
    try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } }); } catch {}
    setPlacedOrder(order);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-2xl shadow-2xl border-2 border-[#C88A24] overflow-hidden flex flex-col max-h-[92vh]">
        <div className="bg-[#0D3823] text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-900 shrink-0"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#C88A24] text-black flex items-center justify-center font-bold shadow-xs"><Zap className="w-5 h-5 fill-black" /></div><div><h2 className="text-lg font-bold font-serif-title tracking-wide text-[#F2C94C]">Instant Single Thali Order (Prepaid)</h2><p className="text-xs text-emerald-200">Fresh & Steaming Hot 5CP Thali • Gate Delivery in 45 Mins • 100% Prepaid</p></div></div><button onClick={() => { setIsInstantOrderOpen(false); setPlacedOrder(null); }} className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"><X className="w-5 h-5" /></button></div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF7F2]">
          {placedOrder ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-600 shadow-md text-center space-y-4"><div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto"><CheckCircle className="w-8 h-8" /></div><div><span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C88A24] block">PAYMENT RECEIVED • UNDER VERIFICATION</span><h3 className="text-xl font-bold text-gray-900 font-serif-title">Order #{placedOrder.id}</h3><p className="text-xs text-gray-500 mt-1">Your order request is submitted. It will move to kitchen only after payment verification.</p></div><div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gray-200 text-left text-xs space-y-2"><div className="flex justify-between border-b border-gray-200 pb-1"><span className="text-gray-500">Meal:</span><span className="font-bold capitalize text-gray-800">{placedOrder.quantity}x {placedOrder.thaliName}</span></div><div className="flex justify-between border-b border-gray-200 pb-1"><span className="text-gray-500">Slot:</span><span className="font-bold text-gray-800">{placedOrder.mealSlot}</span></div><div className="flex justify-between border-b border-gray-200 pb-1"><span className="text-gray-500">Destination:</span><span className="font-bold text-gray-800">{placedOrder.deliveryLocation}</span></div><div className="flex justify-between border-b border-gray-200 pb-1"><span className="text-gray-500">Unit price:</span><span className="font-bold text-gray-800">₹{placedOrder.unitPrice}</span></div><div className="flex justify-between border-b border-gray-200 pb-1"><span className="text-gray-500">Quantity:</span><span className="font-bold text-gray-800">{placedOrder.quantity}</span></div><div className="flex justify-between pt-1"><span className="text-gray-500">Total Paid:</span><span className="font-extrabold text-emerald-800 text-sm">₹{placedOrder.totalPrice}</span></div></div><div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 text-left">📞 Delivery Captain will call <strong>+91 {placedOrder.customerPhone}</strong> upon reaching your gate.</div><div className="flex items-center justify-center gap-3 pt-2"><a href="tel:9315075165" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-gray-300"><Phone className="w-3.5 h-3.5" /><span>Call Kitchen: 9315075165</span></a><button onClick={() => { setIsInstantOrderOpen(false); setPlacedOrder(null); }} className="px-6 py-2 bg-[#124E33] hover:bg-[#0A2A1B] text-white rounded-xl text-xs font-bold shadow-md">Close</button></div></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select Thali Variant:</label><div className="grid grid-cols-3 gap-2.5">
                {(['veg','egg','non-veg'] as const).map((type) => { const price=type==='veg'?pricing.vegThaliInstant:type==='egg'?pricing.eggThaliInstant:pricing.nonVegThaliInstant; const label=type==='veg'?'Veg Thali':type==='egg'?'Egg Thali':'Non-Veg Thali'; const image=type==='veg'?FOOD_IMAGES.vegThali:type==='egg'?FOOD_IMAGES.eggThali:FOOD_IMAGES.nonVegThali; return <button key={type} type="button" onClick={()=>setThaliType(type)} className={`rounded-2xl border-2 text-left overflow-hidden transition-all relative ${thaliType===type?'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-md ring-2 ring-emerald-500/20 scale-[1.02]':'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}><div className="h-16 w-full relative overflow-hidden bg-gray-100"><img src={image} alt={label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />{thaliType===type&&<div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-0.5"><Check className="w-3 h-3" /></div>}</div><div className="p-2 text-center"><span className="text-xs font-bold block leading-tight">{label}</span><span className="text-xs text-emerald-700 font-extrabold block mt-0.5">₹{price.toLocaleString()}</span></div></button>; })}
              </div></div>
              <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-3"><div className="flex items-center justify-between"><div><div className="text-sm font-bold text-gray-800">Price per thali: <span className="text-emerald-800">₹{unitPrice.toLocaleString()}</span></div><div className="text-sm font-bold text-gray-800 mt-1">Total payable: <span className="text-emerald-800">₹{totalAmount.toLocaleString()}</span></div></div><div className="flex items-center gap-3"><button type="button" onClick={()=>setQuantity(Math.max(1,quantity-1))} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border"><Minus className="w-4 h-4" /></button><span className="font-bold w-6 text-center">{quantity}</span><button type="button" onClick={()=>setQuantity(quantity+1)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border"><Plus className="w-4 h-4" /></button></div></div></div>
              <PaymentDetailsCard amount={totalAmount} orderReference={`${quantity}x ${thaliDisplayName}`} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><label className="text-xs font-semibold text-gray-700">Name<input value={customerName} onChange={e=>setCustomerName(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label><label className="text-xs font-semibold text-gray-700">Mobile<input value={mobileNumber} onChange={e=>setMobileNumber(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label><label className="text-xs font-semibold text-gray-700 sm:col-span-2">Delivery Location<input value={locationDetail} onChange={e=>setLocationDetail(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label><div className="sm:col-span-2 flex gap-2"><button type="button" onClick={useCurrentLocation} disabled={isLocating} className="px-3 py-2 rounded-lg border bg-white text-xs font-bold">{isLocating ? 'Locating…' : 'Use Current Location'}</button>{mapLocationUrl && <a className="px-3 py-2 rounded-lg border bg-emerald-50 text-xs font-bold" href={mapLocationUrl} target="_blank" rel="noreferrer">Open Map Location</a>}</div><label className="text-xs font-semibold text-gray-700">Delivery Type<select value={deliveryPointType} onChange={e=>setDeliveryPointType(e.target.value as any)} className="mt-1 w-full border rounded-lg p-2"><option value="college">College</option><option value="office">Office</option><option value="home">Home</option></select></label><label className="text-xs font-semibold text-gray-700">Meal Slot<select value={slot} onChange={e=>setSlot(e.target.value as any)} className="mt-1 w-full border rounded-lg p-2"><option>Lunch</option><option>Dinner</option></select></label><label className="text-xs font-semibold text-gray-700 sm:col-span-2">Special Instructions<textarea value={specialInstructions} onChange={e=>setSpecialInstructions(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label><label className="text-xs font-semibold text-gray-700 sm:col-span-2">UTR / Transaction ID<input value={transactionId} onChange={e=>setTransactionId(e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label><label className="text-xs font-semibold text-gray-700 sm:col-span-2">Payment Screenshot<input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 w-full border rounded-lg p-2" /></label></div>
              <div className="flex justify-end"><button type="submit" className="px-6 py-3 rounded-xl bg-[#124E33] text-white font-bold">Pay ₹{totalAmount.toLocaleString()} & Submit Instant Order</button></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
