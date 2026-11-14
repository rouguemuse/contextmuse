# 04 — Preservation Register

**Project:** ContextMuse V2 — Controlled Migration & Change-Control System  
**Purpose:** Mandatory preservation inventory of every interactive capability, software product, research study, creative system, case study dataset, and backend integration that **must survive** the V2 migration without regression or accidental deletion.

> [!IMPORTANT]
> Per project non-negotiable rules, **nothing in this register may be deleted, degraded, or hidden** during V2 consolidation. Independent products, research studies, and creative works are first-class studio capabilities—not "off-strategy noise."

---

## 1. Room 02 (`/build/`) — Custom-Build Intake & Interactive Scoping

| Asset / Capability | Primary Source File(s) | Functional Mechanics to Preserve | Verification Criteria |
| :--- | :--- | :--- | :--- |
| **Interactive Whiteboard Canvas** | `src/components/build/Whiteboard.jsx`, `src/pages/Builds.jsx` | Multi-tool scoping canvas supporting Sticky Notes, System Nodes, Text Labels, Freehand Pen sketching, Connector arrows, template presets (`Customer Quote Flow`, `Operations Portal`, `Diagnostic Tool`), undo/clear, and JSON/summary serialization into the project brief. | User can add nodes/notes, load a preset, and click "Attach Whiteboard to Brief" so whiteboard state populates `BriefDrawer`. |
| **3-Track Build Architecture** | `src/pages/Builds.jsx` (lines 14–115) | Track 01 (`Websites & Quoting Systems` — `From $2,500`), Track 02 (`Custom Operational Software` — `From $6,500`), Track 03 (`Original Products & Interactive Tools` — `Custom Scope`). | All 3 tracks render with expandable deliverables, example proof links, and track-specific CTA triggers. |
| **Interactive FlowBuilder Modal** | `src/components/build/FlowBuilderModal.jsx` | 3-step guided system flow configurator (Trigger -> Logic/Calculation -> Output/Action) that synthesizes a structured scope summary and passes it to `BriefDrawer`. | Opening FlowBuilder, selecting steps, and transferring the flow into `BriefDrawer` preserves all selected parameters. |
| **BriefDrawer & `/api/lead` Persistence** | `src/components/inquiry/BriefDrawer.jsx`, `api/lead.js`, `api/_lib/lead_service.js`, `api/_lib/db.js` | Global slide-over intake drawer triggered via `open-brief-drawer` custom event or `?brief=true` URL query; validates name, email, track, budget, and project summary; surfaces `result.error || result.message` cleanly; persists to PostgreSQL (`leads` table) with rate-limiting and honeypot protection. | Unit tests (`tests/lead-api.unit.test.mjs`) and live/local `POST /api/lead` health & validation checks pass 100%. |

---

## 2. Room 01 (`/work/`) — Client Work, Flagship Showcases & Project Registry

### 2.1 Four Distinct Project Classifications (Strict Taxonomy Rule)
V2 must explicitly preserve and accurately label all four categories of studio output:
1. **Commissioned Client Work (`Client Systems`):**
   - **Wolf Ridge / Lone Wolf Dumpsters** (`src/data/projects.js:16-125`, `src/components/work/FlagshipShowcase.jsx`, `work/lone-wolf-dumpsters/index.html`, live at `https://lonewolf-dumpsters.vercel.app/`) — Interactive dumpster sizing engine (`15 yd`, `20 yd`, `30 yd`), contractor commercial portal, and material weight calculator.
   - **INNcontrol — Commercial HVAC & Coil Care** (`src/data/projects.js:127-218`, `src/components/work/InncontrolShowcase.jsx`, live at `https://inncontrol-hvac.vercel.app/`) — Commercial PTAC/coil maintenance scheduling, multi-property readiness tracking, and service documentation platform. *(Must preserve showcase while sanitizing internal dev filenames `scott-daily` and `rpg-dashboard`).*
2. **Client Prototype / Sector Concept Builds (`Commercial Prototypes`):**
   - **Every Day Counts (EDR) Party Rentals** (`src/data/projects.js:433-524`, `case-studies/edr-party-rentals/index.html`) — Event rental package configurator and delivery zone quoting prototype.
   - **Hospitality Concept Builds** (`restaurant-builds/comedy-venue/index.html`, `restaurant-builds/detroit-pizza/index.html`, `restaurant-builds/events-venue/index.html`) — Interactive show-seating, batch-drop pizza throttling, and private event minimum-spend quoting prototypes.
3. **Independent Software Products & Diagnostic Utilities (`Products & Tools`):**
   - **GenSort Studio** (`src/data/projects.js:220-325`, `/cxm_gensort/index.html`, `/gensort/`)
   - **Signal — Restaurant Operational Intelligence** (`src/data/projects.js:856-940`, `src/components/work/SignalShowcase.jsx`, `/signal/`, `/signal/demo/`, `/signal/sample-reports/`, `/signal/intake/`, `/signal/export-instructions/`)
   - **Contest Atlas (WCSM)** (`src/data/projects.js:1017-1095`, `/wcsm/`, `/work/contest-atlas/`)
   - **Self-Cartography** (`src/data/projects.js:942-1015`, `/cartography/`, `/creative/self-cartography/`)
   - **Revision Atlas** (`src/data/projects.js:327-431`, `/work/revision-atlas/`)
   - **Website + System Check** (`src/data/projects.js:765-854`, `/website-system-check/`, `/work/website-audit-system/`, `api/diagnostic.js`)
   - **Client Opportunity Engine** (`/work/client-opportunity-engine/`, `src/data/contentRegistry.js:244-266`)
4. **Civic Initiatives & Creative Systems (`Civic & Creative Work`):**
   - **Maps With Teeth** (`src/data/projects.js:526-604`) — Independent public-interest civic mapping initiative (`role: 'Founder'`).
   - **How to Explain Yourself to Wolves** (`src/data/projects.js:606-683`, `/creative/how-to-explain-yourself-to-wolves/`) — Interactive literary/visual system.
   - **MadeOfReasons** (`src/data/projects.js:685-724`, `https://madeofreasons.com`) — Philosophical & creative web publication.
   - **BrainRaccoon** (`src/data/projects.js:726-763`, `https://brainraccoon.com`) — Experimental creative micro-tools and humor/play system.

### 2.2 Interactive `/work/` Components to Preserve
- **`FlagshipShowcase.jsx`:** Interactive Wolf Ridge Dumpsters browser preview with desktop/mobile viewport toggle and live sizing logic highlights.
- **`InncontrolShowcase.jsx`:** Interactive INNcontrol commercial HVAC platform showcase.
- **`SignalShowcase.jsx`:** Interactive dual-product showcase for `Signal` and `GenSort` with live launch triggers.
- **`ProofViewer.jsx`:** Full-screen case study dossier modal with `Overview`, `Architecture`, `Interactive Preview`, and `Verification Evidence` tabs, plus 4:3 visual specimen support.
- **`ContentIndexSection` (`src/pages/Work.jsx` + `src/data/contentRegistry.js`):** Filterable master directory (`#content-index`) of all studio builds, products, case studies, and essays.

---

## 3. Room 03 (`/lab/`) & Design Intelligence (`/lab/design-intelligence/`)

| Asset / Capability | Primary Source File(s) | Functional Mechanics to Preserve | Verification Criteria |
| :--- | :--- | :--- | :--- |
| **Design Intelligence Studies 01–03** | `src/pages/DesignIntelligenceCaseStudy.jsx`, `src/data/designIntelligenceStudiesData.js`, `public/images/case-study-4x3/` | **Study 01:** Structural Layout Grammar & Token Extraction (Stripe, Linear, Plaid references). **Study 02:** Live Site Calibrations & Before/After Token Application. **Study 03:** Interactive Design Intelligence Workbench & 4:3 Visual Measurement Case Study (`cs_4x3_*.png` plates). | All 3 study tabs, token comparison tables, interactive workbench controls, and 4:3 visual plates render with zero broken assets at 390px, 768px, 1440px, and 1920px. |
| **Lab Interactive Workbench (`Workbench.jsx`)** | `src/components/lab/Workbench.jsx`, `SizingDemo.jsx`, `AuditDemo.jsx`, `FlowDemo.jsx` | 3-module interactive sandbox inside `/lab/`: `01 Dumpster Sizing Logic`, `02 Automated Audit Preview`, and `03 Quote Flow Configurator`. | Switching between all 3 workbench modules updates live calculations and allows transferring context to `/build/`. |
| **Standalone Product Sub-Applications** | `/cxm_gensort/index.html`, `/signal/demo/index.html`, `/wcsm/index.html`, `/cartography/index.html`, `/website-system-check/index.html` | Full client-side execution of all 5 live tools plus `POST /api/diagnostic` for `/website-system-check/`. | All 5 standalone apps load with 200 status, zero console errors, and intact interactive state machines. |
| **Interaction Lab & Cellular Scroll Study** | `/creative/interaction-lab/index.html`, `/creative/cellular-scroll-study/index.html`, `/restaurant-theory/index.html` | Kinetic scroll physics studies and hospitality architecture essay. | Remain accessible and linked from `/lab/` and `#content-index`. |

---

## 4. Room 04 (`/method/`) & Global Architecture

| Asset / Capability | Primary Source File(s) | Functional Mechanics to Preserve | Verification Criteria |
| :--- | :--- | :--- | :--- |
| **4-Step Method & Evidence Drawer** | `src/pages/Method.jsx`, `src/components/method/MethodDetail.jsx`, `src/components/method/methodData.js` | Interactive 4-stage methodology (`01 Immerse`, `02 Map`, `03 Build`, `04 Refine`) with slide-over `MethodDetail` drawer showing real project artifacts. | Clicking each step opens `MethodDetail` with accurate, sanitized project artifacts. |
| **Canonical Studio Pricing Table** | `src/pages/Method.jsx` (`#ways-to-work-together`) | Canonical pricing structure: Websites & Quoting (`From $2,500`; multi-market `$4,500+`), Custom Operational Software (`From $6,500`), Original Products (`Custom Scope`), and Optional Paid Diagnostic (`$395`, credited toward build). | Pricing across `/method/`, `/build/`, `BriefDrawer`, and `/website-system-check/` aligns without contradiction. |
| **Homepage (`#23282A`) & Four-Room Grid** | `src/pages/Home.jsx`, `src/components/home/HeroPanel.jsx`, `src/components/home/RoomTile.jsx`, `src/components/home/FeaturedProof.jsx`, `src/components/home/NeedSelector.jsx` | Approved `#23282A` hero background, non-compulsory four-room grid (`RoomTile`), featured proof cards, and "What do you need?" router. | Preserved intact while upgrading `RoomTile` from `<div role="button">` to semantic `<Link>` / `<a>`. |
| **IP Acquisition Inquiry Flow** | `src/components/site/SiteFooter.jsx` (lines 75–185) | Acquisition modal detailing IP/licensing availability for `GenSort Studio`, `Signal`, and `Contest Atlas (WCSM)`. | Modal remains accessible from footer AND responds at a dedicated route `/acquisition/` so direct visits do not 404. |
| **Route-Specific SEO & JSON-LD** | `src/lib/seoRoutes.js`, `scripts/build-spa.mjs`, `public/sitemap.xml`, `public/robots.txt` | Per-route `<title>`, `<meta name="description">`, OpenGraph/Twitter tags, canonical URLs, and Schema.org JSON-LD. | Every public V2 route has unique metadata and pre-rendered `<main>` fallback content in `dist/`. |
