import React, { useState } from 'react';
import {
  ArrowRight,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Globe,
  Cpu,
  HeartHandshake,
  Compass,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';
import { PROJECTS } from '@/data/projects';

export default function SecondaryGallery({ onOpenCaseStudy }) {
  const { isProjectSaved, toggleSaveProject } = useBrief();
  const [filter, setFilter] = useState('all'); // 'all' | 'software' | 'civic' | 'creative'

  const galleryItems = [
    {
      id: 'gensort-studio',
      category: 'software',
      categoryLabel: 'Local-First AI Software',
      badge: 'Live Working App',
      icon: Cpu,
      accent: '#2B7C72',
    },
    {
      id: 'self-cartography',
      category: 'software',
      categoryLabel: 'Explainable Pattern Engine',
      badge: 'Live Working App',
      icon: Compass,
      accent: '#17504A',
    },
    {
      id: 'wcsm',
      category: 'software',
      categoryLabel: 'Automated Data Directory',
      badge: 'Live Working App',
      icon: BookOpen,
      accent: '#D9A62E',
    },
    {
      id: 'website-audit-system',
      category: 'software',
      categoryLabel: 'Diagnostic Tooling',
      badge: 'Live Working App',
      icon: ShieldCheck,
      accent: '#D9A62E',
    },
    {
      id: 'maps-with-teeth',
      category: 'civic',
      categoryLabel: 'Public-Interest Civic System',
      badge: 'Live Initiative',
      icon: HeartHandshake,
      accent: '#D97706',
    },
    {
      id: 'how-to-explain-yourself-to-wolves',
      category: 'creative',
      categoryLabel: 'Literary & Narrative World',
      badge: 'Live Website',
      icon: Globe,
      accent: '#A31D1D',
    },
    {
      id: 'made-of-reasons',
      category: 'creative',
      categoryLabel: '3D WebGL Spatial Canvas',
      badge: 'Live Website',
      icon: Sparkles,
      accent: '#48E5C2',
    },
    {
      id: 'brain-raccoon',
      category: 'creative',
      categoryLabel: 'Cognitive Focus Utility',
      badge: 'Live Website',
      icon: Sparkles,
      accent: '#E6AF2E',
    },
    {
      id: 'revision-atlas',
      category: 'software',
      categoryLabel: 'Editorial AST Architecture',
      badge: 'Architecture Study',
      icon: BookOpen,
      accent: '#CA8A04',
    },
    {
      id: 'edr-party-rentals',
      category: 'software',
      categoryLabel: 'Bilingual Booking Rules',
      badge: 'System Prototype',
      icon: Cpu,
      accent: '#E25822',
    },
  ];

  const enriched = galleryItems
    .map((item) => {
      const proj = PROJECTS.find((p) => p.id === item.id);
      if (!proj) return null;
      return { ...proj, ...item };
    })
    .filter(Boolean);

  const visible =
    filter === 'all' ? enriched : enriched.filter((p) => p.category === filter);

  return (
    <section className="space-y-6 border-t border-[#DFDACE]/15 pt-12">
      {/* Header & Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#D9A62E] font-bold block">
            WORKING PRODUCTS, CIVIC INITIATIVES &amp; ARCHITECTURAL STUDIES
          </span>
          <h3 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#EDE9E0]">
            Complete Work &amp; Product Index
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#DFDACE]/70 font-sans max-w-2xl">
            Every system below is labeled by what is live and running—distinguishing deployed client platforms and standalone web applications from architectural case studies.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {[
            { id: 'all', label: `All (${enriched.length})` },
            { id: 'software', label: 'Apps, Tools & Architecture' },
            { id: 'civic', label: 'Civic Continuity' },
            { id: 'creative', label: 'Creative & WebGL' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded border transition-colors ${
                filter === tab.id
                  ? 'border-[#D9A62E] bg-[#D9A62E] text-[#141617] font-bold'
                  : 'border-[#DFDACE]/20 bg-[#181B1C] text-[#DFDACE]/75 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => {
          const saved = isProjectSaved(p.id);
          const Icon = p.icon;

          return (
            <article
              key={p.id}
              className="group flex flex-col justify-between rounded-xl border border-[#DFDACE]/15 bg-[#16191B] overflow-hidden hover:border-[#D9A62E]/50 transition-all shadow-lg"
            >
              <div>
                {/* Visual Preview Thumbnail */}
                {p.mediaUrl ? (
                  <div className="relative h-44 bg-[#101213] border-b border-[#DFDACE]/10 overflow-hidden">
                    <img
                      src={p.mediaUrl}
                      alt={p.title}
                      className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-[#121415]/90 backdrop-blur-sm border border-white/15 px-2.5 py-1 rounded font-mono text-[10px] text-[#EDE9E0]">
                      <Icon className="h-3 w-3 text-[#D9A62E]" />
                      <span>{p.categoryLabel}</span>
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-[#17504A]/95 border border-emerald-400/30 px-2 py-0.5 rounded font-mono text-[9.5px] font-bold uppercase text-[#EDE9E0]">
                      {p.badge}
                    </div>
                  </div>
                ) : (
                  <div className="h-32 bg-[#121517] border-b border-[#DFDACE]/10 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#D9A62E]">
                        <Icon className="h-3.5 w-3.5" />
                        <span>{p.categoryLabel}</span>
                      </div>
                      <span className="bg-[#23282A] border border-[#DFDACE]/20 px-2 py-0.5 rounded font-mono text-[9.5px] font-bold uppercase text-[#DFDACE]">
                        {p.badge}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-[#DFDACE]/50 truncate">
                      {p.tangibleOutput?.title}
                    </div>
                  </div>
                )}

                {/* Body */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-display text-lg font-extrabold uppercase tracking-tight text-[#EDE9E0] group-hover:text-[#D9A62E] transition-colors">
                        {p.title}
                      </h4>
                      <p className="font-mono text-[11px] text-[#D9A62E]/90">
                        {p.subtitle}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSaveProject(p)}
                      title={saved ? 'Saved in My Ideas' : 'Save to My Ideas'}
                      className={`p-1.5 rounded border shrink-0 transition-colors ${
                        saved
                          ? 'border-[#D9A62E] bg-[#D9A62E]/20 text-[#D9A62E]'
                          : 'border-[#DFDACE]/20 text-[#DFDACE]/60 hover:text-white'
                      }`}
                    >
                      {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  <p className="text-xs text-[#DFDACE]/80 font-sans leading-relaxed line-clamp-3">
                    {p.plainSentence}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-5 py-3.5 border-t border-[#DFDACE]/10 bg-[#121415] flex items-center justify-between gap-2 font-mono text-xs">
                <button
                  onClick={() => onOpenCaseStudy(p.id)}
                  className="text-[#EDE9E0] hover:text-[#D9A62E] font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Inspect Details</span>
                  <ArrowRight className="h-3 w-3" />
                </button>

                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-white flex items-center gap-1 font-bold transition-colors text-[11px]"
                  >
                    <span>
                      {p.liveUrl.startsWith('/') ? 'Launch App' : 'Live Site'}
                    </span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
