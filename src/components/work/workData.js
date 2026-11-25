import { PROJECTS } from '@/data/projects';

export const WORK = PROJECTS.map((p) => ({
  ...p,
  kicker: p.title,
  reel: p.palette || ['#23282A', '#DFDACE', '#D9A62E', '#17504A'],
}));

/**
 * Authentic Screenshot Framing Profiles
 * Preserves full interface legibility without destructive zoom/cropping.
 */
export const WORK_MEDIA_PROFILES = {
  '/assets/captures/wolfridge-live.jpg': {
    figLabel: '01 / LIVE PRODUCTION PLATFORM',
    provenance: 'wolfridgedumpsters.com',
    caption: 'Wolf Ridge Dumpsters — DFW Roll-Off Sizing, Pricing & 48-City Dispatch Intake',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '1122×882',
  },
  '/assets/images/lonewolf-screenshot.webp': {
    figLabel: '01 / PRODUCTION WEB PLATFORM',
    provenance: 'wolfridgedumpsters.com',
    caption: '15 / 20 / 25-Yard Flat-Rate Sizing & 48-City Municipal Intake Interface',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '1600×1000',
  },
  '/assets/images/lonewolf-cover.webp': {
    figLabel: '02 / DISPATCH & SIZING OVERVIEW',
    provenance: 'wolfridgedumpsters.com',
    caption: 'Full-Viewport Production Hero & Service Corridor Navigation',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '1600×1000',
  },
  '/assets/captures/inncontrol-live.jpg': {
    figLabel: '01 / PUBLIC B2B PLATFORM',
    provenance: 'inncontrolcoils.com',
    caption: 'INNcontrol Coils — Nationwide Hotel PTAC Coil Refurbishing & Service Intake',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '1024×798',
  },
  '/assets/images/inncontrol-commercial-platform.webp': {
    figLabel: '01 / PUBLIC B2B PLATFORM',
    provenance: 'inncontrolcoils.com',
    caption: 'Nationwide Hotel PTAC Coil Restoration & Multi-Property Service Intake',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '1440×900',
  },
  '/assets/images/inncontrol-screenshot.webp': {
    figLabel: '02 / INTERNAL OPERATOR HUD',
    provenance: '/inncontrol-v2/',
    caption: 'Floorplan Unit Mapper, Defect Inspector & Parametric Cost Ledger HUD',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '2880×1800',
  },
  '/assets/captures/d2-public-live.jpg': {
    figLabel: '01 / PUBLIC ACQUISITION SITE',
    provenance: 'd2autodetail.com',
    caption: 'Detail Driven (Austin, TX) — Paint Correction, Ceramic Coating & PPF Quote Platform',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '1125×994',
  },
  '/assets/captures/d2-portal-live.png': {
    figLabel: '02 / D2 BUSINESS PORTAL',
    provenance: 'd2autodetail.com/admin.html',
    caption: 'D2 Business Portal — CMS Studio, Order Center, Invoice Builder & Social Ad Creator',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '1005×930',
  },
  '/assets/images/d2autodetail-screenshot.webp': {
    figLabel: '01 / PUBLIC ACQUISITION SITE',
    provenance: 'd2autodetail.com',
    caption: 'Detail Driven — Paint Correction, Ceramic Coating & PPF Quote Intake',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '2160×1350',
  },
  '/assets/images/signal-priority-view.webp': {
    figLabel: '01 / PRIORITY ACTION WORKBENCH',
    provenance: '/signal/demo/',
    caption: 'Cross-Report POS Anomaly Ranking & Shift Velocity Correlation',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '1920×1200',
  },
  '/assets/images/signal_preview_pos.png': {
    figLabel: '02 / PRODUCT OVERVIEW PLATFORM',
    provenance: '/signal/',
    caption: 'Signal Restaurant Operational Intelligence Landing & Pilot Intake',
    cropClass: 'w-full h-full object-contain object-center block',
    naturalResolution: '1024×536',
  },
  '/assets/captures/gensort-live.jpg': {
    figLabel: '01 / LIVE GENSORT WORKSPACE',
    provenance: 'GenSort Live App',
    caption: 'GenSort — Smart Detection Banner, Folder Taxonomy, Color Swatches & Asset Grid',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '933×891',
  },
  '/assets/images/gensort-inspector.webp': {
    figLabel: '02 / AI METADATA INSPECTOR',
    provenance: '/cxm_gensort/',
    caption: 'Local-First Asset Grid, Readiness Score Badge & Binary Prompt Inspector',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '3200×2000',
  },
  '/assets/images/gensort-library.webp': {
    figLabel: '01 / STUDIO ASSET LIBRARY',
    provenance: '/cxm_gensort/',
    caption: '5-Stage Local Browser Curation Workspace & Collection Taxonomy',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '3200×2000',
  },
  '/assets/images/gensort-compare.webp': {
    figLabel: '02 / SIDE-BY-SIDE PARAMETER DIFF',
    provenance: '/cxm_gensort/',
    caption: '64-Bit dHash Visual Comparison & Seed / CFG / Prompt Diff Table',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '3200×2000',
  },
  '/assets/captures/self-cartography-live.jpg': {
    figLabel: '01 / TOPOLOGICAL TERRITORY ATLAS',
    provenance: '/cartography/',
    caption: 'Sequence 00–10 Interactive Territory Map — 00 Defining Self Selected',
    cropClass: 'w-full h-full object-cover object-center block',
    naturalResolution: '1408×968',
  },
  '/assets/images/self_cartography_mockup.jpg': {
    figLabel: '01 / TOPOLOGICAL COORDINATE MAP',
    provenance: '/cartography/',
    caption: '2D Behavioral-Pattern Contour Projection & Vector Weight Territory Map',
    cropClass: 'w-full h-full object-contain object-center block',
    naturalResolution: '1264×848',
  },
  '/assets/images/contest-atlas-cover.webp': {
    figLabel: '01 / SUBMISSION RULES & LEDGER',
    provenance: '/wcsm/',
    caption: 'Automated Weekly Deadline Crawler & Explainable Eligibility Rules Engine',
    cropClass: 'w-full h-full object-contain object-center block',
    naturalResolution: '2400×1500',
  },
  '/assets/images/contest-atlas-hero.webp': {
    figLabel: '01 / CONTEST DIRECTORY & TRACKER',
    provenance: '/wcsm/',
    caption: '60+ Vetted Literary Contests with Multi-Facet Genre & Fee Filtering',
    cropClass: 'w-full h-full object-contain object-center block',
    naturalResolution: '2400×1500',
  },
  '/assets/captures/mapswithteeth-live.jpg': {
    figLabel: '01 / BARRIER-FIRST CIVIC INITIATIVE',
    provenance: 'mapswithteeth.org',
    caption: 'Independent Public-Interest Systems Research & Cross-Jurisdiction Continuity',
    cropClass: 'w-full h-full object-cover object-center block',
    naturalResolution: '1408×968',
  },
  '/assets/images/mapswithteeth-screenshot.webp': {
    figLabel: '01 / BARRIER-FIRST CIVIC INTERFACE',
    provenance: 'mapswithteeth.org',
    caption: 'Cross-Jurisdiction Eligibility Prerequisite Map & Quick-Exit Safety Bar',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '2400×1500',
  },
  '/assets/captures/design-intelligence-live.jpg': {
    figLabel: '01 / THREE-SYSTEM SPECIMEN COMPARISON',
    provenance: '/lab/design-intelligence',
    caption: 'One Specimen · Three Systems (Plaidis / Linear / Stripe) · Measurable Decisions',
    cropClass: 'w-full h-full object-cover object-center block',
    naturalResolution: '1408×968',
  },
  '/assets/images/design-intelligence/exp01_after_desktop.png': {
    figLabel: '01 / PRODUCTION TRANSFER SPECIMEN',
    provenance: '/lab/design-intelligence',
    caption: '85-Node Controlled Token Comparison & Context & Muse Production Transfer',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '1440×900',
  },
  '/assets/captures/edr-live.jpg': {
    figLabel: '01 / BILINGUAL RESERVATION PLATFORM',
    provenance: 'EDR Party Rentals (EN / ES)',
    caption: 'Bilingual English/Spanish Toggle, Date Availability & Surface Safety Triage',
    cropClass: 'w-full h-full object-cover object-center block',
    naturalResolution: '1408×968',
  },
  '/assets/images/edrpartyrentals-screenshot.webp': {
    figLabel: '01 / BILINGUAL RESERVATION PLATFORM',
    provenance: 'EDR Party Rentals (EN / ES)',
    caption: 'Bilingual English/Spanish Toggle, Date Availability & Surface Safety Triage',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '2400×1500',
  },
  '/assets/images/website-audit-hero.webp': {
    figLabel: '01 / 4-PILLAR DOM DIAGNOSTIC',
    provenance: '/website-system-check/',
    caption: 'Coordinate-Pinned Touch Target & Conversion Bottleneck Evidence Pipeline',
    cropClass: 'w-full h-full object-contain object-center block',
    naturalResolution: '2400×1500',
  },
  '/assets/images/revision-atlas-cover.webp': {
    figLabel: '01 / DUAL-PANE SCENE DIFF WORKBENCH',
    provenance: '/work/revision-atlas/',
    caption: 'AST Scene Graph, Pacing Velocity Telemetry & Non-Destructive Variant Branch',
    cropClass: 'w-full h-full object-contain object-center block',
    naturalResolution: '2400×1500',
  },
  '/assets/images/client-opportunity-engine-cover.webp': {
    figLabel: '01 / QUALIFICATION SCORING ENGINE',
    provenance: '/work/client-opportunity-engine/',
    caption: 'Multi-Signal B2B Lead Qualification & Capability Fit Matrix',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '2400×1500',
  },
  '/assets/images/wolves_preview_main.jpg': {
    figLabel: '01 / LITERARY COMPANION ARCHIVE',
    provenance: 'howtoexplainyourselftowolves.com',
    caption: 'Interactive Literary World, Symbolic Field Notes & Archive Index',
    cropClass: 'w-full h-full object-contain object-center block',
    naturalResolution: '1280×634',
  },
  '/assets/images/madeofreasons-screenshot.webp': {
    figLabel: '01 / 3D CONSTELLATION CANVAS',
    provenance: 'madeofreasons.com',
    caption: 'Interactive WebGL Star-Node Dedication Canvas & Relational Memory Archive',
    cropClass: 'w-full h-full object-contain object-center block',
    naturalResolution: '2400×1500',
  },
  '/assets/images/brainraccoon-screenshot.webp': {
    figLabel: '01 / COGNITIVE OVERRIDE UTILITY',
    provenance: 'brainraccoon.com',
    caption: 'Zero-Login 20-Minute Signal Interrupt & Immediate Task Defusal Interface',
    cropClass: 'w-full h-full object-contain object-center block',
    naturalResolution: '1920×1080',
  },
};

/**
 * Multi-capture definitions for projects with distinct dual surfaces
 * (e.g., Public Website + Internal Operator Portal, or Live Workspace + Diff Inspector).
 */
export const PROJECT_EVIDENCE_PLATES = {
  'inncontrol-coils': [
    {
      id: 'public-platform',
      shortTab: '01 / Public Site',
      label: '01 / Public Commercial Platform',
      provenance: 'inncontrolcoils.com',
      src: '/assets/captures/inncontrol-live.jpg',
      alt: 'INNcontrol Coils Commercial Hospitality Platform',
      caption: 'Nationwide B2B Hotel PTAC Coil Restoration & Multi-Property Service Intake',
    },
    {
      id: 'operator-hud',
      shortTab: '02 / Operator HUD',
      label: '02 / Internal Operator HUD',
      provenance: '/inncontrol-v2/',
      src: '/assets/images/inncontrol-screenshot.webp',
      alt: 'INNcontrol Operator Floorplan Scoping & Cost Ledger HUD',
      caption: 'Internal Floorplan Unit Mapper, Defect Inspector & Parametric Cost Ledger (/inncontrol-v2/)',
    },
  ],
  'd2-auto-detail': [
    {
      id: 'public-site',
      shortTab: '01 / Public Site',
      label: '01 / Detail Driven Public Platform',
      provenance: 'd2autodetail.com',
      src: '/assets/captures/d2-public-live.jpg',
      alt: 'D2 Auto Detail — Detail Driven Austin Detailing Platform',
      caption: 'Detail Driven (Austin, TX) — Paint Correction, Ceramic Coating & PPF Quote Intake',
    },
    {
      id: 'ad-studio',
      shortTab: '02 / Ad Creator',
      label: '02 / D2 Business Portal — Social Ad Creator',
      provenance: 'd2autodetail.com/admin.html',
      src: '/assets/captures/d2-ad-creator-live.png',
      alt: 'D2 Auto Detail Business Portal — Interactive Social Media Ad Creator',
      caption: 'In-Browser Social Ad Creator with Proportional Blur, Scrim Opacity & Live Copy Sync',
    },
    {
      id: 'business-portal',
      shortTab: '03 / Order Center',
      label: '03 / D2 Business Portal — Order Center & Billing',
      provenance: 'd2autodetail.com/admin.html',
      src: '/assets/captures/d2-portal-live.png',
      alt: 'D2 Auto Detail Business Portal — Order Center, CMS Studio & Invoice Builder',
      caption: 'Custom Operator Portal: Active Order Center, One-Click Invoice Builder & CMS Studio',
    },
  ],
  gensort: [
    {
      id: 'workspace',
      shortTab: '01 / Live Workspace',
      label: '01 / GenSort Live Asset Library',
      provenance: 'GenSort App',
      src: '/assets/captures/gensort-live.jpg',
      alt: 'GenSort Live Workspace showing Smart Intelligence Detection, Folder Tree, Color Palette Filter, and Asset Grid',
      caption: 'Smart Screenshot/Untagged Detection, Folder Taxonomy, Color Swatches & 1:1 Asset Grid',
    },
    {
      id: 'compare',
      shortTab: '02 / Compare & Diff',
      label: '02 / Side-by-Side Compare & Parameter Diff',
      provenance: '/cxm_gensort/',
      src: '/assets/images/gensort-compare.webp',
      alt: 'GenSort Studio Side-by-Side Compare and AI Parameter Diff View',
      caption: '64-Bit dHash Duplicate Comparison & Seed / CFG / Prompt Parameter Diff',
    },
  ],
  'signal-ops': [
    {
      id: 'workbench',
      shortTab: '01 / Action Workbench',
      label: '01 / Priority Action Workbench',
      provenance: '/signal/demo/',
      src: '/assets/images/signal-priority-view.webp',
      alt: 'Signal Restaurant Operational Intelligence Priority View',
      caption: 'Ranked Pre-Shift Anomaly Correlation Across Sales, Labor, Comps & Kitchen Timing',
    },
    {
      id: 'platform',
      shortTab: '02 / Product Platform',
      label: '02 / Signal Product & Pilot Intake',
      provenance: '/signal/',
      src: '/assets/images/signal_preview_pos.png',
      alt: 'Signal Restaurant Operational Intelligence Product Overview',
      caption: 'Public Product Architecture & Restaurant Data Partner Program Overview (/signal/)',
    },
  ],
};

export function getWorkMediaProfile(mediaUrl = '') {
  if (WORK_MEDIA_PROFILES[mediaUrl]) {
    return WORK_MEDIA_PROFILES[mediaUrl];
  }
  return {
    figLabel: '01 / PROJECT CAPTURE',
    provenance: 'Verified Build',
    caption: 'Authentic interface capture from the working project',
    cropClass: 'w-full h-full object-contain object-top block',
    naturalResolution: '16:10',
  };
}

export function getWorkMediaClass(mediaUrl = '') {
  return getWorkMediaProfile(mediaUrl).cropClass;
}

export { PROJECTS };
