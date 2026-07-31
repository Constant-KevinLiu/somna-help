/**
 * Phase F — Core Metric Calculations
 *
 * All pure, deterministic functions over canonical SleepRecord data.
 *
 * Conventions:
 * - Times are "HH:MM" strings (local time)
 * - Dates are "YYYY-MM-DD" strings (local calendar date)
 * - Durations are in minutes (number)
 * - Return null when calculation is not valid or data is insufficient
 * - Never return NaN or Infinity
 *
 * These are DERIVED metrics. They never modify canonical records.
 */

import type { SleepRecord } from "@/lib/sleep-records";
import { minutesInBed } from "@/lib/sleep-records";
import type { MetricKey } from "./types";
import { isWeekday, isWeekend } from "./date-ranges";

// ============================================
// Time-of-Day Conversion Helpers
// ============================================

/** Convert HH:MM to minutes since midnight. */
export function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** Convert minutes since midnight to HH:MM. */
export function minutesToHHMM(minutes: number): string {
  const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ============================================
// Circular Time Averages
// ============================================

/**
 * Circular average of time-of-day values.
 *
 * Avoids the "23:30 and 00:30 average to noon" problem.
 * Uses vector mean on the unit circle.
 *
 * For times that cluster around midnight (bedtimes), this correctly
 * handles the wrap-around.
 *
 * Returns minutes since midnight (0-1439), or null if empty.
 */
export function circularAverageMinutes(timesMinutes: number[]): number | null {
  if (timesMinutes.length === 0) return null;

  // Convert each time to an angle on the unit circle
  // 0 minutes = 0 radians = 3 o'clock position → but we want midnight at top
  // Actually: let's use standard approach: map 0-1440 min to 0-2π radians
  let sumSin = 0;
  let sumCos = 0;

  for (const t of timesMinutes) {
    const angle = (t / (24 * 60)) * 2 * Math.PI;
    sumSin += Math.sin(angle);
    sumCos += Math.cos(angle);
  }

  const avgSin = sumSin / timesMinutes.length;
  const avgCos = sumCos / timesMinutes.length;

  // Mean angle
  let meanAngle = Math.atan2(avgSin, avgCos);
  if (meanAngle < 0) meanAngle += 2 * Math.PI;

  // Convert back to minutes
  const meanMinutes = Math.round((meanAngle / (2 * Math.PI)) * 24 * 60);
  return ((meanMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
}

/**
 * Circular standard deviation of time-of-day values.
 *
 * Uses the resultant vector length R to derive angular standard deviation.
 * R = sqrt(sin_avg² + cos_avg²)
 * sd_radians = sqrt(-2 * ln(R))
 * sd_minutes = sd_radians / (2π) * 1440
 *
 * Returns standard deviation in minutes, or null if empty.
 * If all values are identical, returns 0.
 */
export function circularStdDevMinutes(timesMinutes: number[]): number | null {
  if (timesMinutes.length === 0) return null;
  if (timesMinutes.length === 1) return 0;

  let sumSin = 0;
  let sumCos = 0;

  for (const t of timesMinutes) {
    const angle = (t / (24 * 60)) * 2 * Math.PI;
    sumSin += Math.sin(angle);
    sumCos += Math.cos(angle);
  }

  const n = timesMinutes.length;
  const r = Math.sqrt((sumSin / n) ** 2 + (sumCos / n) ** 2);

  // R = 1 means all points identical → sd = 0
  // R close to 0 means widely dispersed
  if (r >= 1) return 0;
  if (r <= 0) return 24 * 60 / 4; // max dispersion (uniform) ≈ 360 min

  const sdRadians = Math.sqrt(-2 * Math.log(r));
  const sdMinutes = Math.round((sdRadians / (2 * Math.PI)) * 24 * 60);
  return Math.min(sdMinutes, 720); // cap at 12h (half a day)
}

// ============================================
// Per-Record Derived Metrics
// ============================================

/** Total Sleep Time in minutes. Returns null if TIB is invalid. */
export function computeTotalSleepTime(record: {
  bedtime: string;
  wakeUpTime: string;
  sleepLatency: number;
  nightAwakenings: number;
}): number | null {
  const tib = minutesInBed(record.bedtime, record.wakeUpTime);
  if (tib <= 0) return null;
  const tst = tib - record.sleepLatency - record.nightAwakenings * 10;
  return Math.max(0, tst);
}

/** Wake After Sleep Onset in minutes (estimated at 10 min per awakening). */
export function computeWASO(nightAwakenings: number): number {
  return nightAwakenings * 10;
}

// ============================================
// Aggregate Metrics
// ============================================

/** Simple arithmetic mean of numbers, or null if empty. */
export function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((s, v) => s + v, 0);
  return sum / values.length;
}

/** Standard deviation of numbers, or null if < 2 values. */
export function stdDev(values: number[]): number | null {
  if (values.length < 2) return values.length === 1 ? 0 : null;
  const avg = mean(values)!;
  const squaredDiffs = values.map((v) => (v - avg) ** 2);
  const variance = mean(squaredDiffs)!;
  return Math.sqrt(variance);
}

/** Average bedtime using circular time average. Returns HH:MM string or null. */
export function avgBedtime(records: SleepRecord[]): string | null {
  const times = records.map((r) => hhmmToMinutes(r.bedtime));
  const avg = circularAverageMinutes(times);
  return avg === null ? null : minutesToHHMM(avg);
}

/** Average wake time using circular time average. Returns HH:MM string or null. */
export function avgWakeTime(records: SleepRecord[]): string | null {
  const times = records.map((r) => hhmmToMinutes(r.wakeUpTime));
  const avg = circularAverageMinutes(times);
  return avg === null ? null : minutesToHHMM(avg);
}

/** Bedtime variability (circular std dev in minutes). */
export function bedtimeVariability(records: SleepRecord[]): number | null {
  const times = records.map((r) => hhmmToMinutes(r.bedtime));
  return circularStdDevMinutes(times);
}

/** Wake time variability (circular std dev in minutes). */
export function wakeTimeVariability(records: SleepRecord[]): number | null {
  const times = records.map((r) => hhmmToMinutes(r.wakeUpTime));
  return circularStdDevMinutes(times);
}

/**
 * Sleep Regularity Score (0-100).
 *
 * Based on bedtime and wake-time variability.
 * Higher score = more regular sleep schedule.
 *
 * Formula:
 *   avgVariability = (bedtimeSD + wakeTimeSD) / 2
 *   score = max(0, 100 - avgVariability * scalingFactor)
 *
 * Scaling: 30 minutes average SD → score of ~85
 *          60 minutes average SD → score of ~70
 *          120 minutes average SD → score of ~40
 *
 * Returns null if fewer than 3 records.
 */
export function sleepRegularity(records: SleepRecord[]): number | null {
  if (records.length < 3) return null;

  const bedSD = bedtimeVariability(records);
  const wakeSD = wakeTimeVariability(records);

  if (bedSD === null || wakeSD === null) return null;

  const avgVar = (bedSD + wakeSD) / 2;
  // Scale factor: each minute of variability reduces score by 0.5
  // This means:
  //   0 min avg SD → 100 (perfect regularity)
  //   20 min avg SD → 90
  //   40 min avg SD → 80
  //   100 min avg SD → 50
  //   200 min avg SD → 0
  const score = Math.max(0, 100 - avgVar * 0.5);
  return Math.round(score);
}

/**
 * Diary completion rate = records in range / eligible days × 100.
 *
 * Eligible days are all calendar days from start to end inclusive.
 * Returns null if eligibleDays is 0.
 */
export function diaryCompletionRate(
  records: { date: string }[],
  eligibleDays: number,
): number | null {
  if (eligibleDays <= 0) return null;
  const uniqueDays = new Set(records.map((r) => r.date));
  return Math.round((uniqueDays.size / eligibleDays) * 100);
}

// ============================================
// Weekday vs Weekend Comparisons
// ============================================

/** Split records into weekday and weekend groups. */
export function splitByWeekdayWeekend(records: SleepRecord[]): {
  weekday: SleepRecord[];
  weekend: SleepRecord[];
} {
  const weekday: SleepRecord[] = [];
  const weekend: SleepRecord[] = [];

  for (const r of records) {
    if (isWeekday(r.date)) {
      weekday.push(r);
    } else {
      weekend.push(r);
    }
  }

  return { weekday, weekend };
}

/**
 * Average bedtime difference: weekend minus weekday (in minutes).
 * Positive = later on weekends. Negative = earlier on weekends.
 * Returns null if either group has < 2 records.
 */
export function weekendBedtimeDifference(records: SleepRecord[]): number | null {
  const { weekday, weekend } = splitByWeekdayWeekend(records);
  if (weekday.length < 2 || weekend.length < 2) return null;

  const wdAvg = circularAverageMinutes(weekday.map((r) => hhmmToMinutes(r.bedtime)));
  const weAvg = circularAverageMinutes(weekend.map((r) => hhmmToMinutes(r.bedtime)));

  if (wdAvg === null || weAvg === null) return null;

  // Compute the shortest path difference on the circle
  let diff = weAvg - wdAvg;
  // Normalize to [-720, 720] (±12 hours) — the shorter direction
  if (diff > 720) diff -= 1440;
  if (diff < -720) diff += 1440;
  return diff;
}

/**
 * Average wake time difference: weekend minus weekday (in minutes).
 * Positive = later on weekends.
 * Returns null if either group has < 2 records.
 */
export function weekendWakeTimeDifference(records: SleepRecord[]): number | null {
  const { weekday, weekend } = splitByWeekdayWeekend(records);
  if (weekday.length < 2 || weekend.length < 2) return null;

  const wdAvg = circularAverageMinutes(weekday.map((r) => hhmmToMinutes(r.wakeUpTime)));
  const weAvg = circularAverageMinutes(weekend.map((r) => hhmmToMinutes(r.wakeUpTime)));

  if (wdAvg === null || weAvg === null) return null;

  let diff = weAvg - wdAvg;
  if (diff > 720) diff -= 1440;
  if (diff < -720) diff += 1440;
  return diff;
}

// ============================================
// Streak & Consistency
// ============================================

/**
 * Longest consecutive streak of days with records (within a date range).
 * Returns 0 if no records.
 */
export function longestStreak(records: { date: string }[]): number {
  if (records.length === 0) return 0;

  const dates = new Set(records.map((r) => r.date));
  const sorted = Array.from(dates).sort();

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const prevDate = new Date(prev);
    const currDate = new Date(curr);
    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

/**
 * Stable wake time streak: consecutive days where wake time is within threshold of the average.
 * Returns streak length in days, 0 if none.
 */
export function stableWakeStreak(records: SleepRecord[], thresholdMinutes = 30): number {
  if (records.length === 0) return 0;

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const times = sorted.map((r) => hhmmToMinutes(r.wakeUpTime));

  let bestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < times.length; i++) {
    // Check if consecutive calendar day
    const prevDate = new Date(sorted[i - 1].date);
    const currDate = new Date(sorted[i].date);
    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays !== 1) {
      currentStreak = 1;
      continue;
    }

    // Check if wake times are within threshold (circular difference)
    let diff = Math.abs(times[i] - times[i - 1]);
    if (diff > 720) diff = 1440 - diff; // shorter arc

    if (diff <= thresholdMinutes) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return bestStreak;
}

// ============================================
// Metric Bundle — all computed at once
// ============================================

export interface MetricBundle {
  timeInBed: number | null;          // avg minutes
  totalSleepTime: number | null;     // avg minutes
  sleepEfficiency: number | null;    // avg percent
  sleepOnsetLatency: number | null;  // avg minutes
  wakeAfterSleepOnset: number | null; // avg minutes
  numberOfAwakenings: number | null; // avg count
  avgBedtime: string | null;         // HH:MM
  avgWakeTime: string | null;        // HH:MM
  bedtimeVariability: number | null; // SD minutes
  wakeTimeVariability: number | null; // SD minutes
  sleepRegularity: number | null;    // 0-100
  diaryCompletionRate: number | null; // percent
  sleepQuality: number | null;       // avg 1-5
  mood: number | null;               // avg 1-5
  recordCount: number;
  eligibleDays: number;
}

/**
 * Compute all metrics for a set of records.
 * eligibleDays = number of calendar days in the analysis window.
 */
export function computeMetrics(
  records: SleepRecord[],
  eligibleDays: number,
): MetricBundle {
  const recordCount = records.length;

  // Scalar averages
  const tstValues = records
    .map((r) => computeTotalSleepTime(r))
    .filter((v): v is number => v !== null);

  const efficiencyValues = records.map((r) => r.sleepEfficiency);
  const latencyValues = records.map((r) => r.sleepLatency);
  const wasoValues = records.map((r) => computeWASO(r.nightAwakenings));
  const awakeningValues = records.map((r) => r.nightAwakenings);
  const qualityValues = records.map((r) => r.sleepQuality);
  const moodValues = records.map((r) => r.mood);

  // Time in bed (average)
  const tibValues = records.map((r) => minutesInBed(r.bedtime, r.wakeUpTime));
  const avgTIB = mean(tibValues);

  return {
    timeInBed: avgTIB ? Math.round(avgTIB) : null,
    totalSleepTime: tstValues.length > 0 ? Math.round(mean(tstValues)!) : null,
    sleepEfficiency:
      efficiencyValues.length > 0 ? Math.round(mean(efficiencyValues)!) : null,
    sleepOnsetLatency:
      latencyValues.length > 0 ? Math.round(mean(latencyValues)!) : null,
    wakeAfterSleepOnset:
      wasoValues.length > 0 ? Math.round(mean(wasoValues)!) : null,
    numberOfAwakenings:
      awakeningValues.length > 0
        ? Math.round((mean(awakeningValues) ?? 0) * 10) / 10
        : null,
    avgBedtime: avgBedtime(records),
    avgWakeTime: avgWakeTime(records),
    bedtimeVariability: bedtimeVariability(records),
    wakeTimeVariability: wakeTimeVariability(records),
    sleepRegularity: sleepRegularity(records),
    diaryCompletionRate: diaryCompletionRate(records, eligibleDays),
    sleepQuality:
      qualityValues.length > 0 ? Math.round(mean(qualityValues)! * 10) / 10 : null,
    mood: moodValues.length > 0 ? Math.round(mean(moodValues)! * 10) / 10 : null,
    recordCount,
    eligibleDays,
  };
}

/** Get a metric value by key from a bundle. Returns number or string or null. */
export function getMetricValue(
  bundle: MetricBundle,
  key: MetricKey,
): number | string | null {
  switch (key) {
    case "timeInBed":
      return bundle.timeInBed;
    case "totalSleepTime":
      return bundle.totalSleepTime;
    case "sleepEfficiency":
      return bundle.sleepEfficiency;
    case "sleepOnsetLatency":
      return bundle.sleepOnsetLatency;
    case "wakeAfterSleepOnset":
      return bundle.wakeAfterSleepOnset;
    case "numberOfAwakenings":
      return bundle.numberOfAwakenings;
    case "avgBedtime":
      return bundle.avgBedtime;
    case "avgWakeTime":
      return bundle.avgWakeTime;
    case "bedtimeVariability":
      return bundle.bedtimeVariability;
    case "wakeTimeVariability":
      return bundle.wakeTimeVariability;
    case "sleepRegularity":
      return bundle.sleepRegularity;
    case "diaryCompletionRate":
      return bundle.diaryCompletionRate;
    case "sleepQuality":
      return bundle.sleepQuality;
    case "mood":
      return bundle.mood;
  }
}
