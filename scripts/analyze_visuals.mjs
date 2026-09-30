import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const rootDir = 'C:/Users/rougu/.gemini/antigravity/scratch/contextmuse-homepage';

const pagesToAnalyze = [
  'index.html',
  'systems/index.html',
  'systems/client-builds/index.html',
  'proof-of-work/index.html',
  'work/index.html',
  'services/index.html',
  'gensort/index.html',
  'signal/index.html',
  'website-system-check/index.html',
  'work/lone-wolf-dumpsters/index.html',
  'work/website-audit-system/index.html',
  'work/client-opportunity-engine/index.html',
  'work/contest-atlas/index.html',
  'work/revision-atlas/index.html',
  'restaurant-systems/index.html',
  'inncontrol-v2/index.html'
];

const visualAnalysis = [];

pagesToAnalyze.forEach(relPage => {
  const filePath = path.join(rootDir, relPage);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);

  $('img').each((i, el) => {
    const src = $(el).attr('src') || '';
    const alt = $(el).attr('alt') || '';
    
    // Skip small logo/icons unless relevant
    if (src.includes('logo.svg') || src.includes('favicon') || src.includes('arrow')) return;

    // Find parent container context to identify claimed project
    const container = $(el).closest('.proof-card, .client-build-card, .case-card, .hero, .product-hero, .showcase-item, section, article, div[class*="card"]');
    const heading = container.find('h1, h2, h3, h4, .eyebrow, .proof-client, .proof-system').first().text().trim();
    const paragraph = container.find('p').first().text().trim();

    visualAnalysis.push({
      page: relPage,
      src,
      alt,
      claimedProject: heading || 'Unspecified section',
      snippet: paragraph.slice(0, 100)
    });
  });
});

console.log(`Analyzed ${visualAnalysis.length} image placements across primary pages.`);
fs.writeFileSync('scratch/visual_audit_raw.json', JSON.stringify(visualAnalysis, null, 2), 'utf8');

