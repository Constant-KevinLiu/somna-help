/**
 * Phase F — Weekly Reflection Export & Delete
 *
 * Client-side utilities for including weekly reflections in user data
 * export and delete-all flows. Follows PAS-08: user data is user-owned,
 * exportable, and deletable.
 *
 * Privacy: Reflection contents are never logged.
 * Domain separation: weekly reflections are a distinct domain from
 * canonical sleep diary records and daily CBT-I reflections.
 */

import { safeLocalStorageRemove } from "../safe-storage";
import { loadWeeklyReflections } from "./storage";
import type { WeeklyReflection } from "./types";

const STORAGE_KEY = "somna.weekly-reflections.v1";

// ============================================
// Export
// ============================================

/**
 * Export-format weekly reflection.
 * Contains all user-authored reflection data plus metadata.
 * No internal sync state or storage implementation details are exposed.
 */
export interface ExportedWeeklyReflection {
  id: string;
  weekStart: string; // YYYY-MM-DD (Monday)
  weekEnd: string; // YYYY-MM-DD (Sunday)
  timezone: string;
  locale: string;
  prompts: {
    id: string;
    category: string;
    response: string;
  }[];
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  schemaVersion: "1";
}

/**
 * Get all weekly reflections in export format.
 *
 * Safe to call during SSR: returns empty array on server.
 * Malformed stored data is silently filtered out (never crashes export).
 *
 * Privacy: this function does not log reflection contents.
 */
export function exportWeeklyReflections(): ExportedWeeklyReflection[] {
  const reflections = loadWeeklyReflections();

  return reflections.map((r) => ({
    id: r.id,
    weekStart: r.weekStart,
    weekEnd: r.weekEnd,
    timezone: r.timezone,
    locale: r.locale,
    prompts: r.responses.map((resp) => ({
      id: resp.promptId,
      category: resp.category,
      response: resp.content,
    })),
    wordCount: r.wordCount,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    schemaVersion: "1" as const,
  }));
}

/**
 * Count weekly reflections (for UI display, does not expose contents).
 */
export function countWeeklyReflections(): number {
  return loadWeeklyReflections().length;
}

// ============================================
// Delete All
// ============================================

/**
 * Delete ALL weekly reflections from local storage.
 * Used for "delete all user data" flows.
 *
 * Safe to call during SSR: no-op on server.
 * Does not affect diary records or daily reflections.
 * Does not throw on malformed stored data.
 */
export function deleteAllWeeklyReflections(): void {
  safeLocalStorageRemove(STORAGE_KEY);
}

// ============================================
// Malformed Storage Safety
// ============================================

/**
 * Load and validate weekly reflections, returning an empty array
 * if storage is missing, malformed, or we're on the server.
 *
 * Exposed for tests that want to verify malformed data handling.
 * Delegates to loadWeeklyReflections which already performs full
 * validation (version check, type checks, entry filtering).
 */
export function safeLoadWeeklyReflections(): WeeklyReflection[] {
  return loadWeeklyReflections();
}
