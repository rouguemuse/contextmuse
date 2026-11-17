import React, { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function AdCompositorTool() {
  const canvasRef = useRef(null);
  const [headline, setHeadline] = useState('BUILT FOR CONTINUOUS WORK');
  const [subline, setSubline] = useState('Deterministic Software for Operational Teams');
  const [tintOpacity, setTintOpacity] = useState(0.55);
  const [blurAmount, setBlurAmount] = useState(1);
  const [tintColor, setTintColor] = useState('#123F38');
  const [mood, setMood] = useState('calm'); // 'calm' | 'urgent'

  const handleMoodToggle = (newMood) => {
    setMood(newMood);
    if (newMood === 'urgent') {
      setHeadline('CRITICAL DISPATCH DEADLINE: 15 MIN');
      setSubline('Automated Exception Alert Triggered');
      setTintColor('#8B1E1E');
      setTintOpacity(0.75);
      setBlurAmount(2);
    } else {
      setHeadline('BUILT FOR CONTINUOUS WORK');
      setSubline('Deterministic Software for Operational Teams');
      setTintColor('#123F38');
      setTintOpacity(0.55);
      setBlurAmount(1);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const maxTextWidth = width - 72;

    ctx.clearRect(0, 0, width, height);

    // Layer 1 & 2: Geometric Background Pattern with controlled gentle blur
    ctx.save();
    if (blurAmount > 0) {
      ctx.filter = `blur(${(blurAmount * 0.45).toFixed(2)}px)`;
    }
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#23282A');
    bgGrad.addColorStop(0.5, '#353D40');
    bgGrad.addColorStop(1, '#1A1E1F');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Diagonal architectural grid lines
    ctx.strokeStyle = 'rgba(237, 233, 224, 0.14)';
    ctx.lineWidth = 1.25;
    for (let x = -width; x < width * 2; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height, height);
      ctx.stroke();
    }
    ctx.restore();

    // Layer 3: Solid Tint Overlay with dynamic opacity
    ctx.fillStyle = tintColor;
    ctx.globalAlpha = tintOpacity;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1.0;

    // Layer 4: Architectural Frame & Grid Marks
    ctx.strokeStyle = '#D9A62E';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    const cross = (cx, cy) => {
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy);
      ctx.lineTo(cx + 5, cy);
      ctx.moveTo(cx, cy - 5);
      ctx.lineTo(cx, cy + 5);
      ctx.stroke();
    };
    cross(30, 30);
    cross(width - 30, 30);
    cross(30, height - 30);
    cross(width - 30, height - 30);

    // Layer 5: Typography Assembly (Auto-fitting headline for mobile & desktop legibility)
    ctx.fillStyle = '#D9A62E';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('CONTEXTMUSE® / COMPOSITOR 01', 36, 52);

    ctx.fillStyle = '#EDE9E0';
    let fontSize = 26;
    ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
    while (ctx.measureText(headline).width > maxTextWidth && fontSize > 16) {
      fontSize -= 1;
      ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
    }
    ctx.fillText(headline, 36, height / 2 + 6, maxTextWidth);

    ctx.font = '14px monospace';
    ctx.fillStyle = 'rgba(237, 233, 224, 0.9)';
    ctx.fillText(subline, 36, height / 2 + 38, maxTextWidth);

    // Layer 6: Call to Action Pill
    ctx.fillStyle = '#D9A62E';
    ctx.fillRect(36, height - 74, 184, 36);
    ctx.fillStyle = '#23282A';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('EXPLORE SYSTEM ↗', 52, height - 51);
  }, [headline, subline, tintOpacity, blurAmount, tintColor]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `contextmuse-ad-compositor-${Date.now().toString(36)}.png`;
    a.click();
  };

  return (
    <div
      id="tool-ad-compositor"
      className="h-full bg-[#FAF8F5] border border-[#23282A]/15 p-4 sm:p-6 text-[#23282A] space-y-4 font-sans shadow-sm flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#23282A]/12 pb-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A6F0B] font-bold block">
              01 · HTML5 Canvas Layering Utility
            </span>
            <h3 className="font-display text-lg font-black uppercase tracking-tight text-[#23282A] mt-0.5">
              Ad Layer Compositor
            </h3>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="w-full sm:w-auto min-h-[40px] flex items-center justify-center gap-1.5 bg-[#23282A] text-[#EDE9E0] hover:bg-[#D9A62E] hover:text-[#141617] px-3.5 py-2 text-xs font-mono uppercase tracking-wider font-bold transition-colors"
          >
            <Download className="h-3.5 w-3.5 shrink-0" />
            <span>Export PNG</span>
          </button>
        </div>

        <p className="text-xs text-[#23282A]/75 font-sans leading-relaxed">
          Assemble image, typography, opacity, and blur layers into a finished composition on an interactive HTML5 canvas.
        </p>

        {/* Mood Quick Preset Switcher — Symmetrical 2-Button Grid on Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#EDE9E0]/70 p-2.5 border border-[#23282A]/12">
          <span className="font-mono text-[10px] text-[#23282A]/70 uppercase font-bold px-0.5">
            Preset Stance:
          </span>
          <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleMoodToggle('calm')}
              className={`min-h-[38px] px-2.5 py-1.5 font-mono text-[11px] uppercase font-bold border transition-colors ${
                mood === 'calm'
                  ? 'bg-[#23282A] text-[#EDE9E0] border-[#23282A]'
                  : 'bg-[#FAF8F5] text-[#23282A]/75 border-[#23282A]/20 hover:text-[#23282A]'
              }`}
            >
              Calm &amp; Structured
            </button>
            <button
              type="button"
              onClick={() => handleMoodToggle('urgent')}
              className={`min-h-[38px] px-2.5 py-1.5 font-mono text-[11px] uppercase font-bold border transition-colors ${
                mood === 'urgent'
                  ? 'bg-[#8B1E1E] text-[#EDE9E0] border-[#8B1E1E]'
                  : 'bg-[#FAF8F5] text-[#23282A]/75 border-[#23282A]/20 hover:text-[#23282A]'
              }`}
            >
              Urgent / Priority
            </button>
          </div>
        </div>

        {/* Canvas Viewport */}
        <div className="flex justify-center bg-[#141617] p-2 sm:p-3 border border-[#23282A]/15 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={580}
            height={320}
            className="w-full max-w-[580px] h-auto block"
          />
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid gap-3 sm:grid-cols-2 text-xs pt-2">
        <div>
          <label className="block font-mono text-[10px] uppercase text-[#23282A]/65 mb-1 font-semibold">
            Headline Layer:
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full min-h-[38px] bg-white border border-[#23282A]/20 px-2.5 py-1.5 text-xs text-[#23282A] font-sans focus:border-[#23282A] focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase text-[#23282A]/65 mb-1 font-semibold">
            Subline Layer:
          </label>
          <input
            type="text"
            value={subline}
            onChange={(e) => setSubline(e.target.value)}
            className="w-full min-h-[38px] bg-white border border-[#23282A]/20 px-2.5 py-1.5 text-xs text-[#23282A] font-sans focus:border-[#23282A] focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase text-[#23282A]/65 mb-1 font-semibold">
            <span>Tint Layer Opacity:</span>
            <span>{Math.round(tintOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.95"
            step="0.05"
            value={tintOpacity}
            onChange={(e) => setTintOpacity(Number(e.target.value))}
            className="w-full h-6 accent-[#23282A] cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase text-[#23282A]/65 mb-1 font-semibold">
            <span>Atmospheric Blur:</span>
            <span>{blurAmount}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="8"
            step="0.5"
            value={blurAmount}
            onChange={(e) => setBlurAmount(Number(e.target.value))}
            className="w-full h-6 accent-[#23282A] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
