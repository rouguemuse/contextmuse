import React, { useState } from 'react';
import { useBrief } from '@/lib/BriefContext';
import {
  X,
  Trash2,
  Download,
  FileText,
  CheckCircle2,
  ArrowRight,
  Mail,
  Link as LinkIcon,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const PROJECT_CATEGORIES = [
  {
    id: 'Website',
    label: 'Website',
    inquiryType: 'quote',
    formId: 'qls-intake-form',
  },
  {
    id: 'Brand & Design',
    label: 'Brand & Design',
    inquiryType: 'custom',
    formId: 'custom-intake-form',
  },
  {
    id: 'Content & Templates',
    label: 'Content & Templates',
    inquiryType: 'custom',
    formId: 'custom-intake-form',
  },
  {
    id: 'Apps & Tools',
    label: 'Apps & Tools',
    inquiryType: 'systems',
    formId: 'systems-intake-form',
  },
  {
    id: 'Not Sure',
    label: 'Not Sure',
    inquiryType: 'contact',
    formId: 'contact-wizard',
  },
];

export default function BriefDrawer() {
  const {
    brief,
    isOpen,
    closeBrief,
    removeProject,
    clearTemplate,
    removeAuditFinding,
    removeWhiteboardClip,
    updateInquiry,
    clearBrief,
    totalCount,
    exportDossier,
    exportMarkdown,
  } = useBrief();

  const [activeTab, setActiveTab] = useState('inquiry'); // 'inquiry' | 'dossier'
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [attachedUrl, setAttachedUrl] = useState('');
  const [selectedProblem, setSelectedProblem] = useState('');

  if (!isOpen) return null;

  const isValidEmail = (email) => {
    if (typeof email !== 'string') return false;
    const re =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return re.test(email.trim()) && email.trim().length <= 255;
  };

  const resolveLeadRouting = () => {
    const matched = PROJECT_CATEGORIES.find(
      (c) =>
        c.id.toLowerCase() === (selectedProblem || '').toLowerCase() ||
        c.id.toLowerCase() === (brief.inquiry.projectType || '').toLowerCase()
    );
    if (matched) {
      return { formId: matched.formId, inquiryType: matched.inquiryType };
    }
    const pType = (brief.inquiry.projectType || '').toLowerCase();
    if (pType.includes('website') || pType.includes('quote')) {
      return { formId: 'qls-intake-form', inquiryType: 'quote' };
    }
    if (pType.includes('brand') || pType.includes('content') || pType.includes('template') || pType.includes('custom')) {
      return { formId: 'custom-intake-form', inquiryType: 'custom' };
    }
    if (pType.includes('app') || pType.includes('tool') || pType.includes('system') || pType.includes('operations')) {
      return { formId: 'systems-intake-form', inquiryType: 'systems' };
    }
    return { formId: 'contact-wizard', inquiryType: 'contact' };
  };

  const handleSelectProblem = (item) => {
    const next = selectedProblem === item.id ? '' : item.id;
    setSelectedProblem(next);
    setSubmitError('');
    updateInquiry('projectType', next || 'Not Sure');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmitError('');

    const trimmedName = (brief.inquiry.name || '').trim();
    const trimmedEmail = (brief.inquiry.email || '').trim();
    const trimmedNotes = (brief.inquiry.notes || '').trim();
    const trimmedUrl = (attachedUrl || '').trim();

    if (!trimmedName) {
      setSubmitError('Please provide your name.');
      return;
    }

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setSubmitError('Please provide a valid email address so I can respond to your inquiry.');
      return;
    }

    if (!trimmedNotes) {
      setSubmitError('Please share a brief description of what you would like to build or improve.');
      return;
    }

    const fullMessage =
      trimmedUrl && !trimmedNotes.includes(trimmedUrl)
        ? `${trimmedNotes}\n\nReference Link: ${trimmedUrl}`
        : trimmedNotes;

    if (trimmedUrl && !trimmedNotes.includes(trimmedUrl)) {
      updateInquiry('notes', fullMessage);
    }

    const { formId, inquiryType } = resolveLeadRouting();
    const rawPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const sourcePage = rawPath === '/' ? '/' : rawPath.endsWith('/') ? rawPath : `${rawPath}/`;

    const isTestSubmission =
      trimmedEmail.toLowerCase().endsWith('@example.com') ||
      trimmedName.toUpperCase().includes('[TEST]');

    const payload = {
      form_id: formId,
      source_page: sourcePage,
      inquiry_type: inquiryType,
      name: trimmedName,
      email: trimmedEmail,
      company: (brief.inquiry.organization || '').trim() || undefined,
      website: trimmedUrl || undefined,
      timeline: brief.inquiry.timeline || undefined,
      message: fullMessage,
      _gotcha: honeypot,
      is_test: isTestSubmission,
      answers_json: {
        project_category: selectedProblem || null,
        problem_focus: selectedProblem || null,
        project_type: selectedProblem || brief.inquiry.projectType || 'Not Sure',
        timeline: brief.inquiry.timeline || '1-3-months',
        reference_url: trimmedUrl || null,
        saved_projects: brief.savedProjects,
        active_template: brief.activeTemplate,
        saved_audit_findings: brief.savedAuditFindings,
        whiteboard_clips: brief.whiteboardClips,
      },
    };

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/lead/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.success || data.ok) && data.submission_id) {
        setSubmissionId(data.submission_id);
        setSubmitted(true);
      } else {
        setSubmitError(
          data.error ||
            "We couldn't safely save your inquiry yet. Please check your details and try again."
        );
      }
    } catch {
      setSubmitError(
        "We couldn't reach the inquiry server. Please try again or export your dossier below."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={closeBrief}
    >
      <div
        className="relative flex h-full w-full max-w-xl flex-col bg-[#23282A] text-[#EDE9E0] shadow-2xl border-l border-[#DFDACE]/20 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DFDACE]/15 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D9A62E] font-bold">
              05 / MY IDEAS
            </span>
            <h2 className="font-display text-lg font-bold uppercase tracking-tight">
              My Ideas &amp; Inquiry
            </h2>
            <span className="rounded-full bg-[#D9A62E] px-2 py-0.5 font-mono text-xs font-bold text-[#23282A]">
              {totalCount} {totalCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={closeBrief}
            className="rounded p-1 text-[#DFDACE]/60 hover:bg-[#DFDACE]/10 hover:text-[#EDE9E0] transition-colors"
            aria-label="Close my ideas drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Direct Contact Strip */}
        <div className="bg-[#17504A]/40 border-b border-[#17504A] px-6 py-2 flex items-center justify-between text-xs font-mono text-[#EDE9E0]/85">
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-[#D9A62E]" />
            Context &amp; Muse • jayme@contextmuse.com
          </span>
          <span className="text-[#D9A62E]">Independent Design &amp; Development Studio</span>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#DFDACE]/15 bg-[#1F2325]">
          <button
            onClick={() => setActiveTab('inquiry')}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider transition-colors ${
              activeTab === 'inquiry'
                ? 'border-b-2 border-[#D9A62E] text-[#D9A62E] font-bold bg-[#23282A]'
                : 'text-[#DFDACE]/60 hover:text-[#EDE9E0]'
            }`}
          >
            Start a Project (Inquiry)
          </button>
          <button
            onClick={() => setActiveTab('dossier')}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider transition-colors ${
              activeTab === 'dossier'
                ? 'border-b-2 border-[#D9A62E] text-[#D9A62E] font-bold bg-[#23282A]'
                : 'text-[#DFDACE]/60 hover:text-[#EDE9E0]'
            }`}
          >
            Saved Examples &amp; Notes ({totalCount})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#17504A] text-[#D9A62E]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase tracking-tight">
                Inquiry Received &amp; Saved
              </h3>
              {submissionId && (
                <div className="inline-block rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-300">
                  Reference ID: <span className="font-bold">{submissionId}</span>
                </div>
              )}
              <p className="text-sm text-[#DFDACE]/80 leading-relaxed max-w-md mx-auto">
                Your inquiry and saved reference items have been recorded. You can also download a local copy of your dossier below or email <a href="mailto:jayme@contextmuse.com" className="text-[#D9A62E] underline">jayme@contextmuse.com</a> directly.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={exportDossier}
                  className="flex items-center justify-center gap-2 bg-[#D9A62E] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#23282A] hover:bg-[#c49425] transition-colors rounded"
                >
                  <Download className="h-4 w-4" /> Download JSON
                </button>
                <button
                  onClick={exportMarkdown}
                  className="flex items-center justify-center gap-2 border border-[#DFDACE]/30 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#EDE9E0] hover:bg-[#DFDACE]/10 transition-colors rounded"
                >
                  <FileText className="h-4 w-4" /> Export Markdown
                </button>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSubmitError('');
                }}
                className="mt-6 text-xs font-mono text-[#DFDACE]/60 underline hover:text-[#D9A62E]"
              >
                ← Return to edit
              </button>
            </div>
          ) : activeTab === 'inquiry' ? (
            <div className="space-y-3.5">
              {/* Core Prompt */}
              <div className="border border-[#17504A] bg-[#17504A]/20 p-3.5 rounded-lg space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#D9A62E] font-bold">
                  START A PROJECT
                </span>
                <h3 className="font-display text-base font-bold uppercase text-[#EDE9E0]">
                  What are you looking to create?
                </h3>
                <p className="font-sans text-xs text-[#DFDACE]/90 leading-snug">
                  Whether you want to build a website, shape brand and visual design, create blogs, templates, digital publications, or informational materials, or develop custom apps and tools, share a few details below. You don’t need a finished spec.
                </p>
              </div>

              {/* Project Category Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#DFDACE]/70">
                  <span>Project category (Optional)</span>
                  {selectedProblem && (
                    <span className="text-[#D9A62E] font-bold">Selected: {selectedProblem}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PROJECT_CATEGORIES.map((item) => {
                    const active = selectedProblem === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-project-category={item.id}
                        onClick={() => handleSelectProblem(item)}
                        className={`py-1.5 px-2.5 rounded border font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                          active
                            ? 'border-[#D9A62E] bg-[#D9A62E] text-[#141617]'
                            : 'border-[#DFDACE]/20 bg-[#181B1C] text-[#EDE9E0] hover:border-[#D9A62E]/60'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                {/* Honeypot trap for spam protection */}
                <input
                  type="text"
                  name="_gotcha"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                {submitError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded border border-red-400/50 bg-red-950/40 p-3 text-xs text-red-200"
                  >
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#DFDACE]/70 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={brief.inquiry.name}
                      onChange={(e) => {
                        setSubmitError('');
                        updateInquiry('name', e.target.value);
                      }}
                      placeholder="e.g. Alex Morgan"
                      className="w-full bg-[#181B1C] border border-[#DFDACE]/20 px-3 py-2 text-xs text-[#EDE9E0] rounded focus:border-[#D9A62E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#DFDACE]/70 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={brief.inquiry.email}
                      onChange={(e) => {
                        setSubmitError('');
                        updateInquiry('email', e.target.value);
                      }}
                      placeholder="alex@company.com"
                      className="w-full bg-[#181B1C] border border-[#DFDACE]/20 px-3 py-2 text-xs text-[#EDE9E0] rounded focus:border-[#D9A62E] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#DFDACE]/70 mb-1">
                    Project details &amp; what you want to create *
                  </label>
                  <textarea
                    rows={3}
                    name="message"
                    required
                    value={brief.inquiry.notes}
                    onChange={(e) => {
                      setSubmitError('');
                      updateInquiry('notes', e.target.value);
                    }}
                    placeholder="Describe your website, brand design, blog, templates, digital publication, informational materials, custom app, or other project..."
                    className="w-full bg-[#181B1C] border border-[#DFDACE]/20 px-3 py-2 text-xs text-[#EDE9E0] rounded focus:border-[#D9A62E] focus:outline-none font-sans"
                  />
                </div>

                {/* Supporting Option: Prefer to show me? */}
                <div className="bg-[#181B1C] p-3.5 rounded border border-white/5 space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#D9A62E] font-bold block">
                    Prefer to show me? (Optional)
                  </span>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-3.5 w-3.5 text-[#DFDACE]/60" />
                    <input
                      type="url"
                      name="website"
                      value={attachedUrl}
                      onChange={(e) => setAttachedUrl(e.target.value)}
                      placeholder="Add a link to your current website, form, or document..."
                      className="w-full bg-black/40 border border-white/10 px-2 py-1 text-xs text-[#EDE9E0] rounded focus:border-[#D9A62E] focus:outline-none font-mono"
                    />
                  </div>
                  {totalCount > 0 && (
                    <div className="pt-1 text-[11px] font-mono text-emerald-400">
                      ✓ {totalCount} saved items from My Ideas will be included automatically.
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-[#D9A62E] py-3 text-xs font-mono font-bold uppercase tracking-wider text-[#23282A] hover:bg-[#c49425] disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Tell me about it</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Saved Items Dossier Tab */
            <>
              {totalCount === 0 && (
                <div className="py-12 text-center text-[#DFDACE]/50 space-y-3">
                  <p className="font-mono text-xs uppercase tracking-widest">
                    Your ideas collection is currently empty
                  </p>
                  <p className="text-xs leading-relaxed max-w-sm mx-auto">
                    Explore <strong>The Work</strong> to save relevant case studies, test your site in <strong>The Lab</strong> to pin diagnostic findings, or sketch your workflow in <strong>Custom Builds</strong>.
                  </p>
                </div>
              )}

              {/* Starter Blueprint */}
              {brief.activeTemplate && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#D9A62E]">
                      Selected Starting Blueprint
                    </span>
                    <button
                      onClick={clearTemplate}
                      className="text-[11px] font-mono text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="rounded border border-[#D9A62E]/40 bg-[#D9A62E]/10 p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block rounded bg-[#D9A62E] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#23282A]">
                          {brief.activeTemplate.badge}
                        </span>
                        <h4 className="mt-1 font-display text-sm font-bold text-[#EDE9E0]">
                          {brief.activeTemplate.title}
                        </h4>
                      </div>
                      <span className="font-mono text-[10px] text-[#DFDACE]/60">
                        {brief.activeTemplate.readiness}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Projects */}
              {brief.savedProjects.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#DFDACE]/70">
                      Saved Work Examples ({brief.savedProjects.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {brief.savedProjects.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded border border-[#DFDACE]/15 bg-[#1F2325] p-3"
                      >
                        <div>
                          <h4 className="font-display text-xs font-bold text-[#EDE9E0]">{p.title}</h4>
                          <p className="text-[11px] text-[#DFDACE]/60 line-clamp-1">{p.subtitle}</p>
                        </div>
                        <button
                          onClick={() => removeProject(p.id)}
                          className="p-1 text-[#DFDACE]/40 hover:text-red-400 transition-colors"
                          title="Remove from ideas"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Audit Diagnostic Findings */}
              {brief.savedAuditFindings.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#DFDACE]/70">
                      Diagnostic Findings ({brief.savedAuditFindings.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {brief.savedAuditFindings.map((f) => (
                      <div
                        key={f.id}
                        className="rounded border border-[#DFDACE]/15 bg-[#1F2325] p-3 text-xs space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                              f.severity === 'High Priority'
                                ? 'bg-red-900/60 text-red-200 border border-red-500/40'
                                : 'bg-[#17504A] text-[#D9A62E]'
                            }`}
                          >
                            {f.severity}
                          </span>
                          <button
                            onClick={() => removeAuditFinding(f.id)}
                            className="p-1 text-[#DFDACE]/40 hover:text-red-400 transition-colors"
                            title="Remove finding"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-bold text-[#EDE9E0]">{f.issue}</p>
                        <p className="text-[11px] text-[#DFDACE]/70 leading-relaxed">
                          Rec: {f.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Whiteboard Clips */}
              {brief.whiteboardClips.length > 0 && (
                <div className="space-y-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#DFDACE]/70">
                    Whiteboard Notes &amp; Crops ({brief.whiteboardClips.length})
                  </span>
                  <div className="space-y-2">
                    {brief.whiteboardClips.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between rounded border border-[#DFDACE]/15 bg-[#1F2325] p-3 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          {c.dataUrl && (
                            <img src={c.dataUrl} alt="crop" className="h-8 w-8 object-cover rounded border border-[#DFDACE]/20" />
                          )}
                          <p className="text-[#EDE9E0] line-clamp-1">{c.text || c.title}</p>
                        </div>
                        <button
                          onClick={() => removeWhiteboardClip(c.id)}
                          className="p-1 text-[#DFDACE]/40 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#DFDACE]/15 bg-[#1C2022] p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={exportDossier}
              disabled={totalCount === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider border border-[#DFDACE]/20 text-[#EDE9E0] hover:bg-[#DFDACE]/10 disabled:opacity-40 transition-colors rounded"
              title="Download structured JSON"
            >
              <Download className="h-3 w-3" /> JSON
            </button>
            <button
              onClick={exportMarkdown}
              disabled={totalCount === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider border border-[#DFDACE]/20 text-[#EDE9E0] hover:bg-[#DFDACE]/10 disabled:opacity-40 transition-colors rounded"
              title="Export formatted Markdown"
            >
              <FileText className="h-3 w-3" /> Markdown
            </button>
          </div>

          {totalCount > 0 && (
            <button
              onClick={clearBrief}
              className="text-[11px] font-mono text-[#DFDACE]/50 hover:text-red-400 transition-colors"
            >
              Reset Ideas
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
