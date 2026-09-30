import fs from 'fs';
import * as cheerio from 'cheerio';

const pages = [
  'index.html',
  'work/index.html',
  'proof-of-work/index.html',
  'systems/index.html',
  'systems/client-builds/index.html',
  'services/index.html',
  'services/quote-lead-systems/index.html',
  'restaurant-systems/index.html',
  'signal/index.html',
  'signal/sample-reports/index.html',
  'signal/demo/index.html',
  'gensort/index.html',
  'case-studies/edr-party-rentals/index.html',
  'work/lone-wolf-dumpsters/index.html',
  'work/website-audit-system/index.html',
  'work/client-opportunity-engine/index.html',
  'work/contest-atlas/index.html',
  'work/revision-atlas/index.html',
  'about/index.html',
  'preview/index.html'
];

let output = '';
function log(msg = '') {
  output += msg + '\n';
}

for (const p of pages) {
  if (!fs.existsSync(p)) continue;
  const $ = cheerio.load(fs.readFileSync(p, 'utf8'));
  log(`\n========================================`);
  log(`PAGE: ${p}`);
  log(`========================================`);
  
  $('img').each((i, el) => {
    const src = $(el).attr('src') || '';
    if (src.includes('logo.svg')) return;
    const alt = $(el).attr('alt') || '';
    const parent = $(el).closest('.card, .proof-card, .client-build-card, .case-card, .hero, .product-hero, section, article');
    const heading = parent.find('h1, h2, h3, h4, .proof-client, .proof-system, .card-title, .title').first().text().trim();
    const caption = $(el).closest('figure').find('figcaption').text().trim() || $(el).siblings('figcaption').text().trim() || $(el).parent().find('p').first().text().trim();
    log(`\n  [IMG ${i+1}]`);
    log(`  Source:  ${src}`);
    log(`  Alt:     ${alt}`);
    log(`  Heading: ${heading}`);
    log(`  Caption: ${caption.replace(/\s+/g, ' ').slice(0, 140)}`);
  });

  // Check background images
  $('[style*="background"]').each((i, el) => {
    const style = $(el).attr('style') || '';
    const match = style.match(/background(?:-image)?:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && !match[1].includes('logo.svg')) {
      const heading = $(el).closest('section, article, div').find('h1, h2, h3, h4').first().text().trim();
      log(`\n  [BG-STYLE ${i+1}]`);
      log(`  Source:  ${match[1]}`);
      log(`  Heading: ${heading}`);
    }
  });
}

fs.writeFileSync('scratch/page_images_report.txt', output, 'utf8');
console.log('Saved page_images_report.txt successfully. Length:', output.length);

