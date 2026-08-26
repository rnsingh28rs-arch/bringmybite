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
import { getCurrentUser, isSupabaseConfigured, signOut, supabaseRpc } from './cms/supabaseRest';

type StaffRole='d_admin'|'admin'|'manager'|'chef';
type StaffAccount={user_id:string;email:string;role_id:string;active:boolean};
const routeRole=():StaffRole|null=>{const p=window.location.pathname.toLowerCase();if(p==='/d-admin'||p.startsWith('/d-admin/'))return'd_admin';if(p==='/admin'||p.startsWith('/admin/'))return'admin';if(p==='/manager'||p.startsWith('/manager/'))return'manager';if(p==='/chef'||p.startsWith('/chef/'))return'chef';return null;};

const MainContent:React.FC=()=>{
  const {activeRole,setActiveRole,openStaffLogin}=useApp();
  const [verifiedRole,setVerifiedRole]=useState<StaffRole|null>(null);
  const [dismissed,setDismissed]=useState(false);
  const rr=routeRole();

  useEffect(()=>{
    const auth=(e:Event)=>{const role=(e as CustomEvent<{role?:StaffRole}>).detail?.role;if(role){setVerifiedRole(role);setActiveRole(role as any);setDismissed(false);}};
    const close=()=>{setVerifiedRole(null);setActiveRole('customer');setDismissed(true);};
    const logout=()=>{setVerifiedRole(null);setActiveRole('customer');setDismissed(false);};
    window.addEventListener('bmb:staff-authenticated',auth);window.addEventListener('bmb:staff-login-dismissed',close);window.addEventListener('bmb:staff-logout',logout);
    return()=>{window.removeEventListener('bmb:staff-authenticated',auth);window.removeEventListener('bmb:staff-login-dismissed',close);window.removeEventListener('bmb:staff-logout',logout);};
  },[setActiveRole]);

  useEffect(()=>{
    let cancelled=false;
    const check=async()=>{
      if(!rr||dismissed)return;
      if(!isSupabaseConfigured){if(!cancelled)openStaffLogin(rr==='d_admin'?undefined:rr as any);return;}
      try{
        const auth=await getCurrentUser();
        if(cancelled||dismissed)return;
        if(auth?.id){const rows=await supabaseRpc<StaffAccount>('bmb_get_staff_account');const account=rows[0];const ok=account?.active&&(rr==='d_admin'?(account.role_id==='d_admin'||account.role_id==='ceo-director'):account.role_id===rr);if(ok){setVerifiedRole(rr);setActiveRole(rr as any);return;}await signOut();}
        if(!cancelled){setActiveRole('customer');if(rr!=='d_admin')openStaffLogin(rr as any);}
      }catch{if(!cancelled&&!dismissed){setActiveRole('customer');if(rr!=='d_admin')openStaffLogin(rr as any);}}
    };
    void check();return()=>{cancelled=true;};
  },[rr,dismissed,openStaffLogin,setActiveRole]);

  useEffect(()=>{if(rr&&verifiedRole&&verifiedRole!==rr){setVerifiedRole(null);setActiveRole('customer');}},[rr,verifiedRole,setActiveRole]);

  if(rr==='d_admin') return <DAdminGuard><DAdminDesigner/></DAdminGuard>;
  const effective=rr&&verifiedRole===rr&&activeRole===rr?rr:'customer';
  return <MobileAppFrame><div className="min-h-screen bg-[#FAF7F2] text-[#1A261E] flex flex-col font-sans"><TopBar/><Header/><TodayMenuTicker/>{effective!=='customer'&&<StaffNavBar/>}<main className="flex-1">{effective==='customer'&&<><ExpiryReminderBanner/><OrderStatusNotifier/><HeroBanner/><PackagesSection/><LowerFeaturesGrid/></>}{effective==='admin'&&<AdminPanel/>}{effective==='manager'&&<ManagerPanel/>}{effective==='chef'&&<ChefPanel/>}</main>{(effective==='manager'||effective==='chef')&&<CalculatorWidget/>}<Footer/>{effective==='customer'&&<ChatBox/>}<WeeklyMenuModal/><RegistrationModal/><InstantOrderModal/><ReferralModal/><BonusOffersModal/><RenewalModal/><ReminderPreviewModal/><NativeAppDownloadModal/>{effective==='customer'&&rr&&rr!=='d_admin'&&<StaffLoginModal/>}</div></MobileAppFrame>;
};

export default function App(){return <CmsProvider><AppProvider><MainContent/></AppProvider></CmsProvider>;}
