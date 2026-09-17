const puppeteer = require('C:\\Users\\rougu\\.gemini\\antigravity\\scratch\\node_modules\\puppeteer');
const path = require('path');
const fs = require('fs');

const outputDir = path.resolve('C:\\Users\\rougu\\.gemini\\antigravity\\scratch\\contextmuse-homepage\\assets\\images');

async function renderAssets() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // -------------------------------------------------------------
  // 1. Revision Atlas Spread (1400 x 875) - Dominant AST Workbench + Overlapping Details
  // -------------------------------------------------------------
  await page.setViewport({ width: 1400, height: 875, deviceScaleFactor: 2 });
  await page.setContent(`
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1400px; height: 875px;
    background: #0E1F1B;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
    color: #FAF9F5;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;
  }
  .top-bar {
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid rgba(250, 249, 245, 0.1);
    padding-bottom: 14px;
  }
  .dots { display: flex; gap: 7px; align-items: center; }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: #2A443D; }
  .dot.red { background: #E05252; }
  .dot.yellow { background: #EAB308; }
  .dot.green { background: #10B981; }
  .title-tag {
    font-family: monospace; font-size: 13px; color: #C5A059;
    letter-spacing: 0.08em; font-weight: 600;
  }
  .status-pill {
    background: rgba(15, 118, 110, 0.3); border: 1px solid #0F766E;
    color: #5EEAD4; font-size: 11px; padding: 4px 10px; border-radius: 4px;
    font-family: monospace; font-weight: 600;
  }
  .main-grid {
    display: grid;
    grid-template-columns: 1.4fr 0.9fr;
    gap: 24px;
    height: 700px;
  }
  .manuscript-pane {
    background: #142723;
    border: 1px solid rgba(250, 249, 245, 0.12);
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .pane-header {
    display: flex; justify-content: space-between; align-items: center;
    font-family: monospace; font-size: 11px; color: rgba(250, 249, 245, 0.6);
    border-bottom: 1px solid rgba(250, 249, 245, 0.08); padding-bottom: 10px;
  }
  .text-content {
    font-family: "Georgia", serif;
    font-size: 17px;
    line-height: 1.7;
    color: #FAF9F5;
  }
  .diff-del {
    background: rgba(224, 82, 82, 0.25);
    color: #FCA5A5;
    text-decoration: line-through;
    padding: 2px 4px;
    border-radius: 3px;
  }
  .diff-add {
    background: rgba(16, 185, 129, 0.25);
    color: #6EE7B7;
    font-weight: 600;
    padding: 2px 4px;
    border-radius: 3px;
  }
  .side-stack {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .card-detail {
    background: #152A25;
    border: 1px solid rgba(250, 249, 245, 0.12);
    border-radius: 8px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .card-title {
    font-family: monospace; font-size: 11px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: #C5A059;
  }
  .telemetry-row {
    display: flex; justify-content: space-between; align-items: center;
    font-family: monospace; font-size: 13px;
    border-bottom: 1px solid rgba(250, 249, 245, 0.06);
    padding-bottom: 6px;
  }
  .lineage-graph {
    display: flex; align-items: center; gap: 8px; font-family: monospace; font-size: 11px;
    margin-top: 6px;
  }
  .lineage-node {
    padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(250, 249, 245, 0.2);
    background: rgba(0,0,0,0.2);
  }
  .lineage-node.active {
    border-color: #C5A059; background: rgba(197, 160, 89, 0.15); color: #FAF9F5; font-weight: 700;
  }
  .footer-caption {
    display: flex; justify-content: space-between; font-family: monospace; font-size: 11px;
    color: rgba(250, 249, 245, 0.5); padding-top: 4px;
  }
</style>
</head>
<body>
  <div class="top-bar">
    <div class="dots">
      <div class="dot red"></div>
      <div class="dot yellow"></div>
      <div class="dot green"></div>
      <span class="title-tag" style="margin-left: 10px;">revision-atlas // structural-manuscript-workbench</span>
    </div>
    <div class="status-pill">100% OFFLINE-FIRST · LOCAL PRIVACY</div>
  </div>

  <div class="main-grid">
    <div class="manuscript-pane">
      <div class="pane-header">
        <span>ACTIVE VARIANT BRANCH [V3 PASS]</span>
        <span>SCENE #42 // 82,450w MANUSCRIPT</span>
      </div>
      <div class="text-content">
        The border crossing was <span class="diff-add">concentrated into a single choice: surrender the ledger or cross without papers</span>. The threshold was not a line drawn on an atlas, but an administrative vacuum where records ceased to exist.
      </div>
      <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(250, 249, 245, 0.08); border-radius: 6px; padding: 14px; margin-top: 8px;">
        <div style="font-family: monospace; font-size: 10px; color: #C5A059; margin-bottom: 6px; text-transform: uppercase;">AST Semantic Decomposition</div>
        <p style="font-family: monospace; font-size: 12px; color: #94A3B8; line-height: 1.5;">
          Node #148: Narrative Turn (High Tension) &bull; Character Intent: Surrender vs Escape &bull; Pacing Delta: +14% velocity
        </p>
      </div>
      <div class="footer-caption" style="margin-top: auto;">
        <span>INGESTION: DETERMINISTIC AST</span>
        <span>MEMORY: 128MB ZERO-CLOUD</span>
      </div>
    </div>

    <div class="side-stack">
      <!-- What Changed -->
      <div class="card-detail" style="border-left: 3px solid #E05252;">
        <div class="card-title" style="color: #F87171;">▼ WHAT CHANGED (V2 &rarr; V3 PASS)</div>
        <div style="font-size: 12px; font-family: monospace; color: #CBD5E1; line-height: 1.4;">
          <span class="diff-del">stalled by three chapters of travel logistics</span> &rarr; concentrated action trigger.
        </div>
      </div>

      <!-- What Survived -->
      <div class="card-detail" style="border-left: 3px solid #10B981;">
        <div class="card-title" style="color: #34D399;">▲ WHAT SURVIVED</div>
        <div style="font-size: 12px; font-family: monospace; color: #CBD5E1; line-height: 1.4;">
          The threshold was not a line on a map, but an administrative vacuum. (100% Retained)
        </div>
      </div>

      <!-- Version Lineage Tree -->
      <div class="card-detail">
        <div class="card-title">LINEAGE GRAPH &bull; NON-DESTRUCTIVE TREES</div>
        <div class="lineage-graph">
          <div class="lineage-node">v1 Raw Draft</div>
          <span>&rarr;</span>
          <div class="lineage-node">v2 Structural</div>
          <span>&rarr;</span>
          <div class="lineage-node active">v3 Staged Pass</div>
        </div>
        <div class="telemetry-row" style="margin-top: 8px;">
          <span style="color: rgba(250,249,245,0.6);">Pacing Velocity</span>
          <strong style="color: #34D399;">89% (Optimal)</strong>
        </div>
        <div class="telemetry-row">
          <span style="color: rgba(250,249,245,0.6);">Dialogue Ratio</span>
          <strong>44% (Kinetic)</strong>
        </div>
        <div class="telemetry-row" style="border: none;">
          <span style="color: rgba(250,249,245,0.6);">Continuity Score</span>
          <strong style="color: #C5A059;">98.2% Preserved</strong>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `);
  await page.screenshot({ path: path.join(outputDir, 'revision-atlas-spread.webp') });
  console.log('Rendered revision-atlas-spread.webp');

  // -------------------------------------------------------------
  // 2. Website Audit Evidence Spread (1200 x 750) - Bright Audited Website + Diagnostic Pin + Evidence Drawer
  // -------------------------------------------------------------
  await page.setViewport({ width: 1200, height: 750, deviceScaleFactor: 2 });
  await page.setContent(`
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px; height: 750px;
    background: #EAE6DF;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    padding: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
  }
  .browser-mockup {
    width: 620px;
    height: 690px;
    background: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.12);
    border: 1px solid #D1D5DB;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .browser-header {
    background: #F3F4F6;
    border-bottom: 1px solid #E5E7EB;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .b-dot { width: 8px; height: 8px; border-radius: 50%; background: #D1D5DB; }
  .b-url {
    background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 4px;
    padding: 3px 12px; font-family: monospace; font-size: 11px; color: #4B5563;
    flex: 1; margin-left: 6px;
  }
  .site-body {
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .site-hero-title {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    line-height: 1.2;
  }
  .site-hero-desc {
    font-size: 14px;
    color: #4B5563;
    line-height: 1.5;
  }
  .site-action-row {
    display: flex;
    gap: 12px;
    margin-top: 8px;
    position: relative;
  }
  .btn-sample-primary {
    background: #0F766E; color: #FFF; padding: 12px 24px; border-radius: 4px;
    font-weight: 600; font-size: 14px; border: none;
  }
  .btn-sample-secondary {
    background: #F3F4F6; color: #111827; padding: 12px 20px; border-radius: 4px;
    font-weight: 600; font-size: 14px; border: 1px solid #D1D5DB;
  }
  /* Issue Pin Overlay */
  .diagnostic-pin {
    position: absolute;
    top: -14px; left: 110px;
    background: #E05252;
    color: #FFF;
    font-family: monospace;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(224, 82, 82, 0.4);
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 10;
  }
  .diagnostic-box {
    position: absolute;
    top: -6px; left: -6px; right: 140px; bottom: -6px;
    border: 2px dashed #E05252;
    background: rgba(224, 82, 82, 0.08);
    border-radius: 6px;
    pointer-events: none;
  }

  /* Overlapping Evidence Drawer */
  .evidence-drawer {
    width: 480px;
    background: #0E1F1B;
    border-radius: 8px;
    border: 1px solid rgba(250, 249, 245, 0.2);
    box-shadow: 0 20px 50px rgba(14, 31, 27, 0.4);
    color: #FAF9F5;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: absolute;
    right: 40px;
    top: 70px;
    z-index: 20;
  }
  .drawer-header {
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid rgba(250, 249, 245, 0.1); padding-bottom: 10px;
    font-family: monospace; font-size: 11px; color: #C5A059; font-weight: 700;
  }
  .drawer-finding {
    background: rgba(224, 82, 82, 0.15);
    border-left: 3px solid #E05252;
    padding: 10px 14px;
    border-radius: 3px;
    font-family: monospace; font-size: 12px; color: #FCA5A5;
  }
  .code-block {
    background: #081210;
    border: 1px solid rgba(250, 249, 245, 0.1);
    border-radius: 4px;
    padding: 12px;
    font-family: monospace; font-size: 11px; color: #5EEAD4;
    line-height: 1.5;
  }
  .recipe-box {
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid #0F766E;
    padding: 10px 14px;
    border-radius: 4px;
    font-family: monospace; font-size: 11px; color: #6EE7B7;
  }
  .annotation-bar {
    position: absolute;
    bottom: 24px;
    left: 40px;
    background: #0E1F1B;
    border: 1px solid rgba(250, 249, 245, 0.15);
    padding: 8px 16px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 11px;
    font-weight: 700;
    color: #C5A059;
    letter-spacing: 0.08em;
  }
</style>
</head>
<body>
  <!-- Audited Website Mockup -->
  <div class="browser-mockup">
    <div class="browser-header">
      <div class="b-dot"></div>
      <div class="b-dot"></div>
      <div class="b-dot"></div>
      <div class="b-url">https://client-preview.com/waste-logistics/</div>
    </div>
    <div class="site-body">
      <div style="font-family: monospace; font-size: 11px; color: #0F766E; font-weight: 700; text-transform: uppercase;">Direct Roll-Off Dispatch</div>
      <div class="site-hero-title">Commercial &amp; Residential Dumpster Service in DFW</div>
      <div class="site-hero-desc">Select sizing and get instant transparent flat-rate pricing for 15, 20, and 25-yard containers without phone call delays.</div>

      <div class="site-action-row">
        <div class="diagnostic-box"></div>
        <div class="diagnostic-pin">
          <span>● PIN #1</span>
          <span>Tap Collision &bull; 24px Gap</span>
        </div>
        <button class="btn-sample-primary">Get Instant Quote &rarr;</button>
        <button class="btn-sample-secondary">Pricing Info</button>
      </div>

      <div style="margin-top: 30px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 18px;">
        <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px; color: #111827;">15-Yard Container</div>
        <div style="font-size: 20px; font-weight: 800; color: #0F766E;">$385 Flat Rate</div>
        <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">Includes 3-day rental &bull; 2 tons disposal included</div>
      </div>
    </div>
  </div>

  <!-- Overlapping Evidence Drawer -->
  <div class="evidence-drawer">
    <div class="drawer-header">
      <span>EVIDENCE DRAWER &bull; ISSUE #01</span>
      <span style="color: #E05252;">SEVERITY: P0 BLOCKER</span>
    </div>
    <div class="drawer-finding">
      <strong>Touch Target Tap Collision [x: 48, y: 382]</strong><br>
      Mobile primary action overlaps secondary toggle on 390px viewports, causing 34% drop-off.
    </div>
    <div class="code-block">
      // DOM Coordinate &amp; Selector Pin<br>
      Selector: <code>.hero-action-row &gt; button.btn-primary</code><br>
      BoundingRect: <code>{ width: 184, height: 48, top: 382 }</code><br>
      CLS Impact: <code>0.24 (Failing Threshold)</code>
    </div>
    <div class="recipe-box">
      <strong>✓ 5-Day Remediation Recipe:</strong><br>
      Add <code>margin-bottom: 16px;</code> on mobile breakpoint; expand tap target boundary to minimum 48px standard.
    </div>
  </div>

  <div class="annotation-bar">
    FINDING &rarr; EVIDENCE &rarr; REMEDIATION
  </div>
</body>
</html>
  `);
  await page.screenshot({ path: path.join(outputDir, 'website-audit-evidence-spread.webp') });
  console.log('Rendered website-audit-evidence-spread.webp');

  // -------------------------------------------------------------
  // 3. The Opportunity Funnel Spread (1200 x 750) - Qualification, Score, and Spec
  // -------------------------------------------------------------
  await page.setViewport({ width: 1200, height: 750, deviceScaleFactor: 2 });
  await page.setContent(`
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px; height: 750px;
    background: #0B192C;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
    color: #FAF9F5;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;
  }
  .header-row {
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 12px;
  }
  .funnel-pipeline {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 24px;
    height: 600px;
  }
  .pane {
    background: #112240;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .score-badge {
    background: rgba(30, 64, 175, 0.3);
    border: 1.5px solid #3B82F6;
    border-radius: 6px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .score-num {
    font-size: 38px; font-weight: 800; color: #38BDF8; line-height: 1;
  }
  .spec-box {
    background: #08121E;
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: 6px;
    padding: 16px;
    font-size: 12px;
    line-height: 1.6;
    color: #94A3B8;
  }
  .spec-box strong { color: #FAF9F5; }
  .btn-funnel {
    background: #2563EB; color: #FAF9F5; font-weight: 700; font-size: 13px;
    padding: 12px; border-radius: 4px; border: none; text-align: center;
  }
</style>
</head>
<body>
  <div class="header-row">
    <div style="font-family: monospace; font-size: 12px; color: #38BDF8; font-weight: 700;">
      THE OPPORTUNITY FUNNEL // PROSPECT INTELLIGENCE &bull; CALIBRATION &bull; BRIEF GENERATION
    </div>
    <div style="font-family: monospace; font-size: 11px; color: #94A3B8;">
      SIGNALS &rarr; QUALIFICATION &rarr; OPPORTUNITY
    </div>
  </div>

  <div class="funnel-pipeline">
    <!-- Left: Signals & Qualification -->
    <div class="pane">
      <div style="font-family: monospace; font-size: 11px; color: #38BDF8; font-weight: 700; text-transform: uppercase;">
        Step 1: Prospect Ingestion &amp; Negative Checks
      </div>
      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 14px;">
        <div style="font-size: 14px; font-weight: 700; color: #FAF9F5;">Commercial Fleet Operations</div>
        <div style="font-size: 12px; color: #94A3B8; margin-top: 4px;">Domain: <code>dfw-transport-logistics.com</code></div>
        <div style="font-size: 11px; color: #10B981; margin-top: 6px;">✓ Negative Checks Passed (No hiring freeze, verified revenue tier)</div>
      </div>

      <div class="score-badge">
        <div>
          <div style="font-family: monospace; font-size: 11px; color: #94A3B8; text-transform: uppercase;">Calibrated Fit Score</div>
          <div style="font-size: 13px; color: #FAF9F5; font-weight: 600;">High Commercial Value</div>
        </div>
        <div class="score-num">94/100</div>
      </div>

      <div style="font-size: 12px; color: #94A3B8; line-height: 1.5;">
        Matched against Seller Profile criteria: Direct quoting friction identified, multi-hub routing missing, manual dispatch bottleneck.
      </div>
    </div>

    <!-- Right: Generated Output -->
    <div class="pane">
      <div style="font-family: monospace; font-size: 11px; color: #38BDF8; font-weight: 700; text-transform: uppercase;">
        Step 2: Generated Opportunity Spec
      </div>
      <div class="spec-box">
        <strong>Delivered Prototype Architecture:</strong><br>
        &bull; <strong>Scope:</strong> Dedicated B2B fleet repair &amp; billing intake architecture.<br>
        &bull; <strong>Action:</strong> Filtered low-margin retail queries; prioritized fleet contracts.<br>
        &bull; <strong>Output Artifact:</strong> Executive brief + interactive quotation prototype specification.
      </div>
      <div style="background: rgba(37, 99, 235, 0.1); border: 1px solid #2563EB; border-radius: 6px; padding: 14px; margin-top: auto;">
        <div style="font-size: 11px; font-family: monospace; color: #38BDF8; font-weight: 700;">CONFIDENTIAL OUTREACH BRIEF</div>
        <div style="font-size: 12px; color: #FAF9F5; margin-top: 4px;">
          "Your customer intake currently requires 3 manual callbacks for fleet dispatch. Here is the operational quotation architecture that eliminates the delay."
        </div>
      </div>
      <div class="btn-funnel">Generate Executive Opportunity Spec &rarr;</div>
    </div>
  </div>
</body>
</html>
  `);
  await page.screenshot({ path: path.join(outputDir, 'opportunity-funnel-spread.webp') });
  console.log('Rendered opportunity-funnel-spread.webp');

  // -------------------------------------------------------------
  // 4. Contest Architecture Diagram (1200 x 750) - Clean Systems Architecture Flow
  // -------------------------------------------------------------
  await page.setViewport({ width: 1200, height: 750, deviceScaleFactor: 2 });
  await page.setContent(`
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px; height: 750px;
    background: #FAF9F5;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #10211D;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .diagram-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    border-bottom: 2px solid #10211D; padding-bottom: 14px;
  }
  .sys-tag {
    font-family: monospace; font-size: 11px; font-weight: 700;
    color: #0F766E; text-transform: uppercase; letter-spacing: 0.1em;
  }
  .flow-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 20px 0;
  }
  .flow-row {
    display: grid;
    grid-template-columns: 1.2fr 40px 2.2fr 40px 1.4fr;
    align-items: center;
    gap: 10px;
  }
  .node-box {
    background: #FFFFFF;
    border: 1.5px solid #10211D;
    border-radius: 6px;
    padding: 16px 20px;
    box-shadow: 0 4px 12px rgba(16, 33, 29, 0.04);
  }
  .arrow {
    font-size: 20px; font-weight: 800; color: #0F766E; text-align: center;
  }
  .rules-stack {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .rule-pill {
    padding: 10px 14px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .rule-pill.pass {
    background: #ECFDF5; border: 1px solid #10B981; color: #065F46;
  }
  .rule-pill.fail {
    background: #FEF2F2; border: 1px solid #EF4444; color: #991B1B;
  }
  .verdict-box {
    background: #10211D;
    color: #FAF9F5;
    border-radius: 6px;
    padding: 18px;
  }
</style>
</head>
<body>
  <div class="diagram-header">
    <div>
      <div class="sys-tag">System Architecture &bull; In Development</div>
      <h2 style="font-family: serif; font-size: 26px; font-weight: 500; margin-top: 4px;">Contest Rules &amp; Submission Engine</h2>
    </div>
    <div style="font-family: monospace; font-size: 12px; color: #0F766E; font-weight: 700;">
      RFC-7807 LOGIC PIPELINE
    </div>
  </div>

  <div class="flow-container">
    <div class="flow-row">
      <!-- Input -->
      <div class="node-box">
        <div style="font-family: monospace; font-size: 10px; color: #0F766E; font-weight: 700; text-transform: uppercase;">1. Ingestion Node</div>
        <div style="font-size: 15px; font-weight: 700; margin-top: 4px;">Piece Profile + Opportunity Rules</div>
        <div style="font-size: 12px; color: #64748B; margin-top: 4px;">AST document profile, metadata, submission constraints.</div>
      </div>

      <div class="arrow">&rarr;</div>

      <!-- Rules Evaluation Stack -->
      <div class="rules-stack">
        <div class="rule-pill pass">
          <span>✓ PASS &bull; Rule Layer 01 // Word Count Ceiling (4,250w in 5,000w limit)</span>
          <strong>Deterministic</strong>
        </div>
        <div class="rule-pill pass">
          <span>✓ PASS &bull; Rule Layer 02 // Blind Judging (Zero header metadata)</span>
          <strong>Verified</strong>
        </div>
        <div class="rule-pill fail">
          <span>✕ ACTION REQUIRED &bull; Rule Layer 03 // Formatting &amp; Anonymity Audit</span>
          <strong>Flagged</strong>
        </div>
      </div>

      <div class="arrow">&rarr;</div>

      <!-- Output Verdict -->
      <div class="verdict-box">
        <div style="font-family: monospace; font-size: 10px; color: #C5A059; font-weight: 700; text-transform: uppercase;">3. Explainable Verdict</div>
        <div style="font-size: 16px; font-weight: 700; color: #FAF9F5; margin-top: 4px;">1 Action Required Before Entry</div>
        <div style="font-size: 11px; color: #94A3B8; margin-top: 6px; line-height: 1.4;">
          Author name detected in page-4 running header. Complete header removal required for blind evaluation.
        </div>
      </div>
    </div>
  </div>

  <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 12px;">
    <span>RULE SCHEMA: v1.4.2 // RFC-7807</span>
    <span>DECISION PATH: 100% EXPLAINABLE PASS/FAIL TREE</span>
    <span>STATUS: ACTIVE ARCHITECTURAL DEVELOPMENT</span>
  </div>
</body>
</html>
  `);
  await page.screenshot({ path: path.join(outputDir, 'contest-architecture-diagram.webp') });
  console.log('Rendered contest-architecture-diagram.webp');

  // -------------------------------------------------------------
  // 5. Lone Wolf Commercial Spread (1400 x 875) - Customer-Facing Commercial Website
  // -------------------------------------------------------------
  await page.setViewport({ width: 1400, height: 875, deviceScaleFactor: 2 });
  await page.setContent(`
<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1400px; height: 875px;
    background: #0E1F1B;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #FAF9F5;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;
  }
  .browser-bar {
    display: flex; align-items: center; justify-content: space-between;
    background: #142723; padding: 10px 18px; border-radius: 6px;
    border: 1px solid rgba(250, 249, 245, 0.1);
  }
  .dots { display: flex; gap: 6px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(250, 249, 245, 0.3); }
  .url {
    font-family: monospace; font-size: 12px; color: #C5A059; font-weight: 600;
  }
  .lw-body {
    background: #10211D;
    border: 1px solid rgba(250, 249, 245, 0.12);
    border-radius: 8px;
    padding: 36px 40px;
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 40px;
    height: 730px;
    align-items: center;
  }
  .badge {
    display: inline-block;
    background: rgba(197, 160, 89, 0.15);
    border: 1px solid #C5A059;
    color: #C5A059;
    font-family: monospace;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 4px;
    margin-bottom: 12px;
  }
  .lw-title {
    font-family: "Georgia", serif;
    font-size: 44px;
    line-height: 1.15;
    color: #FAF9F5;
    margin-bottom: 14px;
  }
  .pricing-matrix {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin: 24px 0;
  }
  .price-card {
    background: #162E28;
    border: 1px solid rgba(250, 249, 245, 0.15);
    border-radius: 6px;
    padding: 16px;
    text-align: center;
  }
  .price-card.featured {
    border-color: #C5A059;
    background: #1B3830;
  }
  .lw-geo-hub {
    background: #142723;
    border: 1px solid rgba(250, 249, 245, 0.15);
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .geo-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    font-family: monospace;
    font-size: 12px;
    color: #94A3B8;
  }
</style>
</head>
<body>
  <div class="browser-bar">
    <div class="dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    <div class="url">https://lonewolfdumpsters.com &bull; North Texas Commercial Logistics</div>
    <div style="font-family: monospace; font-size: 11px; color: #5EEAD4;">48 DFW MUNICIPAL HUBS</div>
  </div>

  <div class="lw-body">
    <div>
      <div class="badge">Commercial Web Experience</div>
      <h1 class="lw-title">Straightforward Roll-Off Dumpsters in North Texas</h1>
      <p style="font-size: 16px; color: rgba(250, 249, 245, 0.8); line-height: 1.6; margin-bottom: 20px;">
        Transparent flat-rate pricing for residential cleanouts and commercial contractor job sites across Weatherford, Fort Worth, and 48 Parker &amp; Tarrant county municipalities.
      </p>

      <div class="pricing-matrix">
        <div class="price-card">
          <div style="font-size: 12px; color: #94A3B8;">15-Yard</div>
          <div style="font-size: 26px; font-weight: 800; color: #FAF9F5; margin: 4px 0;">$385</div>
          <div style="font-size: 11px; color: #6EE7B7;">3 Days &bull; 2 Tons</div>
        </div>
        <div class="price-card featured">
          <div style="font-size: 12px; color: #C5A059; font-weight: 700;">20-Yard (Popular)</div>
          <div style="font-size: 26px; font-weight: 800; color: #FAF9F5; margin: 4px 0;">$425</div>
          <div style="font-size: 11px; color: #6EE7B7;">3 Days &bull; 3 Tons</div>
        </div>
        <div class="price-card">
          <div style="font-size: 12px; color: #94A3B8;">25-Yard</div>
          <div style="font-size: 26px; font-weight: 800; color: #FAF9F5; margin: 4px 0;">$475</div>
          <div style="font-size: 11px; color: #6EE7B7;">3 Days &bull; 4 Tons</div>
        </div>
      </div>

      <div style="display: flex; gap: 14px; align-items: center;">
        <button style="background: #0F766E; color: #FFF; font-weight: 700; padding: 12px 24px; border-radius: 4px; border: none; font-size: 14px;">Book a Dumpster Online &rarr;</button>
        <span style="font-family: monospace; font-size: 11px; color: #94A3B8;">Zero hidden drop-off fees</span>
      </div>
    </div>

    <div class="lw-geo-hub">
      <div style="font-family: monospace; font-size: 11px; color: #C5A059; font-weight: 700; text-transform: uppercase;">
        DFW Municipal Geo Architecture
      </div>
      <div style="font-size: 13px; color: #FAF9F5; line-height: 1.5;">
        Targeted landing page infrastructure with localized route calculations and differentiated contractor vs homeowner intake.
      </div>
      <div class="geo-grid">
        <div>&bull; Weatherford Hub</div>
        <div>&bull; Fort Worth Dispatch</div>
        <div>&bull; Aledo &bull; Hudson Oaks</div>
        <div>&bull; Willow Park &bull; Azle</div>
        <div>&bull; Granbury &bull; Springtown</div>
        <div>&bull; Mineral Wells &bull; Brock</div>
      </div>
      <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 4px; border: 1px solid rgba(250, 249, 245, 0.08); font-family: monospace; font-size: 11px; color: #5EEAD4;">
        Dual-Track Routing: Homeowner Flat Rate &bull; Contractor Volume Commercial
      </div>
    </div>
  </div>
</body>
</html>
  `);
  await page.screenshot({ path: path.join(outputDir, 'lonewolf-commercial-spread.webp') });
  console.log('Rendered lonewolf-commercial-spread.webp');

  await browser.close();
}

renderAssets().catch(console.error);
