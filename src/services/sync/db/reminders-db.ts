/**
 * Sleep Diary v2.3 — Reminder Settings Database Operations
 *
 * D1 database queries for authenticated reminder settings CRUD.
 * Security: All queries use prepared statements with user isolation.
 */

import type { D1Database } from "@cloudflare/workers-types";
import type { SyncReminderSettings } from "../sync-types";
import type { Locale } from "@/content/content-types";

interface SyncEnv {
  DB?: D1Database;
}

// =============================================================================
// Types
// =============================================================================

interface D1ReminderSettings {
  id: string;
  user_id: string;
  enabled: number;
  morning_time: string;
  evening_time: string;
  weekly_day: string;
  timezone: string;
  language: string;
  updated_at: string;
  last_sent_at?: string;
}

// =============================================================================
// CRUD Operations
// =============================================================================

export async function getReminderSettingsByUserId(
  env: SyncEnv,
  userId: string
): Promise<SyncReminderSettings | null> {
  const db = env.DB;
  if (!db) return null;

  const result = await db
    .prepare(
      `
      SELECT id, enabled, morning_time, evening_time, weekly_day,
             timezone, language, updated_at, last_sent_at
      FROM reminder_settings
      WHERE user_id = ?
    `
    )
    .bind(userId)
    .first();

  if (!result) return null;
  return mapToSyncReminderSettings(result as D1ReminderSettings);
}

export async function upsertReminderSettings(
  env: SyncEnv,
  userId: string,
  settings: SyncReminderSettings
): Promise<SyncReminderSettings> {
  const db = env.DB;
  if (!db) throw new Error("Database not available");

  const now = new Date().toISOString();
  const id = settings.id || `reminder_${userId}`;

  await db
    .prepare(
      `
      INSERT INTO reminder_settings (
        id, user_id, enabled, morning_time, evening_time,
        weekly_day, timezone, language, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        enabled = excluded.enabled,
        morning_time = excluded.morning_time,
        evening_time = excluded.evening_time,
        weekly_day = excluded.weekly_day,
        timezone = excluded.timezone,
        language = excluded.language,
        updated_at = excluded.updated_at
    `
    )
    .bind(
      id,
      userId,
      settings.enabled ? 1 : 0,
      settings.morningTime || "07:30",
      settings.eveningTime || "22:00",
      settings.weeklyDay || "Sunday",
      settings.timezone || "UTC",
      settings.language || "en",
      settings.updatedAt || now
    )
    .run();

  const inserted = await getReminderSettingsByUserId(env, userId);
  if (!inserted) throw new Error("Failed to insert reminder settings");
  return inserted;
}

export async function deleteReminderSettings(
  env: SyncEnv,
  userId: string
): Promise<boolean> {
  const db = env.DB;
  if (!db) return false;

  const result = await db
    .prepare(
      `
      DELETE FROM reminder_settings
      WHERE user_id = ?
    `
    )
    .bind(userId)
    .run();

  return result.meta.changes > 0;
}

// =============================================================================
// Mapping Helpers
// =============================================================================

function mapToSyncReminderSettings(d1: D1ReminderSettings): SyncReminderSettings {
  return {
    id: d1.id,
    enabled: d1.enabled === 1,
    morningTime: d1.morning_time,
    eveningTime: d1.evening_time,
    weeklyDay: d1.weekly_day,
    timezone: d1.timezone,
    language: d1.language as Locale,
    updatedAt: d1.updated_at,
  };
}
