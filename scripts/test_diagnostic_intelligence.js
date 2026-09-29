import { analyzePageEvidence } from '../api/_lib/analyzer.js';
import { synthesizeDeterministic } from '../api/_lib/openai.js';

console.log('====================================================');
console.log('TESTING EVIDENCE-FIRST DIAGNOSTIC ENGINE');
console.log('====================================================\n');

// 1. Mock HTML mimicking inncontrolcoils.com with commercial HVAC equipment copy
const mockInnControlHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>INNcontrol Coils · Commercial HVAC Coil Refurbishing & Air Handling</title>
  <meta name="description" content="Commercial HVAC coil restoration, AHU cleaning, and fan coil unit refurbishment across commercial and hospitality properties.">
</head>
<body>
  <header>
    <h1>Restore Commercial HVAC Efficiency Across Multi-Floor Properties</h1>
    <p>We refurbish Fan Coil Units (FCU) and Air Handling Units (AHU) across hospital wings and 500-room hotel properties. Our certified technicians measure bio-fouling, CFM ratings, coil dimensions, and fin damage.</p>
    <a href="#contact" class="btn">Request Proposal</a>
  </header>

  <main>
    <section id="services">
      <h2>Engineering & Restoration Services</h2>
      <p>Serving hotel properties, universities, and commercial facilities across Texas and the Gulf Coast. Provide unit model numbers, coil dimensions, and photos for custom restoration plans.</p>
      <blockquote>"INNcontrol cut our facility downtime in half." — Regional Engineering Director</blockquote>
    </section>

    <section id="contact">
      <h2>Contact Engineering Support</h2>
      <form id="contact-form" action="/api/contact" method="POST">
        <label for="name">Your Name</label>
        <input type="text" id="name" name="name" required>

        <label for="email">Work Email</label>
        <input type="email" id="email" name="email" required>

        <label for="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone">

        <label for="notes">Project Notes</label>
        <textarea id="notes" name="notes" placeholder="Tell us about your property..."></textarea>

        <button type="submit">Submit Request</button>
      </form>
    </section>
  </main>

  <footer>
    <p>© 2026 INNcontrol Coils. All rights reserved.</p>
  </footer>
</body>
</html>
`;

// Test with wrong user input "book"
console.log('[TEST 1] Running diagnostic with user input "book" on Commercial HVAC site...');
const result = analyzePageEvidence(mockInnControlHtml, 'https://www.inncontrolcoils.com', {
  businessType: 'book',
  goal: 'Improve quote velocity'
});

console.log('Site Context Extracted:');
console.log('  Company Name:', result.siteContext.companyName);
console.log('  Detected Industry:', result.siteContext.detectedIndustry);
console.log('  Effective Industry:', result.siteContext.effectiveIndustry);
console.log('  Industry Conflict Detected:', result.siteContext.industryConflict ? result.siteContext.industryConflict.reason : 'None');
console.log('  Mentioned Job Variables in Copy:', result.siteContext.detectedJobVariables.map(v => v.category).join(', '));
console.log('  On-Page Proof Signals:', result.siteContext.proofSignals.hasTestimonials ? 'Found Testimonials' : 'None');

console.log('\nExtracted Evidence Findings Count:', result.evidenceList.length);
for (const item of result.evidenceList) {
  console.log(`\n- [${item.confidence}] ${item.title}`);
  console.log(`  Observed: ${item.observed_fact}`);
  console.log(`  Evidence: ${JSON.stringify(item.evidence)}`);
  console.log(`  Inference: ${item.inference}`);
  console.log(`  Recommendation: ${item.recommendation}`);
  console.log(`  Implementation Options: ${JSON.stringify(item.implementation_options)}`);
  console.log(`  Verification Needed: ${item.verification_needed}`);
}

// Synthesis Test
console.log('\n[TEST 2] Testing deterministic synthesis formatting...');
const synResult = synthesizeDeterministic(result.evidenceList, result.siteContext, result.meta, {
  businessType: 'book',
  goal: 'Improve quote velocity'
});

console.log('\nSynthesized Quick Read Summary:');
console.log('  ', synResult.quick_read_summary);
console.log('Domain Context Note:', synResult.industry_context_note);
console.log('Most Important Finding:', synResult.most_important.title);
console.log('Most Important Confidence:', synResult.most_important.confidence);
console.log('System Opportunities Count:', synResult.system_opportunities.length);
console.log('Quick Wins Count:', synResult.quick_wins.length);
console.log('Worth Verifying Count:', synResult.worth_verifying.length);
console.log('Relevant Proof Key:', synResult.proof_key);

// Assertions
if (!result.siteContext.industryConflict) {
  console.error('FAIL: Expected industry conflict between "book" and commercial HVAC.');
  process.exit(1);
}
if (!synResult.most_important.observed_fact) {
  console.error('FAIL: Most important finding missing observed_fact.');
  process.exit(1);
}
if (!Array.isArray(synResult.most_important.evidence)) {
  console.error('FAIL: Most important finding evidence is not an array.');
  process.exit(1);
}
if (!synResult.most_important.inference) {
  console.error('FAIL: Most important finding missing inference.');
  process.exit(1);
}
if (!synResult.most_important.implementation_options || synResult.most_important.implementation_options.length === 0) {
  console.error('FAIL: Most important finding missing implementation_options.');
  process.exit(1);
}

console.log('\n====================================================');
console.log('ALL DIAGNOSTIC INTELLIGENCE TESTS PASSED SUCCESSFULLY');
console.log('====================================================');
