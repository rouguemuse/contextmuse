# Context & Muse — GA4 Lead + Funnel Event Implementation & Verification

**Domain Audited:** `https://www.contextmuse.com`  
**Deployment Target:** `contextmuse-homepage` on Vercel  
**Production Aliases:** `https://www.contextmuse.com` · `https://contextmuse.com`  
**Google Analytics Measurement ID:** `G-MVV7WNL42L`  
**Audit Status:** `ALL PRODUCTION TESTS PASSED`  
**Verification Date:** 2026-09-30  

---

## 1. Executive Summary & Verification Matrix

| Event / Requirement | Status | Verification Criteria & Observed Behavior |
| :--- | :---: | :--- |
| **`generate_lead`** | **PASS** | Fired **ONLY AFTER** `/api/lead` returns a genuine 200/201 durable persistence response with a real `submission_id`. Suppressed on page load, button click, validation errors, and invalid emails. Exactly one event fired per conversion. |
| **`intake_started`** | **PASS** | Fired **ONCE** when user first meaningfully interacts with the form (`focusin`, `click`, `input`, or `change`). **Zero** events fired on initial page load. |
| **`intake_step_completed`** | **PASS** | Fired sequentially upon successful forward advancement (Step 1 -> 2, Step 2 -> 3) in `contact-wizard`. Suppressed on initial load and back-navigation. |
| **`cta_click`** | **PASS** | Fired on commercial high-intent CTAs (hero buttons, service bridges, quote launch links). Excludes ordinary navigation text links. |
| **`contact_click`** | **PASS** | Fired on direct contact links (`mailto:`, `wa.me`, `tel:`). Captures contact method and section location. |
| **`PII AUDIT`** | **PASS** | **Zero sensitive parameters.** Whitelist-enforced parameters. Zero names, emails, phone numbers, notes, free-text, submission IDs, or client identifiers in GA4 payloads. |

---

## 2. Production Event Payloads (Live Captured)

### 2.1 `intake_started`
- **Trigger:** First user interaction (radio option select, text field focus, input) on an intake form.
- **Initial Page Load Count:** `0` (Verified: Does NOT fire on load)
- **Live Captured Payload (Contact Wizard):**
```json
{
  "form_id": "contact-wizard",
  "inquiry_type": "contact"
}
```
- **Live Captured Payload (Signal Intake):**
```json
{
  "form_id": "signal-branch-2",
  "inquiry_type": "signal"
}
```

---

### 2.2 `intake_step_completed`
- **Trigger:** Forward progression through multi-step intake wizard.
- **Back-Navigation Count:** `0` (Verified: Suppressed when stepping backward)
- **Live Captured Payload (Step 1 -> Step 2):**
```json
{
  "form_id": "contact-wizard",
  "step_number": 1,
  "step_name": "problem_selection",
  "inquiry_type": "contact"
}
```
- **Live Captured Payload (Step 2 -> Step 3):**
```json
{
  "form_id": "contact-wizard",
  "step_number": 2,
  "step_name": "operational_context",
  "inquiry_type": "contact"
}
```

---

### 2.3 `generate_lead` (Post-Persistence Conversion)
- **Trigger:** Fired strictly **after** `/api/lead` returns a genuine persistent 200/201 response.
- **Invalid Submission Count:** `0` (Verified: Invalid email blocked; `generate_lead` did NOT fire)
- **Live Contact Wizard Submission:**
  - **Live Durable Submission ID:** `lead_munj1uxq_040c42e4c4f2` (Verified in Supabase `public.leads`)
  - **Response Status:** `201 Created`
  - **Event Frequency:** Exactly `1`
  - **Live Captured Payload:**
```json
{
  "form_id": "contact-wizard",
  "inquiry_type": "contact",
  "service_interest": "quote-lead",
  "budget_range": "not_specified",
  "timeline": "not_specified",
  "lead_source": "/contact/"
}
```

- **Live Signal Intake Submission:**
  - **Live Durable Submission ID:** `lead_munj2bqp_1fa2e727d6a6` (Verified in Supabase `public.leads`)
  - **Response Status:** `201 Created`
  - **Event Frequency:** Exactly `1`
  - **Live Captured Payload:**
```json
{
  "form_id": "signal-branch-2",
  "inquiry_type": "signal",
  "service_interest": "diagnostic",
  "budget_range": "diagnostic",
  "timeline": "immediate",
  "lead_source": "/signal/intake/"
}
```

---

### 2.4 `cta_click`
- **Trigger:** Commercial CTA click on high-value buttons. Standard header/footer navigation text links are ignored.
- **Live Captured Payload (Hero Button):**
```json
{
  "cta_name": "TELL ME WHAT’S BROKEN",
  "cta_location": "hero",
  "destination": "/contact/"
}
```

---

### 2.5 `contact_click`
- **Trigger:** Direct contact communication link (`mailto:`, `wa.me`, `tel:`).
- **Live Captured Payload:**
```json
{
  "contact_method": "email",
  "cta_location": "audit_footer"
}
```

---

## 3. Strict PII Audit Verification

| Parameter Category | Allowed in GA4? | Enforcement Mechanism | Audit Result |
| :--- | :---: | :--- | :---: |
| `name` / Full Name | **NO** | Dropped by parameter whitelist; regex blocking | **CLEAN (0 leaked)** |
| `email` | **NO** | Dropped by parameter whitelist; regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` scrubbed | **CLEAN (0 leaked)** |
| `phone` | **NO** | Dropped by parameter whitelist; phone regex scrubbed | **CLEAN (0 leaked)** |
| `message` / Notes | **NO** | Dropped by parameter whitelist; free text never forwarded | **CLEAN (0 leaked)** |
| `submission_id` | **NO** | Internal database identifier; startsWith('lead_') filter applied | **CLEAN (0 leaked)** |
| `company` | **NO** | Dropped by parameter whitelist | **CLEAN (0 leaked)** |
| `form_id` | **YES** | Whitelisted enum string (e.g. `contact-wizard`, `signal-branch-2`) | **VERIFIED** |
| `inquiry_type` | **YES** | Whitelisted enum string (e.g. `contact`, `signal`) | **VERIFIED** |
| `service_interest` | **YES** | Whitelisted categorization string | **VERIFIED** |
| `budget_range` | **YES** | Whitelisted scope tier string | **VERIFIED** |
| `timeline` | **YES** | Whitelisted timeframe string | **VERIFIED** |
| `lead_source` | **YES** | Cleaned pathname string (max 64 chars) | **VERIFIED** |

---

## 4. Production Architecture & Integrity Guarantees

1. **Lead Backend Preservation:**
   - `api/lead.js`, `api/lead/index.js`, and `api/lead/health.js` remain **100% locked and untouched**.
   - Supabase Edge Function `lead-capture` and PostgreSQL `public.leads` table contracts remain identical.
2. **Double-Layered Deduplication:**
   - In `assets/js/analytics.js`, `recordedLeads` and timestamp rate limiting prevent duplicate emissions from race conditions, double clicks, or simultaneous fetch/handler events.
3. **No Redundant Tags:**
   - Uses the single existing Google tag (`G-MVV7WNL42L`).
   - No secondary Google tags, Google Tag Manager scripts, or duplicate `page_view` trackers introduced.
