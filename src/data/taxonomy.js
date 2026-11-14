/**
 * Controlled Vocabulary, Tag Alias Resolver & Typed Relationship Model
 * Separates classification dimensions (problem, capability, industry)
 * from content type, maturity status, and visibility.
 */

export const CONTENT_TYPES = {
  'client-project': {
    id: 'client-project',
    label: 'Client Project',
    pluralLabel: 'Client Projects & Case Studies',
    shortLabel: 'Client Build',
  },
  'software-product': {
    id: 'software-product',
    label: 'Software Product',
    pluralLabel: 'Original Software Products',
    shortLabel: 'Software Product',
  },
  'interactive-tool': {
    id: 'interactive-tool',
    label: 'Interactive Tool',
    pluralLabel: 'Interactive Tools & Utilities',
    shortLabel: 'Interactive Utility',
  },
  experiment: {
    id: 'experiment',
    label: 'R&D Experiment',
    pluralLabel: 'R&D Experiments',
    shortLabel: 'Experiment',
  },
  article: {
    id: 'article',
    label: 'Article & Research',
    pluralLabel: 'Articles & Research',
    shortLabel: 'Research / Essay',
  },
  'published-concept': {
    id: 'published-concept',
    label: 'Published Concept',
    pluralLabel: 'Published Concepts & Architecture',
    shortLabel: 'Architecture Study',
  },
};

export const MATURITY_STATUSES = {
  production: { id: 'production', label: 'Live Production' },
  'working-app': { id: 'working-app', label: 'Live Application' },
  'interactive-utility': { id: 'interactive-utility', label: 'Working Utility' },
  'case-study': { id: 'case-study', label: 'Published Study' },
  prototype: { id: 'prototype', label: 'System Prototype' },
  draft: { id: 'draft', label: 'Private Draft' },
};

export const VISIBILITY_LEVELS = {
  public: 'public',
  unlisted: 'unlisted',
  private: 'private',
};

export const RELATIONSHIP_TYPES = {
  'related-to': {
    id: 'related-to',
    label: 'Related to',
    inverseId: 'related-to',
    inverseLabel: 'Related to',
  },
  demonstrates: {
    id: 'demonstrates',
    label: 'Demonstrates',
    inverseId: 'demonstrated-by',
    inverseLabel: 'Demonstrated in',
  },
  'demonstrated-by': {
    id: 'demonstrated-by',
    label: 'Demonstrated in',
    inverseId: 'demonstrates',
    inverseLabel: 'Demonstrates',
  },
  'built-from': {
    id: 'built-from',
    label: 'Built from / extends',
    inverseId: 'extended-by',
    inverseLabel: 'Extended by',
  },
  'extended-by': {
    id: 'extended-by',
    label: 'Extended by',
    inverseId: 'built-from',
    inverseLabel: 'Built from / extends',
  },
  'discussed-in': {
    id: 'discussed-in',
    label: 'Discussed in',
    inverseId: 'discusses',
    inverseLabel: 'Discusses',
  },
  discusses: {
    id: 'discusses',
    label: 'Discusses',
    inverseId: 'discussed-in',
    inverseLabel: 'Discussed in',
  },
  'uses-capability': {
    id: 'uses-capability',
    label: 'Uses the same capability',
    inverseId: 'uses-capability',
    inverseLabel: 'Uses the same capability',
  },
};

/**
 * Controlled Tag Vocabulary
 * Organized across three orthogonal classification dimensions:
 * - problem: Operational or user problem addressed
 * - capability: Reusable technical or interaction capability
 * - industry: Sector or domain context
 */
export const CONTROLLED_TAGS = [
  // 1. PROBLEM DIMENSION
  {
    id: 'prob:intake-triage',
    dimension: 'problem',
    label: 'Lead & Service Intake',
    aliases: [
      'lead intake',
      'intake',
      'customer intake',
      'service triage',
      'dual-track intake',
      'order routing',
      'dispatch intake',
    ],
  },
  {
    id: 'prob:sizing-pricing',
    dimension: 'problem',
    label: 'Sizing & Pricing Clarity',
    aliases: [
      'quote calculator',
      'pricing',
      'sizing',
      'flat-rate pricing',
      'cost estimation',
      'delivery rules',
      'quoting',
    ],
  },
  {
    id: 'prob:data-hygiene',
    dimension: 'problem',
    label: 'Data & Spreadsheet Cleanup',
    aliases: [
      'data cleanup',
      'csv cleanup',
      'spreadsheet normalization',
      'data sanitization',
      'tabledocket',
      'pos exports',
      'messy spreadsheets',
    ],
  },
  {
    id: 'prob:asset-chaos',
    dimension: 'problem',
    label: 'Asset & Metadata Curation',
    aliases: [
      'asset management',
      'ai tooling',
      'prompt lineage',
      'duplicate detection',
      'curation',
      'digital asset management',
    ],
  },
  {
    id: 'prob:operational-visibility',
    dimension: 'problem',
    label: 'Operational & Shift Visibility',
    aliases: [
      'operator dashboard',
      'internal tools',
      'operational analytics',
      'daily check-in',
      'pos intelligence',
      'workflow tool',
      'margin leaks',
    ],
  },
  {
    id: 'prob:institutional-friction',
    dimension: 'problem',
    label: 'Barrier & Cognitive Friction',
    aliases: [
      'civic systems',
      'resource navigation',
      'barrier mapping',
      'cognitive tool',
      'focus utility',
      'task unblocker',
      'continuity',
    ],
  },
  {
    id: 'prob:structural-clarity',
    dimension: 'problem',
    label: 'UX & Document Structure',
    aliases: [
      'website audit',
      'ux diagnostics',
      'conversion analysis',
      'information architecture',
      'editorial systems',
      'long-form revision',
      'readability',
    ],
  },

  // 2. CAPABILITY DIMENSION
  {
    id: 'cap:quote-sizing-engine',
    dimension: 'capability',
    label: 'Parametric Sizing & Quoting',
    aliases: [
      'quote calculator',
      'sizing matrix',
      'pricing calculator',
      'mileage calculator',
      'parametric estimator',
    ],
  },
  {
    id: 'cap:intake-routing',
    dimension: 'capability',
    label: 'Intake & Territory Routing',
    aliases: [
      'intake routing',
      'territory routing',
      'local seo',
      'programmatic seo',
      'bilingual booking',
      'inventory booking',
      'bilingual ui',
      'bilingual',
      'spanish',
      'schema.org',
    ],
  },
  {
    id: 'cap:data-normalization',
    dimension: 'capability',
    label: 'Deterministic Data Ingestion',
    aliases: [
      'data normalization',
      'csv/xlsx ingestion',
      'binary parsing',
      'ast parsing',
      'automated crawling',
      'github actions',
      'diff engine',
    ],
  },
  {
    id: 'cap:local-first-workbench',
    dimension: 'capability',
    label: 'Local-First Browser Workbench',
    aliases: [
      'local-first',
      'local-first architecture',
      'local-first state',
      'indexeddb',
      'web workers',
      'perceptual hashing',
      'dhash',
      'workflow engine',
    ],
  },
  {
    id: 'cap:spatial-canvas-ui',
    dimension: 'capability',
    label: 'Canvas & Spatial Interfaces',
    aliases: [
      'html5 canvas',
      '3d webgl',
      'three.js',
      'webgl',
      'topological map',
      'branded ad generator',
      'layer compositing',
      'relational canvas',
      'interactive experience',
    ],
  },
  {
    id: 'cap:diagnostic-instrumentation',
    dimension: 'capability',
    label: 'DOM & Visual Diagnostics',
    aliases: [
      'dom inspection',
      'wcag contrast',
      'viewport inspector',
      'token extraction',
      'plumb-line audit',
      'diagnostic schema',
    ],
  },
  {
    id: 'cap:explainable-scoring',
    dimension: 'capability',
    label: 'Explainable Scoring & Rules',
    aliases: [
      'explainable systems',
      'cross-signal correlation',
      'readiness scoring',
      'operational heuristics',
      'inventory lock engine',
    ],
  },

  // 3. INDUSTRY / DOMAIN DIMENSION
  {
    id: 'ind:logistics-rentals',
    dimension: 'industry',
    label: 'Logistics & Equipment Rentals',
    aliases: [
      'waste logistics',
      'dumpster rental',
      'event rentals',
      'roll-off',
      'tent logistics',
    ],
  },
  {
    id: 'ind:hospitality-food',
    dimension: 'industry',
    label: 'Hospitality & Restaurants',
    aliases: [
      'hospitality',
      'hospitality systems',
      'restaurants',
      'restaurant',
      'ptac',
      'hvac',
      'hotel operations',
    ],
  },
  {
    id: 'ind:creative-editorial',
    dimension: 'industry',
    label: 'Creative & Editorial Systems',
    aliases: [
      'editorial',
      'publishing',
      'literary',
      'creative practice',
      'narrative systems',
      'visual essay',
      'ai assets',
    ],
  },
  {
    id: 'ind:civic-public',
    dimension: 'industry',
    label: 'Civic & Public Interest',
    aliases: ['civic', 'public interest', 'resource directory', 'jurisdictions'],
  },
  {
    id: 'ind:digital-product-ux',
    dimension: 'industry',
    label: 'Software & UX Engineering',
    aliases: [
      'ux engineering',
      'design systems',
      'web applications',
      'productivity',
      'conversion diagnostics',
    ],
  },
];

export const TAG_BY_ID = Object.fromEntries(
  CONTROLLED_TAGS.map((tag) => [tag.id, tag])
);

const ALIAS_LOOKUP = new Map();
for (const tag of CONTROLLED_TAGS) {
  ALIAS_LOOKUP.set(tag.id.toLowerCase(), tag.id);
  ALIAS_LOOKUP.set(tag.label.toLowerCase(), tag.id);
  for (const alias of tag.aliases) {
    ALIAS_LOOKUP.set(alias.toLowerCase().trim(), tag.id);
  }
}

/**
 * Resolves any tag ID, label, or synonym alias to its canonical tag ID.
 * Returns null if the term is not in the controlled vocabulary.
 */
export function resolveCanonicalTagId(input) {
  if (!input || typeof input !== 'string') return null;
  const normalized = input.toLowerCase().trim();
  return ALIAS_LOOKUP.get(normalized) || null;
}

/**
 * Normalizes a mixed list of raw tag strings or IDs into deduplicated canonical tag objects.
 */
export function normalizeTags(rawInputs = []) {
  const seen = new Set();
  const result = [];
  for (const raw of rawInputs) {
    const id = resolveCanonicalTagId(raw);
    if (id && !seen.has(id)) {
      seen.add(id);
      result.push(TAG_BY_ID[id]);
    }
  }
  return result;
}
