# Context & Muse · Customer Journey & Funnel Architecture Audit

**Status:** Completed  
**Date:** September 29, 2026  
**Auditor:** Antigravity (Phase 3 Optimization)  
**Standard:** Problem-First Conversion, Single Lead Intake, Zero Disconnected Funnels

---

## 1. Executive Summary & Core Principle

Context & Muse is an applied systems studio selling **problem-solving and operational clarity**, not a disconnected cafeteria menu of technical acronyms. 

A qualified visitor must seamlessly traverse this five-stage journey:
```
I HAVE A PROBLEM
  → THIS PERSON UNDERSTANDS THE PROBLEM
    → SHE HAS BUILT THINGS LIKE THIS
      → THERE IS A CLEAR WAY TO START
        → I SUBMIT A QUALIFIED INQUIRY
```

Currently, the site presents multiple competing lead forms, overlapping portfolio collections (`/work/`, `/proof-of-work/`, `/systems/client-builds/`), fractured CTA terminology, and a generic contact form that forces visitors to self-classify into technical product buckets before they can ask for help.

This document audits the current paths and specifies the unified **Phase 3 Funnel Architecture**.

---

## 2. Current Customer Journey Audit (Before Phase 3)

### Path 01: Homepage (`/`)
* **Entry:** Direct, organic search, or referral to `https://www.contextmuse.com/`.
* **Current Hero:** "Systems built around the way your business actually works."
  * Hero Left CTAs: "View Client Builds ↓" (`#selected-work`), "Explore Service Tiers →" (`/services/`).
  * Hero Right Card: "Free Website + System Check" embedded form (`/website-system-check/`).
* **Next Action:** Visitor either runs the free check, scrolls down to Selected Work, or explores services.
* **Middle Section (Proof):** 4 case study previews (Lone Wolf, INNcontrol, Website Audit System, EDR Party Rentals) with individual deep-dive links.
* **Middle Section (Pricing Ladder):** 3 cards:
  * Business System Diagnostic ($395) → CTA: `Start the $395 Diagnostic →` (`/contact/?service=diagnostic`)
  * Quote + Lead System (From $2,500) → CTA: `Discuss a Quote & Lead System →` (`/services/quote-lead-systems/`) *(Routes to another marketing subpage instead of intake!)*
  * Custom Operations System (From $6,500) → CTA: `Discuss an Operations System →` (`/custom/?service=custom-system#intake`) *(Routes to a completely separate duplicate form on `/custom/`!)*
* **Bottom Section (Two-Path Intake):**
  * Path A: "Run Free Website Check →" (`/website-system-check/`)
  * Path B: Embedded raw form (`hp-inquiry-form`) submitting to Formspree, showing an inline `#hp-inquiry-success` `<div>`.
* **Friction & Flaws:**
  * **Lead Capture Fragmentation:** 3 different conversion endpoints from the same homepage (`/website-system-check/`, `/contact/`, and on-page Formspree).
  * **Inconsistent Ladder Destination:** One card goes to `/contact/`, another to `/services/quote-lead-systems/`, another to `/custom/#intake`.
  * **Premature Free Tool Promotion:** Promotes the automated tool in the hero before the visitor even understands the core service.

---

### Path 02: Ways to Work Together (`/services/`)
* **Entry:** Navigation "Services → Ways to Work Together" or homepage hero link.
* **Hero CTA:** "Explore Pricing & Offers ↓" (`#pricing-ladder`).
* **Middle Section:** 
  * Free Check Callout Banner (`/website-system-check/`).
  * 3 Offer Cards ($395 Diagnostic, From $2,500 Quote+Lead, From $6,500 Custom System).
  * CTAs:
    * Diagnostic: `Start the $395 Diagnostic →` (`/contact/?service=diagnostic`)
    * Quote + Lead: `Discuss a Quote & Lead System →` (`/services/quote-lead-systems/`)
    * Custom System: `Discuss a Custom System →` (`/contact/?service=custom-system`)
  * Comparison Table & Quarterly Care Plans ($375 / $600).
* **Next Page:** Routes to `/contact/` or `/services/quote-lead-systems/`.
* **Friction & Flaws:**
  * Inconsistent CTA routing: Quote+Lead sends to a subpage while Diagnostic and Custom System send directly to contact.
  * No immediate problem-first intake on this page.

---

### Path 03: Custom Systems (`/custom/`)
* **Entry:** Navigation "Services → Websites & Systems" or `/custom/` direct link.
* **Content:** Detailed explanation of custom business systems with interactive tabbed consoles (Lone Wolf, INNcontrol, EDR).
* **CTA:** Bottom section `#intake` contains a full duplicate Formspree form (`custom-intake-form`).
* **Success State:** Inline `<div>` `#intake-success` replaces form.
* **Friction & Flaws:**
  * **Form Duplication:** Maintains a full parallel form identical to `/contact/`, splitting tracking and maintenance.
  * Nav dropdown has legacy query strings (`/custom/?service=audit#intake`, `/custom/?service=funnel-sprint#intake`) pointing to deprecated concepts.

---

### Path 04: Websites & Systems (`/systems/`)
* **Entry:** Navigation "Services → Custom Operations Systems" or footer links.
* **Content:** Explains websites paired with operational machinery, listing 6 capabilities and a 3-tier pricing ladder.
* **CTAs:**
  * `Start the $395 Diagnostic →` (`/contact/?service=diagnostic`)
  * `Discuss a Quote & Lead System →` (`/services/quote-lead-systems/`)
  * `Discuss a Custom System →` (`/custom/?service=custom-system#intake`)
* **Friction & Flaws:**
  * Competes directly with `/services/` and `/custom/`. Three pages explain the same offerings with slightly different layouts.
  * JSON-LD schema contained outdated starter website packages ($500 / $1,500).

---

### Path 05: Portfolio Overlap (`/work/` vs `/proof-of-work/` vs `/systems/client-builds/`)
* **Current State:**
  * `/work/` (Case Study Library): Highlights 5 case studies (Revision Atlas, Website Audit System, Client Opportunity Engine, Contest Atlas, Lone Wolf Dumpsters).
  * `/proof-of-work/` (Proof of Work): Categorized into 3 pillars (Digital Products, Business Workflows, Web Experience & Conversion).
  * `/systems/client-builds/` (Client Builds): Detailed technical breakdowns of Lone Wolf Dumpsters, INNcontrol Coils, and EDR Party Rentals.
* **Friction & Flaws:**
  * **Visitor Confusion:** A visitor wanting to evaluate credibility encounters three different links in the navbar ("Client Builds", "Proof of Work", "Case Study Library"), diluting authority and creating decision paralysis.
  * Nav bar in `partials/nav.html` omitted `/work/` entirely, while `index.html` nav had `/work/`.

---

### Path 06: Restaurant Systems (`/restaurant-systems/`)
* **Entry:** Navigation "Services → Restaurant Systems".
* **Content:** Explains operational hospitality consulting (menu engineering, KDS throughput, POS configuration).
* **CTA:** "Start with a Signal Review" → `/signal/` ("View Signal Pricing & Rules →").
* **Friction & Flaws:**
  * Dead end for direct consulting inquiries. It solely pushes visitors to the SaaS/product page `/signal/`, offering no direct consultation intake.

---

### Path 07: Free Website + System Check (`/website-system-check/`)
* **Entry:** Hero cards on homepage/services, or direct URL.
* **Flow:** User enters website URL → client-side deterministic analysis runs → reports messaging clarity, friction points, and intake leaks.
* **Bottom CTAs:**
  * `Schedule $395 Business System Diagnostic` (`/contact/?service=diagnostic`)
  * `Explore Quote + Lead Build` (`/services/quote-lead-systems/`)
  * `Ask a Specific Question` (`/contact/`)
* **Friction & Flaws:**
  * CTA label says "Schedule" instead of standardized "Start the $395 Diagnostic".
  * Quote+Lead links to marketing subpage instead of qualifying intake.

---

### Path 08: Contact & Intake (`/contact/`)
* **Entry:** Primary "Start a Project" nav button across all 44 pages.
* **Content:**
  * Left: Process milestones, email, WhatsApp.
  * Right: Static HTML form (`contact-intake-form`) asking:
    * "What are you looking for?" (dropdown: diagnostic, quote-lead, custom-system, care-essential, care-growth, institutional-pilot, custom)
    * Name, Email, Website, Budget range, Message.
* **Submission:** Formspree AJAX fetch.
* **Success State:** Inline `<div>` replacing the form with generic text.
* **Friction & Flaws:**
  * **Forces Premature Technical Classification:** Visitors are asked to pick a package before explaining their problem.
  * **Zero Problem-Adaptive Scoping:** A founder whose website isn't converting sees the exact same fields as an operator with an overtime crisis in their kitchen.
  * **No Dedicated Confirmation Experience:** Missing post-submission reassurance, clear next steps, and contextual verified project proof.

---

## 3. Journey Friction Points & Inconsistencies Table

| Issue Category | Current Reality | Impact | Required Remediation |
| :--- | :--- | :--- | :--- |
| **Multiple Form Sprawl** | Homepage (`#hp-inquiry-form`), `/custom/` (`#custom-intake-form`), and `/contact/` (`#contact-intake-form`) all host separate forms. | Fractured submissions, incomplete telemetry, maintenance overhead. | **Single Primary Conversion Engine:** All secondary CTAs route into `/contact/` with intelligent preselection. |
| **Unpredictable CTAs** | Pricing cards link to `/services/quote-lead-systems/`, `/custom/#intake`, or `/contact/?service=diagnostic`. | Jarring UX; visitors expect an intake form but land on another sales pitch. | **Unified Route:** All commercial tier CTAs route to `/contact/?service=...`. |
| **Portfolio Duplication** | Three competing portfolio pages: `/work/`, `/proof-of-work/`, and `/systems/client-builds/`. | Visitor cognitive overload; unclear where canonical case studies live. | **Consolidate Navigation Hierarchy:** Establish `/work/` as primary public index; position `/systems/client-builds/` as deep-dive engineering ledgers; standardize nav dropdowns. |
| **Premature Classification** | Intake starts with "What are you looking for?" listing technical system names. | High friction for visitors who only know their business symptom. | **Problem-First Intake:** Start with "What do you need help with?" and adapt questions conditionally. |
| **Post-Submission Vacuum** | Submissions hide the form and show a brief inline text string. | Visitor uncertainty: Did it send? What happens next? Can I see relevant work while waiting? | **Dedicated Success Page (`/contact/success/`):** Reassures receipt, details exact review process, and surfaces verified case studies. |

---

## 4. Phase 3 Target Funnel Architecture

### 4.1 The Core Conversion Funnel Flow
1. **Entry Page:** Visitor lands on Homepage, Services, Work, or System Check.
2. **Intent Branching:**
   - **Has a Clear Problem:** Clicks **"Tell Me What's Broken"** → smoothly scrolls or routes to the Unified Intake System.
   - **Needs Evidence First:** Clicks **"See the Work"** → explores `/work/` case studies, then clicks **"Tell Me About Your Project"** → routes to Intake.
   - **Wants Low-Risk Audit:** Clicks **"Start the $395 Diagnostic"** → routes to Intake pre-set to Diagnostic mode.
3. **Unified Intelligent Intake Engine (`/contact/`):**
   - **Step 1: Problem Selection:** "What do you need help with?" (7 intuitive problem options).
   - **Step 2: Adaptive Questions:** Dynamic fields matching the specific problem type (URL, workflow breakdown, manual tools, restaurant POS).
   - **Step 3: Universal Contact & Scoping:** Name, Email, Business, Budget range.
4. **Submission:** AJAX fetch to Formspree + GA4 conversion event dispatch.
5. **Success Experience (`/contact/success/`):** Dedicated confirmation page providing clear review timeline, direct expectations, and 3 verified project links.

---

### 4.2 Controlled CTA Vocabulary Standards

| Context | Approved Primary Copy | Destination URL | Purpose |
| :--- | :--- | :--- | :--- |
| **Universal Navigation CTA** | **Start a Project** | `/contact/` | Universal, prominent header action on every page. |
| **Homepage Primary Hero** | **Tell Me What's Broken** | `#contact` or `/contact/` | Direct, empathetic invitation to share business friction. |
| **Homepage Secondary Hero** | **See the Work** | `#selected-work` or `/work/` | Immediate proof access without marketing fluff. |
| **$395 Diagnostic Offer** | **Start the $395 Diagnostic** | `/contact/?service=diagnostic` | Fixed-scope entry point for ambiguous or complex problems. |
| **Quote + Lead System Offer** | **Discuss a Quote & Lead System** | `/contact/?service=quote-lead` | Direct intake routing for quoting and territory lead capture. |
| **Custom Operations System** | **Discuss an Operations System** | `/contact/?service=custom-system` | Direct intake routing for internal tools and workflow automation. |
| **Case Study / Detail Page** | **Tell Me About Your Project** | `/contact/?ref={case_study}` | Contextual intake transition from deep proof. |

---

### 4.3 Intelligent Adaptive Intake Specification (`/contact/`)

#### Step 1: Problem Recognition ("What do you need help with?")
* `website-conversion`: "My website exists, but it isn't generating qualified leads or quotes."
* `website-build`: "I need a new commercial website built or completely rebuilt."
* `quote-lead`: "I need an upfront quoting, pricing, or territory lead routing system."
* `operations-tool`: "My team is doing work manually in spreadsheets that software should handle."
* `restaurant-data`: "I need operational or POS data analysis for a restaurant/hospitality group."
* `diagnostic`: "I need an expert diagnostic review to find what's broken before rebuilding ($395)."
* `unknown`: "I'm not sure what to call it — I just know something isn't working."

#### Step 2: Adaptive Diagnostic Questions (Conditional on Step 1)
* **Website Paths (`website-conversion`, `website-build`):**
  * Current Website URL (if any).
  * What is the single biggest point of friction for your visitors right now?
  * What action should a qualified customer take on your site?
* **Quote / Lead System Path (`quote-lead`):**
  * How do quote inquiries currently arrive (phone calls, email, text, open text box)?
  * How do you currently calculate pricing or verify service areas?
  * Where does the process break down or waste staff time?
* **Operations System Path (`operations-tool`):**
  * What specific task is your team manually repeating?
  * What tools or spreadsheets are currently patched together?
  * Where does critical business information currently get lost?
* **Restaurant Path (`restaurant-data`):**
  * What POS/KDS platform do you use (Toast, Square, Clover, Aloha)?
  * Number of operating locations.
  * Primary operational bottleneck (overtime, throughput, food waste, delivery margins).
* **Diagnostic Path (`diagnostic`):**
  * What feels broken or inefficient in your business right now?
  * What have you already tried to fix it?
* **Unknown / General Path (`unknown`):**
  * Describe the problem in plain language — what happens vs. what you wish happened?

#### Step 3: Universal Contact & Scoping Fields
* **Name \*** (Required)
* **Email \*** (Required)
* **Company / Business Name** (Optional/Encouraged)
* **Current Website URL** (Pre-populated if entered in Step 2)
* **Approximate Investment Range** (Optional dropdown):
  * `under_2500`: Under $2,500 (Diagnostic / Assessment range)
  * `2500_5000`: $2,500 – $5,000 (Quote + Lead Systems)
  * `5000_10000`: $5,000 – $10,000 (Multi-Market & Custom Operations Systems)
  * `10000_plus`: $10,000+ (Complex Operational Infrastructure)
  * `not_sure`: Not sure yet — advise me based on scope
* **Submission Trigger:** High-contrast submit button labeled dynamically based on path.

---

### 4.4 Dedicated Success Experience (`/contact/success/`)

Upon successful submission:
1. **Immediate Reassurance:**
   * Headline: *"Inquiry Received. Jayme is reviewing your details."*
   * Copy: *"You do not need to submit again. Jayme personally reviews every inquiry and examines your website and operational context before responding."*
2. **Transparent Timeline & Expectations:**
   * Step 1: Direct architectural review of your submission (no account managers or automated bot replies).
   * Step 2: You receive a clear, plain-language assessment within 1 business day outlining recommended scope or whether a $395 Diagnostic is the right first step.
   * Step 3: No high-pressure discovery calls unless you explicitly request a call.
3. **Curated Contextual Proof (Keep the Visitor Engaged):**
   * Link to Lone Wolf Dumpsters (Multi-market quote & routing architecture).
   * Link to INNcontrol Coils (B2B commercial service platform).
   * Link to Website Audit System (DOM evidence & diagnostic methodology).

---

### 4.5 Navigation Simplification & SEO Equity Preservation

* **Nav Dropdown "Work":**
  * `Case Study Library` (`/work/`) — Primary public index
  * `Lone Wolf Dumpsters` (`/work/lone-wolf-dumpsters/`)
  * `INNcontrol Coils` (`/systems/client-builds/#inncontrol`)
  * `Website Audit System` (`/work/website-audit-system/`)
  * `EDR Party Rentals` (`/case-studies/edr-party-rentals/`)
  * `Engineering Deep-Dives (Client Builds)` (`/systems/client-builds/`)
* **Preserve Indexed Routes:**
  * Keep `/proof-of-work/` active with clean canonical pointing to itself or `/work/` so search engines and existing links do not break.
  * Consolidate `/systems/client-builds/` into specialized engineering ledgers.
* **Standardize Dropdowns Across All Pages:**
  * Replace stale query params (`/custom/?service=audit#intake` and `/custom/?service=funnel-sprint#intake`) with `/services/quote-lead-systems/`, `/services/`, `/systems/`, and `/website-system-check/`.

---

## 5. Analytics & Conversion Event Telemetry Plan

Leveraging the existing Google tag (`G-MVV7WNL42L`), standard GA4 custom events will be dispatched with zero PII:

| Event Name | Trigger Condition | Parameters (No PII) |
| :--- | :--- | :--- |
| `primary_cta_click` | Clicking "Tell Me What's Broken" or primary intake button | `cta_location`, `button_text` |
| `work_view` | Navigating to `/work/`, case studies, or proof sections | `page_path`, `case_study_id` |
| `diagnostic_click` | Clicking "Start the $395 Diagnostic" | `source_page` |
| `intake_started` | Focusing on the first question of the intake form | `form_id`, `entry_point` |
| `intake_type_selected` | Selecting a problem category in Step 1 | `problem_type` (e.g., `quote_lead`, `website_conversion`) |
| `intake_step_completed` | Transitioning between form steps | `completed_step`, `problem_type` |
| `intake_submitted` | Successful Formspree API submission | `problem_type`, `has_budget_selected` |

> [!IMPORTANT]
> **Strict Privacy Rule:** Under no circumstances will names, email addresses, phone numbers, domain names with personal info, or free-text descriptions be sent in analytics payloads.

---

This architecture is approved for implementation in Phase 3.
