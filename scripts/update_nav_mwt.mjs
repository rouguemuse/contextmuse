import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory && f !== 'node_modules' && f !== '.git') {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.html') || f.endsWith('.js') || f.endsWith('.mjs')) {
      callback(dirPath);
    }
  });
}

const target = '<a href="/gensort/" class="nav-dropdown-link">GenSort</a>';
const replacement = `<a href="/gensort/" class="nav-dropdown-link">GenSort</a>\n                        <a href="https://www.mapswithteeth.org/" target="_blank" rel="noopener" class="nav-dropdown-link">Maps With Teeth ↗</a>`;

let count = 0;
walkDir('.', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(target) && !content.includes('https://www.mapswithteeth.org/')) {
    content = content.replaceAll(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated nav in: ${filePath}`);
    count++;
  }
});

console.log(`Total files updated: ${count}`);
