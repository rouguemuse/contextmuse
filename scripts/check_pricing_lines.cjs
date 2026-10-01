const fs = require('fs');
const files = ['index.html', 'signal/index.html', 'signal/intake/index.html', 'systems/signal/index.html', 'website-system-check/index.html', 'restaurant-systems/index.html', 'services/index.html'];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('195') || l.includes('395') || l.includes('Conversion Leak') || l.includes('Business System Diagnostic')) {
      console.log(f + ':' + (i+1) + ': ' + l.trim().slice(0, 140));
    }
  });
}
