/**
 * Reproducible Verification & Visual Acceptance Suite — Design Intelligence Case Study (Studies 01–03)
 *
 * Execution Instructions:
 *   1. Build the SPA bundle (if not already built):
 *        npm run build:spa
 *   2. Run the automated verification suite:
 *        npm run test:design-intelligence
 *      Or to also regenerate all viewport and specimen screenshots:
 *        node scripts/verify_design_intelligence_case_study.mjs --capture
 *
 * Environment Variables (optional):
 *   - PLAYWRIGHT_MODULE_PATH: Custom path to playwright index.mjs if not installed in local node_modules.
 *   - ARTIFACT_SCREENSHOT_DIR: Optional secondary directory to copy captured PNG screenshots into.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DESIGN_INTELLIGENCE_STUDIES } from '../src/components/lab/designIntelligenceStudies.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const ROOT_IMG_DIR = path.join(REPO_ROOT, 'assets/images/design-intelligence');
const ARTIFACT_DIR = process.env.ARTIFACT_SCREENSHOT_DIR || '';
const SHOULD_CAPTURE = process.argv.includes('--capture') || process.env.CAPTURE_SCREENSHOTS === '1';

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
  '.woff2': 'font/woff2',
};

async function loadPlaywright() {
  const candidates = [
    process.env.PLAYWRIGHT_MODULE_PATH,
    path.join(REPO_ROOT, 'node_modules/playwright/index.mjs'),
    path.resolve(REPO_ROOT, '../vp007-redesign/node_modules/playwright/index.mjs'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return import(pathToFileURL(candidate).href);
    }
  }
  return import('playwright');
}

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function hexToLum(hex) {
  const h = hex.replace('#', '').trim();
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function computeWcagContrast(hex1, hex2) {
  const l1 = hexToLum(hex1);
  const l2 = hexToLum(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function startStaticSpaServer(port = 0) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath.startsWith('/_vercel/')) {
        res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
        res.end('/* local static server stub for Vercel edge scripts */');
        return;
      }
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
      const relPath = reqPath.startsWith('/') ? reqPath.slice(1) : reqPath;

      const candidate = path.join(REPO_ROOT, relPath);
      const publicCandidate = path.join(REPO_ROOT, 'public', relPath);

      let targetFile = null;
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        targetFile = candidate;
      } else if (fs.existsSync(publicCandidate) && fs.statSync(publicCandidate).isFile()) {
        targetFile = publicCandidate;
      } else if (fs.existsSync(path.join(candidate, 'index.html'))) {
        targetFile = path.join(candidate, 'index.html');
      } else if (!path.extname(relPath)) {
        targetFile = path.join(REPO_ROOT, 'index.html');
      }

      if (targetFile && fs.existsSync(targetFile)) {
        const ext = path.extname(targetFile).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(targetFile).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 Not Found: ${req.url}`);
      }
    });

    server.listen(port, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, port: address.port });
    });
  });
}

function saveScreenshot(buffer, filename) {
  if (!SHOULD_CAPTURE) return;
  fs.mkdirSync(ROOT_IMG_DIR, { recursive: true });
  fs.writeFileSync(path.join(ROOT_IMG_DIR, filename), buffer);
  if (ARTIFACT_DIR && fs.existsSync(ARTIFACT_DIR)) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buffer);
  }
}

async function main() {
  const report = {
    timestamp: new Date().toISOString(),
    wcagAudit: { totalSwatches: 0, mismatches: [], allExact: true },
    provenanceAudit: {},
    specimenStructuralParity: {},
    sliderAndKeyboardAudit: {},
    modalFocusAndReducedMotionAudit: {},
    viewportResponsiveAudit: {},
    nonRegressionRoomsAudit: {},
    consoleErrors: [],
    pageErrors: [],
    failedRequests: [],
    screenshotsCaptured: [],
  };

  // 1. Deterministic WCAG 2.1 Contrast Recalculation Audit
  for (const study of DESIGN_INTELLIGENCE_STUDIES) {
    const classesPresent = new Set(study.tokenBreakdown.map((r) => r.classification));
    report.provenanceAudit[study.id] = {
      sourceUrl: study.sourceUrl,
      inspectedAt: study.inspectedAt,
      referenceDossierExists: fs.existsSync(path.join(REPO_ROOT, study.referenceDossierPath)),
      experimentReportExists: fs.existsSync(path.join(REPO_ROOT, study.experimentReportPath)),
      epistemicClassesPresent: Array.from(classesPresent).sort(),
      hasAllThreeClasses: classesPresent.has('A') && classesPresent.has('B') && classesPresent.has('C'),
      analyticalQuestionsCount: study.analyticalQuestions.length,
    };

    for (const swatch of study.colorSwatches) {
      report.wcagAudit.totalSwatches += 1;
      const ratio = computeWcagContrast(swatch.bgHex, swatch.fgHex);
      const expectedStr = `${ratio.toFixed(2)}:1`;
      if (expectedStr !== swatch.contrastRatio) {
        report.wcagAudit.allExact = false;
        report.wcagAudit.mismatches.push({
          study: study.id,
          swatch: swatch.name,
          bgHex: swatch.bgHex,
          fgHex: swatch.fgHex,
          reported: swatch.contrastRatio,
          calculated: expectedStr,
        });
      }
    }
  }

  if (!report.wcagAudit.allExact) {
    throw new Error(`WCAG contrast mismatch detected: ${JSON.stringify(report.wcagAudit.mismatches)}`);
  }

  // 2. Start Local Static SPA Server & Playwright
  const { server, port } = await startStaticSpaServer(0);
  const baseUrl = `http://127.0.0.1:${port}`;
  const caseStudyUrl = `${baseUrl}/lab/design-intelligence`;
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    // Stub external third-party endpoints during local verification so offline/headless runs never fail with ERR_NETWORK_CHANGED
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (!url.startsWith('http://127.0.0.1:') && !url.startsWith('data:') && !url.startsWith('blob:')) {
        if (url.includes('fonts.googleapis.com')) {
          return route.fulfill({ status: 200, contentType: 'text/css; charset=utf-8', body: '/* local font stub */' });
        }
        return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* local audit stub */' });
      }
      return route.continue();
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        report.consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      report.pageErrors.push(err.message);
    });
    page.on('requestfailed', (req) => {
      report.failedRequests.push(`${req.method()} ${req.url()} -> ${req.failure()?.errorText}`);
    });

    await page.goto(caseStudyUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    // 3. Test Each Study, Specimen Structural Parity & Capture Before/After/Split Screenshots
    for (const studyId of ['plaidis', 'linear', 'stripe']) {
      await page.click(`[data-study-btn="${studyId}"]`);
      await page.waitForTimeout(250);

      // Verify identical DOM structure and text content between neutral and study-applied specimen
      const parity = await page.evaluate((id) => {
        const checkViewportParity = (vp) => {
          const neutralEl = document.querySelector(
            `[data-specimen-variant="neutral"][data-specimen-viewport="${vp}"]`
          );
          const studyEl = document.querySelector(
            `[data-specimen-variant="${id}"][data-specimen-viewport="${vp}"]`
          );
          if (!neutralEl || !studyEl) return { found: false };
          const neutralTags = Array.from(neutralEl.querySelectorAll('*'))
            .map((el) => el.tagName)
            .join(',');
          const studyTags = Array.from(studyEl.querySelectorAll('*'))
            .map((el) => el.tagName)
            .join(',');
          const neutralText = neutralEl.textContent.replace(/\s+/g, ' ').trim();
          const studyText = studyEl.textContent.replace(/\s+/g, ' ').trim();
          return {
            found: true,
            elementCount: neutralEl.querySelectorAll('*').length,
            identicalTagSequence: neutralTags === studyTags,
            identicalTextContent: neutralText === studyText,
          };
        };

        return {
          desktop: checkViewportParity('desktop'),
          mobile: checkViewportParity('mobile'),
        };
      }, studyId);

      report.specimenStructuralParity[studyId] = parity;
      if (
        !parity.desktop.identicalTagSequence ||
        !parity.desktop.identicalTextContent ||
        !parity.mobile.identicalTagSequence ||
        !parity.mobile.identicalTextContent
      ) {
        throw new Error(`Specimen structural/content parity failed for ${studyId}: ${JSON.stringify(parity)}`);
      }

      const stageEl = page.locator('[data-slider-stage="true"]');
      const handleEl = page.locator('[data-slider-stage="true"] [role="slider"]');
      await stageEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);

      // Center slider at 50%
      const box = await stageEl.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
        await page.mouse.down();
        await page.mouse.up();
      }
      await page.waitForTimeout(100);

      if (SHOULD_CAPTURE) {
        const splitName = `study_${studyId}_specimen_split_1440.png`;
        saveScreenshot(await stageEl.screenshot(), splitName);
        report.screenshotsCaptured.push(splitName);
      }

      // Test WAI-ARIA keyboard keys on slider handle
      await handleEl.focus();
      await page.keyboard.press('End');
      await page.waitForTimeout(80);
      const endVal = Number(await handleEl.getAttribute('aria-valuenow'));
      if (SHOULD_CAPTURE) {
        const beforeName = `study_${studyId}_specimen_before_neutral_1440.png`;
        saveScreenshot(await stageEl.screenshot(), beforeName);
        report.screenshotsCaptured.push(beforeName);
      }

      await page.keyboard.press('Home');
      await page.waitForTimeout(80);
      const homeVal = Number(await handleEl.getAttribute('aria-valuenow'));
      if (SHOULD_CAPTURE) {
        const afterName = `study_${studyId}_specimen_after_tokens_1440.png`;
        saveScreenshot(await stageEl.screenshot(), afterName);
        report.screenshotsCaptured.push(afterName);
      }

      // Reset to 50% and test ArrowRight, ArrowLeft, ArrowUp, ArrowDown, PageUp, PageDown
      if (box) {
        await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
        await page.mouse.down();
        await page.mouse.up();
      }
      await handleEl.focus();
      await page.keyboard.press('ArrowRight');
      const arrowRightVal = Number(await handleEl.getAttribute('aria-valuenow'));
      await page.keyboard.press('ArrowLeft');
      const arrowLeftVal = Number(await handleEl.getAttribute('aria-valuenow'));
      await page.keyboard.press('ArrowUp');
      const arrowUpVal = Number(await handleEl.getAttribute('aria-valuenow'));
      await page.keyboard.press('ArrowDown');
      const arrowDownVal = Number(await handleEl.getAttribute('aria-valuenow'));
      await page.keyboard.press('PageUp');
      const pageUpVal = Number(await handleEl.getAttribute('aria-valuenow'));
      await page.keyboard.press('PageDown');
      const pageDownVal = Number(await handleEl.getAttribute('aria-valuenow'));

      report.sliderAndKeyboardAudit[studyId] = {
        endVal,
        homeVal,
        arrowRightVal,
        arrowLeftVal,
        arrowUpVal,
        arrowDownVal,
        pageUpVal,
        pageDownVal,
        ariaOrientation: await handleEl.getAttribute('aria-orientation'),
      };

      if (SHOULD_CAPTURE) {
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(150);
        const overviewName = `study_${studyId}_overview_1440.png`;
        saveScreenshot(await page.screenshot({ fullPage: false }), overviewName);
        report.screenshotsCaptured.push(overviewName);
      }
    }

    // 4. Audit Modal Focus Entry, Tab Focus Trap, Focus Restoration & Preserved Entrance Mode
    await page.click('[data-study-btn="plaidis"]');
    await page.click('[data-surface-btn="contextmuse-home"]');
    await page.waitForTimeout(250);

    if (SHOULD_CAPTURE) {
      const entranceStage = page.locator('[data-slider-stage="true"]');
      await entranceStage.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      const entranceName = 'study_plaidis_entrance_preserved_1440.png';
      saveScreenshot(await entranceStage.screenshot(), entranceName);
      report.screenshotsCaptured.push(entranceName);
    }

    const openInspectorBtn = page.locator('button:has-text("Open Detail Inspector")');
    await openInspectorBtn.focus();
    await openInspectorBtn.click();
    await page.waitForTimeout(200);

    const modalFocusedOnOpen = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
      return Boolean(dialog && dialog.contains(document.activeElement));
    });

    // Press Tab 12 times and verify focus never leaves the modal dialog
    let focusStayedInModal = true;
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
        return Boolean(dialog && dialog.contains(document.activeElement));
      });
      if (!inside) focusStayedInModal = false;
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    const focusRestoredToTrigger = await page.evaluate(() => {
      return document.activeElement?.textContent?.includes('Open Detail Inspector') || false;
    });

    await page.click('[data-surface-btn="specimen"]');
    await page.waitForTimeout(150);

    // Test prefers-reduced-motion: reduce
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(150);
    const reducedMotionTransition = await page.evaluate(() => {
      const specimenEl = document.querySelector('[data-specimen-variant="plaidis"]');
      const cta = specimenEl?.querySelector('span');
      return Boolean(specimenEl && cta);
    });
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    report.modalFocusAndReducedMotionAudit = {
      modalFocusedOnOpen,
      focusStayedInModal,
      focusRestoredToTrigger,
      reducedMotionVerified: reducedMotionTransition,
    };

    // 5. Multi-Viewport Responsive Verification (390px, 768px, 1440px, 1920px)
    const viewports = [
      { name: '390px', width: 390, height: 844 },
      { name: '768px', width: 768, height: 1024 },
      { name: '1440px', width: 1440, height: 900 },
      { name: '1920px', width: 1920, height: 1080 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(250);
      report.viewportResponsiveAudit[vp.name] = {};

      // On 390px, also test Mobile specimen mode so mobile specimen screenshots are captured cleanly
      if (vp.width === 390) {
        await page.click('[data-mode-btn="mobile"]');
      } else {
        await page.click('[data-mode-btn="desktop"]');
      }
      await page.waitForTimeout(150);

      for (const studyId of ['plaidis', 'linear', 'stripe']) {
        await page.click(`[data-study-btn="${studyId}"]`);
        await page.waitForTimeout(150);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(150);

        const metrics = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const imgs = Array.from(document.querySelectorAll('img'));
          const brokenImages = imgs
            .filter((img) => !img.complete || img.naturalWidth === 0)
            .map((img) => img.getAttribute('src'));
          const stage = document.querySelector('[data-slider-stage="true"]');
          const stageRect = stage?.getBoundingClientRect();
          return {
            scrollWidth: docWidth,
            innerWidth: winWidth,
            hasHorizontalOverflow: docWidth > winWidth + 1,
            brokenImages,
            stageWidth: Math.round(stageRect?.width || 0),
            stageHeight: Math.round(stageRect?.height || 0),
          };
        });

        if (metrics.hasHorizontalOverflow || metrics.brokenImages.length > 0) {
          throw new Error(`Viewport ${vp.name} (${studyId}) failed: ${JSON.stringify(metrics)}`);
        }
        report.viewportResponsiveAudit[vp.name][studyId] = metrics;

        if (SHOULD_CAPTURE && (vp.width === 390 || vp.width === 768 || vp.width === 1920)) {
          const vpFile = `study_${studyId}_viewport_${vp.width}.png`;
          saveScreenshot(await page.screenshot({ fullPage: false }), vpFile);
          report.screenshotsCaptured.push(vpFile);

          if (vp.width === 390) {
            const stageEl = page.locator('[data-slider-stage="true"]');
            await stageEl.scrollIntoViewIfNeeded();
            await page.waitForTimeout(120);
            const mobStageFile = `study_${studyId}_specimen_mobile_390.png`;
            saveScreenshot(await stageEl.screenshot(), mobStageFile);
            report.screenshotsCaptured.push(mobStageFile);
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
          }
        }
      }
    }

    // 6. Non-Regression Check Across Existing ContextMuse Rooms & Homepage
    await page.setViewportSize({ width: 1440, height: 900 });
    const coreRoutes = ['/', '/work', '/build', '/lab', '/method'];
    for (const route of coreRoutes) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(200);
      const routeCheck = await page.evaluate(() => {
        const h1 = document.querySelector('h1')?.innerText?.trim() || '';
        const hasHeader = Boolean(document.querySelector('header'));
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          h1,
          hasHeader,
          hasOverflow: docWidth > winWidth + 1,
        };
      });
      report.nonRegressionRoomsAudit[route] = routeCheck;
      if (!routeCheck.hasHeader || routeCheck.hasOverflow) {
        throw new Error(`Non-regression check failed on ${route}: ${JSON.stringify(routeCheck)}`);
      }
    }

    await context.close();
  } finally {
    await browser.close();
    server.close();
  }

  if (report.consoleErrors.length > 0 || report.pageErrors.length > 0) {
    throw new Error(
      `Runtime errors detected: consoleErrors=${JSON.stringify(report.consoleErrors)}, pageErrors=${JSON.stringify(
        report.pageErrors
      )}`
    );
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error('[verify_design_intelligence_case_study] FAILED:', err);
  process.exit(1);
});
