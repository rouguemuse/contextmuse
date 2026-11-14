import React, { useState } from 'react';
import { Sliders, CheckCircle2, ArrowRight } from 'lucide-react';

const SCOPE_TIERS = [
  {
    level: 1,
    title: 'Credibility & Focus Surface',
    tag: 'Single-Focus Web Presence',
    desc: 'Clear messaging, verified case proof, and a single, direct inquiry path. Built for businesses whose work speaks for itself and need a sharp, credible front door.',
    typicalTimeline: '1–2 weeks',
    signals: ['You get inquiries through referrals or outreach', 'Need to prove legitimacy and case evidence', 'No automated calculations needed yet'],
  },
  {
    level: 2,
    title: 'Structured Intake & Smart Routing',
    tag: 'Automated Lead Qualification',
    desc: 'Multi-step qualification intake that asks the right questions up front, filters out unqualified requests, and routes details straight to email, CRM, or dispatch.',
    typicalTimeline: '2–3 weeks',
    signals: ['You spend hours replying to inquiries that aren’t a good fit', 'Need specific project details before you can quote', 'Requests currently sit in an unread inbox'],
  },
  {
    level: 3,
    title: 'Instant Sizing & Quoting Engine',
    tag: 'Self-Calculating Pricing Engine',
    desc: 'Customers or contractors enter dimensions, project requirements, or material types and get accurate, rule-based pricing on the spot without phone tag.',
    typicalTimeline: '3–4 weeks',
    signals: ['Customers constantly ask "how much would it cost for X?"', 'Pricing follows consistent math that you calculate manually today', 'Bidding turnaround speed wins jobs'],
  },
  {
    level: 4,
    title: 'Real-Time Booking & Reservation',
    tag: 'Conflict-Free Schedule Lock',
    desc: 'Interactive availability calendar with conflict-locking, location-based travel surcharges, equipment rules, and bilingual parity for customer self-service.',
    typicalTimeline: '3–5 weeks',
    signals: ['Double-bookings or date conflicts create operational headaches', 'Need to collect deposits or contract acceptance during booking', 'Serve multilingual customer bases'],
  },
  {
    level: 5,
    title: 'Living Operational Hub',
    tag: 'Full Systems Architecture',
    desc: 'End-to-end integration connecting your public web interface, team dispatch queues, automated BOM generation, and staff management dashboards.',
    typicalTimeline: '4–8 weeks',
    signals: ['Staff spend hours manually transcribing data between systems', 'Need live telemetry, driver queues, or supplier integrations', 'Multiple team roles need synchronized views'],
  },
];

export default function BuildScopeSelector({ onSelectScope }) {
  const [tierIndex, setTierIndex] = useState(2); // Level 3 default
  const current = SCOPE_TIERS[tierIndex];

  return (
    <div className="bg-[#1C2022] text-[#EDE9E0] border border-[#DFDACE]/25 rounded-lg p-5 sm:p-6 shadow-xl font-sans space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#DFDACE]/15 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-[#D9A62E]" />
          <div>
            <h3 className="font-display text-base sm:text-lg font-extrabold uppercase tracking-tight text-[#EDE9E0]">
              How much system do you need?
            </h3>
            <span className="font-mono text-[10px] text-[#DFDACE]/60">
              Needs-Based Scope & Complexity Selector
            </span>
          </div>
        </div>

        <span className="font-mono text-sm font-extrabold text-[#D9A62E]">
          Tier 0{current.level} • {current.typicalTimeline}
        </span>
      </div>

      <p className="text-xs sm:text-[13px] text-[#DFDACE]/80 leading-relaxed">
        Page count is a misleading measure. Gauge what you need by how much work the software should do on its own—from a clean editorial surface to an automated calculation engine.
      </p>

      {/* Visual Stepper Selector */}
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-1.5">
          {SCOPE_TIERS.map((tier, idx) => (
            <button
              key={tier.level}
              onClick={() => setTierIndex(idx)}
              className={`p-2.5 rounded text-left transition-all flex flex-col justify-between min-h-[64px] border ${
                idx === tierIndex
                  ? 'bg-[#D9A62E] text-[#141617] border-[#D9A62E] font-bold shadow-md'
                  : idx < tierIndex
                  ? 'bg-[#17504A] text-[#EDE9E0] border-[#17504A]/60 hover:bg-[#20635c]'
                  : 'bg-[#141617] text-[#DFDACE]/60 border-[#DFDACE]/15 hover:border-[#DFDACE]/40'
              }`}
            >
              <span className="font-mono text-[10px] tracking-wider">
                0{tier.level}
              </span>
              <span className="font-display text-[11px] sm:text-xs font-bold uppercase leading-tight truncate w-full mt-1">
                {tier.title.split('&')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Tier Expanded Breakdown */}
      <div className="bg-[#141617] border border-[#DFDACE]/15 rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DFDACE]/10 pb-2">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-base font-extrabold uppercase text-[#EDE9E0]">
              {current.title}
            </h4>
            <span className="rounded bg-[#D9A62E]/20 text-[#D9A62E] px-2 py-0.5 font-mono text-[9px] font-bold">
              {current.tag}
            </span>
          </div>
          <span className="font-mono text-xs text-[#DFDACE]/60">
            Typical Timeline: <strong className="text-[#EDE9E0]">{current.typicalTimeline}</strong>
          </span>
        </div>

        <p className="text-xs sm:text-[13px] text-[#EDE9E0]/90 leading-relaxed">
          {current.desc}
        </p>

        <div className="pt-2 border-t border-[#DFDACE]/10">
          <span className="font-mono text-[10px] uppercase text-[#DFDACE]/60 block mb-1.5 font-bold">
            Signs this tier is the right fit for you:
          </span>
          <ul className="space-y-1 text-xs text-[#DFDACE]/80">
            {current.signals.map((sig, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-[#D9A62E] shrink-0" />
                <span>{sig}</span>
              </li>
            ))}
          </ul>
        </div>

        {onSelectScope && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => onSelectScope(`[Scope: Tier 0${current.level} - ${current.title}]`)}
              className="flex items-center gap-1.5 bg-[#23282A] text-[#D9A62E] hover:bg-[#D9A62E] hover:text-[#141617] px-3 py-1.5 font-mono text-xs font-bold uppercase rounded border border-[#D9A62E]/40 transition-colors"
            >
              <span>Add this scope to my inquiry</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
