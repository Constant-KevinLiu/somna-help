/**
 * Phase F — Weekly Focus Selection
 *
 * Rule-based, explainable focus suggestion for the next week.
 *
 * Rules (priority order):
 * 1. baseline_building — very few records
 * 2. recording_consistency — low diary completion
 * 3. wake_time_consistency — variable wake time + low efficiency
 * 4. bedtime_observation — variable bedtime
 * 5. reminder_routine — low habit consistency (if has reminders)
 * 6. maintenance — everything going well
 *
 * The focus is a SUGGESTION. Users can accept, dismiss, or save.
 * It never automatically changes reminders or sleep schedules.
 */

import type { SleepRecord } from "@/lib/sleep-records";
import type { HabitProgress } from "@/services/habit/habit-types";
import type { WeeklyFocus, WeeklyFocusCategory, InsightEvidence } from "./types";
import { computeMetrics, wakeTimeVariability, bedtimeVariability } from "./metrics";
import { overallSufficiency } from "./sufficiency";
import { recordsInRange, isoDaysAgo } from "./date-ranges";

// ============================================
// Thresholds
// ============================================

const THRESHOLDS = {
  baselineMinRecords: 3, // < 3 records = baseline building
  recordingMinCompletion: 50, // < 50% completion = focus on recording
  wakeTimeHighSD: 45, // > 45 min SD = variable wake time
  efficiencyForWakeFocus: 85, // < 85% efficiency + variable wake = wake focus
  bedtimeHighSD: 60, // > 60 min SD = variable bedtime
  habitMinConsistency: 50, // < 50% = reminder routine focus
  maintenanceEfficiency: 85, // >= 85% = maintenance candidate
  maintenanceRegularity: 70, // >= 70 = maintenance candidate
};

// ============================================
// Focus Selection Engine
// ============================================

/**
 * Generate a weekly focus suggestion based on sleep data and habit progress.
 *
 * Examines the last 7 days of data.
 * Returns the highest-priority applicable focus.
 */
export function generateWeeklyFocus(
  records: SleepRecord[],
  habitProgress: Map<string, HabitProgress>,
  now: Date = new Date(),
): WeeklyFocus | null {
  const start = isoDaysAgo(6, now);
  const today = isoDaysAgo(0, now);
  const weekRecords = recordsInRange(records, start, today) as SleepRecord[];
  const eligibleDays = 7;

  const metrics = computeMetrics(weekRecords, eligibleDays);
  const recordCount = weekRecords.length;

  // Average habit consistency
  const activeProgress = Array.from(habitProgress.values()).filter((p) => p.opportunityCount > 0);
  const avgHabitConsistency =
    activeProgress.length > 0
      ? activeProgress.reduce((sum, p) => sum + p.consistencyRate, 0) / activeProgress.length
      : null;

  // Rule 1: baseline building — very few records
  if (recordCount < THRESHOLDS.baselineMinRecords) {
    return buildFocus(
      "baseline_building",
      "analytics.focus.baseline_building.reason",
      "analytics.focus.baseline_building.action",
      {
        metricKey: "diaryCompletionRate",
        period: "last7days",
        sampleSize: recordCount,
      },
      now,
    );
  }

  // Rule 2: recording consistency — low completion rate
  if (
    metrics.diaryCompletionRate !== null &&
    metrics.diaryCompletionRate < THRESHOLDS.recordingMinCompletion
  ) {
    return buildFocus(
      "recording_consistency",
      "analytics.focus.recording_consistency.reason",
      "analytics.focus.recording_consistency.action",
      {
        metricKey: "diaryCompletionRate",
        period: "last7days",
        sampleSize: recordCount,
        dataPoints: [metrics.diaryCompletionRate],
      },
      now,
    );
  }

  // Rule 3: wake time consistency — variable wake time + low efficiency
  const wakeSD = wakeTimeVariability(weekRecords);
  if (
    wakeSD !== null &&
    wakeSD > THRESHOLDS.wakeTimeHighSD &&
    metrics.sleepEfficiency !== null &&
    metrics.sleepEfficiency < THRESHOLDS.efficiencyForWakeFocus
  ) {
    return buildFocus(
      "wake_time_consistency",
      "analytics.focus.wake_time_consistency.reason",
      "analytics.focus.wake_time_consistency.action",
      {
        metricKey: "wakeTimeVariability",
        period: "last7days",
        sampleSize: recordCount,
        dataPoints: [wakeSD, metrics.sleepEfficiency ?? 0],
      },
      now,
    );
  }

  // Rule 4: bedtime observation — variable bedtime
  const bedSD = bedtimeVariability(weekRecords);
  if (bedSD !== null && bedSD > THRESHOLDS.bedtimeHighSD) {
    return buildFocus(
      "bedtime_observation",
      "analytics.focus.bedtime_observation.reason",
      "analytics.focus.bedtime_observation.action",
      {
        metricKey: "bedtimeVariability",
        period: "last7days",
        sampleSize: recordCount,
        dataPoints: [bedSD],
      },
      now,
    );
  }

  // Rule 5: reminder routine — low habit consistency
  if (
    avgHabitConsistency !== null &&
    avgHabitConsistency < THRESHOLDS.habitMinConsistency &&
    activeProgress.length > 0
  ) {
    return buildFocus(
      "reminder_routine",
      "analytics.focus.reminder_routine.reason",
      "analytics.focus.reminder_routine.action",
      {
        metricKey: "diaryCompletionRate",
        period: "last7days",
        sampleSize: activeProgress.length,
        dataPoints: [Math.round(avgHabitConsistency)],
      },
      now,
    );
  }

  // Rule 6: maintenance — everything going well
  if (
    metrics.sleepEfficiency !== null &&
    metrics.sleepEfficiency >= THRESHOLDS.maintenanceEfficiency &&
    metrics.sleepRegularity !== null &&
    metrics.sleepRegularity >= THRESHOLDS.maintenanceRegularity
  ) {
    return buildFocus(
      "maintenance",
      "analytics.focus.maintenance.reason",
      "analytics.focus.maintenance.action",
      {
        metricKey: "sleepRegularity",
        period: "last7days",
        sampleSize: recordCount,
        dataPoints: [metrics.sleepEfficiency, metrics.sleepRegularity],
      },
      now,
    );
  }

  // Fallback: gentle observation
  return buildFocus(
    "bedtime_observation",
    "analytics.focus.default.reason",
    "analytics.focus.default.action",
    {
      metricKey: "sleepEfficiency",
      period: "last7days",
      sampleSize: recordCount,
    },
    now,
  );
}

// ============================================
// Focus Builder Helper
// ============================================

function buildFocus(
  category: WeeklyFocusCategory,
  reasonKey: string,
  actionKey: string,
  evidence: InsightEvidence,
  now: Date,
): WeeklyFocus {
  return {
    id: `focus-${category}-${now.getTime()}`,
    category,
    reasonKey,
    actionKey,
    evidence,
    generatedAt: now.toISOString(),
  };
}

// ============================================
// Persistence: User Response to Focus
// ============================================
//
// Note: These are utility functions. Actual storage is handled by a
// separate storage module that uses safe-storage for SSR safety.
//

import { safeLocalStorageGet, safeLocalStorageSet } from "../safe-storage";

const FOCUS_STORAGE_KEY = "somna.weekly-focus.v1";

export type FocusUserAction = "accepted" | "dismissed" | "saved";

export interface SavedFocusEntry {
  weekStart: string;
  focus: WeeklyFocus;
  userAction: FocusUserAction;
  updatedAt: string;
}

interface FocusStorage {
  version: "1";
  entries: SavedFocusEntry[];
}

function loadFocusStorage(): FocusStorage {
  return safeLocalStorageGet<FocusStorage>(FOCUS_STORAGE_KEY, {
    version: "1",
    entries: [],
  });
}

function saveFocusStorage(storage: FocusStorage): void {
  safeLocalStorageSet(FOCUS_STORAGE_KEY, storage);
}

/**
 * Save user's response to a weekly focus suggestion.
 */
export function saveFocusResponse(
  focus: WeeklyFocus,
  weekStart: string,
  action: "accepted" | "dismissed" | "saved",
): void {
  const storage = loadFocusStorage();
  const existingIndex = storage.entries.findIndex((e) => e.weekStart === weekStart);

  const entry: SavedFocusEntry = {
    weekStart,
    focus,
    userAction: action,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    storage.entries[existingIndex] = entry;
  } else {
    storage.entries.push(entry);
  }

  saveFocusStorage(storage);
}

/**
 * Get the saved focus for a given week, if any.
 */
export function getSavedFocus(weekStart: string): SavedFocusEntry | null {
  const storage = loadFocusStorage();
  return storage.entries.find((e) => e.weekStart === weekStart) ?? null;
}

/**
 * Check if user has already dismissed this week's focus.
 */
export function isFocusDismissed(weekStart: string): boolean {
  const saved = getSavedFocus(weekStart);
  return saved?.userAction === "dismissed";
}
