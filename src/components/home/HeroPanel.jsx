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
    <section className="relative flex flex-1 flex-col justify-between px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-9 xl:px-[clamp(2.5rem,3.6vw,5.25rem)] xl:py-[clamp(2.5rem,4vh,4.5rem)] font-sans h-full">
      {/* Upper / Center Editorial Core — Fluidly Centered on Tall Desktop & Ultrawide Screens */}
      <div className="my-auto w-full max-w-[54rem] space-y-4 sm:space-y-5 xl:space-y-[clamp(1.35rem,2.2vh,2.25rem)]">
        {/* Approved Eyebrow */}
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 2xl:h-2 2xl:w-2 shrink-0 rounded-full bg-[#D9A62E]" />
          <span className="font-mono text-[10px] sm:text-xs 2xl:text-[clamp(0.75rem,0.52vw+0.42rem,0.95rem)] uppercase tracking-[0.13em] sm:tracking-[0.16em] text-[#D9A62E] font-bold">
            CONTEXT &amp; MUSE / INDEPENDENT DESIGN &amp; DEVELOPMENT
          </span>
        </div>

        {/* Approved Two-Part Editorial Headline */}
        <h1 className="font-display text-[clamp(1.5rem,5.4vw,2.35rem)] sm:text-[clamp(2rem,3.6vw,2.75rem)] xl:text-[clamp(2.2rem,2.15vw+0.45rem,3.95rem)] font-black uppercase leading-[1.02] tracking-[-0.02em] text-[#EDE9E0]">
          <span className="block sm:whitespace-nowrap">CONCEPT TO PRODUCT.</span>
          <span className="block text-[#D9A62E] mt-1 sm:mt-1.5 sm:whitespace-nowrap">GIVING IDEAS FORM.</span>
        </h1>

        {/* Approved Supporting Copy */}
        <div className="max-w-[38rem]">
          <p className="text-[13.5px] sm:text-[15px] xl:text-[clamp(0.95rem,0.55vw+0.55rem,1.3rem)] text-[#DFDACE]/90 leading-[1.55] font-sans">
            Websites, visual identities, digital products, and custom software. Thoughtfully designed, fully realized.
          </p>
        </div>

        {/* Primary & Secondary Dual CTAs */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3.5 pt-1 sm:pt-2">
          <button
            onClick={handleEnterWork}
            className="group flex items-center justify-center gap-1.5 sm:gap-2 bg-[#D9A62E] text-[#141617] px-2.5 py-3 sm:px-6 sm:py-3.5 2xl:px-8 2xl:py-4 font-mono text-[10.5px] sm:text-xs 2xl:text-[clamp(0.75rem,0.45vw+0.45rem,0.92rem)] font-bold uppercase tracking-wider whitespace-nowrap rounded shadow-lg hover:bg-[#e0b240] transition-all transform active:scale-95"
          >
            <span>Explore the Work</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={openBrief}
            className="flex items-center justify-center gap-1.5 sm:gap-2 border border-[#DFDACE]/30 bg-[#2C3335]/85 text-[#EDE9E0] px-2.5 py-3 sm:px-5 sm:py-3.5 2xl:px-7 2xl:py-4 font-mono text-[10.5px] sm:text-xs 2xl:text-[clamp(0.75rem,0.45vw+0.45rem,0.92rem)] uppercase tracking-wider whitespace-nowrap rounded hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>
      </div>

      {/* 3 Core Capability Pillars */}
      <div className="pt-4 mt-5 sm:pt-6 sm:mt-7 xl:pt-[clamp(1.5rem,2.4vh,2.5rem)] xl:mt-[clamp(1.75rem,3vh,3.25rem)] border-t border-[#DFDACE]/15 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 2xl:gap-6 text-xs font-sans text-[#DFDACE]/80">
        <div className="flex items-start gap-2.5 rounded border border-[#DFDACE]/15 bg-[#2C3335]/70 p-2.5 sm:p-3 2xl:p-4">
          <CheckCircle2 className="h-4 w-4 2xl:h-4.5 2xl:w-4.5 text-[#D9A62E] shrink-0 mt-0.5" />
          <div className="min-w-0">
            <strong className="block text-[#EDE9E0] font-mono text-[10.5px] sm:text-[11px] 2xl:text-[clamp(0.7rem,0.42vw+0.42rem,0.88rem)] uppercase tracking-wider">
              Design &amp; Identity
            </strong>
            <span className="mt-0.5 block text-[11px] sm:text-[11.5px] 2xl:text-[clamp(0.72rem,0.42vw+0.42rem,0.9rem)] text-[#DFDACE]/75 leading-snug">
              Visual direction, interfaces, and brand clarity.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded border border-[#DFDACE]/15 bg-[#2C3335]/70 p-2.5 sm:p-3 2xl:p-4">
          <CheckCircle2 className="h-4 w-4 2xl:h-4.5 2xl:w-4.5 text-[#D9A62E] shrink-0 mt-0.5" />
          <div className="min-w-0">
            <strong className="block text-[#EDE9E0] font-mono text-[10.5px] sm:text-[11px] 2xl:text-[clamp(0.7rem,0.42vw+0.42rem,0.88rem)] uppercase tracking-wider">
              Websites &amp; Products
            </strong>
            <span className="mt-0.5 block text-[11px] sm:text-[11.5px] 2xl:text-[clamp(0.72rem,0.42vw+0.42rem,0.9rem)] text-[#DFDACE]/75 leading-snug">
              Custom web applications and interactive UX.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded border border-[#DFDACE]/15 bg-[#2C3335]/70 p-2.5 sm:p-3 2xl:p-4">
          <CheckCircle2 className="h-4 w-4 2xl:h-4.5 2xl:w-4.5 text-[#D9A62E] shrink-0 mt-0.5" />
          <div className="min-w-0">
            <strong className="block text-[#EDE9E0] font-mono text-[10.5px] sm:text-[11px] 2xl:text-[clamp(0.7rem,0.42vw+0.42rem,0.88rem)] uppercase tracking-wider">
              Intelligent Software
            </strong>
            <span className="mt-0.5 block text-[11px] sm:text-[11.5px] 2xl:text-[clamp(0.72rem,0.42vw+0.42rem,0.9rem)] text-[#DFDACE]/75 leading-snug">
              Quoting engines, custom tools, and AI workflows.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
