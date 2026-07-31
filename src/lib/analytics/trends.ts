/**
 * Phase F — Trend Analysis Engine
 *
 * Deterministic trend detection with meaningful-change thresholds.
 * No probabilistic or AI confidence — all rule-based and explainable.
 *
 * Trend compares two periods: current window vs previous window of same length.
 * Uses half-split for rolling windows and prior-period for fixed windows.
 */

import type { SleepRecord } from "@/lib/sleep-records";
import { minutesInBed } from "@/lib/sleep-records";
import type {
  MetricKey,
  MetricTrend,
  TrendDirection,
} from "./types";
import {
  computeTotalSleepTime,
  computeWASO,
  hhmmToMinutes,
  circularAverageMinutes,
} from "./metrics";
import { metricSufficiency } from "./sufficiency";
import { recordsInRange, addDays, isoDaysAgo } from "./date-ranges";

// ============================================
// Meaningful Change Thresholds
// ============================================
// A change must exceed this threshold to count as "improving" or "declining".
// Below this = "stable" (avoids interpreting noise as trend).
//
// Units per metric:
//   - Percent-based: percentage points
//   - Time-based: minutes
//   - Count: absolute count

export const MEANINGFUL_CHANGE: Record<MetricKey, number> = {
  sleepEfficiency: 3,        // percentage points
  totalSleepTime: 20,        // minutes
  timeInBed: 20,             // minutes
  sleepOnsetLatency: 5,      // minutes (improvement = decrease)
  wakeAfterSleepOnset: 10,   // minutes (improvement = decrease)
  numberOfAwakenings: 1,     // count
  avgBedtime: 15,            // minutes shift
  avgWakeTime: 15,           // minutes shift
  bedtimeVariability: 10,    // minutes SD change (improvement = decrease)
  wakeTimeVariability: 10,   // minutes SD change (improvement = decrease)
  sleepRegularity: 5,        // points (improvement = increase)
  diaryCompletionRate: 10,   // percentage points
  sleepQuality: 0.3,         // rating points (1-5 scale)
  mood: 0.3,                 // rating points
};

/**
 * For a given metric, is "increase" good or bad?
 * true = higher is better (e.g., efficiency, regularity)
 * false = lower is better (e.g., latency, awakenings)
 */
export const HIGHER_IS_BETTER: Record<MetricKey, boolean> = {
  sleepEfficiency: true,
  totalSleepTime: true,
  timeInBed: true,
  sleepOnsetLatency: false,
  wakeAfterSleepOnset: false,
  numberOfAwakenings: false,
  avgBedtime: false,         // not directional per se — just "shifted"
  avgWakeTime: false,        // not directional
  bedtimeVariability: false, // lower = more consistent = better
  wakeTimeVariability: false,
  sleepRegularity: true,
  diaryCompletionRate: true,
  sleepQuality: true,
  mood: true,
};

// ============================================
// Value Extraction from Records
// ============================================

/** Extract numeric values for a metric from a set of records. */
function extractMetricValues(records: SleepRecord[], metric: MetricKey): number[] {
  switch (metric) {
    case "sleepEfficiency":
      return records.map((r) => r.sleepEfficiency);
    case "totalSleepTime":
      return records
        .map((r) => computeTotalSleepTime(r))
        .filter((v): v is number => v !== null);
    case "timeInBed":
      return records.map((r) => minutesInBed(r.bedtime, r.wakeUpTime));
    case "sleepOnsetLatency":
      return records.map((r) => r.sleepLatency);
    case "wakeAfterSleepOnset":
      return records.map((r) => computeWASO(r.nightAwakenings));
    case "numberOfAwakenings":
      return records.map((r) => r.nightAwakenings);
    case "avgBedtime":
      return records.map((r) => hhmmToMinutes(r.bedtime));
    case "avgWakeTime":
      return records.map((r) => hhmmToMinutes(r.wakeUpTime));
    case "sleepQuality":
      return records.map((r) => r.sleepQuality);
    case "mood":
      return records.map((r) => r.mood);
    default:
      // For variability and regularity, computed separately
      return [];
  }
}

/** Average of a metric across records, or null if no data. */
function metricAverage(records: SleepRecord[], metric: MetricKey): number | null {
  const values = extractMetricValues(records, metric);
  if (values.length === 0) return null;
  const sum = values.reduce((s, v) => s + v, 0);
  return sum / values.length;
}

// ============================================
// Confidence Assessment (rule-based)
// ============================================

function assessConfidence(
  currentN: number,
  previousN: number,
  change: number,
  threshold: number,
): "low" | "medium" | "high" {
  const minN = Math.min(currentN, previousN);

  // Both periods have robust data + clear signal
  if (minN >= 7 && Math.abs(change) >= threshold * 1.5) return "high";

  // Good data in both + threshold exceeded
  if (minN >= 5 && Math.abs(change) >= threshold) return "medium";

  // Limited data or borderline change
  return "low";
}

// ============================================
// Single Metric Trend Calculation
// ============================================

/**
 * Calculate trend for a single metric.
 *
 * Compares average value in the current period vs the previous period.
 * Both periods are the same length.
 *
 * Uses the "prior period" method:
 *   current period: last N days
 *   previous period: N days before that
 *
 * For time-based metrics (bedtime, wake time), uses circular average
 * and shortest-arc difference.
 */
export function calculateMetricTrend(
  currentRecords: SleepRecord[],
  previousRecords: SleepRecord[],
  metric: MetricKey,
): MetricTrend {
  const currentN = currentRecords.length;
  const previousN = previousRecords.length;

  // Insufficient data check
  const currentSuf = metricSufficiency(metric, currentN);
  const previousSuf = metricSufficiency(metric, previousN);

  if (currentSuf === "none" || previousSuf === "none") {
    return {
      metric,
      direction: "insufficient_data",
      currentValue: null,
      previousValue: null,
      absoluteChange: null,
      percentageChange: null,
      sampleSizeCurrent: currentN,
      sampleSizePrevious: previousN,
      explanationKey: "analytics.trend.insufficient_data",
      confidence: "low",
    };
  }

  // Get values
  let currentVal: number | null;
  let previousVal: number | null;

  if (metric === "avgBedtime" || metric === "avgWakeTime") {
    const currentTimes = extractMetricValues(currentRecords, metric);
    const previousTimes = extractMetricValues(previousRecords, metric);
    currentVal = circularAverageMinutes(currentTimes);
    previousVal = circularAverageMinutes(previousTimes);
  } else {
    currentVal = metricAverage(currentRecords, metric);
    previousVal = metricAverage(previousRecords, metric);
  }

  if (currentVal === null || previousVal === null) {
    return {
      metric,
      direction: "insufficient_data",
      currentValue: currentVal,
      previousValue: previousVal,
      absoluteChange: null,
      percentageChange: null,
      sampleSizeCurrent: currentN,
      sampleSizePrevious: previousN,
      explanationKey: "analytics.trend.insufficient_data",
      confidence: "low",
    };
  }

  // Calculate change
  let absoluteChange: number;

  if (metric === "avgBedtime" || metric === "avgWakeTime") {
    // Shortest arc difference for circular metrics
    let diff = currentVal - previousVal;
    if (diff > 720) diff -= 1440;
    if (diff < -720) diff += 1440;
    absoluteChange = diff;
  } else {
    absoluteChange = currentVal - previousVal;
  }

  // Percentage change (avoid division by zero)
  const percentageChange =
    previousVal !== 0
      ? Math.round((absoluteChange / Math.abs(previousVal)) * 1000) / 10
      : null;

  // Determine direction
  const threshold = MEANINGFUL_CHANGE[metric];
  const higherBetter = HIGHER_IS_BETTER[metric];
  let direction: TrendDirection = "stable";
  let explanationKey = "analytics.trend.stable";

  if (Math.abs(absoluteChange) < threshold) {
    direction = "stable";
    explanationKey = "analytics.trend.stable";
  } else {
    const isImproving = higherBetter
      ? absoluteChange > 0
      : absoluteChange < 0; // for lower-is-better metrics, decrease = improvement

    // For non-directional metrics (avgBedtime, avgWakeTime), use "shifted"
    if (metric === "avgBedtime" || metric === "avgWakeTime") {
      direction = absoluteChange > 0 ? "declining" : "improving"; // later = declining pattern
      explanationKey =
        absoluteChange > 0
          ? "analytics.trend.later"
          : "analytics.trend.earlier";
    } else {
      direction = isImproving ? "improving" : "declining";
      explanationKey = isImproving
        ? "analytics.trend.improving"
        : "analytics.trend.declining";
    }
  }

  const confidence = assessConfidence(currentN, previousN, absoluteChange, threshold);

  return {
    metric,
    direction,
    currentValue: Math.round(currentVal * 10) / 10,
    previousValue: Math.round(previousVal * 10) / 10,
    absoluteChange: Math.round(absoluteChange * 10) / 10,
    percentageChange,
    sampleSizeCurrent: currentN,
    sampleSizePrevious: previousN,
    explanationKey,
    confidence,
  };
}

// ============================================
// Batch Trend Calculation
// ============================================

/**
 * Calculate trends for all metrics across current vs previous windows.
 *
 * Splits records into currentPeriodDays and previousPeriodDays.
 * Uses "prior period" comparison: last N days vs N days before that.
 */
export function calculateAllTrends(
  records: SleepRecord[],
  periodDays: number,
  now: Date = new Date(),
): Record<MetricKey, MetricTrend | null> {
  const today = isoDaysAgo(0, now);
  const currentStart = isoDaysAgo(periodDays - 1, now);
  const previousEnd = addDays(currentStart, -1);
  const previousStart = addDays(currentStart, -periodDays);

  const currentRecords = recordsInRange(records, currentStart, today) as SleepRecord[];
  const previousRecords = recordsInRange(records, previousStart, previousEnd) as SleepRecord[];

  const metrics: MetricKey[] = [
    "sleepEfficiency",
    "totalSleepTime",
    "sleepOnsetLatency",
    "wakeAfterSleepOnset",
    "numberOfAwakenings",
    "sleepRegularity",
    "diaryCompletionRate",
    "sleepQuality",
    "mood",
  ];

  const result: Record<string, MetricTrend | null> = {};

  for (const metric of metrics) {
    result[metric] = calculateMetricTrend(currentRecords, previousRecords, metric);
  }

  return result as Record<MetricKey, MetricTrend | null>;
}

/**
 * Get the "primary" trend — the most actionable, highest-confidence trend.
 * Returns null if no meaningful trend exists.
 */
export function getPrimaryTrend(
  trends: Record<MetricKey, MetricTrend | null>,
): MetricTrend | null {
  const meaningful = Object.values(trends).filter(
    (t): t is MetricTrend =>
      t !== null &&
      t.direction !== "insufficient_data" &&
      t.direction !== "stable",
  );

  if (meaningful.length === 0) return null;

  // Sort by confidence (high > medium > low), then by absolute change magnitude
  const confOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
  meaningful.sort((a, b) => {
    const confDiff = confOrder[b.confidence] - confOrder[a.confidence];
    if (confDiff !== 0) return confDiff;
    return Math.abs(b.absoluteChange ?? 0) - Math.abs(a.absoluteChange ?? 0);
  });

  return meaningful[0];
}
