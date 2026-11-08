import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';
import { roomById } from '@/lib/rooms';
import { useTransitionCoordinator } from '@/lib/TransitionContext';

export default function HeroPanel({ onEnterRoom }) {
  const { openBrief } = useBrief();
  const navigate = useNavigate();
  const { startTransition } = useTransitionCoordinator();

  const handleEnterWork = (e) => {
    const workRoom = roomById('work');
    if (!workRoom) return;
    const tileEl = document.querySelector('[data-room-id="work"]');
    const rect = tileEl
      ? tileEl.getBoundingClientRect()
      : e.currentTarget.getBoundingClientRect();
    if (onEnterRoom) {
      onEnterRoom(workRoom, rect);
    } else {
      startTransition(workRoom, rect, navigate);
    }
  };

  return (
    <section className="relative flex flex-1 flex-col justify-between px-6 py-10 sm:px-10 sm:py-12 lg:px-10 lg:py-12 xl:px-12 xl:py-14 font-sans h-full">
      <div className="space-y-6">
        {/* Approved Eyebrow */}
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D9A62E]" />
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.13em] sm:tracking-widest text-[#D9A62E] font-bold">
            CONTEXT &amp; MUSE / INDEPENDENT DESIGN &amp; DEVELOPMENT
          </span>
        </div>

        {/* Approved Two-Part Editorial Headline */}
        <h1 className="font-display text-[clamp(1.55rem,2.8vw,2.75rem)] font-black uppercase leading-[1.02] tracking-tight text-[#EDE9E0]">
          <span className="block">CONCEPT TO PRODUCT.</span>
          <span className="block text-[#D9A62E] mt-1.5">GIVING IDEAS FORM.</span>
        </h1>

        {/* Approved Supporting Copy */}
        <div className="max-w-xl">
          <p className="text-sm sm:text-base text-[#DFDACE]/90 leading-relaxed font-sans">
            Websites, visual identities, digital products, and custom software. Thoughtfully designed, fully realized.
          </p>
        </div>

        {/* Primary & Secondary Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            onClick={handleEnterWork}
            className="group flex items-center justify-center gap-2.5 bg-[#D9A62E] text-[#141617] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider rounded shadow-lg hover:bg-[#e0b240] transition-all transform active:scale-95"
          >
            <span>Explore the Work</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={openBrief}
            className="flex items-center justify-center gap-2 border border-[#DFDACE]/25 bg-[#23282A]/80 text-[#EDE9E0] px-5 py-3.5 font-mono text-xs uppercase tracking-wider rounded hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Core Capability Pillars */}
      <div className="pt-8 mt-8 border-t border-[#DFDACE]/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans text-[#DFDACE]/80">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#D9A62E] shrink-0 mt-0.5" />
          <div>
            <strong className="block text-[#EDE9E0] font-mono text-[10.5px] uppercase">Design &amp; Identity</strong>
            <span className="text-[11px] text-[#DFDACE]/70">Visual direction, interfaces, and brand clarity.</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#D9A62E] shrink-0 mt-0.5" />
          <div>
            <strong className="block text-[#EDE9E0] font-mono text-[10.5px] uppercase">Websites &amp; Products</strong>
            <span className="text-[11px] text-[#DFDACE]/70">Custom web applications and interactive UX.</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#D9A62E] shrink-0 mt-0.5" />
          <div>
            <strong className="block text-[#EDE9E0] font-mono text-[10.5px] uppercase">Intelligent Software</strong>
            <span className="text-[11px] text-[#DFDACE]/70">Quoting engines, custom tools, and AI workflows.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
