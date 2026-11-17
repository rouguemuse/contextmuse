import React, { useState } from 'react';

const FRICTION_ZONES = [
  { id: 'intake', short: '01 Intake', name: 'Step 1: Unstructured Phone Intake', friction: 85, dropoff: 'High Friction', desc: 'Repetitive phone consultations required before a customer can see container dimensions or base pricing.' },
  { id: 'zoning', short: '02 Zoning', name: 'Step 2: Municipal Rule Ambiguity', friction: 70, dropoff: 'Rule Friction', desc: 'Unclear street placement rules and city corridor boundaries delay scheduling.' },
  { id: 'weight', short: '03 Tonnage', name: 'Step 3: Tonnage & Debris Matching', friction: 60, dropoff: 'Scope Friction', desc: 'Customers struggle to match heavy remodel debris against container tonnage allowances.' },
  { id: 'dispatch', short: '04 Dispatch', name: 'Step 4: Structured Dispatch Handoff', friction: 15, dropoff: 'Low Friction', desc: 'Upfront sizing cards and dual-track intake deliver clean job details straight to dispatch.' },
];

export default function BarrierMapTool() {
  const [activeZone, setActiveZone] = useState(FRICTION_ZONES[0]);

  return (
    <div
      id="tool-barrier-map"
      className="h-full bg-[#FAF8F5] border border-[#23282A]/15 p-4 sm:p-6 text-[#23282A] space-y-4 font-sans shadow-sm flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="border-b border-[#23282A]/12 pb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A6F0B] font-bold block">
            05 · Workflow Bottleneck Topography
          </span>
          <h3 className="font-display text-lg font-black uppercase tracking-tight text-[#23282A] mt-0.5">
            Spatial Friction Relief Map
          </h3>
        </div>

        <p className="text-xs text-[#23282A]/75 font-sans leading-relaxed">
          Inspect where customers encounter cognitive friction or abandon multi-step intake workflows.
        </p>

        {/* Quick Touch Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[10px]">
          {FRICTION_ZONES.map((zone) => {
            const isSelected = zone.id === activeZone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZone(zone)}
                className={`min-h-[36px] px-2.5 py-1.5 border uppercase tracking-wider font-bold transition-colors flex items-center justify-between gap-1 ${
                  isSelected
                    ? 'bg-[#23282A] text-[#D9A62E] border-[#23282A]'
                    : 'bg-[#EDE9E0]/60 text-[#23282A]/80 border-[#23282A]/15 hover:border-[#23282A]'
                }`}
              >
                <span className="truncate">{zone.short}</span>
                <span className="shrink-0 opacity-80">{zone.friction}%</span>
              </button>
            );
          })}
        </div>

        {/* Topographic Friction Bars */}
        <div className="flex items-end justify-between gap-2.5 h-36 bg-[#141617] p-3.5 border border-[#23282A]/15">
          {FRICTION_ZONES.map((zone) => {
            const isSelected = zone.id === activeZone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZone(zone)}
                className="flex-1 flex flex-col items-center justify-end h-full group relative focus:outline-none"
              >
                <span
                  className={`font-mono text-[10px] mb-1 font-bold ${
                    isSelected ? 'text-[#D9A62E]' : 'text-[#DFDACE]/55'
                  }`}
                >
                  {zone.friction}%
                </span>
                <div
                  className={`w-full transition-all ${
                    isSelected
                      ? 'bg-[#D9A62E]'
                      : 'bg-[#17504A] group-hover:bg-[#20635c]'
                  }`}
                  style={{ height: `${zone.friction}%` }}
                />
                <span className="font-mono text-[9px] uppercase tracking-tighter truncate w-full text-center mt-1.5 text-[#DFDACE]/80">
                  {zone.name.split(':')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Zone Detail Card — Full-width reading on mobile */}
      <div className="p-3.5 bg-[#EDE9E0]/65 border border-[#23282A]/12 space-y-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#23282A]/10 pb-2">
          <span className="font-mono text-[10.5px] uppercase text-[#9A6F0B] font-bold">
            {activeZone.name}
          </span>
          <span className="px-2 py-0.5 bg-[#23282A] text-[#D9A62E] font-mono text-[10px] font-bold uppercase">
            {activeZone.dropoff} ({activeZone.friction}%)
          </span>
        </div>
        <p className="text-[#23282A]/85 font-sans text-xs leading-relaxed">{activeZone.desc}</p>
      </div>
    </div>
  );
}
