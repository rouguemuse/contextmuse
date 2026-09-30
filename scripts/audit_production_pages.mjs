const pages = [
  'https://www.contextmuse.com/',
  'https://www.contextmuse.com/contact/',
  'https://www.contextmuse.com/custom/',
  'https://www.contextmuse.com/systems/',
  'https://www.contextmuse.com/services/quote-lead-systems/',
  'https://www.contextmuse.com/website-system-check/',
  'https://www.contextmuse.com/about/',
  'https://www.contextmuse.com/partners/',
  'https://www.contextmuse.com/quick-launch/',
  'https://www.contextmuse.com/signal/intake/',
  'https://www.contextmuse.com/signal_restaurant_intelligence/',
  'https://www.contextmuse.com/preview/'
];

async function auditProduction() {
  console.log('Auditing LIVE production pages on https://www.contextmuse.com ...\n');
  const results = [];
  let formspreeCount = 0;

  for (const url of pages) {
    const res = await fetch(url);
    const html = await res.text();

    const hasFormspree = html.includes('formspree.io');
    if (hasFormspree) formspreeCount++;

    const hasApiLead = html.includes('/api/lead');
    const formMatches = [...html.matchAll(/<form[^>]*>/gi)].map(m => m[0]);

    results.push({
      url,
      status: res.status,
      formsFound: formMatches.length,
      hasApiLead,
      hasFormspree,
      forms: formMatches
    });
  }

  console.log('Results:');
  for (const r of results) {
    console.log(`- ${r.url} (Status ${r.status})`);
    console.log(`  Forms: ${r.formsFound}, Has /api/lead: ${r.hasApiLead}, Formspree: ${r.hasFormspree}`);
  }

  console.log(`\nTotal pages audited: ${results.length}`);
  console.log(`Total Formspree references found: ${formspreeCount}`);

  return { results, formspreeCount };
}

auditProduction()
  .then(res => {
    if (res.formspreeCount > 0) {
      console.error('FAIL: Formspree references found on production!');
      process.exit(1);
    } else {
      console.log('PASS: ZERO Formspree references found on production.');
    }
  })
  .catch(err => {
    console.error('Audit error:', err);
    process.exit(1);
  });
