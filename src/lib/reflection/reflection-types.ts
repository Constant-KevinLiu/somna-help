/**
 * Sleep Diary v2.5 — Guided CBT-I Reflection Types
 *
 * Canonical reflection data model for local-first persistence.
 * Storage keys are strictly separated between draft and committed history.
 *
 * Storage keys:
 *   somna.reflections.v2         — committed reflection history (canonical)
 *   somna.reflection-draft.v1    — current in-progress draft
 *   somna.reflections.v1         — legacy v1 (migration source only)
 *   reflections                  — legacy sync-client key (migration source only)
 */

import type { ContentLocale } from "@/content/content-types";

export const REFLECTION_CATEGORIES = [
  "sleep-thoughts",
  "sleep-anxiety",
  "sleep-behaviors",
  "relaxation",
  "gratitude",
  "sleep-confidence",
  "stimulus-control",
  "sleep-restriction",
  "night-awakenings",
  "cognitive-reframing",
] as const;

export type ReflectionCategory = (typeof REFLECTION_CATEGORIES)[number];

export interface ReflectionPrompt {
  id: string;
  category: ReflectionCategory;
  text: string;
}

export type SyncStatus = "local" | "pending" | "synced" | "conflict" | "failed";

/**
 * A committed reflection record in history.
 *
 * - id: stable unique identifier (canonical format: ref_<timestamp>_<random>)
 * - localDate: locale-independent local calendar date (YYYY-MM-DD)
 * - timezone: IANA timezone at time of creation
 * - locale: content locale code (e.g. "pt-BR"), NOT UI locale code
 * - promptIds: stable prompt identifiers (not translated display text)
 * - promptCategories: category identifiers aligned 1:1 with promptIds
 * - content: user's reflection text, stored exactly as written
 * - wordCount: validated word count
 * - createdAt / updatedAt: ISO 8601 timestamps
 * - syncStatus: local/pending/synced/conflict
 * - legacyId: original ID from v1 / sync migration, kept for deduplication
 */
export interface LocalReflection {
  id: string;
  localDate: string; // YYYY-MM-DD (local calendar date)
  timezone: string; // IANA timezone
  locale: ContentLocale;
  promptIds: string[];
  promptCategories: ReflectionCategory[];
  content: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  /** Traceable legacy identity for deduplication during migration */
  legacyId?: string;
}

/**
 * Storage schema for committed reflection history (localStorage).
 * Version "2" fixes the v1 ID/length validation bug and locale mismatch.
 * This is the single source of truth for reflection data.
 */
export interface ReflectionStorage {
  version: "2";
  reflections: LocalReflection[];
  lastSyncedAt?: string;
  /** Quarantined records that failed migration — kept for recovery */
  quarantined?: Array<{ raw: unknown; reason: string; migratedAt: string }>;
  /** Migration marker: v1 records have been merged into v2 */
  v1Migrated?: boolean;
  /** Migration marker: legacy sync-client "reflections" key has been merged */
  syncLegacyMigrated?: boolean;
}

/**
 * Legacy v1 storage shape (read-only, migration source only).
 * v1 had ID validation bug (accepted uuid | length 21 but generated 23-char IDs)
 * and stored UI locale codes (e.g. "pt") instead of content locale codes ("pt-BR").
 */
export interface LegacyReflectionStorageV1 {
  version: "1";
  reflections: Array<Record<string, unknown>>;
  lastSyncedAt?: string;
}

/**
 * Legacy sync-client storage shape (read-only, migration source only).
 * The old sync client used the bare "reflections" key with a slightly different
 * envelope. Migrated into somna.reflections.v2 on first load.
 */
export interface LegacySyncReflectionStorage {
  version: "1";
  reflections: Array<Record<string, unknown>>;
  lastSyncedAt?: string;
}

/**
 * Draft storage — separate from committed history.
 * Only the current day's in-progress reflection is stored as a draft.
 */
export interface ReflectionDraft {
  version: "1";
  localDate: string;
  locale: ContentLocale;
  promptIds: string[];
  promptCategories: ReflectionCategory[];
  content: string;
  wordCount: number;
  updatedAt: string;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error" | "unsaved";

export interface ReflectionStats {
  currentStreak: number;
  longestStreak: number;
  thisMonth: number;
  totalReflections: number;
}
