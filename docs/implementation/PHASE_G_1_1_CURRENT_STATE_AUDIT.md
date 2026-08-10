# Phase G-1.1 — Current State Audit

**Date:** 2026-07-30
**Baseline:** Phase G-1 accepted with low-risk debt
**Codebase:** Sleep Diary v2.5 (commit ce8e9dc)

## Purpose

Verify the actual state of Program lifecycle enforcement before Phase G-1.1 hardening.
Do not assume Phase G-1 reports are fully accurate.

---

## 1. Architecture Overview

```
UI components (routes, cards, LessonTemplate)
        ↓ uses
useProgramService (React hook)  ← single entry point
        ↓ calls
applyEvent (pure state machine in service.ts)
        ↓ reads/writes
storage.ts (localStorage wrapper with forward-schema guard)
```

Key files:

- `src/lib/program/types.ts` — types, events, transitions, derived values
- `src/lib/program/service.ts` — `applyEvent()`, event handlers, migration
- `src/lib/program/use-program-service.ts` — React hook, persistence, reactivity
- `src/lib/program/storage.ts` — `ProgramLoadResult`, forward-schema guard

---

## 2. Operation Enforcement Matrix

| Operation                  | Active | Paused | Completed | Unsupported | Current enforcement layer                               |
| -------------------------- | :----: | :----: | :-------: | :---------: | ------------------------------------------------------- |
| complete lesson            |   ✅   |   ❌   |    ❌     |     ❌      | **UI only** (disabled button) — state machine allows it |
| uncomplete lesson          |   ✅   |   ❌   |    ❌     |     ❌      | **UI only** — state machine allows it                   |
| toggle lesson              |   ✅   |   ❌   |    ❌     |     ❌      | **UI only** (calls complete/uncomplete)                 |
| pause                      |   ✅   |   ❌   |    ❌     |     ❌      | State machine (via `isValidStatusTransition`)           |
| resume                     |   ❌   |   ✅   |    ❌     |     ❌      | State machine (via `isValidStatusTransition`)           |
| advance week               |   ✅   |   ❌   |    ❌     |     ❌      | Implicit (side effect of lesson completion)             |
| restart (not implemented)  |   —    |   —    |     —     |      —      | N/A — no restart action exists                          |
| recommendation persistence |   ✅   |   ❌   |    ❌     |     ❌      | **None** — weekly_plan events have no status guard      |
| milestone updates          |   ✅   |   ❌   |    ✅     |     ❌      | Implicit (side effect of lesson completion)             |
| lesson skip / unskip       |   ✅   |   ❌   |    ❌     |     ❌      | **None** — no status guard in state machine             |

Legend: ✅ = allowed, ❌ = blocked

### Key findings

1. **Lesson completion (`lesson_completed`) is NOT blocked when paused** — The state machine's `handleLessonCompleted` does not check `progress.status`. This is explicitly documented in `service.test.ts` line 215-246 as "current contract: UI blocks it, state machine allows it."

2. **Lesson uncompletion is NOT blocked when paused** — Same gap.

3. **Lesson skip/unskip have no status guard at all** — Not even in the UI.

4. **Weekly plan events have no status guard** — `weekly_plan_accepted` and `weekly_plan_dismissed` never check status.

5. **`milestone_earned` event has no status guard** — Direct milestone events bypass status checks.

6. **Pause/resume ARE properly guarded** — Via `isValidStatusTransition`.

7. **Unsupported-version blocking is at storage + hook layer** — Both `saveProgramProgress()` and `useProgramService`'s `persistAndNotify` block writes when schema is unsupported. The state machine itself does not know about unsupported schema.

---

## 3. Business Lifecycle States

Defined in `ProgramStatus` (`types.ts:124`):

```
not_started → active → paused → completed
                ↑         ↑         ↑
                └─────────┴─────────┘
                  (resume / reopen)
```

- `not_started` — user has not begun
- `active` — user has started and is working through it
- `paused` — user has explicitly paused
- `completed` — all required lessons completed

Transition table (`PROGRAM_TRANSITIONS`, `types.ts:276`):

- `not_started` → `active`
- `active` → `paused`, `completed`
- `paused` → `active`, `completed`
- `completed` → `active` (reopen)

---

## 4. Storage/Protection States

These are NOT lifecycle states — they're load-time protection states:

- `unsupported-version` — stored schema is newer than supported (forward-schema guard)
- `corrupted` — defined in `ProgramLoadResult` type but **never returned** by `loadProgramProgressResult`

---

## 5. Transient UI States

- `loading` — SSR / not yet hydrated (loadStatus initial value)
- `empty` — no stored progress, fresh initial state
- `ready` — normal load
- `migrated` — data was migrated from legacy schema

---

## 6. `corrupted` State Reachability — Preliminary Finding

`ProgramLoadResult` defines a `corrupted` variant, and `useProgramService` handles it in its `applyLoadResult` switch. `StatusBadge` in `ProgramDashboardCard` renders a corrupted badge.

**However**, tracing `loadProgramProgressResult` in `storage.ts`:

1. Canonical key exists → `migrated` or `ready`
2. Legacy key exists → `migrated`
3. Nothing → `empty`

`migrateLegacyProgress` in `service.ts` handles all inputs:

- `null/undefined` → returns initial progress
- legacy shape → returns migrated progress
- modern shape (with schemaVersion) → validates and returns
- any other object → falls through to return initial progress

**There is no code path that returns `status: "corrupted"`.** The variant exists in the type system but is never produced.

This is Case B: corrupted is NOT reachable in current implementation.

---

## 7. UI Guards for Paused State

Where pause guards exist in the UI:

| Component              | Guard                                             | Mechanism               |
| ---------------------- | ------------------------------------------------- | ----------------------- |
| `LessonTemplate`       | `disabled={... isPaused}` on mark-complete button | HTML disabled attribute |
| `ProgramDashboardCard` | Shows resume CTA instead of next lesson           | Conditional rendering   |
| `ProgramPausedBanner`  | Visible when paused                               | Separate component      |
| `WeekPageTemplate`     | Likely has guards                                 | TBD — verify            |

Where pause guards are MISSING:

- Lesson skip/unskip (if such UI exists)
- Weekly plan acceptance (if such UI exists)

---

## 8. Existing Test Coverage

### State machine tests (`service.test.ts`)

- 30+ tests covering initial state, transitions, lesson completion, milestones, migration
- One test explicitly **documents** that lesson completion works when paused (line 215)
- Pause/resume round-trip tested
- Progress preserved through pause/resume tested

### Integration tests (`integration.test.ts`)

- Storage ↔ state machine round-trip
- Forward-schema guard
- Weekly plan validation
- Sync merge behavior
- Legacy migration
- Export/delete
- Pause/resume round-trip in storage

### Component tests

- Only `time-picker/` has component tests (5 files)
- **No Program component tests exist** — this is a gap

### Total

- 485 tests pass (per Phase G-1 baseline)

---

## 9. Sync and Persistence

- All writes go through `useProgramService.persistAndNotify` → `saveProgramProgress`
- `saveProgramProgress` has a forward-schema guard (never overwrites newer data)
- Custom event `somna-program-progress-change` for in-tab reactivity
- `storage` event for cross-tab reactivity
- Sync queue integration: TBD (check sync-client)

---

## 10. Weekly Focus Lesson Title — Preliminary Finding

The `RelatedLessonCard` in `LessonTemplate` resolves localized titles via `loadLesson()` which imports the full lesson content module. This is lazy-loaded and cached.

The Program definition (`definition.ts`) builds lesson definitions with `titleKey` strings like `program.lesson.<slug>.title`, but there may not be a corresponding i18n registry for these keys. The actual lesson titles live in the lesson content modules (`program-lessons/week-N/*.ts`).

The canonical definition has `titleKey` but whether it's wired to actual translations needs verification.

---

## 11. `pausedAt` — Preliminary Finding

- `ProgramProgress` has `updatedAt` but no dedicated `pausedAt` field
- `ProgramPausedEvent` carries a `timestamp`
- The `handleProgramPaused` handler sets `updatedAt: event.timestamp`
- **No UI currently displays a pause date**
- `updatedAt` is not a stable pause timestamp because it changes on any mutation (lesson completion, etc.)
- This is deferred debt — no migration needed for this hardening task
