import React from 'react';
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSeoRoute, PUBLIC_SEO_ROUTES } from '../../seo/seoConfig';

type PageProps = { path: string };

const sections: Record<string, { title: string; bullets: string[] }> = {
  '/monthly-meal-subscription': {
    title: 'Why use a monthly meal plan?',
    bullets: ['Plan your everyday meals in advance.', 'Choose the meal category that fits your routine.', 'Use the same Bring My Bite experience for menu information and customer support.', 'Check the live pricing and subscription flow before confirming your plan.'],
  },
  '/veg-meal-subscription': {
    title: 'Veg Classic for an everyday routine',
    bullets: ['Vegetarian meal option for regular tiffin needs.', 'Built around a simple monthly subscription experience.', 'Review the live menu and current price before subscribing.', 'Suitable for customers who prefer a vegetarian meal routine.'],
  },
  '/egg-meal-subscription': {
    title: 'Egg Delight for everyday meals',
    bullets: ['Egg-based option within the monthly meal plans.', 'Designed for a convenient regular tiffin routine.', 'Check the live weekly menu before choosing your meals.', 'Use the existing subscription flow to register.'],
  },
  '/non-veg-meal-subscription': {
    title: 'Non-Veg Club monthly meals',
    bullets: ['Non-vegetarian option within the monthly plans.', 'Designed for customers looking for a regular meal routine.', 'Review the live menu and current pricing before ordering.', 'Use the existing subscription flow for registration.'],
  },
  '/instant-thali': {
    title: 'A one-time meal when you need it',
    bullets: ['No monthly commitment is required for an Instant Thali order.', 'Use the existing Instant Thali button to start an order.', 'Review the current live price before confirming.', 'Customer support remains available through the existing contact options.'],
  },
  '/weekly-menu': {
    title: 'A simple weekly lunch and dinner structure',
    bullets: ['Weekly menu information is available inside the main Bring My Bite experience.', 'Lunch and dinner are organised across the available meal categories.', 'The menu can be updated centrally through the existing CMS.', 'Always use the live menu for the latest dishes.'],
  },
  '/how-it-works': {
    title: 'From plan selection to delivery',
    bullets: ['Choose between a monthly subscription and a one-time Instant Thali.', 'Review the current menu and live pricing.', 'Complete the existing registration or order flow.', 'Use customer support if you need help with your order.'],
  },
  '/delivery-areas': {
    title: 'Convenient delivery to college and office gates',
    bullets: ['The service is designed around delivery to college and office gates.', 'Availability can depend on the service area and operational coverage.', 'Check availability before placing an order.', 'Use the contact options if you need confirmation for your location.'],
  },
  '/contact': {
    title: 'Questions about meals or orders?',
    bullets: ['Ask about monthly meal subscriptions.', 'Get help with an Instant Thali order.', 'Ask about the weekly menu and current options.', 'Use WhatsApp support for customer assistance.'],
  },
};

export const PublicSeoPage: React.FC<PageProps> = ({ path }) => {
  const { setIsRegistrationOpen, setIsInstantOrderOpen, setIsWeeklyMenuOpen } = useApp();
  const route = getSeoRoute(path);
  if (!route || route.path === '/') return null;
  const section = sections[route.path] || sections['/how-it-works'];
  const related = PUBLIC_SEO_ROUTES.filter((item) => item.path !== '/' && item.path !== route.path).slice(0, 4);

  return <main className="flex-1 bg-[#FAF7F2] text-[#1A261E]">
    <section className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-extrabold tracking-[0.18em] uppercase text-[#8C5E13] mb-4">Bring My Bite · Shree Foods</p>
        <h1 className="font-serif text-4xl sm:text-6xl leading-tight font-bold text-[#124E33]">{route.heading}</h1>
        <p className="mt-6 text-lg sm:text-xl leading-8 text-[#465249]">{route.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => setIsRegistrationOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#124E33] px-5 py-3 text-sm font-bold text-white">Subscribe Monthly <ArrowRight className="w-4 h-4" /></button>
          <button onClick={() => setIsInstantOrderOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-[#C88A24] bg-[#FDF7E7] px-5 py-3 text-sm font-bold text-[#8C5E13]">Order Instant Thali</button>
          <button onClick={() => setIsWeeklyMenuOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-[#D9D0C3] bg-white px-5 py-3 text-sm font-bold text-[#124E33]">View Weekly Menu</button>
        </div>
      </div>
    </section>

    <section className="border-y border-[#E8E1D5] bg-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#124E33]">{section.title}</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-7">
          {section.bullets.map((bullet) => <div key={bullet} className="rounded-2xl border border-[#E8E1D5] bg-[#FFFCF8] p-5 flex gap-3"><CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-[#124E33]" /><p className="text-sm sm:text-base leading-7 text-[#465249]">{bullet}</p></div>)}
        </div>
      </div>
    </section>

    <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <h2 className="font-serif text-3xl font-bold text-[#124E33]">Explore Bring My Bite</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
        {related.map((item) => <a key={item.path} href={item.path} className="rounded-2xl border border-[#E8E1D5] bg-white p-5 hover:shadow-md transition-shadow"><p className="font-bold text-[#124E33]">{item.heading}</p><p className="mt-2 text-xs leading-5 text-[#667067]">{item.description}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#8C5E13]">Learn more <ArrowRight className="w-3.5 h-3.5" /></span></a>)}
      </div>
    </section>

    <section className="bg-[#124E33] text-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div><h2 className="font-serif text-2xl font-bold">Need help before ordering?</h2><p className="mt-1 text-sm text-white/80">Bring My Bite customer support can help with meal and order questions.</p></div>
        <a href="https://wa.me/919315075165" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#124E33]"><MessageCircle className="w-4 h-4" /> WhatsApp Support</a>
      </div>
    </section>
  </main>;
};
