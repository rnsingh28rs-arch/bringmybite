import React, { useEffect, useState } from 'react';
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
import { DAdminGuard } from './components/panels/DAdminGuard';
import { CalculatorWidget } from './components/common/CalculatorWidget';
import { CmsProvider } from './cms/CmsContext';
import { getCurrentUser, isSupabaseConfigured, signOut, supabaseSelect } from './cms/supabaseRest';

type StaffRole = 'admin' | 'manager' | 'chef';
type StaffAccount = { user_id: string; email: string; role_id: StaffRole; active: boolean };

const LockedDAdminNotice: React.FC = () => (
  <div className="min-h-screen bg-[#F6F3EC] flex items-center justify-center p-5"><div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-7 text-center space-y-3"><div className="text-[10px] uppercase tracking-[0.22em] text-amber-600 font-black">D-ADMIN DESIGNER</div><h1 className="text-2xl font-black text-[#124E33]">D-Admin is locked</h1><p className="text-sm text-gray-600">Supabase authentication is required before the admin control centre can be opened.</p><button onClick={() => window.location.assign('/')} className="mt-2 px-4 py-2.5 rounded-xl bg-[#124E33] text-white font-bold">Return to Website</button></div></div>
);

const MainContent: React.FC = () => {
  const { activeRole, setActiveRole, openStaffLogin } = useApp();
  const [verifiedStaffRole, setVerifiedStaffRole] = useState<StaffRole | null>(null);

  useEffect(() => {
    const onAuth = (event: Event) => {
      const role = (event as CustomEvent<{ role?: StaffRole }>).detail?.role;
      if (role === 'admin' || role === 'manager' || role === 'chef') setVerifiedStaffRole(role);
    };
    window.addEventListener('bmb:staff-authenticated', onAuth);
    return () => window.removeEventListener('bmb:staff-authenticated', onAuth);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const restoreVerifiedStaff = async () => {
      if (!isSupabaseConfigured) return;
      try {
        const auth = await getCurrentUser();
        if (!auth?.id || cancelled) return;
        const rows = await supabaseSelect<StaffAccount>(
          'bmb_admin_users',
          `select=user_id,email,role_id,active&user_id=eq.${encodeURIComponent(auth.id)}&limit=1`
        );
        const account = rows[0];
        if (!account?.active || !['admin', 'manager', 'chef'].includes(account.role_id)) {
          signOut();
          return;
        }
        if (!cancelled) {
          setVerifiedStaffRole(account.role_id);
          setActiveRole(account.role_id);
          window.dispatchEvent(new CustomEvent('bmb:staff-authenticated', { detail: { role: account.role_id, restored: true } }));
        }
      } catch {
        if (!cancelled) setVerifiedStaffRole(null);
      }
    };
    void restoreVerifiedStaff();
    return () => { cancelled = true; };
  }, [setActiveRole]);

  useEffect(() => {
    const onPop = () => { const p = window.location.pathname.toLowerCase(); if (p === '/' || p === '') { setActiveRole('customer'); setVerifiedStaffRole(null); } };
    window.addEventListener('popstate', onPop);
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (path.includes('/admin') || hash.includes('admin') || search.includes('role=admin')) { setActiveRole('customer'); openStaffLogin('admin'); }
    else if (path.includes('/manager') || hash.includes('manager') || search.includes('role=manager')) { setActiveRole('customer'); openStaffLogin('manager'); }
    else if (path.includes('/chef') || hash.includes('chef') || search.includes('role=chef')) { setActiveRole('customer'); openStaffLogin('chef'); }
    return () => window.removeEventListener('popstate', onPop);
  }, [setActiveRole, openStaffLogin]);

  useEffect(() => {
    if (activeRole !== 'customer' && verifiedStaffRole !== activeRole) openStaffLogin(activeRole);
  }, [activeRole, verifiedStaffRole, openStaffLogin]);

  const dAdminPath = window.location.pathname.toLowerCase().startsWith('/d-admin') || window.location.hash.toLowerCase() === '#d-admin' || window.location.hash.toLowerCase() === '#superadmin';
  if (dAdminPath) return isSupabaseConfigured ? <DAdminGuard><DAdminDesigner /></DAdminGuard> : <LockedDAdminNotice />;

  const effectiveRole = activeRole !== 'customer' && verifiedStaffRole !== activeRole ? 'customer' : activeRole;

  return <MobileAppFrame><div className="min-h-screen bg-[#FAF7F2] text-[#1A261E] flex flex-col font-sans"><TopBar /><Header /><TodayMenuTicker />{effectiveRole !== 'customer' && <StaffNavBar />}<main className="flex-1">{effectiveRole === 'customer' && <><ExpiryReminderBanner /><OrderStatusNotifier /><HeroBanner /><PackagesSection /><LowerFeaturesGrid /></>}{effectiveRole === 'admin' && <AdminPanel />}{effectiveRole === 'manager' && <ManagerPanel />}{effectiveRole === 'chef' && <ChefPanel />}</main>{(effectiveRole === 'manager' || effectiveRole === 'chef') && <CalculatorWidget />}<Footer />{effectiveRole === 'customer' && <ChatBox />}<WeeklyMenuModal /><RegistrationModal /><InstantOrderModal /><ReferralModal /><BonusOffersModal /><RenewalModal /><ReminderPreviewModal /><NativeAppDownloadModal /><StaffLoginModal /></div></MobileAppFrame>;
};

export default function App() { return <CmsProvider><AppProvider><MainContent /></AppProvider></CmsProvider>; }
