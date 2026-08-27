import React, { useState } from 'react';
import { useApp, calculateExpiryDate, getDaysRemaining } from '../../context/AppContext';
import { useCms } from '../../cms/CmsContext';
import { Subscription, SubscriptionDuration, PaymentMethod } from '../../types';
import { PaymentDetailsCard } from '../common/PaymentDetailsCard';
import { X, RotateCcw, Calendar, CreditCard, QrCode, ShieldCheck, CheckCircle, Sparkles, ArrowRight, Clock, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RenewalModal: React.FC = () => {
  const { banners } = useCms();
  const { isRenewalModalOpen, setIsRenewalModalOpen, selectedSubscriptionForRenewal, setSelectedSubscriptionForRenewal, subscriptions, renewSubscription } = useApp();
  const activeSub: Subscription | undefined = selectedSubscriptionForRenewal || subscriptions.find(s => getDaysRemaining(s.expiryDate) <= 3) || subscriptions[0];
  const [duration, setDuration] = useState<SubscriptionDuration>('1 Month');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [showQrCode, setShowQrCode] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  if (!isRenewalModalOpen || !activeSub) return null;

  const configuredPriceText = banners.find((b) => b.active && b.package_key === activeSub.packageType)?.highlight_price || '';
  const totalRenewalAmount = Number(String(configuredPriceText).replace(/[^0-9.]/g, '')) || 0;
  const newExpiryPreview = calculateExpiryDate(activeSub.expiryDate || new Date().toISOString().split('T')[0], duration);

  const handleRenew = (e: React.FormEvent) => { e.preventDefault(); renewSubscription(activeSub.id, duration, totalRenewalAmount); setIsSuccess(true); try { confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } }); } catch {} };
  const handleClose = () => { setIsRenewalModalOpen(false); setSelectedSubscriptionForRenewal(null); setIsSuccess(false); };
  const daysRemaining = getDaysRemaining(activeSub.expiryDate);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl w-full max-w-xl shadow-2xl border-2 border-[#124E33] overflow-hidden flex flex-col max-h-[92vh]">
        <div className="bg-[#124E33] text-white p-4 flex items-center justify-between"><div><h2 className="text-lg font-bold">Subscription Renewal</h2><p className="text-xs text-emerald-200">Renewal price is controlled by D-Admin Banner.</p></div><button onClick={handleClose} className="p-2 rounded-full hover:bg-emerald-800"><X className="w-5 h-5" /></button></div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isSuccess ? (
            <div className="bg-white rounded-2xl p-6 text-center space-y-4 border border-emerald-200"><CheckCircle className="w-12 h-12 mx-auto text-emerald-600"/><h3 className="text-xl font-bold text-[#124E33]">Renewal Submitted</h3><p className="text-sm text-gray-600">Your renewal request uses the exact Banner-configured price.</p><button onClick={handleClose} className="px-6 py-2 rounded-xl bg-[#124E33] text-white font-bold">Close</button></div>
          ) : (
            <form onSubmit={handleRenew} className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-200 p-4"><div className="text-xs font-bold uppercase tracking-wide text-gray-600">Plan</div><div className="text-base font-extrabold text-gray-900 mt-1">{activeSub.packageType}</div><div className="text-2xl font-extrabold text-emerald-800 mt-2">{configuredPriceText || 'Price not set'}</div><div className="text-xs text-gray-500 mt-1">Final price from D-Admin Banner. No duration multiplication or discount calculation.</div></div>
              <label className="block text-xs font-semibold text-gray-700">Renewal Duration<select value={duration} onChange={(e)=>setDuration(e.target.value as SubscriptionDuration)} className="mt-1 w-full border rounded-lg p-2"><option>1 Month</option><option>3 Months</option><option>6 Months</option></select></label>
              <div className="text-xs text-gray-600">Current days remaining: <strong>{daysRemaining}</strong></div><div className="text-xs text-gray-600">New expiry date: <strong>{newExpiryPreview}</strong></div>
              <label className="block text-xs font-semibold text-gray-700">Payment Method<select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value as PaymentMethod)} className="mt-1 w-full border rounded-lg p-2"><option>UPI</option><option>Bank Transfer</option><option>QR Code</option><option>Corporate Bank Transfer</option></select></label>
              <label className="block text-xs font-semibold text-gray-700">Transaction ID<input value={transactionId} onChange={(e)=>setTransactionId(e.target.value)} className="mt-1 w-full border rounded-lg p-2" required /></label>
              <button type="submit" className="w-full px-6 py-3 rounded-xl bg-[#124E33] text-white font-bold">Renew for {configuredPriceText || 'Price not set'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};