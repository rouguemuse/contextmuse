# ContextMuse — Design Intelligence Multi-System Token Extraction Report

- **Study Scope:** Comparative Design-Token Extraction & Shared Specimen Transfer across three independent reference systems:
  1. **Study 01 — Plaidis / Locomotive (`https://locomotive.ca/en`)** — *Structural Grid & Quintic Choreography* (Inspected `2026-11-08`)
  2. **Study 02 — Linear (`https://linear.app/`)** — *Precision & Restraint* (Inspected `2026-11-09T12:37:39.587Z`)
  3. **Study 03 — Stripe (`https://stripe.com/`)** — *Expressive Hierarchy & Dimensional Color* (Inspected `2026-11-09T12:37:51.153Z`)
- **Viewports Inspected:** Desktop `1440 × 900` (`deviceScaleFactor: 2`) and Mobile `390 × 844` (`deviceScaleFactor: 2`) in headless Chromium.
- **Reference Dossiers:**
  - [`design-intelligence/references/locomotive.md`](../references/locomotive.md)
  - [`design-intelligence/references/linear.md`](../references/linear.md)
  - [`design-intelligence/references/stripe.md`](../references/stripe.md)

---

## 1. Epistemic & Confidence Classification Schema

Every token and specimen treatment documented in this study is assigned one of four evidentiary classifications:

- **Class A — Explicitly Declared CSS Variable / Design Token (`HIGH — Declared`):** Extracted verbatim from `:root`, `[data-theme]`, or `.hds-color-mode` CSS custom property declarations in production stylesheets.
- **Class B — Computed Style Observed in Rendered DOM (`HIGH — Computed`):** Measured via `window.getComputedStyle(el)` and `el.getBoundingClientRect()` on live rendered elements at `1440×900` and `390×844`.
- **Class C — Inferred Design-System Pattern (`MEDIUM — Inferred`):** Structural, perceptual, or choreographic relationships synthesized from multiple Class A and Class B measurements. Runtime-only shaders, WebGL canvases, or proprietary binary font tables are explicitly marked as non-extracted rather than invented.
- **Class D — Deliberate Specimen & Transfer Adaptation (`ADAPTED — Specimen/ContextMuse`):** Intentional layout, scale, font-fallback, or palette adaptations applied when transferring reference principles onto the shared `85`-node synthetic specimen or ContextMuse's 4-room architecture (e.g., ContextMuse `#EDE9E0`/`#23282A`/`#D9A62E`/`#17504A` pigments and `800`-weight uppercase specimen heading in Study 01, open left/right card borders, `28px–29px` stage-fitted display headings vs. `48px–110px` marketing H1s, stacked `<h3>`+`<p>` DOM parity vs. Stripe's inline `.hds-heading--inline`, and local/system font fallbacks where proprietary licensed webfont binaries `LocomotiveNew`, `HelveticaNowDisplay`, `Berkeley Mono`, and `Söhne Variable` are not bundled).
- **Synthetic Specimen Fixture Disclosure:** All operational metrics displayed inside the shared comparison specimen (`1,420 req/s`, `18.4 ms`, `100.0%`, `14 / 14 gates active`, `RT-4091..4093`) are synthetic demonstration fixture values held constant across all four states to test visual-system legibility and hierarchy—not live production telemetry.

---

## 2. Comparative Token Matrix Across All Three Reference Systems

| Token Dimension | Study 01: Plaidis / Locomotive (`locomotive.ca/en`) | Study 02: Linear (`linear.app`) | Study 03: Stripe (`stripe.com`) |
| :--- | :--- | :--- | :--- |
| **Primary Canvas Background** | `#000000` (`--color-bg`, Class A) / `#FFFFFF` light sections (Class B) | `#08090A` (`--color-bg-primary` / `--color-bg-level-0`, Class A) | `#FFFFFF` (`--hds-color-core-neutral-0`, Class A) & `#F8FAFD` (`--hds-color-core-neutral-25`, Class A) |
| **Elevated / Secondary Surface** | Transparent grid cells bounded by `2px solid currentColor` overlines (Class B) | `#0F1011` (`--color-bg-panel` / `level-1`), `#141516` (`level-2`), `#191A1B` (`level-3`) (Class A) | `#FFFFFF` floating cards over `#F8FAFD`; dark enterprise sections use `#0D1738` (`--hds-color-core-neutralDark-990`, Class A/B) |
| **Primary Text Color** | `#FFFFFF` (`--color`, Class A) / `#000000` on light canvas (`21.00:1` WCAG AAA) | `#F7F8F8` (`--color-text-primary`, Class A — `18.73:1` WCAG AAA on `#08090A`) | `#061B31` (`--hds-color-core-neutral-990`, Class A — `17.37:1` WCAG AAA on `#FFFFFF`) |
| **Secondary / Subdued Text** | `currentColor` at `1.0` opacity differentiated by scale (`26px` vs `15px`, Class B); transfer surfaces use `#23282A` on `#EDE9E0` (`12.31:1` AAA) | `#D0D6E0` (`--color-text-secondary`, `13.64:1` AAA on `#08090A` / `13.04:1` AAA on `#0F1011`), `#8A8F98` (`--color-text-tertiary`, `6.13:1` AA), `#62666D` (`quaternary`, `3.45:1` muted) (Class A) | `#50617A` (`--hds-color-core-neutral-600`, `6.30:1` AA on `#FFFFFF` / `6.03:1` AA on `#F8FAFD`) and `#64748D` (`--hds-color-core-neutral-500`, `4.75:1` AA on `#FFFFFF` / `4.54:1` AA on `#F8FAFD`) (Class A/B) |
| **Brand & Accent Tokens** | `#312DFB` (`--menu-color-bg` electric ultramarine, Class A — `7.24:1` AAA with `#FFFFFF`); transfer accents `#D9A62E` (`8.16:1` AAA with `#141617`) & `#17504A` (`7.59:1` AAA with `#EDE9E0`) | `#5E6AD2` (`--color-brand-bg` / `--color-indigo`, `4.70:1` AA), `#7170FF` (`--color-accent`), `#68CC58` (`plan`), `#D4B144` (`build`) (Class A) | `#533AFD` (`--hds-color-core-brand-600`, `6.19:1` AA), `#4032C8` (`brand-700`), `#FF6118` (`--suite-color`), `#8A35DF` (`--stats-color`) (Class A) |
| **Typography Families** | `LocomotiveNew` (Display) + `HelveticaNowDisplay` (UI/Body) (Class A/B) | `"Inter Variable", "SF Pro Display"` (`--font-regular`, `"cv01", "ss03"`), `"Berkeley Mono"` (`--font-monospace`), `"Tiempos Headline"` (Class A) | `sohne-var, "SF Pro Display", sans-serif` (`"ss01"`) + `SourceCodePro` (`500` weight) (Class A/B) |
| **Display Heading Scale & Weight** | `70px`–`110px` desktop (`36px`–`40px` mobile), weight `400`, line-height `1.00–1.10` (Class A/B) | `64px` H1 (`--title-8`, `38px` mobile), `48px` H2 (`--title-6`, `24px` mobile), fractional weight `510` (`--font-weight-medium`), line-height `1.00`, tracking `-0.022em` (`-1.408px`) (Class A/B) | `48px` H1 (`34px` mobile), `32px` H2 (`22px` mobile), light weight `300`, line-height `1.15` (`55.2px` H1) / `1.10` (`35.2px` H2), tracking `-0.02em` (`-0.96px`) (Class A/B) |
| **Body & UI Scale** | Root `15px` (`1.30` line-height), UI lead `26px` desktop / `18px` mobile (`1.20` line-height) (Class A/B) | `15px` (`--text-regular`, `24px` / `1.6` line-height, `-0.011em`), `14px` (`--text-small`, `21px`), `13px` (`--text-mini`), `12px` (`--text-micro`) (Class A/B) | `16px` (`--hds-font-text-md-size`, weight `300`, `22px–22.4px` / `1.375–1.40` line-height); compact UI `14px` (weight `400`) (Class A/B) |
| **Spacing & Grid Architecture** | 12-col desktop (`95px` tracks, `20px` gutter, `40px` margin); 4-col mobile (`80px` tracks, `10px` gutter, `20px` margin); `--spacing-micro: 14px` to `--spacing-enormous: 250px` (Class A/B) | 12-col grid (`--grid-columns: 12`), `--homepage-outer-padding: 46px`, `--homepage-padding-inset: 32px` (effective `x=78px` desktop, `x=23px` mobile), `--page-padding-block: 64px` (Class A/B) | `--hds-space-layout-content-maxWidth: 1264px` (`x=104px` section / `x=208px` hero desktop, `x=16px` mobile); modular `--hds-space-core-*` (`2px, 4px, 6px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 44px, 48px, 64px, 80px, 96px`) (Class A/B) |
| **Border Radius Tokens** | `0px` across all buttons, section overlines, and index lists (Class B) | `--radius-4: 4px`, `--radius-6: 6px`, `--radius-8: 8px`, `--radius-12: 12px`, `9px` issue cards, `--radius-rounded: 9999px` pill CTA (Class A/B) | `--hds-space-core-radius-xs: 2px`, `sm: 4px` (CTAs), `md: 6px` (`5px` inner bento cards), `lg: 16px`, `xl: 32px` (Class A/B) |
| **Border Treatments** | `2px solid currentColor` desktop / `1px solid` mobile structural overlines and button frames (Class B) | `--border-hairline: 1px`; `1px solid rgba(255, 255, 255, 0.08)` (`--color-border-translucent-strong`) and `rgba(255, 255, 255, 0.05)` (`--color-border-translucent`); solid `#23252A` / `#34343A` (Class A/B) | `1px solid #E5EDF5` (`--hds-color-surface-border-quiet` / `--hds-color-core-neutral-50`) on bento cards; `1px solid #B9B9F9` (`--hds-color-core-brand-200`) on secondary CTAs; `1px dashed #E5EDF5` grid lines (Class A/B) |
| **Shadows & Elevation** | `box-shadow: none` (`0px` flat architectural planes) (Class B) | `--shadow-low` through `--shadow-high` aliased to `0px 0px 0px transparent`; cards use `1px` edge-highlight rings (`rgba(0,0,0,0.2) 0px 0px 0px 1px`) + `linear-gradient(rgba(255,255,255,0.03), ...)` (Class A/B) | Navy-tinted multi-layer shadows: `--hds-canary-ui-shadow: 0px 16px 32px rgba(50,50,93,0.12)` and `--hds-shadow-xs` to `xl` (`rgba(0,55,112,0.06–0.14)`) + `backdrop-filter: blur(12px)` on browser chrome (Class A/B) |
| **Button Treatments** | `height: 48px`, `border: 2px solid currentColor`, `border-radius: 0px`, `26px` label, underline hover (Class B) | Primary invert CTA: `height: 32px`, `padding: 0 12px`, `font-size: 13px`, `weight: 510`, `bg: #E5E5E6`, `color: #08090A`, `border-radius: 9999px`; Sub-nav pills: `height: 28px`, `radius: 8px`, `bg: rgba(255,255,255,0.04)` (Class A/B) | Primary CTA: `height: 48px` (`44px` mobile, `40px` nav), `padding: 15.5px 24px 16.5px`, `font-size: 16px`, `weight: 400`, `bg: #533AFD`, `color: #FFFFFF`, `border-radius: 4px`; Secondary: `bg: rgba(255,255,255,0.65)`, `color: #533AFD`, `border: 1px solid #B9B9F9`, `radius: 4px` (Class A/B) |
| **Motion & Interaction Timing** | `--transition-speed-enter: 0.45s` (`450ms`), `--transition-speed-leave: 0.2s` (`200ms`), `cubic-bezier(0.23, 1, 0.32, 1)` (Ease-Out Quint) (Class A) | `--speed-quickTransition: .1s` (`100ms`), `--speed-regularTransition: .25s` (`250ms`), CTA hover `160ms` `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (`--ease-out-quad`) (Class A/B) | Primary CTA: `300ms` `cubic-bezier(0.25, 1, 0.5, 1)`; Nav CTA: `240ms` `cubic-bezier(0.45, 0.05, 0.55, 0.95)`; Bento card reveal: `800ms` `cubic-bezier(0.165, 0.84, 0.44, 1)` (Class B) |

---

## 3. Analytical Substance Across the Three Studies (Five Core Research Questions)

### Study 01 — Plaidis / Locomotive (`locomotive.ca/en`)
1. **Which design decisions are observable?**
   - Explicit `:root` grid tokens (`--grid-columns: 12`, `--grid-gutter: 20px`, `--grid-margin: 40px` desktop / `20px` mobile), `0px` border radius across all interactive elements, `2px solid` horizontal overlines, and asymmetric quintic hover timing (`450ms` enter / `200ms` leave at `cubic-bezier(0.23, 1, 0.32, 1)`).
2. **What functional or perceptual effects are plausible?**
   - Locking header, hero, index rows, and footer to a single `40px` desktop (`20px` mobile) outer margin establishes an uninterrupted vertical plumb line (`0px` left-edge variance). Asymmetric hover timing makes hover initiation feel deliberate while release feels immediate.
3. **Which elements improve clarity or create friction?**
   - **Clarity:** `2px` overlines and `0px` corner geometry compartmentalize dense multi-quadrant layouts without card-in-card nesting clutter.
   - **Friction:** High-contrast brutalist framing (`#000000` / `#FFFFFF`) and oversized `70px`–`110px` display type compress vertical viewport capacity and can feel austere if applied to form-heavy SaaS workflows.
4. **What changes when the tokens are transferred to identical content?**
   - On the shared neutral specimen (and the ContextMuse 4-room homepage), rounded `6px–8px` cards and soft drop shadows flatten into an architectural blueprint table; left-edge drift drops from `24px` to `0px`, and CTAs become structural `2px`-bordered bars.
5. **What limitations prevent conclusions about actual user behavior?**
   - Passing 11/11 functional smoke checks and achieving `0px` DOM alignment variance prove technical precision and non-regression, not increased conversion, session duration, or user preference—which require controlled A/B testing with real visitors.

### Study 02 — Linear (`linear.app`)
1. **Which design decisions are observable?**
   - Obsidian dark-mode palette (`#08090A` primary canvas, `#0F1011` panels, `#141516` level-2), `1px solid rgba(255, 255, 255, 0.05–0.08)` translucent hairline borders, `--shadow-low` through `--shadow-high` aliased to `0px 0px 0px transparent`, fractional `Inter Variable` weights (`510` medium, `590` semibold) with `"cv01", "ss03"` features, tight `-0.022em` display tracking, compact `13px–15px` UI copy, and monochrome-inverted `#E5E5E6` pill CTAs (`32px` height, `9999px` radius, `160ms` quad easing).
2. **What functional or perceptual effects are plausible?**
   - Replacing drop shadows with stepped background luminance (`#08090A` → `#0F1011` → `#141516`) and `8%` white top/edge hairlines creates crisp depth in dark mode without muddy haloes. Using weight `510` instead of `700` reduces dark-mode glyph halation.
3. **Which elements improve clarity or create friction?**
   - **Clarity:** Monochrome primary CTAs (`#E5E5E6` on `#08090A`, `15.83:1` AAA) allow semantic status accents (`#68CC58` green, `#D4B144` amber, `#5E6AD2` indigo) to stand out immediately as data signals rather than decorative chrome.
   - **Friction:** Compact `13px` (`--text-mini`) and `32px`-tall buttons demand higher pointer precision, and `--color-text-quaternary` (`#62666D` on `#08090A`, `3.45:1`) falls below the WCAG AA `4.5:1` threshold for normal body text if misused outside non-essential metadata.
4. **What changes when the tokens are transferred to identical content?**
   - When applied to the shared neutral specimen, information density tightens significantly: card padding contracts, shadows vanish into `1px` `rgba(255,255,255,0.08)` rings, typography shifts to technical `13px–15px` `Inter Variable` (`510`/`590` weight), and the specimen reads like an IDE-grade engineering instrument.
5. **What limitations prevent conclusions about actual user behavior?**
   - Dark-mode preference and high information density strongly appeal to technical/developer audiences in observational settings, but cannot be generalized to broad consumer or older demographics without task-completion and eye-strain testing across ambient lighting conditions.

### Study 03 — Stripe (`stripe.com`)
1. **Which design decisions are observable?**
   - High-key daylight surfaces (`#FFFFFF` and `#F8FAFD` `--hds-color-core-neutral-25`), deep navy ink (`#061B31` `--hds-color-core-neutral-990`, `17.37:1` AAA), `sohne-var` set at light `font-weight: 300` across `48px` H1, `32px` H2, `26px` H3, and `16px` body copy (`"ss01"`), `#533AFD` (`--hds-color-core-brand-600`) primary CTAs (`48px` desktop / `44px` mobile height, `4px` radius), `6px` bento card radius (`#E5EDF5` `1px` borders), and navy-tinted ambient shadows (`0px 16px 32px rgba(50, 50, 93, 0.12)`).
2. **What functional or perceptual effects are plausible?**
   - Setting `48px` and `32px` headings at `font-weight: 300` with `-0.02em` tracking produces an editorial, financial-grade lightness that avoids the heavy "SaaS template" look, while navy-tinted shadows (`rgba(50,50,93,0.12)`) create physical card separation on `#F8FAFD` without dirty gray edges.
3. **Which elements improve clarity or create friction?**
   - **Clarity:** Generous `48px` (`44px` mobile) button targets in `#533AFD` (`6.19:1` AA contrast) and inline dual-tone headings (`#061B31` title flowing into `#64748D` subdued lead) allow rapid executive scanning.
   - **Friction:** `--hds-color-text-subdued` (`#64748D` on `#FFFFFF`, `4.75:1` AA) and light `font-weight: 300` body text (`16px`) sit close to the `4.5:1` AA floor; on low-DPI non-Retina monitors, weight `300` at small sizes (`12px–14px`) can appear thin.
4. **What changes when the tokens are transferred to identical content?**
   - On the shared neutral specimen, the interface opens up into a luminous, dimensional bento workspace: cards lift off the `#F8FAFD` canvas via navy-tinted elevation (`0 16px 32px rgba(50,50,93,0.12)`), headings become lighter (`weight 300`) yet larger, and the primary action shifts to an unmistakable `48px` `#533AFD` violet anchor.
5. **What limitations prevent conclusions about actual user behavior?**
   - Expressive color hierarchy and dimensional elevation increase visual distinctiveness in static and interactive comparisons, but whether light `300`-weight typography or `#533AFD` CTAs improve comprehension or conversion on a specific product requires empirical funnel telemetry.
