const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    if (['node_modules', '.git', '.vercel', 'dist', 'build', '.tempmediaStorage'].includes(f)) continue;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) res = res.concat(walk(p));
    else if (f.endsWith('.html') || f.endsWith('.js')) res.push(p);
  }
  return res;
}

const files = walk('.');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const hasSubmit = content.includes("addEventListener('submit'") || content.includes('addEventListener("submit"');
  const hasFormspree = content.includes('formspree.io');
  const hasFetch = content.includes('fetch(');
  if (hasSubmit || hasFormspree) {
    console.log(`FILE: ${file} | submitListener: ${hasSubmit} | formspree: ${hasFormspree}`);
  }
}
