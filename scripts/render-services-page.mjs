/**
 * Render authoritative Services page pricing from config/offers.json.
 * Run: npm run render:services
 * Check: npm run check:services
 * Does not change contact forms, payment systems or the locked lead backend.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const offers=JSON.parse(fs.readFileSync(path.join(root,'config/offers.json'),'utf8'));
const renderServices=function renderServices(o){
 const esc=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
 const dollar=n=>"$"+Number(n).toLocaleString("en-US");
 const list=arr=>"<ul>"+arr.map(s=>"<li>"+esc(s)+"</li>").join("")+"</ul>";
 const priceCard=(p,type)=>`<article class="cm-tier${p.featured?" is-featured":""}" id="${type}-${esc(p.id)}"><div class="cm-tier-top"><span class="cm-mono">${type==="site"?"WEBSITE BUILD":"MONTHLY CARE"} / ${esc(p.label)}</span>${p.featured?'<span class="cm-recommend">RECOMMENDED</span>':""}</div><h3>${esc(p.label)}</h3><div class="cm-price">${dollar(p.price)}<span> / ${type==="site"?"one-time":"month"}</span></div><p class="cm-subtitle">${esc(p.subtitle)}</p><p class="cm-intro">${esc(p.description)}</p><div class="cm-tier-features"><span class="cm-mono">INCLUDED</span>${list(p.features)}</div><div class="cm-excludes"><span class="cm-mono">SCOPE BOUNDARIES</span>${list(p.limits||p.exclusions)}</div><a class="cm-action ${p.featured?"cm-action-dark":"cm-action-light"}" href="${esc(p.href)}">${esc(p.cta||"Discuss this plan")} <span aria-hidden="true">↗</span></a></article>`;
 const offer=id=>o.offers.find(x=>x.id===id);
 const family=(key,icon,headline,desc,bullets,href,cta)=>`<article class="cm-family"><div class="cm-family-top"><span class="cm-family-icon" aria-hidden="true">${icon}</span><span class="cm-mono">${esc(key)}</span></div><h3>${esc(headline)}</h3><p>${esc(desc)}</p>${list(bullets)}<a href="${esc(href)}" class="cm-inline-link">${esc(cta)} <span aria-hidden="true">↗</span></a></article>`;
 const caseStudy=(tag,title,detail,image,link)=>`<article class="cm-proof-card"><a class="cm-proof-visual" href="${esc(link)}"><img src="${esc(image)}" alt="${esc(title)} portfolio preview" loading="lazy" width="900" height="600"></a><div class="cm-proof-copy"><span class="cm-mono">${esc(tag)}</span><h3>${esc(title)}</h3><p>${esc(detail)}</p><a class="cm-inline-link" href="${esc(link)}">See the system <span aria-hidden="true">↗</span></a></div></article>`;
 const free=offer("free-website-check"),diagnostic=offer("business-diagnostic"),custom=offer("operations-build");
 const report=offer("report-to-decisions"),ux=offer("website-ux-audit");
 const main=`<!-- CXM:GENERATED_SERVICES_START -->
<header class="cm-hero">
 <div class="container cm-hero-layout">
  <div class="cm-hero-copy">
   <div class="cm-breadcrumb"><a href="/">THE FOUR-SQUARE</a><span>/</span><a href="/services/">BUILD</a><span>/</span>SERVICES</div>
   <span class="cm-kicker">CONTEXT &amp; MUSE / WAYS TO WORK TOGETHER</span>
   <h1>Build the useful thing.<br><em>Keep it working.</em></h1>
   <p>Maybe you need a straightforward website. Maybe customers can't book, quotes live in spreadsheets, or reports aren't telling you what to fix. We make both the visible experience and the underlying workflow easier to use.</p>
   <div class="cm-hero-actions"><a class="cm-action cm-action-dark" href="#websites">Compare website packages <span aria-hidden="true">↓</span></a><a class="cm-action cm-action-light" href="/contact/">Describe your project <span aria-hidden="true">↗</span></a></div>
  </div>
  <aside class="cm-hero-side" aria-label="Browse service paths"><span class="cm-mono">CHOOSE THE PROBLEM / 04 PATHWAYS</span>
   <div class="cm-hero-paths">
   <a href="#websites"><span>01</span><strong>I need a website.</strong><small>Design, hosting, ongoing care</small><b aria-hidden="true">↗</b></a>
   <a href="#decisions"><span>02</span><strong>I need clear answers.</strong><small>Reports, audits, priorities</small><b aria-hidden="true">↗</b></a>
   <a href="#operations"><span>03</span><strong>I need the work to flow.</strong><small>Booking, systems, automation</small><b aria-hidden="true">↗</b></a>
   <a href="#creative-services"><span>04</span><strong>I need to make it compelling.</strong><small>Brand, content, creative systems</small><b aria-hidden="true">↗</b></a>
   </div>
   <a class="cm-hero-rail-link" href="/work/">Or see the real work first →</a>
  </aside>
 </div>
</header>
<main id="main-content" class="cm-services">
<section class="cm-section cm-section-head" id="websites">
 <div class="container">
  <div class="cm-header-row"><div><span class="cm-kicker">01 / THE WEBSITE BUILDS</span><h2>A useful website.<br>Without mystery pricing.</h2></div><p>Fixed-scope packages for normal small-business marketing websites. You own the deliverable. Hosting and ongoing care are separate.</p></div>
  <div class="cm-tiers">${o.website_packages.map(p=>priceCard(p,"site")).join("")}</div>
  <p class="cm-disclaimer"><strong>Where the line is:</strong> Contact forms and existing booking links are standard. Custom pricing logic, inventory availability, databases, payment flows, ZIP qualification and large multi-market page networks are <a href="#operations">custom systems</a>, not included in these prices.</p>
 </div>
</section>
<section class="cm-section cm-section-toned" id="care-plans">
 <div class="container">
  <div class="cm-header-row"><div><span class="cm-kicker">02 / HOSTING &amp; MAINTENANCE</span><h2>Keep the site healthy.<br>Not an unlimited retainer.</h2></div><p>Pick only the amount of support you need. Each plan covers one standard marketing site, not a custom application.</p></div>
  <div class="cm-tiers">${o.care_packages.map(p=>priceCard(p,"care")).join("")}</div>
  <div class="cm-terms"><div><strong>Before you subscribe</strong><p>Hosting is not editing. Maintenance is not a redesign. Work outside the stated allowance is quoted and approved first.</p></div><div class="cm-terms-grid"><span><b>$100/hr</b><small>Approved extras, 30-minute increments</small></span><span><b>30 days</b><small>Cancellation notice</small></span><span><b>Client-owned</b><small>Domain and approved site files</small></span></div></div>
  <p class="cm-disclaimer">Third-party subscriptions, domain renewal, email hosting, paid APIs, high-usage overages and custom application support are separate. “Response” means acknowledgement during business days. Existing care contracts are not automatically changed.</p>
 </div>
</section>
<section class="cm-section" id="decisions">
 <div class="container">
  <div class="cm-header-row"><div><span class="cm-kicker">03 / AUDITS &amp; DECISIONS</span><h2>You already have reports.<br>What do they mean?</h2></div><p>Bring the information you already collect. We turn it into a clear set of priorities, not another dashboard you won't use.</p></div>
  <div class="cm-family-grid">
   ${family("FREE ENTRY","↗","Website + System Check","Get a first-pass look at website messaging, customer pathways, and visible friction.",["Evidence-first automated review","No email required to see the result","Start with observable issues"],free.href,"Run the free check")}
   ${family("FIXED REVIEW","◫","Business System Diagnostic","A defined review of customer journeys, intake and operational constraints.",[dollar(diagnostic.price.amount)+" fixed price","Current offer: qualifying build credit within 30 days","Prioritized recommendations and next actions"],diagnostic.href,"Discuss a diagnostic")}
   ${family("SCOPED ANALYSIS","◎","Reports to Decisions","Have spreadsheets, POS exports or campaign reports? We'll interpret the existing information and rank actions.",["Review supplied records and gaps","Rank findings by potential significance","Document evidence, uncertainties and action plan"],report.href,"Scope a data readout")}
   ${family("EVIDENCE AUDIT","▤","Website & UX Audit","Go beyond an automated score with an evidence-backed usability and conversion review.",["Page-specific observations","Implementation-oriented repairs","Clear distinction between fact and inference"],ux.href,"View the audit system")}
  </div>
 </div>
</section>
<section class="cm-section cm-section-toned" id="operations">
 <div class="container">
  <div class="cm-header-row"><div><span class="cm-kicker">04 / SYSTEMS THAT DO WORK</span><h2>When a website<br>needs to do more.</h2></div><p>These aren't standard website upgrades. They're software and workflow engagements with their own rules, integrations, testing and support requirements.</p></div>
  <div class="cm-proof-grid">
   ${caseStudy("LOCAL SEO + QUALIFICATION","Lone Wolf Dumpsters","ZIP and territory qualification, sizing, differentiated customer intake and a 48-market landing-page network.","/assets/images/lonewolf-screenshot.webp","/work/lone-wolf-dumpsters/")}
   ${caseStudy("BOOKING + INVENTORY","EDR Party Rentals","Date and delivery qualification, bilingual catalog, package logic and finite-asset reservation workflow.","/assets/images/edrpartyrentals-screenshot.webp","/case-studies/edr-party-rentals/")}
   ${caseStudy("PRIVATE OPERATIONAL TOOLS","INNcontrol Coils","Commercial website paired with private field-scoping and estimation tools. Client-restricted features are not publicly exposed.","/assets/images/inncontrol-screenshot.webp","/systems/client-builds/#inncontrol")}
  </div>
  <div class="cm-custom-strip"><div><span class="cm-kicker">CUSTOM SYSTEM ENGAGEMENT</span><h3>From ${dollar(custom.price.amount)} for scoped operations builds</h3><p>Qualifying flows, booking or inventory logic, internal portals, calculators, reporting, or integrations. Complex projects require a proposal rather than a fixed website package.</p></div><a class="cm-action cm-action-light" href="${esc(custom.href)}">Explore custom systems <span aria-hidden="true">↗</span></a></div>
 </div>
</section>
<section class="cm-section" id="creative-services">
 <div class="container">
  <div class="cm-header-row"><div><span class="cm-kicker">05 / BRAND + HOSPITALITY + CONTENT</span><h2>Useful things need<br>a clear point of view.</h2></div><p>Not every project needs custom software. Sometimes the value is a brand that holds together, a document that communicates, or an experienced reading of service operations.</p></div>
  <div class="cm-family-grid cm-family-grid-three">
   ${family("CREATIVE SYSTEMS","✳","Brand + business documents","Business identities, proposal decks, branded documents, service menus and reusable content systems.",["Brand direction and coherent assets","Editable business documents and templates","Scoped copy and presentation work"],"/creative/","Explore creative work")}
   ${family("MARKETING","▦","Social content systems","Campaign assets, content structures and publishing workflows, with responsibilities agreed upfront.",["Creative strategy and templates","Production-ready graphics and messaging","Posting, ad spend and community management quoted separately"],"/contact/?service=marketing","Discuss a content system")}
   ${family("OPERATIONS EXPERIENCE","⌁","Restaurant + hospitality consulting","A perspective grounded in staffing, service, menus, margins, POS workflows and guest behavior.",["Menu and margin questions","Operational reviews and prioritized actions","Catering and restaurant system builds"],"/restaurant-systems/","Explore hospitality services")}
  </div>
  <div class="cm-narrative"><div><span class="cm-mono">BOOKS + STORYTELLING</span><h3>Bring an unusual idea into the world.</h3><p>Visual worlds for books, author sites, narrative identities and interactive creative experiences. Scoped as creative projects, not standard marketing websites.</p></div><a class="cm-action cm-action-light" href="/creative/">See the creative practice <span aria-hidden="true">↗</span></a></div>
 </div>
</section>
<section class="cm-section cm-section-lab">
 <div class="container cm-lab-row"><div><span class="cm-kicker">PRODUCTS ARE NOT CUSTOM SERVICES</span><h2>Need something ready-made?</h2><p>Signal, GenSort, reusable templates, calculators, experimental interfaces and Field Notes live in The Lab. Only available products are offered for purchase; experiments are clearly labeled.</p></div><a class="cm-action cm-action-dark" href="/lab/">Explore The Lab <span aria-hidden="true">↗</span></a></div>
</section>
<section class="cm-section cm-section-close">
 <div class="container"><div class="cm-close-grid"><div><span class="cm-kicker">YOUR NEXT MOVE</span><h2>Not sure where to start?</h2><p>If you have a specific build in mind, tell us. If you're not sure which problem matters most, start with the free website check or a focused diagnostic. Nobody needs to buy a full system just to ask a question.</p></div><div class="cm-close-actions"><a class="cm-action cm-action-dark" href="/contact/">Tell us what you need <span aria-hidden="true">↗</span></a><a class="cm-action cm-action-light" href="/website-system-check/">Run free website check <span aria-hidden="true">↗</span></a><a href="/" class="cm-inline-link">← Back to the four-square home</a></div></div></div>
</section>
</main>
<!-- CXM:GENERATED_SERVICES_END -->`;
const css=`<style id="cxm-v2-services-styles">
.cm-services,.cm-hero{--cm-ink:#11110d;--cm-muted:#62635c;--cm-line:#deded8;--cm-panel:#f7f7f4;--cm-forest:#0e1f1b;--cm-teal:#0f766e;--cm-gold:#c5a059;color:var(--cm-ink)}
.cm-services *, .cm-hero *{box-sizing:border-box}
.cm-services a:focus-visible,.cm-hero a:focus-visible{outline:3px solid var(--cm-teal);outline-offset:4px}
.cm-kicker,.cm-mono{font-family:var(--font-mono,monospace);font-weight:700;letter-spacing:.11em;line-height:1.5;text-transform:uppercase;font-size:10px}
.cm-kicker{color:var(--cm-teal)}
.cm-hero{background:#f7f7f3;border-bottom:1px solid var(--cm-line);padding:clamp(70px,8vw,120px) 0 clamp(42px,5vw,74px)}
.cm-hero-layout{display:grid;grid-template-columns:1.12fr .88fr;gap:clamp(30px,5vw,90px);align-items:stretch}
.cm-breadcrumb{display:flex;gap:11px;align-items:center;font:600 10px var(--font-mono,monospace);color:var(--cm-muted);letter-spacing:.05em;margin-bottom:clamp(30px,5vw,60px)}
.cm-breadcrumb a{color:var(--cm-muted);text-decoration:none}.cm-breadcrumb a:hover{text-decoration:underline}
.cm-hero h1{font-family:Georgia,serif;font-weight:400;font-size:clamp(43px,5.2vw,79px);line-height:1.05;letter-spacing:-.04em;margin:14px 0 26px;max-width:780px}
.cm-hero h1 em{color:#92554d;font-weight:400}
.cm-hero-copy>p{font-size:17px;line-height:1.75;color:var(--cm-muted);max-width:590px}
.cm-hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}
.cm-action{display:inline-flex;align-items:center;justify-content:space-between;gap:24px;padding:13px 17px;border:1px solid var(--cm-forest);font:700 11px var(--font-mono,monospace);text-decoration:none;white-space:normal;line-height:1.3;min-height:48px;transition:background .15s,color .15s,border .15s}
.cm-action-dark{background:var(--cm-forest);color:#fff}.cm-action-dark:hover{background:#204940;color:#fff}
.cm-action-light{background:transparent;color:var(--cm-forest)}.cm-action-light:hover{background:#e8eeea;color:var(--cm-forest)}
.cm-hero-side{padding:29px;background:#102b25;color:#f4f6f3;display:flex;flex-direction:column;gap:20px;border:1px solid #345049;min-width:0}
.cm-hero-side>.cm-mono{color:#b5d0be}.cm-hero-paths{border-top:1px solid #ffffff2b}.cm-hero-paths a{display:grid;grid-template-columns:25px 1fr 20px;gap:4px 8px;align-items:center;padding:16px 0;text-decoration:none;color:#fff;border-bottom:1px solid #ffffff2b}
.cm-hero-paths a:hover{color:#d8c5a0}.cm-hero-paths a>span{font:10px var(--font-mono,monospace);color:#aac2b9}.cm-hero-paths strong{font-size:15px;font-weight:600}.cm-hero-paths small{grid-column:2;grid-row:2;font-size:11px;color:#c2d4cb}.cm-hero-paths b{grid-column:3;grid-row:1/3;font-size:20px;font-weight:400}
.cm-hero-rail-link{font:600 11px var(--font-mono,monospace);color:#e1d3b9;text-decoration:none}
.cm-services{background:#fff}.cm-section{padding:clamp(66px,7vw,112px) 0}.cm-section-toned{background:#f7f7f4}.cm-section-head{border-top:0}
.cm-header-row{display:flex;align-items:end;justify-content:space-between;gap:30px;margin-bottom:32px}.cm-header-row>div{flex:1}.cm-header-row>p{max-width:410px;font-size:14px;line-height:1.7;color:var(--cm-muted);margin:0 0 7px}
.cm-header-row h2,.cm-lab-row h2,.cm-close-grid h2{font:400 clamp(35px,4vw,60px)/1.1 Georgia,serif;letter-spacing:-.035em;margin:12px 0 0}
.cm-tiers{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}
.cm-tier{border:1px solid var(--cm-line);padding:25px;display:flex;flex-direction:column;min-width:0;background:#fff}
.cm-tier.is-featured{border:2px solid var(--cm-forest);padding:24px;box-shadow:0 10px 35px #0e1f1b0a}
.cm-tier-top{min-height:22px;display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.cm-tier-top>.cm-mono{color:var(--cm-teal);font-size:9px}
.cm-recommend{font:700 9px var(--font-mono,monospace);letter-spacing:.06em;background:#e5eee8;color:#0e1f1b;padding:6px}
.cm-tier h3{font:400 29px Georgia,serif;margin:26px 0 9px}
.cm-price{font-size:clamp(34px,3vw,50px);letter-spacing:-.05em;font-weight:700}.cm-price span{font:11px var(--font-mono,monospace);color:var(--cm-muted);letter-spacing:0}
.cm-subtitle{font-size:13px;color:var(--cm-teal);font-weight:700;margin:12px 0 5px}.cm-intro{font-size:12.5px;line-height:1.8;color:var(--cm-muted);min-height:64px}
.cm-tier-features{padding-top:20px;margin-top:14px;border-top:1px solid var(--cm-line)}.cm-tier-features>.cm-mono,.cm-excludes>.cm-mono{color:var(--cm-teal);font-size:9px}
.cm-tier ul,.cm-family ul{padding-left:19px;margin:10px 0 22px}.cm-tier li,.cm-family li{margin-bottom:10px;font-size:12px;line-height:1.6}.cm-excludes{border-top:1px solid var(--cm-line);padding-top:17px;margin-top:auto}.cm-excludes li{color:var(--cm-muted);font-size:11.5px}
.cm-tier>.cm-action{margin-top:16px}
.cm-disclaimer{border-top:1px solid var(--cm-line);padding-top:22px;margin:25px 0 0;color:var(--cm-muted);font-size:12px;line-height:1.8}.cm-disclaimer a{color:var(--cm-teal);text-underline-offset:2px}
.cm-terms{display:grid;grid-template-columns:.8fr 1.2fr;gap:35px;padding:28px;background:#ebefe9;margin-top:18px;border-left:3px solid var(--cm-teal)}.cm-terms strong{font-size:15px}.cm-terms p{font-size:12px;color:var(--cm-muted);line-height:1.7;margin:10px 0 0}
.cm-terms-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;align-items:center}.cm-terms-grid span{display:flex;flex-direction:column;gap:8px}.cm-terms-grid b{font:700 22px var(--font-sans,sans-serif)}.cm-terms-grid small{font-size:10px;line-height:1.6;color:var(--cm-muted)}
.cm-family-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.cm-family-grid-three{grid-template-columns:repeat(3,minmax(0,1fr))}
.cm-family{display:flex;flex-direction:column;min-width:0;padding:25px;border:1px solid var(--cm-line);background:#fff}
.cm-family-top{display:flex;align-items:center;gap:12px}.cm-family-icon{border:1px solid var(--cm-line);width:35px;height:35px;display:grid;place-items:center;font-size:20px;color:var(--cm-teal)}.cm-family .cm-mono{color:var(--cm-teal);font-size:9px}
.cm-family h3{font:400 26px/1.15 Georgia,serif;margin:25px 0 12px;letter-spacing:-.02em}.cm-family>p{font-size:12px;line-height:1.7;color:var(--cm-muted);margin:0}.cm-family li{font-size:11px;color:#343934}.cm-family ul{margin-bottom:20px}
.cm-inline-link{font:700 11px var(--font-mono,monospace);color:var(--cm-teal);text-decoration:none;border-bottom:1px solid #a0c2b8;padding-bottom:6px;align-self:flex-start;margin-top:auto}.cm-inline-link:hover{color:var(--cm-forest);border-color:var(--cm-forest)}
.cm-proof-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.cm-proof-card{background:#fff;border:1px solid var(--cm-line);display:flex;flex-direction:column;min-width:0;overflow:hidden}
.cm-proof-visual{height:205px;display:block;background:#d8dbd6;overflow:hidden}.cm-proof-visual img{height:100%;width:100%;object-fit:cover;display:block;transition:transform .25s}.cm-proof-visual:hover img{transform:scale(1.02)}
.cm-proof-copy{padding:23px;display:flex;flex-direction:column;flex:1}.cm-proof-copy>.cm-mono{color:var(--cm-teal);font-size:9px}.cm-proof-copy h3{font:400 27px Georgia,serif;margin:15px 0 10px}.cm-proof-copy p{font-size:12px;color:var(--cm-muted);line-height:1.7;margin-bottom:20px}
.cm-custom-strip{display:flex;align-items:center;justify-content:space-between;gap:25px;margin-top:15px;background:#0e1f1b;color:#fff;padding:30px}.cm-custom-strip .cm-kicker{color:#a8cfba}.cm-custom-strip h3{font:400 30px Georgia,serif;margin:9px 0}.cm-custom-strip p{font-size:12px;color:#d0dbd5;max-width:620px;line-height:1.7;margin:0}.cm-custom-strip .cm-action{color:white;border-color:#e2ece6}.cm-custom-strip .cm-action:hover{color:#0e1f1b}
.cm-narrative{margin-top:14px;padding:31px;background:#f8f5ed;display:flex;align-items:center;justify-content:space-between;gap:30px}.cm-narrative h3{font:400 32px Georgia,serif;margin:12px 0}.cm-narrative p{font-size:12px;line-height:1.7;color:var(--cm-muted);max-width:620px}.cm-narrative>.cm-action{flex-shrink:0}
.cm-section-lab{background:#f0eee8}.cm-lab-row{display:flex;justify-content:space-between;align-items:center;gap:32px}.cm-lab-row>div{max-width:700px}.cm-lab-row p{color:var(--cm-muted);font-size:13px;line-height:1.7}
.cm-section-close{background:#fff}.cm-close-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:8vw;align-items:center}.cm-close-grid p{max-width:720px;color:var(--cm-muted);font-size:14px;line-height:1.7}.cm-close-actions{display:flex;flex-direction:column;align-items:stretch;gap:12px}.cm-close-actions .cm-inline-link{margin-top:5px}
@media(max-width:1120px){.cm-family-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.cm-tiers{gap:10px}.cm-tier{padding:19px}.cm-tier.is-featured{padding:18px}.cm-tier h3{font-size:25px}}
@media(max-width:820px){.cm-hero-layout{grid-template-columns:1fr}.cm-hero{padding-top:70px}.cm-hero-side{max-width:none}.cm-header-row{align-items:start;flex-direction:column;gap:9px}.cm-header-row>p{max-width:650px}.cm-tiers,.cm-proof-grid{grid-template-columns:1fr}.cm-tier{padding:24px}.cm-tier.is-featured{padding:23px}.cm-intro{min-height:0}.cm-proof-card{display:grid;grid-template-columns:40% 60%}.cm-proof-visual{height:100%;min-height:190px}.cm-terms{grid-template-columns:1fr}.cm-narrative,.cm-lab-row,.cm-custom-strip{flex-direction:column;align-items:flex-start}.cm-narrative>.cm-action{flex-shrink:1}}
@media(max-width:550px){.cm-hero h1{font-size:43px}.cm-hero-copy>p{font-size:15px}.cm-section{padding:55px 0}.cm-family-grid,.cm-family-grid-three{grid-template-columns:1fr}.cm-proof-card{display:flex}.cm-proof-visual{height:200px}.cm-terms-grid{grid-template-columns:1fr;gap:12px}.cm-terms-grid span{border-bottom:1px solid #cfd9cf;padding:8px 0}.cm-tier h3{font-size:29px}.cm-header-row h2{font-size:38px}.cm-narrative h3{font-size:30px}.cm-hero-paths strong{font-size:14px}}
@media(prefers-reduced-motion:reduce){.cm-services *,.cm-hero *{transition:none!important;scroll-behavior:auto!important}}
</style>`;
 return {main,css};
};
const generated=renderServices(offers);
const target=path.join(root,'services/index.html');
const original=fs.readFileSync(target,'utf8');
const start='<!-- CXM:GENERATED_SERVICES_START -->';
const end='<!-- CXM:GENERATED_SERVICES_END -->';
const area=new RegExp(start+'[\\s\\S]*?'+end);
const styleArea=/<style id="cxm-v2-services-styles">[\\s\\S]*?<\\/style>/;
if(!area.test(original)||!styleArea.test(original)){console.error('Services generated block or styles marker missing. No files modified.');process.exit(1)}
const updated=original.replace(area,generated.main).replace(styleArea,generated.css);
const check=process.argv.includes('--check');
if(check){if(updated!==original){console.error('DRIFT: services/index.html does not match config/offers.json');process.exitCode=1}else{console.log('PASS: Services page matches canonical offer configuration')}}
else{if(updated!==original){fs.writeFileSync(target,updated,'utf8');console.log('Updated Services page from config/offers.json')}else{console.log('Services page is already in sync')}}
