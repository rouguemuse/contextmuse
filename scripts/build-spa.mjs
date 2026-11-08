import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const outDir = path.join(root, '.spa-dist');

console.log('[build:spa] Running Vite build from spa.html -> .spa-dist...');
execSync('npx vite build', { stdio: 'inherit', cwd: root });

const builtHtmlPath = path.join(outDir, 'spa.html');
if (!fs.existsSync(builtHtmlPath)) {
  throw new Error('Expected .spa-dist/spa.html was not generated');
}

// Remove previous hashed index-*.js and index-*.css in root assets/
const rootAssetsDir = path.join(root, 'assets');
for (const f of fs.readdirSync(rootAssetsDir)) {
  if (/^(index|spa)-[A-Za-z0-9_-]+\.(js|css)$/.test(f)) {
    fs.unlinkSync(path.join(rootAssetsDir, f));
  }
}

// Copy new hashed bundles from .spa-dist/assets/ into root assets/
const builtAssetsDir = path.join(outDir, 'assets');
const copiedBundles = [];
for (const f of fs.readdirSync(builtAssetsDir)) {
  fs.copyFileSync(path.join(builtAssetsDir, f), path.join(rootAssetsDir, f));
  copiedBundles.push(f);
}

// Write compiled spa.html to root index.html
fs.copyFileSync(builtHtmlPath, path.join(root, 'index.html'));
fs.rmSync(outDir, { recursive: true, force: true });

console.log('[build:spa] Updated root index.html and assets/:', copiedBundles.join(', '));
