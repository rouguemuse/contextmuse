import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { SPA_ROUTE_SEO } from '../src/lib/seoRoutes.js';

const root = process.cwd();
const outDir = path.join(root, '.spa-dist');

function escapeHtmlAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderRouteHtml(baseHtml, routeMeta) {
  let html = baseHtml;
  const escapedTitle = escapeHtmlAttr(routeMeta.title);
  const escapedDesc = escapeHtmlAttr(routeMeta.description);
  const escapedCanonical = escapeHtmlAttr(routeMeta.canonical);
  const escapedOgType = escapeHtmlAttr(routeMeta.ogType || 'website');
  const escapedOgImage = escapeHtmlAttr(routeMeta.ogImage);
  const jsonLdString = JSON.stringify(routeMeta.jsonLd, null, 2);

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapedTitle}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapedDesc}" />`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapedCanonical}" />`
  );
  if (routeMeta.preloadImage) {
    html = html.replace(
      /<link rel="canonical" href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${escapedCanonical}" />\n    <link rel="preload" as="image" href="${escapeHtmlAttr(routeMeta.preloadImage)}" fetchpriority="high" />`
    );
  }
  html = html.replace(
    /<meta property="og:type" content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="${escapedOgType}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${escapedCanonical}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapedTitle}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapedDesc}" />`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${escapedOgImage}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapedTitle}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapedDesc}" />`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${escapedOgImage}" />`
  );
  html = html.replace(
    /<script id="cm-route-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script id="cm-route-jsonld" type="application/ld+json">\n${jsonLdString}\n    </script>`
  );

  if (routeMeta.h1 && routeMeta.lead) {
    const initialShell = `<div id="root"><div style="min-height:100vh;background:#23282A;color:#EDE9E0;font-family:system-ui,-apple-system,sans-serif;padding:2.5rem 1.5rem;"><div style="max-width:1280px;margin:0 auto;"><p style="font-family:monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#D9A62E;margin:0 0 0.75rem 0;">CONTEXT &amp; MUSE</p><h1 style="font-size:clamp(2rem,5vw,4rem);font-weight:900;text-transform:uppercase;line-height:1;margin:0 0 1rem 0;color:#EDE9E0;">${escapeHtmlAttr(routeMeta.h1)}</h1><p style="max-width:62ch;font-size:15px;line-height:1.6;color:#DFDACE;margin:0 0 1.5rem 0;">${escapeHtmlAttr(routeMeta.lead)}</p><nav aria-label="Primary links" style="display:flex;flex-wrap:wrap;gap:12px;font-family:monospace;font-size:12px;"><a href="/work/" style="color:#D9A62E;">The Work</a><a href="/services/quote-lead-systems/" style="color:#D9A62E;">Quote + Lead Systems</a><a href="/services/" style="color:#D9A62E;">Services</a><a href="/case-studies/edr-party-rentals/" style="color:#D9A62E;">EDR Party Rentals Case Study</a><a href="/work/lone-wolf-dumpsters/" style="color:#D9A62E;">Lone Wolf Dumpsters Case Study</a><a href="/contact/" style="color:#D9A62E;">Start a Project</a></nav></div></div></div>`;
    html = html.replace(/<div id="root"><\/div>/, initialShell);
  }

  return html;
}

console.log('[build:spa] Running Vite build from spa.html -> .spa-dist...');
execSync('npx vite build', { stdio: 'inherit', cwd: root });

const builtHtmlPath = path.join(outDir, 'spa.html');
if (!fs.existsSync(builtHtmlPath)) {
  throw new Error('Expected .spa-dist/spa.html was not generated');
}

// Remove previous hashed index-*.js and spa-*.js/css/map in root assets/
const rootAssetsDir = path.join(root, 'assets');
for (const f of fs.readdirSync(rootAssetsDir)) {
  if (/^(index|spa)-[A-Za-z0-9_-]+\.(js|css|js\.map)$/.test(f)) {
    fs.unlinkSync(path.join(rootAssetsDir, f));
  }
}

// Copy new hashed bundles and hidden sourcemaps from .spa-dist/assets/ into root assets/
const builtAssetsDir = path.join(outDir, 'assets');
const copiedBundles = [];
for (const f of fs.readdirSync(builtAssetsDir)) {
  const srcFile = path.join(builtAssetsDir, f);
  if (fs.statSync(srcFile).isFile()) {
    fs.copyFileSync(srcFile, path.join(rootAssetsDir, f));
    copiedBundles.push(f);
  }
}

// Write route-specific pre-rendered HTML entry points for crawler-visible metadata
const baseCompiledHtml = fs.readFileSync(builtHtmlPath, 'utf8');
const generatedHtmlRoutes = [];
for (const routeMeta of Object.values(SPA_ROUTE_SEO)) {
  const targetPath = path.join(root, routeMeta.outputFile);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const routeHtml = renderRouteHtml(baseCompiledHtml, routeMeta);
  fs.writeFileSync(targetPath, routeHtml, 'utf8');
  generatedHtmlRoutes.push(routeMeta.outputFile);
}

fs.rmSync(outDir, { recursive: true, force: true });

console.log('[build:spa] Updated assets/:', copiedBundles.join(', '));
console.log('[build:spa] Generated route HTML entry files:', generatedHtmlRoutes.join(', '));
