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

server.listen(3937, '127.0.0.1', async () => {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
        });
        const page = await browser.newPage();

        // 1. Full Homepage Desktop (1440x900 viewport)
        await page.setViewport({ width: 1440, height: 900 });
        await page.goto('http://127.0.0.1:3937/', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: path.join(artifactsDir, 'stage4_homepage_desktop_hero_capabilities.png'), fullPage: false });

        // Scroll to proof & production
        await page.evaluate(() => {
            const el = document.querySelector('.hp-proof-section');
            if (el) el.scrollIntoView();
        });
        await new Promise(r => setTimeout(r, 400));
        await page.screenshot({ path: path.join(artifactsDir, 'stage4_homepage_desktop_production_proof.png'), fullPage: false });

        // 2. Full Homepage Mobile (390x844)
        await page.setViewport({ width: 390, height: 844, isMobile: true });
        await page.goto('http://127.0.0.1:3937/', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: path.join(artifactsDir, 'stage4_homepage_mobile_hero.png'), fullPage: false });

        await browser.close();
    } catch (err) {
        console.error('Capture error:', err);
    } finally {
        server.close();
        process.exit(0);
    }
});
