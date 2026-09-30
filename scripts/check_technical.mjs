import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const rootDir = 'C:/Users/rougu/.gemini/antigravity/scratch/contextmuse-homepage';

console.log('=== CHECKING ROBOTS.TXT ===');
const robotsPath = path.join(rootDir, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  console.log(fs.readFileSync(robotsPath, 'utf8'));
} else {
  console.log('robots.txt MISSING!');
}

console.log('=== CHECKING SITEMAP.XML ===');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const urls = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
  console.log(`sitemap.xml has ${urls.length} URLs.`);
  urls.slice(0, 10).forEach(u => console.log('  ' + u.replace(/<\/?loc>/g, '')));
  if (urls.length > 10) console.log(`  ... and ${urls.length - 10} more.`);
} else {
  console.log('sitemap.xml MISSING!');
}

console.log('\n=== CHECKING FORMS IN REPO ===');
const auditData = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch', 'comprehensive_audit_data.json'), 'utf8'));
auditData.forms.forEach(f => {
  console.log(`Page: ${f.relPath}`);
  console.log(`  ID: ${f.id} | Action: ${f.action} | Method: ${f.method}`);
  console.log(`  Inputs (${f.inputCount}): ${f.inputs.slice(0, 8).join(', ')}${f.inputs.length > 8 ? '...' : ''}`);
});

