import React from 'react';
import {
  ArrowRight,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Activity,
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  Compass,
  Layers,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';

export default function SignalShowcase({ onOpenCaseStudy }) {
  const { isProjectSaved, toggleSaveProject } = useBrief();
  const savedSignal = isProjectSaved('signal-ops');
  const savedGensort = isProjectSaved('gensort-studio');

  return (
    <section id="signal-and-products" className="space-y-8 border-t border-[#DFDACE]/15 pt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFDACE]/15 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono text-xs">
            <span className="rounded bg-[#D9A62E] text-[#141617] px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
              Live Software Product
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Interactive Workbench Live
            </span>
            <span className="text-[#DFDACE]/60">• Hospitality &amp; Decision Intelligence</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#EDE9E0]">
            Signal — Operational Intelligence
          </h2>
          <p className="mt-0.5 font-mono text-xs sm:text-sm text-[#D9A62E]">
            Multi-Report Restaurant POS Triage &amp; Prioritized Operator Action Engine
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onOpenCaseStudy('signal-ops')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded bg-[#D9A62E] text-[#141617] hover:bg-[#e0b240] transition-colors"
          >
            <span>Inspect Case Study</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <a
            href="/signal/demo/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded bg-[#17504A] text-[#EDE9E0] border border-emerald-500/40 hover:bg-[#1e665e] transition-colors"
          >
            <span>Launch Interactive Demo</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#D9A62E]" />
          </a>

          <a
            href="/signal/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded border border-[#DFDACE]/25 text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
          >
            <span>Product Page</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={() =>
              toggleSaveProject({
                id: 'signal-ops',
                title: 'Signal',
                subtitle: 'Restaurant Operational Intelligence & Multi-Report POS Triage',
                tier: 'featured',
              })
            }
            title={savedSignal ? 'Saved in My Ideas' : 'Save to My Ideas'}
            className={`p-1.5 rounded border transition-colors ${
              savedSignal
                ? 'border-[#D9A62E] bg-[#D9A62E]/20 text-[#D9A62E]'
                : 'border-[#DFDACE]/25 text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E]'
            }`}
          >
            {savedSignal ? (
              <BookmarkCheck className="h-4 w-4 text-[#D9A62E]" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Signal Preview + How Signal Works */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left 7 Columns: Signal Production Preview */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-[#DFDACE]/60 px-1">
            <span className="font-bold text-[#D9A62E] uppercase tracking-wider">
              Live Workbench (/signal/ &amp; /signal/demo/)
            </span>
            <span>3-Stage POS &amp; Operational Analysis</span>
          </div>

          <div className="rounded-xl border border-[#D9A62E]/35 bg-[#121517] overflow-hidden shadow-xl p-2">
            <div className="rounded-lg overflow-hidden border border-white/10 relative bg-[#0E1113]">
              <img
                src="/assets/images/signal-social-preview.jpg"
                alt="Signal Restaurant Operational Intelligence"
                className="w-full h-auto object-cover max-h-[420px] block"
                loading="lazy"
              />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap items-center justify-between gap-2 bg-[#121517]/95 backdrop-blur-sm border border-[#D9A62E]/40 px-3 py-2 rounded font-mono text-[10px] text-[#EDE9E0]">
                <span>
                  Cross-analyzes Sales, Labor, Comps, Voids &amp; Kitchen Ticket Timing
                </span>
                <a
                  href="/signal/demo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D9A62E] font-bold underline hover:text-white"
                >
                  Open /signal/demo/ →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Operational Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-[#16191B] border border-[#DFDACE]/15 space-y-2 font-sans text-xs">
            <span className="font-mono text-xs font-bold text-[#D9A62E] uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>01 / Zero-Integration Report Ingestion</span>
            </span>
            <p className="text-[#DFDACE]/90 leading-relaxed">
              Operators already export sales, labor punches, comp logs, and kitchen timing from their POS. Signal ingests those raw files directly (or lets visitors test realistic restaurant concept presets in the live demo) without requiring months of POS API lock-in.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#16191B] border border-emerald-500/25 space-y-2 font-sans text-xs">
            <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              <span>02 / Cross-Signal Correlation Engine</span>
            </span>
            <p className="text-[#DFDACE]/90 leading-relaxed">
              Instead of handing a general manager 40 disconnected charts, Signal correlates anomalies across reports—connecting Friday PM kitchen ticket lag to server comp spikes and late-shift overtime.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121517] border border-[#D9A62E]/30 font-mono text-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-[#D9A62E] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>03 / Also Built &amp; Running Live in This Repo</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="rounded bg-[#1A1E20] border border-[#DFDACE]/15 p-2.5 flex flex-col justify-between">
                <div>
                  <span className="text-[#D9A62E] font-bold block">GenSort Studio</span>
                  <span className="text-[10px] text-[#DFDACE]/75 font-sans block mt-0.5">
                    5-Stage local-first AI asset curation &amp; binary PNG/WebP metadata workbench.
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <a
                    href="/cxm_gensort/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold underline hover:text-white text-[10px]"
                  >
                    Launch App →
                  </a>
                  <button
                    type="button"
                    onClick={() => onOpenCaseStudy('gensort-studio')}
                    className="text-[#DFDACE]/70 hover:text-white text-[10px] underline"
                  >
                    Case Study
                  </button>
                </div>
              </div>

              <div className="rounded bg-[#1A1E20] border border-[#DFDACE]/15 p-2.5 flex flex-col justify-between">
                <div>
                  <span className="text-[#D9A62E] font-bold block">Self-Cartography V1</span>
                  <span className="text-[10px] text-[#DFDACE]/75 font-sans block mt-0.5">
                    Standalone explainable behavioral-pattern &amp; topological coordinate engine.
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <a
                    href="/cartography/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold underline hover:text-white text-[10px]"
                  >
                    Launch App →
                  </a>
                  <button
                    type="button"
                    onClick={() => onOpenCaseStudy('self-cartography')}
                    className="text-[#DFDACE]/70 hover:text-white text-[10px] underline"
                  >
                    Case Study
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
