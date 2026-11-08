import React from 'react';
import { FolderSearch, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import RoomShell from '@/components/room/RoomShell';
import RoomHeading from '@/components/room/RoomHeading';
import LabPromptCard from '@/components/lab/LabPromptCard';
import AdCompositorTool from '@/components/lab/AdCompositorTool';
import ContrastTool from '@/components/lab/ContrastTool';
import TableDocketTool from '@/components/lab/TableDocketTool';
import KineticCanvasTool from '@/components/lab/KineticCanvasTool';
import BarrierMapTool from '@/components/lab/BarrierMapTool';
import AuditLauncherCard from '@/components/lab/AuditLauncherCard';
import { roomById } from '@/lib/rooms';

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
          sub="Where original digital products, AI evaluation tools, and interactive interface experiments are designed and built in working code."
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
                    Working Local-First App
                  </span>
                  <span className="rounded bg-[#D9A62E]/15 border border-[#D9A62E]/40 text-[#D9A62E] px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                    Available for acquisition
                  </span>
                </div>
                <p className="font-mono text-xs text-[#DFDACE]/70 mt-0.5">
                  Binary AI Metadata Extraction • 64-Bit dHash Duplicate Detection • 0–100 Readiness Scoring • Manifest Export
                </p>
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
                Drop a local folder of AI renders, design exports, or screenshots — or click <strong>“Load Sample Studio Dataset”</strong> inside the app to test the entire 5-stage curation workflow immediately in your browser with zero cloud uploads.
              </p>

              <div className="grid grid-cols-5 gap-1.5 font-mono text-[10px]">
                {[
                  { step: '01', name: 'Import', sub: 'Folder / Sample' },
                  { step: '02', name: 'Understand', sub: 'Prompt & Score' },
                  { step: '03', name: 'Organize', sub: 'Tag & Filter' },
                  { step: '04', name: 'Review', sub: 'dHash & Diff' },
                  { step: '05', name: 'Export', sub: 'JSON / CSV' },
                ].map((s) => (
                  <div key={s.step} className="rounded bg-[#1C2022] border border-[#DFDACE]/15 p-2 text-center">
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

        {/* 3. Interactive Workbench Section Header */}
        <div className="border-b border-[#23282A]/20 pb-3 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#23282A]/70 font-bold block">
              FROM THE WORKBENCH
            </span>
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[#23282A]">
              Interactive Instruments &amp; Experiments
            </h2>
          </div>
          <span className="font-mono text-xs text-[#23282A]/60">
            7 Working Experiments &amp; Utilities
          </span>
        </div>

        {/* 3. The 6 Workbench Items Grid */}
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

          {/* Row 2: TableDocket Data Sanitizer & Kinetic Physics Canvas */}
          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            <div className="min-w-0 lg:col-span-7">
              <TableDocketTool />
            </div>
            <div className="min-w-0 lg:col-span-5">
              <KineticCanvasTool />
            </div>
          </div>

          {/* Row 3: Barrier Map & Website Audit Architecture Tool */}
          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            <div className="min-w-0 lg:col-span-5">
              <BarrierMapTool />
            </div>
            <div className="min-w-0 lg:col-span-7">
              <AuditLauncherCard />
            </div>
          </div>
        </div>
      </div>
    </RoomShell>
  );
}
