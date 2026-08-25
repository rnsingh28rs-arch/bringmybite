import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Gift,
  Calendar,
  Sparkles,
  CheckCircle2,
  Utensils,
  PartyPopper,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BonusOffersModal: React.FC = () => {
  const {
    isBonusOffersModalOpen,
    setIsBonusOffersModalOpen,
    bonusOffers,
    subscriptions,
    claimBonusOffer,
    setIsRegistrationOpen
  } = useApp();

  const [selectedSubId, setSelectedSubId] = useState<string>(
    subscriptions[0]?.id || 'BMB-1001'
  );
  const [claimedAlert, setClaimedAlert] = useState<string | null>(null);

  if (!isBonusOffersModalOpen) return null;

  const currentSub = subscriptions.find(s => s.id === selectedSubId) || subscriptions[0];

  const handleClaim = (bonusId: string, title: string) => {
    if (currentSub) {
      claimBonusOffer(currentSub.id, bonusId);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
      setClaimedAlert(`🎉 "${title}" confirmed for delivery on your subscription meal!`);
      setTimeout(() => setClaimedAlert(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl w-full max-w-3xl shadow-2xl border-2 border-[#124E33] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-[#124E33] via-[#1B5E20] to-[#0C3822] text-white p-5 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#D99B26] text-black flex items-center justify-center shadow-lg font-black text-2xl">
                🎁
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D99B26]/30 text-[#F2C94C] border border-[#F2C94C]/40 text-[11px] font-bold tracking-wide uppercase mb-1">
                  <Sparkles className="w-3 h-3 text-[#F2C94C]" />
                  Included Free For All Subscribers
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif-title tracking-tight text-[#FAF7F2]">
                  Twice-A-Month Bonus Offer Program
                </h2>
                <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
                  Exclusive royal upgrades & dessert boxes on the <span className="font-bold text-[#F2C94C]">1st & 15th of every month</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsBonusOffersModalOpen(false)}
              className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FAF7F2]">
          
          {/* Notification Alert if Claimed */}
          {claimedAlert && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-[#124E33] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{claimedAlert}</span>
            </div>
          )}

          {/* Active Subscriber Selector */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E8E1D5] shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#124E33]" />
              <span className="text-xs font-bold text-gray-700">Testing with Subscriber:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {subscriptions.slice(0, 4).map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubId(sub.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                    selectedSubId === sub.id
                      ? 'bg-[#124E33] text-white border-[#124E33]'
                      : 'bg-[#F4EFE6] text-gray-700 border-[#DACFBC]'
                  }`}
                >
                  {sub.customerName} ({sub.packageType})
                </button>
              ))}
            </div>
          </div>

          {/* Both Bonus Offer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bonusOffers.map((offer, idx) => {
              const isClaimed = currentSub?.biMonthlyBonusClaimed?.includes(offer.id);

              return (
                <div
                  key={offer.id}
                  className={`bg-white rounded-2xl border-2 transition-all p-5 flex flex-col justify-between shadow-xs ${
                    idx === 1 ? 'border-[#D99B26]' : 'border-[#124E33]'
                  }`}
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#124E33] border border-[#124E33]/20 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#D99B26]" />
                        {offer.cycleDate}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Next: {offer.nextUpcomingDate}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#1A261E] mb-2 leading-snug">
                      {offer.title}
                    </h3>

                    <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                      {offer.description}
                    </p>

                    {/* Treat items list */}
                    <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8E1D5] mb-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1">
                        <Utensils className="w-3 h-3 text-[#124E33]" />
                        Complimentary Inclusions:
                      </div>
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        {offer.treatItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D99B26] mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Claim Button */}
                  <div className="pt-2">
                    {isClaimed ? (
                      <button
                        disabled
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-100 text-[#124E33] font-bold text-xs flex items-center justify-center gap-2 cursor-default border border-emerald-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Included in Your Active Subscription</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleClaim(offer.id, offer.title)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#124E33] hover:bg-[#0C3822] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                      >
                        <Gift className="w-4 h-4 text-[#F2C94C]" />
                        <span>Confirm Bonus for Next Cycle</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Value Highlights Box */}
          <div className="bg-gradient-to-r from-[#FFF9E6] to-[#FFF3CD] p-4 rounded-xl border border-[#D99B26]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <PartyPopper className="w-8 h-8 text-[#D99B26] shrink-0" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#1A261E]">
                  Total Annual Bonus Value: ₹1,800+ Included Free!
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-700 mt-0.5">
                  24 complimentary celebratory feasts per year automatically included with all monthly tiffin subscriptions.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsBonusOffersModalOpen(false);
                setIsRegistrationOpen(true);
              }}
              className="px-4 py-2 bg-[#124E33] hover:bg-[#0C3822] text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              Subscribe Today
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-white border-t border-[#E8E1D5] p-4 sm:p-5 flex items-center justify-between shrink-0">
          <p className="text-xs text-gray-500">
            *Bonus meals are prepared by Master Chefs with zero synthetic additives.
          </p>
          <button
            onClick={() => setIsBonusOffersModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
