import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getSiteConfig, formatIndianWhatsAppNumber } from '../../utils/siteConfigStore';
import { addStoredOrder } from '../../utils/orderStore';

export const RegistrationModal: React.FC = () => {
  const { isRegistrationOpen, closeRegistration, selectedPlan } = useAppContext();
  const config = getSiteConfig();

  const [planType, setPlanType] = useState<'veg' | 'egg' | 'chicken'>('veg');
  const [slot, setSlot] = useState<'Both (Lunch + Dinner)' | 'Lunch Only' | 'Dinner Only'>('Both (Lunch + Dinner)');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Knowledge Park, Greater Noida');
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentSlip, setPaymentSlip] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<{ id: string; amount: number } | null>(null);

  useEffect(() => {
    if (selectedPlan?.toLowerCase().includes('egg')) setPlanType('egg');
    else if (selectedPlan?.toLowerCase().includes('non') || selectedPlan?.toLowerCase().includes('chicken')) setPlanType('chicken');
    else setPlanType('veg');
  }, [selectedPlan]);

  if (!isRegistrationOpen) return null;

  const planPricing = {
    veg: slot === 'Both (Lunch + Dinner)' ? 3700 : 2200,
    egg: slot === 'Both (Lunch + Dinner)' ? 4000 : 2500,
    chicken: slot === 'Both (Lunch + Dinner)' ? 4500 : 2800,
  };

  const currentPrice = planPricing[planType];

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
        setPaymentSlip(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim() || !utrNumber.trim()) {
      alert('Please fill Name, Phone, Delivery Gate, and UTR number.');
      return;
    }

    setIsSubmitting(true);
    const newOrderId = `SUB-${Math.floor(100000 + Math.random() * 900000)}`;
    const planName =
      planType === 'veg'
        ? 'The Veg Classic Monthly Plan'
        : planType === 'egg'
        ? 'The Egg Delight Monthly Plan'
        : 'The Non-Veg Club Monthly Plan';

    addStoredOrder({
      id: newOrderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city,
      planType: 'Monthly Subscription',
      mealPlan: `${planName} (${slot})`,
      slot: slot,
      amount: currentPrice,
      utrNumber: utrNumber.trim(),
      paymentSlip: paymentSlip || undefined,
      status: 'pending',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      estimatedTime: 'Starts from Tomorrow',
    });

    setIsSubmitting(false);
    setOrderPlaced({ id: newOrderId, amount: currentPrice });
  };

  const handleClose = () => {
    setOrderPlaced(null);
    setPaymentSlip('');
    setUtrNumber('');
    closeRegistration();
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
              <span className="text-xs uppercase tracking-widest text-amber-300 font-black">Subscription Request Received</span>
              <h3 className="text-2xl font-black text-white">Pending UTR Verification</h3>
              <p className="text-xs text-slate-300">Booking ID: <span className="font-mono text-amber-300 font-bold">{orderPlaced.id}</span></p>
            </div>

            <div className="bg-[#1A2C21] p-4 rounded-2xl border border-[#2B4736] text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-amber-300 font-black uppercase">Verification in Progress</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Package Amount:</span>
                <span className="text-white font-black font-mono">₹{orderPlaced.amount}/Month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service Start:</span>
                <span className="text-emerald-300 font-bold">From Tomorrow's Next Slot</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/${waChefNumber}?text=${encodeURIComponent(
                  `Namaste Bring My Bite! 🙏\nMaine Monthly Subscription plan book kiya hai:\n*ID:* ${orderPlaced.id}\n*Plan:* ${planType} (${slot})\n*Amount:* ₹${orderPlaced.amount}\n*Name:* ${customerName}\n*UTR:* ${utrNumber}\nKripya verification confirm karein!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <span>💬</span> Notify on WhatsApp
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
              <div className="inline-block bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/30 mb-1">
                🏷️ Monthly Savings Plan
              </div>
              <h3 className="text-2xl font-black text-white">Subscribe 30-Day Tiffin Plan</h3>
              <p className="text-xs text-slate-400">13 fresh homestyle meals/week delivered at your gate.</p>
            </div>

            {/* Select Package Tier */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Choose Package:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPlanType('veg')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    planType === 'veg'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white ring-1 ring-emerald-400'
                      : 'bg-[#1A2C21] border-[#2B4736] text-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-black block">🌱 Veg Classic</span>
                  <span className="text-base font-mono font-black text-emerald-300">₹3,700</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlanType('egg')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    planType === 'egg'
                      ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400'
                      : 'bg-[#1A2C21] border-[#2B4736] text-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-black block">🍳 Egg Delight</span>
                  <span className="text-base font-mono font-black text-amber-300">₹4,000</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlanType('chicken')}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    planType === 'chicken'
                      ? 'bg-rose-500/20 border-rose-400 text-white ring-1 ring-rose-400'
                      : 'bg-[#1A2C21] border-[#2B4736] text-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-black block">🍗 Non-Veg</span>
                  <span className="text-base font-mono font-black text-rose-300">₹4,500</span>
                </button>
              </div>
            </div>

            {/* Select Slot */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-bold">Choose Meal Coverage:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSlot('Both (Lunch + Dinner)')}
                  className={`p-2 rounded-xl border font-bold text-center ${
                    slot === 'Both (Lunch + Dinner)' ? 'bg-emerald-500/20 border-emerald-400 text-white' : 'bg-[#1A2C21] border-[#2B4736] text-slate-400'
                  }`}
                >
                  🍱 Lunch + Dinner
                </button>
                <button
                  type="button"
                  onClick={() => setSlot('Lunch Only')}
                  className={`p-2 rounded-xl border font-bold text-center ${
                    slot === 'Lunch Only' ? 'bg-emerald-500/20 border-emerald-400 text-white' : 'bg-[#1A2C21] border-[#2B4736] text-slate-400'
                  }`}
                >
                  ☀️ Lunch Only
                </button>
                <button
                  type="button"
                  onClick={() => setSlot('Dinner Only')}
                  className={`p-2 rounded-xl border font-bold text-center ${
                    slot === 'Dinner Only' ? 'bg-emerald-500/20 border-emerald-400 text-white' : 'bg-[#1A2C21] border-[#2B4736] text-slate-400'
                  }`}
                >
                  🌙 Dinner Only
                </button>
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyanshu Singh"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#1A2C21] border border-[#2B4736] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">WhatsApp Number:</label>
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
              <label className="text-slate-300 font-bold">Hostel / Gate / Flat Delivery Address:</label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Flat 402, Tower 3, Greater Noida West / KP 3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#1A2C21] border border-[#2B4736] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
              />
            </div>

            {/* UPI UTR & Proof */}
            <div className="bg-[#1A2C21] p-4 rounded-2xl border border-amber-500/30 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Payment Amount</span>
                  <div className="text-base font-black text-white font-mono">₹{currentPrice}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">UPI ID:</span>
                  <span className="font-mono text-emerald-300 font-bold">{config.upiId || '9315075165@upi'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="12-digit UTR No."
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="bg-[#132018] border border-[#2B4736] rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-amber-400"
                />
                <label className="bg-[#132018] border border-[#2B4736] hover:border-amber-400 rounded-xl px-3 py-2 text-slate-300 flex items-center justify-between cursor-pointer">
                  <span className="truncate">{paymentSlip ? '✅ Attached' : '📸 Attach Slip'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-2xl shadow-xl transition cursor-pointer text-sm"
            >
              {isSubmitting ? 'Submitting Registration...' : `Confirm & Book Plan (₹${currentPrice})`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
