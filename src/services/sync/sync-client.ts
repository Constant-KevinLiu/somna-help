/**
 * Sleep Diary v2.3 — Sync Client Service
 *
 * Client-side sync orchestrator for authenticated users.
 * Handles local data preparation, API communication, and local cache updates.
 * Integrates with offline queue for retry handling.
 */

import type {
  SyncRequest,
  SyncResponse,
  SyncStatus,
  SyncSleepRecord,
  SyncReflection,
  SyncReminderSettings,
  SyncStatusInfo,
  SyncStatusDisplay,
  CanonicalReflection,
} from "./sync-types";
import {
  enqueueSyncOperation,
  getQueueStatus,
  processBatchResults,
  getBatchForSync,
} from "./sync-queue";
import { isBrowser, safeLocalStorageGet, safeLocalStorageSet } from "@/lib/safe-storage";
// Canonical reflection repository (single source of truth)
import {
  loadSyncReflections,
  mergeSyncReflections,
  markReflectionsSynced,
  setLastSyncedAt,
  getLastSyncedAt,
  handleSignInSync,
  handleSignOut as handleReflectionSignOut,
} from "@/lib/reflection/reflection-storage";
// Program progress sync integration (Phase G-0.1)
import {
  toSyncProgress,
  fromCanonicalProgress,
  mergeLocalAndRemoteProgress,
  type SyncProgramProgress,
  type CanonicalProgramProgress,
} from "@/lib/program/sync-contracts";
import {
  loadProgramProgress,
  saveProgramProgress,
  isUnsupportedSchema,
} from "@/lib/program/storage";
import { getProgramDefinition } from "@/lib/program/definition";

// =============================================================================
// Types
// =============================================================================

interface SyncClientConfig {
  apiBaseUrl?: string;
  clientId: string;
}

interface SyncResult {
  success: boolean;
  conflicts?: SyncResponse["conflicts"];
  error?: string;
}

// =============================================================================
// State
// =============================================================================

let currentStatus: SyncStatusDisplay = "local-only";
let lastSyncedAt: string | undefined;
let currentSyncPromise: Promise<SyncResult> | null = null;

// Initialize lastSyncedAt from canonical reflection storage
if (isBrowser()) {
  try {
    lastSyncedAt = getLastSyncedAt();
  } catch {
    // ignore
  }
}

// =============================================================================
// Sync Client
// =============================================================================

export class SyncClient {
  private config: SyncClientConfig;
  private authenticated: boolean = false;

  constructor(config: SyncClientConfig) {
    this.config = {
      apiBaseUrl: "/api",
      ...config,
    };
  }

  /**
   * Mark the client as authenticated (called when session cookie is active).
   * Authentication uses HttpOnly cookies — no token stored in JS.
   */
  setAuthenticated(value: boolean): void {
    this.authenticated = value;
  }

  /**
   * @deprecated Use setAuthenticated() instead.
   * Kept for backward compatibility with older code.
   */
  setSessionToken(_token: string | null): void {
    // Auth is cookie-based — this is a no-op
    this.authenticated = _token !== null;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  // ===========================================================================
  // Sign-in / Sign-out hooks (bridge between auth and canonical storage)
  // ===========================================================================

  /**
   * Handle user sign-in: merge server state with local data.
   *
   * Requirements:
   * - Signing in must not erase local reflections.
   * - Local-only data is preserved and marked "pending" for upload.
   * - Server data is merged deterministically (no duplicates).
   *
   * Call this after the session cookie is set and the first sync/restore completes.
   */
  handleSignIn(serverReflections: CanonicalReflection[]): void {
    if (!isBrowser()) return;
    handleSignInSync(serverReflections);
  }

  /**
   * Handle user sign-out: preserve local data, clear sync status.
   *
   * Requirements:
   * - Signing out must not erase local-only data.
   * - "synced" becomes "local" (user is anonymous again).
   * - Drafts, quarantined records, and migration markers are all preserved.
   */
  handleSignOut(): void {
    if (!isBrowser()) return;
    handleReflectionSignOut();
    this.authenticated = false;
    lastSyncedAt = undefined;
    updateStatus("local-only");
  }

  // ===========================================================================
  // Main Sync Operation
  // ===========================================================================

  async sync(): Promise<SyncResult> {
    if (!this.isAuthenticated()) {
      return { success: false, error: "Not authenticated" };
    }

    if (currentSyncPromise) {
      return currentSyncPromise;
    }

    updateStatus("syncing");

    currentSyncPromise = this.performSync()
      .then((result) => {
        if (result.success) {
          updateStatus("synced");
          lastSyncedAt = new Date().toISOString();
        } else {
          updateStatus("sync-failed");
        }
        return result;
      })
      .catch((error) => {
        updateStatus("sync-failed");
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
      })
      .finally(() => {
        currentSyncPromise = null;
      });

    return currentSyncPromise;
  }

  private async performSync(): Promise<SyncResult> {
    try {
      // Build sync request from local data
      const request = await this.buildSyncRequest();

      // Check connectivity
      if (!navigator.onLine) {
        // Queue for later
        this.queueLocalData(request);
        updateStatus("offline");
        return { success: true }; // Considered successful for now — will retry
      }

      // Send sync request
      const response = await fetch(`${this.config.apiBaseUrl}/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": request.syncId,
        },
        body: JSON.stringify(request),
        credentials: "include",
      });

      if (response.status === 401) {
        // Session expired or not authenticated — update state
        this.authenticated = false;
        updateStatus("offline");
        return { success: false, error: "Not authenticated" };
      }

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }

      const result = (await response.json()) as SyncResponse;

      // Update local cache with canonical server state
      await this.applyServerState(result);

      // Clear successfully synced items from the offline queue
      // (all upsert items are covered by the full sync; deletes confirmed by server)
      if (isBrowser()) {
        const batch = getBatchForSync(100);
        const successResults = batch.map((item) => ({
          itemId: item.id,
          success: true,
        }));
        processBatchResults(successResults);
      }

      return {
        success: true,
        conflicts: result.conflicts,
      };
    } catch (error) {
      console.error("Sync error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // ===========================================================================
  // Restore (New Device)
  // ===========================================================================

  async restore(): Promise<SyncResult> {
    if (!this.isAuthenticated()) {
      return { success: false, error: "Not authenticated" };
    }

    updateStatus("syncing");

    try {
      const response = await fetch(`${this.config.apiBaseUrl}/sync/restore`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Restore failed: ${response.status}`);
      }

      const result = (await response.json()) as SyncResponse;

      // Apply full server state to local cache
      await this.applyServerState(result);

      updateStatus("synced");
      lastSyncedAt = new Date().toISOString();

      return { success: true };
    } catch (error) {
      updateStatus("sync-failed");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // ===========================================================================
  // Helpers
  // ===========================================================================

  private async buildSyncRequest(): Promise<SyncRequest> {
    // Load local data
    const sleepRecords = await this.loadLocalSleepRecords();
    const reflections = await this.loadLocalReflections();
    const reminderSettings = await this.loadLocalReminderSettings();
    const programProgress = this.loadLocalProgramProgress();

    // Collect pending delete operations from the queue
    const queue = getQueueStatus();
    const pendingDeletes =
      queue.failedCount + queue.pendingCount > 0
        ? getBatchForSync(50).filter((item) => item.operation === "delete")
        : [];

    const deletedIds: SyncRequest["deletedIds"] = {
      sleepRecords: pendingDeletes
        .filter((item) => item.entityType === "sleep-record")
        .map((item) => item.entityId),
      reflections: pendingDeletes
        .filter((item) => item.entityType === "reflection")
        .map((item) => item.entityId),
    };

    return {
      clientId: this.config.clientId,
      syncId: `sync_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      lastSyncAt: lastSyncedAt,
      sleepRecords,
      reflections,
      reminderSettings,
      programProgress,
      deletedIds,
    };
  }

  private queueLocalData(request: SyncRequest): void {
    // Queue sleep records
    for (const record of request.sleepRecords) {
      enqueueSyncOperation("sleep-record", record.id, "upsert", record);
    }

    // Queue reflections
    for (const reflection of request.reflections) {
      enqueueSyncOperation("reflection", reflection.id, "upsert", reflection);
    }

    // Queue reminder settings
    if (request.reminderSettings) {
      enqueueSyncOperation("reminder", "settings", "upsert", request.reminderSettings);
    }

    // Queue program progress
    if (request.programProgress) {
      enqueueSyncOperation("progress", "cbti-core", "upsert", request.programProgress);
    }
  }

  private async applyServerState(response: SyncResponse): Promise<void> {
    // Update sleep records
    await this.saveSleepRecordsToLocal(response.sleepRecords);

    // Update reflections via canonical repository
    await this.saveReflectionsToLocal(response.reflections);

    // Update reminder settings
    if (response.reminderSettings) {
      await this.saveReminderSettingsToLocal(response.reminderSettings);
    }

    // Update program progress
    if (response.programProgress) {
      this.saveProgramProgressToLocal(response.programProgress);
    }

    // Update sync timestamp (both in-memory and in canonical storage)
    lastSyncedAt = response.lastSyncedAt;
    if (isBrowser()) {
      setLastSyncedAt(response.lastSyncedAt);
    }

    // Notify UI components that storage has changed (Timeline, stats, etc.)
    if (isBrowser()) {
      window.dispatchEvent(new CustomEvent("reflection-storage-change"));
    }
  }

  // ===========================================================================
  // Local Storage Integration
  // ===========================================================================

  private async loadLocalSleepRecords(): Promise<SyncSleepRecord[]> {
    if (!isBrowser()) return [];
    const records = safeLocalStorageGet<Array<Record<string, unknown>>>("sleepRecords", []);
    return records.map((r) => ({
      ...r,
      syncStatus: (r.syncStatus as SyncStatus) || "local",
    })) as SyncSleepRecord[];
  }

  private async loadLocalReflections(): Promise<SyncReflection[]> {
    if (!isBrowser()) return [];
    // Use canonical reflection repository as single source of truth.
    // Drafts are NEVER included — only committed history.
    const reflections = loadSyncReflections();
    return reflections as SyncReflection[];
  }

  private async loadLocalReminderSettings(): Promise<SyncReminderSettings | undefined> {
    if (!isBrowser()) return undefined;
    return safeLocalStorageGet<SyncReminderSettings | undefined>("reminderSettings", undefined);
  }

  private async saveSleepRecordsToLocal(records: SyncSleepRecord[]): Promise<void> {
    safeLocalStorageSet("sleepRecords", records);
  }

  private async saveReflectionsToLocal(reflections: CanonicalReflection[]): Promise<void> {
    if (!isBrowser()) return;
    // Merge server state into canonical repository (deterministic, no duplicates).
    // This is the only path that sets syncStatus to "synced" — never before
    // server acknowledgement.
    const beforeCount = loadSyncReflections().length;
    const merged = mergeSyncReflections(reflections);
    const afterCount = merged.length;

    // Count by status for structured logging
    const syncedCount = merged.filter((r) => r.syncStatus === "synced").length;
    const pendingCount = merged.filter((r) => r.syncStatus === "pending").length;
    const conflictCount = merged.filter((r) => r.syncStatus === "conflict").length;
    const localCount = merged.filter((r) => r.syncStatus === "local").length;

    // Mark successfully synced IDs
    const syncedIds = merged.filter((r) => r.syncStatus === "synced").map((r) => r.id);
    if (syncedIds.length > 0) {
      markReflectionsSynced(syncedIds);
    }

    // Sanitized structured log — no content, only counts and statuses
    console.log(
      JSON.stringify({
        source: "sync-client",
        event: "reflection_merge_completed",
        serverRecordCount: reflections.length,
        localBeforeCount: beforeCount,
        localAfterCount: afterCount,
        insertedCount: Math.max(0, afterCount - beforeCount),
        syncedCount,
        pendingCount,
        conflictCount,
        localCount,
      }),
    );
  }

  private async saveReminderSettingsToLocal(settings: SyncReminderSettings): Promise<void> {
    safeLocalStorageSet("reminderSettings", settings);
  }

  // =========================================================================
  // Program Progress Sync (Phase G-0.1)
  // =========================================================================

  /**
   * Load local program progress and convert to sync format.
   * Returns null if there is no progress to sync (not_started with no data).
   * Respects forward-schema guard: if local data has a future schema,
   * we still send it as-is so the server has the latest version,
   * but we don't let server state overwrite it on the way back.
   */
  private loadLocalProgramProgress(): SyncProgramProgress | undefined {
    if (!isBrowser()) return undefined;

    const definition = getProgramDefinition();
    const loaded = loadProgramProgress(definition);

    if (isUnsupportedSchema(loaded)) {
      // Forward-schema guard: we have data from a newer version of the app.
      // Don't include it in the sync payload — we don't understand it
      // and can't reliably serialize it. The server's copy is preserved.
      return undefined;
    }

    // Don't sync empty/not-started progress (no meaningful data)
    if (loaded.status === "not_started" && loaded.completedLessonIds.length === 0) {
      return undefined;
    }

    const entityId = `prog_${loaded.programId}`;
    return toSyncProgress(loaded, entityId, {
      clientId: this.config.clientId,
      syncStatus: "pending",
    });
  }

  /**
   * Apply server-side program progress to local storage.
   * Uses the merge strategy from sync-contracts:
   *   - completed lessons: set union (never undoes completions)
   *   - status: most-advanced wins
   *   - milestones: union
   *
   * Respects forward-schema guard: if local data has a future schema version
   * we don't understand, we do NOT overwrite it with server state.
   */
  private saveProgramProgressToLocal(canonical: CanonicalProgramProgress): void {
    if (!isBrowser()) return;

    const definition = getProgramDefinition();
    const local = loadProgramProgress(definition);

    // Forward-schema guard: if local data is newer than what we support,
    // never overwrite it with server state (which we do understand).
    if (isUnsupportedSchema(local)) {
      return;
    }

    const remote = fromCanonicalProgress(canonical);
    const merged = mergeLocalAndRemoteProgress(local, remote);
    saveProgramProgress(merged);
  }
}

// =============================================================================
// Status Management
// =============================================================================

export function getSyncStatus(): SyncStatusInfo {
  const queue = getQueueStatus();

  // Determine overall status
  let status: SyncStatusDisplay = "local-only";

  if (isBrowser() && !navigator.onLine) {
    status = "offline";
  } else if (currentStatus === "syncing") {
    status = "syncing";
  } else if (queue.failedCount > 0) {
    status = "needs-attention";
  } else if (queue.pendingCount > 0) {
    status = "syncing";
  } else if (currentStatus === "synced" && lastSyncedAt) {
    status = "synced";
  }

  return {
    status,
    lastSyncedAt,
    pendingCount: queue.pendingCount,
    conflictCount: 0, // Would come from conflict tracking
  };
}

export function updateStatus(status: SyncStatusDisplay): void {
  currentStatus = status;
  // Dispatch event for UI components
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent("sync-status-change", { detail: getSyncStatus() }));
  }
}

// =============================================================================
// Offline Queue Processing
// =============================================================================

export async function processSyncQueue(syncClient: SyncClient): Promise<void> {
  if (!syncClient.isAuthenticated() || (isBrowser() && !navigator.onLine)) {
    return;
  }

  // Process one sync at a time
  if (currentSyncPromise) return;

  // Trigger full sync — queue items will be included in next sync
  await syncClient.sync();
}

// =============================================================================
// Default Instance
// =============================================================================

let syncClientInstance: SyncClient | null = null;

export function getSyncClient(): SyncClient {
  if (!syncClientInstance) {
    // Generate stable client ID
    let clientId = safeLocalStorageGet<string | null>("clientId", null);
    if (!clientId) {
      clientId = `client_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      safeLocalStorageSet("clientId", clientId);
    }

    syncClientInstance = new SyncClient({ clientId });
  }

  return syncClientInstance;
}

// Set up online/offline listeners
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    updateStatus("syncing");
    // Auto-sync when coming back online
    setTimeout(() => getSyncClient().sync(), 1000);
  });

  window.addEventListener("offline", () => {
    updateStatus("offline");
  });
}
