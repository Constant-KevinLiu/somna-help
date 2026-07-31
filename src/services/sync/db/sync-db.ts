/**
 * Sleep Diary v2.3 — Sync Metadata Database Operations
 *
 * D1 database queries for idempotency tracking, conflict metadata,
 * and sync state management.
 */

import type { D1Database } from "@cloudflare/workers-types";
import type { IdempotencyRecord, SyncConflict, EntityType } from "../sync-types";

interface SyncEnv {
  DB?: D1Database;
}

// =============================================================================
// Idempotency Tracking
// =============================================================================

/** Idempotency keys expire after 24 hours */
const IDEMPOTENCY_TTL_HOURS = 24;

export async function getIdempotencyRecord(
  env: SyncEnv,
  key: string
): Promise<IdempotencyRecord | null> {
  const db = env.DB;
  if (!db) return null;

  const result = await db
    .prepare(
      `
      SELECT idempotency_key, sync_id, created_at, expires_at, response_hash
      FROM idempotency_keys
      WHERE idempotency_key = ? AND expires_at > datetime('now')
    `
    )
    .bind(key)
    .first();

  if (!result) return null;

  return {
    key: result.idempotency_key as string,
    syncId: result.sync_id as string,
    createdAt: result.created_at as string,
    expiresAt: result.expires_at as string,
    responseHash: result.response_hash as string | undefined,
  };
}

export async function createIdempotencyRecord(
  env: SyncEnv,
  key: string,
  syncId: string,
  responseHash?: string
): Promise<IdempotencyRecord> {
  const db = env.DB;
  if (!db) throw new Error("Database not available");

  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + IDEMPOTENCY_TTL_HOURS * 60 * 60 * 1000).toISOString();

  await db
    .prepare(
      `
      INSERT OR REPLACE INTO idempotency_keys (idempotency_key, sync_id, created_at, expires_at, response_hash)
      VALUES (?, ?, ?, ?, ?)
    `
    )
    .bind(key, syncId, now, expiresAt, responseHash || null)
    .run();

  return { key, syncId, createdAt: now, expiresAt, responseHash };
}

export async function cleanupExpiredIdempotencyKeys(env: SyncEnv): Promise<number> {
  const db = env.DB;
  if (!db) return 0;

  const result = await db
    .prepare(
      `
      DELETE FROM idempotency_keys
      WHERE expires_at <= datetime('now')
    `
    )
    .run();

  return result.meta.changes;
}

// =============================================================================
// Conflict Metadata Tracking
// =============================================================================

export async function recordConflict(
  env: SyncEnv,
  userId: string,
  conflict: SyncConflict
): Promise<void> {
  const db = env.DB;
  if (!db) return;

  const now = new Date().toISOString();

  await db
    .prepare(
      `
      INSERT OR REPLACE INTO sync_conflicts (
        id, user_id, entity_type, entity_id, local_date,
        resolution_type, created_at, resolved_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
    `
    )
    .bind(
      `conflict_${userId}_${conflict.entityType}_${conflict.entityId}`,
      userId,
      conflict.entityType,
      conflict.entityId,
      conflict.localDate || null,
      conflict.resolutionType,
      now
    )
    .run();
}

export async function getUnresolvedConflicts(
  env: SyncEnv,
  userId: string
): Promise<Array<{ entityType: EntityType; entityId: string; localDate?: string }>> {
  const db = env.DB;
  if (!db) return [];

  const results = await db
    .prepare(
      `
      SELECT entity_type, entity_id, local_date
      FROM sync_conflicts
      WHERE user_id = ? AND resolved_at IS NULL
    `
    )
    .bind(userId)
    .all();

  return results.results as Array<{ entity_type: string; entity_id: string; local_date?: string }>;
}

export async function resolveConflict(
  env: SyncEnv,
  userId: string,
  entityType: EntityType,
  entityId: string
): Promise<boolean> {
  const db = env.DB;
  if (!db) return false;

  const now = new Date().toISOString();

  const result = await db
    .prepare(
      `
      UPDATE sync_conflicts
      SET resolved_at = ?
      WHERE user_id = ? AND entity_type = ? AND entity_id = ?
    `
    )
    .bind(now, userId, entityType, entityId)
    .run();

  return result.meta.changes > 0;
}

// =============================================================================
// Sync Logging (for debugging and audit)
// =============================================================================

export async function logSyncOperation(
  env: SyncEnv,
  userId: string,
  syncId: string,
  status: "success" | "partial" | "failed",
  recordCount: number,
  conflictCount: number,
  error?: string
): Promise<void> {
  const db = env.DB;
  if (!db) return;

  const now = new Date().toISOString();

  await db
    .prepare(
      `
      INSERT INTO sync_log (id, user_id, sync_id, status, record_count, conflict_count, error, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    )
    .bind(
      `log_${syncId}`,
      userId,
      syncId,
      status,
      recordCount,
      conflictCount,
      error || null,
      now
    )
    .run();
}
