import React, { useState } from 'react';
import {
  MousePointer,
  Type,
  StickyNote,
  Image as ImageIcon,
  PenTool,
  Highlighter,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Send,
  SlidersHorizontal,
  Link2,
  Sparkles,
  Square,
  Circle as CircleIcon,
  Plus,
  Layout,
  Columns,
  MousePointerClick,
  ExternalLink,
  Grid,
  Package,
  BookOpen,
} from 'lucide-react';

export default function BoardToolbar({
  tool,
  onTool,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitBoard,
  snapToGrid,
  onToggleSnap,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onAddText,
  onAddNote,
  onAddImage,
  onAddStep,
  onAddPageFrame,
  onAddTwoColRow,
  onAddThreeColRow,
  onAddCta,
  onAddRefLink,
  onClearAll,
  onOpenReview,
  onIncludeWithInquiry,
  showLibrary,
  onToggleLibrary,
  showTemplates,
  onToggleTemplates,
  hasUserContent,
}) {
  const [moreOpen, setMoreOpen] = useState(false);

  const isDrawActive = tool === 'pen' || tool === 'highlighter';

  return (
    <div className="bg-[#23282A] text-[#EDE9E0] border-b border-[#DFDACE]/15 px-3 py-2.5 sm:px-6">
      <div className="mx-auto max-w-[1440px] flex flex-col gap-2.5">
        {/* ============================================================
            PRIMARY ROW: 5 PLAIN-LANGUAGE CONTROLS + UNDO/REDO + ZOOM + MORE TOOLS
            ============================================================ */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* 5 Primary Plain-Language Tools */}
          <div
            data-testid="board-primary-toolbar"
            className="flex flex-wrap items-center gap-1.5"
          >
            {/* 1. Select / Move */}
            <button
              type="button"
              data-testid="tool-select-move"
              onClick={() => onTool('select')}
              className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors ${
                tool === 'select'
                  ? 'bg-[#D9A62E] text-[#141617] font-bold shadow-sm'
                  : 'bg-[#1B1F21] text-[#EDE9E0] hover:bg-[#EDE9E0]/10 border border-[#DFDACE]/15'
              }`}
              title="Select, move, or resize items on the board"
            >
              <MousePointer className="h-4 w-4 shrink-0" />
              <span>Select / Move</span>
            </button>

            {/* 2. Add Text */}
            <button
              type="button"
              data-testid="tool-add-text"
              onClick={onAddText}
              className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1B1F21] text-[#EDE9E0] hover:border-[#D9A62E] border border-[#DFDACE]/20 font-mono text-xs uppercase tracking-wider transition-colors"
              title="Add a plain text box to the board"
            >
              <Type className="h-4 w-4 text-[#D9A62E] shrink-0" />
              <span>Add Text</span>
            </button>

            {/* 3. Draw (with inline Pen / Highlighter sub-choice when active) */}
            <div className="flex items-center rounded-lg border border-[#DFDACE]/20 bg-[#1B1F21] p-0.5">
              <button
                type="button"
                data-testid="tool-draw"
                onClick={() => onTool(isDrawActive ? 'select' : 'pen')}
                className={`min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-colors ${
                   tool === 'pen'
                    ? 'bg-[#D9A62E] text-[#141617] font-bold'
                    : 'text-[#EDE9E0] hover:bg-[#EDE9E0]/10'
                }`}
                title="Draw freehand on the board"
              >
                <PenTool className="h-4 w-4 shrink-0" />
                <span>Draw</span>
              </button>
              <button
                type="button"
                data-testid="tool-highlighter"
                onClick={() => onTool(tool === 'highlighter' ? 'select' : 'highlighter')}
                className={`min-h-[40px] flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  tool === 'highlighter'
                    ? 'bg-[#D9A62E] text-[#141617] font-bold'
                    : 'text-[#DFDACE]/80 hover:text-[#EDE9E0]'
                }`}
                title="Translucent 18% Highlighter marker"
              >
                <Highlighter className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Highlight</span>
              </button>
            </div>

            {/* 4. Add Note */}
            <button
              type="button"
              data-testid="tool-add-note"
              onClick={onAddNote}
              className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#D9A62E]/15 text-[#D9A62E] hover:bg-[#D9A62E] hover:text-[#141617] border border-[#D9A62E]/40 font-mono text-xs font-bold uppercase tracking-wider transition-colors"
              title="Add a yellow sticky note"
            >
              <StickyNote className="h-4 w-4 shrink-0" />
              <span>Add Note</span>
            </button>

            {/* 5. Add Image */}
            <button
              type="button"
              data-testid="tool-add-image"
              onClick={onAddImage}
              className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1B1F21] text-[#EDE9E0] hover:border-[#D9A62E] border border-[#DFDACE]/20 font-mono text-xs uppercase tracking-wider transition-colors"
              title="Upload a screenshot, photo, or sketch image"
            >
              <ImageIcon className="h-4 w-4 text-[#D9A62E] shrink-0" />
              <span>Add Image</span>
            </button>

            {/* Progressive Disclosure: More Tools Toggle */}
            <button
              type="button"
              data-testid="tool-more-tools"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors border ${
                moreOpen
                  ? 'bg-[#17504A] text-[#EDE9E0] border-[#D9A62E] font-bold'
                  : 'bg-[#1B1F21] text-[#DFDACE]/85 border-[#DFDACE]/20 hover:border-[#D9A62E]'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#D9A62E] shrink-0" />
              <span>More Tools {moreOpen ? '▴' : '▾'}</span>
            </button>
          </div>

          {/* Right Side: Undo / Redo + Zoom + Include with Inquiry */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Undo / Redo */}
            <div className="flex items-center bg-[#1B1F21] rounded-lg p-0.5 border border-[#DFDACE]/15">
              <button
                type="button"
                data-testid="board-undo-btn"
                onClick={onUndo}
                disabled={!canUndo}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded hover:bg-[#EDE9E0]/10 disabled:opacity-30 transition-opacity"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                data-testid="board-redo-btn"
                onClick={onRedo}
                disabled={!canRedo}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded hover:bg-[#EDE9E0]/10 disabled:opacity-30 transition-opacity"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="h-4 w-4" />
              </button>
            </div>

            {/* Zoom & Fit Controls */}
            <div className="flex items-center bg-[#1B1F21] rounded-lg p-0.5 border border-[#DFDACE]/15">
              <button
                type="button"
                data-testid="board-zoom-out"
                onClick={onZoomOut}
                className="min-h-[40px] min-w-[38px] flex items-center justify-center rounded hover:bg-[#EDE9E0]/10"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                data-testid="board-zoom-reset"
                onClick={onZoomReset}
                className="min-h-[40px] px-2 font-mono text-[11px] text-[#EDE9E0]/90 hover:text-[#D9A62E]"
                title="Reset Zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                data-testid="board-zoom-in"
                onClick={onZoomIn}
                className="min-h-[40px] min-w-[38px] flex items-center justify-center rounded hover:bg-[#EDE9E0]/10"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              {onFitBoard && (
                <button
                  type="button"
                  data-testid="board-zoom-fit"
                  onClick={onFitBoard}
                  className="min-h-[40px] px-2.5 font-mono text-[10px] uppercase tracking-wider text-[#D9A62E] hover:bg-[#EDE9E0]/10 rounded border-l border-[#DFDACE]/15"
                  title="Fit board to screen width"
                >
                  Fit
                </button>
              )}
            </div>

            {/* Primary Action: Attach Board to Inquiry */}
            <button
              type="button"
              data-testid="board-include-inquiry-btn"
              onClick={onIncludeWithInquiry}
              className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm ${
                hasUserContent
                  ? 'bg-[#D9A62E] text-[#141617] hover:bg-[#e5b43c]'
                  : 'bg-[#17504A] text-[#EDE9E0] hover:bg-[#1e635c] border border-[#D9A62E]/40'
              }`}
              title="Attach your whiteboard sketch and notes to your inquiry"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Attach to Inquiry</span>
            </button>
          </div>
        </div>

        {/* ============================================================
            SECONDARY DRAWER ("MORE TOOLS"): ALL ADVANCED / POWER CAPABILITIES
            ============================================================ */}
        {moreOpen && (
          <div
            data-testid="board-more-tools-panel"
            className="rounded-lg border border-[#DFDACE]/20 bg-[#1B1F21] p-3 flex flex-col gap-3 animate-fadeIn"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DFDACE]/10 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#D9A62E] font-bold">
                Additional Layout, Diagram &amp; Export Tools
              </span>
              <span className="font-sans text-xs text-[#DFDACE]/65">
                Optional tools for connecting steps, grouping sections, or using UI stickers
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Connect two ideas */}
              <button
                type="button"
                data-testid="tool-connect-ideas"
                onClick={() => onTool(tool === 'connect' ? 'select' : 'connect')}
                className={`min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors ${
                  tool === 'connect'
                    ? 'bg-[#D9A62E] text-[#141617] border-[#D9A62E] font-bold'
                    : 'bg-[#23282A] text-[#EDE9E0] border-[#DFDACE]/20 hover:border-[#D9A62E]'
                }`}
              >
                <Link2 className="h-3.5 w-3.5" />
                <span>Connect Two Ideas</span>
              </button>

              {/* Highlight / Emphasize card */}
              <button
                type="button"
                data-testid="tool-emphasize-card"
                onClick={() => onTool(tool === 'highlight' ? 'select' : 'highlight')}
                className={`min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors ${
                  tool === 'highlight'
                    ? 'bg-[#D9A62E] text-[#141617] border-[#D9A62E] font-bold'
                    : 'bg-[#23282A] text-[#EDE9E0] border-[#DFDACE]/20 hover:border-[#D9A62E]'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Mark Important Card</span>
              </button>

              {/* Group Shapes: Box & Circle */}
              <button
                type="button"
                data-testid="tool-shape-box"
                onClick={() => onTool(tool === 'box' ? 'select' : 'box')}
                className={`min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors ${
                  tool === 'box'
                    ? 'bg-[#D9A62E] text-[#141617] border-[#D9A62E] font-bold'
                    : 'bg-[#23282A] text-[#EDE9E0] border-[#DFDACE]/20 hover:border-[#D9A62E]'
                }`}
              >
                <Square className="h-3.5 w-3.5" />
                <span>Draw Box</span>
              </button>

              <button
                type="button"
                data-testid="tool-shape-circle"
                onClick={() => onTool(tool === 'circle' ? 'select' : 'circle')}
                className={`min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors ${
                  tool === 'circle'
                    ? 'bg-[#D9A62E] text-[#141617] border-[#D9A62E] font-bold'
                    : 'bg-[#23282A] text-[#EDE9E0] border-[#DFDACE]/20 hover:border-[#D9A62E]'
                }`}
              >
                <CircleIcon className="h-3.5 w-3.5" />
                <span>Draw Circle</span>
              </button>

              <span className="text-[#DFDACE]/20 hidden sm:inline">|</span>

              {/* Structured Blocks */}
              <button
                type="button"
                data-testid="tool-add-step"
                onClick={onAddStep}
                className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#17504A] text-[#EDE9E0] hover:bg-[#1e635c] font-mono text-xs uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3.5 w-3.5 text-[#D9A62E]" />
                <span>+ Process Step</span>
              </button>

              <button
                type="button"
                data-testid="tool-add-page-frame"
                onClick={onAddPageFrame}
                className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#23282A] border border-[#DFDACE]/20 hover:border-[#D9A62E] font-mono text-xs uppercase tracking-wider transition-colors"
              >
                <Layout className="h-3.5 w-3.5 text-[#D9A62E]" />
                <span>+ Page Section</span>
              </button>

              <button
                type="button"
                data-testid="tool-add-2col"
                onClick={onAddTwoColRow}
                className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#23282A] border border-[#DFDACE]/20 hover:border-[#D9A62E] font-mono text-xs uppercase tracking-wider transition-colors"
              >
                <Columns className="h-3.5 w-3.5 text-[#D9A62E]" />
                <span>+ 2-Column Compare</span>
              </button>

              <button
                type="button"
                data-testid="tool-add-3col"
                onClick={onAddThreeColRow}
                className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#23282A] border border-[#DFDACE]/20 hover:border-[#D9A62E] font-mono text-xs uppercase tracking-wider transition-colors"
              >
                <Columns className="h-3.5 w-3.5 text-[#D9A62E]" />
                <span>+ 3-Column Row</span>
              </button>

              <button
                type="button"
                data-testid="tool-add-cta"
                onClick={onAddCta}
                className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#23282A] border border-[#DFDACE]/20 hover:border-[#D9A62E] font-mono text-xs uppercase tracking-wider transition-colors"
              >
                <MousePointerClick className="h-3.5 w-3.5 text-[#D9A62E]" />
                <span>+ Action Button</span>
              </button>

              <button
                type="button"
                data-testid="tool-add-link"
                onClick={onAddRefLink}
                className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#23282A] border border-[#DFDACE]/20 hover:border-[#D9A62E] font-mono text-xs uppercase tracking-wider transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#D9A62E]" />
                <span>+ Reference Link</span>
              </button>
            </div>

            {/* Bottom row of More Tools: Parts Bin, Templates, Grid Snap, Full Sheet, Clear */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#DFDACE]/10">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  data-testid="toggle-parts-bin"
                  onClick={onToggleLibrary}
                  className={`min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors ${
                    showLibrary
                      ? 'bg-[#D9A62E] text-[#141617] border-[#D9A62E] font-bold'
                      : 'bg-[#23282A] text-[#EDE9E0] border-[#DFDACE]/20 hover:border-[#D9A62E]'
                  }`}
                >
                  <Package className="h-3.5 w-3.5" />
                  <span>{showLibrary ? 'Hide UI Stickers' : 'UI Stickers & Parts Bin'}</span>
                </button>

                <button
                  type="button"
                  data-testid="toggle-blueprints"
                  onClick={onToggleTemplates}
                  className={`min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors ${
                    showTemplates
                      ? 'bg-[#D9A62E] text-[#141617] border-[#D9A62E] font-bold'
                      : 'bg-[#23282A] text-[#EDE9E0] border-[#DFDACE]/20 hover:border-[#D9A62E]'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{showTemplates ? 'Hide Blueprints' : 'More Example Blueprints'}</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleSnap}
                  className={`min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors ${
                    snapToGrid
                      ? 'bg-[#17504A] text-[#EDE9E0] border-[#17504A]'
                      : 'bg-[#23282A] text-[#EDE9E0]/60 border-[#DFDACE]/15'
                  }`}
                >
                  <Grid className="h-3.5 w-3.5" />
                  <span>Grid Snap: {snapToGrid ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenReview}
                  className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#DFDACE]/25 bg-[#23282A] text-[#EDE9E0] hover:border-[#D9A62E] font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Inspect Full Sheet</span>
                </button>

                <button
                  type="button"
                  data-testid="board-clear-btn"
                  onClick={onClearAll}
                  className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded border border-red-400/30 bg-[#23282A] text-[#EDE9E0]/80 hover:text-red-300 hover:border-red-400 font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear Board</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
