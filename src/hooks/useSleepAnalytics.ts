/**
 * Phase F — useSleepAnalytics Hook
 *
 * React hook that computes analytics from sleep records + habit progress.
 *
 * All computations are memoized. Pure analytics functions live in
 * src/lib/analytics/*.ts — this hook is just the React glue.
 */

import { useMemo } from "react";
import type { SleepRecord } from "@/lib/sleep-records";
import type { HabitProgress } from "@/services/habit/habit-types";
import type {
  WindowKey,
  AnalyticsResult,
  MetricKey,
} from "@/lib/analytics/types";
import type { MetricBundle } from "@/lib/analytics/metrics";
import { getDateRange, recordsInRange, daysBetween, todayISO } from "@/lib/analytics/date-ranges";
import { computeMetrics } from "@/lib/analytics/metrics";
import { overallSufficiency } from "@/lib/analytics/sufficiency";
import { calculateAllTrends } from "@/lib/analytics/trends";
import { detectPatterns } from "@/lib/analytics/patterns";
import { generateInsights } from "@/lib/analytics/insights";
import { buildWeeklySummary } from "@/lib/analytics/weekly-summary";
import { buildMonthlySummary } from "@/lib/analytics/monthly-summary";
import { generateWeeklyFocus } from "@/lib/analytics/weekly-focus";

/**
 * Compute all analytics for a given time window.
 *
 * @param records Sorted sleep records
 * @param window Time window key
 * @param habitProgress Habit progress map
 * @param now Current date (for testing)
 */
export function computeAnalytics(
  records: SleepRecord[],
  window: WindowKey,
  habitProgress: Map<string, HabitProgress>,
  now: Date = new Date(),
): AnalyticsResult {
  const range = getDateRange(window, now);
  const windowRecords = recordsInRange(records, range.start, range.end) as SleepRecord[];
  const recordCount = windowRecords.length;

  // Determine period length in days for trend calculation
  const periodDays = (() => {
    switch (window) {
      case "7d":
      case "thisWeek":
      case "lastWeek":
        return 7;
      case "14d":
        return 14;
      case "30d":
      case "thisMonth":
      case "lastMonth":
        return 30;
      case "90d":
        return 90;
    }
  })();

  // Eligible days = actual calendar days in the selected window, capped at today
  // so future dates in a partial period (thisWeek, thisMonth) do not count.
  // Uses local calendar days to match the record date format (YYYY-MM-DD).
  const today = todayISO(now);
  const effectiveEnd = range.end > today ? today : range.end;
  const eligibleDays = range.start > effectiveEnd
    ? 0
    : daysBetween(range.start, effectiveEnd) + 1;

  // Filter records to only eligible days (excludes future dates in partial periods)
  const eligibleRecords = eligibleDays > 0
    ? (recordsInRange(windowRecords, range.start, effectiveEnd) as SleepRecord[])
    : [];
  const eligibleRecordCount = eligibleRecords.length;

  const suf = overallSufficiency(eligibleRecordCount);

  // Core metrics — use only records from eligible days, with correct eligibleDays
  const metricsBundle: MetricBundle = computeMetrics(eligibleRecords, eligibleDays);

  // Build metrics record (MetricKey → value)
  const metrics: Record<MetricKey, number | string | null> = {
    timeInBed: metricsBundle.timeInBed,
    totalSleepTime: metricsBundle.totalSleepTime,
    sleepEfficiency: metricsBundle.sleepEfficiency,
    sleepOnsetLatency: metricsBundle.sleepOnsetLatency,
    wakeAfterSleepOnset: metricsBundle.wakeAfterSleepOnset,
    numberOfAwakenings: metricsBundle.numberOfAwakenings,
    avgBedtime: metricsBundle.avgBedtime,
    avgWakeTime: metricsBundle.avgWakeTime,
    bedtimeVariability: metricsBundle.bedtimeVariability,
    wakeTimeVariability: metricsBundle.wakeTimeVariability,
    sleepRegularity: metricsBundle.sleepRegularity,
    diaryCompletionRate: metricsBundle.diaryCompletionRate,
    sleepQuality: metricsBundle.sleepQuality,
    mood: metricsBundle.mood,
  };

  // Trends
  const trends = calculateAllTrends(windowRecords, Math.floor(periodDays / 2), now);

  // Patterns
  const patterns = detectPatterns(windowRecords);

  // Insights
  const insights = generateInsights(
    windowRecords,
    periodDays,
    habitProgress,
    range.labelKey,
    now,
  );

  // Weekly summary (for current week)
  const weeklySummary = buildWeeklySummary(records, range.start, habitProgress);

  // Monthly summary (for current month)
  const monthlySummary = buildMonthlySummary(records, range.start, habitProgress);

  // Weekly focus
  const weeklyFocus = generateWeeklyFocus(records, habitProgress, now);

  return {
    records: windowRecords,
    range,
    window,
    dataSufficiency: suf,
    metrics,
    trends,
    patterns,
    insights,
    weeklySummary,
    monthlySummary,
    weeklyFocus,
    habitProgress,
  };
}

/**
 * React hook version of computeAnalytics.
 * Memoizes results so they don't recalculate on every render.
 */
export function useSleepAnalytics(
  records: SleepRecord[],
  window: WindowKey,
  habitProgress: Map<string, HabitProgress>,
): AnalyticsResult {
  return useMemo(
    () => computeAnalytics(records, window, habitProgress),
    [records, window, habitProgress],
  );
}
