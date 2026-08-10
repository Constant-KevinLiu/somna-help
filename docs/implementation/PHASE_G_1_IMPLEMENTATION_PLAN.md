# Phase G-1 Implementation Plan

Date: 2026-07-30

## 1. Overview

Build the complete CBT-I Program user experience on top of the existing canonical Program foundation. All reads and writes flow through `useProgramService` → state machine → repository/storage/sync. No new persistence paths.

## 2. Component Plan

### 2.1 Program Home Components

| Component                   | File                                                   | Purpose                                                       |
| --------------------------- | ------------------------------------------------------ | ------------------------------------------------------------- |
| `ProgramHome`               | `src/routes/program.index.tsx` (enhanced)              | Main program page orchestration                               |
| `ProgramStartCard`          | `src/components/program/ProgramStartCard.tsx`          | Not-started introduction + start CTA                          |
| `ProgramActiveView`         | `src/components/program/ProgramActiveView.tsx`         | Active state: progress, current week, next lesson, weeks list |
| `ProgramPausedView`         | `src/components/program/ProgramPausedView.tsx`         | Paused state: banner, preserved progress, resume CTA          |
| `ProgramCompletedView`      | `src/components/program/ProgramCompletedView.tsx`      | Completion summary + review options                           |
| `ProgramUnsupportedView`    | Reuse `ProgramUnsupportedBanner`                       | Protected warning state                                       |
| `WeekJourneyList`           | `src/components/program/WeekJourneyList.tsx`           | Week cards with states (existing week list refactored)        |
| `ProgramWeeklyFocusSection` | `src/components/program/ProgramWeeklyFocusSection.tsx` | Explainable weekly focus on program home                      |

### 2.2 Lifecycle UI Components

| Component                  | File                                                  | Purpose                     |
| -------------------------- | ----------------------------------------------------- | --------------------------- |
| `PauseConfirmDialog`       | `src/components/program/PauseConfirmDialog.tsx`       | Confirmation before pausing |
| `ProgramPausedBanner`      | `src/components/program/ProgramPausedBanner.tsx`      | Paused status banner        |
| `ProgramCompletionSummary` | `src/components/program/ProgramCompletionSummary.tsx` | Completion state display    |
| `ProgramProgressHeader`    | `src/components/program/ProgramProgressHeader.tsx`    | Shared progress header      |

### 2.3 Existing Components to Enhance

| Component             | File                                          | Changes                                                       |
| --------------------- | --------------------------------------------- | ------------------------------------------------------------- |
| `LessonTemplate`      | `src/components/program/LessonTemplate.tsx`   | Disable completion when paused/unsupported, add paused banner |
| `WeekPageTemplate`    | `src/components/program/WeekPageTemplate.tsx` | Add paused state awareness                                    |
| `ProgramProgressCard` | Extract from `src/routes/dashboard.tsx`       | All lifecycle states, pause/resume CTA                        |

## 3. Route Plan

| Route                      | Changes                                                                        |
| -------------------------- | ------------------------------------------------------------------------------ |
| `/program`                 | Major enhancement — all 5 lifecycle states, weekly focus, pause/resume actions |
| `/program/[week]`          | Minor — add paused banner, ensure read-only when appropriate                   |
| `/program/[week]/[lesson]` | Minor — disable completion when paused, add paused context                     |
| `/dashboard`               | Replace inline ProgramProgressCard with enhanced version                       |

No new routes required.

## 4. Lifecycle State Matrix

### Display States (UI Layer)

| UI State            | Derived From                                                                | Primary CTA                        | Lesson Read          | Lesson Write                                      |
| ------------------- | --------------------------------------------------------------------------- | ---------------------------------- | -------------------- | ------------------------------------------------- |
| Loading             | `!hydrated`                                                                 | None (skeleton)                    | No                   | No                                                |
| Not Started         | `progress.status === "not_started" && loadStatus !== "unsupported-version"` | Start Program                      | Yes (public lessons) | No (starts on first completion OR explicit start) |
| Active              | `progress.status === "active"`                                              | Continue / Next Lesson             | Yes                  | Yes                                               |
| Paused              | `progress.status === "paused"`                                              | Resume                             | Yes (review/reading) | No (completion blocked)                           |
| Completed           | `progress.status === "completed"`                                           | Review Lessons                     | Yes                  | Toggle allowed (review mode)                      |
| Unsupported Version | `isUnsupportedSchema === true`                                              | None (refresh)                     | Read-only where safe | No (write-blocked)                                |
| Corrupted           | `loadStatus === "corrupted"`                                                | None (shows fallback with warning) | Yes (fallback data)  | No (unsafe to write corrupted data)               |

Note: The corrupted state currently returns a not_started-shaped fallback via the storage layer. The UI will distinguish corrupted from not_started via `loadStatus === "corrupted"` and show a warning banner instead of the normal start CTA. This is low-risk because: (1) the state machine can already handle it; (2) writes are not necessary; (3) we document it as deferred debt if deeper recovery is needed.

### State Machine Event Mapping

| UI Action               | Event                | Guard                                         |
| ----------------------- | -------------------- | --------------------------------------------- |
| Start program (button)  | `program_started`    | `status === "not_started"`                    |
| Complete lesson         | `lesson_completed`   | `!isUnsupportedSchema && status !== "paused"` |
| Uncomplete lesson       | `lesson_uncompleted` | `!isUnsupportedSchema && status !== "paused"` |
| Pause program           | `program_paused`     | `status === "active"`                         |
| Resume program          | `program_resumed`    | `status === "paused"`                         |
| (Auto) Program complete | `program_completed`  | Auto on last lesson completion                |

## 5. Localization Plan

### 5.1 Locales to Cover

**Active locales (full coverage required):**

- `en` — English (baseline)
- `es` — Spanish
- `pt` — Portuguese
- `pl` — Polish

**Partial locale (program-only coverage):**

- `de` — German (already has program UI strings)

**Reserved locales (fallback only):**

- `zh` — Chinese (already has program UI baseline)
- `ja` — Japanese (type-only, no content)

### 5.2 New i18n Key Categories

All keys added to `ProgramLessonUI` in `src/lib/program-lessons-i18n.ts`:

```typescript
// Lifecycle states
programStatusNotStarted: string;
programStatusActive: string;
programStatusPaused: string;
programStatusCompleted: string;

// Start / introduction
startProgramTitle: string;
startProgramSubtitle: string;
startProgramCta: string;
startProgramLearnMore: string;
programStructureInfo: string; // "6 weeks, 18 lessons"
programPrivacyNote: string;

// Pause
pauseProgram: string;
pauseConfirmTitle: string;
pauseConfirmBody: string;
pauseConfirmCancel: string;
pauseConfirmPause: string;
pausedBannerTitle: string;
pausedBannerBody: string;
pausedProgressPreserved: string;
resumeProgram: string;
resumeCta: string;

// Completion
completionTitle: string;
completionSubtitle: string;
completionDate: string;
completionLessonsCount: string;
completionMilestone: string;
reviewLessons: string;
completionDisclaimer: string; // Not a cure, educational only

// Progress
currentWeekLabel: string;
nextLessonLabel: string;
overallProgressLabel: string;
lessonsCompleted: string; // "X of Y lessons completed"

// Weekly Focus
weeklyFocusTitle: string;
weeklyFocusWhy: string;
weeklyFocusDataWindow: string;
weeklyFocusRelatedLesson: string;
weeklyFocusInsufficient: string;
weeklyFocusDefer: string;

// Week states
weekCurrent: string;
weekInProgress: string;
weekLocked: string;
weekAvailable: string;
weekCompleted: string;

// Dashboard
dashProgramStart: string;
dashProgramPaused: string;
dashResumeProgram: string;
dashReviewProgram: string;
```

### 5.3 Key Addition Strategy

1. Add keys to `ProgramLessonUI` type
2. Add English values first (baseline)
3. Add Spanish, Portuguese, Polish values
4. German and Chinese get English fallback where missing
5. Verify no raw keys appear in any active locale

## 6. Accessibility Plan

### 6.1 Semantic Structure

- Program Home: `<h1>` for page title, `<h2>` for each section
- Heading order: h1 → h2 → h3, no skips
- Progress bars have `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`
- State announcements via `aria-live="polite"` on status changes

### 6.2 Interactive Elements

- All CTAs are `<button>` or `<a>` elements
- Visible focus rings (focus-visible:ring-2 focus-visible:ring-accent)
- Disabled buttons have `aria-disabled` + explanation of why
- Pause dialog: initial focus on cancel button, focus trap, Escape to close

### 6.3 Keyboard Navigation

- Tab order follows visual order
- Enter/Space activates buttons
- Escape closes dialogs
- Links are reachable and focusable

### 6.4 Screen Reader

- `aria-label` on progress bars
- `aria-pressed` on toggle buttons
- `aria-live` region for status changes
- No color-only state indication (icons + text)

### 6.5 Reduced Motion

- Use existing `useReducedMotion()` hook
- Progress bar transitions respect `prefers-reduced-motion`
- Dialog animations respect reduced motion

### 6.6 Touch Targets

- Minimum 44×44px for interactive elements
- Adequate spacing between touch targets

## 7. Test Plan

### 7.1 Unit Tests (Pure Functions)

**File:** `src/lib/program/lifecycle-selectors.test.ts` (or extend existing)

Test cases:

- Derive display state from progress + loadStatus
- Week display state (locked/available/in-progress/completed/current)
- Next lesson selection per status
- Pause eligibility
- Completion detection
- Corrupted vs not_started distinction

### 7.2 State Machine / Service Tests

Already exist and are comprehensive. Add:

- Pause → reload → resume integration test
- Lesson completion blocked during paused state (verify via state machine)
- Final lesson completion → program_completed transition

### 7.3 Component Tests

**Test framework:** Vitest + React Testing Library

Test files:

- `src/components/program/ProgramHome.test.tsx`
- `src/components/program/PauseConfirmDialog.test.tsx`
- `src/components/program/ProgramCompletionSummary.test.tsx`
- `src/components/program/ProgramDashboardCard.test.tsx`
- `src/components/program/ProgramWeeklyFocusSection.test.tsx`

Test cases per component:

- Each lifecycle state renders correctly
- Correct primary CTA per state
- Localized labels, no raw keys
- Keyboard interaction
- Disabled states explained
- Progress accessible name

### 7.4 Route / Integration Tests

Manual verification (no E2E runner):

- `/program` — not started, active, paused, completed, unsupported
- `/program/week-1` — each state
- `/program/week-1/lesson-slug` — completion disabled when paused
- `/dashboard` — each state renders correctly

### 7.5 Test Target

Target: **520+ tests total** (approximately 40 new tests)

## 8. Migration Impact

**No database migration required.**

- All lifecycle states are already supported by the ProgramProgress schema v1
- `status` field exists and supports all 4 states
- `pausedAt` is not a separate field; pause timestamp is captured in `updatedAt`
- No new persisted fields needed

The `updatedAt` field serves as an implicit pause timestamp. If explicit `pausedAt` is desired in the future, that would be a schema v2 change — deferred.

## 9. Risk Controls

### 9.1 Architectural Integrity

- **Control:** All writes go through `useProgramService` methods
- **Verification:** Code review confirms no direct localStorage calls in new UI components
- **Fallback:** TypeScript will catch direct storage imports if disallowed by pattern

### 9.2 Unsupported Schema Protection

- **Control:** `isUnsupportedSchema` guard before every write action
- **Verification:** Test that pause/resume/complete are all no-ops when unsupported
- **Fallback:** Storage layer also has the guard (defense in depth)

### 9.3 No Duplicate State

- **Control:** All progress derived from single `useProgramService` hook
- **Verification:** No `useState` for progress data in UI components
- **Fallback:** Cross-tab event system ensures consistency

### 9.4 i18n Safety

- **Control:** Fallback chain: locale dict → English → key-derived fallback
- **Verification:** Visual check of each locale, no raw `program.xxx` keys visible
- **Fallback:** English baseline is always complete

### 9.5 Hydration Safety

- **Control:** SSR renders loading/not-started state; client hydrates to actual state
- **Verification:** No `useEffect` state changes that cause hydration mismatch
- **Fallback:** Existing pattern already proven in production

## 10. Implementation Sequence (Detailed)

### Step 3 — Program Home and Lifecycle UI

1. Add lifecycle i18n keys (en baseline)
2. Create helper selectors for display state
3. Build ProgramStartCard (not started state)
4. Build ProgramActiveView (active state)
5. Build ProgramPausedView (paused state)
6. Build ProgramCompletedView (completed state)
7. Assemble Program Home with state switching
8. Add corrupted state warning banner

### Step 4 — Lesson and Weekly Journey Experience

1. Enhance WeekPageTemplate with paused state awareness
2. Enhance LessonTemplate with paused state + write protection
3. Add completion button disabled state with explanation
4. Ensure lesson content is readable before completion

### Step 5 — Pause/Resume and Completion

1. Create PauseConfirmDialog component
2. Add pause action to Program Home
3. Add resume action to paused views
4. Create ProgramCompletionSummary component
5. Add completion state to Program Home
6. Test pause → reload → resume flow

### Step 6 — Dashboard and Weekly Focus

1. Extract ProgramDashboardCard from dashboard.tsx
2. Add all lifecycle states to dashboard card
3. Create ProgramWeeklyFocusSection component
4. Connect to useSleepAnalytics hook
5. Add insufficient data state
6. Add explainable focus → lesson connection

### Step 7 — Accessibility, Localization, Tests

1. Complete all locale translations (es, pt, pl)
2. Add reduced motion support
3. Add aria-live status announcements
4. Write unit tests for selectors
5. Write component tests
6. Verify keyboard navigation

### Step 8 — Validation and Documentation

1. Run full test suite
2. Run typecheck on modified files
3. Run production build
4. Write acceptance report
5. Write completion report
6. Update architecture docs

## 11. Analytics Events

The project has a `trackShare` function in `src/lib/share-analytics.ts`. For privacy-safe program events, we extend the existing analytics pattern minimally:

| Event                   | Trigger                      | Data Sent              |
| ----------------------- | ---------------------------- | ---------------------- |
| `program_started`       | User clicks Start Program    | none (just event type) |
| `program_paused`        | User confirms pause          | none                   |
| `program_resumed`       | User clicks Resume           | none                   |
| `lesson_completed`      | (already implicit via state) | none                   |
| `program_completed`     | (auto on last lesson)        | none                   |
| `weekly_focus_viewed`   | Focus section rendered       | none                   |
| `weekly_focus_deferred` | User defers focus            | none                   |

**No health data, personal data, or lesson content is sent.**

If no canonical analytics abstraction exists beyond `trackShare`, we keep the event emission lightweight and co-located with existing share-analytics.

## 12. Acceptance Gate Checklist

- [ ] All 5 lifecycle states render correctly on /program
- [ ] Pause/resume work through state machine
- [ ] Lesson completion blocked when paused
- [ ] Lesson completion blocked when unsupported
- [ ] Dashboard card shows all states correctly
- [ ] Weekly focus explainable and data-aware
- [ ] Insufficient data handled honestly
- [ ] No raw i18n keys in active locales
- [ ] Keyboard navigation works
- [ ] Progress bars have accessible labels
- [ ] No new TypeScript errors
- [ ] Zero TS errors in modified Program files
- [ ] All tests pass
- [ ] Production build succeeds
- [ ] Unsupported-schema protections intact
- [ ] No direct localStorage access from new components
