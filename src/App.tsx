import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CmsProvider } from './cms/CmsContext';

// Common Components
import { TopBar } from './components/common/TopBar';
import { Header } from './components/common/Header';
import { TodayMenuTicker } from './components/common/TodayMenuTicker';
import { Footer } from './components/common/Footer';
import { ChatBox } from './components/common/ChatBox';
import { StaffLoginModal } from './components/common/StaffLoginModal';

// Customer Sections
import { HeroBanner } from './components/customer/HeroBanner';
import { PackagesSection } from './components/customer/PackagesSection';
import { LowerFeaturesGrid } from './components/customer/LowerFeaturesGrid';
import { ExpiryReminderBanner } from './components/customer/ExpiryReminderBanner';

// Customer Modals
import { WeeklyMenuModal } from './components/customer/WeeklyMenuModal';
import { RegistrationModal } from './components/customer/RegistrationModal';
import { InstantOrderModal } from './components/customer/InstantOrderModal';
import { ReferralModal } from './components/customer/ReferralModal';
import { BonusOffersModal } from './components/customer/BonusOffersModal';
import { RenewalModal } from './components/customer/RenewalModal';
import { ReminderPreviewModal } from './components/customer/ReminderPreviewModal';

// Mobile & Panels
import { MobileAppFrame } from './components/mobile/MobileAppFrame';
import { NativeAppDownloadModal } from './components/mobile/NativeAppDownloadModal';
import { StaffNavBar } from './components/panels/StaffNavBar';
import { SuperAdminPanel } from './components/panels/SuperAdminPanel';
import { AdminPanel } from './components/panels/AdminPanel';
import { ManagerPanel } from './components/panels/ManagerPanel';
import { ChefPanel } from './components/panels/ChefPanel';
import { DAdminDesigner } from './components/panels/DAdminDesigner';

const MainContent: React.FC = () => {
  const { activeRole, setActiveRole } = useApp();
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      setCurrentHash(hash);

      if (hash === '#admin') {
        setActiveRole('admin');
      } else if (hash === '#manager') {
        setActiveRole('manager');
      } else if (hash === '#chef') {
        setActiveRole('chef');
      } else if (hash === '#superadmin' || hash === '#dadmin' || hash === '#d-admin') {
        setActiveRole('superadmin');
      } else if (!hash || hash === '#' || hash === '#customer') {
        setActiveRole('customer');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setActiveRole]);

  const handleExitToHome = () => {
    window.location.hash = '';
    setCurrentHash('');
    setActiveRole('customer');
  };

  // Direct Designer View
  if (window.location.pathname.toLowerCase().startsWith('/d-admin')) {
    return <DAdminDesigner />;
  }

  return (
    <MobileAppFrame>
      <div className="min-h-screen bg-[#FAF7F2] text-[#1A261E] flex flex-col font-sans">
        {/* Top Info Bar */}
        <TopBar />

        {/* Global Navigation Header */}
        <Header />

        {/* Live Menu Running Strip */}
        <TodayMenuTicker />

        {/* Staff Top Navigation Bar */}
        {activeRole !== 'customer' && (
          <StaffNavBar activeRole={activeRole as any} onExit={handleExitToHome} />
        )}

        {/* Main Workspace Body */}
        <main className="flex-1">
          {activeRole === 'customer' && (
            <>
              <ExpiryReminderBanner />
              <HeroBanner />
              <PackagesSection />
              <LowerFeaturesGrid />
            </>
          )}

          {activeRole === 'admin' && <AdminPanel onClose={handleExitToHome} />}
          {activeRole === 'manager' && <ManagerPanel onClose={handleExitToHome} />}
          {activeRole === 'chef' && <ChefPanel onClose={handleExitToHome} />}
          {activeRole === 'superadmin' && <SuperAdminPanel onClose={handleExitToHome} />}
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating Support & Chat Box */}
        <ChatBox />

        {/* Interactive Modals */}
        <WeeklyMenuModal />
        <RegistrationModal />
        <InstantOrderModal />
        <ReferralModal />
        <BonusOffersModal />
        <RenewalModal />
        <ReminderPreviewModal />
        <NativeAppDownloadModal />
        <StaffLoginModal />
      </div>
    </MobileAppFrame>
  );
};

export default function App() {
  return (
    <CmsProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </CmsProvider>
  );
}

export { App };
