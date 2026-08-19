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
                <details class="nav-dropdown" name="nav-dropdowns">
                    <summary class="nav-link">Work <span class="nav-dropdown-arrow">▾</span></summary>
                    <div class="nav-dropdown-content">
                        <a href="/systems/" class="nav-dropdown-link">Featured Systems</a>
                        <a href="/systems/client-builds/" class="nav-dropdown-link">Client Builds</a>
                        <a href="/proof-of-work/" class="nav-dropdown-link">Proof of Work</a>
                    </div>
                </details>
                <details class="nav-dropdown" name="nav-dropdowns">
                    <summary class="nav-link">Products <span class="nav-dropdown-arrow">▾</span></summary>
                    <div class="nav-dropdown-content">
                        <a href="/signal/" class="nav-dropdown-link">Signal</a>
                        <a href="/gensort/" class="nav-dropdown-link">GenSort</a>
                    </div>
                </details>
                <details class="nav-dropdown" name="nav-dropdowns">
                    <summary class="nav-link">Services <span class="nav-dropdown-arrow">▾</span></summary>
                    <div class="nav-dropdown-content">
                        <a href="/custom/?service=audit#intake" class="nav-dropdown-link">Conversion Audit</a>
                        <a href="/custom/?service=funnel-sprint#intake" class="nav-dropdown-link">Funnels</a>
                        <a href="/systems/" class="nav-dropdown-link">Websites &amp; Systems</a>
                        <a href="/partners/" class="nav-dropdown-link">For Agencies</a>
                    </div>
                </details>
                <a href="/creative/" class="nav-link">Creative</a>
                <a href="/about/" class="nav-link">About</a>
                <a href="/custom/#intake" class="nav-cta btn-magnetic">Start a Project</a>
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
