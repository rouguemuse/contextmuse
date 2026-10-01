import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function generateVisual() {
  console.log('Generating Phaedra Share Visual (4:3 aspect ratio)...');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 1200px;
    height: 900px;
    background-color: #F4F1EA;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'IBM Plex Sans', -apple-system, sans-serif;
    color: #0E1F1B;
    -webkit-font-smoothing: antialiased;
  }

  .card-container {
    width: 1100px;
    height: 800px;
    background: #FAF9F5;
    border: 1px solid rgba(14, 31, 27, 0.15);
    border-radius: 8px;
    box-shadow: 0 12px 36px rgba(14, 31, 27, 0.06);
    padding: 56px 64px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  /* Top Bar */
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(14, 31, 27, 0.1);
    padding-bottom: 20px;
  }

  .brand-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-mark {
    width: 22px;
    height: 22px;
  }

  .brand-name {
    font-family: 'Newsreader', serif;
    font-size: 19px;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: #0E1F1B;
  }

  .program-tag {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #0F766E;
    background: rgba(15, 118, 110, 0.08);
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid rgba(15, 118, 110, 0.2);
  }

  /* Hero Section */
  .hero {
    margin-top: 24px;
    margin-bottom: 20px;
  }

  .hero h1 {
    font-family: 'Newsreader', serif;
    font-size: 40px;
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: #0E1F1B;
    margin-bottom: 14px;
  }

  .hero p {
    font-size: 17.5px;
    line-height: 1.5;
    color: #374151;
    max-width: 960px;
  }

  /* Three Structural Pillars */
  .pillars-stack {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 6px;
    margin-bottom: 10px;
  }

  .pillar-row {
    background: #FFFFFF;
    border: 1px solid rgba(14, 31, 27, 0.1);
    border-radius: 6px;
    padding: 14px 20px;
    display: flex;
    align-items: baseline;
    gap: 24px;
  }

  .pillar-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0F766E;
    min-width: 200px;
    flex-shrink: 0;
  }

  .pillar-content {
    font-size: 15.5px;
    line-height: 1.4;
    color: #1F2937;
    font-weight: 500;
  }

  .pillar-content span.bullet {
    color: #0F766E;
    margin: 0 8px;
    font-weight: 400;
  }

  /* Bottom Action Section */
  .bottom-bar {
    border-top: 1px solid rgba(14, 31, 27, 0.1);
    padding-top: 22px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .cta-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cta-label {
    font-family: 'Newsreader', serif;
    font-size: 20px;
    font-style: italic;
    color: #0E1F1B;
  }

  .cta-url {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 16px;
    font-weight: 600;
    color: #0F766E;
    letter-spacing: -0.01em;
  }

  .fine-note {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11.5px;
    color: #6B7280;
    text-align: right;
    max-width: 380px;
    line-height: 1.4;
  }
</style>
</head>
<body>
  <div class="card-container">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="brand-group">
        <svg class="brand-mark" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" stroke="#0E1F1B" stroke-width="6"/>
          <path d="M50 20 L50 80" stroke="#0F766E" stroke-width="6"/>
          <circle cx="50" cy="50" r="14" fill="#0E1F1B"/>
        </svg>
        <span class="brand-name">Context &amp; Muse &bull; Signal</span>
      </div>
      <div class="program-tag">Restaurant Data Partner Program</div>
    </div>

    <!-- Hero -->
    <div class="hero">
      <h1>Let your restaurant data tell us where the money is actually going.</h1>
      <p>
        Selected restaurants can receive a Signal operating-data analysis at no charge in exchange for useful real-world data and feedback.
      </p>
    </div>

    <!-- 3 Pillars -->
    <div class="pillars-stack">
      <div class="pillar-row">
        <div class="pillar-label">What Signal can examine</div>
        <div class="pillar-content">
          Pricing<span class="bullet">&bull;</span>Discounts &amp; comps<span class="bullet">&bull;</span>Modifiers<span class="bullet">&bull;</span>Item mix<span class="bullet">&bull;</span>Operational patterns
        </div>
      </div>

      <div class="pillar-row">
        <div class="pillar-label">What you provide</div>
        <div class="pillar-content">
          Standard POS exports, spreadsheets, reports, or temporary restricted export access
        </div>
      </div>

      <div class="pillar-row">
        <div class="pillar-label">What you receive</div>
        <div class="pillar-content">
          Findings<span class="bullet">&bull;</span>Evidence<span class="bullet">&bull;</span>Priorities<span class="bullet">&bull;</span>Practical recommendations
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="bottom-bar">
      <div class="cta-group">
        <div class="cta-label">Interested?</div>
        <div class="cta-url">contextmuse.com/signal/restaurant-data-partner/</div>
      </div>
      <div class="fine-note">
        Participation is selective.<br>Not every restaurant will qualify.
      </div>
    </div>
  </div>
</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 900,
    deviceScaleFactor: 2 // Crisp 2x retina rendering (2400x1800 output)
  });

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Wait for Google fonts to render
  await page.evaluateHandle('document.fonts.ready');

  const outputDir = path.join(projectRoot, 'assets', 'images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'signal-data-partner-share.png');
  await page.screenshot({
    path: outputPath,
    clip: { x: 0, y: 0, width: 1200, height: 900 }
  });

  console.log('Saved 4:3 share graphic to:', outputPath);

  // Also copy to artifacts directory for immediate viewing
  const artifactDir = 'C:\\Users\\rougu\\.gemini\\antigravity\\brain\\c9fe95e3-68e1-478f-823b-4e2584b213be';
  const artifactPath = path.join(artifactDir, 'signal_data_partner_share.png');
  fs.copyFileSync(outputPath, artifactPath);
  console.log('Copied to artifacts directory:', artifactPath);

  await browser.close();
}

generateVisual().catch(err => {
  console.error('Error generating visual:', err);
  process.exit(1);
});
