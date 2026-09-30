import crypto from 'crypto';
import { isDbConfigured, insertLead, findLeadByIdempotency, updateNotificationStatus } from './db.js';

// Sliding-window rate limiter for lead submissions: 10 submissions per 10 minutes per IP
const leadRateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_LEADS_PER_WINDOW = 10;

/**
 * Checks in-memory sliding window rate limit for lead submissions
 */
export function checkLeadRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  if (leadRateLimitMap.size > 2000) {
    for (const [key, timestamps] of leadRateLimitMap.entries()) {
      const valid = timestamps.filter(t => t > windowStart);
      if (valid.length === 0) leadRateLimitMap.delete(key);
      else leadRateLimitMap.set(key, valid);
    }
  }

  const existing = leadRateLimitMap.get(ip) || [];
  const current = existing.filter(t => t > windowStart);

  if (current.length >= MAX_LEADS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current[0] + RATE_LIMIT_WINDOW_MS - now) / 1000)
    };
  }

  current.push(now);
  leadRateLimitMap.set(ip, current);
  return { allowed: true, remaining: MAX_LEADS_PER_WINDOW - current.length };
}

/**
 * Validates email address format
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim()) && email.length <= 255;
}

/**
 * Computes an anonymized IP hash with salt
 */
function hashClientIp(ip) {
  const salt = process.env.LEAD_ENCRYPTION_SALT || 'contextmuse_production_lead_salt_2026';
  return crypto.createHash('sha256').update(`${ip}:${salt}`).digest('hex').slice(0, 32);
}

/**
 * Computes an idempotency hash for duplicate submission detection (30-second window)
 */
function computeIdempotencyHash(email, formId, message) {
  const windowSlot = Math.floor(Date.now() / (30 * 1000));
  const rawKey = `${email.toLowerCase().trim()}:${formId || 'default'}:${(message || '').trim().slice(0, 200)}:${windowSlot}`;
  return crypto.createHash('sha256').update(rawKey).digest('hex').slice(0, 48);
}

/**
 * Normalizes inquiry type with strict catch-all to 'other'
 */
function normalizeInquiryType(rawType, formId, sourcePage) {
  const recognized = new Set(['contact', 'quote', 'custom', 'systems', 'signal', 'partner', 'other']);
  if (typeof rawType === 'string' && recognized.has(rawType.toLowerCase().trim())) {
    return rawType.toLowerCase().trim();
  }

  const combined = `${formId || ''} ${sourcePage || ''} ${rawType || ''}`.toLowerCase();
  if (combined.includes('quote') || combined.includes('dumpster') || combined.includes('pricing')) return 'quote';
  if (combined.includes('custom') || combined.includes('bespoke') || combined.includes('portal')) return 'custom';
  if (combined.includes('system') || combined.includes('diagnostic') || combined.includes('audit') || combined.includes('check')) return 'systems';
  if (combined.includes('signal') || combined.includes('restaurant') || combined.includes('pos')) return 'signal';
  if (combined.includes('partner') || combined.includes('agency')) return 'partner';
  if (combined.includes('contact') || combined.includes('wizard')) return 'contact';

  return 'other'; // Mandatory catch-all for unknown forms
}

/**
 * Asynchronously dispatches email / Formspree secondary notification without blocking HTTP response
 */
async function dispatchSecondaryNotification(lead) {
  const recipient = process.env.LEAD_NOTIFICATION_EMAIL || 'jayme@contextmuse.com';
  const resendApiKey = process.env.RESEND_API_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const formspreeEndpoint = process.env.FORMSPREE_BACKEND_FORWARD_URL;

  if (!resendApiKey && !sendgridApiKey && !formspreeEndpoint) {
    await updateNotificationStatus(lead.id, 'unconfigured');
    return;
  }

  try {
    const fromAddress = process.env.SYSTEM_NOTIFICATION_FROM || 'leads@contextmuse.com';
    const subject = `[New Inbound Lead] ${lead.name} — ${lead.inquiry_type} (${lead.form_id})`;
    
    const lines = [
      `New lead captured on Context & Muse:`,
      `----------------------------------------`,
      `Submission ID: ${lead.id}`,
      `Date/Time:     ${lead.created_at}`,
      `Source Page:   ${lead.source_page} (${lead.form_id})`,
      `Inquiry Type:  ${lead.inquiry_type}`,
      `Name:          ${lead.name}`,
      `Email:         ${lead.email}`,
      `Phone:         ${lead.phone || 'N/A'}`,
      `Company:       ${lead.company || 'N/A'}`,
      `Website:       ${lead.website || 'N/A'}`,
      `Budget Range:  ${lead.budget_range || 'N/A'}`,
      `Timeline:      ${lead.timeline || 'N/A'}`,
      `Test Lead:     ${lead.is_test ? 'YES' : 'NO'}`,
      `----------------------------------------`,
      `Message / Details:`,
      lead.message || '(No freeform message)',
      `----------------------------------------`,
      `Structured Answers:`,
      JSON.stringify(lead.answers_json, null, 2)
    ];
    const textBody = lines.join('\n');

    if (resendApiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddress,
          to: recipient,
          subject,
          text: textBody
        })
      });
      if (res.ok) {
        await updateNotificationStatus(lead.id, 'sent');
        return;
      }
    }

    if (sendgridApiKey) {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: recipient }] }],
          from: { email: fromAddress },
          subject,
          content: [{ type: 'text/plain', value: textBody }]
        })
      });
      if (res.ok) {
        await updateNotificationStatus(lead.id, 'sent');
        return;
      }
    }

    if (formspreeEndpoint) {
      const res = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _submission_id: lead.id,
          _created_at: lead.created_at,
          ...lead
        })
      });
      if (res.ok) {
        await updateNotificationStatus(lead.id, 'sent');
        return;
      }
    }

    await updateNotificationStatus(lead.id, 'failed');
  } catch (err) {
    console.error('[Secondary Notification Exception]', err.message);
    await updateNotificationStatus(lead.id, 'failed');
  }
}

/**
 * Processes, validates, deduplicates, and stores an incoming lead.
 */
export async function processLeadSubmission(rawBody, clientIp, userAgent) {
  // 1. Check honeypot first
  const honeypot = rawBody._gotcha || rawBody.honeypot || rawBody.website_url_hp;
  if (honeypot && String(honeypot).trim().length > 0) {
    // Return synthetic success for bots, do not persist
    return {
      success: true,
      ok: true,
      submission_id: 'sub_spm_' + crypto.randomBytes(8).toString('hex'),
      status: 'received',
      created_at: new Date().toISOString(),
      synthetic: true
    };
  }

  // 2. Validate email
  const email = typeof rawBody.email === 'string' ? rawBody.email.trim() : '';
  if (!email || !isValidEmail(email)) {
    return {
      success: false,
      ok: false,
      status: 400,
      code: 'VALIDATION_FAILED',
      error: 'Please provide a valid email address so I can respond to your inquiry.'
    };
  }

  // 3. Validate name
  const name = typeof rawBody.name === 'string' ? rawBody.name.trim().slice(0, 255) : '';
  if (!name || name.length === 0) {
    return {
      success: false,
      ok: false,
      status: 400,
      code: 'VALIDATION_FAILED',
      error: 'Please provide your name.'
    };
  }

  // 4. Extract and normalize fields
  const isTest = Boolean(rawBody.is_test === true || rawBody.is_test === 'true' || rawBody.test === true || rawBody.test === 'true');
  const formId = typeof rawBody.form_id === 'string' ? rawBody.form_id.trim().slice(0, 64) : 'generic-intake';
  const sourcePage = typeof (rawBody.source_page || rawBody.form_source) === 'string'
    ? (rawBody.source_page || rawBody.form_source).trim().slice(0, 255)
    : '/';

  const inquiryType = normalizeInquiryType(rawBody.inquiry_type || rawBody.service_interest || rawBody.service, formId, sourcePage);

  const phone = (rawBody.phone || rawBody.telephone || rawBody.phone_number || '').toString().trim().slice(0, 64) || null;
  const company = (rawBody.company || rawBody.business_name || rawBody.business || '').toString().trim().slice(0, 255) || null;
  const website = (rawBody.website || rawBody.current_website || rawBody.scanned_website || rawBody.url || '').toString().trim().slice(0, 512) || null;

  const budgetRange = (rawBody.budget_range || rawBody.budget || rawBody.budget_tier || '').toString().trim().slice(0, 64) || null;
  const timeline = (rawBody.timeline || rawBody.timeframe || rawBody.target_timeline || '').toString().trim().slice(0, 64) || null;

  const message = (
    rawBody.message ||
    rawBody.plain_language_description ||
    rawBody.problem_description ||
    rawBody.operational_friction ||
    rawBody.additional_context ||
    rawBody.concern ||
    rawBody.symptom ||
    rawBody.context ||
    ''
  ).toString().trim().slice(0, 10000) || null;

  // UTM tracking
  const utmSource = typeof rawBody.utm_source === 'string' ? rawBody.utm_source.slice(0, 128) : null;
  const utmMedium = typeof rawBody.utm_medium === 'string' ? rawBody.utm_medium.slice(0, 128) : null;
  const utmCampaign = typeof rawBody.utm_campaign === 'string' ? rawBody.utm_campaign.slice(0, 128) : null;
  const utmContent = typeof rawBody.utm_content === 'string' ? rawBody.utm_content.slice(0, 128) : null;
  const referrer = typeof rawBody.referrer === 'string' ? rawBody.referrer.slice(0, 512) : null;

  // Store all submitted key/values in answers_json to preserve full context
  const answersJson = { ...rawBody };

  // 5. Idempotency Check (30-second window multi-click protection)
  const idempotencyHash = computeIdempotencyHash(email, formId, message);
  try {
    const existing = await findLeadByIdempotency(idempotencyHash);
    if (existing) {
      return {
        success: true,
        ok: true,
        submission_id: existing.id,
        status: existing.status || 'received',
        created_at: existing.created_at,
        duplicate: true
      };
    }
  } catch (checkErr) {
    // Proceed to insert attempt
  }

  // 6. Check Database Configuration
  if (!isDbConfigured()) {
    return {
      success: false,
      ok: false,
      status: 503,
      code: 'DATABASE_UNCONFIGURED',
      error: "We couldn't safely save your inquiry yet. Please try again."
    };
  }

  // 7. Assemble Record
  const submissionId = 'lead_' + Date.now().toString(36) + '_' + crypto.randomBytes(4).toString('hex');
  const clientIpHash = hashClientIp(clientIp || '127.0.0.1');
  const safeUserAgent = typeof userAgent === 'string' ? userAgent.slice(0, 512) : 'unknown';

  const leadRecord = {
    id: submissionId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'new',
    is_test: isTest,
    form_id: formId,
    source_page: sourcePage,
    inquiry_type: inquiryType,
    name,
    email,
    phone,
    company,
    website,
    message,
    budget_range: budgetRange,
    timeline,
    answers_json: answersJson,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_content: utmContent,
    referrer,
    notification_status: 'pending',
    schema_version: 'v1',
    client_ip_hash: clientIpHash,
    user_agent: safeUserAgent,
    idempotency_hash: idempotencyHash
  };

  // 8. Persist to Database (Source of Truth)
  let persisted;
  try {
    persisted = await insertLead(leadRecord);
  } catch (dbErr) {
    console.error('[Lead Persistence Error]', dbErr.message);
    return {
      success: false,
      ok: false,
      status: 500,
      code: 'STORAGE_FAILED',
      error: "We couldn't safely save your inquiry yet. Please try again."
    };
  }

  // 9. Secondary Notification (Non-blocking)
  dispatchSecondaryNotification(persisted).catch(err => {
    console.error('[Secondary Notification Exception]', err.message);
  });

  // 10. Return Durable Confirmation Contract
  return {
    success: true,
    ok: true,
    submission_id: persisted.id,
    status: persisted.status || 'received',
    created_at: persisted.created_at
  };
}

