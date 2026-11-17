import React, { useState, useMemo } from 'react';
import {
  Truck,
  ArrowRight,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useBrief } from '@/lib/BriefContext';
import EditorialEvidenceFrame from '@/components/work/EditorialEvidenceFrame';

export default function FlagshipShowcase({ onOpenCaseStudy }) {
  const { isProjectSaved, toggleSaveProject } = useBrief();
  const saved = isProjectSaved('lone-wolf-dumpsters');

  // Interactive sizing state
  const [size, setSize] = useState('20');
  const [material, setMaterial] = useState('household');
  const [city, setCity] = useState('Plano');
  const [placement, setPlacement] = useState('driveway');
  const [showEngine, setShowEngine] = useState(false);

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
  }, [material, isOverweightHazard, activeSpec]);

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
    <section
      id="flagship-lone-wolf"
      aria-labelledby="work-client-systems-heading"
      className="space-y-8"
    >
      {/* Section 01 Header: Commercial Client Systems */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DFDACE]/15 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#D9A62E] font-bold">
            <span className="inline-block h-2 w-2 bg-[#D9A62E]" />
            <span>01 / Commercial Client Systems</span>
          </div>
          <h2
            id="work-client-systems-heading"
            className="mt-1.5 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#EDE9E0]"
          >
            Production Client Platforms &amp; Dispatch Engines
          </h2>
        </div>

        <span className="font-mono text-xs text-[#DFDACE]/65">
          Custom Quoting, Territory SEO &amp; Operator Tooling
        </span>
      </div>

      {/* Unified Architectural Frame: Wolf Ridge Dumpsters */}
      <article className="bg-[#1B1F21] border border-[#DFDACE]/20 border-t-[3px] border-t-[#D9A62E] p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Card Header Strip */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-[#DFDACE]/15 pb-6">
          <div className="min-w-0 space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
              <span className="bg-[#D9A62E] text-[#141617] px-2.5 py-0.5 font-bold">
                Flagship Client System
              </span>
              <span className="border border-[#DFDACE]/20 bg-[#141719] text-[#EDE9E0] px-2.5 py-0.5">
                Live Production Platform
              </span>
              <span className="text-[#DFDACE]/60">Dallas–Fort Worth, TX (48 Cities)</span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#EDE9E0] leading-none">
              Wolf Ridge Dumpsters
            </h3>
            <p className="font-mono text-xs sm:text-sm text-[#D9A62E]">
              Regional Roll-Off Logistics, Dual-Service Intake &amp; 48-City Municipal Lead Engine
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#DFDACE]/80 leading-relaxed pt-0.5">
              Gives homeowners and contractors transparent 15, 20, and 25-yard container sizing, flat-rate pricing, and dual-track dispatch intake across 48 DFW municipal landing pages.
            </p>
          </div>

          {/* Primary Actions (Consistent 0px Editorial Controls) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 font-mono text-xs">
            <button
              type="button"
              onClick={() => onOpenCaseStudy('lone-wolf-dumpsters')}
              className="inline-flex items-center gap-2 bg-[#D9A62E] text-[#141617] px-4 py-2.5 font-bold uppercase tracking-wider hover:bg-[#EDE9E0] transition-colors"
            >
              <span>Inspect Case Study</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <a
              href="/work/lone-wolf-dumpsters/"
              className="inline-flex items-center gap-1.5 border border-[#DFDACE]/25 bg-[#141719] text-[#EDE9E0] px-3.5 py-2.5 font-bold uppercase tracking-wider hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
            >
              <span>Case Study Page</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <a
              href="/services/quote-lead-systems/"
              className="inline-flex items-center gap-1.5 border border-[#17504A] bg-[#17504A]/35 text-[#EDE9E0] px-3.5 py-2.5 font-bold uppercase tracking-wider hover:bg-[#17504A] transition-colors"
            >
              <span>Quote + Lead Systems</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#D9A62E]" />
            </a>

            <a
              href="https://lonewolf-dumpsters.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[#DFDACE]/25 bg-[#141719] text-[#EDE9E0] px-3.5 py-2.5 font-bold uppercase tracking-wider hover:border-[#D9A62E] hover:text-[#D9A62E] transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={handleSave}
              title={saved ? 'Saved in My Ideas' : 'Save to My Ideas'}
              aria-label={saved ? 'Saved in My Ideas' : 'Save to My Ideas'}
              className={`p-2.5 border transition-colors ${
                saved
                  ? 'border-[#D9A62E] bg-[#D9A62E]/20 text-[#D9A62E]'
                  : 'border-[#DFDACE]/25 bg-[#141719] text-[#EDE9E0] hover:border-[#D9A62E] hover:text-[#D9A62E]'
              }`}
            >
              {saved ? (
                <BookmarkCheck className="h-4 w-4 text-[#D9A62E]" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* 12-Column Architectural Spread: Editorial Evidence Frame (7 Cols) + System Specification (5 Cols) */}
        <div className="grid gap-6 lg:grid-cols-12 items-stretch min-w-0">
          {/* Left 7 Columns: Composed Editorial Evidence Frame + Metric Ledger */}
          <div className="lg:col-span-7 min-w-0 flex flex-col justify-between gap-4">
            <EditorialEvidenceFrame
              src="/assets/captures/wolfridge-live.jpg"
              alt="Wolf Ridge Dumpsters Production Interface"
              title="Wolf Ridge Dumpsters"
              variant="lead"
              accentColor="#D9A62E"
              loading="eager"
              fetchPriority="high"
              liveUrl="https://lonewolf-dumpsters.vercel.app/"
            />

            {/* 3-Column Architectural Ledger */}
            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="bg-[#141719] border border-[#DFDACE]/15 p-3">
                <span className="text-lg sm:text-xl font-black text-[#D9A62E] block leading-none">
                  48
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#DFDACE]/75 block mt-1">
                  DFW Municipal Pages
                </span>
              </div>
              <div className="bg-[#141719] border border-[#DFDACE]/15 p-3">
                <span className="text-lg sm:text-xl font-black text-[#D9A62E] block leading-none">
                  15 / 20 / 25
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#DFDACE]/75 block mt-1">
                  Yard Tonnage Matrix
                </span>
              </div>
              <div className="bg-[#141719] border border-[#DFDACE]/15 p-3">
                <span className="text-lg sm:text-xl font-black text-[#D9A62E] block leading-none">
                  Dual-Track
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#DFDACE]/75 block mt-1">
                  Roll-Off &amp; Crew Intake
                </span>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Unified System Architecture & Dispatch Dossier */}
          <div className="lg:col-span-5 min-w-0 flex flex-col justify-between bg-[#141719] border border-[#DFDACE]/15 p-5 sm:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#DFDACE]/12 pb-2.5">
                <span className="font-mono text-xs font-bold text-[#D9A62E] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>System Architecture &amp; Dispatch Logic</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#DFDACE]/55">
                  Primary Story
                </span>
              </div>

              <p className="font-sans text-xs sm:text-[13.5px] text-[#EDE9E0]/90 leading-relaxed">
                Dispatchers were fielding repetitive phone calls explaining cubic yardage, truck-load equivalents, and heavy masonry weight limits before an order could be scheduled. We replaced manual phone quoting with upfront container sizing cards, payload weight safeguards, and a 48-city municipal routing architecture.
              </p>

              {/* Compact 3-Part Architectural Ledger */}
              <div className="divide-y divide-[#DFDACE]/10 border-t border-b border-[#DFDACE]/12 font-sans text-xs">
                <div className="py-2.5 flex items-start gap-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-[#D9A62E] shrink-0 pt-0.5">01</span>
                  <div>
                    <strong className="font-mono text-[11px] uppercase tracking-wider text-[#EDE9E0] block">
                      Upfront Container &amp; Tonnage Matrix
                    </strong>
                    <span className="text-[#DFDACE]/75 text-xs">
                      15, 20, and 25-yard specs with truck-load equivalents and heavy-debris hoist safeguards.
                    </span>
                  </div>
                </div>
                <div className="py-2.5 flex items-start gap-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-[#D9A62E] shrink-0 pt-0.5">02</span>
                  <div>
                    <strong className="font-mono text-[11px] uppercase tracking-wider text-[#EDE9E0] block">
                      Dual-Track Service Triage
                    </strong>
                    <span className="text-[#DFDACE]/75 text-xs">
                      Separates self-load roll-off rentals from full-service crew junk removal at intake.
                    </span>
                  </div>
                </div>
                <div className="py-2.5 flex items-start gap-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-[#D9A62E] shrink-0 pt-0.5">03</span>
                  <div>
                    <strong className="font-mono text-[11px] uppercase tracking-wider text-[#EDE9E0] block">
                      Structured Dispatch Drop Manifest
                    </strong>
                    <span className="text-[#DFDACE]/75 text-xs">
                      Delivers container size, base rate, city zone, and driveway board rules straight to dispatch.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#101214] border border-[#17504A] px-3.5 py-2.5 font-mono text-[11px] text-[#EDE9E0] flex flex-wrap items-center justify-between gap-2">
              <span className="text-[#D9A62E] font-bold uppercase">Sample Manifest:</span>
              <span>Order #WR-4812 · Plano, TX · 20-Yd ($425 / 2.5T)</span>
            </div>
          </div>
        </div>

        {/* Interactive Demonstration: Progressive Disclosure Consequential Sizing & Intake Engine */}
        <div className="border-t border-[#DFDACE]/15 pt-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141719] border border-[#DFDACE]/20 p-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-[#D9A62E]" />
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#D9A62E] font-bold">
                  Interactive Proof · Consequential Sizing &amp; Intake Engine
                </span>
                <span className="font-mono text-[10.5px] bg-[#101214] border border-[#DFDACE]/15 px-2 py-0.5 text-[#EDE9E0]">
                  {activeSpec.label} · {city}, TX · {isOverweightHazard ? 'Payload Guard Active' : `$${calculatedPrice}`}
                </span>
              </div>
              <p className="text-xs text-[#DFDACE]/75 font-sans">
                Test how container volume, material density, and DFW municipal rules calculate live pricing and trigger overweight hoist safeguards.
              </p>
            </div>

            <button
              type="button"
              data-testid="toggle-sizing-engine"
              aria-expanded={showEngine}
              onClick={() => setShowEngine((prev) => !prev)}
              className="shrink-0 inline-flex items-center justify-center gap-2 border border-[#D9A62E] bg-[#23282A] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E] hover:bg-[#D9A62E] hover:text-[#141617] transition-colors"
            >
              <span>{showEngine ? 'Hide Live Sizing Engine' : 'Try Live Sizing Engine'}</span>
              <ArrowRight className={`h-3.5 w-3.5 transition-transform ${showEngine ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {showEngine && (
          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            {/* Controls (7 Cols) */}
            <div className="lg:col-span-7 bg-[#141719] border border-[#DFDACE]/15 p-4 sm:p-5 space-y-4">
              {/* Input 1: Container Size */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline font-mono text-xs">
                  <label className="font-bold text-[#EDE9E0] uppercase">1. Container Volume:</label>
                  <span className="text-[#DFDACE]/65">{activeSpec.dims}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['15', '20', '25'].map((s) => {
                    const isSelected = size === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`p-2.5 border text-left font-mono transition-colors ${
                          isSelected
                            ? 'border-[#D9A62E] bg-[#D9A62E]/15 text-[#EDE9E0]'
                            : 'border-[#DFDACE]/15 bg-[#101214] text-[#DFDACE]/70 hover:border-[#DFDACE]/35 hover:text-[#EDE9E0]'
                        }`}
                      >
                        <span className="text-xs font-bold block">{s} Yards</span>
                        <span className="text-[10px] text-[#DFDACE]/55">{containerSpecs[s].tons} Tons incl.</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input 2: Material Density */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline font-mono text-xs">
                  <label className="font-bold text-[#EDE9E0] uppercase">2. Material Density:</label>
                  <span className="text-[#DFDACE]/65">Fleet Payload Limits</span>
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
                        type="button"
                        onClick={() => setMaterial(m.id)}
                        className={`p-2.5 border text-left font-mono transition-colors ${
                          isSelected
                            ? 'border-[#D9A62E] bg-[#D9A62E]/15 text-[#EDE9E0]'
                            : 'border-[#DFDACE]/15 bg-[#101214] text-[#DFDACE]/70 hover:border-[#DFDACE]/35 hover:text-[#EDE9E0]'
                        }`}
                      >
                        <span className="text-xs font-bold block">{m.label}</span>
                        <span className="text-[10px] text-[#DFDACE]/55 block truncate">{m.sub}</span>
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
                    aria-label="DFW Municipal Hub"
                    className="w-full bg-[#101214] border border-[#DFDACE]/20 px-2.5 py-2 text-xs text-[#D9A62E] font-mono font-bold focus:border-[#D9A62E] focus:outline-none"
                  >
                    {Object.keys(municipalRules).map((c) => (
                      <option key={c} value={c}>
                        {c}, TX ({municipalRules[c].zone})
                      </option>
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
                    aria-label="Placement Surface"
                    className="w-full bg-[#101214] border border-[#DFDACE]/20 px-2.5 py-2 text-xs text-[#EDE9E0] font-mono font-bold focus:border-[#D9A62E] focus:outline-none"
                  >
                    <option value="driveway">Private Driveway (Boards Required)</option>
                    <option value="street">Public Street (Permit Required)</option>
                  </select>
                </div>
              </div>

              {/* Regulatory Rule Callout */}
              <div className="p-3 bg-[#101214] border border-[#DFDACE]/15 font-mono text-[11px] text-[#DFDACE]/80 space-y-1">
                <span className="text-[#D9A62E] font-bold uppercase block">
                  Business &amp; Payload Rule Applied:
                </span>
                <p>
                  Dense masonry/dirt (~4,000 lbs/cu yd) exceeds single-unit truck payload capacities in 25-yd boxes. Haulers restrict dense masonry to 15 or 20-yard containers to protect road safety and roll-off hoist cables.
                </p>
              </div>
            </div>

            {/* Output: Sample Structured Order Manifest (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#121517] border border-[#DFDACE]/20 p-4 sm:p-5 font-mono">
              <div>
                <div className="flex items-center justify-between border-b border-[#DFDACE]/15 pb-2.5 mb-3">
                  <span className="text-xs font-bold text-[#EDE9E0] uppercase tracking-wider">
                    SAMPLE ORDER PAYLOAD
                  </span>
                  <span className="text-[10px] text-[#D9A62E] bg-[#D9A62E]/10 px-2 py-0.5 border border-[#D9A62E]/30">
                    DISPATCH SCHEMA
                  </span>
                </div>

                {isOverweightHazard ? (
                  <div className="p-3.5 bg-[#2A1617] border border-red-500/70 text-[#EDE9E0] text-xs space-y-2 my-1">
                    <div className="flex items-center gap-1.5 font-bold uppercase text-red-300">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>Payload Limit Exceeded</span>
                    </div>
                    <p className="text-[11px] text-[#DFDACE]/90 leading-relaxed">
                      A 25-yard container full of concrete exceeds 24,000 lbs, surpassing truck hoist ratings. System automatically restricts heavy masonry to 20-Yard or 15-Yard boxes.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSize('20')}
                      className="mt-1 text-[10.5px] font-bold uppercase underline text-[#D9A62E] hover:text-[#EDE9E0]"
                    >
                      Switch to 20-Yard Approved Box →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs text-[#DFDACE]/90">
                    <div className="flex justify-between py-1 border-b border-[#DFDACE]/10">
                      <span className="text-[#DFDACE]/60">Corridor Hub:</span>
                      <span className="font-bold text-[#EDE9E0]">{city}, TX</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#DFDACE]/10">
                      <span className="text-[#DFDACE]/60">Container Size:</span>
                      <span className="font-bold text-[#D9A62E]">{activeSpec.label}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#DFDACE]/10">
                      <span className="text-[#DFDACE]/60">Material Density:</span>
                      <span className="font-bold text-[#EDE9E0] capitalize">
                        {material.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#DFDACE]/10">
                      <span className="text-[#DFDACE]/60">Included Allowance:</span>
                      <span className="font-bold text-[#EDE9E0]">{activeTons} Tons Included</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#DFDACE]/10">
                      <span className="text-[#DFDACE]/60">Placement Directive:</span>
                      <span className="font-bold text-[#EDE9E0]">
                        {placement === 'driveway'
                          ? 'Driveway Boards on Site'
                          : 'Street (Permit Flagged)'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#DFDACE]/10">
                      <span className="text-[#DFDACE]/60">Turnaround Expectation:</span>
                      <span className="font-bold text-[#EDE9E0]">{activeMuni.turnTime}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Summary */}
              <div className="border-t border-[#DFDACE]/15 pt-3.5 flex items-baseline justify-between mt-4">
                <div>
                  <span className="text-[10px] text-[#DFDACE]/60 uppercase block">
                    Configured Base Rate
                  </span>
                  <span className="text-[10px] text-[#DFDACE]/50">
                    $75/ton overage rate applies thereafter
                  </span>
                </div>
                <div className="text-right">
                  {isOverweightHazard ? (
                    <span className="text-sm font-bold text-red-300 uppercase">Order Blocked</span>
                  ) : (
                    <span className="text-2xl font-black text-[#D9A62E] tracking-tight">
                      ${calculatedPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </article>
    </section>
  );
}
