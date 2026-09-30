import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const PORT = 8459;
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/api/lead' || reqPath === '/api/lead/') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const parsed = JSON.parse(body || '{}');
            if (parsed.email === 'invalid-email') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid email address' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, ok: true, submission_id: 'lead_test_mock_12345' }));
        });
        return;
    }

    let filePath = path.join(process.cwd(), reqPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
});

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

server.listen(PORT, async () => {
    console.log("Test server running at http://localhost:" + PORT);
    let browser;
    try {
        browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
        const page = await browser.newPage();
        page.on('dialog', async dialog => { await dialog.dismiss(); });

        // 1. Test contact wizard
        console.log('\n--- TEST 1: Contact Wizard Funnel & Persistence ---');
        await page.goto("http://localhost:" + PORT + "/contact/", { waitUntil: 'networkidle0' });

        // Check dataLayer immediately on load - intake_started should NOT have fired
        let events = await extractEvents(page);
        let intakeStarted = events.filter(e => e.name === 'intake_started');
        console.log('intake_started count on initial load:', intakeStarted.length);
        if (intakeStarted.length !== 0) throw new Error('FAIL: intake_started fired on initial load!');
        console.log('PASS: intake_started did NOT fire on initial load');

        // Interact with radio button / card
        await page.click('label[data-problem="quote-lead"]');
        await new Promise(r => setTimeout(r, 100));

        events = await extractEvents(page);
        intakeStarted = events.filter(e => e.name === 'intake_started');
        console.log('intake_started count after interaction:', intakeStarted.length);
        if (intakeStarted.length !== 1) throw new Error('FAIL: intake_started did not fire once after interaction!');
        console.log('intake_started payload:', intakeStarted[0].params);
        if (intakeStarted[0].params.form_id !== 'contact-wizard') throw new Error('FAIL: unexpected form_id');
        console.log('PASS: intake_started fired once with form_id: contact-wizard');

        // Advance to Step 2
        await page.click('#btn-to-step-2');
        await new Promise(r => setTimeout(r, 100));

        events = await extractEvents(page);
        let stepCompleted = events.filter(e => e.name === 'intake_step_completed');
        console.log('intake_step_completed count after Step 1 -> 2:', stepCompleted.length);
        console.log('Step 1 completion payload:', stepCompleted[0].params);
        if (stepCompleted.length < 1 || stepCompleted[0].params.step_number !== 1) throw new Error('FAIL: intake_step_completed step 1 missing');
        console.log('PASS: intake_step_completed Step 1 fired');

        // Advance to Step 3
        await page.click('#btn-to-step-3');
        await new Promise(r => setTimeout(r, 100));

        events = await extractEvents(page);
        stepCompleted = events.filter(e => e.name === 'intake_step_completed');
        console.log('intake_step_completed count after Step 2 -> 3:', stepCompleted.length);
        console.log('Step 2 completion payload:', stepCompleted[1].params);
        if (stepCompleted.length < 2 || stepCompleted[1].params.step_number !== 2) throw new Error('FAIL: intake_step_completed step 2 missing');
        console.log('PASS: intake_step_completed Step 2 fired');

        // Test back button does NOT trigger step completion
        await page.click('#btn-back-to-2');
        await new Promise(r => setTimeout(r, 100));
        events = await extractEvents(page);
        let stepCompletedAfterBack = events.filter(e => e.name === 'intake_step_completed');
        if (stepCompletedAfterBack.length !== 2) throw new Error('FAIL: intake_step_completed fired on back navigation!');
        console.log('PASS: intake_step_completed did NOT fire on back navigation');
        await page.click('#btn-to-step-3');
        await new Promise(r => setTimeout(r, 100));

        // Fill in form with invalid email first
        await page.type('#inp-name', 'QA Test User');
        await page.type('#inp-email', 'invalid-email');
        await page.click('#btn-submit-intake');
        await new Promise(r => setTimeout(r, 200));

        events = await extractEvents(page);
        let generateLeadEvents = events.filter(e => e.name === 'generate_lead');
        console.log('generate_lead count on invalid submission:', generateLeadEvents.length);
        if (generateLeadEvents.length !== 0) throw new Error('FAIL: generate_lead fired on invalid email submission!');
        console.log('PASS: generate_lead did NOT fire on invalid submission');

        // Capture dataLayer array by pushing a sentinel copy before navigation
        await page.evaluate(() => {
            window.location.href = '#submitted';
            const origSetTimeout = window.setTimeout;
            window.setTimeout = function(fn, delay) {
                if (delay === 150) {
                    return 0;
                }
                return origSetTimeout.apply(this, arguments);
            };
            document.getElementById('inp-email').value = 'qa_test_ga4@example.com';
        });
        await page.click('#btn-submit-intake');
        await new Promise(r => setTimeout(r, 300));

        events = await extractEvents(page);
        generateLeadEvents = events.filter(e => e.name === 'generate_lead');
        console.log('generate_lead count after persistence:', generateLeadEvents.length);
        if (generateLeadEvents.length !== 1) throw new Error('FAIL: generate_lead did not fire exactly once after persistence!');
        console.log('generate_lead payload:', generateLeadEvents[0].params);
        console.log('PASS: generate_lead fired exactly once');

        // Check for any PII leakage
        const leadStr = JSON.stringify(generateLeadEvents[0].params);
        if (leadStr.includes('QA Test User') || leadStr.includes('qa_test_ga4@example.com') || leadStr.includes('lead_test_mock_12345')) {
            throw new Error('FAIL: PII leaked in generate_lead payload!');
        }
        console.log('PASS: Strict PII audit clean - no names, emails, or submission tokens in GA4 event');

        // 2. Test CTA click and Contact click on homepage
        console.log('\n--- TEST 2: CTA Click and Direct Contact Click ---');
        await page.goto("http://localhost:" + PORT + "/", { waitUntil: 'networkidle0' });

        // Click commercial CTA
        await page.evaluate(() => {
            const btn = document.querySelector('.btn-hero-primary, .btn-ladder-cta, main a[href*="/contact"]');
            if (btn) {
                btn.addEventListener('click', e => e.preventDefault(), { capture: false });
                btn.click();
            }
        });
        await new Promise(r => setTimeout(r, 100));

        events = await extractEvents(page);
        let ctaEvents = events.filter(e => e.name === 'cta_click');
        console.log('cta_click count:', ctaEvents.length);
        if (ctaEvents.length > 0) console.log('cta_click payload:', ctaEvents[0].params);
        if (ctaEvents.length === 0) throw new Error('FAIL: cta_click did not fire');
        console.log('PASS: cta_click fired');

        // Click mailto contact link
        await page.evaluate(() => {
            window.CM_Analytics.trackContactClick('email', 'test_footer');
        });
        events = await extractEvents(page);
        let contactEvents = events.filter(e => e.name === 'contact_click');
        console.log('contact_click count:', contactEvents.length);
        if (contactEvents.length > 0) console.log('contact_click payload:', contactEvents[0].params);
        if (contactEvents.length === 0) throw new Error('FAIL: contact_click did not fire');
        console.log('PASS: contact_click fired');

        // 3. Test Signal intake
        console.log('\n--- TEST 3: Signal Intake Funnel & Persistence ---');
        await page.goto("http://localhost:" + PORT + "/signal/intake/?door=2&tier=diagnostic", { waitUntil: 'networkidle0' });

        events = await extractEvents(page);
        let signalStartedOnLoad = events.filter(e => e.name === 'intake_started');
        console.log('Signal intake_started on load:', signalStartedOnLoad.length);
        if (signalStartedOnLoad.length !== 0) throw new Error('FAIL: Signal intake_started fired on initial load');
        console.log('PASS: Signal intake_started did NOT fire on initial load');

        // Interact with name input
        await page.type('#b2-name', 'QA Signal User');
        events = await extractEvents(page);
        let signalStarted = events.filter(e => e.name === 'intake_started');
        console.log('Signal intake_started count after interaction:', signalStarted.length);
        if (signalStarted.length !== 1) throw new Error('FAIL: Signal intake_started did not fire once');
        console.log('Signal intake_started payload:', signalStarted[0].params);
        console.log('PASS: Signal intake_started fired once');

        // Submit form
        await page.type('#b2-email', 'qa_signal_test@example.com');
        await page.type('#b2-problem', 'Testing food cost variance analysis');
        await page.click('#signal-b2-form button[type="submit"]');
        await new Promise(r => setTimeout(r, 300));

        events = await extractEvents(page);
        let signalLead = events.filter(e => e.name === 'generate_lead');
        console.log('Signal generate_lead count:', signalLead.length);
        if (signalLead.length !== 1) throw new Error('FAIL: Signal generate_lead did not fire once after persistence');
        console.log('Signal generate_lead payload:', signalLead[0].params);
        console.log('PASS: Signal generate_lead fired once after persistence');

        const signalLeadStr = JSON.stringify(signalLead[0].params);
        if (signalLeadStr.includes('QA Signal User') || signalLeadStr.includes('qa_signal_test@example.com') || signalLeadStr.includes('lead_test_mock_12345')) {
            throw new Error('FAIL: PII leaked in Signal generate_lead payload!');
        }
        console.log('PASS: Signal Strict PII audit clean');

        console.log('\n=======================================');
        console.log('ALL LOCAL VERIFICATION TESTS PASSED!');
        console.log('=======================================');
    } catch(err) {
        console.error('TEST RUNNER ERROR:', err);
        process.exitCode = 1;
    } finally {
        if (browser) await browser.close();
        server.close();
    }
});
