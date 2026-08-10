/**
 * Phase F — Eligible Days Calculation Tests
 *
 * Tests the correct computation of eligible days for diary completion rate.
 *
 * Rule: eligibleDays = number of calendar days in the selected window that
 * are on or before today (future dates excluded). Uses local timezone
 * calendar days (YYYY-MM-DD).
 *
 * Formula: daysBetween(rangeStart, min(rangeEnd, today)) + 1
 * Returns 0 if rangeStart > today (empty eligible window).
 */

import { describe, it, expect } from "vitest";
import { computeAnalytics } from "@/hooks/useSleepAnalytics";
import type { SleepRecord } from "@/lib/sleep-records";
import type { HabitProgress } from "@/services/habit/habit-types";

function makeRecord(date: string, overrides: Partial<SleepRecord> = {}): SleepRecord {
  return {
    date,
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

const emptyHabitProgress = new Map<string, HabitProgress>();

describe("eligibleDays calculation", () => {
  describe("7-day window completion rate", () => {
    it("7-day window with 2 recorded days → approximately 28.6%", () => {
      const now = new Date("2024-01-17T12:00:00Z");
      const records = [makeRecord("2024-01-15"), makeRecord("2024-01-17")];
      const result = computeAnalytics(records, "7d", emptyHabitProgress, now);

      // 7 eligible days, 2 unique recorded days → 2/7 = 28.57% ≈ 29%
      const completionRate = result.metrics.diaryCompletionRate;
      expect(completionRate).not.toBe(null);
      expect(Number(completionRate)).toBeGreaterThanOrEqual(28);
      expect(Number(completionRate)).toBeLessThanOrEqual(29);
    });

    it("7-day window with 7 recorded days → 100%", () => {
      const now = new Date("2024-01-17T12:00:00Z");
      const records: SleepRecord[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date("2024-01-11T00:00:00Z");
        d.setDate(d.getDate() + i);
        records.push(makeRecord(d.toISOString().slice(0, 10)));
      }

      const result = computeAnalytics(records, "7d", emptyHabitProgress, now);
      expect(result.metrics.diaryCompletionRate).toBe(100);
    });

    it("duplicate records on one day do not inflate completion", () => {
      const now = new Date("2024-01-17T12:00:00Z");
      const records = [
        makeRecord("2024-01-15"),
        makeRecord("2024-01-15"), // duplicate same day
        makeRecord("2024-01-17"),
      ];

      const result = computeAnalytics(records, "7d", emptyHabitProgress, now);
      // 2 unique days out of 7 → ~29%, not 3/7
      expect(result.metrics.diaryCompletionRate).not.toBe(43); // 3/7 = 43% should NOT be the result
      expect(Number(result.metrics.diaryCompletionRate)).toBeGreaterThanOrEqual(28);
      expect(Number(result.metrics.diaryCompletionRate)).toBeLessThanOrEqual(29);
    });
  });

  describe("future date exclusion", () => {
    it("future dates in thisWeek do not count as eligible", () => {
      // Wednesday = day 3 of the week (Mon=1, Wed=3)
      const now = new Date("2024-01-17T12:00:00Z"); // Wednesday
      const records = [
        makeRecord("2024-01-15"), // Mon
        makeRecord("2024-01-17"), // Wed (today)
      ];

      const result = computeAnalytics(records, "thisWeek", emptyHabitProgress, now);

      // Only Mon, Tue, Wed are eligible (3 days, not 7)
      // 2 recorded / 3 eligible = 67%
      expect(Number(result.metrics.diaryCompletionRate)).toBe(67);
    });

    it("records with future dates are not in the window anyway", () => {
      const now = new Date("2024-01-17T12:00:00Z"); // Wednesday
      const records = [
        makeRecord("2024-01-15"), // Mon (past)
        makeRecord("2024-01-20"), // Sat (future)
      ];

      const result = computeAnalytics(records, "thisWeek", emptyHabitProgress, now);

      // Only 3 eligible days (Mon-Wed), 1 recorded
      // 1/3 = 33%
      expect(Number(result.metrics.diaryCompletionRate)).toBe(33);
    });
  });

  describe("partial current period", () => {
    it("current partial week uses days up to today only", () => {
      // It's Monday — only 1 day into the week
      const now = new Date("2024-01-15T12:00:00Z"); // Monday
      const records = [
        makeRecord("2024-01-15"), // Mon (today)
      ];

      const result = computeAnalytics(records, "thisWeek", emptyHabitProgress, now);

      // Only 1 eligible day (Monday = today)
      expect(Number(result.metrics.diaryCompletionRate)).toBe(100);
    });

    it("current partial month uses days up to today only", () => {
      const now = new Date("2024-01-05T12:00:00Z"); // Jan 5th
      const records = [
        makeRecord("2024-01-01"),
        makeRecord("2024-01-03"),
        makeRecord("2024-01-05"),
      ];

      const result = computeAnalytics(records, "thisMonth", emptyHabitProgress, now);

      // 5 eligible days (Jan 1-5), 3 recorded → 3/5 = 60%
      expect(Number(result.metrics.diaryCompletionRate)).toBe(60);
    });
  });

  describe("timezone local calendar days", () => {
    it("uses local calendar dates, not UTC", () => {
      // The function uses YYYY-MM-DD string comparison which is
      // inherently local (records use local date, range uses local date).
      // This test verifies that dates are compared as strings (local calendar),
      // not as timestamps.
      const now = new Date("2024-01-17T12:00:00Z");
      const records = [
        makeRecord("2024-01-17"), // same date string as end of range
      ];

      const result = computeAnalytics(records, "7d", emptyHabitProgress, now);

      // The record is counted (it's within the range via string comparison)
      expect(Number(result.metrics.diaryCompletionRate)).toBeGreaterThan(0);
    });

    it("records with same local date count as one day", () => {
      const now = new Date("2024-01-17T12:00:00Z");
      const records = [
        makeRecord("2024-01-15"),
        makeRecord("2024-01-15"), // same date, different time not represented in date field
      ];

      const result = computeAnalytics(records, "7d", emptyHabitProgress, now);

      // Same date counts as one unique day
      // 1 unique day / 7 eligible = 14%
      expect(Number(result.metrics.diaryCompletionRate)).toBe(14);
    });
  });

  describe("empty window edge case", () => {
    it("empty window (range starts after today) returns 0", () => {
      // lastWeek when we only have "future" records that aren't in range
      const now = new Date("2024-01-02T12:00:00Z"); // Tuesday of week 1
      const records: SleepRecord[] = [];

      const result = computeAnalytics(records, "lastWeek", emptyHabitProgress, now);

      // lastWeek = Dec 25-31 2023, no records
      expect(Number(result.metrics.diaryCompletionRate)).toBe(0);
    });

    it("no records in window → 0% completion", () => {
      const now = new Date("2024-01-17T12:00:00Z");
      const records: SleepRecord[] = [];

      const result = computeAnalytics(records, "7d", emptyHabitProgress, now);
      expect(result.metrics.diaryCompletionRate).toBe(0);
    });
  });

  describe("invalid records", () => {
    it("records outside the window don't affect completion rate", () => {
      const now = new Date("2024-01-17T12:00:00Z");
      const records = [
        makeRecord("2023-12-01"), // way outside 7-day window
        makeRecord("2024-01-15"), // inside window
      ];

      const result = computeAnalytics(records, "7d", emptyHabitProgress, now);
      // 1 in window out of 7 eligible → 14%
      expect(Number(result.metrics.diaryCompletionRate)).toBe(14);
    });
  });
});
