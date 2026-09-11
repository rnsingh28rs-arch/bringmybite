import React from 'react';
import { useApp } from '../../context/AppContext';
import { SecureCustomerMobileView } from './SecureCustomerMobileView';
import { InstantOrderModal } from '../customer/InstantOrderModal';
import { RegistrationModal } from '../customer/RegistrationModal';

interface MobileAppFrameProps { children: React.ReactNode; }

export const MobileAppFrame: React.FC<MobileAppFrameProps> = ({ children }) => {
  const { deviceType, activeRole } = useApp();
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

  // Keep the customer app on one normal page scroll. The previous nested
  // overflow-y-auto phone frame could intercept iOS PWA touch gestures/taps.
  if (activeRole === 'customer') {
    return (
      <div
        className="min-h-screen w-full bg-[#FAF7F2] touch-manipulation"
        style={{
          paddingTop: isInstalledApp ? 'env(safe-area-inset-top)' : undefined,
          paddingBottom: isInstalledApp ? 'env(safe-area-inset-bottom)' : undefined,
        }}
      >
        <SecureCustomerMobileView />
        <InstantOrderModal />
        <RegistrationModal />
      </div>
    );
  }

  return <>{children}</>;
};
