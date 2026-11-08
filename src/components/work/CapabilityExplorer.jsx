import React, { useState } from 'react';
import { CAPABILITIES } from '@/data/capabilities';
import { PROJECTS } from '@/data/projects';
import {
  Layers,
  FileSpreadsheet,
  Truck,
  Table,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import {
  SpreadsheetCalculatorDemo,
  DumpsterSizingDemo,
  DataNormalizationIllustration,
  AdGeneratorIllustration,
} from '@/components/work/FunctionalIllustrations';

export default function CapabilityExplorer({ onSelectProject }) {
  const [activeCapabilityId, setActiveCapabilityId] = useState(CAPABILITIES[0].id);

  const activeCapability = CAPABILITIES.find((c) => c.id === activeCapabilityId) || CAPABILITIES[0];
  const relatedProjects = PROJECTS.filter((p) =>
    activeCapability.relatedProjectIds.includes(p.id)
  );

  const renderDemo = () => {
    switch (activeCapability.interactiveType) {
      case 'spreadsheet-calc':
        return <SpreadsheetCalculatorDemo defaultHeight={36} defaultLength={72} defaultRows={4} />;
      case 'dumpster-calc':
        return <DumpsterSizingDemo interactive={true} />;
      case 'data-normalization':
        return (
          <div className="bg-[#FAF8F5] text-[#1E293B] p-5 rounded-lg border border-[#DFDACE] shadow-inner">
            <div className="flex items-center justify-between border-b border-[#1E293B]/10 pb-2 mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#17504A] font-bold">
                INTERACTIVE TABLE DOCKET SANITIZER
              </span>
              <span className="font-mono text-[10px] bg-[#17504A] text-white px-2 py-0.5 rounded">
                RFC 4180 CSV
              </span>
            </div>
            <DataNormalizationIllustration interactive={true} />
          </div>
        );
      case 'ad-generator':
        return (
          <div className="bg-[#18181B] text-[#FAFAFA] p-5 rounded-lg border border-white/10 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#6366F1] font-bold">
                DYNAMIC CANVAS COMPOSITOR
              </span>
              <span className="font-mono text-[10px] text-white/60">Live Layer Controls</span>
            </div>
            <AdGeneratorIllustration interactive={true} />
          </div>
        );
      default:
        return null;
    }
  };

  const getCapabilityIcon = (id) => {
    switch (id) {
      case 'quote-calculator':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'intake-routing':
        return <Truck className="h-4 w-4" />;
      case 'data-normalization':
        return <Table className="h-4 w-4" />;
      case 'branded-ad-generator':
        return <Layers className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-[#D9A62E] font-bold block">
          REUSABLE SOFTWARE PATTERNS
        </span>
        <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#EDE9E0]">
          Core Capabilities in Action
        </h2>
        <p className="mt-1 font-sans text-xs sm:text-sm text-[#DFDACE]/70 max-w-2xl">
          Rather than rebuilding from zero, our client systems are assembled from robust, repeatable interaction capabilities. Explore an interactive example below:
        </p>
      </div>

      {/* Capability Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#DFDACE]/15 pb-3">
        {CAPABILITIES.map((cap) => {
          const isActive = cap.id === activeCapabilityId;
          return (
            <button
              key={cap.id}
              onClick={() => setActiveCapabilityId(cap.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded font-mono text-xs uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-[#17504A] text-[#EDE9E0] font-bold border border-[#D9A62E] shadow-sm'
                  : 'bg-[#1C2022] text-[#DFDACE]/70 hover:bg-[#23282A] hover:text-[#EDE9E0] border border-white/5'
              }`}
            >
              <span className={isActive ? 'text-[#D9A62E]' : 'opacity-60'}>
                {getCapabilityIcon(cap.id)}
              </span>
              <span>{cap.title.split('&')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Capability Detail & Interactive Example Frame */}
      <div className="grid gap-6 lg:grid-cols-12 bg-[#1A1D1E] border border-[#DFDACE]/15 rounded-lg p-5 sm:p-7 shadow-lg">
        {/* Left Column: Capability Explanation & Key Features (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#D9A62E] font-bold">
              01 / CAPABILITY DEFINITION
            </span>
            <h3 className="font-display text-xl font-bold text-[#EDE9E0] mt-1">
              {activeCapability.title}
            </h3>
            <p className="font-mono text-xs text-[#D9A62E] mt-0.5">
              {activeCapability.tagline}
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#DFDACE]/85 mt-3 leading-relaxed">
              {activeCapability.description}
            </p>

            {/* Key features bullet points */}
            <div className="mt-4 space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#DFDACE]/50 block">
                Technical Capabilities:
              </span>
              <ul className="space-y-1.5 font-sans text-xs text-[#DFDACE]/90">
                {activeCapability.keyFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Related Real Projects that utilize this capability */}
          <div className="pt-4 border-t border-white/10">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#DFDACE]/60 block mb-2">
              Related Client Systems Using This Capability:
            </span>
            <div className="flex flex-wrap gap-2">
              {relatedProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProject && onSelectProject(p)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#23282A] hover:bg-[#17504A] border border-white/10 text-left transition-colors text-[11px] font-mono text-[#EDE9E0]"
                >
                  <span className="font-bold text-[#D9A62E]">{p.title}</span>
                  <ArrowRight className="h-3 w-3 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Example (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="rounded-lg border border-[#DFDACE]/20 bg-[#141617] p-3 sm:p-5 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500/80" />
                <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D9A62E] font-bold">
                Interactive Capability Demonstrator (Try It Below)
              </span>
              <div className="w-6" />
            </div>

            {renderDemo()}
          </div>
        </div>
      </div>
    </section>
  );
}
