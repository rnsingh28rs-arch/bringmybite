import React from 'react';
import { useApp } from '../../context/AppContext';
import { MobileAppView } from './MobileAppView';
import { SecureCustomerMobileView } from './SecureCustomerMobileView';
import { Wifi, Battery, Signal, Home, Calendar, Zap, QrCode, Download } from 'lucide-react';

interface MobileAppFrameProps { children: React.ReactNode; }

export const MobileAppFrame: React.FC<MobileAppFrameProps> = ({ children }) => {
  const { deviceType, setDeviceType, activeRole, setActiveRole, setIsNativeAppModalOpen } = useApp();
  const isInstalledApp = typeof window !== 'undefined' && (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
  const installedPlatform = typeof window !== 'undefined' && (
    /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
    (/Macintosh/.test(window.navigator.userAgent) && window.navigator.maxTouchPoints > 1)
  ) ? 'ios' : 'android';
  const effectiveDeviceType = deviceType === 'desktop' && isInstalledApp ? installedPlatform : deviceType;
  if (effectiveDeviceType === 'desktop') return <>{children}</>;
  const isIos = effectiveDeviceType === 'ios';

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center overflow-hidden ${isInstalledApp ? 'bg-[#FAF7F2] p-0' : 'bg-stone-950 py-4 px-2 sm:px-4'}`}>
      {!isInstalledApp && <div className="mb-3 flex flex-wrap items-center justify-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl border border-stone-800">
        <span className="text-gray-400">Mobile Simulator:</span>
        <button onClick={() => setDeviceType('ios')} className={`px-3 py-1 rounded-full font-bold ${isIos ? 'bg-[#124E33] text-white' : 'text-gray-300'}`}> iPhone (iOS)</button>
        <button onClick={() => setDeviceType('android')} className={`px-3 py-1 rounded-full font-bold ${!isIos ? 'bg-[#124E33] text-white' : 'text-gray-300'}`}>🤖 Android (Pixel)</button>
        <button onClick={() => setIsNativeAppModalOpen(true)} className="px-3 py-1 bg-[#C88A24] text-black font-extrabold rounded-full text-xs flex items-center gap-1"><Download className="w-3 h-3"/>Export Native App</button>
        <button onClick={() => setDeviceType('desktop')} className="px-3 py-1 bg-stone-800 rounded-full text-xs text-amber-300 font-bold">Full Web View ↗</button>
      </div>}

      <div className={`relative w-full bg-[#FAF7F2] overflow-hidden flex flex-col ${isInstalledApp ? 'max-w-none h-[100dvh] rounded-none' : `max-w-[414px] h-[844px] rounded-[48px] border-[10px] border-stone-800 shadow-2xl`}`}>
        <div className="bg-[#0C3822] text-white px-6 pb-2 flex items-center justify-between text-xs font-bold shrink-0 z-30" style={{paddingTop:isInstalledApp?'max(0.625rem, env(safe-area-inset-top))':'0.625rem'}}>
          <span className="text-[11px]">{isIos ? '9:41' : '12:30 PM'}</span>
          <div className={`${isIos?'w-24 h-4':'w-3.5 h-3.5'} bg-black rounded-full mx-auto flex items-center justify-center`}><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/></div>
          <div className="flex items-center gap-1.5 text-emerald-200"><Signal className="w-3 h-3"/><Wifi className="w-3 h-3"/><Battery className="w-4 h-4"/></div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative">
          {activeRole === 'customer'
            ? (isInstalledApp ? <SecureCustomerMobileView/> : <MobileAppView platform={isIos ? 'ios' : 'android'}/>)
            : <div className="p-2">{children}</div>}
        </div>

        {activeRole === 'customer' && isInstalledApp ? (
          <div className="bg-[#0C3822] text-white border-t border-emerald-900 py-2 px-2 flex items-center justify-around shrink-0">
            <span className="sr-only">Customer navigation</span>
          </div>
        ) : activeRole === 'customer' ? (
          <div className="bg-[#0C3822] text-white border-t border-emerald-900 py-2.5 px-3 flex items-center justify-around shrink-0">
            <button onClick={()=>setActiveRole('customer')} className="text-emerald-300 text-[10px] font-bold flex flex-col items-center gap-0.5"><Home className="w-4 h-4"/>Home</button>
            <button onClick={()=>setActiveRole('customer')} className="text-emerald-300 text-[10px] font-bold flex flex-col items-center gap-0.5"><Calendar className="w-4 h-4"/>Menu</button>
            <button onClick={()=>setActiveRole('customer')} className="text-emerald-300 text-[10px] font-bold flex flex-col items-center gap-0.5"><Zap className="w-4 h-4"/>Instant</button>
            <button onClick={()=>setActiveRole('customer')} className="text-emerald-300 text-[10px] font-bold flex flex-col items-center gap-0.5"><QrCode className="w-4 h-4"/>Pass</button>
          </div>
        ) : null}
        {isIos && <div className="bg-[#0C3822] flex justify-center shrink-0" style={{paddingBottom:isInstalledApp?'max(0.25rem, env(safe-area-inset-bottom))':'0.25rem'}}><div className="w-32 h-1 bg-white/40 rounded-full"/></div>}
      </div>
    </div>
  );
};
