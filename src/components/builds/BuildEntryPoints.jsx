import React, { useState } from 'react';
import { TEMPLATES } from '@/data/templates';
import { PROJECTS } from '@/data/projects';
import { LayoutTemplate, Image, HelpCircle, ArrowRight, Check, Upload, Sparkles } from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';

export default function BuildEntryPoints({
  onSelectTemplate,
  onUploadImage,
  onDescribeProblem,
}) {
  const [activeModal, setActiveModal] = useState(null); // 'templates' | 'examples' | 'problem' | null
  const [problemText, setProblemText] = useState('');
  const [industry, setIndustry] = useState('Service & Equipment Logistics');
  const { setTemplate, brief } = useBrief();

  const handleTemplatePick = (tmpl) => {
    onSelectTemplate(tmpl.id);
    setTemplate(tmpl);
    setActiveModal(null);
  };

  const handleProblemSubmit = (e) => {
    e.preventDefault();
    if (!problemText.trim()) return;
    onDescribeProblem(problemText, industry);
    setProblemText('');
    setActiveModal(null);
  };

  return (
    <div className="mb-2">
      {/* 3 Entry Point Trigger Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border border-[#23282A]/20 bg-[#D4CEBF] p-3 rounded shadow-sm">
        <button
          onClick={() => setActiveModal('templates')}
          className="group flex flex-col justify-between p-3.5 bg-[#EDE9E0] text-[#23282A] border border-[#23282A]/20 text-left transition-all hover:border-[#23282A] hover:shadow-md"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#17504A] font-bold">
              Pathway 01
            </span>
            <LayoutTemplate className="h-4 w-4 text-[#17504A] group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-tight">
              Start with a Blueprint
            </h4>
            <p className="mt-1 text-[11.5px] text-[#23282A]/70 leading-relaxed font-sans">
              Load an operational pattern: quoting engine, tolerance estimator, or booking triage.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1 font-mono text-[11px] text-[#17504A] font-bold">
            <span>Browse {TEMPLATES.length} Blueprints</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </button>

        <button
          onClick={() => setActiveModal('examples')}
          className="group flex flex-col justify-between p-3.5 bg-[#EDE9E0] text-[#23282A] border border-[#23282A]/20 text-left transition-all hover:border-[#23282A] hover:shadow-md"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#D9A62E] font-bold">
              Pathway 02
            </span>
            <Image className="h-4 w-4 text-[#D9A62E] group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-tight">
              Collect Case Clips & Visuals
            </h4>
            <p className="mt-1 text-[11.5px] text-[#23282A]/70 leading-relaxed font-sans">
              Pin verified case references from The Work or upload your own screenshots and sketches.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1 font-mono text-[11px] text-[#23282A] font-bold">
            <span>Import Proof / Upload</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </button>

        <button
          onClick={() => setActiveModal('problem')}
          className="group flex flex-col justify-between p-3.5 bg-[#EDE9E0] text-[#23282A] border border-[#23282A]/20 text-left transition-all hover:border-[#23282A] hover:shadow-md"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#2B7C72] font-bold">
              Pathway 03
            </span>
            <HelpCircle className="h-4 w-4 text-[#2B7C72] group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-tight">
              Describe Your Bottleneck
            </h4>
            <p className="mt-1 text-[11.5px] text-[#23282A]/70 leading-relaxed font-sans">
              Answer 2 targeted questions. We'll automatically seed the board with recommended nodes.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1 font-mono text-[11px] text-[#2B7C72] font-bold">
            <span>Guided Triage</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </button>
      </div>

      {/* MODAL 1: BROWSE TEMPLATES */}
      {activeModal === 'templates' && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-[#EDE9E0] text-[#23282A] border border-[#23282A]/30 p-6 rounded shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#23282A]/15 pb-3">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#17504A] font-bold">
                  Starter Blueprints
                </span>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight">
                  Choose a Foundation for Your Board
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="font-mono text-xs text-[#23282A]/60 hover:text-black border border-[#23282A]/20 px-2 py-1 rounded"
              >
                Close ✕
              </button>
            </div>

            <p className="mt-3 text-xs text-[#23282A]/70 leading-relaxed font-sans">
              These are honest, production-tested blueprints derived from working systems. Selecting one populates your canvas with pre-wired architectural nodes and notes.
            </p>

            <div className="mt-5 space-y-3">
              {TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="border border-[#23282A]/20 bg-white/70 p-4 rounded hover:border-[#17504A] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded bg-[#17504A] text-[#EDE9E0] px-2 py-0.5 font-mono text-[9px] font-bold uppercase">
                        {tmpl.badge}
                      </span>
                      <span className="font-mono text-[10px] text-[#23282A]/60">
                        Derived from: {tmpl.derivedFrom}
                      </span>
                    </div>
                    <h4 className="mt-2 font-display text-base font-bold text-[#23282A]">
                      {tmpl.title}
                    </h4>
                    <p className="mt-1 text-xs text-[#23282A]/80 font-sans leading-relaxed">
                      {tmpl.description}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {tmpl.componentsIncluded.map((comp, idx) => (
                        <span
                          key={idx}
                          className="bg-[#23282A]/5 border border-[#23282A]/10 px-2 py-0.5 rounded font-mono text-[9.5px] text-[#23282A]/70"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#23282A]/10 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#23282A]/60">
                      Est: {tmpl.deliveryTimeframe}
                    </span>
                    <button
                      onClick={() => handleTemplatePick(tmpl)}
                      className="bg-[#17504A] text-[#EDE9E0] px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider font-bold rounded hover:bg-[#23282A] transition-colors flex items-center gap-1.5"
                    >
                      <span>Load into Board</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: COLLECT EXAMPLES & UPLOAD */}
      {activeModal === 'examples' && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-[#EDE9E0] text-[#23282A] border border-[#23282A]/30 p-6 rounded shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#23282A]/15 pb-3">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#D9A62E] font-bold">
                  Visual Evidence & Examples
                </span>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight">
                  Pin Cases or Upload Reference Files
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="font-mono text-xs text-[#23282A]/60 hover:text-black border border-[#23282A]/20 px-2 py-1 rounded"
              >
                Close ✕
              </button>
            </div>

            {/* Direct Upload Section */}
            <div className="mt-4 border-2 border-dashed border-[#23282A]/30 bg-white/50 p-6 rounded text-center">
              <Upload className="h-7 w-7 text-[#17504A] mx-auto mb-2" />
              <p className="font-display text-sm font-bold uppercase">Upload Sketches or Screenshots</p>
              <p className="text-xs text-[#23282A]/60 mt-1 font-sans">
                Supports PNG, JPG, WebP. Images are processed locally in your browser and pinned directly onto the canvas.
              </p>
              <button
                onClick={() => {
                  onUploadImage();
                  setActiveModal(null);
                }}
                className="mt-3 bg-[#23282A] text-white px-4 py-2 font-mono text-xs uppercase tracking-wider rounded hover:bg-[#D9A62E] hover:text-[#23282A] transition-colors"
              >
                Select Files from Computer
              </button>
            </div>

            {/* Quick-Pin from The Work */}
            <div className="mt-6">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#23282A]/70 mb-2">
                Quick-Pin Real System Modules from The Work:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PROJECTS.slice(0, 6).map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      onDescribeProblem(`Reference: ${proj.title} (${proj.subtitle})`, proj.sector);
                      setActiveModal(null);
                    }}
                    className="p-3 border border-[#23282A]/20 bg-white/60 text-left rounded hover:border-[#17504A] hover:bg-white transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-mono text-[9px] text-[#D9A62E] font-bold uppercase">
                        {proj.sector}
                      </span>
                      <h5 className="font-display text-xs font-bold text-[#23282A]">{proj.title}</h5>
                      <p className="text-[11px] text-[#23282A]/70 line-clamp-1 mt-0.5">{proj.subtitle}</p>
                    </div>
                    <span className="mt-2 text-[10px] font-mono text-[#17504A] font-bold">
                      + Pin this model
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DESCRIBE A PROBLEM */}
      {activeModal === 'problem' && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl bg-[#EDE9E0] text-[#23282A] border border-[#23282A]/30 p-6 rounded shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#23282A]/15 pb-3">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#2B7C72] font-bold">
                  Problem-First Scoping
                </span>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight">
                  Where Does the Friction Hurt?
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="font-mono text-xs text-[#23282A]/60 hover:text-black border border-[#23282A]/20 px-2 py-1 rounded"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleProblemSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#23282A]/70 mb-1">
                  Industry / Business Model
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-white border border-[#23282A]/20 px-3 py-2 text-xs font-mono rounded"
                >
                  <option value="Industrial & HVAC Manufacturing">Industrial & HVAC Manufacturing</option>
                  <option value="Waste Hauling & Regional Equipment">Waste Hauling & Regional Equipment</option>
                  <option value="Commercial Event & Asset Rentals">Commercial Event & Asset Rentals</option>
                  <option value="Publishing & Editorial Systems">Publishing & Editorial Systems</option>
                  <option value="Consulting & Agency Diagnostics">Consulting & Agency Diagnostics</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#23282A]/70 mb-1">
                  Describe what takes too long or breaks:
                </label>
                <textarea
                  rows={4}
                  required
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  placeholder="e.g. Sales engineers spend 2 days configuring custom quotes on Excel spreadsheets; customers constantly order incompatible components..."
                  className="w-full bg-white border border-[#23282A]/20 px-3 py-2 text-xs font-sans rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 font-mono text-xs text-[#23282A]/60 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#23282A] text-white px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold rounded hover:bg-[#D9A62E] hover:text-[#23282A] transition-colors"
                >
                  Generate System Nodes on Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
