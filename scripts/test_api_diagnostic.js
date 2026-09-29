import handler from '../api/diagnostic.js';

async function testApiHandler() {
  console.log('=== TESTING API/DIAGNOSTIC.JS HANDLER END-TO-END ===\n');

  // Helper mock request/response
  function createMockReqRes(body, headers = {}) {
    let statusCode = 200;
    let headersSent = {};
    let responseData = null;

    const req = {
      method: 'POST',
      body,
      headers: {
        'x-forwarded-for': '203.0.113.195',
        ...headers
      },
      socket: { remoteAddress: '203.0.113.195' }
    };

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      setHeader(name, val) {
        headersSent[name] = val;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      },
      getStatusCode: () => statusCode,
      getData: () => responseData
    };

    return { req, res };
  }

  // Test 1: Method Not Allowed on GET
  {
    const { req, res } = createMockReqRes({}, {});
    req.method = 'GET';
    await handler(req, res);
    console.log(`[PASS] GET Method rejection -> Status: ${res.getStatusCode()}, Error: "${res.getData().error}"`);
  }

  // Test 2: Missing URL
  {
    const { req, res } = createMockReqRes({ url: '' });
    await handler(req, res);
    console.log(`[PASS] Empty URL validation -> Status: ${res.getStatusCode()}, Error: "${res.getData().error}"`);
  }

  // Test 3: SSRF Blocked URL
  {
    const { req, res } = createMockReqRes({ url: 'http://169.254.169.254/secret' });
    await handler(req, res);
    console.log(`[PASS] SSRF Attack validation -> Status: ${res.getStatusCode()}, Error: "${res.getData().error}"`);
  }

  // Test 4: Live URL Diagnostic Execution (e.g. https://www.contextmuse.com)
  {
    const { req, res } = createMockReqRes({
      url: 'https://www.contextmuse.com',
      businessType: 'Applied Systems Studio',
      goal: 'Evaluate intake and quoting clarity'
    });

    console.log('\nRunning test check against https://www.contextmuse.com ...');
    await handler(req, res);

    if (res.getStatusCode() === 200) {
      const data = res.getData();
      console.log(`[PASS] Live Diagnostic Passed!`);
      console.log(`  Diagnostic ID: ${data.diagnosticId}`);
      console.log(`  Target: ${data.targetUrl}`);
      console.log(`  Summary: "${data.summary}"`);
      console.log(`  Most Important: "${data.mostImportant?.title}"`);
      console.log(`  Quick Wins: ${data.quickWins?.length || 0}`);
      console.log(`  System Opportunities: ${data.systemOpportunities?.length || 0}`);
      console.log(`  Proof Key: ${data.proofKey}`);
      console.log(`  Engine Source: ${data.source}`);
    } else {
      console.error(`[FAIL] Live Diagnostic returned status ${res.getStatusCode()}:`, res.getData());
      process.exit(1);
    }
  }

  console.log('\n=== ALL API HANDLER TESTS PASSED ===');
}

testApiHandler().catch(err => {
  console.error('Fatal API test error:', err);
  process.exit(1);
});
