import React, { useState } from 'react';
import { Table, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

const RAW_RECORDS = [
  { rawPhone: '2145550199', rawDate: '03/14/2026', rawName: 'm. henderson (Dallas)', rawStatus: 'PENDING--CALL' },
  { rawPhone: '+1 (469) 555-8821', rawDate: '2026-03-15T09:30:00Z', rawName: 'SARAH CONNOR LLC', rawStatus: 'approved' },
  { rawPhone: '972.555.3340 ext 4', rawDate: 'Mar 15, 2026', rawName: 'baker & sons fabrication', rawStatus: 'WAITING_DISPATCH' },
  { rawPhone: '817-555-9011', rawDate: '16-03-2026', rawName: 'Apex Roofing Corp.', rawStatus: 'dispatched!!' },
];

export default function TableDocketTool() {
  const [normalized, setNormalized] = useState(false);

  return (
    <div id="tool-table-docket" className="bg-[#1C2022] border border-[#DFDACE]/25 rounded-lg p-5 text-[#EDE9E0] space-y-4 font-sans shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFDACE]/15 pb-3">
        <div className="flex items-center gap-2">
          <Table className="h-4 w-4 text-[#D9A62E]" />
          <div>
            <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-[#EDE9E0]">
              Data Normalization Workbench
            </h3>
            <span className="font-mono text-[10px] text-[#DFDACE]/60">
              Interactive TableDocket Sanitizer
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded bg-[#17504A] text-[#EDE9E0] px-2 py-0.5 font-mono text-[9px] font-bold uppercase">
            Interactive Example
          </span>
          <button
            onClick={() => setNormalized(!normalized)}
            className="flex items-center gap-1.5 bg-[#D9A62E] text-[#1C2022] px-3 py-1 text-xs font-mono font-bold uppercase rounded hover:bg-[#e0b240] transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${normalized ? '' : 'animate-spin'}`} />
            <span>{normalized ? 'Reset Raw Records' : 'Normalize Data'}</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-[#DFDACE]/80 font-sans leading-relaxed">
        Transform inconsistent spreadsheets and unformatted text dumps into clean, predictable data tables.
      </p>

      {/* State View Indicator */}
      <div className="flex items-center justify-between bg-[#141617] px-3 py-1.5 rounded border border-[#DFDACE]/10 font-mono text-[11px]">
        <span className="text-[#DFDACE]/60">
          Current State: <strong className={normalized ? 'text-emerald-400' : 'text-amber-400'}>{normalized ? 'Deterministic Schema (Normalized)' : 'Raw Unstructured Ingest'}</strong>
        </span>
        <span className="text-[10px] text-[#DFDACE]/50">4 records loaded</span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded border border-[#DFDACE]/15 bg-[#141617]">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-[#DFDACE]/15 bg-[#23282A] text-[#DFDACE]/70 text-[10px] uppercase">
              <th className="p-2.5">Account / Entity</th>
              <th className="p-2.5">Contact Phone</th>
              <th className="p-2.5">Standard Date</th>
              <th className="p-2.5">Pipeline State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DFDACE]/10">
            {RAW_RECORDS.map((row, idx) => {
              if (normalized) {
                // Normalized representation
                const cleanPhone = row.rawPhone.replace(/\D/g, '').slice(-10);
                const formattedPhone = `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
                const cleanName = row.rawName.split('(')[0].trim().replace(/\b\w/g, (c) => c.toUpperCase());
                const cleanStatus = row.rawStatus.replace(/[^A-Za-z]/g, ' ').trim().toUpperCase();

                return (
                  <tr key={idx} className="hover:bg-[#1C2022] transition-colors">
                    <td className="p-2.5 font-bold text-[#EDE9E0] flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{cleanName}</span>
                    </td>
                    <td className="p-2.5 text-[#D9A62E]">{formattedPhone}</td>
                    <td className="p-2.5 text-[#EDE9E0]/80">2026-03-{14 + idx}</td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#17504A]/60 text-emerald-300 text-[10px] font-bold">
                        {cleanStatus}
                      </span>
                    </td>
                  </tr>
                );
              }

              // Raw noisy representation
              return (
                <tr key={idx} className="hover:bg-[#1C2022] transition-colors">
                  <td className="p-2.5 text-red-300/80 font-sans italic">{row.rawName}</td>
                  <td className="p-2.5 text-amber-300/80">{row.rawPhone}</td>
                  <td className="p-2.5 text-[#DFDACE]/60">{row.rawDate}</td>
                  <td className="p-2.5">
                    <span className="px-1.5 py-0.5 rounded bg-red-950/60 text-red-300 text-[10px]">
                      {row.rawStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
