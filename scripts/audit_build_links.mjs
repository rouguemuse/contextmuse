import fs from 'fs';
import path from 'path';

const htmlFiles = [];

function findHtml(dir) {
  const fullDir = path.resolve(dir);
  if (!fs.existsSync(fullDir)) return;
  const entries = fs.readdirSync(fullDir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      findHtml(res);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(res);
    }
  }
}

findHtml('.');

const buildAudit = [];

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const aTagRegex = /<a\s+([^>]*?)href=(["'])(.*?)\2([^>]*?)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = aTagRegex.exec(content)) !== null) {
    const fullAttrs = match[1] + ' ' + match[4];
    const href = match[3];
    const text = match[5].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    
    buildAudit.push({
      sourceFile: file.replace(/\\/g, '/'),
      linkText: text,
      href: href,
      target: fullAttrs.includes('target="_blank"') ? '_blank' : '_self'
    });
  }
}

fs.writeFileSync('scripts/audit_results.json', JSON.stringify(buildAudit, null, 2));
console.log('Total links found:', buildAudit.length);
