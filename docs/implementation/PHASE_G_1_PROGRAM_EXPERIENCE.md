# Phase G-1 — Program Experience Specification

Date: 2026-07-30

> **G-1.1 Update (2026-07-30):** The canonical state machine now enforces
> paused-state mutation invariants. `applyEvent()` returns a typed
> `ProgramMutationResult` discriminated union. See
> `PHASE_G_1_1_PROGRAM_LIFECYCLE_HARDENING.md` for details.

## 1. Overview

Phase G-1 builds the complete CBT-I Program user experience on top of the canonical Program foundation established in Phase G-0.

All production Program reads and writes flow through:

```
Route / Component
→ useProgramService
→ Program State Machine (applyEvent)
→ Program Storage / Sync
```

No component accesses localStorage directly. No duplicate Program state.

## 2. Lifecycle State Model

### 2.1 ProgramStatus (Domain)

```typescript
type ProgramStatus = "not_started" | "active" | "paused" | "completed";
```

### 2.2 Display States (UI Layer)

| UI State | Derived From | Primary CTA |
|----------|-------------|-------------|
| Loading | `!hydrated` | Skeleton, no CTA |
| Not Started | `status === "not_started"` | Start Program |
| Active | `status === "active"` | Continue / Next Lesson |
| Paused | `status === "paused"` | Resume |
| Completed | `status === "completed"` | Review Lessons |
| Unsupported Version | `isUnsupportedSchema === true` | None (refresh) |
| Corrupted | `loadStatus === "corrupted"` | None (warning) |

### 2.3 State Machine Events

| Event | Transitions From | To |
|-------|-----------------|-----|
| `program_started` | not_started | active |
| `program_paused` | active | paused |
| `program_resumed` | paused | active |
| `program_completed` | active, paused | completed |
| `lesson_completed` | any | (auto) |

### 2.4 Valid Transitions

```
not_started → active
active → paused | completed
paused → active | completed
completed → active  (reopen via uncompleting final lesson)
```

## 3. Program Home (/program)

### 3.1 Not Started State

**Components:** `ProgramStartCard`

**Displays:**
- Program introduction and subtitle
- Structure info: 6 weeks · 18 lessons · self-paced
- What the program does (educational, connected journey)
- What the program does not do (not medical diagnosis)
- Privacy note (progress stays on device)
- Start CTA button

**Actions:**
- `startProgram()` → dispatches `program_started` event

### 3.2 Active State

**Displays:**
- Overall progress bar with percentage
- "Next lesson" CTA card (links to recommended next lesson)
- Pause button (secondary)
- Milestone badges earned
- Weekly Focus section (if sufficient data)
- Week journey list (6 weeks with status indicators)
  - Week states: locked, available, current, in-progress, completed
  - Each week: number, title, short description, lesson count, completion count, progress bar

**Actions:**
- Navigate to next lesson
- Navigate to any available/completed week
- Pause program (opens confirmation dialog)

### 3.3 Paused State

**Components:** `ProgramPausedBanner`

**Displays:**
- Paused banner with icon and explanation
- "All progress preserved" indicator
- Resume CTA button
- Overall progress bar (still visible for context)
- Week journey list (visible but non-interactive for locked weeks)
- Weekly Focus section (still visible, read-only context)

**Actions:**
- `resumeProgram()` → dispatches `program_resumed` event
- Can still navigate to read available/completed weeks/lessons

### 3.4 Completed State

**Components:** `ProgramCompletionSummary`

**Displays:**
- Graduation cap icon
- Completion title and subtitle (calm, non-medical)
- Stats: lessons completed (X of 18), completion date
- Milestone acknowledgment (CBT-I Graduate badge)
- Disclaimer: educational, not medical treatment
- Review lessons section (quick links to all 6 weeks)

**Actions:**
- Review lessons (link to program home / individual weeks)
- Can still toggle lesson completion (review mode)

### 3.5 Unsupported Version State

**Reuses:** `ProgramUnsupportedBanner`

**Behavior:**
- Warning banner visible at top
- Write actions unavailable
- No week list shown (prevents misleading "not started" display)
- Raw data protected (never overwritten)

### 3.6 Corrupted State

**Behavior:**
- Warning banner with "Data unavailable"
- Shows fallback progress (not_started shape) but clearly labeled as corrupted
- No start CTA (unsafe to write)
- `loadStatus === "corrupted"` distinguishes it from normal not_started

## 4. Weekly Journey

### 4.1 Week States

```typescript
type WeekStatus = "locked" | "available" | "current" | "in-progress" | "completed";
```

| State | Derivation |
|-------|-----------|
| `completed` | All lessons in week completed |
| `current` | Week matches `currentWeekId` AND program is active |
| `in-progress` | Some but not all lessons completed |
| `available` | Week 1, or previous week completed, or user started this week |
| `locked` | Otherwise |

### 4.2 Week Card Display

Each week card shows:
- Week number badge
- Week title (localized)
- Short description
- Lesson count
- Completion count (done / total)
- Status pill (colored)
- Progress bar (0-100%)
- Lock icon if locked, check if completed, book if current

### 4.3 Progress Semantics

- **Program progress:** `completedLessons / totalLessons × 100`
- **Week progress:** `completedLessonsInWeek / totalLessonsInWeek × 100`
- **Lesson completion:** binary (completed or not)
- All derived from canonical `completedLessonIds` array

## 5. Lesson Experience

### 5.1 Architecture

Uses existing `LessonTemplate` component with enhanced pause awareness.

### 5.2 Structure

Each lesson page follows:
1. Hero (title, subtitle, metadata: reading time, difficulty, lesson number, completed badge)
2. Progress indicator (overall program progress)
3. Unsupported schema banner
4. Paused note (if paused)
5. Lesson content sections (multiple articles)
6. Action step
7. Reflection prompt
8. FAQ
9. Related lessons (3 max)
10. Completion section
    - Completed banner (if completed)
    - Paused note (if paused)
    - Mark complete toggle (disabled when paused/unsupported)
    - Share button
    - Next lesson / Back to program CTA
11. Previous lesson / Back to week navigation

### 5.3 Completion Behavior

- **Active state:** Completion toggle enabled, dispatches `lesson_completed` / `lesson_uncompleted`
- **Paused state:** Toggle disabled with tooltip/paused note explaining why
- **Unsupported state:** Toggle disabled (write-blocked by storage layer)
- **Completed state:** Can still toggle (review mode)
- **Before hydration:** Toggle disabled (prevents flicker)

## 6. Pause and Resume Experience

### 6.1 Pause Action

**Component:** `PauseConfirmDialog`

**Flow:**
1. User clicks "Pause program" button (on Program Home, active state)
2. Confirmation dialog appears with:
   - Pause icon
   - Title: "Pause your program?"
   - Body: "Your progress will be preserved. You can return and resume whenever you are ready."
   - Cancel button: "Keep going" (initial focus)
   - Confirm button: "Pause for now"
3. On confirm: dispatches `program_paused` event
4. UI transitions to paused state

**Accessibility:**
- Focus trap within dialog
- Escape key closes dialog (without pausing)
- Backdrop click closes dialog
- Initial focus on cancel button (safer default)
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`

### 6.2 Paused State

**Banner:** `ProgramPausedBanner`

Shows:
- Pause icon
- "Program paused" title
- "Your progress is saved. Resume whenever you're ready." body
- "All progress preserved" indicator
- Resume button

**Available actions:**
- Resume program
- Read and review content (lessons/weeks remain readable)
- Share lessons (no writes involved)

**Not available:**
- Marking lessons complete (disabled at UI level)
- Starting new lessons (can navigate but can't complete)

### 6.3 Resume Action

**Flow:**
1. User clicks "Resume" button (in paused banner or dashboard card)
2. Immediately dispatches `program_resumed` event (no confirmation needed — it's a positive, reversible action)
3. UI transitions back to active state
4. Progress and current week are fully preserved

## 7. Completion Experience

**Component:** `ProgramCompletionSummary`

### 7.1 Display

- Graduation cap icon
- Title: "You completed the Somna CBT-I Program"
- Subtitle: Calm message about skills, not cure
- Stats grid:
  - Lessons completed (X of 18)
  - Completion date (formatted per locale)
  - CBT-I Graduate milestone earned
- Review CTA button
- Disclaimer: "This program is educational and not a substitute for professional medical care."
- Quick week review links (all 6 weeks)

### 7.2 Behavior

- No automatic restart
- No "cured" or medical-success language
- User can review all lessons
- Completion toggles still work (can un-complete and re-complete)
- Progress is preserved indefinitely

## 8. Dashboard Integration

**Component:** `ProgramDashboardCard` (extracted from inline)

### 8.1 States

| State | Display | CTA |
|-------|---------|-----|
| Loading | Skeleton | None |
| Not started | Intro subtitle, structure info | Start learning |
| Active | Current week, current lesson, completion %, progress bar, recommended lesson | Continue learning |
| Paused | Paused status badge, metrics, progress bar | Resume |
| Completed | Completion acknowledgment, lessons count | Review |
| Unsupported | Compact warning banner | None |

### 8.2 Status Badge

Top-right corner shows current program status:
- Not started (muted)
- In progress (accent)
- Paused (accent)
- Completed (success)
- Data unavailable (destructive, corrupted)

### 8.3 Architecture

- Self-contained: uses `useProgramService()` internally
- No props required for basic use
- Optional `onStart`, `onResume`, `onPause` callbacks for custom behavior
- Defaults to dispatching events directly via service

## 9. Weekly Focus Integration

**Component:** `ProgramWeeklyFocusSection`

### 9.1 Purpose

Connects Program UX to Diary-derived Weekly Focus in an explainable, data-aware way.
This is NOT an adaptive treatment engine. It provides context and suggestion.

### 9.2 Data Flow

```
Sleep records (loadRecords)
  → generateWeeklyFocus()
  → WeeklyFocus object
  → ProgramWeeklyFocusSection (explainable display)
  → Related lesson link (via tag matching)
```

### 9.3 Display (Sufficient Data)

- Focus category headline
- "Why this appears" section with plain-language reason
- "Based on X entries / 7 days" data sufficiency indicator
- Related lesson suggestion (matched by lesson tags from focus category)
  - Prefers lesson from current week
  - Falls back to first matching lesson in program

### 9.4 Insufficient Data State

Honest display when data is insufficient or minimal:
- Alert icon
- Message: "Complete a few more sleep diary entries to receive a more data-informed weekly focus."
- Data window indicator (shows actual entry count)
- No fake generic recommendation

### 9.5 Safeguards

- No diagnosis language
- No certainty claims
- No automatic program mutation
- User can ignore (no dismiss action needed, it's informational)
- Weekly Focus never marks lessons complete
- Absence of Diary data does not break Program use (graceful insufficient state)

### 9.6 Focus Category → Lesson Tag Mapping

From `FOCUS_CATEGORY_TO_LESSON_DOMAINS`:

| Category | Lesson Tags |
|----------|-------------|
| baseline_building | education, habit |
| recording_consistency | habit |
| wake_time_consistency | stimulus-control, habit |
| bedtime_observation | stimulus-control, relaxation |
| reminder_routine | habit |
| maintenance | maintenance, cognitive |

## 10. Localization

### 10.1 Covered Locales

| Locale | Status | Program UI | Weekly Focus |
|--------|--------|------------|--------------|
| en | Active | ✅ Complete | ✅ Complete |
| es | Active | ✅ Complete | ✅ Complete |
| pt | Active | ✅ Complete | ✅ Complete |
| pl | Active | ✅ Complete | ✅ Complete |
| de | Partial | ✅ Complete | ✅ Complete |
| zh | Reserved | ✅ Complete | ⚠️ Falls back to en |
| ja | Reserved | ❌ Falls back to en | ❌ Falls back to en |

### 10.2 New Key Categories Added

- Lifecycle states (status labels)
- Start / introduction
- Pause (button, dialog, banner)
- Resume (button, banner)
- Completion (summary, stats, disclaimer)
- Progress labels
- Week states (current, in-progress)
- Weekly Focus (title, why, data window, insufficient, related lesson)
- Dashboard states

All keys added to `ProgramLessonUI` type in `src/lib/program-lessons-i18n.ts`.

### 10.3 Fallback Chain

1. Requested locale dictionary
2. English dictionary (canonical baseline)
3. Key-derived human-readable fallback (last segment)

No raw keys visible to users.

## 11. Accessibility

### 11.1 Semantic Structure

- Proper heading hierarchy (h1 → h2 → h3)
- `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`
- `aria-live` regions for status changes (dialogs)
- Status badges with icons + text (not color-only)

### 11.2 Keyboard Navigation

- All interactive elements reachable by Tab
- Enter/Space activates buttons and links
- Escape closes dialogs
- Focus rings visible (`focus-visible:ring-2 focus-visible:ring-accent`)

### 11.3 Pause Dialog

- `role="dialog"`, `aria-modal="true"`
- `aria-labelledby` and `aria-describedby`
- Focus trap (Tab cycles within dialog)
- Initial focus on cancel button (safer default)
- Escape closes without pausing
- Backdrop click closes without pausing

### 11.4 Disabled States

- Completion toggle disabled when: loading, paused, unsupported schema
- `aria-disabled` attribute
- `title` attribute with explanation
- Visual opacity reduction (50%)

### 11.5 Touch Targets

- Buttons: minimum ~44px height
- Adequate spacing between interactive elements
- Week cards: large touch area (entire card is link)

### 11.6 Reduced Motion

- Progress bar transitions use CSS `transition` (respects `prefers-reduced-motion` via browser)
- Dialog animations are subtle (fade-in/fade-up)
- No auto-playing animations

## 12. Analytics

### 12.1 Events

The existing `trackShare` function is used for lesson sharing (pre-existing).

No additional analytics events are emitted in Phase G-1 to avoid introducing a new analytics abstraction.

If a canonical analytics event system is added later, these would be the candidate events:
- `program_started`
- `program_paused`
- `program_resumed`
- `lesson_completed` (already implicit)
- `program_completed` (already implicit)
- `weekly_focus_viewed`
- `weekly_focus_deferred`

### 12.2 Privacy Boundaries

- No lesson reflection text sent
- No sleep diary contents sent
- No health details sent
- No email address sent
- No raw Program storage sent

## 13. Files

### New Files

- `src/components/program/PauseConfirmDialog.tsx`
- `src/components/program/ProgramPausedBanner.tsx`
- `src/components/program/ProgramCompletionSummary.tsx`
- `src/components/program/ProgramStartCard.tsx`
- `src/components/program/ProgramWeeklyFocusSection.tsx`
- `src/components/program/ProgramDashboardCard.tsx`

### Modified Files

- `src/routes/program.index.tsx` — Major enhancement: all lifecycle states, weekly focus, pause/resume
- `src/components/program/LessonTemplate.tsx` — Pause awareness, disabled completion
- `src/components/program/WeekPageTemplate.tsx` — Paused banner
- `src/routes/dashboard.tsx` — Replace inline card with extracted component
- `src/lib/program/use-program-service.ts` — Added `startProgram()` method
- `src/lib/program-lessons-i18n.ts` — Added ~40 new i18n keys per locale
- `src/lib/program/service.test.ts` — Added 4 new lifecycle tests

### Test Count

- Before: 481 tests
- After: 485 tests
- +4 new tests in service.test.ts (pause/resume/lifecycle)
