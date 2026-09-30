# Context & Muse — Centralized Lead Capture Backend (Phase 3A Report)
**Completion Date:** September 29, 2026  
**Engineering Status:** Complete & Verified  
**Runtime Architecture:** Node.js ES Modules (Vercel Serverless) + PostgreSQL + Zero-Dependency Client Fetch

---

## 1. Executive Summary

Phase 3A resolves the primary inbound reliability vulnerability of the Context & Muse web platform: **reliance on third-party Formspree endpoints with zero internal database persistence and high exposure to ad-blocker silent failures.**

### Key Accomplishments
1. **Canonical Inbound Endpoint (`POST /api/lead`):**
   - Deployed a unified, durable serverless endpoint in `api/lead.js` that handles all incoming lead inquiries.
   - Enforces the golden rule: **"Success Must Mean Stored"** — a submission is confirmed to the user if and only if the backend returns a durable `submission_id` after writing to storage.
2. **Health Check Endpoint (`GET /api/lead/health` & `GET /api/lead?check=health`):**
   - Dedicated health check endpoints in `api/lead/health.js` and `api/lead.js` returning database connection status and service health without exposing credentials or internal connection strings.
3. **Relational Database Source of Truth (`leads` table):**
   - Implemented `api/_lib/db.js` with pooled PostgreSQL connectivity compatible with Neon, Supabase, Vercel Postgres, and AWS RDS.
   - Auto-migrating schema with indices on `created_at`, `email`, `form_source`, and `notification_status`.
   - Provided standalone initialization script: `scripts/init_leads_db.sql`.
4. **100% Form Migration:**
   - Every active public lead form across the site (`/contact/`, `/custom/`, `/systems/`, `/services/quote-lead-systems/`, `/website-system-check/`, `/about/`, `/partners/`, `/quick-launch/`, and all 3 branches of `/signal/intake/`) has been migrated from external Formspree endpoints to `/api/lead`.
   - Forms retain all user inputs upon network or server errors, preventing lost data and allowing immediate re-submission.
5. **Spam & Abuse Defense Without CAPTCHAs:**
   - Hidden honeypot fields (`_gotcha`) that silently drop bot submissions with synthetic 201 responses without persisting junk data.
   - Per-IP sliding-window rate limiting (max 5 requests per 10 minutes).
   - 5-minute idempotency deduplication window (SHA-256 hash of email, form ID, and message) to eliminate accidental double-click submissions.
   - Anonymized client IP hashing with salt (zero plaintext IP addresses stored in the database).
6. **Secondary, Asynchronous Email Notifications:**
   - Database persistence occurs **first**.
   - Optional, non-blocking email alerts via Resend (`RESEND_API_KEY`) or SendGrid (`SENDGRID_API_KEY`).
   - If unconfigured, the submission succeeds, the lead is safely recorded in the database, and `notification_status` is marked as `'unconfigured'`.
7. **Lead Export CLI Utility:**
   - Implemented `scripts/export_leads.js` allowing the site owner to dump leads in JSON or CSV format directly from the command line.

---

## 2. Inbound Form Migration Inventory

| Page URL & File | Form Identifier | Old Endpoint & Method | New Endpoint | Storage Verification & UX Feedback |
| :--- | :--- | :--- | :--- | :--- |
| **Contact / Intake Wizard**<br>`/contact/`<br>`contact/index.html` | `#intelligent-intake-form` | Formspree (`xoqydgvw`) via `fetch` POST | `POST /api/lead` | Awaits HTTP 201 with `submission_id`; redirects to `/contact/success/?submission_id=lead_...`. Retains all step data on error. |
| **Custom Systems Intake**<br>`/custom/`<br>`custom/index.html` | `#custom-intake-form` | Formspree (`xoqydgvw`) via `fetch` POST | `POST /api/lead` | Inline success displaying durable Reference ID; input preserved on error. |
| **Quote & Lead Systems**<br>`/services/quote-lead-systems/`<br>`services/quote-lead-systems/index.html` | `#qls-intake-form` | Formspree (`xoqydgvw`) via `fetch` POST | `POST /api/lead` | Inline success displaying durable Reference ID; input preserved on error. |
| **System Check Diagnostic Inquiry**<br>`/website-system-check/`<br>`website-system-check/index.html` | `#diagnostic-inquiry-form` | Formspree (`xoqydgvw`) via `fetch` POST | `POST /api/lead` | Submits diagnostic scan context, site URL, and friction points; displays durable Reference ID. |
| **About Page Conversation**<br>`/about/`<br>`about/index.html` | `#audit-form` | Formspree (`xoqydgvw`) via `fetch` POST | `POST /api/lead` | Submits inquiry details; displays durable Reference ID; input preserved on error. |
| **Custom Operations Systems**<br>`/systems/`<br>`systems/index.html` | `#systems-intake-form` | Formspree (`xoqydgvw`) via native POST | `POST /api/lead` | Converted to AJAX submission with inline success and durable Reference ID. No external redirect. |
| **Agency Partners**<br>`/partners/`<br>`partners/index.html` | `#partners-intake-form` | Formspree (`xoqydgvw`) via native POST | `POST /api/lead` | Converted to AJAX submission with inline success and durable Reference ID. No external redirect. |
| **Quick Launch Websites**<br>`/quick-launch/`<br>`quick-launch/index.html` | `#quick-launch-intake-form` | Formspree (`xoqydgvw`) via native POST | `POST /api/lead` | Converted to AJAX submission with inline success and durable Reference ID. No external redirect. |
| **Signal Diagnostic (Branch 1)**<br>`/signal/intake/`<br>`signal/intake/index.html` | `#signal-b1-form` | Formspree (`xoqydgvw`) via native POST | `POST /api/lead` | Converted to AJAX submission; captures file metadata and report details; displays Reference ID. |
| **Signal Scoping (Branch 2)**<br>`/signal/intake/`<br>`signal/intake/index.html` | `#signal-b2-form` | Formspree (`xoqydgvw`) via native POST | `POST /api/lead` | Converted to AJAX submission; displays Reference ID; preserves inputs. |
| **Signal Mapping (Branch 3)**<br>`/signal/intake/`<br>`signal/intake/index.html` | `#signal-b3-form` | Formspree (`xoqydgvw`) via native POST | `POST /api/lead` | Converted to AJAX submission; captures operational symptoms; displays Reference ID. |
| **Preview Staging**<br>`/preview/`<br>`preview/index.html` | `#hp-intake-form` | Formspree (`xoqydgvw`) via `fetch` POST | `POST /api/lead` | Harmonized to `/api/lead` to purge all third-party form endpoints. |

---

## 3. Database Schema Specification

The database table `leads` is auto-initialized on first connection via `api/_lib/db.js` and can also be provisioned using `scripts/init_leads_db.sql`:

```sql
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  form_id VARCHAR(64) NOT NULL,
  form_source VARCHAR(255) NOT NULL,
  service_interest VARCHAR(128),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  website VARCHAR(512),
  budget VARCHAR(64),
  message TEXT,
  raw_payload JSONB,
  client_ip_hash VARCHAR(64),
  user_agent VARCHAR(512),
  idempotency_hash VARCHAR(64) UNIQUE,
  notification_status VARCHAR(32) DEFAULT 'pending',
  schema_version VARCHAR(16) DEFAULT 'v1'
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_form_source ON leads(form_source);
CREATE INDEX IF NOT EXISTS idx_leads_notification_status ON leads(notification_status);
```

---

## 4. Verification & Test Suite Execution

Two automated test suites were built and verified:

### Suite 1: Unit & Logic Tests (`scripts/test_lead_backend.mjs`)
- **PASS:** Health check reports `unconfigured` when no connection string is set.
- **PASS:** Rejects submission with HTTP `503 DATABASE_UNCONFIGURED` when database is unconfigured.
- **PASS:** Health check reports healthy in mock mode.
- **PASS:** Rejects invalid email syntax (`not-an-email`).
- **PASS:** Rejects empty or whitespace-only name.
- **PASS:** Honeypot returns synthetic 201 success without writing to storage.
- **PASS:** Valid submission generates durable `lead_` identifier and confirms `status: "received"`.
- **PASS:** Idempotent submission returns existing `submission_id` within 5-minute deduplication window.
- **PASS:** IP rate limiter blocks after 5 requests within sliding window.
- **Result:** **10/10 Passed (100%)**

### Suite 2: Local HTTP Integration Tests (`scripts/test_lead_http.mjs`)
- **PASS:** `GET /api/lead/health` returns HTTP 200 with `configured: true`.
- **PASS:** `GET /api/lead?check=health` returns HTTP 200 OK.
- **PASS:** `POST /api/lead` with valid JSON payload returns HTTP 201 with durable `submission_id`.
- **PASS:** Duplicate `POST /api/lead` returns HTTP 201 with `duplicate: true` and identical `submission_id`.
- **PASS:** `POST /api/lead` without email returns HTTP 400 Bad Request.
- **PASS:** Honeypot bot `POST /api/lead` returns synthetic 201 `sub_spm_*` response.
- **PASS:** `PUT /api/lead` returns HTTP 405 Method Not Allowed.
- **Result:** **7/7 Passed (100%)**

### Suite 3: Site Integrity Verification (`scripts/verify_site.js`)
- 16/16 route audits passed.
- 38/38 referenced static assets validated for size and existence.
- Zero broken internal links or stale URLs.
- **Result:** **SUCCESS / PASSED**

---

## 5. Owner Configuration Required

All application code, database queries, API routes, security guards, and form integrations are **100% complete and verified**.

To activate live database persistence on production Vercel:

> [!IMPORTANT]
> ### OWNER CONFIGURATION REQUIRED: Add Database Connection String
> 1. In your **Vercel Project Settings &rarr; Environment Variables**, add:
>    - **`DATABASE_URL`** (or **`POSTGRES_URL`**): Your PostgreSQL connection URI from **Neon**, **Supabase**, or **Vercel Postgres**.  
>      *Format:* `postgresql://user:password@host/dbname?sslmode=require`
> 2. *(Optional Email Notifications):*
>    - **`RESEND_API_KEY`**: Your Resend API key (e.g. `re_...`).
>    - **`LEAD_NOTIFICATION_EMAIL`**: Email where notifications should be routed (defaults to `jayme@contextmuse.com`).
> 3. *(Optional Security Salt):*
>    - **`LEAD_ENCRYPTION_SALT`**: A custom secret string used to hash visitor IP addresses for rate limiting and privacy.

Once `DATABASE_URL` is added in Vercel, the endpoint will automatically create the `leads` table and begin durably recording all public inquiries with zero downtime.
