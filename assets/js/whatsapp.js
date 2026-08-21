/**
 * Context & Muse - WhatsApp Business Inquiry Engine
 * Generates contextual prefilled WhatsApp messages by offer type,
 * handles analytics event tracking (whatsapp_click),
 * and manages non-intrusive mobile quick-action contact triggers.
 */

(function () {
    'use strict';

    // Business WhatsApp Phone Number (International format: Country code + Number without +, spaces, or dashes)
    // To configure your number, set window.CONTEXTMUSE_WHATSAPP_NUMBER or data-whatsapp-number on <body>
    const DEFAULT_PHONE = '13468337291X';

    const OFFER_PREFILLS = {
        'launch': "Hi Jayme, I'm interested in a Launch Site. My business is: ",
        'conversion': "Hi Jayme, I'm interested in a Conversion Site. My current website is: ",
        'business_system': "Hi Jayme, I'm interested in a Custom Business System. I need my business to: ",
        'software': "Hi Jayme, I have a custom software/portal project. Here's what I need it to do: ",
        'audit': "Hi Jayme, I'd like a $195 Conversion Audit. My website is: ",
        'funnel': "Hi Jayme, I'm interested in a Funnel Sprint. My current offer is: ",
        'agency': "Hi Jayme, I'm interested in exploring a white-label agency partnership with Context & Muse. Our agency is: ",
        'general': "Hi Jayme, I'm interested in a Context & Muse project. "
    };

    function getPhoneNumber() {
        return window.CONTEXTMUSE_WHATSAPP_NUMBER || 
               (document.body ? document.body.getAttribute('data-whatsapp-number') : null) || 
               DEFAULT_PHONE;
    }

    function buildWhatsAppUrl(offerKey, customText) {
        const phone = getPhoneNumber();
        const text = customText || OFFER_PREFILLS[offerKey] || OFFER_PREFILLS['general'];
        return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text.trim());
    }

    function trackWhatsAppClick(offerKey, location) {
        const eventData = {
            event: 'whatsapp_click',
            offer: offerKey || 'general',
            location: location || 'button',
            page_path: window.location.pathname,
            timestamp: new Date().toISOString()
        };

        // Standard Google Analytics 4 / Google Tag Manager
        if (window.dataLayer && Array.isArray(window.dataLayer)) {
            window.dataLayer.push(eventData);
        }
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'whatsapp_click', {
                'offer': offerKey || 'general',
                'location': location || 'button'
            });
        }
        if (window.plausible) {
            window.plausible('WhatsApp Click', { props: { offer: offerKey, location: location } });
        }

        // Custom DOM Event for developer hooks
        window.dispatchEvent(new CustomEvent('contextmuse:whatsapp_click', { detail: eventData }));
    }

    function initWhatsAppLinks() {
        const elements = document.querySelectorAll('[data-whatsapp-offer], .btn-whatsapp, a[href*="wa.me"]');

        elements.forEach(function (el) {
            const offer = el.getAttribute('data-whatsapp-offer') || 'general';
            const customText = el.getAttribute('data-whatsapp-text');
            const location = el.getAttribute('data-whatsapp-location') || (el.closest('footer') ? 'footer' : 'content');

            const currentHref = el.getAttribute('href') || '';
            if (!currentHref || currentHref === '#' || currentHref.includes('13468337291') || !currentHref.includes('?text=')) {
                el.href = buildWhatsAppUrl(offer, customText);
            }

            el.setAttribute('target', '_blank');
            el.setAttribute('rel', 'noopener noreferrer');

            el.addEventListener('click', function () {
                trackWhatsAppClick(offer, location);
            });
        });
    }

    function initMobileFloatingButton() {
        if (document.querySelector('.whatsapp-mobile-pill') || (document.body && document.body.getAttribute('data-no-whatsapp-pill') === 'true')) {
            return;
        }

        let defaultOffer = 'general';
        const path = window.location.pathname;
        if (path.includes('/quick-launch')) defaultOffer = 'launch';
        else if (path.includes('/systems')) defaultOffer = 'business_system';
        else if (path.includes('/custom')) defaultOffer = 'business_system';
        else if (path.includes('/services')) defaultOffer = 'launch';
        else if (path.includes('/partners')) defaultOffer = 'agency';
        else if (path.includes('/signal')) defaultOffer = 'audit';

        const pill = document.createElement('a');
        pill.className = 'whatsapp-mobile-pill';
        pill.href = buildWhatsAppUrl(defaultOffer);
        pill.target = '_blank';
        pill.rel = 'noopener noreferrer';
        pill.setAttribute('aria-label', 'Message Jayme Volstad on WhatsApp');
        pill.setAttribute('data-whatsapp-offer', defaultOffer);
        pill.setAttribute('data-whatsapp-location', 'mobile_sticky_pill');
        pill.innerHTML = '<span class="whatsapp-pill-dot"></span><svg class="whatsapp-icon-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.50.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.65 4.2 3.71.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.10.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z"/></svg><span class="whatsapp-pill-text">WhatsApp &rarr;</span>';

        pill.addEventListener('click', function () {
            trackWhatsAppClick(defaultOffer, 'mobile_sticky_pill');
        });

        document.body.appendChild(pill);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initWhatsAppLinks();
            initMobileFloatingButton();
        });
    } else {
        initWhatsAppLinks();
        initMobileFloatingButton();
    }

    window.ContextMuseWhatsApp = {
        buildUrl: buildWhatsAppUrl,
        trackClick: trackWhatsAppClick,
        refresh: initWhatsAppLinks
    };
})();