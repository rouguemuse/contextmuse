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
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
  try {
    let cleanUrl = req.url.split('?')[0].replace(/^\/+/, '');
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
    res.end('Not Found');
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error');
  }
});

server.listen(5189, '127.0.0.1', async () => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://127.0.0.1:5189/', { waitUntil: 'networkidle0' });

    const pricingEl = await page.$('#ways-to-work');
    if (pricingEl) {
      await pricingEl.screenshot({ path: path.join(rootDir, 'scratch', 'homepage_pricing_ladder.png') });
      console.log('Saved homepage_pricing_ladder.png');
    }
    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
    process.exit(0);
  }
});
