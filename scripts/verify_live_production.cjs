const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function verifyLive() {
  console.log('Verifying Live Production (https://www.contextmuse.com)...\n');

  // 1. Health check
  const health = await fetchUrl('https://www.contextmuse.com/api/lead/health');
  console.log('1. /api/lead/health Status:', health.status);
  console.log('   Body:', health.body);

  // 2. robots.txt
  const robots = await fetchUrl('https://www.contextmuse.com/robots.txt');
  console.log('\n2. /robots.txt Status:', robots.status);
  console.log('   Contains Sitemap:', robots.body.includes('Sitemap: https://www.contextmuse.com/sitemap.xml'));
  console.log('   Contains Disallow /preview/:', robots.body.includes('Disallow: /preview/'));
  console.log('   Contains Disallow /brand/:', robots.body.includes('Disallow: /brand/'));

  // 3. sitemap.xml
  const sitemap = await fetchUrl('https://www.contextmuse.com/sitemap.xml');
  console.log('\n3. /sitemap.xml Status:', sitemap.status);
  const locs = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  console.log('   Total URLs in sitemap:', locs.length);
  console.log('   Includes Homepage:', locs.includes('https://www.contextmuse.com/'));
  console.log('   Includes Quote-Lead-Systems:', locs.includes('https://www.contextmuse.com/services/quote-lead-systems/'));
  console.log('   Includes Custom:', locs.includes('https://www.contextmuse.com/custom/'));
  console.log('   Includes Systems Signal:', locs.includes('https://www.contextmuse.com/systems/signal/'));
  console.log('   Excludes Preview:', !locs.includes('https://www.contextmuse.com/preview/'));
  console.log('   Excludes Brand:', !locs.includes('https://www.contextmuse.com/brand/'));

  // 4. Homepage check
  const home = await fetchUrl('https://www.contextmuse.com/');
  console.log('\n4. Homepage (/) Status:', home.status);
  console.log('   Has GA4 Measurement ID G-MVV7WNL42L:', home.body.includes('G-MVV7WNL42L'));
  console.log('   Has analytics.js:', home.body.includes('/assets/js/analytics.js'));
  console.log('   Has areaServed Austin in JSON-LD:', home.body.includes('"name": "Austin"'));
  console.log('   Canonical is https://www.contextmuse.com/:', home.body.includes('<link rel="canonical" href="https://www.contextmuse.com/">'));

  // 5. Custom Systems check
  const custom = await fetchUrl('https://www.contextmuse.com/custom/');
  console.log('\n5. /custom/ Status:', custom.status);
  console.log('   Updated Title:', custom.body.includes('Custom Operations Systems &amp; Bespoke Software | Context &amp; Muse'));
  console.log('   Differentiated H1:', custom.body.includes('Custom Operations Systems built around how your business actually runs.'));

  // 6. Systems Architecture check
  const systems = await fetchUrl('https://www.contextmuse.com/systems/');
  console.log('\n6. /systems/ Status:', systems.status);
  console.log('   Updated Title:', systems.body.includes('Systems Architecture &amp; Engineering Standards | Context &amp; Muse'));

  // 7. Quick Launch check
  const ql = await fetchUrl('https://www.contextmuse.com/quick-launch/');
  console.log('\n7. /quick-launch/ Status:', ql.status);
  console.log('   Updated Title:', ql.body.includes('Quick-Launch Web Systems · Rapid Production Sprints | Context &amp; Muse'));

  // 8. Non-indexable route check (/preview/ and /dealsignal/)
  const preview = await fetchUrl('https://www.contextmuse.com/preview/');
  console.log('\n8. /preview/ Status:', preview.status);
  console.log('   Has noindex:', preview.body.includes('<meta name="robots" content="noindex, nofollow">'));

  const dealsignal = await fetchUrl('https://www.contextmuse.com/dealsignal/');
  console.log('   /dealsignal/ Has noindex:', dealsignal.body.includes('<meta name="robots" content="noindex, follow">'));

  console.log('\n--- LIVE PRODUCTION VERIFICATION COMPLETE ---');
}

verifyLive().catch(console.error);
