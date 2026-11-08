import React, { useCallback, useState } from 'react';
import { BOARD_W, BOARD_H } from '@/hooks/useBoard';
import { PIECE_MIME } from '@/components/builds/buildLibrary';
import Connections from '@/components/builds/Connections';
import BoardPiece from '@/components/builds/BoardPiece';
import DrawingOverlay from '@/components/builds/DrawingOverlay';

export default function BoardCanvas({
  pieces,
  links,
  drawings = [],
  selected,
  linkStart,
  zoom,
  tool,
  snapping = true,
  onSelect,
  onIntent,
  onMove,
  onResize,
  onDuplicate,
  onUngroup,
  onToggleCollapse,
  onSettle,
  onChangeText,
  onChangeImage,
  onHighlight,
  onDelete,
  onCreateShape,
  onPlace,
  onAddStroke,
  onSetStepState,
}) {
  const [drag, setDrag] = useState(null);
  const [draft, setDraft] = useState(null);
  const drawingShape = tool === 'box' || tool === 'circle';

  const at = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: (e.clientX - r.left) / zoom, y: (e.clientY - r.top) / zoom };
  };

  const boardDown = (e) => {
    // If clicking on empty canvas, deselect
    if (e.target === e.currentTarget || e.target.classList.contains('dotgrid')) {
      onIntent(null);
    }
    if (!drawingShape || e.button !== 0) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const p = at(e);
    setDraft({ x0: p.x, y0: p.y, x1: p.x, y1: p.y });
  };

  const boardMove = (e) => {
    if (!draft) return;
    const p = at(e);
    setDraft((d) => (d ? { ...d, x1: p.x, y1: p.y } : d));
  };

  const boardUp = () => {
    if (!draft) return;
    const x = Math.min(draft.x0, draft.x1);
    const y = Math.min(draft.y0, draft.y1);
    const w = Math.abs(draft.x1 - draft.x0);
    const h = Math.abs(draft.y1 - draft.y0);
    setDraft(null);
    if (w > 16 && h > 16) onCreateShape({ shape: tool, x, y, w, h });
  };

  const boardDrop = (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData(PIECE_MIME);
    if (!raw) return;
    let item;
    try {
      item = JSON.parse(raw);
    } catch {
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    onPlace(item, (e.clientX - r.left) / zoom - item.w / 2, (e.clientY - r.top) / zoom - item.h / 2);
  };

  const box = draft
    ? {
        x: Math.min(draft.x0, draft.x1),
        y: Math.min(draft.y0, draft.y1),
        w: Math.abs(draft.x1 - draft.x0),
        h: Math.abs(draft.y1 - draft.y0),
      }
    : null;

  const pagesAndRows = pieces.filter((p) => p.type === 'page' || p.type === 'row');
  const rest = pieces.filter((p) => p.type !== 'page' && p.type !== 'row');
  const ordered = [...pagesAndRows, ...rest];
  const current = pieces.find((p) => p.id === selected);

  const offsetFor = (piece) => {
    if (!drag) return null;
    return piece.id === drag.id || piece.parentId === drag.id ? drag : null;
  };

  const handleDrag = useCallback(
    (id, dx, dy) => {
      // Optional snapping
      if (snapping) {
        dx = Math.round(dx / 12) * 12;
        dy = Math.round(dy / 12) * 12;
      }
      setDrag({ id, dx, dy });
    },
    [snapping]
  );

  const endDrag = useCallback(
    (id, moved) => {
      const d = drag;
      const piece = pieces.find((p) => p.id === id);
      setDrag(null);
      if (moved && d && piece) {
        let finalX = Math.max(0, piece.x + d.dx);
        let finalY = Math.max(0, piece.y + d.dy);
        if (snapping) {
          finalX = Math.round(finalX / 12) * 12;
          finalY = Math.round(finalY / 12) * 12;
        }
        onMove(id, finalX, finalY);
        onSettle(id);
      } else if (!moved) {
        onIntent(id);
      }
    },
    [drag, pieces, onMove, onSettle, onIntent, snapping]
  );

  return (
    <div className="relative border border-[#23282A]/25 bg-[#C9C3B2] shadow-inner rounded-sm overflow-hidden">
      {/* Board Top Status & Layout Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#23282A]/15 bg-[#DFDACE] px-3 py-1.5 text-xs font-mono text-[#23282A]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#17504A]">LAYOUT EDITOR</span>
          <span className="text-[#23282A]/50">|</span>
          <span className="text-[#23282A]/70 hidden sm:inline">
            Drag corner handles to resize. Drag from top grip to move. Click × to delete.
          </span>
        </div>
        {current && (
          <div className="flex items-center gap-2">
            <span className="bg-[#23282A] text-white px-2 py-0.5 text-[10px] uppercase font-bold rounded">
              Selected: {current.type}
            </span>
            {current.type === 'row' && (
              <button
                onClick={() => onUngroup(current.id)}
                className="bg-[#17504A] text-white px-2 py-0.5 text-[10px] uppercase tracking-wider rounded font-bold hover:bg-[#23282A] transition-colors"
              >
                Ungroup Columns
              </button>
            )}
            <button
              onClick={() => onDuplicate(current.id)}
              className="border border-[#23282A]/30 px-2 py-0.5 text-[10px] uppercase tracking-wider hover:bg-[#D9A62E] transition-colors rounded"
            >
              Duplicate
            </button>
            <button
              onClick={() => onHighlight(current.id)}
              className="border border-[#23282A]/30 px-2 py-0.5 text-[10px] uppercase tracking-wider hover:bg-[#D9A62E] transition-colors rounded"
            >
              {current.highlight ? 'Clear Highlight' : 'Highlight'}
            </button>
            <button
              onClick={() => onDelete(current.id)}
              className="border border-red-400 bg-red-100 text-red-900 px-2 py-0.5 text-[10px] uppercase tracking-wider hover:bg-red-200 transition-colors rounded font-bold"
            >
              × Delete
            </button>
          </div>
        )}
      </div>

      <div
        className="no-scrollbar overflow-auto overscroll-contain p-3"
        style={{ height: 'clamp(400px, 60vh, 640px)' }}
      >
        <div style={{ width: BOARD_W * zoom, height: BOARD_H * zoom }}>
          <div
            className={`dotgrid relative origin-top-left shadow-[4px_4px_0_rgba(35,40,42,0.12)] border border-[#23282A]/20 ${
              drawingShape ? 'cursor-crosshair touch-none' : ''
            }`}
            style={{
              width: BOARD_W,
              height: BOARD_H,
              transform: `scale(${zoom})`,
              backgroundColor: '#EDE9E0',
            }}
            onPointerDown={boardDown}
            onPointerMove={boardMove}
            onPointerUp={boardUp}
            onPointerCancel={boardUp}
            onDragOver={(e) => e.preventDefault()}
            onDrop={boardDrop}
          >
            {/* Visual Connections */}
            <Connections pieces={pieces} links={links} />

            {/* Placed Pieces */}
            {ordered.map((piece) => (
              <BoardPiece
                key={piece.id}
                piece={piece}
                zoom={zoom}
                selected={selected === piece.id || linkStart === piece.id}
                pending={linkStart === piece.id}
                offset={offsetFor(piece)}
                drawMode={drawingShape || tool === 'pen' || tool === 'highlighter'}
                onSelect={onSelect}
                onDrag={handleDrag}
                onDragEnd={endDrag}
                onResize={onResize}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onUngroup={onUngroup}
                onToggleCollapse={onToggleCollapse}
                onChangeText={onChangeText}
                onChangeImage={onChangeImage}
                onSetStepState={onSetStepState}
              />
            ))}

            {/* Hand-Drawn Pen & Highlighter Overlay */}
            <DrawingOverlay
              width={BOARD_W}
              height={BOARD_H}
              zoom={zoom}
              tool={tool}
              drawings={drawings}
              onAddStroke={onAddStroke}
            />

            {/* Rectangle or Circle Shape Draft */}
            {box && (
              <div
                className={`pointer-events-none absolute border-2 border-[#D9A62E] ${
                  tool === 'circle' ? 'rounded-full' : 'rounded-sm'
                }`}
                style={{
                  left: box.x,
                  top: box.y,
                  width: box.w,
                  height: box.h,
                  backgroundColor: 'rgba(217,166,46,0.12)',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
