import React, { useState } from 'react';
import { Shuffle, ArrowLeft, Bookmark, Check, HelpCircle, ArrowDown } from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';

const GROUNDED_QUESTIONS = [
  {
    id: 'copy-paste',
    q: 'What do you keep copying from one place to another?',
    context: 'e.g. Pasting customer addresses into map tools to verify delivery zones; retyping spreadsheet quotes into email drafts.',
  },
  {
    id: 'repeated-explanation',
    q: 'What do people repeatedly ask you to explain?',
    context: 'e.g. Sizing thresholds; debris weight allowances; why custom fabrication quotes take two days.',
  },
  {
    id: 'after-submit',
    q: 'What happens after someone submits your form?',
    context: 'e.g. Does it sit in an unread general inbox, or does it validate rules and route directly to the person who needs to act?',
  },
  {
    id: 'stuck-request',
    q: 'Where does a request get stuck waiting for someone?',
    context: 'e.g. Estimators manually recalculating CAD dimensions while prospective clients wait for a price.',
  },
  {
    id: 'messages-spreadsheets',
    q: 'What do you currently track in messages or a spreadsheet?',
    context: 'e.g. Equipment availability, pending drop-offs, pricing rules, or contractor notes that live only in someone’s head.',
  },
  {
    id: 'desired-capability',
    q: 'What would you like someone to be able to do on your website that they can’t do today?',
    context: 'e.g. Calculate custom pricing in real-time, see exact availability, or generate their own submittal specification.',
  },
];

export default function BuildPromptCard({ onAppendToInquiry }) {
  const [history, setHistory] = useState([0]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [savedNotice, setSavedNotice] = useState(false);
  const { addWhiteboardClip } = useBrief();

  const currentIdx = history[historyIndex] ?? 0;
  const currentPrompt = GROUNDED_QUESTIONS[currentIdx];
  const currentAnswer = answers[currentPrompt.id] || '';

  const handleNext = () => {
    const remaining = GROUNDED_QUESTIONS.map((_, i) => i).filter((i) => i !== currentIdx);
    const nextIdx = remaining[Math.floor(Math.random() * remaining.length)];

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

  const handleSaveToIdeas = () => {
    if (!currentAnswer.trim()) return;
    addWhiteboardClip({
      type: 'operational-friction-note',
      title: `Need Note: ${currentPrompt.q}`,
      text: currentAnswer.trim(),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2400);
  };

  const handleSendToInquiry = () => {
    if (!currentAnswer.trim()) return;
    if (onAppendToInquiry) {
      onAppendToInquiry(`[${currentPrompt.q}]\n${currentAnswer.trim()}`);
    }
  };

  return (
    <div className="bg-[#1C2022] text-[#EDE9E0] border border-[#DFDACE]/25 rounded-lg p-5 sm:p-6 shadow-xl font-sans">
      <div className="flex items-center justify-between border-b border-[#DFDACE]/15 pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#D9A62E]" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#D9A62E] font-bold">
            Grounded Prompt • Describing the Need
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#DFDACE]/60">
          Question {String(currentIdx + 1).padStart(2, '0')} of {String(GROUNDED_QUESTIONS.length).padStart(2, '0')}
        </span>
      </div>

      {/* Stable Content Box */}
      <div className="mt-4 min-h-[120px] flex flex-col justify-between">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#EDE9E0] leading-snug">
            “{currentPrompt.q}”
          </h3>
          <p className="mt-2 text-xs sm:text-[13px] text-[#DFDACE]/80 font-sans leading-relaxed">
            {currentPrompt.context}
          </p>
        </div>
      </div>

      {/* Persistent Typed Response */}
      <div className="mt-4 space-y-2 border-t border-[#DFDACE]/10 pt-3">
        <textarea
          rows={2}
          value={currentAnswer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Type your notes here (e.g. Sales reps spend 3 hours a day copying addresses into map software...)"
          className="w-full bg-[#141617] border border-[#DFDACE]/20 p-2.5 text-xs text-[#EDE9E0] rounded focus:border-[#D9A62E] focus:outline-none font-sans"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={historyIndex <= 0}
              className="flex items-center gap-1 font-mono text-[11px] text-[#DFDACE]/70 uppercase tracking-wider hover:text-[#EDE9E0] disabled:opacity-30 disabled:pointer-events-none py-1 px-2 border border-[#DFDACE]/20 rounded"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 font-mono text-[11px] text-[#141617] bg-[#D9A62E] font-bold uppercase tracking-wider hover:bg-[#e0b240] py-1 px-3 rounded transition-colors"
            >
              <Shuffle className="h-3 w-3" />
              <span>Next question</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onAppendToInquiry && currentAnswer.trim() && (
              <button
                type="button"
                onClick={handleSendToInquiry}
                className="flex items-center gap-1 text-xs font-mono text-[#D9A62E] hover:underline py-1"
              >
                <ArrowDown className="h-3 w-3" />
                <span>Insert into Inquiry</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveToIdeas}
              disabled={!currentAnswer.trim()}
              className="flex items-center gap-1.5 bg-[#23282A] text-[#EDE9E0] px-3 py-1 font-mono text-[11px] uppercase tracking-wider font-bold rounded border border-[#DFDACE]/20 hover:border-[#D9A62E] disabled:opacity-40 transition-colors"
            >
              {savedNotice ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Saved to My Ideas!</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-3 w-3" />
                  <span>Save Note</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
