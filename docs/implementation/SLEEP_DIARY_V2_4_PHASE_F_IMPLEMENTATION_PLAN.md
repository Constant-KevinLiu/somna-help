# Sleep Diary v2.4 — Phase F Implementation Plan
## Behavior Analytics, Insight Dashboard & Weekly Reflection Engine

---

## 1. Current Architecture Discovered

### 1.1 Canonical Data Sources

**Sleep Diary Records** (`src/lib/sleep-records.ts`)
- Storage key: `sleepRecords` (localStorage)
- `SleepRecord` interface: `date`, `bedtime`, `sleepLatency`, `nightAwakenings`, `wakeUpTime`, `sleepQuality`, `mood`, `sleepEfficiency`, `sleepScore`
- Existing metric utilities: `minutesInBed()`, `computeEfficiency()`, `computeScore()`, `weeklyAverageEfficiency()`, `efficiencyTrend()`, `currentStreak()`, `tonightPlan()`
- Trend compares last 7 days vs prior 7 days as simple point difference

**Habit Engine** (`src/services/habit/`)
- Reminders: `loadReminders()`, `calculateAllHabitProgress()` → `Map<string, HabitProgress>`
- `HabitProgress` has: `completionCount`, `opportunityCount`, `consistencyRate`, `currentStreak`, `longestStreak`, `currentState`
- Event-sourced: append-only `reminderEvents` log
- Timezone-aware scheduling with DST-safe utilities

**Guided Reflection System** (`src/lib/reflection/`)
- Already exists: `LocalReflection` type, `reflection-storage.ts`, `reflection-prompts.ts`, `reflection-stats.ts`
- Storage key: `somna.reflections.v1`
- 10 reflection categories, daily prompt selection
- Currently tied to individual dates, not weekly reflection

### 1.2 Dashboard Architecture

**File**: `src/routes/dashboard.tsx`
- TanStack Router file-based route: `/dashboard`
- Localized routes: `/pl/dashboard`, `/pt/painel`, `/es/panel`
- Current sections: Today's Recommendation, CBT-I Brain (3 metrics), Program Progress, Last 7 Days Efficiency Chart, Weekly Insight, Streak, Habit Reminders, Next Lesson, Share CTA
- Chart library: **Recharts v2.15.4** (already installed and used)
- Uses `useMemo` for derived computations
- Client-side hydration pattern with `hydrated` state

### 1.3 Localization System

- Languages: `en`, `es`, `pt`, `pl`, `de` (5 active)
- Main dictionary: `src/lib/i18n.tsx` (en, es, pt, zh inline)
- Separate files: `src/services/i18n/de.ts` (German), Polish via import
- Pattern: dot-separated keys (`nav.home`, `dash.bedtime`)
- Fallback: English → key itself
- Locale map: `en: en-US`, `es: es-ES`, `pt: pt-BR`, `pl: pl-PL`, `de: de-DE`

### 1.4 SSR-Safe Storage

**File**: `src/lib/safe-storage.ts`
- `isBrowser()` — multi-check browser detection
- `safeLocalStorageGet<T>()`, `safeLocalStorageSet()`, `safeLocalStorageRemove()`
- `safeJsonParse<T>()` with defaultValue fallback
- No errors thrown; silent SSR safety

### 1.5 Test Framework

- Node.js built-in test runner (`node:test`, `node:assert/strict`)
- Execution via `tsx`
- Pattern: `*.test.ts` files alongside source
- Existing tests: cbti-brain, safe-storage, reflection-*, habit-*, reminder-model

---

## 2. Domain Boundaries

### Behavioral Data Platform owns (unchanged)
- `SleepRecord` — canonical observations
- Loading/saving diary records
- Raw timestamp data

### Habit Engine owns (unchanged)
- Reminder definitions and occurrences
- Completion events
- Streak and consistency calculation
- `calculateAllHabitProgress()` is the public API

### Intelligence / Analytics Layer owns (NEW — Phase F)
- Derived metric calculations (circular averages, variability, regularity)
- Trend analysis with thresholds and confidence
- Pattern detection (weekday/weekend, consistency patterns)
- Insight card generation and prioritization
- Weekly and monthly summaries
- Weekly focus suggestion rules
- All as pure functions; no storage ownership

**Invariant**: Analytics never writes to `sleepRecords` or modifies `Reminder` objects.

---

## 3. Files Expected to Change

### New Files (Core Analytics Service)
```
src/lib/analytics/
├── types.ts                    # Core types: MetricKey, DataSufficiency, TrendDirection, etc.
├── metrics.ts                  # Deterministic metric calculations (circular avg, TST, regularity)
├── date-ranges.ts              # Time window utilities (7/14/30/90d, week/month boundaries)
├── sufficiency.ts              # Data sufficiency thresholds and evaluation
├── trends.ts                   # Trend engine with meaningful-change thresholds
├── patterns.ts                 # Pattern detection rules (weekday/weekend, consistency)
├── insights.ts                 # Insight card generation and prioritization
├── weekly-summary.ts           # Weekly summary aggregation
├── monthly-summary.ts          # Monthly summary aggregation
├── weekly-focus.ts             # Rule-based next-week focus selection
└── analytics-i18n-keys.ts      # i18n key constants for analytics

src/lib/analytics/
├── metrics.test.ts
├── date-ranges.test.ts
├── sufficiency.test.ts
├── trends.test.ts
├── patterns.test.ts
├── insights.test.ts
├── weekly-summary.test.ts
├── monthly-summary.test.ts
└── weekly-focus.test.ts

src/hooks/
└── useSleepAnalytics.ts        # React hook: memoized analytics from sleep records + habits
```

### New Files (Weekly Reflection Engine)
```
src/lib/weekly-reflection/
├── types.ts                    # WeeklyReflection, ReflectionPromptWeekly
├── prompts.ts                  # Rule-selected weekly reflection prompts
├── storage.ts                  # Weekly reflection persistence (SSR-safe)
└── weekly-reflection.test.ts
```

### New Files (Dashboard Components)
```
src/components/analytics/
├── MetricCard.tsx              # Individual metric display card
├── TrendRangeSelector.tsx      # 7/14/30/90 day selector
├── InsightCard.tsx             # Explainable insight card with evidence
├── InsightSection.tsx          # Insight cards container
├── SleepChart.tsx              # Multi-metric trend chart (Recharts)
├── WeeklySummary.tsx           # Weekly summary card
├── MonthlySummary.tsx          # Monthly overview card
├── WeeklyReflectionFlow.tsx    # Guided weekly reflection UI
├── WeeklyFocusCard.tsx         # Next-week focus suggestion
├── DataSufficiencyBanner.tsx   # "Insufficient data" messaging
└── index.ts                    # Barrel export
```

### New Files (i18n)
```
src/locales/analytics/
├── en.ts
├── es.ts
├── pt.ts
├── pl.ts
└── de.ts
```

### Modified Files
```
src/routes/dashboard.tsx          # Extend with analytics sections
src/routes/pl/dashboard.tsx       # Keep reusing Dash component
src/routes/pt/painel.tsx          # Keep reusing Dash component
src/routes/es/panel.tsx           # Keep reusing Dash component
src/lib/i18n.tsx                  # Add analytics dictionary import
src/services/i18n/de.ts           # Add German analytics translations
src/lib/format.ts                 # Add duration formatting helpers if needed
```

### New Documentation Files
```
docs/features/behavior-analytics.md
docs/features/insight-dashboard.md
docs/features/weekly-reflection.md
docs/implementation/SLEEP_DIARY_V2_4_PHASE_F_IMPLEMENTATION_PLAN.md  (this file)
docs/implementation/SLEEP_DIARY_V2_4_PHASE_F_COMPLETION_REPORT.md
```

---

## 4. Canonical Metric Definitions

### 4.1 Time in Bed (TIB)
```
minutesInBed(bedtime, wakeUpTime)  [already exists in sleep-records.ts]
= minutes from bedtime to wakeUpTime, handling overnight wrap
```
- Uses existing `minutesInBed()` utility
- Pure function of `bedtime` and `wakeUpTime` strings

### 4.2 Total Sleep Time (TST)
```
TST = TIB - sleepLatency - (nightAwakenings × 10 min)
```
- Formula matches existing `computeEfficiency()` logic
- Each awakening estimated at 10 minutes (same as efficiency calc)
- Return `null` if TIB ≤ 0

### 4.3 Sleep Efficiency
```
SE = TST / TIB × 100  [already exists as computeEfficiency()]
```
- Use existing `sleepEfficiency` field from records (pre-computed at save time)
- Analytics layer uses recorded value, does not recalculate
- Return `null` for invalid denominator; never NaN or Infinity

### 4.4 Sleep Onset Latency (SOL)
- Direct value from `sleepLatency` field
- Units: minutes
- No inference for missing values

### 4.5 Wake After Sleep Onset (WASO)
```
WASO = nightAwakenings × 10 min
```
- Estimated using same 10-min-per-awakening convention as efficiency calc
- Not stored directly; derived from `nightAwakenings`

### 4.6 Number of Awakenings
- Direct value from `nightAwakenings` field
- Recorded data only

### 4.7 Average Bedtime (Circular)
```
Convert each bedtime to minutes since noon (to avoid midnight wrap)
Compute arithmetic mean of shifted values
Shift back by 12 hours and normalize to 0-1440 min range
Format as HH:MM
```
- Why circular: prevents 23:30 + 00:30 averaging to noon
- Use "noon reference" shift: times shifted by -720 minutes (12 hours) before averaging
- Alternative: vector mean on unit circle (both produce same result for clustered times)

### 4.8 Average Wake Time (Circular)
- Same circular approach as bedtime
- Wake times typically cluster in early morning, less wrap risk, but still use circular for consistency

### 4.9 Sleep Regularity
```
Definition: 100 - (bedtimeSD + wakeTimeSD) / 2
Where SD = standard deviation of sleep onset/wake times in minutes

Simplified Phase F implementation:
regularityScore = 100 - mean(variability)
variabilityBedtime = stddev of bedtime minutes (circular)
variabilityWakeTime = stddev of wakeTime minutes
score = max(0, 100 - (variabilityBedtime + variabilityWakeTime) / 2)
```
- Clamped to 0-100
- Higher = more regular sleep schedule
- Based on bedtime AND wake-time consistency
- Minimum 3 records required

### 4.10 Diary Completion Rate
```
completedEligibleDays / eligibleDays × 100
```
- Eligible days: all days in the window from windowStart to today
- Completed: days with a valid SleepRecord
- Return `null` if no eligible days

### 4.11 Reminder Completion Rate
- Read directly from Habit Engine's `calculateAllHabitProgress()`
- `consistencyRate` field: completions / opportunities × 100
- Analytics layer does not recalculate

---

## 5. Data Sufficiency Framework

```typescript
type DataSufficiency = "none" | "insufficient" | "limited" | "sufficient";
```

### Default Thresholds (per 7-day window)
| State | Records |
|-------|---------|
| none | 0 |
| insufficient | 1-2 |
| limited | 3-6 |
| sufficient | 7+ |

### Metric-Specific Adjustments
- **Sleep Regularity**: requires minimum 3 records (vs 1 for simple averages)
- **Trend comparison**: requires minimum 2 records in each period
- **Pattern detection (weekday/weekend)**: requires minimum 2 weekday + 2 weekend records = "limited"
- **Insight cards**: at least "limited" data for most insights; "sufficient" for strong claims

### Messaging Tone
- none: "Start recording your sleep to see your patterns."
- insufficient: "Keep recording for a few more days to see a clearer pattern."
- limited: "Here's what we're seeing so far — keep recording for a fuller picture."
- sufficient: normal presentation

---

## 6. Trend Engine

### 6.1 Trend Direction
```typescript
type TrendDirection =
  | "improving"
  | "stable"
  | "declining"
  | "mixed"
  | "insufficient_data";
```

### 6.2 Comparison Method
- Split window into two halves: first half vs second half
- For 7-day: days 1-3 vs days 5-7 (skip middle day or include in first half)
- Actually simpler: compare period N days back vs period 2N to N days back
- For "7d trend": last 7 days vs prior 7 days (days 8-14 ago)

### 6.3 Meaningful Change Thresholds
| Metric | Meaningful Change | Unit |
|--------|-------------------|------|
| Sleep Efficiency | ≥ 3 percentage points | % |
| Total Sleep Time | ≥ 20 minutes | min |
| Sleep Onset Latency | ≥ 5 minutes | min |
| Bedtime | ≥ 15 minutes | min |
| Wake Time | ≥ 15 minutes | min |
| WASO | ≥ 10 minutes | min |

Below threshold = "stable" even if technically different.

### 6.4 Confidence (Rule-Based)
- **high**: ≥ 7 records in each period, change exceeds threshold
- **medium**: 4-6 records in each period, change exceeds threshold
- **low**: 3 or fewer records, or change near threshold

### 6.5 Output Interface
```typescript
interface MetricTrend {
  metric: MetricKey;
  direction: TrendDirection;
  currentValue: number | null;
  previousValue: number | null;
  absoluteChange: number | null;
  percentageChange: number | null;
  sampleSizeCurrent: number;
  sampleSizePrevious: number;
  explanationKey: string;
  confidence: "low" | "medium" | "high";
}
```

---

## 7. Pattern Detection Rules

Only patterns supported by existing canonical fields:

1. **Weekday vs Weekend Bedtime**
   - Compare average bedtime (weekdays Mon-Fri) vs (weekend Sat-Sun)
   - Label: "Your bedtime was ~X min later on weekends."
   - Requires: ≥2 weekday + ≥2 weekend records

2. **Weekday vs Weekend Wake Time**
   - Same pattern for wake time
   - Label: "You woke up ~X min later on weekends."

3. **Wake Time Consistency**
   - Low SD in wake times = consistent
   - Label: "Your wake time has been very consistent this week."

4. **Bedtime Variability**
   - High SD in bedtimes = variable
   - Label: "Your bedtime varied a lot this week."

5. **Sleep Efficiency Trend**
   - Delegate to trend engine

6. **Sleep Onset Latency Trend**
   - Delegate to trend engine

7. **Reminder vs Diary Completion**
   - Compare habit consistency rate vs diary completion rate
   - Label: "You've been keeping up with your reminders even better than your diary."
   - Requires: both rates available

8. **Stable Wake Time Streak**
   - Consecutive days where wake time within ±30 min of average
   - Label: "You've woken up at a consistent time for N days in a row."

All patterns labeled as **associations**, not causes.

---

## 8. Insight Card System

### 8.1 Card Model
```typescript
interface InsightCard {
  id: string;
  type: "metric" | "pattern" | "encouragement" | "behavioral_focus";
  priority: number;
  titleKey: string;
  bodyKey: string;
  evidence: InsightEvidence;
  confidence: "low" | "medium" | "high";
  dataSufficiency: DataSufficiency;
  action?: InsightAction;
}

interface InsightEvidence {
  metricKey: MetricKey;
  period: string;
  sampleSize: number;
  dataPoints?: number[];
  supportingPatterns?: string[];
}
```

### 8.2 Prioritization
- Show 3-5 cards maximum
- Priority tiers:
  1. Strong pattern with high confidence (most actionable)
  2. Significant trend (improving or declining)
  3. Positive reinforcement (streak, consistency)
  4. Gentle observation (mild pattern)
  5. Encouragement / baseline-building (low data)

### 8.3 Explainability
Every card answers:
- What was observed? → `titleKey` + `bodyKey`
- Which data supports it? → `evidence.dataPoints`
- Over what time period? → `evidence.period`
- How many records? → `evidence.sampleSize`
- Why is this shown? → derived from `type` + `confidence`
- What next step? → `action` (if present)

---

## 9. Weekly Summary

### 9.1 Contents
1. Recorded nights count
2. Diary completion rate
3. Average total sleep time
4. Average sleep efficiency
5. Average sleep onset latency
6. Average bedtime (circular)
7. Average wake time (circular)
8. Bedtime variability (SD)
9. Wake time variability (SD)
10. Reminder completion (from habit engine)
11. Current habit consistency
12. Strongest positive pattern
13. Area to observe next

### 9.2 Navigation
- Previous week / next week buttons
- "This week" quick return
- Disabled for future weeks

### 9.3 Data Integrity
- Recorded data vs derived metrics clearly labeled
- No fabrication of missing values
- Missing days shown explicitly as gaps

---

## 10. Monthly Summary

### 10.1 Contents
1. Number of recorded nights
2. Average key metrics (TST, SE, SOL)
3. Weekly trend comparison (week 1 → week 4)
4. Diary consistency streak / best streak
5. Habit progress overview
6. Sleep schedule regularity score
7. Notable changes (2+ significant metric shifts)
8. Insufficient-data messaging where applicable

### 10.2 Tone
- Self-reflection tool, not clinical report
- Calm language, no alarmist wording
- Emphasize patterns over individual data points

---

## 11. Guided Weekly Reflection

### 11.1 Flow
1. User opens weekly reflection
2. System presents 3-4 rule-selected prompts
3. User writes responses (can skip)
4. User saves reflection
5. Reflection stored separately from diary records

### 11.2 Prompt Categories (rule-selected)
- Routine consistency: "What helped you keep a more consistent routine?"
- Recording ease: "What made sleep recording easier or harder?"
- Manageable parts: "Which part of your routine felt most manageable?"
- Next week observation: "What would you like to observe next week?"
- Wins: "What's one thing that went well this week?"
- Challenges: "What was challenging about this week?"

### 11.3 Storage
- New storage key: `somna.weekly-reflections.v1`
- Separate from daily reflections and diary records
- `WeeklyReflection` interface with `weekStart`, `responses`, `createdAt`, `updatedAt`
- User-owned: exportable, deletable

### 11.4 Constraints
- Saving does NOT modify diary records
- All text localized
- Prompts rule-selected, NOT AI-generated
- Users may skip any prompt
- Users may edit saved reflections

---

## 12. Weekly Focus (Rule-Based)

### 12.1 Categories
```typescript
type WeeklyFocusCategory =
  | "recording_consistency"
  | "wake_time_consistency"
  | "bedtime_observation"
  | "reminder_routine"
  | "baseline_building"
  | "maintenance";
```

### 12.2 Selection Rules (priority order)
1. **baseline_building**: < 3 diary records this week
2. **recording_consistency**: diary completion < 50%
3. **wake_time_consistency**: wake time SD > 45 min and efficiency < 85%
4. **bedtime_observation**: bedtime SD > 60 min
5. **reminder_routine**: habit consistency < 50% (and has active reminders)
6. **maintenance**: everything going well (efficiency ≥ 85%, regularity ≥ 70%)

### 12.3 User Actions
- Accept focus (sets as this week's focus)
- Dismiss (don't show this week)
- Save for later

### 12.4 Constraint
- NEVER automatically changes reminders or sleep schedule
- Suggestion only; user must act explicitly

---

## 13. Dashboard Integration Plan

Extended dashboard hierarchy (added sections marked ✨):

```
Dashboard
├── Current Overview (existing — Today's Recommendation)
├── Key Metrics Row (existing — extended with more metrics) ✨
├── Trend Range Selector ✨
├── Trend Charts (existing — extended with metric toggle) ✨
├── Insight Cards (new section — 3-5 explainable cards) ✨
├── Weekly Summary (new section) ✨
├── Habit Progress (existing)
├── Program Progress (existing)
├── Guided Reflection (new section — entry point) ✨
├── Next-Week Focus (new section) ✨
├── Streak (existing)
└── Share CTA (existing)
```

---

## 14. Data Migration Requirements

- **No migration of existing diary records** — analytics is read-only
- **New storage keys**: weekly reflections only
  - Key: `somna.weekly-reflections.v1`
  - Default: empty array
  - No legacy data to migrate
- **Legacy data handling**: malformed localStorage entries handled by safe-storage + validation
- **Derived analytics**: recalculated on load, not persisted (avoids stale data)

---

## 15. Implementation Sequence

### Phase F.1 — Foundation
1. Analytics types and interfaces
2. Date range / time window utilities
3. Core metric calculations (circular avg, TST, regularity)
4. Data sufficiency framework
5. Unit tests for all of the above

### Phase F.2 — Trend & Pattern Engine
1. Trend analysis service
2. Pattern detection rules
3. Unit tests

### Phase F.3 — Insight & Summary Engine
1. Insight card generation and prioritization
2. Weekly summary aggregation
3. Monthly summary aggregation
4. Unit tests

### Phase F.4 — Weekly Reflection
1. Weekly reflection types
2. Rule-based prompt selection
3. SSR-safe storage
4. Unit tests

### Phase F.5 — Weekly Focus
1. Focus selection rules
2. Focus storage (user accept/dismiss)
3. Unit tests

### Phase F.6 — Dashboard UI
1. Metric cards
2. Trend range selector
3. Enhanced chart with metric toggle
4. Insight cards section
5. Weekly summary component
6. Monthly summary component
7. Weekly reflection flow component
8. Weekly focus card
9. Data sufficiency banners

### Phase F.7 — Localization
1. English base strings
2. Spanish translations
3. Portuguese translations
4. Polish translations
5. German translations

### Phase F.8 — Integration & Validation
1. Dashboard route integration
2. Integration tests
3. SSR safety verification
4. Type-check
5. Build validation
6. Documentation

---

## 16. Known Limitations

1. **No WASO field**: WASO is estimated at 10 min/awakening (matching existing efficiency convention). Real per-awakening duration not captured.
2. **No individual awakening timestamps**: Cannot compute detailed sleep architecture.
3. **Limited pattern set**: Only patterns derivable from existing 9 fields. No caffeine/exercise/mood correlations (mood field exists but is 1-5 rating only).
4. **Local-only analytics**: No server-side analytics (consistent with local-first architecture).
5. **No AI/ML in Phase F**: All rules are deterministic and explainable.
6. **Single timezone assumption**: Analytics uses local dates from record `date` field; multi-timezone travel not specially handled.
7. **Chart animations**: Recharts animations present; need `isAnimationActive` respect for reduced motion.
8. **Monthly summary**: Lightweight self-reflection view, not comprehensive clinical report.

---

## 17. Performance Considerations

- All analytics functions are **pure** → safely memoizable
- `useSleepAnalytics` hook wraps calculations in `useMemo`
- No storage writes from analytics layer (except weekly reflections, user-initiated)
- Chart transformations memoized on metric key + window size
- No event log scanning for analytics (reads only from record array)
- Large record sets: O(n) per metric, total O(n) pass with all metrics batched

---

## 18. Test Coverage Plan

### Unit Tests
- ✅ Sleep efficiency calculation (already exists via computeEfficiency)
- ✅ Time in bed (already exists via minutesInBed)
- ✅ Circular average bedtime
- ✅ Circular average wake time
- ✅ Date-range selection (7/14/30/90d, week boundaries, month boundaries)
- ✅ Timezone grouping / DST boundary handling
- ✅ Empty datasets (all metrics return null/0 safely)
- ✅ Invalid records (malformed data doesn't crash)
- ✅ Data sufficiency thresholds
- ✅ Trend classification (all directions, edge cases)
- ✅ Meaningful change thresholds
- ✅ Weekly summary structure
- ✅ Monthly summary structure
- ✅ Insight prioritization (sort order, max cards)
- ✅ Weekly focus selection (all categories)
- ✅ Habit metric integration (read-only consumption)

### Integration Tests
- ✅ Diary records → dashboard metrics
- ✅ Reminder events → weekly summary
- ✅ Reflections save/reload
- ✅ Next-week focus generation
- ✅ Empty data rendering
- ✅ Partial data rendering
- ✅ Malformed storage safety
- ✅ No raw translation keys visible

---

*End of Phase F Implementation Plan*
