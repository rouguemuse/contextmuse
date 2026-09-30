import fs from 'fs';
import path from 'path';

const rootDir = 'C:/Users/rougu/.gemini/antigravity/scratch/contextmuse-homepage';
const auditData = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch', 'comprehensive_audit_data.json'), 'utf8'));

const brokenLinks = [];

auditData.internalLinks.forEach(link => {
  let target = link.href.split('#')[0].split('?')[0];
  if (!target) return; // Anchor only

  let targetPath = '';
  if (target.startsWith('/')) {
    targetPath = path.join(rootDir, target.slice(1));
  } else {
    targetPath = path.join(rootDir, path.dirname(link.page), target);
  }

  let exists = false;
  if (fs.existsSync(targetPath)) {
    if (fs.statSync(targetPath).isDirectory()) {
      exists = fs.existsSync(path.join(targetPath, 'index.html'));
    } else {
      exists = true;
    }
  } else if (fs.existsSync(targetPath + '.html')) {
    exists = true;
  }

  if (!exists) {
    brokenLinks.push({
      from: link.page,
      href: link.href,
      text: link.text
    });
  }
});

console.log(`Audited ${auditData.internalLinks.length} internal links.`);
console.log(`Found ${brokenLinks.length} broken internal links:`);
const uniqueBroken = {};
brokenLinks.forEach(b => {
  const key = `${b.href} (from ${b.from})`;
  uniqueBroken[key] = b;
});
Object.values(uniqueBroken).forEach(b => console.log(`  From: ${b.from} -> Link: ${b.href} ("${b.text}")`));

