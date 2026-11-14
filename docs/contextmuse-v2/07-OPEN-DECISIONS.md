# 07 — Open Decisions Requiring Founder Review

**Project:** ContextMuse V2 — Controlled Migration & Change-Control System  
**Purpose:** Structured decision log isolating strategic, naming, pricing, and classification questions that require Founder sign-off before P1/P2 content and routing consolidations are executed.

---

## Decision Register (`OD-01` through `OD-07`)

### `OD-01` — Canonical Studio Pricing & Ongoing Care Plans
- **Where Conflict Exists:**
  - **New Four-Room SPA (`/method/`, `/build/`, `BriefDrawer.jsx`, `/website-system-check/`):**
    - Track 01 (Websites & Quoting Systems): **From $2,500** (`$4,500+` multi-market / complex quoting)
    - Track 02 (Custom Operational Software): **From $6,500**
    - Track 03 (Original Products & Interactive Tools): **Custom Scope**
    - Optional Paid Diagnostic / System Audit: **$395** (credited toward build)
    - `BriefDrawer` Budget Brackets: `Under $2,500`, `$2,500–$5,000`, `$5,000–$10,000`, `$10,000+`, `Not sure yet`
  - **Legacy `/custom/` & `/services/`:** Lists `$375`, `$600`, `$2,000`, `$2,000–$5,000`, and ongoing care plans at `$125 / $200 / $375 / $600` per month.
  - **Legacy `/contact/`:** Uses `$1,000–$2,500` as the entry bracket.
- **Recommended Resolution:**
  1. Adopt the `/method/` + `/build/` pricing structure (`From $2,500`, `From $6,500`, `Custom Scope`, `$395` diagnostic) as the single studio standard and retire the conflicting `/custom/` and `/contact/` tables via 308 redirects.
  2. **Founder Question:** Should the monthly care/retainer tiers (`$125–$600/mo` from `/services/`) be retired completely, or mentioned briefly under `/method/` FAQ as post-launch support options?

---

### `OD-02` — Canonical Brand Name for Flagship Dumpster Platform (`Wolf Ridge Dumpsters` vs. `Lone Wolf Dumpsters`)
- **Where Conflict Exists:**
  - `src/data/projects.js` (line 17) & `src/components/work/FlagshipShowcase.jsx` (lines 113, 158): Title is **`Wolf Ridge Dumpsters`** and the simulated browser bar displays **`wolfridgedumpsters.com`**.
  - Live deployment URL (`src/data/projects.js` line 23): **`https://lonewolf-dumpsters.vercel.app/`**.
  - Legacy static case study (`/work/lone-wolf-dumpsters/index.html`): Titled **`Lone Wolf Dumpsters · Commercial Platform & Sizing Engine`**.
- **Recommended Resolution:**
  - **Option A (Recommended if Wolf Ridge is the anonymized/canonical studio showcase brand):** Standardize all V2 copy and the canonical case study route to **`Wolf Ridge Dumpsters`** (`/work/wolf-ridge-dumpsters/`), keep `/work/lone-wolf-dumpsters/` as a 308 redirect (and `?case=lone-wolf-dumpsters` as a supported alias), and ensure the browser bar label in `FlagshipShowcase.jsx` matches the live demo or clearly notes the showcase domain.
  - **Option B (If Lone Wolf Dumpsters is the official client name approved for public display):** Standardize `projects.js` and `FlagshipShowcase.jsx` to **`Lone Wolf Dumpsters`** (`/work/lone-wolf-dumpsters/`).

---

### `OD-03` — Project Classification Taxonomy (`EDR Party Rentals`, `Maps With Teeth`, `Hospitality Concepts`)
- **Where Conflict Exists:**
  - **`Maps With Teeth`:** Tagged `contentType: 'client-project'` in `src/data/contentRegistry.js` (line 299), whereas `src/data/projects.js` (line 531) states `role: 'Founder'` and describes it as *"An independent public-interest initiative"*.
  - **`Every Day Counts (EDR) Party Rentals`:** Tagged `contentType: 'client-project'` and `maturityStatus: 'prototype'` in `src/data/contentRegistry.js` (line 274).
  - **`Restaurant Builds` (`/restaurant-builds/comedy-venue/`, `/detroit-pizza/`, `/events-venue/`):** Standalone interactive sector concepts currently living in the legacy static tree.
- **Recommended Resolution:**
  - Establish four explicit, honest badges across `/work/` and `#content-index`:
    1. **`Client System`** — Wolf Ridge / Lone Wolf Dumpsters, INNcontrol
    2. **`Commercial Prototype / Concept Study`** — EDR Party Rentals, Hospitality Concept Builds (Comedy Venue, Detroit Pizza, Events Venue)
    3. **`Independent Product / Utility`** — GenSort Studio, Signal, Contest Atlas (WCSM), Self-Cartography, Revision Atlas, Website + System Check, Client Opportunity Engine
    4. **`Civic & Creative System`** — Maps With Teeth, How to Explain Yourself to Wolves, MadeOfReasons, BrainRaccoon
  - **Founder Question:** Confirm whether `EDR Party Rentals` should be badged as **`Commercial Prototype`** or **`Client System`**, and whether the 3 `/restaurant-builds/*` concept pages should be surfaced in `/work/#content-index` under `Commercial Prototypes`.

---

### `OD-04` — `/inncontrol-v2/` Target & Positioning
- **Where Conflict Exists:**
  - `src/components/work/InncontrolShowcase.jsx` (line 185), `src/pages/Lab.jsx`, and `src/data/contentRegistry.js` link to `/inncontrol-v2/` with the label **"Operator Readiness & Status HUD"**.
  - However, the actual file at `inncontrol-v2/index.html` is a static hospitality marketing landing page (*"Your Guests Deserve Clean Air — INNcontrol Hospitality Services"*) with a basic ROI slider and legacy footer links (`/services/`, `/systems/client-builds/`, `/proof-of-work/`, `/partners/`).
- **Recommended Resolution:**
  - **Option A:** Keep `/inncontrol-v2/` as the **"Hospitality Partner Concept & ROI Calculator"** (updating the button label in `InncontrolShowcase.jsx` and `contentRegistry.js` to match what the page actually is, and stripping its broken legacy footer links).
  - **Option B:** Replace or redirect `/inncontrol-v2/` to the actual Operator HUD view on `https://inncontrol-hvac.vercel.app/` (or embed the sanitized HUD preview directly in `ProofViewer.jsx`).

---

### `OD-05` — GenSort Commercial Model (`/gensort/` SaaS Pricing vs. IP Acquisition)
- **Where Conflict Exists:**
  - `SiteFooter.jsx` (Acquisition modal) and `src/data/projects.js` position **GenSort Studio** as a completed local-first product available for **IP Acquisition or Custom Licensing**, with free public access to the live workstation at `/cxm_gensort/index.html`.
  - Legacy `/gensort/index.html` advertises consumer SaaS subscription tiers (`Free $0`, `Starter $5/mo`, `Pro $9/mo`, `Studio $19/mo`, `Lifetime $39`).
- **Recommended Resolution:**
  - **Option A (Recommended):** Retire the `$5 / $9 / $19 / $39` consumer pricing table on `/gensort/`, unify `/gensort/` with the V2 case study route `/work/gensort/`, and keep the primary CTAs as **Launch GenSort Studio (`/cxm_gensort/index.html`)** and **Inquire About Licensing / Acquisition (`/acquisition/`)**.
  - **Option B:** Retain the consumer pricing tiers on a re-shelled V2 `/gensort/` product page.

---

### `OD-06` — Signal Standalone Funnel Scope (`/signal/*`)
- **Where Conflict Exists:**
  - `Signal` has 5 active static pages (`/signal/`, `/signal/demo/`, `/signal/intake/`, `/signal/sample-reports/`, `/signal/export-instructions/`), 1 pilot page (`/signal/restaurant-data-partner/`), and 1 obsolete duplicate (`/signal_restaurant_intelligence/` with `$199` pricing).
- **Recommended Resolution:**
  - Redirect `/signal_restaurant_intelligence/` -> `/signal/` immediately.
  - Keep `/signal/`, `/signal/demo/`, `/signal/intake/`, `/signal/sample-reports/`, and `/signal/export-instructions/` at their clean URLs (with `$195 / $595 / $1,250+ / $249/mo` pricing), and upgrade their navigation header/footer from the legacy navbar to the V2 Four-Room shell.
  - **Founder Question:** Should `/signal/restaurant-data-partner/` remain a separate subpage or be folded into `/signal/` as a section?

---

### `OD-07` — Partner Program Page (`/partners/`)
- **Where Conflict Exists:**
  - `/partners/index.html` is a standalone legacy page pitching white-label engineering & interactive tool builds for agencies and consultants. It is not linked from the new V2 `SiteHeader` or `SiteFooter`, but remains in `sitemap.xml` with the legacy navbar.
- **Recommended Resolution:**
  - **Option A:** Fold agency/partner collaboration copy into `/method/#ways-to-work-together` and 308-redirect `/partners/` -> `/method/#ways-to-work-together`.
  - **Option B:** Re-shell `/partners/` in the V2 design system and link it in `SiteFooter.jsx` or `ContentIndexSection`.
