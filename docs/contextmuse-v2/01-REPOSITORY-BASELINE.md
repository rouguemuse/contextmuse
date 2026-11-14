# 01 — Repository Baseline & Dual-Architecture Verification

**Project:** ContextMuse V2 — Controlled Migration & Change-Control System  
**Task:** Task 01 — Complete Route Inventory, Migration Map & Change-Control System  
**Repository Root:** `c:\Users\rougu\Downloads\REtail Arb\contextmuse-repo`  
**Remote Origin:** `https://github.com/rouguemuse/contextmuse`

---

## 1. Git Branch & Commit Topology

All repository findings in this document were verified directly against the local Git repository and working tree without switching branches, resetting files, or deploying.

| Reference | Commit SHA | Description & Role |
| :--- | :--- | :--- |
| **`HEAD` (Active Branch)** | `7906e56ad4efd58987d182a83bf7e89029e328d5` | `release/final-launch-candidate` (`fix(design-intelligence): align split comparison, unclip slider handle, re-shoot Linear reference`) — Direct child of `80f709d`. |
| **`HEAD~1` (Audited Baseline)** | `80f709d67e3e775390caf0c9bc7ce20dd71ed547` | `docs(design-intelligence): reconcile April/November inspection dates, Class A/D token separation, and dual motion curves` — Contains the Four-Room React SPA architecture (`/`, `/work/`, `/build/`, `/lab/`, `/method/`), Design Intelligence Studies 01–03 (`/lab/design-intelligence/`), and launch-blocker fixes. |
| **`origin/release/final-launch-candidate`** | `80f709d67e3e775390caf0c9bc7ce20dd71ed547` | Remote tracking branch matching local `HEAD`. |
| **`main` / `origin/main`** | `b8a9ab5ecf87aa9d2177691a3bfb780c1338a5d0` | Current production branch (`fix: surface specific API error message in website check UI`). Predates the Four-Room merge and Design Intelligence studies. |
| **`release/candidate-preview`** | `52e179dc0136e72c9b07a0ba5d80cdb7f9f6d765` | Earlier preview candidate (`Finalize ContextMuse launch remediation and visual system`). |
| **`chore/reconcile-main-into-candidate`** | `52e179dc0136e72c9b07a0ba5d80cdb7f9f6d765` | Reconciliation branch pointing to `52e179d`. |
| **Historical Merge Ancestor** | `6a29602` | `feat: add Design Intelligence case studies 01-03 and interactive lab workbench` — Merged into `80f709d`. |

### Working Tree State (Preserved Intact)
- **Modified tracked files (10):**
  - `api/_lib/lead_service.js`
  - `api/lead.js`
  - `src/components/inquiry/BriefDrawer.jsx`
  - `src/components/work/ProofViewer.jsx`
  - `src/data/contentRegistry.js`
  - `src/data/designIntelligenceStudiesData.js`
  - `src/data/projects.js`
  - `src/index.css`
  - `src/pages/DesignIntelligenceCaseStudy.jsx`
  - `src/pages/Lab.jsx`
- **Untracked files prior to Task 01:**
  - `docs/visual-measurement-and-token-application-case-study.md`
  - `public/images/case-study-4x3/` (8 standardized 4:3 visual measurement plates)
  - `tests/lead-api.unit.test.mjs`

---

## 2. Deployment & Build Configuration

| Configuration File | Verified Settings |
| :--- | :--- |
| `.vercel/project.json` | `projectName: "contextmuse-ishn"`, `projectId: "prj_yg39KoP2EeVRl4LRceIPEmRil6pb"`, `orgId: "team_DUPO4pRR0y7zVvSBy7C0ykq4"` |
| `package.json` | `"build": "vite build"`, `"build:spa": "node scripts/build-spa.mjs"`, `"dev": "vite"`, `"lint": "eslint src --quiet"`, `"test:lead": "node scripts/test_lead_backend.mjs"`, `"test:design-intelligence": "node scripts/verify_design_intelligence_case_study.mjs"` |
| `vite.config.js` | Builds React SPA (`spa.html` -> `.spa-dist/` when invoked via `scripts/build-spa.mjs`). Root static files (`robots.txt`, `sitemap.xml`, `styles.css`, `script.js`, `404.html`, `privacy/`, `terms/`, etc.) reside directly in the repository root. |
| `scripts/build-spa.mjs` | Runs `npx vite build` from `spa.html` into `.spa-dist/`, copies hashed bundles (`spa-*.js`, `spa-*.css`, `manifest-*.json`) into root `assets/`, and generates 7 route-specific HTML entry files (`index.html`, `work/index.html`, `build/index.html`, `lab/index.html`, `lab/design-intelligence/index.html`, `design-intelligence/index.html`, `method/index.html`) with injected `<title>`, `<meta>`, `<link rel="canonical">`, and JSON-LD from `src/lib/seoRoutes.js`. |
| `vercel.json` | Defines `trailingSlash: true`, 17 redirects (1 host redirect + 16 path redirects, including `/pricing/` -> `/method/#ways-to-work-together`), 12 SPA rewrites, and security/noindex headers. |
| `.vercelignore` | Excludes internal operational folders (`private/`, `records/`, `evidence/`, `legal/`, `message-analysis/`, `reports/`, `backups/`, `drafts/`, `exports/`, `data/`, `scratch/`, `.env`, `*.db`, `*.map`) and all 9 unapproved prototype folders (`dealsignal/`, `star-gift/`, `istar-map/`, `tiktok-shop-roi-analyzer/`, `twenty-minute-override/`, `southern_smoke/`, `sixes-and-sevens/`, `rudyards-comedy/`, `preview/`). |

---

## 3. Verified Dual-Architecture Coexistence

ContextMuse currently operates **two distinct architectures side by side** in the same repository and build output:

### Architecture A — New Four-Room React SPA (`src/`)
- **Entry Point:** `src/main.jsx` -> `src/App.jsx` (React 18 + React Router v6 + Tailwind CSS + Framer Motion).
- **Navigation Shell:** `src/components/site/SiteHeader.jsx` (Four-Room dropdown + `"What do you need?"` drawer + `"Start a Brief"` drawer trigger) and `src/components/site/SiteFooter.jsx` (`Index`, `Acquisition` modal trigger, `Privacy`, `Terms`).
- **Active Mounted Routes (`src/App.jsx`):**
  1. `/` (`src/pages/Home.jsx`) — Editorial Dark (`#23282A`) Hero + Four-Room Quadrant (`RoomTile.jsx`) + `FeaturedProof.jsx` + `NeedSelector.jsx`.
  2. `/work` & `/work/` (`src/pages/Work.jsx`) — Flagship showcases (`Wolf Ridge Dumpsters`, `INNcontrol`, `GenSort`, `Signal`), categorized project cards, full `ContentIndexSection` registry (`#content-index`), and `?case=<id>` modal (`ProofViewer.jsx`).
  3. `/index` (`src/App.jsx` line 97) — Client-side route alias rendering `<Work />` and scrolling to `#content-index`. *(Note: lacks a dedicated static `index/index.html` or `vercel.json` rewrite).*
  4. `/build` & `/build/` (`src/pages/Builds.jsx`) — Interactive `Whiteboard.jsx` canvas, 3 build tracks (`Websites & Quoting`, `Custom Software`, `Original Products`), interactive `FlowBuilderModal.jsx`, and `BriefDrawer.jsx` lead intake.
  5. `/lab` & `/lab/` (`src/pages/Lab.jsx`) — Interactive `Workbench.jsx` (Sizing Logic, Audit Preview, Flow Preview), Design Intelligence banner, live products (`GenSort`, `Signal`, `Contest Atlas / WCSM`, `Self-Cartography`, `Revision Atlas`, `Website + System Check`), and creative systems (`How to Explain Yourself to Wolves`, `MadeOfReasons`, `BrainRaccoon`, `Maps With Teeth`).
  6. `/lab/design-intelligence` & `/design-intelligence` (`src/pages/DesignIntelligenceCaseStudy.jsx`) — Three Design Intelligence studies (01 Layout Grammar, 02 Live Site Calibrations, 03 Interactive Workbench & Visual Measurement).
  7. `/method` & `/method/` (`src/pages/Method.jsx`) — 4-step operating sequence, `MethodDetail.jsx` evidence drawer, `Ways to Work Together` pricing tiers (`$2,500`, `$6,500`, `Custom Scope`, `$395` diagnostic), and founder section.
  8. `*` (`src/lib/PageNotFound.jsx`) — Client-side 404 fallback.

### Architecture B — Legacy Static Multi-Page HTML + Standalone Sub-Apps
- **Styling & Scripts:** `/styles.css?v=4.4` (`public/styles.css`) + `/script.js?v=4.2` (`public/script.js`).
- **Legacy Navigation Shell (`partials/nav.html` & hardcoded `<nav class="navbar">` across 35+ static HTML files):**
  - Top-level links: `Work` (`/work/`, `/systems/client-builds/`, `/proof-of-work/`), `Services` (`/services/`, `/services/quote-lead-systems/`, `/website-system-check/`, `/systems/`, `/restaurant-systems/`, `/partners/`), `Products` (`/signal/`, `/gensort/`), `Creative` (`/creative/`), `About` (`/about/`), and CTA `Start a Project` (`/contact/`).
- **Standalone Interactive Sub-Applications (6):**
  - `/cxm_gensort/index.html` (GenSort Studio live application)
  - `/cartography/index.html` (Self-Cartography V1 interactive application)
  - `/wcsm/index.html` (Contest Atlas / Writing Contest Submission Manager live application)
  - `/inncontrol-v2/index.html` (INNcontrol V2 static page)
  - `/website-system-check/index.html` (Interactive Website + System Check diagnostic tool wired to `/api/diagnostic` & `/api/lead`)
  - `/signal/demo/index.html` (Interactive 3-stage Signal POS diagnostic workbench)
