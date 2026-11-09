import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function RoomTile({ room, index, onPick }) {
  const ref = useRef(null);

  const handleClick = () => {
    if (!ref.current) return;
    onPick(room, ref.current.getBoundingClientRect());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const renderVisualMotif = () => {
    switch (room.id) {
      case 'work':
        return (
          <div className="space-y-2.5 2xl:space-y-3 font-mono">
            {/* Proportioned System Cassette Bar */}
            <div className="flex items-center gap-1 h-3 2xl:h-4 w-full rounded-xs overflow-hidden opacity-90">
              <div className="h-full bg-[#D9A62E] w-[46%]" title="Logistics Engine" />
              <div className="h-full bg-[#EDE9E0] w-[34%]" title="Hospitality & Ops" />
              <div className="h-full bg-[#17504A] w-[20%]" title="Narrative Workbench" />
            </div>
            <div className="flex justify-between gap-2 text-[10px] 2xl:text-[clamp(0.65rem,0.4vw+0.35rem,0.85rem)] text-[#EDE9E0]/65 uppercase tracking-wider">
              <span>Web &amp; Quoting</span>
              <span>B2B Platform</span>
              <span>Product UX</span>
            </div>
          </div>
        );

      case 'build':
        return (
          <div className="space-y-2.5 2xl:space-y-3 font-mono text-[#23282A]">
            {/* Schematic Flow Sequence */}
            <div className="flex items-center justify-between text-[10px] 2xl:text-[clamp(0.65rem,0.4vw+0.35rem,0.85rem)] gap-1.5">
              <span className="bg-white/80 border border-black/10 px-2 py-1 2xl:px-3 2xl:py-1.5 rounded-xs font-bold truncate">
                01 Website
              </span>
              <span className="text-[#17504A] font-bold shrink-0">→</span>
              <span className="bg-red-100/90 text-red-900 border border-red-300 px-2 py-1 2xl:px-3 2xl:py-1.5 rounded-xs font-bold truncate">
                02 Quoting
              </span>
              <span className="text-[#17504A] font-bold shrink-0">→</span>
              <span className="bg-[#17504A] text-white px-2 py-1 2xl:px-3 2xl:py-1.5 rounded-xs font-bold truncate">
                03 Workflow
              </span>
            </div>
            <div className="text-[10px] 2xl:text-[clamp(0.65rem,0.4vw+0.35rem,0.85rem)] text-[#23282A]/65 uppercase tracking-wider">
              Websites • Quoting Engines • Internal Tools
            </div>
          </div>
        );

      case 'lab':
        return (
          <div className="space-y-2.5 2xl:space-y-3 font-mono text-[#1A1E1F]">
            {/* Contrast & Layer Swatch Motif */}
            <div className="flex items-center gap-1.5 h-6 2xl:h-8">
              <div className="flex-1 bg-[#1A1E1F] text-[#EDE9E0] text-[9.5px] 2xl:text-[clamp(0.62rem,0.38vw+0.35rem,0.82rem)] font-bold flex items-center justify-center rounded-xs h-full uppercase px-1 truncate">
                GenSort AI
              </div>
              <div className="flex-1 bg-[#17504A] text-[#EDE9E0] text-[9.5px] 2xl:text-[clamp(0.62rem,0.38vw+0.35rem,0.82rem)] font-bold flex items-center justify-center rounded-xs h-full uppercase px-1 truncate">
                Canvas UX
              </div>
              <div className="flex-1 bg-white/75 text-[#1A1E1F] text-[9.5px] 2xl:text-[clamp(0.62rem,0.38vw+0.35rem,0.82rem)] font-bold flex items-center justify-center rounded-xs h-full uppercase px-1 truncate">
                Live Audit
              </div>
            </div>
            <div className="text-[10px] 2xl:text-[clamp(0.65rem,0.4vw+0.35rem,0.85rem)] text-[#1A1E1F]/65 uppercase tracking-wider">
              Original Products • AI Tools • Live Instruments
            </div>
          </div>
        );

      case 'method':
      default:
        return (
          <div className="space-y-2.5 2xl:space-y-3 font-mono text-[#EDE9E0]">
            {/* Five-Stage Connected Progression */}
            <div className="flex items-center justify-between gap-1 text-[10px] 2xl:text-[clamp(0.65rem,0.4vw+0.35rem,0.85rem)] text-[#EDE9E0]/85">
              <span className="text-[#D9A62E] font-bold">Observe</span>
              <span className="opacity-50">•</span>
              <span>Extract</span>
              <span className="opacity-50">•</span>
              <span>Evaluate</span>
              <span className="opacity-50">•</span>
              <span>Transform</span>
              <span className="opacity-50">•</span>
              <span className="text-[#D9A62E] font-bold">Evolve</span>
            </div>
            <div className="h-1.5 2xl:h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#D9A62E] w-[60%]" />
            </div>
          </div>
        );
    }
  };

  const getCue = () => {
    switch (room.id) {
      case 'work':
        return 'Explore Selected Work';
      case 'build':
        return 'Shape a Custom Build';
      case 'lab':
        return 'Explore The Lab';
      case 'method':
      default:
        return 'See Approach & Pricing';
    }
  };

  return (
    <div
      ref={ref}
      data-room-id={room.id}
      tabIndex={0}
      role="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ backgroundColor: room.color, color: room.text }}
      aria-label={`Enter Room ${room.num}: ${room.title} (${room.verb})`}
      className="group relative flex flex-col justify-between p-5 sm:p-7 xl:p-[clamp(1.75rem,2.4vw,3.25rem)] text-left transition-all duration-300 hover:brightness-105 active:scale-[0.99] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D9A62E] focus:z-10 min-h-[200px] sm:min-h-[240px] xl:min-h-[290px] h-full"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-current/15 pb-2.5 2xl:pb-3.5">
        <div className="flex items-center gap-2 font-mono text-xs 2xl:text-[clamp(0.75rem,0.45vw+0.42rem,0.95rem)] uppercase tracking-wider font-bold opacity-85">
          <span>{room.num}</span>
          <span>/</span>
          <span className="tracking-widest">{room.verb}</span>
        </div>
        <ArrowUpRight className="h-4 w-4 2xl:h-5 2xl:w-5 shrink-0 opacity-75 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
      </div>

      {/* Center: Title, Blurb & Restrained Visual Motif */}
      <div className="flex-1 flex flex-col justify-between py-4 sm:py-5 2xl:py-7">
        <div className="my-auto">
          <h3 className="font-display text-2xl sm:text-[26px] xl:text-[clamp(1.7rem,1.45vw+0.45rem,2.85rem)] font-black uppercase tracking-tight leading-[1.03] transition-transform duration-300 group-hover:-translate-y-0.5">
            {room.title}
          </h3>
          <p className="mt-2 sm:mt-2.5 2xl:mt-3.5 max-w-[36rem] text-xs sm:text-[13px] xl:text-[clamp(0.82rem,0.48vw+0.45rem,1.1rem)] opacity-90 font-sans leading-relaxed">
            {room.blurb}
          </p>
        </div>
        <div className="mt-4 pt-2 2xl:mt-6">
          {renderVisualMotif()}
        </div>
      </div>

      {/* Bottom Navigation Cue */}
      <div className="flex items-center justify-between border-t border-current/15 pt-2.5 2xl:pt-3.5 font-mono text-[11px] 2xl:text-[clamp(0.72rem,0.42vw+0.4rem,0.9rem)] opacity-85 group-hover:opacity-100 font-bold uppercase tracking-wider">
        <span>{getCue()}</span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>

      {/* Subtle Accent Glow on Hover */}
      <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100 opacity-60" />
    </div>
  );
}
