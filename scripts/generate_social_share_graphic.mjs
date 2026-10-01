import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function generateSocialGraphic() {
  console.log('Generating 1200x630 Social Share Graphic...');

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
    height: 630px;
    background-color: #FAF9F5;
    font-family: 'IBM Plex Sans', -apple-system, sans-serif;
    color: #0E1F1B;
    -webkit-font-smoothing: antialiased;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .canvas-card {
    width: 1120px;
    height: 550px;
    background: #FFFFFF;
    border: 1px solid rgba(14, 31, 27, 0.12);
    border-radius: 8px;
    box-shadow: 0 8px 30px rgba(14, 31, 27, 0.04);
    padding: 48px 56px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  /* Top bar */
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(14, 31, 27, 0.08);
    padding-bottom: 18px;
  }

  .brand-badge {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .brand-mark {
    width: 20px;
    height: 20px;
  }

  .brand-text {
    font-family: 'Newsreader', serif;
    font-size: 18px;
    font-weight: 500;
    color: #0E1F1B;
    letter-spacing: -0.01em;
  }

  .tag-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #0F766E;
    background: rgba(15, 118, 110, 0.08);
    padding: 5px 12px;
    border-radius: 4px;
    border: 1px solid rgba(15, 118, 110, 0.2);
  }

  /* Main content */
  .card-body {
    margin: auto 0;
  }

  .headline-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #0F766E;
    margin-bottom: 12px;
  }

  h1.headline-title {
    font-family: 'Newsreader', serif;
    font-size: 44px;
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: #0E1F1B;
    margin-bottom: 16px;
  }

  p.headline-sub {
    font-size: 20px;
    line-height: 1.45;
    color: #2D3748;
    max-width: 980px;
    font-weight: 400;
  }

  .value-pillars {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
    background: #FAF9F5;
    border: 1px solid rgba(14, 31, 27, 0.08);
    padding: 10px 18px;
    border-radius: 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: #0F766E;
  }

  .value-pillars span.bullet {
    color: #CBD5E1;
  }

  /* Card footer */
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1px solid rgba(14, 31, 27, 0.08);
    padding-top: 18px;
  }

  .url-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 15px;
    font-weight: 600;
    color: #0E1F1B;
    letter-spacing: -0.01em;
  }

  .url-sub {
    font-size: 12px;
    color: #718096;
    margin-top: 2px;
  }

  .disclaimer {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: #718096;
    text-align: right;
    line-height: 1.4;
  }
</style>
</head>
<body>
  <div class="canvas-card">
    <div class="card-top">
      <div class="brand-badge">
        <svg class="brand-mark" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" stroke="#0E1F1B" stroke-width="6"/>
          <path d="M50 20 L50 80" stroke="#0F766E" stroke-width="6"/>
          <circle cx="50" cy="50" r="14" fill="#0E1F1B"/>
        </svg>
        <span class="brand-text">Context &amp; Muse &bull; Signal</span>
      </div>
      <div class="tag-label">Pilot Research Program</div>
    </div>

    <div class="card-body">
      <div class="headline-eyebrow">Restaurant Data Partners Wanted</div>
      <h1 class="headline-title">Selected restaurants receive a Signal analysis at no charge.</h1>
      <p class="headline-sub">
        Share operating reports. Help develop Signal. Get practical findings and floor checks.
      </p>
      <div class="value-pillars">
        <span>Pricing &amp; Modifiers</span>
        <span class="bullet">&bull;</span>
        <span>Discounts &amp; Comps</span>
        <span class="bullet">&bull;</span>
        <span>Item Mix</span>
        <span class="bullet">&bull;</span>
        <span>Shift Friction</span>
      </div>
    </div>

    <div class="card-footer">
      <div>
        <div class="url-label">contextmuse.com/signal/restaurant-data-partner/</div>
        <div class="url-sub">Independent operators &bull; Standard POS exports accepted</div>
      </div>
      <div class="disclaimer">
        Participation is selective.<br>Agreed scope &bull; No administrative access needed
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
    height: 630,
    deviceScaleFactor: 2 // 2400x1260 ultra sharp retina
  });

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const outputDir = path.join(projectRoot, 'assets', 'images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'restaurant-data-partner-share.png');
  await page.screenshot({
    path: outputPath,
    clip: { x: 0, y: 0, width: 1200, height: 630 }
  });

  console.log('Saved 1200x630 share graphic to:', outputPath);

  const artifactDir = path.resolve('C:/Users/rougu/.gemini/antigravity/brain/c9fe95e3-68e1-478f-823b-4e2584b213be');
  const artifactPath = path.join(artifactDir, 'restaurant_data_partner_share_1200x630.png');
  fs.copyFileSync(outputPath, artifactPath);
  console.log('Copied to artifacts directory:', artifactPath);

  await browser.close();
}

generateSocialGraphic().catch(err => {
  console.error('Error generating social graphic:', err);
  process.exit(1);
});
