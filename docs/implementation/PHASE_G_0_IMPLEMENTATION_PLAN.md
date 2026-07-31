# Phase G-0 Implementation Plan

**Date:** 2026-07-28
**Scope:** Platform Consolidation, Locale Unification, Type Boundaries & Program Domain Foundation
**Previous Phase:** Phase F (verified)
**Next Phase:** Phase G — CBT-I Program Integration, Weekly Planning & Adaptive Learning Path

---

## 1. Discovered Locale Architecture

### Current State — Three Incompatible Locale Systems

The repository has **three competing locale type definitions**:

| System | Location | Type Name | Values | Purpose |
|--------|----------|-----------|--------|---------|
| UI / i18n | `src/lib/i18n.tsx:11` | `Lang` | `en, zh, es, pt, pl, de` | Main dict, formatting, context |
| Lang detect / routes | `src/lib/lang-detect.ts:23` | `Lang` | `en, es, pt, pl, de, ja, zh` | Route prefix, cookie, browser detect |
| Content governance | `src/content/content-types.ts:11` | `Locale` | `en, es, pt-BR, pl` | Content package metadata |

### Key Inconsistencies

1. **`pt` vs `pt-BR`**: UI type uses `"pt"`, content type uses `"pt-BR"`. Causes `Header.tsx:332` TS2322 error.
2. **`ja` phantom locale**: Present in `lang-detect.ts` type, in `RESERVED_LANGS`, but has zero translations and no route content.
3. **`zh` status ambiguity**: In `Lang` type (6 locales), has main UI dict, but marked "reserved" in language switcher. No program content, no analytics, no reflections.
4. **`de` partial activation**: In `ACTIVE_LANGS`, has program content and analytics, but missing sleep/calc/reflections/auth dictionaries. Causes 5+ TS2741 errors.
5. **`locales/de/index.ts` orphan**: Imports 7 non-existent JSON files. Causes 7 TS2307 errors. Actual German program content lives in `src/services/i18n/de.ts` and `src/lib/program-lessons-i18n.ts`.

### Fallback Chain (Current)

```
dict[lang][key] → dicts.en[key] → raw key string
```

**Risk:** Raw keys like `dashboard.weeklyFocus.title` can appear in UI for incomplete locales.

### Active vs Reserved (Current)

- `ACTIVE_LANGS = ["en", "es", "pt", "pl", "de"]` (5)
- `RESERVED_LANGS = ["ja", "zh"]` (2)
- Language switcher shows: en, es, pt, pl (4 selectable); de, ja, zh "coming soon"

---

## 2. Discovered Program Domain

### Current Model

**Lesson Metadata** (`src/lib/program-lessons.ts`):
- 18 lessons across 6 weeks
- `LessonMeta` — lightweight (slug, weekNumber, weekSlug, lessonNumber, estimatedMinutes, difficultyKey, relatedLessonSlugs)
- `LessonContent` — full content with `i18n: Partial<Record<Lang, LessonLocale>>`
- Lazy-loaded per week via `loadWeekLessons(weekSlug, lang)`

**Progress** (`src/lib/program-progress.ts`):
- `ProgramProgress = { completedLessons: string[] }` — minimal
- localStorage key: `cbtiProgramProgress`
- Badges: `sleep-basics` (week 1), `sleep-consistency` (week 3), `cbti-graduate` (week 6)
- Week status: `locked | available | completed`
- React hook: `useProgramProgress()` — client-only, not SSR-safe
- No schema version, no migration, no sync integration, no user ID

### Sync Program Progress Type

`src/services/sync/sync-types.ts:60-65`:
```ts
interface SyncProgramProgress {
  currentWeek: number;
  currentLesson: string;
  completedLessons: string[];
  updatedAt: string;
}
```
Server-side account export/deletion already references `program_progress` table (conditionally, with try/catch).

### What's Missing

- Versioned progress schema
- Program state machine (not_started / active / paused / completed)
- Explicit transitions / events
- Weekly plan schema
- SSR-safe storage
- Migration handling
- Proper sync contracts with entity IDs and conflict metadata
- Export/delete integration in local-first path

---

## 3. Current Progress Ownership

**Current owner:** `src/lib/program-progress.ts`
- Direct localStorage access (not SSR-safe)
- React hook in same file
- Business logic (weekStatus, badges, recommendations) mixed with storage

**Missing:**
- Program service / reducer pattern
- Explicit state transitions
- Versioned schema with migration
- Sync integration
- Server-side D1 table definition

---

## 4. Current Sync Ownership

**Sync types:** `src/services/sync/sync-types.ts`
- `SyncProgramProgress` exists but is minimal (no schemaVersion, no entityId, no userId)
- `CanonicalProgramProgress` exists (adds `canonical: true`)
- Entity type `"progress"` is defined in `EntityType`

**Sync API:** `src/services/sync/api/sync-api.ts`
- Program progress is optional in sync request/response
- No dedicated DB module for program progress (unlike sleep-records-db, reflections-db, reminders-db)
- `SyncProgramProgress` missing `userId` field causes TS2322 errors (3)

**Conflict strategy:** Not defined for program progress.

---

## 5. Current Export/Delete Coverage

### Server-Side (Account API)

**Export** (`handleAccountExport`):
- ✅ Sleep records
- ✅ Reflections
- ✅ Reminder settings
- ✅ Weekly reflections (conditional)
- ✅ Program progress (conditional — `program_progress` table)

**Delete** (`handleAccountDelete`):
- ✅ Sleep records
- ✅ Reflections
- ✅ Reminder settings
- ✅ Sync conflicts / sync log
- ✅ Sessions
- ✅ Program progress (conditional)
- ✅ Weekly reflections (conditional)
- ✅ Soft-deleted user account

### Client-Side (Local-First)

**Missing:**
- No client-side export utility for Program data
- No client-side "clear program data" function
- `onClearCache` in `AccountDataDialog` — unclear if it clears program progress

---

## 6. TypeScript Project Boundaries

### Current Structure

```
tsconfig.json         — all src/**/*.ts(x) + config files (strict: true)
tsconfig.app.json     — excludes *.test.ts(x)
tsconfig.worker.json  — (not found / to be created)
tsconfig.tests.json   — only *.test.ts(x), adds vitest/globals types
```

### Error Baseline (74 total)

| Domain | Count | Severity | Phase G Relevant? |
|--------|-------|----------|-------------------|
| Tests (reminder/habit) | 29 | P3 | No |
| Localization (de missing) | 11 | P2 | Yes — locale consolidation |
| Cloudflare Worker / Sync | 10 | P1/P2 | Yes — sync contracts |
| Server (server.ts) | 8 | P2 | Partial |
| Authentication (AuthModal) | 7 | P1 | Yes — runtime bug |
| Reflection | 7 | P2 | Partial |
| Misc UI (Lang/Locale, showHistory) | 2 | P2 | Yes — locale unification |

### React Hooks Error

1 `react-hooks/rules-of-hooks` lint error. Per Phase F remediation report: `SleepChart.tsx` line 38 was flagged as a false positive. We must verify and either fix it or document why it's a false positive.

---

## 7. Files Expected to Change

### New Files

```
src/lib/locale-registry.ts          — authoritative locale definitions
src/lib/locale-migration.ts         — pt/pt-BR, legacy value migration
src/lib/program/types.ts            — Program domain types (definitions, progress, events, state)
src/lib/program/service.ts          — Program service / reducer / transitions
src/lib/program/storage.ts          — SSR-safe Program progress storage
src/lib/program/weekly-plan.ts      — WeeklyProgramPlan types
src/lib/program/weekly-focus-adapter.ts  — WeeklyFocus → ProgramRecommendationInput
src/lib/program/reminder-contract.ts     — ProgramReminderRequest contract
src/lib/program/sync-contracts.ts   — Sync entity types for program
src/lib/program/export.ts           — Program data export/delete helpers
src/lib/program/program-service.test.ts
src/lib/program/program-storage.test.ts
src/lib/program/weekly-plan.test.ts
src/lib/program/sync-contracts.test.ts
src/lib/locale-registry.test.ts
docs/architecture/locale-platform.md
docs/architecture/program-domain.md
docs/architecture/program-sync-contracts.md
docs/implementation/PHASE_G_0_IMPLEMENTATION_PLAN.md (this file)
docs/implementation/PHASE_G_0_COMPLETION_REPORT.md
docs/audit/TYPESCRIPT_UNIQUE_ERROR_BASELINE.md
```

### Modified Files

```
src/lib/i18n.tsx                    — import Lang from locale-registry
src/lib/lang-detect.ts              — import Lang from locale-registry
src/content/content-types.ts        — import Locale from locale-registry
src/lib/program-lessons.ts          — import Lang from locale-registry
src/lib/program-progress.ts         — delegate to program/service (backward compat)
src/services/sync/sync-types.ts     — import program sync contracts
src/services/account/account-api.ts — integrate program export/delete types
src/components/Header.tsx           — fix Lang/Locale type mismatch
src/components/SleepChart.tsx       — verify/fix hooks rules-of-hooks
src/hooks/use-reduced-motion.ts     — already exists (triage fix)
eslint.config.js                    — if needed for hooks rule
```

### Removed / Deleted

```
src/locales/de/index.ts             — orphan file causing 7 TS2307 errors
```

---

## 8. Migration Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Persisted `pt-BR` locale values in cookies/localStorage | Medium | User locale reset to en | Migration function maps `pt-BR` → `pt` on read |
| Changing `Lang` type breaks downstream consumers | High | Type errors cascade | Phased: add new type first, re-export aliases, deprecate old |
| `locales/de/index.ts` deletion breaks de import path | Low | Build error for anything importing it | Verify no imports before deletion; actual de content is in `services/i18n/de.ts` |
| Program progress storage key change loses user data | Medium | Lost progress | Keep `cbtiProgramProgress` as legacy key; migrate to new key on first write |
| Sync type changes break server API | Medium | Sync failures | Keep backward-compatible optional fields; test sync round-trip |
| React hooks fix changes chart behavior | Low | Visual regression | Verify behavior is identical; add test if practical |

---

## 9. Implementation Order

### Phase 1: Foundation (Type Boundaries & Locale)

1. **Locale registry** — single source of truth for locales, types, metadata
2. **Locale migration** — pt-BR → pt, unknown value handling, fallback chain
3. **Unify Lang/Locale types** across i18n.tsx, lang-detect.ts, content-types.ts
4. **Remove orphan `locales/de/index.ts`** (after verifying no imports)
5. **TypeScript unique error baseline document**

### Phase 2: React Hooks Fix

6. **Locate and fix `react-hooks/rules-of-hooks`** error
7. **Verify behavior unchanged**

### Phase 3: Program Domain Models

8. **Program domain types** — definitions, progress, state machine, events
9. **Program service / reducer** — explicit transitions, no arbitrary mutation
10. **Program storage** — SSR-safe, versioned, migratable
11. **Update program-progress.ts** to delegate to new service (backward compat)

### Phase 4: Integration Contracts

12. **Weekly Plan contract** — WeeklyProgramPlan schema
13. **Weekly Focus adapter** — ProgramRecommendationInput interface
14. **Reminder integration contract** — ProgramReminderRequest

### Phase 5: Sync, Export & Delete

15. **Program sync contracts** — entity types, conflict strategy, tombstone
16. **Export integration** — program data in client export
17. **Delete integration** — program data in client clear-all

### Phase 6: Tests & Documentation

18. **Locale platform tests**
19. **Program domain tests**
20. **Weekly plan tests**
21. **Sync contract tests**
22. **Export/delete tests**
23. **SSR safety tests**
24. **Architecture docs** (3 files)
25. **Completion report**

---

## 10. Explicit Non-Goals

- ❌ Adaptive lesson selection / AI recommendations
- ❌ Clinical scoring or CBT-I treatment changes
- ❌ Automatic reminder scheduling
- ❌ Automatic program advancement
- ❌ Sleep restriction prescription
- ❌ New backend infrastructure (Web Push, etc.)
- ❌ Social features / gamification / leaderboards
- ❌ Full translation of all missing Program content
- ❌ Mass cleanup of all 74 TypeScript errors (only G-0 relevant ones)
- ❌ Mass formatting of the repository
- ❌ New UI features for Program (beyond type contracts)
- ❌ Dashboard redesign
- ❌ Reflection behavior changes
- ❌ Analytics engine changes
