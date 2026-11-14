/**
 * Authoritative Method Stages & Verified Project Evidence Trails
 * Grounded in Wolf Ridge Dumpsters & INNcontrol Coils
 */

export const METHOD_CASES = [
  {
    id: 'lone-wolf',
    name: 'Wolf Ridge Dumpsters',
    subtitle: '48-City Roll-Off Logistics & Dual-Service Intake',
    sector: 'Logistics & Equipment Rental',
  },
  {
    id: 'inncontrol',
    name: 'INNcontrol Coils',
    subtitle: 'Nationwide B2B Hotel PTAC Platform & Operator Dashboards',
    sector: 'Hospitality HVAC & Operations',
  },
];

export const STAGES = [
  {
    num: '01',
    key: 'observe',
    slug: 'Observe',
    title: 'Observe & Map Friction',
    desc: 'Notice what actually breaks down in the daily workflow. Locate the exact bottleneck where customers hesitate or operators lose time to repetitive manual triage.',
    evidenceGrounded: {
      'lone-wolf': {
        focalProblem:
          'Dispatchers were fielding repetitive phone calls explaining 15, 20, and 25-yard container dimensions, tonnage allowances, and whether a job needed a roll-off container or a junk removal crew.',
        observedReality:
          'Homeowners and contractors wanted transparent container specs, upfront flat-rate pricing, and clear municipal service coverage before picking up the phone.',
        realArtifact: 'Service Call Triage Audit & DFW Corridor Map',
        keyFinding:
          'Separating self-load dumpster rentals from full-service junk removal and publishing clear container capacities removes the biggest intake bottleneck.',
      },
      'inncontrol': {
        focalProblem:
          'Hotel ownership groups needed a clear commercial case for deep PTAC coil refurbishing vs. full unit replacement, while internal operators needed a fast, structured daily check-in rhythm.',
        observedReality:
          'Generic HVAC brochure copy failed to speak to volume hospitality operators, and standard project management apps were too heavy for fast daily field check-ins.',
        realArtifact: 'B2B Hospitality Positioning & Daily Operator Workflow Audit',
        keyFinding:
          'Public B2B credibility and internal daily operator readiness require two focused, purpose-built interfaces.',
      },
    },
    makes: ['Operational friction log', 'Customer & operator bottleneck map', 'Real-world operating constraints'],
  },
  {
    num: '02',
    key: 'extract',
    slug: 'Identify Rules',
    title: 'Identify the rules the tool needs to follow',
    desc: 'Pull pricing rules, service boundaries, and daily routines out of unwritten habits into an explicit, repeatable structure.',
    evidenceGrounded: {
      'lone-wolf': {
        focalProblem:
          'Container volume, pickup-truck load equivalents, and tonnage allowances were second nature to dispatchers but invisible to online visitors.',
        observedReality:
          'Each roll-off size carries specific dimensions and tonnage rules: 15-Yard ($385 / 2.0 tons), 20-Yard ($425 / 2.5 tons), and 25-Yard ($475 / 3.0 tons).',
        realArtifact: '15 / 20 / 25-Yard Container Specification & Pricing Matrix',
        keyFinding:
          'Codified container dimensions, truck-load equivalents, and tonnage allowances into scannable comparison cards.',
      },
      'inncontrol': {
        focalProblem:
          'Daily operator check-ins needed to capture readiness, top priorities, and end-of-day debriefs without turning into a chore.',
        observedReality:
          'Structuring the day into morning readiness biometrics, top 3 field objectives, and an evening after-action review keeps the operator focused on what matters.',
        realArtifact: 'Daily Check-In Schema & Operator Status HUD Model',
        keyFinding:
          'Translated daily operational habits into a fast step-by-step check-in and visual readiness HUD.',
      },
    },
    makes: ['Explicit service & pricing rules', 'Structured intake fields', 'Repeatable workflow model'],
  },
  {
    num: '03',
    key: 'evaluate',
    slug: 'Evaluate',
    title: 'Contextualize & Prototype',
    desc: 'Pressure-test the structure against real operating conditions. Make sure every question, card, and input earns its place on mobile and desktop.',
    evidenceGrounded: {
      'lone-wolf': {
        focalProblem:
          'Customers across 48 DFW cities search by their specific municipality and need to know immediately if their job site is covered.',
        observedReality:
          'Structured 48 city-specific landing pages across Collin, Dallas, Denton, and Tarrant counties with localized Schema.org metadata and direct intake.',
        realArtifact: '48-City DFW Municipal Landing Architecture',
        keyFinding:
          'Every city page connects local search intent directly to the sizing matrix and dual-track booking form.',
      },
      'inncontrol': {
        focalProblem:
          'Internal check-ins fail if they require desktop logins or complex menus during a busy field morning.',
        observedReality:
          'Designed a mobile-first daily check-in wizard that pairs seamlessly with the visual operator readiness and objective status dashboard.',
        realArtifact: 'Mobile Check-In Wizard & Status HUD Prototype',
        keyFinding:
          'Thumb-friendly progression lets operators log morning priorities and evening debriefs in under two minutes.',
      },
    },
    makes: ['Working interface prototype', 'Mobile & field usability check', 'Clear copy and hierarchy'],
  },
  {
    num: '04',
    key: 'transform',
    slug: 'Transform',
    title: 'Build & Integrate',
    desc: 'Ship the production system. Build fast, durable interfaces connected directly to the team’s intake or daily operating workflow.',
    evidenceGrounded: {
      'lone-wolf': {
        focalProblem:
          'Inbound requests needed to arrive with service type, container size, city, and placement details already separated.',
        observedReality:
          'Shipped the production platform with Track 1 (Roll-Off Dumpster Rental) and Track 2 (Junk Removal) intake forms plus 48 DFW municipal pages.',
        realArtifact: 'Production Web Platform & Dual-Track Intake System',
        keyFinding:
          'Dispatch receives structured requests with container size, debris type, and city already specified.',
      },
      'inncontrol': {
        focalProblem:
          'Both the public commercial platform and internal operator tools needed to run reliably with zero bloat.',
        observedReality:
          'Shipped `inncontrolcoils.com` for nationwide B2B hospitality inquiries alongside the custom internal daily check-in and readiness dashboards.',
        realArtifact: 'Commercial Platform (inncontrolcoils.com) & Operator Dashboards',
        keyFinding:
          'Unified external B2B presentation and internal daily execution under clean, maintainable web systems.',
      },
    },
    makes: ['Production web platform', 'Structured lead & workflow intake', 'Low-maintenance deployment'],
  },
  {
    num: '05',
    key: 'evolve',
    slug: 'Evolve',
    title: 'Measure & Refine',
    desc: 'Observe how the system performs in real use. Refine copy, tighten intake paths, and extend tools only where real demand proves it.',
    evidenceGrounded: {
      'lone-wolf': {
        focalProblem:
          'Keeping 48 municipal pages and seasonal pricing easy to maintain without brittle plugins.',
        observedReality:
          'Structured clean data templates so container rates, tonnage notes, and municipal coverage stay consistent across every page.',
        realArtifact: 'Maintainable Multi-City Content & Pricing Architecture',
        keyFinding:
          'Clean static and programmatic structure keeps page loads fast on job-site mobile connections.',
      },
      'inncontrol': {
        focalProblem:
          'Evolving internal operator tools as daily priorities and team workflows shift.',
        observedReality:
          'Built modular dashboard views so daily habits, active field objectives, and debrief prompts can be adjusted without rebuilding the core app.',
        realArtifact: 'Modular Operator Readiness & Debrief System',
        keyFinding:
          'Tools built around a real person’s workflow get used daily because they respect the operator’s time.',
      },
    },
    makes: ['Practical post-launch refinements', 'Durable documentation', 'Room for the next useful step'],
  },
];

export const DELIVER = {
  num: '06',
  key: 'deliver',
  slug: 'Deliver',
  title: 'Put It Into Daily Operational Use',
  desc: 'Delivery is not a slide deck that sits in a folder. It is a working website, quoting flow, or internal tool running cleanly in your actual operation.',
  evidenceGrounded: {
    'lone-wolf': {
      focalProblem: 'Dispatchers need clean orders without phone tag.',
      observedReality: '48 DFW municipal pages and dual-track intake run 24/7 with transparent flat-rate sizing.',
      realArtifact: 'Live Wolf Ridge Production System',
      keyFinding: 'Customers see exact container specs upfront; dispatch gets structured job details.',
    },
    'inncontrol': {
      focalProblem: 'Hospitality buyers and internal operators need clarity without clutter.',
      observedReality: 'inncontrolcoils.com handles B2B property inquiries while internal dashboards support daily readiness.',
      realArtifact: 'Live Commercial Platform + Operator HUD',
      keyFinding: 'Both public and internal systems fit the way the business actually runs.',
    },
  },
  makes: ['System runs in production', 'You own the code and assets', 'Clear path for future builds'],
};
