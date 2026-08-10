# Phase G-0 Acceptance Audit

## Platform Consolidation, Locale Unification, Type Boundaries & Program Domain Foundation

**Audit Date:** 2026-07-29
**Auditor:** Automated architecture & code audit
**Baseline Document:** `docs/audit/TYPESCRIPT_UNIQUE_ERROR_BASELINE.md`
**Completion Report Reference:** `docs/implementation/PHASE_G_0_COMPLETION_REPORT.md`

---

## 1. Executive Summary

Phase G-0 establishes the foundational platform layer for Phase G's CBT-I Program Integration work. The phase delivers a unified locale registry, a typed program domain model with an event-driven state machine, SSR-safe persistence, weekly plan contracts, boundary adapters, and sync contract definitions.

### Verdict (preliminary, see §13)

**⚠️ PHASE G-0 ACCEPTED WITH LOW-RISK DEBT**

The core deliverables are present, well-tested, and architecturally sound. The locale unification is production-integrated. The program domain is isolated, typed, and has 165 unit tests that all pass. The build succeeds.

However, there is low-risk technical debt and one misstatement in the completion report that does not block Phase G but should be tracked:

| Severity | Count | Description                                                       |
| -------- | ----- | ----------------------------------------------------------------- |
| Critical | 0     | —                                                                 |
| High     | 0     | —                                                                 |
| Medium   | 2     | Sync contracts not wired; `program-progress.ts` not delegating    |
| Low      | 7     | Test coverage gaps, minor inconsistencies, forward-schema missing |

### Build & Validation Status (correct exit-code methodology)

| Command                    | Exit Code | Result  | Notes                                      |
| -------------------------- | --------- | ------- | ------------------------------------------ |
| `npm test`                 | **0**     | ✅ PASS | 27 files, 397 tests, 0 failures            |
| `npm run typecheck`        | **2**     | ❌ FAIL | 78 total errors; **0 in new G-0 files**    |
| `npm run typecheck:app`    | **2**     | ❌ FAIL | Pre-existing errors (sync, server, auth)   |
| `npm run typecheck:worker` | **2**     | ❌ FAIL | Pre-existing errors (same as app)          |
| `npm run typecheck:tests`  | **2**     | ❌ FAIL | Reminder type mismatches in test files     |
| `npm run typecheck:all`    | **2**     | ❌ FAIL | Combined all of the above                  |
| `npm run lint`             | **1**     | ❌ FAIL | 13,112 errors; 13,080 are CRLF line-ending |
| `npm run build`            | **0**     | ✅ PASS | Builds in ~4.0s; client + server           |

**Important:** TypeScript errors are all pre-existing or expected consequences of the `Lang` type expansion (from 4→7 locales). Zero errors originate in new G-0 files. This matches the baseline document.

---

## 2. Locale Architecture (from prior discovery, re-verified)

### Status: ✅ ACCEPTED

**Authoritative source:** `src/lib/locale-registry.ts`

### Verified Findings

| Item                                                       | Status | Evidence                                                                              |
| ---------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------- |
| `SupportedLocale` is single source of truth                | ✅     | Imported by i18n.tsx, lang-detect.ts, content-types.ts, program/*                     |
| 7 supported locales (en, es, pt, pl, de, zh, ja)           | ✅     | `SUPPORTED_LOCALES` in [locale-registry.ts:35-43](src/lib/locale-registry.ts#L35-L43) |
| Tiered system (4 active + 1 partial + 2 reserved)          | ✅     | `ACTIVE_LOCALES`, `PARTIAL_LOCALES`, `RESERVED_LOCALES`                               |
| `normalizePersistedLocale()` handles pt-BR → pt            | ✅     | Tested in locale-registry.test.ts (52 tests total)                                    |
| `LEGACY_LOCALE_MAP` with 7 entries                         | ✅     | en-US, es-ES, pt-BR, pl-PL, de-DE, zh-CN, ja-JP                                       |
| `resolveTranslation()` 4-tier fallback                     | ✅     | requested → feature → English → `safeKeyFallback()`                                   |
| `safeKeyFallback()` converts dotted keys to human-readable | ✅     | Never shows raw dotted keys to users                                                  |
| Type guards (isSupportedLocale, isActiveLocale, etc.)      | ✅     | All type predicates, TS narrows automatically                                         |
| UI locale vs ContentLocale separation                      | ✅     | `uiLocaleToContentLocale()` in content-types.ts                                       |
| SSR-safe locale operations                                 | ✅     | `getBrowserLang()` returns "en" on server; `resolveTranslation()` is pure             |

### Integration Points

- **`src/lib/i18n.tsx`** — Uses `SupportedLocale`, `t()` uses `resolveTranslation()`
- **`src/lib/lang-detect.ts`** — `ACTIVE_LANGS = ACTIVE_LOCALES`, detection uses `normalizePersistedLocale()`
- **`src/content/content-types.ts`** — `ContentLocale` type, `uiLocaleToContentLocale()` mapping

### Test Coverage: 52 tests in `locale-registry.test.ts`

Categories: locale lists (6), registry definitions (10), type guards (10), pt/pt-BR normalization (6), all legacy mappings (5), edge cases (8), convenience lookups (9), safeKeyFallback (5), resolveTranslation (8), LEGACY_LOCALE_MAP (5).

---

## 3. Program Service & State Machine

**Files:** `src/lib/program/types.ts`, `src/lib/program/service.ts`, `src/lib/program/definition.ts`

### 3.1 States and Transitions

| State         | Valid Transitions To  |
| ------------- | --------------------- |
| `not_started` | `active`              |
| `active`      | `paused`, `completed` |
| `paused`      | `active`, `completed` |
| `completed`   | `active` (reopen)     |

All transitions are guarded by `isValidStatusTransition()` from [types.ts:286-291](src/lib/program/types.ts#L286-L291).

**Verified:** 8 of 12 possible transitions tested in `service.test.ts`.

### 3.2 Invalid Transition Handling

All status-changing event handlers in `service.ts` use this pattern:

```ts
if (!isValidStatusTransition(progress.status, "<target>")) {
  return progress; // no-op
}
```

**Finding:** Invalid events are complete no-ops — the original object is returned unchanged. `updatedAt` is NOT modified on no-op returns. There is no dev-mode warning (the JSDoc mentions one but it is not implemented). **Low-risk: design choice; does not affect correctness.**

### 3.3 Idempotency

**All 11 event handlers are idempotent.** Verified patterns:

- **Status transitions:** Guarded by `isValidStatusTransition` — same state → no-op
- **Lesson completion:** `if (progress.completedLessonIds.includes(event.lessonId)) return progress;`
- **Skip/unskip:** Same array-membership check
- **Plan accept/dismiss:** Same array-membership check
- **Milestone earned:** `if (!existing || existing.earnedAt) return progress;`

**Verified:** Idempotency tested for `program_started`, `lesson_completed`, and `lesson_skipped`. **Not tested** for `program_paused`, `program_resumed`, `program_completed`, `lesson_uncompleted`, `lesson_unskipped`, `weekly_plan_accepted`, `weekly_plan_dismissed`, `milestone_earned`. The pattern is consistent though.

### 3.4 Timestamps

All timestamps are ISO 8601 strings (`new Date().toISOString()`).

- **Event timestamps** come from the caller via `event.timestamp` (passed through)
- **Initial state** generates `updatedAt` at creation time
- **Migration** uses `now` for all timestamps (migration time)
- **`recalculateMilestones()`** generates its own timestamp when re-earning milestones (the only place the service generates a timestamp not from the event)

**Finding:** `recalculateMilestones()` at [service.ts:415-429](src/lib/program/service.ts#L415-L429) generates `new Date().toISOString()` on its own rather than using the event timestamp. This is only called on `lesson_uncompleted`, so the effect is minimal. **Low-risk debt.**

### 3.5 Legacy Migration

**Legacy format:** `{ completedLessons: string[] }` (stored under `cbtiProgramProgress`)

**Detection:** `isLegacyProgress()` checks for `completedLessons` array + absence of `schemaVersion`

**Migration steps:**

1. Filter to valid lesson IDs only
2. Determine status (completed or active)
3. Find current week (first incomplete week)
4. Calculate milestones from completed lessons
5. Set all timestamps to migration time

**Verified:** 6 tests cover empty, partial, full, invalid IDs, modern passthrough, and null/undefined cases.

### 3.6 Program Completion

- **Auto-completion:** When the last lesson is completed via `lesson_completed` event, status transitions to `completed` and `completedAt` is set
- **Manual completion:** `program_completed` event also triggers completion and earns all remaining milestones
- **Re-open:** `lesson_uncompleted` reverts `completed → active` if not all lessons done
- **Completion via resume edge case:** `program_resumed` from `completed` state would also reactivate the program, because `completed → active` is in the transition table and `handleProgramResumed` checks `isValidStatusTransition(progress.status, "active")`. This is likely acceptable but undocumented.

### 3.7 Unknown Lesson Behavior

**Finding:** The `lesson_completed` and `lesson_uncompleted` handlers do NOT validate that `lessonId` exists in the program definition. Unknown lesson IDs would be added to `completedLessonIds`. This has minor implications:

- `calculateOverallCompletion()` counts all completed IDs, so unknown lessons would slightly inflate the percentage
- `calculateWeekCompletion()` iterates `week.lessonIds`, so unknown lessons don't affect week percentages
- Migration **does** filter invalid lesson IDs

**Assessment: Low-risk.** Lessons come from the definition; arbitrary IDs are only possible through data corruption or future schema changes.

### 3.8 Duplicate Completion

Completing the same lesson twice is a complete no-op (line 212): `return progress;`

### 3.9 Pause/Resume

- Pause: valid only from `active`
- Resume: valid from `paused` (and from `completed` due to transition table allowing `completed → active`)
- Lesson completion while paused: **does work** — lessons are recorded, but status stays `paused`
- Auto-complete from paused: does NOT happen (`baseStatus === "active"` guard at line 246)

### 3.10 Definition Validation

`validateProgramDefinition()` at [definition.ts:151-213](src/lib/program/definition.ts#L151-L213) checks:

- Duplicate lesson IDs
- Duplicate week IDs
- Contiguous week order
- Lessons referenced by weeks exist
- Related lesson IDs exist
- Prerequisite weeks exist

**Finding:** This validation utility exists but `getProgramDefinition()` does NOT call it automatically. It is provided for testing/debugging. The real definition is built from `lessonMetas` which are assumed correct.

### Test Coverage: 38 tests in `service.test.ts` + 19 in `definition.test.ts`

**service.test.ts categories:**

- createInitialProgress (3), isValidStatusTransition (8), program_started (2), pause/resume (2), lesson_completed (4), lesson_uncompleted (3), skip/unskipped (2), overall completion (3), isLegacyProgress (3), migrateLegacyProgress (6), weekly_plan events (2)

**Coverage gaps:**

- `program_completed` event: 0 tests
- `lesson_unskipped` event: 0 tests
- `milestone_earned` standalone event: 0 tests
- `calculateWeekCompletion`, `getWeekAccessStatus`, `getRecommendedNextLesson`: 0 direct tests
- `updateCurrentWeekId`: 0 direct tests
- Invalid transition no-op for most events: not tested
- `updatedAt` behavior on no-op: not tested

---

## 4. Event Model Proportionality

### Classification: **Event-driven reducer pattern** (not full event sourcing)

### What it is:

The `applyEvent(progress, event, definition) → progress` function is a standard reducer pattern. Events are command objects dispatched to modify state.

### What it is NOT:

| Full Event Sourcing Feature         | Present? | Evidence                                                          |
| ----------------------------------- | -------- | ----------------------------------------------------------------- |
| Events persisted as append-only log | ❌       | State is stored as a `ProgramProgress` snapshot                   |
| State replayed from events          | ❌       | State is loaded directly from storage                             |
| Event store / event log             | ❌       | No event storage of any kind                                      |
| Competing sources of truth          | ❌       | `ProgramProgress` is the single source of truth                   |
| Event growth limits                 | N/A      | No events are stored                                              |
| Event schema versioning             | ❌       | Events are function parameters, not persisted                     |
| Deterministic replay                | ⚠️       | `applyEvent` is deterministic, but there's nothing to replay from |
| Migration on events                 | ❌       | Migration is on state/snapshots, not events                       |

### Assessment: **Proportionate**

This is the right level of complexity for Phase G-0. The event-style command pattern gives:

- Clear transition boundaries (11 event types)
- Easy testability (pure function of state + event)
- Idempotency guarantees
- Auditable transition logic

Without the overhead of:

- Event log storage
- Event schema migration
- Replay infrastructure
- Event growth management

The architecture doc calls it "event-sourced", which is slightly imprecise — "event-driven state machine" or "command/reducer pattern" would be more accurate. This is a documentation terminology issue, not an architectural problem.

---

## 5. Program Storage

**File:** `src/lib/program/storage.ts`

### 5.1 SSR Safety

✅ **Fully SSR-safe.** All storage access goes through `safeLocalStorageGet/Set/Remove` from `src/lib/safe-storage.ts`, which guards with `isBrowser()`. Server-side reads return defaults; writes are no-ops.

### 5.2 Storage Keys

| Key                         | Purpose               | Writeable                 |
| --------------------------- | --------------------- | ------------------------- |
| `somna:program-progress:v1` | Canonical v1 progress | Yes                       |
| `cbtiProgramProgress`       | Legacy progress key   | Read-only (never written) |
| `somna:program-plans:v1`    | Weekly program plans  | Yes                       |

### 5.3 Schema Validation

On read, data flows through `migrateLegacyProgress()` which:

- **Legacy shape:** Filters, computes status, recalculates milestones
- **Modern shape:** Validates/coerces each field (status falls back, string arrays filtered for strings, milestones defaulted)
- **Unknown shape:** Returns `createInitialProgress()`

**Finding:** Validation is permissive/coercive rather than rejective. Bad data is silently sanitized. This is consistent with the safe-storage philosophy of never crashing.

### 5.4 Malformed JSON Handling

Two layers of protection:

1. `safeJsonParse` wraps `JSON.parse` in try/catch → returns default value
2. `loadProgramProgress` treats `null` (corrupt result) as "no data" → initial progress

**Verified:** Test "ignores malformed JSON in canonical key" confirms corrupt data returns `not_started` status.

Corrupted data remains in storage (not overwritten).

### 5.5 Future Schema Handling

⚠️ **No forward-schema guard exists.** The code checks `"schemaVersion" in raw` but never compares the value. Data with `schemaVersion: 999` would be silently coerced into the v1 structure, dropping any v2 fields.

**Assessment: Low-risk debt for Phase G-0.** There is no v2 schema yet. This should be addressed before any schema v2 is introduced.

### 5.6 Legacy Migration Flow

1. Try canonical key → if found, pass through `migrateLegacyProgress`
2. If canonical key empty, try legacy key → if legacy shape, migrate and **auto-write to canonical key**
3. If neither, return fresh initial progress

The legacy key is **not deleted** after migration (left in place for safety).

### 5.7 Read/Write Failure Behavior

All operations wrapped in try/catch via safe-storage utilities. Failures are completely silent (no `devWarn` option used). No retry logic, no user-visible feedback.

### 5.8 Progress / Weekly-Plan Separation

✅ **Stored separately** in distinct localStorage keys (`somna:program-progress:v1` vs `somna:program-plans:v1`).

### 5.9 Diary Mutation

✅ **Zero diary/reflection/sleep-record imports.** The program domain is completely separate from the diary domain.

### Test Coverage: 12 tests in `storage.test.ts`

Categories: loadProgramProgress (4), saveProgramProgress (2), clearProgramProgress (2), exportProgramData (2), deleteAllProgramData (2).

**Coverage gaps:** SSR behavior, forward schema, partial corrupt modern data, migration idempotency, legacy key not deleted after migration.

---

## 6. Weekly Plan

**File:** `src/lib/program/weekly-plan.ts`

### 6.1 Schema

`WeeklyProgramPlan` interface with 14 fields: id, programId, weekStart, weekEnd, source, focusId?, reasonKey, recommendedLessonIds, acceptedLessonIds, status, generatedAt, updatedAt, deferredUntil?.

Supporting types: `PlanSource` (baseline | weekly_focus | manual_selection), `PlanStatus` (proposed | accepted | dismissed | completed).

### 6.2 Lifecycle Statuses

Four statuses: `proposed`, `accepted`, `dismissed`, `completed`. Deferral is represented by optional `deferredUntil` field (not a separate status).

**Finding:** No `isValidPlanTransition` function exists. Status changes are not guarded. **Low-risk — Phase G will implement plan lifecycle logic.**

### 6.3 Validation

Three validation functions:

- `validatePlanLessonIds(plan, definition)` — all recommended lessons exist in definition
- `validatePlanAcceptance(plan)` — acceptedLessonIds ⊆ recommendedLessonIds
- `validatePlan(plan, definition)` — full validation returning issue array (11 checks)

**Not validated:** date formats, source/status enum values, programId matching, focusId consistency with source, deferredUntil format, id uniqueness.

**Finding:** Validation is not enforced on save. `saveWeeklyPlan()` accepts any shape. Validators must be called explicitly by the caller.

### 6.4 Lesson Reference Validation

✅ `validatePlanLessonIds` checks every ID in `recommendedLessonIds` against `definition.lessons`.

### 6.5 Persistence

Plans stored in `localStorage` under `somna:program-plans:v1`, with shape `{ schemaVersion: 1, plans: WeeklyProgramPlan[] }`.

CRUD operations: load, save (upsert), delete, clear, get by ID. All read-all/write-all pattern (acceptable for small N). SSR-safe via safe-storage.

**Note:** There is a duplicate `PlansStorage` interface — one in `storage.ts` with `plans: unknown[]`, one in `weekly-plan.ts` with `plans: WeeklyProgramPlan[]`. Both use the same key. Minor maintenance concern.

### 6.6 Export/Delete Support

- Plans included in `exportProgramData()` (as `unknown[]` in the export type)
- Plans deleted by `deleteAllProgramData()` and `clearAllWeeklyPlans()`

### 6.7 Automatic Acceptance

✅ **None.** The docstring explicitly states "No automatic acceptance". `canAcceptPlan()` is a precondition check only, not an action function.

### 6.8 Adaptive Selection

✅ **Not implemented.** The file docstring explicitly states "Phase G-0 defines ONLY the contract and validation — NOT the recommendation logic or adaptive selection." Three plan sources exist as types only; no generation logic.

### Test Coverage: 20 tests in `weekly-plan.test.ts`

Categories: validatePlanLessonIds (4), validatePlanAcceptance (3), validatePlan (6), storage (6+1 malformed JSON).

**Coverage gaps:** `getWeeklyPlan()`, `getPlanLessons()`, `canAcceptPlan()`, `deferredUntil`, SSR behavior, date validation, status transition.

---

## 7. Weekly Focus Adapter

**File:** `src/lib/program/weekly-focus-adapter.ts`

### 7.1 Input Type

`WeeklyFocusSummary` (re-declared locally, not imported from analytics) + parameters: evidenceStart, evidenceEnd, dataSufficiency, acceptedByUser, locale.

**Rationale for re-declaration:** Prevents the Program domain from importing analytics modules directly. Clean boundary.

### 7.2 Output Type

`ProgramRecommendationInput` with fields: `focusCategory`, `focusId`, `evidenceWindow`, `dataSufficiency`, `acceptedByUser`, `locale`, `reasonKey`.

### 7.3 Evidence Window Preservation

✅ Passed through directly into `evidenceWindow.start` and `evidenceWindow.end`.

### 7.4 Data Sufficiency Preservation

✅ Passed through verbatim.

### 7.5 User Acceptance Separation

✅ `acceptedByUser` is a boolean parameter, not inferred. The adapter cannot auto-accept.

### 7.6 Unsupported-Category Behavior

TypeScript compile-time safety only (closed union type). At runtime, whatever `focus.category` is gets assigned directly. No runtime fallback or error handling.

### 7.7 Deterministic Output

✅ Pure function — no side effects, no randomness, no Date calls. Same input → same output.

### 7.8 Dashboard/UI Imports

✅ **None.** Only import is `SupportedLocale` from `../locale-registry`. No React, no components, no routes.

### 7.9 Analytics Recalculation

✅ **None.** Zero computation on the focus data. Pure field mapping.

### 7.10 Automatic Lesson Selection

✅ **No specific lesson selection.** `FOCUS_CATEGORY_TO_LESSON_DOMAINS` maps categories to general tags (e.g., `"education"`, `"habit"`), not to specific lesson IDs. The comments are explicit: "This is NOT a recommendation engine."

### Assessment: ✅ Clean boundary, appropriate scope for G-0

---

## 8. Reminder Boundary

**File:** `src/lib/program/reminder-contract.ts`

### 8.1 Program Creates Request Contract Only

✅ **Yes.** The file defines:

- `ProgramReminderRequest` interface (the request shape)
- `ProgramReminderStatus` type (outcome statuses)
- `ProgramReminderOutcome` interface (outcome shape)
- `validateReminderRequest()` — validates request fields
- `outcomeAffectsProgramProgress()` — always returns `false`

No code creates, schedules, or persists reminders.

### 8.2 No Direct Reminder Persistence

✅ **Confirmed.** Zero imports from reminder modules. Zero references to reminder storage across the entire `src/lib/program/` directory.

### 8.3 No Direct Scheduling

✅ **Confirmed.** No calls to any scheduling functions. `validateReminderRequest` explicitly states: "Does NOT validate schedule feasibility — that's the reminder service's job."

### 8.4 User Confirmation Requirement

Explicitly documented as mandatory:

- Line 20: "User confirmation is MANDATORY for any reminder change requested by Program."
- Line 32-33: "This is a REQUEST only — the reminder service decides whether and how to schedule it, and the user must explicitly confirm."
- `ProgramReminderStatus` includes `"requested"` as initial state (user asked to confirm).

### 8.5 Reminder Service Ownership

✅ Reminder service owns: scheduling, delivery, settings persistence, provider selection, delivery status tracking.

### 8.6 Outcome Ownership

✅ The `outcomeAffectsProgramProgress()` function hardcodes `return false`, making the boundary rule executable code: "Never. Program progress is separate from reminder delivery." Lesson completion is set only by the user.

### 8.7 Usage Outside Program Directory

⚠️ **Zero consumers.** The reminder contract types are not imported by any file outside the program directory. This is expected for Phase G-0 — the contract exists but hasn't been wired into the reminder service yet.

### Assessment: ✅ Clean boundary, contract-only as expected

---

## 9. Sync Contracts

**File:** `src/lib/program/sync-contracts.ts`

### 9.1 Classification: **Contract-only — not wired into production sync**

This is the most important finding in the sync area. The new program sync contracts are **pure type definitions and pure merge functions** that are NOT integrated into the actual sync transport layer.

### Evidence

1. **No external consumers.** `toSyncProgress`, `fromCanonicalProgress`, `mergeLocalAndRemoteProgress` are only imported by their own test file.
2. **Legacy sync types still active.** `src/services/sync/sync-types.ts` has its own `SyncProgramProgress` with a completely different shape:
   ```ts
   // OLD (active in sync transport):
   { currentWeek: number; currentLesson: string; completedLessons: string[]; updatedAt: string }
   // NEW (contract-only):
   { entityType, entityId, schemaVersion, programId, status, startedAt, completedAt, ... }
   ```
3. **`SyncRequest` uses the old type.** The `programProgress` field in `SyncRequest` is typed as the old `SyncProgramProgress`.
4. **Server DB has `program_progress` table** but the wire format hasn't been migrated.

### 9.2 Entity Inventory

| Entity           | Type Name                                              | Schema Version | Tombstones                               |
| ---------------- | ------------------------------------------------------ | -------------- | ---------------------------------------- |
| Program Progress | `SyncProgramProgress` / `CanonicalProgramProgress`     | 1              | No (syncStatus has "deleted" value only) |
| Weekly Plan      | `SyncWeeklyProgramPlan` / `CanonicalWeeklyProgramPlan` | 1              | Yes (`deleted?: boolean`)                |

### 9.3 IDs

- `entityId` — unique sync identifier
- `programId` — which program
- `clientId` — for reconciliation
- `userId?` — server-side only (set to `never` in canonical form)

### 9.4 Timestamps

- `startedAt`, `completedAt` — ISO strings, null when not applicable
- `updatedAt` — ISO string, for LWW conflict resolution

### 9.5 Serialization Functions

**For progress:**

- `toSyncProgress(progress, entityId, options?) → SyncProgramProgress`
- `fromCanonicalProgress(canonical) → ProgramProgress`
- Round-trip integrity: all progress fields survive

**For weekly plans:** ⚠️ **No serialization functions exist.** Only type interfaces are defined.

### 9.6 Conflict Resolution Strategy

| Field                      | Strategy                  | Function                           |
| -------------------------- | ------------------------- | ---------------------------------- |
| completedLessonIds         | Set union                 | `mergeCompletedLessons`            |
| skippedLessonIds           | Set union                 | (in `mergeLocalAndRemoteProgress`) |
| acceptedPlanIds            | Set union                 | (in `mergeLocalAndRemoteProgress`) |
| dismissedRecommendationIds | Set union                 | (in `mergeLocalAndRemoteProgress`) |
| status                     | Most advanced wins        | `resolveStatusConflict`            |
| currentWeekId              | LWW by updatedAt          | `resolveCurrentWeekId`             |
| milestones                 | Union + earlier timestamp | `mergeMilestones`                  |
| startedAt                  | Earlier wins              | (in merge function)                |
| completedAt                | First completion          | (in merge function)                |

**Documentation-vs-code mismatch:** File header says `skippedLessonIds` is LWW, but the implementation uses set union. **Low-risk: the implementation (union) is safer than the documented LWW.**

### 9.7 Anonymous-to-Authenticated Merge

✅ `mergeLocalAndRemoteProgress(local, remote) → ProgramProgress` exists and is fully implemented. Deterministic, idempotent, no data loss (union strategies).

**Not implemented for weekly plans** — only progress has a full merge function.

### 9.8 Assessment: Acceptable with low-risk debt

The contracts are well-designed and tested. The fact that they're not wired into the actual sync system is **expected for Phase G-0** — the completion report explicitly lists "Sync endpoint integration" as a known gap for Phase G. However, the completion report's claim that "Server-side already had program_progress in account export + delete flows" is true but somewhat misleading — the server has a legacy table with a different schema, not the new contract format.

**Risk:** Phase G teams may assume the sync contracts are production-ready and discover during integration that the transport layer still uses the old format. This is manageable as long as it's documented.

### Test Coverage: 24 tests in `sync-contracts.test.ts`

Categories: serialization round-trip (2), mergeCompletedLessons (3), resolveStatusConflict (6), mergeMilestones (4), resolveCurrentWeekId (4), full mergeLocalAndRemoteProgress (5).

**Coverage gaps:** skippedLessonIds merge, acceptedPlanIds merge, dismissedRecommendationIds merge, completedAt edge cases, programVersion max, userId preference, plan sync (no functions exist to test).

---

## 10. Export and Delete Integration

### 10.1 Local Export (Client-side)

⚠️ **Partially wired.**

The `exportProgramData()` function exists in `storage.ts` and returns `{ schemaVersion, progress, plans, exportedAt }`. However, the client-side export UI (`AccountDataDialog.tsx`) exports through the **server API** (`/api/account/export`), not through local export. `exportProgramData()` is **not called by any UI component**.

**Assessment:** The function is available and tested, but it's a utility rather than an integrated flow. This is acceptable for G-0 since the primary export path is server-side.

### 10.2 Server Export

✅ **Program progress IS included (conditional).**

`src/services/account/account-api.ts` line 118-130 queries the `program_progress` table and includes it in the export. Wrapped in try/catch for cases where the table doesn't exist yet.

**Fields:** `id, program_slug, week_number, lesson_slug, completed, completed_at, created_at, updated_at`

**Important caveats:**

- The server-side schema is the **legacy** `program_progress` table shape, NOT the new v1 contract format
- ⚠️ **The `program_progress` table does NOT exist in migrations.** The `migrations/` directory has no migration creating this table. The try/catch silently returns an empty array if the table is missing. In production today, this export is effectively empty.
- ⚠️ **Weekly program plans (`program_plans`) are NOT exported server-side.** There is no server-side table for plans. Client-side plans live only in `localStorage` and are not synced/exported via the API.

### 10.3 Local Delete / Clear Cache

✅ **Program data IS deleted.**

`IdentityMenu.tsx` `handleClearCache()` (lines 72-82):

- Dynamically imports `deleteAllProgramData()` from `@/lib/program/storage`
- Calls it to clear all program keys
- Has a fallback that directly removes known keys if the dynamic import fails

The clear-cache flow covers: sync queue, sync status, migration state, cloud sleep records, cloud reflections, reminder settings, weekly reflections, weekly focus, and program data.

### 10.4 Server Delete / Account Deletion

✅ **Program progress IS deleted (conditional).**

`src/services/account/account-api.ts` line 291-299: `DELETE FROM program_progress WHERE user_id = ?`. Wrapped in try/catch.

**Caveats:**

- ⚠️ Same missing-table issue as export: `program_progress` table is not in migrations, so the DELETE currently affects 0 rows and silently succeeds.
- ⚠️ **Weekly program plans are NOT deleted server-side** (no server-side table exists).

**Full account deletion flow:** User clicks delete → `DELETE /api/account/data` → server deletes all data (including `program_progress`) + soft-deletes user → `onClearCache()` clears all localStorage → user signed out.

### 10.5 Domain Separation

✅ Program data is fully separate from:

- **Diary / Sleep records:** Different storage keys, different DB tables, no cross-module imports
- **Reflections:** Separate storage keys (`somna.reflections.v1` vs `somna:program-progress:v1`)
- **Reminders:** Separate storage keys, no cross-module writes

### 10.6 Summary

| Flow                  | Program Data Included?                | Path                                         |
| --------------------- | ------------------------------------- | -------------------------------------------- |
| Client UI export      | ⚠️ Indirect (goes through server API) | AccountDataDialog → /api/account/export      |
| Server API export     | ✅ Yes (legacy table format)          | account-api.ts: SELECT FROM program_progress |
| Client clear cache    | ✅ Yes                                | IdentityMenu → deleteAllProgramData()        |
| Server account delete | ✅ Yes (legacy table format)          | account-api.ts: DELETE FROM program_progress |

---

## 11. Test Inventory & Coverage

### 11.1 G-0 Test Files and Counts

| Test File                        | Tests   | Category                        | Type |
| -------------------------------- | ------- | ------------------------------- | ---- |
| `locale-registry.test.ts`        | 52      | Locale registry                 | Unit |
| `program/service.test.ts`        | 38      | Program service / state machine | Unit |
| `program/storage.test.ts`        | 12      | Program storage                 | Unit |
| `program/definition.test.ts`     | 19      | Program definition validation   | Unit |
| `program/weekly-plan.test.ts`    | 20      | Weekly plan                     | Unit |
| `program/sync-contracts.test.ts` | 24      | Sync contracts                  | Unit |
| **Total G-0 tests**              | **165** |                                 |      |

**Verification:** `npm test` reports 397 total tests across 27 files, all passing. The 165 G-0 tests represent ~42% of the test suite.

### 11.2 Test Categories Summary

| Domain               | Unit Tests              | Integration Tests | Runtime Route Tests |
| -------------------- | ----------------------- | ----------------- | ------------------- |
| Locale registry      | 52                      | 0                 | 0                   |
| Program service      | 38                      | 0                 | 0                   |
| Program storage      | 12                      | 0                 | 0                   |
| Program definition   | 19                      | 0                 | 0                   |
| Weekly plans         | 20                      | 0                 | 0                   |
| Weekly focus adapter | 0                       | 0                 | 0                   |
| Reminder boundary    | 0                       | 0                 | 0                   |
| Sync contracts       | 24                      | 0                 | 0                   |
| Export/delete        | ~4 (in storage.test.ts) | 0                 | 0                   |
| SSR                  | 0                       | 0                 | 0                   |

**Notable absences:**

- **Weekly focus adapter:** 0 tests (pure adapter, simple logic, low risk)
- **Reminder boundary:** 0 tests (pure types + validation, low risk)
- **SSR safety:** 0 dedicated tests (design relies on safe-storage pattern)
- **Integration tests:** 0 (no tests exercise end-to-end flows through multiple modules)
- **Runtime route tests:** 0 (no route-level tests)

### 11.3 Coverage Quality Assessment

**Strengths:**

- Core state machine transitions are well tested
- Migration paths are tested
- Validation functions are tested
- Merge strategies are tested
- Edge cases (malformed JSON, invalid IDs) are tested

**Gaps (low-risk):**

- No tests for `program_completed` manual event
- No tests for `lesson_unskipped` event
- No direct tests for `updateCurrentWeekId` or `getWeekAccessStatus`
- No SSR-specific tests (but SSR is a safe-storage concern, tested implicitly)
- No integration tests across storage + service + definition

---

## 12. Runtime Route Verification

### 12.1 Program Route Stack

| Route                      | File                        | Uses New Program Module?          |
| -------------------------- | --------------------------- | --------------------------------- |
| `/program`                 | `program.index.tsx`         | ❌ Uses old `program-progress.ts` |
| `/program/week-1` (etc.)   | `program.$slug.tsx`         | ❌ Uses old template components   |
| `/program/week-1/<lesson>` | `program.$week.$lesson.tsx` | ❌ Uses old template components   |
| `/dashboard`               | `dashboard.tsx`             | ❌ Uses old `useProgramProgress`  |
| `/`                        | `index.tsx`                 | N/A (landing)                     |
| `/diary`                   | `diary.tsx`                 | N/A (diary domain)                |
| `/reminders`               | `reminders.tsx`             | N/A (reminder domain)             |

### 12.2 Key Finding: Old `program-progress.ts` Not Delegating

The completion report's "Modified Files" list claims:

> `src/lib/program-progress.ts` — delegate to program/service (backward compat)

**This is NOT implemented.** The old `program-progress.ts` (206 lines) still:

- Has its own `isBrowser()` check (duplicating safe-storage)
- Has its own `loadProgress()` / `saveProgress()` direct localStorage access
- Has its own `ProgramProgress` type (`{ completedLessons: string[] }` — legacy shape)
- Has its own `useProgramProgress()` React hook
- Does NOT import from `@/lib/program/service` or `@/lib/program/storage`
- Is still used by `program.index.tsx`, `dashboard.tsx`, and lesson templates

**Assessment: Medium-severity misstatement, but low actual risk.**

This is a discrepancy in the completion report, not a runtime bug. The old code still works. The new program domain is designed to be integrated in Phase G. The existence of both systems side-by-side is technically debt, but it's expected debt — Phase G-0's purpose was to build the foundation, not to replace the runtime code.

However, the completion report should not have listed this file as "modified to delegate." It is unchanged in its core behavior.

### 12.3 SSR Safety

Existing routes use the old `isBrowser()` pattern in `program-progress.ts`, which provides SSR safety (returns empty progress on server). The new program module also uses safe-storage for SSR safety. Both paths are SSR-safe.

### 12.4 Error Boundary / Hydration

- Build succeeds (exit code 0)
- No new hydration warnings introduced (new G-0 code is not wired into SSR-rendered routes)
- No raw localization key exposure from new G-0 code (not wired into UI yet)
- The existing i18n fallback chain (`resolveTranslation` + `safeKeyFallback`) prevents raw key exposure

### 12.5 Empty / Malformed / Legacy Storage

**Empty program storage:** Returns `not_started` status — handled gracefully.

**Malformed JSON:** Returns initial progress — handled gracefully (tested).

**Legacy data:** Auto-migrates on first read — tested.

**Unsupported locale:** The locale registry normalizes unknown locales to English — tested.

---

## 13. Final Verdict

### ⚠️ PHASE G-0 ACCEPTED WITH LOW-RISK DEBT

### Rationale

**Why not "ACCEPTED — READY FOR PHASE G":**

1. The completion report misrepresents `program-progress.ts` as delegating to the new service when it does not.
2. Sync contracts are contract-only and not wired into the actual sync transport — this is somewhat expected for G-0, but Phase G teams should be aware.
3. No forward-schema guard exists on program progress or plans storage.
4. Several test coverage gaps exist (manual `program_completed` event, `lesson_unskipped`, plan lifecycle transitions, SSR).

**Why not "NOT ACCEPTED":**

- All core deliverables are present and well-designed
- 165 tests all pass (397 total test suite passes)
- Zero TypeScript errors in new G-0 files
- Production build succeeds
- Locale unification IS production-integrated and working
- Domain boundaries are clean (program ↔ diary, program ↔ reminders, program ↔ analytics)
- The event-driven state machine is correct and idempotent
- SSR safety is maintained throughout
- Export/delete integration covers the critical paths (clear cache, server export, server delete)
- All non-goals were correctly avoided (no adaptive selection, no auto-scheduling, no clinical changes)

### Summary of Debt Items

| #   | Item                                                                                 | Severity | Phase G Item?                            |
| --- | ------------------------------------------------------------------------------------ | -------- | ---------------------------------------- |
| 1   | `program-progress.ts` not delegating to new service                                  | Medium   | Yes — Phase G should wire in new service |
| 2   | Sync contracts not wired into transport layer                                        | Medium   | Yes — Phase G sync integration           |
| 3   | `program_progress` DB table not in migrations (server export/delete currently empty) | Medium   | Yes — Phase G needs proper schema        |
| 4   | Weekly plans not in server export / delete / sync                                    | Medium   | Yes — Phase G plans persistence          |
| 5   | No forward-schema guard on storage                                                   | Low      | Yes — before v2 schema                   |
| 6   | Missing tests for some event types                                                   | Low      | Nice-to-have                             |
| 7   | `recalculateMilestones` generates its own timestamp                                  | Low      | Low priority                             |
| 8   | Duplicate `PlansStorage` interface                                                   | Low      | Cleanup                                  |
| 9   | `skippedLessonIds` docs say LWW, code uses union                                     | Low      | Fix docstring                            |
| 10  | No plan serialization functions for sync                                             | Low      | Phase G sync work                        |
| 11  | Release gate doesn't validate `programProgress` in export                            | Low      | Cleanup                                  |

### Recommendation

**Proceed to Phase G** with awareness that:

1. The program domain foundation is solid and can be built upon
2. Wiring the new program service into the UI routes is Phase G work that was claimed as done but isn't
3. Sync integration is a larger piece of work than the completion report implies
4. All debt items are tracked and addressable during Phase G without architectural changes

---

## 14. Validation Command Evidence (Correct Exit Codes)

All commands run with exit-code capture using the `> log 2>&1; EXIT=$?` pattern to avoid reporting `tail`/`grep` exit codes.

| Command                    | EXIT_CODE | Evidence                                                  |
| -------------------------- | --------- | --------------------------------------------------------- |
| `npm test`                 | 0         | 27 test files, 397 tests passed in 3.37s                  |
| `npm run typecheck`        | 2         | 78 TS errors (all pre-existing / expected Lang expansion) |
| `npm run typecheck:app`    | 2         | Errors in server.ts, sync services, auth                  |
| `npm run typecheck:worker` | 2         | Same as app (same tsconfig scope)                         |
| `npm run typecheck:tests`  | 2         | Reminder type mismatches in test files                    |
| `npm run typecheck:all`    | 2         | Combined all above                                        |
| `npm run lint`             | 1         | 13,112 errors (13,080 = CRLF prettier)                    |
| `npm run build`            | 0         | Built in 4.01s, dist/server/ output                       |

**Baseline agreement:** The TypeScript error count of 78 matches the baseline document (`TYPESCRIPT_UNIQUE_ERROR_BASELINE.md`). Zero new errors in G-0 files.
