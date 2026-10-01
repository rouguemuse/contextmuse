const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

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

        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });
        page.on('pageerror', err => errors.push(err.message));

        console.log('\n--- 1. Testing Desktop View (1280x800) ---');
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(`http://localhost:${port}/signal/`, { waitUntil: 'networkidle0' });

        const desktopChecks = await page.evaluate(() => {
            const body = document.body.innerText;
            return {
                h1Text: document.querySelector('h1').innerText,
                hasPositioningKicker: body.includes('Decision compression for operators already drowning in reports'),
                hasIntersections: body.includes('Looking at intersections, not isolated spreadsheets') && body.includes('Labor Rosters & Overtime'),
                hasEpistemic4Layers: body.includes('01 // OBSERVED') && body.includes('02 // INFERRED') && body.includes('03 // VERIFY') && body.includes('04 // ACTION CANDIDATE'),
                hasCallout: body.includes('A beautifully analyzed list of 25 problems is still 25 problems. Signal is designed to reduce the list.'),
                hasDimensions: body.toLowerCase().includes('1. financial exposure') && body.toLowerCase().includes('4. implementation friction') && body.toLowerCase().includes('5. decision priority'),
                hasSampleOutput: body.includes('PRIORITY 01') && body.includes('Peak-period margin leakage') && body.includes('~$1,200 – $1,800 / mo'),
                hasValidationStatus: body.includes('WORKING SYSTEM • ACTIVE EXTERNAL VALIDATION'),
                hasValidationReviewsOffer: body.includes('Signal Validation Reviews') && body.includes('3–5 referred restaurants') && body.includes('not the full paid Signal Diagnostic'),
                hasOperatorCred: body.includes('Built from both sides of the screen') && body.includes('two decades of direct restaurant operating experience'),
                hasPricing: body.includes('$149') && body.includes('$595') && body.includes('$195'),
                hasNoCausalClaims: !body.includes('this caused') && !body.includes('this directly produced') && !body.includes('the system knows why')
            };
        });

        console.log('Desktop checks:', desktopChecks);
        for (const [key, val] of Object.entries(desktopChecks)) {
            if (!val) throw new Error(`Desktop check failed: ${key}`);
        }

        console.log('\n--- 2. Testing Mobile View (375x667) ---');
        await page.setViewport({ width: 375, height: 667 });
        await page.goto(`http://localhost:${port}/signal/`, { waitUntil: 'networkidle0' });

        const mobileChecks = await page.evaluate(() => {
            const navToggle = document.getElementById('nav-toggle-btn');
            const sampleCard = document.querySelector('.sample-finding-card');
            const h1 = document.querySelector('h1');
            return {
                hasNavToggle: !!navToggle,
                sampleCardRendered: !!sampleCard && sampleCard.offsetWidth > 0,
                h1Visible: !!h1 && h1.offsetWidth > 0
            };
        });
        console.log('Mobile checks:', mobileChecks);
        for (const [key, val] of Object.entries(mobileChecks)) {
            if (!val) throw new Error(`Mobile check failed: ${key}`);
        }

        if (errors.length > 0) {
            console.error('Browser errors encountered:', errors);
            throw new Error(`Encountered ${errors.length} browser errors.`);
        }

        console.log('\nALL SIGNAL PAGE QA & VERIFICATION CHECKS PASSED PERFECTLY!');
    } finally {
        if (browser) await browser.close();
        server.close();
    }
});
