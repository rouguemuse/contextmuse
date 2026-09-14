import fs from 'fs';
import path from 'path';

function getFiles(dir, filter) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
      results = results.concat(getFiles(filePath, filter));
    } else if (filter(filePath)) {
      results.push(filePath);
    }
  });
  return results;
}

const htmlFiles = getFiles('.', f => f.endsWith('.html'));

console.log(`Total HTML files found: ${htmlFiles.length}`);

const auditReport = [];

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const title = content.match(/<title>([^<]*)<\/title>/i)?.[1] || null;
  const metaDesc = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1] || null;
  const canonical = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i)?.[1] || null;
  const robots = content.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i)?.[1] || null;
  const ogTitle = content.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i)?.[1] || null;
  const ogDesc = content.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i)?.[1] || null;
  const ogUrl = content.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/i)?.[1] || null;
  const ogImage = content.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i)?.[1] || null;
  const twitterCard = content.match(/<meta\s+name=["']twitter:card["']\s+content=["']([^"']*)["']/i)?.[1] || null;
  const h1s = Array.from(content.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const schemaScripts = Array.from(content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)).map(m => {
    try { return JSON.parse(m[1]); } catch(e) { return 'INVALID JSON'; }
  });

  auditReport.push({
    file: file.replace(/\\/g, '/'),
    title,
    metaDesc,
    canonical,
    robots,
    ogTitle,
    ogDesc,
    ogUrl,
    ogImage,
    twitterCard,
    h1Count: h1s.length,
    h1s,
    schemaCount: schemaScripts.length,
    schemas: schemaScripts
  });
}

fs.writeFileSync('scripts/seo_audit_raw.json', JSON.stringify(auditReport, null, 2));
console.log('Saved raw SEO audit to scripts/seo_audit_raw.json');
