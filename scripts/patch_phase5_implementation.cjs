// scripts/patch_phase5_implementation.cjs
const fs = require('fs');
const path = require('path');

console.log('--- Starting Phase 5 Implementation Patch ---');

// =============================================================================
// 1. UPDATE assets/js/analytics.js
// =============================================================================
console.log('1. Patching assets/js/analytics.js...');
let analyticsCode = fs.readFileSync('assets/js/analytics.js', 'utf8');

// Add funnel event methods into CM_Analytics object
const ctaClickMethod = 'trackContactClick: function(contactMethod, ctaLocation) {';
const newAnalyticsMethods = `trackContactClick: function(contactMethod, ctaLocation) {
            emitGtag('contact_click', {
                contact_method: cleanString(String(contactMethod || 'unknown')),
                cta_location: cleanString(String(ctaLocation || 'general'))
            });
        },

        /**
         * Outbound & Campaign Funnel Observability Events
         */
        trackOutboundLandingView: function(params) {
            params = params || {};
            emitGtag('outbound_landing_view', {
                utm_source: cleanString(String(params.utm_source || '')),
                utm_medium: cleanString(String(params.utm_medium || '')),
                utm_campaign: cleanString(String(params.utm_campaign || '')),
                landing_page: window.location.pathname
            });
        },

        trackDiagnosticStarted: function(diagnosticType, params) {
            params = params || {};
            var cleanObj = {
                diagnostic_type: cleanString(String(diagnosticType || 'website_system_check')),
                source_page: window.location.pathname
            };
            if (params.utm_source) cleanObj.utm_source = cleanString(String(params.utm_source));
            if (params.utm_campaign) cleanObj.utm_campaign = cleanString(String(params.utm_campaign));
            emitGtag('diagnostic_started', cleanObj);
        },

        trackDiagnosticCompleted: function(diagnosticType, params) {
            params = params || {};
            var cleanObj = {
                diagnostic_type: cleanString(String(diagnosticType || 'website_system_check')),
                findings_count: Number(params.findings_count) || 0
            };
            if (params.utm_source) cleanObj.utm_source = cleanString(String(params.utm_source));
            if (params.utm_campaign) cleanObj.utm_campaign = cleanString(String(params.utm_campaign));
            emitGtag('diagnostic_completed', cleanObj);
        },

        trackDiagnosticToConsultation: function(diagnosticId, params) {
            params = params || {};
            var cleanObj = {
                diagnostic_id: cleanString(String(diagnosticId || '')),
                source_page: window.location.pathname
            };
            if (params.utm_source) cleanObj.utm_source = cleanString(String(params.utm_source));
            if (params.utm_campaign) cleanObj.utm_campaign = cleanString(String(params.utm_campaign));
            emitGtag('diagnostic_to_consultation', cleanObj);
        },

        trackProjectIntakeStarted: function(formId, params) {
            params = params || {};
            var cleanObj = {
                form_id: cleanString(String(formId || 'contact-wizard')),
                source_page: window.location.pathname
            };
            if (params.inquiry_type) cleanObj.inquiry_type = cleanString(String(params.inquiry_type));
            if (params.utm_source) cleanObj.utm_source = cleanString(String(params.utm_source));
            if (params.utm_campaign) cleanObj.utm_campaign = cleanString(String(params.utm_campaign));
            emitGtag('project_intake_started', cleanObj);
        },

        getAttribution: function() {
            try {
                var stored = sessionStorage.getItem('cm_attribution');
                if (stored) {
                    var parsed = JSON.parse(stored);
                    if (parsed && typeof parsed === 'object') return parsed;
                }
            } catch (_) {}
            return {};
        }`;

if (!analyticsCode.includes('trackOutboundLandingView')) {
  analyticsCode = analyticsCode.replace(
    /trackContactClick:\s*function\(contactMethod,\s*ctaLocation\)\s*\{[\s\S]*?\}\s*\}\s*;/m,
    newAnalyticsMethods + '\n    };'
  );
  console.log('Added funnel event methods to CM_Analytics.');
}

// Add campaign attribution capture into initAnalyticsListeners
const listenerInitTarget = 'function initAnalyticsListeners() {';
const attributionCaptureCode = `function initAnalyticsListeners() {
        // Capture and persist outbound campaign attribution across session
        try {
            var urlParams = new URLSearchParams(window.location.search);
            var utmSource = urlParams.get('utm_source');
            var utmCampaign = urlParams.get('utm_campaign');
            var utmMedium = urlParams.get('utm_medium');
            var utmContent = urlParams.get('utm_content');
            var utmTerm = urlParams.get('utm_term');

            if (utmSource || utmCampaign) {
                var attr = {
                    utm_source: cleanString(String(utmSource || '')),
                    utm_medium: cleanString(String(utmMedium || '')),
                    utm_campaign: cleanString(String(utmCampaign || '')),
                    utm_content: cleanString(String(utmContent || '')),
                    utm_term: cleanString(String(utmTerm || '')),
                    referrer: cleanString(String(document.referrer || ''))
                };
                sessionStorage.setItem('cm_attribution', JSON.stringify(attr));
                if (window.CM_Analytics && window.CM_Analytics.trackOutboundLandingView) {
                    window.CM_Analytics.trackOutboundLandingView(attr);
                }
            }
        } catch (_) {}`;

if (!analyticsCode.includes('sessionStorage.setItem(\'cm_attribution\'')) {
  analyticsCode = analyticsCode.replace(listenerInitTarget, attributionCaptureCode);
  console.log('Added campaign attribution capture to initAnalyticsListeners.');
}

fs.writeFileSync('assets/js/analytics.js', analyticsCode, 'utf8');
console.log('assets/js/analytics.js successfully updated.');

// =============================================================================
// 2. UPDATE website-system-check/index.html
// =============================================================================
console.log('2. Patching website-system-check/index.html...');
let wscHtml = fs.readFileSync('website-system-check/index.html', 'utf8');

// Replace the DOMContentLoaded auto-run block
const oldAutoRunRegex = /\/\/ Auto-run if query param is passed from homepage or external link[\s\S]*?form\.dispatchEvent\(new Event\('submit', \{ cancelable: true, bubbles: true \}\)\);[\s\S]*?\}\);/;

const newParamHandlerCode = `// Prepopulate URL and capture attribution from query params without auto-running scan
        window.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const passedUrl = urlParams.get('url');
            const passedBiz = urlParams.get('businessType') || urlParams.get('business_type') || urlParams.get('industry');
            const passedGoal = urlParams.get('goal');
            
            // Capture and sanitize UTM parameters
            const utmSource = urlParams.get('utm_source');
            const utmCampaign = urlParams.get('utm_campaign');
            const utmMedium = urlParams.get('utm_medium');
            const utmContent = urlParams.get('utm_content');
            const utmTerm = urlParams.get('utm_term');

            if (utmSource || utmCampaign) {
                const attrObj = {
                    utm_source: utmSource ? utmSource.trim().slice(0, 64) : '',
                    utm_medium: utmMedium ? utmMedium.trim().slice(0, 64) : '',
                    utm_campaign: utmCampaign ? utmCampaign.trim().slice(0, 64) : '',
                    utm_content: utmContent ? utmContent.trim().slice(0, 64) : '',
                    utm_term: utmTerm ? utmTerm.trim().slice(0, 64) : '',
                    referrer: document.referrer ? document.referrer.slice(0, 128) : ''
                };
                try {
                    sessionStorage.setItem('cm_attribution', JSON.stringify(attrObj));
                } catch (_) {}
            }

            if (passedUrl) {
                // Sanitize URL safely
                let sanitized = passedUrl.trim();
                if (!/^https?:\\/\\//i.test(sanitized)) {
                    sanitized = 'https://' + sanitized;
                }
                try {
                    const parsed = new URL(sanitized);
                    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                        urlInput.value = parsed.href;
                        
                        // Show helpful non-invasive prepopulated status banner
                        const helperBanner = document.createElement('div');
                        helperBanner.id = 'prefill-ready-banner';
                        helperBanner.style.cssText = 'background: rgba(15, 118, 110, 0.08); border: 1px solid var(--accent-teal); border-radius: 4px; padding: 0.75rem 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--text-primary);';
                        helperBanner.innerHTML = '<span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--accent-teal); text-transform: uppercase;">Ready to check:</span> We pre-loaded your website URL below. Click <strong>Run Free System Check</strong> to start the analysis.';
                        form.parentNode.insertBefore(helperBanner, form);

                        // Focus the run check button for clear next step
                        if (submitBtn) {
                            submitBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }
                } catch (_) {
                    // Invalid URL format - ignore silently
                }
                if (passedBiz) businessTypeInput.value = passedBiz.trim().slice(0, 64);
                if (passedGoal) improvementGoalInput.value = passedGoal.trim().slice(0, 128);
                // DO NOT automatically submit - requires conscious user action
            }
        });`;

wscHtml = wscHtml.replace(oldAutoRunRegex, newParamHandlerCode);

// Also attach attribution to the consultation inquiry submission payload
const inqSubmitTarget = `const payload = {
                    form_id: 'diagnostic-inquiry',
                    form_source: '/website-system-check/',
                    service: 'website_system_check_inquiry',
                    scanned_website: scannedWebsite,
                    diagnostic_id: diagnosticId,
                    diagnostic_summary: diagnosticSummary,
                    name: nameVal,
                    email: emailVal,
                    company: companyVal,
                    budget_range: budgetVal,
                    operational_friction: notesVal
                };`;

const newInqSubmitPayload = `let attr = {};
                if (window.CM_Analytics && window.CM_Analytics.getAttribution) {
                    attr = window.CM_Analytics.getAttribution();
                }
                const payload = {
                    form_id: 'diagnostic-inquiry',
                    form_source: '/website-system-check/',
                    service: 'website_system_check_inquiry',
                    scanned_website: scannedWebsite,
                    diagnostic_id: diagnosticId,
                    diagnostic_summary: diagnosticSummary,
                    name: nameVal,
                    email: emailVal,
                    company: companyVal,
                    budget_range: budgetVal,
                    operational_friction: notesVal,
                    utm_source: attr.utm_source || null,
                    utm_medium: attr.utm_medium || null,
                    utm_campaign: attr.utm_campaign || null,
                    utm_content: attr.utm_content || null,
                    utm_term: attr.utm_term || null,
                    campaign_referrer: attr.referrer || document.referrer || null
                };`;

if (wscHtml.includes(inqSubmitTarget)) {
  wscHtml = wscHtml.replace(inqSubmitTarget, newInqSubmitPayload);
  console.log('Attached campaign attribution to diagnostic inquiry form payload.');
}

// Track diagnostic_started and diagnostic_completed in website-system-check
wscHtml = wscHtml.replace(
  `trackEvent('diagnostic_submit_attempt', { has_business_type: !!businessType, has_goal: !!improvementGoal });`,
  `trackEvent('diagnostic_submit_attempt', { has_business_type: !!businessType, has_goal: !!improvementGoal });
            if (window.CM_Analytics && window.CM_Analytics.trackDiagnosticStarted) {
                window.CM_Analytics.trackDiagnosticStarted('website_system_check', window.CM_Analytics.getAttribution ? window.CM_Analytics.getAttribution() : {});
            }`
);

wscHtml = wscHtml.replace(
  `trackEvent('diagnostic_success', { findings_count: data.evidenceCount || 0 });`,
  `trackEvent('diagnostic_success', { findings_count: data.evidenceCount || 0 });
                if (window.CM_Analytics && window.CM_Analytics.trackDiagnosticCompleted) {
                    const attrData = window.CM_Analytics.getAttribution ? window.CM_Analytics.getAttribution() : {};
                    window.CM_Analytics.trackDiagnosticCompleted('website_system_check', Object.assign({ findings_count: data.evidenceCount || 0 }, attrData));
                }`
);

fs.writeFileSync('website-system-check/index.html', wscHtml, 'utf8');
console.log('website-system-check/index.html successfully updated.');

// =============================================================================
// 3. UPDATE contact/index.html
// =============================================================================
console.log('3. Patching contact/index.html...');
let contactHtml = fs.readFileSync('contact/index.html', 'utf8');

// Ensure contact payload carries campaign attribution if available
const contactPayloadTarget = `const payload = {
                        form_id: 'contact-wizard',
                        form_source: window.location.pathname,
                        inquiry_type: 'contact',
                        service_interest: selectedProblem || 'custom-systems',
                        website_url: website,
                        name: name,
                        email: email,
                        phone: phone,
                        timeline: timeline,
                        budget_range: budget,
                        operational_notes: notes,
                        selected_problem_label: selectedProblemLabel
                    };`;

const newContactPayload = `let attr = {};
                    if (window.CM_Analytics && window.CM_Analytics.getAttribution) {
                        attr = window.CM_Analytics.getAttribution();
                    }
                    const payload = {
                        form_id: 'contact-wizard',
                        form_source: window.location.pathname,
                        inquiry_type: 'contact',
                        service_interest: selectedProblem || 'custom-systems',
                        website_url: website,
                        name: name,
                        email: email,
                        phone: phone,
                        timeline: timeline,
                        budget_range: budget,
                        operational_notes: notes,
                        selected_problem_label: selectedProblemLabel,
                        utm_source: attr.utm_source || null,
                        utm_medium: attr.utm_medium || null,
                        utm_campaign: attr.utm_campaign || null,
                        utm_content: attr.utm_content || null,
                        utm_term: attr.utm_term || null,
                        campaign_referrer: attr.referrer || document.referrer || null
                    };`;

if (contactHtml.includes(contactPayloadTarget)) {
  contactHtml = contactHtml.replace(contactPayloadTarget, newContactPayload);
  console.log('Attached campaign attribution to contact form payload.');
}

fs.writeFileSync('contact/index.html', contactHtml, 'utf8');
console.log('contact/index.html successfully updated.');

// =============================================================================
// 4. UPDATE restaurant-systems/index.html
// =============================================================================
console.log('4. Patching restaurant-systems/index.html...');
let restHtml = fs.readFileSync('restaurant-systems/index.html', 'utf8');

// Add Stack-Neutral Architecture callout block
const restIntroTarget = `<p style="font-family: var(--font-sans); font-size: 1.15rem; line-height: 1.65; color: var(--text-secondary); margin-bottom: 2rem;">
                        Restaurant systems designed by someone who understands what happens when the plan meets Friday night.
                    </p>`;

const newRestIntro = `<p style="font-family: var(--font-sans); font-size: 1.15rem; line-height: 1.65; color: var(--text-secondary); margin-bottom: 1.25rem;">
                        Floor-tested operational design, workflow architecture, and custom tools built by someone who understands what happens when the plan meets Friday night.
                    </p>
                    <div style="background: rgba(15, 118, 110, 0.06); border-left: 3px solid var(--accent-teal); padding: 0.85rem 1.15rem; border-radius: 0 4px 4px 0; margin-bottom: 2rem;">
                        <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--accent-teal); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 0.25rem;">Stack-Neutral Architecture</span>
                        <p style="font-family: var(--font-sans); font-size: 13.5px; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                            Context &amp; Muse works around your existing technology stack rather than requiring you to rip and replace your Point of Sale, reservation engine, or third-party ordering platforms. I diagnose where customer flow, intake, or shift operations leak time and revenue—then build the smallest useful custom system that fixes the breakdown.
                        </p>
                    </div>`;

if (restHtml.includes(restIntroTarget)) {
  restHtml = restHtml.replace(restIntroTarget, newRestIntro);
  console.log('Added Stack-Neutral Architecture callout to restaurant-systems/index.html.');
}

// Ensure all 6 core restaurant work areas are represented in the capabilities section
const oldCapListTarget = `<section id="capabilities" class="creative-section" style="background: var(--bg-panel); border-bottom: 1px solid var(--border-light); padding: 5.5rem 0;">
            <div class="container" style="max-width: 800px;">
                <span class="eyebrow" style="color: var(--accent-teal); font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 2.5rem;">SYSTEM CAPABILITIES</span>`;

const newCapList = `<section id="capabilities" class="creative-section" style="background: var(--bg-panel); border-bottom: 1px solid var(--border-light); padding: 5.5rem 0;">
            <div class="container" style="max-width: 800px;">
                <span class="eyebrow" style="color: var(--accent-teal); font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.75rem;">SYSTEM CAPABILITIES</span>
                <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-primary); margin: 0 0 1.25rem 0; font-weight: 400;">Six ways we resolve operational friction.</h2>
                <p style="font-size: 15px; color: var(--text-secondary); margin: 0 0 2.5rem 0; line-height: 1.6;">
                    From eliminating ordering path drop-offs on your website to analyzing POS telemetry and streamlining catering intake.
                </p>`;

if (restHtml.includes(oldCapListTarget)) {
  restHtml = restHtml.replace(oldCapListTarget, newCapList);
}

// Add Cap 05 (Catering & Private Event Intake) and Cap 06 (Multi-Location Intelligence & Reporting)
const cap4Block = `<!-- Cap 4 -->
                <div class="capability-block">
                    <div class="capability-number">04</div>
                    <div>
                        <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.5rem; font-weight: 600;">Operational Implementation</h3>
                        <p style="font-size: 0.98rem; line-height: 1.65; color: var(--text-secondary); margin: 0;">
                            Translating abstract operational goals into floor-tested manager checklists, line prep structures, and logic schemas. Configuring Point of Sale (POS) backend structures to accurately capture discount parameters and protect margins.
                        </p>
                    </div>
                </div>`;

const newCaps456 = `<!-- Cap 4 -->
                <div class="capability-block">
                    <div class="capability-number">04</div>
                    <div>
                        <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.5rem; font-weight: 600;">POS Telemetry &amp; Comp/Void Audits</h3>
                        <p style="font-size: 0.98rem; line-height: 1.65; color: var(--text-secondary); margin: 0;">
                            Cross-analyzing historical register transactions, void timestamps, and promo codes against shift labor. Surfacing patterns where line delays trigger service recovery comps or where discount bleed quietly erodes operating margin.
                        </p>
                    </div>
                </div>

                <!-- Cap 5 -->
                <div class="capability-block">
                    <div class="capability-number">05</div>
                    <div>
                        <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.5rem; font-weight: 600;">Catering Intake &amp; Event Lead Systems</h3>
                        <p style="font-size: 0.98rem; line-height: 1.65; color: var(--text-secondary); margin: 0;">
                            Custom online estimation calculators for large-format catering, banquets, and private dining. Pre-qualifying minimum spends, guest counts, and date availability so managers stop burning hours trading repetitive scoping emails.
                        </p>
                    </div>
                </div>

                <!-- Cap 6 -->
                <div class="capability-block">
                    <div class="capability-number">06</div>
                    <div>
                        <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.5rem; font-weight: 600;">Multi-Location Reporting &amp; Signal Intelligence</h3>
                        <p style="font-size: 0.98rem; line-height: 1.65; color: var(--text-secondary); margin: 0;">
                            Unified decision queues and cross-unit variance trackers that compress multiple store exports into clear weekly actions. Operators get prioritized operational exceptions without getting buried in raw CSVs.
                        </p>
                    </div>
                </div>`;

if (restHtml.includes(cap4Block)) {
  restHtml = restHtml.replace(cap4Block, newCaps456);
  console.log('Added Capabilities 04, 05, and 06 to restaurant-systems/index.html.');
}

fs.writeFileSync('restaurant-systems/index.html', restHtml, 'utf8');
console.log('restaurant-systems/index.html successfully updated.');

// =============================================================================
// 5. UPDATE services/index.html
// =============================================================================
console.log('5. Patching services/index.html...');
let servHtml = fs.readFileSync('services/index.html', 'utf8');

servHtml = servHtml.replace(
  /<span class="services-hero-eyebrow">[\s\S]*?<\/span>/,
  '<span class="services-hero-eyebrow">APPLIED SYSTEMS STUDIO &bull; WAYS TO WORK TOGETHER</span>'
);

servHtml = servHtml.replace(
  /<h1>[\s\S]*?<\/h1>/,
  '<h1>Find the expensive friction.<br>Build the useful fix.</h1>'
);

const servLeadTarget = `<p>
                    Context &amp; Muse is intentionally founder-led and independent. Direct collaboration with Jayme Volstad, transparent scope, and custom software engineering for businesses that have outgrown generic templates, manual quote bottlenecks, and disconnected tools.
                </p>`;

const newServLead = `<p>
                    Context &amp; Muse is an applied systems studio founder-led by Jayme Volstad. I find where websites, intake, quoting, and operations leak revenue or time, then build the smallest custom system that fixes the problem—with fixed-scope investment tiers, transparent milestones, and direct engineering.
                </p>`;

if (servHtml.includes(servLeadTarget)) {
  servHtml = servHtml.replace(servLeadTarget, newServLead);
  console.log('Updated services/index.html hero lead.');
}

fs.writeFileSync('services/index.html', servHtml, 'utf8');
console.log('services/index.html successfully updated.');

console.log('--- Phase 5 Implementation Patch Completed ---');
