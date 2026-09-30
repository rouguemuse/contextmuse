import { processLeadSubmission, checkLeadRateLimit } from '../api/_lib/lead_service.js';
import { checkDbHealth, getMockLeads, clearMockLeads } from '../api/_lib/db.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('=== Running Lead Backend Phase 3B Unit Tests ===\n');

  // Test 1: Unconfigured DB behavior
  delete process.env.DATABASE_URL;
  delete process.env.POSTGRES_URL;
  delete process.env.LEAD_STORAGE_MOCK;

  const unconfiguredHealth = await checkDbHealth();
  assert(unconfiguredHealth.ok === false && unconfiguredHealth.status === 'unconfigured', 'Health check reports unconfigured when no connection string');

  const unconfiguredSub = await processLeadSubmission({
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Test inquiry'
  }, '1.2.3.4', 'test-agent');
  assert(
    (unconfiguredSub.success === false || unconfiguredSub.ok === false) &&
    unconfiguredSub.status === 503 &&
    unconfiguredSub.code === 'DATABASE_UNCONFIGURED' &&
    unconfiguredSub.error.includes("We couldn't safely save your inquiry yet"),
    'Rejects submission with 503 and safe user message when DB unconfigured'
  );

  // Enable Mock Mode for full pipeline testing
  process.env.LEAD_STORAGE_MOCK = 'true';
  clearMockLeads();

  const mockHealth = await checkDbHealth();
  assert(mockHealth.ok === true && mockHealth.status === 'mock_active', 'Health check reports healthy in mock mode');

  // Test 2: Validation errors
  const invalidEmail = await processLeadSubmission({
    name: 'Jane Doe',
    email: 'not-an-email',
    message: 'Test'
  }, '1.2.3.4', 'test-agent');
  assert(invalidEmail.success === false && invalidEmail.status === 400, 'Rejects invalid email format');

  const missingName = await processLeadSubmission({
    name: '   ',
    email: 'valid@example.com',
    message: 'Test'
  }, '1.2.3.4', 'test-agent');
  assert(missingName.success === false && missingName.status === 400, 'Rejects missing/empty name');

  // Test 3: Honeypot drop
  const botSubmission = await processLeadSubmission({
    name: 'Spam Bot',
    email: 'bot@spam.com',
    message: 'Buy now',
    _gotcha: 'http://spam-link.ru'
  }, '1.2.3.4', 'bot-agent');
  assert(botSubmission.success === true && botSubmission.synthetic === true, 'Honeypot returns synthetic success without storing');

  // Test 4: Valid submission with is_test: true and normalized columns
  const testSub = await processLeadSubmission({
    is_test: true,
    form_id: 'contact-wizard',
    source_page: '/contact/',
    inquiry_type: 'contact',
    name: 'Test Tester',
    email: 'test@contextmuse.com',
    phone: '+1 713 555 0199',
    company: 'Acme Test Corp',
    website: 'https://testcorp.example',
    budget_range: '$5,000 - $10,000',
    timeline: 'Within 30 days',
    message: 'Simulated test submission for Phase 3B verification.',
    utm_source: 'test_runner',
    utm_medium: 'cli',
    custom_attribute_1: 'value_alpha',
    custom_attribute_2: 12345
  }, '127.0.0.1', 'Node-Test-Runner');

  assert(testSub.success === true && testSub.submission_id && testSub.submission_id.startsWith('lead_'), 'Valid submission succeeds with lead ID');
  assert(testSub.status === 'new' || testSub.status === 'received', 'Valid submission reports new status');

  const storedLeads = getMockLeads();
  const foundLead = storedLeads.find(l => l.id === testSub.submission_id);
  assert(Boolean(foundLead), 'Lead stored in persistence store');
  assert(foundLead.is_test === true, 'Lead record preserves is_test: true');
  assert(foundLead.inquiry_type === 'contact', 'Lead record normalizes inquiry_type');
  assert(foundLead.phone === '+1 713 555 0199', 'Lead record captures phone');
  assert(foundLead.answers_json && foundLead.answers_json.custom_attribute_1 === 'value_alpha', 'Answers JSON preserves extra attributes');

  // Test 5: Unknown form catch-all
  const unknownSub = await processLeadSubmission({
    form_id: 'experimental-unregistered-form',
    source_page: '/some-random-page/',
    name: 'Random Visitor',
    email: 'visitor@example.com',
    message: 'Inquiry from unregistered page',
    weird_field_foo: 'bar',
    survey_q1: 'Answer 1'
  }, '127.0.0.1', 'Mozilla/5.0');

  assert(unknownSub.success === true, 'Unknown form submission accepted');
  const storedAfterUnknown = getMockLeads();
  const storedUnknown = storedAfterUnknown.find(l => l.id === unknownSub.submission_id);
  assert(storedUnknown && storedUnknown.inquiry_type === 'other', 'Unknown form falls back to inquiry_type = "other"');
  assert(storedUnknown && storedUnknown.answers_json.weird_field_foo === 'bar', 'Unknown form extra fields preserved in answers_json');

  // Test 6: Idempotency / Double-click deduplication within 30 seconds
  const dupSub = await processLeadSubmission({
    form_id: 'experimental-unregistered-form',
    source_page: '/some-random-page/',
    name: 'Random Visitor',
    email: 'visitor@example.com',
    message: 'Inquiry from unregistered page'
  }, '127.0.0.1', 'Mozilla/5.0');

  assert(dupSub.success === true && dupSub.duplicate === true && dupSub.submission_id === unknownSub.submission_id, 'Quick duplicate submission within 30s returns existing submission_id');

  // Test 7: Different inquiry from same email is NOT blocked
  const newSubSameEmail = await processLeadSubmission({
    form_id: 'quote-intake',
    source_page: '/services/quote-lead-systems/',
    name: 'Random Visitor',
    email: 'visitor@example.com',
    message: 'A completely different inquiry message about quotes.'
  }, '127.0.0.1', 'Mozilla/5.0');
  assert(newSubSameEmail.success === true && newSubSameEmail.submission_id !== unknownSub.submission_id, 'Legitimate second inquiry from same email is preserved as separate lead');

  // Test 8: Rate limiting
  const testIp = '198.51.100.99';
  for (let i = 0; i < 10; i++) {
    checkLeadRateLimit(testIp);
  }
  const blocked = checkLeadRateLimit(testIp);
  assert(blocked.allowed === false && blocked.retryAfterSeconds > 0, 'Rate limiter blocks after 10 requests per IP window');

  console.log(`\nPhase 3B Unit Test Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});

