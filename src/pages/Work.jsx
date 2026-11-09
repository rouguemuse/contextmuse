import React, { useState } from 'react';
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
  const [openProjectId, setOpenProjectId] = useState(null);

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
            onClose={() => setOpenProjectId(null)}
          />
        )}
      </div>
    </RoomShell>
  );
}
