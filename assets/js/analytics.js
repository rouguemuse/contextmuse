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
        if (trimmed.includes('@') || EMAIL_REGEX.test(trimmed) || PHONE_REGEX.test(trimmed) || trimmed.startsWith('lead_')) {
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
         */
        trackGenerateLead: function(rawParams) {
            if (!rawParams || typeof rawParams !== 'object') return;

            var cleanParams = {};
            var keys = Object.keys(rawParams);
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                if (ALLOWED_LEAD_KEYS.has(k)) {
                    var val = cleanString(String(rawParams[k] || ''));
                    if (val) {
                        cleanParams[k] = val;
                    }
                }
            }

            // Must have at least a form_id to track
            if (!cleanParams.form_id) {
                cleanParams.form_id = 'lead-form';
            }

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
                            if (data && (data.success === true || data.ok === true) && data.submission_id) {
                                var reqPayload = {};
                                try {
                                    if (options && options.body && typeof options.body === 'string') {
                                        reqPayload = JSON.parse(options.body);
                                    }
                                } catch (_) {}

                                var formId = reqPayload.form_id || (window.location.pathname.indexOf('/contact') !== -1 ? 'contact-wizard' : 'lead-form');
                                var inqType = reqPayload.inquiry_type || (window.location.pathname.indexOf('/contact') !== -1 ? 'contact' : (window.location.pathname.indexOf('/signal') !== -1 ? 'signal' : (window.location.pathname.indexOf('/website-system-check') !== -1 ? 'website_system_check' : 'general')));
                                var service = reqPayload.service_interest || reqPayload.service || reqPayload.service_type || reqPayload.selected_tier || '';
                                var budget = reqPayload.budget_range || reqPayload.budget || reqPayload.selected_tier || '';
                                var timeline = reqPayload.timeline || '';
                                var source = reqPayload.source_page || reqPayload.form_source || window.location.pathname;

                                CM_Analytics.trackGenerateLead({
                                    form_id: formId,
                                    inquiry_type: inqType,
                                    service_interest: service,
                                    budget_range: budget,
                                    timeline: timeline,
                                    lead_source: source
                                });
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
                var text = link.getAttribute('data-cta-name') || link.innerText.replace(/[←-↓↔↩-⇿⟵-⟿⤀-⥿]/g, '').trim() || 'CTA';
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
