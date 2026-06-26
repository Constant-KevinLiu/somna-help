// CBT-I Program — 18 lessons across 6 weeks.
// This file holds types, lightweight metadata, and helpers.
// Full lesson content (i18n) lives in per-week modules under program-lessons-content/
// so each week can be lazy-loaded by the route loader.

import type { Lang } from "./i18n";

/** A content section inside the lesson body. */
export type LessonSection = { heading: string; paras: string[] };

/** A FAQ entry. */
export type LessonFAQ = { q: string; a: string };

/** Locale-specific lesson content. */
export type LessonLocale = {
  title: string;
  eyebrow: string;
  subtitle: string;
  difficulty: string;
  readingTime: string; // e.g. "6 min read"
  content: LessonSection[];
  actionStepTitle: string;
  actionStep: string;
  reflectionTitle: string;
  reflection: string;
  faqs: LessonFAQ[];
  ctaLabel: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
};

/** A full lesson with metadata + i18n content. */
export type LessonContent = {
  slug: string;
  weekNumber: number; // 1-6
  weekSlug: string; // "week-1"
  lessonNumber: number; // 1-18 (global)
  estimatedMinutes: number;
  relatedLessonSlugs: string[]; // 3 related lesson slugs (internal)
  i18n: Record<Lang, LessonLocale>;
};

/** Lightweight metadata used for cards, navigation, and SEO without loading full content. */
export type LessonMeta = {
  slug: string;
  weekNumber: number;
  weekSlug: string;
  lessonNumber: number;
  estimatedMinutes: number;
  difficultyKey: DifficultyKey;
  relatedLessonSlugs: string[];
};

export type DifficultyKey = "beginner" | "intermediate" | "advanced";

export const WEEK_SLUGS = ["week-1", "week-2", "week-3", "week-4", "week-5", "week-6"] as const;
export type WeekSlug = (typeof WEEK_SLUGS)[number];

/** All 18 lesson metadata entries (no heavy content — safe to import everywhere). */
export const lessonMetas: LessonMeta[] = [
  // Week 1 — Sleep Foundations
  { slug: "what-is-insomnia", weekNumber: 1, weekSlug: "week-1", lessonNumber: 1, estimatedMinutes: 6, difficultyKey: "beginner", relatedLessonSlugs: ["how-sleep-works", "trying-harder-makes-sleep-worse", "what-is-sleep-efficiency"] },
  { slug: "how-sleep-works", weekNumber: 1, weekSlug: "week-1", lessonNumber: 2, estimatedMinutes: 6, difficultyKey: "beginner", relatedLessonSlugs: ["what-is-insomnia", "trying-harder-makes-sleep-worse", "racing-thoughts-at-night"] },
  { slug: "trying-harder-makes-sleep-worse", weekNumber: 1, weekSlug: "week-1", lessonNumber: 3, estimatedMinutes: 5, difficultyKey: "beginner", relatedLessonSlugs: ["what-is-insomnia", "how-sleep-works", "bed-sleep-association"] },
  // Week 2 — Stimulus Control
  { slug: "bed-sleep-association", weekNumber: 2, weekSlug: "week-2", lessonNumber: 4, estimatedMinutes: 6, difficultyKey: "beginner", relatedLessonSlugs: ["stimulus-control-science", "leaving-bed-without-frustration", "trying-harder-makes-sleep-worse"] },
  { slug: "stimulus-control-science", weekNumber: 2, weekSlug: "week-2", lessonNumber: 5, estimatedMinutes: 6, difficultyKey: "intermediate", relatedLessonSlugs: ["bed-sleep-association", "leaving-bed-without-frustration", "sleep-restriction-therapy"] },
  { slug: "leaving-bed-without-frustration", weekNumber: 2, weekSlug: "week-2", lessonNumber: 6, estimatedMinutes: 6, difficultyKey: "beginner", relatedLessonSlugs: ["bed-sleep-association", "stimulus-control-science", "relaxation-techniques"] },
  // Week 3 — Sleep Restriction
  { slug: "what-is-sleep-efficiency", weekNumber: 3, weekSlug: "week-3", lessonNumber: 7, estimatedMinutes: 6, difficultyKey: "intermediate", relatedLessonSlugs: ["sleep-restriction-therapy", "sleep-restriction-mistakes", "how-sleep-works"] },
  { slug: "sleep-restriction-therapy", weekNumber: 3, weekSlug: "week-3", lessonNumber: 8, estimatedMinutes: 7, difficultyKey: "intermediate", relatedLessonSlugs: ["what-is-sleep-efficiency", "sleep-restriction-mistakes", "stimulus-control-science"] },
  { slug: "sleep-restriction-mistakes", weekNumber: 3, weekSlug: "week-3", lessonNumber: 9, estimatedMinutes: 6, difficultyKey: "intermediate", relatedLessonSlugs: ["sleep-restriction-therapy", "what-is-sleep-efficiency", "leaving-bed-without-frustration"] },
  // Week 4 — Calming the Mind
  { slug: "racing-thoughts-at-night", weekNumber: 4, weekSlug: "week-4", lessonNumber: 10, estimatedMinutes: 6, difficultyKey: "intermediate", relatedLessonSlugs: ["relaxation-techniques", "breathing-exercises-for-sleep", "common-insomnia-thoughts"] },
  { slug: "relaxation-techniques", weekNumber: 4, weekSlug: "week-4", lessonNumber: 11, estimatedMinutes: 7, difficultyKey: "intermediate", relatedLessonSlugs: ["racing-thoughts-at-night", "breathing-exercises-for-sleep", "leaving-bed-without-frustration"] },
  { slug: "breathing-exercises-for-sleep", weekNumber: 4, weekSlug: "week-4", lessonNumber: 12, estimatedMinutes: 6, difficultyKey: "beginner", relatedLessonSlugs: ["relaxation-techniques", "racing-thoughts-at-night", "how-sleep-works"] },
  // Week 5 — Cognitive Reframing
  { slug: "common-insomnia-thoughts", weekNumber: 5, weekSlug: "week-5", lessonNumber: 13, estimatedMinutes: 7, difficultyKey: "intermediate", relatedLessonSlugs: ["cbti-changes-sleep-beliefs", "realistic-sleep-expectations", "racing-thoughts-at-night"] },
  { slug: "cbti-changes-sleep-beliefs", weekNumber: 5, weekSlug: "week-5", lessonNumber: 14, estimatedMinutes: 7, difficultyKey: "advanced", relatedLessonSlugs: ["common-insomnia-thoughts", "realistic-sleep-expectations", "sleep-restriction-therapy"] },
  { slug: "realistic-sleep-expectations", weekNumber: 5, weekSlug: "week-5", lessonNumber: 15, estimatedMinutes: 6, difficultyKey: "intermediate", relatedLessonSlugs: ["common-insomnia-thoughts", "cbti-changes-sleep-beliefs", "trying-harder-makes-sleep-worse"] },
  // Week 6 — Maintain & Flourish
  { slug: "preventing-relapse", weekNumber: 6, weekSlug: "week-6", lessonNumber: 16, estimatedMinutes: 6, difficultyKey: "intermediate", relatedLessonSlugs: ["travel-jet-lag-sleep", "long-term-sleep-health", "sleep-restriction-mistakes"] },
  { slug: "travel-jet-lag-sleep", weekNumber: 6, weekSlug: "week-6", lessonNumber: 17, estimatedMinutes: 6, difficultyKey: "intermediate", relatedLessonSlugs: ["preventing-relapse", "long-term-sleep-health", "how-sleep-works"] },
  { slug: "long-term-sleep-health", weekNumber: 6, weekSlug: "week-6", lessonNumber: 18, estimatedMinutes: 6, difficultyKey: "beginner", relatedLessonSlugs: ["preventing-relapse", "travel-jet-lag-sleep", "realistic-sleep-expectations"] },
];

export const TOTAL_LESSONS = lessonMetas.length; // 18

export function lessonPath(weekSlug: string, lessonSlug: string): string {
  return `/program/${weekSlug}/${lessonSlug}`;
}

export function getLessonMeta(slug: string): LessonMeta | undefined {
  return lessonMetas.find((l) => l.slug === slug);
}

export function getLessonsByWeek(weekSlug: string): LessonMeta[] {
  return lessonMetas.filter((l) => l.weekSlug === weekSlug);
}

export function getLessonMetaByWeekAndSlug(weekSlug: string, lessonSlug: string): LessonMeta | undefined {
  return lessonMetas.find((l) => l.weekSlug === weekSlug && l.slug === lessonSlug);
}

export function getAdjacentLessons(slug: string): { prev: LessonMeta | null; next: LessonMeta | null } {
  const idx = lessonMetas.findIndex((l) => l.slug === slug);
  return {
    prev: idx > 0 ? lessonMetas[idx - 1] : null,
    next: idx >= 0 && idx < lessonMetas.length - 1 ? lessonMetas[idx + 1] : null,
  };
}

export function isValidWeekSlug(slug: string): slug is WeekSlug {
  return (WEEK_SLUGS as readonly string[]).includes(slug);
}

/** Dynamic import of a week's full lesson content (lazy-loaded per week). */
export async function loadWeekLessons(weekSlug: string): Promise<LessonContent[]> {
  switch (weekSlug) {
    case "week-1":
      return (await import("./program-lessons-content/week-1")).week1Lessons;
    case "week-2":
      return (await import("./program-lessons-content/week-2")).week2Lessons;
    case "week-3":
      return (await import("./program-lessons-content/week-3")).week3Lessons;
    case "week-4":
      return (await import("./program-lessons-content/week-4")).week4Lessons;
    case "week-5":
      return (await import("./program-lessons-content/week-5")).week5Lessons;
    case "week-6":
      return (await import("./program-lessons-content/week-6")).week6Lessons;
    default:
      return [];
  }
}

/** Load a single lesson's full content by week + lesson slug. */
export async function loadLesson(weekSlug: string, lessonSlug: string): Promise<LessonContent | null> {
  const lessons = await loadWeekLessons(weekSlug);
  return lessons.find((l) => l.slug === lessonSlug) ?? null;
}
