# Context & Muse / Four-Square Homepage

**Status:** isolated coded prototype on \`feature/four-square-hybrid-prototype\`; not installed as the homepage or promoted to production.

**Preview route:** \`/prototypes/four-square/\`

## Purpose and visual direction

The four-square is the homepage identity. There is **no separate giant statement/hero** before the grid. A small introductory line sets context. The squares themselves explain how the studio can help:

- **01 Work:** Verified case studies with project switching and an interactive three-step walkthrough of each documented capability.
- **02 Build:** A scoped package comparison. Website and care packages are read from \`/config/offers.json\` at runtime, not duplicated in the JavaScript. Custom software stays separate.
- **03 Lab:** Products, proposed templates, visual experiments, and the Field Notes editorial archive. No fake checkout or newsletter capture.
- **04 Start Here:** A no-email, two-click problem finder suggesting a relevant example and an actual destination.

**Hybrid motion** means the outer layout uses precise geometric expansion. The interior of each square has its own visual identity and purposeful interaction. All content is reversible and keyboard-accessible.

## Files

| Path | Responsibility |
| --- | --- |
| \`prototypes/four-square/index.html\` | Semantic resting state, four square panels, shared header/footer |
| \`assets/css/four-square.css\` | Hybrid 2x2-to-rail motion, panel styling, responsive accordion, reduced motion |
| \`assets/js/four-square/controller.js\` | State machine, browser History API, rendering, interactions and offer configuration |
| \`assets/js/four-square/content.js\` | Grounded project proof walkthroughs, Lab shelf descriptions, guided recommendations |
| \`config/site.json\` | Canonical four-square routes and global site navigation |
| \`config/offers.json\` | Canonical prices, package inclusions, exclusions and public/proposed status |
| \`scripts/check-four-square.mjs\` | Offline data, syntax, markup and asset integrity checks |

## Running locally

\`\`\`bash
npm run check:site-config
npm run check:shell
npm run check:services
npm run check:four-square

python3 -m http.server 8080
# Open http://localhost:8080/prototypes/four-square/
\`\`\`

A local server is required because the prototype loads \`/config/site.json\` and \`/config/offers.json\` from same-origin paths. Opening the HTML directly with a \`file://\` URL will not load the config.

Use \`npm run sync:shell\` after changes to \`config/site.json\`. Its renderer updates generated shared navigation/footer blocks, including the prototype, to keep a single site shell.

## Interaction details

- Desktop: 2×2 resting state; selecting a square expands it, keeping the other three as a compact vertical rail.
- Mobile: natural stacked panels, with the selected panel at the top and other destinations still visible.
- Click again on another rail item to switch; the Close button or Escape collapses the view.
- Keyboard: all square buttons and inner controls are reachable by Tab; arrow keys and Home/End can move focus among the four squares.
- Direct URLs: \`?square=work&project=edr&step=2\`, \`?square=build&mode=websites&tier=business\`, \`?square=lab&shelf=notes\`, \`?square=start&problem=leads\`.
- Browser back/forward restores UI state without a reload.
- \`prefers-reduced-motion\` disables decorative transitions and uses immediate mobile scrolling.

## Ground rules

1. No direct client backend calls, bookings, or false availability checks. Work walkthroughs reflect documented case studies and are explicitly not live client software.
2. The pricing packages \`$1,500 / $2,950 / $4,950\` and \`$39 / $129 / $249\` are **proposals, not published production promises**. Build reads them from canonical config.
3. No newsletter subscriber data enters the protected sales-lead backend. Field Notes links to its existing archive.
4. No changes to \`api/lead.js\`, Supabase, payment, existing client code, or the production homepage.
5. This route has \`noindex,nofollow\` and is intended for review only. Do not link it from production navigation until approved.

## Review checklist

- [ ] Open all four panels on desktop and mobile.
- [ ] Switch between at least two case studies and inspect each three-step explanation.
- [ ] Inspect all three standard website packages and all care plans.
- [ ] Confirm real config changes update the Build preview without JS edits.
- [ ] Browse all four Lab shelves; templates should not advertise a fictitious checkout.
- [ ] Select each Start Here problem and verify its two destination links.
- [ ] Verify Escape, Close, keyboard tab/focus, arrows, and browser Back/Forward.
- [ ] Verify images, fonts, responsive overflow, and reduced-motion settings.
- [ ] Run the four-square, shared-shell, services and overall config checks.

## Next stage after approval

Refine advanced interactions in the Work square using sanitized, testable demonstrations (e.g. local ZIP routing models, EDR reservation eligibility) without connecting to production customer data. Finish the Field Notes subscriber infrastructure separately. Then swap the homepage layout only after full regression tests and a reviewed production release.
