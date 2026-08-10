/**
 * Phase F — Weekly Reflection Types
 *
 * User-owned weekly reflection data.
 * Separate from daily reflections and canonical sleep diary records.
 *
 * Saving a reflection NEVER modifies diary records.
 */

import type { Locale } from "@/content/content-types";

export type WeeklyReflectionPromptCategory =
  | "routine_consistency"
  | "recording_ease"
  | "manageable_parts"
  | "next_week_observation"
  | "wins"
  | "challenges"
  | "gratitude"
  | "sleep_confidence";

export interface WeeklyReflectionPrompt {
  id: string;
  category: WeeklyReflectionPromptCategory;
  textKey: string;
  placeholderKey: string;
}

export type SyncStatus = "local" | "pending" | "synced" | "conflict";

export interface WeeklyReflectionResponse {
  promptId: string;
  category: WeeklyReflectionPromptCategory;
  content: string;
}

export interface WeeklyReflection {
  id: string;
  weekStart: string; // YYYY-MM-DD (Monday of the week)
  weekEnd: string; // YYYY-MM-DD (Sunday)
  timezone: string; // IANA timezone
  locale: Locale;
  responses: WeeklyReflectionResponse[];
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

// Storage schema for localStorage
export interface WeeklyReflectionStorage {
  version: "1";
  reflections: WeeklyReflection[];
  lastSyncedAt?: string;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error" | "unsaved";
