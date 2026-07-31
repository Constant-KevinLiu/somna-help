# Phase G-0 Completion Report

> Platform Consolidation, Locale Unification, Type Boundaries & Program Domain Foundation
> Version: 1.0
> Date: 2026-07-28
> Status: **GO FOR PHASE G — all 10 objectives met**

---

## Final Verdict

### ✅ **G-0-READY — Phase G can proceed**

All 10 objectives are met. New code has zero TypeScript errors, 165 new tests all pass, build succeeds, and the program domain foundation is complete with clear ownership boundaries.

---

## 1. Authoritative Locale Architecture

**Status: ✅ Complete**

- Created `src/lib/locale-registry.ts` — single source of truth for all locale concerns
- 7 `SUPPORTED_LOCALES`: en, es, pt, pl, de, zh, ja
- Tiered system: 4 ACTIVE + 1 PARTIAL (de) + 2 RESERVED (zh, ja)
- `LOCALE_REGISTRY` with full `LocaleDefinition` objects (htmlLang, hreflang, direction, contentLocale, fallbackLocale, status, enabled)
- `normalizePersistedLocale()` handles pt-BR → pt, case variations, prefix matching, legacy tags
- `resolveTranslation()` with 4-tier fallback: requested → feature fallback → English → `safeKeyFallback()`
- `safeKeyFallback()` converts dotted keys to human-readable form (never shows raw keys)
- Type guards: `isSupportedLocale`, `isActiveLocale`, `isPartialLocale`, `isReservedLocale`
- 7-entry `LEGACY_LOCALE_MAP` for full-region tag migration

**Integrated into**:
- `src/lib/i18n.tsx` — `Lang = SupportedLocale` (deprecated alias), `t()` uses `resolveTranslation()`
- `src/lib/lang-detect.ts` — `ACTIVE_LANGS = ACTIVE_LOCALES`, detection uses `normalizePersistedLocale()`
- `src/content/content-types.ts` — `ContentLocale` type, `uiLocaleToContentLocale()`

## 2. Trustworthy TypeScript Project Boundaries

**Status: ✅ Complete**

- `SupportedLocale` is the authoritative UI locale type (from locale-registry)
- `ContentLocale` is the content-specific type (may differ: pt vs pt-BR)
- Deprecated aliases exist for backward compatibility (`Lang`, `Locale`)
- Dict records use `{ en: T } & Partial<Record<Lang, T>>` pattern — English always present, other locales optional (matches reality)
- Clear UI vs content locale separation with explicit mapping function
- `program/` directory is a self-contained domain with zero dependencies on UI components or routing

## 3. Unique TypeScript Error Baseline

**Status: ✅ Complete**

Document: `docs/audit/TYPESCRIPT_UNIQUE_ERROR_BASELINE.md`

- 78 total TS errors (11 unique error codes across ~40 files)
- **New G-0 files: 0 errors**
- Net change from G-0: +4 errors (removed 7 orphan file errors, added 11 from Lang type expansion)
- Categorized by severity: P2 (real bugs / type mismatches) vs P3 (code quality)
- React hooks violation fixed: `WeeklyFocusCard.tsx` (moved useState before early return)
- 7 TS2307 errors eliminated by deleting orphan `locales/de/index.ts`
- Prioritized fix roadmap documented for future phases

## 4. Typed Program Domain Model

**Status: ✅ Complete**

File: `src/lib/program/types.ts`

- `ProgramId = "cbti-core"` (literal type, extensible)
- `ProgramDifficulty`: beginner / intermediate / advanced
- `ProgramLessonTag`: 8 tags (education, habit, stimulus-control, sleep-restriction, relaxation, cognitive, maintenance, assessment)
- `ProgramDefinition`, `ProgramWeekDefinition`, `ProgramLessonDefinition` — all use i18n keys, no hard-coded strings
- `ProgramStatus`: not_started | active | paused | completed
- `ProgramProgress` — versioned (schemaVersion:1), with completedLessonIds, skippedLessonIds, acceptedPlanIds, dismissedRecommendationIds, milestones, updatedAt
- `ProgramEvent` union — 11 event types for full lifecycle
- `PROGRAM_TRANSITIONS` state transition rules
- Pure derived functions: calculateOverallCompletion, calculateWeekCompletion, getWeekAccessStatus, getRecommendedNextLesson

## 5. Program Progress Ownership

**Status: ✅ Complete**

File: `src/lib/program/service.ts`

- Pure event-sourced state machine: `applyEvent(progress, event, definition)`
- 11 individual event handlers, all idempotent
- Auto-starts program on first lesson completion
- Milestone auto-earning on week completion (3 milestones: sleep-basics, behavior-change, program-completed)
- Milestones are revocable (un-completing a week revokes its milestone)
- Auto-completes program when all lessons done
- Re-opens from completed → active when a lesson is un-marked
- Legacy migration: `isLegacyProgress()` + `migrateLegacyProgress()` for v0 → v1
- Legacy key: `"cbtiProgramProgress"` → canonical: `"somna:program-progress:v1"`

## 6. Program Sync Contracts

**Status: ✅ Complete**

File: `src/lib/program/sync-contracts.ts`

- `SyncProgramProgress` + `CanonicalProgramProgress` (userId: never, canonical: true marker)
- `SyncWeeklyProgramPlan` + `CanonicalWeeklyProgramPlan` with tombstone support
- Serialization: `toSyncProgress()`, `fromCanonicalProgress()` — full round-trip integrity
- Merge functions:
  - `mergeCompletedLessons` — set union (additive only, never undoes)
  - `resolveStatusConflict` — most advanced wins (completed > active ≡ paused > not_started)
  - `mergeMilestones` — union with earlier timestamp
  - `resolveCurrentWeekId` — LWW (last-write-wins)
- `mergeLocalAndRemoteProgress()` — deterministic anonymous → authenticated merge
- All merge strategies documented and tested
- No Diary data corruption — program data is completely separate

## 7. Program Export/Delete Ownership

**Status: ✅ Complete**

- Client-side: `exportProgramData(definition)` in `storage.ts` returns `{ version, progress, plans, exportedAt }`
- Client-side: `deleteAllProgramData()` clears all program localStorage keys
- Client cache clear: `IdentityMenu.tsx` `handleClearCache()` now calls `deleteAllProgramData()` via dynamic import
- Server-side already had program_progress in account export + delete flows (pre-existing)
- Program data is fully accounted for in both export and delete flows

## 8. Program Localization Contracts

**Status: ✅ Complete**

- All display strings in program domain use i18n key references (no hard-coded strings)
- `ProgramDefinition` fields: `titleKey`, `descriptionKey`, week `titleKey`/`summaryKey`, lesson `titleKey`/`summaryKey`
- `ProgramMilestone` has `titleKey` and `descriptionKey`
- `WeeklyProgramPlan` has `reasonKey` for explanation text
- `ProgramReminderRequest` includes `locale` and `reasonKey` for cross-module messaging
- Fallback chain ensures never showing raw dotted keys

## 9. Phase G Dependency Test Foundations

**Status: ✅ Complete**

165 new tests across 6 test files:

| Test File | Tests | Coverage |
|-----------|-------|----------|
| `locale-registry.test.ts` | 52 | Lists, registry, guards, pt/pt-BR migration, normalization, safe fallback, resolveTranslation, LEGACY_LOCALE_MAP |
| `program/service.test.ts` | 38 | Initial state, status transitions, lifecycle events, lesson completion idempotency, milestone auto-earning, uncomplete, skip/unskip, derived values, migration |
| `program/storage.test.ts` | 12 | Load/save/clear, legacy migration, malformed JSON, export, delete |
| `program/definition.test.ts` | 19 | Real definition validation, duplicate IDs, contiguous order, week references, related lessons, prerequisites |
| `program/weekly-plan.test.ts` | 20 | Validation (lesson IDs, acceptance subset, full plan), storage CRUD, malformed data |
| `program/sync-contracts.test.ts` | 24 | Serialization round-trip, merge strategies, LWW, milestone merge, full anonymous→authenticated merge |

**Full test suite: 397/397 passed** (no regressions)

## 10. Final Phase G Readiness Verdict

**Status: ✅ Phase G can proceed**

All foundational infrastructure is in place:
- ✅ One locale authority to build upon
- ✅ Typed program domain with state machine
- ✅ Event-sourced progress (auditable, testable)
- ✅ Sync contracts with deterministic merge
- ✅ Weekly plan contract (Phase G will generate plans)
- ✅ Weekly focus adapter (Phase F data → Phase G input)
- ✅ Reminder boundary (hard boundary, no auto-scheduling)
- ✅ Export/delete ownership defined
- ✅ SSR-safe persistence
- ✅ Test foundations (165 tests, all passing)
- ✅ Zero TS errors in new code
- ✅ Build succeeds

---

## Validation Results

| Command | Result | Notes |
|---------|--------|-------|
| `npm test` | ✅ 397/397 passed | 27 test files, 0 failures |
| `npx tsc --noEmit` | ⚠️ 78 errors total | **0 errors in new G-0 files** |
| `npm run lint` | ⚠️ CRLF issues | 0 non-CRLF errors in new files |
| `npm run build` | ✅ Built in 4.22s | Client + server build succeed |

---

## New Files Created (13)

```
src/lib/locale-registry.ts              ← Authoritative locale registry
src/lib/locale-registry.test.ts         ← 52 tests
src/lib/program/types.ts                ← Program domain types
src/lib/program/service.ts              ← Event-sourced state machine
src/lib/program/storage.ts              ← SSR-safe persistence + export/delete
src/lib/program/definition.ts           ← Adapter from lessonMetas
src/lib/program/weekly-plan.ts          ← Weekly plan contract + storage
src/lib/program/weekly-focus-adapter.ts ← WeeklyFocus → Program input
src/lib/program/reminder-contract.ts    ← Program ↔ Reminder boundary
src/lib/program/sync-contracts.ts       ← Sync types + merge strategies
src/lib/program/service.test.ts         ← 38 tests
src/lib/program/storage.test.ts         ← 12 tests
src/lib/program/definition.test.ts      ← 19 tests
src/lib/program/weekly-plan.test.ts     ← 20 tests
src/lib/program/sync-contracts.test.ts  ← 24 tests
docs/audit/TYPESCRIPT_UNIQUE_ERROR_BASELINE.md
docs/architecture/locale-platform.md
docs/architecture/program-domain.md
docs/architecture/program-sync-contracts.md
```

## Modified Files (9)

```
src/lib/i18n.tsx               ← Uses locale registry, resolveTranslation fallback
src/lib/lang-detect.ts         ← Uses locale registry for detection/validation
src/content/content-types.ts   ← ContentLocale type, uiLocaleToContentLocale()
src/lib/calc-i18n.ts           ← Dict type: Partial record with English baseline
src/lib/sleep-i18n.ts          ← Dict type: Partial record with English baseline
src/components/IdentityMenu.tsx ← Program data in clear-cache flow
src/components/analytics/WeeklyFocusCard.tsx ← Fixed react-hooks rule violation
src/locales/de/index.ts        ← DELETED (orphan file causing 7 TS2307 errors)
```

---

## Non-Goals Confirmation

None of these were implemented (as explicitly required):

- ❌ Adaptive lesson selection / AI recommendations
- ❌ Clinical scoring / CBT-I treatment changes
- ❌ Automatic reminder scheduling
- ❌ Automatic program advancement
- ❌ Sleep restriction prescription
- ❌ Clinician portal
- ❌ New backend infrastructure
- ❌ Web Push / social features / gamification
- ❌ Full translation of missing program content
- ❌ Mass cleanup of all 78 TypeScript errors
- ❌ Mass formatting of repository

---

## Known Gaps for Phase G

1. **Weekly plan generation logic** — Contract exists, but actual adaptive recommendation is Phase G
2. **Sync endpoint integration** — Types exist, but wiring into actual sync API is Phase G work
3. **UI for program progress** — Domain model exists; UI components are Phase G
4. **Server-side program table schema** — Try/catch fallback exists for legacy table; proper schema is Phase G
5. **Dict coverage for de/zh/ja** — Type system handles partial coverage gracefully; content translation is separate work

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Lang type expansion breaks more files | Low | Medium | Already fixed main i18n modules; remaining errors are in peripheral files |
| Legacy migration data loss | Low | High | Migration tested; canonical key written on first load; legacy key never modified |
| Merge conflict data loss | Very Low | High | Union strategy for all additive fields; tested extensively |
| SSR hydration mismatch | Low | Medium | All storage uses safe-storage utilities; initial state is deterministic |

---

## Recommendation

**PROCEED TO PHASE G.** The foundation is solid, well-tested, and all ownership boundaries are clearly defined. Phase G teams can build on top of these contracts without modifying core domain code.
