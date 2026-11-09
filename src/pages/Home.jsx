import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import PageAnnotationOverlay from '@/components/site/PageAnnotationOverlay';
import HeroPanel from '@/components/home/HeroPanel';
import RoomTile from '@/components/home/RoomTile';
import { ROOMS } from '@/lib/rooms';
import { useTransitionCoordinator } from '@/lib/TransitionContext';

export default function Home() {
  const navigate = useNavigate();
  const { startTransition } = useTransitionCoordinator();

  const pick = (room, rect) => {
    startTransition(room, rect, navigate);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="relative flex min-h-screen flex-col bg-ink text-bone font-sans"
    >
      <SiteHeader />

      <main className="flex-1 flex flex-col">
        {/* Primary Split-Screen Entrance: Editorial Hero + Connected 2×2 Room Quadrants */}
        <section className="relative flex-1 flex flex-col w-full bg-[#141617]">
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] 2xl:grid-cols-[minmax(520px,0.82fr)_minmax(0,1.18fr)] xl:items-stretch min-h-[560px] xl:min-h-[640px]">
            {/* Left Column: Editorial Statement, CTAs, Signals */}
            <div className="flex flex-col border-b xl:border-b-0 xl:border-r border-[#DFDACE]/15">
              <HeroPanel onEnterRoom={pick} />
            </div>

            {/* Right Column: 2×2 Connected Room Quadrant */}
            <div className="w-full h-full bg-[#181B1C]">
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-px bg-[#DFDACE]/15 h-full w-full">
                {ROOMS.map((room, i) => (
                  <RoomTile key={room.id} room={room} index={i} onPick={pick} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PageAnnotationOverlay />
      <SiteFooter />
    </motion.div>
  );
}
