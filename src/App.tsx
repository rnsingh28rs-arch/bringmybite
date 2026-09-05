import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/common/TopBar';
import { Header } from './components/common/Header';
import { TodayMenuTicker } from './components/common/TodayMenuTicker';
import { TemporaryNoticeTicker } from './components/common/TemporaryNoticeTicker';
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
import { StaffNavBar } from './components/panels/StaffNavBar';
import { StaffLoginGate } from './components/panels/StaffLoginGate';
import { AdminPanel } from './components/panels/AdminPanel';
import { ManagerStockPanel } from './components/panels/ManagerStockPanel';
import { ChefKitchenPanel } from './components/panels/ChefKitchenPanel';
import { MobileAppFrame } from './components/mobile/MobileAppFrame';
import { DAdminDesigner } from './components/panels/DAdminDesigner';
import { CalculatorWidget } from './components/common/CalculatorWidget';
import { CmsProvider } from './cms/CmsContext';
import { resolveStaffRoute } from './utils/staffRoute.mjs';

const REDUNDANT_PANEL_TITLES = new Set(['D-ADMIN DESIGNER','CEO Cum Director Control Centre','Master Admin Dashboard (/admin)','Shree Foods Executive & Governance Console','Kitchen Operations & Inventory Manager','Manager Operations & Stock Control','Kitchen Operational Hub','Chef Kitchen Operations & Indents']);
function removeRedundantPanelTitles(){const candidates=document.querySelectorAll<HTMLElement>('h1,h2,h3,span,p,div');candidates.forEach(element=>{if(element.children.length===0&&REDUNDANT_PANEL_TITLES.has(element.textContent?.trim()||''))element.style.display='none';});}

const MainContent:React.FC=()=>{
  const {setActiveRole}=useApp();
  const [locationKey,setLocationKey]=useState(()=>window.location.href);
  useEffect(()=>{const syncLocation=()=>setLocationKey(window.location.href);window.addEventListener('hashchange',syncLocation);window.addEventListener('popstate',syncLocation);return()=>{window.removeEventListener('hashchange',syncLocation);window.removeEventListener('popstate',syncLocation);};},[]);
  useEffect(()=>{const handleWebsiteNavigation=(event:MouseEvent)=>{const target=event.target as HTMLElement|null;const control=target?.closest('button,a') as HTMLElement|null;const label=control?.textContent?.replace(/\s+/g,' ').trim().toLowerCase()||'';if(label.includes('exit to website')||label.includes('back to website')){event.preventDefault();event.stopPropagation();window.location.assign('/');}};document.addEventListener('click',handleWebsiteNavigation,true);return()=>document.removeEventListener('click',handleWebsiteNavigation,true);},[]);
  useEffect(()=>{removeRedundantPanelTitles();const observer=new MutationObserver(()=>removeRedundantPanelTitles());observer.observe(document.body,{childList:true,subtree:true});return()=>observer.disconnect();},[locationKey]);
  const access=resolveStaffRoute(window.location.pathname);const role=access?.role??'customer';
  useEffect(()=>{setActiveRole(role);},[role,locationKey,setActiveRole]);
  if(role==='customer') return <MobileAppFrame><div className="min-h-screen bg-[#FAF7F2] text-[#1A261E] flex flex-col font-sans"><TopBar/><Header/><TemporaryNoticeTicker/><TodayMenuTicker/><main className="flex-1"><ExpiryReminderBanner/><OrderStatusNotifier/><HeroBanner/><PackagesSection/><LowerFeaturesGrid/></main><Footer/><ChatBox/><WeeklyMenuModal/><RegistrationModal/><InstantOrderModal/><ReferralModal/><BonusOffersModal/><RenewalModal/><ReminderPreviewModal/><NativeAppDownloadModal/></div></MobileAppFrame>;
  const staffWorkspace=<div className="min-h-screen bg-[#FAF7F2] text-[#1A261E] flex flex-col font-sans"><TopBar/><Header/><StaffNavBar/><main className="flex-1">{role==='admin'&&<AdminPanel/>}{role==='manager'&&<ManagerStockPanel/>}{role==='chef'&&<ChefKitchenPanel/>}{role==='d_admin'&&<DAdminDesigner/>}</main>{(role==='manager'||role==='chef')&&<CalculatorWidget/>}<Footer/></div>;
  return <StaffLoginGate role={role}>{staffWorkspace}</StaffLoginGate>;
};
export default function App(){return <CmsProvider><AppProvider><MainContent/></AppProvider></CmsProvider>;}
