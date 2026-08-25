export type CustomerCategory = 'College Student' | 'Working Professional' | 'Other';

export type PackageType = 'VEG CLASSIC' | 'EGG DELIGHT' | 'NON-VEG CLUB';

export type MealPreference = 'Lunch Only' | 'Dinner Only' | 'Lunch + Dinner';

export type SubscriptionDuration = '1 Month' | '3 Months' | '6 Months';

export type PaymentMethod = 'UPI' | 'Bank Transfer' | 'QR Code' | 'Corporate Bank Transfer';

export type ThaliType = 'veg' | 'egg' | 'non-veg';

export interface Subscription {
  id: string;
  customerName: string;
  mobileNumber: string;
  whatsappNumber: string;
  dateOfBirth?: string;
  category: CustomerCategory;

  // Student Details
  collegeName?: string;
  courseSemester?: string;
  lunchDeliveryPoint?: 'College Gate' | 'Office Gate' | 'Office Reception';

  // Professional Details
  companyName?: string;
  departmentDesignation?: string;

  // Dinner Details
  houseFlatNo?: string;
  buildingSociety?: string;
  streetArea?: string;
  landmark?: string;
  city?: string;
  pinCode?: string;

  // Map Location Link
  mapLocationLink?: string;

  // Plan Details
  packageType: PackageType;
  packageCode: 'VC' | 'ED' | 'NVC';
  monthlyPrice: number;
  mealPreference: MealPreference;
  startDate: string;
  duration: SubscriptionDuration;
  expiryDate: string;

  // Referral System
  myReferralCode?: string;
  referredByCode?: string;
  complimentarySweetsEarnedWeeks?: number;

  // Bi-Monthly Bonus
  biMonthlyBonusClaimed?: string[];

  // Reminder & Expiry
  reminderSent3Days?: boolean;
  renewedCount?: number;

  // Payment
  paymentMethod: PaymentMethod;
  transactionId?: string;
  amountPaid: number;
  paymentDate: string;
  verificationStatus: 'Approved' | 'Pending' | 'Rejected';
  routeCode: string;
  executiveName?: string;
  createdAt: string;
  active: boolean;
  customFields?: Record<string, string>;
}

export interface ReferralRecord {
  id: string;
  referrerCode: string;
  referrerName: string;
  referrerPhone: string;
  referredCustomerName: string;
  referredCustomerId: string;
  reward: string;
  rewardStatus: 'Active' | 'Redeemed' | 'Delivered';
  dateAwarded: string;
}

export interface BonusOffer {
  id: string;
  title: string;
  cycleDate: '1st of the Month' | '15th of the Month';
  description: string;
  treatItems: string[];
  bannerBadge: string;
  nextUpcomingDate: string;
}

export interface InstantOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  thaliType: ThaliType;
  thaliName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  mealSlot: 'Lunch' | 'Dinner';
  deliveryCategory: CustomerCategory;
  deliveryLocation: string;

  // Current GPS / Google Maps Location
  mapLocationLink?: string;

  specificInstructions?: string;

  status:
    | 'Received'
    | 'Pending Verification'
    | 'Cooking'
    | 'Dispatched'
    | 'Delivered'
    | 'Cancelled';

  paymentMethod: PaymentMethod;
  paymentStatus:
    | 'Paid'
    | 'Prepaid Verified'
    | 'Pending Verification';

  orderTime: string;
  estimatedDelivery: string;
}

export interface DayMealItem {
  dal: string;
  dryVeg: string;
  gravyOrNonVeg: string;
  rice: string;
  foilPacked: string;
  extras: string;
}

export interface DayMenuSchedule {
  day:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';

  lunch: DayMealItem;
  dinner: DayMealItem | null;
}

export interface InventoryItem {
  id: string;
  name: string;
  category:
    | 'Grains & Pulses'
    | 'Dairy & Poultry'
    | 'Fresh Vegetables'
    | 'Spices & Oils'
    | 'Packaging & Consumables';

  currentStock: number;

  unit:
    | 'kg'
    | 'liters'
    | 'pieces'
    | 'packets'
    | 'boxes';

  minThreshold: number;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;

  status:
    | 'In Stock'
    | 'Low Stock'
    | 'Critical';
}

export interface ChefIndentRequest {
  id: string;
  itemName: string;
  quantityNeeded: number;
  unit: string;

  priority:
    | 'Urgent (Today)'
    | 'Standard (Tomorrow)'
    | 'Weekly Buffer';

  notes?: string;
  chefName: string;
  requestedTime: string;

  status:
    | 'Pending Approval'
    | 'Approved'
    | 'Ordered'
    | 'Purchased'
    | 'Delivered'
    | 'Rejected';

  approvedBy?: string;
}

export interface NutritionInfo {
  protein: string;
  calcium: string;
  iron: string;
  fiber: string;
  vitA: string;
  vitD: string;
  vitB12?: string;
  carbs?: string;
  goodFats: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export type ActiveRole =
  | 'customer'
  | 'admin'
  | 'manager'
  | 'chef';
