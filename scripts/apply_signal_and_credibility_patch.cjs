const fs = require('fs');
const path = require('path');

console.log('Applying Signal, Epistemology, and Credibility updates...\n');

// =========================================================================
// 1. signal/index.html
// =========================================================================
{
  const file = 'signal/index.html';
  let c = fs.readFileSync(file, 'utf8');

  // Remove GitHub link
  c = c.replace(
    /\s*<a href="https:\/\/github\.com\/rouguemuse\/signal-ops-intelligence"[^>]*>System architecture \/ GitHub &rarr;<\/a>/,
    ''
  );

  // Rewrite Hero text
  const oldHeroP = `<p style="font-family: var(--font-sans); font-size: 1.15rem; line-height: 1.65; color: rgba(250,249,245,0.75); margin-bottom: 2rem;">
                        Signal turns operational data and workflow friction into prioritized findings, impact estimates, and practical recommendations.
                    </p>`;
  
  const newHeroP = `<p style="font-family: var(--font-sans); font-size: 1.15rem; line-height: 1.65; color: rgba(250,249,245,0.85); margin-bottom: 0.75rem;">
                        Signal turns fragmented restaurant reports into a prioritized decision queue. It cross-analyzes signals across sales, labor, comps, voids, menu performance and timing, then weighs financial impact, confidence and implementation friction to surface the few decisions worth investigating first.
                    </p>
                    <p style="font-family: var(--font-mono); font-size: 0.95rem; line-height: 1.5; color: var(--accent-gold); margin-bottom: 2rem;">
                        Not more reporting. Decision compression for operators already drowning in reports.
                    </p>`;
  
  if (c.includes('Signal turns operational data and workflow friction')) {
    c = c.replace(/<p style="font-family: var\(--font-sans\); font-size: 1\.15rem; line-height: 1\.65; color: rgba\(250,249,245,0\.75\); margin-bottom: 2rem;">\s*Signal turns operational data and workflow friction into prioritized findings, impact estimates, and practical recommendations\.\s*<\/p>/, newHeroP);
  }

  // Update Status Badge and add validation review block
  const oldStatus = `<div style="margin-top: 1rem;">
                        <span class="status-badge">Product Status: Operational analysis service + decision-support system</span>
                    </div>`;

  const newStatus = `<div style="margin-top: 1.5rem;">
                        <span class="status-badge" style="background: rgba(197, 160, 89, 0.15); color: var(--accent-gold); border: 1px solid rgba(197, 160, 89, 0.3);">WORKING SYSTEM &bull; ACTIVE EXTERNAL VALIDATION</span>
                    </div>
                    <div style="margin-top: 1.25rem; padding: 1.1rem 1.25rem; background: rgba(250, 249, 245, 0.04); border-left: 3px solid var(--accent-gold); border-radius: 0 4px 4px 0; max-width: 620px;">
                        <p style="font-family: var(--font-sans); font-size: 0.92rem; line-height: 1.55; color: rgba(250, 249, 245, 0.85); margin: 0;">
                            Signal is currently being validated across additional restaurant operating models, POS exports and report structures. I am accepting 3–5 referred restaurants for a limited <strong>Signal Validation Review</strong>: a small set of exports in exchange for several evidence-backed findings and candid operator feedback. Full diagnostics remain a paid service.
                        </p>
                    </div>`;

  c = c.replace(
    /<div style="margin-top: 1rem;">\s*<span class="status-badge">Product Status: Operational analysis service \+ decision-support system<\/span>\s*<\/div>/,
    newStatus
  );

  // Labeling truthful dataset
  c = c.replace(
    'Demonstration data — values and identifiers have been anonymized.',
    'Synthetic Demonstration Dataset — values and records generated to simulate restaurant POS telemetry.'
  );

  fs.writeFileSync(file, c, 'utf8');
  console.log('1. Updated signal/index.html (Hero, validation stage, dataset label, removed GitHub link)');
}

// =========================================================================
// 2. systems/signal/index.html
// =========================================================================
{
  const file = 'systems/signal/index.html';
  let c = fs.readFileSync(file, 'utf8');

  // Replace GitHub link
  c = c.replace(
    /<a href="https:\/\/github\.com\/rouguemuse\/signal-ops-intelligence"[^>]*>Explore Codebase &rarr;<\/a>/,
    '<a href="/signal/" class="btn btn-secondary" style="border-color: rgba(250,249,245,0.3); color: #FAF9F5;">Launch Product Overview &rarr;</a>'
  );

  // Labeling truthful dataset
  c = c.replace(
    'Demonstration data — values and identifiers have been anonymized.',
    'Synthetic Demonstration Dataset — values and records generated to simulate restaurant POS telemetry.'
  );

  fs.writeFileSync(file, c, 'utf8');
  console.log('2. Updated systems/signal/index.html (replaced GitHub link, updated dataset label)');
}

// =========================================================================
// 3. about/index.html
// =========================================================================
{
  const file = 'about/index.html';
  let c = fs.readFileSync(file, 'utf8');

  const oldP = `<p>
                        Years managing high-volume kitchen and pastry production lines built an instinct for resource prioritization, quality control, multi-workstream coordination, and adoption management under pressure.
                    </p>`;

  const newP = `<p>
                        Years managing high-volume kitchen and pastry production lines built an instinct for resource prioritization, quality control, multi-workstream coordination, and adoption management under pressure. That background spans hands-on operating experience across front-of-house service, back-of-house line execution, culinary production, shift management, team training, vendor purchasing, and POS service systems.
                    </p>`;

  if (c.includes('Years managing high-volume kitchen and pastry production lines')) {
    c = c.replace(
      /<p>\s*Years managing high-volume kitchen and pastry production lines built an instinct for resource prioritization, quality control, multi-workstream coordination, and adoption management under pressure\.\s*<\/p>/,
      newP
    );
  }

  fs.writeFileSync(file, c, 'utf8');
  console.log('3. Updated about/index.html (expanded restaurant operating breadth)');
}

// =========================================================================
// 4. signal/sample-reports/index.html
// =========================================================================
{
  const file = 'signal/sample-reports/index.html';
  let c = fs.readFileSync(file, 'utf8');

  c = c.replace(
    'An anonymized demonstration of the structured findings, financial exposure models, and floor-validation checklists delivered in a Signal Diagnostic engagement.',
    'A structured demonstration of the four-layer epistemic findings, financial exposure models, and floor-validation protocols generated from a Synthetic Demonstration Dataset.'
  );

  c = c.replace(
    '<h2 style="font-family: var(--font-serif); font-size: 1.8rem; margin: 0; color: var(--text-primary); font-weight: 500;">Anonymized Hospitality Group</h2>',
    '<h2 style="font-family: var(--font-serif); font-size: 1.8rem; margin: 0; color: var(--text-primary); font-weight: 500;">Synthetic Demonstration Dataset &bull; Hospitality Group</h2>'
  );

  c = c.replace(
    'View an anonymized sample of a Signal operational intelligence diagnostic brief',
    'View a sample of a Signal operational intelligence diagnostic brief using a Synthetic Demonstration Dataset'
  );

  fs.writeFileSync(file, c, 'utf8');
  console.log('4. Updated signal/sample-reports/index.html (consistent Synthetic Demonstration Dataset labeling)');
}

console.log('\nBase patches applied successfully.');
