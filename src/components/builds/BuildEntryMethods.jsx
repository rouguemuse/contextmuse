import React, { useState, useRef } from 'react';
import {
  Workflow,
  PenLine,
  Upload,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Check,
  Plus,
  Layers,
  FileText,
} from 'lucide-react';

const SUGGESTIONS = [
  'Customer quotes take 45 mins because staff calculate dimensions and tonnage by hand.',
  'We waste 2 hours a day manually reconciling spreadsheet orders into our dispatch queue.',
  'Booking engine needs multi-day asset availability locks with bilingual confirmations.',
  'Field technicians take loose photos and clipboard notes that get lost before billing.',
];

export default function BuildEntryMethods({
  activeMode = 'map',
  onSelectMode,
  onDescribeSubmit,
  onUploadFiles,
  onRestoreStarter,
  stepCount = 3,
  bottleneckCount = 1,
}) {
  const [describeText, setDescribeText] = useState('');
  const [copiedSuggestion, setCopiedSuggestion] = useState(null);
  const fileInputRef = useRef(null);

  const handlePickSuggestion = (sug, idx) => {
    setDescribeText(sug);
    setCopiedSuggestion(idx);
    setTimeout(() => setCopiedSuggestion(null), 1500);
  };

  const handleSendToBrief = () => {
    if (!describeText.trim()) return;
    onDescribeSubmit(describeText.trim(), 'inquiry');
  };

  const handleAddToMap = () => {
    if (!describeText.trim()) return;
    onDescribeSubmit(describeText.trim(), 'board');
    setDescribeText('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUploadFiles(files);
      e.target.value = '';
    }
  };

  return (
    <section className="bg-[#1C2022] border border-[#DFDACE]/20 rounded-xl overflow-hidden shadow-2xl text-[#EDE9E0]">
      {/* Editorial Room Header Statement */}
      <div className="border-b border-[#DFDACE]/15 bg-[#141617] px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D9A62E] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#D9A62E] font-bold">
              Custom Websites • Quoting Tools • Internal Software &amp; Workflows
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#DFDACE]/70">
            <span>Live Workspace: <strong className="text-white">{stepCount} Steps</strong></span>
            <span>•</span>
            <span className={bottleneckCount > 0 ? 'text-[#FF7043] font-bold' : 'text-[#DFDACE]/70'}>
              {bottleneckCount} Bottleneck{bottleneckCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#EDE9E0]">
          Tell me what you want to build—or map where your workflow gets stuck.
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#DFDACE]/80 font-sans leading-relaxed max-w-3xl">
          Whether you need a custom website, an interactive quoting calculator, or an internal tool for your team, choose whichever way is easiest to share what you have in mind.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-[#DFDACE]/15 bg-[#181B1C]">
        {/* Tab 1: Map It */}
        <button
          type="button"
          onClick={() => onSelectMode('map')}
          className={`flex items-center gap-3.5 px-6 py-4 text-left transition-all relative ${
            activeMode === 'map'
              ? 'bg-[#1C2022] text-[#EDE9E0]'
              : 'text-[#DFDACE]/60 hover:text-[#EDE9E0] hover:bg-[#141617]'
          }`}
        >
          {activeMode === 'map' && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#D9A62E]" />
          )}
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded border ${
              activeMode === 'map'
                ? 'border-[#D9A62E] bg-[#D9A62E]/15 text-[#D9A62E]'
                : 'border-[#DFDACE]/20 bg-[#141617] text-[#DFDACE]/60'
            }`}
          >
            <Workflow className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#D9A62E]">
                Mode 01
              </span>
              <span className="text-[10px] font-mono text-[#DFDACE]/50">Recommended</span>
            </div>
            <div className="font-display text-sm font-bold uppercase text-[#EDE9E0]">
              Map It
            </div>
            <div className="font-sans text-[11px] text-[#DFDACE]/60 line-clamp-1">
              Visual workflow & bottleneck untangling
            </div>
          </div>
        </button>

        {/* Tab 2: Describe It */}
        <button
          type="button"
          onClick={() => onSelectMode('describe')}
          className={`flex items-center gap-3.5 px-6 py-4 text-left transition-all relative border-t sm:border-t-0 sm:border-l border-[#DFDACE]/15 ${
            activeMode === 'describe'
              ? 'bg-[#1C2022] text-[#EDE9E0]'
              : 'text-[#DFDACE]/60 hover:text-[#EDE9E0] hover:bg-[#141617]'
          }`}
        >
          {activeMode === 'describe' && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#D9A62E]" />
          )}
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded border ${
              activeMode === 'describe'
                ? 'border-[#D9A62E] bg-[#D9A62E]/15 text-[#D9A62E]'
                : 'border-[#DFDACE]/20 bg-[#141617] text-[#DFDACE]/60'
            }`}
          >
            <PenLine className="h-4 w-4" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#D9A62E]">
              Mode 02
            </span>
            <div className="font-display text-sm font-bold uppercase text-[#EDE9E0]">
              Describe It
            </div>
            <div className="font-sans text-[11px] text-[#DFDACE]/60 line-clamp-1">
              Fast text problem description
            </div>
          </div>
        </button>

        {/* Tab 3: Show It */}
        <button
          type="button"
          onClick={() => onSelectMode('show')}
          className={`flex items-center gap-3.5 px-6 py-4 text-left transition-all relative border-t sm:border-t-0 sm:border-l border-[#DFDACE]/15 ${
            activeMode === 'show'
              ? 'bg-[#1C2022] text-[#EDE9E0]'
              : 'text-[#DFDACE]/60 hover:text-[#EDE9E0] hover:bg-[#141617]'
          }`}
        >
          {activeMode === 'show' && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#D9A62E]" />
          )}
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded border ${
              activeMode === 'show'
                ? 'border-[#D9A62E] bg-[#D9A62E]/15 text-[#D9A62E]'
                : 'border-[#DFDACE]/20 bg-[#141617] text-[#DFDACE]/60'
            }`}
          >
            <Upload className="h-4 w-4" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#D9A62E]">
              Mode 03
            </span>
            <div className="font-display text-sm font-bold uppercase text-[#EDE9E0]">
              Show It
            </div>
            <div className="font-sans text-[11px] text-[#DFDACE]/60 line-clamp-1">
              Upload screenshots & sketches
            </div>
          </div>
        </button>
      </div>

      {/* Mode Sub-Panels */}
      <div className="p-6 sm:p-7">
        {/* ============================================================
            MODE 01: MAP IT
            ============================================================ */}
        {activeMode === 'map' && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#141617] border border-[#DFDACE]/15 p-4 rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#D9A62E] uppercase tracking-wider">
                  Interactive Starter Workflow Loaded
                </span>
                <span className="bg-[#17504A] text-bone px-2 py-0.5 text-[10px] font-mono font-bold rounded">
                  01 Intake → 02 Bottleneck → 03 Fulfillment
                </span>
              </div>
              <p className="text-xs text-[#DFDACE]/80 font-sans leading-relaxed">
                Click any step on the canvas to rename it, edit notes, or mark it as an operational bottleneck. Drag directional lines to connect steps.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onRestoreStarter}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#DFDACE]/25 hover:border-[#D9A62E] text-[#DFDACE] hover:text-[#D9A62E] font-mono text-xs rounded transition-colors"
                title="Restore default Input → Process → Output steps"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Starter Flow</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            MODE 02: DESCRIBE IT
            ============================================================ */}
        {activeMode === 'describe' && (
          <div className="space-y-5">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#D9A62E] font-bold mb-2">
                What are you trying to build or untangle?
              </label>
              <textarea
                rows={3}
                value={describeText}
                onChange={(e) => setDescribeText(e.target.value)}
                placeholder="What do you keep copying between tools? Which decision requires opening several spreadsheets? Where do orders or quotes get delayed?"
                className="w-full bg-[#141617] border border-[#DFDACE]/25 p-3.5 text-xs sm:text-sm text-[#EDE9E0] rounded-lg focus:border-[#D9A62E] focus:outline-none font-sans leading-relaxed shadow-inner"
              />
            </div>

            {/* Prompt Starter Chips */}
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[#DFDACE]/60 mb-2 font-bold">
                Or click an operational pattern to start:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePickSuggestion(sug, idx)}
                    className="p-2.5 bg-[#141617] hover:bg-[#23282A] border border-[#DFDACE]/15 hover:border-[#D9A62E]/60 text-left rounded text-xs text-[#DFDACE]/80 font-sans transition-all flex items-start justify-between gap-2"
                  >
                    <span>“{sug}”</span>
                    {copiedSuggestion === idx && (
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#DFDACE]/15">
              <div className="text-xs font-mono text-[#DFDACE]/60">
                You can push this directly onto the visual map or send it straight to inquiry review.
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={!describeText.trim()}
                  onClick={handleAddToMap}
                  className="px-4 py-2 border border-[#DFDACE]/30 hover:border-[#D9A62E] text-[#EDE9E0] hover:text-[#D9A62E] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-30 flex items-center gap-2"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Memo to Map & Open Canvas</span>
                </button>
                <button
                  type="button"
                  disabled={!describeText.trim()}
                  onClick={handleSendToBrief}
                  className="px-5 py-2.5 bg-[#D9A62E] hover:bg-[#e0b240] text-[#141617] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-30 flex items-center gap-2 shadow-md"
                >
                  <span>Send to Inquiry Brief</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            MODE 03: SHOW IT
            ============================================================ */}
        {activeMode === 'show' && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files || []);
                if (files.length > 0) onUploadFiles(files);
              }}
              className="border-2 border-dashed border-[#DFDACE]/30 hover:border-[#D9A62E] bg-[#141617] p-8 rounded-xl text-center cursor-pointer transition-all hover:bg-[#181B1C] group"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#23282A] text-[#D9A62E] group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6" />
              </div>
              <h4 className="mt-3 font-display text-base font-bold uppercase text-[#EDE9E0]">
                Drop screenshots, sketches, or software references here
              </h4>
              <p className="mt-1 text-xs text-[#DFDACE]/70 font-sans max-w-md mx-auto">
                PNG, JPG, or WEBP. Uploaded images will be placed directly onto the visual canvas where you can draw over them with pen and highlighter tools.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#23282A] group-hover:bg-[#D9A62E] text-[#EDE9E0] group-hover:text-[#141617] font-mono text-xs font-bold uppercase tracking-wider rounded transition-colors">
                <span>Browse Files</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </div>
    </section>
  );
}
