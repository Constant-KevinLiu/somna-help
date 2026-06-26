// CBT-I Program progress tracking — localStorage-backed.
// Stores completed lesson slugs under "cbtiProgramProgress".

import { useEffect, useState, useCallback } from "react";
import { lessonMetas, TOTAL_LESSONS, getLessonsByWeek, type LessonMeta } from "./program-lessons";

export const PROGRAM_PROGRESS_KEY = "cbtiProgramProgress";

export type ProgramProgress = {
  completedLessons: string[]; // lesson slugs
};

const EMPTY: ProgramProgress = { completedLessons: [] };

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadProgress(): ProgramProgress {
  if (!isBrowser()) return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(PROGRAM_PROGRESS_KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<ProgramProgress>;
    const completed = Array.isArray(parsed.completedLessons) ? parsed.completedLessons.filter((s): s is string => typeof s === "string") : [];
    return { completedLessons: Array.from(new Set(completed)) };
  } catch {
    return { ...EMPTY };
  }
}

export function saveProgress(progress: ProgramProgress): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(PROGRAM_PROGRESS_KEY, JSON.stringify(progress));
    // Notify other components in the same tab.
    window.dispatchEvent(new CustomEvent("cbti-program-progress", { detail: progress }));
  } catch {
    /* ignore quota / private mode errors */
  }
}

export function isLessonCompleted(progress: ProgramProgress, slug: string): boolean {
  return progress.completedLessons.includes(slug);
}

export function markLessonComplete(slug: string): ProgramProgress {
  const current = loadProgress();
  if (current.completedLessons.includes(slug)) return current;
  const next: ProgramProgress = { completedLessons: [...current.completedLessons, slug] };
  saveProgress(next);
  return next;
}

export function unmarkLessonComplete(slug: string): ProgramProgress {
  const current = loadProgress();
  const next: ProgramProgress = { completedLessons: current.completedLessons.filter((s) => s !== slug) };
  saveProgress(next);
  return next;
}

export function toggleLessonComplete(slug: string): ProgramProgress {
  const current = loadProgress();
  return isLessonCompleted(current, slug) ? unmarkLessonComplete(slug) : markLessonComplete(slug);
}

/** Overall completion percentage across all 18 lessons (0-100, integer). */
export function overallCompletionPercent(progress: ProgramProgress): number {
  if (TOTAL_LESSONS === 0) return 0;
  return Math.round((progress.completedLessons.length / TOTAL_LESSONS) * 100);
}

/** Completion percentage for a single week (0-100, integer). */
export function weekCompletionPercent(progress: ProgramProgress, weekSlug: string): number {
  const shortSlug = resolveWeekSlug(weekSlug);
  if (!shortSlug) return 0;
  const weekLessons = getLessonsByWeek(shortSlug);
  if (weekLessons.length === 0) return 0;
  const done = weekLessons.filter((l) => progress.completedLessons.includes(l.slug)).length;
  return Math.round((done / weekLessons.length) * 100);
}

/** Count of completed lessons within a week. */
export function weekCompletedCount(progress: ProgramProgress, weekSlug: string): number {
  const shortSlug = resolveWeekSlug(weekSlug);
  if (!shortSlug) return 0;
  return getLessonsByWeek(shortSlug).filter((l) => progress.completedLessons.includes(l.slug)).length;
}

export type WeekStatus = "locked" | "available" | "completed";

/**
 * Resolve a week slug to its canonical short form ("week-1" .. "week-6").
 * Accepts both the short slug ("week-1") used by lessons and the long slug
 * ("week-1-sleep-foundations") used by programWeeks. Returns null if the slug
 * does not start with a recognized "week-N" prefix.
 */
export function resolveWeekSlug(weekSlug: string): string | null {
  const match = /^week-(\d+)(?:-|$)/.exec(weekSlug);
  if (!match) return null;
  const n = Number(match[1]);
  if (!Number.isInteger(n) || n < 1 || n > 6) return null;
  return `week-${n}`;
}

/**
 * Week status:
 *  - completed: all lessons in the week are done
 *  - available: week 1 is always available; otherwise available if the previous
 *    week is completed OR the user has already started this week
 *  - locked: otherwise
 *
 * Accepts either the short slug ("week-1") or the long slug
 * ("week-1-sleep-foundations") so the Program page and Dashboard stay in sync.
 */
export function weekStatus(progress: ProgramProgress, weekSlug: string): WeekStatus {
  const shortSlug = resolveWeekSlug(weekSlug);
  if (!shortSlug) return "locked";
  const weekLessons = getLessonsByWeek(shortSlug);
  if (weekLessons.length === 0) return "locked";
  const done = weekLessons.filter((l) => progress.completedLessons.includes(l.slug)).length;
  if (done === weekLessons.length) return "completed";
  if (shortSlug === "week-1") return "available";
  const weekNum = weekLessons[0].weekNumber;
  const prevShortSlug = `week-${weekNum - 1}`;
  const prevLessons = getLessonsByWeek(prevShortSlug);
  const prevDone = prevLessons.filter((l) => progress.completedLessons.includes(l.slug)).length;
  if (prevDone === prevLessons.length) return "available";
  // Also allow access if user has started this week already.
  if (done > 0) return "available";
  return "locked";
}

/** The recommended next lesson: first not-completed lesson in order. */
export function recommendedNextLesson(progress: ProgramProgress): LessonMeta | null {
  return lessonMetas.find((l) => !progress.completedLessons.includes(l.slug)) ?? null;
}

/** The "current" week = the week containing the recommended next lesson. */
export function currentWeekSlug(progress: ProgramProgress): string {
  const next = recommendedNextLesson(progress);
  return next ? next.weekSlug : "week-6";
}

/** React hook that subscribes to program progress and re-renders on change. */
export function useProgramProgress(): {
  progress: ProgramProgress;
  hydrated: boolean;
  complete: (slug: string) => void;
  uncomplete: (slug: string) => void;
  toggle: (slug: string) => void;
} {
  const [progress, setProgress] = useState<ProgramProgress>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setHydrated(true);

    const handler = () => setProgress(loadProgress());
    window.addEventListener("storage", handler);
    window.addEventListener("cbti-program-progress", handler as EventListener);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("cbti-program-progress", handler as EventListener);
    };
  }, []);

  const complete = useCallback((slug: string) => {
    setProgress(markLessonComplete(slug));
  }, []);

  const uncomplete = useCallback((slug: string) => {
    setProgress(unmarkLessonComplete(slug));
  }, []);

  const toggle = useCallback((slug: string) => {
    setProgress(toggleLessonComplete(slug));
  }, []);

  return { progress, hydrated, complete, uncomplete, toggle };
}

/** Milestone badges — subtle, professional. */
export type BadgeKey = "sleep-basics" | "sleep-consistency" | "cbti-graduate";

export type BadgeInfo = {
  key: BadgeKey;
  /** Triggered when this week is fully completed. */
  weekSlug: string;
};

export const BADGES: BadgeInfo[] = [
  { key: "sleep-basics", weekSlug: "week-1" },
  { key: "sleep-consistency", weekSlug: "week-3" },
  { key: "cbti-graduate", weekSlug: "week-6" },
];

export function earnedBadges(progress: ProgramProgress): BadgeKey[] {
  return BADGES.filter((b) => weekStatus(progress, b.weekSlug) === "completed").map((b) => b.key);
}
