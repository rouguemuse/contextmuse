import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import WebsiteAuditTool from '@/components/lab/WebsiteAuditTool';

export default function AuditLauncherCard() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#audit') {
      setOpen(true);
    }
  }, []);

  return (
    <div
      id="audit"
      className="h-full bg-[#FAF8F5] border border-[#23282A]/15 p-4 sm:p-6 text-[#23282A] space-y-4 font-sans shadow-sm flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#23282A]/12 pb-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A6F0B] font-bold block">
              04 · 4-Pillar Structural Health Inspector
            </span>
            <h3 className="font-display text-lg font-black uppercase tracking-tight text-[#23282A] mt-0.5">
              Website &amp; System Architecture Audit
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full sm:w-auto min-h-[40px] flex items-center justify-center gap-1.5 bg-[#23282A] text-[#EDE9E0] px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#D9A62E] hover:text-[#141617] transition-colors"
          >
            <span>{open ? 'Collapse Inspector' : 'Open Inspector'}</span>
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        <p className="text-xs text-[#23282A]/75 font-sans leading-relaxed">
          Evaluates live website hierarchy, conversion friction, and intake systems across Message, Paths, Proof, and Intake. Companion to our{' '}
          <a
            href="/lab/design-intelligence"
            className="font-mono text-[11px] font-bold text-[#17504A] underline hover:text-[#23282A]"
          >
            Design Intelligence
          </a>{' '}
          token-extraction and 85-node specimen study.
        </p>

        {/* Mini Preview Bar */}
        {!open && (
          <div
            onClick={() => setOpen(true)}
            className="cursor-pointer p-3.5 sm:p-4 bg-[#141617] text-[#EDE9E0] border border-[#23282A]/15 hover:border-[#D9A62E] transition-colors space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 font-mono text-xs">
              <span className="text-[#DFDACE]/85 flex items-center gap-2 min-w-0">
                <Search className="h-3.5 w-3.5 text-[#D9A62E] shrink-0" />
                <span className="truncate">https://sample-hospitality-ptac.com</span>
              </span>
              <span className="text-[#D9A62E] font-bold text-[11px] shrink-0">
                1 High Priority • 2 Opportunities
              </span>
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
              Tap to expand interactive audit &amp; inspect sample sites →
            </div>
          </div>
        )}

        {/* Expanded Full Audit View — De-nested padding on mobile */}
        {open && (
          <div className="mt-3 pt-3 border-t border-[#23282A]/15 animate-in fade-in duration-200">
            <WebsiteAuditTool />
          </div>
        )}
      </div>
    </div>
  );
}
