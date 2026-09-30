import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  if (!path.extname(reqPath)) {
    if (fs.existsSync(path.join(rootDir, reqPath, 'index.html'))) {
      reqPath = path.join(reqPath, 'index.html');
    } else if (fs.existsSync(path.join(rootDir, reqPath + '.html'))) {
      reqPath += '.html';
    }
  }

  const filePath = path.join(rootDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(4895, async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Desktop Viewport
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:4895/gensort/', { waitUntil: 'load', timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));
    
    // Capture Hero
    const heroEl = await page.$('.product-hero');
    if (heroEl) {
      await heroEl.screenshot({ path: path.resolve(rootDir, 'scratch', 'gensort_landing_hero.png') });
    }

    // Capture Inside the Interface Showcase
    const showcaseEl = await page.$('.showcase-grid');
    if (showcaseEl) {
      await showcaseEl.screenshot({ path: path.resolve(rootDir, 'scratch', 'gensort_landing_showcase.png') });
    }

    // Mobile Viewport
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await page.goto('http://localhost:4895/gensort/', { waitUntil: 'load', timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.resolve(rootDir, 'scratch', 'gensort_landing_mobile.png'), fullPage: false });

    await browser.close();
    console.log('Successfully captured verification screenshots for gensort landing page.');
  } catch (err) {
    console.error('Capture error:', err);
  } finally {
    server.close();
  }
});
