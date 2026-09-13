import fs from 'fs';

const links = JSON.parse(fs.readFileSync('scripts/audit_results.json', 'utf8'));

const externalUrls = new Set();
const internalPaths = new Set();

for (const item of links) {
  if (item.href.startsWith('http://') || item.href.startsWith('https://')) {
    externalUrls.add(item.href);
  } else if (item.href.startsWith('/')) {
    internalPaths.add(item.href);
  }
}

console.log('=== EXTERNAL LINKS AUDIT ===');
const externalArr = Array.from(externalUrls);
for (const url of externalArr) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`[${res.status}] ${url}`);
  } catch (err) {
    try {
      const res = await fetch(url, { method: 'GET' });
      console.log(`[${res.status}] ${url}`);
    } catch (e) {
      console.log(`[ERR: ${e.message}] ${url}`);
    }
  }
}

console.log('\n=== INTERNAL SHOWCASE & BUILD ROUTES AUDIT ===');
const internalArr = Array.from(internalPaths);
for (const p of internalArr) {
  let cleanPath = p.split('#')[0].split('?')[0];
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);
  if (cleanPath === '' || cleanPath.endsWith('/')) {
    cleanPath += 'index.html';
  }
  const exists = fs.existsSync(cleanPath);
  console.log(`[${exists ? 'EXISTS' : 'MISSING'}] ${p} (resolved: ${cleanPath})`);
}
