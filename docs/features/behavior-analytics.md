# Behavior Analytics

A deterministic, rule-based analytics engine that computes sleep metrics, trends, and patterns from user diary data. Part of Sleep Diary v2.4 (Phase F).

## Overview

Behavior Analytics transforms raw sleep diary entries into actionable, explainable metrics. Every calculation is pure and deterministic — given the same records, you always get the same result. No AI, no black boxes, no medical advice.

**Key design principles:**

- **Pure computation** — all analytics are pure functions of `SleepRecord[]` + `HabitProgress`. No side effects.
- **Data sufficiency** — every metric and insight is annotated with how much data was used. Never show "scientific" precision from 2 nights of data.
- **Circular time math** — bedtime and wake time averages use vector mean on a unit circle so 23:00 + 01:00 = 00:00, not 12:00.
- **Domain boundary** — analytics NEVER writes to canonical diary records or reminder definitions.
- **SSR safe** — all computations run in memory; storage interactions (reflections, focus state) use safe-localStorage utilities.

## Core Metrics

| Metric                        | Definition                                        | Unit    |
| ----------------------------- | ------------------------------------------------- | ------- |
| **Time in Bed (TIB)**         | Total minutes from bedtime to wake time           | minutes |
| **Total Sleep Time (TST)**    | TIB − sleep onset latency − WASO                  | minutes |
| **Sleep Efficiency (SE)**     | TST / TIB × 100                                   | %       |
| **Sleep Onset Latency (SOL)** | Time to fall asleep                               | minutes |
| **WASO**                      | Wake After Sleep Onset (≈10 min per awakening)    | minutes |
| **Number of Awakenings**      | Count of nighttime awakenings                     | count   |
| **Avg Bedtime**               | Circular average bedtime                          | HH:MM   |
| **Avg Wake Time**             | Circular average wake time                        | HH:MM   |
| **Bedtime Variability**       | Circular standard deviation of bedtimes           | minutes |
| **Wake Time Variability**     | Circular standard deviation of wake times         | minutes |
| **Sleep Regularity**          | 100 − avg(bedtimeSD, wakeSD) × 0.5, min 3 records | 0-100   |
| **Completion Rate**           | % of eligible days with a diary record            | %       |
| **Sleep Quality**             | Average self-reported quality (1-5)               | score   |
| **Mood**                      | Average self-reported mood (1-5)                  | score   |

### Circular Time Math

Times are not averaged arithmetically. A bedtime of 23:00 and 01:00 shouldn't average to 12:00 noon. Instead:

1. Each time is mapped to a point on the unit circle: angle = (minutes / 1440) × 2π
2. Compute the vector mean of all points
3. The angle of the resultant vector is the average time
4. The length of the resultant vector relates to concentration (shorter = more variable)

This correctly handles the midnight wrap-around for both average and standard deviation calculations.

## Time Windows

Analytics supports 8 time windows:

- **7d** — Last 7 days
- **14d** — Last 14 days
- **30d** — Last 30 days
- **90d** — Last 90 days
- **thisWeek** — Monday to Sunday of current week
- **lastWeek** — Monday to Sunday of previous week
- **thisMonth** — Full current calendar month
- **lastMonth** — Full previous calendar month

Week starts on Monday (ISO 8601 convention).

## Data Sufficiency Framework

Each metric and insight carries a data sufficiency label:

| Level            | Records | What you see                                                      |
| ---------------- | ------- | ----------------------------------------------------------------- |
| **none**         | 0       | Empty state with guidance to start recording                      |
| **insufficient** | 1-2     | Raw values shown, no trends, explicit "collecting data" message   |
| **limited**      | 3-6     | Trends shown with "low confidence" badge, regularity still hidden |
| **sufficient**   | 7+      | Full analytics, all patterns, high/medium confidence trends       |

Per-metric minimums override defaults:

- `sleepRegularity` needs 3+ records (needs SD which needs ≥2)
- `bedtimeVariability` / `wakeTimeVariability` need 2+ records
- Other metrics default to same thresholds

## Trend Engine

Trends compare the current period to the immediately preceding period of equal length (prior period method):

```
┌────── previous N days ──────┬────── current N days ──────┐
```

For each metric:

1. Compute average in current window
2. Compute average in previous window
3. Calculate absolute and percentage change
4. Compare against meaningful-change threshold
5. Classify: improving / stable / declining / insufficient_data / mixed

### Meaningful Change Thresholds

| Metric           | Threshold            | Direction                |
| ---------------- | -------------------- | ------------------------ |
| Sleep Efficiency | 3 percentage points  | higher = better          |
| Total Sleep Time | 20 minutes           | higher = better          |
| SOL              | 5 minutes            | lower = better           |
| Bedtime          | 15 minutes           | neutral (just "shifted") |
| Wake Time        | 15 minutes           | neutral                  |
| Sleep Regularity | 5 points             | higher = better          |
| Completion Rate  | 10 percentage points | higher = better          |

### Confidence (rule-based)

- **High**: min(N_current, N_previous) ≥ 7 AND |change| ≥ 1.5 × threshold
- **Medium**: min(N_current, N_previous) ≥ 5 AND |change| ≥ threshold
- **Low**: everything else

## Pattern Detection

8 rule-based pattern detectors:

1. **Weekend bedtime delay** — average weekend bedtime ≥ 30 min later than weekday
2. **Weekend wake delay** — average weekend wake time ≥ 45 min later than weekday
3. **Consistent wake time** — wake time SD < 20 min (strength marker)
4. **Variable bedtime** — bedtime SD > 45 min (observation marker)
5. **Long stable wake streak** — ≥ 5 consecutive days with wake time within 30 min
6. **High efficiency + low latency** — both good (positive composite)
7. **Low efficiency pattern** — SE < 80% consistently (observation)
8. **Reminder-diary alignment** — reminder completion correlates with better metrics

Patterns are sorted by confidence and used both in insight generation and as supporting evidence.

## Implementation

### Core modules

| Module          | Path                                   |
| --------------- | -------------------------------------- |
| Types           | `src/lib/analytics/types.ts`           |
| Date ranges     | `src/lib/analytics/date-ranges.ts`     |
| Metrics         | `src/lib/analytics/metrics.ts`         |
| Sufficiency     | `src/lib/analytics/sufficiency.ts`     |
| Trends          | `src/lib/analytics/trends.ts`          |
| Patterns        | `src/lib/analytics/patterns.ts`        |
| Insights        | `src/lib/analytics/insights.ts`        |
| Weekly summary  | `src/lib/analytics/weekly-summary.ts`  |
| Monthly summary | `src/lib/analytics/monthly-summary.ts` |
| Weekly focus    | `src/lib/analytics/weekly-focus.ts`    |
| React hook      | `src/hooks/useSleepAnalytics.ts`       |

### Hook

```ts
import { useSleepAnalytics } from "@/hooks/useSleepAnalytics";

const analytics = useSleepAnalytics(records, "30d", habitProgress);
// { metrics, trends, patterns, insights, weeklySummary, monthlySummary, weeklyFocus, ... }
```

### Testing

66+ unit tests across date-ranges, metrics, sufficiency, and trends modules. Run with:

```bash
npx tsx --test src/lib/analytics/*.test.ts
```

## Privacy (PAS-08)

- All analytics computed on-device
- No data leaves the user's browser
- Raw diary records never sent anywhere
- Reflections and focus responses stored locally (PAS-05 compliant storage)

## Non-goals

- ❌ Medical diagnosis or clinical-grade assessment
- ❌ AI-generated personalized recommendations
- ❌ Black-box "sleep score"
- ❌ Auto-modifying reminders or sleep schedule based on analytics
- ❌ Server-side analytics processing
