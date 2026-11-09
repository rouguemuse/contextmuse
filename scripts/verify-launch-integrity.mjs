import fs from 'node:fs';
import path from 'node:path';
import { SPA_ROUTE_SEO } from '../src/lib/seoRoutes.js';

const root = process.cwd();
const errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
    console.error(`  ✗ FAIL: ${message}`);
  } else {
    console.log(`  ✓ PASS: ${message}`);
  }
}

console.log('=== Running ContextMuse Launch Integrity Verification ===\n');

// 1. Verify SPA Route HTML Metadata & Analytics Integration
for (const [routeKey, routeMeta] of Object.entries(SPA_ROUTE_SEO)) {
  const filePath = path.join(root, routeMeta.outputFile);
  assert(fs.existsSync(filePath), `Generated HTML exists for ${routeKey} (${routeMeta.outputFile})`);
  if (!fs.existsSync(filePath)) continue;

  const html = fs.readFileSync(filePath, 'utf8');
  assert(
    html.includes(`<link rel="canonical" href="${routeMeta.canonical}"`),
    `${routeMeta.outputFile} has canonical ${routeMeta.canonical}`
  );
  assert(
    html.includes('<meta name="description" content="') &&
      html.includes('property="og:title"') &&
      html.includes('name="twitter:card"'),
    `${routeMeta.outputFile} has description, Open Graph, and Twitter Card metadata`
  );
  assert(
    html.includes('id="cm-route-jsonld" type="application/ld+json"'),
    `${routeMeta.outputFile} contains route JSON-LD structured data`
  );
  assert(
    html.includes('/assets/js/analytics.js') &&
      (html.includes('G-MVV7WNL42L') || html.includes('GTM-')) &&
      html.includes('zaubakunby'),
    `${routeMeta.outputFile} integrates coordinated analytics layer (/assets/js/analytics.js + GA4 G-MVV7WNL42L + Clarity zaubakunby)`
  );
}

// 2. Verify Compiled SPA Bundle Excludes Private Draft Records & Includes Hidden Source Map
const assetsDir = path.join(root, 'assets');
const spaBundles = fs.readdirSync(assetsDir).filter((f) => /^spa-[A-Za-z0-9_-]+\.js$/.test(f));
assert(
  spaBundles.length === 1,
  `Exactly one active SPA JS bundle exists in assets/ (found: ${spaBundles.join(', ')})`
);

for (const bundleFile of spaBundles) {
  const bundleContent = fs.readFileSync(path.join(assetsDir, bundleFile), 'utf8');
  const forbiddenTerms = [
    'dealsignal-draft',
    'southern-smoke-draft',
    'tiktok-roi-draft',
    'DealSignal Internal Prototype',
    'Southern Smoke Concept Sandbox',
    'TikTok Shop ROI Analyzer Draft',
    'visibility:"private"',
    "visibility:'private'",
  ];
  for (const term of forbiddenTerms) {
    assert(
      !bundleContent.includes(term),
      `Compiled bundle ${bundleFile} excludes private draft marker "${term}"`
    );
  }
  assert(
    !bundleContent.includes('sourceMappingURL='),
    `Compiled bundle ${bundleFile} uses hidden source map (no public sourceMappingURL comment)`
  );
  const mapPath = path.join(assetsDir, `${bundleFile}.map`);
  assert(fs.existsSync(mapPath), `Hidden source map ${bundleFile}.map generated for Sentry symbolication`);
}

// 3. Verify .vercelignore, Dependabot & sitemap.xml
const vercelIgnorePath = path.join(root, '.vercelignore');
assert(
  fs.existsSync(vercelIgnorePath),
  '.vercelignore exists to exclude unapproved prototype folders and source maps from deployment'
);
if (fs.existsSync(vercelIgnorePath)) {
  const vi = fs.readFileSync(vercelIgnorePath, 'utf8');
  for (const proto of [
    'dealsignal/',
    'star-gift/',
    'istar-map/',
    'tiktok-shop-roi-analyzer/',
    'twenty-minute-override/',
    'southern_smoke/',
    'sixes-and-sevens/',
    'rudyards-comedy/',
    'preview/',
    '*.map',
  ]) {
    assert(vi.includes(proto), `.vercelignore excludes ${proto}`);
  }
}

const dependabotPath = path.join(root, '.github', 'dependabot.yml');
assert(fs.existsSync(dependabotPath), '.github/dependabot.yml exists for automated dependency security updates');

const sitemapPath = path.join(root, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'sitemap.xml exists');
if (fs.existsSync(sitemapPath)) {
  const sm = fs.readFileSync(sitemapPath, 'utf8');
  for (const reqRoute of [
    'https://www.contextmuse.com/',
    'https://www.contextmuse.com/work/',
    'https://www.contextmuse.com/build/',
    'https://www.contextmuse.com/lab/',
    'https://www.contextmuse.com/lab/design-intelligence/',
    'https://www.contextmuse.com/method/',
  ]) {
    assert(sm.includes(`<loc>${reqRoute}</loc>`), `sitemap.xml includes canonical route ${reqRoute}`);
  }
  for (const forbiddenRoute of [
    '/dealsignal/',
    '/star-gift/',
    '/istar-map/',
    '/tiktok-shop-roi-analyzer/',
    '/twenty-minute-override/',
    '/southern_smoke/',
    '/sixes-and-sevens/',
    '/rudyards-comedy/',
    '/preview/',
  ]) {
    assert(!sm.includes(forbiddenRoute), `sitemap.xml excludes unapproved route ${forbiddenRoute}`);
  }
}

console.log(
  `\nLaunch Integrity Verification Complete: ${
    errors.length === 0 ? 'ALL CHECKS PASSED' : `${errors.length} FAILED`
  }`
);
if (errors.length > 0) {
  process.exit(1);
}
