/**
 * Phase F — Weekly Reflection Storage
 *
 * SSR-safe persistence for weekly reflections.
 * Uses safe-storage utilities for localStorage access.
 *
 * Storage key: "somna.weekly-reflections.v1"
 *
 * Constraints:
 * - Saving a reflection never modifies diary records
 * - All validation at load time (defensive against malformed data)
 * - One reflection per week (by weekStart date)
 */

import { safeLocalStorageGet, safeLocalStorageSet } from "../safe-storage";
import type {
  WeeklyReflection,
  WeeklyReflectionStorage,
  WeeklyReflectionResponse,
} from "./types";

const STORAGE_KEY = "somna.weekly-reflections.v1";

// ============================================
// Validation
// ============================================

function isValidWeeklyReflection(value: unknown): value is WeeklyReflection {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.weekStart === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(v.weekStart) &&
    typeof v.weekEnd === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(v.weekEnd) &&
    typeof v.timezone === "string" &&
    Array.isArray(v.responses) &&
    typeof v.wordCount === "number" &&
    typeof v.createdAt === "string" &&
    typeof v.updatedAt === "string"
  );
}

function validateStorage(raw: unknown): WeeklyReflectionStorage {
  const fallback: WeeklyReflectionStorage = {
    version: "1",
    reflections: [],
  };

  if (typeof raw !== "object" || raw === null) return fallback;
  const obj = raw as Record<string, unknown>;

  if (obj.version !== "1") return fallback;
  if (!Array.isArray(obj.reflections)) return fallback;

  const valid = obj.reflections.filter(isValidWeeklyReflection);
  return {
    version: "1",
    reflections: valid,
  };
}

// ============================================
// CRUD Operations
// ============================================

/**
 * Load all weekly reflections from localStorage.
 * SSR-safe: returns empty array on server.
 */
export function loadWeeklyReflections(): WeeklyReflection[] {
  const raw = safeLocalStorageGet<unknown>(STORAGE_KEY, null);
  const validated = validateStorage(raw);
  return validated.reflections;
}

/**
 * Save the full reflections array.
 */
function saveReflections(reflections: WeeklyReflection[]): void {
  const storage: WeeklyReflectionStorage = {
    version: "1",
    reflections,
  };
  safeLocalStorageSet(STORAGE_KEY, storage);
}

/**
 * Get a weekly reflection for a specific week (by weekStart date).
 */
export function getWeeklyReflectionByWeek(
  weekStart: string,
): WeeklyReflection | undefined {
  const reflections = loadWeeklyReflections();
  return reflections.find((r) => r.weekStart === weekStart);
}

/**
 * Save or update a weekly reflection.
 * Upserts by weekStart — one reflection per week.
 */
export function saveWeeklyReflection(
  reflection: WeeklyReflection,
): WeeklyReflection[] {
  const reflections = loadWeeklyReflections();
  const index = reflections.findIndex(
    (r) => r.weekStart === reflection.weekStart,
  );

  const updated = {
    ...reflection,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    reflections[index] = updated;
  } else {
    reflections.push(updated);
  }

  // Sort by weekStart descending (newest first)
  reflections.sort((a, b) => b.weekStart.localeCompare(a.weekStart));

  saveReflections(reflections);
  return reflections;
}

/**
 * Delete a weekly reflection by ID.
 */
export function deleteWeeklyReflection(id: string): WeeklyReflection[] {
  const reflections = loadWeeklyReflections();
  const filtered = reflections.filter((r) => r.id !== id);
  saveReflections(filtered);
  return filtered;
}

// ============================================
// Utility Functions
// ============================================

/**
 * Generate a unique ID for a new reflection.
 */
export function generateWeeklyReflectionId(): string {
  return `wr_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Get the local IANA timezone string.
 * SSR-safe: returns "UTC" on server.
 */
export function getLocalTimezone(): string {
  if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
      return "UTC";
    }
  }
  return "UTC";
}

/**
 * Calculate total word count across all responses.
 */
export function calculateWordCount(responses: WeeklyReflectionResponse[]): number {
  const allText = responses.map((r) => r.content).join(" ");
  const words = allText.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

/**
 * Get all weekly reflections sorted by date (newest first).
 */
export function getSortedWeeklyReflections(): WeeklyReflection[] {
  return loadWeeklyReflections().sort((a, b) =>
    b.weekStart.localeCompare(a.weekStart),
  );
}
