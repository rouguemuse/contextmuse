import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ExternalLink,
  KeyRound,
  Layers,
  FileText,
  Megaphone,
  Cpu,
  Wrench,
  Sparkles,
  Compass,
  Maximize2,
} from 'lucide-react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import PageAnnotationOverlay from '@/components/site/PageAnnotationOverlay';

/* ============================================================================
   01. SHOWPIECE EXHIBITION DATA — LITERARY BRUTALISM WEBSITE STUDIO (#001)
   Uses authentic, uncropped 1440px desktop & 390px mobile product captures
   ============================================================================ */
const SHOWPIECE_VIEWS = [
  {
    id: 'studio-hud',
    num: '01',
    label: 'Live Browser Studio HUD',
    meta: '1440×900 · ZERO-INSTALL VISUAL EDITOR & .ZIP EXPORTER',
    src: '/assets/captures/blueprints/1440px_desktop_landing_studio.png',
    alt: 'Literary Brutalism In-Browser Visual Studio HUD with niche, palette, and page switchers open over the 1440px landing page',
    urlBar: 'atelier-studio.local // ?studio=open&niche=author&palette=field-manual',
    caption:
      'Open the self-contained HTML Studio in any desktop browser. Switch between 5 niche architectures, toggle 4 color token palettes, rewrite any headline inline, and click Export Static .ZIP.',
    callouts: [
      'Top Studio Dock: Niche, Palette, Page & Export controls',
      '100% Client-Side: Zero Node/build setup required to edit',
      '1-Click Export: Compiles a clean, dependency-free static .ZIP',
    ],
  },
  {
    id: 'full-landing',
    num: '02',
    label: '1440px Editorial Landing',
    meta: '1440×4625 · FULL UNCROPPED ARCHITECTURAL GRID',
    src: '/assets/captures/blueprints/1440px_desktop_landing_full_preview.png',
    alt: 'Uncropped 1440px Literary Brutalism landing page showing hero, excerpt reader, edition pricing, and botanical vector illustrations',
    urlBar: 'blueprints.contextmuse.com // index.html (Published Production View)',
    caption:
      'Swiss industrial grid with exposed hairline rules, oversized display typography, chapter excerpt module, 3-tier Stripe edition cards, and embedded CSS-tokenized vector plates.',
    callouts: [
      'Asymmetric Hero: Editorial title block + technical metadata ledger',
      'Embedded SVG Plates: Recolor automatically with active CSS tokens',
      'Semantic HTML5 + Schema.org JSON-LD baked into every page',
    ],
  },
  {
    id: 'excerpt-audio',
    num: '03',
    label: 'Chapter & Audio Player',
    meta: '1440×3100 · LONG-FORM READER + NATIVE AUDIO SAMPLE BAR',
    src: '/assets/captures/blueprints/1440px_desktop_excerpt_audio.png',
    alt: 'Literary Brutalism Excerpt Reader and Built-in Audio Sample Player page',
    urlBar: 'blueprints.contextmuse.com // excerpt.html (Reader & Audio Engine)',
    caption:
      'Designed for novelists, musicians, and narrative podcasters: pairs long-form literary typesetting with an interactive waveform/seek audio player for chapters, singles, or episode clips.',
    callouts: [
      'Native HTML5 Audio Engine: Drop in any MP3/WAV with live seek bar',
      'Print-Grade Reading Measure: Optimized 65ch column & marginalia',
      'Direct Conversion Bridge: Sticky edition claim bar below the excerpt',
    ],
  },
  {
    id: 'press-kit',
    num: '04',
    label: 'Press & Media Dossier',
    meta: '1440×3450 · EPK, BIOS, HI-RES ASSETS & TOUR/EVENT LEDGER',
    src: '/assets/captures/blueprints/1440px_desktop_press.png',
    alt: 'Literary Brutalism Press Kit and Electronic Press Kit page',
    urlBar: 'blueprints.contextmuse.com // press.html (Media & Booking Kit)',
    caption:
      'Replaces scattered Google Drive folders with an authoritative press room: approved short/long bios, 300-DPI portrait & cover downloads, critical acclaim ledger, and booking inquiry dispatch.',
    callouts: [
      '1-Click Asset Pack: Jacket art, stage plot, or press photos',
      'Structured Fact Sheet: ISBN/catalog numbers, release specs, credits',
      'Promoter & Media Contact: Direct routing without middleman forms',
    ],
  },
  {
    id: 'journal-log',
    num: '05',
    label: 'Filterable Logbook',
    meta: '1440×2780 · CLIENT-SIDE TAGGED ESSAY & EPISODE ARCHIVE',
    src: '/assets/captures/blueprints/1440px_desktop_journal.png',
    alt: 'Literary Brutalism Filterable Journal and Episode Logbook page',
    urlBar: 'blueprints.contextmuse.com // journal.html (Serialized Archive)',
    caption:
      'An indexed archive for essays, field notes, podcast episodes, or studio dispatches with instant category filtering and numbered dossier cards.',
    callouts: [
      'Instant Tag Filtering: Zero page reloads or external CMS required',
      'Numbered Entry Ledger: Date, reading time, classification tag, abstract',
      'Long-Tail Search Architecture: Clean static URLs for organic indexing',
    ],
  },
  {
    id: 'editions-store',
    num: '06',
    label: '3-Tier Stripe Storefront',
    meta: '1440×2950 · DIRECT-TO-BUYER EDITIONS & COMPARISON MATRIX',
    src: '/assets/captures/blueprints/1440px_desktop_products_pricing.png',
    alt: 'Literary Brutalism 3-Tier Editions and Stripe Storefront page',
    urlBar: 'blueprints.contextmuse.com // products.html (Direct Commerce)',
    caption:
      'Sell books, vinyl records, digital downloads, or productized design sprints directly via Stripe Payment Links—keeping 100% of revenue with zero monthly platform fees.',
    callouts: [
      '3-Tier Architecture: Standard, Collector/Complete, and Commercial tiers',
      'Full Specification Table: Deliverable-by-deliverable breakdown',
      'Pre-Wired for Stripe, Gumroad, or Lemon Squeezy checkout links',
    ],
  },
];

const NICHE_ARCHITECTURES = [
  {
    id: 'author',
    num: '01',
    name: 'Author & Book Launch',
    paletteName: 'Field Manual Palette',
    summary:
      'For novelists, essayists, academic researchers, and independent presses launching a flagship monograph or literary archive.',
    specUrl: 'https://blueprints.contextmuse.com/author-website-template',
    swatches: ['#141414', '#F0E8D9', '#E3DAC9', '#E34232', '#E5E750'],
  },
  {
    id: 'musician',
    num: '02',
    name: 'Musician & Album EPK',
    paletteName: 'Night Ink Palette',
    summary:
      'High-contrast Electronic Press Kit, single audio player, tour ledger, and direct-to-fan vinyl/merch storefront.',
    specUrl: 'https://blueprints.contextmuse.com/musician-epk-template',
    swatches: ['#0E1013', '#ECE7DC', '#1B1F26', '#FF5A36', '#D9FF43'],
  },
  {
    id: 'podcast',
    num: '03',
    name: 'Podcast & Audio Show',
    paletteName: 'Oxide Red Palette',
    summary:
      'Serialized episode archive with full transcript templates, embedded audio bar, listener memberships, and sponsor kit.',
    specUrl: 'https://blueprints.contextmuse.com/podcast-website-template',
    swatches: ['#1D1311', '#F7EFE4', '#EADBC8', '#C83422', '#F3C846'],
  },
  {
    id: 'studio',
    num: '04',
    name: 'Design Studio & Agency',
    paletteName: 'Archive Olive Palette',
    summary:
      'Editorial case-file portfolio and productized service storefront—with optional $199 unlimited client handoff rights.',
    specUrl: 'https://blueprints.contextmuse.com/brutalist-agency-template',
    swatches: ['#171A14', '#EFECE1', '#DFE2CE', '#D94E28', '#CDD942'],
  },
];

const SHOWPIECE_LICENSES = [
  {
    id: 'tier-1',
    code: 'EDITION 01 // STANDARD STUDIO',
    name: 'Standard Studio License',
    price: '$49',
    terms: 'One-time payment · Perpetual license for 1 brand',
    stripeUrl: 'https://buy.stripe.com/aFafZg3VjbKqbwz5pHebu00',
    specUrl: 'https://blueprints.contextmuse.com/literarybrutalism',
    ctaLabel: 'Acquire Standard Studio — $49',
    primary: false,
    summary:
      'Complete in-browser Website Studio + offline HTML Studio file with all 5 niche presets, 7 multi-page layouts, 4 color token palettes, and 1-click static .ZIP export.',
    specs: [
      'Online + Offline Visual Browser Studio',
      'All 5 Niche Presets & 7 Multi-Page Layouts',
      '23 Embedded Tokenized SVGs + .ZIP Exporter',
    ],
  },
  {
    id: 'tier-2',
    code: 'EDITION 02 // COMPLETE DESIGN + CODE SYSTEM',
    name: 'Studio + 5-Board Figma & 23-SVG Bundle',
    price: '$89',
    terms: 'One-time payment · Perpetual license for up to 2 brands',
    stripeUrl: 'https://buy.stripe.com/5kQ5kC4Zn9CifMP19rebu01',
    specUrl: 'https://blueprints.contextmuse.com/brutalist-figma-svg-kit',
    ctaLabel: 'Acquire Complete Bundle — $89',
    primary: true,
    badge: 'RECOMMENDED // INCLUDES FIGMA + RAW SVGS',
    summary:
      'Everything in the Standard Studio plus all 5 consolidated 1440px Figma Design System master boards and the standalone catalog of 23 raw, CSS-tokenized .SVG vector files.',
    specs: [
      'Everything in Standard Studio (Up to 2 Brands)',
      '5 Consolidated 1440px Figma Master Boards',
      '23 Raw Standalone .SVG Files + Searchable Catalog',
    ],
  },
  {
    id: 'tier-3',
    code: 'EDITION 03 // COMMERCIAL AGENCY LICENSE',
    name: 'Agency Unlimited + Modular Source',
    price: '$199',
    terms: 'One-time payment · Unlimited client builds & handoffs',
    stripeUrl: 'https://buy.stripe.com/9B628qezXdSy7gjg4lebu02',
    specUrl: 'https://blueprints.contextmuse.com/brutalist-agency-template',
    ctaLabel: 'Acquire Agency Unlimited — $199',
    primary: false,
    summary:
      'Unrestricted commercial license to ship and hand off unlimited client websites, plus the uncompiled modular source repository (src/) and zero-dependency Node.js compiler (build.js).',
    specs: [
      'Everything in Complete $89 Studio + Figma Bundle',
      'Unlimited White-Label Client .ZIP Handoff Rights',
      'Modular Source (src/) + Custom Preset Compiler (build.js)',
    ],
  },
];

/* ============================================================================
   02. SECONDARY FEATURE DATA — THE 5-BOARD FIGMA & 23-SVG DESIGN SYSTEM
   Uses authentic uncropped Figma master board captures
   ============================================================================ */
const FIGMA_SYSTEM_BOARDS = [
  {
    id: 'board-01',
    shortLabel: 'Foundations',
    code: 'BOARD 01 // FOUNDATIONS & TOKENS',
    title: 'Color Palettes, Typography Scale & UI Components',
    dimensions: '1440PX MASTER SHEET · AUTO-LAYOUT & VARIABLES',
    src: '/assets/captures/blueprints/figma_v2_sheet01_foundations.png',
    alt: 'Figma Board 01 showing 4 color token palettes, typographic scale, buttons, badges, and brutalist cards',
    caption:
      'Defines the 7 semantic color variables (--ink, --bone, --paper, --scarlet, --acid, --blue, --lilac) across all 4 studio palettes alongside display/serif/mono type styles and component variants.',
  },
  {
    id: 'board-02',
    shortLabel: '1440px Landing',
    code: 'BOARD 02 // 1440PX DESKTOP MASTER',
    title: 'Full 1440px Flagship Landing Architecture',
    dimensions: '1440×4625PX · 12-COLUMN SWISS ARCHITECTURAL GRID',
    src: '/assets/captures/blueprints/figma_v2_sheet02_desktop_landing.png',
    alt: 'Figma Board 02 showing full 1440px desktop landing page layout',
    caption:
      'Complete desktop flagship composition with hero specimen frame, metadata strip, interactive chapter excerpt module, 3-tier edition pricing matrix, and editorial colophon.',
  },
  {
    id: 'board-03',
    shortLabel: '6 Inner Pages',
    code: 'BOARD 03 // 6 INNER PAGE TEMPLATES',
    title: 'About, Excerpt/Audio, Press, Products, Journal & Contact',
    dimensions: '6 FULL-LENGTH 1440PX PAGE TEMPLATES',
    src: '/assets/captures/blueprints/figma_v1_sheet03_inner_pages.png',
    alt: 'Figma Board 03 showing all 6 inner page templates side by side',
    caption:
      'Every secondary page architected as a cohesive system—ready to duplicate, customize in Figma, or export directly from the paired Browser Studio.',
  },
  {
    id: 'board-04',
    shortLabel: 'Niches & 390px',
    code: 'BOARD 04 // NICHES & 390PX MOBILE',
    title: '5 Niche Variations & Responsive 390px Mobile Layouts',
    dimensions: '1440PX NICHE HEADERS + 390×844PX MOBILE BREAKPOINTS',
    src: '/assets/captures/blueprints/figma_v1_sheet04_niches_mobile.png',
    alt: 'Figma Board 04 showing niche variations and 390px mobile responsive frames',
    caption:
      'Side-by-side niche transformations (Author, Musician EPK, Podcast, Design Studio) paired with mobile navigation drawers and responsive card stacks.',
  },
  {
    id: 'board-05',
    shortLabel: '23 Vector SVGs',
    code: 'BOARD 05 // 23 TOKENIZED VECTOR SVGS',
    title: 'Standalone 23-Illustration Graphic Library Catalog',
    dimensions: '23 RAW .SVG FILES · CSS CUSTOM-PROPERTY BOUND',
    src: '/assets/captures/blueprints/1440px_graphic_library_catalog.png',
    alt: 'Standalone 23-SVG Tokenized Graphic Library catalog showing architectural, botanical, and emblematic vector illustrations',
    caption:
      'Botanical plates, architectural projections, brutalist stamps, and emblem cards built with clean paths bound to CSS custom properties so they recolor automatically.',
  },
];

/* ============================================================================
   03. PRACTICAL TOOLS & FOCUSED WEBSITE IMPROVEMENTS — THE COLLECTION
   Disciplined Swiss specification index with custom, unclipped visual specimens
   ============================================================================ */
const PRACTICAL_COLLECTION = [
  {
    id: 'util-docs',
    index: '01',
    category: 'DOCUMENT SYSTEM',
    code: 'ARCHIVE-DOC // INSTANT DOWNLOAD',
    title: 'Branded Business Document & SOW Dossier Set',
    oneLiner:
      'Five archival-grade client documents engineered to lock scope, prevent unpaid revision creep, and present your studio with institutional authority.',
    price: '$79',
    terms: 'One-time purchase · Editable Print/PDF + Markdown/Doc templates',
    stripeUrl: 'https://buy.stripe.com/fZudR8bnLbKqfMPbO5ebu0a',
    ctaLabel: 'Acquire Document Set — $79',
    specs: [
      '01. Client Proposal & Executive Pitch Dossier (Scope, Timeline & Investment Options)',
      '02. Scope-Locked Statement of Work (SOW) with explicit change-order boundaries',
      '03. Technical Discovery Intake Brief + Invoice Ledger + Final Handoff Manual',
      'Formatted in the Context & Muse Swiss brutalist grid for instant PDF export',
    ],
    specimen: {
      header: 'SPECIMEN // SOW CLAUSE 04.2 & DELIVERABLE LEDGER',
      stamp: '5 DOCUMENTS · PRINT & DIGITAL READY',
      rows: [
        { k: 'DOC-01', v: 'Executive Proposal & Option Matrix', tag: '12 PAGES' },
        { k: 'DOC-02', v: 'Scope-Locked Statement of Work (SOW)', tag: 'CLAUSE-PROTECTED' },
        { k: 'DOC-03', v: 'Technical Discovery & Asset Intake', tag: 'CLIENT QUESTIONNAIRE' },
        { k: 'DOC-04', v: 'Milestone Invoice & Payment Schedule', tag: '50 / 50 SPLIT' },
        { k: 'DOC-05', v: 'Production Handoff & Credentials Manual', tag: 'ARCHIVE RECORD' },
      ],
    },
  },
  {
    id: 'util-ads',
    index: '02',
    category: 'CAMPAIGN KIT',
    code: 'CAMPAIGN-25 // TAILORED MULTI-CHANNEL PACK',
    title: '25-Asset Social Media & Multi-Channel Ad Pack',
    oneLiner:
      'A complete 25-piece visual campaign tailored to your actual brand, headline hierarchy, and product screenshots across 6 paid and organic channels.',
    price: '$149',
    terms: 'Fixed-price custom production · Delivered as ready-to-post PNG, MP4 & UTM Guide',
    stripeUrl: 'https://buy.stripe.com/3cI14mdvT15Mbwz3hzebu0b',
    ctaLabel: 'Order 25-Asset Ad Pack — $149',
    specs: [
      '7 Vertical Pinterest Discovery Pins (1000×1500) + 4 Meta/IG Feed Squares (1080×1080)',
      '5 High-Resolution 4:3 Showcase Boards (1600×1200) + 1 LinkedIn Sponsored Card (1200×627)',
      '1 Vertical 9:16 Motion Video Ad (.MP4 for TikTok / Reels / Shorts) + 7 Story Frames',
      'Includes channel-specific headline hooks, caption copy, and UTM tracking spreadsheet',
    ],
    specimen: {
      header: 'SPECIMEN // 25-ASSET MULTI-RATIO DISTRIBUTION MATRIX',
      stamp: '6 CHANNELS · PNG + 9:16 MP4 + UTM COPY',
      rows: [
        { k: '07× PIN', v: 'Pinterest Vertical Discovery Plates', tag: '1000 × 1500 PX' },
        { k: '04× META', v: 'Instagram & Meta Carousel/Feed Squares', tag: '1080 × 1080 PX' },
        { k: '05× SHOW', v: 'Editorial 4:3 Product Feature Boards', tag: '1600 × 1200 PX' },
        { k: '01× REEL', v: 'Vertical Motion Video Ad (.MP4)', tag: '1080 × 1920 MP4' },
        { k: '08× DIST', v: 'LinkedIn Card + Story Set + UTM Copy Guide', tag: 'READY TO LAUNCH' },
      ],
    },
  },
  {
    id: 'prompt-01',
    index: '03',
    category: 'PROMPT ARCHITECTURE',
    code: 'COGNITIVE-12 // INSTANT DOWNLOAD',
    title: 'Audit-to-Action SEO & Conversion Prompt Pack',
    oneLiner:
      'Our internal 12-stage prompt engineering chain that turns raw audit findings into sharpened positioning, 5 hub-and-spoke SEO pages, and valid JSON-LD schema.',
    price: '$39',
    terms: 'One-time purchase · Works with Claude, ChatGPT & Gemini',
    stripeUrl: 'https://buy.stripe.com/eVq14mezXeWCbwzg4lebu0c',
    ctaLabel: 'Acquire Prompt Pack — $39',
    specs: [
      'Stages 01–04: Above-the-Fold Value Proposition Compression & Anti-Cliché Voice Filter',
      'Stages 05–08: 5-Spoke Programmatic SEO Page Architect & Search-Intent Keyword Mapper',
      'Stages 09–12: Schema.org JSON-LD Generator, Objection Rebuttal Matrix & CTA Calibrator',
      'Includes real before/after input-output exemplars from production Context & Muse builds',
    ],
    specimen: {
      header: 'SPECIMEN // 12-STAGE COGNITIVE PIPELINE ARCHITECTURE',
      stamp: '12 ENGINEERED PROMPTS · ZERO FLUFF',
      rows: [
        { k: 'STAGE 01–03', v: 'Positioning Compression & Cliché Purge', tag: 'VOICE ENGINE' },
        { k: 'STAGE 04–06', v: 'Above-the-Fold Hero & Proof Restructuring', tag: 'CONVERSION' },
        { k: 'STAGE 07–09', v: '5-Page Hub & Spoke SEO Content Architect', tag: 'ORGANIC SEARCH' },
        { k: 'STAGE 10–12', v: 'JSON-LD Schema & Technical Meta Compiler', tag: 'STRUCTURED DATA' },
      ],
    },
  },
  {
    id: 'fix-seo',
    index: '04',
    category: '1-CLICK AUDIT REMEDIATION',
    code: 'LAYER 05 FIX // TURNKEY TECHNICAL DELIVERY',
    title: 'Optimize My SEO & Rich Schema Fix Pack',
    oneLiner:
      'We repair your website’s missing or truncated titles, meta descriptions, canonical tags, sitemap, Open Graph cards, and deploy custom JSON-LD structured data.',
    price: '$149',
    terms: 'Fixed-scope turnkey remediation · Delivered as drop-in code or direct PR',
    stripeUrl: 'https://buy.stripe.com/4gMbJ077v5m2bwz05nebu08',
    ctaLabel: 'Order SEO & Schema Fix — $149',
    specs: [
      'Custom Schema.org JSON-LD injection (LocalBusiness, Product, SoftwareApplication, FAQPage)',
      'Rewritten high-CTR <title> and <meta name="description"> hierarchy across key routes',
      'Validated XML Sitemap, clean robots.txt directives, and canonical URL deduplication',
      'Custom 1200×630 Open Graph & X/Twitter share card so links never preview blank',
    ],
    specimen: {
      header: 'SPECIMEN // TECHNICAL SEARCH & JSON-LD REMEDIATION DIFF',
      stamp: 'AUDIT LAYER 05 · TURNKEY FIX',
      rows: [
        { k: '<title>', v: 'Intent-calibrated title hierarchy (50–60 chars)', tag: 'FIXED' },
        { k: 'JSON-LD', v: 'Validated @graph: Organization + Product + FAQ', tag: 'INJECTED' },
        { k: 'OG:IMAGE', v: '1200×630 High-Contrast Social Share Plate', tag: 'GENERATED' },
        { k: 'INDEXING', v: 'sitemap.xml + robots.txt + rel="canonical"', tag: 'VERIFIED' },
      ],
    },
  },
  {
    id: 'fix-ux',
    index: '05',
    category: '48–72H CONVERSION SPRINT',
    code: 'LAYERS 01–03 FIX // RAPID UX INTERVENTION',
    title: 'Web Refinement & Conversion Quick-Win Sprint',
    oneLiner:
      'A focused 48–72 hour surgical upgrade to your existing website’s hero headline, mobile call/quote action bar, tap targets, and lead-capture form friction.',
    price: '$295',
    terms: 'Fixed-scope 48–72h sprint · No full rebuild required',
    stripeUrl: 'https://buy.stripe.com/8x2bJ077v01I9org4lebu09',
    ctaLabel: 'Book Conversion Sprint — $295',
    highlighted: true,
    specs: [
      'Above-the-fold headline, subheadline, and primary CTA rewrite for 3-second clarity',
      'Installation of a thumb-friendly sticky mobile Call / Quote / Book action bar',
      'Remediation of 390px mobile horizontal overflow, cramped tap targets, and layout shifts',
      'Lead form simplification to eliminate drop-off and route inquiries cleanly',
    ],
    specimen: {
      header: 'SPECIMEN // ABOVE-THE-FOLD & 390PX MOBILE CONVERSION INTERVENTION',
      stamp: '48–72H TURNAROUND · HIGHEST ROI',
      rows: [
        { k: 'HERO-01', v: '3-Second Value Proposition & Primary CTA Lock', tag: 'REWRITTEN' },
        { k: 'MOB-390', v: 'Sticky Thumb-Zone Call / Quote Action Bar', tag: 'INSTALLED' },
        { k: 'UX-TAP', v: '48×48px Minimum Touch Targets & Zero Overflow', tag: 'REMEDIATED' },
        { k: 'FORM-01', v: 'Low-Friction Lead Intake & Instant Confirmation', tag: 'STREAMLINED' },
      ],
    },
  },
  {
    id: 'fix-diagnostic',
    index: '06',
    category: 'DIAGNOSTIC + REDESIGN DEPOSIT',
    code: 'LAYERS 02 & 04 // 100% CREDITED TOWARD CUSTOM BUILD',
    title: 'Business System Diagnostic & Web Redesign Deposit',
    oneLiner:
      'A direct human teardown of your website, quote flow, and operational bottlenecks by Jayme Volstad—100% credited ($395) toward any $2,500+ Custom Build.',
    price: '$395',
    terms: '100% credited toward Custom Build · Includes $79 Document Dossier free',
    stripeUrl: 'https://buy.stripe.com/9B69AScrP7ua1VZ4lDebu0d',
    ctaLabel: 'Book Diagnostic & Deposit — $395',
    specs: [
      'Line-by-line architectural teardown of your live site, positioning, and conversion leaks',
      'Prioritized P0 / P1 / P2 Remediation Matrix + custom wireframe & architecture blueprint',
      'Full $395 fee is credited dollar-for-dollar toward a Custom Build commission ($2,500+)',
      'Includes immediate complimentary download of the $79 Branded Business Document Set',
    ],
    specimen: {
      header: 'SPECIMEN // P0/P1/P2 ARCHITECTURAL TEARDOWN & BUILD CREDIT',
      stamp: '100% CREDITED TO CUSTOM BUILD',
      rows: [
        { k: 'P0 CRITICAL', v: 'Conversion Leaks, Broken Flows & Trust Gaps', tag: 'HUMAN AUDIT' },
        { k: 'P1 SYSTEM', v: 'Information Architecture & Copy Blueprint', tag: 'WIREFRAMED' },
        { k: 'BONUS KIT', v: 'Branded Business Document & SOW Set Included', tag: '$79 VALUE FREE' },
        { k: 'CREDIT', v: '100% ($395) Applied to Custom Build Commission', tag: 'ZERO RISK' },
      ],
    },
  },
];

export default function Blueprints() {
  const [activeViewId, setActiveViewId] = useState('studio-hud');
  const [activeBoardId, setActiveBoardId] = useState('board-01');
  const [selectedTierId, setSelectedTierId] = useState('tier-2');

  const activeView =
    SHOWPIECE_VIEWS.find((v) => v.id === activeViewId) || SHOWPIECE_VIEWS[0];
  const activeBoard =
    FIGMA_SYSTEM_BOARDS.find((b) => b.id === activeBoardId) ||
    FIGMA_SYSTEM_BOARDS[0];
  const selectedTier =
    SHOWPIECE_LICENSES.find((t) => t.id === selectedTierId) ||
    SHOWPIECE_LICENSES[1];

  const scrollToSection = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#F2ECE1] text-[#141817] font-sans selection:bg-[#E5E750] selection:text-[#141817]"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(20,24,23,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,24,23,0.045) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
      }}
    >
      {/* Shared Studio Header */}
      <SiteHeader />

      {/* =====================================================================
          ARCHITECTURAL INDEX SUB-BAR — Quiet, disciplined wayfinding
         ===================================================================== */}
      <div className="border-b border-[#141817]/25 bg-[#EAE3D5]/90 backdrop-blur-sm px-4 py-2.5 sm:px-8">
        <div className="mx-auto max-w-[1400px] flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-wider">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <Link
              to="/"
              data-testid="blueprints-back-to-studio"
              className="inline-flex items-center gap-1.5 font-bold uppercase text-[#141817] hover:text-[#E34232] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Main Studio</span>
            </Link>
            <span className="text-[#141817]/30">/</span>
            <span className="font-bold uppercase text-[#123F38]">
              02 · BLUEPRINTS EDITION ARCHIVE
            </span>
            <nav
              aria-label="Storefront movements"
              className="hidden lg:flex items-center gap-5 pl-2 text-[#141817]/75"
            >
              <button
                type="button"
                onClick={() => scrollToSection('#movement-showpiece')}
                className="hover:text-[#141817] cursor-pointer transition-colors"
              >
                01 / Flagship Website Studio
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('#movement-design-system')}
                className="hover:text-[#141817] cursor-pointer transition-colors"
              >
                02 / 5-Board Figma &amp; Vector System
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('#movement-collection')}
                className="hover:text-[#141817] cursor-pointer transition-colors"
              >
                03 / Practical Tools &amp; Sprints
              </button>
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/build"
              className="text-[#141817]/80 hover:text-[#141817] underline underline-offset-4 transition-colors"
            >
              Need a tailored commission? 01 / Custom Build →
            </Link>
            <a
              href="https://blueprints.contextmuse.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[#141817] bg-[#FAF8F3] px-2.5 py-1 font-bold uppercase text-[#141817] hover:bg-[#141817] hover:text-[#F2ECE1] transition-colors"
            >
              <KeyRound className="h-3 w-3" />
              <span>Restore Purchase</span>
            </a>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* ===================================================================
            MOVEMENT I — THE EDITORIAL HERO
            Controlled visual intensity, dramatic scale, generous negative space,
            and one art-directed digital exhibit preview.
           =================================================================== */}
        <section className="relative border-b-[2px] border-[#141817] px-4 pt-10 pb-16 sm:px-8 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-28 overflow-hidden">
          <div className="mx-auto max-w-[1400px]">
            {/* Top Swiss Technical Datum Line */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#141817]/20 pb-4 mb-10 sm:mb-14 font-mono text-[11px] uppercase tracking-[0.14em] text-[#141817]/70">
              <div className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 bg-[#E34232]" aria-hidden="true" />
                <span className="font-bold text-[#141817]">
                  CONTEXT &amp; MUSE // DEPARTMENT 02 — DIGITAL ARTIFACTS &amp; SYSTEMS
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span>EDITION ARCHIVE: 09 PUBLISHED WORKS</span>
                <span className="hidden sm:inline">OWNERSHIP: PERPETUAL / ZERO SUBSCRIPTION</span>
              </div>
            </div>

            {/* Asymmetric Architectural Hero Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
              {/* Left 5 Columns: Monumental Editorial Statement + Restrained Controls */}
              <div className="lg:col-span-5 flex flex-col justify-between lg:pr-4">
                <div>
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#123F38] mb-4">
                    MANIFESTO &amp; STOREFRONT // VOL. 01
                  </div>

                  <h1 className="font-display text-[clamp(2.35rem,3.85vw,4.15rem)] font-black uppercase leading-[0.91] tracking-[-0.03em] text-[#141817]">
                    <span className="block">GOOD DESIGN</span>
                    <span className="block mt-1">DOESN’T ASK</span>
                    <span className="inline-block bg-[#141817] text-[#F2ECE1] px-3 py-1 mt-2 border-l-[6px] border-[#E34232]">
                      PERMISSION.
                    </span>
                  </h1>

                  <p className="mt-7 font-sans text-base sm:text-[17px] text-[#141817]/85 leading-[1.65] max-w-xl">
                    Ready-to-deploy website systems, editable 1440px Figma master kits, archival business dossiers, and fixed-scope website improvements. Built by an independent design studio for creators and operators who refuse to look like a template.
                  </p>
                </div>

                {/* Primary CTA (Acid Yellow reserved strictly for primary action) + Discreet Secondary Link */}
                <div className="mt-9 pt-7 border-t border-[#141817]/20 space-y-5">
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => scrollToSection('#movement-showpiece')}
                      data-testid="hero-explore-showpiece-cta"
                      className="inline-flex items-center gap-3 border-[2px] border-[#141817] bg-[#E5E750] px-6 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#141817] shadow-[5px_5px_0_#141817] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_#141817] transition-all cursor-pointer"
                    >
                      <span>Inspect Flagship Studio — From $49</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => scrollToSection('#movement-collection')}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#141817] hover:text-[#E34232] underline underline-offset-4 py-2 cursor-pointer transition-colors"
                    >
                      <span>View All 9 Systems &amp; Tools</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Quiet Technical Index Ledger */}
                  <div className="grid grid-cols-3 gap-4 pt-3 font-mono text-[11px]">
                    <div>
                      <div className="text-[#141817]/55 uppercase">01 / SHOWPIECE</div>
                      <div className="font-bold text-[#141817] mt-0.5">Browser Studio ($49)</div>
                    </div>
                    <div className="border-l border-[#141817]/20 pl-3">
                      <div className="text-[#141817]/55 uppercase">02 / SYSTEM</div>
                      <div className="font-bold text-[#141817] mt-0.5">5-Board Figma ($89)</div>
                    </div>
                    <div className="border-l border-[#141817]/20 pl-3">
                      <div className="text-[#141817]/55 uppercase">03 / COLLECTION</div>
                      <div className="font-bold text-[#141817] mt-0.5">Tools &amp; Fixes ($39+)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 7 Columns: Art-Directed Digital Exhibit Preview (One Existing Product Showcased like a Museum Object) */}
              <div className="lg:col-span-7 relative">
                {/* Technical Annotation Bar Above Exhibit */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#141817]/70">
                  <span>EXHIBIT 01 // LITERARY BRUTALISM WEBSITE STUDIO (1440PX LIVE CAPTURE)</span>
                  <span className="text-[#123F38] font-bold">5 NICHES · 7 PAGES · 23 SVGS</span>
                </div>

                {/* Primary Oversized Browser Specimen Window */}
                <div className="relative border-[2.5px] border-[#141817] bg-[#141817] shadow-[12px_12px_0_#141817]">
                  {/* Industrial Browser Chrome */}
                  <div className="flex items-center justify-between gap-3 border-b-[2px] border-[#141817] bg-[#141817] px-3.5 py-2.5 text-[#F2ECE1]">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E34232]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E5E750]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#F2ECE1]/30" />
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-[#E5E750] font-bold">
                        ATELIER STUDIO HUD // LIVE 1440PX WORKSPACE
                      </span>
                    </div>
                    <a
                      href="https://blueprints.contextmuse.com/literarybrutalism"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#F2ECE1]/80 hover:text-[#E5E750] transition-colors"
                    >
                      <span>Open Live Spec</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Uncropped High-Resolution 1440px Studio Screenshot */}
                  <div className="relative bg-[#F0E8D9] overflow-hidden">
                    <img
                      src="/assets/captures/blueprints/1440px_desktop_landing_studio.png"
                      alt="Literary Brutalism Website Studio live 1440px interface showing the top customization HUD and brutalist editorial landing page"
                      className="w-full h-auto block"
                    />
                  </div>

                  {/* Subtle Architectural Footnote Strip inside Specimen */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F2ECE1]/15 bg-[#141817] px-4 py-2.5 font-mono text-[10.5px] text-[#F2ECE1]/85">
                    <span>
                      FIG. 01A — Self-contained HTML visual editor + static .ZIP compiler
                    </span>
                    <span className="text-[#E5E750] font-bold">
                      $49 STANDARD / $89 COMPLETE / $199 AGENCY
                    </span>
                  </div>
                </div>

                {/* Compositional Interruption: Overlapping 390px Mobile & Audio Reader Detail Card */}
                <div className="mt-6 sm:mt-0 sm:absolute sm:-bottom-10 sm:-left-6 z-10 max-w-[330px] border-[2px] border-[#141817] bg-[#FAF8F3] p-3.5 shadow-[6px_6px_0_#E34232]">
                  <div className="flex items-center justify-between gap-2 border-b border-[#141817]/20 pb-1.5 mb-2 font-mono text-[9.5px] font-bold uppercase tracking-wider">
                    <span className="text-[#E34232]">● FIG. 01B // BUILT-IN AUDIO &amp; READER</span>
                    <span className="text-[#141817]/60">EXCERPT.HTML</span>
                  </div>
                  <div className="border border-[#141817] bg-[#F0E8D9] overflow-hidden mb-2">
                    <img
                      src="/assets/captures/blueprints/1440px_desktop_excerpt_audio.png"
                      alt="Close-up preview of the Chapter Excerpt Reader and native HTML5 audio player"
                      className="w-full h-24 object-cover object-top block"
                    />
                  </div>
                  <p className="font-mono text-[10px] leading-snug text-[#141817]/85">
                    Includes long-form chapter/transcript reader paired with a native MP3/WAV audio sample bar and direct Stripe edition cards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            MOVEMENT II — FEATURED PRODUCT: THE SHOWPIECE
            Oversized major design release section for Literary Brutalism Website Studio
           =================================================================== */}
        <section
          id="movement-showpiece"
          className="scroll-mt-16 border-b-[2px] border-[#141817] px-4 py-16 sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-[1400px]">
            {/* Editorial Release Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b-[2px] border-[#141817] pb-8 mb-12">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#123F38] mb-3">
                  <span>01 / FEATURED RELEASE — THE SHOWPIECE</span>
                  <span className="text-[#141817]/35">//</span>
                  <span className="text-[#E34232]">EDITION #001</span>
                </div>
                <h2 className="font-display text-[clamp(2.1rem,4.3vw,4.1rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-[#141817]">
                  LITERARY BRUTALISM WEBSITE STUDIO
                </h2>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <p className="font-serif italic text-xl sm:text-2xl text-[#141817]/85 leading-snug">
                  “A self-contained browser design studio that exports a finished, zero-dependency multi-page website in one click.”
                </p>
              </div>
            </div>

            {/* Interactive 6-View High-Resolution Exhibition Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Left 4 Columns: View Selector & Architectural Callouts */}
              <div className="lg:col-span-4 space-y-6">
                <div>
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[#141817]/65 mb-3">
                    INSPECT REAL 1440PX SYSTEM VIEWS (06)
                  </div>

                  <div
                    role="tablist"
                    aria-label="Literary Brutalism Studio views"
                    className="border-t border-[#141817]"
                  >
                    {SHOWPIECE_VIEWS.map((view) => {
                      const isActive = view.id === activeView.id;
                      return (
                        <button
                          key={view.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          data-testid={`showpiece-view-tab-${view.id}`}
                          onClick={() => setActiveViewId(view.id)}
                          className={`w-full text-left border-b border-[#141817] px-4 py-3.5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isActive
                              ? 'bg-[#141817] text-[#F2ECE1]'
                              : 'bg-[#FAF8F3]/70 text-[#141817] hover:bg-[#EAE3D5]'
                          }`}
                        >
                          <div className="flex items-baseline gap-3">
                            <span
                              className={`font-mono text-xs font-bold ${
                                isActive ? 'text-[#E5E750]' : 'text-[#141817]/50'
                              }`}
                            >
                              {view.num}
                            </span>
                            <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-wider">
                              {view.label}
                            </span>
                          </div>
                          <ArrowRight
                            className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                              isActive
                                ? 'text-[#E5E750] translate-x-0.5'
                                : 'text-[#141817]/35'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active View Technical Description Card */}
                <div className="border-[2px] border-[#141817] bg-[#FAF8F3] p-5">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#123F38]">
                    {activeView.meta}
                  </div>
                  <h3 className="mt-1.5 font-display text-xl font-black uppercase text-[#141817]">
                    {activeView.num} // {activeView.label}
                  </h3>
                  <p className="mt-2.5 font-sans text-sm text-[#141817]/85 leading-relaxed">
                    {activeView.caption}
                  </p>
                  <ul className="mt-4 space-y-2 border-t border-[#141817]/15 pt-3.5">
                    {activeView.callouts.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 font-mono text-[11px] text-[#141817]/90 leading-snug"
                      >
                        <span className="font-bold text-[#123F38]">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4 Built-In Niche Architecture Modes Summary */}
                <div className="border border-[#141817]/30 bg-[#EAE3D5]/60 p-5">
                  <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#141817] mb-3">
                    INCLUDED NICHE ARCHITECTURES &amp; LIVE SPECS
                  </div>
                  <div className="space-y-3">
                    {NICHE_ARCHITECTURES.map((niche) => (
                      <div
                        key={niche.id}
                        className="flex items-center justify-between gap-2 border-b border-[#141817]/15 pb-2.5 last:border-b-0 last:pb-0"
                      >
                        <div>
                          <div className="font-mono text-xs font-bold text-[#141817]">
                            {niche.num}. {niche.name}
                          </div>
                          <div className="font-mono text-[10px] text-[#141817]/65">
                            {niche.paletteName}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center -space-x-1" aria-label={niche.paletteName}>
                            {niche.swatches.map((hex, i) => (
                              <span
                                key={i}
                                className="inline-block h-3.5 w-3.5 border border-[#141817]"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                          <a
                            href={niche.specUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] font-bold uppercase underline underline-offset-2 text-[#123F38] hover:text-[#E34232] ml-1"
                          >
                            Spec ↗
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 8 Columns: Uncropped High-Resolution Product Stage */}
              <div className="lg:col-span-8">
                <div className="border-[2.5px] border-[#141817] bg-[#141817] shadow-[10px_10px_0_#141817]">
                  {/* Stage Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-[2px] border-[#141817] bg-[#141817] px-4 py-3 text-[#F2ECE1] font-mono text-[11px]">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-block h-2 w-2 bg-[#E5E750]" />
                      <span className="font-bold uppercase tracking-wider text-[#F2ECE1]">
                        {activeView.urlBar}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-[#E5E750]">
                      VIEW {activeView.num} OF 06 · REAL CAPTURE
                    </span>
                  </div>

                  {/* Viewport Frame — Tall enough to celebrate the design, scrollable for full-page inspection */}
                  <div className="relative max-h-[640px] overflow-y-auto bg-[#F0E8D9] scrollbar-thin">
                    <img
                      src={activeView.src}
                      alt={activeView.alt}
                      className="w-full h-auto block"
                    />
                  </div>

                  {/* Stage Footer Bar with Direct Action & Scroll Hint */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#F2ECE1]/15 bg-[#141817] px-5 py-3.5 text-[#F2ECE1]">
                    <div className="font-mono text-[11px] text-[#F2ECE1]/80">
                      <span className="text-[#E5E750] font-bold">TIP:</span> Scroll inside the specimen frame above to inspect the full 1440px vertical layout.
                    </div>
                    <a
                      href="https://blueprints.contextmuse.com/literarybrutalism"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#E5E750] hover:underline underline-offset-4"
                    >
                      <span>Open Full Interactive Specification</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ===============================================================
                SHOWPIECE LICENSE LEDGER — Clean architectural table replacing
                repetitive promo cards. Acid yellow reserved for primary choice.
               =============================================================== */}
            <div className="mt-16 pt-12 border-t-[2px] border-[#141817]">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <div>
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[#123F38]">
                    ACQUISITION &amp; LICENSING // LITERARY BRUTALISM EDITION #001
                  </div>
                  <h3 className="mt-1 font-display text-2xl sm:text-3xl font-black uppercase text-[#141817]">
                    SELECT YOUR STUDIO EDITION
                  </h3>
                </div>
                <p className="font-mono text-xs text-[#141817]/75">
                  Instant permanent license key + offline .ZIP download unlocked immediately after Stripe checkout.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 border-[2px] border-[#141817] bg-[#FAF8F3] divide-y-[2px] lg:divide-y-0 lg:divide-x-[2px] divide-[#141817]">
                {SHOWPIECE_LICENSES.map((tier) => {
                  const isSelected = selectedTier.id === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`p-6 sm:p-8 flex flex-col justify-between transition-colors ${
                        tier.primary
                          ? 'bg-[#141817] text-[#F2ECE1]'
                          : 'bg-[#FAF8F3] text-[#141817]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 font-mono text-[10.5px] font-bold uppercase tracking-wider">
                          <span
                            className={
                              tier.primary ? 'text-[#E5E750]' : 'text-[#123F38]'
                            }
                          >
                            {tier.code}
                          </span>
                          {tier.badge && (
                            <span className="bg-[#E34232] text-[#F2ECE1] px-2 py-0.5 text-[9.5px]">
                              {tier.badge}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-current/15 pb-4">
                          <h4 className="font-display text-xl sm:text-2xl font-black uppercase leading-tight">
                            {tier.name}
                          </h4>
                          <span
                            className={`font-display text-4xl sm:text-5xl font-black tracking-tight shrink-0 ${
                              tier.primary ? 'text-[#E5E750]' : 'text-[#141817]'
                            }`}
                          >
                            {tier.price}
                          </span>
                        </div>

                        <div
                          className={`mt-2 font-mono text-[11px] ${
                            tier.primary ? 'text-[#F2ECE1]/70' : 'text-[#141817]/65'
                          }`}
                        >
                          {tier.terms}
                        </div>

                        <p
                          className={`mt-4 font-sans text-sm leading-relaxed ${
                            tier.primary ? 'text-[#F2ECE1]/90' : 'text-[#141817]/85'
                          }`}
                        >
                          {tier.summary}
                        </p>

                        <ul className="mt-5 space-y-2.5 font-mono text-xs">
                          {tier.specs.map((spec, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <Check
                                className={`h-4 w-4 shrink-0 mt-0.5 ${
                                  tier.primary ? 'text-[#E5E750]' : 'text-[#123F38]'
                                }`}
                              />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-8 pt-5 border-t border-current/15 space-y-2.5">
                        <a
                          href={tier.stripeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid={`buy-${tier.id}`}
                          className={`w-full inline-flex items-center justify-center gap-2 border-[2px] px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                            tier.primary
                              ? 'border-[#E5E750] bg-[#E5E750] text-[#141817] hover:bg-[#FAF8F3] hover:border-[#FAF8F3]'
                              : 'border-[#141817] bg-transparent text-[#141817] hover:bg-[#141817] hover:text-[#F2ECE1]'
                          }`}
                        >
                          <span>{tier.ctaLabel}</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>

                        <a
                          href={tier.specUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full inline-flex items-center justify-center gap-1 font-mono text-[11px] uppercase tracking-wider py-1 hover:underline underline-offset-4 ${
                            tier.primary ? 'text-[#F2ECE1]/75' : 'text-[#141817]/70'
                          }`}
                        >
                          <span>Inspect Full Deliverable Spec</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            MOVEMENT III — SECONDARY FEATURE: THE DESIGN SYSTEM
            Dramatic rhythm contrast: Full-bleed Deep Charcoal/Ink (#141817)
            split composition showcasing the actual 5 Figma boards & 23 SVGs.
           =================================================================== */}
        <section
          id="movement-design-system"
          className="scroll-mt-16 border-b-[2px] border-[#141817] bg-[#141817] text-[#F2ECE1] px-4 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-[1400px]">
            {/* Top Rhythm Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F2ECE1]/20 pb-5 mb-12 font-mono text-[11px] uppercase tracking-[0.16em] text-[#F2ECE1]/70">
              <div className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 bg-[#E5E750]" />
                <span className="text-[#E5E750] font-bold">
                  02 / SECONDARY FEATURE — THE DESIGN &amp; VECTOR ARCHITECTURE
                </span>
              </div>
              <span>INCLUDED IN $89 COMPLETE BUNDLE &amp; $199 AGENCY EDITION</span>
            </div>

            {/* Split Composition: Left 7 Cols Board Stage, Right 5 Cols Typography & Token Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left 7 Columns: Interactive Figma Master Board & Vector Sheet Viewer */}
              <div className="lg:col-span-7 space-y-5">
                {/* Board Selector Bar */}
                <div
                  role="tablist"
                  aria-label="Figma Master Boards"
                  className="grid grid-cols-2 sm:grid-cols-5 gap-2"
                >
                  {FIGMA_SYSTEM_BOARDS.map((board, index) => {
                    const isActive = board.id === activeBoard.id;
                    return (
                      <button
                        key={board.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        data-testid={`figma-board-tab-${board.id}`}
                        onClick={() => setActiveBoardId(board.id)}
                        className={`text-left border px-3 py-2.5 font-mono transition-all cursor-pointer ${
                          isActive
                            ? 'border-[#E5E750] bg-[#E5E750] text-[#141817]'
                            : 'border-[#F2ECE1]/25 bg-[#1D2321] text-[#F2ECE1] hover:border-[#F2ECE1]/60'
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wider">
                          {index === 4 ? 'SHEET 05' : `BOARD 0${index + 1}`}
                        </div>
                        <div className="text-[11px] font-bold mt-0.5">
                          {board.shortLabel}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* High-Resolution Uncropped Board Frame */}
                <div className="border-[2px] border-[#F2ECE1]/30 bg-[#0D100F] shadow-[10px_10px_0_#123F38]">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2ECE1]/20 px-4 py-3 font-mono text-[11px]">
                    <span className="font-bold text-[#E5E750]">
                      {activeBoard.code}
                    </span>
                    <span className="text-[#F2ECE1]/65 text-[10px]">
                      {activeBoard.dimensions}
                    </span>
                  </div>

                  <div className="max-h-[580px] overflow-y-auto bg-[#F0E8D9]">
                    <img
                      src={activeBoard.src}
                      alt={activeBoard.alt}
                      className="w-full h-auto block"
                    />
                  </div>

                  <div className="border-t border-[#F2ECE1]/20 px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <p className="font-sans text-xs sm:text-sm text-[#F2ECE1]/85 max-w-xl">
                      {activeBoard.caption}
                    </p>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#E5E750]">
                      UNCROPPED 1440PX SHEET
                    </span>
                  </div>
                </div>
              </div>

              {/* Right 5 Columns: Editorial Typography, Token Architecture & Direct Acquisition */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                <div>
                  <div className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[#E5E750] mb-3">
                    5 CONSOLIDATED 1440PX BOARDS + 23 RAW SVGS
                  </div>

                  <h2 className="font-display text-[clamp(2rem,3.6vw,3.4rem)] font-black uppercase leading-[0.93] tracking-[-0.025em] text-[#F2ECE1]">
                    ARCHITECTED IN FIGMA. BOUND TO CSS TOKENS.
                  </h2>

                  <p className="mt-5 font-sans text-base text-[#F2ECE1]/80 leading-relaxed">
                    Most templates hand you flattened screenshots or locked components. The Complete Bundle ($89) gives you the entire 5-board 1440px Figma design system alongside 23 raw, CSS-tokenized vector illustrations that recolor automatically across every palette.
                  </p>

                  {/* 7-Token Semantic Variable Ledger */}
                  <div className="mt-7 border border-[#F2ECE1]/25 bg-[#1B211F] p-5">
                    <div className="flex items-center justify-between font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#E5E750] mb-3">
                      <span>SEMANTIC CSS &amp; FIGMA TOKEN ARCHITECTURE</span>
                      <span>7 VARIABLES</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                      {[
                        { token: '--ink', hex: '#141414' },
                        { token: '--bone', hex: '#F0E8D9' },
                        { token: '--paper', hex: '#E3DAC9' },
                        { token: '--scarlet', hex: '#E34232' },
                        { token: '--acid', hex: '#E5E750' },
                        { token: '--blue', hex: '#8DB8C2' },
                        { token: '--lilac', hex: '#C7B8EA' },
                      ].map((item) => (
                        <div key={item.token} className="text-center">
                          <div
                            className="h-9 w-full border border-[#F2ECE1]/40"
                            style={{ backgroundColor: item.hex }}
                          />
                          <div className="mt-1.5 font-mono text-[9.5px] font-bold text-[#F2ECE1]">
                            {item.token}
                          </div>
                          <div className="font-mono text-[8.5px] text-[#F2ECE1]/55">
                            {item.hex}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key System Deliverables List */}
                  <div className="mt-6 space-y-3 border-t border-[#F2ECE1]/15 pt-5 font-mono text-xs text-[#F2ECE1]/90">
                    <div className="flex items-start gap-3">
                      <span className="text-[#E5E750] font-bold">01</span>
                      <span>
                        <strong>Board 01–04 (1440px + 390px):</strong> Foundations, Flagship Desktop Landing, all 6 Inner Page Templates, and 5 Niche Variations.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[#E5E750] font-bold">02</span>
                      <span>
                        <strong>23 Standalone .SVG Illustrations:</strong> Botanical studies, architectural diagrams, tarot emblems, and brutalist stamps.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-[#E5E750] font-bold">03</span>
                      <span>
                        <strong>Zero Lock-In:</strong> Duplicate directly from our master Figma link or drag the included local SVG master sheets into any workspace.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acquisition Box for the Design System Bundle */}
                <div className="border-[2px] border-[#E5E750] bg-[#1D2321] p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#E5E750]">
                        COMPLETE STUDIO + FIGMA + 23-SVG BUNDLE
                      </div>
                      <div className="font-mono text-xs text-[#F2ECE1]/70 mt-0.5">
                        Includes Online/Offline Browser Studio + All 5 Figma Boards
                      </div>
                    </div>
                    <div className="font-display text-4xl font-black text-[#E5E750]">
                      $89
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://buy.stripe.com/5kQ5kC4Zn9CifMP19rebu01"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[#E5E750] px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#141817] hover:bg-[#FAF8F3] transition-colors"
                    >
                      <span>Acquire Complete Bundle — $89</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <a
                      href="https://blueprints.contextmuse.com/brutalist-figma-svg-kit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 border border-[#F2ECE1]/40 px-4 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#F2ECE1] hover:border-[#E5E750] hover:text-[#E5E750] transition-colors"
                    >
                      <span>Full Spec</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            MOVEMENT IV — PRACTICAL TOOLS: THE COLLECTION
            Disciplined, museum-grade Swiss architectural index for the 6 utility
            products and fixed-scope website audit remediations. Zero clipped
            promo thumbnails; every item follows the 6-part product hierarchy.
           =================================================================== */}
        <section
          id="movement-collection"
          className="scroll-mt-16 border-b-[2px] border-[#141817] px-4 py-16 sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-[1400px]">
            {/* Collection Section Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b-[2px] border-[#141817] pb-8 mb-12">
              <div className="lg:col-span-7">
                <div className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#123F38] mb-2.5">
                  03 / PRACTICAL TOOLS &amp; FIXED-SCOPE IMPROVEMENTS — THE COLLECTION
                </div>
                <h2 className="font-display text-[clamp(2rem,4vw,3.6rem)] font-black uppercase leading-[0.94] tracking-[-0.03em] text-[#141817]">
                  FOCUSED SYSTEMS, DOSSIERS &amp; 1-CLICK REMEDIATIONS
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="font-sans text-base text-[#141817]/80 leading-relaxed">
                  Not every problem requires a new website. Purchase standalone business document kits, 25-asset campaign packs, cognitive prompt chains, or fixed-scope technical sprints to upgrade your existing site in 48–72 hours.
                </p>
              </div>
            </div>

            {/* Disciplined 2-Column Architectural Specimen Grid (6 Products) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {PRACTICAL_COLLECTION.map((item) => (
                <article
                  key={item.id}
                  data-testid={`collection-item-${item.id}`}
                  className={`border-[2px] border-[#141817] flex flex-col justify-between transition-all ${
                    item.highlighted
                      ? 'bg-[#FAF8F3] shadow-[8px_8px_0_#123F38]'
                      : 'bg-[#FAF8F3] shadow-[5px_5px_0_#141817]'
                  }`}
                >
                  <div>
                    {/* Top Classification & Price Header */}
                    <div className="flex items-center justify-between gap-3 border-b-[2px] border-[#141817] bg-[#EAE3D5] px-5 py-3 font-mono text-[11px]">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-[#141817]">
                          NO. {item.index}
                        </span>
                        <span className="text-[#141817]/35">//</span>
                        <span className="font-bold uppercase tracking-wider text-[#123F38]">
                          {item.category}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#141817]/70">
                        {item.code}
                      </span>
                    </div>

                    {/* Main Body: 1. Name, 2. One-Sentence Explanation, 5. Price & Terms */}
                    <div className="p-6 sm:p-7">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-2xl sm:text-[26px] font-black uppercase leading-[1.05] text-[#141817]">
                          {item.title}
                        </h3>
                        <div className="text-right shrink-0">
                          <div className="font-display text-3xl sm:text-4xl font-black text-[#141817] leading-none">
                            {item.price}
                          </div>
                        </div>
                      </div>

                      <div className="mt-1.5 font-mono text-[11px] text-[#123F38] font-bold">
                        {item.terms}
                      </div>

                      <p className="mt-3.5 font-sans text-sm sm:text-[15px] text-[#141817]/85 leading-relaxed">
                        {item.oneLiner}
                      </p>

                      {/* 3. Unclipped Technical Specimen Preview Sheet (Zero Cropped Promo Graphics) */}
                      <div className="mt-6 border-[1.5px] border-[#141817] bg-[#F2ECE1]">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#141817] bg-[#141817] px-3.5 py-2 font-mono text-[10px] text-[#F2ECE1]">
                          <span className="font-bold uppercase tracking-wider">
                            {item.specimen.header}
                          </span>
                          <span className="text-[#E5E750] font-bold">
                            {item.specimen.stamp}
                          </span>
                        </div>
                        <div className="divide-y divide-[#141817]/15 px-3.5 py-1 font-mono text-[11px]">
                          {item.specimen.rows.map((row, rIdx) => (
                            <div
                              key={rIdx}
                              className="flex items-center justify-between gap-3 py-2"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="font-bold text-[#123F38] shrink-0">
                                  {row.k}
                                </span>
                                <span className="text-[#141817] truncate">
                                  {row.v}
                                </span>
                              </div>
                              <span className="shrink-0 border border-[#141817]/30 bg-[#FAF8F3] px-1.5 py-0.5 text-[9.5px] font-bold text-[#141817]">
                                {row.tag}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. Three to Four Meaningful Technical Specifications */}
                      <ul className="mt-5 space-y-2 font-mono text-xs text-[#141817]/90">
                        {item.specs.map((spec, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2">
                            <span className="font-bold text-[#123F38]">•</span>
                            <span className="leading-snug">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 6. Unmistakable Purchase Action Footer */}
                  <div className="border-t-[2px] border-[#141817] bg-[#EAE3D5]/65 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#141817]/75">
                      STRIPE VERIFIED CHECKOUT · INSTANT RECEIPT
                    </span>
                    <a
                      href={item.stripeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`buy-${item.id}`}
                      className={`inline-flex items-center gap-2 border-[2px] border-[#141817] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                        item.highlighted
                          ? 'bg-[#E5E750] text-[#141817] shadow-[3px_3px_0_#141817] hover:bg-[#141817] hover:text-[#E5E750]'
                          : 'bg-[#141817] text-[#F2ECE1] hover:bg-[#E5E750] hover:text-[#141817]'
                      }`}
                    >
                      <span>{item.ctaLabel}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            MOVEMENT V — ARCHITECTURAL CONTINUITY & CUSTOM BUILD BRIDGE
            Quiet, authoritative colophon distinguishing ready-made Blueprints
            from tailored Custom Build commissions and The Method.
           =================================================================== */}
        <section className="px-4 py-16 sm:px-8 sm:py-20 bg-[#EAE3D5]">
          <div className="mx-auto max-w-[1400px] border-[2px] border-[#141817] bg-[#FAF8F3] p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3">
                <div className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#123F38]">
                  STUDIO CONTINUITY // BLUEPRINTS VS. CUSTOM COMMISSION
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-black uppercase leading-tight text-[#141817]">
                  NEED BESPOKE ARCHITECTURE INSTEAD OF A READY-MADE SYSTEM?
                </h2>
                <p className="font-sans text-base text-[#141817]/80 leading-relaxed max-w-2xl">
                  Blueprints are self-contained digital products you can deploy today for $39–$395. When your organization requires custom software architecture, interactive data instruments, or a ground-up flagship build, commission the main Context &amp; Muse studio.
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3.5">
                <Link
                  to="/build"
                  className="inline-flex items-center justify-center gap-2 border-[2px] border-[#141817] bg-[#141817] px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider text-[#F2ECE1] hover:bg-[#E5E750] hover:text-[#141817] transition-colors"
                >
                  <Wrench className="h-4 w-4" />
                  <span>01 / Custom Build</span>
                </Link>
                <Link
                  to="/method"
                  className="inline-flex items-center justify-center gap-2 border-[2px] border-[#141817] bg-[#FAF8F3] px-5 py-4 font-mono text-xs font-bold uppercase tracking-wider text-[#141817] hover:bg-[#EAE3D5] transition-colors"
                >
                  <Compass className="h-4 w-4" />
                  <span>The Method &amp; Pricing</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PageAnnotationOverlay />
      <SiteFooter />
    </div>
  );
}
