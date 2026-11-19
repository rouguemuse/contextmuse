import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Activity,
  Compass,
  BookOpen,
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
  Sliders,
  Maximize2,
  X,
} from 'lucide-react';
import RoomShell from '@/components/room/RoomShell';
import RoomHeading from '@/components/room/RoomHeading';
import LabPromptCard from '@/components/lab/LabPromptCard';
import AdCompositorTool from '@/components/lab/AdCompositorTool';
import ContrastTool from '@/components/lab/ContrastTool';
import TableDocketTool from '@/components/lab/TableDocketTool';
import BarrierMapTool from '@/components/lab/BarrierMapTool';
import AuditLauncherCard from '@/components/lab/AuditLauncherCard';
import { roomById } from '@/lib/rooms';

const STANDALONE_APPS = [
  {
    id: 'signal-ops',
    num: 'APP 02',
    category: 'Hospitality & POS Intelligence',
    title: 'Signal — Restaurant Operational Analysis',
    subtitle: '3-stage multi-report POS correlation & prioritized GM action engine',
    description:
      'Ingests sales, labor punches, comps, voids, and kitchen timing exports—or runs realistic multi-concept presets—to surface the top operational leaks worth fixing first.',
    specs: ['3-Stage POS Correlation', 'Toast / Square / Clover CSV', 'Prioritized GM Action Plan'],
    image: '/assets/images/signal-priority-view.webp',
    imageAlt: 'Signal restaurant operational analysis priority view',
    primaryUrl: '/signal/demo/',
    primaryLabel: 'Launch Interactive Demo',
    secondaryUrl: '/signal/',
    secondaryLabel: 'Product Overview',
    icon: Activity,
  },
  {
    id: 'self-cartography',
    num: 'APP 03',
    category: 'Explainable Scoring & Spatial UI',
    title: 'Self-Cartography V1',
    subtitle: 'Full-screen behavioral-pattern & topological coordinate engine',
    description:
      'Maps structured scenario reflections into an interactive 2D topological landscape using transparent, inspectable client-side vector weights with zero clinical labels.',
    specs: ['2D Topological Canvas', 'Inspectable Vector Weights', '100% Browser-Local State'],
    image: '/assets/captures/self-cartography-live.jpg',
    imageAlt: 'Self-Cartography V1 topological map interface',
    primaryUrl: '/cartography/',
    primaryLabel: 'Launch Cartography V1',
    icon: Compass,
  },
  {
    id: 'wcsm',
    num: 'APP 04',
    category: 'Editorial Tooling & Crawlers',
    title: 'Writing Contest Submission Manager',
    subtitle: '60+ vetted literary contests with weekly crawler verification & tracker',
    description:
      'Combines an automated weekly GitHub Actions deadline crawler with an instant multi-facet filter and browser-local submission status tracker for fiction, poetry, and essays.',
    specs: ['60+ Vetted Contests', 'Weekly Deadline Crawler', 'IndexedDB Submission Tracker'],
    image: '/assets/images/contest-atlas-hero.webp',
    imageAlt: 'Writing Contest Submission Manager directory interface',
    primaryUrl: '/wcsm/',
    primaryLabel: 'Launch Contest Directory',
    icon: BookOpen,
  },
  {
    id: 'website-system-check',
    num: 'APP 05',
    category: 'Multi-Viewport UX Diagnostics',
    title: 'Website + System Check',
    subtitle: 'Side-by-side Desktop, Tablet & Mobile viewport diagnostic inspector',
    description:
      'Loads target URLs across synchronized responsive viewports and evaluates structural clarity across Message, Paths, Proof, and Intake.',
    specs: ['3-Viewport Live Inspector', '4-Pillar Structural Rubric', 'Serverless DOM Diagnostics'],
    image: '/assets/images/website-audit-hero.webp',
    imageAlt: 'Website + System Check multi-viewport diagnostic tool',
    primaryUrl: '/website-system-check/',
    primaryLabel: 'Launch Viewport Inspector',
    icon: ShieldCheck,
  },
];

const GENSORT_SCREENSHOTS = {
  library: {
    id: 'gensort-library',
    num: '01',
    shortLabel: '01 / Live Workspace',
    title: '01 / Live GenSort Workspace & Smart Intelligence Detection',
    meta: 'Live Application Capture · 933×891',
    src: '/assets/captures/gensort-live.jpg',
    alt: 'GenSort Live Workspace showing Smart Intelligence Detection, Folder Tree, Color Palette Filter, and Asset Grid',
    launchUrl: '/cxm_gensort/index.html',
    launchLabel: 'Launch GenSort Studio',
  },
  compare: {
    id: 'gensort-compare',
    num: '02',
    shortLabel: '02 / Compare & Diff',
    title: '02 / Side-by-Side Compare & Parameter Diff',
    meta: '64-Bit dHash Similarity · 3200×2000',
    src: '/assets/images/gensort-compare.webp',
    alt: 'GenSort Studio Side-by-Side Compare and Parameter Diff',
    launchUrl: '/cxm_gensort/index.html',
    launchLabel: 'Launch GenSort Studio',
  },
};

const LAB_INSTRUMENTS = [
  { id: 'ad-compositor', num: '01', label: 'Ad Compositor', target: '#tool-ad-compositor' },
  { id: 'contrast', num: '02', label: 'WCAG Contrast', target: '#tool-contrast' },
  { id: 'table-docket', num: '03', label: 'TableDocket', target: '#tool-table-docket' },
  { id: 'audit', num: '04', label: 'Website Audit', target: '#tool-audit' },
  { id: 'barrier-map', num: '05', label: 'Friction Map', target: '#tool-barrier-map' },
  { id: 'all', num: 'ALL', label: 'Show All 5', target: '#lab-utilities-heading' },
];

export default function Lab() {
  const room = roomById('lab');
  const [gensortMobileShot, setGensortMobileShot] = useState('library');
  const [activeInstrument, setActiveInstrument] = useState('ad-compositor');
  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => {
    if (!lightboxItem) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxItem(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxItem]);

  const scrollToSection = (selector) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTool = (target) => {
    if (target.startsWith('#')) {
      if (target === '#tool-contrast') setActiveInstrument('contrast');
      else if (target === '#tool-table-docket') setActiveInstrument('table-docket');
      else if (target === '#tool-barrier-map') setActiveInstrument('barrier-map');
      else if (target === '#tool-audit') setActiveInstrument('audit');
      else if (target === '#tool-ad-compositor') setActiveInstrument('ad-compositor');

      setTimeout(() => {
        const el = document.querySelector(target) || document.getElementById('lab-utilities-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 40);
    } else if (typeof window !== 'undefined') {
      window.location.href = target;
    }
  };

  return (
    <RoomShell
      room={room}
      canvasBg="#EDE9E0"
      canvasText="#23282A"
      accentBarColor="#D9A62E"
    >
      <div className="mx-auto w-full max-w-[1380px] min-w-0 px-4 pb-16 pt-6 sm:px-8 sm:pb-24 sm:pt-12 lg:px-12 space-y-12 sm:space-y-18 font-sans">
        <RoomHeading
          num={room.num}
          verb={room.verb}
          badge="Original Products, AI Tools & Interactive Instruments"
          title="The Lab."
          watermark={room.num}
          accentColor="#D9A62E"
          sub="Where original digital products, AI evaluation systems, and interactive utilities are designed and built in working code."
        >
          <nav
            aria-label="Lab sections"
            className="relative z-10 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 font-mono text-xs"
          >
            {[
              { num: '01', label: 'Standalone Products (5)', target: '#lab-standalone-section' },
              { num: '02', label: 'Interactive Browser Instruments (5)', target: '#lab-utilities-section' },
              { num: '03', label: 'Design Intelligence Research', target: '#lab-experiments-section' },
            ].map((sec) => (
              <button
                key={sec.num}
                type="button"
                onClick={() => scrollToSection(sec.target)}
                className="min-h-[42px] flex items-center justify-between gap-2 bg-[#FAF8F5] border border-[#23282A]/20 hover:border-[#23282A] px-3.5 py-2.5 text-left transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-block h-2 w-2 shrink-0 bg-[#D9A62E]" />
                  <span className="text-[#9A6F0B] font-bold shrink-0">{sec.num}</span>
                  <span className="text-[#23282A] font-semibold truncate">{sec.label}</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#23282A]/50 group-hover:text-[#23282A] shrink-0 transition-colors" />
              </button>
            ))}
          </nav>
        </RoomHeading>

        {/* =================================================================
            SECTION 01: STANDALONE SOFTWARE PRODUCTS
           ================================================================= */}
        <section id="lab-standalone-section" aria-labelledby="lab-standalone-heading" className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#23282A]/15 pb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#23282A]/70 font-bold">
                <span className="inline-block h-2 w-2 bg-[#D9A62E]" />
                <span>01 / Standalone Products &amp; Applications</span>
              </div>
              <h2
                id="lab-standalone-heading"
                className="mt-1.5 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#23282A]"
              >
                Original Software Built &amp; Hosted Here
              </h2>
            </div>

            <a
              href="/inncontrol-v2/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[#23282A]/75 hover:text-[#17504A] transition-colors border-b border-[#23282A]/25 hover:border-[#17504A] pb-0.5 self-start sm:self-auto"
            >
              <span>Also live: INNcontrol Operator HUD (/inncontrol-v2/)</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            </a>
          </div>

          {/* Flagship Product Showcase: GenSort Studio */}
          <article
            id="tool-gensort"
            className="bg-[#FAF8F5] border border-[#23282A]/15 border-t-[3px] border-t-[#D9A62E] p-4 sm:p-6 lg:p-8 shadow-sm space-y-5 sm:space-y-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#23282A]/12 pb-4 sm:pb-5">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em]">
                  <span className="bg-[#23282A] text-[#D9A62E] px-2 py-0.5 font-bold">
                    APP 01 · FLAGSHIP
                  </span>
                  <span className="text-[#9A6F0B] font-bold">
                    Local-First Visual Intelligence
                  </span>
                  <span className="hidden sm:inline text-[#23282A]/35">•</span>
                  <span className="text-[#23282A]/65">
                    5-Stage AI Prompt Lineage &amp; 64-Bit dHash
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#23282A] leading-tight">
                  GenSort Studio — Asset Curation Engine
                </h3>
              </div>

              <a
                href="/cxm_gensort/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[44px] shrink-0 inline-flex items-center justify-center gap-2 bg-[#23282A] text-[#EDE9E0] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#D9A62E] hover:text-[#141617] transition-colors"
              >
                <span>Launch GenSort Studio</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
            </div>

            {/* Uncropped 16:10 Presentation Frame (Segmented Switcher on Mobile, Dual Grid on md+) */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:hidden gap-1.5 font-mono text-[11px]">
                {Object.entries(GENSORT_SCREENSHOTS).map(([key, shot]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setGensortMobileShot(key)}
                    className={`min-h-[38px] py-1.5 px-2.5 border uppercase tracking-wider font-bold transition-colors ${
                      gensortMobileShot === key
                        ? 'bg-[#23282A] text-[#D9A62E] border-[#23282A]'
                        : 'bg-[#EDE9E0]/60 text-[#23282A]/75 border-[#23282A]/15'
                    }`}
                  >
                    {shot.shortLabel}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {Object.entries(GENSORT_SCREENSHOTS).map(([key, shot]) => (
                  <figure
                    key={key}
                    className={`${
                      gensortMobileShot === key ? 'block' : 'hidden md:block'
                    } bg-[#EDE9E0]/55 border border-[#23282A]/12 p-2.5 sm:p-3.5 space-y-2.5`}
                  >
                    <div className="relative group overflow-hidden border border-[#23282A]/20 bg-[#141617] aspect-[16/10]">
                      <img
                        src={shot.src}
                        alt={shot.alt}
                        className="w-full h-full object-contain object-center block"
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={() => setLightboxItem(shot)}
                        aria-label={`Inspect full resolution UI for ${shot.title}`}
                        className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 bg-[#141617]/90 hover:bg-[#D9A62E] text-[#EDE9E0] hover:text-[#141617] border border-[#EDE9E0]/25 px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors shadow-md"
                      >
                        <Maximize2 className="h-3 w-3 shrink-0" />
                        <span>Inspect Full UI</span>
                      </button>
                    </div>
                    <figcaption className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 font-mono text-[11px] text-[#23282A]/75 px-0.5">
                      <span className="font-semibold text-[#23282A]">{shot.title}</span>
                      <span className="text-[10px] text-[#9A6F0B] font-semibold">{shot.meta}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            {/* Description + 5-Stage Pipeline Strip (Symmetrical on Mobile & Desktop) */}
            <div className="grid gap-4 lg:grid-cols-12 items-center pt-1">
              <p className="lg:col-span-5 text-xs sm:text-sm text-[#23282A]/80 leading-relaxed">
                Drop a local folder of AI renders, design exports, or screenshots—or click{' '}
                <strong className="text-[#23282A]">“Load Sample Studio Dataset”</strong> inside the app—to run the complete 5-stage curation workflow in your browser with zero cloud uploads.
              </p>

              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px]">
                {[
                  { step: '01', name: 'Import', sub: 'Folder / Sample' },
                  { step: '02', name: 'Understand', sub: 'Prompt & Score' },
                  { step: '03', name: 'Organize', sub: 'Tag & Filter' },
                  { step: '04', name: 'Review', sub: 'dHash & Diff' },
                  { step: '05', name: 'Export', sub: 'JSON / CSV Manifest' },
                ].map((s, idx) => (
                  <div
                    key={s.step}
                    className={`${
                      idx === 4
                        ? 'col-span-2 sm:col-span-1 flex sm:block items-center justify-between gap-2'
                        : 'block'
                    } bg-[#EDE9E0]/70 border border-[#23282A]/12 px-3 py-2`}
                  >
                    <div className="flex sm:block items-center gap-2 min-w-0">
                      <span className="text-[10px] text-[#9A6F0B] font-bold shrink-0">{s.step}</span>
                      <span className="font-bold text-[#23282A] truncate sm:block sm:mt-0.5">{s.name}</span>
                    </div>
                    <span className="text-[10px] text-[#23282A]/65 truncate sm:block">{s.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* 2x2 Standalone Product Gallery (APP 02 – APP 05) */}
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            {STANDALONE_APPS.map((app) => {
              const Icon = app.icon;
              return (
                <article
                  key={app.id}
                  className="flex flex-col justify-between bg-[#FAF8F5] border border-[#23282A]/15 border-t-[3px] border-t-[#23282A] shadow-sm overflow-hidden"
                >
                  <div>
                    {/* Consistent Card Header Strip */}
                    <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-[#EDE9E0]/55 border-b border-[#23282A]/12 flex items-center justify-between gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em]">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="bg-[#23282A] text-[#EDE9E0] px-2 py-0.5 font-bold shrink-0">
                          {app.num}
                        </span>
                        <span className="text-[#9A6F0B] font-bold truncate">{app.category}</span>
                      </div>
                      <Icon className="h-3.5 w-3.5 text-[#23282A]/55 shrink-0" />
                    </div>

                    {/* Uncropped 16:10 Architectural Preview Frame + Lightbox Trigger */}
                    <div className="bg-[#EDE9E0]/35 border-b border-[#23282A]/12 p-2.5 sm:p-3.5">
                      <div className="relative group overflow-hidden border border-[#23282A]/20 bg-[#141617] aspect-[16/10]">
                        <img
                          src={app.image}
                          alt={app.imageAlt}
                          className="w-full h-full object-contain object-center block"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxItem({
                              id: app.id,
                              title: app.title,
                              meta: `${app.num} · ${app.category}`,
                              src: app.image,
                              alt: app.imageAlt,
                              launchUrl: app.primaryUrl,
                              launchLabel: app.primaryLabel,
                            })
                          }
                          aria-label={`Inspect full resolution UI for ${app.title}`}
                          className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 bg-[#141617]/90 hover:bg-[#D9A62E] text-[#EDE9E0] hover:text-[#141617] border border-[#EDE9E0]/25 px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors shadow-md"
                        >
                          <Maximize2 className="h-3 w-3 shrink-0" />
                          <span>Inspect Full UI</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 space-y-3">
                      <div>
                        <h3 className="font-display text-lg sm:text-2xl font-black uppercase tracking-tight text-[#23282A] leading-snug">
                          {app.title}
                        </h3>
                        <p className="font-mono text-[11px] sm:text-xs text-[#23282A]/65 mt-1">
                          {app.subtitle}
                        </p>
                      </div>

                      <p className="font-sans text-xs sm:text-sm text-[#23282A]/80 leading-relaxed">
                        {app.description}
                      </p>

                      {/* Scannable Capability Spec Strip */}
                      <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px]">
                        {app.specs.map((spec) => (
                          <span
                            key={spec}
                            className="bg-[#EDE9E0]/75 border border-[#23282A]/12 px-2 py-0.5 text-[#23282A]/85 font-semibold"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3.5 sm:px-6 sm:py-4 bg-[#EDE9E0]/35 border-t border-[#23282A]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-mono text-xs">
                    <a
                      href={app.primaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto min-h-[42px] inline-flex items-center justify-center gap-2 bg-[#23282A] px-4 py-2.5 font-bold uppercase tracking-wider text-[#EDE9E0] hover:bg-[#D9A62E] hover:text-[#141617] transition-colors"
                    >
                      <span>{app.primaryLabel}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>

                    {app.secondaryUrl && (
                      <a
                        href={app.secondaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 text-[#23282A]/80 hover:text-[#23282A] underline underline-offset-4 transition-colors py-1"
                      >
                        <span>{app.secondaryLabel}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* =================================================================
            SECTION 02: INTERACTIVE UTILITIES & DIAGNOSTIC INSTRUMENTS
           ================================================================= */}
        <section id="lab-utilities-section" aria-labelledby="lab-utilities-heading" className="space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#23282A]/15 pb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#23282A]/70 font-bold">
                <span className="inline-block h-2 w-2 bg-[#23282A]" />
                <span>02 / Interactive Utilities &amp; Instruments</span>
              </div>
              <h2
                id="lab-utilities-heading"
                className="mt-1.5 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#23282A]"
              >
                In-Page Diagnostic &amp; Design Tools
              </h2>
            </div>
            <p className="font-mono text-xs text-[#23282A]/65 max-w-md">
              Select an instrument below to inspect layout hierarchy, WCAG contrast, data normalization, or workflow friction—or expand all 5 simultaneously.
            </p>
          </div>

          {/* Interactive Workbench Instrument Selector Bar — Symmetrical 2-Col Grid on Mobile */}
          <div
            role="tablist"
            aria-label="Select active Lab workbench instrument"
            className="bg-[#FAF8F5] border border-[#23282A]/20 p-2.5 font-mono text-xs space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-1.5"
          >
            <span className="px-1.5 py-1 text-[10px] uppercase tracking-wider text-[#23282A]/65 font-bold flex items-center gap-1.5">
              <Sliders className="h-3 w-3 text-[#9A6F0B] shrink-0" />
              <span>Active Instrument:</span>
            </span>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
              {LAB_INSTRUMENTS.map((inst) => {
                const isSelected = activeInstrument === inst.id;
                return (
                  <button
                    key={inst.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    data-testid={`lab-instrument-tab-${inst.id}`}
                    onClick={() => setActiveInstrument(inst.id)}
                    className={`min-h-[38px] px-2.5 sm:px-3 py-1.5 border uppercase tracking-wider text-left sm:text-center transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#23282A] text-[#D9A62E] border-[#23282A] font-bold'
                        : 'bg-[#EDE9E0]/60 text-[#23282A]/80 border-[#23282A]/15 hover:border-[#23282A]'
                    }`}
                  >
                    <span className={isSelected ? 'text-[#D9A62E]' : 'text-[#9A6F0B]'}>{inst.num}</span>
                    <span className="truncate">{inst.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 sm:gap-6 lg:grid-cols-12 items-stretch">
            {/* Active Instrument Stage (7 Cols when single, 12 Cols when 'all') */}
            <div className={activeInstrument === 'all' ? 'lg:col-span-12 space-y-6' : 'min-w-0 lg:col-span-7'}>
              <div
                className={activeInstrument === 'ad-compositor' || activeInstrument === 'all' ? 'block h-full' : 'hidden'}
              >
                <AdCompositorTool />
              </div>

              <div
                className={activeInstrument === 'contrast' || activeInstrument === 'all' ? 'block h-full' : 'hidden'}
              >
                <ContrastTool />
              </div>

              <div
                className={activeInstrument === 'table-docket' || activeInstrument === 'all' ? 'block h-full' : 'hidden'}
              >
                <TableDocketTool />
              </div>

              <div
                className={activeInstrument === 'audit' || activeInstrument === 'all' ? 'block h-full' : 'hidden'}
              >
                <AuditLauncherCard />
              </div>

              <div
                className={activeInstrument === 'barrier-map' || activeInstrument === 'all' ? 'block h-full' : 'hidden'}
              >
                <BarrierMapTool />
              </div>
            </div>

            {/* Companion Quick-Prompt Launcher (5 Cols) */}
            <div className={activeInstrument === 'all' ? 'lg:col-span-12' : 'min-w-0 lg:col-span-5'}>
              <LabPromptCard onSelectTool={scrollToTool} />
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 03: RESEARCH & DESIGN INTELLIGENCE EXPERIMENTS
           ================================================================= */}
        <section id="lab-experiments-section" aria-labelledby="lab-experiments-heading" className="space-y-5 sm:space-y-6">
          <div className="border-b border-[#23282A]/15 pb-4">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#23282A]/70 font-bold">
              <span className="inline-block h-2 w-2 bg-[#17504A]" />
              <span>03 / Research &amp; Design Intelligence</span>
            </div>
            <h2
              id="lab-experiments-heading"
              className="mt-1.5 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#23282A]"
            >
              Measured UI Experiments &amp; Case Studies
            </h2>
          </div>

          <article className="bg-[#FAF8F5] border border-[#23282A]/15 border-l-4 border-l-[#D9A62E] p-4 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em]">
                <span className="bg-[#17504A] text-[#EDE9E0] px-2 py-0.5 font-bold">
                  RESEARCH 001 · STUDIES 01–03
                </span>
                <span className="text-[#23282A]/70">
                  Plaidis / Locomotive · Linear · Stripe → Context &amp; Muse
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-2xl font-black uppercase tracking-tight text-[#23282A]">
                Design Intelligence: From Visual Reference to Measurable Design Decisions
              </h3>
              <p className="text-xs sm:text-sm text-[#23282A]/80 leading-relaxed">
                “Design is not a collection of preferences. It is a system of relationships.” An interactive 7-part
                case study comparing extracted CSSOM and DOM tokens from Plaidis / Locomotive, Linear, and Stripe on a
                shared 85-node neutral specimen (desktop 1440×900 &amp; mobile 390×844), alongside the verified Context
                &amp; Muse production transfer (0px desktop plumb drift, 18/18 WCAG 2.1 contrast swatches, 11/11 smoke
                gates).
              </p>
            </div>
            <a
              href="/lab/design-intelligence"
              className="w-full sm:w-auto min-h-[44px] shrink-0 inline-flex items-center justify-center gap-2 bg-[#23282A] text-[#EDE9E0] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#D9A62E] hover:text-[#141617] transition-colors"
            >
              <span>Open Interactive Case Study</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            </a>
          </article>
        </section>
      </div>

      {/* Full-Resolution Product Screenshot Lightbox Modal */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Full UI preview: ${lightboxItem.title}`}
          data-testid="lab-screenshot-lightbox"
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#141617]/92 p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl bg-[#1C2022] border border-[#EDE9E0]/20 text-[#EDE9E0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#EDE9E0]/15 bg-[#141617] font-mono text-xs">
              <div className="min-w-0">
                <span className="block text-[10px] text-[#D9A62E] uppercase tracking-wider font-bold">
                  {lightboxItem.meta}
                </span>
                <span className="block font-bold text-[#EDE9E0] truncate">
                  {lightboxItem.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                aria-label="Close full UI preview"
                className="min-h-[36px] inline-flex items-center gap-1.5 bg-[#23282A] hover:bg-[#D9A62E] text-[#EDE9E0] hover:text-[#141617] px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors shrink-0"
              >
                <X className="h-3.5 w-3.5" />
                <span>Close</span>
              </button>
            </div>

            <div className="overflow-auto p-2 sm:p-4 bg-[#0F1112] flex-1 flex items-center justify-center">
              <img
                src={lightboxItem.src}
                alt={lightboxItem.alt}
                className="w-full h-auto max-h-[72vh] object-contain block"
              />
            </div>

            <div className="px-4 py-3 border-t border-[#EDE9E0]/15 bg-[#141617] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <span className="text-[#DFDACE]/70 text-[11px]">
                Uncropped native 16:10 interface capture · Pinch or scroll to inspect details
              </span>
              {lightboxItem.launchUrl && (
                <a
                  href={lightboxItem.launchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#D9A62E] text-[#141617] px-4 py-2 font-bold uppercase tracking-wider hover:bg-[#EDE9E0] transition-colors"
                >
                  <span>{lightboxItem.launchLabel || 'Launch Application'}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </RoomShell>
  );
}
