# Program Runtime Integration Architecture

**Version:** 1.2 (Phase G-1.1 Hardening)
**Status:** Production runtime — active
**Last updated:** 2026-07-30

## G-1.1 Update (2026-07-30)

Phase G-1.1 strengthens the state machine's paused-state invariant and adds typed mutation results:

- **`applyEvent()` now returns `ProgramMutationResult`** — a discriminated union of `applied` | `blocked` | `unchanged` — instead of bare `ProgramProgress`.
- **`isMutationAllowed()` guard** blocks all 7 progress-mutation events when status is `paused`. Lifecycle events (start/pause/resume/complete) continue to use `isValidStatusTransition`.
- **`useProgramService` action methods return `ProgramActionResult`** — only `"applied"` results persist to storage. `"blocked"` and `"unsupported-version"` are silent no-ops at the storage layer.
- **`corrupted` load status** is defined in `ProgramLoadResult` but not reachable from any code path (confirmed by audit).

See: `docs/implementation/PHASE_G_1_1_PROGRAM_LIFECYCLE_HARDENING.md`

## Overview

This document describes how the Phase G-0 Program foundation is integrated into
the production runtime of Sleep Diary v2.4.6+. The Program domain (state machine,
progress types, weekly plans, sync contracts) is now the single source of truth
for all program-related state in the app.

The key principle: **all program reads and writes go through the new domain.**
No production code imports the legacy `program-progress.ts` module.

---

## Runtime Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        React UI Layer                            │
│                                                                  │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────────────┐  │
│  │ /program   │  │ /program/:id │  │ /program/:week/:lesson  │  │
│  │ (dashboard)│  │  (week page) │  │   (lesson page)         │  │
│  └─────┬──────┘  └──────┬───────┘  └──────────┬──────────────┘  │
│        │                │                      │                 │
│        └────────────────┴──────────┬───────────┘                 │
│                                    │                             │
│                     ┌──────────────▼──────────────┐              │
│                     │   useProgramService() hook   │              │
│                     │  (single entry point)        │              │
│                     └──────────┬──────────────────┘              │
│                                │ reads + writes                   │
└────────────────────────────────┼─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                        Program Domain Layer                       │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │   storage.ts     │  │   service.ts     │  │  weekly-plan.ts│  │
│  │  (persistence)   │  │ (state machine)  │  │ (validation)   │  │
│  └────────┬─────────┘  └────────▲─────────┘  └────────┬───────┘  │
│           │                     │                     │          │
│           │     applyEvent()    │                     │          │
│           └─────────────────────┴─────────────────────┘          │
│                                                                  │
│  Forward-schema guard: storage.ts blocks writes when             │
│  stored schema version > SUPPORTED_PROGRAM_SCHEMA_VERSION        │
└──────────────────────────────────────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                        Sync Transport                             │
│                                                                  │
│  Client (sync-client.ts)  ↔  Server (sync-api.ts)                │
│         │                              │                          │
│         ▼                              ▼                          │
│  toSyncProgress()              program_progress DB table         │
│  fromCanonicalProgress()       (D1 / Cloudflare)                 │
│  mergeLocalAndRemoteProgress()                                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## Single Entry Point: `useProgramService`

### Purpose

`useProgramService()` is the **only** way React components interact with the
Program domain. It provides a consistent, SSR-safe interface that:

- Reads from the canonical storage layer
- Routes all writes through the event-sourced state machine (`applyEvent`)
- Provides derived values (completion percentages, badges, week status)
- Handles cross-tab reactivity
- Respects the forward-schema guard

### Return value

```typescript
type ProgramLoadStatus =
  | "loading" // SSR / not yet hydrated
  | "ready" // normal load, progress is user's real data
  | "empty" // no stored progress (never started)
  | "migrated" // data was migrated from legacy schema
  | "unsupported-version" // stored schema is newer than supported
  | "corrupted"; // stored data was malformed

interface UseProgramServiceResult {
  // Core state
  definition: ProgramDefinition;
  progress: ProgramProgress;
  hydrated: boolean;
  loadStatus: ProgramLoadStatus; // explicit load contract
  isUnsupportedSchema: boolean; // convenience alias
  unsupportedSchemaInfo: {
    storedSchemaVersion: number;
    supportedSchemaVersion: number;
    raw: unknown;
    fallback: ProgramProgress;
  } | null;

  // Derived values
  overallCompletion: number; // 0-100 integer percent
  currentWeekId: string | null;
  recommendedNextLesson: ProgramLessonDefinition | null;
  milestones: ProgramMilestone[];
  earnedBadgeIds: string[];

  // Per-week queries
  getWeekStatus(weekId: string): "locked" | "available" | "completed";
  getWeekCompletion(weekId: string): number; // 0-100
  getWeekCompletedCount(weekId: string): number;

  // Mutations (all go through applyEvent state machine)
  // All mutations are no-ops when loadStatus === "unsupported-version"
  completeLesson(lessonId: string, weekId: string): void;
  uncompleteLesson(lessonId: string, weekId: string): void;
  toggleLesson(lessonId: string, weekId: string): void;
  pauseProgram(): void;
  resumeProgram(): void;
}
```

### Cross-tab reactivity

The hook dispatches and listens for a `"somna-program-progress-change"` custom
event on the `window` object. Any tab that saves progress fires the event, and
all other tabs reload from storage. This uses the `storage` event as a fallback
for cross-tab notification.

### SSR safety

On the server (no `window`), the hook returns initial progress with
`hydrated: false`. Components must check `hydrated` before rendering
user-specific state to avoid hydration mismatches.

---

## Migration Path: Legacy → New Domain

### What was legacy?

The old `src/lib/program-progress.ts` module stored `{ completedLessons: string[] }`
under the `cbtiProgramProgress` localStorage key. It had no state machine, no
weekly plans, no milestones, no schema versioning.

### How migration works

Migration happens transparently on first load, inside `storage.ts`:

1. **Load** checks the canonical key first (`somna:program-progress:v1`)
2. If canonical doesn't exist, checks the legacy key (`cbtiProgramProgress`)
3. If legacy data is found, it's converted via `migrateLegacyProgress()`
   - Sets `status` to `"active"` if there are completed lessons
   - Sets `startedAt` to the earliest reasonable timestamp
   - Preserves all completed lesson IDs
4. The migrated progress is immediately saved to the canonical key
5. The legacy key is left in place (read-only, for safety)

### Production code never imports legacy

A grep for `program-progress` confirms: no production route, component, or
service imports the legacy module. It exists solely as a migration source.

---

## Forward-Schema Guard

### Why it exists

Future versions of the app may bump `schemaVersion` on `ProgramProgress`.
If a user downgrades (e.g., uses an older browser with a stale cache), we
must **never silently downgrade their data**.

### How it works

1. On load, `storage.ts` checks `checkSchemaVersion(raw)`
2. If `storedVersion > SUPPORTED_PROGRAM_SCHEMA_VERSION`:
   - Returns `UnsupportedProgramSchema` with `kind: "unsupported_schema"`
   - Preserves the raw data exactly as found
   - Provides a safe `fallback` (initial progress) for display
3. On save, `saveProgramProgress()` checks the stored version first
   - If stored is newer, **returns `false` and does NOT write**
   - Future data is preserved untouched
4. On export, includes `unsupportedSchemaRaw` and `unsupportedSchemaVersion`
   so users get all their data even if this build can't read it
5. On explicit delete (user-initiated), the guard is bypassed — deletion is
   an intentional user action

### Detection by callers

```typescript
const loaded = loadProgramProgress(definition);
if (isUnsupportedSchema(loaded)) {
  // Show "please update your app" message
  // Never call saveProgramProgress() in this state
}
```

---

## Load Result Contract (ProgramLoadResult)

### Why a discriminated union?

Previously, `loadProgramProgress` returned `ProgramProgress | UnsupportedProgramSchema`.
This worked for low-level code but made it hard for UI layers to distinguish:

- Empty progress (user never started) → "Start your journey" CTA
- Unsupported schema (future version) → "Please update" warning
- Migrated data (legacy → v1) → normal operation
- Corrupted data → error state

`ProgramLoadResult` makes these states explicit:

```typescript
type ProgramLoadResult =
  | { status: "ready"; progress: ProgramProgress }
  | { status: "empty"; progress: ProgramProgress }
  | { status: "migrated"; progress: ProgramProgress; fromVersion: number }
  | {
      status: "unsupported-version";
      storedVersion: number;
      supportedVersion: number;
      raw: unknown;
      fallback: ProgramProgress;
    }
  | {
      status: "corrupted";
      recoverable: boolean;
      progress: ProgramProgress;
      raw?: unknown;
    };
```

### API: `loadProgramProgressResult(definition)`

Returns the discriminated union. The legacy `loadProgramProgress()` function is
kept for backward compatibility and delegates to the new function internally.

### Service-layer write blocking

When `loadStatus === "unsupported-version"`:

- `completeLesson()` / `uncompleteLesson()` / `toggleLesson()` are **no-ops**
- `pauseProgram()` / `resumeProgram()` are **no-ops**
- `saveProgramProgress()` returns `false`
- **No local state updates** — the fallback progress is never shown as user data
- A dev-mode warning is logged (no user data is logged)

### UI protection: ProgramUnsupportedBanner

A reusable banner component at
`src/components/program/ProgramUnsupportedBanner.tsx`:

- **SSR-safe**: renders nothing on the server (no hydration mismatch)
- **Full variant**: shown on `/program`, `/program/:week`, and lesson pages
- **Compact variant**: shown on the Dashboard card
- Uses `getProgramLessonUI(lang)` for all strings with English fallback
- Includes a Refresh button that calls `window.location.reload()`
- Displays supported vs stored version numbers
- **Does not** show raw user data, raw schema content, or localization keys

### Route behavior when unsupported

| Route                    | Behavior                                                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `/program`               | Banner visible. Week cards locked (not clickable). Progress/badges hidden (don't show empty state). No assessment CTA. |
| `/program/:week`         | Banner visible. Lesson links still work (content is readable).                                                         |
| `/program/:week/:lesson` | Banner visible. Completion toggle disabled. Lesson content still readable.                                             |
| `/dashboard`             | Compact banner inside Program card. No incorrect "not started" message. No crash.                                      |

---

## Weekly Plan Validation Enforcement

### Validation is mandatory on save

`saveWeeklyPlan(plan, definition)` always runs `validatePlan()` before writing.
If validation fails, it throws `WeeklyPlanValidationError` with:

- `planId`: the plan that failed
- `issues`: array of human-readable error strings
- Previous valid plan in storage is **preserved** (no partial writes)

### What gets validated

- Required fields: `id`, `programId`, `weekStart`, `weekEnd`, `source`, `reasonKey`
- Valid `programId` (matches the definition)
- Valid `source` enum: `"baseline" | "weekly_focus" | "manual_selection"`
- Valid `status` enum: `"proposed" | "accepted" | "dismissed" | "completed"`
- ISO date format for `weekStart` and `weekEnd`
- Date order: `weekStart <= weekEnd`
- No duplicate lesson IDs in `recommendedLessonIds` or `acceptedLessonIds`
- All recommended/accepted lesson IDs reference real lessons in the definition
- `acceptedLessonIds` is a subset of `recommendedLessonIds`
  (unless `source === "manual_selection"`)

---

## Sync Integration

### Client side (`sync-client.ts`)

- **Upload**: Converts local progress to `SyncProgramProgress` via `toSyncProgress()`
  - Skips empty/not_started progress
  - Respects forward-schema guard (doesn't send data we don't understand)
- **Download**: Receives `CanonicalProgramProgress` from server
  - Converts via `fromCanonicalProgress()`
  - Merges with local via `mergeLocalAndRemoteProgress()` (union strategy)
  - Respects forward-schema guard (never overwrites newer local data)

### Server side (`sync-api.ts`)

- Loads server progress from `program_progress` D1 table
- Merges client + server using the same union strategy
- Upserts merged result to the database
- Returns canonical progress in the sync response
- Program progress sync errors are **non-fatal**: a failure logs an error
  but doesn't break the sleep/reflection sync

### Merge strategy (both client and server)

- `completedLessonIds`: **set union** (both sides preserved)
- `skippedLessonIds`: set union
- `acceptedPlanIds`: set union
- `dismissedRecommendationIds`: set union
- `status`: most-advanced wins (`not_started` → `active`/`paused` → `completed`)
- `currentWeekId`: latest timestamp wins
- `milestones`: union by id (earlier `earnedAt` wins)
- `startedAt`: earlier of the two
- `completedAt`: **earliest valid timestamp wins** (first confirmed completion). Invalid timestamps treated as null. See `program-sync-contracts.md` for the full truth table.

---

## Database Schema

Migration file: `migrations/0005_program_progress.sql`

```sql
CREATE TABLE program_progress (
  id TEXT PRIMARY KEY,                    -- entity ID for sync
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id TEXT NOT NULL DEFAULT 'cbti-core',
  program_version INTEGER NOT NULL DEFAULT 1,
  schema_version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'not_started',
  started_at TEXT,
  completed_at TEXT,
  current_week_id TEXT,
  completed_lesson_ids TEXT NOT NULL DEFAULT '[]',   -- JSON array
  skipped_lesson_ids TEXT NOT NULL DEFAULT '[]',     -- JSON array
  accepted_plan_ids TEXT NOT NULL DEFAULT '[]',      -- JSON array
  dismissed_recommendation_ids TEXT NOT NULL DEFAULT '[]',  -- JSON array
  milestones TEXT NOT NULL DEFAULT '[]',             -- JSON array
  updated_at TEXT NOT NULL,
  client_id TEXT,
  UNIQUE(user_id, program_id)
);
```

**Design choice**: JSON arrays for lesson IDs and milestones instead of join
tables. This is appropriate for the Phase G feature set (one program, ~30
lessons total, single row per user). Normalize to join tables if/when query
patterns demand per-lesson indexing.

---

## Account Export & Delete

### Export (`handleAccountExport`)

- Reads from `program_progress` table (new canonical schema)
- Includes all fields: program_id, status, lesson arrays, milestones, etc.
- No broad try/catch — the table is guaranteed to exist by migration
- Export is a JSON download with `schemaVersion: "1.0.0"`

### Delete (`handleAccountDelete`)

- Deletes from `program_progress` table via `WHERE user_id = ?`
- Also deletes sleep records, reflections, reminder settings, sync data
- Revokes all sessions, soft-deletes the user account
- No try/catch around program_progress deletion — table exists by migration

---

## Files Modified / Added

### New files

| File                                               | Purpose                         |
| -------------------------------------------------- | ------------------------------- |
| `src/lib/program/use-program-service.ts`           | React hook — single entry point |
| `src/lib/program/integration.test.ts`              | Integration tests (28 tests)    |
| `src/services/sync/db/program-progress-db.ts`      | Server DB layer                 |
| `migrations/0005_program_progress.sql`             | D1 migration                    |
| `docs/architecture/program-runtime-integration.md` | This document                   |
| `docs/architecture/program-data-ownership.md`      | Data ownership doc              |

### Modified files

| File                                          | Change                                          |
| --------------------------------------------- | ----------------------------------------------- |
| `src/lib/program/storage.ts`                  | Forward-schema guard, export/delete integration |
| `src/lib/program/weekly-plan.ts`              | Validation enforcement on save                  |
| `src/routes/program.index.tsx`                | Uses `useProgramService`                        |
| `src/components/program/WeekPageTemplate.tsx` | Uses `useProgramService`                        |
| `src/components/program/LessonTemplate.tsx`   | Uses `useProgramService`                        |
| `src/routes/dashboard.tsx`                    | Uses `useProgramService`                        |
| `src/lib/program-progress.ts`                 | Marked `@deprecated`                            |
| `src/services/sync/sync-client.ts`            | Program progress in sync upload/download        |
| `src/services/sync/sync-types.ts`             | Sync type updates (new Canonical format)        |
| `src/services/sync/api/sync-api.ts`           | Server-side program progress sync               |
| `src/services/account/account-api.ts`         | Export/delete use new table, no try/catch       |
| `src/lib/program/storage.test.ts`             | Forward-schema guard tests (12 new)             |
| `src/lib/program/weekly-plan.test.ts`         | Validation enforcement tests (10 new)           |
