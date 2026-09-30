import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

async function convert() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const b64 = fs.readFileSync('assets/images/inncontrol_coils_preview.png').toString('base64');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body, html { width: 1440px; height: 900px; overflow: hidden; background: #000; }
          img { width: 1440px; height: 900px; object-fit: cover; display: block; }
        </style>
      </head>
      <body>
        <img id="preview" src="data:image/png;base64,${b64}" />
      </body>
    </html>
  `;

  await page.setContent(htmlContent);
  await page.waitForSelector('#preview');

  const targetPath = path.resolve('assets/images/inncontrol-commercial-platform.webp');
  await page.screenshot({
    path: targetPath,
    type: 'webp',
    quality: 90
  });

  await browser.close();

  const originalSize = fs.statSync('assets/images/inncontrol_coils_preview.png').size;
  const webpSize = fs.statSync(targetPath).size;

  console.log(`Successfully converted INNcontrol:`);
  console.log(`Original PNG: ${(originalSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Optimized WebP: ${(webpSize / 1024).toFixed(1)} KB`);
  console.log(`Path: ${targetPath}`);
}

convert().catch(err => {
  console.error(err);
  process.exit(1);
});
