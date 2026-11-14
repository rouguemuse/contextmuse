import React, { useState, useMemo } from 'react';
import {
  FileText,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  Share2,
  Workflow,
  HelpCircle,
  ImageIcon,
  GitBranch,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';

export default function ProjectSnapshot({
  pieces = [],
  links = [],
  constraints = '',
  onUpdateConstraints,
  onExportPng,
  onExportJson,
}) {
  const { addWhiteboardClip, updateInquiry, openBrief } = useBrief();
  const [copied, setCopied] = useState(false);

  // Extract workflow process steps
  const steps = useMemo(() => {
    return pieces
      .filter((p) => p.type === 'step')
      .sort((a, b) => (a.x !== b.x ? a.x - b.x : a.y - b.y));
  }, [pieces]);

  // Determine if this is strictly the unmodified starter demo
  const isUneditedStarter = useMemo(() => {
    if (steps.length !== 3) return false;
    const starterIds = new Set(['step_1', 'step_2', 'step_3']);
    const hasOnlyStarterIds = steps.every((s) => starterIds.has(s.id));
    const hasOnlyStarterFlags = steps.every((s) => s.isStarter);
    const nonStarterPieces = pieces.filter((p) => !p.isStarter);
    return hasOnlyStarterIds && hasOnlyStarterFlags && nonStarterPieces.length === 0;
  }, [steps, pieces]);

  // Compute actual incoming/outgoing graph connections for each step
  const stepRoutes = useMemo(() => {
    return steps.map((s, idx) => {
      const outgoing = links
        .filter((l) => l.from === s.id)
        .map((l) => pieces.find((p) => p.id === l.to))
        .filter(Boolean);
      const incoming = links
        .filter((l) => l.to === s.id)
        .map((l) => pieces.find((p) => p.id === l.from))
        .filter(Boolean);
      return {
        step: s,
        index: idx + 1,
        outgoing,
        incoming,
        isSource: incoming.length === 0,
        isSink: outgoing.length === 0,
      };
    });
  }, [steps, links, pieces]);

  // Explicit active routes from links
  const activeRoutes = useMemo(() => {
    return links
      .map((l) => {
        const fromPiece = pieces.find((p) => p.id === l.from);
        const toPiece = pieces.find((p) => p.id === l.to);
        if (!fromPiece || !toPiece) return null;
        return {
          id: l.id,
          from: fromPiece.label || 'Step',
          to: toPiece.label || 'Step',
          isBottleneckRoute:
            fromPiece.stepState === 'bottleneck' || toPiece.stepState === 'bottleneck',
        };
      })
      .filter(Boolean);
  }, [links, pieces]);

  // Filter semantic groups
  const bottlenecks = useMemo(() => {
    return pieces.filter(
      (p) =>
        p.stepState === 'bottleneck' ||
        (p.type === 'step' && p.highlight) ||
        (p.label && /bottleneck|friction|delay|stuck/i.test(p.label))
    );
  }, [pieces]);

  const improvements = useMemo(() => {
    return pieces.filter((p) => p.stepState === 'improvement');
  }, [pieces]);

  const decisions = useMemo(() => {
    return pieces.filter((p) => p.stepState === 'decision');
  }, [pieces]);

  const notes = useMemo(() => {
    return pieces.filter(
      (p) => p.type === 'note' && p.id !== 'note_hint' && p.text && p.text.trim()
    );
  }, [pieces]);

  const images = useMemo(() => {
    return pieces.filter((p) => p.type === 'shot' && p.fileUri);
  }, [pieces]);

  // Construct structured text summary grounded strictly in real data
  const structuredText = useMemo(() => {
    let out = '=== CONTEXTMUSE PROJECT SNAPSHOT ===\n';

    if (isUneditedStarter) {
      out += 'STATUS: SAMPLE DEMONSTRATION WORKFLOW (UNEDITED BY VISITOR)\n';
      out +=
        'NOTICE: The visitor explored the interactive canvas but has not modified the sample demonstration steps.\n\n';
      out += 'SAMPLE DEMO STEPS:\n';
      steps.forEach((s, idx) => {
        out += `${idx + 1}. ${s.label}: ${s.text}\n`;
      });
      out += '\n';
    } else {
      out += 'STATUS: CUSTOM VISITOR OPERATIONAL SPECIFICATION\n\n';

      if (steps.length > 0) {
        out += `MAPPED WORKFLOW STEPS (${steps.length} steps mapped, ${activeRoutes.length} connection routes):\n`;
        stepRoutes.forEach(({ step, index, outgoing }) => {
          const stateTag =
            step.stepState === 'bottleneck'
              ? ' [⚠️ BOTTLENECK]'
              : step.stepState === 'decision'
              ? ' [◇ DECISION]'
              : step.stepState === 'improvement'
              ? ' [★ AUTOMATION]'
              : '';
          const routeDesc =
            outgoing.length > 0
              ? ` -> Leads to: ${outgoing.map((o) => o.label || 'Next Step').join(', ')}`
              : ' [Terminal Step]';
          out += `${index}. ${step.label || 'Step'}${stateTag}${routeDesc}\n   Details: ${
            step.text || 'No description provided'
          }\n`;
        });
        out += '\n';
      }

      if (activeRoutes.length > 0) {
        out += `ACTIVE CONNECTION ROUTES (${activeRoutes.length}):\n`;
        activeRoutes.forEach((r) => {
          out += `• ${r.from} -> ${r.to}${r.isBottleneckRoute ? ' (Crosses Bottleneck)' : ''}\n`;
        });
        out += '\n';
      }

      if (bottlenecks.length > 0) {
        out += `IDENTIFIED BOTTLENECKS & OPERATIONAL FRICTION (${bottlenecks.length}):\n`;
        bottlenecks.forEach((b) => {
          out += `• ${b.label || 'Bottleneck'}: ${b.text || 'Operational delay / friction'}\n`;
        });
        out += '\n';
      }

      if (improvements.length > 0) {
        out += `DESIRED AUTOMATIONS & SYSTEM TARGETS (${improvements.length}):\n`;
        improvements.forEach((im) => {
          out += `• ${im.label || 'Automation'}: ${im.text || 'Target for software automation'}\n`;
        });
        out += '\n';
      }

      if (decisions.length > 0) {
        out += `DECISION RULES & TRIAGE LOGIC (${decisions.length}):\n`;
        decisions.forEach((d) => {
          out += `• ${d.label || 'Decision'}: ${d.text || 'Logic bifurcation'}\n`;
        });
        out += '\n';
      }

      if (notes.length > 0) {
        out += `SPECIFICATION MEMOS & CONSTRAINTS (${notes.length}):\n`;
        notes.forEach((n) => {
          out += `• ${n.text}\n`;
        });
        out += '\n';
      }
    }

    if (constraints && constraints.trim()) {
      out += `CLIENT REQUIREMENTS & CONSTRAINTS:\n${constraints.trim()}\n\n`;
    }

    out += `Generated from ContextMuse Visual Workspace on ${new Date().toLocaleDateString()}`;
    return out;
  }, [
    isUneditedStarter,
    steps,
    stepRoutes,
    activeRoutes,
    bottlenecks,
    improvements,
    decisions,
    notes,
    constraints,
  ]);

  const handleAttachToBrief = () => {
    // 1. Add structured clip to BriefContext
    addWhiteboardClip({
      type: 'project-snapshot',
      source: 'whiteboard',
      pagePath: '/build',
      title: isUneditedStarter
        ? 'Sample Workflow (Unedited Demo)'
        : `Workflow Specification (${steps.length} Steps, ${bottlenecks.length} Bottlenecks)`,
      note: structuredText,
    });

    // 2. Pre-fill inquiry notes if empty or append
    updateInquiry('notes', (prev) => {
      if (!prev) return structuredText;
      return `${prev}\n\n${structuredText}`;
    });

    // 3. Open brief drawer
    openBrief();
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(structuredText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-[#1C2022] border border-[#DFDACE]/20 rounded-xl p-6 sm:p-8 space-y-6 text-[#EDE9E0] shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DFDACE]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Workflow className="h-4 w-4 text-[#D9A62E]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#D9A62E] font-bold">
              DERIVED DELIVERABLE
            </span>
          </div>
          <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#EDE9E0]">
            Live Project Snapshot
          </h3>
          <p className="mt-0.5 text-xs text-[#DFDACE]/70 font-sans">
            Grounded directly in your board elements and connection paths.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            title="Copy snapshot text to clipboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#DFDACE]/25 font-mono text-xs text-[#DFDACE]/80 hover:text-white hover:border-[#D9A62E] transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied ✓' : 'Copy Text'}</span>
          </button>

          {onExportPng && (
            <button
              onClick={onExportPng}
              title="Download whiteboard diagram as PNG"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#DFDACE]/25 font-mono text-xs text-[#DFDACE]/80 hover:text-white hover:border-[#D9A62E] transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Image PNG</span>
            </button>
          )}
        </div>
      </div>

      {/* Unedited Starter Qualification Banner */}
      {isUneditedStarter && (
        <div className="bg-[#D9A62E]/10 border border-[#D9A62E]/30 p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D9A62E]" />
            <span className="font-mono font-bold uppercase text-[#D9A62E]">
              Sample Workflow Loaded (Demo Mode)
            </span>
            <span className="text-[#DFDACE]/80 font-sans hidden md:inline">
              — The steps below are examples. Click cards on the canvas to edit them or add your own.
            </span>
          </div>
          <span className="font-mono text-[10.5px] text-[#DFDACE]/60">
            Unedited sample will not contaminate inquiries
          </span>
        </div>
      )}

      {/* Snapshot Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Visual Step Pipeline & Bottlenecks (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Mapped Workflow Pipeline */}
          <div>
            <div className="flex items-center justify-between font-mono text-xs mb-2">
              <span className="font-bold uppercase tracking-wider text-[#D9A62E]">
                1. Mapped Workflow Sequence ({steps.length} Steps)
              </span>
              <span className="text-[#DFDACE]/50">
                {activeRoutes.length} Connected Route{activeRoutes.length === 1 ? '' : 's'}
              </span>
            </div>

            {steps.length > 0 ? (
              <div className="space-y-2 font-mono text-xs">
                {stepRoutes.map(({ step: st, index, outgoing }) => (
                  <div
                    key={st.id}
                    className={`p-3 rounded-lg border transition-all ${
                      st.stepState === 'bottleneck'
                        ? 'bg-red-950/30 border-red-500/50 text-red-100'
                        : st.stepState === 'decision'
                        ? 'bg-[#17504A]/25 border-[#17504A] text-teal-100'
                        : st.stepState === 'improvement'
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                        : 'bg-black/30 border-white/10 text-[#EDE9E0]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                      <div className="flex items-center gap-2">
                        <span>{st.label || `Step 0${index}`}</span>
                        {st.isStarter && (
                          <span className="bg-[#D9A62E]/20 text-[#D9A62E] px-1 py-0.2 rounded text-[8.5px] uppercase font-bold">
                            Sample
                          </span>
                        )}
                      </div>
                      {st.stepState === 'bottleneck' && (
                        <span className="text-red-400 font-bold uppercase text-[9.5px]">⚠️ Bottleneck</span>
                      )}
                      {st.stepState === 'decision' && (
                        <span className="text-teal-300 font-bold uppercase text-[9.5px]">◇ Decision</span>
                      )}
                      {st.stepState === 'improvement' && (
                        <span className="text-emerald-400 font-bold uppercase text-[9.5px]">★ Automation</span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-[#DFDACE]/90 leading-relaxed">
                      {st.text || 'No description provided.'}
                    </p>

                    {/* Explicit Connection Destination */}
                    <div className="mt-2 pt-1.5 border-t border-white/5 font-mono text-[10px]">
                      {outgoing.length > 0 ? (
                        <span className="text-[#2B7C72] flex items-center gap-1 font-bold">
                          <span>→ Leads to:</span>
                          <span className="text-white underline">{outgoing.map((o) => o.label).join(', ')}</span>
                        </span>
                      ) : (
                        <span className="text-[#DFDACE]/40">[Terminal Step / End of Route]</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-black/20 border border-dashed border-white/15 text-xs text-[#DFDACE]/60 font-mono text-center">
                No process steps mapped yet. Click <strong className="text-[#D9A62E]">+ Step</strong> on the board toolbar to begin.
              </div>
            )}
          </div>

          {/* Bottlenecks Summary Callout */}
          <div className="p-4 rounded-lg bg-red-950/20 border border-red-800/40 space-y-2">
            <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>Identified Bottlenecks & Friction ({bottlenecks.length})</span>
            </span>

            {bottlenecks.length > 0 ? (
              <ul className="space-y-1.5 font-sans text-xs text-[#DFDACE]/90">
                {bottlenecks.map((b) => (
                  <li key={b.id} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>
                      <strong className="text-white font-mono">{b.label || 'Bottleneck'}:</strong>{' '}
                      {b.text || 'Requires manual intervention or causes delays.'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-sans text-xs text-[#DFDACE]/70">
                No step currently flagged as a bottleneck. Select any step on the canvas and click <strong className="text-red-400">⚠️ Bottleneck</strong> to mark where work slows down.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Editable User Constraints & Submit Path (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-black/40 border border-white/10 rounded-xl p-5 font-mono text-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-white uppercase tracking-wider">
                2. Requirements & Context
              </span>
              <span className="text-[10px] text-emerald-400">Auto-Saved</span>
            </div>

            {/* User Custom Constraints Textarea (Persisted) */}
            <div className="space-y-1.5">
              <label className="block text-[11px] text-[#DFDACE]/80 uppercase">
                Add Custom Constraints or Requirements:
              </label>
              <textarea
                rows={5}
                value={constraints}
                onChange={(e) => onUpdateConstraints && onUpdateConstraints(e.target.value)}
                placeholder="e.g. Needs to integrate with QuickBooks; must support mobile field technicians; 3 team members need access..."
                className="w-full bg-black/60 border border-white/15 p-3 rounded-lg text-xs text-[#EDE9E0] font-sans leading-relaxed focus:outline-none focus:border-[#D9A62E]"
              />
            </div>

            {/* Board Artifact Inventory */}
            <div className="space-y-1 text-[11px] text-[#DFDACE]/70 pt-2 border-t border-white/5">
              <div className="flex justify-between">
                <span>Total Elements on Board:</span>
                <span className="font-bold text-white">{pieces.length} items</span>
              </div>
              <div className="flex justify-between">
                <span>Directional Connection Routes:</span>
                <span className="font-bold text-white">{activeRoutes.length} routes</span>
              </div>
              <div className="flex justify-between">
                <span>Specification Notes Attached:</span>
                <span className="font-bold text-white">{notes.length} notes</span>
              </div>
              {images.length > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Screenshots Uploaded:</span>
                  <span className="font-bold">{images.length} images</span>
                </div>
              )}
            </div>
          </div>

          {/* Prominent Next Action */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <button
              onClick={handleAttachToBrief}
              className="w-full bg-[#D9A62E] text-[#141617] py-3 px-4 rounded-lg font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#e0b240] transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Attach Snapshot to Inquiry & Review</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-[10px] text-center text-[#DFDACE]/60 font-sans">
              Attaches your mapped steps and bottlenecks into the inquiry brief without losing your board.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
