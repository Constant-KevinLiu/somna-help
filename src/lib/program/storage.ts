/**
 * Sleep Diary v2.5 — Program Storage
 *
 * SSR-safe persistence layer for Program progress and weekly plans.
 *
 * Guarantees:
 *  - No direct window/localStorage access during SSR
 *  - Malformed data is isolated (never crashes, returns initial state)
 *  - Legacy schema is migrated safely
 *  - Future schema versions are preserved (never silently downgraded)
 *  - No user data is silently erased
 *  - All writes are explicit
 *
 * Storage keys:
 *   somna:program-progress:v1   — canonical program progress
 *   cbtiProgramProgress         — legacy key (read for migration, never written)
 *   somna:program-plans:v1      — weekly program plans
 */

import {
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove,
} from "../safe-storage";
import type { ProgramProgress, ProgramDefinition } from "./types";
import {
  createInitialProgress,
  migrateLegacyProgress,
  isLegacyProgress,
  LEGACY_PROGRESS_KEY,
  CANONICAL_PROGRESS_KEY,
} from "./service";

// =============================================================================
// Load Result Contract
// =============================================================================

/**
 * Discriminated union result type for program progress load operations.
 *
 * Callers should narrow on `status` before consuming progress data.
 * This contract makes the load state explicit so UI layers can show
 * appropriate messaging without guessing from null/fallback values.
 *
 * Status values:
 *   - "ready": normal load, progress is available
 *   - "empty": no stored progress, fresh initial state
 *   - "migrated": data was migrated from a legacy schema
 *   - "unsupported-version": stored schema is newer than supported
 *   - "corrupted": stored data was malformed and could not be recovered
 */
export type ProgramLoadResult =
  | {
      status: "ready";
      progress: ProgramProgress;
    }
  | {
      status: "empty";
      progress: ProgramProgress;
    }
  | {
      status: "migrated";
      progress: ProgramProgress;
      fromVersion: number;
    }
  | {
      status: "unsupported-version";
      storedVersion: number;
      supportedVersion: number;
      /** Raw stored data — preserved, never modified. */
      raw: unknown;
      /** Safe display fallback (initial progress, not the user's real data). */
      fallback: ProgramProgress;
    }
  | {
      status: "corrupted";
      recoverable: boolean;
      progress: ProgramProgress;
      /** Raw malformed data if available. */
      raw?: unknown;
    };

// =============================================================================
// Forward-Schema Guard
// =============================================================================

/** The maximum schema version this build of the app understands. */
export const SUPPORTED_PROGRAM_SCHEMA_VERSION = 1;

/**
 * Returned when stored data has a schema version newer than what this
 * build of the app supports. The raw data is preserved — never mutated,
 * never downgraded, never silently overwritten.
 */
export interface UnsupportedProgramSchema {
  /** Discriminator for callers to detect this state. */
  readonly kind: "unsupported_schema";
  /** The schema version found in storage. */
  readonly storedSchemaVersion: number;
  /** The highest schema version this build supports. */
  readonly supportedSchemaVersion: number;
  /** Raw stored value (preserved, never modified). */
  readonly raw: unknown;
  /** Safe fallback progress that can be used for display only. */
  readonly fallback: ProgramProgress;
}

/**
 * Check whether a value looks like an unsupported-schema result.
 */
export function isUnsupportedSchema(value: unknown): value is UnsupportedProgramSchema {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as UnsupportedProgramSchema).kind === "unsupported_schema"
  );
}

/**
 * Check the schema version of stored data. Returns:
 *   - "supported" if the data is from a known schema (or is legacy/missing)
 *   - "unsupported" if the schema version is newer than what we support
 *
 * This guard ensures we never silently downgrade user data.
 */
export function checkSchemaVersion(raw: unknown):
  | { ok: true }
  | { ok: false; storedVersion: number; supportedVersion: number } {
  if (!raw || typeof raw !== "object") {
    return { ok: true }; // null/undefined/primitive: no schema to worry about
  }

  const rawObj = raw as Record<string, unknown>;
  const storedVersion = rawObj.schemaVersion;

  if (typeof storedVersion !== "number") {
    // No schemaVersion field — could be legacy format. Handled by migration.
    return { ok: true };
  }

  if (storedVersion > SUPPORTED_PROGRAM_SCHEMA_VERSION) {
    return {
      ok: false,
      storedVersion,
      supportedVersion: SUPPORTED_PROGRAM_SCHEMA_VERSION,
    };
  }

  return { ok: true };
}

/**
 * Build an unsupported-schema result.
 * Preserves raw data and provides a safe display fallback.
 */
function buildUnsupportedSchema(
  raw: unknown,
  storedVersion: number
): UnsupportedProgramSchema {
  // Dev-only diagnostic — never log user content, only schema metadata.
  if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
    console.warn(
      `[program-storage] Unsupported schema version in storage: ` +
        `stored=${storedVersion}, supported=${SUPPORTED_PROGRAM_SCHEMA_VERSION}. ` +
        `Data preserved but not mutated.`
    );
  }

  return {
    kind: "unsupported_schema",
    storedSchemaVersion: storedVersion,
    supportedSchemaVersion: SUPPORTED_PROGRAM_SCHEMA_VERSION,
    raw,
    fallback: createInitialProgress(),
  };
}

// =============================================================================
// Program Progress Storage
// =============================================================================

const PLANS_STORAGE_KEY = "somna:program-plans:v1";

/**
 * Load program progress from localStorage.
 *
 * Migration order:
 *   1. Try canonical key (v1 format)
 *   2. If schema is newer than supported → return UnsupportedProgramSchema
 *   3. Try legacy key (migrate to v1 format)
 *   4. Fall back to fresh initial progress
 *
 * SSR-safe: returns initial progress on the server.
 *
 * Callers should check `isUnsupportedSchema(result)` before using as
 * ProgramProgress. In unsupported-schema state, never write to storage.
 *
 * @deprecated Use `loadProgramProgressResult()` for the discriminated-union
 *             contract. This function is kept for backward compatibility.
 */
export function loadProgramProgress(
  definition: ProgramDefinition
): ProgramProgress | UnsupportedProgramSchema {
  const result = loadProgramProgressResult(definition);
  switch (result.status) {
    case "ready":
    case "empty":
    case "migrated":
    case "corrupted":
      return result.progress;
    case "unsupported-version":
      return buildUnsupportedSchema(result.raw, result.storedVersion);
  }
}

/**
 * Load program progress with an explicit discriminated-union result.
 *
 * This is the preferred entry point for callers that need to distinguish
 * between empty, migrated, unsupported, and corrupted states.
 *
 * SSR-safe: returns { status: "empty", progress: initial } on the server.
 */
export function loadProgramProgressResult(
  definition: ProgramDefinition
): ProgramLoadResult {
  const initial = createInitialProgress();

  // 1. Try canonical v1 format
  const canonical = safeLocalStorageGet<unknown>(CANONICAL_PROGRESS_KEY, null);
  if (canonical !== null) {
    const versionCheck = checkSchemaVersion(canonical);
    if (!versionCheck.ok) {
      // Future schema — preserve data, return unsupported state
      return {
        status: "unsupported-version",
        storedVersion: versionCheck.storedVersion,
        supportedVersion: versionCheck.supportedVersion,
        raw: canonical,
        fallback: initial,
      };
    }
    const migrated = migrateLegacyProgress(canonical, definition);
    // Check if this was a migration from legacy (no schemaVersion field)
    const rawObj = canonical as Record<string, unknown>;
    if (rawObj.schemaVersion === undefined) {
      return { status: "migrated", progress: migrated, fromVersion: 0 };
    }
    return { status: "ready", progress: migrated };
  }

  // 2. Try legacy format
  const legacy = safeLocalStorageGet<unknown>(LEGACY_PROGRESS_KEY, null);
  if (legacy && isLegacyProgress(legacy)) {
    const migrated = migrateLegacyProgress(legacy, definition);
    // Auto-write migrated value to canonical key
    saveProgramProgress(migrated);
    return { status: "migrated", progress: migrated, fromVersion: 0 };
  }

  // 3. Fresh start
  return { status: "empty", progress: initial };
}

/**
 * Save program progress to localStorage (canonical key).
 *
 * If the currently stored data has an unsupported (future) schema version,
 * this is a no-op — we never overwrite newer data with an older schema.
 *
 * SSR-safe: no-op on the server.
 *
 * Returns true if the save was performed, false if blocked by forward-schema guard.
 */
export function saveProgramProgress(progress: ProgramProgress): boolean {
  // Forward-schema check: never overwrite newer data with older schema
  const stored = safeLocalStorageGet<unknown>(CANONICAL_PROGRESS_KEY, null);
  if (stored !== null) {
    const versionCheck = checkSchemaVersion(stored);
    if (!versionCheck.ok) {
      if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
        console.warn(
          `[program-storage] saveProgramProgress blocked: ` +
            `stored schema v${versionCheck.storedVersion} > ` +
            `supported v${versionCheck.supportedVersion}. ` +
            `Data preserved.`
        );
      }
      return false;
    }
  }

  // safeLocalStorageSet always stringifies JSON automatically.
  safeLocalStorageSet(CANONICAL_PROGRESS_KEY, progress);
  return true;
}

/**
 * Clear all program progress data from localStorage.
 * Removes both canonical and legacy keys.
 *
 * Note: This clears the canonical key even if it has an unsupported schema
 * version, because explicit deletion is an intentional user action.
 *
 * SSR-safe: no-op on the server.
 */
export function clearProgramProgress(): void {
  safeLocalStorageRemove(CANONICAL_PROGRESS_KEY);
  safeLocalStorageRemove(LEGACY_PROGRESS_KEY);
}

// =============================================================================
// Export / Delete — Program Data
// =============================================================================

/**
 * Shape of program data in the user data export.
 */
export interface ProgramExportData {
  schemaVersion: 1;
  progress: ProgramProgress | null;
  plans: unknown[]; // WeeklyProgramPlan[] — defined in weekly-plan.ts
  exportedAt: string;
  /**
   * If the stored schema is newer than what this build supports,
   * the raw unsupported data is included as-is so the user still
   * gets all their data in the export.
   */
  unsupportedSchemaRaw?: unknown;
  unsupportedSchemaVersion?: number;
}

/**
 * Export all program data in a serializable format.
 * Used by the account data export flow.
 *
 * If a future schema version is detected, the raw stored data is included
 * alongside the typed fields so users never lose data in an export.
 *
 * SSR-safe: returns empty export on the server.
 */
export function exportProgramData(
  definition: ProgramDefinition
): ProgramExportData {
  const loaded = loadProgramProgress(definition);
  const plans = loadAllPlansStorage();

  if (isUnsupportedSchema(loaded)) {
    return {
      schemaVersion: 1,
      progress: loaded.fallback.status === "not_started" ? null : loaded.fallback,
      plans,
      exportedAt: new Date().toISOString(),
      unsupportedSchemaRaw: loaded.raw,
      unsupportedSchemaVersion: loaded.storedSchemaVersion,
    };
  }

  return {
    schemaVersion: 1,
    progress: loaded.status === "not_started" ? null : loaded,
    plans,
    exportedAt: new Date().toISOString(),
  };
}

/**
 * Delete ALL program data (progress + plans).
 * Used by the clear-cache / delete-all flow.
 *
 * Note: Deletes even if schema is unsupported — explicit user deletion
 * is not blocked by the forward-schema guard.
 *
 * SSR-safe: no-op on the server.
 */
export function deleteAllProgramData(): void {
  clearProgramProgress();
  clearAllPlansStorage();
}

// =============================================================================
// Weekly Plans Storage
// =============================================================================
// These are kept here (not in weekly-plan.ts) to keep that file free of
// storage concerns.  The type lives in weekly-plan.ts.

interface PlansStorage {
  schemaVersion: 1;
  plans: unknown[];
}

const EMPTY_PLANS: PlansStorage = { schemaVersion: 1, plans: [] };

function loadAllPlansStorage(): unknown[] {
  // safeLocalStorageGet always parses JSON automatically.
  const raw = safeLocalStorageGet<PlansStorage | null>(PLANS_STORAGE_KEY, null);
  if (!raw || !Array.isArray(raw.plans)) return [];
  return raw.plans;
}

function clearAllPlansStorage(): void {
  safeLocalStorageRemove(PLANS_STORAGE_KEY);
}

/**
 * Get the storage key for program plans.
 * Exported for use by weekly-plan module.
 */
export const PLANS_KEY = PLANS_STORAGE_KEY;
