/**
 * Phase F — Analytics Core Types
 *
 * Domain types for the Intelligence / Analytics layer.
 * All derived metrics, trends, patterns, insights, and summaries
 * are pure computations over canonical SleepRecord and HabitProgress data.
 *
 * Analytics never writes to canonical records.
 */

import type { SleepRecord } from "@/lib/sleep-records";
import type { HabitProgress } from "@/services/habit/habit-types";

// ============================================
// Metric Keys
// ============================================
export type MetricKey =
  | "timeInBed"
  | "totalSleepTime"
  | "sleepEfficiency"
  | "sleepOnsetLatency"
  | "wakeAfterSleepOnset"
  | "numberOfAwakenings"
  | "avgBedtime"
  | "avgWakeTime"
  | "bedtimeVariability"
  | "wakeTimeVariability"
  | "sleepRegularity"
  | "diaryCompletionRate"
  | "sleepQuality"
  | "mood";

// ============================================
// Data Sufficiency
// ============================================
export type DataSufficiency =
  | "none"
  | "insufficient"
  | "limited"
  | "sufficient";

export interface SufficiencyThresholds {
  none: number;        // < none = "none"
  insufficient: number; // < insufficient = "insufficient"
  limited: number;     // < limited = "limited"
  sufficient: number;  // >= sufficient = "sufficient"
}

/**
 * Default sufficiency thresholds.
 *
 * Boundaries define the LOWER EDGE of each level (samples < threshold → lower level).
 *
 *   0 records            → none
 *   1–2 records          → insufficient
 *   3–6 records          → limited
 *   7+ records           → sufficient
 *
 * The `sufficient` field equals `limited` because the "sufficient" level
 * starts at the same boundary — once you reach the limited threshold,
 * you are at the top level (sufficient). Said differently: the three
 * thresholds (none, insufficient, limited) partition the space into four
 * states. The `sufficient` value is provided for documentation completeness.
 */
export const DEFAULT_SUFFICIENCY: SufficiencyThresholds = {
  none: 1,          // < 1 record   → "none"           (0 records)
  insufficient: 3,  // < 3 records  → "insufficient"   (1-2 records)
  limited: 7,       // < 7 records  → "limited"        (3-6 records)
  sufficient: 7,    // ≥ 7 records  → "sufficient"     (7+ records)
};

// ============================================
// Time Windows
// ============================================
export type WindowKey = "7d" | "14d" | "30d" | "90d" | "thisWeek" | "lastWeek" | "thisMonth" | "lastMonth";

export interface DateRange {
  start: string; // YYYY-MM-DD (inclusive)
  end: string;   // YYYY-MM-DD (inclusive)
  labelKey: string;
}

// ============================================
// Trend Analysis
// ============================================
export type TrendDirection =
  | "improving"
  | "stable"
  | "declining"
  | "mixed"
  | "insufficient_data";

export interface MetricTrend {
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

// ============================================
// Pattern Detection
// ============================================
export type PatternKey =
  | "weekend_bedtime_later"
  | "weekend_bedtime_earlier"
  | "weekend_waketime_later"
  | "weekend_waketime_earlier"
  | "consistent_wake_time"
  | "variable_bedtime"
  | "reminder_habit_stronger_than_diary"
  | "diary_stronger_than_reminders"
  | "stable_wake_streak";

export interface PatternFinding {
  key: PatternKey;
  metric: MetricKey;
  descriptionKey: string;
  evidence: {
    weekdayValue?: number;
    weekendValue?: number;
    differenceMinutes?: number;
    consistencyScore?: number;
    sampleSizeWeekday: number;
    sampleSizeWeekend: number;
    streakDays?: number;
  };
  confidence: "low" | "medium" | "high";
  dataSufficiency: DataSufficiency;
}

// ============================================
// Insight Cards
// ============================================
export type InsightType =
  | "metric"
  | "pattern"
  | "encouragement"
  | "behavioral_focus"
  | "trend";

export interface InsightEvidence {
  metricKey: MetricKey;
  period: string;
  sampleSize: number;
  dataPoints?: number[];
  supportingPatterns?: string[];
}

export interface InsightAction {
  labelKey: string;
  actionType: "navigate" | "info" | "dismiss";
  target?: string;
}

export interface InsightCard {
  id: string;
  type: InsightType;
  priority: number;
  titleKey: string;
  bodyKey: string;
  evidence: InsightEvidence;
  confidence: "low" | "medium" | "high";
  dataSufficiency: DataSufficiency;
  action?: InsightAction;
}

// ============================================
// Weekly Summary
// ============================================
export interface WeeklySummary {
  weekStart: string; // YYYY-MM-DD (Monday)
  weekEnd: string;   // YYYY-MM-DD (Sunday)
  recordedNights: number;
  eligibleDays: number;
  diaryCompletionRate: number | null;
  avgTotalSleepTime: number | null; // minutes
  avgSleepEfficiency: number | null; // percent
  avgSleepOnsetLatency: number | null; // minutes
  avgBedtime: string | null; // HH:MM
  avgWakeTime: string | null; // HH:MM
  bedtimeVariability: number | null; // SD in minutes
  wakeTimeVariability: number | null; // SD in minutes
  sleepRegularity: number | null; // 0-100
  reminderCompletion: number | null; // percent (from habit engine)
  activeReminderCount: number;
  strongestPositivePattern: string | null; // pattern key
  areaToObserve: string | null; // pattern/metric key
  dataSufficiency: DataSufficiency;
}

// ============================================
// Monthly Summary
// ============================================
export interface WeeklySnapshot {
  weekLabel: string;
  avgEfficiency: number | null;
  avgTST: number | null; // minutes
  recordedNights: number;
}

export interface MonthlySummary {
  monthLabel: string; // e.g. "July 2026"
  year: number;
  month: number; // 0-11
  recordedNights: number;
  eligibleDays: number;
  diaryCompletionRate: number | null;
  avgTotalSleepTime: number | null;
  avgSleepEfficiency: number | null;
  avgSleepOnsetLatency: number | null;
  avgSleepQuality: number | null;
  sleepRegularity: number | null;
  weeklyTrends: WeeklySnapshot[];
  bestStreak: number;
  habitConsistency: number | null;
  activeReminderCount: number;
  notableChanges: string[]; // pattern/trend keys
  dataSufficiency: DataSufficiency;
}

// ============================================
// Weekly Focus
// ============================================
export type WeeklyFocusCategory =
  | "recording_consistency"
  | "wake_time_consistency"
  | "bedtime_observation"
  | "reminder_routine"
  | "baseline_building"
  | "maintenance";

export interface WeeklyFocus {
  id: string;
  category: WeeklyFocusCategory;
  reasonKey: string;
  actionKey: string;
  evidence: InsightEvidence;
  generatedAt: string;
}

export type FocusUserAction = "accepted" | "dismissed" | "saved";

export interface SavedWeeklyFocus {
  focus: WeeklyFocus;
  weekStart: string;
  userAction: FocusUserAction;
  updatedAt: string;
}

// ============================================
// Analytics Result (bundle for UI)
// ============================================
export interface AnalyticsResult {
  records: SleepRecord[];
  range: DateRange;
  window: WindowKey;
  dataSufficiency: DataSufficiency;
  metrics: Record<MetricKey, number | string | null>;
  trends: Record<MetricKey, MetricTrend | null>;
  patterns: PatternFinding[];
  insights: InsightCard[];
  weeklySummary: WeeklySummary | null;
  monthlySummary: MonthlySummary | null;
  weeklyFocus: WeeklyFocus | null;
  habitProgress: Map<string, HabitProgress>;
}
