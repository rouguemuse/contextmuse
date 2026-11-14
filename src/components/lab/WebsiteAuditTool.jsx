import React, { useState } from 'react';
import {
  Search,
  AlertTriangle,
  Zap,
  Layers,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';

const AUDIT_PRESETS = [
  {
    name: 'Commercial Hospitality PTAC Service',
    url: 'https://sample-hospitality-ptac.com',
    businessType: 'Hospitality PTAC Refurbishment & Field Operations',
    goal: 'Clarify refurbishment vs. replacement value and capture multi-property service inquiries',
    summary:
      'Strong operational service offering for hotel ownership groups, but multi-property intake relies on a generic contact form without capturing unit counts or property locations upfront.',
    mostImportant: {
      category: 'Intake & Systems',
      severity: 'High Priority',
      issue: 'Service requests rely on unstructured email inquiries rather than a structured property & unit-count intake.',
      impact:
        'Hotel general managers and regional engineers must exchange extra follow-up emails just to share PTAC unit volume and scheduling windows.',
      recommendation:
        'Deploy a structured multi-property hospitality intake path that captures property count, approximate PTAC volume, and service timeline upfront.',
    },
    systemOpportunities: [
      {
        category: 'Intake & Systems',
        severity: 'System Opportunity',
        issue: 'No separation between multi-property portfolio inquiries and single-site maintenance questions.',
        impact: 'Regional hospitality group inquiries sit in the same generic inbox as general vendor questions.',
        recommendation:
          'Implement an intake routing path that flags multi-property hospitality requests for immediate scheduling.',
      },
      {
        category: 'Conversion Paths',
        severity: 'System Opportunity',
        issue: 'Refurbishment vs. full unit replacement comparison requires reading dense paragraphs.',
        impact: 'Busy general managers scanning on mobile can miss the core airflow, odor, and lifespan benefits.',
        recommendation:
          'Present a clear side-by-side comparison of PTAC coil restoration versus premature unit replacement.',
      },
    ],
    quickWins: [
      {
        category: 'Message Clarity',
        severity: 'Quick Win',
        issue: 'Hero headline leads with generic commercial service phrasing instead of hotel PTAC restoration.',
        impact: 'First-time hospitality visitors need an extra scroll to confirm you specialize in packaged terminal units.',
        recommendation:
          'State hospitality PTAC coil restoration and nationwide service coverage directly in the primary headline.',
      },
      {
        category: 'Trust & Proof',
        severity: 'Quick Win',
        issue: 'Process steps for deep coil cleaning and restoration are buried below the fold.',
        impact: 'Facility directors want to see what happens on-site before requesting a walkthrough.',
        recommendation:
          'Surface a concise 3-step restoration overview directly beneath the primary call to action.',
      },
    ],
    worthVerifying: [
      {
        category: 'Conversion Paths',
        severity: 'Worth Verifying',
        issue: 'Direct phone contact is not prominently paired with the scheduling form on mobile viewports.',
        impact: 'Chief engineers walking properties often prefer a direct call trigger.',
        recommendation: 'Wrap telephone spans in standard tel: protocol links next to the primary intake CTA.',
      },
    ],
  },
  {
    name: 'Regional Waste Logistics & Rentals',
    url: 'https://sample-dfw-dumpsters.com',
    businessType: 'Waste Logistics & Equipment Rental',
    goal: 'Eliminate phone tag sizing calls and capture qualified container bookings online',
    summary:
      'Strong local presence across DFW, but territory pricing and debris weight rules are hidden until checkout, causing customer hesitation and avoidable sizing calls.',
    mostImportant: {
      category: 'Conversion Paths',
      severity: 'High Priority',
      issue: 'Customers cannot easily match their project debris type to a container size and weight allowance online.',
      impact:
        'Prospective customers call in with repetitive sizing questions regarding shingles, concrete, and household debris before booking.',
      recommendation:
        'Implement an interactive 3-step dumpster sizing and weight threshold guide (15 / 20 / 25-yard) before address checkout.',
    },
    systemOpportunities: [
      {
        category: 'Intake & Systems',
        severity: 'System Opportunity',
        issue: 'No automated delivery radius verification before order submission.',
        impact: 'Inquiries from outside the primary service territory require manual follow-up.',
        recommendation:
          'Pair municipal service-area pages with clear ZIP-code coverage and dual-service intake (Roll-Off vs. Junk Removal).',
      },
    ],
    quickWins: [
      {
        category: 'Message Clarity',
        severity: 'Quick Win',
        issue: 'Transparent flat-rate pricing is not stated above the fold.',
        impact: 'Homeowners and contractors assume hidden drop-off fees and bounce to competitors.',
        recommendation:
          'Display flat-rate container prices ($385 / $425 / $475) with explicit weight allowances (2.0 / 2.5 / 3.0 tons) upfront.',
      },
    ],
    worthVerifying: [
      {
        category: 'Trust & Proof',
        severity: 'Worth Verifying',
        issue: 'No visual drop-off clearance guide for driveway placement.',
        impact: 'Drivers encounter low tree branches and tight gates during delivery.',
        recommendation: 'Add a 3-point driveway placement checklist on the confirmation screen.',
      },
    ],
  },
];

export default function WebsiteAuditTool() {
  const { saveAuditFinding, isFindingSaved, openBrief } = useBrief();

  const [url, setUrl] = useState('');
  const [businessType, setBusinessType] = useState('Commercial Equipment & Services');
  const [goal, setGoal] = useState('Increase qualified inquiries and streamline intake');
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState(null);

  const steps = [
    'Resolving DNS & DOM Structure…',
    'Analyzing Headline Clarity & Value Proposition…',
    'Tracing Conversion Funnels & Button Endpoints…',
    'Evaluating Proof Depth & Trust Artifacts…',
    'Synthesizing 4-Pillar Diagnostic Ledger…',
  ];

  const handleRunAudit = (e) => {
    e?.preventDefault();
    if (!url.trim()) return;

    setRunning(true);
    setResults(null);
    setCurrentStep(0);

    // Progressive step simulation
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          finishScan();
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  const finishScan = () => {
    setRunning(false);
    // Build diagnostic result model
    const cleanDomain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    setResults({
      targetUrl: url.startsWith('http') ? url : `https://${url}`,
      domain: cleanDomain,
      scannedAt: new Date().toLocaleDateString(),
      summary: `First-pass diagnostic for ${cleanDomain}: Core services are described, but the primary conversion step lacks structural qualification, forcing potential high-value clients into slow manual email loops.`,
      mostImportant: {
        category: 'Conversion Paths',
        severity: 'High Priority',
        issue: `Primary CTA on ${cleanDomain} routes to an open-ended generic contact form without intake qualification.`,
        impact:
          'High-value clients cannot specify project parameters or get immediate ballpark expectations, while sales reps waste time filtering unqualified leads.',
        recommendation:
          'Replace static text inputs with an interactive scope & requirement selector that triages intent before submission.',
      },
      systemOpportunities: [
        {
          category: 'Intake & Systems',
          severity: 'System Opportunity',
          issue: 'No automated workflow connects lead capture to dispatch or scheduling.',
          impact: 'Average response time exceeds 6 hours during peak business hours.',
          recommendation:
            'Implement instant CRM/dispatch webhook routing with automated confirmation dossier sent to customer.',
        },
        {
          category: 'Message Clarity',
          severity: 'System Opportunity',
          issue: 'Value proposition focuses on company history rather than the customer’s tangible operational relief.',
          impact: 'Visitors leave within 8 seconds without understanding what differentiates your delivery speed.',
          recommendation:
            'Frame the top headline around the specific friction eliminated: speed, accuracy, or cost predictability.',
        },
      ],
      quickWins: [
        {
          category: 'Trust & Proof',
          severity: 'Quick Win',
          issue: 'No quantifiable outcomes or metrics displayed alongside client testimonials.',
          impact: 'Claims read as marketing boilerplate rather than verified engineering evidence.',
          recommendation:
            'Add 3 concise metric callouts (e.g. turnaround hours, defect rates, project turnaround).',
        },
        {
          category: 'Conversion Paths',
          severity: 'Quick Win',
          issue: 'Secondary navigation links compete with the primary business objective.',
          impact: 'Dilutes click-through focus on the main inquiry pipeline.',
          recommendation:
            'Subdue utility links and visually anchor the primary action button.',
        },
      ],
      worthVerifying: [
        {
          category: 'Intake & Systems',
          severity: 'Worth Verifying',
          issue: 'Mobile form fields lack native input masks for phone numbers and zip codes.',
          impact: 'Elevated form abandonment on mobile devices.',
          recommendation: 'Enable type="tel" and inputmode="numeric" attributes.',
        },
      ],
    });
  };

  const loadPreset = (preset) => {
    setUrl(preset.url);
    setBusinessType(preset.businessType);
    setGoal(preset.goal);
    setResults({
      targetUrl: preset.url,
      domain: preset.url.replace(/^https?:\/\//, ''),
      scannedAt: new Date().toLocaleDateString(),
      summary: preset.summary,
      mostImportant: preset.mostImportant,
      systemOpportunities: preset.systemOpportunities,
      quickWins: preset.quickWins,
      worthVerifying: preset.worthVerifying,
    });
  };

  return (
    <div className="border border-[#23282A]/25 bg-[#23282A] text-[#EDE9E0] rounded shadow-xl overflow-hidden">
      {/* Section Header */}
      <div className="border-b border-[#DFDACE]/15 bg-[#1F2325] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#D9A62E] font-bold uppercase tracking-wider">
              01 / HERO SYSTEM
            </span>
            <span className="rounded bg-[#17504A] px-2 py-0.5 font-mono text-[10px] text-[#EDE9E0] uppercase font-bold">
              Production Diagnostic
            </span>
          </div>
          <h3 className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-[#EDE9E0]">
            Website + System Check
          </h3>
        </div>
        <div className="text-right">
          <span className="font-mono text-[11px] text-[#DFDACE]/60 block">4 Evaluation Pillars</span>
          <span className="font-mono text-[10px] text-[#D9A62E]">Message • Paths • Proof • Intake</span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-xs sm:text-[13px] text-[#DFDACE]/80 leading-relaxed font-sans max-w-3xl">
          Most business websites don’t have traffic problems — they have <strong>clarity and intake problems</strong>. Enter any business URL to identify where potential clients encounter friction, drop out of the quoting funnel, or get stuck in phone tag.
        </p>

        {/* Quick Test Presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-[#DFDACE]/50 uppercase tracking-wider">
            Quick Examples:
          </span>
          {AUDIT_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(p)}
              className="rounded border border-[#DFDACE]/20 bg-[#181B1C] px-2.5 py-1 font-mono text-[11px] text-[#DFDACE]/80 hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
            >
              ⚡ {p.name}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleRunAudit} className="mt-5 grid gap-3 sm:grid-cols-12 bg-[#1C2022] p-4 rounded border border-[#DFDACE]/15">
          <div className="sm:col-span-6">
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#DFDACE]/70 mb-1">
              Website URL to Inspect *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. acme-hvac-coils.com"
                className="w-full bg-[#141617] border border-[#DFDACE]/25 px-3 py-2 text-xs font-mono text-[#EDE9E0] rounded focus:border-[#D9A62E] focus:outline-none"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#DFDACE]/70 mb-1">
              Business Model
            </label>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="e.g. Industrial Fabrication"
              className="w-full bg-[#141617] border border-[#DFDACE]/25 px-3 py-2 text-xs font-mono text-[#EDE9E0] rounded focus:border-[#D9A62E] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={running || !url.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#D9A62E] py-2 px-4 font-mono text-xs font-bold uppercase tracking-wider text-[#23282A] hover:bg-[#c49425] disabled:opacity-40 transition-colors rounded"
            >
              {running ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>Scanning…</span>
                </>
              ) : (
                <>
                  <Search className="h-3.5 w-3.5" />
                  <span>Run System Check</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Scanning Step Animation */}
        {running && (
          <div className="mt-6 border border-[#17504A] bg-[#17504A]/20 p-5 rounded space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#D9A62E]">
              <span>DIAGNOSTIC PIPELINE IN PROGRESS</span>
              <span>Step {currentStep + 1} of {steps.length}</span>
            </div>
            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D9A62E] transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <p className="font-mono text-xs text-[#EDE9E0] animate-pulse">
              → {steps[currentStep]}
            </p>
          </div>
        )}

        {/* Scanned Findings Results */}
        {results && !running && (
          <div className="mt-8 space-y-6 animate-in fade-in-50 duration-300">
            {/* Meta & Executive Summary */}
            <div className="border border-[#DFDACE]/20 bg-[#1A1D1E] p-5 rounded space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DFDACE]/10 pb-2">
                <span className="font-mono text-xs font-bold text-[#D9A62E]">
                  Target: {results.targetUrl}
                </span>
                <span className="font-mono text-[10px] text-[#DFDACE]/50">
                  Scanned: {results.scannedAt}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#DFDACE]/90 font-sans leading-relaxed italic">
                “{results.summary}”
              </p>
            </div>

            {/* Pillar 1: Most Important Finding */}
            {results.mostImportant && (
              <div className="border border-red-500/40 bg-red-950/20 p-5 rounded space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-red-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                      Critical Bottleneck
                    </span>
                    <span className="font-mono text-xs text-[#DFDACE]/60">
                      Pillar: {results.mostImportant.category}
                    </span>
                  </div>
                  <FindingSaveButton finding={results.mostImportant} />
                </div>
                <h4 className="font-display text-base font-bold text-red-200">
                  {results.mostImportant.issue}
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-red-500/20 text-xs">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[#DFDACE]/60 block mb-0.5">
                      Operational Consequence:
                    </span>
                    <p className="text-[#DFDACE]/90 font-sans leading-relaxed">
                      {results.mostImportant.impact}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[#D9A62E] block mb-0.5 font-bold">
                      Recommended Engineering Fix:
                    </span>
                    <p className="text-[#EDE9E0] font-sans font-medium leading-relaxed">
                      {results.mostImportant.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pillar 2: System Opportunities */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#D9A62E] font-bold flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" />
                <span>System & Intake Architecture Opportunities</span>
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {results.systemOpportunities.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-[#DFDACE]/15 bg-[#1C2022] p-4 rounded flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded bg-[#17504A] px-2 py-0.5 font-mono text-[9px] text-[#EDE9E0] uppercase font-bold">
                          {item.category}
                        </span>
                        <FindingSaveButton finding={item} />
                      </div>
                      <h5 className="mt-2 font-display text-xs sm:text-sm font-bold text-[#EDE9E0]">
                        {item.issue}
                      </h5>
                      <p className="mt-2 text-xs text-[#DFDACE]/75 leading-relaxed font-sans">
                        {item.impact}
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-[#DFDACE]/10">
                      <span className="font-mono text-[9.5px] uppercase text-[#D9A62E] font-bold block mb-0.5">
                        System Fix:
                      </span>
                      <p className="text-[11.5px] text-[#EDE9E0] font-medium leading-relaxed font-sans">
                        {item.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pillar 3 & 4: Quick Wins & Hypotheses */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Quick Wins */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#DFDACE]/80 font-bold flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-[#D9A62E]" />
                  <span>Immediate Messaging & Clarity Wins</span>
                </h4>
                {results.quickWins.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-[#DFDACE]/15 bg-[#1C2022] p-3.5 rounded text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-[#D9A62E] uppercase font-bold">
                        {item.category}
                      </span>
                      <FindingSaveButton finding={item} />
                    </div>
                    <p className="font-bold text-[#EDE9E0]">{item.issue}</p>
                    <p className="text-[11.5px] text-[#DFDACE]/70 font-sans">{item.recommendation}</p>
                  </div>
                ))}
              </div>

              {/* Worth Verifying */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#DFDACE]/80 font-bold flex items-center gap-2">
                  <HelpCircle className="h-3.5 w-3.5 text-[#2B7C72]" />
                  <span>Worth Verifying / Mobile Hypotheses</span>
                </h4>
                {results.worthVerifying.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-[#DFDACE]/15 bg-[#1C2022] p-3.5 rounded text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-[#2B7C72] uppercase font-bold">
                        {item.category}
                      </span>
                      <FindingSaveButton finding={item} />
                    </div>
                    <p className="font-bold text-[#EDE9E0]">{item.issue}</p>
                    <p className="text-[11.5px] text-[#DFDACE]/70 font-sans">{item.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#DFDACE]/15 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs text-[#DFDACE]/60">
                Click any bookmark button above to save findings into My Ideas.
              </span>
              <button
                onClick={openBrief}
                className="bg-[#D9A62E] text-[#23282A] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#c49425] transition-colors rounded flex items-center gap-1.5"
              >
                <span>View My Ideas</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FindingSaveButton({ finding }) {
  const { saveAuditFinding, isFindingSaved, removeAuditFinding } = useBrief();
  const saved = isFindingSaved(finding.issue);

  return (
    <button
      onClick={() => {
        if (saved) {
          removeAuditFinding(finding.id);
        } else {
          saveAuditFinding(finding);
        }
      }}
      className={`flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] uppercase rounded border transition-colors ${
        saved
          ? 'border-[#D9A62E] bg-[#D9A62E] text-[#23282A] font-bold'
          : 'border-[#DFDACE]/25 text-[#DFDACE]/70 hover:border-[#D9A62E] hover:text-[#D9A62E]'
      }`}
      title={saved ? 'Remove from My Ideas' : 'Save finding to My Ideas'}
    >
      {saved ? (
        <>
          <BookmarkCheck className="h-3 w-3" />
          <span>Saved</span>
        </>
      ) : (
        <>
          <Bookmark className="h-3 w-3" />
          <span>Save to My Ideas</span>
        </>
      )}
    </button>
  );
}
