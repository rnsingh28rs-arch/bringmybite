import React, { useState } from 'react';
import { useApp, calculateExpiryDate, getDaysRemaining } from '../../context/AppContext';
import { Subscription, SubscriptionDuration, PaymentMethod } from '../../types';
import { PaymentDetailsCard } from '../common/PaymentDetailsCard';
import {
  X,
  RotateCcw,
  Calendar,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Clock,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RenewalModal: React.FC = () => {
  const {
    isRenewalModalOpen,
    setIsRenewalModalOpen,
    selectedSubscriptionForRenewal,
    setSelectedSubscriptionForRenewal,
    subscriptions,
    pricing,
    renewSubscription
  } = useApp();

  const activeSub: Subscription | undefined =
    selectedSubscriptionForRenewal ||
    subscriptions.find(s => getDaysRemaining(s.expiryDate) <= 3) ||
    subscriptions[0];

  const [duration, setDuration] = useState<SubscriptionDuration>('1 Month');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [showQrCode, setShowQrCode] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isRenewalModalOpen || !activeSub) return null;

  const basePrice =
    activeSub.packageType === 'VEG CLASSIC'
      ? pricing.vegMonthly
      : activeSub.packageType === 'EGG DELIGHT'
      ? pricing.eggMonthly
      : pricing.nonVegMonthly;

  const multiplier = duration === '1 Month' ? 1 : duration === '3 Months' ? 3 : 6;
  const discountFactor = duration === '3 Months' ? 0.95 : duration === '6 Months' ? 0.90 : 1.0;
  const totalRenewalAmount = Math.round(basePrice * multiplier * discountFactor);

  const newExpiryPreview = calculateExpiryDate(activeSub.expiryDate || new Date().toISOString().split('T')[0], duration);

  const handleRenew = (e: React.FormEvent) => {
    e.preventDefault();
    renewSubscription(activeSub.id, duration, totalRenewalAmount);
    setIsSuccess(true);
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleClose = () => {
    setIsRenewalModalOpen(false);
    setSelectedSubscriptionForRenewal(null);
    setIsSuccess(false);
  };

  const daysRemaining = getDaysRemaining(activeSub.expiryDate);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl w-full max-w-xl shadow-2xl border-2 border-[#124E33] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#124E33] text-white p-5 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D99B26] text-black flex items-center justify-center font-black text-lg shadow-xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif-title tracking-wide text-[#FAF7F2]">
                Instant Subscription Renewal
              </h2>
              <p className="text-xs text-emerald-200">
                Continue your uninterrupted homely meal deliveries
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FAF7F2]">
          
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Subscription Successfully Renewed!
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Thank you, <span className="font-bold text-[#124E33]">{activeSub.customerName}</span>! Your {activeSub.packageType} plan has been extended until <span className="font-bold text-[#124E33]">{newExpiryPreview}</span>.
              </p>

              <div className="bg-white p-4 rounded-xl border border-[#E8E1D5] max-w-sm mx-auto text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subscription ID:</span>
                  <span className="font-mono font-bold text-gray-900">{activeSub.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">New Validity Date:</span>
                  <span className="font-bold text-[#124E33]">{newExpiryPreview}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid:</span>
                  <span className="font-bold text-gray-900">₹{totalRenewalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bonus Perks:</span>
                  <span className="font-bold text-[#D99B26]">2x Monthly Treats Maintained 🎁</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-[#124E33] text-white font-bold text-sm hover:bg-[#0C3822] transition-all shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRenew} className="space-y-4">
              
              {/* Expiry Status Alert Banner */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                daysRemaining <= 3
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <Clock className={`w-5 h-5 mt-0.5 shrink-0 ${daysRemaining <= 3 ? 'text-amber-600' : 'text-emerald-600'}`} />
                <div>
                  <div className="font-bold text-sm">
                    {daysRemaining <= 3
                      ? `⚠️ Attention: Only ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left before expiration!`
                      : `Current subscription is active (${daysRemaining} days remaining)`}
                  </div>
                  <p className="text-xs mt-0.5">
                    Customer: <span className="font-semibold">{activeSub.customerName}</span> ({activeSub.mobileNumber}) • Current plan expires on <span className="font-semibold">{activeSub.expiryDate}</span>.
                  </p>
                </div>
              </div>

              {/* Plan Summary Card */}
              <div className="bg-white p-4 rounded-xl border border-[#E8E1D5] shadow-xs">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Active Plan</span>
                    <h4 className="text-base font-bold text-[#124E33]">{activeSub.packageType}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {activeSub.mealPreference}
                    </span>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Route: {activeSub.routeCode}
                    </div>
                  </div>
                </div>

                {/* Duration Picker */}
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Select Renewal Duration:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1 Month', '3 Months', '6 Months'] as SubscriptionDuration[]).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all ${
                        duration === d
                          ? 'bg-[#124E33] text-white border-[#124E33] shadow-xs'
                          : 'bg-[#FAF7F2] text-gray-700 border-[#E8E1D5] hover:border-gray-400'
                      }`}
                    >
                      <div>{d}</div>
                      <div className="text-[10px] font-normal opacity-90 mt-0.5">
                        {d === '3 Months' ? '5% OFF' : d === '6 Months' ? '10% OFF' : 'Standard'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="bg-white p-4 rounded-xl border border-[#E8E1D5] shadow-xs space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Base Monthly Rate:</span>
                  <span>₹{basePrice}/mo</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Selected Duration:</span>
                  <span>{duration}</span>
                </div>
                {duration !== '1 Month' && (
                  <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                    <span>Discount Applied:</span>
                    <span>{duration === '3 Months' ? '5% Savings' : '10% Savings'}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between items-center text-sm font-bold text-[#1A261E]">
                  <span>Total Renewal Amount:</span>
                  <span className="text-lg text-[#124E33]">₹{totalRenewalAmount}</span>
                </div>
                <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1">
                  <span>New End Date:</span>
                  <span className="font-semibold text-gray-800">{newExpiryPreview}</span>
                </div>
              </div>

              {/* Payment Section with Official Axis Bank & UPI */}
              <div className="space-y-3">
                <PaymentDetailsCard
                  amount={totalRenewalAmount}
                  orderReference={`Renew-${activeSub.id}-${duration}`}
                />

                <div className="bg-white p-3.5 rounded-xl border border-[#E8E1D5] shadow-xs">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    UPI Reference / Axis UTR Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter UPI Ref ID (e.g. 423891238910) / IMPS UTR"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#124E33] bg-[#FAF7F2]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#124E33] hover:bg-[#0C3822] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#F2C94C]" />
                <span>Confirm Prepaid Renewal for ₹{totalRenewalAmount}</span>
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
