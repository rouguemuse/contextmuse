import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  try {
    let cleanUrl = req.url.split('?')[0];
    cleanUrl = cleanUrl.replace(/^\/+/, '');
    if (cleanUrl === '' || cleanUrl.endsWith('/')) {
      cleanUrl = path.join(cleanUrl, 'index.html');
    }
    let localPath = path.join(rootDir, cleanUrl);
    if (!fs.existsSync(localPath) && fs.existsSync(localPath + '.html')) {
      localPath += '.html';
    } else if (fs.existsSync(localPath) && fs.statSync(localPath).isDirectory()) {
      localPath = path.join(localPath, 'index.html');
    }

    if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
      const ext = path.extname(localPath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(localPath).pipe(res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found: ' + req.url);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server Error: ' + err.message);
  }
});

server.listen(5173, '127.0.0.1', async () => {
  console.log('Server started on http://127.0.0.1:5173');
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // 1. Desktop Hero & Diagnostic Section
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(rootDir, 'scratch', 'homepage_desktop_funnel.png'), fullPage: false });
    console.log('Saved homepage_desktop_funnel.png');

    // 2. Mobile Viewport
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(rootDir, 'scratch', 'homepage_mobile_funnel.png'), fullPage: false });
    console.log('Saved homepage_mobile_funnel.png');

    // 3. Desktop INNcontrol Proof Section
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const el = document.getElementById('proof-inncontrol');
      if (el) el.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(rootDir, 'scratch', 'homepage_inncontrol_proof_view.png'), fullPage: false });
    console.log('Saved homepage_inncontrol_proof_view.png');

    // 4. Desktop Pricing Ladder
    await page.evaluate(() => {
      const el = document.getElementById('pricing-ladder');
      if (el) el.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(rootDir, 'scratch', 'homepage_pricing_ladder_view.png'), fullPage: false });
    console.log('Saved homepage_pricing_ladder_view.png');

    // 5. Diagnostic Tool Page
    await page.goto('http://127.0.0.1:5173/website-system-check/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(rootDir, 'scratch', 'website_system_check_preview.png'), fullPage: false });
    console.log('Saved website_system_check_preview.png');

    await browser.close();
    console.log('All screenshots rendered and captured perfectly!');
  } catch (err) {
    console.error('Capture failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
