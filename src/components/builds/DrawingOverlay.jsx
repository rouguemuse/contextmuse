import React, { useRef, useEffect, useCallback } from 'react';

const HIGHLIGHTER_COLOR = 'rgba(217, 166, 46, 0.18)';
const PEN_COLOR = '#23282A';

export default function DrawingOverlay({
  width,
  height,
  zoom = 1,
  tool, // 'pen' | 'highlighter' | 'eraser' | etc.
  drawings = [],
  onAddStroke,
  penColor = PEN_COLOR,
  highlighterColor = HIGHLIGHTER_COLOR,
}) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const currentPoints = useRef([]);

  const isDrawTool = tool === 'pen' || tool === 'highlighter' || tool === 'eraser';

  const renderPath = useCallback(
    (ctx, points, strokeTool, customColor, customSize) => {
      if (!points || points.length < 2) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'source-over';

      if (strokeTool === 'highlighter') {
        // Enforce translucent 18% opacity so underlying text remains 100% legible
        const isLegacyOpaque =
          !customColor ||
          customColor.includes('0.4') ||
          customColor.includes('0.45') ||
          customColor.includes('0.5');
        ctx.strokeStyle = isLegacyOpaque ? highlighterColor : customColor;
        ctx.lineWidth = customSize || 20;
      } else {
        ctx.strokeStyle = customColor || penColor;
        ctx.lineWidth = customSize || 3;
      }

      ctx.stroke();
      ctx.restore();
    },
    [highlighterColor, penColor]
  );

  // Redraw all saved strokes (plus active in-flight stroke if any) without compounding alpha
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    drawings.forEach((stroke) => {
      renderPath(ctx, stroke.points, stroke.tool, stroke.color, stroke.size);
    });

    if (isDrawing.current && currentPoints.current.length > 1) {
      renderPath(
        ctx,
        currentPoints.current,
        tool,
        tool === 'highlighter' ? highlighterColor : penColor,
        tool === 'highlighter' ? 20 : 3
      );
    }
  }, [drawings, width, height, renderPath, tool, highlighterColor, penColor]);

  useEffect(() => {
    redraw();
  }, [redraw]);

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
    if (!isDrawTool) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
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
    redraw();
  };

  const handlePointerUp = (e) => {
    if (!isDrawing.current) return;
    e.stopPropagation();
    isDrawing.current = false;

    if (currentPoints.current.length > 1) {
      onAddStroke({
        tool,
        color: tool === 'highlighter' ? highlighterColor : penColor,
        size: tool === 'highlighter' ? 20 : 3,
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
      style={{ touchAction: isDrawTool ? 'none' : 'auto' }}
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
