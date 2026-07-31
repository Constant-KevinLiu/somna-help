/**
 * Sleep Diary v2.3 — Reflection Statistics
 *
 * Streak calculation and monthly counts.
 * Uses local calendar dates for consistency.
 */

import type { LocalReflection, ReflectionStats } from "./reflection-types";
import { loadReflections, todayLocalISO } from "./reflection-storage";

/**
 * Parse YYYY-MM-DD date string to Date object.
 */
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format Date to YYYY-MM-DD string.
 */
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get the date of the previous day.
 */
function previousDay(dateStr: string): string {
  const date = parseLocalDate(dateStr);
  date.setDate(date.getDate() - 1);
  return formatLocalDate(date);
}

/**
 * Calculate reflection streak.
 * Counts consecutive days with reflections up to today.
 */
export function calculateReflectionStreak(
  reflections: LocalReflection[],
  todayStr: string = todayLocalISO()
): number {
  const datesWithReflections = new Set(
    reflections.map((r) => r.localDate)
  );

  let streak = 0;
  let currentDate = todayStr;

  // Check today
  if (datesWithReflections.has(currentDate)) {
    streak++;
  } else {
    // If no reflection today, check yesterday to see if streak was broken yesterday
    currentDate = previousDay(currentDate);
    if (!datesWithReflections.has(currentDate)) {
      return 0;
    }
    streak++;
  }

  // Check previous days going backward
  while (true) {
    currentDate = previousDay(currentDate);
    if (datesWithReflections.has(currentDate)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate longest reflection streak.
 */
export function calculateLongestStreak(
  reflections: LocalReflection[]
): number {
  if (reflections.length === 0) return 0;

  const sortedDates = [...new Set(reflections.map((r) => r.localDate))].sort();
  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = parseLocalDate(sortedDates[i - 1]);
    const currDate = parseLocalDate(sortedDates[i]);
    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}

/**
 * Count reflections in the current calendar month.
 */
export function countThisMonth(
  reflections: LocalReflection[],
  todayStr: string = todayLocalISO()
): number {
  const [currentYear, currentMonth] = todayStr.split("-").map(Number);
  return reflections.filter((r) => {
    const [year, month] = r.localDate.split("-").map(Number);
    return year === currentYear && month === currentMonth;
  }).length;
}

/**
 * Get all reflection stats.
 */
export function getReflectionStats(): ReflectionStats {
  const reflections = loadReflections();
  const today = todayLocalISO();

  return {
    currentStreak: calculateReflectionStreak(reflections, today),
    longestStreak: calculateLongestStreak(reflections),
    thisMonth: countThisMonth(reflections, today),
    totalReflections: reflections.length,
  };
}
