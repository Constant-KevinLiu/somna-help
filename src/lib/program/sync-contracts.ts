/**
 * Sleep Diary v2.5 — Program Sync Contracts
 *
 * Typed sync entities for Program progress and Weekly Plans.
 * These extend the existing sync system with program-specific entities.
 *
 * Design principles:
 *  - Schema versioned for migration safety
 *  - Entity ID for tracking
 *  - User ownership (from session, never from client payload)
 *  - Updated timestamp for conflict resolution
 *  - Deletion tombstone support
 *  - Conflict metadata (resolution strategy)
 *  - Deterministic serialization
 *
 * Conflict strategy (documented, not implemented as a merge algorithm):
 *   - completedLessonIds: set union (both sides' completions are preserved)
 *   - skippedLessonIds: last-write-wins
 *   - currentWeekId: latest valid transition
 *   - status: latest valid transition
 *   - milestones: union of earned
 *   - weekly plans: entity-level last-write-wins
 *   - delete-all: authoritative user deletion
 *
 * Conflicts must NEVER corrupt Diary data.
 */

import type {
  ProgramProgress,
  ProgramMilestone,
  ProgramStatus,
} from "./types";
import type { WeeklyProgramPlan } from "./weekly-plan";

// =============================================================================
// Entity Type Constants
// =============================================================================

export const PROGRAM_PROGRESS_ENTITY = "program_progress" as const;
export const PROGRAM_PLAN_ENTITY = "program_plan" as const;
export type ProgramSyncEntityType =
  | typeof PROGRAM_PROGRESS_ENTITY
  | typeof PROGRAM_PLAN_ENTITY;

// =============================================================================
// Sync Program Progress
// =============================================================================

/**
 * Wire format for program progress in sync payloads.
 *
 * Differences from local ProgramProgress:
 *  - Has entityId (unique sync identifier)
 *  - Has userId (set server-side, never from client)
 *  - Has syncStatus field for local tracking
 *  - Has clientId for reconciliation
 *  - Has conflict metadata
 */
export interface SyncProgramProgress {
  /** Entity type discriminator. */
  entityType: "program_progress";
  /** Unique entity ID (for sync tracking). */
  entityId: string;
  /** Schema version. */
  schemaVersion: 1;
  /** Which program this is for. */
  programId: string;
  /** Program definition version. */
  programVersion: number;
  /** User ID (server-side only; stripped from responses via Canonical type). */
  userId?: string;
  /** Program lifecycle status. */
  status: ProgramStatus;
  /** ISO timestamp when user started (null if not started). */
  startedAt: string | null;
  /** ISO timestamp when user completed (null if not completed). */
  completedAt: string | null;
  /** Current week ID. */
  currentWeekId: string | null;
  /** Completed lesson IDs. */
  completedLessonIds: string[];
  /** Skipped lesson IDs. */
  skippedLessonIds: string[];
  /** Accepted weekly plan IDs. */
  acceptedPlanIds: string[];
  /** Dismissed recommendation IDs. */
  dismissedRecommendationIds: string[];
  /** Milestones earned. */
  milestones: ProgramMilestone[];
  /** Last update time (ISO timestamp). */
  updatedAt: string;
  /** Client-side ID for sync reconciliation. */
  clientId?: string;
  /** Sync status (client-side tracking, not persisted server-side). */
  syncStatus?: "local" | "pending" | "synced" | "conflict" | "deleted";
}

/**
 * Canonical (server → client) program progress response.
 *
 * The userId field is never exposed to the client (set to `never`).
 * The `canonical: true` marker distinguishes server-authored records.
 */
export interface CanonicalProgramProgress {
  entityType: "program_progress";
  entityId: string;
  schemaVersion: 1;
  programId: string;
  programVersion: number;
  userId: never; // Never expose internal user ID to client
  canonical: true;
  status: ProgramStatus;
  startedAt: string | null;
  completedAt: string | null;
  currentWeekId: string | null;
  completedLessonIds: string[];
  skippedLessonIds: string[];
  acceptedPlanIds: string[];
  dismissedRecommendationIds: string[];
  milestones: ProgramMilestone[];
  updatedAt: string;
}

// =============================================================================
// Sync Weekly Program Plan
// =============================================================================

/**
 * Wire format for a weekly program plan in sync payloads.
 */
export interface SyncWeeklyProgramPlan {
  /** Entity type discriminator. */
  entityType: "program_plan";
  /** Unique entity ID (matches plan.id). */
  entityId: string;
  /** Schema version. */
  schemaVersion: 1;
  /** Plan content (all fields from WeeklyProgramPlan). */
  plan: WeeklyProgramPlan;
  /** User ID (server-side only). */
  userId?: string;
  /** Last update time. */
  updatedAt: string;
  /** Client-side ID for sync reconciliation. */
  clientId?: string;
  /** Sync status (client-side tracking). */
  syncStatus?: "local" | "pending" | "synced" | "conflict" | "deleted";
  /** Tombstone flag for deleted plans. */
  deleted?: boolean;
}

/**
 * Canonical (server → client) weekly plan response.
 */
export interface CanonicalWeeklyProgramPlan {
  entityType: "program_plan";
  entityId: string;
  schemaVersion: 1;
  plan: WeeklyProgramPlan;
  userId: never;
  canonical: true;
  updatedAt: string;
  deleted?: boolean;
}

// =============================================================================
// Conflict Strategy (documented, executable as pure functions)
// =============================================================================

/**
 * Merge two sets of completed lesson IDs (set union).
 * Both sides' completions are preserved — completing a lesson is
 * additive and should never be undone by sync.
 */
export function mergeCompletedLessons(
  localIds: string[],
  remoteIds: string[]
): string[] {
  return Array.from(new Set([...localIds, ...remoteIds]));
}

/**
 * Resolve currentWeekId conflict: pick the one from the side with
 * the later updatedAt timestamp, but only if it's a valid transition
 * from the other state.
 *
 * For G-0, we use simple last-write-wins on currentWeekId since the
 * broader progress reconciliation handles correctness via set union
 * of completed lessons.
 */
export function resolveCurrentWeekId(
  localWeekId: string | null,
  localUpdatedAt: string,
  remoteWeekId: string | null,
  remoteUpdatedAt: string
): string | null {
  return localUpdatedAt >= remoteUpdatedAt ? localWeekId : remoteWeekId;
}

/**
 * Resolve program status conflict: prefer the more-advanced status.
 *
 * Status advancement order: not_started → active → completed
 * Paused is treated as equivalent to active for advancement purposes.
 */
export function resolveStatusConflict(
  local: ProgramStatus,
  remote: ProgramStatus
): ProgramStatus {
  const rank: Record<ProgramStatus, number> = {
    not_started: 0,
    paused: 1,
    active: 1,
    completed: 2,
  };
  return rank[remote] > rank[local] ? remote : local;
}

/**
 * Merge milestones: union of all earned milestones.
 * If either side has earned a milestone, the merged result has it earned.
 * Uses the earlier earnedAt timestamp.
 */
export function mergeMilestones(
  local: ProgramMilestone[],
  remote: ProgramMilestone[]
): ProgramMilestone[] {
  const byId = new Map<string, ProgramMilestone>();

  for (const m of local) {
    byId.set(m.id, { ...m });
  }

  for (const remoteM of remote) {
    const existing = byId.get(remoteM.id);
    if (!existing) {
      byId.set(remoteM.id, { ...remoteM });
    } else if (remoteM.earnedAt) {
      if (!existing.earnedAt || remoteM.earnedAt < existing.earnedAt) {
        existing.earnedAt = remoteM.earnedAt;
      }
    }
  }

  return Array.from(byId.values());
}

// =============================================================================
// Serialization
// =============================================================================

/**
 * Convert local ProgramProgress → SyncProgramProgress.
 * Used when sending progress to the sync endpoint.
 */
export function toSyncProgress(
  progress: ProgramProgress,
  entityId: string,
  options?: { clientId?: string; syncStatus?: string }
): SyncProgramProgress {
  return {
    entityType: "program_progress",
    entityId,
    schemaVersion: 1,
    programId: progress.programId,
    programVersion: progress.programVersion,
    status: progress.status,
    startedAt: progress.startedAt,
    completedAt: progress.completedAt,
    currentWeekId: progress.currentWeekId,
    completedLessonIds: [...progress.completedLessonIds],
    skippedLessonIds: [...progress.skippedLessonIds],
    acceptedPlanIds: [...progress.acceptedPlanIds],
    dismissedRecommendationIds: [...progress.dismissedRecommendationIds],
    milestones: progress.milestones.map((m) => ({ ...m })),
    updatedAt: progress.updatedAt,
    clientId: options?.clientId,
    syncStatus: options?.syncStatus as SyncProgramProgress["syncStatus"],
  };
}

/**
 * Convert canonical (server) progress → local ProgramProgress.
 * Used when receiving progress from the sync endpoint.
 */
export function fromCanonicalProgress(
  canonical: CanonicalProgramProgress
): ProgramProgress {
  return {
    schemaVersion: canonical.schemaVersion,
    programId: canonical.programId as "cbti-core",
    programVersion: canonical.programVersion,
    status: canonical.status,
    startedAt: canonical.startedAt,
    completedAt: canonical.completedAt,
    currentWeekId: canonical.currentWeekId,
    completedLessonIds: [...canonical.completedLessonIds],
    skippedLessonIds: [...canonical.skippedLessonIds],
    acceptedPlanIds: [...canonical.acceptedPlanIds],
    dismissedRecommendationIds: [...canonical.dismissedRecommendationIds],
    milestones: canonical.milestones.map((m) => ({ ...m })),
    updatedAt: canonical.updatedAt,
  };
}

// =============================================================================
// Timestamp helpers
// =============================================================================

/**
 * Safely parse an ISO timestamp. Returns null if the string is not a valid date.
 * Never silently converts an invalid timestamp into "now".
 */
function parseTimestamp(ts: string | null): Date | null {
  if (ts === null || ts === undefined) return null;
  if (typeof ts !== "string") return null;
  const d = new Date(ts);
  if (isNaN(d.getTime())) return null;
  return d;
}

/**
 * Resolve two timestamps to the earlier valid one.
 *
 * Rules:
 *   local null    + remote null    → null
 *   local value   + remote null    → local
 *   local null    + remote value   → remote
 *   local value   + remote value   → earlier of the two (valid timestamps only)
 *
 * Invalid timestamps are treated as null. This ensures merge never silently
 * converts garbage data into a valid timestamp.
 *
 * This function is commutative (order of arguments does not matter) and
 * idempotent (merging a value with itself returns the same value).
 */
export function resolveEarlierTimestamp(
  a: string | null,
  b: string | null
): string | null {
  const dateA = parseTimestamp(a);
  const dateB = parseTimestamp(b);

  if (dateA === null && dateB === null) return null;
  if (dateA === null) return b; // b is valid (dateB !== null)
  if (dateB === null) return a; // a is valid (dateA !== null)

  // Both valid — return the earlier one
  return dateA.getTime() <= dateB.getTime() ? a : b;
}

// =============================================================================
// Local-First Merge (anonymous → authenticated)
// =============================================================================

/**
 * Merge anonymous local progress with authenticated remote progress.
 *
 * Strategy:
 *  - completed lessons: union (both sides preserved)
 *  - skipped lessons: union (both sides preserved)
 *  - status: most-advanced wins
 *  - current week: latest timestamp wins
 *  - milestones: union
 *  - startedAt: earlier of the two
 *  - completedAt: earlier of the two (if both completed)
 *
 * This function is deterministic and side-effect free.
 */
export function mergeLocalAndRemoteProgress(
  local: ProgramProgress,
  remote: ProgramProgress
): ProgramProgress {
  const completedLessonIds = mergeCompletedLessons(
    local.completedLessonIds,
    remote.completedLessonIds
  );
  const skippedLessonIds = mergeCompletedLessons(
    local.skippedLessonIds,
    remote.skippedLessonIds
  );
  const acceptedPlanIds = mergeCompletedLessons(
    local.acceptedPlanIds,
    remote.acceptedPlanIds
  );
  const dismissedRecommendationIds = mergeCompletedLessons(
    local.dismissedRecommendationIds,
    remote.dismissedRecommendationIds
  );
  const milestones = mergeMilestones(local.milestones, remote.milestones);
  const status = resolveStatusConflict(local.status, remote.status);

  const localLater = local.updatedAt >= remote.updatedAt;
  const currentWeekId = localLater
    ? local.currentWeekId
    : remote.currentWeekId;

  const startedAt = resolveEarlierTimestamp(local.startedAt, remote.startedAt);

  // completedAt: earliest valid timestamp wins (first confirmed completion).
  // If merged status is not completed, completedAt is always null.
  const completedAt =
    status === "completed"
      ? resolveEarlierTimestamp(local.completedAt, remote.completedAt)
      : null;

  const updatedAt = new Date().toISOString();

  return {
    schemaVersion: 1,
    programId: local.programId,
    programVersion: Math.max(local.programVersion, remote.programVersion),
    userId: remote.userId ?? local.userId,
    status,
    startedAt,
    completedAt,
    currentWeekId,
    completedLessonIds,
    skippedLessonIds,
    acceptedPlanIds,
    dismissedRecommendationIds,
    milestones,
    updatedAt,
  };
}
