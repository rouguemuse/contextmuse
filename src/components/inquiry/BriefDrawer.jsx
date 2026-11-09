import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Trash2,
  Send,
  Download,
  Bookmark,
  ShieldAlert,
  Layout,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Highlighter,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';

const PROJECT_TYPES = [
  'Website',
  'Brand & Design',
  'Content & Templates',
  'Apps & Tools',
  'Not Sure',
];

const BUDGET_RANGES = [
  'Under $2k (Diagnostic / Starter)',
  '$2k – $5k (Focused Tool / Web System)',
  '$5k – $12k (Full Custom Build)',
  '$12k+ (Multi-System / Retainer)',
  'Open / Let’s Discuss',
];

export default function BriefDrawer() {
  const navigate = useNavigate();
  const {
    brief,
    totalCount,
    isDrawerOpen,
    closeBrief,
    openPageMarkup,
    toggleSaveProject,
    removeAuditFinding,
    removeWhiteboardClip,
    removeLabClipping,
    updateInquiry,
    clearBrief,
  } = useBrief();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [includeSavedItems, setIncludeSavedItems] = useState(true);

  if (!isDrawerOpen) return null;

  const generateMarkdownDossier = () => {
    const lines = [
      '# CONTEXT & MUSE — PROJECT INQUIRY & SAVED IDEAS',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      '## 1. INQUIRY DETAILS',
      `- **Name:** ${brief.inquiry.name || 'Not specified'}`,
      `- **Email:** ${brief.inquiry.email || 'Not specified'}`,
      `- **What are you looking to create?:** ${brief.inquiry.projectType || 'Not specified'}`,
      `- **Budget Range:** ${brief.inquiry.budget || 'Not specified'}`,
      `- **Notes:** ${brief.inquiry.notes || 'None'}`,
      '',
    ];

    if (includeSavedItems && brief.savedProjects.length > 0) {
      lines.push('## 2. SAVED REFERENCE SYSTEMS (THE WORK)');
      brief.savedProjects.forEach((p, idx) => {
        lines.push(`${idx + 1}. **${p.title}** (${p.subtitle})`);
      });
      lines.push('');
    }

    if (includeSavedItems && brief.auditFindings.length > 0) {
      lines.push('## 3. PINNED DIAGNOSTIC FINDINGS (AUDIT)');
      brief.auditFindings.forEach((f, idx) => {
        lines.push(`${idx + 1}. **[${f.pillar}] ${f.title}** (${f.severity})`);
        lines.push(`   - Target: ${f.url || 'Sample'}`);
        lines.push(`   - Recommended Fix: ${f.fix}`);
      });
      lines.push('');
    }

    if (includeSavedItems && brief.whiteboardClips.length > 0) {
      lines.push('## 4. WHITEBOARD & PAGE MARKUP SNAPSHOTS');
      brief.whiteboardClips.forEach((c, idx) => {
        lines.push(
          `${idx + 1}. **[${(c.source || 'whiteboard').toUpperCase()}] ${c.title}** — ${c.note}`
        );
      });
      lines.push('');
    }

    if (includeSavedItems && brief.labClippings.length > 0) {
      lines.push('## 5. WORKBENCH EXPERIMENT CLIPPINGS');
      brief.labClippings.forEach((c, idx) => {
        lines.push(`${idx + 1}. **${c.tool}** — ${c.summary}`);
      });
      lines.push('');
    }

    return lines.join('\n');
  };

  const handleExportDossier = () => {
    const md = generateMarkdownDossier();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contextmuse-project-ideas-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const dossierText = generateMarkdownDossier();
    const serializedClips = includeSavedItems
      ? brief.whiteboardClips.map((c) => ({
          id: c.id,
          title: c.title,
          note: c.note,
          source: c.source || 'whiteboard',
          pagePath: c.pagePath || null,
          snapshot: c.snapshot || null,
          hasVisualSnapshot: Boolean(c.dataUrl),
          addedAt: c.addedAt,
        }))
      : [];

    const payload = {
      name: brief.inquiry.name,
      email: brief.inquiry.email,
      source: 'contextmuse_brief_drawer',
      category: brief.inquiry.projectType || 'General Inquiry',
      budget_band: brief.inquiry.budget || 'Not specified',
      message: `${brief.inquiry.notes || ''}\n\n---\n${dossierText}`.trim(),
      answers_json: {
        project_type: brief.inquiry.projectType,
        budget: brief.inquiry.budget,
        notes: brief.inquiry.notes,
        include_saved_items: includeSavedItems,
        saved_projects: includeSavedItems
          ? brief.savedProjects.map((p) => ({ id: p.id, title: p.title }))
          : [],
        audit_findings: includeSavedItems ? brief.auditFindings : [],
        whiteboard_clips: serializedClips,
        whiteboard_snapshots: serializedClips.filter((c) => c.source !== 'page-markup'),
        page_annotations: serializedClips.filter((c) => c.source === 'page-markup'),
        lab_clippings: includeSavedItems ? brief.labClippings : [],
      },
    };

    try {
      const response = await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.ok === false) {
        throw new Error(result.message || 'Unable to submit inquiry right now.');
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err.message || 'Submission failed. You can also download your summary below.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={closeBrief}
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative flex h-full w-full max-w-xl flex-col bg-[#EDE9E0] text-[#23282A] shadow-2xl border-l-2 border-[#23282A] font-sans overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-2 border-[#23282A] bg-[#23282A] px-6 py-4 text-[#EDE9E0]">
          <div className="flex items-center gap-2.5">
            <Lightbulb className="h-5 w-5 text-[#D9A62E]" />
            <div>
              <h2 className="font-display text-lg font-extrabold uppercase tracking-wider">
                Start a Project
              </h2>
              <p className="font-mono text-[11px] text-[#EDE9E0]/70">
                Tell me what you have in mind • {totalCount} saved item
                {totalCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>
          <button
            onClick={closeBrief}
            className="rounded p-1.5 text-[#EDE9E0]/70 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Entry Paths: Mark up this page OR Open the whiteboard */}
          <div className="rounded-lg border border-[#23282A]/20 bg-white/70 p-3.5 space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#17504A] block">
              Rather show than tell? Attach visual notes:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  closeBrief();
                  openPageMarkup();
                }}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded border border-[#23282A]/25 bg-[#EDE9E0] hover:bg-[#23282A] hover:text-[#EDE9E0] font-mono text-[11px] font-bold uppercase tracking-wider transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Highlighter className="h-3.5 w-3.5 text-[#D9A62E]" />
                  <span>Mark up this page</span>
                </span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  closeBrief();
                  navigate('/build');
                }}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded border border-[#23282A]/25 bg-[#EDE9E0] hover:bg-[#23282A] hover:text-[#EDE9E0] font-mono text-[11px] font-bold uppercase tracking-wider transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Layout className="h-3.5 w-3.5 text-[#17504A]" />
                  <span>Open the whiteboard</span>
                </span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* 1. Primary Inquiry Form */}
          <div className="space-y-4">
            {submitted ? (
              <div className="rounded-lg border-2 border-[#17504A] bg-[#17504A]/10 p-5 text-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-[#17504A] mx-auto" />
                <h4 className="font-display text-lg font-bold uppercase text-[#17504A]">
                  Project Inquiry Received
                </h4>
                <p className="text-xs text-[#23282A]/80 leading-relaxed">
                  Thank you! Your project details
                  {includeSavedItems && totalCount > 0 ? ' and attached notes/snapshots' : ''} have
                  been saved. You can also download a Markdown copy for your records below.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={handleExportDossier}
                    className="flex items-center gap-1.5 bg-[#23282A] text-[#EDE9E0] px-4 py-2 text-xs font-mono uppercase tracking-wider rounded hover:bg-[#17504A] transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-[#D9A62E]" />
                    <span>Download Copy (.MD)</span>
                  </button>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-3 py-2 text-xs font-mono uppercase underline text-[#23282A]/70 hover:text-[#23282A]"
                  >
                    Edit Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#23282A]/70 mb-1 font-bold">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={brief.inquiry.name}
                      onChange={(e) => updateInquiry({ name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full border border-[#23282A]/30 bg-white px-3 py-2 text-xs focus:border-[#17504A] focus:outline-none rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#23282A]/70 mb-1 font-bold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={brief.inquiry.email}
                      onChange={(e) => updateInquiry({ email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full border border-[#23282A]/30 bg-white px-3 py-2 text-xs focus:border-[#17504A] focus:outline-none rounded-sm"
                    />
                  </div>
                </div>

                {/* Project Category Chips */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#23282A]/70 mb-1.5 font-bold">
                    What are you looking to create?
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PROJECT_TYPES.map((type) => {
                      const active = brief.inquiry.projectType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => updateInquiry({ projectType: active ? '' : type })}
                          className={`px-2.5 py-1.5 text-xs font-mono rounded-sm border transition-colors ${
                            active
                              ? 'bg-[#17504A] text-[#EDE9E0] border-[#17504A] font-bold'
                              : 'bg-white text-[#23282A] border-[#23282A]/25 hover:border-[#23282A]'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#23282A]/70 mb-1 font-bold">
                    Estimated Budget Range (Optional)
                  </label>
                  <select
                    value={brief.inquiry.budget}
                    onChange={(e) => updateInquiry({ budget: e.target.value })}
                    className="w-full border border-[#23282A]/30 bg-white px-3 py-2 text-xs focus:border-[#17504A] focus:outline-none rounded-sm"
                  >
                    <option value="">Select a range...</option>
                    {BUDGET_RANGES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#23282A]/70 mb-1 font-bold">
                    Tell me a bit about what you want to make or improve
                  </label>
                  <textarea
                    rows={4}
                    value={brief.inquiry.notes}
                    onChange={(e) => updateInquiry({ notes: e.target.value })}
                    placeholder="Whether you have a rough idea, an existing website to refresh, or a workflow you want to simplify..."
                    className="w-full border border-[#23282A]/30 bg-white p-3 text-xs focus:border-[#17504A] focus:outline-none rounded-sm leading-relaxed"
                  />
                </div>

                {totalCount > 0 && (
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={includeSavedItems}
                      onChange={(e) => setIncludeSavedItems(e.target.checked)}
                      className="rounded border-[#23282A]/40 text-[#17504A] focus:ring-[#17504A]"
                    />
                    <span className="text-xs text-[#23282A]/80 font-medium">
                      Include my {totalCount} saved note{totalCount === 1 ? '' : 's'} / whiteboard
                      snapshot{totalCount === 1 ? '' : 's'} with this inquiry
                    </span>
                  </label>
                )}

                {submitError && (
                  <div className="rounded border border-red-600/40 bg-red-500/10 px-3 py-2 text-xs text-red-800 font-mono">
                    {submitError}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#17504A] text-[#EDE9E0] px-5 py-3 font-mono text-xs uppercase tracking-wider font-bold rounded-sm hover:bg-[#23282A] transition-colors shadow-md disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5 text-[#D9A62E]" />
                    <span>{submitting ? 'Sending Inquiry…' : 'Send Project Inquiry'}</span>
                  </button>

                  {totalCount > 0 && (
                    <button
                      type="button"
                      onClick={handleExportDossier}
                      className="flex items-center gap-1.5 border border-[#23282A] bg-white px-3.5 py-3 font-mono text-xs uppercase tracking-wider hover:bg-[#23282A] hover:text-[#EDE9E0] transition-colors rounded-sm"
                      title="Download saved ideas as Markdown"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export .MD</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* 2. Saved Items & Snapshots Section */}
          {totalCount > 0 && (
            <div className="border-t-2 border-[#23282A]/15 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#17504A]">
                  Attached Notes, Markup &amp; Reference Ideas ({totalCount})
                </h3>
                <button
                  onClick={clearBrief}
                  className="text-[11px] font-mono text-red-700 hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Whiteboard & Page Markup Snapshots */}
              {brief.whiteboardClips.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider font-bold text-[#23282A]/70">
                    <Layout className="h-3.5 w-3.5 text-[#17504A]" />
                    <span>Whiteboard &amp; Page Markup ({brief.whiteboardClips.length})</span>
                  </div>
                  <div className="space-y-2">
                    {brief.whiteboardClips.map((c) => (
                      <div
                        key={c.id}
                        className="rounded border border-[#23282A]/20 bg-white p-3 shadow-sm space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-[#17504A] text-[#EDE9E0] font-mono text-[9px] font-bold uppercase">
                                {c.source === 'page-markup' ? 'Page Markup' : 'Whiteboard'}
                              </span>
                              <span className="font-display text-sm font-bold">{c.title}</span>
                            </div>
                            <p className="text-xs text-[#23282A]/75 mt-1 whitespace-pre-line line-clamp-4 font-mono">
                              {c.note}
                            </p>
                          </div>
                          <button
                            onClick={() => removeWhiteboardClip(c.id)}
                            className="text-[#23282A]/40 hover:text-red-600 p-1 shrink-0"
                            title="Remove snapshot"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {c.dataUrl && (
                          <div className="rounded border border-[#23282A]/15 overflow-hidden bg-[#141617]">
                            <img
                              src={c.dataUrl}
                              alt={c.title}
                              className="w-full h-28 object-cover block"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Reference Projects */}
              {brief.savedProjects.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider font-bold text-[#17504A]">
                    <Bookmark className="h-3.5 w-3.5" />
                    <span>Saved Reference Projects ({brief.savedProjects.length})</span>
                  </div>
                  <div className="space-y-2">
                    {brief.savedProjects.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-3 rounded border border-[#23282A]/20 bg-white p-3 shadow-sm"
                      >
                        <div>
                          <div className="font-display text-sm font-bold">{p.title}</div>
                          <div className="font-mono text-[11px] text-[#23282A]/60">
                            {p.subtitle}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSaveProject(p)}
                          className="text-[#23282A]/40 hover:text-red-600 p-1"
                          title="Remove from ideas"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pinned Audit Findings */}
              {brief.auditFindings.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider font-bold text-[#991B1B]">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Pinned Diagnostic Findings ({brief.auditFindings.length})</span>
                  </div>
                  <div className="space-y-2">
                    {brief.auditFindings.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-start justify-between gap-3 rounded border border-[#23282A]/20 bg-white p-3 shadow-sm"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-[#23282A] px-1.5 py-0.5 font-mono text-[9px] uppercase text-[#D9A62E]">
                              {f.pillar}
                            </span>
                            <span className="font-display text-xs font-bold">{f.title}</span>
                          </div>
                          <p className="text-xs text-[#23282A]/75 leading-snug">{f.fix}</p>
                        </div>
                        <button
                          onClick={() => removeAuditFinding(f.id)}
                          className="text-[#23282A]/40 hover:text-red-600 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lab Clippings */}
              {brief.labClippings.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider font-bold text-[#23282A]/70">
                    <Sparkles className="h-3.5 w-3.5 text-[#D9A62E]" />
                    <span>Lab Clippings ({brief.labClippings.length})</span>
                  </div>
                  <div className="space-y-2">
                    {brief.labClippings.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-start justify-between gap-3 rounded border border-[#23282A]/20 bg-white p-3 shadow-sm"
                      >
                        <div>
                          <div className="font-mono text-[10px] uppercase text-[#17504A] font-bold">
                            {c.tool}
                          </div>
                          <p className="text-xs text-[#23282A]/80 mt-0.5">{c.summary}</p>
                        </div>
                        <button
                          onClick={() => removeLabClipping(c.id)}
                          className="text-[#23282A]/40 hover:text-red-600 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
