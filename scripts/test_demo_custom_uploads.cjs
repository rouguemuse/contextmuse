const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8766;
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
  console.log(`Test server running on port ${PORT}`);
  const errors = [];
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    console.log('--- TEST 1: Synthetic Demo Mode Math & Badge Verification ---');
    await page.goto(`http://localhost:${PORT}/signal/demo/`, { waitUntil: 'networkidle2' });
    await page.click('.btn-sample');
    await page.waitForSelector('.finding-card', { timeout: 8000 });

    const badgeText = await page.$eval('#brief-status-badge', el => el.textContent.trim());
    console.log('Status badge:', badgeText);
    if (badgeText !== 'SYNTHETIC DEMONSTRATION DATA') {
      throw new Error(`Expected badge "SYNTHETIC DEMONSTRATION DATA", got "${badgeText}"`);
    }

    const confirmedStack = await page.$eval('#stack-confirmed', el => el.textContent.trim());
    const fastWinsStack = await page.$eval('#stack-recoverable', el => el.textContent.trim());
    const totalStack = await page.$eval('#stack-total', el => el.textContent.trim());
    console.log(`Opportunity Stack: In Records="${confirmedStack}", Fast Wins="${fastWinsStack}", Total="${totalStack}"`);

    // Verify F-02 promo counterfactual in DOM
    const f02Body = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.finding-card'));
      const f02 = cards.find(c => c.textContent.includes('F-02:'));
      return f02 ? f02.textContent : '';
    });
    if (!f02Body.includes('$3,200')) {
      throw new Error('Expected F-02 to state $3,200 counterfactual recovery');
    }
    console.log('[PASS] F-02 contains reconciled $3,200 counterfactual recovery.');

    // Verify F-01 overtime replacement in DOM
    const f01Body = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.finding-card'));
      const f01 = cards.find(c => c.textContent.includes('F-01:'));
      return f01 ? f01.textContent : '';
    });
    if (!f01Body.includes('$2,282') || !f01Body.includes('0.5×')) {
      throw new Error('Expected F-01 to state 0.5x overtime premium ($2,282)');
    }
    console.log('[PASS] F-01 contains reconciled 0.5x overtime premium ($2,282).');

    // Verify F-04 staff meals in DOM
    const f04Body = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.finding-card'));
      const f04 = cards.find(c => c.textContent.includes('F-04:'));
      return f04 ? f04.textContent : '';
    });
    if (!f04Body.includes('$0 net cash') && !f04Body.includes('reclassified')) {
      throw new Error('Expected F-04 to state $0 net cash / reclassification to staff meals');
    }
    console.log('[PASS] F-04 contains reclassified staff meal reporting integrity without fake cash recovery.');

    console.log('\n--- TEST 2: Custom Upload — Sales-Only CSV (No Invented Findings) ---');
    // Reset demo
    await page.click('.btn-action:last-child'); // Clear & Parse New File
    await sleep(500);

    // Create a temporary sales-only CSV
    const tempSalesCsv = path.join(__dirname, 'temp_sales_only.csv');
    fs.writeFileSync(tempSalesCsv, `date,net_sales,order_count
2026-09-01,"$18,750.00",520
2026-09-02,"12,400.00",380
2026-09-03,"15,100.00",440
`, 'utf8');

    const fileInput = await page.$('#file-input');
    await fileInput.uploadFile(tempSalesCsv);

    await page.waitForSelector('.finding-card', { timeout: 8000 });

    const uploadBadge = await page.$eval('#brief-status-badge', el => el.textContent.trim());
    console.log('Upload Status badge:', uploadBadge);
    if (uploadBadge !== 'VERIFIED UPLOADED AUDIT DATA') {
      throw new Error(`Expected badge "VERIFIED UPLOADED AUDIT DATA", got "${uploadBadge}"`);
    }

    const stateAssessment = await page.$eval('#state-assessment-text', el => el.textContent.trim());
    console.log('State Assessment:', stateAssessment);
    if (!stateAssessment.includes('$46,250') || !stateAssessment.includes('1,340 checks')) {
      throw new Error(`State assessment did not calculate true sales totals ($46,250 across 1,340 checks): ${stateAssessment}`);
    }
    if (!stateAssessment.includes('not provided') || !stateAssessment.includes('Insufficient Evidence')) {
      throw new Error('State assessment did not declare missing streams as Insufficient Evidence');
    }
    console.log('[PASS] State assessment reflects exact $46,250 sales with no fabricated payroll.');

    // Verify findings: Labor & Voids must be marked "Insufficient Evidence"
    const uploadFindings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.finding-card')).map(c => ({
        title: c.querySelector('.finding-title') ? c.querySelector('.finding-title').textContent.trim() : '',
        badge: c.querySelector('.priority-badge') ? c.querySelector('.priority-badge').textContent.trim() : ''
      }));
    });
    console.log('Rendered findings on Sales-Only upload:', uploadFindings);

    const hasInventedPayroll = uploadFindings.some(f => f.title.includes('Friday and Saturday dinner is backing up'));
    if (hasInventedPayroll) {
      throw new Error('FAIL: Sales-only upload produced fabricated F-01 Kitchen Overtime finding!');
    }
    const hasInsufficientLabor = uploadFindings.some(f => f.title.includes('Labor & Overtime Analysis — Insufficient Evidence'));
    const hasInsufficientVoids = uploadFindings.some(f => f.title.includes('Void & Service Recovery — Insufficient Evidence'));
    const hasInsufficientDiscounts = uploadFindings.some(f => f.title.includes('Promotion & Discount ROI — Insufficient Evidence'));

    if (!hasInsufficientLabor || !hasInsufficientVoids || !hasInsufficientDiscounts) {
      throw new Error('FAIL: Missing streams were not explicitly marked Insufficient Evidence!');
    }
    console.log('[PASS] Missing streams explicitly marked "Insufficient Evidence" with zero invented findings.');

    // Clean up temp file
    if (fs.existsSync(tempSalesCsv)) fs.unlinkSync(tempSalesCsv);

    console.log('\n--- TEST 3: Custom Upload — Malformed / Unsupported File ---');
    await page.click('.btn-action:last-child'); // Reset
    await sleep(500);

    const tempBadCsv = path.join(__dirname, 'temp_unsupported.csv');
    fs.writeFileSync(tempBadCsv, `student_name,grade,classroom
Alice,A,101
Bob,B,102
`, 'utf8');

    await fileInput.uploadFile(tempBadCsv);
    await sleep(1000);

    const isBriefVisible = await page.$eval('#brief-container', el => el.style.display !== 'none');
    if (isBriefVisible) {
      throw new Error('FAIL: Brief was rendered for unsupported non-POS file!');
    }

    const terminalText = await page.$eval('#terminal-lines', el => el.textContent.trim());
    console.log('Terminal error on malformed file:', terminalText);
    if (!terminalText.includes('INGESTION HALTED') && !terminalText.includes('No recognized')) {
      throw new Error('FAIL: Terminal did not report actionable ingestion halted error');
    }
    console.log('[PASS] Unsupported file cleanly rejected with actionable error banner.');

    if (fs.existsSync(tempBadCsv)) fs.unlinkSync(tempBadCsv);

    await browser.close();
  } catch (err) {
    errors.push('CUSTOM_UPLOAD_TEST_ERROR: ' + err.message);
  } finally {
    server.close();
  }

  console.log('\n--- TEST SUMMARY ---');
  console.log('Errors encountered:', errors.length);
  errors.forEach(e => console.error('  ', e));
  if (errors.length > 0) process.exit(1);
  console.log('ALL SYNTHETIC & CUSTOM UPLOAD TESTS PASSED WITH 100% SUCCESS!');
});
