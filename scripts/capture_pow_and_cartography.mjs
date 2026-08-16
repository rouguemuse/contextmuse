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

server.listen(3939, '127.0.0.1', async () => {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
        });
        const page = await browser.newPage();

        // 1. Proof of Work Desktop (1440x900)
        await page.setViewport({ width: 1440, height: 900 });
        await page.goto('http://127.0.0.1:3939/proof-of-work/', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: path.join(artifactsDir, 'pow_restructure_desktop.png'), fullPage: false });
        console.log('Captured pow_restructure_desktop.png');

        // 2. Standalone Cartography Fullscreen App (1440x900)
        await page.goto('http://127.0.0.1:3939/cartography/', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 600));
        await page.screenshot({ path: path.join(artifactsDir, 'cartography_standalone_app_desktop.png'), fullPage: false });
        console.log('Captured cartography_standalone_app_desktop.png');

        // 3. Proof of Work Mobile (390x844)
        await page.setViewport({ width: 390, height: 844, isMobile: true });
        await page.goto('http://127.0.0.1:3939/proof-of-work/', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: path.join(artifactsDir, 'pow_restructure_mobile.png'), fullPage: false });
        console.log('Captured pow_restructure_mobile.png');

        await browser.close();
    } catch (err) {
        console.error('Capture error:', err);
    } finally {
        server.close();
        process.exit(0);
    }
});
