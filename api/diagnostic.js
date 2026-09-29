import { checkRateLimit, safeFetchHtml } from './_lib/security.js';
import { analyzePageEvidence } from './_lib/analyzer.js';
import { synthesizeWithOpenAI } from './_lib/openai.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS & Header Security
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed. Use POST.' });
  }

  // 1. IP Rate Limiting
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket?.remoteAddress || '127.0.0.1');
  
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      ok: false,
      error: `Diagnostic rate limit reached. Please wait ${rateLimit.retryAfterSeconds} seconds before checking another URL.`
    });
  }

  // 2. Parse & Validate Payload
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, error: 'Invalid JSON payload.' });
    }
  }

  const { url, businessType, goal } = body || {};

  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return res.status(400).json({ ok: false, error: 'Please provide a valid website address to analyze.' });
  }

  const cleanUrl = url.trim();

  // 3. Safe Fetch with SSRF Defense
  let crawlResult;
  try {
    crawlResult = await safeFetchHtml(cleanUrl);
  } catch (err) {
    console.error('Fetch error:', err.message);
    return res.status(400).json({
      ok: false,
      error: err.message || 'Could not access the website. Please confirm the URL is publicly reachable.'
    });
  }

  // 4. Deterministic Analysis
  let analysis;
  try {
    analysis = analyzePageEvidence(crawlResult.html, crawlResult.finalUrl, {
      businessType: typeof businessType === 'string' ? businessType.slice(0, 100) : '',
      goal: typeof goal === 'string' ? goal.slice(0, 200) : ''
    });
  } catch (err) {
    console.error('Analysis error:', err.message);
    return res.status(500).json({
      ok: false,
      error: 'An error occurred while analyzing the page structure. Please try again.'
    });
  }

  // 5. Synthesis (OpenAI with automatic deterministic fallback)
  let diagnostic;
  try {
    diagnostic = await synthesizeWithOpenAI(analysis.evidenceList, analysis.meta, {
      businessType,
      goal
    });
  } catch (err) {
    console.error('Synthesis error:', err.message);
    diagnostic = {
      source: 'deterministic_emergency',
      quick_read_summary: `Diagnostic findings for ${crawlResult.finalUrl}`,
      most_important: analysis.evidenceList[0] || {
        title: 'Review complete',
        observation: 'Analysis completed successfully.',
        why_it_matters: 'Reviewing systems clarity is essential for conversion.',
        what_could_improve: 'Align intake mechanisms to match high-intent customer requests.'
      },
      quick_wins: [],
      system_opportunities: [],
      technical_notes: [],
      proof_key: 'quote_lead'
    };
  }

  const diagnosticId = 'diag_' + crypto.randomBytes(6).toString('hex');

  return res.status(200).json({
    ok: true,
    diagnosticId,
    targetUrl: crawlResult.finalUrl,
    scannedAt: new Date().toISOString(),
    summary: diagnostic.quick_read_summary,
    mostImportant: diagnostic.most_important,
    quickWins: diagnostic.quick_wins || [],
    systemOpportunities: diagnostic.system_opportunities || [],
    technicalNotes: diagnostic.technical_notes || [],
    proofKey: diagnostic.proof_key || 'quote_lead',
    source: diagnostic.source,
    evidenceCount: analysis.evidenceList.length
  });
}
