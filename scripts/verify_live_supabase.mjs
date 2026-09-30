import http from 'http';
import handler from '../api/lead.js';
import healthHandler from '../api/lead/health.js';

// Ensure LIVE mode is active (NO mock mode)
delete process.env.LEAD_STORAGE_MOCK;

const server = http.createServer((req, res) => {
  res.status = function(code) {
    this.statusCode = code;
    return this;
  };
  res.json = function(data) {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
    return this;
  };

  const url = new URL(req.url, 'http://localhost');
  req.query = Object.fromEntries(url.searchParams.entries());

  if (url.pathname === '/api/lead/health') {
    return healthHandler(req, res);
  }

  if (url.pathname === '/api/lead' || url.pathname === '/api/lead/') {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', () => {
      req.body = bodyStr;
      handler(req, res);
    });
    return;
  }

  res.statusCode = 404;
  res.end('Not Found');
});

async function runLiveVerification() {
  await new Promise(resolve => server.listen(8456, resolve));
  console.log('[Live Test Proxy Server] Listening on port 8456\n');

  const results = {};

  try {
    // 1. Health check
    console.log('1. Testing GET /api/lead/health...');
    const healthRes = await fetch('http://localhost:8456/api/lead/health');
    const healthJson = await healthRes.json();
    console.log('   Status:', healthRes.status, healthJson);
    results.health = { status: healthRes.status, body: healthJson };

    // 2. Test A (/contact/): Context Muse Contact QA
    console.log('\n2. Testing Contact Form QA Submission (/contact/)...');
    const contactRes = await fetch('http://localhost:8456/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_test: true,
        form_id: 'contact-wizard',
        source_page: '/contact/',
        inquiry_type: 'contact',
        name: 'Context Muse Contact QA',
        email: 'qa-contact@example.com',
        company: 'Context & Muse QA Verification',
        message: 'Live contact form persistence verification.'
      })
    });
    const contactJson = await contactRes.json();
    console.log('   Status:', contactRes.status, contactJson);
    results.contact = { status: contactRes.status, body: contactJson };

    // 3. Test B (/website-system-check/): System Check QA
    console.log('\n3. Testing Second Form QA Submission (/website-system-check/)...');
    const sysRes = await fetch('http://localhost:8456/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_test: true,
        form_id: 'diagnostic-inquiry-form',
        source_page: '/website-system-check/',
        inquiry_type: 'systems',
        name: 'System Check QA Lead',
        email: 'qa-syscheck@example.com',
        website: 'https://example.com',
        message: 'Live diagnostic inquiry persistence verification.'
      })
    });
    const sysJson = await sysRes.json();
    console.log('   Status:', sysRes.status, sysJson);
    results.second_form = { status: sysRes.status, body: sysJson };

    // 4. Duplicate Test (double-click within 30s)
    console.log('\n4. Testing Duplicate Submission...');
    const dupRes = await fetch('http://localhost:8456/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_test: true,
        form_id: 'diagnostic-inquiry-form',
        source_page: '/website-system-check/',
        inquiry_type: 'systems',
        name: 'System Check QA Lead',
        email: 'qa-syscheck@example.com',
        website: 'https://example.com',
        message: 'Live diagnostic inquiry persistence verification.'
      })
    });
    const dupJson = await dupRes.json();
    console.log('   Status:', dupRes.status, dupJson);
    results.duplicate = { status: dupRes.status, body: dupJson };

    // 5. Failure Test: Invalid Email
    console.log('\n5. Testing Failure Handling (Invalid Email)...');
    const badEmailRes = await fetch('http://localhost:8456/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form_id: 'contact-wizard',
        name: 'Bad Email User',
        email: 'not-an-email',
        message: 'Testing validation error'
      })
    });
    const badEmailJson = await badEmailRes.json();
    console.log('   Status:', badEmailRes.status, badEmailJson);
    results.bad_email = { status: badEmailRes.status, body: badEmailJson };

    // 6. Honeypot Test
    console.log('\n6. Testing Honeypot Bot Trap...');
    const botRes = await fetch('http://localhost:8456/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Spam Bot',
        email: 'spambot@example.com',
        message: 'Spam payload',
        _gotcha: 'http://spam-link.example'
      })
    });
    const botJson = await botRes.json();
    console.log('   Status:', botRes.status, botJson);
    results.honeypot = { status: botRes.status, body: botJson };

    console.log('\n=== LIVE VERIFICATION SUMMARY ===');
    console.log(JSON.stringify(results, null, 2));
  } finally {
    server.close();
  }
}

runLiveVerification().catch(err => {
  console.error('[Verification Script Error]', err);
  server.close();
  process.exit(1);
});
