import dns from 'dns/promises';
import http from 'http';
import https from 'https';
import { URL } from 'url';

// In-memory rate limiting map: ip -> [timestamps]
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 6;
const MAX_REDIRECTS = 3;
const MAX_RESPONSE_BYTES = 2.5 * 1024 * 1024; // 2.5 MB
const FETCH_TIMEOUT_MS = 7000; // 7 seconds

/**
 * Checks in-memory sliding window rate limit for an IP
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  
  // Cleanup old entries
  if (rateLimitMap.size > 5000) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const valid = timestamps.filter(t => t > windowStart);
      if (valid.length === 0) rateLimitMap.delete(key);
      else rateLimitMap.set(key, valid);
    }
  }

  const existing = rateLimitMap.get(ip) || [];
  const current = existing.filter(t => t > windowStart);
  
  if (current.length >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current[0] + RATE_LIMIT_WINDOW_MS - now) / 1000)
    };
  }

  current.push(now);
  rateLimitMap.set(ip, current);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - current.length };
}

/**
 * Validates whether an IPv4 address is private or reserved
 */
function isPrivateIPv4(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return true;

  const [a, b] = parts;
  // 0.0.0.0/8
  if (a === 0) return true;
  // 10.0.0.0/8
  if (a === 10) return true;
  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;
  // 169.254.0.0/16 (Link-local & AWS/GCP/Azure metadata 169.254.169.254)
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12 (172.16.x.x - 172.31.x.x)
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16
  if (a === 192 && b === 168) return true;
  // 100.64.0.0/10 (Carrier-grade NAT)
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 198.18.0.0/15 (Benchmarking)
  if (a === 198 && (b === 18 || b === 19)) return true;
  // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
  if (a >= 224) return true;

  return false;
}

/**
 * Validates whether an IPv6 address is private, loopback, or reserved
 */
function isPrivateIPv6(ip) {
  const normalized = ip.toLowerCase().trim();
  if (normalized === '::1' || normalized === '::') return true;
  // IPv4-mapped IPv6 (::ffff:127.0.0.1)
  if (normalized.startsWith('::ffff:')) {
    const ipv4 = normalized.replace('::ffff:', '');
    return isPrivateIPv4(ipv4);
  }
  // Unique local address fc00::/7
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
  // Link-local unicast fe80::/10
  if (normalized.startsWith('fe80') || normalized.startsWith('fe90') || normalized.startsWith('fea0') || normalized.startsWith('feb0')) return true;
  // Multicast ff00::/8
  if (normalized.startsWith('ff')) return true;

  return false;
}

/**
 * Validates a target URL against SSRF attack vectors
 */
export async function validateUrlSecurity(urlString) {
  let parsed;
  try {
    // Ensure protocol is present
    if (!/^https?:\/\//i.test(urlString)) {
      urlString = 'https://' + urlString;
    }
    parsed = new URL(urlString);
  } catch {
    throw new Error('Invalid URL format. Please provide a valid web address.');
  }

  // Protocol Whitelist
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Unsupported protocol. Only HTTP and HTTPS URLs are permitted.');
  }

  const hostname = parsed.hostname.toLowerCase();

  // Deny internal/local hostnames
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan') ||
    hostname.endsWith('.corp') ||
    hostname.endsWith('.home') ||
    hostname.endsWith('.arpa') ||
    hostname.includes('169.254') ||
    hostname === '0.0.0.0' ||
    hostname === '[::1]'
  ) {
    throw new Error('Target hostname is an internal or local address and cannot be audited.');
  }

  // Check if hostname is directly an IP
  const isDirectIPv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  if (isDirectIPv4) {
    if (isPrivateIPv4(hostname)) {
      throw new Error('Access to private/local network IP addresses is restricted.');
    }
    return { url: parsed.toString(), ip: hostname };
  }

  // Resolve DNS to verify external IP
  let addresses = [];
  try {
    const records = await dns.lookup(hostname, { all: true });
    addresses = records.map(r => r.address);
  } catch (err) {
    throw new Error(`Unable to resolve host domain "${hostname}". Please verify the website address.`);
  }

  if (!addresses || addresses.length === 0) {
    throw new Error(`No DNS records found for host "${hostname}".`);
  }

  for (const address of addresses) {
    const isV4 = address.includes('.');
    if (isV4 && isPrivateIPv4(address)) {
      throw new Error(`Host resolves to a restricted private network address (${address}).`);
    }
    if (!isV4 && isPrivateIPv6(address)) {
      throw new Error(`Host resolves to a restricted IPv6 network address.`);
    }
  }

  return { url: parsed.toString(), ip: addresses[0] };
}

/**
 * Safely fetches an HTML page with timeout, redirect limit, size limit, and SSRF re-validation
 */
export async function safeFetchHtml(initialUrl) {
  let currentUrl = initialUrl;
  let redirectCount = 0;

  while (redirectCount <= MAX_REDIRECTS) {
    const validated = await validateUrlSecurity(currentUrl);
    const targetUrl = new URL(validated.url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(targetUrl.toString(), {
        method: 'GET',
        signal: controller.signal,
        redirect: 'manual', // Manual handling to enforce SSRF validation at every hop
        headers: {
          'User-Agent': 'ContextAndMuse-SystemCheck/1.0 (+https://www.contextmuse.com/website-system-check/)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      // Handle Redirects
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const locationHeader = response.headers.get('location');
        if (!locationHeader) {
          throw new Error('Redirect returned without a location header.');
        }
        redirectCount++;
        if (redirectCount > MAX_REDIRECTS) {
          throw new Error('Too many redirects encountered while reaching the website.');
        }
        currentUrl = new URL(locationHeader, targetUrl).toString();
        continue;
      }

      if (!response.ok) {
        throw new Error(`Website returned HTTP status ${response.status} (${response.statusText || 'Error'}).`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
        throw new Error(`Target returned non-HTML content type (${contentType.split(';')[0] || 'unknown'}).`);
      }

      // Stream response with byte size limit
      const reader = response.body.getReader();
      const chunks = [];
      let totalBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.length;
        if (totalBytes > MAX_RESPONSE_BYTES) {
          reader.cancel();
          throw new Error('Target webpage exceeds maximum allowed size (2.5MB).');
        }
        chunks.push(value);
      }

      const fullBuffer = Buffer.concat(chunks);
      // Decode HTML text (UTF-8 default)
      const htmlText = fullBuffer.toString('utf8');

      return {
        html: htmlText,
        finalUrl: targetUrl.toString(),
        statusCode: response.status,
        byteSize: totalBytes,
        contentType
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Connection timed out after ${FETCH_TIMEOUT_MS / 1000}s while attempting to reach ${targetUrl.hostname}.`);
      }
      throw err;
    }
  }

  throw new Error('Exceeded maximum allowed redirect hops.');
}
