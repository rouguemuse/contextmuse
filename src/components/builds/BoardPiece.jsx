import { memo, useRef } from 'react';
import ShotImage from '@/components/builds/ShotImage';
import PosterArrow from '@/components/builds/PosterArrow';
import UiPiece from '@/components/builds/UiPiece';
import {
  X,
  Copy,
  Split,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from 'lucide-react';

function GripHandle({ light }) {
  return (
    <div
      data-testid="piece-drag-grip"
      className="flex items-center gap-[3px] py-1.5 px-2 cursor-grab active:cursor-grabbing opacity-70 hover:opacity-100 transition-opacity"
      title="Drag to move"
    >
      {[0, 1, 2].map((col) => (
        <div key={col} className="flex flex-col gap-[3px]">
          <span
            className="block h-[3px] w-[3px] rounded-full"
            style={{ backgroundColor: light ? '#EDE9E0' : '#23282A' }}
          />
          <span
            className="block h-[3px] w-[3px] rounded-full"
            style={{ backgroundColor: light ? '#EDE9E0' : '#23282A' }}
          />
        </div>
      ))}
    </div>
  );
}

function Band() {
  return (
    <span
      className="pointer-events-none absolute left-2 right-2 h-[18px] bg-[#D9A62E]/70 mix-blend-multiply rounded-sm"
      style={{ top: '44%', transform: 'rotate(-0.8deg)' }}
    />
  );
}

function BoardPiece({
  piece,
  zoom,
  selected,
  pending,
  offset,
  drawMode,
  onSelect,
  onDrag,
  onDragEnd,
  onResize,
  onDelete,
  onDuplicate,
  onUngroup,
  onToggleCollapse,
  onChangeText,
  onChangeImage,
  onSetStepState,
}) {
  const active = useRef(false);
  const moved = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef(null);

  // Resize tracking ref
  const resizing = useRef(null);

  const onPointerDown = (e) => {
    // If clicking directly into textarea, input, or action button, don't drag card
    if (e.target.closest('textarea,input,a,button,.no-drag')) {
      onSelect(piece.id);
      e.stopPropagation();
      return;
    }
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    active.current = true;
    moved.current = false;
    start.current = { x: e.clientX, y: e.clientY };
    onSelect(piece.id);
  };

  const onPointerMove = (e) => {
    if (!active.current) return;
    const dx = (e.clientX - start.current.x) / zoom;
    const dy = (e.clientY - start.current.y) / zoom;
    if (!moved.current && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) moved.current = true;
    if (moved.current) onDrag(piece.id, dx, dy);
  };

  const finish = () => {
    if (!active.current) return;
    active.current = false;
    onDragEnd(piece.id, moved.current);
  };

  // Resize handler start
  const startResize = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(piece.id);
    resizing.current = {
      direction,
      startX: e.clientX,
      startY: e.clientY,
      initialW: piece.w,
      initialH: piece.h,
      initialX: piece.x,
      initialY: piece.y,
    };

    const handleResizeMove = (moveEvent) => {
      if (!resizing.current) return;
      const { direction, startX, startY, initialW, initialH, initialX, initialY } = resizing.current;
      const dx = (moveEvent.clientX - startX) / zoom;
      const dy = (moveEvent.clientY - startY) / zoom;

      let newW = initialW;
      let newH = initialH;
      let newX = initialX;
      let newY = initialY;

      const isImage = piece.type === 'shot';
      const aspectRatio = initialW / initialH;

      if (direction.includes('e')) newW = Math.max(80, initialW + dx);
      if (direction.includes('s')) newH = Math.max(50, initialH + dy);
      if (direction.includes('w')) {
        const potentialW = initialW - dx;
        if (potentialW >= 80) {
          newW = potentialW;
          newX = initialX + dx;
        }
      }
      if (direction.includes('n')) {
        const potentialH = initialH - dy;
        if (potentialH >= 50) {
          newH = potentialH;
          newY = initialY + dy;
        }
      }

      // Preserve proportions on corner resize of images
      if (isImage && (direction === 'se' || direction === 'ne' || direction === 'sw' || direction === 'nw')) {
        newH = Math.round(newW / aspectRatio);
      }

      onResize(piece.id, newW, newH, newX, newY);
    };

    const handleResizeUp = () => {
      resizing.current = null;
      window.removeEventListener('pointermove', handleResizeMove);
      window.removeEventListener('pointerup', handleResizeUp);
    };

    window.addEventListener('pointermove', handleResizeMove);
    window.addEventListener('pointerup', handleResizeUp);
  };

  // Image file drop handler
  const handleImageDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChangeImage(piece.id, event.target.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Image file upload handler
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChangeImage(piece.id, event.target.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Image paste handler
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          onChangeImage(piece.id, event.target.result, 'Pasted Image');
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  };

  const z = offset ? 'z-40' : selected ? 'z-30' : 'z-10';

  return (
    <div
      data-testid={`board-piece-${piece.id}`}
      data-piece-type={piece.type}
      data-is-starter={piece.isStarter ? 'true' : 'false'}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finish}
      onPointerCancel={finish}
      onPaste={handlePaste}
      tabIndex={0}
      style={{
        left: piece.x,
        top: piece.y,
        width: piece.w,
        height: piece.collapsed ? 44 : piece.h,
        transform: `translate3d(${offset ? offset.dx : 0}px, ${offset ? offset.dy : 0}px, 0)`,
        willChange: offset ? 'transform' : 'auto',
      }}
      className={`absolute touch-none select-none outline-none ${z} ${
        drawMode ? 'pointer-events-none' : offset ? 'cursor-grabbing' : ''
      }`}
    >
      {/* Selected Bounding Box & Touch-Friendly Handles */}
      {selected && (
        <>
          <div
            className="pointer-events-none absolute -inset-[2px] border-2 rounded-xs"
            style={{ borderColor: pending ? '#17504A' : '#D9A62E' }}
          />

          {/* Floating Action Badge: Duplicate, Collapse, Ungroup, Delete (touch-friendly, positioned clear of NE corner resize handle) */}
          <div className="absolute -top-12 right-5 z-[60] flex items-center gap-1 bg-[#23282A] text-white px-1.5 py-1 rounded shadow-md font-mono text-[10px]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(piece.id);
              }}
              title="Duplicate (Ctrl+D)"
              className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded hover:text-[#D9A62E] transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse(piece.id);
              }}
              title={piece.collapsed ? 'Expand contents' : 'Collapse contents'}
              className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded hover:text-[#D9A62E] transition-colors"
            >
              {piece.collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>
            {piece.type === 'row' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUngroup(piece.id);
                }}
                title="Ungroup row into individual cards"
                className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded text-[#D9A62E] hover:text-white transition-colors"
              >
                <Split className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              data-testid={`delete-piece-${piece.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(piece.id);
              }}
              title="Delete (Delete / Backspace)"
              className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded text-red-400 hover:text-red-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 8 Resize Handles with 44x44px touch targets on corners */}
          {!piece.collapsed && (
            <>
              {/* Corner Handles (44x44 touch hit zone with visible 14x14 square) */}
              <div
                data-testid={`resize-nw-${piece.id}`}
                onPointerDown={(e) => startResize(e, 'nw')}
                className="no-drag absolute -top-5 -left-5 h-11 w-11 flex items-center justify-center cursor-nwse-resize z-50 touch-none"
                title="Drag corner to resize"
              >
                <span className="block h-3.5 w-3.5 bg-[#D9A62E] border-2 border-[#23282A] rounded-xs shadow-xs" />
              </div>
              <div
                data-testid={`resize-ne-${piece.id}`}
                onPointerDown={(e) => startResize(e, 'ne')}
                className="no-drag absolute -top-5 -right-5 h-11 w-11 flex items-center justify-center cursor-nesw-resize z-50 touch-none"
                title="Drag corner to resize"
              >
                <span className="block h-3.5 w-3.5 bg-[#D9A62E] border-2 border-[#23282A] rounded-xs shadow-xs" />
              </div>
              <div
                data-testid={`resize-se-${piece.id}`}
                onPointerDown={(e) => startResize(e, 'se')}
                className="no-drag absolute -bottom-5 -right-5 h-11 w-11 flex items-center justify-center cursor-nwse-resize z-50 touch-none"
                title="Drag corner to resize"
              >
                <span className="block h-3.5 w-3.5 bg-[#D9A62E] border-2 border-[#23282A] rounded-xs shadow-xs" />
              </div>
              <div
                data-testid={`resize-sw-${piece.id}`}
                onPointerDown={(e) => startResize(e, 'sw')}
                className="no-drag absolute -bottom-5 -left-5 h-11 w-11 flex items-center justify-center cursor-nesw-resize z-50 touch-none"
                title="Drag corner to resize"
              >
                <span className="block h-3.5 w-3.5 bg-[#D9A62E] border-2 border-[#23282A] rounded-xs shadow-xs" />
              </div>

              {/* Edge Handles */}
              <div
                onPointerDown={(e) => startResize(e, 'n')}
                className="no-drag absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-11 flex items-center justify-center cursor-ns-resize z-50 touch-none"
              >
                <span className="block h-2 w-5 bg-[#D9A62E] border border-[#23282A] rounded-xs" />
              </div>
              <div
                onPointerDown={(e) => startResize(e, 's')}
                className="no-drag absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-11 flex items-center justify-center cursor-ns-resize z-50 touch-none"
              >
                <span className="block h-2 w-5 bg-[#D9A62E] border border-[#23282A] rounded-xs" />
              </div>
              <div
                onPointerDown={(e) => startResize(e, 'w')}
                className="no-drag absolute -left-3 top-1/2 -translate-y-1/2 h-11 w-6 flex items-center justify-center cursor-ew-resize z-50 touch-none"
              >
                <span className="block h-5 w-2 bg-[#D9A62E] border border-[#23282A] rounded-xs" />
              </div>
              <div
                onPointerDown={(e) => startResize(e, 'e')}
                className="no-drag absolute -right-3 top-1/2 -translate-y-1/2 h-11 w-6 flex items-center justify-center cursor-ew-resize z-50 touch-none"
              >
                <span className="block h-5 w-2 bg-[#D9A62E] border border-[#23282A] rounded-xs" />
              </div>
            </>
          )}
        </>
      )}

      {/* Subtle corner resize indicator even when not selected so users know items are resizable */}
      {!selected && !piece.collapsed && !drawMode && (
        <div
          onPointerDown={(e) => startResize(e, 'se')}
          className="no-drag absolute -bottom-3 -right-3 h-9 w-9 flex items-center justify-center cursor-nwse-resize z-20 touch-none opacity-60 hover:opacity-100"
          title="Drag corner to resize"
        >
          <span className="block h-2.5 w-2.5 border-r-2 border-b-2 border-[#23282A]/60" />
        </div>
      )}

      {/* PIECE TYPE: PLAIN TEXT BOX ('text') */}
      {piece.type === 'text' && (
        <div className="relative flex h-full w-full flex-col overflow-hidden border-2 border-[#23282A]/25 bg-[#FAF8F5] p-3 text-[#23282A] shadow-[3px_3px_0_rgba(35,40,42,0.12)] rounded-sm">
          {piece.highlight && <Band />}
          <div className="relative flex items-center justify-between border-b border-[#23282A]/10 pb-1 min-h-[28px] cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#23282A]/75">
                {piece.label || 'TEXT NOTE'}
              </span>
              {piece.isStarter && (
                <span className="rounded bg-[#23282A]/10 px-1.5 py-0.5 font-mono text-[8.5px] uppercase text-[#23282A]/70">
                  Example
                </span>
              )}
            </div>
            <GripHandle />
          </div>
          {!piece.collapsed && (
            <textarea
              value={piece.text || ''}
              onChange={(e) => onChangeText(piece.id, e.target.value)}
              onPointerDown={(e) => e.stopPropagation()}
              placeholder="Click here to type your idea or text…"
              className="no-drag relative mt-1.5 w-full flex-1 resize-none bg-transparent font-sans text-xs sm:text-sm font-medium leading-relaxed outline-none placeholder:text-[#23282A]/40"
            />
          )}
        </div>
      )}

      {/* PIECE TYPE 0: WORKFLOW PROCESS STEP */}
      {piece.type === 'step' && (
        <div
          className={`relative flex h-full w-full flex-col overflow-hidden p-3.5 shadow-md rounded-sm transition-all duration-200 ${
            piece.stepState === 'bottleneck'
              ? 'bg-[#FEF2F2] border-2 border-dashed border-red-500 text-red-950 shadow-red-200/50'
              : piece.stepState === 'decision'
              ? 'bg-[#F2F7F6] border-2 border-[#17504A] text-[#17504A]'
              : piece.stepState === 'improvement'
              ? 'bg-[#ECFDF5] border-2 border-emerald-600 text-emerald-950'
              : 'bg-[#FAF8F5] border border-[#23282A]/30 text-[#23282A]'
          }`}
        >
          {/* Header Bar with State Badge & Drag Grip */}
          <div className="relative flex items-center justify-between border-b border-black/10 pb-1.5 min-h-[28px] cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold">
              {piece.stepState === 'bottleneck' ? (
                <span className="flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded text-[9.5px] uppercase tracking-wider shadow-xs">
                  <span>⚠️ BOTTLENECK</span>
                </span>
              ) : piece.stepState === 'decision' ? (
                <span className="flex items-center gap-1 bg-[#17504A] text-white px-2 py-0.5 rounded text-[9.5px] uppercase tracking-wider">
                  <span>◇ DECISION</span>
                </span>
              ) : piece.stepState === 'improvement' ? (
                <span className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded text-[9.5px] uppercase tracking-wider">
                  <span>★ AUTOMATE</span>
                </span>
              ) : (
                <span className="bg-[#23282A] text-white px-2 py-0.5 rounded text-[9.5px] uppercase tracking-wider">
                  <span>STEP</span>
                </span>
              )}
              {piece.isStarter && (
                <span className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[8.5px] uppercase text-black/70">
                  Example
                </span>
              )}
            </div>
            <GripHandle light={false} />
          </div>

          {!piece.collapsed && (
            <>
              {/* Direct Title Editing */}
              <input
                type="text"
                value={piece.label || ''}
                onChange={(e) => onChangeText(piece.id, null, null, null, e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                placeholder="Step Name (e.g. 01 / Intake)"
                className="no-drag mt-2 w-full bg-transparent font-mono text-xs font-bold uppercase tracking-wider outline-none border-b border-black/10 pb-0.5"
              />

              {/* Direct Description Editing */}
              <textarea
                value={piece.text || ''}
                onChange={(e) => onChangeText(piece.id, e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                placeholder={
                  piece.stepState === 'bottleneck'
                    ? 'What gets stuck or takes too long here?'
                    : 'Describe what happens at this step…'
                }
                className="no-drag relative mt-2 w-full flex-1 resize-none bg-transparent font-sans text-xs font-medium leading-relaxed outline-none placeholder:text-black/35"
              />

              {/* Contextual State Selector (Appears when selected) */}
              {selected && (
                <div className="no-drag mt-2 pt-2 border-t border-black/10 flex flex-wrap items-center justify-between gap-1 font-mono text-[9px]">
                  <span className="text-black/50 uppercase font-bold">Tag:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetStepState && onSetStepState(piece.id, 'normal');
                      }}
                      className={`px-1.5 py-1 rounded transition-colors ${
                        !piece.stepState || piece.stepState === 'normal'
                          ? 'bg-[#23282A] text-white font-bold'
                          : 'bg-black/10 text-black/70 hover:bg-black/20'
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetStepState && onSetStepState(piece.id, 'bottleneck');
                      }}
                      className={`px-1.5 py-1 rounded transition-colors ${
                        piece.stepState === 'bottleneck'
                          ? 'bg-red-600 text-white font-bold'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      ⚠️ Slow / Manual
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetStepState && onSetStepState(piece.id, 'decision');
                      }}
                      className={`px-1.5 py-1 rounded transition-colors ${
                        piece.stepState === 'decision'
                          ? 'bg-[#17504A] text-white font-bold'
                          : 'bg-teal-100 text-[#17504A] hover:bg-teal-200'
                      }`}
                    >
                      ◇ Decision
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetStepState && onSetStepState(piece.id, 'improvement');
                      }}
                      className={`px-1.5 py-1 rounded transition-colors ${
                        piece.stepState === 'improvement'
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      ★ Automate
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* PIECE TYPE 1: PAGE FRAME / SECTION */}
      {piece.type === 'page' && (
        <div className="relative flex h-full w-full flex-col overflow-hidden border border-[#23282A]/20 bg-[#DFDACE] p-3 text-[#23282A] shadow-[2px_2px_0_rgba(35,40,42,0.12)] transition-shadow duration-300 hover:shadow-[5px_6px_0_rgba(35,40,42,0.16)] rounded-sm">
          {piece.highlight && <Band />}
          {/* Header Drag Handle */}
          <div className="relative flex items-center justify-between border-b border-[#23282A]/10 pb-1 min-h-[28px] cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#17504A]">
                {piece.label || 'PAGE SECTION'}
              </span>
              {piece.isStarter && (
                <span className="rounded bg-[#23282A]/10 px-1.5 py-0.5 font-mono text-[8.5px] uppercase text-[#23282A]/70">
                  Example
                </span>
              )}
            </div>
            <GripHandle />
          </div>

          {!piece.collapsed && (
            <>
              <textarea
                value={piece.text || ''}
                onChange={(e) => onChangeText(piece.id, e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                placeholder="Describe what goes in this section…"
                className="no-drag relative mt-2 w-full flex-1 resize-none bg-transparent font-sans text-xs font-medium leading-relaxed outline-none placeholder:text-[#23282A]/40"
              />
              <span className="relative mt-auto font-mono text-[9px] text-[#23282A]/50 uppercase tracking-widest pt-1 border-t border-[#23282A]/10 flex justify-between">
                <span>Page Section</span>
                <span className="tabular-nums">{Math.round(piece.w)}×{Math.round(piece.h)}</span>
              </span>
            </>
          )}
        </div>
      )}

      {/* PIECE TYPE 2: ADAPTIVE MULTI-COLUMN ROW */}
      {piece.type === 'row' && (
        <div className="relative flex h-full w-full flex-col overflow-hidden border-2 border-dashed border-[#17504A]/50 bg-[#DFDACE]/70 p-3 text-[#23282A] shadow-md rounded-sm">
          {/* Row Drag Handle & Actions */}
          <div className="flex items-center justify-between border-b border-[#23282A]/15 pb-1.5 min-h-[28px] cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#17504A]">
                {piece.label || 'MULTI-COLUMN SECTION'}
              </span>
              <span className="rounded bg-[#17504A] text-white px-1.5 py-0.2 font-mono text-[9px]">
                {piece.columns?.length || 3} Columns
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUngroup(piece.id);
                }}
                className="no-drag text-[10px] font-mono font-bold text-[#17504A] hover:underline px-1"
                title="Ungroup row into individual cards"
              >
                Split ⇥
              </button>
              <GripHandle />
            </div>
          </div>

          {!piece.collapsed && (
            <div className="mt-2 grid grid-flow-col auto-cols-fr gap-2.5 flex-1 min-h-0">
              {piece.columns?.map((col, idx) => (
                <div
                  key={col.id || idx}
                  className="flex flex-col justify-between p-2.5 bg-[#EDE9E0] border border-[#23282A]/20 rounded shadow-xs"
                >
                  <span className="font-mono text-[9.5px] uppercase font-bold text-[#17504A] border-b border-[#23282A]/10 pb-1">
                    {col.label || `COLUMN ${idx + 1}`}
                  </span>
                  <textarea
                    value={col.text || ''}
                    onChange={(e) => {
                      const updatedCols = [...piece.columns];
                      updatedCols[idx] = { ...updatedCols[idx], text: e.target.value };
                      onChangeText(piece.id, null, updatedCols);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    placeholder="Column content…"
                    className="no-drag mt-1.5 w-full flex-1 resize-none bg-transparent font-sans text-[11px] leading-relaxed outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PIECE TYPE 3: STICKY NOTE */}
      {piece.type === 'note' && (
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#E7C25A] p-3 text-[#23282A] shadow-[2px_2px_0_rgba(35,40,42,0.14)] transition-shadow duration-300 hover:shadow-[5px_6px_0_rgba(35,40,42,0.18)] rounded-sm">
          {piece.highlight && <Band />}
          <div className="relative flex items-center justify-between border-b border-black/10 pb-1 min-h-[28px] cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider font-bold opacity-80">
                {piece.label || 'STICKY NOTE'}
              </span>
              {piece.isStarter && (
                <span className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[8px] uppercase text-black/75">
                  Example
                </span>
              )}
            </div>
            <GripHandle />
          </div>
          {!piece.collapsed && (
            <textarea
              value={piece.text || ''}
              onChange={(e) => onChangeText(piece.id, e.target.value)}
              onPointerDown={(e) => e.stopPropagation()}
              placeholder="Write a quick note or idea…"
              className="no-drag relative mt-1.5 w-full flex-1 resize-none bg-transparent font-sans text-xs font-semibold leading-snug outline-none placeholder:text-[#23282A]/50"
            />
          )}
        </div>
      )}

      {/* PIECE TYPE 4: IMAGE PLACEHOLDER WITH FIT / FILL / CROP CONTROLS */}
      {piece.type === 'shot' && (
        <div
          onDrop={handleImageDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex h-full w-full flex-col overflow-hidden border border-[#23282A]/25 bg-[#23282A] text-[#EDE9E0] rounded-sm shadow-lg"
        >
          {/* Header Bar */}
          <div className="relative flex items-center justify-between px-2.5 py-1.5 min-h-[30px] bg-[#1F2325] cursor-grab active:cursor-grabbing">
            <span className="font-mono text-[9px] uppercase tracking-wider truncate text-[#D9A62E]">
              {piece.text || 'IMAGE / SCREENSHOT'}
            </span>
            <GripHandle light />
          </div>

          {/* Image Display or Drop/Upload Prompt */}
          <div className="relative min-h-0 flex-1 overflow-hidden bg-[#181B1C] flex flex-col justify-center items-center">
            {piece.fileUri ? (
              <>
                <img
                  src={piece.fileUri}
                  alt={piece.text || 'Reference'}
                  className={`w-full h-full pointer-events-none select-none ${
                    piece.fitMode === 'contain' ? 'object-contain' : 'object-cover'
                  }`}
                />
                {/* Fit / Fill / Replace Toolbar */}
                {selected && (
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-[9.5px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChangeText(piece.id, null, null, 'cover');
                        }}
                        className={`px-1.5 py-0.5 rounded ${
                          piece.fitMode !== 'contain' ? 'bg-[#D9A62E] text-black font-bold' : 'text-white/70'
                        }`}
                      >
                        Fill
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChangeText(piece.id, null, null, 'contain');
                        }}
                        className={`px-1.5 py-0.5 rounded ${
                          piece.fitMode === 'contain' ? 'bg-[#D9A62E] text-black font-bold' : 'text-white/70'
                        }`}
                      >
                        Fit
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="text-[#D9A62E] hover:underline"
                    >
                      Replace
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="p-3 text-center space-y-2">
                <ImageIcon className="h-6 w-6 text-[#DFDACE]/40 mx-auto" />
                <p className="font-mono text-[9px] text-[#DFDACE]/60 uppercase">
                  Drop Image Here or Upload
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="no-drag min-h-[36px] bg-[#DFDACE]/15 hover:bg-[#D9A62E] hover:text-[#23282A] text-white px-3 py-1.5 font-mono text-[10px] rounded transition-colors"
                >
                  Choose Image
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* PIECE TYPE 5: ACTION BUTTON CTA */}
      {piece.type === 'cta' && (
        <div className="flex h-full w-full items-center justify-between gap-2 bg-[#23282A] px-3.5 text-[#EDE9E0] shadow-[2px_2px_0_rgba(35,40,42,0.28)] transition-shadow duration-300 hover:shadow-[5px_6px_0_rgba(35,40,42,0.34)] rounded-sm border border-[#DFDACE]/20 cursor-grab active:cursor-grabbing">
          <input
            type="text"
            value={piece.text || ''}
            onChange={(e) => onChangeText(piece.id, e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
            placeholder="Button text (e.g. Get a Quote)"
            className="no-drag flex-1 bg-transparent font-mono text-xs font-bold uppercase tracking-wider text-[#EDE9E0] outline-none truncate"
          />
          <GripHandle light />
        </div>
      )}

      {/* PIECE TYPE 6: REFERENCE LINK */}
      {piece.type === 'link' && (
        <div className="flex h-full w-full flex-col overflow-hidden border border-[#17504A]/40 bg-[#17504A] text-[#EDE9E0] rounded-sm shadow-md">
          <div className="flex items-start justify-between px-2.5 pt-2 min-h-[28px] cursor-grab active:cursor-grabbing">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#D9A62E]">
              {piece.label || 'REFERENCE LINK'}
            </span>
            <GripHandle light />
          </div>
          <div className="min-h-0 flex-1 px-2.5 pb-2 flex flex-col justify-between">
            <textarea
              value={piece.text || ''}
              onChange={(e) => onChangeText(piece.id, e.target.value)}
              onPointerDown={(e) => e.stopPropagation()}
              placeholder="Paste a website link or note what you like about it…"
              className="no-drag w-full flex-1 resize-none bg-transparent font-sans text-xs text-[#EDE9E0] outline-none placeholder:text-[#EDE9E0]/50"
            />
            {piece.url && (
              <button
                type="button"
                onClick={() => window.open(piece.url, '_blank', 'noopener')}
                className="no-drag self-start mt-1 border border-[#EDE9E0]/30 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider hover:bg-[#EDE9E0] hover:text-[#17504A] transition-colors rounded"
              >
                Open ↗
              </button>
            )}
          </div>
        </div>
      )}

      {piece.type === 'arrow' && <PosterArrow variant={piece.variant} />}
      {piece.type === 'ui' && <UiPiece variant={piece.variant} />}
      {piece.type === 'shape' && (
        <div
          className={`h-full w-full border-2 border-[#D9A62E] ${
            piece.shape === 'circle' ? 'rounded-full' : 'rounded-sm'
          }`}
          style={{ backgroundColor: 'rgba(217,166,46,0.12)' }}
        />
      )}
    </div>
  );
}

export default memo(BoardPiece);
