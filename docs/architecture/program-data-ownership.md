# Program Data Ownership & Safety Guarantees

**Version:** 1.0 (Phase G-0.1)
**Status:** Active
**Last updated:** 2026-07-29

## Purpose

This document defines **who owns Program data**, **where it lives**, and the
**safety guarantees** that protect it. It covers:
- Local-first data ownership (the user owns their data)
- Forward-schema guard (never silently downgrade)
- Sync safety (never corrupt Diary data, never lose completed lessons)
- Export completeness (users can always take all their data)
- Deletion finality (users can permanently delete everything)

---

## Data Ownership Model

### Principle: User is the owner
Sleep Diary follows a **user-owned, local-first** data model:

1. **The canonical copy is on the user's device.** The server is a mirror.
2. **The user can export all their data** at any time as structured JSON.
3. **The user can delete all their data** at any time, permanently.
4. **Sync is a convenience, not a requirement.** The app works fully offline.

### Program data specifically
Program progress data is **user-owned personal data**:
- Completed lessons
- Skipped lessons
- Accepted / dismissed weekly plans
- Milestones earned
- Program status (active, paused, completed)
- Start / completion timestamps

This data is **never sold, shared, or used for advertising**. It exists solely
to help the user track their progress through the CBT-I program.

---

## Storage Locations

| Layer | Storage | Key / Location | Format |
|-------|---------|----------------|--------|
| **Local (browser)** | `localStorage` | `somna:program-progress:v1` | JSON (ProgramProgress) |
| **Local (legacy)** | `localStorage` | `cbtiProgramProgress` | JSON (legacy `{ completedLessons }`) |
| **Local (plans)** | `localStorage` | `somna:program-plans:v1` | JSON `{ schemaVersion, plans: [...] }` |
| **Server (sync)** | Cloudflare D1 | `program_progress` table | Relational row with JSON array columns |
| **Sync payload** | HTTPS request/response | `programProgress` field | `SyncProgramProgress` / `CanonicalProgramProgress` |
| **Export** | User-downloaded JSON | `programProgress` field | Full canonical structure |

### Migration state
Legacy data (`cbtiProgramProgress` key) is **read-only**:
- Migrated to canonical format on first load
- Legacy key left in place as safety backup
- Never written to by production code
- No production code imports `program-progress.ts`

---

## Safety Guarantees

### 1. Forward-Schema Guard

**Guarantee**: An older version of the app will never silently overwrite or
downgrade data created by a newer version.

**How it works:**
- Every `ProgramProgress` object has a `schemaVersion` field
- `SUPPORTED_PROGRAM_SCHEMA_VERSION` is the highest version this build understands
- On load: if stored version > supported, return `UnsupportedProgramSchema`:
  - `raw`: the original stored data (preserved exactly)
  - `fallback`: safe initial progress (for display only)
  - `kind: "unsupported_schema"`: discriminated union tag
- On save: if stored version > supported, **write is blocked** (returns `false`)
- On export: raw unsupported data is included so users never lose anything

**What this prevents:**
- User opens app v2.5 (schema v2), completes lessons, data is saved as v2
- User opens app v2.4 (schema v1) on another device/browser
- Without the guard: v2.4 would overwrite v2 data with v1 format → data loss
- With the guard: v2.4 detects v2 data, leaves it untouched, shows fallback

**Exceptions:**
- Explicit user deletion (clear data, account delete) bypasses the guard
  because it's an intentional user action, not a silent downgrade

### 2. Sync Never Loses Completed Lessons

**Guarantee**: Completing a lesson is additive. Sync will never "un-complete"
a lesson that was completed on either device.

**How it works:**
- Merge strategy for `completedLessonIds` is **set union**
- If client has `["lesson-a", "lesson-b"]` and server has `["lesson-b", "lesson-c"]`,
  merged result is `["lesson-a", "lesson-b", "lesson-c"]`
- Same union strategy for `skippedLessonIds`, `acceptedPlanIds`,
  `dismissedRecommendationIds`, and `milestones`

**Status resolution:**
- Status follows a **most-advanced wins** rule:
  - `not_started` < `active` / `paused` < `completed`
  - If either side is `completed`, the merged result is `completed`
  - If either side is `active` and neither is `completed`, result is `active`

### 3. Sync Never Corrupts Diary Data

**Guarantee**: Program progress sync errors never affect sleep records or
reflections. The Diary is always canonical and intact.

**How it works:**
- Server-side `processSync()` wraps program progress in a try/catch
- If program progress sync fails:
  - Error is logged
  - Sleep records and reflections still sync normally
  - Response includes whatever program progress data the server has
- Client-side errors are similarly isolated: one entity failing doesn't
  prevent other entities from syncing

### 4. Export Completeness

**Guarantee**: The account export includes ALL program data the user has,
even if the current build doesn't fully understand it.

**What's exported:**
- `programProgress`: array of progress records (from `program_progress` table)
  - All fields: id, program_id, status, lesson arrays, milestones, timestamps
- On local export: if stored schema is newer than supported, both
  `unsupportedSchemaRaw` and `unsupportedSchemaVersion` are included
- User downloads the file — they own it, they can back it up, import it elsewhere

### 5. Deletion Finality

**Guarantee**: When a user deletes their account or clears their program data,
it's gone.

**What gets deleted:**
- **Local delete**: Both canonical and legacy localStorage keys are removed
- **Account delete (server)**: `program_progress` rows for the user are deleted
  - Along with sleep records, reflections, reminder settings, sync log
  - User account is soft-deleted (`deleted_at` set, personal fields cleared)
- **Cascading**: `program_progress.user_id` has `ON DELETE CASCADE` on the users
  table reference, so deleting a user cleans up program progress automatically

### 6. No Partial Writes

**Guarantee**: Validation failures never leave partially-saved data.

**How it works:**
- `saveWeeklyPlan()` validates the full plan before writing
- If validation fails, `WeeklyPlanValidationError` is thrown
- Storage is not modified — the previous valid plan remains intact
- `saveProgramProgress()` follows the same principle: atomic write of the
  entire progress object

---

## Privacy Considerations

### What program data contains
- Lesson completion status (which lessons the user has done)
- Program engagement patterns (start date, pace, pauses)
- Weekly plan preferences (which lessons they chose to focus on)

### What program data does NOT contain
- Sleep data (stored separately in sleep records)
- Reflection content (stored separately in reflections)
- Personal identifiable information (no name, email in program data)
- Health metrics (sleep quality, duration — those are in sleep records)

### Server access
- Program progress is stored encrypted-at-rest in Cloudflare D1
- Access requires authenticated session (user ID derived from session cookie)
- Server logs never contain lesson content or personal data
- The Somna team does not access user program data for any purpose
  except when explicitly requested for support (and even then, only with
  user consent and only to resolve the specific issue)

---

## Validation Enforcement

Weekly plan validation is not just a suggestion — it's enforced on every save.
This prevents corrupted or malformed plan data from entering the system.

**Enforced validations:**
- Valid program ID (matches definition)
- Valid source enum (`baseline`, `weekly_focus`, `manual_selection`)
- Valid status enum (`proposed`, `accepted`, `dismissed`, `completed`)
- ISO date format for week start/end
- Date order (start ≤ end)
- No duplicate lesson IDs
- All lesson IDs reference real lessons
- Accepted lessons are subset of recommended (unless manual selection)

**Error handling:**
- `WeeklyPlanValidationError` with typed `issues: string[]` array
- Callers can display issues to users programmatically
- Storage is not modified on failure (existing valid state preserved)

---

## Incident Response

If program data integrity is ever compromised:

1. **Forward-schema guard buys us time**: if an unknown schema is detected,
   the app stops writing and preserves the raw data for recovery
2. **Export is always available**: users can download their data even if
   the app can't fully interpret it
3. **Sync is non-destructive**: union-merge means a bug on one device
   can't erase completions from another
4. **Legacy key as backup**: the `cbtiProgramProgress` legacy key is never
   written to, so it serves as a snapshot of pre-migration state

---

## Compliance Mapping

| Requirement | How we meet it |
|-------------|----------------|
| GDPR "right to data portability" | Account export includes all program data as structured JSON |
| GDPR "right to erasure" | Account delete removes all program data (server + triggers local clear) |
| Data minimization | Only progress state is stored — no content, no personal data in program tables |
| Integrity | Validation enforcement + forward-schema guard + atomic writes |
| Availability | Local-first design — works offline, server is a mirror |
