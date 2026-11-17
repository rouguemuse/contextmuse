import React from 'react';
import {
  ArrowRight,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Building2,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';
import EditorialEvidenceFrame from '@/components/work/EditorialEvidenceFrame';
import { PROJECT_EVIDENCE_PLATES } from '@/components/work/workData';

export default function InncontrolShowcase({ onOpenCaseStudy }) {
  const { isProjectSaved, toggleSaveProject } = useBrief();
  const saved = isProjectSaved('inncontrol-coils');
  const savedD2 = isProjectSaved('d2-auto-detail');

  const handleSave = () => {
    toggleSaveProject({
      id: 'inncontrol-coils',
      title: 'INNcontrol Coils',
      subtitle: 'Nationwide Hotel PTAC Coil Refurbishing Platform & Operator Dashboards',
      tier: 'featured',
    });
  };

  const handleSaveD2 = () => {
    toggleSaveProject({
      id: 'd2-auto-detail',
      title: 'D2 Auto Detail — Detail Driven',
      subtitle: 'Precision Automotive Detailing Platform, Condition Quote Intake & Business Portal',
      tier: 'featured',
    });
  };

  return (
    <div className="space-y-10">
    <section id="inncontrol-coils" aria-label="INNcontrol Coils Client System">
      <article className="bg-[#1B1F21] border border-[#DFDACE]/20 border-t-[3px] border-t-[#D9A62E] p-6 sm:p-8 lg:p-10 space-y-6">
        {/* Header Bar: Composed Project Cover (Restrained Metadata → Prominent Title → Short Contextual Description) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-[#DFDACE]/15 pb-6">
          <div className="min-w-0 space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
              <span className="bg-[#D9A62E] text-[#141617] px-2.5 py-0.5 font-bold">
                Commercial Client System
              </span>
              <span className="border border-[#DFDACE]/20 bg-[#141719] text-[#EDE9E0] px-2.5 py-0.5">
                Public B2B Platform + Internal Ops HUD
              </span>
              <span className="text-[#DFDACE]/60">Hospitality HVAC &amp; PTAC Refurbishing</span>
            </div>

            <h3 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#EDE9E0] leading-none">
              INNcontrol Coils
            </h3>
            <p className="font-mono text-xs sm:text-sm text-[#D9A62E]">
              Nationwide B2B Hospitality Platform &amp; Daily Operator Check-In Dashboards
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#DFDACE]/80 leading-relaxed pt-0.5">
              Pairs a public commercial platform for nationwide hotel ownership groups with an internal floorplan scoping wizard and daily operator readiness HUD.
            </p>
          </div>

          {/* Action Buttons (Consistent 0px Editorial Controls) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 font-mono text-xs">
            <button
              type="button"
              onClick={() => onOpenCaseStudy('inncontrol-coils')}
              className="inline-flex items-center gap-2 bg-[#D9A62E] text-[#141617] px-4 py-2.5 font-bold uppercase tracking-wider hover:bg-[#EDE9E0] transition-colors"
            >
              <span>Inspect Case Study</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <a
              href="https://inncontrolcoils.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[#DFDACE]/25 bg-[#141719] text-[#EDE9E0] px-3.5 py-2.5 font-bold uppercase tracking-wider hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <a
              href="/inncontrol-v2/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[#17504A] bg-[#17504A]/35 text-[#EDE9E0] px-3.5 py-2.5 font-bold uppercase tracking-wider hover:bg-[#17504A] transition-colors"
            >
              <span>Operator HUD</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#D9A62E]" />
            </a>

            <button
              type="button"
              onClick={handleSave}
              title={saved ? 'Saved in My Ideas' : 'Save to My Ideas'}
              aria-label={saved ? 'Saved in My Ideas' : 'Save to My Ideas'}
              className={`p-2.5 border transition-colors ${
                saved
                  ? 'border-[#D9A62E] bg-[#D9A62E]/20 text-[#D9A62E]'
                  : 'border-[#DFDACE]/25 bg-[#141719] text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E]'
              }`}
            >
              {saved ? (
                <BookmarkCheck className="h-4 w-4 text-[#D9A62E]" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* 12-Column Architectural Spread: Editorial Evidence Frame (7 Cols) + System Specification (5 Cols) */}
        <div className="grid gap-6 lg:grid-cols-12 items-stretch min-w-0">
          {/* Left 7 Columns: Composed Editorial Evidence Frame with Dual-Plate Switcher */}
          <div className="lg:col-span-7 min-w-0 flex flex-col justify-between">
            <EditorialEvidenceFrame
              title="INNcontrol Coils"
              plates={PROJECT_EVIDENCE_PLATES['inncontrol-coils']}
              variant="lead"
              showDualCompanionStrip={true}
              accentColor="#D9A62E"
              liveUrl="https://inncontrolcoils.com"
            />
          </div>

          {/* Right 5 Columns: Unified Hospitality Platform & Operator Dossier */}
          <div className="lg:col-span-5 min-w-0 flex flex-col justify-between bg-[#141719] border border-[#DFDACE]/15 p-5 sm:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#DFDACE]/12 pb-2.5">
                <span className="font-mono text-xs font-bold text-[#D9A62E] uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Public Platform + Internal Ops Suite</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#DFDACE]/55">
                  3 Connected Surfaces
                </span>
              </div>

              <p className="font-sans text-xs sm:text-[13.5px] text-[#EDE9E0]/90 leading-relaxed">
                Built for hotel ownership groups and facility directors managing high-volume PTAC units nationwide—pairing a commercial multi-property intake website with a custom mobile daily check-in workflow and live operator readiness HUD.
              </p>

              {/* Compact 3-Surface Ledger */}
              <div className="divide-y divide-[#DFDACE]/10 border-t border-b border-[#DFDACE]/12 font-sans text-xs">
                <div className="py-2.5 flex items-start gap-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-[#D9A62E] shrink-0 pt-0.5">01</span>
                  <div>
                    <strong className="font-mono text-[11px] uppercase tracking-wider text-[#EDE9E0] block">
                      Commercial Hospitality Web Platform
                    </strong>
                    <span className="text-[#DFDACE]/75 text-xs">
                      Positions deep PTAC coil restoration, airflow recovery, and multi-property scheduling intake.
                    </span>
                  </div>
                </div>
                <div className="py-2.5 flex items-start gap-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-[#D9A62E] shrink-0 pt-0.5">02</span>
                  <div>
                    <strong className="font-mono text-[11px] uppercase tracking-wider text-[#EDE9E0] block">
                      Mobile Daily Operator Check-In Wizard
                    </strong>
                    <span className="text-[#DFDACE]/75 text-xs">
                      Thumb-friendly field flow capturing morning readiness, top 3 priorities, and end-of-day debriefs.
                    </span>
                  </div>
                </div>
                <div className="py-2.5 flex items-start gap-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-[#D9A62E] shrink-0 pt-0.5">03</span>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <strong className="font-mono text-[11px] uppercase tracking-wider text-[#EDE9E0]">
                        Operator Readiness &amp; Status HUD
                      </strong>
                      <a
                        href="/inncontrol-v2/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10.5px] text-[#D9A62E] underline hover:text-[#EDE9E0]"
                      >
                        Open HUD ↗
                      </a>
                    </div>
                    <span className="text-[#DFDACE]/75 text-xs block mt-0.5">
                      Live visual status dashboard translating daily habits and completed field objectives into an operator HUD.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 font-mono text-[10.5px]">
              <div className="bg-[#101214] border border-[#DFDACE]/15 px-3 py-2">
                <span className="block text-[#D9A62E] font-bold uppercase">PUBLIC SYSTEM</span>
                <span className="text-[#DFDACE]/75">B2B Multi-Property Intake</span>
              </div>
              <div className="bg-[#101214] border border-[#17504A] px-3 py-2">
                <span className="block text-[#EDE9E0] font-bold uppercase">INTERNAL OPS</span>
                <span className="text-[#DFDACE]/75">Daily Check-In + Status HUD</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>

    {/* D2 Auto Detail — Detail Driven (Public Website + Business Portal & Ad Studio) */}
    <section id="d2-auto-detail" aria-label="D2 Auto Detail Client System">
      <article className="bg-[#1B1F21] border border-[#DFDACE]/20 border-t-[3px] border-t-[#D9A62E] p-6 sm:p-8 lg:p-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-[#DFDACE]/15 pb-6">
          <div className="min-w-0 space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
              <span className="bg-[#D9A62E] text-[#141617] px-2.5 py-0.5 font-bold">
                Commercial Client System
              </span>
              <span className="border border-[#DFDACE]/20 bg-[#141719] text-[#EDE9E0] px-2.5 py-0.5">
                Public Platform + D2 Business Portal
              </span>
              <span className="text-[#DFDACE]/60">Austin, TX · Automotive Detailing &amp; PPF</span>
            </div>

            <h3 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#EDE9E0] leading-none">
              D2 Auto Detail — Detail Driven
            </h3>
            <p className="font-mono text-xs sm:text-sm text-[#D9A62E]">
              Precision Automotive Detailing Platform, Condition Quote Intake &amp; Operator Business Portal
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#DFDACE]/80 leading-relaxed pt-0.5">
              Pairs a high-contrast Austin paint correction, ceramic coating, and PPF acquisition platform with a custom D2 Business Portal featuring CMS Studio, Order Center, Invoice Builder, and an in-browser Social Media Ad Creator.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 font-mono text-xs">
            <button
              type="button"
              onClick={() => onOpenCaseStudy('d2-auto-detail')}
              className="inline-flex items-center gap-2 bg-[#D9A62E] text-[#141617] px-4 py-2.5 font-bold uppercase tracking-wider hover:bg-[#EDE9E0] transition-colors"
            >
              <span>Inspect Case Study</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <a
              href="https://www.d2autodetail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[#DFDACE]/25 bg-[#141719] text-[#EDE9E0] px-3.5 py-2.5 font-bold uppercase tracking-wider hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <a
              href="https://www.d2autodetail.com/admin.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[#17504A] bg-[#17504A]/35 text-[#EDE9E0] px-3.5 py-2.5 font-bold uppercase tracking-wider hover:bg-[#17504A] transition-colors"
            >
              <span>Business Portal</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#D9A62E]" />
            </a>

            <button
              type="button"
              onClick={handleSaveD2}
              title={savedD2 ? 'Saved in My Ideas' : 'Save to My Ideas'}
              aria-label={savedD2 ? 'Saved in My Ideas' : 'Save to My Ideas'}
              className={`p-2.5 border transition-colors ${
                savedD2
                  ? 'border-[#D9A62E] bg-[#D9A62E]/20 text-[#D9A62E]'
                  : 'border-[#DFDACE]/25 bg-[#141719] text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E]'
              }`}
            >
              {savedD2 ? (
                <BookmarkCheck className="h-4 w-4 text-[#D9A62E]" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-stretch min-w-0">
          <div className="lg:col-span-7 min-w-0 flex flex-col justify-between">
            <EditorialEvidenceFrame
              title="D2 Auto Detail — Detail Driven"
              plates={PROJECT_EVIDENCE_PLATES['d2-auto-detail']}
              variant="lead"
              accentColor="#D9A62E"
              liveUrl="https://www.d2autodetail.com"
            />
          </div>

          <div className="lg:col-span-5 min-w-0 flex flex-col justify-between bg-[#141719] border border-[#DFDACE]/15 p-5 sm:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#DFDACE]/12 pb-2.5">
                <span className="font-mono text-xs font-bold text-[#D9A62E] uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Public Acquisition + Operator Portal</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#DFDACE]/55">
                  4 Admin Modules
                </span>
              </div>

              <p className="font-sans text-xs sm:text-[13.5px] text-[#EDE9E0]/90 leading-relaxed">
                Designed for Austin&apos;s Detail Driven studio to unify public ceramic coating, paint correction, and PPF quote requests with an internal operator portal for managing services, orders, invoices, and social graphics.
              </p>

              <div className="divide-y divide-[#DFDACE]/10 border-t border-b border-[#DFDACE]/12 font-sans text-xs">
                <div className="py-2.5 flex items-start gap-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-[#D9A62E] shrink-0 pt-0.5">01</span>
                  <div>
                    <strong className="font-mono text-[11px] uppercase tracking-wider text-[#EDE9E0] block">
                      Condition-Based Detailing &amp; PPF Intake
                    </strong>
                    <span className="text-[#DFDACE]/75 text-xs">
                      Captures vehicle class, paint correction stage, and protection package selection upfront on d2autodetail.com.
                    </span>
                  </div>
                </div>
                <div className="py-2.5 flex items-start gap-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-[#D9A62E] shrink-0 pt-0.5">02</span>
                  <div>
                    <strong className="font-mono text-[11px] uppercase tracking-wider text-[#EDE9E0] block">
                      Order Center &amp; One-Click Invoice Builder
                    </strong>
                    <span className="text-[#DFDACE]/75 text-xs">
                      Syncs customer quotes into the D2 Business Portal and converts active jobs into itemized print/PDF invoices and receipts.
                    </span>
                  </div>
                </div>
                <div className="py-2.5 flex items-start gap-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-[#D9A62E] shrink-0 pt-0.5">03</span>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <strong className="font-mono text-[11px] uppercase tracking-wider text-[#EDE9E0]">
                        CMS Studio &amp; Social Ad Creator
                      </strong>
                      <a
                        href="https://www.d2autodetail.com/admin.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10.5px] text-[#D9A62E] underline hover:text-[#EDE9E0]"
                      >
                        Open Portal ↗
                      </a>
                    </div>
                    <span className="text-[#DFDACE]/75 text-xs block mt-0.5">
                      Updates service tiers, DD TV YouTube episodes, and 1:1 / 9:16 social media graphics directly in the browser.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 font-mono text-[10.5px]">
              <div className="bg-[#101214] border border-[#DFDACE]/15 px-3 py-2">
                <span className="block text-[#D9A62E] font-bold uppercase">PUBLIC SITE</span>
                <span className="text-[#DFDACE]/75">Quote Intake + DD TV</span>
              </div>
              <div className="bg-[#101214] border border-[#17504A] px-3 py-2">
                <span className="block text-[#EDE9E0] font-bold uppercase">BUSINESS PORTAL</span>
                <span className="text-[#DFDACE]/75">Orders, Billing &amp; Ad Studio</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
    </div>
  );
}
