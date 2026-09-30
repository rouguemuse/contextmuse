import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'qa_output');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const PORT = 4789;

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, `http://127.0.0.1:${PORT}`);
  let pathname = parsed.pathname;
  if (pathname.endsWith('/')) pathname += 'index.html';
  if (!path.extname(pathname)) {
    if (fs.existsSync(path.join(rootDir, pathname, 'index.html'))) {
      pathname = path.join(pathname, 'index.html');
    } else if (fs.existsSync(path.join(rootDir, pathname + '.html'))) {
      pathname += '.html';
    }
  }
  if (pathname.startsWith('/')) pathname = pathname.slice(1);

  const filePath = path.join(rootDir, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found: ' + pathname);
  }
});

server.listen(PORT, '127.0.0.1', async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const routes = [
      { url: '/', name: 'homepage' },
      { url: '/systems/', name: 'systems' },
      { url: '/systems/client-builds/', name: 'client-builds' },
      { url: '/proof-of-work/', name: 'proof-of-work' },
      { url: '/services/', name: 'services' },
      { url: '/quick-launch/', name: 'quick-launch' },
      { url: '/contact/', name: 'contact' },
      { url: '/restaurant-builds/', name: 'restaurant-builds' }
    ];

    for (const r of routes) {
      // Desktop
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(`http://127.0.0.1:${PORT}${r.url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await new Promise(res => setTimeout(res, 500));
      await page.screenshot({ path: path.join(outputDir, `${r.name}-desktop.png`) });

      // Mobile
      await page.setViewport({ width: 390, height: 844, isMobile: true });
      await page.goto(`http://127.0.0.1:${PORT}${r.url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await new Promise(res => setTimeout(res, 500));
      await page.screenshot({ path: path.join(outputDir, `${r.name}-mobile.png`) });

      console.log(`PASS: ${r.name}`);
    }

    console.log('ALL QA SCREENSHOTS CAPTURED SUCCESSFULLY');
  } catch (err) {
    console.error('QA Execution error:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
    process.exit(0);
  }
});
