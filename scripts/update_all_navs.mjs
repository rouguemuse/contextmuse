import fs from 'fs';
import path from 'path';

const navHtml = fs.readFileSync('partials/nav.html', 'utf8').trim();

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (file !== '.git' && file !== 'node_modules') {
                getFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const allHtml = getFiles('.');
console.log('Auditing and updating ' + allHtml.length + ' HTML files...');

let updatedCount = 0;

for (const f of allHtml) {
    let content = fs.readFileSync(f, 'utf8');
    let changed = false;

    // 1. Replace legacy nav with standard nav if present
    if (content.includes('<nav class="navbar"') || content.includes('<nav class=\'navbar\'')) {
        // Regex to replace from <nav class="navbar" to </nav>
        const navRegex = /<nav class=["']navbar["'][\s\S]*?<\/nav>/i;
        if (navRegex.test(content)) {
            content = content.replace(navRegex, navHtml);
            changed = true;
        }
    }

    // 2. SEO Title & Metadata Updates for specific routes
    const normPath = f.replace(/\\/g, '/');
    if (normPath === 'services/index.html') {
        content = content.replace(/<title>[\s\S]*?<\/title>/i, '<title>Website &amp; Business Systems Services | Context &amp; Muse</title>');
        content = content.replace(/<meta property=["']og:title["'] content=["'][^"']*["']>/i, '<meta property="og:title" content="Website &amp; Business Systems Services | Context &amp; Muse">');
        content = content.replace(/<meta name=["']twitter:title["'] content=["'][^"']*["']>/i, '<meta name="twitter:title" content="Website &amp; Business Systems Services | Context &amp; Muse">');
        changed = true;
    }

    if (normPath === 'custom/index.html') {
        content = content.replace(/<title>[\s\S]*?<\/title>/i, '<title>Custom Websites &amp; Operational Systems | Context &amp; Muse</title>');
        content = content.replace(/<meta property=["']og:title["'] content=["'][^"']*["']>/i, '<meta property="og:title" content="Custom Websites &amp; Operational Systems | Context &amp; Muse">');
        content = content.replace(/<meta name=["']twitter:title["'] content=["'][^"']*["']>/i, '<meta name="twitter:title" content="Custom Websites &amp; Operational Systems | Context &amp; Muse">');
        changed = true;
    }

    // 3. Remove "Operational Machinery" and "Pricing Ladder" from metadata
    if (content.includes('Operational Machinery') || content.includes('Pricing Ladder')) {
        content = content.replace(/Operational Machinery &amp; Web Systems/g, 'Custom Websites &amp; Operational Systems');
        content = content.replace(/Operational Machinery/g, 'Operational Systems');
        content = content.replace(/Pricing Ladder/g, 'Engagement Ladder');
        changed = true;
    }

    // 4. Update legacy CTA links: change /custom/#intake in nav-cta to /contact/
    if (content.includes('href="/custom/#intake" class="nav-cta')) {
        content = content.replace(/href="\/custom\/#intake" class="nav-cta/g, 'href="/contact/" class="nav-cta');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(f, content, 'utf8');
        console.log(' Updated: ' + f);
        updatedCount++;
    }
}

console.log('\\nTotal files updated: ' + updatedCount);
