# Context & Muse // Comprehensive Factual Audit & Source of Truth

**Generated:** September 29, 2026  
**Auditor:** Antigravity (Google DeepMind Advanced Agentic Coding)  
**Status:** Complete Factual Baseline (Zero Source Code Modified)  
**Scope:** All 66 HTML routes, 229 image references, 23 forms, 96 static assets, pricing tiers, JSON-LD schemas, SEO, and navigation structures.

---

## 1. Executive Summary & Core Business Reality

### The Primary Business Mandate
Context & Muse operates as a boutique systems studio specializing in bespoke operational web platforms, custom customer acquisition engines, and automated business workflows for high-ticket local and commercial businesses. 

The website's primary function is to serve as an **inbound trust-building and qualification funnel** that converts cold or referral traffic into high-intent buyers *without* cold calling or manual pitching.

The intended conversion funnel is:
```text
SEARCH / REFERRAL / PORTFOLIO DISCOVERY
  │
  ▼
FREE WEBSITE & SYSTEM CHECK (Lightweight Mini-Diagnostic)
  │
  ▼
EVIDENCE-BASED REPORT (Proof of System-Level Thinking)
  │
  ▼
$395 BUSINESS SYSTEM DIAGNOSTIC (Paid Deep-Dive, 100% Credited Toward Build)
  │
  ▼
HIGH-TICKET IMPLEMENTATION:
  ├── Quote + Lead Systems (From $2,500)
  └── Custom Operations Systems (From $6,500)
```

### Critical Failures Discovered in the Audit
1. **Fabricated Project Visual & Scope (INNcontrol Coils):**
   - `assets/images/inncontrol-screenshot.webp` displays an iPad floorplan equipment room mapper ("Omni Dallas Hotel Floor 3 Wing B Room 304").
   - **Factual Reality:** INNcontrol Coils (`inncontrolcoils.com`) is a nationwide B2B commercial PTAC coil refurbishing service for hotel volume properties. The authentic asset in the repository is `assets/images/inncontrol_coils_preview.png` (hero headline: *"COMFORT UNDER CONTROL. NATIONWIDE PTAC COIL REFURBISHING"*).
2. **Brand Name & Screenshot Discrepancy (Lone Wolf Dumpsters vs. Wolf Ridge):**
   - Marketing copy across the site consistently cites **Lone Wolf Dumpsters** (`lonewolfdumpsters.com`).
   - The screenshot loaded (`assets/images/lonewolf-screenshot.webp`) prominently displays **"Wolf Ridge Dumpsters"** (*"Rent. Relax. We Haul.", 214-876-0321*) with an artificial browser bar pasted on top.
3. **Severe Project Misclassification (Maps With Teeth):**
   - Listed in primary navigation dropdown `<details class="nav-dropdown"> <summary class="nav-link">Products</summary>` alongside commercial software.
   - **Factual Reality:** Maps With Teeth (`mapswithteeth.org`) is a public civic initiative and emergency resource mapping infrastructure for abuse survivors, **not a commercial product**.
4. **AI-Generated Restaurant Mockups with Corrupted Typography:**
   - Case studies on `proof-of-work/index.html` and `restaurant-systems/index.html` feature AI-generated mockups:
     - `confidential_comedy_preview.png` ("McGregor's Comedy Club")
     - `confidential_pizza_preview.png` (features hallucinated pseudo-words like *"persıømmars"*)
     - `confidential_pub_preview.png` (features corrupted text like *"MUSIC MUSIC & DIVERSITY"*, *"infe@oʊntrg.com"*)
   - **Factual Reality:** The authentic restaurant project in the repository is **Gold Tooth Tony's** (Detroit-Style Pizza, Houston TX), with real Toast POS integration, real sales ledgers, and authentic capture `assets/images/gold_tooth_tony_preview.png`.
5. **Chaotic Pricing Contradictions Across Pages:**
   - **Homepage:** Diagnostic $395 | Quote+Lead from $2,500 | Custom System from $6,500.
   - **Services (`/services/`):** Diagnostic $395 | Quote+Lead from $2,500 | Custom System from $3,500.
   - **Custom (`/custom/`):** Custom System listed at $3,500.
   - **Systems (`/systems/`):** Advertises *"Starter Website from $500"*, *"Business Website from $1,500"*, and *"Conversion Audit $195"*, degrading the studio's authority.

---

## 2. Site Architecture & Route Census (66 HTML Files)

| Category | Route Count | File Paths & Descriptions | Status / Action Needed |
| :--- | :---: | :--- | :--- |
| **Core Inbound Funnel** | 5 | `index.html`, `website-system-check/index.html`, `services/index.html`, `contact/index.html`, `quick-launch/index.html` | Active primary funnel. Needs pricing harmonization and authentic proofs. |
| **Commercial Work & Case Studies** | 7 | `work/index.html`, `work/lone-wolf-dumpsters/index.html`, `work/website-audit-system/index.html`, `work/client-opportunity-engine/index.html`, `work/contest-atlas/index.html`, `work/revision-atlas/index.html`, `case-studies/edr-party-rentals/index.html` | Core credibility proofs. Reconcile Lone Wolf / Wolf Ridge branding and update visuals. |
| **Systems & Client Showcases** | 6 | `systems/index.html`, `systems/client-builds/index.html`, `proof-of-work/index.html`, `systems/resource-guide/index.html`, `systems/signal/index.html`, `custom/index.html` | Duplicate portfolio representations. Remove cheap $500 pricing from `systems/`. |
| **Product Landing Pages** | 2 | `gensort/index.html`, `cxm_gensort/index.html` | `gensort/index.html` contains verified real application screenshots. `cxm_gensort` is an internal prototype. |
| **Restaurant Systems & Niche Demos** | 16 | `restaurant-systems/index.html`, `restaurant-theory/index.html`, `restaurant-builds/index.html`, `restaurant-builds/detroit-pizza/index.html`, `restaurant-builds/comedy-venue/index.html`, `restaurant-builds/events-venue/index.html`, `demo-restaurant-signal-report.html`, `signal/...` (5 routes), `sixes-and-sevens/...` (6 routes), `rudyards-comedy/...` (3 routes), `southern_smoke/index.html` | Replace AI mockups with real **Gold Tooth Tony's** assets and real Toast POS telemetry. |
| **Creative, Essays & Personal** | 6 | `creative/index.html`, `creative/how-to-explain-yourself-to-wolves/index.html`, `creative/self-cartography/index.html`, `cartography/index.html`, `istar-map/index.html`, `star-gift/index.html` | Separate personal creative writing from commercial client intake. |
| **Partners & Affiliates** | 2 | `partners/index.html`, `tiktok-shop-roi-analyzer/index.html` | Active B2B partner pages. |
| **Internal Tools, Prototypes & Redundant** | 22 | `index.backup.html`, `proof-of-work.html` (root duplicate), `inncontrol-v2/index.html`, `preview/index.html`, `dealsignal/index.html`, `wcsm/index.html`, `scratch/inncontrol-operational-workbench.html` | Needs cleanup or `noindex` robots tags to prevent index pollution. |

---

## 3. Comprehensive Visual Asset & Proof Audit

Every primary visual currently displayed across the commercial website was audited for authenticity, file source, and truthfulness:

| Page Location | Visual Alt / Label | Actual File Loaded | Claimed Project | Factual Status | Disposition Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`index.html`** (Hero Grid) | Lone Wolf Dumpsters commercial platform | `assets/images/lonewolf-commercial-spread.webp` | Lone Wolf Dumpsters | **Discrepancy**: Image shows "Wolf Ridge Dumpsters" with mockup browser chrome. | Reconcile brand naming and clean up mockup wrapper. |
| **`index.html`** (Hero Grid) | INNcontrol operational floorplan mapper | `assets/images/inncontrol-screenshot.webp` | INNcontrol Coils | **FABRICATED**: Depicts hotel room mapping app. INNcontrol is commercial coil refurbishing. | **REPLACE IMMEDIATELY** with `inncontrol_coils_preview.png` (converted to WebP). |
| **`index.html`** (Hero Grid) | Website Audit System visual diagnostics | `assets/images/website-audit-hero.webp` | Website Audit System | **AUTHENTIC**: Matches the actual audit diagnostic engine. | KEEP. |
| **`index.html`** (Hero Grid) | EDR Party Rentals bilingual inventory system | `assets/images/edrpartyrentals-screenshot.webp` | EDR Party Rentals | **AUTHENTIC**: Verified bilingual party rental reservation engine. | KEEP. |
| **`systems/client-builds/`** | Lone Wolf Dumpsters live website | `assets/images/lonewolf-screenshot.webp` | Lone Wolf Dumpsters | **Discrepancy**: Displays "Wolf Ridge Dumpsters" ("Rent. Relax. We Haul.", 214-876-0321). | Reconcile brand copy to reflect real client build. |
| **`systems/client-builds/`** | INNcontrol Coils interface | `assets/images/inncontrol-screenshot.webp` | INNcontrol Coils | **FABRICATED**: Same room mapper mockup. | **REPLACE** with `inncontrol-commercial-platform.webp`. |
| **`systems/client-builds/`** | EDR Party Rentals inventory engine | `assets/images/edrpartyrentals-screenshot.webp` | EDR Party Rentals | **AUTHENTIC**: Verified production capture. | KEEP. |
| **`systems/client-builds/`** | D2 Auto Detail customer acquisition portal | `assets/images/d2autodetail-screenshot.webp` | D2 Auto Detail | **AUTHENTIC**: High-end ceramic coating / auto detailing acquisition site. | KEEP. |
| **`proof-of-work/index.html`** | McGregor's Comedy Club | `assets/images/confidential_comedy_preview.png` | Confidential Comedy | **AI-MOCKUP**: Synthetic image with pseudo-realistic textures. | Replace with verified restaurant case study (Gold Tooth Tony's). |
| **`proof-of-work/index.html`** | Detroit-Style Pizza | `assets/images/confidential_pizza_preview.png` | Confidential Pizza | **AI-MOCKUP (Corrupted Text)**: Contains distorted letters (*"persıømmars"*). | **REPLACE** with `assets/images/gold_tooth_tony_preview.png`. |
| **`proof-of-work/index.html`** | Craft Pub & Dining | `assets/images/confidential_pub_preview.png` | Confidential Pub | **AI-MOCKUP (Corrupted Text)**: Shows *"MUSIC MUSIC & DIVERSITY"*, *"infe@oʊntrg.com"*. | **PURGE**. |
| **`gensort/index.html`** | GenSort Hero Library Grid | `assets/images/gensort-library.webp` | GenSort | **AUTHENTIC**: Directly captured from running React 18 / Dexie app. | KEEP. Verified production truth. |
| **`gensort/index.html`** | GenSort Split-View Compare | `assets/images/gensort-compare.webp` | GenSort | **AUTHENTIC**: Side-by-side inspection view from running app. | KEEP. Verified production truth. |
| **`gensort/index.html`** | GenSort Metadata Inspector | `assets/images/gensort-inspector.webp` | GenSort | **AUTHENTIC**: EXIF/IPTC inspector drawer from running app. | KEEP. Verified production truth. |
| **`gensort/index.html`** | GenSort Search & Filter Panel | `assets/images/gensort-search-filter.webp` | GenSort | **AUTHENTIC**: Multimodal tag query engine from running app. | KEEP. Verified production truth. |
| **`work/lone-wolf-dumpsters/`** | Lone Wolf Commercial Hero | `assets/images/lonewolf-cover.webp` | Lone Wolf Dumpsters | **Discrepancy**: "Wolf Ridge Dumpsters" artwork. | Clarify brand history or update graphic. |
| **`work/website-audit-system/`**| Audit Engine Diagnostic Evidence | `assets/images/website-audit-cover.webp` | Website Audit System | **AUTHENTIC**: Real DOM tree inspection & visual evidence interface. | KEEP. |
| **`work/client-opportunity-engine/`**| Client Opportunity Platform | `assets/images/client-opportunity-engine-cover.webp`| Client Opportunity Engine | **AUTHENTIC**: Internal workflow tooling. | KEEP. |
| **`work/contest-atlas/`** | Contest Atlas Architecture | `assets/images/contest-atlas-cover.webp` | Contest Atlas | **AUTHENTIC**: Interactive competition atlas & spatial analytics. | KEEP. |
| **`work/revision-atlas/`** | Revision Atlas System | `assets/images/revision-atlas-cover.webp` | Revision Atlas | **AUTHENTIC**: Versioning and document delta analysis platform. | KEEP. |

---

## 4. Components & Navigation Audit

### Primary Header Navigation (`partials/nav.html` & 44 Pages Inline)
- **Drop-down structure:**
  - `Systems`: Systems Overview, Client Builds, Proof of Work, Resource Guide, DealSignal.
  - `Products`: GenSort, **Maps With Teeth ↗ (FLAGGED: Civic Initiative, NOT a commercial product)**, Website Audit System.
  - `Studio`: About, Services, Creative Work, Contact.
- **Flaws Identified:**
  - Maps With Teeth in `Products` violates core project truth.
  - Duplication between `Client Builds` (`/systems/client-builds/`), `Proof of Work` (`/proof-of-work/`), and `Work` (`/work/`).

### Footer (`partials/footer.html`)
- Contains links to legal, privacy, terms, systems, and contact. Generally clean, but replicates inconsistent link targets.

### Forms Census (23 Forms Across 66 Pages)
- **Homepage Mini-Diagnostic Form:** Successfully posts to `/api/run-diagnostic`.
- **Standalone Diagnostic Form (`/website-system-check/`):** Functional intake.
- **Contact Form (`/contact/`):** Standard general inquiry form.
- **Signal Intake Forms:** Used for restaurant report generation.
- **Issue:** No direct "Deposit / Book Now" checkout or reservation action for the $395 diagnostic on the pricing cards.

---

## 5. Pricing & Offer Ladder Conflict Analysis

| Page | Diagnostic Offer | Lead / Quoting System | Custom Operations System | Low-Tier Contradictions |
| :--- | :--- | :--- | :--- | :--- |
| **`index.html`** | **$395** (100% credited) | **From $2,500** | **From $6,500** | None |
| **`services/index.html`** | **$395** (100% credited) | **From $2,500** | **From $3,500** (Conflict: -$3,000) | None |
| **`custom/index.html`** | None mentioned | None mentioned | **From $3,500** (Conflict: -$3,000) | None |
| **`systems/index.html`** | **$195** "Conversion Audit" | Not clearly framed | Vague | **"Starter Website from $500"**, **"Business Website from $1,500"** |

**Business Impact:** An enterprise client exploring the site discovers that Context & Muse asks $6,500 for custom systems on the homepage, but $3,500 on `/services/` and `/custom/`, and offers $500 starter templates on `/systems/`. This severely damages pricing power, positioning, and buyer trust.

---

## 6. Technical SEO, Metadata & Structured Data

1. **Robots & Sitemap:**
   - `robots.txt` allows broad crawling.
   - `sitemap.xml` only lists a subset of production URLs (~30 of 66).
   - Test and internal routes (e.g. `cxm_gensort/`, `demo-restaurant-signal-report.html`, `scratch/...`) lack `noindex` tags and could be indexed by search engines.
2. **JSON-LD Structured Data:**
   - Homepage features `ProfessionalService` and `Organization` schema.
   - Missing structured data on key case studies and portfolio hubs (`systems/client-builds/`, `proof-of-work/`, `work/lone-wolf-dumpsters/`).
3. **Heading Hierarchy:**
   - Verified: 100% of analyzed pages have exactly one `<h1>`.
   - Title tags and meta descriptions are present on all primary funnel routes, but descriptions on secondary systems pages are generic.

---

## 7. Performance & Asset Weight Findings

- Several raw PNG files in `assets/images/` exceed 2 MB:
  - `inncontrol_coils_preview.png` (2.65 MB)
  - `valley_of_wolves.png` (2.64 MB)
  - `edrpartyrentals-screenshot.png` (2.23 MB)
  - `lonewolf-screenshot.png` (2.05 MB)
  - `dear_reader_artifact.png` (2.05 MB)
- **Remediation:** All displayed production assets must be served as optimized WebP (<300 KB) with exact width/height attributes to prevent Cumulative Layout Shift (CLS).

---

## Conclusion & Baseline Approval Request
This audit establishes the ground truth across every page, asset, and claim. No code has been modified. The prioritized remediation plan is documented in `IMPLEMENTATION_PLAN.md`.
