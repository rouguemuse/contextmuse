const fs = require('fs');
const path = require('path');

const targetNav = `<nav class="navbar" aria-label="Main Navigation">
        <div class="container nav-container">
            <a href="/" class="logo" style="display:flex;align-items:center;gap:9px;"><img src="/assets/images/contextmuse_logo.svg" alt="" aria-hidden="true" style="width:22px;height:22px;flex-shrink:0;display:block;"><span>Context &amp; Muse</span></a>
            <input type="checkbox" id="nav-toggle" class="nav-toggle" style="display: none;">
            <label for="nav-toggle" class="nav-toggle-label" aria-label="Toggle Menu">
                <span></span>
            </label>
            <div class="nav-links">
                <a href="/websites/" class="nav-link">Websites</a>
                <a href="/audit/" class="nav-link">Site Audit</a>
                <a href="/work/" class="nav-link">Work</a>
                <a href="/services/" class="nav-link">Services</a>
                <a href="/about/" class="nav-link">About</a>
                <a href="/start/" class="nav-cta btn-magnetic">Start a Project</a>
            </div>
        </div>
    </nav>`;

function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!fullPath.includes('.vercel') && !fullPath.includes('.agents') && !fullPath.includes('node_modules')) {
                results = results.concat(getHtmlFiles(fullPath));
            }
        } else if (file.endsWith('.html')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = getHtmlFiles(process.cwd());
let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('<nav class="navbar"') && !file.includes('partials')) {
        const navRegex = /<nav class="navbar"[\s\S]*?<\/nav>/;
        content = content.replace(navRegex, targetNav);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated navbar in: ${path.relative(process.cwd(), file)}`);
        count++;
    }
});
console.log(`Standardized navbar across ${count} HTML files.`);
