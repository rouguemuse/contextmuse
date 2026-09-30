import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  
  // Desktop
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  const indexUrl = 'file:///' + path.join(projectRoot, 'index.html').replace(/\\/g, '/');
  await page.goto(indexUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: path.join(projectRoot, 'scratch', 'homepage_desktop_funnel.png'), fullPage: false });
  console.log('Saved homepage_desktop_funnel.png');

  // Mobile
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto(indexUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(projectRoot, 'scratch', 'homepage_mobile_funnel.png'), fullPage: false });
  console.log('Saved homepage_mobile_funnel.png');

  // Diagnostic tool page
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  const diagUrl = 'file:///' + path.join(projectRoot, 'website-system-check', 'index.html').replace(/\\/g, '/');
  await page.goto(diagUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(projectRoot, 'scratch', 'website_system_check_preview.png'), fullPage: false });
  console.log('Saved website_system_check_preview.png');

  await browser.close();
  console.log('Done capturing screenshots.');
}

capture().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
