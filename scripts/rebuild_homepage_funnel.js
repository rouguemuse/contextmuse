import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-MVV7WNL42L"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-MVV7WNL42L');
    </script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Context &amp; Muse · Applied Systems, Quote Engines &amp; Custom Software</title>
    <meta name="description" content="Context &amp; Muse finds expensive operational messes and builds custom commercial websites, quoting engines, and internal systems that replace them.">
    <link rel="canonical" href="https://www.contextmuse.com/">
    <link rel="icon" type="image/svg+xml" href="/assets/images/contextmuse_logo.svg">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Context &amp; Muse · Applied Systems &amp; Custom Software">
    <meta property="og:description" content="Context &amp; Muse finds expensive operational messes and builds custom commercial websites, quoting engines, and internal systems that replace them.">
    <meta property="og:url" content="https://www.contextmuse.com/">
    <meta property="og:image" content="https://www.contextmuse.com/og/context-muse-home-v3.jpg">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Context &amp; Muse · Applied Systems &amp; Custom Software">
    <meta name="twitter:description" content="Context &amp; Muse finds expensive operational messes and builds custom commercial websites, quoting engines, and internal systems that replace them.">
    <meta name="twitter:image" content="https://www.contextmuse.com/og/context-muse-home-v3.jpg">

    <!-- JSON-LD Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://www.contextmuse.com/#organization",
          "name": "Context & Muse",
          "url": "https://www.contextmuse.com/",
          "logo": "https://www.contextmuse.com/assets/images/contextmuse_logo.svg",
          "description": "Applied systems studio designing and engineering commercial websites, quoting engines, and bespoke business software.",
          "founder": {
            "@type": "Person",
            "name": "Jayme Volstad",
            "jobTitle": "Systems Architect & Principal Designer",
            "url": "https://www.contextmuse.com/about/"
          }
        },
        {
          "@type": "WebSite",
          "@id": "https://www.contextmuse.com/#website",
          "url": "https://www.contextmuse.com/",
          "name": "Context & Muse",
          "publisher": {
            "@id": "https://www.contextmuse.com/#organization"
          }
        }
      ]
    }
    </script>

    <!-- Fonts & CSS -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css?v=3.0">

    <style>
        :root {
            --space-section: clamp(4.5rem, 7vw, 6.75rem);
            --space-section-compact: clamp(3rem, 5vw, 4.5rem);
        }

        .container {
            max-width: 1220px;
            margin-inline: auto;
            padding-inline: clamp(1.25rem, 3.5vw, 2.5rem);
            width: 100%;
            box-sizing: border-box;
        }

        /* ── HERO OVERHAUL WITH EMBEDDED DIAGNOSTIC ENTRY POINT ── */
        .hero {
            padding: clamp(105px, 14vh, 140px) 0 clamp(40px, 6vh, 60px) 0;
            background: radial-gradient(circle at 80% 30%, #FAF9F3 0%, #F5F3EB 45%, #EFECE2 100%);
            border-bottom: 1px solid var(--border-light);
        }

        .hero-grid-lead {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: clamp(2rem, 4vw, 3.5rem);
            align-items: center;
        }
        @media (max-width: 990px) {
            .hero-grid-lead {
                grid-template-columns: 1fr;
            }
        }

        .hero-eyebrow {
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 700;
            color: var(--accent-teal);
            letter-spacing: 0.14em;
            text-transform: uppercase;
            display: inline-block;
            margin-bottom: 1rem;
        }

        .hero-title {
            font-family: var(--font-serif);
            font-size: clamp(34px, 4.2vw, 54px);
            line-height: 1.1;
            letter-spacing: -0.02em;
            color: #0E1F1B;
            margin: 0 0 1.25rem 0;
            font-weight: 400;
        }

        .hero-subhead {
            font-family: var(--font-sans);
            font-size: clamp(16px, 1.2vw, 18px);
            line-height: 1.65;
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
        }

        /* Embedded Diagnostic Card */
        .hero-diagnostic-card {
            background: #FFFFFF;
            border: 1px solid var(--border-dark);
            border-radius: 10px;
            padding: clamp(1.5rem, 2.5vw, 2rem);
            box-shadow: 0 12px 32px rgba(16, 33, 29, 0.08);
        }

        .hero-diag-badge {
            font-family: var(--font-mono);
            font-size: 10.5px;
            font-weight: 700;
            color: var(--accent-teal);
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: 0.35rem;
            display: block;
        }

        .hero-diag-heading {
            font-family: var(--font-serif);
            font-size: 22px;
            color: var(--text-primary);
            margin: 0 0 0.4rem 0;
            font-weight: 500;
        }

        .hero-diag-desc {
            font-family: var(--font-sans);
            font-size: 13.5px;
            line-height: 1.5;
            color: var(--text-secondary);
            margin-bottom: 1.25rem;
        }

        .hero-diag-form {
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
        }

        .hero-diag-input {
            width: 100%;
            padding: 0.8rem 1rem;
            font-family: var(--font-sans);
            font-size: 14.5px;
            color: var(--text-primary);
            background: #FAF9F5;
            border: 1px solid var(--border-light);
            border-radius: 5px;
            box-sizing: border-box;
            transition: all 0.2s ease;
        }
        .hero-diag-input:focus {
            outline: none;
            border-color: var(--accent-teal);
            background: #FFFFFF;
            box-shadow: 0 0 0 3px rgba(32, 78, 69, 0.12);
        }

        .hero-diag-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            width: 100%;
            padding: 0.95rem 1.5rem;
            background: var(--text-primary);
            color: #FAF9F5;
            font-family: var(--font-mono);
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
        }
        .hero-diag-btn:hover {
            background: var(--accent-teal);
            transform: translateY(-1px);
        }

        .hero-diag-micro {
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--text-muted);
            text-align: center;
            margin-top: 0.4rem;
        }

        /* ── CREDIBILITY STRIP ── */
        .credibility-strip {
            background: #0E1F1B;
            color: #FAF9F5;
            padding: 1.15rem 0;
            border-bottom: 1px solid rgba(250, 249, 245, 0.08);
        }
        .strip-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .strip-label {
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #C5A059;
        }
        .strip-items {
            display: flex;
            align-items: center;
            gap: 1.25rem;
            flex-wrap: wrap;
            font-family: var(--font-sans);
            font-size: 13.5px;
            color: rgba(250, 249, 245, 0.85);
        }
        .strip-dot { color: #C5A059; }

        /* ── SELECTED WORK / PROOF STACK (PROBLEM - SYSTEM - EFFECT) ── */
        .selected-work-section {
            padding: var(--space-section) 0;
            background: #FFFFFF;
            border-bottom: 1px solid var(--border-light);
        }

        .work-stack {
            display: flex;
            flex-direction: column;
            gap: 4.5rem;
            margin-top: 3.5rem;
        }

        .work-item {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: clamp(2rem, 4vw, 3.5rem);
            align-items: center;
            background: #FAF9F5;
            border: 1px solid var(--border-light);
            border-radius: 8px;
            padding: clamp(1.5rem, 3vw, 2.5rem);
        }
        .work-item.reverse {
            grid-template-columns: 0.85fr 1.15fr;
        }
        @media (max-width: 960px) {
            .work-item, .work-item.reverse {
                grid-template-columns: 1fr;
            }
        }

        .work-media img {
            width: 100%;
            height: auto;
            border-radius: 6px;
            border: 1px solid var(--border-light);
            box-shadow: 0 8px 24px rgba(0,0,0,0.06);
            display: block;
        }

        .work-badge {
            font-family: var(--font-mono);
            font-size: 10.5px;
            font-weight: 700;
            color: var(--accent-teal);
            letter-spacing: 0.12em;
            text-transform: uppercase;
            display: block;
            margin-bottom: 0.5rem;
        }

        .work-title {
            font-family: var(--font-serif);
            font-size: clamp(24px, 2.6vw, 34px);
            color: var(--text-primary);
            margin: 0 0 1rem 0;
            font-weight: 400;
            line-height: 1.2;
        }

        .proof-trio-box {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin: 1.25rem 0 1.5rem 0;
        }
        .proof-row {
            display: grid;
            grid-template-columns: 110px 1fr;
            gap: 0.75rem;
            font-size: 13.5px;
            line-height: 1.5;
        }
        @media (max-width: 500px) {
            .proof-row {
                grid-template-columns: 1fr;
                gap: 0.2rem;
            }
        }
        .proof-lbl {
            font-family: var(--font-mono);
            font-size: 10.5px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--text-muted);
        }
        .proof-val {
            color: var(--text-primary);
            font-family: var(--font-sans);
        }

        /* ── COMMERCIAL PRICING LADDER (NO OUTDATED PRICING) ── */
        .ladder-section {
            padding: var(--space-section) 0;
            background: var(--bg-paper);
            border-bottom: 1px solid var(--border-light);
        }

        .ladder-grid-three {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.75rem;
            margin-top: 3.5rem;
        }
        @media (max-width: 960px) {
            .ladder-grid-three {
                grid-template-columns: 1fr;
            }
        }

        .ladder-card {
            background: #FFFFFF;
            border: 1px solid var(--border-light);
            border-radius: 8px;
            padding: 2.25rem 1.75rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 4px 16px rgba(0,0,0,0.02);
            transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .ladder-card.featured {
            border: 2px solid var(--accent-teal);
            position: relative;
        }
        .ladder-card.featured::before {
            content: "FLAGSHIP LEAD SYSTEM";
            position: absolute;
            top: -12px;
            right: 18px;
            background: var(--accent-teal);
            color: #FFFFFF;
            font-family: var(--font-mono);
            font-size: 9.5px;
            font-weight: 700;
            letter-spacing: 0.08em;
            padding: 3px 8px;
            border-radius: 4px;
        }

        .ladder-stage-badge {
            font-family: var(--font-mono);
            font-size: 10.5px;
            font-weight: 700;
            color: var(--accent-teal);
            letter-spacing: 0.1em;
            text-transform: uppercase;
            display: block;
            margin-bottom: 0.5rem;
        }

        .ladder-title {
            font-family: var(--font-serif);
            font-size: 1.55rem;
            color: var(--text-primary);
            margin: 0 0 0.35rem 0;
            font-weight: 400;
            line-height: 1.2;
        }

        .ladder-price {
            font-family: var(--font-mono);
            font-size: 1.35rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.2rem;
            display: block;
        }

        .ladder-price-sub {
            font-family: var(--font-sans);
            font-size: 12.5px;
            color: var(--text-secondary);
            margin-bottom: 1.15rem;
            display: block;
        }

        .ladder-result {
            font-family: var(--font-sans);
            font-size: 14px;
            line-height: 1.5;
            color: var(--text-primary);
            font-weight: 500;
            margin-bottom: 1.15rem;
        }

        .ladder-meta-box {
            background: rgba(16, 33, 29, 0.03);
            border-left: 2.5px solid var(--accent-teal);
            padding: 0.65rem 0.85rem;
            border-radius: 0 4px 4px 0;
            margin-bottom: 1.25rem;
        }
        .ladder-meta-label {
            font-family: var(--font-mono);
            font-size: 9.5px;
            font-weight: 700;
            color: var(--accent-teal);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            display: block;
            margin-bottom: 0.2rem;
        }
        .ladder-meta-text {
            font-size: 12px;
            color: var(--text-secondary);
            margin: 0;
            line-height: 1.4;
        }

        .ladder-scope-box {
            border-top: 1px solid var(--border-light);
            padding-top: 1.1rem;
            margin-bottom: 1.75rem;
            flex-grow: 1;
        }
        .ladder-scope-title {
            font-family: var(--font-mono);
            font-size: 9.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--text-primary);
            margin-bottom: 0.65rem;
            display: block;
        }
        .ladder-scope-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .ladder-scope-list li {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.4;
            display: flex;
            align-items: flex-start;
            gap: 7px;
        }
        .ladder-scope-list li::before {
            content: "•";
            color: var(--accent-teal);
            font-weight: bold;
            font-size: 13px;
            line-height: 1.2;
        }

        .btn-ladder-cta {
            background: var(--text-primary);
            color: #FAF9F5 !important;
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 0.85rem 1.2rem;
            border-radius: 4px;
            text-decoration: none;
            text-align: center;
            display: block;
            transition: all 0.2s ease;
            margin-top: auto;
            border: 1px solid var(--text-primary);
        }
        .ladder-card.featured .btn-ladder-cta {
            background: var(--accent-teal);
            border-color: var(--accent-teal);
        }
        .btn-ladder-cta:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }

        /* ── TWO-PATH FINAL CTA SECTION ── */
        .two-path-section {
            padding: var(--space-section) 0;
            background: #FFFFFF;
            border-bottom: 1px solid var(--border-light);
        }
        .two-path-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
            margin-top: 2.5rem;
        }
        @media (max-width: 880px) {
            .two-path-grid {
                grid-template-columns: 1fr;
            }
        }

        .path-card {
            background: var(--bg-paper);
            border: 1px solid var(--border-light);
            border-radius: 8px;
            padding: 2.5rem 2rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .path-card.active-build {
            border: 2px solid var(--forest-deep);
            background: #FFFFFF;
        }
    </style>
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Navbar -->
    <nav class="site-nav" aria-label="Main Navigation">
        <div class="container nav-container">
            <a href="/" class="logo">
                <img class="brand-mark" src="/assets/images/contextmuse_logo.svg" alt="" aria-hidden="true" style="width:22px;height:22px;">
                <span>Context &amp; Muse</span>
            </a>
            <button class="nav-toggle" id="nav-toggle-btn" aria-label="Toggle Menu" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div class="nav-links" id="primary-nav-links">
                <details class="nav-dropdown" name="nav-dropdowns">
                    <summary class="nav-link">Work <span class="nav-dropdown-arrow">▾</span></summary>
                    <div class="nav-dropdown-content">
                        <a href="/work/" class="nav-dropdown-link">Case Study Library</a>
                        <a href="/work/lone-wolf-dumpsters/" class="nav-dropdown-link">Lone Wolf Dumpsters</a>
                        <a href="/systems/client-builds/#inncontrol" class="nav-dropdown-link">INNcontrol Coils</a>
                        <a href="/work/website-audit-system/" class="nav-dropdown-link">Website Audit System</a>
                        <a href="/case-studies/edr-party-rentals/" class="nav-dropdown-link">EDR Party Rentals</a>
                        <a href="/work/revision-atlas/" class="nav-dropdown-link">Revision Atlas</a>
                        <a href="/work/client-opportunity-engine/" class="nav-dropdown-link">Client Opportunity Engine</a>
                    </div>
                </details>
                <details class="nav-dropdown" name="nav-dropdowns">
                    <summary class="nav-link">Services <span class="nav-dropdown-arrow">▾</span></summary>
                    <div class="nav-dropdown-content">
                        <a href="/services/" class="nav-dropdown-link">Ways to Work Together</a>
                        <a href="/services/quote-lead-systems/" class="nav-dropdown-link">Quote + Lead Systems</a>
                        <a href="/website-system-check/" class="nav-dropdown-link">Free Website + System Check</a>
                        <a href="/systems/" class="nav-dropdown-link">Custom Operations Systems</a>
                        <a href="/restaurant-systems/" class="nav-dropdown-link">Restaurant Systems</a>
                        <a href="/partners/" class="nav-dropdown-link">Agency Partners</a>
                    </div>
                </details>
                <details class="nav-dropdown" name="nav-dropdowns">
                    <summary class="nav-link">Products <span class="nav-dropdown-arrow">▾</span></summary>
                    <div class="nav-dropdown-content">
                        <a href="/signal/" class="nav-dropdown-link">Signal</a>
                        <a href="/gensort/" class="nav-dropdown-link">GenSort</a>
                        <a href="https://www.mapswithteeth.org/" target="_blank" rel="noopener" class="nav-dropdown-link">Maps With Teeth ↗</a>
                    </div>
                </details>
                <a href="/creative/" class="nav-link">Creative</a>
                <a href="/about/" class="nav-link">About</a>
                <a href="/contact/" class="nav-cta btn-magnetic">Start a Project</a>
            </div>
        </div>
    </nav>

    <main id="main-content">
        <!-- ==========================================================================
             SECTION 1: HERO OVERHAUL WITH EMBEDDED FREE DIAGNOSTIC
             ========================================================================== -->
        <header class="hero" id="hero">
            <div class="container">
                <div class="hero-grid-lead">
                    <!-- Left: Strategic Positioning Copy -->
                    <div class="hero-copy reveal-on-scroll">
                        <span class="hero-eyebrow">Applied Systems Studio · Transparent Scope</span>
                        <h1 class="hero-title">
                            Systems built around the way your business actually works.
                        </h1>
                        <p class="hero-subhead">
                            Context &amp; Muse finds expensive operational messes and builds custom commercial websites, quoting calculators, and internal systems that replace them.
                        </p>
                        <p style="font-family: var(--font-sans); font-size: 14.5px; color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">
                            Strategy, interface design, bespoke front-end engineering, territory routing logic, and workflow automation—delivered as one coherent system without bloated subscription stacks.
                        </p>
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <a href="#selected-work" class="btn btn-secondary" style="font-size: 13px;">View Client Builds ↓</a>
                            <a href="/services/" class="btn-secondary" style="font-size: 13px; padding: 0.8rem 1.4rem; text-decoration: none; border-radius: 4px; display: inline-block;">Explore Service Tiers &rarr;</a>
                        </div>
                    </div>

                    <!-- Right: Embedded Free Diagnostic Entry Point Card -->
                    <div class="hero-diagnostic-card reveal-on-scroll" data-delay="1" id="free-check">
                        <span class="hero-diag-badge">Instant Inbound Diagnostic</span>
                        <h2 class="hero-diag-heading">Free Website + System Check</h2>
                        <p class="hero-diag-desc">
                            Find the friction hiding in your website and customer flow. Enter your URL for a fast, evidence-based review of messaging, conversion leaks, and intake bottlenecks.
                        </p>

                        <form class="hero-diag-form" id="hero-diagnostic-form" action="/website-system-check/" method="GET">
                            <div>
                                <label for="hp-target-url" style="display: none;">Website Address</label>
                                <input type="url" id="hp-target-url" name="url" class="hero-diag-input" placeholder="https://yourbusiness.com" required autocomplete="url">
                            </div>
                            <div>
                                <label for="hp-biz-type" style="display: none;">Business Type</label>
                                <input type="text" id="hp-biz-type" name="businessType" class="hero-diag-input" placeholder="Business type (e.g. Commercial HVAC, Dumpster Rental)">
                            </div>
                            <button type="submit" id="hero-diag-submit-btn" class="hero-diag-btn">
                                <span>Run Free Check</span>
                                <span aria-hidden="true">&rarr;</span>
                            </button>
                            <div class="hero-diag-micro">
                                No email required for your results · Non-invasive evidence analysis
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </header>

        <!-- ==========================================================================
             SECTION 2: PROOF / CREDIBILITY STRIP
             ========================================================================== -->
        <section class="credibility-strip" aria-label="Core Capabilities">
            <div class="container strip-inner">
                <span class="strip-label">Production proof</span>
                <div class="strip-items">
                    <span>Quoting &amp; Sizing Engines</span>
                    <span class="strip-dot">&bull;</span>
                    <span>Territory &amp; Radius Routing</span>
                    <span class="strip-dot">&bull;</span>
                    <span>Floorplan Equipment Mappers</span>
                    <span class="strip-dot">&bull;</span>
                    <span>Parametric Cost Ledgers</span>
                    <span class="strip-dot">&bull;</span>
                    <span>Zero-Plugin Bespoke Code</span>
                </div>
            </div>
        </section>

        <!-- ==========================================================================
             SECTION 3: SELECTED WORK (ORDERED BY OPERATIONAL PROOF)
             ========================================================================== -->
        <section class="selected-work-section" id="selected-work" aria-labelledby="selected-work-heading">
            <div class="container">
                <div class="section-header reveal-on-scroll" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <span class="section-eyebrow">SELECTED PRODUCTION PROOF</span>
                        <h2 id="selected-work-heading" class="section-title">Built for real business constraints.</h2>
                        <p class="section-desc">Commercial websites, internal scoping tools, and customer intake engines engineered to solve specific operational bottlenecks.</p>
                    </div>
                    <a href="/work/" style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-primary); text-decoration: none; border-bottom: 1.5px solid var(--text-primary); padding-bottom: 2px;">Explore All Case Studies &rarr;</a>
                </div>

                <div class="work-stack">
                    <!-- Proof 1: Lone Wolf Dumpsters -->
                    <div class="work-item reveal-on-scroll" id="proof-lonewolf">
                        <div class="work-media">
                            <img src="/assets/images/lonewolf-commercial-spread.webp" alt="Lone Wolf Dumpsters commercial quoting and service area routing platform" width="1400" height="875" loading="lazy">
                        </div>
                        <div class="work-info">
                            <span class="work-badge">01 // Quote + Lead System &bull; Multi-Market Logistics</span>
                            <h3 class="work-title">Lone Wolf Dumpsters</h3>
                            <div class="proof-trio-box">
                                <div class="proof-row">
                                    <span class="proof-lbl">Problem:</span>
                                    <span class="proof-val">Prospects across 48 North Texas markets couldn't verify coverage or container sizing, generating 40+ manual dispatch callbacks per week.</span>
                                </div>
                                <div class="proof-row">
                                    <span class="proof-lbl">System:</span>
                                    <span class="proof-val">Interactive volume calculator, real-time county territory qualification, and structured CRM lead routing with zero plugin bloat.</span>
                                </div>
                                <div class="proof-row">
                                    <span class="proof-lbl">Business Effect:</span>
                                    <span class="proof-val" style="color: var(--accent-teal); font-weight: 600;">Eliminated manual phone qualification, pre-qualifying leads with exact container size, drop-off date, and market radius.</span>
                                </div>
                            </div>
                            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                <a href="/services/quote-lead-systems/" class="btn btn-secondary" style="font-size: 12.5px;">Quote + Lead Architecture &rarr;</a>
                                <a href="/work/lone-wolf-dumpsters/" class="btn-secondary" style="font-size: 12.5px; padding: 0.6rem 1.1rem; text-decoration: none; display: inline-block;">Case Study</a>
                            </div>
                        </div>
                    </div>

                    <!-- Proof 2: INNcontrol Coils (Authentic Operational Tool) -->
                    <div class="work-item reverse reveal-on-scroll" id="proof-inncontrol">
                        <div class="work-info">
                            <span class="work-badge">02 // Custom Operations System &bull; Field Scoping &amp; Estimator</span>
                            <h3 class="work-title">INNcontrol Coils</h3>
                            <div class="proof-trio-box">
                                <div class="proof-row">
                                    <span class="proof-lbl">Problem:</span>
                                    <span class="proof-val">Technicians surveyed 500-room hotel HVAC systems using paper clipboards and loose phone photos, taking 5 days to assemble complex restoration bids.</span>
                                </div>
                                <div class="proof-row">
                                    <span class="proof-lbl">System:</span>
                                    <span class="proof-val">Tablet-first 2D floorplan equipment mapper, unit-level condition severity tagging, photo association, and parametric labor calculation engine.</span>
                                </div>
                                <div class="proof-row">
                                    <span class="proof-lbl">Business Effect:</span>
                                    <span class="proof-val" style="color: var(--accent-teal); font-weight: 600;">Cut bid compilation from 5 days to 20 minutes on site and produced unassailable client verification ledgers for hotel general managers.</span>
                                </div>
                            </div>
                            <div>
                                <a href="/systems/client-builds/#inncontrol" class="btn btn-secondary" style="font-size: 12.5px;">View Deep-Dive Architecture &rarr;</a>
                            </div>
                        </div>
                        <div class="work-media">
                            <img src="/assets/images/inncontrol-screenshot.webp" alt="INNcontrol operational floorplan equipment mapper and parametric estimation workbench" width="1440" height="900" loading="lazy">
                        </div>
                    </div>

                    <!-- Proof 3: Website Audit System -->
                    <div class="work-item reveal-on-scroll" id="proof-audit">
                        <div class="work-media">
                            <img src="/assets/images/website-audit-hero.webp" alt="Website Audit System visual diagnostics pipeline and DOM evidence drawer" width="1200" height="750" loading="lazy">
                        </div>
                        <div class="work-info">
                            <span class="work-badge">03 // Diagnostics &amp; Developer Tooling</span>
                            <h3 class="work-title">Website Audit System</h3>
                            <div class="proof-trio-box">
                                <div class="proof-row">
                                    <span class="proof-lbl">Problem:</span>
                                    <span class="proof-val">Traditional agency audit PDFs deliver vague automated scores and generic bullet points that developers and founders struggle to implement.</span>
                                </div>
                                <div class="proof-row">
                                    <span class="proof-lbl">System:</span>
                                    <span class="proof-val">Multi-viewport rendering engine with coordinate-relative DOM pinning and an interactive Evidence Drawer with deterministic remediation code.</span>
                                </div>
                                <div class="proof-row">
                                    <span class="proof-lbl">Business Effect:</span>
                                    <span class="proof-val" style="color: var(--accent-teal); font-weight: 600;">Replaced subjective feedback with visual proof, speeding alignment between non-technical stakeholders and engineering teams.</span>
                                </div>
                            </div>
                            <div>
                                <a href="/work/website-audit-system/" class="btn btn-secondary" style="font-size: 12.5px;">View Audit Case Study &rarr;</a>
                            </div>
                        </div>
                    </div>

                    <!-- Proof 4: EDR Party Rentals -->
                    <div class="work-item reverse reveal-on-scroll" id="proof-edr">
                        <div class="work-info">
                            <span class="work-badge">04 // Inventory-Aware Booking &bull; Logistics System</span>
                            <h3 class="work-title">EDR Party Rentals</h3>
                            <div class="proof-trio-box">
                                <div class="proof-row">
                                    <span class="proof-lbl">Problem:</span>
                                    <span class="proof-val">Event inventory suffered double-booking risks and orders outside delivery boundaries required time-consuming manual cancellations.</span>
                                </div>
                                <div class="proof-row">
                                    <span class="proof-lbl">System:</span>
                                    <span class="proof-val">Bilingual reservation platform with serial-item calendar lockouts, automated delivery tier qualification, and warehouse pack sheets.</span>
                                </div>
                                <div class="proof-row">
                                    <span class="proof-lbl">Business Effect:</span>
                                    <span class="proof-val" style="color: var(--accent-teal); font-weight: 600;">Eliminated booking conflicts, automated delivery radius enforcement, and streamlined warehouse prep without human triage.</span>
                                </div>
                            </div>
                            <div>
                                <a href="/case-studies/edr-party-rentals/" class="btn btn-secondary" style="font-size: 12.5px;">View EDR Case Study &rarr;</a>
                            </div>
                        </div>
                        <div class="work-media">
                            <img src="/assets/images/edrpartyrentals-screenshot.webp" alt="EDR Party Rentals bilingual inventory and reservation system" width="1200" height="750" loading="lazy">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ==========================================================================
             SECTION 4: COMMERCIAL PRICING LADDER (CANONICAL 3 OFFERS)
             ========================================================================== -->
        <section class="ladder-section" id="ways-to-work" aria-labelledby="ladder-heading">
            <div class="container">
                <div class="section-header reveal-on-scroll" style="text-align: center; max-width: 800px; margin: 0 auto;">
                    <span class="section-eyebrow">COMMERCIAL ENGAGEMENT TIERS</span>
                    <h2 id="ladder-heading" class="section-title">Clear scope. Predictable investment.</h2>
                    <p class="section-desc">
                        Three fixed-scope engagement tiers designed around the exact operational friction in your business. No hidden fees, no vague retainers.
                    </p>
                    <p style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-teal); margin-top: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;">
                        A deposit is required to reserve production capacity. Once work begins, the deposit is non-refundable and is applied toward the project total.
                    </p>
                </div>

                <!-- 3 Canonical Offers Grid -->
                <div class="ladder-grid-three">
                    
                    <!-- Offer 1: Business System Diagnostic -->
                    <div class="ladder-card reveal-on-scroll" data-delay="1" id="diagnostic">
                        <div>
                            <span class="ladder-stage-badge">01 // DIAGNOSE</span>
                            <h3 class="ladder-title">Business System Diagnostic</h3>
                            <span class="ladder-price">$395</span>
                            <span class="ladder-price-sub">Fixed Rate Diagnostic Review</span>
                            
                            <div class="ladder-result">
                                Low-friction review of your existing website, quote flow, and operational bottlenecks before committing to a full build.
                            </div>

                            <div class="ladder-meta-box">
                                <span class="ladder-meta-label">Positioning &amp; Credit</span>
                                <p class="ladder-meta-text"><strong>100% credited</strong> toward a qualifying build booked within 30 days. Paid in full to initiate review.</p>
                            </div>

                            <div class="ladder-scope-box">
                                <span class="ladder-scope-title">What Is Evaluated</span>
                                <ul class="ladder-scope-list">
                                    <li>Calls to action &amp; lead qualification drop-offs</li>
                                    <li>Mobile touch UX &amp; customer friction points</li>
                                    <li>Spreadsheet &amp; manual double-entry bottlenecks</li>
                                    <li>Pricing clarity &amp; territory qualification rules</li>
                                    <li>Prioritized findings &amp; recommended architecture</li>
                                </ul>
                            </div>
                        </div>
                        <a href="/contact/?service=diagnostic" class="btn-ladder-cta" id="cta-diag-395">Book a $395 Diagnostic &rarr;</a>
                    </div>

                    <!-- Offer 2: Quote + Lead System (Featured) -->
                    <div class="ladder-card featured reveal-on-scroll" data-delay="2" id="quote-lead">
                        <div>
                            <span class="ladder-stage-badge">02 // CONVERT &amp; ROUTE</span>
                            <h3 class="ladder-title">Quote + Lead System</h3>
                            <span class="ladder-price">From $2,500</span>
                            <span class="ladder-price-sub">Multi-Market Typically $4,500+</span>
                            
                            <div class="ladder-result">
                                Commercial website and intake engine with upfront dynamic pricing, territory/radius validation, and structured lead dispatch.
                            </div>

                            <div class="ladder-meta-box">
                                <span class="ladder-meta-label">Billing Schedule</span>
                                <p class="ladder-meta-text"><strong>50% deposit</strong> to reserve &amp; start &bull; <strong>50% final balance</strong> upon staging approval before launch.</p>
                            </div>

                            <div class="ladder-scope-box">
                                <span class="ladder-scope-title">Included Scope</span>
                                <ul class="ladder-scope-list">
                                    <li>Dynamic quoting &amp; pricing calculators</li>
                                    <li>Multi-market local SEO &amp; radius qualification</li>
                                    <li>Automated triage &amp; structured CRM dispatch</li>
                                    <li>High-contrast brand aesthetic &amp; conversion copy</li>
                                    <li>100% bespoke code with zero plugin bloat</li>
                                </ul>
                            </div>
                        </div>
                        <a href="/services/quote-lead-systems/" class="btn-ladder-cta" id="cta-quote-lead">Discuss a Quote &amp; Lead System &rarr;</a>
                    </div>

                    <!-- Offer 3: Custom Operations System -->
                    <div class="ladder-card reveal-on-scroll" data-delay="3" id="custom-system">
                        <div>
                            <span class="ladder-stage-badge">03 // OPERATIONALIZE</span>
                            <h3 class="ladder-title">Custom Operations System</h3>
                            <span class="ladder-price">From $3,500</span>
                            <span class="ladder-price-sub">Complex Systems Custom Quoted</span>
                            
                            <div class="ladder-result">
                                Bespoke internal tools, floorplan mappers, estimation engines, and client portals replacing manual spreadsheet workflows.
                            </div>

                            <div class="ladder-meta-box">
                                <span class="ladder-meta-label">Billing Schedule</span>
                                <p class="ladder-meta-text">Milestone-based: <strong>40% deposit</strong> &bull; <strong>30% functional prototype</strong> &bull; <strong>30% deployment</strong>.</p>
                            </div>

                            <div class="ladder-scope-box">
                                <span class="ladder-scope-title">Included Scope</span>
                                <ul class="ladder-scope-list">
                                    <li>Interactive 2D floorplan &amp; equipment mappers</li>
                                    <li>Parametric estimation &amp; ledger calculators</li>
                                    <li>B2B client portals &amp; administrative dashboards</li>
                                    <li>Custom logic, databases &amp; webhook integrations</li>
                                    <li>Complete data ownership with zero recurring seats</li>
                                </ul>
                            </div>
                        </div>
                        <a href="/custom/?service=custom-system#intake" class="btn-ladder-cta" id="cta-ops-system">Discuss an Operations System &rarr;</a>
                    </div>
                </div>

                <!-- Quarterly Continued Care Strip -->
                <div style="margin-top: 3.5rem; background: #FFFFFF; border: 1px solid var(--border-light); border-radius: 8px; padding: 1.75rem 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
                    <div>
                        <span style="font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; color: var(--accent-teal); text-transform: uppercase; letter-spacing: 0.12em; display: block; margin-bottom: 0.25rem;">Optional Post-Launch</span>
                        <h4 style="font-family: var(--font-serif); font-size: 20px; color: var(--text-primary); margin: 0 0 0.25rem 0; font-weight: 500;">Quarterly Continued Care Plans</h4>
                        <p style="font-family: var(--font-sans); font-size: 14px; color: var(--text-secondary); margin: 0;">
                            Essential Care ($375/qtr = ~$125/mo equivalent) &bull; Growth Care ($600/qtr = ~$200/mo equivalent). No lock-in contracts.
                        </p>
                    </div>
                    <a href="/services/#care" style="font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; text-transform: uppercase; color: var(--text-primary); text-decoration: none; border-bottom: 1.5px solid var(--text-primary); padding-bottom: 2px;">
                        View Care Details &rarr;
                    </a>
                </div>
            </div>
        </section>

        <!-- ==========================================================================
             SECTION 5: TWO-PATH FINAL CTA & INTAKE
             ========================================================================== -->
        <section class="two-path-section" id="contact" aria-labelledby="contact-heading">
            <div class="container">
                <div class="section-header reveal-on-scroll" style="text-align: center; max-width: 760px; margin: 0 auto;">
                    <span class="section-eyebrow">CLEAR NEXT STEPS</span>
                    <h2 id="contact-heading" class="section-title">Two ways to begin. Zero sales pressure.</h2>
                    <p class="section-desc">Choose the path that fits where your business is right now.</p>
                </div>

                <div class="two-path-grid reveal-on-scroll">
                    <!-- Path A: Not Sure What You Need? -->
                    <div class="path-card">
                        <div>
                            <span class="work-badge">PATH 01 // UNCERTAIN WHERE TO START?</span>
                            <h3 style="font-family: var(--font-serif); font-size: 24px; color: var(--text-primary); margin: 0 0 0.75rem 0; font-weight: 500;">
                                Run the Free Website + System Check
                            </h3>
                            <p style="font-family: var(--font-sans); font-size: 14.5px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
                                Get an instant, evidence-based diagnostic evaluating your messaging clarity, CTA visibility, customer friction points, and intake opportunities in seconds.
                            </p>
                            <ul style="font-family: var(--font-sans); font-size: 13.5px; color: var(--text-secondary); line-height: 1.5; padding-left: 1.25rem; margin-bottom: 2rem;">
                                <li>No email required to view findings</li>
                                <li>Reveals visible drop-offs in your quote flow</li>
                                <li>Directly grounded in captured page evidence</li>
                            </ul>
                        </div>
                        <a href="/website-system-check/" class="btn btn-secondary" style="width: 100%; text-align: center; box-sizing: border-box;">
                            Run Free Website Check &rarr;
                        </a>
                    </div>

                    <!-- Path B: Ready to Build? -->
                    <div class="path-card active-build">
                        <div>
                            <span class="work-badge" style="color: var(--forest-deep);">PATH 02 // READY TO BUILD?</span>
                            <h3 style="font-family: var(--font-serif); font-size: 24px; color: var(--forest-deep); margin: 0 0 0.75rem 0; font-weight: 500;">
                                Tell Me What’s Not Working
                            </h3>
                            <p style="font-family: var(--font-sans); font-size: 14.5px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
                                Bring your website, messy spreadsheet workflow, or quote bottleneck. Jayme personally reviews your context without discovery calls or pitch decks.
                            </p>

                            <form id="hp-inquiry-form" action="https://formspree.io/f/xoqydgvw" method="POST" style="display: flex; flex-direction: column; gap: 0.95rem;">
                                <input type="hidden" name="form_source" value="homepage_direct_inquiry">
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                                    <input type="text" name="name" required placeholder="Your Name *" class="hero-diag-input">
                                    <input type="email" name="email" required placeholder="Your Email *" class="hero-diag-input">
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                                    <input type="text" name="business" placeholder="Business Name" class="hero-diag-input">
                                    <input type="url" name="website" placeholder="Website (https://...)" class="hero-diag-input">
                                </div>
                                <textarea name="what_is_not_working" required rows="3" placeholder="What is not working in your customer flow or business right now? *" class="hero-diag-input" style="resize: vertical;"></textarea>
                                <textarea name="what_you_wish_happened" rows="2" placeholder="What do you wish happened instead?" class="hero-diag-input" style="resize: vertical;"></textarea>
                                
                                <select name="budget_tier" class="hero-diag-input">
                                    <option value="">Select an engagement tier</option>
                                    <option value="$395-diagnostic">Business System Diagnostic ($395 fixed)</option>
                                    <option value="$2500-quote-lead">Quote + Lead System ($2,500 - $4,500)</option>
                                    <option value="$3500-custom-system">Custom Operations System ($3,500+)</option>
                                    <option value="custom">Complex Software / Custom Scope</option>
                                </select>

                                <button type="submit" id="hp-inquiry-btn" class="hero-diag-btn" style="background: var(--forest-deep); margin-top: 0.25rem;">
                                    <span>Send Project Inquiry &rarr;</span>
                                </button>
                            </form>
                            <div id="hp-inquiry-success" style="display: none; padding: 1rem; background: #FAF9F3; border: 1px solid var(--accent-teal); border-radius: 6px; margin-top: 1rem; text-align: center; font-size: 13.5px; color: var(--forest-deep);">
                                <strong>Inquiry Received.</strong> Jayme will review your submission and reply directly with recommended scope within 1 business day.
                            </div>
                        </div>

                        <!-- What Happens Next Reassurance -->
                        <div style="border-top: 1px solid var(--border-light); padding-top: 1rem; margin-top: 1.25rem;">
                            <span style="font-family: var(--font-mono); font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">What Happens Next:</span>
                            <ol style="font-family: var(--font-sans); font-size: 12px; color: var(--text-secondary); line-height: 1.5; padding-left: 1.1rem; margin: 0;">
                                <li>Jayme reviews your website and operational context.</li>
                                <li>If the problem is clear, you receive a recommended scope.</li>
                                <li>If investigation is needed, we start with the $395 Diagnostic (100% credited).</li>
                                <li>No sales call required unless you want one.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- ── FOOTER ── -->
    <footer class="site-footer" style="margin-top: 0;">
        <div class="container footer-container">
            <div class="footer-brand">
                <div class="logo">
                    <img class="brand-mark" src="/assets/images/contextmuse_logo.svg" alt="" aria-hidden="true" style="width:20px;height:20px;">
                    <span>Context &amp; Muse</span>
                </div>
                <p class="footer-tagline">Applied systems studio. Finding expensive operational messes and building the digital systems that replace them.</p>
                <div class="footer-copyright">&copy; 2026 Context &amp; Muse. All rights reserved.</div>
            </div>
            <div class="footer-links-grid">
                <div class="footer-col">
                    <div class="footer-col-title">Services</div>
                    <a href="/services/quote-lead-systems/" class="footer-link">Quote + Lead Systems</a>
                    <a href="/website-system-check/" class="footer-link">Website + System Check</a>
                    <a href="/custom/?service=diagnostic#intake" class="footer-link">Business System Diagnostic</a>
                    <a href="/systems/" class="footer-link">Custom Operations Systems</a>
                    <a href="/restaurant-systems/" class="footer-link">Restaurant Systems</a>
                </div>
                <div class="footer-col">
                    <div class="footer-col-title">Selected Work</div>
                    <a href="/work/lone-wolf-dumpsters/" class="footer-link">Lone Wolf Dumpsters</a>
                    <a href="/systems/client-builds/#inncontrol" class="footer-link">INNcontrol Coils</a>
                    <a href="/work/website-audit-system/" class="footer-link">Website Audit System</a>
                    <a href="/case-studies/edr-party-rentals/" class="footer-link">EDR Party Rentals</a>
                    <a href="/work/revision-atlas/" class="footer-link">Revision Atlas</a>
                </div>
                <div class="footer-col">
                    <div class="footer-col-title">Studio</div>
                    <a href="/about/" class="footer-link">About Jayme</a>
                    <a href="/contact/" class="footer-link">Contact &amp; Intake</a>
                    <a href="/privacy/" class="footer-link">Privacy Policy</a>
                    <a href="/terms/" class="footer-link">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Client-Side Analytics & Interaction Scripts -->
    <script>
    (function() {
        // Analytics Dispatcher
        function trackEvent(eventName, params = {}) {
            if (typeof window.gtag === 'function') {
                window.gtag('event', eventName, params);
            }
        }

        // Mobile Nav Toggle
        const navToggle = document.getElementById('nav-toggle-btn');
        const navLinks = document.getElementById('primary-nav-links');
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                const isOpen = navLinks.classList.toggle('nav-open');
                navToggle.setAttribute('aria-expanded', isOpen);
            });
        }

        // Track Hero Diagnostic Start
        const heroForm = document.getElementById('hero-diagnostic-form');
        if (heroForm) {
            heroForm.addEventListener('submit', function(e) {
                const urlInput = document.getElementById('hp-target-url');
                if (urlInput && urlInput.value) {
                    let domainOnly = '';
                    try { domainOnly = new URL(urlInput.value).hostname; } catch(_) { domainOnly = 'url_entered'; }
                    trackEvent('homepage_free_check_start', { target_domain: domainOnly });
                }
            });
        }

        // Track Offer Clicks
        const ctaDiag = document.getElementById('cta-diag-395');
        if (ctaDiag) ctaDiag.addEventListener('click', () => trackEvent('paid_diagnostic_click'));
        const ctaQuote = document.getElementById('cta-quote-lead');
        if (ctaQuote) ctaQuote.addEventListener('click', () => trackEvent('quote_lead_system_click'));
        const ctaOps = document.getElementById('cta-ops-system');
        if (ctaOps) ctaOps.addEventListener('click', () => trackEvent('operations_system_click'));

        // Direct Inquiry Form Handler
        const inqForm = document.getElementById('hp-inquiry-form');
        const inqSuccess = document.getElementById('hp-inquiry-success');
        const inqBtn = document.getElementById('hp-inquiry-btn');
        if (inqForm) {
            inqForm.addEventListener('focusin', function() {
                trackEvent('project_inquiry_start');
            }, { once: true });

            inqForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                if (inqBtn) {
                    inqBtn.disabled = true;
                    inqBtn.innerHTML = '<span>Sending Inquiry...</span>';
                }

                try {
                    const formData = new FormData(inqForm);
                    const resp = await fetch(inqForm.action, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (resp.ok) {
                        trackEvent('project_inquiry_submit');
                        inqForm.reset();
                        inqForm.style.display = 'none';
                        if (inqSuccess) inqSuccess.style.display = 'block';
                    } else {
                        inqForm.submit();
                    }
                } catch(err) {
                    inqForm.submit();
                }
            });
        }

        // Scroll Reveal Observer
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -30px 0px', threshold: 0.1 });

            document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
        } else {
            document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
        }
    })();
    </script>
</body>
</html>`;

fs.writeFileSync(path.join(projectRoot, 'index.html'), indexHtml, 'utf8');
console.log('Successfully rebuilt index.html with new inbound funnel, verified INNcontrol operational screenshot, and canonical offers.');
