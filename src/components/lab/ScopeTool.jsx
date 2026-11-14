import { useState } from 'react';
import LabPanel from '@/components/lab/LabPanel';

const COMPLEXITY_LEVELS = [
  {
    level: 1,
    title: 'Editorial / Proof Surface',
    tag: 'Low State Density',
    desc: 'Clear messaging, single focused conversion path, verified case evidence. Minimal interactive state.',
    typicalTimeline: '1–2 weeks',
  },
  {
    level: 2,
    title: 'Structured Intake & Routing',
    tag: 'Moderate Logic',
    desc: 'Multi-step qualification intake, dynamic conditional fields, and automated CRM or dispatch webhook routing.',
    typicalTimeline: '2–3 weeks',
  },
  {
    level: 3,
    title: 'Quote Calculator & Sizing Engine',
    tag: 'Mathematical Logic',
    desc: 'Self-calculating pricing engine: material density thresholds, municipal zone radiuses, and instant preliminary spec packets.',
    typicalTimeline: '3–4 weeks',
  },
  {
    level: 4,
    title: 'Conflict-Free Asset Booking',
    tag: 'High Consequence State',
    desc: 'Real-time inventory calendar, conflict-locking windows, surface anchor safety rules, and bilingual parity.',
    typicalTimeline: '3–5 weeks',
  },
  {
    level: 5,
    title: 'Living Operational Hub',
    tag: 'Full Systems Architecture',
    desc: 'Multi-service integration: web quoting, dispatch queues, supplier BOM generation, and staff back-office dashboards.',
    typicalTimeline: '4–8 weeks',
  },
];

export default function ScopeTool() {
  const [tierIndex, setTierIndex] = useState(2); // Level 3 default
  const current = COMPLEXITY_LEVELS[tierIndex];

  return (
    <LabPanel
      id="lab-scope"
      num="02"
      kicker="Architectural Scope Signal"
      title="How much system?"
      note="Page count is a misleading measure: one single reservation screen can contain more complexity than ten informational pages. Gauge scope by interaction density and data consequence."
    >
      <div className="flex items-baseline justify-between border-b border-[#23282A]/15 pb-2">
        <span className="font-mono text-xs uppercase tracking-wider text-[#23282A]/70">
          Interaction Complexity Tier
        </span>
        <span className="font-display text-xl font-extrabold text-[#17504A]">
          Tier 0{current.level}
        </span>
      </div>

      <input
        type="range"
        min="0"
        max={COMPLEXITY_LEVELS.length - 1}
        step="1"
        value={tierIndex}
        onChange={(e) => setTierIndex(Number(e.target.value))}
        aria-label="System complexity tier"
        className="mt-4 w-full accent-[#17504A]"
      />

      {/* Visual Density Stepper Bar */}
      <div className="mt-3 flex items-end gap-1.5">
        {COMPLEXITY_LEVELS.map((c, i) => (
          <button
            key={i}
            onClick={() => setTierIndex(i)}
            className="flex-1 transition-all rounded-xs"
            style={{
              height: 20 + i * 6,
              backgroundColor: i <= tierIndex ? '#17504A' : 'rgba(35,40,42,0.18)',
            }}
            title={c.title}
          />
        ))}
      </div>

      <div className="mt-auto border-t border-[#23282A]/20 pt-3 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-display text-[15px] font-extrabold uppercase tracking-tight text-[#23282A]">
            {current.title}
          </p>
          <span className="rounded bg-[#17504A]/10 text-[#17504A] px-1.5 py-0.5 font-mono text-[9px] font-bold">
            {current.tag}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-[#23282A]/80 font-sans">{current.desc}</p>
        <span className="font-mono text-[10px] text-[#23282A]/60 block pt-1">
          Typical Engineering Horizon: {current.typicalTimeline}
        </span>
      </div>
    </LabPanel>
  );
}
