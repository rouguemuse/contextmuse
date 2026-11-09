import React, { useState } from 'react';
import { FileCheck } from 'lucide-react';
import { METHOD_CASES } from '@/components/method/methodData';
import MethodArtifact from '@/components/method/MethodArtifact';

export default function MethodDetail({ stage }) {
  const [selectedCase, setSelectedCase] = useState('lone-wolf');
  const evidence = stage.evidenceGrounded[selectedCase];

  return (
    <div className="bg-[#FAF8F5] text-[#23282A] border border-[#23282A]/15 border-t-[3px] border-t-[#17504A] p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header with Case Grounding Selector */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#23282A]/12 pb-5">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#17504A] font-bold block">
            Stage {stage.num} / {stage.slug}
          </span>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#23282A]">
            {stage.title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#23282A]/80 font-sans leading-relaxed max-w-2xl">
            {stage.desc}
          </p>
        </div>

        {/* Case Study Switcher */}
        <div className="flex flex-col sm:items-end gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#23282A]/60 font-bold">
            Inspect Real Build Evidence:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 bg-[#EDE9E0] p-1 border border-[#23282A]/12">
            {METHOD_CASES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCase(c.id)}
                className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  selectedCase === c.id
                    ? 'bg-[#17504A] text-[#EDE9E0] font-bold'
                    : 'text-[#23282A]/75 hover:text-[#23282A]'
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
        {/* Left Column: Grounded Evidence */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="border border-[#23282A]/12 bg-[#EDE9E0]/55 p-5 space-y-4 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#23282A]/12 pb-2.5">
              <span className="font-mono text-xs font-bold text-[#17504A]">
                {METHOD_CASES.find((c) => c.id === selectedCase)?.subtitle}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#23282A]/55">
                Verified Build Record
              </span>
            </div>

            <div className="space-y-3.5 text-xs sm:text-[13.5px] leading-relaxed">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#23282A]/60 block mb-1 font-bold">
                  Operational Reality Observed
                </span>
                <p className="text-[#23282A]/90 font-sans">
                  {evidence?.observedReality}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#17504A] block mb-1 font-bold">
                  Key Diagnostic Finding
                </span>
                <p className="text-[#23282A] font-sans font-medium">
                  {evidence?.keyFinding}
                </p>
              </div>
            </div>

            <div className="border-t border-[#23282A]/12 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-[#17504A]" />
                <span className="font-mono text-[11px] font-bold text-[#23282A]">
                  Artifact: {evidence?.realArtifact}
                </span>
              </div>
            </div>
          </div>

          {/* Deliverable Outputs */}
          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#23282A]/60 block mb-2 font-bold">
              Deliverables produced at this stage:
            </span>
            <div className="flex flex-wrap gap-2">
              {stage.makes.map((item, idx) => (
                <span
                  key={idx}
                  className="border border-[#23282A]/15 bg-[#EDE9E0]/75 text-[#23282A] px-2.5 py-1 font-mono text-[11px] font-medium flex items-center gap-1.5"
                >
                  <span className="h-1.5 w-1.5 bg-[#17504A]" />
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
