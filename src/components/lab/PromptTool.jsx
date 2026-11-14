import { useState } from 'react';
import { Shuffle, Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';
import LabPanel from '@/components/lab/LabPanel';
import { useBrief } from '@/lib/BriefContext';

const REAL_PROBLEM_QUESTIONS = [
  {
    q: 'What do you keep copying between tools?',
    context: 'e.g. Pasting addresses into maps to check delivery zones; copying spreadsheet quotes into email drafts.',
  },
  {
    q: 'What do customers need explained repeatedly?',
    context: 'e.g. Sizing thresholds; debris weight allowances; why custom fabrication quotes take two days.',
  },
  {
    q: 'Which decision requires opening several files?',
    context: 'e.g. Cross-referencing dimensional CAD specs with supplier price lists and air volume formulas.',
  },
  {
    q: 'Where do bookings, quotes, or requests get stuck?',
    context: 'e.g. High-value leads waiting for manual sales triage; double-bookings over weekend dates.',
  },
  {
    q: 'What should someone be able to change and immediately understand?',
    context: 'e.g. Changing dimensions and instantly seeing face velocity and estimated price with visible formulas.',
  },
];

export default function PromptTool() {
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const { addWhiteboardClip, openBrief } = useBrief();

  const current = REAL_PROBLEM_QUESTIONS[index];

  const next = () => {
    setIndex((prev) => (prev + 1) % REAL_PROBLEM_QUESTIONS.length);
    setUserAnswer('');
    setSavedNotice(false);
  };

  const handleSaveToBrief = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    addWhiteboardClip({
      type: 'diagnostic-answer',
      title: `Friction Diagnostic: ${current.q}`,
      text: userAnswer.trim(),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <LabPanel
      id="lab-prompts"
      num="03"
      kicker="Problem-Finding Instrument"
      title="Find the question."
      note="Five diagnostic prompts to locate the real operational bottleneck. Answer one and save it directly into My Ideas."
    >
      <div className="space-y-4">
        <blockquote className="border-l-3 border-[#17504A] pl-4">
          <p className="font-display text-[clamp(1.15rem,2.5vw,1.6rem)] font-extrabold uppercase leading-snug tracking-tight text-[#23282A]">
            {current.q}
          </p>
          <p className="mt-1 text-xs text-[#23282A]/70 font-sans italic">
            {current.context}
          </p>
        </blockquote>

        {/* User Answer Input */}
        <form onSubmit={handleSaveToBrief} className="space-y-2">
          <textarea
            rows={3}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here (e.g. Sales reps spend 3 hours a day copying line items from Excel into QuickBooks...)"
            className="w-full bg-white/70 border border-[#23282A]/25 p-2.5 text-xs text-[#23282A] font-sans rounded focus:border-[#17504A] focus:outline-none"
          />

          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] text-[#23282A]/60">
              {savedNotice ? '✓ Saved to My Ideas!' : 'Saves to My Ideas collection'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={!userAnswer.trim()}
                className="bg-[#17504A] text-[#EDE9E0] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider font-bold rounded hover:bg-[#23282A] disabled:opacity-40 transition-colors flex items-center gap-1"
              >
                <Bookmark className="h-3 w-3" />
                <span>Save to My Ideas</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#23282A]/20 pt-3">
        <span className="font-mono text-xs text-[#23282A]/60">
          Prompt {String(index + 1).padStart(2, '0')} / {String(REAL_PROBLEM_QUESTIONS.length).padStart(2, '0')}
        </span>
        <button
          onClick={next}
          className="flex items-center gap-1.5 border border-[#23282A]/30 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-[#23282A] hover:bg-[#23282A] hover:text-[#EDE9E0] transition-colors rounded"
        >
          <Shuffle className="h-3 w-3" /> Next Diagnostic Question
        </button>
      </div>
    </LabPanel>
  );
}
