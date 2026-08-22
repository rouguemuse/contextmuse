import fs from 'fs';
import path from 'path';

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (file !== '.git' && file !== 'node_modules' && file !== 'brain') {
                getFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = getFiles('.');
console.log('--- RUNNING COMPREHENSIVE QA AUDIT ON ' + htmlFiles.length + ' HTML FILES ---');

let issueCount = 0;

// 1. Heading hierarchy & H1 check
console.log('\n[1] H1 & Heading Hierarchy Audit:');
for (const f of htmlFiles) {
    const content = fs.readFileSync(f, 'utf8');
    const h1s = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    if (h1s.length === 0) {
        console.log(`  [WARN] ${f}: Missing <h1> tag`);
        issueCount++;
    } else if (h1s.length > 1) {
        console.log(`  [WARN] ${f}: Multiple <h1> tags (${h1s.length})`);
        issueCount++;
    }
}

// 2. Forms Audit
console.log('\n[2] Forms Audit:');
for (const f of htmlFiles) {
    const content = fs.readFileSync(f, 'utf8');
    const forms = content.match(/<form[\s\S]*?<\/form>/gi) || [];
    if (forms.length > 0) {
        forms.forEach((form, idx) => {
            const hasAction = /action=["']([^"']+)["']/i.test(form);
            const action = hasAction ? form.match(/action=["']([^"']+)["']/i)[1] : 'NONE';
            const hasHoneypot = form.includes('name="_gotcha"');
            const hasEmail = form.includes('type="email"') || form.includes('name="email"');
            console.log(`  ${f} (Form ${idx+1}): Action=${action} | Honeypot=${hasHoneypot} | EmailField=${hasEmail}`);
        });
    }
}

// 3. Images and Alt Attributes
console.log('\n[3] Images Alt Text Audit:');
let missingAltCount = 0;
for (const f of htmlFiles) {
    const content = fs.readFileSync(f, 'utf8');
    const imgTags = content.match(/<img[^>]+>/gi) || [];
    imgTags.forEach(img => {
        if (!img.includes('alt=')) {
            console.log(`  [WARN] ${f}: <img> missing alt attribute: ${img}`);
            missingAltCount++;
            issueCount++;
        }
    });
}
if (missingAltCount === 0) {
    console.log('  [PASS] All <img> tags across all HTML files have an alt attribute.');
}

// 4. Internal Links Audit
console.log('\n[4] Internal Links Audit:');
let brokenLinkCount = 0;
for (const f of htmlFiles) {
    const content = fs.readFileSync(f, 'utf8');
    const linkMatches = content.match(/href=["']([^"']+)["']/gi) || [];
    linkMatches.forEach(lm => {
        const href = lm.match(/href=["']([^"']+)["']/i)[1];
        if (href.startsWith('/') && !href.startsWith('//')) {
            // Internal path
            const cleanPath = href.split('#')[0].split('?')[0];
            if (cleanPath !== '/' && cleanPath !== '') {
                // Check if file or directory index exists
                const directFile = path.join('.', cleanPath);
                const indexFile = path.join('.', cleanPath, 'index.html');
                const htmlFile = path.join('.', cleanPath + '.html');
                if (!fs.existsSync(directFile) && !fs.existsSync(indexFile) && !fs.existsSync(htmlFile)) {
                    console.log(`  [FAIL] ${f}: Broken internal link -> "${href}" (resolved: ${cleanPath})`);
                    brokenLinkCount++;
                    issueCount++;
                }
            }
        }
    });
}
if (brokenLinkCount === 0) {
    console.log('  [PASS] All internal links resolve to existing local paths/routes.');
}

console.log(`\nQA Audit Complete. Total detected issues: ${issueCount}`);
