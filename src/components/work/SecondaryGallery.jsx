import React, { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { PROJECTS } from '@/data/projects';
import { useBrief } from '@/lib/BriefContext';
import {
  ReservationIllustration,
  CivicContinuityIllustration,
  WolvesLiteraryIllustration,
  GenSortWorkflowIllustration,
} from '@/components/work/FunctionalIllustrations';

export default function SecondaryGallery({ onOpenCaseStudy }) {
  const { isProjectSaved, toggleSaveProject } = useBrief();
  const [filter, setFilter] = useState('all');

  // Secondary projects: all projects excluding the 3 top full-width showcases
  const secondaryProjects = useMemo(() => {
    return PROJECTS.filter(
      (p) => !['lone-wolf-dumpsters', 'inncontrol-coils', 'revision-atlas'].includes(p.id)
    );
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return secondaryProjects;
    if (filter === 'operational') {
      return secondaryProjects.filter((p) =>
        ['gensort', 'edr-party-rentals', 'maps-with-teeth', 'website-audit-system'].includes(p.id)
      );
    }
    if (filter === 'creative') {
      return secondaryProjects.filter((p) =>
        ['how-to-explain-yourself-to-wolves', 'made-of-reasons', 'brain-raccoon'].includes(p.id)
      );
    }
    return secondaryProjects;
  }, [filter, secondaryProjects]);

  const renderCoverIllustration = (item) => {
    switch (item.illustrationType) {
      case 'reservation':
        return <ReservationIllustration interactive={false} />;
      case 'civic-continuity':
        return <CivicContinuityIllustration interactive={false} />;
      case 'wolves-literary':
        return <WolvesLiteraryIllustration interactive={false} />;
      case 'gensort-workflow':
        return <GenSortWorkflowIllustration interactive={false} />;
      default:
        return (
          <div className="p-3 font-mono text-[9px] text-current flex flex-col justify-between h-full select-none">
            <div className="flex justify-between border-b border-current/15 pb-1 font-bold">
              <span>{item.title.toUpperCase()}</span>
              <span className="opacity-75">{item.year}</span>
            </div>
            <p className="my-1 text-[10px] opacity-80 line-clamp-2">
              {item.plainSentence || item.summary}
            </p>
            <div className="pt-1 border-t border-current/15 flex justify-between opacity-75">
              <span>Verified Architecture</span>
              <span>Inspect →</span>
            </div>
          </div>
        );
    }
  };

  const getSystemTypeBadge = (item) => {
    if (item.statusBadge) return item.statusBadge;
    if (item.liveUrl && item.tier === 'featured') return 'Deployed Operational System';
    if (item.liveUrl) return 'Live Web Application';
    if (item.evidenceType === 'interactive-demo') return 'Interactive System Preview';
    return 'Architectural Diagnostic';
  };

  return (
    <section id="systems-archive" className="space-y-6 border-t border-[#DFDACE]/15 pt-12">
      {/* Header and Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFDACE]/15 pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#D9A62E] font-bold block">
            ADDITIONAL PROJECTS, PRODUCTS &amp; CREATIVE WORK
          </span>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#EDE9E0]">
            Product Builds, Prototypes &amp; Creative Direction
          </h2>
          <p className="mt-1.5 font-sans text-xs sm:text-sm text-[#DFDACE]/80 max-w-2xl">
            Local-first AI asset curation software, interactive quoting and booking prototypes, public-interest continuity tools, and editorial design projects.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {[
            { id: 'all', label: `All Projects (${secondaryProjects.length})` },
            { id: 'operational', label: 'Software & Interactive Tools' },
            { id: 'creative', label: 'Creative & Editorial' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded transition-colors ${
                filter === tab.id
                  ? 'bg-[#D9A62E] text-[#141617] font-bold'
                  : 'bg-white/5 text-[#DFDACE]/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Secondary Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((item) => {
          const saved = isProjectSaved(item.id);
          return (
            <article
              key={item.id}
              className="border border-[#DFDACE]/15 bg-[#1B1F21] rounded-xl p-5 flex flex-col justify-between hover:border-[#D9A62E]/70 transition-all shadow-md group"
            >
              <div>
                {/* Sector & Classification */}
                <div className="flex items-center justify-between border-b border-[#DFDACE]/10 pb-2 mb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#D9A62E] truncate max-w-[175px]">
                    {item.sector}
                  </span>
                  <span className="font-mono text-[10px] text-[#DFDACE]/50">
                    {item.year}
                  </span>
                </div>

                {/* Characteristic Cover Container with Behavior Illustration */}
                <div
                  className="relative h-[130px] w-full rounded-lg border border-current/20 overflow-hidden shadow-inner flex flex-col justify-between"
                  style={{
                    backgroundColor: item.coverColor || '#17504A',
                    color: item.coverTextColor || '#EDE9E0',
                  }}
                >
                  {renderCoverIllustration(item)}
                </div>

                {/* System Title & Subtitle */}
                <div className="mt-3.5 flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-bold uppercase leading-tight text-[#EDE9E0] group-hover:text-[#D9A62E] transition-colors">
                    {item.title}
                  </h3>
                  {item.availableForAcquisition && (
                    <span className="shrink-0 rounded border border-[#D9A62E]/40 bg-[#D9A62E]/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#D9A62E]">
                      Available for acquisition
                    </span>
                  )}
                </div>
                <p className="mt-0.5 font-mono text-[11px] text-[#D9A62E] line-clamp-1">
                  {item.subtitle}
                </p>

                {/* Plain Sentence Summary */}
                <p className="mt-2 text-xs text-[#DFDACE]/80 font-sans leading-relaxed line-clamp-3">
                  {item.plainSentence || item.summary}
                </p>
              </div>

              {/* Card Footer: System Classification & Action Buttons */}
              <div className="mt-4 pt-3 border-t border-[#DFDACE]/10 space-y-2.5">
                <span className="block font-mono text-[9.5px] uppercase tracking-wider text-[#DFDACE]/50">
                  {getSystemTypeBadge(item)}
                </span>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onOpenCaseStudy(item.id)}
                    className="flex items-center gap-1 font-mono text-xs uppercase font-bold tracking-wider text-[#EDE9E0] hover:text-[#D9A62E] transition-colors"
                  >
                    <span>Inspect Case</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {item.liveUrl && (
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] text-[#DFDACE]/60 hover:text-[#D9A62E] transition-colors flex items-center gap-0.5"
                      >
                        <span>{item.id === 'gensort' ? 'Launch App ↗' : 'Live ↗'}</span>
                      </a>
                    )}
                    <button
                      onClick={() => toggleSaveProject(item)}
                      className={`text-[11px] font-mono transition-colors ${
                        saved ? 'text-[#D9A62E] font-bold' : 'text-[#DFDACE]/60 hover:text-white'
                      }`}
                    >
                      {saved ? '✓ Saved' : '+ Save'}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
