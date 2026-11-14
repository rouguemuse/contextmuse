import React, { useState } from 'react';
import { Compass, Eye, Info, Sparkles } from 'lucide-react';

const FRICTION_ZONES = [
  { id: 'intake', name: 'Step 1: Unstructured Phone Intake', friction: 85, dropoff: 'High Friction', desc: 'Repetitive phone consultations required before a customer can see container dimensions or base pricing.' },
  { id: 'zoning', name: 'Step 2: Municipal Rule Ambiguity', friction: 70, dropoff: 'Rule Friction', desc: 'Unclear street placement rules and city corridor boundaries delay scheduling.' },
  { id: 'weight', name: 'Step 3: Tonnage & Debris Matching', friction: 60, dropoff: 'Scope Friction', desc: 'Customers struggle to match heavy remodel debris against container tonnage allowances.' },
  { id: 'dispatch', name: 'Step 4: Structured Dispatch Handoff', friction: 15, dropoff: 'Low Friction', desc: 'Upfront sizing cards and dual-track intake deliver clean job details straight to dispatch.' },
];

export default function BarrierMapTool() {
  const [activeZone, setActiveZone] = useState(FRICTION_ZONES[0]);

  return (
    <div
      id="tool-barrier-map"
      className="h-full bg-[#FAF8F5] border border-[#23282A]/15 p-5 sm:p-6 text-[#23282A] space-y-4 font-sans shadow-sm flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="border-b border-[#23282A]/12 pb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A6F0B] font-bold block">
            Workflow Bottleneck Topography
          </span>
          <h3 className="font-display text-lg font-black uppercase tracking-tight text-[#23282A] mt-0.5">
            Spatial Friction Relief Map
          </h3>
        </div>

        <p className="text-xs text-[#23282A]/75 font-sans leading-relaxed">
          Inspect where customers encounter cognitive friction or abandon multi-step intake workflows.
        </p>

        {/* Topographic Friction Bars */}
        <div className="flex items-end justify-between gap-2 h-36 bg-[#141617] p-3.5 border border-[#23282A]/15">
          {FRICTION_ZONES.map((zone) => {
            const isSelected = zone.id === activeZone.id;
            return (
              <button
                key={zone.id}
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
                <span className="font-mono text-[9px] uppercase tracking-tighter truncate w-full text-center mt-1.5 text-[#DFDACE]/75">
                  {zone.name.split(':')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Zone Detail Card */}
      <div className="p-3.5 bg-[#EDE9E0]/65 border border-[#23282A]/12 flex items-start justify-between gap-4 text-xs">
        <div>
          <span className="font-mono text-[10px] uppercase text-[#9A6F0B] font-bold block mb-0.5">
            {activeZone.name}
          </span>
          <p className="text-[#23282A]/85 font-sans text-xs leading-relaxed">{activeZone.desc}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="font-mono text-xs font-bold text-[#23282A] block">{activeZone.dropoff}</span>
          <span className="font-mono text-[9px] uppercase text-[#23282A]/55">Measured Friction</span>
        </div>
      </div>
    </div>
  );
}
