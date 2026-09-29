import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetPath = path.resolve(__dirname, '..', 'website-system-check', 'index.html');

let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add extra styles for confidence badges, option lists, and verification boxes
const newStyles = `
        .badge-conf-high { background: #EBF4F1; color: #204E45; border: 1px solid #B8DACF; }
        .badge-conf-medium { background: #FEF6E4; color: #8C6621; border: 1px solid #E4CD9A; }
        .badge-conf-low { background: #F3F4F6; color: #4B5563; border: 1px solid #D1D5DB; }

        .industry-context-banner {
            background: #FAF6ED;
            border: 1px solid #E5D9C3;
            border-radius: 6px;
            padding: 0.85rem 1.25rem;
            margin-bottom: 1.5rem;
            font-family: var(--font-mono);
            font-size: 12px;
            color: #785819;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            line-height: 1.5;
        }

        .finding-source-tag {
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--text-muted);
            background: #EDECE6;
            padding: 2px 6px;
            border-radius: 3px;
        }

        .finding-options-list {
            margin: 0.35rem 0 0 0;
            padding-left: 1.25rem;
            font-family: var(--font-sans);
            font-size: 13.5px;
            color: var(--text-primary);
            line-height: 1.6;
        }
        .finding-options-list li {
            margin-bottom: 0.25rem;
        }

        .finding-verification-box {
            background: #FFFFFF;
            border-left: 3px solid #8C6621;
            padding: 0.6rem 0.85rem;
            font-size: 13px;
            color: var(--text-secondary);
            border-radius: 0 4px 4px 0;
            margin-top: 0.35rem;
        }
`;

// Insert new styles before </style>
content = content.replace('</style>', `${newStyles}\n    </style>`);

// 2. Add Industry Context Banner & Worth Verifying section in HTML
const newResultsMarkup = `
                    <div class="results-body">
                        <div id="res-industry-context-note" class="industry-context-banner" style="display: none;"></div>

                        <div class="results-exec-summary" id="res-exec-summary">
                            "Analyzing customer journey and intake friction points..."
                        </div>

                        <!-- Most Important Finding -->
                        <div class="finding-section-heading">01 // Primary Operational Bottleneck</div>
                        <div id="res-most-important"></div>

                        <!-- System & Operational Opportunities -->
                        <div class="finding-section-heading">02 // System &amp; Intake Opportunities</div>
                        <div id="res-system-opportunities"></div>

                        <!-- Quick Wins -->
                        <div class="finding-section-heading">03 // Conversion &amp; Messaging Quick Wins</div>
                        <div id="res-quick-wins"></div>

                        <!-- Worth Verifying / Hypotheses -->
                        <div id="res-worth-verifying-section" style="display: none;">
                            <div class="finding-section-heading">04 // Context Hypotheses (Worth Verifying with Business)</div>
                            <div id="res-worth-verifying"></div>
                        </div>

                        <!-- Technical & UX Notes -->
                        <div class="finding-section-heading">05 // Technical &amp; UX Foundation</div>
                        <div id="res-technical-notes"></div>
`;

content = content.replace(/<div class="results-body">[\s\S]*?<!-- Technical & UX Notes -->[\s\S]*?<div id="res-technical-notes"><\/div>/, newResultsMarkup);

// 3. Update JavaScript renderDiagnosticResults and renderFindingCard functions
const newJsFunctions = `
        // Render Results Helper with Full Evidence-First Schema
        function renderDiagnosticResults(data) {
            progressBox.style.display = 'none';
            resultsContainer.style.display = 'block';

            // Meta & Executive Summary
            document.getElementById('res-target-url').textContent = data.targetUrl;
            document.getElementById('res-exec-summary').textContent = \`\u201C\${data.summary}\u201D\`;

            // Industry Context Note
            const industryBanner = document.getElementById('res-industry-context-note');
            if (data.industryContextNote) {
                industryBanner.innerHTML = \`<span>\u2699\uFE0F <strong>Domain Context Note:</strong> \${escapeHtml(data.industryContextNote)}</span>\`;
                industryBanner.style.display = 'flex';
            } else {
                industryBanner.style.display = 'none';
            }

            // Carry over to inquiry form
            document.getElementById('inq-scanned-website').value = data.targetUrl;
            document.getElementById('inq-diagnostic-id').value = data.diagnosticId || '';
            document.getElementById('inq-diagnostic-summary').value = data.summary || '';

            // 1. Most Important Finding
            const mi = data.mostImportant;
            const miContainer = document.getElementById('res-most-important');
            if (mi) {
                miContainer.innerHTML = renderFindingCard(mi, 'badge-high', 'High Priority', true);
            } else {
                miContainer.innerHTML = \`<p class="finding-val">No critical bottlenecks detected on first pass.</p>\`;
            }

            // 2. System & Intake Opportunities
            const sysContainer = document.getElementById('res-system-opportunities');
            if (data.systemOpportunities && data.systemOpportunities.length > 0) {
                sysContainer.innerHTML = data.systemOpportunities.map(item => renderFindingCard(item, 'badge-opp', 'System Opportunity')).join('');
            } else {
                sysContainer.innerHTML = \`<div class="finding-card"><p class="finding-val" style="margin:0;">No unstructured intake or unrouted territory leaks detected on the main page.</p></div>\`;
            }

            // 3. Quick Wins & Messaging
            const qwContainer = document.getElementById('res-quick-wins');
            if (data.quickWins && data.quickWins.length > 0) {
                qwContainer.innerHTML = data.quickWins.map(item => renderFindingCard(item, 'badge-medium', 'Quick Win')).join('');
            } else {
                qwContainer.innerHTML = \`<div class="finding-card"><p class="finding-val" style="margin:0;">Baseline headlines and calls to action are present and clear.</p></div>\`;
            }

            // 4. Worth Verifying / Hypotheses (Low Confidence)
            const worthSection = document.getElementById('res-worth-verifying-section');
            const worthContainer = document.getElementById('res-worth-verifying');
            if (data.worthVerifying && data.worthVerifying.length > 0) {
                worthContainer.innerHTML = data.worthVerifying.map(item => renderFindingCard(item, 'badge-conf-low', 'Worth Verifying')).join('');
                worthSection.style.display = 'block';
            } else {
                worthSection.style.display = 'none';
            }

            // 5. Technical & UX Notes
            const techContainer = document.getElementById('res-technical-notes');
            if (data.technicalNotes && data.technicalNotes.length > 0) {
                techContainer.innerHTML = data.technicalNotes.map(item => renderFindingCard(item, 'badge-low', 'Technical Check')).join('');
            } else {
                techContainer.innerHTML = \`<div class="finding-card"><p class="finding-val" style="margin:0;">Mobile viewport, HTTPS encryption, and document structure pass standard checks.</p></div>\`;
            }

            // 6. Relevant Case Proof
            const proofContainer = document.getElementById('res-proof-container');
            const proofKey = data.proofKey || 'quote_lead';
            if (proofKey === 'restaurant') {
                proofContainer.innerHTML = \`
                    <div class="relevant-proof-box">
                        <div class="proof-eyebrow">Relevant Live System Proof · Restaurant Systems</div>
                        <h4 class="proof-title">Signal Restaurant Intelligence &amp; Menu Matrix</h4>
                        <p class="proof-desc">
                            We engineered a real-time margin analyzer and operational intelligence engine for hospitality groups, replacing disconnected spreadsheets with actionable revenue modeling.
                        </p>
                        <a href="/signal/" class="btn-secondary" style="font-size: 12.5px; padding: 0.6rem 1.1rem; text-decoration: none; display: inline-block;">
                            Explore Signal Case Proof →
                        </a>
                    </div>
                \`;
            } else if (proofKey === 'custom_operations') {
                proofContainer.innerHTML = \`
                    <div class="relevant-proof-box">
                        <div class="proof-eyebrow">Relevant Live System Proof · Custom Operations</div>
                        <h4 class="proof-title">INNcontrol Commercial Estimator &amp; Floorplan Mapper</h4>
                        <p class="proof-desc">
                            Built an interactive 2D floorplan equipment mapper and estimation workbench for commercial HVAC engineering, eliminating clipboard paper surveys and speeding proposal turnaround from 5 days to 20 minutes.
                        </p>
                        <a href="/systems/client-builds/#inncontrol" class="btn-secondary" style="font-size: 12.5px; padding: 0.6rem 1.1rem; text-decoration: none; display: inline-block;">
                            View INNcontrol Case Study →
                        </a>
                    </div>
                \`;
            } else {
                proofContainer.innerHTML = \`
                    <div class="relevant-proof-box">
                        <div class="proof-eyebrow">Relevant Live System Proof · Sizing &amp; Territory Qualification</div>
                        <h4 class="proof-title">Lone Wolf Dumpsters · Territory Routing &amp; Sizing Engine</h4>
                        <p class="proof-desc">
                            Replaced a generic contact form with an interactive volume calculator and real-time county territory validator. Increased lead qualification rate while eliminating 40+ manual dispatch emails per week.
                        </p>
                        <a href="/systems/client-builds/#lonewolf" class="btn-secondary" style="font-size: 12.5px; padding: 0.6rem 1.1rem; text-decoration: none; display: inline-block;">
                            See Quote + Lead System Architecture →
                        </a>
                    </div>
                \`;
            }

            // Scroll smoothly into results
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function renderFindingCard(item, badgeClass, badgeLabel, isHighlight = false) {
            const conf = (item.confidence || 'MEDIUM').toUpperCase();
            let confBadgeClass = 'badge-conf-medium';
            let confLabel = 'Medium Confidence';
            if (conf === 'HIGH') {
                confBadgeClass = 'badge-conf-high';
                confLabel = 'High Confidence';
            } else if (conf === 'LOW') {
                confBadgeClass = 'badge-conf-low';
                confLabel = 'Worth Verifying';
            }

            // Handle evidence array or string
            let evidenceHtml = '';
            if (Array.isArray(item.evidence) && item.evidence.length > 0) {
                evidenceHtml = item.evidence.map(ev => \`<span class="finding-evidence-quote">\${escapeHtml(ev)}</span>\`).join(' ');
            } else if (typeof item.evidence === 'string' && item.evidence.trim()) {
                evidenceHtml = \`<span class="finding-evidence-quote">\${escapeHtml(item.evidence)}</span>\`;
            }

            // Implementation options
            let optionsHtml = '';
            if (Array.isArray(item.implementation_options) && item.implementation_options.length > 0) {
                optionsHtml = \`
                    <div class="finding-row">
                        <span class="finding-label">Implementation Possibilities:</span>
                        <div class="finding-val">
                            <ul class="finding-options-list">
                                \${item.implementation_options.map(opt => \`<li>\${escapeHtml(opt)}</li>\`).join('')}
                            </ul>
                        </div>
                    </div>
                \`;
            }

            // Verification Needed
            let verifyHtml = '';
            if (item.verification_needed && item.verification_needed.trim()) {
                verifyHtml = \`
                    <div class="finding-row">
                        <span class="finding-label">Verify with Business:</span>
                        <div class="finding-val">
                            <div class="finding-verification-box">\${escapeHtml(item.verification_needed)}</div>
                        </div>
                    </div>
                \`;
            }

            return \`
                <div class="finding-card \${isHighlight ? 'highlight' : ''}">
                    <div class="finding-card-title">
                        <span>\${escapeHtml(item.title)}</span>
                        <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                            <span class="severity-badge \${badgeClass}">\${badgeLabel}</span>
                            <span class="severity-badge \${confBadgeClass}">\${confLabel}</span>
                            \${item.source_element ? \`<span class="finding-source-tag">\${escapeHtml(item.source_element)}</span>\` : ''}
                        </div>
                    </div>
                    <div class="finding-grid-details">
                        <div class="finding-row">
                            <span class="finding-label">Observed Fact:</span>
                            <span class="finding-val">\${escapeHtml(item.observed_fact || item.observation || '')}</span>
                        </div>
                        \${evidenceHtml ? \`
                        <div class="finding-row">
                            <span class="finding-label">Direct Evidence:</span>
                            <span class="finding-val">\${evidenceHtml}</span>
                        </div>\` : ''}
                        \${item.inference ? \`
                        <div class="finding-row">
                            <span class="finding-label">Inference / Flow:</span>
                            <span class="finding-val" style="color: var(--forest-soft);">\${escapeHtml(item.inference)}</span>
                        </div>\` : ''}
                        <div class="finding-row">
                            <span class="finding-label">Why It Matters:</span>
                            <span class="finding-val">\${escapeHtml(item.why_it_matters)}</span>
                        </div>
                        <div class="finding-row">
                            <span class="finding-label">Recommendation:</span>
                            <span class="finding-val" style="color: var(--accent-teal); font-weight: 600;">\${escapeHtml(item.recommendation || item.what_could_improve || '')}</span>
                        </div>
                        \${optionsHtml}
                        \${verifyHtml}
                    </div>
                </div>
            \`;
        }
`;

content = content.replace(/\/\/ Render Results Helper[\s\S]*?function renderFindingCard[\s\S]*?return `[\s\S]*?<\/div>\s*`;\s*}/, newJsFunctions);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated website-system-check/index.html');
