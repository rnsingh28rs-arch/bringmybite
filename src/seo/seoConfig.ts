export const SEO_ORIGIN = 'https://bringmybite.com';

export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  kind?: 'home' | 'product' | 'faq' | 'info';
};

export const PUBLIC_SEO_ROUTES: SeoRoute[] = [
  {
    path: '/',
    title: 'Tiffin Service in Greater Noida | Bring My Bite',
    description: 'Bring My Bite offers fresh home-style tiffin service in Greater Noida with monthly lunch and dinner subscriptions and one-time thali orders.',
    heading: 'Tiffin Service in Greater Noida',
    intro: 'Fresh home-style meals for students and working professionals in Greater Noida, with monthly lunch, dinner and lunch-plus-dinner plans plus one-time thali ordering.',
    kind: 'home',
  },
  {
    path: '/tiffin-service-greater-noida',
    title: 'Tiffin Service in Greater Noida | Home Food Delivery | Bring My Bite',
    description: 'Looking for a tiffin service in Greater Noida? Bring My Bite provides fresh home-style meals, monthly lunch and dinner subscriptions, and one-time thali orders.',
    heading: 'Tiffin Service in Greater Noida',
    intro: 'Bring My Bite is a home-style tiffin and meal subscription service serving Greater Noida. Choose Veg, Egg or Non-Veg options where available and check delivery availability before ordering.',
    kind: 'home',
  },
  {
    path: '/monthly-meal-subscription',
    title: 'Monthly Meal Subscription | Bring My Bite',
    description: 'Explore monthly meal subscriptions from Bring My Bite for convenient everyday tiffin meals and a simpler food routine.',
    heading: 'Monthly Meal Subscription',
    intro: 'A practical monthly meal plan for students and working professionals who want a dependable everyday tiffin routine.',
    kind: 'product',
  },
  {
    path: '/veg-meal-subscription',
    title: 'Veg Meal Subscription | Bring My Bite',
    description: 'Discover the Veg Classic monthly meal option from Bring My Bite and make everyday homely meals easier to plan.',
    heading: 'Veg Meal Subscription',
    intro: 'Choose a vegetarian monthly meal routine designed around familiar, homely food and convenient delivery.',
    kind: 'product',
  },
  {
    path: '/egg-meal-subscription',
    title: 'Egg Meal Subscription | Bring My Bite',
    description: 'Discover the Egg Delight monthly meal option from Bring My Bite for convenient everyday tiffin meals.',
    heading: 'Egg Meal Subscription',
    intro: 'An egg-based monthly meal option for customers who want a convenient everyday tiffin routine.',
    kind: 'product',
  },
  {
    path: '/non-veg-meal-subscription',
    title: 'Non-Veg Meal Subscription | Bring My Bite',
    description: 'Discover the Non-Veg Club monthly meal option from Bring My Bite for convenient everyday meals.',
    heading: 'Non-Veg Meal Subscription',
    intro: 'A non-vegetarian monthly meal option built for a convenient everyday food routine.',
    kind: 'product',
  },
  {
    path: '/instant-thali',
    title: 'Instant Thali Order | Bring My Bite',
    description: 'Order a one-time Instant Thali from Bring My Bite when you need a convenient homely meal without a monthly commitment.',
    heading: 'Instant Thali Order',
    intro: 'Need a meal today without taking a monthly plan? Use the existing Instant Thali ordering flow for a one-time order.',
    kind: 'product',
  },
  {
    path: '/weekly-menu',
    title: 'Weekly Menu | Bring My Bite',
    description: 'See how the Bring My Bite weekly lunch and dinner menu is organised across Veg, Egg and Non-Veg meal options.',
    heading: 'Weekly Meal Menu',
    intro: 'Explore the weekly lunch and dinner menu structure and use the live menu in the main ordering experience.',
    kind: 'faq',
  },
  {
    path: '/how-it-works',
    title: 'How It Works | Bring My Bite Tiffin Service',
    description: 'Learn how Bring My Bite monthly meal subscriptions, weekly menus and one-time thali ordering work.',
    heading: 'How Bring My Bite Works',
    intro: 'From choosing a meal plan to receiving your food, the experience is designed to keep everyday meals simple.',
    kind: 'info',
  },
  {
    path: '/delivery-areas',
    title: 'Delivery & Service Information | Bring My Bite',
    description: 'Learn about Bring My Bite delivery to college and office gates and how to check service availability before ordering.',
    heading: 'Delivery & Service Information',
    intro: 'Bring My Bite is designed around convenient delivery to college and office gates. Check availability before placing an order.',
    kind: 'info',
  },
  {
    path: '/contact',
    title: 'Contact Bring My Bite | Shree Foods',
    description: 'Contact Bring My Bite for meal subscriptions, Instant Thali orders, menu questions and customer support.',
    heading: 'Contact Bring My Bite',
    intro: 'Have a question about meals, subscriptions, menus or an order? Use the existing contact and WhatsApp support options.',
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
