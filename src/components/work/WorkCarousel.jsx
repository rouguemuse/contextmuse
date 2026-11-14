import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Grid,
  Columns,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { PROJECTS, PROJECT_TIERS } from '@/data/projects';
import ProofViewer from '@/components/work/ProofViewer';
import CapabilityExplorer from '@/components/work/CapabilityExplorer';
import {
  ReservationIllustration,
  AdGeneratorIllustration,
  DataNormalizationIllustration,
  SelfCartographyIllustration,
  SpreadsheetCalculatorDemo,
  DumpsterSizingDemo,
  ManuscriptMatrixIllustration,
} from '@/components/work/FunctionalIllustrations';
import { useBrief } from '@/lib/BriefContext';

export default function WorkCarousel() {
  const { isProjectSaved, toggleSaveProject } = useBrief();
  const scroller = useRef(null);
  const grabbing = useRef(null);
  const [activeTier, setActiveTier] = useState('featured');
  const [viewMode, setViewMode] = useState('reel'); // 'reel' | 'grid'
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(null);

  const filteredProjects = useMemo(() => {
    if (activeTier === 'all') return PROJECTS;
    return PROJECTS.filter((p) => p.tier === activeTier);
  }, [activeTier]);

  const go = (i) => {
    const idx = Math.max(0, Math.min(filteredProjects.length - 1, i));
    setActive(idx);
    const el = scroller.current;
    if (el && el.children[idx]) {
      el.scrollTo({ left: el.children[idx].offsetLeft, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setActive(0);
    if (scroller.current) {
      scroller.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeTier]);

  const start = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    const el = scroller.current;
    if (!el) return;
    grabbing.current = { x: e.clientX, left: el.scrollLeft };
    el.setPointerCapture?.(e.pointerId);
  };
  const move = (e) => {
    if (!grabbing.current || !scroller.current) return;
    scroller.current.scrollLeft = grabbing.current.left - (e.clientX - grabbing.current.x);
  };
  const end = () => {
    grabbing.current = null;
  };

  const renderCoverIllustration = (item) => {
    const type = item.illustrationType;
    switch (type) {
      case 'reservation':
        return <ReservationIllustration interactive={false} />;
      case 'ad-generator':
        return <AdGeneratorIllustration interactive={false} />;
      case 'data-normalization':
        return <DataNormalizationIllustration interactive={false} />;
      case 'dumpster-calc':
        return <DumpsterSizingDemo interactive={false} />;
      case 'manuscript-matrix':
        return <ManuscriptMatrixIllustration interactive={false} />;
      case 'self-cartography':
        return <SelfCartographyIllustration interactive={false} />;
      case 'spreadsheet-calc':
      default:
        return (
          <div className="p-3 font-mono text-[9.5px] text-current select-none flex flex-col justify-between h-full">
            <div className="flex items-center justify-between border-b border-current/15 pb-1 font-bold">
              <span>PARAMETRIC SPEC CALCULATOR</span>
              <span className="opacity-75">Tolerances Linked</span>
            </div>
            <div className="my-1.5 space-y-1 bg-black/10 p-2 rounded">
              <div className="flex justify-between">
                <span>Height × Length:</span>
                <span className="font-bold">36" × 72"</span>
              </div>
              <div className="flex justify-between">
                <span>Air Velocity:</span>
                <span className="font-bold text-emerald-600">444 FPM (Verified)</span>
              </div>
              <div className="flex justify-between">
                <span>Commercial Submittal:</span>
                <span className="font-bold">Ready for Bid ✓</span>
              </div>
            </div>
            <div className="pt-1 border-t border-current/15 flex justify-between opacity-75">
              <span>Visible assumptions</span>
              <span>Submittal Ready →</span>
            </div>
          </div>
        );
    }
  };

  const getActionLabel = (item) => {
    if (item.evidenceType === 'screenshot') return 'View case study';
    if (item.evidenceType === 'interactive-demo') return 'Try the example';
    if (item.evidenceType === 'walkthrough') return 'Watch walkthrough';
    return 'View case study';
  };

  return (
    <div className="mt-6 space-y-16">
      {/* Tier Filter Tabs & View Switcher */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DFDACE]/15 pb-3">
          {/* Tier Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {PROJECT_TIERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTier(t.id)}
                className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors ${
                  activeTier === t.id
                    ? 'bg-[#D9A62E] text-[#23282A] font-bold shadow-sm'
                    : 'text-[#DFDACE]/70 hover:text-[#EDE9E0] hover:bg-[#DFDACE]/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* View Toggle & Reel Navigation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-[#DFDACE]/20 rounded p-0.5 bg-[#1F2325]">
              <button
                onClick={() => setViewMode('reel')}
                aria-label="Reel view"
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'reel'
                    ? 'bg-[#D9A62E] text-[#23282A]'
                    : 'text-[#DFDACE]/60 hover:text-[#EDE9E0]'
                }`}
              >
                <Columns className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#D9A62E] text-[#23282A]'
                    : 'text-[#DFDACE]/60 hover:text-[#EDE9E0]'
                }`}
              >
                <Grid className="h-3.5 w-3.5" />
              </button>
            </div>

            {viewMode === 'reel' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => go(active - 1)}
                  disabled={active === 0}
                  aria-label="Previous project"
                  className="flex h-8 w-8 items-center justify-center border border-[#DFDACE]/20 text-[#EDE9E0] transition-colors hover:border-[#D9A62E] hover:text-[#D9A62E] disabled:opacity-30 rounded"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-xs text-[#DFDACE]/60 px-1">
                  {String(active + 1).padStart(2, '0')}/{String(filteredProjects.length).padStart(2, '0')}
                </span>
                <button
                  onClick={() => go(active + 1)}
                  disabled={active === filteredProjects.length - 1}
                  aria-label="Next project"
                  className="flex h-8 w-8 items-center justify-center border border-[#DFDACE]/20 text-[#EDE9E0] transition-colors hover:border-[#D9A62E] hover:text-[#D9A62E] disabled:opacity-30 rounded"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Exhibition Area */}
        {viewMode === 'reel' ? (
          <div
            ref={scroller}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto overscroll-contain py-6 outline-none active:cursor-grabbing"
          >
            {filteredProjects.map((item) => {
              const saved = isProjectSaved(item.id);
              return (
                <article
                  key={item.id}
                  className="group w-[min(88vw,480px)] shrink-0 snap-start border border-[#DFDACE]/20 bg-[#23282A] p-5 flex flex-col justify-between transition-all duration-300 hover:border-[#D9A62E]/70 shadow-xl rounded"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#DFDACE]/10 pb-2.5">
                      <span className="font-mono text-xs font-bold text-[#D9A62E]">
                        {item.sector}
                      </span>
                      <span className="font-mono text-[11px] text-[#DFDACE]/50">
                        {item.tier === 'featured' ? '★ Featured System' : 'Demonstration'}
                      </span>
                    </div>

                    {/* Characteristic Cover Container (Teal, Mustard, Parchment, Charcoal) with Behavior Illustration */}
                    <div
                      className="relative mt-4 h-[160px] w-full rounded border border-current/20 overflow-hidden shadow-inner flex flex-col justify-between"
                      style={{
                        backgroundColor: item.coverColor || '#17504A',
                        color: item.coverTextColor || '#EDE9E0',
                      }}
                    >
                      {renderCoverIllustration(item)}
                    </div>

                    <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold uppercase leading-tight tracking-tight text-[#EDE9E0] group-hover:text-[#D9A62E] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-[#D9A62E]">{item.subtitle}</p>

                    <p className="mt-2.5 text-xs text-[#DFDACE]/80 leading-relaxed font-sans line-clamp-3">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[#DFDACE]/15 pt-3.5 flex items-center justify-between">
                    <button
                      onClick={() => setOpen(item)}
                      className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#EDE9E0] hover:text-[#D9A62E] font-bold transition-colors"
                    >
                      <span>{getActionLabel(item)}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[11px] text-[#DFDACE]/60 hover:text-[#D9A62E] transition-colors flex items-center gap-1"
                        >
                          <span>Live ↗</span>
                        </a>
                      )}
                      <button
                        onClick={() => toggleSaveProject(item)}
                        className="text-[11px] font-mono text-[#DFDACE]/60 hover:text-[#D9A62E] transition-colors"
                      >
                        {saved ? '✓ Saved' : '+ Save'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 py-6">
            {filteredProjects.map((item) => {
              const saved = isProjectSaved(item.id);
              return (
                <article
                  key={item.id}
                  className="border border-[#DFDACE]/20 bg-[#23282A] p-5 flex flex-col justify-between hover:border-[#D9A62E]/70 transition-colors shadow-lg rounded"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#DFDACE]/10 pb-2">
                      <span className="font-mono text-[11px] font-bold text-[#D9A62E]">
                        {item.sector}
                      </span>
                      <span className="font-mono text-[10px] text-[#DFDACE]/50">{item.year}</span>
                    </div>

                    <div
                      className="relative mt-3 h-[130px] w-full rounded border border-current/20 overflow-hidden"
                      style={{
                        backgroundColor: item.coverColor || '#17504A',
                        color: item.coverTextColor || '#EDE9E0',
                      }}
                    >
                      {renderCoverIllustration(item)}
                    </div>

                    <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-tight text-[#EDE9E0]">
                      {item.title}
                    </h3>
                    <p className="font-mono text-[11px] text-[#D9A62E]">{item.subtitle}</p>

                    <p className="mt-2 text-xs text-[#DFDACE]/80 font-sans leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-[#DFDACE]/15 pt-3 flex items-center justify-between">
                    <button
                      onClick={() => setOpen(item)}
                      className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#EDE9E0] hover:text-[#D9A62E] font-bold transition-colors"
                    >
                      <span>{getActionLabel(item)}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>

                    <button
                      onClick={() => toggleSaveProject(item)}
                      className="text-[11px] font-mono text-[#DFDACE]/60 hover:text-[#D9A62E] transition-colors"
                    >
                      {saved ? '✓ Saved' : '+ Save'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Reusable Capabilities Explorer */}
      <div className="border-t border-[#DFDACE]/15 pt-12">
        <CapabilityExplorer onSelectProject={(project) => setOpen(project)} />
      </div>

      {/* Case Study Modal (ProofViewer) */}
      {open && <ProofViewer item={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
