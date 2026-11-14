# ContextMuse — Design Intelligence Experiment 01 (`locomotive.ca/en`)

- **Reference Profile:** [`design-intelligence/references/locomotive.md`](../references/locomotive.md) (`https://locomotive.ca/en` — Original inspection `2026-04-12`; automated verification `2026-11-08`)
- **Baseline Branch:** `release/candidate-preview` (`52e179d`)
- **Isolated Experiment Branch:** `experiment/design-intelligence-01-locomotive`
- **Production / Release Branch Status:** Untouched (`main` at `b8a9ab5`, `release/candidate-preview` at `52e179d`)

---

## Phase 2: Comparative Analysis (5 Transferable Principles)

| # | Observed Locomotive Source Token (`locomotive.ca/en`, Class A/B) | ContextMuse Baseline (`52e179d`) | Deliberate ContextMuse Adaptation (`Class D`) & Measured Result |
| :--- | :--- | :--- | :--- |
| **1** | **Outer Grid Margin Plumb-Line (`40px` Desktop / `20px` Mobile)** — Locomotive aligns `.c-header`, hero headings, and `.c-footer` to an exact `40px` desktop (`--grid-margin: 2.667rem`) and `20px` mobile outer margin. | `SiteHeader` and `SiteFooter` used `px-4 sm:px-6` (`16px` mobile / `24px` desktop) while `HeroPanel` used `px-6 sm:px-10 xl:px-12` (`24px` mobile / `40–48px` desktop), misaligning the logo and headline by `16px`. | Establishes a single uninterrupted vertical plumb line (`x = 40px` desktop, `x = 20px` mobile) from the `contextmuse®` logo through the eyebrow, headline, CTAs, capability pillars, and footer. |
| **2** | **Zero-Radius Structural Framing (`border-radius: 0px`, `2px` Rules)** — Locomotive's buttons (`.c-button`), section overlines (`.c-section-overline_inner`), and index lists use `0px` border radius and `2px` structural borders rather than rounded pills or drop shadows. | `HeroPanel` CTAs used `rounded shadow-lg` (`4px` radius + drop shadow), clashing with the sharp `0px` architectural framing of `SiteHeader` (`Four Rooms`, `My Ideas`) and the 2×2 room quadrant grid. | Harmonizes the entire homepage under one sharp architectural geometry (`border-radius: 0px`, `2px` structural borders and overlines). |
| **3** | **Dual Measured Motion Curves (`Class A` / `Class B`)** — (1) Primary interactive curve on `:root` (`--transition-easing: cubic-bezier(0.23, 1, 0.32, 1)`, Ease-Out Quint) with `--transition-speed-enter: 0.45s` (`450ms`) and `--transition-speed-leave: 0.2s` (`200ms`) on `.c-featured-links_item:hover .c-featured-links_visual`; (2) Secondary UI curve `cubic-bezier(0.215, 0.61, 0.355, 1)` (Ease-Out Cubic) at `0.15s` (form `<select>`), `0.2s` (`.c-header`), and `0.3s` (`html` background, floating labels, error clip-paths). | `RoomTile` used uniform `transition-all duration-300 hover:brightness-105`, which washed out ContextMuse's dark charcoal (`#23282A`) and bone (`#DFDACE`) pigments on hover. | Transfers the primary `:root` quintic curve (`cubic-bezier(0.23, 1, 0.32, 1)`, `450ms` enter / `200ms` leave) to ContextMuse `.quint-transition` and `RoomTile` while removing `brightness(1.05)` (`Class D`). |
| **4** | **Source Palette (`#000000` / `#FFFFFF` / `#312DFB`, `Class A`) & Project-Row Hover (`Class B`)** — Locomotive declares stark monochrome (`--color-black: #000000`, `--color-white: #FFFFFF`) with electric ultramarine (`--menu-color-bg: #312DFB`) and triggers a `450ms` inline visual expansion + `2px` underline on project-row hover. | `RoomTile` motifs were static on hover, and Room 02 (`Custom Builds`) used an off-palette Tailwind red badge (`bg-red-100/90 text-red-900 border-red-300`) for `02 Quoting`. | Deliberately retains ContextMuse's editorial palette (`#EDE9E0` bone, `#23282A` charcoal, `#D9A62E` mustard, `#17504A` forest — `Class D` adaptation) rather than copying `#000000`/`#312DFB`, replacing the off-palette red badge with `#D9A62E` / `#23282A` and wiring `450ms/200ms` hover responses into each room's motif and bottom cue. |
| **5** | **Source Typography (`LocomotiveNew` + `HelveticaNowDisplay` wt `400`, `Class A/B`)** — Locomotive pairs `LocomotiveNew` (`weight 400`, `70px–110px`, `lh 1.00–1.10`) with `HelveticaNowDisplay` (`weight 400`, `15px` body at `1.30` lh, `26px` UI lead at `1.20` lh, `-0.02em` tracking). | Room titles jumped between fixed Tailwind breakpoints (`text-2xl sm:text-3xl lg:text-[28px] xl:text-3xl`) and room blurbs used `text-xs leading-snug` (`12px`). | Deliberately preserves ContextMuse's `Chivo` (`800–900` uppercase) + `JetBrains Mono` (`600`) voice (`Class D` adaptation) while adopting Locomotive's tight display line-height (`1.02`), `-0.02em` tracking (`clamp(1.65rem, 2.15vw, 2.125rem)`), and `13px` / `1.35` room blurb ratio. |

---

## Phase 3: Controlled Experiment (3 Focused Refinements Implemented)

1. **Refinement 1 — Plumb-Line Outer Margin Alignment & Zero-Radius Structural CTAs (`SiteHeader.jsx`, `HeroPanel.jsx`, `SiteFooter.jsx`):**
   - Unified horizontal padding to `px-5 sm:px-8 lg:px-10` across header, hero panel, and footer (`x = 20px` on `390px` mobile; `x = 40px` on `1440px` desktop).
   - Converted `Explore the Work` and `Start a Project` buttons to `rounded-none` (`0px` radius) with `border-2` framing and full-width mobile alignment (`justify-between sm:justify-center`).
2. **Refinement 2 — Fluid Quadrant Typography & `2px` Overline Hierarchy (`HeroPanel.jsx`, `RoomTile.jsx`):**
   - Upgraded room header rules (`01 / INSPECT`, etc.) and the hero capability-pillar divider to `2px` structural overlines (`border-b-2` / `border-t-2`) that intensify on hover (`group-hover:border-current/55`).
   - Calibrated `RoomTile` headings to `clamp(1.65rem, 2.15vw, 2.125rem)` (`30.96px` at `1440px`, `line-height: 1.02`) and room blurbs to `13px` (`line-height: 1.35`, `max-w-[42ch]`).
   - *Self-Correction during evaluation:* An experimental `border-t-2` above the hero eyebrow and a narrower `48ch` hero paragraph measure were reverted after visual inspection because the top rule competed with the adjacent `01 / INSPECT` underline and `48ch` wrapped `realized.` onto a 3rd line on mobile.
3. **Refinement 3 — Quintic Asymmetric Tile & Motif Micro-Interactions (`src/index.css`, `RoomTile.jsx`):**
   - Added `--ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1)`, `--duration-enter: 450ms`, `--duration-leave: 200ms`, and `.quint-transition` in `src/index.css`.
   - Removed `hover:brightness-105` from `RoomTile.jsx` (`filter: none`).
   - Replaced the off-palette red `02 Quoting` chip in Room 02 with ContextMuse `#D9A62E` mustard / `#23282A` ink (`bg-[#D9A62E]/30 border-[#D9A62E] group-hover:bg-[#D9A62E]`) and added quintic hover responses across all four room motifs and bottom navigation cues.

---

## Phase 4: Quantitative & Visual Evaluation

| Metric / Gate | Before (`52e179d`) | After (`experiment/design-intelligence-01-locomotive`) | Verdict |
| :--- | :--- | :--- | :--- |
| **Desktop Left Plumb Line (`1440×900`)** | Logo `24px`, Hero `48px`, Footer `24px` (`24px` drift) | Logo `40px`, H1 `40px`, CTA `40px`, Footer `40px` (`0px` drift) | **Improved** |
| **Mobile Left Plumb Line (`390×844`)** | Logo `16px`, Hero `24px`, Footer `16px` (`8px` drift) | Logo `20px`, H1 `20px`, CTA `20px`, Footer `20px` (`0px` drift) | **Improved** |
| **CTA & Grid Corner Geometry** | Mixed (`4px` rounded CTAs vs. `0px` header/tiles) | Unified `0px` architectural framing across header, CTAs, and tiles | **Improved** |
| **Room 02 (`Custom Builds`) Motif Palette** | Off-palette Tailwind red (`bg-red-100 text-red-900`) | On-palette `#D9A62E` mustard + `#23282A` ink with hover fill | **Improved** |
| **Hover Surface Fidelity & Easing** | `brightness(1.05)` washout, uniform `300ms` | Pure surface pigment (`filter: none`), `450ms` enter / `200ms` leave (`cubic-bezier(0.23, 1, 0.32, 1)`) | **Improved** |
| **Smoke & Accessibility Suite** | `11/11 PASS` (`0` errors, `0` overflow) | `11/11 PASS` (`0` errors, `0` overflow, all ARIA/keyboard checks intact) | **Verified** |
