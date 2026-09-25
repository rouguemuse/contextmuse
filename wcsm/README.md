# Contest Atlas

**Short-Form Submission, Eligibility & Deadline Control for Writers**

Contest Atlas is a standalone, local-first commercial utility created to help authors answer one essential question:

> **Can I submit this exact piece to this exact opportunity, and am I actually ready to do it?**

Contest Atlas is completely independent from Revision Atlas, Context & Muse, and GenSort. It runs locally and offline in your browser, maintaining its own dedicated IndexedDB database (`ContestAtlasDB`) with zero server transmission.

---

## 1. Primary Workflows & Features

### 📚 Piece Library & Version Control
* **Named Versions**: Maintain full version trees (`Original Draft` → `Contest Cut — 2,000 Words` → `Anonymous Polish`) rather than generic draft numbers.
* **Lineage Tracking**: Record parent-child version origins (`Created from: Full Version`).
* **Contest Cuts**: Duplicate working drafts into target-tailored cuts without overwriting the master text.
* **Write-Protected History**: Versions referenced in completed submissions are protected from accidental modifications.

### 🎯 Opportunity Records & Structured Eligibility Rules
* **Exact Deadlines & Timezone Safety**: Store exact date, time, and IANA timezone (e.g. `America/New_York`), displaying both opportunity deadline time and your local system time side-by-side.
* **Structured Author & Piece Rules**: Min/Max word bounds, publication requirements (unpublished only vs reprints), blind judging requirements, simultaneous submission policies, format requirements, and fee/prize details.
* **Guidelines Extraction Assistant**: Paste raw contest guidelines to parse suggested checklist items with explicit writer-verification prompts.

### ⚡ Package & Eligibility Check Engine
* Evaluates a selected Piece Version against target Opportunity guidelines in real time.
* Outputs clear diagnostic states:
  * **Ready**: All evaluated rules and package requirements are satisfied.
  * **Needs Attention**: Highlights actionable discrepancies (e.g. over word count, missing required bio, author name detected in blind submission).
  * **Not Eligible**: Critical policy violations (e.g. previously published piece for an unpublished-only contest).
  * **Needs Verification**: Unverified rules or missing author profile data.

### 🔍 Anonymity Inspector
* Scans manuscripts for author names, pen names, emails, phone numbers, and bylines against configured Author Profile settings.
* Qualified Compliance Notice: *"No obvious author-identifying text detected in prepared manuscript. Verify exported file before submitting."*

### 📬 Submission Snapshots & History
* **Immutable Snapshot**: When marking an entry as submitted, Contest Atlas freezes an exact snapshot of the manuscript content, bio, cover note, and opportunity rules at that exact moment (`Requirements Snapshot — captured [Date]`).
* **Submission Events**: Track outcomes over time (`Submitted`, `Longlisted`, `Shortlisted`, `Finalist`, `Winner`, `Accepted`, `Rejected`, `Withdrawn`) without mutating historical records.

### ⚠️ Simultaneous Submissions & Withdrawal Assistant
* Detects active submissions across all opportunities for a piece.
* Alerts the writer if a submission is attempted to a non-simultaneous opportunity while another submission is active.
* Automatically triggers an **Acceptance Advisory** when a piece wins or is accepted, flagging other active submissions requiring withdrawal review.

### ⏳ Calm Deadline Dashboard & Spend Tracking
* Categorized views: *Due Soon (<7 days)*, *This Month*, *Future Deadlines*, *Rolling Opportunities*, and *Awaiting Results*.
* Monthly submission spending tracker to monitor entry fees.

---

## 2. Privacy & Local Storage

* **100% Local-First**: Contest Atlas stores all application data in your browser via IndexedDB (`ContestAtlasDB`).
* **No Remote Telemetry**: No manuscript text, notes, or submission details are ever sent to remote services.
* **Browser Storage Notice**: Clearing your browser cache or site data will remove IndexedDB records. Regular JSON backups are strongly recommended.

---

## 3. Data Model & Stores (`ContestAtlasDB`)

Contest Atlas uses 15 distinct stores:

| Store Name | Description |
|---|---|
| `pieces` | Master piece metadata (title, type, genre, publication status, rights) |
| `piece_versions` | Named version content, word counts, parent lineage, locked status |
| `opportunities` | Contest/market details, exact deadlines, timezones, fees, prizes |
| `opportunity_rule_versions` | Versioned opportunity rules and requirements |
| `submission_plans` | Mutable working preparation states |
| `submissions` | Historical captured submission records |
| `submission_events` | Outcome timeline (submitted, shortlisted, accepted, winner, etc.) |
| `submission_snapshots` | Frozen write-protected packages (manuscript + rules snapshot) |
| `bios` | Modular author biographies |
| `bio_versions` | Versioned bio lengths (50-word, 100-word, etc.) |
| `cover_notes` | Modular cover letter templates |
| `cover_note_versions` | Versioned cover letter texts |
| `author_profiles` | Local author identity for anonymity scanner |
| `settings` | UI preferences (theme, currency) |
| `backup_snapshots` | Pre-restore safety snapshots |

---

## 4. Backup & Restore System

* **JSON Export**: Complete database export including all pieces, versions, opportunities, snapshots, bios, and settings.
* **Safety Restore Protocol**:
  1. Validates JSON structure, product name (`Contest Atlas`), and schema version.
  2. Generates an automatic pre-restore safety snapshot of current data before overwriting.
  3. Validates referential integrity and verifies record counts.

---

## 5. Scope Guardrails & V1 Limitations

Contest Atlas is a writer-controlled compliance utility. In accordance with its privacy and reliability architecture, V1 intentionally excludes:
* Web scraping or automated contest discovery crawlers.
* Automated login to third-party portals (e.g. Submittable) or auto-submission.
* Automated payment processing or email dispatching.
* AI text generation or revision rewriting.
* Cloud synchronization or user account management.

---

## 6. Visual Design System

* **Branding**: 4-square family mark utilizing the Contest Atlas palette:
  * **Deep Berry** (`#7b1e42`) — Primary identity & actions
  * **Burnt Coral** (`#d95c43`) — Warnings & secondary accent
  * **Muted Violet** (`#5c4d7d`) — Informational & category accent
  * **Warm Saffron** (`#d9822b`) — Deadlines & high-attention accent
* **Themes**: Light, Dark, and System modes with offline system typography (Charter, Iowan Old Style, Georgia, Palatino, Courier Prime, Segoe UI).

---

© 2026 Contest Atlas. All rights reserved.
