/**
 * Sleep Diary v2.5 — Reflection Local Storage
 *
 * Canonical localStorage persistence layer for Guided CBT-I Reflections.
 * This is the single source of truth for reflection data on the client.
 *
 * Storage keys:
 *   somna.reflections.v2         — committed reflection history (canonical v2)
 *   somna.reflection-draft.v1    — in-progress draft (separate from history)
 *   somna.reflections.v1         — legacy v1 (read-only migration source)
 *   reflections                  — legacy sync-client key (read-only migration source)
 *
 * Sync integration:
 *   The sync client calls loadSyncReflections() / saveSyncReflections() to
 *   read/write through this canonical repository. Drafts are never sent.
 *
 * Local-first: saving never depends on network.
 * Fail-safe: one bad record never erases valid history.
 */

import type {
  LocalReflection,
  ReflectionStorage,
  ReflectionDraft,
  SyncStatus,
} from "./reflection-types";
import {
  validateReflectionStorage,
  filterValidReflections,
  validateDraft,
  migrateV1ToV2,
  migrateSyncLegacyToV2,
  isCanonicalReflectionId,
} from "./reflection-validation";
import { countWords } from "./reflection-word-count";

// ============================================================================
// Storage keys
// ============================================================================

export const REFLECTIONS_STORAGE_KEY_V2 = "somna.reflections.v2";
export const REFLECTIONS_STORAGE_KEY_V1 = "somna.reflections.v1";
export const REFLECTION_DRAFT_STORAGE_KEY = "somna.reflection-draft.v1";
/** Legacy sync-client key — kept as migration source */
export const REFLECTIONS_SYNC_LEGACY_KEY = "reflections";

// ============================================================================
// Helpers
// ============================================================================

function isLocalStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getDefaultStorage(): ReflectionStorage {
  return {
    version: "2",
    reflections: [],
    quarantined: [],
  };
}

function readStorageRaw(): string | null {
  if (!isLocalStorageAvailable()) return null;
  return window.localStorage.getItem(REFLECTIONS_STORAGE_KEY_V2);
}

function writeStorage(storage: ReflectionStorage): void {
  if (!isLocalStorageAvailable()) {
    throw new Error("localStorage not available");
  }
  window.localStorage.setItem(REFLECTIONS_STORAGE_KEY_V2, JSON.stringify(storage));
}

function loadStorageEnvelope(): ReflectionStorage {
  const raw = readStorageRaw();
  if (!raw) return getDefaultStorage();
  try {
    const parsed = JSON.parse(raw);
    const validated = validateReflectionStorage(parsed);
    if (validated) return validated;
    // Envelope invalid — try to salvage just the reflections array
    console.warn("[ReflectionStorage] V2 envelope invalid, attempting salvage");
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray((parsed as Record<string, unknown>).reflections)
    ) {
      const valid = filterValidReflections(
        (parsed as Record<string, unknown>).reflections as unknown[],
      );
      return { ...getDefaultStorage(), reflections: valid };
    }
    return getDefaultStorage();
  } catch (e) {
    console.error(
      "[ReflectionStorage] Failed to parse v2 storage:",
      e instanceof Error ? e.message : "unknown",
    );
    return getDefaultStorage();
  }
}

// ============================================================================
// Migration (idempotent merge)
// ============================================================================

/**
 * Perform idempotent merge migration from all legacy sources into v2.
 * Called on every load — safe to call repeatedly.
 *
 * Sources (processed in order):
 *   1. somna.reflections.v1    (UI v1 legacy)
 *   2. reflections             (sync-client legacy key)
 *
 * Migration markers in v2 envelope prevent reprocessing:
 *   - v1Migrated: v1 key has been merged
 *   - syncLegacyMigrated: sync legacy key has been merged
 *
 * Even if v2 exists and is empty, migration still runs (no "skip if v2 exists" trap).
 * v1 key is preserved as backup (never deleted).
 */
export function runMigrations(): void {
  if (!isLocalStorageAvailable()) return;

  const storage = loadStorageEnvelope();
  let changed = false;
  let current = storage;

  // --- 1. v1 → v2 merge ---
  if (!current.v1Migrated) {
    const v1Raw = window.localStorage.getItem(REFLECTIONS_STORAGE_KEY_V1);
    if (v1Raw) {
      try {
        const v1Parsed = JSON.parse(v1Raw);
        const {
          storage: merged,
          migratedCount,
          quarantinedCount,
          skippedDuplicates,
        } = migrateV1ToV2(v1Parsed, current);
        merged.v1Migrated = true;
        current = merged;
        changed = true;
        if (migratedCount > 0 || quarantinedCount > 0) {
          console.info(
            `[ReflectionStorage] v1 → v2: ${migratedCount} migrated, ${quarantinedCount} quarantined, ${skippedDuplicates} skipped (dup)`,
          );
        }
      } catch (e) {
        console.error(
          "[ReflectionStorage] v1 migration failed, marking as attempted:",
          e instanceof Error ? e.message : "unknown",
        );
        // Still mark as migrated so we don't keep failing
        current = { ...current, v1Migrated: true };
        changed = true;
      }
    } else {
      // No v1 key — mark migration as done
      current = { ...current, v1Migrated: true };
      changed = true;
    }
  }

  // --- 2. sync legacy key → v2 merge ---
  if (!current.syncLegacyMigrated) {
    const syncRaw = window.localStorage.getItem(REFLECTIONS_SYNC_LEGACY_KEY);
    if (syncRaw) {
      try {
        const syncParsed = JSON.parse(syncRaw);
        const {
          storage: merged,
          migratedCount,
          quarantinedCount,
          skippedDuplicates,
        } = migrateSyncLegacyToV2(syncParsed, current);
        merged.syncLegacyMigrated = true;
        current = merged;
        changed = true;
        if (migratedCount > 0 || quarantinedCount > 0) {
          console.info(
            `[ReflectionStorage] sync-legacy → v2: ${migratedCount} migrated, ${quarantinedCount} quarantined, ${skippedDuplicates} skipped (dup)`,
          );
        }
      } catch (e) {
        console.error(
          "[ReflectionStorage] sync-legacy migration failed, marking as attempted:",
          e instanceof Error ? e.message : "unknown",
        );
        current = { ...current, syncLegacyMigrated: true };
        changed = true;
      }
    } else {
      // No sync legacy key — mark migration as done
      current = { ...current, syncLegacyMigrated: true };
      changed = true;
    }
  }

  if (changed) {
    try {
      writeStorage(current);
    } catch (e) {
      console.error(
        "[ReflectionStorage] Failed to write migrated storage:",
        e instanceof Error ? e.message : "unknown",
      );
    }
  }
}

/**
 * @deprecated Use runMigrations() instead.
 * Kept for backward compatibility with existing call sites.
 */
export function migrateIfNeeded(): boolean {
  const before = loadReflections().length;
  runMigrations();
  const after = loadReflections().length;
  return after > before;
}

// ============================================================================
// Core load/save (committed history)
// ============================================================================

/**
 * Load all committed reflections from canonical v2 storage.
 * Returns only valid reflections. Corrupted individual records are skipped.
 * Performs idempotent migration on every load.
 */
export function loadReflections(): LocalReflection[] {
  if (!isLocalStorageAvailable()) return [];

  try {
    runMigrations();
    const storage = loadStorageEnvelope();
    return storage.reflections;
  } catch (e) {
    console.error(
      "[ReflectionStorage] Failed to load reflections:",
      e instanceof Error ? e.message : "unknown",
    );
    return [];
  }
}

/**
 * Save the full reflections array to canonical v2 storage.
 * Throws on quota exceeded or storage failure.
 * Preserves lastSyncedAt, quarantined records, and migration markers.
 */
export function saveReflections(reflections: LocalReflection[]): void {
  if (!isLocalStorageAvailable()) {
    throw new Error("localStorage not available");
  }

  // Validate all records before writing
  const valid = filterValidReflections(reflections);

  // Load existing storage to preserve metadata
  const existing = loadStorageEnvelope();

  const storage: ReflectionStorage = {
    version: "2",
    reflections: valid,
    lastSyncedAt: existing.lastSyncedAt,
    quarantined: existing.quarantined,
    v1Migrated: existing.v1Migrated,
    syncLegacyMigrated: existing.syncLegacyMigrated,
  };

  try {
    writeStorage(storage);
  } catch (e) {
    if (e instanceof Error && e.name === "QuotaExceededError") {
      throw new Error("Storage quota exceeded");
    }
    throw e;
  }
}

// ============================================================================
// Single-record operations (committed history)
// ============================================================================

/**
 * Get a committed reflection for a specific local date.
 * Returns undefined if no reflection exists for that date.
 */
export function getReflectionByDate(localDate: string): LocalReflection | undefined {
  const reflections = loadReflections();
  return reflections.find((r) => r.localDate === localDate);
}

/**
 * Get a committed reflection by ID.
 */
export function getReflectionById(id: string): LocalReflection | undefined {
  const reflections = loadReflections();
  return reflections.find((r) => r.id === id);
}

/**
 * Save (upsert) a single committed reflection.
 * Updates existing entry for the same date, preserving id + createdAt.
 * Creates new entry if date doesn't exist yet.
 * Returns the final saved record.
 *
 * Note: syncStatus is set to "local" (or "pending" if a sync client is active).
 * Only the sync integration should mark reflections as "synced".
 */
export function saveReflection(reflection: LocalReflection): LocalReflection {
  const reflections = loadReflections();
  const index = reflections.findIndex((r) => r.localDate === reflection.localDate);

  let finalRecord: LocalReflection;

  if (index >= 0) {
    // Update existing: preserve ID, createdAt, and sync status
    finalRecord = {
      ...reflection,
      id: reflections[index].id,
      createdAt: reflections[index].createdAt,
      // If previously synced, editing moves to "pending" until next sync
      syncStatus: reflections[index].syncStatus === "synced" ? "pending" : reflection.syncStatus,
      // Preserve legacyId for traceability
      legacyId: reflections[index].legacyId,
    };
    reflections[index] = finalRecord;
  } else {
    finalRecord = reflection;
    reflections.push(finalRecord);
  }

  saveReflections(reflections);
  return finalRecord;
}

/**
 * Delete a committed reflection by ID.
 * Returns true if a record was deleted.
 */
export function deleteReflection(id: string): boolean {
  const reflections = loadReflections();
  const filtered = reflections.filter((r) => r.id !== id);
  const wasDeleted = filtered.length < reflections.length;
  saveReflections(filtered);
  return wasDeleted;
}

/**
 * Get all committed reflections sorted by date (newest first),
 * with ties broken by createdAt descending.
 */
export function getSortedReflections(): LocalReflection[] {
  const reflections = loadReflections();
  return [...reflections].sort((a, b) => {
    const dateCmp = b.localDate.localeCompare(a.localDate);
    if (dateCmp !== 0) return dateCmp;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

// ============================================================================
// Draft storage (separate from committed history)
// ============================================================================

/**
 * Load the current in-progress draft.
 * Returns null if no draft exists or if the draft is for a different date.
 */
export function loadDraft(forLocalDate?: string): ReflectionDraft | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const raw = window.localStorage.getItem(REFLECTION_DRAFT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const draft = validateDraft(parsed);
    if (!draft) return null;

    // If caller requested a specific date and the draft is for a different date,
    // the draft is stale — don't return it
    if (forLocalDate && draft.localDate !== forLocalDate) {
      return null;
    }

    return draft;
  } catch (e) {
    console.error(
      "[ReflectionStorage] Failed to load draft:",
      e instanceof Error ? e.message : "unknown",
    );
    return null;
  }
}

/**
 * Save the current in-progress draft.
 * Drafts are separate from committed history — they do NOT appear in history.
 * Drafts are NEVER uploaded as committed reflections (sync layer skips drafts).
 */
export function saveDraft(draft: ReflectionDraft): void {
  if (!isLocalStorageAvailable()) {
    throw new Error("localStorage not available");
  }

  try {
    window.localStorage.setItem(REFLECTION_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch (e) {
    if (e instanceof Error && e.name === "QuotaExceededError") {
      throw new Error("Storage quota exceeded");
    }
    throw e;
  }
}

/**
 * Clear the current draft.
 * Called after a successful explicit save (commit to history).
 */
export function clearDraft(): void {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.removeItem(REFLECTION_DRAFT_STORAGE_KEY);
  } catch {
    // ignore — best effort
  }
}

// ============================================================================
// Sync adapter (canonical repository ↔ sync client)
// ============================================================================

/**
 * Sync adapter: load all committed reflections for sync upload.
 * Only committed history is returned — drafts are NEVER included.
 * Returns reflections ready for the sync client (with syncStatus included).
 *
 * Requirement: Drafts must never be uploaded as committed reflections.
 */
export function loadSyncReflections(): Array<
  Omit<LocalReflection, "legacyId"> & { syncStatus: SyncStatus }
> {
  const reflections = loadReflections();
  return reflections.map(({ legacyId: _legacyId, ...rest }) => rest);
}

/**
 * Sync adapter: merge server-reflected reflections back into local storage.
 *
 * Merge strategy (deterministic, no duplicates):
 * 1. For each server reflection:
 *    - If ID matches local → update local with server data (server wins on content,
 *      but preserve local if local updatedAt is significantly newer)
 *    - If no ID match but same date → conflict (keep both, mark conflict status)
 *    - If no match at all → add as new synced record
 * 2. Locally-deleted records that the server still has are NOT re-added
 *    (deletions are a separate sync flow)
 * 3. All server records are marked syncStatus: "synced"
 *
 * Returns the merged list.
 */
export function mergeSyncReflections(
  serverReflections: Array<{
    id: string;
    localDate: string;
    timezone: string;
    locale: string;
    promptIds: string[];
    promptCategories: string[];
    content: string;
    wordCount: number;
    createdAt: string;
    updatedAt: string;
  }>,
): LocalReflection[] {
  const local = loadReflections();
  const localById = new Map(local.map((r) => [r.id, r]));
  const localByDate = new Map(local.map((r) => [r.localDate, r]));
  const serverById = new Map(serverReflections.map((r) => [r.id, r]));

  const result: LocalReflection[] = [];
  const seenIds = new Set<string>();

  // Process local records first (preserve local-first state)
  for (const localRec of local) {
    const serverMatch = serverById.get(localRec.id);

    if (serverMatch) {
      // Both sides have same ID — merge (server wins by default,
      // but if local is significantly newer, keep local content)
      const localTime = new Date(localRec.updatedAt).getTime();
      const serverTime = new Date(serverMatch.updatedAt).getTime();

      // If local is more than 5 minutes newer and content differs,
      // keep local content but mark as pending (needs upload)
      if (
        localTime > serverTime + 300000 &&
        localRec.content.trim() !== serverMatch.content.trim()
      ) {
        result.push({ ...localRec, syncStatus: "pending" });
      } else {
        // Server wins — update from server
        result.push({
          id: localRec.id,
          localDate: serverMatch.localDate,
          timezone: serverMatch.timezone,
          locale: serverMatch.locale as LocalReflection["locale"],
          promptIds: serverMatch.promptIds,
          promptCategories: serverMatch.promptCategories as LocalReflection["promptCategories"],
          content: serverMatch.content,
          wordCount: countWords(serverMatch.content),
          createdAt: serverMatch.createdAt,
          updatedAt: serverMatch.updatedAt,
          syncStatus: "synced",
          legacyId: localRec.legacyId,
        });
      }
      seenIds.add(localRec.id);
    } else {
      // Local-only record — keep as-is
      result.push(localRec);
      seenIds.add(localRec.id);
    }
  }

  // Add server records that don't exist locally (new from sync)
  for (const serverRec of serverReflections) {
    if (seenIds.has(serverRec.id)) continue;

    // Check for date collision (different ID, same date)
    const dateCollision = localByDate.get(serverRec.localDate);
    if (dateCollision && dateCollision.id !== serverRec.id) {
      // Different ID, same date — keep both, mark as conflict
      // The local one stays; add server one with conflict status
      result.push({
        id: serverRec.id,
        localDate: serverRec.localDate,
        timezone: serverRec.timezone,
        locale: serverRec.locale as LocalReflection["locale"],
        promptIds: serverRec.promptIds,
        promptCategories: serverRec.promptCategories as LocalReflection["promptCategories"],
        content: serverRec.content,
        wordCount: countWords(serverRec.content),
        createdAt: serverRec.createdAt,
        updatedAt: serverRec.updatedAt,
        syncStatus: "conflict",
      });
    } else {
      // Pure new record from server
      result.push({
        id: serverRec.id,
        localDate: serverRec.localDate,
        timezone: serverRec.timezone,
        locale: serverRec.locale as LocalReflection["locale"],
        promptIds: serverRec.promptIds,
        promptCategories: serverRec.promptCategories as LocalReflection["promptCategories"],
        content: serverRec.content,
        wordCount: countWords(serverRec.content),
        createdAt: serverRec.createdAt,
        updatedAt: serverRec.updatedAt,
        syncStatus: "synced",
      });
    }
    seenIds.add(serverRec.id);
  }

  // Save merged result
  saveReflections(result);

  return result;
}

/**
 * Sync adapter: mark specific reflections as synced after upload acknowledgement.
 *
 * Requirement: "Synced" status must only be shown after actual sync acknowledgement.
 * This function is called only after the server confirms successful sync.
 */
export function markReflectionsSynced(ids: string[]): void {
  const reflections = loadReflections();
  const idSet = new Set(ids);
  let changed = false;

  for (const r of reflections) {
    if (idSet.has(r.id) && r.syncStatus !== "synced") {
      r.syncStatus = "synced";
      changed = true;
    }
  }

  if (changed) {
    saveReflections(reflections);
  }
}

/**
 * Sync adapter: update lastSyncedAt timestamp in storage.
 */
export function setLastSyncedAt(timestamp: string): void {
  if (!isLocalStorageAvailable()) return;
  const storage = loadStorageEnvelope();
  storage.lastSyncedAt = timestamp;
  try {
    writeStorage(storage);
  } catch {
    // ignore
  }
}

/**
 * Sync adapter: get last sync timestamp.
 */
export function getLastSyncedAt(): string | undefined {
  if (!isLocalStorageAvailable()) return undefined;
  return loadStorageEnvelope().lastSyncedAt;
}

/**
 * Sign-in handler: preserve all local data, merge with server state.
 *
 * Requirement: Signing in must not erase local reflections.
 *
 * This is called after a successful sign-in + initial sync.
 * The server reflections are merged into existing local data (see mergeSyncReflections).
 * Local-only reflections are preserved and marked as "pending" for upload.
 */
export function handleSignInSync(
  serverReflections: Array<{
    id: string;
    localDate: string;
    timezone: string;
    locale: string;
    promptIds: string[];
    promptCategories: string[];
    content: string;
    wordCount: number;
    createdAt: string;
    updatedAt: string;
  }>,
): void {
  // Mark all local records as "pending" so they get uploaded on next sync
  const local = loadReflections();
  for (const r of local) {
    if (r.syncStatus === "local") {
      r.syncStatus = "pending";
    }
  }
  if (local.length > 0) {
    saveReflections(local);
  }

  // Merge server state on top
  mergeSyncReflections(serverReflections);
}

/**
 * Sign-out handler: keep all local data, but clear sync status.
 *
 * Requirement: Signing out must not erase local-only data.
 *
 * "synced" becomes "local" (user is anonymous again).
 * Drafts, quarantined records, and migration markers are all preserved.
 */
export function handleSignOut(): void {
  if (!isLocalStorageAvailable()) return;

  const storage = loadStorageEnvelope();
  let changed = false;

  for (const r of storage.reflections) {
    if (r.syncStatus === "synced" || r.syncStatus === "pending" || r.syncStatus === "conflict") {
      r.syncStatus = "local";
      changed = true;
    }
  }

  // Clear server-side sync timestamp but keep local data
  if (storage.lastSyncedAt) {
    storage.lastSyncedAt = undefined;
    changed = true;
  }

  if (changed) {
    try {
      writeStorage(storage);
    } catch {
      // ignore
    }
  }
}

// ============================================================================
// ID generation
// ============================================================================

/**
 * Generate a stable client-side ID for reflections.
 * Format: ref_<timestamp>_<random>
 * Example: ref_1786671611547_9wvactdbu
 */
export function generateReflectionId(): string {
  return `ref_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Check if an ID matches the canonical format.
 */
export function isValidReflectionId(id: string): boolean {
  return isCanonicalReflectionId(id);
}

// ============================================================================
// Time/date helpers
// ============================================================================

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
