import React from 'react';
import {
  FolderSearch,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Activity,
  Compass,
  BookOpen,
  ShieldCheck,
  LayoutDashboard,
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
    badge: 'Live Interactive Workbench',
    category: 'Hospitality & POS Intelligence',
    title: 'Signal — Restaurant Operational Analysis',
    subtitle: '3-stage multi-report POS correlation & prioritized GM action engine',
    description:
      'Ingests sales, labor punches, comps, voids, and kitchen timing exports (or runs realistic multi-concept restaurant presets) to surface the top operational leaks worth fixing first.',
    primaryUrl: '/signal/demo/',
    primaryLabel: 'Launch Interactive Demo',
    secondaryUrl: '/signal/',
    secondaryLabel: 'Product Overview',
    icon: Activity,
  },
  {
    id: 'self-cartography',
    badge: 'Live Standalone Engine',
    category: 'Explainable Scoring & Spatial UI',
    title: 'Self-Cartography V1',
    subtitle: 'Full-screen behavioral-pattern & topological coordinate engine',
    description:
      'Maps structured scenario reflections into an interactive 2D topological landscape using 100% transparent, inspectable client-side vector weights with zero clinical labels.',
    primaryUrl: '/cartography/',
    primaryLabel: 'Launch Cartography V1',
    icon: Compass,
  },
  {
    id: 'wcsm',
    badge: 'Live Automated Directory',
    category: 'Editorial Tooling & Crawlers',
    title: 'Writing Contest Submission Manager',
    subtitle: '60+ vetted literary contests with weekly crawler verification & tracker',
    description:
      'Combines an automated weekly GitHub Actions deadline crawler with an instant multi-facet filter and browser-local submission status tracker for fiction, poetry, and essays.',
    primaryUrl: '/wcsm/',
    primaryLabel: 'Launch Contest Directory',
    icon: BookOpen,
  },
  {
    id: 'website-system-check',
    badge: 'Live Diagnostic Utility',
    category: 'Multi-Viewport UX Engineering',
    title: 'Website + System Check',
    subtitle: 'Side-by-side Desktop, Tablet & Mobile viewport diagnostic inspector',
    description:
      'Loads target URLs across synchronized responsive viewports and evaluates structural clarity across Message, Paths, Proof, and Intake.',
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
    <RoomShell room={room}>
      <div className="w-full min-w-0 px-4 pb-14 pt-7 sm:px-8 sm:pb-16 sm:pt-10 lg:px-10 space-y-8 font-sans">
        <RoomHeading
          num={room.num}
          verb={room.verb}
          badge="Original Products, AI Tools & Interactive Instruments"
          title="The Lab."
          watermark={room.num}
          sub="Where original digital products, AI evaluation tools, and interactive utilities are designed and built in working code."
        />

        {/* 1. Workbench Creative Prompts Card */}
        <LabPromptCard onSelectTool={scrollToTool} />

        {/* 2. Featured Standalone Application: GenSort */}
        <div
          id="tool-gensort"
          className="rounded-xl border-2 border-[#23282A] bg-[#141617] text-[#EDE9E0] p-5 sm:p-7 shadow-2xl space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFDACE]/15 pb-4">
            <div className="flex items-center gap-2.5">
              <FolderSearch className="h-5 w-5 text-[#D9A62E]" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#EDE9E0]">
                    GenSort Studio — Local-First Asset Curation Engine
                  </h2>
                  <span className="rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                    Live Standalone App
                  </span>
                </div>
                <span className="font-mono text-xs text-[#D9A62E]">
                  5-Stage AI Prompt Lineage, 64-Bit Perceptual Hashing &amp; Manifest Export
                </span>
              </div>
            </div>

            <a
              href="/cxm_gensort/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded bg-[#D9A62E] text-[#141617] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#e0b240] transition-colors shadow-md"
            >
              <span>Launch GenSort App</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs sm:text-sm text-[#DFDACE]/90 leading-relaxed">
                Drop a local folder of AI renders, design exports, or screenshots — or click{' '}
                <strong>“Load Sample Studio Dataset”</strong> inside the app to test the entire
                5-stage curation workflow immediately in your browser with zero cloud uploads.
              </p>

              <div className="grid grid-cols-5 gap-1.5 font-mono text-[10px]">
                {[
                  { step: '01', name: 'Import', sub: 'Folder / Sample' },
                  { step: '02', name: 'Understand', sub: 'Prompt & Score' },
                  { step: '03', name: 'Organize', sub: 'Tag & Filter' },
                  { step: '04', name: 'Review', sub: 'dHash & Diff' },
                  { step: '05', name: 'Export', sub: 'JSON / CSV' },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="rounded bg-[#1C2022] border border-[#DFDACE]/15 p-2 text-center"
                  >
                    <span className="block text-[#D9A62E] font-bold">{s.step}</span>
                    <span className="block font-bold text-[#EDE9E0] truncate">{s.name}</span>
                    <span className="block text-[8.5px] text-[#DFDACE]/50 truncate">{s.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-3">
              <div className="rounded-lg overflow-hidden border border-white/10 bg-[#0A0C0D]">
                <img
                  src="/assets/images/gensort-library.webp"
                  alt="GenSort Library & Readiness Inspector"
                  className="w-full h-36 object-cover object-top"
                  loading="lazy"
                />
                <div className="px-2.5 py-1.5 font-mono text-[10px] text-[#DFDACE]/75 border-t border-white/10">
                  Library Grid &amp; AI Metadata Inspector
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border border-white/10 bg-[#0A0C0D]">
                <img
                  src="/assets/images/gensort-compare.webp"
                  alt="GenSort Side-by-Side Compare & Parameter Diff"
                  className="w-full h-36 object-cover object-top"
                  loading="lazy"
                />
                <div className="px-2.5 py-1.5 font-mono text-[10px] text-[#DFDACE]/75 border-t border-white/10">
                  Side-by-Side Compare &amp; Parameter Diff
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Live Standalone Applications & Hosted Products */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#23282A]/20 pb-3">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#23282A]/75 font-bold block">
                LIVE STANDALONE APPLICATIONS HOSTED ON CONTEXTMUSE
              </span>
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[#23282A]">
                Working Software &amp; Operational Products
              </h2>
            </div>
            <a
              href="/inncontrol-v2/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider bg-[#23282A] text-[#EDE9E0] px-3 py-1.5 rounded hover:bg-[#17504A] transition-colors self-start sm:self-auto"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-[#D9A62E]" />
              <span>Also Live: INNcontrol Operator HUD (/inncontrol-v2/)</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {STANDALONE_APPS.map((app) => {
              const Icon = app.icon;
              return (
                <div
                  key={app.id}
                  className="flex flex-col justify-between rounded-xl border-2 border-[#23282A] bg-[#1B1F21] text-[#EDE9E0] p-5 shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                      <span className="flex items-center gap-1.5 text-[#D9A62E] font-bold uppercase tracking-wider">
                        <Icon className="h-3.5 w-3.5" />
                        <span>{app.category}</span>
                      </span>
                      <span className="rounded bg-[#17504A] text-[#EDE9E0] border border-emerald-400/30 px-2 py-0.5 font-bold uppercase">
                        {app.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-[#EDE9E0]">
                        {app.title}
                      </h3>
                      <p className="font-mono text-xs text-[#D9A62E] mt-0.5">{app.subtitle}</p>
                    </div>

                    <p className="font-sans text-xs text-[#DFDACE]/85 leading-relaxed">
                      {app.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#DFDACE]/15 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <a
                      href={app.primaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded bg-[#D9A62E] px-3.5 py-2 font-bold uppercase tracking-wider text-[#141617] hover:bg-[#e0b240] transition-colors"
                    >
                      <span>{app.primaryLabel}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    {app.secondaryUrl && (
                      <a
                        href={app.secondaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded border border-[#DFDACE]/25 px-3 py-2 text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
                      >
                        <span>{app.secondaryLabel}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Interactive Workbench Section Header */}
        <div className="border-b border-[#23282A]/20 pb-3 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#23282A]/70 font-bold block">
              FROM THE WORKBENCH
            </span>
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[#23282A]">
              Interactive Utilities &amp; Diagnostic Instruments
            </h2>
          </div>
          <span className="font-mono text-xs text-[#23282A]/60">
            5 Working Utilities with Direct Export
          </span>
        </div>

        {/* 5. The 5 Practical Workbench Utilities Grid */}
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

          {/* Row 3: Barrier Map Civic Continuity Inspector */}
          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            <div className="min-w-0 lg:col-span-12">
              <BarrierMapTool />
            </div>
          </div>
        </div>
      </div>
    </RoomShell>
  );
}
