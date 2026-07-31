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
} from "./sync-types";
import { enqueueSyncOperation, getQueueStatus, processBatchResults } from "./sync-queue";
import { isBrowser, safeLocalStorageGet, safeLocalStorageSet } from "@/lib/safe-storage";
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

let currentStatus: SyncStatusDisplay = "synced";
let lastSyncedAt: string | undefined;
let currentSyncPromise: Promise<SyncResult> | null = null;

// =============================================================================
// Sync Client
// =============================================================================

export class SyncClient {
  private config: SyncClientConfig;
  private sessionToken: string | null = null;

  constructor(config: SyncClientConfig) {
    this.config = {
      apiBaseUrl: "/api",
      ...config,
    };
  }

  setSessionToken(token: string | null): void {
    this.sessionToken = token;
  }

  isAuthenticated(): boolean {
    return this.sessionToken !== null;
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

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }

      const result = (await response.json()) as SyncResponse;

      // Update local cache with canonical server state
      await this.applyServerState(result);

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

    return {
      clientId: this.config.clientId,
      syncId: `sync_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      lastSyncAt: lastSyncedAt,
      sleepRecords,
      reflections,
      reminderSettings,
      programProgress,
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

    // Update reflections
    await this.saveReflectionsToLocal(response.reflections);

    // Update reminder settings
    if (response.reminderSettings) {
      await this.saveReminderSettingsToLocal(response.reminderSettings);
    }

    // Update program progress
    if (response.programProgress) {
      this.saveProgramProgressToLocal(response.programProgress);
    }

    // Update sync timestamp
    lastSyncedAt = response.lastSyncedAt;
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
    const storage = safeLocalStorageGet<{ reflections?: Array<Record<string, unknown>> }>("reflections", {});
    return (storage.reflections || []).map((r) => ({
      ...r,
      syncStatus: (r.syncStatus as SyncStatus) || "local",
    })) as SyncReflection[];
  }

  private async loadLocalReminderSettings(): Promise<SyncReminderSettings | undefined> {
    if (!isBrowser()) return undefined;
    return safeLocalStorageGet<SyncReminderSettings | undefined>("reminderSettings", undefined);
  }

  private async saveSleepRecordsToLocal(records: SyncSleepRecord[]): Promise<void> {
    safeLocalStorageSet("sleepRecords", records);
  }

  private async saveReflectionsToLocal(reflections: SyncReflection[]): Promise<void> {
    safeLocalStorageSet("reflections", {
      version: "1",
      reflections,
      lastSyncedAt,
    });
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
  let status: SyncStatusDisplay = "synced";

  if (isBrowser() && !navigator.onLine) {
    status = "offline";
  } else if (currentStatus === "syncing") {
    status = "syncing";
  } else if (queue.failedCount > 0) {
    status = "needs-attention";
  } else if (queue.pendingCount > 0) {
    status = "syncing";
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
