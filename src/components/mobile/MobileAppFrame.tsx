import React from 'react';
import { useApp } from '../../context/AppContext';
import { MobileAppView } from './MobileAppView';
import {
  Wifi,
  Battery,
  Signal,
  Home,
  Calendar,
  Zap,
  User,
  ShieldCheck,
  QrCode,
  Download,
  Smartphone,
  ExternalLink
} from 'lucide-react';

interface MobileAppFrameProps {
  children: React.ReactNode;
}

export const MobileAppFrame: React.FC<MobileAppFrameProps> = ({ children }) => {
  const {
    deviceType,
    setDeviceType,
    activeRole,
    setActiveRole,
    mobileTab,
    setMobileTab,
    setIsNativeAppModalOpen
  } = useApp();

  if (deviceType === 'desktop') {
    return <>{children}</>;
  }

  const isIos = deviceType === 'ios';

  return (
    <div className="min-h-screen bg-stone-950 py-4 px-2 sm:px-4 flex flex-col items-center justify-center">
      
      {/* Device Switcher Bar at top of canvas */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl border border-stone-800">
        <span className="text-gray-400">Mobile Simulator:</span>
        <button
          onClick={() => setDeviceType('ios')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            isIos ? 'bg-[#124E33] text-white shadow-xs' : 'text-gray-300 hover:text-white'
          }`}
        >
           iPhone (iOS)
        </button>
        <button
          onClick={() => setDeviceType('android')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            !isIos ? 'bg-[#124E33] text-white shadow-xs' : 'text-gray-300 hover:text-white'
          }`}
        >
          🤖 Android (Pixel)
        </button>

        <button
          onClick={() => setIsNativeAppModalOpen(true)}
          className="px-3 py-1 bg-[#C88A24] hover:bg-[#A97116] text-black font-extrabold rounded-full text-xs flex items-center gap-1 shadow-xs"
        >
          <Download className="w-3 h-3" />
          <span>Export Native App</span>
        </button>

        <button
          onClick={() => setDeviceType('desktop')}
          className="px-3 py-1 bg-stone-800 hover:bg-stone-700 rounded-full text-xs text-amber-300 font-bold"
        >
          Full Web View ↗
        </button>
      </div>

      {/* Smartphone Chassis Frame */}
      <div
        className={`relative w-full max-w-[414px] h-[844px] bg-[#FAF7F2] rounded-[48px] shadow-2xl overflow-hidden border-[10px] flex flex-col ${
          isIos ? 'border-stone-800 ring-1 ring-stone-700' : 'border-stone-800 rounded-[38px]'
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        
        {/* Hardware Notch / Island */}
        {isIos ? (
          /* iOS Dynamic Island & Status Bar */
          <div className="bg-[#0C3822] text-white pt-2.5 px-6 pb-2 flex items-center justify-between text-xs font-bold select-none shrink-0 z-30">
            <span className="text-[11px] font-semibold tracking-tight">9:41</span>
            {/* Dynamic Island Pill */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-4 text-emerald-300" />
            </div>
          </div>
        ) : (
          /* Android Punch-hole & Status Bar */
          <div className="bg-[#0C3822] text-white pt-2 px-5 pb-2 flex items-center justify-between text-xs font-medium select-none shrink-0 z-30">
            <span className="text-[11px]">12:30 PM</span>
            {/* Camera Punch Hole */}
            <div className="w-3.5 h-3.5 bg-black rounded-full mx-auto"></div>
            <div className="flex items-center gap-2 text-emerald-200">
              <Wifi className="w-3 h-3" />
              <Signal className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Scrollable Mobile App Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {activeRole === 'customer' ? (
            <MobileAppView platform={isIos ? 'ios' : 'android'} />
          ) : (
            <div className="p-2">{children}</div>
          )}
        </div>

        {/* Mobile App Bottom Tab Navigation Bar */}
        <div className="bg-[#0C3822] text-white border-t border-emerald-900 py-2.5 px-3 flex items-center justify-around shrink-0 select-none z-30">
          <button
            onClick={() => {
              setActiveRole('customer');
              setMobileTab('home');
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              activeRole === 'customer' && mobileTab === 'home'
                ? 'text-[#F2C94C]'
                : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              setActiveRole('customer');
              setMobileTab('menu');
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              activeRole === 'customer' && mobileTab === 'menu'
                ? 'text-[#F2C94C]'
                : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Menu</span>
          </button>

          {/* Center Floating Action Pill */}
          <button
            onClick={() => {
              setActiveRole('customer');
              setMobileTab('instant');
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-3 py-1 rounded-full border shadow-sm transition-transform active:scale-90 ${
              activeRole === 'customer' && mobileTab === 'instant'
                ? 'bg-[#C88A24] text-black border-[#F2C94C]'
                : 'bg-[#124E33] text-[#F2C94C] border-[#C88A24]'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Instant</span>
          </button>

          <button
            onClick={() => {
              setActiveRole('customer');
              setMobileTab('pass');
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              activeRole === 'customer' && mobileTab === 'pass'
                ? 'text-[#F2C94C]'
                : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>My Pass</span>
          </button>

          <button
            onClick={() => {
              setActiveRole('customer');
              setMobileTab('portal');
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              activeRole !== 'customer' || mobileTab === 'portal'
                ? 'text-[#F2C94C]'
                : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Portals</span>
          </button>
        </div>

        {/* iOS Home Indicator Bar */}
        {isIos && (
          <div className="bg-[#0C3822] pb-1 flex justify-center shrink-0">
            <div className="w-32 h-1 bg-white/40 rounded-full"></div>
          </div>
        )}

      </div>
    </div>
  );
};
