import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Sliders,
  Layers,
  CheckCircle2,
  Eye,
  Compass,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Terminal,
  Ruler,
  Activity,
  ExternalLink,
  Maximize2,
  X,
  Columns,
  ShieldCheck,
  BookOpen,
  Scale,
  Cpu,
  Search,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import PageAnnotationOverlay from '@/components/site/PageAnnotationOverlay';
import DesignSystemSpecimen from '@/components/lab/DesignSystemSpecimen';
import {
  DESIGN_INTELLIGENCE_STUDIES,
  STUDY_BY_ID,
} from '@/components/lab/designIntelligenceStudies';

/**
 * Curated Cross-System Architectural Comparison (Section 04)
 * Reconciled against design-intelligence/references/{locomotive,linear,stripe}.md
 * and docs/design-intelligence-final-pass-corrected-summary.md
 */
const CROSS_SYSTEM_COMPARISON = [
  {
    dimension: 'Primary Philosophy',
    contextMuse: 'Architectural Four-Room Editorial & Diagnostic Proof',
    plaidis: 'Swiss Editorial Grid & Asymmetric Quintic Choreography',
    linear: 'Luminance-Stepped Obsidian Surfaces & High-Density Precision',
    stripe: 'Scale-Over-Weight Light Display Type & Navy-Tinted Elevation',
  },
  {
    dimension: 'Surface Polarity & Canvas',
    contextMuse: '#23282A Charcoal / #EDE9E0 Bone / #D9A62E Gold / #17504A Teal',
    plaidis: '#000000 & #FFFFFF High-Contrast + #312DFB (--menu-color-bg)',
    linear: '#08090A → #0F1011 → #141516 → #191A1B (Dark-First Stepped)',
    stripe: '#FFFFFF & #F8FAFD Daylight + #0D1738 Enterprise Dark Mode',
  },
  {
    dimension: 'Display & UI Typography',
    contextMuse: 'Chivo (900 uppercase display) + Inter body + JetBrains Mono',
    plaidis: 'LocomotiveNew (70–110px, wt 400) + HelveticaNowDisplay (15px/26px)',
    linear: 'Inter Variable ("cv01","ss03", fractional wt 510/590) + Berkeley Mono',
    stripe: 'Söhne Variable (sohne-var "ss01", light wt 300 headings & body)',
  },
  {
    dimension: 'Desktop Grid & Outer Margin',
    contextMuse: '12-Col / 4-Room Split · 40px outer plumb line (0px desktop drift)',
    plaidis: '12 × 95px cols, 20px gutter, 40px outer margin (1360px container)',
    linear: '12 cols, 1024px max-width, 46px outer + 32px inset (x = 78px H1)',
    stripe: '1264px max-width (--hds-space-layout-content-maxWidth), x = 104–208px',
  },
  {
    dimension: 'Elevation & Border Mechanism',
    contextMuse: '1px–2px structural rules (#23282A/15 & #EDE9E0/15), zero-radius framing',
    plaidis: '2px solid desktop / 1px mobile overlines, 0px radius, zero drop shadow',
    linear: '--shadow-low..high aliased to 0px; 1px rgba(255,255,255,0.08) hairlines',
    stripe: '6px bento radius, 1px #E5EDF5 border + 0 16px 32px rgba(50,50,93,0.12)',
  },
  {
    dimension: 'Primary CTA Geometry',
    contextMuse: '44px–48px height, 0px radius, #D9A62E gold or #EDE9E0 fill',
    plaidis: '325px × 48px (.c-button.-full), 2px solid currentColor, 0px radius',
    linear: '32px height, 0 12px pad, 9999px pill, #E5E5E6 fill / #08090A ink',
    stripe: '48px desktop / 44px mobile, 4px radius, #533AFD (--hds-color-core-brand-600)',
  },
  {
    dimension: 'Signature Motion Curve',
    contextMuse: '450ms enter / 200ms leave · cubic-bezier(0.23, 1, 0.32, 1)',
    plaidis: '450ms enter / 200ms leave · cubic-bezier(0.23, 1, 0.32, 1) (Ease-Out Quint)',
    linear: '100ms quick / 250ms regular · cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    stripe: '300ms cubic-bezier(0.25, 1, 0.5, 1) button & card elevation transitions',
  },
];

/**
 * Three Reference Philosophy Cards (Section 02)
 * Visually echoes the editorial composition while grounding every claim in Class A/B/C/D evidence.
 */
const SYSTEM_PHILOSOPHY_CARDS = [
  {
    id: 'plaidis',
    studyNum: 'STUDY 01',
    name: 'Plaidis / Locomotive',
    domain: 'locomotive.ca/en',
    pillarTag: 'STRUCTURE / MOTION',
    cardBg: '#EDE9E0',
    cardText: '#23282A',
    cardMuted: 'rgba(35, 40, 42, 0.72)',
    cardBorder: 'rgba(35, 40, 42, 0.18)',
    accentBar: '#23282A',
    badgeBg: 'rgba(35, 40, 42, 0.08)',
    thesis:
      'Exposes the architectural grid through 2px structural overlines, zero-radius framing, and asymmetric quintic motion.',
    measuredTokens: [
      { label: 'Grid & Margin (Class A/B)', value: '12 × 95px cols · 20px gutter · 40px desktop / 20px mobile margin' },
      { label: 'Type Scale (Class A/B)', value: 'LocomotiveNew 70px/110px (wt 400) + HelveticaNow 26px UI / 15px base' },
      { label: 'Choreography (Class A)', value: '450ms enter / 200ms leave · cubic-bezier(0.23, 1, 0.32, 1)' },
    ],
    inferredPattern:
      'Class C Inferred Rule: Making hover entry 2.25× longer than exit (450ms vs 200ms) gives initiation physical weight while release snaps back without lag.',
    adaptationSummary:
      'Class D Adaptation: Transferred the 40px plumb line, 2px overlines, and 450ms/200ms Ease-Out Quint curve into Context & Muse while retaining Chivo, JetBrains Mono, and the #23282A / #EDE9E0 / #D9A62E / #17504A palette.',
  },
  {
    id: 'linear',
    studyNum: 'STUDY 02',
    name: 'Linear',
    domain: 'linear.app',
    pillarTag: 'DENSITY / SURFACES',
    cardBg: '#08090A',
    cardText: '#F7F8F8',
    cardMuted: '#8A8F98',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    accentBar: '#5E6AD2',
    badgeBg: 'rgba(255, 255, 255, 0.07)',
    thesis:
      'Replaces dark-mode drop shadows with stepped obsidian luminance and fractional variable-font weights that prevent text halation.',
    measuredTokens: [
      { label: 'Surface Stack (Class A)', value: '#08090A → #0F1011 → #141516 → #191A1B + 1px rgba(255,255,255,0.08)' },
      { label: 'Typography (Class A/B)', value: 'Inter Variable ("cv01","ss03") wt 510/590 · 13px–15px UI · -0.022em H1' },
      { label: 'Shadow Aliasing (Class A)', value: '--shadow-tiny..high aliased to 0px transparent; 32px #E5E5E6 pill CTA' },
    ],
    inferredPattern:
      'Class C Inferred Rule: Standard 600/700 bold weights bloom on #08090A canvases; custom 510/590 axis weights preserve crisp glyph apertures at 13px–15px density.',
    adaptationSummary:
      'Class D Adaptation: Scaled the 64px marketing H1 to 29px inside the 1040×650 specimen stage and held the outer inset at 40px/20px so split-slider plumb lines remain exact.',
  },
  {
    id: 'stripe',
    studyNum: 'STUDY 03',
    name: 'Stripe',
    domain: 'stripe.com',
    pillarTag: 'LIGHT / HIERARCHY',
    cardBg: '#FFFFFF',
    cardText: '#061B31',
    cardMuted: '#50617A',
    cardBorder: '#E5EDF5',
    accentBar: '#533AFD',
    badgeBg: '#F8FAFD',
    thesis:
      'Builds high-key institutional clarity through light 300-weight variable display type, deep navy ink contrast, and indigo-tinted elevation.',
    measuredTokens: [
      { label: 'HDS Palette (Class A)', value: '#FFFFFF & #F8FAFD canvas · #061B31 ink (17.37:1) · #533AFD brand-600' },
      { label: 'Light Display (Class A/B)', value: 'sohne-var ("ss01") weight 300 across 48px H1, 32px H2, 26px H3 & 16px body' },
      { label: 'Tinted Depth (Class A/B)', value: '0px 16px 32px rgba(50,50,93,0.12) · 4px button / 6px bento card radii' },
    ],
    inferredPattern:
      'Class C Inferred Rule: Setting 48px–32px headings at weight 300 avoids heavy sans-serif congestion, relying on scale and #061B31 vs #64748D ink contrast for hierarchy.',
    adaptationSummary:
      'Class D Adaptation: Kept <h3> and <p> stacked (rather than .hds-heading--inline) to preserve 85-node DOM parity, and paired #F8FAFD upper cards with #0D1738 dark navy on the bottom ledger.',
  },
];

/**
 * Context & Muse Production Refinements (Section 05)
 */
const THREE_FINDINGS = [
  {
    num: '01',
    category: 'Structural Alignment',
    metric: '24px → 0px',
    metricLabel: 'Desktop Left-Edge Drift',
    whatWasMeasured:
      'On desktop (1440×900), bounding-box inspection of the baseline Context & Muse homepage (52e179d) revealed that the header brand mark (x = 40px) and the hero H1 / primary CTA (x = 64px) sat on two different vertical axes—creating a 24px horizontal step.',
    whatChanged:
      'Established a shared --grid-margin token (40px desktop, 20px mobile) and unified container padding across SiteHeader, HeroPanel, and SiteFooter.',
    whatImproved:
      'All four primary desktop structural anchors (logo, hero H1, primary CTA, and footer copyright) now lock to x = 40px with 0px desktop drift. On mobile (390×844), header and hero align to x = 20px while room tiles preserve 24px (p-6) internal touch cushioning.',
    classification: 'Class B Measured → Class D Production Transfer',
  },
  {
    num: '02',
    category: 'Typography & Visual Consistency',
    metric: '2px Overlines & #D9A62E',
    metricLabel: 'Scale & Palette Discipline',
    whatWasMeasured:
      'Hero copy jumped abruptly between breakpoints, room dividers used low-contrast 1px borders without structural overlines, and the 04 / METHOD room introduced an off-palette emerald (#10B981) hover state.',
    whatChanged:
      'Introduced a fluid display scale (clamp(2.25rem, 3.8vw, 3.75rem) at 1.05 line-height), added 2px solid structural top overlines on room headers, and replaced #10B981 with Context & Muse’s #D9A62E muted gold.',
    whatImproved:
      'Clearer hierarchy between Chivo display statements and JetBrains Mono index labels, stronger quadrant separation, and strict adherence to the 4-color Context & Muse brand palette (#23282A, #EDE9E0, #D9A62E, #17504A).',
    classification: 'Class A/B Measured → Class D Production Transfer',
  },
  {
    num: '03',
    category: 'Interaction Choreography',
    metric: '450ms / 200ms',
    metricLabel: 'Asymmetric Enter / Leave',
    whatWasMeasured:
      'Room tiles previously used a uniform 300ms transition paired with filter: brightness(1.05) on hover, which washed out the deep charcoal (#23282A) and forest (#17504A) pigments equally on entry and exit.',
    whatChanged:
      'Removed the brightness filter and implemented Plaidis / Locomotive’s asymmetric Ease-Out Quint choreography: 450ms on pointer enter and 200ms on pointer leave using cubic-bezier(0.23, 1, 0.32, 1).',
    whatImproved:
      'Hovering a room quadrant initiates with deliberate, weighted deceleration (450ms) and releases crisply (200ms) when moving across the grid—preserving 100% pigment fidelity across all four rooms.',
    classification: 'Class A Measured → Class D Production Transfer',
  },
];

/**
 * Context & Muse Preserved Brand Identity Tokens (Section 05)
 */
const PRESERVED_BRAND_SWATCHES = [
  {
    hex: '#23282A',
    name: 'Architectural Charcoal',
    role: 'Primary Hero & 01 / WORK Room Surface',
    textHex: '#EDE9E0',
    contrast: '11.9:1 AAA',
  },
  {
    hex: '#EDE9E0',
    name: 'Warm Editorial Bone',
    role: 'Case Study Canvas & 02 / BUILD Room Surface',
    textHex: '#23282A',
    contrast: '11.9:1 AAA',
  },
  {
    hex: '#D9A62E',
    name: 'Muted Signal Gold',
    role: '03 / LAB Room Surface & Primary Interactive Accent',
    textHex: '#141617',
    contrast: '8.4:1 AAA',
  },
  {
    hex: '#17504A',
    name: 'Deep Forest Teal',
    role: '04 / METHOD Room Surface & Structural Counterweight',
    textHex: '#EDE9E0',
    contrast: '7.8:1 AAA',
  },
];

/**
 * Five-Stage Methodology Pipeline (Section 01)
 */
const FIVE_STAGES = [
  {
    stage: '01',
    name: 'Reference Selection',
    desc: 'Select three contrasting production systems—Plaidis/Locomotive (editorial structure & motion), Linear (stepped dark-mode density), and Stripe (high-key light display & dimensional elevation).',
  },
  {
    stage: '02',
    name: 'CSSOM & DOM Extraction',
    desc: 'Inspect accessible same-origin stylesheets and computed DOM nodes at 1440×900 and 390×844 (@ 2x DPR) using getComputedStyle() and getBoundingClientRect().',
  },
  {
    stage: '03',
    name: 'Controlled Specimen Test',
    desc: 'Apply each extracted token system to an identical 85-node neutral interface specimen so every visual difference is attributable to tokens rather than changing copy or markup.',
  },
  {
    stage: '04',
    name: 'Selective Production Transfer',
    desc: 'Translate verified structural alignment (40px plumb line), 2px overlines, and asymmetric motion curves (450ms/200ms) into Context & Muse without importing external brand palettes.',
  },
  {
    stage: '05',
    name: 'Technical Verification',
    desc: 'Run deterministic Playwright checks for plumb-line coordinates (0px desktop drift), 85/85 DOM parity, 18/18 WCAG 2.1 contrast ratios, and 11/11 route non-regression gates.',
  },
];

/**
 * Technical Verification Pillars (Section 06)
 */
const VERIFICATION_PILLARS = [
  {
    metric: '0px',
    unit: 'Desktop Plumb Drift',
    scope: '1440×900 Homepage Alignment Check',
    detail:
      'Verified x = 40px left-edge alignment across SiteHeader logo, HeroPanel H1, primary CTA, and SiteFooter (reduced from 24px drift in 52e179d). On mobile (390×844), header and hero align at x = 20px while room tiles retain 24px (p-6) internal padding.',
    status: 'VERIFIED · DESKTOP & MOBILE LOGGED',
  },
  {
    metric: '85 / 85',
    unit: 'Identical DOM Nodes',
    scope: '4 Specimen Variants × 2 Viewports',
    detail:
      'Every specimen variant (neutral, plaidis, linear, stripe) renders the exact same 85 HTML elements (1 section, 38 div, 32 span, 4 p, 4 h3, 4 button, 1 header, 1 footer) and identical textContent across desktop and mobile.',
    status: 'VERIFIED · ZERO MARKUP DRIFT',
  },
  {
    metric: '18 / 18',
    unit: 'WCAG 2.1 Contrast Swatches',
    scope: '6 Swatches × 3 Reference Studies',
    detail:
      'Computed relative luminance ratios (L1 + 0.05) / (L2 + 0.05) verified against rendered RGB styles across all 18 token pairs, including explicit documentation of Linear’s muted #62666D (3.45:1) quaternary telemetry boundary.',
    status: 'VERIFIED · DETERMINISTIC LUMINANCE',
  },
  {
    metric: '11 / 11',
    unit: 'Functional Smoke Gates',
    scope: 'Multi-Route & Interactive Control Suite',
    detail:
      'Automated headless browser verification across /, /work, /build, /lab, /method, /website-system-check/, and /lab/design-intelligence at 390×844, 768×1024, 1440×900, and 1920×1080 with zero console or page errors.',
    status: 'VERIFIED · 11/11 GATES PASSING',
  },
];

const SMOKE_CHECKS = [
  { id: '01', check: 'Entrance quad layout & 4-room CSS grid geometry (1440×900 & 390×844)', status: 'PASS' },
  { id: '02', check: 'Desktop x = 40px plumb-line alignment (Header Logo, Hero H1, Primary CTA, Footer)', status: 'PASS' },
  { id: '03', check: 'Mobile x = 20px outer margin alignment (Header Logo, Hero H1, Primary CTA)', status: 'PASS' },
  { id: '04', check: '85-node DOM & textContent parity across Neutral, Plaidis, Linear & Stripe specimens', status: 'PASS' },
  { id: '05', check: '18/18 WCAG 2.1 relative-luminance contrast swatches verified against computed RGB', status: 'PASS' },
  { id: '06', check: 'Interactive comparison mode buttons (Original / Split / Transformed) & keyboard slider', status: 'PASS' },
  { id: '07', check: 'Detail Inspector modal open, Tab focus trap, Escape dismissal & trigger focus restore', status: 'PASS' },
  { id: '08', check: 'Primary route navigation (/ → /work, /build, /lab, /method, /website-system-check/)', status: 'PASS' },
  { id: '09', check: 'Project Brief drawer open/close state & pre-filled context handoff', status: 'PASS' },
  { id: '10', check: 'Responsive layout integrity across 390×844, 768×1024, 1440×900 & 1920×1080 (0px overflow)', status: 'PASS' },
  { id: '11', check: 'Zero runtime console.error or uncaught pageerror exceptions across all routes', status: 'PASS' },
];

const CLASSIFICATION_BADGE_STYLES = {
  A: 'bg-[#17504A]/15 text-[#17504A] border-[#17504A]/35',
  B: 'bg-[#23282A]/10 text-[#23282A] border-[#23282A]/30',
  C: 'bg-[#9A6F0B]/15 text-[#7A5605] border-[#9A6F0B]/35',
  D: 'bg-[#533AFD]/12 text-[#3B27BA] border-[#533AFD]/30',
};

export default function DesignIntelligenceCaseStudy() {
  const { openBrief } = useBrief();

  // Active study selector ('plaidis' | 'linear' | 'stripe')
  const [activeStudyId, setActiveStudyId] = useState('plaidis');
  // For Study 01 ('plaidis'), allow switching between the shared 85-node neutral specimen
  // and the preserved ContextMuse homepage before/after screenshot comparison (52e179d → 195921a)
  const [study01Surface, setStudy01Surface] = useState('specimen'); // 'specimen' | 'entrance'

  // Comparison stage controls
  const [activeViewport, setActiveViewport] = useState('desktop'); // 'desktop' | 'mobile'
  const [comparisonMode, setComparisonMode] = useState('split'); // 'original' | 'split' | 'transformed'
  const [sliderPercent, setSliderPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Interactive hover reproduction sandbox (Section 05)
  const [hoverReproductionMode, setHoverReproductionMode] = useState('after'); // 'before' | 'after' | 'captured'
  const [hoveringRoom, setHoveringRoom] = useState(false);

  // Progressive disclosure toggles
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  // Detail Inspector modal
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [loadedUrls, setLoadedUrls] = useState({});

  const sliderContainerRef = useRef(null);
  const sliderHandleRef = useRef(null);
  const inspectorTriggerRef = useRef(null);
  const inspectorCloseBtnRef = useRef(null);
  const inspectorDialogRef = useRef(null);

  const activeStudy = STUDY_BY_ID[activeStudyId] || DESIGN_INTELLIGENCE_STUDIES[0];

  // Preload all reference and production comparison images so switching is glitch-free
  useEffect(() => {
    const urlsToPreload = [
      '/assets/images/design-intelligence/exp01_before_desktop.png',
      '/assets/images/design-intelligence/exp01_after_desktop.png',
      '/assets/images/design-intelligence/exp01_before_mobile.png',
      '/assets/images/design-intelligence/exp01_after_mobile.png',
      '/assets/images/design-intelligence/exp01_after_desktop_hover_build.png',
      '/assets/images/design-intelligence/cs_4x3_exp01_before_desktop.png',
      '/assets/images/design-intelligence/cs_4x3_exp01_after_desktop.png',
      '/assets/images/design-intelligence/cs_4x3_exp01_mobile_comparison.png',
      ...DESIGN_INTELLIGENCE_STUDIES.flatMap((s) => [
        s.referenceCaptures.desktop,
        s.referenceCaptures.mobile,
      ]),
    ];

    urlsToPreload.forEach((url) => {
      const img = new Image();
      img.onload = () => {
        setLoadedUrls((prev) => (prev[url] ? prev : { ...prev, [url]: true }));
      };
      img.src = url;
    });
  }, []);

  const handleInquireAboutDesignSystem = () => {
    openBrief({
      initialPath: 'custom',
      initialNeed: 'Design Intelligence & System Architecture',
      sourceContext: 'Design Intelligence Case Study (/lab/design-intelligence)',
    });
  };

  // Synchronize mode buttons with slider percentage
  const selectComparisonMode = (mode) => {
    setComparisonMode(mode);
    if (mode === 'original') {
      setSliderPercent(100);
    } else if (mode === 'transformed') {
      setSliderPercent(0);
    } else {
      setSliderPercent(50);
    }
  };

  const selectStudy = (studyId) => {
    setActiveStudyId(studyId);
    setComparisonMode('split');
    setSliderPercent(50);
  };

  const updateSliderFromClientX = useCallback((clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = Math.round((x / rect.width) * 100);
    setSliderPercent(pct);
    if (pct >= 98) {
      setComparisonMode('original');
    } else if (pct <= 2) {
      setComparisonMode('transformed');
    } else {
      setComparisonMode('split');
    }
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSliderFromClientX(clientX);
    },
    [isDragging, updateSliderFromClientX]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: true });
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Keyboard support for the split comparison handle (WAI-ARIA slider pattern)
  const handleSliderKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 2;
    let next = sliderPercent;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      next = Math.max(0, sliderPercent - step);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      next = Math.min(100, sliderPercent + step);
    } else if (e.key === 'PageDown') {
      e.preventDefault();
      next = Math.max(0, sliderPercent - 10);
    } else if (e.key === 'PageUp') {
      e.preventDefault();
      next = Math.min(100, sliderPercent + 10);
    } else if (e.key === 'Home') {
      e.preventDefault();
      next = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      next = 100;
    } else {
      return;
    }
    setSliderPercent(next);
    if (next >= 98) setComparisonMode('original');
    else if (next <= 2) setComparisonMode('transformed');
    else setComparisonMode('split');
  };

  // Focus trap & Escape handler for the Detail Inspector modal
  const closeInspector = useCallback(() => {
    setInspectorOpen(false);
    requestAnimationFrame(() => {
      if (inspectorTriggerRef.current) {
        inspectorTriggerRef.current.focus();
      }
    });
  }, []);

  useEffect(() => {
    if (!inspectorOpen) return;

    const focusTimer = requestAnimationFrame(() => {
      if (inspectorCloseBtnRef.current) {
        inspectorCloseBtnRef.current.focus();
      }
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeInspector();
        return;
      }
      if (e.key === 'Tab' && inspectorDialogRef.current) {
        const focusables = inspectorDialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inspectorOpen, closeInspector]);

  const entranceImages = {
    desktop: {
      before: '/assets/images/design-intelligence/exp01_before_desktop.png',
      after: '/assets/images/design-intelligence/exp01_after_desktop.png',
      label: '1440 × 900 Desktop Entrance Quad (52e179d → 195921a)',
    },
    mobile: {
      before: '/assets/images/design-intelligence/exp01_before_mobile.png',
      after: '/assets/images/design-intelligence/exp01_after_mobile.png',
      label: '390 × 844 Mobile Entrance Viewport (52e179d → 195921a)',
    },
  }[activeViewport];

  const isEntranceComparisonActive =
    activeStudyId === 'plaidis' && study01Surface === 'contextmuse-home';

  const effectiveClipPercent =
    comparisonMode === 'original'
      ? 100
      : comparisonMode === 'transformed'
      ? 0
      : sliderPercent;

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden bg-[#EDE9E0] text-[#23282A] selection:bg-[#D9A62E] selection:text-[#141617]">
      <SiteHeader />
      <PageAnnotationOverlay />

      <main className="flex-1">
      {/* =====================================================================
          EDITORIAL HERO BANNER — WORKING TITLE, OPENING THESIS & METRIC STRIP
          ===================================================================== */}
      <section className="bg-[#23282A] text-[#EDE9E0] border-b-2 border-[#141617] pt-8 pb-12 sm:pt-12 sm:pb-16 px-5 sm:px-10">
        <div className="max-w-[1360px] mx-auto">
          {/* Top Breadcrumb & Classification Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#EDE9E0]/15">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/lab"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#EDE9E0]/75 hover:text-[#D9A62E] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>03 / LAB</span>
              </Link>
              <span className="text-[#EDE9E0]/30 font-mono text-xs">/</span>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#D9A62E] font-bold">
                CONTEXT &amp; MUSE / RESEARCH 001
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#EDE9E0]/80">
                DESIGN SYSTEMS · FRONT-END ARCHITECTURE
              </span>
              <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 bg-[#17504A] text-[#EDE9E0] border border-[#EDE9E0]/20">
                VERIFIED CASE STUDY
              </span>
            </div>
          </div>

          {/* Working Title & Opening Thesis */}
          <div className="pt-8 sm:pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#D9A62E] font-bold">
                  Design Intelligence
                </span>
                <span className="text-[#EDE9E0]/40">—</span>
                <span className="font-sans text-sm sm:text-base italic text-[#EDE9E0]/85">
                  From visual reference to measurable design decisions.
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-[#EDE9E0] leading-[1.04]">
                “Design is not a collection of preferences. It is a system of relationships.”
              </h1>

              <p className="text-base sm:text-lg text-[#EDE9E0]/82 font-sans max-w-3xl leading-relaxed">
                An investigation into how three contrasting reference systems—
                <strong className="text-[#EDE9E0] font-semibold">Plaidis / Locomotive</strong>,{' '}
                <strong className="text-[#EDE9E0] font-semibold">Linear</strong>, and{' '}
                <strong className="text-[#EDE9E0] font-semibold">Stripe</strong>—were examined using
                CSSOM and DOM measurements, translated onto an identical 85-node interface specimen,
                and evaluated for selective production transfer into Context &amp; Muse.
              </p>
            </div>

            {/* Primary Hero Actions */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end justify-end">
              <a
                href="#interactive-comparison"
                className="inline-flex items-center justify-center gap-2.5 bg-[#D9A62E] text-[#141617] px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] hover:bg-[#EDE9E0] transition-colors w-full sm:w-auto lg:w-full max-w-xs"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Inspect 85-Node Specimen</span>
              </a>
              <a
                href="#what-changed"
                className="inline-flex items-center justify-center gap-2.5 bg-transparent text-[#EDE9E0] border border-[#EDE9E0]/30 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors w-full sm:w-auto lg:w-full max-w-xs"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>See Context &amp; Muse Transfer</span>
              </a>
            </div>
          </div>

          {/* Three Architectural Metric Callouts (Matching Reference Composition) */}
          <div className="mt-10 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#EDE9E0]/20">
            <div className="pt-2 border-t border-[#D9A62E]/50 sm:border-t-0">
              <span className="font-display text-3xl sm:text-4xl font-black text-[#D9A62E] tracking-tight block">
                03
              </span>
              <span className="font-sans text-sm font-bold text-[#EDE9E0] mt-1 block">
                Reference systems
              </span>
              <p className="font-mono text-[11px] text-[#EDE9E0]/65 mt-1 leading-relaxed">
                Plaidis / Locomotive (structure &amp; motion), Linear (stepped dark surfaces), and Stripe (light display &amp; elevation).
              </p>
            </div>

            <div className="pt-2 border-t border-[#EDE9E0]/20 sm:border-t-0 sm:border-l sm:border-[#EDE9E0]/15 sm:pl-6">
              <span className="font-display text-3xl sm:text-4xl font-black text-[#D9A62E] tracking-tight block">
                85
              </span>
              <span className="font-sans text-sm font-bold text-[#EDE9E0] mt-1 block">
                Identical DOM nodes
              </span>
              <p className="font-mono text-[11px] text-[#EDE9E0]/65 mt-1 leading-relaxed">
                Shared neutral baseline holding HTML structure, text copy, and outer plumb inset (40px / 20px) strictly constant.
              </p>
            </div>

            <div className="pt-2 border-t border-[#EDE9E0]/20 sm:border-t-0 sm:border-l sm:border-[#EDE9E0]/15 sm:pl-6">
              <span className="font-display text-3xl sm:text-4xl font-black text-[#D9A62E] tracking-tight block">
                02
              </span>
              <span className="font-sans text-sm font-bold text-[#EDE9E0] mt-1 block">
                Viewports tested
              </span>
              <p className="font-mono text-[11px] text-[#EDE9E0]/65 mt-1 leading-relaxed">
                1440×900 desktop &amp; 390×844 mobile @ 2x DPR for token extraction, plus 768×1024 &amp; 1920×1080 responsive gates.
              </p>
            </div>
          </div>

          {/* Seven-Section Editorial Index Bar */}
          <nav
            aria-label="Case study sections"
            className="mt-8 pt-4 border-t border-[#EDE9E0]/15 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.13em]"
          >
            <span className="text-[#EDE9E0]/45">INDEX:</span>
            <a href="#the-question" className="text-[#EDE9E0]/80 hover:text-[#D9A62E] transition-colors">
              01. The Question
            </a>
            <a href="#three-systems" className="text-[#EDE9E0]/80 hover:text-[#D9A62E] transition-colors">
              02. Three Systems
            </a>
            <a href="#interactive-comparison" className="text-[#D9A62E] font-bold hover:underline">
              03. Controlled Experiment
            </a>
            <a href="#token-extraction-breakdown" className="text-[#EDE9E0]/80 hover:text-[#D9A62E] transition-colors">
              04. Measurements
            </a>
            <a href="#what-changed" className="text-[#EDE9E0]/80 hover:text-[#D9A62E] transition-colors">
              05. Applying Research
            </a>
            <a href="#verification" className="text-[#EDE9E0]/80 hover:text-[#D9A62E] transition-colors">
              06. Verification
            </a>
            <a href="#implications" className="text-[#EDE9E0]/80 hover:text-[#D9A62E] transition-colors">
              07. Implications
            </a>
          </nav>
        </div>
      </section>

      {/* =====================================================================
          SECTION 01 — THE QUESTION: VISUAL IMITATION VS. STRUCTURAL UNDERSTANDING
          ===================================================================== */}
      <section
        id="the-question"
        className="py-12 sm:py-16 px-5 sm:px-10 max-w-[1360px] mx-auto border-b border-[#23282A]/15"
      >
        <div className="border-t-2 border-[#23282A] pt-3 mb-8 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#23282A] font-bold">
            01 / THE QUESTION
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#23282A]/65">
            METHODOLOGY &amp; EPISTEMIC BOUNDARIES
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#23282A] leading-[1.08]">
              How can we study the underlying mechanics of sophisticated interfaces instead of copying their visible appearance?
            </h2>
            <p className="text-sm sm:text-base text-[#23282A]/80 font-sans leading-relaxed">
              When teams admire a reference interface, the default impulse is visual imitation:
              borrowing surface colors, mimicking hero layouts, or copying decorative chrome without
              understanding why the original system felt cohesive. When those surface traits are
              pasted onto different content, hierarchy breaks down.
            </p>
            <p className="text-sm sm:text-base text-[#23282A]/80 font-sans leading-relaxed">
              <strong className="font-bold text-[#23282A]">Design Intelligence</strong> replaces
              surface imitation with empirical measurement. By inspecting live CSS Object Model
              (<code className="font-mono text-xs bg-[#23282A]/10 px-1.5 py-0.5">cssRules</code>)
              declarations and computed DOM geometry (
              <code className="font-mono text-xs bg-[#23282A]/10 px-1.5 py-0.5">getComputedStyle</code>,{' '}
              <code className="font-mono text-xs bg-[#23282A]/10 px-1.5 py-0.5">getBoundingClientRect</code>
              ), we isolate the proportional relationships—type ratios, column track equations,
              luminance steps, contrast floors, and transition curves—that actually produce clarity.
            </p>
          </div>

          {/* Contrast Box: Visual Imitation vs. Structural Understanding */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="bg-[#FAF8F5] border border-[#23282A]/15 p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#7A5605] font-bold block">
                SURFACE IMITATION (FRAGILE)
              </span>
              <p className="text-xs text-[#23282A]/75 font-sans mt-2 leading-relaxed">
                Copies visible colors, font names, or screenshot compositions without measuring the
                grid math, contrast ratios, or content density constraints that support them.
              </p>
            </div>
            <div className="bg-[#23282A] text-[#EDE9E0] border border-[#23282A] p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#D9A62E] font-bold block">
                STRUCTURAL UNDERSTANDING (TRANSFERABLE)
              </span>
              <p className="text-xs text-[#EDE9E0]/85 font-sans mt-2 leading-relaxed">
                Measures declared tokens (`Class A`) and rendered DOM geometry (`Class B`),
                synthesizes structural rules (`Class C`), and tests them on neutral content before
                adapting (`Class D`) into production.
              </p>
            </div>
          </div>
        </div>

        {/* 5-Stage Pipeline Strip */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FIVE_STAGES.map((s) => (
            <div
              key={s.stage}
              className="bg-[#FAF8F5] border border-[#23282A]/15 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#23282A]/10 pb-2 mb-2.5">
                  <span className="font-mono text-xs font-bold text-[#9A6F0B]">
                    STAGE {s.stage}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#23282A]/50">
                    PIPELINE
                  </span>
                </div>
                <h3 className="font-display text-sm font-black uppercase tracking-tight text-[#23282A]">
                  {s.name}
                </h3>
                <p className="text-xs text-[#23282A]/75 font-sans mt-1.5 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 02 — THREE SYSTEMS, THREE PHILOSOPHIES
          ===================================================================== */}
      <section
        id="three-systems"
        className="py-12 sm:py-16 px-5 sm:px-10 max-w-[1360px] mx-auto border-b border-[#23282A]/15"
      >
        <div className="border-t-2 border-[#23282A] pt-3 mb-8 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#23282A] font-bold">
            02 / THREE SYSTEMS, THREE PHILOSOPHIES
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#23282A]/65">
            MEASURED TOKENS (CLASS A/B) · INFERRED RULES (CLASS C) · ADAPTATIONS (CLASS D)
          </span>
        </div>

        <div className="max-w-3xl mb-8">
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#23282A] leading-[1.08]">
            Three contrasting visual systems measured under identical viewport conditions.
          </h2>
          <p className="text-sm sm:text-base text-[#23282A]/80 font-sans mt-3 leading-relaxed">
            Rather than studying similar websites, we selected three references that solve
            hierarchy through fundamentally different mechanisms: exposed editorial grid rules and
            asymmetric motion (<strong className="font-semibold">Plaidis / Locomotive</strong>),
            stepped dark-mode luminance and compact variable typography (
            <strong className="font-semibold">Linear</strong>), and high-key light display scale
            with indigo-tinted elevation (<strong className="font-semibold">Stripe</strong>).
          </p>
        </div>

        {/* Three Architectural Philosophy Cards (Echoing Reference Mockup Triptych) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SYSTEM_PHILOSOPHY_CARDS.map((card) => {
            const isSelected = activeStudyId === card.id;
            return (
              <article
                key={card.id}
                style={{
                  backgroundColor: card.cardBg,
                  color: card.cardText,
                  borderColor: isSelected ? '#D9A62E' : card.cardBorder,
                }}
                className={`border-2 p-6 flex flex-col justify-between transition-all ${
                  isSelected ? 'ring-2 ring-[#D9A62E] shadow-md' : ''
                }`}
              >
                <div>
                  {/* Top Signature Accent Bar & Study Number */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div
                      style={{ backgroundColor: card.accentBar }}
                      className="h-2 w-24 rounded-full"
                    />
                    <span
                      style={{ color: card.cardMuted }}
                      className="font-mono text-[11px] uppercase tracking-[0.16em] font-bold"
                    >
                      {card.studyNum} · {card.domain}
                    </span>
                  </div>

                  {/* System Title & Thesis */}
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight">
                      {card.name}
                    </h3>
                    {isSelected && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 bg-[#D9A62E] text-[#141617] font-bold">
                        ACTIVE IN STAGE
                      </span>
                    )}
                  </div>

                  <p
                    style={{ color: card.cardMuted }}
                    className="text-xs sm:text-sm font-sans mt-2.5 leading-relaxed"
                  >
                    {card.thesis}
                  </p>

                  {/* Measured Source Tokens (Class A/B) */}
                  <div
                    style={{ borderColor: card.cardBorder }}
                    className="mt-5 pt-4 border-t space-y-2.5"
                  >
                    <span
                      style={{ color: card.cardMuted }}
                      className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold block"
                    >
                      VERIFIED SOURCE MEASUREMENTS (CLASS A / B)
                    </span>
                    {card.measuredTokens.map((t) => (
                      <div
                        key={t.label}
                        style={{ backgroundColor: card.badgeBg }}
                        className="p-2.5 text-xs font-mono"
                      >
                        <span
                          style={{ color: card.cardMuted }}
                          className="text-[10px] uppercase tracking-wider block"
                        >
                          {t.label}
                        </span>
                        <span className="font-bold block mt-0.5 leading-snug">{t.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Inferred Structural Pattern (Class C) & Adaptation (Class D) */}
                  <div
                    style={{ borderColor: card.cardBorder }}
                    className="mt-4 pt-3 border-t space-y-2 text-xs font-sans leading-relaxed"
                  >
                    <p style={{ color: card.cardMuted }}>{card.inferredPattern}</p>
                    <p style={{ color: card.cardMuted }}>{card.adaptationSummary}</p>
                  </div>
                </div>

                {/* Bottom Pillar Footer & Load in Specimen Action */}
                <div
                  style={{ borderColor: card.cardBorder }}
                  className="mt-6 pt-3 border-t flex items-center justify-between gap-3"
                >
                  <span
                    style={{ color: card.cardMuted }}
                    className="font-mono text-[11px] uppercase tracking-[0.16em] font-bold"
                  >
                    {card.pillarTag}
                  </span>
                  <a
                    href="#interactive-comparison"
                    onClick={() => {
                      selectStudy(card.id);
                      if (card.id === 'plaidis') setStudy01Surface('specimen');
                    }}
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] font-bold px-3 py-1.5 bg-[#D9A62E] text-[#141617] hover:opacity-90 transition-opacity"
                  >
                    <span>Load Specimen</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          SECTION 03 — THE CONTROLLED EXPERIMENT (SHARED 85-NODE SPECIMEN)
          ===================================================================== */}
      <section
        id="interactive-comparison"
        className="py-12 sm:py-16 px-5 sm:px-10 max-w-[1360px] mx-auto border-b border-[#23282A]/15"
      >
        <div className="border-t-2 border-[#23282A] pt-3 mb-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#23282A] font-bold">
              03 / THE CONTROLLED EXPERIMENT
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] px-2 py-0.5 bg-[#D9A62E]/25 text-[#23282A] font-bold">
              85-NODE INTERACTIVE SPECIMEN
            </span>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#23282A]/65">
            HOLDING CONTENT &amp; DOM CONSTANT TO ISOLATE TOKEN EFFECTS
          </span>
        </div>

        {/* Editorial Explanation of Why 85 Identical Nodes Matter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-7">
          <div className="lg:col-span-8">
            <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#23282A] leading-[1.08]">
              How do verified design-system tokens transform the exact same interface?
            </h2>
            <p className="text-sm sm:text-base text-[#23282A]/80 font-sans mt-2.5 leading-relaxed">
              Comparing two screenshots with different headlines, images, and layouts confounds
              visual judgment. Below, the <strong className="font-semibold text-[#23282A]">Neutral Baseline</strong> and
              all three reference treatments (<strong className="font-semibold text-[#23282A]">Plaidis</strong>,{' '}
              <strong className="font-semibold text-[#23282A]">Linear</strong>, and{' '}
              <strong className="font-semibold text-[#23282A]">Stripe</strong>) render the exact same{' '}
              <strong className="font-semibold text-[#23282A]">85 HTML elements</strong>, identical text
              strings, and a shared <code className="font-mono text-xs bg-[#23282A]/10 px-1.5 py-0.5">40px</code> desktop /{' '}
              <code className="font-mono text-xs bg-[#23282A]/10 px-1.5 py-0.5">20px</code> mobile horizontal plumb inset—so
              dragging the split handle isolates the exact consequence of each token system.
            </p>
          </div>

          <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#23282A]/15 p-4 font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[#23282A]/65">
              <span>DOM PARITY CONTRACT:</span>
              <span className="text-[#17504A] font-bold">85 / 85 NODES</span>
            </div>
            <p className="text-[11px] text-[#23282A]/80 leading-relaxed">
              1 &lt;section&gt; · 1 &lt;header&gt; · 38 &lt;div&gt; · 32 &lt;span&gt; · 4 &lt;h3&gt; · 4 &lt;p&gt; · 4 &lt;button&gt; · 1 &lt;footer&gt;
            </p>
          </div>
        </div>

        {/* 1. Reference Study Selector Bar (Study 01 / Study 02 / Study 03) */}
        <div
          role="group"
          aria-label="Select reference design system study"
          className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5"
        >
          {DESIGN_INTELLIGENCE_STUDIES.map((study) => {
            const isActive = activeStudyId === study.id;
            return (
              <button
                key={study.id}
                type="button"
                data-study-btn={study.id}
                onClick={() => selectStudy(study.id)}
                aria-pressed={isActive}
                className={`text-left p-3.5 sm:p-4 border transition-all flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-[#23282A] text-[#EDE9E0] border-[#23282A] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#23282A] border-[#23282A]/15 hover:border-[#23282A]/45'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.16em] font-bold ${
                        isActive ? 'text-[#D9A62E]' : 'text-[#9A6F0B]'
                      }`}
                    >
                      {study.selectorSub}
                    </span>
                  </div>
                  <div className="font-display text-base sm:text-lg font-black uppercase tracking-tight mt-0.5 truncate">
                    {study.selectorLabel}
                  </div>
                  <div
                    className={`font-mono text-[11px] truncate mt-0.5 ${
                      isActive ? 'text-[#EDE9E0]/70' : 'text-[#23282A]/60'
                    }`}
                  >
                    Source: {study.sourceDomain}
                  </div>
                </div>
                <span
                  className="w-3 h-8 shrink-0 border border-current/20"
                  style={{ backgroundColor: study.accentHex }}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        {/* 2. Unified Stage Control Bar */}
        <div className="bg-[#FAF8F5] border border-[#23282A]/20 p-3.5 sm:p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Study 01 Surface Switcher OR Active Study Provenance */}
          <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
            {activeStudyId === 'plaidis' ? (
              <div
                role="group"
                aria-label="Study 01 comparison surface"
                className="flex flex-wrap border border-[#23282A]/20 bg-[#EDE9E0] p-0.5 max-w-full"
              >
                <button
                  type="button"
                  data-surface-btn="specimen"
                  onClick={() => setStudy01Surface('specimen')}
                  aria-pressed={study01Surface === 'specimen'}
                  className={`px-2.5 sm:px-3 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-colors ${
                    study01Surface === 'specimen'
                      ? 'bg-[#23282A] text-[#EDE9E0]'
                      : 'text-[#23282A]/75 hover:text-[#23282A]'
                  }`}
                >
                  Shared Neutral Specimen (85 Nodes)
                </button>
                <button
                  type="button"
                  data-surface-btn="contextmuse-home"
                  onClick={() => setStudy01Surface('contextmuse-home')}
                  aria-pressed={study01Surface === 'contextmuse-home'}
                  className={`px-2.5 sm:px-3 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-colors ${
                    study01Surface === 'contextmuse-home'
                      ? 'bg-[#23282A] text-[#D9A62E]'
                      : 'text-[#23282A]/75 hover:text-[#23282A]'
                  }`}
                >
                  ContextMuse Entrance (52e179d → 195921a)
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-mono text-xs text-[#23282A] min-w-0">
                <Layers className="h-3.5 w-3.5 text-[#9A6F0B] shrink-0" />
                <span className="font-bold uppercase tracking-wider truncate">
                  {activeStudy.name}
                </span>
              </div>
            )}
          </div>

          {/* Right: Viewport Toggle + Mode Toggle + Detail Inspector Trigger */}
          <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
            {/* Viewport Selector */}
            <div
              role="group"
              aria-label="Viewport size"
              className="flex flex-wrap border border-[#23282A]/20 bg-[#EDE9E0] p-0.5 max-w-full"
            >
              <button
                type="button"
                data-mode-btn="desktop"
                onClick={() => setActiveViewport('desktop')}
                aria-pressed={activeViewport === 'desktop'}
                className={`px-2.5 sm:px-3 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-colors ${
                  activeViewport === 'desktop'
                    ? 'bg-[#23282A] text-[#EDE9E0]'
                    : 'text-[#23282A]/75 hover:text-[#23282A]'
                }`}
              >
                Desktop (1440×900)
              </button>
              <button
                type="button"
                data-mode-btn="mobile"
                onClick={() => setActiveViewport('mobile')}
                aria-pressed={activeViewport === 'mobile'}
                className={`px-2.5 sm:px-3 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-colors ${
                  activeViewport === 'mobile'
                    ? 'bg-[#23282A] text-[#EDE9E0]'
                    : 'text-[#23282A]/75 hover:text-[#23282A]'
                }`}
              >
                Mobile (390×844)
              </button>
            </div>

            {/* Comparison Mode Buttons: Original | Split | Transformed */}
            <div
              role="group"
              aria-label="Comparison view mode"
              className="flex flex-wrap border border-[#23282A]/20 bg-[#EDE9E0] p-0.5 max-w-full"
            >
              <button
                type="button"
                data-comparison-view="original"
                onClick={() => selectComparisonMode('original')}
                aria-pressed={comparisonMode === 'original'}
                className={`px-2.5 sm:px-3 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-colors ${
                  comparisonMode === 'original'
                    ? 'bg-[#23282A] text-[#EDE9E0]'
                    : 'text-[#23282A]/75 hover:text-[#23282A]'
                }`}
              >
                Original
              </button>
              <button
                type="button"
                data-comparison-view="split"
                onClick={() => selectComparisonMode('split')}
                aria-pressed={comparisonMode === 'split'}
                className={`px-2.5 sm:px-3 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-colors ${
                  comparisonMode === 'split'
                    ? 'bg-[#D9A62E] text-[#141617]'
                    : 'text-[#23282A]/75 hover:text-[#23282A]'
                }`}
              >
                Split ({effectiveClipPercent}%)
              </button>
              <button
                type="button"
                data-comparison-view="transformed"
                onClick={() => selectComparisonMode('transformed')}
                aria-pressed={comparisonMode === 'transformed'}
                className={`px-2.5 sm:px-3 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-colors ${
                  comparisonMode === 'transformed'
                    ? 'bg-[#23282A] text-[#EDE9E0]'
                    : 'text-[#23282A]/75 hover:text-[#23282A]'
                }`}
              >
                Transformed
              </button>
            </div>

            {/* Detail Inspector Modal Button */}
            <button
              ref={inspectorTriggerRef}
              type="button"
              onClick={() => setInspectorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#23282A] bg-[#FAF8F5] hover:bg-[#23282A] hover:text-[#EDE9E0] font-mono text-[11px] uppercase tracking-wider font-bold transition-colors"
            >
              <Maximize2 className="h-3 w-3" />
              <span>Open Detail Inspector</span>
            </button>
          </div>
        </div>

        {/* 3. Primary Interactive Comparison Viewport */}
        <div className="bg-[#181B1D] border-2 border-[#23282A] p-3 sm:p-5 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#EDE9E0]/15 font-mono text-[11px] text-[#EDE9E0]/80">
            <div className="flex items-center gap-2">
              <Columns className="h-3.5 w-3.5 text-[#D9A62E]" />
              <span>
                {isEntranceComparisonActive
                  ? entranceImages.label
                  : `${activeStudy.shortName} Token Transfer on Shared 85-Node Neutral Specimen (${
                      activeViewport === 'desktop' ? '1440×900 Desktop' : '390×844 Mobile'
                    })`}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider">
              <span className="text-[#EDE9E0]/65">
                LEFT:{' '}
                <strong className="text-[#EDE9E0]">
                  {isEntranceComparisonActive ? 'BASELINE (52e179d)' : 'NEUTRAL BASELINE'}
                </strong>
              </span>
              <span className="text-[#D9A62E]">|</span>
              <span className="text-[#D9A62E]">
                RIGHT:{' '}
                <strong>
                  {isEntranceComparisonActive
                    ? 'REFINED (195921a)'
                    : `${activeStudy.shortName.toUpperCase()} TOKENS`}
                </strong>
              </span>
            </div>
          </div>

          {/* Interactive Split Container */}
          <div
            ref={sliderContainerRef}
            data-slider-stage="true"
            onMouseDown={(e) => {
              if (e.target === sliderHandleRef.current) return;
              setIsDragging(true);
              updateSliderFromClientX(e.clientX);
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              if (e.touches && e.touches[0]) {
                updateSliderFromClientX(e.touches[0].clientX);
              }
            }}
            className={`relative select-none overflow-hidden mx-auto border border-[#EDE9E0]/20 cursor-ew-resize ${
              activeViewport === 'mobile' ? 'max-w-[390px]' : 'w-full'
            }`}
          >
            {isEntranceComparisonActive ? (
              /* Preserved ContextMuse Entrance Before/After Image Comparison */
              <div
                className="relative w-full bg-[#141617]"
                style={{
                  aspectRatio: activeViewport === 'desktop' ? '1440 / 900' : '390 / 844',
                }}
              >
                <img
                  src={entranceImages.after}
                  alt="Refined ContextMuse entrance after Study 01 token transfer (195921a)"
                  className="block w-full h-full object-cover object-top"
                  draggable={false}
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    clipPath: `inset(0 ${100 - effectiveClipPercent}% 0 0)`,
                  }}
                >
                  <img
                    src={entranceImages.before}
                    alt="Baseline ContextMuse entrance before token transfer (52e179d)"
                    className="block w-full h-full object-cover object-top"
                    draggable={false}
                  />
                </div>
              </div>
            ) : (
              /* Live 85-Node Shared Specimen Comparison (Both desktop & mobile kept mounted for instant switching & DOM parity verification) */
              <div className="relative w-full">
                {/* Desktop Specimen Pair */}
                <div className={activeViewport === 'desktop' ? 'block' : 'hidden'}>
                  <DesignSystemSpecimen variant={activeStudy.id} viewport="desktop" />
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{
                      clipPath: `inset(0 ${100 - effectiveClipPercent}% 0 0)`,
                    }}
                  >
                    <DesignSystemSpecimen variant="neutral" viewport="desktop" />
                  </div>
                </div>

                {/* Mobile Specimen Pair */}
                <div className={activeViewport === 'mobile' ? 'block' : 'hidden'}>
                  <DesignSystemSpecimen variant={activeStudy.id} viewport="mobile" />
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{
                      clipPath: `inset(0 ${100 - effectiveClipPercent}% 0 0)`,
                    }}
                  >
                    <DesignSystemSpecimen variant="neutral" viewport="mobile" />
                  </div>
                </div>
              </div>
            )}

            {/* Vertical Split Divider & Accessible Handle */}
            <div
              style={{ left: `${effectiveClipPercent}%` }}
              className="absolute top-0 bottom-0 w-0.5 bg-[#D9A62E] shadow-[0_0_12px_rgba(217,166,46,0.9)] z-20 pointer-events-none"
            >
              <button
                ref={sliderHandleRef}
                type="button"
                role="slider"
                aria-label="Comparison split percentage"
                aria-orientation="horizontal"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={effectiveClipPercent}
                aria-valuetext={`${effectiveClipPercent}% original baseline, ${
                  100 - effectiveClipPercent
                }% transformed`}
                onKeyDown={handleSliderKeyDown}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                className="pointer-events-auto absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#D9A62E] text-[#141617] border-2 border-[#141617] shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#EDE9E0]"
              >
                <Sliders className="h-4 w-4" />
              </button>
            </div>

            {/* Corner Status Pills */}
            <div className="absolute top-3 left-3 z-10 pointer-events-none bg-[#141617]/85 text-[#EDE9E0] border border-[#EDE9E0]/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider">
              {isEntranceComparisonActive ? 'BEFORE · 52e179d' : 'ORIGINAL · NEUTRAL SPECIMEN'}
            </div>
            <div className="absolute top-3 right-3 z-10 pointer-events-none bg-[#141617]/85 text-[#D9A62E] border border-[#D9A62E]/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider font-bold">
              {isEntranceComparisonActive
                ? 'AFTER · 195921a'
                : `TRANSFORMED · ${activeStudy.shortName.toUpperCase()}`}
            </div>
          </div>

          {/* Caption Bar Below Stage */}
          <div className="mt-3 pt-2.5 border-t border-[#EDE9E0]/15 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[#EDE9E0]/70">
            <span>
              Drag the handle, click anywhere on the stage, or use{' '}
              <kbd className="px-1.5 py-0.5 bg-[#23282A] text-[#EDE9E0] border border-[#EDE9E0]/20">
                ←
              </kbd>{' '}
              /{' '}
              <kbd className="px-1.5 py-0.5 bg-[#23282A] text-[#EDE9E0] border border-[#EDE9E0]/20">
                →
              </kbd>{' '}
              arrow keys ({effectiveClipPercent}% split).
            </span>
            <span>{activeStudy.inspectedAt}</span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 04 — WHAT THE MEASUREMENTS REVEALED
          ===================================================================== */}
      <section
        id="token-extraction-breakdown"
        className="py-12 sm:py-16 px-5 sm:px-10 max-w-[1360px] mx-auto border-b border-[#23282A]/15"
      >
        <div className="border-t-2 border-[#23282A] pt-3 mb-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#23282A] font-bold">
              04 / WHAT THE MEASUREMENTS REVEALED
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] px-2.5 py-0.5 bg-[#23282A] text-[#D9A62E] font-bold">
              ACTIVE DOSSIER: {activeStudy.shortName.toUpperCase()}
            </span>
          </div>
          <a
            href={activeStudy.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#17504A] hover:underline font-bold"
          >
            <span>Reference: {activeStudy.sourceUrl}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Cross-System Architectural Synthesis Matrix */}
        <div className="mb-10 bg-[#FAF8F5] border border-[#23282A]/20 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#23282A]/15">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9A6F0B] font-bold block">
                SYNTHESIS ACROSS ALL SYSTEMS
              </span>
              <h2 className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-[#23282A]">
                Cross-System Architectural Comparison Matrix
              </h2>
            </div>
            <span className="font-mono text-[11px] text-[#23282A]/65">
              Measured at 1440×900 &amp; 390×844 (@ 2x DPR)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b-2 border-[#23282A] font-mono text-[10px] uppercase tracking-wider text-[#23282A]/75 bg-[#EDE9E0]/60">
                  <th className="py-2.5 px-3">Dimension</th>
                  <th className="py-2.5 px-3 bg-[#D9A62E]/15 text-[#23282A]">Context &amp; Muse (195921a)</th>
                  <th className="py-2.5 px-3">Study 01 · Plaidis / Locomotive</th>
                  <th className="py-2.5 px-3">Study 02 · Linear</th>
                  <th className="py-2.5 px-3">Study 03 · Stripe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23282A]/12">
                {CROSS_SYSTEM_COMPARISON.map((row) => (
                  <tr key={row.dimension} className="hover:bg-[#EDE9E0]/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-[11px] text-[#23282A] whitespace-nowrap">
                      {row.dimension}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] bg-[#D9A62E]/10 text-[#23282A] font-medium">
                      {row.contextMuse}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#23282A]/85">
                      {row.plaidis}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#23282A]/85">
                      {row.linear}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#23282A]/85">
                      {row.stripe}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Study Switcher Pills inside Section 04 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#23282A]">
              {activeStudy.name}
            </h3>
            <p className="text-sm text-[#23282A]/80 font-sans mt-1 max-w-3xl leading-relaxed">
              {activeStudy.executiveSummary}
            </p>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-[#23282A]/60 mr-1 uppercase">Inspect Dossier:</span>
            {DESIGN_INTELLIGENCE_STUDIES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => selectStudy(s.id)}
                className={`px-2.5 py-1 uppercase font-bold border transition-colors ${
                  activeStudyId === s.id
                    ? 'bg-[#23282A] text-[#D9A62E] border-[#23282A]'
                    : 'bg-[#FAF8F5] text-[#23282A]/75 border-[#23282A]/20 hover:border-[#23282A]'
                }`}
              >
                {s.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Four-Pillar Measured Effect Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { key: 'hierarchy', label: '01 / HIERARCHY', data: activeStudy.comparisonMetrics.hierarchy },
            { key: 'density', label: '02 / DENSITY & RHYTHM', data: activeStudy.comparisonMetrics.density },
            { key: 'visualEmphasis', label: '03 / VISUAL EMPHASIS', data: activeStudy.comparisonMetrics.visualEmphasis },
            { key: 'readability', label: '04 / READABILITY & CONTRAST', data: activeStudy.comparisonMetrics.readability },
          ].map((pillar) => (
            <div
              key={pillar.key}
              className="bg-[#FAF8F5] border border-[#23282A]/15 p-4 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9A6F0B] font-bold block">
                  {pillar.label}
                </span>
                <h4 className="font-display text-sm font-black uppercase tracking-tight text-[#23282A] mt-1">
                  {pillar.data.scoreLabel}
                </h4>
                <p className="text-xs text-[#23282A]/75 font-sans mt-2 leading-relaxed">
                  {pillar.data.summary}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Evidence Classification Legend + Token Breakdown Table */}
        <div className="bg-[#FAF8F5] border border-[#23282A]/20 p-5 sm:p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#23282A]/15">
            <div>
              <h4 className="font-display text-base sm:text-lg font-black uppercase tracking-tight text-[#23282A]">
                Extracted Token &amp; Rule Classification ({activeStudy.shortName})
              </h4>
              <p className="text-xs text-[#23282A]/70 font-sans mt-0.5">
                Every value is tagged by provenance so measured source facts are never conflated
                with inferred rules or specimen adaptations.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
              <span className={`px-2 py-0.5 border font-bold ${CLASSIFICATION_BADGE_STYLES.A}`}>
                Class A · Declared CSS Token
              </span>
              <span className={`px-2 py-0.5 border font-bold ${CLASSIFICATION_BADGE_STYLES.B}`}>
                Class B · Computed DOM Style
              </span>
              <span className={`px-2 py-0.5 border font-bold ${CLASSIFICATION_BADGE_STYLES.C}`}>
                Class C · Inferred Pattern
              </span>
              <span className={`px-2 py-0.5 border font-bold ${CLASSIFICATION_BADGE_STYLES.D}`}>
                Class D · Deliberate Adaptation
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b-2 border-[#23282A] font-mono text-[10px] uppercase tracking-wider text-[#23282A]/70">
                  <th className="py-2.5 pr-3">Category</th>
                  <th className="py-2.5 px-3">Selector / CSS Variable</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Desktop (1440×900)</th>
                  <th className="py-2.5 px-3">Mobile (390×844)</th>
                  <th className="py-2.5 pl-3">Provenance &amp; Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23282A]/10">
                {activeStudy.tokenBreakdown.map((row, idx) => (
                  <tr key={idx} className="align-top hover:bg-[#EDE9E0]/50">
                    <td className="py-3 pr-3 font-bold text-[#23282A] whitespace-nowrap">
                      {row.category}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#17504A] font-medium">
                      {row.tokenName}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block font-mono text-[10px] px-2 py-0.5 border font-bold ${
                          CLASSIFICATION_BADGE_STYLES[row.classification] ||
                          CLASSIFICATION_BADGE_STYLES.B
                        }`}
                      >
                        {row.classificationLabel}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#23282A]/90">
                      {row.desktopValue}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#23282A]/85">
                      {row.mobileValue}
                    </td>
                    <td className="py-3 pl-3 text-xs text-[#23282A]/75 leading-relaxed">
                      {row.evidence}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Deliberate Specimen Transfer Adaptations (Class D Callout) */}
          {activeStudy.transferAdaptations && activeStudy.transferAdaptations.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#23282A]/15 bg-[#EDE9E0]/65 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] font-bold text-[#3B27BA]">
                  CLASS D · DELIBERATE SPECIMEN TRANSFER ADAPTATIONS ({activeStudy.shortName})
                </span>
                <span className="font-mono text-[10px] text-[#23282A]/65">
                  Explains every difference between raw reference values and the 85-node specimen
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#23282A]/85 font-sans list-disc list-inside leading-relaxed">
                {activeStudy.transferAdaptations.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 3. Live Rendered Color Swatches & WCAG 2.1 Contrast Verification */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="font-display text-base sm:text-lg font-black uppercase tracking-tight text-[#23282A]">
                Rendered Color Swatches &amp; Deterministic WCAG 2.1 Contrast ({activeStudy.shortName})
              </h4>
              <p className="text-xs text-[#23282A]/70 font-sans">
                Each swatch renders the actual extracted foreground/background hex pair with its
                computed relative-luminance contrast ratio.
              </p>
            </div>
            <span className="font-mono text-[11px] text-[#17504A] font-bold">
              6 / 6 SWATCHES VERIFIED IN {activeStudy.shortName.toUpperCase()} (18 / 18 TOTAL)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {activeStudy.colorSwatches.map((swatch, idx) => (
              <div
                key={idx}
                data-contrast-swatch={swatch.name}
                className="bg-[#FAF8F5] border border-[#23282A]/15 p-3.5 flex flex-col justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: swatch.bgHex,
                      color: swatch.fgHex,
                    }}
                    className="w-14 h-14 shrink-0 border border-[#23282A]/25 flex flex-col items-center justify-center font-mono text-xs font-bold shadow-inner"
                  >
                    <span>Aa</span>
                    <span className="text-[9px] opacity-85">{swatch.contrastRatio}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-display text-xs font-black uppercase text-[#23282A] truncate">
                        {swatch.name}
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#23282A] text-[#D9A62E] font-bold">
                        {swatch.wcagLevel}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-[#17504A] truncate mt-0.5">
                      {swatch.token}
                    </div>
                    <div className="font-mono text-[10px] text-[#23282A]/75 mt-0.5">
                      BG <strong className="text-[#23282A]">{swatch.bgHex}</strong> · FG{' '}
                      <strong className="text-[#23282A]">{swatch.fgHex}</strong>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-[#23282A]/75 font-sans border-t border-[#23282A]/10 pt-2 leading-snug">
                  {swatch.usage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Progressive Disclosure: 5 Analytical Evaluation Questions & Reference Dossier Provenance */}
        <div className="bg-[#FAF8F5] border border-[#23282A]/20">
          <button
            type="button"
            onClick={() => setQuestionsOpen(!questionsOpen)}
            aria-expanded={questionsOpen}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-[#EDE9E0]/50 transition-colors"
          >
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9A6F0B] font-bold block">
                DEEP TECHNICAL DOSSIER · {activeStudy.referenceDossierPath}
              </span>
              <h4 className="font-display text-base sm:text-lg font-black uppercase tracking-tight text-[#23282A] mt-0.5">
                Five Analytical Evaluation Questions ({activeStudy.shortName})
              </h4>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#23282A] shrink-0">
              <span>{questionsOpen ? 'Hide Technical Q&A' : 'Expand 5-Question Analysis'}</span>
              {questionsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </button>

          {questionsOpen && (
            <div className="p-5 sm:p-6 border-t border-[#23282A]/15 space-y-4 bg-[#FAF8F5]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeStudy.analyticalQuestions.map((item, idx) => (
                  <div
                    key={idx}
                    className={`border border-[#23282A]/15 p-4 bg-[#EDE9E0]/35 ${
                      idx === activeStudy.analyticalQuestions.length - 1 ? 'md:col-span-2' : ''
                    }`}
                  >
                    <h5 className="font-mono text-xs font-bold text-[#23282A] uppercase tracking-wider">
                      {item.q}
                    </h5>
                    <p className="text-xs sm:text-sm text-[#23282A]/80 font-sans mt-2 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-[#23282A]/10 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[#23282A]/65">
                <span>Reference Dossier: {activeStudy.referenceDossierPath}</span>
                <span>Experiment Report: {activeStudy.experimentReportPath}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          SECTION 05 — APPLYING THE RESEARCH (CONTEXT & MUSE PRODUCTION INTERVENTION)
          ===================================================================== */}
      <section
        id="what-changed"
        className="py-12 sm:py-16 px-5 sm:px-10 max-w-[1360px] mx-auto border-b border-[#23282A]/15"
      >
        <div className="border-t-2 border-[#23282A] pt-3 mb-8 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#23282A] font-bold">
            05 / APPLYING THE RESEARCH
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#17504A] font-bold">
            PRODUCTION INTERVENTION · COMMIT 52e179d → 195921a
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          <div className="lg:col-span-7 space-y-3">
            <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#23282A] leading-[1.08]">
              Transferring structural discipline into Context &amp; Muse without erasing brand identity.
            </h2>
            <p className="text-sm sm:text-base text-[#23282A]/80 font-sans leading-relaxed">
              The goal of studying external systems is not to make Context &amp; Muse look like
              Locomotive, Linear, or Stripe. Instead, we transferred <strong className="font-semibold text-[#23282A]">three structural mechanisms</strong>—a
              single <code className="font-mono text-xs bg-[#23282A]/10 px-1.5 py-0.5">40px</code> desktop plumb line,{' '}
              <code className="font-mono text-xs bg-[#23282A]/10 px-1.5 py-0.5">2px solid</code> section overlines, and{' '}
              <code className="font-mono text-xs bg-[#23282A]/10 px-1.5 py-0.5">450ms / 200ms</code> Ease-Out Quint
              choreography—into the four-room homepage while keeping Context &amp; Muse’s
              architectural palette and typography completely intact.
            </p>
          </div>

          {/* Preserved Context & Muse Brand Palette & Typography Strip */}
          <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#23282A]/20 p-5">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#23282A]/15">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9A6F0B] font-bold">
                PRESERVED DESTINATION IDENTITY
              </span>
              <span className="font-mono text-[10px] text-[#23282A]/65">
                Chivo + JetBrains Mono
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {PRESERVED_BRAND_SWATCHES.map((s) => (
                <div
                  key={s.hex}
                  style={{ backgroundColor: s.hex, color: s.textHex }}
                  className="p-3 border border-[#23282A]/20 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                    <span>{s.hex}</span>
                    <span className="text-[9px] opacity-80">{s.contrast}</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-display text-xs font-black uppercase block">
                      {s.name}
                    </span>
                    <span className="font-mono text-[9px] opacity-80 block mt-0.5">
                      {s.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Three Production Refinements Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {THREE_FINDINGS.map((item) => (
            <article
              key={item.num}
              className="bg-[#FAF8F5] border border-[#23282A]/20 p-6 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#23282A]/12">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#9A6F0B]">
                    {item.num} / {item.category}
                  </span>
                  <span className="font-mono text-[10px] bg-[#23282A] text-[#D9A62E] px-2 py-0.5 font-bold">
                    {item.metricLabel}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="font-display text-3xl sm:text-4xl font-black text-[#23282A] tracking-tight block">
                    {item.metric}
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm font-sans leading-relaxed">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#23282A]/55 font-bold block">
                      What Was Measured (52e179d):
                    </span>
                    <p className="text-[#23282A]/80 mt-0.5">{item.whatWasMeasured}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#23282A]/55 font-bold block">
                      What Changed:
                    </span>
                    <p className="text-[#23282A]/80 mt-0.5">{item.whatChanged}</p>
                  </div>
                  <div className="pt-2 border-t border-[#23282A]/10">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#17504A] font-bold block">
                      Verified Result (195921a):
                    </span>
                    <p className="text-[#23282A] font-medium mt-0.5">{item.whatImproved}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#23282A]/10 font-mono text-[10px] text-[#23282A]/60">
                {item.classification}
              </div>
            </article>
          ))}
        </div>

        {/* Verified Production Before / After Visual Evidence Plates */}
        <div className="bg-[#181B1D] text-[#EDE9E0] border-2 border-[#23282A] p-5 sm:p-6 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#EDE9E0]/15">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#D9A62E] font-bold block">
                VERIFIED PRODUCTION SCREENSHOT EVIDENCE (1440×900 &amp; 390×844)
              </span>
              <h3 className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-[#EDE9E0] mt-0.5">
                Context &amp; Muse Four-Room Homepage: Baseline (52e179d) vs. Refined (195921a)
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#interactive-comparison"
                onClick={() => {
                  selectStudy('plaidis');
                  setStudy01Surface('contextmuse-home');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D9A62E] text-[#141617] font-mono text-[11px] uppercase tracking-wider font-bold hover:bg-[#EDE9E0] transition-colors"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Compare in Interactive Split Stage</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <figure className="lg:col-span-5 bg-[#141617] border border-[#EDE9E0]/15 p-3">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#EDE9E0]/70 pb-2 mb-2 border-b border-[#EDE9E0]/10">
                <span>BEFORE · COMMIT 52e179d (1440×900)</span>
                <span className="text-amber-400">24px Plumb Drift</span>
              </div>
              <img
                src="/assets/images/design-intelligence/exp01_before_desktop.png"
                alt="Context and Muse homepage baseline commit 52e179d showing 24px left-edge drift"
                className="w-full h-auto border border-[#EDE9E0]/10"
              />
              <figcaption className="font-mono text-[10px] text-[#EDE9E0]/65 mt-2 leading-relaxed">
                Logo at x = 40px while Hero H1 and CTA sit at x = 64px; 1px room rules; 300ms brightness(1.05) hover.
              </figcaption>
            </figure>

            <figure className="lg:col-span-5 bg-[#141617] border border-[#D9A62E]/40 p-3">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#EDE9E0]/70 pb-2 mb-2 border-b border-[#EDE9E0]/10">
                <span className="text-[#D9A62E] font-bold">AFTER · COMMIT 195921a (1440×900)</span>
                <span className="text-[#D9A62E] font-bold">0px Desktop Drift</span>
              </div>
              <img
                src="/assets/images/design-intelligence/exp01_after_desktop.png"
                alt="Context and Muse homepage refined commit 195921a with 0px desktop alignment drift"
                className="w-full h-auto border border-[#EDE9E0]/10"
              />
              <figcaption className="font-mono text-[10px] text-[#EDE9E0]/65 mt-2 leading-relaxed">
                Unified x = 40px desktop plumb line across header, hero, CTA, and footer; 2px overlines; #D9A62E discipline.
              </figcaption>
            </figure>

            <figure className="lg:col-span-2 bg-[#141617] border border-[#EDE9E0]/15 p-3">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#EDE9E0]/70 pb-2 mb-2 border-b border-[#EDE9E0]/10">
                <span>MOBILE · 390×844</span>
              </div>
              <img
                src="/assets/images/design-intelligence/exp01_after_mobile.png"
                alt="Context and Muse mobile viewport 390x844 after refinement"
                className="w-full h-auto border border-[#EDE9E0]/10 max-h-[260px] object-cover object-top mx-auto"
              />
              <figcaption className="font-mono text-[10px] text-[#EDE9E0]/65 mt-2 leading-relaxed">
                x = 20px header &amp; hero outer margin; room tiles retain 24px (p-6) touch inset.
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Interactive Hover Timing Reproduction Sandbox */}
        <div className="bg-[#FAF8F5] border border-[#23282A]/20 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#23282A]/15">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9A6F0B] font-bold block">
                INTERACTIVE CHOREOGRAPHY SPECIMEN
              </span>
              <h3 className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-[#23282A]">
                Hover Timing Sandbox: 300ms Brightness Filter vs. 450ms / 200ms Ease-Out Quint
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
              <button
                type="button"
                onClick={() => setHoverReproductionMode('before')}
                className={`px-3 py-1.5 uppercase font-bold border transition-colors ${
                  hoverReproductionMode === 'before'
                    ? 'bg-[#23282A] text-[#EDE9E0] border-[#23282A]'
                    : 'bg-[#EDE9E0] text-[#23282A]/75 border-[#23282A]/20'
                }`}
              >
                Reproduction A · Baseline (300ms + Brightness)
              </button>
              <button
                type="button"
                onClick={() => setHoverReproductionMode('after')}
                className={`px-3 py-1.5 uppercase font-bold border transition-colors ${
                  hoverReproductionMode === 'after'
                    ? 'bg-[#D9A62E] text-[#141617] border-[#23282A]'
                    : 'bg-[#EDE9E0] text-[#23282A]/75 border-[#23282A]/20'
                }`}
              >
                Reproduction B · Refined (450ms Enter / 200ms Leave)
              </button>
              <button
                type="button"
                onClick={() => setHoverReproductionMode('captured')}
                className={`px-3 py-1.5 uppercase font-bold border transition-colors ${
                  hoverReproductionMode === 'captured'
                    ? 'bg-[#23282A] text-[#D9A62E] border-[#23282A]'
                    : 'bg-[#EDE9E0] text-[#23282A]/75 border-[#23282A]/20'
                }`}
              >
                Recorded Capture (195921a)
              </button>
            </div>
          </div>

          {hoverReproductionMode === 'captured' ? (
            <div className="bg-[#141617] p-4 border border-[#23282A]">
              <img
                src="/assets/images/design-intelligence/exp01_after_desktop_hover_build.png"
                alt="Recorded Playwright hover state on 02 / BUILD room tile (commit 195921a)"
                className="w-full max-h-[380px] object-contain mx-auto"
              />
              <p className="font-mono text-[11px] text-[#EDE9E0]/75 text-center mt-3">
                Playwright capture of 02 / BUILD room tile hovered in commit 195921a: 2px top
                overline, #D9A62E badge, and zero pigment washout.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7">
                <div
                  onMouseEnter={() => setHoveringRoom(true)}
                  onMouseLeave={() => setHoveringRoom(false)}
                  style={{
                    transitionProperty: 'transform, border-color, box-shadow, filter',
                    transitionDuration:
                      hoverReproductionMode === 'before'
                        ? '300ms'
                        : hoveringRoom
                        ? '450ms'
                        : '200ms',
                    transitionTimingFunction:
                      hoverReproductionMode === 'before'
                        ? 'cubic-bezier(0.4, 0, 0.2, 1)'
                        : 'cubic-bezier(0.23, 1, 0.32, 1)',
                    filter:
                      hoverReproductionMode === 'before' && hoveringRoom
                        ? 'brightness(1.06)'
                        : 'none',
                  }}
                  className="cursor-pointer bg-[#23282A] text-[#EDE9E0] p-6 border-t-2 border-[#D9A62E] border-x border-b border-[#23282A] select-none"
                >
                  <div className="flex items-center justify-between font-mono text-xs text-[#D9A62E]">
                    <span>01 / WORK · INTERACTIVE ROOM TILE SPECIMEN</span>
                    <span>{hoveringRoom ? 'POINTER ENTER (ACTIVE)' : 'HOVER THIS TILE →'}</span>
                  </div>
                  <h4 className="font-display text-2xl font-black uppercase tracking-tight mt-3">
                    Production Systems &amp; Flagship Proofs
                  </h4>
                  <p className="text-xs text-[#EDE9E0]/75 font-sans mt-2 leading-relaxed">
                    Move your cursor into and out of this surface to feel the difference between
                    symmetric 300ms easing and asymmetric 450ms enter / 200ms leave deceleration.
                  </p>
                  <div className="mt-5 pt-3 border-t border-[#EDE9E0]/15 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-[#EDE9E0]/70">
                      {hoverReproductionMode === 'before'
                        ? '300ms symmetric · filter: brightness(1.06)'
                        : '450ms enter / 200ms leave · cubic-bezier(0.23, 1, 0.32, 1)'}
                    </span>
                    <span
                      style={{
                        transform: hoveringRoom ? 'translateX(6px)' : 'translateX(0px)',
                        transitionDuration:
                          hoverReproductionMode === 'before'
                            ? '300ms'
                            : hoveringRoom
                            ? '450ms'
                            : '200ms',
                        transitionTimingFunction:
                          hoverReproductionMode === 'before'
                            ? 'ease'
                            : 'cubic-bezier(0.23, 1, 0.32, 1)',
                      }}
                      className="inline-flex items-center gap-1 text-[#D9A62E] font-bold"
                    >
                      <span>ENTER ROOM</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 space-y-2.5 font-mono text-xs">
                <div className="p-3 bg-[#EDE9E0] border border-[#23282A]/15">
                  <span className="text-[10px] uppercase tracking-wider text-[#23282A]/60 block">
                    ACTIVE TIMING SPECIFICATION:
                  </span>
                  <span className="font-bold text-[#23282A] block mt-0.5">
                    {hoverReproductionMode === 'before'
                      ? 'Enter: 300ms | Leave: 300ms | Curve: ease-in-out'
                      : 'Enter: 450ms | Leave: 200ms | Curve: cubic-bezier(0.23, 1, 0.32, 1)'}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#23282A]/75 leading-relaxed">
                  Because pointer exit (`200ms`) is more than twice as fast as pointer entry
                  (`450ms`), moving across adjacent room tiles never leaves a trailing highlight on
                  the previous quadrant.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          SECTION 06 — VERIFICATION (TECHNICAL NON-REGRESSION vs. BUSINESS OUTCOMES)
          ===================================================================== */}
      <section
        id="verification"
        className="py-12 sm:py-16 px-5 sm:px-10 max-w-[1360px] mx-auto border-b border-[#23282A]/15"
      >
        <div className="border-t-2 border-[#23282A] pt-3 mb-8 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#23282A] font-bold">
            06 / VERIFICATION
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#17504A] font-bold">
            DETERMINISTIC DOM, LUMINANCE &amp; SMOKE-TEST LEDGER
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#23282A] leading-[1.08]">
              Technical verification proves structural integrity—not unproven business outcomes.
            </h2>
            <p className="text-sm sm:text-base text-[#23282A]/80 font-sans mt-3 leading-relaxed">
              Every quantitative figure on this page is backed by an automated Playwright and Node
              verification script (<code className="font-mono text-xs bg-[#23282A]/10 px-1.5 py-0.5">scripts/verify_design_intelligence_case_study.mjs</code>).
              Just as importantly, we state the exact boundary of each check so technical
              non-regression is never misrepresented as a conversion or behavioral claim.
            </p>
          </div>

          {/* Epistemic Scope Callout */}
          <div className="lg:col-span-5 bg-[#23282A] text-[#EDE9E0] p-5 border border-[#23282A]">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[#D9A62E] font-bold">
              <Scale className="h-4 w-4" />
              <span>EPISTEMOLOGICAL BOUNDARY</span>
            </div>
            <p className="text-xs text-[#EDE9E0]/85 font-sans mt-2 leading-relaxed">
              Passing `11/11` smoke tests, `0px` desktop plumb-line drift, `85/85` DOM parity, and
              `18/18` WCAG contrast checks proves that the token extractions and production
              refinements render accurately without layout or runtime regressions. It does{' '}
              <strong className="text-[#EDE9E0] underline">not</strong> prove subjective aesthetic
              superiority, user comprehension, or conversion lift—which require controlled user
              testing.
            </p>
          </div>
        </div>

        {/* Four Verification Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {VERIFICATION_PILLARS.map((v) => (
            <div
              key={v.unit}
              className="bg-[#FAF8F5] border border-[#23282A]/20 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-[#23282A]/12">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#17504A] font-bold">
                    {v.status}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-[#17504A] shrink-0" />
                </div>
                <span className="font-display text-3xl font-black text-[#23282A] tracking-tight block">
                  {v.metric}
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#9A6F0B] mt-0.5 block">
                  {v.unit}
                </span>
                <p className="text-xs text-[#23282A]/75 font-sans mt-2.5 leading-relaxed">
                  {v.detail}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#23282A]/10 font-mono text-[10px] text-[#23282A]/55">
                {v.scope}
              </div>
            </div>
          ))}
        </div>

        {/* Expandable 11/11 Smoke-Test Ledger */}
        <div className="bg-[#FAF8F5] border border-[#23282A]/20">
          <button
            type="button"
            onClick={() => setEvidenceOpen(!evidenceOpen)}
            aria-expanded={evidenceOpen}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-[#EDE9E0]/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Terminal className="h-4 w-4 text-[#17504A] shrink-0" />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#17504A] font-bold block">
                  AUTOMATED PLAYWRIGHT VERIFICATION LOG
                </span>
                <h3 className="font-display text-base sm:text-lg font-black uppercase tracking-tight text-[#23282A]">
                  11 / 11 Functional &amp; Structural Non-Regression Gates
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#23282A] shrink-0">
              <span>{evidenceOpen ? 'Collapse Gate Log' : 'Inspect All 11 Gates'}</span>
              {evidenceOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </button>

          {evidenceOpen && (
            <div className="p-5 sm:p-6 border-t border-[#23282A]/15 bg-[#181B1D] text-[#EDE9E0]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 font-mono text-xs">
                {SMOKE_CHECKS.map((gate) => (
                  <div
                    key={gate.id}
                    className="flex items-center justify-between gap-3 p-2.5 bg-[#23282A] border border-[#EDE9E0]/10"
                  >
                    <span className="text-[#EDE9E0]/85 text-[11px]">
                      <strong className="text-[#D9A62E] mr-2">[{gate.id}]</strong>
                      {gate.check}
                    </span>
                    <span className="px-2 py-0.5 bg-[#17504A] text-[#EDE9E0] text-[10px] font-bold shrink-0">
                      {gate.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          SECTION 07 — IMPLICATIONS & CONTEXTUAL ROUTE TO WEBSITE AUDIT SYSTEM
          ===================================================================== */}
      <section
        id="implications"
        className="py-12 sm:py-16 px-5 sm:px-10 max-w-[1360px] mx-auto"
      >
        <div className="border-t-2 border-[#23282A] pt-3 mb-8 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#23282A] font-bold">
            07 / IMPLICATIONS
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#23282A]/65">
            WHAT THIS METHODOLOGY DEMONSTRATES &amp; WHERE IT CONNECTS
          </span>
        </div>

        <div className="max-w-3xl mb-8">
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#23282A] leading-[1.08]">
            Four principles for design engineering and front-end systems architecture.
          </h2>
        </div>

        {/* Four Design Engineering Implications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            {
              num: '01',
              title: 'Visual Judgment Backed by Evidence',
              body: 'Aesthetic intuition and empirical measurement reinforce each other. Inspecting CSSOM declarations and bounding-box geometry turns vague impressions ("this feels cleaner") into testable specifications.',
            },
            {
              num: '02',
              title: 'Systems of Relationships, Not Loose Tokens',
              body: 'A hex code or font weight means little in isolation. Linear’s 510 weight exists because of #08090A dark-mode halation; Stripe’s 300 weight works because of 48px scale and #061B31 navy contrast.',
            },
            {
              num: '03',
              title: 'Controlled Comparison Isolates Consequences',
              body: 'Holding an 85-node DOM tree, copy, and outer plumb line constant proves exactly how typography, surface polarity, and border mechanics alter perceived density and hierarchy.',
            },
            {
              num: '04',
              title: 'Transfer Preserves Destination Identity',
              body: 'Successful adaptation transfers structural mechanics—plumb-line alignment, overline rules, and asymmetric motion curves—without overwriting the destination brand’s palette or voice.',
            },
          ].map((imp) => (
            <div
              key={imp.num}
              className="bg-[#FAF8F5] border border-[#23282A]/15 p-5 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-bold text-[#9A6F0B] block">
                  IMPLICATION {imp.num}
                </span>
                <h3 className="font-display text-base font-black uppercase tracking-tight text-[#23282A] mt-1.5">
                  {imp.title}
                </h3>
                <p className="text-xs text-[#23282A]/80 font-sans mt-2 leading-relaxed">
                  {imp.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Related Diagnostic Work & Project Inquiry Bridge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Contextual Route to Website Audit System */}
          <div className="lg:col-span-7 bg-[#FAF8F5] border-2 border-[#23282A] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#23282A]/15">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#17504A] font-bold">
                  COMPANION DIAGNOSTIC SYSTEM · 01 / WORK &amp; 03 / LAB
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#23282A]/10 text-[#23282A] font-bold">
                  DISTINCT METHODOLOGICAL SCOPE
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#23282A]">
                Website Audit System: Live Multi-Viewport Conversion &amp; Structural Diagnostics
              </h3>

              <p className="text-xs sm:text-sm text-[#23282A]/80 font-sans mt-2.5 leading-relaxed">
                Where <strong className="font-semibold text-[#23282A]">Design Intelligence</strong>{' '}
                extracts design-system tokens from external references and evaluates them on a
                controlled 85-node specimen, the{' '}
                <strong className="font-semibold text-[#23282A]">Website Audit System</strong>{' '}
                applies automated Playwright DOM inspection to diagnose live client websites across
                four operational pillars: <strong className="font-mono text-xs">01 / Message</strong>,{' '}
                <strong className="font-mono text-xs">02 / Paths</strong>,{' '}
                <strong className="font-mono text-xs">03 / Proof</strong>, and{' '}
                <strong className="font-mono text-xs">04 / Intake</strong>.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#23282A]/15 flex flex-wrap items-center gap-3">
              <a
                href="/website-system-check/"
                className="inline-flex items-center gap-2 bg-[#23282A] text-[#EDE9E0] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#D9A62E] hover:text-[#141617] transition-colors"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Launch Live Website Audit</span>
              </a>
              <Link
                to="/work?case=website-audit-system"
                className="inline-flex items-center gap-2 bg-transparent text-[#23282A] border border-[#23282A]/35 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:border-[#23282A] transition-colors"
              >
                <span>Read Audit System Case Study</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/work"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[#17504A] hover:underline font-bold ml-auto"
              >
                <span>View All 01 / WORK Proofs →</span>
              </Link>
            </div>
          </div>

          {/* Invitation to Discuss a Project */}
          <div className="lg:col-span-5 bg-[#23282A] text-[#EDE9E0] border-2 border-[#23282A] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#D9A62E] font-bold block">
                DESIGN ENGINEERING &amp; FRONT-END ARCHITECTURE
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#EDE9E0] mt-2">
                Need measurable design-system rigor on your product or web architecture?
              </h3>
              <p className="text-xs sm:text-sm text-[#EDE9E0]/80 font-sans mt-2.5 leading-relaxed">
                Whether you are consolidating a multi-surface design system, refining an existing
                production interface, or building a custom front-end application, we scope every
                engagement around verifiable engineering deliverables.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#EDE9E0]/15 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleInquireAboutDesignSystem}
                className="inline-flex items-center gap-2 bg-[#D9A62E] text-[#141617] px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] hover:bg-[#EDE9E0] transition-colors"
              >
                <span>Discuss a Project</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <Link
                to="/lab"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#EDE9E0]/75 hover:text-[#D9A62E] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to 03 / LAB</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ACCESSIBLE DETAIL INSPECTOR MODAL (FOCUS-TRAPPED, ESCAPE-DISMISSIBLE)
          ===================================================================== */}
      {inspectorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-inspector-title"
          ref={inspectorDialogRef}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeInspector();
          }}
          className="fixed inset-0 z-50 bg-[#141617]/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div className="bg-[#181B1D] text-[#EDE9E0] border-2 border-[#D9A62E] w-full max-w-[1320px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:px-6 border-b border-[#EDE9E0]/15 flex flex-wrap items-center justify-between gap-3 bg-[#23282A]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#D9A62E] font-bold block">
                  FULL-RESOLUTION SPECIMEN &amp; REFERENCE INSPECTOR
                </span>
                <h2
                  id="detail-inspector-title"
                  className="font-display text-base sm:text-lg font-black uppercase tracking-tight text-[#EDE9E0]"
                >
                  {activeStudy.name} ({activeViewport === 'desktop' ? '1440×900' : '390×844'})
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {DESIGN_INTELLIGENCE_STUDIES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectStudy(s.id)}
                    className={`px-2.5 py-1 font-mono text-[10px] uppercase font-bold border ${
                      activeStudyId === s.id
                        ? 'bg-[#D9A62E] text-[#141617] border-[#D9A62E]'
                        : 'bg-[#181B1D] text-[#EDE9E0]/80 border-[#EDE9E0]/20 hover:border-[#EDE9E0]'
                    }`}
                  >
                    {s.shortName}
                  </button>
                ))}
                <button
                  ref={inspectorCloseBtnRef}
                  type="button"
                  onClick={closeInspector}
                  aria-label="Close Detail Inspector"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDE9E0] text-[#141617] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#D9A62E] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Close (Esc)</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="font-mono text-xs uppercase tracking-wider text-[#EDE9E0]/75 flex items-center justify-between">
                    <span>01 / SHARED NEUTRAL BASELINE (85 DOM NODES)</span>
                    <span className="text-[#EDE9E0]/50">x = 40px / 20px Plumb Inset</span>
                  </div>
                  <div className="border border-[#EDE9E0]/20 overflow-hidden bg-[#141617]">
                    <DesignSystemSpecimen variant="neutral" viewport={activeViewport} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-mono text-xs uppercase tracking-wider text-[#D9A62E] flex items-center justify-between font-bold">
                    <span>02 / TRANSFORMED SPECIMEN ({activeStudy.shortName.toUpperCase()})</span>
                    <span>85 / 85 Identical DOM Nodes</span>
                  </div>
                  <div className="border border-[#D9A62E]/50 overflow-hidden bg-[#141617]">
                    <DesignSystemSpecimen variant={activeStudy.id} viewport={activeViewport} />
                  </div>
                </div>
              </div>

              {/* Reference Source Capture */}
              <div className="pt-4 border-t border-[#EDE9E0]/15">
                <div className="font-mono text-xs uppercase tracking-wider text-[#EDE9E0]/75 mb-2 flex items-center justify-between">
                  <span>
                    03 / CAPTURED SOURCE REFERENCE ({activeStudy.sourceUrl} @{' '}
                    {activeViewport === 'desktop' ? '1440×900' : '390×844'})
                  </span>
                  <span>{activeStudy.referenceDossierPath}</span>
                </div>
                <img
                  src={
                    activeViewport === 'desktop'
                      ? activeStudy.referenceCaptures.desktop
                      : activeStudy.referenceCaptures.mobile
                  }
                  alt={`Captured above-the-fold reference of ${activeStudy.shortName}`}
                  className="max-h-[420px] w-auto mx-auto border border-[#EDE9E0]/20"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
      <SiteFooter />
    </div>
  );
}
