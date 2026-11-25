import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const { redirects, rewrites, trailingSlash } = JSON.parse(read('vercel.json'));
const knownRoutes = new Map([
  ['/portfolio/', '/work/'],
  ['/custom-tools/', '/build/'],
  ['/custom-builds/', '/build/'],
  ['/websites/', '/build/'],
  ['/work-with-me/', '/method/#ways-to-work-together'],
  ['/index/', '/work/#content-index'],
  ['/design-intelligence/', '/lab/design-intelligence/'],
  ['/blueprints/prompt-pack/', '/prompt-pack/'],
]);
const anchors = new Map([
  ['/work/#content-index', ['src/components/work/SecondaryGallery.jsx', 'content-index']],
  ['/method/#ways-to-work-together', ['src/pages/Method.jsx', 'ways-to-work-together']],
]);

assert.equal(trailingSlash, true);
const sitemap = read('sitemap.xml');
for (const [source, dest] of knownRoutes) {
  const matches = redirects.filter((route) => route.source === source);
  assert.equal(matches.length, 1, `Expected a single redirect for ${source}`);
  assert.equal(matches[0].destination, dest);
  assert.equal(matches[0].permanent, true);
  assert.ok(!rewrites.some((route) => route.source.replace(/\/$/, '') === source.replace(/\/$/, '')));
  assert.ok(!sitemap.includes(`https://www.contextmuse.com${source}</loc>`));
  const path = dest.split(/[?#]/, 1)[0];
  assert.ok(existsSync(new URL(`${path.slice(1)}index.html`, root)), `Missing route HTML for ${dest}`);
  assert.ok(!redirects.some((route) => route.source === path), `Unnecessary redirect chain for ${dest}`);
  assert.ok(sitemap.includes(`https://www.contextmuse.com${path}</loc>`), `Canonical destination not discoverable: ${path}`);
  if (anchors.has(dest)) {
    const [file, anchor] = anchors.get(dest);
    assert.ok(read(file).includes(`id="${anchor}"`), `Missing fragment target: ${dest}`);
  }
}

assert.equal(redirects.find((r) => r.source === '/audit/')?.destination, '/custom/?service=audit#intake');
assert.equal(redirects.find((r) => r.source === '/start/')?.destination, '/custom/#intake');
console.log(`Validated ${knownRoutes.size} alias routes and preserved both legacy intake links.`);

for (const page of ['export-instructions', 'intake', 'restaurant-data-partner']) {
  const html = read(`signal/${page}/index.html`);
  assert.ok(html.includes('href="/method/#ways-to-work-together"'));
  assert.ok(!html.includes('href="/method/#pricing"'));
}
console.log('Validated pricing links in three standalone Signal pages.');
