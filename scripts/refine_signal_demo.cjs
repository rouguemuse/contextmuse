const fs = require('fs');

const file = 'signal/demo/index.html';
let c = fs.readFileSync(file, 'utf8');

// 1. Update terminal text to remove causal dogmatism
c = c.replace(
  'Mapping causal chains: KDS Overtime Fatigue → 6PM Bottleneck → Full-Ticket Walkouts...',
  'Cross-analyzing signal streams: Overtime hours ↔ 6PM volume surge ↔ Peak void clusters...'
);

// 2. Add basis to all findings in allFindings
c = c.replace(
  'friction: "Low to moderate",\n                    decisionPriority: "Investigate first",',
  'basis: "Payroll punch records & hourly void timestamps",\n                    friction: "Low to moderate",\n                    decisionPriority: "Investigate first",'
);
c = c.replace(
  'friction: "Low",\n                    decisionPriority: "Investigate first",',
  'basis: "POS Void Summary and check detail logs",\n                    friction: "Low",\n                    decisionPriority: "Investigate first",'
);
c = c.replace(
  'friction: "Very low",\n                    decisionPriority: "Execute test immediately",',
  'basis: "POS Check Discounts summary records",\n                    friction: "Very low",\n                    decisionPriority: "Execute test immediately",'
);
c = c.replace(
  'friction: "Moderate",\n                    decisionPriority: "Validate next",',
  'basis: "Time-of-day hourly order volumes",\n                    friction: "Moderate",\n                    decisionPriority: "Validate next",'
);
c = c.replace(
  'friction: "Low to moderate",\n                    decisionPriority: "Plan next menu update",',
  'basis: "Service daypart check averages",\n                    friction: "Low to moderate",\n                    decisionPriority: "Plan next menu update",'
);
c = c.replace(
  'friction: "Moderate",\n                    decisionPriority: "Ongoing optimization",',
  'basis: "Dining option channel mix report",\n                    friction: "Moderate",\n                    decisionPriority: "Ongoing optimization",'
);
c = c.replace(
  'friction: "Low to moderate",\n                    decisionPriority: "Address in next schedule cycle",',
  'basis: "Day-of-week sales & labor ledger",\n                    friction: "Low to moderate",\n                    decisionPriority: "Address in next schedule cycle",'
);

// 3. Fix pClass badge calculation
c = c.replace(
  "const pClass = f.priority === 'Fix Now' ? 'fix-now' : (f.priority === 'Validate Next' ? 'validate-next' : 'monitor');",
  "const pClass = f.priority.toLowerCase().includes('investigate') || f.priority.toLowerCase().includes('execute') ? 'fix-now' : (f.priority.toLowerCase().includes('validate') ? 'validate-next' : 'monitor');"
);

// 4. Fix matrix table rendering
c = c.replace(
  "<td><span class=\"stream-pill\" style=\"font-size: 10px;\">${f.confidence.split(' ')[0]}</span></td>",
  "<td><span class=\"stream-pill\" style=\"font-size: 10px;\">${f.confidenceLevel.split(' ')[0]}</span></td>"
);

// 5. Update generateMarkdownBrief
const oldMdLoop = `findings.forEach(f => {
                md += \`### \${f.rank}. \${f.title}\\n\`;
                md += \`**Priority:** \${f.priority} | **Confidence:** \${f.confidence}\\n\\n\`;
                md += \`* **What is happening:** \${f.what}\\n\`;
                md += \`* **Why it matters:** \${f.why}\\n\`;
                md += \`* **Operational interpretation:** \${f.interpretation}\\n\`;
                md += \`* **Estimated financial exposure:** \${f.annualRange} annualized (\${f.periodImpact} measured)\\n\`;
                md += \`* **Measurement basis:** \${f.basis}\\n\`;
                md += \`* **Validate first:** \${f.validateFirst}\\n\`;
                md += \`* **Recommended action:** \${f.action}\\n\\n\`;
            });`;

const newMdLoop = `findings.forEach(f => {
                md += \`### PRIORITY 0\${f.rank} &bull; \${f.title}\\n\`;
                md += \`**Category:** \${f.category} | **Priority:** \${f.priority} | **Confidence:** \${f.confidenceLevel}\\n\\n\`;
                md += \`* **Observed:** \${f.observed}\\n\`;
                md += \`* **Inferred:** \${f.inferred}\\n\`;
                md += \`* **Verify on Floor:** \${f.verify}\\n\`;
                md += \`* **Action Candidate:** \${f.actionCandidate}\\n\`;
                md += \`* **Estimated Exposure:** \${f.monthlyRange} monthly (\${f.annualRange} annualized)\\n\`;
                md += \`* **Measurement Basis:** \${f.basis}\\n\`;
                md += \`* **Implementation Friction:** \${f.friction}\\n\`;
                md += \`* **Decision Priority:** \${f.decisionPriority} — \${f.decisionRationale}\\n\\n\`;
            });`;

c = c.replace(oldMdLoop, newMdLoop);

fs.writeFileSync(file, c, 'utf8');
console.log('Successfully polished signal/demo/index.html matrix, terminal, and markdown brief.');
