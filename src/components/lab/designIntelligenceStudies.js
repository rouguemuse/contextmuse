/**
 * Verified Design Intelligence Token Extraction Studies
 *
 * Study 01: Plaidis / Locomotive (https://locomotive.ca/en) — Structural Grid & Quintic Choreography
 * Study 02: Linear (https://linear.app/) — Precision & Restraint
 * Study 03: Stripe (https://stripe.com/) — Expressive Hierarchy & Dimensional Color
 *
 * All values are directly grounded in headless Chromium DOM & stylesheet inspections
 * at 1440×900 (Desktop @ 2x DPR) and 390×844 (Mobile @ 2x DPR).
 */

export const NEUTRAL_SPECIMEN_BASELINE = {
  id: 'neutral',
  name: 'Neutral Baseline Specimen',
  shortLabel: 'Neutral Specimen',
  description:
    'Unstyled structural control interface using default system sans-serif typography, uniform 16px/24px spacing, neutral zinc surfaces (#F4F4F5 / #FFFFFF), and standard 6px borders. Content, hierarchy nodes, and interactive controls remain locked across all three token studies.',
  tokens: {
    canvasBg: '#F4F4F5',
    surfaceBg: '#FFFFFF',
    elevatedBg: '#FAFAFA',
    textPrimary: '#18181B',
    textSecondary: '#52525B',
    textMuted: '#52525B',
    accentPrimary: '#27272A',
    accentSecondary: '#3F3F46',
    border: '1px solid #E4E4E7',
    radiusCard: '6px',
    radiusButton: '6px',
    shadowCard: '0 1px 2px rgba(0, 0, 0, 0.05)',
    fontDisplay: 'system-ui, -apple-system, sans-serif',
    fontSans: 'system-ui, -apple-system, sans-serif',
    fontMono: 'ui-monospace, SFMono-Regular, monospace',
  },
};

export const DESIGN_INTELLIGENCE_STUDIES = [
  // ===========================================================================
  // STUDY 01 — PLAIDIS / LOCOMOTIVE
  // ===========================================================================
  {
    id: 'plaidis',
    aliases: ['locomotive', 'study-01'],
    num: '01',
    selectorLabel: 'Plaidis',
    selectorSub: 'Study 01 · Structural Grid',
    name: 'Study 01: Plaidis (Locomotive) — Structural Grid & Quintic Choreography',
    shortName: 'Plaidis / Locomotive',
    subtitle: 'Exposed 12-Column Hairlines, Zero-Radius Framing & Asymmetric Ease-Out Quint Motion',
    sourceUrl: 'https://locomotive.ca/en',
    sourceDomain: 'locomotive.ca/en',
    inspectedAt: '2026-11-08 (1440×900 & 390×844 @ 2x DPR)',
    referenceDossierPath: 'design-intelligence/references/locomotive.md',
    experimentReportPath: 'design-intelligence/experiments/experiment-01-locomotive.md',
    themePolarity: 'Architectural High-Contrast (Bone #EDE9E0 / Ink #23282A & #000000)',
    accentHex: '#D9A62E',
    referenceCaptures: {
      desktop: '/assets/images/design-intelligence/exp01_after_desktop.png',
      mobile: '/assets/images/design-intelligence/exp01_after_mobile.png',
    },
    specimenCaptures: {
      desktopBefore: '/assets/images/design-intelligence/study_plaidis_specimen_before_neutral_1440.png',
      desktopAfter: '/assets/images/design-intelligence/study_plaidis_specimen_after_tokens_1440.png',
      mobileBefore: '/assets/images/design-intelligence/study_plaidis_viewport_390.png',
      mobileAfter: '/assets/images/design-intelligence/study_plaidis_viewport_390.png',
    },
    executiveSummary:
      'Extracted from our baseline structural reference (locomotive.ca/en) and verified on the ContextMuse 4-room architecture (52e179d → 195921a). Replaces rounded cards and drop shadows with a 40px desktop (20px mobile) outer plumb line, 0px corner geometry, 2px solid overlines, and 450ms/200ms quintic hover choreography.',
    comparisonMetrics: {
      hierarchy: {
        scoreLabel: 'Architectural / Overline-Driven',
        summary:
          'Separates tight display statements (line-height 1.00–1.15) from workhorse 15px grid copy (1.30–1.45) using 2px solid horizontal overlines rather than background cards.',
      },
      density: {
        scoreLabel: 'Structured Tabular Grid (12-Col / 4-Col)',
        summary:
          '12-column desktop track (95px columns, 20px gutter, 40px margin) and 4-column mobile track (80px columns, 10px gutter, 20px margin) maximize horizontal alignment discipline.',
      },
      visualEmphasis: {
        scoreLabel: 'Zero-Radius Rules & Asymmetric Motion',
        summary:
          'Eliminates border-radius (0px) and box-shadow (none); directs emphasis into 2px structural borders, high-contrast pigment blocks, and 450ms enter / 200ms leave quintic easing.',
      },
      readability: {
        scoreLabel: '21.00:1 Reference / 12.31:1 Transfer (WCAG AAA)',
        summary:
          'Pure monochrome (#FFFFFF on #000000, 21.00:1) in reference and #23282A ink on #EDE9E0 bone (12.31:1 AAA) in transfer guarantee effortless legibility at 13px–15px.',
      },
    },
    tokenBreakdown: [
      {
        category: 'Primary & Surface Colors',
        tokenName: '--color-bg / --color / --menu-color-bg',
        classification: 'A',
        classificationLabel: 'Class A · Declared CSS Token',
        desktopValue: '--color-bg: #000000 | --color: #FFFFFF | --menu-color-bg: #312DFB',
        mobileValue: 'Identical (:root custom properties)',
        evidence: 'Declared verbatim on :root in accessible same-origin stylesheet; transferred to #23282A / #EDE9E0 / #D9A62E.',
      },
      {
        category: 'Spacing Scale & Motion Variables',
        tokenName: '--spacing-micro..enormous / --transition-*',
        classification: 'A',
        classificationLabel: 'Class A · Declared CSS Token',
        desktopValue: 'micro: 14px | tiny: 20px | medium: 40px | large: 80px | enter: 0.45s | leave: 0.2s | cubic-bezier(0.23, 1, 0.32, 1)',
        mobileValue: 'micro: 8px | tiny: 20px | medium: 40px | large: 52px | big: 80px',
        evidence: 'Declared in :root and responsive media queries (--transition-speed-enter, --transition-speed-leave, --transition-easing).',
      },
      {
        category: 'Grid Tracks & Plumb-Line Margins',
        tokenName: '.o-grid / .c-header / .c-footer',
        classification: 'B',
        classificationLabel: 'Class B · Computed DOM Style',
        desktopValue: '12 cols (repeat(12, 95px)), gutter 20px, outer margin 40px (width: 1360px)',
        mobileValue: '4 cols (repeat(4, 80px)), gutter 10px/20px, outer margin 20px (width: 350px)',
        evidence: 'Measured via getComputedStyle(.o-grid) and getBoundingClientRect() (x=40px desktop, x=20px mobile).',
      },
      {
        category: 'Typography & Scale',
        tokenName: '.c-heading.-h1 / .c-button_label / body',
        classification: 'B',
        classificationLabel: 'Class B · Computed DOM Style',
        desktopValue: 'LocomotiveNew Display: 70px–110px (lh 1.00–1.10, wt 400) | HelveticaNowDisplay Lead: 26px (lh 1.20) | Body: 15px (lh 1.30)',
        mobileValue: 'Display: 36px–40px (lh 1.00–1.10) | UI Lead: 18px (lh 1.20) | Body: 15px (lh 1.30)',
        evidence: 'Computed on .c-featured-links_title, .c-heading.-h1, .c-button_label, and body (1rem = 15px).',
      },
      {
        category: 'Borders, Radii & Shadows',
        tokenName: '.c-section-overline_inner / .c-button.-full',
        classification: 'B',
        classificationLabel: 'Class B · Computed DOM Style',
        desktopValue: 'border-top: 2px solid rgb(0, 0, 0) | border-radius: 0px | box-shadow: none | button: 325px × 48px',
        mobileValue: 'border-top: 1px solid rgb(0, 0, 0) | border-radius: 0px | box-shadow: none',
        evidence: 'Computed across section overlines, project index rows, and .c-button.-full.',
      },
      {
        category: 'Asymmetric Motion & Zero-Radius Framing',
        tokenName: 'Inferred System Architecture',
        classification: 'C',
        classificationLabel: 'Class C · Inferred Pattern',
        desktopValue: '2.25× enter/leave ratio (450ms / 200ms) + 0px structural framing + 50% Col-7 asymmetric split (x=730px)',
        mobileValue: '4-column compact index rhythm without decorative cards or drop shadows',
        evidence: 'Synthesized from repeated Class A/B observations across header, overlines, and interactive index rows.',
      },
    ],
    colorSwatches: [
      {
        name: 'Reference Canvas & Ink',
        token: '--color-bg / --color',
        bgHex: '#000000',
        fgHex: '#FFFFFF',
        contrastRatio: '21.00:1',
        wcagLevel: 'AAA',
        usage: 'High-contrast reference surface & display typography (Class A)',
      },
      {
        name: 'Navigation Ultramarine Accent',
        token: '--menu-color-bg',
        bgHex: '#312DFB',
        fgHex: '#FFFFFF',
        contrastRatio: '7.24:1',
        wcagLevel: 'AAA',
        usage: 'Declared navigation & interactive accent surface (Class A)',
      },
      {
        name: 'ContextMuse Editorial Bone',
        token: 'Transfer Surface (Light)',
        bgHex: '#EDE9E0',
        fgHex: '#23282A',
        contrastRatio: '12.31:1',
        wcagLevel: 'AAA',
        usage: 'Primary transferred specimen canvas & 2px structural ink (Class B)',
      },
      {
        name: 'ContextMuse Architectural Charcoal',
        token: 'Transfer Surface (Dark)',
        bgHex: '#23282A',
        fgHex: '#EDE9E0',
        contrastRatio: '12.31:1',
        wcagLevel: 'AAA',
        usage: 'Header, primary structural CTA & dark quadrant surface (Class B)',
      },
      {
        name: 'ContextMuse Mustard Signal',
        token: 'On-Palette Accent Token',
        bgHex: '#D9A62E',
        fgHex: '#141617',
        contrastRatio: '8.16:1',
        wcagLevel: 'AAA',
        usage: 'Replaced off-palette Tailwind red badge in Room 02 & active indicators (Class B)',
      },
      {
        name: 'ContextMuse Forest Signal',
        token: 'Verified Status & Method Room',
        bgHex: '#17504A',
        fgHex: '#EDE9E0',
        contrastRatio: '7.59:1',
        wcagLevel: 'AAA',
        usage: 'Verified status badge and Section C structural surface (Class B)',
      },
    ],
    analyticalQuestions: [
      {
        q: '1. Which design decisions are observable?',
        a: 'Explicit :root CSS variables define a 15px base rem unit, a 12-column desktop grid (95px tracks, 20px gutters, 40px outer margins), 0px border-radius on all interactive controls, 2px solid section overlines, and asymmetric hover transitions (450ms enter vs. 200ms leave using cubic-bezier(0.23, 1, 0.32, 1)).',
      },
      {
        q: '2. What functional or perceptual effects are plausible?',
        a: 'Locking the header, hero headline, primary CTAs, and footer to a single 40px desktop (20px mobile) margin eliminates horizontal eye-scan jitter (reducing left-edge drift from 24px to 0px). Weighting hover entry at 450ms while snapping release back in 200ms gives interactive tiles physical inertia without sluggish exit lag.',
      },
      {
        q: '3. Which elements improve clarity or create friction?',
        a: 'Clarity: 2px horizontal overlines and exposed tabular rows separate dense operational metadata without nesting boxes inside boxes. Friction: Strictly zero-radius (0px) geometry and 2px borders can make secondary controls resemble structural dividers if hover underlines and cursor cues are not explicit.',
      },
      {
        q: '4. What changes when the tokens are transferred to identical content?',
        a: 'On the shared specimen, soft rounded cards (6px radius) and subtle shadows collapse into an architectural ledger: every metric cell shares a 2px top overline, buttons square off to 0px with 2px solid borders, and status badges snap to high-contrast #D9A62E / #141617 (8.16:1 AAA) and #17504A / #EDE9E0 (7.59:1 AAA) tokens.',
      },
      {
        q: '5. What limitations prevent conclusions about actual user behavior?',
        a: 'Zero-pixel DOM alignment variance and 11/11 automated smoke-test passes confirm structural consistency and non-regression, but cannot measure subjective brand affinity, task completion speed, or conversion lift without randomized user testing.',
      },
    ],
  },

  // ===========================================================================
  // STUDY 02 — LINEAR (https://linear.app/)
  // ===========================================================================
  {
    id: 'linear',
    aliases: ['study-02'],
    num: '02',
    selectorLabel: 'Linear',
    selectorSub: 'Study 02 · Precision & Restraint',
    name: 'Study 02: Linear — Precision & Restraint',
    shortName: 'Linear',
    subtitle: 'Obsidian Luminance Stepping, 1px Translucent Hairlines & Fractional Variable Typography',
    sourceUrl: 'https://linear.app/',
    sourceDomain: 'linear.app',
    inspectedAt: '2026-11-09T12:37:39.587Z (1440×900 & 390×844 @ 2x DPR)',
    referenceDossierPath: 'design-intelligence/references/linear.md',
    experimentReportPath: 'design-intelligence/experiments/token-extraction-study-report.md',
    themePolarity: 'Dark-First Obsidian (--color-bg-primary: #08090A / --color-text-primary: #F7F8F8)',
    accentHex: '#5E6AD2',
    referenceCaptures: {
      desktop: '/assets/images/design-intelligence/linear_ref_desktop_above_fold.png',
      mobile: '/assets/images/design-intelligence/linear_ref_mobile_above_fold.png',
    },
    specimenCaptures: {
      desktopBefore: '/assets/images/design-intelligence/study_linear_specimen_before_neutral_1440.png',
      desktopAfter: '/assets/images/design-intelligence/study_linear_specimen_after_tokens_1440.png',
      mobileBefore: '/assets/images/design-intelligence/study_linear_viewport_390.png',
      mobileAfter: '/assets/images/design-intelligence/study_linear_viewport_390.png',
    },
    executiveSummary:
      'Extracted from 49 accessible same-origin stylesheets and computed DOM nodes on linear.app. Demonstrates how an engineering-grade dark interface eliminates traditional drop shadows (--shadow-low through --shadow-high aliased to 0px transparent) in favor of 4 stepped obsidian surfaces (#08090A → #191A1B), 1px rgba(255,255,255,0.08) borders, fractional Inter Variable weights (510/590), and compact 13px–15px utility density.',
    comparisonMetrics: {
      hierarchy: {
        scoreLabel: '4-Tier Luminance & Fractional Weight',
        summary:
          'Separates content via four explicit foreground tokens (#F7F8F8 → #D0D6E0 → #8A8F98 → #62666D) and fractional variable weights (510 medium, 590 semibold) rather than heavy bolding.',
      },
      density: {
        scoreLabel: 'High-Density IDE / Utility Scale (13px–15px)',
        summary:
          'Uses --text-mini (13px), --text-small (14px), and --text-regular (15px) with 32px-tall pill CTAs and 8px–12px card radii to pack complex telemetry into a calm viewport.',
      },
      visualEmphasis: {
        scoreLabel: 'Monochrome Inversion + Reserved Accents',
        summary:
          'Primary CTA uses monochrome inversion (#E5E5E6 on #08090A, 15.83:1), keeping #5E6AD2 indigo, #68CC58 plan green, and #D4B144 build amber strictly for semantic state.',
      },
      readability: {
        scoreLabel: '18.73:1 Primary / 6.13:1 Tertiary (WCAG AAA/AA)',
        summary:
          'Primary (#F7F8F8, 18.73:1) and secondary (#D0D6E0, 13.64:1 on #08090A / 13.04:1 on #0F1011) text achieve AAA contrast; quaternary (#62666D, 3.45:1) is restricted to non-critical metadata.',
      },
    },
    tokenBreakdown: [
      {
        category: 'Background & Surface Hierarchy',
        tokenName: '--color-bg-primary / -panel / -level-0..3',
        classification: 'A',
        classificationLabel: 'Class A · Declared CSS Token',
        desktopValue: 'level-0: #08090A | level-1/panel: #0F1011 | level-2: #141516 | level-3: #191A1B',
        mobileValue: 'Identical (:root[data-theme="dark"] custom properties)',
        evidence: 'Declared on :root[data-theme="dark"]; verified via getComputedStyle(body) = rgb(8, 9, 10).',
      },
      {
        category: 'Text Hierarchy & Semantic Accents',
        tokenName: '--color-text-primary..quaternary / --color-brand-bg',
        classification: 'A',
        classificationLabel: 'Class A · Declared CSS Token',
        desktopValue: 'primary: #F7F8F8 | secondary: #D0D6E0 | tertiary: #8A8F98 | quaternary: #62666D | brand: #5E6AD2',
        mobileValue: 'plan: #68CC58 | build: #D4B144 | security: #7A7FAD | accent: #7170FF',
        evidence: 'Declared in :root; computed on H1 (#F7F8F8), H3 (#D0D6E0), and hero lead (#8A8F98).',
      },
      {
        category: 'Typography & Variable Axes',
        tokenName: '--font-regular / --font-monospace / --font-weight-*',
        classification: 'A',
        classificationLabel: 'Class A · Declared CSS Token',
        desktopValue: 'Inter Variable ("cv01", "ss03"), weights 400 / 510 / 590 / 680; --title-8: 64px (lh 1.06, -0.022em)',
        mobileValue: '--text-regular: 15px (lh 1.6, -0.011em) | --text-small: 14px | --text-mini: 13px',
        evidence: 'Declared --font-weight-medium: 510 & --font-weight-semibold: 590 in accessible stylesheet rules.',
      },
      {
        category: 'Rendered Headings, Grid & Card Bounds',
        tokenName: 'h1.QI8oKG_title / ._5k-xcq_card / header',
        classification: 'B',
        classificationLabel: 'Class B · Computed DOM Style',
        desktopValue: 'H1: 64px/64px (-1.408px, x=78px) | Card: #0F1011, radius 9px, 1px rgba(255,255,255,0.08) | Header: 73px, blur(20px)',
        mobileValue: 'H1: 38px/41.8px (-0.836px, x=23px) | H2: 24px/31.92px | Header: 65px, blur(20px)',
        evidence: 'Measured via getComputedStyle() and getBoundingClientRect() at 1440×900 and 390×844.',
      },
      {
        category: 'Buttons & Interaction Timing',
        tokenName: 'a.S36ykG_variant-invert / button.Mmx1Wq_navItem',
        classification: 'B',
        classificationLabel: 'Class B · Computed DOM Style',
        desktopValue: 'Primary CTA: 32px h, 0 12px pad, 13px wt 510, #E5E5E6 bg, #08090A fg, radius 9999px, 160ms cubic-bezier(0.25,0.46,0.45,0.94)',
        mobileValue: 'Identical 32px pill CTA; sub-nav pills 28px h, radius 8px, bg rgba(255,255,255,0.04)',
        evidence: 'Measured on rendered "Sign up" primary CTA and product navigation pills.',
      },
      {
        category: 'Luminance-Stepped Zero-Shadow Depth',
        tokenName: 'Inferred System Architecture',
        classification: 'C',
        classificationLabel: 'Class C · Inferred Pattern',
        desktopValue: 'Aliases --shadow-tiny..high to 0px transparent; constructs depth via 4 stepped fills + 8% white hairlines + 510/590 anti-halation weights',
        mobileValue: 'Maintains identical 4-step dark surface hierarchy and monochrome CTA restraint on mobile',
        evidence: 'Synthesized from --shadow-* variable aliasing, surface luminance stepping, and fractional font-weight declarations.',
      },
    ],
    colorSwatches: [
      {
        name: 'Obsidian Primary Canvas',
        token: '--color-bg-primary / --color-text-primary',
        bgHex: '#08090A',
        fgHex: '#F7F8F8',
        contrastRatio: '18.73:1',
        wcagLevel: 'AAA',
        usage: 'Primary viewport background and display/title foreground (Class A)',
      },
      {
        name: 'Elevated Panel & Secondary Text',
        token: '--color-bg-panel / --color-text-secondary',
        bgHex: '#0F1011',
        fgHex: '#D0D6E0',
        contrastRatio: '13.04:1',
        wcagLevel: 'AAA',
        usage: 'Issue cards & comment containers (13.04:1 on #0F1011; 13.64:1 on #08090A) (Class A/B)',
      },
      {
        name: 'Tertiary Body & Lead Slate',
        token: '--color-bg-primary / --color-text-tertiary',
        bgHex: '#08090A',
        fgHex: '#8A8F98',
        contrastRatio: '6.13:1',
        wcagLevel: 'AA',
        usage: 'Hero lead paragraph (15px) and card descriptions (14px) (Class A/B)',
      },
      {
        name: 'Quaternary Muted Telemetry',
        token: '--color-bg-primary / --color-text-quaternary',
        bgHex: '#08090A',
        fgHex: '#62666D',
        contrastRatio: '3.45:1',
        wcagLevel: 'AA Large / Muted',
        usage: 'Non-essential timestamps & shortcut hints only; below 4.5:1 normal text AA (Class A)',
      },
      {
        name: 'Inverted Monochrome Pill CTA',
        token: '--color-button-invert-bg',
        bgHex: '#E5E5E6',
        fgHex: '#08090A',
        contrastRatio: '15.83:1',
        wcagLevel: 'AAA',
        usage: 'Primary high-contrast action button (32px height, 9999px radius) (Class A/B)',
      },
      {
        name: 'Linear Brand Indigo & Focus Ring',
        token: '--color-brand-bg / --focus-ring-color',
        bgHex: '#5E6AD2',
        fgHex: '#FFFFFF',
        contrastRatio: '4.70:1',
        wcagLevel: 'AA',
        usage: '2px keyboard focus ring, skip-nav banner, and active brand accents (Class A)',
      },
    ],
    analyticalQuestions: [
      {
        q: '1. Which design decisions are observable?',
        a: 'Linear declares 49 accessible stylesheet modules with explicit dark-mode tokens: #08090A primary background, stepped surfaces (#0F1011, #141516, #191A1B), 1px rgba(255,255,255,0.08) borders, --shadow-low..high aliased to 0px transparent, fractional Inter Variable weights (510 medium, 590 semibold) with "cv01", "ss03", -0.022em display tracking, and 32px-tall #E5E5E6 pill CTAs.',
      },
      {
        q: '2. What functional or perceptual effects are plausible?',
        a: 'In dark mode, traditional drop shadows muddy adjacent surfaces. Replacing shadows with incremental background lightness (#08090A → #0F1011 → #141516) and 8% white top/edge hairlines creates crisp optical containment, while fractional 510/590 weights prevent white-on-black text halation.',
      },
      {
        q: '3. Which elements improve clarity or create friction?',
        a: 'Clarity: Reserving color for semantic workflow states (#68CC58 plan, #D4B144 build, #5E6AD2 indigo) while keeping primary CTAs monochrome (#E5E5E6) eliminates visual noise. Friction: Compact 13px–14px copy and 32px button heights reduce touch-target forgiveness, and --color-text-quaternary (#62666D, 3.45:1) fails WCAG AA if used for primary reading copy.',
      },
      {
        q: '4. What changes when the tokens are transferred to identical content?',
        a: 'Applying Linear’s tokens transforms the neutral specimen into a dense, low-glare engineering cockpit: card padding tightens, borders become 1px translucent hairlines over #0F1011 panels, monospace identifiers (Berkeley Mono / SF Mono) anchor each row, and the primary CTA compresses into a razor-sharp #E5E5E6 pill.',
      },
      {
        q: '5. What limitations prevent conclusions about actual user behavior?',
        a: 'While high information density and dark-mode luminance stepping are widely praised in developer tools, static and interactive specimen comparisons do not measure eye fatigue in bright daylight environments or task accuracy among non-technical users.',
      },
    ],
  },

  // ===========================================================================
  // STUDY 03 — STRIPE (https://stripe.com/)
  // ===========================================================================
  {
    id: 'stripe',
    aliases: ['study-03'],
    num: '03',
    selectorLabel: 'Stripe',
    selectorSub: 'Study 03 · Expressive Hierarchy',
    name: 'Study 03: Stripe — Expressive Hierarchy & Dimensional Color',
    shortName: 'Stripe',
    subtitle: 'Light-Weight Variable Display Type (Söhne 300), Navy-Tinted Elevation & High-Chroma Action Anchors',
    sourceUrl: 'https://stripe.com/',
    sourceDomain: 'stripe.com',
    inspectedAt: '2026-11-09T12:37:51.153Z (1440×900 & 390×844 @ 2x DPR)',
    referenceDossierPath: 'design-intelligence/references/stripe.md',
    experimentReportPath: 'design-intelligence/experiments/token-extraction-study-report.md',
    themePolarity: 'High-Key Daylight (#FFFFFF / #F8FAFD) + Deep Navy (#061B31 & #0D1738 Dark Mode)',
    accentHex: '#533AFD',
    referenceCaptures: {
      desktop: '/assets/images/design-intelligence/stripe_ref_desktop_above_fold.png',
      mobile: '/assets/images/design-intelligence/stripe_ref_mobile_above_fold.png',
    },
    specimenCaptures: {
      desktopBefore: '/assets/images/design-intelligence/study_stripe_specimen_before_neutral_1440.png',
      desktopAfter: '/assets/images/design-intelligence/study_stripe_specimen_after_tokens_1440.png',
      mobileBefore: '/assets/images/design-intelligence/study_stripe_viewport_390.png',
      mobileAfter: '/assets/images/design-intelligence/study_stripe_viewport_390.png',
    },
    executiveSummary:
      'Extracted from 946 Heavy Design System (--hds-*) CSS custom properties and computed DOM nodes on stripe.com. Pairs luminous #FFFFFF / #F8FAFD surfaces and #061B31 deep navy ink (17.37:1 AAA) with light-weight (300) Söhne Variable headings, subdued slate lead copy (#64748D), 48px #533AFD violet CTAs (4px radius), and navy-tinted ambient shadows (0px 16px 32px rgba(50,50,93,0.12)).',
    comparisonMetrics: {
      hierarchy: {
        scoreLabel: 'Scale & Ink Contrast Over Font Weight',
        summary:
          'Sets 48px H1, 32px H2, and 26px H3 in light weight 300 (-0.02em tracking), creating hierarchy through size and #061B31 vs. #64748D ink contrast rather than bold weights.',
      },
      density: {
        scoreLabel: 'Spacious Editorial Bento (1264px Max-Width)',
        summary:
          'Uses generous --hds-space-core-* intervals (16px, 24px, 32px, 48px), 48px desktop (44px mobile) button heights, and layered floating UI previews inside 6px-radius bento containers.',
      },
      visualEmphasis: {
        scoreLabel: 'Dimensional Navy Shadows & #533AFD Chroma',
        summary:
          'Floating UI cards cast navy-tinted shadows (rgba(50,50,93,0.12) & rgba(0,55,112,0.08)) while #533AFD primary buttons and #FF6118 / #8A35DF accents direct focal flow.',
      },
      readability: {
        scoreLabel: '17.37:1 Solid Navy / 4.75:1 Subdued (WCAG AAA/AA)',
        summary:
          '#061B31 solid ink on #FFFFFF achieves 17.37:1 AAA; #50617A body copy achieves 6.30:1 AA on #FFFFFF (6.03:1 on #F8FAFD); #64748D subdued lead passes AA at 4.75:1 on #FFFFFF (4.54:1 on #F8FAFD).',
      },
    },
    tokenBreakdown: [
      {
        category: 'Brand, Neutral & Dark Surface Palette',
        tokenName: '--hds-color-core-brand-* / -neutral-* / -neutralDark-990',
        classification: 'A',
        classificationLabel: 'Class A · Declared CSS Token',
        desktopValue: 'brand-600: #533AFD | brand-700: #4032C8 | neutral-0: #FFFFFF | neutral-25: #F8FAFD | neutral-50: #E5EDF5 | dark: #0D1738',
        mobileValue: 'neutral-990: #061B31 | neutral-600: #50617A | neutral-500: #64748D | suite: #FF6118 | stats: #8A35DF',
        evidence: 'Declared across 946 --hds-* custom properties in b.stripecdn.com HDS stylesheet bundles.',
      },
      {
        category: 'Spacing Scale, Radii & Tinted Shadows',
        tokenName: '--hds-space-core-* / --hds-shadow-* / --hds-canary-ui-shadow',
        classification: 'A',
        classificationLabel: 'Class A · Declared CSS Token',
        desktopValue: 'maxWidth: 1264px | core: 4, 6, 8, 12, 16, 24, 32, 48, 64px | radius-sm: 4px, md: 6px | shadow: 0 16px 32px rgba(50,50,93,0.12)',
        mobileValue: '--hds-shadow-xs..xl: rgba(0,55,112,0.06–0.14) + rgba(0,59,137,0.02–0.06)',
        evidence: 'Declared in :root HDS token sheet (--hds-space-core-radius-sm/md, --hds-canary-ui-shadow).',
      },
      {
        category: 'Typography Declarations (Söhne Variable)',
        tokenName: '@font-face sohne-var / --hds-font-heading-*',
        classification: 'A',
        classificationLabel: 'Class A · Declared CSS Token',
        desktopValue: 'sohne-var ("ss01") weight 300 across --hds-font-heading-sm..xxl-weight and --hds-font-text-xs..xxl-weight; SourceCodePro wt 500',
        mobileValue: 'Identical font-family and weight 300 custom property declarations',
        evidence: 'Extracted from @font-face declarations and --hds-font-* variables in production CSS bundles.',
      },
      {
        category: 'Rendered Headings, Body & Layout Bounds',
        tokenName: 'h1.hero-section__title / h2.hds-heading--lg / p',
        classification: 'B',
        classificationLabel: 'Class B · Computed DOM Style',
        desktopValue: 'H1: 48px/55.2px (-0.96px, wt 300, x=208px) | H2: 32px/35.2px (-0.64px, x=104px) | H3: 26px/29.12px | Body: 16px/22px (#50617A)',
        mobileValue: 'H1: 34px/35.02px (-0.34px, wt 300, x=16px, w=358px) | H2: 22px/26.4px | Body: 16px/22.4px',
        evidence: 'Measured via getComputedStyle() and getBoundingClientRect() at 1440×900 and 390×844.',
      },
      {
        category: 'Buttons & Bento Card Geometry',
        tokenName: '.hds-button--primary / .hds-button--secondary / .dom-graphic__content',
        classification: 'B',
        classificationLabel: 'Class B · Computed DOM Style',
        desktopValue: 'Primary CTA: 48px h, #533AFD bg, 4px radius, 300ms cubic-bezier(0.25,1,0.5,1) | Secondary: rgba(255,255,255,0.65), 1px #B9B9F9',
        mobileValue: 'Full-width 358px × 44px stacked CTAs (y=301px primary, y=353px secondary, 8px gap); bento card w=360px, radius 6px',
        evidence: 'Measured on rendered hero CTAs and modular-solutions bento cards across both viewports.',
      },
      {
        category: 'Scale-Over-Weight Hierarchy & Chromatic Depth',
        tokenName: 'Inferred System Architecture',
        classification: 'C',
        classificationLabel: 'Class C · Inferred Pattern',
        desktopValue: 'Achieves authority via light 300-weight display scale + #061B31 vs #64748D ink contrast + navy-tinted ambient shadows',
        mobileValue: 'Preserves 300-weight hierarchy while expanding primary/secondary CTAs to full 358px column width',
        evidence: 'Synthesized from uniform 300-weight heading declarations, dual-tone .hds-heading--inline blocks, and indigo shadow tints.',
      },
    ],
    colorSwatches: [
      {
        name: 'Deep Navy Ink on Daylight White',
        token: '--hds-color-core-neutral-990 / -0',
        bgHex: '#FFFFFF',
        fgHex: '#061B31',
        contrastRatio: '17.37:1',
        wcagLevel: 'AAA',
        usage: 'Primary section headings (H2/H3) and high-emphasis data labels (Class A/B)',
      },
      {
        name: 'Soft Slate Body Copy',
        token: '--hds-color-core-neutral-600 / -25',
        bgHex: '#F8FAFD',
        fgHex: '#50617A',
        contrastRatio: '6.03:1',
        wcagLevel: 'AA',
        usage: '16px body paragraphs on subdued #F8FAFD (6.03:1; 6.30:1 on #FFFFFF) (Class A/B)',
      },
      {
        name: 'Subdued Heading Lead',
        token: '--hds-color-core-neutral-500 / -0',
        bgHex: '#FFFFFF',
        fgHex: '#64748D',
        contrastRatio: '4.75:1',
        wcagLevel: 'AA',
        usage: 'Subdued lead copy (.hds-heading--subdued, 4.75:1 on #FFFFFF; 4.54:1 on #F8FAFD) (Class A/B)',
      },
      {
        name: 'Stripe Brand Violet Primary CTA',
        token: '--hds-color-core-brand-600',
        bgHex: '#533AFD',
        fgHex: '#FFFFFF',
        contrastRatio: '6.19:1',
        wcagLevel: 'AA',
        usage: 'Primary 48px/44px action buttons and active focus borders (Class A/B)',
      },
      {
        name: 'Secondary Translucent CTA',
        token: '--hds-button--secondary',
        bgHex: '#FFFFFF',
        fgHex: '#533AFD',
        contrastRatio: '6.19:1',
        wcagLevel: 'AA',
        usage: 'Secondary action button with 1px solid #B9B9F9 (brand-200) border (Class B)',
      },
      {
        name: 'Enterprise Dark Mode Surface',
        token: '--hds-color-core-neutralDark-990',
        bgHex: '#0D1738',
        fgHex: '#FFFFFF',
        contrastRatio: '17.55:1',
        wcagLevel: 'AAA',
        usage: 'Dark mode infrastructure sections (.section.hds-mode--dark) (Class A/B)',
      },
    ],
    analyticalQuestions: [
      {
        q: '1. Which design decisions are observable?',
        a: 'Stripe’s Heavy Design System (HDS) exposes 946 CSS variables: #533AFD (--hds-color-core-brand-600) primary actions, #061B31 (--hds-color-core-neutral-990) deep navy ink, #F8FAFD subdued surfaces, #E5EDF5 1px bento borders, 4px button / 6px card radii, navy-tinted elevation (0px 16px 32px rgba(50,50,93,0.12)), and Söhne Variable set at font-weight 300 across all headings and body text.',
      },
      {
        q: '2. What functional or perceptual effects are plausible?',
        a: 'Using light font-weight 300 for 48px and 32px display headings creates an editorial, institutional poise while avoiding the visual heaviness of bold sans-serif headers. Tinting drop shadows with navy/indigo (#32325D / #003770) rather than gray makes floating white UI cards appear optically crisp on #F8FAFD backgrounds.',
      },
      {
        q: '3. Which elements improve clarity or create friction?',
        a: 'Clarity: Pairing #061B31 deep navy titles with #64748D subdued lead copy and 48px #533AFD buttons provides clear focal hierarchy across spacious bento grids. Friction: Weight 300 body copy and #64748D subdued text (4.75:1 on #FFFFFF, 4.54:1 on #F8FAFD) sit near the WCAG AA floor and can feel delicate on low-DPI displays.',
      },
      {
        q: '4. What changes when the tokens are transferred to identical content?',
        a: 'When applied to the shared neutral specimen, the interface shifts into an open, dimensional financial workbench: the canvas brightens to #F8FAFD, metric cards float on #FFFFFF with 6px radii and 0 16px 32px rgba(50,50,93,0.10) shadows, headings and metric values adopt light 300-weight Söhne proportions over #64748D subdued leads, and the verification ledger anchors in #0D1738 dark navy.',
      },
      {
        q: '5. What limitations prevent conclusions about actual user behavior?',
        a: 'Dimensional shadows, color chroma, and light-weight typography measurably alter visual hierarchy and contrast ratios, but whether they increase trust, comprehension, or conversion on a given workflow cannot be claimed without controlled user experiments.',
      },
    ],
  },
];

export const STUDY_BY_ID = Object.fromEntries(
  DESIGN_INTELLIGENCE_STUDIES.map((s) => [s.id, s])
);
