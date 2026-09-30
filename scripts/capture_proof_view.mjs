import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

async function captureProof() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  const indexUrl = 'file:///' + path.join(projectRoot, 'index.html').replace(/\\/g, '/');
  await page.goto(indexUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 800));

  await page.evaluate(() => {
    const el = document.getElementById('proof-inncontrol');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(projectRoot, 'scratch', 'homepage_inncontrol_proof_view.png'), fullPage: false });
  console.log('Saved homepage_inncontrol_proof_view.png');

  await page.evaluate(() => {
    const el = document.getElementById('pricing-ladder');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(projectRoot, 'scratch', 'homepage_pricing_ladder_view.png'), fullPage: false });
  console.log('Saved homepage_pricing_ladder_view.png');

  await browser.close();
}

captureProof().catch(console.error);
