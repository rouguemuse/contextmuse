import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Lightbulb, Highlighter } from 'lucide-react';
import Logo from '@/components/site/Logo';
import { useBrief } from '@/lib/BriefContext';
import { ROOMS } from '@/lib/rooms';
import { useTransitionCoordinator } from '@/lib/TransitionContext';

export default function SiteHeader() {
  const { totalCount, openBrief, pageMarkupActive, setPageMarkupActive } = useBrief();
  const location = useLocation();
  const navigate = useNavigate();
  const { startTransition } = useTransitionCoordinator();
  const [roomsOpen, setRoomsOpen] = useState(false);
  const menuRef = useRef(null);

  const currentPath = location.pathname.replace(/\/+$/, '') || '/';
  const activeRoom = ROOMS.find((room) => room.path === currentPath) || null;

  useEffect(() => {
    setRoomsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!roomsOpen) return;
    const handlePointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setRoomsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setRoomsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [roomsOpen]);

  const handleSelectRoom = (e, room) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setRoomsOpen(false);
    if (currentPath === room.path) return;
    startTransition(room, rect, navigate);
  };

  return (
    <header className="relative z-40 shrink-0 border-b border-[#DFDACE]/15 bg-[#23282A] text-[#EDE9E0]">
      <div className="flex items-center justify-between gap-1.5 sm:gap-3 px-2.5 py-2.5 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-5 min-w-0 shrink">
          <Logo />
          {activeRoom && (
            <div
              data-active-room={activeRoom.id}
              className="hidden sm:flex items-center gap-2 border-l border-[#DFDACE]/20 pl-4 font-mono text-xs uppercase tracking-wider text-[#EDE9E0]"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  backgroundColor: activeRoom.color === '#23282A' ? '#D9A62E' : activeRoom.color,
                }}
              />
              <span className="text-[10px] text-[#D9A62E] font-bold">{activeRoom.num}</span>
              <span className="font-semibold">{activeRoom.title}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mark Up This Page Toggle */}
          <button
            type="button"
            onClick={() => setPageMarkupActive(!pageMarkupActive)}
            aria-pressed={pageMarkupActive}
            title="See something you'd like for your project? Mark up this page."
            className={`flex items-center gap-1.5 border px-2 py-1.5 sm:px-2.5 text-xs font-mono uppercase tracking-wider transition-colors ${
              pageMarkupActive
                ? 'border-[#D9A62E] bg-[#D9A62E] text-[#141617] font-bold'
                : 'border-[#DFDACE]/25 bg-[#1F2325] text-[#DFDACE]/85 hover:border-[#D9A62E] hover:text-[#D9A62E]'
            }`}
          >
            <Highlighter className="h-3.5 w-3.5 text-[#D9A62E] shrink-0" style={pageMarkupActive ? { color: '#141617' } : undefined} />
            <span className="hidden md:inline">
              {pageMarkupActive ? 'Marking Up Page' : 'Mark up this page'}
            </span>
          </button>

          {/* Compact Four Rooms Control */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setRoomsOpen((prev) => !prev)}
              aria-expanded={roomsOpen}
              aria-haspopup="true"
              aria-label="Four Rooms navigation"
              data-active-path={currentPath}
              className={`group flex items-center gap-1.5 sm:gap-2 border px-2 py-1.5 sm:px-3 text-xs font-mono uppercase tracking-wider transition-colors ${
                roomsOpen || activeRoom
                  ? 'border-[#D9A62E]/70 bg-[#1B1F21] text-[#EDE9E0]'
                  : 'border-[#DFDACE]/25 bg-[#1F2325] text-[#DFDACE]/85 hover:border-[#D9A62E] hover:text-[#EDE9E0]'
              }`}
            >
              <span className="grid grid-cols-2 gap-0.5 p-0.5" aria-hidden="true">
                {ROOMS.map((room) => {
                  const isCurrent = activeRoom?.id === room.id;
                  return (
                    <span
                      key={room.id}
                      className={`h-1.5 w-1.5 transition-transform ${
                        isCurrent ? 'scale-125 ring-1 ring-[#D9A62E]' : 'opacity-80'
                      }`}
                      style={{
                        backgroundColor: room.color === '#23282A' ? '#EDE9E0' : room.color,
                      }}
                    />
                  );
                })}
              </span>
              <span className="hidden xs:inline sm:inline">
                {activeRoom ? `${activeRoom.num} · Four Rooms` : 'Four Rooms'}
              </span>
              <span className="inline xs:hidden sm:hidden">
                {activeRoom ? activeRoom.num : 'Rooms'}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#D9A62E] transition-transform duration-200 ${
                  roomsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {roomsOpen && (
              <div
                role="menu"
                aria-label="Four Rooms switcher"
                className="absolute right-0 mt-2 w-[300px] sm:w-[340px] border border-[#DFDACE]/25 bg-[#1B1F21] p-2.5 shadow-2xl z-50"
              >
                <div className="mb-2 flex items-center justify-between px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#DFDACE]/60">
                  <span>Select Working Room</span>
                  <span>{activeRoom ? `Room ${activeRoom.num}` : 'All Rooms'}</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {ROOMS.map((room) => {
                    const isCurrent = activeRoom?.id === room.id;
                    return (
                      <button
                        key={room.id}
                        type="button"
                        role="menuitem"
                        data-switch-room={room.id}
                        onClick={(e) => handleSelectRoom(e, room)}
                        style={{ backgroundColor: room.color, color: room.text }}
                        className={`group relative flex flex-col justify-between p-3 text-left transition-transform hover:-translate-y-0.5 ${
                          isCurrent
                            ? 'ring-2 ring-[#D9A62E]'
                            : 'border border-[#EDE9E0]/15 opacity-95 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 font-mono text-[10px] uppercase tracking-wider opacity-80">
                          <span>
                            {room.num} · {room.verb}
                          </span>
                          {isCurrent && (
                            <span className="bg-[#23282A]/85 px-1.5 py-0.5 text-[9px] font-bold text-[#D9A62E]">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="mt-3">
                          <div className="font-display text-sm font-bold leading-tight">
                            {room.title}
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] opacity-75 truncate">
                            {room.foot}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setRoomsOpen(false);
                    navigate('/lab/design-intelligence');
                  }}
                  className="mt-2 flex w-full items-center justify-between border border-[#D9A62E]/40 bg-[#23282A] px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-[#D9A62E] transition-colors hover:bg-[#D9A62E] hover:text-[#141617] font-bold"
                >
                  <span>Case Study 01: Design Intelligence</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Access to My Ideas */}
          <button
            onClick={openBrief}
            className="group flex items-center gap-1.5 sm:gap-2 border border-[#DFDACE]/25 bg-[#1F2325] px-2 py-1.5 sm:px-3 text-xs font-mono transition-colors hover:border-[#D9A62E] hover:text-[#D9A62E]"
            aria-label="Open my ideas"
          >
            <Lightbulb className="h-3.5 w-3.5 text-[#D9A62E]" />
            <span className="uppercase tracking-wider hidden sm:inline">My Ideas</span>
            <span
              className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold transition-transform ${
                totalCount > 0
                  ? 'bg-[#D9A62E] text-[#23282A] scale-105'
                  : 'bg-[#DFDACE]/20 text-[#DFDACE]/70'
              }`}
            >
              {totalCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
