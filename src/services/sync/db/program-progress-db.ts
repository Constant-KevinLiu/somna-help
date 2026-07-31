/**
 * Sleep Diary v2.5 — Program Progress DB
 *
 * Server-side database operations for the program_progress table.
 * One row per user per program (currently: one program, "cbti-core").
 *
 * Data shape matches the canonical ProgramProgress type from
 * src/lib/program/types.ts (with snake_case column names).
 *
 * Security: user_id is always derived from session, never from client payload.
 */

import type { D1Database } from "@cloudflare/workers-types/experimental";
import type {
  SyncProgramProgress,
  CanonicalProgramProgress,
} from "@/lib/program/sync-contracts";

interface ProgramProgressEnv {
  DB?: D1Database;
}

// =============================================================================
// Types
// =============================================================================

/** Raw row shape from the database (snake_case). */
interface D1ProgramProgress {
  id: string;
  user_id: string;
  program_id: string;
  program_version: number;
  schema_version: number;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  current_week_id: string | null;
  completed_lesson_ids: string;
  skipped_lesson_ids: string;
  accepted_plan_ids: string;
  dismissed_recommendation_ids: string;
  milestones: string;
  updated_at: string;
  client_id: string | null;
}

// =============================================================================
// Helpers
// =============================================================================

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return "[]";
  }
}

/** Convert a DB row to the canonical (server → client) sync format. */
function rowToCanonical(row: D1ProgramProgress): CanonicalProgramProgress {
  return {
    entityType: "program_progress",
    entityId: row.id,
    schemaVersion: (row.schema_version as 1) ?? 1,
    programId: row.program_id,
    programVersion: row.program_version,
    userId: undefined as never, // never expose to client
    canonical: true,
    status: row.status as CanonicalProgramProgress["status"],
    startedAt: row.started_at,
    completedAt: row.completed_at,
    currentWeekId: row.current_week_id,
    completedLessonIds: safeJsonParse<string[]>(row.completed_lesson_ids, []),
    skippedLessonIds: safeJsonParse<string[]>(row.skipped_lesson_ids, []),
    acceptedPlanIds: safeJsonParse<string[]>(row.accepted_plan_ids, []),
    dismissedRecommendationIds: safeJsonParse<string[]>(
      row.dismissed_recommendation_ids,
      []
    ),
    milestones: safeJsonParse<CanonicalProgramProgress["milestones"]>(
      row.milestones,
      []
    ),
    updatedAt: row.updated_at,
  };
}

// =============================================================================
// Read Operations
// =============================================================================

/**
 * Get program progress for a user.
 * Returns null if no progress record exists for this user.
 */
export async function getProgramProgressByUserId(
  env: ProgramProgressEnv,
  userId: string,
  programId: string = "cbti-core"
): Promise<CanonicalProgramProgress | null> {
  const db = env.DB;
  if (!db) return null;

  try {
    const result = await db
      .prepare(
        `
        SELECT * FROM program_progress
        WHERE user_id = ? AND program_id = ?
        LIMIT 1
      `
      )
      .bind(userId, programId)
      .first();

    if (!result) return null;
    return rowToCanonical(result as unknown as D1ProgramProgress);
  } catch (error) {
    console.error("getProgramProgressByUserId failed:", error);
    throw error;
  }
}

// =============================================================================
// Write Operations
// =============================================================================

/**
 * Upsert program progress for a user.
 *
 * Uses the unique (user_id, program_id) constraint.
 * If a record already exists, it is updated; otherwise a new record is inserted.
 *
 * Security: user_id is set from session, never from the incoming progress object.
 */
export async function upsertProgramProgress(
  env: ProgramProgressEnv,
  userId: string,
  progress: SyncProgramProgress
): Promise<CanonicalProgramProgress | null> {
  const db = env.DB;
  if (!db) return null;

  try {
    // Generate entity ID if not provided
    const entityId = progress.entityId || `prog_${userId}_${progress.programId}`;
    const now = new Date().toISOString();

    await db
      .prepare(
        `
        INSERT INTO program_progress (
          id, user_id, program_id, program_version, schema_version,
          status, started_at, completed_at, current_week_id,
          completed_lesson_ids, skipped_lesson_ids,
          accepted_plan_ids, dismissed_recommendation_ids,
          milestones, updated_at, client_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, program_id) DO UPDATE SET
          status = excluded.status,
          started_at = COALESCE(excluded.started_at, program_progress.started_at),
          completed_at = excluded.completed_at,
          current_week_id = excluded.current_week_id,
          completed_lesson_ids = excluded.completed_lesson_ids,
          skipped_lesson_ids = excluded.skipped_lesson_ids,
          accepted_plan_ids = excluded.accepted_plan_ids,
          dismissed_recommendation_ids = excluded.dismissed_recommendation_ids,
          milestones = excluded.milestones,
          updated_at = excluded.updated_at,
          client_id = excluded.client_id
        WHERE excluded.updated_at >= program_progress.updated_at
      `
      )
      .bind(
        entityId,
        userId,
        progress.programId,
        progress.programVersion,
        progress.schemaVersion,
        progress.status,
        progress.startedAt,
        progress.completedAt,
        progress.currentWeekId,
        safeJsonStringify(progress.completedLessonIds),
        safeJsonStringify(progress.skippedLessonIds),
        safeJsonStringify(progress.acceptedPlanIds),
        safeJsonStringify(progress.dismissedRecommendationIds),
        safeJsonStringify(progress.milestones),
        progress.updatedAt || now,
        progress.clientId ?? null
      )
      .run();

    return getProgramProgressByUserId(env, userId, progress.programId);
  } catch (error) {
    console.error("upsertProgramProgress failed:", error);
    throw error;
  }
}

/**
 * Delete all program progress for a user.
 * Returns the number of rows deleted.
 */
export async function deleteProgramProgressByUserId(
  env: ProgramProgressEnv,
  userId: string
): Promise<number> {
  const db = env.DB;
  if (!db) return 0;

  try {
    const result = await db
      .prepare("DELETE FROM program_progress WHERE user_id = ?")
      .bind(userId)
      .run();
    return result.meta.changes ?? 0;
  } catch (error) {
    console.error("deleteProgramProgressByUserId failed:", error);
    throw error;
  }
}
