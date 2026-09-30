import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

console.log('Beginning P0/P1 Verified Implementation...');

// -------------------------------------------------------------
// 1. MAPS WITH TEETH REMOVAL FROM PRODUCTS DROPDOWN
// -------------------------------------------------------------
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === '.vercel' || file === 'scratch' || file === 'reports') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles(rootDir);
let mwtCount = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Only target Maps With Teeth inside the nav-dropdown Products
  // Pattern matches the specific anchor tag in the dropdown
  const mwtPattern = /<a\s+href="https:\/\/www\.mapswithteeth\.org\/"\s+target="_blank"\s+rel="noopener"\s+class="nav-dropdown-link">Maps With Teeth ↗<\/a>\s*/g;
  
  if (mwtPattern.test(content)) {
    content = content.replace(mwtPattern, '');
    fs.writeFileSync(file, content, 'utf8');
    mwtCount++;
  }
});

console.log(`Removed Maps With Teeth from Products nav in ${mwtCount} files.`);

// -------------------------------------------------------------
// 2. INNCONTROL PRIMARY VISUAL REPLACEMENT
// -------------------------------------------------------------
// Replace inncontrol-screenshot.webp with inncontrol-commercial-platform.webp on key pages

// A: index.html
if (fs.existsSync('index.html')) {
  let idx = fs.readFileSync('index.html', 'utf8');
  idx = idx.replace(
    '<img src="/assets/images/inncontrol-screenshot.webp" alt="INNcontrol operational floorplan equipment mapper and parametric estimation workbench" width="1440" height="900" loading="lazy">',
    '<img src="/assets/images/inncontrol-commercial-platform.webp" alt="INNcontrol Coils nationwide commercial PTAC coil refurbishing web platform and lead engine" width="1440" height="900" loading="lazy">'
  );
  // Update badge & proof row on index.html to reflect commercial web platform
  idx = idx.replace(
    '<span class="work-badge">02 // Custom Operations System &bull; Field Scoping &amp; Estimator</span>',
    '<span class="work-badge">02 // Commercial Web Platform &bull; B2B Intake Engine</span>'
  );
  idx = idx.replace(
    'Technicians surveyed 500-room hotel HVAC systems using paper clipboards and loose phone photos, taking 5 days to assemble complex restoration bids.',
    'Nationwide commercial PTAC coil refurbishing service for volume hotel properties required an authoritative web presence and structured intake flow for hospitality property managers.'
  );
  idx = idx.replace(
    'Tablet-first 2D floorplan equipment mapper, unit-level condition severity tagging, photo association, and parametric labor calculation engine.',
    'High-conversion commercial web platform, national service scoping architecture, and structured technical inquiry engine.'
  );
  idx = idx.replace(
    'Cut bid compilation from 5 days to 20 minutes on site and produced unassailable client verification ledgers for hotel general managers.',
    'Positioned INNcontrol as a premier nationwide hotel mechanical partner and streamlined commercial property inquiry qualification.'
  );
  fs.writeFileSync('index.html', idx, 'utf8');
  console.log('Updated INNcontrol showcase on index.html');
}

// B: systems/client-builds/index.html
if (fs.existsSync('systems/client-builds/index.html')) {
  let cb = fs.readFileSync('systems/client-builds/index.html', 'utf8');
  cb = cb.replace(
    '<img src="/assets/images/inncontrol-screenshot.webp" alt="INNcontrol Coils interface and field scoping tool" class="browser-img">',
    '<img src="/assets/images/inncontrol-commercial-platform.webp" alt="INNcontrol Coils commercial PTAC refurbishing web platform" class="browser-img" width="1440" height="900" loading="lazy">'
  );
  fs.writeFileSync('systems/client-builds/index.html', cb, 'utf8');
  console.log('Updated INNcontrol image on systems/client-builds/index.html');
}

// C: proof-of-work/index.html
if (fs.existsSync('proof-of-work/index.html')) {
  let pow = fs.readFileSync('proof-of-work/index.html', 'utf8');
  pow = pow.replace(
    '<img src="/assets/images/inncontrol-screenshot.webp" alt="INNcontrol Coils commercial HVAC platform interface" loading="lazy">',
    '<img src="/assets/images/inncontrol-commercial-platform.webp" alt="INNcontrol Coils commercial PTAC coil refurbishing platform" width="1440" height="900" loading="lazy">'
  );
  fs.writeFileSync('proof-of-work/index.html', pow, 'utf8');
  console.log('Updated INNcontrol image on proof-of-work/index.html');
}

// D: work/index.html
if (fs.existsSync('work/index.html')) {
  let w = fs.readFileSync('work/index.html', 'utf8');
  w = w.replace(
    '<img src="/assets/images/inncontrol-screenshot.webp" alt="INNcontrol commercial HVAC estimation and engineering interface" loading="lazy" width="600" height="375">',
    '<img src="/assets/images/inncontrol-commercial-platform.webp" alt="INNcontrol Coils commercial PTAC coil refurbishing web platform" loading="lazy" width="600" height="375">'
  );
  fs.writeFileSync('work/index.html', w, 'utf8');
  console.log('Updated INNcontrol image on work/index.html');
}

// E: custom/index.html
if (fs.existsSync('custom/index.html')) {
  let c = fs.readFileSync('custom/index.html', 'utf8');
  c = c.replace(
    '<img src="/assets/images/inncontrol-screenshot.webp" alt="INNcontrol custom client operational intake website" style="width: 100%; height: auto; display: block; object-fit: cover;">',
    '<img src="/assets/images/inncontrol-commercial-platform.webp" alt="INNcontrol Coils commercial PTAC refurbishing web platform" style="width: 100%; height: auto; display: block; object-fit: cover;">'
  );
  c = c.replace(
    '<img src="/assets/images/inncontrol-screenshot.webp" alt="INNcontrol Coils website interface">',
    '<img src="/assets/images/inncontrol-commercial-platform.webp" alt="INNcontrol Coils website interface">'
  );
  fs.writeFileSync('custom/index.html', c, 'utf8');
  console.log('Updated INNcontrol images on custom/index.html');
}

// F: partners/index.html
if (fs.existsSync('partners/index.html')) {
  let p = fs.readFileSync('partners/index.html', 'utf8');
  p = p.replace(
    '<img src="/assets/images/inncontrol-screenshot.webp" alt="INNcontrol Coils field scoping application">',
    '<img src="/assets/images/inncontrol-commercial-platform.webp" alt="INNcontrol Coils commercial PTAC web platform">'
  );
  fs.writeFileSync('partners/index.html', p, 'utf8');
  console.log('Updated INNcontrol image on partners/index.html');
}

// G: preview/index.html
if (fs.existsSync('preview/index.html')) {
  let prev = fs.readFileSync('preview/index.html', 'utf8');
  prev = prev.replace(
    '<img src="/assets/images/inncontrol-screenshot.webp" alt="INNcontrol Coils commercial HVAC platform interface" width="800" height="450" loading="lazy">',
    '<img src="/assets/images/inncontrol-commercial-platform.webp" alt="INNcontrol Coils commercial PTAC platform interface" width="800" height="450" loading="lazy">'
  );
  fs.writeFileSync('preview/index.html', prev, 'utf8');
  console.log('Updated INNcontrol image on preview/index.html');
}

console.log('INNcontrol visual updates complete.');
