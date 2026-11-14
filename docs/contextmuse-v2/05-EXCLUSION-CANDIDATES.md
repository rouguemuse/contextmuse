# 05 — Exclusion, Consolidation & Archival Candidates

**Project:** ContextMuse V2 — Controlled Migration & Change-Control System  
**Status:** **PROPOSAL ONLY — Nothing in this document is approved for deletion.** All exclusions, redirects, or file removals require explicit Founder approval and completion of prerequisite content/functionality preservation in `04-PRESERVATION-REGISTER.md`.

---

## 1. Shadowed & Obsolete Duplicate Static Pages (Safe to Retire After Redirect Verification)

These static HTML files are either **already shadowed by `vercel.json` redirects** (making the static file unreachable in production) or are **obsolete early drafts superseded by active pages**.

| Candidate Route / File | Why It Is Redundant or Inappropriate | Prerequisite Before Archival | Proposed Action |
| :--- | :--- | :--- | :--- |
| `systems/signal/index.html` (`/systems/signal/`) | Already overridden by `vercel.json` permanent redirect `/systems/signal/` -> `/signal/`. The static file on disk uses the old navbar and is dead weight in the build output. | Confirm `vercel.json` 308 redirect `/systems/signal/` -> `/signal/` remains active. | Remove static HTML file from `build-spa.mjs` copy list; retain 308 redirect. |
| `demo-restaurant-signal-report.html` | Already overridden by `vercel.json` permanent redirect `/demo-restaurant-signal-report.html` -> `/signal/sample-reports/`. | Confirm `/signal/sample-reports/` contains all sample report tables. | Remove root HTML file; retain 308 redirect in `vercel.json`. |
| `signal_restaurant_intelligence/index.html` (`/signal_restaurant_intelligence/`) | Older standalone draft of the Signal landing page with conflicting `$199` scan pricing, zero inbound links from the app, but still listed in `sitemap.xml`. | Verify `/signal/` and `/signal/intake/` cover all active Signal tiers (`$195 / $595 / $1,250+ / $249/mo`). | Add 308 redirect `/signal_restaurant_intelligence/` -> `/signal/`, remove from `sitemap.xml`, and archive static folder. |
| `contact/success/index.html` (`/contact/success/`) | Legacy thank-you page used only by the legacy `contact/index.html` form. `BriefDrawer.jsx` handles submission confirmation inline with full state context. | Redirect `/contact/` -> `/build/?brief=true`. | Redirect `/contact/success/` -> `/build/` and archive static file. |

---

## 2. Redundant Legacy Marketing & Navigation Hub Pages (Consolidate via 308 Redirects)

These legacy static HTML pages duplicate the purpose of the Four-Room SPA (`/work/`, `/build/`, `/lab/`, `/method/`), expose the legacy `<nav class="navbar">`, and display contradictory pricing tiers.

| Candidate Route / File | Structural Conflict Caused | V2 Replacement Route | Prerequisite Before Redirecting |
| :--- | :--- | :--- | :--- |
| `custom/index.html` (`/custom/`) | Conflict #1 (Legacy navbar), Conflict #6 (Duplicate intake form), Conflict #7 (Contradictory `$375 / $600 / $2,000` prices). | `/build/` | Ensure `/build/` supports `?service=audit` / `?service=diagnostic` query params in `BriefDrawer.jsx` and update the 5 `vercel.json` redirects pointing to `/custom/`. |
| `services/index.html` (`/services/`) | Conflict #1 (Legacy navbar), Conflict #7 (Lists `$125–$600` care plans alongside old service layout). | `/method/#ways-to-work-together` | Confirm with Founder whether care-plan pricing (`$125–$600/mo`) should be added to `/method/` or retired. |
| `services/quote-lead-systems/index.html` (`/services/quote-lead-systems/`) | Conflict #1 (Legacy navbar) & Conflict #6 (Separate lead form). | `/build/` (Track 01: Websites & Quoting Systems) | Ensure trade-specific quoting examples (dumpster, party rental, field service) remain represented in `/build/` Track 01 copy. |
| `quick-launch/index.html` (`/quick-launch/`) | Duplicate package page (`$2,500–$4,500`) with legacy navbar and separate intake form. | `/build/` | Preserve 2–4 week launch timeline note in `/build/` Track 01. |
| `contact/index.html` (`/contact/`) | Conflict #1 (Legacy navbar), Conflict #6 (Duplicate form), Conflict #7 (`$1,000–$2,500` budget dropdown contradicts `Under $2,500` / `From $2,500` floor). | `/build/?brief=true` | Map query params (`?service=diagnostic`, `?type=partner`) to `BriefDrawer` initial state. |
| `systems/index.html` (`/systems/`) | Legacy systems overview duplicating `/work/` and `/method/`. | `/work/` | Update `vercel.json` redirect `/jayme/product-experience/` to point directly to `/work/`. |
| `systems/client-builds/index.html` (`/systems/client-builds/`) | Legacy client builds list duplicating `/work/` flagship showcases. | `/work/` | Support `#lonewolf` and `#inncontrol` anchor hashes on `/work/` (or redirect cleanly to `/work/`). |
| `proof-of-work/index.html` (`/proof-of-work/`) | Legacy directory superseded by `/work/#content-index`. | `/work/#content-index` | None (`#content-index` already contains 22 registry entries). |
| `creative/index.html` (`/creative/`) | Legacy creative hub superseded by `/lab/` (`Creative Systems` section). | `/lab/` | Ensure `/lab/` links to all 4 creative works + `Interaction Lab` and `Restaurant Theory`. |
| `about/index.html` (`/about/`) | Legacy founder bio page superseded by `/method/` founder section. | `/method/#founder` | Verify all desired biographical details from `/about/` are present in `src/pages/Method.jsx`. |

---

## 3. Internal / Client-Named Sandbox Directories (Already in `.vercelignore`)

These 9 directories are already excluded from production deployment via `.vercelignore` and marked `noindex` in `vercel.json`, but **their directory names are currently leaked publicly in `public/robots.txt`** (Conflict #12).

| Directory | Current Deployment State | Issue Identified | Recommended Action |
| :--- | :--- | :--- | :--- |
| `brand/` | Ignored by `.vercelignore` | Listed in `public/robots.txt` (`Disallow: /brand/`) | Keep in `.vercelignore`; **remove `Disallow` line from `robots.txt`** so internal folder name is not advertised. |
| `dealsignal/` | Ignored by `.vercelignore` | Listed in `public/robots.txt` (`Disallow: /dealsignal/`) | Keep in `.vercelignore`; **remove `Disallow` line from `robots.txt`**. |
| `istar-map/` | Ignored by `.vercelignore` | Listed in `public/robots.txt` (`Disallow: /istar-map/`) | Keep in `.vercelignore`; **remove `Disallow` line from `robots.txt`**. |
| `preview/` | Ignored by `.vercelignore` | Local staging page | Keep in `.vercelignore`. |
| `rudyards-comedy/` | Ignored by `.vercelignore` | **Client-named prototype leaked in `public/robots.txt`** (`Disallow: /rudyards-comedy/`) | Keep in `.vercelignore`; **remove from `robots.txt` immediately** in remediation phase. |
| `sixes-and-sevens/` | Ignored by `.vercelignore` | **Client-named prototype leaked in `public/robots.txt`** (`Disallow: /sixes-and-sevens/`) | Keep in `.vercelignore`; **remove from `robots.txt` immediately** in remediation phase. |
| `southern_smoke/` | Ignored by `.vercelignore` | **Client-named prototype leaked in `public/robots.txt`** (`Disallow: /southern_smoke/`) | Keep in `.vercelignore`; **remove from `robots.txt` immediately** in remediation phase. |
| `star-gift/` | Ignored by `.vercelignore` | Listed in `public/robots.txt` (`Disallow: /star-gift/`) | Keep in `.vercelignore`; **remove from `robots.txt`**. |
| `tiktok-shop-roi-analyzer/` | Ignored by `.vercelignore` | Listed in `public/robots.txt` (`Disallow: /tiktok-shop-roi-analyzer/`) | Keep in `.vercelignore`; **remove from `robots.txt`**. |
| `twenty-minute-override/` | Ignored by `.vercelignore` (no HTML file on disk) | Listed in `public/robots.txt` (`Disallow: /twenty-minute-override/`) | Remove from `robots.txt`. |

---

## 4. Unmounted React Auth Scaffolding (`src/pages/`)

| File | Current Condition | Recommended Action |
| :--- | :--- | :--- |
| `src/pages/Login.jsx` | Unmounted Base44 auth template (`@base44/sdk` dependency removed in `52e179d`). | Keep unmounted; candidate for archival if no authenticated client portal is planned for V2. |
| `src/pages/Register.jsx` | Unmounted Base44 registration template. | Keep unmounted; candidate for archival. |
| `src/pages/ForgotPassword.jsx` | Unmounted Base44 password recovery template. | Keep unmounted; candidate for archival. |
| `src/pages/ResetPassword.jsx` | Unmounted Base44 password reset template. | Keep unmounted; candidate for archival. |
| `src/pages/OAuthConsent.jsx` | Unmounted Base44 OAuth consent template. | Keep unmounted; candidate for archival. |

---

## 5. Internal Development Artifact Strings in Public Data Files

| File & Line | Exposed Internal Artifact | Why It Should Be Excluded from Public Copy | Recommended Replacement |
| :--- | :--- | :--- | :--- |
| `src/data/projects.js` (line 193) | `'scott-daily / scott-app (operator daily checklist)'`, `'rpg-dashboard (gamified team progression)'` | Internal developer prototype filenames exposed inside the public INNcontrol case study dossier (`ProofViewer.jsx`). | Replace with descriptive architectural labels: `'Operator Daily Checklist Module'` and `'Technician Progression & Readiness Dashboard'`. |
| `src/components/method/methodData.js` (line 98) | `'Static deployments: scott-daily.html, rpg-dashboard.html'` | Exposed inside the `03 Build` drawer on `/method/`. | Replace with `'Modular operator views: daily readiness checklist and technician status dashboards'`. |
