import React, { useState, useMemo } from 'react';
import {
  Truck,
  ArrowRight,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  PhoneCall,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';

export default function FlagshipShowcase({ onOpenCaseStudy }) {
  const { isProjectSaved, toggleSaveProject } = useBrief();
  const saved = isProjectSaved('lone-wolf-dumpsters');

  // Transformation toggle: 'after' (software workflow) vs 'before' (manual bottleneck)
  const [workflowMode, setWorkflowMode] = useState('after');

  // Interactive sizing state
  const [size, setSize] = useState('20');
  const [material, setMaterial] = useState('household');
  const [city, setCity] = useState('Plano');
  const [placement, setPlacement] = useState('driveway');

  const containerSpecs = {
    '15': {
      label: '15-Yard Roll-Off',
      dims: "14'L × 7.5'W × 4.5'H",
      capacity: '~4.5 pickup truck loads',
      householdPrice: 385,
      heavyPrice: 445,
      tons: 2.0,
      idealFor: 'Small bathroom remodels, garage cleanouts, light yard debris',
    },
    '20': {
      label: '20-Yard Roll-Off',
      dims: "16'L × 7.5'W × 5.0'H",
      capacity: '~6 pickup truck loads',
      householdPrice: 425,
      heavyPrice: 495,
      tons: 2.5,
      idealFor: 'Full kitchen remodel, shingle tear-off, multi-room flooring removal',
    },
    '25': {
      label: '25-Yard Roll-Off',
      dims: "16'L × 7.5'W × 6.0'H",
      capacity: '~8 pickup truck loads',
      householdPrice: 475,
      heavyPrice: null, // Blocked for dense masonry/dirt due to truck payload limits
      tons: 3.0,
      idealFor: 'Major home additions, commercial tenant fit-out, estate clearout',
    },
  };

  const municipalRules = {
    Plano: { zone: 'Zone 1 (North Collin County)', permitRequiredForStreet: true, turnTime: 'Same-day or next-morning' },
    Frisco: { zone: 'Zone 1 (North Collin County)', permitRequiredForStreet: true, turnTime: 'Next-morning' },
    Dallas: { zone: 'Zone 2 (Dallas County Core)', permitRequiredForStreet: true, turnTime: 'Same-day available' },
    'Fort Worth': { zone: 'Zone 3 (Tarrant Corridor)', permitRequiredForStreet: true, turnTime: 'Next-morning' },
    McKinney: { zone: 'Zone 1 (North Collin County)', permitRequiredForStreet: false, turnTime: 'Same-day available' },
    Arlington: { zone: 'Zone 3 (Tarrant Corridor)', permitRequiredForStreet: true, turnTime: 'Same-day or next-morning' },
    Denton: { zone: 'Zone 4 (Northwest Corridor)', permitRequiredForStreet: false, turnTime: 'Next-morning' },
  };

  // Determine if current selection violates fleet payload limits
  const isOverweightHazard = material === 'heavy-concrete' && size === '25';

  const activeSpec = containerSpecs[size] || containerSpecs['20'];
  const activeMuni = municipalRules[city] || municipalRules['Plano'];

  const calculatedPrice = useMemo(() => {
    if (isOverweightHazard) return null;
    if (material === 'household') return activeSpec.householdPrice;
    if (material === 'shingles') return activeSpec.householdPrice + 50;
    if (material === 'heavy-concrete') return activeSpec.heavyPrice || 545;
    return activeSpec.householdPrice;
  }, [size, material, isOverweightHazard, activeSpec]);

  const activeTons = activeSpec.tons;

  const handleSave = () => {
    toggleSaveProject({
      id: 'lone-wolf-dumpsters',
      title: 'Wolf Ridge Dumpsters',
      subtitle: 'Local Logistics Platform & 48-Market Lead Engine',
      tier: 'featured',
    });
  };

  return (
    <section id="flagship-lone-wolf" className="space-y-8">
      {/* Header Strip */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#DFDACE]/15 pb-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs">
            <span className="rounded bg-[#D9A62E] text-[#141617] px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
              Flagship Showcase
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live Client Platform
            </span>
            <span className="text-[#DFDACE]/50">• Dallas–Fort Worth, TX</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#EDE9E0]">
            Wolf Ridge Dumpsters
          </h2>
          <p className="mt-1 font-mono text-sm sm:text-base text-[#D9A62E]">
            Regional Roll-Off Logistics, Dual-Service Intake &amp; 48-City Municipal Lead Engine
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenCaseStudy('lone-wolf-dumpsters')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded bg-[#D9A62E] text-[#141617] hover:bg-[#e0b240] transition-colors"
          >
            <span>Inspect Case Study</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <a
            href="https://lonewolf-dumpsters.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-wider rounded border border-[#DFDACE]/25 text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            onClick={handleSave}
            title={saved ? 'Saved in My Ideas' : 'Save to My Ideas'}
            className={`p-2 rounded border transition-colors ${
              saved
                ? 'border-[#D9A62E] bg-[#D9A62E]/20 text-[#D9A62E]'
                : 'border-[#DFDACE]/25 text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E]'
            }`}
          >
            {saved ? <BookmarkCheck className="h-4 w-4 text-[#D9A62E]" /> : <Bookmark className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Interface Presentation: Substantial Neutral Chrome Frame */}
      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-xs text-[#DFDACE]/60 px-1">
          <span className="font-bold text-[#D9A62E] uppercase tracking-wider">
            Production Interface (wolfridgedumpsters.com)
          </span>
          <span>Original Highway Amber Palette</span>
        </div>

        <div className="rounded-xl border border-[#DFDACE]/20 bg-[#161819] overflow-hidden shadow-2xl">
          {/* Chrome Top Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#101213] px-3 sm:px-4 py-2.5">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>

            <div className="flex items-center gap-1.5 min-w-0 bg-black/50 px-2.5 sm:px-3 py-0.5 rounded border border-white/5 text-[11px] font-mono text-[#DFDACE]/70 max-w-sm sm:max-w-md">
              <span className="text-emerald-400 shrink-0">🔒</span>
              <span className="truncate">https://wolfridgedumpsters.com/plano-dumpster-rental</span>
            </div>

            <span className="hidden sm:inline font-mono text-[9px] text-[#D9A62E] uppercase tracking-wider shrink-0">
              High-Res Capture
            </span>
          </div>

          {/* Interface Image (crops baked-in outer frame & browser bar so only the dark Wolf Ridge viewport fills the chrome) */}
          <div className="relative bg-[#0A0C0D] overflow-hidden aspect-[4/3]">
            <img
              src="/assets/images/lonewolf-screenshot.webp"
              alt="Wolf Ridge Dumpsters Production Interface"
              className="w-[106.2%] max-w-none -ml-[3.1%] -mt-[5.15%] -mb-[2.4%] h-full object-cover object-top block"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* The Operational Transformation: Before vs After */}
      <div className="border border-[#DFDACE]/15 bg-[#171A1B] rounded-xl p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DFDACE]/10 pb-3">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#D9A62E] block">
              WORKFLOW TRANSFORMATION
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-[#EDE9E0]">
              From Manual Phone Bottleneck to Deterministic Intake
            </h3>
          </div>

          {/* Toggle */}
          <div className="inline-flex rounded border border-[#DFDACE]/20 p-0.5 bg-[#101213] font-mono text-xs">
            <button
              onClick={() => setWorkflowMode('before')}
              className={`px-3 py-1 rounded transition-colors ${
                workflowMode === 'before'
                  ? 'bg-red-950/80 text-red-200 font-bold border border-red-800/60'
                  : 'text-[#DFDACE]/60 hover:text-white'
              }`}
            >
              Before: Manual Bottleneck
            </button>
            <button
              onClick={() => setWorkflowMode('after')}
              className={`px-3 py-1 rounded transition-colors ${
                workflowMode === 'after'
                  ? 'bg-[#17504A] text-emerald-200 font-bold border border-emerald-600/60'
                  : 'text-[#DFDACE]/60 hover:text-white'
              }`}
            >
              After: Software Intake
            </button>
          </div>
        </div>

        {/* Content */}
        {workflowMode === 'before' ? (
          <div className="grid gap-3 sm:grid-cols-3 font-sans text-xs">
            <div className="p-3.5 rounded bg-red-950/20 border border-red-900/30 space-y-1">
              <span className="font-mono text-[11px] font-bold text-red-400 uppercase flex items-center gap-1.5">
                <PhoneCall className="h-3.5 w-3.5" />
                <span>Recurring Sizing Calls</span>
              </span>
              <p className="text-[#DFDACE]/80 leading-relaxed">
                Dispatchers spent hours daily re-explaining cubic yardage on calls: "Will a 15-yard hold a roof tear-off?" Customers had no way to self-serve sizing.
              </p>
            </div>

            <div className="p-3.5 rounded bg-red-950/20 border border-red-900/30 space-y-1">
              <span className="font-mono text-[11px] font-bold text-red-400 uppercase flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Overweight Disputes</span>
              </span>
              <p className="text-[#DFDACE]/80 leading-relaxed">
                Customers loaded 25-yard boxes with dense masonry or dirt. Surprise landfill overweight fees led to invoice disputes and delayed collections.
              </p>
            </div>

            <div className="p-3.5 rounded bg-red-950/20 border border-red-900/30 space-y-1">
              <span className="font-mono text-[11px] font-bold text-red-400 uppercase flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                <span>Unverified Drop Details</span>
              </span>
              <p className="text-[#DFDACE]/80 leading-relaxed">
                Phone notes scribbled on paper lacked gate codes, street permit confirmations, and placement directives (e.g. driveway protection boards).
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3 font-sans text-xs">
            <div className="p-3.5 rounded bg-[#17504A]/20 border border-emerald-500/25 space-y-1">
              <span className="font-mono text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>90-Second Self-Sizing</span>
              </span>
              <p className="text-[#DFDACE]/80 leading-relaxed">
                Customers match debris density to container volume with transparent visual guidance, choosing the correct size before contacting dispatch.
              </p>
            </div>

            <div className="p-3.5 rounded bg-[#17504A]/20 border border-emerald-500/25 space-y-1">
              <span className="font-mono text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Vehicle Weight Safeguards</span>
              </span>
              <p className="text-[#DFDACE]/80 leading-relaxed">
                Selecting dense concrete automatically restricts container volume to safe legal payload limits and states included tonnage upfront.
              </p>
            </div>

            <div className="p-3.5 rounded bg-[#17504A]/20 border border-emerald-500/25 space-y-1">
              <span className="font-mono text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Structured Intake Manifests</span>
              </span>
              <p className="text-[#DFDACE]/80 leading-relaxed">
                Orders produce structured payloads specifying drop placement, surface rules, and corridor routes ready for driver queue delivery.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* The Single Flagship Interactive Demonstration */}
      <div className="border border-[#F59E0B]/30 bg-[#121415] rounded-xl p-5 sm:p-7 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-[#F59E0B]" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#F59E0B] font-bold">
                Consequential Sizing & Intake Engine
              </span>
            </div>
            <p className="text-xs text-[#DFDACE]/70 font-sans mt-0.5">
              Adjust operational inputs to observe real calculated rules and sample manifest generation.
            </p>
          </div>
          <span className="font-mono text-[10px] text-[#DFDACE]/50">
            Deterministic logic demonstration
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Input 1: Container Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline font-mono text-xs">
                <label className="font-bold text-[#EDE9E0] uppercase">1. Container Volume:</label>
                <span className="text-[#DFDACE]/60">{activeSpec.dims}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['15', '20', '25'].map((s) => {
                  const isSelected = size === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`p-2.5 rounded border text-left font-mono transition-all ${
                        isSelected
                          ? 'border-[#F59E0B] bg-[#F59E0B]/15 text-[#EDE9E0]'
                          : 'border-white/10 bg-black/40 text-[#DFDACE]/70 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold block">{s} Yards</span>
                      <span className="text-[10px] text-[#DFDACE]/50">{containerSpecs[s].tons} Tons incl.</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input 2: Material Density */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline font-mono text-xs">
                <label className="font-bold text-[#EDE9E0] uppercase">2. Material Density:</label>
                <span className="text-[#DFDACE]/60">Fleet Payload Limits</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'household', label: 'Household', sub: 'Furniture, Drywall' },
                  { id: 'shingles', label: 'Shingles', sub: 'Medium Density' },
                  { id: 'heavy-concrete', label: 'Concrete / Dirt', sub: 'Max Density' },
                ].map((m) => {
                  const isSelected = material === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMaterial(m.id)}
                      className={`p-2.5 rounded border text-left font-mono transition-all ${
                        isSelected
                          ? 'border-[#F59E0B] bg-[#F59E0B]/15 text-[#EDE9E0]'
                          : 'border-white/10 bg-black/40 text-[#DFDACE]/70 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold block">{m.label}</span>
                      <span className="text-[10px] text-[#DFDACE]/50 block truncate">{m.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs 3 & 4: City & Placement */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block font-mono text-xs font-bold text-[#EDE9E0] uppercase">
                  3. DFW Municipal Hub:
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 px-2.5 py-1.5 text-xs rounded text-[#F59E0B] font-mono font-bold focus:outline-none"
                >
                  {Object.keys(municipalRules).map((c) => (
                    <option key={c} value={c}>{c}, TX ({municipalRules[c].zone})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-xs font-bold text-[#EDE9E0] uppercase">
                  4. Placement Surface:
                </label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 px-2.5 py-1.5 text-xs rounded text-[#EDE9E0] font-mono font-bold focus:outline-none"
                >
                  <option value="driveway">Private Driveway (Boards Required)</option>
                  <option value="street">Public Street (Permit Required)</option>
                </select>
              </div>
            </div>

            {/* Regulatory Rule Callout */}
            <div className="p-3 rounded bg-black/40 border border-white/10 font-mono text-[11px] text-[#DFDACE]/80 space-y-1">
              <span className="text-[#F59E0B] font-bold uppercase block">
                Business & Payload Rule Applied:
              </span>
              <p>
                Dense masonry/dirt (~4,000 lbs/cu yd) exceeds single-unit truck payload capacities in 25-yd boxes. Haulers restrict dense masonry to 15 or 20-yard containers to protect road safety and roll-off hoist cables.
              </p>
            </div>
          </div>

          {/* Output: Sample Structured Order Manifest (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-black/70 border border-white/10 rounded-lg p-4 font-mono">
            <div>
              <div className="flex items-center justify-between border-b border-white/15 pb-2 mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  SAMPLE ORDER PAYLOAD
                </span>
                <span className="text-[10px] text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded border border-[#F59E0B]/30">
                  SCHEMA DEMO
                </span>
              </div>

              {isOverweightHazard ? (
                <div className="p-3 rounded bg-red-950/80 border border-red-500/80 text-red-200 text-xs space-y-1.5 my-1">
                  <div className="flex items-center gap-1.5 font-bold uppercase text-red-400">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>Payload Limit Exceeded</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    A 25-yard container full of concrete would exceed 24,000 lbs, surpassing truck hoist ratings. System automatically restricts heavy masonry to 20-Yard or 15-Yard boxes.
                  </p>
                  <button
                    onClick={() => setSize('20')}
                    className="mt-1 text-[10px] font-bold uppercase underline text-white hover:text-[#F59E0B]"
                  >
                    Switch to 20-Yard Approved Box →
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-xs text-[#DFDACE]/90">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#DFDACE]/50">Corridor Hub:</span>
                    <span className="font-bold text-white">{city}, TX</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#DFDACE]/50">Container Size:</span>
                    <span className="font-bold text-[#F59E0B]">{activeSpec.label}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#DFDACE]/50">Material Density:</span>
                    <span className="font-bold text-white capitalize">{material.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#DFDACE]/50">Included Allowance:</span>
                    <span className="font-bold text-emerald-400">{activeTons} Tons Included</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#DFDACE]/50">Placement Directive:</span>
                    <span className="font-bold text-white">
                      {placement === 'driveway' ? 'Driveway Boards on Site' : 'Street (Permit Flagged)'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#DFDACE]/50">Turnaround Expectation:</span>
                    <span className="font-bold text-white">{activeMuni.turnTime}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Summary */}
            <div className="border-t border-white/10 pt-3 flex items-baseline justify-between mt-3">
              <div>
                <span className="text-[10px] text-[#DFDACE]/50 uppercase block">Configured Base Rate</span>
                <span className="text-[9.5px] text-[#DFDACE]/60">$75/ton overage rate applies thereafter</span>
              </div>
              <div className="text-right">
                {isOverweightHazard ? (
                  <span className="text-sm font-bold text-red-400">Order Blocked</span>
                ) : (
                  <span className="text-2xl font-black text-[#F59E0B] tracking-tight">
                    ${calculatedPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
