import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { PROJECTS } from '@/data/projects';
import { TEMPLATES } from '@/data/templates';
import { useBrief } from '@/lib/BriefContext';

const FRICTION_PRESETS = [
  {
    id: 'quoting-bottleneck',
    label: 'Quotes Take Too Long / Phone Bottlenecks',
    question: 'Are your sales reps or dispatchers trapped in hours of manual calculations and sizing phone tag?',
    matchedProject: 'lone-wolf-dumpsters',
    matchedTemplate: 'quote-sizing-engine',
    solutionSummary:
      'Replace manual phone sizing with a self-calculating quote calculator that checks delivery radius and debris densities before dispatch.',
  },
  {
    id: 'engineering-specs',
    label: 'Custom Specs & Dimension Mismatches',
    question: 'Do custom fabrication quotes require engineer math in spreadsheets with risk of dimensional errors?',
    matchedProject: 'inncontrol-coils',
    matchedTemplate: 'parametric-estimator',
    solutionSummary:
      'Identify the rules the tool needs to follow into a live browser calculator that validates CFM tolerances in real time and outputs instant contractor bid packets.',
  },
  {
    id: 'bilingual-booking',
    label: 'Double Bookings & Multi-Language Chaos',
    question: 'Are high-value asset reservations colliding across phone, text, and language barriers?',
    matchedProject: 'edr-party-rentals',
    matchedTemplate: 'bilingual-booking-triage',
    solutionSummary:
      'Deploy a conflict-free asset reservation engine with complete Spanish/English parity, dynamic surface fees, and automated delivery manifests.',
  },
  {
    id: 'website-intake-leak',
    label: 'Website Doesn’t Convert / Leaking Leads',
    question: 'Is your website full of traffic but generating few qualified inquiries because next steps are vague?',
    matchedProject: 'website-audit-system',
    matchedTemplate: 'visual-audit-tool',
    solutionSummary:
      'Run an evidence-first 4-pillar system check to pinpoint conversion bottlenecks and replace generic contact forms with structured intake.',
  },
];

export default function NeedSelector() {
  const [selectedId, setSelectedId] = useState(FRICTION_PRESETS[0].id);
  const navigate = useNavigate();
  const { setTemplate, toggleSaveProject, openBrief } = useBrief();

  const current = FRICTION_PRESETS.find((p) => p.id === selectedId);
  const project = PROJECTS.find((p) => p.id === current.matchedProject);
  const template = TEMPLATES.find((t) => t.id === current.matchedTemplate);

  const handleAddExample = () => {
    if (project) {
      toggleSaveProject(project);
    }
    if (template) {
      setTemplate(template);
    }
    openBrief();
  };

  return (
    <div className="border border-[#DFDACE]/20 bg-[#1A1E1F] p-5 sm:p-6 rounded shadow-lg text-[#EDE9E0]">
      <div className="flex items-center justify-between border-b border-[#DFDACE]/15 pb-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#D9A62E] font-bold">
            FIND A RELEVANT EXAMPLE
          </span>
          <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#EDE9E0]">
            What are you trying to fix?
          </h3>
        </div>
        <span className="hidden sm:inline font-mono text-[10px] text-[#DFDACE]/50">
          Match Friction → Practical System
        </span>
      </div>

      {/* Friction Buttons */}
      <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
        {FRICTION_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider rounded transition-all text-left ${
              selectedId === p.id
                ? 'bg-[#D9A62E] text-[#23282A] font-bold shadow-sm'
                : 'bg-[#23282A] text-[#DFDACE]/70 hover:text-[#EDE9E0] hover:bg-[#2C3335]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Resolved System Match */}
      {current && (
        <div className="mt-5 border border-[#17504A] bg-[#17504A]/20 p-4 rounded space-y-3">
          <p className="text-xs sm:text-[13px] text-[#EDE9E0] font-sans font-medium leading-relaxed">
            {current.question}
          </p>

          <div className="pt-2 border-t border-[#17504A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#D9A62E] font-bold block">
                Recommended Solution Pattern:
              </span>
              <p className="text-xs text-[#DFDACE]/90 font-sans mt-0.5">{current.solutionSummary}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#17504A]/30 flex flex-wrap items-center justify-between gap-2">
            {project && (
              <span className="font-mono text-xs text-[#EDE9E0]/80">
                Demonstrated in: <strong>{project.title}</strong> — {project.subtitle}
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/work')}
                className="font-mono text-xs text-[#DFDACE]/70 hover:text-[#D9A62E] underline"
              >
                View case study
              </button>
              <button
                onClick={handleAddExample}
                className="bg-[#D9A62E] text-[#23282A] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider rounded hover:bg-[#c49425] transition-colors flex items-center gap-1"
              >
                <span>Add this example to my ideas</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
