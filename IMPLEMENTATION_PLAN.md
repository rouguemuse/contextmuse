# Context & Muse // Phased Implementation Plan (Strictly Verified)

**Generated:** September 29, 2026  
**Auditor:** Antigravity (Google DeepMind Advanced Agentic Coding)  
**Strict Mandate:** Based ONLY on verified facts documented in `SOURCE_OF_TRUTH.md`. No inferred claims. No synthetic visuals. Zero production code touched prior to approval.

---

## Phase P0: Integrity, Truth & Visual Hygiene (Immediate Action)

### 1. INNcontrol Coils Visual & Primary Presentation
- **Verified Ground Truth:** 
  - Context & Muse built the commercial web platform and lead engine for INNcontrol Coils (`inncontrolcoils.com`, verified in `inncontrol-coil-refurbishing` repo). Authentic capture: `assets/images/inncontrol_coils_preview.png`.
  - Custom internal operator habit/check-in tools exist (`scott-app.html`, `rpg-dashboard.html`).
  - Interactive 2D floorplan coordinate mapper is UNVERIFIED as production software (scratch mockup created 9/29/2026).
- **Approved Implementation:**
  1. Convert authentic capture `assets/images/inncontrol_coils_preview.png` to optimized WebP: `assets/images/inncontrol-commercial-platform.webp`.
  2. Replace `assets/images/inncontrol-screenshot.webp` with `inncontrol-commercial-platform.webp` as the primary project showcase on:
     - `index.html`
     - `proof-of-work/index.html`
     - `work/index.html`
  3. On `systems/client-builds/index.html`, preserve the existing case study text as instructed (do not rewrite unverified facts), but replace the mockup image with the authentic commercial platform capture.

### 2. Lone Wolf / Wolf Ridge Dumpsters Reconciliation
- **Verified Ground Truth:**
  - Context & Muse engineered the platform deployed at `https://lonewolf-dumpsters.vercel.app/` (Next.js app with `/images/lone-wolf/` asset folders).
  - The live client business branding and canonical domain is **Wolf Ridge Dumpsters** (`wolfridgedumpsters.com`, 214-876-0321).
  - `assets/images/lonewolf-screenshot.webp` is an **authentic screenshot** of this deployed site.
- **Approved Implementation:**
  1. Retain the authentic screenshot; remove any artificial browser mockup overlay if desired, or keep as a clean application viewport.
  2. Clarify the case study and portfolio labels so the visual and text match without confusion: identify the project as **Wolf Ridge Dumpsters** (developed under codename *Lone Wolf* at `lonewolf-dumpsters.vercel.app`).
  3. Flag the testimonial quote (*“Context & Muse didn't just build a clean website...” — Wayne, Founder*) for owner confirmation before displaying as a verified quote.

### 3. Declassify Maps With Teeth from Commercial Products
- **Verified Ground Truth:** Maps With Teeth (`mapswithteeth.org`) is an open civic initiative and emergency safety resource infrastructure, not a commercial Context & Muse product.
- **Approved Implementation:**
  1. Remove *"Maps With Teeth ↗"* from the commercial `Products` navigation dropdown in `partials/nav.html` and across all 44 HTML pages.
  2. Maintain its position in `creative/index.html` and `work/index.html` under Civic / Open Systems.

### 4. Purge AI-Generated Restaurant Mockups with Corrupted Typography
- **Verified Ground Truth:** `confidential_pizza_preview.png` (contains corrupted letters *"persıømmars"*), `confidential_pub_preview.png` (*"MUSIC MUSIC & DIVERSITY"*), and `confidential_comedy_preview.png` are synthetic mockups with no underlying client codebase.
- **Approved Implementation:**
  1. Remove these 3 synthetic mockups from `proof-of-work/index.html` and `restaurant-systems/index.html`.
  2. Represent restaurant systems proof strictly with verified work: the **Signal Toast POS Forensic Analysis** built for **Gold Tooth Tony's** (`assets/images/gold_tooth_tony_preview.png` and `signal-priority-view.webp`).

---

## Phase P1: Pricing Harmonization & Inbound Funnel

### 1. Harmonize Approved Studio Pricing Ladder Everywhere
- **Approved Pricing Truth:**
  - **Diagnostic / Conversion Audit:** $395 flat rate (100% creditable toward build within 30 days).
  - **Quote + Lead System:** From $2,500 (Multi-market implementations from $4,500+).
  - **Custom Operations System:** From $6,500.
- **Approved Implementation:**
  - **Remove $195 Audit Rates:** Update `systems/index.html:557` and `terms/index.html:244` to reflect the $395 Diagnostic (100% credited).
  - **Remove $500 & $1,500 Starter Website Rates:** Purge cheap starter website tiers from `systems/index.html` (lines 17, 353, 460, 478, 554, 555) and align with studio positioning.
  - **Correct $3,500 to $6,500 for Custom Systems:** Update Custom Operations System pricing from $3,500 to $6,500 on:
    - `custom/index.html:632, 766`
    - `index.html:918, 1023`
    - `services/index.html:613, 674`
    - `website-system-check/index.html:828`

### 2. Payment & Calendar CTAs (Marked: Needs Configuration)
- **Verified Ground Truth:** No external Stripe, Calendly, or deposit checkout links exist in the repository.
- **Approved Implementation:**
  - Do NOT fabricate fake payment or booking URLs.
  - Route all $395 Diagnostic CTAs directly to the working internal intake route: `/contact/?service=diagnostic` or dedicated on-page form (`#inbound-inquiry-deck`).
  - Flag Stripe / Calendly integration as **NEEDS CONFIGURATION** for the site owner.

---

## Phase P2: Technical SEO, Schemas & Hygiene

### 1. Schema Markup
- Add `CollectionPage` and `Service` JSON-LD schemas to case study hubs (`systems/client-builds/`, `proof-of-work/`, `work/lone-wolf-dumpsters/`).

### 2. Robots & Sitemap Configuration
- Add `<meta name="robots" content="noindex, nofollow">` to internal prototype and scratch routes (`cxm_gensort/`, `demo-restaurant-signal-report.html`, `scratch/...`).
- Reconcile `sitemap.xml` to index all canonical production routes.

---

## Phase P3: Performance & File Hygiene

### 1. Asset Optimization
- Convert remaining raw PNGs exceeding 2 MB (`valley_of_wolves.png`, `edrpartyrentals-screenshot.png`, `dear_reader_artifact.png`) to optimized WebP.
- Verify explicit `width` and `height` attributes on all `<img>` tags to eliminate CLS.

### 2. Redundancy Cleanup
- Remove obsolete root duplicate file `proof-of-work.html`.
- Fix broken anchor link in `signal/demo/index.html`.

---

## Verification & QA Protocol
1. **Automated Verification:** Run `node scripts/verify_site.js` to guarantee 0 broken internal links, 0 missing images, and single H1 tags across all 66 pages.
2. **Visual Cross-Device QA:** Capture desktop (1440x900) and mobile (390x844) screenshots via Puppeteer across modified routes to verify visual integrity.
