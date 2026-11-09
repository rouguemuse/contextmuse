import React from 'react';
import {
  ExternalLink,
  Activity,
  Compass,
  BookOpen,
  ShieldCheck,
  ArrowUpRight,
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
    category: 'Hospitality & POS Intelligence',
    title: 'Signal — Restaurant Operational Analysis',
    subtitle: '3-stage multi-report POS correlation & prioritized GM action engine',
    description:
      'Ingests sales, labor punches, comps, voids, and kitchen timing exports—or runs realistic multi-concept presets—to surface the top operational leaks worth fixing first.',
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
    category: 'Explainable Scoring & Spatial UI',
    title: 'Self-Cartography V1',
    subtitle: 'Full-screen behavioral-pattern & topological coordinate engine',
    description:
      'Maps structured scenario reflections into an interactive 2D topological landscape using transparent, inspectable client-side vector weights with zero clinical labels.',
    image: '/assets/images/self_cartography_mockup.jpg',
    imageAlt: 'Self-Cartography V1 topological map interface',
    primaryUrl: '/cartography/',
    primaryLabel: 'Launch Cartography V1',
    icon: Compass,
  },
  {
    id: 'wcsm',
    category: 'Editorial Tooling & Crawlers',
    title: 'Writing Contest Submission Manager',
    subtitle: '60+ vetted literary contests with weekly crawler verification & tracker',
    description:
      'Combines an automated weekly GitHub Actions deadline crawler with an instant multi-facet filter and browser-local submission status tracker for fiction, poetry, and essays.',
    image: '/assets/images/contest-atlas-hero.webp',
    imageAlt: 'Writing Contest Submission Manager directory interface',
    primaryUrl: '/wcsm/',
    primaryLabel: 'Launch Contest Directory',
    icon: BookOpen,
  },
  {
    id: 'website-system-check',
    category: 'Multi-Viewport UX Diagnostics',
    title: 'Website + System Check',
    subtitle: 'Side-by-side Desktop, Tablet & Mobile viewport diagnostic inspector',
    description:
      'Loads target URLs across synchronized responsive viewports and evaluates structural clarity across Message, Paths, Proof, and Intake.',
    image: '/assets/images/website-audit-hero.webp',
    imageAlt: 'Website + System Check multi-viewport diagnostic tool',
    primaryUrl: '/website-system-check/',
    primaryLabel: 'Launch Viewport Inspector',
    icon: ShieldCheck,
  },
];

export default function Lab() {
  const room = roomById('lab');

  const scrollToTool = (target) => {
    if (target.startsWith('#')) {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
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
      <div className="mx-auto w-full max-w-[1380px] min-w-0 px-4 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-12 lg:px-12 space-y-16 sm:space-y-20 font-sans">
        <RoomHeading
          num={room.num}
          verb={room.verb}
          badge="Original Products, AI Tools & Interactive Instruments"
          title="The Lab."
          watermark={room.num}
          accentColor="#D9A62E"
          sub="Where original digital products, AI evaluation systems, and interactive utilities are designed and built in working code."
        />

        {/* =================================================================
            SECTION 01: STANDALONE SOFTWARE PRODUCTS
           ================================================================= */}
        <section aria-labelledby="lab-standalone-heading" className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#23282A]/15 pb-4">
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
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Flagship Product Showcase: GenSort Studio */}
          <article
            id="tool-gensort"
            className="bg-[#FAF8F5] border border-[#23282A]/15 border-t-[3px] border-t-[#D9A62E] p-6 sm:p-8 lg:p-10 shadow-sm space-y-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#23282A]/12 pb-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#23282A]/65">
                  <span className="text-[#9A6F0B] font-bold">Flagship Standalone Application</span>
                  <span>•</span>
                  <span>5-Stage AI Prompt Lineage &amp; 64-Bit Perceptual Hashing</span>
                </div>
                <h3 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#23282A] leading-none">
                  GenSort Studio — Local-First Asset Curation Engine
                </h3>
              </div>

              <a
                href="/cxm_gensort/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 bg-[#23282A] text-[#EDE9E0] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#D9A62E] hover:text-[#141617] transition-colors self-start lg:self-auto"
              >
                <span>Launch GenSort Studio</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Neutral Presentation Frame for Authentic GenSort Screenshots */}
            <div className="grid gap-6 md:grid-cols-2">
              <figure className="bg-[#EDE9E0]/55 border border-[#23282A]/12 p-3 sm:p-4 space-y-3">
                <div className="overflow-hidden border border-[#23282A]/15 bg-[#141617] aspect-[16/10]">
                  <img
                    src="/assets/images/gensort-library.webp"
                    alt="GenSort Studio Library Grid and AI Metadata Inspector"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <figcaption className="flex items-center justify-between font-mono text-[11px] text-[#23282A]/75 px-0.5">
                  <span className="font-semibold text-[#23282A]">01 / Library Grid &amp; AI Metadata Inspector</span>
                  <span>Local Browser Workspace</span>
                </figcaption>
              </figure>

              <figure className="bg-[#EDE9E0]/55 border border-[#23282A]/12 p-3 sm:p-4 space-y-3">
                <div className="overflow-hidden border border-[#23282A]/15 bg-[#141617] aspect-[16/10]">
                  <img
                    src="/assets/images/gensort-compare.webp"
                    alt="GenSort Studio Side-by-Side Compare and Parameter Diff"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <figcaption className="flex items-center justify-between font-mono text-[11px] text-[#23282A]/75 px-0.5">
                  <span className="font-semibold text-[#23282A]">02 / Side-by-Side Compare &amp; Parameter Diff</span>
                  <span>64-Bit dHash Similarity</span>
                </figcaption>
              </figure>
            </div>

            {/* Description + 5-Stage Pipeline Strip */}
            <div className="grid gap-6 lg:grid-cols-12 items-center pt-1">
              <p className="lg:col-span-5 text-sm text-[#23282A]/80 leading-relaxed">
                Drop a local folder of AI renders, design exports, or screenshots—or click{' '}
                <strong className="text-[#23282A]">“Load Sample Studio Dataset”</strong> inside the app—to run the complete 5-stage curation workflow in your browser with zero cloud uploads.
              </p>

              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px]">
                {[
                  { step: '01', name: 'Import', sub: 'Folder / Sample' },
                  { step: '02', name: 'Understand', sub: 'Prompt & Score' },
                  { step: '03', name: 'Organize', sub: 'Tag & Filter' },
                  { step: '04', name: 'Review', sub: 'dHash & Diff' },
                  { step: '05', name: 'Export', sub: 'JSON / CSV' },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="bg-[#EDE9E0]/70 border border-[#23282A]/12 px-3 py-2.5"
                  >
                    <span className="block text-[10px] text-[#9A6F0B] font-bold">{s.step}</span>
                    <span className="block font-bold text-[#23282A] truncate mt-0.5">{s.name}</span>
                    <span className="block text-[10px] text-[#23282A]/60 truncate">{s.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* 2x2 Standalone Product Gallery */}
          <div className="grid gap-6 md:grid-cols-2">
            {STANDALONE_APPS.map((app) => {
              return (
                <article
                  key={app.id}
                  className="flex flex-col justify-between bg-[#FAF8F5] border border-[#23282A]/15 shadow-sm overflow-hidden"
                >
                  <div>
                    {/* Consistent Neutral Preview Frame */}
                    <div className="bg-[#EDE9E0]/60 border-b border-[#23282A]/12 p-3 sm:p-4">
                      <div className="overflow-hidden border border-[#23282A]/15 bg-[#141617] aspect-[16/9]">
                        <img
                          src={app.image}
                          alt={app.imageAlt}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#9A6F0B] font-bold">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D9A62E]" />
                        <span>{app.category}</span>
                      </div>

                      <div>
                        <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#23282A]">
                          {app.title}
                        </h3>
                        <p className="font-mono text-xs text-[#23282A]/65 mt-1">
                          {app.subtitle}
                        </p>
                      </div>

                      <p className="font-sans text-xs sm:text-sm text-[#23282A]/80 leading-relaxed pt-1">
                        {app.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-[#EDE9E0]/35 border-t border-[#23282A]/12 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                    <a
                      href={app.primaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#23282A] px-4 py-2.5 font-bold uppercase tracking-wider text-[#EDE9E0] hover:bg-[#D9A62E] hover:text-[#141617] transition-colors"
                    >
                      <span>{app.primaryLabel}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    {app.secondaryUrl && (
                      <a
                        href={app.secondaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#23282A]/75 hover:text-[#23282A] underline underline-offset-4 transition-colors py-1"
                      >
                        <span>{app.secondaryLabel}</span>
                        <ExternalLink className="h-3 w-3" />
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
        <section aria-labelledby="lab-utilities-heading" className="space-y-8">
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
              Focused browser instruments for testing layout hierarchy, WCAG contrast, data normalization, and workflow friction.
            </p>
          </div>

          <div className="space-y-6">
            {/* Row 1: Ad Compositor & Color Contrast Utility */}
            <div className="grid gap-6 lg:grid-cols-12 items-stretch">
              <div className="min-w-0 lg:col-span-7">
                <AdCompositorTool />
              </div>
              <div className="min-w-0 lg:col-span-5">
                <ContrastTool />
              </div>
            </div>

            {/* Row 2: TableDocket Data Sanitizer & Website Audit Architecture Tool */}
            <div className="grid gap-6 lg:grid-cols-12 items-stretch">
              <div className="min-w-0 lg:col-span-6">
                <TableDocketTool />
              </div>
              <div className="min-w-0 lg:col-span-6">
                <AuditLauncherCard />
              </div>
            </div>

            {/* Row 3: Barrier Map & Workbench Creative Prompts */}
            <div className="grid gap-6 lg:grid-cols-12 items-stretch">
              <div className="min-w-0 lg:col-span-7">
                <BarrierMapTool />
              </div>
              <div className="min-w-0 lg:col-span-5">
                <LabPromptCard onSelectTool={scrollToTool} />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 03: RESEARCH & DESIGN INTELLIGENCE EXPERIMENTS
           ================================================================= */}
        <section aria-labelledby="lab-experiments-heading" className="space-y-6">
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

          <article className="bg-[#FAF8F5] border border-[#23282A]/15 border-l-4 border-l-[#D9A62E] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#23282A]/65">
                <span className="text-[#9A6F0B] font-bold">Experiment 01</span>
                <span>•</span>
                <span>Baseline 52e179d → Experiment 195921a</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#23282A]">
                Design Intelligence Case Study: Locomotive Token Extraction &amp; Before/After Slider
              </h3>
              <p className="text-xs sm:text-sm text-[#23282A]/80 leading-relaxed">
                Interactive desktop (1440×900) and mobile (390×844) before-and-after comparison slider, live quintic
                hover timing sandbox (450ms enter / 200ms leave), and measured DOM plumb-line verification (24px → 0px
                variance).
              </p>
            </div>
            <a
              href="/lab/design-intelligence"
              className="shrink-0 inline-flex items-center gap-2 bg-[#23282A] text-[#EDE9E0] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#D9A62E] hover:text-[#141617] transition-colors self-start lg:self-auto"
            >
              <span>Open Interactive Case Study</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </article>
        </section>
      </div>
    </RoomShell>
  );
}
