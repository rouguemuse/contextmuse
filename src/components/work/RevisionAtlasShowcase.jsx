import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
  GitBranch,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';

export default function RevisionAtlasShowcase({ onOpenCaseStudy }) {
  const { isProjectSaved, toggleSaveProject } = useBrief();
  const saved = isProjectSaved('revision-atlas');

  const [activeSceneIndex, setActiveSceneIndex] = useState(1);

  const scenes = [
    {
      id: 0,
      ch: 'Ch 1',
      title: 'The River Bank',
      tension: 38,
      dialogue: '28%',
      words: 2450,
      draft1: 'The river was swollen with grey thaw, rushing past the alder roots in violent silence.',
      draft2: 'Thaw had broken early, turning the low water brown and urgent along the alder roots.',
      ripple: 'Draft 2 accelerates timeline by four days; shifts season forward into late March.',
    },
    {
      id: 1,
      ch: 'Ch 4',
      title: 'The Unopened Letter',
      tension: 72,
      dialogue: '45%',
      words: 3120,
      draft1: 'She held the letter against the light, terrified of opening it. The wax seal remained cold against her thumb.',
      draft2: 'She broke the crimson seal without hesitation. Waiting had already cost a winter, and patience had become another word for surrender.',
      ripple: 'Continuity Alert: Flags Chapter 19 mention of intact wax seal on writer’s desk. Scene 19 must be revised.',
    },
    {
      id: 2,
      ch: 'Ch 7',
      title: 'Threshold Crossing',
      tension: 89,
      dialogue: '62%',
      words: 1890,
      draft1: 'They reached the perimeter at dusk. Neither looked back across the boundary wire.',
      draft2: 'The boundary wire hummed softly in the freezing rain. They crossed without looking back.',
      ripple: 'Adds sensory acoustic motif connected to wire hums in Chapter 11.',
    },
  ];

  const current = scenes[activeSceneIndex];

  const handleSave = () => {
    toggleSaveProject({
      id: 'revision-atlas',
      title: 'Revision Atlas',
      subtitle: 'Structural Revision Workbench for Long-Form Prose',
      tier: 'featured',
    });
  };

  return (
    <section id="revision-atlas" className="space-y-6 border-t border-[#DFDACE]/15 pt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DFDACE]/15 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono text-xs">
            <span className="rounded bg-[#FAF8F5] text-[#1C1917] px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
              Supporting System
            </span>
            <span className="text-[#DFDACE]/60">Editorial Technology & Narrative Systems</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#EDE9E0]">
            Revision Atlas
          </h2>
          <p className="mt-0.5 font-mono text-xs sm:text-sm text-[#CA8A04]">
            Structural Revision Workbench for Long-Form Prose
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenCaseStudy('revision-atlas')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded bg-[#CA8A04] text-[#141617] hover:bg-[#b07802] transition-colors"
          >
            <span>Inspect Case Study</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleSave}
            title={saved ? 'Saved in My Ideas' : 'Save to My Ideas'}
            className={`p-1.5 rounded border transition-colors ${
              saved
                ? 'border-[#CA8A04] bg-[#CA8A04]/20 text-[#CA8A04]'
                : 'border-[#DFDACE]/25 text-[#EDE9E0] hover:border-[#CA8A04] hover:text-[#CA8A04]'
            }`}
          >
            {saved ? <BookmarkCheck className="h-4 w-4 text-[#CA8A04]" /> : <Bookmark className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Grid: Authentic Interface Preview + Manuscript Structure */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Interface Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-[#DFDACE]/60 px-1">
            <span className="font-bold text-[#CA8A04] uppercase tracking-wider">
              Workbench Interface (contextmuse.com/work/revision-atlas)
            </span>
            <span>2800 × 1750 px Capture</span>
          </div>

          <div className="rounded-xl border border-[#CA8A04]/30 bg-[#1C1917] overflow-hidden shadow-lg p-2">
            <div className="rounded-lg overflow-hidden border border-white/10 relative">
              <img
                src="/assets/images/revision-atlas-cover.webp"
                alt="Revision Atlas Structural Interface"
                className="w-full h-auto object-cover max-h-[440px] block"
                loading="eager"
              />
              <div className="absolute bottom-2.5 left-2.5 bg-[#1C1917]/90 backdrop-blur-sm border border-[#CA8A04]/40 px-2.5 py-1 rounded font-mono text-[10px] text-[#EDE9E0]">
                Original Brand: Warm Paper #FAF8F5 & Literary Ochre #CA8A04
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Architecture & Variant Diff Inspection (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-[#191716] border border-white/10 space-y-2 font-sans text-xs">
            <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider block">
              Cognitive Problem:
            </span>
            <p className="text-[#DFDACE]/90 leading-relaxed">
              Developmental editing on 80,000+ word manuscripts suffers from flat-document blindness. Authors cannot see narrative tension balance in standard word processors, and bold chapter rewrites risk unseen continuity breakage down the line.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#191716] border border-[#CA8A04]/30 space-y-2 font-sans text-xs">
            <span className="font-mono text-xs font-bold text-[#CA8A04] uppercase tracking-wider block">
              The Software Architecture:
            </span>
            <p className="text-[#DFDACE]/90 leading-relaxed">
              A local-first parser converts prose into an Abstract Syntax Tree (AST) of addressable scene nodes. Authors can test non-destructive variant drafts side-by-side with automated downstream continuity alerts—running 100% locally.
            </p>
          </div>

          {/* Interactive Scene Node & Diff Telemetry */}
          <div className="p-4 rounded-xl bg-[#161413] border border-white/10 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-[#CA8A04] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span>AST Scene Node Matrix</span>
              </span>
              <span className="text-[10px] text-[#DFDACE]/50">3 Scenes Sampled</span>
            </div>

            {/* Scene Selector */}
            <div className="grid grid-cols-3 gap-1.5">
              {scenes.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSceneIndex(idx)}
                  className={`p-1.5 rounded border text-left transition-colors ${
                    activeSceneIndex === idx
                      ? 'border-[#CA8A04] bg-[#CA8A04]/20 text-[#EDE9E0]'
                      : 'border-white/10 bg-black/30 text-[#DFDACE]/60 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-[10px] block">{s.ch}</span>
                  <span className="text-[9px] text-[#CA8A04]">{s.tension}% Tension</span>
                </button>
              ))}
            </div>

            {/* Variant Diff Excerpt */}
            <div className="p-2.5 rounded bg-black/50 border border-white/5 space-y-1.5 text-[11px] font-sans">
              <div>
                <span className="font-mono text-[9.5px] text-red-400 block font-bold">Draft 1 (Active):</span>
                <p className="line-through text-[#DFDACE]/60 text-[10.5px]">"{current.draft1}"</p>
              </div>
              <div>
                <span className="font-mono text-[9.5px] text-emerald-400 block font-bold">Variant 2 (Branch):</span>
                <p className="text-emerald-200 text-[10.5px]">"{current.draft2}"</p>
              </div>
            </div>

            {/* Downstream Ripple Alert */}
            <div className="flex items-start gap-2 p-2 rounded bg-[#CA8A04]/10 border border-[#CA8A04]/25 text-[10.5px] text-[#DFDACE]/90">
              <AlertCircle className="h-3.5 w-3.5 text-[#CA8A04] shrink-0 mt-0.5" />
              <span>{current.ripple}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
