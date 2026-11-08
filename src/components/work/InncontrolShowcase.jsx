import React from 'react';
import {
  ArrowRight,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  LayoutDashboard,
  Building2,
  ClipboardCheck,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';

export default function InncontrolShowcase({ onOpenCaseStudy }) {
  const { isProjectSaved, toggleSaveProject } = useBrief();
  const saved = isProjectSaved('inncontrol-coils');

  const handleSave = () => {
    toggleSaveProject({
      id: 'inncontrol-coils',
      title: 'INNcontrol Coils',
      subtitle: 'Nationwide Hotel PTAC Coil Refurbishing Platform & Operator Dashboards',
      tier: 'featured',
    });
  };

  return (
    <section id="inncontrol-coils" className="space-y-6 border-t border-[#DFDACE]/15 pt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFDACE]/15 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono text-xs">
            <span className="rounded bg-[#0F2B48] text-[#FF6B00] border border-[#FF6B00]/40 px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
              Commercial Platform + Internal Ops
            </span>
            <span className="text-[#DFDACE]/60">Hospitality HVAC &amp; PTAC Refurbishing</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#EDE9E0]">
            INNcontrol Coils
          </h2>
          <p className="mt-0.5 font-mono text-xs sm:text-sm text-[#FF6B00]">
            Nationwide B2B Hospitality Platform &amp; Daily Operator Check-In Dashboards
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenCaseStudy('inncontrol-coils')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded bg-[#FF6B00] text-white hover:bg-[#e05e00] transition-colors"
          >
            <span>Inspect Case Study</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <a
            href="https://inncontrolcoils.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded border border-[#DFDACE]/25 text-[#EDE9E0] hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            onClick={handleSave}
            title={saved ? 'Saved in My Ideas' : 'Save to My Ideas'}
            className={`p-1.5 rounded border transition-colors ${
              saved
                ? 'border-[#FF6B00] bg-[#FF6B00]/20 text-[#FF6B00]'
                : 'border-[#DFDACE]/25 text-[#EDE9E0] hover:border-[#FF6B00] hover:text-[#FF6B00]'
            }`}
          >
            {saved ? <BookmarkCheck className="h-4 w-4 text-[#FF6B00]" /> : <Bookmark className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Grid: Authentic Interface Preview + Verified Platform & Dashboard Breakdown */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Interface Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-[#DFDACE]/60 px-1">
            <span className="font-bold text-[#FF6B00] uppercase tracking-wider">
              Commercial Platform (inncontrolcoils.com)
            </span>
            <span>Production Capture</span>
          </div>

          <div className="rounded-xl border border-[#0F2B48]/90 bg-[#0F2B48]/30 overflow-hidden shadow-lg p-2">
            <div className="rounded-lg overflow-hidden border border-white/10 relative">
              <img
                src="/assets/images/inncontrol-commercial-platform.webp"
                alt="INNcontrol Coils Commercial Hospitality Platform"
                className="w-full h-auto object-cover max-h-[440px] block"
                loading="eager"
              />
              <div className="absolute bottom-2.5 left-2.5 bg-[#0F2B48]/90 backdrop-blur-sm border border-[#FF6B00]/40 px-2.5 py-1 rounded font-mono text-[10px] text-[#EDE9E0]">
                Nationwide B2B Hotel PTAC Coil Restoration &amp; Service Intake
              </div>
            </div>
          </div>
        </div>

        {/* Verified Deliverables Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-[#141A1F] border border-[#0F2B48] space-y-2 font-sans text-xs">
            <span className="font-mono text-xs font-bold text-[#FF6B00] uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>01 / Commercial Hospitality Web Platform</span>
            </span>
            <p className="text-[#DFDACE]/90 leading-relaxed">
              Built for hotel ownership groups and facility directors managing high-volume PTAC units nationwide. Replaces generic HVAC brochure copy with clear positioning around deep chemical coil cleaning, odor and mold remediation, airflow recovery, and multi-property scheduling intake.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#141A1F] border border-emerald-500/25 space-y-2 font-sans text-xs">
            <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardCheck className="h-3.5 w-3.5" />
              <span>02 / Mobile Daily Operator Check-In Wizard</span>
            </span>
            <p className="text-[#DFDACE]/90 leading-relaxed">
              Custom internal mobile check-in workflow designed for field and operations leads. Captures morning readiness, top 3 daily priorities, active blockers, and an end-of-day after-action debrief in a single thumb-friendly flow.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1418] border border-[#FF6B00]/30 font-mono text-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-[#FF6B00] uppercase tracking-wider flex items-center gap-1.5">
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>03 / Operator Readiness &amp; Status HUD</span>
              </span>
              <span className="text-[10px] text-[#DFDACE]/50">Internal Tooling</span>
            </div>

            <p className="text-[11px] text-[#DFDACE]/80 font-sans leading-relaxed">
              Pairs the daily check-in flow with an interactive operator status dashboard that translates daily habits, field readiness, and completed objectives into a live visual HUD built around how the operator actually works.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-[#DFDACE]/70">
              <div className="rounded bg-black/40 border border-white/5 px-2.5 py-1.5">
                <span className="block text-[#FF6B00] font-bold">PUBLIC SYSTEM</span>
                <span>B2B Multi-Property Intake</span>
              </div>
              <div className="rounded bg-black/40 border border-white/5 px-2.5 py-1.5">
                <span className="block text-emerald-400 font-bold">INTERNAL OPS</span>
                <span>Daily Check-In + Status HUD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
