import fs from 'fs';
import path from 'path';

const ROOT_DIR = 'C:/Users/rougu/.gemini/antigravity/scratch/contextmuse-homepage';

const navPartialPath = path.join(ROOT_DIR, 'partials/nav.html');
const footerPartialPath = path.join(ROOT_DIR, 'partials/footer.html');

if (!fs.existsSync(navPartialPath) || !fs.existsSync(footerPartialPath)) {
  console.error('Missing nav.html or footer.html partials!');
  process.exit(1);
}

const navContent = fs.readFileSync(navPartialPath, 'utf8').trim();
const footerContent = fs.readFileSync(footerPartialPath, 'utf8').trim();

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    // Ignore internal folders, artifacts, node_modules, .git, scratch
    if (['node_modules', '.git', 'scratch', 'dist', 'cxm_gensort'].includes(file)) return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html') && !fullPath.includes('partials')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getAllHtmlFiles(ROOT_DIR);
console.log(`Found ${htmlFiles.length} HTML files to synchronize with canonical shell...`);

const navRegex = /<!--\s*Navbar\s*-->[\s\S]*?<nav[\s\S]*?<\/nav>/i;
const fallbackNavRegex = /<nav class="navbar"[\s\S]*?<\/nav>/i;

const footerRegex = /<!--\s*──\s*FOOTER[\s\S]*?<\/footer>(\s*<script src="\/assets\/js\/nav\.js" defer><\/script>)?/i;
const fallbackFooterRegex = /<footer[\s\S]*?<\/footer>(\s*<script src="\/assets\/js\/nav\.js" defer><\/script>)?/i;

let updatedCount = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace navbar
  if (navRegex.test(content)) {
    content = content.replace(navRegex, navContent);
  } else if (fallbackNavRegex.test(content)) {
    content = content.replace(fallbackNavRegex, navContent);
  }

  // Replace footer
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, footerContent);
  } else if (fallbackFooterRegex.test(content)) {
    content = content.replace(fallbackFooterRegex, footerContent);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Synced shell in: ${path.relative(ROOT_DIR, filePath)}`);
    updatedCount++;
  } else {
    console.log(`  - No changes needed: ${path.relative(ROOT_DIR, filePath)}`);
  }
});

console.log(`\nSuccessfully synchronized canonical nav and footer across ${updatedCount} files.`);
