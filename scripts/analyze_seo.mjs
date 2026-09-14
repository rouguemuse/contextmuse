import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/seo_audit_raw.json', 'utf8'));

console.log('=== 1. CANONICAL & TITLE AUDIT ===');
const missingTitle = [];
const missingDesc = [];
const missingCanonical = [];
const missingH1 = [];
const multipleH1 = [];
const noSchema = [];
const nonCanonicalHrefs = [];

for (const p of data) {
  if (!p.title) missingTitle.push(p.file);
  if (!p.metaDesc) missingDesc.push(p.file);
  if (!p.canonical) missingCanonical.push(p.file);
  if (p.h1Count === 0) missingH1.push(p.file);
  if (p.h1Count > 1) multipleH1.push({ file: p.file, h1s: p.h1s });
  if (p.schemaCount === 0) noSchema.push(p.file);
}

console.log(`Missing title: ${missingTitle.length}`, missingTitle);
console.log(`Missing metaDesc: ${missingDesc.length}`, missingDesc);
console.log(`Missing canonical: ${missingCanonical.length}`, missingCanonical);
console.log(`Missing H1: ${missingH1.length}`, missingH1);
console.log(`Multiple H1s: ${multipleH1.length}`, multipleH1);
console.log(`No Schema (JSON-LD): ${noSchema.length}`, noSchema);

console.log('\n=== 2. SITEMAP DISCREPANCY AUDIT ===');
const sitemapXml = fs.readFileSync('sitemap.xml', 'utf8');
const sitemapUrls = Array.from(sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1]);

console.log(`Total URLs in sitemap: ${sitemapUrls.length}`);

// Check each HTML file against sitemap
const publicHtmls = data.filter(d => !d.file.includes('node_modules') && !d.file.includes('scratch') && d.file !== '404.html' && d.file !== 'index.backup.html' && !d.file.startsWith('preview/'));

for (const p of publicHtmls) {
  let expectedUrl = 'https://www.contextmuse.com/' + p.file.replace(/index\.html$/, '').replace(/\.html$/, '');
  if (!expectedUrl.endsWith('/')) expectedUrl += '/';
  if (p.file === 'index.html') expectedUrl = 'https://www.contextmuse.com/';
  
  const inSitemap = sitemapUrls.includes(expectedUrl);
  if (!inSitemap) {
    console.log(`[NOT IN SITEMAP] ${p.file} -> expected: ${expectedUrl}`);
  }
}

for (const sUrl of sitemapUrls) {
  let rel = sUrl.replace('https://www.contextmuse.com/', '');
  if (rel === '') rel = 'index.html';
  else if (rel.endsWith('/')) rel += 'index.html';
  if (!fs.existsSync(rel)) {
    console.log(`[SITEMAP URL MISSING FILE] ${sUrl} -> ${rel}`);
  }
}
