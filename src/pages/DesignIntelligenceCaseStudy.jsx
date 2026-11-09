import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import PageAnnotationOverlay from '@/components/site/PageAnnotationOverlay';
import DesignSystemSpecimen from '@/components/lab/DesignSystemSpecimen';
import {
  DESIGN_INTELLIGENCE_STUDIES,
  STUDY_BY_ID,
} from '@/components/lab/designIntelligenceStudies';
import { useBrief } from '@/lib/BriefContext';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Columns,
  Eye,
  FileCode2,
  Layers,
  Maximize2,
  Monitor,
  MoveHorizontal,
  Play,
  Ruler,
  Scale,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';

const MAIN_VIEWPORT_MODES = [
  {
    id: 'desktop',
    label: 'Desktop',
    fullLabel: 'Desktop (1440 × 900)',
    icon: Monitor,
    beforeSrc: '/assets/images/design-intelligence/exp01_before_desktop.png',
    afterSrc: '/assets/images/design-intelligence/exp01_after_desktop.png',
    naturalWidth: 2880,
    naturalHeight: 1800,
    aspectClass: 'aspect-[1440/900]',
    maxWidthClass: 'max-w-[1040px]',
    viewportText: '1440 × 900 CSS px (2880 × 1800 @ 2x DPR)',
    plumbLinePct: (40 / 1440) * 100,
    beforePlumbHeroPct: (48 / 1440) * 100,
  },
  {
    id: 'mobile',
    label: 'Mobile',
    fullLabel: 'Mobile (390 × 844)',
    icon: Smartphone,
    beforeSrc: '/assets/images/design-intelligence/exp01_before_mobile.png',
    afterSrc: '/assets/images/design-intelligence/exp01_after_mobile.png',
    naturalWidth: 780,
    naturalHeight: 1688,
    aspectClass: 'aspect-[390/844]',
    maxWidthClass: 'max-w-[300px]',
    viewportText: '390 × 844 CSS px (780 × 1688 @ 2x DPR)',
    plumbLinePct: (20 / 390) * 100,
    beforePlumbHeroPct: (24 / 390) * 100,
  },
];

const INSPECTOR_MODES = [
  ...MAIN_VIEWPORT_MODES,
  {
    id: 'mobile-full',
    label: 'Mobile Full-Page',
    fullLabel: 'Mobile Full-Page (390 × 1824 / 1901)',
    icon: Columns,
    beforeSrc: '/assets/images/design-intelligence/exp01_before_mobile_full.png',
    afterSrc: '/assets/images/design-intelligence/exp01_after_mobile_full.png',
    naturalWidth: 780,
    naturalHeight: 3802,
    isFullPageScroll: true,
    viewportText: '390px CSS width @ 2x DPR (780×3648 Before / 780×3802 After)',
    plumbLinePct: (20 / 390) * 100,
    beforePlumbHeroPct: (24 / 390) * 100,
  },
];

const ALL_PRELOAD_PAIRS = [
  [
    '/assets/images/design-intelligence/exp01_before_desktop.png',
    '/assets/images/design-intelligence/exp01_after_desktop.png',
  ],
  [
    '/assets/images/design-intelligence/exp01_before_mobile.png',
    '/assets/images/design-intelligence/exp01_after_mobile.png',
  ],
  [
    '/assets/images/design-intelligence/exp01_before_mobile_full.png',
    '/assets/images/design-intelligence/exp01_after_mobile_full.png',
  ],
  [
    '/assets/images/design-intelligence/exp01_after_desktop_hover_build.png',
    '/assets/images/design-intelligence/exp01_after_desktop_hover_build.png',
  ],
  [
    '/assets/images/design-intelligence/linear_ref_desktop_above_fold.png',
    '/assets/images/design-intelligence/stripe_ref_desktop_above_fold.png',
  ],
  [
    '/assets/images/design-intelligence/linear_ref_mobile_above_fold.png',
    '/assets/images/design-intelligence/stripe_ref_mobile_above_fold.png',
  ],
];

const THREE_FINDINGS = [
  {
    num: '01',
    title: 'Structural alignment',
    metric: '24px → 0px left-edge drift',
    body: 'On the baseline entrance, horizontal padding stepped inward and outward between the header (24px), hero headline and CTAs (48px), and footer (24px), while 4px rounded buttons clashed with the sharp 2×2 room grid. Standardizing outer container margins and 0px border-2 CTA geometry locked the logo, headline, primary CTA, and footer onto a single 40px desktop (20px mobile) plumb line with 0px variance.',
  },
  {
    num: '02',
    title: 'Typography and visual consistency',
    metric: 'Fluid scale & on-palette tokens',
    body: 'Fixed-breakpoint room headings, thin 1px dividers, and an off-palette Tailwind red badge (02 Quoting in Room 02) weakened hierarchy across the four quadrants. Introducing fluid clamp(1.65rem, 2.15vw, 2.125rem) display sizing, 2px structural overlines, and ContextMuse #D9A62E mustard tokens unified the grid while reverting experimental line-width rules that caused a 3-line mobile orphan.',
  },
  {
    num: '03',
    title: 'Interaction refinement',
    metric: '450ms enter / 200ms leave',
    body: 'Room tiles previously used a uniform 300ms transition with a brightness(1.05) filter that washed out each room’s pigment on hover. Removing the brightness filter and applying asymmetric Ease-Out Quint timing (450ms entry, 200ms release) preserved exact surface saturation while directing motion into the internal room motifs, directional arrows, and 3px bottom rules.',
  },
];

const FIVE_STAGES = [
  {
    step: '01',
    name: 'Reference',
    summary: 'Select high-craft specimens (Plaidis/Locomotive, Linear, Stripe) to study structural proportions, luminance, and choreography.',
  },
  {
    step: '02',
    name: 'Extraction',
    summary: 'Query declared CSS variables (--hds-*, --color-*) and computed DOM styles into verifiable reference dossiers.',
  },
  {
    step: '03',
    name: 'Evaluation',
    summary: 'Transfer each extracted token system onto an identical neutral specimen to isolate hierarchy, contrast, and density shifts.',
  },
  {
    step: '04',
    name: 'Refinement',
    summary: 'Apply targeted architectural improvements on an isolated branch (195921a) and revert rules that degrade mobile wrapping.',
  },
  {
    step: '05',
    name: 'Verification',
    summary: 'Confirm WCAG 2.1 luminance ratios, 0px plumb-line variance in headless Chromium, and run the 11-check non-regression suite.',
  },
];

const SMOKE_CHECKS = [
  {
    num: '01',
    name: 'Homepage 4-Quadrant Entrance & Clean Header',
    status: 'PASS',
    covered: 'Verified 4 room tiles (work, build, lab, method), no duplicated navbar, and Four Rooms control active.',
  },
  {
    num: '02',
    name: 'Primary CTA Room Entry ("Explore the Work" → /work)',
    status: 'PASS',
    covered: 'Verified clicking primary CTA transitions to /work without duplicated RoomRail and renders flagship portfolio.',
  },
  {
    num: '03',
    name: 'Logo Home Anchor, RoomTile Entry & Four Rooms Switcher',
    status: 'PASS',
    covered: 'Verified switching to /build via popover, returning to / via logo, entering /lab via tile, and returning via popover.',
  },
  {
    num: '04',
    name: 'Trailing-Slash Path Normalization (/work/, /build/, /lab/, /method/)',
    status: 'PASS',
    covered: 'Verified direct deep-link navigation with trailing slashes resolves active room state cleanly.',
  },
  {
    num: '05',
    name: 'Room 02 (/build) Whiteboard & Template Blueprints Intact',
    status: 'PASS',
    covered: 'Verified Custom Builds workspace and progressive-disclosure starter blueprints render without error.',
  },
  {
    num: '06',
    name: 'Room 03 (/lab) Website Audit & Workbench Tools Intact',
    status: 'PASS',
    covered: 'Verified GenSort Studio spotlight, Contrast tool, and TableDocket utilities mount cleanly.',
  },
  {
    num: '07',
    name: 'Room 04 (/method) Commercial Pricing & Founder Identity Intact',
    status: 'PASS',
    covered: 'Verified $395 / From $2,500 / From $6,500 pricing tiers and Jayme Volstad founder attribution.',
  },
  {
    num: '08',
    name: 'GenSort Discoverability (Acquisition Modal + /cxm_gensort/index.html)',
    status: 'PASS',
    covered: 'Verified footer Acquisition modal and standalone /cxm_gensort/index.html application HTTP 200.',
  },
  {
    num: '09',
    name: 'BriefDrawer Categories, Heading & Direct POST to /api/lead/',
    status: 'PASS',
    covered: 'Verified 5 inquiry categories, "What are you looking to create?" heading, and 200 OK POST to /api/lead/.',
  },
  {
    num: '10',
    name: 'Mobile Viewport (390×844) Zero Horizontal Overflow & Zero Broken Assets',
    status: 'PASS',
    covered: 'Verified scrollWidth === 390 and 0 broken images across /, /work, /build, /lab, /method, and /cxm_gensort/.',
  },
  {
    num: '11',
    name: 'Zero Runtime Console or Page Errors Across Entire Suite',
    status: 'PASS',
    covered: 'Verified consoleErrors = 0 and pageErrors = 0 across all desktop and mobile transitions.',
  },
];

// Cache decoded image status across mounts so mode switches are instantaneous
const decodedUrlCache = new Set();

function preloadAndDecodePair(beforeSrc, afterSrc) {
  if (decodedUrlCache.has(beforeSrc) && decodedUrlCache.has(afterSrc)) {
    return Promise.resolve();
  }
  const decodeOne = (src) =>
    new Promise((resolve) => {
      if (!src || decodedUrlCache.has(src)) {
        resolve();
        return;
      }
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      const done = () => {
        decodedUrlCache.add(src);
        resolve();
      };
      if (img.complete && img.naturalWidth > 0) {
        if (typeof img.decode === 'function') {
          img.decode().then(done).catch(done);
        } else {
          done();
        }
      } else {
        img.onload = () => {
          if (typeof img.decode === 'function') {
            img.decode().then(done).catch(done);
          } else {
            done();
          }
        };
        img.onerror = done;
      }
    });

  return Promise.all([decodeOne(beforeSrc), decodeOne(afterSrc)]).then(() => undefined);
}

export default function DesignIntelligenceCaseStudy() {
  const { openBrief, updateInquiry } = useBrief();

  // Active Study State: 'plaidis' | 'linear' | 'stripe'
  const [activeStudyId, setActiveStudyId] = useState('plaidis');

  // Comparison Surface Mode:
  // - 'specimen': Shared Neutral Specimen vs. Token-Applied Specimen (works identically across Plaidis, Linear, Stripe)
  // - 'contextmuse-home': Original ContextMuse 52e179d → 195921a screenshot slider (available on Study 01 Plaidis/Locomotive)
  const [comparisonSurface, setComparisonSurface] = useState('specimen');

  // Main stage state (Desktop / Mobile — clean, stable, zero-glitch)
  const [viewportModeId, setViewportModeId] = useState('desktop');
  const [pendingModeId, setPendingModeId] = useState(null);
  const [sliderPos, setSliderPos] = useState(50);

  // Detail Inspector modal state
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorModeId, setInspectorModeId] = useState('desktop');
  const [inspectorView, setInspectorView] = useState('side-by-side'); // 'side-by-side' | 'slider' | 'reference' | 'hover'
  const [inspectorZoom, setInspectorZoom] = useState(1);
  const [showPlumbGuides, setShowPlumbGuides] = useState(false);

  // Optional Research & Technical Evidence disclosure
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [simulatingHover, setSimulatingHover] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const activeStageRef = useRef(null);
  const inspectorStageRef = useRef(null);
  const inspectorDialogRef = useRef(null);
  const inspectorCloseBtnRef = useRef(null);
  const inspectorTriggerRef = useRef(null);
  const isDraggingMainRef = useRef(false);
  const isDraggingInspectorRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(Boolean(mq.matches));
    const onChange = (e) => setReducedMotion(Boolean(e.matches));
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    return undefined;
  }, []);

  const activeStudy = STUDY_BY_ID[activeStudyId] || DESIGN_INTELLIGENCE_STUDIES[0];
  const activeMode = MAIN_VIEWPORT_MODES.find((m) => m.id === viewportModeId) || MAIN_VIEWPORT_MODES[0];
  const activeInspectorMode = INSPECTOR_MODES.find((m) => m.id === inspectorModeId) || INSPECTOR_MODES[0];

  // Determine whether the main stage is showing the recorded ContextMuse homepage PNGs or the Shared Neutral Specimen
  const isHomepageCaptureMode = activeStudyId === 'plaidis' && comparisonSurface === 'contextmuse-home';

  // Preload and decode all comparison images on mount so switching is instant and never flashes
  useEffect(() => {
    ALL_PRELOAD_PAIRS.forEach(([b, a]) => {
      preloadAndDecodePair(b, a);
    });
  }, []);

  const handleSelectStudy = useCallback((nextStudyId) => {
    if (!STUDY_BY_ID[nextStudyId]) return;
    setActiveStudyId(nextStudyId);
    // Linear and Stripe always compare on the shared neutral specimen
    if (nextStudyId !== 'plaidis') {
      setComparisonSurface('specimen');
    }
  }, []);

  // Switch main viewport mode only after target pair is decoded in memory
  const handleSelectMainMode = useCallback(
    (nextModeId) => {
      if (nextModeId === viewportModeId && !pendingModeId) return;
      const target = MAIN_VIEWPORT_MODES.find((m) => m.id === nextModeId);
      if (!target) return;

      if (decodedUrlCache.has(target.beforeSrc) && decodedUrlCache.has(target.afterSrc)) {
        setPendingModeId(null);
        setViewportModeId(nextModeId);
        return;
      }

      setPendingModeId(nextModeId);
      preloadAndDecodePair(target.beforeSrc, target.afterSrc).then(() => {
        setViewportModeId(nextModeId);
        setPendingModeId(null);
      });
    },
    [viewportModeId, pendingModeId]
  );

  const handleSelectInspectorMode = useCallback((nextModeId) => {
    const target = INSPECTOR_MODES.find((m) => m.id === nextModeId);
    if (!target) return;
    preloadAndDecodePair(target.beforeSrc, target.afterSrc).then(() => {
      setInspectorModeId(nextModeId);
    });
  }, []);

  const updatePosFromClientX = useCallback((clientX, containerEl) => {
    if (!containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    if (rect.width <= 0) return;
    const rawPct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, rawPct));
    setSliderPos(clamped);
  }, []);

  const handleMainPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    isDraggingMainRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updatePosFromClientX(e.clientX, activeStageRef.current);
  };

  const handleMainPointerMove = (e) => {
    if (!isDraggingMainRef.current) return;
    updatePosFromClientX(e.clientX, activeStageRef.current);
  };

  const handleMainPointerUp = (e) => {
    if (!isDraggingMainRef.current) return;
    isDraggingMainRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const handleInspectorPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    isDraggingInspectorRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updatePosFromClientX(e.clientX, inspectorStageRef.current);
  };

  const handleInspectorPointerMove = (e) => {
    if (!isDraggingInspectorRef.current) return;
    updatePosFromClientX(e.clientX, inspectorStageRef.current);
  };

  const handleInspectorPointerUp = (e) => {
    if (!isDraggingInspectorRef.current) return;
    isDraggingInspectorRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const handleSliderKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSliderPos((prev) => Math.max(0, prev - step));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSliderPos((prev) => Math.min(100, prev + step));
    } else if (e.key === 'PageDown') {
      e.preventDefault();
      setSliderPos((prev) => Math.max(0, prev - 10));
    } else if (e.key === 'PageUp') {
      e.preventDefault();
      setSliderPos((prev) => Math.min(100, prev + 10));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPos(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPos(100);
    }
  };

  const closeDetailInspector = useCallback(() => {
    setInspectorOpen(false);
    const triggerEl = inspectorTriggerRef.current;
    if (triggerEl && typeof triggerEl.focus === 'function') {
      setTimeout(() => {
        triggerEl.focus();
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (!inspectorOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      inspectorCloseBtnRef.current?.focus();
    }, 0);

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDetailInspector();
        return;
      }
      if (e.key === 'Tab' && inspectorDialogRef.current) {
        const focusable = Array.from(
          inspectorDialogRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [inspectorOpen, closeDetailInspector]);

  const openDetailInspector = (initialMode = viewportModeId, initialView = 'side-by-side') => {
    inspectorTriggerRef.current = document.activeElement;
    setInspectorModeId(initialMode);
    setInspectorView(initialView);
    setInspectorOpen(true);
  };

  const handleInquireAboutDesignSystem = () => {
    updateInquiry({
      projectType: 'Brand & Design',
      notes: `Interested in ContextMuse Design Intelligence & UI/Design-System refinement (reviewed the ${activeStudy.shortName} study in the 3-System Token Extraction Case Study).`,
    });
    openBrief();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1B1F21] text-[#EDE9E0] font-sans selection:bg-[#D9A62E] selection:text-[#141617]">
      <SiteHeader />
      <PageAnnotationOverlay />

      <main className="flex-1">
        {/* ============================================================
            SECTION A: THREE-STUDY SELECTOR & INTERACTIVE BEFORE/AFTER SLIDER
            ============================================================ */}
        <section
          id="interactive-comparison"
          className="border-b border-[#DFDACE]/15 bg-[#1B1F21] px-5 py-8 sm:px-8 sm:py-12 lg:px-10"
        >
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Compact Header & Narrative Intro */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#DFDACE]/75">
                <Link
                  to="/lab"
                  className="inline-flex items-center gap-1.5 hover:text-[#D9A62E] transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>The Lab / Design Intelligence Token Extraction Study</span>
                </Link>
                <span className="text-[#D9A62E]">
                  3 Comparative Studies · Plaidis (Locomotive) · Linear · Stripe
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#EDE9E0] leading-[1.05]">
                How do verified design-system tokens transform the same interface?
              </h1>

              <p className="max-w-3xl text-sm sm:text-base text-[#DFDACE]/90 leading-relaxed">
                We inspected three distinct external reference systems—
                <strong className="text-[#EDE9E0]">Plaidis (Locomotive)</strong>,{' '}
                <strong className="text-[#EDE9E0]">Linear</strong>, and{' '}
                <strong className="text-[#EDE9E0]">Stripe</strong>—using headless Chromium developer tools to extract
                declared CSS variables and computed DOM styles. Select any study below to inspect its verified token
                evidence and drag the comparison slider to evaluate how its visual system reshapes an identical neutral
                specimen interface.
              </p>
            </div>

            {/* ============================================================
                THREE-STUDY SELECTOR BAR: PLAIDIS / LINEAR / STRIPE
                ============================================================ */}
            <div
              role="group"
              aria-label="Design system study selector"
              className="grid gap-2.5 sm:grid-cols-3"
            >
              {DESIGN_INTELLIGENCE_STUDIES.map((study) => {
                const isSelected = study.id === activeStudyId;
                return (
                  <button
                    key={study.id}
                    type="button"
                    data-study-btn={study.id}
                    onClick={() => handleSelectStudy(study.id)}
                    aria-pressed={isSelected}
                    className={`group flex flex-col justify-between border p-4 text-left transition-colors ${
                      isSelected
                        ? 'border-[#D9A62E] bg-[#23282A] ring-1 ring-[#D9A62E]'
                        : 'border-[#DFDACE]/20 bg-[#16191B] hover:border-[#DFDACE]/45 hover:bg-[#1E2225]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                      <span
                        className={`font-bold uppercase tracking-wider ${
                          isSelected ? 'text-[#D9A62E]' : 'text-[#DFDACE]/70'
                        }`}
                      >
                        {study.selectorSub}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold ${
                          isSelected
                            ? 'bg-[#D9A62E] text-[#141617]'
                            : 'border border-[#DFDACE]/20 text-[#DFDACE]/65'
                        }`}
                      >
                        {study.sourceDomain}
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="font-display text-lg sm:text-xl font-black tracking-tight text-[#EDE9E0] flex items-center justify-between">
                        <span>{study.selectorLabel}</span>
                        <span
                          style={{ backgroundColor: study.accentHex }}
                          className="inline-block h-2.5 w-2.5 border border-[#EDE9E0]/30"
                        />
                      </div>
                      <p className="mt-1 text-xs text-[#DFDACE]/75 line-clamp-2 leading-snug">
                        {study.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Study Metadata Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 border border-[#DFDACE]/15 bg-[#16191B] px-4 py-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#D9A62E] text-[#141617] px-2 py-0.5 font-mono text-[11px] font-bold">
                  ACTIVE STUDY {activeStudy.num}
                </span>
                <span className="font-bold text-[#EDE9E0]">{activeStudy.name}</span>
                <span className="hidden lg:inline text-[#DFDACE]/40">·</span>
                <a
                  href={activeStudy.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-[#D9A62E] underline hover:text-[#EDE9E0] inline-flex items-center gap-1"
                >
                  <span>{activeStudy.sourceUrl}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>

              <div className="font-mono text-[11px] text-[#DFDACE]/70">
                Inspected: {activeStudy.inspectedAt}
              </div>
            </div>

            {/* Streamlined Primary Controls: Desktop / Mobile + Specimen Mode + Open Detail Inspector */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#DFDACE]/15 py-3">
              <div className="flex flex-wrap items-center gap-3">
                <div
                  role="group"
                  aria-label="Viewport comparison mode"
                  className="inline-flex border border-[#DFDACE]/25 bg-[#23282A] p-1"
                >
                  {MAIN_VIEWPORT_MODES.map((m) => {
                    const Icon = m.icon;
                    const active = m.id === viewportModeId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        data-mode-btn={m.id}
                        onClick={() => handleSelectMainMode(m.id)}
                        aria-pressed={active}
                        className={`flex items-center gap-2 px-4 py-1.5 font-mono text-xs font-bold transition-colors ${
                          active
                            ? 'bg-[#D9A62E] text-[#141617]'
                            : 'text-[#EDE9E0] hover:text-[#D9A62E]'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Simple Original / Split / Transformed Comparison Mode (Preserves Existing Slider Engine) */}
                <div
                  role="group"
                  aria-label="Comparison view mode"
                  className="inline-flex border border-[#DFDACE]/25 bg-[#23282A] p-1 font-mono text-xs"
                >
                  {[
                    { id: 'original', label: 'Original', targetPos: 100, isCurrent: Math.round(sliderPos) === 100 },
                    {
                      id: 'split',
                      label: 'Split',
                      targetPos: 50,
                      isCurrent: Math.round(sliderPos) > 0 && Math.round(sliderPos) < 100,
                    },
                    {
                      id: 'transformed',
                      label: 'Transformed',
                      targetPos: 0,
                      isCurrent: Math.round(sliderPos) === 0,
                    },
                  ].map((modeOpt) => (
                    <button
                      key={modeOpt.id}
                      type="button"
                      data-comparison-view={modeOpt.id}
                      onClick={() => setSliderPos(modeOpt.targetPos)}
                      aria-pressed={modeOpt.isCurrent}
                      className={`px-3 py-1.5 font-bold transition-colors ${
                        modeOpt.isCurrent
                          ? 'bg-[#D9A62E] text-[#141617]'
                          : 'text-[#EDE9E0] hover:text-[#D9A62E]'
                      }`}
                    >
                      {modeOpt.label}
                    </button>
                  ))}
                </div>

                {/* On Study 01 (Plaidis / Locomotive), let visitors toggle between the Shared Specimen and the Original ContextMuse Entrance Capture */}
                {activeStudyId === 'plaidis' && (
                  <div
                    role="group"
                    aria-label="Study 01 comparison target"
                    className="inline-flex border border-[#DFDACE]/25 bg-[#23282A] p-1 font-mono text-xs"
                  >
                    <button
                      type="button"
                      data-surface-btn="specimen"
                      onClick={() => setComparisonSurface('specimen')}
                      aria-pressed={comparisonSurface === 'specimen'}
                      className={`px-3 py-1.5 font-bold transition-colors ${
                        comparisonSurface === 'specimen'
                          ? 'bg-[#17504A] text-[#EDE9E0]'
                          : 'text-[#DFDACE]/80 hover:text-[#D9A62E]'
                      }`}
                    >
                      Shared Neutral Specimen
                    </button>
                    <button
                      type="button"
                      data-surface-btn="contextmuse-home"
                      onClick={() => setComparisonSurface('contextmuse-home')}
                      aria-pressed={comparisonSurface === 'contextmuse-home'}
                      className={`px-3 py-1.5 font-bold transition-colors ${
                        comparisonSurface === 'contextmuse-home'
                          ? 'bg-[#17504A] text-[#EDE9E0]'
                          : 'text-[#DFDACE]/80 hover:text-[#D9A62E]'
                      }`}
                    >
                      ContextMuse Entrance (52e179d → 195921a)
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden md:inline text-xs text-[#DFDACE]/70">
                  Drag handle or use{' '}
                  <kbd className="border border-[#DFDACE]/25 bg-[#23282A] px-1.5 py-0.5 font-mono text-[11px]">←</kbd>{' '}
                  <kbd className="border border-[#DFDACE]/25 bg-[#23282A] px-1.5 py-0.5 font-mono text-[11px]">→</kbd>{' '}
                  keys
                </span>

                <button
                  type="button"
                  onClick={() => openDetailInspector(viewportModeId, 'side-by-side')}
                  className="inline-flex items-center gap-2 border border-[#D9A62E] bg-[#23282A] px-3.5 py-1.5 font-mono text-xs font-bold text-[#D9A62E] hover:bg-[#D9A62E] hover:text-[#141617] transition-colors"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Open Detail Inspector</span>
                </button>
              </div>
            </div>

            {/* ============================================================
                GLITCH-FREE STAGE CONTAINER
                Supports both the Shared Neutral vs. Token-Applied Specimen
                across all 3 studies AND the ContextMuse Entrance PNG slider
                ============================================================ */}
            <div className="border border-[#DFDACE]/20 bg-[#141617]">
              {/* Unobtrusive Before / After Header Bar */}
              <div className="flex items-center justify-between border-b border-[#DFDACE]/15 bg-[#181B1D] px-4 py-2 font-mono text-xs">
                <div className="flex items-center gap-2 font-bold text-[#EDE9E0]">
                  <span className="h-2 w-2 rounded-full bg-[#DFDACE]" />
                  <span>
                    {isHomepageCaptureMode
                      ? 'BEFORE · Baseline (52e179d)'
                      : 'BEFORE · Original Neutral Specimen'}
                  </span>
                </div>
                <div className="hidden sm:block text-[11px] text-[#DFDACE]/60">
                  {activeStudy.selectorLabel} · {activeMode.fullLabel} · {Math.round(sliderPos)}% /{' '}
                  {Math.round(100 - sliderPos)}%
                </div>
                <div className="flex items-center gap-2 font-bold text-[#D9A62E]">
                  <span>
                    {isHomepageCaptureMode
                      ? 'AFTER · Refined (195921a)'
                      : `AFTER · ${activeStudy.selectorLabel} Tokens Applied`}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#D9A62E]" />
                </div>
              </div>

              <div className="relative flex items-center justify-center p-3 sm:p-5 lg:h-[690px]">
                {pendingModeId && (
                  <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-[#141617]/95 border border-[#D9A62E] px-3 py-1 font-mono text-xs text-[#D9A62E]">
                    Preparing comparison…
                  </div>
                )}

                {MAIN_VIEWPORT_MODES.map((mode) => {
                  const isActive = mode.id === viewportModeId;
                  return (
                    <div
                      key={mode.id}
                      ref={isActive ? activeStageRef : null}
                      data-slider-stage={isActive ? 'true' : undefined}
                      data-stage-mode={mode.id}
                      data-stage-study={activeStudyId}
                      onPointerDown={isActive ? handleMainPointerDown : undefined}
                      onPointerMove={isActive ? handleMainPointerMove : undefined}
                      onPointerUp={isActive ? handleMainPointerUp : undefined}
                      onPointerCancel={isActive ? handleMainPointerUp : undefined}
                      style={{ touchAction: 'pan-y' }}
                      className={`${
                        isActive ? 'block' : 'hidden'
                      } relative w-full ${mode.maxWidthClass} ${mode.aspectClass} select-none overflow-hidden border border-[#DFDACE]/25 bg-[#1B1F21] shadow-2xl cursor-ew-resize`}
                    >
                      {isHomepageCaptureMode ? (
                        <>
                          {/* LAYER 1 (BASE): AFTER IMAGE (Experiment 195921a) */}
                          <img
                            src={mode.afterSrc}
                            alt={isActive ? `AFTER (Experiment 195921a) — ${mode.fullLabel}` : ''}
                            width={mode.naturalWidth}
                            height={mode.naturalHeight}
                            decoding="sync"
                            loading="eager"
                            draggable={false}
                            className="absolute inset-0 block h-full w-full object-contain select-none pointer-events-none"
                          />

                          {/* LAYER 2 (CLIPPED OVERLAY): BEFORE IMAGE (Baseline 52e179d) */}
                          <div
                            aria-hidden="true"
                            style={{
                              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                            }}
                            className="absolute inset-0 pointer-events-none"
                          >
                            <img
                              src={mode.beforeSrc}
                              alt={isActive ? `BEFORE (Baseline 52e179d) — ${mode.fullLabel}` : ''}
                              width={mode.naturalWidth}
                              height={mode.naturalHeight}
                              decoding="sync"
                              loading="eager"
                              draggable={false}
                              className="absolute inset-0 block h-full w-full object-contain select-none pointer-events-none"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {/* LAYER 1 (BASE): AFTER — TOKEN-APPLIED SHARED SPECIMEN */}
                          <div className="absolute inset-0 pointer-events-none">
                            <DesignSystemSpecimen
                              variant={activeStudyId}
                              viewport={mode.id}
                              simulatingHover={simulatingHover}
                              reducedMotion={reducedMotion}
                            />
                          </div>

                          {/* LAYER 2 (CLIPPED OVERLAY): BEFORE — ORIGINAL NEUTRAL SPECIMEN */}
                          <div
                            aria-hidden="true"
                            style={{
                              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                            }}
                            className="absolute inset-0 pointer-events-none"
                          >
                            <DesignSystemSpecimen
                              variant="neutral"
                              viewport={mode.id}
                              simulatingHover={simulatingHover}
                              reducedMotion={reducedMotion}
                            />
                          </div>
                        </>
                      )}

                      {/* Accessible Slider Handle */}
                      {isActive && (
                        <div
                          style={{ left: `${sliderPos}%` }}
                          className="absolute top-0 bottom-0 z-30 -ml-px w-0.5 bg-[#D9A62E] shadow-[0_0_12px_rgba(0,0,0,0.9)]"
                        >
                          <div
                            role="slider"
                            tabIndex={0}
                            aria-orientation="horizontal"
                            aria-label={`Before and after comparison slider (${activeStudy.selectorLabel} — ${mode.fullLabel})`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(sliderPos)}
                            aria-valuetext={
                              isHomepageCaptureMode
                                ? `${Math.round(sliderPos)}% Before (Baseline 52e179d), ${Math.round(
                                    100 - sliderPos
                                  )}% After (Experiment 195921a)`
                                : `${Math.round(sliderPos)}% Before (Neutral Specimen), ${Math.round(
                                    100 - sliderPos
                                  )}% After (${activeStudy.selectorLabel} Tokens Applied)`
                            }
                            onKeyDown={handleSliderKeyDown}
                            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center border-2 border-[#141617] bg-[#D9A62E] text-[#141617] shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE9E0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141617] transition-transform motion-reduce:transition-none hover:scale-105"
                          >
                            <MoveHorizontal className="h-5 w-5 stroke-[2.5]" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explicit Synthetic Demonstration Data & Structural Parity Notice */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DFDACE]/15 bg-[#181B1D] px-4 py-2 font-mono text-[11px] text-[#DFDACE]/75">
                <span>
                  <strong className="text-[#D9A62E]">Synthetic Demonstration Specimen:</strong> Metrics (
                  <code className="font-mono">1,420 req/s</code>, <code className="font-mono">18.4 ms</code>,{' '}
                  <code className="font-mono">100.0%</code>, <code className="font-mono">RT-4091..4093</code>) are
                  illustrative fixture data held constant across all studies—not live operational telemetry.
                </span>
                <span className="text-[#DFDACE]/60">
                  DOM Parity: 85 / 85 identical nodes · 100% text parity
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION A2: VERIFIED TOKEN BREAKDOWN, CONTRAST SWATCHES &
            5-QUESTION ANALYTICAL SUBSTANCE FOR ACTIVE STUDY
            ============================================================ */}
        <section
          id="token-extraction-breakdown"
          className="border-b border-[#DFDACE]/15 bg-[#16191B] text-[#EDE9E0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10"
        >
          <div className="mx-auto max-w-6xl space-y-12">
            {/* Study Breakdown Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#DFDACE]/15 pb-6">
              <div className="space-y-2 max-w-3xl">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E]">
                  Study {activeStudy.num} Dossier · Verified Token Observations &amp; Analytical Substance
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-[#EDE9E0]">
                  {activeStudy.name}
                </h2>
                <p className="text-sm sm:text-base text-[#DFDACE]/85 leading-relaxed">
                  {activeStudy.executiveSummary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openDetailInspector(viewportModeId, 'reference')}
                  className="inline-flex items-center gap-2 border border-[#DFDACE]/30 bg-[#23282A] px-3.5 py-2 font-mono text-xs font-bold text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
                >
                  <Eye className="h-3.5 w-3.5 text-[#D9A62E]" />
                  <span>Inspect Reference Capture ({activeStudy.sourceDomain})</span>
                </button>
              </div>
            </div>

            {/* 4-Pillar System Profile: Hierarchy, Density, Visual Emphasis, Readability */}
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#DFDACE]/70">
                01 / Visual-System Effect on Shared Specimen (Hierarchy, Density, Emphasis &amp; Readability)
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Hierarchy', data: activeStudy.comparisonMetrics.hierarchy },
                  { label: 'Component Density', data: activeStudy.comparisonMetrics.density },
                  { label: 'Visual Emphasis', data: activeStudy.comparisonMetrics.visualEmphasis },
                  { label: 'Readability & Contrast', data: activeStudy.comparisonMetrics.readability },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="border border-[#DFDACE]/20 bg-[#1B1F21] p-4 flex flex-col justify-between space-y-2"
                  >
                    <div className="space-y-1">
                      <div className="font-mono text-[10.5px] uppercase tracking-wider text-[#D9A62E] font-bold">
                        {metric.label}
                      </div>
                      <div className="font-display text-base font-bold text-[#EDE9E0]">
                        {metric.data.scoreLabel}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-[#DFDACE]/80 border-t border-[#DFDACE]/10 pt-2">
                      {metric.data.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Token Extraction Breakdown Table (Distinguishing Class A, Class B, Class C) */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E]">
                    02 / Extracted Design Tokens (Declared vs. Computed vs. Inferred vs. Deliberate Adaptation)
                  </div>
                  <p className="text-xs text-[#DFDACE]/75 mt-0.5">
                    Source: <code className="font-mono text-[#EDE9E0]">{activeStudy.sourceUrl}</code> ·{' '}
                    {activeStudy.inspectedAt} · Dossier:{' '}
                    <code className="font-mono text-[#EDE9E0]">{activeStudy.referenceDossierPath}</code>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-[10.5px]">
                  <span className="border border-emerald-500/40 bg-emerald-950/60 px-2 py-0.5 text-emerald-300 font-bold">
                    Class A: Declared CSS Token
                  </span>
                  <span className="border border-sky-500/40 bg-sky-950/60 px-2 py-0.5 text-sky-300 font-bold">
                    Class B: Computed DOM Style
                  </span>
                  <span className="border border-amber-500/40 bg-amber-950/60 px-2 py-0.5 text-amber-300 font-bold">
                    Class C: Inferred Pattern
                  </span>
                  <span className="border border-purple-500/40 bg-purple-950/60 px-2 py-0.5 text-purple-300 font-bold">
                    Class D: Deliberate Adaptation
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#DFDACE]/20 bg-[#1B1F21]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#DFDACE]/20 bg-[#23282A] font-mono text-[11px] uppercase tracking-wider text-[#DFDACE]/80">
                      <th className="py-3 px-4">Token Category &amp; Selector</th>
                      <th className="py-3 px-4">Epistemic Class</th>
                      <th className="py-3 px-4">Observed Desktop (1440×900)</th>
                      <th className="py-3 px-4">Observed Mobile (390×844)</th>
                      <th className="py-3 px-4">Verification Evidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFDACE]/10">
                    {activeStudy.tokenBreakdown.map((row) => (
                      <tr key={row.category} className="hover:bg-[#23282A]/50 transition-colors">
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-bold text-[#EDE9E0]">{row.category}</div>
                          <code className="font-mono text-[11px] text-[#D9A62E] block mt-0.5">
                            {row.tokenName}
                          </code>
                        </td>
                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          <span
                            className={`inline-block font-mono text-[10px] font-bold px-2 py-0.5 border ${
                              row.classification === 'A'
                                ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300'
                                : row.classification === 'B'
                                ? 'border-sky-500/40 bg-sky-950/60 text-sky-300'
                                : row.classification === 'C'
                                ? 'border-amber-500/40 bg-amber-950/60 text-amber-300'
                                : 'border-purple-500/40 bg-purple-950/60 text-purple-300'
                            }`}
                          >
                            {row.classificationLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 align-top font-mono text-[11px] text-[#EDE9E0]/95">
                          {row.desktopValue}
                        </td>
                        <td className="py-3.5 px-4 align-top font-mono text-[11px] text-[#DFDACE]/85">
                          {row.mobileValue}
                        </td>
                        <td className="py-3.5 px-4 align-top text-[#DFDACE]/80 leading-relaxed">
                          {row.evidence}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Deliberate Specimen & Transfer Adaptations Callout (Class D) */}
              {activeStudy.transferAdaptations && (
                <div className="border border-purple-500/35 bg-[#1B1F21] p-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <span className="font-bold text-purple-300 uppercase tracking-wider">
                      Deliberate Specimen &amp; Transfer Adaptations Beyond 1:1 Token Substitution (Class D)
                    </span>
                    <span className="text-[#DFDACE]/65 text-[11px]">
                      Preserving 85-node DOM parity, split-slider alignment &amp; font-license boundaries
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#DFDACE]/85 leading-relaxed list-disc pl-4">
                    {activeStudy.transferAdaptations.map((adaptation) => (
                      <li key={adaptation}>{adaptation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Color Swatches with Accessible Contrast Ratios */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E]">
                    03 / Extracted Color Swatches &amp; Measured WCAG 2.1 Luminance Contrast Ratios
                  </div>
                  <p className="text-xs text-[#DFDACE]/75 mt-0.5">
                    Every foreground/background pairing is evaluated using relative luminance (WCAG 2.1 AA requires 4.5:1
                    for normal text, 3.0:1 for large text; AAA requires 7.0:1).
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeStudy.colorSwatches.map((swatch) => (
                  <div
                    key={swatch.name}
                    data-contrast-swatch={swatch.name}
                    className="border border-[#DFDACE]/20 bg-[#1B1F21] overflow-hidden flex flex-col justify-between"
                  >
                    {/* Live Rendered Swatch Preview */}
                    <div
                      style={{ backgroundColor: swatch.bgHex, color: swatch.fgHex }}
                      className="p-4 border-b border-[#DFDACE]/15 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-wider opacity-80">
                          {swatch.token}
                        </div>
                        <div className="font-display text-base font-bold mt-0.5">
                          {swatch.name}
                        </div>
                      </div>
                      <span
                        style={{
                          borderColor: swatch.fgHex,
                          color: swatch.fgHex,
                        }}
                        className="border px-2 py-0.5 font-mono text-xs font-bold shrink-0"
                      >
                        {swatch.contrastRatio}
                      </span>
                    </div>

                    {/* Swatch Metadata */}
                    <div className="p-3.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-[#DFDACE]/80">
                          BG <strong className="text-[#EDE9E0]">{swatch.bgHex}</strong> · FG{' '}
                          <strong className="text-[#EDE9E0]">{swatch.fgHex}</strong>
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold border ${
                            swatch.wcagLevel === 'AAA'
                              ? 'border-emerald-500/40 bg-emerald-950/70 text-emerald-300'
                              : swatch.wcagLevel === 'AA'
                              ? 'border-sky-500/40 bg-sky-950/70 text-sky-300'
                              : 'border-amber-500/40 bg-amber-950/70 text-amber-300'
                          }`}
                        >
                          WCAG {swatch.wcagLevel}
                        </span>
                      </div>
                      <p className="text-[#DFDACE]/75 leading-snug">{swatch.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 4: Five Analytical Substance Questions */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DFDACE]/15 pb-3">
                <div>
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E]">
                    04 / Analytical Substance — {activeStudy.shortName} Design System Evaluation
                  </div>
                  <p className="text-xs text-[#DFDACE]/75 mt-0.5">
                    Separating directly measured DOM &amp; accessibility evidence from plausible perceptual effects and
                    methodological limitations.
                  </p>
                </div>
                <span className="font-mono text-[11px] text-[#DFDACE]/70">
                  No affiliate relationship · No conversion claims without A/B testing
                </span>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {activeStudy.analyticalQuestions.map((item, idx) => (
                  <div
                    key={item.q}
                    className={`border border-[#DFDACE]/20 bg-[#1B1F21] p-5 space-y-2 ${
                      idx === 4 ? 'lg:col-span-2 border-l-4 border-l-[#D9A62E]' : ''
                    }`}
                  >
                    <h3 className="font-display text-base font-bold text-[#EDE9E0]">{item.q}</h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#DFDACE]/85">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-System Synthesis Matrix (Comparing All 3 Studies Side-by-Side) */}
            <div className="space-y-4 pt-2">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E]">
                05 / Cross-System Comparative Matrix (Plaidis vs. Linear vs. Stripe on Identical Specimen)
              </div>
              <div className="overflow-x-auto border border-[#DFDACE]/20 bg-[#1B1F21]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#DFDACE]/20 bg-[#23282A] font-mono text-[11px] uppercase tracking-wider text-[#DFDACE]/80">
                      <th className="py-3 px-4">System Dimension</th>
                      <th className="py-3 px-4">Study 01 · Plaidis (Locomotive)</th>
                      <th className="py-3 px-4">Study 02 · Linear (linear.app)</th>
                      <th className="py-3 px-4">Study 03 · Stripe (stripe.com)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFDACE]/10">
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-[#D9A62E]">Surface Polarity</td>
                      <td className="py-3 px-4 text-[#DFDACE]/90">
                        Editorial Bone (<code className="font-mono">#EDE9E0</code>) &amp; Charcoal (<code className="font-mono">#23282A</code>) / Reference <code className="font-mono">#000000</code>
                      </td>
                      <td className="py-3 px-4 text-[#DFDACE]/90">
                        Obsidian Dark (<code className="font-mono">#08090A</code> canvas, <code className="font-mono">#0F1011</code> panels, <code className="font-mono">#141516</code> ledger)
                      </td>
                      <td className="py-3 px-4 text-[#DFDACE]/90">
                        Daylight White (<code className="font-mono">#FFFFFF</code> / <code className="font-mono">#F8FAFD</code>) + Dark Navy (<code className="font-mono">#0D1738</code>)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-[#D9A62E]">Display Typography</td>
                      <td className="py-3 px-4 text-[#DFDACE]/90">
                        Reference <code className="font-mono">LocomotiveNew</code> wt <code className="font-mono">400</code> (<code className="font-mono">1.00–1.10</code> lh); specimen adaptation <code className="font-mono">800</code> uppercase (<code className="font-mono">Class D</code>)
                      </td>
                      <td className="py-3 px-4 text-[#DFDACE]/90">
                        <code className="font-mono">Inter Variable</code> weight <code className="font-mono">510</code>, <code className="font-mono">-0.022em</code> tracking, <code className="font-mono">&quot;cv01&quot;, &quot;ss03&quot;</code> (system fallback)
                      </td>
                      <td className="py-3 px-4 text-[#DFDACE]/90">
                        <code className="font-mono">sohne-var</code> light weight <code className="font-mono">300</code>, <code className="font-mono">-0.02em</code> tracking, <code className="font-mono">#64748D</code> lead (stacked on specimen, <code className="font-mono">Class D</code>)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-[#D9A62E]">Depth &amp; Borders</td>
                      <td className="py-3 px-4 text-[#DFDACE]/90">
                        <code className="font-mono">0px</code> radius, <code className="font-mono">2px solid</code> top overlines, <code className="font-mono">box-shadow: none</code>
                      </td>
                      <td className="py-3 px-4 text-[#DFDACE]/90">
                        <code className="font-mono">8px–12px</code> radius, <code className="font-mono">1px rgba(255,255,255,0.08)</code> ring, <code className="font-mono">0px</code> drop shadow
                      </td>
                      <td className="py-3 px-4 text-[#DFDACE]/90">
                        <code className="font-mono">6px</code> card / <code className="font-mono">4px</code> CTA radius, <code className="font-mono">1px #E5EDF5</code>, <code className="font-mono">0 16px 32px rgba(50,50,93,0.12)</code>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-[#D9A62E]">Primary Action CTA</td>
                      <td className="py-3 px-4 text-[#DFDACE]/90">
                        <code className="font-mono">0px</code> square bar, <code className="font-mono">2px</code> border, <code className="font-mono">450ms/200ms</code> quintic hover
                      </td>
                      <td className="py-3 px-4 text-[#DFDACE]/90">
                        <code className="font-mono">32px</code> pill (<code className="font-mono">9999px</code>), monochrome <code className="font-mono">#E5E5E6</code> (<code className="font-mono">15.83:1</code> AAA), <code className="font-mono">160ms</code>
                      </td>
                      <td className="py-3 px-4 text-[#DFDACE]/90">
                        <code className="font-mono">48px</code> (<code className="font-mono">44px</code> mobile), <code className="font-mono">#533AFD</code> violet (<code className="font-mono">6.19:1</code> AA), <code className="font-mono">4px</code> radius, <code className="font-mono">300ms</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION B: WHAT CHANGED ON CONTEXTMUSE (THREE CONCISE FINDINGS)
            ============================================================ */}
        <section
          id="what-changed"
          className="border-b border-[#DFDACE]/15 bg-[#EDE9E0] text-[#23282A] px-5 py-12 sm:px-8 sm:py-16 lg:px-10"
        >
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="space-y-2">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#17504A]">
                02 / Baseline Production Experiment (Study 01 Applied to ContextMuse)
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-[#23282A]">
                Three targeted refinements, measured before and after.
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {THREE_FINDINGS.map((item) => (
                <article
                  key={item.num}
                  className="flex flex-col justify-between border-2 border-[#23282A] bg-[#DFDACE]/65 p-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#23282A]/20 pb-3 font-mono text-xs">
                      <span className="font-bold text-[#17504A]">Finding {item.num}</span>
                      <span className="bg-[#23282A] text-[#EDE9E0] px-2.5 py-0.5 font-bold">
                        {item.metric}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-black tracking-tight text-[#23282A]">
                      {item.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-[#23282A]/90">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION C: FROM EXPERIMENT TO DESIGN INTELLIGENCE
            + COMPACT 5-STAGE PROCESS
            + OPTIONAL "VIEW RESEARCH & TECHNICAL EVIDENCE" DISCLOSURE
            ============================================================ */}
        <section
          id="from-experiment-to-design-intelligence"
          className="bg-[#17504A] text-[#EDE9E0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10"
        >
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="grid gap-6 lg:grid-cols-12 items-end">
              <div className="lg:col-span-8 space-y-2">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E]">
                  03 / From Experiment to Design Intelligence
                </div>
                <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-[#EDE9E0]">
                  Turning reference analysis into a reusable design system workflow.
                </h2>
                <p className="text-sm sm:text-base text-[#EDE9E0]/90 leading-relaxed max-w-3xl">
                  Rather than prompting AI for generic styling or imitating another company’s layout, this study tests a
                  repeatable Design Intelligence Library: extracting measurable layout, luminance, and interaction
                  tolerances from strong references, evaluating them on a neutral specimen, and verifying that product
                  workflows remain intact.
                </p>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end">
                <button
                  type="button"
                  onClick={handleInquireAboutDesignSystem}
                  className="inline-flex items-center gap-2 bg-[#D9A62E] text-[#141617] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#e3b13b] transition-colors"
                >
                  <span>Start a Project</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Compact 5-Stage Process Illustration */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {FIVE_STAGES.map((stage) => (
                <div
                  key={stage.step}
                  className="border border-[#EDE9E0]/25 bg-[#123F3A] p-4 space-y-1.5"
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-[#D9A62E]">
                    <span>{stage.step}</span>
                    <span>→</span>
                  </div>
                  <h3 className="font-display text-base font-black uppercase tracking-tight text-[#EDE9E0]">
                    {stage.name}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#EDE9E0]/85">{stage.summary}</p>
                </div>
              ))}
            </div>

            {/* Optional Disclosure: View Research & Technical Evidence */}
            <div className="border-2 border-[#EDE9E0]/25 bg-[#123F3A]">
              <button
                type="button"
                onClick={() => setEvidenceOpen((v) => !v)}
                aria-expanded={evidenceOpen}
                aria-controls="research-technical-evidence"
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#0F3530] transition-colors"
              >
                <div>
                  <div className="font-display text-base sm:text-lg font-bold text-[#EDE9E0]">
                    View Research &amp; Technical Evidence
                  </div>
                  <p className="text-xs text-[#DFDACE]/80 mt-0.5">
                    Measured DOM coordinates, interactive hover reproductions, 11/11 smoke test log, commit provenance,
                    and reference attribution across Plaidis (Locomotive), Linear, and Stripe.
                  </p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1.5 border border-[#D9A62E] bg-[#17504A] px-3 py-1.5 font-mono text-xs font-bold text-[#D9A62E]">
                  <span>{evidenceOpen ? 'Hide Evidence' : 'Expand Evidence'}</span>
                  {evidenceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </button>

              {evidenceOpen && (
                <div
                  id="research-technical-evidence"
                  className="border-t border-[#EDE9E0]/20 bg-[#1B1F21] text-[#EDE9E0] p-5 sm:p-8 space-y-10"
                >
                  {/* 1. Measured Values vs. Subjective Design Judgment */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DFDACE]/15 pb-3">
                      <h3 className="font-display text-xl font-bold text-[#EDE9E0]">
                        1. Measured DOM Values vs. Subjective Design Judgments
                      </h3>
                      <span className="font-mono text-xs text-[#D9A62E]">
                        Playwright getBoundingClientRect &amp; getComputedStyle
                      </span>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3 text-xs">
                      <div className="border border-[#DFDACE]/20 bg-[#23282A] p-4 space-y-2">
                        <div className="font-mono font-bold text-[#D9A62E]">
                          Study 01 · Plumb Line &amp; Quintic Easing (Measured Fact)
                        </div>
                        <p className="text-[#DFDACE]/90 leading-relaxed">
                          Desktop (1440×900) Before: Logo <code className="font-mono">x=24px</code>, Hero H1{' '}
                          <code className="font-mono">x=48px</code>, Primary CTA <code className="font-mono">x=48px</code>,
                          Footer <code className="font-mono">x=24px</code> (24px variance). After: all four anchor at{' '}
                          <code className="font-mono">x=40px</code> (0px variance). Hover curve set to{' '}
                          <code className="font-mono">cubic-bezier(0.23, 1, 0.32, 1)</code> (<code className="font-mono">450ms</code>/<code className="font-mono">200ms</code>).
                        </p>
                        <p className="text-[#DFDACE]/70 border-t border-[#DFDACE]/15 pt-2">
                          <strong>Subjective Judgment:</strong> Aligning the left edge and matching 0px CTA corners to
                          the room grid makes the left column read as one architectural frame.
                        </p>
                      </div>

                      <div className="border border-[#DFDACE]/20 bg-[#23282A] p-4 space-y-2">
                        <div className="font-mono font-bold text-[#D9A62E]">
                          Study 02 · Linear Luminance &amp; Variable Axes (Measured Fact)
                        </div>
                        <p className="text-[#DFDACE]/90 leading-relaxed">
                          49 accessible stylesheets declare <code className="font-mono">--color-bg-primary: #08090a</code>,{' '}
                          <code className="font-mono">--color-text-primary: #f7f8f8</code> (<code className="font-mono">18.73:1</code> AAA),{' '}
                          <code className="font-mono">--font-weight-medium: 510</code>, <code className="font-mono">--font-weight-semibold: 590</code>, and alias{' '}
                          <code className="font-mono">--shadow-low..high</code> to <code className="font-mono">0px transparent</code>.
                        </p>
                        <p className="text-[#DFDACE]/70 border-t border-[#DFDACE]/15 pt-2">
                          <strong>Subjective Judgment:</strong> Stepped dark-mode surfaces bounded by 8% white hairlines
                          read as cleaner than dark drop shadows, though <code className="font-mono">13px</code> copy increases density.
                        </p>
                      </div>

                      <div className="border border-[#DFDACE]/20 bg-[#23282A] p-4 space-y-2">
                        <div className="font-mono font-bold text-[#D9A62E]">
                          Study 03 · Stripe HDS Scale &amp; Tinted Elevation (Measured Fact)
                        </div>
                        <p className="text-[#DFDACE]/90 leading-relaxed">
                          946 <code className="font-mono">--hds-*</code> variables declare <code className="font-mono">--hds-color-core-brand-600: #533afd</code> (<code className="font-mono">6.19:1</code> AA),{' '}
                          <code className="font-mono">--hds-color-core-neutral-990: #061b31</code> (<code className="font-mono">17.37:1</code> AAA),{' '}
                          <code className="font-mono">sohne-var</code> at <code className="font-mono">font-weight: 300</code>, and{' '}
                          <code className="font-mono">0px 16px 32px rgba(50,50,93,0.12)</code> elevation.
                        </p>
                        <p className="text-[#DFDACE]/70 border-t border-[#DFDACE]/15 pt-2">
                          <strong>Subjective Judgment:</strong> Light 300-weight headings and navy-tinted shadows create
                          editorial openness, though <code className="font-mono">#64748D</code> (<code className="font-mono">4.75:1</code>) sits close to the AA floor.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Interactive Component Reproductions vs. Recorded Hover Screenshot */}
                  <div id="hover-motion-comparison" className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DFDACE]/15 pb-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#D9A62E]">
                          <Play className="h-3.5 w-3.5" />
                          <span>INTERACTIVE COMPONENT REPRODUCTIONS (NOT RECORDED SESSIONS)</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-[#EDE9E0] mt-0.5">
                          2. Live Hover Timing Reproductions vs. Recorded Playwright Capture
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSimulatingHover((v) => !v)}
                        aria-pressed={simulatingHover}
                        className={`shrink-0 inline-flex items-center gap-2 border px-3.5 py-2 font-mono text-xs font-bold transition-colors ${
                          simulatingHover
                            ? 'border-[#D9A62E] bg-[#D9A62E] text-[#141617]'
                            : 'border-[#D9A62E] bg-[#23282A] text-[#D9A62E] hover:bg-[#D9A62E] hover:text-[#141617]'
                        }`}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{simulatingHover ? 'Release Simulated Hover' : 'Simulate Simultaneous Hover'}</span>
                      </button>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-3 items-stretch">
                      {/* Reproduction A: Baseline 52e179d */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between font-mono text-xs text-[#DFDACE]/80">
                          <span className="font-bold text-[#EDE9E0]">Reproduction A · Baseline (52e179d)</span>
                          <span>300ms · brightness(1.05)</span>
                        </div>
                        <div
                          className={`group relative flex flex-1 flex-col justify-between p-5 bg-[#DFDACE] text-[#23282A] transition-all duration-300 select-none cursor-pointer ${
                            simulatingHover ? 'brightness-105' : 'hover:brightness-105'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between border-b border-current/20 pb-2 font-mono text-xs">
                              <span className="font-bold tracking-widest uppercase">02 / ASSEMBLE</span>
                              <ArrowUpRight
                                className={`h-4 w-4 transition-transform duration-300 ${
                                  simulatingHover
                                    ? 'translate-x-0.5 -translate-y-0.5 opacity-100'
                                    : 'opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100'
                                }`}
                              />
                            </div>
                            <h4 className="mt-3 font-display text-2xl font-black uppercase tracking-tight">
                              Custom Builds
                            </h4>
                            <p className="mt-1.5 text-xs opacity-85 leading-snug">
                              Custom websites, quoting engines, and internal tools built around how you work.
                            </p>
                          </div>

                          <div className="my-4 flex items-center gap-1.5 font-mono text-[10px]">
                            <span className="px-2 py-0.5 rounded bg-white/80 text-[#23282A] font-bold border border-[#23282A]/20">
                              01 Website
                            </span>
                            <span>→</span>
                            <span className="px-2 py-0.5 rounded bg-red-100/90 text-red-900 font-bold border border-red-300">
                              02 Quoting
                            </span>
                            <span>→</span>
                            <span className="px-2 py-0.5 rounded bg-[#17504A] text-white font-bold">
                              03 Workflow
                            </span>
                          </div>

                          <div className="flex items-center justify-between border-t border-current/15 pt-2 font-mono text-xs font-bold">
                            <span>Shape a Custom Build</span>
                            <span>→</span>
                          </div>
                        </div>
                      </div>

                      {/* Reproduction B: Experiment 195921a */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between font-mono text-xs text-[#D9A62E]">
                          <span className="font-bold">Reproduction B · Experiment (195921a)</span>
                          <span>450ms enter / 200ms leave</span>
                        </div>
                        <div
                          style={{
                            transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
                            transitionDuration: reducedMotion ? '0ms' : simulatingHover ? '450ms' : '200ms',
                          }}
                          className="group relative flex flex-1 flex-col justify-between p-5 bg-[#DFDACE] text-[#23282A] select-none cursor-pointer border border-[#D9A62E]/40 motion-reduce:transition-none"
                        >
                          <div>
                            <div
                              className={`flex items-center justify-between border-b-2 pb-2 font-mono text-xs transition-colors duration-200 group-hover:duration-500 ${
                                simulatingHover
                                  ? 'border-current/55'
                                  : 'border-current/25 group-hover:border-current/55'
                              }`}
                            >
                              <span className="font-bold tracking-[0.14em] uppercase">02 / ASSEMBLE</span>
                              <ArrowUpRight
                                className={`h-4 w-4 transition-transform duration-200 group-hover:duration-500 ${
                                  simulatingHover
                                    ? 'translate-x-1 -translate-y-1 opacity-100'
                                    : 'opacity-75 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100'
                                }`}
                              />
                            </div>
                            <h4 className="mt-3 font-display text-2xl font-black uppercase tracking-tight">
                              Custom Builds
                            </h4>
                            <p className="mt-1.5 text-xs opacity-90 leading-snug">
                              Custom websites, quoting engines, and internal tools built around how you work.
                            </p>
                          </div>

                          <div className="my-4 flex items-center gap-1.5 font-mono text-[10px]">
                            <span className="px-2 py-0.5 bg-[#EDE9E0] text-[#23282A] font-bold border border-[#23282A]/25">
                              01 Website
                            </span>
                            <span>→</span>
                            <span
                              className={`px-2 py-0.5 text-[#23282A] font-bold border border-[#D9A62E] transition-colors duration-200 group-hover:duration-500 ${
                                simulatingHover ? 'bg-[#D9A62E]' : 'bg-[#D9A62E]/30 group-hover:bg-[#D9A62E]'
                              }`}
                            >
                              02 Quoting
                            </span>
                            <span>→</span>
                            <span className="px-2 py-0.5 bg-[#17504A] text-[#EDE9E0] font-bold border border-[#17504A]">
                              03 Workflow
                            </span>
                          </div>

                          <div className="flex items-center justify-between border-t border-current/25 pt-2 font-mono text-xs font-bold">
                            <span className={simulatingHover ? 'underline' : 'group-hover:underline'}>
                              Shape a Custom Build
                            </span>
                            <span>→</span>
                          </div>
                        </div>
                      </div>

                      {/* Recorded Playwright Hover Screenshot */}
                      <div className="flex flex-col justify-between border border-[#DFDACE]/20 bg-[#23282A] p-4 space-y-2">
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="font-bold text-[#D9A62E]">Original Recorded Capture (195921a)</span>
                          <span className="text-[#DFDACE]/70">500ms hover</span>
                        </div>
                        <img
                          src="/assets/images/design-intelligence/exp01_after_desktop_hover_build.png"
                          alt="Recorded hover state on Room 02 (Custom Builds) in commit 195921a"
                          className="w-full h-auto block border border-[#DFDACE]/20"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={() => openDetailInspector('desktop', 'hover')}
                          className="text-left font-mono text-xs font-bold text-[#D9A62E] underline hover:text-[#EDE9E0]"
                        >
                          Open Full Capture in Detail Inspector →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. Smoke Suite & Attribution */}
                  <div className="grid gap-6 lg:grid-cols-12 items-start">
                    <div className="lg:col-span-7 space-y-3">
                      <h3 className="font-display text-lg font-bold text-[#EDE9E0]">
                        3. Functional Non-Regression Suite (11 / 11 PASS)
                      </h3>
                      <div className="divide-y divide-[#DFDACE]/10 border border-[#DFDACE]/20 bg-[#23282A]">
                        {SMOKE_CHECKS.map((chk) => (
                          <div key={chk.num} className="p-2.5 sm:px-3.5 flex items-start justify-between gap-3 text-xs">
                            <div>
                              <span className="font-mono font-bold text-[#D9A62E] mr-2">#{chk.num}</span>
                              <span className="font-semibold text-[#EDE9E0]">{chk.name}</span>
                              <p className="text-[#DFDACE]/75 mt-0.5">{chk.covered}</p>
                            </div>
                            <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" />
                              {chk.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5 space-y-4 text-xs">
                      <div className="border border-[#D9A62E] bg-[#23282A] p-4 space-y-2">
                        <div className="flex items-center gap-2 font-mono font-bold text-[#D9A62E]">
                          <Scale className="h-4 w-4" />
                          <span>What Automated Tests Prove—And What They Do Not</span>
                        </div>
                        <p className="text-[#EDE9E0]/90 leading-relaxed">
                          Passing 11/11 smoke checks proves functional non-regression across routing, room transitions,
                          interactive tools, <code className="font-mono">/api/lead/</code> submission, and 390px mobile
                          overflow constraints. Automated checks do <strong>not</strong> prove improved aesthetics, user
                          preference, conversion lift, or design quality.
                        </p>
                      </div>

                      <div className="border border-[#DFDACE]/20 bg-[#23282A] p-4 space-y-2 font-mono">
                        <div className="flex items-center gap-2 font-bold text-[#EDE9E0]">
                          <FileCode2 className="h-4 w-4 text-[#D9A62E]" />
                          <span>Repository Provenance &amp; Dossiers</span>
                        </div>
                        <ul className="space-y-1 text-[#DFDACE]/85">
                          <li>• Baseline: 52e179d (release/candidate-preview)</li>
                          <li>• Experiment 01: 195921a (experiment/design-intelligence-01-locomotive)</li>
                          <li>• Study 01 Dossier: design-intelligence/references/locomotive.md</li>
                          <li>• Study 02 Dossier: design-intelligence/references/linear.md</li>
                          <li>• Study 03 Dossier: design-intelligence/references/stripe.md</li>
                          <li>• Extraction Report: design-intelligence/experiments/token-extraction-study-report.md</li>
                        </ul>
                      </div>

                      <div className="border border-[#DFDACE]/20 bg-[#16191B] p-4 space-y-1.5 text-[#DFDACE]/80">
                        <div className="font-mono font-bold text-[#EDE9E0]">
                          Reference Attribution &amp; Independence Notice
                        </div>
                        <p className="leading-relaxed">
                          <a
                            href="https://locomotive.ca/en"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D9A62E] underline hover:text-[#EDE9E0]"
                          >
                            Locomotive (locomotive.ca)
                          </a>
                          ,{' '}
                          <a
                            href="https://linear.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D9A62E] underline hover:text-[#EDE9E0]"
                          >
                            Linear (linear.app)
                          </a>
                          , and{' '}
                          <a
                            href="https://stripe.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D9A62E] underline hover:text-[#EDE9E0]"
                          >
                            Stripe (stripe.com)
                          </a>{' '}
                          were inspected as independent external references for transferable structural, typographic,
                          and luminance principles. None of these companies are affiliated with, endorsing, or
                          collaborating on ContextMuse, and no proprietary layouts, brand marks, or licensed font
                          binaries were reused.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================
          DETAIL INSPECTOR MODAL
          Houses Desktop, Mobile, Full-Page Mobile, Plumb Guides, Zoom,
          Side-by-Side view, Reference Captures, and Hover Capture
          ============================================================ */}
      {inspectorOpen && (
        <div
          ref={inspectorDialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Full-Image Before and After Detail Inspector"
          className="fixed inset-0 z-50 flex flex-col bg-[#141617]/95 backdrop-blur-md"
        >
          {/* Modal Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFDACE]/20 bg-[#23282A] px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#D9A62E] text-[#141617] px-2 py-0.5 font-mono text-xs font-bold">
                Detail Inspector · {activeStudy.selectorLabel}
              </span>

              {/* Viewport Mode Selector inside Inspector */}
              <div className="inline-flex border border-[#DFDACE]/25 bg-[#1B1F21] p-0.5 font-mono text-xs">
                {(isHomepageCaptureMode ? INSPECTOR_MODES : MAIN_VIEWPORT_MODES).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      handleSelectInspectorMode(m.id);
                      if (inspectorView === 'hover') setInspectorView('side-by-side');
                    }}
                    className={`px-2.5 py-1 transition-colors ${
                      inspectorModeId === m.id && inspectorView !== 'hover'
                        ? 'bg-[#D9A62E] text-[#141617] font-bold'
                        : 'text-[#EDE9E0] hover:text-[#D9A62E]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setInspectorView('side-by-side')}
                className={`px-2.5 py-1 border ${
                  inspectorView === 'side-by-side'
                    ? 'border-[#D9A62E] bg-[#D9A62E] text-[#141617] font-bold'
                    : 'border-[#DFDACE]/25 text-[#EDE9E0]'
                }`}
              >
                Side-by-Side
              </button>
              <button
                type="button"
                onClick={() => setInspectorView('slider')}
                className={`px-2.5 py-1 border ${
                  inspectorView === 'slider'
                    ? 'border-[#D9A62E] bg-[#D9A62E] text-[#141617] font-bold'
                    : 'border-[#DFDACE]/25 text-[#EDE9E0]'
                }`}
              >
                Interactive Slider
              </button>
              <button
                type="button"
                onClick={() => setInspectorView('reference')}
                className={`px-2.5 py-1 border ${
                  inspectorView === 'reference'
                    ? 'border-[#D9A62E] bg-[#D9A62E] text-[#141617] font-bold'
                    : 'border-[#DFDACE]/25 text-[#EDE9E0]'
                }`}
              >
                Reference Capture
              </button>
              <button
                type="button"
                onClick={() => setInspectorView('hover')}
                className={`px-2.5 py-1 border ${
                  inspectorView === 'hover'
                    ? 'border-[#D9A62E] bg-[#D9A62E] text-[#141617] font-bold'
                    : 'border-[#DFDACE]/25 text-[#EDE9E0]'
                }`}
              >
                Hover Capture
              </button>

              {inspectorView === 'slider' && isHomepageCaptureMode && (
                <button
                  type="button"
                  onClick={() => setShowPlumbGuides((v) => !v)}
                  className={`flex items-center gap-1 px-2.5 py-1 border ${
                    showPlumbGuides
                      ? 'border-emerald-400 bg-emerald-950/70 text-emerald-300 font-bold'
                      : 'border-[#DFDACE]/25 text-[#EDE9E0]'
                  }`}
                >
                  <Ruler className="h-3.5 w-3.5" />
                  <span>Plumb Guide</span>
                </button>
              )}

              {inspectorView === 'side-by-side' && (
                <button
                  type="button"
                  onClick={() => setInspectorZoom((z) => (z === 1 ? 1.5 : 1))}
                  className="px-2.5 py-1 border border-[#DFDACE]/25 text-[#EDE9E0] hover:border-[#D9A62E]"
                >
                  Zoom: {inspectorZoom === 1 ? '100%' : '150%'}
                </button>
              )}

              <button
                ref={inspectorCloseBtnRef}
                type="button"
                onClick={closeDetailInspector}
                aria-label="Close full-image inspector"
                className="ml-1 flex items-center gap-1 border border-[#DFDACE]/30 bg-[#1B1F21] px-3 py-1 text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A62E]"
              >
                <X className="h-4 w-4" />
                <span>Close (Esc)</span>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            {inspectorView === 'side-by-side' && (
              <div
                style={{
                  transform: `scale(${inspectorZoom})`,
                  transformOrigin: 'top left',
                }}
                className="mx-auto max-w-[1760px]"
              >
                {isHomepageCaptureMode ? (
                  INSPECTOR_MODES.map((m) => {
                    const isCurrent = m.id === inspectorModeId;
                    return (
                      <div
                        key={m.id}
                        data-inspector-sbs-mode={m.id}
                        className={`${isCurrent ? 'grid' : 'hidden'} gap-6 lg:grid-cols-2 items-start`}
                      >
                        <div className="space-y-2 border border-[#DFDACE]/25 bg-[#1B1F21] p-3">
                          <div className="flex items-center justify-between font-mono text-xs font-bold text-[#EDE9E0]">
                            <span>BEFORE · Baseline 52e179d</span>
                            <span className="text-[#DFDACE]/60">{m.viewportText}</span>
                          </div>
                          <img
                            src={m.beforeSrc}
                            alt={isCurrent ? `Full uncropped BEFORE (${m.fullLabel})` : ''}
                            width={m.naturalWidth}
                            height={m.isFullPageScroll ? 3648 : m.naturalHeight}
                            decoding="sync"
                            className="w-full h-auto block border border-[#DFDACE]/15"
                          />
                        </div>

                        <div className="space-y-2 border border-[#D9A62E]/50 bg-[#1B1F21] p-3">
                          <div className="flex items-center justify-between font-mono text-xs font-bold text-[#D9A62E]">
                            <span>AFTER · Experiment 195921a</span>
                            <span className="text-[#DFDACE]/60">{m.viewportText}</span>
                          </div>
                          <img
                            src={m.afterSrc}
                            alt={isCurrent ? `Full uncropped AFTER (${m.fullLabel})` : ''}
                            width={m.naturalWidth}
                            height={m.naturalHeight}
                            decoding="sync"
                            className="w-full h-auto block border border-[#D9A62E]/25"
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="grid gap-6 lg:grid-cols-2 items-start">
                    <div className="space-y-2 border border-[#DFDACE]/25 bg-[#1B1F21] p-3">
                      <div className="flex items-center justify-between font-mono text-xs font-bold text-[#EDE9E0]">
                        <span>BEFORE · Original Neutral Specimen</span>
                        <span className="text-[#DFDACE]/60">{activeInspectorMode.fullLabel}</span>
                      </div>
                      <div
                        className={`w-full overflow-hidden border border-[#DFDACE]/20 ${
                          inspectorModeId === 'mobile'
                            ? 'mx-auto max-w-[360px] aspect-[390/844]'
                            : 'aspect-[1440/900]'
                        }`}
                      >
                        <DesignSystemSpecimen
                          variant="neutral"
                          viewport={inspectorModeId === 'mobile' ? 'mobile' : 'desktop'}
                          reducedMotion={reducedMotion}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 border border-[#D9A62E]/50 bg-[#1B1F21] p-3">
                      <div className="flex items-center justify-between font-mono text-xs font-bold text-[#D9A62E]">
                        <span>AFTER · {activeStudy.selectorLabel} Tokens Applied</span>
                        <span className="text-[#DFDACE]/60">{activeInspectorMode.fullLabel}</span>
                      </div>
                      <div
                        className={`w-full overflow-hidden border border-[#D9A62E]/30 ${
                          inspectorModeId === 'mobile'
                            ? 'mx-auto max-w-[360px] aspect-[390/844]'
                            : 'aspect-[1440/900]'
                        }`}
                      >
                        <DesignSystemSpecimen
                          variant={activeStudyId}
                          viewport={inspectorModeId === 'mobile' ? 'mobile' : 'desktop'}
                          reducedMotion={reducedMotion}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {inspectorView === 'slider' && (
              <div className="flex flex-col items-center space-y-4">
                {(isHomepageCaptureMode ? INSPECTOR_MODES : MAIN_VIEWPORT_MODES).map((m) => {
                  const isCurrent = m.id === inspectorModeId;
                  return (
                    <div
                      key={m.id}
                      ref={isCurrent ? inspectorStageRef : null}
                      data-inspector-slider-stage={isCurrent ? 'true' : undefined}
                      data-inspector-slider-mode={m.id}
                      onPointerDown={isCurrent ? handleInspectorPointerDown : undefined}
                      onPointerMove={isCurrent ? handleInspectorPointerMove : undefined}
                      onPointerUp={isCurrent ? handleInspectorPointerUp : undefined}
                      onPointerCancel={isCurrent ? handleInspectorPointerUp : undefined}
                      style={{ touchAction: 'pan-y' }}
                      className={`${
                        isCurrent ? 'block' : 'hidden'
                      } relative select-none overflow-hidden border border-[#DFDACE]/25 bg-[#141617] shadow-2xl cursor-ew-resize ${
                        m.id === 'desktop'
                          ? 'w-full max-w-[1200px] aspect-[1440/900]'
                          : m.id === 'mobile'
                          ? 'w-full max-w-[400px] aspect-[390/844]'
                          : 'w-full max-w-[400px]'
                      }`}
                    >
                      {isHomepageCaptureMode ? (
                        <>
                          <img
                            src={m.afterSrc}
                            alt={isCurrent ? `AFTER (${m.fullLabel})` : ''}
                            width={m.naturalWidth}
                            height={m.naturalHeight}
                            decoding="sync"
                            draggable={false}
                            className={
                              m.isFullPageScroll
                                ? 'block w-full h-auto select-none pointer-events-none'
                                : 'absolute inset-0 block w-full h-full object-contain select-none pointer-events-none'
                            }
                          />

                          <div
                            aria-hidden="true"
                            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                            className={`absolute inset-0 pointer-events-none ${
                              m.isFullPageScroll ? 'bg-[#141617] flex flex-col justify-between' : ''
                            }`}
                          >
                            <img
                              src={m.beforeSrc}
                              alt={isCurrent ? `BEFORE (${m.fullLabel})` : ''}
                              width={m.naturalWidth}
                              height={m.isFullPageScroll ? 3648 : m.naturalHeight}
                              decoding="sync"
                              draggable={false}
                              className={
                                m.isFullPageScroll
                                  ? 'block w-full h-auto select-none pointer-events-none'
                                  : 'absolute inset-0 block w-full h-full object-contain select-none pointer-events-none'
                              }
                            />
                            {m.isFullPageScroll && (
                              <div className="border-t border-dashed border-[#DFDACE]/30 bg-[#141617] px-3 py-2 font-mono text-[10px] text-[#DFDACE]/70">
                                Baseline 52e179d ends at 1824px CSS height vs. 1901px After (+77px from vertical rhythm;
                                neither image is stretched).
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="absolute inset-0 pointer-events-none">
                            <DesignSystemSpecimen
                              variant={activeStudyId}
                              viewport={m.id === 'mobile' ? 'mobile' : 'desktop'}
                              reducedMotion={reducedMotion}
                            />
                          </div>
                          <div
                            aria-hidden="true"
                            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                            className="absolute inset-0 pointer-events-none"
                          >
                            <DesignSystemSpecimen
                              variant="neutral"
                              viewport={m.id === 'mobile' ? 'mobile' : 'desktop'}
                              reducedMotion={reducedMotion}
                            />
                          </div>
                        </>
                      )}

                      {showPlumbGuides && isHomepageCaptureMode && (
                        <div className="pointer-events-none absolute inset-0 z-10">
                          <div
                            style={{ left: `${m.plumbLinePct}%` }}
                            className="absolute top-0 bottom-0 border-l-2 border-dashed border-emerald-400/90"
                          >
                            <span className="absolute bottom-10 left-1.5 whitespace-nowrap bg-emerald-950/95 border border-emerald-400 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                              AFTER Plumb: {m.id === 'desktop' ? '40px (0px drift)' : '20px (0px drift)'}
                            </span>
                          </div>
                          {sliderPos > m.beforePlumbHeroPct && (
                            <div
                              style={{ left: `${m.beforePlumbHeroPct}%` }}
                              className="absolute top-0 bottom-0 border-l border-dotted border-rose-400/90"
                            >
                              <span className="absolute bottom-3 left-1.5 whitespace-nowrap bg-rose-950/95 border border-rose-400 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-200">
                                BEFORE Hero: {m.id === 'desktop' ? '48px (+24px)' : '24px (+8px)'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        style={{ left: `${sliderPos}%` }}
                        className="absolute top-0 bottom-0 z-30 -ml-px w-0.5 bg-[#D9A62E]"
                      >
                        <div
                          role="slider"
                          tabIndex={0}
                          aria-orientation="horizontal"
                          aria-label={`Detail Inspector comparison slider (${activeStudy.selectorLabel} — ${m.fullLabel})`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(sliderPos)}
                          aria-valuetext={`${Math.round(sliderPos)}% Before, ${Math.round(100 - sliderPos)}% After`}
                          onKeyDown={handleSliderKeyDown}
                          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center border-2 border-[#141617] bg-[#D9A62E] text-[#141617] shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE9E0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141617]"
                        >
                          <MoveHorizontal className="h-4 w-4 stroke-[2.5]" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {inspectorView === 'reference' && (
              <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-12 items-start">
                <div className="lg:col-span-8 space-y-2 border border-[#D9A62E]/50 bg-[#1B1F21] p-4">
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-[#D9A62E]">
                    <span>DESKTOP REFERENCE CAPTURE · {activeStudy.sourceDomain} (1440×900 @ 2x DPR)</span>
                    <span>{activeStudy.inspectedAt}</span>
                  </div>
                  <img
                    src={activeStudy.referenceCaptures.desktop}
                    alt={`${activeStudy.shortName} desktop above-the-fold reference capture`}
                    className="w-full h-auto block border border-[#DFDACE]/20"
                  />
                </div>
                <div className="lg:col-span-4 space-y-2 border border-[#DFDACE]/25 bg-[#1B1F21] p-4">
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-[#EDE9E0]">
                    <span>MOBILE REFERENCE (390×844)</span>
                    <span>2x DPR</span>
                  </div>
                  <img
                    src={activeStudy.referenceCaptures.mobile}
                    alt={`${activeStudy.shortName} mobile above-the-fold reference capture`}
                    className="w-full h-auto block border border-[#DFDACE]/20"
                  />
                </div>
              </div>
            )}

            {inspectorView === 'hover' && (
              <div className="mx-auto max-w-5xl space-y-3 border border-[#D9A62E]/50 bg-[#1B1F21] p-4">
                <div className="flex items-center justify-between font-mono text-xs font-bold text-[#D9A62E]">
                  <span>RECORDED HOVER STATE · Room 02 Custom Builds (Commit 195921a)</span>
                  <span>exp01_after_desktop_hover_build.png (1440×900 @ 2x DPR)</span>
                </div>
                <img
                  src="/assets/images/design-intelligence/exp01_after_desktop_hover_build.png"
                  alt="Full uncropped hover capture on Room 02 (Custom Builds)"
                  className="w-full h-auto block border border-[#DFDACE]/20"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
