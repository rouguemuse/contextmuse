const fs = require('fs');
const path = require('path');

const nonIndexablePaths = new Set([
  '/404.html',
  '/partials/nav.html',
  '/partials/footer.html',
  '/contact/success/',
  '/preview/',
  '/brand/',
  '/signal/demo/',
  '/signal/export-instructions/',
  '/demo-restaurant-signal-report.html',
  '/cxm_gensort/',
  '/dealsignal/',
  '/tiktok-shop-roi-analyzer/',
  '/wcsm/',
  '/star-gift/',
  '/istar-map/',
  '/southern_smoke/',
  '/inncontrol-v2/',
  '/rudyards-comedy/',
  '/rudyards-comedy/business-card/',
  '/rudyards-comedy/business-card/gallery.html',
  '/sixes-and-sevens/',
  '/sixes-and-sevens/pub.html',
  '/sixes-and-sevens/house.html',
  '/sixes-and-sevens/tables.html',
  '/sixes-and-sevens/events.html',
  '/sixes-and-sevens/enquire.html',
  '/systems/signal/'
]);

// Read sitemap
const sm = fs.readFileSync('sitemap.xml', 'utf8');
const sitemapUrls = new Set([...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]));

// Read robots.txt
const robotsTxt = fs.readFileSync('robots.txt', 'utf8');

// Find all HTML files
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', '.git', '.vercel', 'scripts', 'scratch'].includes(file)) continue;
      results = results.concat(getHtmlFiles(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const allFiles = getHtmlFiles('.');
console.log('Total HTML files scanned:', allFiles.length);

let indexableCount = 0;
let nonIndexableCount = 0;
let indexableIssues = [];
let nonIndexableIssues = [];

for (const f of allFiles) {
  const norm = f.replace(/\\/g, '/').replace(/^\.\//, '');
  let route = '/' + norm;
  if (route.endsWith('/index.html')) {
    route = route.slice(0, -10);
  }

  const content = fs.readFileSync(f, 'utf8');
  const isNonIndexable = nonIndexablePaths.has(route);

  if (isNonIndexable) {
    nonIndexableCount++;
    // verify it is NOT in sitemap
    const fullUrl = 'https://www.contextmuse.com' + route;
    if (sitemapUrls.has(fullUrl)) {
      nonIndexableIssues.push(`${route}: present in sitemap.xml!`);
    }
    // verify robots directive
    if (norm !== 'partials/nav.html' && norm !== 'partials/footer.html') {
      const robotsMatch = content.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["']/i);
      if (!robotsMatch || !robotsMatch[1].includes('noindex')) {
        nonIndexableIssues.push(`${route}: missing or invalid noindex robots tag (${robotsMatch ? robotsMatch[1] : 'none'})`);
      }
    }
  } else {
    indexableCount++;
    // verify it IS in sitemap
    const fullUrl = 'https://www.contextmuse.com' + route;
    if (!sitemapUrls.has(fullUrl)) {
      indexableIssues.push(`${route}: missing from sitemap.xml!`);
    }
    // check title
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
    if (!titleMatch || titleMatch[1].trim().length < 10) {
      indexableIssues.push(`${route}: short or missing title`);
    }
    // check meta description
    const descMatch = content.match(/<meta[^>]+name=["']description["'][^>]*content="([^"]+)"/i) ||
                      content.match(/<meta[^>]+name=["']description["'][^>]*content='([^']+)'/i);
    if (!descMatch || descMatch[1].trim().length < 30) {
      indexableIssues.push(`${route}: short or missing meta description (${descMatch ? descMatch[1].length : 0} chars)`);
    }
    // check canonical
    const canMatch = content.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    if (!canMatch || !canMatch[1].startsWith('https://www.contextmuse.com/') || !canMatch[1].endsWith('/')) {
      indexableIssues.push(`${route}: invalid canonical (${canMatch ? canMatch[1] : 'none'})`);
    }
    // check h1
    const h1Match = content.match(/<h1[\s>]/i);
    if (!h1Match) {
      indexableIssues.push(`${route}: missing H1 tag`);
    }
    // check JSON-LD
    const ldMatch = content.match(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
    if (!ldMatch) {
      indexableIssues.push(`${route}: missing JSON-LD schema`);
    } else {
      try {
        JSON.parse(ldMatch[1]);
      } catch (e) {
        indexableIssues.push(`${route}: invalid JSON-LD schema syntax`);
      }
    }
  }
}

console.log('--- AUDIT RESULTS ---');
console.log('Indexable routes count:', indexableCount, '(target: 37)');
console.log('Non-indexable routes count:', nonIndexableCount, '(target: 27)');
console.log('Sitemap URLs count:', sitemapUrls.size, '(target: 37)');
console.log('Indexable issues count:', indexableIssues.length);
if (indexableIssues.length > 0) {
  indexableIssues.forEach(i => console.log('  [INDEXABLE ISSUE]', i));
}
console.log('Non-indexable issues count:', nonIndexableIssues.length);
if (nonIndexableIssues.length > 0) {
  nonIndexableIssues.forEach(i => console.log('  [NON-INDEXABLE ISSUE]', i));
}
