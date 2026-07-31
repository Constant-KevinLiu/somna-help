# Phase G-1.1: Program Lifecycle Hardening — Implementation Report

**Date:** 2026-07-30
**Phase:** G-1.1 (hardening, no feature expansion)
**Previous:** Phase G-1 (Program Experience)
**Next:** Phase G-2 (Feature Expansion) — NOT started

---

## 1. Overview

Phase G-1.1 closes critical lifecycle-integrity gaps in the Program system. The primary deliverable is **enforced paused-state mutation rules in the canonical state machine** — previously, pause was only enforced at the UI level (disabled buttons). A motivated attacker or bug could bypass UI guards and mutate progress while paused.

This release also adds typed blocked-result propagation, comprehensive regression tests, a `corrupted`-state reachability audit, and resolution of the Weekly Focus lesson-title localization gap.

**Scope:**
- Canonical state machine enforcement
- Typed mutation results through service → hook → UI
- UI-level disabled behavior preserved as supplementary guards
- Component-level regression tests (5 files, 40 tests)
- `corrupted`-state reachability audit
- Weekly Focus lesson-title gap resolution
- `pausedAt` field decision documentation

**Explicitly NOT in scope:**
- Phase G-2 feature expansion
- Program experience redesign
- Database migration
- Destructive recovery behavior for corrupted data
- New Program service or state machine replacement

---

## 2. Core Hardening: Paused-State Mutation Enforcement

### 2.1 The Gap (Pre G-1.1)

Before this release, `program_paused` set the status to `paused`, but the state machine did **not** prevent progress-mutation events from being applied while paused. Lesson completion, skipping, plan acceptance, and milestone events all mutated progress regardless of pause status.

Pause enforcement existed **only at the UI level** via disabled buttons. This meant:
- A race condition or stale component could dispatch a completion during pause
- Direct `applyEvent()` callers (tests, future APIs) could bypass the guard
- The state machine's invariant — "paused means no progress changes" — was not enforced

### 2.2 The Fix

Added `isMutationAllowed(progress)` guard to the state machine:

```
isMutationAllowed(progress): progress.status !== "paused"
```

This guard is applied to all **progress-mutation events** but NOT to **lifecycle events**:

| Event Type | Guard | Reason |
|---|---|---|
| `lesson_completed` | `isMutationAllowed` | Progress mutation |
| `lesson_uncompleted` | `isMutationAllowed` | Progress mutation |
| `lesson_skipped` | `isMutationAllowed` | Progress mutation |
| `lesson_unskipped` | `isMutationAllowed` | Progress mutation |
| `weekly_plan_accepted` | `isMutationAllowed` | Progress mutation |
| `weekly_plan_dismissed` | `isMutationAllowed` | Progress mutation |
| `milestone_earned` | `isMutationAllowed` | Progress mutation |
| `program_started` | `isValidStatusTransition` | Lifecycle transition |
| `program_paused` | `isValidStatusTransition` | Lifecycle transition |
| `program_resumed` | `isValidStatusTransition` | Lifecycle transition |
| `program_completed` | `isValidStatusTransition` | Lifecycle transition |

### 2.3 Why Two Separate Guards

Lifecycle transitions follow the state-transition graph (`not_started → active → paused ↔ active → completed`). Progress mutations are blocked entirely during pause, regardless of transition validity.

This separation makes the invariant explicit: **pause freezes all progress changes. Only resume (a lifecycle action) unfreezes them.**

---

## 3. Typed Mutation Results

### 3.1 `ProgramMutationResult` (Service Layer)

The canonical `applyEvent()` function now returns a discriminated union instead of `ProgramProgress`:

```typescript
export type ProgramMutationResult =
  | { status: "applied"; progress: ProgramProgress }
  | { status: "blocked"; reason: ProgramMutationBlockReason; progress: ProgramProgress }
  | { status: "unchanged"; progress: ProgramProgress };
```

**Block reasons:**
- `"program-paused"` — progress mutation attempted while paused
- `"program-completed"` — (reserved for future use)
- `"unsupported-version"` — (returned by hook layer, not state machine)
- `"invalid-transition"` — lifecycle event with invalid status transition

**Key properties:**
- `blocked` and `unchanged` both return the **same progress reference** (identity-preserving)
- `applied` returns a new progress object
- No persistence happens on `blocked` or `unchanged`

### 3.2 `ProgramActionResult` (Hook Layer)

`useProgramService` methods now return results instead of `void`:

```typescript
export type ProgramActionResult =
  | { status: "applied"; progress: ProgramProgress }
  | { status: "blocked"; reason: ProgramMutationBlockReason; progress: ProgramProgress }
  | { status: "unchanged"; progress: ProgramProgress }
  | { status: "unsupported-version" };
```

Write behavior:
- `"applied"` → persist to storage + dispatch change event
- `"blocked"` | `"unchanged"` → no write, no event
- `"unsupported-version"` → no write (forward-schema guard)

### 3.3 UI Layer

UI components continue to use disabled buttons as supplementary guards. The typed return values are available for callers that need to react to blocked actions (e.g., toast notifications, analytics tracking).

---

## 4. Lifecycle States — Clarification

### 4.1 Business States (User-Facing)

These are the canonical program lifecycle states:

| State | Meaning |
|---|---|
| `not_started` | User has not started the program |
| `active` | Program is in progress |
| `paused` | Program is paused — no progress mutations allowed |
| `completed` | All lessons completed |

### 4.2 Storage/Load States (Infrastructure)

These describe the result of loading progress from storage, NOT the program's lifecycle:

| State | Meaning |
|---|---|
| `empty` | No progress found (first visit) |
| `ready` | Progress loaded successfully |
| `migrated` | Legacy data migrated to current schema |
| `unsupported-version` | Stored schema is newer than supported (forward-guard) |
| `corrupted` | **Defined but never returned** — see Section 5 |

### 4.3 Transient UI States (Presentation)

These are UI-level states that don't exist in the state machine:

| State | Meaning |
|---|---|
| `loading` | Hydration in progress (SSR → client handoff) |
| `error` | UI-level error display (no canonical equivalent) |

---

## 5. `corrupted` State Reachability Audit

### Finding: **Case B — Not Reachable**

The `corrupted` status is defined in `ProgramLoadResult` and `UnsupportedProgramSchema` types but is **never returned** by any code path.

### Evidence

1. **`loadProgramProgressResult()`** has 4 return paths:
   - Canonical key present → schema check → `unsupported-version` or `ready`/`migrated`
   - Legacy key present + valid → `migrated`
   - Nothing found → `empty`
   - No path returns `corrupted`

2. **`safeLocalStorageGet()`** returns default value (`null`) on JSON parse error. The null then falls through to the "empty" path.

3. **`migrateLegacyProgress()`** always returns a valid `ProgramProgress`. Even if the input is malformed, it falls back to `createInitialProgress()`.

### Implications

- `corrupted` is forward-looking design debt, not a bug
- No destructive recovery behavior exists (by design — we never silently delete user data)
- The UI should not need to handle `corrupted` specially; it's handled as `empty`
- If a future release needs corrupted detection, it should be added intentionally with a clear recovery policy

---

## 6. `pausedAt` Field Decision

### Decision: **Deferred**

`pausedAt` is not currently a field on `ProgramProgress`. We add the following analysis for future reference:

### Arguments For
- Consistency with `startedAt`/`completedAt` pattern
- Useful for analytics (how long were users paused?)
- Could be shown in UI ("Paused since July 15")

### Arguments Against
- No current consumer (UI doesn't show it, analytics don't track it)
- Schema change = migration concern (even additive)
- Can be approximated from `updatedAt` when status is `paused` (imperfect but sufficient for now)
- In a fully event-sourced system, would be derived from event history

### When to Revisit
When a specific use case justifies the schema change:
- Analytics requirement for pause duration tracking
- UI design calls for "Paused since X" display
- Sync/merge logic needs precise pause timestamp

---

## 7. Weekly Focus Lesson-Title Gap

### The Gap

The `ProgramWeeklyFocusSection` component displayed related lessons as "Lesson 2" (number-only) instead of the actual localized lesson title. The title was available in `program-lessons-content/` but not wired up.

### The Fix

Extracted the existing `useRelatedLessonTitle` hook from `LessonTemplate.tsx` into a shared `useLessonTitle` hook at `src/hooks/use-lesson-title.ts`, and applied it to the Weekly Focus section.

**Files changed:**
- `src/hooks/use-lesson-title.ts` (new) — shared hook with module-level cache
- `src/components/program/LessonTemplate.tsx` — replaced local hook with shared import
- `src/components/program/ProgramWeeklyFocusSection.tsx` — now shows localized lesson title

**Behavior:**
- Title loads asynchronously on first render
- Falls back to "Lesson N" while loading (same as before)
- Module-level cache prevents duplicate loads across components
- No layout shift — text updates in-place once loaded

---

## 8. Test Coverage

### 8.1 State Machine Unit Tests

**File:** `src/lib/program/service.test.ts`
**Total:** 54 tests
**New (G-1.1):** ~15 paused-state enforcement tests

Coverage:
- All 7 progress-mutation events blocked when paused
- Lifecycle events (pause/resume) work correctly
- Idempotent events return `unchanged`
- Blocked results preserve progress reference identity

### 8.2 Integration Tests

**File:** `src/lib/program/integration.test.ts`
**Total:** 44 tests
**New (G-1.1):** 10 paused-state enforcement tests

Full end-to-end flow:
```
start → complete lesson → pause → reload →
blocked completion attempt → resume → complete → reload → persisted
```

### 8.3 Component Regression Tests

All tests use React Testing Library + jsdom + jest-dom matchers.

| Component | Tests | Key Coverage |
|---|---|---|
| `ProgramPausedBanner` | 8 | Full + compact variants, role=status, onResume callback |
| `ProgramStartCard` | 4 | Not-started copy, start CTA, structure info, heading level |
| `PauseConfirmDialog` | 7 | Open/close, cancel, confirm, Escape, aria attributes |
| `ProgramCompletionSummary` | 6 | Completion copy, review action, no medical claims, no restart, lessons count, week links |
| `ProgramDashboardCard` | 20 | All 5 lifecycle states (not-started/active/paused/completed/unsupported), loading state, handler invocation |

**Total component tests: 40**

---

## 9. Files Changed

### Core Logic
- `src/lib/program/types.ts` — added `ProgramMutationBlockReason`, `ProgramMutationResult`
- `src/lib/program/service.ts` — `applyEvent()` returns `ProgramMutationResult`, paused-state guard
- `src/lib/program/use-program-service.ts` — action methods return `ProgramActionResult`

### Tests
- `src/lib/program/service.test.ts` — updated for new return type + pause enforcement tests
- `src/lib/program/integration.test.ts` — updated + 10 new integration tests
- `src/components/program/ProgramPausedBanner.test.tsx` (new)
- `src/components/program/ProgramStartCard.test.tsx` (new)
- `src/components/program/PauseConfirmDialog.test.tsx` (new)
- `src/components/program/ProgramCompletionSummary.test.tsx` (new)
- `src/components/program/ProgramDashboardCard.test.tsx` (new)

### Weekly Focus Title Gap
- `src/hooks/use-lesson-title.ts` (new) — shared async lesson title hook
- `src/components/program/LessonTemplate.tsx` — uses shared hook
- `src/components/program/ProgramWeeklyFocusSection.tsx` — now shows localized title

### Documentation
- `docs/implementation/PHASE_G_1_1_CURRENT_STATE_AUDIT.md` — pre-implementation audit
- `docs/implementation/PHASE_G_1_1_PROGRAM_LIFECYCLE_HARDENING.md` — (this file)

---

## 10. Remaining Debt (Low Risk)

### 10.1 `corrupted` Status Dead Code
The `corrupted` variant in `ProgramLoadResult` is never returned. It's not harmful (just a type branch) but adds cognitive overhead. **Action:** Remove in a future cleanup, or implement actual corrupted detection with a clear non-destructive policy.

### 10.2 No UI Feedback on Blocked Actions
When a lesson completion is blocked by pause (shouldn't happen in normal flow since buttons are disabled), there's no user-facing feedback. The action silently does nothing. **Action:** Add a toast or status message if/when blocked-action telemetry shows this happening in production.

### 10.3 `pausedAt` Field Absence
No `pausedAt` timestamp on progress. See Section 6. **Action:** Add when a specific use case justifies it.

---

## 11. Verification Checklist

- ✅ State machine enforces pause on all 7 progress-mutation events
- ✅ Typed blocked results propagate through service → hook
- ✅ UI disabled buttons remain as supplementary guards
- ✅ No persistence on blocked/unchanged results
- ✅ Forward-schema guard preserved
- ✅ 40 component regression tests, all passing
- ✅ 54 state machine unit tests, all passing
- ✅ 44 integration tests, all passing
- ✅ `corrupted` reachability confirmed: Case B (not reachable)
- ✅ Weekly Focus lesson-title gap resolved
- ✅ `pausedAt` decision documented
- ✅ No Phase G-2 feature expansion
- ✅ No Program service replacement
- ✅ No destructive data recovery
- ✅ No database migration
- ✅ All writes go through canonical state machine
- ✅ No UI directly accesses storage
