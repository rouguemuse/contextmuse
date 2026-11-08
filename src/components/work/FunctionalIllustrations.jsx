import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Table,
  Sparkles,
  Truck,
  BookOpen,
  ShieldAlert,
  Feather,
  FolderSearch,
  LayoutDashboard,
} from 'lucide-react';

/**
 * 01 / Reservation System Functional Demonstration (EDR Party Rentals):
 * Dates become availability, then a confirmed selection.
 */
export function ReservationIllustration({ interactive = false }) {
  const [selectedDate, setSelectedDate] = useState('18');
  const [confirmed, setConfirmed] = useState(false);

  const dates = [
    { day: '16', status: 'booked', label: 'Booked' },
    { day: '17', status: 'booked', label: 'Booked' },
    { day: '18', status: 'available', label: 'Available' },
    { day: '19', status: 'available', label: 'Available' },
    { day: '20', status: 'available', label: 'Available' },
    { day: '21', status: 'limited', label: '1 Left' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 select-none">
      <div className="flex items-center justify-between border-b border-current/15 pb-1.5 font-mono text-[9.5px]">
        <span className="font-bold flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>OCT AVAILABILITY MATRIX</span>
        </span>
        <span className="uppercase text-[9px] opacity-75">Date Lockout Demo</span>
      </div>

      <div className="grid grid-cols-6 gap-1 my-2">
        {dates.map((d) => {
          const isSelected = selectedDate === d.day;
          return (
            <button
              key={d.day}
              type="button"
              disabled={!interactive || d.status === 'booked'}
              onClick={() => {
                setSelectedDate(d.day);
                setConfirmed(true);
              }}
              className={`flex flex-col items-center py-1.5 px-0.5 rounded text-center transition-all ${
                isSelected
                  ? 'bg-[#17504A] text-[#EDE9E0] font-bold ring-2 ring-[#D9A62E]'
                  : d.status === 'booked'
                  ? 'bg-black/20 opacity-40 cursor-not-allowed line-through'
                  : 'bg-white/40 hover:bg-white/70 text-current'
              }`}
            >
              <span className="font-mono text-xs font-bold">{d.day}</span>
              <span className="font-mono text-[8px] uppercase tracking-tighter truncate max-w-full">
                {d.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-1.5 border-t border-current/15 flex items-center justify-between font-mono text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Selected: Oct {selectedDate}</span>
        </div>
        <span className="bg-[#17504A] text-[#EDE9E0] px-1.5 py-0.5 rounded text-[8.5px] uppercase font-bold">
          {confirmed || !interactive ? 'Confirmed Available ✓' : 'Click to Reserve'}
        </span>
      </div>
    </div>
  );
}

/**
 * 02 / Municipal Dumpster Sizing Demonstration (Wolf Ridge Dumpsters):
 * Select container size + material density -> upfront flat-rate estimate and tonnage rules.
 */
export function DumpsterSizingDemo({ interactive = false }) {
  const [size, setSize] = useState('20');
  const [material, setMaterial] = useState('household');
  const [city, setCity] = useState('Plano');

  const prices = {
    '15': { household: 385, heavy: 445, tons: 2.0 },
    '20': { household: 425, heavy: 495, tons: 2.5 },
    '25': { household: 475, heavy: 545, tons: 3.0 },
  };

  const selected = prices[size] || prices['20'];
  const cost = selected[material];

  return (
    <div className="w-full bg-[#1A1E20] text-[#EDE9E0] p-4 rounded border border-[#F59E0B]/30 font-mono text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
        <span className="font-bold text-[#F59E0B] flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5" />
          <span>WOLF RIDGE SIZING &amp; MUNICIPAL INTAKE</span>
        </span>
        <span className="text-[10px] text-[#DFDACE]/60">48 DFW Municipal Pages</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="bg-[#141617] p-2.5 rounded border border-white/5 space-y-1">
          <label className="text-[10px] text-[#DFDACE]/70 block font-bold uppercase">1. Size (Yards):</label>
          <div className="grid grid-cols-3 gap-1">
            {['15', '20', '25'].map((s) => (
              <button
                key={s}
                disabled={!interactive}
                onClick={() => setSize(s)}
                className={`py-1 rounded text-center font-bold text-xs ${
                  size === s ? 'bg-[#F59E0B] text-black' : 'bg-black/40 text-white/80 hover:bg-white/10'
                }`}
              >
                {s} Yd
              </button>
            ))}
          </div>
          <span className="text-[9px] text-[#DFDACE]/50 block mt-1">
            {size === '15' ? 'Small cleanout (~4.5 pickup loads)' : size === '20' ? 'Standard remodel (~6 pickup loads)' : 'Large demo (~8 pickup loads)'}
          </span>
        </div>

        <div className="bg-[#141617] p-2.5 rounded border border-white/5 space-y-1">
          <label className="text-[10px] text-[#DFDACE]/70 block font-bold uppercase">2. Material Type:</label>
          <div className="grid grid-cols-2 gap-1">
            <button
              disabled={!interactive}
              onClick={() => setMaterial('household')}
              className={`py-1 text-center rounded text-[10px] font-bold ${
                material === 'household' ? 'bg-[#F59E0B] text-black' : 'bg-black/40 text-white/80'
              }`}
            >
              Household
            </button>
            <button
              disabled={!interactive}
              onClick={() => setMaterial('heavy')}
              className={`py-1 text-center rounded text-[10px] font-bold ${
                material === 'heavy' ? 'bg-[#F59E0B] text-black' : 'bg-black/40 text-white/80'
              }`}
            >
              Shingles / Heavy
            </button>
          </div>
          <span className="text-[9px] text-[#DFDACE]/50 block mt-1">
            {material === 'heavy' ? '⚠️ Heavy debris tonnage rule applied' : 'Standard household / remodel debris'}
          </span>
        </div>

        <div className="bg-[#141617] p-2.5 rounded border border-white/5 space-y-1 flex flex-col justify-between">
          <div>
            <label className="text-[10px] text-[#DFDACE]/70 block font-bold uppercase">3. DFW City:</label>
            <select
              value={city}
              disabled={!interactive}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-black/60 border border-white/20 px-2 py-1 text-xs rounded text-[#F59E0B] font-bold"
            >
              {['Plano', 'Frisco', 'Dallas', 'Fort Worth', 'Arlington', 'McKinney', 'Denton'].map((c) => (
                <option key={c} value={c}>{c}, TX</option>
              ))}
            </select>
          </div>
          <div className="pt-1 border-t border-white/10 flex justify-between items-baseline">
            <span className="text-[10px] text-[#DFDACE]/60">Base Rate:</span>
            <span className="text-sm font-bold text-[#F59E0B]">${cost} ({selected.tons}T incl.)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 03 / Manuscript Revision Matrix Demonstration (Revision Atlas):
 * Chapter scene beat ledger, narrative tension score, and non-destructive variant diff.
 */
export function ManuscriptMatrixIllustration({ interactive = false }) {
  const [activeScene, setActiveScene] = useState(1);
  const [showDiff, setShowDiff] = useState(false);

  const scenes = [
    { id: 0, ch: 'Ch 1', title: 'The River Bank', tension: 35, dialogue: '28%', status: 'Stable' },
    { id: 1, ch: 'Ch 4', title: 'The Unopened Letter', tension: 65, dialogue: '45%', status: 'Variant Active' },
    { id: 2, ch: 'Ch 7', title: 'Threshold Crossing', tension: 88, dialogue: '60%', status: 'Review Flag' },
  ];

  const current = scenes[activeScene];

  return (
    <div className="w-full bg-[#1C1917] text-[#EDE9E0] p-4 rounded border border-[#CA8A04]/30 font-mono text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
        <span className="font-bold text-[#CA8A04] flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          <span>MANUSCRIPT AST SCENE GRAPH &amp; PACING</span>
        </span>
        <span className="text-[10px] text-[#DFDACE]/60">84,000 Words Indexed</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="bg-black/30 p-2.5 rounded border border-white/5 space-y-1.5 sm:col-span-1">
          <label className="text-[10px] text-[#CA8A04] block font-bold uppercase">Scene Nodes:</label>
          <div className="space-y-1">
            {scenes.map((s) => (
              <div
                key={s.id}
                onClick={() => interactive && setActiveScene(s.id)}
                className={`p-1.5 rounded cursor-pointer transition-all border ${
                  activeScene === s.id
                    ? 'border-[#CA8A04] bg-[#CA8A04]/20 text-[#EDE9E0]'
                    : 'border-transparent hover:bg-white/5 text-[#DFDACE]/70'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span>{s.ch}: {s.title}</span>
                  <span className="text-[9px] opacity-75">{s.tension}% Tension</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/30 p-2.5 rounded border border-white/5 space-y-2 sm:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-2">
              <span className="text-[10px] font-bold text-[#EDE9E0]">
                {current.ch}: {current.title} — Telemetry
              </span>
              {interactive && (
                <button
                  onClick={() => setShowDiff(!showDiff)}
                  className="text-[9px] text-[#CA8A04] underline hover:text-white"
                >
                  {showDiff ? 'Show Pacing Telemetry' : 'Compare Variant Draft'}
                </button>
              )}
            </div>

            {showDiff ? (
              <div className="text-[10.5px] p-2 bg-black/50 rounded border border-white/10 font-sans space-y-1">
                <p className="line-through text-red-400/80">Draft 1: She held the letter against the light, terrified of opening it.</p>
                <p className="text-emerald-400">Variant 2: She broke the wax without hesitation. Waiting had already cost a winter.</p>
                <span className="block font-mono text-[9px] text-[#CA8A04] mt-1">
                  Downstream ripple: Flags Chapter 19 mention of intact wax seal.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-white/5 p-1.5 rounded">
                  <span className="block text-[9px] text-[#DFDACE]/60">Tension Score</span>
                  <span className="text-xs font-bold text-[#CA8A04]">{current.tension} / 100</span>
                </div>
                <div className="bg-white/5 p-1.5 rounded">
                  <span className="block text-[9px] text-[#DFDACE]/60">Dialogue Ratio</span>
                  <span className="text-xs font-bold text-emerald-400">{current.dialogue}</span>
                </div>
                <div className="bg-white/5 p-1.5 rounded">
                  <span className="block text-[9px] text-[#DFDACE]/60">Variant Status</span>
                  <span className="text-xs font-bold text-[#EDE9E0]">{current.status}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-1.5 border-t border-white/10 flex justify-between text-[9.5px] text-[#DFDACE]/70">
            <span>Non-destructive AST chunking</span>
            <span className="text-[#CA8A04] font-bold">100% Local · Zero Cloud Leakage</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 04 / Civic Continuity & Barrier-First Resource Intelligence (Maps With Teeth):
 * Displays cross-jurisdiction continuity and real institutional prerequisite flags.
 */
export function CivicContinuityIllustration({ interactive = false }) {
  const [selectedStep, setSelectedStep] = useState(1);

  const handoffs = [
    { id: 0, tag: 'INTAKE', label: 'Situation Triage', rule: 'No centralized DB required' },
    { id: 1, tag: 'BARRIER FLAG', label: 'Prerequisite Check', rule: 'ID + Residency cutoff disclosed upfront' },
    { id: 2, tag: 'CONTINUITY', label: 'Cross-County Packet', rule: 'Portable user-held summary' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 select-none">
      <div className="flex items-center justify-between border-b border-current/15 pb-1 font-mono text-[9.5px]">
        <span className="font-bold flex items-center gap-1 text-[#D9A62E]">
          <ShieldAlert className="h-3 w-3" />
          <span>CIVIC CONTINUITY &amp; BARRIER LEDGER</span>
        </span>
        <span className="opacity-75 text-[8.5px]">Quick-Exit Safe UX</span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 my-1.5 font-mono text-[8.5px]">
        {handoffs.map((h) => {
          const active = selectedStep === h.id;
          return (
            <div
              key={h.id}
              onClick={() => interactive && setSelectedStep(h.id)}
              className={`rounded p-1.5 border transition-colors ${
                active
                  ? 'border-[#D9A62E] bg-[#D9A62E]/15 text-[#EDE9E0]'
                  : 'border-white/10 bg-black/25 text-[#DFDACE]/75'
              } ${interactive ? 'cursor-pointer' : ''}`}
            >
              <span className="block text-[7.5px] font-bold text-[#D9A62E]">{h.tag}</span>
              <span className="block font-bold truncate mt-0.5">{h.label}</span>
              <span className="block text-[7.5px] opacity-75 truncate mt-0.5">{h.rule}</span>
            </div>
          );
        })}
      </div>

      <div className="pt-1 border-t border-current/15 flex items-center justify-between font-mono text-[9px]">
        <span className="opacity-75">Unshared Jurisdiction Bridge</span>
        <span className="font-bold text-emerald-400">mapswithteeth.org ↗</span>
      </div>
    </div>
  );
}

/**
 * 05 / Literary World & Symbolic Archive Preview (How to Explain Yourself to Wolves):
 * Dedicated literary/artifact preview without unrelated terrain or elevation widgets.
 */
export function WolvesLiteraryIllustration({ interactive = false }) {
  const [activeArtifact, setActiveArtifact] = useState(0);

  const studies = [
    {
      title: 'I. The Red Thread',
      note: 'Symbolic study of continuity, tether, and entanglement.',
    },
    {
      title: 'II. Valley of Please Understand Me',
      note: 'What happens when over-explanation is no longer a path to safety.',
    },
    {
      title: 'III. Self Cartography Notes',
      note: 'Field archive of allegorical memoir and interior boundaries.',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 select-none bg-[#1B1918] text-[#EDE9E0]">
      <div className="flex items-center justify-between border-b border-[#A31D1D]/40 pb-1 font-mono text-[9.5px]">
        <span className="font-bold flex items-center gap-1 text-[#EDE9E0]">
          <Feather className="h-3 w-3 text-[#D9A62E]" />
          <span>FIELD ARCHIVE &amp; ALLEGORICAL MEMOIR</span>
        </span>
        <span className="text-[8.5px] text-[#D9A62E]">Literary System</span>
      </div>

      <div className="my-1.5 space-y-1 font-serif text-[10px]">
        {studies.map((s, idx) => (
          <div
            key={s.title}
            onClick={() => interactive && setActiveArtifact(idx)}
            className={`px-2 py-1 rounded border transition-colors ${
              activeArtifact === idx
                ? 'border-[#A31D1D]/70 bg-[#A31D1D]/15 text-[#EDE9E0]'
                : 'border-white/5 bg-black/20 text-[#DFDACE]/70'
            } ${interactive ? 'cursor-pointer' : ''}`}
          >
            <div className="flex items-center justify-between font-mono text-[8.5px]">
              <span className="font-bold text-[#EDE9E0]">{s.title}</span>
              <span className="text-[#D9A62E] opacity-80">Specimen</span>
            </div>
            {interactive && activeArtifact === idx && (
              <p className="text-[9px] font-sans text-[#DFDACE]/85 mt-0.5">{s.note}</p>
            )}
          </div>
        ))}
      </div>

      <div className="pt-1 border-t border-white/10 flex items-center justify-between font-mono text-[8.5px] text-[#DFDACE]/75">
        <span>Symbolic Object Studies &amp; Prose</span>
        <span className="text-[#D9A62E] font-bold">Companion World →</span>
      </div>
    </div>
  );
}

/**
 * 06 / GenSort 5-Stage Local-First Curation Pipeline:
 * Import -> Understand -> Organize -> Review -> Export
 */
export function GenSortWorkflowIllustration({ interactive = false }) {
  const [stage, setStage] = useState(1);

  const stages = [
    { id: 0, num: '01', name: 'IMPORT', detail: 'Local folder scan or Sample Studio Dataset into IndexedDB' },
    { id: 1, num: '02', name: 'UNDERSTAND', detail: 'Binary PNG/EXIF prompt, seed & 0–100 Readiness Score' },
    { id: 2, num: '03', name: 'ORGANIZE', detail: 'Filter by AI model, color hex, tags & smart collections' },
    { id: 3, num: '04', name: 'REVIEW', detail: '64-bit dHash duplicate clustering & side-by-side Parameter Diff' },
    { id: 4, num: '05', name: 'EXPORT', detail: 'Batch pattern rename + JSON, CSV & cleanup report manifests' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 select-none bg-[#12121A] text-[#EDE9E0]">
      <div className="flex items-center justify-between border-b border-[#C9A84C]/30 pb-1 font-mono text-[9.5px]">
        <span className="font-bold flex items-center gap-1 text-[#C9A84C]">
          <FolderSearch className="h-3 w-3" />
          <span>GENSORT 5-STAGE ASSET PIPELINE</span>
        </span>
        <span className="text-[8.5px] text-emerald-400 font-bold">100% Local-First</span>
      </div>

      <div className="grid grid-cols-5 gap-1 my-1.5 font-mono text-[8px]">
        {stages.map((s) => (
          <div
            key={s.id}
            onClick={() => interactive && setStage(s.id)}
            className={`p-1 rounded border text-center transition-colors ${
              stage === s.id
                ? 'border-[#C9A84C] bg-[#C9A84C]/20 text-[#EDE9E0] font-bold'
                : 'border-white/10 bg-black/30 text-[#DFDACE]/65'
            } ${interactive ? 'cursor-pointer' : ''}`}
          >
            <span className="block text-[7.5px] text-[#C9A84C]">{s.num}</span>
            <span className="block truncate">{s.name}</span>
          </div>
        ))}
      </div>

      <div className="pt-1 border-t border-white/10 flex items-center justify-between font-mono text-[8.5px] text-[#DFDACE]/85">
        <span className="truncate pr-2">{stages[stage].detail}</span>
        <span className="text-[#C9A84C] font-bold shrink-0">Readiness 92/100</span>
      </div>
    </div>
  );
}

/**
 * 07 / INNcontrol Commercial Platform & Internal Operator Dashboards Overview
 */
export function InncontrolOpsIllustration() {
  return (
    <div className="w-full bg-[#0E1418] text-[#EDE9E0] p-4 rounded border border-[#FF6B00]/30 font-mono text-xs select-none space-y-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <span className="font-bold text-[#FF6B00] flex items-center gap-1.5">
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span>INNCONTROL PUBLIC B2B PLATFORM + INTERNAL OPERATOR HUD</span>
        </span>
        <span className="text-[10px] text-emerald-400 font-bold">Production + Internal Ops</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 text-[11px] font-sans">
        <div className="bg-black/40 p-3 rounded border border-white/10 space-y-1">
          <span className="font-mono text-[10px] font-bold text-[#FF6B00] uppercase block">
            Public System (inncontrolcoils.com)
          </span>
          <p className="text-[#DFDACE]/85 leading-relaxed">
            Nationwide B2B hospitality platform for volume hotel PTAC coil restoration, deep chemical cleaning, odor/mold remediation, and multi-property scheduling intake.
          </p>
        </div>

        <div className="bg-black/40 p-3 rounded border border-white/10 space-y-1">
          <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase block">
            Internal Daily Operator Dashboards
          </span>
          <p className="text-[#DFDACE]/85 leading-relaxed">
            Mobile daily check-in wizard and gamified operator status HUD tracking morning readiness, top 3 daily field priorities, active blockers, and evening after-action debriefs.
          </p>
        </div>
      </div>
    </div>
  );
}
