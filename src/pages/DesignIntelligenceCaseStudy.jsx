import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import PageAnnotationOverlay from '@/components/site/PageAnnotationOverlay';
import { useBrief } from '@/lib/BriefContext';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Columns,
  Eye,
  FileCode2,
  Layers,
  Maximize2,
  Minimize2,
  Monitor,
  MoveHorizontal,
  Play,
  Ruler,
  Scale,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';

const VIEWPORT_MODES = [
  {
    id: 'desktop',
    label: 'Desktop (1440 × 900)',
    shortLabel: 'Desktop 1440×900',
    icon: Monitor,
    beforeSrc: '/assets/images/design-intelligence/exp01_before_desktop.png',
    afterSrc: '/assets/images/design-intelligence/exp01_after_desktop.png',
    viewportText: '1440 × 900 px (16:10 aspect ratio)',
    aspectClass: 'aspect-[1440/900]',
    isFullPageScroll: false,
    plumbLinePct: (40 / 1440) * 100, // 2.777%
    beforePlumbHeroPct: (48 / 1440) * 100, // 3.333%
    beforePlumbHeaderPct: (24 / 1440) * 100, // 1.667%
    caption:
      'Captured at identical 1440×900 CSS viewport dimensions. Drag the handle or use Arrow Left/Right keys to inspect the 40px left plumb line, zero-radius CTAs, 2px room overlines, and Room 02 on-palette Quoting chip.',
  },
  {
    id: 'mobile',
    label: 'Mobile Above-Fold (390 × 844)',
    shortLabel: 'Mobile 390×844',
    icon: Smartphone,
    beforeSrc: '/assets/images/design-intelligence/exp01_before_mobile.png',
    afterSrc: '/assets/images/design-intelligence/exp01_after_mobile.png',
    viewportText: '390 × 844 px (iPhone 14/15 viewport)',
    aspectClass: 'aspect-[390/844]',
    isFullPageScroll: false,
    plumbLinePct: (20 / 390) * 100, // 5.128%
    beforePlumbHeroPct: (24 / 390) * 100,
    beforePlumbHeaderPct: (16 / 390) * 100,
    caption:
      'Captured at identical 390×844 CSS viewport dimensions. Notice the unified 20px left plumb line across header, headline, and full-width zero-radius CTAs with right-aligned directional arrows.',
  },
  {
    id: 'mobile-full',
    label: 'Mobile Full-Page (390 × 1824 / 1901)',
    shortLabel: 'Mobile Full Scroll',
    icon: Columns,
    beforeSrc: '/assets/images/design-intelligence/exp01_before_mobile_full.png',
    afterSrc: '/assets/images/design-intelligence/exp01_after_mobile_full.png',
    viewportText: '390px width · Full vertical document (1824px Before / 1901px After)',
    aspectClass: '',
    isFullPageScroll: true,
    plumbLinePct: (20 / 390) * 100,
    beforePlumbHeroPct: (24 / 390) * 100,
    beforePlumbHeaderPct: (16 / 390) * 100,
    caption:
      'Unscaled top-anchored full-page mobile comparison. Because vertical spacing and border weights changed in Experiment 01, total document height increased by +77px (1824px → 1901px); both captures are anchored at y=0 without vertical stretching.',
  },
];

const FOCUS_CALLOUTS = [
  {
    id: 'all',
    label: '50 / 50 Split Overview',
    sliderPos: 50,
    mode: 'desktop',
    showPlumb: false,
    description: 'Balanced 50% split comparing Baseline (52e179d) on the left and Experiment 01 (195921a) on the right.',
  },
  {
    id: 'plumb',
    label: '01 / Left Plumb Line (24px → 0px Variance)',
    sliderPos: 12,
    mode: 'desktop',
    showPlumb: true,
    description:
      'Enabling the 40px Plumb Guide reveals how the header logo (24px), hero headline/CTAs (48px), and footer (24px) previously stepped in and out by 24px. In 195921a, all four anchor cleanly at x = 40px.',
  },
  {
    id: 'cta',
    label: '02 / Zero-Radius CTAs & Overlines',
    sliderPos: 36,
    mode: 'desktop',
    showPlumb: false,
    description:
      'Compare the Hero CTAs and 01 / INSPECT divider: 4px rounded buttons with drop shadows were replaced by 0px border-2 architectural framing and 2px room overlines.',
  },
  {
    id: 'chip',
    label: '03 / Room 02 Quoting Chip (Off-Palette Red → Mustard)',
    sliderPos: 82,
    mode: 'desktop',
    showPlumb: false,
    description:
      'In Room 02 (Custom Builds, top-right quadrant), slide across "02 Quoting" to see the off-palette Tailwind red badge (bg-red-100 text-red-900) replaced by ContextMuse #D9A62E mustard and #23282A ink.',
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

export default function DesignIntelligenceCaseStudy() {
  const { openBrief, updateInquiry } = useBrief();
  const [viewportModeId, setViewportModeId] = useState('desktop');
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100 (% of BEFORE image visible from left)
  const [activeCallout, setActiveCallout] = useState('all');
  const [showPlumbGuides, setShowPlumbGuides] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorView, setInspectorView] = useState('side-by-side'); // 'side-by-side' | 'slider' | 'hover'
  const [inspectorZoom, setInspectorZoom] = useState(1);
  const [simulatingHover, setSimulatingHover] = useState(false);

  const sliderContainerRef = useRef(null);
  const isDraggingRef = useRef(false);

  const activeMode = VIEWPORT_MODES.find((m) => m.id === viewportModeId) || VIEWPORT_MODES[0];

  const updatePositionFromClientX = useCallback((clientX) => {
    const el = sliderContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const rawPct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, rawPct));
    setSliderPos(clamped);
  }, []);

  const handlePointerDown = (e) => {
    // Allow left-click or touch/pen
    if (e.button !== undefined && e.button !== 0) return;
    isDraggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updatePositionFromClientX(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    updatePositionFromClientX(e.clientX);
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const handleSliderKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPos((prev) => Math.max(0, prev - step));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPos((prev) => Math.min(100, prev + step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPos(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPos(100);
    }
  };

  // Close full-resolution modal on Escape
  useEffect(() => {
    if (!inspectorOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setInspectorOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inspectorOpen]);

  const applyCallout = (callout) => {
    setActiveCallout(callout.id);
    setViewportModeId(callout.mode);
    setSliderPos(callout.sliderPos);
    setShowPlumbGuides(callout.showPlumb);
  };

  const handleInquireAboutDesignSystem = () => {
    updateInquiry({
      projectType: 'Brand & Design',
      notes:
        'Interested in ContextMuse Design Intelligence & UI/Design-System refinement (reviewed the Locomotive → ContextMuse Experiment 01 case study).',
    });
    openBrief();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1B1F21] text-[#EDE9E0] font-sans selection:bg-[#D9A62E] selection:text-[#141617]">
      <SiteHeader />
      <PageAnnotationOverlay />

      <main className="flex-1">
        {/* ============================================================
            HERO / CASE STUDY HEADER (UNDERSTANDABLE IN < 2 MINUTES)
            ============================================================ */}
        <section className="border-b border-[#DFDACE]/15 bg-[#23282A] px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Breadcrumb & Early Experiment Classification */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <Link
                  to="/lab"
                  className="inline-flex items-center gap-1.5 text-[#DFDACE]/75 hover:text-[#D9A62E] transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>03 / THE LAB</span>
                </Link>
                <span className="text-[#DFDACE]/35">/</span>
                <span className="rounded-none bg-[#D9A62E] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#141617]">
                  Early R&amp;D Experiment · Not a Commercial Product
                </span>
                <span className="rounded-none border border-[#DFDACE]/25 bg-[#1B1F21] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#EDE9E0]">
                  Experiment 01 of Design Intelligence Library
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#DFDACE]/75">
                <span className="border border-[#DFDACE]/20 bg-[#1B1F21] px-2.5 py-1">
                  Baseline Commit: <strong className="text-[#EDE9E0]">52e179d</strong>
                </span>
                <span className="border border-[#D9A62E]/45 bg-[#1B1F21] px-2.5 py-1">
                  Experiment Commit: <strong className="text-[#D9A62E]">195921a</strong>
                </span>
              </div>
            </div>

            {/* Title & Executive Summary */}
            <div className="grid gap-8 lg:grid-cols-12 items-end">
              <div className="lg:col-span-8 space-y-4">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#D9A62E]">
                  DESIGN INTELLIGENCE CASE STUDY · REFERENCE EXTRACTION &amp; CONTROLLED REFINEMENT
                </p>
                <h1 className="font-display text-3xl sm:text-5xl font-black uppercase leading-[1.02] tracking-[-0.02em] text-[#EDE9E0]">
                  Translating Measured Design Tokens Into Structural Polish.
                </h1>
                <p className="max-w-3xl text-sm sm:text-base text-[#DFDACE]/90 leading-relaxed">
                  Can a web product study an award-winning reference site for transferable structural and motion
                  principles—without copying its aesthetic, layout, or branding? In this controlled experiment on the
                  ContextMuse four-room entrance, we extracted computed grid, typography, and easing tokens from{' '}
                  <strong className="text-[#EDE9E0]">Locomotive (locomotive.ca/en)</strong> and tested three targeted
                  refinements on an isolated Git branch (<code className="font-mono text-[#D9A62E]">195921a</code>)
                  against our production candidate baseline (<code className="font-mono text-[#EDE9E0]">52e179d</code>).
                </p>
              </div>

              {/* 2-Minute Executive Scorecard */}
              <div className="lg:col-span-4 border-2 border-[#DFDACE]/20 bg-[#1B1F21] p-4 sm:p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#DFDACE]/15 pb-2">
                  <span className="text-[#D9A62E] font-bold uppercase tracking-wider">
                    Verified Experiment Summary
                  </span>
                  <span className="text-[10px] text-[#DFDACE]/60">2-Min Read</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] uppercase text-[#DFDACE]/60">Desktop Plumb Drift</div>
                    <div className="text-base font-bold text-[#EDE9E0]">24px → 0px</div>
                    <div className="text-[10px] text-emerald-400">All 4 anchors at x=40px</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-[#DFDACE]/60">Mobile Plumb Drift</div>
                    <div className="text-base font-bold text-[#EDE9E0]">8px → 0px</div>
                    <div className="text-[10px] text-emerald-400">All 4 anchors at x=20px</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-[#DFDACE]/60">Asymmetric Easing</div>
                    <div className="text-base font-bold text-[#EDE9E0]">450ms / 200ms</div>
                    <div className="text-[10px] text-[#D9A62E]">Ease-Out Quint (no washout)</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-[#DFDACE]/60">Functional Smoke</div>
                    <div className="text-base font-bold text-[#EDE9E0]">11 / 11 PASS</div>
                    <div className="text-[10px] text-[#DFDACE]/70">Non-regression verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 01: INTERACTIVE BEFORE / AFTER IMAGE SLIDER
            ============================================================ */}
        <section
          id="interactive-comparison"
          className="border-b border-[#DFDACE]/15 bg-[#1B1F21] px-5 py-10 sm:px-8 sm:py-14 lg:px-10"
        >
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Section Title & Controls Bar */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#DFDACE]/15 pb-5">
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#D9A62E]">
                  01 / GENUINE VISUAL EVIDENCE (BASELINE 52e179d VS. EXPERIMENT 195921a)
                </div>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#EDE9E0]">
                  Interactive Before &amp; After Viewport Comparison
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#DFDACE]/80 max-w-2xl">
                  Drag the comparison divider with mouse or touch, or focus the handle and press{' '}
                  <kbd className="border border-[#DFDACE]/30 bg-[#23282A] px-1.5 py-0.5 font-mono text-[11px]">←</kbd>{' '}
                  /{' '}
                  <kbd className="border border-[#DFDACE]/30 bg-[#23282A] px-1.5 py-0.5 font-mono text-[11px]">→</kbd>{' '}
                  (<kbd className="border border-[#DFDACE]/30 bg-[#23282A] px-1.5 py-0.5 font-mono text-[11px]">Shift</kbd>{' '}
                  for 10% steps). Zero cropping or artificial post-processing applied.
                </p>
              </div>

              {/* Viewport Mode Switcher & Full-Res Inspector Button */}
              <div className="flex flex-wrap items-center gap-2">
                <div
                  role="group"
                  aria-label="Viewport comparison mode"
                  className="inline-flex flex-wrap border border-[#DFDACE]/25 bg-[#23282A] p-1"
                >
                  {VIEWPORT_MODES.map((m) => {
                    const Icon = m.icon;
                    const active = m.id === viewportModeId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setViewportModeId(m.id)}
                        aria-pressed={active}
                        className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                          active
                            ? 'bg-[#D9A62E] text-[#141617]'
                            : 'text-[#EDE9E0] hover:text-[#D9A62E]'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{m.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setShowPlumbGuides((v) => !v)}
                  aria-pressed={showPlumbGuides}
                  className={`flex items-center gap-1.5 border px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                    showPlumbGuides
                      ? 'border-emerald-400 bg-emerald-950/60 text-emerald-300'
                      : 'border-[#DFDACE]/25 bg-[#23282A] text-[#EDE9E0] hover:border-[#D9A62E]'
                  }`}
                >
                  <Ruler className="h-3.5 w-3.5" />
                  <span>{showPlumbGuides ? 'Plumb Guide: ON' : 'Plumb Guide: OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectorOpen(true)}
                  className="flex items-center gap-1.5 border-2 border-[#D9A62E] bg-[#23282A] px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E] hover:bg-[#D9A62E] hover:text-[#141617] transition-colors"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Full-Image Detail Inspector</span>
                </button>
              </div>
            </div>

            {/* Guided Inspection Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {FOCUS_CALLOUTS.map((callout) => {
                const isSelected = activeCallout === callout.id && viewportModeId === callout.mode;
                return (
                  <button
                    key={callout.id}
                    type="button"
                    onClick={() => applyCallout(callout)}
                    className={`text-left p-3 border transition-colors ${
                      isSelected
                        ? 'border-[#D9A62E] bg-[#23282A] text-[#EDE9E0]'
                        : 'border-[#DFDACE]/15 bg-[#23282A]/50 text-[#DFDACE]/80 hover:border-[#DFDACE]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px] font-bold uppercase text-[#D9A62E]">
                      <span>{callout.label}</span>
                      <span>{callout.sliderPos}%</span>
                    </div>
                    <p className="mt-1 text-xs leading-snug text-[#DFDACE]/85">{callout.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Quick Slider Position Bar & Readout */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#23282A] border border-[#DFDACE]/15 px-4 py-2.5 font-mono text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[#1B1F21] border border-[#DFDACE]/30 px-2.5 py-1 text-[#EDE9E0] font-bold">
                  <span className="h-2 w-2 rounded-full bg-[#DFDACE]" />
                  LEFT: BEFORE (Baseline 52e179d) · {Math.round(sliderPos)}%
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#1B1F21] border border-[#D9A62E]/50 px-2.5 py-1 text-[#D9A62E] font-bold">
                  <span className="h-2 w-2 rounded-full bg-[#D9A62E]" />
                  RIGHT: AFTER (Experiment 195921a) · {Math.round(100 - sliderPos)}%
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[#DFDACE]/60 mr-1 hidden sm:inline">Quick Split:</span>
                {[
                  { label: 'All After (0%)', pos: 0 },
                  { label: '25%', pos: 25 },
                  { label: '50 / 50', pos: 50 },
                  { label: '75%', pos: 75 },
                  { label: 'All Before (100%)', pos: 100 },
                ].map((preset) => (
                  <button
                    key={preset.pos}
                    type="button"
                    onClick={() => setSliderPos(preset.pos)}
                    className={`px-2 py-1 text-[11px] uppercase border transition-colors ${
                      Math.round(sliderPos) === preset.pos
                        ? 'border-[#D9A62E] bg-[#D9A62E] text-[#141617] font-bold'
                        : 'border-[#DFDACE]/20 bg-[#1B1F21] text-[#DFDACE]/80 hover:border-[#D9A62E]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* THE DRAGGABLE BEFORE / AFTER STAGE */}
            <div className="flex justify-center bg-[#141617] border-2 border-[#DFDACE]/20 p-3 sm:p-6 overflow-hidden">
              <div
                ref={sliderContainerRef}
                data-slider-stage="true"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{ touchAction: 'pan-y' }}
                className={`relative select-none overflow-hidden border border-[#DFDACE]/25 shadow-2xl cursor-ew-resize ${
                  activeMode.id === 'desktop'
                    ? 'w-full max-w-[1280px] aspect-[1440/900]'
                    : activeMode.id === 'mobile'
                    ? 'w-full max-w-[420px] aspect-[390/844]'
                    : 'w-full max-w-[420px]'
                }`}
              >
                {/* LAYER 1 (BASE): AFTER IMAGE (Experiment 195921a) */}
                <img
                  src={activeMode.afterSrc}
                  alt={`AFTER (Experiment 195921a) — ${activeMode.label}`}
                  draggable={false}
                  className={
                    activeMode.isFullPageScroll
                      ? 'block w-full h-auto select-none pointer-events-none'
                      : 'block w-full h-full object-fill select-none pointer-events-none'
                  }
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
                    src={activeMode.beforeSrc}
                    alt={`BEFORE (Baseline 52e179d) — ${activeMode.label}`}
                    draggable={false}
                    className={
                      activeMode.isFullPageScroll
                        ? 'block w-full h-auto select-none pointer-events-none'
                        : 'block w-full h-full object-fill select-none pointer-events-none'
                    }
                  />
                </div>

                {/* OPTIONAL MEASURED PLUMB-LINE GUIDES */}
                {showPlumbGuides && (
                  <div className="pointer-events-none absolute inset-0 z-10">
                    {/* After Unified Plumb Line (x = 40px desktop / 20px mobile) */}
                    <div
                      style={{ left: `${activeMode.plumbLinePct}%` }}
                      className="absolute top-0 bottom-0 border-l-2 border-dashed border-emerald-400/90"
                    >
                      <span className="absolute bottom-10 left-1.5 whitespace-nowrap bg-emerald-950/95 border border-emerald-400 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                        AFTER Plumb: {activeMode.id === 'desktop' ? '40px (0px drift)' : '20px (0px drift)'}
                      </span>
                    </div>

                    {/* Before Hero Drift Line (x = 48px desktop / 24px mobile) */}
                    {sliderPos > activeMode.beforePlumbHeroPct && (
                      <div
                        style={{ left: `${activeMode.beforePlumbHeroPct}%` }}
                        className="absolute top-0 bottom-0 border-l border-dotted border-rose-400/90"
                      >
                        <span className="absolute bottom-3 left-1.5 whitespace-nowrap bg-rose-950/95 border border-rose-400 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-200">
                          BEFORE Hero: {activeMode.id === 'desktop' ? '48px (+24px step)' : '24px (+8px step)'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* PERSISTENT TOP-LEFT "BEFORE" AND TOP-RIGHT "AFTER" BADGES */}
                <div className="pointer-events-none absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[#141617]/90 backdrop-blur-sm border border-[#DFDACE]/40 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#EDE9E0] shadow-md">
                  <span className="h-2 w-2 rounded-full bg-[#DFDACE]" />
                  <span>BEFORE · 52e179d</span>
                </div>

                <div className="pointer-events-none absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-[#141617]/90 backdrop-blur-sm border border-[#D9A62E] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#D9A62E] shadow-md">
                  <span className="h-2 w-2 rounded-full bg-[#D9A62E]" />
                  <span>AFTER · 195921a</span>
                </div>

                {/* ACCESSIBLE SLIDER DIVIDER & FOCUSABLE HANDLE */}
                <div
                  style={{ left: `${sliderPos}%` }}
                  className="absolute top-0 bottom-0 z-30 -ml-px w-0.5 bg-[#D9A62E] shadow-[0_0_12px_rgba(0,0,0,0.9)]"
                >
                  <div
                    role="slider"
                    tabIndex={0}
                    aria-label={`Before and after comparison slider (${activeMode.label})`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(sliderPos)}
                    aria-valuetext={`${Math.round(sliderPos)}% Before (Baseline 52e179d), ${Math.round(
                      100 - sliderPos
                    )}% After (Experiment 195921a)`}
                    onKeyDown={handleSliderKeyDown}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center border-2 border-[#141617] bg-[#D9A62E] text-[#141617] shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#EDE9E0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141617] transition-transform hover:scale-105"
                  >
                    <MoveHorizontal className="h-5 w-5 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Viewport Caption & Technical Provenance Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#DFDACE]/75 bg-[#23282A]/70 border border-[#DFDACE]/15 px-4 py-3">
              <div>
                <strong className="text-[#D9A62E]">Active Capture:</strong> {activeMode.viewportText} —{' '}
                {activeMode.caption}
              </div>
              <button
                type="button"
                onClick={() => setInspectorOpen(true)}
                className="shrink-0 underline text-[#D9A62E] hover:text-[#EDE9E0] font-bold"
              >
                Inspect 1:1 Unscaled Side-by-Side →
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 02: THE THREE PRINCIPAL REFINEMENTS
            (MEASURED FACTS VS. SUBJECTIVE DESIGN JUDGMENTS)
            ============================================================ */}
        <section
          id="three-refinements"
          className="border-b border-[#DFDACE]/15 bg-[#EDE9E0] text-[#23282A] px-5 py-12 sm:px-8 sm:py-16 lg:px-10"
        >
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="border-b-2 border-[#23282A]/20 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#17504A]">
                  02 / CONTROLLED INTERVENTION &amp; EPISTEMIC SEPARATION
                </div>
                <h2 className="mt-1 font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#23282A]">
                  Three Principal Refinements: Measured Facts vs. Design Judgments
                </h2>
              </div>
              <p className="font-mono text-xs text-[#23282A]/75 max-w-md">
                Rigorous design evaluation separates what can be objectively measured in the DOM from what remains an
                editorial or aesthetic judgment.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* REFINEMENT 1: STRUCTURAL ALIGNMENT */}
              <article className="flex flex-col justify-between border-2 border-[#23282A] bg-[#DFDACE]/60 p-6 shadow-[4px_4px_0_rgba(35,40,42,0.12)]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#23282A]/20 pb-3 font-mono text-xs">
                    <span className="font-bold uppercase tracking-wider text-[#17504A]">Refinement 01</span>
                    <span className="bg-[#23282A] text-[#EDE9E0] px-2 py-0.5 text-[10px] font-bold">
                      24px → 0px Variance
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-[#23282A]">
                    Structural Alignment &amp; Plumb Line
                  </h3>

                  <p className="text-sm leading-relaxed text-[#23282A]/90">
                    Standardized outer horizontal padding across <code className="font-mono text-xs">SiteHeader</code>,{' '}
                    <code className="font-mono text-xs">HeroPanel</code>, and{' '}
                    <code className="font-mono text-xs">SiteFooter</code> (<code className="font-mono text-xs">px-5 sm:px-8 lg:px-10</code>)
                    and unified the primary/secondary hero CTAs to <code className="font-mono text-xs">0px</code> corner
                    radius (<code className="font-mono text-xs">rounded-none border-2</code>).
                  </p>

                  {/* Measured Facts Box */}
                  <div className="border-l-4 border-[#17504A] bg-[#EDE9E0] p-3.5 space-y-1.5 text-xs">
                    <div className="font-mono font-bold uppercase tracking-wider text-[#17504A]">
                      Measured Facts (getBoundingClientRect)
                    </div>
                    <ul className="space-y-1 font-mono text-[11.5px] text-[#23282A]/90">
                      <li>
                        • <strong>Desktop (1440×900) Before:</strong> Logo <code className="font-bold">x=24px</code>, Hero H1{' '}
                        <code className="font-bold">x=48px</code>, Primary CTA <code className="font-bold">x=48px</code>, Footer{' '}
                        <code className="font-bold">x=24px</code> (<strong>24px horizontal variance</strong>).
                      </li>
                      <li>
                        • <strong>Desktop (1440×900) After:</strong> Logo, Hero H1, Primary CTA, and Footer all at{' '}
                        <code className="font-bold">x=40px</code> (<strong>0px variance</strong>).
                      </li>
                      <li>
                        • <strong>Mobile (390×844):</strong> Variance reduced from <strong>8px</strong> (<code className="font-bold">16px</code> vs{' '}
                        <code className="font-bold">24px</code>) to <strong>0px</strong> (all at <code className="font-bold">x=20px</code>).
                      </li>
                      <li>
                        • <strong>CTA Geometry:</strong> Computed <code className="font-bold">borderRadius</code> changed from{' '}
                        <code className="font-bold">4px</code> to <code className="font-bold">0px</code>.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Subjective Judgment Box */}
                <div className="mt-4 border-t border-[#23282A]/20 pt-3.5 text-xs text-[#23282A]/80">
                  <span className="font-mono font-bold uppercase tracking-wider text-[#23282A] block mb-1">
                    Subjective Design Judgment:
                  </span>
                  Eliminating the 24px indent step and matching the 0px CTA corners to the 2×2 room quadrant grid makes
                  the left viewport column read as a single architectural frame rather than floating elements.
                </div>
              </article>

              {/* REFINEMENT 2: TYPOGRAPHY & COMPONENT CONSISTENCY */}
              <article className="flex flex-col justify-between border-2 border-[#23282A] bg-[#DFDACE]/60 p-6 shadow-[4px_4px_0_rgba(35,40,42,0.12)]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#23282A]/20 pb-3 font-mono text-xs">
                    <span className="font-bold uppercase tracking-wider text-[#17504A]">Refinement 02</span>
                    <span className="bg-[#23282A] text-[#EDE9E0] px-2 py-0.5 text-[10px] font-bold">
                      Palette &amp; Scale Parity
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-[#23282A]">
                    Typography &amp; Component Consistency
                  </h3>

                  <p className="text-sm leading-relaxed text-[#23282A]/90">
                    Replaced fixed-breakpoint room heading jumps with fluid scaling, upgraded room blurbs and overlines,
                    corrected the off-palette Room 02 quoting chip, and self-corrected two experimental rules that hurt
                    mobile line wrapping.
                  </p>

                  {/* Measured Facts Box */}
                  <div className="border-l-4 border-[#17504A] bg-[#EDE9E0] p-3.5 space-y-1.5 text-xs">
                    <div className="font-mono font-bold uppercase tracking-wider text-[#17504A]">
                      Measured Facts (getComputedStyle)
                    </div>
                    <ul className="space-y-1 font-mono text-[11.5px] text-[#23282A]/90">
                      <li>
                        • <strong>Room Headings:</strong> Fluid <code className="font-bold">clamp(1.65rem, 2.15vw, 2.125rem)</code>{' '}
                        (<code className="font-bold">30.96px</code> / <code className="font-bold">31.58px</code> line-height at 1440px, ratio <code className="font-bold">1.02</code>).
                      </li>
                      <li>
                        • <strong>Room Blurbs:</strong> Increased from <code className="font-bold">12px</code> (<code className="font-bold">opacity: 0.85</code>) to{' '}
                        <code className="font-bold">13px</code> / <code className="font-bold">17.55px</code> (<code className="font-bold">1.35</code> ratio, <code className="font-bold">opacity: 0.90</code>).
                      </li>
                      <li>
                        • <strong>Off-Palette Chip Fixed:</strong> Room 02 <code className="font-bold">02 Quoting</code> changed from Tailwind red (<code className="font-bold">bg-red-100/90 text-red-900</code>) to ContextMuse <code className="font-bold">#D9A62E</code> / <code className="font-bold">#23282A</code>.
                      </li>
                      <li>
                        • <strong>Documented Reversion:</strong> Reverted a <code className="font-bold">48ch</code> hero measure that caused a 3-line orphan (<code className="font-bold">&quot;realized.&quot;</code>) on 390px mobile.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Subjective Judgment Box */}
                <div className="mt-4 border-t border-[#23282A]/20 pt-3.5 text-xs text-[#23282A]/80">
                  <span className="font-mono font-bold uppercase tracking-wider text-[#23282A] block mb-1">
                    Subjective Design Judgment:
                  </span>
                  Bringing the <code className="font-mono">02 Quoting</code> chip into the core mustard/charcoal palette
                  and strengthening room overlines from <code className="font-mono">1px</code> to{' '}
                  <code className="font-mono">2px</code> reduces visual noise across the four quadrants.
                </div>
              </article>

              {/* REFINEMENT 3: INTERACTION BEHAVIOR */}
              <article className="flex flex-col justify-between border-2 border-[#23282A] bg-[#DFDACE]/60 p-6 shadow-[4px_4px_0_rgba(35,40,42,0.12)]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#23282A]/20 pb-3 font-mono text-xs">
                    <span className="font-bold uppercase tracking-wider text-[#17504A]">Refinement 03</span>
                    <span className="bg-[#23282A] text-[#EDE9E0] px-2 py-0.5 text-[10px] font-bold">
                      450ms Enter / 200ms Leave
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-[#23282A]">
                    Interaction Behavior &amp; Surface Fidelity
                  </h3>

                  <p className="text-sm leading-relaxed text-[#23282A]/90">
                    Removed <code className="font-mono text-xs">hover:brightness-105</code> filter washout on room
                    quadrants, implemented asymmetric Ease-Out Quint timing, and connected tile hover state directly to
                    internal room motifs and cues.
                  </p>

                  {/* Measured Facts Box */}
                  <div className="border-l-4 border-[#17504A] bg-[#EDE9E0] p-3.5 space-y-1.5 text-xs">
                    <div className="font-mono font-bold uppercase tracking-wider text-[#17504A]">
                      Measured Facts (CSS Custom Properties &amp; DOM)
                    </div>
                    <ul className="space-y-1 font-mono text-[11.5px] text-[#23282A]/90">
                      <li>
                        • <strong>Surface Filter:</strong> Computed <code className="font-bold">filter: none</code> on hover (previously{' '}
                        <code className="font-bold">brightness(1.05)</code> across entire tile).
                      </li>
                      <li>
                        • <strong>Easing Curve:</strong> <code className="font-bold">cubic-bezier(0.23, 1, 0.32, 1)</code> (Ease-Out Quint).
                      </li>
                      <li>
                        • <strong>Asymmetric Timing:</strong> Hover entry duration <code className="font-bold">450ms</code> (<code className="font-bold">--duration-enter</code>) vs. hover release <code className="font-bold">200ms</code> (<code className="font-bold">--duration-leave</code>).
                      </li>
                      <li>
                        • <strong>Bottom Rule:</strong> Increased from <code className="font-bold">2px</code> (<code className="font-bold">opacity: 0.60</code>) to <code className="font-bold">3px</code> (<code className="font-bold">opacity: 0.85</code>) with <code className="font-bold">2px</code> cue underline.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Subjective Judgment Box */}
                <div className="mt-4 border-t border-[#23282A]/20 pt-3.5 text-xs text-[#23282A]/80">
                  <span className="font-mono font-bold uppercase tracking-wider text-[#23282A] block mb-1">
                    Subjective Design Judgment:
                  </span>
                  Preserving exact pigment saturation on hover while animating internal structural motifs with a slower
                  entry (450ms) and crisp release (200ms) feels more deliberate than brightening the whole tile.
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 03: SEPARATELY LABELED INTERACTIVE HOVER COMPARISON
            (BECAUSE STATIC SLIDERS CANNOT DEMONSTRATE MOTION TIMING)
            ============================================================ */}
        <section
          id="hover-motion-comparison"
          className="border-b border-[#DFDACE]/15 bg-[#23282A] px-5 py-12 sm:px-8 sm:py-16 lg:px-10"
        >
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#DFDACE]/15 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#D9A62E]/20 border border-[#D9A62E] px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#D9A62E]">
                  <Play className="h-3 w-3" />
                  <span>SEPARATELY LABELED INTERACTIVE HOVER COMPARISON · LIVE DOM &amp; CSS</span>
                </div>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#EDE9E0]">
                  Why Static Sliders Aren’t Enough: Live Hover &amp; Timing Sandbox
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#DFDACE]/80 max-w-3xl">
                  A static screenshot slider cannot convey <code className="font-mono text-[#D9A62E]">450ms</code>{' '}
                  quintic entry vs. <code className="font-mono text-[#D9A62E]">200ms</code> release timing. Hover directly
                  over the two live <strong className="text-[#EDE9E0]">Room 02 (Custom Builds)</strong> tiles below—or
                  click <strong>&ldquo;Simulate Hover State&rdquo;</strong> on touch devices—to compare actual runtime
                  behavior alongside the captured hover screenshot.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSimulatingHover((v) => !v)}
                aria-pressed={simulatingHover}
                className={`shrink-0 flex items-center gap-2 border-2 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                  simulatingHover
                    ? 'border-[#D9A62E] bg-[#D9A62E] text-[#141617]'
                    : 'border-[#D9A62E] bg-[#1B1F21] text-[#D9A62E] hover:bg-[#D9A62E] hover:text-[#141617]'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>{simulatingHover ? 'Release Simulated Hover' : 'Simulate Simultaneous Hover'}</span>
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-12 items-stretch">
              {/* LIVE TILE A: BASELINE (52e179d) HOVER BEHAVIOR */}
              <div className="lg:col-span-4 flex flex-col space-y-2">
                <div className="flex items-center justify-between font-mono text-xs text-[#DFDACE]/75">
                  <span className="font-bold uppercase text-[#EDE9E0]">Live Tile A · Baseline (52e179d)</span>
                  <span>300ms uniform · brightness(1.05)</span>
                </div>

                <div
                  className={`group relative flex flex-1 flex-col justify-between p-6 bg-[#DFDACE] text-[#23282A] transition-all duration-300 select-none cursor-pointer ${
                    simulatingHover ? 'brightness-105' : 'hover:brightness-105'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-current/20 pb-2.5 font-mono text-xs">
                      <span className="font-bold tracking-widest uppercase">02 / ASSEMBLE</span>
                      <ArrowUpRight
                        className={`h-4 w-4 transition-transform duration-300 ${
                          simulatingHover
                            ? 'translate-x-0.5 -translate-y-0.5 opacity-100'
                            : 'opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none">
                        Custom Builds
                      </h3>
                      <p className="mt-2 text-xs opacity-85 font-sans leading-snug">
                        See what I can create for your business—from custom websites and quoting engines to internal
                        tools built around how you work.
                      </p>
                    </div>
                  </div>

                  {/* Baseline Motif with off-palette red chip */}
                  <div className="my-5 pt-2">
                    <div className="space-y-1.5 font-mono text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-white/80 text-[#23282A] font-bold border border-[#23282A]/20">
                          01 Website
                        </span>
                        <span className="opacity-50">→</span>
                        <span className="px-2 py-0.5 rounded bg-red-100/90 text-red-900 font-bold border border-red-300">
                          02 Quoting
                        </span>
                        <span className="opacity-50">→</span>
                        <span className="px-2 py-0.5 rounded bg-[#17504A] text-white font-bold">
                          03 Workflow
                        </span>
                      </div>
                      <div className="opacity-70 uppercase tracking-wider text-[9px]">
                        WEBSITES • QUOTING ENGINES • INTERNAL TOOLS
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-current/15 pt-2.5 font-mono text-[11px] opacity-80 group-hover:opacity-100 font-bold uppercase tracking-wider">
                    <span>Shape a Custom Build</span>
                    <span
                      className={`transition-transform duration-300 ${
                        simulatingHover ? 'translate-x-1' : 'group-hover:translate-x-1'
                      }`}
                    >
                      →
                    </span>
                  </div>

                  <span
                    className={`pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left bg-current transition-transform duration-300 opacity-60 ${
                      simulatingHover ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </div>
              </div>

              {/* LIVE TILE B: REFINED (195921a) QUINTIC HOVER BEHAVIOR */}
              <div className="lg:col-span-4 flex flex-col space-y-2">
                <div className="flex items-center justify-between font-mono text-xs text-[#D9A62E]">
                  <span className="font-bold uppercase">Live Tile B · Experiment (195921a)</span>
                  <span>450ms enter / 200ms leave · Quint</span>
                </div>

                <div
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
                    transitionDuration: simulatingHover ? '450ms' : '200ms',
                  }}
                  className="group relative flex flex-1 flex-col justify-between p-6 bg-[#DFDACE] text-[#23282A] select-none cursor-pointer border border-[#D9A62E]/40"
                >
                  <div>
                    <div
                      style={{
                        transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
                        transitionDuration: simulatingHover ? '450ms' : undefined,
                      }}
                      className={`flex items-center justify-between border-b-2 pb-2.5 font-mono text-xs transition-colors duration-200 group-hover:duration-500 ${
                        simulatingHover
                          ? 'border-current/55'
                          : 'border-current/25 group-hover:border-current/55'
                      }`}
                    >
                      <span className="font-bold tracking-[0.14em] uppercase">02 / ASSEMBLE</span>
                      <ArrowUpRight
                        style={{
                          transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
                          transitionDuration: simulatingHover ? '450ms' : undefined,
                        }}
                        className={`h-4 w-4 transition-transform duration-200 group-hover:duration-500 ${
                          simulatingHover
                            ? 'translate-x-1 -translate-y-1 opacity-100'
                            : 'opacity-75 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="font-display text-[clamp(1.65rem,2.15vw,2.125rem)] font-black uppercase tracking-[-0.02em] leading-[1.02]">
                        Custom Builds
                      </h3>
                      <p className="mt-2.5 text-[13px] opacity-90 font-sans leading-[1.35] max-w-[42ch]">
                        See what I can create for your business—from custom websites and quoting engines to internal
                        tools built around how you work.
                      </p>
                    </div>
                  </div>

                  {/* Refined Motif with on-palette #D9A62E chip & hover fill */}
                  <div className="my-5 pt-2">
                    <div className="space-y-2 font-mono text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-[#EDE9E0] text-[#23282A] font-bold border border-[#23282A]/25">
                          01 Website
                        </span>
                        <span
                          className={`transition-transform duration-200 group-hover:duration-500 ${
                            simulatingHover ? 'translate-x-0.5 opacity-90' : 'opacity-50 group-hover:translate-x-0.5'
                          }`}
                        >
                          →
                        </span>
                        <span
                          style={{
                            transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
                            transitionDuration: simulatingHover ? '450ms' : undefined,
                          }}
                          className={`px-2 py-0.5 text-[#23282A] font-bold border border-[#D9A62E] transition-colors duration-200 group-hover:duration-500 ${
                            simulatingHover ? 'bg-[#D9A62E]' : 'bg-[#D9A62E]/30 group-hover:bg-[#D9A62E]'
                          }`}
                        >
                          02 Quoting
                        </span>
                        <span
                          className={`transition-transform duration-200 group-hover:duration-500 ${
                            simulatingHover ? 'translate-x-0.5 opacity-90' : 'opacity-50 group-hover:translate-x-0.5'
                          }`}
                        >
                          →
                        </span>
                        <span className="px-2 py-0.5 bg-[#17504A] text-[#EDE9E0] font-bold border border-[#17504A]">
                          03 Workflow
                        </span>
                      </div>
                      <div className="opacity-75 uppercase tracking-wider text-[9.5px]">
                        WEBSITES • QUOTING ENGINES • INTERNAL TOOLS
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center justify-between border-t pt-2.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 group-hover:duration-500 ${
                      simulatingHover
                        ? 'border-current/55 opacity-100'
                        : 'border-current/20 opacity-85 group-hover:border-current/55 group-hover:opacity-100'
                    }`}
                  >
                    <span
                      className={
                        simulatingHover
                          ? 'underline decoration-2 underline-offset-4'
                          : 'group-hover:underline decoration-2 underline-offset-4'
                      }
                    >
                      Shape a Custom Build
                    </span>
                    <span
                      style={{
                        transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
                      }}
                      className={`transition-transform duration-200 group-hover:duration-500 ${
                        simulatingHover ? 'translate-x-1.5' : 'group-hover:translate-x-1.5'
                      }`}
                    >
                      →
                    </span>
                  </div>

                  <span
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                    className={`pointer-events-none absolute bottom-0 left-0 h-[3px] w-full origin-left bg-current transition-transform duration-200 group-hover:duration-500 opacity-85 ${
                      simulatingHover ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </div>
              </div>

              {/* AUTHENTIC CAPTURED HOVER SCREENSHOT (exp01_after_desktop_hover_build.png) */}
              <div className="lg:col-span-4 flex flex-col justify-between border border-[#DFDACE]/20 bg-[#1B1F21] p-4 space-y-3">
                <div className="space-y-1">
                  <div className="font-mono text-xs font-bold uppercase text-[#D9A62E]">
                    Recorded Hover Capture (195921a)
                  </div>
                  <p className="text-xs text-[#DFDACE]/80">
                    Unedited Playwright capture (<code className="font-mono">exp01_after_desktop_hover_build.png</code>)
                    taken 500ms after hovering <code className="font-mono">[data-room-id=&quot;build&quot;]</code>.
                  </p>
                </div>

                <div className="overflow-hidden border border-[#DFDACE]/20 bg-[#141617]">
                  <img
                    src="/assets/images/design-intelligence/exp01_after_desktop_hover_build.png"
                    alt="Recorded hover state on Room 02 (Custom Builds) in commit 195921a"
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                </div>

                <div className="flex items-center justify-between font-mono text-[11px] text-[#DFDACE]/70 pt-1">
                  <span>1440×900 @ 2x DPR</span>
                  <button
                    type="button"
                    onClick={() => {
                      setInspectorView('hover');
                      setInspectorOpen(true);
                    }}
                    className="text-[#D9A62E] underline font-bold hover:text-[#EDE9E0]"
                  >
                    Inspect Full Capture →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 04: THE 5-STAGE METHODOLOGY & FUTURE LIBRARY VISION
            (REFERENCE → EXTRACTION → EVALUATION → REFINEMENT → VERIFICATION)
            ============================================================ */}
        <section
          id="methodology-pipeline"
          className="border-b border-[#DFDACE]/15 bg-[#17504A] text-[#EDE9E0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10"
        >
          <div className="mx-auto max-w-7xl space-y-10">
            <div className="max-w-3xl space-y-3">
              <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#D9A62E]">
                03 / TRANSFERABLE PRINCIPLES, NOT IMITATION
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight">
                The 5-Stage Design Intelligence Workflow
              </h2>
              <p className="text-sm sm:text-base text-[#EDE9E0]/90 leading-relaxed">
                Instead of asking AI to &ldquo;make a website look cool&rdquo; or copying another studio’s layout,
                Design Intelligence treats high-craft websites as measurable engineering specimens—extracting objective
                proportions and motion curves while preserving ContextMuse’s own architecture, copy, and palette.
              </p>
            </div>

            {/* 5-Stage Pipeline Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  step: '01',
                  name: 'REFERENCE',
                  subtitle: 'Select Specimen',
                  detail:
                    'Inspected locomotive.ca/en at 1440×900 and 390×844 for grid discipline, overline framing, and hover choreography—not for its layout, fonts, or #312DFB palette.',
                },
                {
                  step: '02',
                  name: 'EXTRACTION',
                  subtitle: 'Measure DOM & CSS',
                  detail:
                    'Queried getComputedStyle, cssRules, and getBoundingClientRect. Separated Directly Measured values (--grid-margin: 40px, 0.45s/0.2s quint) from Inferred patterns and Runtime shaders.',
                },
                {
                  step: '03',
                  name: 'EVALUATION',
                  subtitle: 'Diagnose Drift',
                  detail:
                    'Measured ContextMuse baseline (52e179d) against the extracted principles: identified a 24px left plumb-line step, mixed 4px/0px corners, brightness washout, and a red chip outlier.',
                },
                {
                  step: '04',
                  name: 'REFINEMENT',
                  subtitle: 'Controlled Edits',
                  detail:
                    'Applied 3 scoped refinements on isolated branch 195921a across 5 files. Self-corrected and reverted a 48ch hero width that caused a 3rd-line orphan on mobile.',
                },
                {
                  step: '05',
                  name: 'VERIFICATION',
                  subtitle: 'Measure & Smoke Test',
                  detail:
                    'Re-measured DOM coordinates (0px plumb variance on desktop & mobile) and executed the 11-check functional non-regression smoke suite.',
                },
              ].map((stage) => (
                <div
                  key={stage.step}
                  className="flex flex-col justify-between border-2 border-[#EDE9E0]/25 bg-[#123F3A] p-4 space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs text-[#D9A62E] font-bold">
                      <span>STAGE {stage.step}</span>
                      <span>→</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-black uppercase tracking-tight text-[#EDE9E0]">
                      {stage.name}
                    </h3>
                    <div className="font-mono text-[11px] text-[#DFDACE]/75">{stage.subtitle}</div>
                    <p className="mt-2.5 text-xs leading-relaxed text-[#EDE9E0]/90">{stage.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Future Vision: Reusable Design Intelligence Library */}
            <div className="border-2 border-[#D9A62E]/60 bg-[#0F3530] p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDE9E0]/15 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D9A62E]">
                    ROADMAP CONCEPT · EARLY EXPERIMENT TOWARD A REUSABLE SYSTEM
                  </span>
                  <h3 className="mt-1 font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#EDE9E0]">
                    How This Methodology Scales Into a Design Intelligence Library
                  </h3>
                </div>
                <span className="border border-[#D9A62E] bg-[#17504A] px-3 py-1 font-mono text-[11px] font-bold uppercase text-[#D9A62E]">
                  Status: Experimental Prototype (v0.1)
                </span>
              </div>

              <p className="text-sm text-[#EDE9E0]/90 leading-relaxed max-w-4xl">
                This experiment is the first entry (<code className="font-mono text-[#D9A62E]">design-intelligence/references/locomotive.md</code>)
                in a structured methodology designed to help engineering-led builds achieve consistent editorial and
                structural polish without generic templates:
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                <div className="border border-[#EDE9E0]/20 bg-[#17504A]/60 p-4 space-y-1.5">
                  <div className="font-mono font-bold text-[#D9A62E] uppercase">1. Multi-Reference Profiles</div>
                  <p className="text-[#EDE9E0]/85 leading-relaxed">
                    Structured markdown dossiers documenting measured grid tracks, type scales, and motion curves across
                    distinct editorial, industrial, and product references.
                  </p>
                </div>
                <div className="border border-[#EDE9E0]/20 bg-[#17504A]/60 p-4 space-y-1.5">
                  <div className="font-mono font-bold text-[#D9A62E] uppercase">2. Curated Principle Sets</div>
                  <p className="text-[#EDE9E0]/85 leading-relaxed">
                    Distilling cross-site rules—such as plumb-line alignment, asymmetric hover easing, and fluid
                    clamp() ratios—into reusable diagnostic checklists.
                  </p>
                </div>
                <div className="border border-[#EDE9E0]/20 bg-[#17504A]/60 p-4 space-y-1.5">
                  <div className="font-mono font-bold text-[#D9A62E] uppercase">3. Context-Aware Application</div>
                  <p className="text-[#EDE9E0]/85 leading-relaxed">
                    Applying structural tolerances using the target project’s own brand tokens and copy, while reverting
                    any rule that degrades readability or mobile wrapping.
                  </p>
                </div>
                <div className="border border-[#EDE9E0]/20 bg-[#17504A]/60 p-4 space-y-1.5">
                  <div className="font-mono font-bold text-[#D9A62E] uppercase">4. Automated Verification</div>
                  <p className="text-[#EDE9E0]/85 leading-relaxed">
                    Pairing bounding-box geometry assertions (plumb-line variance, line-wrap counts) with functional
                    smoke tests before human visual review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 05: VERIFICATION AUDIT (11/11 SMOKE CHECKS),
            EPISTEMIC BOUNDARIES & REFERENCE ATTRIBUTION
            ============================================================ */}
        <section
          id="verification-and-attribution"
          className="bg-[#1B1F21] text-[#EDE9E0] px-5 py-12 sm:px-8 sm:py-16 lg:px-10"
        >
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Left 7 Cols: 11/11 Smoke Check Breakdown */}
              <div className="lg:col-span-7 space-y-4">
                <div className="border-b border-[#DFDACE]/15 pb-3">
                  <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#D9A62E]">
                    04 / VERIFIED TEST OUTPUT (LAUNCH_STABILIZATION_SMOKE.MJS)
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-black uppercase tracking-tight">
                    What the 11 / 11 Automated Smoke Checks Covered
                  </h2>
                  <p className="mt-1 text-xs text-[#DFDACE]/80">
                    Verified directly against the execution log (<code className="font-mono">task-3424.log</code>) on
                    commit <code className="font-mono text-[#D9A62E]">195921a</code>.
                  </p>
                </div>

                <div className="divide-y divide-[#DFDACE]/10 border border-[#DFDACE]/20 bg-[#23282A]">
                  {SMOKE_CHECKS.map((chk) => (
                    <div key={chk.num} className="p-3 sm:px-4 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="font-mono font-bold text-[#EDE9E0]">
                          <span className="text-[#D9A62E] mr-2">#{chk.num}</span>
                          {chk.name}
                        </div>
                        <p className="text-[#DFDACE]/75 text-[11.5px]">{chk.covered}</p>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        {chk.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 5 Cols: Epistemic Disclaimer, Git Provenance & Reference Attribution */}
              <div className="lg:col-span-5 space-y-6">
                {/* Explicit Non-Exaggeration / Epistemic Boundary Card */}
                <div className="border-2 border-[#D9A62E] bg-[#23282A] p-5 space-y-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E]">
                    <Scale className="h-4 w-4" />
                    <span>What Automated Tests Prove—And What They Do Not</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#EDE9E0]/90 leading-relaxed">
                    Passing <strong>11/11 automated smoke checks</strong> proves <strong>functional non-regression</strong>:
                    routing, room transitions, interactive tools, lead capture (<code className="font-mono">/api/lead/</code>),
                    and mobile zero-overflow constraints (<code className="font-mono">390/390px</code>) remained intact
                    after modifying the layout and motion tokens.
                  </p>
                  <p className="text-xs text-[#DFDACE]/80 leading-relaxed border-t border-[#DFDACE]/15 pt-2.5">
                    <strong>Epistemic Boundary:</strong> Automated functional and bounding-box tests do{' '}
                    <strong className="text-[#EDE9E0]">not</strong> prove improved aesthetics, user preference,
                    conversion lift, or independent design quality. Those require human visual inspection and real-world
                    audience evaluation.
                  </p>
                </div>

                {/* Git Commit & File Provenance */}
                <div className="border border-[#DFDACE]/20 bg-[#23282A] p-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#EDE9E0]">
                    <FileCode2 className="h-4 w-4 text-[#D9A62E]" />
                    <span>Artifact &amp; Repository Provenance</span>
                  </div>
                  <ul className="space-y-2 text-[11.5px] text-[#DFDACE]/85">
                    <li>
                      <strong className="text-[#D9A62E]">Baseline Commit:</strong>{' '}
                      <code>52e179dc0136e72c9b07a0ba5d80cdb7f9f6d765</code> (<code>release/candidate-preview</code>)
                    </li>
                    <li>
                      <strong className="text-[#D9A62E]">Experiment Commit:</strong>{' '}
                      <code>195921ae478a5318ddaa2b16abb2c7a2ea58ae24</code> (
                      <code>experiment/design-intelligence-01-locomotive</code>)
                    </li>
                    <li>
                      <strong className="text-[#D9A62E]">Reference Dossier:</strong>{' '}
                      <code>design-intelligence/references/locomotive.md</code>
                    </li>
                    <li>
                      <strong className="text-[#D9A62E]">Experiment Record:</strong>{' '}
                      <code>design-intelligence/experiments/experiment-01-locomotive.md</code>
                    </li>
                    <li>
                      <strong className="text-[#D9A62E]">Modified Components (5):</strong>{' '}
                      <code>src/index.css</code>, <code>SiteHeader.jsx</code>, <code>SiteFooter.jsx</code>,{' '}
                      <code>HeroPanel.jsx</code>, <code>RoomTile.jsx</code>
                    </li>
                  </ul>
                </div>

                {/* Locomotive Attribution & Non-Endorsement Notice */}
                <div className="border border-[#DFDACE]/20 bg-[#16191B] p-5 space-y-2.5 text-xs text-[#DFDACE]/80">
                  <div className="font-mono font-bold uppercase tracking-wider text-[#EDE9E0]">
                    Reference Attribution &amp; Independence Notice
                  </div>
                  <p className="leading-relaxed">
                    <strong>Reference Credit:</strong>{' '}
                    <a
                      href="https://locomotive.ca/en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D9A62E] underline hover:text-[#EDE9E0]"
                    >
                      Locomotive (locomotive.ca)
                    </a>{' '}
                    was inspected as an external reference specimen for grid margin proportions, structural overline
                    framing, and asymmetric cubic-bezier transition timing.
                  </p>
                  <p className="leading-relaxed text-[11.5px] text-[#DFDACE]/70">
                    Locomotive is an independent agency and is not affiliated with, endorsing, or collaborating on
                    ContextMuse. No proprietary fonts, media, copy, or source code from Locomotive are reused in
                    ContextMuse.
                  </p>
                </div>

                {/* CTA Card */}
                <div className="border-2 border-[#DFDACE]/25 bg-[#23282A] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-display text-base font-black uppercase text-[#EDE9E0]">
                      Want this level of care on your product or site?
                    </div>
                    <p className="text-xs text-[#DFDACE]/75 mt-0.5">
                      Share your project or mark up this page to include notes with your inquiry.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleInquireAboutDesignSystem}
                    className="shrink-0 bg-[#D9A62E] text-[#141617] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#e3b13b] transition-colors"
                  >
                    Start a Project →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================
          FULL-IMAGE DETAIL INSPECTOR MODAL (1:1 UNCROPPED & ZOOMABLE)
          ============================================================ */}
      {inspectorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full-Image Before and After Detail Inspector"
          className="fixed inset-0 z-50 flex flex-col bg-[#141617]/95 backdrop-blur-md"
        >
          {/* Modal Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFDACE]/20 bg-[#23282A] px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="bg-[#D9A62E] text-[#141617] px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                Full-Image Inspector
              </span>
              <h3 className="font-display text-sm sm:text-base font-bold uppercase text-[#EDE9E0]">
                {activeMode.label} — Uncropped Baseline (52e179d) vs. Experiment (195921a)
              </h3>
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
                onClick={() => setInspectorView('hover')}
                className={`px-2.5 py-1 border ${
                  inspectorView === 'hover'
                    ? 'border-[#D9A62E] bg-[#D9A62E] text-[#141617] font-bold'
                    : 'border-[#DFDACE]/25 text-[#EDE9E0]'
                }`}
              >
                Recorded Hover (Room 02)
              </button>

              <span className="text-[#DFDACE]/30">|</span>

              <button
                type="button"
                onClick={() => setInspectorZoom((z) => (z === 1 ? 1.5 : 1))}
                className="px-2.5 py-1 border border-[#DFDACE]/25 text-[#EDE9E0] hover:border-[#D9A62E]"
              >
                Zoom: {inspectorZoom === 1 ? '100% (Fit)' : '150% (Detail)'}
              </button>

              <button
                type="button"
                onClick={() => setInspectorOpen(false)}
                aria-label="Close full-image inspector"
                className="ml-2 flex items-center gap-1 border border-[#DFDACE]/30 bg-[#1B1F21] px-3 py-1 text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E]"
              >
                <X className="h-4 w-4" />
                <span>Close (Esc)</span>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            {inspectorView === 'side-by-side' ? (
              <div
                style={{
                  transform: `scale(${inspectorZoom})`,
                  transformOrigin: 'top left',
                }}
                className="grid gap-6 lg:grid-cols-2 items-start mx-auto max-w-[1800px]"
              >
                <div className="space-y-2 border border-[#DFDACE]/25 bg-[#1B1F21] p-3">
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-[#EDE9E0]">
                    <span>BEFORE · Baseline Commit 52e179d</span>
                    <span className="text-[#DFDACE]/60">{activeMode.viewportText}</span>
                  </div>
                  <img
                    src={activeMode.beforeSrc}
                    alt={`Full uncropped BEFORE (${activeMode.label})`}
                    className="w-full h-auto block border border-[#DFDACE]/15"
                  />
                </div>

                <div className="space-y-2 border border-[#D9A62E]/50 bg-[#1B1F21] p-3">
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-[#D9A62E]">
                    <span>AFTER · Experiment Commit 195921a</span>
                    <span className="text-[#DFDACE]/60">{activeMode.viewportText}</span>
                  </div>
                  <img
                    src={activeMode.afterSrc}
                    alt={`Full uncropped AFTER (${activeMode.label})`}
                    className="w-full h-auto block border border-[#D9A62E]/25"
                  />
                </div>
              </div>
            ) : (
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
