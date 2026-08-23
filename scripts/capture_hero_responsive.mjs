import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const ROOT_DIR = process.cwd();
const PORT = 3890;

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

async function captureHeroScreens() {
    await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
    console.log(`Server listening on http://127.0.0.1:${PORT}`);

    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const viewports = [
        { width: 1440, height: 900, name: 'hero_1440px' },
        { width: 1024, height: 800, name: 'hero_1024px' },
        { width: 768, height: 900, name: 'hero_768px' },
        { width: 390, height: 844, name: 'hero_390px' }
    ];

    const brainDir = 'C:/Users/rougu/.gemini/antigravity/brain/c9fe95e3-68e1-478f-823b-4e2584b213be';

    for (const vp of viewports) {
        await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
        await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'load' });
        await new Promise(r => setTimeout(r, 600));

        const heroEl = await page.$('#portfolio-hero');
        if (heroEl) {
            const outPath = path.join(brainDir, `${vp.name}.png`);
            await heroEl.screenshot({ path: outPath });
            console.log(`Captured hero screenshot at ${vp.width}px: ${outPath}`);
        }
    }

    // Set viewport to 1440px for section captures and full page
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 600));

    // Full page screenshot
    const fullPath = path.join(brainDir, 'homepage_full_1440px.png');
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log(`Captured full page screenshot: ${fullPath}`);

    // Capture sections
    const sections = [
        { id: '#capabilities', name: 'section_capabilities' },
        { id: '#client-proof', name: 'section_proof' },
        { id: '#ways-to-work', name: 'section_ways_to_work' },
        { id: '#products', name: 'section_products' },
        { id: '#approach', name: 'section_method' },
        { id: '#founder', name: 'section_founder' },
        { id: '#creative-practice', name: 'section_creative' },
        { id: '#contact', name: 'section_contact' }
    ];

    for (const sec of sections) {
        const el = await page.$(sec.id);
        if (el) {
            const outPath = path.join(brainDir, `${sec.name}.png`);
            await el.screenshot({ path: outPath });
            console.log(`Captured ${sec.name}: ${outPath}`);
        }
    }

    await browser.close();
    server.close();
    console.log('Done capturing all screenshots.');
}

captureHeroScreens().catch((err) => {
    console.error(err);
    server.close();
    process.exit(1);
});
