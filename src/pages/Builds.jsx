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
import {
  Layout,
  StickyNote,
  GitBranch,
  FilePlus2,
  X,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function getInitialZoom() {
  if (typeof window === 'undefined') return 0.75;
  const w = window.innerWidth;
  if (w < 420) return 0.48;
  if (w < 768) return 0.58;
  if (w < 1100) return 0.68;
  return 0.75;
}

export default function Builds() {
  const room = roomById('build');
  const board = useBoard();
  const { addWhiteboardClip, updateInquiry, openBrief, openPageMarkup, brief } = useBrief();

  // Check if visitor already has real (non-starter) work on their board
  const hasUserContent = useMemo(() => {
    const hasUserPieces = board.pieces.some((p) => !p.isStarter);
    const hasDrawings = (board.drawings || []).length > 0;
    const hasConstraints = Boolean((board.constraints || '').trim());
    return hasUserPieces || hasDrawings || hasConstraints;
  }, [board.pieces, board.drawings, board.constraints]);

  // Progressive disclosure: Whiteboard only opens when chosen (or if visitor already has saved user work)
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(() => {
    return (
      board.pieces.some((p) => !p.isStarter) ||
      (board.drawings || []).length > 0 ||
      Boolean((board.constraints || '').trim())
    );
  });

  // Track active starter choice ('blank' | 'website' | 'ideas' | 'process')
  const [starterMode, setStarterMode] = useState('blank');

  // Progressive disclosure for secondary drawers inside whiteboard
  const [showLibrary, setShowLibrary] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [attachNotice, setAttachNotice] = useState('');

  // Canvas interaction state
  const [tool, setTool] = useState('select');
  const [selected, setSelected] = useState(null);
  const [linkStart, setLinkStart] = useState(null);
  const [zoom, setZoom] = useState(getInitialZoom);
  const [snapping, setSnapping] = useState(true);
  const [review, setReview] = useState(false);
  const shotInput = useRef(null);
  const cascade = useRef(0);
  const canvasRef = useRef(null);

  // Place new pieces near the top-left visible area so mobile and desktop users see them immediately
  const spot = useCallback(() => {
    const n = cascade.current;
    cascade.current += 1;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const baseX = isMobile ? 24 : 50;
    const baseY = isMobile ? 64 : 80;
    return {
      x: baseX + (n % 4) * (isMobile ? 24 : 44),
      y: baseY + (n % 5) * (isMobile ? 32 : 40),
    };
  }, []);

  // Only include non-starter pieces when serializing for an inquiry
  const userPieces = useMemo(() => {
    return board.pieces.filter((p) => !p.isStarter);
  }, [board.pieces]);

  const stepCount = useMemo(() => {
    return userPieces.filter((p) => p.type === 'step').length;
  }, [userPieces]);

  const bottleneckCount = useMemo(() => {
    return userPieces.filter(
      (p) =>
        p.stepState === 'bottleneck' ||
        (p.type === 'step' && p.highlight) ||
        (p.label && /bottleneck|friction|delay|stuck/i.test(p.label))
    ).length;
  }, [userPieces]);

  const handleOpenWhiteboard = useCallback(() => {
    setIsWhiteboardOpen(true);
    setTimeout(() => {
      canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, []);

  // Handle starter selection (Blank Board, Sketch a Website, Collect Ideas, Map a Process)
  const handleSelectStarter = useCallback(
    (mode) => {
      if (hasUserContent) {
        const confirmed = window.confirm(
          'Switching starter layouts will replace the current items on your board (you can Undo with Ctrl+Z). Continue?'
        );
        if (!confirmed) return;
      }
      setStarterMode(mode);
      setSelected(null);
      setLinkStart(null);
      if (mode === 'blank') {
        board.loadBlankBoard();
      } else if (mode === 'website') {
        board.loadWebsiteSketchStarter();
      } else if (mode === 'ideas') {
        board.loadIdeaCollectionStarter();
      } else if (mode === 'process') {
        board.loadStarterWorkflow();
      }
    },
    [board, hasUserContent]
  );

  // Handle deliberate board clear with confirmation guard
  const handleClearBoard = useCallback(() => {
    if (board.pieces.length > 0 || (board.drawings || []).length > 0) {
      const confirmed = window.confirm(
        'Clear everything from your whiteboard? You can undo this with the Undo button or Ctrl+Z.'
      );
      if (!confirmed) return;
    }
    board.clearAll();
    setStarterMode('blank');
  }, [board]);

  // Fit board zoom to current screen width
  const handleFitBoard = useCallback(() => {
    if (typeof window === 'undefined') return;
    const vw = Math.max(280, window.innerWidth - 48);
    const targetContentWidth = 720;
    const fitted = Math.max(0.38, Math.min(1, Number((vw / targetContentWidth).toFixed(2))));
    setZoom(fitted);
  }, []);

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
    [board]
  );

  const changeImage = useCallback(
    (id, dataUrl, filename) => {
      board.updatePiece(id, {
        fileUri: dataUrl,
        text: filename || 'Uploaded Reference',
        isStarter: false,
      });
    },
    [board]
  );

  const deletePiece = useCallback(
    (id) => {
      board.removePiece(id);
      setSelected(null);
    },
    [board]
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

  // Upload image files onto board
  const handleUploadFiles = (files) => {
    files.forEach((f) => {
      const r = new FileReader();
      r.onload = () => {
        const { x, y } = spot();
        const id = board.addPiece({
          type: 'shot',
          x,
          y,
          w: 320,
          h: 220,
          label: `IMAGE / ${f.name.slice(0, 18).toUpperCase()}`,
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
    setIsWhiteboardOpen(true);
    setTool('select');
  };

  // Primary & Secondary Piece Addition Helpers
  const addTextBox = (initialText) => {
    const { x, y } = spot();
    const textVal = typeof initialText === 'string' ? initialText : '';
    const id = board.addPiece({
      type: 'text',
      x,
      y,
      w: 280,
      h: 150,
      label: 'TEXT NOTE',
      text: textVal,
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
    setTool('select');
  };

  const addNote = () => {
    const { x, y } = spot();
    const id = board.addPiece({
      type: 'note',
      x,
      y,
      w: 240,
      h: 150,
      label: 'STICKY NOTE',
      text: '',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
    setTool('select');
  };

  const handleAddStep = () => {
    const id = board.addStep();
    setSelected(id);
    setTool('select');
  };

  const addPage = () => {
    const { x, y } = spot();
    const id = board.addPiece({
      type: 'page',
      x,
      y,
      w: 320,
      h: 190,
      label: 'PAGE SECTION',
      text: '',
      columns: null,
      fitMode: 'cover',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
    setTool('select');
  };

  const addLink = (url) => {
    const { x, y } = spot();
    const cleanUrl = typeof url === 'string' ? url : '';
    const id = board.addPiece({
      type: 'link',
      x,
      y,
      w: 280,
      h: 130,
      label: 'REFERENCE LINK',
      text: cleanUrl,
      url: cleanUrl || 'https://',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
    setTool('select');
  };

  const addRow = () => {
    const { x, y } = spot();
    const id = board.addPiece({
      type: 'row',
      x,
      y,
      w: 620,
      h: 180,
      label: '3-COLUMN SECTION',
      text: 'Three-column row',
      columns: [
        { id: 'c1', label: 'Column 01', text: '' },
        { id: 'c2', label: 'Column 02', text: '' },
        { id: 'c3', label: 'Column 03', text: '' },
      ],
      fitMode: 'cover',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
    setTool('select');
  };

  const addTwoSquares = () => {
    const { x, y } = spot();
    const id = board.addPiece({
      type: 'row',
      x,
      y,
      w: 500,
      h: 175,
      label: '2-COLUMN COMPARISON',
      text: 'Two-column comparison group',
      columns: [
        { id: 'c1', label: 'Current / Before', text: '' },
        { id: 'c2', label: 'Goal / After', text: '' },
      ],
      fitMode: 'cover',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
    setTool('select');
  };

  const addCta = () => {
    const { x, y } = spot();
    const id = board.addPiece({
      type: 'cta',
      x,
      y,
      w: 240,
      h: 64,
      label: 'ACTION BUTTON',
      text: 'Get Started ↗',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
    setTool('select');
  };

  const createShape = (typeOrBox, maybeBox) => {
    const isObj = typeof typeOrBox === 'object' && typeOrBox !== null;
    const shapeType = isObj ? typeOrBox.shape || 'box' : typeOrBox;
    const box = isObj ? typeOrBox : maybeBox || { x: 80, y: 100, w: 220, h: 140 };
    board.addPiece({
      type: 'shape',
      shape: shapeType,
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      label: shapeType === 'circle' ? 'FOCUS CIRCLE' : 'GROUP BOX',
      text: '',
      highlight: false,
      isStarter: false,
    });
  };

  const placeItem = (item, dropX, dropY) => {
    const fallback = spot();
    const x = typeof dropX === 'number' ? dropX : fallback.x;
    const y = typeof dropY === 'number' ? dropY : fallback.y;
    const id = board.addPiece({
      type: item.kind || item.type || 'ui',
      variant: item.variant,
      x,
      y,
      w: item.w || 260,
      h: item.h || 150,
      label: item.label || item.title || 'COMPONENT',
      text: item.desc || item.label || '',
      highlight: false,
      isStarter: false,
    });
    setSelected(id);
  };

  // Render user content on board to PNG dataUrl (excluding unedited starter pieces)
  const renderBoardDataUrl = useCallback(
    (piecesToRender) => {
      try {
        const list = piecesToRender || userPieces;
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.fillStyle = '#EDE9E0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#23282A';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('CONTEXTMUSE / WHITEBOARD SKETCH & NOTES', 32, 42);

        const activeIds = new Set(list.map((p) => p.id));
        (board.links || []).forEach((l) => {
          if (!activeIds.has(l.from) || !activeIds.has(l.to)) return;
          const from = list.find((p) => p.id === l.from);
          const to = list.find((p) => p.id === l.to);
          if (!from || !to) return;
          ctx.beginPath();
          ctx.moveTo(from.x + from.w / 2, from.y + from.h / 2);
          ctx.lineTo(to.x + to.w / 2, to.y + to.h / 2);
          ctx.strokeStyle = from.stepState === 'bottleneck' ? '#E53935' : '#17504A';
          ctx.lineWidth = 3;
          ctx.stroke();
        });

        list.forEach((p) => {
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
          ctx.fillText((p.label || p.variant || p.type || 'ITEM').toUpperCase().slice(0, 32), 12, 22);
          ctx.font = '11px sans-serif';
          ctx.fillStyle = '#333333';
          const lines = (p.text || p.url || '').split('\n');
          lines.forEach((l, idx) => ctx.fillText(l.slice(0, 42), 12, 42 + idx * 16));
          ctx.restore();
        });

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
    },
    [userPieces, board.links, board.drawings]
  );

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
    a.download = `contextmuse-whiteboard-${Date.now().toString(36)}.json`;
    a.click();
  };

  const exportPng = () => {
    const dataUrl = renderBoardDataUrl(board.pieces);
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `contextmuse-whiteboard-${Date.now().toString(36)}.png`;
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
      alert('Unable to read board file.');
    }
  };

  const handleSelectTemplate = (template) => {
    if (template.seedPieces) {
      board.loadTemplate(template.id);
    }
    setIsWhiteboardOpen(true);
    canvasRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Attach ONLY user-created or user-edited pieces + drawings to Inquiry Brief (never unedited sample data!)
  const handleIncludeWithInquiry = () => {
    const activeUserPieces = board.pieces.filter((p) => !p.isStarter);
    const activeDrawings = board.drawings || [];
    const activeConstraints = (board.constraints || '').trim();

    if (activeUserPieces.length === 0 && activeDrawings.length === 0 && !activeConstraints) {
      setAttachNotice(
        'Add a note, text box, or sketch (or edit one of the example cards) before attaching the board to your inquiry.'
      );
      setTimeout(() => setAttachNotice(''), 6000);
      return;
    }

    setAttachNotice('');
    const dataUrl = renderBoardDataUrl(activeUserPieces);
    const activeIds = new Set(activeUserPieces.map((p) => p.id));
    const activeLinks = (board.links || []).filter(
      (l) => activeIds.has(l.from) && activeIds.has(l.to)
    );

    const summaryLines = [
      `=== WHITEBOARD SKETCH (${activeUserPieces.length} Item(s)${
        activeDrawings.length ? `, ${activeDrawings.length} Drawing Stroke(s)` : ''
      }) ===`,
      ...activeUserPieces.map(
        (p, idx) =>
          `  ${idx + 1}. [${(p.type || 'note').toUpperCase()}] ${p.label || p.variant || ''}: ${
            p.text || p.url || ''
          }`
      ),
      ...(activeDrawings.length
        ? [`  + ${activeDrawings.length} freehand sketch/highlight stroke(s)`]
        : []),
      ...(activeConstraints ? [`  Notes: ${activeConstraints}`] : []),
    ];
    const summaryText = summaryLines.join('\n');

    addWhiteboardClip({
      title: `Whiteboard Sketch (${activeUserPieces.length} item${
        activeUserPieces.length === 1 ? '' : 's'
      })`,
      note: summaryText,
      dataUrl,
      source: 'whiteboard',
      pagePath: '/build',
      snapshot: {
        source: 'whiteboard',
        stepCount,
        bottleneckCount,
        piecesCount: activeUserPieces.length,
        linksCount: activeLinks.length,
        drawingsCount: activeDrawings.length,
        constraints: activeConstraints,
        pieces: activeUserPieces.map((p) => ({
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
      projectType: brief?.inquiry?.projectType || 'Custom Build',
      notes: `${existingNotes}${summaryText}`.trim(),
    });
    openBrief();
  };

  return (
    <RoomShell room={room}>
      <div className="flex min-h-full flex-col gap-4 pb-14 pt-6 sm:pb-16 sm:pt-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Room Header */}
        <div className="px-4 sm:px-8">
          <RoomHeading
            num={room.num}
            verb={room.verb}
            badge="Custom Websites, Business Tools & Thoughtful Software"
            title="Custom Builds."
            watermark={room.num}
            sub="Tell me what you want to build in plain language, or open the optional whiteboard to sketch a rough layout, drop in screenshots, or map out how your business works."
          />
        </div>

        {/* ============================================================
            1. PRIMARY NORMAL INQUIRY + OPTIONAL "RATHER SHOW ME?" ENTRY
            ============================================================ */}
        <BuildEntryMethods
          isWhiteboardOpen={isWhiteboardOpen}
          onOpenWhiteboard={handleOpenWhiteboard}
          onOpenPageMarkup={openPageMarkup}
        />

        {/* ============================================================
            2. OPTIONAL VISUAL WHITEBOARD (SHOWN WHEN CHOSEN)
            ============================================================ */}
        {isWhiteboardOpen && (
          <section
            ref={canvasRef}
            data-testid="whiteboard-workspace-section"
            data-whiteboard="true"
            data-clarity-mask="true"
            className="mx-auto max-w-[1440px] w-full px-4 sm:px-8 pt-2 space-y-3 animate-fadeIn"
          >
            {/* Welcoming Starting State Selector: 4 Clear Choices */}
            <div
              data-testid="whiteboard-starting-choices"
              className="rounded-xl border-2 border-[#23282A] bg-[#DFDACE] p-4 sm:p-5 shadow-[4px_4px_0_#23282A]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#17504A] font-bold">
                    Visual Whiteboard — Choose How You Want to Start
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#23282A]">
                    Start with a blank board or load a simple example layout
                  </h3>
                </div>
                <button
                  type="button"
                  data-testid="close-whiteboard-btn"
                  onClick={() => setIsWhiteboardOpen(false)}
                  className="min-h-[40px] inline-flex items-center gap-1.5 rounded-lg border border-[#23282A]/25 bg-[#EDE9E0] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#23282A] hover:bg-[#23282A] hover:text-[#EDE9E0] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Hide Whiteboard</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* Choice 1: Blank Board */}
                <button
                  type="button"
                  data-testid="starter-choice-blank"
                  onClick={() => handleSelectStarter('blank')}
                  className={`min-h-[56px] text-left rounded-lg p-3 border-2 transition-all flex items-start gap-2.5 ${
                    starterMode === 'blank' && board.pieces.length === 0
                      ? 'bg-[#23282A] text-[#EDE9E0] border-[#23282A] shadow-sm'
                      : 'bg-[#EDE9E0] text-[#23282A] border-[#23282A]/20 hover:border-[#23282A]'
                  }`}
                >
                  <FilePlus2 className="h-4 w-4 text-[#D9A62E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-mono text-xs font-bold uppercase tracking-wider">
                      Blank Board
                    </div>
                    <div className="font-sans text-[11px] opacity-80 leading-snug mt-0.5">
                      Start fresh with an empty space
                    </div>
                  </div>
                </button>

                {/* Choice 2: Sketch a Website */}
                <button
                  type="button"
                  data-testid="starter-choice-website"
                  onClick={() => handleSelectStarter('website')}
                  className={`min-h-[56px] text-left rounded-lg p-3 border-2 transition-all flex items-start gap-2.5 ${
                    starterMode === 'website' && board.pieces.length > 0
                      ? 'bg-[#23282A] text-[#EDE9E0] border-[#23282A] shadow-sm'
                      : 'bg-[#EDE9E0] text-[#23282A] border-[#23282A]/20 hover:border-[#23282A]'
                  }`}
                >
                  <Layout className="h-4 w-4 text-[#D9A62E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-mono text-xs font-bold uppercase tracking-wider">
                      Sketch a Website
                    </div>
                    <div className="font-sans text-[11px] opacity-80 leading-snug mt-0.5">
                      Rough out a top message, sections &amp; button
                    </div>
                  </div>
                </button>

                {/* Choice 3: Collect Ideas */}
                <button
                  type="button"
                  data-testid="starter-choice-ideas"
                  onClick={() => handleSelectStarter('ideas')}
                  className={`min-h-[56px] text-left rounded-lg p-3 border-2 transition-all flex items-start gap-2.5 ${
                    starterMode === 'ideas' && board.pieces.length > 0
                      ? 'bg-[#23282A] text-[#EDE9E0] border-[#23282A] shadow-sm'
                      : 'bg-[#EDE9E0] text-[#23282A] border-[#23282A]/20 hover:border-[#23282A]'
                  }`}
                >
                  <StickyNote className="h-4 w-4 text-[#D9A62E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-mono text-xs font-bold uppercase tracking-wider">
                      Collect Ideas
                    </div>
                    <div className="font-sans text-[11px] opacity-80 leading-snug mt-0.5">
                      Jot sticky notes, goals &amp; links you like
                    </div>
                  </div>
                </button>

                {/* Choice 4: Map a Process */}
                <button
                  type="button"
                  data-testid="starter-choice-process"
                  onClick={() => handleSelectStarter('process')}
                  className={`min-h-[56px] text-left rounded-lg p-3 border-2 transition-all flex items-start gap-2.5 ${
                    starterMode === 'process' && board.pieces.length > 0
                      ? 'bg-[#23282A] text-[#EDE9E0] border-[#23282A] shadow-sm'
                      : 'bg-[#EDE9E0] text-[#23282A] border-[#23282A]/20 hover:border-[#23282A]'
                  }`}
                >
                  <GitBranch className="h-4 w-4 text-[#D9A62E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-mono text-xs font-bold uppercase tracking-wider">
                      Map a Process
                    </div>
                    <div className="font-sans text-[11px] opacity-80 leading-snug mt-0.5">
                      Show step-by-step how work moves today
                    </div>
                  </div>
                </button>
              </div>

              {board.pieces.some((p) => p.isStarter) && (
                <div
                  data-testid="starter-example-banner"
                  className="mt-3 rounded-lg border border-[#17504A]/30 bg-[#17504A]/10 px-3.5 py-2 text-xs font-sans text-[#23282A] flex flex-wrap items-center justify-between gap-2"
                >
                  <span>
                    <strong>Note:</strong> Cards labeled <strong>Example</strong> are sample placeholders. Edit any card to make it yours — unedited examples are never included with your inquiry.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectStarter('blank')}
                    className="font-mono text-[11px] font-bold uppercase underline text-[#17504A]"
                  >
                    Switch to Blank Board
                  </button>
                </div>
              )}

              {attachNotice && (
                <div
                  data-testid="attach-board-notice"
                  className="mt-3 rounded-lg border border-[#D9A62E] bg-[#23282A] text-[#EDE9E0] px-4 py-2.5 text-xs font-sans flex items-center justify-between gap-2"
                >
                  <span>{attachNotice}</span>
                  <button
                    type="button"
                    onClick={() => setAttachNotice('')}
                    className="font-mono text-xs text-[#D9A62E] underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>

            {/* Simplified Primary Toolbar + Progressive "More Tools" Drawer */}
            <BoardToolbar
              tool={tool}
              onTool={(t) => {
                setTool(t);
                setLinkStart(null);
              }}
              zoom={zoom}
              onZoomIn={() => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
              onZoomOut={() => setZoom((z) => Math.max(0.35, Number((z - 0.1).toFixed(2))))}
              onZoomReset={() => setZoom(getInitialZoom())}
              onFitBoard={handleFitBoard}
              snapToGrid={snapping}
              onToggleSnap={() => setSnapping((s) => !s)}
              canUndo={board.canUndo}
              canRedo={board.canRedo}
              onUndo={board.undo}
              onRedo={board.redo}
              onAddText={() => addTextBox('')}
              onAddNote={addNote}
              onAddImage={() => shotInput.current?.click()}
              onAddStep={handleAddStep}
              onAddPageFrame={addPage}
              onAddTwoColRow={addTwoSquares}
              onAddThreeColRow={addRow}
              onAddCta={addCta}
              onAddRefLink={() => addLink('')}
              onClearAll={handleClearBoard}
              onOpenReview={() => setReview(true)}
              onIncludeWithInquiry={handleIncludeWithInquiry}
              showLibrary={showLibrary}
              onToggleLibrary={() => setShowLibrary((v) => !v)}
              showTemplates={showTemplates}
              onToggleTemplates={() => setShowTemplates((v) => !v)}
              hasUserContent={hasUserContent}
            />

            {/* Quick Text & Reference Link Composer */}
            <BoardComposer onAddText={addTextBox} onAddLink={addLink} />

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
              onQuickAddText={() => addTextBox('')}
              onQuickAddNote={addNote}
              onQuickStartDraw={() => setTool('pen')}
              onQuickAddImage={() => shotInput.current?.click()}
            />

            {/* Optional UI Stickers & Wireframe Parts Bin (Progressive Disclosure) */}
            {showLibrary && <BoardLibrary onPlace={(item) => placeItem(item)} />}

            {/* Optional Starter Blueprints Gallery (Progressive Disclosure) */}
            {showTemplates && (
              <div className="rounded-xl border border-[#23282A]/20 bg-[#DFDACE] p-4 sm:p-5">
                <TemplateGallery onSelectStartingPoint={handleSelectTemplate} />
              </div>
            )}

            {/* Canvas Footer (Save Status, Attach to Inquiry & Export) */}
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

            {/* Progressive Disclosure for Project Snapshot Summary (Only shown when user has content and chooses to inspect) */}
            {hasUserContent && (
              <div className="pt-2">
                <button
                  type="button"
                  data-testid="toggle-project-snapshot"
                  onClick={() => setShowSnapshot((s) => !s)}
                  className="min-h-[44px] w-full flex items-center justify-between rounded-lg border border-[#23282A]/25 bg-[#DFDACE]/70 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#23282A] hover:bg-[#DFDACE] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#17504A]" />
                    <span>
                      Written Summary of Your Board ({userPieces.length} item{userPieces.length === 1 ? '' : 's'})
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-[#17504A]">
                    <span>{showSnapshot ? 'Hide Summary' : 'View Written Summary'}</span>
                    {showSnapshot ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>

                {showSnapshot && (
                  <div className="mt-3">
                    <ProjectSnapshot
                      pieces={userPieces}
                      links={board.links}
                      constraints={board.constraints}
                      onUpdateConstraints={board.updateConstraints}
                      onExportPng={exportPng}
                      onExportJson={exportJson}
                    />
                  </div>
                )}
              </div>
            )}
          </section>
        )}
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
          open={review}
          pieces={board.pieces}
          links={board.links}
          onClose={() => setReview(false)}
          onExportJson={exportJson}
          onExportPng={exportPng}
          onIncludeWithInquiry={() => {
            setReview(false);
            handleIncludeWithInquiry();
          }}
        />
      )}
    </RoomShell>
  );
}
