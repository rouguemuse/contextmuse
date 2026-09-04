import fs from 'fs';

const html = `<!DOCTYPE html>
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
    <title>Context &amp; Muse — Studio Rebuild in Progress</title>
    <meta name="description" content="Context &amp; Muse is currently undergoing a studio rebuild. For direct project inquiries, reach out to jayme@contextmuse.com.">
    <link rel="canonical" href="https://www.contextmuse.com/">
    <link rel="icon" type="image/svg+xml" href="/assets/images/contextmuse_logo.svg">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Context &amp; Muse — Studio Rebuild in Progress">
    <meta property="og:description" content="Context &amp; Muse is currently undergoing a studio rebuild. For direct project inquiries, reach out to jayme@contextmuse.com.">
    <meta property="og:url" content="https://www.contextmuse.com/">
    <meta property="og:image" content="https://www.contextmuse.com/og/context-muse-home-v3.jpg">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Context &amp; Muse — Studio Rebuild in Progress">
    <meta name="twitter:description" content="Context &amp; Muse is currently undergoing a studio rebuild. For direct project inquiries, reach out to jayme@contextmuse.com.">
    <meta name="twitter:image" content="https://www.contextmuse.com/og/context-muse-home-v3.jpg">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css?v=2.9">

    <style>
        :root {
            --bg-canvas: #FAF9F5;
            --bg-dark: #0E1F1B;
            --accent-teal: #0F766E;
            --accent-gold: #C5A059;
            --border-subtle: #E8E5DC;
            --text-heading: #0E1F1B;
            --text-muted: #5A6965;
        }

        * {
            box-sizing: border-box;
        }

        body {
            background-color: var(--bg-canvas);
            color: var(--text-heading);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-family: var(--font-sans);
            margin: 0;
            padding: 0;
        }

        .uc-header {
            padding: 2rem 0;
            border-bottom: 1px solid var(--border-subtle);
        }

        .container {
            max-width: min(1100px, calc(100% - 48px));
            margin-inline: auto;
        }

        .uc-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .uc-logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: var(--font-serif);
            font-size: 20px;
            font-weight: 500;
            color: var(--text-heading);
            text-decoration: none;
        }

        .uc-badge {
            font-family: var(--font-mono);
            font-size: 10.5px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--accent-teal);
            background: rgba(15, 118, 110, 0.08);
            border: 1px solid rgba(15, 118, 110, 0.2);
            padding: 5px 12px;
            border-radius: 20px;
        }

        .uc-main {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 5rem 0;
        }

        .uc-grid {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 4.5rem;
            align-items: center;
        }

        .uc-eyebrow {
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 700;
            color: var(--accent-teal);
            letter-spacing: 0.14em;
            text-transform: uppercase;
            display: block;
            margin-bottom: 1.25rem;
        }

        .uc-title {
            font-family: var(--font-serif);
            font-size: clamp(38px, 4.8vw, 56px);
            line-height: 1.05;
            letter-spacing: -0.03em;
            color: var(--text-heading);
            margin: 0 0 1.5rem 0;
            font-weight: 400;
        }

        .uc-subhead {
            font-family: var(--font-sans);
            font-size: 18px;
            line-height: 1.6;
            color: var(--text-muted);
            margin-bottom: 2rem;
            max-width: 540px;
        }

        .uc-contact-panel {
            background: #FFFFFF;
            border: 1px solid var(--border-subtle);
            border-radius: 8px;
            padding: 2.25rem;
            box-shadow: 0 8px 30px rgba(14, 31, 27, 0.04);
        }

        .uc-contact-panel h3 {
            font-family: var(--font-serif);
            font-size: 20px;
            font-weight: 500;
            margin: 0 0 0.5rem 0;
            color: var(--text-heading);
        }

        .uc-contact-panel p {
            font-size: 14px;
            color: var(--text-muted);
            line-height: 1.55;
            margin: 0 0 1.5rem 0;
        }

        .uc-links {
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
        }

        .uc-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.9rem 1.25rem;
            border-radius: 4px;
            text-decoration: none;
            font-family: var(--font-mono);
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.04em;
            transition: all 0.2s ease;
        }

        .uc-btn-primary {
            background: var(--text-heading);
            color: #FAF9F5;
        }

        .uc-btn-primary:hover {
            background: var(--accent-teal);
            color: #FAF9F5;
        }

        .uc-btn-secondary {
            background: rgba(15, 118, 110, 0.06);
            border: 1px solid rgba(15, 118, 110, 0.2);
            color: var(--accent-teal);
        }

        .uc-btn-secondary:hover {
            background: rgba(15, 118, 110, 0.12);
        }

        .uc-art-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .uc-art-wrap img {
            width: 100%;
            max-width: 460px;
            height: auto;
            mix-blend-mode: multiply;
            opacity: 0.98;
            display: block;
        }

        .uc-footer {
            padding: 2rem 0;
            border-top: 1px solid var(--border-subtle);
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--text-muted);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .uc-footer a {
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.2s;
        }

        .uc-footer a:hover {
            color: var(--accent-teal);
        }

        @media (max-width: 880px) {
            .uc-grid {
                grid-template-columns: 1fr;
                gap: 3rem;
            }
            .uc-main {
                padding: 3rem 0;
            }
        }
    </style>
</head>
<body>
    <header class="uc-header">
        <div class="container uc-nav">
            <a href="/" class="uc-logo">
                <img src="/assets/images/contextmuse_logo.svg" alt="" width="22" height="22">
                <span>Context &amp; Muse</span>
            </a>
            <span class="uc-badge">Studio Rebuild in Progress</span>
        </div>
    </header>

    <main class="uc-main" id="main-content">
        <div class="container uc-grid">
            <div>
                <span class="uc-eyebrow">INDEPENDENT SYSTEMS &amp; DESIGN STUDIO</span>
                <h1 class="uc-title">
                    Currently Under Construction.
                </h1>
                <p class="uc-subhead">
                    We are actively updating the Context &amp; Muse portfolio, case studies, and systems catalog.
                </p>

                <div class="uc-contact-panel">
                    <h3>Direct Project Inquiries</h3>
                    <p>
                        For new website builds, operational tools, quoting engines, or conversion leak audits, reach out directly to founder Jayme Volstad:
                    </p>
                    <div class="uc-links">
                        <a href="mailto:jayme@contextmuse.com?subject=Project%20Inquiry" class="uc-btn uc-btn-primary">
                            <span>Email: jayme@contextmuse.com</span>
                            <span>&rarr;</span>
                        </a>
                        <a href="https://wa.me/13468337291" class="uc-btn uc-btn-secondary" target="_blank" rel="noopener">
                            <span>WhatsApp: +1 (346) 833-7291</span>
                            <span>&rarr;</span>
                        </a>
                    </div>
                </div>
            </div>

            <div class="uc-art-wrap" aria-hidden="true">
                <img src="/assets/images/contextmuse_hero_architectural.png" alt="Architectural drafting and systems illustration" width="800" height="800">
            </div>
        </div>
    </main>

    <footer class="uc-footer container">
        <div>&copy; 2026 Context &amp; Muse &bull; Austin, Texas</div>
        <div style="display: flex; gap: 1rem; align-items: center;">
            <a href="/privacy/">Privacy Policy</a>
            <span>&bull;</span>
            <a href="/terms/">Terms of Service</a>
        </div>
    </footer>
</body>
</html>
`;

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated under-construction index.html with OG/Twitter/Footer tags');