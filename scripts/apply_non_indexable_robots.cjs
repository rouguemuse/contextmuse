const fs = require('fs');

const targets = [
  { file: 'preview/index.html', tag: '    <meta name="robots" content="noindex, nofollow">\n' },
  { file: 'signal/demo/index.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'signal/export-instructions/index.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'dealsignal/index.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'tiktok-shop-roi-analyzer/index.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'wcsm/index.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'star-gift/index.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'istar-map/index.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'southern_smoke/index.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'inncontrol-v2/index.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'rudyards-comedy/index.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'rudyards-comedy/business-card/index.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'rudyards-comedy/business-card/gallery.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'sixes-and-sevens/index.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'sixes-and-sevens/pub.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'sixes-and-sevens/house.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'sixes-and-sevens/tables.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'sixes-and-sevens/events.html', tag: '    <meta name="robots" content="noindex, follow">\n' },
  { file: 'sixes-and-sevens/enquire.html', tag: '    <meta name="robots" content="noindex, follow">\n' }
];

for (const { file, tag } of targets) {
  if (!fs.existsSync(file)) {
    console.warn('File not found:', file);
    continue;
  }
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('name="robots"')) {
    console.log(file, 'already has robots tag');
    continue;
  }
  // Insert after <head> or <meta charset="UTF-8">
  if (content.includes('<meta charset="UTF-8">')) {
    content = content.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n' + tag.trimEnd());
  } else if (content.includes('<head>')) {
    content = content.replace('<head>', '<head>\n' + tag.trimEnd());
  } else {
    console.warn(file, 'could not find insertion point');
    continue;
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated robots tag in:', file);
}
