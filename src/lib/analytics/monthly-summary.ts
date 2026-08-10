/**
 * Phase F — Monthly Summary Aggregation
 *
 * Lightweight monthly overview — self-reflection tool, not clinical report.
 * Contains key averages, weekly trend comparison, consistency, and notable changes.
 */

import type { SleepRecord } from "@/lib/sleep-records";
import type { HabitProgress } from "@/services/habit/habit-types";
import type { MonthlySummary, WeeklySnapshot, MetricKey } from "./types";
import { computeMetrics, longestStreak } from "./metrics";
import { overallSufficiency } from "./sufficiency";
import { calculateAllTrends } from "./trends";
import {
  recordsInRange,
  monthStart,
  monthEnd,
  daysBetween,
  weekStart,
  formatISODate,
  addDays,
} from "./date-ranges";

// ============================================
// Monthly Summary Builder
// ============================================

/**
 * Build a monthly summary.
 *
 * @param records All sleep records
 * @param monthDateStr Any date within the target month
 * @param habitProgress Habit progress map
 */
export function buildMonthlySummary(
  records: SleepRecord[],
  monthDateStr: string,
  habitProgress: Map<string, HabitProgress> = new Map(),
): MonthlySummary {
  const start = monthStart(monthDateStr);
  const end = monthEnd(monthDateStr);
  const d = new Date(start);
  const year = d.getFullYear();
  const month = d.getMonth();

  const monthRecords = recordsInRange(records, start, end) as SleepRecord[];
  const eligibleDays = daysBetween(start, end) + 1;
  const recordCount = monthRecords.length;

  const metrics = computeMetrics(monthRecords, eligibleDays);
  const suf = overallSufficiency(recordCount);

  // Weekly breakdown (week-by-week within the month)
  const weeklyTrends = buildWeeklySnapshots(monthRecords, start, end);

  // Best streak this month
  const bestStreak = longestStreak(monthRecords);

  // Habit consistency (average across active reminders)
  const activeProgress = Array.from(habitProgress.values()).filter((p) => p.opportunityCount > 0);
  const habitConsistency =
    activeProgress.length > 0
      ? Math.round(
          activeProgress.reduce((sum, p) => sum + p.consistencyRate, 0) / activeProgress.length,
        )
      : null;

  const activeReminderCount = activeProgress.length;

  // Notable changes
  const notableChanges = detectNotableChanges(monthRecords);

  const monthLabel = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return {
    monthLabel,
    year,
    month,
    recordedNights: recordCount,
    eligibleDays,
    diaryCompletionRate: metrics.diaryCompletionRate,
    avgTotalSleepTime: metrics.totalSleepTime,
    avgSleepEfficiency: metrics.sleepEfficiency,
    avgSleepOnsetLatency: metrics.sleepOnsetLatency,
    avgSleepQuality: metrics.sleepQuality,
    sleepRegularity: metrics.sleepRegularity,
    weeklyTrends,
    bestStreak,
    habitConsistency,
    activeReminderCount,
    notableChanges,
    dataSufficiency: suf,
  };
}

// ============================================
// Weekly Snapshots Within Month
// ============================================

function buildWeeklySnapshots(
  monthRecords: SleepRecord[],
  monthStartStr: string,
  monthEndStr: string,
): WeeklySnapshot[] {
  const snapshots: WeeklySnapshot[] = [];

  // Find first Monday at or before month start
  const firstWeekMon = weekStart(monthStartStr);
  const totalDays = daysBetween(firstWeekMon, monthEndStr);
  const weekCount = Math.ceil((totalDays + 1) / 7);

  for (let w = 0; w < weekCount; w++) {
    const wStart = addDays(firstWeekMon, w * 7);
    const wEnd = addDays(wStart, 6);

    // Only include weeks that overlap with the month
    if (wEnd < monthStartStr || wStart > monthEndStr) continue;

    const weekRecords = recordsInRange(monthRecords, wStart, wEnd) as SleepRecord[];
    const metrics = computeMetrics(weekRecords, 7);

    snapshots.push({
      weekLabel: `W${w + 1}`,
      avgEfficiency: metrics.sleepEfficiency,
      avgTST: metrics.totalSleepTime,
      recordedNights: weekRecords.length,
    });
  }

  return snapshots;
}

// ============================================
// Notable Change Detection
// ============================================

function detectNotableChanges(records: SleepRecord[]): string[] {
  const changes: string[] = [];
  if (records.length < 14) return changes; // need at least 2 weeks

  const trends = calculateAllTrends(records, 14);

  // Check key metrics for notable trends
  const keyMetrics: MetricKey[] = [
    "sleepEfficiency",
    "totalSleepTime",
    "sleepOnsetLatency",
    "sleepRegularity",
  ];

  for (const metric of keyMetrics) {
    const trend = trends[metric];
    if (
      trend &&
      trend.direction !== "stable" &&
      trend.direction !== "insufficient_data" &&
      trend.confidence !== "low"
    ) {
      changes.push(metric);
    }
  }

  return changes;
}

// ============================================
// Navigation Helpers
// ============================================

/**
 * Get previous month's date string (first of month).
 */
export function previousMonth(monthDateStr: string): string {
  const d = new Date(monthDateStr);
  d.setDate(0); // last day of previous month
  return formatISODate(new Date(d.getFullYear(), d.getMonth(), 1));
}

/**
 * Get next month's date string (first of month).
 * Won't go beyond the current month.
 */
export function nextMonth(monthDateStr: string, now: Date = new Date()): string | null {
  const d = new Date(monthDateStr);
  d.setMonth(d.getMonth() + 1, 1);

  const nowMonth = now.getMonth();
  const nowYear = now.getFullYear();

  if (d.getFullYear() > nowYear || (d.getFullYear() === nowYear && d.getMonth() > nowMonth)) {
    return null;
  }

  return formatISODate(d);
}
