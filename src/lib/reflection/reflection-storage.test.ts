/**
 * Reflection storage regression tests.
 *
 * Covers the full persistence contract:
 * - Save → load round-trip
 * - Validation correctness
 * - Migration from v1 (with the ID + locale bugs) to v2
 * - Quarantine of malformed individual records (no blanket erase)
 * - Draft / committed separation
 * - Delete, edit, sort behavior
 * - Privacy: no reflection text in analytics paths
 * - Storage failure safety
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { LocalReflection, ReflectionDraft } from "./reflection-types";
import {
  loadReflections,
  saveReflection,
  saveReflections,
  deleteReflection,
  getSortedReflections,
  getReflectionByDate,
  getReflectionById,
  generateReflectionId,
  todayLocalISO,
  getLocalTimezone,
  loadDraft,
  saveDraft,
  clearDraft,
  migrateIfNeeded,
  runMigrations,
  REFLECTIONS_STORAGE_KEY_V1,
  REFLECTIONS_STORAGE_KEY_V2,
  REFLECTION_DRAFT_STORAGE_KEY,
  REFLECTIONS_SYNC_LEGACY_KEY,
  loadSyncReflections,
  mergeSyncReflections,
  markReflectionsSynced,
  setLastSyncedAt,
  getLastSyncedAt,
  handleSignInSync,
  handleSignOut,
  isValidReflectionId,
} from "./reflection-storage";
import {
  validateReflection,
  validateReflectionStorage,
  filterValidReflections,
  migrateV1ToV2,
  normalizeContentLocale,
  isKnownReflectionId,
  isCanonicalReflectionId,
} from "./reflection-validation";
import { countWords } from "./reflection-word-count";

// ============================================================================
// Mock localStorage for tests
// ============================================================================

const mockStorage = new Map<string, string>();

beforeEach(() => {
  mockStorage.clear();
  const mockLocalStorage: Storage = {
    getItem: (key: string) => mockStorage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      mockStorage.set(key, value);
    },
    removeItem: (key: string) => {
      mockStorage.delete(key);
    },
    clear: () => {
      mockStorage.clear();
    },
    key: (index: number) => Array.from(mockStorage.keys())[index] ?? null,
    length: 0,
  };
  Object.defineProperty(globalThis, "window", {
    value: {
      localStorage: mockLocalStorage,
      document: { createElement: () => ({}) },
      navigator: { userAgent: "Mozilla/5.0 (Test)" },
    },
    configurable: true,
    writable: true,
  });
  (globalThis as any).localStorage = mockLocalStorage;

  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-08-14T10:00:00Z"));
});

afterEach(() => {
  delete (globalThis as any).window;
  delete (globalThis as any).localStorage;
  mockStorage.clear();
  vi.useRealTimers();
});

// ============================================================================
// Test helpers
// ============================================================================

function makeReflection(overrides: Partial<LocalReflection> = {}): LocalReflection {
  const content = overrides.content ?? "I slept well last night. Feeling rested.";
  return {
    id: overrides.id ?? generateReflectionId(),
    localDate: overrides.localDate ?? todayLocalISO(),
    timezone: overrides.timezone ?? getLocalTimezone(),
    locale: overrides.locale ?? "en",
    promptIds: overrides.promptIds ?? ["p1", "p2", "p3"],
    promptCategories: overrides.promptCategories ?? [
      "sleep-thoughts",
      "sleep-behaviors",
      "gratitude",
    ],
    content,
    wordCount: overrides.wordCount ?? countWords(content),
    createdAt: overrides.createdAt ?? new Date().toISOString(),
    updatedAt: overrides.updatedAt ?? new Date().toISOString(),
    syncStatus: overrides.syncStatus ?? "local",
  };
}

function makeDraft(overrides: Partial<ReflectionDraft> = {}): ReflectionDraft {
  const content = overrides.content ?? "Draft reflection in progress...";
  return {
    version: "1",
    localDate: overrides.localDate ?? todayLocalISO(),
    locale: overrides.locale ?? "en",
    promptIds: overrides.promptIds ?? ["p1", "p2", "p3"],
    promptCategories: overrides.promptCategories ?? [
      "sleep-thoughts",
      "sleep-behaviors",
      "gratitude",
    ],
    content,
    wordCount: overrides.wordCount ?? countWords(content),
    updatedAt: overrides.updatedAt ?? new Date().toISOString(),
  };
}

// ============================================================================
// Tests
// ============================================================================

describe("reflection-storage", () => {
  // -----------------------------------------------------------------------
  // 1. Basic save → load round-trip
  // -----------------------------------------------------------------------
  describe("basic save and load", () => {
    it("save one reflection → history returns exactly one entry", () => {
      const reflection = makeReflection();
      saveReflection(reflection);

      const loaded = loadReflections();
      expect(loaded.length).toBe(1);
      expect(loaded[0].id).toBe(reflection.id);
    });

    it("the saved text equals the entered text", () => {
      const text =
        "This is my reflection about sleep habits. I need to improve my bedtime routine.";
      const reflection = makeReflection({ content: text });
      saveReflection(reflection);

      const loaded = loadReflections();
      expect(loaded[0].content).toBe(text);
    });

    it("new history entry appears without a page reload (data is in storage)", () => {
      expect(loadReflections().length).toBe(0);

      const reflection = makeReflection({ content: "First entry" });
      saveReflection(reflection);

      // Subsequent call returns the new entry immediately
      const loaded = loadReflections();
      expect(loaded.length).toBe(1);
      expect(loaded[0].content).toBe("First entry");
    });

    it("reloading the page preserves committed history", () => {
      const reflection = makeReflection({ content: "Persistent entry" });
      saveReflection(reflection);

      // Simulate "page reload" — re-read from storage
      const afterReload = loadReflections();
      expect(afterReload.length).toBe(1);
      expect(afterReload[0].content).toBe("Persistent entry");
    });
  });

  // -----------------------------------------------------------------------
  // 2. ID generation and validation (THE CORE BUG FIX)
  // -----------------------------------------------------------------------
  describe("ID generation and validation", () => {
    it("generated IDs are accepted by validation", () => {
      const id = generateReflectionId();
      const reflection = makeReflection({ id });
      const result = validateReflection(reflection);
      expect(result).not.toBeNull();
      expect(result!.id).toBe(id);
    });

    it("generated IDs have expected format (ref_ prefix)", () => {
      const id = generateReflectionId();
      expect(id.startsWith("ref_")).toBe(true);
    });

    it("UUID format IDs are also accepted", () => {
      const reflection = makeReflection({
        id: "550e8400-e29b-41d4-a716-446655440000",
      });
      const result = validateReflection(reflection);
      expect(result).not.toBeNull();
    });

    it("legacy v1-style timestamp IDs are accepted (23 chars)", () => {
      // This is the format that v1 produced but v1 validation rejected
      const legacyId = "1786671611547-9wvactdbu";
      const reflection = makeReflection({ id: legacyId });
      const result = validateReflection(reflection);
      expect(result).not.toBeNull();
      expect(result!.id).toBe(legacyId);
    });
  });

  // -----------------------------------------------------------------------
  // 3. Locale normalization
  // -----------------------------------------------------------------------
  describe("locale normalization", () => {
    it("normalizes 'pt' UI locale to 'pt-BR' content locale", () => {
      expect(normalizeContentLocale("pt")).toBe("pt-BR");
    });

    it("normalizes 'pt-BR' to itself", () => {
      expect(normalizeContentLocale("pt-BR")).toBe("pt-BR");
    });

    it("preserves 'en', 'es', 'pl'", () => {
      expect(normalizeContentLocale("en")).toBe("en");
      expect(normalizeContentLocale("es")).toBe("es");
      expect(normalizeContentLocale("pl")).toBe("pl");
    });

    it("falls back to 'en' for unknown locales", () => {
      expect(normalizeContentLocale("xx")).toBe("en");
      expect(normalizeContentLocale(null)).toBe("en");
      expect(normalizeContentLocale(123)).toBe("en");
    });

    it("case-insensitive matching", () => {
      expect(normalizeContentLocale("PT-BR")).toBe("pt-BR");
      expect(normalizeContentLocale("EN")).toBe("en");
    });
  });

  // -----------------------------------------------------------------------
  // 4. Draft vs committed separation
  // -----------------------------------------------------------------------
  describe("draft and committed separation", () => {
    it("drafts are not counted as committed history", () => {
      const draft = makeDraft();
      saveDraft(draft);

      // Committed history should be empty
      const history = loadReflections();
      expect(history.length).toBe(0);

      // Draft should be loadable
      const loadedDraft = loadDraft();
      expect(loadedDraft).not.toBeNull();
      expect(loadedDraft!.content).toBe(draft.content);
    });

    it("draft has separate storage key", () => {
      const draft = makeDraft();
      saveDraft(draft);

      expect(mockStorage.has(REFLECTION_DRAFT_STORAGE_KEY)).toBe(true);
      expect(mockStorage.has(REFLECTIONS_STORAGE_KEY_V2)).toBe(false);
    });

    it("clearDraft removes the draft but not committed history", () => {
      const reflection = makeReflection({ content: "Committed entry" });
      saveReflection(reflection);

      const draft = makeDraft({ content: "Draft entry" });
      saveDraft(draft);

      clearDraft();

      expect(loadDraft()).toBeNull();
      expect(loadReflections().length).toBe(1);
      expect(loadReflections()[0].content).toBe("Committed entry");
    });

    it("loadDraft returns null for stale draft (different date)", () => {
      const draft = makeDraft({ localDate: "2026-08-10" });
      saveDraft(draft);

      const loaded = loadDraft("2026-08-14");
      expect(loaded).toBeNull();
    });

    it("loadDraft returns draft for matching date", () => {
      const draft = makeDraft({ localDate: "2026-08-14" });
      saveDraft(draft);

      const loaded = loadDraft("2026-08-14");
      expect(loaded).not.toBeNull();
      expect(loaded!.localDate).toBe("2026-08-14");
    });
  });

  // -----------------------------------------------------------------------
  // 5. Duplicate save protection (upsert by date)
  // -----------------------------------------------------------------------
  describe("duplicate save protection", () => {
    it("repeated saves for the same date do not create duplicates", () => {
      const reflection1 = makeReflection({
        localDate: "2026-08-14",
        content: "First version",
      });
      saveReflection(reflection1);

      const reflection2 = makeReflection({
        localDate: "2026-08-14",
        content: "Second version",
      });
      saveReflection(reflection2);

      const loaded = loadReflections();
      expect(loaded.length).toBe(1);
      expect(loaded[0].content).toBe("Second version");
    });

    it("updating preserves original ID and createdAt", () => {
      const original = makeReflection({
        localDate: "2026-08-14",
        id: "ref_original_id",
        createdAt: "2026-08-14T08:00:00.000Z",
        content: "Original",
      });
      saveReflection(original);

      const updated = makeReflection({
        localDate: "2026-08-14",
        id: "ref_new_id_should_be_ignored",
        createdAt: "2099-01-01T00:00:00.000Z",
        content: "Updated",
      });
      saveReflection(updated);

      const loaded = loadReflections();
      expect(loaded.length).toBe(1);
      expect(loaded[0].id).toBe("ref_original_id");
      expect(loaded[0].createdAt).toBe("2026-08-14T08:00:00.000Z");
      expect(loaded[0].content).toBe("Updated");
    });

    it("different dates create separate entries", () => {
      saveReflection(makeReflection({ localDate: "2026-08-12", content: "Day 1" }));
      saveReflection(makeReflection({ localDate: "2026-08-13", content: "Day 2" }));
      saveReflection(makeReflection({ localDate: "2026-08-14", content: "Day 3" }));

      const loaded = loadReflections();
      expect(loaded.length).toBe(3);
    });
  });

  // -----------------------------------------------------------------------
  // 6. Edit updates existing entry
  // -----------------------------------------------------------------------
  describe("edit behavior", () => {
    it("editing an existing entry updates it rather than creating a duplicate", () => {
      const original = makeReflection({
        localDate: "2026-08-14",
        content: "Original text",
      });
      saveReflection(original);

      // Simulate edit: load, modify content, save
      const loaded = getReflectionByDate("2026-08-14")!;
      const edited = { ...loaded, content: "Edited text" };
      saveReflection(edited);

      const allReflections = loadReflections();
      expect(allReflections.length).toBe(1);
      expect(allReflections[0].content).toBe("Edited text");
      expect(allReflections[0].id).toBe(original.id);
    });

    it("getReflectionById returns correct entry", () => {
      const targetId = generateReflectionId();
      saveReflection(makeReflection({ id: targetId, localDate: "2026-08-10", content: "Find me" }));
      saveReflection(makeReflection({ localDate: "2026-08-11", content: "Other entry" }));

      const found = getReflectionById(targetId);
      expect(found).not.toBeUndefined();
      expect(found!.content).toBe("Find me");
    });
  });

  // -----------------------------------------------------------------------
  // 7. Delete removes only selected entry
  // -----------------------------------------------------------------------
  describe("delete behavior", () => {
    it("delete removes only the selected entry", () => {
      const id1 = generateReflectionId();
      const id2 = generateReflectionId();
      const id3 = generateReflectionId();

      saveReflection(makeReflection({ id: id1, localDate: "2026-08-12", content: "Entry 1" }));
      saveReflection(makeReflection({ id: id2, localDate: "2026-08-13", content: "Entry 2" }));
      saveReflection(makeReflection({ id: id3, localDate: "2026-08-14", content: "Entry 3" }));

      expect(loadReflections().length).toBe(3);

      const wasDeleted = deleteReflection(id2);
      expect(wasDeleted).toBe(true);

      const remaining = loadReflections();
      expect(remaining.length).toBe(2);
      expect(remaining.find((r) => r.id === id1)).not.toBeUndefined();
      expect(remaining.find((r) => r.id === id2)).toBeUndefined();
      expect(remaining.find((r) => r.id === id3)).not.toBeUndefined();
    });

    it("delete returns false for non-existent ID", () => {
      saveReflection(makeReflection({ content: "Only entry" }));
      const wasDeleted = deleteReflection("nonexistent-id");
      expect(wasDeleted).toBe(false);
      expect(loadReflections().length).toBe(1);
    });
  });

  // -----------------------------------------------------------------------
  // 8. Sorting (newest first)
  // -----------------------------------------------------------------------
  describe("sorting", () => {
    it("records sort newest first by date", () => {
      saveReflection(makeReflection({ localDate: "2026-08-10", content: "Oldest" }));
      saveReflection(makeReflection({ localDate: "2026-08-12", content: "Middle" }));
      saveReflection(makeReflection({ localDate: "2026-08-14", content: "Newest" }));

      const sorted = getSortedReflections();
      expect(sorted.length).toBe(3);
      expect(sorted[0].localDate).toBe("2026-08-14");
      expect(sorted[1].localDate).toBe("2026-08-12");
      expect(sorted[2].localDate).toBe("2026-08-10");
    });
  });

  // -----------------------------------------------------------------------
  // 9. V1 → V2 migration (THE CORE BUG FIX)
  // -----------------------------------------------------------------------
  describe("v1 to v2 migration", () => {
    it("valid legacy v1 records migrate successfully (23-char ID bug)", () => {
      // Simulate v1 storage with records that have 23-char IDs
      // (the actual bug — these would fail v1 validation)
      const v1Data = {
        version: "1" as const,
        reflections: [
          {
            id: "1786671611547-9wvactdbu", // 23 chars — would fail v1 validation
            localDate: "2026-08-10",
            timezone: "America/New_York",
            locale: "en",
            promptIds: ["p1", "p2", "p3"],
            promptCategories: ["sleep-thoughts", "sleep-behaviors", "gratitude"],
            content: "A reflection from the v1 era",
            wordCount: 6,
            createdAt: "2026-08-10T10:00:00.000Z",
            updatedAt: "2026-08-10T10:00:00.000Z",
            syncStatus: "local",
          },
          {
            id: "1786585211000-abcd12345", // another 23-char ID
            localDate: "2026-08-09",
            timezone: "America/New_York",
            locale: "en",
            promptIds: ["q1", "q2", "q3"],
            promptCategories: ["sleep-anxiety", "stimulus-control", "relaxation"],
            content: "Another old reflection",
            wordCount: 3,
            createdAt: "2026-08-09T09:00:00.000Z",
            updatedAt: "2026-08-09T09:00:00.000Z",
            syncStatus: "local",
          },
        ],
      };

      const { storage, migratedCount, quarantinedCount } = migrateV1ToV2(v1Data);

      expect(storage.version).toBe("2");
      expect(migratedCount).toBe(2);
      expect(quarantinedCount).toBe(0);
      expect(storage.reflections.length).toBe(2);
      // IDs are preserved
      expect(storage.reflections[0].id).toBe("1786671611547-9wvactdbu");
      expect(storage.reflections[1].id).toBe("1786585211000-abcd12345");
    });

    it("migrates 'pt' locale to 'pt-BR' content locale", () => {
      const v1Data = {
        version: "1" as const,
        reflections: [
          {
            id: "1786671611547-9wvactdbu",
            localDate: "2026-08-10",
            timezone: "America/Sao_Paulo",
            locale: "pt", // UI locale code — was stored incorrectly
            promptIds: ["p1", "p2", "p3"],
            promptCategories: ["sleep-thoughts", "sleep-behaviors", "gratitude"],
            content: "Minha reflexão",
            wordCount: 2,
            createdAt: "2026-08-10T10:00:00.000Z",
            updatedAt: "2026-08-10T10:00:00.000Z",
            syncStatus: "local",
          },
        ],
      };

      const { storage, migratedCount } = migrateV1ToV2(v1Data);
      expect(migratedCount).toBe(1);
      expect(storage.reflections[0].locale).toBe("pt-BR");
    });

    it("one malformed record does not erase valid records", () => {
      const v1Data = {
        version: "1" as const,
        reflections: [
          // Valid record
          {
            id: "1786671611547-valid",
            localDate: "2026-08-10",
            timezone: "UTC",
            locale: "en",
            promptIds: ["p1", "p2", "p3"],
            promptCategories: ["sleep-thoughts", "sleep-behaviors", "gratitude"],
            content: "Valid reflection",
            wordCount: 2,
            createdAt: "2026-08-10T10:00:00.000Z",
            updatedAt: "2026-08-10T10:00:00.000Z",
            syncStatus: "local",
          },
          // Malformed record (not an object)
          "not a reflection object",
          // Another valid record
          {
            id: "1786585211000-also-valid",
            localDate: "2026-08-09",
            timezone: "UTC",
            locale: "es",
            promptIds: ["q1", "q2", "q3"],
            promptCategories: ["relaxation", "gratitude", "sleep-confidence"],
            content: "Otra reflexión válida",
            wordCount: 3,
            createdAt: "2026-08-09T09:00:00.000Z",
            updatedAt: "2026-08-09T09:00:00.000Z",
            syncStatus: "local",
          },
          // Malformed record (null value)
          null,
        ],
      };

      const { storage, migratedCount, quarantinedCount } = migrateV1ToV2(v1Data);

      expect(migratedCount).toBe(2);
      expect(quarantinedCount).toBe(2);
      expect(storage.reflections.length).toBe(2);
      expect(storage.quarantined?.length).toBe(2);
    });

    it("migrateIfNeeded performs migration when v1 exists and v2 does not", () => {
      // Set up v1 storage
      const v1Data = {
        version: "1",
        reflections: [
          {
            id: "1786671611547-9wvactdbu",
            localDate: "2026-08-10",
            timezone: "UTC",
            locale: "en",
            promptIds: ["p1", "p2", "p3"],
            promptCategories: ["sleep-thoughts", "sleep-behaviors", "gratitude"],
            content: "Migrated reflection",
            wordCount: 2,
            createdAt: "2026-08-10T10:00:00.000Z",
            updatedAt: "2026-08-10T10:00:00.000Z",
            syncStatus: "local",
          },
        ],
      };
      mockStorage.set(REFLECTIONS_STORAGE_KEY_V1, JSON.stringify(v1Data));

      // v2 should not exist yet
      expect(mockStorage.has(REFLECTIONS_STORAGE_KEY_V2)).toBe(false);

      // Load triggers migration
      const loaded = loadReflections();

      expect(loaded.length).toBe(1);
      expect(loaded[0].content).toBe("Migrated reflection");
      expect(mockStorage.has(REFLECTIONS_STORAGE_KEY_V2)).toBe(true);

      // v1 is preserved as backup
      expect(mockStorage.has(REFLECTIONS_STORAGE_KEY_V1)).toBe(true);
    });

    it("migrateIfNeeded is a no-op when v2 already exists", () => {
      // Set up v2 with one entry
      saveReflection(makeReflection({ content: "Already in v2" }));
      const v2Before = mockStorage.get(REFLECTIONS_STORAGE_KEY_V2);

      // Also set up v1 with different data (should NOT be used)
      mockStorage.set(
        REFLECTIONS_STORAGE_KEY_V1,
        JSON.stringify({
          version: "1",
          reflections: [{ id: "old-bad-id", localDate: "2020-01-01", content: "Old data" }],
        }),
      );

      const result = migrateIfNeeded();
      expect(result).toBe(false);

      const v2After = mockStorage.get(REFLECTIONS_STORAGE_KEY_V2);
      expect(v2After).toBe(v2Before);
    });
  });

  // -----------------------------------------------------------------------
  // 10. Storage corruption safety
  // -----------------------------------------------------------------------
  describe("storage corruption safety", () => {
    it("storage corruption does not crash the page — returns empty array", () => {
      // Write garbage
      mockStorage.set(REFLECTIONS_STORAGE_KEY_V2, "{not valid json!!!");

      // Should not throw
      let result: LocalReflection[] = [];
      expect(() => {
        result = loadReflections();
      }).not.toThrow();

      expect(result).toEqual([]);
    });

    it("malformed envelope salvages valid reflections from array", () => {
      // Valid reflections array but bad envelope (missing version)
      const corrupted = {
        // missing version field
        reflections: [
          makeReflection({
            id: "ref_salvage_1",
            localDate: "2026-08-13",
            content: "Salvageable 1",
          }),
          makeReflection({
            id: "ref_salvage_2",
            localDate: "2026-08-14",
            content: "Salvageable 2",
          }),
        ],
      };
      mockStorage.set(REFLECTIONS_STORAGE_KEY_V2, JSON.stringify(corrupted));

      const loaded = loadReflections();
      expect(loaded.length).toBe(2);
      expect(loaded[0].content).toContain("Salvageable");
    });

    it("filterValidReflections skips invalid items silently", () => {
      const items = [
        makeReflection({ content: "Good 1" }),
        { garbage: true },
        makeReflection({ content: "Good 2" }),
        null,
        "string not object",
      ];

      const valid = filterValidReflections(items);
      expect(valid.length).toBe(2);
      expect(valid[0].content).toBe("Good 1");
      expect(valid[1].content).toBe("Good 2");
    });
  });

  // -----------------------------------------------------------------------
  // 11. Offline / anonymous usage
  // -----------------------------------------------------------------------
  describe("offline / anonymous usage", () => {
    it("save and load work without any network or auth", () => {
      // Pure localStorage — no API calls, no network
      const reflection = makeReflection({ content: "Offline reflection" });
      saveReflection(reflection);

      const loaded = loadReflections();
      expect(loaded.length).toBe(1);
      expect(loaded[0].syncStatus).toBe("local");
      expect(loaded[0].content).toBe("Offline reflection");
    });

    it("new entries have syncStatus 'local' by default", () => {
      saveReflection(makeReflection({ content: "Local only" }));
      const loaded = loadReflections();
      expect(loaded[0].syncStatus).toBe("local");
    });
  });

  // -----------------------------------------------------------------------
  // 12. Privacy: reflection text not in storage keys or analytics
  // -----------------------------------------------------------------------
  describe("privacy guarantees", () => {
    it("storage keys do not contain reflection text", () => {
      const privateContent = "MY SECRET THOUGHTS ABOUT SLEEP";
      saveReflection(makeReflection({ content: privateContent }));

      // Check all keys in storage — none should contain the private text
      for (const key of mockStorage.keys()) {
        expect(key).not.toContain("SECRET");
        expect(key).not.toContain("MY SECRET");
      }
    });

    it("reflection content is only in the value, not the key", () => {
      const content = "unique-content-string-xyz";
      saveReflection(makeReflection({ content }));

      // Only the v2 storage key exists
      expect(mockStorage.has(REFLECTIONS_STORAGE_KEY_V2)).toBe(true);

      // Key name doesn't leak content
      expect(REFLECTIONS_STORAGE_KEY_V2).not.toContain("unique-content");
    });
  });

  // -----------------------------------------------------------------------
  // 13. Storage schema validation
  // -----------------------------------------------------------------------
  describe("storage schema validation", () => {
    it("validateReflectionStorage accepts valid v2 storage", () => {
      const storage = {
        version: "2" as const,
        reflections: [makeReflection()],
        quarantined: [],
      };
      const result = validateReflectionStorage(storage);
      expect(result).not.toBeNull();
    });

    it("validateReflectionStorage rejects wrong version", () => {
      const storage = {
        version: "999",
        reflections: [],
      };
      const result = validateReflectionStorage(storage);
      expect(result).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // 14. Date-based lookup
  // -----------------------------------------------------------------------
  describe("date-based lookup", () => {
    it("getReflectionByDate returns correct entry", () => {
      saveReflection(makeReflection({ localDate: "2026-08-14", content: "Today" }));
      saveReflection(makeReflection({ localDate: "2026-08-13", content: "Yesterday" }));

      const found = getReflectionByDate("2026-08-13");
      expect(found).not.toBeUndefined();
      expect(found!.content).toBe("Yesterday");
    });

    it("getReflectionByDate returns undefined for missing date", () => {
      saveReflection(makeReflection({ localDate: "2026-08-14" }));
      expect(getReflectionByDate("2020-01-01")).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // 15. Quota exceeded throws appropriately
  // -----------------------------------------------------------------------
  describe("quota handling", () => {
    it("saveReflections throws on quota exceeded", () => {
      // Mock setItem to throw QuotaExceededError
      const originalSet = mockStorage.set.bind(mockStorage);
      mockStorage.set = () => {
        const err = new Error("Quota exceeded");
        err.name = "QuotaExceededError";
        throw err;
      };

      expect(() => {
        saveReflection(makeReflection());
      }).toThrow("Storage quota exceeded");

      // Restore
      mockStorage.set = originalSet;
    });
  });

  // -----------------------------------------------------------------------
  // 16. SSR safety (no window)
  // -----------------------------------------------------------------------
  describe("SSR safety", () => {
    it("loadReflections returns empty array when window is not available", () => {
      // Remove window
      delete (globalThis as any).window;

      const result = loadReflections();
      expect(result).toEqual([]);

      // Restore for other tests
      Object.defineProperty(globalThis, "window", {
        value: { localStorage: mockStorage as any },
        configurable: true,
        writable: true,
      });
    });

    it("saveReflection throws when localStorage not available", () => {
      delete (globalThis as any).window;

      expect(() => {
        saveReflection(makeReflection());
      }).toThrow("localStorage not available");

      Object.defineProperty(globalThis, "window", {
        value: { localStorage: mockStorage as any },
        configurable: true,
        writable: true,
      });
    });
  });

  // -----------------------------------------------------------------------
  // 17. ID policy (known formats only)
  // -----------------------------------------------------------------------
  describe("ID policy validation", () => {
    it("canonical ref_ IDs pass isCanonicalReflectionId", () => {
      expect(isCanonicalReflectionId("ref_1786671611547_9wvactdbu")).toBe(true);
      expect(isCanonicalReflectionId(generateReflectionId())).toBe(true);
    });

    it("UUID and v1 timestamp IDs are known but not canonical", () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      const v1Id = "1786671611547-9wvactdbu";

      expect(isKnownReflectionId(uuid)).toBe(true);
      expect(isKnownReflectionId(v1Id)).toBe(true);

      expect(isCanonicalReflectionId(uuid)).toBe(false);
      expect(isCanonicalReflectionId(v1Id)).toBe(false);
    });

    it("unknown ID formats are rejected by isKnownReflectionId", () => {
      expect(isKnownReflectionId("")).toBe(false);
      expect(isKnownReflectionId("abc")).toBe(false);
      expect(isKnownReflectionId("my-custom-id")).toBe(false);
      expect(isKnownReflectionId("ref_")).toBe(false);
      expect(isKnownReflectionId("123")).toBe(false);
    });

    it("isValidReflectionId matches canonical format", () => {
      expect(isValidReflectionId(generateReflectionId())).toBe(true);
      expect(isValidReflectionId("bad-id")).toBe(false);
    });

    it("reflections with known ID formats are accepted on load", () => {
      // v1 timestamp ID (23 chars)
      saveReflection(makeReflection({ id: "1786671611547-9wvactdbu" }));
      // UUID
      saveReflection(
        makeReflection({
          id: "550e8400-e29b-41d4-a716-446655440000",
          localDate: "2026-08-13",
        }),
      );
      // Canonical
      saveReflection(
        makeReflection({
          id: generateReflectionId(),
          localDate: "2026-08-12",
        }),
      );

      const loaded = loadReflections();
      expect(loaded.length).toBe(3);
    });
  });

  // -----------------------------------------------------------------------
  // 18. Idempotent v1 → v2 merge migration
  // -----------------------------------------------------------------------
  describe("idempotent v1 → v2 merge migration", () => {
    it("repeated migrateV1ToV2 calls produce same result (no duplicates)", () => {
      const v1Data = {
        version: "1" as const,
        reflections: [
          {
            id: "1786671611547-9wvactdbu",
            localDate: "2026-08-10",
            timezone: "UTC",
            locale: "en",
            promptIds: ["p1", "p2", "p3"],
            promptCategories: ["sleep-thoughts", "sleep-behaviors", "gratitude"],
            content: "First v1 reflection",
            wordCount: 3,
            createdAt: "2026-08-10T10:00:00.000Z",
            updatedAt: "2026-08-10T10:00:00.000Z",
            syncStatus: "local",
          },
        ],
      };

      const { storage: first } = migrateV1ToV2(v1Data);
      expect(first.reflections.length).toBe(1);

      // Second call with same v1 data, starting from first result
      const { storage: second, skippedDuplicates } = migrateV1ToV2(v1Data, first);
      expect(second.reflections.length).toBe(1); // No duplicate
      expect(skippedDuplicates).toBe(1);
    });

    it("v2-existing-empty + v1-populated migrates all records", () => {
      // Set up empty v2
      const emptyV2 = { version: "2" as const, reflections: [], quarantined: [] };

      const v1Data = {
        version: "1" as const,
        reflections: [
          {
            id: "1786671611547-9wvactdbu",
            localDate: "2026-08-10",
            timezone: "UTC",
            locale: "en",
            promptIds: ["p1"],
            promptCategories: ["gratitude"],
            content: "From v1",
            wordCount: 2,
            createdAt: "2026-08-10T10:00:00.000Z",
            updatedAt: "2026-08-10T10:00:00.000Z",
            syncStatus: "local",
          },
          {
            id: "1786585211000-abcd12345",
            localDate: "2026-08-09",
            timezone: "UTC",
            locale: "en",
            promptIds: ["p2"],
            promptCategories: ["relaxation"],
            content: "Also from v1",
            wordCount: 3,
            createdAt: "2026-08-09T10:00:00.000Z",
            updatedAt: "2026-08-09T10:00:00.000Z",
            syncStatus: "local",
          },
        ],
      };

      const { storage, migratedCount, skippedDuplicates } = migrateV1ToV2(v1Data, emptyV2);
      expect(migratedCount).toBe(2);
      expect(skippedDuplicates).toBe(0);
      expect(storage.reflections.length).toBe(2);
    });

    it("v2-populated + v1-overlapping skips duplicates", () => {
      // Set up v2 with one entry
      const v2WithEntry = {
        version: "2" as const,
        reflections: [
          makeReflection({
            id: "1786671611547-9wvactdbu", // Same ID as v1
            localDate: "2026-08-10",
            content: "Already in v2",
          }),
        ],
        quarantined: [],
      };

      const v1Data = {
        version: "1" as const,
        reflections: [
          {
            id: "1786671611547-9wvactdbu", // Overlapping
            localDate: "2026-08-10",
            timezone: "UTC",
            locale: "en",
            promptIds: ["p1"],
            promptCategories: ["gratitude"],
            content: "From v1",
            wordCount: 2,
            createdAt: "2026-08-10T10:00:00.000Z",
            updatedAt: "2026-08-10T10:00:00.000Z",
            syncStatus: "local",
          },
        ],
      };

      const { storage, migratedCount, skippedDuplicates } = migrateV1ToV2(v1Data, v2WithEntry);
      expect(migratedCount).toBe(0);
      expect(skippedDuplicates).toBe(1);
      expect(storage.reflections.length).toBe(1);
      // Content from v2 is preserved (v2 wins on overlap)
      expect(storage.reflections[0].content).toBe("Already in v2");
    });

    it("v2-populated + v1-unique merges new entries", () => {
      const v2WithEntry = {
        version: "2" as const,
        reflections: [
          makeReflection({
            id: "ref_existing_v2",
            localDate: "2026-08-10",
            content: "Already in v2",
          }),
        ],
        quarantined: [],
      };

      const v1Data = {
        version: "1" as const,
        reflections: [
          {
            id: "1786585211000-abcd12345",
            localDate: "2026-08-09", // Different date
            timezone: "UTC",
            locale: "en",
            promptIds: ["p2"],
            promptCategories: ["relaxation"],
            content: "Unique from v1",
            wordCount: 3,
            createdAt: "2026-08-09T10:00:00.000Z",
            updatedAt: "2026-08-09T10:00:00.000Z",
            syncStatus: "local",
          },
        ],
      };

      const { storage, migratedCount, skippedDuplicates } = migrateV1ToV2(v1Data, v2WithEntry);
      expect(migratedCount).toBe(1);
      expect(skippedDuplicates).toBe(0);
      expect(storage.reflections.length).toBe(2);
    });

    it("non-object v1 records are quarantined, salvageable objects are migrated", () => {
      const v1Data = {
        version: "1" as const,
        reflections: [
          {
            id: "1786671611547-valid1",
            localDate: "2026-08-10",
            timezone: "UTC",
            locale: "en",
            promptIds: ["p1"],
            promptCategories: ["gratitude"],
            content: "Valid 1",
            wordCount: 2,
            createdAt: "2026-08-10T10:00:00.000Z",
            updatedAt: "2026-08-10T10:00:00.000Z",
            syncStatus: "local",
          },
          // Salvageable: bad localDate but migration derives from createdAt
          {
            id: "1786000000000-baddate",
            localDate: "not-a-date",
            timezone: "UTC",
            locale: "en",
            promptIds: ["p1"],
            promptCategories: ["gratitude"],
            content: "Bad date but salvageable",
            wordCount: 4,
            createdAt: "2026-08-09T10:00:00.000Z",
            updatedAt: "2026-08-09T10:00:00.000Z",
            syncStatus: "local",
          },
          {
            id: "1786585211000-valid2",
            localDate: "2026-08-08",
            timezone: "UTC",
            locale: "en",
            promptIds: ["p2"],
            promptCategories: ["relaxation"],
            content: "Valid 2",
            wordCount: 2,
            createdAt: "2026-08-08T10:00:00.000Z",
            updatedAt: "2026-08-08T10:00:00.000Z",
            syncStatus: "local",
          },
          "just a string", // Malformed: not an object — quarantined
          null, // Malformed: null — quarantined
        ],
      };

      const { storage, migratedCount, quarantinedCount } = migrateV1ToV2(v1Data);
      // All object records are salvageable (migration fills in defaults)
      expect(migratedCount).toBe(3);
      // Only non-objects are quarantined
      expect(quarantinedCount).toBe(2);
      expect(storage.reflections.length).toBe(3);
      expect(storage.quarantined?.length).toBe(2);

      // The bad-date record was salvaged with a derived date
      const salvaged = storage.reflections.find((r) => r.id === "1786000000000-baddate");
      expect(salvaged).not.toBeUndefined();
      expect(salvaged?.localDate).toBe("2026-08-09"); // Derived from createdAt
    });

    it("unknown but salvageable legacy IDs get new canonical ID with legacyId trace", () => {
      const v1Data = {
        version: "1" as const,
        reflections: [
          {
            id: "my-old-custom-id-123", // Unknown format
            localDate: "2026-08-10",
            timezone: "UTC",
            locale: "en",
            promptIds: ["p1"],
            promptCategories: ["gratitude"],
            content: "Legacy with unknown ID",
            wordCount: 4,
            createdAt: "2026-08-10T10:00:00.000Z",
            updatedAt: "2026-08-10T10:00:00.000Z",
            syncStatus: "local",
          },
        ],
      };

      const { storage } = migrateV1ToV2(v1Data);
      expect(storage.reflections.length).toBe(1);

      const migrated = storage.reflections[0];
      // New ID is canonical format
      expect(isCanonicalReflectionId(migrated.id)).toBe(true);
      // Legacy ID preserved for traceability
      expect(migrated.legacyId).toBe("my-old-custom-id-123");
    });

    it("runMigrations is idempotent — second call is no-op", () => {
      // Set up v1 storage
      const v1Data = {
        version: "1",
        reflections: [
          {
            id: "1786671611547-9wvactdbu",
            localDate: "2026-08-10",
            timezone: "UTC",
            locale: "en",
            promptIds: ["p1"],
            promptCategories: ["gratitude"],
            content: "Test migration",
            wordCount: 2,
            createdAt: "2026-08-10T10:00:00.000Z",
            updatedAt: "2026-08-10T10:00:00.000Z",
            syncStatus: "local",
          },
        ],
      };
      mockStorage.set(REFLECTIONS_STORAGE_KEY_V1, JSON.stringify(v1Data));

      // First run
      runMigrations();
      const afterFirst = loadReflections();
      expect(afterFirst.length).toBe(1);

      // Second run should be a no-op
      runMigrations();
      const afterSecond = loadReflections();
      expect(afterSecond.length).toBe(1);
      expect(afterSecond[0].id).toBe(afterFirst[0].id);
    });
  });

  // -----------------------------------------------------------------------
  // 19. Legacy sync key migration
  // -----------------------------------------------------------------------
  describe("legacy sync client key migration", () => {
    it("records in legacy 'reflections' key are migrated into v2", () => {
      const legacySyncData = {
        version: "1",
        reflections: [
          {
            id: "ref_from_old_sync",
            localDate: "2026-07-01",
            timezone: "America/New_York",
            locale: "en",
            promptIds: ["p1", "p2"],
            promptCategories: ["gratitude", "relaxation"],
            content: "I was in the old sync key",
            wordCount: 6,
            createdAt: "2026-07-01T10:00:00.000Z",
            updatedAt: "2026-07-01T10:00:00.000Z",
            syncStatus: "synced",
          },
        ],
        lastSyncedAt: "2026-07-01T12:00:00.000Z",
      };
      mockStorage.set(REFLECTIONS_SYNC_LEGACY_KEY, JSON.stringify(legacySyncData));

      runMigrations();

      const loaded = loadReflections();
      expect(loaded.length).toBe(1);
      expect(loaded[0].content).toBe("I was in the old sync key");
      expect(loaded[0].syncStatus).toBe("synced");

      // Migration marker set
      const rawV2 = JSON.parse(mockStorage.get(REFLECTIONS_STORAGE_KEY_V2) || "{}");
      expect(rawV2.syncLegacyMigrated).toBe(true);
    });

    it("v2 data is preserved when sync legacy key is empty", () => {
      saveReflection(makeReflection({ content: "Already in v2" }));

      runMigrations();

      const loaded = loadReflections();
      expect(loaded.length).toBe(1);
      expect(loaded[0].content).toBe("Already in v2");
    });
  });

  // -----------------------------------------------------------------------
  // 20. Sync adapter (canonical repository)
  // -----------------------------------------------------------------------
  describe("sync adapter integration", () => {
    it("loadSyncReflections returns committed history only (no drafts)", () => {
      saveReflection(makeReflection({ content: "Committed entry" }));
      saveDraft(makeDraft({ content: "Draft entry" }));

      const syncData = loadSyncReflections();
      expect(syncData.length).toBe(1);
      expect(syncData[0].content).toBe("Committed entry");
    });

    it("mergeSyncReflections adds new server records to local", () => {
      saveReflection(
        makeReflection({
          id: "ref_local_only",
          localDate: "2026-08-14",
          content: "Local only",
        }),
      );

      const serverData = [
        {
          id: "ref_from_server",
          localDate: "2026-08-13",
          timezone: "UTC",
          locale: "en",
          promptIds: ["p1"],
          promptCategories: ["gratitude"],
          content: "From server",
          wordCount: 2,
          createdAt: "2026-08-13T10:00:00.000Z",
          updatedAt: "2026-08-13T10:00:00.000Z",
        },
      ];

      const merged = mergeSyncReflections(serverData);
      expect(merged.length).toBe(2);

      // Local record preserved
      const local = merged.find((r) => r.id === "ref_local_only");
      expect(local).not.toBeUndefined();

      // Server record added with synced status
      const serverRec = merged.find((r) => r.id === "ref_from_server");
      expect(serverRec).not.toBeUndefined();
      expect(serverRec?.syncStatus).toBe("synced");
    });

    it("mergeSyncReflections — server wins on same-ID conflict when server is newer", () => {
      saveReflection(
        makeReflection({
          id: "ref_shared",
          localDate: "2026-08-14",
          content: "Local version",
          updatedAt: "2026-08-14T08:00:00.000Z",
        }),
      );

      const serverData = [
        {
          id: "ref_shared",
          localDate: "2026-08-14",
          timezone: "UTC",
          locale: "en",
          promptIds: ["p1"],
          promptCategories: ["gratitude"],
          content: "Server version (newer)",
          wordCount: 3,
          createdAt: "2026-08-14T08:00:00.000Z",
          updatedAt: "2026-08-14T12:00:00.000Z",
        },
      ];

      const merged = mergeSyncReflections(serverData);
      expect(merged.length).toBe(1);
      expect(merged[0].content).toBe("Server version (newer)");
      expect(merged[0].syncStatus).toBe("synced");
    });

    it("mergeSyncReflections — local newer content stays pending for re-upload", () => {
      saveReflection(
        makeReflection({
          id: "ref_shared",
          localDate: "2026-08-14",
          content: "Local version (much newer)",
          updatedAt: "2026-08-14T15:00:00.000Z",
          syncStatus: "local",
        }),
      );

      const serverData = [
        {
          id: "ref_shared",
          localDate: "2026-08-14",
          timezone: "UTC",
          locale: "en",
          promptIds: ["p1"],
          promptCategories: ["gratitude"],
          content: "Server version (older)",
          wordCount: 3,
          createdAt: "2026-08-14T08:00:00.000Z",
          updatedAt: "2026-08-14T08:00:00.000Z",
        },
      ];

      const merged = mergeSyncReflections(serverData);
      expect(merged.length).toBe(1);
      // Local wins because it's significantly newer
      expect(merged[0].content).toBe("Local version (much newer)");
      // Marked pending — needs upload
      expect(merged[0].syncStatus).toBe("pending");
    });

    it("mergeSyncReflections — different IDs but same date creates conflict", () => {
      saveReflection(
        makeReflection({
          id: "ref_local_id",
          localDate: "2026-08-14",
          content: "Local content",
        }),
      );

      const serverData = [
        {
          id: "ref_server_id", // Different ID
          localDate: "2026-08-14", // Same date
          timezone: "UTC",
          locale: "en",
          promptIds: ["p1"],
          promptCategories: ["gratitude"],
          content: "Server content",
          wordCount: 2,
          createdAt: "2026-08-14T10:00:00.000Z",
          updatedAt: "2026-08-14T10:00:00.000Z",
        },
      ];

      const merged = mergeSyncReflections(serverData);
      // Both records kept
      expect(merged.length).toBe(2);
      // Server record marked as conflict
      const serverRec = merged.find((r) => r.id === "ref_server_id");
      expect(serverRec?.syncStatus).toBe("conflict");
    });

    it("markReflectionsSynced only marks specified IDs", () => {
      saveReflection(
        makeReflection({ id: "ref_a", localDate: "2026-08-14", syncStatus: "pending" }),
      );
      saveReflection(
        makeReflection({ id: "ref_b", localDate: "2026-08-13", syncStatus: "pending" }),
      );
      saveReflection(makeReflection({ id: "ref_c", localDate: "2026-08-12", syncStatus: "local" }));

      markReflectionsSynced(["ref_a", "ref_c"]);

      const loaded = loadReflections();
      expect(loaded.find((r) => r.id === "ref_a")?.syncStatus).toBe("synced");
      expect(loaded.find((r) => r.id === "ref_b")?.syncStatus).toBe("pending");
      expect(loaded.find((r) => r.id === "ref_c")?.syncStatus).toBe("synced");
    });
  });

  // -----------------------------------------------------------------------
  // 21. Sign-in / sign-out behavior
  // -----------------------------------------------------------------------
  describe("sign-in and sign-out data integrity", () => {
    it("sign-in does not erase local reflections", () => {
      saveReflection(
        makeReflection({
          id: "ref_local_1",
          localDate: "2026-08-14",
          content: "My local reflection",
          syncStatus: "local",
        }),
      );

      const serverReflections = [
        {
          id: "ref_server_1",
          localDate: "2026-08-10",
          timezone: "UTC",
          locale: "en",
          promptIds: ["p1"],
          promptCategories: ["gratitude"],
          content: "Server reflection",
          wordCount: 2,
          createdAt: "2026-08-10T10:00:00.000Z",
          updatedAt: "2026-08-10T10:00:00.000Z",
        },
      ];

      handleSignInSync(serverReflections);

      const loaded = loadReflections();
      expect(loaded.length).toBe(2);
      // Local data preserved
      const local = loaded.find((r) => r.id === "ref_local_1");
      expect(local).not.toBeUndefined();
      expect(local?.content).toBe("My local reflection");
      // Local record marked pending for upload
      expect(local?.syncStatus).toBe("pending");
    });

    it("sign-out does not erase local data (sync status reset to local)", () => {
      saveReflection(
        makeReflection({
          id: "ref_synced",
          localDate: "2026-08-14",
          content: "Synced reflection",
          syncStatus: "synced",
        }),
      );
      saveReflection(
        makeReflection({
          id: "ref_pending",
          localDate: "2026-08-13",
          content: "Pending reflection",
          syncStatus: "pending",
        }),
      );

      handleSignOut();

      const loaded = loadReflections();
      expect(loaded.length).toBe(2);
      // Both reset to "local" — user is anonymous again
      expect(loaded[0].syncStatus).toBe("local");
      expect(loaded[1].syncStatus).toBe("local");
      // Content preserved
      expect(loaded.find((r) => r.id === "ref_synced")?.content).toBe("Synced reflection");
      expect(loaded.find((r) => r.id === "ref_pending")?.content).toBe("Pending reflection");
    });

    it("sign-out preserves drafts", () => {
      saveReflection(makeReflection({ content: "Committed" }));
      saveDraft(makeDraft({ content: "In progress draft" }));

      handleSignOut();

      expect(loadDraft()?.content).toBe("In progress draft");
      expect(loadReflections().length).toBe(1);
    });

    it("lastSyncedAt survives save/load and is cleared on sign-out", () => {
      setLastSyncedAt("2026-08-14T10:00:00.000Z");
      expect(getLastSyncedAt()).toBe("2026-08-14T10:00:00.000Z");

      handleSignOut();
      expect(getLastSyncedAt()).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // 22. Word count recomputation from content
  // -----------------------------------------------------------------------
  describe("word count normalization", () => {
    it("migration recomputes word count from content", () => {
      const v1Data = {
        version: "1" as const,
        reflections: [
          {
            id: "1786671611547-badwc",
            localDate: "2026-08-10",
            timezone: "UTC",
            locale: "en",
            promptIds: ["p1"],
            promptCategories: ["gratitude"],
            content: "This has five words total",
            wordCount: 999, // Corrupted
            createdAt: "2026-08-10T10:00:00.000Z",
            updatedAt: "2026-08-10T10:00:00.000Z",
            syncStatus: "local",
          },
        ],
      };

      const { storage } = migrateV1ToV2(v1Data);
      expect(storage.reflections.length).toBe(1);
      // Word count should be recomputed from content, not trust the corrupted value
      expect(storage.reflections[0].wordCount).toBe(countWords("This has five words total"));
      expect(storage.reflections[0].wordCount).not.toBe(999);
    });
  });
});

// ============================================================================
// Locale dictionary completeness checks
// ============================================================================

describe("reflection-ui locale completeness", () => {
  it("all supported locale dictionaries contain the new timeline keys", async () => {
    const [
      { EN_REFLECTION_UI },
      { ES_REFLECTION_UI },
      { PT_BR_REFLECTION_UI },
      { PL_REFLECTION_UI },
    ] = await Promise.all([
      import("@/content/en/diary/reflection-ui"),
      import("@/content/es/diary/reflection-ui"),
      import("@/content/pt-BR/diary/reflection-ui"),
      import("@/content/pl/diary/reflection-ui"),
    ]);

    const dicts = [EN_REFLECTION_UI, ES_REFLECTION_UI, PT_BR_REFLECTION_UI, PL_REFLECTION_UI];

    // Check that all required top-level keys exist in every locale
    const requiredTopKeys: (keyof typeof EN_REFLECTION_UI)[] = [
      "title",
      "saveButton",
      "saveChangesButton",
      "timeline",
      "toast",
      "accessibility",
      "stats",
    ];

    for (const dict of dicts) {
      for (const key of requiredTopKeys) {
        expect(dict[key], `Missing key: ${key}`).toBeDefined();
      }
    }

    // Check timeline sub-keys
    const timelineKeys: (keyof typeof EN_REFLECTION_UI.timeline)[] = [
      "tabToday",
      "tabTimeline",
      "title",
      "empty",
      "emptyCta",
      "today",
      "yesterday",
      "savedLocally",
      "synced",
      "pending",
      "expand",
      "collapse",
      "edit",
      "copy",
      "copied",
      "delete",
      "deleteConfirm",
      "deleteConfirmAction",
      "cancel",
      "total",
    ];

    for (const dict of dicts) {
      for (const key of timelineKeys) {
        expect(dict.timeline[key], `Missing timeline key: ${key}`).toBeDefined();
        expect(typeof dict.timeline[key]).toBe("string");
        expect(dict.timeline[key]!.length).toBeGreaterThan(0);
      }
    }

    // Check accessibility sub-keys
    const a11yKeys: (keyof typeof EN_REFLECTION_UI.accessibility)[] = [
      "expandEntry",
      "collapseEntry",
      "editEntry",
      "copyEntry",
      "deleteEntry",
      "timelineTab",
      "todayTab",
    ];

    for (const dict of dicts) {
      for (const key of a11yKeys) {
        expect(dict.accessibility[key], `Missing a11y key: ${key}`).toBeDefined();
        expect(typeof dict.accessibility[key]).toBe("string");
      }
    }

    // Check toast sub-keys
    const toastKeys: (keyof typeof EN_REFLECTION_UI.toast)[] = [
      "saved",
      "saveError",
      "deleted",
      "deleteError",
      "copied",
      "copyError",
    ];

    for (const dict of dicts) {
      for (const key of toastKeys) {
        expect(dict.toast[key], `Missing toast key: ${key}`).toBeDefined();
      }
    }
  });
});
