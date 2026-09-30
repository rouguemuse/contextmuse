import http from 'http';
import handler from '../api/lead.js';
import healthHandler from '../api/lead/health.js';

process.env.LEAD_STORAGE_MOCK = 'true';

const server = http.createServer((req, res) => {
  // Polyfill Express/Vercel helper methods on standard http.ServerResponse for local testing
  res.status = function(code) {
    this.statusCode = code;
    return this;
  };
  res.json = function(data) {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
    return this;
  };

  // Route
  const url = new URL(req.url, 'http://localhost');
  req.query = Object.fromEntries(url.searchParams.entries());

  if (url.pathname === '/api/lead/health') {
    return healthHandler(req, res);
  }

  if (url.pathname === '/api/lead') {
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

async function runHttpTests() {
  await new Promise(resolve => server.listen(8345, resolve));
  console.log('[Test Server] Listening on port 8345');

  let passed = 0;
  let failed = 0;
  function assert(cond, name) {
    if (cond) {
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${name}`);
      failed++;
    }
  }

  try {
    // 1. Health check GET /api/lead/health
    const healthRes = await fetch('http://localhost:8345/api/lead/health');
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.ok === true && healthJson.configured === true, 'GET /api/lead/health returns 200 with configured: true in mock mode');

    // 2. Health check GET /api/lead?check=health
    const leadGetRes = await fetch('http://localhost:8345/api/lead?check=health');
    const leadGetJson = await leadGetRes.json();
    assert(leadGetRes.status === 200 && leadGetJson.ok === true, 'GET /api/lead?check=health returns 200 OK');

    // 3. POST /api/lead with valid data and is_test: true
    const postRes = await fetch('http://localhost:8345/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_test: true,
        form_id: 'contact-wizard',
        source_page: '/contact/',
        name: 'Marcus Aurelius',
        email: 'marcus@rome.gov',
        inquiry_type: 'contact',
        company: 'Imperial Logistics',
        message: 'Streamlining provincial grain supply records.'
      })
    });
    const postJson = await postRes.json();
    assert(
      postRes.status === 201 &&
      postJson.success === true &&
      postJson.ok === true &&
      (postJson.status === 'new' || postJson.status === 'received') &&
      typeof postJson.created_at === 'string' &&
      postJson.submission_id.startsWith('lead_'),
      'POST /api/lead returns 201 with success: true and durable submission_id'
    );

    // 4. Duplicate submission returns existing submission_id
    const dupRes = await fetch('http://localhost:8345/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_test: true,
        form_id: 'contact-wizard',
        source_page: '/contact/',
        name: 'Marcus Aurelius',
        email: 'marcus@rome.gov',
        inquiry_type: 'contact',
        company: 'Imperial Logistics',
        message: 'Streamlining provincial grain supply records.'
      })
    });
    const dupJson = await dupRes.json();
    assert(dupRes.status === 201 && dupJson.success === true && dupJson.duplicate === true && dupJson.submission_id === postJson.submission_id, 'Duplicate POST returns existing submission_id without double insertion');

    // 5. Missing email rejected with 400
    const badEmailRes = await fetch('http://localhost:8345/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form_id: 'contact-wizard',
        name: 'No Email User',
        message: 'Where is my email?'
      })
    });
    const badEmailJson = await badEmailRes.json();
    assert(badEmailRes.status === 400 && badEmailJson.ok === false, 'POST without email returns 400 Bad Request');

    // 6. Honeypot drops bot submission with synthetic 200
    const botRes = await fetch('http://localhost:8345/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Spam Bot 3000',
        email: 'bot@spammer.net',
        message: 'Cheap watches and sunglasses',
        _gotcha: 'http://evil-bot.com'
      })
    });
    const botJson = await botRes.json();
    assert(botRes.status === 201 && botJson.ok === true && botJson.submission_id.startsWith('sub_spm_'), 'Honeypot returns synthetic 201 sub_spm_* response');

    // 7. Method Not Allowed for PUT
    const putRes = await fetch('http://localhost:8345/api/lead', { method: 'PUT' });
    assert(putRes.status === 405, 'PUT /api/lead returns 405 Method Not Allowed');

    console.log(`\nHTTP Integration Tests: ${passed} passed, ${failed} failed.`);
    if (failed > 0) process.exit(1);
  } finally {
    server.close();
  }
}

runHttpTests().catch(err => {
  console.error('Integration test failure:', err);
  server.close();
  process.exit(1);
});
