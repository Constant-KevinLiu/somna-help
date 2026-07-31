/**
 * Phase F — Trends Unit Tests
 */

import { describe, it, expect } from "vitest";
import {
  calculateMetricTrend,
  calculateAllTrends,
  getPrimaryTrend,
  MEANINGFUL_CHANGE,
  HIGHER_IS_BETTER,
} from "./trends";
import type { SleepRecord } from "@/lib/sleep-records";
import type { MetricKey } from "./types";

function makeRecord(overrides: Partial<SleepRecord> & { date: string }): SleepRecord {
  return {
    bedtime: "23:00",
    wakeUpTime: "07:00",
    sleepLatency: 15,
    nightAwakenings: 1,
    sleepEfficiency: 85,
    sleepQuality: 3,
    mood: 3,
    notes: "",
    ...overrides,
  } as SleepRecord;
}

describe("trends", () => {
  describe("MEANINGFUL_CHANGE thresholds", () => {
    it("has thresholds for key metrics", () => {
      expect(MEANINGFUL_CHANGE.sleepEfficiency).toBeTruthy();
      expect(MEANINGFUL_CHANGE.totalSleepTime).toBeTruthy();
      expect(MEANINGFUL_CHANGE.sleepQuality).toBeTruthy();
    });

    it("HIGHER_IS_BETTER has entries for key metrics", () => {
      expect(HIGHER_IS_BETTER.sleepEfficiency).toBe(true);
      expect(HIGHER_IS_BETTER.sleepOnsetLatency).toBe(false);
      expect(HIGHER_IS_BETTER.numberOfAwakenings).toBe(false);
    });
  });

  describe("calculateMetricTrend", () => {
    it("returns insufficient_data when one period has zero records", () => {
      const current = [makeRecord({ date: "2024-01-04", sleepEfficiency: 85 })];
      const previous: SleepRecord[] = [];
      const trend = calculateMetricTrend(current, previous, "sleepEfficiency");
      expect(trend.direction).toBe("insufficient_data");
    });

    it("detects improving efficiency", () => {
      const current: SleepRecord[] = [];
      const previous: SleepRecord[] = [];
      for (let i = 0; i < 7; i++) {
        current.push(makeRecord({ date: `2024-01-0${8 + i}`, sleepEfficiency: 90 }));
        previous.push(makeRecord({ date: `2024-01-0${1 + i}`, sleepEfficiency: 80 }));
      }
      const trend = calculateMetricTrend(current, previous, "sleepEfficiency");
      expect(trend.direction).toBe("improving");
    });

    it("detects declining efficiency", () => {
      const current: SleepRecord[] = [];
      const previous: SleepRecord[] = [];
      for (let i = 0; i < 7; i++) {
        current.push(makeRecord({ date: `2024-01-0${8 + i}`, sleepEfficiency: 75 }));
        previous.push(makeRecord({ date: `2024-01-0${1 + i}`, sleepEfficiency: 85 }));
      }
      const trend = calculateMetricTrend(current, previous, "sleepEfficiency");
      expect(trend.direction).toBe("declining");
    });

    it("detects stable when change is below threshold", () => {
      const current: SleepRecord[] = [];
      const previous: SleepRecord[] = [];
      for (let i = 0; i < 7; i++) {
        current.push(makeRecord({ date: `2024-01-0${8 + i}`, sleepEfficiency: 86 }));
        previous.push(makeRecord({ date: `2024-01-0${1 + i}`, sleepEfficiency: 85 }));
      }
      const trend = calculateMetricTrend(current, previous, "sleepEfficiency");
      expect(trend.direction).toBe("stable");
    });
  });

  describe("calculateAllTrends", () => {
    it("returns trend for every metric key", () => {
      const now = new Date("2024-01-14T12:00:00Z");
      const records: SleepRecord[] = [];
      for (let i = 0; i < 14; i++) {
        records.push(
          makeRecord({
            date: `2024-01-${String(i + 1).padStart(2, "0")}`,
            sleepEfficiency: 80 + i,
          }),
        );
      }
      const trends = calculateAllTrends(records, 7, now);
      const keys = Object.keys(trends) as MetricKey[];
      expect(keys.length).toBeGreaterThan(0);
      for (const key of keys) {
        const trend = trends[key];
        expect(trend).toBeTruthy();
        expect(trend!.metric).toBe(key);
      }
    });
  });

  describe("getPrimaryTrend", () => {
    it("returns the most significant trend with strong improvement", () => {
      const now = new Date("2024-01-14T12:00:00Z");
      const records: SleepRecord[] = [];
      for (let i = 0; i < 14; i++) {
        // Previous week: ~60-65% efficiency. Current week: ~85-90%.
        const eff = i < 7 ? 60 + i : 85 + (i - 7);
        records.push(
          makeRecord({
            date: `2024-01-${String(i + 1).padStart(2, "0")}`,
            sleepEfficiency: eff,
          }),
        );
      }
      const trends = calculateAllTrends(records, 7, now);
      const primary = getPrimaryTrend(trends);
      expect(primary).toBeTruthy();
      expect(primary!.direction).toBe("improving");
    });

    it("returns null when all trends are stable or insufficient", () => {
      const now = new Date("2024-01-10T12:00:00Z");
      const records: SleepRecord[] = [];
      for (let i = 0; i < 10; i++) {
        records.push(
          makeRecord({
            date: `2024-01-${String(i + 1).padStart(2, "0")}`,
            sleepEfficiency: 85, // perfectly stable
          }),
        );
      }
      const trends = calculateAllTrends(records, 5, now);
      const primary = getPrimaryTrend(trends);
      expect(primary).toBe(null);
    });
  });
});
