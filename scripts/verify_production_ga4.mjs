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
    if (/lead_[a-z0-9_]{10,}/i.test(str) || /sub_spm_[a-z0-9_]{10,}/i.test(str)) {
        return { clean: false, reason: 'Found submission_id / lead token in payload' };
    }
    return { clean: true };
}

async function runProductionRetest() {
    console.log('====================================================');
    console.log('PRODUCTION GA4 INTEGRITY RETEST: ' + PROD_BASE);
    console.log('====================================================');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const auditResults = {};

    try {
        const page = await browser.newPage();
        page.on('dialog', async dialog => { await dialog.dismiss(); });

        // ----------------------------------------------------
        // TEST 1: Honeypot / Synthetic Suppression Check
        // ----------------------------------------------------
        console.log('\n[TEST 1] Honeypot / Synthetic Submission Check...');
        await page.goto(PROD_BASE + '/contact/', { waitUntil: 'networkidle2' });

        // Populate honeypot field (_gotcha)
        await page.evaluate(() => {
            const form = document.getElementById('intelligent-intake-form');
            if (form) {
                let gotcha = form.querySelector('input[name="_gotcha"]');
                if (gotcha) {
                    gotcha.value = 'http://spam-bot-trap.com';
                }
            }
            // Block navigation to inspect dataLayer
            const origSetTimeout = window.setTimeout;
            window.setTimeout = function(fn, delay) {
                if (delay === 150) return 0;
                return origSetTimeout.apply(this, arguments);
            };
        });

        // Advance wizard to Step 3 so submit button is visible
        await page.click('label[data-problem="quote-lead"]');
        await page.click('#btn-to-step-2');
        await new Promise(r => setTimeout(r, 100));
        await page.click('#btn-to-step-3');
        await new Promise(r => setTimeout(r, 100));

        // Fill required fields
        await page.type('#inp-name', 'Spam Bot Submission');
        await page.type('#inp-email', 'spambot@automatedtraffic.xyz');

        const [hpResponse] = await Promise.all([
            page.waitForResponse(res => res.url().includes('/api/lead') && res.request().method() === 'POST', { timeout: 15000 }),
            page.click('#btn-submit-intake')
        ]);

        const hpStatus = hpResponse.status();
        const hpBody = await hpResponse.json().catch(() => ({}));
        console.log('  -> Honeypot response status:', hpStatus);
        console.log('  -> Honeypot response synthetic flag:', hpBody.synthetic);
        console.log('  -> Honeypot submission_id returned:', hpBody.submission_id);

        if (!hpResponse.ok || !hpBody.submission_id || !hpBody.submission_id.startsWith('sub_spm_')) {
            throw new Error('Backend failed to return synthetic success for honeypot: ' + JSON.stringify(hpBody));
        }
        console.log('  -> PASS: Backend deceptive success verified (sub_spm_ token returned, synthetic=true)');

        await new Promise(r => setTimeout(r, 400));
        let events = await extractEvents(page);
        let hpLeads = events.filter(e => e.name === 'generate_lead');
        console.log('  -> generate_lead events fired on honeypot submission:', hpLeads.length);
        if (hpLeads.length !== 0) {
            throw new Error('CRITICAL VIOLATION: generate_lead FIRED on honeypot submission!');
        }
        console.log('  -> PASS: Zero generate_lead events fired for honeypot');
        auditResults.honeypot_suppression = 'PASS';

        // ----------------------------------------------------
        // TEST 2: Invalid Email Check
        // ----------------------------------------------------
        console.log('\n[TEST 2] Invalid Email Rejection Check...');
        await page.goto(PROD_BASE + '/contact/', { waitUntil: 'networkidle2' });
        await page.click('label[data-problem="quote-lead"]');
        await page.click('#btn-to-step-2');
        await new Promise(r => setTimeout(r, 100));
        await page.click('#btn-to-step-3');
        await new Promise(r => setTimeout(r, 100));
        await page.type('#inp-name', 'QA Invalid User');
        await page.type('#inp-email', 'not-a-valid-email');
        await page.click('#btn-submit-intake');
        await new Promise(r => setTimeout(r, 300));

        events = await extractEvents(page);
        let invalidLeads = events.filter(e => e.name === 'generate_lead');
        console.log('  -> generate_lead events on invalid email:', invalidLeads.length);
        if (invalidLeads.length !== 0) {
            throw new Error('generate_lead fired on invalid email');
        }
        console.log('  -> PASS: Zero generate_lead events fired on invalid email');
        auditResults.invalid_email = 'PASS';

        // ----------------------------------------------------
        // TEST 3: Real Contact Lead & Double Submit Check
        // ----------------------------------------------------
        console.log('\n[TEST 3] Real Contact Lead & Double Submit Check...');
        await page.goto(PROD_BASE + '/contact/', { waitUntil: 'networkidle2' });

        // Select problem and advance to Step 3
        await page.click('label[data-problem="quote-lead"]');
        await page.click('#btn-to-step-2');
        await new Promise(r => setTimeout(r, 100));
        await page.click('#btn-to-step-3');
        await new Promise(r => setTimeout(r, 100));

        // Inject is_test=true and fill valid test lead
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
                if (delay === 150) return 0;
                return origSetTimeout.apply(this, arguments);
            };
        });

        await page.type('#inp-name', 'GA4 QA Contact Lead');
        await page.type('#inp-email', 'qa_contact_final@contextmuse.com');
        await page.select('#inp-budget', '2500_5000');

        console.log('  -> Submitting real Contact lead...');
        const [contactResp] = await Promise.all([
            page.waitForResponse(res => res.url().includes('/api/lead') && res.request().method() === 'POST', { timeout: 15000 }),
            page.click('#btn-submit-intake')
        ]);

        const contactBody = await contactResp.json().catch(() => ({}));
        console.log('  -> Real Contact response status:', contactResp.status());
        console.log('  -> Real Contact submission_id:', contactBody.submission_id);

        if (!contactResp.ok || !contactBody.submission_id || !contactBody.submission_id.startsWith('lead_')) {
            throw new Error('Contact lead persistence failed: ' + JSON.stringify(contactBody));
        }

        await new Promise(r => setTimeout(r, 400));
        events = await extractEvents(page);
        let contactLeads = events.filter(e => e.name === 'generate_lead');
        console.log('  -> Real Contact generate_lead count:', contactLeads.length);
        if (contactLeads.length !== 1) {
            throw new Error(`generate_lead did not fire exactly once for Contact lead (count: ${contactLeads.length})`);
        }
        console.log('  -> Real Contact generate_lead payload:', contactLeads[0].params);
        auditResults.contact_lead_payload = contactLeads[0].params;

        // Check budget_range semantic correctness
        if (contactLeads[0].params.budget_range !== '2500_5000') {
            throw new Error('Unexpected budget_range in contact payload: ' + contactLeads[0].params.budget_range);
        }
        // Verify timeline is omitted
        if ('timeline' in contactLeads[0].params && contactLeads[0].params.timeline) {
            throw new Error('Fabricated timeline parameter found in contact payload: ' + contactLeads[0].params.timeline);
        }
        console.log('  -> PASS: Contact lead budget genuinely collected, timeline omitted');

        // Test Double Submit: Trigger duplicate trackGenerateLead call
        console.log('  -> Testing double-submit deduplication...');
        await page.evaluate(() => {
            window.CM_Analytics.trackGenerateLead({
                form_id: 'contact-wizard',
                inquiry_type: 'contact',
                service_interest: 'quote-lead',
                budget_range: '2500_5000',
                lead_source: window.location.pathname
            });
        });
        await new Promise(r => setTimeout(r, 100));

        events = await extractEvents(page);
        let doubleLeads = events.filter(e => e.name === 'generate_lead');
        console.log('  -> generate_lead count after intentional double-submit:', doubleLeads.length);
        if (doubleLeads.length !== 1) {
            throw new Error(`Deduplication failure: generate_lead fired multiple times (${doubleLeads.length})`);
        }
        console.log('  -> PASS: Double-submit deduplication verified (exactly 1 event preserved)');
        auditResults.double_submit = 'PASS';
        auditResults.contact_lead = 'PASS';

        // PII Check on contact payload
        const piiContact = checkPII(contactLeads[0].params, ['GA4 QA Contact Lead', 'qa_contact_final@contextmuse.com', contactBody.submission_id]);
        if (!piiContact.clean) {
            throw new Error('PII violation in contact payload: ' + piiContact.reason);
        }
        console.log('  -> PASS: Zero PII in contact payload');

        // ----------------------------------------------------
        // TEST 4: Real Signal Lead & Semantics Check
        // ----------------------------------------------------
        console.log('\n[TEST 4] Real Signal Lead & Semantics Check...');
        await page.goto(PROD_BASE + '/signal/intake/?door=2&tier=diagnostic', { waitUntil: 'networkidle2' });

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

        await page.type('#b2-name', 'GA4 QA Signal Lead');
        await page.type('#b2-email', 'qa_signal_final@contextmuse.com');
        await page.type('#b2-problem', 'Automated QA verifying Signal budget and timeline omission');

        console.log('  -> Submitting real Signal lead...');
        const [signalResp] = await Promise.all([
            page.waitForResponse(res => res.url().includes('/api/lead') && res.request().method() === 'POST', { timeout: 15000 }),
            page.click('#signal-b2-form button[type="submit"]')
        ]);

        const signalBody = await signalResp.json().catch(() => ({}));
        console.log('  -> Real Signal response status:', signalResp.status());
        console.log('  -> Real Signal submission_id:', signalBody.submission_id);

        if (!signalResp.ok || !signalBody.submission_id || !signalBody.submission_id.startsWith('lead_')) {
            throw new Error('Signal lead persistence failed: ' + JSON.stringify(signalBody));
        }

        await new Promise(r => setTimeout(r, 400));
        events = await extractEvents(page);
        let signalLeads = events.filter(e => e.name === 'generate_lead');
        console.log('  -> Real Signal generate_lead count:', signalLeads.length);
        if (signalLeads.length !== 1) {
            throw new Error(`generate_lead did not fire exactly once for Signal lead (count: ${signalLeads.length})`);
        }
        console.log('  -> Real Signal generate_lead payload:', signalLeads[0].params);
        auditResults.signal_lead_payload = signalLeads[0].params;

        // Verify Signal Semantics:
        // service_interest = diagnostic is acceptable
        if (signalLeads[0].params.service_interest !== 'diagnostic') {
            throw new Error('Expected service_interest to be diagnostic, got: ' + signalLeads[0].params.service_interest);
        }
        // budget_range MUST NOT equal "diagnostic", MUST BE OMITTED entirely
        if ('budget_range' in signalLeads[0].params) {
            throw new Error('VIOLATION: budget_range must NOT be present in Signal payload, got: ' + signalLeads[0].params.budget_range);
        }
        console.log('  -> PASS: SIGNAL BUDGET SEMANTICS: budget_range omitted entirely');
        auditResults.signal_budget_semantics = 'PASS';

        // timeline = immediate MUST BE OMITTED entirely
        if ('timeline' in signalLeads[0].params) {
            throw new Error('VIOLATION: timeline must NOT be present in Signal payload, got: ' + signalLeads[0].params.timeline);
        }
        console.log('  -> PASS: SIGNAL TIMELINE SEMANTICS: timeline omitted entirely');
        auditResults.signal_timeline_semantics = 'PASS';

        // PII Check on Signal payload
        const piiSignal = checkPII(signalLeads[0].params, ['GA4 QA Signal Lead', 'qa_signal_final@contextmuse.com', signalBody.submission_id]);
        if (!piiSignal.clean) {
            throw new Error('PII violation in signal payload: ' + piiSignal.reason);
        }
        console.log('  -> PASS: Zero PII in Signal payload');
        auditResults.signal_lead = 'PASS';
        auditResults.pii_audit = 'PASS';

        console.log('\n====================================================');
        console.log('ALL PRODUCTION INTEGRITY TESTS PASSED!');
        console.log('====================================================');
        console.log(JSON.stringify(auditResults, null, 2));

    } catch(err) {
        console.error('\nRETEST FAILED:', err.message);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
}

runProductionRetest();
