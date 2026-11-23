import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers, Sparkles } from 'lucide-react';

export default function RoomTile({ room, index, onPick }) {
  const ref = useRef(null);

  const handleClick = (e) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    if (!ref.current || !onPick) return;
    e.preventDefault();
    onPick(room, ref.current.getBoundingClientRect());
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      if (ref.current && onPick) {
        onPick(room, ref.current.getBoundingClientRect());
      }
    }
  };

  const renderVisualMotif = () => {
    switch (room.id) {
      case 'build':
        return (
          <div className="space-y-2.5 2xl:space-y-3 font-mono text-[#23282A]">
            {/* Commission Schematic Flow Sequence */}
            <div className="flex items-center justify-between text-[10px] 2xl:text-[clamp(0.65rem,0.4vw+0.35rem,0.85rem)] gap-1.5">
              <span className="bg-white/85 border border-black/15 px-2 py-1 2xl:px-3 2xl:py-1.5 rounded-xs font-bold truncate">
                01 Scope Goal
              </span>
              <span className="text-[#17504A] font-bold shrink-0">→</span>
              <span className="bg-[#D9A62E]/25 text-[#23282A] border border-[#23282A]/25 px-2 py-1 2xl:px-3 2xl:py-1.5 rounded-xs font-bold truncate">
                02 Architecture
              </span>
              <span className="text-[#17504A] font-bold shrink-0">→</span>
              <span className="bg-[#17504A] text-[#EDE9E0] px-2 py-1 2xl:px-3 2xl:py-1.5 rounded-xs font-bold truncate">
                03 Custom Build
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] 2xl:text-[clamp(0.65rem,0.4vw+0.35rem,0.85rem)] text-[#23282A]/70 uppercase tracking-wider">
              <span>Tailored Commission</span>
              <span>•</span>
              <span>Built Around Your Operation</span>
            </div>
          </div>
        );

      case 'blueprints':
        return (
          <div
            data-testid="blueprints-tile-preview"
            className="space-y-2 2xl:space-y-2.5 font-mono"
          >
            {/* Interactive Modular Product Fragment Stack — Works at rest on mobile & fans out on hover/focus */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-0.5">
              {/* Fragment 01: Expressive Editorial Template Specimen */}
              <div className="bg-[#F0E8D9] text-[#141414] border-2 border-[#141414] p-1.5 sm:p-2 shadow-[2px_2px_0_#E34232] transition-transform duration-300 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:-rotate-2 group-focus-visible:-translate-x-1 group-focus-visible:-translate-y-1 motion-reduce:transform-none">
                <div className="flex items-center justify-between text-[8.5px] sm:text-[9px] font-bold tracking-tight border-b border-[#141414]/20 pb-0.5">
                  <span className="text-[#E34232]">BP-001</span>
                  <span className="bg-[#141414] text-[#E5E750] px-1">STUDIO</span>
                </div>
                <div className="mt-1 font-display text-[10px] sm:text-[11px] font-black uppercase leading-none tracking-tight truncate">
                  Literary Brutalism
                </div>
                <div className="mt-1.5 flex items-center gap-1" aria-hidden="true">
                  <span className="h-2 w-2 bg-[#141414] border border-black/20" />
                  <span className="h-2 w-2 bg-[#E34232]" />
                  <span className="h-2 w-2 bg-[#E5E750] border border-black/30" />
                  <span className="h-2 w-2 bg-[#8DB8C2]" />
                </div>
              </div>

              {/* Fragment 02: 5-Board Figma & 23 Vector SVGs */}
              <div className="bg-[#141414] text-[#F0E8D9] border-2 border-[#141414] p-1.5 sm:p-2 shadow-[2px_2px_0_#D9A62E] transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5 motion-reduce:transform-none">
                <div className="flex items-center justify-between text-[8.5px] sm:text-[9px] font-bold tracking-tight border-b border-[#F0E8D9]/20 pb-0.5">
                  <span className="text-[#E5E750]">FIGMA KIT</span>
                  <span className="text-[#D9A62E]">23 SVGs</span>
                </div>
                <div className="mt-1 font-display text-[10px] sm:text-[11px] font-black uppercase leading-none tracking-tight text-[#F0E8D9] truncate">
                  5 Master Boards
                </div>
                <div className="mt-1.5 text-[8.5px] text-[#E5E750] font-bold truncate">
                  1440px + Token Engine
                </div>
              </div>

              {/* Fragment 03: Multi-Niche Presets & Instant .ZIP Ownership */}
              <div className="bg-[#E3DAC9] text-[#141414] border-2 border-[#141414] p-1.5 sm:p-2 shadow-[2px_2px_0_#141414] transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-2 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1 motion-reduce:transform-none">
                <div className="flex items-center justify-between text-[8.5px] sm:text-[9px] font-bold tracking-tight border-b border-[#141414]/20 pb-0.5">
                  <span>5 PRESETS</span>
                  <span className="text-[#123F38] font-extrabold">$49–$199</span>
                </div>
                <div className="mt-1 font-display text-[10px] sm:text-[11px] font-black uppercase leading-none tracking-tight truncate">
                  Own The Code
                </div>
                <div className="mt-1.5 text-[8.5px] text-[#141414]/80 font-bold truncate">
                  Instant .ZIP + Studio
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] 2xl:text-[clamp(0.65rem,0.4vw+0.35rem,0.85rem)] text-[#EDE9E0]/80 uppercase tracking-wider pt-0.5">
              <span className="text-[#E5E750] font-bold">● Expressive Product Showroom</span>
              <span className="hidden sm:inline">One-Time License · No Subscriptions</span>
            </div>
          </div>
        );

      case 'work':
        return (
          <div className="space-y-2.5 2xl:space-y-3 font-mono">
            {/* Proportioned System Cassette Bar */}
            <div className="flex items-center gap-1 h-3 2xl:h-4 w-full rounded-xs overflow-hidden opacity-90">
              <div className="h-full bg-[#D9A62E] w-[46%]" title="Client Commercial Systems" />
              <div className="h-full bg-[#EDE9E0] w-[34%]" title="Original Software Products" />
              <div className="h-full bg-[#17504A] w-[20%]" title="Civic & Research Case Studies" />
            </div>
            <div className="flex justify-between gap-2 text-[10px] 2xl:text-[clamp(0.65rem,0.4vw+0.35rem,0.85rem)] text-[#EDE9E0]/65 uppercase tracking-wider">
              <span>Client Builds</span>
              <span>Software Products</span>
              <span>Case Studies</span>
            </div>
          </div>
        );

      case 'lab':
      default:
        return (
          <div className="space-y-2.5 2xl:space-y-3 font-mono text-[#1A1E1F]">
            {/* Contrast & Layer Swatch Motif */}
            <div className="flex items-center gap-1.5 h-6 2xl:h-8">
              <div className="flex-1 bg-[#1A1E1F] text-[#EDE9E0] text-[9.5px] 2xl:text-[clamp(0.62rem,0.38vw+0.35rem,0.82rem)] font-bold flex items-center justify-center rounded-xs h-full uppercase px-1 truncate">
                GenSort AI
              </div>
              <div className="flex-1 bg-[#17504A] text-[#EDE9E0] text-[9.5px] 2xl:text-[clamp(0.62rem,0.38vw+0.35rem,0.82rem)] font-bold flex items-center justify-center rounded-xs h-full uppercase px-1 truncate">
                Signal Ops
              </div>
              <div className="flex-1 bg-white/75 text-[#1A1E1F] text-[9.5px] 2xl:text-[clamp(0.62rem,0.38vw+0.35rem,0.82rem)] font-bold flex items-center justify-center rounded-xs h-full uppercase px-1 truncate">
                Live R&amp;D
              </div>
            </div>
            <div className="text-[10px] 2xl:text-[clamp(0.65rem,0.4vw+0.35rem,0.85rem)] text-[#1A1E1F]/70 uppercase tracking-wider">
              Experiments • Unconventional Apps • Live Instruments
            </div>
          </div>
        );
    }
  };

  const getCue = () => {
    switch (room.id) {
      case 'build':
        return 'Start a Custom Build';
      case 'blueprints':
        return 'Enter Blueprints Showroom';
      case 'work':
        return 'Explore Selected Work';
      case 'lab':
      default:
        return 'Explore The Lab';
    }
  };

  const getRoleBadge = () => {
    switch (room.id) {
      case 'build':
        return 'TAILORED COMMISSION';
      case 'blueprints':
        return 'PRODUCT COLLECTION';
      case 'work':
        return 'PORTFOLIO & PROOF';
      case 'lab':
      default:
        return 'EXPERIMENTS & R&D';
    }
  };

  return (
    <Link
      ref={ref}
      to={room.path}
      data-room-id={room.id}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ backgroundColor: room.color, color: room.text }}
      aria-label={`Enter Room ${room.num}: ${room.title} (${room.verb})`}
      className="group relative flex flex-col justify-between p-4 sm:p-7 xl:p-[clamp(1.75rem,2.4vw,3.25rem)] text-left no-underline transition-all duration-300 hover:brightness-105 active:scale-[0.99] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D9A62E] focus:z-10 min-h-[168px] sm:min-h-[245px] xl:min-h-[295px] h-full overflow-hidden"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-current/15 pb-2 sm:pb-2.5 2xl:pb-3.5">
        <div className="flex items-center gap-2 font-mono text-xs 2xl:text-[clamp(0.75rem,0.45vw+0.42rem,0.95rem)] uppercase tracking-wider font-bold opacity-90">
          <span>{room.num}</span>
          <span>/</span>
          <span className="tracking-widest">{room.verb}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-[9.5px] uppercase tracking-wider px-2 py-0.5 font-bold ${
              room.id === 'blueprints'
                ? 'bg-[#141414] text-[#E5E750] border border-[#E5E750]/40 shadow-[2px_2px_0_#E34232]'
                : 'border border-current/25 opacity-75'
            }`}
          >
            {getRoleBadge()}
          </span>
          <ArrowUpRight className="h-4 w-4 2xl:h-5 2xl:w-5 shrink-0 opacity-75 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
        </div>
      </div>

      {/* Center: Title, Blurb & Restrained Visual Motif */}
      <div className="flex-1 flex flex-col justify-between py-2.5 sm:py-5 2xl:py-7">
        <div className="my-auto">
          <h3 className="font-display text-xl sm:text-[26px] xl:text-[clamp(1.7rem,1.45vw+0.45rem,2.85rem)] font-black uppercase tracking-tight leading-[1.03] transition-transform duration-300 group-hover:-translate-y-0.5 flex items-center gap-2">
            <span>{room.title}</span>
            {room.id === 'blueprints' && (
              <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-[#E5E750] shrink-0 transition-transform duration-300 group-hover:rotate-6 motion-reduce:transform-none" />
            )}
          </h3>
          <p className="mt-1.5 sm:mt-2.5 2xl:mt-3.5 max-w-[36rem] text-xs sm:text-[13px] xl:text-[clamp(0.82rem,0.48vw+0.45rem,1.1rem)] opacity-90 font-sans leading-relaxed">
            {room.blurb}
          </p>
        </div>

        {/* Blueprints preview is visible on mobile & desktop; other room motifs show on sm+ */}
        <div className={room.id === 'blueprints' ? 'block mt-3 sm:mt-4 pt-1.5 2xl:mt-6' : 'hidden sm:block mt-4 pt-2 2xl:mt-6'}>
          {renderVisualMotif()}
        </div>
      </div>

      {/* Bottom Navigation Cue */}
      <div className="flex items-center justify-between border-t border-current/15 pt-2 sm:pt-2.5 2xl:pt-3.5 font-mono text-[10.5px] sm:text-[11px] 2xl:text-[clamp(0.72rem,0.42vw+0.4rem,0.9rem)] opacity-90 group-hover:opacity-100 font-bold uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          {room.id === 'blueprints' && <Sparkles className="h-3.5 w-3.5 text-[#E5E750] shrink-0" />}
          <span>{getCue()}</span>
        </span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>

      {/* Subtle Accent Glow on Hover */}
      <span
        className={`pointer-events-none absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
          room.id === 'blueprints' ? 'bg-[#E5E750]' : 'bg-current opacity-60'
        }`}
      />
    </Link>
  );
}
