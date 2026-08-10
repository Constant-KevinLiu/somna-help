# Phase G-1 Current-State Audit

Date: 2026-07-30

Baseline: 481 tests passing, production build succeeds, Program domain zero TypeScript errors.

## 1. Executive Summary

The CBT-I Program foundation (Phase G-0, G-0.1, G-0.2, and the Pre-G1 Program Correctness Hotfix) is complete and production-ready. The canonical Program architecture — routes, service, state machine, storage, sync contracts, definition, templates, and hooks — is in place. Phase G-1 will build the user experience on top of this foundation without redesigning or replacing it.

## 2. Architecture Reuse Matrix

| Component                           | Status              | Key Files                                                                                              | Reuse Plan                                                                      |
| ----------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| **Program Routes**                  | ✅ Production-ready | `src/routes/program.index.tsx`, `src/routes/program.$slug.tsx`, `src/routes/program.$week.$lesson.tsx` | Enhance program.index with lifecycle states                                     |
| **useProgramService Hook**          | ✅ Production-ready | `src/lib/program/use-program-service.ts`                                                               | Primary data entry — no changes to core logic                                   |
| **Program Service (State Machine)** | ✅ Production-ready | `src/lib/program/service.ts`                                                                           | All writes pass through here                                                    |
| **Program Storage**                 | ✅ Production-ready | `src/lib/program/storage.ts`                                                                           | No changes — forward-schema guard intact                                        |
| **Program Definition**              | ✅ Production-ready | `src/lib/program/definition.ts`                                                                        | Source of weeks/lessons/tags                                                    |
| **Progress Selectors**              | ✅ Production-ready | `src/lib/program/types.ts`                                                                             | `calculateOverallCompletion`, `getWeekAccessStatus`, `getRecommendedNextLesson` |
| **WeekPageTemplate**                | ✅ Production-ready | `src/components/program/WeekPageTemplate.tsx`                                                          | Enhance with pause/state awareness                                              |
| **LessonTemplate**                  | ✅ Production-ready | `src/components/program/LessonTemplate.tsx`                                                            | Enhance with pause/state awareness                                              |
| **ProgramUnsupportedBanner**        | ✅ Production-ready | `src/components/program/ProgramUnsupportedBanner.tsx`                                                  | Reuse as-is                                                                     |
| **Dashboard Program Card**          | ⚠️ Partial (inline) | `src/routes/dashboard.tsx` `ProgramProgressCard()`                                                     | Enhance with lifecycle states, may extract to component                         |
| **Weekly Focus System**             | ✅ Production-ready | `src/lib/analytics/weekly-focus.ts`                                                                    | Connect explainable focus to Program UX                                         |
| **Weekly Focus Adapter**            | ✅ Production-ready | `src/lib/program/weekly-focus-adapter.ts`                                                              | Stable contract — use as-is                                                     |
| **Locale Registry**                 | ✅ Production-ready | `src/lib/locale-registry.ts`                                                                           | Active locales: en, es, pt, pl                                                  |
| **Program i18n (UI Chrome)**        | ✅ Production-ready | `src/lib/program-lessons-i18n.ts`                                                                      | Extend with lifecycle state keys                                                |
| **Pause/Resume Events**             | ✅ Production-ready | `src/lib/program/service.ts`                                                                           | Expose in UI                                                                    |
| **Tests**                           | ✅ 481 passing      | `src/lib/program/*.test.ts`                                                                            | Extend with new selectors and component tests                                   |

## 3. Exact Interfaces to Reuse

### 3.1 useProgramService Hook

```typescript
interface UseProgramServiceResult {
  definition: ProgramDefinition;
  progress: ProgramProgress;
  hydrated: boolean;
  loadStatus: ProgramLoadStatus; // "loading" | "ready" | "empty" | "migrated" | "unsupported-version" | "corrupted"
  isUnsupportedSchema: boolean;
  unsupportedSchemaInfo: UnsupportedProgramSchema | null;
  overallCompletion: number; // 0-100
  currentWeekId: string | null; // e.g. "week-1"
  recommendedNextLesson: ProgramLessonDefinition | null;
  milestones: ProgramMilestone[];
  earnedBadgeIds: string[];
  getWeekStatus(weekId: string): WeekAccessStatus; // "locked" | "available" | "completed"
  getWeekCompletion(weekId: string): number; // 0-100
  getWeekCompletedCount(weekId: string): number;
  completeLesson(lessonId: string, weekId: string): void;
  uncompleteLesson(lessonId: string, weekId: string): void;
  toggleLesson(lessonId: string, weekId: string): void;
  pauseProgram(): void;
  resumeProgram(): void;
}
```

### 3.2 ProgramStatus

```typescript
type ProgramStatus = "not_started" | "active" | "paused" | "completed";
```

### 3.3 ProgramLoadStatus

```typescript
type ProgramLoadStatus =
  "loading" | "ready" | "empty" | "migrated" | "unsupported-version" | "corrupted";
```

Note: `corrupted` is a load result variant. The current runtime returns a fallback progress record (not_started) with loadStatus "corrupted". It is NOT silently treated as not_started by the load result; however, the current UI does not distinguish corrupted from empty visually. This will be addressed.

### 3.4 State Machine Events

All 10 events are implemented and tested:

- `program_started`
- `program_paused`
- `program_resumed`
- `program_completed`
- `lesson_completed`
- `lesson_uncompleted`
- `lesson_skipped`
- `lesson_unskipped`
- `weekly_plan_accepted`
- `weekly_plan_dismissed`
- `milestone_earned`

### 3.5 Valid Transitions

```
not_started → active
active → paused | completed
paused → active | completed
completed → active  (reopen/review)
```

## 4. What Already Exists (Production-Ready)

### 4.1 Program Home (/program)

- Week list with locked/available/completed states
- Overall progress bar
- Milestone badges
- Assessment CTA at bottom
- Unsupported schema banner

### 4.2 Lesson Experience

- LessonTemplate with content sections, action step, reflection, FAQ, related lessons
- Completion toggle via canonical state machine
- Progress indicator
- Previous/next navigation
- Share integration
- Unsupported schema protection

### 4.3 Week Pages

- WeekPageTemplate with lesson list
- Week progress bar
- Sleep restriction widget (Week 3)

### 4.4 Dashboard Integration

- ProgramProgressCard (inline in dashboard.tsx)
- Current week, current lesson, completion %
- Recommended next lesson CTA
- Unsupported schema compact warning

### 4.5 Weekly Focus

- Full analytics engine with 6 focus categories
- Data sufficiency detection
- WeeklyFocusCard component
- Adapter to Program domain (type-only contract)

## 5. What Is Partial or Missing

### 5.1 Program Home Gaps

- ❌ No explicit "not started" introduction state (shows week list with 0% progress)
- ❌ No start CTA (assessment CTA exists but is not a program-start action)
- ❌ No paused state banner or paused-specific UI
- ❌ No completion summary/celebration state
- ❌ No "current focus" section
- ❌ No "next recommended action" prominent CTA
- ❌ No pause/resume actions visible on home

### 5.2 Lesson Experience Gaps

- ❌ No pause state awareness (completion still enabled when paused)
- ❌ No write-pending/disabled state for completion button
- ❌ Lesson completion behavior in paused state follows contract but is not explicitly documented in UI

### 5.3 Pause/Resume UI Gaps

- ❌ No pause action visible anywhere in UI
- ❌ No resume action visible
- ❌ No pause confirmation dialog
- ❌ No paused state explanation
- ❌ No paused banner on Program Home or Dashboard

### 5.4 Completion Experience Gaps

- ❌ No completion summary screen
- ❌ No completed date display
- ❌ No milestone acknowledgment beyond badges
- ❌ No review-lessons guidance
- ❌ Dashboard shows "Program complete" but minimal context

### 5.5 Dashboard Integration Gaps

- ❌ No "not started" introduction state on card
- ❌ No paused state rendering (shows active-like)
- ❌ Card is inline, not a reusable component
- ❌ No start/learn-more CTA for not-started

### 5.6 Weekly Focus Integration Gaps

- ❌ No Weekly Focus on Program Home
- ❌ No explainable focus → lesson connection
- ❌ No data sufficiency honest state in Program context
- ❌ No "insufficient data" messaging on Program pages

### 5.7 Localization Gaps

- ❌ No lifecycle state keys (paused, not started, completed messaging)
- ❌ No pause confirmation strings
- ❌ No weekly focus explanation strings
- ❌ Missing program UI strings for some locales (de partial, zh reserved)

**Active locales requiring full coverage:** en, es, pt, pl
**Partial locales:** de (has program + analytics, missing other features)

### 5.8 Accessibility Gaps (to verify)

- ⚠️ No explicit focus management for pause dialog
- ⚠️ Status announcements for state changes not confirmed
- ⚠️ Reduced-motion support for progress animations not confirmed

### 5.9 Test Gaps

- ❌ No component tests for lifecycle states
- ❌ No route integration tests
- ❌ No pause/resume integration tests (state machine tests exist, but not UI)
- ❌ No Weekly Focus eligibility tests
- ❌ No corrupted state rendering tests

## 6. Confirmed Non-Goals

These are explicitly out of scope for Phase G-1:

1. **Machine learning / AI recommendations** — no adaptive treatment engine
2. **Program schema redesign** — existing schema v1 is the source of truth
3. **New Program store/service/reducer** — canonical service is the only write path
4. **Diary or Reflection architecture rewrites** — untouched
5. **Push or email reminder implementation** — reminder service exists but is out of scope
6. **Payment or subscription logic** — not applicable
7. **Major authentication changes** — out of scope
8. **Clinician dashboards** — out of scope
9. **Medical diagnosis** — CBT-I is educational
10. **Direct localStorage access from UI components** — must use canonical service
11. **Weekly Plan recommendation engine** — that's Phase G-2 or later
12. **Automatic restart on completion** — no auto-reset

## 7. Files to Change (Estimated)

### New Files

- `src/components/program/ProgramHome.tsx` — Program Home with all lifecycle states (or enhance existing route)
- `src/components/program/ProgramPausedBanner.tsx` — Paused state banner
- `src/components/program/ProgramCompletionSummary.tsx` — Completion summary
- `src/components/program/PauseConfirmDialog.tsx` — Pause confirmation modal
- `src/components/program/ProgramWeeklyFocusSection.tsx` — Weekly focus on program home
- `src/components/program/ProgramDashboardCard.tsx` — Extracted dashboard card
- `src/components/program/ProgramStartCard.tsx` — Not-started introduction
- `src/lib/program/weekly-focus-i18n.ts` — Weekly focus UI strings

### Modified Files

- `src/routes/program.index.tsx` — Major enhancement for lifecycle states
- `src/components/program/LessonTemplate.tsx` — Pause/state awareness
- `src/components/program/WeekPageTemplate.tsx` — Pause/state awareness
- `src/routes/dashboard.tsx` — Replace inline card with enhanced component
- `src/lib/program-lessons-i18n.ts` — Add lifecycle state keys
- `src/lib/program/use-program-service.ts` — Minor additions if needed (derived values)

### Test Files

- `src/components/program/*.test.tsx` — New component tests
- `src/lib/program/program-selectors.test.ts` — Derived value tests (if added)

## 8. TypeScript Baseline

- Program domain files: **zero TypeScript errors**
- App-wide TypeScript: pre-existing errors in AuthModal, Header, diary components, RelaxAudioPlayer, auth-content (unrelated to Program)
- Rule: no new TypeScript errors; zero errors in modified Program files

## 9. Test Baseline

- **481 tests passing** across 28 test files
- Program tests: service.test.ts (513 lines), storage.test.ts (466 lines), definition.test.ts (202 lines), sync-contracts.test.ts (730 lines), integration.test.ts (849 lines), weekly-plan.test.ts (357 lines)
- Testing framework: Vitest

## 10. Risk Assessment

### Low Risk

- Adding lifecycle UI on top of existing state machine (state machine is verified)
- Adding i18n keys (fallback chain is robust)
- Dashboard card enhancement (reuses same hook)

### Medium Risk

- Weekly Focus integration (cross-domain: analytics → program UI)
- Pause confirmation dialog (focus management, accessibility)
- Ensuring no regression to unsupported-schema protections

### Mitigations

- All writes go through verified state machine
- Existing tests are comprehensive at service level
- Forward-schema guard is in storage layer, not UI
- i18n fallback chain protects against missing keys
