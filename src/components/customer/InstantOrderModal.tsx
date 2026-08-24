import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FOOD_IMAGES } from '../../assets/foodImages';
import { PaymentDetailsCard } from '../common/PaymentDetailsCard';
import confetti from 'canvas-confetti';
import {
  X,
  Zap,
  Utensils,
  Plus,
  Minus,
  MapPin,
  Clock,
  CheckCircle,
  Phone,
  MessageSquare,
  ShieldCheck,
  Check,
  QrCode,
  Building2,
  Lock
} from 'lucide-react';
import { PaymentMethod } from '../../types';

export const InstantOrderModal: React.FC = () => {
  const {
    isInstantOrderOpen,
    setIsInstantOrderOpen,
    preselectedThaliType,
    pricing,
    addInstantOrder
  } = useApp();

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

  // Placed Order Success state
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  if (!isInstantOrderOpen) return null;

  const unitPrice =
    thaliType === 'veg'
      ? pricing.vegThaliInstant
      : thaliType === 'egg'
      ? pricing.eggThaliInstant
      : pricing.nonVegThaliInstant;

  const totalAmount = unitPrice * quantity;
  const thaliDisplayName =
    thaliType === 'veg'
      ? 'Veg Classic Thali'
      : thaliType === 'egg'
      ? 'Egg Delight Thali'
      : 'Chicken Non-Veg Thali (3 pcs)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !mobileNumber.trim() || !locationDetail.trim()) {
      alert('Please fill in your name, contact number, and delivery gate location.');
      return;
    }

    const order = addInstantOrder({
      customerName,
      customerPhone: mobileNumber,
      thaliType,
      thaliName: thaliDisplayName,
      quantity,
      unitPrice,
      totalPrice: totalAmount,
      mealSlot: slot,
      deliveryCategory: deliveryPointType === 'college' ? 'College Student' : deliveryPointType === 'office' ? 'Working Professional' : 'Other',
      deliveryLocation:
        deliveryPointType === 'college'
          ? `College Gate: ${locationDetail}`
          : deliveryPointType === 'office'
          ? `Office Gate/Reception: ${locationDetail}`
          : `Home Address: ${locationDetail}`,
      specificInstructions: specialInstructions || undefined,
      paymentMethod,
      paymentStatus: 'Prepaid Verified'
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      // safe fallback
    }

    setPlacedOrder(order);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-2xl shadow-2xl border-2 border-[#C88A24] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0D3823] text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C88A24] text-black flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-5 h-5 fill-black" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif-title tracking-wide text-[#F2C94C]">
                Instant Single Thali Order (Prepaid)
              </h2>
              <p className="text-xs text-emerald-200">
                Fresh & Steaming Hot 5CP Thali • Gate Delivery in 45 Mins • 100% Prepaid
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsInstantOrderOpen(false);
              setPlacedOrder(null);
            }}
            className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF7F2]">
          
          {placedOrder ? (
            /* Instant Order Confirmation Card */
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-600 shadow-md text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C88A24] block">
                  PAYMENT VERIFIED • ORDER DISPATCHED TO KITCHEN
                </span>
                <h3 className="text-xl font-bold text-gray-900 font-serif-title">
                  Order #{placedOrder.id}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Estimated Gate Arrival: <strong>40–50 Minutes</strong>.
                </p>
              </div>

              {/* Status Breakdown */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gray-200 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">Meal:</span>
                  <span className="font-bold capitalize text-gray-800">
                    {placedOrder.quantity}x {placedOrder.thaliName}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">Slot:</span>
                  <span className="font-bold text-gray-800">{placedOrder.mealSlot}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">Destination:</span>
                  <span className="font-bold text-gray-800">{placedOrder.deliveryLocation}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500">Payment:</span>
                  <span className="font-extrabold text-emerald-800 text-sm">
                    ₹{placedOrder.totalPrice} (Prepaid via {placedOrder.paymentMethod})
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500">Live Status:</span>
                  <span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {placedOrder.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 text-left">
                📞 Delivery Captain will call <strong>+91 {placedOrder.customerPhone}</strong> upon reaching your gate.
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href="tel:9004848984"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-gray-300"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Kitchen: 9004848984</span>
                </a>
                <button
                  onClick={() => {
                    setIsInstantOrderOpen(false);
                    setPlacedOrder(null);
                  }}
                  className="px-6 py-2 bg-[#124E33] hover:bg-[#0A2A1B] text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Order Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Thali Type Selector with Visual Dish Photos */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Thali Variant:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  
                  {/* Veg Thali Option */}
                  <button
                    type="button"
                    onClick={() => setThaliType('veg')}
                    className={`rounded-2xl border-2 text-left overflow-hidden transition-all relative ${
                      thaliType === 'veg'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-md ring-2 ring-emerald-500/20 scale-[1.02]'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="h-16 w-full relative overflow-hidden bg-gray-100">
                      <img
                        src={FOOD_IMAGES.vegThali}
                        alt="Veg Thali"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {thaliType === 'veg' && (
                        <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 text-center">
                      <span className="text-xs font-bold block leading-tight">Veg Thali</span>
                      <span className="text-xs text-emerald-700 font-extrabold block mt-0.5">₹{pricing.vegThaliInstant}</span>
                    </div>
                  </button>

                  {/* Egg Thali Option */}
                  <button
                    type="button"
                    onClick={() => setThaliType('egg')}
                    className={`rounded-2xl border-2 text-left overflow-hidden transition-all relative ${
                      thaliType === 'egg'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-md ring-2 ring-amber-500/20 scale-[1.02]'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="h-16 w-full relative overflow-hidden bg-gray-100">
                      <img
                        src={FOOD_IMAGES.eggThali}
                        alt="Egg Thali"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {thaliType === 'egg' && (
                        <div className="absolute top-1.5 right-1.5 bg-amber-600 text-white rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 text-center">
                      <span className="text-xs font-bold block leading-tight">Egg Thali</span>
                      <span className="text-xs text-amber-700 font-extrabold block mt-0.5">₹{pricing.eggThaliInstant}</span>
                    </div>
                  </button>

                  {/* Non-Veg Thali Option */}
                  <button
                    type="button"
                    onClick={() => setThaliType('non-veg')}
                    className={`rounded-2xl border-2 text-left overflow-hidden transition-all relative ${
                      thaliType === 'non-veg'
                        ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-md ring-2 ring-rose-500/20 scale-[1.02]'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="h-16 w-full relative overflow-hidden bg-gray-100">
                      <img
                        src={FOOD_IMAGES.nonVegThali}
                        alt="Chicken Thali"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {thaliType === 'non-veg' && (
                        <div className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 text-center">
                      <span className="text-xs font-bold block leading-tight">Chicken Thali</span>
                      <span className="text-xs text-rose-700 font-extrabold block mt-0.5">₹{pricing.nonVegThaliInstant}</span>
                    </div>
                  </button>

                </div>
              </div>

              {/* Quantity & Slot Selector */}
              <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity (Trays)</label>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden w-fit">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-1 font-bold text-sm text-gray-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Slot</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSlot('Lunch')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                        slot === 'Lunch' ? 'bg-[#124E33] text-white border-[#124E33]' : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      ☀️ Lunch
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlot('Dinner')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                        slot === 'Dinner' ? 'bg-[#124E33] text-white border-[#124E33]' : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      🌙 Dinner
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sen"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-[#124E33]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9820144321"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-[#124E33]"
                    />
                  </div>
                </div>

                {/* Delivery Location Type */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Delivery Destination *</label>
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryPointType('college')}
                      className={`p-1.5 rounded-xl text-[11px] font-bold border ${
                        deliveryPointType === 'college' ? 'bg-[#124E33] text-white border-[#124E33]' : 'bg-gray-50'
                      }`}
                    >
                      🎓 College Gate
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryPointType('office')}
                      className={`p-1.5 rounded-xl text-[11px] font-bold border ${
                        deliveryPointType === 'office' ? 'bg-[#124E33] text-white border-[#124E33]' : 'bg-gray-50'
                      }`}
                    >
                      🏢 Office Gate
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryPointType('home')}
                      className={`p-1.5 rounded-xl text-[11px] font-bold border ${
                        deliveryPointType === 'home' ? 'bg-[#124E33] text-white border-[#124E33]' : 'bg-gray-50'
                      }`}
                    >
                      🏠 Home Society
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder={
                      deliveryPointType === 'college'
                        ? 'e.g. Heritage Institute Main Gate / Techno Gate 1'
                        : deliveryPointType === 'office'
                        ? 'e.g. DLF 1 Reception / Wipro Gate 2'
                        : 'e.g. Green Valley Apts, Flat 301, Sector 2'
                    }
                    value={locationDetail}
                    onChange={(e) => setLocationDetail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-[#124E33]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Special Note (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Less spicy, extra salad"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Payment Section for Instant Orders */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Instant Prepaid Checkout:
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        paymentMethod === 'UPI' ? 'bg-[#124E33] text-white border-[#124E33]' : 'bg-white text-gray-700'
                      }`}
                    >
                      UPI / QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Bank Transfer')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        paymentMethod === 'Bank Transfer' ? 'bg-[#124E33] text-white border-[#124E33]' : 'bg-white text-gray-700'
                      }`}
                    >
                      Axis NetBanking
                    </button>
                  </div>
                </div>

                <PaymentDetailsCard
                  amount={totalAmount}
                  orderReference={`Instant-${thaliType}-${quantity}x`}
                />

                <div className="bg-white p-3 rounded-2xl border border-gray-200">
                  <label className="block font-semibold text-gray-700 text-xs mb-1">
                    UPI Transaction UTR / Ref No. (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 423984128912 or Axis IMPS Ref"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-mono outline-none"
                  />
                </div>
              </div>

              {/* Total & Submit Button */}
              <div className="bg-[#0D3823] p-4 rounded-2xl text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-200 block">Total Amount:</span>
                  <span className="text-2xl font-black text-[#F2C94C]">₹{totalAmount}</span>
                  <span className="text-[10px] text-emerald-300 block">100% Prepaid via Axis Bank / UPI</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C88A24] hover:bg-[#A97116] text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Confirm Prepaid Order (₹{totalAmount})</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

