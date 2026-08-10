/**
 * Sleep Diary v2.3 — Sync API Handler
 *
 * Server-side sync endpoint for authenticated batch synchronization.
 * Handles idempotency, conflict resolution, and returns canonical state.
 * Security: User ID is always derived from session, never from client.
 * Privacy: Never log reflection content.
 */

import type { D1Database } from "@cloudflare/workers-types";
import type {
  SyncRequest,
  SyncResponse,
  SyncSleepRecord,
  SyncReflection,
  SyncConflict,
} from "../sync-types";
import {
  toCanonicalSleepRecord,
  toCanonicalReflection,
  toCanonicalReminderSettings,
} from "../sync-types";
import { validateSyncRequest, normalizeSleepRecord, normalizeReflection } from "../sync-validation";
import {
  getSleepRecordsByUserId,
  upsertSleepRecord,
  batchUpsertSleepRecords,
} from "../db/sleep-records-db";
import {
  getReflectionsByUserId,
  upsertReflection,
  batchUpsertReflections,
} from "../db/reflections-db";
import { getReminderSettingsByUserId, upsertReminderSettings } from "../db/reminders-db";
import { getProgramProgressByUserId, upsertProgramProgress } from "../db/program-progress-db";
import { getIdempotencyRecord, createIdempotencyRecord, logSyncOperation } from "../db/sync-db";
import { resolveSleepRecordConflict, resolveReflectionConflict } from "../sync-conflicts";
import {
  mergeLocalAndRemoteProgress,
  fromCanonicalProgress,
  toSyncProgress,
  type SyncProgramProgress,
  type CanonicalProgramProgress,
} from "@/lib/program/sync-contracts";

interface SyncEnv {
  DB?: D1Database;
}

// =============================================================================
// Main Sync Handler
// =============================================================================

export async function handleSync(
  env: SyncEnv,
  userId: string,
  request: Request,
  idempotencyKey?: string,
): Promise<Response> {
  // Parse sync request from body
  let syncRequest: SyncRequest;
  try {
    syncRequest = (await request.json()) as SyncRequest;
  } catch {
    return json(400, {
      success: false,
      error: "invalid_json",
      message: "Could not parse sync request",
    });
  }

  const syncId = syncRequest.syncId;
  const serverTime = new Date().toISOString();

  // Check idempotency
  if (idempotencyKey) {
    const existing = await getIdempotencyRecord(env, idempotencyKey);
    if (existing) {
      // This request was already processed — return cached response indicator
      // In a full implementation, we'd store and return the exact response
      return json(200, {
        syncId,
        serverTime,
        success: true,
        idempotent: true,
        message: "Request already processed",
      });
    }
  }

  // Validate request
  const validation = validateSyncRequest(syncRequest);
  if (!validation.valid) {
    return json(400, {
      syncId,
      serverTime,
      success: false,
      errors: validation.errors,
    });
  }

  try {
    // Process sync in transaction-like sequence
    const result = await processSync(env, userId, syncRequest);

    // Record idempotency
    if (idempotencyKey) {
      await createIdempotencyRecord(env, idempotencyKey, syncId);
    }

    // Log sync operation (without private content)
    await logSyncOperation(
      env,
      userId,
      syncId,
      result.conflicts.length > 0 ? "partial" : "success",
      result.sleepRecords.length + result.reflections.length,
      result.conflicts.length,
    );

    return json(200, {
      ...result,
      syncId,
      serverTime,
      success: true,
      migrationRequired: false,
      lastSyncedAt: serverTime,
    });
  } catch (error) {
    console.error("Sync failed:", error instanceof Error ? error.message : "unknown error");

    await logSyncOperation(
      env,
      userId,
      syncId,
      "failed",
      0,
      0,
      error instanceof Error ? error.message : "unknown error",
    );

    return json(500, {
      syncId,
      serverTime,
      success: false,
      error: "server_error",
      message: "Sync operation failed",
    });
  }
}

// =============================================================================
// Sync Processing Logic
// =============================================================================

async function processSync(
  env: SyncEnv,
  userId: string,
  request: SyncRequest,
): Promise<
  Omit<SyncResponse, "syncId" | "serverTime" | "success" | "migrationRequired" | "lastSyncedAt">
> {
  const conflicts: SyncConflict[] = [];

  // Get current server state
  const serverSleepRecords = await getSleepRecordsByUserId(env, userId);
  const serverReflections = await getReflectionsByUserId(env, userId);

  // Create lookup maps
  const serverSleepByDate = new Map(serverSleepRecords.map((r) => [r.date, r]));
  const serverSleepById = new Map(serverSleepRecords.map((r) => [r.id, r]));
  const serverReflectionByDate = new Map(serverReflections.map((r) => [r.localDate, r]));
  const serverReflectionById = new Map(serverReflections.map((r) => [r.id, r]));

  // Process sleep records
  const processedSleepRecords: SyncSleepRecord[] = [];

  for (const clientRecord of request.sleepRecords) {
    const normalized = normalizeSleepRecord(clientRecord);
    const serverByDate = serverSleepByDate.get(normalized.date);
    const serverById = serverSleepById.get(normalized.id);

    if (serverByDate || serverById) {
      // Conflict detected — resolve
      const serverRecord = serverByDate || serverById!;
      const result = resolveSleepRecordConflict(normalized, serverRecord);

      if (result.conflict) {
        conflicts.push(result.conflict);
      }

      // Upsert the resolved version
      const upserted = await upsertSleepRecord(env, userId, result.resolved);
      processedSleepRecords.push({ ...upserted, syncStatus: "synced" });
    } else {
      // No conflict — insert new record
      const upserted = await upsertSleepRecord(env, userId, normalized);
      processedSleepRecords.push({ ...upserted, syncStatus: "synced" });
    }
  }

  // Process reflections
  const processedReflections: SyncReflection[] = [];

  for (const clientReflection of request.reflections) {
    const normalized = normalizeReflection(clientReflection);
    const serverByDate = serverReflectionByDate.get(normalized.localDate);
    const serverById = serverReflectionById.get(normalized.id);

    if (serverByDate || serverById) {
      // Conflict detected — resolve
      const serverRecord = serverByDate || serverById!;
      const result = resolveReflectionConflict(normalized, serverRecord);

      if (result.conflict) {
        conflicts.push(result.conflict);
      }

      // Upsert the resolved version
      const upserted = await upsertReflection(env, userId, result.resolved);
      processedReflections.push({ ...upserted, syncStatus: "synced" });
    } else {
      // No conflict — insert new record
      const upserted = await upsertReflection(env, userId, normalized);
      processedReflections.push({ ...upserted, syncStatus: "synced" });
    }
  }

  // Process reminder settings
  let reminderSettings = undefined;
  if (request.reminderSettings) {
    reminderSettings = await upsertReminderSettings(env, userId, request.reminderSettings);
  } else {
    reminderSettings = await getReminderSettingsByUserId(env, userId);
  }

  // Process program progress (Phase G-0.1)
  // Merge strategy: completed lessons union, most-advanced status wins
  let finalProgramProgress: CanonicalProgramProgress | null = null;
  try {
    if (request.programProgress) {
      const serverProgress = await getProgramProgressByUserId(env, userId);
      if (serverProgress) {
        // Both sides have progress — merge using union strategy
        const localProg = fromCanonicalProgress(serverProgress as CanonicalProgramProgress);
        const remoteProg = fromCanonicalProgress(
          request.programProgress as unknown as CanonicalProgramProgress,
        );
        const merged = mergeLocalAndRemoteProgress(localProg, remoteProg);
        const entityId = serverProgress.entityId;
        const mergedSync = toSyncProgress(merged, entityId);
        finalProgramProgress = await upsertProgramProgress(env, userId, mergedSync);
      } else {
        // No server progress yet — just insert client's
        finalProgramProgress = await upsertProgramProgress(
          env,
          userId,
          request.programProgress as SyncProgramProgress,
        );
      }
    } else {
      // Client didn't send progress — just return server's copy
      finalProgramProgress = await getProgramProgressByUserId(env, userId);
    }
  } catch (progError) {
    // Program progress sync errors are non-fatal — don't break the whole sync
    console.error(
      "Program progress sync failed (non-fatal):",
      progError instanceof Error ? progError.message : "unknown error",
    );
    // Still try to return whatever server has
    try {
      finalProgramProgress = await getProgramProgressByUserId(env, userId);
    } catch {
      finalProgramProgress = null;
    }
  }

  // Fetch full canonical state from server
  const finalSleepRecords = await getSleepRecordsByUserId(env, userId);
  const finalReflections = await getReflectionsByUserId(env, userId);

  return {
    sleepRecords: finalSleepRecords.map(toCanonicalSleepRecord),
    reflections: finalReflections.map(toCanonicalReflection),
    reminderSettings: reminderSettings ? toCanonicalReminderSettings(reminderSettings) : undefined,
    programProgress: finalProgramProgress ?? undefined,
    conflicts,
    deletedIds: [], // Client-side deletes handled separately
  };
}

// =============================================================================
// Full Restore Handler (for new device login)
// =============================================================================

export async function handleRestore(env: SyncEnv, userId: string): Promise<Response> {
  try {
    const [sleepRecords, reflections, reminderSettings, programProgress] = await Promise.all([
      getSleepRecordsByUserId(env, userId),
      getReflectionsByUserId(env, userId),
      getReminderSettingsByUserId(env, userId),
      getProgramProgressByUserId(env, userId),
    ]);
    const serverTime = new Date().toISOString();

    return json(200, {
      serverTime,
      success: true,
      sleepRecords,
      reflections,
      reminderSettings,
      programProgress: programProgress ?? undefined,
      lastSyncedAt: serverTime,
    });
  } catch (error) {
    console.error("Restore failed:", error instanceof Error ? error.message : "unknown error");
    return json(500, {
      success: false,
      error: "server_error",
      message: "Restore operation failed",
    });
  }
}

// =============================================================================
// Helper
// =============================================================================

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
