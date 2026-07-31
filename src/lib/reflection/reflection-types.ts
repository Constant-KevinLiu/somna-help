/**
 * Sleep Diary v2.3 — Guided CBT-I Reflection Types
 *
 * Client-side reflection data model compatible with future D1 schema.
 * Local-first implementation before Phase D cloud sync.
 */

import type { Locale } from "@/content/content-types";

export type ReflectionCategory =
  | "sleep-thoughts"
  | "sleep-anxiety"
  | "sleep-behaviors"
  | "relaxation"
  | "gratitude"
  | "sleep-confidence"
  | "stimulus-control"
  | "sleep-restriction"
  | "night-awakenings"
  | "cognitive-reframing";

export interface ReflectionPrompt {
  id: string;
  category: ReflectionCategory;
  text: string;
}

export type SyncStatus = "local" | "pending" | "synced" | "conflict";

export interface LocalReflection {
  id: string;
  localDate: string; // YYYY-MM-DD (local calendar date)
  timezone: string; // IANA timezone
  locale: Locale;
  promptIds: string[];
  promptCategories: ReflectionCategory[];
  content: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

// Storage schema for localStorage
export interface ReflectionStorage {
  version: "1";
  reflections: LocalReflection[];
  lastSyncedAt?: string;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error" | "unsaved";

export interface ReflectionStats {
  currentStreak: number;
  longestStreak: number;
  thisMonth: number;
  totalReflections: number;
}
