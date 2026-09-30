async function checkRegressions() {
  console.log('Running Production Regression Checks...\n');

  // 1. Check Homepage & Navigation
  const hpRes = await fetch('https://www.contextmuse.com/');
  const hpText = await hpRes.text();

  // Check Products dropdown in nav
  const productsNavMatch = hpText.match(/<details class="nav-dropdown"[^>]*>[\s\S]*?Products[\s\S]*?<\/details>/i);
  const productsNav = productsNavMatch ? productsNavMatch[0] : '';
  const hasMapsWithTeethInProducts = productsNav.includes('Maps With Teeth') || productsNav.includes('mapswithteeth');
  console.log('1. Maps With Teeth under commercial Products in Nav:', hasMapsWithTeethInProducts ? 'FAIL (Present)' : 'PASS (Not present)');

  // 2. Check Custom Systems pricing on /systems/ and /services/
  const sysRes = await fetch('https://www.contextmuse.com/systems/');
  const sysText = await sysRes.text();
  const servRes = await fetch('https://www.contextmuse.com/services/');
  const servText = await servRes.text();

  const has3500InSystems = sysText.includes('$3,500') || sysText.includes('$3500');
  const has3500InServices = servText.includes('$3,500') || servText.includes('$3500');
  console.log('2. $3,500 Custom Operations pricing in /systems/:', has3500InSystems ? 'FAIL (Present)' : 'PASS (Clean)');
  console.log('   $3,500 Custom Operations pricing in /services/:', has3500InServices ? 'FAIL (Present)' : 'PASS (Clean)');

  // 3. Check Formspree anywhere on key pages
  const contactRes = await fetch('https://www.contextmuse.com/contact/');
  const contactText = await contactRes.text();
  const hasFormspreeInContact = contactText.includes('formspree.io');
  console.log('3. Formspree on /contact/:', hasFormspreeInContact ? 'FAIL (Present)' : 'PASS (Clean)');

  // 4. Check for old synthetic restaurant mockups (gold tooth tony, etc.)
  const hasGoldTooth = hpText.includes('gold_tooth_tony') || sysText.includes('gold_tooth_tony') || servText.includes('gold_tooth_tony');
  console.log('4. Synthetic restaurant mockup (gold_tooth_tony):', hasGoldTooth ? 'FAIL (Present)' : 'PASS (Clean)');

  const allPassed = !hasMapsWithTeethInProducts && !has3500InSystems && !has3500InServices && !hasFormspreeInContact && !hasGoldTooth;
  console.log('\nOverall Regression Check:', allPassed ? 'PASSED' : 'FAILED');

  if (!allPassed) process.exit(1);
}

checkRegressions().catch(err => {
  console.error('Check error:', err);
  process.exit(1);
});
