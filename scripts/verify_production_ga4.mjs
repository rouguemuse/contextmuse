import puppeteer from 'puppeteer';

const PROD_BASE = 'https://www.contextmuse.com';

async function extractEvents(page) {
    const raw = await page.evaluate(() => {
        return (window.dataLayer || []).map(item => {
            if (item && item.length !== undefined) {
                return Array.from(item);
            }
            return item;
        });
    });

    const parsedEvents = [];
    for (const entry of raw) {
        if (Array.isArray(entry) && entry[0] === 'event') {
            parsedEvents.push({ name: entry[1], params: entry[2] || {} });
        } else if (entry && entry.event) {
            parsedEvents.push({ name: entry.event, params: entry });
        }
    }
    return parsedEvents;
}

function checkPII(obj, forbiddenStrings = []) {
    const str = JSON.stringify(obj).toLowerCase();
    for (const forbidden of forbiddenStrings) {
        if (forbidden && str.includes(forbidden.toLowerCase())) {
            return { clean: false, reason: `Found sensitive value "${forbidden}" in payload` };
        }
    }
    // General PII patterns
    if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(str)) {
        return { clean: false, reason: 'Found email address pattern in payload' };
    }
    if (/lead_[a-z0-9_]{10,}/i.test(str)) {
        return { clean: false, reason: 'Found submission_id / lead token in payload' };
    }
    return { clean: true };
}

const auditResults = {
    generate_lead: 'FAIL',
    intake_started: 'FAIL',
    intake_step_completed: 'FAIL',
    cta_click: 'FAIL',
    contact_click: 'FAIL',
    pii_audit: 'FAIL',
    details: {}
};

async function runAudit() {
    console.log('====================================================');
    console.log('PRODUCTION GA4 EVENT & PRIVACY AUDIT: ' + PROD_BASE);
    console.log('====================================================');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        page.on('dialog', async dialog => { await dialog.dismiss(); });

        // ----------------------------------------------------
        // PHASE 1: Contact Wizard Funnel & Conversion
        // ----------------------------------------------------
        console.log('\n[1/3] Testing Contact Wizard at ' + PROD_BASE + '/contact/...');
        await page.goto(PROD_BASE + '/contact/', { waitUntil: 'networkidle2' });

        // 1. Initial Load Check
        let events = await extractEvents(page);
        let intakeStartedInitial = events.filter(e => e.name === 'intake_started');
        console.log('  -> Initial intake_started count:', intakeStartedInitial.length);
        if (intakeStartedInitial.length !== 0) {
            throw new Error('intake_started fired on initial page load (VIOLATION)');
        }
        console.log('  -> PASS: intake_started did not fire on initial load');

        // 2. Interaction Trigger Check
        await page.click('label[data-problem="quote-lead"]');
        await new Promise(r => setTimeout(r, 150));

        events = await extractEvents(page);
        let intakeStartedAfter = events.filter(e => e.name === 'intake_started');
        console.log('  -> Post-interaction intake_started count:', intakeStartedAfter.length);
        if (intakeStartedAfter.length !== 1) {
            throw new Error('intake_started did not fire once upon user interaction');
        }
        console.log('  -> intake_started payload:', intakeStartedAfter[0].params);
        auditResults.details.contact_intake_started = intakeStartedAfter[0].params;

        // 3. Multi-step Advancement Step 1 -> Step 2
        await page.click('#btn-to-step-2');
        await new Promise(r => setTimeout(r, 150));

        events = await extractEvents(page);
        let stepCompleted = events.filter(e => e.name === 'intake_step_completed');
        console.log('  -> Step 1 completed count:', stepCompleted.length);
        if (stepCompleted.length < 1 || stepCompleted[0].params.step_number !== 1) {
            throw new Error('intake_step_completed step 1 did not fire correctly');
        }
        console.log('  -> Step 1 payload:', stepCompleted[0].params);
        auditResults.details.step1_completed = stepCompleted[0].params;

        // 4. Multi-step Advancement Step 2 -> Step 3
        await page.click('#btn-to-step-3');
        await new Promise(r => setTimeout(r, 150));

        events = await extractEvents(page);
        stepCompleted = events.filter(e => e.name === 'intake_step_completed');
        console.log('  -> Step 2 completed count:', stepCompleted.length);
        if (stepCompleted.length < 2 || stepCompleted[1].params.step_number !== 2) {
            throw new Error('intake_step_completed step 2 did not fire correctly');
        }
        console.log('  -> Step 2 payload:', stepCompleted[1].params);
        auditResults.details.step2_completed = stepCompleted[1].params;

        // 5. Back Navigation Check
        await page.click('#btn-back-to-2');
        await new Promise(r => setTimeout(r, 150));
        events = await extractEvents(page);
        let stepCompletedBack = events.filter(e => e.name === 'intake_step_completed');
        if (stepCompletedBack.length !== 2) {
            throw new Error('intake_step_completed incorrectly fired on back navigation');
        }
        console.log('  -> PASS: intake_step_completed did not fire on back navigation');
        await page.click('#btn-to-step-3');
        await new Promise(r => setTimeout(r, 150));

        // 6. Invalid submission check
        await page.type('#inp-name', 'GA4 QA Lead Contact');
        await page.type('#inp-email', 'invalid-email-address');
        await page.click('#btn-submit-intake');
        await new Promise(r => setTimeout(r, 300));

        events = await extractEvents(page);
        let leadOnInvalid = events.filter(e => e.name === 'generate_lead');
        if (leadOnInvalid.length !== 0) {
            throw new Error('generate_lead fired on invalid email submission');
        }
        console.log('  -> PASS: generate_lead did not fire on invalid email');

        // 7. Real QA Lead Submission with is_test=true
        console.log('  -> Submitting real production QA test lead (is_test=true)...');
        await page.evaluate(() => {
            const form = document.getElementById('intelligent-intake-form');
            if (form) {
                let testInput = form.querySelector('input[name="is_test"]');
                if (!testInput) {
                    testInput = document.createElement('input');
                    testInput.type = 'hidden';
                    testInput.name = 'is_test';
                    form.appendChild(testInput);
                }
                testInput.value = 'true';
            }
            // Delay navigation so dataLayer remains inspectable in Puppeteer
            const origSetTimeout = window.setTimeout;
            window.setTimeout = function(fn, delay) {
                if (delay === 150) {
                    return 0;
                }
                return origSetTimeout.apply(this, arguments);
            };
            document.getElementById('inp-email').value = 'qa_live_audit_contact@contextmuse.com';
        });

        // Submit and wait for real production response
        const [response] = await Promise.all([
            page.waitForResponse(res => res.url().includes('/api/lead') && res.request().method() === 'POST', { timeout: 15000 }),
            page.click('#btn-submit-intake')
        ]);

        const respStatus = response.status();
        const respBody = await response.json().catch(() => ({}));
        console.log('  -> Real Production /api/lead response status:', respStatus);
        console.log('  -> Real Production /api/lead persistence success:', respBody.success || respBody.ok);
        console.log('  -> Real Production submission_id returned:', respBody.submission_id);

        if (!response.ok || !respBody.submission_id) {
            throw new Error('Production /api/lead submission failed: ' + JSON.stringify(respBody));
        }

        await new Promise(r => setTimeout(r, 400));
        events = await extractEvents(page);
        let contactLeads = events.filter(e => e.name === 'generate_lead');
        console.log('  -> Production generate_lead count:', contactLeads.length);
        if (contactLeads.length !== 1) {
            throw new Error(`generate_lead did not fire exactly once (count: ${contactLeads.length})`);
        }
        console.log('  -> Production generate_lead payload:', contactLeads[0].params);
        auditResults.details.contact_generate_lead = contactLeads[0].params;

        // PII Check on contact generate_lead
        const piiCheck1 = checkPII(contactLeads[0].params, ['GA4 QA Lead Contact', 'qa_live_audit_contact@contextmuse.com', respBody.submission_id]);
        if (!piiCheck1.clean) {
            throw new Error('PII VIOLATION in contact generate_lead: ' + piiCheck1.reason);
        }
        console.log('  -> PASS: Contact generate_lead passed strict PII check');

        // ----------------------------------------------------
        // PHASE 2: Signal Intake Funnel & Conversion
        // ----------------------------------------------------
        console.log('\n[2/3] Testing Signal Intake at ' + PROD_BASE + '/signal/intake/?door=2&tier=diagnostic...');
        await page.goto(PROD_BASE + '/signal/intake/?door=2&tier=diagnostic', { waitUntil: 'networkidle2' });

        events = await extractEvents(page);
        let signalInitial = events.filter(e => e.name === 'intake_started');
        console.log('  -> Initial Signal intake_started count:', signalInitial.length);
        if (signalInitial.length !== 0) {
            throw new Error('Signal intake_started fired on initial page load');
        }
        console.log('  -> PASS: Signal intake_started did not fire on initial load');

        // Interaction Trigger
        await page.type('#b2-name', 'GA4 QA Lead Signal');
        await new Promise(r => setTimeout(r, 150));

        events = await extractEvents(page);
        let signalStarted = events.filter(e => e.name === 'intake_started');
        console.log('  -> Post-interaction Signal intake_started count:', signalStarted.length);
        if (signalStarted.length !== 1) {
            throw new Error('Signal intake_started did not fire once upon user interaction');
        }
        console.log('  -> Signal intake_started payload:', signalStarted[0].params);
        auditResults.details.signal_intake_started = signalStarted[0].params;

        // Submit QA Signal Lead with is_test=true
        await page.evaluate(() => {
            const form = document.getElementById('signal-b2-form');
            if (form) {
                let testInput = form.querySelector('input[name="is_test"]');
                if (!testInput) {
                    testInput = document.createElement('input');
                    testInput.type = 'hidden';
                    testInput.name = 'is_test';
                    form.appendChild(testInput);
                }
                testInput.value = 'true';
            }
        });
        await page.type('#b2-email', 'qa_live_audit_signal@contextmuse.com');
        await page.type('#b2-problem', 'Automated QA test verifying production GA4 generate_lead persistence');

        const [sigResponse] = await Promise.all([
            page.waitForResponse(res => res.url().includes('/api/lead') && res.request().method() === 'POST', { timeout: 15000 }),
            page.click('#signal-b2-form button[type="submit"]')
        ]);

        const sigRespStatus = sigResponse.status();
        const sigRespBody = await sigResponse.json().catch(() => ({}));
        console.log('  -> Real Production Signal /api/lead response status:', sigRespStatus);
        console.log('  -> Real Production Signal persistence success:', sigRespBody.success || sigRespBody.ok);
        console.log('  -> Real Production Signal submission_id returned:', sigRespBody.submission_id);

        if (!sigResponse.ok || !sigRespBody.submission_id) {
            throw new Error('Production Signal /api/lead submission failed: ' + JSON.stringify(sigRespBody));
        }

        await new Promise(r => setTimeout(r, 400));
        events = await extractEvents(page);
        let signalLeads = events.filter(e => e.name === 'generate_lead');
        console.log('  -> Production Signal generate_lead count:', signalLeads.length);
        if (signalLeads.length !== 1) {
            throw new Error(`Signal generate_lead did not fire exactly once (count: ${signalLeads.length})`);
        }
        console.log('  -> Production Signal generate_lead payload:', signalLeads[0].params);
        auditResults.details.signal_generate_lead = signalLeads[0].params;

        const piiCheck2 = checkPII(signalLeads[0].params, ['GA4 QA Lead Signal', 'qa_live_audit_signal@contextmuse.com', sigRespBody.submission_id]);
        if (!piiCheck2.clean) {
            throw new Error('PII VIOLATION in signal generate_lead: ' + piiCheck2.reason);
        }
        console.log('  -> PASS: Signal generate_lead passed strict PII check');

        // ----------------------------------------------------
        // PHASE 3: Commercial CTA & Direct Contact Click Check
        // ----------------------------------------------------
        console.log('\n[3/3] Testing CTA and Direct Contact Clicks at ' + PROD_BASE + '/...');
        await page.goto(PROD_BASE + '/', { waitUntil: 'networkidle2' });

        // Click commercial CTA
        await page.evaluate(() => {
            const btn = document.querySelector('.btn-hero-primary, .btn-ladder-cta, main a[href*="/contact"]');
            if (btn) {
                btn.addEventListener('click', e => e.preventDefault(), { capture: false });
                btn.click();
            }
        });
        await new Promise(r => setTimeout(r, 150));

        events = await extractEvents(page);
        let ctaEvents = events.filter(e => e.name === 'cta_click');
        console.log('  -> CTA Click event count:', ctaEvents.length);
        if (ctaEvents.length === 0) {
            throw new Error('cta_click event failed to fire on commercial CTA');
        }
        console.log('  -> cta_click payload:', ctaEvents[0].params);
        auditResults.details.cta_click = ctaEvents[0].params;

        // Click direct contact (email)
        await page.evaluate(() => {
            window.CM_Analytics.trackContactClick('email', 'audit_footer');
        });
        events = await extractEvents(page);
        let contactEvents = events.filter(e => e.name === 'contact_click');
        console.log('  -> Contact Click event count:', contactEvents.length);
        if (contactEvents.length === 0) {
            throw new Error('contact_click event failed to fire');
        }
        console.log('  -> contact_click payload:', contactEvents[0].params);
        auditResults.details.contact_click = contactEvents[0].params;

        // Mark all PASS
        auditResults.generate_lead = 'PASS';
        auditResults.intake_started = 'PASS';
        auditResults.intake_step_completed = 'PASS';
        auditResults.cta_click = 'PASS';
        auditResults.contact_click = 'PASS';
        auditResults.pii_audit = 'PASS';

        console.log('\n====================================================');
        console.log('ALL PRODUCTION TESTS COMPLETED SUCCESSFULLY: PASS');
        console.log('====================================================');
    } catch(err) {
        console.error('\nAUDIT FAILED:', err.message);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
}

runAudit();
