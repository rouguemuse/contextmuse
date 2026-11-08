import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, ArrowRight, CheckCircle2, Sparkles, Compass, Wrench } from 'lucide-react';
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

const PRICING_TIERS = [
  {
    badge: 'DIAGNOSTIC ENTRY',
    title: 'Business System Diagnostic',
    price: '$395',
    cadence: 'Flat rate • 100% credited toward a build within 30 days',
    summary:
      'A focused design and technical review of your current website, quoting flow, or workflow bottleneck before you commit to a larger build.',
    includes: [
      'Written diagnosis of where leads, quotes, or daily workflows are stalling',
      'Concrete design, UX, and technical blueprint with recommended build scope',
      '100% of the $395 fee is credited toward a qualifying build started within 30 days',
    ],
    ctaLabel: 'Request a $395 Diagnostic',
    highlight: false,
  },
  {
    badge: 'WEBSITES & QUOTING',
    title: 'Quote + Lead System',
    price: 'From $2,500',
    cadence: 'Multi-market & programmatic SEO builds typically from $4,500+',
    summary:
      'For businesses that need a distinctive custom website, clear user experience, upfront sizing or quoting logic, and structured lead capture.',
    includes: [
      'Custom website design and development built around how your customers buy',
      'Interactive sizing, flat-rate pricing, or service-track triage',
      'Clean lead payloads routed straight to dispatch or your inbox',
    ],
    ctaLabel: 'Scope a Website or Quoting Build',
    highlight: true,
  },
  {
    badge: 'CUSTOM SOFTWARE & APPS',
    title: 'Custom Operations System',
    price: 'From $6,500',
    cadence: 'Scoped around your product & operational requirements',
    summary:
      'For teams that need a custom web application, digital product, internal operator dashboard, or AI-assisted workflow built around how they operate.',
    includes: [
      'Custom web applications, internal dashboards, check-in wizards, or booking engines',
      'Tailored business logic, data normalization, or AI-assisted workflows',
      'Direct handoff with full code ownership and zero recurring license bloat',
    ],
    ctaLabel: 'Scope a Custom Software Build',
    highlight: false,
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
    <RoomShell room={room}>
      <div className="px-4 pb-16 pt-7 sm:px-8 sm:pb-20 sm:pt-10 lg:px-10 space-y-12 font-sans">
        <div>
          <RoomHeading
            num={room.num}
            verb={room.verb}
            badge="Process, Capabilities & Engagement"
            title="The Method."
            watermark={room.num}
            sub="How I take a project from understanding the underlying problem through visual design, engineering, and delivery—plus clear scope and pricing."
          />

          {/* 5-Step Connected Progression Bar */}
          <div className="mt-5">
            <MethodMap
              stages={STAGES}
              active={active}
              onSelect={setActive}
              onPrev={() => prev && setActive(prev.key)}
              onNext={() => next && setActive(next.key)}
            />
          </div>

          {/* Stable Stage Detail Container with Coordinated Artifact Transition */}
          <div className="mt-4 min-h-[440px]">
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
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-bone/20 pt-4">
            <button
              onClick={() => setActive(STAGES[0].key)}
              className="flex items-center gap-2 text-xs font-mono text-[#EDE9E0]/70 hover:text-[#D9A62E] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Start from Stage 01 (Observe)
            </button>

            <span className="font-mono text-xs text-[#EDE9E0]/60">
              Grounded in verified client &amp; studio builds
            </span>
          </div>
        </div>

        {/* SECTION 2: FOUNDER IDENTITY & OPERATING PHILOSOPHY (Decision #4) */}
        <section
          id="operating-philosophy"
          className="border-t border-bone/20 pt-10 space-y-6"
        >
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#D9A62E] font-bold block">
                WHO IS BEHIND CONTEXT &amp; MUSE
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#EDE9E0] leading-none">
                Jayme Volstad
              </h2>
              <p className="font-mono text-xs text-[#D9A62E]">
                Founder • Designer &amp; Full-Stack Builder
              </p>
              <p className="text-sm text-[#EDE9E0]/90 leading-relaxed pt-1">
                I approach every challenge from both sides: designing the visual identity and user experience people interact with, and building the software, logic, and workflows that make it genuinely useful.
              </p>
              <p className="text-xs sm:text-sm text-[#EDE9E0]/75 leading-relaxed">
                Before software, I worked in kitchens, production lines, and operations where tools have to hold up at 7:30 on a Friday night—not just look good in a presentation. Context &amp; Muse is my independent design and development practice for creating custom websites, digital products, quoting engines, and AI-assisted software around how people and businesses actually operate.
              </p>
            </div>

            <div className="lg:col-span-7 grid gap-4 sm:grid-cols-3">
              {PRINCIPLES.map((p) => (
                <div
                  key={p.num}
                  className="rounded-xl border border-bone/20 bg-[#113C37] p-5 flex flex-col justify-between space-y-3 shadow-md"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-xs font-bold text-[#D9A62E] block">
                      {p.num} / PRINCIPLE
                    </span>
                    <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-[#EDE9E0] leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#EDE9E0]/80 leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: COMMERCIAL PRICING & SCOPE STRUCTURE (Decision #3) */}
        <section
          id="ways-to-work-together"
          className="border-t border-bone/20 pt-10 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#D9A62E] font-bold block">
                WAYS TO WORK TOGETHER
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#EDE9E0]">
                Clear Scope. Upfront Pricing.
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#EDE9E0]/80 max-w-2xl">
                Start with a $395 diagnostic if you want a concrete architecture plan first, or scope a direct build if you already know what needs to be fixed.
              </p>
            </div>

            <button
              onClick={() => navigate('/lab#audit')}
              className="self-start md:self-auto inline-flex items-center gap-2 rounded border border-[#D9A62E]/50 bg-[#113C37] px-4 py-2 font-mono text-xs text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
            >
              <Compass className="h-3.5 w-3.5 text-[#D9A62E]" />
              <span>Want a quick self-check first? Try the Free Website + System Check →</span>
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-3 items-stretch">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.title}
                className={`rounded-xl p-6 flex flex-col justify-between transition-all shadow-lg ${
                  tier.highlight
                    ? 'bg-[#FAF8F5] text-[#1C2022] border-2 border-[#D9A62E]'
                    : 'bg-[#113C37] text-[#EDE9E0] border border-bone/20'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        tier.highlight
                          ? 'bg-[#17504A] text-[#EDE9E0]'
                          : 'bg-[#D9A62E]/20 text-[#D9A62E]'
                      }`}
                    >
                      {tier.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-black uppercase tracking-tight">
                      {tier.title}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span
                        className={`font-display text-3xl font-black tracking-tight ${
                          tier.highlight ? 'text-[#17504A]' : 'text-[#D9A62E]'
                        }`}
                      >
                        {tier.price}
                      </span>
                    </div>
                    <p
                      className={`mt-1 font-mono text-[11px] ${
                        tier.highlight ? 'text-[#1C2022]/70' : 'text-[#EDE9E0]/70'
                      }`}
                    >
                      {tier.cadence}
                    </p>
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      tier.highlight ? 'text-[#1C2022]/85' : 'text-[#EDE9E0]/85'
                    }`}
                  >
                    {tier.summary}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-current/10 text-xs">
                    {tier.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 mt-0.5 ${
                            tier.highlight ? 'text-[#17504A]' : 'text-[#D9A62E]'
                          }`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-current/10">
                  <button
                    onClick={openBrief}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                      tier.highlight
                        ? 'bg-[#17504A] text-[#EDE9E0] hover:bg-[#113C37]'
                        : 'bg-[#D9A62E] text-[#141617] hover:bg-[#e0b240]'
                    }`}
                  >
                    <span>{tier.ctaLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </RoomShell>
  );
}
