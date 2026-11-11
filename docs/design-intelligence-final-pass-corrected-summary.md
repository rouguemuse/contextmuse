# Design Intelligence Final Pass: Corrected Summary

Date: 2026-11-11. Branch: `release/final-launch-candidate`.

This replaces the chat summary and the `destokcas.pdf` export of the final evidence pass. Every token value below was checked against the reference dossiers in `design-intelligence/references/`. The older summary quoted several values that do not appear anywhere in the repo, and the PDF had broken character encoding and missing links.

## 1. Token values: corrected

| Claim | Old summary said | Repo dossier says (source line) |
|---|---|---|
| Locomotive primary easing | `cubic-bezier(0.22, 1, 0.36, 1)` | `cubic-bezier(0.23, 1, 0.32, 1)` (`locomotive.md:52`) |
| Locomotive `#312DFB` variable | `--color-accent` | `--menu-color-bg` (`locomotive.md:45`) |
| Linear `--color-accent` | not stated | `#7170ff` (`linear.md:38`) |
| Linear `--color-bg-level-1` | `#0f1011` | `#0f1011`, also exposed as `--color-bg-panel` (`linear.md:24`) |
| Linear header height | `64px` | `72px` (`linear.md:76`) |
| Stripe subdued surface | `--hds-color-surface-secondary: #f7f5f2` | `--hds-color-core-neutral-25: #f8fafd` (`stripe.md:28`) |
| Stripe text primary / secondary | `--hds-color-text-primary` / `-secondary` | `--hds-color-core-neutral-990: #061b31` / `--hds-color-core-neutral-500: #64748d` (`stripe.md:32-35`) |
| Stripe brand | `--hds-color-action-primary-default: #533afd` | `--hds-color-core-brand-600: #533afd` |
| Stripe primary button | `36px` tall, `1px solid #533afd` | `48px` desktop / `44px` mobile, `4px` radius, `#533AFD` fill (`stripe.md:74`) |
| Stripe card shadow | `rgba(5, 24, 44, 0.06) 0px 8px 16px -4px` | `0px 16px 32px rgba(50, 50, 93, .12)` (`stripe.md:55`) |

Note: `cubic-bezier(0.22, 1, 0.36, 1)` is the textbook ease-out-quint curve. ContextMuse's own page transitions use it (`TransitionContext.jsx:99`, `RoomShell.jsx:39`, `MethodMap.jsx:20`), and that is probably how it ended up in the summary. The transferred Locomotive token is `0.23, 1, 0.32, 1`.

## 2. What changed in this pass

- **The split comparison now shares one left edge.** Before this pass, the specimen used different outer padding per variant (Neutral 24px, Locomotive 40px, Linear 46px, Stripe 48px on desktop), so the split view showed words repeated across the divider. All four variants now use one inset: 40px on desktop, 20px on mobile (`DesignSystemSpecimen.jsx`, `FRAME_INSET_X`). Each source's own outer margin is still recorded as evidence but is no longer applied. Fonts and type scale still change line lengths, so text will not match glyph for glyph across the divider. That difference is the thing being compared.
- **The slider handle no longer clips.** At 0% and 100% the knob used to be half outside the stage. It now slides to stay inside the frame.
- **Linear reference capture re-shot.** The earlier capture showed only the nav over a black page because the hero had not rendered. The new captures (2026-11-11) show the H1 at x=78px, 64px on desktop and x=23px, 38px on mobile, matching `linear.md:95`. Files: `linear_ref_desktop_above_fold.png`, `linear_ref_mobile_above_fold.png`, `cs_4x3_linear_reference.png`.
- **Mobile room-tile drift (experiment branch only).** On `experiment/design-intelligence-01-locomotive`, the header and hero sit at 20px on mobile but room tiles used `p-6` (24px). The fix (`px-5 py-6 sm:p-8`) is in the `../contextmuse-exp01` worktree and is not committed. The "0px drift" mobile plate was captured before this fix.

## 3. Checked and left as is

- **Locomotive READY badge `#312DFB`.** This is intentional. The Study 01 transfer adaptation keeps Locomotive's declared accent next to the ContextMuse palette (`designIntelligenceStudies.js`, "Palette Substitution").
- **Synthetic data labels.** These are present in the specimen and in the stage banner.
- **Desktop plumb line on the ContextMuse entrance (`52e179d` to `195921a`).** Logo, hero and footer share one left edge in the 1440 AFTER plate.

## 4. Remaining limitations

- No live behaviour or conversion data. All metrics in the specimen are synthetic.
- Licensed fonts (LocomotiveNew, HelveticaNowDisplay, Berkeley Mono, Söhne) are not bundled, so the specimen renders with system fallbacks.
- Token extraction covers public marketing pages only. Linear's homepage content changed between the April inspection and the November re-capture. Token values were not re-extracted.
