import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'contextmuse:brief:v2';

const BriefContext = createContext(null);

export const useBrief = () => {
  const context = useContext(BriefContext);
  if (!context) {
    throw new Error('useBrief must be used within a BriefProvider');
  }
  return context;
};

export const BriefProvider = ({ children }) => {
  const [brief, setBrief] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load brief from localStorage', e);
    }
    return {
      savedProjects: [],
      activeTemplate: null,
      savedAuditFindings: [],
      whiteboardClips: [],
      inquiry: {
        name: '',
        email: '',
        organization: '',
        projectType: 'custom-system',
        timeline: '1-3-months',
        notes: '',
      },
    };
  });

  const [isOpen, setIsOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brief));
    } catch (e) {
      console.error('Failed to save brief to localStorage', e);
    }
  }, [brief]);

  const toggleSaveProject = (project) => {
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
            category: project.category,
            accentColor: project.accentColor,
            savedAt: new Date().toISOString(),
          },
        ],
      };
    });
  };

  const isProjectSaved = (projectId) => {
    return brief.savedProjects.some((p) => p.id === projectId);
  };

  const removeProject = (projectId) => {
    setBrief((prev) => ({
      ...prev,
      savedProjects: prev.savedProjects.filter((p) => p.id !== projectId),
    }));
  };

  const setTemplate = (template) => {
    setBrief((prev) => ({
      ...prev,
      activeTemplate: template
        ? {
            id: template.id,
            title: template.title,
            badge: template.badge,
            readiness: template.readiness,
            selectedAt: new Date().toISOString(),
          }
        : null,
    }));
  };

  const clearTemplate = () => {
    setBrief((prev) => ({ ...prev, activeTemplate: null }));
  };

  const saveAuditFinding = (finding) => {
    setBrief((prev) => {
      const id = finding.id || `fnd_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const exists = prev.savedAuditFindings.some((f) => f.id === id || f.issue === finding.issue);
      if (exists) return prev;
      return {
        ...prev,
        savedAuditFindings: [
          ...prev.savedAuditFindings,
          {
            id,
            issue: finding.issue,
            category: finding.category,
            severity: finding.severity || 'Medium',
            recommendation: finding.recommendation,
            targetUrl: finding.targetUrl || '',
            savedAt: new Date().toISOString(),
          },
        ],
      };
    });
  };

  const removeAuditFinding = (id) => {
    setBrief((prev) => ({
      ...prev,
      savedAuditFindings: prev.savedAuditFindings.filter((f) => f.id !== id),
    }));
  };

  const isFindingSaved = (issueText) => {
    return brief.savedAuditFindings.some((f) => f.issue === issueText);
  };

  const addWhiteboardClip = (clip) => {
    setBrief((prev) => ({
      ...prev,
      whiteboardClips: [
        ...prev.whiteboardClips,
        {
          id: `clip_${Date.now()}`,
          type: clip.type || 'note',
          text: clip.text || '',
          dataUrl: clip.dataUrl || null,
          title: clip.title || 'Whiteboard Clip',
          savedAt: new Date().toISOString(),
        },
      ],
    }));
  };

  const removeWhiteboardClip = (id) => {
    setBrief((prev) => ({
      ...prev,
      whiteboardClips: prev.whiteboardClips.filter((c) => c.id !== id),
    }));
  };

  const updateInquiry = (field, value) => {
    setBrief((prev) => ({
      ...prev,
      inquiry: {
        ...prev.inquiry,
        [field]: typeof value === 'function' ? value(prev.inquiry[field]) : value,
      },
    }));
  };

  const clearBrief = () => {
    setBrief({
      savedProjects: [],
      activeTemplate: null,
      savedAuditFindings: [],
      whiteboardClips: [],
      inquiry: {
        name: '',
        email: '',
        organization: '',
        projectType: 'custom-system',
        timeline: '1-3-months',
        notes: '',
      },
    });
  };

  const totalCount = useMemo(() => {
    return (
      brief.savedProjects.length +
      (brief.activeTemplate ? 1 : 0) +
      brief.savedAuditFindings.length +
      brief.whiteboardClips.length
    );
  }, [brief]);

  const exportDossier = () => {
    const dossier = {
      title: 'ContextMuse Project Brief Dossier',
      generatedAt: new Date().toISOString(),
      clientInquiry: brief.inquiry,
      selectedStartingBlueprint: brief.activeTemplate,
      referencedWorkProof: brief.savedProjects,
      diagnosticFindings: brief.savedAuditFindings,
      whiteboardNotesAndClips: brief.whiteboardClips,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dossier, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `contextmuse-brief-${Date.now().toString(36)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportMarkdown = () => {
    let md = `# ContextMuse Project Brief Dossier\n\n`;
    md += `*Generated: ${new Date().toLocaleDateString()}*\n\n`;
    md += `## 1. Inquiry Details\n`;
    md += `- **Name:** ${brief.inquiry.name || 'Not provided'}\n`;
    md += `- **Email:** ${brief.inquiry.email || 'Not provided'}\n`;
    md += `- **Organization:** ${brief.inquiry.organization || 'Not provided'}\n`;
    md += `- **Project Type:** ${brief.inquiry.projectType}\n`;
    md += `- **Timeline:** ${brief.inquiry.timeline}\n`;
    md += `- **Initial Notes:** ${brief.inquiry.notes || 'None'}\n\n`;

    if (brief.activeTemplate) {
      md += `## 2. Selected Starting Blueprint\n`;
      md += `- **${brief.activeTemplate.title}** (${brief.activeTemplate.badge} - ${brief.activeTemplate.readiness})\n\n`;
    }

    if (brief.savedProjects.length > 0) {
      md += `## 3. Referenced Systems & Proof\n`;
      brief.savedProjects.forEach((p) => {
        md += `- **${p.title}**: ${p.subtitle}\n`;
      });
      md += `\n`;
    }

    if (brief.savedAuditFindings.length > 0) {
      md += `## 4. Website Diagnostic Findings\n`;
      brief.savedAuditFindings.forEach((f) => {
        md += `### [${f.severity}] ${f.issue}\n`;
        md += `- **Category:** ${f.category}\n`;
        md += `- **Recommendation:** ${f.recommendation}\n\n`;
      });
    }

    if (brief.whiteboardClips.length > 0) {
      md += `## 5. Whiteboard Notes & Scope Clips\n`;
      brief.whiteboardClips.forEach((c) => {
        md += `- **${c.title}**: ${c.text}\n`;
      });
      md += `\n`;
    }

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `contextmuse-brief-${Date.now().toString(36)}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <BriefContext.Provider
      value={{
        brief,
        isOpen,
        openBrief: () => setIsOpen(true),
        closeBrief: () => setIsOpen(false),
        toggleSaveProject,
        isProjectSaved,
        removeProject,
        setTemplate,
        clearTemplate,
        saveAuditFinding,
        removeAuditFinding,
        isFindingSaved,
        addWhiteboardClip,
        removeWhiteboardClip,
        updateInquiry,
        clearBrief,
        totalCount,
        exportDossier,
        exportMarkdown,
      }}
    >
      {children}
    </BriefContext.Provider>
  );
};
