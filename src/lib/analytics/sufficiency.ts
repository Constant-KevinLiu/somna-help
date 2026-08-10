/**
 * Phase F — Data Sufficiency Framework
 *
 * Every metric and insight declares whether enough data exists.
 * Thresholds are explicit and adjustable per metric.
 *
 * No trend claims from 1-2 records. No strong patterns from sparse data.
 */

import type { DataSufficiency, SufficiencyThresholds, MetricKey } from "./types";
import { DEFAULT_SUFFICIENCY } from "./types";

/**
 * Determine data sufficiency from a sample size and thresholds.
 */
export function dataSufficiency(
  sampleSize: number,
  thresholds: SufficiencyThresholds = DEFAULT_SUFFICIENCY,
): DataSufficiency {
  if (sampleSize < thresholds.none) return "none";
  if (sampleSize < thresholds.insufficient) return "insufficient";
  if (sampleSize < thresholds.limited) return "limited";
  return "sufficient";
}

/**
 * Per-metric minimum sample size thresholds.
 *
 * Most metrics use the default, but some require more data
 * to be meaningful (e.g., regularity needs variation, patterns need subgroups).
 */
export const METRIC_MINIMUMS: Record<MetricKey, number> = {
  timeInBed: 1,
  totalSleepTime: 1,
  sleepEfficiency: 1,
  sleepOnsetLatency: 1,
  wakeAfterSleepOnset: 1,
  numberOfAwakenings: 1,
  avgBedtime: 1,
  avgWakeTime: 1,
  bedtimeVariability: 2,
  wakeTimeVariability: 2,
  sleepRegularity: 3,
  diaryCompletionRate: 1,
  sleepQuality: 1,
  mood: 1,
};

/**
 * Get sufficiency for a specific metric given its sample size.
 */
export function metricSufficiency(metric: MetricKey, sampleSize: number): DataSufficiency {
  const min = METRIC_MINIMUMS[metric];
  if (sampleSize < min) return "none";

  // For variability/regularity metrics, shift thresholds higher
  if (metric === "sleepRegularity") {
    if (sampleSize < 3) return "none";
    if (sampleSize < 5) return "insufficient";
    if (sampleSize < 10) return "limited";
    return "sufficient";
  }

  if (metric === "bedtimeVariability" || metric === "wakeTimeVariability") {
    if (sampleSize < 2) return "none";
    if (sampleSize < 4) return "insufficient";
    if (sampleSize < 7) return "limited";
    return "sufficient";
  }

  // Default thresholds
  return dataSufficiency(sampleSize);
}

/**
 * Combined sufficiency for a set of metrics (takes the minimum).
 * The weakest metric determines the overall level.
 */
export function combinedSufficiency(
  metrics: { metric: MetricKey; sampleSize: number }[],
): DataSufficiency {
  if (metrics.length === 0) return "none";

  const order: DataSufficiency[] = ["none", "insufficient", "limited", "sufficient"];
  let worst: DataSufficiency = "sufficient";

  for (const { metric, sampleSize } of metrics) {
    const s = metricSufficiency(metric, sampleSize);
    if (order.indexOf(s) < order.indexOf(worst)) {
      worst = s;
    }
  }

  return worst;
}

/**
 * Get a calm, encouraging message key for each sufficiency state.
 * These are keys to be translated — not raw English text.
 */
export function sufficiencyMessageKey(state: DataSufficiency): string {
  switch (state) {
    case "none":
      return "analytics.sufficiency.none";
    case "insufficient":
      return "analytics.sufficiency.insufficient";
    case "limited":
      return "analytics.sufficiency.limited";
    case "sufficient":
      return "analytics.sufficiency.sufficient";
  }
}

/**
 * Whether a metric can be shown with confidence based on sufficiency.
 * "sufficient" and "limited" are displayable.
 * "insufficient" may be shown with a disclaimer.
 * "none" should not be shown as a number.
 */
export function canDisplayMetric(state: DataSufficiency): boolean {
  return state !== "none";
}

/**
 * Whether a trend claim is safe to make.
 * Requires at least "limited" data in both periods.
 */
export function canShowTrend(
  currentSampleSize: number,
  previousSampleSize: number,
  currentMetric: MetricKey,
): boolean {
  const currentSuf = metricSufficiency(currentMetric, currentSampleSize);
  const previousSuf = metricSufficiency(currentMetric, previousSampleSize);
  return (
    (currentSuf === "limited" || currentSuf === "sufficient") &&
    (previousSuf === "limited" || previousSuf === "sufficient")
  );
}

/**
 * Pattern-specific minimum requirements.
 */
export const PATTERN_MINIMUMS = {
  weekend_comparison: { weekday: 2, weekend: 2 },
  consistency: 3,
  streak: 2,
};

/**
 * Overall analysis sufficiency given a total record count.
 * Used for top-level dashboard state.
 */
export function overallSufficiency(recordCount: number): DataSufficiency {
  return dataSufficiency(recordCount);
}
