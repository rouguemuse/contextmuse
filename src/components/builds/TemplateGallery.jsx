import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  FileCheck,
  Check,
} from 'lucide-react';
import { TEMPLATES } from '@/data/templates';
import { useBrief } from '@/lib/BriefContext';

export default function TemplateGallery({ onSelectStartingPoint }) {
  const [activePreview, setActivePreview] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const { addWhiteboardClip, openBrief } = useBrief();

  const handleUseStartingPoint = (template) => {
    // Add to Brief
    addWhiteboardClip({
      type: 'template-selection',
      title: `Starting Blueprint: ${template.title}`,
      text: `${template.title} (${template.badge}) — Derived from ${template.derivedFrom}. Ideal for: ${template.idealFor}`,
    });

    if (onSelectStartingPoint) {
      onSelectStartingPoint(template);
    }

    setSelectedNotice(template.id);
    setTimeout(() => setSelectedNotice(null), 3000);
  };

  return (
    <section id="templates" className="space-y-6 font-sans">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#23282A]/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#D9A62E]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#23282A]/70 font-bold">
              STARTER BLUEPRINTS
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#23282A]">
            Browse Available Templates & Systems
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-[#17504A] text-[#EDE9E0] px-2.5 py-1 font-mono text-[10px] font-bold uppercase">
            Complete Blueprints • Not Generic UI Kits
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-[#23282A]/80 leading-relaxed max-w-3xl">
        Every template here is an operational system architecture derived from actual working software. Browse the blueprints below, preview their structure, or choose one as a starting point for your project. No whiteboard or signup required.
      </p>

      {/* Grid of 5 Complete Blueprints */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((tmpl) => {
          const isSelected = selectedNotice === tmpl.id;

          return (
            <div
              key={tmpl.id}
              className="bg-[#1C2022] text-[#EDE9E0] border border-[#DFDACE]/25 rounded-lg p-5 shadow-xl flex flex-col justify-between hover:border-[#D9A62E]/60 transition-all group"
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-center justify-between gap-2 border-b border-[#DFDACE]/15 pb-2.5">
                  <span className="rounded bg-[#17504A] text-[#EDE9E0] px-2 py-0.5 font-mono text-[9px] font-bold uppercase">
                    {tmpl.badge}
                  </span>
                  <span className="font-mono text-[10px] text-[#DFDACE]/60 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{tmpl.deliveryTimeframe.split(' ')[0]}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-3 font-display text-lg font-extrabold uppercase tracking-tight text-[#EDE9E0] group-hover:text-[#D9A62E] transition-colors leading-snug">
                  {tmpl.title}
                </h3>

                {/* Plain-Language Explanation */}
                <p className="mt-2 text-xs text-[#DFDACE]/80 leading-relaxed font-sans line-clamp-3">
                  {tmpl.description}
                </p>

                {/* Visual Blueprint Schematic Mini-Diagram */}
                <div className="mt-4 p-3 bg-[#141617] rounded border border-[#DFDACE]/10 space-y-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#D9A62E] font-bold block">
                    Blueprint Architecture:
                  </span>
                  <div className="space-y-1">
                    {tmpl.componentsIncluded.slice(0, 3).map((comp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 font-mono text-[10px] text-[#DFDACE]/70"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D9A62E]" />
                        <span className="truncate">{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 text-[11px] font-mono text-[#DFDACE]/60">
                  <span>Who it helps: </span>
                  <span className="text-[#EDE9E0]/80 italic">{tmpl.idealFor}</span>
                </div>
              </div>

              {/* Actions: Preview & Use as Starting Point */}
              <div className="mt-5 pt-3 border-t border-[#DFDACE]/15 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActivePreview(tmpl)}
                  className="flex items-center gap-1 text-xs font-mono text-[#DFDACE]/80 hover:text-[#D9A62E] py-1 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUseStartingPoint(tmpl)}
                  className="flex items-center gap-1.5 bg-[#D9A62E] text-[#141617] hover:bg-[#e0b240] px-3 py-1.5 text-xs font-mono font-bold uppercase rounded transition-colors shadow-sm"
                >
                  {isSelected ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Ready in Inquiry!</span>
                    </>
                  ) : (
                    <>
                      <span>Use as starting point</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Working Action Modal for Template Preview */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1C2022] text-[#EDE9E0] border border-[#DFDACE]/30 rounded-lg max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#DFDACE]/15 pb-3">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#D9A62E] font-bold">
                  TEMPLATE BLUEPRINT PREVIEW
                </span>
                <h3 className="font-display text-2xl font-extrabold uppercase text-[#EDE9E0]">
                  {activePreview.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="text-[#DFDACE]/60 hover:text-[#EDE9E0] p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-sans">
              <p className="text-[#EDE9E0]/90 leading-relaxed">{activePreview.description}</p>

              <div className="p-3 bg-[#141617] rounded border border-[#DFDACE]/10 space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#D9A62E] font-bold block">
                  Real Grounded Origin:
                </span>
                <p className="text-xs text-[#DFDACE]/80">
                  Derived from production battle-testing in <strong>{activePreview.derivedFrom}</strong>.
                </p>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#DFDACE]/70 font-bold block mb-2">
                  All Included Functional Components:
                </span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {activePreview.componentsIncluded.map((c, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded bg-[#23282A] border border-[#DFDACE]/10 font-mono text-xs flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#D9A62E] shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#DFDACE]/70 pt-2 border-t border-[#DFDACE]/15">
                <span>Typical Implementation Horizon:</span>
                <strong className="text-[#EDE9E0]">{activePreview.deliveryTimeframe}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#DFDACE]/15">
              <button
                type="button"
                onClick={() => setActivePreview(null)}
                className="px-4 py-2 font-mono text-xs text-[#DFDACE]/70 hover:text-[#EDE9E0]"
              >
                Close Preview
              </button>

              <button
                type="button"
                onClick={() => {
                  handleUseStartingPoint(activePreview);
                  setActivePreview(null);
                }}
                className="flex items-center gap-2 bg-[#D9A62E] text-[#141617] hover:bg-[#e0b240] px-5 py-2 font-mono text-xs font-bold uppercase rounded shadow-md transition-colors"
              >
                <span>Use as starting point</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
