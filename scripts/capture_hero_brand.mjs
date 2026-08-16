import puppeteer from 'puppeteer';
import path from 'path';

const artifactsDir = 'C:/Users/rougu/.gemini/antigravity/brain/c9fe95e3-68e1-478f-823b-4e2584b213be';

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(artifactsDir, 'homepage_hero_brand_colors.png'), fullPage: false });
    console.log('Captured homepage_hero_brand_colors.png');
    await browser.close();
    process.exit(0);
})();
