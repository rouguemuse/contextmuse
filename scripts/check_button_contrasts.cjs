const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    const cleanPath = reqPath.replace(/^\/+/, '');
    const filePath = path.resolve(__dirname, '..', cleanPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml'
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end('Not found: ' + reqPath);
    }
});

function parseRgb(colorStr) {
    const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m) return null;
    return {
        r: parseInt(m[1]),
        g: parseInt(m[2]),
        b: parseInt(m[3]),
        a: m[4] !== undefined ? parseFloat(m[4]) : 1.0
    };
}

function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrastRatio(rgb1, rgb2) {
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b) + 0.05;
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b) + 0.05;
    return l1 > l2 ? l1 / l2 : l2 / l1;
}

server.listen(0, async () => {
    const port = server.address().port;
    console.log(`Deep Button Contrast & Glitch Audit on http://localhost:${port} ...\n`);

    const pagesToTest = [
        '/',
        '/services/',
        '/systems/',
        '/restaurant-systems/',
        '/signal/',
        '/signal/demo/',
        '/signal/intake/',
        '/signal/sample-reports/',
        '/website-system-check/',
        '/contact/',
        '/about/',
        '/work/',
        '/proof-of-work/',
        '/custom/'
    ];

    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        for (const pagePath of pagesToTest) {
            console.log(`\n========================================\nPAGE: ${pagePath} (Desktop 1440x900)\n========================================`);
            await page.setViewport({ width: 1440, height: 900 });
            await page.goto(`http://localhost:${port}${pagePath}`, { waitUntil: 'networkidle0' });

            // Audit normal state and hover state of every button
            const buttonsData = await page.evaluate(() => {
                const buttonSelectors = [
                    'button',
                    'a.btn',
                    'a.nav-cta',
                    'a.btn-primary',
                    'a.btn-secondary',
                    'a.btn-magnetic',
                    'a.btn-hero-primary',
                    'a.btn-hero-secondary',
                    'a.hero-diag-btn',
                    'a.btn-ladder-cta',
                    'a.btn-intake-primary',
                    'a.btn-intake-back',
                    'a.btn-primary-teal',
                    'a.diag-btn-submit',
                    'button.diag-btn-submit',
                    'input[type="submit"]',
                    'input[type="button"]'
                ];

                const elements = Array.from(document.querySelectorAll(buttonSelectors.join(',')));
                const uniqueElements = [...new Set(elements)];

                return uniqueElements.map((el, index) => {
                    const rect = el.getBoundingClientRect();
                    const comp = window.getComputedStyle(el);

                    // Compute effective background by walking up DOM
                    let parent = el;
                    let effectiveBg = 'rgba(0, 0, 0, 0)';
                    while (parent) {
                        const bg = window.getComputedStyle(parent).backgroundColor;
                        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                            effectiveBg = bg;
                            break;
                        }
                        parent = parent.parentElement;
                    }
                    if (effectiveBg === 'rgba(0, 0, 0, 0)') effectiveBg = 'rgb(250, 249, 245)'; // default paper

                    return {
                        index,
                        tag: el.tagName.toLowerCase(),
                        id: el.id,
                        className: el.className,
                        text: el.innerText.trim().slice(0, 50),
                        display: comp.display,
                        visibility: comp.visibility,
                        opacity: comp.opacity,
                        color: comp.color,
                        backgroundColor: comp.backgroundColor,
                        effectiveBg: effectiveBg,
                        border: comp.border,
                        width: Math.round(rect.width),
                        height: Math.round(rect.height),
                        top: Math.round(rect.top),
                        left: Math.round(rect.left)
                    };
                });
            });

            for (const item of buttonsData) {
                if (item.display === 'none' || item.visibility === 'hidden') continue;
                if (item.width === 0 || item.height === 0) continue;

                const fg = parseRgb(item.color);
                const bg = parseRgb(item.effectiveBg);

                if (fg && bg) {
                    const ratio = contrastRatio(fg, bg);
                    if (ratio < 3.0) {
                        console.log(`[LOW CONTRAST ${ratio.toFixed(2)}:1] "${item.text}"`);
                        console.log(`   Element: <${item.tag} class="${item.className}" id="${item.id}">`);
                        console.log(`   Color: ${item.color} on Background: ${item.effectiveBg}`);
                    }
                }
            }
        }
    } finally {
        if (browser) await browser.close();
        server.close();
    }
});
