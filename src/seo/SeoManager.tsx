import { useEffect } from 'react';
import { canonicalUrl, getSeoRoute, isPublicSeoPath, SEO_ORIGIN } from './seoConfig';

const MANAGED = 'data-bringmybite-seo';

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"][${MANAGED}]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    element.setAttribute(MANAGED, 'true');
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][${MANAGED}]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    element.setAttribute(MANAGED, 'true');
    document.head.appendChild(element);
  }
  element.href = href;
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  const selector = `script[type="application/ld+json"][data-seo-id="${id}"]`;
  let element = document.head.querySelector<HTMLScriptElement>(selector);
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.dataset.seoId = id;
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  document.head.querySelector(`script[type="application/ld+json"][data-seo-id="${id}"]`)?.remove();
}

export function SeoManager() {
  useEffect(() => {
    const route = getSeoRoute(window.location.pathname);
    const publicPath = isPublicSeoPath(window.location.pathname);

    if (!route) {
      document.title = 'Bring My Bite';
      upsertMeta('name', 'robots', 'noindex,nofollow');
      removeJsonLd('product');
      removeJsonLd('faq');
      return;
    }

    const canonical = canonicalUrl(route.path);
    document.title = route.title;
    upsertMeta('name', 'description', route.description);
    upsertMeta('name', 'robots', publicPath ? 'index,follow,max-image-preview:large' : 'noindex,nofollow');
    upsertMeta('name', 'theme-color', '#0C3822');
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', route.title);
    upsertMeta('property', 'og:description', route.description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:site_name', 'Bring My Bite');
    upsertMeta('property', 'og:locale', 'en_IN');
    upsertMeta('name', 'twitter:card', 'summary');
    upsertMeta('name', 'twitter:title', route.title);
    upsertMeta('name', 'twitter:description', route.description);
    upsertLink('canonical', canonical);

    upsertJsonLd('organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Bring My Bite',
      alternateName: 'Shree Foods',
      url: SEO_ORIGIN,
      telephone: '+91 9315075165',
    });

    upsertJsonLd('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Bring My Bite',
      url: SEO_ORIGIN,
      description: route.description,
    });

    if (route.kind === 'product') {
      upsertJsonLd('product', {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: route.heading,
        description: route.intro,
        brand: { '@type': 'Brand', name: 'Bring My Bite' },
        url: canonical,
      });
    } else {
      removeJsonLd('product');
    }

    if (route.kind === 'faq') {
      upsertJsonLd('faq', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I choose a meal plan?',
            acceptedAnswer: { '@type': 'Answer', text: 'Review the available meal options and use the existing Subscribe Now flow on Bring My Bite to choose your plan.' },
          },
          {
            '@type': 'Question',
            name: 'Can I order a meal without a monthly subscription?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. Bring My Bite provides an Instant Thali flow for one-time orders.' },
          },
          {
            '@type': 'Question',
            name: 'Where can I get help with an order?',
            acceptedAnswer: { '@type': 'Answer', text: 'Use the existing customer support and WhatsApp contact options on Bring My Bite.' },
          },
        ],
      });
    } else {
      removeJsonLd('faq');
    }
  }, []);

  return null;
}
