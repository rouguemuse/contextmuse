import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const ROOT_DIR = process.cwd();
const PORT = 3892;

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

async function capturePreview() {
    await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
    console.log(`Server listening on http://127.0.0.1:${PORT}`);

    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const brainDir = 'C:/Users/rougu/.gemini/antigravity/brain/c9fe95e3-68e1-478f-823b-4e2584b213be';

    // 1. Desktop 1440px
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(`http://127.0.0.1:${PORT}/preview/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(brainDir, 'preview_full_1440px.png'), fullPage: true });
    console.log('Captured preview_full_1440px.png');

    const heroEl = await page.$('#portfolio-hero');
    if (heroEl) {
        await heroEl.screenshot({ path: path.join(brainDir, 'preview_hero_1440px.png') });
    }

    const selWorkEl = await page.$('#selected-work');
    if (selWorkEl) {
        await selWorkEl.screenshot({ path: path.join(brainDir, 'preview_selected_work_1440px.png') });
    }

    const rangeEl = await page.$('#range');
    if (rangeEl) {
        await rangeEl.screenshot({ path: path.join(brainDir, 'preview_range_1440px.png') });
    }

    const whatIDoEl = await page.$('#what-i-do');
    if (whatIDoEl) {
        await whatIDoEl.screenshot({ path: path.join(brainDir, 'preview_what_i_do_1440px.png') });
    }

    const aboutEl = await page.$('#about-jayme');
    if (aboutEl) {
        await aboutEl.screenshot({ path: path.join(brainDir, 'preview_about_1440px.png') });
    }

    const contactEl = await page.$('#contact');
    if (contactEl) {
        await contactEl.screenshot({ path: path.join(brainDir, 'preview_contact_1440px.png') });
    }

    // 2. Mobile 390px
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(`http://127.0.0.1:${PORT}/preview/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(brainDir, 'preview_mobile_390px.png'), fullPage: true });
    console.log('Captured preview_mobile_390px.png');

    await browser.close();
    server.close();
    console.log('Preview capture complete.');
}

capturePreview().catch(err => {
    console.error(err);
    process.exit(1);
});