const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('C:\\Users\\rougu\\.gemini\\antigravity\\scratch\\node_modules\\puppeteer');

const projectRoot = 'C:\\Users\\rougu\\.gemini\\antigravity\\scratch\\contextmuse-homepage';

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  let filePath = path.join(projectRoot, reqPath);
  
  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }
  
  const ext = path.extname(filePath).toLowerCase();
  const mimeMap = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };
  
  res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4896, async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4896/brand/', { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 400));
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 300));
  });
  
  const artifactPath = path.resolve('C:\\Users\\rougu\\.gemini\\antigravity\\brain\\c9fe95e3-68e1-478f-823b-4e2584b213be\\scratch\\brand_family_specimen.png');
  await page.screenshot({ path: artifactPath, fullPage: true });
  console.log('Captured brand_family_specimen.png');

  await browser.close();
  server.close();
});
