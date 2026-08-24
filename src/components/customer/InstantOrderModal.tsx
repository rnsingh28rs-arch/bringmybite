import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getSiteConfig, formatIndianWhatsAppNumber } from '../../utils/siteConfigStore';
import { addStoredOrder } from '../../utils/orderStore';

export const InstantOrderModal: React.FC = () => {
  const { isInstantOrderOpen, closeInstantOrder, selectedMealPlan } = useAppContext();
  const config = getSiteConfig();

  const [mealType, setMealType] = useState<'veg' | 'egg' | 'chicken'>('veg');
  const [slot, setSlot] = useState<'Lunch (12:30-2:00 PM)' | 'Dinner (7:30-9:30 PM)'>('Lunch (12:30-2:00 PM)');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Knowledge Park III, Greater Noida');
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentSlip, setPaymentSlip] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<{ id: string; amount: number } | null>(null);

  if (!isInstantOrderOpen) return null;

  const thaliPrices = {
    veg: 90,
    egg: 100,
    chicken: 120,
  };

  const currentPrice = thaliPrices[mealType];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setPaymentSlip(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill customer name, phone number, and delivery gate address.');
      return;
    }

    if (!utrNumber.trim()) {
      alert('Please enter 12-digit UPI / UTR Transaction ID after scanning QR.');
      return;
    }

    setIsSubmitting(true);

    const newOrderId = `BMB-${Math.floor(100000 + Math.random() * 900000)}`;
    const mealLabel =
      mealType === 'veg'
        ? '🌱 Pure Veg Standard Thali'
        : mealType === 'egg'
        ? '🍳 Egg Delight Thali'
        : '🍗 Desi Chicken Curry Thali';

    addStoredOrder({
      id: newOrderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city,
      planType: 'One-Time Instant Thali',
      mealPlan: mealLabel,
      slot: slot,
      amount: currentPrice,
      utrNumber: utrNumber.trim(),
      paymentSlip: paymentSlip || undefined,
      status: 'pending',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      estimatedTime: '35 - 45 Mins',
    });

    setIsSubmitting(false);
    setOrderPlaced({ id: newOrderId, amount: currentPrice });
  };

  const handleClose = () => {
    setOrderPlaced(null);
    setPaymentSlip('');
    setUtrNumber('');
    closeInstantOrder();
  };

  const waChefNumber = formatIndianWhatsAppNumber(config.whatsappNumber || '9315075165');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="relative max-w-xl w-full bg-[#132018] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-[#FAF7F2] shadow-2xl my-8">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 bg-[#1A2C21] hover:bg-rose-900/40 text-slate-300 hover:text-white rounded-full flex items-center justify-center font-bold text-sm transition cursor-pointer"
        >
          ✕
        </button>

        {orderPlaced ? (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg animate-pulse">
              🟡
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-black">Order Queue Submitted</span>
              <h3 className="text-2xl font-black text-white">Verification in Progress</h3>
              <p className="text-xs text-slate-300">Order ID: <span className="font-mono text-amber-300 font-bold">{orderPlaced.id}</span></p>
            </div>

            <div className="bg-[#1A2C21] p-4 rounded-2xl border border-[#2B4736] text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-amber-300 font-black uppercase">Pending UTR Verification</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Amount:</span>
                <span className="text-white font-black font-mono">₹{orderPlaced.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kitchen ETA:</span>
                <span className="text-emerald-300 font-bold">35 - 45 Mins (Post Verification)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Kitchen desk aapka payment verify karke khana dispatch karega. WhatsApp update pane ke liye click karein:
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/${waChefNumber}?text=${encodeURIComponent(
                  `Namaste Bring My Bite! 🙏\nMaine Instant Thali order kiya hai:\n*Order ID:* ${orderPlaced.id}\n*Amount:* ₹${orderPlaced.amount}\n*Name:* ${customerName}\n*UTR:* ${utrNumber}\nKripya confirm karein!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <span>💬</span> Send Receipt on WhatsApp
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="py-3 px-6 bg-[#1A2C21] hover:bg-[#243c2d] text-white font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-block bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/30 mb-1">
                ⚡ 45-Min Express Kitchen
              </div>
              <h3 className="text-2xl font-black text-white">Order 1-Time Fresh Thali</h3>
              <p className="text-xs text-slate-400">Cooked fresh on order. Delivered warm in 5CP tray.</p>
            </div>

            {/* Select Thali Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Select Meal Category:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMealType('veg')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    mealType === 'veg'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white ring-1 ring-emerald-400'
                      : 'bg-[#1A2C21] border-[#2B4736] text-slate-300'
                  }`}
                >
                  <span className="text-xs font-black block">🌱 Pure Veg</span>
                  <span className="text-base font-mono font-black text-emerald-300">₹90</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMealType('egg')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    mealType === 'egg'
                      ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400'
                      : 'bg-[#1A2C21] border-[#2B4736] text-slate-300'
                  }`}
                >
                  <span className="text-xs font-black block">🍳 Egg Curry</span>
                  <span className="text-base font-mono font-black text-amber-300">₹100</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMealType('chicken')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    mealType === 'chicken'
                      ? 'bg-rose-500/20 border-rose-400 text-white ring-1 ring-rose-400'
                      : 'bg-[#1A2C21] border-[#2B4736] text-slate-300'
                  }`}
                >
                  <span className="text-xs font-black block">🍗 Chicken</span>
                  <span className="text-base font-mono font-black text-rose-300">₹120</span>
                </button>
              </div>
            </div>

            {/* Delivery Slot Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Meal Slot:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSlot('Lunch (12:30-2:00 PM)')}
                  className={`py-2 px-3 rounded-xl border font-bold transition cursor-pointer ${
                    slot === 'Lunch (12:30-2:00 PM)'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white'
                      : 'bg-[#1A2C21] border-[#2B4736] text-slate-400'
                  }`}
                >
                  ☀️ Lunch (12:30 - 2:00 PM)
                </button>

                <button
                  type="button"
                  onClick={() => setSlot('Dinner (7:30-9:30 PM)')}
                  className={`py-2 px-3 rounded-xl border font-bold transition cursor-pointer ${
                    slot === 'Dinner (7:30-9:30 PM)'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white'
                      : 'bg-[#1A2C21] border-[#2B4736] text-slate-400'
                  }`}
                >
                  🌙 Dinner (7:30 - 9:30 PM)
                </button>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Your Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#1A2C21] border border-[#2B4736] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">WhatsApp Phone Number:</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#1A2C21] border border-[#2B4736] rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-bold">Delivery Gate / Hostel / Flat Address:</label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Room 204, Tower B, Stellar Mi City, Knowledge Park 3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#1A2C21] border border-[#2B4736] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
              />
            </div>

            {/* QR Payment & UTR Section */}
            <div className="bg-[#1A2C21] p-4 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">UPI / QR Payment</span>
                  <div className="text-white text-xs font-black">Scan & Pay ₹{currentPrice}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">UPI ID:</span>
                  <span className="font-mono text-xs font-black text-emerald-300">{config.upiId || '9315075165@upi'}</span>
                </div>
              </div>

              {/* UTR Input & Screenshot Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-bold">12-Digit UTR / Ref No:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4085XXXXXXXX"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full bg-[#132018] border border-[#2B4736] rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-bold">Upload Screenshot (Optional):</label>
                  <label className="w-full bg-[#132018] border border-[#2B4736] hover:border-amber-400 rounded-xl px-3 py-2 text-slate-300 text-xs flex items-center justify-between cursor-pointer">
                    <span className="truncate">{paymentSlip ? '✅ Slip Attached' : '📸 Choose Slip'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-2xl shadow-xl transition cursor-pointer text-sm"
            >
              {isSubmitting ? 'Placing in Queue...' : `Confirm & Place Order (₹${currentPrice})`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
