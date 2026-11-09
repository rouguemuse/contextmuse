/**
 * Canonical Content Registry & Relationship Graph for ContextMuse
 * Single source of truth for:
 * - Client projects & case studies (client-project)
 * - Original software products (software-product)
 * - Interactive tools & utilities (interactive-tool)
 * - R&D experiments (experiment)
 * - Articles & research (article)
 * - Published concepts & architectures (published-concept)
 */

import {
  CONTENT_TYPES,
  MATURITY_STATUSES,
  VISIBILITY_LEVELS,
  RELATIONSHIP_TYPES,
  TAG_BY_ID,
  normalizeTags,
  resolveCanonicalTagId,
} from './taxonomy.js';
import { PROJECTS } from './projects.js';

export const ID_ALIASES = {
  'gensort-studio': 'gensort',
  'website-system-check': 'website-audit-system',
  'contest-atlas': 'wcsm',
  'lone-wolf': 'lone-wolf-dumpsters',
  inncontrol: 'inncontrol-coils',
  'design-intelligence': 'design-intelligence-01',
};

export function resolveEntryId(rawId) {
  if (!rawId) return null;
  const trimmed = String(rawId).trim();
  return ID_ALIASES[trimmed] || trimmed;
}

/**
 * Metadata and typed relationship overlay for the 13 core records in src/data/projects.js
 * plus additional canonical public records (interactive Lab utilities, R&D experiments,
 * and articles).
 */
export const REGISTRY_METADATA = {
  'lone-wolf-dumpsters': {
    contentType: 'client-project',
    maturityStatus: 'production',
    visibility: 'public',
    featuredInWork: true,
    featuredInLab: false,
    canonicalDestination: '/work/lone-wolf-dumpsters/',
    caseStudyDestination: '/work?case=lone-wolf-dumpsters',
    liveDestination: 'https://lonewolf-dumpsters.vercel.app/',
    canonicalTagIds: [
      'prob:intake-triage',
      'prob:sizing-pricing',
      'cap:quote-sizing-engine',
      'cap:intake-routing',
      'ind:logistics-rentals',
    ],
    relationships: [
      {
        type: 'uses-capability',
        targetId: 'edr-party-rentals',
        note: 'Both use rule-based sizing/availability validation and structured dispatch intake.',
      },
      {
        type: 'demonstrated-by',
        targetId: 'barrier-map',
        note: 'Spatial Friction Relief Map models the 4-step roll-off intake bottleneck reduction.',
      },
      {
        type: 'discussed-in',
        targetId: 'client-opportunity-engine',
        note: 'Referenced as a production proof point for multi-city territory intake.',
      },
    ],
  },

  'inncontrol-coils': {
    contentType: 'client-project',
    maturityStatus: 'production',
    visibility: 'public',
    featuredInWork: true,
    featuredInLab: false,
    canonicalDestination: 'https://inncontrolcoils.com',
    caseStudyDestination: '/work?case=inncontrol-coils',
    liveDestination: 'https://inncontrolcoils.com',
    canonicalTagIds: [
      'prob:intake-triage',
      'prob:operational-visibility',
      'cap:intake-routing',
      'cap:local-first-workbench',
      'ind:hospitality-food',
    ],
    relationships: [
      {
        type: 'extended-by',
        targetId: 'inncontrol-operator-hud',
        note: 'Pairs the public B2B hospitality platform with the internal daily operator status HUD.',
      },
      {
        type: 'related-to',
        targetId: 'signal-ops',
        note: 'Both serve hospitality operators with focused daily operational clarity.',
      },
    ],
  },

  gensort: {
    aliases: ['gensort-studio'],
    contentType: 'software-product',
    maturityStatus: 'working-app',
    visibility: 'public',
    featuredInWork: true,
    featuredInLab: true,
    canonicalDestination: '/cxm_gensort/index.html',
    caseStudyDestination: '/work?case=gensort',
    liveDestination: '/cxm_gensort/index.html',
    secondaryDestination: '/gensort/',
    canonicalTagIds: [
      'prob:asset-chaos',
      'prob:data-hygiene',
      'cap:local-first-workbench',
      'cap:data-normalization',
      'cap:explainable-scoring',
      'ind:creative-editorial',
    ],
    relationships: [
      {
        type: 'uses-capability',
        targetId: 'self-cartography',
        note: 'Both run 100% local-first in the browser with explainable 0–100 scoring heuristics.',
      },
      {
        type: 'uses-capability',
        targetId: 'revision-atlas',
        note: 'Shares deterministic binary/AST file parsing and side-by-side parameter diffing.',
      },
    ],
  },

  'signal-ops': {
    contentType: 'software-product',
    maturityStatus: 'working-app',
    visibility: 'public',
    featuredInWork: true,
    featuredInLab: true,
    canonicalDestination: '/signal/demo/',
    caseStudyDestination: '/work?case=signal-ops',
    liveDestination: '/signal/demo/',
    secondaryDestination: '/signal/',
    canonicalTagIds: [
      'prob:operational-visibility',
      'prob:data-hygiene',
      'cap:data-normalization',
      'cap:explainable-scoring',
      'ind:hospitality-food',
    ],
    relationships: [
      {
        type: 'built-from',
        targetId: 'restaurant-theory',
        note: 'Operationalizes the multi-signal restaurant diagnostic thesis into a 3-stage POS workbench.',
      },
      {
        type: 'demonstrated-by',
        targetId: 'table-docket',
        note: 'Uses deterministic CSV/spreadsheet normalization prior to cross-signal correlation.',
      },
      {
        type: 'related-to',
        targetId: 'inncontrol-coils',
        note: 'Hospitality operational intelligence and daily GM decision support.',
      },
    ],
  },

  'self-cartography': {
    contentType: 'software-product',
    maturityStatus: 'working-app',
    visibility: 'public',
    featuredInWork: true,
    featuredInLab: true,
    canonicalDestination: '/cartography/',
    caseStudyDestination: '/work?case=self-cartography',
    liveDestination: '/cartography/',
    secondaryDestination: '/creative/self-cartography/',
    canonicalTagIds: [
      'prob:institutional-friction',
      'cap:spatial-canvas-ui',
      'cap:explainable-scoring',
      'cap:local-first-workbench',
      'ind:creative-editorial',
    ],
    relationships: [
      {
        type: 'built-from',
        targetId: 'how-to-explain-yourself-to-wolves',
        note: 'Emerges from the Self-Cartography field notes in the Wolves literary universe.',
      },
      {
        type: 'uses-capability',
        targetId: 'gensort',
        note: 'Uses transparent, inspectable client-side vector scoring with zero server uploads.',
      },
    ],
  },

  wcsm: {
    aliases: ['contest-atlas'],
    contentType: 'software-product',
    maturityStatus: 'working-app',
    visibility: 'public',
    featuredInWork: true,
    featuredInLab: true,
    canonicalDestination: '/wcsm/',
    caseStudyDestination: '/work?case=wcsm',
    liveDestination: '/wcsm/',
    secondaryDestination: '/work/contest-atlas/',
    canonicalTagIds: [
      'prob:structural-clarity',
      'prob:data-hygiene',
      'cap:data-normalization',
      'cap:local-first-workbench',
      'ind:creative-editorial',
    ],
    relationships: [
      {
        type: 'related-to',
        targetId: 'revision-atlas',
        note: 'Companion literary and editorial tooling for long-form prose writers.',
      },
      {
        type: 'uses-capability',
        targetId: 'table-docket',
        note: 'Normalizes scraped contest deadlines and entry fees into a clean JSON schema.',
      },
    ],
  },

  'website-audit-system': {
    aliases: ['website-system-check'],
    contentType: 'software-product',
    maturityStatus: 'working-app',
    visibility: 'public',
    featuredInWork: true,
    featuredInLab: true,
    canonicalDestination: '/website-system-check/',
    caseStudyDestination: '/work?case=website-audit-system',
    liveDestination: '/website-system-check/',
    secondaryDestination: '/work/website-audit-system/',
    canonicalTagIds: [
      'prob:structural-clarity',
      'prob:intake-triage',
      'cap:diagnostic-instrumentation',
      'cap:explainable-scoring',
      'ind:digital-product-ux',
    ],
    relationships: [
      {
        type: 'related-to',
        targetId: 'design-intelligence-01',
        note: 'Both evaluate multi-viewport geometry, typography hierarchy, and measurable DOM alignment.',
      },
      {
        type: 'uses-capability',
        targetId: 'contrast-utility',
        note: 'Pairs structural 4-pillar inspection with WCAG typographic readability verification.',
      },
    ],
  },

  'edr-party-rentals': {
    contentType: 'client-project',
    maturityStatus: 'prototype',
    visibility: 'public',
    featuredInWork: true,
    featuredInLab: false,
    canonicalDestination: '/case-studies/edr-party-rentals/',
    caseStudyDestination: '/work?case=edr-party-rentals',
    liveDestination: '/case-studies/edr-party-rentals/',
    canonicalTagIds: [
      'prob:intake-triage',
      'prob:sizing-pricing',
      'cap:intake-routing',
      'cap:quote-sizing-engine',
      'cap:explainable-scoring',
      'ind:logistics-rentals',
    ],
    relationships: [
      {
        type: 'uses-capability',
        targetId: 'lone-wolf-dumpsters',
        note: 'Shares radius validation, physical surface safety rules, and structured dispatch output.',
      },
    ],
  },

  'maps-with-teeth': {
    contentType: 'client-project',
    maturityStatus: 'production',
    visibility: 'public',
    featuredInWork: true,
    featuredInLab: false,
    canonicalDestination: 'https://www.mapswithteeth.org/',
    caseStudyDestination: '/work?case=maps-with-teeth',
    liveDestination: 'https://www.mapswithteeth.org/',
    canonicalTagIds: [
      'prob:institutional-friction',
      'prob:structural-clarity',
      'cap:intake-routing',
      'cap:local-first-workbench',
      'ind:civic-public',
    ],
    relationships: [
      {
        type: 'demonstrated-by',
        targetId: 'barrier-map',
        note: 'Spatial Friction Relief Map visualizes institutional prerequisite barriers.',
      },
      {
        type: 'related-to',
        targetId: 'self-cartography',
        note: 'Both prioritize user-held agency and transparent, non-clinical navigation.',
      },
    ],
  },

  'revision-atlas': {
    contentType: 'published-concept',
    maturityStatus: 'case-study',
    visibility: 'public',
    featuredInWork: true,
    featuredInLab: false,
    canonicalDestination: '/work/revision-atlas/',
    caseStudyDestination: '/work?case=revision-atlas',
    liveDestination: '/work/revision-atlas/',
    canonicalTagIds: [
      'prob:structural-clarity',
      'prob:data-hygiene',
      'cap:data-normalization',
      'cap:local-first-workbench',
      'ind:creative-editorial',
    ],
    relationships: [
      {
        type: 'related-to',
        targetId: 'wcsm',
        note: 'Part of the ContextMuse editorial & literary systems suite.',
      },
      {
        type: 'uses-capability',
        targetId: 'gensort',
        note: 'Uses local-first content hashing and side-by-side diffing.',
      },
    ],
  },

  'how-to-explain-yourself-to-wolves': {
    contentType: 'published-concept',
    maturityStatus: 'production',
    visibility: 'public',
    featuredInWork: true,
    featuredInLab: false,
    canonicalDestination: 'https://howtoexplainyourselftowolves.com/',
    caseStudyDestination: '/work?case=how-to-explain-yourself-to-wolves',
    liveDestination: 'https://howtoexplainyourselftowolves.com/',
    secondaryDestination: '/creative/how-to-explain-yourself-to-wolves/',
    canonicalTagIds: [
      'prob:structural-clarity',
      'cap:spatial-canvas-ui',
      'ind:creative-editorial',
    ],
    relationships: [
      {
        type: 'extended-by',
        targetId: 'self-cartography',
        note: 'Self-Cartography V1 expands the companion archive into an interactive topological engine.',
      },
    ],
  },

  'made-of-reasons': {
    contentType: 'software-product',
    maturityStatus: 'production',
    visibility: 'public',
    featuredInWork: true,
    featuredInLab: false,
    canonicalDestination: 'https://www.madeofreasons.com',
    caseStudyDestination: '/work?case=made-of-reasons',
    liveDestination: 'https://www.madeofreasons.com',
    canonicalTagIds: [
      'prob:asset-chaos',
      'cap:spatial-canvas-ui',
      'ind:creative-editorial',
    ],
    relationships: [
      {
        type: 'uses-capability',
        targetId: 'ad-compositor',
        note: 'Both use hardware-accelerated HTML5 Canvas / WebGL rendering.',
      },
    ],
  },

  'brain-raccoon': {
    contentType: 'interactive-tool',
    maturityStatus: 'production',
    visibility: 'public',
    featuredInWork: true,
    featuredInLab: false,
    canonicalDestination: 'https://www.brainraccoon.com',
    caseStudyDestination: '/work?case=brain-raccoon',
    liveDestination: 'https://www.brainraccoon.com',
    canonicalTagIds: [
      'prob:institutional-friction',
      'cap:local-first-workbench',
      'ind:digital-product-ux',
    ],
    relationships: [
      {
        type: 'uses-capability',
        targetId: 'self-cartography',
        note: 'Zero-login local browser persistence designed to reduce cognitive overload.',
      },
    ],
  },
};

/**
 * Additional Canonical Records Not Previously in PROJECTS
 * (R&D Experiments, Interactive Lab Instruments, and Articles)
 */
export const ADDITIONAL_REGISTRY_ENTRIES = [
  {
    id: 'design-intelligence-01',
    aliases: ['design-intelligence'],
    title: 'Design Intelligence Studies 01–03: Plaidis, Linear & Stripe Token Extraction',
    subtitle: 'Comparative CSS/DOM Token Extraction, Shared Specimen Slider & Plumb-Line Verification',
    year: '2026',
    sector: 'Design systems research & empirical UI verification',
    role: 'Token Extraction, Shared Specimen Architecture, Multi-Viewport Verification',
    plainSentence:
      'Extracts verified CSS variables and computed DOM tokens from Plaidis (Locomotive), Linear, and Stripe and compares their perceptual and structural impact on an identical neutral interface specimen.',
    summary:
      'An empirical three-study design-systems comparison evaluating how Plaidis (editorial grid & quintic choreography), Linear (dark-mode border luminance & fractional Inter Variable weights), and Stripe (light-weight Söhne typography & navy-tinted elevation) transform the same shared specimen alongside ContextMuse Entrance before/after captures.',
    contentType: 'experiment',
    maturityStatus: 'case-study',
    visibility: 'public',
    featuredInWork: false,
    featuredInLab: true,
    canonicalDestination: '/lab/design-intelligence',
    liveDestination: '/lab/design-intelligence',
    mediaUrl: '/assets/images/design-intelligence/after-desktop-viewport.png',
    canonicalTagIds: [
      'prob:structural-clarity',
      'cap:diagnostic-instrumentation',
      'ind:digital-product-ux',
    ],
    relationships: [
      {
        type: 'related-to',
        targetId: 'website-audit-system',
        note: 'Complements the 4-Pillar Website + System Check with empirical DOM plumb-line verification.',
      },
      {
        type: 'uses-capability',
        targetId: 'contrast-utility',
        note: 'Evaluates typographic hierarchy, surface contrast, and spatial legibility.',
      },
    ],
  },

  {
    id: 'inncontrol-operator-hud',
    title: 'INNcontrol Operator HUD (V2)',
    subtitle: 'Gamified Daily Field Readiness, Check-In & Objective Tracker',
    year: '2025–2026',
    sector: 'Hospitality field operations & internal tooling',
    role: 'Operator Workflow Design, Mobile Check-In State, Readiness Telemetry',
    plainSentence:
      'Translates morning readiness check-ins, top 3 daily field priorities, and end-of-day debriefs into a fast visual operator status HUD.',
    summary:
      'Built as the internal operator companion to the INNcontrol Coils commercial platform, replacing scattered field notes with a thumb-friendly daily check-in and visual readiness HUD at /inncontrol-v2/.',
    contentType: 'software-product',
    maturityStatus: 'working-app',
    visibility: 'public',
    featuredInWork: false,
    featuredInLab: true,
    canonicalDestination: '/inncontrol-v2/',
    liveDestination: '/inncontrol-v2/',
    mediaUrl: '/assets/images/inncontrol-screenshot.webp',
    canonicalTagIds: [
      'prob:operational-visibility',
      'cap:local-first-workbench',
      'ind:hospitality-food',
    ],
    relationships: [
      {
        type: 'built-from',
        targetId: 'inncontrol-coils',
        note: 'Internal operator readiness companion built for INNcontrol Coils field operations.',
      },
      {
        type: 'related-to',
        targetId: 'brain-raccoon',
        note: 'Both strip away enterprise PM bloat to lock focus on immediate daily actions.',
      },
    ],
  },

  {
    id: 'client-opportunity-engine',
    title: 'Client Opportunity & Lead Qualification Engine',
    subtitle: 'Automated Multi-Signal Lead Scoring & Intake Triage Case Study',
    year: '2024–2025',
    sector: 'B2B service intake & qualification automation',
    role: 'Intake Architecture, Deterministic Qualification Rules',
    plainSentence:
      'Scores and routes inbound service inquiries using transparent readiness criteria so operators focus on high-fit opportunities first.',
    summary:
      'Published architectural case study (/work/client-opportunity-engine/) detailing how structured intake signals replace manual lead qualification guesswork.',
    contentType: 'published-concept',
    maturityStatus: 'case-study',
    visibility: 'public',
    featuredInWork: false,
    featuredInLab: false,
    canonicalDestination: '/work/client-opportunity-engine/',
    liveDestination: '/work/client-opportunity-engine/',
    mediaUrl: '/assets/images/client-opportunity-engine-cover.webp',
    canonicalTagIds: [
      'prob:intake-triage',
      'cap:intake-routing',
      'cap:explainable-scoring',
      'ind:digital-product-ux',
    ],
    relationships: [
      {
        type: 'discusses',
        targetId: 'lone-wolf-dumpsters',
        note: 'Shares multi-signal intake qualification and dispatch routing patterns.',
      },
      {
        type: 'uses-capability',
        targetId: 'edr-party-rentals',
        note: 'Uses deterministic rule evaluation prior to booking confirmation.',
      },
    ],
  },

  {
    id: 'restaurant-theory',
    title: 'Restaurant Theory: Operational Systems & Margin Physics',
    subtitle: 'Field Essay on POS Signal Correlation, Kitchen Pacing & Service Friction',
    year: '2025',
    sector: 'Hospitality operations research & systems writing',
    role: 'Research, Operational Thesis, Systems Architecture',
    plainSentence:
      'Examines why single-metric restaurant dashboards fail at 7:30 PM on a Friday night—and how cross-report signal correlation surfaces real operational leaks.',
    summary:
      'An operational research essay (/restaurant-theory/) written from real kitchen and hospitality floor experience, establishing the analytical foundation behind the Signal restaurant intelligence engine.',
    contentType: 'article',
    maturityStatus: 'case-study',
    visibility: 'public',
    featuredInWork: false,
    featuredInLab: false,
    canonicalDestination: '/restaurant-theory/',
    liveDestination: '/restaurant-theory/',
    mediaUrl: '/assets/images/signal-priority-view.webp',
    canonicalTagIds: [
      'prob:operational-visibility',
      'prob:data-hygiene',
      'cap:explainable-scoring',
      'ind:hospitality-food',
    ],
    relationships: [
      {
        type: 'extended-by',
        targetId: 'signal-ops',
        note: 'Signal turns this operational thesis into a live 3-stage POS correlation workbench.',
      },
      {
        type: 'related-to',
        targetId: 'inncontrol-coils',
        note: 'Applies the same ground-truth hospitality operating philosophy.',
      },
    ],
  },

  {
    id: 'ad-compositor',
    title: 'Ad Layer Compositor',
    subtitle: 'Interactive HTML5 Canvas Layering & Mood Stance Utility',
    year: '2025',
    sector: 'Creative production utilities',
    role: 'HTML5 Canvas Compositing, Typographic Hierarchy Controls, PNG Export',
    plainSentence:
      'Assembles background geometry, atmospheric blur, tint opacity, and typographic layers on an HTML5 canvas with instant PNG export.',
    summary:
      'An in-page interactive instrument in The Lab (/lab#tool-ad-compositor) demonstrating how tint saturation, blur, and typographic scale shift emotional urgency without changing the underlying image.',
    contentType: 'interactive-tool',
    maturityStatus: 'interactive-utility',
    visibility: 'public',
    featuredInWork: false,
    featuredInLab: true,
    canonicalDestination: '/lab#tool-ad-compositor',
    liveDestination: '/lab#tool-ad-compositor',
    canonicalTagIds: [
      'prob:asset-chaos',
      'cap:spatial-canvas-ui',
      'ind:creative-editorial',
    ],
    relationships: [
      {
        type: 'uses-capability',
        targetId: 'made-of-reasons',
        note: 'Uses browser-native HTML5 Canvas / WebGL rendering.',
      },
    ],
  },

  {
    id: 'contrast-utility',
    title: 'Color Contrast & Readability Utility',
    subtitle: 'Live WCAG 2.1 Luminance Ratio Calculator',
    year: '2025',
    sector: 'Design systems & accessibility utilities',
    role: 'Relative Luminance Engine, WCAG AA/AAA Verification',
    plainSentence:
      'Calculates real-time WCAG contrast ratios between foreground and background hex pairs to verify typographic legibility.',
    summary:
      'An interactive diagnostic utility in The Lab (/lab#tool-contrast) for testing color pairs against WCAG AA and AAA readability thresholds.',
    contentType: 'interactive-tool',
    maturityStatus: 'interactive-utility',
    visibility: 'public',
    featuredInWork: false,
    featuredInLab: true,
    canonicalDestination: '/lab#tool-contrast',
    liveDestination: '/lab#tool-contrast',
    canonicalTagIds: [
      'prob:structural-clarity',
      'cap:diagnostic-instrumentation',
      'ind:digital-product-ux',
    ],
    relationships: [
      {
        type: 'demonstrates',
        targetId: 'website-audit-system',
        note: 'Demonstrates Pillar 01 (Message & Readability Contrast) from the Website Audit framework.',
      },
      {
        type: 'related-to',
        targetId: 'design-intelligence-01',
        note: 'Used to verify AA/AAA contrast ratios across ContextMuse editorial surfaces.',
      },
    ],
  },

  {
    id: 'table-docket',
    title: 'Data Normalization Workbench (TableDocket)',
    subtitle: 'Deterministic Regex Sanitizer for Messy Spreadsheets',
    year: '2025',
    sector: 'Data hygiene & operational utilities',
    role: 'Deterministic Schema Sanitization, ISO Date & Phone Formatting',
    plainSentence:
      'Transforms inconsistent phone numbers, mixed date formats, and unstructured status strings into a clean, deterministic data table.',
    summary:
      'An interactive utility in The Lab (/lab#tool-table-docket) demonstrating how deterministic client-side parsing cleans raw operational exports.',
    contentType: 'interactive-tool',
    maturityStatus: 'interactive-utility',
    visibility: 'public',
    featuredInWork: false,
    featuredInLab: true,
    canonicalDestination: '/lab#tool-table-docket',
    liveDestination: '/lab#tool-table-docket',
    canonicalTagIds: [
      'prob:data-hygiene',
      'cap:data-normalization',
      'ind:digital-product-ux',
    ],
    relationships: [
      {
        type: 'demonstrates',
        targetId: 'signal-ops',
        note: 'Demonstrates the raw CSV/spreadsheet normalization step inside Signal.',
      },
      {
        type: 'uses-capability',
        targetId: 'wcsm',
        note: 'Shares deterministic record normalization rules.',
      },
    ],
  },

  {
    id: 'barrier-map',
    title: 'Spatial Friction Relief Map',
    subtitle: 'Interactive Workflow Bottleneck Topography',
    year: '2025',
    sector: 'UX diagnostics & workflow mapping',
    role: 'Friction Telemetry Visualization, Step-by-Step Drop-Off Analysis',
    plainSentence:
      'Visualizes where customers encounter cognitive or rule friction across multi-step intake workflows.',
    summary:
      'An interactive diagnostic map in The Lab (/lab#tool-barrier-map) showing how upfront sizing and structured dispatch handoffs reduce 85% phone-intake friction down to 15%.',
    contentType: 'interactive-tool',
    maturityStatus: 'interactive-utility',
    visibility: 'public',
    featuredInWork: false,
    featuredInLab: true,
    canonicalDestination: '/lab#tool-barrier-map',
    liveDestination: '/lab#tool-barrier-map',
    canonicalTagIds: [
      'prob:intake-triage',
      'prob:institutional-friction',
      'cap:diagnostic-instrumentation',
      'ind:logistics-rentals',
    ],
    relationships: [
      {
        type: 'demonstrates',
        targetId: 'lone-wolf-dumpsters',
        note: 'Models the 4-stage intake friction reduction engineered for Wolf Ridge Dumpsters.',
      },
      {
        type: 'demonstrates',
        targetId: 'maps-with-teeth',
        note: 'Illustrates barrier-first prerequisite mapping across institutional handoffs.',
      },
    ],
  },
];

/**
 * Builds the complete canonical registry by combining PROJECTS with REGISTRY_METADATA
 * and ADDITIONAL_REGISTRY_ENTRIES.
 */
export function buildCanonicalRegistry(baseProjects = []) {
  const entries = [];

  for (const proj of baseProjects) {
    const meta = REGISTRY_METADATA[proj.id] || {};
    const rawTagStrings = [
      ...(meta.canonicalTagIds || []),
      ...(proj.tags?.visitorNeeds || []),
      ...(proj.tags?.capabilities || []),
      ...(proj.tags?.technologies || []),
    ];
    const resolvedTags = normalizeTags(rawTagStrings);
    const canonicalTagIds = resolvedTags.map((t) => t.id);

    const contentType = meta.contentType || 'client-project';
    const maturityStatus = meta.maturityStatus || 'production';
    const visibility = meta.visibility || VISIBILITY_LEVELS.public;

    entries.push({
      ...proj,
      id: proj.id,
      aliases: meta.aliases || [],
      contentType,
      contentTypeMeta: CONTENT_TYPES[contentType] || CONTENT_TYPES['client-project'],
      maturityStatus,
      maturityStatusMeta: MATURITY_STATUSES[maturityStatus] || MATURITY_STATUSES.production,
      visibility,
      featuredInWork: meta.featuredInWork ?? true,
      featuredInLab: meta.featuredInLab ?? false,
      canonicalDestination: meta.canonicalDestination || proj.liveUrl || `/work?case=${proj.id}`,
      caseStudyDestination: meta.caseStudyDestination || `/work?case=${proj.id}`,
      liveDestination: meta.liveDestination || proj.liveUrl || null,
      secondaryDestination: meta.secondaryDestination || proj.productUrl || null,
      hasCaseDossier: true,
      canonicalTagIds,
      canonicalTags: resolvedTags,
      tagsByDimension: {
        problem: resolvedTags.filter((t) => t.dimension === 'problem'),
        capability: resolvedTags.filter((t) => t.dimension === 'capability'),
        industry: resolvedTags.filter((t) => t.dimension === 'industry'),
      },
      relationships: (meta.relationships || []).map((rel) => ({
        ...rel,
        origin: 'curated',
        typeMeta: RELATIONSHIP_TYPES[rel.type] || RELATIONSHIP_TYPES['related-to'],
      })),
    });
  }

  for (const extra of ADDITIONAL_REGISTRY_ENTRIES) {
    const resolvedTags = normalizeTags(extra.canonicalTagIds || []);
    const canonicalTagIds = resolvedTags.map((t) => t.id);
    const contentType = extra.contentType || 'interactive-tool';
    const maturityStatus = extra.maturityStatus || 'interactive-utility';

    entries.push({
      ...extra,
      aliases: extra.aliases || [],
      contentType,
      contentTypeMeta: CONTENT_TYPES[contentType] || CONTENT_TYPES['interactive-tool'],
      maturityStatus,
      maturityStatusMeta: MATURITY_STATUSES[maturityStatus] || MATURITY_STATUSES['interactive-utility'],
      visibility: extra.visibility || VISIBILITY_LEVELS.public,
      hasCaseDossier: Boolean(extra.overview),
      canonicalTagIds,
      canonicalTags: resolvedTags,
      tagsByDimension: {
        problem: resolvedTags.filter((t) => t.dimension === 'problem'),
        capability: resolvedTags.filter((t) => t.dimension === 'capability'),
        industry: resolvedTags.filter((t) => t.dimension === 'industry'),
      },
      relationships: (extra.relationships || []).map((rel) => ({
        ...rel,
        origin: 'curated',
        typeMeta: RELATIONSHIP_TYPES[rel.type] || RELATIONSHIP_TYPES['related-to'],
      })),
    });
  }

  return entries;
}

export const CONTENT_REGISTRY = buildCanonicalRegistry(PROJECTS);

export const PUBLIC_REGISTRY = CONTENT_REGISTRY.filter(
  (entry) => entry.visibility === VISIBILITY_LEVELS.public
);

const REGISTRY_BY_ID = new Map();
for (const entry of CONTENT_REGISTRY) {
  REGISTRY_BY_ID.set(entry.id, entry);
  for (const alias of entry.aliases || []) {
    REGISTRY_BY_ID.set(alias, entry);
  }
}

/**
 * Retrieves an entry by ID or alias.
 * By default, only returns public entries unless includePrivate is explicitly true.
 */
export function getRegistryEntryById(rawId, { includePrivate = false } = {}) {
  const resolved = resolveEntryId(rawId);
  if (!resolved) return null;
  const entry = REGISTRY_BY_ID.get(resolved) || null;
  if (!entry) return null;
  if (!includePrivate && entry.visibility !== VISIBILITY_LEVELS.public) {
    return null;
  }
  return entry;
}

export function getPublicRegistryEntries() {
  return PUBLIC_REGISTRY;
}

/**
 * Returns explicitly curated relationships for an entry.
 * Only resolves targets that have public visibility.
 */
export function getCuratedRelationships(entryOrId) {
  const entry =
    typeof entryOrId === 'string'
      ? getRegistryEntryById(entryOrId)
      : entryOrId;
  if (!entry || !Array.isArray(entry.relationships)) return [];

  return entry.relationships
    .map((rel) => {
      const target = getRegistryEntryById(rel.targetId);
      if (!target) return null;
      return {
        ...rel,
        origin: 'curated',
        target,
      };
    })
    .filter(Boolean);
}

/**
 * Computes automatic tag-based related entry suggestions.
 * - Strictly separated from curated relationships (origin: 'tag-suggested').
 * - Excludes the entry itself, any target already linked via curated relationships,
 *   and any non-public entry.
 * - Requires at least 1 shared problem or capability tag (ranked by shared tag count).
 */
export function getTagSuggestedEntries(entryOrId, { limit = 3 } = {}) {
  const entry =
    typeof entryOrId === 'string'
      ? getRegistryEntryById(entryOrId)
      : entryOrId;
  if (!entry) return [];

  const curatedTargetIds = new Set(
    (entry.relationships || []).map((r) => resolveEntryId(r.targetId))
  );
  const myTagIds = new Set(entry.canonicalTagIds || []);

  const candidates = [];
  for (const candidate of PUBLIC_REGISTRY) {
    if (candidate.id === entry.id) continue;
    if (curatedTargetIds.has(candidate.id)) continue;

    const sharedTags = (candidate.canonicalTags || []).filter((t) =>
      myTagIds.has(t.id)
    );
    const sharedProblemOrCap = sharedTags.filter(
      (t) => t.dimension === 'problem' || t.dimension === 'capability'
    );

    if (sharedProblemOrCap.length > 0 && sharedTags.length >= 2) {
      candidates.push({
        origin: 'tag-suggested',
        target: candidate,
        sharedTags,
        score: sharedProblemOrCap.length * 2 + sharedTags.length,
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, limit);
}

/**
 * Searches and filters the public content registry.
 * Supports:
 * - query: free-text search across title, subtitle, plainSentence, summary, sector,
 *   and synonym-resolved canonical tags
 * - typeFilter: 'all' | 'client-project' | 'software-product' | 'interactive-tool' | 'experiment' | 'article' | 'published-concept' | 'tools-and-experiments' | 'research-and-concepts'
 * - tagFilter: canonical tag ID or alias (e.g., 'prob:intake-triage' or 'quote calculator')
 */
export function searchAndFilterRegistry({
  query = '',
  typeFilter = 'all',
  tagFilter = null,
} = {}) {
  const normalizedQuery = String(query || '').toLowerCase().trim();
  const queryTagId = normalizedQuery ? resolveCanonicalTagId(normalizedQuery) : null;
  const activeTagId = tagFilter ? resolveCanonicalTagId(tagFilter) || tagFilter : null;

  return PUBLIC_REGISTRY.filter((entry) => {
    // 1. Content Type Filter
    if (typeFilter && typeFilter !== 'all') {
      if (typeFilter === 'tools-and-experiments') {
        if (
          entry.contentType !== 'interactive-tool' &&
          entry.contentType !== 'experiment'
        ) {
          return false;
        }
      } else if (typeFilter === 'research-and-concepts') {
        if (
          entry.contentType !== 'article' &&
          entry.contentType !== 'published-concept' &&
          entry.contentType !== 'experiment'
        ) {
          return false;
        }
      } else if (entry.contentType !== typeFilter) {
        return false;
      }
    }

    // 2. Canonical Tag Filter
    if (activeTagId && activeTagId !== 'all') {
      if (!entry.canonicalTagIds.includes(activeTagId)) {
        return false;
      }
    }

    // 3. Search Query (Text + Synonym Alias Resolution)
    if (normalizedQuery) {
      if (queryTagId && entry.canonicalTagIds.includes(queryTagId)) {
        return true;
      }

      const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
      const searchableBlob = [
        entry.id,
        ...(entry.aliases || []),
        entry.title,
        entry.subtitle,
        entry.plainSentence,
        entry.summary,
        entry.sector,
        entry.role,
        entry.contentTypeMeta?.label,
        ...(entry.canonicalTags || []).flatMap((t) => [
          t.label,
          ...(t.aliases || []),
        ]),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return tokens.every((tok) => {
        const tokenTagId = resolveCanonicalTagId(tok);
        if (tokenTagId && entry.canonicalTagIds.includes(tokenTagId)) {
          return true;
        }
        return searchableBlob.includes(tok);
      });
    }

    return true;
  });
}
