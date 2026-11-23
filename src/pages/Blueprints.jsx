import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Layers,
  Compass,
  Sparkles,
  Wrench,
  FileText,
  Megaphone,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import PageAnnotationOverlay from '@/components/site/PageAnnotationOverlay';

const NICHE_SHOWCASE = [
  {
    id: 'author',
    num: '01',
    tabLabel: '01 // Author & Book Launch',
    badge: 'PRESET 01 // FIELD MANUAL PALETTE',
    badgeBg: '#E34232',
    badgeFg: '#F0E8D9',
    title: 'Author, Monograph & Book Launch System',
    description:
      'Built for novelists, essayists, academic researchers, and independent presses launching a flagship book, serialized work, or literary archive without monthly platform rent.',
    image: '/assets/captures/blueprints/showcase-cover.png',
    imageAlt: 'Literary Brutalism Author and Book Launch Website Template Preview',
    specUrl: 'https://blueprints.contextmuse.com/author-website-template',
    specLabel: 'Inspect Author Template Specs',
    swatches: [
      { hex: '#141414', name: 'Ink' },
      { hex: '#F0E8D9', name: 'Bone' },
      { hex: '#E3DAC9', name: 'Paper' },
      { hex: '#E34232', name: 'Scarlet' },
      { hex: '#E5E750', name: 'Acid' },
    ],
    highlights: [
      'Chapter Excerpt Reader: Long-form editorial typography paired with a built-in audiobook sample player.',
      '3-Tier Edition Cards: Sell Hardcover, Signed Collector Dossier, or Digital EPUB directly via Stripe.',
      'Press & Media Kit: High-res author portraits, jacket downloads, review blurbs, and event ledger.',
    ],
  },
  {
    id: 'musician',
    num: '02',
    tabLabel: '02 // Musician & Album EPK',
    badge: 'PRESET 02 // NIGHT INK PALETTE',
    badgeBg: '#E5E750',
    badgeFg: '#141414',
    title: 'Musician, Band & Album Release EPK',
    description:
      'A high-contrast Electronic Press Kit (EPK) and direct-to-fan vinyl/merch storefront for recording artists, tour managers, and independent record labels.',
    image: '/assets/captures/blueprints/showcase-pages.png',
    imageAlt: 'Literary Brutalism Musician Album EPK Website Template Preview',
    specUrl: 'https://blueprints.contextmuse.com/musician-epk-template',
    specLabel: 'Inspect Musician EPK Specs',
    swatches: [
      { hex: '#0E1013', name: 'Night Ink' },
      { hex: '#ECE7DC', name: 'Chalk' },
      { hex: '#1B1F26', name: 'Slate' },
      { hex: '#FF5A36', name: 'Signal Orange' },
      { hex: '#D9FF43', name: 'Acid Lime' },
    ],
    highlights: [
      'Built-In Single Audio Bar: Drop in any MP3 or WAV track for instant browser playback with interactive seek bar.',
      '1-Click Booking & EPK Downloads: Stage plot PDF, 300-DPI press photos, tech rider, and promoter contact.',
      'Direct-to-Fan Vinyl & Merch: 3 physical/digital release tiers wired for Stripe Payment Links with 0% platform cut.',
    ],
  },
  {
    id: 'podcast',
    num: '03',
    tabLabel: '03 // Podcast & Audio Show',
    badge: 'PRESET 03 // OXIDE RED PALETTE',
    badgeBg: '#C83422',
    badgeFg: '#F7EFE4',
    title: 'Narrative Podcast & Investigative Show Archive',
    description:
      'An archival editorial home for narrative podcasts, investigative journalism series, and interview shows that outgrow generic link-in-bio pages.',
    image: '/assets/captures/blueprints/showcase-studio.png',
    imageAlt: 'Literary Brutalism Podcast and Audio Show Website Template Preview',
    specUrl: 'https://blueprints.contextmuse.com/podcast-website-template',
    specLabel: 'Inspect Podcast Template Specs',
    swatches: [
      { hex: '#1D1311', name: 'Espresso' },
      { hex: '#F7EFE4', name: 'Cream' },
      { hex: '#EADBC8', name: 'Sand' },
      { hex: '#C83422', name: 'Oxide Red' },
      { hex: '#F3C846', name: 'Amber' },
    ],
    highlights: [
      'Filterable Episode Logbook: Tag and filter episodes by season, theme, or format with instant client-side search.',
      'Full Transcript & Show Notes Page: Structured editorial layout that captures long-tail organic search traffic.',
      'Listener Memberships & Sponsor Kit: Dedicated media kit downloads and direct listener support tiers.',
    ],
  },
  {
    id: 'studio',
    num: '04',
    tabLabel: '04 // Design Studio & Agency',
    badge: 'PRESET 04 // ARCHIVE OLIVE PALETTE',
    badgeBg: '#CDD942',
    badgeFg: '#171A14',
    title: 'Independent Design Studio & Creative Practice',
    description:
      'For independent design studios, architectural practices, and creative directors—with an optional $199 Agency Unlimited license for shipping white-label client websites.',
    image: '/assets/captures/blueprints/showcase-tokens.png',
    imageAlt: 'Literary Brutalism Design Studio and Agency Website Template Preview',
    specUrl: 'https://blueprints.contextmuse.com/brutalist-agency-template',
    specLabel: 'Inspect Agency License Specs',
    swatches: [
      { hex: '#171A14', name: 'Deep Olive' },
      { hex: '#EFECE1', name: 'Warm Bone' },
      { hex: '#DFE2CE', name: 'Sage Paper' },
      { hex: '#D94E28', name: 'Vermilion' },
      { hex: '#CDD942', name: 'Chartreuse' },
    ],
    highlights: [
      'Case File Dossiers: Present client work, design principles, and capabilities with print-grade editorial rigor.',
      'Productized Service Tiers: Fixed-fee sprint, design system, and retainer cards ready for direct Stripe checkout.',
      '15-Minute Client Handoffs: Customize in the browser Studio, click Export .ZIP, and deploy to Vercel or Netlify.',
    ],
  },
  {
    id: 'figma',
    num: '05',
    tabLabel: '05 // 5-Board Figma & 23 SVGs',
    badge: 'SYSTEM ASSETS // 1440PX FIGMA + RAW SVGS',
    badgeBg: '#123F38',
    badgeFg: '#E5E750',
    title: '5-Board 1440px Figma Master Kit & 23 Vector SVGs',
    description:
      'Every $89 Complete Kit and $199 Agency package includes all 5 consolidated 1440px Figma Design System boards plus the standalone library of 23 CSS-tokenized vector illustrations.',
    image: '/assets/captures/blueprints/showcase-vectors.png',
    imageAlt: '5-Board Figma Design System and 23 Tokenized Vector SVGs Preview',
    specUrl: 'https://blueprints.contextmuse.com/brutalist-figma-svg-kit',
    specLabel: 'Inspect Figma & SVG Kit Specs',
    swatches: [
      { hex: '#141414', name: '--ink' },
      { hex: '#F0E8D9', name: '--bone' },
      { hex: '#E34232', name: '--scarlet' },
      { hex: '#E5E750', name: '--acid' },
      { hex: '#8DB8C2', name: '--blue' },
    ],
    highlights: [
      '5 Consolidated 1440px Figma Boards: Foundations, Desktop Home, 6 Inner Pages, Niche Variations, and Vector Specimen Sheet.',
      '23 Raw Tokenized .SVG Files: Botanical studies, architectural diagrams, tarot/emblem cards, and brutalist stamps.',
      'Zero-Lock-In Vector Architecture: Drag the local SVG master sheets into any Figma file or duplicate from the master link.',
    ],
  },
];

const ANATOMY_PLATES = [
  {
    id: 'studio-hud',
    label: '01 / In-Browser Visual Studio HUD',
    meta: 'Zero-Install Live Editor · Export Static .ZIP',
    src: '/assets/captures/blueprints/tab-studio-hud.png',
    caption:
      'Edit every headline, switch between 5 niche presets and 4 color palettes, manage 7 pages, and export a production-ready static .ZIP directly in your browser.',
  },
  {
    id: 'svg-library',
    label: '02 / 23-SVG Tokenized Graphic Library',
    meta: 'Standalone Vector Catalog · CSS Variable Bound',
    src: '/assets/captures/blueprints/tab-svg-library.png',
    caption:
      'Every illustration inherits --ink, --bone, --scarlet, --acid, and --blue automatically—re-coloring across all 4 studio palettes with zero manual re-exporting.',
  },
  {
    id: 'figma-board',
    label: '03 / 5-Board 1440px Figma Design System',
    meta: 'Editable Figma Layers · Desktop & 390px Mobile',
    src: '/assets/captures/blueprints/tab-figma-board.png',
    caption:
      'Includes Foundations & Token Swatches, Full Desktop Landing, 6 Inner Page Templates, Niche Variations, and the 23-Illustration Specimen Sheet.',
  },
  {
    id: 'inner-pages',
    label: '04 / 7 Multi-Page Editorial Layouts',
    meta: 'Home · About · Excerpt/Audio · Press · Products · Journal · Contact',
    src: '/assets/captures/blueprints/tab-journal.png',
    caption:
      'Seven interconnected page templates built with print-inspired grids, accessible keyboard navigation, and zero external framework dependencies.',
  },
];

const STRIPE_TIERS = [
  {
    id: 'tier-1',
    code: 'TIER 01 // STANDARD LICENSE',
    name: 'Literary Brutalism — Standard Studio',
    price: '$49',
    cadence: 'One-time payment · Perpetual license (1 brand)',
    stripeUrl: 'https://buy.stripe.com/aFafZg3VjbKqbwz5pHebu00',
    specUrl: 'https://blueprints.contextmuse.com/literarybrutalism',
    image: '/assets/captures/blueprints/Literary_Brutalism_49_Tier1_Standard_Studio.png',
    featured: false,
    accentBg: '#FAF8F3',
    accentFg: '#141414',
    shadowColor: '#141414',
    description:
      'For an individual author, musician, podcaster, or creator launching one flagship website with full browser Studio customization.',
    includes: [
      'Online Browser Studio unlock + offline Studio HTML file',
      'All 5 Niche Presets (Author, Musician EPK, Podcast, Studio, Storefront)',
      'All 7 multi-page layouts & 4 instant color token palettes',
      '23 embedded vector SVG illustrations + 1-click static .ZIP exporter',
    ],
  },
  {
    id: 'tier-2',
    code: 'TIER 02 // COMPLETE KIT ★ MOST POPULAR',
    name: 'Studio + 5-Board Figma & SVG Bundle',
    price: '$89',
    cadence: 'One-time payment · Perpetual license (Up to 2 brands)',
    stripeUrl: 'https://buy.stripe.com/5kQ5kC4Zn9CifMP19rebu01',
    specUrl: 'https://blueprints.contextmuse.com/brutalist-figma-svg-kit',
    image: '/assets/captures/blueprints/Literary_Brutalism_89_Tier2_Complete_Figma_Bundle.png',
    featured: true,
    accentBg: '#141414',
    accentFg: '#F0E8D9',
    shadowColor: '#E34232',
    description:
      'The complete design + code system: includes the Browser Studio plus the standalone 23-SVG graphic library and all 5 editable 1440px Figma boards.',
    includes: [
      'Everything in Tier 01 Standard Studio License (for up to 2 brands)',
      '5-Board 1440px Figma Master Design System (Foundations, Pages, Niches, Vectors)',
      'Standalone 23 raw .SVG vector files + searchable Graphic Library catalog',
      'Instant Permanent License Key for cache-proof Online Studio & .ZIP access',
    ],
  },
  {
    id: 'tier-3',
    code: 'TIER 03 // COMMERCIAL AGENCY LICENSE',
    name: 'Agency Unlimited + Modular Source',
    price: '$199',
    cadence: 'One-time payment · Unlimited client builds & handoffs',
    stripeUrl: 'https://buy.stripe.com/9B628qezXdSy7gjg4lebu02',
    specUrl: 'https://blueprints.contextmuse.com/brutalist-agency-template',
    image: '/assets/captures/blueprints/Literary_Brutalism_199_Tier3_Agency_Unlimited.png',
    featured: false,
    accentBg: '#E3DAC9',
    accentFg: '#141414',
    shadowColor: '#123F38',
    description:
      'For design studios, freelancers, and agencies building and handing off unlimited commercial websites to paying clients.',
    includes: [
      'Everything in Tier 02 Complete Studio + 5-Board Figma & 23-SVG Bundle',
      'Unlimited commercial client projects & white-label static .ZIP handoff rights',
      'Complete modular source code (src/) + zero-dependency Node.js compiler (build.js)',
      'Custom preset compilation rights for internal agency workflows',
    ],
  },
];

const CREATIVE_UTILITIES_AND_PACKS = [
  {
    id: 'util-docs',
    code: 'UTIL-01 // BUSINESS DOCUMENT DOSSIER',
    status: '● INSTANT DOWNLOAD',
    title: 'Branded Business Document & SOW Dossier Set',
    price: '$79',
    unit: 'Complete Document Kit',
    stripeUrl: 'https://buy.stripe.com/fZudR8bnLbKqfMPbO5ebu0a',
    ctaLabel: 'Buy Document Set ($79)',
    image: '/assets/captures/blueprints/Blueprint_79_Branded_Business_Document_Set.png',
    description:
      'Archival-grade business document templates that protect your scope and elevate client trust: Client Proposal & Pitch Dossier, Scope-Locked Statement of Work (SOW), Technical Discovery Intake Brief, Invoice Ledger, and Handoff Manual.',
    chips: ['Proposals & SOW', 'Discovery Intake Matrix', 'Client Handoff Manual'],
    icon: FileText,
    theme: 'bone',
  },
  {
    id: 'util-ads',
    code: 'UTIL-02 // MULTI-CHANNEL CAMPAIGN KIT',
    status: '● 25 CUSTOM ASSETS',
    title: '25-Asset Social Media & Multi-Channel Ad Pack',
    price: '$149',
    unit: '25-Asset Custom Pack',
    stripeUrl: 'https://buy.stripe.com/3cI14mdvT15Mbwz3hzebu0b',
    ctaLabel: 'Order 25-Asset Ad Pack ($149)',
    image: '/assets/captures/blueprints/Blueprint_149_25Asset_Social_Ad_Pack.png',
    description:
      'A complete 25-asset campaign tailored to your website and offer: 7 vertical Pinterest Pins (1000×1500), 4 Meta/IG 1:1 Ads (1080×1080), 5 4:3 Showcase Boards (1600×1200), 1 LinkedIn Ad, 1 9:16 TikTok/Reel Video (.MP4), and UTM Copy Guide.',
    chips: ['7 Pinterest Pins', '4 Meta + 1 LinkedIn Ad', '9:16 TikTok MP4 + UTM Copy'],
    icon: Megaphone,
    theme: 'ink',
  },
  {
    id: 'prompt-01',
    code: 'PROMPT-01 // 12-STAGE COGNITIVE WORKFLOW',
    status: '● INSTANT DOWNLOAD',
    title: 'Audit-to-Action SEO & Conversion Prompt Pack',
    price: '$39',
    unit: 'Instant Prompt Dossier',
    stripeUrl: 'https://buy.stripe.com/eVq14mezXeWCbwzg4lebu0c',
    ctaLabel: 'Buy Prompt Pack ($39)',
    image: '/assets/captures/blueprints/Blueprint_39_Audit_To_Action_Prompt_Pack.png',
    description:
      'The exact 12-stage engineered prompt system by Context & Muse to turn any website audit into high-converting landing page copy, 5 hub-and-spoke SEO spoke pages, JSON-LD rich schema, and anti-cliché brand positioning.',
    chips: ['12-Stage Prompt Chain', 'SEO Spoke Generator', 'Editorial Voice Calibration'],
    icon: Cpu,
    theme: 'bone',
  },
];

const AUDIT_REMEDIATION_SPRINTS = [
  {
    id: 'fix-seo',
    layer: 'AUDIT LAYER 05 // SEARCH & SCHEMA FIX',
    badge: '● 1-CLICK ORDER',
    title: 'Optimize My SEO & Rich Schema Fix Pack',
    price: '$149',
    unit: 'Fixed Turnkey Fix',
    stripeUrl: 'https://buy.stripe.com/4gMbJ077v5m2bwz05nebu08',
    ctaLabel: 'Optimize My SEO ($149)',
    image: '/assets/captures/blueprints/Blueprint_149_Optimize_My_SEO.png',
    description:
      'Fixes missing or weak page titles, meta descriptions, canonical URLs, XML sitemap, robots.txt, 1200×630 Open Graph share card, and injects custom JSON-LD structured data (LocalBusiness, Product, FAQPage).',
    chips: ['JSON-LD Rich Snippets', 'Title & Meta Hierarchy', 'Sitemap + OG Share Card'],
  },
  {
    id: 'fix-ux',
    layer: 'AUDIT LAYERS 01–03 // CONVERSION & UX SPRINT',
    badge: '● 48–72H TURNAROUND',
    title: 'Web Refinement & Conversion Quick-Win Sprint',
    price: '$295',
    unit: 'Fixed Sprint',
    stripeUrl: 'https://buy.stripe.com/8x2bJ077v01I9org4lebu09',
    ctaLabel: 'Refine My Website ($295)',
    image: '/assets/captures/blueprints/Blueprint_295_Web_Refinement_Sprint.png',
    description:
      'Don’t need a full rebuild? We sharpen your existing website’s above-the-fold headline & positioning, install a high-visibility sticky mobile Call/Quote bar, fix mobile tap targets & layout shifts, and streamline your contact form.',
    chips: ['Headline & CTA Rewrite', 'Sticky Mobile Action Bar', 'Mobile Tap-Target Fix'],
    featured: true,
  },
  {
    id: 'fix-diagnostic',
    layer: 'AUDIT LAYERS 02 & 04 // FULL TEARDOWN + REDESIGN',
    badge: '● 100% CREDITED TO BUILD',
    title: 'Business System Diagnostic & Web Redesign Deposit',
    price: '$395',
    unit: 'Credited to Redesign',
    stripeUrl: 'https://buy.stripe.com/9B69AScrP7ua1VZ4lDebu0d',
    ctaLabel: 'Book Diagnostic ($395)',
    image: '/assets/captures/blueprints/Blueprint_395_Diagnostic_Web_Redesign_Deposit.png',
    description:
      'Direct human teardown of your website, quote flow, and operational bottlenecks by Jayme Volstad + prioritized P0/P1/P2 Remediation Matrix & custom Web Redesign roadmap. 100% credited ($395) toward a $2,500+ Custom Build.',
    chips: ['Human Teardown by Jayme', '100% Custom Build Credit', 'Includes $79 Doc Set Free'],
  },
];

export default function Blueprints() {
  const [activeNicheId, setActiveNicheId] = useState('author');
  const [activePlateId, setActivePlateId] = useState('studio-hud');

  const activeNiche =
    NICHE_SHOWCASE.find((n) => n.id === activeNicheId) || NICHE_SHOWCASE[0];
  const activePlate =
    ANATOMY_PLATES.find((p) => p.id === activePlateId) || ANATOMY_PLATES[0];

  const scrollToSection = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#F2ECE1] text-[#141817] font-sans selection:bg-[#E5E750] selection:text-[#141817]"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(18,63,56,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(18,63,56,0.055) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* Shared Studio Header (Logo, The Method link, Mark up this page, Four Rooms Switcher, My Ideas) */}
      <SiteHeader />

      {/* 4-Tone Expressive Showroom Accent Bar */}
      <div className="flex h-1.5 w-full shrink-0" aria-hidden="true">
        <span className="flex-1 bg-[#E5E750]" />
        <span className="flex-1 bg-[#E34232]" />
        <span className="flex-1 bg-[#123F38]" />
        <span className="flex-1 bg-[#D9A62E]" />
      </div>

      {/* Showroom Wayfinding Sub-Bar: Bridges Main Architectural Studio & Expressive Storefront */}
      <div className="border-b-[3px] border-[#141817] bg-[#123F38] text-[#F2ECE1] px-4 py-2.5 sm:px-8">
        <div className="mx-auto max-w-[1380px] flex flex-wrap items-center justify-between gap-3 font-mono text-[11px]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              to="/"
              data-testid="blueprints-back-to-studio"
              className="inline-flex items-center gap-1.5 bg-[#141817] text-[#E5E750] border border-[#E5E750]/40 px-2.5 py-1 font-bold uppercase tracking-wider hover:bg-[#E5E750] hover:text-[#141817] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Main Studio</span>
            </Link>
            <span className="font-bold uppercase tracking-wider text-[#E5E750]">
              02 / BLUEPRINTS SHOWROOM
            </span>
            <span className="hidden lg:inline text-[#F2ECE1]/45">•</span>
            <nav
              aria-label="Showroom departments"
              className="hidden md:flex items-center gap-3 text-[#F2ECE1]/90"
            >
              <button
                type="button"
                onClick={() => scrollToSection('#dept-studios')}
                className="hover:text-[#E5E750] underline underline-offset-4 cursor-pointer"
              >
                01. Website Studios &amp; Figma
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('#dept-utilities')}
                className="hover:text-[#E5E750] underline underline-offset-4 cursor-pointer"
              >
                02. Document Sets, Ads &amp; Prompts
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('#dept-remediations')}
                className="hover:text-[#E5E750] underline underline-offset-4 cursor-pointer"
              >
                03. 1-Click Audit Fixes
              </button>
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/build"
              className="text-[#F2ECE1]/90 hover:text-[#E5E750] underline underline-offset-4 transition-colors font-bold"
            >
              Commission a Custom Build →
            </Link>
            <a
              href="https://blueprints.contextmuse.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-[#E5E750] text-[#141817] border border-[#141817] px-2.5 py-1 font-bold uppercase tracking-wider shadow-[2px_2px_0_#141817] hover:bg-[#FAF8F3] transition-colors"
            >
              <KeyRound className="h-3 w-3" />
              <span>Restore Purchase</span>
            </a>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* =================================================================
            SECTION 01: EXPRESSIVE EDITORIAL SHOWROOM HERO
           ================================================================= */}
        <section className="border-b-[3px] border-[#141817] bg-gradient-to-b from-[#123F38]/5 to-[#E6DEC8]/45 px-4 py-10 sm:px-8 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-[1380px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left 7 Columns: Bold Editorial Typography & Studio vs. Showroom Distinction */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider">
                <span className="bg-[#123F38] text-[#F2ECE1] border-2 border-[#141817] px-3 py-1 font-bold shadow-[4px_4px_0_#D9A62E]">
                  CONTEXT &amp; MUSE // 02 BLUEPRINTS
                </span>
                <span className="border-2 border-[#141817] bg-[#E5E750] text-[#141817] px-3 py-1 font-bold shadow-[3px_3px_0_#141817]">
                  9 PUBLISHED PRODUCTS LIVE
                </span>
              </div>

              <h1 className="font-display text-[clamp(2.35rem,5.4vw,4.95rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-[#141817]">
                <span className="block">READY-MADE WEBSITES,</span>
                <span className="inline-block bg-[#D9A62E] text-[#141817] px-3 py-0.5 border-[3px] border-[#141817] shadow-[5px_5px_0_#123F38] mt-1.5">
                  CREATIVE TOOLS
                </span>
                <span className="block font-serif italic font-normal text-[#123F38] tracking-normal text-[0.9em] mt-2">
                  &amp; reusable systems you own outright.
                </span>
              </h1>

              <p className="font-sans text-base sm:text-lg text-[#232B28] max-w-2xl leading-relaxed">
                The product showroom of Context &amp; Muse. Self-contained browser Website Studios with 5-board Figma systems, archival Business Document Dossiers, 25-Asset Multi-Channel Ad Packs, Engineered Prompt Systems, and 1-Click Audit Remediations.
              </p>

              {/* Explicit Customer Journey Distinction: 02 Blueprints vs. 01 Custom Build */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="border-[2.5px] border-[#141817] bg-[#FAF8F3] p-4 shadow-[5px_5px_0_#123F38]">
                  <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#123F38] flex items-center justify-between">
                    <span>02 / BLUEPRINTS (SHOWROOM)</span>
                    <span className="bg-[#E5E750] text-[#141817] px-1.5 py-0.5 text-[9.5px] border border-[#141817]">
                      $39–$395
                    </span>
                  </div>
                  <p className="mt-1.5 font-sans text-xs text-[#141817]/85 leading-snug">
                    <strong>Purchase an existing product:</strong> Instant Stripe checkout, no sales calls, no recurring monthly subscriptions, and immediate access.
                  </p>
                </div>

                <Link
                  to="/build"
                  data-testid="showroom-to-custom-build"
                  className="group border-[2.5px] border-[#141817] bg-[#E6DEC8] p-4 shadow-[5px_5px_0_#141817] hover:bg-[#141817] hover:text-[#F2ECE1] transition-colors"
                >
                  <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#E34232] group-hover:text-[#E5E750] flex items-center justify-between">
                    <span>01 / CUSTOM BUILD (STUDIO)</span>
                    <span>COMMISSION →</span>
                  </div>
                  <p className="mt-1.5 font-sans text-xs text-[#141817]/85 group-hover:text-[#F2ECE1]/90 leading-snug">
                    <strong>Commission a tailored solution:</strong> Have a custom website, quoting engine, or internal software application built specifically for your operation.
                  </p>
                </Link>
              </div>

              {/* Department Jump Pills */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => scrollToSection('#dept-studios')}
                  className="min-h-[46px] inline-flex items-center gap-2 border-[2.5px] border-[#141817] bg-[#123F38] text-[#FFFFFF] px-5 py-2.5 font-bold uppercase tracking-wider shadow-[5px_5px_0_#141817] hover:bg-[#E34232] transition-all cursor-pointer"
                >
                  <span>01 / Website Studios &amp; Figma ($49–$199)</span>
                  <span>↘</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('#dept-utilities')}
                  className="min-h-[46px] inline-flex items-center gap-2 border-[2.5px] border-[#141817] bg-[#FAF8F3] text-[#141817] px-4 py-2.5 font-bold uppercase tracking-wider shadow-[4px_4px_0_#141817] hover:bg-[#D9A62E] transition-colors cursor-pointer"
                >
                  <span>02 / Docs, Ads &amp; Prompts ($39–$149)</span>
                  <span>↘</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('#dept-remediations')}
                  className="min-h-[46px] inline-flex items-center gap-2 border-[2.5px] border-[#141817] bg-[#FAF8F3] text-[#141817] px-4 py-2.5 font-bold uppercase tracking-wider shadow-[4px_4px_0_#141817] hover:bg-[#E5E750] transition-colors cursor-pointer"
                >
                  <span>03 / 1-Click Audit Fixes ($149–$395)</span>
                  <span>↘</span>
                </button>
              </div>
            </div>

            {/* Right 5 Columns: Dramatic Featured Release Poster Card (Edition #001) */}
            <div className="lg:col-span-5">
              <article className="relative border-[3px] border-[#141817] bg-[#FAF8F3] shadow-[12px_12px_0_#E34232]">
                {/* Rotated Price Stamp */}
                <div className="absolute -top-4 -right-3 z-10 border-2 border-[#141817] bg-[#E5E750] text-[#141817] px-3.5 py-1.5 font-display text-sm sm:text-base font-black uppercase tracking-tight shadow-[4px_4px_0_#141817] -rotate-2">
                  Flagship Release · $49 / $89 / $199
                </div>

                <div className="border-b-[2.5px] border-[#141817] bg-[#141817] text-[#E5E750] px-4 py-2.5 font-mono text-[11px] flex items-center justify-between">
                  <span className="font-bold">★ EDITION #001 // LITERARY BRUTALISM</span>
                  <span className="text-[#F2ECE1]/80">INSTANT .ZIP + STUDIO</span>
                </div>

                <div className="relative aspect-[4/3] w-full overflow-hidden border-b-[2.5px] border-[#141817] bg-[#141817]">
                  <img
                    src="/assets/captures/blueprints/showcase-cover.png"
                    alt="Literary Brutalism Editorial Website Studio, 5-Board Figma Kit and 23 Vector SVGs"
                    className="h-full w-full object-cover object-top block"
                  />
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#E34232]">
                      BROWSER WEBSITE STUDIO + 5-BOARD FIGMA KIT + 23 SVGS
                    </div>
                    <h2 className="mt-1 font-display text-2xl sm:text-3xl font-black uppercase leading-none tracking-tight text-[#141817]">
                      Literary Brutalism
                    </h2>
                    <p className="mt-2 font-sans text-xs sm:text-sm text-[#2D3532] leading-relaxed">
                      Open our zero-install visual Studio in your browser, switch between 5 complete 7-page presets (Author, Musician EPK, Podcast, Design Studio, Storefront), recolor 23 vector SVGs across 4 palettes, and export a clean static <code>.ZIP</code>.
                    </p>
                  </div>

                  <div className="pt-3 border-t-2 border-[#141817] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="font-display text-2xl font-black text-[#141817]">
                        $49 – $199
                      </span>
                      <span className="block font-mono text-[10px] font-bold uppercase text-[#123F38]">
                        One-Time License · Own Forever
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => scrollToSection('#interactive-showroom')}
                        className="border-2 border-[#141817] bg-[#F2ECE1] text-[#141817] px-3 py-2 font-bold uppercase shadow-[3px_3px_0_#141817] hover:bg-[#E5E750] transition-colors cursor-pointer"
                      >
                        5-Tab Preview
                      </button>
                      <a
                        href="https://buy.stripe.com/5kQ5kC4Zn9CifMP19rebu01"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 border-2 border-[#141817] bg-[#123F38] text-[#FFFFFF] px-3.5 py-2 font-bold uppercase shadow-[3px_3px_0_#141817] hover:bg-[#E34232] transition-colors"
                      >
                        <span>Buy Complete ($89)</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* =================================================================
            DEPARTMENT 01: SELF-SERVE WEBSITE STUDIOS & FIGMA DESIGN SYSTEMS
            (Interactive 5-Niche Workbench + 3-Layer Anatomy + 3 License Cards)
           ================================================================= */}
        <section
          id="dept-studios"
          aria-labelledby="dept-01-heading"
          className="border-b-[3px] border-[#141817] px-4 py-12 sm:px-8 sm:py-16"
        >
          <div className="mx-auto max-w-[1380px] space-y-10">
            {/* Department 01 Banner */}
            <div className="border-[3px] border-[#141817] bg-[#141817] text-[#F2ECE1] p-5 sm:p-7 shadow-[8px_8px_0_#123F38] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#D9A62E] block">
                  DEPARTMENT 01 // SELF-SERVE WEBSITE STUDIOS &amp; FIGMA SYSTEMS
                </span>
                <h2
                  id="dept-01-heading"
                  className="mt-1 font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#F2ECE1]"
                >
                  Website Templates, Browser Studios &amp; Figma Kits
                </h2>
                <p className="mt-1 font-sans text-sm text-[#A9CFC7] max-w-2xl">
                  Replace an outdated website today for a one-time payment. Edit visually in your browser, export a clean static .ZIP, and host anywhere for $0/month.
                </p>
              </div>
              <a
                href="https://blueprints.contextmuse.com/literarybrutalism"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 border-2 border-[#141817] bg-[#E5E750] text-[#141817] px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0_#E34232] hover:bg-[#FAF8F3] transition-colors self-start md:self-auto"
              >
                <span>Open Standalone Product Site</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Interactive 5-Niche & Asset Switcher Workbench */}
            <div id="interactive-showroom" className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E34232]">
                  INTERACTIVE 5-NICHE PREVIEW // CLICK TO INSPECT EVERY INCLUDED PRESET &amp; PALETTE
                </span>
                <span className="font-mono text-xs text-[#45504C]">
                  All 5 presets included in every Literary Brutalism license
                </span>
              </div>

              <div
                role="tablist"
                aria-label="Blueprint Niche and Asset Previews"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 font-mono text-xs"
              >
                {NICHE_SHOWCASE.map((item) => {
                  const isActive = item.id === activeNiche.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      data-testid={`showroom-tab-${item.id}`}
                      onClick={() => setActiveNicheId(item.id)}
                      className={`min-h-[48px] px-3.5 py-2.5 text-left font-bold uppercase tracking-wider border-2 border-[#141817] transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#141817] text-[#E5E750] shadow-[4px_4px_0_#E34232] -translate-y-0.5'
                          : 'bg-[#FAF8F3] text-[#141817] shadow-[3px_3px_0_#141817] hover:bg-[#E5E750]'
                      }`}
                    >
                      {item.tabLabel}
                    </button>
                  );
                })}
              </div>

              {/* Active Niche Showcase Panel */}
              <div
                role="tabpanel"
                data-testid="showroom-active-panel"
                className="border-[3px] border-[#141817] bg-[#FAF8F3] p-5 sm:p-7 shadow-[10px_10px_0_#141817] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
              >
                <div className="lg:col-span-7 border-[3px] border-[#141817] bg-[#141817] shadow-[6px_6px_0_#E34232] overflow-hidden">
                  <img
                    src={activeNiche.image}
                    alt={activeNiche.imageAlt}
                    className="w-full h-auto block"
                  />
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <span
                    className="inline-block border-2 border-[#141817] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: activeNiche.badgeBg,
                      color: activeNiche.badgeFg,
                    }}
                  >
                    {activeNiche.badge}
                  </span>

                  <h3 className="font-display text-2xl sm:text-3xl font-black uppercase leading-[0.95] tracking-tight text-[#141817]">
                    {activeNiche.title}
                  </h3>

                  <p className="font-sans text-sm text-[#2D3532] leading-relaxed">
                    {activeNiche.description}
                  </p>

                  {/* Color Token Swatches */}
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#45504C] block">
                      7-Token CSS Variable Palette:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {activeNiche.swatches.map((sw) => (
                        <div
                          key={sw.hex}
                          className="flex items-center gap-1.5 border border-[#141817] bg-[#F2ECE1] px-2 py-1 font-mono text-[10px]"
                        >
                          <span
                            className="h-3.5 w-3.5 border border-[#141817] shrink-0"
                            style={{ backgroundColor: sw.hex }}
                          />
                          <span className="font-bold">{sw.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <ul className="space-y-2 border-t-2 border-b-2 border-[#141817]/15 py-3 font-sans text-xs sm:text-sm text-[#141817]">
                    {activeNiche.highlights.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#123F38] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => scrollToSection('#blueprints-checkout')}
                      className="inline-flex items-center gap-2 border-2 border-[#141817] bg-[#123F38] text-[#FFFFFF] px-4 py-2.5 font-bold uppercase tracking-wider shadow-[4px_4px_0_#141817] hover:bg-[#E34232] transition-colors cursor-pointer"
                    >
                      <span>Choose License ($49 / $89 / $199)</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <a
                      href={activeNiche.specUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border-2 border-[#141817] bg-[#F2ECE1] text-[#141817] px-3.5 py-2.5 font-bold uppercase tracking-wider hover:bg-[#E5E750] transition-colors"
                    >
                      <span>{activeNiche.specLabel}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Layer Package Anatomy Inspector (Studio HUD + 23 SVGs + 5-Board Figma) */}
            <div className="border-[3px] border-[#141817] bg-[#141817] text-[#F2ECE1] p-5 sm:p-7 shadow-[10px_10px_0_#123F38] space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[#F2ECE1]/20 pb-4">
                <div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#E5E750] block">
                    PACKAGE ANATOMY // WHAT YOU UNLOCK AFTER CHECKOUT
                  </span>
                  <h3 className="mt-1 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F2ECE1]">
                    Inspect the Browser Studio, 23 Vector SVGs &amp; 5 Figma Sheets
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#A9CFC7]">
                  Click any component layer below to preview
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
                  {ANATOMY_PLATES.map((plate) => {
                    const isSelected = plate.id === activePlate.id;
                    return (
                      <button
                        key={plate.id}
                        type="button"
                        onClick={() => setActivePlateId(plate.id)}
                        className={`w-full text-left p-3.5 border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#E5E750] bg-[#1F2523] text-[#F2ECE1] shadow-[4px_4px_0_#E34232]'
                            : 'border-[#F2ECE1]/20 bg-[#181C1B] text-[#F2ECE1]/75 hover:border-[#F2ECE1]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider">
                          <span className={isSelected ? 'text-[#E5E750] font-bold' : 'text-[#D9A62E]'}>
                            {plate.label}
                          </span>
                          <span>{isSelected ? 'VIEWING →' : 'PREVIEW'}</span>
                        </div>
                        <div className="mt-0.5 font-mono text-[10.5px] text-[#A9CFC7]">
                          {plate.meta}
                        </div>
                        <p className="mt-1.5 font-sans text-xs text-[#F2ECE1]/85 leading-snug">
                          {plate.caption}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="lg:col-span-7 border-2 border-[#E5E750] bg-[#0A0C0D] p-3 sm:p-4 flex flex-col justify-between">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2ECE1]/15 pb-2.5 mb-3 font-mono text-xs">
                    <span className="text-[#E5E750] font-bold uppercase">
                      {activePlate.label}
                    </span>
                    <span className="text-[#A9CFC7]">{activePlate.meta}</span>
                  </div>
                  <div className="overflow-hidden border border-[#F2ECE1]/20 bg-[#141817]">
                    <img
                      src={activePlate.src}
                      alt={activePlate.label}
                      className="w-full h-auto max-h-[460px] object-contain mx-auto block"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Literary Brutalism License Tiers ($49 / $89 / $199) */}
            <div id="blueprints-checkout" className="space-y-5 pt-2">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#123F38] block">
                    EDITION #001 LICENSES // INSTANT STRIPE CHECKOUT
                  </span>
                  <h3 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#141817]">
                    Select Your Literary Brutalism Package
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#45504C]">
                  Auto-redirects to Online Browser Studio + .ZIP download immediately after payment
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {STRIPE_TIERS.map((tier) => (
                  <article
                    key={tier.id}
                    data-testid={`blueprint-tier-${tier.id}`}
                    style={{
                      backgroundColor: tier.accentBg,
                      color: tier.accentFg,
                      boxShadow: `9px 9px 0 ${tier.shadowColor}`,
                    }}
                    className="border-[3px] border-[#141817] flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      <div className="px-4 py-2.5 border-b-[2.5px] border-[#141817] bg-[#E6DEC8] text-[#141817] font-mono text-[11px] font-bold flex items-center justify-between">
                        <span>{tier.code}</span>
                        <span className="bg-[#123F38] text-[#FFFFFF] px-2 py-0.5 text-[10px]">
                          ● INSTANT .ZIP
                        </span>
                      </div>

                      <a
                        href={tier.specUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-[220px] bg-[#141817] border-b-[2.5px] border-[#141817] overflow-hidden"
                      >
                        <img
                          src={tier.image}
                          alt={tier.name}
                          className="w-full h-full object-cover object-top block hover:scale-[1.02] transition-transform"
                        />
                      </a>

                      <div className="p-5 sm:p-6 space-y-4">
                        <div>
                          <h4 className="font-display text-xl sm:text-2xl font-black uppercase leading-tight">
                            {tier.name}
                          </h4>
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="font-display text-3xl sm:text-4xl font-black">
                              {tier.price}
                            </span>
                            <span className="font-mono text-xs opacity-75">{tier.cadence}</span>
                          </div>
                        </div>

                        <p className="font-sans text-xs sm:text-sm opacity-90 leading-relaxed">
                          {tier.description}
                        </p>

                        <ul className="space-y-2 border-t border-current/20 pt-3 font-sans text-xs">
                          {tier.includes.map((inc, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2
                                className={`h-4 w-4 shrink-0 mt-0.5 ${
                                  tier.featured ? 'text-[#E5E750]' : 'text-[#123F38]'
                                }`}
                              />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 pt-0">
                      <div className="pt-4 border-t-2 border-current/20 flex items-center gap-2 font-mono text-xs">
                        <a
                          href={tier.specUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-2 border-[#141817] bg-[#F2ECE1] text-[#141817] px-3 py-2.5 font-bold uppercase hover:bg-[#D9A62E] transition-colors"
                        >
                          Specs
                        </a>
                        <a
                          href={tier.stripeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid={`stripe-checkout-${tier.id}`}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 border-2 border-[#141817] px-4 py-2.5 font-bold uppercase tracking-wider transition-all ${
                            tier.featured
                              ? 'bg-[#E5E750] text-[#141817] shadow-[4px_4px_0_#E34232] hover:bg-[#FFFFFF]'
                              : 'bg-[#123F38] text-[#FFFFFF] shadow-[4px_4px_0_#141817] hover:bg-[#E34232]'
                          }`}
                        >
                          <span>Buy ({tier.price})</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            DEPARTMENT 02: CREATIVE UTILITIES, DOCUMENT DOSSIERS, AD & PROMPT PACKS
            (Distinctive Horizontal Editorial Feature Rows — Not another repetitive grid)
           ================================================================= */}
        <section
          id="dept-utilities"
          aria-labelledby="dept-02-heading"
          className="border-b-[3px] border-[#141817] bg-[#E6DEC8] px-4 py-12 sm:px-8 sm:py-16"
        >
          <div className="mx-auto max-w-[1380px] space-y-8">
            <div className="border-[3px] border-[#141817] bg-[#141817] text-[#F2ECE1] p-5 sm:p-7 shadow-[8px_8px_0_#D9A62E] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#E5E750] block">
                  DEPARTMENT 02 // CREATIVE UTILITIES, AD PACKS &amp; PROMPT SYSTEMS
                </span>
                <h2
                  id="dept-02-heading"
                  className="mt-1 font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#F2ECE1]"
                >
                  Branded Document Sets, 25-Asset Ad Packs &amp; Prompts
                </h2>
                <p className="mt-1 font-sans text-sm text-[#A9CFC7] max-w-2xl">
                  High-leverage studio utilities and operational scaffolds that protect client scope, generate multi-channel social campaigns, and turn audits into finished copy.
                </p>
              </div>
              <span className="font-mono text-xs text-[#E5E750] font-bold uppercase">
                3 Published Utilities · Instant Stripe Checkout
              </span>
            </div>

            {/* Distinctive Staggered Horizontal Dossier Spreads */}
            <div className="space-y-6">
              {CREATIVE_UTILITIES_AND_PACKS.map((item, idx) => {
                const isDark = item.theme === 'ink';
                const IconComp = item.icon;
                return (
                  <article
                    key={item.id}
                    data-testid={`blueprint-utility-${item.id}`}
                    className={`border-[3px] border-[#141817] p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center ${
                      isDark
                        ? 'bg-[#141817] text-[#F2ECE1] shadow-[10px_10px_0_#E34232]'
                        : 'bg-[#FAF8F3] text-[#141817] shadow-[10px_10px_0_#141817]'
                    }`}
                  >
                    {/* Image Column (Alternates Left/Right for Strong Editorial Rhythm) */}
                    <div
                      className={`lg:col-span-5 border-[2.5px] border-[#141817] bg-[#141817] overflow-hidden shadow-[5px_5px_0_#D9A62E] ${
                        idx % 2 === 1 ? 'lg:order-2' : ''
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-[250px] sm:h-[280px] object-cover object-top block"
                      />
                    </div>

                    {/* Copy & Checkout Column */}
                    <div
                      className={`lg:col-span-7 space-y-4 ${
                        idx % 2 === 1 ? 'lg:order-1' : ''
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-current/15 pb-2.5 font-mono text-xs font-bold">
                        <span className={isDark ? 'text-[#E5E750]' : 'text-[#123F38]'}>
                          {item.code}
                        </span>
                        <span className="bg-[#123F38] text-[#FFFFFF] border border-[#141817] px-2.5 py-0.5 text-[10px]">
                          {item.status}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <h3 className="font-display text-2xl sm:text-3xl font-black uppercase leading-tight tracking-tight flex items-center gap-2.5">
                          <IconComp
                            className={`h-6 w-6 shrink-0 ${
                              isDark ? 'text-[#E5E750]' : 'text-[#E34232]'
                            }`}
                          />
                          <span>{item.title}</span>
                        </h3>
                      </div>

                      <p
                        className={`font-sans text-sm sm:text-base leading-relaxed ${
                          isDark ? 'text-[#F2ECE1]/85' : 'text-[#2D3532]'
                        }`}
                      >
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                        {item.chips.map((chip) => (
                          <span
                            key={chip}
                            className={`border px-2.5 py-1 font-bold ${
                              isDark
                                ? 'border-[#F2ECE1]/30 bg-[#1F2523] text-[#E5E750]'
                                : 'border-[#141817] bg-[#F2ECE1] text-[#141817]'
                            }`}
                          >
                            {chip}
                          </span>
                        ))}
                      </div>

                      <div className="pt-3 border-t-2 border-current/15 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="font-display text-3xl font-black">
                            {item.price}
                          </span>
                          <span className="ml-2 font-mono text-xs opacity-75">
                            / {item.unit}
                          </span>
                        </div>

                        <a
                          href={item.stripeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 border-2 border-[#141817] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                            isDark
                              ? 'bg-[#E5E750] text-[#141817] shadow-[4px_4px_0_#E34232] hover:bg-[#FFFFFF]'
                              : 'bg-[#123F38] text-[#FFFFFF] shadow-[4px_4px_0_#141817] hover:bg-[#E34232]'
                          }`}
                        >
                          <span>{item.ctaLabel}</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================
            DEPARTMENT 03: 1-CLICK AUDIT REMEDIATIONS & WEB REDESIGN SPRINTS
            (Bridges Free Website + System Check to Fixed-Price Execution)
           ================================================================= */}
        <section
          id="dept-remediations"
          aria-labelledby="dept-03-heading"
          className="border-b-[3px] border-[#141817] bg-[#F2ECE1] px-4 py-12 sm:px-8 sm:py-16"
        >
          <div className="mx-auto max-w-[1380px] space-y-8">
            <div className="border-[3px] border-[#141817] bg-[#141817] text-[#F2ECE1] p-5 sm:p-7 shadow-[8px_8px_0_#E34232] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#D9A62E] block">
                  DEPARTMENT 03 // AUDIT-TO-ACTION REMEDIATION SPRINTS
                </span>
                <h2
                  id="dept-03-heading"
                  className="mt-1 font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#F2ECE1]"
                >
                  1-Click Website Fixes, SEO &amp; Redesign Sprints
                </h2>
                <p className="mt-1 font-sans text-sm text-[#A9CFC7] max-w-2xl">
                  Productized execution sprints that map directly to the diagnostic layers of the Context &amp; Muse Website + System Check. Book at a fixed price—no sales call required.
                </p>
              </div>
              <a
                href="/website-system-check/"
                className="shrink-0 inline-flex items-center gap-1.5 border-2 border-[#141817] bg-[#D9A62E] text-[#141817] px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0_#123F38] hover:bg-[#E5E750] transition-colors self-start md:self-auto"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Run Free Website Check First →</span>
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {AUDIT_REMEDIATION_SPRINTS.map((sprint) => (
                <article
                  key={sprint.id}
                  data-testid={`blueprint-sprint-${sprint.id}`}
                  className={`border-[3px] border-[#141817] bg-[#FAF8F3] flex flex-col justify-between ${
                    sprint.featured
                      ? 'shadow-[10px_10px_0_#E34232]'
                      : 'shadow-[8px_8px_0_#123F38]'
                  }`}
                >
                  <div>
                    <div className="px-4 py-2.5 bg-[#E6DEC8] border-b-[2.5px] border-[#141817] font-mono text-[10.5px] font-bold flex items-center justify-between">
                      <span>{sprint.layer}</span>
                      <span className="bg-[#123F38] text-[#FFFFFF] px-2 py-0.5 text-[9.5px]">
                        {sprint.badge}
                      </span>
                    </div>

                    <div className="h-[220px] bg-[#141817] border-b-[2.5px] border-[#141817] overflow-hidden">
                      <img
                        src={sprint.image}
                        alt={sprint.title}
                        className="w-full h-full object-cover object-top block"
                      />
                    </div>

                    <div className="p-5 sm:p-6 space-y-3.5">
                      <h3 className="font-display text-xl sm:text-2xl font-black uppercase leading-tight text-[#141817]">
                        {sprint.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-[#2D3532] leading-relaxed">
                        {sprint.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                        {sprint.chips.map((c) => (
                          <span
                            key={c}
                            className="border border-[#141817] bg-[#F2ECE1] px-2 py-0.5 font-bold"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 pt-0">
                    <div className="pt-4 border-t-2 border-[#141817] flex items-center justify-between gap-3">
                      <div>
                        <span className="font-display text-2xl sm:text-3xl font-black text-[#141817]">
                          {sprint.price}
                        </span>
                        <span className="block font-mono text-[10px] font-bold text-[#45504C]">
                          {sprint.unit}
                        </span>
                      </div>

                      <a
                        href={sprint.stripeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border-2 border-[#141817] bg-[#123F38] text-[#FFFFFF] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0_#141817] hover:bg-[#E34232] transition-colors"
                      >
                        <span>{sprint.ctaLabel}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 05: COHERENT CUSTOMER JOURNEY BRIDGE (STUDIO CONTINUITY)
           ================================================================= */}
        <section className="bg-[#123F38] text-[#F2ECE1] px-4 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-[1380px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E5E750] block">
                ONE CREATIVE ECOSYSTEM // TAILORED COMMISSION VS. READY-MADE PRODUCT
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#F2ECE1] leading-tight">
                Need a Tailored System Built Around Your Operation Instead?
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#F2ECE1]/85 max-w-2xl leading-relaxed">
                Blueprints are self-serve digital products and fixed-scope remediation sprints you can purchase immediately. If your business needs a tailored commercial website, an interactive quoting or reservation engine, or custom internal operational software, step back into the main studio rooms.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <Link
                to="/build"
                className="border-2 border-[#141817] bg-[#DFDACE] text-[#23282A] p-4 shadow-[5px_5px_0_#141817] hover:bg-[#E5E750] transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#17504A] uppercase block">
                    01 / CUSTOM BUILD
                  </span>
                  <div className="mt-1 font-display text-lg font-black uppercase">
                    Commission a Build
                  </div>
                  <p className="mt-1 font-sans text-xs text-[#23282A]/80">
                    Describe your project or sketch on the interactive whiteboard.
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-bold text-[#17504A]">
                  <span>Open Custom Build</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>

              <Link
                to="/method"
                className="border-2 border-[#141817] bg-[#23282A] text-[#EDE9E0] p-4 shadow-[5px_5px_0_#D9A62E] hover:border-[#E5E750] transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#D9A62E] uppercase block">
                    STUDIO APPROACH
                  </span>
                  <div className="mt-1 font-display text-lg font-black uppercase">
                    The Method &amp; Pricing
                  </div>
                  <p className="mt-1 font-sans text-xs text-[#EDE9E0]/80">
                    5-stage process, capabilities, and upfront custom build pricing.
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-bold text-[#D9A62E]">
                  <span>Inspect The Method</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PageAnnotationOverlay />
      <SiteFooter />
    </div>
  );
}
