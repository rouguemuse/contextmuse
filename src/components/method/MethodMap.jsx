import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function MethodMap({ stages, active, onSelect, onPrev, onNext }) {
  const activeIndex = stages.findIndex((s) => s.key === active);
  const totalStages = stages.length;
  const progressPercent = totalStages > 1 ? (activeIndex / (totalStages - 1)) * 100 : 0;

  return (
    <div className="w-full space-y-3 font-sans">
      {/* Sequence Bar with Animated Connection Line & Smooth Indicator */}
      <div className="relative border border-[#DFDACE]/25 bg-[#10342f] p-2.5 rounded-lg shadow-inner overflow-hidden">
        {/* Animated Sequence Progress Line */}
        <div className="absolute top-[28px] left-[6%] right-[6%] h-[2px] bg-[#144841] pointer-events-none hidden md:block">
          <motion.div
            className="h-full bg-[#D9A62E]"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* 5 Step Buttons */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {stages.map((stage, idx) => {
            const isActive = stage.key === active;
            const isPast = idx < activeIndex;

            return (
              <button
                key={stage.key}
                onClick={() => onSelect(stage.key)}
                className={`relative flex flex-col items-start p-3 rounded-md transition-all text-left group ${
                  isActive
                    ? 'text-[#23282A]'
                    : isPast
                    ? 'bg-[#14433d]/70 text-[#EDE9E0] hover:bg-[#1a514a]'
                    : 'bg-[#0d2a26]/80 text-[#EDE9E0]/60 hover:text-[#EDE9E0] hover:bg-[#14433d]/40'
                }`}
              >
                {/* Active Sliding Background Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeMethodIndicator"
                    className="absolute inset-0 rounded-md bg-[#D9A62E] shadow-lg"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between w-full font-mono text-[10px] uppercase font-bold tracking-wider">
                  <span className={isActive ? 'text-[#23282A]' : isPast ? 'text-[#D9A62E]' : 'text-[#EDE9E0]/50'}>
                    {stage.num}
                  </span>
                  {isPast && <CheckCircle2 className="h-3 w-3 text-[#D9A62E]" />}
                </div>

                <span
                  className={`relative z-10 mt-1.5 font-display text-[13px] sm:text-sm font-extrabold uppercase tracking-tight ${
                    isActive ? 'text-[#23282A]' : 'text-[#EDE9E0]'
                  }`}
                >
                  {stage.slug}
                </span>

                <span
                  className={`relative z-10 font-mono text-[9px] truncate w-full mt-0.5 ${
                    isActive ? 'text-[#23282A]/80 font-medium' : 'text-[#EDE9E0]/50'
                  }`}
                >
                  {stage.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sequential Progression Controls */}
      <div className="flex items-center justify-between gap-3 px-1">
        <button
          onClick={onPrev}
          disabled={activeIndex <= 0}
          className="flex items-center gap-1.5 font-mono text-xs text-[#EDE9E0]/70 uppercase tracking-wider hover:text-[#D9A62E] disabled:opacity-30 disabled:pointer-events-none transition-colors py-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Previous Stage</span>
        </button>

        <span className="font-mono text-[11px] text-[#EDE9E0]/50 uppercase tracking-widest hidden sm:inline">
          Stage {String(activeIndex + 1).padStart(2, '0')} of {String(totalStages).padStart(2, '0')}
        </span>

        <button
          onClick={onNext}
          disabled={activeIndex >= totalStages - 1}
          className="flex items-center gap-1.5 font-mono text-xs text-[#EDE9E0] font-bold uppercase tracking-wider hover:text-[#D9A62E] disabled:opacity-30 disabled:pointer-events-none transition-colors py-1"
        >
          <span>Next: {activeIndex < totalStages - 1 ? stages[activeIndex + 1].slug : 'Complete'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
