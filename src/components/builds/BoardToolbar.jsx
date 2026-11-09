import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Camera,
  Circle,
  Copy,
  Grid,
  Highlighter,
  Layers,
  Link2,
  Minus,
  MousePointer,
  PenTool,
  Plus,
  RectangleHorizontal,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Split,
  Square,
  SquareDashed,
  StickyNote,
  Trash2,
  Workflow,
} from 'lucide-react';
import { SPRING } from '@/lib/motion';

const baseBtn =
  'relative flex items-center gap-1.5 px-2.5 py-2 text-[10.5px] uppercase tracking-[0.14em] transition-colors duration-200';

function ToolButton({ active, fill, icon, label, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      transition={SPRING}
      className={`${baseBtn} ${
        active
          ? fill === '#D9A62E'
            ? 'text-[#23282A] font-bold'
            : 'text-bone font-bold'
          : 'hover:bg-bone hover:text-[#23282A]'
      }`}
    >
      {active && (
        <motion.span
          layoutId="board-tool-active"
          className="absolute inset-0"
          style={{ backgroundColor: fill }}
          transition={SPRING}
        />
      )}
      <span className="relative flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </motion.button>
  );
}

export default function BoardToolbar({
  tool,
  setTool,
  zoom,
  setZoom,
  snapping,
  setSnapping,
  onAddStep,
  onResetWorkflow,
  onAddPage,
  onAddRow,
  onAddTwoSquares,
  onAddNote,
  onAddCta,
  onScreenshots,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClearDrawings,
  hasDrawings,
  hint,
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-px bg-[#23282A] p-px text-bone">
        {/* Primary Workflow Creator Button */}
        {onAddStep && (
          <button
            onClick={onAddStep}
            title="Add a new workflow process step"
            className={`${baseBtn} bg-[#D9A62E] text-[#141617] font-bold hover:bg-[#e0b240]`}
          >
            <Workflow className="h-3.5 w-3.5" /> + Step
          </button>
        )}

        {/* Secondary Layout Items */}
        <button
          onClick={onAddNote}
          title="Add sticky memo"
          className={`${baseBtn} hover:bg-bone hover:text-[#23282A]`}
        >
          <StickyNote className="h-3.5 w-3.5" /> + Sticky Note
        </button>
        <button
          onClick={onScreenshots}
          title="Attach screenshot or sketch"
          className={`${baseBtn} hover:bg-bone hover:text-[#23282A]`}
        >
          <Camera className="h-3.5 w-3.5" /> Image
        </button>
        <button
          onClick={onAddPage}
          title="Add container frame"
          className={`${baseBtn} hover:bg-bone hover:text-[#23282A]`}
        >
          <Square className="h-3.5 w-3.5" /> Frame
        </button>
        <button
          onClick={onAddRow}
          title="Add 3-column row"
          className={`${baseBtn} hover:bg-bone hover:text-[#23282A]`}
        >
          <Split className="h-3.5 w-3.5 text-[#D9A62E]" /> 3-Col
        </button>
        {onAddTwoSquares && (
          <button
            onClick={onAddTwoSquares}
            title="Add 2-column comparison block"
            className={`${baseBtn} hover:bg-bone hover:text-[#23282A]`}
          >
            <Layers className="h-3.5 w-3.5 text-[#D9A62E]" /> + Compare
          </button>
        )}
        {onAddCta && (
          <button
            onClick={onAddCta}
            title="Add action button / CTA"
            className={`${baseBtn} hover:bg-bone hover:text-[#23282A]`}
          >
            <ArrowUpRight className="h-3.5 w-3.5 text-[#D9A62E]" /> + CTA
          </button>
        )}

        {onResetWorkflow && (
          <button
            onClick={onResetWorkflow}
            title="Restore Starter Workflow (Input → Process → Output)"
            className={`${baseBtn} text-[#D9A62E] hover:bg-[#D9A62E]/20`}
          >
            <RefreshCw className="h-3 w-3" /> Starter Flow
          </button>
        )}

        <span className="mx-1 hidden h-5 w-px bg-bone/25 sm:block" />

        {/* Selection & Drawing Tools */}
        <ToolButton
          active={tool === 'select'}
          fill="#DFDACE"
          icon={<MousePointer className="h-3.5 w-3.5" />}
          label="Select"
          onClick={() => setTool('select')}
        />
        <ToolButton
          active={tool === 'pen'}
          fill="#D9A62E"
          icon={<PenTool className="h-3.5 w-3.5" />}
          label="Pen"
          onClick={() => setTool(tool === 'pen' ? 'select' : 'pen')}
        />
        <ToolButton
          active={tool === 'highlighter'}
          fill="#D9A62E"
          icon={<Highlighter className="h-3.5 w-3.5" />}
          label="Highlighter"
          onClick={() => setTool(tool === 'highlighter' ? 'select' : 'highlighter')}
        />
        <ToolButton
          active={tool === 'box'}
          fill="#D9A62E"
          icon={<RectangleHorizontal className="h-3.5 w-3.5" />}
          label="Box"
          onClick={() => setTool(tool === 'box' ? 'select' : 'box')}
        />
        <ToolButton
          active={tool === 'circle'}
          fill="#D9A62E"
          icon={<Circle className="h-3.5 w-3.5" />}
          label="Circle"
          onClick={() => setTool(tool === 'circle' ? 'select' : 'circle')}
        />
        <ToolButton
          active={tool === 'connect'}
          fill="#2B7C72"
          icon={<SquareDashed className="h-3.5 w-3.5" />}
          label="Connect"
          onClick={() => setTool(tool === 'connect' ? 'select' : 'connect')}
        />

        {/* Alignment Snapping Toggle */}
        <button
          onClick={() => setSnapping(!snapping)}
          title="Toggle alignment grid snapping"
          className={`${baseBtn} ${snapping ? 'text-[#D9A62E] font-bold' : 'opacity-60 hover:opacity-100'}`}
        >
          <Grid className="h-3.5 w-3.5" /> {snapping ? 'Snap: ON' : 'Snap: OFF'}
        </button>

        {/* Undo / Redo */}
        <span className="mx-1 hidden h-5 w-px bg-bone/25 sm:block" />
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className={`${baseBtn} hover:bg-bone hover:text-[#23282A] disabled:opacity-30`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className={`${baseBtn} hover:bg-bone hover:text-[#23282A] disabled:opacity-30`}
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>

        {hasDrawings && (
          <button
            onClick={onClearDrawings}
            title="Clear hand-drawn strokes"
            className={`${baseBtn} text-red-300 hover:bg-red-900 hover:text-white`}
          >
            <Trash2 className="h-3.5 w-3.5" /> Strokes
          </button>
        )}

        {/* Zoom Controls */}
        <div className="ml-auto flex items-center gap-px">
          <button
            onClick={() => setZoom((z) => Math.max(0.4, Math.round((z - 0.05) * 100) / 100))}
            aria-label="Zoom out"
            className={`${baseBtn} hover:bg-bone hover:text-[#23282A]`}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="px-2 text-[10.5px] tabular-nums tracking-[0.14em]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.5, Math.round((z + 0.05) * 100) / 100))}
            aria-label="Zoom in"
            className={`${baseBtn} hover:bg-bone hover:text-[#23282A]`}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {hint && (
        <div className="border-t border-[#DFDACE]/20 bg-[#181B1C] px-3 py-1.5 text-[11px] font-mono text-[#DFDACE]/70 flex items-center justify-between">
          <span>{hint}</span>
          <span className="text-[10px] text-[#D9A62E]">Press Esc for Select • Del to remove</span>
        </div>
      )}
    </div>
  );
}
