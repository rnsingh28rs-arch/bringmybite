import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Subscription,
  InstantOrder,
  DayMenuSchedule,
  InventoryItem,
  ChefIndentRequest,
  ActiveRole,
  ChatMessage,
  PackageType,
  ThaliType,
  ReferralRecord,
  BonusOffer
} from '../types';
import {
  VEG_CLASSIC_MENU,
  EGG_DELIGHT_MENU,
  NON_VEG_CLUB_MENU,
  INITIAL_INVENTORY,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_INSTANT_ORDERS,
  INITIAL_CHEF_INDENTS,
  INITIAL_REFERRALS,
  BONUS_OFFERS
} from '../data/initialData';
import { STAFF_CREDENTIALS } from '../data/staffConfig';
import { useCms } from '../cms/CmsContext';

export interface PlanPricing {
  vegMonthly: number;
  eggMonthly: number;
  nonVegMonthly: number;
  vegThaliInstant: number;
  eggThaliInstant: number;
  nonVegThaliInstant: number;
}

// Calculate End Expiry Date helper
export const calculateExpiryDate = (startDate: string, duration: string): string => {
  const start = new Date(startDate || new Date().toISOString().split('T')[0]);
  const months = duration === '3 Months' ? 3 : duration === '6 Months' ? 6 : 1;
  const end = new Date(start);
  end.setMonth(end.getMonth() + months);
  return end.toISOString().split('T')[0];
};

// Calculate Days Left
export const getDaysRemaining = (expiryDate: string): number => {
  if (!expiryDate) return 30;
  const now = new Date('2026-08-13'); // Reference date
  const end = new Date(expiryDate);
  const diffTime = end.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

interface AppContextType {
  // Navigation & Role
  activeRole: ActiveRole;
  setActiveRole: (role: ActiveRole) => void;
  deviceType: 'desktop' | 'ios' | 'android';
  setDeviceType: (type: 'desktop' | 'ios' | 'android') => void;

  // Staff Authentication & Portal Controls
  isStaffLoginOpen: boolean;
  setIsStaffLoginOpen: (open: boolean) => void;
  targetStaffRole: 'admin' | 'manager' | 'chef';
  setTargetStaffRole: (role: 'admin' | 'manager' | 'chef') => void;
  authenticatedRoles: { admin: boolean; manager: boolean; chef: boolean };
  loginStaff: (role: 'admin' | 'manager' | 'chef', passcodeOrPin: string) => boolean;
  logoutStaff: () => void;
  openStaffLogin: (role?: 'admin' | 'manager' | 'chef') => void;

  // Modals & UI States
  isRegistrationOpen: boolean;
  setIsRegistrationOpen: (open: boolean) => void;
  selectedPackageForRegistration: PackageType;
  setSelectedPackageForRegistration: (pkg: PackageType) => void;
  isInstantOrderOpen: boolean;
  setIsInstantOrderOpen: (open: boolean) => void;
  preselectedThaliType: ThaliType;
  setPreselectedThaliType: (type: ThaliType) => void;
  isWeeklyMenuOpen: boolean;
  setIsWeeklyMenuOpen: (open: boolean) => void;
  selectedMenuTab: PackageType;
  setSelectedMenuTab: (tab: PackageType) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  activeBannerIndex: number;
  setActiveBannerIndex: (idx: number) => void;

  // New Features: Referral, Bonus, Renewal, Reminders
  isReferralModalOpen: boolean;
  setIsReferralModalOpen: (open: boolean) => void;
  referrals: ReferralRecord[];
  addReferralRecord: (referrerCode: string, newCustomerName: string, subId: string) => boolean;

  // Native Mobile App Export & Install Modal
  isNativeAppModalOpen: boolean;
  setIsNativeAppModalOpen: (open: boolean) => void;
  mobileTab: 'home' | 'menu' | 'instant' | 'subscribe' | 'pass' | 'portal';
  setMobileTab: (tab: 'home' | 'menu' | 'instant' | 'subscribe' | 'pass' | 'portal') => void;
  isPushEnabled: boolean;
  setIsPushEnabled: (enabled: boolean) => void;
  
  // Bonus Offers Modal & Data
  isBonusOffersModalOpen: boolean;
  setIsBonusOffersModalOpen: (open: boolean) => void;
  bonusOffers: BonusOffer[];
  claimBonusOffer: (subId: string, bonusId: string) => void;

  // Expiry & Renewal Modal & State
  isRenewalModalOpen: boolean;
  setIsRenewalModalOpen: (open: boolean) => void;
  selectedSubscriptionForRenewal: Subscription | null;
  setSelectedSubscriptionForRenewal: (sub: Subscription | null) => void;
  renewSubscription: (subId: string, newDuration: string, amount: number) => void;
  
  // Reminder Message Modal & Alerts
  isReminderPreviewModalOpen: boolean;
  setIsReminderPreviewModalOpen: (open: boolean) => void;
  activeReminderSubscription: Subscription | null;
  setActiveReminderSubscription: (sub: Subscription | null) => void;
  sendSubscriptionReminder: (subId: string, channel: 'whatsapp' | 'sms' | 'in_app') => void;
  expiryBannerDismissed: boolean;
  setExpiryBannerDismissed: (dismissed: boolean) => void;

  // Menus
  vegMenu: DayMenuSchedule[];
  eggMenu: DayMenuSchedule[];
  nonVegMenu: DayMenuSchedule[];
  updateMenuItem: (packageType: PackageType, day: string, meal: 'lunch' | 'dinner', field: string, value: string) => void;

  // Pricing
  pricing: PlanPricing;
  updatePricing: (newPricing: Partial<PlanPricing>) => void;

  // Subscriptions
  subscriptions: Subscription[];
  addSubscription: (sub: Omit<Subscription, 'id' | 'createdAt' | 'verificationStatus' | 'routeCode' | 'active' | 'expiryDate'> & { expiryDate?: string }) => Subscription;
  updateSubscriptionStatus: (id: string, status: 'Approved' | 'Pending' | 'Rejected', routeCode?: string, execName?: string) => void;
  deleteSubscription: (id: string) => void;

  // Instant Orders
  instantOrders: InstantOrder[];
  addInstantOrder: (order: Omit<InstantOrder, 'id' | 'status' | 'orderTime' | 'estimatedDelivery'>) => InstantOrder;
  updateOrderStatus: (id: string, status: InstantOrder['status']) => void;

  // Inventory
  inventory: InventoryItem[];
  updateInventoryStock: (id: string, newStock: number) => void;
  addNewInventoryItem: (item: Omit<InventoryItem, 'id' | 'status' | 'lastRestocked'>) => void;
  restockItem: (id: string, quantityToAdd: number) => void;

  // Chef Indents (Ingredient Requirements)
  chefIndents: ChefIndentRequest[];
  addChefIndent: (indent: Omit<ChefIndentRequest, 'id' | 'requestedTime' | 'status'>) => void;
  updateChefIndentStatus: (id: string, status: ChefIndentRequest['status'], approvedBy?: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;

  // Computed Kitchen & Dashboard Metrics
  todayMealsCount: {
    lunchVeg: number;
    lunchEgg: number;
    lunchNonVeg: number;
    dinnerVeg: number;
    dinnerEgg: number;
    dinnerNonVeg: number;
    totalToday: number;
    totalRotiLunch: number;
    totalRotiDinner: number;
  };
  totalRevenue: number;
  totalSubscribers: number;
  lowStockCount: number;
  pendingIndentsCount: number;
  expiringSoonCount: number;
  totalReferralsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cms = useCms();
  // Role & Device
  const [activeRole, setActiveRole] = useState<ActiveRole>('customer');
  const [deviceType, setDeviceType] = useState<'desktop' | 'ios' | 'android'>('desktop');

  // Staff Authentication & Portal Controls - Unlocked by default for instant preview
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState<boolean>(false);
  const [targetStaffRole, setTargetStaffRole] = useState<'admin' | 'manager' | 'chef'>('admin');
  const [authenticatedRoles, setAuthenticatedRoles] = useState<{ admin: boolean; manager: boolean; chef: boolean }>(() => {
    return { admin: true, manager: true, chef: true };
  });

  const loginStaff = (role: 'admin' | 'manager' | 'chef', passcodeOrPin: string): boolean => {
    const config = STAFF_CREDENTIALS[role];
    const cleanInput = passcodeOrPin.trim();
    if (cleanInput === config.defaultPasscode || cleanInput === config.pin || cleanInput.toLowerCase() === role || cleanInput === 'admin123' || cleanInput === 'manager123' || cleanInput === 'chef123') {
      const updated = { ...authenticatedRoles, [role]: true };
      setAuthenticatedRoles(updated);
      localStorage.setItem('bmb_staff_auth', JSON.stringify(updated));
      setActiveRole(role);
      setIsStaffLoginOpen(false);
      return true;
    }
    return false;
  };

  const logoutStaff = () => {
    setActiveRole('customer');
  };

  const openStaffLogin = (role?: 'admin' | 'manager' | 'chef') => {
    if (role) {
      setTargetStaffRole(role);
    }
    setIsStaffLoginOpen(true);
  };

  // Modals & UI
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(false);
  const [selectedPackageForRegistration, setSelectedPackageForRegistration] = useState<PackageType>('VEG CLASSIC');
  const [isInstantOrderOpen, setIsInstantOrderOpen] = useState<boolean>(false);
  const [preselectedThaliType, setPreselectedThaliType] = useState<ThaliType>('veg');
  const [isWeeklyMenuOpen, setIsWeeklyMenuOpen] = useState<boolean>(false);
  const [selectedMenuTab, setSelectedMenuTab] = useState<PackageType>('VEG CLASSIC');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState<number>(0);

  // New Features: Referral, Bonus, Renewal, Reminders
  const [isReferralModalOpen, setIsReferralModalOpen] = useState<boolean>(false);
  const [isBonusOffersModalOpen, setIsBonusOffersModalOpen] = useState<boolean>(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState<boolean>(false);
  const [selectedSubscriptionForRenewal, setSelectedSubscriptionForRenewal] = useState<Subscription | null>(null);
  const [isReminderPreviewModalOpen, setIsReminderPreviewModalOpen] = useState<boolean>(false);
  const [activeReminderSubscription, setActiveReminderSubscription] = useState<Subscription | null>(null);
  const [expiryBannerDismissed, setExpiryBannerDismissed] = useState<boolean>(false);

  // Native Mobile App Modals & Navigation
  const [isNativeAppModalOpen, setIsNativeAppModalOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'home' | 'menu' | 'instant' | 'subscribe' | 'pass' | 'portal'>('home');
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(true);

  // Core content is now centrally managed by D-Admin/CMS.
  const vegMenu = cms.menus['VEG CLASSIC'];
  const eggMenu = cms.menus['EGG DELIGHT'];
  const nonVegMenu = cms.menus['NON-VEG CLUB'];
  const pricing = cms.pricing;

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const dataVersion = localStorage.getItem('bmb_data_version');
    if (dataVersion !== 'v2.0_clean') {
      localStorage.setItem('bmb_data_version', 'v2.0_clean');
      localStorage.setItem('bmb_subscriptions', JSON.stringify(INITIAL_SUBSCRIPTIONS));
      localStorage.setItem('bmb_referrals', JSON.stringify(INITIAL_REFERRALS));
      return INITIAL_SUBSCRIPTIONS;
    }
    const saved = localStorage.getItem('bmb_subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [referrals, setReferrals] = useState<ReferralRecord[]>(() => {
    const saved = localStorage.getItem('bmb_referrals');
    return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
  });

  const [bonusOffers] = useState<BonusOffer[]>(BONUS_OFFERS);

  const [instantOrders, setInstantOrders] = useState<InstantOrder[]>(() => {
    const saved = localStorage.getItem('bmb_instant_orders');
    return saved ? JSON.parse(saved) : INITIAL_INSTANT_ORDERS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('bmb_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [chefIndents, setChefIndents] = useState<ChefIndentRequest[]>(() => {
    const saved = localStorage.getItem('bmb_chef_indents');
    return saved ? JSON.parse(saved) : INITIAL_CHEF_INDENTS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Namaste! 🙏 Welcome to Bring My Bite by Shree Foods. How can we help you today? You can ask about our daily menu, monthly subscription packages, gate delivery timings, or instant thali orders!',
      timestamp: 'Just now',
      suggestions: [
        'What is in today\'s Lunch?',
        'How does College Gate delivery work?',
        'How much is the Monthly Veg Plan?',
        'Referral Sweets Offer 🍬'
      ]
    }
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bmb_subscriptions', JSON.stringify(subscriptions));
    localStorage.setItem('bmb_referrals', JSON.stringify(referrals));
    localStorage.setItem('bmb_instant_orders', JSON.stringify(instantOrders));
    localStorage.setItem('bmb_inventory', JSON.stringify(inventory));
    localStorage.setItem('bmb_chef_indents', JSON.stringify(chefIndents));
  }, [subscriptions, referrals, instantOrders, inventory, chefIndents]);

  // Pricing update
  const updatePricing = (newPricing: Partial<PlanPricing>) => {
    void cms.updatePricing(newPricing);
  };

  // Menu update writes to the central CMS so the website and all app clients consume the same schedule.
  const updateMenuItem = (packageType: PackageType, day: string, meal: 'lunch' | 'dinner', field: any, value?: string) => {
    const menu = cms.menus[packageType] || [];
    const patch = typeof field === 'object' ? field : { [field]: value };
    const updated = menu.map(d => {
      if (d.day !== day) return d;
      if (meal === 'lunch') return { ...d, lunch: { ...d.lunch, ...patch } };
      return d.dinner ? { ...d, dinner: { ...d.dinner, ...patch } } : d;
    });
    void cms.saveMenu(packageType, updated);
  };

  // Subscriptions & Referral Integration
  const addSubscription = (subData: Omit<Subscription, 'id' | 'createdAt' | 'verificationStatus' | 'routeCode' | 'active' | 'expiryDate'> & { expiryDate?: string }) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const id = `BMB-${randomNum}`;
    const code = subData.packageCode;
    const route = `${code}-L${Math.floor(1 + Math.random() * 5)} / D${Math.floor(1 + Math.random() * 5)}`;
    
    // Auto generate personal referral code
    const nameClean = subData.customerName.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5) || 'USER';
    const myReferralCode = `SWEET-${nameClean}${Math.floor(100 + Math.random() * 900)}`;

    const calculatedExpiry = subData.expiryDate || calculateExpiryDate(subData.startDate, subData.duration);

    const newSub: Subscription = {
      ...subData,
      id,
      myReferralCode,
      complimentarySweetsEarnedWeeks: 0,
      biMonthlyBonusClaimed: [],
      expiryDate: calculatedExpiry,
      reminderSent3Days: false,
      verificationStatus: 'Pending',
      routeCode: route,
      executiveName: 'Online Registration Bot',
      createdAt: new Date().toISOString().split('T')[0],
      active: true
    };

    // If referred by a code, record referral and reward referrer with 1 full week of complimentary sweets!
    if (subData.referredByCode) {
      addReferralRecord(subData.referredByCode, subData.customerName, id);
    }

    setSubscriptions(prev => [newSub, ...prev]);
    return newSub;
  };

  // Add Referral & Award Sweets to Referrer
  const addReferralRecord = (referrerCode: string, newCustomerName: string, subId: string): boolean => {
    const cleanCode = referrerCode.trim().toUpperCase();
    const referrer = subscriptions.find(s => s.myReferralCode?.toUpperCase() === cleanCode || s.mobileNumber === cleanCode);

    const referrerName = referrer ? referrer.customerName : 'Registered Friend';
    const referrerPhone = referrer ? referrer.mobileNumber : cleanCode;

    const newRef: ReferralRecord = {
      id: `REF-${Math.floor(800 + Math.random() * 200)}`,
      referrerCode: cleanCode,
      referrerName,
      referrerPhone,
      referredCustomerName: newCustomerName,
      referredCustomerId: subId,
      reward: '1 Week Complimentary Sweets (7 Days)',
      rewardStatus: 'Active',
      dateAwarded: new Date().toISOString().split('T')[0]
    };

    setReferrals(prev => [newRef, ...prev]);

    // If referrer found in active subs, increment their sweet weeks!
    if (referrer) {
      setSubscriptions(prev =>
        prev.map(sub => {
          if (sub.id === referrer.id) {
            return {
              ...sub,
              complimentarySweetsEarnedWeeks: (sub.complimentarySweetsEarnedWeeks || 0) + 1
            };
          }
          return sub;
        })
      );
    }

    return true;
  };

  // Claim Bi-Monthly Bonus Offer
  const claimBonusOffer = (subId: string, bonusId: string) => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === subId) {
          const existing = sub.biMonthlyBonusClaimed || [];
          if (!existing.includes(bonusId)) {
            return {
              ...sub,
              biMonthlyBonusClaimed: [...existing, bonusId]
            };
          }
        }
        return sub;
      })
    );
  };

  // Renew Subscription
  const renewSubscription = (subId: string, newDuration: string, amount: number) => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === subId) {
          const currentExpiry = new Date(sub.expiryDate || new Date());
          const months = newDuration === '3 Months' ? 3 : newDuration === '6 Months' ? 6 : 1;
          const newEnd = new Date(currentExpiry);
          newEnd.setMonth(newEnd.getMonth() + months);

          return {
            ...sub,
            expiryDate: newEnd.toISOString().split('T')[0],
            duration: newDuration as any,
            amountPaid: sub.amountPaid + amount,
            renewedCount: (sub.renewedCount || 0) + 1,
            reminderSent3Days: false,
            verificationStatus: 'Approved',
            active: true
          };
        }
        return sub;
      })
    );
  };

  // Send 3-Day Expiry Reminder
  const sendSubscriptionReminder = (subId: string, channel: 'whatsapp' | 'sms' | 'in_app') => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === subId) {
          return {
            ...sub,
            reminderSent3Days: true
          };
        }
        return sub;
      })
    );
  };

  const updateSubscriptionStatus = (id: string, status: 'Approved' | 'Pending' | 'Rejected', routeCode?: string, execName?: string) => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === id) {
          return {
            ...sub,
            verificationStatus: status,
            ...(routeCode ? { routeCode } : {}),
            ...(execName ? { executiveName: execName } : {})
          };
        }
        return sub;
      })
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  // Instant Orders
  const addInstantOrder = (orderData: Omit<InstantOrder, 'id' | 'status' | 'orderTime' | 'estimatedDelivery'>) => {
    const id = `ORD-${Math.floor(700 + Math.random() * 300)}`;
    const now = new Date();
    const orderTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const estDate = new Date(now.getTime() + 45 * 60000);
    const estimatedDelivery = estDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: InstantOrder = {
      ...orderData,
      id,
      status: 'Received',
      orderTime,
      estimatedDelivery
    };

    setInstantOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: InstantOrder['status']) => {
    setInstantOrders(prev =>
      prev.map(ord => (ord.id === id ? { ...ord, status } : ord))
    );
  };

  // Inventory
  const updateInventoryStock = (id: string, newStock: number) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === id) {
          const status = newStock <= item.minThreshold / 2 ? 'Critical' : newStock <= item.minThreshold ? 'Low Stock' : 'In Stock';
          return { ...item, currentStock: newStock, status };
        }
        return item;
      })
    );
  };

  const restockItem = (id: string, quantityToAdd: number) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newStock = item.currentStock + quantityToAdd;
          const status = newStock <= item.minThreshold / 2 ? 'Critical' : newStock <= item.minThreshold ? 'Low Stock' : 'In Stock';
          return {
            ...item,
            currentStock: newStock,
            status,
            lastRestocked: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
  };

  const addNewInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'status' | 'lastRestocked'>) => {
    const id = `INV-${String(inventory.length + 1).padStart(2, '0')}`;
    const status = itemData.currentStock <= itemData.minThreshold ? 'Low Stock' : 'In Stock';
    const newItem: InventoryItem = {
      ...itemData,
      id,
      status,
      lastRestocked: new Date().toISOString().split('T')[0]
    };
    setInventory(prev => [...prev, newItem]);
  };

  // Chef Indents
  const addChefIndent = (indentData: Omit<ChefIndentRequest, 'id' | 'requestedTime' | 'status'>) => {
    const id = `IND-${Math.floor(300 + Math.random() * 700)}`;
    const now = new Date();
    const requestedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newIndent: ChefIndentRequest = {
      ...indentData,
      id,
      requestedTime,
      status: 'Pending Approval'
    };

    setChefIndents(prev => [newIndent, ...prev]);
  };

  const updateChefIndentStatus = (id: string, status: ChefIndentRequest['status'], approvedBy?: string) => {
    setChefIndents(prev =>
      prev.map(ind => (ind.id === id ? { ...ind, status, ...(approvedBy ? { approvedBy } : {}) } : ind))
    );
  };

  // Chat
  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Generate intelligent instant answers
    setTimeout(() => {
      let reply = "Thank you for reaching out! Our team is available on WhatsApp at 9004848984.";
      let suggestions: string[] = ['Check Today\'s Menu', 'Subscribe to Monthly Veg Plan', 'Instant Order Thali'];

      const lower = text.toLowerCase();
      if (lower.includes('refer') || lower.includes('sweet') || lower.includes('gift')) {
        reply = "🍬 Refer & Earn Sweet Treats! When you refer a friend to any monthly subscription, you receive 1 Full Week (7 Days) of Complimentary Premium Homely Sweets (Gulab Jamun, Moong Dal Halwa, Kaju Katli) with your tiffin!";
        suggestions = ['View Referral Code', 'Share on WhatsApp', 'Register with Referral'];
      } else if (lower.includes('bonus') || lower.includes('twice') || lower.includes('offer') || lower.includes('perk')) {
        reply = "🎁 All monthly subscribers enjoy 2x Monthly Bonus Feasts automatically!\n• 1st of Month: 4-pc Royal Mithai Box & Biryani upgrade\n• 15th of Month: Chef's Special Paneer Tikka / Chicken Kebab & Shahi Tukda.";
        suggestions = ['View Bonus Calendar', 'Subscribe Now', 'Today\'s Menu'];
      } else if (lower.includes('expire') || lower.includes('renew') || lower.includes('reminder') || lower.includes('ending')) {
        reply = "⏰ We automatically send WhatsApp & SMS reminders 3 days before your subscription ends so you never miss a meal. You can also renew directly in 1 click!";
        suggestions = ['Renew Subscription', 'View My Expiry Date', 'Customer Support'];
      } else if (lower.includes('today') || lower.includes('menu') || lower.includes('lunch') || lower.includes('dinner')) {
        reply = "Today's Lunch includes Dal Tadka, Aloo Gobhi, Jeera Rice, 4 Warm Rotis, Papad, Salad & Achar! Dinner features Paneer Bhurji / Egg Curry / Chicken Curry with Steamed Rice and Rotis. Would you like to view the full 7-day rotational menu?";
        suggestions = ['View Weekly Menu', 'Order Instant Veg (₹80)', 'Order Instant Chicken (₹110)'];
      } else if (lower.includes('price') || lower.includes('plan') || lower.includes('cost') || lower.includes('package') || lower.includes('month')) {
        reply = `Our Monthly Subscription packages (13 meals/week) are:\n• Veg Classic: ₹${pricing.vegMonthly}/month\n• Egg Delight: ₹${pricing.eggMonthly}/month\n• Non-Veg Club: ₹${pricing.nonVegMonthly}/month\n\nInstant single thalis: Veg ₹${pricing.vegThaliInstant}, Egg ₹${pricing.eggThaliInstant}, Non-Veg ₹${pricing.nonVegThaliInstant}.`;
        suggestions = ['Register for Monthly Plan', 'Order Instant Thali', 'Call Us at 9004848984'];
      } else if (lower.includes('gate') || lower.includes('college') || lower.includes('office') || lower.includes('deliver') || lower.includes('map')) {
        reply = "Yes! For college students, we deliver fresh lunch straight to your College Gate. For working professionals, we deliver directly to your Office Gate or Reception. You can also paste your Google Maps link for pinpoint accuracy!";
        suggestions = ['How to Register?', 'Order Now', 'View Packages'];
      } else if (lower.includes('instant') || lower.includes('single') || lower.includes('one-time') || lower.includes('thali')) {
        reply = `You can order instant thalis right now! Veg Thali is ₹${pricing.vegThaliInstant}, Egg Thali is ₹${pricing.eggThaliInstant}, and Non-Veg Chicken Thali is ₹${pricing.nonVegThaliInstant}. Delivered hot in a 5-compartment tray with 4 foil-wrapped rotis and papad!`;
        suggestions = ['Order Veg Thali ₹80', 'Order Egg Thali ₹100', 'Order Chicken Thali ₹110'];
      } else if (lower.includes('whatsapp') || lower.includes('contact') || lower.includes('call') || lower.includes('phone')) {
        reply = "You can call or WhatsApp us anytime directly at +91 9004848984. Shree Foods is dedicated to providing homely food, made with love!";
        suggestions = ['Subscribe Now', 'Today\'s Menu', 'Back to Home'];
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: reply,
        timestamp: 'Just now',
        suggestions
      };
      setChatMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  // Computed Kitchen & Dashboard metrics
  const activeSubs = subscriptions.filter(s => s.active && s.verificationStatus === 'Approved');

  // Expiring soon in <= 3 days
  const expiringSoonList = activeSubs.filter(s => {
    const days = getDaysRemaining(s.expiryDate);
    return days <= 3 && days >= 0;
  });

  // Count meals for today
  let lunchVeg = 0, lunchEgg = 0, lunchNonVeg = 0;
  let dinnerVeg = 0, dinnerEgg = 0, dinnerNonVeg = 0;

  activeSubs.forEach(sub => {
    const hasLunch = sub.mealPreference === 'Lunch Only' || sub.mealPreference === 'Lunch + Dinner';
    const hasDinner = sub.mealPreference === 'Dinner Only' || sub.mealPreference === 'Lunch + Dinner';

    if (sub.packageType === 'VEG CLASSIC') {
      if (hasLunch) lunchVeg++;
      if (hasDinner) dinnerVeg++;
    } else if (sub.packageType === 'EGG DELIGHT') {
      if (hasLunch) lunchEgg++;
      if (hasDinner) dinnerEgg++;
    } else if (sub.packageType === 'NON-VEG CLUB') {
      if (hasLunch) lunchNonVeg++;
      if (hasDinner) dinnerNonVeg++;
    }
  });

  // Add today's instant orders
  instantOrders.forEach(ord => {
    if (ord.status !== 'Cancelled') {
      if (ord.mealSlot === 'Lunch') {
        if (ord.thaliType === 'veg') lunchVeg += ord.quantity;
        else if (ord.thaliType === 'egg') lunchEgg += ord.quantity;
        else if (ord.thaliType === 'non-veg') lunchNonVeg += ord.quantity;
      } else {
        if (ord.thaliType === 'veg') dinnerVeg += ord.quantity;
        else if (ord.thaliType === 'egg') dinnerEgg += ord.quantity;
        else if (ord.thaliType === 'non-veg') dinnerNonVeg += ord.quantity;
      }
    }
  });

  const totalLunch = lunchVeg + lunchEgg + lunchNonVeg;
  const totalDinner = dinnerVeg + dinnerEgg + dinnerNonVeg;
  const totalToday = totalLunch + totalDinner;

  const totalRotiLunch = totalLunch * 4;
  const totalRotiDinner = totalDinner * 4;

  const totalRevenue =
    subscriptions.reduce((acc, sub) => acc + (sub.verificationStatus === 'Approved' ? sub.amountPaid : 0), 0) +
    instantOrders.reduce((acc, ord) => acc + (ord.status !== 'Cancelled' ? ord.totalPrice : 0), 0);

  const lowStockCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Critical').length;
  const pendingIndentsCount = chefIndents.filter(i => i.status === 'Pending Approval').length;

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        deviceType,
        setDeviceType,
        isStaffLoginOpen,
        setIsStaffLoginOpen,
        targetStaffRole,
        setTargetStaffRole,
        authenticatedRoles,
        loginStaff,
        logoutStaff,
        openStaffLogin,
        isRegistrationOpen,
        setIsRegistrationOpen,
        selectedPackageForRegistration,
        setSelectedPackageForRegistration,
        isInstantOrderOpen,
        setIsInstantOrderOpen,
        preselectedThaliType,
        setPreselectedThaliType,
        isWeeklyMenuOpen,
        setIsWeeklyMenuOpen,
        selectedMenuTab,
        setSelectedMenuTab,
        isChatOpen,
        setIsChatOpen,
        activeBannerIndex,
        setActiveBannerIndex,
        isReferralModalOpen,
        setIsReferralModalOpen,
        referrals,
        addReferralRecord,
        isNativeAppModalOpen,
        setIsNativeAppModalOpen,
        mobileTab,
        setMobileTab,
        isPushEnabled,
        setIsPushEnabled,
        isBonusOffersModalOpen,
        setIsBonusOffersModalOpen,
        bonusOffers,
        claimBonusOffer,
        isRenewalModalOpen,
        setIsRenewalModalOpen,
        selectedSubscriptionForRenewal,
        setSelectedSubscriptionForRenewal,
        renewSubscription,
        isReminderPreviewModalOpen,
        setIsReminderPreviewModalOpen,
        activeReminderSubscription,
        setActiveReminderSubscription,
        sendSubscriptionReminder,
        expiryBannerDismissed,
        setExpiryBannerDismissed,
        vegMenu,
        eggMenu,
        nonVegMenu,
        updateMenuItem,
        pricing,
        updatePricing,
        subscriptions,
        addSubscription,
        updateSubscriptionStatus,
        deleteSubscription,
        instantOrders,
        addInstantOrder,
        updateOrderStatus,
        inventory,
        updateInventoryStock,
        addNewInventoryItem,
        restockItem,
        chefIndents,
        addChefIndent,
        updateChefIndentStatus,
        chatMessages,
        sendChatMessage,
        todayMealsCount: {
          lunchVeg,
          lunchEgg,
          lunchNonVeg,
          dinnerVeg,
          dinnerEgg,
          dinnerNonVeg,
          totalToday,
          totalRotiLunch,
          totalRotiDinner
        },
        totalRevenue,
        totalSubscribers: activeSubs.length,
        lowStockCount,
        pendingIndentsCount,
        expiringSoonCount: expiringSoonList.length,
        totalReferralsCount: referrals.length
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

