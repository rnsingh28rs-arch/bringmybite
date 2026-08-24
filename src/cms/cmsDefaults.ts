import { VEG_CLASSIC_MENU, EGG_DELIGHT_MENU, NON_VEG_CLUB_MENU } from '../data/initialData';
import { OFFICIAL_BANK_DETAILS } from '../data/paymentConfig';
import { FOOD_IMAGES } from '../assets/foodImages';
import type { DayMenuSchedule, PackageType } from '../types';

export interface PricingConfig {
  vegMonthly: number;
  eggMonthly: number;
  nonVegMonthly: number;
  vegThaliInstant: number;
  eggThaliInstant: number;
  nonVegThaliInstant: number;
}

export interface BannerConfig {
  id: string;
  sort_order: number;
  active: boolean;
  tag: string;
  title: string;
  highlight_price: string;
  period: string;
  thali_rate: string;
  description: string;
  features: string[];
  package_key: PackageType;
  thali_key: 'veg' | 'egg' | 'non-veg';
  image_url: string;
  image_alt: string;
  dish_highlights: string[];
  tag_color: string;
  badge_bg: string;
  accent_color: string;
  button_accent: string;
  card_border: string;
}

export interface RegistrationFieldConfig {
  id: string;
  label: string;
  field_key: string;
  field_type: 'text' | 'tel' | 'email' | 'date' | 'select' | 'textarea' | 'number' | 'checkbox';
  required: boolean;
  active: boolean;
  sort_order: number;
  placeholder: string;
  options: string[];
}

export const DEFAULT_PRICING: PricingConfig = {
  vegMonthly: 3500,
  eggMonthly: 4000,
  nonVegMonthly: 4500,
  vegThaliInstant: 80,
  eggThaliInstant: 100,
  nonVegThaliInstant: 110
};

export const DEFAULT_PAYMENT = { ...OFFICIAL_BANK_DETAILS, qrUrl: '' };

export const DEFAULT_SITE_SETTINGS: Record<string, string> = {
  business_name: 'Bring My Bite',
  legal_name: 'SHREE FOODS',
  tagline: 'Homely Tiffin Service',
  phone: OFFICIAL_BANK_DETAILS.phone,
  whatsapp: OFFICIAL_BANK_DETAILS.phone,
  email: '',
  address: '',
  google_maps_url: '',
  logo_url: '',
  primary_color: '#124E33',
  accent_color: '#C88A24'
};

const shared = {
  tag_color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  badge_bg: 'from-emerald-800 to-emerald-950',
  accent_color: 'text-emerald-400',
  button_accent: 'bg-[#124E33] hover:bg-[#0A2A1B] text-white',
  card_border: 'border-emerald-600/40'
};

export const DEFAULT_BANNERS: BannerConfig[] = [
  {
    id: 'veg', sort_order: 1, active: true,
    tag: '100% PURE VEGETARIAN', title: 'The Veg Classic Package', highlight_price: '₹3500', period: '/ Month',
    thali_rate: '₹80 Instant Single Thali',
    description: 'Pure vegetarian homely meals crafted with fresh seasonal vegetables, daily changing dal tadka, jeera/steamed rice, 4 warm rotis & papad.',
    features: ['13 Meals / Week (Mon–Sun)', 'Lunch at Gate • Dinner at Home', '18–22g Balanced Protein', '100% Hygienic 5CP Trays'],
    package_key: 'VEG CLASSIC', thali_key: 'veg', image_url: FOOD_IMAGES.vegThali,
    image_alt: 'Pure Vegetarian Homely 5CP Thali', dish_highlights: ['Dal Tadka / Makhani', 'Paneer Butter / Aloo Gobhi', 'Jeera Basmati Rice', '4 Warm Rotis + Papad'], ...shared
  },
  {
    id: 'egg', sort_order: 2, active: true,
    tag: 'HIGH PROTEIN & TASTY', title: 'The Egg Delight Package', highlight_price: '₹4000', period: '/ Month',
    thali_rate: '₹100 Instant Single Thali',
    description: 'Specially curated for active students & professionals needing high bioavailability protein with rich Egg Curries, Bhurji Gravies, Kadhi & Paneer.',
    features: ['13 Meals / Week with Egg Delicacies', '20–24g Natural Protein per meal', 'Freshly Boiled & Farm Grade Eggs', '4 Warm Rotis in Premium Foil'],
    package_key: 'EGG DELIGHT', thali_key: 'egg', image_url: FOOD_IMAGES.eggThali,
    image_alt: 'High Protein Egg Curry Thali', dish_highlights: ['Egg Curry (2 Eggs)', 'Egg Bhurji / Kadhi', 'Steamed Basmati Rice', '4 Butter Rotis + Salad'],
    tag_color: 'bg-amber-100 text-amber-900 border-amber-300', badge_bg: 'from-amber-900 to-amber-950', accent_color: 'text-amber-400', button_accent: 'bg-[#C88A24] hover:bg-[#A97116] text-white', card_border: 'border-amber-600/40'
  },
  {
    id: 'non-veg', sort_order: 3, active: true,
    tag: 'WEEKLY CHICKEN SPECIAL', title: 'The Non-Veg Club Package', highlight_price: '₹4500', period: '/ Month',
    thali_rate: '₹110 Instant Single Thali',
    description: 'Rich, aromatic home-style Chicken Curry (3 pcs) and Egg specialties paired with hearty dals, seasonal greens, aromatic rice and rotis.',
    features: ['Chicken Curry & Egg Masala Rotations', '25–30g Muscle-Building Protein', 'Sunday Feast Included', 'Strictly Fresh & Clean Poultry'],
    package_key: 'NON-VEG CLUB', thali_key: 'non-veg', image_url: FOOD_IMAGES.nonVegThali,
    image_alt: 'Succulent Chicken Curry Thali', dish_highlights: ['Chicken Curry (3 pcs)', 'Egg Curry on Rotation', 'Yellow Dal Tadka', 'Basmati Rice + 4 Rotis'],
    tag_color: 'bg-rose-100 text-rose-900 border-rose-300', badge_bg: 'from-rose-950 to-stone-950', accent_color: 'text-rose-400', button_accent: 'bg-[#7A1C1C] hover:bg-[#5C1111] text-white', card_border: 'border-rose-700/40'
  },
  {
    id: 'instant', sort_order: 4, active: true,
    tag: 'FAST 45-MIN GATE DELIVERY', title: 'Instant One-Time Thali Orders', highlight_price: 'From ₹80', period: '/ Single Thali',
    thali_rate: 'Veg: ₹80 | Egg: ₹100 | Non-Veg: ₹110',
    description: 'Need a fresh, steaming hot meal delivered right now? Order an instant 5-compartment thali directly to your college gate or office reception with zero monthly lock-in.',
    features: ['No Monthly Lock-in Required', '45–60 Minute Direct Gate Delivery', 'Served in 5CP Leak-proof Tray', 'Includes 4 Roti, Papad, Salad & Achar'],
    package_key: 'VEG CLASSIC', thali_key: 'veg', image_url: FOOD_IMAGES.instantTiffin,
    image_alt: 'Fresh Hot 5-Compartment Meal Tray', dish_highlights: ['Veg Thali (₹80)', 'Egg Thali (₹100)', 'Non-Veg Thali (₹110)', 'Steaming Hot Gate Drop'],
    tag_color: 'bg-yellow-100 text-yellow-900 border-yellow-300', badge_bg: 'from-emerald-900 to-amber-950', accent_color: 'text-[#F2C94C]', button_accent: 'bg-[#C88A24] hover:bg-[#A97116] text-white', card_border: 'border-[#C88A24]/40'
  }
];

export const DEFAULT_REGISTRATION_FIELDS: RegistrationFieldConfig[] = [
  { id: 'customerName', label: 'Full Name', field_key: 'customerName', field_type: 'text', required: true, active: true, sort_order: 1, placeholder: 'Enter full name', options: [] },
  { id: 'mobileNumber', label: 'Mobile Number', field_key: 'mobileNumber', field_type: 'tel', required: true, active: true, sort_order: 2, placeholder: '10-digit mobile number', options: [] },
  { id: 'whatsappNumber', label: 'WhatsApp Number', field_key: 'whatsappNumber', field_type: 'tel', required: false, active: true, sort_order: 3, placeholder: 'WhatsApp number', options: [] },
  { id: 'category', label: 'Customer Category', field_key: 'category', field_type: 'select', required: true, active: true, sort_order: 4, placeholder: 'Select category', options: ['College Student', 'Working Professional', 'Other'] },
  { id: 'collegeName', label: 'College / University', field_key: 'collegeName', field_type: 'text', required: false, active: true, sort_order: 5, placeholder: 'College / University name', options: [] },
  { id: 'companyName', label: 'Company', field_key: 'companyName', field_type: 'text', required: false, active: true, sort_order: 6, placeholder: 'Company name', options: [] },
  { id: 'houseFlatNo', label: 'House / Flat No.', field_key: 'houseFlatNo', field_type: 'text', required: false, active: true, sort_order: 7, placeholder: 'House / Flat', options: [] },
  { id: 'streetArea', label: 'Street / Area', field_key: 'streetArea', field_type: 'text', required: false, active: true, sort_order: 8, placeholder: 'Street / Area', options: [] },
  { id: 'landmark', label: 'Landmark', field_key: 'landmark', field_type: 'text', required: false, active: true, sort_order: 9, placeholder: 'Nearby landmark', options: [] },
  { id: 'pinCode', label: 'PIN Code', field_key: 'pinCode', field_type: 'text', required: false, active: true, sort_order: 10, placeholder: 'PIN code', options: [] }
];

export const DEFAULT_MENUS: Record<PackageType, DayMenuSchedule[]> = {
  'VEG CLASSIC': VEG_CLASSIC_MENU,
  'EGG DELIGHT': EGG_DELIGHT_MENU,
  'NON-VEG CLUB': NON_VEG_CLUB_MENU
};

export const DEFAULT_PANELS = [
  ['dashboard', 'Executive Dashboard'], ['banners', 'Banners & Home'], ['menu', 'Menu & Dishes'], ['pricing', 'Pricing & Packages'],
  ['registration', 'Registration Form'], ['payments', 'Payments & UPI'], ['business', 'Business Information'], ['media', 'Media Library'],
  ['customers', 'Customers'], ['orders', 'Orders'], ['inventory', 'Inventory'], ['staff', 'Staff & Permissions']
].map(([id, name], index) => ({ id, name, sort_order: index + 1, active: true }));

export const DEFAULT_ROLES = [
  { id: 'ceo-director', name: 'CEO Cum Director', active: true },
  { id: 'admin', name: 'Admin', active: true },
  { id: 'manager', name: 'Manager', active: true },
  { id: 'chef', name: 'Chef', active: true }
];
