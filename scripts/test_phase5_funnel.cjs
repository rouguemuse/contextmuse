const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Simple static server
const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    const cleanPath = reqPath.replace(/^\/+/, '');
    const filePath = path.resolve(__dirname, '..', cleanPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml'
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end('Not found: ' + reqPath);
    }
});

server.listen(0, async () => {
    const port = server.address().port;
    console.log(`Test server running at http://localhost:${port}`);
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Track console logs and errors
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
        page.on('pageerror', err => console.log('BROWSER PAGEERROR:', err.message));

        console.log('\n--- 1. Testing /website-system-check/ with ?url and UTM params ---');
        const testUrl = `http://localhost:${port}/website-system-check/?url=https%3A%2F%2Fexamplebistro.com&utm_source=explee&utm_medium=outbound&utm_campaign=q4_restaurants`;
        await page.goto(testUrl, { waitUntil: 'networkidle0' });

        // Check input prefilling
        const inputValue = await page.$eval('#target-url', el => el.value);
        console.log('Prefilled input value:', inputValue);
        if (!inputValue.startsWith('https://examplebistro.com')) {
            throw new Error(`Expected input value to start with 'https://examplebistro.com', got '${inputValue}'`);
        }

        // Check banner display
        const bannerVisible = await page.$eval('#prefill-ready-banner', el => el.style.display !== 'none');
        const bannerText = await page.$eval('#prefill-ready-banner', el => el.textContent);
        console.log('Preload banner visible:', bannerVisible);
        console.log('Preload banner text:', bannerText.trim());
        if (!bannerVisible || !bannerText.includes('Ready to check')) {
            throw new Error('Preload status banner was not displayed correctly with target URL');
        }

        // Check that diagnostic did NOT auto-run (results container should not be populated or scanning should not be active)
        const isScanning = await page.evaluate(() => {
            const btn = document.getElementById('run-check-btn');
            return btn.disabled || btn.textContent.includes('Auditing');
        });
        console.log('Is scanning auto-executed:', isScanning);
        if (isScanning) {
            throw new Error('Scan should NOT auto-execute without explicit user action!');
        }

        // Check attribution in sessionStorage
        const storedAttribution = await page.evaluate(() => {
            return JSON.parse(sessionStorage.getItem('cm_attribution') || '{}');
        });
        console.log('Stored campaign attribution in sessionStorage:', storedAttribution);
        if (storedAttribution.utm_source !== 'explee' || storedAttribution.utm_campaign !== 'q4_restaurants') {
            throw new Error('Attribution was not persisted to sessionStorage correctly');
        }

        console.log('\n--- 2. Testing /contact/ attribution passthrough ---');
        await page.goto(`http://localhost:${port}/contact/?service=diagnostic`, { waitUntil: 'domcontentloaded' });

        // Check that diagnostic option is selected
        const selectedProblem = await page.evaluate(() => {
            const radio = document.querySelector('input[name="problem_choice"][value="diagnostic"]');
            return radio ? radio.checked : false;
        });
        console.log('Diagnostic problem radio checked via query param:', selectedProblem);
        if (!selectedProblem) {
            throw new Error('Diagnostic option was not pre-selected on /contact/?service=diagnostic');
        }

        // Check attribution persistence across navigation
        const contactAttribution = await page.evaluate(() => {
            return (window.CM_Analytics && window.CM_Analytics.getAttribution) ? window.CM_Analytics.getAttribution() : {};
        });
        console.log('Attribution persisted to /contact/:', contactAttribution);
        if (contactAttribution.utm_source !== 'explee') {
            throw new Error('Attribution was lost when navigating to /contact/');
        }

        console.log('\n--- 3. Testing /restaurant-systems/ Stack-Neutral Callout ---');
        await page.goto(`http://localhost:${port}/restaurant-systems/`, { waitUntil: 'domcontentloaded' });
        const stackNeutralPresent = await page.evaluate(() => {
            const text = document.body.innerText;
            return text.toLowerCase().includes('stack-neutral architecture') &&
                   text.includes('rip and replace your Point of Sale');
        });
        console.log('Stack-Neutral Architecture callout present:', stackNeutralPresent);
        if (!stackNeutralPresent) {
            throw new Error('Stack-neutral architecture section missing from /restaurant-systems/');
        }

        console.log('\n--- ALL PHASE 5 FUNNEL & POSITIONING INTEGRATION TESTS PASSED ---');
    } finally {
        if (browser) await browser.close();
        server.close();
    }
});
