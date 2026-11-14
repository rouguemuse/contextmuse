import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowRight, Sliders, Search } from 'lucide-react';
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

        {/* Level 2C: Design Engineering & Systems Research Case Study (Design Intelligence) */}
        <section
          aria-label="Design Intelligence Research Case Study"
          className="border border-[#DFDACE]/20 bg-[#16191B] p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFDACE]/15 pb-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#D9A62E] font-bold">
                RESEARCH CASE STUDY 001 · DESIGN ENGINEERING &amp; UI/UX
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#17504A] text-[#EDE9E0] border border-[#EDE9E0]/20">
                85-NODE INTERACTIVE SPECIMEN
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#DFDACE]/65">
              Plaidis / Locomotive · Linear · Stripe → Context &amp; Muse
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#EDE9E0] leading-tight">
                Design Intelligence: From Visual Reference to Measurable Design Decisions
              </h2>
              <p className="text-xs sm:text-sm text-[#DFDACE]/85 font-sans leading-relaxed max-w-3xl">
                “Design is not a collection of preferences. It is a system of relationships.” An
                empirical investigation measuring how three contrasting reference systems construct
                hierarchy via CSSOM and DOM inspection, testing their tokens on an identical 85-node
                neutral specimen, and verifying the production transfer into Context &amp; Muse
                (0px desktop drift, 85/85 DOM parity, 18/18 WCAG 2.1 contrast swatches, 11/11 smoke
                gates).
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg font-mono">
                <div className="bg-[#23282A] border border-[#DFDACE]/15 p-2.5">
                  <span className="text-lg font-black text-[#D9A62E] block">03</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#DFDACE]/75">
                    Reference Systems
                  </span>
                </div>
                <div className="bg-[#23282A] border border-[#DFDACE]/15 p-2.5">
                  <span className="text-lg font-black text-[#D9A62E] block">85</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#DFDACE]/75">
                    Identical DOM Nodes
                  </span>
                </div>
                <div className="bg-[#23282A] border border-[#DFDACE]/15 p-2.5">
                  <span className="text-lg font-black text-[#D9A62E] block">18/18</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#DFDACE]/75">
                    WCAG Swatches
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-2.5 lg:items-end justify-center">
              <Link
                to="/lab/design-intelligence"
                className="inline-flex items-center justify-center gap-2 bg-[#D9A62E] text-[#141617] px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] hover:bg-[#EDE9E0] transition-colors w-full sm:w-auto lg:w-full"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Open Design Intelligence Study</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setOpenProjectId('website-audit-system')}
                className="inline-flex items-center justify-center gap-2 bg-transparent text-[#EDE9E0] border border-[#DFDACE]/25 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors w-full sm:w-auto lg:w-full"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Companion: Website Audit Dossier</span>
              </button>
            </div>
          </div>
        </section>

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
