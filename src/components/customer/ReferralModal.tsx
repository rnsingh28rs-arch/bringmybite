import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Gift,
  Share2,
  Copy,
  Check,
  Sparkles,
  Heart,
  Calendar,
  CheckCircle2,
  Users,
  Award,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReferralModal: React.FC = () => {
  const {
    isReferralModalOpen,
    setIsReferralModalOpen,
    subscriptions,
    referrals,
    setIsRegistrationOpen
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<string>(
    subscriptions[0]?.id || 'BMB-1001'
  );

  if (!isReferralModalOpen) return null;

  const currentSub = subscriptions.find(s => s.id === selectedSubId) || subscriptions[0];
  const userCode = currentSub?.myReferralCode || 'SWEET-BMB100';
  const sweetsWeeksEarned = currentSub?.complimentarySweetsEarnedWeeks || 0;

  const userReferrals = referrals.filter(
    r => r.referrerCode === userCode || r.referrerPhone === currentSub?.mobileNumber
  );

  const shareText = `🍱 Hey! I use Bring My Bite (by Shree Foods) for delicious homely tiffin meals delivered directly to College/Office Gate & Home. Register for a monthly subscription with my referral code *${userCode}* to enjoy fresh meals + 2x monthly bonus treats, and I will get 1 full week of complimentary sweets! Register here: https://bringmybite.in?ref=${userCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-2xl w-full max-w-2xl shadow-2xl border-2 border-[#D99B26] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with Warm Festive Gold/Emerald Theme */}
        <div className="bg-gradient-to-r from-[#124E33] via-[#1B5E20] to-[#0C3822] text-white p-5 sm:p-6 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#D99B26]/20 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F2C94C] to-[#D99B26] text-black flex items-center justify-center shadow-lg font-black text-2xl">
                🍬
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D99B26]/30 text-[#F2C94C] border border-[#F2C94C]/40 text-[11px] font-bold tracking-wide uppercase mb-1">
                  <Sparkles className="w-3 h-3 text-[#F2C94C]" />
                  Refer & Treat Yourself
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif-title tracking-tight text-[#FAF7F2]">
                  Referral Rewards Program
                </h2>
                <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
                  Give the gift of homely food • Get <span className="text-[#F2C94C] font-bold">1 Full Week of Complimentary Sweets</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsReferralModalOpen(false)}
              className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FAF7F2]">
          
          {/* Subscriber Persona Selector (for Demo / Multi-User testing) */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E8E1D5] shadow-xs">
            <label className="text-xs font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#124E33]" />
              Active Subscriber Account:
            </label>
            <div className="flex flex-wrap gap-2">
              {subscriptions.slice(0, 4).map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubId(sub.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedSubId === sub.id
                      ? 'bg-[#124E33] text-white border-[#124E33] shadow-xs'
                      : 'bg-[#F4EFE6] text-gray-700 border-[#DACFBC] hover:border-[#124E33]'
                  }`}
                >
                  {sub.customerName} ({sub.myReferralCode || sub.id})
                </button>
              ))}
            </div>
          </div>

          {/* Referral Code Box */}
          <div className="bg-gradient-to-br from-[#FFF9E6] to-[#FFF3CD] border-2 border-dashed border-[#D99B26] p-5 rounded-2xl text-center shadow-xs relative">
            <div className="inline-block bg-[#D99B26] text-black text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              Your Unique Referral Code
            </div>
            
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-[#124E33] my-2 select-all">
              {userCode}
            </div>

            <p className="text-xs text-gray-700 max-w-md mx-auto mb-4 leading-relaxed">
              Share this code with friends or classmates. When they enter it during registration for any monthly plan, our kitchen adds <span className="font-bold text-[#124E33]">7 Days of Free Fresh Sweets</span> directly into your lunch or dinner tiffin!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleCopyCode}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-[#124E33] font-bold text-xs sm:text-sm border border-[#124E33]/30 shadow-xs flex items-center gap-2 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Code Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Share2 className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Rewards Tracker & Sweets Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Left: Sweets Earned Card */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E1D5] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#D99B26]" />
                  <h4 className="font-bold text-sm text-[#1A261E]">Complimentary Sweets Status</h4>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#124E33]">
                  {sweetsWeeksEarned > 0 ? `${sweetsWeeksEarned * 7} Days Earned` : 'Ready to Earn'}
                </span>
              </div>

              <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E1D5] mb-3">
                <div className="text-xs text-gray-600 flex justify-between mb-1">
                  <span>Successful Referrals:</span>
                  <span className="font-bold text-gray-900">{userReferrals.length} friends</span>
                </div>
                <div className="text-xs text-gray-600 flex justify-between">
                  <span>Complimentary Sweet Weeks:</span>
                  <span className="font-bold text-[#124E33]">{sweetsWeeksEarned} week{sweetsWeeksEarned !== 1 ? 's' : ''} (7 days/ref)</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 italic">
                *Sweets are prepared fresh daily in our kitchen using pure desi ghee & organic ingredients.
              </p>
            </div>

            {/* Right: Sweets Rotation Lineup */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E1D5] shadow-xs">
              <h4 className="font-bold text-sm text-[#1A261E] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D99B26]" />
                7-Day Complimentary Sweet Lineup:
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FFF3CD] text-[#D99B26] flex items-center justify-center font-bold text-[10px]">Mon</span>
                  <span>Hot Desi Ghee Gulab Jamun (2 pcs)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FFF3CD] text-[#D99B26] flex items-center justify-center font-bold text-[10px]">Tue</span>
                  <span>Soft Sponge Bengali Rasgulla</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FFF3CD] text-[#D99B26] flex items-center justify-center font-bold text-[10px]">Wed</span>
                  <span>Rich Moong Dal Halwa</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FFF3CD] text-[#D99B26] flex items-center justify-center font-bold text-[10px]">Thu</span>
                  <span>Silver-leaf Kaju Katli (2 pcs)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FFF3CD] text-[#D99B26] flex items-center justify-center font-bold text-[10px]">Fri</span>
                  <span>Shahi Kesar Rabdi & Malpua</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FFF3CD] text-[#D99B26] flex items-center justify-center font-bold text-[10px]">Sat</span>
                  <span>Gajar Halwa / Besan Ladoo</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FFF3CD] text-[#D99B26] flex items-center justify-center font-bold text-[10px]">Sun</span>
                  <span>Festive Rasmalai Delight</span>
                </li>
              </ul>
            </div>

          </div>

          {/* How It Works 3-Step Guide */}
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E1D5]">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3 text-center">
              How the Referral Reward Works
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-[#E8E1D5] text-center">
                <div className="w-7 h-7 rounded-full bg-[#124E33] text-white font-bold text-xs flex items-center justify-center mx-auto mb-1.5">
                  1
                </div>
                <div className="font-bold text-xs text-gray-900">Share Your Code</div>
                <p className="text-[11px] text-gray-600 mt-1">
                  Send your referral code to hostel mates or colleagues.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#E8E1D5] text-center">
                <div className="w-7 h-7 rounded-full bg-[#124E33] text-white font-bold text-xs flex items-center justify-center mx-auto mb-1.5">
                  2
                </div>
                <div className="font-bold text-xs text-gray-900">Friend Subscribes</div>
                <p className="text-[11px] text-gray-600 mt-1">
                  They enter your code in the registration form.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#E8E1D5] text-center">
                <div className="w-7 h-7 rounded-full bg-[#D99B26] text-black font-bold text-xs flex items-center justify-center mx-auto mb-1.5">
                  3
                </div>
                <div className="font-bold text-xs text-[#124E33]">Enjoy Free Sweets!</div>
                <p className="text-[11px] text-gray-600 mt-1">
                  Receive 7 continuous days of complimentary sweets in your tiffin!
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-[#E8E1D5] p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-600">
            No limits! Refer 4 friends = 4 entire weeks of free sweets.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsReferralModalOpen(false);
                setIsRegistrationOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#124E33] hover:bg-[#0C3822] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Register with Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
