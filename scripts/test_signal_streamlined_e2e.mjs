import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  const filePath = path.join(__dirname, '..', reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(9876, async () => {
  console.log('Testing streamlined /signal/ at http://localhost:9876/signal/ ...');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('requestfailed', req => {
    errors.push(`Request failed: ${req.url()} (${req.failure()?.errorText})`);
  });
  page.on('response', resp => {
    if (resp.status() >= 400) {
      console.log(`Resource 404/error: ${resp.url()} (${resp.status()})`);
    }
  });
  page.on('pageerror', err => errors.push(err.message));

  // --- 1. DESKTOP TEST (1440x900) ---
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:9876/signal/', { waitUntil: 'networkidle0' });

  console.log('Testing Desktop 1440px...');

  // Check 1: Title and Canonical
  const title = await page.title();
  console.log('Title:', title);
  if (!title.includes('Signal')) throw new Error('Incorrect title');

  // Check 2: Trust strip
  const trustItems = await page.$$('.hero-trust-item');
  console.log('Trust strip items count:', trustItems.length);
  if (trustItems.length !== 4) throw new Error('Expected 4 trust items');

  // Check 3: Horizontal rail scrolling
  const railInitialScroll = await page.$eval('#findings-rail', el => el.scrollLeft);
  await page.click('#rail-next');
  await new Promise(r => setTimeout(r, 400));
  const railScrolled = await page.$eval('#findings-rail', el => el.scrollLeft);
  console.log(`Rail scroll: ${railInitialScroll} -> ${railScrolled}`);
  if (railScrolled <= railInitialScroll) throw new Error('Rail next button did not scroll');

  await page.click('#rail-prev');
  await new Promise(r => setTimeout(r, 400));
  const railBack = await page.$eval('#findings-rail', el => el.scrollLeft);
  console.log(`Rail back scroll: ${railBack}`);

  // Check 4: Interactive Report Viewer Tab Switching
  const tabs = ['tab-revenue', 'tab-discounts', 'tab-menu', 'tab-operations', 'tab-overview'];
  for (const tabId of tabs) {
    await page.click(`#${tabId}`);
    await new Promise(r => setTimeout(r, 200));
    const activePanelId = await page.$eval('.report-panel.active', el => el.id);
    const expectedPanel = tabId.replace('tab-', 'panel-');
    if (activePanelId !== expectedPanel) {
      throw new Error(`Tab click on ${tabId} failed to activate ${expectedPanel}, got ${activePanelId}`);
    }
    console.log(`Tab ${tabId} activated ${activePanelId} successfully.`);
  }

  // Check 5: Disclosures (Progressive disclosure)
  const disclosures = ['disclosure-categories', 'disclosure-files', 'disclosure-deliverables'];
  for (const discId of disclosures) {
    const wasOpen = await page.$eval(`#${discId}`, el => el.open);
    await page.click(`#${discId} summary`);
    const isOpen = await page.$eval(`#${discId}`, el => el.open);
    console.log(`Disclosure ${discId}: wasOpen=${wasOpen} -> isOpen=${isOpen}`);
    if (wasOpen === isOpen) throw new Error(`Disclosure ${discId} failed to toggle`);
  }

  // Check 6: Pricing Grid (All 4 simultaneously visible)
  const pricingCards = await page.$$('.pricing-tier-card');
  console.log('Pricing tier cards count:', pricingCards.length);
  if (pricingCards.length !== 4) throw new Error('Expected 4 pricing cards');

  const prices = await page.$$eval('.pricing-tier-card', els => els.map(e => e.innerText));
  const has195 = prices.some(p => p.includes('$195'));
  const has595 = prices.some(p => p.includes('$595'));
  const has1250 = prices.some(p => p.includes('$1,250'));
  const has249 = prices.some(p => p.includes('$249'));
  console.log(`Prices verified: $195=${has195}, $595=${has595}, $1,250=${has1250}, $249=${has249}`);
  if (!has195 || !has595 || !has1250 || !has249) throw new Error('Missing pricing tier');

  // Check 7: FAQ Accordion
  const faqCount = await page.$$eval('.faq-card', els => els.length);
  console.log('FAQ items count:', faqCount);
  if (faqCount < 8) throw new Error('Expected at least 8 FAQ items');

  // Click Q1 then Q2, ensure toggle works
  await page.click('.faq-card:nth-child(1) summary');
  await new Promise(r => setTimeout(r, 200));
  const q1Open = await page.$eval('.faq-card:nth-child(1)', el => el.open);
  await page.click('.faq-card:nth-child(2) summary');
  await new Promise(r => setTimeout(r, 200));
  const q2Open = await page.$eval('.faq-card:nth-child(2)', el => el.open);
  console.log(`FAQ toggle: Q1 open=${q1Open}, Q2 open=${q2Open}`);

  // Take screenshot of desktop
  await page.screenshot({ path: 'scripts/screenshot_signal_desktop.png', fullPage: false });

  // --- 2. MOBILE TEST (390x844) ---
  console.log('Testing Mobile 390px...');
  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle0' });

  // Check body overflow (must be 0!)
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile horizontal overflow detected:', overflow);
  if (overflow) throw new Error('Horizontal page overflow detected on mobile!');

  // Check rail card width on mobile
  const cardWidth = await page.$eval('.rail-card', el => el.getBoundingClientRect().width);
  console.log('Mobile rail card width:', cardWidth);
  if (cardWidth > 350 || cardWidth < 250) {
    throw new Error('Mobile card width out of expected responsive range');
  }

  // Take screenshot of mobile
  await page.screenshot({ path: 'scripts/screenshot_signal_mobile.png', fullPage: false });

  console.log('Errors logged:', errors);
  if (errors.length > 0) throw new Error('Console errors encountered');

  console.log('ALL STREAMLINED SIGNAL E2E TESTS PASSED PERFECTLY!');
  await browser.close();
  server.close();
});
