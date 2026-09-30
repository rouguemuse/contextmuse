import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const gensortDistDir = path.resolve(rootDir, '..', 'cxm_gensort', 'dist');

const PORT = 4522;
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = parsedUrl.pathname;
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(gensortDistDir, pathname);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexHtml = path.join(gensortDistDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexHtml).pipe(res);
  }
});

const assetSources = [
  { file: 'brutalist_lobby.jpg', name: 'brutalist_pavilion_dawn_01.png', folder: 'Architectural Renders', collection: 'client', width: 2400, height: 1350, dominantColors: ['#1e293b', '#c5a059', '#334155', '#e2e8f0', '#0f766e'], tags: ['architecture', 'brutalist', 'client-ready', 'lighting'], aiTags: ['cinematic', 'photorealistic', 'v6.0'], prompt: 'Editorial architectural perspective of brutalist concrete pavilion, diffuse morning sunlight through mist, minimal typography cues, 35mm photograph, architectural digest style --ar 16:9 --style raw --v 6.0', seed: '3892714018', steps: 35, cfg: 7.0, sampler: 'DPM++ 2M Karras' },
  { file: 'blueprint_draft.jpg', name: 'brutalist_pavilion_dawn_02.png', folder: 'Architectural Renders', collection: 'best', width: 2400, height: 1350, dominantColors: ['#0f172a', '#3b82f6', '#1e293b', '#64748b', '#94a3b8'], tags: ['architecture', 'blueprint', 'study', 'v6.0'], aiTags: ['technical', 'isometric', 'draft'], prompt: 'Editorial architectural perspective of brutalist concrete pavilion, technical blueprint overlay, diffuse morning daylight, minimal typography cues --ar 16:9 --style raw --v 6.0', seed: '3892714019', steps: 40, cfg: 8.5, sampler: 'DPM++ 2M Karras' },
  { file: 'hero_luxury_editorial_draft.jpg', name: 'editorial_study_cinematic_04.png', folder: 'Editorial Systems', collection: 'client', width: 2560, height: 1440, dominantColors: ['#18181b', '#d4af37', '#27272a', '#f4f4f5', '#52525b'], tags: ['editorial', 'cinematic', 'client-ready', 'luxury'], aiTags: ['lighting', 'portrait', 'v6.0'], prompt: 'Luxury editorial spatial composition with tactile warm lighting, museum catalog curation, studio photography --ar 16:9 --style raw --v 6.0', seed: '8491028371', steps: 32, cfg: 6.5, sampler: 'Euler a' },
  { file: 'hero_ultra_premium_crystal.jpg', name: 'editorial_study_cinematic_05.png', folder: 'Editorial Systems', collection: 'best', width: 2560, height: 1440, dominantColors: ['#09090b', '#38bdf8', '#1e293b', '#7dd3fc', '#e0f2fe'], tags: ['editorial', 'spatial', 'crystal', 'lighting'], aiTags: ['refraction', '3d-render', 'v6.0'], prompt: 'Prismatic crystal refraction in dark studio setting, caustics simulation, hyper-minimalist editorial --ar 16:9 --style raw --v 6.0', seed: '8491028372', steps: 32, cfg: 7.0, sampler: 'Euler a' },
  { file: 'creative_hero_map.jpg', name: 'cartography_topography_grid.png', folder: 'Midjourney Explorations', collection: 'references', width: 2048, height: 1152, dominantColors: ['#1c1917', '#c5a059', '#44403c', '#78716c', '#a8a29e'], tags: ['cartography', 'topography', 'exploration', 'vector'], aiTags: ['vintage-map', 'relief', 'v6.0'], prompt: 'Topographic contour terrain map of coastal ridge, vintage surveying aesthetics, fine line etching --ar 16:9 --v 6.0', seed: '1928374650', steps: 30, cfg: 7.0, sampler: 'DPM++ 2M Karras' },
  { file: 'the_red_thread.jpg', name: 'the_red_thread_spatial_01.png', folder: 'Editorial Systems', collection: 'client', width: 2048, height: 1365, dominantColors: ['#450a0a', '#b91c1c', '#1c1917', '#f87171', '#fecaca'], tags: ['editorial', 'red-thread', 'cinematic', 'client-ready'], aiTags: ['symbolic', 'dramatic-light', 'v6.0'], prompt: 'Single red thread traversing brutalist interior space, high contrast, cinematic atmosphere, 35mm film --ar 3:2 --v 6.0', seed: '5647382910', steps: 35, cfg: 7.5, sampler: 'DPM++ 2M Karras' },
  { file: 'forest_other_peoples_weather.jpg', name: 'forest_atmospheric_depth_03.png', folder: 'Midjourney Explorations', collection: 'references', width: 2048, height: 1152, dominantColors: ['#052e16', '#15803d', '#14532d', '#86efac', '#022c22'], tags: ['atmospheric', 'forest', 'lighting', 'study'], aiTags: ['nature', 'fog', 'morning-light'], prompt: 'Dense misty pine forest with directional morning sun rays, deep atmospheric perspective --ar 16:9 --v 6.0', seed: '7483920182', steps: 30, cfg: 6.0, sampler: 'Euler a' },
  { file: 'mountain_mist.jpg', name: 'mountain_elevation_study_b.png', folder: 'Midjourney Explorations', collection: 'maybe', width: 2400, height: 1350, dominantColors: ['#0f172a', '#475569', '#1e293b', '#94a3b8', '#cbd5e1'], tags: ['mountain', 'atmospheric', 'landscape', 'v6.0'], aiTags: ['elevation', 'mist', 'cinematic'], prompt: 'Moody alpine mountain ridge shrouded in low hanging clouds, monochromatic cold tones --ar 16:9 --v 6.0', seed: '6271938401', steps: 28, cfg: 7.0, sampler: 'DPM++ 2M Karras' },
  { file: 'wolves_charcoal_art.jpg', name: 'wolves_charcoal_expression.png', folder: 'Brand Vectors & Identity', collection: 'client', width: 2048, height: 2048, dominantColors: ['#18181b', '#71717a', '#27272a', '#a1a1aa', '#e4e4e7'], tags: ['illustration', 'charcoal', 'brand', 'client-ready'], aiTags: ['monochrome', 'tactile', 'expressionist'], prompt: 'Expressive charcoal and ink sketch of wild timberwolf, dynamic stroke economy, textured paper --ar 1:1 --v 6.0', seed: '9182736450', steps: 32, cfg: 8.0, sampler: 'DPM++ 2M Karras' },
  { file: 'wolves_editorial_art.jpg', name: 'wolves_editorial_duotone.png', folder: 'Brand Vectors & Identity', collection: 'best', width: 2048, height: 2048, dominantColors: ['#0c0a09', '#ea580c', '#292524', '#fb923c', '#fed7aa'], tags: ['brand', 'editorial', 'duotone', 'vector'], aiTags: ['print-design', 'graphic', 'v6.0'], prompt: 'Editorial duotone screenprint illustration of wolf pack in wilderness, terracotta and black ink --ar 1:1 --v 6.0', seed: '9182736451', steps: 35, cfg: 7.5, sampler: 'DPM++ 2M Karras' },
  { file: 'moody_runner.jpg', name: 'motion_study_running_silhouette.png', folder: 'Midjourney Explorations', collection: 'maybe', width: 2048, height: 1152, dominantColors: ['#090a0f', '#0f766e', '#134e4a', '#2dd4bf', '#ccfbf1'], tags: ['cinematic', 'silhouette', 'motion', 'lighting'], aiTags: ['figure', 'teal-atmosphere', 'v6.0'], prompt: 'Silhouette of athlete running through rain slicked urban asphalt at night, cyan ambient reflections --ar 16:9 --v 6.0', seed: '4839201928', steps: 30, cfg: 7.0, sampler: 'Euler a' },
  { file: 'provisional_understanding.jpg', name: 'abstract_spatial_geometry_01.png', folder: 'Editorial Systems', collection: 'references', width: 2048, height: 1536, dominantColors: ['#1c1917', '#c5a059', '#292524', '#d6d3d1', '#f5f5f4'], tags: ['editorial', 'geometry', 'abstract', 'spatial'], aiTags: ['sculpture', 'minimalism', 'v6.0'], prompt: 'Architectural geometry study with intersecting planar volumes, natural limestone texture, warm shadow gradients --ar 4:3 --v 6.0', seed: '3728192039', steps: 35, cfg: 6.5, sampler: 'DPM++ 2M Karras' },
  { file: 'hero_context_muse_blueprint.jpg', name: 'architectural_blueprint_plan_v2.png', folder: 'Architectural Renders', collection: 'client', width: 2400, height: 1350, dominantColors: ['#0f172a', '#1e293b', '#38bdf8', '#64748b', '#e2e8f0'], tags: ['architecture', 'blueprint', 'client-ready', 'cad'], aiTags: ['technical-drawing', 'schematic', 'vector'], prompt: 'Precision CAD architectural floor plan and structural axonometric section, clean white linework on deep navy --ar 16:9 --v 6.0', seed: '2839102948', steps: 40, cfg: 8.0, sampler: 'DPM++ 2M Karras' },
  { file: 'dear_reader_artifact.png', name: 'editorial_manuscript_artifact.png', folder: 'Brand Vectors & Identity', collection: 'client', width: 2048, height: 1536, dominantColors: ['#18181b', '#f5f5f4', '#27272a', '#a1a1aa', '#e4e4e7'], tags: ['brand', 'editorial', 'typography', 'client-ready'], aiTags: ['print', 'publication', 'layout'], prompt: 'Typeset editorial broadside with classic serif typography, deckled edge cotton paper, archival specimen --ar 4:3 --v 6.0', seed: '5849302918', steps: 30, cfg: 7.0, sampler: 'Euler a' },
  { file: 'restaurant_operations_map.jpg', name: 'systems_workflow_diagram_01.png', folder: 'Midjourney Explorations', collection: 'maybe', width: 2048, height: 1152, dominantColors: ['#0f172a', '#0d9488', '#334155', '#2dd4bf', '#f1f5f9'], tags: ['systems', 'workflow', 'diagram', 'operations'], aiTags: ['information-design', 'flowchart', 'v6.0'], prompt: 'Complex operational workflow node graph, digital system routing diagram, dark UI aesthetic --ar 16:9 --v 6.0', seed: '7182930491', steps: 32, cfg: 7.0, sampler: 'DPM++ 2M Karras' },
  { file: 'cartographers_defect_preview.png', name: 'cartographic_defect_study_v1.png', folder: 'Brand Vectors & Identity', collection: 'references', width: 2048, height: 1365, dominantColors: ['#1c1917', '#78350f', '#44403c', '#d97706', '#fef3c7'], tags: ['cartography', 'illustration', 'brand', 'study'], aiTags: ['hand-drawn', 'lithograph', 'v6.0'], prompt: 'Hand engraved vintage navigational chart showing ocean currents and magnetic anomalies --ar 3:2 --v 6.0', seed: '6172839401', steps: 35, cfg: 7.5, sampler: 'DPM++ 2M Karras' }
];

server.listen(PORT, async () => {
  console.log(`GenSort static test server running on port ${PORT}...`);
  try {
    const imagesDir = path.resolve(rootDir, 'assets', 'images');
    const preparedAssets = [];

    for (let i = 0; i < assetSources.length; i++) {
      const src = assetSources[i];
      const filePath = path.join(imagesDir, src.file);
      if (fs.existsSync(filePath)) {
        const fileBuf = fs.readFileSync(filePath);
        const ext = path.extname(src.file).toLowerCase();
        const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        const dataUrl = `data:${mime};base64,${fileBuf.toString('base64')}`;

        preparedAssets.push({
          id: i + 1,
          name: src.name,
          path: `/Volumes/Studio/${src.folder}/${src.name}`,
          folder: `/Volumes/Studio/${src.folder}`,
          collection: src.collection,
          size: fileBuf.length,
          width: src.width,
          height: src.height,
          type: 'image/png',
          thumbnail: dataUrl,
          mediaType: 'asset',
          tags: src.tags,
          aiTags: src.aiTags,
          dominantColors: src.dominantColors,
          isFavorite: src.collection === 'best' || i === 0,
          generationData: {
            prompt: src.prompt,
            negativePrompt: 'blurry, low resolution, saturated colors, cartoon, watermark, distorted lines',
            seed: src.seed,
            sampler: src.sampler,
            steps: src.steps,
            cfg: src.cfg
          },
          createdAt: new Date(Date.now() - (i * 7200000)).toISOString()
        });
      }
    }

    console.log(`Loaded ${preparedAssets.length} real Context & Muse asset files.`);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 2 });

    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    console.log('Seeding SignalShelfDB in browser...');
    await page.evaluate(async (assets) => {
      const dReq = indexedDB.open('SignalShelfDB');
      const db = await new Promise((resolve, reject) => {
        dReq.onsuccess = () => resolve(dReq.result);
        dReq.onerror = () => reject(dReq.error);
      });

      const tx = db.transaction(['images', 'folders'], 'readwrite');
      const store = tx.objectStore('images');
      const folderStore = tx.objectStore('folders');

      await new Promise(r => {
        const req = store.clear();
        req.onsuccess = r;
      });

      await new Promise(r => {
        const req = folderStore.clear();
        req.onsuccess = r;
      });

      const folders = [
        { id: 1, name: 'Architectural Renders', path: '/Volumes/Studio/Architectural Renders', lastScanned: new Date().toISOString() },
        { id: 2, name: 'Editorial Systems', path: '/Volumes/Studio/Editorial Systems', lastScanned: new Date().toISOString() },
        { id: 3, name: 'Midjourney Explorations', path: '/Volumes/Studio/Midjourney Explorations', lastScanned: new Date().toISOString() },
        { id: 4, name: 'Brand Vectors & Identity', path: '/Volumes/Studio/Brand Vectors & Identity', lastScanned: new Date().toISOString() }
      ];

      for (const f of folders) {
        folderStore.add(f);
      }

      for (const a of assets) {
        store.add(a);
      }

      await new Promise(resolve => tx.oncomplete = resolve);
    }, preparedAssets);

    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));

    const outDir = path.resolve(rootDir, 'assets', 'images');

    console.log('Capturing 01: Main Populated Library...');
    await page.screenshot({
      path: path.join(outDir, 'gensort-hero-library.webp'),
      type: 'webp',
      quality: 95
    });
    await page.screenshot({
      path: path.join(outDir, 'gensort-library.webp'),
      type: 'webp',
      quality: 95
    });

    console.log('Opening Inspector on brutalist_pavilion_dawn_01.png...');
    const firstCard = await page.$('.asset-card, .image-card');
    if (firstCard) {
      await firstCard.click();
      await new Promise(r => setTimeout(r, 1200));

      console.log('Capturing 02: Selected Asset / Inspector View...');
      await page.screenshot({
        path: path.join(outDir, 'gensort-asset-inspector.webp'),
        type: 'webp',
        quality: 95
      });
      await page.screenshot({
        path: path.join(outDir, 'gensort-inspector.webp'),
        type: 'webp',
        quality: 95
      });
    }

    console.log('Configuring Compare Mode between asset 1 and asset 2...');
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    const cards = await page.$$('.asset-card, .image-card');
    if (cards.length >= 2) {
      await cards[0].click();
      await new Promise(r => setTimeout(r, 600));
      await page.keyboard.down('Shift');
      await cards[1].click();
      await page.keyboard.up('Shift');
      await new Promise(r => setTimeout(r, 800));

      const compareButton = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent.includes('Compare'));
      });

      if (compareButton) {
        await compareButton.click();
      } else {
        await page.evaluate(() => window.dispatchEvent(new CustomEvent('open-compare')));
      }

      await new Promise(r => setTimeout(r, 1200));

      console.log('Capturing 03: Compare Mode / Parameter Diff...');
      await page.screenshot({
        path: path.join(outDir, 'gensort-compare-view.webp'),
        type: 'webp',
        quality: 95
      });
      await page.screenshot({
        path: path.join(outDir, 'gensort-compare.webp'),
        type: 'webp',
        quality: 95
      });
    }

    console.log('Configuring Filtered / Search State...');
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    const searchInput = await page.$('.search-input');
    if (searchInput) {
      await searchInput.type('architecture', { delay: 60 });
      await new Promise(r => setTimeout(r, 1000));

      console.log('Capturing 04: Filtered State (Search: "architecture")...');
      await page.screenshot({
        path: path.join(outDir, 'gensort-search-filter.webp'),
        type: 'webp',
        quality: 95
      });
    }

    await browser.close();
    console.log('All real GenSort screenshots successfully generated and saved with live folder counts!');
  } catch (err) {
    console.error('Screenshot generation error:', err);
  } finally {
    server.close();
  }
});
