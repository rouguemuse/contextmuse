/**
 * Context & Muse canonical shell.
 * Run: npm run sync:shell
 * Check: npm run check:shell
 *
 * Config: config/site.json. Generated partials: partials/nav.html and partials/footer.html.
 * Only normal site pages with BOTH the .navbar and .site-footer are updated.
 * Independent project microsites and interactive standalone demos are intentionally excluded.
 * This script intentionally does not touch forms, payment code, the protected lead API or CSS.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = JSON.parse(fs.readFileSync(path.join(root,"config","site.json"),"utf8"));
const checking = process.argv.includes("--check");
const html = v => String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");

function renderNav() {
  const items = site.primary_navigation.map(item => {
    if (!item.children) return '      <a class="nav-link" href="'+html(item.href)+'">'+html(item.label)+'</a>';
    return '      <details class="nav-dropdown" name="nav-dropdowns">\n'
      + '        <summary class="nav-link">'+html(item.label)+' <span class="nav-dropdown-arrow" aria-hidden="true">▾</span></summary>\n'
      + '        <div class="nav-dropdown-content"><a class="nav-dropdown-link" href="'+html(item.href)+'">'+html(item.label)+' Overview</a>'
      + item.children.map(c=>'<a class="nav-dropdown-link" href="'+html(c.href)+'">'+html(c.label)+'</a>').join("")+'</div>\n'
      + '      </details>';
  }).join("\n");
  return '<!-- CXM:SHARED_NAV_START -->\n'
    +'<nav class="navbar cxm-shared-nav" aria-label="Main Navigation">\n'
    +'  <div class="container nav-container">\n'
    +'    <a href="/" class="logo" style="display:flex;align-items:center;gap:9px;text-decoration:none"><img class="brand-mark" src="'+html(site.brand.logo)+'" alt="" aria-hidden="true" style="width:22px;height:22px;flex-shrink:0"><span>Context &amp; Muse</span></a>\n'
    +'    <button class="nav-toggle" id="nav-toggle-btn" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="primary-nav-links"><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span></button>\n'
    +'    <div class="nav-links" id="primary-nav-links">\n'
    +items+'\n'
    +'      <a class="nav-cta btn-magnetic" href="'+html(site.primary_cta.href)+'">'+html(site.primary_cta.label)+'</a>\n'
    +'    </div>\n'
    +'  </div>\n'
    +'</nav>\n'
    +'<!-- CXM:SHARED_NAV_END -->';
}
function renderFooter() {
  const cols=site.footer_columns.map(c=>'      <div class="footer-col"><div class="footer-col-title">'+html(c.title)+'</div>'+c.links.map(l=>'<a class="footer-link" href="'+html(l.href)+'">'+html(l.label)+'</a>').join("")+'</div>').join("\n");
  return '<!-- CXM:SHARED_FOOTER_START -->\n'
    +'<footer class="site-footer cxm-shared-footer" role="contentinfo">\n'
    +'  <div class="container footer-container">\n'
    +'    <div class="footer-brand"><a class="logo" href="/"><img class="brand-mark" src="'+html(site.brand.logo)+'" alt="" aria-hidden="true" style="width:20px;height:20px"><span>Context &amp; Muse</span></a><p class="footer-tagline">'+html(site.brand.tagline)+' Founder-led and independent.</p><div class="footer-copyright">&copy; 2026 Context &amp; Muse. All rights reserved.</div></div>\n'
    +'    <div class="footer-links-grid">\n'+cols+'\n    </div>\n'
    +'  </div>\n'
    +'</footer>\n'
    +'<!-- CXM:SHARED_FOOTER_END -->';
}
const nav=renderNav(),footer=renderFooter();
const parts=[["partials/nav.html",nav+"\n"],["partials/footer.html",footer+"\n"]];
for(const [p,value] of parts){const dest=path.join(root,p);const prev=fs.existsSync(dest)?fs.readFileSync(dest,"utf8"):"";if(prev!==value){if(!checking)fs.writeFileSync(dest,value,"utf8");console.log((checking?"DRIFT ":"SYNC  ")+p)}}

const excluded=new Set([".git",".vercel","node_modules","partials","archive","qa_output","preview","rudyards-comedy","sixes-and-sevens","southern_smoke","cxm_gensort","istar-map","star-gift","dealsignal","tiktok-shop-roi-analyzer","inncontrol-v2"]);
const standalone=new Set(["creative/interaction-lab/index.html","creative/cellular-scroll-study/index.html"]);
const navRe=/<nav\b[^>]*class="[^"]*\bnavbar\b[^"]*"[^>]*>[\s\S]*?<\/nav>/i;
const footerRe=/<footer\b[^>]*class="[^"]*\bsite-footer\b[^"]*"[^>]*>[\s\S]*?<\/footer>/i;
const navMarked=/<!-- CXM:SHARED_NAV_START -->[\s\S]*?<!-- CXM:SHARED_NAV_END -->/i;
const footerMarked=/<!-- CXM:SHARED_FOOTER_START -->[\s\S]*?<!-- CXM:SHARED_FOOTER_END -->/i;
function allHtml(dir){let out=[];for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.isDirectory()&&!excluded.has(e.name))out.push(...allHtml(path.join(dir,e.name)));else if(e.isFile()&&e.name.endsWith(".html"))out.push(path.join(dir,e.name))}return out}
let changed=0,skipped=0,checked=0,missingScripts=[];
for(const file of allHtml(root)){
 const relative=path.relative(root,file).replaceAll(path.sep,"/");
 if(standalone.has(relative))continue;
 let text=fs.readFileSync(file,"utf8"),old=text;
 if(!navRe.test(text)||!footerRe.test(text)){skipped++;continue}
 checked++;
 text=(navMarked.test(text)?text.replace(navMarked,nav):text.replace(navRe,nav));
 text=(footerMarked.test(text)?text.replace(footerMarked,footer):text.replace(footerRe,footer));
 if(!text.includes('/assets/js/nav.js'))text=text.replace('</body>','<script src="/assets/js/nav.js" defer></script>\n</body>');
 if(text!==old){changed++;if(!checking)fs.writeFileSync(file,text,"utf8");console.log((checking?"DRIFT ":"SYNC  ")+relative)}
 if(!text.includes("/assets/js/nav.js"))missingScripts.push(relative);
}
console.log(JSON.stringify({mode:checking?"check":"write",checked,changed,skipped,missingScripts}));
if(checking&&(changed>0||parts.some(([p,v])=>fs.readFileSync(path.join(root,p),"utf8")!==v)))process.exitCode=1;
