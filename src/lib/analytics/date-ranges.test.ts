/**
 * Phase F — Date Ranges Unit Tests
 *
 * Tests pure date utility functions.
 */

import { describe, it, expect } from "vitest";
import {
  parseISODate,
  formatISODate,
  addDays,
  daysBetween,
  todayISO,
  isoDaysAgo,
  weekStart,
  weekEnd,
  monthStart,
  monthEnd,
  getDateRange,
  enumerateDates,
  recordsInRange,
  isWeekday,
  isWeekend,
  rangeHasDSTTransition,
} from "./date-ranges";
import type { WindowKey } from "./types";

describe("date-ranges", () => {
  describe("parseISODate / formatISODate", () => {
    it("parses YYYY-MM-DD to Date at local midnight", () => {
      const d = parseISODate("2024-01-15");
      expect(d.getFullYear()).toBe(2024);
      expect(d.getMonth()).toBe(0);
      expect(d.getDate()).toBe(15);
    });

    it("round-trips correctly", () => {
      const input = "2024-06-01";
      const output = formatISODate(parseISODate(input));
      expect(output).toBe(input);
    });
  });

  describe("addDays", () => {
    it("adds positive days", () => {
      expect(addDays("2024-01-01", 5)).toBe("2024-01-06");
    });

    it("adds negative days", () => {
      expect(addDays("2024-01-10", -5)).toBe("2024-01-05");
    });

    it("crosses month boundaries", () => {
      expect(addDays("2024-01-31", 1)).toBe("2024-02-01");
    });

    it("handles leap year", () => {
      expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
      expect(addDays("2023-02-28", 1)).toBe("2023-03-01");
    });
  });

  describe("daysBetween", () => {
    it("returns 0 for same day", () => {
      expect(daysBetween("2024-01-01", "2024-01-01")).toBe(0);
    });

    it("returns positive for forward range", () => {
      expect(daysBetween("2024-01-01", "2024-01-05")).toBe(4);
    });
  });

  describe("weekStart / weekEnd (Monday-based)", () => {
    it("returns Monday for a Wednesday date", () => {
      expect(weekStart("2024-01-17")).toBe("2024-01-15");
    });

    it("returns Monday for a Monday date", () => {
      expect(weekStart("2024-01-15")).toBe("2024-01-15");
    });

    it("returns Sunday for weekEnd", () => {
      expect(weekEnd("2024-01-17")).toBe("2024-01-21");
    });

    it("handles week crossing month boundary", () => {
      expect(weekStart("2024-02-01")).toBe("2024-01-29");
      expect(weekEnd("2024-02-01")).toBe("2024-02-04");
    });
  });

  describe("monthStart / monthEnd", () => {
    it("returns first and last day of month", () => {
      expect(monthStart("2024-01-15")).toBe("2024-01-01");
      expect(monthEnd("2024-01-15")).toBe("2024-01-31");
    });

    it("handles February leap year", () => {
      expect(monthEnd("2024-02-15")).toBe("2024-02-29");
    });

    it("handles February non-leap year", () => {
      expect(monthEnd("2023-02-15")).toBe("2023-02-28");
    });
  });

  describe("getDateRange", () => {
    const now = new Date("2024-01-17T12:00:00Z");

    it("7d returns last 7 days (inclusive)", () => {
      const range = getDateRange("7d", now);
      expect(range.start).toBe("2024-01-11");
      expect(range.end).toBe("2024-01-17");
    });

    it("14d returns last 14 days", () => {
      const range = getDateRange("14d", now);
      expect(range.start).toBe("2024-01-04");
      expect(range.end).toBe("2024-01-17");
    });

    it("30d returns last 30 days", () => {
      const range = getDateRange("30d", now);
      expect(range.start).toBe("2023-12-19");
      expect(range.end).toBe("2024-01-17");
    });

    it("thisWeek returns Mon-Sun of current week", () => {
      const range = getDateRange("thisWeek", now);
      expect(range.start).toBe("2024-01-15");
      expect(range.end).toBe("2024-01-21");
    });

    it("lastWeek returns previous Mon-Sun", () => {
      const range = getDateRange("lastWeek", now);
      expect(range.start).toBe("2024-01-08");
      expect(range.end).toBe("2024-01-14");
    });

    it("thisMonth returns full current month", () => {
      const range = getDateRange("thisMonth", now);
      expect(range.start).toBe("2024-01-01");
      expect(range.end).toBe("2024-01-31");
    });

    it("lastMonth returns previous full month", () => {
      const range = getDateRange("lastMonth", now);
      expect(range.start).toBe("2023-12-01");
      expect(range.end).toBe("2023-12-31");
    });
  });

  describe("enumerateDates", () => {
    it("returns all dates in range inclusive", () => {
      const dates = enumerateDates("2024-01-01", "2024-01-05");
      expect(dates).toEqual(["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05"]);
    });

    it("returns single day for same start/end", () => {
      const dates = enumerateDates("2024-01-01", "2024-01-01");
      expect(dates).toEqual(["2024-01-01"]);
    });
  });

  describe("isWeekday / isWeekend", () => {
    it("identifies weekdays correctly", () => {
      expect(isWeekday("2024-01-15")).toBe(true);
      expect(isWeekday("2024-01-19")).toBe(true);
      expect(isWeekday("2024-01-20")).toBe(false);
      expect(isWeekday("2024-01-21")).toBe(false);
    });

    it("isWeekend is inverse of isWeekday for Mon-Fri week", () => {
      const d = "2024-01-17";
      expect(isWeekend(d)).toBe(!isWeekday(d));
    });
  });
});
