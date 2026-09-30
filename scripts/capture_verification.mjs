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

server.listen(4892, async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Desktop Hero & Diagnostic Section
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:4892/', { waitUntil: 'load', timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.resolve(__dirname, '..', 'scratch', 'homepage_desktop_funnel.png'), fullPage: false });

    // Mobile
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await page.goto('http://localhost:4892/', { waitUntil: 'load', timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.resolve(__dirname, '..', 'scratch', 'homepage_mobile_funnel.png'), fullPage: false });

    // Capture Proof Section on Desktop
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:4892/#proof-section', { waitUntil: 'load', timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));
    const proofEl = await page.$('#proof-section');
    if (proofEl) {
      await proofEl.screenshot({ path: path.resolve(__dirname, '..', 'scratch', 'homepage_proof_section.png') });
    }

    // Capture Pricing Ladder on Desktop
    const pricingEl = await page.$('#pricing-ladder');
    if (pricingEl) {
      await pricingEl.screenshot({ path: path.resolve(__dirname, '..', 'scratch', 'homepage_pricing_section.png') });
    }

    // Diagnostic tool page
    await page.goto('http://localhost:4892/website-system-check/', { waitUntil: 'load', timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.resolve(__dirname, '..', 'scratch', 'website_system_check_preview.png'), fullPage: false });

    await browser.close();
    console.log('Successfully captured all verification screenshots.');
  } catch (err) {
    console.error('Capture error:', err);
  } finally {
    server.close();
  }
});
