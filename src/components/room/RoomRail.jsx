import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Compass } from 'lucide-react';
import { useTransitionCoordinator } from '@/lib/TransitionContext';

export default function RoomRail({ rooms, currentRoomId }) {
  const navigate = useNavigate();
  const { startTransition, isTransitioning } = useTransitionCoordinator();

  const handleSelectRoom = (room, element) => {
    if (isTransitioning) return;
    const rect = element.getBoundingClientRect();
    startTransition(room, rect, navigate);
  };

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex shrink-0 border-l border-[#23282A]/20 bg-[#23282A] lg:w-[240px] flex-col justify-between">
        <div>
          <div className="eyebrow flex items-center justify-between px-4 py-2.5 font-mono text-[11px] text-[#DFDACE]/60 border-b border-[#DFDACE]/10">
            <span className="uppercase tracking-widest">Other Rooms</span>
            <span className="text-[#D9A62E]">Fold In ↗</span>
          </div>

          <div className="flex flex-col gap-px bg-[#23282A]">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={(e) => handleSelectRoom(room, e.currentTarget)}
                style={{ backgroundColor: room.color, color: room.text }}
                className="group relative flex min-h-[104px] flex-col justify-between p-4 text-left transition-all duration-300 hover:brightness-110 hover:translate-x-1"
              >
                <div className="flex items-center justify-between font-mono text-[10px] tracking-wider opacity-75">
                  <span>{room.num}</span>
                  <span className="uppercase">{room.verb}</span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <span className="font-display text-[15px] font-extrabold uppercase leading-[0.95] tracking-tight">
                    {room.title}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <span className="absolute inset-y-0 left-0 w-[3px] bg-[#D9A62E] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#DFDACE]/10">
          <p className="text-[11px] font-mono leading-relaxed text-[#DFDACE]/50">
            Four personalities, one design system. Every room approaches the same craft from a different angle.
          </p>
        </div>
      </aside>

      {/* Mobile Sleek Sticky Bottom Dock */}
      <div className="lg:hidden sticky bottom-0 z-40 border-t border-[#23282A]/30 bg-[#23282A]/95 backdrop-blur-md px-2 py-2 shadow-2xl">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-[#D9A62E] pl-1 hidden sm:flex">
            <Compass className="h-3 w-3" />
            <span>Rooms:</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 flex-1">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={(e) => handleSelectRoom(room, e.currentTarget)}
                style={{ backgroundColor: room.color, color: room.text }}
                className="group flex flex-col justify-center items-start px-2.5 py-2 rounded text-left border border-white/10 active:scale-95 transition-transform"
              >
                <div className="flex items-center justify-between w-full font-mono text-[8.5px] opacity-75 leading-none">
                  <span>{room.num}</span>
                  <ArrowUpRight className="h-2.5 w-2.5" />
                </div>
                <span className="mt-1 font-display text-[11px] font-bold uppercase tracking-tight truncate w-full">
                  {room.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
