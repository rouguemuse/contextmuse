import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RoomShell from '@/components/room/RoomShell';
import RoomHeading from '@/components/room/RoomHeading';
import BuildEntryMethods from '@/components/builds/BuildEntryMethods';
import BoardToolbar from '@/components/builds/BoardToolbar';
import BoardComposer from '@/components/builds/BoardComposer';
import BoardCanvas from '@/components/builds/BoardCanvas';
import BoardLibrary from '@/components/builds/BoardLibrary';
import BoardFooter from '@/components/builds/BoardFooter';
import BoardReview from '@/components/builds/BoardReview';
import ProjectSnapshot from '@/components/builds/ProjectSnapshot';
import TemplateGallery from '@/components/builds/TemplateGallery';
import useBoard, { BOARD_W, BOARD_H } from '@/hooks/useBoard';
import { roomById } from '@/lib/rooms';
import { useBrief } from '@/lib/BriefContext';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';

const HINTS = {
  select:
    'Select mode — drag corner handles to resize. Drag top handle to move. Double-click to edit text.',
  pen: 'Pen tool active — sketch freehand notes or arrows directly over the canvas.',
  highlighter:
    'Highlighter active (18% translucent) — draw emphasis over text or diagrams without obscuring copy.',
  highlight:
    'Highlight mode — click any piece to toggle yellow accent banner. Esc stops.',
  connect:
    'Connect mode — click two steps sequentially to create or toggle a connection arrow.',
  box: 'Box tool — click & drag a rectangle to group or isolate components.',
  circle: 'Circle tool — click & drag a circle around a focal point.',
};

export default function Builds() {
  const room = roomById('build');
  const board = useBoard();
  const { addWhiteboardClip, updateInquiry, openBrief, brief } = useBrief();

  // Active entry mode: 'map' (default) | 'describe' | 'show'
  const [entryMode, setEntryMode] = useState('map');

  // Progressive disclosure for templates gallery
  const [showTemplates, setShowTemplates] = useState(false);

  // Canvas interaction state
  const [tool, setTool] = useState('select');
  const [selected, setSelected] = useState(null);
  const [linkStart, setLinkStart] = useState(null);
  const [zoom, setZoom] = useState(0.75);
  const [snapping, setSnapping] = useState(true);
  const [review, setReview] = useState(false);
  const shotInput = useRef(null);
  const cascade = useRef(0);
  const canvasRef = useRef(null);

  const spot = useCallback(() => {
    const n = cascade.current;
    cascade.current += 1;
    return { x: 120 + (n % 6) * 48, y: 380 + (n % 5) * 42 };
  }, []);

  // Compute live step metrics for the entry methods bar
  const stepCount = useMemo(() => {
    return board.pieces.filter((p) => p.type === 'step').length;
  }, [board.pieces]);

  const bottleneckCount = useMemo(() => {
    return board.pieces.filter(
      (p) =>
        p.stepState === 'bottleneck' ||
        (p.type === 'step' && p.highlight) ||
        (p.label && /bottleneck|friction|delay|stuck/i.test(p.label))
    ).length;
  }, [board.pieces]);

  // Handle deliberate workflow reset with confirmation guard
  const handleResetWorkflow = useCallback(() => {
    const hasUserWork = board.pieces.some((p) => !p.isStarter) || board.pieces.length !== 4;
    if (hasUserWork) {
      const confirmed = window.confirm(
        'Resetting to the starter workflow will replace your current workspace with the sample demonstration steps. Do you want to proceed?'
      );
      if (!confirmed) return;
    }
    board.loadStarterWorkflow();
  }, [board]);

  // Handle deliberate board clear with confirmation guard
  const handleClearBoard = useCallback(() => {
    if (board.pieces.length > 0) {
      const confirmed = window.confirm(
        'Are you sure you want to clear all elements from your board? This can be undone with Ctrl+Z.'
      );
      if (!confirmed) return;
    }
    board.clearAll();
  }, [board]);

  // Handle updates from BoardPiece
  const changeText = useCallback(
    (id, text, updatedCols, fitMode, newLabel) => {
      const changes = { isStarter: false };
      if (text != null) changes.text = text;
      if (newLabel != null) changes.label = newLabel;
      if (updatedCols != null) changes.columns = updatedCols;
      if (fitMode != null) changes.fitMode = fitMode;
      board.updatePiece(id, changes);
    },
    [board.updatePiece]
  );

  const changeImage = useCallback(
    (id, dataUrl, filename) => {
      board.updatePiece(id, {
        fileUri: dataUrl,
        text: filename || 'Uploaded Reference',
        isStarter: false,
      });
    },
    [board.updatePiece]
  );

  const deletePiece = useCallback(
    (id) => {
      board.removePiece(id);
      setSelected(null);
    },
    [board.removePiece]
  );

  const handleIntent = useCallback(
    (id) => {
      if (!id) {
        setSelected(null);
        setLinkStart(null);
        return;
      }
      if (tool === 'highlight') {
        board.toggleHighlight(id);
        return;
      }
      if (tool === 'connect') {
        if (!linkStart) {
          setLinkStart(id);
        } else if (linkStart === id) {
          setLinkStart(null);
        } else {
          board.toggleLink(linkStart, id);
          setLinkStart(null);
        }
        return;
      }
      setSelected(id);
    },
    [board, linkStart, tool]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === 'Escape') {
        setSelected(null);
        setLinkStart(null);
        setTool('select');
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selected) {
          deletePiece(selected);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          board.redo();
        } else {
          board.undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        board.redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        if (selected) {
          e.preventDefault();
          board.duplicatePiece(selected);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, deletePiece, board]);

  // Mode 2: Describe It handler
  const handleDescribeSubmit = (text, destination) => {
    if (destination === 'inquiry') {
      const existingNotes = brief?.inquiry?.notes ? `${brief.inquiry.notes}\n\n` : '';
      updateInquiry({
        notes: `${existingNotes}[Client Description]\n${text}`.trim(),
      });
      openBrief();
    } else {
      // Place as a memo on the canvas
      const { x, y } = spot();
      const id = board.addPiece({
        type: 'note',
        x,
        y,
        w: 320,
        h: 160,
        label: 'OPERATIONAL MEMO',
        text,
        highlight: true,
        isStarter: false,
      });
      setSelected(id);
      setEntryMode('map');
      canvasRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mode 3: Show It upload handler
  const handleUploadFiles = (files) => {
    files.forEach((f) => {
      const r = new FileReader();
      r.onload = () => {
        const { x, y } = spot();
        const id = board.addPiece({
          type: 'shot',
          x,
          y,
          w: 380,
          h: 260,
          label: `REF / ${f.name.slice(0, 18).toUpperCase()}`,
          text: f.name,
          fileUri: r.result,
          fitMode: 'contain',
          highlight: false,
          isStarter: false,
        });
        setSelected(id);
      };
      r.readAsDataURL(f);
    });
    setEntryMode('map');
    setTool('pen');
    canvasRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Piece addition helpers
  const handleAddStep = () => {
    const id = board.addStep();
    setSelected(id);
  };

  const addPage = () => {
    const { x, y } = spot();
    const id = board.addPiece({
      type: 'page',
      x,
      y,
      w: 320,
      h: 200,
      label: 'CONTAINER FRAME',
      text: 'Frame Content / Architecture notes',
      columns: null,
      fitMode: 'cover',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
  };

  // Direct text addition from BoardComposer
  const addText = (text) => {
    const { x, y } = spot();
    const id = board.addPiece({
      type: 'page',
      x,
      y,
      w: 320,
      h: 170,
      label: 'TEXT NOTE / REQUIREMENT',
      text: text || 'Key requirement or note...',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
  };

  // Direct reference link addition from BoardComposer
  const addLink = (url) => {
    const { x, y } = spot();
    const id = board.addPiece({
      type: 'link',
      x,
      y,
      w: 280,
      h: 115,
      label: 'REFERENCE LINK',
      text: url,
      url,
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
  };

  const addRow = () => {
    const { x, y } = spot();
    const id = board.addPiece({
      type: 'row',
      x,
      y,
      w: 680,
      h: 180,
      label: '3-CARD WORKFLOW GROUP',
      text: 'Three-column sequential row',
      columns: [
        { id: 'c1', label: 'Step 01: Intake', text: 'Order received via email or web' },
        { id: 'c2', label: 'Step 02: Verification', text: 'Operational rules evaluation' },
        { id: 'c3', label: 'Step 03: Fulfillment', text: 'Automated invoice & calendar lock' },
      ],
      fitMode: 'cover',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
  };

  const addTwoSquares = () => {
    const { x, y } = spot();
    const id = board.addPiece({
      type: 'row',
      x,
      y,
      w: 520,
      h: 175,
      label: '2-COLUMN COMPARISON (BEFORE ↔ AFTER)',
      text: 'Two-column comparison group',
      columns: [
        { id: 'c1', label: 'Current Process / Friction', text: 'Manual bottleneck or existing pain point' },
        { id: 'c2', label: 'Target Solution / Automation', text: 'Desired software behavior or outcome' },
      ],
      fitMode: 'cover',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
  };

  const addCta = () => {
    const { x, y } = spot();
    const id = board.addPiece({
      type: 'cta',
      x,
      y,
      w: 240,
      h: 64,
      label: 'ACTION CTA',
      text: 'PRIMARY ACTION ↗',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
  };

  const addNote = () => {
    const { x, y } = spot();
    const id = board.addPiece({
      type: 'note',
      x,
      y,
      w: 240,
      h: 140,
      label: 'MEMO',
      text: 'Constraint or engineering assumption...',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
  };

  const createShape = (typeOrBox, maybeBox) => {
    const isObj = typeof typeOrBox === 'object' && typeOrBox !== null;
    const shapeType = isObj ? typeOrBox.shape || 'box' : typeOrBox;
    const box = isObj ? typeOrBox : maybeBox || { x: 140, y: 140, w: 220, h: 140 };
    board.addPiece({
      type: 'shape',
      shape: shapeType,
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      label: shapeType === 'circle' ? 'FOCUS CIRCLE' : 'GROUP CONTAINER',
      text: '',
      highlight: false,
      isStarter: false,
    });
  };

  // Place item from BoardLibrary (Stickers & Wireframe Parts Bin)
  const placeItem = (item, dropX, dropY) => {
    const fallback = spot();
    const x = typeof dropX === 'number' ? dropX : fallback.x;
    const y = typeof dropY === 'number' ? dropY : fallback.y;
    const id = board.addPiece({
      type: item.kind || item.type || 'ui',
      variant: item.variant,
      x,
      y,
      w: item.w || 280,
      h: item.h || 150,
      label: item.label || item.title || 'COMPONENT',
      text: item.desc || item.label || '',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
  };

  // Render full board (pieces + links + hand-drawn pen & 18% highlighter strokes) to PNG dataUrl
  const renderBoardDataUrl = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = BOARD_W;
      canvas.height = BOARD_H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#EDE9E0';
      ctx.fillRect(0, 0, BOARD_W, BOARD_H);

      ctx.fillStyle = '#23282A';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('CONTEXTMUSE / SYSTEM WORKFLOW SPECIFICATION', 40, 50);

      // Draw links
      (board.links || []).forEach((l) => {
        const from = board.pieces.find((p) => p.id === l.from);
        const to = board.pieces.find((p) => p.id === l.to);
        if (!from || !to) return;
        ctx.beginPath();
        ctx.moveTo(from.x + from.w / 2, from.y + from.h / 2);
        ctx.lineTo(to.x + to.w / 2, to.y + to.h / 2);
        ctx.strokeStyle = from.stepState === 'bottleneck' ? '#E53935' : '#17504A';
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      // Draw pieces
      board.pieces.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        const isBottleneck = p.stepState === 'bottleneck';
        ctx.fillStyle = isBottleneck ? '#FFF5F5' : p.type === 'note' ? '#E7C25A' : '#FFFFFF';
        ctx.strokeStyle = isBottleneck ? '#E53935' : '#23282A';
        ctx.lineWidth = isBottleneck ? 2.5 : 1.5;
        ctx.fillRect(0, 0, p.w, p.h);
        ctx.strokeRect(0, 0, p.w, p.h);
        ctx.fillStyle = isBottleneck ? '#C62828' : '#23282A';
        ctx.font = 'bold 11px monospace';
        ctx.fillText((p.label || p.variant || p.type || 'STEP').toUpperCase().slice(0, 32), 12, 22);
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#333333';
        const lines = (p.text || p.url || '').split('\n');
        lines.forEach((l, idx) => ctx.fillText(l.slice(0, 40), 12, 42 + idx * 16));
        ctx.restore();
      });

      // Draw freehand strokes
      (board.drawings || []).forEach((stroke) => {
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
          ctx.strokeStyle = 'rgba(217, 166, 46, 0.18)';
          ctx.lineWidth = stroke.size || 20;
        } else {
          ctx.strokeStyle = stroke.color || '#23282A';
          ctx.lineWidth = stroke.size || 3;
        }
        ctx.stroke();
        ctx.restore();
      });

      return canvas.toDataURL('image/png');
    } catch {
      return null;
    }
  }, [board.pieces, board.links, board.drawings]);

  // Export helpers
  const exportJson = () => {
    const data = {
      pieces: board.pieces,
      links: board.links,
      drawings: board.drawings,
      constraints: board.constraints,
      version: '3.0',
      exportedAt: new Date().toISOString(),
    };
    const str = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const a = document.createElement('a');
    a.href = str;
    a.download = `contextmuse-workflow-${Date.now().toString(36)}.json`;
    a.click();
  };

  const exportPng = () => {
    const dataUrl = renderBoardDataUrl();
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `contextmuse-workflow-${Date.now().toString(36)}.png`;
    a.click();
  };

  const importJson = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      board.load(data);
    } catch {
      alert('Unable to parse board export file.');
    }
  };

  const handleSelectTemplate = (template) => {
    if (template.seedPieces) {
      board.loadTemplate(template.id);
    }
    setEntryMode('map');
    canvasRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Attach full whiteboard snapshot + structured notes to Inquiry Brief and open drawer
  const handleIncludeWithInquiry = () => {
    const dataUrl = renderBoardDataUrl();
    const summaryLines = [
      `=== WHITEBOARD SPECIFICATION (${board.pieces.length} Elements, ${bottleneckCount} Bottlenecks) ===`,
      ...board.pieces.map(
        (p, idx) =>
          `  ${idx + 1}. [${(p.type || 'step').toUpperCase()}] ${p.label || p.variant || ''}: ${
            p.text || p.url || ''
          }`
      ),
      ...(board.drawings?.length
        ? [`  + ${board.drawings.length} freehand sketch/highlight stroke(s)`]
        : []),
    ];
    const summaryText = summaryLines.join('\n');

    addWhiteboardClip({
      title: `Workflow Map (${stepCount} Steps, ${bottleneckCount} Bottlenecks)`,
      note: summaryText,
      dataUrl,
      source: 'whiteboard',
      pagePath: '/build',
      snapshot: {
        source: 'whiteboard',
        stepCount,
        bottleneckCount,
        piecesCount: board.pieces.length,
        linksCount: (board.links || []).length,
        drawingsCount: (board.drawings || []).length,
        constraints: board.constraints || {},
        pieces: board.pieces.map((p) => ({
          id: p.id,
          type: p.type,
          variant: p.variant || null,
          label: p.label || '',
          text: p.text || '',
          url: p.url || null,
          stepState: p.stepState || null,
        })),
      },
    });

    const existingNotes = brief?.inquiry?.notes ? `${brief.inquiry.notes}\n\n` : '';
    updateInquiry({
      projectType: brief?.inquiry?.projectType || 'Apps & Tools',
      notes: `${existingNotes}${summaryText}`.trim(),
    });
    openBrief();
  };

  return (
    <RoomShell room={room}>
      <div className="flex min-h-full flex-col gap-6 px-4 pb-14 pt-7 sm:px-8 sm:pb-16 sm:pt-9 lg:px-10 max-w-7xl mx-auto w-full">
        {/* Room Header */}
        <RoomHeading
          num={room.num}
          verb={room.verb}
          badge="Custom Websites, Quoting Engines & Business Tools"
          title="Custom Builds."
          watermark={room.num}
          sub="Software designed around your business instead of forcing your team or customers to adapt to generic templates. Sketch your workflow, describe what you need, or start from a proven blueprint."
        />

        {/* ============================================================
            1. THREE DIFFERENTIATED ENTRY METHODS (ZERO FORM FATIGUE)
            ============================================================ */}
        <BuildEntryMethods
          activeMode={entryMode}
          onSelectMode={setEntryMode}
          onDescribeSubmit={handleDescribeSubmit}
          onUploadFiles={handleUploadFiles}
          onRestoreStarter={handleResetWorkflow}
          stepCount={stepCount}
          bottleneckCount={bottleneckCount}
        />

        {/* ============================================================
            2. CENTRAL VISUAL WORKSPACE (THE ACTIVE CANVAS)
            ============================================================ */}
        <section ref={canvasRef} className="space-y-3">
          {/* Canvas Toolbar */}
          <BoardToolbar
            tool={tool}
            setTool={(t) => {
              setTool(t);
              setLinkStart(null);
            }}
            zoom={zoom}
            setZoom={setZoom}
            snapping={snapping}
            setSnapping={setSnapping}
            onAddStep={handleAddStep}
            onResetWorkflow={handleResetWorkflow}
            onAddPage={addPage}
            onAddRow={addRow}
            onAddTwoSquares={addTwoSquares}
            onAddNote={addNote}
            onAddCta={addCta}
            onScreenshots={() => shotInput.current?.click()}
            onUndo={board.undo}
            onRedo={board.redo}
            canUndo={board.canUndo}
            canRedo={board.canRedo}
            onClearDrawings={board.clearDrawings}
            hasDrawings={board.drawings && board.drawings.length > 0}
            hint={HINTS[tool]}
          />

          {/* Restored Text & Reference Link Composer */}
          <BoardComposer onAddText={addText} onAddLink={addLink} />

          {/* Interactive Canvas */}
          <BoardCanvas
            pieces={board.pieces}
            links={board.links}
            drawings={board.drawings}
            selected={selected}
            linkStart={linkStart}
            zoom={zoom}
            tool={tool}
            snapping={snapping}
            onCreateShape={createShape}
            onPlace={placeItem}
            onSelect={setSelected}
            onIntent={handleIntent}
            onMove={board.moveTo}
            onResize={board.resizePiece}
            onDuplicate={board.duplicatePiece}
            onUngroup={board.ungroupRow}
            onToggleCollapse={board.toggleCollapsePiece}
            onSettle={board.settle}
            onChangeText={changeText}
            onChangeImage={changeImage}
            onHighlight={board.toggleHighlight}
            onDelete={deletePiece}
            onAddStroke={board.addDrawingStroke}
            onSetStepState={board.setPieceState}
          />

          {/* Restored Parts Bin / Stickers Library */}
          <BoardLibrary onPlace={(item) => placeItem(item)} />

          {/* Canvas Footer (Save State, Inquiry Attachment & Export) */}
          <BoardFooter
            saved={board.saved}
            onSave={board.saveNow}
            onExport={exportJson}
            onExportPng={exportPng}
            onImport={importJson}
            onReview={() => setReview(true)}
            onClear={handleClearBoard}
            onIncludeWithInquiry={handleIncludeWithInquiry}
            onAttachToBrief={handleIncludeWithInquiry}
          />
        </section>

        {/* ============================================================
            3. CORE DELIVERABLE: LIVE PROJECT SNAPSHOT
            ============================================================ */}
        <ProjectSnapshot
          pieces={board.pieces}
          links={board.links}
          constraints={board.constraints}
          onUpdateConstraints={board.updateConstraints}
          onExportPng={exportPng}
          onExportJson={exportJson}
        />

        {/* ============================================================
            4. PROGRESSIVE DISCLOSURE: OPTIONAL STARTER BLUEPRINTS
            ============================================================ */}
        <section className="mt-4 border border-[#23282A]/20 bg-[#DFDACE]/40 rounded-xl p-5 transition-all">
          <div
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center justify-between cursor-pointer select-none group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-[#23282A]/20 bg-[#EDE9E0] text-[#17504A] group-hover:border-[#17504A] transition-colors">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-tight text-[#23282A] group-hover:text-[#17504A] transition-colors">
                  Prefer a pre-built architecture? Explore 4 Starter Blueprints
                </h3>
                <p className="font-mono text-[11.5px] text-[#23282A]/70">
                  Load operational patterns for quoting engines, parametric diagnostic surveys, and booking triage.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider rounded border border-[#23282A]/30 text-[#23282A] group-hover:bg-[#23282A] group-hover:text-[#EDE9E0] transition-colors"
            >
              <span>{showTemplates ? 'Hide Blueprints' : 'Browse Blueprints'}</span>
              {showTemplates ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>

          {showTemplates && (
            <div className="mt-6 pt-6 border-t border-[#23282A]/15 animate-in fade-in duration-200">
              <TemplateGallery onSelectStartingPoint={handleSelectTemplate} />
            </div>
          )}
        </section>
      </div>

      {/* Hidden file input for toolbar image uploads */}
      <input
        ref={shotInput}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) handleUploadFiles(files);
          e.target.value = '';
        }}
        className="hidden"
      />

      {review && (
        <BoardReview
          pieces={board.pieces}
          links={board.links}
          onClose={() => setReview(false)}
          onExportJson={exportJson}
          onExportPng={exportPng}
        />
      )}
    </RoomShell>
  );
}
