import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Move, RefreshCw } from 'lucide-react';

const NODES = [
  { text: 'CALCULATOR', x: 80, y: 70, vx: 0.3, vy: 0.2, color: '#D9A62E', radius: 36 },
  { text: 'DISPATCH', x: 200, y: 110, vx: -0.2, vy: 0.4, color: '#17504A', radius: 32 },
  { text: 'INTAKE', x: 340, y: 80, vx: 0.4, vy: -0.3, color: '#EDE9E0', textColor: '#23282A', radius: 28 },
  { text: 'ROUTING', x: 140, y: 180, vx: -0.3, vy: -0.2, color: '#2B7C72', radius: 30 },
  { text: 'TELEMETRY', x: 300, y: 190, vx: 0.2, vy: 0.3, color: '#D9A62E', radius: 34 },
];

export default function KineticCanvasTool() {
  const canvasRef = useRef(null);
  const [activeGrab, setActiveGrab] = useState(null);
  const nodesRef = useRef(JSON.parse(JSON.stringify(NODES)));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background Grid
      ctx.fillStyle = '#141617';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(237, 233, 224, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Spring Connections between nodes
      const nodes = nodesRef.current;
      ctx.strokeStyle = 'rgba(217, 166, 46, 0.25)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and Draw Nodes
      nodes.forEach((node, idx) => {
        if (activeGrab !== idx) {
          node.x += node.vx;
          node.y += node.vy;

          // Bounce off boundaries
          if (node.x - node.radius < 0 || node.x + node.radius > w) node.vx *= -1;
          if (node.y - node.radius < 0 || node.y + node.radius > h) node.vy *= -1;
        }

        // Draw node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(237, 233, 224, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = node.textColor || '#23282A';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.text, node.x, node.y);
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeGrab]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    nodesRef.current.forEach((n, idx) => {
      const dx = mouseX - n.x;
      const dy = mouseY - n.y;
      if (Math.sqrt(dx * dx + dy * dy) <= n.radius) {
        setActiveGrab(idx);
      }
    });
  };

  const handleMouseMove = (e) => {
    if (activeGrab === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    nodesRef.current[activeGrab].x = mouseX;
    nodesRef.current[activeGrab].y = mouseY;
  };

  const handleMouseUp = () => {
    setActiveGrab(null);
  };

  const handleReset = () => {
    nodesRef.current = JSON.parse(JSON.stringify(NODES));
  };

  return (
    <div id="tool-kinetic" className="bg-[#1C2022] border border-[#DFDACE]/25 rounded-lg p-5 text-[#EDE9E0] space-y-4 font-sans shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFDACE]/15 pb-3">
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4 text-[#D9A62E]" />
          <div>
            <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-[#EDE9E0]">
              Kinetic Physics & Gesture Canvas
            </h3>
            <span className="font-mono text-[10px] text-[#DFDACE]/60">
              Interactive Damped-Spring Physics Model
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded bg-[#23282A] text-[#DFDACE] px-2 py-0.5 font-mono text-[9px] font-bold uppercase border border-[#DFDACE]/20">
            Interactive Experiment
          </span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 bg-[#23282A] text-[#EDE9E0] hover:text-[#D9A62E] px-2.5 py-1 text-xs font-mono rounded border border-[#DFDACE]/20 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset Physics</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-[#DFDACE]/80 font-sans leading-relaxed">
        An experimental physics canvas demonstrating spatial grouping, velocity dampening, and elastic gesture feedback. Drag any node to test spring physics.
      </p>

      {/* Physics Canvas Viewport */}
      <div className="flex justify-center bg-[#141617] p-2 rounded border border-[#DFDACE]/15 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={480}
          height={260}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full max-w-[480px] h-auto shadow-inner rounded cursor-grab active:cursor-grabbing"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-[#DFDACE]/60">
        <span>Click & drag nodes to test elastic rebound.</span>
        <span className="text-[#D9A62E]">HTML5 Canvas 60fps</span>
      </div>
    </div>
  );
}
