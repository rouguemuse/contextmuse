import * as cheerio from 'cheerio';

/**
 * Analyzes HTML content and extracts deterministic structural evidence and findings.
 */
export function analyzePageEvidence(html, targetUrl, context = {}) {
  const $ = cheerio.load(html);
  const evidenceList = [];
  const meta = {
    url: targetUrl,
    businessType: context.businessType || 'General Business',
    goal: context.goal || 'Improve conversion and workflow efficiency',
    title: '',
    description: '',
    h1s: [],
    h2s: [],
    ctas: [],
    forms: [],
    hasTel: false,
    hasMailto: false,
    hasAddress: false,
    hasAbout: false,
    hasWork: false,
    hasReviews: false,
    hasPricing: false,
    hasTerritory: false,
    hasPrivacy: false,
    hasTerms: false,
    hasViewport: false,
    isHttps: targetUrl.startsWith('https://'),
    imagesWithoutAlt: 0,
    totalImages: 0,
    totalScripts: 0,
    brokenAnchors: 0,
    staleCopyrightYear: null
  };

  // 1. EXTRACT RAW PAGE DATA
  meta.title = $('title').first().text().trim();
  meta.description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
  meta.description = meta.description.trim();

  // Headings
  $('h1').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text) meta.h1s.push(text);
  });
  $('h2').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text && meta.h2s.length < 8) meta.h2s.push(text);
  });

  // Mobile Viewport
  const viewportTag = $('meta[name="viewport"]').attr('content') || '';
  meta.hasViewport = viewportTag.includes('width=device-width');

  // Links & CTAs
  const linkHrefs = [];
  const linkTexts = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    linkHrefs.push(href);
    if (text) linkTexts.push({ text, href });

    if (href.startsWith('tel:')) meta.hasTel = true;
    if (href.startsWith('mailto:')) meta.hasMailto = true;
    if (href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
      if (text.length > 0 && text.length < 40) meta.brokenAnchors++;
    }

    const lowerHref = href.toLowerCase();
    const lowerText = text.toLowerCase();

    // Trust / Navigation links
    if (lowerHref.includes('about') || lowerText.includes('about us') || lowerText.includes('our story') || lowerText.includes('meet the team')) {
      meta.hasAbout = true;
    }
    if (lowerHref.includes('work') || lowerHref.includes('case-studies') || lowerHref.includes('portfolio') || lowerHref.includes('projects') || lowerText.includes('our work') || lowerText.includes('case studies') || lowerText.includes('projects')) {
      meta.hasWork = true;
    }
    if (lowerHref.includes('reviews') || lowerHref.includes('testimonials') || lowerText.includes('reviews') || lowerText.includes('testimonials') || lowerText.includes('what clients say')) {
      meta.hasReviews = true;
    }
    if (lowerHref.includes('pricing') || lowerHref.includes('rates') || lowerHref.includes('packages') || lowerText.includes('pricing') || lowerText.includes('packages')) {
      meta.hasPricing = true;
    }
    if (lowerHref.includes('privacy') || lowerText.includes('privacy policy')) {
      meta.hasPrivacy = true;
    }
    if (lowerHref.includes('terms') || lowerText.includes('terms of service') || lowerText.includes('terms & conditions')) {
      meta.hasTerms = true;
    }
  });

  // Action / CTA detection
  $('a, button').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    const isButton = el.tagName === 'button' || $(el).hasClass('btn') || $(el).hasClass('button') || $(el).attr('role') === 'button';
    const lower = text.toLowerCase();
    
    const isActionCta = /(get a quote|request a quote|book now|schedule|start project|get started|contact us|call now|free estimate|order online|get in touch|request consultation|view pricing)/i.test(lower);
    if ((isButton || isActionCta) && text.length > 2 && text.length < 35 && meta.ctas.length < 6) {
      if (!meta.ctas.some(c => c.text === text)) {
        meta.ctas.push({ text, href: $(el).attr('href') || '' });
      }
    }
  });

  // Forms & Intake Structure
  $('form').each((i, formEl) => {
    const formId = $(formEl).attr('id') || $(formEl).attr('name') || `form-${i + 1}`;
    const fields = [];
    let hasTextArea = false;
    let textAreaName = '';
    let selectCount = 0;
    let radioCheckboxCount = 0;
    let submitBtnText = $(formEl).find('button[type="submit"], input[type="submit"], button:not([type="button"])').first().text().trim() || $(formEl).find('input[type="submit"]').val() || 'Submit';

    $(formEl).find('input, select, textarea').each((_, inputEl) => {
      const type = $(inputEl).attr('type') || inputEl.tagName.toLowerCase();
      const name = $(inputEl).attr('name') || $(inputEl).attr('placeholder') || '';
      const isHidden = type === 'hidden';

      if (!isHidden) {
        fields.push({ type, name });
        if (inputEl.tagName.toLowerCase() === 'textarea') {
          hasTextArea = true;
          textAreaName = name || 'message';
        }
        if (inputEl.tagName.toLowerCase() === 'select') selectCount++;
        if (type === 'radio' || type === 'checkbox') radioCheckboxCount++;
      }
    });

    meta.forms.push({
      formId,
      fieldCount: fields.length,
      hasTextArea,
      textAreaName,
      selectCount,
      radioCheckboxCount,
      submitBtnText,
      fieldTypes: fields.map(f => f.type)
    });
  });

  // Body text scan for pricing, territory, copyright, address
  const bodyText = $('body').text().replace(/\s+/g, ' ');
  
  if (/\$\d+|\bpricing\b|\brates\b|\bstarting at \$|\bcost\b|\bfee\b/i.test(bodyText)) {
    meta.hasPricing = true;
  }

  if (/\bserving\b|\bservice areas?\b|\blocation\b|\bcounties\b|\bzip codes?\b|\bmetro\b/i.test(bodyText)) {
    meta.hasTerritory = true;
  }

  // Address check
  if ($('address').length > 0 || /\b\d{1,5}\s+[A-Za-z0-9\s.,]+,\s+[A-Z]{2}\s+\d{5}\b/.test(bodyText)) {
    meta.hasAddress = true;
  }

  // Stale Copyright Year check
  const copyrightMatch = bodyText.match(/©\s*(\d{4})/);
  if (copyrightMatch) {
    const year = parseInt(copyrightMatch[1], 10);
    const currentYear = new Date().getFullYear();
    if (year < currentYear - 1) {
      meta.staleCopyrightYear = year;
    }
  }

  // Images and scripts
  $('img').each((_, imgEl) => {
    meta.totalImages++;
    if (!$(imgEl).attr('alt') || $(imgEl).attr('alt').trim() === '') {
      meta.imagesWithoutAlt++;
    }
  });
  meta.totalScripts = $('script').length;

  // ========================================================================
  // 2. EVALUATE DETERMINISTIC RULES & FINDINGS
  // ========================================================================

  // CATEGORY 1: MESSAGE CLARITY
  if (!meta.title || meta.title.length < 5) {
    evidenceList.push({
      id: 'clarity_missing_title',
      category: 'message_clarity',
      severity: 'high',
      title: 'Missing or empty page title',
      observation: 'The website homepage has no descriptive <title> tag.',
      evidence: `<title>${meta.title || '(empty)'}</title>`,
      business_impact: 'Search engines and visitors cannot immediately identify what business service or product is offered.',
      improvement: 'Write a concise title following: [Core Service] in [Location] | [Company Name].',
      confidence: 1.0
    });
  } else if (/^(home|welcome|index|untitled)/i.test(meta.title.trim())) {
    evidenceList.push({
      id: 'clarity_generic_title',
      category: 'message_clarity',
      severity: 'medium',
      title: 'Generic homepage title lacks business context',
      observation: `Page title is currently "${meta.title}", which relies on generic placeholder text.`,
      evidence: `<title>${meta.title}</title>`,
      business_impact: 'Misses high-intent commercial search signals and fails to state what the company actually does in browser tabs.',
      improvement: 'Include your specific offering and target market directly in the title.',
      confidence: 0.95
    });
  }

  if (!meta.description || meta.description.length < 35) {
    evidenceList.push({
      id: 'clarity_missing_meta_desc',
      category: 'message_clarity',
      severity: 'medium',
      title: 'Missing or thin meta description',
      observation: meta.description ? `Meta description is only ${meta.description.length} characters.` : 'No meta description found in page markup.',
      evidence: meta.description ? `<meta name="description" content="${meta.description}">` : 'Missing meta description tag',
      business_impact: 'Search results show arbitrary scraped text snippets instead of a clear commercial value proposition.',
      improvement: 'Add a 120–155 character description explaining your service, who it serves, and the primary benefit.',
      confidence: 0.9
    });
  }

  if (meta.h1s.length === 0) {
    evidenceList.push({
      id: 'clarity_missing_h1',
      category: 'message_clarity',
      severity: 'high',
      title: 'No primary headline (H1) detected',
      observation: 'The page lacks a clear <h1> headline anchoring the core service offer.',
      evidence: '0 <h1> tags found in HTML structure.',
      business_impact: 'First-time visitors arriving on the page cannot instantly anchor what problem the business solves.',
      improvement: 'Add a prominent <h1> that clearly states what you do and who you do it for.',
      confidence: 0.95
    });
  } else if (meta.h1s.length > 1) {
    evidenceList.push({
      id: 'clarity_multiple_h1s',
      category: 'message_clarity',
      severity: 'low',
      title: 'Multiple competing primary headlines',
      observation: `Found ${meta.h1s.length} separate <h1> tags on the homepage.`,
      evidence: meta.h1s.slice(0, 3).map(h => `<h1>${h}</h1>`).join(' · '),
      business_impact: 'Diffuses visitor visual focus and weakens semantic hierarchy for search engines.',
      improvement: 'Consolidate down to one clear H1 statement, using H2s for supporting sections.',
      confidence: 0.9
    });
  } else {
    // Check if single H1 is vague
    const singleH1 = meta.h1s[0];
    if (/(welcome|innovative solutions|empowering|unlocking|the future of|next level|elevate)/i.test(singleH1) && singleH1.split(' ').length < 6) {
      evidenceList.push({
        id: 'clarity_vague_headline',
        category: 'message_clarity',
        severity: 'medium',
        title: 'Headline uses abstract phrasing instead of concrete service',
        observation: `Headline reads "${singleH1}", which relies on generic agency or corporate terminology.`,
        evidence: `<h1>${singleH1}</h1>`,
        business_impact: 'Prospective buyers leave within 5 seconds if they cannot immediately confirm you solve their exact problem.',
        improvement: 'State the concrete outcome or exact system you provide in plain words.',
        confidence: 0.85
      });
    }
  }

  // CATEGORY 2: CONVERSION FRICTION & CONTACT PATH
  if (meta.ctas.length === 0) {
    evidenceList.push({
      id: 'conversion_no_clear_cta',
      category: 'conversion_friction',
      severity: 'high',
      title: 'No clear primary call to action (CTA) found in top navigation or hero',
      observation: 'No button or emphasized link directing visitors to quote, book, or contact.',
      evidence: '0 primary action buttons detected across main navigation and hero regions.',
      business_impact: 'High drop-off rate as interested visitors have to hunt for how to engage.',
      improvement: 'Place an unmistakable primary action button in the top navigation header and hero section.',
      confidence: 0.95
    });
  }

  if (meta.brokenAnchors > 0) {
    evidenceList.push({
      id: 'conversion_placeholder_links',
      category: 'conversion_friction',
      severity: 'medium',
      title: 'Placeholder or empty links present in interactive elements',
      observation: `Detected ${meta.brokenAnchors} link(s) pointing to "#" or "javascript:void(0)".`,
      evidence: `Found ${meta.brokenAnchors} empty anchor targets in interactive UI elements.`,
      business_impact: 'Frustrates visitors expecting a working button and signals unmaintained software.',
      improvement: 'Connect placeholder buttons to active quote/intake paths or remove inactive elements.',
      confidence: 0.9
    });
  }

  if (!meta.hasTel && !meta.hasMailto && meta.forms.length === 0) {
    evidenceList.push({
      id: 'conversion_hunt_to_contact',
      category: 'conversion_friction',
      severity: 'high',
      title: 'High friction contact path: no direct phone, email, or embedded form',
      observation: 'Visitors cannot immediately call, email, or submit a request directly from the page.',
      evidence: 'No tel: links, mailto: links, or embedded forms found on target page.',
      business_impact: 'Customers on mobile or seeking fast turnaround will bounce to a competitor.',
      improvement: 'Provide at least two direct contact pathways (e.g. click-to-call + structured intake).',
      confidence: 0.95
    });
  }

  // CATEGORY 3: TRUST SIGNALS
  if (!meta.hasAbout && !meta.hasWork) {
    evidenceList.push({
      id: 'trust_missing_proof_identity',
      category: 'trust_signals',
      severity: 'medium',
      title: 'Limited visible proof of past work or company background',
      observation: 'No obvious navigation links to case studies, past projects, or team background.',
      evidence: 'Missing links to /about/, /team/, /work/, /portfolio/, or /case-studies/.',
      business_impact: 'Prospects cannot verify whether the business has successfully solved similar problems before.',
      improvement: 'Add 2–3 concrete case studies or visual proof breakdowns demonstrating real project outcomes.',
      confidence: 0.85
    });
  }

  if (meta.staleCopyrightYear) {
    evidenceList.push({
      id: 'trust_stale_copyright',
      category: 'trust_signals',
      severity: 'low',
      title: `Stale footer copyright date (© ${meta.staleCopyrightYear})`,
      observation: `Website footer displays a copyright year from ${meta.staleCopyrightYear}.`,
      evidence: `Footer text: © ${meta.staleCopyrightYear}`,
      business_impact: 'Subconsciously suggests the business or website might be inactive or neglected.',
      improvement: 'Update footer copyright to current year dynamically or in static footer template.',
      confidence: 0.95
    });
  }

  if (!meta.hasPrivacy && !meta.hasTerms) {
    evidenceList.push({
      id: 'trust_missing_policies',
      category: 'trust_signals',
      severity: 'low',
      title: 'Missing standard privacy policy or terms documentation',
      observation: 'No privacy policy or terms of service link found in footer.',
      evidence: 'No links matching /privacy/ or /terms/.',
      business_impact: 'Reduces trust for corporate buyers and paid ad platform compliance (Google/Meta ads).',
      improvement: 'Include standard privacy and terms links in the footer.',
      confidence: 0.85
    });
  }

  // CATEGORY 4: INTAKE & OPERATIONAL FRICTION (Applied Systems Focus)
  const genericTextareaForms = meta.forms.filter(f => f.hasTextArea && f.fieldCount <= 4 && f.selectCount === 0);
  if (genericTextareaForms.length > 0) {
    evidenceList.push({
      id: 'intake_generic_textarea_friction',
      category: 'intake_operations',
      severity: 'high',
      title: 'Quote and inquiry intake relies on an unstructured open text box',
      observation: `Intake form contains a blank <textarea name="${genericTextareaForms[0].textAreaName}"> asking the customer to describe their project with zero structured qualification.`,
      evidence: `Form #${genericTextareaForms[0].formId} has ${genericTextareaForms[0].fieldCount} basic fields with an unstructured textarea and 0 qualifying dropdowns/radios.`,
      business_impact: 'Forces manual back-and-forth emails or calls just to gather essential project parameters (size, scope, timeline, location) before an estimate can be produced.',
      improvement: 'Replace freeform text boxes with an interactive quote calculator or step-by-step intake engine that captures necessary variables up front.',
      confidence: 0.95
    });
  }

  if (meta.hasTerritory && meta.forms.length > 0 && !meta.forms.some(f => f.fieldTypes.includes('select') || f.fieldTypes.includes('radio'))) {
    evidenceList.push({
      id: 'intake_unrouted_territory',
      category: 'intake_operations',
      severity: 'medium',
      title: 'Service areas mentioned in copy without automated location routing',
      observation: 'Page references multiple service locations/territories, but lead intake form does not qualify or route by zip code or service zone.',
      evidence: 'Territory keywords detected in body text alongside a single unrouted contact form.',
      business_impact: 'Staff wastes time manually reviewing inquiries from outside the service boundary or manually dispatching leads between territories.',
      improvement: 'Integrate territory boundary validation and automated market routing directly into the intake flow.',
      confidence: 0.85
    });
  }

  if (!meta.hasPricing && meta.ctas.some(c => /quote|estimate|pricing|cost/i.test(c.text))) {
    evidenceList.push({
      id: 'intake_opaque_pricing_friction',
      category: 'intake_operations',
      severity: 'medium',
      title: 'Quote-driven sales model with zero pricing guidance or sizing logic',
      observation: 'Calls to action request users to "Get a Quote", but no baseline pricing tiers, sizing calculators, or cost brackets are provided.',
      evidence: 'CTA references quotes/estimates while page text has no pricing anchor.',
      business_impact: 'Unqualified low-budget leads clutter the sales queue while high-intent buyers leave due to lack of budget alignment.',
      improvement: 'Introduce an interactive preliminary sizing/pricing estimator that pre-qualifies buyers before submitting.',
      confidence: 0.85
    });
  }

  // CATEGORY 5: TECHNICAL & UX BASICS
  if (!meta.hasViewport) {
    evidenceList.push({
      id: 'technical_missing_viewport',
      category: 'technical_basics',
      severity: 'high',
      title: 'Missing mobile responsive viewport configuration',
      observation: 'No <meta name="viewport"> tag detected in document <head>.',
      evidence: 'Missing <meta name="viewport" content="width=device-width, initial-scale=1">',
      business_impact: 'Mobile devices will render the site as a tiny zoomed-out desktop view, causing instant mobile abandonment.',
      improvement: 'Add standard mobile viewport meta tag to all HTML templates.',
      confidence: 1.0
    });
  }

  if (!meta.isHttps) {
    evidenceList.push({
      id: 'technical_no_https',
      category: 'technical_basics',
      severity: 'high',
      title: 'Insecure HTTP connection',
      observation: 'Target URL is serving over unencrypted HTTP protocol.',
      evidence: `Target URL protocol is ${targetUrl.split(':')[0]}:`,
      business_impact: 'Modern browsers flag site as "Not Secure" and block form submissions.',
      improvement: 'Enforce automatic SSL/HTTPS redirect across all routes.',
      confidence: 1.0
    });
  }

  if (meta.imagesWithoutAlt > 3) {
    evidenceList.push({
      id: 'technical_images_missing_alt',
      category: 'technical_basics',
      severity: 'low',
      title: `${meta.imagesWithoutAlt} images missing accessible alt text`,
      observation: `Found ${meta.imagesWithoutAlt} out of ${meta.totalImages} images lacking descriptive alt attributes.`,
      evidence: `${meta.imagesWithoutAlt} <img> tags missing alt attribute.`,
      business_impact: 'Harms screen-reader accessibility and image search indexing.',
      improvement: 'Add meaningful alt descriptions to all content imagery and mark decorative graphics with alt="".',
      confidence: 0.95
    });
  }

  // If page is remarkably clean and has few negative findings, add a positive observation
  if (evidenceList.length <= 2) {
    evidenceList.push({
      id: 'positive_solid_foundation',
      category: 'message_clarity',
      severity: 'positive',
      title: 'Solid baseline presentation and clean page structure',
      observation: 'Core technical basics, viewport configuration, and headline hierarchy are in place.',
      evidence: `H1: "${meta.h1s[0] || 'Present'}", HTTPS active, mobile viewport verified.`,
      business_impact: 'Provides a clean foundation to focus directly on deeper operational intake systems and conversion mechanics.',
      improvement: 'Focus improvements on structured qualification tools, customer self-serve estimators, and workflow automation.',
      confidence: 0.9
    });
  }

  return {
    meta,
    evidenceList
  };
}
