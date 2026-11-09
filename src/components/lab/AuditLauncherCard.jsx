import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import WebsiteAuditTool from '@/components/lab/WebsiteAuditTool';

export default function AuditLauncherCard() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // If URL has #audit, open automatically
    if (typeof window !== 'undefined' && window.location.hash === '#audit') {
      setOpen(true);
    }
  }, []);

  return (
    <div
      id="audit"
      className="h-full bg-[#FAF8F5] border border-[#23282A]/15 p-5 sm:p-6 text-[#23282A] space-y-4 font-sans shadow-sm flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#23282A]/12 pb-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A6F0B] font-bold block">
              4-Pillar Structural Health Inspector
            </span>
            <h3 className="font-display text-lg font-black uppercase tracking-tight text-[#23282A] mt-0.5">
              Website &amp; System Architecture Audit
            </h3>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 bg-[#23282A] text-[#EDE9E0] px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#D9A62E] hover:text-[#141617] transition-colors"
          >
            <span>{open ? 'Collapse Inspector' : 'Open Inspector'}</span>
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        <p className="text-xs text-[#23282A]/75 font-sans leading-relaxed">
          Evaluates website hierarchy, conversion friction, and intake systems across Message, Paths, Proof, and Intake.
        </p>

        {/* Mini Preview Bar */}
        {!open && (
          <div
            onClick={() => setOpen(true)}
            className="cursor-pointer p-4 bg-[#141617] text-[#EDE9E0] border border-[#23282A]/15 hover:border-[#D9A62E] transition-colors space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <span className="text-[#DFDACE]/80 flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-[#D9A62E]" />
                <span>https://sample-hospitality-ptac.com</span>
              </span>
              <span className="text-[#D9A62E] font-bold">1 High Priority • 2 Opportunities</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
              <div className="bg-[#23282A] p-2.5 border border-[#DFDACE]/10">
                <span className="text-[#DFDACE]/55 block">01 / MESSAGE</span>
                <span className="text-[#EDE9E0] font-bold">Needs Contrast</span>
              </div>
              <div className="bg-[#23282A] p-2.5 border border-[#DFDACE]/10">
                <span className="text-[#DFDACE]/55 block">02 / PATHS</span>
                <span className="text-amber-400 font-bold">Sizing Drop-Off</span>
              </div>
              <div className="bg-[#23282A] p-2.5 border border-[#DFDACE]/10">
                <span className="text-[#DFDACE]/55 block">03 / PROOF</span>
                <span className="text-[#EDE9E0] font-bold">Verified Specs</span>
              </div>
              <div className="bg-[#23282A] p-2.5 border border-[#DFDACE]/10">
                <span className="text-[#DFDACE]/55 block">04 / INTAKE</span>
                <span className="text-red-400 font-bold">Unstructured Email</span>
              </div>
            </div>

            <div className="text-center pt-1 font-mono text-[11px] text-[#D9A62E]">
              Click to expand interactive audit &amp; inspect sample sites →
            </div>
          </div>
        )}

        {/* Expanded Full Audit View */}
        {open && (
          <div className="mt-4 pt-4 border-t border-[#23282A]/15 bg-[#1C2022] text-[#EDE9E0] p-4 animate-in fade-in duration-200">
            <WebsiteAuditTool />
          </div>
        )}
      </div>
    </div>
  );
}
