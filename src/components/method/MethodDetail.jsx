import React, { useState } from 'react';
import { ArrowRight, FileCheck, CheckCircle2 } from 'lucide-react';
import { METHOD_CASES } from '@/components/method/methodData';
import MethodArtifact from '@/components/method/MethodArtifact';

export default function MethodDetail({ stage, onNext, nextLabel, onPrev, prevLabel }) {
  const [selectedCase, setSelectedCase] = useState('lone-wolf');
  const evidence = stage.evidenceGrounded[selectedCase];

  return (
    <div className="bg-[#EDE9E0] text-[#23282A] rounded-lg border border-[#DFDACE]/30 p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header with Case Grounding Selector */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#23282A]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#17504A] font-bold">
              STAGE {stage.num} / {stage.slug.toUpperCase()}
            </span>
            <span className="rounded bg-[#17504A] px-2 py-0.5 font-mono text-[9px] text-[#EDE9E0] uppercase font-bold">
              Live Grounded Record
            </span>
          </div>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#23282A]">
            {stage.title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#23282A]/80 font-sans leading-relaxed max-w-2xl">
            {stage.desc}
          </p>
        </div>

        {/* Case Study Switcher */}
        <div className="flex flex-col items-end gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#23282A]/60 font-bold">
            Real Case Evidence:
          </span>
          <div className="flex items-center gap-1.5 bg-[#23282A]/10 p-1 rounded-md">
            {METHOD_CASES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCase(c.id)}
                className={`px-3 py-1 font-mono text-xs uppercase tracking-wider rounded transition-colors ${
                  selectedCase === c.id
                    ? 'bg-[#17504A] text-[#EDE9E0] font-bold shadow-sm'
                    : 'text-[#23282A] hover:bg-[#23282A]/10'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column Grounded Reality + Interactive Working Visual Artifact */}
      <div className="grid gap-6 lg:grid-cols-12 min-h-[280px] items-stretch">
        {/* Left Column: Unvarnished Grounded Evidence */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="border border-[#17504A]/25 bg-white/70 p-4 sm:p-5 rounded-md space-y-3.5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#23282A]/10 pb-2">
              <span className="font-mono text-xs font-bold text-[#17504A]">
                {METHOD_CASES.find((c) => c.id === selectedCase)?.subtitle}
              </span>
              <span className="font-mono text-[10px] text-[#23282A]/60">Operational Record</span>
            </div>

            <div className="space-y-3 text-xs sm:text-[13px] leading-relaxed">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#23282A]/60 block mb-0.5 font-bold">
                  Operational Reality Observed:
                </span>
                <p className="text-[#23282A]/90 font-sans">
                  {evidence?.observedReality}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#D9A62E] block mb-0.5 font-bold">
                  Key Diagnostic Finding:
                </span>
                <p className="text-[#23282A] font-sans font-medium">
                  {evidence?.keyFinding}
                </p>
              </div>
            </div>

            <div className="border-t border-[#23282A]/10 pt-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileCheck className="h-4 w-4 text-[#17504A]" />
                <span className="font-mono text-[11px] font-bold text-[#17504A]">
                  Artifact: {evidence?.realArtifact}
                </span>
              </div>
              <CheckCircle2 className="h-4 w-4 text-[#D9A62E]" />
            </div>
          </div>

          {/* Deliverable Outputs */}
          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#23282A]/60 block mb-1.5 font-bold">
              What takes permanent shape at this stage:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {stage.makes.map((item, idx) => (
                <span
                  key={idx}
                  className="rounded bg-[#23282A] text-[#EDE9E0] px-2.5 py-1 font-mono text-[11px] font-medium flex items-center gap-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D9A62E]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Working Interactive Visual Artifact */}
        <div className="lg:col-span-6 flex flex-col">
          <MethodArtifact stageKey={stage.key} caseId={selectedCase} />
        </div>
      </div>
    </div>
  );
}
