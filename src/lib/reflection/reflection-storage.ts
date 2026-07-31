/**
 * Sleep Diary v2.3 — Reflection Local Storage
 *
 * Validated localStorage persistence layer for Guided CBT-I Reflections.
 * Local-first autosave implementation.
 */

import type { LocalReflection, ReflectionStorage } from "./reflection-types";
import { validateReflectionStorage, filterValidReflections } from "./reflection-validation";

export const REFLECTIONS_STORAGE_KEY = "somna.reflections.v1";

function isLocalStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getDefaultStorage(): ReflectionStorage {
  return {
    version: "1",
    reflections: [],
  };
}

/**
 * Load all reflections from localStorage.
 * Returns only valid reflections. Corrupted data is silently filtered.
 */
export function loadReflections(): LocalReflection[] {
  if (!isLocalStorageAvailable()) return [];

  try {
    const raw = window.localStorage.getItem(REFLECTIONS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    const validated = validateReflectionStorage(parsed);

    if (!validated) {
      console.warn("[ReflectionStorage] Corrupted storage schema, resetting partially");
      if (Array.isArray(parsed.reflections)) {
        return filterValidReflections(parsed.reflections);
      }
      return [];
    }

    return validated.reflections;
  } catch (e) {
    console.error("[ReflectionStorage] Failed to load reflections:", e instanceof Error ? e.message : "unknown");
    return [];
  }
}

/**
 * Save reflections to localStorage.
 * Throws on quota exceeded or storage failure.
 */
export function saveReflections(reflections: LocalReflection[]): void {
  if (!isLocalStorageAvailable()) {
    throw new Error("localStorage not available");
  }

  const storage: ReflectionStorage = {
    version: "1",
    reflections,
  };

  try {
    window.localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(storage));
  } catch (e) {
    if (e instanceof Error && e.name === "QuotaExceededError") {
      throw new Error("Storage quota exceeded");
    }
    throw e;
  }
}

/**
 * Get the reflection for a specific local date.
 * Returns null if no reflection exists for that date.
 */
export function getReflectionByDate(localDate: string): LocalReflection | undefined {
  const reflections = loadReflections();
  return reflections.find((r) => r.localDate === localDate);
}

/**
 * Save a single reflection.
 * Updates existing reflection for the same date, or creates new.
 */
export function saveReflection(reflection: LocalReflection): void {
  const reflections = loadReflections();
  const index = reflections.findIndex((r) => r.localDate === reflection.localDate);

  if (index >= 0) {
    // Update existing: preserve ID and createdAt
    reflections[index] = {
      ...reflection,
      id: reflections[index].id,
      createdAt: reflections[index].createdAt,
    };
  } else {
    reflections.push(reflection);
  }

  saveReflections(reflections);
}

/**
 * Delete a reflection by ID.
 */
export function deleteReflection(id: string): void {
  const reflections = loadReflections();
  const filtered = reflections.filter((r) => r.id !== id);
  saveReflections(filtered);
}

/**
 * Get all reflections sorted by date (newest first).
 */
export function getSortedReflections(): LocalReflection[] {
  const reflections = loadReflections();
  return [...reflections].sort((a, b) => b.localDate.localeCompare(a.localDate));
}

/**
 * Generate a stable client-side ID.
 * Uses timestamp + random suffix.
 */
export function generateReflectionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Get the user's current IANA timezone.
 * Falls back to UTC if Intl is not available.
 */
export function getLocalTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

/**
 * Get today's local calendar date in YYYY-MM-DD format.
 */
export function todayLocalISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
