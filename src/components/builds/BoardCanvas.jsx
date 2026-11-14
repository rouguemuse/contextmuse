import React, { useCallback, useState } from 'react';
import { BOARD_W, BOARD_H } from '@/hooks/useBoard';
import { PIECE_MIME } from '@/components/builds/buildLibrary';
import Connections from '@/components/builds/Connections';
import BoardPiece from '@/components/builds/BoardPiece';
import DrawingOverlay from '@/components/builds/DrawingOverlay';
import { Type, StickyNote, PenTool, Image as ImageIcon } from 'lucide-react';

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
  onQuickAddText,
  onQuickAddNote,
  onQuickStartDraw,
  onQuickAddImage,
}) {
  const [drag, setDrag] = useState(null);
  const [draft, setDraft] = useState(null);
  const drawingShape = tool === 'box' || tool === 'circle';
  const isDrawingTool = drawingShape || tool === 'pen' || tool === 'highlighter';

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
  const isEmpty = pieces.length === 0 && drawings.length === 0;

  const offsetFor = (piece) => {
    if (!drag) return null;
    return piece.id === drag.id || piece.parentId === drag.id ? drag : null;
  };

  const handleDrag = useCallback(
    (id, dx, dy) => {
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
      {/* Board Top Status & Contextual Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#23282A]/15 bg-[#DFDACE] px-3 py-2 text-xs font-mono text-[#23282A]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-[#17504A]">WHITEBOARD</span>
          <span className="text-[#23282A]/40">|</span>
          <span className="text-[#23282A]/75 text-[11px]">
            {isDrawingTool
              ? 'Drawing active: drag across the board to sketch. Tap "Select / Move" when done.'
              : 'Tap any text to edit. Drag top bar to move. Drag corner square to resize.'}
          </span>
        </div>
        {current && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-[#23282A] text-white px-2 py-1 text-[10px] uppercase font-bold rounded">
              Selected: {current.type}
            </span>
            {current.type === 'row' && (
              <button
                type="button"
                onClick={() => onUngroup(current.id)}
                className="min-h-[34px] bg-[#17504A] text-white px-2.5 py-1 text-[10px] uppercase tracking-wider rounded font-bold hover:bg-[#23282A] transition-colors"
              >
                Split Columns
              </button>
            )}
            <button
              type="button"
              onClick={() => onDuplicate(current.id)}
              className="min-h-[34px] border border-[#23282A]/30 px-2.5 py-1 text-[10px] uppercase tracking-wider hover:bg-[#D9A62E] transition-colors rounded"
            >
              Duplicate
            </button>
            <button
              type="button"
              onClick={() => onHighlight(current.id)}
              className="min-h-[34px] border border-[#23282A]/30 px-2.5 py-1 text-[10px] uppercase tracking-wider hover:bg-[#D9A62E] transition-colors rounded"
            >
              {current.highlight ? 'Unmark' : 'Mark Important'}
            </button>
            <button
              type="button"
              onClick={() => onDelete(current.id)}
              className="min-h-[34px] border border-red-400 bg-red-100 text-red-900 px-2.5 py-1 text-[10px] uppercase tracking-wider hover:bg-red-200 transition-colors rounded font-bold"
            >
              × Delete
            </button>
          </div>
        )}
      </div>

      {/* Calm, Obvious First-Action Guidance When Board Is Blank */}
      {isEmpty && !isDrawingTool && (
        <div
          data-testid="empty-board-guidance"
          className="pointer-events-none absolute inset-x-4 top-14 z-20 flex justify-center"
        >
          <div className="pointer-events-auto max-w-xl w-full rounded-xl border-2 border-[#23282A]/25 bg-[#FAF8F5]/95 backdrop-blur-xs p-4 sm:p-5 shadow-md text-[#23282A]">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#17504A] font-bold">
              Blank Board — Ready for Your Ideas
            </div>
            <h4 className="mt-1 font-display text-lg sm:text-xl font-bold text-[#23282A]">
              Start anywhere — there&apos;s no wrong way to use this space.
            </h4>
            <p className="mt-1 font-sans text-xs sm:text-sm text-[#23282A]/75 leading-relaxed">
              Add a note or text box, sketch freehand, or drop in a screenshot. You can move or undo anything, and click <strong>Attach to Inquiry</strong> when you&apos;re ready.
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {onQuickAddNote && (
                <button
                  type="button"
                  data-testid="empty-board-add-note"
                  onClick={onQuickAddNote}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-lg bg-[#D9A62E] text-[#141617] px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#e5b43c] transition-colors"
                >
                  <StickyNote className="h-3.5 w-3.5" />
                  <span>+ Add a Sticky Note</span>
                </button>
              )}
              {onQuickAddText && (
                <button
                  type="button"
                  data-testid="empty-board-add-text"
                  onClick={onQuickAddText}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-lg border border-[#23282A]/30 bg-[#EDE9E0] text-[#23282A] px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:border-[#23282A] transition-colors"
                >
                  <Type className="h-3.5 w-3.5" />
                  <span>+ Add Text Box</span>
                </button>
              )}
              {onQuickStartDraw && (
                <button
                  type="button"
                  data-testid="empty-board-start-draw"
                  onClick={onQuickStartDraw}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-lg border border-[#23282A]/30 bg-[#EDE9E0] text-[#23282A] px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:border-[#23282A] transition-colors"
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>Draw Freehand</span>
                </button>
              )}
              {onQuickAddImage && (
                <button
                  type="button"
                  data-testid="empty-board-add-image"
                  onClick={onQuickAddImage}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-lg border border-[#23282A]/30 bg-[#EDE9E0] text-[#23282A] px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:border-[#23282A] transition-colors"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Add Image</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        data-testid="board-scroll-container"
        className={`no-scrollbar overflow-auto overscroll-contain p-2 sm:p-3 ${
          isDrawingTool ? 'touch-none' : 'touch-pan-x touch-pan-y'
        }`}
        style={{ height: 'clamp(420px, 62vh, 660px)' }}
      >
        <div style={{ width: BOARD_W * zoom, height: BOARD_H * zoom }}>
          <div
            data-testid="board-surface"
            className={`dotgrid relative origin-top-left shadow-[4px_4px_0_rgba(35,40,42,0.12)] border border-[#23282A]/20 ${
              isDrawingTool ? 'cursor-crosshair touch-none' : ''
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
                drawMode={isDrawingTool}
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
