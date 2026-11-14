import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Layout,
  Highlighter,
  CheckCircle2,
  Bookmark,
  Download,
  Trash2,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';

const CATEGORY_OPTIONS = [
  'Website',
  'Apps & Tools',
  'Brand & Design',
  'Not Sure',
];

function serializeBriefSummary(brief, overrides = {}) {
  const name = overrides.name ?? brief.inquiry?.name ?? '';
  const email = overrides.email ?? brief.inquiry?.email ?? '';
  const company = overrides.company ?? brief.inquiry?.company ?? '';
  const projectType = overrides.projectType ?? brief.inquiry?.projectType ?? '';
  const description = overrides.description ?? brief.inquiry?.notes ?? '';

  const lines = [
    '# CONTEXT & MUSE — PROJECT INQUIRY & SAVED IDEAS',
    `Generated: ${new Date().toLocaleDateString()}`,
    '',
    '## 1. INQUIRY DETAILS',
    `- **Name:** ${name || 'Not specified'}`,
    `- **Email:** ${email || 'Not specified'}`,
    ...(company ? [`- **Business / Site:** ${company}`] : []),
    `- **What are you looking to create?:** ${projectType || 'Not specified'}`,
    `- **Project Description:** ${description || 'None'}`,
    '',
  ];

  if (brief.savedProjects?.length > 0) {
    lines.push('## 2. SAVED REFERENCE SYSTEMS (THE WORK)');
    brief.savedProjects.forEach((p, idx) => {
      lines.push(`${idx + 1}. **${p.title}** (${p.subtitle})`);
    });
    lines.push('');
  }

  if (brief.whiteboardClips?.length > 0) {
    lines.push('## 3. WHITEBOARD & PAGE MARKUP SNAPSHOTS');
    brief.whiteboardClips.forEach((c, idx) => {
      lines.push(
        `${idx + 1}. **[${(c.source || 'whiteboard').toUpperCase()}] ${c.title}** — ${c.note}`
      );
    });
    lines.push('');
  }

  return lines.join('\n');
}

export default function BuildEntryMethods({
  isWhiteboardOpen,
  onOpenWhiteboard,
  onOpenPageMarkup,
}) {
  const { brief, totalCount, updateInquiry, removeWhiteboardClip, openBrief } = useBrief();

  const [description, setDescription] = useState(brief.inquiry?.notes || '');
  const [category, setCategory] = useState(brief.inquiry?.projectType || '');
  const [name, setName] = useState(brief.inquiry?.name || '');
  const [email, setEmail] = useState(brief.inquiry?.email || '');
  const [company, setCompany] = useState(brief.inquiry?.company || '');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  // Keep form fields synchronized when brief.inquiry updates from Whiteboard attach or BriefDrawer
  useEffect(() => {
    setDescription(brief.inquiry?.notes || '');
    setCategory(brief.inquiry?.projectType || '');
    setName(brief.inquiry?.name || '');
    setEmail(brief.inquiry?.email || '');
    setCompany(brief.inquiry?.company || '');
  }, [
    brief.inquiry?.notes,
    brief.inquiry?.projectType,
    brief.inquiry?.name,
    brief.inquiry?.email,
    brief.inquiry?.company,
  ]);

  const handleFieldSync = (patch) => {
    updateInquiry(patch);
  };

  const handleDirectSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setErrorMsg('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedCompany = company.trim();
    const trimmedNotes = description.trim();
    const hasAttachedItems = Boolean(totalCount > 0);
    const hasInquiryDetails = Boolean(trimmedNotes || hasAttachedItems);

    updateInquiry({
      name,
      email,
      company,
      projectType: category,
      notes: description,
    });

    const summaryText = serializeBriefSummary(brief, {
      name: trimmedName,
      email: trimmedEmail,
      company: trimmedCompany,
      projectType: category,
      description: trimmedNotes,
    });

    const serializedClips = (brief.whiteboardClips || []).map((c) => ({
      id: c.id,
      title: c.title,
      note: c.note,
      source: c.source || 'whiteboard',
      pagePath: c.pagePath || null,
      snapshot: c.snapshot || null,
      hasVisualSnapshot: Boolean(c.dataUrl),
      addedAt: c.addedAt,
    }));

    const payload = {
      form_id: 'build-direct-inquiry',
      source_page: typeof window !== 'undefined' ? window.location.pathname : '/build/',
      inquiry_type: category || 'custom',
      name: trimmedName,
      email: trimmedEmail,
      company: trimmedCompany,
      source: 'contextmuse_build_direct_inquiry',
      category: category || 'Custom Build Inquiry',
      budget_band: brief.inquiry?.budget || 'Not specified',
      message: hasInquiryDetails ? `${trimmedNotes}\n\n---\n${summaryText}`.trim() : '',
      answers_json: {
        project_type: category || 'Custom Build Inquiry',
        company: trimmedCompany,
        notes: trimmedNotes,
        include_saved_items: true,
        saved_projects: (brief.savedProjects || []).map((p) => ({ id: p.id, title: p.title })),
        audit_findings: brief.auditFindings || [],
        whiteboard_clips: serializedClips,
        whiteboard_snapshots: serializedClips.filter((c) => c.source !== 'page-markup'),
        page_annotations: serializedClips.filter((c) => c.source === 'page-markup'),
        lab_clippings: brief.labClippings || [],
      },
    };

    try {
      const response = await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok === false || result.success === false) {
        throw new Error(result.error || result.message || 'Unable to submit inquiry right now.');
      }
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err.message ||
          'Could not reach our server directly. You can download a copy of your note below or email hello@contextmuse.com.'
      );
    }
  };

  const handleDownloadBackup = () => {
    const md = serializeBriefSummary(brief, {
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      projectType: category,
      description: description.trim(),
    });
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contextmuse-inquiry-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const attachedClips = brief.whiteboardClips || [];

  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-8 pt-4 pb-2 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================
            PRIMARY PATH: SIMPLE, CONVERSATIONAL PROJECT INQUIRY
            ============================================================ */}
        <div
          data-testid="primary-inquiry-card"
          className="lg:col-span-8 rounded-xl border-2 border-[#23282A] bg-[#DFDACE] p-5 sm:p-8 shadow-[6px_6px_0_#23282A]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest font-bold text-[#17504A] bg-[#17504A]/10 px-2.5 py-1 rounded">
              <MessageSquare className="h-3.5 w-3.5" />
              Start a Conversation
            </span>
            {totalCount > 0 && (
              <button
                type="button"
                onClick={openBrief}
                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#23282A] underline underline-offset-4 hover:text-[#17504A] min-h-[44px] px-2"
              >
                <Bookmark className="h-3.5 w-3.5 text-[#D9A62E]" />
                <span>Saved Ideas ({totalCount})</span>
              </button>
            )}
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#23282A] tracking-tight">
            What would you like to create?
          </h2>
          <p className="mt-2 font-sans text-sm sm:text-base text-[#23282A]/80 max-w-2xl leading-relaxed">
            Tell me what you have in mind, what isn&apos;t working, or what you wish existed. You don&apos;t need to know the technical details.
          </p>

          {status === 'sent' ? (
            <div
              data-testid="direct-inquiry-success"
              className="mt-6 rounded-lg border-2 border-[#17504A] bg-[#17504A]/10 p-5 space-y-3"
            >
              <div className="flex items-center gap-2 text-[#17504A] font-mono text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Thank you — your project note has been received</span>
              </div>
              <p className="font-sans text-sm text-[#23282A]/85 leading-relaxed">
                I&apos;ve saved your description
                {attachedClips.length > 0 ? ' along with your attached visual notes' : ''} and will follow up at{' '}
                <strong className="font-semibold">{email || 'your email'}</strong>.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="min-h-[44px] px-4 py-2 rounded bg-[#23282A] text-[#EDE9E0] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#17504A] transition-colors"
                >
                  Edit or Add More Details
                </button>
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded border border-[#23282A]/30 font-mono text-xs text-[#23282A] hover:bg-[#23282A]/5 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download a Copy (.md)</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDirectSubmit} className="mt-5 space-y-4">
              {/* Optional plain-language category chips */}
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-[#23282A]/70 font-bold mb-2">
                  What kind of project is this? (Optional)
                </span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((opt) => {
                    const active = category === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          const next = active ? '' : opt;
                          setCategory(next);
                          handleFieldSync({ projectType: next });
                        }}
                        className={`min-h-[44px] px-3.5 py-2 rounded-lg font-sans text-xs sm:text-sm font-medium transition-all border ${
                          active
                            ? 'bg-[#23282A] text-[#EDE9E0] border-[#23282A] shadow-sm'
                            : 'bg-[#EDE9E0] text-[#23282A] border-[#23282A]/25 hover:border-[#23282A]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main project description field */}
              <div>
                <label
                  htmlFor="build-project-description"
                  className="block font-mono text-[11px] uppercase tracking-wider text-[#23282A]/80 font-bold mb-1.5"
                >
                  Your Idea or Goal
                </label>
                <textarea
                  id="build-project-description"
                  data-testid="build-project-description"
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    handleFieldSync({ notes: e.target.value });
                  }}
                  placeholder="For example: 'I want a clean website for my business where customers can see our work and request an estimate without calling back and forth...'"
                  className="w-full rounded-lg border-2 border-[#23282A]/30 bg-[#EDE9E0] p-3.5 font-sans text-sm sm:text-base text-[#23282A] placeholder:text-[#23282A]/45 focus:border-[#17504A] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Attached visual clips preview */}
              {attachedClips.length > 0 && (
                <div
                  data-testid="attached-visual-clips"
                  className="rounded-lg border border-[#17504A]/40 bg-[#EDE9E0] p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#17504A]">
                      Attached Visual Notes ({attachedClips.length})
                    </span>
                    <span className="font-sans text-xs text-[#23282A]/65">
                      Included automatically with your inquiry
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {attachedClips.map((clip) => (
                      <div
                        key={clip.id}
                        className="flex items-center gap-2.5 rounded border border-[#23282A]/15 bg-[#DFDACE] p-2"
                      >
                        {clip.dataUrl && (
                          <img
                            src={clip.dataUrl}
                            alt={clip.title}
                            className="h-12 w-16 object-cover rounded border border-[#23282A]/20 bg-[#1B1F21] shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-mono text-xs font-bold text-[#23282A] truncate">
                            {clip.title}
                          </div>
                          <div className="font-sans text-[11px] text-[#23282A]/70 truncate">
                            {clip.note}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeWhiteboardClip(clip.id)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded text-[#23282A]/60 hover:text-red-700 hover:bg-red-100/50"
                          title="Remove attachment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Simple contact row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="build-inquiry-name"
                    className="block font-mono text-[11px] uppercase tracking-wider text-[#23282A]/80 font-bold mb-1"
                  >
                    Your Name *
                  </label>
                  <input
                    id="build-inquiry-name"
                    data-testid="build-inquiry-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      handleFieldSync({ name: e.target.value });
                    }}
                    placeholder="Jane Doe"
                    className="w-full min-h-[44px] rounded-lg border border-[#23282A]/30 bg-[#EDE9E0] px-3 py-2 font-sans text-sm text-[#23282A] placeholder:text-[#23282A]/40 focus:border-[#17504A] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="build-inquiry-email"
                    className="block font-mono text-[11px] uppercase tracking-wider text-[#23282A]/80 font-bold mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    id="build-inquiry-email"
                    data-testid="build-inquiry-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      handleFieldSync({ email: e.target.value });
                    }}
                    placeholder="you@company.com"
                    className="w-full min-h-[44px] rounded-lg border border-[#23282A]/30 bg-[#EDE9E0] px-3 py-2 font-sans text-sm text-[#23282A] placeholder:text-[#23282A]/40 focus:border-[#17504A] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="build-inquiry-company"
                    className="block font-mono text-[11px] uppercase tracking-wider text-[#23282A]/80 font-bold mb-1"
                  >
                    Business / Site (Optional)
                  </label>
                  <input
                    id="build-inquiry-company"
                    data-testid="build-inquiry-company"
                    type="text"
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);
                      handleFieldSync({ company: e.target.value });
                    }}
                    placeholder="Acme Co."
                    className="w-full min-h-[44px] rounded-lg border border-[#23282A]/30 bg-[#EDE9E0] px-3 py-2 font-sans text-sm text-[#23282A] placeholder:text-[#23282A]/40 focus:border-[#17504A] focus:outline-none"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="rounded-lg border border-red-800/30 bg-red-950/10 p-3 text-xs font-sans text-red-950 flex flex-wrap items-center justify-between gap-2">
                  <span>{errorMsg}</span>
                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="underline font-mono font-bold"
                  >
                    Download Backup (.md)
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  data-testid="build-send-inquiry-btn"
                  disabled={status === 'sending'}
                  className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-lg bg-[#23282A] text-[#EDE9E0] px-6 py-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#17504A] transition-colors shadow-[3px_3px_0_#D9A62E] disabled:opacity-50"
                >
                  <Send className="h-4 w-4 text-[#D9A62E]" />
                  <span>
                    {status === 'sending' ? 'Sending Your Note...' : 'Send Project Inquiry'}
                  </span>
                </button>

                <span className="font-sans text-xs text-[#23282A]/65">
                  No technical specs required. Your notes save automatically as you type.
                </span>
              </div>
            </form>
          )}
        </div>

        {/* ============================================================
            SECONDARY OPTIONAL PATH: "RATHER SHOW ME?"
            ============================================================ */}
        <div
          data-testid="rather-show-me-card"
          className="lg:col-span-4 rounded-xl border-2 border-[#23282A] bg-[#23282A] text-[#EDE9E0] p-5 sm:p-7 shadow-[6px_6px_0_#17504A] flex flex-col justify-between"
        >
          <div>
            <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-[#D9A62E] font-bold bg-[#D9A62E]/15 px-2.5 py-1 rounded mb-3">
              Optional Visual Tools
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EDE9E0] tracking-tight">
              Rather show me?
            </h3>
            <p className="mt-2 font-sans text-sm text-[#EDE9E0]/80 leading-relaxed">
              Sketch an idea, arrange notes, or show me something you like.
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                data-testid="open-whiteboard-btn"
                onClick={onOpenWhiteboard}
                className={`w-full min-h-[48px] flex items-center justify-between gap-3 rounded-lg px-4 py-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border-2 ${
                  isWhiteboardOpen
                    ? 'bg-[#17504A] text-[#EDE9E0] border-[#D9A62E]'
                    : 'bg-[#D9A62E] text-[#141617] border-[#D9A62E] hover:bg-[#e5b43c]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Layout className="h-4 w-4 shrink-0" />
                  <span>{isWhiteboardOpen ? 'Whiteboard Open Below' : 'Open Whiteboard'}</span>
                </span>
                <span className="text-[11px] opacity-80">→</span>
              </button>

              <button
                type="button"
                data-testid="mark-up-page-btn"
                onClick={onOpenPageMarkup}
                className="w-full min-h-[48px] flex items-center justify-between gap-3 rounded-lg border-2 border-[#DFDACE]/30 bg-[#1B1F21] text-[#EDE9E0] px-4 py-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Highlighter className="h-4 w-4 text-[#D9A62E] shrink-0" />
                  <span>Mark Up This Page</span>
                </span>
                <span className="text-[11px] opacity-75">18% Ink</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#DFDACE]/15 font-sans text-xs text-[#DFDACE]/70 leading-relaxed">
            Use the whiteboard if you want to drop in screenshots, jot sticky notes, or rough out a page. Or skip it completely and just send a note on the left.
          </div>
        </div>
      </div>
    </section>
  );
}
