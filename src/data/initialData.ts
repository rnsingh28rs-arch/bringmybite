import { DayMenuSchedule, InventoryItem, Subscription, InstantOrder, ChefIndentRequest, NutritionInfo, ReferralRecord, BonusOffer } from '../types';

export const BONUS_OFFERS: BonusOffer[] = [
  {
    id: 'BONUS-01',
    title: '1st of the Month: Royal Festive Feast & Mithai Box',
    cycleDate: '1st of the Month',
    description: 'Complimentary 4-piece premium assorted sweets box (Gulab Jamun, Kaju Katli, Besan Ladoo, Moong Halwa) + Shahi Veg/Chicken Biryani bowl upgrade with Raita.',
    treatItems: [
      '4-Piece Assorted Royal Mithai Box',
      'Shahi Dum Biryani / Veg Pulao Upgrade',
      'Roasted Garlic Papad & Mint Raita'
    ],
    bannerBadge: 'Twice-a-Month Subscriber Perk (Cycle 1)',
    nextUpcomingDate: '2026-09-01'
  },
  {
    id: 'BONUS-02',
    title: "15th of the Month: Chef's Mid-Month Delight",
    cycleDate: '15th of the Month',
    description: "Complimentary Chef's special crispy Paneer Tikka / Chicken Kebab starter platter + warm Shahi Tukda rabdi dessert.",
    treatItems: [
      'Crispy Tandoori Paneer Tikka / Chicken Kebab Starter',
      'Warm Shahi Tukda with Rich Rabdi',
      'Chilled Mango Lassi / Masala Chaas'
    ],
    bannerBadge: 'Twice-a-Month Subscriber Perk (Cycle 2)',
    nextUpcomingDate: '2026-08-15'
  }
];

export const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: 'REF-801',
    referrerCode: 'SWEET-CORP101',
    referrerName: 'TCS Gitanjali Park Account',
    referrerPhone: '9831002233',
    referredCustomerName: 'Cognizant Technology Solutions',
    referredCustomerId: 'BMB-CORP-102',
    reward: '1 Week Complimentary Sweets (7 Days)',
    rewardStatus: 'Active',
    dateAwarded: '2026-08-01'
  }
];

export const NUTRITION_DATA: Record<string, NutritionInfo> = {
  'VEG CLASSIC': {
    protein: '18–22g (Muscle repair & growth)',
    calcium: '250–300mg (Strengthens bones & teeth)',
    iron: '4–6mg (Supports healthy blood & energy)',
    fiber: '8–10g (Aids digestion & keeps you full)',
    vitA: '30–40% RDA* (Supports good vision & immunity)',
    vitD: '25–35% RDA* (Helps in calcium absorption)',
    carbs: '55–60% (Provides sustained daily energy)',
    goodFats: '12–15g (Supports heart health & hormone balance)'
  },
  'EGG DELIGHT': {
    protein: '20–24g (High-bioavailability protein)',
    calcium: '250–350mg (Bone density & teeth)',
    iron: '4–6mg (Energy & healthy hemoglobin)',
    fiber: '8–11g (Gut health & satiety)',
    vitA: '30–40% RDA* (Immune defense)',
    vitD: '15–25% RDA* (Calcium absorption)',
    vitB12: '1.2–1.8 mcg (Nerve function & brain energy)',
    goodFats: '12–15g (Healthy fats & hormone balance)'
  },
  'NON-VEG CLUB': {
    protein: '25–30g (Lean protein for strength)',
    calcium: '250–350mg (Bone health & vitality)',
    iron: '4–6mg (Oxygen transport & stamina)',
    fiber: '8–12g (Digestive balance)',
    vitA: '30–40% RDA* (Vital immunity)',
    vitD: '15–25% RDA* (Optimal calcium uptake)',
    vitB12: '2.0–2.5 mcg (Cellular energy & metabolism)',
    goodFats: '12–18g (Heart-healthy essential fats)'
  }
};

// Full Weekly Menus from the Posters
export const VEG_CLASSIC_MENU: DayMenuSchedule[] = [
  {
    day: 'Monday',
    lunch: {
      dal: 'Moong-Masoor Dal',
      dryVeg: 'Aloo Gobhi',
      gravyOrNonVeg: 'Tari-wale Aloo Matar',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Chana Dal w/ Lauki',
      dryVeg: 'Soya Bean Matar Fry',
      gravyOrNonVeg: 'Black Chana Gravy',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Tuesday',
    lunch: {
      dal: 'Toor Dal Tadka',
      dryVeg: 'Bhindi Masala',
      gravyOrNonVeg: 'Punjabi Kadhi Pakoda',
      rice: 'Jeera Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Mix Dal Fry',
      dryVeg: 'Dry Aloo Beans',
      gravyOrNonVeg: 'Soya Chunk Gravy',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Wednesday',
    lunch: {
      dal: 'Dhaba Urad-Chana',
      dryVeg: 'Cabbage Matar',
      gravyOrNonVeg: 'Mix Veg Curry',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Mint Chutney'
    },
    dinner: {
      dal: 'Moong Dal Chilka',
      dryVeg: 'Sukhi Gobi-Aloo',
      gravyOrNonVeg: 'Masala Rajma',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Thursday',
    lunch: {
      dal: 'Dal Palak',
      dryVeg: 'Roasted Jeera Aloo',
      gravyOrNonVeg: 'White Chana (Chole)',
      rice: 'Jeera Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Yellow Masoor Dal',
      dryVeg: 'Dry Aloo Palak',
      gravyOrNonVeg: 'Paneer Bhurji (Capsicum)',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Friday',
    lunch: {
      dal: 'Chana Dal Fry',
      dryVeg: 'Aloo Capsicum Fry',
      gravyOrNonVeg: 'Pindi Chole',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Arhar Dal Tadka',
      dryVeg: 'Dry Mix Veg',
      gravyOrNonVeg: 'Dum Aloo',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Saturday',
    lunch: {
      dal: 'Moong Dal Dhuli',
      dryVeg: 'Aloo Beans Fry',
      gravyOrNonVeg: 'Kadhi Pakoda',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Panchmel Dal',
      dryVeg: 'Dry Jeera Aloo',
      gravyOrNonVeg: 'Matar Paneer',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Sweet Chutney & Salad'
    }
  },
  {
    day: 'Sunday',
    lunch: {
      dal: 'Dal Makhani',
      dryVeg: 'Mix Veg Fry',
      gravyOrNonVeg: 'Shahi Paneer',
      rice: 'Veg Pulav',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Boondi Raita'
    },
    dinner: null // Kitchen closed Sunday night
  }
];

export const EGG_DELIGHT_MENU: DayMenuSchedule[] = [
  {
    day: 'Monday',
    lunch: {
      dal: 'Moong-Masoor Dal',
      dryVeg: 'Aloo Gobhi',
      gravyOrNonVeg: 'Egg Curry (2 Eggs)',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Chana Dal w/ Lauki',
      dryVeg: 'Soya Bean Matar Fry',
      gravyOrNonVeg: 'Egg Bhurji Gravy',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Tuesday',
    lunch: {
      dal: 'Toor Dal Tadka',
      dryVeg: 'Bhindi Masala',
      gravyOrNonVeg: 'Punjabi Kadhi Pakoda',
      rice: 'Jeera Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Mix Dal Fry',
      dryVeg: 'Dry Aloo Beans',
      gravyOrNonVeg: 'Soya Chunk Gravy',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Wednesday',
    lunch: {
      dal: 'Dhaba Urad-Chana',
      dryVeg: 'Cabbage Matar',
      gravyOrNonVeg: 'Egg Masala Curry (2 Eggs)',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Mint Chutney'
    },
    dinner: {
      dal: 'Moong Dal Chilka',
      dryVeg: 'Sukhi Gobi-Aloo',
      gravyOrNonVeg: 'Boiled Egg Gravy (2 Eggs)',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Thursday',
    lunch: {
      dal: 'Dal Palak',
      dryVeg: 'Roasted Jeera Aloo',
      gravyOrNonVeg: 'White Chana (Chole)',
      rice: 'Jeera Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Yellow Masoor Dal',
      dryVeg: 'Dry Aloo Palak',
      gravyOrNonVeg: 'Paneer Bhurji (Capsicum)',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Friday',
    lunch: {
      dal: 'Chana Dal Fry',
      dryVeg: 'Aloo Capsicum Fry',
      gravyOrNonVeg: 'Egg Curry (2 Eggs)',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Arhar Dal Tadka',
      dryVeg: 'Dry Mix Veg',
      gravyOrNonVeg: 'Egg Tariwala (2 Eggs)',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Saturday',
    lunch: {
      dal: 'Moong Dal Dhuli',
      dryVeg: 'Aloo Beans Fry',
      gravyOrNonVeg: 'Kadhi Pakoda',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Panchmel Dal',
      dryVeg: 'Dry Jeera Aloo',
      gravyOrNonVeg: 'Matar Paneer',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Sweet Chutney & Salad'
    }
  },
  {
    day: 'Sunday',
    lunch: {
      dal: 'Dal Makhani',
      dryVeg: 'Mix Veg Fry',
      gravyOrNonVeg: 'Shahi Paneer & Egg Roast',
      rice: 'Veg Pulav',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Boondi Raita'
    },
    dinner: null
  }
];

export const NON_VEG_CLUB_MENU: DayMenuSchedule[] = [
  {
    day: 'Monday',
    lunch: {
      dal: 'Moong-Masoor Dal',
      dryVeg: 'Aloo Gobhi',
      gravyOrNonVeg: 'Tari-wale Aloo Matar',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Chana Dal w/ Lauki',
      dryVeg: 'Soya Bean Matar Fry',
      gravyOrNonVeg: 'Chicken Curry (3 pcs)',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Tuesday',
    lunch: {
      dal: 'Toor Dal Tadka',
      dryVeg: 'Bhindi Masala',
      gravyOrNonVeg: 'Punjabi Kadhi Pakoda',
      rice: 'Jeera Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Mix Dal Fry',
      dryVeg: 'Dry Aloo Beans',
      gravyOrNonVeg: 'Soya Chunk Gravy',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Wednesday',
    lunch: {
      dal: 'Dhaba Urad-Chana',
      dryVeg: 'Cabbage Matar',
      gravyOrNonVeg: 'Mix Veg Curry',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Mint Chutney'
    },
    dinner: {
      dal: 'Moong Dal Chilka',
      dryVeg: 'Sukhi Gobi-Aloo',
      gravyOrNonVeg: 'Egg Masala Curry (2 Eggs)',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Thursday',
    lunch: {
      dal: 'Dal Palak',
      dryVeg: 'Roasted Jeera Aloo',
      gravyOrNonVeg: 'White Chana (Chole)',
      rice: 'Jeera Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Yellow Masoor Dal',
      dryVeg: 'Dry Aloo Palak',
      gravyOrNonVeg: 'Paneer Bhurji (Capsicum)',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Friday',
    lunch: {
      dal: 'Chana Dal Fry',
      dryVeg: 'Aloo Capsicum Fry',
      gravyOrNonVeg: 'Pindi Chole',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Arhar Dal Tadka',
      dryVeg: 'Dry Mix Veg',
      gravyOrNonVeg: 'Chicken Curry (3 pcs)',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    }
  },
  {
    day: 'Saturday',
    lunch: {
      dal: 'Moong Dal Dhuli',
      dryVeg: 'Aloo Beans Fry',
      gravyOrNonVeg: 'Kadhi Pakoda',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Achar'
    },
    dinner: {
      dal: 'Panchmel Dal',
      dryVeg: 'Dry Jeera Aloo',
      gravyOrNonVeg: 'Matar Paneer',
      rice: 'Steamed Rice',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Sweet Chutney & Salad'
    }
  },
  {
    day: 'Sunday',
    lunch: {
      dal: 'Dal Makhani',
      dryVeg: 'Mix Veg Fry',
      gravyOrNonVeg: 'Chicken Curry (3 pcs)',
      rice: 'Veg Pulav',
      foilPacked: '4 Roti + 1 Papad',
      extras: 'Salad & Boondi Raita'
    },
    dinner: null
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'INV-01',
    name: 'Basmati Rice Premium (Kolam/Rozana)',
    category: 'Grains & Pulses',
    currentStock: 140,
    unit: 'kg',
    minThreshold: 40,
    costPerUnit: 65,
    supplier: 'Kisan Agro Foods Mandi',
    lastRestocked: '2026-08-10',
    status: 'In Stock'
  },
  {
    id: 'INV-02',
    name: 'Wheat Atta (Chakki Fresh MP)',
    category: 'Grains & Pulses',
    currentStock: 180,
    unit: 'kg',
    minThreshold: 50,
    costPerUnit: 38,
    supplier: 'Annapurna Flour Mills',
    lastRestocked: '2026-08-11',
    status: 'In Stock'
  },
  {
    id: 'INV-03',
    name: 'Toor Dal & Moong Dal Mix',
    category: 'Grains & Pulses',
    currentStock: 45,
    unit: 'kg',
    minThreshold: 20,
    costPerUnit: 140,
    supplier: 'Shree Balaji Traders',
    lastRestocked: '2026-08-09',
    status: 'In Stock'
  },
  {
    id: 'INV-04',
    name: 'Fresh Farm Eggs (Grade A)',
    category: 'Dairy & Poultry',
    currentStock: 18, // 18 trays
    unit: 'boxes', // 30 eggs/box
    minThreshold: 10,
    costPerUnit: 180,
    supplier: 'Sunrise Poultry Farms',
    lastRestocked: '2026-08-12',
    status: 'In Stock'
  },
  {
    id: 'INV-05',
    name: 'Fresh Chicken Curry Cut',
    category: 'Dairy & Poultry',
    currentStock: 12,
    unit: 'kg',
    minThreshold: 25,
    costPerUnit: 220,
    supplier: 'Greenland Broiler Wholesale',
    lastRestocked: '2026-08-12',
    status: 'Low Stock' // Critical for dinner batch!
  },
  {
    id: 'INV-06',
    name: 'Fresh Malai Paneer',
    category: 'Dairy & Poultry',
    currentStock: 8,
    unit: 'kg',
    minThreshold: 15,
    costPerUnit: 340,
    supplier: 'Amrit Dairy Cooperative',
    lastRestocked: '2026-08-12',
    status: 'Low Stock'
  },
  {
    id: 'INV-07',
    name: 'Potatoes (Aloo Pahadi)',
    category: 'Fresh Vegetables',
    currentStock: 95,
    unit: 'kg',
    minThreshold: 30,
    costPerUnit: 24,
    supplier: 'APMC Sabzi Mandi',
    lastRestocked: '2026-08-12',
    status: 'In Stock'
  },
  {
    id: 'INV-08',
    name: 'Cauliflower & Green Peas (Gobhi-Matar)',
    category: 'Fresh Vegetables',
    currentStock: 14,
    unit: 'kg',
    minThreshold: 20,
    costPerUnit: 48,
    supplier: 'APMC Sabzi Mandi',
    lastRestocked: '2026-08-12',
    status: 'Low Stock'
  },
  {
    id: 'INV-09',
    name: 'Pure Mustard Oil & Refined Oil',
    category: 'Spices & Oils',
    currentStock: 60,
    unit: 'liters',
    minThreshold: 25,
    costPerUnit: 135,
    supplier: 'Fortune Oil Distributors',
    lastRestocked: '2026-08-08',
    status: 'In Stock'
  },
  {
    id: 'INV-10',
    name: '5-Compartment Meal Trays (5CP Leak-proof)',
    category: 'Packaging & Consumables',
    currentStock: 1200,
    unit: 'pieces',
    minThreshold: 400,
    costPerUnit: 6.5,
    supplier: 'EcoPack India Ltd',
    lastRestocked: '2026-08-07',
    status: 'In Stock'
  },
  {
    id: 'INV-11',
    name: 'Heavy Duty Food Grade Aluminum Foil',
    category: 'Packaging & Consumables',
    currentStock: 35,
    unit: 'packets',
    minThreshold: 15,
    costPerUnit: 95,
    supplier: 'SafeWrap Essentials',
    lastRestocked: '2026-08-09',
    status: 'In Stock'
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'BMB-CORP-101',
    customerName: 'TCS Gitanjali Park Corporate',
    mobileNumber: '9831002233',
    whatsappNumber: '9831002233',
    dateOfBirth: '1995-05-15',
    category: 'Working Professional',
    companyName: 'Tata Consultancy Services (TCS)',
    departmentDesignation: 'Facilities & Employee Wellbeing',
    lunchDeliveryPoint: 'Office Reception',
    houseFlatNo: 'Gitanjali Park Campus, Block 2',
    buildingSociety: 'TCS Tech Complex',
    streetArea: 'New Town Action Area 2',
    landmark: 'Near Major Arterial Road',
    city: 'City Centre',
    pinCode: '700156',
    mapLocationLink: 'https://maps.google.com/?q=22.5855,88.4610',
    packageType: 'VEG CLASSIC',
    packageCode: 'VC',
    monthlyPrice: 3500,
    mealPreference: 'Lunch + Dinner',
    startDate: '2026-08-01',
    duration: '3 Months',
    expiryDate: '2026-11-01',
    myReferralCode: 'SWEET-CORP101',
    complimentarySweetsEarnedWeeks: 1,
    biMonthlyBonusClaimed: ['2026-08-01'],
    reminderSent3Days: false,
    paymentMethod: 'Corporate Bank Transfer',
    transactionId: 'CORP-TCS-20260801',
    amountPaid: 10500,
    paymentDate: '2026-08-01',
    verificationStatus: 'Approved',
    routeCode: 'VC-L01 / D01',
    executiveName: 'Sunil Verma',
    createdAt: '2026-08-01',
    active: true
  },
  {
    id: 'BMB-CORP-102',
    customerName: 'Cognizant Technology Solutions',
    mobileNumber: '9830911223',
    whatsappNumber: '9830911223',
    dateOfBirth: '1996-02-17',
    category: 'Working Professional',
    companyName: 'Cognizant Technology Solutions',
    departmentDesignation: 'Team Lead - Cloud Services',
    lunchDeliveryPoint: 'Office Gate',
    houseFlatNo: 'Plot 44, Shantiniketan Apts',
    buildingSociety: 'Kestopur Main Road',
    streetArea: 'VIP Road Corridor',
    landmark: 'Near Hanuman Mandir',
    city: 'City Centre',
    pinCode: '700102',
    mapLocationLink: 'https://maps.google.com/?q=22.5930,88.4280',
    packageType: 'EGG DELIGHT',
    packageCode: 'ED',
    monthlyPrice: 4000,
    mealPreference: 'Lunch + Dinner',
    startDate: '2026-08-10',
    duration: '3 Months',
    expiryDate: '2026-11-10',
    myReferralCode: 'SWEET-CORP102',
    referredByCode: 'SWEET-CORP101',
    complimentarySweetsEarnedWeeks: 1,
    biMonthlyBonusClaimed: ['2026-08-01'],
    reminderSent3Days: false,
    paymentMethod: 'Corporate Bank Transfer',
    transactionId: 'IMPS-20260810239',
    amountPaid: 12000,
    paymentDate: '2026-08-09',
    verificationStatus: 'Approved',
    routeCode: 'ED-L02 / D02',
    executiveName: 'Ramesh Das',
    createdAt: '2026-08-09',
    active: true
  },
  {
    id: 'BMB-CORP-103',
    customerName: 'Wipro Technologies Salt Lake',
    mobileNumber: '9830554433',
    whatsappNumber: '9830554433',
    dateOfBirth: '1994-08-20',
    category: 'Working Professional',
    companyName: 'Wipro Technologies',
    departmentDesignation: 'Enterprise Services',
    lunchDeliveryPoint: 'Office Reception',
    houseFlatNo: 'Tower 1 Front Desk',
    buildingSociety: 'Wipro Campus',
    streetArea: 'Sector 5, Salt Lake',
    landmark: 'Near College More',
    city: 'City Centre',
    pinCode: '700091',
    mapLocationLink: 'https://maps.google.com/?q=22.5804,88.4352',
    packageType: 'NON-VEG CLUB',
    packageCode: 'NVC',
    monthlyPrice: 4500,
    mealPreference: 'Lunch + Dinner',
    startDate: '2026-08-12',
    duration: '3 Months',
    expiryDate: '2026-11-12',
    myReferralCode: 'SWEET-CORP103',
    complimentarySweetsEarnedWeeks: 0,
    biMonthlyBonusClaimed: [],
    reminderSent3Days: false,
    paymentMethod: 'UPI',
    transactionId: 'UPI-9944332211',
    amountPaid: 13500,
    paymentDate: '2026-08-11',
    verificationStatus: 'Approved',
    routeCode: 'NVC-L03 / D03',
    executiveName: 'Sunil Verma',
    createdAt: '2026-08-11',
    active: true
  }
];

export const INITIAL_INSTANT_ORDERS: InstantOrder[] = [
  {
    id: 'ORD-781',
    customerName: 'Rohan Gupta',
    customerPhone: '9831002233',
    thaliType: 'veg',
    thaliName: 'Veg Classic Thali',
    quantity: 2,
    unitPrice: 80,
    totalPrice: 160,
    mealSlot: 'Lunch',
    deliveryCategory: 'College Student',
    deliveryLocation: 'Heritage Institute of Tech, Gate 1 Main Entrance',
    specificInstructions: 'Please deliver hot rotis with extra achar packet',
    status: 'Delivered',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderTime: '11:45 AM',
    estimatedDelivery: '12:30 PM'
  },
  {
    id: 'ORD-782',
    customerName: 'Neha Kulkarni',
    customerPhone: '9748112299',
    thaliType: 'egg',
    thaliName: 'Egg Delight Thali (2 Eggs)',
    quantity: 1,
    unitPrice: 100,
    totalPrice: 100,
    mealSlot: 'Lunch',
    deliveryCategory: 'Working Professional',
    deliveryLocation: 'TCS Gitanjali Park, Security Gate 2',
    specificInstructions: 'Call upon arrival at the gate',
    status: 'Dispatched',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderTime: '12:05 PM',
    estimatedDelivery: '12:45 PM'
  },
  {
    id: 'ORD-783',
    customerName: 'Kunal Roy',
    customerPhone: '9830554433',
    thaliType: 'non-veg',
    thaliName: 'Chicken Non-Veg Thali (3 pcs)',
    quantity: 3,
    unitPrice: 110,
    totalPrice: 330,
    mealSlot: 'Lunch',
    deliveryCategory: 'Working Professional',
    deliveryLocation: 'Wipro Technologies, Tower 1 Front Gate',
    specificInstructions: 'Extra spicy chicken gravy preferred',
    status: 'Cooking',
    paymentMethod: 'UPI',
    paymentStatus: 'Prepaid Verified',
    orderTime: '12:20 PM',
    estimatedDelivery: '1:10 PM'
  },
  {
    id: 'ORD-784',
    customerName: 'Sanjay Sengupta',
    customerPhone: '9830114477',
    thaliType: 'veg',
    thaliName: 'Veg Classic Thali',
    quantity: 1,
    unitPrice: 80,
    totalPrice: 80,
    mealSlot: 'Dinner',
    deliveryCategory: 'Other',
    deliveryLocation: 'Flat 301, Sunshine Enclave, Salt Lake Sector 1',
    specificInstructions: 'Deliver by 8:15 PM sharp',
    status: 'Received',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderTime: '1:10 PM',
    estimatedDelivery: '8:00 PM'
  }
];

export const INITIAL_CHEF_INDENTS: ChefIndentRequest[] = [
  {
    id: 'IND-301',
    itemName: 'Fresh Broiler Chicken (Curry Cut)',
    quantityNeeded: 35,
    unit: 'kg',
    priority: 'Urgent (Today)',
    notes: 'For tonight dinner chicken batch (approx 120 non-veg orders)',
    chefName: 'Head Chef Manas Tripathy',
    requestedTime: '10:30 AM',
    status: 'Ordered',
    approvedBy: 'Operations Manager'
  },
  {
    id: 'IND-302',
    itemName: 'Fresh Malai Paneer Block',
    quantityNeeded: 18,
    unit: 'kg',
    priority: 'Urgent (Today)',
    notes: 'For Matar Paneer dinner and tomorrow lunch Chana paneer',
    chefName: 'Head Chef Manas Tripathy',
    requestedTime: '11:15 AM',
    status: 'Approved',
    approvedBy: 'Operations Manager'
  },
  {
    id: 'IND-303',
    itemName: 'Green Peas (Matar) & Cauliflower',
    quantityNeeded: 25,
    unit: 'kg',
    priority: 'Standard (Tomorrow)',
    notes: 'For tomorrow lunch Cabbage Matar and Soya Bean Matar fry',
    chefName: 'Sous Chef Rajesh Das',
    requestedTime: '12:00 PM',
    status: 'Pending Approval'
  },
  {
    id: 'IND-304',
    itemName: 'Grade-A Farm Eggs',
    quantityNeeded: 12,
    unit: 'boxes (360 eggs)',
    priority: 'Standard (Tomorrow)',
    notes: 'For Wednesday lunch & dinner Egg Masala Curry batches',
    chefName: 'Head Chef Manas Tripathy',
    requestedTime: '12:45 PM',
    status: 'Pending Approval'
  }
];
