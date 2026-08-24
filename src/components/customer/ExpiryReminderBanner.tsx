import React from 'react';
import { useApp, getDaysRemaining } from '../../context/AppContext';
import { Clock, RotateCcw, MessageSquare, X, Sparkles, ChevronRight } from 'lucide-react';

export const ExpiryReminderBanner: React.FC = () => {
  const {
    subscriptions,
    activeRole,
    expiryBannerDismissed,
    setExpiryBannerDismissed,
    setIsRenewalModalOpen,
    setSelectedSubscriptionForRenewal,
    setIsReminderPreviewModalOpen,
    setActiveReminderSubscription
  } = useApp();

  if (activeRole !== 'customer' || expiryBannerDismissed) return null;

  // Find any real customer's subscription expiring in <= 3 days that was approved
  // Never show hardcoded demo user banner automatically to general users
  const expiringSub = subscriptions.find(s => {
    if (!s.active || s.verificationStatus !== 'Approved') return false;
    // Don't trigger banner on sample seed data
    if (s.id.startsWith('DEMO-') || s.customerName.includes('Aarav')) return false;
    const days = getDaysRemaining(s.expiryDate);
    return days <= 3 && days >= 0;
  });

  if (!expiringSub) return null;

  const daysRemaining = getDaysRemaining(expiringSub.expiryDate);

  const handleRenewClick = () => {
    setSelectedSubscriptionForRenewal(expiringSub);
    setIsRenewalModalOpen(true);
  };

  const handlePreviewReminder = () => {
    setActiveReminderSubscription(expiringSub);
    setIsReminderPreviewModalOpen(true);
  };

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-white py-2.5 px-4 shadow-md sticky top-20 z-30 border-b border-amber-700 animate-in slide-in-from-top-4 duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-xs sm:text-sm">
        
        {/* Left message */}
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold uppercase tracking-wide bg-black/20 px-2 py-0.5 rounded text-[10px] mr-2">
              Subscription Ending Soon
            </span>
            <span className="font-semibold">
              Hello {expiringSub.customerName}! Your <strong className="underline">{expiringSub.packageType}</strong> subscription expires in{' '}
              <strong className="text-yellow-100 font-extrabold">
                {daysRemaining === 0 ? 'today' : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`} ({expiringSub.expiryDate})
              </strong>.
            </span>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePreviewReminder}
            title="Preview WhatsApp Reminder Message"
            className="px-3 py-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden md:inline">WhatsApp Alert</span>
          </button>

          <button
            onClick={handleRenewClick}
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-yellow-50 text-[#124E33] font-bold text-xs shadow-xs flex items-center gap-1 transition-all hover:scale-[1.02]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>1-Click Renew</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setExpiryBannerDismissed(true)}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-1"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
