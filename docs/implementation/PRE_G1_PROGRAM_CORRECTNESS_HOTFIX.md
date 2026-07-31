# Pre-Phase G-1 Program Correctness Hotfix

> Version: 1.0
> Date: 2026-07-29
> Scope: 2 correctness fixes only — no feature work, no redesign
> Status: Complete

---

## Overview

This hotfix addresses two verified correctness issues identified during Phase G-0.2
final verification, before Phase G-1 feature implementation begins.

1. **completedAt merge semantics** — The sync merge was using `local.completedAt ?? remote.completedAt`
   instead of the semantically correct "earliest valid timestamp wins" rule.
2. **Future-schema user protection** — The storage layer already preserved future-schema
   data, but the UI behaved as if no Program progress existed (empty / not started).

**Principle:** Fix only what's broken. No Program domain redesign. No unrelated
TypeScript debt cleanup. No new Program features.

---

## Fix 1: completedAt Merge Semantics

### Problem

`completedAt` represents the **first confirmed completion time** — when the user
first finished the program. The old merge code:

```typescript
const completedAt =
  status === "completed"
    ? local.completedAt ?? remote.completedAt
    : null;
```

This prefers local when both sides have a value, regardless of which is earlier.
If the user completed the program on device A (Feb 1) and then on device B (Feb 15),
a merge could pick the later date depending on which is "local" in the merge.

### Solution

Added `resolveEarlierTimestamp(a, b)` helper and changed the merge to use it:

```typescript
const completedAt =
  status === "completed"
    ? resolveEarlierTimestamp(local.completedAt, remote.completedAt)
    : null;
```

**Merge truth table:**

| Local | Remote | Result |
|-------|--------|--------|
| `null` | `null` | `null` |
| timestamp | `null` | local |
| `null` | timestamp | remote |
| timestamp A | timestamp B | earlier of A and B |

### Invalid timestamp policy

- Invalid timestamps (fail `Date.parse()`) are treated as `null`
- Invalid timestamps are **never** silently converted to the current time
- If one side has an invalid timestamp, the other side's valid value wins
- If both are invalid, result is `null`
- The original string value is preserved when it is the selected valid value

### Properties verified

- ✅ **Commutative**: `merge(a, b).completedAt === merge(b, a).completedAt`
- ✅ **Idempotent**: merging a value with itself returns same value
- ✅ **Deterministic**: same inputs → same output every time
- ✅ Completed lesson membership still uses set-union semantics (unchanged)
- ✅ No Diary or Reflection sync behavior changes (not touched)

### Files modified

- `src/lib/program/sync-contracts.ts` — Added `resolveEarlierTimestamp()`, updated `mergeLocalAndRemoteProgress()`
- `src/lib/program/sync-contracts.test.ts` — 12 unit tests for `resolveEarlierTimestamp`, 12 integration tests for completedAt in merge

---

## Fix 2: Future-Schema User Protection

### Problem

The forward-schema guard already existed at the storage layer:
- Detected future schema versions
- Preserved raw data
- Blocked writes

But at the UI layer, the unsupported state fell back to `createInitialProgress()`
and displayed as if the user had **never started** the program. This was misleading
and could lead the user to believe their progress was lost.

### Solution

#### Load result contract

Added `ProgramLoadResult` discriminated union to make the load state explicit:

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

New function: `loadProgramProgressResult(definition)` — returns the discriminated union.
Legacy `loadProgramProgress()` is kept for backward compatibility.

#### Service-layer write blocking

All mutation methods in `useProgramService` are **no-ops** when
`loadStatus === "unsupported-version"`:

- `completeLesson` / `uncompleteLesson` / `toggleLesson`
- `pauseProgram` / `resumeProgram`

The `persistAndNotify` callback also returns `false` in this state.
No local state updates happen — the UI cannot show misleading "progress".

#### UI: ProgramUnsupportedBanner

Reusable component at `src/components/program/ProgramUnsupportedBanner.tsx`:

- **Full variant**: Warning banner with icon, title, body, refresh button, version info
- **Compact variant**: One-line warning for Dashboard cards
- **SSR-safe**: renders nothing on the server (prevents hydration mismatch)
- **No raw keys**: all strings are localized
- **English fallback**: via `getProgramLessonUI(lang)` which falls back to English

Localized in all active UI locales: `en`, `zh`, `es`, `pt`, `pl`, `de`.

**Message intent:**
> Your program data was created by a newer version of Somna.
> Your progress is safe, but it cannot be edited in this version.
> Refresh or update the application before continuing.

#### Route behavior

| Route | What changes |
|-------|-------------|
| `/program` | Banner visible. Progress bar, badges, and week completion hidden (not shown as 0% / empty). Week cards locked. Assessment CTA hidden. |
| `/program/week-1` | Banner visible. Lesson links still work (content is readable). |
| `/program/week-1/lesson-id` | Banner visible. Completion toggle disabled. Lesson content still readable. |
| `/dashboard` | Compact banner inside Program card. No crash. No "not started" message. |

### Guarantees

- ✅ Future-schema raw storage is **preserved unchanged**
- ✅ Program writes are **blocked** while unsupported
- ✅ No overwrite or downgrade
- ✅ No "empty progress" display (distinct from real empty state)
- ✅ User-facing warning is shown
- ✅ Navigation away from Program is allowed (banner doesn't block the app)
- ✅ Dashboard does not crash
- ✅ No raw localization keys in rendered output
- ✅ User Program content is **never logged**
- ✅ SSR-safe (banner renders null on server)
- ✅ Hydration stable (first render matches SSR)

### Files modified

- `src/lib/program/storage.ts` — `ProgramLoadResult` type, `loadProgramProgressResult()` function
- `src/lib/program/use-program-service.ts` — `loadStatus` state, write-blocking guard on all actions
- `src/components/program/ProgramUnsupportedBanner.tsx` — **New** reusable banner component
- `src/lib/program-lessons-i18n.ts` — 4 new i18n keys across 6 locales
- `src/routes/program.index.tsx` — Banner integration, disabled actions in unsupported state
- `src/components/program/WeekPageTemplate.tsx` — Banner integration
- `src/components/program/LessonTemplate.tsx` — Banner integration, disabled toggle
- `src/routes/dashboard.tsx` — Compact banner in Program card

---

## Tests Added

| Suite | Tests Added | What they cover |
|-------|------------|-----------------|
| `sync-contracts.test.ts` | 12 | `resolveEarlierTimestamp` unit: both null, each side null, earlier wins, equal, invalid local, invalid remote, both invalid, empty string, timezone equivalents, commutative, idempotent |
| `sync-contracts.test.ts` | 12 | `mergeLocalAndRemoteProgress` completedAt: local earlier, remote earlier, equal, local null, remote null, both null, invalid local, invalid remote, timezone equivalents, commutative, idempotent |
| `storage.test.ts` | 7 | `loadProgramProgressResult`: empty state, ready state, migrated state, unsupported-version detection, raw data preserved, write blocking, no data deletion |
| `integration.test.ts` | 6 | completedAt earliest wins, deterministic merge, commutative merge, lesson completion write-blocked, pause/resume write-blocked, unsupported ≠ empty status |

**Total new tests: 37**

---

## Validation Results

### Tests
```
✓ 28 test files, 481 tests passed
```

### TypeScript

| Scope | Errors | Status |
|-------|--------|--------|
| Repository-wide | 78 | ❌ Pre-existing debt (not introduced by this fix) |
| Modified program files | 0 | ✅ Clean |

Pre-existing errors are in: `AuthModal.tsx`, `Header.tsx`, `RelaxAudioPlayer.tsx`,
reflection modules, sync DB snake_case types, etc. None are in the Program domain.

### Build
```
✓ built in 5.37s
```

### Lint
All errors are pre-existing `prettier/prettier` CRLF line-ending issues from Windows Git.
No semantic lint errors in modified program files.

---

## Remaining Low-Risk Debt

These were identified in Phase G-0.2 and remain unfixed (intentionally, as they
are outside the scope of this correctness hotfix):

1. **Paused status unexposed in UI** — The service layer supports pausing, but
   no UI control exists for users to pause/resume. Tracked for Phase G-1.

2. **Repository-wide TypeScript errors** — 78 errors across reflection, auth,
   header, sync DB, and audio player modules. None in the Program domain.
   Ongoing technical debt.

3. **`corrupted` load status is declared but not reachable** — The
   `ProgramLoadResult` type includes a `corrupted` variant for future use, but
   `loadProgramProgressResult` currently falls back to initial progress on
   malformed data (same as before). If corrupted-state detection is needed,
   it can be added without changing the type contract.

---

## Final Verdict

**✅ PRE-G1 CORRECTNESS HOTFIX VERIFIED**

Both correctness issues are resolved. Tests pass. Build succeeds.
No new debt introduced. Phase G-1 feature work can proceed.
