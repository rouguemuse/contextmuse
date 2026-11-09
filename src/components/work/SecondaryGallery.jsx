import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  ArrowRight,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Link2,
  Sparkles,
  Tag,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';
import {
  PUBLIC_REGISTRY,
  searchAndFilterRegistry,
  getCuratedRelationships,
  getTagSuggestedEntries,
} from '@/data/contentRegistry';
import { CONTROLLED_TAGS, TAG_BY_ID } from '@/data/taxonomy';

const TYPE_TABS = [
  { id: 'all', label: 'All Entries' },
  { id: 'client-project', label: 'Client Builds' },
  { id: 'software-product', label: 'Software Products' },
  { id: 'tools-and-experiments', label: 'Tools & Experiments' },
  { id: 'research-and-concepts', label: 'Research & Concepts' },
];

const FEATURED_FILTER_TAGS = [
  'prob:intake-triage',
  'prob:sizing-pricing',
  'prob:data-hygiene',
  'prob:asset-chaos',
  'prob:operational-visibility',
  'prob:structural-clarity',
  'cap:local-first-workbench',
  'cap:diagnostic-instrumentation',
];

export default function SecondaryGallery({ onOpenCaseStudy }) {
  const navigate = useNavigate();
  const { isProjectSaved, toggleSaveProject } = useBrief();

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [expandedId, setExpandedId] = useState('lone-wolf-dumpsters');
  const [showAllTags, setShowAllTags] = useState(false);

  const filteredEntries = useMemo(() => {
    return searchAndFilterRegistry({
      query,
      typeFilter,
      tagFilter: tagFilter === 'all' ? null : tagFilter,
    });
  }, [query, typeFilter, tagFilter]);

  const handleToggleRow = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleJumpToRelated = (targetEntry) => {
    // Ensure filters do not hide the target entry when jumping to it
    const isVisible = filteredEntries.some((e) => e.id === targetEntry.id);
    if (!isVisible) {
      setQuery('');
      setTypeFilter('all');
      setTagFilter('all');
    }
    setExpandedId(targetEntry.id);
    setTimeout(() => {
      const el = document.getElementById(`index-row-${targetEntry.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 60);
  };

  const handleClearFilters = () => {
    setQuery('');
    setTypeFilter('all');
    setTagFilter('all');
  };

  const hasActiveFilters =
    query.trim() !== '' || typeFilter !== 'all' || tagFilter !== 'all';

  const displayedFilterTags = showAllTags
    ? CONTROLLED_TAGS
    : FEATURED_FILTER_TAGS.map((id) => TAG_BY_ID[id]).filter(Boolean);

  return (
    <section
      id="content-index"
      aria-labelledby="content-index-heading"
      className="space-y-6 border-t border-[#DFDACE]/20 pt-12 font-sans"
    >
      {/* Editorial Index Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#D9A62E] font-bold">
            <span className="inline-block h-2 w-2 bg-[#D9A62E]" />
            <span>Unified Content Registry &amp; Relationship Index</span>
          </div>
          <h3
            id="content-index-heading"
            className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#EDE9E0]"
          >
            Complete Work, Product &amp; Research Index
          </h3>
          <p className="text-xs sm:text-sm text-[#DFDACE]/75 leading-relaxed">
            A text-first directory of {PUBLIC_REGISTRY.length} public client systems, standalone software products, interactive instruments, R&amp;D experiments, and architectural studies. Select any row to inspect details, authentic previews, and connected work.
          </p>
        </div>

        <div className="font-mono text-xs text-[#DFDACE]/60 shrink-0">
          Showing <strong className="text-[#EDE9E0]">{filteredEntries.length}</strong> of{' '}
          {PUBLIC_REGISTRY.length} public entries
        </div>
      </div>

      {/* Search & Focused Filter Console (Mobile-First) */}
      <div className="bg-[#181B1D] border border-[#DFDACE]/15 p-4 sm:p-5 space-y-4">
        {/* Search Input + Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DFDACE]/50" />
            <input
              type="search"
              data-testid="index-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, problems, capabilities, or aliases (e.g., quoting, POS, dHash, WCAG, Locomotive)..."
              aria-label="Search the content index"
              className="w-full bg-[#121416] border border-[#DFDACE]/20 pl-9 pr-9 py-2.5 text-xs sm:text-sm text-[#EDE9E0] placeholder:text-[#DFDACE]/45 focus:border-[#D9A62E] focus:outline-none font-sans"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#DFDACE]/60 hover:text-[#EDE9E0]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              data-testid="index-reset-filters"
              onClick={handleClearFilters}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 border border-[#D9A62E]/50 bg-[#23282A] px-3.5 py-2.5 font-mono text-xs uppercase tracking-wider text-[#D9A62E] hover:bg-[#D9A62E] hover:text-[#141617] font-bold transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Content Type Filter Row */}
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#DFDACE]/55 block">
            Filter by Content Type:
          </span>
          <div
            role="group"
            aria-label="Filter by content type"
            className="flex flex-wrap items-center gap-1.5"
          >
            {TYPE_TABS.map((tab) => {
              const active = typeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  data-testid={`type-filter-${tab.id}`}
                  onClick={() => setTypeFilter(tab.id)}
                  className={`min-h-[34px] px-3 py-1.5 font-mono text-xs uppercase tracking-wider border transition-colors ${
                    active
                      ? 'border-[#D9A62E] bg-[#D9A62E] text-[#141617] font-bold'
                      : 'border-[#DFDACE]/15 bg-[#121416] text-[#DFDACE]/75 hover:border-[#DFDACE]/35 hover:text-[#EDE9E0]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Controlled Vocabulary Tag Filter Row */}
        <div className="space-y-1.5 pt-1 border-t border-[#DFDACE]/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#DFDACE]/55 flex items-center gap-1.5">
              <Tag className="h-3 w-3 text-[#D9A62E]" />
              <span>Filter by Problem, Capability &amp; Domain:</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAllTags((prev) => !prev)}
              className="font-mono text-[10.5px] text-[#D9A62E] hover:underline"
            >
              {showAllTags
                ? 'Show Focused Tags'
                : `Show All ${CONTROLLED_TAGS.length} Controlled Tags`}
            </button>
          </div>

          <div
            role="group"
            aria-label="Filter by controlled tag"
            className="flex flex-wrap items-center gap-1.5"
          >
            <button
              type="button"
              data-testid="tag-filter-all"
              onClick={() => setTagFilter('all')}
              className={`min-h-[32px] px-2.5 py-1 font-mono text-[11px] border transition-colors ${
                tagFilter === 'all'
                  ? 'border-[#17504A] bg-[#17504A] text-[#EDE9E0] font-bold'
                  : 'border-[#DFDACE]/15 bg-[#121416] text-[#DFDACE]/70 hover:text-[#EDE9E0]'
              }`}
            >
              All Topics
            </button>
            {displayedFilterTags.map((tag) => {
              const active = tagFilter === tag.id;
              return (
                <button
                  key={tag.id}
                  type="button"
                  data-testid={`tag-filter-${tag.id}`}
                  onClick={() => setTagFilter(active ? 'all' : tag.id)}
                  className={`min-h-[32px] px-2.5 py-1 font-mono text-[11px] border transition-colors ${
                    active
                      ? 'border-[#D9A62E] bg-[#17504A] text-[#EDE9E0] font-bold'
                      : 'border-[#DFDACE]/15 bg-[#121416] text-[#DFDACE]/75 hover:border-[#DFDACE]/35 hover:text-[#EDE9E0]'
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Text-First Editorial Index List */}
      <div
        data-testid="editorial-index-list"
        className="border-t border-b border-[#DFDACE]/20 divide-y divide-[#DFDACE]/15 bg-[#16191B]"
      >
        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="font-mono text-sm text-[#EDE9E0]">
              No public entries match the current search or filter combination.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 border border-[#D9A62E] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#D9A62E] hover:bg-[#D9A62E] hover:text-[#141617] font-bold transition-colors"
            >
              <span>Reset Search &amp; Filters</span>
            </button>
          </div>
        ) : (
          filteredEntries.map((entry, idx) => {
            const isExpanded = expandedId === entry.id;
            const saved = isProjectSaved(entry.id);
            const curatedRels = isExpanded ? getCuratedRelationships(entry) : [];
            const suggestedRels = isExpanded ? getTagSuggestedEntries(entry, { limit: 3 }) : [];

            return (
              <article
                key={entry.id}
                id={`index-row-${entry.id}`}
                data-testid={`index-row-${entry.id}`}
                data-entry-visibility={entry.visibility}
                className="transition-colors"
              >
                {/* Summary Row (Text-First, Mobile-First, Zero Thumbnail Clutter) */}
                <button
                  type="button"
                  onClick={() => handleToggleRow(entry.id)}
                  aria-expanded={isExpanded}
                  className={`w-full text-left px-4 py-4 sm:px-6 sm:py-4.5 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
                    isExpanded
                      ? 'bg-[#1D2225] border-l-4 border-l-[#D9A62E]'
                      : 'hover:bg-[#1B1F22]'
                  }`}
                >
                  {/* Left: Index Number + Title + Short Explanation */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span className="font-mono text-xs text-[#D9A62E] font-bold pt-0.5 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h4 className="font-display text-base sm:text-lg font-extrabold uppercase tracking-tight text-[#EDE9E0]">
                          {entry.title}
                        </h4>
                        <span className="font-mono text-[11px] text-[#DFDACE]/60">
                          {entry.subtitle}
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-[#DFDACE]/80 leading-relaxed line-clamp-2">
                        {entry.plainSentence}
                      </p>
                    </div>
                  </div>

                  {/* Right: Minimal Metadata Strip + Expand Control */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2 pl-6 lg:pl-4 shrink-0 font-mono text-[11px]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="border border-[#DFDACE]/20 bg-[#23282A] px-2 py-0.5 text-[#EDE9E0] uppercase">
                        {entry.contentTypeMeta?.shortLabel}
                      </span>
                      <span className="border border-[#17504A]/60 bg-[#17504A]/30 px-2 py-0.5 text-[#DFDACE]/90 uppercase">
                        {entry.maturityStatusMeta?.label}
                      </span>
                      {entry.year && (
                        <span className="text-[#DFDACE]/50 hidden sm:inline px-1">
                          {entry.year}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[#D9A62E] font-bold uppercase tracking-wider ml-2">
                      <span>{isExpanded ? 'Close' : 'Inspect'}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </span>
                  </div>
                </button>

                {/* Expanded Inline Detail Panel */}
                {isExpanded && (
                  <div
                    data-testid={`index-expanded-${entry.id}`}
                    className="bg-[#121517] border-t border-[#DFDACE]/15 px-4 py-6 sm:px-8 sm:py-7 space-y-6"
                  >
                    <div className="grid gap-6 lg:grid-cols-12 items-start">
                      {/* Left Column: Detailed Summary, Tangible Output, Tags & Primary Links */}
                      <div
                        className={
                          entry.mediaUrl
                            ? 'lg:col-span-7 space-y-5'
                            : 'lg:col-span-12 space-y-5'
                        }
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#D9A62E]">
                            <span>{entry.sector}</span>
                            {entry.role && (
                              <>
                                <span>•</span>
                                <span className="text-[#DFDACE]/70">{entry.role}</span>
                              </>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-[#EDE9E0]/90 leading-relaxed">
                            {entry.summary}
                          </p>
                        </div>

                        {entry.tangibleOutput && (
                          <div className="border border-[#DFDACE]/15 bg-[#181C1E] p-3.5 space-y-1">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[#D9A62E] font-bold block">
                              Tangible Output: {entry.tangibleOutput.title}
                            </span>
                            <p className="font-mono text-[11px] text-[#DFDACE]/80 leading-relaxed">
                              {entry.tangibleOutput.previewText ||
                                entry.tangibleOutput.description}
                            </p>
                          </div>
                        )}

                        {/* Controlled Classification Tags by Dimension */}
                        <div className="space-y-2 pt-1">
                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#DFDACE]/55 block">
                            Controlled Classification Tags (Click to Filter):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {entry.canonicalTags.map((tag) => (
                              <button
                                key={tag.id}
                                type="button"
                                onClick={() =>
                                  setTagFilter(tagFilter === tag.id ? 'all' : tag.id)
                                }
                                className={`px-2.5 py-1 font-mono text-[11px] border transition-colors ${
                                  tagFilter === tag.id
                                    ? 'border-[#D9A62E] bg-[#17504A] text-[#EDE9E0] font-bold'
                                    : 'border-[#DFDACE]/15 bg-[#1B1F22] text-[#DFDACE]/80 hover:border-[#D9A62E] hover:text-[#EDE9E0]'
                                }`}
                              >
                                <span className="text-[#D9A62E]/75 uppercase text-[9.5px] mr-1">
                                  {tag.dimension}:
                                </span>
                                {tag.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-2 font-mono text-xs">
                          {entry.hasCaseDossier && onOpenCaseStudy && (
                            <button
                              type="button"
                              onClick={() => onOpenCaseStudy(entry.id)}
                              className="inline-flex items-center gap-1.5 bg-[#D9A62E] text-[#141617] px-4 py-2.5 font-bold uppercase tracking-wider hover:bg-[#e0b240] transition-colors"
                            >
                              <span>Open Case Dossier</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {entry.liveDestination && (
                            <a
                              href={entry.liveDestination}
                              target={
                                entry.liveDestination.startsWith('http')
                                  ? '_blank'
                                  : undefined
                              }
                              rel={
                                entry.liveDestination.startsWith('http')
                                  ? 'noopener noreferrer'
                                  : undefined
                              }
                              className="inline-flex items-center gap-1.5 border border-[#DFDACE]/25 bg-[#1B1F22] text-[#EDE9E0] px-4 py-2.5 font-bold uppercase tracking-wider hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
                            >
                              <span>
                                {entry.liveDestination.startsWith('http')
                                  ? 'Visit Live Site'
                                  : 'Open Live Experience'}
                              </span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}

                          {entry.secondaryDestination && (
                            <a
                              href={entry.secondaryDestination}
                              className="inline-flex items-center gap-1.5 border border-[#DFDACE]/15 px-3.5 py-2.5 text-[#DFDACE]/80 hover:text-[#EDE9E0] transition-colors"
                            >
                              <span>Overview / Static Archive</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => toggleSaveProject(entry)}
                            className={`inline-flex items-center gap-1.5 border px-3.5 py-2.5 uppercase tracking-wider transition-colors ${
                              saved
                                ? 'border-[#D9A62E] bg-[#D9A62E]/15 text-[#D9A62E] font-bold'
                                : 'border-[#DFDACE]/20 text-[#DFDACE]/75 hover:text-[#EDE9E0]'
                            }`}
                          >
                            {saved ? (
                              <>
                                <BookmarkCheck className="h-3.5 w-3.5" />
                                <span>Saved</span>
                              </>
                            ) : (
                              <>
                                <Bookmark className="h-3.5 w-3.5" />
                                <span>Save to Ideas</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Right Column: Authentic Preview inside Neutral Presentation Frame */}
                      {entry.mediaUrl && (
                        <div className="lg:col-span-5">
                          <figure className="bg-[#181B1D] border border-[#DFDACE]/15 p-3 space-y-2">
                            <div className="overflow-hidden border border-[#DFDACE]/15 bg-[#0A0C0D] aspect-[16/10]">
                              <img
                                src={entry.mediaUrl}
                                alt={`${entry.title} authentic preview`}
                                className="w-full h-full object-cover object-top"
                                loading="lazy"
                              />
                            </div>
                            <figcaption className="flex items-center justify-between font-mono text-[10.5px] text-[#DFDACE]/65 px-0.5">
                              <span>Authentic System / Artifact Preview</span>
                              <span className="text-[#D9A62E]">
                                {entry.contentTypeMeta?.shortLabel}
                              </span>
                            </figcaption>
                          </figure>
                        </div>
                      )}
                    </div>

                    {/* Interconnected Relationship Panel: Curated vs. Tag-Suggested */}
                    {(curatedRels.length > 0 || suggestedRels.length > 0) && (
                      <div className="border-t border-[#DFDACE]/15 pt-5 grid gap-5 lg:grid-cols-2">
                        {/* 1. Curated Typed Relationships */}
                        <div
                          data-testid={`curated-relations-${entry.id}`}
                          className="space-y-2.5"
                        >
                          <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#D9A62E] font-bold">
                            <Link2 className="h-3.5 w-3.5" />
                            <span>Curated Relationships (Verified Connections)</span>
                          </div>

                          {curatedRels.length === 0 ? (
                            <p className="font-mono text-xs text-[#DFDACE]/50">
                              No explicit curated relationships recorded.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {curatedRels.map((rel, rIdx) => (
                                <button
                                  key={`${rel.target.id}-${rIdx}`}
                                  type="button"
                                  onClick={() => handleJumpToRelated(rel.target)}
                                  className="w-full text-left border border-[#DFDACE]/15 bg-[#181B1D] hover:border-[#D9A62E] p-3 transition-colors space-y-1 block"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                                    <span className="text-[#D9A62E] font-bold uppercase tracking-wider">
                                      {rel.typeMeta?.label} → {rel.target.title}
                                    </span>
                                    <span className="text-[#DFDACE]/55 uppercase">
                                      {rel.target.contentTypeMeta?.shortLabel}
                                    </span>
                                  </div>
                                  {rel.note && (
                                    <p className="text-xs text-[#DFDACE]/80 leading-relaxed">
                                      {rel.note}
                                    </p>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 2. Automated Tag-Based Suggestions (Clearly Distinguished) */}
                        <div
                          data-testid={`suggested-relations-${entry.id}`}
                          className="space-y-2.5"
                        >
                          <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#DFDACE]/65 font-bold">
                            <Sparkles className="h-3.5 w-3.5 text-[#17504A]" />
                            <span>Suggested by Shared Tags (Automated Match)</span>
                          </div>

                          {suggestedRels.length === 0 ? (
                            <p className="font-mono text-xs text-[#DFDACE]/50">
                              No additional tag-based suggestions.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {suggestedRels.map((sug) => (
                                <button
                                  key={sug.target.id}
                                  type="button"
                                  onClick={() => handleJumpToRelated(sug.target)}
                                  className="w-full text-left border border-[#DFDACE]/12 bg-[#16191B] hover:border-[#DFDACE]/40 p-3 transition-colors space-y-1 block"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                                    <span className="text-[#EDE9E0] font-bold uppercase tracking-wider">
                                      {sug.target.title}
                                    </span>
                                    <span className="text-[#DFDACE]/50 uppercase">
                                      Tag Suggestion • {sug.target.contentTypeMeta?.shortLabel}
                                    </span>
                                  </div>
                                  <p className="font-mono text-[10.5px] text-[#DFDACE]/65">
                                    Shared tags:{' '}
                                    {sug.sharedTags.map((t) => t.label).join(', ')}
                                  </p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
