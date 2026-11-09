import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Highlighter,
  PenTool,
  StickyNote,
  Undo2,
  Trash2,
  Send,
  Layout,
  X,
  Plus,
  Check,
} from 'lucide-react';
import DrawingOverlay from '@/components/builds/DrawingOverlay';
import { useBrief } from '@/lib/BriefContext';

const PAGE_STORAGE_KEY = 'cxm_page_annotations_v1';

export default function PageAnnotationOverlay() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    pageMarkupActive,
    closePageMarkup,
    openPageMarkup,
    addWhiteboardClip,
    updateInquiry,
    openBrief,
    brief,
  } = useBrief();

  const currentPath = location.pathname.replace(/\/+$/, '') || '/';

  // Per-page persisted strokes and pinned notes
  const [allPageData, setAllPageData] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(PAGE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [tool, setTool] = useState('highlighter'); // 'highlighter' | 'pen' | 'note'
  const [quickNoteText, setQuickNoteText] = useState('');
  const [docSize, setDocSize] = useState({ width: 1440, height: 1800 });

  const pageEntry = allPageData[currentPath] || { strokes: [], notes: [] };
  const strokes = pageEntry.strokes || [];
  const notes = pageEntry.notes || [];
  const hasAnnotations = strokes.length > 0 || notes.length > 0;

  useEffect(() => {
    try {
      window.localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(allPageData));
    } catch {
      // Ignore quota errors
    }
  }, [allPageData]);

  // Measure document height when markup or saved annotations are active
  useEffect(() => {
    if (!pageMarkupActive && !hasAnnotations) return;
    const updateDims = () => {
      const w = Math.min(
        document.documentElement.clientWidth || window.innerWidth || 1280,
        window.innerWidth || 1280
      );
      const h = Math.max(
        document.documentElement.scrollHeight || 0,
        document.body.scrollHeight || 0,
        window.innerHeight || 900
      );
      setDocSize({ width: w, height: h });
    };
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, [pageMarkupActive, hasAnnotations, currentPath]);

  const updateCurrentPage = useCallback(
    (updater) => {
      setAllPageData((prev) => {
        const curr = prev[currentPath] || { strokes: [], notes: [] };
        const next = typeof updater === 'function' ? updater(curr) : updater;
        return { ...prev, [currentPath]: next };
      });
    },
    [currentPath]
  );

  const handleAddStroke = useCallback(
    (stroke) => {
      updateCurrentPage((curr) => ({
        ...curr,
        strokes: [...(curr.strokes || []), stroke],
      }));
    },
    [updateCurrentPage]
  );

  const handleAddNote = (customText, x, y) => {
    const text = (customText ?? quickNoteText).trim();
    if (!text) return;
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const newNote = {
      id: `pnote-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      text,
      x: typeof x === 'number' ? x : 80 + ((notes.length * 35) % 240),
      y: typeof y === 'number' ? y : scrollY + 140 + ((notes.length * 45) % 180),
      createdAt: new Date().toISOString(),
    };
    updateCurrentPage((curr) => ({
      ...curr,
      notes: [...(curr.notes || []), newNote],
    }));
    setQuickNoteText('');
  };

  const handleUpdateNoteText = (id, text) => {
    updateCurrentPage((curr) => ({
      ...curr,
      notes: (curr.notes || []).map((n) => (n.id === id ? { ...n, text } : n)),
    }));
  };

  const handleRemoveNote = (id) => {
    updateCurrentPage((curr) => ({
      ...curr,
      notes: (curr.notes || []).filter((n) => n.id !== id),
    }));
  };

  const handleUndo = () => {
    updateCurrentPage((curr) => {
      if ((curr.strokes || []).length > 0) {
        return { ...curr, strokes: curr.strokes.slice(0, -1) };
      }
      if ((curr.notes || []).length > 0) {
        return { ...curr, notes: curr.notes.slice(0, -1) };
      }
      return curr;
    });
  };

  const handleClearPage = () => {
    updateCurrentPage({ strokes: [], notes: [] });
  };

  // Render a compact visual snapshot of the page annotations + notes
  const renderPageMarkupDataUrl = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 450;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#1C2022';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#23282A';
      ctx.fillRect(0, 0, canvas.width, 46);
      ctx.fillStyle = '#D9A62E';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`PAGE MARKUP SNAPSHOT // ROUTE: ${currentPath}`, 20, 29);

      // Draw scaled strokes
      const scaleX = canvas.width / Math.max(docSize.width, 800);
      const scaleY = (canvas.height - 60) / Math.max(docSize.height, 900);

      strokes.forEach((s) => {
        if (!s.points || s.points.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(s.points[0].x * scaleX, 54 + s.points[0].y * scaleY);
        for (let i = 1; i < s.points.length; i++) {
          ctx.lineTo(s.points[i].x * scaleX, 54 + s.points[i].y * scaleY);
        }
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (s.tool === 'highlighter') {
          ctx.strokeStyle = 'rgba(217, 166, 46, 0.25)';
          ctx.lineWidth = 14;
        } else {
          ctx.strokeStyle = '#D9A62E';
          ctx.lineWidth = 2.5;
        }
        ctx.stroke();
        ctx.restore();
      });

      // Draw notes summary cards on snapshot
      notes.slice(0, 5).forEach((n, idx) => {
        const ny = 66 + idx * 68;
        ctx.fillStyle = '#D9A62E';
        ctx.fillRect(24, ny, 752, 54);
        ctx.fillStyle = '#23282A';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`NOTE #0${idx + 1} (${currentPath}):`, 36, ny + 20);
        ctx.font = '12px sans-serif';
        ctx.fillText(String(n.text || '').slice(0, 95), 36, ny + 40);
      });

      return canvas.toDataURL('image/png');
    } catch {
      return null;
    }
  };

  const handleIncludeWithInquiry = () => {
    const highlightCount = strokes.filter((s) => s.tool === 'highlighter').length;
    const penCount = strokes.filter((s) => s.tool === 'pen').length;

    const summaryLines = [
      `=== PAGE MARKUP & ANNOTATIONS (${currentPath}) ===`,
      `Highlighted Passages: ${highlightCount} highlight stroke(s)`,
      `Freehand Sketches: ${penCount} pen stroke(s)`,
      ...(notes.length > 0
        ? [
            `Page Notes (${notes.length}):`,
            ...notes.map((n, i) => `  ${i + 1}. ${n.text}`),
          ]
        : ['Page Notes: Visual markup attached from page']),
    ];
    const summaryText = summaryLines.join('\n');
    const dataUrl = renderPageMarkupDataUrl();

    addWhiteboardClip({
      title: `Page Markup (${currentPath})`,
      note: summaryText,
      dataUrl,
      source: 'page-markup',
      pagePath: currentPath,
      snapshot: {
        source: 'page-markup',
        pagePath: currentPath,
        highlightCount,
        penCount,
        notes: notes.map((n) => ({ id: n.id, text: n.text, x: n.x, y: n.y })),
      },
    });

    const existingNotes = brief?.inquiry?.notes ? `${brief.inquiry.notes}\n\n` : '';
    updateInquiry({
      notes: `${existingNotes}${summaryText}`.trim(),
    });
    closePageMarkup();
    openBrief();
  };

  return (
    <>
      {/* ============================================================
          CONTEXTUAL INVITATION BAR (Shown across pages so visitors see both paths)
          ============================================================ */}
      <div
        data-page-markup-invite
        className="border-t border-[#DFDACE]/15 bg-[#16191B] text-[#EDE9E0] px-4 py-3 sm:px-8"
      >
        <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D9A62E]" />
              <span className="text-[#DFDACE]/80">
                See something you&apos;d like for your project?
              </span>
              <button
                type="button"
                onClick={openPageMarkup}
                className="font-bold text-[#D9A62E] underline underline-offset-4 hover:text-[#EDE9E0] transition-colors"
              >
                Mark up this page.
              </button>
            </div>

            {currentPath !== '/build' && (
              <div className="flex items-center gap-2">
                <span className="text-[#DFDACE]/40 hidden sm:inline">|</span>
                <span className="text-[#DFDACE]/80">Rather show than tell?</span>
                <button
                  type="button"
                  onClick={() => navigate('/build')}
                  className="font-bold text-[#EDE9E0] underline underline-offset-4 hover:text-[#D9A62E] transition-colors"
                >
                  Open the whiteboard.
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasAnnotations && (
              <button
                type="button"
                onClick={handleIncludeWithInquiry}
                className="flex items-center gap-1.5 bg-[#D9A62E] text-[#141617] px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#e0b240] transition-colors"
              >
                <Send className="h-3 w-3" />
                <span>Include these notes with my inquiry.</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          FULL-PAGE ANNOTATION OVERLAY + FLOATING CONTROL BAR
          ============================================================ */}
      {(pageMarkupActive || hasAnnotations) && (
        <div
          className={`absolute inset-x-0 top-0 z-30 overflow-hidden ${
            pageMarkupActive ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          style={{ height: docSize.height }}
        >
          <DrawingOverlay
            width={docSize.width}
            height={docSize.height}
            zoom={1}
            tool={pageMarkupActive ? tool : 'select'}
            drawings={strokes}
            onAddStroke={handleAddStroke}
            penColor={currentPath === '/lab' ? '#17504A' : '#D9A62E'}
            highlighterColor={
              currentPath === '/lab'
                ? 'rgba(23, 80, 74, 0.18)'
                : 'rgba(217, 166, 46, 0.18)'
            }
          />

          {/* Pinned Page Notes */}
          {notes.map((n, idx) => (
            <div
              key={n.id}
              style={{ left: n.x, top: n.y }}
              className="pointer-events-auto absolute z-30 w-60 bg-[#D9A62E] text-[#23282A] border-2 border-[#23282A] p-2.5 shadow-[4px_4px_0_#23282A] rounded-sm"
            >
              <div className="flex items-center justify-between font-mono text-[9.5px] font-bold uppercase tracking-wider border-b border-[#23282A]/20 pb-1 mb-1.5">
                <span>Page Note #0{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveNote(n.id)}
                  className="text-[#23282A]/70 hover:text-red-800"
                  title="Remove note"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <textarea
                rows={2}
                value={n.text}
                onChange={(e) => handleUpdateNoteText(n.id, e.target.value)}
                className="w-full resize-none bg-transparent font-sans text-xs font-medium text-[#23282A] focus:outline-none leading-snug"
              />
            </div>
          ))}
        </div>
      )}

      {/* Floating Page Markup Control Bar */}
      {pageMarkupActive && (
        <div
          data-page-markup-toolbar
          className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[96vw] max-w-4xl bg-[#1B1F21] text-[#EDE9E0] border-2 border-[#D9A62E] rounded-xl p-2.5 sm:p-3 shadow-2xl space-y-2 max-h-[42vh] overflow-y-auto"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider bg-[#D9A62E] text-[#141617] font-bold px-2 py-1 rounded">
                Mark Up ({currentPath})
              </span>

              <button
                type="button"
                data-testid="markup-tool-highlighter"
                onClick={() => setTool('highlighter')}
                className={`min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider transition-colors ${
                  tool === 'highlighter'
                    ? 'bg-[#D9A62E] text-[#141617] font-bold'
                    : 'bg-[#23282A] text-[#EDE9E0] hover:border-[#D9A62E] border border-[#DFDACE]/20'
                }`}
                title="Translucent 18% Highlighter — keeps underlying text readable"
              >
                <Highlighter className="h-3.5 w-3.5" />
                <span>Highlight (18%)</span>
              </button>

              <button
                type="button"
                data-testid="markup-tool-pen"
                onClick={() => setTool('pen')}
                className={`min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs uppercase tracking-wider transition-colors ${
                  tool === 'pen'
                    ? 'bg-[#D9A62E] text-[#141617] font-bold'
                    : 'bg-[#23282A] text-[#EDE9E0] hover:border-[#D9A62E] border border-[#DFDACE]/20'
                }`}
                title="Freehand Sketch Pen"
              >
                <PenTool className="h-3.5 w-3.5" />
                <span>Pen</span>
              </button>

              <button
                type="button"
                data-testid="markup-undo-btn"
                onClick={handleUndo}
                disabled={!hasAnnotations}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded bg-[#23282A] border border-[#DFDACE]/20 text-[#EDE9E0] hover:text-[#D9A62E] disabled:opacity-30"
                title="Undo last stroke or note"
              >
                <Undo2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                data-testid="markup-clear-btn"
                onClick={handleClearPage}
                disabled={!hasAnnotations}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded bg-[#23282A] border border-[#DFDACE]/20 text-[#EDE9E0] hover:text-red-400 disabled:opacity-30"
                title="Clear page markup"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {currentPath !== '/build' && (
                <button
                  type="button"
                  onClick={() => {
                    closePageMarkup();
                    navigate('/build');
                  }}
                  className="min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#DFDACE]/25 bg-[#23282A] text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E] font-mono text-[11px] uppercase tracking-wider transition-colors"
                >
                  <Layout className="h-3.5 w-3.5 text-[#D9A62E]" />
                  <span>Open Whiteboard</span>
                </button>
              )}

              <button
                type="button"
                data-testid="markup-include-inquiry-btn"
                onClick={handleIncludeWithInquiry}
                className="min-h-[44px] flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#D9A62E] text-[#141617] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#e0b240] transition-colors shadow"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Include with Inquiry</span>
              </button>

              <button
                type="button"
                data-testid="markup-close-btn"
                onClick={closePageMarkup}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded bg-[#23282A] text-[#DFDACE]/70 hover:text-white border border-[#DFDACE]/20"
                title="Exit page markup mode"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Page Note Input */}
          <div className="flex items-center gap-2 pt-1.5 border-t border-[#DFDACE]/15">
            <StickyNote className="h-4 w-4 text-[#D9A62E] shrink-0" />
            <input
              type="text"
              data-testid="markup-quick-note-input"
              value={quickNoteText}
              onChange={(e) => setQuickNoteText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && quickNoteText.trim()) {
                  e.preventDefault();
                  handleAddNote(quickNoteText);
                }
              }}
              placeholder="Pin a note to this page (e.g. 'We want something like this')..."
              className="flex-1 min-h-[44px] min-w-0 bg-[#141617] border border-[#DFDACE]/25 px-3 py-1.5 rounded text-xs font-sans text-[#EDE9E0] focus:outline-none focus:border-[#D9A62E]"
            />
            <button
              type="button"
              data-testid="markup-pin-note-btn"
              onClick={() => handleAddNote(quickNoteText)}
              disabled={!quickNoteText.trim()}
              className="min-h-[44px] flex items-center gap-1 px-3.5 py-1.5 rounded bg-[#17504A] text-[#EDE9E0] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1e665e] disabled:opacity-40 transition-colors shrink-0"
            >
              <Plus className="h-3.5 w-3.5 text-[#D9A62E]" />
              <span>Pin Note</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
