/**
 * Phase F — Weekly Summary Aggregation
 *
 * Builds a complete weekly summary from sleep records + habit data.
 * Clearly distinguishes recorded data, derived metrics, and interpretation.
 */

import type { SleepRecord } from "@/lib/sleep-records";
import type { HabitProgress } from "@/services/habit/habit-types";
import type { WeeklySummary } from "./types";
import { computeMetrics } from "./metrics";
import { detectPatterns, getStrongestPositivePattern, getAreaToObserve } from "./patterns";
import { overallSufficiency } from "./sufficiency";
import { recordsInRange, weekStart, weekEnd, daysBetween } from "./date-ranges";

// ============================================
// Weekly Summary Builder
// ============================================

/**
 * Build a weekly summary for the week containing the given date.
 * Week runs Monday to Sunday.
 *
 * @param records All sleep records
 * @param weekDateStr Any date within the target week (YYYY-MM-DD)
 * @param habitProgress Habit progress map
 */
export function buildWeeklySummary(
  records: SleepRecord[],
  weekDateStr: string,
  habitProgress: Map<string, HabitProgress> = new Map(),
): WeeklySummary {
  const start = weekStart(weekDateStr);
  const end = weekEnd(weekDateStr);

  const weekRecords = recordsInRange(records, start, end) as SleepRecord[];
  const eligibleDays = daysBetween(start, end) + 1; // inclusive
  const recordCount = weekRecords.length;

  const metrics = computeMetrics(weekRecords, eligibleDays);
  const patterns = detectPatterns(weekRecords);

  // Habit metrics: average consistency across active reminders
  const activeProgress = Array.from(habitProgress.values()).filter((p) => p.opportunityCount > 0);
  const reminderCompletion =
    activeProgress.length > 0
      ? Math.round(
          activeProgress.reduce((sum, p) => sum + p.consistencyRate, 0) / activeProgress.length,
        )
      : null;

  const activeReminderCount = activeProgress.length;

  // Strongest positive pattern
  const strongestPositive = getStrongestPositivePattern(patterns);

  // Area to observe next
  const areaToObserve = getAreaToObserve(patterns);

  const suf = overallSufficiency(recordCount);

  return {
    weekStart: start,
    weekEnd: end,
    recordedNights: recordCount,
    eligibleDays,
    diaryCompletionRate: metrics.diaryCompletionRate,
    avgTotalSleepTime: metrics.totalSleepTime,
    avgSleepEfficiency: metrics.sleepEfficiency,
    avgSleepOnsetLatency: metrics.sleepOnsetLatency,
    avgBedtime: metrics.avgBedtime,
    avgWakeTime: metrics.avgWakeTime,
    bedtimeVariability: metrics.bedtimeVariability,
    wakeTimeVariability: metrics.wakeTimeVariability,
    sleepRegularity: metrics.sleepRegularity,
    reminderCompletion,
    activeReminderCount,
    strongestPositivePattern: strongestPositive,
    areaToObserve: areaToObserve,
    dataSufficiency: suf,
  };
}

/**
 * Get weekly summaries for the last N weeks.
 * Returns array of summaries, newest first.
 */
export function getLastNWeeklySummaries(
  records: SleepRecord[],
  n: number,
  habitProgress: Map<string, HabitProgress> = new Map(),
  now: Date = new Date(),
): WeeklySummary[] {
  const summaries: WeeklySummary[] = [];
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const thisWeekMon = weekStart(todayStr);

  for (let i = 0; i < n; i++) {
    const weeksAgo = i;
    const d = new Date(thisWeekMon);
    d.setDate(d.getDate() - weeksAgo * 7);
    const weekDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    summaries.push(buildWeeklySummary(records, weekDate, habitProgress));
  }

  return summaries;
}

/**
 * Navigate to previous week.
 */
export function previousWeek(weekStartStr: string): string {
  const d = new Date(weekStartStr);
  d.setDate(d.getDate() - 7);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Navigate to next week.
 * Won't go beyond the current week.
 */
export function nextWeek(weekStartStr: string, now: Date = new Date()): string | null {
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const thisWeekMon = weekStart(todayStr);

  const d = new Date(weekStartStr);
  d.setDate(d.getDate() + 7);
  const nextStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  // Don't go beyond current week
  if (nextStr > thisWeekMon) return null;
  return nextStr;
}
