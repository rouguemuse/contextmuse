# Design Intelligence Reference Profile — Linear (`linear.app`)

- **Reference URL:** `https://linear.app/`
- **Extraction Date:** `2026-11-09` (`2026-11-09T12:37:39.587Z`)
- **Viewports Inspected:**
  - **Desktop:** `1440 × 900` (`deviceScaleFactor: 2`, `scrollHeight: 9960px`)
  - **Mobile:** `390 × 844` (`deviceScaleFactor: 2`, `scrollHeight: 5906px`)
- **Stylesheet Accessibility:** `49` accessible same-origin stylesheets on desktop (`47` on mobile), `0` cross-origin blocked sheets
- **Root Theme Declaration:** `<html lang="en" data-theme="dark" style="color-scheme: dark;">`
- **Reference Captures:**
  - Desktop Above-the-Fold: `/assets/images/design-intelligence/linear_ref_desktop_above_fold.png`
  - Mobile Above-the-Fold: `/assets/images/design-intelligence/linear_ref_mobile_above_fold.png`

---

## 1. Epistemic Classification (Declared vs. Computed vs. Inferred)

### A. Explicitly Declared CSS Variables / Design Tokens (`:root` / `[data-theme="dark"]`)
Directly extracted from accessible stylesheets on `https://linear.app/`:
- **Surface Hierarchy (`--color-bg-*`):**
  - `--color-bg-marketing`: `#010102`
  - `--color-bg-primary` / `--color-bg-level-0`: `#08090a`
  - `--color-bg-panel` / `--color-bg-level-1`: `#0f1011`
  - `--color-bg-level-2` / `--color-bg-tint`: `#141516`
  - `--color-bg-level-3`: `#191a1b`
  - `--color-bg-secondary`: `#1c1c1f`
  - `--color-bg-tertiary`: `#232326`
  - `--color-bg-quaternary`: `#28282c`
  - `--color-bg-translucent`: `#ffffff0d` (`rgba(255, 255, 255, 0.05)`)
- **Text Hierarchy (`--color-text-*` / `--color-fg-*`):**
  - `--color-text-primary` / `--color-fg-primary`: `#f7f8f8`
  - `--color-text-secondary` / `--color-fg-secondary`: `#d0d6e0`
  - `--color-text-tertiary` / `--color-fg-tertiary`: `#8a8f98`
  - `--color-text-quaternary` / `--color-fg-quaternary`: `#62666d`
- **Brand, Accent & Semantic Colors:**
  - `--color-brand-bg` / `--color-indigo` / `--focus-ring-color`: `#5e6ad2`
  - `--color-accent`: `#7170ff`
  - `--color-accent-hover` / `--color-link-primary`: `#828fff`
  - `--color-accent-tint`: `#18182f`
  - `--color-button-invert-bg`: `#e5e5e6` (hover: `--color-button-invert-bg-hover: #fff`)
  - `--color-linear-plan`: `#68cc58` | `--color-linear-build`: `#d4b144` | `--color-linear-security`: `#7a7fad`
  - `--color-blue`: `#4ea7fc` | `--color-green`: `#27a644` | `--color-orange`: `#fc7840` | `--color-red`: `#eb5757` | `--color-yellow`: `#f0bf00` | `--color-teal`: `#00b8cc`
- **Borders & Hairlines (`--color-border-*` / `--color-line-*`):**
  - `--border-hairline`: `1px`
  - `--color-border-primary`: `#23252a`
  - `--color-border-secondary`: `#34343a`
  - `--color-border-tertiary`: `#3e3e44`
  - `--color-border-translucent`: `#ffffff0d` (`rgba(255, 255, 255, 0.05)`)
  - `--color-border-translucent-strong` / `--header-border`: `#ffffff14` (`rgba(255, 255, 255, 0.08)`)
  - `--color-line-primary`: `#37393a` | `--color-line-secondary`: `#202122` | `--color-line-tertiary`: `#18191a`
- **Typography Families, Weights & Modular Scale:**
  - `--font-regular`: `"Inter Variable", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", "Helvetica Neue", sans-serif`
  - `--font-monospace`: `"Berkeley Mono", ui-monospace, "SF Mono", "Menlo", monospace`
  - `--font-serif-display`: `"Tiempos Headline", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`
  - `--font-settings`: `"cv01", "ss03"` | `--font-variations`: `"opsz" auto`
  - Fractional variable font weights: `--font-weight-light: 300`, `--font-weight-normal: 400`, `--font-weight-medium: 510`, `--font-weight-semibold: 590`, `--font-weight-bold: 680`
  - Title scale (`--title-1` through `--title-9`):
    - `--title-9`: `4.5rem` (`72px`), line-height `1`, letter-spacing `-.022em`
    - `--title-8`: `4rem` (`64px`), line-height `1.06`, letter-spacing `-.022em`
    - `--title-7`: `3.5rem` (`56px`), line-height `1.1`, letter-spacing `-.022em`
    - `--title-6`: `3rem` (`48px`), line-height `1`, letter-spacing `-.022em`
    - `--title-5`: `2.5rem` (`40px`), line-height `1.1`, letter-spacing `-.022em`
    - `--title-4`: `2rem` (`32px`), line-height `1.125`, letter-spacing `-.022em`
    - `--title-3`: `1.5rem` (`24px`), line-height `1.33`, letter-spacing `-.012em`
    - `--title-2`: `1.25rem` (`20px`), line-height `1.33`, letter-spacing `-.012em`
    - `--title-1`: `1.0625rem` (`17px`), line-height `1.4`, letter-spacing `-.012em`
  - Body text scale (`--text-*`):
    - `--text-large`: `1.0625rem` (`17px`) / `1.6`
    - `--text-regular`: `.9375rem` (`15px`) / `1.6`, letter-spacing `-.011em`
    - `--text-small`: `.875rem` (`14px`) / `calc(21 / 14)` (`1.5`), letter-spacing `-.013em`
    - `--text-mini`: `.8125rem` (`13px`) / `1.5`, letter-spacing `-.01em`
    - `--text-micro`: `.75rem` (`12px`) / `1.4`
    - `--text-tiny`: `.625rem` (`10px`) / `1.5`, letter-spacing `-.015em`
- **Layout, Spacing & Radii:**
  - `--header-height`: `72px` (`--header-blur: 20px`)
  - `--grid-columns`: `12`
  - `--page-max-width`: `1024px` | `--prose-max-width`: `624px`
  - `--homepage-outer-padding`: `46px` | `--homepage-padding-inset`: `32px` | `--page-padding-inline`: `24px` | `--page-padding-block`: `64px`
  - `--radius-4`: `4px` | `--radius-6`: `6px` | `--radius-8`: `8px` | `--radius-12`: `12px` | `--radius-16`: `16px` | `--radius-24`: `24px` | `--radius-32`: `32px` | `--radius-rounded`: `9999px`
- **Shadows & Motion Tokens:**
  - `--shadow-none`: `0px 0px 0px transparent` (Remarkably, `--shadow-tiny`, `--shadow-low`, `--shadow-medium`, and `--shadow-high` all alias to `var(--shadow-none)` in dark mode—relying on `1px` translucent borders rather than drop shadows)
  - `--shadow-stack-low`: `0px 8px 2px 0px #0000, 0px 5px 2px 0px #00000003, 0px 3px 2px 0px #0000000a, 0px 1px 1px 0px #00000012, 0px 0px 1px 0px #00000014`
  - `--speed-quickTransition`: `.1s` (`100ms`) | `--speed-regularTransition`: `.25s` (`250ms`) | `--speed-highlightFadeOut`: `.15s` (`150ms`)
  - `--ease-out-quad`: `cubic-bezier(.25, .46, .45, .94)` | `--ease-out-quart`: `cubic-bezier(.165, .84, .44, 1)` | `--ease-out-quint`: `cubic-bezier(.23, 1, .32, 1)` | `--ease-out-expo`: `cubic-bezier(.19, 1, .22, 1)`

---

### B. Computed Styles Observed in Rendered Components (`getComputedStyle` & `getBoundingClientRect`)

| Component / Selector | Desktop (`1440×900`) Observed Values | Mobile (`390×844`) Observed Values |
| :--- | :--- | :--- |
| **Document Surface (`html`, `body`)** | `background-color: rgb(8, 9, 10)` (`#08090A`), `color: rgb(247, 248, 248)` (`#F7F8F8`), `font-feature-settings: "cv01", "ss03"` | Identical (`#08090A` bg, `#F7F8F8` text) |
| **Sticky Glass Header (`header.TZTsQG_header`)** | `height: 73px`, `backdrop-filter: blur(20px)`, `border-bottom: 1px solid rgba(255, 255, 255, 0.08)`, `background-image: linear-gradient(rgba(11, 11, 11, 0.8) 0%, oklab(0.149576 ... / 0.7619) 100%)` | `height: 65px`, `backdrop-filter: blur(20px)`, `border-bottom: 1px solid rgba(255, 255, 255, 0.08)` |
| **Hero Display Heading (`h1.QI8oKG_title`)** | `x: 78px` (`46px` outer + `32px` inset), `font-size: 64px`, `font-weight: 510`, `line-height: 64px` (`1.00`), `letter-spacing: -1.408px` (`-0.022em`), `color: #F7F8F8` | `x: 23px`, `font-size: 38px`, `font-weight: 510`, `line-height: 41.8px` (`1.10`), `letter-spacing: -0.836px` (`-0.022em`) |
| **Section H2 (`h2`)** | `font-size: 48px`, `font-weight: 510`, `line-height: 48px` (`1.00`), `letter-spacing: -1.056px` (`-0.022em`), `color: #F7F8F8` (primary) / `rgb(138, 143, 152)` (`#8A8F98` muted lead) | `font-size: 24px`, `font-weight: 510`, `line-height: 31.92px` (`1.33`), `letter-spacing: -0.288px` (`-0.012em`) |
| **Hero Lead Copy (`p`)** | `x: 80px`, `font-size: 15px`, `font-weight: 400`, `line-height: 24px` (`1.60`), `letter-spacing: -0.165px` (`-0.011em`), `color: rgb(138, 143, 152)` (`#8A8F98`) | `x: 24px`, `font-size: 15px`, `line-height: 24px` (`1.60`), `color: #8A8F98` |
| **Inverted Primary CTA (`a.S36ykG_variant-invert`, "Sign up")** | `height: 32px`, `padding: 0px 12px`, `font-size: 13px`, `font-weight: 510`, `background-color: rgb(229, 229, 230)` (`#E5E5E6`), `color: rgb(8, 9, 10)` (`#08090A`), `border-radius: 9999px`, `border: 1px solid #E5E5E6`, `transition: 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Identical (`height: 32px`, `font-size: 13px`, `border-radius: 9999px`, `#E5E5E6` fill) |
| **Application Frame Surface (`.WS84WW_frameBackground`)** | `background-color: rgb(16, 17, 18)` (`#101112`), `border-radius: 12px`, `border: 1px solid rgba(255, 255, 255, 0.08)` | `border-radius: 12px`, `border: 1px solid rgba(255, 255, 255, 0.08)` |
| **Interactive Issue / Comment Cards (`.KFZpfa_commentCard`, `._5k-xcq_card`)** | `background-color: rgb(15, 16, 17)` (`#0F1011`) + `linear-gradient(rgba(255,255,255,0.03), rgba(255,255,255,0.03))`, `border-radius: 9px`, `border: 1px solid rgba(255, 255, 255, 0.08)`, `box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 0px 1px`, `padding: 12px 16px 16px` | Carousel cards: `background-color: #0F1011`, `border-radius: 8px`, `border: 1px solid rgba(255, 255, 255, 0.05)`, `padding: 0px 24px 28px` |

---

### C. Inferred Design-System Patterns
1. **Luminance-Stepped Obsidian Elevation (Zero-Drop-Shadow Architecture):** Rather than casting ambient drop shadows (which disappear against `#08090A` backgrounds), Linear aliases `--shadow-low` through `--shadow-high` to `0px 0px 0px transparent` and constructs depth through 4 stepped surface fills (`#08090A` → `#0F1011` → `#141516` → `#191A1B`) bounded by `1px solid rgba(255, 255, 255, 0.05–0.08)` edge-highlight rings.
2. **Fractional Variable Font Weights (`510` / `590` / `680`):** Because dark-mode text suffers from halation (white glyphs bleeding into black backgrounds), Linear avoids standard `600`/`700` bold weights on `Inter Variable` and declares custom intermediate axis weights (`--font-weight-medium: 510`, `--font-weight-semibold: 590`) paired with OpenType stylistic sets `"cv01", "ss03"` and tight negative tracking (`-0.022em` on display, `-0.011em` on body).
3. **High-Density Utility Micro-Scales (`13px`–`15px`):** Marketing copy and embedded product views share the same compact `13px` (`--text-mini`), `14px` (`--text-small`), and `15px` (`--text-regular`) scale, erasing the boundary between marketing chrome and application UI.
4. **Monochrome-First CTA Hierarchy with Reserved Semantic Accents:** Primary actions use high-contrast monochrome inversion (`#E5E5E6` pill button with `#08090A` text), reserving `#5E6AD2` indigo, `#68CC58` plan green, and `#D4B144` build amber strictly for focus rings, status indicators, and semantic telemetry.
