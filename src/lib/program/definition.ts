/**
 * Sleep Diary v2.5 — Program Definition Adapter
 *
 * Builds a canonical ProgramDefinition from the existing lesson metadata
 * in src/lib/program-lessons.ts.
 *
 * This is the bridge between the current lesson system and the new
 * Program domain model. It does NOT duplicate lesson content — it
 * references the existing lessonMetas array.
 *
 * Usage:
 *   import { getProgramDefinition } from "@/lib/program/definition";
 *   const definition = getProgramDefinition();
 */

import type {
  ProgramDefinition,
  ProgramWeekDefinition,
  ProgramLessonDefinition,
  ProgramLessonTag,
} from "./types";
import { lessonMetas, WEEK_SLUGS, getLessonsByWeek } from "../program-lessons";

// =============================================================================
// Difficulty mapping
// =============================================================================

import type { DifficultyKey } from "../program-lessons";

const DIFFICULTY_MAP: Record<DifficultyKey, ProgramLessonDefinition["difficulty"]> = {
  beginner: "beginner",
  intermediate: "intermediate",
  advanced: "advanced",
};

// =============================================================================
// Tag inference (from week theme + lesson position)
// =============================================================================
// The existing lesson metadata doesn't have explicit tags. We infer tags
// based on the week's theme. This is a best-effort mapping for Phase G-0;
// Phase G can refine tags as needed.

const WEEK_TAGS: Record<string, ProgramLessonTag[]> = {
  "week-1": ["education", "habit"],
  "week-2": ["stimulus-control", "habit"],
  "week-3": ["sleep-restriction", "education"],
  "week-4": ["relaxation", "cognitive"],
  "week-5": ["cognitive", "education"],
  "week-6": ["maintenance", "habit"],
};

// =============================================================================
// Week definitions
// =============================================================================

function buildWeekDefinitions(): ProgramWeekDefinition[] {
  return WEEK_SLUGS.map((slug, index) => {
    const order = index + 1;
    const weekLessons = getLessonsByWeek(slug);
    const lessonIds = weekLessons.map((l) => l.slug);
    const prerequisiteWeekIds = order > 1 ? [`week-${order - 1}`] : undefined;

    return {
      id: slug,
      order,
      titleKey: `program.week.${slug}.title`,
      summaryKey: `program.week.${slug}.summary`,
      lessonIds,
      prerequisiteWeekIds,
    } satisfies ProgramWeekDefinition;
  });
}

// =============================================================================
// Lesson definitions
// =============================================================================

function buildLessonDefinitions(): ProgramLessonDefinition[] {
  return lessonMetas.map((meta) => {
    const tags: ProgramLessonTag[] = WEEK_TAGS[meta.weekSlug] ?? ["education"];

    return {
      id: meta.slug,
      weekId: meta.weekSlug,
      order: meta.lessonNumber,
      titleKey: `program.lesson.${meta.slug}.title`,
      summaryKey: `program.lesson.${meta.slug}.summary`,
      contentRef: `program-lessons/${meta.weekSlug}/${meta.slug}`,
      estimatedMinutes: meta.estimatedMinutes,
      difficulty: DIFFICULTY_MAP[meta.difficultyKey],
      tags,
      relatedLessonIds: meta.relatedLessonSlugs,
    } satisfies ProgramLessonDefinition;
  });
}

// =============================================================================
// Program definition (singleton)
// =============================================================================

let cachedDefinition: ProgramDefinition | null = null;

/**
 * Get the canonical CBT-I program definition.
 *
 * Built once and cached. The definition is derived from the existing
 * lesson metadata system, so there's a single source of truth.
 */
export function getProgramDefinition(): ProgramDefinition {
  if (cachedDefinition) return cachedDefinition;

  cachedDefinition = {
    id: "cbti-core",
    version: 1,
    titleKey: "program.title",
    descriptionKey: "program.sub",
    weeks: buildWeekDefinitions(),
    lessons: buildLessonDefinitions(),
  };

  return cachedDefinition;
}

/**
 * Clear the cached definition (for testing).
 */
export function _clearProgramDefinitionCache(): void {
  cachedDefinition = null;
}

// =============================================================================
// Validation
// =============================================================================

/**
 * Validate that the program definition is internally consistent.
 * Returns an array of issues (empty = valid).
 *
 * Checks:
 *  - All lesson IDs referenced by weeks actually exist
 *  - All relatedLessonIds actually exist
 *  - Week order is contiguous 1..N
 *  - No duplicate lesson IDs
 *  - No duplicate week IDs
 */
export function validateProgramDefinition(def: ProgramDefinition): string[] {
  const issues: string[] = [];

  // Duplicate lesson IDs
  const lessonIds = new Set<string>();
  for (const lesson of def.lessons) {
    if (lessonIds.has(lesson.id)) {
      issues.push(`Duplicate lesson ID: ${lesson.id}`);
    }
    lessonIds.add(lesson.id);
  }

  // Duplicate week IDs
  const weekIds = new Set<string>();
  for (const week of def.weeks) {
    if (weekIds.has(week.id)) {
      issues.push(`Duplicate week ID: ${week.id}`);
    }
    weekIds.add(week.id);
  }

  // Week order contiguous
  const orders = def.weeks.map((w) => w.order).sort((a, b) => a - b);
  for (let i = 0; i < orders.length; i++) {
    if (orders[i] !== i + 1) {
      issues.push(`Non-contiguous week order: expected ${i + 1}, got ${orders[i]}`);
      break;
    }
  }

  // Lessons referenced by weeks exist
  for (const week of def.weeks) {
    for (const lessonId of week.lessonIds) {
      if (!lessonIds.has(lessonId)) {
        issues.push(`Week ${week.id} references missing lesson: ${lessonId}`);
      }
    }
  }

  // Related lesson IDs exist
  for (const lesson of def.lessons) {
    for (const relatedId of lesson.relatedLessonIds) {
      if (!lessonIds.has(relatedId)) {
        issues.push(`Lesson ${lesson.id} has missing related lesson: ${relatedId}`);
      }
    }
  }

  // Prerequisite weeks exist
  for (const week of def.weeks) {
    if (week.prerequisiteWeekIds) {
      for (const prereqId of week.prerequisiteWeekIds) {
        if (!weekIds.has(prereqId)) {
          issues.push(`Week ${week.id} has missing prerequisite: ${prereqId}`);
        }
      }
    }
  }

  return issues;
}
