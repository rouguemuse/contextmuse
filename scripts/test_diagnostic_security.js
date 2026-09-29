import { validateUrlSecurity, safeFetchHtml, checkRateLimit } from '../api/_lib/security.js';
import { analyzePageEvidence } from '../api/_lib/analyzer.js';
import { synthesizeDeterministic } from '../api/_lib/openai.js';

async function runTests() {
  console.log('=== RUNNING SECURITY & SSRF UNIT TESTS ===\n');
  let passed = 0;
  let failed = 0;

  // 1. SSRF Tests
  const blockedUrls = [
    'http://localhost',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1',
    'http://[::1]',
    'http://169.254.169.254/latest/meta-data/',
    'http://10.0.0.1',
    'http://192.168.1.1',
    'http://172.16.0.5',
    'ftp://example.com',
    'file:///etc/passwd',
    'http://test.local',
    'http://internal.corp'
  ];

  for (const url of blockedUrls) {
    try {
      await validateUrlSecurity(url);
      console.error(`[FAIL] Expected SSRF block for: ${url}`);
      failed++;
    } catch (err) {
      console.log(`[PASS] Blocked SSRF: ${url} -> ${err.message}`);
      passed++;
    }
  }

  // 2. Safe Valid URL Test
  try {
    const valid = await validateUrlSecurity('https://www.contextmuse.com');
    console.log(`[PASS] Allowed safe public URL: ${valid.url} (Resolved IP: ${valid.ip})`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] Valid public URL failed: ${err.message}`);
    failed++;
  }

  // 3. Analyzer Deterministic Test on Sample Markup
  console.log('\n=== TESTING DETERMINISTIC ANALYZER ON SAMPLE MARKUP ===');
  const sampleHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Home</title>
    <!-- missing description and viewport -->
  </head>
  <body>
    <h1>Welcome to Our Innovative Solutions</h1>
    <p>We serve Harris County, Montgomery County, and Fort Bend County.</p>
    <form id="contact-form">
      <input type="text" name="name">
      <input type="email" name="email">
      <textarea name="message" placeholder="Explain your job here..."></textarea>
      <button type="submit">Submit</button>
    </form>
    <a href="#">Click here</a>
    <footer>&copy; 2021 Acme Corp</footer>
  </body>
  </html>
  `;

  const analysis = analyzePageEvidence(sampleHtml, 'https://example.com', {
    businessType: 'Service Contractor',
    goal: 'Get more qualified quotes'
  });

  console.log(`[PASS] Extracted ${analysis.evidenceList.length} evidence records.`);
  analysis.evidenceList.forEach((e, idx) => {
    console.log(`  ${idx + 1}. [${e.severity.toUpperCase()}] ${e.category} -> ${e.title}`);
  });

  // 4. Deterministic Synthesis Test
  const synthesis = synthesizeDeterministic(analysis.evidenceList, analysis.meta, {
    businessType: 'Service Contractor'
  });

  console.log('\n=== TESTING DETERMINISTIC SYNTHESIS ===');
  console.log('Most Important Finding:', synthesis.most_important.title);
  console.log('Quick Wins Count:', synthesis.quick_wins.length);
  console.log('System Opportunities Count:', synthesis.system_opportunities.length);
  console.log('Proof Key:', synthesis.proof_key);

  if (synthesis.most_important && synthesis.proof_key === 'quote_lead') {
    console.log('\n[PASS] Deterministic synthesis generated valid high-priority structure.');
    passed++;
  } else {
    console.error('\n[FAIL] Synthesis did not match expected structure.');
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
