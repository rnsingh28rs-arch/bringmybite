import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Subscription, InstantOrder, DayMenuSchedule, InventoryItem, ChefIndentRequest, ActiveRole,
  ChatMessage, PackageType, ThaliType, ReferralRecord, BonusOffer
} from '../types';
import {
  VEG_CLASSIC_MENU, EGG_DELIGHT_MENU, NON_VEG_CLUB_MENU, INITIAL_INVENTORY,
  INITIAL_SUBSCRIPTIONS, INITIAL_INSTANT_ORDERS, INITIAL_CHEF_INDENTS,
  INITIAL_REFERRALS, BONUS_OFFERS
} from '../data/initialData';
import { useCms } from '../cms/CmsContext';
import { isSupabaseConfigured, restoreSession, signInWithStaffPin, signOut as supabaseSignOut } from '../cms/supabaseRest';

export interface PlanPricing { vegMonthly:number; eggMonthly:number; nonVegMonthly:number; vegThaliInstant:number; eggThaliInstant:number; nonVegThaliInstant:number; }
export const calculateExpiryDate=(startDate:string,duration:string):string=>{const start=new Date(startDate||new Date().toISOString().split('T')[0]);const months=duration==='3 Months'?3:duration==='6 Months'?6:1;const end=new Date(start);end.setMonth(end.getMonth()+months);return end.toISOString().split('T')[0];};
export const getDaysRemaining=(expiryDate:string):number=>{if(!expiryDate)return 30;const now=new Date('2026-08-13');const end=new Date(expiryDate);return Math.ceil((end.getTime()-now.getTime())/(1000*60*60*24));};

interface AppContextType {
  activeRole: ActiveRole; setActiveRole:(role:ActiveRole)=>void;
  deviceType:'desktop'|'ios'|'android'; setDeviceType:(type:'desktop'|'ios'|'android')=>void;
  isStaffLoginOpen:boolean; setIsStaffLoginOpen:(open:boolean)=>void;
  targetStaffRole:'admin'|'manager'|'chef'|null; setTargetStaffRole:(role:'admin'|'manager'|'chef'|null)=>void;
  authenticatedRoles:{admin:boolean;manager:boolean;chef:boolean};
  loginStaff:(role:'admin'|'manager'|'chef',pin:string)=>Promise<boolean>; logoutStaff:()=>void;
  openStaffLogin:(role?:'admin'|'manager'|'chef')=>void;
  isRegistrationOpen:boolean; setIsRegistrationOpen:(open:boolean)=>void;
  selectedPackageForRegistration:PackageType; setSelectedPackageForRegistration:(pkg:PackageType)=>void;
  isInstantOrderOpen:boolean; setIsInstantOrderOpen:(open:boolean)=>void;
  preselectedThaliType:ThaliType; setPreselectedThaliType:(type:ThaliType)=>void;
  isWeeklyMenuOpen:boolean; setIsWeeklyMenuOpen:(open:boolean)=>void;
  selectedMenuTab:PackageType; setSelectedMenuTab:(tab:PackageType)=>void;
  isChatOpen:boolean; setIsChatOpen:(open:boolean)=>void;
  activeBannerIndex:number; setActiveBannerIndex:(idx:number)=>void;
  isReferralModalOpen:boolean; setIsReferralModalOpen:(open:boolean)=>void;
  referrals:ReferralRecord[]; addReferralRecord:(referrerCode:string,newCustomerName:string,subId:string)=>boolean;
  isNativeAppModalOpen:boolean; setIsNativeAppModalOpen:(open:boolean)=>void;
  mobileTab:'home'|'menu'|'instant'|'subscribe'|'pass'|'portal'; setMobileTab:(tab:'home'|'menu'|'instant'|'subscribe'|'pass'|'portal')=>void;
  isPushEnabled:boolean; setIsPushEnabled:(enabled:boolean)=>void;
  isBonusOffersModalOpen:boolean; setIsBonusOffersModalOpen:(open:boolean)=>void;
  bonusOffers:BonusOffer[]; claimBonusOffer:(subId:string,bonusId:string)=>void;
  isRenewalModalOpen:boolean; setIsRenewalModalOpen:(open:boolean)=>void;
  selectedSubscriptionForRenewal:Subscription|null; setSelectedSubscriptionForRenewal:(sub:Subscription|null)=>void;
  renewSubscription:(subId:string,newDuration:string,amount:number)=>void;
  isReminderPreviewModalOpen:boolean; setIsReminderPreviewModalOpen:(open:boolean)=>void;
  activeReminderSubscription:Subscription|null; setActiveReminderSubscription:(sub:Subscription|null)=>void;
  sendSubscriptionReminder:(subId:string,channel:'whatsapp'|'sms'|'in_app')=>void;
  expiryBannerDismissed:boolean; setExpiryBannerDismissed:(dismissed:boolean)=>void;
  vegMenu:DayMenuSchedule[]; eggMenu:DayMenuSchedule[]; nonVegMenu:DayMenuSchedule[];
  updateMenuItem:(packageType:PackageType,day:string,meal:'lunch'|'dinner',field:string,value:string)=>void;
  pricing:PlanPricing; updatePricing:(newPricing:Partial<PlanPricing>)=>void;
  subscriptions:Subscription[]; addSubscription:(sub:any)=>Subscription; updateSubscriptionStatus:(id:string,status:'Approved'|'Pending'|'Rejected',routeCode?:string,execName?:string)=>void; deleteSubscription:(id:string)=>void;
  instantOrders:InstantOrder[]; addInstantOrder:(order:any)=>InstantOrder; updateOrderStatus:(id:string,status:InstantOrder['status'])=>void;
  inventory:InventoryItem[]; updateInventoryStock:(id:string,newStock:number)=>void; addNewInventoryItem:(item:any)=>void; restockItem:(id:string,quantityToAdd:number)=>void;
  chefIndents:ChefIndentRequest[]; addChefIndent:(indent:any)=>void; updateChefIndentStatus:(id:string,status:ChefIndentRequest['status'],approvedBy?:string)=>void;
  chatMessages:ChatMessage[]; sendChatMessage:(text:string)=>void;
  todayMealsCount:{lunchVeg:number;lunchEgg:number;lunchNonVeg:number;dinnerVeg:number;dinnerEgg:number;dinnerNonVeg:number;totalToday:number;totalRotiLunch:number;totalRotiDinner:number};
  totalRevenue:number; totalSubscribers:number; lowStockCount:number; pendingIndentsCount:number; expiringSoonCount:number; totalReferralsCount:number;
}

const AppContext=createContext<AppContextType|undefined>(undefined);

export const AppProvider:React.FC<{children:React.ReactNode}>=({children})=>{
  const cms=useCms();
  const [activeRole,setActiveRole]=useState<ActiveRole>('customer');
  const [deviceType,setDeviceType]=useState<'desktop'|'ios'|'android'>('desktop');
  const [isStaffLoginOpen,setIsStaffLoginOpen]=useState(false);
  const [targetStaffRole,setTargetStaffRole]=useState<'admin'|'manager'|'chef'|null>(null);
  const [authenticatedRoles,setAuthenticatedRoles]=useState({admin:false,manager:false,chef:false});

  const loginStaff=async(role:'admin'|'manager'|'chef',pin:string)=>{
    if(!isSupabaseConfigured) return false;
    const cleanPin=pin.trim();
    if(!/^\d{4,8}$/.test(cleanPin)) return false;
    try{
      restoreSession();
      const session=await signInWithStaffPin(role,cleanPin);
      if(session.role!==role) return false;
      const updated={...authenticatedRoles,[role]:true};
      setAuthenticatedRoles(updated);
      setActiveRole(role);
      setIsStaffLoginOpen(false);
      setTargetStaffRole(null);
      localStorage.setItem('bmb_staff_auth_roles',JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('bmb:staff-authenticated',{detail:{role,userId:session.id}}));
      return true;
    }catch{return false;}
  };

  const logoutStaff=()=>{supabaseSignOut();setAuthenticatedRoles({admin:false,manager:false,chef:false});setActiveRole('customer');window.dispatchEvent(new CustomEvent('bmb:staff-logout'));};
  const openStaffLogin=(role?:'admin'|'manager'|'chef')=>{if(role)setTargetStaffRole(role);setIsStaffLoginOpen(true);};

  const [isRegistrationOpen,setIsRegistrationOpen]=useState(false),[selectedPackageForRegistration,setSelectedPackageForRegistration]=useState<PackageType>('VEG CLASSIC'),[isInstantOrderOpen,setIsInstantOrderOpen]=useState(false),[preselectedThaliType,setPreselectedThaliType]=useState<ThaliType>('veg'),[isWeeklyMenuOpen,setIsWeeklyMenuOpen]=useState(false),[selectedMenuTab,setSelectedMenuTab]=useState<PackageType>('VEG CLASSIC'),[isChatOpen,setIsChatOpen]=useState(false),[activeBannerIndex,setActiveBannerIndex]=useState(0);
  const [isReferralModalOpen,setIsReferralModalOpen]=useState(false),[isBonusOffersModalOpen,setIsBonusOffersModalOpen]=useState(false),[isRenewalModalOpen,setIsRenewalModalOpen]=useState(false),[selectedSubscriptionForRenewal,setSelectedSubscriptionForRenewal]=useState<Subscription|null>(null),[isReminderPreviewModalOpen,setIsReminderPreviewModalOpen]=useState(false),[activeReminderSubscription,setActiveReminderSubscription]=useState<Subscription|null>(null),[expiryBannerDismissed,setExpiryBannerDismissed]=useState(false);
  const [isNativeAppModalOpen,setIsNativeAppModalOpen]=useState(false),[mobileTab,setMobileTab]=useState<'home'|'menu'|'instant'|'subscribe'|'pass'|'portal'>('home'),[isPushEnabled,setIsPushEnabled]=useState(true);
  const vegMenu=cms.menus['VEG CLASSIC'],eggMenu=cms.menus['EGG DELIGHT'],nonVegMenu=cms.menus['NON-VEG CLUB'],pricing=cms.pricing;
  const [subscriptions,setSubscriptions]=useState<Subscription[]>(()=>{const v=localStorage.getItem('bmb_data_version');if(v!=='v2.0_clean'){localStorage.setItem('bmb_data_version','v2.0_clean');localStorage.setItem('bmb_subscriptions',JSON.stringify(INITIAL_SUBSCRIPTIONS));localStorage.setItem('bmb_referrals',JSON.stringify(INITIAL_REFERRALS));return INITIAL_SUBSCRIPTIONS;}const s=localStorage.getItem('bmb_subscriptions');return s?JSON.parse(s):INITIAL_SUBSCRIPTIONS;});
  const [referrals,setReferrals]=useState<ReferralRecord[]>(()=>{const s=localStorage.getItem('bmb_referrals');return s?JSON.parse(s):INITIAL_REFERRALS;});
  const [bonusOffers]=useState<BonusOffer[]>(BONUS_OFFERS);
  const [instantOrders,setInstantOrders]=useState<InstantOrder[]>(()=>{const s=localStorage.getItem('bmb_instant_orders');return s?JSON.parse(s):INITIAL_INSTANT_ORDERS;});
  const [inventory,setInventory]=useState<InventoryItem[]>(()=>{const s=localStorage.getItem('bmb_inventory');return s?JSON.parse(s):INITIAL_INVENTORY;});
  const [chefIndents,setChefIndents]=useState<ChefIndentRequest[]>(()=>{const s=localStorage.getItem('bmb_chef_indents');return s?JSON.parse(s):INITIAL_CHEF_INDENTS;});
  const [chatMessages,setChatMessages]=useState<ChatMessage[]>([{id:'msg-1',sender:'bot',text:'Namaste! 🙏 Welcome to Bring My Bite by Shree Foods. How can we help you today?',timestamp:'Just now',suggestions:['What is in today\'s Lunch?','How does College Gate delivery work?','How much is the Monthly Veg Plan?','Referral Sweets Offer 🍬']}]);

  useEffect(()=>{localStorage.setItem('bmb_subscriptions',JSON.stringify(subscriptions));localStorage.setItem('bmb_referrals',JSON.stringify(referrals));localStorage.setItem('bmb_instant_orders',JSON.stringify(instantOrders));localStorage.setItem('bmb_inventory',JSON.stringify(inventory));localStorage.setItem('bmb_chef_indents',JSON.stringify(chefIndents));},[subscriptions,referrals,instantOrders,inventory,chefIndents]);

  const updatePricing=(newPricing:Partial<PlanPricing>)=>void cms.updatePricing(newPricing);
  const updateMenuItem=(...args:Parameters<AppContextType['updateMenuItem']>)=>void cms.saveMenu(args[0],cms.menus[args[0]]);
  const addReferralRecord=()=>false;
  const claimBonusOffer=()=>{}; const renewSubscription=()=>{}; const sendSubscriptionReminder=()=>{};
  const addSubscription=(sub:any)=>sub; const updateSubscriptionStatus=()=>{}; const deleteSubscription=()=>{};
  const addInstantOrder=(order:any)=>order; const updateOrderStatus=()=>{}; const updateInventoryStock=()=>{}; const addNewInventoryItem=()=>{}; const restockItem=()=>{};
  const addChefIndent=()=>{}; const updateChefIndentStatus=()=>{}; const sendChatMessage=(text:string)=>setChatMessages(prev=>[...prev,{id:`msg-${Date.now()}`,sender:'user',text,timestamp:'Just now'}]);
  const todayMealsCount={lunchVeg:0,lunchEgg:0,lunchNonVeg:0,dinnerVeg:0,dinnerEgg:0,dinnerNonVeg:0,totalToday:0,totalRotiLunch:0,totalRotiDinner:0};
  const totalRevenue=0,totalSubscribers=subscriptions.length,lowStockCount=inventory.filter(i=>i.status!=='In Stock').length,pendingIndentsCount=chefIndents.filter(i=>i.status==='Pending Approval').length,expiringSoonCount=0,totalReferralsCount=referrals.length;

  return <AppContext.Provider value={{activeRole,setActiveRole,deviceType,setDeviceType,isStaffLoginOpen,setIsStaffLoginOpen,targetStaffRole,setTargetStaffRole,authenticatedRoles,loginStaff,logoutStaff,openStaffLogin,isRegistrationOpen,setIsRegistrationOpen,selectedPackageForRegistration,setSelectedPackageForRegistration,isInstantOrderOpen,setIsInstantOrderOpen,preselectedThaliType,setPreselectedThaliType,isWeeklyMenuOpen,setIsWeeklyMenuOpen,selectedMenuTab,setSelectedMenuTab,isChatOpen,setIsChatOpen,activeBannerIndex,setActiveBannerIndex,isReferralModalOpen,setIsReferralModalOpen,referrals,addReferralRecord,isNativeAppModalOpen,setIsNativeAppModalOpen,mobileTab,setMobileTab,isPushEnabled,setIsPushEnabled,isBonusOffersModalOpen,setIsBonusOffersModalOpen,bonusOffers,claimBonusOffer,isRenewalModalOpen,setIsRenewalModalOpen,selectedSubscriptionForRenewal,setSelectedSubscriptionForRenewal,renewSubscription,isReminderPreviewModalOpen,setIsReminderPreviewModalOpen,activeReminderSubscription,setActiveReminderSubscription,sendSubscriptionReminder,expiryBannerDismissed,setExpiryBannerDismissed,vegMenu,eggMenu,nonVegMenu,updateMenuItem,pricing,updatePricing,subscriptions,addSubscription,updateSubscriptionStatus,deleteSubscription,instantOrders,addInstantOrder,updateOrderStatus,inventory,updateInventoryStock,addNewInventoryItem,restockItem,chefIndents,addChefIndent,updateChefIndentStatus,chatMessages,sendChatMessage,todayMealsCount,totalRevenue,totalSubscribers,lowStockCount,pendingIndentsCount,expiringSoonCount,totalReferralsCount}}>
    {children}
  </AppContext.Provider>;
};

export const useApp=()=>{const ctx=useContext(AppContext);if(!ctx)throw new Error('useApp must be used within AppProvider');return ctx;};
