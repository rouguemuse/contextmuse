# Context & Muse: Shared site shell and service catalog

Status: **Review branch only. Not approved for production.**

## Architecture

The homepage remains a four-square experience with these intents:

1. **The Work** -> `/work/`: client projects and evidence.
2. **Build** -> `/services/`: scoped services, packages, hosting and support.
3. **The Lab** -> `/lab/`: products, templates, interactive experiments and Field Notes.
4. **Start Here** -> `/contact/` (initially): the existing verified project inquiry. A guided route finder can be introduced later without changing the four-square identity.

Do not put “Services” into a fifth homepage square. Standard website builds and custom services sit under **Build**; packaged software, downloadable templates, and editorial AI tips belong in **The Lab**, not alongside service quotations.

## Canonical files

| File | Responsibility |
| --- | --- |
| `config/site.json` | Brand, four-square routes, primary navigation, footer columns, canonical CTA |
| `config/offers.json` | Offer taxonomy, three website tiers, three monthly care tiers, all terms, inclusions/exclusions |
| `scripts/sync-site-shell.mjs` | Generates `partials/nav.html`, `partials/footer.html`, and synchronizes supported site pages |
| `scripts/render-services-page.mjs` | Renders Services pricing and offer sections from `config/offers.json` |
| `scripts/validate-site-config.mjs` | Read-only checks for routes, category structure, pricing, CTA mapping and page markers |
| `services/index.html` | Generated customer-facing offers and content under **Build** |
| `contact/index.html` | Existing intake, now also capturing a selected offer identifier as a hidden field |

Generated blocks are marked with `CXM:` comments. Do **not** manually edit prices inside generated blocks. Change the config and rerun the renderer.

## Commands

```bash
npm run sync:shell
npm run render:services
npm run check:shell
npm run check:services
npm run check:site-config
```

The scripts operate relative to the repository root instead of a specific Windows user directory.

## Commercial decisions pending owner approval

### One-time small-business website packages

- Launch: **$1,500**. One responsive page, max six sections, one standard form or booking link, two consolidated revision rounds.
- Business: **$2,950**. Up to five pages / three reusable layouts, one standard form, analytics, on-page SEO, two consolidated revision rounds.
- Growth: **$4,950**. Up to ten pages / five layouts, one simple CMS/blog collection, up to two standard forms, three tracked conversion events, three consolidated revision rounds.

Client supplies approved copy/images/brand assets. No built-in custom reservations, accounts, inventory, payments, 48-market local-SEO networks, databases or custom business calculation logic. Hosting and maintenance are separate.

### Monthly care pricing

- Hosting: **$39/month**; deployment, SSL, domain connection oversight, uptime alerts.
- Essential: **$129/month**; hosting plus monthly checks and up to 20 minutes of corrective maintenance, no requested content edits.
- Growth: **$249/month**; Essential plus up to 60 minutes of content changes and a concise monthly conversion/analytics note.

All are for one conventional business marketing website. They are **not** automatic support contracts for custom apps or user-account systems. Proposed overage rate $100/hour (30-minute increments by approval); cancellation notice 30 days; response time refers to acknowledgment during business days. No rollover, unlimited changes, blanket backup promises, 24/7 incident coverage or included paid provider fees. Existing quarterly contracts are not modified automatically.

Current live website references different plans and prices. The change is intentionally **not published** until the owner confirms these decisions and all remaining public pages are reconciled.

## Operational constraints

- Do not modify `api/lead.js`, `api/lead/index.js`, `api/lead/health.js`, Supabase lead processing, or protected validation logic. Respect `PRODUCTION_LOCKS.md`.
- The contact-page change only records the selected offering in the existing form submission; it does not introduce a new backend.
- Field Notes subscribers must never be captured as project sales leads. Publish a newsletter form only when a separate opt-in and unsubscribe workflow is functional.
- Distinguish verified client projects, independent prototypes, and product demonstrations. Do not imply custom EDR, INNcontrol, or Lone Wolf system functions are included in a standard website tier.
- Maps With Teeth is a separate public-interest initiative; don't package it as a Context & Muse SaaS product.

## Pre-merge checklist

1. Approve the website and care numbers and commercial boundaries.
2. Run all check commands. Confirm no config drift, broken links, missing anchors, or duplicated nav/footer markup.
3. Compare desktop and mobile layouts of homepage, Services, Work, Lab, Contact and at least one deep case study.
4. Verify every service tier CTA routes to the correct contact choice; test that a staged inquiry persists and retains the selected-offer field.
5. Test shared mobile navigation, keyboard tab order, skip links, external anchors, and footer links.
6. Reconcile obsolete pricing in the old Quick Launch and Systems pages before merging. Do not blanket-search-and-replace prices, because Signal is a separate product.
7. Verify canonical URLs, redirects, search indexability and any privacy disclosures.
8. Review preview deployment. Merge only after owner approval.

## Future work

The four-square interaction on the homepage is a distinct UI project. This configuration establishes the destinations without replacing the current homepage. The Lab archive, email list, and guided Start Here route require independent completion and should not become inert navigation buttons.
