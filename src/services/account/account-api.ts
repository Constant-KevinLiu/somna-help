/**
 * Sleep Diary v2.3 — Account Data Controls API
 *
 * Server-side endpoints for account data export and deletion.
 * Security: User ID is always derived from session, never from client.
 * Privacy: Never log reflection content or personal data.
 */

import type { D1Database } from "@cloudflare/workers-types/experimental";
import { findUserById, revokeAllSessions } from "../auth/auth-db";

// =============================================================================
// Types
// =============================================================================

interface AccountEnv {
  DB?: D1Database;
}

type RequestContext = {
  request: Request;
  env: AccountEnv;
  ctx: unknown;
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// =============================================================================
// Account Export
// =============================================================================

/**
 * GET /api/account/export
 *
 * Exports all user-owned data in a private downloadable JSON file.
 * Excludes security-related tables (OTP challenges, sessions, hashes).
 * Returns with appropriate no-cache headers.
 */
export async function handleAccountExport(env: AccountEnv, userId: string): Promise<Response> {
  const db = env.DB;
  if (!db) {
    return json(500, {
      success: false,
      error: "database_unavailable",
      message: "Database not available",
    });
  }

  // Get user metadata
  const user = await findUserById(env, userId);
  if (!user) {
    return json(404, {
      success: false,
      error: "user_not_found",
      message: "User account not found",
    });
  }

  try {
    // Get sleep records
    const sleepRecordsResult = await db
      .prepare(
        `
        SELECT id, date, bed_time, wake_time, total_sleep, sleep_quality, 
               notes, created_at, updated_at
        FROM sleep_records
        WHERE user_id = ?
        ORDER BY date DESC
      `,
      )
      .bind(userId)
      .all();

    // Get reflections
    const reflectionsResult = await db
      .prepare(
        `
        SELECT id, local_date, mood_score, mood_label, mood_notes,
               automatic_thought_1, automatic_thought_2, automatic_thought_3,
               challenge_response, reframed_thought, behavior_plan,
               sleep_impact_score, cbt_technique_ids, sync_status,
               created_at, updated_at
        FROM reflections
        WHERE user_id = ?
        ORDER BY local_date DESC
      `,
      )
      .bind(userId)
      .all();

    // Get reminder settings
    const reminderResult = await db
      .prepare(
        `
        SELECT id, email, enabled, reminder_time, timezone, language,
               last_sent_at, created_at, updated_at
        FROM reminder_settings
        WHERE user_id = ?
      `,
      )
      .bind(userId)
      .first();

    // Get program progress
    // Phase G-0.1: Uses new canonical program_progress table schema
    const programProgressResult = await db
      .prepare(
        `
        SELECT id, program_id, program_version, schema_version, status,
               started_at, completed_at, current_week_id,
               completed_lesson_ids, skipped_lesson_ids,
               accepted_plan_ids, dismissed_recommendation_ids,
               milestones, updated_at, client_id
        FROM program_progress
        WHERE user_id = ?
        ORDER BY updated_at DESC
      `,
      )
      .bind(userId)
      .all();
    const programProgress = programProgressResult.results as unknown[];

    // Get weekly reflections (if table exists)
    let weeklyReflections: unknown[] = [];
    try {
      const weeklyResult = await db
        .prepare(
          `
          SELECT id, week_start, week_end, timezone, locale,
                 responses, word_count, sync_status,
                 created_at, updated_at
          FROM weekly_reflections
          WHERE user_id = ?
          ORDER BY week_start DESC
        `,
        )
        .bind(userId)
        .all();
      weeklyReflections = weeklyResult.results as unknown[];
    } catch {
      // Table may not exist yet - that's fine
    }

    const exportDate = new Date().toISOString().split("T")[0];
    const exportData = {
      schemaVersion: "1.0.0",
      exportedAt: new Date().toISOString(),
      account: {
        createdAt: user.createdAt,
        preferredLocale: user.preferredLocale,
        timezone: user.timezone,
      },
      sleepRecords: sleepRecordsResult.results,
      reflections: reflectionsResult.results,
      weeklyReflections,
      reminderSettings: reminderResult || null,
      programProgress,
    };

    const filename = `somna-data-export-${exportDate}.json`;

    return new Response(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": "no-store, no-cache, must-revalidate, private",
        pragma: "no-cache",
        expires: "0",
      },
    });
  } catch (error) {
    console.error("Account export failed (user:", userId.slice(0, 8) + "...)");
    return json(500, {
      success: false,
      error: "export_failed",
      message: "Failed to export account data",
    });
  }
}

// =============================================================================
// Account Data Deletion
// =============================================================================

const DELETE_CONFIRMATION_PHRASE = "DELETE_MY_SLEEP_DATA";

interface DeleteRequest {
  confirmation?: string;
}

/**
 * DELETE /api/account/data
 *
 * Permanently deletes all user-owned data and revokes all active sessions.
 * Requires explicit confirmation phrase in request body.
 */
export async function handleAccountDelete(
  env: AccountEnv,
  userId: string,
  request: Request,
): Promise<Response> {
  const db = env.DB;
  if (!db) {
    return json(500, {
      success: false,
      error: "database_unavailable",
      message: "Database not available",
    });
  }

  // Parse and validate confirmation
  let payload: DeleteRequest;
  try {
    payload = (await request.json()) as DeleteRequest;
  } catch {
    return json(400, {
      success: false,
      error: "invalid_json",
      message: "Could not parse request",
    });
  }

  if (payload.confirmation !== DELETE_CONFIRMATION_PHRASE) {
    return json(400, {
      success: false,
      error: "invalid_confirmation",
      message: "Valid confirmation phrase required",
    });
  }

  try {
    // Use a transaction-like sequence to delete all user data
    const deletionStats = {
      sleepRecords: 0,
      reflections: 0,
      weeklyReflections: 0,
      reminderSettings: 0,
      conflicts: 0,
      syncLog: 0,
      sessions: 0,
      idempotencyKeys: 0,
      programProgress: 0,
    };

    // Delete sleep records
    const sleepResult = await db
      .prepare("DELETE FROM sleep_records WHERE user_id = ?")
      .bind(userId)
      .run();
    deletionStats.sleepRecords = sleepResult.meta.changes;

    // Delete reflections
    const reflectionsResult = await db
      .prepare("DELETE FROM reflections WHERE user_id = ?")
      .bind(userId)
      .run();
    deletionStats.reflections = reflectionsResult.meta.changes;

    // Delete reminder settings
    const reminderResult = await db
      .prepare("DELETE FROM reminder_settings WHERE user_id = ?")
      .bind(userId)
      .run();
    deletionStats.reminderSettings = reminderResult.meta.changes;

    // Delete sync conflicts
    const conflictsResult = await db
      .prepare("DELETE FROM sync_conflicts WHERE user_id = ?")
      .bind(userId)
      .run();
    deletionStats.conflicts = conflictsResult.meta.changes;

    // Delete sync log
    const syncLogResult = await db
      .prepare("DELETE FROM sync_log WHERE user_id = ?")
      .bind(userId)
      .run();
    deletionStats.syncLog = syncLogResult.meta.changes;

    // Delete program progress (Phase G-0.1: canonical table)
    const programProgressResult = await db
      .prepare("DELETE FROM program_progress WHERE user_id = ?")
      .bind(userId)
      .run();
    deletionStats.programProgress = programProgressResult.meta.changes;

    // Delete weekly reflections (if table exists)
    try {
      const weeklyResult = await db
        .prepare("DELETE FROM weekly_reflections WHERE user_id = ?")
        .bind(userId)
        .run();
      deletionStats.weeklyReflections = weeklyResult.meta.changes;
    } catch {
      // Table may not exist yet
    }

    // Revoke all sessions (soft delete via revoked_at)
    const sessionsResult = await revokeAllSessions(env, userId);
    deletionStats.sessions = sessionsResult;

    // Soft delete the user account (preserve email hash for audit)
    const now = new Date().toISOString();
    await db
      .prepare(
        `
        UPDATE users 
        SET deleted_at = ?, preferred_locale = 'deleted', timezone = 'UTC'
        WHERE id = ?
      `,
      )
      .bind(now, userId)
      .run();

    return json(200, {
      success: true,
      message: "Account data deleted successfully",
      deletedAt: now,
      stats: {
        recordsDeleted: Object.values(deletionStats).reduce((a, b) => a + b, 0),
      },
    });
  } catch (error) {
    console.error("Account deletion failed (user:", userId.slice(0, 8) + "...)");
    return json(500, {
      success: false,
      error: "deletion_failed",
      message: "Failed to delete account data",
    });
  }
}
