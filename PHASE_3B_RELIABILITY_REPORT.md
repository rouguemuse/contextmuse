# Context & Muse — Phase 3B Reliability & Claim-Integrity Report
**Status:** `CODE COMPLETE — PERSISTENCE NOT YET VERIFIED` (Requires owner `DATABASE_URL` configuration in production environment)  
**Date:** September 29, 2026  
**Auditor / Engineer:** Antigravity AI Engineering  
**Scope:** Canonical Lead Capture Backend (`POST /api/lead`), Database Persistence Architecture, Claim Integrity & Evidence Remediation, Response Time Normalization, and Frontend Resilience.

---

## 1. Executive Status & Deployment Clearance

> [!WARNING]
> **DEPLOYMENT STATUS: HOLD PENDING DATABASE CREDENTIAL CONFIGURATION**  
> All application code, backend endpoints, database migration scripts, frontend form handlers, and copy integrity remediations are complete and pass all unit, integration, and site-wide QA checks. However, live persistence is **NOT YET VERIFIED IN PRODUCTION** because a live PostgreSQL database connection string (`DATABASE_URL` or `POSTGRES_URL`) has not yet been bound to the hosting environment.

The codebase now enforces strict fail-safe behavior:
- **No False Success:** The frontend displays confirmation **only** after `POST /api/lead` confirms durable database storage.
- **Input Preservation:** If the database write fails or is unconfigured, user form entries are completely preserved and a clear message is displayed:
  > *"We couldn't safely save your inquiry yet. Please try again."*
- **Formspree Decoupled:** Formspree is no longer a primary delivery dependency. It functions strictly as an optional, secondary asynchronous notification channel triggered only *after* a lead is committed to the database.

---

## 2. Complete Inventory of Forms Found & Migrated

Every public inquiry form across the marketing site has been migrated from direct third-party Formspree submissions to the canonical `POST /api/lead` backend:

| # | Route / Page | Form ID | Source Page | Migration Status | Error Handling & UX |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `/contact/`<br>`contact/index.html` | `contact-wizard`<br>(`intelligent-intake-form`) | `/contact/` | **MIGRATED**<br>`POST /api/lead` | 3-step wizard; preserves step and inputs on error; returns `submission_id` to `/contact/success/?submission_id=...` |
| **2** | `/custom/`<br>`custom/index.html` | `custom-intake-form` | `/custom/` | **MIGRATED**<br>`POST /api/lead` | Form inputs preserved on error; inline confirmation displays generated `submission_id` |
| **3** | `/systems/`<br>`systems/index.html` | `systems-intake` | `/systems/` | **MIGRATED**<br>`POST /api/lead` | Replaced native POST; AJAX submission; displays generated `submission_id` inline |
| **4** | `/services/quote-lead-systems/`<br>`services/quote-lead-systems/index.html` | `qls-intake-form` | `/services/quote-lead-systems/` | **MIGRATED**<br>`POST /api/lead` | Captures territory and quote friction points; displays inline reference ID |
| **5** | `/website-system-check/`<br>`website-system-check/index.html` | `diagnostic-inquiry` | `/website-system-check/` | **MIGRATED**<br>`POST /api/lead` | Binds automated scan output context to durable lead record; displays inline reference ID |
| **6** | `/about/`<br>`about/index.html` | `about-conversation` | `/about/` | **MIGRATED**<br>`POST /api/lead` | Lightweight direct intake; displays inline reference ID |
| **7** | `/partners/`<br>`partners/index.html` | `partners-intake` | `/partners/` | **MIGRATED**<br>`POST /api/lead` | Replaced native POST; white-label agency inquiry captured to DB |
| **8** | `/quick-launch/`<br>`quick-launch/index.html` | `quick-launch-intake` | `/quick-launch/` | **MIGRATED**<br>`POST /api/lead` | Replaced native POST; captures scoping answers to DB; displays inline reference ID |
| **9** | `/signal/intake/`<br>`signal/intake/index.html` | `signal-branch-1`<br>`signal-branch-2`<br>`signal-branch-3` | `/signal/intake/` | **MIGRATED**<br>`POST /api/lead` | Replaced native POST across all 3 intake branches; captures operational context into `answers_json` |
| **10** | `/preview/`<br>`preview/index.html` | `preview-homepage-intake` | `/preview/` | **MIGRATED**<br>`POST /api/lead` | Staging preview form unified with canonical backend |

---

## 3. Database Selection & Canonical Schema

### Selected Database Engine
- **Engine:** PostgreSQL 15+ (Direct connection pooling via `pg`).
- **Compatibility:** Fully compatible with **Neon Serverless Postgres**, **Supabase**, **Vercel Postgres**, **AWS RDS**, or self-hosted PostgreSQL.
- **Auto-Initialization:** The backend (`api/_lib/db.js`) automatically executes idempotent schema creation and defensive `ALTER TABLE` upgrades upon initial startup.

### Canonical Schema (`leads` table)
```sql
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(32) DEFAULT 'received',
  is_test BOOLEAN DEFAULT FALSE,
  form_id VARCHAR(64) NOT NULL,
  source_page VARCHAR(255) NOT NULL,
  inquiry_type VARCHAR(64) NOT NULL DEFAULT 'other',
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  company VARCHAR(255),
  website VARCHAR(512),
  message TEXT,
  budget_range VARCHAR(64),
  timeline VARCHAR(64),
  answers_json JSONB,
  utm_source VARCHAR(128),
  utm_medium VARCHAR(128),
  utm_campaign VARCHAR(128),
  utm_content VARCHAR(128),
  referrer VARCHAR(512),
  notification_status VARCHAR(32) DEFAULT 'pending',
  schema_version VARCHAR(16) DEFAULT 'v1',
  client_ip_hash VARCHAR(64),
  user_agent VARCHAR(512),
  idempotency_hash VARCHAR(64) UNIQUE
);

-- Indexing for performance and operations
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_form_id ON leads(form_id);
CREATE INDEX IF NOT EXISTS idx_leads_inquiry_type ON leads(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_leads_is_test ON leads(is_test);
CREATE INDEX IF NOT EXISTS idx_leads_notification_status ON leads(notification_status);
```

### Inquiry Type Normalization & Unknown Form Catch-All
- Recognizes canonical types: `'contact'`, `'quote'`, `'custom'`, `'systems'`, `'signal'`, `'partner'`.
- **Catch-All:** Any unrecognized form or service type defaults safely to `'other'`.
- **Preservation:** All submitted key/value pairs from any form are captured verbatim in `answers_json`, ensuring zero data loss regardless of future frontend form evolution.

---

## 4. Double-Click Protection & Idempotency

Multi-click and accidental double-submission protection is enforced at the service layer:
- **30-Second Hash Window:** An SHA-256 hash is computed from `email + form_id + message + 30s_window_slot`.
- **Duplicate Handling:** If an identical submission arrives within 30 seconds:
  - The backend retrieves the existing record.
  - Returns `{ success: true, submission_id: existing.id, status: 'received', duplicate: true }`.
  - **No duplicate record** is created in the database.
- **Legitimate Inquiries Preserved:** If the visitor sends a follow-up inquiry with different content or submits a quote form after submitting a contact form, the hashes differ and both leads are stored cleanly.

---

## 5. Secondary Notification Pipeline

- **Execution Order:** Notification dispatch occurs **strictly after** the database write succeeds.
- **Supported Providers:** Resend (`RESEND_API_KEY`), SendGrid (`SENDGRID_API_KEY`), or Formspree Webhook (`FORMSPREE_BACKEND_FORWARD_URL`).
- **Resilience:** If the secondary notification provider fails or is unconfigured:
  - The database record's `notification_status` is updated to `'failed'` or `'unconfigured'`.
  - The HTTP response to the visitor is **NOT** failed; the visitor still receives their verified `submission_id`.
  - The inquiry remains safely stored in the database for manual review or batch export.

---

## 6. How the Owner Accesses & Exports Leads

### Option A: Direct SQL Query
The owner can inspect inbound inquiries directly in Neon / Supabase SQL console:
```sql
SELECT id, created_at, inquiry_type, name, email, phone, company, message
FROM leads
WHERE is_test = FALSE
ORDER BY created_at DESC
LIMIT 50;
```

### Option B: CLI Export Tool (`scripts/export_leads.js`)
An automated lead export utility is provided in the repository:
```bash
# Export recent leads as CSV to a file
node scripts/export_leads.js --format=csv --limit=200 --out=leads_export.csv

# Export recent leads as formatted JSON to stdout
node scripts/export_leads.js --format=json --limit=50
```

---

## 7. Evidence & Claim-Integrity Remediation

All unverified claims identified in Phase 3B blockers have been audited and corrected across all public pages:

### Blocker 2: Floorplan Equipment Mappers (Unverified Capability Proof)
- **Issue:** INNcontrol was described as an interactive 2D floorplan equipment mapper for hotel rooms, which was unverified as production client software.
- **Remediation:** Removed all mentions of "Floorplan Equipment Mappers" from credibility bars, metadata, and service descriptions. Replaced with verified capability proof:
  - `index.html`: Replaced "Floorplan Equipment Mappers" with "Commercial Service Platforms" and "Operational estimation engines".
  - `custom/index.html`: Replaced "floorplan unit mappers" with "Commercial service platforms and operational estimation engines".
  - `partners/index.html`: Replaced "2D visual floorplan mapper" with "commercial service platform allowing field technicians to record unit diagnostics".
  - `systems/client-builds/index.html`: Replaced floorplan canvas copy with "operational field diagnostic and proposal estimation software".
  - `website-system-check/index.html`: Replaced "INNcontrol Commercial Estimator & Floorplan Mapper" with "INNcontrol Commercial Service Platform & Estimator".

### Blocker 3: Unverified Outcome Metrics
- **Issue:** Claims such as "eliminated 40+ manual dispatch emails/week", "generating 40+ manual dispatch callbacks per week", and "speeding proposal turnaround from 5 days to 20 minutes" lacked benchmark audit records.
- **Remediation:** Replaced quantitative assertions with functional system descriptions:
  - `index.html`: *"Prospects across North Texas markets couldn't verify coverage or container sizing, requiring manual phone triage and dispatch territory verification."*
  - `website-system-check/index.html`: *"Replaced a generic contact form with an interactive volume calculator and real-time territory validator, automating lead qualification and dispatch territory routing."*
  - `website-system-check/index.html`: *"Engineered a commercial service platform and estimation workbench for hospitality HVAC refurbishment, replacing paper surveys with structured digital scoping and standardized proposal estimation."*

### Blocker 4: Turnaround Promises
- **Issue:** Promises to respond "within 1 business day", "within 24 hours", or "within 24–48 hours" created unapproved operational commitments.
- **Remediation:** Standardized all inquiry response copy across `contact/`, `contact/success/`, `custom/`, `index.html`, `partners/`, `preview/`, `quick-launch/`, `services/quote-lead-systems/`, `signal/intake/`, `systems/`, and `website-system-check/` to:
  > *"I personally review every inquiry and will respond after reviewing the business and project context."*

### Blocker 5: Trust Claims Audit
- Replaced absolute and unverified claims:
  - *"100% bespoke code with zero plugin bloat"* $\rightarrow$ *"Custom architecture designed for performance and reliability"*
  - *"Fixed-scope proposals with zero hidden fee surprises"* $\rightarrow$ *"Direct fixed-scope proposals with clear milestones"*
  - *"100% bespoke code with full client data ownership"* $\rightarrow$ *"Full client ownership of deployment, source code, and data"*

### Blocker 6: Email Input Labeling
- Audited all input fields: all public forms label the input simply `Email` or `Email Address` and do not reject personal email domains (`@gmail.com`, `@icloud.com`).

---

## 8. Verification & Test Results

### 1. Backend Service Unit Tests (`scripts/test_lead_backend.mjs`)
- **Status:** **19 PASSED, 0 FAILED**
- Verified test cases:
  1. Unconfigured DB reports `503 DATABASE_UNCONFIGURED` with safe user error message.
  2. Health check reports unconfigured status when connection string missing.
  3. Health check reports healthy in mock mode.
  4. Invalid email format rejected with `400 Bad Request`.
  5. Missing/blank name rejected with `400 Bad Request`.
  6. Honeypot drop returns synthetic `200` without database persistence.
  7. Valid submission succeeds with durable `lead_` prefix ID.
  8. Submission status reports `received`.
  9. Record persisted in storage layer.
  10. Record preserves `is_test: true` flag.
  11. Normalized `inquiry_type` assigned correctly.
  12. Phone number extracted and normalized.
  13. Extra custom attributes preserved in `answers_json`.
  14. Unknown form submitted without predefined schema accepted.
  15. Unknown form falls back to `inquiry_type = "other"`.
  16. Unknown form fields preserved in `answers_json`.
  17. 30-second multi-click duplicate returns existing `submission_id`.
  18. Legitimate subsequent inquiry from same email is stored as distinct lead.
  19. IP sliding-window rate limiter blocks after threshold.

### 2. HTTP Integration Tests (`scripts/test_lead_http.mjs`)
- **Status:** **7 PASSED, 0 FAILED**
- Verified test cases:
  1. `GET /api/lead/health` returns `200 OK` with configured status.
  2. `GET /api/lead?check=health` returns `200 OK`.
  3. `POST /api/lead` returns `201 Created` with contract `{ success: true, submission_id: "...", status: "received", created_at: "..." }`.
  4. Duplicate `POST` returns existing `submission_id` with `duplicate: true`.
  5. Missing email returns `400 Bad Request`.
  6. Honeypot returns synthetic `201 Created` with `sub_spm_` ID.
  7. `PUT /api/lead` returns `405 Method Not Allowed`.

### 3. Site-Wide Verification (`scripts/verify_site.js`)
- **Status:** **FINAL VERIFICATION RESULT: SUCCESS / PASSED**
- 0 broken links, 0 schema errors, 0 missing assets, single `<h1>` on all route pages, clean canonical tags.

---

## 9. Next Steps for Owner (To Achieve Live Verification)

To transition from `CODE COMPLETE — PERSISTENCE NOT YET VERIFIED` to `PRODUCTION LIVE`:

1. **Create PostgreSQL Instance:**
   - In Neon (neon.tech) or Supabase (supabase.com), create a new PostgreSQL project named `contextmuse-leads`.
2. **Set Environment Variable in Vercel:**
   - Go to Vercel Project Settings $\rightarrow$ Environment Variables.
   - Add `DATABASE_URL` with your connection string:
     `postgresql://<user>:<password>@<host>/<dbname>?sslmode=require`
3. **Optional Email Notifications:**
   - Add `RESEND_API_KEY` (recommended) or `SENDGRID_API_KEY`.
   - Add `LEAD_NOTIFICATION_EMAIL=jayme@contextmuse.com`.
4. **Deploy & Submit Verification Lead:**
   - Trigger a deployment on Vercel.
   - Run a test submission with `is_test: true` or inspect `/api/lead/health`.
   - Verify lead record in `leads` table.
