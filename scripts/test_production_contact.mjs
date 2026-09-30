import puppeteer from 'puppeteer';

async function testProductionContact() {
  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const intercepted = [];

  page.on('response', async res => {
    if (res.url().includes('/api/lead')) {
      const status = res.status();
      let body = null;
      if (status < 300 || status >= 400) {
        try {
          body = await res.json();
        } catch {
          body = await res.text().catch(() => null);
        }
      }
      intercepted.push({
        url: res.url(),
        status,
        body
      });
      console.log('Intercepted API response:', res.url(), status, body);
    }
  });

  console.log('Navigating to https://www.contextmuse.com/contact/ ...');
  await page.goto('https://www.contextmuse.com/contact/', { waitUntil: 'networkidle2' });

  console.log('Page loaded. Current title:', await page.title());

  // Step 1: Click next to proceed to Step 2
  console.log('Navigating Step 1 -> Step 2...');
  await page.waitForSelector('#btn-to-step-2', { visible: true });
  await page.click('#btn-to-step-2');
  await new Promise(r => setTimeout(r, 600));

  // Step 2: Navigate to Step 3
  console.log('Navigating Step 2 -> Step 3...');
  await page.waitForSelector('#btn-to-step-3', { visible: true });
  await page.click('#btn-to-step-3');
  await new Promise(r => setTimeout(r, 600));

  // Step 3: Fill contact fields
  console.log('Filling Step 3 fields...');
  await page.waitForSelector('#inp-name', { visible: true });
  await page.type('#inp-name', 'Context Muse Production QA');
  await page.type('#inp-email', 'qa-production-contact@example.com');
  await page.type('#inp-notes', 'Production contact form end-to-end verification.');

  // Safely mark is_test = true in form DOM
  await page.evaluate(() => {
    const form = document.getElementById('intelligent-intake-form');
    let hiddenTest = form.querySelector('input[name="is_test"]');
    if (!hiddenTest) {
      hiddenTest = document.createElement('input');
      hiddenTest.type = 'hidden';
      hiddenTest.name = 'is_test';
      form.appendChild(hiddenTest);
    }
    hiddenTest.value = 'true';
  });

  console.log('Submitting form via #btn-submit-intake...');
  await page.click('#btn-submit-intake');

  console.log('Waiting for URL redirect or success state...');
  await page.waitForFunction(() => window.location.href.includes('/contact/success/') || document.getElementById('intake-error-msg')?.style.display === 'block', { timeout: 15000 }).catch(e => console.log('Wait error:', e.message));

  const currentUrl = page.url();
  console.log('Final URL after submission:', currentUrl);

  const errorText = await page.evaluate(() => {
    const err = document.getElementById('intake-error-msg');
    return err && err.style.display !== 'none' ? err.textContent : null;
  });

  await browser.close();

  return {
    finalUrl: currentUrl,
    errorText,
    intercepted
  };
}

testProductionContact()
  .then(res => {
    console.log('\n=== PRODUCTION CONTACT FORM TEST RESULT ===');
    console.log(JSON.stringify(res, null, 2));
  })
  .catch(err => {
    console.error('Test error:', err);
    process.exit(1);
  });
