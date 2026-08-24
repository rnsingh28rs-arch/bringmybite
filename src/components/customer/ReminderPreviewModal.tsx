import React, { useState } from 'react';
import { useApp, getDaysRemaining } from '../../context/AppContext';
import { Subscription } from '../../types';
import {
  X,
  MessageSquare,
  Smartphone,
  Send,
  CheckCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const ReminderPreviewModal: React.FC = () => {
  const {
    isReminderPreviewModalOpen,
    setIsReminderPreviewModalOpen,
    activeReminderSubscription,
    setActiveReminderSubscription,
    sendSubscriptionReminder,
    setIsRenewalModalOpen,
    setSelectedSubscriptionForRenewal,
    subscriptions
  } = useApp();

  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [isSent, setIsSent] = useState(false);

  const targetSub: Subscription | undefined =
    activeReminderSubscription ||
    subscriptions.find(s => getDaysRemaining(s.expiryDate) <= 3) ||
    subscriptions[0];

  if (!isReminderPreviewModalOpen || !targetSub) return null;

  const daysLeft = getDaysRemaining(targetSub.expiryDate);

  const formattedWhatsAppText = `Namaste ${targetSub.customerName}! 🙏

This is a friendly reminder from *Bring My Bite (Shree Foods)* 🍱.

Your *${targetSub.packageType} (${targetSub.mealPreference})* subscription (ID: *${targetSub.id}*) is ending in *${daysLeft} days* on *${targetSub.expiryDate}*.

✨ *Why Renew Today?*
• Uninterrupted fresh meal deliveries to your gate & home
• Retain your *2x Monthly Chef's Bonus Feasts* (1st & 15th of the month)
• Keep your *Referral Sweets Program* active!

👉 *Click to Renew in 1-Click:*
https://bringmybite.in/renew?id=${targetSub.id}

Or simply reply *RENEW* to this message and our executive will assist you!
📞 Help Desk: 9004848984`;

  const formattedSmsText = `[Bring My Bite] Dear ${targetSub.customerName}, your ${targetSub.packageType} plan (${targetSub.id}) expires in ${daysLeft} days on ${targetSub.expiryDate}. Renew now at https://bringmybite.in/renew?id=${targetSub.id} to ensure continuous meals + 2x monthly bonus. Call: 9004848984`;

  const handleSend = () => {
    sendSubscriptionReminder(targetSub.id, channel);
    setIsSent(true);
    if (channel === 'whatsapp') {
      const url = `https://wa.me/91${targetSub.whatsappNumber || targetSub.mobileNumber}?text=${encodeURIComponent(formattedWhatsAppText)}`;
      window.open(url, '_blank');
    }
  };

  const handleOpenDirectRenew = () => {
    setIsReminderPreviewModalOpen(false);
    setSelectedSubscriptionForRenewal(targetSub);
    setIsRenewalModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl w-full max-w-xl shadow-2xl border-2 border-[#124E33] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#124E33] text-white p-5 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-black text-lg shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif-title tracking-wide text-[#FAF7F2]">
                3-Day Expiry Reminder Engine
              </h2>
              <p className="text-xs text-emerald-200">
                Automated customer WhatsApp & SMS renewal prompt
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsReminderPreviewModalOpen(false);
              setActiveReminderSubscription(null);
              setIsSent(false);
            }}
            className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAF7F2]">
          
          {/* Target User Info */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E8E1D5] shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Subscriber</div>
              <div className="text-sm font-bold text-gray-900">{targetSub.customerName}</div>
              <div className="text-xs text-gray-600">📱 {targetSub.mobileNumber} • ID: {targetSub.id}</div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                daysLeft <= 3 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900'
              }`}>
                <Clock className="w-3 h-3" />
                {daysLeft <= 0 ? 'Expired Today' : `${daysLeft} Days Left`}
              </span>
              <div className="text-[11px] text-gray-500 mt-1">Expiry: {targetSub.expiryDate}</div>
            </div>
          </div>

          {/* Channel Selector */}
          <div className="flex rounded-xl bg-[#EAE3D2] p-1 border border-[#DACFBC]">
            <button
              onClick={() => setChannel('whatsapp')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                channel === 'whatsapp'
                  ? 'bg-[#25D366] text-white shadow-xs'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Message (Recommended)</span>
            </button>
            <button
              onClick={() => setChannel('sms')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                channel === 'sms'
                  ? 'bg-[#124E33] text-white shadow-xs'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>SMS Alert</span>
            </button>
          </div>

          {/* Message Preview Screen */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-gray-700 flex justify-between items-center">
              <span>Message Preview (Live Content):</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Ready to dispatch</span>
            </div>

            {channel === 'whatsapp' ? (
              <div className="bg-[#EFEAE2] p-4 rounded-xl border border-gray-300 shadow-inner font-sans text-xs text-gray-800 whitespace-pre-line leading-relaxed relative">
                <div className="bg-white p-3.5 rounded-lg rounded-tl-none shadow-xs border border-gray-200">
                  {formattedWhatsAppText}
                  <div className="text-[10px] text-gray-400 text-right mt-2 flex items-center justify-end gap-1">
                    <span>11:30 AM</span>
                    <span className="text-blue-500 font-bold">✓✓</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-xs font-mono text-xs text-gray-800 whitespace-pre-line leading-relaxed">
                {formattedSmsText}
              </div>
            )}
          </div>

          {isSent && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Reminder dispatched to +91 {targetSub.mobileNumber}! Status logged.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleSend}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] ${
                channel === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#1EBE5D]' : 'bg-[#124E33] hover:bg-[#0C3822]'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Send 3-Day Expiry Reminder Now</span>
            </button>

            <button
              onClick={handleOpenDirectRenew}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-[#124E33] font-bold text-xs text-[#124E33] flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Simulate Customer 1-Click Renew Flow</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
