import React, { useState, useEffect } from 'react';
import { TopBar } from './components/common/TopBar';
import { TodayMenuTicker } from './components/common/TodayMenuTicker';
import { HeroBanner } from './components/customer/HeroBanner';
import { PackagesSection } from './components/customer/PackagesSection';
import { LowerFeaturesGrid } from './components/customer/LowerFeaturesGrid';
import { Footer } from './components/common/Footer';
import { ChatBox } from './components/common/ChatBox';
import { LiveActiveOrderBar } from './components/customer/LiveActiveOrderBar';

// Customer Modals
import { InstantOrderModal } from './components/customer/InstantOrderModal';
import { RegistrationModal } from './components/customer/RegistrationModal';
import { TrackOrderModal } from './components/customer/TrackOrderModal';
import { RenewalModal } from './components/customer/RenewalModal';

// Staff Panels
import { SuperAdminPanel } from './components/panels/SuperAdminPanel';
import { AdminPanel } from './components/panels/AdminPanel';
import { ManagerPanel } from './components/panels/ManagerPanel';
import { ChefPanel } from './components/panels/ChefPanel';
import { StaffNavBar } from './components/panels/StaffNavBar';

export const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState<string>(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleExitToHome = () => {
    window.location.hash = '';
    setCurrentHash('');
  };

  // Staff Panel Routing
  if (currentHash === '#superadmin' || currentHash === '#dadmin') {
    return (
      <div className="min-h-screen bg-[#0E1712] text-[#FAF7F2]">
        <StaffNavBar activeRole="superadmin" onExit={handleExitToHome} />
        <SuperAdminPanel onClose={handleExitToHome} />
      </div>
    );
  }

  if (currentHash === '#admin') {
    return (
      <div className="min-h-screen bg-[#0E1712] text-[#FAF7F2]">
        <StaffNavBar activeRole="admin" onExit={handleExitToHome} />
        <AdminPanel onClose={handleExitToHome} />
      </div>
    );
  }

  if (currentHash === '#manager') {
    return (
      <div className="min-h-screen bg-[#0E1712] text-[#FAF7F2]">
        <StaffNavBar activeRole="manager" onExit={handleExitToHome} />
        <ManagerPanel onClose={handleExitToHome} />
      </div>
    );
  }

  if (currentHash === '#chef') {
    return (
      <div className="min-h-screen bg-[#0E1712] text-[#FAF7F2]">
        <StaffNavBar activeRole="chef" onExit={handleExitToHome} />
        <ChefPanel onClose={handleExitToHome} />
      </div>
    );
  }

  // Default Customer Website View
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A2E22] flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Announcement Bar */}
      <TopBar />

      {/* Live Menu Ticker */}
      <TodayMenuTicker />

      {/* Main Page Sections */}
      <main className="flex-1 w-full space-y-4">
        <HeroBanner />
        <PackagesSection />
        <LowerFeaturesGrid />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Helpers & Widgets */}
      <LiveActiveOrderBar />
      <ChatBox />

      {/* Modals Container */}
      <InstantOrderModal />
      <RegistrationModal />
      <TrackOrderModal />
      <RenewalModal />
    </div>
  );
};
