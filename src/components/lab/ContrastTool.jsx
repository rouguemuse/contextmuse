import { useState } from 'react';
import { ArrowLeftRight, Eye } from 'lucide-react';

const toRgb = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
};

const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrastRatio = (a, b) => {
  const one = luminance(a);
  const two = luminance(b);
  const hi = Math.max(one, two);
  const lo = Math.min(one, two);
  return (hi + 0.05) / (lo + 0.05);
};

function Swatch({ label, value, onChange }) {
  return (
    <label className="flex flex-1 items-center gap-2 border border-[#DFDACE]/25 px-2.5 py-1.5 rounded bg-[#141617] cursor-pointer">
      <span className="relative block h-6 w-6 rounded border border-white/20 shrink-0" style={{ backgroundColor: value }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label={label}
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-mono text-[9px] uppercase text-[#DFDACE]/60">{label}</span>
        <span className="mt-1 font-mono text-[11px] font-bold text-[#EDE9E0] uppercase">{value}</span>
      </span>
    </label>
  );
}

export default function ContrastTool() {
  const [fg, setFg] = useState('#EDE9E0');
  const [bg, setBg] = useState('#17504A');
  const ratio = contrastRatio(fg, bg);
  const verdict = ratio >= 7 ? 'AAA Pass' : ratio >= 4.5 ? 'AA Pass' : ratio >= 3 ? 'AA Large Only' : 'Fails WCAG';

  return (
    <div id="tool-contrast" className="bg-[#1C2022] border border-[#DFDACE]/25 rounded-lg p-5 text-[#EDE9E0] space-y-4 font-sans shadow-lg flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFDACE]/15 pb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-[#D9A62E]" />
          <div>
            <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-[#EDE9E0]">
              Color Contrast & Readability Utility
            </h3>
            <span className="font-mono text-[10px] text-[#DFDACE]/60">
              Live WCAG Ratio Calculator
            </span>
          </div>
        </div>

        <span className="rounded bg-[#D9A62E] text-[#1C2022] px-2 py-0.5 font-mono text-[9px] font-bold uppercase">
          Working Tool
        </span>
      </div>

      <p className="text-xs text-[#DFDACE]/80 font-sans leading-relaxed">
        Test foreground and background color pairs against WCAG standards to see if typography holds up or collapses.
      </p>

      {/* Live Swatch Preview */}
      <div
        className="flex min-h-[100px] items-center justify-center px-4 py-6 rounded border border-[#DFDACE]/20 shadow-inner transition-colors duration-200"
        style={{ backgroundColor: bg, color: fg }}
      >
        <span className="text-center font-display text-2xl font-extrabold uppercase tracking-tight">
          Make it readable.
        </span>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-stretch gap-2">
        <Swatch label="Text" value={fg} onChange={setFg} />
        <Swatch label="Ground" value={bg} onChange={setBg} />
        <button
          onClick={() => {
            setFg(bg);
            setBg(fg);
          }}
          className="flex items-center gap-1.5 border border-[#DFDACE]/25 bg-[#141617] text-[#EDE9E0] px-3 py-1 text-xs font-mono uppercase tracking-wider rounded hover:bg-[#D9A62E] hover:text-[#1C2022] transition-colors"
        >
          <ArrowLeftRight className="h-3 w-3" />
          <span>Swap</span>
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-[#DFDACE]/15 pt-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs text-[#DFDACE]/60">Calculated Ratio:</span>
          <span className="font-display text-xl font-extrabold text-[#D9A62E]">
            {ratio.toFixed(2)}:1
          </span>
        </div>
        <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded uppercase ${
          ratio >= 4.5 ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-red-950/80 text-red-300 border border-red-500/40'
        }`}>
          {verdict}
        </span>
      </div>
    </div>
  );
}
