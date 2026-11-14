/**
 * Starter Systems & Reusable Blueprints Catalog
 * Clearly distinguishes reusable starting points from bespoke client projects.
 * Direct bridge into the Custom Builds Whiteboard and Visual Brief.
 */

export const TEMPLATES = [
  {
    id: 'quote-sizing-engine',
    title: 'Parametric Sizing & Quoting Engine',
    readiness: 'Production Blueprint',
    badge: 'Logistics & Rentals',
    description:
      'A multi-step self-sizing and fee calculation engine. Allows customers to specify project parameters, calculates volume/weight thresholds, determines zone fees, and routes directly to dispatch without phone tag.',
    derivedFrom: 'Wolf Ridge Dumpsters',
    componentsIncluded: [
      'Visual Capacity & Sizing Selector',
      'Dynamic Material Density / Weight Calculator',
      'Municipal & Postal Zone Surcharge Engine',
      'Direct-to-Dispatch Structured Intake Form',
      'Automated Order Confirmation & SMS Ready Payload',
    ],
    idealFor: 'Dumpster rental, bulk materials, equipment hire, moving fleets, waste haulers',
    deliveryTimeframe: '2–3 weeks to customize & launch',
    seedPieces: [
      { type: 'page', label: 'STEP 1: SIZING', text: 'Select project type and material density.', w: 280, h: 180 },
      { type: 'page', label: 'STEP 2: ZONE CHECK', text: 'Enter street address to check municipal delivery fees.', w: 280, h: 180 },
      { type: 'page', label: 'STEP 3: DISPATCH', text: 'Lock delivery date and drop-off placement notes.', w: 280, h: 180 },
      { type: 'note', text: 'Rule: Separate roll-off dumpster rentals from full-service junk removal crew jobs.', w: 240, h: 120 },
      { type: 'cta', text: 'CONFIRM & SCHEDULE DISPATCH ↗', w: 220, h: 48 },
    ],
  },
  {
    id: 'parametric-estimator',
    title: 'B2B Service Platform & Daily Operator HUD',
    readiness: 'Production Blueprint',
    badge: 'Commercial & Field Ops',
    description:
      'Pairs a multi-property commercial B2B service intake platform with a fast mobile daily operator check-in wizard and readiness status dashboard.',
    derivedFrom: 'INNcontrol Coils',
    componentsIncluded: [
      'Commercial B2B Multi-Property Service Intake',
      'Refurbishment vs. Replacement Value Comparison',
      'Mobile Daily Operator Check-In Wizard',
      'Top 3 Daily Field Objectives & Blocker Log',
      'Operator Readiness & After-Action Status HUD',
    ],
    idealFor: 'Commercial property services, hospitality vendors, field operations teams',
    deliveryTimeframe: '2–4 weeks to customize & launch',
    seedPieces: [
      { type: 'page', label: 'B2B INTAKE', text: 'Capture property unit volume and commercial service schedule.', w: 280, h: 180 },
      { type: 'page', label: 'DAILY CHECK-IN', text: 'Log morning readiness, top 3 field priorities, and active blockers.', w: 280, h: 180 },
      { type: 'page', label: 'OPERATOR HUD', text: 'Live readiness status dashboard and end-of-day debrief.', w: 280, h: 180 },
      { type: 'note', text: 'Operational rule: Keep daily check-ins thumb-friendly and under 2 minutes on mobile.', w: 250, h: 130 },
      { type: 'cta', text: 'LOCK DAILY PRIORITIES ↗', w: 240, h: 48 },
    ],
  },
  {
    id: 'bilingual-booking-triage',
    title: 'Bilingual Asset Booking & Conflict Lock',
    readiness: 'Production Blueprint',
    badge: 'Event Operations',
    description:
      'Real-time availability calendar with full Spanish/English parity. Prevents double-bookings, calculates distance-based travel surcharges, and enforces required safety equipment rules.',
    derivedFrom: 'EDR Party Rentals',
    componentsIncluded: [
      'Instant Dual-Language UI Switcher (ES/EN)',
      'Conflict-Free Asset Calendar with Buffer Windows',
      'Surface & Venue Requirement Rules (Grass vs Asphalt)',
      'Deposit Payment & Terms Acceptance Step',
      'Driver Delivery Manifest & Packing Checklist Generator',
    ],
    idealFor: 'Event rentals, marquee tents, AV gear, staging & lighting, mobile food equipment',
    deliveryTimeframe: '2–3 weeks to brand and connect inventory',
    seedPieces: [
      { type: 'page', label: 'EVENT & DATE', text: 'Date picker with real-time inventory conflict check.', w: 280, h: 180 },
      { type: 'page', label: 'VENUE & SURFACE', text: 'Requires user to designate grass (stakes) or asphalt (water barrels).', w: 280, h: 180 },
      { type: 'page', label: 'RESERVATION', text: 'Bilingual contract signing and deposit checkout.', w: 280, h: 180 },
      { type: 'note', text: 'Bilingual check: All error states and terms must render in customer language.', w: 240, h: 120 },
      { type: 'cta', text: 'RESERVE WITH DEPOSIT ↗', w: 220, h: 48 },
    ],
  },
  {
    id: 'visual-audit-tool',
    title: 'Evidence-First Visual Audit Engine',
    readiness: 'Production Blueprint',
    badge: 'Diagnostic & Consulting',
    description:
      'An interactive diagnostic tool that replaces bloated 60-page PDF audits with pin-based DOM visual critiques, categorized across 4 high-leverage business pillars.',
    derivedFrom: 'Website Audit System',
    componentsIncluded: [
      'Interactive URL & Technology Inspector',
      '4-Pillar Structural Framework (Message, Paths, Proof, Intake)',
      'Severity & Opportunity Classification (High Priority to Quick Win)',
      'Visual Annotation Pin Anchoring Engine',
      'Direct-to-Brief One-Click Export',
    ],
    idealFor: 'Design agencies, marketing consultancies, software auditors, UX researchers',
    deliveryTimeframe: '1–2 weeks to adapt to your audit methodology',
    seedPieces: [
      { type: 'page', label: 'URL SCANNER', text: 'Inspects website copy, hierarchy, and form endpoints.', w: 280, h: 180 },
      { type: 'page', label: '4-PILLAR MATRIX', text: 'Message Clarity, Conversion Paths, Trust & Proof, Intake & Systems.', w: 280, h: 180 },
      { type: 'page', label: 'CLIENT ROADMAP', text: 'Interactive priority dashboard with 1-click brief export.', w: 280, h: 180 },
      { type: 'note', text: 'Standard: Never report generic Lighthouse scores. Report operational bottlenecks.', w: 260, h: 130 },
      { type: 'cta', text: 'EXPORT ACTIONABLE BRIEF ↗', w: 220, h: 48 },
    ],
  },
  {
    id: 'decision-matrix-engine',
    title: 'Decision Matrix & Document Architecture',
    readiness: 'Production Blueprint',
    badge: 'Content & Strategy',
    description:
      'A spatial visualizer for long-form content, complex proposals, and multi-draft documentation. Tracks decisions, continuity, and tension across sections.',
    derivedFrom: 'Revision Atlas',
    componentsIncluded: [
      'Section Tension & Pacing Visualizer',
      'Traceable Editorial Decision Ledger',
      'Continuity Thread & Tag Tracker',
      'Multi-Draft Comparison View',
    ],
    idealFor: 'Book editors, research institutions, legal brief drafting, technical documentation teams',
    deliveryTimeframe: '3 weeks to customize for your document taxonomy',
    seedPieces: [
      { type: 'page', label: 'SECTION OUTLINE', text: 'Chapter / Section hierarchy with tension indicators.', w: 280, h: 180 },
      { type: 'page', label: 'DECISION LOG', text: 'Traceable reasons for cuts, restructuring, or additions.', w: 280, h: 180 },
      { type: 'page', label: 'CONTINUITY', text: 'Track recurring themes, entities, and logical dependencies.', w: 280, h: 180 },
      { type: 'cta', text: 'LOCK REVISION SPRINT ↗', w: 220, h: 48 },
    ],
  },
];

export const getTemplateById = (id) => TEMPLATES.find((t) => t.id === id);
