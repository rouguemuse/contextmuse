import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FileCode,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';

const STRIPE_PROMPT_PACK_URL = 'https://buy.stripe.com/eVq14mezXeWCbwzg4lebu0c';
const STRIPE_WRITTEN_AUDIT_URL = 'https://buy.stripe.com/5kQ28qbnL5m2fMPaK1ebu08';

const STAGES_SPECIMEN = [
  {
    id: 'stage-01',
    code: 'STAGE 01 // CLAUDE PERCEPTION AUDIT',
    shortTab: '01 · 10-Section Perception Audit',
    title: 'Independent Website Perception & First-Impression Audit',
    badge: 'CLAUDE 10-SECTION FRAMEWORK',
    summary:
      'Forces Claude or GPT-4o to experience your live URL as a skeptical first-time buyer with zero prior context—exposing positioning ambiguity, trust gaps, and conversion friction before scoring 6 weighted dimensions out of 30.',
    variables: ['{{TARGET_URL}}', '{{PRIMARY_BUYER_PERSONA}}', '{{DESIRED_CONVERSION_ACTION}}', '{{RAW_PAGE_COPY_OR_SCREENSHOTS}}'],
    promptSnippet: `You are conducting an independent website perception and conversion audit for {{TARGET_URL}}.
Assume ZERO prior knowledge of the company, founder, or product outside what is explicitly visible on the page.
Do NOT give polite encouragement or generic marketing advice. Every observation must cite exact visible copy, layout hierarchy, or missing buyer proof.

Execute all 10 sections in order:
01. First-Impression Clarity Test (First 5 Seconds): What does this business actually sell, who is it for, and what happens next?
02. Positioning & Category Legibility: Quote the headline/subhead verbatim. Score whether a cold visitor can categorize the offer without scrolling.
03. Buyer Journey & Navigation Architecture: Trace the primary and secondary clicks. Flag dead-ends, competing CTAs, or premature friction.
04. Visual Hierarchy & Scannability: Evaluate focal points, typographic contrast, and cognitive load at 1440px desktop and 390px mobile.
05. Copywriting & Specificity Audit: List every vague cliché ("seamless", "next-gen", "tailored solutions") and rewrite each with concrete operational proof.
06. Trust, Authority & Risk-Reversal Signals: Audit case studies, named metrics, pricing transparency, and guarantees.
07. Conversion & Intake Friction Analysis: Count clicks and form fields required to buy or request a quote.
08. Top 3 Conversion Killers (Ranked by Revenue Impact).
09. 6-Dimension Weighted Perception Score (Clarity, Positioning, Hierarchy, Copy Specificity, Trust Proof, Conversion Flow — each /5, Total X/30).
10. The Single Highest-Leverage Fix (Exact before/after copy + structural change executable in under 60 minutes).`,
    genericComparison: {
      bad: '“Your hero section looks clean and modern! Consider adding more social proof and making your CTA button stand out more with a brighter color to improve conversions.”',
      good: '“SECTION 01 FAILURE: Headline ‘Elevating Digital Experiences’ contains zero category nouns. A cold visitor at 390px mobile sees 3 competing CTAs before any price or deliverable is named. FIX: Replace H1 with ‘Fixed-Scope Commercial Websites & Quote Routers Built in 21 Days.’”',
    },
    deliverables: [
      '5-Second Cold Visitor Comprehension Verdict',
      'Verbatim Cliché & Vague-Claim Extraction Table',
      '6-Dimension Weighted Scorecard (X / 30 Points)',
      'Single Highest-Leverage 60-Minute Rewrite',
    ],
  },
  {
    id: 'stage-02',
    code: 'STAGE 02 // CLAUDE SKILL: E1–E4 QUALITY AUDITOR',
    shortTab: '02 · E1–E4 Quality Auditor Skill',
    title: 'Commercial Deliverable Quality Auditor (E1–E4 Rubric & P0–P3 Defect Gate)',
    badge: 'INSTALLABLE CLAUDE SKILL.MD',
    summary:
      'A production-ready Claude Skill (SKILL.md) that grades any landing page, proposal, audit report, or client deliverable on a 0–5 weighted rubric and blocks release if any P0 critical defect or unverified claim is found.',
    variables: ['{{DELIVERABLE_ARTIFACT}}', '{{TARGET_AUDIENCE_ROLE}}', '{{COMMERCIAL_GOAL}}', '{{RELEASE_THRESHOLD}}'],
    promptSnippet: `# SYSTEM ROLE: DELIVERABLE QUALITY AUDITOR (E1–E4 RUBRIC & P0–P3 DEFECT GATE)
Evaluate the submitted artifact as a commercial release gatekeeper. Never invent praise. Every score and defect MUST follow the mandatory 4-part evidence chain:
[Exact Location] — [Quoted Evidence] — [Commercial Impact] — [Concrete Fix]

1. SCORE FOUR WEIGHTED PILLARS (0.0 to 5.0 each):
   • E1 — Structural Completeness & Scope Alignment (25%)
   • E2 — Messaging Precision, Voice & Anti-Fluff Discipline (25%)
   • E3 — Conversion Architecture, CTA Clarity & Risk Reversal (25%)
   • E4 — Technical Polish, Edge-Case Resilience & Proof Verification (25%)

2. CLASSIFY ALL DEFECTS BY SEVERITY:
   • P0 (Release Blocker): Broken checkout/CTA path, contradictory pricing, or unsubstantiated claim.
   • P1 (High Friction): Ambiguous offer boundary, missing mobile thumb-zone action, or weak headline.
   • P2 (Editorial Debt): Repetitive cadence, AI-generated filler transitions, or buried proof.
   • P3 (Polish): Minor microcopy or formatting inconsistency.

3. RELEASE GATE VERDICT:
   • PASS (>= 4.2/5.0 and Zero P0/P1 defects)
   • CONDITIONAL PASS (>= 3.5/5.0, Zero P0, P1 fixes specified inline)
   • HOLD FOR REWORK (< 3.5/5.0 or any P0 defect present) — output ready-to-paste replacement blocks for every P0/P1 item.`,
    genericComparison: {
      bad: '“Overall this landing page draft is strong (8/10). Make sure to proofread the pricing section and tighten up a few paragraphs.”',
      good: '“VERDICT: HOLD FOR REWORK (3.35 / 5.00) · 1 P0 BLOCKER DETECTED.\n[P0-01] [Pricing Card #2, Line 42] — Quotes ‘Unlimited Revisions’ while FAQ #4 states ‘2 revision rounds included’ — Creates immediate scope dispute at checkout — Replace Line 42 with ‘2 Consolidated Revision Rounds Included (Additional rounds via Change Order).’”',
    },
    deliverables: [
      'Standalone Claude SKILL.md File Ready for .claude/skills/',
      'E1–E4 Weighted Quantitative Rubric (0.0–5.0 Scale)',
      'Mandatory [Location] — [Evidence] — [Impact] — [Fix] Trace',
      'Automated P0/P1 Replacement Copy Generator',
    ],
  },
  {
    id: 'stage-03-04',
    code: 'STAGES 03–04 // ABOVE-THE-FOLD & INTAKE FRICTION',
    shortTab: '03–04 · Hero & CTA Friction',
    title: 'Above-the-Fold Value Proposition & Lead Intake Friction Surgery',
    badge: 'CONVERSION ARCHITECTURE',
    summary:
      'Re-architects the top 800px of your desktop and mobile viewport and strips unnecessary fields from your quote or checkout flow—turning passive browsers into qualified leads or direct Stripe buyers.',
    variables: ['{{CURRENT_HERO_COPY}}', '{{PRIMARY_OBJECTION}}', '{{CURRENT_FORM_FIELDS}}', '{{PRICE_OR_ANCHOR}}'],
    promptSnippet: `Analyze the current above-the-fold hero and intake flow for {{TARGET_URL}}:
1. Diagnose why a high-intent buyer hesitates in the first 8 seconds.
2. Construct 3 distinct Hero Architectures:
   • Option A (Direct Commercial Proof): Category noun + quantified outcome + price/timeline anchor.
   • Option B (Problem-Elimination Frame): Names the expensive operational bottleneck + the exact mechanism that removes it.
   • Option C (Artifact-Led Showcase): Leads with an inspectable specimen and a 1-click primary transaction CTA.
3. Intake & Checkout Friction Pruning:
   • Audit every field in {{CURRENT_FORM_FIELDS}}. Classify each as KEEP (essential for routing/pricing), DEFER (move to post-purchase onboarding), or DELETE.
   • Output the exact HTML/JSX microcopy for the CTA button, trust sub-caption, and risk-reversal badge.`,
    genericComparison: {
      bad: '“Try changing your button text from ‘Submit’ to ‘Get Started Today’ and shorten your contact form.”',
      good: '“PRUNED INTAKE: Reduced 9-field contact form to 3 high-signal routing inputs (Project Type Pill, Target Timeline, Email/Phone). Replaced ‘Submit Inquiry’ with ‘Request Fixed-Scope Architecture Brief (48h Turnaround)’ + sub-caption ‘No discovery call required to see base pricing.’”',
    },
    deliverables: [
      '3 Complete Hero Wireframe & Copy Specifications',
      '390px Mobile Thumb-Zone Sticky Action Bar Spec',
      'Form Field KEEP / DEFER / DELETE Audit Matrix',
      'Risk-Reversal & Price-Anchor Microcopy Snippets',
    ],
  },
  {
    id: 'stage-05-06',
    code: 'STAGES 05–06 // HUB-AND-SPOKE SEO & OFFER LADDER',
    shortTab: '05–06 · Hub-Spoke SEO & Offer Ladder',
    title: 'Hub-and-Spoke Search Intent Architect & Audit-to-Offer Productization Ladder',
    badge: 'ORGANIC SEARCH & MONETIZATION',
    summary:
      'Maps commercial bottom-of-funnel search intent into a flagship Hub page plus 5 high-converting Spoke landing pages—and converts raw website audit findings into a 3-tier fixed-scope revenue ladder.',
    variables: ['{{CORE_SERVICE_OR_PRODUCT}}', '{{TARGET_GEOGRAPHY_OR_NICHE}}', '{{COMPETITOR_URLS}}', '{{PRICE_TIERS}}'],
    promptSnippet: `PART A — HUB-AND-SPOKE SEO ARCHITECTURE:
Do not generate informational blog fluff that attracts zero buyers. Build a 1-Hub + 5-Spoke commercial search matrix for {{CORE_SERVICE_OR_PRODUCT}} in {{TARGET_GEOGRAPHY_OR_NICHE}}:
• For each Spoke route: Exact URL slug, Title Tag (<= 60 chars), Meta Description (<= 155 chars), H1, H2 outline, internal anchor link back to the Hub, and primary conversion hook.

PART B — AUDIT-TO-OFFER PRODUCTIZATION LADDER:
Take the top 3 defects uncovered in Stages 01–04 and package them into a 3-tier fixed-scope offer ladder:
• Tier 1 ($39–$149 Self-Serve / Diagnostic Foot-in-the-Door)
• Tier 2 ($299–$750 Fixed-Scope 48-Hour Implementation Sprint)
• Tier 3 ($2,500+ Turnkey Custom Architecture Build)
Include exact scope boundaries, deliverable bullets, and anti-creep exclusions for each tier.`,
    genericComparison: {
      bad: '“Write 5 blog posts about ‘Why Good Web Design Matters in 2026’ to boost your SEO rankings.”',
      good: '“SPOKE 02: /commercial-quote-router-austin/ — Targets transactional buyer query. H1: ‘Automated Quote & Lead Routing Systems for Texas Service Operators.’ Connects directly to Tier-2 $299 Hero Rewrite Sprint and Tier-3 $2,500 Custom Build.”',
    },
    deliverables: [
      '1-Hub + 5-Spoke Transactional URL & Metadata Blueprint',
      'Internal Linking Anchor Text & Breadcrumb Map',
      '3-Tier Productized Service & Digital Blueprint Ladder',
      'Anti-Scope-Creep SOW Deliverable & Exclusion Clauses',
    ],
  },
  {
    id: 'stage-07-09',
    code: 'STAGES 07–09 // EDITORIAL VOICE & PROOF DOSSIERS',
    shortTab: '07–09 · Anti-Cliché Voice & Proof',
    title: 'Anti-AI-Cliché Editorial Voice Calibration & Case Study Proof Compiler',
    badge: 'EDITORIAL AUTHORITY',
    summary:
      'Strips synthetic AI phrasing ("delve", "tapestry", "unlock", "Elevate your brand") out of your copy and restructures loose client wins into architectural before/after proof dossiers.',
    variables: ['{{DRAFT_COPY}}', '{{BRAND_VOICE_SPECIMENS}}', '{{RAW_PROJECT_NOTES}}', '{{MEASURED_OUTCOMES}}'],
    promptSnippet: `1. SYNTACTIC & LEXICAL PURGE:
Scan {{DRAFT_COPY}} and flag every sentence using banned synthetic patterns:
- Symmetric "Not just X, but Y" / "Whether you're A or B" constructions
- Empty intensifiers ("seamlessly", "effortlessly", "cutting-edge", "empower", "elevate")
- Abstract claims without a physical noun, number, or mechanism within 18 words.

2. REWRITE IN ARCHITECTURAL STUDIO VOICE:
- Short declarative sentences paired with specific technical evidence.
- Replace adjectives with measurements (file count, load time, viewport width, price, turnaround hours).

3. CASE STUDY DOSSIER COMPILER:
Transform {{RAW_PROJECT_NOTES}} into a 4-block Specimen Card:
[01 / Operational Bottleneck] -> [02 / Architectural Intervention] -> [03 / Verified Technical Spec] -> [04 / Live Proof Artifact].`,
    genericComparison: {
      bad: '“We seamlessly empower visionary founders to unlock their digital potential through bespoke, cutting-edge web solutions.”',
      good: '“We replace slow 9-field contact forms and patchwork plugins with ownable, static-first web architecture and automated Stripe/quote routing. Delivered in 14–21 days with zero platform rent.”',
    },
    deliverables: [
      'Banned AI-Cliché & Syntactic Pattern Blacklist',
      'Before/After Paragraph Rewrite Ledger',
      '4-Block Case Study Specimen Card Generator',
      'Objection-Killing FAQ Compiler (Pricing, IP, Timeline)',
    ],
  },
  {
    id: 'stage-10-12',
    code: 'STAGES 10–12 // JSON-LD SCHEMA & 6-RATIO AD MATRIX',
    shortTab: '10–12 · JSON-LD Schema & Ad Matrix',
    title: 'Production JSON-LD Rich Schema Compiler & 6-Channel Ad Campaign Matrix',
    badge: 'TECHNICAL SEO & DISTRIBUTION',
    summary:
      'Generates valid, interconnected Schema.org JSON-LD (@graph with Organization, Service, Product, and FAQPage) plus channel-native ad hooks across Pinterest, Meta/IG, TikTok, LinkedIn, X, and Showcase boards.',
    variables: ['{{CANONICAL_URL}}', '{{PRODUCT_OR_SERVICE_LIST}}', '{{FAQ_PAIRS}}', '{{CAMPAIGN_OFFER_URL}}'],
    promptSnippet: `PART 1 — INTERCONNECTED JSON-LD @GRAPH COMPILER:
Generate a production-ready <script type="application/ld+json"> block for {{CANONICAL_URL}} connecting:
• Organization / ProfessionalService node with @id, founder, areaServed, and knowsAbout
• WebSite & WebPage nodes with breadcrumb lineage
• Product / Offer nodes with exact price, priceCurrency ("USD"), availability, and checkout URL
• FAQPage node matching visible on-page objection-handling FAQs.
Validate that zero placeholder URLs or unescaped quotes exist.

PART 2 — 6-FORMAT MULTI-CHANNEL AD & HOOK MATRIX:
Generate platform-native creative specs and copy for {{CAMPAIGN_OFFER_URL}} across:
01. Pinterest Vertical Pin (1000×1500 · 2:3) — Search-keyword headline + saveable specimen hook
02. Meta / Instagram Feed Square (1080×1080 · 1:1) — High-contrast visual interrupt + direct offer CTA
03. TikTok / Reels / Story Vertical (1080×1920 · 9:16) — 3-second thumb-stop hook + safe-zone overlay
04. Portfolio Showcase Board (1600×1200 · 4:3) — Architectural specimen callouts
05. LinkedIn Link Card (1200×627 · 1.91:1) — Operator ROI & bottleneck framing
06. X / Product Hunt Launch Banner (1600×900 · 16:9) — Single unmistakable thesis statement.`,
    genericComparison: {
      bad: '“Here is a basic Organization schema snippet and 3 social media captions with hashtags #WebDesign #Growth #AI.”',
      good: '“Outputs a validated 4-node @graph JSON-LD payload with linked @id references + 6 ratio-calibrated ad copy specs with exact headline character budgets and visual focal coordinates.”',
    },
    deliverables: [
      'Copy-Paste <script type="application/ld+json"> @graph Block',
      'Product, Service, LocalBusiness & FAQPage Schema Templates',
      '6-Ratio Visual Ad Copy & Safe-Zone Layout Specs',
      'Pre-Launch Technical SEO & OpenGraph Verification Checklist',
    ],
  },
];

const PACKAGE_MANIFEST = [
  {
    file: 'Context-Muse-12-Stage-Audit-To-Action-Prompt-Pack.md',
    type: 'MASTER DOSSIER (.MD)',
    size: '12 STAGES · FULL SYSTEM PROMPTS',
    desc: 'Complete 12-stage prompt pipeline from cold perception audit to Hub-and-Spoke SEO, copy surgery, JSON-LD schema, and ad matrix.',
  },
  {
    file: 'deliverable-quality-auditor/SKILL.md',
    type: 'CLAUDE SKILL (.MD)',
    size: 'E1–E4 RUBRIC · P0–P3 GATE',
    desc: 'Drop straight into .claude/skills/ or Claude Projects to enforce evidence-traced quality scoring and block P0/P1 defects automatically.',
  },
  {
    file: '10-Section-Website-Perception-Audit-Template.md',
    type: 'AUDIT FRAMEWORK',
    size: '30-POINT SCORECARD',
    desc: 'The standalone 10-section cold-visitor perception audit prompt + structured markdown output template for client or internal teardowns.',
  },
  {
    file: 'JSON-LD-Schema-And-Ad-Matrix-Cheatsheet.md',
    type: 'TECHNICAL SPEC',
    size: '@GRAPH + 6 AD RATIOS',
    desc: 'Ready-to-customize Schema.org JSON-LD blocks (Organization, Product, Service, FAQPage) and 6-channel social ad copy formulas.',
  },
];

export default function PromptPack() {
  const [activeStageId, setActiveStageId] = useState(STAGES_SPECIMEN[0].id);
  const [sandboxDomain, setSandboxDomain] = useState('surenext.com');
  const [sandboxNiche, setSandboxNiche] = useState('Commercial Insurance & Risk Architecture');
  const [sandboxGoal, setSandboxGoal] = useState('Book qualified commercial policy & risk audit consultations');
  const [copiedStage, setCopiedStage] = useState(false);
  const [copiedSandbox, setCopiedSandbox] = useState(false);

  // Embedded Checkout Drawer State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState('prompt-pack-39'); // 'prompt-pack-39' | 'written-audit-149'
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerDomain, setBuyerDomain] = useState('');
  const [receiptCode, setReceiptCode] = useState('');
  const [showReceiptUnlock, setShowReceiptUnlock] = useState(false);
  const [receiptError, setReceiptError] = useState('');

  const activeStage =
    STAGES_SPECIMEN.find((s) => s.id === activeStageId) || STAGES_SPECIMEN[0];

  const generatedSandboxPrompt = `You are conducting an independent 10-Section Website Perception & Conversion Audit for ${
    sandboxDomain.trim() || 'your-domain.com'
  } (${sandboxNiche.trim() || 'Commercial Service / Digital Product'}).
Primary Conversion Goal: ${sandboxGoal.trim() || 'Convert qualified visitors into buyers'}.

RULES OF ENGAGEMENT:
1. Assume ZERO prior insider context outside what is visibly rendered on the page.
2. Do NOT use generic praise or polite filler. Cite exact visible headlines, CTAs, layout friction, or missing proof.
3. For every defect identified, trace: [Location] — [Quoted Evidence] — [Revenue Impact] — [Exact Rewrite / Fix].

EXECUTE SECTIONS 01–04 (STAGE-01 PREVIEW SAMPLE):
• 01 / 5-Second Cold Visitor Clarity Verdict: State in one blunt sentence what a skeptical buyer thinks ${
    sandboxDomain.trim() || 'this site'
  } sells, who it is for, and what action they are supposed to take.
• 02 / Headline & Positioning Specificity: Quote the primary H1 and subhead verbatim. Diagnose whether it names a concrete mechanism/outcome or hides behind vague category clichés.
• 03 / Above-the-Fold CTA & Intake Friction: Count the competing clickable actions in the first viewport (1440px desktop vs 390px mobile) and flag any premature friction.
• 04 / Single Highest-Leverage 60-Minute Fix: Write the exact replacement H1, subhead, and primary CTA button microcopy.`;

  const handleCopyStageSnippet = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(activeStage.promptSnippet);
      setCopiedStage(true);
      setTimeout(() => setCopiedStage(false), 2200);
    }
  };

  const handleCopySandboxPrompt = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(generatedSandboxPrompt);
      setCopiedSandbox(true);
      setTimeout(() => setCopiedSandbox(false), 2200);
    }
  };

  const openCheckoutDrawer = (offerId = 'prompt-pack-39') => {
    setSelectedOffer(offerId);
    setCheckoutOpen(true);
  };

  const handleProceedToStripe = (e) => {
    e.preventDefault();
    const baseUrl =
      selectedOffer === 'written-audit-149'
        ? STRIPE_WRITTEN_AUDIT_URL
        : STRIPE_PROMPT_PACK_URL;
    const params = new URLSearchParams();
    if (buyerEmail.trim()) {
      params.set('prefilled_email', buyerEmail.trim());
    }
    if (buyerDomain.trim()) {
      params.set(
        'client_reference_id',
        buyerDomain.trim().replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 50)
      );
    }
    const targetUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleReceiptVerify = (e) => {
    e.preventDefault();
    const clean = receiptCode.trim();
    if (clean.length >= 6) {
      setReceiptError('');
      window.location.href =
        'https://blueprints.contextmuse.com/downloads/dl-prompt-pack-39/?session_id=' +
        encodeURIComponent(clean);
    } else {
      setReceiptError('Enter a valid Stripe receipt email or session reference (6+ chars).');
    }
  };

  return (
    <div
      className="min-h-screen text-[#141817] selection:bg-[#E5E750] selection:text-[#141817]"
      style={{
        backgroundColor: '#F2ECE1',
        backgroundImage:
          'linear-gradient(to right, rgba(20, 24, 23, 0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(20, 24, 23, 0.055) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* =====================================================================
          TOP ARCHITECTURAL BAR — Studio Return + Breadcrumb + Embedded Checkout Trigger
         ===================================================================== */}
      <header className="sticky top-0 z-40 border-b-[2px] border-[#141817] bg-[#F2ECE1]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-8">
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/blueprints"
              data-testid="prompt-pack-back-blueprints"
              className="group inline-flex items-center gap-2 border-[1.5px] border-[#141817] bg-[#FAF8F3] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#141817] shadow-[2px_2px_0_#141817] transition-all hover:bg-[#141817] hover:text-[#F2ECE1]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Blueprints Catalog</span>
            </Link>

            <div className="hidden md:flex items-center gap-2.5">
              <div
                className="grid grid-cols-2 grid-rows-2 w-4 h-4 border border-[#141817] shrink-0"
                aria-hidden="true"
              >
                <span className="bg-[#2B7C72]" />
                <span className="bg-[#123F38]" />
                <span className="bg-[#A9CFC7]" />
                <span className="bg-[#D9A62E]" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#141817]">
                CONTEXT &amp; MUSE
              </span>
              <span className="font-mono text-xs text-[#141817]/40">/</span>
              <span className="bg-[#123F38] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#E5E750]">
                BLUEPRINT NO. 03 // PROMPT PACK &amp; CLAUDE SKILL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#live-inspector"
              className="hidden sm:inline-block font-mono text-xs font-bold uppercase tracking-wider text-[#141817] hover:text-[#E34232] transition-colors px-2 py-1"
            >
              12-Stage Spec
            </a>
            <a
              href="#live-sandbox"
              className="hidden sm:inline-block font-mono text-xs font-bold uppercase tracking-wider text-[#141817] hover:text-[#E34232] transition-colors px-2 py-1"
            >
              Try Stage 01
            </a>
            <button
              type="button"
              data-testid="header-open-checkout-btn"
              onClick={() => openCheckoutDrawer('prompt-pack-39')}
              className="inline-flex items-center gap-2 border-[2px] border-[#141817] bg-[#E5E750] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#141817] shadow-[3px_3px_0_#141817] transition-all hover:bg-[#141817] hover:text-[#E5E750] cursor-pointer"
            >
              <span>Instant Checkout — $39</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ===================================================================
            HERO — EDITORIAL STATEMENT + EMBEDDED ORDER CARD
           =================================================================== */}
        <section className="border-b-[2px] border-[#141817] px-4 pt-10 pb-14 sm:px-8 sm:pt-14 sm:pb-20">
          <div className="mx-auto max-w-[1400px]">
            {/* Top Classification Ledger */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b-[1.5px] border-[#141817] pb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#141817]/80">
              <div className="flex items-center gap-2.5">
                <span className="inline-block h-2 w-2 bg-[#E34232]" />
                <span className="font-bold text-[#141817]">
                   EDITION 2026.11 // SEO, CONVERSION &amp; CLAUDE QUALITY AUDITOR SUITE
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <span>FORMAT: .MD + CLAUDE SKILL.MD</span>
                <span>WORKS WITH: CLAUDE 3.7/4 · GPT-4O · CURSOR</span>
                <span className="font-bold text-[#123F38]">INSTANT DOWNLOAD · $39</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left 7 Columns: Editorial Statement & Proof Bullets */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 border-[1.5px] border-[#141817] bg-[#123F38] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[#E5E750] mb-5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>12-STAGE PIPELINE + INSTALLABLE CLAUDE AUDITOR SKILL</span>
                </div>

                <h1 className="font-display text-[clamp(2.4rem,5.2vw,4.75rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-[#141817]">
                  STOP RUNNING
                  <br />
                  GENERIC AI AUDITS
                  <br />
                  <span className="inline-block bg-[#E5E750] px-2.5 py-0.5 border-[2px] border-[#141817] shadow-[5px_5px_0_#141817] mt-1">
                    THAT MISS THE FIX.
                  </span>
                </h1>

                <p className="mt-7 max-w-[60ch] font-sans text-base sm:text-lg leading-relaxed text-[#141817]/90">
                  Most SEO and conversion prompts produce polite, vague checklists that never move revenue. This is the exact{' '}
                  <strong className="font-bold text-[#141817]">
                    12-Stage Audit-to-Action Prompt System &amp; Claude Deliverable Quality Auditor
                  </strong>{' '}
                  we built inside Context &amp; Muse to tear down commercial websites, enforce evidence-traced quality gates (
                  <code className="font-mono text-sm bg-[#EAE3D5] px-1.5 py-0.5 border border-[#141817]/30">
                    E1–E4
                  </code>{' '}
                  / <code className="font-mono text-sm bg-[#EAE3D5] px-1.5 py-0.5 border border-[#141817]/30">P0–P3</code>), rewrite above-the-fold positioning, architect Hub-and-Spoke SEO clusters, and compile production JSON-LD schema.
                </p>

                {/* Primary Hero Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    data-testid="hero-open-checkout-btn"
                    onClick={() => openCheckoutDrawer('prompt-pack-39')}
                    className="inline-flex items-center gap-3 border-[2px] border-[#141817] bg-[#141817] px-7 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.12em] text-[#E5E750] shadow-[6px_6px_0_#123F38] transition-all hover:bg-[#123F38] hover:text-[#F2ECE1] cursor-pointer"
                  >
                    <span>Acquire Prompt Pack — $39</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>

                  <a
                    href="#live-sandbox"
                    className="inline-flex items-center gap-2 border-[2px] border-[#141817] bg-[#FAF8F3] px-5 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.1em] text-[#141817] shadow-[4px_4px_0_#141817] transition-all hover:bg-[#EAE3D5]"
                  >
                    <Terminal className="h-4 w-4 text-[#123F38]" />
                    <span>Test Stage 01 on Your URL</span>
                  </a>
                </div>

                {/* Key Architectural Capabilities Strip */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 border-[2px] border-[#141817] bg-[#FAF8F3] divide-y-[1.5px] sm:divide-y-0 sm:divide-x-[1.5px] divide-[#141817]">
                  <div className="p-4">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#123F38]">
                      01 // COLD PERCEPTION TEARDOWN
                    </div>
                    <div className="mt-1 font-display text-xl font-black uppercase text-[#141817]">
                      10-SECTION AUDIT
                    </div>
                    <p className="mt-1 font-sans text-xs text-[#141817]/80 leading-relaxed">
                      5-second clarity test, 6-dimension weighted scorecard (X/30), and single highest-leverage fix.
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#E34232]">
                      02 // CLAUDE SKILL.MD GATE
                    </div>
                    <div className="mt-1 font-display text-xl font-black uppercase text-[#141817]">
                      E1–E4 + P0–P3
                    </div>
                    <p className="mt-1 font-sans text-xs text-[#141817]/80 leading-relaxed">
                      Installable Claude Skill that enforces [Location] — [Evidence] — [Impact] — [Fix] on every output.
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#123F38]">
                      03 // FULL EXECUTION STACK
                    </div>
                    <div className="mt-1 font-display text-xl font-black uppercase text-[#141817]">
                      SEO + JSON-LD + ADS
                    </div>
                    <p className="mt-1 font-sans text-xs text-[#141817]/80 leading-relaxed">
                      Hub-and-Spoke pages, anti-AI-cliché copy calibration, @graph schema, and 6-ratio ad copy matrix.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right 5 Columns: Embedded Direct-Acquisition Dossier Card */}
              <div className="lg:col-span-5">
                <div className="border-[2.5px] border-[#141817] bg-[#FAF8F3] shadow-[10px_10px_0_#141817]">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b-[2px] border-[#141817] bg-[#141817] px-5 py-3.5 text-[#F2ECE1]">
                    <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider">
                      <span className="inline-block h-2.5 w-2.5 bg-[#E5E750]" />
                      <span>DIRECT ACQUISITION LEDGER</span>
                    </div>
                    <span className="bg-[#123F38] px-2 py-0.5 font-mono text-[10px] font-bold text-[#E5E750]">
                      SKU: CXM-PP-03
                    </span>
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="flex items-baseline justify-between gap-4 border-b-[1.5px] border-[#141817]/20 pb-5">
                      <div>
                        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#123F38]">
                          COMPLETE 12-STAGE DOSSIER + CLAUDE SKILL
                        </div>
                        <h2 className="mt-1 font-display text-2xl font-black uppercase text-[#141817]">
                          AUDIT-TO-ACTION PACK
                        </h2>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-4xl sm:text-5xl font-black text-[#141817] leading-none">
                          $39
                        </div>
                        <div className="mt-1 font-mono text-[10px] font-bold uppercase text-[#123F38]">
                          ONE-TIME · OWN FOREVER
                        </div>
                      </div>
                    </div>

                    {/* Included Files List */}
                    <div className="mt-5 space-y-2.5">
                      <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#141817]/75">
                        INCLUDED IN YOUR INSTANT DOWNLOAD:
                      </div>
                      {PACKAGE_MANIFEST.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 border border-[#141817]/25 bg-[#F2ECE1] p-2.5"
                        >
                          <Check className="h-4 w-4 text-[#123F38] shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[11px] font-bold text-[#141817] truncate">
                                {item.file}
                              </span>
                              <span className="shrink-0 bg-[#141817] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#E5E750]">
                                {item.type}
                              </span>
                            </div>
                            <p className="mt-0.5 font-sans text-xs text-[#141817]/80 leading-snug">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Embedded Quick-Buy Form right inside the Hero Card */}
                    <form
                      onSubmit={handleProceedToStripe}
                      className="mt-6 border-t-[1.5px] border-[#141817] pt-5 space-y-3"
                    >
                      <div>
                        <label
                          htmlFor="hero-checkout-email"
                          className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#141817] mb-1"
                        >
                          DELIVERY EMAIL (OPTIONAL PRE-FILL FOR STRIPE RECEIPT):
                        </label>
                        <input
                          id="hero-checkout-email"
                          type="email"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          placeholder="you@studio-or-company.com"
                          className="w-full border-[1.5px] border-[#141817] bg-[#FAF8F3] px-3.5 py-2.5 font-mono text-xs text-[#141817] placeholder:text-[#141817]/40 focus:outline-none focus:bg-[#E5E750]/20"
                        />
                      </div>

                      <button
                        type="submit"
                        data-testid="hero-card-instant-buy-btn"
                        className="w-full flex items-center justify-center gap-2 border-[2px] border-[#141817] bg-[#E5E750] px-5 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#141817] shadow-[5px_5px_0_#141817] transition-all hover:bg-[#141817] hover:text-[#E5E750] cursor-pointer"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>Proceed to Instant $39 Checkout</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openCheckoutDrawer('prompt-pack-39')}
                        className="w-full text-center font-mono text-[11px] font-bold uppercase tracking-wider text-[#123F38] hover:underline pt-1 cursor-pointer"
                      >
                        Or open full checkout drawer (Compare with $149 Written Audit) →
                      </button>
                    </form>

                    {/* Post-Purchase Instant Unlock Note */}
                    <div className="mt-4 flex items-center justify-between border-t border-[#141817]/15 pt-3 font-mono text-[10px] text-[#141817]/75">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#123F38]" />
                        Stripe 256-Bit Checkout · Auto-redirects to .MD download
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCheckoutOpen(true);
                          setShowReceiptUnlock(true);
                        }}
                        className="font-bold text-[#141817] underline hover:text-[#E34232] cursor-pointer"
                      >
                        Already paid?
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            MOVEMENT II — INTERACTIVE 12-STAGE PROMPT & CLAUDE SKILL INSPECTOR
           =================================================================== */}
        <section
          id="live-inspector"
          className="scroll-mt-16 border-b-[2px] border-[#141817] bg-[#EAE3D5] px-4 py-16 sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b-[2px] border-[#141817] pb-8 mb-10">
              <div className="lg:col-span-8">
                <div className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#123F38] mb-2">
                  01 / INSIDE THE 12-STAGE ARCHITECTURE
                </div>
                <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-black uppercase leading-[0.94] tracking-[-0.03em] text-[#141817]">
                  INSPECT EVERY STAGE, VARIABLE &amp; OUTPUT SPECIMEN
                </h2>
              </div>
              <div className="lg:col-span-4">
                <p className="font-sans text-sm sm:text-base text-[#141817]/85 leading-relaxed">
                  Click through all 6 modules below to inspect the exact system instructions, input variables, and the difference between a generic AI prompt and an evidence-traced Context &amp; Muse prompt.
                </p>
              </div>
            </div>

            {/* Interactive Tab Bar */}
            <div className="flex flex-wrap border-[2px] border-[#141817] bg-[#141817]">
              {STAGES_SPECIMEN.map((stage) => {
                const isActive = stage.id === activeStage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    data-testid={`inspector-tab-${stage.id}`}
                    onClick={() => setActiveStageId(stage.id)}
                    className={`flex-1 min-w-[180px] px-4 py-3.5 text-left font-mono text-xs font-bold uppercase tracking-wider border-r border-b border-[#F2ECE1]/15 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#E5E750] text-[#141817]'
                        : 'bg-[#141817] text-[#F2ECE1]/85 hover:bg-[#1E2422] hover:text-[#E5E750]'
                    }`}
                  >
                    {stage.shortTab}
                  </button>
                );
              })}
            </div>

            {/* Active Stage Specimen Board */}
            <div className="border-x-[2px] border-b-[2px] border-[#141817] bg-[#FAF8F3] shadow-[8px_8px_0_#141817]">
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y-[2px] lg:divide-y-0 lg:divide-x-[2px] divide-[#141817]">
                {/* Left 5 Cols: Stage Overview, Input Variables & Deliverables */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#123F38]">
                        {activeStage.code}
                      </span>
                      <span className="bg-[#141817] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#E5E750]">
                        {activeStage.badge}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-2xl sm:text-3xl font-black uppercase leading-[1.02] text-[#141817]">
                      {activeStage.title}
                    </h3>

                    <p className="mt-4 font-sans text-sm sm:text-base text-[#141817]/85 leading-relaxed">
                      {activeStage.summary}
                    </p>

                    {/* Parameter Tokens */}
                    <div className="mt-6">
                      <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#141817]/70 mb-2">
                        PARAMETERIZED INPUT VARIABLES:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeStage.variables.map((v) => (
                          <span
                            key={v}
                            className="border border-[#141817] bg-[#F2ECE1] px-2 py-1 font-mono text-[11px] font-bold text-[#123F38]"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stage Output Deliverables */}
                    <div className="mt-6 border-t border-[#141817]/20 pt-5">
                      <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#141817]/70 mb-2.5">
                        WHAT THIS STAGE OUTPUTS:
                      </div>
                      <ul className="space-y-2">
                        {activeStage.deliverables.map((d, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 font-mono text-xs text-[#141817]"
                          >
                            <Check className="h-3.5 w-3.5 text-[#123F38] shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t-[1.5px] border-[#141817] flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => openCheckoutDrawer('prompt-pack-39')}
                      className="inline-flex items-center gap-2 border-[2px] border-[#141817] bg-[#123F38] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#E5E750] shadow-[4px_4px_0_#141817] hover:bg-[#141817] transition-colors cursor-pointer"
                    >
                      <span>Unlock All 12 Stages — $39</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                    <span className="font-mono text-[11px] text-[#141817]/70">
                      Instant .MD + SKILL.md download
                    </span>
                  </div>
                </div>

                {/* Right 7 Cols: Verbatim Prompt Excerpt + Generic vs Context & Muse Output Diff */}
                <div className="lg:col-span-7 bg-[#141817] text-[#F2ECE1] p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2ECE1]/20 pb-3 mb-4">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#E5E750]">
                        <FileCode className="h-4 w-4" />
                        <span>SYSTEM PROMPT ARCHITECTURE EXCERPT</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyStageSnippet}
                        className="inline-flex items-center gap-1.5 border border-[#F2ECE1]/30 bg-[#1E2422] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#F2ECE1] hover:border-[#E5E750] hover:text-[#E5E750] transition-colors cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        <span>{copiedStage ? 'Copied Excerpt!' : 'Copy Excerpt'}</span>
                      </button>
                    </div>

                    <pre className="overflow-x-auto whitespace-pre-wrap border border-[#F2ECE1]/20 bg-[#0B0E0D] p-4 font-mono text-xs leading-relaxed text-[#F2ECE1]/90 max-h-[290px] overflow-y-auto">
                      {activeStage.promptSnippet}
                    </pre>

                    {/* Side-by-Side Output Diff: Weak Generic Prompt vs Context & Muse Evidence Gate */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-[#E34232]/50 bg-[#1B1212] p-4">
                        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#E34232] mb-1.5">
                          ✗ TYPICAL GENERIC AI PROMPT OUTPUT
                        </div>
                        <p className="font-mono text-xs text-[#F2ECE1]/75 leading-relaxed">
                          {activeStage.genericComparison.bad}
                        </p>
                      </div>

                      <div className="border border-[#E5E750]/60 bg-[#122622] p-4">
                        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#E5E750] mb-1.5">
                          ✓ CONTEXT &amp; MUSE EVIDENCE-TRACED OUTPUT
                        </div>
                        <p className="font-mono text-xs text-[#F2ECE1] leading-relaxed whitespace-pre-line">
                          {activeStage.genericComparison.good}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            MOVEMENT III — INTERACTIVE STAGE-01 SANDBOX ("TRY BEFORE YOU BUY")
           =================================================================== */}
        <section
          id="live-sandbox"
          className="scroll-mt-16 border-b-[2px] border-[#141817] px-4 py-16 sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="border-[2.5px] border-[#141817] bg-[#141817] text-[#F2ECE1] shadow-[10px_10px_0_#123F38]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b-[2px] border-[#F2ECE1]/20 bg-[#123F38] px-6 py-4">
                <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#E5E750]">
                  <Terminal className="h-4 w-4" />
                  <span>INTERACTIVE STAGE-01 PROMPT COMPILER // TEST ON YOUR DOMAIN NOW</span>
                </div>
                <span className="font-mono text-[11px] text-[#F2ECE1]/80">
                  Customize below → Copy into Claude or ChatGPT to test Stage 01 free
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#F2ECE1]/20">
                {/* Left 5 Cols: Live Domain Inputs */}
                <div className="lg:col-span-5 p-6 sm:p-8 space-y-5">
                  <div>
                    <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#E5E750]">
                      STEP 1 // CONFIGURE YOUR TARGET SITE
                    </div>
                    <h3 className="mt-1 font-display text-2xl font-black uppercase text-[#F2ECE1]">
                      GENERATE A CUSTOM STAGE-01 SAMPLE
                    </h3>
                    <p className="mt-2 font-sans text-sm text-[#F2ECE1]/80 leading-relaxed">
                      Enter any domain (e.g. <code className="text-[#E5E750]">surenext.com</code> or a client URL) to compile a working Stage-01 Cold Perception Audit sample prompt you can test right now.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="sandbox-domain"
                      className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#E5E750] mb-1.5"
                    >
                      01 / TARGET URL OR DOMAIN:
                    </label>
                    <input
                      id="sandbox-domain"
                      type="text"
                      value={sandboxDomain}
                      onChange={(e) => setSandboxDomain(e.target.value)}
                      className="w-full border border-[#F2ECE1]/40 bg-[#0B0E0D] px-3.5 py-2.5 font-mono text-xs text-[#F2ECE1] focus:border-[#E5E750] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sandbox-niche"
                      className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#E5E750] mb-1.5"
                    >
                      02 / INDUSTRY OR CATEGORY:
                    </label>
                    <input
                      id="sandbox-niche"
                      type="text"
                      value={sandboxNiche}
                      onChange={(e) => setSandboxNiche(e.target.value)}
                      className="w-full border border-[#F2ECE1]/40 bg-[#0B0E0D] px-3.5 py-2.5 font-mono text-xs text-[#F2ECE1] focus:border-[#E5E750] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sandbox-goal"
                      className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#E5E750] mb-1.5"
                    >
                      03 / PRIMARY CONVERSION ACTION:
                    </label>
                    <input
                      id="sandbox-goal"
                      type="text"
                      value={sandboxGoal}
                      onChange={(e) => setSandboxGoal(e.target.value)}
                      className="w-full border border-[#F2ECE1]/40 bg-[#0B0E0D] px-3.5 py-2.5 font-mono text-xs text-[#F2ECE1] focus:border-[#E5E750] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      data-testid="copy-sandbox-prompt-btn"
                      onClick={handleCopySandboxPrompt}
                      className="flex-1 inline-flex items-center justify-center gap-2 border-[1.5px] border-[#E5E750] bg-[#E5E750] px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#141817] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>
                        {copiedSandbox
                          ? '✓ Copied Custom Stage-01 Prompt!'
                          : 'Copy Custom Stage-01 Sample'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Right 7 Cols: Live Compiled Prompt Output + Upgrade to Full 12-Stage Dossier */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#0B0E0D]">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#E5E750]">
                        LIVE COMPILED STAGE-01 SAMPLE (4 OF 10 SECTIONS SHOWN)
                      </span>
                      <span className="font-mono text-[10px] text-[#F2ECE1]/60">
                        READY FOR CLAUDE / CHATGPT
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap border border-[#F2ECE1]/20 bg-[#141817] p-4 font-mono text-xs leading-relaxed text-[#F2ECE1]/90">
                      {generatedSandboxPrompt}
                    </pre>
                  </div>

                  <div className="mt-6 border border-[#E5E750]/40 bg-[#123F38]/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-mono text-xs font-bold uppercase text-[#E5E750]">
                        WANT ALL 10 PERCEPTION SECTIONS + THE E1–E4 AUDITOR SKILL + STAGES 02–12?
                      </div>
                      <p className="mt-1 font-sans text-xs text-[#F2ECE1]/85">
                        Unlock the complete 485-line Markdown dossier and installable Claude Skill immediately after checkout.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openCheckoutDrawer('prompt-pack-39')}
                      className="shrink-0 inline-flex items-center gap-2 border-[1.5px] border-[#E5E750] bg-[#E5E750] px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#141817] hover:bg-[#FAF8F3] transition-colors cursor-pointer"
                    >
                      <span>Get Full Pack — $39</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            MOVEMENT IV — SELF-SERVE ($39) VS DONE-FOR-YOU WRITTEN AUDIT ($149)
           =================================================================== */}
        <section className="px-4 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-10">
              <div className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#123F38] mb-2">
                02 / CHOOSE YOUR EXECUTION PATH
              </div>
              <h2 className="font-display text-[clamp(1.9rem,3.6vw,3.1rem)] font-black uppercase leading-[0.95] text-[#141817]">
                RUN THE SYSTEM YOURSELF ($39) OR HAVE US AUDIT YOUR SITE ($149)
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Option 1: $39 Prompt Pack */}
              <div className="border-[2.5px] border-[#141817] bg-[#FAF8F3] p-7 sm:p-9 shadow-[8px_8px_0_#141817] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#123F38]">
                    <span>OPTION 01 // SELF-SERVE SYSTEM + CLAUDE SKILL</span>
                    <span className="bg-[#E5E750] border border-[#141817] px-2 py-0.5 text-[#141817]">
                      MOST POPULAR
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-3xl font-black uppercase text-[#141817]">
                      12-STAGE PROMPT PACK
                    </h3>
                    <span className="font-display text-4xl font-black text-[#141817]">$39</span>
                  </div>
                  <p className="mt-3 font-sans text-sm sm:text-base text-[#141817]/85 leading-relaxed">
                    Run unlimited teardowns, quality gates, SEO spoke plans, and JSON-LD schema builds across your own websites or client projects inside Claude, ChatGPT, or Cursor.
                  </p>
                  <ul className="mt-6 space-y-2.5 border-t border-[#141817]/20 pt-5 font-mono text-xs text-[#141817]">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#123F38]" />
                      <span>All 12 Parameterized Stages (485+ Lines of System Prompts)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#123F38]" />
                      <span>10-Section Cold Visitor Website Perception Audit Framework</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#123F38]" />
                      <span>Installable Claude Skill: Deliverable Quality Auditor (E1–E4 &amp; P0–P3)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#123F38]" />
                      <span>Lifetime Commercial License for Unlimited Domains</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-5 border-t-[1.5px] border-[#141817]">
                  <button
                    type="button"
                    onClick={() => openCheckoutDrawer('prompt-pack-39')}
                    className="w-full inline-flex items-center justify-center gap-2 border-[2px] border-[#141817] bg-[#E5E750] px-6 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#141817] shadow-[5px_5px_0_#141817] hover:bg-[#141817] hover:text-[#E5E750] transition-all cursor-pointer"
                  >
                    <span>Acquire 12-Stage Prompt Pack — $39</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Option 2: $149 Done-For-You Written Website Conversion & UX Audit */}
              <div className="border-[2.5px] border-[#141817] bg-[#141817] text-[#F2ECE1] p-7 sm:p-9 shadow-[8px_8px_0_#123F38] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#E5E750]">
                    <span>OPTION 02 // STUDIO-EXECUTED DIAGNOSTIC SPRINT</span>
                    <span className="bg-[#123F38] border border-[#E5E750]/40 px-2 py-0.5 text-[#E5E750]">
                      INCLUDES $39 PACK FREE
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-3xl font-black uppercase text-[#F2ECE1]">
                      WRITTEN WEBSITE UX &amp; CONVERSION AUDIT
                    </h3>
                    <span className="font-display text-4xl font-black text-[#E5E750]">$149</span>
                  </div>
                  <p className="mt-3 font-sans text-sm sm:text-base text-[#F2ECE1]/85 leading-relaxed">
                    Want Jayme at Context &amp; Muse to personally run the 15-point forensic diagnostic on your live URL and hand you annotated desktop + mobile screenshots, exact replacement copy, and a prioritized 1-page action roadmap within 48 hours?
                  </p>
                  <ul className="mt-6 space-y-2.5 border-t border-[#F2ECE1]/20 pt-5 font-mono text-xs text-[#F2ECE1]/90">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#E5E750]" />
                      <span>15-Point Written Diagnostic Dossier Delivered in 48 Hours</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#E5E750]" />
                      <span>Annotated Desktop (1440px) &amp; Mobile (390px) Friction Tear-Sheet</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#E5E750]" />
                      <span>Replacement Above-the-Fold Headline, Subhead &amp; CTA Microcopy</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#E5E750]" />
                      <span>Includes the $39 12-Stage Prompt Pack &amp; $149 Credit Toward Any Build</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-5 border-t border-[#F2ECE1]/20">
                  <button
                    type="button"
                    onClick={() => openCheckoutDrawer('written-audit-149')}
                    className="w-full inline-flex items-center justify-center gap-2 border-[2px] border-[#E5E750] bg-[#123F38] px-6 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#E5E750] shadow-[5px_5px_0_#E5E750] hover:bg-[#E5E750] hover:text-[#141817] transition-all cursor-pointer"
                  >
                    <span>Commission 48h Written Audit — $149</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          ON-PAGE EMBEDDED CHECKOUT DRAWER / INSTANT PURCHASE MODAL
         ===================================================================== */}
      {checkoutOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#141817]/75 backdrop-blur-xs"
          data-testid="embedded-checkout-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-drawer-title"
        >
          <div className="relative flex h-full w-full max-w-[560px] flex-col justify-between overflow-y-auto border-l-[3px] border-[#141817] bg-[#F2ECE1] text-[#141817] shadow-[-12px_0_0_#141817]">
            <div>
              {/* Drawer Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b-[2px] border-[#141817] bg-[#141817] px-6 py-4 text-[#F2ECE1]">
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#E5E750]">
                    CONTEXT &amp; MUSE // EMBEDDED EXPRESS CHECKOUT
                  </div>
                  <h2
                    id="checkout-drawer-title"
                    className="font-display text-xl font-black uppercase text-[#F2ECE1]"
                  >
                    CONFIGURE &amp; COMPLETE YOUR ORDER
                  </h2>
                </div>
                <button
                  type="button"
                  data-testid="close-checkout-drawer-btn"
                  onClick={() => setCheckoutOpen(false)}
                  className="border border-[#F2ECE1]/30 bg-[#1E2422] p-2 text-[#F2ECE1] hover:border-[#E5E750] hover:text-[#E5E750] cursor-pointer"
                  aria-label="Close checkout drawer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Step 1: Select Tier inside Drawer */}
                <div>
                  <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#123F38] mb-2.5">
                    01 / SELECT EDITION:
                  </div>
                  <div className="space-y-3">
                    <div
                      onClick={() => setSelectedOffer('prompt-pack-39')}
                      className={`cursor-pointer border-[2px] p-4 transition-all ${
                        selectedOffer === 'prompt-pack-39'
                          ? 'border-[#141817] bg-[#FAF8F3] shadow-[5px_5px_0_#141817]'
                          : 'border-[#141817]/40 bg-[#EAE3D5]/70 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block h-3 w-3 border border-[#141817] ${
                              selectedOffer === 'prompt-pack-39'
                                ? 'bg-[#123F38]'
                                : 'bg-transparent'
                            }`}
                          />
                          <span className="font-display text-lg font-black uppercase">
                            12-Stage SEO, Conversion &amp; Claude Audit Pack
                          </span>
                        </div>
                        <span className="font-display text-2xl font-black">$39</span>
                      </div>
                      <p className="mt-1.5 font-mono text-[11px] text-[#141817]/80">
                        Instant download: 12-stage .MD dossier + 10-Section Website Perception Audit + E1–E4 Claude Quality Auditor Skill.
                      </p>
                    </div>

                    <div
                      onClick={() => setSelectedOffer('written-audit-149')}
                      className={`cursor-pointer border-[2px] p-4 transition-all ${
                        selectedOffer === 'written-audit-149'
                          ? 'border-[#141817] bg-[#FAF8F3] shadow-[5px_5px_0_#123F38]'
                          : 'border-[#141817]/40 bg-[#EAE3D5]/70 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block h-3 w-3 border border-[#141817] ${
                              selectedOffer === 'written-audit-149'
                                ? 'bg-[#123F38]'
                                : 'bg-transparent'
                            }`}
                          />
                          <span className="font-display text-lg font-black uppercase">
                            Done-For-You 15-Point Written Audit + Prompt Pack
                          </span>
                        </div>
                        <span className="font-display text-2xl font-black text-[#123F38]">
                          $149
                        </span>
                      </div>
                      <p className="mt-1.5 font-mono text-[11px] text-[#141817]/80">
                        48h turnaround by Jayme Volstad: Annotated desktop/mobile screenshots, hero rewrite, + the $39 Prompt Pack included.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2: Buyer Info & Express Stripe Launch */}
                <form onSubmit={handleProceedToStripe} className="space-y-4">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#123F38]">
                    02 / RECEIPT &amp; DELIVERY DETAILS:
                  </div>

                  <div>
                    <label
                      htmlFor="drawer-buyer-email"
                      className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#141817] mb-1"
                    >
                      YOUR EMAIL ADDRESS (FOR STRIPE RECEIPT &amp; DOSSIER BACKUP):
                    </label>
                    <input
                      id="drawer-buyer-email"
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="founder@yourcompany.com"
                      className="w-full border-[1.5px] border-[#141817] bg-[#FAF8F3] px-3.5 py-2.5 font-mono text-xs text-[#141817] focus:outline-none focus:bg-[#E5E750]/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="drawer-buyer-domain"
                      className="block font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#141817] mb-1"
                    >
                      PRIMARY WEBSITE URL YOU ARE AUDITING (OPTIONAL):
                    </label>
                    <input
                      id="drawer-buyer-domain"
                      type="text"
                      value={buyerDomain}
                      onChange={(e) => setBuyerDomain(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full border-[1.5px] border-[#141817] bg-[#FAF8F3] px-3.5 py-2.5 font-mono text-xs text-[#141817] focus:outline-none focus:bg-[#E5E750]/20"
                    />
                  </div>

                  {/* Order Summary Box */}
                  <div className="border-[1.5px] border-[#141817] bg-[#EAE3D5] p-4 font-mono text-xs space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>
                        {selectedOffer === 'written-audit-149'
                          ? '15-Point Written Website Audit + 12-Stage Pack'
                          : '12-Stage SEO, Conversion & Claude Audit Pack'}
                      </span>
                      <span>{selectedOffer === 'written-audit-149' ? '$149.00' : '$39.00'}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#141817]/75">
                      <span>Delivery Mechanism</span>
                      <span>Instant Auto-Download after Stripe Payment</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#123F38] font-bold border-t border-[#141817]/20 pt-2">
                      <span>TOTAL DUE TODAY (ONE-TIME)</span>
                      <span>{selectedOffer === 'written-audit-149' ? '$149.00 USD' : '$39.00 USD'}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    data-testid="drawer-submit-stripe-btn"
                    className="w-full flex items-center justify-center gap-2 border-[2px] border-[#141817] bg-[#E5E750] px-6 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#141817] shadow-[5px_5px_0_#141817] hover:bg-[#141817] hover:text-[#E5E750] transition-all cursor-pointer"
                  >
                    <Lock className="h-4 w-4" />
                    <span>
                      Pay {selectedOffer === 'written-audit-149' ? '$149' : '$39'} via Stripe Express Checkout
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </form>

                {/* Instant Receipt Verification / Direct Download Unlock */}
                <div className="border-t-[1.5px] border-[#141817]/25 pt-5">
                  <button
                    type="button"
                    onClick={() => setShowReceiptUnlock(!showReceiptUnlock)}
                    className="flex w-full items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-[#123F38] hover:text-[#141817] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="h-3.5 w-3.5" />
                      <span>Already completed Stripe checkout? Unlock download here</span>
                    </span>
                    <span>{showReceiptUnlock ? '−' : '+'}</span>
                  </button>

                  {showReceiptUnlock && (
                    <form onSubmit={handleReceiptVerify} className="mt-3 space-y-2.5">
                      <input
                        type="text"
                        value={receiptCode}
                        onChange={(e) => setReceiptCode(e.target.value)}
                        placeholder="Enter Stripe receipt email or session ID..."
                        className="w-full border-[1.5px] border-[#141817] bg-[#FAF8F3] px-3 py-2 font-mono text-xs text-[#141817]"
                      />
                      {receiptError && (
                        <p className="font-mono text-[11px] text-[#E34232]">{receiptError}</p>
                      )}
                      <button
                        type="submit"
                        className="w-full border-[1.5px] border-[#141817] bg-[#141817] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#E5E750] hover:bg-[#123F38] cursor-pointer"
                      >
                        Open Instant Download Portal →
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="border-t-[2px] border-[#141817] bg-[#141817] px-6 py-3.5 font-mono text-[11px] text-[#F2ECE1]/80 flex items-center justify-between">
              <span>CONTEXT &amp; MUSE LLC · ROUND ROCK, TX</span>
              <a
                href="mailto:jayme@contextmuse.com"
                className="text-[#E5E750] hover:underline"
              >
                jayme@contextmuse.com
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
