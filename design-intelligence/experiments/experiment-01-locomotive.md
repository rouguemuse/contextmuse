# ContextMuse — Design Intelligence Experiment 01 (`locomotive.ca/en`)

- **Reference Profile:** [`design-intelligence/references/locomotive.md`](../references/locomotive.md) (`https://locomotive.ca/en`)
- **Baseline Branch:** `release/candidate-preview` (`52e179d`)
- **Isolated Experiment Branch:** `experiment/design-intelligence-01-locomotive`
- **Production / Release Branch Status:** Untouched (`main` at `b8a9ab5`, `release/candidate-preview` at `52e179d`)

---

## Phase 2: Comparative Analysis (5 Transferable Principles)

| # | Transferable Principle from Locomotive (`locomotive.ca/en`) | ContextMuse Baseline (`52e179d`) | Expected Benefit |
| :--- | :--- | :--- | :--- |
| **1** | **Outer Grid Margin Plumb-Line (`40px` Desktop / `20px` Mobile)** — Locomotive aligns `.c-header`, hero headings, and `.c-footer` to an exact `40px` desktop (`--grid-margin: 2.667rem`) and `20px` mobile outer margin. | `SiteHeader` and `SiteFooter` used `px-4 sm:px-6` (`16px` mobile / `24px` desktop) while `HeroPanel` used `px-6 sm:px-10 xl:px-12` (`24px` mobile / `40–48px` desktop), misaligning the logo and headline by `16px`. | Establishes a single uninterrupted vertical plumb line (`x = 40px` desktop, `x = 20px` mobile) from the `contextmuse®` logo through the eyebrow, headline, CTAs, capability pillars, and footer. |
| **2** | **Zero-Radius Structural Framing (`border-radius: 0px`, `2px` Rules)** — Locomotive's buttons (`.c-button`), section overlines (`.c-section-overline_inner`), and index lists use `0px` border radius and `2px` structural borders rather than rounded pills or drop shadows. | `HeroPanel` CTAs used `rounded shadow-lg` (`4px` radius + drop shadow), clashing with the sharp `0px` architectural framing of `SiteHeader` (`Four Rooms`, `My Ideas`) and the 2×2 room quadrant grid. | Harmonizes the entire homepage under one sharp architectural geometry (`border-radius: 0px`, `2px` structural borders and overlines). |
| **3** | **Asymmetric Ease-Out Quint Choreography (`cubic-bezier(0.23, 1, 0.32, 1)`, `450ms` enter / `200ms` leave)** — Deliberate, weighted hover entry (`0.45s`) paired with crisp exit (`0.2s`), without pigment-washing `brightness()` filters. | `RoomTile` used uniform `transition-all duration-300 hover:brightness-105`, which washed out ContextMuse's dark charcoal (`#23282A`) and bone (`#DFDACE`) pigments on hover. | Preserves exact surface pigments on hover while delivering responsive, tactile quintic motion (`450ms` enter / `200ms` leave). |
| **4** | **Interactive Project-Preview & Motif Feedback on Hover** — Hovering a project row in Locomotive triggers a `450ms` quintic inline visual expansion and underline activation (`text-decoration-thickness: 2px`). | `RoomTile` motifs were static on hover, and Room 02 (`Custom Builds`) used an off-palette Tailwind red badge (`bg-red-100/90 text-red-900 border-red-300`) for `02 Quoting`. | Replaces the off-palette red badge with ContextMuse's authentic `#D9A62E` mustard / `#23282A` ink tokens and wires quintic hover responses into each room's motif and bottom cue. |
| **5** | **Calibrated Fluid Typographic Ratios (`1.02` Display, `1.35` Room Blurbs)** — Strict separation between tight display headings (`1.00–1.10`) and compact grid descriptions (`1.30–1.35`). | Room titles jumped between fixed Tailwind breakpoints (`text-2xl sm:text-3xl lg:text-[28px] xl:text-3xl`) and room blurbs used `text-xs leading-snug` (`12px`). | Smooths room title scaling (`clamp(1.65rem, 2.15vw, 2.125rem)`, `leading-[1.02]`, `tracking-[-0.02em]`) and upgrades room blurb legibility to `13px` / `1.35`. |

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
