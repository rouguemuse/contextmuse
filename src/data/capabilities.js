/**
 * Reusable Capabilities Catalog
 * Distinguishes core agency competencies and repeatable software patterns
 * from individual client case studies.
 *
 * Structure:
 * Capability → Interactive Example → Related Projects → Project-Specific Evidence
 */

export const CAPABILITIES = [
  {
    id: 'quote-calculator',
    title: 'Quote Calculator & Spreadsheet Engines',
    tagline: 'Replace phone sizing and messy Excel files with live calculations',
    description:
      'We turn complex business pricing rules, physical dimensions, material weights, and engineering formulas into transparent client-facing calculators with visible assumptions.',
    interactiveType: 'spreadsheet-calc',
    keyFeatures: [
      'Zero-latency parametric formula validation in the browser',
      'Visible engineering thresholds and safety limit warnings',
      'Instant contractor submittal bid packet export',
    ],
    relatedProjectIds: ['inncontrol-coils', 'lone-wolf-dumpsters', 'edr-party-rentals'],
  },
  {
    id: 'intake-routing',
    title: 'Customer Intake & Territory Routing',
    tagline: 'Qualify inbound inquiries and route them straight into dispatch',
    description:
      'We design multi-step triage workflows that branch based on customer type (e.g. residential homeowner vs commercial contractor), validate geographic delivery radius, and deliver clean job tickets.',
    interactiveType: 'dumpster-calc',
    keyFeatures: [
      'Territory & zip-code validation before checkout',
      'Differentiated intake paths for distinct buyer personas',
      'Webhook delivery straight into driver or staff schedules',
    ],
    relatedProjectIds: ['lone-wolf-dumpsters', 'edr-party-rentals', 'inncontrol-coils'],
  },
  {
    id: 'data-normalization',
    title: 'Data Cleanup & TableDocket Normalization',
    tagline: 'Standardize messy multi-source records into verified tables',
    description:
      'Messy source data from third-party tools breaks accounting and reporting. We build deterministic normalization engines that clean, validate, and standardize disparate records into clean RFC 4180 CSV tables.',
    interactiveType: 'data-normalization',
    keyFeatures: [
      'Deterministic regex token sanitization for dates, phone numbers, and currency',
      'Visual TableDocket comparing raw strings against verified ISO records',
      'Deterministic output ready for direct SQL, accounting, or CRM import',
    ],
    relatedProjectIds: ['gensort', 'signal-ops', 'revision-atlas', 'wcsm'],
  },
  {
    id: 'branded-ad-generator',
    title: 'Branded Ad & Layer Assembly Engine',
    tagline: 'Generate campaign variations dynamically with canvas compositing',
    description:
      'Eliminate repetitive manual graphic tweaks in desktop software. We engineer browser-based canvas composition engines that layer imagery, typographic hierarchy, opacity filters, and vector badges dynamically.',
    interactiveType: 'ad-generator',
    keyFeatures: [
      'Hardware-accelerated HTML5 Canvas layer compositing',
      'Real-time opacity, typography spacing, and color controls',
      'Direct high-resolution web asset export without external licenses',
    ],
    relatedProjectIds: ['made-of-reasons', 'self-cartography'],
  },
];

export const getCapabilityById = (id) => CAPABILITIES.find((c) => c.id === id);
