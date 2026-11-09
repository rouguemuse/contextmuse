/**
 * Authoritative Project Catalog for Context & Muse
 * Grounded in verified client platforms, working software, civic initiatives, and creative practice.
 */

export const PROJECT_TIERS = [
  { id: 'all', label: 'All Projects' },
  { id: 'featured', label: 'Featured Systems & Working Software' },
  { id: 'demonstration', label: 'Creative Practice & Diagnostic Tools' },
];

export const PROJECT_CATEGORIES = PROJECT_TIERS;

export const PROJECTS = [
  // 01: WOLF RIDGE DUMPSTERS
  {
    id: 'lone-wolf-dumpsters',
    tier: 'featured',
    evidenceType: 'screenshot',
    liveUrl: 'https://lonewolf-dumpsters.vercel.app/',
    mediaUrl: '/assets/images/lonewolf-screenshot.webp',
    coverImage: '/assets/images/lonewolf-cover.webp',
    coverStyle: 'charcoal',
    coverColor: '#23282A',
    coverTextColor: '#EDE9E0',
    illustrationType: 'dumpster-calc',
    title: 'Wolf Ridge Dumpsters',
    subtitle: 'Regional Roll-Off Logistics, Dual-Service Intake & 48-City Municipal Lead Engine',
    year: '2024–2025',
    sector: 'Waste logistics & regional equipment rentals (Dallas–Fort Worth, TX)',
    role: 'System Architecture, Localized SEO, Dual-Service Customer Intake',
    plainSentence:
      'Gives homeowners and contractors transparent 15, 20, and 25-yard container sizing, flat-rate pricing, and dual-track intake across 48 DFW municipal landing pages.',
    summary:
      'A multi-city roll-off dumpster and junk removal operator bogged down by repetitive phone-order sizing calls. I built a transparent sizing, flat-rate pricing, and dual-service intake platform across 48 DFW municipal pages that routes structured orders straight to dispatch.',
    originalBrand: {
      name: 'Wolf Ridge Highway Theme',
      primary: '#F59E0B',
      accent: '#111827',
      surface: '#F9FAFB',
      text: '#1F2937',
    },
    overview: {
      needed:
        'Dispatchers were fielding repetitive phone questions about 15, 20, and 25-yard container dimensions, included tonnage allowances, and whether a job required a roll-off dumpster or a full-service junk removal crew.',
      built:
        'Transparent flat-rate container cards (15 / 20 / 25-yard with dimensions, pickup-truck load equivalents, and tonnage allowances), differentiated intake paths for Dumpster Rental vs. Junk Removal, and 48 geo-targeted DFW municipal landing pages.',
      enables:
        'Homeowners and contractors confirm container size, flat-rate pricing, and service rules upfront, sending structured drop orders directly to dispatch without phone tag.',
    },
    tangibleOutput: {
      title: 'Structured Dispatch Drop Sheet',
      description:
        'An automated order payload detailing service track, container size, flat-rate base price, included tonnage, placement instructions, and DFW municipal corridor.',
      previewText:
        'Order #WR-4812 · Plano, TX · Track: Roll-Off Dumpster Rental · 20-Yard ($425 / 2.5 Tons incl.) · Driveway placement · Debris: Remodel Drywall · Drop: Friday 07:00 AM',
    },
    howItsBuilt: {
      requirements: [
        'Must cover 48 distinct DFW municipalities with localized search relevance and Schema.org LocalBusiness metadata.',
        'Must separate self-load Roll-Off Dumpster Rental intake from full-service Junk Removal crew requests.',
        'Must state container dimensions, pickup truck load equivalents, and included tonnage upfront ($385 / 2.0T for 15-yd, $425 / 2.5T for 20-yd, $475 / 3.0T for 25-yd).',
      ],
      flowDiagram: {
        steps: [
          { from: 'Municipal Landing', label: 'Customer arrives via one of 48 DFW city pages (e.g., Plano, Frisco, McKinney, Fort Worth)' },
          { from: 'Service Triage', label: 'Selects Track 1 (Roll-Off Dumpster Rental) or Track 2 (Full-Service Junk Removal)' },
          { from: 'Container Sizing', label: 'Matches project scope to 15, 20, or 25-yard container specs and tonnage allowance' },
          { from: 'Dispatch Intake', label: 'Submits structured placement and scheduling payload straight to dispatch' },
        ],
      },
      keyDecisions: [
        {
          decision: '48 Programmatic DFW Municipal Pages',
          rationale:
            'Rather than a single generic service page, 48 city-specific landing pages match local search intent across Collin, Dallas, Denton, and Tarrant counties.',
        },
        {
          decision: 'Upfront Flat-Rate & Tonnage Transparency',
          rationale:
            'Publishing exact container dimensions, truck-load equivalents, and tonnage caps upfront removes pricing ambiguity before the customer calls.',
        },
        {
          decision: 'Dual-Track Intake Separation',
          rationale:
            'Separating roll-off container drops from full-service junk removal crew jobs ensures dispatchers get the right operational details for each service type.',
        },
      ],
      limitations:
        'Final truck route scheduling runs in the operator’s dispatch workflow; the web platform handles local discovery, sizing clarity, and structured intake. (Deployed on Vercel at lonewolf-dumpsters.vercel.app under internal build codename Lone Wolf.)',
      groupedTech: [
        { group: 'Interface', items: ['Responsive container comparison cards & dual-track intake forms', 'High-contrast highway amber & asphalt design system'] },
        { group: 'Architecture', items: ['48 DFW municipal landing pages with Schema.org LocalBusiness structured data', 'Vercel edge deployment'] },
        { group: 'Intake', items: ['Differentiated lead capture for Roll-Off Rental vs. Junk Removal dispatch'] },
      ],
    },
    implementationTable: [
      { tool: 'Transparent 15 / 20 / 25-yard sizing cards', enables: 'Lets customers compare dimensions, pickup truck equivalents, and tonnage allowances upfront' },
      { tool: '48 DFW municipal landing pages', enables: 'Captures city-specific search intent across the Dallas–Fort Worth metroplex' },
      { tool: 'Dual-track service intake', enables: 'Routes self-load dumpster rentals and full-service junk removal jobs with clean job details' },
    ],
    artifacts: [
      '15 / 20 / 25-Yard Flat-Rate Sizing Matrix',
      '48 DFW Municipal Landing Pages',
      'Dual-Track Dumpster vs. Junk Removal Intake',
      'Structured Dispatch Order Payload',
    ],
    tags: {
      visitorNeeds: ['Lead Intake', 'Quote Calculator', 'Local SEO'],
      capabilities: ['Quote Calculator', 'Intake Routing'],
      evidenceTypes: ['Live Website', 'Production Screenshot', 'Operational Workflow'],
      technologies: ['JavaScript', 'Schema.org', 'Programmatic SEO', 'Vercel'],
    },
  },

  // 02: INNCONTROL COILS
  {
    id: 'inncontrol-coils',
    tier: 'featured',
    evidenceType: 'screenshot',
    liveUrl: 'https://inncontrolcoils.com',
    mediaUrl: '/assets/images/inncontrol-commercial-platform.webp',
    coverStyle: 'teal',
    coverColor: '#17504A',
    coverTextColor: '#EDE9E0',
    illustrationType: 'inncontrol-ops',
    title: 'INNcontrol Coils',
    subtitle: 'Nationwide Hotel PTAC Coil Refurbishing Platform & Operator Dashboards',
    year: '2024–2025',
    sector: 'Commercial hospitality HVAC & PTAC coil refurbishing',
    role: 'Commercial Web Platform, B2B Intake, Internal Operator Dashboards',
    plainSentence:
      'Pairs a nationwide B2B commercial platform for volume hotel PTAC coil refurbishing with custom internal daily check-in and operator readiness dashboards.',
    summary:
      'Built for a nationwide commercial PTAC and HVAC coil refurbishing provider serving volume hotel properties. Combines the public B2B service and multi-property intake platform (inncontrolcoils.com) with custom internal daily operator check-in and status HUD tools.',
    originalBrand: {
      name: 'INNcontrol Industrial Brand',
      primary: '#0F2B48',
      accent: '#FF6B00',
      surface: '#F1F5F9',
      text: '#0F172A',
    },
    overview: {
      needed:
        'A clear commercial web presence geared toward volume hospitality operators needing deep PTAC coil restoration, alongside low-friction internal tools to structure daily operator check-ins and field priorities.',
      built:
        'The public B2B platform at inncontrolcoils.com plus custom internal operator tools: a mobile daily check-in wizard and an interactive operator readiness & objective status HUD.',
      enables:
        'Hotel ownership groups can evaluate PTAC coil refurbishing vs. premature unit replacement, while internal operators run structured morning check-ins and end-of-day debriefs.',
    },
    tangibleOutput: {
      title: 'B2B Property Intake & Daily Operator Debrief',
      description:
        'Coordinates commercial multi-property service inquiries on the public platform with structured daily priority and readiness tracking on the internal operator dashboard.',
      previewText:
        'Commercial Intake: Volume Hotel PTAC Deep Coil Restoration · Internal Ops HUD: Morning Check-In Complete · Top 3 Field Objectives Locked · EOD After-Action Debrief Ready',
    },
    howItsBuilt: {
      requirements: [
        'Public site must speak directly to hotel general managers, regional engineers, and hospitality ownership groups managing high unit counts.',
        'Internal daily check-in tool must work quickly on mobile without heavy project-management bloat.',
        'Operator dashboard must translate daily habits, maintenance routines, and top priorities into an engaging visual status HUD.',
      ],
      flowDiagram: {
        steps: [
          { from: 'B2B Discovery', label: 'Hotel operator inspects PTAC coil restoration process and cost-saving case on inncontrolcoils.com' },
          { from: 'Property Intake', label: 'Submits property unit volume and scheduling inquiry' },
          { from: 'Operator Check-In', label: 'Internal mobile wizard logs morning readiness, top 3 priorities, and active blockers' },
          { from: 'Readiness HUD', label: 'Updates live operator status dashboard and end-of-day after-action debrief' },
        ],
      },
      keyDecisions: [
        {
          decision: 'Refurbishment vs. Replacement Positioning',
          rationale:
            'Focuses the public platform on what hotel operators care about most: restoring airflow, eliminating room odors/mold, and extending PTAC lifespan without full unit replacement costs.',
        },
        {
          decision: 'Thumb-Friendly Daily Check-In Wizard',
          rationale:
            'Replaces scattered notes with a fast step-by-step morning and evening check-in tailored to the operator’s actual daily rhythm.',
        },
        {
          decision: 'Gamified Operator Status HUD',
          rationale:
            'Turns routine daily operational tracking into an immediate visual readout of readiness, active buffs, and completed field objectives.',
        },
      ],
      limitations:
        'Internal operator dashboards are private tools built for daily workflow tracking rather than public multi-tenant SaaS.',
      groupedTech: [
        { group: 'Public Platform', items: ['Responsive commercial web platform (inncontrolcoils.com)', 'Multi-property hospitality service intake'] },
        { group: 'Internal Dashboards', items: ['Mobile daily check-in wizard (scott-daily / scott-app)', 'Interactive operator readiness & objective HUD (rpg-dashboard)'] },
      ],
    },
    implementationTable: [
      { tool: 'Commercial B2B platform (inncontrolcoils.com)', enables: 'Presents nationwide PTAC coil restoration clearly to hotel ownership and engineering teams' },
      { tool: 'Mobile daily check-in wizard', enables: 'Captures morning readiness, top 3 daily priorities, and evening after-action notes in minutes' },
      { tool: 'Operator status HUD', enables: 'Visualizes daily operational consistency and active field objectives in one screen' },
    ],
    artifacts: [
      'Commercial B2B Web Platform (inncontrolcoils.com)',
      'Multi-Property Hospitality Service Intake',
      'Mobile Daily Operator Check-In Wizard',
      'Interactive Operator Readiness HUD',
    ],
    tags: {
      visitorNeeds: ['Lead Intake', 'Internal Tools', 'Operator Dashboard'],
      capabilities: ['Intake Routing', 'Workflow Engine'],
      evidenceTypes: ['Live Website', 'Production Screenshot', 'Internal Tooling'],
      technologies: ['JavaScript', 'Responsive Web', 'Local-First State'],
    },
  },

  // 03: GENSORT
  {
    id: 'gensort',
    tier: 'featured',
    availableForAcquisition: true,
    statusBadge: 'Working Local-First Application',
    evidenceType: 'screenshot',
    liveUrl: '/cxm_gensort/index.html',
    mediaUrl: '/assets/images/gensort-library.webp',
    coverStyle: 'charcoal',
    coverColor: '#23282A',
    coverTextColor: '#EDE9E0',
    illustrationType: 'gensort-workflow',
    title: 'GenSort',
    subtitle: 'Local-First Visual Asset Classification, AI Metadata & Curation Engine',
    year: '2025–2026',
    sector: 'Creative production tooling & digital asset management',
    role: 'Product Architecture, Binary Metadata Parser, Perceptual Hashing Engine',
    plainSentence:
      'Ingests mixed folders of AI renders, screenshots, and design assets locally in the browser to extract prompts, flag duplicates, score readiness, and export clean manifests.',
    summary:
      'High-volume creative and AI workflows generate thousands of unorganized files with cryptic names and hidden generation metadata. GenSort is a local-first curation workbench that runs a complete 5-stage workflow — Import, Understand, Organize, Review, and Export — with zero cloud uploads.',
    originalBrand: {
      name: 'GenSort Studio Obsidian & Gold',
      primary: '#09090E',
      accent: '#C9A84C',
      surface: '#12121A',
      text: '#F5F3EF',
    },
    overview: {
      needed:
        'Creative teams and AI operators accumulate thousands of Midjourney, ComfyUI, Stable Diffusion, and screenshot files across local folders, losing track of which prompt, seed, or CFG scale produced the winning asset.',
      built:
        'A local-first React + IndexedDB application with binary PNG/EXIF/XMP metadata extraction, 64-bit dHash perceptual duplicate detection, automated 0–100 readiness scoring, side-by-side parameter diffing, and structured manifest export.',
      enables:
        'Users can load a local folder (or test immediately with the built-in Sample Studio Dataset), inspect embedded AI parameters, cull duplicates, batch-rename survivors, and export JSON/CSV manifests.',
    },
    tangibleOutput: {
      title: 'Structured JSON / CSV Asset Manifest & Cleanup Report',
      description:
        'Exports standardized asset files alongside a machine-readable JSON/CSV manifest containing extracted prompts, seeds, readiness scores, dominant hex palettes, and session cleanup statistics.',
      previewText:
        'gensort-manifest.json · 8 Studio Assets · mj_brutalist_atrium_v1.png (Readiness: 92/100 · Midjourney · Seed: 884920144) · 1 Exact Duplicate Group Flagged',
    },
    howItsBuilt: {
      requirements: [
        '100% local-first privacy: files are read directly from disk via File System Access API / drag-and-drop and stored in IndexedDB without cloud uploads.',
        'Must parse raw binary PNG tEXt/iTXt chunks, EXIF tags, and XMP packets to recover ComfyUI, Automatic1111, Midjourney, andInvokeAI parameters.',
        'Must remain responsive across large libraries using virtualized grid rendering and background Web Workers for perceptual hashing.',
      ],
      flowDiagram: {
        steps: [
          { from: '01 / Import', label: 'Scans local folder, dropped files, or the built-in Sample Studio Dataset into IndexedDB' },
          { from: '02 / Understand', label: 'Extracts AI prompt/seed/model metadata, dominant colors, and 0–100 Readiness Score' },
          { from: '03 / Organize', label: 'Filters by AI source, media type, color, tags, and collections with smart search' },
          { from: '04 / Review', label: 'Detects exact & visual duplicates via 64-bit dHash worker and diffs AI parameters side-by-side' },
          { from: '05 / Export', label: 'Batch-renames selected assets and exports JSON, CSV, and TXT cleanup reports' },
        ],
      },
      keyDecisions: [
        {
          decision: 'Custom Binary Chunk Parser Instead of Heavy Server Backends',
          rationale:
            'Inspecting PNG tEXt/iTXt and EXIF/XMP chunks directly in client-side ArrayBuffers extracts full generation lineage with zero upload latency.',
        },
        {
          decision: 'Web Worker dHash Perceptual Similarity',
          rationale:
            'Offloading Hamming-distance comparisons of 64-bit perceptual hashes to a background Web Worker keeps the UI at 60 FPS during duplicate review.',
        },
        {
          decision: 'Built-In Sample Studio Dataset for Instant Browser Evaluation',
          rationale:
            'Lets visitors and acquirers test all five workflow stages immediately in any browser before mounting a local directory.',
        },
      ],
      limitations:
        'Direct folder writing uses the Chromium File System Access API; non-Chromium browsers use the direct JSON/CSV/Report download pipeline.',
      groupedTech: [
        { group: 'Core Engine', items: ['React 19 + Dexie.js (IndexedDB) local persistence', 'Virtualized asset grid with dynamic column scaling'] },
        { group: 'Forensics & Vision', items: ['Binary PNG tEXt/iTXt, EXIF & XMP AI metadata parser', '64-bit dHash perceptual hash & Web Worker similarity matcher', '0–100 Readiness Score & k-means color palette extractor'] },
        { group: 'Workflow & Export', items: ['Side-by-side Compare View with AI Parameter Diff table', 'Pattern-based batch renamer & JSON / CSV / TXT manifest exporter'] },
      ],
    },
    implementationTable: [
      { tool: 'Binary PNG / EXIF / XMP parser', enables: 'Recovers prompts, negative prompts, seeds, steps, samplers, and CFG scales from raw image files' },
      { tool: '64-bit dHash & Web Worker engine', enables: 'Groups exact and near-identical visual variations and highlights the highest-readiness candidate' },
      { tool: 'Compare View & Manifest Exporter', enables: 'Diffs generation parameters side-by-side and exports clean JSON/CSV production manifests' },
    ],
    artifacts: [
      '5-Stage Local-First Curation Workbench',
      'Binary AI Metadata & Lineage Inspector',
      'Side-by-Side Parameter Diff Table',
      'JSON / CSV Manifest & Cleanup Report Exporter',
    ],
    tags: {
      visitorNeeds: ['AI Tooling', 'Asset Management', 'Data Cleanup', 'Workflow Tool'],
      capabilities: ['Data Cleanup', 'Workflow Engine'],
      evidenceTypes: ['Working Application', 'Interactive System', 'Available for Acquisition'],
      technologies: ['React', 'IndexedDB', 'Web Workers', 'Perceptual Hashing', 'Binary Parsing'],
    },
  },

  // 04: REVISION ATLAS
  {
    id: 'revision-atlas',
    tier: 'demonstration',
    evidenceType: 'case-study',
    liveUrl: null,
    mediaUrl: '/assets/images/revision-atlas-cover.webp',
    coverStyle: 'parchment',
    coverColor: '#DFDACE',
    coverTextColor: '#23282A',
    illustrationType: 'manuscript-matrix',
    title: 'Revision Atlas',
    subtitle: 'Structural Revision Workbench for Long-Form Prose',
    year: '2024–2025',
    sector: 'Editorial technology & literary publishing',
    role: 'Product Architecture, Structural Mapping, Pacing Telemetry',
    plainSentence:
      'Breaks down 60,000+ word manuscripts into queryable scenes, pacing telemetry, and side-by-side drafts with revision diffs.',
    summary:
      'Developmental editing on book-length manuscripts suffers from flat-document blindness. We built a structural revision environment that parses prose into addressable scene nodes, visual pacing metrics, and non-destructive draft branches.',
    originalBrand: {
      name: 'Revision Atlas Editorial Tone',
      primary: '#1C1917',
      accent: '#CA8A04',
      surface: '#F5F5F4',
      text: '#292524',
    },
    overview: {
      needed:
        'Revising 80,000+ word manuscripts in standard word processors creates severe cognitive overload: invisible cascading effects, pacing blind spots, and fear of destructive edits.',
      built:
        'A deterministic ingestion pipeline that converts Markdown/DOCX into an AST scene tree with dialogue ratios, motif tracking, and a side-by-side variant drafting workbench.',
      enables:
        'Authors and developmental editors can test rewrite variations, see downstream timeline ripples, and track narrative pacing without duplicating sprawling files.',
    },
    tangibleOutput: {
      title: 'Scene Tension & Revision Diff Report',
      description:
        'A dual-pane comparative view showing word-level text changes between draft passes alongside calculated dialogue-to-exposition balance scores.',
      previewText:
        'Scene 14: “The River Threshold” · Dialogue ratio: 42% (+14% from Draft 2) · Downstream ripple: Flagged Chapter 19 mention of unopened letter',
    },
    howItsBuilt: {
      requirements: [
        '100% local execution with zero third-party AI training or unauthorized model leakage of sensitive manuscript drafts.',
        'Non-destructive versioning: every scene maintains immutable content hashes and lightweight diff branches.',
        'High-performance parsing capable of chunking 120,000 words into interactive nodes in under 2 seconds.',
      ],
      flowDiagram: {
        steps: [
          { from: 'Prose Ingestion', label: 'Parses Markdown/DOCX into a canonical Abstract Syntax Tree (AST)' },
          { from: 'Scene Graphing', label: 'Binds paragraphs into addressable nodes by temporal markers and POV' },
          { from: 'Pacing Telemetry', label: 'Extracts dialogue-to-narrative ratios and recurring motif frequencies' },
          { from: 'Variant Workbench', label: 'Renders side-by-side drafts with paragraph-level diff cherry-picking' },
        ],
      },
      keyDecisions: [
        {
          decision: 'Hierarchical Scene Graph Instead of Plain Text',
          rationale:
            'Treating a manuscript as a tree of addressable nodes lets authors reorder chapters or edit scenes without breaking document structure.',
        },
        {
          decision: 'Descriptive, Not Prescriptive, Telemetry',
          rationale:
            'The tool never tells a writer how to write; it simply illuminates existing narrative momentum and dialogue distribution.',
        },
        {
          decision: 'Local Immutable Storage',
          rationale:
            'Writers have extreme data privacy requirements. All draft revisions and hashes stay on the author’s local machine.',
        },
      ],
      limitations:
        'Designed specifically for narrative prose and developmental editing; not intended as a typographic book layout or typesetting tool.',
      groupedTech: [
        { group: 'Parsing & AST', items: ['Custom Markdown/DOCX parser: extracts canonical scene boundaries', 'Content-addressed hashing: tracks revision history'] },
        { group: 'Telemetry', items: ['Dialogue-ratio analyzer: calculates spoken vs exposition rhythm', 'Motif tracker: queries recurring symbols and questions'] },
        { group: 'Interface', items: ['Dual-pane diff editor: highlights word-level additions and deletions', 'Interactive timeline: visualizes narrative tension'] },
      ],
    },
    implementationTable: [
      { tool: 'AST scene tree parser', enables: 'Decomposes 80k+ word manuscripts into queryable, addressable units' },
      { tool: 'Visual pacing telemetry', enables: 'Calculates dialogue-to-exposition ratios and identifies pacing lulls' },
      { tool: 'Dual-pane variant workbench', enables: 'Allows side-by-side draft experimentation without file duplication' },
    ],
    artifacts: [
      'AST Scene Tree Decomposition',
      'Dialogue-to-Narrative Pacing Visualizer',
      'Dual-Pane Variant Drafting Workbench',
      'Downstream Continuity Ripple Validator',
    ],
    tags: {
      visitorNeeds: ['Editorial Systems', 'Information Architecture', 'Workflow Tool'],
      capabilities: ['Data Cleanup', 'Workflow Engine'],
      evidenceTypes: ['Production System', 'Product Case Study', 'Cover Artwork'],
      technologies: ['AST Parsing', 'React', 'Local-First Architecture', 'Diff Engine'],
    },
  },

  // 05: EDR PARTY RENTALS
  {
    id: 'edr-party-rentals',
    tier: 'featured',
    evidenceType: 'interactive-demo',
    coverStyle: 'mustard',
    coverColor: '#D9A62E',
    coverTextColor: '#23282A',
    illustrationType: 'reservation',
    title: 'EDR Party Rentals',
    subtitle: 'Bilingual Event Inventory & Date-Based Reservation Triage',
    year: '2023–2024',
    sector: 'Commercial event rentals & tent logistics',
    role: 'Bilingual System Architecture, Real-Time Availability, Deposit Flow',
    plainSentence:
      'Locks unique physical rental assets across reservation dates and provides full English and Spanish parity for quotes and deposits.',
    summary:
      'High-volume event rentals suffer from weekend double-bookings and language friction. We built an asset-aware reservation system with delivery radius validation and complete English/Spanish parity.',
    originalBrand: {
      name: 'EDR Party Rentals Palette',
      primary: '#E25822',
      accent: '#F4A261',
      surface: '#FAF7F2',
      text: '#264653',
    },
    overview: {
      needed:
        'Peak graduation and wedding weekends caused double-bookings across phone and social channels. Additionally, customers outside the delivery radius ordered items that required tedious manual refunds.',
      built:
        'A serial-item reservation calendar that locks equipment during checkout, calculates mileage delivery surcharges, and provides full bilingual English/Spanish parity.',
      enables:
        'Customers can verify inventory availability for their exact weekend and complete deposit checkout in their preferred language with clear delivery fees.',
    },
    tangibleOutput: {
      title: 'Warehouse Pull Sheet & Reservation Confirmation',
      description:
        'A confirmed booking record specifying equipment serial numbers, surface tie-down safety rules (concrete vs grass), and driver route instructions.',
      previewText:
        'Res #EDR-9041 · Oct 18–20 · 20x40 Marquee Tent (Serial #T-04) · Surface: Concrete (4x 200lb water barrels auto-added) · Language: ES · Deposit Paid: $350',
    },
    howItsBuilt: {
      requirements: [
        'Complete bilingual parity: every product description, safety waiver, and error state must exist identically in Spanish and English.',
        'Surface safety rules: concrete setup requires mandatory ballast barrels; grass permits standard stake anchors.',
        'Serial inventory locking: holds item for 15 minutes during checkout to eliminate double-booking.',
      ],
      flowDiagram: {
        steps: [
          { from: 'Event Date Picker', label: 'Customer selects event dates; calendar filters out already-booked assets' },
          { from: 'Radius Validation', label: 'Zip code lookup assigns delivery tier (Standard, Extended, or Out-of-Area)' },
          { from: 'Surface Safety Triage', label: 'Selecting asphalt/concrete automatically injects required tie-down fees' },
          { from: 'Deposit Checkout', label: 'Bilingual contract agreement and deposit collection completes booking' },
        ],
      },
      keyDecisions: [
        {
          decision: 'Persistent Dual-Language State',
          rationale:
            'Switching languages never resets selected dates, cart contents, or custom delivery addresses.',
        },
        {
          decision: 'Rule-Based Safety Equipment Injection',
          rationale:
            'Automatically adding water barrels for asphalt setups prevents regulatory safety violations without relying on customer memory.',
        },
        {
          decision: 'Clear Mileage Tiers',
          rationale:
            'Upfront travel surcharge calculation prevents awkward follow-up calls requesting extra delivery money.',
        },
      ],
      limitations:
        'Multi-day multi-venue corporate festivals require custom logistics dispatch coordination.',
      groupedTech: [
        { group: 'Interface', items: ['React: responsive bilingual booking grid with instant date filtering', 'Tailwind CSS: festive brand palette'] },
        { group: 'State & i18n', items: ['Custom bilingual dictionary: zero-dependency runtime translation with state preservation'] },
        { group: 'Rules Engine', items: ['Surface tie-down rule evaluator', 'Mileage delivery radius calculator'] },
      ],
    },
    implementationTable: [
      { tool: 'React state & calendar triage', enables: 'Locks inventory availability across reservation dates and eliminates double-bookings' },
      { tool: 'Bilingual i18n dictionary', enables: 'Provides total parity between Spanish and English for every error state and contract clause' },
      { tool: 'Delivery radius & anchor rules', enables: 'Dynamically calculates travel mileage and injects mandatory safety equipment fees' },
    ],
    artifacts: [
      'Bilingual Asset Availability Calendar',
      'Dynamic Anchor & Surface Surcharge Engine',
      'Contract & Deposit Intake Workflow',
      'Weekend Route Manifest Generator',
    ],
    tags: {
      visitorNeeds: ['Inventory Booking', 'Bilingual UI', 'Delivery Rules'],
      capabilities: ['Intake Routing', 'Quote Calculator'],
      evidenceTypes: ['Interactive System', 'Operational Workflow'],
      technologies: ['React', 'i18n State', 'Inventory Lock Engine'],
    },
  },

  // 06: MAPS WITH TEETH
  {
    id: 'maps-with-teeth',
    tier: 'featured',
    evidenceType: 'screenshot',
    liveUrl: 'https://www.mapswithteeth.org/',
    mediaUrl: '/assets/images/mapswithteeth-screenshot.webp',
    coverStyle: 'charcoal',
    coverColor: '#23282A',
    coverTextColor: '#EDE9E0',
    illustrationType: 'civic-continuity',
    title: 'Maps With Teeth',
    subtitle: 'Public-Interest Civic Continuity & Barrier-First Resource Intelligence',
    year: '2024–2025',
    sector: 'Civic systems & public-interest resource navigation',
    role: 'Founder, Continuity Architecture, Barrier-First Information Design',
    plainSentence:
      'An independent public-interest initiative building portable continuity and barrier-first resource intelligence for people navigating complex institutional systems across unshared jurisdictions.',
    summary:
      'Standard resource directories assume agencies share records and eligibility rules are transparent. Maps With Teeth is an independent civic initiative (mapswithteeth.org) that maps real institutional prerequisites, documentation traps, and cross-jurisdiction handoffs.',
    originalBrand: {
      name: 'Civic Continuity Palette',
      primary: '#1C1917',
      accent: '#D97706',
      surface: '#F5F5F4',
      text: '#1C1917',
    },
    overview: {
      needed:
        'People navigating crisis, housing, legal, or medical transitions across counties face fragmented agencies that do not share records, forcing them to repeat intake from scratch and hit hidden eligibility barriers.',
      built:
        'A barrier-first resource intelligence architecture and portable continuity model that flags institutional prerequisites upfront and includes crisis-safe quick-exit protections.',
      enables:
        'Navigators, advocates, and individuals can see real eligibility constraints, documentation requirements, and handoff gaps before spending hours in an institutional dead end.',
    },
    tangibleOutput: {
      title: 'Barrier-First Resource & Continuity Dossier',
      description:
        'A structured continuity record highlighting real intake prerequisites, cross-county jurisdiction handoffs, and documentation requirements.',
      previewText:
        'Continuity Record · County A → County B Handoff · Barrier Flag: Hard-copy ID + residency affidavit required prior to intake · Quick-Exit Safety Layer: Active',
    },
    howItsBuilt: {
      requirements: [
        'Must surface real institutional barriers (ID requirements, waitlists, residency cutoffs, hours of operation) before sending someone to a provider.',
        'Must preserve user continuity when crossing city, county, or agency boundaries that do not share intake systems.',
        'Must incorporate trauma-informed, crisis-safe UX patterns including immediate quick-exit controls.',
      ],
      flowDiagram: {
        steps: [
          { from: 'Situation Triage', label: 'Identifies immediate need and current jurisdictional boundary' },
          { from: 'Barrier Inspection', label: 'Flags real eligibility rules, required documents, and intake friction upfront' },
          { from: 'Continuity Packet', label: 'Structures portable context so the person does not start over at the next agency' },
          { from: 'Safe Exit Layer', label: 'Maintains privacy and instant browser quick-exit protection throughout' },
        ],
      },
      keyDecisions: [
        {
          decision: 'Barrier-First Directory Design',
          rationale:
            'Listing a phone number without disclosing a 6-month waitlist or strict residency rule wastes scarce time and trust; barriers are shown first.',
        },
        {
          decision: 'Portable User-Held Continuity',
          rationale:
            'When institutions cannot or should not share centralized databases, giving the individual a clean portable summary bridges the handoff gap.',
        },
        {
          decision: 'Crisis-Safe Interface Architecture',
          rationale:
            'Includes persistent quick-exit controls and low-cognitive-load typography designed for high-stress operating conditions.',
        },
      ],
      limitations:
        'Independent public-interest initiative in active development; resource verification depends on ongoing jurisdictional auditing.',
      groupedTech: [
        { group: 'Information Architecture', items: ['Barrier-first resource schema: indexes prerequisites, exclusions, and handoff requirements', 'Cross-jurisdiction continuity model'] },
        { group: 'Safety & UX', items: ['Crisis-safe quick-exit interaction layer', 'High-clarity accessible editorial interface (mapswithteeth.org)'] },
      ],
    },
    implementationTable: [
      { tool: 'Barrier-first resource schema', enables: 'Surfaces real documentation prerequisites and eligibility cutoffs before intake' },
      { tool: 'Portable continuity structure', enables: 'Bridges fragmented agencies across unshared municipal and county jurisdictions' },
      { tool: 'Crisis-safe quick-exit UX', enables: 'Protects user safety and reduces cognitive load under high-stress conditions' },
    ],
    artifacts: [
      'Barrier-First Resource Intelligence Schema',
      'Cross-Jurisdiction Continuity Model',
      'Crisis-Safe Quick-Exit UX Layer',
      'Public-Interest Initiative Platform (mapswithteeth.org)',
    ],
    tags: {
      visitorNeeds: ['Civic Systems', 'Information Architecture', 'Resource Navigation'],
      capabilities: ['Intake Routing', 'Workflow Engine'],
      evidenceTypes: ['Live Website', 'Production Screenshot', 'Civic Initiative'],
      technologies: ['Information Architecture', 'Accessible UX', 'Continuity Systems'],
    },
  },

  // 07: HOW TO EXPLAIN YOURSELF TO WOLVES (Creative Practice)
  {
    id: 'how-to-explain-yourself-to-wolves',
    tier: 'demonstration',
    evidenceType: 'screenshot',
    liveUrl: 'https://howtoexplainyourselftowolves.com/',
    mediaUrl: '/assets/images/wolves_preview_main.jpg',
    coverStyle: 'charcoal',
    coverColor: '#23282A',
    coverTextColor: '#EDE9E0',
    illustrationType: 'wolves-literary',
    title: 'How to Explain Yourself to Wolves',
    subtitle: 'Symbolic World, Allegorical Memoir & Field Archive',
    year: '2024–2025',
    sector: 'Creative practice & narrative systems',
    role: 'Author, World Architecture, Information Design',
    plainSentence:
      'A literary companion website, story world, field archive, and emerging atlas of Self Cartography examining what happens when explanation is no longer a path to safety.',
    summary:
      'A literary companion website, story world, field archive, and emerging atlas of Self Cartography examining what happens when explanation is no longer a path to safety.',
    originalBrand: {
      name: 'Wolves Allegorical Palette',
      primary: '#1F1F1D',
      accent: '#A31D1D',
      surface: '#FAF8F5',
      text: '#3B3A36',
    },
    overview: {
      needed:
        'Translating complex psychological and narrative themes into an evocative digital experience that honors both literary depth and visual discipline.',
      built:
        'A dedicated digital world, field archive of symbolic objects (The Red Thread, Valley of Please Understand Me), and an architectural narrative atlas.',
      enables:
        'Readers and collaborators can explore narrative artifacts, manuscript excerpts, and conceptual field notes within a cohesive atmospheric environment.',
    },
    tangibleOutput: {
      title: 'Field Archive Dossier & Symbolic Studies',
      description:
        'Curated visual studies and manuscript artifacts documenting key conceptual nodes across the Wolves story world.',
      previewText:
        'Artifact: "The Red Thread" · Symbolic study of continuity vs entanglement · Companion archive at howtoexplainyourselftowolves.com',
    },
    howItsBuilt: {
      requirements: [
        'Must convey emotional resonance without compromising typographic precision and structural clarity.',
        'Must connect narrative prose to visual artifacts and symbolic field notes.',
      ],
      flowDiagram: {
        steps: [
          { from: 'Manuscript Prose', label: 'Primary narrative chapters examining safety, explanation, and autonomy' },
          { from: 'Symbolic Artifacts', label: 'Visual object studies illustrating recurring motifs and themes' },
          { from: 'Companion Archive', label: 'Structured index of symbolic territories (Valley of Please Understand Me)' },
        ],
      },
      keyDecisions: [
        {
          decision: 'Atmospheric Editorial Layout',
          rationale:
            'Combines disciplined editorial typography with symbolic object studies to evoke contemplative stillness.',
        },
      ],
      limitations: 'A literary and creative practice project, not an enterprise business automation system.',
      groupedTech: [
        { group: 'Typography & Layout', items: ['Editorial serif & structured specimen typography', 'Atmospheric artifact archive'] },
        { group: 'Narrative Architecture', items: ['Companion world building', 'Field archive indexing'] },
      ],
    },
    implementationTable: [
      { tool: 'Atmospheric editorial design', enables: 'Creates an immersive narrative experience that honors literary prose' },
      { tool: 'Symbolic artifact catalog', enables: 'Grounds conceptual themes in tangible visual studies' },
    ],
    artifacts: ['The Red Thread Object Study', 'Valley of Please Understand Me Archive', 'Self Cartography Field Notes'],
    tags: {
      visitorNeeds: ['Creative Practice', 'Narrative Systems', 'Visual Essay'],
      capabilities: ['Workflow Engine'],
      evidenceTypes: ['Live Website', 'Artwork', 'Literary System'],
      technologies: ['Editorial Design', 'Typography', 'Narrative IA'],
    },
  },

  // 08: MADE OF REASONS (Interactive Creative Work)
  {
    id: 'made-of-reasons',
    tier: 'demonstration',
    evidenceType: 'screenshot',
    liveUrl: 'https://www.madeofreasons.com',
    mediaUrl: '/assets/images/madeofreasons-screenshot.webp',
    coverStyle: 'teal',
    coverColor: '#17504A',
    coverTextColor: '#EDE9E0',
    illustrationType: 'interactive-demo',
    title: 'MadeOfReasons',
    subtitle: '3D Relational Node Canvas & Dedication Archive',
    year: '2024',
    sector: 'Creative code & spatial web applications',
    role: 'WebGL Node Canvas, Relational Database, Dedication Engine',
    plainSentence:
      'An interactive spatial canvas mapping personal dedications, star-nodes, and relational memories in 3D WebGL space.',
    summary:
      'An interactive web application mapping star-nodes, personalized dedications, and relational records in 3D canvas space.',
    originalBrand: {
      name: 'Celestial Deep Blue',
      primary: '#0B132B',
      accent: '#48E5C2',
      surface: '#1C2541',
      text: '#F5F5F7',
    },
    overview: {
      needed:
        'A way to commemorate meaningful personal connections and dedications in an interactive spatial environment rather than a static text list.',
      built:
        'A 3D WebGL node canvas where each dedication occupies a spatial star-node linked to relational stories and timestamps.',
      enables:
        'Visitors can explore a constellation of interconnected dedications, zoom through space, and create persistent relational nodes.',
    },
    tangibleOutput: {
      title: 'Persistent Celestial Node Record',
      description:
        'A coordinate-mapped memorial node rendering personalized message text, celestial coordinates, and dedication metadata.',
      previewText:
        'Star Node #MR-772 · Coordinates: [42.1, -18.4, 95.0] · Dedication: "For finding the way out" · Verified persistent record',
    },
    howItsBuilt: {
      requirements: [
        'Smooth 60 FPS spatial navigation across hundreds of clustered star-nodes.',
        'Accessible search and filtering by name, date, and keyword.',
      ],
      flowDiagram: {
        steps: [
          { from: 'Dedication Intake', label: 'Captures dedication message and recipient metadata' },
          { from: 'Spatial Placement', label: 'Assigns 3D coordinates within celestial cluster' },
          { from: '3D Render Loop', label: 'Renders interactive constellation with smooth camera controls' },
        ],
      },
      keyDecisions: [
        {
          decision: 'Canvas / WebGL Spatial Camera',
          rationale: 'Creates an expansive, quiet feeling of wandering through open constellations.',
        },
      ],
      limitations: 'Requires modern browser WebGL support for hardware-accelerated 3D rendering.',
      groupedTech: [
        { group: '3D Rendering', items: ['Three.js / WebGL: spatial coordinate rendering and camera orbit controls'] },
        { group: 'Data', items: ['Relational persistence: stores coordinates, author, and timestamp'] },
      ],
    },
    implementationTable: [
      { tool: '3D WebGL canvas', enables: 'Renders hundreds of interactive dedication nodes with smooth camera motion' },
      { tool: 'Relational dedication ledger', enables: 'Maintains persistent links between donors and commemorative stories' },
    ],
    artifacts: ['3D WebGL Celestial Canvas', 'Dedication Submission Stepper', 'Relational Memory Archive'],
    tags: {
      visitorNeeds: ['3D WebGL', 'Interactive Experience', 'Relational Canvas'],
      capabilities: ['Workflow Engine'],
      evidenceTypes: ['Live Website', 'WebGL Application'],
      technologies: ['Three.js', 'WebGL', 'React'],
    },
  },

  // 09: BRAIN RACCOON (Cognitive Utility)
  {
    id: 'brain-raccoon',
    tier: 'demonstration',
    evidenceType: 'screenshot',
    liveUrl: 'https://www.brainraccoon.com',
    mediaUrl: '/assets/images/brainraccoon-screenshot.webp',
    coverStyle: 'mustard',
    coverColor: '#D9A62E',
    coverTextColor: '#23282A',
    illustrationType: 'interactive-demo',
    title: 'BrainRaccoon',
    subtitle: 'Fast Capture & Cognitive Task Unblocking Utility',
    year: '2024–2025',
    sector: 'Cognitive utilities & personal productivity',
    role: 'Interaction Design, Frictionless Capture, Task Triage',
    plainSentence:
      'A low-friction capture tool for dumping thoughts, sorting blockers, and choosing one immediate next action.',
    summary:
      'A playful, focused cognitive utility for fast capture, thought sorting, and task unblocking without the friction of bloated productivity software.',
    originalBrand: {
      name: 'Playful Utility Palette',
      primary: '#1E1E24',
      accent: '#E6AF2E',
      surface: '#F5F5F5',
      text: '#1E1E24',
    },
    overview: {
      needed:
        'Standard project management tools are heavy, intimidating, and demand elaborate categorization when someone is feeling overwhelmed.',
      built:
        'A single-click thought dumper that strips cognitive clutter and prompts the user to isolate one single next physical action.',
      enables:
        'Users can dump mental overload in seconds and regain focus without managing folders, due dates, or tags.',
    },
    tangibleOutput: {
      title: 'Single-Action Unblock Card',
      description:
        'An isolated, distraction-free prompt highlighting only the immediate next physical step.',
      previewText:
        'Current Focus: “Draft Chapter 3 outline for 15 minutes.” · All other thoughts parked safely in the holding bay.',
    },
    howItsBuilt: {
      requirements: [
        'Zero setup time: zero logins, zero folder creation, immediate text cursor focus.',
        'Local storage persistence: data never leaves the user’s browser.',
      ],
      flowDiagram: {
        steps: [
          { from: 'Brain Dump', label: 'Unfiltered rapid capture of thoughts and worries' },
          { from: 'Blocker Triage', label: 'Separates actionable items from amorphous anxiety' },
          { from: 'Single Next Action', label: 'Locks screen to one clear step until completed' },
        ],
      },
      keyDecisions: [
        {
          decision: 'Eliminate Folders and Deadlines',
          rationale: 'Overwhelmed brains need less categorization, not more.',
        },
      ],
      limitations: 'Not intended as a team Jira replacement; built for individual cognitive relief.',
      groupedTech: [
        { group: 'Interface', items: ['React: zero-friction capture pad with instant keyboard shortcuts'] },
        { group: 'Storage', items: ['Local-first localStorage: instant load and private data'] },
      ],
    },
    implementationTable: [
      { tool: 'Zero-friction input capture', enables: 'Allows immediate brain-dumping without categorizing or tagging' },
      { tool: 'Single-action focus view', enables: 'Disrupts cognitive overload by showing only one next task' },
    ],
    artifacts: ['Frictionless Dump Pad', 'Single Next Action Isolator', 'Local Holding Bay'],
    tags: {
      visitorNeeds: ['Cognitive Tool', 'Focus Utility', 'Task Unblocker'],
      capabilities: ['Workflow Engine'],
      evidenceTypes: ['Live Website', 'Digital Utility'],
      technologies: ['React', 'Local-First', 'Keyboard Shortcuts'],
    },
  },

  // 10: WEBSITE AUDIT SYSTEM (DOM Diagnostic)
  {
    id: 'website-audit-system',
    tier: 'demonstration',
    evidenceType: 'case-study',
    liveUrl: '/website-system-check/',
    coverStyle: 'charcoal',
    coverColor: '#23282A',
    coverTextColor: '#EDE9E0',
    illustrationType: 'interactive-demo',
    title: 'Website + System Check',
    subtitle: 'Multi-Viewport Responsive & 4-Pillar Structural Diagnostic',
    year: '2024–2025',
    sector: 'Conversion diagnostics & UX engineering',
    role: 'Diagnostic Framework, Coordinate Pin Engine, Priority Scoring',
    plainSentence:
      'Inspects desktop, tablet, and mobile viewports side-by-side and pins actionable conversion critiques to 4 structural pillars.',
    summary:
      'Replaces vague agency PDF audits with multi-viewport inspection and structured diagnostic pins across Message, Paths, Proof, and Intake.',
    originalBrand: {
      name: 'Audit Pin Framework',
      primary: '#991B1B',
      accent: '#D9A62E',
      surface: '#1F2937',
      text: '#F9FAFB',
    },
    overview: {
      needed:
        'Clients receive bloated 80-page agency PDF audits full of fluff metrics that clients cannot act on or understand.',
      built:
        'A multi-viewport inspection workbench and 4-pillar diagnostic layer that saves findings directly into actionable project briefs.',
      enables:
        'Auditors and business owners can identify exact conversion bottlenecks and export prioritized fix milestones.',
    },
    tangibleOutput: {
      title: 'Actionable 4-Pillar Audit Brief',
      description:
        'A prioritized diagnostic dossier grouping specific DOM pins into Message, Friction, Proof, and Intake fixes.',
      previewText:
        'DOM Pin #04 · Hero section · Critique: Value proposition buried below fold · Pillar: Message Clarity · Severity: High',
    },
    howItsBuilt: {
      requirements: [
        'Must anchor critiques to visual DOM elements rather than abstract page-level comments.',
        'Must score issues across 4 standard pillars: Message, Paths, Proof, Intake.',
      ],
      flowDiagram: {
        steps: [
          { from: 'URL Scanner', label: 'Inspects page layout, typography hierarchy, and intake forms' },
          { from: 'DOM Pinning', label: 'Attaches coordinate markers directly to visual elements' },
          { from: 'Pillar Triage', label: 'Categorizes findings and calculates prioritized impact scores' },
          { from: 'Brief Export', label: 'Exports actionable findings into project inquiry dossier' },
        ],
      },
      keyDecisions: [
        {
          decision: 'Coordinate Pins Over Static Bullet Points',
          rationale: 'Shows clients exactly where the visual confusion occurs on their own site.',
        },
      ],
      limitations: 'External websites with aggressive iframe security headers require URL snapshot analysis.',
      groupedTech: [
        { group: 'Inspection', items: ['Multi-viewport preview & DOM element inspector'] },
        { group: 'Dossier', items: ['4-Pillar diagnostic schema: Message, Paths, Proof, Intake'] },
      ],
    },
    implementationTable: [
      { tool: 'DOM coordinate anchoring', enables: 'Attaches critiques directly to visual elements on real sites' },
      { tool: '4-Pillar diagnostic schema', enables: 'Categorizes findings into Message, Paths, Proof, and Intake' },
    ],
    artifacts: ['Multi-Viewport Inspector (/website-system-check/)', '4-Pillar Structural Ledger', 'Direct-to-Brief Exporter'],
    tags: {
      visitorNeeds: ['Website Audit', 'UX Diagnostics', 'Conversion Analysis'],
      capabilities: ['Data Cleanup', 'Workflow Engine'],
      evidenceTypes: ['Working Application', 'Diagnostic Tool'],
      technologies: ['DOM Inspection', 'React', 'Diagnostic Schema'],
    },
  },

  // 11: SIGNAL — RESTAURANT OPERATIONAL INTELLIGENCE
  {
    id: 'signal-ops',
    tier: 'featured',
    evidenceType: 'interactive-demo',
    liveUrl: '/signal/demo/',
    productUrl: '/signal/',
    mediaUrl: '/assets/images/signal-social-preview.jpg',
    coverStyle: 'charcoal',
    coverColor: '#23282A',
    coverTextColor: '#EDE9E0',
    illustrationType: 'interactive-demo',
    title: 'Signal',
    subtitle: 'Restaurant Operational Intelligence & Multi-Report POS Triage',
    year: '2025–2026',
    sector: 'Hospitality operations & decision intelligence',
    role: 'Product Architecture, Deterministic Ingestion, Signal Triage Engine',
    plainSentence:
      'Ingests fragmented restaurant POS exports (sales, labor, comps, voids, and kitchen timing) and turns them into a ranked, evidence-backed operational action list.',
    summary:
      'Restaurant operators drown in disconnected POS spreadsheets while margin leaks go unnoticed. Signal cross-analyzes operational exports across labor, comps, voids, and daypart velocity to surface the top decisions worth tackling first.',
    originalBrand: {
      name: 'Signal Ops Ledger',
      primary: '#111618',
      accent: '#D9A62E',
      surface: '#1A2023',
      text: '#F3EFE6',
    },
    overview: {
      needed:
        'General managers and multi-unit operators receive dozens of separate POS CSV exports every week—sales mix, labor punches, comp logs, and kitchen ticket times—without a unified way to see how those signals interact.',
      built:
        'A 3-stage operational intelligence workbench (/signal/ and /signal/demo/) that ingests raw exports or sample restaurant datasets, cross-references anomalies across categories, and outputs a ranked action dossier.',
      enables:
        'Operators can immediately see which shift, menu category, or comp pattern is driving margin erosion and export a concrete manager action plan.',
    },
    tangibleOutput: {
      title: 'Prioritized Operational Action Dossier',
      description:
        'A ranked diagnostic brief linking cross-report anomalies (such as Friday late-shift ticket lag correlating with unapproved server comps) to concrete operational fixes.',
      previewText:
        'Signal #01 [HIGH IMPACT] · Friday PM Bar Comps + Kitchen Ticket Lag · Cross-checked across Sales, Comp & KDS logs · Recommended Action: Re-stage prep station & require manager comp code',
    },
    howItsBuilt: {
      requirements: [
        'Must accept messy real-world POS CSV/XLSX exports without requiring custom IT integrations.',
        'Must cross-analyze signals across separate operational domains (Labor × Sales × Comps × Pacing) rather than repeating single-chart vanity metrics.',
        'Must provide an interactive browser demo (/signal/demo/) with realistic multi-concept restaurant presets and custom file upload.',
      ],
      flowDiagram: {
        steps: [
          { from: 'Report Ingestion', label: 'Parses POS exports (Sales, Labor, Comps, Voids, Kitchen Timing)' },
          { from: 'Cross-Signal Correlation', label: 'Detects compound operational leaks across shifts and stations' },
          { from: 'Priority Ranking', label: 'Scores findings by operational urgency and controllability' },
          { from: 'Operator Action Plan', label: 'Outputs a clear briefing for GMs and kitchen leads' },
        ],
      },
      keyDecisions: [
        {
          decision: 'Action List Over Another Dashboard',
          rationale:
            'Restaurant operators do not have time to interpret 40 charts before Friday dinner service; they need the top 3 prioritized actions.',
        },
        {
          decision: 'Zero-Integration File Ingestion',
          rationale:
            'Working directly from standard POS exports allows immediate diagnostic clarity without months of POS vendor API approvals.',
        },
      ],
      limitations:
        'Designed for operational decision support and diagnostic triage rather than real-time point-of-sale transaction processing.',
      groupedTech: [
        { group: 'Ingestion & Parsing', items: ['Client-side CSV/XLSX parser', 'Multi-concept sample dataset engine'] },
        { group: 'Analysis Engine', items: ['Cross-report signal correlation rules', '3-Stage interactive diagnostic walkthrough (/signal/demo/)'] },
      ],
    },
    implementationTable: [
      { tool: '3-Stage Interactive Workbench (/signal/demo/)', enables: 'Lets operators test sample concepts or upload exports and inspect ranked signals live' },
      { tool: 'Cross-report correlation engine', enables: 'Connects kitchen ticket delays, comp spikes, and labor overtime into a single root-cause finding' },
      { tool: 'Tiered diagnostic workflow (/signal/)', enables: 'Supports Snapshot, Diagnostic, and Deep Dive operational engagements' },
    ],
    artifacts: [
      'Signal Product Platform (/signal/)',
      '3-Stage Interactive Diagnostic Workbench (/signal/demo/)',
      'Cross-Report POS Signal Correlation Engine',
      'Prioritized GM Action Brief Exporter',
    ],
    tags: {
      visitorNeeds: ['Operational Analytics', 'Data Cleanup', 'Hospitality Systems', 'Workflow Tool'],
      capabilities: ['Data Cleanup', 'Workflow Engine'],
      evidenceTypes: ['Working Application', 'Interactive System', 'Production System'],
      technologies: ['JavaScript', 'CSV/XLSX Ingestion', 'Operational Heuristics', 'Interactive Demo'],
    },
  },

  // 12: SELF-CARTOGRAPHY — BEHAVIORAL PATTERN ENGINE
  {
    id: 'self-cartography',
    tier: 'featured',
    evidenceType: 'interactive-demo',
    liveUrl: '/cartography/',
    mediaUrl: '/assets/images/self_cartography_mockup.jpg',
    coverStyle: 'teal',
    coverColor: '#17504A',
    coverTextColor: '#EDE9E0',
    illustrationType: 'interactive-demo',
    title: 'Self-Cartography',
    subtitle: 'Explainable Behavioral-Pattern & Topological Reflection Engine',
    year: '2025–2026',
    sector: 'Interactive reflection tools & explainable scoring systems',
    role: 'System Architecture, Topological Coordinate Engine, Explainable Heuristics',
    plainSentence:
      'A standalone, full-screen behavioral-pattern engine that maps structured reflections into topological coordinate space with transparent, non-clinical scoring.',
    summary:
      'Built as an interactive companion system (/cartography/), Self-Cartography translates multi-step subjective responses into an explainable spatial map—showing exactly how each reflection shifts coordinates without black-box labels.',
    originalBrand: {
      name: 'Cartography Topological Void',
      primary: '#050B0A',
      accent: '#C5A059',
      surface: '#0E1F1B',
      text: '#FAF9F5',
    },
    overview: {
      needed:
        'Most online assessments act like opaque quizzes that hand out rigid labels without showing how answers relate or allowing the user to inspect the underlying logic.',
      built:
        'A standalone full-screen application (/cartography/) with multi-dimension reflection prompts, live topological canvas rendering, and an explainable breakdown of every pattern weight.',
      enables:
        'Visitors can complete a guided reflection session, inspect how their responses map across relational axes, and export their personal field record locally.',
    },
    tangibleOutput: {
      title: 'Topological Coordinate Map & Pattern Dossier',
      description:
        'An interactive spatial plot and transparent vector breakdown showing primary behavioral territories, tension axes, and reflection notes.',
      previewText:
        'Cartography V1 · Territory: High-Autonomy Vigilance · Explainable Vector Trace: 100% client-side deterministic calculation',
    },
    howItsBuilt: {
      requirements: [
        '100% transparent, explainable scoring with zero clinical diagnosis claims.',
        'Complete local-first privacy: reflection state never leaves the user’s browser unless explicitly exported.',
        'Responsive topological canvas rendering that updates smoothly across desktop and mobile.',
      ],
      flowDiagram: {
        steps: [
          { from: 'Scenario Prompts', label: 'Captures nuanced responses across relational and autonomy scenarios' },
          { from: 'Vector Weighting', label: 'Applies transparent, inspectable weights across topological axes' },
          { from: 'Canvas Projection', label: 'Plots coordinates and territory contours on an interactive map' },
          { from: 'Field Dossier', label: 'Generates a downloadable summary of patterns and reflection notes' },
        ],
      },
      keyDecisions: [
        {
          decision: 'Explainable Heuristics Over Black-Box AI',
          rationale:
            'Users exploring personal behavioral patterns deserve to see the exact mathematical relationship between their answers and the resulting map.',
        },
      ],
      limitations:
        'Designed for personal reflection and narrative exploration; explicitly non-clinical and non-diagnostic.',
      groupedTech: [
        { group: 'Engine', items: ['Deterministic vector scoring engine', 'Interactive HTML5 topological canvas'] },
        { group: 'Privacy', items: ['Zero-server client-side state', 'Portable JSON/Markdown reflection export'] },
      ],
    },
    implementationTable: [
      { tool: 'Topological coordinate engine (/cartography/)', enables: 'Maps multi-step responses into an interactive 2D spatial landscape' },
      { tool: 'Explainable weight inspector', enables: 'Shows exactly which prompts contributed to each behavioral axis' },
    ],
    artifacts: [
      'Standalone Cartography V1 Application (/cartography/)',
      'Interactive Topological Canvas Renderer',
      'Explainable Vector Weight Breakdown',
    ],
    tags: {
      visitorNeeds: ['Interactive Experience', 'Explainable Systems', 'Creative Practice'],
      capabilities: ['Workflow Engine'],
      evidenceTypes: ['Working Application', 'Interactive System'],
      technologies: ['HTML5 Canvas', 'JavaScript', 'Local-First Architecture'],
    },
  },

  // 13: WRITING CONTEST SUBMISSION MANAGER (WCSM)
  {
    id: 'wcsm',
    tier: 'demonstration',
    evidenceType: 'interactive-demo',
    liveUrl: '/wcsm/',
    mediaUrl: '/assets/images/contest-atlas-cover.webp',
    coverStyle: 'parchment',
    coverColor: '#DFDACE',
    coverTextColor: '#23282A',
    illustrationType: 'interactive-demo',
    title: 'Writing Contest Submission Manager',
    subtitle: 'Automated Literary Contest Directory, Deadline Crawler & Submission Tracker',
    year: '2025–2026',
    sector: 'Editorial tools & automated data directories',
    role: 'Data Pipeline, Automated Verification Crawler, Submission Tracker UI',
    plainSentence:
      'Tracks 60+ vetted fiction, poetry, and essay contests with automated weekly deadline verification, fee filtering, and a local submission log.',
    summary:
      'Writers waste hours cross-checking outdated contest directories and losing track of simultaneous submissions. WCSM combines an automated weekly verification crawler with a clean searchable directory and personal submission tracker at /wcsm/.',
    originalBrand: {
      name: 'Editorial Index Ledger',
      primary: '#1C1917',
      accent: '#B45309',
      surface: '#F5F5F4',
      text: '#1C1917',
    },
    overview: {
      needed:
        'Static literary contest lists go stale within weeks as submission windows open, close, or shift deadlines.',
      built:
        'A live searchable directory (/wcsm/) backed by a scheduled GitHub Actions verification crawler that checks contest URLs weekly and flags deadline changes.',
      enables:
        'Writers can filter contests by genre, entry fee, prize amount, and open window, and track their own submissions locally.',
    },
    tangibleOutput: {
      title: 'Verified Contest Index & Personal Submission Ledger',
      description:
        'A filterable directory of 60+ literary contests showing verified deadlines, entry fees, prize amounts, and submission status.',
      previewText:
        '60+ Vetted Contests · Weekly Automated Crawler Verification · Filter by Genre, Fee-Free, & Open Deadlines (/wcsm/)',
    },
    howItsBuilt: {
      requirements: [
        'Must automatically audit contest URLs on a weekly schedule to prevent dead links and stale deadlines.',
        'Must allow instant filtering by genre, entry fee, prize tier, and deadline proximity.',
      ],
      flowDiagram: {
        steps: [
          { from: 'Weekly Crawler', label: 'GitHub Actions workflow fetches contest pages and extracts deadline updates' },
          { from: 'Structured Index', label: 'Normalizes prizes, entry fees, genres, and open windows into JSON' },
          { from: 'Filter & Track UI', label: 'Provides instant search and local submission tracking at /wcsm/' },
        ],
      },
      keyDecisions: [
        {
          decision: 'Scheduled Static JSON Pipeline',
          rationale:
            'Running the crawler on a weekly schedule keeps the user-facing application instantaneous and zero-cost to host.',
        },
      ],
      limitations: 'Submission status tracking is stored locally in the user’s browser for privacy.',
      groupedTech: [
        { group: 'Automation', items: ['Weekly GitHub Actions verification crawler', 'Automated deadline parser'] },
        { group: 'Frontend', items: ['Instant multi-facet filter & search UI (/wcsm/)', 'Local submission status ledger'] },
      ],
    },
    implementationTable: [
      { tool: 'Automated weekly contest crawler', enables: 'Keeps deadlines, prize amounts, and open windows accurate without manual upkeep' },
      { tool: 'Searchable directory & tracker (/wcsm/)', enables: 'Lets writers filter 60+ vetted contests and log submissions in one place' },
    ],
    artifacts: [
      'Live Contest Directory & Tracker (/wcsm/)',
      'Weekly GitHub Actions Verification Pipeline',
      '60+ Vetted Contest Dataset',
    ],
    tags: {
      visitorNeeds: ['Editorial Systems', 'Data Cleanup', 'Workflow Tool'],
      capabilities: ['Data Cleanup', 'Workflow Engine'],
      evidenceTypes: ['Working Application', 'Automated Pipeline'],
      technologies: ['JavaScript', 'GitHub Actions', 'Automated Crawling', 'Local-First'],
    },
  },
];

const PROJECT_ID_ALIASES = {
  'gensort-studio': 'gensort',
  'website-system-check': 'website-audit-system',
  'contest-atlas': 'wcsm',
  'lone-wolf': 'lone-wolf-dumpsters',
  inncontrol: 'inncontrol-coils',
};

export const getProjectById = (id) => {
  if (!id) return undefined;
  const canonicalId = PROJECT_ID_ALIASES[id] || id;
  return PROJECTS.find((p) => p.id === canonicalId);
};
export const getProjectsByTier = (tier) =>
  tier === 'all' ? PROJECTS : PROJECTS.filter((p) => p.tier === tier);
