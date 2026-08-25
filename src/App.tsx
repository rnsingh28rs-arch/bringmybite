import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/common/TopBar';
import { Header } from './components/common/Header';
import { TodayMenuTicker } from './components/common/TodayMenuTicker';
import { Footer } from './components/common/Footer';
import { ChatBox } from './components/common/ChatBox';
import { HeroBanner } from './components/customer/HeroBanner';
import { PackagesSection } from './components/customer/PackagesSection';
import { LowerFeaturesGrid } from './components/customer/LowerFeaturesGrid';
import { WeeklyMenuModal } from './components/customer/WeeklyMenuModal';
import { RegistrationModal } from './components/customer/RegistrationModal';
import { InstantOrderModal } from './components/customer/InstantOrderModal';
import { ReferralModal } from './components/customer/ReferralModal';
import { BonusOffersModal } from './components/customer/BonusOffersModal';
import { RenewalModal } from './components/customer/RenewalModal';
import { ReminderPreviewModal } from './components/customer/ReminderPreviewModal';
import { ExpiryReminderBanner } from './components/customer/ExpiryReminderBanner';
import { OrderStatusNotifier } from './components/customer/OrderStatusNotifier';
import { NativeAppDownloadModal } from './components/mobile/NativeAppDownloadModal';
import { StaffLoginModal } from './components/common/StaffLoginModal';
import { StaffNavBar } from './components/panels/StaffNavBar';
import { AdminPanel } from './components/panels/AdminPanel';
import { ManagerPanel } from './components/panels/ManagerPanel';
import { ChefPanel } from './components/panels/ChefPanel';
import { MobileAppFrame } from './components/mobile/MobileAppFrame';
import { DAdminDesigner } from './components/panels/DAdminDesigner';
import { CalculatorWidget } from './components/common/CalculatorWidget';
import { CmsProvider } from './cms/CmsContext';

const MainContent: React.FC = () => {
  const { activeRole, setActiveRole, openStaffLogin, authenticatedRoles } = useApp();

  // Support direct route checking e.g. /admin in URL
  useEffect(() => {
    const onPop = () => {
      const p = window.location.pathname.toLowerCase();
      if (p === '/' || p === '') setActiveRole('customer');
    };
    window.addEventListener('popstate', onPop);
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    
    if (path.includes('/admin') || hash.includes('admin') || search.includes('role=admin')) {
      if (authenticatedRoles.admin) {
        setActiveRole('admin');
      } else {
        openStaffLogin('admin');
      }
    } else if (path.includes('/manager') || hash.includes('manager') || search.includes('role=manager')) {
      if (authenticatedRoles.manager) {
        setActiveRole('manager');
      } else {
        openStaffLogin('manager');
      }
    } else if (path.includes('/chef') || hash.includes('chef') || search.includes('role=chef')) {
      if (authenticatedRoles.chef) {
        setActiveRole('chef');
      } else {
        openStaffLogin('chef');
      }
    }
    return () => window.removeEventListener('popstate', onPop);
  }, [setActiveRole, openStaffLogin, authenticatedRoles]);

  if (window.location.pathname.toLowerCase().startsWith('/d-admin') || window.location.hash.toLowerCase() === '#d-admin' || window.location.hash.toLowerCase() === '#superadmin') {
    return <DAdminDesigner />;
  }

  return (
    <MobileAppFrame>
      <div className="min-h-screen bg-[#FAF7F2] text-[#1A261E] flex flex-col font-sans">
        
        {/* Top Info Bar */}
        <TopBar />

        {/* Global Navigation Header (Public Customer Header) */}
        <Header />

        {/* Running Strip showing Today's Menu */}
        <TodayMenuTicker />

        {/* Staff Workspace Top Navigation (Only shown when Admin/Manager/Chef is active) */}
        {activeRole !== 'customer' && <StaffNavBar />}

        {/* Main Workspace Body based on Active Role */}
        <main className="flex-1">
          {activeRole === 'customer' && (
            <>
              {/* Expiry Reminder Notification Banner */}
              <ExpiryReminderBanner />
              <OrderStatusNotifier />

              {/* 4 Feature Banners + Thali Card */}
              <HeroBanner />

              {/* 3 Monthly Subscription Packages (Veg, Egg, Non-Veg) */}
              <PackagesSection />

              {/* Delivery Model (College/Office Gate) + Why Us + Today's Menu */}
              <LowerFeaturesGrid />
            </>
          )}

          {activeRole === 'admin' && <AdminPanel />}

          {activeRole === 'manager' && <ManagerPanel />}

          {activeRole === 'chef' && <ChefPanel />}
        </main>

        {/* Calculator is for staff workspaces only. Customer gets the support chatbot instead. */}
        {(activeRole === 'manager' || activeRole === 'chef') && <CalculatorWidget />}

        {/* Global Footer */}
        <Footer />

        {/* Floating Support & Quick Order Chat Box */}
        {activeRole === 'customer' && <ChatBox />}

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
