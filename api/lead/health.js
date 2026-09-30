const SUPABASE_LEAD_CAPTURE_URL = process.env.SUPABASE_LEAD_CAPTURE_URL || 'https://erhltgrchbufcunnsvnb.supabase.co/functions/v1/lead-capture';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed. Use GET for health checks.' });
  }

  if (process.env.LEAD_STORAGE_MOCK === 'true') {
    return res.status(200).json({
      ok: true,
      service: 'lead-capture-health',
      storage_status: 'mock_active',
      configured: true,
      timestamp: new Date().toISOString()
    });
  }

  try {
    const upstreamRes = await fetch(SUPABASE_LEAD_CAPTURE_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const data = await upstreamRes.json().catch(() => ({}));
    const isHealthy = upstreamRes.ok && data.status === 'ok';

    const httpCode = isHealthy ? 200 : 503;
    return res.status(httpCode).json({
      ok: isHealthy,
      service: 'lead-capture-health',
      storage_status: isHealthy ? 'connected' : 'unreachable',
      configured: isHealthy,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Health Endpoint Proxy Error]', err.message);
    return res.status(503).json({
      ok: false,
      service: 'lead-capture-health',
      storage_status: 'unreachable',
      configured: false,
      error: 'Health check failed.',
      timestamp: new Date().toISOString()
    });
  }
}
