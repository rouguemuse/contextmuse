(function() {
    'use strict';

    // Allowed parameters for generate_lead (Strictly Non-PII)
    var ALLOWED_LEAD_KEYS = new Set([
        'form_id',
        'inquiry_type',
        'service_interest',
        'budget_range',
        'timeline',
        'lead_source'
    ]);

    var EMAIL_REGEX = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    var PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

    function cleanString(val) {
        if (typeof val !== 'string') return '';
        var trimmed = val.trim();
        // Disallow emails, phone numbers, or lead persistence tokens
        if (trimmed.includes('@') || EMAIL_REGEX.test(trimmed) || PHONE_REGEX.test(trimmed) || trimmed.startsWith('lead_') || trimmed.startsWith('sub_spm_')) {
            return '';
        }
        // Disallow placeholder strings
        if (trimmed === 'not_specified' || trimmed === 'undefined' || trimmed === 'null') {
            return '';
        }
        // Disallow HTML tags or quotes
        trimmed = trimmed.replace(/[<>'"]/g, '');
        return trimmed.slice(0, 64);
    }

    function emitGtag(eventName, params) {
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params);
        } else {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push(Object.assign({ event: eventName }, params));
        }
    }

    var startedForms = new Set();
    var recordedLeads = new Set();
    var lastLeadTime = 0;
    var lastLeadKey = '';

    var CM_Analytics = {
        /**
         * Fired ONLY after /api/lead has confirmed durable persistence
         * Gate: response.ok && (data.success || data.ok) && submission_id.startsWith('lead_') && data.synthetic !== true
         */
        trackGenerateLead: function(rawParams) {
            if (!rawParams || typeof rawParams !== 'object') return;

            var cleanParams = {};
            var keys = Object.keys(rawParams);
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                if (ALLOWED_LEAD_KEYS.has(k)) {
                    var val = cleanString(String(rawParams[k] || ''));
                    // Only include non-empty values; do not send placeholder strings
                    if (val && val !== 'not_specified') {
                        cleanParams[k] = val;
                    }
                }
            }

            // Semantic checks: Never fabricate budget_range from service tier names
            if (cleanParams.budget_range && (cleanParams.budget_range === 'diagnostic' || cleanParams.budget_range === 'snapshot' || cleanParams.budget_range === 'ongoing')) {
                delete cleanParams.budget_range;
            }

            // Must have a genuine form_id
            if (!cleanParams.form_id) {
                cleanParams.form_id = 'lead-form';
            }

            // Deduplication guards against double submits and rapid re-executions
            var now = Date.now();
            var rapidDedupKey = (cleanParams.inquiry_type || '') + ':' + (cleanParams.lead_source || '');
            if (now - lastLeadTime < 4000 && rapidDedupKey === lastLeadKey) {
                return;
            }

            var dedupKey = cleanParams.form_id + ':' + (cleanParams.inquiry_type || '') + ':' + (cleanParams.service_interest || '') + ':' + (cleanParams.lead_source || '');
            if (recordedLeads.has(dedupKey)) {
                return;
            }
            recordedLeads.add(dedupKey);
            lastLeadTime = now;
            lastLeadKey = rapidDedupKey;

            emitGtag('generate_lead', cleanParams);
        },

        /**
         * Fired ONCE when user first meaningfully interacts with an intake form (NOT on page load)
         */
        trackIntakeStarted: function(formId, inquiryType) {
            var fId = cleanString(String(formId || 'unknown'));
            var inqType = cleanString(String(inquiryType || 'general'));
            if (!fId || startedForms.has(fId)) return;

            startedForms.add(fId);
            emitGtag('intake_started', {
                form_id: fId,
                inquiry_type: inqType
            });
        },

        /**
         * Fired when a multi-step intake advances successfully
         */
        trackIntakeStepCompleted: function(formId, stepNumber, stepName, inquiryType) {
            emitGtag('intake_step_completed', {
                form_id: cleanString(String(formId || 'unknown')),
                step_number: Number(stepNumber) || 1,
                step_name: cleanString(String(stepName || '')),
                inquiry_type: cleanString(String(inquiryType || 'general'))
            });
        },

        /**
         * Fired when an important commercial CTA is clicked
         */
        trackCtaClick: function(ctaName, ctaLocation, destination) {
            emitGtag('cta_click', {
                cta_name: cleanString(String(ctaName || 'CTA')),
                cta_location: cleanString(String(ctaLocation || 'general')),
                destination: cleanString(String(destination || ''))
            });
        },

        /**
         * Fired when direct contact links (email, WhatsApp) are clicked
         */
        trackContactClick: function(contactMethod, ctaLocation) {
            emitGtag('contact_click', {
                contact_method: cleanString(String(contactMethod || 'unknown')),
                cta_location: cleanString(String(ctaLocation || 'general'))
            });
        },

        /**
         * Outbound & Campaign Funnel Observability Events
         */
        trackOutboundLandingView: function(params) {
            params = params || {};
            emitGtag('outbound_landing_view', {
                utm_source: cleanString(String(params.utm_source || '')),
                utm_medium: cleanString(String(params.utm_medium || '')),
                utm_campaign: cleanString(String(params.utm_campaign || '')),
                landing_page: window.location.pathname
            });
        },

        trackDiagnosticStarted: function(diagnosticType, params) {
            params = params || {};
            var cleanObj = {
                diagnostic_type: cleanString(String(diagnosticType || 'website_system_check')),
                source_page: window.location.pathname
            };
            if (params.utm_source) cleanObj.utm_source = cleanString(String(params.utm_source));
            if (params.utm_campaign) cleanObj.utm_campaign = cleanString(String(params.utm_campaign));
            emitGtag('diagnostic_started', cleanObj);
        },

        trackDiagnosticCompleted: function(diagnosticType, params) {
            params = params || {};
            var cleanObj = {
                diagnostic_type: cleanString(String(diagnosticType || 'website_system_check')),
                findings_count: Number(params.findings_count) || 0
            };
            if (params.utm_source) cleanObj.utm_source = cleanString(String(params.utm_source));
            if (params.utm_campaign) cleanObj.utm_campaign = cleanString(String(params.utm_campaign));
            emitGtag('diagnostic_completed', cleanObj);
        },

        trackDiagnosticToConsultation: function(diagnosticId, params) {
            params = params || {};
            var cleanObj = {
                diagnostic_id: cleanString(String(diagnosticId || '')),
                source_page: window.location.pathname
            };
            if (params.utm_source) cleanObj.utm_source = cleanString(String(params.utm_source));
            if (params.utm_campaign) cleanObj.utm_campaign = cleanString(String(params.utm_campaign));
            emitGtag('diagnostic_to_consultation', cleanObj);
        },

        trackProjectIntakeStarted: function(formId, params) {
            params = params || {};
            var cleanObj = {
                form_id: cleanString(String(formId || 'contact-wizard')),
                source_page: window.location.pathname
            };
            if (params.inquiry_type) cleanObj.inquiry_type = cleanString(String(params.inquiry_type));
            if (params.utm_source) cleanObj.utm_source = cleanString(String(params.utm_source));
            if (params.utm_campaign) cleanObj.utm_campaign = cleanString(String(params.utm_campaign));
            emitGtag('project_intake_started', cleanObj);
        },

        getAttribution: function() {
            try {
                var stored = sessionStorage.getItem('cm_attribution');
                if (stored) {
                    var parsed = JSON.parse(stored);
                    if (parsed && typeof parsed === 'object') return parsed;
                }
            } catch (_) {}
            return {};
        }
    };

    window.CM_Analytics = CM_Analytics;

    // Fetch Interceptor: guarantees generate_lead fires ONLY after genuine durable persistence from /api/lead
    var origFetch = window.fetch;
    if (typeof origFetch === 'function') {
        window.fetch = function(url, options) {
            var urlStr = (typeof url === 'string') ? url : (url && url.url ? url.url : '');
            var isLeadApi = urlStr.indexOf('/api/lead') !== -1;
            
            var promise = origFetch.apply(this, arguments);
            if (!isLeadApi) {
                return promise;
            }

            return promise.then(function(response) {
                try {
                    if (response && response.ok) {
                        var clone = response.clone();
                        clone.json().then(function(data) {
                            // STRICT GATE: Real persisted leads only. Never synthetic or bot/honeypot leads
                            if (data &&
                                (data.success === true || data.ok === true) &&
                                typeof data.submission_id === 'string' &&
                                data.submission_id.indexOf('lead_') === 0 &&
                                data.synthetic !== true) {

                                var reqPayload = {};
                                try {
                                    if (options && options.body && typeof options.body === 'string') {
                                        reqPayload = JSON.parse(options.body);
                                    }
                                } catch (_) {}

                                var formId = reqPayload.form_id || (window.location.pathname.indexOf('/contact') !== -1 ? 'contact-wizard' : 'lead-form');
                                var inqType = reqPayload.inquiry_type || (window.location.pathname.indexOf('/contact') !== -1 ? 'contact' : (window.location.pathname.indexOf('/signal') !== -1 ? 'signal' : (window.location.pathname.indexOf('/website-system-check') !== -1 ? 'website_system_check' : 'general')));
                                var service = reqPayload.service_interest || reqPayload.service || reqPayload.service_type || reqPayload.selected_tier || '';

                                var leadParams = {
                                    form_id: formId,
                                    inquiry_type: inqType,
                                    service_interest: service,
                                    lead_source: reqPayload.source_page || reqPayload.form_source || window.location.pathname
                                };

                                // ONLY genuinely collected budget ranges (never substitute service tiers)
                                var budget = reqPayload.budget_range || reqPayload.budget || '';
                                if (budget && budget !== 'diagnostic' && budget !== 'snapshot' && budget !== 'ongoing' && budget !== 'not_specified') {
                                    leadParams.budget_range = budget;
                                }

                                // ONLY genuinely collected timelines (never invent "immediate")
                                var timeline = reqPayload.timeline || '';
                                if (timeline && timeline !== 'immediate' && timeline !== 'not_specified') {
                                    leadParams.timeline = timeline;
                                }

                                CM_Analytics.trackGenerateLead(leadParams);
                            }
                        }).catch(function() {});
                    }
                } catch (_) {}
                return response;
            });
        };
    }

    function getElementLocation(el) {
        var section = el.closest('header, nav, footer, section, [id], [class*="hero"], [class*="proof"], [class*="pricing"], [class*="bridge"]');
        if (!section) return 'body';
        if (section.tagName === 'HEADER' || (section.className && typeof section.className === 'string' && section.className.indexOf('hero') !== -1)) return 'hero';
        if (section.tagName === 'NAV' || (section.className && typeof section.className === 'string' && section.className.indexOf('nav') !== -1)) return 'nav';
        if (section.tagName === 'FOOTER' || (section.className && typeof section.className === 'string' && section.className.indexOf('footer') !== -1)) return 'footer';
        if (section.id) return section.id;
        if (section.className && typeof section.className === 'string') {
            return section.className.split(' ')[0];
        }
        return 'section';
    }

    function initAnalyticsListeners() {
        // Capture and persist outbound campaign attribution across session
        try {
            var urlParams = new URLSearchParams(window.location.search);
            var utmSource = urlParams.get('utm_source');
            var utmCampaign = urlParams.get('utm_campaign');
            var utmMedium = urlParams.get('utm_medium');
            var utmContent = urlParams.get('utm_content');
            var utmTerm = urlParams.get('utm_term');

            if (utmSource || utmCampaign) {
                var attr = {
                    utm_source: cleanString(String(utmSource || '')),
                    utm_medium: cleanString(String(utmMedium || '')),
                    utm_campaign: cleanString(String(utmCampaign || '')),
                    utm_content: cleanString(String(utmContent || '')),
                    utm_term: cleanString(String(utmTerm || '')),
                    referrer: cleanString(String(document.referrer || ''))
                };
                sessionStorage.setItem('cm_attribution', JSON.stringify(attr));
                if (window.CM_Analytics && window.CM_Analytics.trackOutboundLandingView) {
                    window.CM_Analytics.trackOutboundLandingView(attr);
                }
            }
        } catch (_) {}
        // Direct Contact Clicks & Commercial CTAs
        document.addEventListener('click', function(e) {
            var link = e.target.closest('a');
            if (!link || !link.href) return;

            var href = link.href.trim();
            var loc = link.getAttribute('data-cta-location') || getElementLocation(link);

            if (href.indexOf('mailto:') === 0) {
                CM_Analytics.trackContactClick('email', loc);
                return;
            }
            if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp.com') !== -1) {
                CM_Analytics.trackContactClick('whatsapp', loc);
                return;
            }
            if (href.indexOf('tel:') === 0) {
                CM_Analytics.trackContactClick('phone', loc);
                return;
            }

            var isCommercialBtn = link.matches('[class*="btn"], [class*="cta"], [data-cta]');
            var isHighValueDest = (href.indexOf('/contact') !== -1) || (href.indexOf('/signal') !== -1) || (href.indexOf('/website-system-check') !== -1);
            var isNav = link.closest('.nav-links, .nav-dropdown-content, .footer-copy');

            // Skip ordinary navigation text links
            if (isNav && !isCommercialBtn) return;

            if (isCommercialBtn || isHighValueDest) {
                var text = link.getAttribute('data-cta-name') || link.innerText.replace(/[\u2190-\u2193\u2194\u21A9-\u21FF\u27F5-\u27FF\u2900-\u297F]/g, '').trim() || 'CTA';
                if (text && text.length > 2 && text.length < 60) {
                    CM_Analytics.trackCtaClick(text, loc, link.pathname || href);
                }
            }
        }, { capture: true });

        // Meaningful Form Interaction -> intake_started (click, focusin, input, change; NOT page load)
        function handleFormInteraction(e) {
            if (!e || !e.target) return;
            var form = e.target.closest('form');
            if (!form) return;
            if (form.getAttribute('role') === 'search') return;

            var formId = form.id;
            var hiddenId = form.querySelector('input[name="form_id"]');
            if (hiddenId && hiddenId.value) {
                formId = hiddenId.value;
            } else if (form.id === 'intelligent-intake-form') {
                formId = 'contact-wizard';
            } else if (!formId) {
                formId = form.getAttribute('name') || 'lead-form';
            }

            var inquiryType = 'general';
            var hiddenType = form.querySelector('input[name="inquiry_type"]');
            if (hiddenType && hiddenType.value) {
                inquiryType = hiddenType.value;
            } else if (window.location.pathname.indexOf('/contact') !== -1) {
                inquiryType = 'contact';
            } else if (window.location.pathname.indexOf('/signal') !== -1) {
                inquiryType = 'signal';
            } else if (window.location.pathname.indexOf('/website-system-check') !== -1) {
                inquiryType = 'website_system_check';
            }

            CM_Analytics.trackIntakeStarted(formId, inquiryType);
        }

        document.addEventListener('focusin', handleFormInteraction, { capture: true });
        document.addEventListener('click', function(e) {
            var form = e.target.closest('form');
            if (form) {
                handleFormInteraction(e);
            }
        }, { capture: true });
        document.addEventListener('input', handleFormInteraction, { capture: true });
        document.addEventListener('change', handleFormInteraction, { capture: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnalyticsListeners);
    } else {
        initAnalyticsListeners();
    }
})();
