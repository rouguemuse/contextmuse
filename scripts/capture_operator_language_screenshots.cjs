const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.cjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  const filePath = path.join(__dirname, '..', reqPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + reqPath);
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(8799, async () => {
  console.log('Server started on 8799');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const artifactDir = 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\c9fe95e3-68e1-478f-823b-4e2584b213be';

  // 1. Sample Reports Page Hero & Findings
  console.log('Capturing sample reports page...');
  await page.goto('http://localhost:8799/signal/sample-reports/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(artifactDir, 'sample_reports_hero.png'), clip: { x: 0, y: 0, width: 1440, height: 1100 } });
  
  // Scroll down to findings in Sample Reports
  const findingEl = await page.$('#findings');
  if (findingEl) {
    const box = await findingEl.boundingBox();
    if (box) {
      await page.screenshot({ path: path.join(artifactDir, 'sample_reports_findings.png'), clip: { x: 0, y: Math.max(0, box.y - 50), width: 1440, height: 1200 } });
    }
  }

  // 2. Demo Page with loaded state
  console.log('Capturing demo page...');
  await page.goto('http://localhost:8799/signal/demo/', { waitUntil: 'networkidle0' });
  await page.click('.btn-sample');
  await page.waitForSelector('.finding-card');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'demo_operator_language.png'), clip: { x: 0, y: 200, width: 1440, height: 1200 } });

  // 3. Landing page Depth Levels
  console.log('Capturing signal landing page depth levels...');
  await page.goto('http://localhost:8799/signal/#same-data-depth', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  const depthEl = await page.$('#same-data-depth');
  if (depthEl) {
    const box = await depthEl.boundingBox();
    if (box) {
      await page.screenshot({ path: path.join(artifactDir, 'signal_landing_depth_levels.png'), clip: { x: 0, y: Math.max(0, box.y - 20), width: 1440, height: 1100 } });
    }
  }

  // 4. Landing page Comparison Table
  console.log('Capturing comparison table...');
  const compEl = await page.$('#comparison');
  if (compEl) {
    const box = await compEl.boundingBox();
    if (box) {
      await page.screenshot({ path: path.join(artifactDir, 'signal_comparison_table.png'), clip: { x: 0, y: Math.max(0, box.y - 20), width: 1440, height: 950 } });
    }
  }

  console.log('Screenshots captured successfully!');
  await browser.close();
  server.close();
  process.exit(0);
});
