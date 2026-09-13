import fs from 'fs';

const links = JSON.parse(fs.readFileSync('scripts/audit_results.json', 'utf8'));

// Filter for links related to builds/products/showcase/demos/case studies
const buildKeywords = [
  'lonewolf', 'dumpster',
  'inncontrol', 'coil',
  'edr', 'party',
  'signal',
  'gensort',
  'cartography',
  'wolves',
  'd2', 'autodetail',
  'madeofreasons', 'reasons',
  'brainraccoon', 'raccoon',
  'sal', 'steel',
  'restaurant',
  'client-builds',
  'proof-of-work'
];

const buildLinks = [];
const externalBuildLinks = new Set();
const internalBuildRoutes = new Set();

for (const item of links) {
  const isMatch = buildKeywords.some(kw => 
    item.href.toLowerCase().includes(kw) || 
    item.linkText.toLowerCase().includes(kw)
  );
  if (isMatch) {
    buildLinks.push(item);
    if (item.href.startsWith('http')) {
      externalBuildLinks.add(item.href);
    } else {
      internalBuildRoutes.add(item.href);
    }
  }
}

console.log('--- EXTERNAL BUILD / PROJECT LINKS ---');
console.log(Array.from(externalBuildLinks));

console.log('\n--- INTERNAL BUILD / CASE STUDY ROUTES ---');
console.log(Array.from(internalBuildRoutes));

console.log('\n--- DETAILED SUMMARY BY SOURCE PAGE ---');
const byPage = {};
for (const item of buildLinks) {
  if (!byPage[item.sourceFile]) byPage[item.sourceFile] = [];
  byPage[item.sourceFile].push({ text: item.linkText, href: item.href, target: item.target });
}

for (const [page, items] of Object.entries(byPage)) {
  console.log(`\n📄 ${page} (${items.length} build links):`);
  const unique = [];
  const seen = new Set();
  for (const it of items) {
    const key = `${it.text} -> ${it.href}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(it);
    }
  }
  for (const u of unique) {
    console.log(`   • [${u.text}] -> ${u.href} (${u.target})`);
  }
}
