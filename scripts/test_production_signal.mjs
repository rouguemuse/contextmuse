import puppeteer from 'puppeteer';

async function testProductionSignal() {
  console.log('Launching headless browser for Signal Intake verification...');
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

  console.log('Navigating to https://www.contextmuse.com/signal/intake/?door=2 ...');
  await page.goto('https://www.contextmuse.com/signal/intake/?door=2', { waitUntil: 'networkidle2' });

  console.log('Page loaded. Current title:', await page.title());

  // Verify branch 2 is active
  await page.waitForSelector('#signal-b2-form', { visible: true });

  // Fill branch 2 form
  console.log('Filling Branch 2 form fields...');
  await page.type('#b2-name', 'Signal Production QA');
  await page.type('#b2-email', 'qa-production-signal@example.com');
  await page.type('#b2-system', 'Toast POS System');
  await page.type('#b2-problem', 'Production second-form end-to-end verification.');

  // Safely mark is_test = true
  await page.evaluate(() => {
    const form = document.getElementById('signal-b2-form');
    let hiddenTest = form.querySelector('input[name="is_test"]');
    if (!hiddenTest) {
      hiddenTest = document.createElement('input');
      hiddenTest.type = 'hidden';
      hiddenTest.name = 'is_test';
      form.appendChild(hiddenTest);
    }
    hiddenTest.value = 'true';
  });

  console.log('Submitting form #signal-b2-form...');
  await page.click('#signal-b2-form button[type="submit"]');

  console.log('Waiting for success box #b2-success...');
  await page.waitForFunction(() => {
    const successBox = document.getElementById('b2-success');
    return successBox && successBox.style.display !== 'none';
  }, { timeout: 15000 });

  const resultData = await page.evaluate(() => {
    const subIdEl = document.getElementById('b2-sub-id');
    const successBox = document.getElementById('b2-success');
    return {
      subId: subIdEl ? subIdEl.textContent.trim() : null,
      successVisible: successBox ? successBox.style.display !== 'none' : false,
      successText: successBox ? successBox.textContent.trim() : null
    };
  });

  console.log('Result Data:', resultData);

  // Now Step 8: Failure UX on Production
  console.log('\n--- Testing Step 8: Failure UX with Invalid Email ---');
  // Navigate to door 3
  await page.evaluate(() => selectBranch(3));
  await page.waitForSelector('#signal-b3-form', { visible: true });

  await page.type('#b3-name', 'Invalid Email QA');
  // Type invalid email directly into DOM bypass browser standard validation or type invalid
  await page.evaluate(() => {
    const emailField = document.getElementById('b3-email');
    emailField.removeAttribute('type'); // Avoid browser native tooltip preventing submit
    emailField.value = 'not-an-email';
  });
  await page.type('#b3-context', 'Testing invalid email rejection and UX retention.');

  console.log('Submitting invalid email on #signal-b3-form...');
  await page.click('#signal-b3-form button[type="submit"]');

  await page.waitForFunction(() => {
    const errBox = document.getElementById('b3-error');
    return errBox && errBox.style.display !== 'none';
  }, { timeout: 10000 });

  const failureUxData = await page.evaluate(() => {
    const errBox = document.getElementById('b3-error');
    const successBox = document.getElementById('b3-success');
    const nameVal = document.getElementById('b3-name').value;
    const emailVal = document.getElementById('b3-email').value;
    const contextVal = document.getElementById('b3-context').value;
    return {
      errorVisible: errBox ? errBox.style.display !== 'none' : false,
      errorText: errBox ? errBox.textContent.trim() : null,
      successVisible: successBox ? successBox.style.display !== 'none' : false,
      preservedValues: {
        name: nameVal,
        email: emailVal,
        context: contextVal
      }
    };
  });

  console.log('Failure UX Data:', failureUxData);

  await browser.close();

  return {
    secondFormResult: resultData,
    failureUxResult: failureUxData,
    intercepted
  };
}

testProductionSignal()
  .then(res => {
    console.log('\n=== PRODUCTION SIGNAL INTAKE & FAILURE UX RESULT ===');
    console.log(JSON.stringify(res, null, 2));
  })
  .catch(err => {
    console.error('Test error:', err);
    process.exit(1);
  });
