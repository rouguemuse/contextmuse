import fs from 'fs';
import path from 'path';

const rootDir = 'C:/Users/rougu/.gemini/antigravity/scratch/contextmuse-homepage';
const sitemapContent = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
const sitemapUrls = (sitemapContent.match(/<loc>(.*?)<\/loc>/g) || []).map(u => u.replace(/<\/?loc>/g, '').trim());

const auditData = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch', 'comprehensive_audit_data.json'), 'utf8'));

console.log(`Sitemap URLs count: ${sitemapUrls.length}`);

const pagesInSitemap = new Set(sitemapUrls.map(u => {
  let p = u.replace('https://www.contextmuse.com', '');
  if (p === '' || p === '/') return 'index.html';
  if (p.endsWith('/')) return p.slice(1) + 'index.html';
  return p.slice(1);
}));

const missingFromSitemap = [];
auditData.routes.forEach(r => {
  if (r.relPath.includes('backup') || r.relPath.includes('scratch') || r.relPath.includes('partials') || r.relPath === '404.html') return;
  if (!pagesInSitemap.has(r.relPath)) {
    missingFromSitemap.push(r.relPath);
  }
});

console.log(`Routes missing from sitemap.xml (${missingFromSitemap.length}):`);
missingFromSitemap.forEach(m => console.log('  ' + m));

