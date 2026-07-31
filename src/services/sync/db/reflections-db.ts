/**
 * Sleep Diary v2.3 — Reflections Database Operations
 *
 * D1 database queries for authenticated reflection CRUD.
 * Security: All queries use prepared statements with user isolation.
 * Privacy: Never log reflection content.
 */

import type { D1Database } from "@cloudflare/workers-types";
import type { SyncReflection } from "../sync-types";
import type { Locale } from "@/content/content-types";
import type { ReflectionCategory } from "@/lib/reflection/reflection-types";

interface SyncEnv {
  DB?: D1Database;
}

// =============================================================================
// Types
// =============================================================================

interface D1Reflection {
  id: string;
  user_id: string;
  local_date: string;
  timezone: string;
  locale: string;
  prompt_ids: string;
  prompt_categories: string;
  content: string;
  word_count: number;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// CRUD Operations
// =============================================================================

export async function getReflectionsByUserId(
  env: SyncEnv,
  userId: string
): Promise<SyncReflection[]> {
  const db = env.DB;
  if (!db) return [];

  const results = await db
    .prepare(
      `
      SELECT id, local_date, timezone, locale, prompt_ids,
             prompt_categories, content, word_count, created_at, updated_at
      FROM reflections
      WHERE user_id = ?
      ORDER BY local_date DESC
    `
    )
    .bind(userId)
    .all();

  return (results.results as D1Reflection[]).map(mapToSyncReflection);
}

export async function getReflectionById(
  env: SyncEnv,
  userId: string,
  reflectionId: string
): Promise<SyncReflection | null> {
  const db = env.DB;
  if (!db) return null;

  const result = await db
    .prepare(
      `
      SELECT id, local_date, timezone, locale, prompt_ids,
             prompt_categories, content, word_count, created_at, updated_at
      FROM reflections
      WHERE id = ? AND user_id = ?
    `
    )
    .bind(reflectionId, userId)
    .first();

  if (!result) return null;
  return mapToSyncReflection(result as D1Reflection);
}

export async function getReflectionByDate(
  env: SyncEnv,
  userId: string,
  localDate: string
): Promise<SyncReflection | null> {
  const db = env.DB;
  if (!db) return null;

  const result = await db
    .prepare(
      `
      SELECT id, local_date, timezone, locale, prompt_ids,
             prompt_categories, content, word_count, created_at, updated_at
      FROM reflections
      WHERE user_id = ? AND local_date = ?
    `
    )
    .bind(userId, localDate)
    .first();

  if (!result) return null;
  return mapToSyncReflection(result as D1Reflection);
}

export async function upsertReflection(
  env: SyncEnv,
  userId: string,
  reflection: SyncReflection
): Promise<SyncReflection> {
  const db = env.DB;
  if (!db) throw new Error("Database not available");

  const now = new Date().toISOString();

  await db
    .prepare(
      `
      INSERT INTO reflections (
        id, user_id, local_date, timezone, locale, prompt_ids,
        prompt_categories, content, word_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, local_date) DO UPDATE SET
        timezone = excluded.timezone,
        locale = excluded.locale,
        prompt_ids = excluded.prompt_ids,
        prompt_categories = excluded.prompt_categories,
        content = excluded.content,
        word_count = excluded.word_count,
        updated_at = excluded.updated_at
    `
    )
    .bind(
      reflection.id,
      userId,
      reflection.localDate,
      reflection.timezone || "UTC",
      reflection.locale,
      JSON.stringify(reflection.promptIds),
      JSON.stringify(reflection.promptCategories),
      reflection.content,
      reflection.wordCount,
      reflection.createdAt || now,
      reflection.updatedAt || now
    )
    .run();

  const inserted = await getReflectionById(env, userId, reflection.id);
  if (!inserted) throw new Error("Failed to insert reflection");
  return inserted;
}

export async function deleteReflection(
  env: SyncEnv,
  userId: string,
  reflectionId: string
): Promise<boolean> {
  const db = env.DB;
  if (!db) return false;

  const result = await db
    .prepare(
      `
      DELETE FROM reflections
      WHERE id = ? AND user_id = ?
    `
    )
    .bind(reflectionId, userId)
    .run();

  return result.meta.changes > 0;
}

export async function batchUpsertReflections(
  env: SyncEnv,
  userId: string,
  reflections: SyncReflection[]
): Promise<SyncReflection[]> {
  const results: SyncReflection[] = [];

  for (const reflection of reflections) {
    const result = await upsertReflection(env, userId, reflection);
    results.push(result);
  }

  return results;
}

// =============================================================================
// Mapping Helpers
// =============================================================================

function mapToSyncReflection(d1: D1Reflection): SyncReflection {
  return {
    id: d1.id,
    localDate: d1.local_date,
    timezone: d1.timezone,
    locale: d1.locale as Locale,
    promptIds: JSON.parse(d1.prompt_ids) as string[],
    promptCategories: JSON.parse(d1.prompt_categories) as ReflectionCategory[],
    content: d1.content,
    wordCount: d1.word_count,
    createdAt: d1.created_at,
    updatedAt: d1.updated_at,
    syncStatus: "synced",
  };
}
