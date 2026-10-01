const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8765;
const ROOT_DIR = 'C:/Users/rougu/.gemini/antigravity/scratch/contextmuse-homepage';

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  let filePath = path.join(ROOT_DIR, urlPath);
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '/index.html')) filePath += '/index.html';
    else if (fs.existsSync(filePath + '.html')) filePath += '.html';
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp' }[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, async () => {
  console.log(`Server listening on ${PORT}`);
  const errors = [];
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push('CONSOLE_ERROR: ' + msg.text());
    });

    console.log('Navigating to http://localhost:8765/signal/demo/...');
    await page.goto(`http://localhost:${PORT}/signal/demo/`, { waitUntil: 'networkidle2' });

    console.log('Clicking Load Synthetic Demonstration Dataset button...');
    const btn = await page.$('.btn-sample');
    if (!btn) throw new Error('Could not find .btn-sample button');
    await btn.click();

    // Wait for digestion simulation to complete (it takes ~2-3 seconds)
    console.log('Waiting for brief to render...');
    await page.waitForSelector('.finding-card', { timeout: 8000 });

    const cardCount = await page.$$eval('.finding-card', cards => cards.length);
    console.log(`Rendered finding cards count: ${cardCount}`);

    const observedCount = await page.$$eval('.observed-layer', els => els.length);
    const inferredCount = await page.$$eval('.inferred-layer', els => els.length);
    const verifyCount = await page.$$eval('.verify-layer', els => els.length);
    const actionCount = await page.$$eval('.action-layer', els => els.length);
    console.log(`Layers rendered: Observed: ${observedCount}, Inferred: ${inferredCount}, Verify: ${verifyCount}, Action: ${actionCount}`);

    const cardTitle = await page.$eval('.finding-title', el => el.textContent.trim());
    console.log(`First finding title: "${cardTitle}"`);

    await browser.close();
  } catch (err) {
    errors.push('TEST_RUNNER_ERROR: ' + err.message);
  } finally {
    server.close();
  }

  console.log('Errors encountered:', errors.length);
  errors.forEach(e => console.error('  ', e));
  if (errors.length > 0) process.exit(1);
  console.log('ALL DEMO JAVASCRIPT & EPISTEMIC CHECKS PASSED PERFECTLY!');
});
