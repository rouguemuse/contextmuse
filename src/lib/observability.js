import * as Sentry from '@sentry/react';

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
const TOKEN_RE = /\b(?:lead_|sub_spm_)[a-zA-Z0-9_]+\b/g;

export function scrubSensitiveString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(EMAIL_RE, '[REDACTED_EMAIL]')
    .replace(PHONE_RE, '[REDACTED_PHONE]')
    .replace(TOKEN_RE, '[REDACTED_LEAD_TOKEN]');
}

export function scrubUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return rawUrl;
  try {
    const parsed = new URL(rawUrl, typeof window !== 'undefined' ? window.location.origin : 'https://www.contextmuse.com');
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return rawUrl.split('?')[0].split('#')[0];
  }
}

export function scrubSentryEvent(event) {
  if (!event || typeof event !== 'object') return null;

  // Never send user PII
  if (event.user) {
    delete event.user.email;
    delete event.user.username;
    delete event.user.ip_address;
  }

  // Scrub request URLs, query strings, headers, cookies, and body
  if (event.request) {
    if (event.request.url) event.request.url = scrubUrl(event.request.url);
    delete event.request.query_string;
    delete event.request.cookies;
    delete event.request.data;
    if (event.request.headers) {
      delete event.request.headers.cookie;
      delete event.request.headers.authorization;
      if (event.request.headers.referer) {
        event.request.headers.referer = scrubUrl(event.request.headers.referer);
      }
    }
  }

  // Scrub exception values
  if (event.exception && Array.isArray(event.exception.values)) {
    for (const ex of event.exception.values) {
      if (ex.value) ex.value = scrubSensitiveString(ex.value);
    }
  }

  if (event.message) {
    event.message = scrubSensitiveString(event.message);
  }

  // Scrub breadcrumbs
  if (event.breadcrumbs && Array.isArray(event.breadcrumbs.values)) {
    for (const bc of event.breadcrumbs.values) {
      if (bc.message) bc.message = scrubSensitiveString(bc.message);
      if (bc.data) {
        if (bc.data.url) bc.data.url = scrubUrl(bc.data.url);
        delete bc.data.body;
        delete bc.data.input;
      }
    }
  }

  return event;
}

export function resolveRuntimeEnvironment() {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_VERCEL_ENV) return import.meta.env.VITE_VERCEL_ENV;
  }
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname;
    if (host === 'www.contextmuse.com' || host === 'contextmuse.com') return 'production';
    if (host.endsWith('.vercel.app')) return 'preview';
  }
  return 'development';
}

let sentryInitialized = false;
const syntheticCapturedEvents = [];

export function initObservability() {
  if (typeof window === 'undefined') return;

  const dsn =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SENTRY_DSN) ||
    window.CM_SENTRY_DSN ||
    null;
  const environment = resolveRuntimeEnvironment();

  if (dsn && !sentryInitialized) {
    Sentry.init({
      dsn,
      environment,
      sendDefaultPii: false,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      beforeSend(event) {
        try {
          if (window.localStorage && window.localStorage.getItem('cm_analytics_consent') === 'denied') {
            return null;
          }
        } catch {}
        return scrubSentryEvent(event);
      },
      beforeBreadcrumb(breadcrumb) {
        if (!breadcrumb) return null;
        if (breadcrumb.category === 'ui.input') return null; // Never record form/whiteboard keystrokes
        if (breadcrumb.message) breadcrumb.message = scrubSensitiveString(breadcrumb.message);
        if (breadcrumb.data && breadcrumb.data.url) {
          breadcrumb.data.url = scrubUrl(breadcrumb.data.url);
        }
        return breadcrumb;
      },
    });
    sentryInitialized = true;
  }

  // Expose deterministic verification & scrubbed error-capture helper on CM_Analytics
  window.CM_Observability = {
    environment,
    sentryConfigured: Boolean(dsn),
    sentryInitialized,
    scrubSentryEvent,
    getCapturedBuffer: () => syntheticCapturedEvents.slice(),
    captureSyntheticError: (rawErrorOrMessage) => {
      try {
        if (window.localStorage && window.localStorage.getItem('cm_analytics_consent') === 'denied') {
          return null;
        }
      } catch {}
      const rawMsg =
        rawErrorOrMessage instanceof Error ? rawErrorOrMessage.message : String(rawErrorOrMessage || 'Synthetic Test Error');
      const syntheticEvent = scrubSentryEvent({
        environment,
        message: rawMsg,
        user: { email: 'redact-test@example.com', ip_address: '127.0.0.1' },
        request: {
          url: window.location.href,
          query_string: 'secret=1',
          cookies: 'session=abc',
        },
        exception: {
          values: [{ type: 'SyntheticVerificationError', value: rawMsg }],
        },
      });
      if (syntheticEvent) {
        syntheticEvent.scrubbedMessage = syntheticEvent.message;
      }
      syntheticCapturedEvents.push(syntheticEvent);
      if (sentryInitialized) {
        Sentry.captureException(
          rawErrorOrMessage instanceof Error ? rawErrorOrMessage : new Error(rawMsg)
        );
      }
      return syntheticEvent;
    },
  };
}

export function vercelAnalyticsBeforeSend(event) {
  try {
    if (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('cm_analytics_consent') === 'denied') {
      return null;
    }
  } catch {}
  if (!event || !event.url) return event;
  return {
    ...event,
    url: scrubUrl(event.url),
  };
}
