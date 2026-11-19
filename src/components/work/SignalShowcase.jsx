import React from 'react';
import {
  ArrowRight,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Activity,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';
import EditorialEvidenceFrame from '@/components/work/EditorialEvidenceFrame';
import { PROJECT_EVIDENCE_PLATES } from '@/components/work/workData';

const COMPANION_PRODUCTS = [
  {
    id: 'gensort',
    category: 'Local-First AI Asset Workbench',
    badge: 'Working Application',
    title: 'GenSort Studio',
    subtitle: '5-Stage Visual Asset Classification, AI Metadata & dHash Curation Engine',
    summary:
      'Ingests mixed folders of AI renders, screenshots, and design assets locally in the browser to recover binary PNG/EXIF prompts, flag perceptual duplicates via 64-bit dHash, and export clean JSON/CSV manifests.',
    mediaUrl: '/assets/captures/gensort-live.jpg',
    plates: PROJECT_EVIDENCE_PLATES.gensort,
    liveUrl: '/cxm_gensort/index.html',
    liveLabel: 'Launch App',
  },
  {
    id: 'self-cartography',
    category: 'Explainable Scoring & Spatial UI',
    badge: 'Working Application',
    title: 'Self-Cartography V1',
    subtitle: 'Explainable Behavioral-Pattern & Topological Reflection Engine',
    summary:
      'Translates multi-step scenario reflections into an interactive 2D topological coordinate landscape using transparent, inspectable client-side vector weights with zero clinical labels.',
    mediaUrl: '/assets/captures/self-cartography-live.jpg',
    plates: null,
    liveUrl: '/cartography/',
    liveLabel: 'Launch App',
  },
  {
    id: 'wcsm',
    category: 'Automated Editorial Directory',
    badge: 'Working Application',
    title: 'Writing Contest Submission Manager',
    subtitle: '60+ Vetted Literary Contests, Weekly Deadline Crawler & Tracker',
    summary:
      'Combines an automated weekly GitHub Actions verification crawler with an instant multi-facet filter and browser-local submission status ledger for fiction, poetry, and essays.',
    mediaUrl: '/assets/images/contest-atlas-cover.webp',
    plates: null,
    liveUrl: '/wcsm/',
    liveLabel: 'Launch App',
  },
];

export default function SignalShowcase({ onOpenCaseStudy }) {
  const { isProjectSaved, toggleSaveProject } = useBrief();
  const savedSignal = isProjectSaved('signal-ops');

  return (
    <section
      id="signal-and-products"
      aria-labelledby="work-software-products-heading"
      className="space-y-8 border-t border-[#DFDACE]/20 pt-14"
    >
      {/* Section 02 Header: Original Software Products */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DFDACE]/15 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#D9A62E] font-bold">
            <span className="inline-block h-2 w-2 bg-[#17504A] border border-[#D9A62E]" />
            <span>02 / Original Software Products</span>
          </div>
          <h2
            id="work-software-products-heading"
            className="mt-1.5 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#EDE9E0]"
          >
            Standalone Applications &amp; Local-First Workbenches
          </h2>
        </div>

        <span className="font-mono text-xs text-[#DFDACE]/65">
          Built, Hosted &amp; Running Live in Working Code
        </span>
      </div>

      {/* Lead Software Product Card: Signal — Operational Intelligence */}
      <article className="bg-[#1B1F21] border border-[#DFDACE]/20 border-t-[3px] border-t-[#17504A] p-6 sm:p-8 lg:p-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-[#DFDACE]/15 pb-6">
          <div className="min-w-0 space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
              <span className="bg-[#17504A] text-[#EDE9E0] border border-[#EDE9E0]/20 px-2.5 py-0.5 font-bold">
                Original Software Product
              </span>
              <span className="border border-[#D9A62E]/40 bg-[#141719] text-[#D9A62E] px-2.5 py-0.5 font-bold">
                Interactive Workbench Live
              </span>
              <span className="text-[#DFDACE]/60">Hospitality &amp; Decision Intelligence</span>
            </div>

            <h3 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#EDE9E0] leading-none">
              Signal — Operational Intelligence
            </h3>
            <p className="font-mono text-xs sm:text-sm text-[#D9A62E]">
              Multi-Report Restaurant POS Triage &amp; Prioritized Operator Action Engine
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#DFDACE]/80 leading-relaxed pt-0.5">
              Ingests standard POS exports directly and correlates anomalies across sales, labor punches, comps, and kitchen ticket lag into a ranked pre-shift briefing.
            </p>
          </div>

          {/* Action Buttons (Consistent 0px Editorial Controls) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 font-mono text-xs">
            <button
              type="button"
              onClick={() => onOpenCaseStudy('signal-ops')}
              className="inline-flex items-center gap-2 bg-[#D9A62E] text-[#141617] px-4 py-2.5 font-bold uppercase tracking-wider hover:bg-[#EDE9E0] transition-colors"
            >
              <span>Inspect Case Study</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <a
              href="/signal/demo/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#17504A] text-[#EDE9E0] border border-[#EDE9E0]/25 px-3.5 py-2.5 font-bold uppercase tracking-wider hover:bg-[#1e665e] transition-colors"
            >
              <span>Launch Interactive Demo</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#D9A62E]" />
            </a>

            <a
              href="/signal/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[#DFDACE]/25 bg-[#141719] text-[#EDE9E0] px-3.5 py-2.5 font-bold uppercase tracking-wider hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
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
              aria-label={savedSignal ? 'Saved in My Ideas' : 'Save to My Ideas'}
              className={`p-2.5 border transition-colors ${
                savedSignal
                  ? 'border-[#D9A62E] bg-[#D9A62E]/20 text-[#D9A62E]'
                  : 'border-[#DFDACE]/25 bg-[#141719] text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E]'
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

        {/* 12-Column Architectural Spread: Editorial Evidence Frame (7 Cols) + Product Specification (5 Cols) */}
        <div className="grid gap-6 lg:grid-cols-12 items-stretch min-w-0">
          {/* Left 7 Columns: Composed Editorial Evidence Frame */}
          <div className="lg:col-span-7 min-w-0 flex flex-col justify-between">
            <EditorialEvidenceFrame
              title="Signal — Operational Intelligence"
              plates={PROJECT_EVIDENCE_PLATES['signal-ops']}
              variant="lead"
              showDualCompanionStrip={true}
              accentColor="#17504A"
              liveUrl="/signal/demo/"
            />
          </div>

          {/* Right 5 Columns: Unified Operational Intelligence Architecture */}
          <div className="lg:col-span-5 min-w-0 flex flex-col justify-between bg-[#141719] border border-[#DFDACE]/15 p-5 sm:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#DFDACE]/12 pb-2.5">
                <span className="font-mono text-xs font-bold text-[#D9A62E] uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 shrink-0" />
                  <span>Multi-Report Correlation Engine</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#DFDACE]/55">
                  Zero POS Lock-In
                </span>
              </div>

              <p className="font-sans text-xs sm:text-[13.5px] text-[#EDE9E0]/90 leading-relaxed">
                Instead of handing a restaurant general manager 40 disconnected charts before Friday service, Signal ingests standard POS exports directly and correlates anomalies across sales, labor punches, comps, and kitchen ticket lag into a ranked shift briefing.
              </p>

              <div className="divide-y divide-[#DFDACE]/10 border-t border-b border-[#DFDACE]/12 font-sans text-xs">
                <div className="py-2.5 flex items-start gap-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-[#D9A62E] shrink-0 pt-0.5">01</span>
                  <div>
                    <strong className="font-mono text-[11px] uppercase tracking-wider text-[#EDE9E0] block">
                      Zero-Integration Report Ingestion
                    </strong>
                    <span className="text-[#DFDACE]/75 text-xs">
                      Reads raw POS CSV/XLSX exports (or multi-concept demo presets) immediately without vendor lock-in.
                    </span>
                  </div>
                </div>
                <div className="py-2.5 flex items-start gap-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-[#D9A62E] shrink-0 pt-0.5">02</span>
                  <div>
                    <strong className="font-mono text-[11px] uppercase tracking-wider text-[#EDE9E0] block">
                      Cross-Signal Anomaly Correlation
                    </strong>
                    <span className="text-[#DFDACE]/75 text-xs">
                      Connects kitchen ticket lag directly to server comp spikes and late-shift overtime.
                    </span>
                  </div>
                </div>
                <div className="py-2.5 flex items-start gap-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-[#D9A62E] shrink-0 pt-0.5">03</span>
                  <div>
                    <strong className="font-mono text-[11px] uppercase tracking-wider text-[#EDE9E0] block">
                      Ranked GM Action Dossier
                    </strong>
                    <span className="text-[#DFDACE]/75 text-xs">
                      Scores leaks by dollar impact and controllability for immediate pre-shift action.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#101214] border border-[#17504A] px-3.5 py-2.5 font-mono text-[11px] text-[#EDE9E0] flex flex-wrap items-center justify-between gap-2">
              <span className="text-[#D9A62E] font-bold uppercase">Signal #01 [HIGH]:</span>
              <span>Friday PM Bar Comps + Kitchen Ticket Lag</span>
            </div>
          </div>
        </div>
      </article>

      {/* Companion Standalone Software Grid: Composed Project Covers (Metadata → Title → Description → Framed Evidence → Actions) */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch min-w-0">
        {COMPANION_PRODUCTS.map((prod) => (
          <article
            key={prod.id}
            className="min-w-0 flex flex-col justify-between bg-[#1B1F21] border border-[#DFDACE]/20 border-t-[3px] border-t-[#17504A]"
          >
            {/* 1. Editorial Project Cover Header (Metadata → Prominent Title → Short Contextual Description) */}
            <div className="min-w-0 p-5 sm:p-6 pb-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
                  <span className="text-[#D9A62E] font-bold">{prod.category}</span>
                  <span className="border border-[#17504A] bg-[#17504A]/30 text-[#EDE9E0] px-2 py-0.5">
                    {prod.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#EDE9E0] leading-tight">
                    {prod.title}
                  </h3>
                  <p className="font-mono text-xs text-[#D9A62E] mt-1">
                    {prod.subtitle}
                  </p>
                </div>

                <p className="font-sans text-xs sm:text-[13px] text-[#DFDACE]/85 leading-relaxed">
                  {prod.summary}
                </p>
              </div>

              {/* 2. Carefully Framed Authentic Visual Area */}
              <div className="pt-2">
                <EditorialEvidenceFrame
                  src={prod.mediaUrl}
                  alt={`${prod.title} interface preview`}
                  title={prod.title}
                  plates={prod.plates}
                  variant="card"
                  accentColor="#17504A"
                  liveUrl={prod.liveUrl}
                />
              </div>
            </div>

            {/* 3. Bottom-Aligned CTA Bar */}
            <div className="px-5 sm:px-6 py-3.5 bg-[#141719] border-t border-[#DFDACE]/15 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => onOpenCaseStudy(prod.id)}
                className="inline-flex items-center gap-1.5 bg-[#D9A62E] text-[#141617] px-3.5 py-2 font-bold uppercase tracking-wider hover:bg-[#EDE9E0] transition-colors"
              >
                <span>Case Study</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <a
                href={prod.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-[#DFDACE]/25 bg-[#1B1F21] text-[#EDE9E0] px-3 py-2 font-bold uppercase tracking-wider hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
              >
                <span>{prod.liveLabel}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
