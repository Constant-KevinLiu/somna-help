/**
 * Sleep Diary v2.3 — Sync Queue for Offline Operations
 *
 * Local queue for retry handling when offline or network fails.
 * Implements bounded exponential backoff strategy.
 */

import type { SyncQueueItem, SyncQueueStorage, EntityType } from "./sync-types";
import { isBrowser, safeLocalStorageGet, safeLocalStorageSet } from "@/lib/safe-storage";

const QUEUE_STORAGE_KEY = "somna:sync-queue";
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 5000; // 5 seconds

// =============================================================================
// Queue Storage
// =============================================================================

function loadQueue(): SyncQueueStorage {
  if (!isBrowser()) return { version: "1", items: [] };
  return safeLocalStorageGet<SyncQueueStorage>(QUEUE_STORAGE_KEY, { version: "1", items: [] });
}

function saveQueue(storage: SyncQueueStorage): void {
  safeLocalStorageSet(QUEUE_STORAGE_KEY, storage);
}

// =============================================================================
// Queue Operations
// =============================================================================

export function enqueueSyncOperation(
  entityType: EntityType,
  entityId: string,
  operation: "upsert" | "delete",
  payload: unknown
): void {
  const storage = loadQueue();

  // Remove existing queued item for the same entity
  storage.items = storage.items.filter(
    (item) => !(item.entityType === entityType && item.entityId === entityId)
  );

  const item: SyncQueueItem = {
    id: `queue_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    entityType,
    entityId,
    operation,
    payload,
    createdAt: new Date().toISOString(),
    retryCount: 0,
  };

  storage.items.push(item);
  saveQueue(storage);
}

export function dequeueForProcessing(): SyncQueueItem[] {
  const storage = loadQueue();
  const now = Date.now();

  const readyItems = storage.items.filter((item) => {
    if (!item.nextRetryAt) return true;
    return new Date(item.nextRetryAt).getTime() <= now;
  });

  return readyItems.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function markItemProcessed(itemId: string): void {
  const storage = loadQueue();
  storage.items = storage.items.filter((item) => item.id !== itemId);
  saveQueue(storage);
}

export function markItemFailed(itemId: string, error: string): void {
  const storage = loadQueue();
  const item = storage.items.find((i) => i.id === itemId);

  if (!item) return;

  item.retryCount += 1;
  item.error = error;

  if (item.retryCount >= MAX_RETRIES) {
    // Max retries reached — keep item but stop automatic retries
    // User can manually retry
    item.nextRetryAt = undefined;
  } else {
    // Exponential backoff: 5s, 30s, 2m, 10m, ...
    const delay = BASE_DELAY_MS * Math.pow(6, item.retryCount - 1);
    item.nextRetryAt = new Date(Date.now() + delay).toISOString();
  }

  saveQueue(storage);
}

export function retryItemManually(itemId: string): void {
  const storage = loadQueue();
  const item = storage.items.find((i) => i.id === itemId);

  if (!item) return;

  // Reset retry count and schedule for immediate retry
  item.retryCount = 0;
  item.nextRetryAt = new Date().toISOString();
  item.error = undefined;

  saveQueue(storage);
}

export function removeItemFromQueue(itemId: string): void {
  markItemProcessed(itemId);
}

// =============================================================================
// Queue Status
// =============================================================================

export function getQueueStatus(): {
  pendingCount: number;
  failedCount: number;
  totalCount: number;
  nextRetryAt?: string;
} {
  const storage = loadQueue();
  const now = Date.now();

  let pendingCount = 0;
  let failedCount = 0;
  let nextRetryAt: string | undefined;

  for (const item of storage.items) {
    if (item.error) {
      failedCount++;
    } else if (!item.nextRetryAt || new Date(item.nextRetryAt).getTime() <= now) {
      pendingCount++;
    }

    if (item.nextRetryAt) {
      const retryTime = new Date(item.nextRetryAt).getTime();
      if (!nextRetryAt || retryTime < new Date(nextRetryAt).getTime()) {
        nextRetryAt = item.nextRetryAt;
      }
    }
  }

  return {
    pendingCount,
    failedCount,
    totalCount: storage.items.length,
    nextRetryAt,
  };
}

export function getFailedItems(): SyncQueueItem[] {
  const storage = loadQueue();
  return storage.items.filter((item) => item.error !== undefined);
}

export function clearQueue(): void {
  saveQueue({ version: "1", items: [], lastProcessedAt: new Date().toISOString() });
}

// =============================================================================
// Batch Processing
// =============================================================================

export function getBatchForSync(limit: number = 20): SyncQueueItem[] {
  const items = dequeueForProcessing();
  return items.slice(0, limit);
}

export function processBatchResults(
  results: Array<{ itemId: string; success: boolean; error?: string }>
): void {
  for (const result of results) {
    if (result.success) {
      markItemProcessed(result.itemId);
    } else {
      markItemFailed(result.itemId, result.error || "unknown error");
    }
  }
}
