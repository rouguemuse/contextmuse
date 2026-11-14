import React, { useState, useEffect, useRef } from 'react';
import { useBrief } from '@/lib/BriefContext';
import { Lightbulb, Mail, X, ExternalLink, FolderSearch, CheckCircle2 } from 'lucide-react';

export default function SiteFooter() {
  const { totalCount, openBrief } = useBrief();
  const [acqOpen, setAcqOpen] = useState(false);
  const triggerBtnRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [consent, setConsent] = useState(() => {
    try {
      return window.localStorage.getItem('cm_analytics_consent') === 'granted' ? 'granted' : 'denied';
    } catch {
      return 'denied';
    }
  });

  useEffect(() => {
    const handleSync = (e) => {
      if (e?.detail?.consent) setConsent(e.detail.consent);
    };
    window.addEventListener('cm:consent-changed', handleSync);
    return () => window.removeEventListener('cm:consent-changed', handleSync);
  }, []);

  useEffect(() => {
    if (!acqOpen) return;
    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 20);
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setAcqOpen(false);
        triggerBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [acqOpen]);

  const handleCloseAcq = () => {
    setAcqOpen(false);
    triggerBtnRef.current?.focus();
  };

  const toggleConsent = () => {
    const next = consent === 'denied' ? 'granted' : 'denied';
    setConsent(next);
    if (window.CM_Analytics && typeof window.CM_Analytics.setConsent === 'function') {
      window.CM_Analytics.setConsent(next);
    } else {
      try {
        window.localStorage.setItem('cm_analytics_consent', next);
      } catch {}
    }
  };

  return (
    <>
      <footer className="flex shrink-0 flex-col gap-2 border-t border-[#DFDACE]/15 bg-[#1C2022] px-4 py-3 font-mono text-xs text-[#DFDACE]/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[#EDE9E0] font-bold">Context &amp; Muse</span>
          <span className="text-[#DFDACE]/35">•</span>
          <span>© 2026 Context &amp; Muse</span>
          <span className="text-[#DFDACE]/35 hidden sm:inline">•</span>
          <a
            href="mailto:jayme@contextmuse.com"
            className="inline-flex items-center gap-1 text-[#D9A62E] hover:underline"
          >
            <Mail className="h-3 w-3" />
            <span>jayme@contextmuse.com</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <a
            href="/privacy/"
            className="text-[11px] text-[#DFDACE]/50 hover:text-[#EDE9E0] transition-colors"
          >
            Privacy
          </a>
          <a
            href="/terms/"
            className="text-[11px] text-[#DFDACE]/50 hover:text-[#EDE9E0] transition-colors"
          >
            Terms
          </a>
          <button
            type="button"
            data-testid="analytics-consent-toggle"
            onClick={toggleConsent}
            title="Toggle optional privacy-safe analytics (never captures form text, contact details, or whiteboard content)"
            className="text-[11px] text-[#DFDACE]/50 hover:text-[#D9A62E] transition-colors"
          >
            Analytics: {consent === 'granted' ? 'On' : 'Off'}
          </button>
          <button
            ref={triggerBtnRef}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={acqOpen}
            onClick={() => setAcqOpen(true)}
            className="text-[11px] text-[#DFDACE]/50 hover:text-[#D9A62E] transition-colors"
          >
            Acquisition
          </button>

          <button
            type="button"
            onClick={openBrief}
            className="flex items-center gap-1.5 text-[#DFDACE] hover:text-[#D9A62E] transition-colors"
          >
            <Lightbulb className="h-3.5 w-3.5 text-[#D9A62E]" />
            <span>My Ideas ({totalCount})</span>
          </button>
        </div>
      </footer>

      {acqOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={handleCloseAcq}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="acquisition-modal-title"
            className="w-full max-w-2xl rounded-xl border border-[#DFDACE]/20 bg-[#1B1F21] text-[#EDE9E0] p-6 shadow-2xl space-y-5 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#DFDACE]/15 pb-4">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#D9A62E] block">
                  STUDIO SOFTWARE IP • AVAILABLE FOR ACQUISITION
                </span>
                <h2
                  id="acquisition-modal-title"
                  className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-[#EDE9E0]"
                >
                  Software Available for Acquisition
                </h2>
                <p className="mt-1 text-xs text-[#DFDACE]/75">
                  Standalone software products engineered in-house with full source code, zero cloud dependencies, and clean IP ownership.
                </p>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={handleCloseAcq}
                className="rounded p-1 text-[#DFDACE]/60 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close acquisition modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Verified Acquisition Listing: GenSort */}
            <div className="rounded-lg border border-[#D9A62E]/35 bg-[#141617] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FolderSearch className="h-5 w-5 text-[#D9A62E]" />
                  <div>
                    <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-[#EDE9E0]">
                      GenSort — Local-First Visual Asset Classification &amp; Curation Engine
                    </h3>
                    <span className="font-mono text-[11px] text-[#D9A62E]">
                      Working Browser &amp; Desktop (Electron) Application • React 19 + IndexedDB + Web Workers
                    </span>
                  </div>
                </div>
                <span className="rounded bg-[#D9A62E]/15 border border-[#D9A62E]/40 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[#D9A62E]">
                  Available for acquisition
                </span>
              </div>

              <p className="text-xs text-[#DFDACE]/85 leading-relaxed">
                A zero-cloud, local-first digital asset management and AI curation workbench. Parses binary PNG/EXIF/XMP generation parameters (Midjourney, ComfyUI, Stable Diffusion), computes 64-bit perceptual dHash duplicate clusters in background Web Workers, assigns 0–100 Readiness Scores, diffs prompts/seeds side-by-side, and exports clean JSON/CSV manifests.
              </p>

              <ul className="grid gap-2 sm:grid-cols-2 text-xs text-[#DFDACE]/80 font-mono">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Full 5-stage workflow verified</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>100% local-first privacy architecture</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Web + Electron desktop build targets</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Complete IP, source &amp; documentation</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <a
                  href="/cxm_gensort/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded bg-[#D9A62E] text-[#141617] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#e0b240] transition-colors"
                >
                  <span>Test Live Application</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <a
                  href="mailto:jayme@contextmuse.com?subject=GenSort%20Acquisition%20Inquiry"
                  className="inline-flex items-center gap-1.5 rounded border border-[#DFDACE]/25 px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Inquire: jayme@contextmuse.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
