# TypeScript Unique Error Baseline — Phase G-0

> Generated: 2026-07-28
> Baseline for: Sleep Diary v2.4.5 → v2.5 (Phase G-0)
> Command: `npx tsc --noEmit` (strict mode)

---

## Executive Summary

| Metric | Count |
|--------|-------|
| Total TypeScript errors | **78** |
| Unique error codes | **11** |
| Files with errors | ~40 |
| **New G-0 files with errors** | **0** |
| Pre-existing errors (before G-0 changes) | ~74 |
| Net change from G-0 | **+4** (see "G-0 Impact Analysis" below) |

---

## Error Breakdown by Code

| Code | Count | Category | Severity | Description |
|------|-------|----------|----------|-------------|
| TS2741 | 17 | Type system | P2 | Property missing in type (dict coverage gaps) |
| TS2739 | 11 | Type system | P2 | Multiple properties missing (partial dict records) |
| TS2322 | 9 | Type system | P2 | Type not assignable (mismatched shapes) |
| TS2345 | 8 | Type system | P2 | Argument type mismatch |
| TS7053 | 7 | Type system | P2 | Implicit any index access (ContentLocale/Lang on partial records) |
| TS2551 | 7 | Naming | P2 | snake_case vs camelCase property name mismatch (AuthModal) |
| TS2352 | 7 | Type system | P3 | Assertion between insufficiently overlapping types (sync DB records) |
| TS7006 | 5 | Implicit any | P3 | Parameter implicitly has 'any' type |
| TS2353 | 4 | Type system | P3 | Unknown property in object literal (reflection-ui 'word' field) |
| TS18048 | 2 | Null safety | P3 | Value is possibly 'undefined' |
| TS2769 | 1 | Overload | P3 | No overload matches call |

---

## Error Categories

### P2 — Real bugs / type mismatches (affect correctness if uncaught at runtime)

**TS2551 (7 errors) — AuthModal snake_case vs camelCase**
- File: `src/components/AuthModal.tsx`
- Accesses `copy.errors.rate_limited`, `copy.errors.unknown_error`, `copy.errors.network_error`
- Actual shape uses `rateLimited`, `unknownError`, `networkError`
- These would be `undefined` at runtime → fallback behavior, not crashes

**TS2741/TS2739 (28 errors) — Partial dict records**
- Pattern: `Record<Lang, T>` or `Record<ContentLocale, T>` dicts don't have all locale entries
- Files: RelaxAudioPlayer, share-image, auth-content, reflection-prompts, notification-service tests, etc.
- Root cause: `Lang` expanded from 4 active locales to 7 supported locales (en, es, pt, pl, de, zh, ja)
- Not runtime-breaking because English fallback exists at runtime
- Fix strategy: Use `{ en: T } & Partial<Record<Lang, T>>` pattern

**TS7053 (7 errors) — Implicit any on locale indexing**
- Pattern: `dicts[contentLocale][key]` where contentLocale is ContentLocale but dicts only has 4 keys
- Files: GuidedReflectionCard, ReflectionHistory, Header, reflection-prompts
- Related to the same dict-coverage gap as above

**TS2322 (9 errors) — Various type mismatches**
- Sync entity conversion (snake_case → camelCase)
- Header: `Lang` not assignable to `Locale` (ContentLocale)
- Reflection validation: locale type narrowing

### P3 — Code quality / style / edge cases

**TS2352 (7 errors) — Sync DB record type assertions**
- Files: sync/db/sleep-records-db.ts, reflections-db.ts, reminders-db.ts
- `Record<string, unknown> → D1SleepRecord` assertions
- These are intentional bridging type gaps between raw DB rows and typed entities
- Could be fixed with proper zod validation or type guards

**TS7006 (5 errors) — Implicit any parameters**
- Files: Header.tsx and others
- `item` parameters in `.map()` callbacks with inferred any
- Low risk, easy fix with explicit types

**TS2353 (4 errors) — Unknown 'word' property in reflection-ui**
- Files: content/*/diary/reflection-ui.ts (en, es, pl, pt-BR)
- All 4 locales have the same extra property
- Suggests `ReflectionUiStrings` type is missing a `word` field

**TS18048 (2 errors) — Possibly undefined**
- Null safety issues from partial dicts

**TS2769 (1 error) — Overload mismatch**
- Reflection validation zod schema parse

---

## G-0 Impact Analysis

### Errors we FIXED (7 eliminated)

1. **7 × TS2307** in `src/locales/de/index.ts` — Orphan file importing 7 nonexistent JSON files. File was dead code, deleted entirely.

### Errors we INTRODUCED indirectly (~11 new)

All from expanding `Lang` / `SupportedLocale` from 4 to 7 locales:
- Dict records typed as `Record<Lang, T>` no longer cover all 7 keys
- Affects: RelaxAudioPlayer, share-image, auth-content, Header, reflection-prompts, etc.

**Net change**: -7 (fixed) + 11 (introduced) = **+4 errors overall**

### New G-0 files: **ZERO errors**

All new files created for Phase G-0 have zero TypeScript errors:
- `src/lib/locale-registry.ts` ✓
- `src/lib/program/types.ts` ✓
- `src/lib/program/service.ts` ✓
- `src/lib/program/storage.ts` ✓
- `src/lib/program/definition.ts` ✓
- `src/lib/program/weekly-plan.ts` ✓
- `src/lib/program/weekly-focus-adapter.ts` ✓
- `src/lib/program/reminder-contract.ts` ✓
- `src/lib/program/sync-contracts.ts` ✓
- All test files (6 files, 165 tests) ✓

---

## Prioritized Fix Roadmap (not for G-0)

### Phase G-1 would address
- Dict record pattern: standardize on `{ en: T } & Partial<Record<SupportedLocale, T>>` across all i18n modules
- Header `Lang` → `ContentLocale` type mismatch
- AuthModal snake_case property names (actual bug)

### Post-G cleanup
- Sync DB type assertions (replace with proper zod validation or type guards)
- Implicit any parameters
- Reflection UI 'word' field
- All remaining TS2322 / TS2345

---

## React Hooks Verification

The one actual React hooks rule violation reported by previous audits has been fixed:

- **File**: `src/components/analytics/WeeklyFocusCard.tsx`
- **Issue**: `useState(false)` called after `if (!focus) return null;` early return → conditional hook
- **Fix**: Moved `useState` before the early return
- **Verification**: `react-hooks/rules-of-hooks` ESLint rule now passes for this file
