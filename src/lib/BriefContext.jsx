import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'contextmuse_visitor_brief_v1';

const defaultState = {
  savedProjects: [], // [{ id, title, subtitle, tier, note, addedAt }]
  auditFindings: [], // [{ id, pillar, title, severity, fix, url, addedAt }]
  whiteboardClips: [], // [{ id, title, note, dataUrl, source, pagePath, snapshot, addedAt }]
  labClippings: [], // [{ id, tool, summary, addedAt }]
  inquiry: {
    name: '',
    email: '',
    projectType: '',
    budget: '',
    notes: '',
  },
};

const BriefContext = createContext(null);

export function BriefProvider({ children }) {
  const [brief, setBrief] = useState(() => {
    if (typeof window === 'undefined') return defaultState;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState;
      const parsed = JSON.parse(raw);
      return {
        ...defaultState,
        ...parsed,
        inquiry: { ...defaultState.inquiry, ...(parsed.inquiry || {}) },
      };
    } catch {
      return defaultState;
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pageMarkupActive, setPageMarkupActive] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(brief));
    } catch {
      // Ignore storage quota errors
    }
  }, [brief]);

  const toggleSaveProject = useCallback((project, note = '') => {
    setBrief((prev) => {
      const exists = prev.savedProjects.some((p) => p.id === project.id);
      if (exists) {
        return {
          ...prev,
          savedProjects: prev.savedProjects.filter((p) => p.id !== project.id),
        };
      }
      return {
        ...prev,
        savedProjects: [
          ...prev.savedProjects,
          {
            id: project.id,
            title: project.title,
            subtitle: project.subtitle,
            tier: project.tier,
            note,
            addedAt: new Date().toISOString(),
          },
        ],
      };
    });
  }, []);

  const isProjectSaved = useCallback(
    (id) => brief.savedProjects.some((p) => p.id === id),
    [brief.savedProjects]
  );

  const addAuditFinding = useCallback((finding) => {
    setBrief((prev) => {
      const id = finding.id || `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      if (prev.auditFindings.some((f) => f.title === finding.title && f.url === finding.url)) {
        return prev;
      }
      return {
        ...prev,
        auditFindings: [
          ...prev.auditFindings,
          {
            ...finding,
            id,
            addedAt: new Date().toISOString(),
          },
        ],
      };
    });
  }, []);

  const removeAuditFinding = useCallback((id) => {
    setBrief((prev) => ({
      ...prev,
      auditFindings: prev.auditFindings.filter((f) => f.id !== id),
    }));
  }, []);

  const addWhiteboardClip = useCallback((clip) => {
    setBrief((prev) => ({
      ...prev,
      whiteboardClips: [
        ...prev.whiteboardClips,
        {
          id: `wb-${Date.now()}`,
          title: clip.title || 'Whiteboard Snapshot',
          note: clip.note || '',
          dataUrl: clip.dataUrl || null,
          source: clip.source || 'whiteboard',
          pagePath: clip.pagePath || null,
          snapshot: clip.snapshot || null,
          addedAt: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  const removeWhiteboardClip = useCallback((id) => {
    setBrief((prev) => ({
      ...prev,
      whiteboardClips: prev.whiteboardClips.filter((c) => c.id !== id),
    }));
  }, []);

  const addLabClipping = useCallback((clip) => {
    setBrief((prev) => ({
      ...prev,
      labClippings: [
        ...prev.labClippings,
        {
          id: `lab-${Date.now()}`,
          tool: clip.tool,
          summary: clip.summary,
          addedAt: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  const removeLabClipping = useCallback((id) => {
    setBrief((prev) => ({
      ...prev,
      labClippings: prev.labClippings.filter((c) => c.id !== id),
    }));
  }, []);

  const updateInquiry = useCallback((patch) => {
    setBrief((prev) => ({
      ...prev,
      inquiry: { ...prev.inquiry, ...patch },
    }));
  }, []);

  const clearBrief = useCallback(() => {
    setBrief(defaultState);
  }, []);

  const totalCount =
    brief.savedProjects.length +
    brief.auditFindings.length +
    brief.whiteboardClips.length +
    brief.labClippings.length;

  return (
    <BriefContext.Provider
      value={{
        brief,
        totalCount,
        isDrawerOpen,
        setIsDrawerOpen,
        openBrief: () => setIsDrawerOpen(true),
        closeBrief: () => setIsDrawerOpen(false),
        pageMarkupActive,
        setPageMarkupActive,
        openPageMarkup: () => setPageMarkupActive(true),
        closePageMarkup: () => setPageMarkupActive(false),
        toggleSaveProject,
        isProjectSaved,
        addAuditFinding,
        removeAuditFinding,
        addWhiteboardClip,
        removeWhiteboardClip,
        addLabClipping,
        removeLabClipping,
        updateInquiry,
        clearBrief,
      }}
    >
      {children}
    </BriefContext.Provider>
  );
}

export function useBrief() {
  const ctx = useContext(BriefContext);
  if (!ctx) {
    throw new Error('useBrief must be used within a BriefProvider');
  }
  return ctx;
}
