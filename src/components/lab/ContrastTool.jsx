import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

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

const BRAND_PAIR_PRESETS = [
  { label: 'Teal / Bone', fg: '#EDE9E0', bg: '#17504A' },
  { label: 'Ink / Gold', fg: '#D9A62E', bg: '#23282A' },
  { label: 'Paper / Ink', fg: '#23282A', bg: '#FAF8F5' },
  { label: 'Low Contrast', fg: '#9A6F0B', bg: '#D9A62E' },
];

function Swatch({ label, value, onChange }) {
  return (
    <label className="flex flex-1 items-center gap-2.5 border border-[#23282A]/20 px-3 py-2 bg-white cursor-pointer min-h-[42px]">
      <span
        className="relative block h-6 w-6 border border-[#23282A]/25 shrink-0"
        style={{ backgroundColor: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label={label}
        />
      </span>
      <span className="flex flex-col leading-none min-w-0">
        <span className="font-mono text-[9px] uppercase text-[#23282A]/60 font-semibold">{label}</span>
        <span className="mt-1 font-mono text-[11px] font-bold text-[#23282A] uppercase truncate">{value}</span>
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
    <div
      id="tool-contrast"
      className="h-full bg-[#FAF8F5] border border-[#23282A]/15 p-4 sm:p-6 text-[#23282A] space-y-4 font-sans shadow-sm flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="border-b border-[#23282A]/12 pb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A6F0B] font-bold block">
            02 · Live WCAG Ratio Calculator
          </span>
          <h3 className="font-display text-lg font-black uppercase tracking-tight text-[#23282A] mt-0.5">
            Color Contrast &amp; Readability Utility
          </h3>
        </div>

        <p className="text-xs text-[#23282A]/75 font-sans leading-relaxed">
          Test foreground and background color pairs against WCAG readability standards to verify typographic legibility.
        </p>

        {/* Quick Brand Token Pair Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[10px]">
          {BRAND_PAIR_PRESETS.map((p) => {
            const active = fg.toLowerCase() === p.fg.toLowerCase() && bg.toLowerCase() === p.bg.toLowerCase();
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setFg(p.fg);
                  setBg(p.bg);
                }}
                className={`min-h-[34px] px-2 py-1 border uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  active
                    ? 'bg-[#23282A] text-[#D9A62E] border-[#23282A]'
                    : 'bg-[#EDE9E0]/60 text-[#23282A]/80 border-[#23282A]/15 hover:border-[#23282A]'
                }`}
              >
                <span
                  className="inline-block h-2.5 w-2.5 border border-black/20 shrink-0"
                  style={{ backgroundColor: p.bg }}
                />
                <span className="truncate">{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Swatch Preview */}
        <div
          className="flex min-h-[128px] sm:min-h-[140px] items-center justify-center px-4 py-6 sm:py-8 border border-[#23282A]/15 transition-colors duration-200"
          style={{ backgroundColor: bg, color: fg }}
        >
          <span className="text-center font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
            Make it readable.
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {/* Interactive Controls — Symmetrical Grid on Mobile */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-stretch gap-2">
          <Swatch label="Text" value={fg} onChange={setFg} />
          <Swatch label="Ground" value={bg} onChange={setBg} />
          <button
            type="button"
            onClick={() => {
              setFg(bg);
              setBg(fg);
            }}
            className="col-span-2 sm:col-span-1 min-h-[42px] flex items-center justify-center gap-1.5 border border-[#23282A]/20 bg-[#23282A] text-[#EDE9E0] px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#D9A62E] hover:text-[#141617] transition-colors"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>Swap Fore / Ground</span>
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-[#23282A]/12 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs text-[#23282A]/65">Contrast Ratio:</span>
            <span className="font-display text-xl font-black text-[#23282A]">
              {ratio.toFixed(2)}:1
            </span>
          </div>
          <span
            className={`px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
              ratio >= 4.5
                ? 'bg-[#17504A] text-[#EDE9E0]'
                : 'bg-[#8B1E1E] text-[#EDE9E0]'
            }`}
          >
            {verdict}
          </span>
        </div>
      </div>
    </div>
  );
}
