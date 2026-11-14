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
    <div
      id="tool-table-docket"
      className="h-full bg-[#FAF8F5] border border-[#23282A]/15 p-5 sm:p-6 text-[#23282A] space-y-4 font-sans shadow-sm flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#23282A]/12 pb-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A6F0B] font-bold block">
              TableDocket Sanitizer
            </span>
            <h3 className="font-display text-lg font-black uppercase tracking-tight text-[#23282A] mt-0.5">
              Data Normalization Workbench
            </h3>
          </div>

          <button
            onClick={() => setNormalized(!normalized)}
            className="flex items-center gap-1.5 bg-[#23282A] text-[#EDE9E0] px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#D9A62E] hover:text-[#141617] transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>{normalized ? 'Reset Raw Records' : 'Normalize Data'}</span>
          </button>
        </div>

        <p className="text-xs text-[#23282A]/75 font-sans leading-relaxed">
          Transform inconsistent spreadsheets and unformatted text dumps into clean, predictable data tables.
        </p>

        {/* State View Indicator */}
        <div className="flex items-center justify-between bg-[#EDE9E0]/70 px-3 py-2 border border-[#23282A]/12 font-mono text-[11px]">
          <span className="text-[#23282A]/70">
            Current State:{' '}
            <strong className={normalized ? 'text-[#17504A]' : 'text-[#9A6F0B]'}>
              {normalized ? 'Deterministic Schema (Normalized)' : 'Raw Unstructured Ingest'}
            </strong>
          </span>
          <span className="text-[10px] text-[#23282A]/55">4 records</span>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-[#23282A]/15 bg-[#141617] text-[#EDE9E0]">
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
                        <span className="px-1.5 py-0.5 bg-[#17504A] text-[#EDE9E0] text-[10px] font-bold">
                          {cleanStatus}
                        </span>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={idx} className="hover:bg-[#1C2022] transition-colors">
                    <td className="p-2.5 text-red-300/85 font-sans italic">{row.rawName}</td>
                    <td className="p-2.5 text-amber-300/85">{row.rawPhone}</td>
                    <td className="p-2.5 text-[#DFDACE]/65">{row.rawDate}</td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 bg-red-950/60 text-red-300 text-[10px]">
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
    </div>
  );
}
