/**
 * Sleep Diary v2.5 — Program Domain Types
 *
 * Canonical type definitions for the CBT-I Program domain.
 * These types are framework-agnostic and dependency-free.
 *
 * Domain boundaries:
 *   OWNED HERE:
 *   - Program definitions (weeks, lessons, metadata)
 *   - Program progress state
 *   - Program state machine
 *   - Program events (transitions)
 *   - Weekly program plans
 *   - Program milestones / badges
 *
 *   NOT OWNED HERE:
 *   - Canonical sleep observations (sleep-records)
 *   - Reminder events (reminder service)
 *   - Analytics calculations (analytics/)
 *   - Reflection content (reflection/)
 *   - Auth identity (auth/)
 *   - Sync transport details (sync/)
 */

import type { SupportedLocale } from "../locale-registry";

// =============================================================================
// Program Definition — What the program IS
// =============================================================================

/** Unique program identifier. */
export type ProgramId = "cbti-core";

/** Difficulty level for a lesson. */
export type ProgramDifficulty = "beginner" | "intermediate" | "advanced";

/** Tags for categorizing lessons and enabling recommendations. */
export type ProgramLessonTag =
  | "education"
  | "habit"
  | "cognitive"
  | "relaxation"
  | "stimulus-control"
  | "sleep-restriction"
  | "maintenance"
  | "assessment";

/**
 * Definition of a single lesson within the program.
 * All display strings are referenced by i18n key — never hard-coded here.
 */
export interface ProgramLessonDefinition {
  /** Stable unique identifier (slug). */
  id: string;
  /** Reference to the containing week. */
  weekId: string;
  /** Order within the week (1-based). */
  order: number;
  /** i18n key for the lesson title. */
  titleKey: string;
  /** i18n key for the lesson summary/eyebrow text. */
  summaryKey: string;
  /** Content reference (used by lazy loader to find full content). */
  contentRef: string;
  /** Estimated reading time in minutes. */
  estimatedMinutes?: number;
  /** Difficulty level. */
  difficulty: ProgramDifficulty;
  /** Categorization tags. */
  tags: ProgramLessonTag[];
  /** IDs of related lessons (recommended further reading). */
  relatedLessonIds: string[];
}

/**
 * Definition of a week within the program.
 */
export interface ProgramWeekDefinition {
  /** Stable unique identifier, e.g. "week-1". */
  id: string;
  /** Week number (1-based). */
  order: number;
  /** i18n key for the week title. */
  titleKey: string;
  /** i18n key for the week summary/intro. */
  summaryKey: string;
  /** IDs of lessons in this week (ordered). */
  lessonIds: string[];
  /** IDs of weeks that must be completed before this one unlocks. */
  prerequisiteWeekIds?: string[];
}

/**
 * Top-level program definition.
 * The canonical "what is the program" document.
 */
export interface ProgramDefinition {
  /** Stable unique program ID. */
  id: ProgramId;
  /** Schema version for this definition format. */
  version: number;
  /** i18n key for the program title. */
  titleKey: string;
  /** i18n key for the program description. */
  descriptionKey: string;
  /** All weeks in the program (ordered). */
  weeks: ProgramWeekDefinition[];
  /** All lessons in the program. */
  lessons: ProgramLessonDefinition[];
}

// =============================================================================
// Program Progress — What the user HAS DONE
// =============================================================================

/**
 * Program lifecycle state.
 *
 *   not_started — user has not begun the program
 *   active      — user has started and is working through it
 *   paused      — user has explicitly paused
 *   completed   — all required lessons completed
 */
export type ProgramStatus = "not_started" | "active" | "paused" | "completed";

/** Milestone identifier with i18n display key. */
export interface ProgramMilestone {
  id: string;
  /** i18n key for milestone name. */
  titleKey: string;
  /** i18n key for milestone description. */
  descriptionKey: string;
  /** When the milestone was achieved (ISO timestamp). Null if not yet earned. */
  earnedAt: string | null;
  /** Week that triggers this milestone (e.g. "week-1", "week-3", "week-6"). */
  weekId?: string;
}

/**
 * Canonical Program progress record.
 *
 * This is the single source of truth for a user's position in the program.
 * It is versioned, migration-safe, and does not contain derived analytics.
 *
 * Storage keys:
 *   Local: "somna:program-progress:v1" (localStorage, SSR-safe wrapper)
 *   Sync:  program_progress entity
 */
export interface ProgramProgress {
  /** Schema version for migration support. */
  schemaVersion: 1;
  /** Which program this progress belongs to. */
  programId: ProgramId;
  /** Version of the program definition this progress was built against. */
  programVersion: number;
  /** User ID (when authenticated; null for anonymous local progress). */
  userId?: string;
  /** Current program lifecycle state. */
  status: ProgramStatus;
  /** When the user first started the program (ISO timestamp, null if not started). */
  startedAt: string | null;
  /** When the program was completed (ISO timestamp, null if not completed). */
  completedAt: string | null;
  /** ID of the week the user is currently on. */
  currentWeekId: string | null;
  /** IDs of lessons the user has completed. */
  completedLessonIds: string[];
  /** IDs of lessons the user has explicitly skipped. */
  skippedLessonIds: string[];
  /** IDs of weekly plans the user has accepted. */
  acceptedPlanIds: string[];
  /** IDs of recommendations the user has explicitly dismissed. */
  dismissedRecommendationIds: string[];
  /** Milestones earned (ordered by achievement). */
  milestones: ProgramMilestone[];
  /** Last modification time (ISO timestamp). Used for sync conflict resolution. */
  updatedAt: string;
}

// =============================================================================
// Program Events — How progress CHANGES
// =============================================================================

/**
 * All valid events that can transition program progress.
 * UI components must NEVER mutate progress directly — they dispatch events.
 */
export type ProgramEvent =
  | ProgramStartedEvent
  | ProgramPausedEvent
  | ProgramResumedEvent
  | ProgramCompletedEvent
  | LessonCompletedEvent
  | LessonUncompletedEvent
  | LessonSkippedEvent
  | LessonUnskippedEvent
  | WeeklyPlanAcceptedEvent
  | WeeklyPlanDismissedEvent
  | MilestoneEarnedEvent;

export interface ProgramStartedEvent {
  type: "program_started";
  programId: ProgramId;
  timestamp: string;
}

export interface ProgramPausedEvent {
  type: "program_paused";
  programId: ProgramId;
  timestamp: string;
}

export interface ProgramResumedEvent {
  type: "program_resumed";
  programId: ProgramId;
  timestamp: string;
}

export interface ProgramCompletedEvent {
  type: "program_completed";
  programId: ProgramId;
  timestamp: string;
}

export interface LessonCompletedEvent {
  type: "lesson_completed";
  lessonId: string;
  weekId: string;
  timestamp: string;
}

export interface LessonUncompletedEvent {
  type: "lesson_uncompleted";
  lessonId: string;
  weekId: string;
  timestamp: string;
}

export interface LessonSkippedEvent {
  type: "lesson_skipped";
  lessonId: string;
  weekId: string;
  timestamp: string;
}

export interface LessonUnskippedEvent {
  type: "lesson_unskipped";
  lessonId: string;
  weekId: string;
  timestamp: string;
}

export interface WeeklyPlanAcceptedEvent {
  type: "weekly_plan_accepted";
  planId: string;
  timestamp: string;
}

export interface WeeklyPlanDismissedEvent {
  type: "weekly_plan_dismissed";
  planId: string;
  timestamp: string;
}

export interface MilestoneEarnedEvent {
  type: "milestone_earned";
  milestoneId: string;
  timestamp: string;
}

// =============================================================================
// State Transition Rules
// =============================================================================

/** Valid transitions between program status states. */
export const PROGRAM_TRANSITIONS: Record<ProgramStatus, ProgramStatus[]> = {
  not_started: ["active"],
  active: ["paused", "completed"],
  paused: ["active", "completed"],
  completed: ["active"], // user can reopen / revisit
};

/**
 * Check whether a status transition is valid.
 */
export function isValidStatusTransition(
  from: ProgramStatus,
  to: ProgramStatus
): boolean {
  return PROGRAM_TRANSITIONS[from]?.includes(to) ?? false;
}

// =============================================================================
// Mutation Result Contract
// =============================================================================

/**
 * Reasons a Program mutation may be blocked.
 *
 *  - "program-paused": the program is paused and the event is a progress mutation
 *  - "program-completed": the event is not valid for a completed program
 *  - "unsupported-version": stored schema is newer than supported
 *  - "invalid-transition": the event cannot be applied from the current state
 */
export type ProgramMutationBlockReason =
  | "program-paused"
  | "program-completed"
  | "unsupported-version"
  | "invalid-transition";

/**
 * Result of applying a Program event.
 *
 *  - "applied": the event was applied; `progress` is the new state
 *  - "blocked": the event was rejected; `progress` is the unchanged state
 *  - "unchanged": the event was valid but a no-op (e.g. idempotent re-apply);
 *                 `progress` is the same state (reference-identical when possible)
 *
 * Callers should narrow on `status` before acting. Blocked results MUST NOT
 * be persisted or enqueued for sync — only "applied" results represent a
 * real state change.
 */
export type ProgramMutationResult =
  | {
      status: "applied";
      progress: ProgramProgress;
    }
  | {
      status: "blocked";
      reason: ProgramMutationBlockReason;
      progress: ProgramProgress;
    }
  | {
      status: "unchanged";
      progress: ProgramProgress;
    };

// =============================================================================
// Derived Values (pure functions of progress + definition)
// =============================================================================

/**
 * Calculate overall program completion percentage (0-100, integer).
 * Based on completed lessons vs total lessons.
 */
export function calculateOverallCompletion(
  progress: ProgramProgress,
  definition: ProgramDefinition
): number {
  const total = definition.lessons.length;
  if (total === 0) return 0;
  return Math.round((progress.completedLessonIds.length / total) * 100);
}

/**
 * Calculate completion percentage for a specific week (0-100, integer).
 */
export function calculateWeekCompletion(
  progress: ProgramProgress,
  weekId: string,
  definition: ProgramDefinition
): number {
  const week = definition.weeks.find((w) => w.id === weekId);
  if (!week || week.lessonIds.length === 0) return 0;
  const done = week.lessonIds.filter((id) =>
    progress.completedLessonIds.includes(id)
  ).length;
  return Math.round((done / week.lessonIds.length) * 100);
}

/**
 * Week access status: locked / available / completed.
 */
export type WeekAccessStatus = "locked" | "available" | "completed";

/**
 * Determine if a week is locked, available, or completed.
 *
 * Rules:
 *  - completed: all lessons in the week are completed
 *  - available: week 1 always; or previous week completed; or user started this week
 *  - locked: otherwise
 */
export function getWeekAccessStatus(
  progress: ProgramProgress,
  weekId: string,
  definition: ProgramDefinition
): WeekAccessStatus {
  const week = definition.weeks.find((w) => w.id === weekId);
  if (!week) return "locked";

  const completedInWeek = week.lessonIds.filter((id) =>
    progress.completedLessonIds.includes(id)
  ).length;

  // Completed
  if (completedInWeek === week.lessonIds.length && week.lessonIds.length > 0) {
    return "completed";
  }

  // Week 1 is always available
  if (week.order === 1) return "available";

  // Previous week completed → available
  const prevWeek = definition.weeks.find((w) => w.order === week.order - 1);
  if (prevWeek) {
    const prevCompleted = prevWeek.lessonIds.filter((id) =>
      progress.completedLessonIds.includes(id)
    ).length;
    if (prevCompleted === prevWeek.lessonIds.length) return "available";
  }

  // User already started this week → available
  if (completedInWeek > 0) return "available";

  return "locked";
}

/**
 * Get the recommended next lesson (first incomplete lesson in order).
 * Returns null if all lessons are complete or program not started.
 */
export function getRecommendedNextLesson(
  progress: ProgramProgress,
  definition: ProgramDefinition
): ProgramLessonDefinition | null {
  return (
    definition.lessons.find(
      (l) => !progress.completedLessonIds.includes(l.id)
    ) ?? null
  );
}

// =============================================================================
// Locale Support
// =============================================================================

/** Locales for which program content is fully authored. */
export const PROGRAM_CONTENT_LOCALES: SupportedLocale[] = [
  "en",
  "es",
  "pt",
  "pl",
  "de",
];

/** Locales for which program UI strings are available. */
export const PROGRAM_UI_LOCALES: SupportedLocale[] = [
  "en",
  "zh",
  "es",
  "pt",
  "pl",
  "de",
];
