/**
 * Sleep Diary v2.5 — Program Service
 *
 * Pure functions for applying events to Program progress.
 * No React. No storage. No side effects. Just state + event → next state.
 *
 * All transitions go through this module. UI components must NOT mutate
 * ProgramProgress objects directly.
 *
 * Usage:
 *   const progress = createInitialProgress();
 *   const next = applyEvent(progress, event, definition);
 */

import {
  type ProgramProgress,
  type ProgramEvent,
  type ProgramDefinition,
  type ProgramStatus,
  type ProgramMilestone,
  type ProgramId,
  type ProgramMutationResult,
  type ProgramMutationBlockReason,
  isValidStatusTransition,
  getWeekAccessStatus,
} from "./types";

// =============================================================================
// Constants
// =============================================================================

export const DEFAULT_PROGRAM_ID: ProgramId = "cbti-core";

export const LEGACY_PROGRESS_KEY = "cbtiProgramProgress";
export const CANONICAL_PROGRESS_KEY = "somna:program-progress:v1";

// =============================================================================
// Initial / Empty State
// =============================================================================

/**
 * Create a fresh, empty progress record.
 * Call this when no progress has been saved yet.
 */
export function createInitialProgress(
  programId: ProgramId = DEFAULT_PROGRAM_ID,
  programVersion: number = 1,
): ProgramProgress {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    programId,
    programVersion,
    status: "not_started",
    startedAt: null,
    completedAt: null,
    currentWeekId: null,
    completedLessonIds: [],
    skippedLessonIds: [],
    acceptedPlanIds: [],
    dismissedRecommendationIds: [],
    milestones: createDefaultMilestones(),
    updatedAt: now,
  };
}

/**
 * Default milestone definitions.
 * These match the existing badge system for backward compatibility.
 */
function createDefaultMilestones(): ProgramMilestone[] {
  return [
    {
      id: "sleep-basics",
      titleKey: "program.milestone.sleepBasics.title",
      descriptionKey: "program.milestone.sleepBasics.desc",
      earnedAt: null,
      weekId: "week-1",
    },
    {
      id: "sleep-consistency",
      titleKey: "program.milestone.sleepConsistency.title",
      descriptionKey: "program.milestone.sleepConsistency.desc",
      earnedAt: null,
      weekId: "week-3",
    },
    {
      id: "cbti-graduate",
      titleKey: "program.milestone.cbtiGraduate.title",
      descriptionKey: "program.milestone.cbtiGraduate.desc",
      earnedAt: null,
      weekId: "week-6",
    },
  ];
}

// =============================================================================
// Event Application (State Machine)
// =============================================================================

/**
 * Apply an event to a progress record, returning a typed mutation result.
 * Pure function — no side effects.
 *
 * Result semantics:
 *  - "applied":   event was applied; progress is the new state
 *  - "blocked":   event was rejected (reason given); progress is unchanged
 *  - "unchanged": event was valid but a no-op (idempotent re-apply); progress is unchanged
 *
 * Blocked results MUST NOT be persisted or enqueued for sync. Only "applied"
 * represents a real state change.
 */
export function applyEvent(
  progress: ProgramProgress,
  event: ProgramEvent,
  definition: ProgramDefinition,
): ProgramMutationResult {
  switch (event.type) {
    case "program_started":
      return handleProgramStarted(progress, event, definition);
    case "program_paused":
      return handleProgramPaused(progress, event);
    case "program_resumed":
      return handleProgramResumed(progress, event);
    case "program_completed":
      return handleProgramCompleted(progress, event);
    case "lesson_completed":
      return handleLessonCompleted(progress, event, definition);
    case "lesson_uncompleted":
      return handleLessonUncompleted(progress, event, definition);
    case "lesson_skipped":
      return handleLessonSkipped(progress, event);
    case "lesson_unskipped":
      return handleLessonUnskipped(progress, event);
    case "weekly_plan_accepted":
      return handleWeeklyPlanAccepted(progress, event);
    case "weekly_plan_dismissed":
      return handleWeeklyPlanDismissed(progress, event);
    case "milestone_earned":
      return handleMilestoneEarned(progress, event);
    default:
      return { status: "unchanged", progress };
  }
}

// =============================================================================
// Result builders
// =============================================================================

function applied(progress: ProgramProgress): ProgramMutationResult {
  return { status: "applied", progress };
}

function blocked(
  progress: ProgramProgress,
  reason: ProgramMutationBlockReason,
): ProgramMutationResult {
  return { status: "blocked", reason, progress };
}

function unchanged(progress: ProgramProgress): ProgramMutationResult {
  return { status: "unchanged", progress };
}

/**
 * Check whether a progress-mutation event is allowed in the current status.
 * Progress mutations (lesson completion, plan acceptance, milestones, etc.)
 * are blocked when the program is paused.
 *
 * Allowed from: not_started (auto-start), active, completed
 * Blocked from: paused
 */
function isMutationAllowed(progress: ProgramProgress): boolean {
  return progress.status !== "paused";
}

// =============================================================================
// Individual Event Handlers
// =============================================================================

function handleProgramStarted(
  progress: ProgramProgress,
  event: ProgramEvent & { type: "program_started" },
  definition: ProgramDefinition,
): ProgramMutationResult {
  if (!isValidStatusTransition(progress.status, "active")) {
    return unchanged(progress);
  }
  const firstWeek = definition.weeks[0];
  return applied({
    ...progress,
    status: "active",
    startedAt: event.timestamp,
    currentWeekId: firstWeek?.id ?? null,
    updatedAt: event.timestamp,
  });
}

function handleProgramPaused(
  progress: ProgramProgress,
  event: ProgramEvent & { type: "program_paused" },
): ProgramMutationResult {
  if (!isValidStatusTransition(progress.status, "paused")) {
    return unchanged(progress);
  }
  return applied({
    ...progress,
    status: "paused",
    updatedAt: event.timestamp,
  });
}

function handleProgramResumed(
  progress: ProgramProgress,
  event: ProgramEvent & { type: "program_resumed" },
): ProgramMutationResult {
  if (!isValidStatusTransition(progress.status, "active")) {
    return unchanged(progress);
  }
  return applied({
    ...progress,
    status: "active",
    updatedAt: event.timestamp,
  });
}

function handleProgramCompleted(
  progress: ProgramProgress,
  event: ProgramEvent & { type: "program_completed" },
): ProgramMutationResult {
  if (!isValidStatusTransition(progress.status, "completed")) {
    return unchanged(progress);
  }
  // Earn all remaining milestones
  const milestones = progress.milestones.map((m) =>
    m.earnedAt ? m : { ...m, earnedAt: event.timestamp },
  );
  return applied({
    ...progress,
    status: "completed",
    completedAt: event.timestamp,
    milestones,
    updatedAt: event.timestamp,
  });
}

function handleLessonCompleted(
  progress: ProgramProgress,
  event: ProgramEvent & { type: "lesson_completed" },
  definition: ProgramDefinition,
): ProgramMutationResult {
  // Paused-state invariant: progress mutations are blocked when paused.
  if (!isMutationAllowed(progress)) {
    return blocked(progress, "program-paused");
  }

  if (progress.completedLessonIds.includes(event.lessonId)) {
    return unchanged(progress); // idempotent
  }

  // Auto-start the program on first lesson completion
  const autoStarted = progress.status === "not_started";
  const baseStatus: ProgramStatus = autoStarted ? "active" : progress.status;
  const startedAt = autoStarted ? event.timestamp : progress.startedAt;

  const completedLessonIds = [...progress.completedLessonIds, event.lessonId];

  // Check for newly-earned milestones
  const tempProgress: ProgramProgress = {
    ...progress,
    completedLessonIds,
    status: baseStatus,
  };
  const milestones = updateMilestones(
    progress.milestones,
    tempProgress,
    definition,
    event.timestamp,
  );

  // Update current week
  const currentWeekId = updateCurrentWeekId(
    progress.currentWeekId ?? event.weekId,
    completedLessonIds,
    definition,
  );

  // Check if program is now complete
  const totalLessons = definition.lessons.length;
  const allDone = completedLessonIds.length >= totalLessons && totalLessons > 0;
  const newStatus: ProgramStatus = allDone && baseStatus === "active" ? "completed" : baseStatus;
  const completedAt =
    allDone && progress.completedAt === null ? event.timestamp : progress.completedAt;

  return applied({
    ...progress,
    status: newStatus,
    startedAt,
    completedAt,
    currentWeekId,
    completedLessonIds,
    milestones,
    updatedAt: event.timestamp,
  });
}

function handleLessonUncompleted(
  progress: ProgramProgress,
  event: ProgramEvent & { type: "lesson_uncompleted" },
  definition: ProgramDefinition,
): ProgramMutationResult {
  // Paused-state invariant: progress mutations are blocked when paused.
  if (!isMutationAllowed(progress)) {
    return blocked(progress, "program-paused");
  }

  if (!progress.completedLessonIds.includes(event.lessonId)) {
    return unchanged(progress);
  }

  const completedLessonIds = progress.completedLessonIds.filter((id) => id !== event.lessonId);

  // Re-check milestones (some may no longer be earned)
  const tempProgress: ProgramProgress = {
    ...progress,
    completedLessonIds,
  };
  const milestones = recalculateMilestones(progress.milestones, tempProgress, definition);

  // Revert from completed → active if not all done anymore
  const totalLessons = definition.lessons.length;
  const allDone = completedLessonIds.length >= totalLessons && totalLessons > 0;
  const newStatus: ProgramStatus =
    !allDone && progress.status === "completed" ? "active" : progress.status;
  const completedAt = !allDone ? null : progress.completedAt;

  return applied({
    ...progress,
    status: newStatus,
    completedAt,
    completedLessonIds,
    milestones,
    updatedAt: event.timestamp,
  });
}

function handleLessonSkipped(
  progress: ProgramProgress,
  event: ProgramEvent & { type: "lesson_skipped" },
): ProgramMutationResult {
  // Paused-state invariant: progress mutations are blocked when paused.
  if (!isMutationAllowed(progress)) {
    return blocked(progress, "program-paused");
  }

  if (progress.skippedLessonIds.includes(event.lessonId)) {
    return unchanged(progress);
  }
  return applied({
    ...progress,
    skippedLessonIds: [...progress.skippedLessonIds, event.lessonId],
    updatedAt: event.timestamp,
  });
}

function handleLessonUnskipped(
  progress: ProgramProgress,
  event: ProgramEvent & { type: "lesson_unskipped" },
): ProgramMutationResult {
  // Paused-state invariant: progress mutations are blocked when paused.
  if (!isMutationAllowed(progress)) {
    return blocked(progress, "program-paused");
  }

  if (!progress.skippedLessonIds.includes(event.lessonId)) {
    return unchanged(progress);
  }
  return applied({
    ...progress,
    skippedLessonIds: progress.skippedLessonIds.filter((id) => id !== event.lessonId),
    updatedAt: event.timestamp,
  });
}

function handleWeeklyPlanAccepted(
  progress: ProgramProgress,
  event: ProgramEvent & { type: "weekly_plan_accepted" },
): ProgramMutationResult {
  // Paused-state invariant: progress mutations are blocked when paused.
  if (!isMutationAllowed(progress)) {
    return blocked(progress, "program-paused");
  }

  if (progress.acceptedPlanIds.includes(event.planId)) {
    return unchanged(progress);
  }
  return applied({
    ...progress,
    acceptedPlanIds: [...progress.acceptedPlanIds, event.planId],
    updatedAt: event.timestamp,
  });
}

function handleWeeklyPlanDismissed(
  progress: ProgramProgress,
  event: ProgramEvent & { type: "weekly_plan_dismissed" },
): ProgramMutationResult {
  // Paused-state invariant: progress mutations are blocked when paused.
  if (!isMutationAllowed(progress)) {
    return blocked(progress, "program-paused");
  }

  const dismissedId = `plan:${event.planId}`;
  if (progress.dismissedRecommendationIds.includes(dismissedId)) {
    return unchanged(progress);
  }
  return applied({
    ...progress,
    dismissedRecommendationIds: [...progress.dismissedRecommendationIds, dismissedId],
    updatedAt: event.timestamp,
  });
}

function handleMilestoneEarned(
  progress: ProgramProgress,
  event: ProgramEvent & { type: "milestone_earned" },
): ProgramMutationResult {
  // Paused-state invariant: progress mutations are blocked when paused.
  if (!isMutationAllowed(progress)) {
    return blocked(progress, "program-paused");
  }

  const existing = progress.milestones.find((m) => m.id === event.milestoneId);
  if (!existing || existing.earnedAt) {
    return unchanged(progress);
  }
  return applied({
    ...progress,
    milestones: progress.milestones.map((m) =>
      m.id === event.milestoneId ? { ...m, earnedAt: event.timestamp } : m,
    ),
    updatedAt: event.timestamp,
  });
}

// =============================================================================
// Milestone Helpers
// =============================================================================

/**
 * Check for newly-earned milestones and update their earnedAt.
 * Only transitions from not-earned → earned; never revokes.
 */
function updateMilestones(
  current: ProgramMilestone[],
  progress: ProgramProgress,
  definition: ProgramDefinition,
  timestamp: string,
): ProgramMilestone[] {
  return current.map((m) => {
    if (m.earnedAt) return m; // already earned

    // Week-based milestone: earn when week is completed
    if (m.weekId && getWeekAccessStatus(progress, m.weekId, definition) === "completed") {
      return { ...m, earnedAt: timestamp };
    }

    return m;
  });
}

/**
 * Recalculate milestones — some may need to be revoked (uncompleted lesson).
 * Used when a lesson is un-marked as complete.
 */
function recalculateMilestones(
  current: ProgramMilestone[],
  progress: ProgramProgress,
  definition: ProgramDefinition,
): ProgramMilestone[] {
  return current.map((m) => {
    if (!m.weekId) return m;
    const isComplete = getWeekAccessStatus(progress, m.weekId, definition) === "completed";
    return {
      ...m,
      earnedAt: isComplete ? (m.earnedAt ?? new Date().toISOString()) : null,
    };
  });
}

// =============================================================================
// Current Week Helpers
// =============================================================================

/**
 * Update currentWeekId after a lesson is completed.
 * Advances to the next available week if the current week is now fully done.
 */
function updateCurrentWeekId(
  current: string,
  completedLessonIds: string[],
  definition: ProgramDefinition,
): string {
  const currentWeek = definition.weeks.find((w) => w.id === current);
  if (!currentWeek) return current;

  const currentDone = currentWeek.lessonIds.filter((id) => completedLessonIds.includes(id)).length;

  if (currentDone < currentWeek.lessonIds.length) {
    return current; // still working on current week
  }

  // Try to advance to next week
  const nextWeek = definition.weeks.find((w) => w.order === currentWeek.order + 1);
  return nextWeek?.id ?? current;
}

// =============================================================================
// Migration — legacy format → canonical format
// =============================================================================

/**
 * Legacy progress shape (pre v2.5).
 * Only stored completed lesson slugs under "cbtiProgramProgress".
 */
export interface LegacyProgramProgress {
  completedLessons: string[];
}

/**
 * Check if a value looks like the legacy progress format.
 */
export function isLegacyProgress(raw: unknown): raw is LegacyProgramProgress {
  return (
    typeof raw === "object" &&
    raw !== null &&
    "completedLessons" in raw &&
    Array.isArray((raw as LegacyProgramProgress).completedLessons) &&
    !("schemaVersion" in raw)
  );
}

/**
 * Migrate a legacy progress object to the canonical format.
 * If the value cannot be parsed, returns a fresh initial progress record.
 */
export function migrateLegacyProgress(
  raw: unknown,
  definition: ProgramDefinition,
): ProgramProgress {
  const initial = createInitialProgress();

  if (!raw) return initial;
  if (isLegacyProgress(raw)) {
    // Filter to only valid lesson IDs
    const validLessonIds = raw.completedLessons.filter((slug: string) =>
      definition.lessons.some((l) => l.id === slug),
    );

    if (validLessonIds.length === 0) {
      return initial;
    }

    const now = new Date().toISOString();

    // Determine status
    const allDone = validLessonIds.length >= definition.lessons.length;
    const status: ProgramProgress["status"] = allDone ? "completed" : "active";

    // Find current week
    let currentWeekId: string | null = null;
    for (const week of definition.weeks) {
      const weekDone = week.lessonIds.filter((id) => validLessonIds.includes(id)).length;
      if (weekDone < week.lessonIds.length) {
        currentWeekId = week.id;
        break;
      }
    }

    // Calculate milestones
    const tempProgress: ProgramProgress = {
      ...initial,
      status,
      completedLessonIds: validLessonIds,
    };
    const milestones = updateMilestones(initial.milestones, tempProgress, definition, now);

    return {
      ...initial,
      status,
      startedAt: now,
      completedAt: allDone ? now : null,
      currentWeekId,
      completedLessonIds: validLessonIds,
      milestones,
      updatedAt: now,
    };
  }

  // If it's already a valid modern shape, use it with minimal validation
  if (typeof raw === "object" && raw !== null && "schemaVersion" in raw) {
    const p = raw as Partial<ProgramProgress>;
    return {
      schemaVersion: 1,
      programId: (p.programId as ProgramId) ?? DEFAULT_PROGRAM_ID,
      programVersion: p.programVersion ?? 1,
      userId: p.userId,
      status: isValidStatus(p.status) ? p.status : "not_started",
      startedAt: p.startedAt ?? null,
      completedAt: p.completedAt ?? null,
      currentWeekId: p.currentWeekId ?? null,
      completedLessonIds: Array.isArray(p.completedLessonIds)
        ? p.completedLessonIds.filter((id) => typeof id === "string")
        : [],
      skippedLessonIds: Array.isArray(p.skippedLessonIds)
        ? p.skippedLessonIds.filter((id) => typeof id === "string")
        : [],
      acceptedPlanIds: Array.isArray(p.acceptedPlanIds)
        ? p.acceptedPlanIds.filter((id) => typeof id === "string")
        : [],
      dismissedRecommendationIds: Array.isArray(p.dismissedRecommendationIds)
        ? p.dismissedRecommendationIds.filter((id) => typeof id === "string")
        : [],
      milestones: Array.isArray(p.milestones) ? p.milestones : initial.milestones,
      updatedAt: p.updatedAt ?? new Date().toISOString(),
    };
  }

  return initial;
}

function isValidStatus(s: unknown): s is ProgramStatus {
  return s === "not_started" || s === "active" || s === "paused" || s === "completed";
}
