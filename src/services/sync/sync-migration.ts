/**
 * Sleep Diary v2.3 — Local-to-Cloud Migration State Machine
 *
 * Handles first-time migration of local data to cloud after authentication.
 * Creates backup snapshots, handles retries, and preserves unsaved state.
 * Survives page refresh, network interruption, and expired sessions.
 */

import type {
  MigrationState,
  SyncSleepRecord,
  SyncReflection,
  MigrationMetadata,
} from "./sync-types";
import { getSyncClient } from "./sync-client";

const MIGRATION_STORAGE_KEY = "somna:migration-state";

// =============================================================================
// Storage
// =============================================================================

interface MigrationStorage {
  version: "1";
  migration: MigrationMetadata;
  snapshots: Array<{
    id: string;
    createdAt: string;
    sleepRecords: SyncSleepRecord[];
    reflections: SyncReflection[];
  }>;
}

function loadMigrationState(): MigrationStorage {
  try {
    const raw = localStorage.getItem(MIGRATION_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as MigrationStorage;
    }
  } catch {
    // Ignore parse errors
  }
  return {
    version: "1",
    migration: {
      state: "idle",
      totalRecords: 0,
      migratedRecords: 0,
      failedRecords: [],
    },
    snapshots: [],
  };
}

function saveMigrationState(storage: MigrationStorage): void {
  try {
    localStorage.setItem(MIGRATION_STORAGE_KEY, JSON.stringify(storage));
  } catch {
    // Ignore storage errors
  }
}

// =============================================================================
// Migration State Machine
// =============================================================================

export function getMigrationState(): MigrationMetadata {
  const storage = loadMigrationState();
  return storage.migration;
}

export function updateMigrationState(updates: Partial<MigrationMetadata>): void {
  const storage = loadMigrationState();
  storage.migration = { ...storage.migration, ...updates };
  saveMigrationState(storage);

  // Dispatch event for UI
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("migration-state-change", { detail: storage.migration }));
  }
}

// =============================================================================
// Migration Execution
// =============================================================================

export async function startMigration(): Promise<MigrationMetadata> {
  const state = getMigrationState();

  // If already completed or in progress, return current state
  if (state.state === "completed" || state.state === "uploading" || state.state === "merging") {
    return state;
  }

  // Create backup snapshot before starting
  const snapshot = await createSnapshot();

  updateMigrationState({
    state: "preparing",
    startedAt: new Date().toISOString(),
    totalRecords: snapshot.sleepRecords.length + snapshot.reflections.length,
    migratedRecords: 0,
    failedRecords: [],
    snapshotBackupId: snapshot.id,
  });

  try {
    // Proceed to upload
    updateMigrationState({ state: "uploading" });

    // Perform sync — this will migrate all local data
    const syncClient = getSyncClient();
    const result = await syncClient.sync();

    if (!result.success) {
      throw new Error(result.error || "Migration sync failed");
    }

    // Merge state (conflicts handled by sync service)
    updateMigrationState({ state: "merging" });

    // Mark as complete
    updateMigrationState({
      state: "completed",
      completedAt: new Date().toISOString(),
      migratedRecords: state.totalRecords,
    });
  } catch (error) {
    updateMigrationState({
      state: "failed",
      lastError: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return getMigrationState();
}

export async function retryMigration(): Promise<MigrationMetadata> {
  // Reset to idle and start fresh
  const current = getMigrationState();

  updateMigrationState({
    state: "idle",
    startedAt: undefined,
    completedAt: undefined,
    lastError: undefined,
    failedRecords: [],
  });

  return startMigration();
}

// =============================================================================
// Snapshot Management
// =============================================================================

export async function createSnapshot(): Promise<{
  id: string;
  createdAt: string;
  sleepRecords: SyncSleepRecord[];
  reflections: SyncReflection[];
}> {
  const storage = loadMigrationState();

  // Load current local data
  let sleepRecords: SyncSleepRecord[] = [];
  let reflections: SyncReflection[] = [];

  try {
    const rawSleep = localStorage.getItem("sleepRecords");
    if (rawSleep) {
      sleepRecords = JSON.parse(rawSleep) as SyncSleepRecord[];
    }
  } catch {
    // Ignore
  }

  try {
    const rawReflections = localStorage.getItem("reflections");
    if (rawReflections) {
      const parsed = JSON.parse(rawReflections) as { reflections?: SyncReflection[] };
      reflections = parsed.reflections || [];
    }
  } catch {
    // Ignore
  }

  const snapshot = {
    id: `snapshot_${Date.now()}`,
    createdAt: new Date().toISOString(),
    sleepRecords,
    reflections,
  };

  // Keep only last 3 snapshots
  storage.snapshots = [snapshot, ...storage.snapshots].slice(0, 3);
  saveMigrationState(storage);

  return snapshot;
}

export function getSnapshots(): MigrationStorage["snapshots"] {
  return loadMigrationState().snapshots;
}

export async function restoreFromSnapshot(snapshotId: string): Promise<boolean> {
  const storage = loadMigrationState();
  const snapshot = storage.snapshots.find((s) => s.id === snapshotId);

  if (!snapshot) return false;

  try {
    localStorage.setItem("sleepRecords", JSON.stringify(snapshot.sleepRecords));
    localStorage.setItem(
      "reflections",
      JSON.stringify({
        version: "1",
        reflections: snapshot.reflections,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

// =============================================================================
// Migration Check
// =============================================================================

export function needsMigration(): boolean {
  const state = getMigrationState();

  // Already completed
  if (state.state === "completed") return false;

  // Check if there's local data that needs migration
  const hasSleepRecords = hasLocalSleepRecords();
  const hasReflections = hasLocalReflections();

  return hasSleepRecords || hasReflections;
}

function hasLocalSleepRecords(): boolean {
  try {
    const raw = localStorage.getItem("sleepRecords");
    if (!raw) return false;
    const records = JSON.parse(raw) as unknown[];
    return records.length > 0;
  } catch {
    return false;
  }
}

function hasLocalReflections(): boolean {
  try {
    const raw = localStorage.getItem("reflections");
    if (!raw) return false;
    const storage = JSON.parse(raw) as { reflections?: unknown[] };
    return (storage.reflections?.length || 0) > 0;
  } catch {
    return false;
  }
}

// =============================================================================
// Auto-Resume
// =============================================================================

export function resumeMigrationIfNeeded(): void {
  const state = getMigrationState();

  // If migration was interrupted, resume it
  if (state.state === "uploading" || state.state === "merging") {
    // Reset to failed state and let user retry
    // We don't auto-resume in case session expired
    updateMigrationState({
      state: "failed",
      lastError: "Migration interrupted — please retry",
    });
  }
}
