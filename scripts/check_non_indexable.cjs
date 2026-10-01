const fs = require('fs');

const nonIndexableFiles = [
  '404.html',
  'partials/nav.html',
  'partials/footer.html',
  'contact/success/index.html',
  'preview/index.html',
  'signal/demo/index.html',
  'signal/export-instructions/index.html',
  'demo-restaurant-signal-report.html',
  'cxm_gensort/index.html',
  'dealsignal/index.html',
  'tiktok-shop-roi-analyzer/index.html',
  'wcsm/index.html',
  'star-gift/index.html',
  'istar-map/index.html',
  'southern_smoke/index.html',
  'inncontrol-v2/index.html',
  'rudyards-comedy/index.html',
  'rudyards-comedy/business-card/index.html',
  'rudyards-comedy/business-card/gallery.html',
  'sixes-and-sevens/index.html',
  'sixes-and-sevens/pub.html',
  'sixes-and-sevens/house.html',
  'sixes-and-sevens/tables.html',
  'sixes-and-sevens/events.html',
  'sixes-and-sevens/enquire.html'
];

for (const f of nonIndexableFiles) {
  if (!fs.existsSync(f)) {
    console.log('MISSING FILE:', f);
    continue;
  }
  const content = fs.readFileSync(f, 'utf8');
  const hasHead = /<head[\s>]/i.test(content);
  const robotsMatch = content.match(/<meta[^>]+name=["']robots["'][^>]*>/i);
  console.log(f, '-> hasHead:', hasHead, '| robots:', robotsMatch ? robotsMatch[0] : 'NONE');
}
