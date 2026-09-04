import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const projectRoot = 'C:\\Users\\rougu\\.gemini\\antigravity\\scratch\\contextmuse-homepage';
const inputImage = path.join(projectRoot, 'assets', 'images', 'hero_luxury_editorial_draft.jpg');
const outputImage = path.join(projectRoot, 'assets', 'images', 'contextmuse_hero_architectural.png');

const imageBase64 = fs.readFileSync(inputImage).toString('base64');

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

await page.setContent(`
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: transparent; }
  canvas { display: block; }
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
  const img = new Image();
  img.src = "data:image/jpeg;base64,${imageBase64}";
  img.onload = () => {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const canvas = document.getElementById('c');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    
    // Draw original image
    ctx.drawImage(img, 0, 0, w, h);
    
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    
    // Sample background color near perimeter corners (top-left, top-right, bottom-left, bottom-right)
    // In this image, the bg is a warm light gray-ivory ~ (230, 227, 220)
    // We want the perimeter (outer 25%) to blend smoothly to 0 opacity / pure white, 
    // and pixels matching background luminance to become transparent so ONLY the crystal, lines, particles show!
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        let r = d[idx];
        let g = d[idx+1];
        let b = d[idx+2];
        
        // Distance to edge
        const distLeft = x;
        const distRight = w - 1 - x;
        const distTop = y;
        const distBottom = h - 1 - y;
        const edgeDist = Math.min(distLeft, distRight, distTop, distBottom);
        
        // Edge fade margin: 180px fade out to edges
        const fadeMargin = Math.min(w, h) * 0.22;
        let edgeAlpha = 1.0;
        if (edgeDist < fadeMargin) {
          edgeAlpha = edgeDist / fadeMargin;
          edgeAlpha = edgeAlpha * edgeAlpha * (3 - 2 * edgeAlpha); // smoothstep
        }
        
        // Calculate difference from pure white
        // Under multiply blend mode on #FAF9F5:
        // Any pixel that is pure white (255,255,255) leaves the background 100% #FAF9F5.
        // We lift all light background tones towards 255 near the edges so the box completely disappears.
        
        const boost = (1.0 - edgeAlpha);
        // Brighten towards 255 at edges
        r = Math.round(r + (255 - r) * boost);
        g = Math.round(g + (255 - g) * boost);
        b = Math.round(b + (255 - b) * boost);
        
        // Also apply a general brightness lift so the background matches 255 everywhere outside the central object
        const lum = (0.299 * r + 0.587 * g + 0.114 * b);
        if (lum > 215) {
          const bgFactor = (lum - 215) / 40; // 0 to 1
          const curve = Math.min(1.0, bgFactor * 1.4);
          r = Math.round(r + (255 - r) * curve * 0.95);
          g = Math.round(g + (255 - g) * curve * 0.95);
          b = Math.round(b + (255 - b) * curve * 0.95);
        }
        
        d[idx] = Math.min(255, Math.max(0, r));
        d[idx+1] = Math.min(255, Math.max(0, g));
        d[idx+2] = Math.min(255, Math.max(0, b));
        d[idx+3] = 255;
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
    window.__done = true;
  };
</script>
</body>
</html>
`);

await page.waitForFunction(() => window.__done === true);
const canvas = await page.$('#c');
await canvas.screenshot({ path: outputImage });

await browser.close();
console.log('Created seamless edge-blended PNG:', outputImage);
