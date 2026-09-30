import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const rootDir = 'C:/Users/rougu/.gemini/antigravity/scratch/contextmuse-homepage';
const auditData = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch', 'comprehensive_audit_data.json'), 'utf8'));

console.log('=== STRUCTURED DATA AUDIT ===');
auditData.routes.forEach(r => {
  if (r.relPath.includes('backup') || r.relPath.includes('scratch') || r.relPath.includes('partials')) return;
  const filePath = path.join(rootDir, r.relPath);
  const content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  const jsonLd = $('script[type="application/ld+json"]').html();
  if (jsonLd) {
    try {
      const parsed = JSON.parse(jsonLd);
      console.log(`[PASS] ${r.relPath}: ${parsed['@type'] || 'JSON-LD present'} - ${parsed.name || parsed.headline || ''}`);
    } catch (e) {
      console.log(`[ERROR] ${r.relPath}: Invalid JSON in ld+json!`);
    }
  } else {
    console.log(`[MISSING] ${r.relPath}: No JSON-LD schema`);
  }
});
