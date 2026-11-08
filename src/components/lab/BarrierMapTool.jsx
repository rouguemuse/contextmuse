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
    <div id="tool-barrier-map" className="bg-[#1C2022] border border-[#DFDACE]/25 rounded-lg p-5 text-[#EDE9E0] space-y-4 font-sans shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFDACE]/15 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-[#D9A62E]" />
          <div>
            <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-[#EDE9E0]">
              Spatial Friction Relief Map
            </h3>
            <span className="font-mono text-[10px] text-[#DFDACE]/60">
              Interactive Workflow Bottleneck Topography
            </span>
          </div>
        </div>

        <span className="rounded bg-[#23282A] text-[#DFDACE] px-2 py-0.5 font-mono text-[9px] font-bold uppercase border border-[#DFDACE]/20">
          Interactive Experiment
        </span>
      </div>

      <p className="text-xs text-[#DFDACE]/80 font-sans leading-relaxed">
        Visualize where visitors encounter cognitive friction or abandon workflows on a tactile terrain map.
      </p>

      {/* Topographic Friction Bars */}
      <div className="space-y-2">
        <div className="flex items-end justify-between gap-2 h-32 bg-[#141617] p-3 rounded border border-[#DFDACE]/15">
          {FRICTION_ZONES.map((zone) => {
            const isSelected = zone.id === activeZone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone)}
                className="flex-1 flex flex-col items-center justify-end h-full group relative focus:outline-none"
              >
                <span className={`font-mono text-[9px] mb-1 font-bold ${isSelected ? 'text-[#D9A62E]' : 'text-[#DFDACE]/50'}`}>
                  {zone.friction}%
                </span>
                <div
                  className={`w-full rounded-t transition-all ${
                    isSelected
                      ? 'bg-[#D9A62E] shadow-lg shadow-[#D9A62E]/20'
                      : 'bg-[#17504A] group-hover:bg-[#20635c]'
                  }`}
                  style={{ height: `${zone.friction}%` }}
                />
                <span className="font-mono text-[8.5px] uppercase tracking-tighter truncate w-full text-center mt-1.5 text-[#DFDACE]/70">
                  {zone.name.split(':')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Zone Detail Card */}
      <div className="p-3 bg-[#141617] rounded border border-[#DFDACE]/15 flex items-start justify-between gap-3 text-xs">
        <div>
          <span className="font-mono text-[10px] uppercase text-[#D9A62E] font-bold block mb-0.5">
            {activeZone.name}
          </span>
          <p className="text-[#EDE9E0]/90 font-sans text-xs">{activeZone.desc}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="font-mono text-sm font-bold text-red-300 block">{activeZone.dropoff}</span>
          <span className="font-mono text-[9px] uppercase text-[#DFDACE]/50">Measured Friction</span>
        </div>
      </div>
    </div>
  );
}
