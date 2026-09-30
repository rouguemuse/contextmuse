# PRODUCTION LOCKS

## LEAD BACKEND — LOCKED

### Status:
Production verified

### Architecture:
```
public form
→ /api/lead
→ Supabase lead-capture
→ public.leads
```

### Verified:
- durable persistence
- real production contact form (`lead_mungm0rm_e9a785f05ca2`)
- real production Signal form (`lead_mungm5m9_389e027170bb`)
- database read-back
- duplicate protection
- validation failure UX retention
- attribution metadata (`source_page`, `inquiry_type`, `form_id`)
- RLS (Row-Level Security on Supabase `public.leads`)
- zero Formspree dependency

### Protected Files / Systems:
- `api/lead.js`
- `api/lead/index.js`
- `api/lead/health.js`
- Supabase project: Context & Muse Leads (`erhltgrchbufcunnsvnb`)
- Supabase Edge Function: `lead-capture`
- Supabase table: `public.leads`
- lead form submission contract to `/api/lead`
- idempotency logic
- rate limiting
- honeypot behavior
- validation behavior
- metadata normalization
- `source_page` attribution
- `inquiry_type` attribution
- failure UX contract
- success-after-persistence rule

### Rule:
**DO NOT MODIFY THESE COMPONENTS** as part of SEO, visual design, portfolio, image replacement, copy editing, navigation cleanup, or unrelated site work.

Changes require an explicit instruction containing:
`UNLOCK LEAD BACKEND`
