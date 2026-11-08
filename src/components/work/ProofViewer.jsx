import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Bookmark,
  BookmarkCheck,
  LayoutTemplate,
  ArrowRight,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Workflow,
  Sparkles,
  Info,
  Code2,
  FileCheck,
  ChevronDown,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';
import { useNavigate } from 'react-router-dom';
import {
  ReservationIllustration,
  DumpsterSizingDemo,
  ManuscriptMatrixIllustration,
  CivicContinuityIllustration,
  WolvesLiteraryIllustration,
  GenSortWorkflowIllustration,
  InncontrolOpsIllustration,
} from '@/components/work/FunctionalIllustrations';

export default function ProofViewer({ item, onClose }) {
  const { isProjectSaved, toggleSaveProject, openBrief } = useBrief();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'how-its-built'
  const [demoMode, setDemoMode] = useState(false);
  const [expandedTech, setExpandedTech] = useState(false);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!item) return null;

  const saved = isProjectSaved(item.id);
  const brand = item.originalBrand || {
    name: 'Standard Interface',
    primary: '#17504A',
    accent: '#D9A62E',
    surface: '#F8FAFC',
    text: '#0F172A',
  };

  const handleSendToWhiteboard = () => {
    try {
      const storedV3 = localStorage.getItem('contextmuse:board:v3');
      const storedV2 = localStorage.getItem('contextmuse:board:v2');
      let current = null;
      if (storedV3) {
        current = JSON.parse(storedV3);
      } else if (storedV2) {
        current = JSON.parse(storedV2);
      }
      if (!current || !Array.isArray(current.pieces)) {
        current = { pieces: [], links: [], drawings: [], constraints: '' };
      }

      const newPiece = {
        id: `p_ref_${Date.now()}`,
        type: 'page',
        x: 120 + Math.floor(Math.random() * 80),
        y: 140 + Math.floor(Math.random() * 80),
        w: 340,
        h: 220,
        label: `REF / ${item.title.toUpperCase()}`,
        text: `Problem: ${(item.overview?.needed || item.summary || '').slice(0, 130)}...\n\nPattern: ${item.subtitle}`,
        parentId: null,
        highlight: true,
        isStarter: false,
      };

      current.pieces.push(newPiece);
      localStorage.setItem('contextmuse:board:v3', JSON.stringify(current));
      localStorage.setItem('contextmuse:board:v2', JSON.stringify(current));
    } catch (e) {
      console.error(e);
    }
    onClose();
    navigate('/build');
  };

  const handleNeedSomethingLikeThis = () => {
    if (!saved) {
      toggleSaveProject(item);
    }
    openBrief();
  };

  const renderInteractiveDemo = () => {
    switch (item.illustrationType) {
      case 'inncontrol-ops':
        return <InncontrolOpsIllustration />;
      case 'dumpster-calc':
        return <DumpsterSizingDemo interactive={true} />;
      case 'manuscript-matrix':
        return <ManuscriptMatrixIllustration interactive={true} />;
      case 'gensort-workflow':
        return (
          <div className="bg-[#12121A] text-[#EDE9E0] p-5 rounded-lg border border-[#C9A84C]/30 shadow-inner space-y-3">
            <GenSortWorkflowIllustration interactive={true} />
            <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-[#DFDACE]/70">Full 5-stage local-first application ready to test:</span>
              <a
                href="/cxm_gensort/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C9A84C] text-black px-3 py-1 rounded font-bold uppercase tracking-wider hover:bg-[#d8b85c] transition-colors"
              >
                Launch GenSort Studio ↗
              </a>
            </div>
          </div>
        );
      case 'reservation':
        return (
          <div className="bg-[#FAF7F2] text-[#264653] p-5 rounded-lg border border-[#E25822]/30 shadow-inner">
            <div className="flex items-center justify-between border-b border-[#264653]/15 pb-2 mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#E25822] font-bold">
                Bilingual Asset Reservation Triage
              </span>
              <span className="rounded bg-[#E25822] text-white px-2 py-0.5 font-mono text-[10px] font-bold">
                EN / ES Parity
              </span>
            </div>
            <ReservationIllustration interactive={true} />
          </div>
        );
      case 'civic-continuity':
        return (
          <div className="bg-[#1C1917] text-[#E7E5E4] p-5 rounded-lg border border-[#D97706]/30 shadow-inner">
            <CivicContinuityIllustration interactive={true} />
          </div>
        );
      case 'wolves-literary':
        return (
          <div className="bg-[#1B1918] text-[#EDE9E0] p-5 rounded-lg border border-[#A31D1D]/40 shadow-inner">
            <WolvesLiteraryIllustration interactive={true} />
          </div>
        );
      default:
        return (
          <div className="p-6 text-center text-xs font-mono text-[#DFDACE]/70 bg-black/30 rounded border border-white/10">
            Interactive capability demonstration active in production deployment.
          </div>
        );
    }
  };

  const hasRealScreenshot = Boolean(item.mediaUrl);
  const hasInteractiveDemo = Boolean(item.illustrationType);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[85] overflow-y-auto bg-[#121415]/95 backdrop-blur-md text-[#EDE9E0]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
          className="min-h-full flex flex-col justify-between"
        >
          {/* Top Sticky Bar */}
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[#DFDACE]/15 bg-[#141617]/95 backdrop-blur-lg px-4 py-3 sm:px-8">
            <div className="flex items-center gap-3 truncate">
              <span className="font-mono text-xs text-[#D9A62E] font-bold shrink-0">
                CASE DOSSIER
              </span>
              <span className="text-[#DFDACE]/40">•</span>
              <h2 className="font-mono text-xs font-bold text-[#EDE9E0] uppercase truncate">
                {item.title}
              </h2>
              <span className="hidden md:inline font-mono text-xs text-[#DFDACE]/50 truncate">
                ({item.subtitle})
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleNeedSomethingLikeThis}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded bg-[#D9A62E] text-[#141617] hover:bg-[#e0b240] transition-colors shadow-sm"
              >
                <span>Tell me what you need</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => toggleSaveProject(item)}
                title={saved ? 'Remove from My Ideas' : 'Save to My Ideas'}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded border transition-colors ${
                  saved
                    ? 'border-[#D9A62E] bg-[#D9A62E]/20 text-[#D9A62E] font-bold'
                    : 'border-[#DFDACE]/30 text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E]'
                }`}
              >
                {saved ? <BookmarkCheck className="h-3.5 w-3.5 text-[#D9A62E]" /> : <Bookmark className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={onClose}
                aria-label="Close dossier"
                className="flex items-center gap-1 border border-[#DFDACE]/25 px-2.5 py-1.5 text-xs font-mono text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors rounded"
              >
                <span>Close</span>
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </header>

          {/* Dossier Content Body */}
          <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10 space-y-8 flex-1">
            {/* Title & Metadata Strip */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded bg-[#17504A] text-[#EDE9E0] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider">
                  {item.tier === 'featured' ? '★ Verified System' : 'Demonstration & Creative Practice'}
                </span>
                {item.availableForAcquisition && (
                  <span className="rounded border border-[#D9A62E]/50 bg-[#D9A62E]/15 text-[#D9A62E] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider">
                    Available for acquisition
                  </span>
                )}
                <span className="font-mono text-xs text-[#DFDACE]/60 uppercase tracking-wider">
                  {item.sector} • {item.year}
                </span>
                {item.liveUrl && (
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-[#D9A62E] hover:underline"
                  >
                    <span>Open live project</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-black uppercase leading-tight tracking-tight text-[#EDE9E0]">
                {item.title}
              </h1>
              <p className="mt-1 font-mono text-sm sm:text-base text-[#D9A62E]">
                {item.subtitle}
              </p>
            </div>

            {/* Navigation Tabs: Product Walkthrough vs Technical Architecture */}
            <div className="border-b border-[#DFDACE]/20 flex gap-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 font-mono text-xs font-bold uppercase tracking-widest transition-all relative ${
                  activeTab === 'overview' ? 'text-[#D9A62E]' : 'text-[#DFDACE]/60 hover:text-[#EDE9E0]'
                }`}
              >
                <span>Product Walkthrough</span>
                {activeTab === 'overview' && (
                  <motion.div
                    layoutId="proofViewerTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D9A62E]"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('how-its-built')}
                className={`pb-3 font-mono text-xs font-bold uppercase tracking-widest transition-all relative ${
                  activeTab === 'how-its-built' ? 'text-[#D9A62E]' : 'text-[#DFDACE]/60 hover:text-[#EDE9E0]'
                }`}
              >
                <span>Technical Architecture</span>
                {activeTab === 'how-its-built' && (
                  <motion.div
                    layoutId="proofViewerTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D9A62E]"
                  />
                )}
              </button>
            </div>

            {/* TAB 1: PRODUCT WALKTHROUGH */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* 1. Interface Bezel */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#D9A62E] font-bold flex items-center gap-1.5">
                      <Laptop className="h-4 w-4" />
                      <span>
                        {hasRealScreenshot && !demoMode
                          ? `Authentic System Interface (${brand.name})`
                          : `Capability Demonstration (${brand.name})`}
                      </span>
                    </span>

                    {/* Screenshot / Demo Toggle if both exist */}
                    {hasRealScreenshot && hasInteractiveDemo && (
                      <div className="flex items-center gap-1 bg-black/50 p-1 rounded border border-white/10 font-mono text-[10px]">
                        <button
                          onClick={() => setDemoMode(false)}
                          className={`px-2 py-0.5 rounded transition-colors ${
                            !demoMode ? 'bg-[#17504A] text-[#EDE9E0] font-bold' : 'text-[#DFDACE]/60 hover:text-white'
                          }`}
                        >
                          Production Screenshot
                        </button>
                        <button
                          onClick={() => setDemoMode(true)}
                          className={`px-2 py-0.5 rounded transition-colors ${
                            demoMode ? 'bg-[#D9A62E] text-black font-bold' : 'text-[#DFDACE]/60 hover:text-white'
                          }`}
                        >
                          Try Example
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Browser Chrome Container */}
                  <div className="rounded-xl border border-[#DFDACE]/25 bg-[#181B1C] overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 bg-[#121415] px-4 py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <div className="font-mono text-[11px] text-[#DFDACE]/70 bg-black/50 px-3 py-0.5 rounded border border-white/5 truncate max-w-xs sm:max-w-md">
                        {item.liveUrl || `https://${item.id}.contextmuse.internal/`}
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#D9A62E]">
                        {hasRealScreenshot && !demoMode ? 'System Media' : 'Interactive Preview'}
                      </span>
                    </div>

                    <div className="p-3 sm:p-5 bg-[#0A0C0D]">
                      {hasRealScreenshot && !demoMode ? (
                        <div className="relative rounded overflow-hidden border border-white/10">
                          <img
                            src={item.mediaUrl}
                            alt={`${item.title} interface preview`}
                            className="w-full h-auto object-cover max-h-[500px] block"
                            loading="eager"
                          />
                        </div>
                      ) : (
                        <div className="max-w-3xl mx-auto py-2">
                          {renderInteractiveDemo()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Plain-Language Statement */}
                <div className="bg-[#FAF8F5] text-[#1C2022] p-5 sm:p-6 rounded-xl border border-[#DFDACE] shadow-sm">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#17504A] block mb-1">
                    AT A GLANCE
                  </span>
                  <p className="font-sans text-base sm:text-lg font-medium leading-relaxed text-[#1C2022]">
                    {item.plainSentence}
                  </p>
                </div>

                {/* 3. Operational Problem, Solution, and Enablement */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="bg-[#1C2022] border border-red-900/30 p-5 rounded-xl space-y-2">
                    <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider block">
                      01 / The Operational Bottleneck
                    </span>
                    <p className="text-xs text-[#DFDACE]/90 font-sans leading-relaxed">
                      {item.overview?.needed || item.summary}
                    </p>
                  </div>

                  <div className="bg-[#1C2022] border border-[#D9A62E]/30 p-5 rounded-xl space-y-2">
                    <span className="font-mono text-xs font-bold text-[#D9A62E] uppercase tracking-wider block">
                      02 / The Engineered Solution
                    </span>
                    <p className="text-xs text-[#DFDACE]/90 font-sans leading-relaxed">
                      {item.overview?.built || item.subtitle}
                    </p>
                  </div>

                  <div className="bg-[#1C2022] border border-emerald-500/30 p-5 rounded-xl space-y-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      03 / Operational Shift Enabled
                    </span>
                    <p className="text-xs text-[#EDE9E0] font-sans leading-relaxed">
                      {item.overview?.enables || item.summary}
                    </p>
                  </div>
                </div>

                {/* 4. Tangible Output Display */}
                {item.tangibleOutput && (
                  <div className="border border-[#D9A62E]/30 bg-[#1A1E20] p-5 sm:p-6 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#D9A62E] font-bold flex items-center gap-1.5">
                        <FileCheck className="h-4 w-4" />
                        <span>Tangible Output: {item.tangibleOutput.title}</span>
                      </span>
                      <span className="font-mono text-[10px] text-[#DFDACE]/50">Concrete Artifact</span>
                    </div>

                    <p className="font-sans text-xs text-[#DFDACE]/90 leading-relaxed">
                      {item.tangibleOutput.description}
                    </p>

                    <div className="p-3.5 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-[#EDE9E0] leading-relaxed">
                      <span className="text-[#D9A62E] font-bold block text-[10px] uppercase mb-1">
                        Artifact Excerpt:
                      </span>
                      {item.tangibleOutput.previewText}
                    </div>
                  </div>
                )}

                {/* 5. Key Architectural Decisions */}
                {item.howItsBuilt?.keyDecisions && (
                  <div className="border border-[#DFDACE]/15 bg-[#171A1C] p-6 rounded-xl space-y-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#D9A62E] font-bold block">
                      Architectural Decisions & Rationale
                    </span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {item.howItsBuilt.keyDecisions.map((dec, idx) => (
                        <div key={idx} className="bg-black/30 p-4 rounded-lg border border-white/5 space-y-1">
                          <h4 className="font-mono text-xs font-bold text-[#EDE9E0]">
                            {dec.decision}
                          </h4>
                          <p className="font-sans text-xs text-[#DFDACE]/80 leading-relaxed">
                            {dec.rationale}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Strip */}
                <div className="pt-4 border-t border-[#DFDACE]/15 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={handleNeedSomethingLikeThis}
                    className="bg-[#D9A62E] text-[#141617] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#e0b240] transition-colors rounded-lg flex items-center gap-2 shadow-md"
                  >
                    <span>Tell me what you need</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSaveProject(item)}
                      className="border border-[#DFDACE]/30 text-[#EDE9E0] px-4 py-2 font-mono text-xs uppercase tracking-wider hover:border-[#D9A62E] transition-colors rounded-lg"
                    >
                      {saved ? '✓ Saved in My Ideas' : '+ Save this example'}
                    </button>

                    <button
                      onClick={handleSendToWhiteboard}
                      className="border border-[#DFDACE]/25 text-[#EDE9E0] px-4 py-2 font-mono text-xs uppercase tracking-wider hover:bg-[#17504A] transition-colors rounded-lg flex items-center gap-1.5"
                    >
                      <LayoutTemplate className="h-3.5 w-3.5" />
                      <span>Send to Whiteboard</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TECHNICAL ARCHITECTURE */}
            {activeTab === 'how-its-built' && (
              <div className="space-y-8">
                {/* Requirements & Constraints */}
                {item.howItsBuilt?.requirements && (
                  <div className="bg-[#1C2022] border border-[#DFDACE]/15 p-6 rounded-xl space-y-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#D9A62E] font-bold block">
                      Operational Requirements & Boundary Constraints
                    </span>
                    <ul className="space-y-2 font-sans text-xs sm:text-[13px] text-[#DFDACE]/90">
                      {item.howItsBuilt.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-[#D9A62E] font-mono text-xs font-bold mt-0.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* System Flow Diagram */}
                {item.howItsBuilt?.flowDiagram && (
                  <div className="bg-[#1E2325] border border-[#DFDACE]/20 p-6 rounded-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-[#D9A62E]" />
                      <span className="font-mono text-xs uppercase tracking-wider text-[#D9A62E] font-bold">
                        Interaction & Data Flow
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-1">
                      {item.howItsBuilt.flowDiagram.steps.map((st, idx) => (
                        <div key={idx} className="bg-[#141617] p-3.5 rounded-lg border border-white/5 space-y-1">
                          <div className="flex items-center justify-between font-mono text-[10px] text-[#D9A62E] font-bold">
                            <span>STEP 0{idx + 1}</span>
                            <span className="text-white/40">{st.from}</span>
                          </div>
                          <p className="font-sans text-xs text-[#EDE9E0]/90 leading-snug">
                            {st.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Limitations and External Reference */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-[#1C2022] border border-amber-900/30 p-5 rounded-xl space-y-2">
                    <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" />
                      <span>Explicit System Boundaries</span>
                    </span>
                    <p className="font-sans text-xs text-[#DFDACE]/80 leading-relaxed">
                      {item.howItsBuilt?.limitations || 'Configured for specialized client operations; extensions require scoping boundary rules.'}
                    </p>
                  </div>

                  <div className="bg-[#1C2022] border border-[#DFDACE]/15 p-5 rounded-xl space-y-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Production Deployment</span>
                    </span>
                    {item.liveUrl ? (
                      <div className="space-y-1">
                        <p className="font-sans text-xs text-[#DFDACE]/80">
                          Operates live in production. Direct verification link:
                        </p>
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-[#D9A62E] underline font-bold"
                        >
                          <span>{item.liveUrl.replace('https://', '')} ↗</span>
                        </a>
                      </div>
                    ) : (
                      <p className="font-sans text-xs text-[#DFDACE]/70">
                        Proprietary internal system or client-restricted workflow engine.
                      </p>
                    )}
                  </div>
                </div>

                {/* Grouped Technologies */}
                {item.howItsBuilt?.groupedTech && (
                  <div className="bg-[#181B1C] border border-[#DFDACE]/15 p-6 rounded-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-[#D9A62E]" />
                      <span className="font-mono text-xs uppercase tracking-wider text-[#D9A62E] font-bold">
                        Implementation Technology Stack
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {item.howItsBuilt.groupedTech.map((g, idx) => (
                        <div key={idx} className="bg-black/40 p-3.5 rounded-lg border border-white/5 space-y-1.5">
                          <span className="font-mono text-xs font-bold text-[#D9A62E] block">
                            {g.group}
                          </span>
                          <ul className="space-y-1 font-sans text-xs text-[#DFDACE]/80">
                            {g.items.map((it, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-[#D9A62E] font-mono">•</span>
                                <span>{it}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
