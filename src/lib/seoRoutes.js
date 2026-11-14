/**
 * Canonical Route-Specific SEO Metadata & Schema.org JSON-LD Definitions
 * Shared between:
 * 1. Build-time HTML generation (scripts/build-spa.mjs) for initial crawler HTML responses
 * 2. Client-side React Router navigation (src/App.jsx) for dynamic head & page_view updates
 */

const BASE_ORGANIZATION_NODE = {
  '@type': 'Organization',
  '@id': 'https://www.contextmuse.com/#organization',
  name: 'Context & Muse',
  url: 'https://www.contextmuse.com/',
  logo: 'https://www.contextmuse.com/assets/images/contextmuse_logo.svg',
  description:
    'Context & Muse is founder-led by Jayme Volstad. Independent design and full-stack software studio building commercial websites, quote engines, operational software, and original digital products.',
  founder: {
    '@type': 'Person',
    name: 'Jayme Volstad',
    jobTitle: 'Systems Architect & Principal Designer',
    url: 'https://www.contextmuse.com/about/',
  },
  areaServed: [
    { '@type': 'City', name: 'Austin' },
    { '@type': 'State', name: 'Texas' },
    { '@type': 'Country', name: 'United States' },
  ],
  knowsAbout: [
    'Commercial Quoting Systems',
    'Lead Intake Engineering',
    'Custom Operations Software',
    'Conversion Diagnostics',
    'Design Systems Engineering',
  ],
};

const BASE_WEBSITE_NODE = {
  '@type': 'WebSite',
  '@id': 'https://www.contextmuse.com/#website',
  url: 'https://www.contextmuse.com/',
  name: 'Context & Muse',
  publisher: {
    '@id': 'https://www.contextmuse.com/#organization',
  },
};

export const SPA_ROUTE_SEO = {
  '/': {
    path: '/',
    outputFile: 'index.html',
    title: 'Context & Muse · Applied Systems, Quote Engines & Custom Software',
    description:
      'Context & Muse — Independent design and development by Jayme Volstad. Websites, visual identities, digital products, quote engines, and custom software.',
    canonical: 'https://www.contextmuse.com/',
    ogType: 'website',
    ogImage: 'https://www.contextmuse.com/og/context-muse-home-v3.jpg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [BASE_ORGANIZATION_NODE, BASE_WEBSITE_NODE],
    },
  },
  '/work/': {
    path: '/work/',
    outputFile: 'work/index.html',
    title: 'The Work · Client Builds, Products & Case Study Library | Context & Muse',
    description:
      'Production websites, quoting engines, operational software, and digital products designed and built end-to-end by Context & Muse.',
    canonical: 'https://www.contextmuse.com/work/',
    ogType: 'website',
    ogImage: 'https://www.contextmuse.com/og/context-muse-home-v3.jpg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        BASE_ORGANIZATION_NODE,
        BASE_WEBSITE_NODE,
        {
          '@type': 'CollectionPage',
          '@id': 'https://www.contextmuse.com/work/#webpage',
          url: 'https://www.contextmuse.com/work/',
          name: 'The Work · Client Builds, Products & Case Study Library | Context & Muse',
          description:
            'Production websites, quoting engines, operational software, and digital products designed and built end-to-end by Context & Muse.',
          isPartOf: { '@id': 'https://www.contextmuse.com/#website' },
        },
      ],
    },
  },
  '/build/': {
    path: '/build/',
    outputFile: 'build/index.html',
    title: 'Custom Builds · Scope a Website, Tool or Software Project | Context & Muse',
    description:
      'Start a project with Context & Muse. Describe what you want to create in plain language or sketch ideas on the optional interactive whiteboard.',
    canonical: 'https://www.contextmuse.com/build/',
    ogType: 'website',
    ogImage: 'https://www.contextmuse.com/og/context-muse-home-v3.jpg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        BASE_ORGANIZATION_NODE,
        BASE_WEBSITE_NODE,
        {
          '@type': 'Service',
          '@id': 'https://www.contextmuse.com/build/#service',
          url: 'https://www.contextmuse.com/build/',
          name: 'Custom Builds · Scope a Website, Tool or Software Project | Context & Muse',
          description:
            'Start a project with Context & Muse. Describe what you want to create in plain language or sketch ideas on the optional interactive whiteboard.',
          provider: { '@id': 'https://www.contextmuse.com/#organization' },
        },
      ],
    },
  },
  '/lab/': {
    path: '/lab/',
    outputFile: 'lab/index.html',
    title: 'The Lab · Original Products, Interactive Instruments & R&D | Context & Muse',
    description:
      'Original software products, interactive diagnostic utilities, and empirical design-systems research from Context & Muse.',
    canonical: 'https://www.contextmuse.com/lab/',
    ogType: 'website',
    ogImage: 'https://www.contextmuse.com/og/context-muse-home-v3.jpg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        BASE_ORGANIZATION_NODE,
        BASE_WEBSITE_NODE,
        {
          '@type': 'CollectionPage',
          '@id': 'https://www.contextmuse.com/lab/#webpage',
          url: 'https://www.contextmuse.com/lab/',
          name: 'The Lab · Original Products, Interactive Instruments & R&D | Context & Muse',
          description:
            'Original software products, interactive diagnostic utilities, and empirical design-systems research from Context & Muse.',
          isPartOf: { '@id': 'https://www.contextmuse.com/#website' },
        },
      ],
    },
  },
  '/lab/design-intelligence/': {
    path: '/lab/design-intelligence/',
    outputFile: 'lab/design-intelligence/index.html',
    title: 'Design Intelligence · From Visual Reference to Measurable Design Decisions | Context & Muse',
    description:
      'Design is not a collection of preferences. It is a system of relationships. CSSOM and DOM token extraction across Plaidis / Locomotive, Linear, and Stripe on an 85-node specimen.',
    canonical: 'https://www.contextmuse.com/lab/design-intelligence/',
    ogType: 'article',
    ogImage: 'https://www.contextmuse.com/assets/images/design-intelligence/study_plaidis_overview_1440.png',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        BASE_ORGANIZATION_NODE,
        BASE_WEBSITE_NODE,
        {
          '@type': 'TechArticle',
          '@id': 'https://www.contextmuse.com/lab/design-intelligence/#article',
          url: 'https://www.contextmuse.com/lab/design-intelligence/',
          headline:
            'Design Intelligence: From Visual Reference to Measurable Design Decisions',
          description:
            'Empirical design engineering case study measuring Plaidis / Locomotive, Linear, and Stripe using CSSOM and DOM inspection, an 85-node controlled specimen, and Context & Muse production transfer.',
          author: {
            '@type': 'Person',
            name: 'Jayme Volstad',
            url: 'https://www.contextmuse.com/about/',
          },
          publisher: { '@id': 'https://www.contextmuse.com/#organization' },
          isPartOf: { '@id': 'https://www.contextmuse.com/#website' },
        },
      ],
    },
  },
  '/design-intelligence/': {
    path: '/design-intelligence/',
    outputFile: 'design-intelligence/index.html',
    title: 'Design Intelligence · From Visual Reference to Measurable Design Decisions | Context & Muse',
    description:
      'Design is not a collection of preferences. It is a system of relationships. CSSOM and DOM token extraction across Plaidis / Locomotive, Linear, and Stripe on an 85-node specimen.',
    canonical: 'https://www.contextmuse.com/lab/design-intelligence/',
    ogType: 'article',
    ogImage: 'https://www.contextmuse.com/assets/images/design-intelligence/study_plaidis_overview_1440.png',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        BASE_ORGANIZATION_NODE,
        BASE_WEBSITE_NODE,
        {
          '@type': 'TechArticle',
          '@id': 'https://www.contextmuse.com/lab/design-intelligence/#article',
          url: 'https://www.contextmuse.com/lab/design-intelligence/',
          headline:
            'Design Intelligence: From Visual Reference to Measurable Design Decisions',
          description:
            'Empirical design engineering case study measuring Plaidis / Locomotive, Linear, and Stripe using CSSOM and DOM inspection, an 85-node controlled specimen, and Context & Muse production transfer.',
          author: {
            '@type': 'Person',
            name: 'Jayme Volstad',
            url: 'https://www.contextmuse.com/about/',
          },
          publisher: { '@id': 'https://www.contextmuse.com/#organization' },
          isPartOf: { '@id': 'https://www.contextmuse.com/#website' },
        },
      ],
    },
  },
  '/method/': {
    path: '/method/',
    outputFile: 'method/index.html',
    title: 'The Method · Process, Capabilities & Transparent Pricing | Context & Muse',
    description:
      'How Context & Muse takes a project from operational diagnosis through visual design, full-stack engineering, and launch—with clear scope and pricing.',
    canonical: 'https://www.contextmuse.com/method/',
    ogType: 'website',
    ogImage: 'https://www.contextmuse.com/og/context-muse-home-v3.jpg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        BASE_ORGANIZATION_NODE,
        BASE_WEBSITE_NODE,
        {
          '@type': 'ProfessionalService',
          '@id': 'https://www.contextmuse.com/method/#service',
          url: 'https://www.contextmuse.com/method/',
          name: 'The Method · Process, Capabilities & Transparent Pricing | Context & Muse',
          description:
            'How Context & Muse takes a project from operational diagnosis through visual design, full-stack engineering, and launch—with clear scope and pricing.',
          provider: { '@id': 'https://www.contextmuse.com/#organization' },
        },
      ],
    },
  },
};

export function normalizeSpaPath(rawPathname) {
  if (!rawPathname || rawPathname === '/') return '/';
  const clean = String(rawPathname).split('?')[0].split('#')[0].trim().replace(/\/+$/, '');
  if (!clean) return '/';
  if (clean === '/index') return '/work/';
  if (clean === '/design-intelligence') return '/lab/design-intelligence/';
  return `${clean}/`;
}

export function getRouteSeo(rawPathname) {
  const key = normalizeSpaPath(rawPathname);
  return SPA_ROUTE_SEO[key] || SPA_ROUTE_SEO['/'];
}
