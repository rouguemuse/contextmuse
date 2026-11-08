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
    <div id="audit" className="bg-[#1C2022] border border-[#DFDACE]/25 rounded-lg p-5 text-[#EDE9E0] space-y-4 font-sans shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFDACE]/15 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#D9A62E]" />
          <div>
            <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-[#EDE9E0]">
              Website & System Architecture Audit
            </h3>
            <span className="font-mono text-[10px] text-[#DFDACE]/60">
              4-Pillar Structural Health Inspector
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded bg-[#D9A62E] text-[#1C2022] px-2 py-0.5 font-mono text-[9px] font-bold uppercase">
            Working Tool
          </span>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 bg-[#D9A62E] text-[#1C2022] px-3 py-1 text-xs font-mono font-bold uppercase rounded hover:bg-[#e0b240] transition-colors"
          >
            <span>{open ? 'Collapse Inspector' : 'Launch Audit Inspector'}</span>
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      <p className="text-xs text-[#DFDACE]/80 font-sans leading-relaxed">
        A diagnostic inspection tool that analyzes website hierarchy, conversion friction, and intake systems with zero automated fluff.
      </p>

      {/* Mini Preview Bar */}
      {!open && (
        <div
          onClick={() => setOpen(true)}
          className="cursor-pointer p-4 bg-[#141617] rounded border border-[#DFDACE]/15 hover:border-[#D9A62E]/50 transition-colors space-y-3"
        >
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#DFDACE]/70 flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-[#D9A62E]" />
              <span>https://sample-hospitality-ptac.com</span>
            </span>
            <span className="text-emerald-400 font-bold">1 High Priority • 2 Opportunities</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
            <div className="bg-[#23282A] p-2 rounded border border-[#DFDACE]/10">
              <span className="text-[#DFDACE]/50 block">01 / MESSAGE</span>
              <span className="text-[#EDE9E0] font-bold">Needs Contrast</span>
            </div>
            <div className="bg-[#23282A] p-2 rounded border border-[#DFDACE]/10">
              <span className="text-[#DFDACE]/50 block">02 / PATHS</span>
              <span className="text-amber-400 font-bold">Sizing Drop-Off</span>
            </div>
            <div className="bg-[#23282A] p-2 rounded border border-[#DFDACE]/10">
              <span className="text-[#DFDACE]/50 block">03 / PROOF</span>
              <span className="text-[#EDE9E0] font-bold">Verified Specs</span>
            </div>
            <div className="bg-[#23282A] p-2 rounded border border-[#DFDACE]/10">
              <span className="text-[#DFDACE]/50 block">04 / INTAKE</span>
              <span className="text-red-400 font-bold">Unstructured Email</span>
            </div>
          </div>

          <div className="text-center pt-1 font-mono text-[11px] text-[#D9A62E]">
            Click to launch full interactive audit & inspect sample sites →
          </div>
        </div>
      )}

      {/* Expanded Full Audit View */}
      {open && (
        <div className="mt-4 pt-4 border-t border-[#DFDACE]/15 animate-in fade-in duration-200">
          <WebsiteAuditTool />
        </div>
      )}
    </div>
  );
}
