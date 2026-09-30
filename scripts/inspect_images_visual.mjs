import fs from 'fs';
import puppeteer from 'puppeteer';

const filesToCheck = [
  'assets/images/d2autodetail-screenshot.webp',
  'assets/images/edrpartyrentals-screenshot.webp',
  'assets/images/website-audit-cover.webp',
  'assets/images/website-audit-hero.webp',
  'assets/images/revision-atlas-cover.webp',
  'assets/images/revision-atlas-hero.webp',
  'assets/images/contest-atlas-cover.webp',
  'assets/images/contest-atlas-hero.webp',
  'assets/images/client-opportunity-engine-cover.webp',
  'assets/images/signal-priority-view.webp',
  'assets/images/mapswithteeth-screenshot.webp',
  'assets/images/madeofreasons-screenshot.webp',
  'assets/images/inncontrol-commercial-platform.webp',
  'assets/images/lonewolf-screenshot.webp',
  'assets/images/lonewolf-commercial-spread.webp',
  'assets/images/gensort-library.webp',
  'assets/images/gensort-compare.webp',
  'assets/images/gensort-inspector.webp',
  'assets/images/gensort-search-filter.webp',
  'assets/images/restaurant_operations_map.jpg',
  'assets/images/about_compass.jpg',
  'assets/images/contextmuse_hero_architectural.png',
  'assets/images/message-analysis-mockup.png'
];

async function inspectImages() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const results = [];
  for (const f of filesToCheck) {
    if (!fs.existsSync(f)) {
      results.push({ file: f, exists: false });
      continue;
    }
    const stat = fs.statSync(f);
    const b64 = fs.readFileSync(f).toString('base64');
    const ext = f.endsWith('.png') ? 'png' : (f.endsWith('.jpg') ? 'jpeg' : 'webp');
    await page.setContent(`<img id="test-img" src="data:image/${ext};base64,${b64}">`);
    const info = await page.evaluate(() => {
      const img = document.getElementById('test-img');
      return { width: img.naturalWidth, height: img.naturalHeight };
    });

    results.push({
      file: f,
      exists: true,
      sizeKb: Math.round(stat.size / 1024),
      width: info.width,
      height: info.height
    });
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  fs.writeFileSync('scratch/images_dimensions.json', JSON.stringify(results, null, 2), 'utf8');
}

inspectImages().catch(console.error);
