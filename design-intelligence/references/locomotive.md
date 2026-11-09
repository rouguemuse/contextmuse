# Design Intelligence Reference Profile — Locomotive (`locomotive.ca/en`)

- **Reference URL:** `https://locomotive.ca/en`
- **Original Inspection Date:** `2026-04-12` (initial DOM/CSS token extraction & homepage transfer study); **Automated Verification Timestamp:** `2026-11-08` (Playwright headless verification pass; host machine clock set to Nov 2026)
- **Viewports Inspected:**
  - **Desktop:** `1440 × 900` (`deviceScaleFactor: 2`, `scrollHeight: 6598px`)
  - **Mobile:** `390 × 844` (`deviceScaleFactor: 2`, `scrollHeight: 5438px`)
- **Stylesheet Accessibility:** `2` accessible same-origin stylesheets inspected (`0` cross-origin blocked sheets)
- **Reference Captures:**
  - Desktop Above-the-Fold: `locomotive_ref_desktop_above_fold.png`
  - Mobile Above-the-Fold: `locomotive_ref_mobile_above_fold.png`

---

## 1. Epistemic Classification (Measured vs. Inferred vs. Inaccessible)

### A. Directly Measured Values (`getComputedStyle`, `cssRules`, `getBoundingClientRect`)
- All `:root` CSS custom properties (`--font-size`, `--grid-columns`, `--grid-gutter`, `--grid-margin`, `--spacing-*`, `--transition-*`, `--font-size-*`).
- Font families, `@font-face` declarations, computed `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `textTransform`, and `marginBottom` at `1440×900` and `390×844`.
- Grid column tracks (`12 × 95px` on desktop, `4 × 80px` on mobile), gutters (`20px` desktop, `20px 10px` mobile), outer margins (`40px` desktop, `20px` mobile), and structural border thicknesses (`2px solid` desktop, `1px solid` mobile).
- CSS transition properties, durations (`0.45s` enter / `0.2s` leave / `0.3s` UI), and cubic-bezier easing functions (`cubic-bezier(0.23, 1, 0.32, 1)` and `cubic-bezier(0.215, 0.61, 0.355, 1)`).

### B. Inferred Design Patterns
- **Asymmetric Motion Choreography:** Enter transitions (`--transition-speed-enter: 0.45s`) are deliberately 2.25× longer than exit transitions (`--transition-speed-leave: 0.2s`), paired with an Ease-Out Quint curve (`cubic-bezier(0.23, 1, 0.32, 1)`). This makes hover initiation feel luxurious and weighted while hover release snaps back without lag.
- **Dual-Voice Editorial Hierarchy:** A display serif/editorial voice (`LocomotiveNew`, weight `400`, tight `1.0–1.10` line-height) is reserved strictly for primary statements (`70px`–`110px`), while aneo-grotesque workhorse (`HelveticaNowDisplay`, weight `400`, `1.20–1.30` line-height) handles every index row, label, navigation item, button, and body paragraph (`26px` lead/UI scale and `15px` base scale).
- **Zero-Radius Structural Framing:** Interactive buttons (`.c-button`), section overlines (`.c-section-overline_inner`), and project index lists (`.c-featured-links_list`) use `border-radius: 0px` and crisp horizontal hairlines/rules (`2px` desktop / `1px` mobile) rather than rounded cards or drop shadows.
- **Exposed Grid Discipline:** Every major section aligns to a 12-column grid (`left: 40px`, `width: 1360px` at `1440px`), with secondary content offset cleanly to column 7 (`left: 730px`, `width: 670px` — an exact 50% split of the 12-column grid plus gutter).

### C. Inaccessible / Runtime-Only Details (Not Invented)
- **Hero Canvas / Video Shader Pipeline:** The pixelated/video portrait hero (`.c-home-hero`) is rendered via runtime media/canvas layers whose internal shader uniforms or video encoding timelines are not exposed as static CSS tokens.
- **Proprietary Font Metrics:** `PPLocomotiveNew-Light.woff2` and `HelveticaNowDisplay-Regular.woff2` internal OpenType tables (ascender/descender/cap-height ratios) are binary font data; only their rendered bounding boxes and CSS declarations are measured.
- **JavaScript Scroll-Linked Interpolation:** `--mapped-progress: calc((var(--progress) - 0.5) / 0.5)` depends on a runtime JS scroll observer updating `--progress` during scroll.

---

## 2. Measured Design Tokens

### 2.1 Root & Global Variables (`:root`)

| Token | Measured Value (Desktop `1440×900`) | Measured Value (Mobile `390×844`) | Notes |
| :--- | :--- | :--- | :--- |
| `--font-size` (Root `1rem`) | `15px` | `15px` | Base `rem` unit (`1rem = 15px`) |
| `--color` | `#FFFFFF` | `#FFFFFF` | Foreground token in dark/hero contexts |
| `--color-bg` | `#000000` | `#000000` | High-contrast base background token |
| `--menu-color-bg` | `#312DFB` | `#312DFB` | Electric ultramarine navigation accent |
| `--grid-columns` | `12` | `4` (via `.o-grid.-col-4@to-small`) | 12-col desktop, 4-col mobile |
| `--grid-gutter` | `20px` | `10px` col / `20px` row | Grid gap between columns |
| `--grid-margin` | `2.6666666667rem` (`40px`) | `20px` | Outer horizontal page margin |
| `--header-height` | `4rem` (`60px`) | `60px` | Fixed/top header height |
| `--transition-speed-enter` | `0.45s` (`450ms`) | `0.45s` (`450ms`) | Hover/interaction entry duration |
| `--transition-speed-leave` | `0.2s` (`200ms`) | `0.2s` (`200ms`) | Hover/interaction exit duration |
| `--transition-easing` | `cubic-bezier(0.23, 1, 0.32, 1)` | `cubic-bezier(0.23, 1, 0.32, 1)` | Primary Ease-Out Quint curve |

### 2.2 Spacing Scale (`--spacing-*`)

| Token Name | Desktop Value (`px`) | Mobile Value (`px`) | Ratio (Desktop : Mobile) |
| :--- | :--- | :--- | :--- |
| `--spacing-micro` | `14px` | `8px` | `1.75×` |
| `--spacing-tiny` | `20px` | `20px` | `1.00×` |
| `--spacing-small` | `30px` | `30px` | `1.00×` |
| `--spacing-medium` | `40px` | `40px` | `1.00×` |
| `--spacing-large` | `80px` | `52px` | `1.54×` |
| `--spacing-big` | `150px` | `80px` | `1.88×` |
| `--spacing-huge` | `200px` | `100px` | `2.00×` |
| `--spacing-enormous` | `250px` | `140px` | `1.79×` |

---

## 3. Typography Hierarchy (Measured at `1440×900` & `390×844`)

### 3.1 Font Stack Declarations
- **Display / Editorial Voice (`LocomotiveNew`):**
  ```css
  font-family: LocomotiveNew, -apple-system, BlinkMacSystemFont, "avenir next", avenir, "segoe ui", "helvetica neue", helvetica, sans-serif;
  font-weight: 400;
  ```
- **Primary UI / Workhorse Voice (`HelveticaNowDisplay`):**
  ```css
  font-family: HelveticaNowDisplay, -apple-system, BlinkMacSystemFont, "avenir next", avenir, "segoe ui", "helvetica neue", helvetica, sans-serif;
  font-weight: 400;
  ```

### 3.2 Measured Type Scale & Line-Height Ratios

| Role / Selector | Font Family | Desktop Size (`1440px`) | Desktop Line-Height (Ratio) | Mobile Size (`390px`) | Mobile Line-Height (Ratio) | Weight / Transform |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Featured Project Display** (`.c-featured-links_title`) | `LocomotiveNew` | `110px` (`7.64vw`) | `110px` (`1.00`) | `40px` | `40px` (`1.00`) | `400` / `none` |
| **Hero & Section H1** (`.c-heading.-h1`, `--font-size-h1`) | `LocomotiveNew` | `70px` (`4.67rem`) | `77px` (`1.10`) | `36px` | `39.6px` (`1.10`) | `400` / `none` |
| **Heading H2 Token** (`--font-size-h2`) | `HelveticaNowDisplay` | `38px` (`2.53rem`) | `1.15–1.20` | — | — | `400` / `none` |
| **Heading H3 Token** (`--font-size-h3`) | `HelveticaNowDisplay` | `32px` (`2.13rem`) | `1.15–1.20` | — | — | `400` / `none` |
| **UI Lead / Nav / Index / Button** (`.o-text.-medium`, `.c-header_logo`, `.c-header-menu_link`, `.c-list_link`, `.c-button_label`) | `HelveticaNowDisplay` | `26px` (`1.733rem`) | `31.2px` (`1.20`) / `26px` (`1.00` on buttons) | `18px` | `21.6px` (`1.20`) / `18px` (`1.00` on buttons) | `400` / `none` |
| **Heading H4 Token** (`--font-size-h4`) | `HelveticaNowDisplay` | `20px` (`1.33rem`) | — | — | — | `400` / `none` |
| **Heading H5 Token** (`--font-size-h5`) | `HelveticaNowDisplay` | `18px` (`1.20rem`) | — | — | — | `400` / `none` |
| **Heading H6 Token** (`--font-size-h6`) | `HelveticaNowDisplay` | `16px` (`1.067rem`) | — | — | — | `400` / `none` |
| **Body / Grid Copy** (`html`, `body`, `.o-grid`) | `HelveticaNowDisplay` | `15px` (`1.00rem`) | `19.5px` (`1.30`) | `15px` | `19.5px` (`1.30`) | `400` / `none` |

---

## 4. Grid Proportions, Alignment & Structural Hairlines

### 4.1 Desktop Grid (`1440 × 900`)
- **Outer Container Width:** `1360px` (`left: 40px`, `right: 40px`).
- **12-Column Track Definition:** `grid-template-columns: repeat(12, 95px)` with `column-gap: 20px` (`12 × 95 + 11 × 20 = 1140 + 220 = 1360px`).
- **4-Column Subgrid (`.o-grid.-col-4.-gutters`):** `grid-template-columns: repeat(4, 325px)` with `column-gap: 20px` (`4 × 325 + 3 × 20 = 1300 + 60 = 1360px`).
- **Asymmetric Split Alignment:**
  - Left structural column starts at `x = 40px` (Column 1).
  - Right content/index column starts at `x = 730px` (`width: 670px`, spanning Columns 7–12: `6 × 95 + 5 × 20 = 670px`).
  - Sub-columns inside the right half use `2 × 325px` with a `20px` gutter (`x = 730px` and `x = 1075px`).

### 4.2 Mobile Grid (`390 × 844`)
- **Outer Container Width:** `350px` (`left: 20px`, `right: 20px`).
- **4-Column Track Definition:** `grid-template-columns: repeat(4, 80px)` with `column-gap: 10px`, `row-gap: 20px` (`4 × 80 + 3 × 10 = 320 + 30 = 350px`).
- **2-Column Subgrid:** `grid-template-columns: repeat(2, 170px)` with `column-gap: 10px` (`2 × 170 + 10 = 350px`).

### 4.3 Overline & Divider Architecture (`.c-section-overline_inner`)
- Every structured section begins with a full-width top overline rule:
  - **Desktop:** `border-top: 2px solid rgb(0, 0, 0)` with `padding-top: 7px` immediately above the 4-column or 12-column row.
  - **Mobile:** `border-top: 1px solid rgb(0, 0, 0)` with `padding-top: 7px`.

---

## 5. Interactive Components, Hover Mechanics & Motion Curves

### 5.1 Motion Curves & Timing
1. **Primary Interactive Curve (`--transition-easing`):**
   - `cubic-bezier(0.23, 1, 0.32, 1)` (Ease-Out Quint — rapid initial velocity, long high-precision deceleration).
   - Paired with `--transition-speed-enter: 0.45s` on hover/focus entry and `--transition-speed-leave: 0.2s` on exit.
2. **Secondary UI Curve:**
   - `cubic-bezier(0.215, 0.61, 0.355, 1)` (Ease-Out Cubic) at `0.15s` (form selects), `0.2s` (`.c-header`), and `0.3s` (`html` background color, floating labels, error clip-paths).

### 5.2 Interactive Component Specifications
- **Full-Width Structural Buttons (`.c-button.-full`):**
  - Dimensions on Desktop: `width: 325px` (1 grid quarter / 3 columns), `height: 48px`, `padding: 10px 0`, `border: 2px solid currentColor`, `border-radius: 0px`.
  - Hover state (`.u-button-hover:hover .c-button_label`): `text-decoration-line: underline; text-decoration-thickness: var(--border-size)`.
- **Featured Project Index Rows (`.c-featured-links_item`):**
  - Row height: `150px` on desktop (`110px` title height + vertical breathing room), `40px–61px` stride on mobile.
  - Hover mechanic (`.c-featured-links_item:hover .c-featured-links_visual`): inline visual/indicator expands horizontally (`width: 1.5em`) with `transition-duration: 0.45s` and `cubic-bezier(0.23, 1, 0.32, 1)`.
- **Editorial List Rows (`.c-team-list_item` / `.c-list_link`):**
  - Bottom border shifts to full `currentColor` on hover (`border-bottom-color: currentcolor`), and secondary action/index markers swap or reveal cleanly (`(+)`).
