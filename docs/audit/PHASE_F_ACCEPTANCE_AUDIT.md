# Phase F Acceptance Audit

## Sleep Diary v2.4 — Behavior Analytics, Insight Dashboard & Weekly Reflection Engine

**Audit Date:** 2026-07-28
**Auditor:** Automated architecture & code audit
**Status:** ⚠️ NOT ACCEPTED — MEDIUM FIXES REQUIRED

---

## 1. Executive Summary

Phase F introduces a substantial analytics layer to the Somna sleep diary: 14 canonical metrics, circular time math, trend/pattern detection, insight cards, weekly/monthly summaries, a rule-based weekly focus engine, and a weekly reflection system. The core architecture is sound — pure computation over canonical records, SSR-safe storage boundaries, and deterministic rule-based logic.

However, the implementation has **medium-severity issues** that block acceptance:

1. **TypeScript compilation fails with 191 errors**, including 4 Phase F-specific errors in `dashboard.tsx` (missing `ProgramNextLessonCard`, wrong `SleepChart` props, wrong `TrendRangeSelector` props, `DashboardShareCard` type mismatch) and additional errors in reflection systems.
2. **Tests cannot run** — the analytics tests use `node:test` with bare import specifiers (no `.js` extensions), causing `ERR_MODULE_NOT_FOUND`. The reflection tests use `describe/it/expect` (Jest-style) but Jest is not configured.
3. **Two separate reflection systems exist** (`src/lib/reflection/` for daily diary reflections and `src/lib/weekly-reflection/` for weekly reflection) — the relationship and ownership boundaries are unclear.
4. **The `reminder completion rate` metric is missing** from the 14 claimed canonical metrics (only diary completion rate exists in the metrics system).
5. **`eligibleDays` bug in `useSleepAnalytics`**: `Math.min(periodDays, Math.max(1, recordCount))` means eligible days is capped at record count, so diary completion rate is always 100% or less but never reflects true eligible days (e.g., 7 records in a 30-day window = 7 eligible days → 100% completion).

### Severity Summary

| Level    | Count |
| -------- | ----- |
| Critical | 0     |
| High     | 2     |
| Medium   | 8     |
| Low      | 12    |

### Build Status

- **Production build:** ✅ SUCCEEDS (Vite build passes despite TS errors — type checking is not part of the build)
- **TypeScript (tsc --noEmit):** ❌ 191 errors (4 directly in Phase F dashboard integration, rest include pre-existing and reflection-related)
- **Unit tests:** ❌ Cannot run (ESM import resolution + mixed test runner styles)

---

## 2. Claim Verification Matrix

| #   | Claim                                            | Status                 | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --- | ------------------------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 14 canonical metrics exist                       | **VERIFIED**           | [metrics.ts:17-31](src/lib/analytics/types.ts#L17-L31) `MetricKey` union has 14 entries: timeInBed, totalSleepTime, sleepEfficiency, sleepOnsetLatency, wakeAfterSleepOnset, numberOfAwakenings, avgBedtime, avgWakeTime, bedtimeVariability, wakeTimeVariability, sleepRegularity, diaryCompletionRate, sleepQuality, mood                                                                                                                                                                      |
| 2   | Circular time averaging is correctly implemented | **VERIFIED**           | [metrics.ts:54-79](src/lib/analytics/metrics.ts#L54-L79) `circularAverageMinutes` uses vector mean (sin/cos), atan2 for mean angle. Tested with midnight wrap-around case in [metrics.test.ts:72-86](src/lib/analytics/metrics.test.ts#L72-L86)                                                                                                                                                                                                                                                  |
| 3   | 8 time windows exist                             | **VERIFIED**           | [types.ts:59](src/lib/analytics/types.ts#L59) `WindowKey = "7d" \| "14d" \| "30d" \| "90d" \| "thisWeek" \| "lastWeek" \| "thisMonth" \| "lastMonth"` = 8 windows                                                                                                                                                                                                                                                                                                                                |
| 4   | 4-level data sufficiency exists                  | **VERIFIED**           | [types.ts:36-40](src/lib/analytics/types.ts#L36-L40) `DataSufficiency = "none" \| "insufficient" \| "limited" \| "sufficient"`. Implemented in [sufficiency.ts:16-24](src/lib/analytics/sufficiency.ts#L16-L24)                                                                                                                                                                                                                                                                                  |
| 5   | Trend thresholds are deterministic               | **VERIFIED**           | [trends.ts:38-53](src/lib/analytics/trends.ts#L38-L53) `MEANINGFUL_CHANGE` record with explicit numeric thresholds per metric                                                                                                                                                                                                                                                                                                                                                                    |
| 6   | Confidence is rule-based                         | **VERIFIED**           | [trends.ts:124-140](src/lib/analytics/trends.ts#L124-L140) `assessConfidence()` uses min sample size + change magnitude vs threshold ratio. No probability.                                                                                                                                                                                                                                                                                                                                      |
| 7   | 8 pattern detectors exist                        | **PARTIALLY VERIFIED** | [patterns.ts:269-302](src/lib/analytics/patterns.ts#L269-L302) `detectPatterns()` runs 5 detectors (weekend bedtime, weekend wake, consistent wake, variable bedtime, stable wake streak) + 1 optional (reminder-diary) = **6 pattern types** with 2 direction variants each (later/earlier) producing up to 8 distinct `PatternKey` values. The type union has 9 keys including `stable_wake_streak`. Claim of "8" is close but counts direction variants as separate detectors.                |
| 8   | Insight generation returns 3–5 cards             | **VERIFIED**           | [insights.ts:274-278](src/lib/analytics/insights.ts#L274-L278) Returns `cards.slice(0, maxCards)` where `maxCards = suf === "sufficient" ? 5 : 4`. Range is 1–5 depending on data state.                                                                                                                                                                                                                                                                                                         |
| 9   | Weekly summaries exist                           | **VERIFIED**           | [weekly-summary.ts:28-85](src/lib/analytics/weekly-summary.ts#L28-L85) `buildWeeklySummary()` returns `WeeklySummary` type                                                                                                                                                                                                                                                                                                                                                                       |
| 10  | Monthly summaries exist                          | **VERIFIED**           | [monthly-summary.ts:35-99](src/lib/analytics/monthly-summary.ts#L35-L99) `buildMonthlySummary()` returns `MonthlySummary` type                                                                                                                                                                                                                                                                                                                                                                   |
| 11  | 6-rule weekly focus engine exists                | **VERIFIED**           | [weekly-focus.ts:73-199](src/lib/analytics/weekly-focus.ts#L73-L199) 6 rules in priority order: baseline_building, recording_consistency, wake_time_consistency, bedtime_observation, reminder_routine, maintenance + fallback                                                                                                                                                                                                                                                                   |
| 12  | 10 reflection prompts across 8 categories exist  | **PARTIALLY VERIFIED** | [weekly-reflection/prompts.ts:24-85](src/lib/weekly-reflection/prompts.ts#L24-L85) `ALL_PROMPTS` has 10 prompts across 8 categories: routine_consistency (2), recording_ease (1), manageable_parts (1), next_week_observation (1), wins (2), challenges (1), gratitude (1), sleep_confidence (1). **VERIFIED for weekly reflection.** However, there is also a separate daily reflection system in `src/lib/reflection/` with its own prompts.                                                   |
| 13  | Reflection storage is SSR-safe                   | **VERIFIED**           | [weekly-reflection/storage.ts:72-76](src/lib/weekly-reflection/storage.ts#L72-L76) Uses `safeLocalStorageGet` from `src/lib/safe-storage.ts` which checks `isBrowser()` before accessing `window.localStorage`                                                                                                                                                                                                                                                                                   |
| 14  | 9 analytics components exist                     | **VERIFIED**           | [components/analytics/index.ts:5-13](src/components/analytics/index.ts#L5-L13) Exports 9 components: MetricCard, TrendRangeSelector, SleepChart, InsightCard, InsightSection, WeeklySummary, WeeklyFocusCard, WeeklyReflectionFlow, DataSufficiencyBanner                                                                                                                                                                                                                                        |
| 15  | 4 Dashboard sections were added                  | **VERIFIED**           | [dashboard.tsx:418-534](src/routes/dashboard.tsx#L418-L534) F1=Analytics Overview+Chart, F2=Insights, F3=Weekly Summary+Focus (side-by-side), F4=Weekly Reflection                                                                                                                                                                                                                                                                                                                               |
| 16  | Recharts is used safely                          | **PARTIALLY VERIFIED** | Recharts is used via `ResponsiveContainer` in [SleepChart.tsx](src/components/analytics/SleepChart.tsx) and in the existing dashboard trend chart. **However**, there is no client-only rendering gate — components render during SSR with Recharts which uses `useEffect`-based measurement. The `analyticsHydrated` guard in dashboard means the Phase F charts are client-only. The existing 7-day chart renders during SSR (Recharts should handle this but hydration mismatch risk exists). |
| 17  | 67 tests exist and pass                          | **FALSE**              | Tests cannot run. Analytics tests use `node:test` with bare `.ts` imports (ESM resolution fails). Reflection tests use Jest-style `describe/it/expect` but no Jest config. Counting `it(` occurrences: analytics=67, reflection=35, safe-storage=unknown. **No test suite can execute successfully in the current configuration.**                                                                                                                                                               |
| 18  | 5 locales are complete                           | **PARTIALLY VERIFIED** | All 5 analytics locale files (en, de, es, pl, pt) have 146 `analytics.`-prefixed keys each. However: (1) the `de` locale is missing from some other i18n systems (e.g., `calc-i18n`, audio player), (2) `pt-BR` content exists but analytics locale is `pt` (may not match `Locale` type exactly), (3) raw keys can appear when translations are missing due to fallback-to-key behavior.                                                                                                        |
| 19  | No Phase F TypeScript errors exist               | **FALSE**              | 4 Phase F-specific errors in [dashboard.tsx](src/routes/dashboard.tsx): missing `ProgramNextLessonCard`, wrong `SleepChart` props (metric vs window), wrong `TrendRangeSelector` props, `DashboardShareCard` type mismatch. Additional errors in the reflection systems (`reflection-ui.ts` extra `word` property, `reflection-validation.ts` Zod enum issues).                                                                                                                                  |
| 20  | Phase F is privacy compliant                     | **VERIFIED**           | All analytics is computed client-side from local storage. No third-party data transmission. No clinical/diagnostic language found in analytics copy. Derived data is user-owned and recalculable.                                                                                                                                                                                                                                                                                                |

---

## 3. Data Ownership Matrix

### Write Paths

| Data Domain            | Storage Key                       | Module                             | Writable By                     | Canonical?                          |
| ---------------------- | --------------------------------- | ---------------------------------- | ------------------------------- | ----------------------------------- |
| Sleep Diary Records    | `somna.sleep-records.v1`          | `sleep-records.ts`                 | Diary page, import              | ✅ Canonical                        |
| Analytics (derived)    | _None — computed at render_       | `lib/analytics/*.ts`               | Read-only computation           | ❌ Derived only                     |
| Weekly Focus Responses | `somna.weekly-focus.v1`           | `analytics/weekly-focus.ts`        | Dashboard (accept/dismiss/save) | ❌ User-owned derived               |
| Weekly Reflections     | `somna.weekly-reflections.v1`     | `weekly-reflection/storage.ts`     | WeeklyReflectionFlow component  | ✅ User-owned (separate from diary) |
| Daily Reflections      | `somna.reflections.v1` (presumed) | `reflection/reflection-storage.ts` | Diary reflection editor         | ✅ User-owned (separate from diary) |
| Habit/Reminder Data    | `somna.reminders.v1`              | `habit/habit-storage.ts`           | Reminders page                  | ✅ Canonical (habit domain)         |
| Sync Reflections (DB)  | D1 `reflections` table            | `sync/db/reflections-db.ts`        | Sync service (authenticated)    | ✅ Server-side mirror               |

### Verification of Claims

| Claim                                                                | Status       | Evidence                                                                                                                                                                 |
| -------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Sleep Diary records remain canonical                                 | **VERIFIED** | Analytics imports SleepRecord type read-only. No write calls from analytics modules.                                                                                     |
| Analytics never overwrite diary records                              | **VERIFIED** | No analytics module imports `saveRecords` or calls `localStorage.setItem` on sleep-records keys.                                                                         |
| Summaries are derived only                                           | **VERIFIED** | `buildWeeklySummary()` and `buildMonthlySummary()` are pure functions returning objects — no side effects.                                                               |
| Insights are derived only                                            | **VERIFIED** | `generateInsights()` is a pure function of records + habit progress.                                                                                                     |
| Weekly focus is derived only                                         | **VERIFIED** | `generateWeeklyFocus()` is pure. User responses (accept/dismiss/save) are stored separately in `somna.weekly-focus.v1`.                                                  |
| Reflection data is stored separately                                 | **VERIFIED** | Weekly reflections use `somna.weekly-reflections.v1`. Daily diary reflections use their own storage. Neither modifies sleep records.                                     |
| Reminder and habit data consumed through existing service boundaries | **VERIFIED** | Analytics imports `HabitProgress` type and `calculateAllHabitProgress` from the habit service. No direct storage access.                                                 |
| No Dashboard component duplicates canonical metric ownership         | **VERIFIED** | Dashboard only displays metrics computed by `useSleepAnalytics` hook.                                                                                                    |
| No derived metric is persisted unless explicitly justified           | **VERIFIED** | Only weekly focus user responses (user action, not derived metric) and weekly reflections (user-authored content) are persisted. Metrics themselves are never persisted. |

---

## 4. Metric Audit

### All 14 Canonical Metrics

| #   | Metric Name         | Source Fields                                      | Formula                                      | Invalid Input                     | Missing Data                           | TZ Handling                    | Unit        | Test Coverage                              | File                                                         |
| --- | ------------------- | -------------------------------------------------- | -------------------------------------------- | --------------------------------- | -------------------------------------- | ------------------------------ | ----------- | ------------------------------------------ | ------------------------------------------------------------ |
| 1   | timeInBed           | bedtime, wakeUpTime                                | `minutesInBed(bedtime, wakeUpTime)` averaged | Returns null if TIB <= 0          | Returns null for empty array           | Cross-midnight safe (circular) | minutes     | Partially (via computeMetrics bundle test) | [metrics.ts:422-423](src/lib/analytics/metrics.ts#L422-L423) |
| 2   | totalSleepTime      | bedtime, wakeUpTime, sleepLatency, nightAwakenings | `TIB - SOL - (awakenings × 10min)`           | Returns null if TIB <= 0          | Returns null for empty array           | N/A (duration)                 | minutes     | ✅ 2 test cases                            | [metrics.ts:123-133](src/lib/analytics/metrics.ts#L123-L133) |
| 3   | sleepEfficiency     | sleepEfficiency (per-record)                       | Mean of per-record values                    | Uses record as-is                 | Returns null for empty array           | N/A                            | percent     | ✅ Via computeMetrics                      | [metrics.ts:414,429](src/lib/analytics/metrics.ts#L414)      |
| 4   | sleepOnsetLatency   | sleepLatency                                       | Mean of per-record values                    | Uses record as-is                 | Returns null for empty array           | N/A                            | minutes     | ✅ Via computeMetrics                      | [metrics.ts:415,430-431](src/lib/analytics/metrics.ts#L415)  |
| 5   | wakeAfterSleepOnset | nightAwakenings                                    | `nightAwakenings × 10min`, then mean         | Always valid (non-negative)       | Returns null for empty array           | N/A                            | minutes     | Indirect                                   | [metrics.ts:136-138](src/lib/analytics/metrics.ts#L136-L138) |
| 6   | numberOfAwakenings  | nightAwakenings                                    | Mean of per-record values                    | Uses record as-is                 | Returns null for empty array           | N/A                            | count       | Indirect                                   | [metrics.ts:417,434-437](src/lib/analytics/metrics.ts#L417)  |
| 7   | avgBedtime          | bedtime                                            | Circular mean of bedtimes                    | Invalid format → h=0 (safe)       | Returns null for empty array           | ✅ Circular, handles midnight  | HH:MM       | ✅ Midnight wrap-around tested             | [metrics.ts:161-165](src/lib/analytics/metrics.ts#L161-L165) |
| 8   | avgWakeTime         | wakeUpTime                                         | Circular mean of wake times                  | Invalid format → h=0 (safe)       | Returns null for empty array           | ✅ Circular                    | HH:MM       | Indirect                                   | [metrics.ts:167-172](src/lib/analytics/metrics.ts#L167-L172) |
| 9   | bedtimeVariability  | bedtime                                            | Circular std dev of bedtimes                 | Invalid format → h=0              | Returns null for empty, 0 for 1 record | ✅ Circular                    | minutes     | Partially                                  | [metrics.ts:175-178](src/lib/analytics/metrics.ts#L175-L178) |
| 10  | wakeTimeVariability | wakeUpTime                                         | Circular std dev of wake times               | Invalid format → h=0              | Returns null for empty, 0 for 1 record | ✅ Circular                    | minutes     | Partially                                  | [metrics.ts:181-184](src/lib/analytics/metrics.ts#L181-L184) |
| 11  | sleepRegularity     | bedtime, wakeUpTime                                | `100 - avgVariability × 0.5`                 | Returns null if < 3 records       | Returns null if < 3 records            | ✅ Based on circular SD        | 0-100 score | ✅ 3 test cases                            | [metrics.ts:202-220](src/lib/analytics/metrics.ts#L202-L220) |
| 12  | diaryCompletionRate | date                                               | `uniqueDays / eligibleDays × 100`            | Returns null if eligibleDays <= 0 | Returns 0 if 0 records (not null)      | N/A                            | percent     | ✅ 3 test cases                            | [metrics.ts:228-235](src/lib/analytics/metrics.ts#L228-L235) |
| 13  | sleepQuality        | sleepQuality                                       | Mean of per-record values                    | Uses record as-is                 | Returns null for empty array           | N/A                            | 1-5 rating  | Indirect                                   | [metrics.ts:418,444-446](src/lib/analytics/metrics.ts#L418)  |
| 14  | mood                | mood                                               | Mean of per-record values                    | Uses record as-is                 | Returns null for empty array           | N/A                            | 1-5 rating  | Indirect                                   | [metrics.ts:419,447](src/lib/analytics/metrics.ts#L419)      |

### Critical Findings

#### FINDING M-1 (MEDIUM): `eligibleDays` bug in `useSleepAnalytics`

- **Location:** [useSleepAnalytics.ts:65-68](src/hooks/useSleepAnalytics.ts#L65-L68)
- **Issue:** `eligibleDays = Math.min(periodDays, Math.max(1, recordCount))` caps eligible days at record count, meaning `diaryCompletionRate` will always be 100% or near 100% — it can never show "you recorded 7 out of 30 days = 23% completion."
- **Impact:** Diary completion rate is misleading for rolling windows. Users see inflated completion percentages.
- **Expected behavior:** `eligibleDays` should equal the actual number of calendar days in the window.

#### FINDING M-2 (LOW): No `NaN` guard in `hhmmToMinutes`

- **Location:** [metrics.ts:26-29](src/lib/analytics/metrics.ts#L26-L29)
- **Issue:** Passing an invalid string like `"abc:def"` results in `h=NaN, m=NaN` which propagates through calculations.
- **Mitigation:** `(h || 0)` and `(m || 0)` pattern handles NaN → 0. `Number("abc")` is NaN, and `NaN || 0` → 0. **Actually safe.**

#### FINDING M-3 (LOW): `sleepEfficiency` is taken directly from records without validation

- **Location:** [metrics.ts:414](src/lib/analytics/metrics.ts#L414)
- **Issue:** If a record has `sleepEfficiency > 100` or `< 0`, the metric calculation passes it through.
- **Impact:** Outlier records could skew averages.
- **Mitigation:** This is a data validation concern at input time, not a metric formula concern.

#### FINDING M-4 (HIGH): Reminder completion rate missing from metrics

- The claim of 14 canonical metrics is verified, but "reminder completion rate" was implied as a key metric. It exists only in the weekly summary as a derived field from habit progress, not as a `MetricKey`.
- **PatternKey** includes `reminder_habit_stronger_than_diary` and `diary_stronger_than_reminders` for comparison purposes, but the reminder completion rate itself is not a first-class metric.

### Cross-Midnight Verification

✅ **Circular average correctly handles midnight.** The vector mean approach using `Math.sin`/`Math.cos`/`Math.atan2` correctly wraps around. Test case at [metrics.test.ts:72-78](src/lib/analytics/metrics.test.ts#L72-L78) verifies 23:00 + 01:00 → ~00:00 (not 12:00).

### Zero-Denominator Safety

✅ All division operations have guards:

- `mean()` → returns null for empty array
- `diaryCompletionRate()` → returns null if `eligibleDays <= 0`
- `percentageChange` in trends → returns null if `previousVal === 0`
- `avgHabitConsistency` → null if no active progress

---

## 5. Data Sufficiency Audit

### Thresholds

| Level        | Default (records) | Metrics Using            | Location                                                         |
| ------------ | ----------------- | ------------------------ | ---------------------------------------------------------------- |
| none         | 0                 | All metrics base         | [types.ts:49-54](src/lib/analytics/types.ts#L49-L54)             |
| insufficient | 1-2               | Default for most metrics | [sufficiency.ts:20-22](src/lib/analytics/sufficiency.ts#L20-L22) |
| limited      | 3-6               | Default for most metrics | [sufficiency.ts:22-23](src/lib/analytics/sufficiency.ts#L22-L23) |
| sufficient   | 7+                | Default for most metrics | [sufficiency.ts:23](src/lib/analytics/sufficiency.ts#L23)        |

### Per-Metric Minimums

| Metric              | Min for "none" | Min for "insufficient" | Min for "limited" | Min for "sufficient" |
| ------------------- | -------------- | ---------------------- | ----------------- | -------------------- |
| Most scalar metrics | 0              | 1                      | 3                 | 7                    |
| bedtimeVariability  | 2              | 2                      | 4                 | 7                    |
| wakeTimeVariability | 2              | 2                      | 4                 | 7                    |
| sleepRegularity     | 3              | 3                      | 5                 | 10                   |

### Pattern Minimums

| Pattern Type         | Requirement                     | Location                                                    |
| -------------------- | ------------------------------- | ----------------------------------------------------------- |
| Weekend comparison   | ≥2 weekday + ≥2 weekend records | [sufficiency.ts:148](src/lib/analytics/sufficiency.ts#L148) |
| Consistency patterns | ≥3 records                      | [sufficiency.ts:149](src/lib/analytics/sufficiency.ts#L149) |
| Streak patterns      | ≥2 days                         | [sufficiency.ts:150](src/lib/analytics/sufficiency.ts#L150) |

### Trend Sufficiency

Trends require at least "limited" data in BOTH current and previous periods:

- [sufficiency.ts:131-142](src/lib/analytics/sufficiency.ts#L131-L142) `canShowTrend()` checks both periods

### Findings

| #   | Finding                                                                                                                                                                                                                                                                                    | Severity |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| S-1 | Trend calculation uses `metricSufficiency` for `insufficient_data` detection, but the trend system itself does not call `canShowTrend` — it relies on `"none"` sufficiency check only. A metric with 1 record in both periods (both "insufficient") would still attempt trend calculation. | MEDIUM   |
| S-2 | `calculateAllTrends` only computes trends for 9 of 14 metrics (skips timeInBed, numberOfAwakenings, avgBedtime, avgWakeTime, and both variabilities). Some of these have meaningful change thresholds defined but are never used.                                                          | LOW      |
| S-3 | Confidence is based on sample size and change magnitude but is not exposed as sufficiency level in UI consistently.                                                                                                                                                                        | LOW      |
| S-4 | `overallSufficiency` uses `DEFAULT_SUFFICIENCY` where `limited: 7` and `sufficient: 7`, meaning no record count actually produces "limited" in the default — only "insufficient" (1-6) and "sufficient" (7+). This appears to be a threshold configuration bug.                            | MEDIUM   |

**FINDING S-4 (MEDIUM):** `DEFAULT_SUFFICIENCY.limited = 7` and `DEFAULT_SUFFICIENCY.sufficient = 7` — the "limited" level is unreachable for overall sufficiency because both thresholds are 7. Any record with ≥7 is "sufficient"; records with 3-6 are "insufficient" (not "limited"). Per-metric sufficiency for variability/regularity correctly uses different thresholds.

---

## 6. Trend and Pattern Audit

### Trend Detectors

Trends are computed per metric by comparing the current period vs the previous period.

| Aspect            | Detail                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| Method            | Prior-period comparison (current N days vs N days before that)                                   |
| Metrics covered   | 9 of 14 (efficiency, TST, SOL, WASO, awakenings, regularity, completion rate, quality, mood)     |
| Meaningful change | Per-metric thresholds in `MEANINGFUL_CHANGE`                                                     |
| Direction         | improving / declining / stable / mixed / insufficient_data                                       |
| Confidence        | Rule-based: high (≥7 records + 1.5× threshold), medium (≥5 records + threshold), low (otherwise) |
| Circular metrics  | avgBedtime/avgWakeTime not in trend set despite having thresholds defined                        |

### Pattern Detectors

| #   | Pattern                                                            | Input                                 | Min Sample                       | Threshold                            | Output         | Confidence Rule                                    | Evidence Exposed                           | Test Coverage           |
| --- | ------------------------------------------------------------------ | ------------------------------------- | -------------------------------- | ------------------------------------ | -------------- | -------------------------------------------------- | ------------------------------------------ | ----------------------- |
| 1   | weekend_bedtime_later/earlier                                      | bedtime, date (weekday/weekend split) | ≥2 weekday, ≥2 weekend           | 20 min difference                    | PatternFinding | min(wd,we) ≥5→high, ≥3→medium, else→low            | weekday count, weekend count, diff minutes | None (integration only) |
| 2   | weekend_waketime_later/earlier                                     | wakeUpTime, date                      | ≥2 weekday, ≥2 weekend           | 20 min difference                    | PatternFinding | Same as above                                      | Same                                       | None                    |
| 3   | consistent_wake_time                                               | wakeUpTime                            | ≥3 records                       | SD ≤ 20 min                          | PatternFinding | ≥7→high, ≥5→medium, else→low                       | consistency score, sample sizes            | None                    |
| 4   | variable_bedtime                                                   | bedtime                               | ≥3 records                       | SD ≥ 45 min                          | PatternFinding | ≥7→high, ≥5→medium, else→low                       | SD minutes, sample sizes                   | None                    |
| 5   | stable_wake_streak                                                 | wakeUpTime, date                      | streak ≥ 3 days                  | 30 min threshold per consecutive day | PatternFinding | ≥7→high, ≥5→medium, else→low                       | streak days count                          | None                    |
| 6   | reminder_habit_stronger_than_diary / diary_stronger_than_reminders | records + habitProgress               | ≥0 habit entries (requires some) | 10 percentage point diff             | PatternFinding | min(records,progress) ≥7→high, ≥4→medium, else→low | diff percentage, sample sizes              | None                    |

### Findings

| #    | Finding                                                                                                                                                          | Severity |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| TP-1 | Patterns are correctly labeled as associations, not causal claims. Pattern description keys say "You tend to..." not "This causes..."                            | ✅ PASS  |
| TP-2 | No unsupported fields are used — only fields that exist on SleepRecord                                                                                           | ✅ PASS  |
| TP-3 | No clinical conclusions are generated in pattern detection code                                                                                                  | ✅ PASS  |
| TP-4 | Weekday/weekend split uses local date strings correctly via `isWeekday()` which uses `getDay()`                                                                  | ✅ PASS  |
| TP-5 | DST handling: Date arithmetic uses `setDate()` which is DST-safe for calendar dates                                                                              | ✅ PASS  |
| TP-6 | Trend comparison periods do not overlap — `calculateAllTrends` uses current period (last N days) vs previous period (N days before), clear separation            | ✅ PASS  |
| TP-7 | No dedicated unit tests for pattern detectors. Patterns are tested only indirectly if at all.                                                                    | MEDIUM   |
| TP-8 | `avgBedtime` and `avgWakeTime` have meaningful change thresholds defined (15 min) but are not included in `calculateAllTrends` metrics list. Dead configuration. | LOW      |
| TP-9 | Pattern evidence `weekdayValue`/`weekendValue` in weekend patterns store record counts, not actual metric values. The evidence field name is misleading.         | LOW      |

---

## 7. Insight Pipeline Audit

### Pipeline Flow

```
Diary Records
    ↓
Metric Calculation (computeMetrics)
    ↓
Trend Detection (calculateAllTrends → getPrimaryTrend)
    ↓
Pattern Detection (detectPatterns → top 2 + reminder pattern)
    ↓
Candidate Collection (trend + patterns + encouragement + streak)
    ↓
Priority Sort (numeric priority, descending)
    ↓
Top N (4 for limited/insufficient, 5 for sufficient)
    ↓
Displayed Insight Cards
```

### Design Verification

| Aspect                                  | Status          | Evidence                                                                                                                                                                                  |
| --------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prioritization is deterministic         | ✅ PASS         | Priority is numeric, sort is stable                                                                                                                                                       |
| Duplicate insights are prevented        | ⚠️ PARTIAL      | IDs are unique per type+key, but same insight could theoretically appear via multiple paths (not observed in practice)                                                                    |
| Conflicting insights are handled        | ❌ NOT VERIFIED | No explicit conflict resolution. A "variable bedtime" and "consistent wake time" insight can both appear — these are not contradictory per se, but no system checks for logical conflicts |
| Insufficient-data insights are filtered | ⚠️ PARTIAL      | Trend insights skip `insufficient_data` and `stable`. Encouragement insights show for low-data states. But pattern insights with `insufficient` sufficiency are still shown.              |
| Every insight contains evidence         | ✅ PASS         | All insight generators populate `evidence` with `metricKey`, `period`, `sampleSize`                                                                                                       |
| Every insight contains sample size      | ✅ PASS         | `evidence.sampleSize` populated in all cases                                                                                                                                              |
| Every insight uses localized copy       | ✅ PASS         | All text uses `titleKey`/`bodyKey` — translation keys, not raw text                                                                                                                       |
| Raw translation keys cannot appear      | ⚠️ PARTIAL      | If a key is missing, the i18n system may return the key itself as fallback. This depends on the i18n implementation.                                                                      |
| Cards do not claim medical causality    | ✅ PASS         | Language uses observational phrasing. No diagnostic terms found.                                                                                                                          |

### Findings

| #   | Finding                                                                                                                                                                                                                                 | Severity |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| I-1 | Insight count can be 1 (empty data → 1 encouragement card) but claim says "3–5 cards". The actual range is 1–5 depending on data state.                                                                                                 | LOW      |
| I-2 | `calculateCurrentStreak` in insights module duplicates/reimplements streak logic from the metrics module (`longestStreak`). Slight differences: streak counts backwards from today, while longestStreak finds the longest run anywhere. | LOW      |
| I-3 | No explicit deduplication of insights by category/type. A pattern insight and a trend insight about the same metric could both appear.                                                                                                  | LOW      |

---

## 8. Weekly and Monthly Summary Audit

### Weekly Summary

| Aspect                                             | Status         | Evidence                                                                                                                                                     |
| -------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Correct date windows (Mon-Sun)                     | ✅ PASS        | Uses `weekStart()` and `weekEnd()` from date-ranges                                                                                                          |
| Timezone grouping                                  | ✅ PASS        | Uses local date strings (YYYY-MM-DD), implicitly local timezone                                                                                              |
| Previous/current period comparisons                | ❌ NOT PRESENT | Weekly summary shows one week only. No comparison to previous week. Comparison exists in trend system but not in weekly summary.                             |
| Missing-day handling                               | ✅ PASS        | `recordedNights` vs `eligibleDays` are distinguished                                                                                                         |
| No future dates included                           | ✅ PASS        | `nextWeek()` caps at current week                                                                                                                            |
| Recorded nights vs eligible days                   | ✅ PASS        | Separate fields in `WeeklySummary` interface                                                                                                                 |
| Reminder completion not recalculated independently | ⚠️ PARTIAL     | Uses `calculateAllHabitProgress` from habit service (correct boundary), but weekly summary re-averages consistency rates independently of the pattern system |
| Strongest pattern selection is deterministic       | ✅ PASS        | `getStrongestPositivePattern()` returns first from pre-sorted array (sorted by confidence then sample size)                                                  |
| Area-to-observe selection is deterministic         | ✅ PASS        | `getAreaToObserve()` returns first concern pattern from pre-sorted array                                                                                     |

### Monthly Summary

| Aspect                        | Status  | Evidence                                                    |
| ----------------------------- | ------- | ----------------------------------------------------------- |
| Correct date windows          | ✅ PASS | Uses `monthStart()` and `monthEnd()`                        |
| Weekly breakdown within month | ✅ PASS | `buildWeeklySnapshots()` creates W1-Wn snapshots            |
| Notable changes from trends   | ✅ PASS | `detectNotableChanges()` uses 14-day trends for key metrics |
| No clinical conclusions       | ✅ PASS | Summary is presented as self-reflection tool                |
| Best streak tracking          | ✅ PASS | `longestStreak()` from metrics module                       |

### Test Coverage

**No dedicated unit tests** for weekly-summary.ts or monthly-summary.ts. Only indirectly covered if at all.

### Findings

| #    | Finding                                                                                           | Severity |
| ---- | ------------------------------------------------------------------------------------------------- | -------- |
| SM-1 | No unit tests for weekly or monthly summary builders                                              | MEDIUM   |
| SM-2 | No previous-week comparison in weekly summary despite being implied by "summary" concept          | LOW      |
| SM-3 | Monthly summary's `detectNotableChanges` uses hard-coded 14-day period regardless of month length | LOW      |
| SM-4 | `monthLabel` is hard-coded to `en-US` locale formatting — not localized                           | MEDIUM   |

---

## 9. Weekly Reflection Audit

### Architecture

There are **two reflection systems** in the codebase:

1. **Daily Diary Reflections** (`src/lib/reflection/`) — pre-existing daily reflection system tied to individual diary entries (handles guided reflection prompts per day, word count, stats, validation, Zod schemas). Uses `reflection-types.ts`, `reflection-storage.ts`, `reflection-prompts.ts`.

2. **Weekly Reflections** (`src/lib/weekly-reflection/`) — Phase F addition. Weekly (Mon-Sun) reflections with 3-4 rule-selected prompts, saved separately to `somna.weekly-reflections.v1`.

### Storage

- **Key:** `somna.weekly-reflections.v1`
- **Schema:** `WeeklyReflectionStorage { version: "1"; reflections: WeeklyReflection[] }`
- **WeeklyReflection:** id, weekStart, weekEnd, timezone, locale, responses[], wordCount, createdAt, updatedAt, syncStatus
- **SSR-safe:** ✅ Uses `safeLocalStorageGet` which returns default on server

### Feature Verification

| Feature                         | Status          | Evidence                                                                                                                                                                                                                             |
| ------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Prompt selection is rule-based  | ✅ PASS         | `selectWeeklyPrompts()` uses data-driven conditions                                                                                                                                                                                  |
| 8 prompt categories             | ✅ PASS         | 8 categories in `WeeklyReflectionPromptCategory` type                                                                                                                                                                                |
| 10 total prompts                | ✅ PASS         | 10 prompts in `ALL_PROMPTS`                                                                                                                                                                                                          |
| Prompts are localized           | ✅ PASS         | Prompts use `textKey` and `placeholderKey` translation keys                                                                                                                                                                          |
| Users can skip                  | ✅ PASS         | Skip button in [WeeklyReflectionFlow.tsx:275-288](src/components/analytics/WeeklyReflectionFlow.tsx#L275-L288)                                                                                                                       |
| Users can save                  | ✅ PASS         | Save button + `saveWeeklyReflection()`                                                                                                                                                                                               |
| Users can edit                  | ✅ PASS         | Edit button + `setIsEditing(true)` flow                                                                                                                                                                                              |
| History is preserved            | ⚠️ PARTIAL      | All reflections are stored, but there is no UI to browse history. Only the current/selected week is shown.                                                                                                                           |
| Deletion behavior exists        | ✅ PASS         | Delete button with confirm dialog in `handleDelete()`                                                                                                                                                                                |
| Separate from diary storage     | ✅ PASS         | Uses `somna.weekly-reflections.v1` key, not diary records                                                                                                                                                                            |
| SSR-safe storage                | ✅ PASS         | Uses `safeLocalStorageGet/Set`                                                                                                                                                                                                       |
| Malformed stored data is safe   | ✅ PASS         | `validateStorage()` validates and filters invalid entries                                                                                                                                                                            |
| Included in export/delete flows | ❌ NOT VERIFIED | The daily reflection system has sync DB support (`reflections-db.ts`), but weekly reflections appear to NOT be included in account export/delete flows. No references to weekly reflections found in account-api.ts or sync service. | MEDIUM |
| Never mutates diary records     | ✅ PASS         | No imports of diary save functions                                                                                                                                                                                                   |

### Findings

| #   | Finding                                                                                                                                                                                     | Severity |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| R-1 | Weekly reflections are not included in account data export/delete flows. Users who export or delete their account data will have weekly reflections left behind (local only) or not synced. | MEDIUM   |
| R-2 | Two parallel reflection systems (daily + weekly) with similar but not identical types, storage, and validation. The relationship is not documented.                                         | MEDIUM   |
| R-3 | No history browsing UI — users can only see the currently selected week's reflection.                                                                                                       | LOW      |
| R-4 | `locale: locale as any` in WeeklyReflectionFlow.tsx:122 — type assertion bypasses proper Locale type checking                                                                               | LOW      |
| R-5 | Reflection tests use Jest-style syntax but Jest is not configured — tests don't run                                                                                                         | MEDIUM   |

---

## 10. Weekly Focus Audit

### All 6 Rules

| #   | Rule ID               | Category              | Triggering Conditions                              | Priority    | Evidence                                 | Min Data     | Localized Output       | Accept | Dismiss | Save | Persistence  |
| --- | --------------------- | --------------------- | -------------------------------------------------- | ----------- | ---------------------------------------- | ------------ | ---------------------- | ------ | ------- | ---- | ------------ |
| 1   | baseline_building     | baseline_building     | recordCount < 3                                    | 1 (highest) | record count, metric=diaryCompletionRate | 0            | ✅ reasonKey+actionKey | ✅     | ✅      | ✅   | localStorage |
| 2   | recording_consistency | recording_consistency | completionRate < 50%                               | 2           | completion rate value                    | 3            | ✅                     | ✅     | ✅      | ✅   | localStorage |
| 3   | wake_time_consistency | wake_time_consistency | wakeSD > 45min AND efficiency < 85%                | 3           | wakeSD + efficiency                      | 3            | ✅                     | ✅     | ✅      | ✅   | localStorage |
| 4   | bedtime_observation   | bedtime_observation   | bedSD > 60min                                      | 4           | bedSD value                              | 3            | ✅                     | ✅     | ✅      | ✅   | localStorage |
| 5   | reminder_routine      | reminder_routine      | avgHabitConsistency < 50% AND has active reminders | 5           | consistency rate                         | 0+ reminders | ✅                     | ✅     | ✅      | ✅   | localStorage |
| 6   | maintenance           | maintenance           | efficiency ≥ 85% AND regularity ≥ 70               | 6 (lowest)  | efficiency + regularity                  | 3            | ✅                     | ✅     | ✅      | ✅   | localStorage |
| -   | default (fallback)    | bedtime_observation   | None of above match                                | -           | efficiency metric                        | any          | ✅                     | ✅     | ✅      | ✅   | localStorage |

### Verification

| Aspect                                  | Status                                                  |
| --------------------------------------- | ------------------------------------------------------- |
| Only one primary focus produced         | ✅ PASS — function returns single `WeeklyFocus \| null` |
| Result is deterministic                 | ✅ PASS — priority order is fixed, conditions are pure  |
| Does not automatically change reminders | ✅ PASS — focus is display-only suggestion              |
| No medical instruction generated        | ✅ PASS — all copy is observational and behavioral      |
| Low-data → baseline-building            | ✅ PASS — rule 1 catches < 3 records                    |
| Maintenance state supported             | ✅ PASS — rule 6 catches good efficiency + regularity   |

### Findings

| #   | Finding                                                                                                                                                                    | Severity |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| F-1 | Fallback defaults to `bedtime_observation` even when user has consistent bedtime but poor sleep quality, mood, etc. Could be more adaptive.                                | LOW      |
| F-2 | Focus `id` includes `now.getTime()` which makes it non-deterministic per render — two calls with same data produce different IDs. This could cause unnecessary re-renders. | LOW      |
| F-3 | No unit tests for weekly focus engine.                                                                                                                                     | MEDIUM   |

---

## 11. Dashboard Integration Audit

### Component Structure

```
Dashboard (dashboard.tsx)
├─ PageHero
├─ Section 1: Today's Recommendation (CBT-I Brain)
├─ Section 2: CBT-I Brain Metrics
├─ Section 2b: Program Progress
├─ Section 3: Last 7 Days Trend (existing chart)
├─ Section 4: Weekly Insight
├─ Section 5: Streak
├─ ─── PHASE F SECTIONS ───
├─ Section F1: Analytics Overview + SleepChart + TrendRangeSelector + DataSufficiencyBanner
├─ Section F2: InsightSection
├─ Section F3 (grid): WeeklySummary + WeeklyFocusCard
├─ Section F4: WeeklyReflectionFlow
├─ ─── END PHASE F ───
├─ Section 6: Habit Reminders
└─ DashboardShareCard
```

### Integration Quality

| Aspect                                  | Status        | Evidence                                                                                                                                                                         |
| --------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing sections not broken            | ⚠️ RISK       | Type errors suggest possible runtime issues. Build succeeds but types don't match.                                                                                               |
| Analytics sections are additive         | ✅ PASS       | Sections F1-F4 added below existing content                                                                                                                                      |
| Component ordering is intentional       | ✅ PASS       | Logical flow: overview → insights → summary/focus → reflection                                                                                                                   |
| Empty states render                     | ✅ PASS       | `analyticsHydrated` guard + sufficiency banner                                                                                                                                   |
| Partial data renders                    | ✅ PASS       | Null-safe rendering with "—" placeholders                                                                                                                                        |
| Malformed data does not crash           | ⚠️ UNCERTAIN  | Analytics functions are pure and null-safe, but the dashboard integration has type errors that may cause runtime issues                                                          |
| Direct URL navigation works             | ✅ PASS       | File-based route, no params required                                                                                                                                             |
| Page refresh works                      | ✅ PASS       | Client-side hydration pattern with `useEffect` for data loading                                                                                                                  |
| Client navigation works                 | ✅ PASS       | TanStack Router integration                                                                                                                                                      |
| Hydration is stable                     | ⚠️ PARTIAL    | `analyticsHydrated` state prevents SSR rendering of Phase F components (good). But the existing 7-day chart renders during SSR with Recharts which may cause hydration mismatch. |
| No browser API during SSR               | ✅ PASS       | All storage access in `useEffect` or `safeLocalStorage` guards                                                                                                                   |
| Calculations not repeated unnecessarily | ⚠️ PARTIAL    | `useMemo` in `useSleepAnalytics` hook, but weekly summary and monthly summary each recompute metrics internally (nested recomputation)                                           |
| Chart transformations memoized          | ✅ PASS       | `chartData` in SleepChart uses `useMemo`                                                                                                                                         |
| Excessive rerenders                     | ⚠️ UNVERIFIED | Multiple state variables in dashboard component could cause cascade rerenders. Not measured.                                                                                     |

### Type Errors in Dashboard Integration

**4 Phase F-specific errors:**

1. **Line 426:** `TrendRangeSelector` prop type mismatch — expected props differ from what's passed
2. **Line 487:** `SleepChart` receives `metric` prop but the component expects `window` prop — props don't match the component interface
3. **Line 601:** `ProgramNextLessonCard` is not defined but is called in JSX
4. **Line 604:** `DashboardShareCard` props type mismatch

These type errors mean the build succeeds (Vite doesn't type-check) but the components may have runtime issues or may not work as intended.

### Findings

| #   | Finding                                                                                                                                                             | Severity |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| D-1 | `SleepChart` is called with `metric` prop but expects `window` prop — props interface mismatch                                                                      | **HIGH** |
| D-2 | `ProgramNextLessonCard` is referenced but not defined/imported                                                                                                      | **HIGH** |
| D-3 | `TrendRangeSelector` props type mismatch                                                                                                                            | MEDIUM   |
| D-4 | `DashboardShareCard` props type mismatch                                                                                                                            | MEDIUM   |
| D-5 | Weekly summary and monthly summary both recompute metrics internally, even though `computeMetrics` was already called in `computeAnalytics` — redundant computation | LOW      |
| D-6 | Multiple `useState` hooks and `useEffect` in dashboard component make memoization boundaries complex                                                                | LOW      |

---

## 12. Recharts SSR Audit

### Phase F Chart (SleepChart)

| Aspect                        | Status             | Evidence                                                                                                    |
| ----------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| Module initialization         | ✅ Safe            | Imported at module level but only rendered client-side (behind `analyticsHydrated`)                         |
| window/document access        | ✅ Safe            | Recharts uses `useEffect`/`useRef` for measurement, which doesn't run during SSR                            |
| Responsive container behavior | ⚠️ Risk            | `ResponsiveContainer` may render 0-width on first render before hydration                                   |
| Hydration mismatch risk       | ⚠️ LOW RISK        | Entire chart is behind `analyticsHydrated && analytics.records.length > 0` guard — only renders client-side |
| Zero-width first render       | ⚠️ UNVERIFIED      | Could happen on initial hydration but chart has fixed height container                                      |
| Client-only rendering gate    | ✅ PASS            | `analyticsHydrated` state starts false, set to true in useEffect                                            |
| Reduced-motion behavior       | ❌ NOT IMPLEMENTED | `isAnimationActive` is hard-coded `true`. No `prefers-reduced-motion` check.                                | MEDIUM |
| Accessible chart labels       | ⚠️ PARTIAL         | `role="img"` with `aria-label` on chart container, but data points are not individually accessible          |
| No color-only communication   | ⚠️ PARTIAL         | Chart lines are color-coded but metric selector buttons also show text labels                               |
| Missing-data rendering        | ✅ PASS            | Missing dates have `null` values, `connectNulls={false}` shows gaps                                         |
| Missing dates vs zero values  | ✅ PASS            | Missing dates are `null`, not 0 — correctly treated as absence of data                                      |

### Existing Chart (7-day efficiency)

The existing trend chart (Section 3) renders during SSR with Recharts and does not have a hydration guard. This is a pre-existing pattern, not Phase F-specific.

### Findings

| #     | Finding                                                                                                                                         | Severity |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| RCH-1 | No `prefers-reduced-motion` support — animations always active                                                                                  | MEDIUM   |
| RCH-2 | `SleepChart` component has `window` in its interface but dashboard passes `metric` — the component will not work correctly as used in dashboard | HIGH     |
| RCH-3 | Individual data points in charts are not keyboard-accessible                                                                                    | LOW      |

---

## 13. Localization Audit

### Supported Locales (Repository-wide)

From `lang-detect.ts` and locale directories, the repository supports:

- `en` (English)
- `es` (Spanish)
- `pl` (Polish)
- `pt` / `pt-BR` (Portuguese)
- `de` (German) — partial (analytics locale exists, but missing from calc-i18n, audio player, and some other systems)
- `zh` (Chinese) — exists in some systems but not in analytics

### Phase F Analytics Locales

All 5 analytics locale files have 146 `analytics.`-prefixed keys and 29 `reflection.weekly`-prefixed keys:

| Locale | File                      | Analytics Keys | Reflection Keys | Status       |
| ------ | ------------------------- | -------------- | --------------- | ------------ |
| en     | `locales/analytics/en.ts` | 146            | 29              | ✅ Canonical |
| de     | `locales/analytics/de.ts` | 146            | 29              | ✅ Complete  |
| es     | `locales/analytics/es.ts` | 146            | 29              | ✅ Complete  |
| pl     | `locales/analytics/pl.ts` | 146            | 29              | ✅ Complete  |
| pt     | `locales/analytics/pt.ts` | 146            | 29              | ✅ Complete  |

### Key Verification

| Category                  | Count (approx) |
| ------------------------- | -------------- |
| Window labels             | 8              |
| Data sufficiency messages | 4              |
| Metric labels             | 14             |
| Units                     | ~5             |
| Trend explanations        | ~5             |
| Pattern descriptions      | ~8             |
| Insight titles + bodies   | ~30+           |
| Focus reasons + actions   | ~7             |
| Weekly summary labels     | ~15            |
| Weekly reflection UI      | 29             |
| Chart labels              | ~5             |

### Findings

| #   | Finding                                                                                                        | Severity |
| --- | -------------------------------------------------------------------------------------------------------------- | -------- |
| L-1 | `zh` (Chinese) locale is missing from analytics despite existing elsewhere in the app                          | MEDIUM   |
| L-2 | `monthLabel` in monthly summary uses hard-coded `en-US` `toLocaleDateString` — not localized                   | MEDIUM   |
| L-3 | Fallback-to-key behavior in i18n means missing translations show raw keys to users instead of English fallback | MEDIUM   |
| L-4 | `de` locale exists for analytics but is incomplete in other systems (calc-i18n, audio player) — pre-existing   | LOW      |
| L-5 | `pt` vs `pt-BR` naming inconsistency between analytics locale file (`pt`) and content directories (`pt-BR`)    | LOW      |
| L-6 | Date formatting in chart labels (`date.slice(5)` = MM-DD) is not locale-aware                                  | LOW      |
| L-7 | Duration formatting in dashboard (`formatMinutes`) is hard-coded English ("h", "m") — not localized            | MEDIUM   |

---

## 14. Accessibility Audit

| Aspect                         | Status                                 | Evidence                                                                                         |
| ------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Semantic heading hierarchy     | ❌ NOT VERIFIED — MANUAL TEST REQUIRED | Dashboard uses `<div>` and text styling, not `<h2>`/`<h3>` for section titles                    |
| Keyboard navigation            | ❌ NOT VERIFIED — MANUAL TEST REQUIRED | Buttons are focusable. Chart data points are not.                                                |
| Focus states                   | ❌ NOT VERIFIED — MANUAL TEST REQUIRED |                                                                                                  |
| Accessible charts              | ⚠️ PARTIAL                             | `role="img" aria-label` on chart containers, but data not accessible as table/text               |
| Screen-reader metric summaries | ❌ NOT VERIFIED — MANUAL TEST REQUIRED | Metric values are text nodes but may lack proper labeling                                        |
| Non-color trend indicators     | ❌ NOT VERIFIED — MANUAL TEST REQUIRED | Trend arrows use color + icon but may rely on color alone in some contexts                       |
| Accessible evidence disclosure | ❌ NOT VERIFIED — MANUAL TEST REQUIRED |                                                                                                  |
| Accessible reflection forms    | ⚠️ PARTIAL                             | Textarea has `aria-label`, form has no explicit `<form>` element, no `aria-live` for save status |
| Live-region behavior           | ❌ NOT IMPLEMENTED                     | Save status (saved/error) is visual only, no `aria-live` region                                  |
| Reduced-motion handling        | ❌ NOT IMPLEMENTED                     | `isAnimationActive={true}` hard-coded                                                            |
| Contrast compliance            | ❌ NOT VERIFIED — MANUAL TEST REQUIRED |                                                                                                  |
| Button labels                  | ✅ PASS                                | Buttons have visible text labels                                                                 |
| Form error associations        | ❌ NOT APPLICABLE                      | No form validation errors in analytics components                                                |

### Findings

| #   | Finding                                                                              | Severity |
| --- | ------------------------------------------------------------------------------------ | -------- |
| A-1 | No `prefers-reduced-motion` support for chart animations                             | MEDIUM   |
| A-2 | Save status in reflection flow is visual-only, no screen reader announcement         | LOW      |
| A-3 | Section titles use `<div>` with uppercase styling instead of proper heading elements | LOW      |
| A-4 | Chart data is not available in accessible table/summary format                       | LOW      |

---

## 15. Test Audit

### Test Files (Phase F Related)

| File                                           | Test Runner               | Test Cases | Status                           |
| ---------------------------------------------- | ------------------------- | ---------- | -------------------------------- |
| `lib/analytics/date-ranges.test.ts`            | node:test                 | 26         | ❌ Cannot run (ESM bare imports) |
| `lib/analytics/metrics.test.ts`                | node:test                 | 22         | ❌ Cannot run (ESM bare imports) |
| `lib/analytics/sufficiency.test.ts`            | node:test                 | 11         | ❌ Cannot run (ESM bare imports) |
| `lib/analytics/trends.test.ts`                 | node:test                 | 8          | ❌ Cannot run (ESM bare imports) |
| `lib/reflection/reflection-prompts.test.ts`    | Jest (describe/it/expect) | 8          | ❌ Cannot run (no Jest config)   |
| `lib/reflection/reflection-stats.test.ts`      | Jest                      | 11         | ❌ Cannot run (no Jest config)   |
| `lib/reflection/reflection-word-count.test.ts` | Jest                      | 16         | ❌ Cannot run (no Jest config)   |
| **Total claimed**                              |                           | **67**     | **0% executable**                |

### Test Coverage Gaps

**Critical missing tests:**

1. Pattern detectors (0 tests)
2. Insight generation pipeline (0 tests)
3. Weekly summary builder (0 tests)
4. Monthly summary builder (0 tests)
5. Weekly focus engine (0 tests)
6. Weekly reflection prompt selection (0 tests for the weekly variant — daily variant has tests)
7. Weekly reflection storage validation (0 tests)
8. DST transition edge cases (0 tests)
9. Cross-month / cross-year boundary tests (0 tests)
10. SSR safety of components (0 tests)
11. Malformed storage handling (0 tests for weekly reflection)
12. Dashboard rendering / component smoke tests (0 tests)

### Test Runner Issues

1. **Mixed test runners:** Analytics tests use `node:test` (bare imports without `.js` extension fail in ESM mode). Reflection tests use Jest-style `describe`/`it`/`expect` but Jest is not configured.
2. **No test script:** `package.json` has no `test` script.
3. **No test runner configuration:** No `vitest.config`, no `jest.config`, no `node --test` npm script with proper loader.

### Findings

| #   | Finding                                                                                             | Severity |
| --- | --------------------------------------------------------------------------------------------------- | -------- |
| T-1 | **No test suite can execute** — "67 tests pass" claim is false. Tests are written but not runnable. | **HIGH** |
| T-2 | Mixed test runner styles (node:test vs Jest) within the same project                                | MEDIUM   |
| T-3 | No test script in package.json                                                                      | MEDIUM   |
| T-4 | Zero tests for pattern detection, insights, summaries, weekly focus — core Phase F logic            | MEDIUM   |
| T-5 | No DST, timezone, SSR, or malformed-storage tests                                                   | LOW      |

---

## 16. Performance Audit

### Complexity Analysis

| Operation                 | Time Complexity | Space Complexity | Runs Per Render                  |
| ------------------------- | --------------- | ---------------- | -------------------------------- |
| Metric calculation        | O(n)            | O(1) output      | 1× (memoized)                    |
| Trend calculation         | O(n)            | O(metrics)       | 1× (memoized)                    |
| Pattern detection         | O(n)            | O(patterns)      | 1× (memoized)                    |
| Insight generation        | O(n)            | O(cards)         | 1× (memoized)                    |
| Weekly summary build      | O(n)            | O(1) output      | 1× (but nested metric recompute) |
| Monthly summary build     | O(n) + O(weeks) | O(weeks)         | 1× (but nested metric recompute) |
| Weekly focus generation   | O(n)            | O(1) output      | 1× (memoized)                    |
| Chart data transformation | O(n)            | O(n)             | 1× (memoized in component)       |

### Scaling Estimates

| Record Count  | Estimated Time | Notes                                                  |
| ------------- | -------------- | ------------------------------------------------------ |
| 30 records    | < 1ms          | Trivial for any modern device                          |
| 365 records   | ~2-5ms         | Still very fast — pure JS array operations             |
| 1,000 records | ~5-10ms        | Acceptable                                             |
| 5,000 records | ~20-50ms       | May cause noticeable render delay; not yet problematic |

### Performance Concerns

| #   | Finding                                                                                                                                                                                       | Severity |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| P-1 | Weekly summary and monthly summary both recompute `computeMetrics()` internally even though metrics were already computed in `computeAnalytics()`. Redundant O(n) work.                       | LOW      |
| P-2 | `detectPatterns()` is called both in `computeAnalytics()` AND inside `buildWeeklySummary()` — duplicate pattern detection.                                                                    | LOW      |
| P-3 | Weekly reflection history is not paginated/virtualized — loading 100+ reflections could render many DOM nodes. However, max reflections = weeks of usage, so even 2 years = ~104 reflections. | LOW      |
| P-4 | Dashboard component has many `useState` hooks that all trigger re-render. Analytics state changes cause full dashboard re-render.                                                             | LOW      |
| P-5 | Chart data transformation in `SleepChart` re-maps all records on every window change — appropriate for expected data sizes.                                                                   | LOW      |

**Overall:** Performance is fine for expected usage (weeks to months of data). No critical performance issues at this scale.

---

## 17. Privacy and Safety Audit (PAS-08)

### Verification

| Requirement                                      | Status          | Evidence                                                                                                                                                                                                 |
| ------------------------------------------------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sleep records remain local unless sync enabled   | ✅ PASS         | Records in `localStorage`. Sync is opt-in via authenticated account.                                                                                                                                     |
| Reflections remain local unless sync enabled     | ⚠️ PARTIAL      | Daily reflections have sync DB support (opt-in). Weekly reflections appear to NOT have sync integration — they are purely local. This is actually more private, but inconsistent with daily reflections. |
| No sleep data sent to third-party analytics      | ✅ PASS         | No third-party analytics scripts found in Phase F code                                                                                                                                                   |
| Recharts receives local data only                | ✅ PASS         | Recharts renders from `chartData` computed from local records                                                                                                                                            |
| Logs do not expose sleep content                 | ✅ PASS         | No `console.log` of sleep data in analytics code. `safe-storage` has optional `devWarn` for storage errors only.                                                                                         |
| No diagnostic language                           | ✅ PASS         | Analytics copy uses observational language ("you tend to", "pattern suggests"). No diagnostic terms like "insomnia", "apnea", etc.                                                                       |
| No clinical recommendations                      | ✅ PASS         | Focus suggestions are behavioral observations, not medical advice.                                                                                                                                       |
| No hidden sleep score                            | ⚠️ PARTIAL      | `sleepRegularity` is a 0-100 score derived from variability. It's labeled as "regularity" not an overall "sleep score." No hidden overall score.                                                         |
| Export/delete ownership documented               | ❌ NOT VERIFIED | Weekly reflections are not included in account export/delete flows. Their ownership status is unclear.                                                                                                   |
| Derived artifacts are user-owned or recalculable | ✅ PASS         | All metrics, insights, summaries, focus are recalculable from canonical data. Only user actions (focus response, reflection content) are persisted.                                                      |

### Findings

| #    | Finding                                                                                                                                                    | Severity |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| PR-1 | Weekly reflections are not included in account data export/delete — users exercising their data rights may miss these.                                     | MEDIUM   |
| PR-2 | `sleepRegularity` is a composite 0-100 score that could be perceived as a "sleep quality" metric. It's clearly labeled as regularity, not overall quality. | LOW      |
| PR-3 | No privacy disclaimer on the insights section explaining that insights are observational, not diagnostic.                                                  | LOW      |

---

## 18. Manual Acceptance Results

_Manual testing was not performed in this automated audit. These are predictions based on code analysis:_

### Scenario A — No Data

**Predicted Result:** ✅ Safe empty state. Dashboard shows "Start recording" CTA. Phase F sections hidden behind `records.length === 0` early return. **However**, the early return at line 218 returns before Phase F code, so no crash. The empty state is the existing dashboard empty state.

### Scenario B — Limited Data (2 records)

**Predicted Result:** ⚠️ Mostly works. Data sufficiency shows "insufficient". Encouragement insight shown. Baseline focus selected. No definitive trend claims. **However**, `overallSufficiency` bug (S-4) means 2 records = "insufficient" (correct), but 3-6 records also = "insufficient" instead of "limited" due to DEFAULT_SUFFICIENCY threshold bug.

### Scenario C — Sufficient Data (7+ records)

**Predicted Result:** ⚠️ Metrics appear, trends appear, insight cards appear, weekly summary appears. **But** `SleepChart` may not work correctly due to prop mismatch (D-1). `ProgramNextLessonCard` will cause a runtime error (D-2).

### Scenario D — Reflection

**Predicted Result:** ✅ Save works. Response persists in localStorage. Edit works. Refresh loads saved response. SSR-safe hydration pattern prevents SSR issues.

### Scenario E — Malformed Storage

**Predicted Result:** ✅ Safe fallback. `validateStorage()` in weekly reflection filters invalid entries. `safeJsonParse` catches JSON parse errors.

### Scenario F — Cross Midnight

**Predicted Result:** ✅ Circular average correctly handles midnight wrap-around. Verified by test code (even though tests don't run, the algorithm is mathematically correct and the test logic is sound).

---

## 19. Technical Debt Register

| ID    | Description                                                                                  | Severity | Effort |
| ----- | -------------------------------------------------------------------------------------------- | -------- | ------ |
| TD-1  | Two parallel reflection systems (daily + weekly) with overlapping but distinct types/storage | MEDIUM   | M      |
| TD-2  | Mixed test runners (node:test vs Jest) with no working test script                           | MEDIUM   | S      |
| TD-3  | Nested metric recomputation in weekly/monthly summaries (called twice)                       | LOW      | XS     |
| TD-4  | `DEFAULT_SUFFICIENCY` threshold bug makes "limited" unreachable for overall sufficiency      | MEDIUM   | XS     |
| TD-5  | Hard-coded `en-US` date formatting in monthly summary                                        | MEDIUM   | S      |
| TD-6  | Hard-coded English duration formatting in dashboard                                          | MEDIUM   | S      |
| TD-7  | `avgBedtime`/`avgWakeTime` trend thresholds defined but not used                             | LOW      | XS     |
| TD-8  | Streak logic duplicated between insights module and metrics module                           | LOW      | XS     |
| TD-9  | `eligibleDays` calculation in `useSleepAnalytics` is wrong (capped at record count)          | HIGH     | XS     |
| TD-10 | `zh` locale missing from analytics                                                           | MEDIUM   | M      |
| TD-11 | No `prefers-reduced-motion` support                                                          | MEDIUM   | S      |
| TD-12 | Weekly focus ID includes timestamp, making it non-deterministic per render                   | LOW      | XS     |
| TD-13 | Missing Chinese (`zh`) analytics locale — pre-existing incomplete locale support             | MEDIUM   | M      |

---

## 20. Final Release Verdict

### ⚠️ NOT ACCEPTED — MEDIUM FIXES REQUIRED

The Phase F implementation demonstrates solid architecture and good design patterns:

- ✅ Pure, deterministic computation over canonical records
- ✅ Circular time math is mathematically correct
- ✅ Data sufficiency framework exists with clear thresholds
- ✅ Privacy-respecting (client-side only, no clinical claims)
- ✅ SSR-safe storage patterns
- ✅ Production build succeeds

**However, it cannot be accepted as-is due to:**

### Release Blockers (must fix before acceptance)

1. **[HIGH] Tests cannot run.** The claim of "67 tests pass" is false. At minimum, the test infrastructure must be fixed so the existing test suite actually runs.

2. **[HIGH] Dashboard type errors cause runtime bugs.** `SleepChart` prop mismatch, missing `ProgramNextLessonCard`, `TrendRangeSelector` prop mismatch, and `DashboardShareCard` prop mismatch all indicate the dashboard integration was not tested and will not work correctly at runtime.

3. **[MEDIUM] `eligibleDays` calculation is wrong.** Diary completion rate will always be artificially high because eligible days are capped at record count. This undermines a core metric.

4. **[MEDIUM] `DEFAULT_SUFFICIENCY` threshold bug.** The "limited" sufficiency level is unreachable for overall data state (both `limited` and `sufficient` thresholds set to 7).

5. **[MEDIUM] Weekly reflections not in export/delete flows.** Privacy compliance requires that user data export and account deletion cover all user-generated content.

### Deferred Improvements (can wait for next phase)

- Standardize on one test runner (recommend Vitest for Vite-based project)
- Add pattern, insight, summary, and weekly focus unit tests
- Fix the daily reflection system TypeScript errors (Zod enum, extra `word` property)
- Implement `prefers-reduced-motion` for charts
- Localize date/time/number/duration formatting
- Add proper heading hierarchy for accessibility
- Consolidate or clearly document the two reflection systems
- Add `zh` analytics locale (if Chinese is intended as a supported locale)

### Recommended Next Task

Fix the 5 release blockers listed above, then re-run this audit. The fixes are estimated at 1-2 days of work:

1. Configure a working test runner and get all tests passing
2. Fix dashboard component prop mismatches and missing component
3. Fix `eligibleDays` in `useSleepAnalytics`
4. Fix `DEFAULT_SUFFICIENCY` thresholds
5. Add weekly reflections to account export/delete flows
