import { checkLeadRateLimit, processLeadSubmission } from './_lib/lead_service.js';
import { checkDbHealth } from './_lib/db.js';

const SUPABASE_LEAD_CAPTURE_URL = process.env.SUPABASE_LEAD_CAPTURE_URL || 'https://erhltgrchbufcunnsvnb.supabase.co/functions/v1/lead-capture';

// Sliding-window rate limiter for lead submissions: 15 submissions per 10 minutes per IP
const leadRateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_LEADS_PER_WINDOW = 15;

function checkClientRateLimit(ip) {
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
 * Normalizes and enriches lead attribution metadata server-side:
 * - Ensures source_page is always populated (derives from Referer header if missing, stripped of query params)
 * - Ensures form_id is present
 * - Normalizes inquiry_type (with fallback inference from form_id and source_page)
 * - Bundles all form-specific answers into answers_json to prevent data loss
 */
function normalizeLeadMetadata(rawBody, refererHeader) {
  // 1. Resolve source_page (e.g., '/contact/', '/signal/intake/')
  let sourcePage = rawBody.source_page || rawBody.form_source || rawBody.source;
  if (!sourcePage && refererHeader) {
    try {
      const parsedUrl = new URL(refererHeader);
      sourcePage = parsedUrl.pathname;
    } catch {
      sourcePage = refererHeader.split('?')[0];
    }
  }
  if (typeof sourcePage === 'string') {
    sourcePage = sourcePage.split('?')[0].split('#')[0].trim();
  }
  if (!sourcePage) {
    sourcePage = '/';
  }

  // 2. Resolve form_id
  const formId = (typeof rawBody.form_id === 'string' && rawBody.form_id.trim())
    ? rawBody.form_id.trim()
    : 'contact-wizard';

  // 3. Resolve inquiry_type
  let rawType = rawBody.inquiry_type || rawBody.service_interest || rawBody.service;
  const recognizedTypes = new Set([
    'contact',
    'diagnostic',
    'signal',
    'quote',
    'restaurant',
    'partner',
    'systems',
    'custom',
    'other'
  ]);

  let resolvedType = null;
  if (typeof rawType === 'string' && recognizedTypes.has(rawType.toLowerCase().trim())) {
    resolvedType = rawType.toLowerCase().trim();
  } else {
    const fId = formId.toLowerCase();
    const sPage = sourcePage.toLowerCase();

    // Map by form_id first
    if (fId.includes('contact') || fId === 'contact-wizard' || fId === 'intelligent-intake-form') {
      resolvedType = 'contact';
    } else if (fId.includes('diagnostic') || fId.includes('system-check') || fId === 'diagnostic-inquiry-form') {
      resolvedType = 'diagnostic';
    } else if (fId.includes('signal') || fId.startsWith('signal-branch')) {
      resolvedType = 'signal';
    } else if (fId.includes('quote') || fId.includes('qls')) {
      resolvedType = 'quote';
    } else if (fId.includes('restaurant')) {
      resolvedType = 'restaurant';
    } else if (fId.includes('partner')) {
      resolvedType = 'partner';
    } else if (fId.includes('custom') || fId.includes('systems') || fId.includes('operations')) {
      resolvedType = 'systems';
    }
    // Fall back to source_page
    else if (sPage.includes('/contact/')) {
      resolvedType = 'contact';
    } else if (sPage.includes('/signal/')) {
      resolvedType = 'signal';
    } else if (sPage.includes('/website-system-check/')) {
      resolvedType = 'diagnostic';
    } else if (sPage.includes('/quote') || sPage.includes('/services/quote')) {
      resolvedType = 'quote';
    } else if (sPage.includes('/systems/')) {
      resolvedType = 'systems';
    } else if (sPage.includes('/custom/')) {
      resolvedType = 'custom';
    } else if (sPage.includes('/partners/')) {
      resolvedType = 'partner';
    } else if (sPage.includes('/restaurant')) {
      resolvedType = 'restaurant';
    } else {
      resolvedType = 'other';
    }
  }

  // 4. Construct answers_json preserving all form-specific answers
  const answersJson = typeof rawBody.answers_json === 'object' && rawBody.answers_json !== null
    ? { ...rawBody.answers_json }
    : {};

  for (const [key, value] of Object.entries(rawBody)) {
    if (value !== undefined && value !== null && value !== '') {
      answersJson[key] = value;
    }
  }

  return {
    ...rawBody,
    form_id: formId,
    source_page: sourcePage,
    inquiry_type: resolvedType,
    referrer: refererHeader || rawBody.referrer || null,
    answers_json: answersJson
  };
}

export default async function handler(req, res) {
  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  const isMockMode = process.env.LEAD_STORAGE_MOCK === 'true';

  // Allow GET for health check
  if (req.method === 'GET') {
    if (isMockMode) {
      try {
        const health = await checkDbHealth();
        return res.status(200).json({
          ok: health.ok,
          status: 'ok',
          endpoint: '/api/lead',
          service: 'lead-capture-backend',
          storage_status: health.status,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        return res.status(500).json({ ok: false, error: 'Health check failed.' });
      }
    }

    try {
      const upstreamRes = await fetch(SUPABASE_LEAD_CAPTURE_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const data = await upstreamRes.json().catch(() => ({}));
      const isHealthy = upstreamRes.ok && data.status === 'ok';

      return res.status(isHealthy ? 200 : 503).json({
        ok: isHealthy,
        status: isHealthy ? 'ok' : 'unreachable',
        endpoint: '/api/lead',
        service: 'lead-capture-backend',
        storage_status: isHealthy ? 'connected' : 'unreachable',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('[Health Check Proxy Error]', err.message);
      return res.status(503).json({
        ok: false,
        status: 'unreachable',
        error: 'Backend health check failed.',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Enforce POST for submissions
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({
      ok: false,
      success: false,
      error: 'Method Not Allowed. Use POST to submit inquiries.'
    });
  }

  // 1. Client IP Extraction & Defensive Rate Limiting
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket?.remoteAddress || '127.0.0.1');
  const userAgent = req.headers['user-agent'] || 'unknown';

  const rateLimit = checkClientRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      ok: false,
      success: false,
      error: `Submission rate limit exceeded. Please wait ${rateLimit.retryAfterSeconds} seconds before submitting again.`
    });
  }

  // 2. Parse & Validate Payload Size
  let body = req.body;
  if (typeof body === 'string') {
    if (body.length > 100 * 1024) {
      return res.status(413).json({
        ok: false,
        success: false,
        error: 'Payload exceeds maximum allowed size (100KB).'
      });
    }
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({
        ok: false,
        success: false,
        error: 'Malformed JSON payload.'
      });
    }
  } else if (!body || typeof body !== 'object') {
    return res.status(400).json({
      ok: false,
      success: false,
      error: 'Missing or invalid request payload.'
    });
  }

  // 3. Normalize & Enrich Lead Attribution Metadata
  const normalizedPayload = normalizeLeadMetadata(body, req.headers['referer']);

  // 4. Process Lead (Mock mode for local unit tests, Live proxy in production)
  if (isMockMode) {
    try {
      const result = await processLeadSubmission(normalizedPayload, clientIp, userAgent);
      if (!result.ok && !result.success) {
        return res.status(result.status || 400).json({
          success: false,
          ok: false,
          error: result.error,
          code: result.code || 'VALIDATION_FAILED'
        });
      }
      return res.status(201).json({
        success: true,
        ok: true,
        submission_id: result.submission_id,
        status: result.status,
        created_at: result.created_at,
        duplicate: Boolean(result.duplicate),
        synthetic: Boolean(result.synthetic)
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        ok: false,
        error: 'An unexpected error occurred while processing your inquiry.'
      });
    }
  }

  // 5. Proxy Request to Supabase Edge Function (Production Source of Truth)
  try {
    const upstreamRes = await fetch(SUPABASE_LEAD_CAPTURE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': userAgent,
        'X-Forwarded-For': clientIp,
        'Referer': req.headers['referer'] || ''
      },
      body: JSON.stringify(normalizedPayload)
    });

    const data = await upstreamRes.json().catch(() => ({}));

    // Successful persistence (201 Created or 200 Duplicate OK)
    if (upstreamRes.ok && (data.success || data.ok)) {
      return res.status(upstreamRes.status).json({
        success: true,
        ok: true,
        submission_id: data.submission_id,
        status: data.status || 'received',
        created_at: data.created_at || new Date().toISOString(),
        duplicate: Boolean(data.duplicate),
        synthetic: Boolean(data.synthetic)
      });
    }

    // Client Validation Errors (400)
    if (upstreamRes.status === 400) {
      let friendlyError = data.error;
      if (data.field === 'email' || data.error === 'VALIDATION_ERROR' && data.field === 'email') {
        friendlyError = 'Please provide a valid email address so I can respond to your inquiry.';
      } else if (data.field === 'name' || data.error === 'VALIDATION_ERROR' && data.field === 'name') {
        friendlyError = 'Please provide your name.';
      } else if (!friendlyError || friendlyError === 'VALIDATION_ERROR') {
        friendlyError = 'Please check your submission details and try again.';
      }

      return res.status(400).json({
        success: false,
        ok: false,
        error: friendlyError,
        field: data.field,
        code: 'VALIDATION_FAILED'
      });
    }

    // Rate Limit (429)
    if (upstreamRes.status === 429) {
      return res.status(429).json({
        success: false,
        ok: false,
        error: 'Submission rate limit exceeded. Please wait a moment before trying again.'
      });
    }

    // Upstream Server / Persistence Errors
    console.error('[Upstream Supabase Error]', upstreamRes.status, data);
    return res.status(503).json({
      success: false,
      ok: false,
      code: 'STORAGE_UNAVAILABLE',
      error: "We couldn't safely save your inquiry yet. Please try again."
    });
  } catch (err) {
    console.error('[API Lead Proxy Exception]', err.message);
    return res.status(503).json({
      success: false,
      ok: false,
      code: 'PROXY_NETWORK_FAILURE',
      error: "We couldn't safely save your inquiry yet. Please try again."
    });
  }
}
