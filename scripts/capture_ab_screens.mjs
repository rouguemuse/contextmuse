import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import http from 'http';

const rootDir = 'C:/Users/rougu/.gemini/antigravity/scratch/contextmuse-homepage';
const artifactsDir = 'C:/Users/rougu/.gemini/antigravity/brain/c9fe95e3-68e1-478f-823b-4e2584b213be';

const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/' || reqPath === '') reqPath = 'index.html';
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    if (reqPath.startsWith('/')) reqPath = reqPath.slice(1);
    const filePath = path.join(rootDir, reqPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.jpg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml'
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end('Not Found: ' + filePath);
    }
});

server.listen(3930, '127.0.0.1', async () => {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
        });
        const page = await browser.newPage();

        // 1. Services Desktop (1440x900)
        await page.setViewport({ width: 1440, height: 900 });
        await page.goto('http://127.0.0.1:3930/services/', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: path.join(artifactsDir, 'preview_services_desktop.png'), fullPage: false });
        console.log('Captured preview_services_desktop.png');

        // 2. Services Mobile (390x844)
        await page.setViewport({ width: 390, height: 844, isMobile: true });
        await page.goto('http://127.0.0.1:3930/services/', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: path.join(artifactsDir, 'preview_services_mobile.png'), fullPage: false });
        console.log('Captured preview_services_mobile.png');

        // 3. Homepage Desktop - Focus on Ways to Work Section (1440x900)
        await page.setViewport({ width: 1440, height: 900 });
        await page.goto('http://127.0.0.1:3930/#ways-to-work', { waitUntil: 'networkidle0' });
        await page.evaluate(() => {
            const el = document.getElementById('ways-to-work');
            if (el) el.scrollIntoView();
        });
        await new Promise(r => setTimeout(r, 400));
        await page.screenshot({ path: path.join(artifactsDir, 'preview_homepage_offers_desktop.png'), fullPage: false });
        console.log('Captured preview_homepage_offers_desktop.png');

        // 4. Homepage Mobile - Focus on Ways to Work Section (390x844)
        await page.setViewport({ width: 390, height: 844, isMobile: true });
        await page.goto('http://127.0.0.1:3930/#ways-to-work', { waitUntil: 'networkidle0' });
        await page.evaluate(() => {
            const el = document.getElementById('ways-to-work');
            if (el) el.scrollIntoView();
        });
        await new Promise(r => setTimeout(r, 400));
        await page.screenshot({ path: path.join(artifactsDir, 'preview_homepage_offers_mobile.png'), fullPage: false });
        console.log('Captured preview_homepage_offers_mobile.png');

        await browser.close();
    } catch (err) {
        console.error('Capture error:', err);
    } finally {
        server.close();
        process.exit(0);
    }
});
