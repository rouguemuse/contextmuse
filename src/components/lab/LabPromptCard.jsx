import React, { useState, useEffect } from 'react';
import { Shuffle, ArrowLeft, Bookmark, Check, Sparkles, ExternalLink } from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';

const LAB_PROMPTS = [
  {
    id: 'calm-urgent',
    q: 'Make the same image feel calm, then urgent. What changes?',
    context: 'Explore how typography weight, tint saturation, and negative space alter emotional urgency without changing the photo.',
    toolHint: 'Try this in the Ad Layer Compositor',
    toolTarget: '#tool-ad-compositor',
  },
  {
    id: 'size-spacing',
    q: 'Show the difference using only size and spacing.',
    context: 'Before adding colors, borders, or badges, see how much hierarchy can be conveyed with scale and white space alone.',
    toolHint: 'Try this in Color & Contrast Utility',
    toolTarget: '#tool-contrast',
  },
  {
    id: 'explore-list',
    q: 'Turn a list into something you can explore.',
    context: 'When rows become spatial cards, filters become instant toggles, and searching feels instantaneous, data becomes an instrument.',
    toolHint: 'Try this in Data Normalization Workbench',
    toolTarget: '#tool-table-docket',
  },
  {
    id: 'before-after-unscrollable',
    q: 'Reveal a before-and-after without making someone scroll.',
    context: 'Splitting an interface into interactive state layers lets visitors inspect the exact transition without losing spatial context.',
    toolHint: 'Try this in Spatial Friction Map',
    toolTarget: '#tool-barrier-map',
  },
  {
    id: 'drag-vs-menu',
    q: 'What changes when you can drag it instead of choosing from a menu?',
    context: 'Direct physical manipulation gives immediate feedback on weight, connection, and boundaries that dropdowns never achieve.',
    toolHint: 'Try this in Kinetic Physics Canvas',
    toolTarget: '#tool-kinetic',
  },
  {
    id: 'one-button-task',
    q: 'Take one repeated task and imagine a one-button version.',
    context: 'If someone does the same 5 clicks twenty times a day, what deterministic rules would turn it into a single action?',
    toolHint: 'Explore this in Custom Builds',
    toolTarget: '/build',
  },
];

export default function LabPromptCard({ onSelectTool }) {
  const [history, setHistory] = useState([0]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [savedNotice, setSavedNotice] = useState(false);
  const { addWhiteboardClip } = useBrief();

  const currentIdx = history[historyIndex] ?? 0;
  const currentPrompt = LAB_PROMPTS[currentIdx];
  const currentAnswer = answers[currentPrompt.id] || '';

  const handleNext = () => {
    // Avoid immediate repeat
    const remainingIndices = LAB_PROMPTS.map((_, i) => i).filter((i) => i !== currentIdx);
    const nextIdx = remainingIndices[Math.floor(Math.random() * remainingIndices.length)];

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(nextIdx);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSavedNotice(false);
  };

  const handlePrev = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSavedNotice(false);
    }
  };

  const handleAnswerChange = (val) => {
    setAnswers((prev) => ({
      ...prev,
      [currentPrompt.id]: val,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentAnswer.trim()) return;

    addWhiteboardClip({
      type: 'lab-creative-prompt',
      title: `Creative Thought: ${currentPrompt.q}`,
      text: currentAnswer.trim(),
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2400);
  };

  return (
    <div className="h-full bg-[#FAF8F5] text-[#23282A] border border-[#23282A]/15 p-5 sm:p-6 shadow-sm font-sans flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#23282A]/12 pb-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A6F0B] font-bold block">
              Design &amp; Systems Notebook
            </span>
            <h3 className="font-display text-lg font-black uppercase tracking-tight text-[#23282A] mt-0.5">
              Workbench Prompts
            </h3>
          </div>
          <span className="font-mono text-[10px] text-[#23282A]/60">
            {String(currentIdx + 1).padStart(2, '0')} / {String(LAB_PROMPTS.length).padStart(2, '0')}
          </span>
        </div>

        {/* Stable Height Prompt Content Container */}
        <div className="mt-4 min-h-[140px] flex flex-col justify-between">
          <div>
            <p className="font-display text-lg sm:text-xl font-extrabold uppercase tracking-tight text-[#23282A] leading-snug">
              “{currentPrompt.q}”
            </p>
            <p className="mt-2 text-xs text-[#23282A]/75 font-sans leading-relaxed">
              {currentPrompt.context}
            </p>
          </div>

          {currentPrompt.toolHint && (
            <div className="mt-3">
              <button
                onClick={() => onSelectTool && onSelectTool(currentPrompt.toolTarget)}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#17504A] hover:underline"
              >
                <span>→ {currentPrompt.toolHint}</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Answer & Persistence Input */}
      <form onSubmit={handleSave} className="mt-4 space-y-2.5 border-t border-[#23282A]/12 pt-3">
        <textarea
          rows={2}
          value={currentAnswer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Jot down what comes to mind, or an idea to test..."
          className="w-full bg-white border border-[#23282A]/20 p-2.5 text-xs text-[#23282A] focus:border-[#23282A] focus:outline-none font-sans"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={historyIndex <= 0}
              className="flex items-center gap-1 font-mono text-[11px] text-[#23282A]/70 uppercase tracking-wider hover:text-[#23282A] disabled:opacity-30 disabled:pointer-events-none py-1.5 px-2.5 border border-[#23282A]/20"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 font-mono text-[11px] text-[#23282A] font-bold uppercase tracking-wider hover:bg-[#23282A] hover:text-[#EDE9E0] py-1.5 px-3 border border-[#23282A]/30 transition-colors"
            >
              <Shuffle className="h-3 w-3" />
              <span>Next Prompt</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!currentAnswer.trim()}
            className="flex items-center gap-1.5 bg-[#23282A] text-[#EDE9E0] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider font-bold hover:bg-[#D9A62E] hover:text-[#141617] disabled:opacity-40 transition-colors"
          >
            {savedNotice ? (
              <>
                <Check className="h-3 w-3" />
                <span>Saved to My Ideas</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3 w-3" />
                <span>Save Note</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
