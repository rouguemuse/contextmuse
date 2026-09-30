import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const rootDir = 'C:/Users/rougu/.gemini/antigravity/scratch/contextmuse-homepage';

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === '.vercel') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles(rootDir);
console.log(`Found ${htmlFiles.length} HTML files.`);

const auditData = {
  routes: [],
  images: [],
  forms: [],
  ctas: [],
  internalLinks: [],
  missingFiles: [],
  schemaCount: 0,
  mapsWithTeethMentions: [],
  inncontrolImages: [],
  duplicateImages: {}
};

htmlFiles.forEach(file => {
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(content);

  const title = $('title').text().trim();
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const h1s = $('h1').map((i, el) => $(el).text().trim()).get();
  const schemas = $('script[type="application/ld+json"]').map((i, el) => $(el).html()).get();

  // Maps With Teeth checks
  if (content.toLowerCase().includes('maps with teeth')) {
    // Check if it appears under products
    const inProducts = $('nav .nav-dropdown:has(summary:contains("Products")) a[href*="mapswithteeth"]').length > 0;
    auditData.mapsWithTeethMentions.push({ relPath, inProducts });
  }

  // Forms
  $('form').each((i, el) => {
    const action = $(el).attr('action') || '';
    const method = $(el).attr('method') || '';
    const id = $(el).attr('id') || '';
    const inputs = $(el).find('input, select, textarea').map((j, inp) => $(inp).attr('name') || $(inp).attr('id') || inp.tagName).get();
    auditData.forms.push({ relPath, id, action, method, inputCount: inputs.length, inputs });
  });

  // Images
  $('img').each((i, el) => {
    const src = $(el).attr('src') || '';
    const alt = $(el).attr('alt') || '';
    const parentText = $(el).closest('section, div, header, article').find('h1, h2, h3, h4, span.eyebrow').first().text().trim();
    
    // Check if file exists locally
    let exists = false;
    let localPath = '';
    if (src.startsWith('/')) {
      localPath = path.join(rootDir, src.slice(1));
      exists = fs.existsSync(localPath);
    } else if (src && !src.startsWith('http')) {
      localPath = path.join(path.dirname(file), src);
      exists = fs.existsSync(localPath);
    }

    const imgRecord = {
      page: relPath,
      src,
      alt,
      context: parentText.slice(0, 80),
      exists
    };
    auditData.images.push(imgRecord);

    if (src) {
      auditData.duplicateImages[src] = (auditData.duplicateImages[src] || 0) + 1;
    }

    if (relPath.includes('inncontrol') || alt.toLowerCase().includes('inncontrol') || parentText.toLowerCase().includes('inncontrol') || src.toLowerCase().includes('inncontrol')) {
      auditData.inncontrolImages.push(imgRecord);
    }
  });

  // Links
  $('a[href]').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    if (href && (href.startsWith('/') || !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:'))) {
      auditData.internalLinks.push({ page: relPath, href, text });
    }
  });

  auditData.routes.push({
    relPath,
    title,
    metaDesc,
    canonical,
    h1s,
    hasSchema: schemas.length > 0
  });
});

fs.writeFileSync(path.join(rootDir, 'scratch', 'comprehensive_audit_data.json'), JSON.stringify(auditData, null, 2), 'utf8');
console.log('Saved audit data. Images checked:', auditData.images.length);
console.log('Maps with teeth in products count:', auditData.mapsWithTeethMentions.filter(m => m.inProducts).length);
console.log('Inncontrol images found:', auditData.inncontrolImages.length);
