import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import http from 'http';

const rootDir = 'C:/Users/rougu/.gemini/antigravity/scratch/contextmuse-homepage';
const artifactsDir = 'C:/Users/rougu/.gemini/antigravity/brain/c9fe95e3-68e1-478f-823b-4e2584b213be';

// Start a tiny local static server
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

server.listen(3928, '127.0.0.1', async () => {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });

        const targets = [
            { url: 'http://127.0.0.1:3928/', out: 'verified_home_desktop.png' },
            { url: 'http://127.0.0.1:3928/systems/', out: 'verified_systems_desktop.png' },
            { url: 'http://127.0.0.1:3928/systems/client-builds/', out: 'verified_client_builds_desktop.png' },
            { url: 'http://127.0.0.1:3928/signal/', out: 'verified_signal_desktop.png' },
            { url: 'http://127.0.0.1:3928/signal/intake/', out: 'verified_signal_intake_desktop.png' }
        ];

        for (const t of targets) {
            await page.goto(t.url, { waitUntil: 'networkidle0' });
            await page.screenshot({ path: path.join(artifactsDir, t.out), fullPage: false });
            console.log('Successfully captured:', t.out);
        }

        await browser.close();
    } catch (err) {
        console.error('Capture error:', err);
    } finally {
        server.close();
        process.exit(0);
    }
});
