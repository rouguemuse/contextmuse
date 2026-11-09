import { useCallback, useEffect, useState, useRef } from 'react';
import { TEMPLATES } from '../data/templates.js';

export const STORAGE_KEY_V3 = 'contextmuse:board:v3';
export const STORAGE_KEY_V2 = 'contextmuse:board:v2';
export const BOARD_W = 2400;
export const BOARD_H = 1700;

let seq = 0;
export const uid = (tag) => `${tag}${Date.now().toString(36).slice(-4)}${(seq += 1).toString(36)}`;

export const DEFAULT_WORKFLOW_PIECES = [
  {
    id: 'step_1',
    type: 'step',
    stepNumber: 1,
    stepState: 'normal',
    x: 40,
    y: 80,
    w: 280,
    h: 170,
    label: '01 / CUSTOMER INTAKE (EXAMPLE)',
    text: 'Example: Customer submits order or service request through website or email.',
    parentId: null,
    highlight: false,
    collapsed: false,
    isStarter: true,
  },
  {
    id: 'step_2',
    type: 'step',
    stepNumber: 2,
    stepState: 'bottleneck',
    x: 360,
    y: 80,
    w: 300,
    h: 170,
    label: '02 / MANUAL VERIFICATION (EXAMPLE)',
    text: 'Example: Staff manually cross-checks sizing, pricing spreadsheets, and schedule availability across separate files.',
    parentId: null,
    highlight: true,
    collapsed: false,
    isStarter: true,
  },
  {
    id: 'step_3',
    type: 'step',
    stepNumber: 3,
    stepState: 'normal',
    x: 700,
    y: 80,
    w: 280,
    h: 170,
    label: '03 / ORDER FULFILLMENT (EXAMPLE)',
    text: 'Example: Confirmation email, invoice, and calendar booking dispatched back to customer.',
    parentId: null,
    highlight: false,
    collapsed: false,
    isStarter: true,
  },
  {
    id: 'note_hint',
    type: 'note',
    x: 40,
    y: 280,
    w: 300,
    h: 130,
    label: 'EXAMPLE GUIDE',
    text: 'Example starter: Edit any box above to make it part of your project. Unedited example boxes are never sent with your inquiry.',
    parentId: null,
    highlight: true,
    collapsed: false,
    isStarter: true,
  },
];

export const DEFAULT_WORKFLOW_LINKS = [
  { id: 'lk_1_2', from: 'step_1', to: 'step_2' },
  { id: 'lk_2_3', from: 'step_2', to: 'step_3' },
];

export const DEFAULT_WEBSITE_SKETCH_PIECES = [
  {
    id: 'web_hero',
    type: 'page',
    x: 40,
    y: 70,
    w: 580,
    h: 190,
    label: 'HERO SECTION (EXAMPLE)',
    text: 'Example headline: What is the first thing visitors should understand when they land on your page?',
    parentId: null,
    highlight: false,
    collapsed: false,
    isStarter: true,
  },
  {
    id: 'web_features',
    type: 'row',
    x: 40,
    y: 280,
    w: 580,
    h: 190,
    label: 'KEY SECTIONS / OFFERINGS (EXAMPLE)',
    text: '',
    columns: [
      { label: '01 / WHAT YOU OFFER', text: 'Example: Main service, product, or interactive tool.' },
      { label: '02 / WHY IT WORKS', text: 'Example: Proof, before/after results, or simple explanation.' },
    ],
    parentId: null,
    highlight: false,
    collapsed: false,
    isStarter: true,
  },
  {
    id: 'web_cta',
    type: 'cta',
    x: 40,
    y: 490,
    w: 260,
    h: 100,
    label: 'MAIN ACTION BUTTON (EXAMPLE)',
    text: 'Example: Book a Quote / Get Started',
    parentId: null,
    highlight: true,
    collapsed: false,
    isStarter: true,
  },
  {
    id: 'web_note',
    type: 'note',
    x: 330,
    y: 490,
    w: 290,
    h: 120,
    label: 'EXAMPLE SKETCH',
    text: 'Example starter: Click any text to edit it, or drag boxes to rearrange. Unedited examples are excluded from your inquiry.',
    parentId: null,
    highlight: false,
    collapsed: false,
    isStarter: true,
  },
];

export const DEFAULT_COLLECT_IDEAS_PIECES = [
  {
    id: 'idea_note_1',
    type: 'note',
    x: 40,
    y: 80,
    w: 250,
    h: 170,
    label: 'IDEA / WISH #1 (EXAMPLE)',
    text: 'Example: Write down a feature, frustration, or rough thought here.',
    parentId: null,
    highlight: true,
    collapsed: false,
    isStarter: true,
  },
  {
    id: 'idea_note_2',
    type: 'note',
    x: 310,
    y: 80,
    w: 250,
    h: 170,
    label: 'IDEA / WISH #2 (EXAMPLE)',
    text: 'Example: Another piece of the puzzle or something customers ask for.',
    parentId: null,
    highlight: false,
    collapsed: false,
    isStarter: true,
  },
  {
    id: 'idea_text_1',
    type: 'text',
    x: 40,
    y: 270,
    w: 300,
    h: 160,
    label: 'MAIN GOAL (EXAMPLE)',
    text: 'Example: What would make this project a big win for you?',
    parentId: null,
    highlight: false,
    collapsed: false,
    isStarter: true,
  },
  {
    id: 'idea_ref_1',
    type: 'link',
    x: 360,
    y: 270,
    w: 280,
    h: 150,
    label: 'INSPIRATION LINK (EXAMPLE)',
    text: 'https://example.com — Paste a site or tool you like',
    parentId: null,
    highlight: false,
    collapsed: false,
    isStarter: true,
  },
];

export const seed = () => ({
  pieces: [],
  links: [],
  drawings: [],
  constraints: '',
});

/**
 * Safe, idempotent migration from legacy v2 board to v3 specification.
 * Preserves all pieces, links, drawings, custom text, and metadata.
 * Does NOT delete the original v2 localStorage key.
 */
export function migrateV2Board(v2Raw) {
  if (!v2Raw) return null;
  try {
    const v2 = typeof v2Raw === 'string' ? JSON.parse(v2Raw) : v2Raw;
    if (!v2 || (!Array.isArray(v2.pieces) && !Array.isArray(v2.links))) return null;

    const pieces = Array.isArray(v2.pieces)
      ? v2.pieces.map((p) => ({
          id: p.id || uid('p'),
          type: p.type || 'page',
          x: typeof p.x === 'number' ? p.x : 100,
          y: typeof p.y === 'number' ? p.y : 100,
          w: typeof p.w === 'number' ? p.w : 280,
          h: typeof p.h === 'number' ? p.h : 160,
          label: p.label || '',
          text: p.text || '',
          fileUri: p.fileUri || null,
          parentId: p.parentId || null,
          highlight: Boolean(p.highlight),
          collapsed: Boolean(p.collapsed),
          columns: Array.isArray(p.columns) ? p.columns : null,
          fitMode: p.fitMode || 'cover',
          stepState: p.stepState || (p.highlight ? 'bottleneck' : 'normal'),
          isStarter: Boolean(p.isStarter),
        }))
      : [];

    const links = Array.isArray(v2.links)
      ? v2.links.map((l) => ({
          id: l.id || uid('lk'),
          from: l.from,
          to: l.to,
        }))
      : [];

    const drawings = Array.isArray(v2.drawings) ? v2.drawings : [];
    const constraints = typeof v2.constraints === 'string' ? v2.constraints : '';

    return {
      pieces,
      links,
      drawings,
      constraints,
      _migratedFromV2: true,
      _migratedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Failed to parse or migrate legacy v2 board data:', err);
    return null;
  }
}

function isUneditedStarterBoard(parsed) {
  if (!parsed || !Array.isArray(parsed.pieces)) return false;
  const hasDrawings = Array.isArray(parsed.drawings) && parsed.drawings.length > 0;
  const hasConstraints = typeof parsed.constraints === 'string' && parsed.constraints.trim().length > 0;
  if (hasDrawings || hasConstraints) return false;
  if (parsed.pieces.length === 0) return false;
  return parsed.pieces.every((p) => p.isStarter === true);
}

/**
 * Discovers and initializes board state with priority order:
 * 1. Saved v3 board in localStorage (if it has user content; if it's only unedited legacy default starter items, start clean)
 * 2. Automatic, nondestructive migration from saved v2 board
 * 3. Fresh blank board (visitor chooses Blank, Sketch a Website, Collect Ideas, or Map a Process)
 */
function loadInitialBoard() {
  try {
    const rawV3 = localStorage.getItem(STORAGE_KEY_V3);
    if (rawV3) {
      const parsed = JSON.parse(rawV3);
      if (Array.isArray(parsed.pieces) && Array.isArray(parsed.links)) {
        if (isUneditedStarterBoard(parsed) && !parsed._userChoseStarter) {
          return seed();
        }
        return {
          pieces: parsed.pieces,
          links: parsed.links,
          drawings: Array.isArray(parsed.drawings) ? parsed.drawings : [],
          constraints: typeof parsed.constraints === 'string' ? parsed.constraints : '',
        };
      }
    }
  } catch (err) {
    console.warn('Error reading v3 board from storage:', err);
  }

  // Check v2 legacy storage
  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY_V2);
    if (rawV2) {
      const migrated = migrateV2Board(rawV2);
      if (migrated && (migrated.pieces.length > 0 || migrated.links.length > 0 || migrated.drawings.length > 0)) {
        if (isUneditedStarterBoard(migrated)) {
          return seed();
        }
        try {
          localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(migrated));
        } catch {
          /* Quota safeguard */
        }
        return migrated;
      }
    }
  } catch (err) {
    console.warn('Error migrating v2 board from storage:', err);
  }

  return seed();
}

export default function useBoard() {
  const [board, setBoard] = useState(loadInitialBoard);
  const [saved, setSaved] = useState(true);

  // Undo / Redo history stacks
  const historyRef = useRef([]);
  const futureRef = useRef([]);

  const pushHistory = useCallback((current) => {
    historyRef.current.push(JSON.parse(JSON.stringify(current)));
    if (historyRef.current.length > 40) historyRef.current.shift();
    futureRef.current = [];
  }, []);

  // Immediate auto-save to localStorage on every board change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(board));
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(board));
      setSaved(true);
    } catch (err) {
      console.warn('Storage quota exceeded or error saving board:', err);
      setSaved(false);
    }
  }, [board]);

  const addPiece = useCallback((partial) => {
    const piece = {
      id: uid('p'),
      type: 'text',
      parentId: null,
      highlight: false,
      collapsed: false,
      w: 260,
      h: 150,
      x: 40,
      y: 80,
      isStarter: false,
      ...partial,
    };
    setBoard((prev) => {
      pushHistory(prev);
      return { ...prev, pieces: [...prev.pieces, piece] };
    });
    return piece.id;
  }, [pushHistory]);

  const addStep = useCallback((partial = {}) => {
    let createdStep;
    setBoard((prev) => {
      pushHistory(prev);
      const existingSteps = prev.pieces.filter((p) => p.type === 'step');
      const nextNum = existingSteps.length + 1;
      const lastStep = existingSteps[existingSteps.length - 1];
      const nextX = lastStep ? Math.min(BOARD_W - 320, lastStep.x + 320) : 40;
      const nextY = lastStep ? lastStep.y : 80;

      createdStep = {
        id: uid('step'),
        type: 'step',
        stepNumber: nextNum,
        stepState: partial.stepState || 'normal',
        x: partial.x ?? nextX,
        y: partial.y ?? nextY,
        w: partial.w || 270,
        h: partial.h || 165,
        label: partial.label || `0${nextNum} / PROCESS STEP`,
        text: partial.text || 'Describe what happens at this step...',
        parentId: null,
        highlight: partial.stepState === 'bottleneck',
        collapsed: false,
        isStarter: false,
        ...partial,
      };

      const newLinks = [...prev.links];
      if (lastStep && !partial.skipLink) {
        newLinks.push({ id: uid('lk'), from: lastStep.id, to: createdStep.id });
      }

      return {
        ...prev,
        pieces: [...prev.pieces, createdStep],
        links: newLinks,
      };
    });
    return createdStep ? createdStep.id : null;
  }, [pushHistory]);

  const setPieceState = useCallback((id, stepState) => {
    setBoard((prev) => {
      pushHistory(prev);
      return {
        ...prev,
        pieces: prev.pieces.map((p) =>
          p.id === id
            ? {
                ...p,
                stepState,
                highlight: stepState === 'bottleneck',
                isStarter: false,
              }
            : p
        ),
      };
    });
  }, [pushHistory]);

  const updatePiece = useCallback((id, changes) => {
    setBoard((prev) => ({
      ...prev,
      pieces: prev.pieces.map((p) =>
        p.id === id
          ? {
              ...p,
              ...changes,
              label:
                typeof changes.label === 'string'
                  ? changes.label
                  : p.isStarter && typeof p.label === 'string'
                  ? p.label.replace(/\s*\(EXAMPLE\)\s*/gi, '')
                  : p.label,
              isStarter: false, // Any edit marks piece as real user content
            }
          : p
      ),
    }));
  }, []);

  const updateConstraints = useCallback((constraints) => {
    setBoard((prev) => ({
      ...prev,
      constraints,
    }));
  }, []);

  const resizePiece = useCallback((id, w, h, x, y) => {
    setBoard((prev) => {
      const piece = prev.pieces.find((p) => p.id === id);
      if (!piece) return prev;
      return {
        ...prev,
        pieces: prev.pieces.map((p) =>
          p.id === id
            ? {
                ...p,
                w: Math.max(80, Math.round(w)),
                h: Math.max(50, Math.round(h)),
                x: x != null ? Math.max(0, Math.round(x)) : p.x,
                y: y != null ? Math.max(0, Math.round(y)) : p.y,
                isStarter: false,
              }
            : p
        ),
      };
    });
  }, []);

  const duplicatePiece = useCallback((id) => {
    setBoard((prev) => {
      const piece = prev.pieces.find((p) => p.id === id);
      if (!piece) return prev;
      pushHistory(prev);
      const duplicate = {
        ...JSON.parse(JSON.stringify(piece)),
        id: uid('p'),
        x: piece.x + 30,
        y: piece.y + 30,
        isStarter: false,
      };
      return {
        ...prev,
        pieces: [...prev.pieces, duplicate],
      };
    });
  }, [pushHistory]);

  const ungroupRow = useCallback((id) => {
    setBoard((prev) => {
      const row = prev.pieces.find((p) => p.id === id && p.type === 'row');
      if (!row || !Array.isArray(row.columns)) return prev;
      pushHistory(prev);

      const colCount = row.columns.length;
      const colW = Math.round((row.w - (colCount - 1) * 12) / colCount);

      const unpackedPieces = row.columns.map((col, idx) => ({
        id: uid('pg'),
        type: 'page',
        x: row.x + idx * (colW + 12),
        y: row.y,
        w: colW,
        h: row.h,
        label: col.label || `CARD / ${idx + 1}`,
        text: col.text || '',
        parentId: null,
        highlight: false,
        collapsed: false,
        isStarter: false,
      }));

      return {
        ...prev,
        pieces: [...prev.pieces.filter((p) => p.id !== id), ...unpackedPieces],
        links: prev.links.filter((l) => l.from !== id && l.to !== id),
      };
    });
  }, [pushHistory]);

  const toggleCollapsePiece = useCallback((id) => {
    setBoard((prev) => {
      pushHistory(prev);
      return {
        ...prev,
        pieces: prev.pieces.map((p) =>
          p.id === id ? { ...p, collapsed: !p.collapsed } : p
        ),
      };
    });
  }, [pushHistory]);

  const moveTo = useCallback((id, x, y) => {
    setBoard((prev) => {
      const piece = prev.pieces.find((p) => p.id === id);
      if (!piece) return prev;
      const dx = x - piece.x;
      const dy = y - piece.y;
      if (!dx && !dy) return prev;
      return {
        ...prev,
        pieces: prev.pieces.map((p) => {
          if (p.id === id) return { ...p, x, y };
          if (p.parentId === id) return { ...p, x: p.x + dx, y: p.y + dy };
          return p;
        }),
      };
    });
  }, []);

  const settle = useCallback((id) => {
    setBoard((prev) => {
      const piece = prev.pieces.find((p) => p.id === id);
      if (!piece || piece.type === 'page' || piece.type === 'row' || piece.type === 'step') return prev;
      const cx = piece.x + piece.w / 2;
      const cy = piece.y + piece.h / 2;
      const host = [...prev.pieces]
        .reverse()
        .find(
          (q) =>
            (q.type === 'page' || q.type === 'row' || q.type === 'step') &&
            q.id !== piece.id &&
            cx > q.x &&
            cx < q.x + q.w &&
            cy > q.y &&
            cy < q.y + q.h
        );
      const parentId = host ? host.id : null;
      if (parentId === piece.parentId) return prev;
      return { ...prev, pieces: prev.pieces.map((p) => (p.id === id ? { ...p, parentId } : p)) };
    });
  }, []);

  const removePiece = useCallback((id) => {
    setBoard((prev) => {
      pushHistory(prev);
      return {
        ...prev,
        pieces: prev.pieces.filter((p) => p.id !== id && p.parentId !== id),
        links: prev.links.filter((l) => l.from !== id && l.to !== id),
      };
    });
  }, [pushHistory]);

  const toggleHighlight = useCallback((id) => {
    setBoard((prev) => {
      pushHistory(prev);
      return {
        ...prev,
        pieces: prev.pieces.map((p) =>
          p.id === id ? { ...p, highlight: !p.highlight, isStarter: false } : p
        ),
      };
    });
  }, [pushHistory]);

  const addLink = useCallback((from, to) => {
    if (!from || !to || from === to) return;
    setBoard((prev) => {
      if (prev.links.some((l) => (l.from === from && l.to === to) || (l.from === to && l.to === from))) {
        return prev;
      }
      pushHistory(prev);
      return { ...prev, links: [...prev.links, { id: uid('lk'), from, to }] };
    });
  }, [pushHistory]);

  const removeLink = useCallback((linkId) => {
    setBoard((prev) => {
      pushHistory(prev);
      return { ...prev, links: prev.links.filter((l) => l.id !== linkId) };
    });
  }, [pushHistory]);

  const toggleLink = useCallback((from, to) => {
    if (!from || !to || from === to) return;
    setBoard((prev) => {
      const existing = prev.links.find(
        (l) => (l.from === from && l.to === to) || (l.from === to && l.to === from)
      );
      pushHistory(prev);
      if (existing) {
        return { ...prev, links: prev.links.filter((l) => l.id !== existing.id) };
      }
      return { ...prev, links: [...prev.links, { id: uid('lk'), from, to }] };
    });
  }, [pushHistory]);

  const addDrawingStroke = useCallback((stroke) => {
    setBoard((prev) => {
      pushHistory(prev);
      return {
        ...prev,
        drawings: [...(prev.drawings || []), stroke],
      };
    });
  }, [pushHistory]);

  const clearDrawings = useCallback(() => {
    setBoard((prev) => {
      pushHistory(prev);
      return { ...prev, drawings: [] };
    });
  }, [pushHistory]);

  const loadBlankBoard = useCallback(() => {
    pushHistory(board);
    setBoard({
      pieces: [],
      links: [],
      drawings: [],
      constraints: '',
    });
  }, [board, pushHistory]);

  const loadWebsiteSketchStarter = useCallback(() => {
    pushHistory(board);
    setBoard({
      pieces: JSON.parse(JSON.stringify(DEFAULT_WEBSITE_SKETCH_PIECES)),
      links: [],
      drawings: [],
      constraints: '',
      _userChoseStarter: true,
    });
  }, [board, pushHistory]);

  const loadIdeaCollectionStarter = useCallback(() => {
    pushHistory(board);
    setBoard({
      pieces: JSON.parse(JSON.stringify(DEFAULT_COLLECT_IDEAS_PIECES)),
      links: [],
      drawings: [],
      constraints: '',
      _userChoseStarter: true,
    });
  }, [board, pushHistory]);

  const loadStarterWorkflow = useCallback(() => {
    pushHistory(board);
    setBoard({
      pieces: JSON.parse(JSON.stringify(DEFAULT_WORKFLOW_PIECES)),
      links: JSON.parse(JSON.stringify(DEFAULT_WORKFLOW_LINKS)),
      drawings: [],
      constraints: '',
      _userChoseStarter: true,
    });
  }, [board, pushHistory]);

  const loadTemplate = useCallback((templateId) => {
    const tmpl = TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return;

    setBoard((prev) => {
      pushHistory(prev);
      let startX = 40;
      let startY = 80;
      const createdPieces = tmpl.seedPieces.map((sp, idx) => {
        const x = startX + (idx % 3) * 320;
        const y = startY + Math.floor(idx / 3) * 220;
        return {
          id: uid('p'),
          type: sp.type === 'page' ? 'step' : sp.type,
          stepState: idx === 1 ? 'bottleneck' : 'normal',
          x,
          y,
          w: sp.w || 280,
          h: sp.h || 170,
          label: sp.label || `NODE / ${idx + 1}`,
          text: sp.text || '',
          parentId: null,
          highlight: idx === 1,
          collapsed: false,
          isStarter: true, // Templates also start as example content until edited or included
        };
      });

      const createdLinks = [];
      const stepPieces = createdPieces.filter((p) => p.type === 'step');
      for (let i = 0; i < stepPieces.length - 1; i++) {
        createdLinks.push({
          id: uid('lk'),
          from: stepPieces[i].id,
          to: stepPieces[i + 1].id,
        });
      }

      return {
        pieces: createdPieces,
        links: createdLinks,
        drawings: [],
        constraints: `Template Blueprint: ${tmpl.title}`,
        _userChoseStarter: true,
      };
    });
  }, [pushHistory]);

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const last = historyRef.current.pop();
    futureRef.current.push(JSON.parse(JSON.stringify(board)));
    setBoard(last);
  }, [board]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current.pop();
    historyRef.current.push(JSON.parse(JSON.stringify(board)));
    setBoard(next);
  }, [board]);

  const reset = useCallback(() => {
    pushHistory(board);
    setBoard(seed());
  }, [board, pushHistory]);

  const clearAll = useCallback(() => {
    pushHistory(board);
    setBoard({ pieces: [], links: [], drawings: [], constraints: '' });
  }, [board, pushHistory]);

  const load = useCallback((data) => {
    if (!data) return;
    const migrated = data._migratedFromV2 ? data : migrateV2Board(data) || data;
    if (migrated && Array.isArray(migrated.pieces)) {
      pushHistory(board);
      setBoard({
        pieces: migrated.pieces,
        links: Array.isArray(migrated.links) ? migrated.links : [],
        drawings: Array.isArray(migrated.drawings) ? migrated.drawings : [],
        constraints: typeof migrated.constraints === 'string' ? migrated.constraints : '',
      });
    }
  }, [board, pushHistory]);

  const saveNow = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(board));
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(board));
      setSaved(true);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [board]);

  return {
    pieces: board.pieces,
    links: board.links,
    drawings: board.drawings || [],
    constraints: board.constraints || '',
    saved,
    canUndo: historyRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    addPiece,
    addStep,
    setPieceState,
    updatePiece,
    updateConstraints,
    resizePiece,
    duplicatePiece,
    ungroupRow,
    toggleCollapsePiece,
    moveTo,
    settle,
    removePiece,
    toggleHighlight,
    addLink,
    removeLink,
    toggleLink,
    addDrawingStroke,
    clearDrawings,
    loadBlankBoard,
    loadWebsiteSketchStarter,
    loadIdeaCollectionStarter,
    loadStarterWorkflow,
    loadTemplate,
    undo,
    redo,
    reset,
    clearAll,
    load,
    saveNow,
  };
}
