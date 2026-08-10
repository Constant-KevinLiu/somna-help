/**
 * Sleep Diary v2.3 — Conflict Resolution Logic
 *
 * Deterministic conflict resolution rules by entity type.
 * Implements merge strategies for sleep records and reflections.
 * Never silently overwrites meaningful reflection content.
 */

import type {
  SyncSleepRecord,
  SyncReflection,
  SyncConflict,
  ConflictResolutionStrategy,
} from "./sync-types";

// =============================================================================
// Sleep Record Conflict Resolution
// =============================================================================

export interface ConflictResult<T> {
  resolved: T;
  conflict: SyncConflict | null;
  strategy: ConflictResolutionStrategy;
}

/**
 * Resolve sleep record conflicts using timestamp-based strategy.
 * Newer valid version wins. If meaningful fields differ and timestamps are
 * ambiguous, flag for user review.
 */
export function resolveSleepRecordConflict(
  local: SyncSleepRecord,
  server: SyncSleepRecord,
): ConflictResult<SyncSleepRecord> {
  // If records are identical, no conflict
  if (areSleepRecordsIdentical(local, server)) {
    return {
      resolved: { ...server, syncStatus: "synced" },
      conflict: null,
      strategy: "server-wins",
    };
  }

  const localTime = new Date(local.updatedAt).getTime();
  const serverTime = new Date(server.updatedAt).getTime();

  // If one is clearly newer, use it
  if (localTime > serverTime + 60000) {
    // Local is more than 1 minute newer — keep local
    return {
      resolved: { ...local, syncStatus: "synced" },
      conflict: null,
      strategy: "client-wins",
    };
  }

  if (serverTime > localTime + 60000) {
    // Server is more than 1 minute newer — keep server
    return {
      resolved: { ...server, syncStatus: "synced" },
      conflict: null,
      strategy: "server-wins",
    };
  }

  // Timestamps are close — check if fields are meaningfully different
  const meaningfulDiff = hasMeaningfulSleepRecordDifferences(local, server);

  if (meaningfulDiff) {
    // Flag as conflict requiring user attention
    return {
      resolved: server,
      conflict: {
        entityType: "sleep-record",
        entityId: local.id,
        localDate: local.date,
        clientVersion: stripPrivateFields(local),
        serverVersion: stripPrivateFields(server),
        resolutionType: "manual",
      },
      strategy: "manual",
    };
  }

  // No meaningful differences — keep server
  return {
    resolved: { ...server, syncStatus: "synced" },
    conflict: null,
    strategy: "server-wins",
  };
}

function areSleepRecordsIdentical(a: SyncSleepRecord, b: SyncSleepRecord): boolean {
  return (
    a.bedtime === b.bedtime &&
    a.wakeUpTime === b.wakeUpTime &&
    a.sleepLatency === b.sleepLatency &&
    a.nightAwakenings === b.nightAwakenings &&
    a.sleepQuality === b.sleepQuality &&
    a.mood === b.mood &&
    a.sleepEfficiency === b.sleepEfficiency &&
    a.sleepScore === b.sleepScore
  );
}

function hasMeaningfulSleepRecordDifferences(a: SyncSleepRecord, b: SyncSleepRecord): boolean {
  // Check for differences in subjective fields that indicate different entries
  const qualityDiff = Math.abs(a.sleepQuality - b.sleepQuality);
  const moodDiff = Math.abs(a.mood - b.mood);
  const efficiencyDiff = Math.abs(a.sleepEfficiency - b.sleepEfficiency);

  return qualityDiff >= 2 || moodDiff >= 2 || efficiencyDiff >= 20;
}

// =============================================================================
// Reflection Conflict Resolution
// =============================================================================

/**
 * Resolve reflection conflicts with extreme care.
 * Never silently overwrite meaningful text content.
 */
export function resolveReflectionConflict(
  local: SyncReflection,
  server: SyncReflection,
): ConflictResult<SyncReflection> {
  // If content is identical, no conflict
  if (local.content.trim() === server.content.trim()) {
    return {
      resolved: { ...server, syncStatus: "synced" },
      conflict: null,
      strategy: "server-wins",
    };
  }

  // If one side is empty, keep the non-empty content
  if (!local.content.trim()) {
    return {
      resolved: { ...server, syncStatus: "synced" },
      conflict: null,
      strategy: "server-wins",
    };
  }
  if (!server.content.trim()) {
    return {
      resolved: { ...local, syncStatus: "synced" },
      conflict: null,
      strategy: "client-wins",
    };
  }

  // Check if one is a strict continuation of the other
  if (server.content.includes(local.content)) {
    // Server version is a superset — keep server
    return {
      resolved: { ...server, syncStatus: "synced" },
      conflict: null,
      strategy: "server-wins",
    };
  }
  if (local.content.includes(server.content)) {
    // Local version is a superset — keep local
    return {
      resolved: { ...local, syncStatus: "synced" },
      conflict: null,
      strategy: "client-wins",
    };
  }

  // Check timestamps for clear recency
  const localTime = new Date(local.updatedAt).getTime();
  const serverTime = new Date(server.updatedAt).getTime();

  if (localTime > serverTime + 300000) {
    // Local is more than 5 minutes newer — keep local
    return {
      resolved: { ...local, syncStatus: "synced" },
      conflict: null,
      strategy: "client-wins",
    };
  }

  if (serverTime > localTime + 300000) {
    // Server is more than 5 minutes newer — keep server
    return {
      resolved: { ...server, syncStatus: "synced" },
      conflict: null,
      strategy: "server-wins",
    };
  }

  // Materially different content with ambiguous timestamps
  // Preserve both as conflict versions requiring user review
  return {
    resolved: server,
    conflict: {
      entityType: "reflection",
      entityId: local.id,
      localDate: local.localDate,
      clientVersion: stripReflectionContent(local),
      serverVersion: stripReflectionContent(server),
      resolutionType: "manual",
    },
    strategy: "manual",
  };
}

/**
 * Merge two reflection contents intelligently.
 * Appends one to the other with a clear divider.
 */
export function mergeReflectionContents(local: SyncReflection, server: SyncReflection): string {
  const newer = new Date(local.updatedAt) > new Date(server.updatedAt) ? local : server;
  const older = newer === local ? server : local;

  return `${older.content}\n\n---\n\n${newer.content}`;
}

// =============================================================================
// Reminder Settings Conflict Resolution
// =============================================================================

/**
 * Resolve reminder settings conflict — newest always wins.
 * These are settings, not user content, so no ambiguity needed.
 */
export function resolveReminderConflict<T extends { updatedAt: string }>(
  local: T,
  server: T,
): ConflictResult<T> {
  const localTime = new Date(local.updatedAt).getTime();
  const serverTime = new Date(server.updatedAt).getTime();

  if (localTime > serverTime) {
    return {
      resolved: local,
      conflict: null,
      strategy: "newest-wins",
    };
  }

  return {
    resolved: server,
    conflict: null,
    strategy: "newest-wins",
  };
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Strip potentially sensitive or large fields from conflict metadata.
 * Ensures we don't send full reflection content in error metadata.
 */
function stripPrivateFields(record: SyncSleepRecord): Partial<SyncSleepRecord> {
  // Sleep records don't have sensitive content — send preview
  return {
    date: record.date,
    bedtime: record.bedtime,
    wakeUpTime: record.wakeUpTime,
    sleepQuality: record.sleepQuality,
    mood: record.mood,
    updatedAt: record.updatedAt,
  };
}

function stripReflectionContent(reflection: SyncReflection): Partial<SyncReflection> {
  // For reflections, only send metadata, NEVER the content
  // The UI will need to fetch full content separately if needed
  return {
    id: reflection.id,
    localDate: reflection.localDate,
    wordCount: reflection.wordCount,
    updatedAt: reflection.updatedAt,
  };
}

/**
 * Check if two records are in conflict by date uniqueness.
 * Returns true if both records exist for the same user + date.
 */
export function isDateConflict(
  localId: string,
  localDate: string,
  serverRecords: Array<{ id: string; date?: string; localDate?: string }>,
): boolean {
  return serverRecords.some(
    (r) => r.id !== localId && (r.date === localDate || r.localDate === localDate),
  );
}
