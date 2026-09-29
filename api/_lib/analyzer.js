import * as cheerio from 'cheerio';

/**
 * Enhanced Site Context Extractor
 * Builds an evidence-based understanding of the website before generating findings.
 */
export function extractSiteContext($, html, targetUrl, userContext = {}) {
  const bodyText = $('body').text().replace(/\s+/g, ' ');
  const title = ($('title').first().text() || '').trim();
  const metaDesc = ($('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '').trim();
  const ogSiteName = ($('meta[property="og:site_name"]').attr('content') || '').trim();
  
  // 1. Probable Company Name
  let companyName = ogSiteName;
  if (!companyName && title) {
    const parts = title.split(/[|\-–—•·]/);
    if (parts.length > 1) {
      companyName = parts[parts.length - 1].trim();
    } else {
      companyName = title.trim();
    }
  }
  if (!companyName) {
    try {
      companyName = new URL(targetUrl).hostname.replace(/^www\./, '').split('.')[0];
      companyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
    } catch {
      companyName = 'Business';
    }
  }

  // 2. Extract Headings & Key Content
  const h1s = [];
  $('h1').each((_, el) => {
    const t = $(el).text().trim().replace(/\s+/g, ' ');
    if (t) h1s.push(t);
  });
  const h2s = [];
  $('h2').each((_, el) => {
    const t = $(el).text().trim().replace(/\s+/g, ' ');
    if (t && h2s.length < 10) h2s.push(t);
  });
  const h3s = [];
  $('h3').each((_, el) => {
    const t = $(el).text().trim().replace(/\s+/g, ' ');
    if (t && h3s.length < 12) h3s.push(t);
  });

  const combinedContent = `${title} ${metaDesc} ${h1s.join(' ')} ${h2s.join(' ')} ${bodyText.slice(0, 6000)}`.toLowerCase();

  // 3. Industry / Vertical Detection
  const industryProfiles = [
    {
      id: 'commercial_hvac',
      label: 'Commercial HVAC & Mechanical Services',
      keywords: ['hvac', 'coils', 'coil refurbishing', 'air handling', 'fcu', 'ahu', 'chiller', 'condenser', 'ductwork', 'air quality', 'cooling tower', 'commercial refrigeration', 'fan coil']
    },
    {
      id: 'waste_management',
      label: 'Waste Management & Equipment Rental',
      keywords: ['dumpster', 'roll-off', 'waste management', 'junk removal', 'container rental', 'debris', 'hauling', 'waste disposal', 'yard dumpster']
    },
    {
      id: 'event_rentals',
      label: 'Event & Party Equipment Rentals',
      keywords: ['party rental', 'event rental', 'bounce house', 'inflatables', 'tent rental', 'table and chair rental', 'wedding rentals', 'concession rental']
    },
    {
      id: 'restaurant_hospitality',
      label: 'Restaurant & Hospitality',
      keywords: ['restaurant', 'dining', 'catering', 'menu', 'culinary', 'bar & grill', 'hospitality', 'bistro', 'food service', 'reservation']
    },
    {
      id: 'construction_trades',
      label: 'Commercial Construction & Specialty Contracting',
      keywords: ['contractor', 'roofing', 'plumbing', 'electrical', 'flooring', 'renovation', 'commercial construction', 'general contractor', 'drywall', 'masonry']
    },
    {
      id: 'professional_services',
      label: 'Professional & B2B Consulting Services',
      keywords: ['consulting', 'accounting', 'legal', 'law firm', 'advisory', 'management consulting', 'tax strategy', 'financial planning', 'recruiting']
    },
    {
      id: 'software_technology',
      label: 'Software, Digital Products & Technology',
      keywords: ['software', 'saas', 'api', 'platform', 'cloud', 'developer', 'automation tool', 'analytics software', 'digital system']
    },
    {
      id: 'automotive_detailing',
      label: 'Automotive Services & Fleet Care',
      keywords: ['auto detail', 'ceramic coating', 'paint protection', 'vehicle repair', 'fleet maintenance', 'collision repair', 'auto spa']
    },
    {
      id: 'healthcare_medical',
      label: 'Healthcare, Clinic & Medical Practice',
      keywords: ['patient', 'clinic', 'medical', 'dental', 'doctor', 'physician', 'health care', 'telehealth', 'therapy']
    }
  ];

  let detectedIndustry = 'General Commercial Business';
  let bestIndustryScore = 0;

  for (const profile of industryProfiles) {
    let score = 0;
    for (const kw of profile.keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      const matches = combinedContent.match(regex);
      if (matches) score += matches.length;
    }
    if (score > bestIndustryScore && score >= 2) {
      bestIndustryScore = score;
      detectedIndustry = profile.label;
    }
  }

  // 4. Validate User-Provided Industry vs Detected Reality
  const rawUserType = (userContext.businessType || '').trim();
  let effectiveIndustry = detectedIndustry;
  let industryConflict = null;

  if (rawUserType) {
    const lowerUserType = rawUserType.toLowerCase();
    // Check if user input is completely disconnected from site content
    const userWords = lowerUserType.split(/\s+/).filter(w => w.length > 2);
    const userWordMatches = userWords.filter(w => combinedContent.includes(w));

    if (userWordMatches.length === 0 && bestIndustryScore >= 3) {
      industryConflict = {
        userProvided: rawUserType,
        detected: detectedIndustry,
        reason: `Input "${rawUserType}" does not match on-page content (${detectedIndustry}). Analysis adjusted to observed site context.`
      };
      effectiveIndustry = detectedIndustry;
    } else {
      effectiveIndustry = rawUserType;
    }
  }

  // 5. On-Page Proof & Trust Evidence Extraction (Checking directly on page, not just URL existence!)
  const proofSignals = {
    hasClientLogos: false,
    clientLogoCount: 0,
    hasTestimonials: false,
    testimonialQuotes: [],
    hasCaseStudiesOnPage: false,
    caseStudyHeadings: [],
    hasCertificationsOrBadges: false,
    detectedCertifications: [],
    hasYearsInBusiness: null,
    hasPhysicalAddress: false,
    addressSnippet: ''
  };

  // Inspect images for logos/partners/clients
  $('img').each((_, el) => {
    const alt = ($(el).attr('alt') || '').toLowerCase();
    const src = ($(el).attr('src') || '').toLowerCase();
    const className = ($(el).attr('class') || '').toLowerCase();
    if (alt.includes('logo') || alt.includes('client') || alt.includes('partner') || src.includes('logo') || src.includes('client') || className.includes('logo') || className.includes('client') || className.includes('partner')) {
      proofSignals.clientLogoCount++;
    }
  });
  proofSignals.hasClientLogos = proofSignals.clientLogoCount >= 2;

  // Inspect testimonials / quotes
  $('blockquote, .testimonial, .review, [class*="testimonial"], [class*="review"]').each((_, el) => {
    const t = $(el).text().trim().replace(/\s+/g, ' ');
    if (t.length > 20 && t.length < 300 && proofSignals.testimonialQuotes.length < 3) {
      proofSignals.testimonialQuotes.push(t);
    }
  });
  if (proofSignals.testimonialQuotes.length > 0 || /\b(what our clients say|customer stories|reviews|5-star|testimonials|trusted by)\b/i.test(bodyText)) {
    proofSignals.hasTestimonials = true;
  }

  // Inspect case studies / projects directly in page markup
  $('[class*="case-study"], [class*="project"], [class*="portfolio"], section[id*="project"], section[id*="work"]').each((_, el) => {
    const h = $(el).find('h2, h3, h4').first().text().trim();
    if (h && proofSignals.caseStudyHeadings.length < 4) {
      proofSignals.caseStudyHeadings.push(h);
    }
  });
  if (proofSignals.caseStudyHeadings.length > 0 || /\b(case study|case studies|selected work|featured projects|recent builds)\b/i.test(bodyText)) {
    proofSignals.hasCaseStudiesOnPage = true;
  }

  // Inspect certifications, warranties, licenses
  const certMatches = bodyText.match(/\b(licensed & insured|epa certified|iso \d+|osha compliant|certified technician|bonded & insured|warranty|satisfaction guarantee|authorized dealer)\b/gi);
  if (certMatches && certMatches.length > 0) {
    proofSignals.hasCertificationsOrBadges = true;
    proofSignals.detectedCertifications = Array.from(new Set(certMatches.map(c => c.trim()))).slice(0, 4);
  }

  // Years in business
  const yearsMatch = bodyText.match(/\b(since \d{4}|over \d+ years of experience|serving .+ since \d{4}|\d+ years in business)\b/i);
  if (yearsMatch) {
    proofSignals.hasYearsInBusiness = yearsMatch[0];
  }

  // Physical address check
  if ($('address').length > 0) {
    proofSignals.hasPhysicalAddress = true;
    proofSignals.addressSnippet = $('address').first().text().trim().slice(0, 100);
  } else {
    const addrRegex = /\b\d{1,5}\s+[A-Za-z0-9\s.,]{3,35},\s+[A-Z]{2}\s+\d{5}\b/;
    const m = bodyText.match(addrRegex);
    if (m) {
      proofSignals.hasPhysicalAddress = true;
      proofSignals.addressSnippet = m[0];
    }
  }

  // 6. Technical / Service Complexity & Mentioned Job Variables in Copy
  const technicalVariableKeywords = [
    { key: 'dimensions', terms: ['dimensions', 'measurements', 'height', 'width', 'depth', 'sq ft', 'square footage', 'square feet', 'linear feet', 'yardage', '20-yard', '30-yard'] },
    { key: 'specifications', terms: ['model number', 'serial number', 'part number', 'tonnage', 'cfm', 'voltage', 'psi', 'hp', 'capacity', 'specifications'] },
    { key: 'materials', terms: ['aluminum', 'copper', 'stainless', 'composite', 'vinyl', 'corrugated', 'heavy debris', 'concrete', 'dirt'] },
    { key: 'drawings_files', terms: ['drawings', 'blueprints', 'schematics', 'photos', 'upload photos', 'site photos', 'pdf specs', 'floorplan'] },
    { key: 'timing_urgency', terms: ['emergency', 'turnaround', 'completion date', 'timeline', 'same-day', 'lead time', 'delivery date', 'schedule'] },
    { key: 'location_territory', terms: ['service area', 'zip code', 'county', 'metro area', 'delivery radius', 'mile radius', 'job location', 'facility address'] }
  ];

  const detectedJobVariables = [];
  for (const group of technicalVariableKeywords) {
    const matchedTerms = group.terms.filter(term => combinedContent.includes(term));
    if (matchedTerms.length > 0) {
      detectedJobVariables.push({
        category: group.key,
        matchedTerms
      });
    }
  }

  // 7. Audience & Sales Model
  let audienceType = 'B2B Commercial & Institutional';
  if (/\b(homeowners?|residential|families|personal|diy)\b/i.test(combinedContent) && !/\b(commercial|industrial|facilities|hospitals|hotel properties|enterprise)\b/i.test(combinedContent)) {
    audienceType = 'B2C Residential / Consumer';
  } else if (/\b(homeowners?|residential)\b/i.test(combinedContent) && /\b(commercial|contractors?|industrial)\b/i.test(combinedContent)) {
    audienceType = 'Mixed Commercial & Residential';
  }

  return {
    companyName,
    detectedIndustry,
    effectiveIndustry,
    industryConflict,
    audienceType,
    h1s,
    h2s,
    h3s,
    proofSignals,
    detectedJobVariables,
    hasPricing: /\$\d+|\bstarting at \$|\bpackage pricing\b/i.test(bodyText),
    hasTerritory: /\bserving\b|\bservice areas?\b|\blocation\b|\bcounties\b|\bzip codes?\b/i.test(bodyText),
    totalImages: $('img').length,
    totalScripts: $('script').length
  };
}

/**
 * Deep Form Inspector
 * Extracts structured intelligence on all forms and compares fields against required job variables.
 */
export function extractFormIntelligence($, siteContext) {
  const forms = [];

  $('form').each((i, formEl) => {
    const $form = $(formEl);
    const formId = $form.attr('id') || $form.attr('name') || `form-${i + 1}`;
    const action = $form.attr('action') || '';
    const method = ($form.attr('method') || 'POST').toUpperCase();
    
    // Find surrounding heading or section context
    const surroundingHeading = $form.closest('section, div, main').find('h1, h2, h3, legend').first().text().trim().replace(/\s+/g, ' ') || '';

    const inputs = [];
    const selects = [];
    const textareas = [];
    const radios = [];
    const checkboxes = [];
    const fileUploads = [];
    let submitBtnText = '';

    $form.find('button[type="submit"], input[type="submit"], button:not([type="button"])').each((_, btn) => {
      const t = $(btn).text().trim() || $(btn).val() || '';
      if (t && !submitBtnText) submitBtnText = t.replace(/\s+/g, ' ');
    });
    if (!submitBtnText) submitBtnText = 'Submit';

    $form.find('input, select, textarea').each((_, el) => {
      const $el = $(el);
      const tag = el.tagName.toLowerCase();
      const type = ($el.attr('type') || tag).toLowerCase();
      const name = $el.attr('name') || $el.attr('id') || '';
      const placeholder = $el.attr('placeholder') || '';
      const isRequired = $el.is('[required]') || $el.attr('aria-required') === 'true';

      // Find associated label
      let label = '';
      const id = $el.attr('id');
      if (id) {
        label = $(`label[for="${id}"]`).text().trim();
      }
      if (!label) {
        label = $el.closest('label').text().trim();
      }

      if (type === 'hidden') return; // Skip hidden security/routing tokens

      if (tag === 'textarea') {
        textareas.push({ name, label, placeholder, isRequired, rows: $el.attr('rows') || '3' });
      } else if (tag === 'select') {
        const options = [];
        $el.find('option').each((_, opt) => {
          const optVal = $(opt).val();
          const optText = $(opt).text().trim();
          if (optVal && optVal !== '') options.push(optText || optVal);
        });
        selects.push({ name, label, isRequired, optionCount: options.length, options: options.slice(0, 6) });
      } else if (type === 'radio') {
        radios.push({ name, label: label || placeholder || name, isRequired });
      } else if (type === 'checkbox') {
        checkboxes.push({ name, label: label || placeholder || name, isRequired });
      } else if (type === 'file') {
        fileUploads.push({ name, label, isRequired });
      } else {
        inputs.push({ type, name, label, placeholder, isRequired });
      }
    });

    const totalVisibleFields = inputs.length + selects.length + textareas.length + radios.length + checkboxes.length + fileUploads.length;

    // Field names / labels summary
    const fieldSummary = [
      ...inputs.map(inp => inp.label || inp.placeholder || inp.name || inp.type),
      ...selects.map(s => s.label || s.name || 'select'),
      ...textareas.map(t => t.label || t.placeholder || t.name || 'textarea'),
      ...fileUploads.map(f => f.label || f.name || 'file upload')
    ].filter(Boolean);

    // Analyze gap between on-page mentioned job variables vs captured fields
    const missingVariableOpportunities = [];
    const formFieldsString = fieldSummary.join(' ').toLowerCase();

    for (const jobVar of siteContext.detectedJobVariables || []) {
      if (jobVar.category === 'dimensions' && !/(size|dimension|length|width|height|square|feet|yards|tons)/i.test(formFieldsString)) {
        missingVariableOpportunities.push({
          variable: 'Dimensions / Unit Sizing',
          evidence: `Site copy discusses ${jobVar.matchedTerms.slice(0, 3).join(', ')}, but form only captures general text.`
        });
      }
      if (jobVar.category === 'specifications' && !/(model|serial|unit|part|type|spec|equipment)/i.test(formFieldsString)) {
        missingVariableOpportunities.push({
          variable: 'Equipment / Model Specifications',
          evidence: `Site references ${jobVar.matchedTerms.slice(0, 3).join(', ')}, while intake form lacks structured equipment selectors.`
        });
      }
      if (jobVar.category === 'location_territory' && !/(zip|city|state|location|address|county|territory)/i.test(formFieldsString)) {
        missingVariableOpportunities.push({
          variable: 'Service Location / ZIP Code',
          evidence: `Site references service territory (${jobVar.matchedTerms.slice(0, 2).join(', ')}), but form does not capture location up front.`
        });
      }
      if (jobVar.category === 'drawings_files' && fileUploads.length === 0) {
        missingVariableOpportunities.push({
          variable: 'Photos or Spec Sheet Upload',
          evidence: `Site discusses ${jobVar.matchedTerms.slice(0, 2).join(', ')}, but form provides no direct file attachment field.`
        });
      }
    }

    forms.push({
      formId,
      action,
      method,
      surroundingHeading,
      inputs,
      selects,
      textareas,
      radios,
      checkboxes,
      fileUploads,
      submitBtnText,
      totalVisibleFields,
      fieldSummary,
      isSimpleOpenIntake: textareas.length >= 1 && selects.length === 0 && radios.length === 0 && totalVisibleFields <= 5,
      missingVariableOpportunities
    });
  });

  return forms;
}

/**
 * Main Analysis Engine: Generates Strictly Fact-Grounded Findings
 */
export function analyzePageEvidence(html, targetUrl, userContext = {}) {
  const $ = cheerio.load(html);
  const siteContext = extractSiteContext($, html, targetUrl, userContext);
  const forms = extractFormIntelligence($, siteContext);

  const evidenceList = [];

  // 1. Navigation, Links & CTA Extraction
  const linkHrefs = [];
  let brokenAnchors = 0;
  let hasTel = false;
  let hasMailto = false;
  let telNumber = '';
  const ctas = [];

  $('a').each((_, el) => {
    const href = ($(el).attr('href') || '').trim();
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    linkHrefs.push(href);

    if (href.startsWith('tel:')) {
      hasTel = true;
      if (!telNumber) telNumber = href.replace(/^tel:/, '');
    }
    if (href.startsWith('mailto:')) {
      hasMailto = true;
    }
    if (href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
      if (text.length > 0 && text.length < 40) brokenAnchors++;
    }
  });

  // Action / CTA detection
  $('a, button').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    const isButton = el.tagName === 'button' || $(el).hasClass('btn') || $(el).hasClass('button') || $(el).attr('role') === 'button';
    const lower = text.toLowerCase();
    
    const isActionCta = /(get a quote|request a quote|book now|schedule|start project|get started|contact us|call now|free estimate|order online|get in touch|request consultation|view pricing|send message|inquire)/i.test(lower);
    if ((isButton || isActionCta) && text.length > 2 && text.length < 35 && ctas.length < 6) {
      if (!ctas.some(c => c.text === text)) {
        ctas.push({ text, href: $(el).attr('href') || '' });
      }
    }
  });

  // Mobile viewport
  const viewportTag = $('meta[name="viewport"]').attr('content') || '';
  const hasViewport = viewportTag.includes('width=device-width');
  const isHttps = targetUrl.startsWith('https://');

  // Stale Copyright
  let staleCopyrightYear = null;
  const copyrightMatch = $('body').text().match(/©\s*(\d{4})/);
  if (copyrightMatch) {
    const year = parseInt(copyrightMatch[1], 10);
    const currentYear = new Date().getFullYear();
    if (year < currentYear - 1) {
      staleCopyrightYear = year;
    }
  }

  // Images without alt
  let imagesWithoutAlt = 0;
  $('img').each((_, el) => {
    if (!$(el).attr('alt') || $(el).attr('alt').trim() === '') {
      imagesWithoutAlt++;
    }
  });

  // ========================================================================
  // EVALUATE FINDINGS WITH STRICT SEPARATION:
  // OBSERVED FACT -> DIRECT EVIDENCE -> INFERENCE -> CONFIDENCE -> BUSINESS IMPACT -> RECOMMENDATION
  // ========================================================================

  // ── INTAKE & FORM STRUCTURE FINDINGS ──
  const openTextForms = forms.filter(f => f.isSimpleOpenIntake);
  if (openTextForms.length > 0) {
    const targetForm = openTextForms[0];
    const fieldNamesList = targetForm.fieldSummary.join(', ');
    const hasJobVars = targetForm.missingVariableOpportunities.length > 0;

    evidenceList.push({
      id: 'intake_unstructured_open_text',
      category: 'intake_operations',
      severity: 'high',
      confidence: 'HIGH',
      confidence_reason: 'Form input fields and attributes directly extracted from page DOM.',
      title: 'Inquiry and quote intake relies on an unstructured open message box',
      observed_fact: `Primary inquiry form #${targetForm.formId} contains ${targetForm.totalVisibleFields} fields (${fieldNamesList}) with an open textarea and 0 structured dropdowns or selection controls.`,
      evidence: [
        `<form id="${targetForm.formId}"> fields: [${fieldNamesList}]`,
        targetForm.textareas.length > 0 ? `<textarea name="${targetForm.textareas[0].name}"> placeholder="${targetForm.textareas[0].placeholder || '(none)'}"` : 'Textarea element'
      ],
      inference: hasJobVars 
        ? `While website copy mentions specific job variables (${targetForm.missingVariableOpportunities.map(m => m.variable).join(', ')}), the form does not capture them up front, likely requiring staff to perform manual follow-up emails/calls to gather basic job specifications.`
        : 'Open textareas allow unqualified submissions and require staff to manually ask follow-up questions before calculating a scope or estimate.',
      why_it_matters: 'Slows down quote turnaround times, creates administrative follow-up overhead, and introduces friction for commercial buyers who already know their project parameters.',
      recommendation: 'Introduce structured qualification options for high-frequency variables while retaining an optional notes field.',
      implementation_options: [
        'Structured RFQ form with equipment / service selector dropdowns',
        'Multi-step intake wizard that captures job type, specifications, and timeline',
        'Optional photo or blueprint file upload to reduce phone consultation time'
      ],
      verification_needed: 'Confirm what minimum parameters (e.g. dimensions, equipment model, location) your team needs before an initial quote or callback can be prepared.',
      source_url: targetUrl,
      source_element: `form#${targetForm.formId}`,
      evidence_type: 'form_structure'
    });
  }

  // ── TERRITORY & LOCATION QUALIFICATION ──
  if (siteContext.hasTerritory && forms.length > 0) {
    const hasLocationField = forms.some(f => f.fieldSummary.some(name => /zip|city|state|location|address|county|territory/i.test(name)));
    if (!hasLocationField) {
      evidenceList.push({
        id: 'intake_unqualified_territory',
        category: 'intake_operations',
        severity: 'medium',
        confidence: 'MEDIUM',
        confidence_reason: 'Territory references detected in page text alongside a contact form lacking location inputs.',
        title: 'Service areas mentioned in copy without upfront location capture',
        observed_fact: 'Website text references regional service coverage or multi-market operations, but the primary intake form does not request a ZIP code, city, or territory.',
        evidence: [
          'Service area language detected in page copy',
          `Form #${forms[0].formId} fields: [${forms[0].fieldSummary.join(', ')}] (no location field)`
        ],
        inference: 'If service eligibility or team assignment depends on geography, dispatchers or sales reps must verify customer locations manually after form submission.',
        why_it_matters: 'Inquiries from outside your service area consume team time, and leads requiring specific regional dispatch cannot be routed automatically.',
        recommendation: 'Capture customer ZIP code or service county early in the intake path to validate service eligibility.',
        implementation_options: [
          'Add a single ZIP code or municipal selector to the primary form',
          'Instant service area validator that confirms coverage before submission',
          'Automated routing of qualified leads to regional dispatch teams'
        ],
        verification_needed: 'Confirm whether all inquiries are serviced uniformly or if pricing/eligibility varies by geographic region.',
        source_url: targetUrl,
        source_element: `form#${forms[0].formId}`,
        evidence_type: 'form_structure'
      });
    }
  }

  // ── CALL TO ACTION & CONVERSION PATHS ──
  if (ctas.length === 0) {
    evidenceList.push({
      id: 'conversion_no_primary_cta',
      category: 'conversion_friction',
      severity: 'high',
      confidence: 'HIGH',
      confidence_reason: 'DOM search across navigation header and hero section returned 0 action buttons or inquiry links.',
      title: 'No prominent primary call to action (CTA) in header or hero',
      observed_fact: 'The homepage navigation header and initial viewport contain no action button or distinct conversion link directing users to quote, schedule, or contact.',
      evidence: [
        '0 <button> or action links matching standard conversion triggers found in header/hero.'
      ],
      inference: 'Prospective buyers who arrive ready to take action must scroll or explore secondary menus to figure out how to initiate a conversation.',
      why_it_matters: 'Increases bounce rates for commercial buyers and mobile visitors looking for immediate next steps.',
      recommendation: 'Add a high-contrast primary action button to the global navigation header and hero section.',
      implementation_options: [
        'Add a primary "Request Quote" or "Start Project" button in the top-right navbar',
        'Anchor a prominent primary CTA button immediately beneath the hero value proposition',
        'Include a direct click-to-call phone link for urgent service inquiries'
      ],
      verification_needed: 'Identify your single most desired first customer action (e.g. phone call vs. online quote request).',
      source_url: targetUrl,
      source_element: 'nav, header',
      evidence_type: 'dom_element'
    });
  }

  if (brokenAnchors > 0) {
    evidenceList.push({
      id: 'conversion_empty_anchor_targets',
      category: 'conversion_friction',
      severity: 'medium',
      confidence: 'HIGH',
      confidence_reason: 'Directly parsed anchor elements with placeholder href attributes.',
      title: `${brokenAnchors} interactive element(s) contain placeholder links (#)`,
      observed_fact: `Detected ${brokenAnchors} link(s) on the page with href="#" or "javascript:void(0)" instead of functional URLs.`,
      evidence: [
        `Found ${brokenAnchors} link element(s) with placeholder href attributes.`
      ],
      inference: 'Clickable elements that do not produce an action can signal incomplete development and prevent users from navigating.',
      why_it_matters: 'Frustrates visitors attempting to click through to services or contact pages.',
      recommendation: 'Update placeholder links to point to active conversion routes or replace them with static text elements.',
      implementation_options: [
        'Link placeholder buttons directly to the contact or quote section',
        'Remove inactive anchor wrappers from non-clickable UI cards'
      ],
      verification_needed: 'Check if these placeholders correspond to unfinished features or legacy template code.',
      source_url: targetUrl,
      source_element: 'a[href="#"]',
      evidence_type: 'dom_element'
    });
  }

  // ── MESSAGING & POSITIONING CLARITY ──
  const titleText = ($('title').first().text() || '').trim();
  if (!titleText || titleText.length < 5) {
    evidenceList.push({
      id: 'clarity_missing_title',
      category: 'message_clarity',
      severity: 'high',
      confidence: 'HIGH',
      confidence_reason: 'DOM inspection of <head> tag.',
      title: 'Missing or empty homepage title tag',
      observed_fact: 'The HTML <head> contains no descriptive <title> tag.',
      evidence: ['<title> element is empty or missing.'],
      inference: 'Browser tabs and search engines cannot present a clear identity or core offering.',
      why_it_matters: 'Severely penalizes search visibility and reduces click-through trust from search results.',
      recommendation: 'Add a descriptive title tag establishing [Primary Service] | [Company Name] | [Target Market].',
      implementation_options: [
        `Set title: "${siteContext.detectedIndustry} | ${siteContext.companyName}"`
      ],
      verification_needed: 'Verify primary target search keywords for your service and location.',
      source_url: targetUrl,
      source_element: '<title>',
      evidence_type: 'dom_element'
    });
  } else if (/^(home|welcome|index|untitled)/i.test(titleText)) {
    evidenceList.push({
      id: 'clarity_generic_title',
      category: 'message_clarity',
      severity: 'medium',
      confidence: 'HIGH',
      confidence_reason: 'Direct regex match on title tag text.',
      title: 'Homepage title uses generic placeholder text',
      observed_fact: `Page title is currently "${titleText}", which starts with a generic placeholder word.`,
      evidence: [`<title>${titleText}</title>`],
      inference: 'Misses an opportunity to communicate specific commercial capabilities in browser tabs and search snippets.',
      why_it_matters: 'Search engines struggle to rank generic titles for high-intent customer queries.',
      recommendation: 'Replace placeholder words with your specific service specialty and geographic or commercial focus.',
      implementation_options: [
        `Update title to lead with specific core service (e.g. "${siteContext.detectedIndustry} | ${siteContext.companyName}")`
      ],
      verification_needed: 'Confirm primary geographic or industry focus for meta branding.',
      source_url: targetUrl,
      source_element: '<title>',
      evidence_type: 'dom_element'
    });
  }

  if (siteContext.h1s.length === 0) {
    evidenceList.push({
      id: 'clarity_missing_h1',
      category: 'message_clarity',
      severity: 'high',
      confidence: 'HIGH',
      confidence_reason: '0 <h1> elements detected in DOM query.',
      title: 'No primary headline (H1) detected on homepage',
      observed_fact: 'Document markup does not contain an <h1> tag to anchor the primary business proposition.',
      evidence: ['0 <h1> tags found in HTML structure.'],
      inference: 'First-time visitors arriving on the page have no immediate visual or semantic anchor explaining what the company does.',
      why_it_matters: 'Commercial buyers decide within 3–5 seconds whether a provider is relevant to their specific problem.',
      recommendation: 'Add a clear <h1> that states your primary capability in plain, commercially obvious language.',
      implementation_options: [
        'Place a single <h1> in the hero section summarizing what you do and who you serve'
      ],
      verification_needed: 'Confirm core customer value proposition.',
      source_url: targetUrl,
      source_element: 'h1',
      evidence_type: 'dom_element'
    });
  }

  // ── ON-PAGE PROOF & TRUST SIGNALS (Grounding strictly in what was observed on the page!) ──
  if (!siteContext.proofSignals.hasClientLogos && !siteContext.proofSignals.hasTestimonials && !siteContext.proofSignals.hasCaseStudiesOnPage) {
    evidenceList.push({
      id: 'trust_limited_on_page_proof',
      category: 'trust_signals',
      severity: 'medium',
      confidence: 'MEDIUM',
      confidence_reason: 'Scan of homepage text and images found 0 client logos, quotes, or project showcase sections directly on the page.',
      title: 'Limited visible proof of past work or client verification on homepage',
      observed_fact: 'Homepage markup contains no client logos, customer testimonials, project galleries, or verifiable case study breakdowns.',
      evidence: [
        '0 client logo images detected',
        '0 blockquotes or testimonial review elements detected',
        '0 project case study sections detected on homepage'
      ],
      inference: 'New prospects arriving from search or direct links cannot immediately verify past project execution without hunting for external references.',
      why_it_matters: 'Commercial and B2B buyers require verification of past competence before initiating a high-value inquiry.',
      recommendation: 'Incorporate 2–3 concrete visual proof artifacts or customer results directly on the homepage.',
      implementation_options: [
        'Add a "Selected Work" or "Recent Projects" section with before/after photos or equipment specifications',
        'Include a client credibility strip featuring recognizable commercial clients or partner logos',
        'Feature 2–3 specific customer outcome statements with company name and location'
      ],
      verification_needed: 'Confirm whether client confidentiality restricts public case studies or if anonymized operational breakdowns can be featured.',
      source_url: targetUrl,
      source_element: 'main, section',
      evidence_type: 'text_content'
    });
  }

  if (staleCopyrightYear) {
    evidenceList.push({
      id: 'trust_stale_footer_copyright',
      category: 'trust_signals',
      severity: 'low',
      confidence: 'HIGH',
      confidence_reason: 'Direct regex match on footer copyright year.',
      title: `Stale footer copyright date (© ${staleCopyrightYear})`,
      observed_fact: `Footer markup displays a copyright year of ${staleCopyrightYear} (current year is ${new Date().getFullYear()}).`,
      evidence: [`Footer copyright text: "© ${staleCopyrightYear}"`],
      inference: 'Subconsciously suggests to discerning buyers that the website or software may not be actively maintained.',
      why_it_matters: 'Subtle trust leak during late-stage customer evaluation.',
      recommendation: 'Update the copyright year to the current calendar year.',
      implementation_options: [
        'Use dynamic server-side or build-time script for copyright year',
        'Update static template to current year'
      ],
      verification_needed: 'None — purely cosmetic maintenance update.',
      source_url: targetUrl,
      source_element: 'footer',
      evidence_type: 'text_content'
    });
  }

  // ── TECHNICAL & UX BASICS ──
  if (!hasViewport) {
    evidenceList.push({
      id: 'technical_missing_viewport',
      category: 'technical_basics',
      severity: 'high',
      confidence: 'HIGH',
      confidence_reason: 'Missing <meta name="viewport"> tag in document head.',
      title: 'Missing mobile responsive viewport tag',
      observed_fact: 'The HTML <head> does not contain a <meta name="viewport" content="width=device-width, initial-scale=1"> tag.',
      evidence: ['No meta viewport tag detected.'],
      inference: 'Mobile browsers will render the website as a zoomed-out desktop canvas, requiring pinching and horizontal scrolling.',
      why_it_matters: 'Causes immediate abandonment by mobile visitors and contractors in the field.',
      recommendation: 'Add standard responsive viewport meta tag to the document head.',
      implementation_options: [
        'Add `<meta name="viewport" content="width=device-width, initial-scale=1.0">` to all page templates'
      ],
      verification_needed: 'None — standard web requirement.',
      source_url: targetUrl,
      source_element: '<head>',
      evidence_type: 'dom_element'
    });
  }

  if (!isHttps) {
    evidenceList.push({
      id: 'technical_unencrypted_http',
      category: 'technical_basics',
      severity: 'high',
      confidence: 'HIGH',
      confidence_reason: 'Target URL scheme is http://.',
      title: 'Insecure HTTP connection',
      observed_fact: `The site is serving over unencrypted HTTP (${targetUrl}).`,
      evidence: [`Protocol: http:`],
      inference: 'Modern browsers will flag the site as "Not Secure" and may block form submissions.',
      why_it_matters: 'Damages buyer trust and suppresses search engine rankings.',
      recommendation: 'Configure an SSL certificate and enforce HTTPS redirect across all domain traffic.',
      implementation_options: [
        'Enable free SSL via Cloudflare, Let\'s Encrypt, or your hosting provider',
        'Set up automatic 301 redirect from HTTP to HTTPS'
      ],
      verification_needed: 'Check hosting provider SSL management settings.',
      source_url: targetUrl,
      source_element: 'URL scheme',
      evidence_type: 'http_header'
    });
  }

  if (imagesWithoutAlt > 3) {
    evidenceList.push({
      id: 'technical_images_missing_alt',
      category: 'technical_basics',
      severity: 'low',
      confidence: 'HIGH',
      confidence_reason: `${imagesWithoutAlt} <img> tags lack alt attributes.`,
      title: `${imagesWithoutAlt} image(s) missing accessible alt text`,
      observed_fact: `Found ${imagesWithoutAlt} out of ${siteContext.totalImages} images lacking descriptive alt attributes.`,
      evidence: [`${imagesWithoutAlt} <img> tags missing alt attribute.`],
      inference: 'Screen readers cannot describe visual content, and image search bots miss indexable context.',
      why_it_matters: 'Accessibility compliance gap and lost image search visibility.',
      recommendation: 'Add descriptive alt text to functional images and alt="" to purely decorative graphics.',
      implementation_options: [
        'Audit image assets and add descriptive alt tags explaining the equipment or service depicted'
      ],
      verification_needed: 'Review content management system image upload guidelines.',
      source_url: targetUrl,
      source_element: 'img',
      evidence_type: 'dom_element'
    });
  }

  return {
    siteContext,
    forms,
    evidenceList,
    meta: {
      url: targetUrl,
      title: titleText,
      description: ($('meta[name="description"]').attr('content') || '').trim(),
      hasTel,
      telNumber,
      hasMailto,
      ctas,
      formsCount: forms.length,
      hasViewport,
      isHttps,
      brokenAnchors
    }
  };
}
