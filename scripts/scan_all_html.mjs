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
const report = [];

for (const p of htmlFiles) {
  const rel = path.relative('.', p).replace(/\\/g, '/');
  const html = fs.readFileSync(p, 'utf8');
  const $ = cheerio.load(html);
  
  $('img').each((i, el) => {
    const src = $(el).attr('src') || '';
    if (src.includes('logo.svg')) return;
    const alt = $(el).attr('alt') || '';
    const parent = $(el).closest('.card, .proof-card, .client-build-card, .case-card, .hero, .product-hero, section, article');
    const heading = parent.find('h1, h2, h3, h4, .proof-client, .proof-system, .card-title, .title').first().text().trim();
    const caption = $(el).closest('figure').find('figcaption').text().trim() || $(el).siblings('figcaption').text().trim() || $(el).parent().find('p').first().text().trim();
    report.push({
      page: rel,
      type: 'img',
      src,
      alt,
      heading,
      caption: caption.replace(/\s+/g, ' ').slice(0, 140)
    });
  });

  $('[style*="background"]').each((i, el) => {
    const style = $(el).attr('style') || '';
    const match = style.match(/background(?:-image)?:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (match && !match[1].includes('logo.svg')) {
      const heading = $(el).closest('section, article, div').find('h1, h2, h3, h4').first().text().trim();
      report.push({
        page: rel,
        type: 'bg-style',
        src: match[1],
        alt: '',
        heading,
        caption: ''
      });
    }
  });

  $('meta[property="og:image"], meta[name="twitter:image"]').each((i, el) => {
    const content = $(el).attr('content') || '';
    if (content) {
      report.push({
        page: rel,
        type: $(el).attr('property') || $(el).attr('name'),
        src: content,
        alt: '',
        heading: $('title').text().trim(),
        caption: ''
      });
    }
  });
}

fs.writeFileSync('scratch/all_64_html_images.json', JSON.stringify(report, null, 2), 'utf8');
console.log(`Audited ${report.length} image placements across ${htmlFiles.length} HTML files.`);
