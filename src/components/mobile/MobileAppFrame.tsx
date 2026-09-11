import React from 'react';
import { useApp } from '../../context/AppContext';
import { SecureCustomerMobileView } from './SecureCustomerMobileView';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileAppFrameProps { children: React.ReactNode; }

export const MobileAppFrame: React.FC<MobileAppFrameProps> = ({ children }) => {
  const { deviceType, setDeviceType, activeRole } = useApp();
  const isInstalledApp = typeof window !== 'undefined' && (window.matchMedia?.('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true);
  const installedPlatform = typeof window !== 'undefined' && (/iPad|iPhone|iPod/.test(window.navigator.userAgent) || (/Macintosh/.test(window.navigator.userAgent) && window.navigator.maxTouchPoints > 1)) ? 'ios' : 'android';
  const effectiveDeviceType = deviceType === 'desktop' && isInstalledApp ? installedPlatform : deviceType;
  if (effectiveDeviceType === 'desktop') return <>{children}</>;
  const isIos = effectiveDeviceType === 'ios';

  return <div className={`min-h-screen w-full flex flex-col items-center justify-center overflow-hidden ${isInstalledApp ? 'bg-[#FAF7F2] p-0' : 'bg-stone-950 py-4 px-2 sm:px-4'}`}>
    {!isInstalledApp && <div className="mb-3 flex items-center justify-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl border border-stone-800">
      <span className="text-gray-400">Mobile:</span>
      <button type="button" onClick={() => setDeviceType('ios')} className={`px-3 py-1 rounded-full font-bold ${isIos ? 'bg-[#124E33] text-white' : 'text-gray-300'}`}> iPhone</button>
      <button type="button" onClick={() => setDeviceType('android')} className={`px-3 py-1 rounded-full font-bold ${!isIos ? 'bg-[#124E33] text-white' : 'text-gray-300'}`}>Android</button>
    </div>}
    <div className={`relative w-full bg-[#FAF7F2] overflow-hidden flex flex-col ${isInstalledApp ? 'max-w-none h-[100dvh] rounded-none' : 'max-w-[414px] h-[844px] rounded-[48px] border-[10px] border-stone-800 shadow-2xl'}`}>
      <div className="bg-[#0C3822] text-white px-6 pb-2 flex items-center justify-between text-xs font-bold shrink-0 z-30" style={{ paddingTop: isInstalledApp ? 'max(0.625rem, env(safe-area-inset-top))' : '0.625rem' }}>
        <span className="text-[11px]">{isIos ? '9:41' : '12:30 PM'}</span>
        <div className={`${isIos ? 'w-24 h-4' : 'w-3.5 h-3.5'} bg-black rounded-full mx-auto`} />
        <div className="flex items-center gap-1.5 text-emerald-200"><Signal className="w-3 h-3" /><Wifi className="w-3 h-3" /><Battery className="w-4 h-4" /></div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative">
        {activeRole === 'customer' ? <SecureCustomerMobileView /> : <div className="p-2">{children}</div>}
      </div>
      {isIos && <div className="bg-[#0C3822] flex justify-center shrink-0" style={{ paddingBottom: isInstalledApp ? 'max(0.25rem, env(safe-area-inset-bottom))' : '0.25rem' }}><div className="w-32 h-1 bg-white/40 rounded-full" /></div>}
    </div>
  </div>;
};
