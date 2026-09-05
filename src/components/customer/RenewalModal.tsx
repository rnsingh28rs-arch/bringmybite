import React, { useState } from 'react';
import { useApp, calculateExpiryDate, getDaysRemaining } from '../../context/AppContext';
import { Subscription, SubscriptionDuration, PaymentMethod } from '../../types';
import { PaymentDetailsCard } from '../common/PaymentDetailsCard';
import { addStoredOrder, saveLastOrderTracking } from '../../utils/orderStore';
import { X, Calendar, CreditCard, CheckCircle, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RenewalModal: React.FC = () => {
  const { isRenewalModalOpen, setIsRenewalModalOpen, selectedSubscriptionForRenewal, setSelectedSubscriptionForRenewal, subscriptions, renewSubscription, pricing } = useApp();
  const activeSub: Subscription | undefined = selectedSubscriptionForRenewal || subscriptions.find(s => getDaysRemaining(s.expiryDate) <= 3) || subscriptions[0];
  const [duration, setDuration] = useState<SubscriptionDuration>('1 Month');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [transactionId, setTransactionId] = useState('');
  const [paymentSlip, setPaymentSlip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isRenewalModalOpen || !activeSub) return null;

  const monthlyPrice = activeSub.packageType === 'VEG CLASSIC' ? pricing.vegMonthly : activeSub.packageType === 'EGG DELIGHT' ? pricing.eggMonthly : pricing.nonVegMonthly;
  const durationMultiplier = duration === '1 Month' ? 1 : duration === '3 Months' ? 3 : 6;
  const discountFactor = duration === '3 Months' ? 0.95 : duration === '6 Months' ? 0.90 : 1;
  const totalRenewalAmount = Math.round(monthlyPrice * durationMultiplier * discountFactor);
  const discountLabel = duration === '3 Months' ? '5% multi-month discount' : duration === '6 Months' ? '10% multi-month discount' : '';
  const newExpiryPreview = calculateExpiryDate(activeSub.expiryDate || new Date().toISOString().split('T')[0], duration);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const max = 900;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPaymentSlip(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = String(event.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  const handleRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (monthlyPrice <= 0) { alert('This subscription price is not configured. Please ask the administrator to configure the current rate.'); return; }
    if (!transactionId.trim()) { alert(`Please pay ₹${totalRenewalAmount.toLocaleString()} and enter the UTR / transaction reference.`); return; }
    if (!paymentSlip) { alert('Please attach the payment screenshot / receipt.'); return; }
    setIsSubmitting(true);
    try {
      renewSubscription(activeSub.id, duration, totalRenewalAmount);
      await addStoredOrder({
        id: `REN-${Date.now()}`,
        kind: 'subscription',
        customerName: activeSub.customerName,
        phone: activeSub.mobileNumber,
        whatsapp: activeSub.whatsappNumber || activeSub.mobileNumber,
        planOrMeal: `Renewal • ${activeSub.packageType} • ${duration}`,
        amount: totalRenewalAmount,
        utrNumber: transactionId.trim(),
        paymentSlip,
        paymentStatus: 'Pending Verification',
        status: 'Pending Verification',
        details: `Renewal of ${activeSub.id} • ${discountLabel || 'Standard pricing'} • Payment method: ${paymentMethod}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      saveLastOrderTracking({ id: activeSub.id, phone: activeSub.mobileNumber });
      setIsSuccess(true);
      try { confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } }); } catch {}
    } catch (error) {
      console.error('Subscription renewal persistence failed:', error);
      alert(error instanceof Error ? error.message : 'Renewal could not be submitted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsRenewalModalOpen(false);
    setSelectedSubscriptionForRenewal(null);
    setIsSuccess(false);
    setTransactionId('');
    setPaymentSlip('');
  };

  const daysRemaining = getDaysRemaining(activeSub.expiryDate);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl w-full max-w-2xl shadow-2xl border-2 border-[#124E33] overflow-hidden flex flex-col max-h-[94vh]">
        <div className="bg-[#124E33] text-white p-4 flex items-center justify-between">
          <div><h2 className="text-lg font-bold">Subscription Renewal</h2><p className="text-xs text-emerald-200">Select duration → pay the exact calculated amount → upload payment proof.</p></div>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-emerald-800"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isSuccess ? (
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-center space-y-5 border-2 border-emerald-600">
              <CheckCircle className="w-14 h-14 mx-auto text-emerald-600" />
              <div><h3 className="text-xl font-bold text-[#124E33]">Renewal Submitted</h3><p className="text-sm text-gray-600">Your payment proof has been submitted for verification.</p></div>
              <div className="max-w-md mx-auto bg-[#FAF7F2] p-4 rounded-xl border text-left text-xs space-y-2">
                <div className="flex justify-between border-b pb-1.5"><span>Plan:</span><strong>{activeSub.packageType}</strong></div>
                <div className="flex justify-between border-b pb-1.5"><span>Duration:</span><strong>{duration}</strong></div>
                <div className="flex justify-between border-b pb-1.5"><span>Amount:</span><strong className="text-emerald-800">₹{totalRenewalAmount.toLocaleString()}</strong></div>
                <div className="flex justify-between"><span>New expiry:</span><strong>{newExpiryPreview}</strong></div>
              </div>
              <div className="flex items-center justify-center gap-3"><button onClick={() => window.print()} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border"><Printer className="w-3.5 h-3.5" />Print</button><button onClick={handleClose} className="px-6 py-2 rounded-xl bg-[#124E33] text-white font-bold">Close</button></div>
            </div>
          ) : (
            <form onSubmit={handleRenew} className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#124E33]" /><span className="text-xs font-bold uppercase tracking-wide text-gray-700">Renewal Plan</span></div>
                <div className="text-base font-extrabold text-gray-900">{activeSub.packageType}</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <label className="text-xs font-semibold text-gray-700">Duration<select value={duration} onChange={(e)=>setDuration(e.target.value as SubscriptionDuration)} className="mt-1 w-full border border-gray-300 rounded-lg p-2"><option>1 Month</option><option>3 Months</option><option>6 Months</option></select></label>
                  <div className="text-xs text-gray-500">Monthly rate<strong className="block text-gray-900 text-base">₹{monthlyPrice.toLocaleString()}</strong></div>
                  <div className="text-xs text-gray-500">Total payable<strong className="block text-emerald-800 text-xl">₹{totalRenewalAmount.toLocaleString()}</strong>{discountLabel && <span className="text-emerald-700">{discountLabel}</span>}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600"><div>Current days remaining: <strong>{daysRemaining}</strong></div><div>New expiry: <strong>{newExpiryPreview}</strong></div></div>
              </div>
              <PaymentDetailsCard amount={totalRenewalAmount} orderReference={`${activeSub.packageType} Renewal • ${duration}`} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-gray-700">Payment Method<select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value as PaymentMethod)} className="mt-1 w-full border rounded-lg p-2"><option>UPI</option><option>Bank Transfer</option><option>QR Code</option><option>Corporate Bank Transfer</option></select></label>
                <label className="text-xs font-semibold text-gray-700">UTR / Transaction ID<input value={transactionId} onChange={(e)=>setTransactionId(e.target.value)} className="mt-1 w-full border rounded-lg p-2" required /></label>
                <label className="text-xs font-semibold text-gray-700 sm:col-span-2">Payment Screenshot<input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 w-full border rounded-lg p-2" required /></label>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900"><strong>Important:</strong> Pay exactly ₹{totalRenewalAmount.toLocaleString()} shown above. Your QR is generated for this exact amount.</div>
              <button type="submit" disabled={isSubmitting || totalRenewalAmount <= 0} className="w-full px-6 py-3 rounded-xl bg-[#124E33] disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2"><CreditCard className="w-4 h-4" />{isSubmitting ? 'Submitting…' : `Pay ₹${totalRenewalAmount.toLocaleString()} & Submit Renewal`}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
