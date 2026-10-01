import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import handler from '../api/lead.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

process.env.LEAD_STORAGE_MOCK = 'true';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.woff2': 'font/woff2'
};

function createTestServer() {
  return http.createServer((req, res) => {
    res.status = function(code) {
      this.statusCode = code;
      return this;
    };
    res.json = function(data) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(data));
      return this;
    };

    const url = new URL(req.url, 'http://localhost');
    req.query = Object.fromEntries(url.searchParams.entries());

    // API Route
    if (url.pathname === '/api/lead/' || url.pathname === '/api/lead') {
      let bodyStr = '';
      req.on('data', chunk => { bodyStr += chunk; });
      req.on('end', () => {
        req.body = bodyStr;
        handler(req, res);
      });
      return;
    }

    // Static files
    let reqPath = decodeURIComponent(url.pathname);
    let relPath = reqPath.replace(/^\//, '');
    let targetPath = path.join(projectRoot, relPath);

    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
      targetPath = path.join(targetPath, 'index.html');
    } else if (!fs.existsSync(targetPath) && !path.extname(targetPath)) {
      if (fs.existsSync(targetPath + '.html')) {
        targetPath = targetPath + '.html';
      } else if (fs.existsSync(path.join(targetPath, 'index.html'))) {
        targetPath = path.join(targetPath, 'index.html');
      }
    }

    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
      const ext = path.extname(targetPath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(targetPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });
}

async function runE2ETests() {
  const PORT = 8456;
  const server = createTestServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`[Test Server] Listening on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const screenshotsDir = path.join(projectRoot, 'artifacts_temp');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  let passed = 0;
  let failed = 0;

  function assert(cond, desc) {
    if (cond) {
      console.log(`  ✓ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${desc}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // TEST 1: DESKTOP VIEWPORT & FORM SUBMISSION
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Desktop Viewport (1280x900) ---');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    const interceptedDesktop = [];
    page.on('response', async res => {
      if (res.url().includes('/api/lead')) {
        try {
          const json = await res.json();
          interceptedDesktop.push({ status: res.status(), json });
        } catch {
          // ignore
        }
      }
    });

    await page.goto(`http://localhost:${PORT}/signal/restaurant-data-partner/`, { waitUntil: 'networkidle0' });

    // 1.1 Verify page title and heading
    const title = await page.title();
    assert(title.includes('Restaurant Data Partner Program'), `Page title contains expected text (was: "${title}")`);
    const h1Text = await page.$eval('h1.partner-title', el => el.textContent.trim());
    assert(h1Text === 'Help build Signal. Get a useful restaurant analysis at no charge.', `H1 is "Help build Signal. Get a useful restaurant analysis at no charge." (was: "${h1Text}")`);

    // 1.2 Verify Hero CTAs
    const heroButtons = await page.$$eval('.hero-actions a', els => els.map(e => ({ text: e.textContent.trim(), href: e.getAttribute('href') })));
    assert(heroButtons.length === 2, `Hero has exactly 2 action links (found ${heroButtons.length})`);
    assert(heroButtons[0].text.includes('Apply to become a Data Partner'), `Hero primary button is "Apply to become a Data Partner" (was: "${heroButtons[0]?.text}")`);
    assert(heroButtons[0].href === '#partner-intake', `Primary button links to "#partner-intake" (was: "${heroButtons[0]?.href}")`);
    assert(heroButtons[1].text.includes('See an example Signal report'), `Hero secondary link is "See an example Signal report" (was: "${heroButtons[1]?.text}")`);
    assert(heroButtons[1].href.includes('/signal/sample-reports/'), `Secondary link points to sample reports (was: "${heroButtons[1]?.href}")`);

    // 1.3 Verify no link to paid Signal in hero
    const heroHasPaidSignal = heroButtons.some(b => b.href.includes('#pricing'));
    assert(!heroHasPaidSignal, 'Hero does NOT contain link to paid Signal pricing');

    // 1.4 Verify secondary link to paid Signal exists in commercial section at bottom
    const bottomCommercialLink = await page.$eval('.commercial-path-section a', el => ({ text: el.textContent.trim(), href: el.getAttribute('href') }));
    assert(bottomCommercialLink.href.includes('/signal/#pricing'), `Bottom section links to paid Signal (${bottomCommercialLink.href})`);

    // 1.5 Verify copy requirements
    const pageText = await page.$eval('body', el => el.innerText);
    assert(pageText.includes('Built by Jayme Volstad, drawing on approximately 20 years working across restaurant operations'), 'Contains 20-year founder operational credibility note');
    assert(pageText.includes('whether your available reports match what I’m currently testing'), 'Contains "whether your available reports match what I’m currently testing"');
    assert(pageText.includes('Signal checks whether the pattern points toward configuration, training, workflow or individual activity—and identifies what needs to be verified on the floor.'), 'Contains disciplined epistemological pattern statement');
    assert(pageText.includes('Standard exports (CSV, Excel workbooks, PDF summary sheets, or ZIP folders) are completely sufficient.'), 'Explains exports vs restricted access');
    assert(pageText.includes('POS administrator access is completely unnecessary'), 'Affirms POS administrator access is completely unnecessary');

    // 1.6 Verify accessible accordions work (keyboard & click)
    const faqDetails = await page.$('details.faq-accordion');
    assert(faqDetails !== null, 'FAQ accordion exists on page');
    const initialOpen = await page.evaluate(el => el.open, faqDetails);
    assert(!initialOpen, 'FAQ accordion starts closed');
    await page.click('details.faq-accordion summary');
    const afterClickOpen = await page.evaluate(el => el.open, faqDetails);
    assert(afterClickOpen, 'FAQ accordion opens on click');

    // 1.7 Fill and Submit Intake Form on Desktop
    console.log('Submitting Desktop intake form...');
    await page.type('#dp-restaurant', 'Desktop Test Bistro');
    await page.type('#dp-contact', 'Chef Sarah Desktop');
    await page.type('#dp-email', 'sarah.desktop@testbistro.com');
    await page.type('#dp-pos', 'Toast POS');
    await page.type('#dp-interest', 'Evaluating margin erosion from weekday lunch discounts and modifier pricing.');
    await page.type('#dp-reports', 'Toast PMix CSV, modifier report, discount summary.');
    await page.type('#dp-notes', 'Desktop test execution.');

    // Inject is_test
    await page.evaluate(() => {
      const form = document.getElementById('data-partner-form');
      const testInput = document.createElement('input');
      testInput.type = 'hidden';
      testInput.name = 'is_test';
      testInput.value = 'true';
      form.appendChild(testInput);
    });

    // Click submit
    await page.click('#dp-submit-btn');

    // Wait for success box
    await page.waitForSelector('#dp-success-box', { visible: true, timeout: 5000 });
    const successId = await page.$eval('#dp-sub-id', el => el.textContent.trim());
    assert(successId.length > 5, `Desktop submission succeeded with ID: ${successId}`);

    const intakeSection = await page.$('#partner-intake');
    const desktopScreenshotPath = path.join(screenshotsDir, 'desktop-success.png');
    if (intakeSection) {
      await intakeSection.scrollIntoView();
      await intakeSection.screenshot({ path: desktopScreenshotPath });
    } else {
      await page.screenshot({ path: desktopScreenshotPath, fullPage: false });
    }
    console.log('Saved desktop success screenshot to:', desktopScreenshotPath);

    await page.close();

    // -------------------------------------------------------------
    // TEST 2: MOBILE VIEWPORT (375x812 iPhone X)
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Mobile Viewport (375x812) ---');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

    await mobilePage.goto(`http://localhost:${PORT}/signal/restaurant-data-partner/`, { waitUntil: 'networkidle0' });

    // Verify hero CTA on mobile
    const mobileHeroBtn = await mobilePage.$('.hero-actions a.btn-partner-primary');
    assert(mobileHeroBtn !== null, 'Hero CTA button is rendered on mobile');

    // Click hero button and verify scroll or navigation
    await mobilePage.click('.hero-actions a.btn-partner-primary');
    await new Promise(r => setTimeout(r, 600));

    // Verify form is visible on mobile
    const formVisible = await mobilePage.$eval('#data-partner-form', el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    assert(formVisible, 'Intake form is fully visible and rendered on mobile');

    // Fill form on Mobile
    console.log('Submitting Mobile intake form...');
    await mobilePage.type('#dp-restaurant', 'Mobile Test Trattoria');
    await mobilePage.type('#dp-contact', 'Marco Mobile Operator');
    await mobilePage.type('#dp-email', 'marco.mobile@testtrattoria.com');
    await mobilePage.type('#dp-pos', 'Square for Restaurants');
    await mobilePage.type('#dp-interest', 'Modifier leakage on delivery apps vs dine-in.');
    await mobilePage.type('#dp-reports', 'Square CSV exports.');
    await mobilePage.type('#dp-notes', 'Mobile test run.');

    // Inject is_test
    await mobilePage.evaluate(() => {
      const form = document.getElementById('data-partner-form');
      const testInput = document.createElement('input');
      testInput.type = 'hidden';
      testInput.name = 'is_test';
      testInput.value = 'true';
      form.appendChild(testInput);
    });

    // Click submit
    await mobilePage.click('#dp-submit-btn');

    // Wait for success box
    await mobilePage.waitForSelector('#dp-success-box', { visible: true, timeout: 5000 });
    const mobileSuccessId = await mobilePage.$eval('#dp-sub-id', el => el.textContent.trim());
    assert(mobileSuccessId.length > 5, `Mobile submission succeeded with ID: ${mobileSuccessId}`);

    const mobileIntakeSection = await mobilePage.$('#partner-intake');
    const mobileScreenshotPath = path.join(screenshotsDir, 'mobile-success.png');
    if (mobileIntakeSection) {
      await mobileIntakeSection.scrollIntoView();
      await mobileIntakeSection.screenshot({ path: mobileScreenshotPath });
    } else {
      await mobilePage.screenshot({ path: mobileScreenshotPath, fullPage: false });
    }
    console.log('Saved mobile success screenshot to:', mobileScreenshotPath);

    await mobilePage.close();

  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\n======================================================`);
  console.log(`E2E TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`======================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runE2ETests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
