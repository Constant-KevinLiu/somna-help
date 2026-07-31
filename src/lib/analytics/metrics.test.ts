/**
 * Phase F — Metrics Unit Tests
 *
 * Tests metric calculations including circular time math.
 */

import { describe, it, expect } from "vitest";
import {
  hhmmToMinutes,
  minutesToHHMM,
  circularAverageMinutes,
  circularStdDevMinutes,
  computeTotalSleepTime,
  sleepRegularity,
  diaryCompletionRate,
  weekendBedtimeDifference,
  weekendWakeTimeDifference,
  longestStreak,
  stableWakeStreak,
  computeMetrics,
} from "./metrics";
import type { SleepRecord } from "@/lib/sleep-records";

function makeRecord(overrides: Partial<SleepRecord> & { date: string }): SleepRecord {
  return {
    bedtime: "23:00",
    wakeUpTime: "07:00",
    sleepLatency: 15,
    nightAwakenings: 1,
    sleepEfficiency: 90,
    sleepQuality: 3,
    mood: 3,
    notes: "",
    ...overrides,
  } as SleepRecord;
}

describe("metrics", () => {
  describe("hhmmToMinutes / minutesToHHMM", () => {
    it("converts HH:MM to minutes since midnight", () => {
      expect(hhmmToMinutes("00:00")).toBe(0);
      expect(hhmmToMinutes("06:30")).toBe(390);
      expect(hhmmToMinutes("12:00")).toBe(720);
      expect(hhmmToMinutes("23:59")).toBe(1439);
    });

    it("round-trips correctly", () => {
      const cases = ["00:00", "06:30", "12:00", "23:59", "07:05"];
      for (const c of cases) {
        expect(minutesToHHMM(hhmmToMinutes(c))).toBe(c);
      }
    });
  });

  describe("circularAverageMinutes", () => {
    it("returns null for empty array", () => {
      expect(circularAverageMinutes([])).toBe(null);
    });

    it("computes simple average for same time", () => {
      expect(circularAverageMinutes([600, 600, 600])).toBe(600);
    });

    it("handles times clustered near each other", () => {
      const avg = circularAverageMinutes([22 * 60, 22 * 60 + 30, 23 * 60]);
      expect(avg).not.toBeNull();
      expect(Math.abs(avg! - (22 * 60 + 30)) < 1).toBe(true);
    });

    it("correctly wraps around midnight (vector mean)", () => {
      const avg = circularAverageMinutes([23 * 60, 1 * 60]);
      expect(avg).not.toBeNull();
      expect(Math.abs(avg! - 0) < 5 || Math.abs(avg! - 1440) < 5).toBe(true);
    });

    it("handles three times spanning midnight", () => {
      const avg = circularAverageMinutes([23 * 60 + 30, 0, 30]);
      expect(avg).not.toBeNull();
      const dist = Math.min(avg!, 1440 - avg!);
      expect(dist < 10).toBe(true);
    });
  });

  describe("circularStdDevMinutes", () => {
    it("returns null for empty array", () => {
      expect(circularStdDevMinutes([])).toBe(null);
    });

    it("returns ~0 for identical times", () => {
      const sd = circularStdDevMinutes([480, 480, 480]);
      expect(sd).not.toBeNull();
      expect(sd! < 1).toBe(true);
    });

    it("returns larger value for more spread", () => {
      const tight = circularStdDevMinutes([480, 485, 490]) ?? 0;
      const wide = circularStdDevMinutes([420, 480, 540]) ?? 0;
      expect(wide > tight).toBe(true);
    });
  });

  describe("computeTotalSleepTime", () => {
    it("calculates TST = TIB - SOL - WASO (10min per awakening)", () => {
      const record = makeRecord({
        date: "2024-01-01",
        bedtime: "23:00",
        wakeUpTime: "07:00",
        sleepLatency: 20,
        nightAwakenings: 2,
      });
      expect(computeTotalSleepTime(record)).toBe(440);
    });

    it("handles zero awakenings", () => {
      const record = makeRecord({
        date: "2024-01-01",
        bedtime: "23:00",
        wakeUpTime: "07:00",
        sleepLatency: 10,
        nightAwakenings: 0,
      });
      expect(computeTotalSleepTime(record)).toBe(470);
    });
  });

  describe("sleepRegularity", () => {
    it("returns null for fewer than 3 records", () => {
      const records = [
        makeRecord({ date: "2024-01-01", bedtime: "23:00", wakeUpTime: "07:00" }),
        makeRecord({ date: "2024-01-02", bedtime: "23:00", wakeUpTime: "07:00" }),
      ];
      expect(sleepRegularity(records)).toBe(null);
    });

    it("returns ~100 for perfectly consistent times", () => {
      const records = [];
      for (let i = 0; i < 7; i++) {
        records.push(
          makeRecord({
            date: `2024-01-0${i + 1}`,
            bedtime: "23:00",
            wakeUpTime: "07:00",
          }),
        );
      }
      const reg = sleepRegularity(records);
      expect(reg).not.toBeNull();
      expect(reg! > 95).toBe(true);
    });

    it("returns lower for variable bedtimes", () => {
      const records = [];
      const bedtimes = ["21:00", "22:30", "00:00", "01:30", "23:00", "22:00", "00:30"];
      for (let i = 0; i < 7; i++) {
        records.push(
          makeRecord({
            date: `2024-01-0${i + 1}`,
            bedtime: bedtimes[i],
            wakeUpTime: "07:00",
          }),
        );
      }
      const reg = sleepRegularity(records);
      expect(reg).not.toBeNull();
      expect(reg! < 80).toBe(true);
    });
  });

  describe("diaryCompletionRate", () => {
    it("returns 100% when all eligible days have records", () => {
      const records = [];
      for (let i = 0; i < 7; i++) {
        records.push(makeRecord({ date: `2024-01-0${i + 1}` }));
      }
      expect(diaryCompletionRate(records, 7)).toBe(100);
    });

    it("returns 0% with no records", () => {
      expect(diaryCompletionRate([], 7)).toBe(0);
    });

    it("returns correct percentage (rounded)", () => {
      const records = [
        makeRecord({ date: "2024-01-01" }),
        makeRecord({ date: "2024-01-03" }),
        makeRecord({ date: "2024-01-05" }),
      ];
      expect(diaryCompletionRate(records, 7)).toBe(43);
    });
  });

  describe("longestStreak", () => {
    it("finds longest consecutive streak of records", () => {
      const records = [
        makeRecord({ date: "2024-01-01" }),
        makeRecord({ date: "2024-01-02" }),
        makeRecord({ date: "2024-01-03" }),
        makeRecord({ date: "2024-01-05" }),
        makeRecord({ date: "2024-01-06" }),
      ];
      expect(longestStreak(records)).toBe(3);
    });

    it("returns 0 for empty", () => {
      expect(longestStreak([])).toBe(0);
    });
  });

  describe("computeMetrics", () => {
    it("computes all metrics for a week of consistent data", () => {
      const records = [];
      for (let i = 0; i < 7; i++) {
        records.push(
          makeRecord({
            date: `2024-01-0${i + 1}`,
            bedtime: "23:00",
            wakeUpTime: "07:00",
            sleepLatency: 15,
            nightAwakenings: 1,
            sleepEfficiency: 92,
          }),
        );
      }
      const bundle = computeMetrics(records, 7);

      expect(bundle.sleepEfficiency).toBe(92);
      expect(bundle.totalSleepTime).not.toBeNull();
      expect(bundle.totalSleepTime! > 400).toBe(true);
      expect(bundle.avgBedtime).not.toBeNull();
      expect(bundle.avgWakeTime).not.toBeNull();
      expect(bundle.diaryCompletionRate).toBe(100);
      expect(bundle.sleepRegularity).not.toBeNull();
      expect(bundle.sleepRegularity! > 90).toBe(true);
    });

    it("handles empty records gracefully", () => {
      const bundle = computeMetrics([], 7);
      expect(bundle.timeInBed).toBe(null);
      expect(bundle.totalSleepTime).toBe(null);
      expect(bundle.sleepEfficiency).toBe(null);
      expect(bundle.avgBedtime).toBe(null);
      expect(bundle.diaryCompletionRate).toBe(0);
    });
  });
});
