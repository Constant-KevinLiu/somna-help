/**
 * Sleep Diary v2.3 — Sleep Records Database Operations
 *
 * D1 database queries for authenticated sleep record CRUD.
 * Security: All queries use prepared statements with user isolation.
 */

import type { D1Database } from "@cloudflare/workers-types";
import type { SyncSleepRecord } from "../sync-types";

interface SyncEnv {
  DB?: D1Database;
}

// =============================================================================
// Types
// =============================================================================

interface D1SleepRecord {
  id: string;
  user_id: string;
  local_date: string;
  timezone: string;
  bedtime: string;
  wake_time: string;
  sleep_latency: number;
  night_awakenings: number;
  sleep_quality: number;
  mood: number;
  sleep_efficiency: number;
  sleep_score: number;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// CRUD Operations
// =============================================================================

export async function getSleepRecordsByUserId(
  env: SyncEnv,
  userId: string
): Promise<SyncSleepRecord[]> {
  const db = env.DB;
  if (!db) return [];

  const results = await db
    .prepare(
      `
      SELECT id, local_date, timezone, bedtime, wake_time, sleep_latency,
             night_awakenings, sleep_quality, mood, sleep_efficiency,
             sleep_score, created_at, updated_at
      FROM sleep_records
      WHERE user_id = ?
      ORDER BY local_date DESC
    `
    )
    .bind(userId)
    .all();

  return (results.results as D1SleepRecord[]).map(mapToSyncRecord);
}

export async function getSleepRecordById(
  env: SyncEnv,
  userId: string,
  recordId: string
): Promise<SyncSleepRecord | null> {
  const db = env.DB;
  if (!db) return null;

  const result = await db
    .prepare(
      `
      SELECT id, local_date, timezone, bedtime, wake_time, sleep_latency,
             night_awakenings, sleep_quality, mood, sleep_efficiency,
             sleep_score, created_at, updated_at
      FROM sleep_records
      WHERE id = ? AND user_id = ?
    `
    )
    .bind(recordId, userId)
    .first();

  if (!result) return null;
  return mapToSyncRecord(result as D1SleepRecord);
}

export async function getSleepRecordByDate(
  env: SyncEnv,
  userId: string,
  localDate: string
): Promise<SyncSleepRecord | null> {
  const db = env.DB;
  if (!db) return null;

  const result = await db
    .prepare(
      `
      SELECT id, local_date, timezone, bedtime, wake_time, sleep_latency,
             night_awakenings, sleep_quality, mood, sleep_efficiency,
             sleep_score, created_at, updated_at
      FROM sleep_records
      WHERE user_id = ? AND local_date = ?
    `
    )
    .bind(userId, localDate)
    .first();

  if (!result) return null;
  return mapToSyncRecord(result as D1SleepRecord);
}

export async function upsertSleepRecord(
  env: SyncEnv,
  userId: string,
  record: SyncSleepRecord
): Promise<SyncSleepRecord> {
  const db = env.DB;
  if (!db) throw new Error("Database not available");

  const now = new Date().toISOString();

  await db
    .prepare(
      `
      INSERT INTO sleep_records (
        id, user_id, local_date, timezone, bedtime, wake_time,
        sleep_latency, night_awakenings, sleep_quality, mood,
        sleep_efficiency, sleep_score, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, local_date) DO UPDATE SET
        timezone = excluded.timezone,
        bedtime = excluded.bedtime,
        wake_time = excluded.wake_time,
        sleep_latency = excluded.sleep_latency,
        night_awakenings = excluded.night_awakenings,
        sleep_quality = excluded.sleep_quality,
        mood = excluded.mood,
        sleep_efficiency = excluded.sleep_efficiency,
        sleep_score = excluded.sleep_score,
        updated_at = excluded.updated_at
    `
    )
    .bind(
      record.id,
      userId,
      record.date,
      record.timezone || "UTC",
      record.bedtime,
      record.wakeUpTime,
      record.sleepLatency,
      record.nightAwakenings,
      record.sleepQuality,
      record.mood,
      record.sleepEfficiency,
      record.sleepScore,
      record.createdAt || now,
      record.updatedAt || now
    )
    .run();

  const inserted = await getSleepRecordById(env, userId, record.id);
  if (!inserted) throw new Error("Failed to insert sleep record");
  return inserted;
}

export async function deleteSleepRecord(
  env: SyncEnv,
  userId: string,
  recordId: string
): Promise<boolean> {
  const db = env.DB;
  if (!db) return false;

  const result = await db
    .prepare(
      `
      DELETE FROM sleep_records
      WHERE id = ? AND user_id = ?
    `
    )
    .bind(recordId, userId)
    .run();

  return result.meta.changes > 0;
}

export async function batchUpsertSleepRecords(
  env: SyncEnv,
  userId: string,
  records: SyncSleepRecord[]
): Promise<SyncSleepRecord[]> {
  const results: SyncSleepRecord[] = [];

  for (const record of records) {
    const result = await upsertSleepRecord(env, userId, record);
    results.push(result);
  }

  return results;
}

// =============================================================================
// Mapping Helpers
// =============================================================================

function mapToSyncRecord(d1: D1SleepRecord): SyncSleepRecord {
  return {
    id: d1.id,
    date: d1.local_date,
    timezone: d1.timezone,
    bedtime: d1.bedtime,
    wakeUpTime: d1.wake_time,
    sleepLatency: d1.sleep_latency,
    nightAwakenings: d1.night_awakenings,
    sleepQuality: d1.sleep_quality,
    mood: d1.mood,
    sleepEfficiency: d1.sleep_efficiency,
    sleepScore: d1.sleep_score,
    createdAt: d1.created_at,
    updatedAt: d1.updated_at,
    syncStatus: "synced",
  };
}
