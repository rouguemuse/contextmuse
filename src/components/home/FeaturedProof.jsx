import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, CheckCircle2, Bookmark, Check, ShieldCheck, Truck } from 'lucide-react';
import { PROJECTS } from '@/data/projects';
import { useBrief } from '@/lib/BriefContext';

export default function FeaturedProof() {
  const navigate = useNavigate();
  const { isProjectSaved, toggleSaveProject, openBrief } = useBrief();
  const project = PROJECTS.find((p) => p.id === 'lone-wolf-dumpsters');

  const isSaved = project ? isProjectSaved(project.id) : false;

  return (
    <section id="featured-proof" className="border-t border-[#DFDACE]/15 bg-[#171A1B] px-5 py-12 sm:px-10 sm:py-16 lg:px-14">
      <div className="mx-auto max-w-7xl space-y-8 font-sans">
        {/* Section Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#DFDACE]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#D9A62E]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#D9A62E] font-bold">
              01 / FEATURED PRODUCTION SYSTEM • LOGISTICS & INFRASTRUCTURE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-[#17504A] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-[#EDE9E0]">
              Verified Production Deployment
            </span>
          </div>
        </div>

        {/* Main Grid: Screenshot on Left, Operational Breakdown on Right */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Substantial Genuine Production Screenshot */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-lg border border-[#DFDACE]/25 bg-[#23282A] shadow-2xl transition-all duration-300 hover:border-[#D9A62E]/50 group">
              {/* Browser Window Chrome */}
              <div className="flex items-center justify-between border-b border-white/10 bg-[#1C2022] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80" />
                </div>
                <div className="flex items-center gap-1.5 rounded bg-black/30 px-2.5 sm:px-3 py-1 font-mono text-[10px] sm:text-[10.5px] text-[#DFDACE]/70 max-w-[210px] sm:max-w-none truncate">
                  <span className="text-emerald-400">🔒</span>
                  <span className="truncate">https://wolfridgedumpsters.com</span>
                </div>
                <div className="text-[10px] font-mono text-[#DFDACE]/40 hidden sm:block">
                  DFW Production
                </div>
              </div>

              {/* Genuine Screenshot Display (crops baked-in outer frame & browser bar so only the dark Wolf Ridge viewport fills the chrome) */}
              <div className="relative bg-[#111314] overflow-hidden">
                <img
                  src="/assets/images/lonewolf-screenshot.webp"
                  alt="Wolf Ridge Dumpsters production website interface screenshot"
                  className="w-[106.2%] max-w-none -ml-[3.1%] -mt-[5.15%] -mb-[2.4%] h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                  loading="eager"
                />
              </div>

              {/* Screenshot Caption Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#1C2022] px-4 py-2 text-[11px] font-mono text-[#DFDACE]/70">
                <span>Production Artifact: Live Customer Intake &amp; Quoting Interface</span>
                <span className="text-[#D9A62E] font-bold">48 DFW Municipal Landing Pages</span>
              </div>
            </div>
          </div>

          {/* Right Column: Grounded Operational Story & Functionality */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#D9A62E] font-bold block mb-1">
                Local Logistics Platform &amp; Quoting Engine
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#EDE9E0] leading-none">
                Wolf Ridge Dumpsters
              </h2>
              <p className="mt-3 text-sm text-[#DFDACE]/90 leading-relaxed font-sans">
                A multi-city roll-off dumpster and junk removal operator bogged down by repetitive phone-order sizing calls. I built a transparent sizing, flat-rate pricing, and dual-service intake system across 48 DFW municipal pages that routes clean orders straight to dispatch.
              </p>
            </div>

            {/* 3 Operational Facts (No invented metrics) */}
            <div className="space-y-3.5 border-y border-[#DFDACE]/15 py-4 text-xs font-sans">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#D9A62E] block mb-0.5 font-bold">
                  The Operational Friction:
                </span>
                <p className="text-[#DFDACE]/80 leading-relaxed">
                  Dispatchers were fielding repetitive phone questions about 15, 20, and 25-yard container dimensions, weight allowances, and whether a job needed a roll-off container or a full-service junk removal crew.
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-emerald-400 block mb-0.5 font-bold">
                  What Was Built:
                </span>
                <p className="text-[#DFDACE]/80 leading-relaxed">
                  Upfront flat-rate container cards (15 / 20 / 25-yard with tonnage allowances), differentiated intake tracks for Dumpster Rental vs. Junk Removal, and 48 geo-targeted DFW municipal landing pages.
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#DFDACE]/60 block mb-0.5 font-bold">
                  What It Enables Today:
                </span>
                <p className="text-[#DFDACE]/80 leading-relaxed">
                  Homeowners and contractors confirm container size, flat-rate pricing, and service rules upfront, sending structured drop orders directly to dispatch without phone tag.
                </p>
              </div>
            </div>

            {/* Tangible Output Artifact */}
            <div className="rounded border border-[#DFDACE]/15 bg-[#141617] p-3 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-[#DFDACE]/50 text-[10px]">
                <span>STRUCTURED DISPATCH PAYLOAD</span>
                <span className="text-emerald-400 font-bold">READY FOR DISPATCH ✓</span>
              </div>
              <p className="text-[#EDE9E0]/90 text-[11px]">
                Order #WR-4812 · Plano, TX · 20-Yard Roll-Off ($425 / 2.5 Tons) · Driveway placement · Debris: Remodel Drywall · Drop: Friday 07:00 AM
              </p>
            </div>

            {/* Clear Action Pathways */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <button
                onClick={() => navigate('/work')}
                className="flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 bg-[#D9A62E] text-[#141617] px-3.5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider rounded hover:bg-[#e0b240] transition-colors shadow-md"
              >
                <span>View Full Case Study</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              </button>

              {project?.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 border border-[#DFDACE]/25 bg-[#23282A] text-[#EDE9E0] px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-wider rounded hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
                >
                  <span>Visit Live Site</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              )}

              {project && (
                <button
                  onClick={() => toggleSaveProject(project)}
                  className="flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 text-[11px] font-mono text-[#DFDACE]/60 hover:text-[#D9A62E] px-2 py-2 transition-colors sm:ml-auto"
                  aria-label="Save Wolf Ridge Dumpsters to My Ideas"
                >
                  {isSaved ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="text-emerald-400">Saved to Ideas</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-3.5 w-3.5 shrink-0" />
                      <span>Save to Ideas</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
