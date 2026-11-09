# Design Intelligence Reference Profile — Stripe (`stripe.com`)

- **Reference URL:** `https://stripe.com/`
- **Extraction Date:** `2026-11-09` (`2026-11-09T12:37:51.153Z`)
- **Viewports Inspected:**
  - **Desktop:** `1440 × 900` (`deviceScaleFactor: 2`, `scrollHeight: 15438px`)
  - **Mobile:** `390 × 844` (`deviceScaleFactor: 2`, `scrollHeight: 20652px`)
- **Stylesheet Architecture:** `6` external CSS bundles on `https://b.stripecdn.com/mkt-ssr-statics/assets/_next/static/css/*.css` exposing `946` Heavy Design System (`--hds-*`) CSS custom properties
- **Reference Captures:**
  - Desktop Above-the-Fold: `/assets/images/design-intelligence/stripe_ref_desktop_above_fold.png`
  - Mobile Above-the-Fold: `/assets/images/design-intelligence/stripe_ref_mobile_above_fold.png`

---

## 1. Epistemic Classification (Declared vs. Computed vs. Inferred)

### A. Explicitly Declared CSS Variables / Design Tokens (`--hds-*`)
Directly extracted from Stripe's production stylesheet bundles (`b.stripecdn.com`):
- **Core Brand & Action Palette (`--hds-color-core-brand-*` & `--hds-color-action-*`):**
  - `--hds-color-core-brand-600` (`--hds-color-action-bg-solid`, `--hds-color-button-primary-bg`): `#533afd` (`rgb(83, 58, 253)`)
  - `--hds-color-core-brand-700` (`--hds-color-action-bg-solidHover`): `#4032c8`
  - `--hds-color-core-brand-800` (`--hds-color-action-text-solidHover`): `#2e2b8c`
  - `--hds-color-core-brand-500`: `#665efd` | `--hds-color-core-brand-400`: `#7f7dfc` | `--hds-color-core-brand-200`: `#b9b9f9` | `--hds-color-core-brand-100`: `#d6d9fc` | `--hds-color-core-brand-50`: `#e8e9ff` | `--hds-color-core-brand-25`: `#f5f5ff`
  - `--hds-canary-color-border-focus`: `#635bff`
- **Core Neutral & Surface Palette (`--hds-color-core-neutral-*` & `--hds-color-core-neutralDark-*`):**
  - `--hds-color-core-neutral-0` (`--hds-color-surface-bg-quiet`): `#fff` (`#FFFFFF`)
  - `--hds-color-core-neutral-25` (`--hds-color-surface-bg-subdued`): `#f8fafd` (`rgb(248, 250, 253)`)
  - `--hds-color-core-neutral-50` (`--hds-color-surface-border-quiet`): `#e5edf5` (`rgb(229, 237, 245)`)
  - `--hds-color-core-neutral-100`: `#d4dee9` | `--hds-color-core-neutral-200`: `#bac8da` | `--hds-color-core-neutral-300`: `#95a4ba`
  - `--hds-color-core-neutral-400` (`--hds-color-text-quiet`): `#7d8ba4`
  - `--hds-color-core-neutral-500` (`--hds-color-text-subdued`, `--hds-color-heading-subdued`): `#64748d` (`rgb(100, 116, 141)`)
  - `--hds-color-core-neutral-600` (`--hds-color-text-soft`): `#50617a` (`rgb(80, 97, 122)`)
  - `--hds-color-core-neutral-700`: `#3c4f69` | `--hds-color-core-neutral-800`: `#273951` | `--hds-color-core-neutral-900`: `#1a2c44`
  - `--hds-color-core-neutral-990` (`--hds-color-heading-solid`, `--hds-color-text-solid`): `#061b31` (`rgb(6, 27, 49)`)
  - Dark mode section surface (`--hds-color-core-neutralDark-990` / `.hds-mode--dark`): `#0d1738` (`rgb(13, 23, 56)`)
- **Expressive Accent & Gradient Tokens:**
  - `--accent-gradient-color-stop-1`: `#bdb4ff` | `--accent-gradient-color-stop-2`: `#643afd` | `--accent-gradient-color-stop-3`: `#533afd`
  - `--suite-color` (`--hds-color-core-orange-350`): `#ff6118` | `--stop-color`: `#fb76fa` | `--stats-color`: `#8a35df`
  - `--hds-color-core-ruby-400`: `#ea2261` | `--hds-color-core-magenta-350`: `#f44bcc` | `--hds-color-core-lemon-200`: `#f9b900` | `--hds-color-core-success-400`: `#00b261`
- **Typography (`@font-face` & `--hds-font-*`):**
  - Primary Variable Sans: `sohne-var, "SF Pro Display", sans-serif` (`Sohne.cb178166.woff2`, weight `1 1000`, `font-feature-settings: "ss01"`)
  - Monospace: `SourceCodePro` (`SourceCodePro-Medium.f5ba3e6a.woff2`, weight `500`)
  - Declared heading weights (`--hds-font-heading-sm-weight` through `xxl-weight`): `300` (Light/Book weight used for display headings!)
  - Declared text weights (`--hds-font-text-xs-weight` through `xxl-weight`): `300` (with `400` on labels/buttons)
- **Spacing Scale (`--hds-space-core-*`) & Layout:**
  - `--hds-space-core-0`: `0px` | `25`: `2px` | `50`: `4px` | `75`: `6px` | `100`: `8px` | `150`: `12px` | `200`: `16px` | `250`: `20px` | `300`: `24px` | `400`: `32px` | `500`: `40px` | `550`: `44px` | `600`: `48px` | `800`: `64px` | `1000`: `80px` | `1200`: `96px`
  - `--hds-space-layout-content-maxWidth`: `1264px`
- **Border Radii (`--hds-space-core-radius-*`):**
  - `--hds-space-core-radius-xs`: `2px`
  - `--hds-space-core-radius-sm`: `4px` (buttons & inner item cards)
  - `--hds-space-core-radius-md`: `6px` (`--card-radius`, bento cards & browser frames; `--card-radius-inner: 5px`)
  - `--hds-space-core-radius-lg`: `16px` | `--hds-space-core-radius-xl`: `32px` | `--hds-space-core-radius-round`: `99999px`
- **Dual-Layer Tinted Elevation Shadows (`--hds-shadow-*`):**
  - `--hds-canary-ui-shadow`: `0px 16px 32px rgba(50, 50, 93, .12)`
  - `--hds-shadow-xs`: `0 2px 10px 0 rgba(0,55,112,.06), 0 1px 4px 0 rgba(0,59,137,.04)`
  - `--hds-shadow-sm`: `0 5px 14px 0 rgba(0,55,112,.08), 0 2px 8px 0 rgba(0,59,137,.05)`
  - `--hds-shadow-md`: `0 6px 22px 0 rgba(0,55,112,.10), 0 4px 8px 0 rgba(0,59,137,.02)`
  - `--hds-shadow-lg`: `0 15px 40px -2px rgba(0,55,112,.10), 0 5px 20px -2px rgba(0,59,137,.04)`
  - `--hds-shadow-xl`: `0 20px 80px -16px rgba(0,55,112,.14), 0 10px 60px -16px rgba(0,59,137,.06)`

---

### B. Computed Styles Observed in Rendered Components (`getComputedStyle` & `getBoundingClientRect`)

| Component / Selector | Desktop (`1440×900`) Observed Values | Mobile (`390×844`) Observed Values |
| :--- | :--- | :--- |
| **Light Section Canvas (`.section--white.hds-mode--light`)** | `background-color: rgb(255, 255, 255)` (`#FFFFFF`), `padding: 0px 16px`; subdued footer CTA section uses `rgb(248, 250, 253)` (`#F8FAFD`) | Identical (`#FFFFFF` primary light canvas, `#F8FAFD` subdued section canvas) |
| **Dark Enterprise Section (`.section.hds-mode--dark`)** | `background-color: rgb(13, 23, 56)` (`#0D1738`, `--hds-color-core-neutralDark-990`) | `background-color: rgb(13, 23, 56)` (`#0D1738`) |
| **Hero Display Heading (`h1.hero-section__title.hds-heading--xl`)** | `x: 208px`, `width: 1018.4px`, `font-family: sohne-var, "SF Pro Display", sans-serif`, `font-size: 48px`, `font-weight: 300`, `line-height: 55.2px` (`1.15`), `letter-spacing: -0.96px` (`-0.02em`), `font-feature-settings: "ss01"`. Uses dual-layer background/foreground gradient blend over solid `#061B31` navy body text | `x: 16px`, `width: 358px`, `font-size: 34px`, `font-weight: 300`, `line-height: 35.02px` (`1.03`), `letter-spacing: -0.34px` (`-0.01em`) |
| **Section Heading (`h2.hds-heading--lg`) & Inline Subdued Lead (`p.hds-heading--subdued`)** | `x: 104px`, `font-size: 32px`, `font-weight: 300`, `line-height: 35.2px` (`1.10`), `letter-spacing: -0.64px` (`-0.02em`); heading color `rgb(6, 27, 49)` (`#061B31`), inline continuation color `rgb(100, 116, 141)` (`#64748D`) | `x: 16px`, `font-size: 22px`, `font-weight: 300`, `line-height: 26.4px` (`1.20`), `letter-spacing: -0.22px` (`-0.01em`), `#061B31` / `#64748D` |
| **Bento Card Title (`h3.modular-solutions-bento-card__title`)** | `font-size: 26px`, `font-weight: 300`, `line-height: 29.12px` (`1.12`), `letter-spacing: -0.26px` (`-0.01em`), `color: rgb(6, 27, 49)` (`#061B31`) | `font-size: 20px`, `font-weight: 300`, `line-height: 24px` (`1.20`), `letter-spacing: -0.2px` (`-0.01em`) |
| **Body Copy (`p.homepage-query-box__subtitle`)** | `font-size: 16px`, `font-weight: 300`, `line-height: 22px` (`1.375`–`1.40`), `color: rgb(80, 97, 122)` (`#50617A`) | `font-size: 16px`, `font-weight: 300`, `line-height: 22.4px` (`1.40`) |
| **Primary CTA (`a.hds-button--primary`, "Get started")** | `height: 48px` (`40px` compact nav), `padding: 15.5px 24px 16.5px`, `font-size: 16px` (`14px` compact), `font-weight: 400`, `background-color: rgb(83, 58, 253)` (`#533AFD`), `color: #FFFFFF`, `border-radius: 4px`, `transition: 0.3s cubic-bezier(0.25, 1, 0.5, 1)` | `x: 16px`, `width: 358px` (full-width), `height: 44px`, `padding: 13.5px 24px 14.5px`, `border-radius: 4px`, `#533AFD` |
| **Secondary CTA (`a.hds-button--secondary`)** | `height: 48px`, `padding: 14.5px 24px 15.5px`, `background-color: rgba(255, 255, 255, 0.65)`, `color: rgb(83, 58, 253)` (`#533AFD`), `border: 1px solid rgb(185, 185, 249)` (`#B9B9F9`), `border-radius: 4px` | `width: 358px`, `height: 44px`, `border: 1px solid #B9B9F9`, `border-radius: 4px` |
| **Bento Outer Card & Floating UI Widget (`.modular-solutions-bento-card__border`, `.dom-graphic__content`)** | Outer bento wrapper uses `1px` border simulation (`background-color: rgb(229, 237, 245)` `#E5EDF5`, `border-radius: 6px`) around `#FFFFFF` inner card; floating UI widgets use `border-radius: 6px` and `box-shadow: rgba(50, 50, 93, 0.12) 0px 16px 32px 0px` (`--hds-canary-ui-shadow`) or `rgba(23, 23, 23, 0.08) 0px 15px 35px 0px` with `backdrop-filter: blur(12px)` | Outer bento `width: 360px` (`x: 15px`), `border-radius: 6px` (`5px` inner), floating widget `box-shadow: rgba(50, 50, 93, 0.12) 0px 16px 32px 0px` |

---

### C. Inferred Design-System Patterns
1. **Light-Weight Variable Display Typography (`Söhne` Weight `300`):** Counterintuitively, Stripe's current Heavy Design System (`HDS`) sets all display headings (`48px` H1, `32px` H2, `26px` H3) and body paragraphs in `sohne-var` at `font-weight: 300` with `"ss01"` stylistic alternates, reserving `font-weight: 400` for interactive buttons (`Get started`, `Contact sales`) and form labels. Hierarchy is achieved via scale, negative tracking (`-0.02em`), and ink contrast (`#061B31` deep navy vs. `#64748D` cool slate) rather than heavy bolding.
2. **Inline Dual-Tone Heading Leads (`.hds-heading--inline`):** Section headings (`h2.hds-heading--lg.hds-heading--inline`, `#061B31`) flow directly into same-size (`32px` desktop / `22px` mobile) subdued lead paragraphs (`p.hds-heading--subdued.hds-heading--inline`, `#64748D`) within a single typographic block.
3. **Navy-Tinted Ambient Elevation (`rgba(50, 50, 93, 0.12)` & `rgba(0, 55, 112, 0.08–0.14)`):** Instead of pure black (`rgba(0,0,0,x)`) shadows, Stripe's `--hds-shadow-*` and `--hds-canary-ui-shadow` tokens tint every drop shadow with deep indigo/navy (`#32325D` / `#003770`), making floating white UI cards (`#FFFFFF`) feel optically illuminated against `#F8FAFD` and `#FFFFFF` surfaces.
4. **Crisp `4px` Button & `6px` Card Geometry:** Rather than pill buttons (`9999px`) or large `16px+` marketing cards, Stripe's current HDS uses restrained `4px` button corners (`--hds-space-core-radius-sm`) and `6px` bento card corners (`--hds-space-core-radius-md`) framed by `1px` cool-slate borders (`#E5EDF5`).
