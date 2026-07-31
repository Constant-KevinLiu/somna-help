/**
 * Phase F — Date Range Utilities
 *
 * Deterministic time windows for analytics.
 * All dates are YYYY-MM-DD in local timezone.
 * Pure functions — no side effects, safe for SSR.
 */

// ============================================
// Helpers: Pure date math (no Date mutation on input)
// ============================================

/** Convert YYYY-MM-DD to a Date object (local midnight). */
export function parseISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Format Date to YYYY-MM-DD using local time. */
export function formatISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Add N days to a date string. Returns new YYYY-MM-DD. */
export function addDays(dateStr: string, days: number): string {
  const d = parseISODate(dateStr);
  d.setDate(d.getDate() + days);
  return formatISODate(d);
}

/** Number of days between two YYYY-MM-DD dates (end - start). */
export function daysBetween(start: string, end: string): number {
  const s = parseISODate(start).getTime();
  const e = parseISODate(end).getTime();
  return Math.round((e - s) / (1000 * 60 * 60 * 24));
}

/** Today's date as YYYY-MM-DD (local). Accepts now injection for testing. */
export function todayISO(now: Date = new Date()): string {
  return formatISODate(now);
}

/** N days ago as YYYY-MM-DD. */
export function isoDaysAgo(n: number, now: Date = new Date()): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return formatISODate(d);
}

/**
 * Monday of the week containing the given date.
 * Monday = day 1 of the week.
 */
export function weekStart(dateStr: string): string {
  const d = parseISODate(dateStr);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = day === 0 ? -6 : 1 - day; // days since Monday
  d.setDate(d.getDate() + diff);
  return formatISODate(d);
}

/** Sunday of the week containing the given date. */
export function weekEnd(dateStr: string): string {
  const mon = weekStart(dateStr);
  return addDays(mon, 6);
}

/** First day of the month. */
export function monthStart(dateStr: string): string {
  const d = parseISODate(dateStr);
  d.setDate(1);
  return formatISODate(d);
}

/** Last day of the month. */
export function monthEnd(dateStr: string): string {
  const d = parseISODate(dateStr);
  d.setMonth(d.getMonth() + 1, 0);
  return formatISODate(d);
}

// ============================================
// Window → Date Range
// ============================================

import type { WindowKey, DateRange } from "./types";

export function getDateRange(window: WindowKey, now: Date = new Date()): DateRange {
  const today = formatISODate(now);

  switch (window) {
    case "7d":
      return {
        start: isoDaysAgo(6, now),
        end: today,
        labelKey: "analytics.window.7d",
      };
    case "14d":
      return {
        start: isoDaysAgo(13, now),
        end: today,
        labelKey: "analytics.window.14d",
      };
    case "30d":
      return {
        start: isoDaysAgo(29, now),
        end: today,
        labelKey: "analytics.window.30d",
      };
    case "90d":
      return {
        start: isoDaysAgo(89, now),
        end: today,
        labelKey: "analytics.window.90d",
      };
    case "thisWeek": {
      const start = weekStart(today);
      return {
        start,
        end: addDays(start, 6),
        labelKey: "analytics.window.thisWeek",
      };
    }
    case "lastWeek": {
      const thisWeekMon = weekStart(today);
      const lastWeekMon = addDays(thisWeekMon, -7);
      return {
        start: lastWeekMon,
        end: addDays(lastWeekMon, 6),
        labelKey: "analytics.window.lastWeek",
      };
    }
    case "thisMonth": {
      return {
        start: monthStart(today),
        end: monthEnd(today),
        labelKey: "analytics.window.thisMonth",
      };
    }
    case "lastMonth": {
      const d = parseISODate(today);
      d.setDate(0); // last day of previous month
      const lastMonthEnd = formatISODate(d);
      return {
        start: monthStart(lastMonthEnd),
        end: lastMonthEnd,
        labelKey: "analytics.window.lastMonth",
      };
    }
  }
}

/**
 * Generate every date in a range (inclusive).
 * Safe for DST transitions — uses date arithmetic, not hour math.
 */
export function enumerateDates(start: string, end: string): string[] {
  const dates: string[] = [];
  const totalDays = daysBetween(start, end);
  if (totalDays < 0) return dates;
  for (let i = 0; i <= totalDays; i++) {
    dates.push(addDays(start, i));
  }
  return dates;
}

/**
 * Filter records to those within [start, end] inclusive.
 */
export function recordsInRange(
  records: { date: string }[],
  start: string,
  end: string,
): { date: string }[] {
  return records.filter((r) => r.date >= start && r.date <= end);
}

/**
 * Get day of week from YYYY-MM-DD (0 = Sunday, 1 = Monday, ..., 6 = Saturday).
 */
export function getDayOfWeek(dateStr: string): number {
  return parseISODate(dateStr).getDay();
}

/** Is the given date a weekday (Mon-Fri)? */
export function isWeekday(dateStr: string): boolean {
  const dow = getDayOfWeek(dateStr);
  return dow >= 1 && dow <= 5;
}

/** Is the given date a weekend day (Sat-Sun)? */
export function isWeekend(dateStr: string): boolean {
  return !isWeekday(dateStr);
}

/**
 * Check if a date range crosses a DST transition boundary for the user's local timezone.
 * This is informational — our date arithmetic (setDate) is DST-safe because it
 * operates on calendar dates, not timestamps.
 *
 * Returns true if the local UTC offset differs between start and end.
 */
export function rangeHasDSTTransition(start: string, end: string): boolean {
  const s = parseISODate(start);
  const e = parseISODate(end);
  return s.getTimezoneOffset() !== e.getTimezoneOffset();
}
