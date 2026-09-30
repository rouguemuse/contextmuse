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
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let cleanUrl = req.url.split('?')[0].replace(/^\/+/, '');
  if (cleanUrl === '' || cleanUrl.endsWith('/')) cleanUrl = path.join(cleanUrl, 'index.html');
  let localPath = path.join(rootDir, cleanUrl);
  if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
    const ext = path.extname(localPath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(localPath).pipe(res);
    return;
  }
  res.writeHead(404);
  res.end('Not found');
});

server.listen(5174, '127.0.0.1', async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle0' });

    const pricingEl = await page.$('#pricing-ladder');
    if (pricingEl) {
      await pricingEl.screenshot({ path: path.join(rootDir, 'scratch', 'homepage_pricing_section.png') });
      console.log('Saved homepage_pricing_section.png');
    }
    await browser.close();
  } catch (e) {
    console.error(e);
  } finally {
    server.close();
    process.exit(0);
  }
});
