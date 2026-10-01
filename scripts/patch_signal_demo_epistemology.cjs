const fs = require('fs');

const file = 'signal/demo/index.html';
let c = fs.readFileSync(file, 'utf8');

// 1. Dataset Labeling in Demo
c = c.replace(
  '<span>Load Anonymized Operational Sample (90-Day Telemetry)</span>',
  '<span>Load Synthetic Demonstration Dataset (90-Day Telemetry)</span>'
);
c = c.replace(
  'Period: 90-Day Operational Window &bull; Demonstration Data (Values Anonymized)',
  'Period: 90-Day Operational Window &bull; Synthetic Demonstration Dataset'
);
c = c.replace(
  '<div style="font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--accent-gold);">Demonstration Dataset &bull; Anonymized</div>',
  '<div style="font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--accent-gold);">Synthetic Demonstration Dataset</div>'
);
c = c.replace(
  'Demonstration data — values and identifiers have been anonymized.',
  'Synthetic Demonstration Dataset — values and records generated to simulate restaurant POS telemetry.'
);
c = c.replace(
  'disclaimer: "Demonstration data — values and identifiers have been anonymized."',
  'disclaimer: "Synthetic Demonstration Dataset — simulated operational telemetry for demonstration."'
);
c = c.replace(
  '**Classification:** Demonstration Data — Values Anonymized',
  '**Classification:** Synthetic Demonstration Dataset'
);
c = c.replace(
  '**Notice:** Demonstration data — values and identifiers have been anonymized.',
  '**Notice:** Synthetic Demonstration Dataset — simulated operational telemetry for demonstration.'
);

// 2. CSS for Epistemic Layers
const epistemicCSS = `
        /* 4-Layer Epistemic Framework */
        .epistemic-stack {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin: 1.5rem 0;
        }
        .epistemic-layer {
            background: #FAF9F5;
            border: 1px solid var(--border-light);
            border-left: 3px solid #64748b;
            border-radius: 0 4px 4px 0;
            padding: 1rem 1.25rem;
        }
        .epistemic-layer.observed-layer {
            border-left-color: var(--accent-teal);
            background: rgba(15, 118, 110, 0.03);
        }
        .epistemic-layer.inferred-layer {
            border-left-color: var(--accent-gold);
            background: rgba(197, 160, 89, 0.04);
        }
        .epistemic-layer.verify-layer {
            border-left-color: #2563eb;
            background: rgba(37, 99, 235, 0.03);
        }
        .epistemic-layer.action-layer {
            border-left-color: #059669;
            background: rgba(5, 150, 105, 0.04);
        }
        .layer-header {
            display: flex;
            align-items: baseline;
            gap: 8px;
            margin-bottom: 0.35rem;
            flex-wrap: wrap;
        }
        .layer-title {
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }
        .observed-layer .layer-title { color: var(--accent-teal); }
        .inferred-layer .layer-title { color: var(--accent-gold); }
        .verify-layer .layer-title { color: #2563eb; }
        .action-layer .layer-title { color: #059669; }
        .layer-subtitle {
            font-size: 11px;
            color: var(--text-secondary);
            font-family: var(--font-sans);
        }
        .layer-body {
            font-size: 13.5px;
            line-height: 1.6;
            color: var(--text-primary);
            margin: 0;
        }

        /* Priority & Friction Matrix */
        .priority-logic-box {
            background: #FAF9F5;
            border: 1px solid var(--border-light);
            border-radius: 4px;
            padding: 1.25rem;
            margin-top: 1.5rem;
        }
        .logic-grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 1rem 1.5rem;
        }
        @media (max-width: 768px) {
            .logic-grid { grid-template-columns: 1fr; }
        }
        .logic-field {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        .logic-field.full {
            grid-column: 1 / -1;
            border-top: 1px solid var(--border-light);
            padding-top: 0.75rem;
            margin-top: 0.25rem;
        }
        .logic-label {
            font-family: var(--font-mono);
            font-size: 10.5px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--text-secondary);
            font-weight: 600;
        }
        .logic-value {
            font-size: 13px;
            color: var(--text-primary);
            line-height: 1.45;
        }
        .friction-pill {
            display: inline-block;
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 3px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            background: rgba(15, 118, 110, 0.1);
            color: var(--accent-teal);
        }
`;

if (!c.includes('.epistemic-stack')) {
  c = c.replace('/* Finding Card (8-Point Framework) */', epistemicCSS + '\n        /* Finding Card (8-Point Framework) */');
}

// 3. Section 3: Replace Causal Map with Cross-Signal Hypothesis Map
const oldCausalMap = `<!-- 3. Causal Intelligence Graph -->
                <div class="causal-map">
                    <span class="causal-eyebrow">Critical Intelligence &bull; Forensic Causal Chain</span>
                    <h3 style="font-family: var(--font-serif); font-size: 1.6rem; margin: 0 0 0.5rem 0; color: #FAF9F5;">Structural Root Cause to Downstream Leakage</h3>
                    <p style="font-size: 13.5px; color: rgba(250, 249, 245, 0.7); margin: 0 0 1.5rem 0;">
                        Isolated metrics obscure systemic dependencies. The diagram below illustrates how staffing fatigue directly produces revenue leakage.
                    </p>

                    <div class="causal-flow">
                        <div class="causal-node root">
                            <div class="node-tag" style="color: var(--accent-gold);">Root Cause</div>
                            <div class="node-title">Overtime Staffing Drag</div>
                            <p class="node-desc">Kitchen line logged 318.5 overtime hours ($6,846 penalty). Primary stations are absorbing 55+ hour workweeks.</p>
                        </div>
                        <div class="causal-arrow">&rarr;</div>
                        <div class="causal-node">
                            <div class="node-tag" style="color: var(--accent-teal);">Catalyst</div>
                            <div class="node-title">6:00 PM Throughput Spike</div>
                            <p class="node-desc">Orders surge 112% between 4PM (820) and 6PM (1,740). Fatigued staff saturates; ticket times collapse.</p>
                        </div>
                        <div class="causal-arrow">&rarr;</div>
                        <div class="causal-node terminal">
                            <div class="node-tag" style="color: #E11D48;">Terminal Effect</div>
                            <div class="node-title">Full-Ticket Voids ($27 Avg)</div>
                            <p class="node-desc">Staff is not voiding $4 sides; they are voiding entire checks as emergency service recovery for walkouts.</p>
                        </div>
                    </div>
                    <div style="font-family: var(--font-mono); font-size: 11.5px; color: var(--accent-gold); border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 1rem;">
                        Combined Chain Exposure: $32,000–$58,000 Annualized &bull; Note: Fixing root prep staffing mitigates 70%+ of downstream void comps.
                    </div>
                </div>`;

const newCausalMap = `<!-- 3. Cross-Signal Hypothesis Map -->
                <div class="causal-map">
                    <span class="causal-eyebrow">Critical Intelligence &bull; Cross-Signal Hypothesis Map</span>
                    <h3 style="font-family: var(--font-serif); font-size: 1.6rem; margin: 0 0 0.5rem 0; color: #FAF9F5;">Cross-Signal Correlation Under Investigation</h3>
                    <p style="font-size: 13.5px; color: rgba(250, 249, 245, 0.7); margin: 0 0 1.5rem 0;">
                        Isolated metrics obscure systemic patterns. The diagram below maps observed signals that correlate strongly in the data, establishing an operational hypothesis for floor validation rather than assuming causality.
                    </p>

                    <div class="causal-flow">
                        <div class="causal-node root">
                            <div class="node-tag" style="color: var(--accent-teal);">Observed Signal (Payroll)</div>
                            <div class="node-title">Overtime Staffing Concentration</div>
                            <p class="node-desc">Kitchen line logged 318.5 overtime hours ($6,846 penalty). Primary line stations are absorbing 55+ hour workweeks.</p>
                        </div>
                        <div class="causal-arrow">&rarr;</div>
                        <div class="causal-node">
                            <div class="node-tag" style="color: var(--accent-gold);">Observed Signal (Volume)</div>
                            <div class="node-title">6:00 PM Throughput Spike</div>
                            <p class="node-desc">Order volume surges 112% between 4PM (820) and 6PM (1,740). Station capacity saturates during the same operating window.</p>
                        </div>
                        <div class="causal-arrow">&rarr;</div>
                        <div class="causal-node terminal">
                            <div class="node-tag" style="color: #E11D48;">Observed Signal (Comps &amp; Voids)</div>
                            <div class="node-title">Full-Ticket Void Clustered ($27 Avg)</div>
                            <p class="node-desc">Full-check voids ($27.20 avg) cluster heavily between 6–8 PM on peak days, consistent with potential service recovery.</p>
                        </div>
                    </div>
                    <div style="font-family: var(--font-mono); font-size: 11.5px; color: var(--accent-gold); border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 1rem;">
                        Correlation Exposure: $32,000–$58,000 Annualized &bull; Note: The records establish co-occurrence, not verified causality. Operator must perform floor ticket audit before restructuring stations.
                    </div>
                </div>`;

c = c.replace(oldCausalMap, newCausalMap);

// 4. Update JavaScript State Assessment text
const oldStateAssess = "document.getElementById('state-assessment-text').innerHTML = \n                `This operation generated <strong>$${formatNum(data.netSales)}</strong> across ${data.periodDays} days at a <strong>$${data.avgCheck.toFixed(2)}</strong> average check. Labor ran at ${data.laborPercent.toFixed(1)}%. ` +\n                `However, forensic synthesis reveals an active causal chain originating from the <strong>6:00 PM kitchen throughput bottleneck</strong>: ` +\n                `exhaustion in overtime-dependent kitchen roles (${data.kdsOTHours.toFixed(0)} OT hours) converts prep deficits into 45+ minute line delays, forcing front-of-house managers into compensatory <strong>$${data.avgVoidValue.toFixed(2)} full-ticket walkout voids</strong>.`;";

const newStateAssess = `document.getElementById('state-assessment-text').innerHTML = 
                \`This operation generated <strong>$\${formatNum(data.netSales)}</strong> across \${data.periodDays} days at a <strong>$\${data.avgCheck.toFixed(2)}</strong> average check. Labor ran at \${data.laborPercent.toFixed(1)}%. \` +
                \`Signal separates observed record evidence from operational inferences. While records establish that <strong>$\${formatNum(data.voidAmount)} in voids</strong> concentrate during peak hours alongside <strong>\${data.kdsOTHours.toFixed(0)} overtime hours</strong> in kitchen roles, the data does not prove causality on its own. It surfaces an urgent operational hypothesis: peak line congestion is generating service recovery voids, requiring targeted floor verification before adjusting staffing or throttling tickets.\`;`;

if (c.includes('reveals an active causal chain originating')) {
  c = c.replace(
    /document\.getElementById\('state-assessment-text'\)\.innerHTML\s*=\s*[\s\S]*?full-ticket walkout voids<\/strong>\.`;/,
    newStateAssess
  );
}

// 5. Replace allFindings data definition with 4-Layer Epistemic Model
const oldFindingsStart = "const allFindings = [";
const oldFindingsEnd = "const visibleFindings = tier === 1 ? allFindings.slice(0, 3) : (tier === 2 ? allFindings.slice(0, 6) : allFindings);";

const newFindingsBlock = `const allFindings = [
                {
                    id: "F_OVERTIME",
                    rank: 1,
                    category: "Peak-period margin leakage",
                    title: "Overtime Staffing & Void Clustering Intersection",
                    priority: "Investigate First",
                    confidenceLevel: "Moderate confidence",
                    observed: \`Friday/Saturday 6–8 PM contains 42% of weekly full-check void value ($\${data.avgVoidValue.toFixed(2)} average void) while representing 27% of check volume. Overtime also concentrates in kitchen roles during the same operating window (\${data.kdsOTHours.toFixed(0)} OT hours, $\${formatNum(data.kdsOTPay)} premium pay out of $\${formatNum(data.kdsTotalPay)} total pay).\`,
                    inferred: \`The intersection is consistent with a peak-period throughput problem. The available records do not establish that kitchen delay caused the voids, but the co-occurrence suggests primary line fatigue degrades order velocity.\`,
                    verify: \`Compare void timestamps against KDS ticket duration and void-reason detail for four peak services. Station GM at the pass between 6:00–7:00 PM on Friday to record fire-to-window times.\`,
                    actionCandidate: \`Institute dynamic 3P delivery throttling during peak volume (5:45–7:00 PM) and test an intermediate morning prep shift to absorb prep hours currently burned at overtime rates.\`,
                    monthlyRange: \`$\${formatNum(Math.round((annKdsOT + annVoids) / 12 * 0.85))}–$\${formatNum(Math.round((annKdsOT + annVoids) / 12 * 1.2))}\`,
                    annualRange: \`$\${formatNum(Math.round((annKdsOT + annVoids) * 0.85))}–$\${formatNum(Math.round((annKdsOT + annVoids) * 1.2))}\`,
                    periodImpact: \`$\${formatNum(data.kdsOTPay + data.voidAmount)} (\${data.periodDays} days)\`,
                    friction: "Low to moderate",
                    decisionPriority: "Investigate first",
                    decisionRationale: "High potential financial exposure, evidence available quickly, and validation requires little operational disruption."
                },
                {
                    id: "F_VOIDS",
                    rank: 2,
                    category: "Comp & void severity profile",
                    title: "Full-Ticket Emergency Service Recovery Voids",
                    priority: "Investigate First",
                    confidenceLevel: "High confidence (Record detail)",
                    observed: \`Total voids reached $\${formatNum(data.voidAmount)} across \${data.voidCount} orders. The average void ticket is $\${data.avgVoidValue.toFixed(2)}, which is \${Math.round((data.avgVoidValue / data.avgCheck) * 100)}% of the full average check size ($\${data.avgCheck.toFixed(2)}), rather than minor $4 side or beverage mistakes.\`,
                    inferred: \`Staff is not voiding mistaken drinks; they are comping entire meals. This pattern is consistent with service recovery for walkouts or extreme ticket delays rather than standard cashier corrections.\`,
                    verify: \`Pull manager void authorization log for the 20 highest-value checks; cross-reference table seat times, server initials, and guest comp notes.\`,
                    actionCandidate: \`Institute a required manager comp policy with designated threshold reasons and configure automated alert when any check over $20 is voided.\`,
                    monthlyRange: \`$\${formatNum(Math.round(annVoids / 12 * 0.85))}–$\${formatNum(Math.round(annVoids / 12 * 1.2))}\`,
                    annualRange: \`$\${formatNum(Math.round(annVoids * 0.85))}–$\${formatNum(Math.round(annVoids * 1.2))}\`,
                    periodImpact: \`$\${formatNum(data.voidAmount)} (\${data.periodDays} days)\`,
                    friction: "Low",
                    decisionPriority: "Investigate first",
                    decisionRationale: "Direct cash margin loss with complete POS audit trail; zero capital cost to verify and address."
                },
                {
                    id: "F_DISCOUNTS",
                    rank: 3,
                    category: "Promotional margin drag",
                    title: "Percentage Discount Drag ('Spend $50, Save 10%')",
                    priority: "Execute Test",
                    confidenceLevel: "High confidence (POS summary)",
                    observed: \`Discounts totaled $\${formatNum(data.totalDiscounts)}. The percentage promotion 'Spend $50, save 10%' generated $\${formatNum(data.spend50save10Amount)} in deductions, scaling linearly with check size ($100 check loses $10; $150 check loses $15).\`,
                    inferred: \`High-spending guests do not require a $15 discount to convert. The promotion is cannibalizing clean margin on premium tables without lifting ordering frequency.\`,
                    verify: \`Execute a 7-day promotional blackout test: temporarily disable the 10% threshold discount and measure check volume and average spend above $50.\`,
                    actionCandidate: \`Convert the percentage discount to a flat savings structure ('Spend $50, save $5') or redirect discount budget to off-peak lunch loyalty credits.\`,
                    monthlyRange: \`$\${formatNum(Math.round(annDiscounts / 12 * 0.9))}–$\${formatNum(Math.round(annDiscounts / 12 * 1.15))}\`,
                    annualRange: \`$\${formatNum(Math.round(annDiscounts * 0.85))}–$\${formatNum(Math.round(annDiscounts * 1.2))}\`,
                    periodImpact: \`$\${formatNum(data.totalDiscounts)} (\${data.periodDays} days)\`,
                    friction: "Very low",
                    decisionPriority: "Execute test immediately",
                    decisionRationale: "Immediate margin recapture; test requires only a single POS promotion rule toggle."
                },
                {
                    id: "F_THROUGHPUT",
                    rank: 4,
                    category: "Station capacity constraint",
                    title: "6:00 PM Kitchen Throughput Saturation Ceiling",
                    priority: "Validate Next",
                    confidenceLevel: "Moderate confidence",
                    observed: \`Order volume surges 112% between 4:00 PM (\${formatNum(data.peak4PMOrders)} orders) and 6:00 PM (\${formatNum(data.peak6PMOrders)} orders). Hourly order volume peaks at 1,740 items in this window, exceeding early-week daily volumes.\`,
                    inferred: \`Kitchen throughput is physically constrained by primary cook surface capacity and assembly staging. Without station pacing, order spikes create compounding ticket-time delays.\`,
                    verify: \`Time 10 consecutive food tickets at the expeditor station from 6:00 PM to 6:30 PM on two consecutive Fridays to establish true pass-latency.\`,
                    actionCandidate: \`Enforce strict 4:00 PM prep completion cutoffs and configure automated 3P delivery pacing when line backlog exceeds 18 open tickets.\`,
                    monthlyRange: "$1,800–$3,200",
                    annualRange: "$21,600–$38,400",
                    periodImpact: "Throughput ceiling (Caps potential dinner volume)",
                    friction: "Moderate",
                    decisionPriority: "Validate next",
                    decisionRationale: "High potential top-line unlock, but requires live observation to avoid disrupting kitchen rhythm."
                },
                {
                    id: "F_LUNCH",
                    rank: 5,
                    category: "Daypart check size contraction",
                    title: "Lunch Check Contraction & Beverage Attach Deficit",
                    priority: "Plan Next Cycle",
                    confidenceLevel: "Moderate confidence",
                    observed: \`Lunch average check ($\${data.lunchAvgCheck.toFixed(2)}) trails dinner ($\${data.dinnerAvgCheck.toFixed(2)}) by $\${(data.dinnerAvgCheck - data.lunchAvgCheck).toFixed(2)} across \${formatNum(data.lunchOrders)} orders. Beverage attach is 31% at lunch vs. 68% at dinner.\`,
                    inferred: \`Time-sensitive lunch diners avoid ordering separate sides or beverages due to perceived ordering friction or individual item pricing.\`,
                    verify: \`Audit 50 lunch checks to confirm whether single-item ordering without beverage is concentrated in takeout vs. dine-in tables.\`,
                    actionCandidate: \`Program a one-touch POS 'Express Lunch Bundle' (Entree + Beverage + Side) at an attractive check-lift price point.\`,
                    monthlyRange: \`$\${formatNum(Math.round(annLunchGap / 12 * 0.85))}–$\${formatNum(Math.round(annLunchGap / 12 * 1.2))}\`,
                    annualRange: \`$\${formatNum(Math.round(annLunchGap * 0.85))}–$\${formatNum(Math.round(annLunchGap * 1.2))}\`,
                    periodImpact: \`$\${formatNum(Math.round((data.dinnerAvgCheck - data.lunchAvgCheck) * data.lunchOrders))} (\${data.periodDays} days)\`,
                    friction: "Low to moderate",
                    decisionPriority: "Plan next menu update",
                    decisionRationale: "Substantial margin opportunity requiring minimal staff retraining."
                },
                {
                    id: "F_3P",
                    rank: 6,
                    category: "Channel distribution risk",
                    title: "Third-Party Delivery Revenue Concentration & Commission Drag",
                    priority: "Monitor & Optimize",
                    confidenceLevel: "High confidence (Channel split)",
                    observed: \`Third-party delivery platforms represent $\${formatNum(Math.round(data.thirdPartyDeliverySales))} (\${((data.thirdPartyDeliverySales / data.netSales) * 100).toFixed(1)}% of total net sales), carrying 18–24% effective commission deductions.\`,
                    inferred: \`The operation is relying on delivery marketplaces for volume, subsidizing third-party platforms rather than building direct customer relationships.\`,
                    verify: \`Calculate net contribution margin on the top 5 delivery menu items after packaging, commissions, and labor allocation.\`,
                    actionCandidate: \`Insert direct-ordering bounce-back incentives ($5 credit) in all delivery bags and align delivery menu pricing with packaging overhead.\`,
                    monthlyRange: "$2,200–$3,800 commission drag",
                    annualRange: "$26,000–$45,000 commission drag",
                    periodImpact: "Platform take-rate deductions",
                    friction: "Moderate",
                    decisionPriority: "Ongoing optimization",
                    decisionRationale: "Channel re-balancing without abrupt revenue disruption."
                },
                {
                    id: "F_WEEKDAY",
                    rank: 7,
                    category: "Labor scheduling variance",
                    title: "Early-Weekday Scheduling Variance (Tuesday vs Saturday)",
                    priority: "Audit Schedule",
                    confidenceLevel: "High confidence (Time of week)",
                    observed: \`Tuesday net sales ($\${formatNum(Math.round(data.tuesdaySales))}) generate barely one-third of Saturday volume ($\${formatNum(Math.round(data.saturdaySales))}), while kitchen labor hours are reduced by only 18%.\`,
                    inferred: \`Fixed shift templates are being applied across low-volume days, inflating early-week labor percentage to 33%+.\`,
                    verify: \`Review Tuesday hourly covers between 11 AM and 4 PM against scheduled cook hours to verify station idle time.\`,
                    actionCandidate: \`Stagger early-week kitchen call times and cross-train prep cooks to cover the line until dinner rush volume begins.\`,
                    monthlyRange: "$1,200–$2,100",
                    annualRange: "$14,400–$25,200",
                    periodImpact: "Early-week labor drag",
                    friction: "Low to moderate",
                    decisionPriority: "Address in next schedule cycle",
                    decisionRationale: "Predictable recurring variance addressable through scheduling adjustments."
                }
            ];

            const visibleFindings = tier === 1 ? allFindings.slice(0, 3) : (tier === 2 ? allFindings.slice(0, 6) : allFindings);`;

// Find and replace the findings array
const findingsRegex = /const allFindings\s*=\s*\[[\s\S]*?const visibleFindings\s*=\s*tier === 1 \? allFindings\.slice\(0, 3\) : \(tier === 2 \? allFindings\.slice\(0, 6\) : allFindings\);/;

if (findingsRegex.test(c)) {
  c = c.replace(findingsRegex, newFindingsBlock);
  console.log('Replaced allFindings array with 4-Layer Epistemic model');
} else {
  console.warn('Could not match allFindings block via regex');
}

// 6. Update card rendering to output the 4 Epistemic Layers
const oldRenderCard = `card.innerHTML = \`
                    <div class="finding-header">
                        <div>
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); text-transform: uppercase;">Finding 0\${f.rank}</span>
                            <h4 class="finding-title">\${f.title}</h4>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span class="priority-badge \${pClass}">\${f.priority}</span>
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary);">\${f.confidence}</span>
                        </div>
                    </div>

                    <div class="eight-point-grid">
                        <div class="point-item">
                            <div class="point-label">1. What is Happening</div>
                            <p class="point-text">\${f.what}</p>
                        </div>
                        <div class="point-item">
                            <div class="point-label">2. Why It Matters</div>
                            <p class="point-text">\${f.why}</p>
                        </div>
                        <div class="point-item">
                            <div class="point-label">3. Operational Interpretation</div>
                            <p class="point-text">\${f.interpretation}</p>
                        </div>
                        <div class="point-item">
                            <div class="point-label">4. Downstream Consequences</div>
                            <ul style="padding-left: 18px; margin: 0; font-size: 13px; color: var(--text-primary);">
                                \${f.downstream.map(d => \`<li>\${d}</li>\`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="exposure-box">
                        <div class="exposure-row">
                            <span>Measured Period Impact:</span>
                            <strong>\${f.periodImpact}</strong>
                        </div>
                        <div class="exposure-row">
                            <span>Monthly Exposure Range:</span>
                            <span>\${f.monthlyRange}</span>
                        </div>
                        <div class="exposure-row">
                            <span>Annualized Projected Range:</span>
                            <strong style="color: var(--accent-crimson);">\${f.annualRange}</strong>
                        </div>
                        <div class="exposure-row">
                            <span>Measurement Basis:</span>
                            <span style="color: var(--text-secondary); font-size: 11px;">\${f.basis}</span>
                        </div>
                    </div>

                    <div style="margin: 1rem 0; font-size: 13px;">
                        <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--accent-gold); text-transform: uppercase;">Validate First on the Floor:</span>
                        <p style="margin: 0.25rem 0 0 0; color: var(--text-primary);">\${f.validateFirst}</p>
                    </div>

                    <div class="action-callout">
                        <div class="action-title">Recommended First Action &bull; Controllable Lever</div>
                        <div style="font-size: 13.5px; color: var(--text-primary); font-weight: 500;">\${f.action}</div>
                    </div>
                \`;`;

const newRenderCard = `card.innerHTML = \`
                    <div class="finding-header">
                        <div>
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-teal); text-transform: uppercase; font-weight: 700; letter-spacing: 0.08em;">PRIORITY 0\${f.rank} &bull; \${f.category}</span>
                            <h4 class="finding-title">\${f.title}</h4>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                            <span class="priority-badge \${pClass}">\${f.priority}</span>
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); background: #FAF9F5; padding: 4px 8px; border-radius: 3px; border: 1px solid var(--border-light);">\${f.confidenceLevel}</span>
                        </div>
                    </div>

                    <!-- 4-Layer Epistemic Stack -->
                    <div class="epistemic-stack">
                        <!-- Layer 1: Observed -->
                        <div class="epistemic-layer observed-layer">
                            <div class="layer-header">
                                <span class="layer-title">Observed</span>
                                <span class="layer-subtitle">&mdash; What the supplied records directly establish</span>
                            </div>
                            <p class="layer-body">\${f.observed}</p>
                        </div>

                        <!-- Layer 2: Inferred -->
                        <div class="epistemic-layer inferred-layer">
                            <div class="layer-header">
                                <span class="layer-title">Inferred</span>
                                <span class="layer-subtitle">&mdash; What multiple signals reasonably suggest (\${f.confidenceLevel})</span>
                            </div>
                            <p class="layer-body">\${f.inferred}</p>
                        </div>

                        <!-- Layer 3: Verify -->
                        <div class="epistemic-layer verify-layer">
                            <div class="layer-header">
                                <span class="layer-title">Verify</span>
                                <span class="layer-subtitle">&mdash; Floor check required before accepting the explanation</span>
                            </div>
                            <p class="layer-body">\${f.verify}</p>
                        </div>

                        <!-- Layer 4: Action Candidate -->
                        <div class="epistemic-layer action-layer">
                            <div class="layer-header">
                                <span class="layer-title">Action Candidate</span>
                                <span class="layer-subtitle">&mdash; What may be worth changing if validation supports it</span>
                            </div>
                            <p class="layer-body">\${f.actionCandidate}</p>
                        </div>
                    </div>

                    <!-- Priority & Friction Matrix -->
                    <div class="priority-logic-box">
                        <div class="logic-grid">
                            <div class="logic-field">
                                <span class="logic-label">Estimated Exposure:</span>
                                <span class="logic-value"><strong>\${f.monthlyRange} monthly</strong> <span style="color: var(--text-secondary); font-size: 11.5px;">(\${f.annualRange} annualized)</span></span>
                            </div>
                            <div class="logic-field">
                                <span class="logic-label">Implementation Friction:</span>
                                <span class="logic-value"><span class="friction-pill">\${f.friction}</span></span>
                            </div>
                            <div class="logic-field full">
                                <span class="logic-label">Decision Priority:</span>
                                <span class="logic-value"><strong>\${f.decisionPriority}</strong> &mdash; \${f.decisionRationale}</span>
                            </div>
                        </div>
                    </div>
                \`;`;

const renderCardRegex = /card\.innerHTML\s*=\s*`\s*<div class="finding-header">[\s\S]*?<\/div>\s*`;/;

if (renderCardRegex.test(c)) {
  c = c.replace(renderCardRegex, newRenderCard);
  console.log('Replaced card.innerHTML rendering logic with 4-Layer Epistemic Stack');
} else {
  console.warn('Could not match card.innerHTML rendering logic via regex');
}

fs.writeFileSync(file, c, 'utf8');
console.log('Updated signal/demo/index.html with 4-layer epistemology successfully.');
