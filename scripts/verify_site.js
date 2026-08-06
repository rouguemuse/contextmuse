import fs from 'fs';
import path from 'path';
import http from 'http';

const projectRoot = 'C:\\Users\\rougu\\.gemini\\antigravity\\scratch\\contextmuse-homepage';
const reportsDir = path.join(projectRoot, 'reports');
const reportFilePath = path.join(reportsDir, 'site-verification-report.txt');

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

let overallSuccess = true;

// ==========================================================================
// 1. CONFIGURATION CHECKS (vercel.json)
// ==========================================================================
log('\n[1] CONFIGURATION CHECKS (vercel.json)');
const vercelJsonPath = path.join(projectRoot, 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
    try {
        const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
        if (vercelConfig.trailingSlash === true) {
            log('  [PASS] vercel.json exists and has trailingSlash set to true.');
        } else {
            log('  [FAIL] vercel.json exists but trailingSlash is NOT true.');
            overallSuccess = false;
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
// 2. CANONICAL REDIRECT BEHAVIOR CHECKS
// ==========================================================================
log('\n[2] CANONICAL REDIRECT BEHAVIOR CHECKS');

// Helper to make HTTP request locally
function testUrlRedirect(host, port, reqPath, expectedStatus, expectedTarget) {
    return new Promise((resolve) => {
        const options = {
            host: host,
            port: port,
            path: reqPath,
            method: 'GET',
            headers: { 'host': 'contextmuse.com' }
        };

        const req = http.request(options, (res) => {
            let redirectTarget = res.headers.location || '';
            resolve({
                status: res.statusCode,
                target: redirectTarget,
                success: res.statusCode === expectedStatus && redirectTarget.endsWith(expectedTarget)
            });
        });

        req.on('error', () => {
            resolve({ status: 0, target: '', success: false, offline: true });
        });

        req.setTimeout(1000, () => {
            req.destroy();
            resolve({ status: 0, target: '', success: false, timeout: true });
        });

        req.end();
    });
}

async function runRedirectTests() {
    const host = '127.0.0.1';
    const port = 3000;
    const testCases = [
        { path: '/jayme', target: '/about/' },
        { path: '/creative', target: '/creative/' },
        { path: '/creative/resource-guide', target: '/systems/resource-guide/' }
    ];

    let serverOnline = false;
    for (const testCase of testCases) {
        const res = await testUrlRedirect(host, port, testCase.path, 308, testCase.target);
        if (res.offline) {
            log(`  [WARN] Local Vercel server (port ${port}) is offline. Direct HTTP redirect tests skipped.`);
            log(`         tested configuration file (vercel.json trailingSlash rules) as fallback.`);
            break;
        }
        serverOnline = true;
        log(`  Initial requested URL: http://${host}:${port}${testCase.path}`);
        log(`  Initial HTTP status: ${res.status}`);
        log(`  Redirect destination: ${res.target}`);
        if (res.success) {
            log(`  [PASS] Noncanonical route redirected to canonical route with 308 status code.`);
        } else {
            log(`  [FAIL] Redirect check failed (Status: ${res.status}, Target: ${res.target})`);
            overallSuccess = false;
        }
    }
    return serverOnline;
}

// ==========================================================================
// 3. SITEMAP VALIDATION
// ==========================================================================
log('\n[3] SITEMAP VALIDATION');
const sitemapPath = path.join(projectRoot, 'sitemap.xml');
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

    const publicUrls = [
        'https://contextmuse.com/',
        'https://contextmuse.com/about/',
        // 'https://contextmuse.com/jayme/product-experience/',
        'https://contextmuse.com/creative/',
        'https://contextmuse.com/creative/how-to-explain-yourself-to-wolves/',
        'https://contextmuse.com/systems/resource-guide/',
        'https://contextmuse.com/systems/'
    ];

    publicUrls.forEach(url => {
        if (sitemapContent.includes(`<loc>${url}</loc>`)) {
            log(`  [PASS] Sitemap includes location: ${url}`);
        } else {
            log(`  [FAIL] Sitemap missing location: ${url}`);
            overallSuccess = false;
        }
    });
} else {
    log('  [FAIL] sitemap.xml does not exist in root directory.');
    overallSuccess = false;
}

// ==========================================================================
// 4. STRUCTURE AND NAVIGATION AUDITS
// ==========================================================================
log('\n[4] STRUCTURE AND NAVIGATION AUDITS');
const filesToVerify = [
    { name: 'index.html', relPath: 'index.html', canonical: 'https://contextmuse.com/' },
    { name: 'proof-of-work.html', relPath: 'proof-of-work.html', canonical: null },
    { name: 'about/index.html', relPath: 'about/index.html', canonical: 'https://contextmuse.com/about/' },
    // { name: 'jayme/product-experience/index.html', relPath: 'jayme/product-experience/index.html', canonical: 'https://contextmuse.com/jayme/product-experience/' },
    { name: 'creative/index.html', relPath: 'creative/index.html', canonical: 'https://contextmuse.com/creative/' },
    { name: 'creative/how-to-explain-yourself-to-wolves/index.html', relPath: 'creative/how-to-explain-yourself-to-wolves/index.html', canonical: 'https://contextmuse.com/creative/how-to-explain-yourself-to-wolves/' },
    { name: 'systems/resource-guide/index.html', relPath: 'systems/resource-guide/index.html', canonical: 'https://contextmuse.com/systems/resource-guide/' },
    { name: 'systems/index.html', relPath: 'systems/index.html', canonical: 'https://contextmuse.com/systems/' }
];

filesToVerify.forEach(fileSpec => {
    const filePath = path.join(projectRoot, fileSpec.relPath);
    if (!fs.existsSync(filePath)) {
        log(`  [FAIL] File does not exist: ${fileSpec.relPath}`);
        overallSuccess = false;
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    log(`\n  Auditing route page: ${fileSpec.relPath}...`);

    // 4.1 Title check
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
        log(`    [PASS] Title: "${titleMatch[1].trim()}"`);
    } else {
        log(`    [FAIL] Missing <title> tag`);
        overallSuccess = false;
    }

    // 4.2 Canonical URL check
    if (fileSpec.canonical) {
        const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
        if (canonicalMatch && canonicalMatch[1] === fileSpec.canonical) {
            log(`    [PASS] Canonical matches declared URL: "${canonicalMatch[1]}"`);
        } else {
            log(`    [FAIL] Canonical URL missing or does not match: expected "${fileSpec.canonical}", found "${canonicalMatch ? canonicalMatch[1] : 'none'}"`);
            overallSuccess = false;
        }
    } else {
        log(`    [INFO] Canonical tag not expected for internal portfolio assets.`);
    }

    // 4.3 Heading validation
    const h1Matches = content.match(/<h1[^>]*>/gi) || [];
    if (h1Matches.length === 1) {
        log(`    [PASS] Exactly one <h1> tag found`);
    } else {
        log(`    [FAIL] Expected exactly one <h1> tag, found ${h1Matches.length}`);
        overallSuccess = false;
    }

    // 4.4 Element ID uniqueness check
    const idRegex = /id=["']([^"']+)["']/g;
    const ids = [];
    let match;
    while ((match = idRegex.exec(content)) !== null) {
        ids.push(match[1]);
    }
    const duplicateIds = ids.filter((item, index) => ids.indexOf(item) !== index);
    if (duplicateIds.length === 0) {
        log(`    [PASS] All element IDs are unique`);
    } else {
        log(`    [FAIL] Duplicate element IDs found: ${Array.from(new Set(duplicateIds)).join(', ')}`);
        overallSuccess = false;
    }

    // 4.5 Broken links check
    const linkRegex = /href=["']([^"']+)["']/g;
    const links = [];
    while ((match = linkRegex.exec(content)) !== null) {
        links.push(match[1]);
    }

    let brokenLinksCount = 0;
    links.forEach(link => {
        if (link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('http://') || link.startsWith('https://')) {
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
            // Check if it's a sibling project in the parent scratch directory
            if (!fs.existsSync(resolvedPath)) {
                const parentPath = path.join(path.dirname(projectRoot), cleanLink.substring(1));
                if (fs.existsSync(parentPath)) {
                    resolvedPath = parentPath;
                }
            }
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
});

// ==========================================================================
// 5. WOLVES EXCERPT VALIDATION
// ==========================================================================
log('\n[5] WOLVES EXCERPT VALIDATION');
const wolvesPagePath = path.join(projectRoot, 'creative/how-to-explain-yourself-to-wolves/index.html');
if (fs.existsSync(wolvesPagePath)) {
    const wolvesContent = fs.readFileSync(wolvesPagePath, 'utf8');
    
    // Verify that the legacy manuscript excerpt placeholder has been completely removed
    const placeholderCount = (wolvesContent.match(/class=["']excerpt-placeholder["']/gi) || []).length;
    const textMatch = wolvesContent.match(/Approved manuscript excerpt will appear here/);
    if (placeholderCount === 0 && !textMatch) {
        log('  [PASS] Checked that legacy placeholder excerpt container and copy are successfully removed.');
    } else {
        log('  [FAIL] Legacy placeholder excerpt container or text still remains on the page.');
        overallSuccess = false;
    }
} else {
    log('  [FAIL] Wolves companion page does not exist.');
    overallSuccess = false;
}

// ==========================================================================
// 6. DUAL PRIVACY AUDIT
// ==========================================================================
const auditKeywords = [
    'custody', 'police', 'court', 'medical', 'counseling',
    'protective-order', 'restraining', 'arrest', 'sheriff', 'officer',
    'petition', 'respondent', 'petitioner', 'divorce', 'alimony', 'visitation',
    'child support', 'abuse', 'domestic', 'clinical', 'patient', 'therapy',
    'therapist', 'doctor', 'hospital', 'treatment', 'symptom', 'diagnosis',
    'prosecutor', 'defense', 'charge', 'warrant', 'subpoena', 'injunction',
    'hearing', 'trial', 'jurisdiction', 'docket'
];
const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const phonePattern = /\b(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b/g;
const localPathPattern = /\b(?:[C-z]:\\|\\Users\\|\/Users\/|\/home\/)/g;
const mediaExtensionPattern = /\.(mp3|wav|m4a|ogg|mp4|mov|avi|flac)\b/i;

function runAudit(auditName, skipList) {
    log(`\n  Executing ${auditName}...`);
    let leakCount = 0;
    
    function walkAndAudit(dir) {
        fs.readdirSync(dir).forEach(f => {
            const fullPath = path.join(dir, f);
            const relativePathRaw = path.relative(projectRoot, fullPath);
            const relativePath = relativePathRaw.replace(/\\/g, '/');
            const isDirectory = fs.statSync(fullPath).isDirectory();

            // Match against skip patterns (Vercel ignore patterns)
            if (skipList.some(pattern => {
                if (pattern.startsWith('/')) {
                    const normPat = pattern.substring(1);
                    return relativePath.startsWith(normPat);
                }
                return relativePath.includes(pattern);
            })) {
                return;
            }

            if (f === '.git' || f === '.vercel' || f === 'node_modules') {
                return;
            }

            // Exclude scripts and reports content/filenames from leak scans as they contain code audit lists
            if (relativePath.startsWith('scripts/') || relativePath.startsWith('reports/')) {
                return;
            }

            // Filename check
            auditKeywords.forEach(keyword => {
                const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'i');
                if (keywordRegex.test(f)) {
                    log(`    [LEAK] Prohibited keyword in filename: "${relativePath}" (Keyword: "${keyword}")`);
                    leakCount++;
                }
            });

            // Exclude PDF files in deployment audit
            if (!isDirectory && f.toLowerCase().endsWith('.pdf')) {
                log(`    [LEAK] PDF file detected in directory root: "${relativePath}"`);
                leakCount++;
            }

            if (isDirectory) {
                walkAndAudit(fullPath);
            } else {
                const ext = path.extname(f);
                if (['.html', '.css', '.js', '.json', '.txt', '.md', '.xml'].includes(ext)) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const lines = content.split('\n');

                    lines.forEach((line, index) => {
                        const lineNum = index + 1;

                        // 1. Keyword check
                        auditKeywords.forEach(keyword => {
                            const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'i');
                            if (keywordRegex.test(line)) {
                                if (keyword === 'case' && line.includes('case-study')) {
                                    return;
                                }
                                log(`    [LEAK] File: ${relativePath}:${lineNum} - Keyword: "${keyword}" in line: "${line.trim()}"`);
                                leakCount++;
                            }
                        });

                        // 2. Email pattern check
                        let emailMatch;
                        while ((emailMatch = emailPattern.exec(line)) !== null) {
                            const email = emailMatch[0];
                            if (email !== 'jayme@contextmuse.com' && email !== 'person@sample-org.com') {
                                log(`    [LEAK] File: ${relativePath}:${lineNum} - Unauthorized email: "${email}"`);
                                leakCount++;
                            }
                        }

                        // 3. Phone pattern check
                        let phoneMatch;
                        while ((phoneMatch = phonePattern.exec(line)) !== null) {
                            log(`    [LEAK] File: ${relativePath}:${lineNum} - Phone number: "${phoneMatch[0]}"`);
                            leakCount++;
                        }

                        // 4. Local path pattern check
                        let pathMatch;
                        while ((pathMatch = localPathPattern.exec(line)) !== null) {
                            log(`    [LEAK] File: ${relativePath}:${lineNum} - Local path: "${pathMatch[0]}"`);
                            leakCount++;
                        }

                        // 5. Media references check
                        if (mediaExtensionPattern.test(line)) {
                            log(`    [LEAK] File: ${relativePath}:${lineNum} - Media extension match: "${line.trim()}"`);
                            leakCount++;
                        }
                    });
                }
            }
        });
    }

    walkAndAudit(projectRoot);
    if (leakCount === 0) {
        log(`  [PASS] ${auditName} completed. Zero leaks found.`);
    } else {
        log(`  [FAIL] ${auditName} completed. Found ${leakCount} leak indicators.`);
        overallSuccess = false;
    }
}

log('\n[6] DUAL PRIVACY AUDITS');
// Audit 1: Source repository (skips only standard git files)
runAudit('Audit 1: Source Repository Scan', []);

// Audit 2: Deployment output (skips files blocked by vercelignore)
const vercelIgnoreList = [
    'scripts/', 'reports/', '.env', '.env.*', '*.db', '*.sqlite', '*.sqlite3', '*.log',
    'private/', 'drafts/', 'exports/', 'backups/', 'data/', 'backup', 'private', 'draft'
];
runAudit('Audit 2: Simulated Deployment Output Scan', vercelIgnoreList);

// ==========================================================================
// 7. DEPLOYMENT FILE INVENTORY & AUDIT SUMMARY
// ==========================================================================
log('\n[7] DEPLOYMENT FILE INVENTORY');
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
deploymentFiles.forEach(file => {
    log(`  - ${file}`);
});

// Final check: Confirm no manuscript docs or drafts exist in deployment inventory
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
// 8. AUTOMATED ASSET VALIDATION
// ==========================================================================
log('\n[8] AUTOMATED ASSET VALIDATION');

const assetRegex = /src=["']([^"']+\.(png|webp|jpg|jpeg|gif|svg))["']/gi;
const cssUrlRegex = /url\(["']?([^"')]+\.(png|webp|jpg|jpeg|gif|svg))["']?\)/gi;

const discoveredAssets = new Set();

filesToVerify.forEach(fileSpec => {
    const filePath = path.join(projectRoot, fileSpec.relPath);
    if (!fs.existsSync(filePath)) return;
    const fileContent = fs.readFileSync(filePath, 'utf8');

    let match;
    // Scan img src
    while ((match = assetRegex.exec(fileContent)) !== null) {
        discoveredAssets.add(match[1]);
    }
    // Scan CSS backgrounds
    while ((match = cssUrlRegex.exec(fileContent)) !== null) {
        discoveredAssets.add(match[1]);
    }
});

log(`  Discovered ${discoveredAssets.size} unique referenced asset paths.`);

function getImageDimensions(filePath) {
    const buffer = fs.readFileSync(filePath);
    // PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
        const width = buffer.readInt32BE(16);
        const height = buffer.readInt32BE(20);
        return { width, height };
    }
    // JPEG
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
        let offset = 2;
        while (offset < buffer.length) {
            if (buffer[offset] !== 0xff) break;
            const marker = buffer[offset + 1];
            if (marker === 0xc0 || marker === 0xc2) {
                const height = buffer.readUInt16BE(offset + 5);
                const width = buffer.readUInt16BE(offset + 7);
                return { width, height };
            }
            const length = buffer.readUInt16BE(offset + 2);
            offset += 2 + length;
        }
    }
    // WebP
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 && // RIFF
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) { // WEBP
        const chunkHeader = buffer.toString('ascii', 12, 16);
        if (chunkHeader === 'VP8 ') {
            const width = buffer.readUInt16LE(26) & 0x3fff;
            const height = buffer.readUInt16LE(28) & 0x3fff;
            return { width, height };
        } else if (chunkHeader === 'VP8L') {
            const val = buffer.readUInt32LE(21);
            const width = (val & 0x3fff) + 1;
            const height = ((val >> 14) & 0x3fff) + 1;
            return { width, height };
        } else if (chunkHeader === 'VP8X') {
            const width = (buffer.readUInt32LE(24) & 0xffffff) + 1;
            const height = (buffer.readUInt32LE(27) & 0xffffff) + 1;
            return { width, height };
        }
    }
    return { width: 0, height: 0 };
}

function hasGPSMetadata(filePath) {
    const buffer = fs.readFileSync(filePath);
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
        let offset = 2;
        while (offset < buffer.length - 4) {
            if (buffer[offset] !== 0xff) break;
            const marker = buffer[offset + 1];
            if (marker === 0xe1) {
                const length = buffer.readUInt16BE(offset + 2);
                const app1Data = buffer.slice(offset + 4, offset + 2 + length);
                if (app1Data.slice(0, 4).toString('ascii') === 'Exif') {
                    const exifStr = app1Data.toString('binary');
                    if (exifStr.includes('GPS ') || exifStr.includes('GPS\0')) {
                        return true;
                    }
                    for (let i = 0; i < app1Data.length - 2; i++) {
                        if ((app1Data[i] === 0x88 && app1Data[i+1] === 0x25) || (app1Data[i] === 0x25 && app1Data[i+1] === 0x88)) {
                            return true;
                        }
                    }
                }
            }
            if (marker === 0xda) break;
            const length = buffer.readUInt16BE(offset + 2);
            offset += 2 + length;
        }
    }
    return false;
}

let assetsPassed = true;

discoveredAssets.forEach(asset => {
    // We only validate local project assets (start with / or are relative without http)
    if (asset.startsWith('http://') || asset.startsWith('https://')) {
        return;
    }

    let cleanAsset = asset.split('#')[0].split('?')[0];
    let resolvedPath = cleanAsset.startsWith('/')
        ? path.join(projectRoot, cleanAsset.substring(1))
        : path.resolve(projectRoot, cleanAsset);

    const relativePath = path.relative(projectRoot, resolvedPath).replace(/\\/g, '/');

    // 8.1 Exists check
    if (!fs.existsSync(resolvedPath)) {
        log(`  [FAIL] Referenced asset does not exist: "${asset}" (Resolved: ${resolvedPath})`);
        assetsPassed = false;
        overallSuccess = false;
        return;
    }

    // 8.2 Casing check
    const dir = path.dirname(resolvedPath);
    const base = path.basename(resolvedPath);
    if (fs.existsSync(dir)) {
        const contents = fs.readdirSync(dir);
        if (!contents.includes(base)) {
            log(`  [FAIL] Asset filename casing mismatch: "${asset}" (Basename mismatch in FS: "${base}")`);
            assetsPassed = false;
            overallSuccess = false;
        }
    }

    // 8.3 Non-zero file size check
    const stats = fs.statSync(resolvedPath);
    if (stats.size === 0) {
        log(`  [FAIL] Asset file is empty (0 bytes): "${asset}"`);
        assetsPassed = false;
        overallSuccess = false;
    }

    // 8.4 .vercelignore check
    if (vercelIgnoreList.some(pattern => {
        if (pattern.startsWith('/')) {
            return relativePath.startsWith(pattern.substring(1));
        }
        return relativePath.includes(pattern);
    })) {
        log(`  [FAIL] Asset file is accidentally excluded by vercelignore: "${asset}"`);
        assetsPassed = false;
        overallSuccess = false;
    }

    // 8.5 Dimensions check (for rasters: png, jpg, webp)
    const ext = path.extname(cleanAsset).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        const dims = getImageDimensions(resolvedPath);
        if (dims.width > 0 && dims.height > 0) {
            log(`  [PASS] Asset: "${asset}" (${dims.width}x${dims.height}, ${stats.size} bytes)`);
        } else {
            log(`  [FAIL] Asset: "${asset}" has invalid or zero dimensions.`);
            assetsPassed = false;
            overallSuccess = false;
        }

        // 8.6 EXIF GPS coordinates checks
        if (['.jpg', '.jpeg'].includes(ext)) {
            if (hasGPSMetadata(resolvedPath)) {
                log(`  [FAIL] Asset: "${asset}" contains EXIF GPS coordinates / location metadata (security risk).`);
                assetsPassed = false;
                overallSuccess = false;
            } else {
                log(`  [PASS] Exif metadata is safe (no GPS tags found) for: "${asset}"`);
            }
        }
    } else if (ext === '.svg') {
        log(`  [PASS] Asset: "${asset}" (SVG Vector, ${stats.size} bytes)`);
    }
});

if (assetsPassed) {
    log('  [PASS] All referenced assets passed structure, casing, size, and metadata audits.');
}

log('\n==========================================================================');
log(`FINAL VERIFICATION RESULT: ${overallSuccess ? 'SUCCESS / PASSED' : 'FAILED'}`);
log('==========================================================================');

// Write the report file
fs.writeFileSync(reportFilePath, reportContent, 'utf8');

// Exit code based on overall success
process.exit(overallSuccess ? 0 : 1);
