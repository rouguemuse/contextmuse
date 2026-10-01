const fs = require('fs');
const path = require('path');

const rawPath = 'C:/Users/rougu/.gemini/antigravity/brain/c9fe95e3-68e1-478f-823b-4e2584b213be/scratch/seo_crawl_raw.json';
const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

function escapeMd(str) {
  if (!str) return '—';
  return String(str).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
}

function getClassification(item) {
  const p = item.routePath;
  if (p === '/404.html') {
    return {
      purpose: 'Custom 404 Error handler and route recovery',
      intent: 'Navigational error recovery',
      indexability: 'Non-indexable',
      robotsRec: 'noindex, follow',
      canonicalRec: '',
      dupRisk: 'Low',
      thinRisk: 'N/A (Error page)',
      searchValue: 'None',
      action: 'Enforce noindex, omit from sitemap'
    };
  }
  if (p.startsWith('/partials/')) {
    return {
      purpose: 'Server/client reusable HTML snippet component',
      intent: 'None (partial template)',
      indexability: 'Non-indexable',
      robotsRec: 'noindex, nofollow',
      canonicalRec: '',
      dupRisk: 'High (fragment snippet)',
      thinRisk: 'High',
      searchValue: 'None',
      action: 'Add noindex, nofollow tag, exclude from sitemap'
    };
  }
  if (p === '/contact/success/') {
    return {
      purpose: 'Lead submission post-conversion acknowledgment',
      intent: 'Post-action confirmation',
      indexability: 'Non-indexable',
      robotsRec: 'noindex, follow',
      canonicalRec: 'https://www.contextmuse.com/contact/success/',
      dupRisk: 'Low',
      thinRisk: 'Moderate',
      searchValue: 'None',
      action: 'Enforce noindex, follow, exclude from sitemap'
    };
  }
  if (p === '/preview/') {
    return {
      purpose: 'Client demonstration & staging portal',
      intent: 'Internal client work preview',
      indexability: 'Non-indexable',
      robotsRec: 'noindex, nofollow',
      canonicalRec: 'https://www.contextmuse.com/preview/',
      dupRisk: 'High (mirrors proof and work assets)',
      thinRisk: 'Low',
      searchValue: 'None (Private staging)',
      action: 'Enforce noindex, nofollow, exclude from sitemap'
    };
  }
  if (p === '/signal/demo/' || p === '/signal/export-instructions/' || p === '/demo-restaurant-signal-report.html') {
    return {
      purpose: 'Interactive demonstration & export reference for Signal',
      intent: 'Product walkthrough / utility',
      indexability: 'Non-indexable',
      robotsRec: 'noindex, follow',
      canonicalRec: 'https://www.contextmuse.com' + p,
      dupRisk: 'High (mirrors Signal report data)',
      thinRisk: 'Moderate',
      searchValue: 'Low (Utility demonstration)',
      action: 'Enforce noindex, follow to preserve Signal authority, exclude from sitemap'
    };
  }
  if (['/cxm_gensort/', '/dealsignal/', '/tiktok-shop-roi-analyzer/', '/wcsm/', '/star-gift/', '/istar-map/', '/southern_smoke/'].includes(p)) {
    return {
      purpose: 'Standalone computational tool or prototype experiment',
      intent: 'Specific utility / demonstration',
      indexability: 'Non-indexable',
      robotsRec: 'noindex, follow',
      canonicalRec: 'https://www.contextmuse.com' + p,
      dupRisk: 'Moderate',
      thinRisk: 'Moderate',
      searchValue: 'Low (Unfocused prototype)',
      action: 'Apply noindex, follow to prevent topical dilution, exclude from sitemap'
    };
  }
  if (p.startsWith('/sixes-and-sevens/') || p.startsWith('/rudyards-comedy/') || p === '/inncontrol-v2/') {
    return {
      purpose: 'Live interactive client build demonstration / architectural demo',
      intent: 'Demonstration / specimen verification',
      indexability: 'Non-indexable',
      robotsRec: 'noindex, follow',
      canonicalRec: 'https://www.contextmuse.com' + p,
      dupRisk: 'High (concept restaurant demo content)',
      thinRisk: 'Low',
      searchValue: 'Low (Client specimen)',
      action: 'Enforce noindex, follow; link from restaurant-builds/ case studies, exclude from sitemap'
    };
  }

  // Core Commercial Pages
  if (p === '/') {
    return {
      purpose: 'Studio Homepage: positioning, core capabilities, featured proof',
      intent: 'Commercial Investigation / Transactional (Custom software & web systems studio Austin TX)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'High (Primary studio hub)',
      action: 'Optimize metadata for technical agency / custom web systems, add Organization + WebSite JSON-LD'
    };
  }
  if (p === '/services/') {
    return {
      purpose: 'Services Overview: breakdown of bespoke software, intake systems, diagnostics',
      intent: 'Commercial (Software development services, intake systems, operations tooling)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/services/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'High (Core service category hub)',
      action: 'Add ProfessionalService schema, enhance service cluster cross-links'
    };
  }
  if (p === '/services/quote-lead-systems/') {
    return {
      purpose: 'Productized Service: High-conversion quote, estimate & lead intake architectures',
      intent: 'High Commercial / Transactional (Quote calculator development, contractor intake systems)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/services/quote-lead-systems/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'Very High (Primary inbound conversion asset)',
      action: 'Add Service JSON-LD, ensure H1 and meta description target commercial intake keywords'
    };
  }
  if (p === '/custom/') {
    return {
      purpose: 'Custom Operations Systems: workflow automation, internal portals, bespoke tooling',
      intent: 'Commercial (Bespoke operations software, custom workflow tooling)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/custom/',
      dupRisk: 'Moderate (differentiate from /systems/)',
      thinRisk: 'None',
      searchValue: 'High (Custom engineering intent)',
      action: 'Sharpen metadata to focus on operational workflows and internal portals vs core architecture'
    };
  }
  if (p === '/systems/') {
    return {
      purpose: 'Technical Systems Architecture: engineering standards, tech stack, infrastructure',
      intent: 'Informational / Commercial (Full-stack architecture, performant web engineering)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/systems/',
      dupRisk: 'Moderate (differentiate from /custom/)',
      thinRisk: 'None',
      searchValue: 'High (Engineering authority)',
      action: 'Optimize title and meta description around architecture, reliability, and full-stack software'
    };
  }
  if (p === '/systems/client-builds/') {
    return {
      purpose: 'Directory of verified client production builds and architectural deployments',
      intent: 'Commercial Investigation (Production web app portfolio, verified software builds)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/systems/client-builds/',
      dupRisk: 'Moderate (overlaps with /work/)',
      thinRisk: 'None',
      searchValue: 'High (Social & technical proof)',
      action: 'Position as engineering build directory with deep links to case studies'
    };
  }
  if (p === '/systems/resource-guide/') {
    return {
      purpose: 'Engineering & systems reference guide for clients and technical teams',
      intent: 'Informational (Software operations guide, web systems standards)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/systems/resource-guide/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'Moderate (Educational / Informational)',
      action: 'Retain in sitemap with clean canonical and TechArticle schema'
    };
  }
  if (p === '/systems/signal/') {
    return {
      purpose: 'Technical overview of the Signal Margin Diagnostic Engine',
      intent: 'Commercial / Informational (Margin diagnostic software, unit economics tooling)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/systems/signal/',
      dupRisk: 'Moderate (complements /signal/)',
      thinRisk: 'None',
      searchValue: 'Moderate (Technical product profile)',
      action: 'Ensure clear cross-link to /signal/ and distinct technical positioning'
    };
  }
  if (p === '/proof-of-work/') {
    return {
      purpose: 'Commercial Proof & Verification: code quality, load benchmarks, client receipts',
      intent: 'Commercial Investigation (Verified engineering proof, development case studies)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/proof-of-work/',
      dupRisk: 'Moderate (complements /work/)',
      thinRisk: 'None',
      searchValue: 'High (Trust & verification)',
      action: 'Add structured data and ensure high-authority cross-linking'
    };
  }
  if (p === '/work/') {
    return {
      purpose: 'Master Case Studies & Work Index',
      intent: 'Commercial Investigation (Web development portfolio, bespoke software case studies)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/work/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'High (Portfolio hub)',
      action: 'Ensure comprehensive collection page schema and bidirectional links to individual case studies'
    };
  }
  if (p === '/signal/') {
    return {
      purpose: 'Signal Margin Diagnostic Engine landing page and analysis platform',
      intent: 'Commercial / Transactional (Restaurant margin analysis, hospitality profit diagnostics)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/signal/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'Very High (Flagship diagnostic product)',
      action: 'Add SoftwareApplication / Service schema and optimize for margin diagnostic searches'
    };
  }
  if (p === '/signal/intake/') {
    return {
      purpose: 'Signal diagnostic intake assessment form',
      intent: 'Transactional (Start margin audit, diagnostic intake)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/signal/intake/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'Moderate (Conversion entrypoint)',
      action: 'Add clear canonical and link to main Signal page'
    };
  }
  if (p === '/signal/sample-reports/') {
    return {
      purpose: 'Signal Margin Diagnostic sample reports and benchmark data',
      intent: 'Commercial Investigation (Restaurant margin report examples, P&L audit samples)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/signal/sample-reports/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'Moderate (Proof of concept)',
      action: 'Ensure canonical and indexable'
    };
  }
  if (p === '/signal_restaurant_intelligence/') {
    return {
      purpose: 'Restaurant Operations & Margin Intelligence overview',
      intent: 'Commercial (Restaurant POS diagnostics, hospitality analytics)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/signal_restaurant_intelligence/',
      dupRisk: 'Moderate (links to /signal/)',
      thinRisk: 'None',
      searchValue: 'High (Niche hospitality intelligence)',
      action: 'Clarify differentiation from /signal/ as high-level restaurant intelligence solution'
    };
  }
  if (p === '/website-system-check/') {
    return {
      purpose: 'Free Website & Conversion Diagnostic intake and report tool',
      intent: 'Transactional / Lead Generation (Website performance check, conversion audit Austin)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/website-system-check/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'High (Top-of-funnel lead generator)',
      action: 'Add Service schema, optimize meta description for conversion audit'
    };
  }
  if (p === '/quick-launch/') {
    return {
      purpose: 'Rapid Production Deployment & Sprint Delivery offering',
      intent: 'Transactional / Commercial (Fast web development, 7-day website build)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/quick-launch/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'High (Urgent project intent)',
      action: 'Add Service schema with clear commercial scope'
    };
  }
  if (p === '/restaurant-systems/') {
    return {
      purpose: 'Hospitality & Restaurant Architecture: online ordering, POS integration, table engines',
      intent: 'Commercial (Restaurant software systems, hospitality tech stack)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/restaurant-systems/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'High (Hospitality vertical hub)',
      action: 'Add Service schema and cross-link to restaurant builds and theory'
    };
  }
  if (p === '/restaurant-builds/') {
    return {
      purpose: 'Index of Restaurant & Hospitality Systems Case Studies',
      intent: 'Commercial Investigation (Restaurant website examples, bar booking systems)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/restaurant-builds/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'High (Industry portfolio hub)',
      action: 'Add CollectionPage schema and strong links to specific restaurant builds'
    };
  }
  if (p.startsWith('/restaurant-builds/')) {
    return {
      purpose: 'Detailed hospitality build case study / architectural breakdown',
      intent: 'Commercial Investigation (Venue web systems, pizza ordering architecture)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com' + p,
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'Moderate (Specialized niche proof)',
      action: 'Add CreativeWork / Article schema and link to /restaurant-systems/'
    };
  }
  if (p === '/restaurant-theory/') {
    return {
      purpose: 'Thought Leadership Essay: The Menu Is an Interface',
      intent: 'Informational / Thought Leadership (Menu engineering interface design, hospitality psychology)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/restaurant-theory/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'Moderate (Topical authority & backlinks)',
      action: 'Add Article schema and link back to restaurant services'
    };
  }
  if (p === '/partners/') {
    return {
      purpose: 'White-Label & Technical Partner Program for agencies and design studios',
      intent: 'Commercial (Agency web development partner, white-label software engineering)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/partners/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'High (B2B Agency Partnership intent)',
      action: 'Add ProfessionalService schema, optimize meta description for agency partners'
    };
  }
  if (p === '/about/') {
    return {
      purpose: 'Studio Profile: background, engineering philosophy, Austin TX context',
      intent: 'Informational / Navigational (About Context & Muse, Austin software studio)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/about/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'High (Brand & entity authority)',
      action: 'Add AboutPage + Organization schema with Austin TX geographic presence'
    };
  }
  if (p === '/contact/') {
    return {
      purpose: 'Commercial Intake & Inquiry Portal',
      intent: 'Transactional / Navigational (Contact Context & Muse, hire web systems engineer)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/contact/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'High (Primary conversion destination)',
      action: 'Add ContactPage schema, ensure clean canonical and meta description'
    };
  }
  if (p === '/brand/') {
    return {
      purpose: 'Studio Brand Guide, typography, and aesthetic standards',
      intent: 'Informational (Brand guidelines, design system)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com/brand/',
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'Low (Brand reference)',
      action: 'Maintain canonical and clean metadata'
    };
  }

  // Case Studies & Products
  if (p.startsWith('/work/') || p.startsWith('/case-studies/') || p === '/gensort/') {
    return {
      purpose: 'Production Case Study / Proven System Showcase',
      intent: 'Commercial Investigation (Custom software case study, real client results)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com' + p,
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'High (High-intent proof of capability)',
      action: 'Ensure Article / CaseStudy schema, accurate canonical, and strong cross-links to services'
    };
  }

  // Creative & Literary Portfolios
  if (p.startsWith('/creative/') || p === '/cartography/') {
    return {
      purpose: 'Computational Literature, Creative Prose, and Cartography Works',
      intent: 'Informational (Creative writing, experimental cartography, generative literature)',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com' + p,
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'Moderate (Brand depth & creative differentiation)',
      action: 'Add CreativeWork schema, maintain canonicals'
    };
  }

  // Legal
  if (p === '/privacy/' || p === '/terms/') {
    return {
      purpose: 'Legal Policy / Governance documentation',
      intent: 'Informational / Legal compliance',
      indexability: 'Indexable',
      robotsRec: 'index, follow',
      canonicalRec: 'https://www.contextmuse.com' + p,
      dupRisk: 'Low',
      thinRisk: 'None',
      searchValue: 'Low (Compliance prerequisite)',
      action: 'Keep in sitemap with clean canonical'
    };
  }

  return {
    purpose: 'Supporting site route',
    intent: 'Informational',
    indexability: 'Indexable',
    robotsRec: 'index, follow',
    canonicalRec: 'https://www.contextmuse.com' + p,
    dupRisk: 'Low',
    thinRisk: 'None',
    searchValue: 'Low',
    action: 'Review and canonicalize'
  };
}

let doc = '# CONTEXT & MUSE — PHASE 4: SEO & DISCOVERY AUDIT\n\n';
doc += '**Date:** 2026-10-01  \n';
doc += '**Workspace:** `C:\\Users\\rougu\\.gemini\\antigravity\\scratch\\contextmuse-homepage`  \n';
doc += '**Production Domain:** `https://www.contextmuse.com`  \n';
doc += '**Scope:** All 64 public HTML files audited across directory tree before modifications.  \n\n';

doc += '## Executive Summary & Baseline Metrics\n\n';
doc += '| Metric | Baseline Value | Target Post-Phase 4 |\n';
doc += '| :--- | :--- | :--- |\n';
doc += '| Total Routes Crawled | 64 | 64 |\n';
doc += '| Primary Indexable Canonical Routes | 39 | 39 |\n';
doc += '| Non-Indexable (Utility / Demo / Staging / Partials) | 25 | 25 (Explicit `noindex, follow` or `noindex, nofollow`) |\n';
doc += '| Routes in `sitemap.xml` | 37 (inconsistent) | 39 (exact indexable canonical routes) |\n';
doc += '| Missing Meta Descriptions | 15 routes | 0 on indexable routes |\n';
doc += '| Missing Titles | 2 routes (partials) | 0 on indexable routes |\n';
doc += '| Missing H1 Headings | 7 routes | 0 on indexable routes |\n';
doc += '| Missing Canonicals | 18 routes | 0 on all indexable routes (strict trailing slash) |\n';
doc += '| Routes with JSON-LD Structured Data | 18 | 39 (All indexable commercial routes equipped) |\n\n';

doc += '## Comprehensive 64-Route SEO Ledger\n\n';
doc += '| URL | CURRENT TITLE | CURRENT META DESCRIPTION | H1 | PRIMARY PAGE PURPOSE | LIKELY SEARCH INTENT | CANONICAL | INDEXABILITY | ROBOTS STATUS | OG TITLE | OG DESCRIPTION | OG IMAGE | TWITTER METADATA | STRUCTURED DATA | INTERNAL LINKS IN | INTERNAL LINKS OUT | CONTENT DUPLICATION RISK | THIN CONTENT RISK | SEARCH VALUE | RECOMMENDED ACTION |\n';
doc += '| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';

for (const item of raw) {
  const c = getClassification(item);
  const h1 = item.h1s && item.h1s.length > 0 ? item.h1s.join(' / ') : 'None';
  const schemas = item.schemas && item.schemas.length > 0 ? item.schemas.map(s => s['@type'] || 'Object').join(', ') : 'None';
  const ogImg = item.ogImage ? item.ogImage.split('/').pop() : 'None';
  const tw = item.twCard || 'None';
  const ogT = item.ogTitle ? 'Yes' : 'No';
  const ogD = item.ogDesc ? 'Yes' : 'No';
  const curRobots = item.robots || 'index, follow (default)';

  const row = [
    item.routePath,
    escapeMd(item.title),
    escapeMd(item.metaDesc),
    escapeMd(h1),
    escapeMd(c.purpose),
    escapeMd(c.intent),
    item.canonical || 'None',
    c.indexability,
    escapeMd(curRobots),
    ogT,
    ogD,
    escapeMd(ogImg),
    escapeMd(tw),
    escapeMd(schemas),
    item.inLinksCount,
    item.internalLinksOut.length,
    c.dupRisk,
    c.thinRisk,
    c.searchValue,
    escapeMd(c.action)
  ].join(' | ');

  doc += '| ' + row + ' |\n';
}

doc += '\n## Critical SEO Architecture Strategy\n\n';
doc += '### 1. Canonical Domain & URL Consistency\n';
doc += '- All canonicals must explicitly specify `https://www.contextmuse.com` with a trailing slash (e.g., `https://www.contextmuse.com/services/quote-lead-systems/`).\n';
doc += '- Ensure zero root domain (`contextmuse.com`) or HTTP canonical mismatches.\n\n';

doc += '### 2. Search Intent Clustering & Canonical Hierarchy\n';
doc += '- **High-Intent Inbound Lead Funnel:** `/services/quote-lead-systems/` is the primary transactional page for quote calculators, contractor lead engines, and intake software.\n';
doc += '- **Operations & Systems:** `/custom/` (bespoke operational tools) vs `/systems/` (architecture & engineering standards).\n';
doc += '- **Diagnostics & Tools:** `/signal/` (restaurant margin intelligence) vs `/website-system-check/` (site conversion audit).\n';
doc += '- **Proof & Case Studies:** `/work/lone-wolf-dumpsters/` and `/case-studies/edr-party-rentals/` link directly back to `/services/quote-lead-systems/` and `/custom/` to pass authority.\n\n';

doc += '### 3. Structured Data Strategy (Authentic Local & Entity SEO)\n';
doc += '- **Organization / WebSite:** Austin & Central Texas technical studio with verified service areas, no fabricated street addresses or phone numbers.\n';
doc += '- **ProfessionalService / Service:** Distinct service schemas for Custom Software, Intake Systems, and Diagnostics.\n';
doc += '- **Article / CreativeWork:** Applied to case studies and technical essays.\n\n';

doc += '### 4. Thin / Utility Route De-indexing\n';
doc += '- Utility routes (`/preview/`, `/contact/success/`, `/signal/demo/`, standalone restaurant build prototypes) receive `<meta name="robots" content="noindex, follow">` to channel all crawl budget and PageRank to commercial pages.\n';
doc += '- Exclude these 25 non-indexable routes from `sitemap.xml`.\n';

fs.writeFileSync('C:/Users/rougu/.gemini/antigravity/scratch/contextmuse-homepage/SEO_DISCOVERY_AUDIT.md', doc, 'utf8');
fs.writeFileSync('C:/Users/rougu/.gemini/antigravity/brain/c9fe95e3-68e1-478f-823b-4e2584b213be/SEO_DISCOVERY_AUDIT.md', doc, 'utf8');
console.log('Successfully wrote SEO_DISCOVERY_AUDIT.md to workspace and artifacts.');
