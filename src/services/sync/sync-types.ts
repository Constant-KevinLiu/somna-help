/**
 * Sleep Diary v2.3 — Sync Service Types
 *
 * Shared type definitions for cloud sync, conflict resolution,
 * local migration, and idempotent operations.
 * Used by both client and server.
 */

import type { Locale } from "@/content/content-types";
import type { ReflectionCategory } from "@/lib/reflection/reflection-types";
import type { SleepRecord } from "@/lib/sleep-records";

// =============================================================================
// Core Sync Types
// =============================================================================

export type SyncStatus = "local" | "pending" | "synced" | "conflict" | "deleted";
export type MigrationState =
  "idle" | "preparing" | "uploading" | "merging" | "completed" | "partial" | "failed";
export type EntityType = "sleep-record" | "reflection" | "reminder" | "progress";

// =============================================================================
// Sync Payload Types — Client -> Server
// =============================================================================

export interface SyncSleepRecord extends SleepRecord {
  id: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  clientId?: string;
}

export interface SyncReflection {
  id: string;
  localDate: string;
  timezone: string;
  locale: Locale;
  promptIds: string[];
  promptCategories: ReflectionCategory[];
  content: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  clientId?: string;
}

export interface SyncReminderSettings {
  id?: string;
  enabled: boolean;
  morningTime: string;
  eveningTime: string;
  weeklyDay: string;
  timezone: string;
  language: Locale;
  updatedAt: string;
}

/**
 * @deprecated LEGACY — Use SyncProgramProgress from @/lib/program/sync-contracts instead.
 * Old v2.3 format with minimal fields.
 */
export interface LegacySyncProgramProgress {
  currentWeek: number;
  currentLesson: string;
  completedLessons: string[];
  updatedAt: string;
}

/**
 * @deprecated Use the new SyncProgramProgress from @/lib/program/sync-contracts.
 * Re-exported here for backward compatibility.
 */
export type { SyncProgramProgress, CanonicalProgramProgress } from "@/lib/program/sync-contracts";

export interface SyncRequest {
  clientId: string;
  syncId: string;
  lastSyncAt?: string;
  sleepRecords: SyncSleepRecord[];
  reflections: SyncReflection[];
  reminderSettings?: SyncReminderSettings;
  /** @deprecated Use programProgress (new format) instead. */
  legacyProgramProgress?: LegacySyncProgramProgress;
  programProgress?: import("@/lib/program/sync-contracts").SyncProgramProgress;
  deletedIds?: {
    sleepRecords: string[];
    reflections: string[];
  };
}

// =============================================================================
// Sync Response Types — Server -> Client
// =============================================================================

export interface CanonicalSleepRecord extends SyncSleepRecord {
  userId: never; // Never expose internal user ID
  canonical: true;
}

export interface CanonicalReflection extends SyncReflection {
  userId: never; // Never expose internal user ID
  canonical: true;
}

export interface CanonicalReminderSettings extends SyncReminderSettings {
  userId: never; // Never expose internal user ID
  canonical: true;
}

// =============================================================================
// Canonical Conversion Helpers — Server → Response boundary
// =============================================================================

/**
 * Mark a sleep record as canonical (server-authored response).
 * The `userId: never` is a phantom type — it is never actually present on
 * the wire, but the type system guarantees no code path can accidentally
 * leak the internal user ID into a sync response.
 */
export function toCanonicalSleepRecord(record: SyncSleepRecord): CanonicalSleepRecord {
  return {
    ...record,
    canonical: true as const,
    userId: undefined as never,
  };
}

export function toCanonicalReflection(reflection: SyncReflection): CanonicalReflection {
  return {
    ...reflection,
    canonical: true as const,
    userId: undefined as never,
  };
}

export function toCanonicalReminderSettings(
  settings: SyncReminderSettings,
): CanonicalReminderSettings {
  return {
    ...settings,
    canonical: true as const,
    userId: undefined as never,
  };
}

export interface SyncConflict {
  entityType: EntityType;
  entityId: string;
  localDate?: string;
  clientVersion: unknown;
  serverVersion: unknown;
  resolutionType: "server-wins" | "client-wins" | "keep-both" | "manual" | "merged";
}

export interface SyncResponse {
  syncId: string;
  serverTime: string;
  success: boolean;
  sleepRecords: CanonicalSleepRecord[];
  reflections: CanonicalReflection[];
  reminderSettings?: CanonicalReminderSettings;
  programProgress?: import("@/lib/program/sync-contracts").CanonicalProgramProgress;
  conflicts: SyncConflict[];
  deletedIds: string[];
  migrationRequired: boolean;
  lastSyncedAt: string;
}

// =============================================================================
// Sync Queue Types (Local Offline Storage)
// =============================================================================

export interface SyncQueueItem {
  id: string;
  entityType: EntityType;
  entityId: string;
  operation: "upsert" | "delete";
  payload: unknown;
  createdAt: string;
  retryCount: number;
  nextRetryAt?: string;
  error?: string;
}

export interface SyncQueueStorage {
  version: "1";
  items: SyncQueueItem[];
  lastProcessedAt?: string;
}

// =============================================================================
// Migration State (Local Storage)
// =============================================================================

export interface MigrationMetadata {
  state: MigrationState;
  startedAt?: string;
  completedAt?: string;
  totalRecords: number;
  migratedRecords: number;
  failedRecords: string[];
  lastError?: string;
  snapshotBackupId?: string;
}

export interface MigrationStorage {
  version: "1";
  migration: MigrationMetadata;
  snapshots: {
    id: string;
    createdAt: string;
    sleepRecords: SyncSleepRecord[];
    reflections: SyncReflection[];
  }[];
}

// =============================================================================
// Conflict Resolution Types
// =============================================================================

export type ConflictResolutionStrategy =
  "newest-wins" | "server-wins" | "client-wins" | "keep-both" | "manual" | "merge-content";

export interface ConflictResolution {
  entityType: EntityType;
  entityId: string;
  strategy: ConflictResolutionStrategy;
  resolvedBy: "auto" | "user";
  resolvedAt: string;
  keptVersion: "client" | "server" | "both" | "merged";
  mergedContent?: string;
}

// =============================================================================
// API Error Types
// =============================================================================

export type SyncErrorCode =
  | "unauthorized"
  | "forbidden"
  | "invalid_payload"
  | "validation_failed"
  | "word_limit_exceeded"
  | "rate_limited"
  | "idempotency_violation"
  | "conflict"
  | "server_error"
  | "offline"
  | "network_error";

export interface SyncError {
  code: SyncErrorCode;
  message: string;
  entityType?: EntityType;
  entityId?: string;
  retryable: boolean;
}

// =============================================================================
// Idempotency Types
// =============================================================================

export interface IdempotencyRecord {
  key: string;
  syncId: string;
  createdAt: string;
  expiresAt: string;
  responseHash?: string;
}

// =============================================================================
// Sync Status UI Types
// =============================================================================

export type SyncStatusDisplay =
  "local-only" | "syncing" | "synced" | "offline" | "needs-attention" | "sync-failed";

export interface SyncStatusInfo {
  status: SyncStatusDisplay;
  lastSyncedAt?: string;
  pendingCount: number;
  conflictCount: number;
  error?: SyncError;
}
