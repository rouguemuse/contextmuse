const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 3335;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath.endsWith('/')) {
        reqPath += 'index.html';
    }
    const filePath = path.join(ROOT_DIR, reqPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

async function runTests() {
    await new Promise(r => server.listen(PORT, r));
    console.log(`Server listening on http://localhost:${PORT}`);

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const viewports = [
        { width: 1440, height: 900, name: '1440x900_desktop' },
        { width: 1280, height: 800, name: '1280x800_desktop' },
        { width: 1024, height: 768, name: '1024x768_tablet' },
        { width: 390, height: 844, name: '390x844_mobile' }
    ];

    const outDir = path.join(ROOT_DIR, 'scratch', 'screenshots');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    for (const vp of viewports) {
        await page.setViewport({ width: vp.width, height: vp.height });
        await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

        const metrics = await page.evaluate(() => {
            const container = document.querySelector('.container');
            const heroTitle = document.querySelector('.hero-title');
            const heroContainer = document.querySelector('.hero-container');
            const offersGrid = document.querySelector('.offers-grid');
            const processFlow = document.querySelector('.process-flow-container');
            const dualGrid = document.querySelector('.hp-dual-grid');
            const contactGrid = document.querySelector('.hp-contact-grid');

            const getComputedCols = (el) => el ? window.getComputedStyle(el).gridTemplateColumns : 'N/A';
            const getFontSize = (el) => el ? window.getComputedStyle(el).fontSize : 'N/A';
            const getWidth = (el) => el ? window.getComputedStyle(el).width : 'N/A';

            return {
                containerWidth: getWidth(container),
                heroTitleFontSize: getFontSize(heroTitle),
                heroCols: getComputedCols(heroContainer),
                offersCols: getComputedCols(offersGrid),
                processCols: getComputedCols(processFlow),
                dualCols: getComputedCols(dualGrid),
                contactCols: getComputedCols(contactGrid)
            };
        });

        console.log(`\n=== Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
        console.log(`- Container Width: ${metrics.containerWidth}`);
        console.log(`- Hero Title Font Size: ${metrics.heroTitleFontSize}`);
        console.log(`- Hero Grid: ${metrics.heroCols}`);
        console.log(`- Offers Grid: ${metrics.offersCols}`);
        console.log(`- Process Flow Grid: ${metrics.processCols}`);
        console.log(`- Dual Branches Grid: ${metrics.dualCols}`);
        console.log(`- Contact Grid: ${metrics.contactCols}`);

        const shotPath = path.join(outDir, `${vp.name}.png`);
        await page.screenshot({ path: shotPath, fullPage: true });
        console.log(`- Saved full page screenshot: ${shotPath}`);
    }

    await browser.close();
    server.close();
    console.log('\nAll viewport tests completed successfully.');
}

runTests().catch(err => {
    console.error(err);
    process.exit(1);
});
