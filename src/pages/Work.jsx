import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowRight, ExternalLink, Sliders, Search } from 'lucide-react';
import RoomShell from '@/components/room/RoomShell';
import RoomHeading from '@/components/room/RoomHeading';
import FlagshipShowcase from '@/components/work/FlagshipShowcase';
import InncontrolShowcase from '@/components/work/InncontrolShowcase';
import SignalShowcase from '@/components/work/SignalShowcase';
import SecondaryGallery from '@/components/work/SecondaryGallery';
import ProofViewer from '@/components/work/ProofViewer';
import EditorialEvidenceFrame from '@/components/work/EditorialEvidenceFrame';
import { getProjectById } from '@/data/projects';
import { roomById } from '@/lib/rooms';

const SECTION_NAV = [
  { num: '01', label: 'Commercial Client Systems', target: '#flagship-lone-wolf', accent: '#D9A62E' },
  { num: '02', label: 'Original Software Products', target: '#signal-and-products', accent: '#17504A' },
  { num: '03', label: 'Civic, Research & Specialized Builds', target: '#civic-and-research', accent: '#EDE9E0' },
  { num: '04', label: 'Complete 21-Entry Directory', target: '#content-index', accent: '#D9A62E' },
];

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

  const scrollToSection = (target) => {
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectedProject = openProjectId ? getProjectById(openProjectId) : null;

  return (
    <RoomShell room={room} accentBarColor="#D9A62E">
      <div className="mx-auto w-full max-w-[1380px] min-w-0 px-4 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-12 lg:px-12 space-y-16 sm:space-y-20 font-sans">
        {/* Room Header + Architectural Section Index */}
        <RoomHeading
          num={room.num}
          verb={room.verb}
          badge="Websites, Digital Products & Custom Software"
          title="The Work."
          watermark={room.num}
          accentColor="#D9A62E"
          sub="Completed client builds, original digital products, civic initiatives, and applied systems research—demonstrating how visual design, user experience, and custom engineering work together."
        >
          <nav
            aria-label="Work portfolio sections"
            className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 font-mono text-xs"
          >
            {SECTION_NAV.map((sec) => (
              <button
                key={sec.num}
                type="button"
                onClick={() => scrollToSection(sec.target)}
                className="flex items-center justify-between gap-2 bg-[#1B1F21] border border-[#DFDACE]/15 hover:border-[#D9A62E] px-3.5 py-2.5 text-left transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    aria-hidden="true"
                    className="inline-block h-2 w-2 shrink-0"
                    style={{ backgroundColor: sec.accent }}
                  />
                  <span className="text-[#D9A62E] font-bold shrink-0">{sec.num}</span>
                  <span className="text-[#EDE9E0] truncate group-hover:text-[#D9A62E] transition-colors">
                    {sec.label}
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#DFDACE]/50 group-hover:text-[#D9A62E] shrink-0 transition-colors" />
              </button>
            ))}
          </nav>
        </RoomHeading>

        {/* Section 01: Commercial Client Systems (Wolf Ridge Dumpsters + INNcontrol Coils) */}
        <div className="space-y-10">
          <FlagshipShowcase onOpenCaseStudy={(id) => setOpenProjectId(id)} />
          <InncontrolShowcase onOpenCaseStudy={(id) => setOpenProjectId(id)} />
        </div>

        {/* Section 02: Original Software Products (Signal + GenSort + Self-Cartography + WCSM) */}
        <SignalShowcase onOpenCaseStudy={(id) => setOpenProjectId(id)} />

        {/* Section 03: Civic Initiatives, Applied Research & Specialized Builds (2x2 Architectural Grid) */}
        <section
          id="civic-and-research"
          aria-label="Design Intelligence Research Case Study"
          className="space-y-8 border-t border-[#DFDACE]/20 pt-14"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DFDACE]/15 pb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#D9A62E] font-bold">
                <span className="inline-block h-2 w-2 bg-[#EDE9E0]" />
                <span>03 / Civic Initiatives, Research &amp; Specialized Builds</span>
              </div>
              <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#EDE9E0]">
                Public-Interest Systems, Empirical Research &amp; Diagnostic Tools
              </h2>
            </div>

            <span className="font-mono text-xs text-[#DFDACE]/65">
              Civic Continuity · CSSOM Token Research · Bilingual Triage · UX Diagnostics
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-stretch min-w-0">
            {/* Card 1: Maps With Teeth (Civic Initiative) — Composed Project Cover */}
            <article className="min-w-0 flex flex-col justify-between bg-[#1B1F21] border border-[#DFDACE]/20 border-t-[3px] border-t-[#EDE9E0]">
              <div className="min-w-0 p-5 sm:p-6 pb-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span className="text-[#EDE9E0] font-bold">
                      CIVIC INITIATIVE · PUBLIC-INTEREST CONTINUITY
                    </span>
                    <span className="border border-[#DFDACE]/25 bg-[#141719] text-[#EDE9E0] px-2 py-0.5">
                      Live Initiative
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#EDE9E0] leading-tight">
                      Maps With Teeth
                    </h3>
                    <p className="font-mono text-xs text-[#D9A62E] mt-1">
                      Barrier-First Resource Intelligence &amp; Cross-Jurisdiction Continuity
                    </p>
                  </div>

                  <p className="font-sans text-xs sm:text-[13px] text-[#DFDACE]/85 leading-relaxed">
                    An independent public-interest initiative (mapswithteeth.org) that surfaces real institutional prerequisites, residency cutoffs, and cross-county handoff gaps upfront with crisis-safe quick-exit protections.
                  </p>
                </div>

                <div className="pt-2">
                  <EditorialEvidenceFrame
                    src="/assets/images/mapswithteeth-screenshot.webp"
                    alt="Maps With Teeth Public-Interest Civic Continuity Platform"
                    title="Maps With Teeth"
                    variant="card"
                    accentColor="#EDE9E0"
                    liveUrl="https://www.mapswithteeth.org/"
                  />
                </div>
              </div>

              <div className="px-5 sm:px-6 py-3.5 bg-[#141719] border-t border-[#DFDACE]/15 flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setOpenProjectId('maps-with-teeth')}
                  className="inline-flex items-center gap-1.5 bg-[#D9A62E] text-[#141617] px-3.5 py-2 font-bold uppercase tracking-wider hover:bg-[#EDE9E0] transition-colors"
                >
                  <span>Inspect Case Study</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <a
                  href="https://www.mapswithteeth.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-[#DFDACE]/25 bg-[#1B1F21] text-[#EDE9E0] px-3 py-2 font-bold uppercase tracking-wider hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
                >
                  <span>Live Site</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>

            {/* Card 2: Design Intelligence (Research Case Study 001) — Composed Project Cover */}
            <article className="min-w-0 flex flex-col justify-between bg-[#1B1F21] border border-[#DFDACE]/20 border-t-[3px] border-t-[#D9A62E]">
              <div className="min-w-0 p-5 sm:p-6 pb-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span className="text-[#D9A62E] font-bold">
                      RESEARCH CASE STUDY 001 · DESIGN ENGINEERING &amp; UI/UX
                    </span>
                    <span className="bg-[#17504A] text-[#EDE9E0] border border-[#EDE9E0]/20 px-2 py-0.5">
                      85-Node Specimen
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#EDE9E0] leading-tight">
                      Design Intelligence: From Visual Reference to Measurable Design Decisions
                    </h3>
                    <p className="font-mono text-xs text-[#DFDACE]/65 mt-1">
                      Plaidis / Locomotive · Linear · Stripe → Context &amp; Muse (0px Drift · 18/18 WCAG)
                    </p>
                  </div>

                  <p className="font-sans text-xs sm:text-[13px] text-[#DFDACE]/85 leading-relaxed">
                    Measures how three contrasting reference systems construct hierarchy via CSSOM/DOM inspection, tests their extracted tokens on an identical 85-node neutral specimen, and verifies production transfer into Context &amp; Muse.
                  </p>
                </div>

                <div className="pt-2">
                  <EditorialEvidenceFrame
                    src="/assets/images/design-intelligence/exp01_after_desktop.png"
                    alt="Design Intelligence 85-Node Interactive Specimen and Token Transfer"
                    title="Design Intelligence"
                    variant="card"
                    accentColor="#D9A62E"
                    liveUrl="/lab/design-intelligence"
                  />
                </div>
              </div>

              <div className="px-5 sm:px-6 py-3.5 bg-[#141719] border-t border-[#DFDACE]/15 flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs">
                <Link
                  to="/lab/design-intelligence"
                  className="inline-flex items-center gap-1.5 bg-[#D9A62E] text-[#141617] px-3.5 py-2 font-bold uppercase tracking-wider hover:bg-[#EDE9E0] transition-colors"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Open Design Intelligence Study</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setOpenProjectId('website-audit-system')}
                  className="inline-flex items-center gap-1.5 border border-[#DFDACE]/25 bg-[#1B1F21] text-[#EDE9E0] px-3 py-2 font-bold uppercase tracking-wider hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Companion: Website Audit Dossier</span>
                </button>
              </div>
            </article>

            {/* Card 3: EDR Party Rentals (Commercial Client Build) — Composed Project Cover */}
            <article className="min-w-0 flex flex-col justify-between bg-[#1B1F21] border border-[#DFDACE]/20 border-t-[3px] border-t-[#D9A62E]">
              <div className="min-w-0 p-5 sm:p-6 pb-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span className="text-[#D9A62E] font-bold">
                      COMMERCIAL CLIENT BUILD · BILINGUAL RESERVATION SYSTEM
                    </span>
                    <span className="border border-[#D9A62E]/40 bg-[#141719] text-[#D9A62E] px-2 py-0.5">
                      EN / ES Parity
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#EDE9E0] leading-tight">
                      EDR Party Rentals
                    </h3>
                    <p className="font-mono text-xs text-[#DFDACE]/65 mt-1">
                      Bilingual Event Inventory, Surface Safety Rules &amp; Date-Based Triage
                    </p>
                  </div>

                  <p className="font-sans text-xs sm:text-[13px] text-[#DFDACE]/85 leading-relaxed">
                    Eliminates weekend double-bookings by locking serialized rental assets across event dates, injecting mandatory concrete ballast surcharges, and maintaining 100% English and Spanish checkout parity.
                  </p>
                </div>

                <div className="pt-2">
                  <EditorialEvidenceFrame
                    src="/assets/captures/edr-live.jpg"
                    alt="EDR Party Rentals Bilingual Event Inventory and Reservation Triage"
                    title="EDR Party Rentals"
                    variant="card"
                    accentColor="#D9A62E"
                    liveUrl="/case-studies/edr-party-rentals/"
                  />
                </div>
              </div>

              <div className="px-5 sm:px-6 py-3.5 bg-[#141719] border-t border-[#DFDACE]/15 flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setOpenProjectId('edr-party-rentals')}
                  className="inline-flex items-center gap-1.5 bg-[#D9A62E] text-[#141617] px-3.5 py-2 font-bold uppercase tracking-wider hover:bg-[#EDE9E0] transition-colors"
                >
                  <span>Inspect Case Study</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="/case-studies/edr-party-rentals/"
                    className="inline-flex items-center gap-1.5 border border-[#DFDACE]/25 bg-[#1B1F21] text-[#EDE9E0] px-3 py-2 font-bold uppercase tracking-wider hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
                  >
                    <span>Case Study Page</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="/services/quote-lead-systems/"
                    className="inline-flex items-center gap-1.5 border border-[#17504A] bg-[#17504A]/35 text-[#EDE9E0] px-3 py-2 font-bold uppercase tracking-wider hover:bg-[#17504A] transition-colors"
                  >
                    <span>Quote Systems Offer</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#D9A62E]" />
                  </a>
                </div>
              </div>
            </article>

            {/* Card 4: Website + System Check (Diagnostic Instrument) — Composed Project Cover */}
            <article className="min-w-0 flex flex-col justify-between bg-[#1B1F21] border border-[#DFDACE]/20 border-t-[3px] border-t-[#17504A]">
              <div className="min-w-0 p-5 sm:p-6 pb-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span className="text-[#D9A62E] font-bold">
                      DIAGNOSTIC INSTRUMENT · 4-PILLAR UX INSPECTOR
                    </span>
                    <span className="border border-[#17504A] bg-[#17504A]/30 text-[#EDE9E0] px-2 py-0.5">
                      Interactive Workbench
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#EDE9E0] leading-tight">
                      Website + System Check
                    </h3>
                    <p className="font-mono text-xs text-[#DFDACE]/65 mt-1">
                      Multi-Viewport Responsive &amp; 4-Pillar Structural Diagnostic
                    </p>
                  </div>

                  <p className="font-sans text-xs sm:text-[13px] text-[#DFDACE]/85 leading-relaxed">
                    Inspects desktop, tablet, and mobile viewports side-by-side and anchors actionable conversion critiques directly to DOM coordinates across Message, Paths, Proof, and Intake.
                  </p>
                </div>

                <div className="pt-2">
                  <EditorialEvidenceFrame
                    src="/assets/images/website-audit-hero.webp"
                    alt="Website and System Check Multi-Viewport Diagnostic Workbench"
                    title="Website + System Check"
                    variant="card"
                    accentColor="#17504A"
                    liveUrl="/website-system-check/"
                  />
                </div>
              </div>

              <div className="px-5 sm:px-6 py-3.5 bg-[#141719] border-t border-[#DFDACE]/15 flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setOpenProjectId('website-audit-system')}
                  className="inline-flex items-center gap-1.5 bg-[#D9A62E] text-[#141617] px-3.5 py-2 font-bold uppercase tracking-wider hover:bg-[#EDE9E0] transition-colors"
                >
                  <span>Inspect Case Study</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <a
                  href="/website-system-check/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-[#DFDACE]/25 bg-[#1B1F21] text-[#EDE9E0] px-3 py-2 font-bold uppercase tracking-wider hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
                >
                  <span>Launch Inspector</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* Section 04: Complete Work, Product & Research Index */}
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
