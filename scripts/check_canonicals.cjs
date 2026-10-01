const fs = require('fs');
const path = require('path');

const raw = JSON.parse(fs.readFileSync('C:/Users/rougu/.gemini/antigravity/brain/c9fe95e3-68e1-478f-823b-4e2584b213be/scratch/seo_crawl_raw.json', 'utf8'));

for (const r of raw) {
  const file = r.relPath;
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  const canMatch = content.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  console.log(r.routePath, '->', canMatch ? canMatch[0] : 'NO CANONICAL');
}
