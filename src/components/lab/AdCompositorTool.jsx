import React, { useState, useRef, useEffect } from 'react';
import { Layers, Sliders, Download, Sparkles, RefreshCw } from 'lucide-react';

export default function AdCompositorTool() {
  const canvasRef = useRef(null);
  const [headline, setHeadline] = useState('BUILT FOR CONTINUOUS WORK');
  const [subline, setSubline] = useState('Deterministic Software for Operational Teams');
  const [tintOpacity, setTintOpacity] = useState(0.55);
  const [blurAmount, setBlurAmount] = useState(2);
  const [tintColor, setTintColor] = useState('#123F38');
  const [mood, setMood] = useState('calm'); // 'calm' | 'urgent'

  const handleMoodToggle = (newMood) => {
    setMood(newMood);
    if (newMood === 'urgent') {
      setHeadline('CRITICAL DISPATCH DEADLINE: 15 MIN');
      setSubline('Automated Exception Alert Triggered');
      setTintColor('#8B1E1E');
      setTintOpacity(0.75);
      setBlurAmount(4);
    } else {
      setHeadline('BUILT FOR CONTINUOUS WORK');
      setSubline('Deterministic Software for Operational Teams');
      setTintColor('#123F38');
      setTintOpacity(0.55);
      setBlurAmount(2);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw background texture gradient
    ctx.clearRect(0, 0, width, height);

    // Layer 1: Geometric Background Pattern (simulating photographic ground)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#23282A');
    bgGrad.addColorStop(0.5, '#353D40');
    bgGrad.addColorStop(1, '#1A1E1F');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Diagonal architectural grid lines
    ctx.strokeStyle = 'rgba(237, 233, 224, 0.08)';
    ctx.lineWidth = 1;
    for (let x = -width; x < width * 2; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height, height);
      ctx.stroke();
    }

    // Layer 2: Simulated Blur Overlay
    if (blurAmount > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let i = 0; i < blurAmount * 3; i++) {
        ctx.fillRect(0, 0, width, height);
      }
    }

    // Layer 3: Solid Tint Overlay with dynamic opacity
    ctx.fillStyle = tintColor;
    ctx.globalAlpha = tintOpacity;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1.0;

    // Layer 4: Architectural Frame & Grid Marks
    ctx.strokeStyle = '#D9A62E';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Small corner registration crosses
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

    // Layer 5: Typography Assembly
    ctx.fillStyle = '#EDE9E0';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('CONTEXTMUSE® / COMPOSITOR 01', 36, 48);

    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText(headline, 36, height / 2 + 10);

    ctx.font = '13px monospace';
    ctx.fillStyle = 'rgba(237, 233, 224, 0.85)';
    ctx.fillText(subline, 36, height / 2 + 42);

    // Layer 6: Call to Action Pill
    ctx.fillStyle = '#D9A62E';
    ctx.fillRect(36, height - 70, 160, 32);
    ctx.fillStyle = '#23282A';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('EXPLORE SYSTEM ↗', 50, height - 50);
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
    <div id="tool-ad-compositor" className="bg-[#1C2022] border border-[#DFDACE]/25 rounded-lg p-5 text-[#EDE9E0] space-y-4 font-sans shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFDACE]/15 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#D9A62E]" />
          <div>
            <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-[#EDE9E0]">
              Ad Layer Compositor
            </h3>
            <span className="font-mono text-[10px] text-[#DFDACE]/60">
              Interactive HTML5 Canvas Layering Utility
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded bg-[#D9A62E] text-[#1C2022] px-2 py-0.5 font-mono text-[9px] font-bold uppercase">
            Working Tool
          </span>
          <button
            onClick={handleExport}
            className="flex items-center gap-1 bg-[#23282A] text-[#EDE9E0] hover:text-[#D9A62E] px-2.5 py-1 text-xs font-mono rounded border border-[#DFDACE]/20 transition-colors"
          >
            <Download className="h-3 w-3" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-[#DFDACE]/80 font-sans leading-relaxed">
        Assemble image, typography, opacity, and blur layers into a finished ad on an interactive HTML5 canvas.
      </p>

      {/* Mood Quick Preset Switcher (Connects to the prompt: Make the same image feel calm, then urgent) */}
      <div className="flex items-center gap-2 bg-[#141617] p-2 rounded border border-[#DFDACE]/10">
        <span className="font-mono text-[10px] text-[#DFDACE]/60 uppercase font-bold">
          Emotional Stance:
        </span>
        <button
          onClick={() => handleMoodToggle('calm')}
          className={`px-2.5 py-1 font-mono text-xs rounded uppercase font-bold transition-colors ${
            mood === 'calm'
              ? 'bg-[#123F38] text-[#EDE9E0] border border-emerald-500/40'
              : 'text-[#DFDACE]/70 hover:text-[#EDE9E0]'
          }`}
        >
          Calm & Structured
        </button>
        <button
          onClick={() => handleMoodToggle('urgent')}
          className={`px-2.5 py-1 font-mono text-xs rounded uppercase font-bold transition-colors ${
            mood === 'urgent'
              ? 'bg-[#8B1E1E] text-[#EDE9E0] border border-red-500/40'
              : 'text-[#DFDACE]/70 hover:text-[#EDE9E0]'
          }`}
        >
          Urgent / High-Priority
        </button>
      </div>

      {/* Canvas Viewport */}
      <div className="flex justify-center bg-[#141617] p-3 rounded border border-[#DFDACE]/15 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={580}
          height={320}
          className="w-full max-w-[580px] h-auto shadow-2xl rounded"
        />
      </div>

      {/* Interactive Controls */}
      <div className="grid gap-3 sm:grid-cols-2 text-xs">
        <div>
          <label className="block font-mono text-[10px] uppercase text-[#DFDACE]/70 mb-1">
            Headline Layer:
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full bg-[#141617] border border-[#DFDACE]/25 px-2.5 py-1.5 rounded text-xs text-[#EDE9E0] font-sans"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase text-[#DFDACE]/70 mb-1">
            Subline Layer:
          </label>
          <input
            type="text"
            value={subline}
            onChange={(e) => setSubline(e.target.value)}
            className="w-full bg-[#141617] border border-[#DFDACE]/25 px-2.5 py-1.5 rounded text-xs text-[#EDE9E0] font-sans"
          />
        </div>

        <div>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase text-[#DFDACE]/70 mb-1">
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
            className="w-full accent-[#D9A62E]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase text-[#DFDACE]/70 mb-1">
            <span>Atmospheric Blur:</span>
            <span>{blurAmount}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={blurAmount}
            onChange={(e) => setBlurAmount(Number(e.target.value))}
            className="w-full accent-[#D9A62E]"
          />
        </div>
      </div>
    </div>
  );
}
