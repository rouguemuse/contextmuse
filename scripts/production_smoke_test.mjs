import https from 'https';

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ProductionSmokeTester/1.0' } }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
        }).on('error', reject);
    });
}

async function runSmokeTest() {
    console.log('==========================================================================');
    console.log('                PRODUCTION DEPLOYMENT LIVE SMOKE TEST                     ');
    console.log('==========================================================================');
    console.log('Testing target: https://www.contextmuse.com/\n');

    let allPassed = true;

    // 1. Homepage Checks
    const hp = await fetchUrl('https://www.contextmuse.com/');
    console.log(`[1] Homepage Status: ${hp.statusCode}`);
    
    // Check H1
    const h1Match = hp.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1Text = h1Match ? h1Match[1].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ') : 'NOT FOUND';
    const expectedH1 = "Clarity shapes perception. Perception changes everything.";
    if (h1Text === expectedH1) {
        console.log(`  [PASS] Homepage H1: "${h1Text}"`);
    } else {
        console.log(`  [FAIL] Homepage H1 mismatch: found "${h1Text}"`);
        allPassed = false;
    }

    // Check Title
    const titleMatch = hp.body.match(/<title>([^<]+)<\/title>/i);
    const titleText = titleMatch ? titleMatch[1].trim() : 'NOT FOUND';
    const expectedTitle = "Websites, Workflow Systems &amp; Custom Tools | Context &amp; Muse";
    if (titleText === expectedTitle || titleText === "Websites, Workflow Systems & Custom Tools | Context & Muse") {
        console.log(`  [PASS] Homepage Title: "${titleText}"`);
    } else {
        console.log(`  [FAIL] Homepage Title mismatch: found "${titleText}"`);
        allPassed = false;
    }

    // Check Navigation items
    const navHasWork = hp.body.includes('Work <span class="nav-dropdown-arrow">▾</span>');
    const navHasServices = hp.body.includes('Services <span class="nav-dropdown-arrow">▾</span>');
    const navHasProducts = hp.body.includes('Products <span class="nav-dropdown-arrow">▾</span>');
    const navHasCreative = hp.body.includes('href="/creative/" class="nav-link">Creative</a>');
    const navHasAbout = hp.body.includes('href="/about/" class="nav-link">About</a>');
    const navHasStart = hp.body.includes('href="/contact/" class="nav-cta btn-magnetic">Start a Project</a>');

    if (navHasWork && navHasServices && navHasProducts && navHasCreative && navHasAbout && navHasStart) {
        console.log('  [PASS] Navigation matches: Work / Services / Products / Creative / About / Start a Project');
    } else {
        console.log(`  [FAIL] Navigation mismatch. Details: Work=${navHasWork}, Services=${navHasServices}, Products=${navHasProducts}, Creative=${navHasCreative}, About=${navHasAbout}, Start=${navHasStart}`);
        allPassed = false;
    }

    // Check Section order: Lone Wolf (client proof) before Signal (products)
    const loneWolfIndex = hp.body.indexOf('Lone Wolf Dumpsters');
    const signalIndex = hp.body.indexOf('Signal Diagnostic Engine');
    if (loneWolfIndex !== -1 && signalIndex !== -1 && loneWolfIndex < signalIndex) {
        console.log('  [PASS] Section order: Commercial client proof appears BEFORE Signal/GenSort products.');
    } else {
        console.log(`  [FAIL] Section order incorrect: LoneWolf=${loneWolfIndex}, Signal=${signalIndex}`);
        allPassed = false;
    }

    // 2. /contact/ Route
    console.log('\n[2] Contact Route Check (https://www.contextmuse.com/contact/):');
    const contactRes = await fetchUrl('https://www.contextmuse.com/contact/');
    console.log(`  Status: ${contactRes.statusCode}`);
    if (contactRes.statusCode === 200 && contactRes.body.includes('Bring me the mess.')) {
        console.log('  [PASS] /contact/ serves the dedicated intake workflow.');
    } else {
        console.log('  [FAIL] /contact/ does not serve expected content or returned error.');
        allPassed = false;
    }

    // 3. /custom/ Route
    console.log('\n[3] Custom Route Check (https://www.contextmuse.com/custom/):');
    const customRes = await fetchUrl('https://www.contextmuse.com/custom/');
    const customTitleMatch = customRes.body.match(/<title>([^<]+)<\/title>/i);
    const customTitle = customTitleMatch ? customTitleMatch[1].trim() : 'NOT FOUND';
    if (customTitle.includes('Custom Websites & Operational Systems') || customTitle.includes('Custom Websites &amp; Operational Systems')) {
        console.log(`  [PASS] /custom/ Title: "${customTitle}"`);
    } else {
        console.log(`  [FAIL] /custom/ Title mismatch: "${customTitle}"`);
        allPassed = false;
    }
    if (!customRes.body.includes('Operational Machinery')) {
        console.log('  [PASS] "Operational Machinery" successfully removed from /custom/ copy/metadata.');
    } else {
        console.log('  [FAIL] "Operational Machinery" still present in /custom/.');
        allPassed = false;
    }

    // 4. /services/ Route
    console.log('\n[4] Services Route Check (https://www.contextmuse.com/services/):');
    const servicesRes = await fetchUrl('https://www.contextmuse.com/services/');
    const servicesTitleMatch = servicesRes.body.match(/<title>([^<]+)<\/title>/i);
    const servicesTitle = servicesTitleMatch ? servicesTitleMatch[1].trim() : 'NOT FOUND';
    console.log(`  Title: "${servicesTitle}"`);

    // 5. Hostname canonical redirect test (contextmuse.com -> https://www.contextmuse.com/)
    console.log('\n[5] Apex domain check (https://contextmuse.com/):');
    const apexRes = await fetchUrl('https://contextmuse.com/');
    console.log(`  Apex Status: ${apexRes.statusCode} (Redirect: ${apexRes.headers.location || 'none'})`);

    console.log('\n==========================================================================');
    console.log(`PRODUCTION TEST SUMMARY: ${allPassed ? 'ALL PASS (100% SUCCESS)' : 'FAILURES DETECTED'}`);
    console.log('==========================================================================');
}

runSmokeTest().catch(console.error);
