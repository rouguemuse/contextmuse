import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import RoomShell from '@/components/room/RoomShell';
import RoomHeading from '@/components/room/RoomHeading';
import FlagshipShowcase from '@/components/work/FlagshipShowcase';
import InncontrolShowcase from '@/components/work/InncontrolShowcase';
import SignalShowcase from '@/components/work/SignalShowcase';
import SecondaryGallery from '@/components/work/SecondaryGallery';
import ProofViewer from '@/components/work/ProofViewer';
import { getProjectById } from '@/data/projects';
import { roomById } from '@/lib/rooms';

export default function Work() {
  const room = roomById('work');
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openProjectId, setOpenProjectId] = useState(
    () => searchParams.get('case') || null
  );

  useEffect(() => {
    const requestedCase = searchParams.get('case');
    if (requestedCase && getProjectById(requestedCase)) {
      setOpenProjectId(requestedCase);
    }
  }, [searchParams]);

  useEffect(() => {
    if (location.pathname === '/index' || location.hash === '#content-index') {
      const timer = setTimeout(() => {
        const el = document.getElementById('content-index');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  const handleCloseCaseStudy = () => {
    setOpenProjectId(null);
    if (searchParams.has('case')) {
      const next = new URLSearchParams(searchParams);
      next.delete('case');
      setSearchParams(next, { replace: true });
    }
  };

  const selectedProject = openProjectId ? getProjectById(openProjectId) : null;

  return (
    <RoomShell room={room}>
      <div className="w-full min-w-0 px-4 pb-20 pt-7 sm:px-8 sm:pb-24 sm:pt-10 lg:px-12 max-w-7xl mx-auto space-y-12">
        {/* Room Header: Restrained & Direct */}
        <RoomHeading
          num={room.num}
          verb={room.verb}
          badge="Websites, Digital Products & Custom Software"
          title="The Work."
          watermark={room.num}
          sub="Completed client builds, original digital products, and functional prototypes—demonstrating how visual design, user experience, and custom engineering work together."
        />

        {/* Level 1: Flagship Showcase (Wolf Ridge Dumpsters) */}
        <FlagshipShowcase onOpenCaseStudy={(id) => setOpenProjectId(id)} />

        {/* Level 2A: Supporting System (INNcontrol Coils - Commercial Platform + Operator HUD) */}
        <InncontrolShowcase onOpenCaseStudy={(id) => setOpenProjectId(id)} />

        {/* Level 2B: Live Software Product (Signal Operational Intelligence + GenSort + Self-Cartography) */}
        <SignalShowcase onOpenCaseStudy={(id) => setOpenProjectId(id)} />

        {/* Level 3: Complete Work & Product Index */}
        <SecondaryGallery onOpenCaseStudy={(id) => setOpenProjectId(id)} />

        {/* Interactive Case Study Walkthrough Modal */}
        {selectedProject && (
          <ProofViewer
            item={selectedProject}
            onClose={handleCloseCaseStudy}
            onSelectRelated={(id) => setOpenProjectId(id)}
          />
        )}
      </div>
    </RoomShell>
  );
}
