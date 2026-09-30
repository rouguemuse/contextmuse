import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

function getFiles(dir, exts = ['.html']) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (['node_modules', '.git', 'brain', 'qa_output', 'scratch'].includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, exts));
    } else if (exts.includes(path.extname(file).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getFiles('.');
console.log(`Found ${htmlFiles.length} HTML files.`);

const allVisuals = [];

for (const filePath of htmlFiles) {
  const relFile = path.relative('.', filePath).replace(/\\/g, '/');
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // 1. img tags
  $('img').each((i, el) => {
    const $el = $(el);
    const src = $el.attr('src') || '';
    const alt = $el.attr('alt') || '';
    if (!src || src.startsWith('data:') || src.includes('contextmuse_logo.svg') || src.includes('favicon')) {
      return;
    }

    const parent = $el.closest('.proof-card, .client-build-card, .case-card, .showcase-item, .hero, .product-hero, section, article, div[class*="card"], div[class*="item"]');
    const heading = parent.find('h1, h2, h3, h4, .proof-client, .proof-system, .card-title, .title').first().text().trim();
    const caption = $el.closest('figure').find('figcaption').text().trim() || $el.siblings('figcaption').text().trim() || $el.parent().find('.caption, .img-caption, p').first().text().trim();
    const sectionName = $el.closest('section, header, footer').attr('class') || $el.closest('section, header, footer').attr('id') || 'General';

    allVisuals.push({
      page: relFile,
      type: 'img',
      src,
      alt,
      section: sectionName,
      heading,
      caption: caption.slice(0, 150)
    });
  });

  // 2. CSS inline background-image
  $('[style*="background"]').each((i, el) => {
    const style = $(el).attr('style') || '';
    const match = style.match(/background(?:-image)?:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match) {
      const src = match[1];
      if (src.includes('contextmuse_logo.svg')) return;
      const parent = $(el).closest('section, article, div');
      const heading = parent.find('h1, h2, h3, h4').first().text().trim();
      allVisuals.push({
        page: relFile,
        type: 'bg-style',
        src,
        alt: '',
        section: $(el).closest('section').attr('class') || 'General',
        heading,
        caption: ''
      });
    }
  });

  // 3. og:image
  $('meta[property="og:image"], meta[name="twitter:image"], meta[name="image"]').each((i, el) => {
    const content = $(el).attr('content') || '';
    if (content) {
      allVisuals.push({
        page: relFile,
        type: $(el).attr('property') || $(el).attr('name'),
        src: content,
        alt: '',
        section: 'head-meta',
        heading: $('title').text().trim(),
        caption: ''
      });
    }
  });
}

console.log(`Total visual instances: ${allVisuals.length}`);
fs.writeFileSync('scratch/visuals_dump.json', JSON.stringify(allVisuals, null, 2), 'utf8');

const srcMap = {};
for (const v of allVisuals) {
  if (!srcMap[v.src]) {
    srcMap[v.src] = [];
  }
  srcMap[v.src].push({ page: v.page, heading: v.heading, alt: v.alt, type: v.type });
}

console.log(`Unique visual assets: ${Object.keys(srcMap).length}`);
fs.writeFileSync('scratch/unique_visuals.json', JSON.stringify(srcMap, null, 2), 'utf8');
