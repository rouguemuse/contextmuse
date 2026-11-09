import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, ArrowRight, CheckCircle2, Compass } from 'lucide-react';
import RoomShell from '@/components/room/RoomShell';
import RoomHeading from '@/components/room/RoomHeading';
import MethodMap from '@/components/method/MethodMap';
import MethodDetail from '@/components/method/MethodDetail';
import { STAGES } from '@/components/method/methodData';
import { roomById } from '@/lib/rooms';
import { useBrief } from '@/lib/BriefContext';

const PRINCIPLES = [
  {
    num: '01',
    title: 'Understand the real problem first',
    body: 'Before picking a layout or writing code, I look at where visitors hesitate, where quotes take three phone calls, or where your team is working around clunky tools.',
  },
  {
    num: '02',
    title: 'Design and engineering in one hand',
    body: 'Visual identity, user experience, and technical implementation are shaped together—so what people see and what makes it work are built as a single coherent solution.',
  },
  {
    num: '03',
    title: 'Software and AI that earn their place',
    body: 'Automation and AI should handle repetitive sorting, rules, and formatting so real people can make clear decisions faster, without enterprise bloat.',
  },
];

const CORE_PILLARS = [
  {
    num: '01',
    category: 'Websites & Digital Experiences',
    title: 'Custom Websites & Quoting Systems',
    price: 'From $2,500',
    cadence: 'Multi-market & programmatic builds typically $4,500+ • 50% deposit / 50% at staging',
    summary:
      'For businesses that need a distinctive custom website, clear user experience, upfront sizing or flat-rate quoting logic, and structured lead capture.',
    includes: [
      'Custom visual identity, editorial layout, and responsive front-end engineering',
      'Interactive sizing calculators, flat-rate pricing matrices, or service-track triage',
      'Territory/city landing architecture with clean lead payloads routed straight to dispatch',
    ],
    proof: 'Proof: Wolf Ridge Dumpsters (48 DFW cities), EDR Party Rentals, D2 Auto Detail',
    ctaLabel: 'Scope a Website or Quoting Build',
    featured: true,
  },
  {
    num: '02',
    category: 'Custom Software & Operational Tools',
    title: 'Custom Operations & Workflow Software',
    price: 'From $6,500',
    cadence: 'Scoped around operational requirements • 40% / 30% / 30% milestone structure',
    summary:
      'For teams that need a custom web application, internal operator dashboard, estimation engine, or workflow tool built around how they actually run.',
    includes: [
      'Custom web applications, internal operator HUDs, daily check-in wizards, or booking engines',
      'Deterministic business rules, multi-report POS/CSV correlation, and data normalization',
      'Full code ownership and direct deployment with zero recurring seat-license bloat',
    ],
    proof: 'Proof: INNcontrol Coils Platform & Operator HUD, Signal Restaurant Analysis',
    ctaLabel: 'Scope Custom Software',
    featured: false,
  },
  {
    num: '03',
    category: 'Product Design & Development',
    title: 'Original Digital Products & AI Tools',
    price: 'Custom Scope',
    cadence: 'Concept, UX architecture, and full-stack realization',
    summary:
      'For founders and studios turning an original software concept, AI-assisted workbench, or interactive instrument into a working, shippable product.',
    includes: [
      'End-to-end product architecture, interface design, and interactive prototyping in real code',
      'Local-first browser engines, explainable scoring models, or AI evaluation pipelines',
      'Production-ready application delivery from initial thesis through launch',
    ],
    proof: 'Proof: GenSort Studio, Self-Cartography V1, Writing Contest Submission Manager',
    ctaLabel: 'Discuss a Product Build',
    featured: false,
  },
];

export default function Method() {
  const room = roomById('method');
  const navigate = useNavigate();
  const { openBrief } = useBrief();
  const [active, setActive] = useState(STAGES[0].key);

  const index = STAGES.findIndex((s) => s.key === active);
  const stage = index >= 0 ? STAGES[index] : STAGES[0];
  const next = index >= 0 && index < STAGES.length - 1 ? STAGES[index + 1] : null;
  const prev = index > 0 ? STAGES[index - 1] : null;

  return (
    <RoomShell
      room={room}
      canvasBg="#EDE9E0"
      canvasText="#23282A"
      accentBarColor="#17504A"
    >
      <div className="mx-auto w-full max-w-[1380px] min-w-0 px-4 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-12 lg:px-12 space-y-16 sm:space-y-20 font-sans">
        {/* =================================================================
            SECTION 01: THE 5-STAGE PROCESS
           ================================================================= */}
        <section aria-labelledby="method-process-heading" className="space-y-6">
          <RoomHeading
            num={room.num}
            verb={room.verb}
            badge="Process, Capabilities & Engagement"
            title="The Method."
            watermark={room.num}
            accentColor="#17504A"
            sub="How a project moves from understanding the underlying operational problem through visual design, engineering, and delivery—plus clear scope and pricing."
          />

          <div className="pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#17504A] font-bold">
                <span className="inline-block h-2 w-2 bg-[#17504A]" />
                <span id="method-process-heading">01 / Five-Stage Execution Process</span>
              </div>
              <span className="font-mono text-xs text-[#23282A]/60">
                Select any stage to inspect real client &amp; studio build records
              </span>
            </div>

            <MethodMap
              stages={STAGES}
              active={active}
              onSelect={setActive}
              onPrev={() => prev && setActive(prev.key)}
              onNext={() => next && setActive(next.key)}
            />
          </div>

          {/* Stable Stage Detail Container */}
          <div className="min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <MethodDetail
                  stage={stage}
                  onNext={next ? () => setActive(next.key) : null}
                  nextLabel={next ? next.slug : 'Complete'}
                  onPrev={prev ? () => setActive(prev.key) : null}
                  prevLabel={prev ? prev.slug : ''}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stage Reset Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#23282A]/12 pt-4">
            <button
              onClick={() => setActive(STAGES[0].key)}
              className="flex items-center gap-2 text-xs font-mono text-[#23282A]/70 hover:text-[#17504A] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Start from Stage 01 (Observe)
            </button>

            <span className="font-mono text-xs text-[#23282A]/55">
              Grounded in verified client &amp; studio builds
            </span>
          </div>
        </section>

        {/* =================================================================
            SECTION 02: FOUNDER IDENTITY & OPERATING PHILOSOPHY
           ================================================================= */}
        <section
          id="operating-philosophy"
          aria-labelledby="method-founder-heading"
          className="border-t border-[#23282A]/15 pt-12 sm:pt-14 space-y-8"
        >
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-3.5">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#17504A] font-bold">
                <span className="inline-block h-2 w-2 bg-[#17504A]" />
                <span>02 / Founder &amp; Operating Philosophy</span>
              </div>
              <h2
                id="method-founder-heading"
                className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#23282A] leading-none"
              >
                Jayme Volstad
              </h2>
              <p className="font-mono text-xs text-[#17504A] font-bold uppercase tracking-wider">
                Founder • Designer &amp; Full-Stack Builder
              </p>
              <p className="text-sm text-[#23282A]/85 leading-relaxed pt-1">
                I approach every challenge from both sides: designing the visual identity and user experience people interact with, and building the software, logic, and workflows that make it genuinely useful.
              </p>
              <p className="text-xs sm:text-sm text-[#23282A]/75 leading-relaxed">
                Before software, I worked in kitchens, production lines, and operations where tools have to hold up at 7:30 on a Friday night—not just look good in a presentation. Context &amp; Muse is my independent design and development practice for creating custom websites, digital products, quoting engines, and AI-assisted software around how people and businesses actually operate.
              </p>
            </div>

            <div className="lg:col-span-7 grid gap-5 sm:grid-cols-3">
              {PRINCIPLES.map((p) => (
                <div
                  key={p.num}
                  className="bg-[#FAF8F5] border border-[#23282A]/15 border-t-[3px] border-t-[#17504A] p-6 flex flex-col justify-between space-y-3 shadow-sm"
                >
                  <div className="space-y-2.5">
                    <span className="font-mono text-xs font-bold text-[#17504A] block">
                      {p.num} / PRINCIPLE
                    </span>
                    <h3 className="font-display text-base sm:text-lg font-black uppercase tracking-tight text-[#23282A] leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#23282A]/75 leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 03: SIMPLIFIED 3-PILLAR OFFERING STRUCTURE + OPTIONAL DIAGNOSTIC
           ================================================================= */}
        <section
          id="ways-to-work-together"
          aria-labelledby="method-offerings-heading"
          className="border-t border-[#23282A]/15 pt-12 sm:pt-14 space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#17504A] font-bold">
                <span className="inline-block h-2 w-2 bg-[#17504A]" />
                <span>03 / Ways to Work Together</span>
              </div>
              <h2
                id="method-offerings-heading"
                className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#23282A]"
              >
                Three Core Capabilities. Upfront Scope.
              </h2>
              <p className="text-xs sm:text-sm text-[#23282A]/75 max-w-2xl leading-relaxed">
                Engage directly for a website, custom software tool, or original product build—or begin with an optional $395 diagnostic if you want a written blueprint before committing to a larger scope.
              </p>
            </div>

            <button
              onClick={() => navigate('/build')}
              className="self-start md:self-auto inline-flex items-center gap-2 border border-[#23282A]/25 bg-[#FAF8F5] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#23282A] hover:border-[#17504A] hover:text-[#17504A] transition-colors"
            >
              <span>Sketch Your Idea in Custom Builds</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* 3 Core Offering Pillars */}
          <div className="grid gap-6 lg:grid-cols-3 items-stretch">
            {CORE_PILLARS.map((pillar) => (
              <article
                key={pillar.num}
                className={`bg-[#FAF8F5] text-[#23282A] p-6 sm:p-7 flex flex-col justify-between shadow-sm border border-[#23282A]/15 ${
                  pillar.featured
                    ? 'border-t-4 border-t-[#17504A]'
                    : 'border-t-4 border-t-[#23282A]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                    <span className="text-[#17504A] font-bold">
                      {pillar.num} / {pillar.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#23282A]">
                      {pillar.title}
                    </h3>
                    <div className="mt-2.5 flex items-baseline gap-2">
                      <span className="font-display text-3xl font-black tracking-tight text-[#17504A]">
                        {pillar.price}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-[#23282A]/65">
                      {pillar.cadence}
                    </p>
                  </div>

                  <p className="text-xs sm:text-[13.5px] leading-relaxed text-[#23282A]/80">
                    {pillar.summary}
                  </p>

                  <ul className="space-y-2.5 pt-3 border-t border-[#23282A]/12 text-xs text-[#23282A]/85">
                    {pillar.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-[#17504A]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-[#23282A]/12 space-y-3">
                  <p className="font-mono text-[10.5px] text-[#23282A]/60">
                    {pillar.proof}
                  </p>
                  <button
                    onClick={openBrief}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                      pillar.featured
                        ? 'bg-[#17504A] text-[#EDE9E0] hover:bg-[#23282A]'
                        : 'bg-[#23282A] text-[#EDE9E0] hover:bg-[#17504A]'
                    }`}
                  >
                    <span>{pillar.ctaLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Optional Entry Service Bar ($395 Diagnostic + Free Website Check) */}
          <div className="bg-[#FAF8F5] border border-[#23282A]/15 border-l-4 border-l-[#17504A] p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.12em]">
                <span className="text-[#17504A] font-bold">Optional Entry Service</span>
                <span className="text-[#23282A]/40">•</span>
                <span className="font-bold text-[#23282A]">$395 Flat Rate (100% Credited Toward a Build Within 30 Days)</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-[#23282A]">
                Business System Diagnostic — Written Architecture &amp; Scope Blueprint
              </h3>
              <p className="text-xs sm:text-sm text-[#23282A]/75 leading-relaxed">
                Not ready to commit to a full build yet? Start with a focused diagnostic review of your current website, quoting flow, or operational bottleneck—complete with a written blueprint and exact build recommendation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={openBrief}
                className="inline-flex items-center gap-2 bg-[#17504A] text-[#EDE9E0] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#23282A] transition-colors"
              >
                <span>Request $395 Diagnostic</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <a
                href="/website-system-check/"
                className="inline-flex items-center gap-1.5 border border-[#23282A]/20 px-3.5 py-2.5 font-mono text-xs text-[#23282A]/80 hover:border-[#23282A] hover:text-[#23282A] transition-colors"
              >
                <Compass className="h-3.5 w-3.5 text-[#17504A]" />
                <span>Try Free Website Check</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </RoomShell>
  );
}
