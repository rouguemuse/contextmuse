import React, { useRef, useEffect, useState } from 'react';

export default function DrawingOverlay({
  width,
  height,
  zoom,
  tool, // 'pen' | 'highlighter' | 'eraser' | etc.
  drawings = [],
  onAddStroke,
}) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const currentPoints = useRef([]);

  const isDrawTool = tool === 'pen' || tool === 'highlighter' || tool === 'eraser';

  // Redraw all saved strokes whenever drawings change
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    drawings.forEach((stroke) => {
      if (!stroke.points || stroke.points.length < 2) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.tool === 'highlighter') {
        ctx.strokeStyle = stroke.color || 'rgba(217, 166, 46, 0.4)';
        ctx.lineWidth = stroke.size || 18;
        ctx.globalCompositeOperation = 'multiply';
      } else {
        ctx.strokeStyle = stroke.color || '#23282A';
        ctx.lineWidth = stroke.size || 3;
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.stroke();
      ctx.restore();
    });
  };

  useEffect(() => {
    redraw();
  }, [drawings, width, height]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };

  const handlePointerDown = (e) => {
    if (!isDrawTool || e.button !== 0) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    isDrawing.current = true;
    const pt = getCanvasCoords(e);
    currentPoints.current = [pt];
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current || !isDrawTool) return;
    e.stopPropagation();
    const pt = getCanvasCoords(e);
    currentPoints.current.push(pt);

    // Live preview of current stroke
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const pts = currentPoints.current;
    if (pts.length > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tool === 'highlighter') {
        ctx.strokeStyle = 'rgba(217, 166, 46, 0.4)';
        ctx.lineWidth = 18;
        ctx.globalCompositeOperation = 'multiply';
      } else {
        ctx.strokeStyle = '#23282A';
        ctx.lineWidth = 3;
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.stroke();
      ctx.restore();
    }
  };

  const handlePointerUp = (e) => {
    if (!isDrawing.current) return;
    e.stopPropagation();
    isDrawing.current = false;

    if (currentPoints.current.length > 1) {
      onAddStroke({
        tool,
        color: tool === 'highlighter' ? 'rgba(217, 166, 46, 0.45)' : '#23282A',
        size: tool === 'highlighter' ? 18 : 3,
        points: currentPoints.current,
      });
    }
    currentPoints.current = [];
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`absolute inset-0 z-20 ${
        isDrawTool ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
}
