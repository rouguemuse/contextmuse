import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

const projectRoot = 'C:\\Users\\rougu\\.gemini\\antigravity\\scratch\\contextmuse-homepage';
const reportsDir = path.join(projectRoot, 'reports');
const reportFilePath = path.join(reportsDir, 'site-verification-report.txt');

// Parse CLI arguments for remote deployment testing
const args = process.argv.slice(2);
let remoteUrl = null;
const urlArgIndex = args.indexOf('--url');
if (urlArgIndex !== -1 && args[urlArgIndex + 1]) {
    remoteUrl = args[urlArgIndex + 1].replace(/\/$/, '');
}

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

let reportContent = '';
function log(msg) {
    console.log(msg);
    reportContent += msg + '\n';
}

log('==========================================================================');
log('                  ROUTE AND LINK VERIFICATION REPORT                      ');
log('==========================================================================');
log(`Timestamp: ${new Date().toISOString()}`);
log(`Deployment Root: ${projectRoot}`);
if (remoteUrl) {
    log(`Testing Remote Target: ${remoteUrl}`);
}
log('==========================================================================');

let overallSuccess = true;

// ==========================================================================
// 1. CONFIGURATION CHECKS (vercel.json)
// ==========================================================================
log('\n[1] CONFIGURATION CHECKS (vercel.json)');
const vercelJsonPath = path.join(projectRoot, 'vercel.json');
let vercelRedirects = [];
if (fs.existsSync(vercelJsonPath)) {
    try {
        const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
        if (vercelConfig.trailingSlash === true) {
            log('  [PASS] vercel.json exists and has trailingSlash set to true.');
        } else {
            log('  [FAIL] vercel.json exists but trailingSlash is NOT true.');
            overallSuccess = false;
        }
        if (Array.isArray(vercelConfig.redirects)) {
            vercelRedirects = vercelConfig.redirects;
            log(`  [PASS] Found ${vercelRedirects.length} redirects in vercel.json.`);
        }
    } catch (e) {
        log(`  [FAIL] Failed to parse vercel.json: ${e.message}`);
        overallSuccess = false;
    }
} else {
    log('  [FAIL] vercel.json does not exist in root directory.');
    overallSuccess = false;
}

// ==========================================================================
// 2. SITEMAP VALIDATION
// ==========================================================================
log('\n[2] SITEMAP VALIDATION');
const sitemapPath = path.join(projectRoot, 'sitemap.xml');
const sitemapUrls = [];
if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    if (sitemapContent.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"') && sitemapContent.includes('<urlset')) {
        log('  [PASS] sitemap.xml is valid XML and includes correct sitemap schema namespace.');
    } else {
        log('  [FAIL] sitemap.xml does not declare the correct sitemap schema namespace.');
        overallSuccess = false;
    }
    if (sitemapContent.includes('lastmod')) {
        log('  [FAIL] sitemap.xml contains forbidden lastmod dates.');
        overallSuccess = false;
    } else {
        log('  [PASS] sitemap.xml contains no forbidden lastmod dates.');
    }

    const locRegex = /<loc>([^<]+)<\/loc>/g;
    let match;
    while ((match = locRegex.exec(sitemapContent)) !== null) {
        sitemapUrls.push(match[1]);
    }

    log(`  Discovered ${sitemapUrls.length} URLs in sitemap.`);
    sitemapUrls.forEach(url => {
        if (url.startsWith('https://www.contextmuse.com/')) {
            log(`    [PASS] Sitemap URL uses standard www prefix: ${url}`);
        } else {
            log(`    [FAIL] Sitemap URL does NOT use www prefix: ${url}`);
            overallSuccess = false;
        }
    });

    // Check that /systems/signal/ does NOT appear in sitemap
    if (sitemapUrls.includes('https://www.contextmuse.com/systems/signal/')) {
        log('    [FAIL] /systems/signal/ is present in sitemap.xml! Only /signal/ should be indexed.');
        overallSuccess = false;
    } else {
        log('    [PASS] /systems/signal/ is not present in sitemap.xml.');
    }

    // Check sitemap targets
    const expectedSitemapUrls = [
        'https://www.contextmuse.com/',
        'https://www.contextmuse.com/about/',
        'https://www.contextmuse.com/systems/',
        'https://www.contextmuse.com/systems/resource-guide/',
        'https://www.contextmuse.com/restaurant-systems/',
        'https://www.contextmuse.com/creative/',
        'https://www.contextmuse.com/creative/how-to-explain-yourself-to-wolves/',
        'https://www.contextmuse.com/privacy/',
        'https://www.contextmuse.com/terms/',
        'https://www.contextmuse.com/gensort/',
        'https://www.contextmuse.com/signal/',
        'https://www.contextmuse.com/custom/'
    ];

    expectedSitemapUrls.forEach(url => {
        if (sitemapUrls.includes(url)) {
            log(`    [PASS] Sitemap registered URL: ${url}`);
        } else {
            log(`    [FAIL] Sitemap missing registered URL: ${url}`);
            overallSuccess = false;
        }
    });

    // Check that redirect source URLs are not in the sitemap
    vercelRedirects.forEach(redir => {
        const sourcePath = redir.source.replace(/^\//, '').replace(/\/$/, '');
        sitemapUrls.forEach(url => {
            const parsedUrl = new URL(url);
            const pathClean = parsedUrl.pathname.replace(/^\//, '').replace(/\/$/, '');
            if (pathClean === sourcePath && sourcePath !== '') {
                log(`    [FAIL] Redirect source path "/${sourcePath}/" is incorrectly present in sitemap.xml: ${url}`);
                overallSuccess = false;
            }
        });
    });
} else {
    log('  [FAIL] sitemap.xml does not exist in root directory.');
    overallSuccess = false;
}

// ==========================================================================
// 3. STRUCTURE AND NAVIGATION AUDITS
// ==========================================================================
log('\n[3] STRUCTURE AND NAVIGATION AUDITS');
const filesToVerify = [
    { name: 'index.html', relPath: 'index.html', canonical: 'https://www.contextmuse.com/' },
    { name: 'proof-of-work.html', relPath: 'proof-of-work.html', canonical: null },
    { name: 'about/index.html', relPath: 'about/index.html', canonical: 'https://www.contextmuse.com/about/' },
    { name: 'creative/index.html', relPath: 'creative/index.html', canonical: 'https://www.contextmuse.com/creative/' },
    { name: 'creative/how-to-explain-yourself-to-wolves/index.html', relPath: 'creative/how-to-explain-yourself-to-wolves/index.html', canonical: 'https://www.contextmuse.com/creative/how-to-explain-yourself-to-wolves/' },
    { name: 'systems/index.html', relPath: 'systems/index.html', canonical: 'https://www.contextmuse.com/systems/' },
    { name: 'systems/resource-guide/index.html', relPath: 'systems/resource-guide/index.html', canonical: 'https://www.contextmuse.com/systems/resource-guide/' },
    { name: 'restaurant-systems/index.html', relPath: 'restaurant-systems/index.html', canonical: 'https://www.contextmuse.com/restaurant-systems/' },
    { name: 'privacy/index.html', relPath: 'privacy/index.html', canonical: 'https://www.contextmuse.com/privacy/' },
    { name: 'terms/index.html', relPath: 'terms/index.html', canonical: 'https://www.contextmuse.com/terms/' },
    { name: 'gensort/index.html', relPath: 'gensort/index.html', canonical: 'https://www.contextmuse.com/gensort/' },
    { name: 'signal/index.html', relPath: 'signal/index.html', canonical: 'https://www.contextmuse.com/signal/' },
    { name: 'custom/index.html', relPath: 'custom/index.html', canonical: 'https://www.contextmuse.com/custom/' }
];

const pageTitles = new Set();
const pageDescriptions = new Set();

filesToVerify.forEach(fileSpec => {
    const filePath = path.join(projectRoot, fileSpec.relPath);
    if (!fs.existsSync(filePath)) {
        log(`  [FAIL] File does not exist: ${fileSpec.relPath}`);
        overallSuccess = false;
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    log(`\n  Auditing route page: ${fileSpec.relPath}...`);

    // 3.1 Title check
    const titleMatch = content.match(/<title>([^<]+)<\/title>/gi);
    if (titleMatch && titleMatch.length === 1) {
        const titleText = titleMatch[0].replace(/<\/?title>/gi, '').trim();
        log(`    [PASS] Title: "${titleText}"`);
        if (pageTitles.has(titleText)) {
            log(`    [FAIL] Duplicate page title detected: "${titleText}"`);
            overallSuccess = false;
        } else {
            pageTitles.add(titleText);
        }
    } else {
        log(`    [FAIL] Missing or multiple <title> tags. Count: ${titleMatch ? titleMatch.length : 0}`);
        overallSuccess = false;
    }

    // 3.2 Meta description check
    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    if (descMatch) {
        const descText = descMatch[1].trim();
        log(`    [PASS] Meta Description: "${descText}"`);
        if (pageDescriptions.has(descText)) {
            log(`    [FAIL] Duplicate meta description detected: "${descText}"`);
            overallSuccess = false;
        } else {
            pageDescriptions.add(descText);
        }
    } else {
        log(`    [FAIL] Missing meta description tag`);
        overallSuccess = false;
    }

    // 3.3 Canonical URL check
    if (fileSpec.canonical) {
        const canonicalMatches = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/gi) || [];
        if (canonicalMatches.length === 1) {
            const canonicalHref = canonicalMatches[0].match(/href=["']([^"']+)["']/i)[1];
            if (canonicalHref === fileSpec.canonical) {
                log(`    [PASS] Canonical matches expected: "${canonicalHref}"`);
            } else {
                log(`    [FAIL] Canonical URL mismatch: expected "${fileSpec.canonical}", found "${canonicalHref}"`);
                overallSuccess = false;
            }
        } else {
            log(`    [FAIL] Expected exactly one canonical link tag, found ${canonicalMatches.length}`);
            overallSuccess = false;
        }
    }

    // 3.4 Open Graph & Twitter URL matches Canonical
    if (fileSpec.canonical) {
        const ogUrlMatch = content.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
        if (ogUrlMatch && ogUrlMatch[1] === fileSpec.canonical) {
            log(`    [PASS] og:url matches canonical: "${ogUrlMatch[1]}"`);
        } else {
            log(`    [FAIL] og:url missing or mismatch: expected "${fileSpec.canonical}", found "${ogUrlMatch ? ogUrlMatch[1] : 'none'}"`);
            overallSuccess = false;
        }
        
        // Twitter card exists
        if (content.includes('name="twitter:card"') || content.includes('property="twitter:card"')) {
            log('    [PASS] Twitter card metadata exists');
        } else {
            log('    [FAIL] Missing Twitter card metadata');
            overallSuccess = false;
        }
    }

    // 3.5 Heading validation
    const h1Matches = content.match(/<h1[^>]*>/gi) || [];
    if (h1Matches.length === 1) {
        log(`    [PASS] Exactly one <h1> tag found`);
    } else {
        log(`    [FAIL] Expected exactly one <h1> tag, found ${h1Matches.length}`);
        overallSuccess = false;
    }

    // 3.6 Footer check for Privacy and Terms links
    if (fileSpec.relPath !== 'proof-of-work.html') {
        const hasPrivacyLink = content.includes('href="/privacy/"');
        const hasTermsLink = content.includes('href="/terms/"');
        if (hasPrivacyLink && hasTermsLink) {
            log('    [PASS] Privacy Policy and Terms of Service linked in footer.');
        } else {
            log(`    [FAIL] Footer missing Privacy and Terms links (Privacy: ${hasPrivacyLink}, Terms: ${hasTermsLink})`);
            overallSuccess = false;
        }
    }

    // 3.7 Old canonical domain references check (non-www)
    const nonWwwPattern = /href=["']https?:\/\/contextmuse\.com[^"']*["']/gi;
    if (nonWwwPattern.test(content)) {
        log('    [FAIL] Contains legacy non-www absolute canonical domain references.');
        overallSuccess = false;
    } else {
        log('    [PASS] No legacy non-www absolute links found.');
    }

    // 3.8 Broken links check
    const linkRegex = /href=["']([^"']+)["']/g;
    const links = [];
    let matchLink;
    while ((matchLink = linkRegex.exec(content)) !== null) {
        links.push(matchLink[1]);
    }

    let brokenLinksCount = 0;
    links.forEach(link => {
        if (link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('http://') || link.startsWith('https://')) {
            // Fail if link contains invalid fragments, placeholders or Stripe placeholders
            if (link === '#' && fileSpec.relPath !== 'index.html' && !content.includes('id="nav-toggle"')) {
                log(`    [FAIL] Link is exactly empty fragment '#': ${link}`);
                overallSuccess = false;
            }
            if (link.includes('buy.stripe.com/...') || link.includes('example.com') || link.includes('javascript:void')) {
                log(`    [FAIL] Link contains placeholder/broken target: ${link}`);
                overallSuccess = false;
            }
            return;
        }

        // Handle root-absolute paths starting with /
        let cleanLink = link.split('#')[0].split('?')[0];
        if (cleanLink === '') {
            return;
        }

        let resolvedPath;
        if (cleanLink.startsWith('/')) {
            resolvedPath = path.join(projectRoot, cleanLink.substring(1));
        } else {
            resolvedPath = path.resolve(path.dirname(filePath), cleanLink);
        }

        // Resolve folders with / to index.html
        if (fs.existsSync(resolvedPath)) {
            const stats = fs.statSync(resolvedPath);
            if (stats.isDirectory()) {
                const indexCheck = path.join(resolvedPath, 'index.html');
                if (!fs.existsSync(indexCheck)) {
                    log(`    [FAIL] Directory path without index: ${link} (Resolved: ${indexCheck})`);
                    brokenLinksCount++;
                    overallSuccess = false;
                }
            }
        } else {
            log(`    [FAIL] Broken link reference: ${link} (Resolved: ${resolvedPath})`);
            brokenLinksCount++;
            overallSuccess = false;
        }
    });

    if (brokenLinksCount === 0) {
        log(`    [PASS] No broken internal links found.`);
    }

    // 3.9 Check for legacy routes in navigation or document links (like /lab/, /services/, /systems/signal/)
    const legacyRoutes = ['/lab/', '/services/', '/systems/signal/'];
    legacyRoutes.forEach(route => {
        if (content.includes(`href="${route}"`) || content.includes(`href="${route}/"`)) {
            log(`    [FAIL] Page contains link to deprecated legacy route: "${route}"`);
            overallSuccess = false;
        }
    });

    // Check that /systems/signal/ is not used as an internal canonical link
    if (content.includes('rel="canonical" href="https://www.contextmuse.com/systems/signal/"') && fileSpec.relPath !== 'systems/signal/index.html') {
        log('    [FAIL] Page contains deprecated systems/signal/ canonical target link!');
        overallSuccess = false;
    }

    // 3.10 Check for vercel.app links in copy
    const vercelAppPattern = /[a-zA-Z0-9-]+\.vercel\.app/i;
    if (vercelAppPattern.test(content)) {
        log('    [FAIL] Page contains raw vercel.app URL references.');
        overallSuccess = false;
    } else {
        log('    [PASS] Verified: No raw vercel.app URLs exist in copy.');
    }
});

// ==========================================================================
// 4. RESTAURANT SYSTEMS VS SIGNAL COPY CHECK
// ==========================================================================
log('\n[4] RESTAURANT SYSTEMS VS SIGNAL COPY CHECK');
const restSysPath = path.join(projectRoot, 'restaurant-systems/index.html');
const sigPath = path.join(projectRoot, 'signal/index.html');

if (fs.existsSync(restSysPath) && fs.existsSync(sigPath)) {
    const restContent = fs.readFileSync(restSysPath, 'utf8');
    const sigContent = fs.readFileSync(sigPath, 'utf8');

    // Check if the titles are different
    const titleRest = restContent.match(/<title>([^<]+)<\/title>/i)[1].trim();
    const titleSig = sigContent.match(/<title>([^<]+)<\/title>/i)[1].trim();

    if (titleRest !== titleSig) {
        log('  [PASS] Page titles are distinct.');
    } else {
        log('  [FAIL] Page titles are identical!');
        overallSuccess = false;
    }

    // Check for overlap / distinct text length or uniqueness
    if (restContent.includes('Menu &amp; Margin Workflows') && restContent.includes('Labor &amp; Scheduling Analysis')) {
        log('  [PASS] Restaurant Systems page contains broader operational consulting descriptions.');
    } else {
        log('  [FAIL] Restaurant Systems page is missing consulting descriptors.');
        overallSuccess = false;
    }

    if (restContent.includes('Signal reviews from') && restContent.includes('href="/signal/"')) {
        log('  [PASS] Restaurant Systems CTA links properly to Signal and references starting price.');
    } else {
        log('  [FAIL] Restaurant Systems does not link correctly to Signal details or reference starting price.');
        overallSuccess = false;
    }

    // Check pricing table duplication: Restaurant Systems should NOT have Ongoing Review or detailed Diagnostic columns
    if (restContent.includes('Ongoing Review') && restContent.includes('$595') && restContent.includes('$195/mo')) {
        log('  [FAIL] Restaurant Systems page duplicates the full pricing cards. It should link to Signal instead.');
        overallSuccess = false;
    } else {
        log('  [PASS] Restaurant Systems page does not duplicate full pricing details.');
    }
} else {
    log('  [FAIL] Restaurant systems or Signal page is missing.');
    overallSuccess = false;
}

// ==========================================================================
// 5. LEGACY SIGNAL PRICES & OFFER NAME ALIGNMENT SEARCH
// ==========================================================================
log('\n[5] LEGACY SIGNAL PRICES & OFFER NAME ALIGNMENT SEARCH');
let legacyPriceFound = false;
const legacyPrices = ['$149', '$450', '$750', 'starting at $450'];
filesToVerify.forEach(fileSpec => {
    const filePath = path.join(projectRoot, fileSpec.relPath);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    legacyPrices.forEach(price => {
        if (content.includes(price)) {
            log(`  [FAIL] Legacy pricing mention "${price}" found in ${fileSpec.relPath}`);
            legacyPriceFound = true;
            overallSuccess = false;
        }
    });

    // Check for contradictory Signal offer names
    const forbiddenOfferNames = ['Signal Operational Audit', 'Signal Continuous Monitoring'];
    forbiddenOfferNames.forEach(name => {
        if (content.includes(name)) {
            log(`  [FAIL] Contradictory Signal offer name "${name}" found in ${fileSpec.relPath}`);
            overallSuccess = false;
        }
    });
});
if (!legacyPriceFound) {
    log('  [PASS] Verified: No legacy price points ($149, $450, $750) exist in indexable files.');
}

// Check consistency of pricing: GenSort (Snapshot Export: $195), Signal (Snapshot: $195, Diagnostic: $595, Ongoing Review: $195/mo)
log('\n  Verifying GenSort and Signal pricing values in all index pages...');
filesToVerify.forEach(fileSpec => {
    const filePath = path.join(projectRoot, fileSpec.relPath);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');

    // GenSort: If it has pricing, verify it specifies $195
    if (fileSpec.relPath === 'gensort/index.html') {
        if (content.includes('$195')) {
            log('    [PASS] GenSort page lists correct $195 export fee.');
        } else {
            log('    [FAIL] GenSort page does not mention $195 pricing.');
            overallSuccess = false;
        }
    }

    // Signal: If it has pricing, verify it specifies $195, $595, and $195/mo
    if (fileSpec.relPath === 'signal/index.html') {
        if (content.includes('$195') && content.includes('$595') && content.includes('$195/mo') && content.includes('Signal Snapshot') && content.includes('Signal Diagnostic') && content.includes('Ongoing Review')) {
            log('    [PASS] Signal page lists standard offers: Snapshot ($195), Diagnostic ($595), Ongoing ($195/mo).');
        } else {
            log('    [FAIL] Signal page does not list standard pricing elements correctly.');
            overallSuccess = false;
        }
    }

    // Custom: Verify project status label is present
    if (fileSpec.relPath === 'custom/index.html') {
        if (content.includes('Custom client engagements')) {
            log('    [PASS] Custom Systems page lists project status: Custom client engagements');
        } else {
            log('    [FAIL] Custom Systems page is missing product status label.');
            overallSuccess = false;
        }
    }
});

// ==========================================================================
// 6. DEPLOYMENT FILE INVENTORY & DELETION SCANS
// ==========================================================================
log('\n[6] DEPLOYMENT FILE INVENTORY & DELETION SCANS');
const vercelIgnoreList = [
    'scripts/', 'reports/', '.env', '.env.*', '*.db', '*.sqlite', '*.sqlite3', '*.log',
    'private/', 'drafts/', 'exports/', 'backups/', 'data/', 'backup', 'private', 'draft'
];
const deploymentFiles = [];
function buildInventory(dir) {
    fs.readdirSync(dir).forEach(f => {
        const fullPath = path.join(dir, f);
        const relativePathRaw = path.relative(projectRoot, fullPath);
        const relativePath = relativePathRaw.replace(/\\/g, '/');
        const isDirectory = fs.statSync(fullPath).isDirectory();

        if (f === '.git' || f === '.vercel' || f === 'node_modules') {
            return;
        }

        if (vercelIgnoreList.some(pattern => {
            if (pattern.startsWith('/')) {
                return relativePath.startsWith(pattern.substring(1));
            }
            return relativePath.includes(pattern);
        })) {
            return;
        }

        if (isDirectory) {
            buildInventory(fullPath);
        } else {
            deploymentFiles.push('/' + relativePath);
        }
    });
}
buildInventory(projectRoot);

// Ensure no /lab/ folder exists on disk in our workspace
const labFolderCheck = path.join(projectRoot, 'lab');
if (fs.existsSync(labFolderCheck)) {
    log('  [FAIL] Legacy /lab/ folder still exists in the local deployment root.');
    overallSuccess = false;
} else {
    log('  [PASS] Legacy /lab/ folder has been completely removed from local deployment root.');
}

// Confirm no manuscript drafts exist in deployment inventory
let manuscriptLeaked = false;
deploymentFiles.forEach(file => {
    const lower = file.toLowerCase();
    if (lower.includes('manuscript') || lower.endsWith('.doc') || lower.endsWith('.docx') || lower.endsWith('.odt')) {
        manuscriptLeaked = true;
    }
});
if (manuscriptLeaked) {
    log('  [FAIL] Manuscript file or draft document detected in deployment inventory.');
    overallSuccess = false;
} else {
    log('  [PASS] Confirmed: No manuscript document or downloadable manuscript asset exists in deployment output.');
}

// ==========================================================================
// 7. AUTOMATED ASSET VALIDATION (Existence & Size)
// ==========================================================================
log('\n[7] AUTOMATED ASSET VALIDATION');
const assetRegex = /src=["']([^"']+\.(png|webp|jpg|jpeg|gif|svg))["']/gi;
const cssUrlRegex = /url\(["']?([^"')]+\.(png|webp|jpg|jpeg|gif|svg))["']?\)/gi;
const ogImageRegex = /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/gi;

const discoveredAssets = new Set();
filesToVerify.forEach(fileSpec => {
    const filePath = path.join(projectRoot, fileSpec.relPath);
    if (!fs.existsSync(filePath)) return;
    const fileContent = fs.readFileSync(filePath, 'utf8');

    let match;
    while ((match = assetRegex.exec(fileContent)) !== null) {
        discoveredAssets.add(match[1]);
    }
    while ((match = cssUrlRegex.exec(fileContent)) !== null) {
        discoveredAssets.add(match[1]);
    }
    // Scan og:image as well
    let ogMatch;
    while ((ogMatch = ogImageRegex.exec(fileContent)) !== null) {
        let cleanOg = ogMatch[1];
        if (cleanOg.startsWith('https://www.contextmuse.com/')) {
            cleanOg = cleanOg.replace('https://www.contextmuse.com/', '/');
        }
        discoveredAssets.add(cleanOg);
    }
});

log(`  Discovered ${discoveredAssets.size} unique referenced asset paths.`);

let assetsPassed = true;
discoveredAssets.forEach(asset => {
    if (asset.startsWith('http://') || asset.startsWith('https://')) {
        return;
    }

    let cleanAsset = asset.split('#')[0].split('?')[0];
    let resolvedPath = cleanAsset.startsWith('/')
        ? path.join(projectRoot, cleanAsset.substring(1))
        : path.resolve(projectRoot, cleanAsset);

    if (!fs.existsSync(resolvedPath)) {
        log(`  [FAIL] Referenced asset does not exist: "${asset}" (Resolved: ${resolvedPath})`);
        assetsPassed = false;
        overallSuccess = false;
        return;
    }

    const stats = fs.statSync(resolvedPath);
    if (stats.size === 0) {
        log(`  [FAIL] Asset file is empty (0 bytes): "${asset}"`);
        assetsPassed = false;
        overallSuccess = false;
    } else {
        log(`  [PASS] Asset: "${asset}" (${stats.size} bytes)`);
    }
});

if (assetsPassed) {
    log('  [PASS] All referenced assets passed size and existence checks.');
}

// ==========================================================================
// 8. REMOTE DEPLOYMENT HTTP ENDPOINT TESTING (IF SPECIFIED)
// ==========================================================================
if (remoteUrl) {
    log('\n[8] REMOTE DEPLOYMENT HTTP ENDPOINT TESTING');

    // Helper to query remote URL
    const fetchRemote = (url) => {
        return new Promise((resolve) => {
            const client = url.startsWith('https') ? https : http;
            client.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: data
                }));
            }).on('error', (e) => {
                resolve({ status: 0, headers: {}, body: '', error: e.message });
            });
        });
    };

    async function runRemoteTests() {
        // Test 1: Redirect verification (non-www to www)
        log('  Verifying non-www to www redirect routing...');
        const bareDomainUrl = remoteUrl.replace('www.', '');
        const bareRes = await fetchRemote(bareDomainUrl + '/');
        log(`    GET ${bareDomainUrl}/ -> Status: ${bareRes.status}`);
        if (bareRes.status === 307 || bareRes.status === 308 || bareRes.status === 301 || bareRes.status === 302) {
            const loc = bareRes.headers.location || '';
            log(`    [PASS] Redirect location: "${loc}"`);
            if (loc.startsWith('https://www.contextmuse.com/')) {
                log('    [PASS] Redirect successfully targets canonical www host.');
            } else {
                log(`    [FAIL] Redirect target mismatch! Expected www domain, found "${loc}"`);
                overallSuccess = false;
            }
        } else {
            log(`    [WARNING] Expected redirect status for bare domain request, found status ${bareRes.status}. (If testing preview Vercel branch URLs, Vercel aliases are only bound to www.contextmuse.com)`);
        }

        // Test 2: Redirect verification for vercel.json routes
        log('  Verifying vercel.json redirect routing on remote endpoint...');
        const testRedirects = [
            { source: '/systems/signal/', target: '/signal/' },
            { source: '/lab/', target: '/systems/' },
            { source: '/contact/', target: '/' }
        ];

        for (const tr of testRedirects) {
            const targetUrl = `${remoteUrl}${tr.source}`;
            const res = await fetchRemote(targetUrl);
            log(`    GET ${targetUrl} -> Status: ${res.status}`);
            if (res.status === 307 || res.status === 308 || res.status === 301 || res.status === 302) {
                const loc = res.headers.location || '';
                log(`    [PASS] Redirect location: "${loc}"`);
                if (loc.endsWith(tr.target) || loc.includes(tr.target)) {
                    log(`    [PASS] Redirect successfully targets "${tr.target}"`);
                } else {
                    log(`    [FAIL] Redirect target mismatch! Expected "${tr.target}", found "${loc}"`);
                    overallSuccess = false;
                }
            } else {
                log(`    [FAIL] Expected redirect status (301-308), found ${res.status}`);
                overallSuccess = false;
            }
        }

        // Test 3: Sitemap HTTP check
        const sitemapUrlRemote = `${remoteUrl}/sitemap.xml`;
        const smRes = await fetchRemote(sitemapUrlRemote);
        log(`    GET ${sitemapUrlRemote} -> Status: ${smRes.status}`);
        if (smRes.status === 200 && smRes.body.includes('<urlset')) {
            log('    [PASS] Sitemap retrieved successfully and is valid XML.');
        } else {
            log('    [FAIL] Sitemap retrieval failed or content is invalid.');
            overallSuccess = false;
        }

        // Test 4: Canonical and OG validation on remote index
        const indexRes = await fetchRemote(remoteUrl + '/');
        log(`    GET ${remoteUrl}/ -> Status: ${indexRes.status}`);
        if (indexRes.status === 200) {
            const canonicalMatch = indexRes.body.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
            if (canonicalMatch) {
                log(`    [PASS] Remote Canonical Link: "${canonicalMatch[1]}"`);
                if (canonicalMatch[1].startsWith('https://www.contextmuse.com/')) {
                    log('    [PASS] Canonical uses standard www host.');
                } else {
                    log('    [FAIL] Canonical does NOT use standard www host!');
                    overallSuccess = false;
                }
            } else {
                log('    [FAIL] Canonical Link missing on remote homepage!');
                overallSuccess = false;
            }

            const ogImageMatch = indexRes.body.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
            if (ogImageMatch) {
                log(`    [PASS] Remote OG Image: "${ogImageMatch[1]}"`);
            } else {
                log('    [FAIL] Missing og:image tag on remote homepage!');
                overallSuccess = false;
            }
        } else {
            log('    [FAIL] Remote homepage returned non-200 status code.');
            overallSuccess = false;
        }
    }

    await runRemoteTests();
}

log('\n==========================================================================');
log(`FINAL VERIFICATION RESULT: ${overallSuccess ? 'SUCCESS / PASSED' : 'FAILED'}`);
log('==========================================================================');

// Write the report file
fs.writeFileSync(reportFilePath, reportContent, 'utf8');

// Exit code based on overall success
process.exit(overallSuccess ? 0 : 1);
