/**
 * Sleep Diary v2.5 — Reflection Schema Validation and Migration
 *
 * Type guards and schema validation for localStorage data.
 * Corrupted individual records are quarantined — valid records are never erased.
 *
 * Migration paths:
 * - v1 → v2 (idempotent merge, fixes ID validation bug + locale code normalization)
 * - legacy sync-client key → v2 (idempotent merge)
 */

import { z } from "zod";
import { REFLECTION_CATEGORIES } from "./reflection-types";
import type {
  LocalReflection,
  ReflectionStorage,
  LegacyReflectionStorageV1,
  ReflectionDraft,
} from "./reflection-types";
import type { ContentLocale } from "@/content/content-types";

// ============================================================================
// ID Policy
// ============================================================================

/**
 * Canonical reflection ID formats (read-accept, generate-only ref_ prefix):
 *
 * 1. Canonical v2:  ref_<timestamp>_<randomalnum>   (e.g. ref_1786671611547_9wvactdbu)
 * 2. UUID legacy:   standard UUID v4                 (e.g. 550e8400-e29b-41d4-a716-446655440000)
 * 3. v1 timestamp:  <timestamp>-<random>             (e.g. 1786671611547-9wvactdbu)
 *
 * Unknown but salvageable IDs get a new canonical ID during migration,
 * with the original stored in legacyId for traceability / deduplication.
 */
const CANONICAL_REF_ID = /^ref_\d+_[a-z0-9]+$/;
const UUID_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const V1_TIMESTAMP_ID = /^\d{13}-[a-z0-9]+$/;

export function isKnownReflectionId(id: string): boolean {
  return (
    typeof id === "string" &&
    (CANONICAL_REF_ID.test(id) || UUID_ID.test(id) || V1_TIMESTAMP_ID.test(id))
  );
}

export function isCanonicalReflectionId(id: string): boolean {
  return typeof id === "string" && CANONICAL_REF_ID.test(id);
}

// ============================================================================
// Schemas
// ============================================================================

const ReflectionCategorySchema = z.enum(REFLECTION_CATEGORIES);

const ContentLocaleSchema = z.enum(["en", "es", "pt-BR", "pl", "de"]);

const SyncStatusSchema = z.enum(["local", "pending", "synced", "conflict"]);

/**
 * Reflection ID schema — accepts known formats.
 * Length range: 9 (shortest UUID minus dashes... actually UUID is 36 chars)
 * We accept 9–100 chars but only *known* formats pass isKnownReflectionId.
 * Unknown IDs are accepted on read but flagged for re-ID during migration.
 */
const ReflectionIdSchema = z.string().min(3).max(100);

const LocalReflectionSchema = z.object({
  id: ReflectionIdSchema,
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timezone: z.string(),
  locale: ContentLocaleSchema,
  promptIds: z.array(z.string()),
  promptCategories: z.array(ReflectionCategorySchema),
  content: z.string(),
  wordCount: z.number().int().min(0).max(10000),
  createdAt: z.string(),
  updatedAt: z.string(),
  syncStatus: SyncStatusSchema,
  legacyId: z.string().optional(),
});

const ReflectionStorageSchema = z.object({
  version: z.literal("2"),
  reflections: z.array(LocalReflectionSchema),
  lastSyncedAt: z.string().optional(),
  quarantined: z
    .array(
      z.object({
        raw: z.unknown(),
        reason: z.string(),
        migratedAt: z.string(),
      }),
    )
    .optional(),
  v1Migrated: z.boolean().optional(),
  syncLegacyMigrated: z.boolean().optional(),
});

const LegacyV1StorageSchema = z.object({
  version: z.literal("1"),
  reflections: z.array(z.unknown()),
  lastSyncedAt: z.string().optional(),
});

const LegacySyncStorageSchema = z.object({
  version: z.literal("1"),
  reflections: z.array(z.unknown()),
  lastSyncedAt: z.string().optional(),
});

const DraftStorageSchema = z.object({
  version: z.literal("1"),
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  locale: ContentLocaleSchema,
  promptIds: z.array(z.string()),
  promptCategories: z.array(ReflectionCategorySchema),
  content: z.string(),
  wordCount: z.number().int().min(0).max(10000),
  updatedAt: z.string(),
});

// ============================================================================
// Public validators
// ============================================================================

/**
 * Validate a single reflection object.
 * Returns typed reflection if valid, null otherwise.
 */
export function validateReflection(data: unknown): LocalReflection | null {
  const result = LocalReflectionSchema.safeParse(data);
  return result.success ? result.data : null;
}

/**
 * Validate the entire v2 reflection storage object.
 * Returns typed storage if valid, null otherwise.
 */
export function validateReflectionStorage(data: unknown): ReflectionStorage | null {
  const result = ReflectionStorageSchema.safeParse(data);
  if (!result.success) return null;
  return result.data as ReflectionStorage;
}

/**
 * Validate legacy v1 storage shape (for migration source).
 */
export function validateLegacyV1Storage(data: unknown): LegacyReflectionStorageV1 | null {
  const result = LegacyV1StorageSchema.safeParse(data);
  return result.success ? (result.data as unknown as LegacyReflectionStorageV1) : null;
}

/**
 * Validate legacy sync-client storage shape.
 */
export function validateLegacySyncStorage(data: unknown): {
  version: "1";
  reflections: Array<Record<string, unknown>>;
  lastSyncedAt?: string;
} | null {
  const result = LegacySyncStorageSchema.safeParse(data);
  if (!result.success) return null;
  return result.data as {
    version: "1";
    reflections: Array<Record<string, unknown>>;
    lastSyncedAt?: string;
  };
}

/**
 * Validate a draft record.
 */
export function validateDraft(data: unknown): ReflectionDraft | null {
  const result = DraftStorageSchema.safeParse(data);
  return result.success ? result.data : null;
}

/**
 * Filter and validate an array of unknown records.
 * Returns only valid reflections. Invalid records are skipped silently
 * (caller may separately track quarantined items).
 */
export function filterValidReflections(items: unknown[]): LocalReflection[] {
  return items
    .map((item) => validateReflection(item))
    .filter((r): r is LocalReflection => r !== null);
}

// ============================================================================
// UI locale → content locale mapping (for v1 migration)
// ============================================================================

const UI_LOCALE_TO_CONTENT_LOCALE: Record<string, ContentLocale> = {
  en: "en",
  es: "es",
  pt: "pt-BR",
  "pt-BR": "pt-BR",
  pl: "pl",
  de: "de",
};

/**
 * Normalize a locale string to a valid ContentLocale.
 * Falls back to "en" for unrecognized values.
 */
export function normalizeContentLocale(raw: unknown): ContentLocale {
  if (typeof raw !== "string") return "en";
  const mapped = UI_LOCALE_TO_CONTENT_LOCALE[raw];
  if (mapped) return mapped;
  // Try lowercased lookup
  const lower = raw.toLowerCase();
  for (const [key, value] of Object.entries(UI_LOCALE_TO_CONTENT_LOCALE)) {
    if (key.toLowerCase() === lower) return value;
  }
  return "en";
}

// ============================================================================
// Migration: v1 → v2 (idempotent merge)
// ============================================================================

export interface MigrationResult {
  storage: ReflectionStorage;
  migratedCount: number;
  quarantinedCount: number;
  skippedDuplicates: number;
}

/**
 * Migrate a v1 storage object to v2 format (idempotent merge).
 *
 * This function merges v1 records into a v2 storage envelope.
 * It can be called repeatedly — duplicates (by ID) are skipped.
 *
 * Fixes applied:
 * 1. Normalizes locale codes (UI locale → content locale, e.g. "pt" → "pt-BR")
 * 2. Unknown IDs get new canonical ID with original preserved as legacyId
 * 3. Recomputes word count from content
 * 4. Valid records are merged; invalid individual records are quarantined
 *
 * The entire valid collection is NEVER erased — one bad record doesn't wipe history.
 */
export function migrateV1ToV2(
  v1Data: unknown,
  existingV2?: ReflectionStorage | null,
): MigrationResult {
  const now = new Date().toISOString();
  const result: ReflectionStorage = existingV2
    ? { ...existingV2, quarantined: existingV2.quarantined ? [...existingV2.quarantined] : [] }
    : {
        version: "2",
        reflections: [],
        quarantined: [],
      };

  // Ensure quarantined array exists
  if (!result.quarantined) {
    result.quarantined = [];
  }

  let migratedCount = 0;
  let quarantinedCount = 0;
  let skippedDuplicates = 0;

  // Build a set of existing IDs and legacy IDs for dedup
  const existingIds = new Set(result.reflections.map((r) => r.id));
  const existingLegacyIds = new Set(
    result.reflections.filter((r) => r.legacyId).map((r) => r.legacyId as string),
  );
  // Also dedup by date + content fingerprint (first 50 chars + word count)
  // This catches records that were re-generated with different IDs
  const contentFingerprints = new Set(
    result.reflections.map((r) => `${r.localDate}:${r.content.slice(0, 50)}:${r.wordCount}`),
  );

  // Extract the reflections array from whatever shape v1 data is in
  let rawReflections: unknown[] = [];
  let lastSyncedAt: string | undefined;

  const v1 = validateLegacyV1Storage(v1Data);
  if (v1) {
    rawReflections = v1.reflections;
    lastSyncedAt = v1.lastSyncedAt;
  } else if (
    v1Data &&
    typeof v1Data === "object" &&
    Array.isArray((v1Data as Record<string, unknown>).reflections)
  ) {
    // Partial match — still try to salvage
    rawReflections = (v1Data as Record<string, unknown>).reflections as unknown[];
  } else if (Array.isArray(v1Data)) {
    // Bare array — salvage directly
    rawReflections = v1Data;
  }

  // Preserve v1 lastSyncedAt if v2 doesn't have one
  if (lastSyncedAt && !result.lastSyncedAt) {
    result.lastSyncedAt = lastSyncedAt;
  }

  // Migrate each record individually
  for (const raw of rawReflections) {
    if (!raw || typeof raw !== "object") {
      quarantinedCount++;
      result.quarantined?.push({ raw, reason: "not_an_object", migratedAt: now });
      continue;
    }

    const record = raw as Record<string, unknown>;

    // Build a v2-compatible record by applying fixes
    try {
      const locale = normalizeContentLocale(record.locale);

      // Normalize promptCategories — ensure they are valid categories
      const rawCategories = Array.isArray(record.promptCategories) ? record.promptCategories : [];
      const categories = rawCategories.filter(
        (c): c is (typeof REFLECTION_CATEGORIES)[number] =>
          typeof c === "string" && (REFLECTION_CATEGORIES as readonly string[]).includes(c),
      );

      // Normalize promptIds
      const promptIds = Array.isArray(record.promptIds)
        ? record.promptIds.filter((p): p is string => typeof p === "string")
        : [];

      // Handle ID: known formats preserved; unknown get new canonical ID
      const rawId = typeof record.id === "string" ? record.id : "";
      let id: string;
      let legacyId: string | undefined;

      if (isKnownReflectionId(rawId)) {
        id = rawId;
      } else if (rawId.length > 0) {
        // Unknown but salvageable — new canonical ID, keep original for traceability
        id = generateCanonicalId();
        legacyId = rawId;
      } else {
        // No ID at all — generate new one
        id = generateCanonicalId();
      }

      const content = typeof record.content === "string" ? record.content : "";
      // Recompute word count from content (don't trust potentially corrupted metadata)
      const wordCount = countWordsFromContent(content);

      const localDate =
        typeof record.localDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(record.localDate)
          ? record.localDate
          : // Try to derive from createdAt, fall back to epoch
            typeof record.createdAt === "string"
            ? (() => {
                try {
                  const d = new Date(record.createdAt as string);
                  if (!isNaN(d.getTime())) {
                    const y = d.getFullYear();
                    const m = String(d.getMonth() + 1).padStart(2, "0");
                    const day = String(d.getDate()).padStart(2, "0");
                    return `${y}-${m}-${day}`;
                  }
                } catch {
                  /* ignore */
                }
                return "1970-01-01";
              })()
            : "1970-01-01";

      const timezone = typeof record.timezone === "string" ? record.timezone : "UTC";
      const createdAt = typeof record.createdAt === "string" ? record.createdAt : now;
      const updatedAt = typeof record.updatedAt === "string" ? record.updatedAt : now;

      const rawSyncStatus = record.syncStatus;
      const syncStatus: LocalReflection["syncStatus"] =
        typeof rawSyncStatus === "string" &&
        ["local", "pending", "synced", "conflict"].includes(rawSyncStatus)
          ? (rawSyncStatus as LocalReflection["syncStatus"])
          : "local";

      const migrated: LocalReflection = {
        id,
        localDate,
        timezone,
        locale,
        promptIds,
        promptCategories: categories,
        content,
        wordCount,
        createdAt,
        updatedAt,
        syncStatus,
        ...(legacyId ? { legacyId } : {}),
      };

      // Validate the migrated record
      const validated = validateReflection(migrated);
      if (!validated) {
        quarantinedCount++;
        result.quarantined?.push({
          raw,
          reason: "post_migration_validation_failed",
          migratedAt: now,
        });
        continue;
      }

      // Dedup: skip if ID already exists in v2
      if (existingIds.has(validated.id)) {
        skippedDuplicates++;
        continue;
      }

      // Dedup: skip if legacyId matches an existing legacyId
      if (validated.legacyId && existingLegacyIds.has(validated.legacyId)) {
        skippedDuplicates++;
        continue;
      }

      // Dedup: skip if content fingerprint matches (same date + similar content)
      const fingerprint = `${validated.localDate}:${validated.content.slice(0, 50)}:${validated.wordCount}`;
      if (contentFingerprints.has(fingerprint)) {
        skippedDuplicates++;
        continue;
      }

      // New unique record — add it
      result.reflections.push(validated);
      existingIds.add(validated.id);
      if (validated.legacyId) {
        existingLegacyIds.add(validated.legacyId);
      }
      contentFingerprints.add(fingerprint);
      migratedCount++;
    } catch (e) {
      quarantinedCount++;
      result.quarantined?.push({
        raw,
        reason: `migration_error: ${e instanceof Error ? e.message : "unknown"}`,
        migratedAt: now,
      });
    }
  }

  return { storage: result, migratedCount, quarantinedCount, skippedDuplicates };
}

/**
 * Migrate legacy sync-client "reflections" key data into v2 format.
 * Same logic as v1→v2 but source is the old sync-client envelope.
 */
export function migrateSyncLegacyToV2(
  syncLegacyData: unknown,
  existingV2?: ReflectionStorage | null,
): MigrationResult {
  // The legacy sync-client envelope has the same shape as v1 for our purposes
  return migrateV1ToV2(syncLegacyData, existingV2);
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Generate a canonical reflection ID: ref_<timestamp>_<random>
 */
function generateCanonicalId(): string {
  return `ref_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Count words in reflection content (conservative: whitespace-separated tokens
 * that contain at least one letter). Mirrors countWords from reflection-word-count
 * to avoid circular dependencies in the validation layer.
 */
function countWordsFromContent(content: string): number {
  if (!content.trim()) return 0;
  return content.split(/\s+/).filter((t) => t && /\p{L}/u.test(t)).length;
}

// ============================================================================
// Consistency checks (advisory, not load-blocking)
// ============================================================================

/**
 * Validate that a reflection has consistent data.
 * This is an advisory check — it does NOT block loading.
 * - wordCount should be roughly close to actual content
 * - promptIds length should match promptCategories length
 */
export function isReflectionConsistent(reflection: LocalReflection): boolean {
  // Word count should be in the ballpark (allow ±20% for locale differences)
  const actualWordCount = reflection.content
    .split(/\s+/)
    .filter((t) => t && /\p{L}/u.test(t)).length;
  if (actualWordCount > 0) {
    const ratio = reflection.wordCount / actualWordCount;
    if (ratio < 0.5 || ratio > 2.0) {
      return false;
    }
  }

  // Prompt arrays should have same length
  if (reflection.promptIds.length !== reflection.promptCategories.length) {
    return false;
  }

  return true;
}
