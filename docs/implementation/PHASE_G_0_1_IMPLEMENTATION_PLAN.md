# Phase G-0.1 Implementation Plan

## Program Foundation Runtime Integration & Data Ownership Remediation

**Status**: In Progress
**Version**: 0.1
**Target**: Sleep Diary v2.4.6

---

## 1. Background

Phase G-0 delivered the Program domain foundation (types, state machine, storage,
weekly plans, sync contracts, and definitions). The Phase G-0 Acceptance Audit
accepted the foundation with low-risk debt but identified 10 verified gaps that
prevent the new foundation from being the actual production runtime source of truth.

This remediation closes those gaps without redesigning the Program domain,
without adding adaptive learning, and without expanding the UI.

---

## 2. Verified Gaps (from audit)

| #   | Gap                                                                              | Severity |
| --- | -------------------------------------------------------------------------------- | -------- |
| 1   | Existing Program routes still use legacy `program-progress.ts`                   | High     |
| 2   | New Program service is not yet the runtime source of truth                       | High     |
| 3   | Weekly Plan validation is not enforced during persistence                        | Medium   |
| 4   | Program sync contracts are not connected to the real sync transport              | High     |
| 5   | Old Program sync types remain active                                             | Medium   |
| 6   | `program_progress` is missing from database migrations                           | High     |
| 7   | `exportProgramData()` has no production caller                                   | Medium   |
| 8   | Program export/delete relies on conditional try/catch instead of verified schema | Medium   |
| 9   | No Program integration or route tests exist                                      | Medium   |
| 10  | Program storage lacks an explicit forward-schema guard                           | Medium   |

---

## 3. Architecture Overview

### 3.1 Target State

```
Routes (program/, dashboard)
    ↓
useProgramService()  ← NEW React hook
    ↓
Program Service (event-sourced state machine)
    ↓
Program Storage (SSR-safe, schema-guarded)
    ↓
├─ localStorage (canonical: somna:program-progress:v1)
├─ localStorage (plans: somna:program-plans:v1)
└─ Sync Transport (program_progress entity)
    ↓
Server DB (program_progress table)
```

### 3.2 Legacy Migration Path

```
Legacy: cbtiProgramProgress (completedLessons: string[])
    ↓  (on first read, detected by storage layer)
migrateLegacyProgress() → canonical ProgramProgress
    ↓
save to somna:program-progress:v1
    ↓
continue using new service
(legacy key never written, only read for migration)
```

### 3.3 Sync Integration

```
Client buildSyncRequest()
    ↓  (add program progress)
SyncRequest.programProgress (new SyncProgramProgress shape)
    ↓
Server handleSync()
    ↓  (read/write program_progress table)
program_progress DB table
    ↓
SyncResponse.programProgress (CanonicalProgramProgress)
    ↓
Client applyServerState()
    ↓
mergeLocalAndRemoteProgress() → saveProgramProgress()
```

---

## 4. Implementation Steps

### Step 1: Create `useProgramService()` React Hook

**File**: `src/lib/program/use-program-service.ts` (NEW)

- SSR-safe loading of program progress
- Dispatches events through `applyEvent()`
- Derives values from `getProgramDefinition()` + progress
- Handles migration transparently
- Emits change events for cross-component reactivity
- Exposes: `progress`, `hydrated`, `definition`, `completeLesson`, `uncompleteLesson`, `getWeekStatus`, `getWeekCompletion`, `overallCompletion`, `currentWeek`, `recommendedNext`, `milestones`

### Step 2: Migrate Routes to New Service

Files to update:

- `src/routes/program.index.tsx` — replace `useProgramProgress` with `useProgramService`
- `src/components/program/WeekPageTemplate.tsx` — replace usage
- `src/components/program/LessonTemplate.tsx` — replace usage
- `src/routes/dashboard.tsx` — replace `ProgramProgressCard` usage

All routes must:

- Read progress through new service
- Write through event dispatch
- Use derived values from new service
- Maintain SSR/hydration stability
- Preserve exact same UI behavior

### Step 3: Deprecate Legacy Module

**File**: `src/lib/program-progress.ts`

- Add `@deprecated` JSDoc
- Add clear comment: "Legacy migration-only — use `@/lib/program/` instead"
- Keep for backward compat of any remaining test/tool imports
- Do NOT delete (still needed as migration source reader)

### Step 4: Enforce Weekly Plan Validation on Save

**File**: `src/lib/program/weekly-plan.ts`

- `saveWeeklyPlan()` must call `validatePlan()` before persisting
- Invalid plans: throw `WeeklyPlanValidationError` with typed `issues: string[]`
- Existing valid plan is preserved (no partial writes)
- Add tests for all validation rules

### Step 5: Forward-Schema Guard

**File**: `src/lib/program/storage.ts`

- Detect `schemaVersion > SUPPORTED_SCHEMA_VERSION`
- Return `UnsupportedSchemaState` marker instead of initial state
- Never mutate data when schema is newer
- Preserve raw stored data
- Dev-only diagnostic (no user content logged)
- Add tests: current, legacy, future, missing, malformed

### Step 6: Database Migration (0005)

**File**: `migrations/0005_program_progress.sql` (NEW)

One table for program progress (sufficient for current needs):

```sql
CREATE TABLE IF NOT EXISTS program_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  program_id TEXT NOT NULL DEFAULT 'cbti-core',
  program_version INTEGER NOT NULL DEFAULT 1,
  schema_version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'not_started',
  started_at TEXT,
  completed_at TEXT,
  current_week_id TEXT,
  completed_lesson_ids TEXT NOT NULL DEFAULT '[]',
  skipped_lesson_ids TEXT NOT NULL DEFAULT '[]',
  accepted_plan_ids TEXT NOT NULL DEFAULT '[]',
  dismissed_recommendation_ids TEXT NOT NULL DEFAULT '[]',
  milestones TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL,
  client_id TEXT,

  UNIQUE(user_id, program_id),
  INDEX idx_program_progress_user_id (user_id),
  INDEX idx_program_progress_updated_at (updated_at)
);
```

Normalized JSON arrays for lesson IDs (simple, flexible, no join tables needed for Phase G-0.1).

Weekly plans table deferred — not yet needed for production runtime.

### Step 7: Connect Program Sync to Transport

#### Client side: `src/services/sync/sync-client.ts`

- Add `loadLocalProgramProgress()` using new sync contracts
- Add to `buildSyncRequest()` → `request.programProgress`
- Add to `applyServerState()` → merge + save

#### Server side: `src/services/sync/api/sync-api.ts`

- Import new `SyncProgramProgress` / `CanonicalProgramProgress` from program module
- Add DB helpers: `getProgramProgressByUserId`, `upsertProgramProgress`
- Integrate into `processSync()` flow
- Use merge strategies from `program/sync-contracts.ts`

### Step 8: Deprecate Old Sync Types

**File**: `src/services/sync/sync-types.ts`

- Mark old `SyncProgramProgress` interface as `@deprecated`
- Mark old `CanonicalProgramProgress` as `@deprecated`
- Keep type-only export for backward compat

### Step 9: Server Export / Delete (Migration-Backed)

**File**: `src/services/account/account-api.ts`

Remove broad try/catch pattern:

```ts
// BEFORE: try { SELECT program_progress } catch { ignore }
// AFTER: SELECT from properly-migrated table; surface real errors
```

- Update export to query new `program_progress` schema
- Update delete to delete from new `program_progress` schema
- Proper error handling (not swallowing)
- Export JSON matches `ProgramExportData` shape

### Step 10: Integration Tests

**File**: `src/lib/program/program-runtime.test.ts` (NEW)

Test scenarios:

1. Legacy progress → migration → new state renders
2. Complete lesson → event applied → state saved → persists
3. Invalid weekly plan → save rejected → previous valid preserved
4. Serialize → sync → deserialize → merge → progress preserved
5. Two-device completed lessons → merge → set union
6. Save progress → export → Program data included
7. Save progress → delete all → local + server data removed
8. Future schema → load safely → no overwrite → no data loss

### Step 11: Documentation

New files:

- `docs/architecture/program-runtime-integration.md`
- `docs/architecture/program-data-ownership.md`

Update files:

- `docs/architecture/program-domain.md`
- `docs/architecture/program-sync-contracts.md`
- `docs/audit/PHASE_G_0_ACCEPTANCE_AUDIT.md` (add G-0.1 cross-ref)

Create:

- `docs/implementation/PHASE_G_0_1_COMPLETION_REPORT.md`

---

## 5. Non-Goals

- No adaptive lesson recommendation
- No weekly plan generation rules
- No AI coaching
- No automatic reminder creation
- No reminder scheduling UI
- No new Program visual design
- No gamification
- No clinician features
- No full translation expansion
- No unrelated TypeScript cleanup

---

## 6. Completion Criteria

Remediation is complete only when ALL are true:

- [ ] Production routes no longer use legacy program-progress as source of truth
- [ ] Legacy progress is migration-only (deprecated, not imported by new code)
- [ ] Weekly Plan validation is enforced on save
- [ ] Future schema versions are protected (forward-schema guard)
- [ ] Program database migration exists (idempotent, user-owned)
- [ ] Program sync contracts are connected to actual transport
- [ ] Old Program sync types are deprecated/removed
- [ ] Program export has a production caller
- [ ] Program delete-all is migration-backed and verified
- [ ] Broad missing-table error swallowing is removed
- [ ] Integration tests cover route, storage, sync, export, delete
- [ ] Program runtime routes work (no error boundary, no hydration warnings)
- [ ] New code has zero TypeScript errors
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Documentation reflects actual runtime behavior

---

## 7. Risk Assessment

| Risk                                   | Mitigation                                                        |
| -------------------------------------- | ----------------------------------------------------------------- |
| Hydration mismatch from new hook       | Ensure SSR returns same shape as legacy; test hydration           |
| Loss of user progress during migration | Migration is read-only on legacy key; write only to canonical key |
| Sync merge corrupts data               | Set-union for completed lessons; never undoes completions         |
| DB migration fails in production       | Idempotent `CREATE TABLE IF NOT EXISTS`; verified with dry-run    |
| Type errors from large refactor        | Run typecheck at each step                                        |

---

## 8. Execution Order

1. Forward-schema guard (storage.ts) — foundational safety
2. Weekly plan validation enforcement — persistence safety
3. `useProgramService()` hook — bridge for UI migration
4. Route/component migration (program.index, WeekPage, Lesson, Dashboard) — runtime switch
5. Legacy deprecation
6. Database migration (0005)
7. Sync transport integration (client + server)
8. Old sync type deprecation
9. Server export/delete cleanup (remove try/catch)
10. Integration tests
11. TypeScript / lint / build verification
12. Documentation + completion report
