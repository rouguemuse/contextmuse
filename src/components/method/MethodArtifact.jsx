import React, { useState } from 'react';
import {
  PhoneCall,
  Calculator,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Gauge,
  LayoutDashboard,
  Building2,
  ClipboardCheck,
} from 'lucide-react';

export default function MethodArtifact({ stageKey, caseId }) {
  const [dumpsterSize, setDumpsterSize] = useState(20);
  const [selectedCity, setSelectedCity] = useState('plano');

  const specs = {
    15: { price: 385, tons: '2.0 Tons', loads: '~4.5 pickup loads', dims: "14'L × 7.5'W × 4.5'H" },
    20: { price: 425, tons: '2.5 Tons', loads: '~6 pickup loads', dims: "16'L × 7.5'W × 5.0'H" },
    25: { price: 475, tons: '3.0 Tons', loads: '~8 pickup loads', dims: "16'L × 7.5'W × 6.0'H" },
  };

  if (caseId === 'lone-wolf') {
    switch (stageKey) {
      case 'observe':
        return (
          <div className="bg-[#1C2022] border border-[#DFDACE]/20 rounded p-4 text-[#EDE9E0] space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-[#DFDACE]/15 pb-2">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-[#D9A62E]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E]">
                  Wolf Ridge Intake Friction Audit
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#DFDACE]/50">Observed Bottlenecks</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#23282A] border border-[#DFDACE]/10 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#DFDACE]/60">
                  <span>BOTTLENECK 01</span>
                  <span className="text-amber-400 font-bold">CONTAINER SIZING UNCERTAINTY</span>
                </div>
                <p className="text-[#EDE9E0]/90">
                  Customers needed to know whether a remodel or cleanout required a 15, 20, or 25-yard roll-off box, how many pickup truck loads each held, and how much weight was included.
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#23282A] border border-[#DFDACE]/10 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#DFDACE]/60">
                  <span>BOTTLENECK 02</span>
                  <span className="text-red-400 font-bold">ROLL-OFF VS. JUNK REMOVAL MIX-UPS</span>
                </div>
                <p className="text-[#EDE9E0]/90">
                  Self-load dumpster rentals and full-service junk removal crew requests were arriving in the same generic contact stream without service-specific details.
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#23282A] border border-[#DFDACE]/10 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#DFDACE]/60">
                  <span>BOTTLENECK 03</span>
                  <span className="text-amber-400 font-bold">MULTI-CITY COVERAGE CLARITY</span>
                </div>
                <p className="text-[#EDE9E0]/90">
                  Contractors and homeowners across 48 DFW municipalities needed immediate confirmation that their city and job site were in the active delivery corridor.
                </p>
              </div>
            </div>

            <div className="pt-1 text-[11px] font-mono text-[#DFDACE]/70 flex items-center justify-between">
              <span>Finding: Upfront sizing &amp; dual-track intake resolves phone tag.</span>
              <span className="text-[#D9A62E]">Root Cause Mapped ✓</span>
            </div>
          </div>
        );

      case 'extract': {
        const activeSpec = specs[dumpsterSize] || specs[20];
        return (
          <div className="bg-[#1C2022] border border-[#DFDACE]/20 rounded p-4 text-[#EDE9E0] space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-[#DFDACE]/15 pb-2">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-[#D9A62E]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E]">
                  Codified Wolf Ridge Container Matrix
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#DFDACE]/50">15 / 20 / 25-Yard Specs</span>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#DFDACE]/60 mb-1.5">
                Select Roll-Off Container Size:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 20, 25].map((s) => (
                  <button
                    key={s}
                    onClick={() => setDumpsterSize(s)}
                    className={`py-1.5 font-mono text-xs rounded border transition-colors ${
                      dumpsterSize === s
                        ? 'bg-[#D9A62E] text-[#1C2022] border-[#D9A62E] font-bold'
                        : 'bg-[#23282A] text-[#EDE9E0]/80 border-white/10'
                    }`}
                  >
                    {s}-Yard (${specs[s].price})
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded border border-emerald-500/30 bg-emerald-950/20 text-xs space-y-1.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#DFDACE]/70">Dimensions:</span>
                <span className="font-bold text-white">{activeSpec.dims}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#DFDACE]/70">Volume Equivalent:</span>
                <span className="font-bold text-[#D9A62E]">{activeSpec.loads}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#DFDACE]/70">Included Allowance:</span>
                <span className="font-bold text-emerald-400">{activeSpec.tons} Included ($75/ton overage)</span>
              </div>
            </div>
          </div>
        );
      }

      case 'evaluate': {
        const cityRules = {
          plano: { name: 'Plano, TX', corridor: 'Collin County Hub', page: '/plano-dumpster-rental.html' },
          frisco: { name: 'Frisco, TX', corridor: 'North Corridor Hub', page: '/frisco-dumpster-rental.html' },
          fortworth: { name: 'Fort Worth, TX', corridor: 'Tarrant County Hub', page: '/fort-worth-dumpster-rental.html' },
        };
        const currentRule = cityRules[selectedCity];

        return (
          <div className="bg-[#1C2022] border border-[#DFDACE]/20 rounded p-4 text-[#EDE9E0] space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-[#DFDACE]/15 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#D9A62E]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E]">
                  48-City DFW Municipal Landing Architecture
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#DFDACE]/50">48 DFW Municipalities</span>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                {Object.keys(cityRules).map((k) => (
                  <button
                    key={k}
                    onClick={() => setSelectedCity(k)}
                    className={`py-1.5 px-2 font-mono text-xs rounded text-center uppercase ${
                      selectedCity === k
                        ? 'bg-[#D9A62E] text-[#1C2022] font-bold'
                        : 'bg-[#23282A] text-[#EDE9E0]/80'
                    }`}
                  >
                    {cityRules[k].name.split(',')[0]}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-[#23282A] border border-[#DFDACE]/10 rounded space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#DFDACE]/60">Active Corridor:</span>
                  <span className="text-[#D9A62E] font-bold">{currentRule.corridor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#DFDACE]/60">Dedicated Route:</span>
                  <span className="text-emerald-400">{currentRule.page}</span>
                </div>
                <p className="text-[11px] font-sans text-[#EDE9E0]/80 pt-1 border-t border-[#DFDACE]/10">
                  Each of the 48 municipal pages pairs localized Schema.org LocalBusiness metadata with direct container sizing and dual-service intake.
                </p>
              </div>
            </div>
          </div>
        );
      }

      case 'transform':
      case 'evolve':
      default:
        return (
          <div className="bg-[#1C2022] border border-[#DFDACE]/20 rounded p-4 text-[#EDE9E0] space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-[#DFDACE]/15 pb-2">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-[#D9A62E]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E]">
                  Wolf Ridge Dual-Track Production Intake
                </span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 font-bold">LIVE PRODUCTION</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-[#23282A] border border-[#D9A62E]/30 rounded space-y-1">
                <span className="font-mono text-[10px] font-bold text-[#D9A62E] uppercase block">
                  Track 01 / Roll-Off Rental
                </span>
                <p className="text-[11px] text-[#DFDACE]/85">
                  Captures 15, 20, or 25-yard selection, project debris type, placement surface, and requested drop date.
                </p>
              </div>
              <div className="p-3 bg-[#23282A] border border-emerald-500/30 rounded space-y-1">
                <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase block">
                  Track 02 / Junk Removal Crew
                </span>
                <p className="text-[11px] text-[#DFDACE]/85">
                  Captures full-service load-out items, property access notes, and preferred crew arrival window.
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-[#141617] border border-[#DFDACE]/10 rounded font-mono text-[10px] text-[#DFDACE]/80">
              <span>Verified Deployment: 48 DFW city pages + transparent $385 / $425 / $475 sizing matrix.</span>
            </div>
          </div>
        );
    }
  }

  // INNCONTROL COILS EVIDENCE TRAIL
  return (
    <div className="bg-[#1C2022] border border-[#DFDACE]/20 rounded p-4 text-[#EDE9E0] space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-[#DFDACE]/15 pb-2">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4 text-[#D9A62E]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D9A62E]">
            INNcontrol Coils — Platform &amp; Operator Dashboards
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#DFDACE]/50">Hospitality HVAC &amp; Ops</span>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 text-xs">
        <div className="p-3 bg-[#23282A] rounded border border-[#DFDACE]/10 space-y-1">
          <span className="font-mono text-[10px] text-[#D9A62E] font-bold uppercase flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <span>Public Commercial Platform</span>
          </span>
          <p className="text-[11px] text-[#EDE9E0]/90 leading-relaxed">
            <strong>inncontrolcoils.com</strong> presents nationwide B2B PTAC coil refurbishing, deep chemical restoration, and multi-property consultation intake for volume hotel operators.
          </p>
        </div>

        <div className="p-3 bg-[#23282A] rounded border border-[#DFDACE]/10 space-y-1">
          <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
            <ClipboardCheck className="h-3 w-3" />
            <span>Internal Operator Dashboards</span>
          </span>
          <p className="text-[11px] text-[#EDE9E0]/90 leading-relaxed">
            Custom mobile daily check-in wizard and gamified operator readiness HUD built to log morning readiness, top 3 daily priorities, and evening after-action debriefs.
          </p>
        </div>
      </div>
    </div>
  );
}
