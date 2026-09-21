export const SEO_ORIGIN = 'https://bringmybite.com';

export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  kind?: 'home' | 'product' | 'faq' | 'info' | 'location';
  locationName?: string;
  locationType?: 'Greater Noida West' | 'Nearby Noida';
};

export const PUBLIC_SEO_ROUTES: SeoRoute[] = [
  {
    path: '/',
    title: 'Tiffin Service in Greater Noida West | Home Food Delivery | Bring My Bite',
    description: 'Bring My Bite provides fresh home-style tiffin and meal delivery in Greater Noida West, including Gaur City, Bisrakh, Techzone IV and nearby areas, with monthly meal plans and one-time thalis.',
    heading: 'Tiffin Service in Greater Noida West',
    intro: 'Fresh home-style tiffin and meal delivery for residents, students and working professionals in Greater Noida West. Explore monthly lunch and dinner plans and one-time thalis, with delivery availability checked by address.',
    kind: 'home',
    locationName: 'Greater Noida West',
    locationType: 'Greater Noida West',
  },
  {
    path: '/tiffin-service-greater-noida',
    title: 'Tiffin Service in Greater Noida West | Bring My Bite',
    description: 'Looking for tiffin service in Greater Noida? Bring My Bite is focused on Greater Noida West, including Gaur City, Bisrakh, Techzone IV and nearby residential areas.',
    heading: 'Tiffin Service for Greater Noida West',
    intro: 'Bring My Bite is shifting its service-area focus to Greater Noida West, with the kitchen planned around Bisrakh and delivery coverage centred on Gaur City, Techzone IV and nearby societies.',
    kind: 'location',
    locationName: 'Greater Noida West',
    locationType: 'Greater Noida West',
  },
  {
    path: '/tiffin-service-greater-noida-west',
    title: 'Tiffin Service in Greater Noida West | Home Food Delivery | Bring My Bite',
    description: 'Fresh home-style tiffin, monthly meal subscriptions and one-time thalis in Greater Noida West, including Gaur City, Bisrakh, Techzone IV, Sector 1, Sector 3 and nearby societies.',
    heading: 'Home Food & Tiffin Service in Greater Noida West',
    intro: 'Bring My Bite serves the Greater Noida West residential belt around Bisrakh and Noida Extension. Check delivery availability for your society or address before ordering.',
    kind: 'location',
    locationName: 'Greater Noida West',
    locationType: 'Greater Noida West',
  },
  {
    path: '/tiffin-service-gaur-city-1',
    title: 'Tiffin Service in Gaur City 1 | Home Food Delivery | Bring My Bite',
    description: 'Home-style tiffin and monthly meal delivery for Gaur City 1 and nearby Greater Noida West societies from Bring My Bite.',
    heading: 'Tiffin Service in Gaur City 1',
    intro: 'Looking for daily lunch, dinner or monthly tiffin near Gaur City 1? Bring My Bite provides home-style meal options with address-based delivery availability.',
    kind: 'location',
    locationName: 'Gaur City 1',
    locationType: 'Greater Noida West',
  },
  {
    path: '/tiffin-service-gaur-city-2',
    title: 'Tiffin Service in Gaur City 2 | Home Food Delivery | Bring My Bite',
    description: 'Fresh home-style tiffin, monthly meals and one-time thalis for Gaur City 2 and nearby Greater Noida West areas from Bring My Bite.',
    heading: 'Tiffin Service in Gaur City 2',
    intro: 'Bring My Bite offers a convenient home-food option for residents of Gaur City 2 and nearby societies, with monthly plans and one-time meals subject to delivery availability.',
    kind: 'location',
    locationName: 'Gaur City 2',
    locationType: 'Greater Noida West',
  },
  {
    path: '/tiffin-service-bisrakh',
    title: 'Tiffin Service in Bisrakh | Greater Noida West | Bring My Bite',
    description: 'Bring My Bite is setting up its Greater Noida West kitchen near Bisrakh, serving home-style tiffin and meal plans to nearby residential areas.',
    heading: 'Tiffin Service in Bisrakh',
    intro: 'Bisrakh is the operational hub for Bring My Bite\'s Greater Noida West expansion. Residents can check availability for monthly tiffin, lunch, dinner and one-time thalis.',
    kind: 'location',
    locationName: 'Bisrakh',
    locationType: 'Greater Noida West',
  },
  {
    path: '/tiffin-service-techzone-iv',
    title: 'Tiffin Service in Techzone IV | Greater Noida West | Bring My Bite',
    description: 'Home food and tiffin delivery in Techzone IV, Greater Noida West, including nearby residential societies and office locations.',
    heading: 'Tiffin Service in Techzone IV',
    intro: 'Bring My Bite is targeting Techzone IV as part of its Greater Noida West delivery network, with monthly meal subscriptions and one-time thali ordering.',
    kind: 'location',
    locationName: 'Techzone IV',
    locationType: 'Greater Noida West',
  },
  {
    path: '/tiffin-service-sector-1-greater-noida-west',
    title: 'Tiffin Service in Sector 1 Greater Noida West | Bring My Bite',
    description: 'Fresh home-style tiffin and monthly meal delivery for Sector 1, Greater Noida West and nearby residential societies.',
    heading: 'Tiffin Service in Sector 1, Greater Noida West',
    intro: 'Bring My Bite is building delivery coverage around Sector 1 and nearby Greater Noida West societies. Confirm your exact address before ordering.',
    kind: 'location',
    locationName: 'Sector 1, Greater Noida West',
    locationType: 'Greater Noida West',
  },
  {
    path: '/tiffin-service-sector-3-greater-noida-west',
    title: 'Tiffin Service in Sector 3 Greater Noida West | Bring My Bite',
    description: 'Home-style tiffin and meal subscriptions for Sector 3, Greater Noida West, with delivery availability based on your address.',
    heading: 'Tiffin Service in Sector 3, Greater Noida West',
    intro: 'Residents of Sector 3 can check Bring My Bite for monthly lunch, dinner and one-time thali options as coverage expands across Greater Noida West.',
    kind: 'location',
    locationName: 'Sector 3, Greater Noida West',
    locationType: 'Greater Noida West',
  },
  {
    path: '/tiffin-service-sector-4-greater-noida-west',
    title: 'Tiffin Service in Sector 4 Greater Noida West | Bring My Bite',
    description: 'Fresh tiffin and home-style meal delivery for Sector 4, Greater Noida West, including the Gaur City area.',
    heading: 'Tiffin Service in Sector 4, Greater Noida West',
    intro: 'Bring My Bite is targeting Sector 4 and the Gaur City belt for home-style lunch, dinner and monthly tiffin plans, subject to address availability.',
    kind: 'location',
    locationName: 'Sector 4, Greater Noida West',
    locationType: 'Greater Noida West',
  },
  {
    path: '/tiffin-service-sector-12-greater-noida-west',
    title: 'Tiffin Service in Sector 12 Greater Noida West | Bring My Bite',
    description: 'Home-style tiffin and monthly meal delivery for Sector 12 and nearby Greater Noida West residential societies.',
    heading: 'Tiffin Service in Sector 12, Greater Noida West',
    intro: 'Bring My Bite is expanding its Greater Noida West coverage toward Sector 12 and nearby societies. Check your address for current delivery availability.',
    kind: 'location',
    locationName: 'Sector 12, Greater Noida West',
    locationType: 'Greater Noida West',
  },
  {
    path: '/tiffin-service-sector-16c-greater-noida-west',
    title: 'Tiffin Service in Sector 16C Greater Noida West | Bring My Bite',
    description: 'Fresh home-style tiffin and meal subscriptions for Sector 16C and nearby Greater Noida West societies.',
    heading: 'Tiffin Service in Sector 16C, Greater Noida West',
    intro: 'Bring My Bite is targeting the Sector 16C and Gaur City 2 residential belt with monthly meal plans and one-time thalis, subject to delivery coverage.',
    kind: 'location',
    locationName: 'Sector 16C, Greater Noida West',
    locationType: 'Greater Noida West',
  },
  {
    path: '/tiffin-service-noida-sector-62',
    title: 'Tiffin Service Near Sector 62 Noida | Bring My Bite',
    description: 'Home-style tiffin and monthly meal delivery near Sector 62, Noida, as Bring My Bite expands from its Greater Noida West kitchen toward nearby Noida areas.',
    heading: 'Tiffin Service Near Sector 62, Noida',
    intro: 'Sector 62 is a nearby office and residential demand area. Bring My Bite can target eligible addresses from the Greater Noida West kitchen, with exact delivery availability confirmed by address.',
    kind: 'location',
    locationName: 'Sector 62, Noida',
    locationType: 'Nearby Noida',
  },
  {
    path: '/tiffin-service-noida-sector-63',
    title: 'Tiffin Service Near Sector 63 Noida | Bring My Bite',
    description: 'Home-style tiffin and monthly meal delivery near Sector 63, Noida, with service availability checked by address from the Greater Noida West kitchen.',
    heading: 'Tiffin Service Near Sector 63, Noida',
    intro: 'Bring My Bite is targeting nearby Noida demand around Sector 63 for office lunch and regular meal delivery, subject to operational delivery coverage.',
    kind: 'location',
    locationName: 'Sector 63, Noida',
    locationType: 'Nearby Noida',
  },
  {
    path: '/monthly-meal-subscription',
    title: 'Monthly Meal Subscription in Greater Noida West | Bring My Bite',
    description: 'Monthly lunch and dinner meal subscriptions from Bring My Bite for residents and working professionals in Greater Noida West.',
    heading: 'Monthly Meal Subscription',
    intro: 'A practical monthly meal plan for residents, students and working professionals in Greater Noida West who want a dependable everyday tiffin routine.',
    kind: 'product',
  },
  {
    path: '/veg-meal-subscription',
    title: 'Veg Meal Subscription in Greater Noida West | Bring My Bite',
    description: 'Vegetarian monthly tiffin and meal subscription options from Bring My Bite for Greater Noida West.',
    heading: 'Veg Meal Subscription',
    intro: 'Choose a vegetarian monthly meal routine designed around familiar home-style food and convenient Greater Noida West delivery.',
    kind: 'product',
  },
  {
    path: '/egg-meal-subscription',
    title: 'Egg Meal Subscription in Greater Noida West | Bring My Bite',
    description: 'Egg-based monthly tiffin and meal subscription options from Bring My Bite for Greater Noida West.',
    heading: 'Egg Meal Subscription',
    intro: 'An egg-based monthly meal option for customers in Greater Noida West who want a convenient everyday tiffin routine.',
    kind: 'product',
  },
  {
    path: '/non-veg-meal-subscription',
    title: 'Non-Veg Meal Subscription in Greater Noida West | Bring My Bite',
    description: 'Non-vegetarian monthly tiffin and meal subscription options from Bring My Bite for Greater Noida West.',
    heading: 'Non-Veg Meal Subscription',
    intro: 'A non-vegetarian monthly meal option built for a convenient everyday food routine in Greater Noida West.',
    kind: 'product',
  },
  {
    path: '/instant-thali',
    title: 'Instant Thali in Greater Noida West | Bring My Bite',
    description: 'Order a one-time home-style Instant Thali from Bring My Bite in Greater Noida West without a monthly commitment.',
    heading: 'Instant Thali Order',
    intro: 'Need a meal today without a monthly plan? Use the existing Instant Thali ordering flow and confirm delivery availability for your address.',
    kind: 'product',
  },
  {
    path: '/weekly-menu',
    title: 'Weekly Tiffin Menu in Greater Noida West | Bring My Bite',
    description: 'See how the Bring My Bite weekly lunch and dinner menu is organised for Greater Noida West customers.',
    heading: 'Weekly Meal Menu',
    intro: 'Explore the weekly lunch and dinner menu structure and use the live menu in the main Bring My Bite ordering experience.',
    kind: 'faq',
  },
  {
    path: '/how-it-works',
    title: 'How Bring My Bite Tiffin Service Works in Greater Noida West',
    description: 'Learn how Bring My Bite monthly meal subscriptions, weekly menus and one-time thali ordering work in Greater Noida West.',
    heading: 'How Bring My Bite Works',
    intro: 'From choosing a meal plan to receiving your food, the experience is designed to keep everyday meals simple for Greater Noida West customers.',
    kind: 'info',
  },
  {
    path: '/delivery-areas',
    title: 'Bring My Bite Delivery Areas | Greater Noida West & Nearby Noida',
    description: 'See Bring My Bite delivery focus across Greater Noida West and nearby Noida areas, including Gaur City, Bisrakh, Techzone IV, Sector 62 and Sector 63.',
    heading: 'Delivery Areas',
    intro: 'Our current SEO and operational focus is Greater Noida West, with nearby Noida demand areas considered subject to delivery feasibility and address confirmation.',
    kind: 'info',
  },
  {
    path: '/contact',
    title: 'Contact Bring My Bite | Greater Noida West Tiffin Service',
    description: 'Contact Bring My Bite for monthly meal subscriptions, Instant Thali orders, menu questions, delivery availability and customer support.',
    heading: 'Contact Bring My Bite',
    intro: 'Have a question about meals, subscriptions, menus or delivery coverage? Use the existing contact and WhatsApp support options.',
    kind: 'faq',
  },
];

const PUBLIC_PATHS = new Set(PUBLIC_SEO_ROUTES.map((route) => route.path));

export function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  const path = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return path || '/';
}

export function getSeoRoute(pathname: string): SeoRoute | null {
  const path = normalizePath(pathname);
  return PUBLIC_SEO_ROUTES.find((route) => route.path === path) || null;
}

export function isPublicSeoPath(pathname: string): boolean {
  return PUBLIC_PATHS.has(normalizePath(pathname));
}

export function canonicalUrl(pathname: string): string {
  const route = getSeoRoute(pathname);
  return `${SEO_ORIGIN}${route?.path === '/' || !route ? (route ? '' : normalizePath(pathname)) : route.path}`;
}
