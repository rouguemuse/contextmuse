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

function colorDistance(rgb1, rgb2) {
    // Parse rgb(r, g, b) or rgba(r, g, b, a)
    const m1 = rgb1.match(/\d+/g);
    const m2 = rgb2.match(/\d+/g);
    if (!m1 || !m2) return 999;
    const rDiff = Math.abs(parseInt(m1[0]) - parseInt(m2[0]));
    const gDiff = Math.abs(parseInt(m1[1]) - parseInt(m2[1]));
    const bDiff = Math.abs(parseInt(m1[2]) - parseInt(m2[2]));
    return rDiff + gDiff + bDiff;
}

function isWhiteOrLight(rgb) {
    const m = rgb.match(/\d+/g);
    if (!m) return false;
    const r = parseInt(m[0]), g = parseInt(m[1]), b = parseInt(m[2]);
    return r > 220 && g > 220 && b > 220;
}

server.listen(0, async () => {
    const port = server.address().port;
    console.log(`Auditing button styles on http://localhost:${port} ...\n`);

    const pagesToTest = [
        '/',
        '/services/',
        '/systems/',
        '/restaurant-systems/',
        '/signal/',
        '/signal/demo/',
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
            console.log(`\n========================================\nPAGE: ${pagePath}\n========================================`);
            await page.goto(`http://localhost:${port}${pagePath}`, { waitUntil: 'networkidle0' });

            const buttonReports = await page.evaluate(() => {
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
                    'a.btn-primary-teal',
                    'input[type="submit"]'
                ];

                const elements = Array.from(document.querySelectorAll(buttonSelectors.join(',')));
                const uniqueElements = [...new Set(elements)];

                return uniqueElements.map(el => {
                    const rect = el.getBoundingClientRect();
                    const comp = window.getComputedStyle(el);

                    // Also get parent computed background if element bg is transparent
                    let parent = el.parentElement;
                    let parentBg = 'transparent';
                    while (parent && (parentBg === 'transparent' || parentBg === 'rgba(0, 0, 0, 0)')) {
                        parentBg = window.getComputedStyle(parent).backgroundColor;
                        parent = parent.parentElement;
                    }

                    return {
                        tag: el.tagName.toLowerCase(),
                        id: el.id,
                        className: el.className,
                        text: el.innerText.trim().slice(0, 40),
                        display: comp.display,
                        visibility: comp.visibility,
                        opacity: comp.opacity,
                        color: comp.color,
                        backgroundColor: comp.backgroundColor,
                        effectiveBg: (comp.backgroundColor === 'transparent' || comp.backgroundColor === 'rgba(0, 0, 0, 0)') ? parentBg : comp.backgroundColor,
                        border: comp.border,
                        width: Math.round(rect.width),
                        height: Math.round(rect.height),
                        top: Math.round(rect.top),
                        left: Math.round(rect.left)
                    };
                });
            });

            console.log(`Found ${buttonReports.length} button elements.`);
            const issues = [];

            for (const btn of buttonReports) {
                // Check if hidden or 0 size
                if (btn.display === 'none' || btn.visibility === 'hidden' || btn.opacity === '0') {
                    // Ignore elements like mobile menu toggles or modals when closed
                    if (!btn.className.includes('nav-toggle') && !btn.className.includes('modal') && btn.text.length > 0) {
                        issues.push({ type: 'HIDDEN/DISAPPEARED', btn });
                    }
                    continue;
                }

                if (btn.width === 0 || btn.height === 0) {
                    if (btn.text.length > 0) {
                        issues.push({ type: 'ZERO_SIZE', btn });
                    }
                    continue;
                }

                // Check white on white or poor contrast
                const isTextColorWhite = isWhiteOrLight(btn.color);
                const isBgWhite = isWhiteOrLight(btn.effectiveBg);

                if (isTextColorWhite && isBgWhite) {
                    issues.push({
                        type: 'WHITE_ON_WHITE',
                        color: btn.color,
                        effectiveBg: btn.effectiveBg,
                        btn
                    });
                } else {
                    const dist = colorDistance(btn.color, btn.effectiveBg);
                    if (dist < 40) {
                        issues.push({
                            type: 'VERY_LOW_CONTRAST',
                            distance: dist,
                            color: btn.color,
                            effectiveBg: btn.effectiveBg,
                            btn
                        });
                    }
                }
            }

            if (issues.length > 0) {
                console.log(`>>> FOUND ${issues.length} POTENTIAL ISSUES ON ${pagePath}:`);
                issues.forEach(iss => {
                    console.log(`  [${iss.type}] "${iss.btn.text}" (<${iss.btn.tag} class="${iss.btn.className}" id="${iss.btn.id}">)`);
                    console.log(`      Color: ${iss.btn.color} | Bg: ${iss.btn.backgroundColor} | EffectiveBg: ${iss.btn.effectiveBg}`);
                });
            } else {
                console.log(`>>> All visible buttons have contrast and dimensions!`);
            }
        }
    } finally {
        if (browser) await browser.close();
        server.close();
    }
});
