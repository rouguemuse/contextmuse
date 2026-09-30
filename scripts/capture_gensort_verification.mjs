import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const PORT = 3892;
const ROOT_DIR = 'C:/Users/rougu/.gemini/antigravity/scratch/contextmuse-homepage';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  if (reqPath.startsWith('/')) reqPath = reqPath.slice(1);

  const filePath = path.join(ROOT_DIR, reqPath);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const folderIndex = path.join(filePath, 'index.html');
    if (fs.existsSync(folderIndex) && fs.statSync(folderIndex).isFile()) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(folderIndex).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${req.url}`);
    }
  }
});

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server started on ${PORT}`);
  try {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // Desktop Viewport
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(`http://127.0.0.1:${PORT}/gensort/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    
    // Screenshot Hero
    const heroEl = await page.$('.product-hero');
    if (heroEl) {
      await heroEl.screenshot({ path: path.join(ROOT_DIR, 'scratch', 'gensort_landing_hero.png') });
      console.log('Saved gensort_landing_hero.png');
    }

    // Screenshot Showcase
    const showcaseEl = await page.$('.showcase-grid');
    if (showcaseEl) {
      await showcaseEl.screenshot({ path: path.join(ROOT_DIR, 'scratch', 'gensort_landing_showcase.png') });
      console.log('Saved gensort_landing_showcase.png');
    }

    // Mobile Viewport
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await page.goto(`http://127.0.0.1:${PORT}/gensort/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ROOT_DIR, 'scratch', 'gensort_landing_mobile.png'), fullPage: false });
    console.log('Saved gensort_landing_mobile.png');

    await browser.close();
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  }
});
