import React, { useState, useEffect } from 'react';
import { Maximize2, X, ExternalLink } from 'lucide-react';
import { getWorkMediaProfile } from '@/components/work/workData';

/**
 * EditorialEvidenceFrame
 * Clean, un-cropped project preview frame for the Work room.
 * - Renders authentic project screenshots at their full visible bounds inside a recessed
 *   dark stage (#090B0D) without cutting off headers, CTAs, or bottom bars.
 * - Supports switching between 2 distinct surfaces (e.g., Public Website + Business Portal)
 *   via a slim header bar, with click-to-expand full-resolution inspection.
 */
export default function EditorialEvidenceFrame({
  src,
  alt,
  title,
  figLabel,
  provenance,
  caption,
  plates = null,
  accentColor = '#D9A62E',
  variant = 'card', // 'lead' | 'card' | 'compact'
  loading = 'lazy',
  fetchPriority = undefined,
  liveUrl = null,
}) {
  const normalizedPlates =
    Array.isArray(plates) && plates.length > 0
      ? plates.map((pl, idx) => {
          const prof = getWorkMediaProfile(pl.src);
          return {
            id: pl.id || `plate-${idx}`,
            shortTab: pl.shortTab || `0${idx + 1} / View`,
            label: pl.label || prof.figLabel,
            provenance: pl.provenance || prof.provenance,
            src: pl.src,
            alt: pl.alt || alt || `${title || 'Project'} authentic capture ${idx + 1}`,
            caption: pl.caption || prof.caption,
            naturalResolution: prof.naturalResolution,
          };
        })
      : [
          (() => {
            const prof = getWorkMediaProfile(src);
            return {
              id: 'primary',
              shortTab: '01 / View',
              label: figLabel || prof.figLabel,
              provenance: provenance || prof.provenance,
              src,
              alt: alt || `${title || 'Project'} authentic capture`,
              caption: caption || prof.caption,
              naturalResolution: prof.naturalResolution,
            };
          })(),
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [inspectOpen, setInspectOpen] = useState(false);

  const safeIndex = activeIndex < normalizedPlates.length ? activeIndex : 0;
  const activePlate = normalizedPlates[safeIndex];

  useEffect(() => {
    if (!inspectOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setInspectOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectOpen]);

  return (
    <>
      <figure className="min-w-0 w-full max-w-full overflow-hidden bg-[#121517] border border-[#DFDACE]/18 flex flex-col justify-between">
        {/* Slim Header Bar */}
        <div className="min-w-0 bg-[#171B1D] border-b border-[#DFDACE]/12 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <span className="uppercase tracking-[0.12em] text-[#EDE9E0] font-bold truncate">
              {activePlate.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 max-w-full">
            {normalizedPlates.length > 1 ? (
              <div
                role="tablist"
                aria-label={`${title || 'Project'} views`}
                className="inline-flex border border-[#DFDACE]/20 bg-[#0F1214]"
              >
                {normalizedPlates.map((pl, idx) => {
                  const isSelected = idx === safeIndex;
                  return (
                    <button
                      key={pl.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveIndex(idx)}
                      className={`px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider transition-colors ${
                        isSelected
                          ? 'bg-[#D9A62E] text-[#141617] font-bold'
                          : 'text-[#DFDACE]/70 hover:text-[#EDE9E0]'
                      }`}
                    >
                      {pl.shortTab}
                    </button>
                  );
                })}
              </div>
            ) : (
              <span className="text-[#DFDACE]/55 truncate max-w-[140px] sm:max-w-[200px] hidden sm:inline">
                {activePlate.provenance}
              </span>
            )}

            <button
              type="button"
              onClick={() => setInspectOpen(true)}
              aria-label={`Expand full screenshot for ${title || activePlate.alt}`}
              title="Expand full screenshot"
              className="inline-flex items-center gap-1 border border-[#DFDACE]/20 bg-[#121517] hover:border-[#D9A62E] hover:text-[#D9A62E] text-[#DFDACE]/80 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider transition-colors"
            >
              <Maximize2 className="h-2.5 w-2.5" />
              <span className="hidden xs:inline">Expand</span>
            </button>
          </div>
        </div>

        {/* Consistent, padded stage. The capture is evidence, so never crop it to fill the frame. */}
        <button
          type="button"
          onClick={() => setInspectOpen(true)}
          aria-label={`Expand full screenshot for ${title || activePlate.alt}`}
          className="relative block aspect-[16/11] w-full min-w-0 appearance-none border-0 bg-[#090B0D] p-0 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#D9A62E]"
        >
          <span className={`absolute inset-0 block ${variant === 'lead' ? 'p-3 sm:p-4' : 'p-2.5 sm:p-3'}`}>
            <img
              src={activePlate.src}
              alt={activePlate.alt}
              className="block h-full w-full object-contain object-center"
              loading={loading}
              fetchPriority={fetchPriority}
              decoding="async"
            />
          </span>
        </button>

        {/* Slim Caption Footer */}
        <figcaption className="min-w-0 bg-[#141719] border-t border-[#DFDACE]/12 px-3 py-2 flex flex-wrap items-start justify-between gap-x-2 gap-y-1 font-mono text-[10.5px]">
          <span className="min-w-0 flex-1 text-[#DFDACE]/75 break-words">
            {activePlate.caption}
          </span>
          <span className="text-[#D9A62E] shrink-0 hidden sm:inline">
            {activePlate.provenance}
          </span>
        </figcaption>
      </figure>

      {/* Accessible Full-Screenshot Lightbox Modal */}
      {inspectOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Full screenshot inspection: ${title || activePlate.alt}`}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-[#090B0D]/95 p-3 sm:p-6"
          onClick={() => setInspectOpen(false)}
        >
          <div
            className="w-full max-w-6xl bg-[#141719] border border-[#DFDACE]/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#181C1E] border-b border-[#DFDACE]/15 font-mono text-xs">
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#D9A62E] font-bold block">
                  Full Capture · {activePlate.provenance} ({activePlate.naturalResolution})
                </span>
                <p className="text-[#EDE9E0] font-bold truncate mt-0.5">
                  {title ? `${title} — ${activePlate.label}` : activePlate.label}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {normalizedPlates.length > 1 && (
                  <div className="inline-flex border border-[#DFDACE]/25 bg-[#111416]">
                    {normalizedPlates.map((pl, idx) => (
                      <button
                        key={pl.id}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`px-2.5 py-1 text-[10.5px] uppercase tracking-wider transition-colors ${
                          idx === safeIndex
                            ? 'bg-[#D9A62E] text-[#141617] font-bold'
                            : 'text-[#DFDACE]/75 hover:text-[#EDE9E0]'
                        }`}
                      >
                        {pl.shortTab}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setInspectOpen(false)}
                  aria-label="Close full screenshot inspection"
                  className="inline-flex items-center gap-1.5 bg-[#23282A] hover:bg-[#D9A62E] text-[#EDE9E0] hover:text-[#141617] border border-[#DFDACE]/25 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Uncropped Image Viewport */}
            <div className="overflow-auto p-3 sm:p-6 bg-[#090B0D] flex items-center justify-center flex-1">
              <img
                src={activePlate.src}
                alt={activePlate.alt}
                className="max-h-[76vh] w-auto max-w-full object-contain border border-[#DFDACE]/15"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-[#181C1E] border-t border-[#DFDACE]/15 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[#DFDACE]/75">
              <span>{activePlate.caption}</span>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target={liveUrl.startsWith('http') ? '_blank' : undefined}
                  rel={liveUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 bg-[#D9A62E] text-[#141617] px-3.5 py-1.5 font-bold uppercase tracking-wider hover:bg-[#EDE9E0] transition-colors"
                >
                  <span>Open Live Project</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
