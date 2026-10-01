// scripts/verify_live_production_deployment.cjs
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return resolve(fetchUrl(nextUrl));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function verifyLive() {
  console.log('Testing live production site: https://www.contextmuse.com ...\n');
  const tests = [];
  function check(name, pass, detail) {
    tests.push({ name, pass, detail });
    console.log((pass ? 'PASS: ' : 'FAIL: ') + name + (detail ? ' (' + detail + ')' : ''));
  }

  try {
    // 1. Health check
    const health = await fetchUrl('https://www.contextmuse.com/api/lead/health');
    const healthJson = JSON.parse(health.body);
    check('Lead Health API Live', health.status === 200 && healthJson.ok === true && healthJson.storage_status === 'connected', JSON.stringify(healthJson));

    // 2. Signal commercial page
    const sig = await fetchUrl('https://www.contextmuse.com/signal/');
    check('Signal GitHub link absent', !sig.body.includes('github.com/rouguemuse/signal-ops-intelligence'));
    check('Signal Hero Headline live', sig.body.includes('Signal turns fragmented restaurant reports into a prioritized decision queue.'));
    check('Signal Hero Subline live', sig.body.includes('Not more reporting. Decision compression for operators already drowning in reports.'));
    check('Signal Status Badge live', sig.body.includes('WORKING SYSTEM') && sig.body.includes('ACTIVE EXTERNAL VALIDATION'));
    check('Signal Validation Review Block live', sig.body.includes('Signal Validation Review'));
    check('Signal Synthetic Label live', sig.body.includes('Synthetic Demonstration Dataset'));

    // 3. Systems Signal page
    const sysSig = await fetchUrl('https://www.contextmuse.com/systems/signal/');
    check('Systems Signal GitHub link absent', !sysSig.body.includes('github.com/rouguemuse/signal-ops-intelligence'));
    check('Systems Signal links to /signal/', sysSig.body.includes('href="/signal/"'));
    check('Systems Signal Synthetic Label live', sysSig.body.includes('Synthetic Demonstration Dataset'));

    // 4. Signal interactive demo page
    const demo = await fetchUrl('https://www.contextmuse.com/signal/demo/');
    check('Demo Epistemic Layer Observed in markup/code', demo.body.includes('Observed') && demo.body.includes('observed-layer'));
    check('Demo Epistemic Layer Inferred in markup/code', demo.body.includes('Inferred') && demo.body.includes('inferred-layer'));
    check('Demo Epistemic Layer Verify in markup/code', demo.body.includes('Verify') && demo.body.includes('verify-layer'));
    check('Demo Epistemic Layer Action Candidate in markup/code', demo.body.includes('Action Candidate') && demo.body.includes('action-layer'));
    check('Demo Causal Overreach Purged', !demo.body.includes('active causal chain') && !demo.body.includes('directly produces'));
    check('Demo Cross-Signal Hypothesis Map live', demo.body.includes('Cross-Signal Hypothesis Map'));
    check('Demo Synthetic Demonstration Dataset live', demo.body.includes('Synthetic Demonstration Dataset'));

    // 5. About page
    const about = await fetchUrl('https://www.contextmuse.com/about/');
    check('About Page Restaurant Breadth live', about.body.includes('front-of-house service, back-of-house line execution, culinary production, shift management, team training, vendor purchasing, and POS service systems'));

    // 6. Sample Reports page
    const reports = await fetchUrl('https://www.contextmuse.com/signal/sample-reports/');
    check('Sample Reports Synthetic Label live', reports.body.includes('Synthetic Demonstration Dataset'));

    // 8. Homepage founder-led positioning
    const home = await fetchUrl('https://www.contextmuse.com/');
    check('Home Hero Title live', home.body.includes('I build systems around the way your business actually works.'));
    check('Home Hero Subhead live', home.body.includes('I find where a business is losing time, money, or customers, then build the system that fixes it.'));
    check('Home Founder-Led Statement live', home.body.includes('Context &amp; Muse is intentionally founder-led and independent.'));
    check('Home Studio Label Purged', !home.body.includes('Applied systems studio') && !home.body.includes('Applied Systems Studio'));

    // 9. Services founder-led positioning
    const services = await fetchUrl('https://www.contextmuse.com/services/');
    check('Services Hero Headline live', services.body.includes('I find where a business is losing time, money, or customers'));
    check('Services Eyebrow live', services.body.includes('FOUNDER-LED'));

    // 10. About founder-led positioning
    check('About Hero Sub live', about.body.includes('Context &amp; Muse is intentionally founder-led and independent.'));
    check('About Practical Solutions Cap 04 live', about.body.includes('Build practical custom solutions'));

    // 11. Restaurant Systems non-consulting titles
    const rest = await fetchUrl('https://www.contextmuse.com/restaurant-systems/');
    check('Restaurant Systems Title clean', !rest.body.includes('Hospitality Consulting'));

    const allPassed = tests.every(t => t.pass);
    console.log('\n========================================');
    console.log('TOTAL VERIFICATION TESTS: ' + tests.length + ' | ALL PASSED: ' + allPassed);
    console.log('========================================');
    process.exit(allPassed ? 0 : 1);
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  }
}
verifyLive();
