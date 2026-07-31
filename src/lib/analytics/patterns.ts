/**
 * Phase F — Pattern Detection
 *
 * Deterministic pattern rules based on canonical sleep record fields.
 * All findings are labeled as ASSOCIATIONS, not causes.
 *
 * Supported patterns (only those derivable from existing fields):
 * - Weekend vs weekday bedtime difference
 * - Weekend vs weekday wake time difference
 * - Wake time consistency (low variability)
 * - Bedtime variability (high variability)
 * - Reminder completion vs diary completion
 * - Stable wake time streak
 */

import type { SleepRecord } from "@/lib/sleep-records";
import type { HabitProgress } from "@/services/habit/habit-types";
import type { PatternFinding, PatternKey, DataSufficiency } from "./types";
import {
  weekendBedtimeDifference,
  weekendWakeTimeDifference,
  bedtimeVariability,
  wakeTimeVariability,
  stableWakeStreak,
  splitByWeekdayWeekend,
} from "./metrics";
import { diaryCompletionRate } from "./metrics";
import { metricSufficiency, overallSufficiency } from "./sufficiency";
import { daysBetween } from "./date-ranges";

// ============================================
// Thresholds
// ============================================

// Minimum difference (minutes) to report a weekend/weekday pattern
const WEEKEND_DIFF_THRESHOLD = 20; // min

// SD threshold for "consistent" vs "variable"
const CONSISTENT_WAKE_SD = 20; // min SD = very consistent
const VARIABLE_BEDTIME_SD = 45; // min SD = quite variable

// Minimum streak to report
const STABLE_WAKE_STREAK_MIN = 3;

// ============================================
// Individual Pattern Detectors
// ============================================

/**
 * Pattern: bedtime is significantly later (or earlier) on weekends.
 */
function detectWeekendBedtimePattern(records: SleepRecord[]): PatternFinding | null {
  const { weekday, weekend } = splitByWeekdayWeekend(records);
  const diff = weekendBedtimeDifference(records);

  if (diff === null) return null;
  if (Math.abs(diff) < WEEKEND_DIFF_THRESHOLD) return null;

  const isLater = diff > 0;
  const key: PatternKey = isLater ? "weekend_bedtime_later" : "weekend_bedtime_earlier";

  const minN = Math.min(weekday.length, weekend.length);
  const suf = minN >= 5 ? "sufficient" : minN >= 3 ? "limited" : "insufficient";
  const confidence = minN >= 5 ? "high" : minN >= 3 ? "medium" : "low";

  return {
    key,
    metric: "avgBedtime",
    descriptionKey: isLater
      ? "analytics.pattern.weekend_bedtime_later"
      : "analytics.pattern.weekend_bedtime_earlier",
    evidence: {
      weekdayValue: weekday.length,
      weekendValue: weekend.length,
      differenceMinutes: Math.round(diff),
      sampleSizeWeekday: weekday.length,
      sampleSizeWeekend: weekend.length,
    },
    confidence,
    dataSufficiency: suf,
  };
}

/**
 * Pattern: wake time is significantly later (or earlier) on weekends.
 */
function detectWeekendWakeTimePattern(records: SleepRecord[]): PatternFinding | null {
  const { weekday, weekend } = splitByWeekdayWeekend(records);
  const diff = weekendWakeTimeDifference(records);

  if (diff === null) return null;
  if (Math.abs(diff) < WEEKEND_DIFF_THRESHOLD) return null;

  const isLater = diff > 0;
  const key: PatternKey = isLater ? "weekend_waketime_later" : "weekend_waketime_earlier";

  const minN = Math.min(weekday.length, weekend.length);
  const suf = minN >= 5 ? "sufficient" : minN >= 3 ? "limited" : "insufficient";
  const confidence = minN >= 5 ? "high" : minN >= 3 ? "medium" : "low";

  return {
    key,
    metric: "avgWakeTime",
    descriptionKey: isLater
      ? "analytics.pattern.weekend_waketime_later"
      : "analytics.pattern.weekend_waketime_earlier",
    evidence: {
      weekdayValue: weekday.length,
      weekendValue: weekend.length,
      differenceMinutes: Math.round(diff),
      sampleSizeWeekday: weekday.length,
      sampleSizeWeekend: weekend.length,
    },
    confidence,
    dataSufficiency: suf,
  };
}

/**
 * Pattern: wake time is very consistent (low SD).
 */
function detectConsistentWakeTime(records: SleepRecord[]): PatternFinding | null {
  const sd = wakeTimeVariability(records);
  if (sd === null) return null;
  if (sd > CONSISTENT_WAKE_SD) return null;
  if (records.length < 3) return null;

  const suf = overallSufficiency(records.length);
  const confidence = records.length >= 7 ? "high" : records.length >= 5 ? "medium" : "low";

  return {
    key: "consistent_wake_time",
    metric: "wakeTimeVariability",
    descriptionKey: "analytics.pattern.consistent_wake_time",
    evidence: {
      consistencyScore: Math.round(Math.max(0, 100 - sd * 1.5)),
      sampleSizeWeekday: records.filter((r) => {
        const d = new Date(r.date).getDay();
        return d >= 1 && d <= 5;
      }).length,
      sampleSizeWeekend: records.filter((r) => {
        const d = new Date(r.date).getDay();
        return d === 0 || d === 6;
      }).length,
    },
    confidence,
    dataSufficiency: suf,
  };
}

/**
 * Pattern: bedtime varies a lot.
 */
function detectVariableBedtime(records: SleepRecord[]): PatternFinding | null {
  const sd = bedtimeVariability(records);
  if (sd === null) return null;
  if (sd < VARIABLE_BEDTIME_SD) return null;
  if (records.length < 3) return null;

  const suf = overallSufficiency(records.length);
  const confidence = records.length >= 7 ? "high" : records.length >= 5 ? "medium" : "low";

  return {
    key: "variable_bedtime",
    metric: "bedtimeVariability",
    descriptionKey: "analytics.pattern.variable_bedtime",
    evidence: {
      differenceMinutes: Math.round(sd),
      sampleSizeWeekday: records.filter((r) => {
        const d = new Date(r.date).getDay();
        return d >= 1 && d <= 5;
      }).length,
      sampleSizeWeekend: records.filter((r) => {
        const d = new Date(r.date).getDay();
        return d === 0 || d === 6;
      }).length,
    },
    confidence,
    dataSufficiency: suf,
  };
}

/**
 * Pattern: stable wake time streak (consecutive days with consistent wake time).
 */
function detectStableWakeStreak(records: SleepRecord[]): PatternFinding | null {
  const streak = stableWakeStreak(records);
  if (streak < STABLE_WAKE_STREAK_MIN) return null;

  const confidence = streak >= 7 ? "high" : streak >= 5 ? "medium" : "low";
  const suf = overallSufficiency(records.length);

  return {
    key: "stable_wake_streak",
    metric: "avgWakeTime",
    descriptionKey: "analytics.pattern.stable_wake_streak",
    evidence: {
      streakDays: streak,
      sampleSizeWeekday: records.length,
      sampleSizeWeekend: 0,
    },
    confidence,
    dataSufficiency: suf,
  };
}

/**
 * Pattern: reminder completion vs diary completion comparison.
 * Requires habit progress data.
 */
export function detectReminderDiaryPattern(
  records: SleepRecord[],
  habitProgress: Map<string, HabitProgress>,
  eligibleDays: number,
): PatternFinding | null {
  if (habitProgress.size === 0) return null;

  // Get overall habit consistency (average across active reminders)
  const progressValues = Array.from(habitProgress.values()).filter(
    (p) => p.opportunityCount > 0,
  );
  if (progressValues.length === 0) return null;

  const avgHabitConsistency =
    progressValues.reduce((sum, p) => sum + p.consistencyRate, 0) /
    progressValues.length;

  const diaryRate = diaryCompletionRate(records, eligibleDays);
  if (diaryRate === null) return null;

  const diff = avgHabitConsistency - diaryRate;

  // Only report if difference is meaningful (10+ percentage points)
  if (Math.abs(diff) < 10) return null;

  const isReminderStronger = diff > 0;
  const key: PatternKey = isReminderStronger
    ? "reminder_habit_stronger_than_diary"
    : "diary_stronger_than_reminders";

  const minRecords = Math.min(records.length, progressValues.length);
  const confidence = minRecords >= 7 ? "high" : minRecords >= 4 ? "medium" : "low";
  const suf = overallSufficiency(records.length);

  return {
    key,
    metric: "diaryCompletionRate",
    descriptionKey: isReminderStronger
      ? "analytics.pattern.reminder_stronger"
      : "analytics.pattern.diary_stronger",
    evidence: {
      differenceMinutes: Math.round(Math.abs(diff)),
      sampleSizeWeekday: records.length,
      sampleSizeWeekend: progressValues.length,
    },
    confidence,
    dataSufficiency: suf,
  };
}

// ============================================
// Pattern Detection Orchestration
// ============================================

/**
 * Detect all patterns from sleep records.
 * Patterns returned in order of confidence (highest first).
 */
export function detectPatterns(records: SleepRecord[]): PatternFinding[] {
  const findings: PatternFinding[] = [];

  if (records.length < 2) return findings;

  const weekendBed = detectWeekendBedtimePattern(records);
  if (weekendBed) findings.push(weekendBed);

  const weekendWake = detectWeekendWakeTimePattern(records);
  if (weekendWake) findings.push(weekendWake);

  const consistentWake = detectConsistentWakeTime(records);
  if (consistentWake) findings.push(consistentWake);

  const variableBed = detectVariableBedtime(records);
  if (variableBed) findings.push(variableBed);

  const wakeStreak = detectStableWakeStreak(records);
  if (wakeStreak) findings.push(wakeStreak);

  // Sort by confidence, then by sample size
  const confOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
  findings.sort((a, b) => {
    const confDiff = confOrder[b.confidence] - confOrder[a.confidence];
    if (confDiff !== 0) return confDiff;
    return (
      b.evidence.sampleSizeWeekday +
      b.evidence.sampleSizeWeekend -
      (a.evidence.sampleSizeWeekday + a.evidence.sampleSizeWeekend)
    );
  });

  return findings;
}

/**
 * Get the strongest positive pattern (for weekly summary).
 * Returns pattern description key or null.
 */
export function getStrongestPositivePattern(
  patterns: PatternFinding[],
): string | null {
  const positivePatterns = patterns.filter((p) =>
    [
      "consistent_wake_time",
      "stable_wake_streak",
      "weekend_bedtime_earlier",
    ].includes(p.key),
  );
  if (positivePatterns.length === 0) return null;
  return positivePatterns[0].key;
}

/**
 * Get the most notable area to observe (for weekly summary).
 * Returns pattern/metric key or null.
 */
export function getAreaToObserve(patterns: PatternFinding[]): string | null {
  const concernPatterns = patterns.filter((p) =>
    [
      "variable_bedtime",
      "weekend_waketime_later",
      "weekend_bedtime_later",
      "reminder_habit_stronger_than_diary",
    ].includes(p.key),
  );
  if (concernPatterns.length === 0) return null;
  return concernPatterns[0].key;
}
