import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  loadProgramProgress,
  loadProgramProgressResult,
  saveProgramProgress,
  clearProgramProgress,
  exportProgramData,
  deleteAllProgramData,
  isUnsupportedSchema,
  checkSchemaVersion,
  SUPPORTED_PROGRAM_SCHEMA_VERSION,
} from "./storage";
import type { ProgramProgress } from "./types";
import { createInitialProgress } from "./service";
import { getProgramDefinition } from "./definition";

// =============================================================================
// Mock localStorage for tests
// =============================================================================

const mockStorage = new Map<string, string>();

beforeEach(() => {
  mockStorage.clear();
  const mockLocalStorage: Storage = {
    getItem: (key: string) => mockStorage.get(key) ?? null,
    setItem: (key: string, value: string) => { mockStorage.set(key, value); },
    removeItem: (key: string) => { mockStorage.delete(key); },
    clear: () => { mockStorage.clear(); },
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
});

afterEach(() => {
  delete (globalThis as any).window;
  delete (globalThis as any).localStorage;
  mockStorage.clear();
  vi.useRealTimers();
});

// =============================================================================
// Tests
// =============================================================================

const definition = getProgramDefinition();

// Helper: narrow loaded result to ProgramProgress (assert it's not unsupported schema)
function asProgress(result: ReturnType<typeof loadProgramProgress>): ProgramProgress {
  expect(isUnsupportedSchema(result)).toBe(false);
  return result as ProgramProgress;
}

describe("program/storage", () => {
  describe("loadProgramProgress", () => {
    it("returns initial progress when nothing stored", () => {
      const p = asProgress(loadProgramProgress(definition));
      expect(p.status).toBe("not_started");
      expect(p.completedLessonIds).toEqual([]);
    });

    it("loads stored canonical progress", () => {
      const initial = createInitialProgress();
      const withLesson: ProgramProgress = {
        ...initial,
        status: "active",
        startedAt: "2026-01-01T00:00:00.000Z",
        currentWeekId: "week-1",
        completedLessonIds: [definition.lessons[0].id],
      };
      saveProgramProgress(withLesson);

      const loaded = asProgress(loadProgramProgress(definition));
      expect(loaded.status).toBe("active");
      expect(loaded.completedLessonIds).toContain(definition.lessons[0].id);
    });

    it("migrates legacy localStorage key (cbtiProgramProgress)", () => {
      const legacyData = {
        completedLessons: [definition.lessons[0].id, definition.lessons[1].id],
      };
      mockStorage.set("cbtiProgramProgress", JSON.stringify(legacyData));

      const loaded = asProgress(loadProgramProgress(definition));
      expect(loaded.status).toBe("active");
      expect(loaded.completedLessonIds).toHaveLength(2);
    });

    it("ignores malformed JSON in canonical key", () => {
      mockStorage.set("somna:program-progress:v1", "not-json{{{");

      const loaded = asProgress(loadProgramProgress(definition));
      expect(loaded.status).toBe("not_started");
    });
  });

  describe("saveProgramProgress", () => {
    it("saves to canonical key", () => {
      const p = createInitialProgress();
      saveProgramProgress(p);

      const raw = mockStorage.get("somna:program-progress:v1");
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw!);
      expect(parsed.schemaVersion).toBe(1);
    });

    it("writes progress with updatedAt timestamp", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));

      const p = createInitialProgress();
      const beforeTime = p.updatedAt;
      saveProgramProgress(p);

      const raw = mockStorage.get("somna:program-progress:v1");
      const saved = JSON.parse(raw!);
      // The save should happen — updatedAt in storage will be whatever was on the progress object.
      // We just verify that saveProgramProgress actually persists the data.
      expect(saved.status).toBe("not_started");
      expect(saved.updatedAt).toBe(beforeTime);

      vi.useRealTimers();
    });
  });

  describe("clearProgramProgress", () => {
    it("clears canonical key", () => {
      const p = createInitialProgress();
      saveProgramProgress(p);
      expect(mockStorage.get("somna:program-progress:v1")).toBeTruthy();

      clearProgramProgress();
      expect(mockStorage.get("somna:program-progress:v1")).toBeUndefined();
    });

    it("also clears legacy key", () => {
      mockStorage.set("cbtiProgramProgress", JSON.stringify({ completedLessons: [] }));
      clearProgramProgress();
      expect(mockStorage.get("cbtiProgramProgress")).toBeUndefined();
    });
  });

  describe("exportProgramData", () => {
    it("exports progress and plans bundle when there is progress", () => {
      const p: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        startedAt: "2026-01-01T00:00:00.000Z",
        currentWeekId: "week-1",
        completedLessonIds: [definition.lessons[0].id],
      };
      saveProgramProgress(p);

      const exp = exportProgramData(definition);
      expect(exp.schemaVersion).toBe(1);
      expect(exp.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(exp.progress).toBeDefined();
      expect(exp.progress?.status).toBe("active");
      expect(exp.plans).toBeDefined();
      expect(Array.isArray(exp.plans)).toBe(true);
    });

    it("returns progress: null when no progress has been made", () => {
      const exp = exportProgramData(definition);
      expect(exp.progress).toBeNull();
      expect(exp.plans).toEqual([]);
    });
  });

  describe("forward-schema guard", () => {
    it("checkSchemaVersion returns ok for current schema", () => {
      const result = checkSchemaVersion({ schemaVersion: 1 });
      expect(result.ok).toBe(true);
    });

    it("checkSchemaVersion returns ok for legacy (no schemaVersion)", () => {
      const result = checkSchemaVersion({ completedLessons: ["a"] });
      expect(result.ok).toBe(true);
    });

    it("checkSchemaVersion returns ok for null/missing", () => {
      expect(checkSchemaVersion(null).ok).toBe(true);
      expect(checkSchemaVersion(undefined).ok).toBe(true);
    });

    it("checkSchemaVersion detects future schema version", () => {
      const result = checkSchemaVersion({ schemaVersion: 999 });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.storedVersion).toBe(999);
        expect(result.supportedVersion).toBe(SUPPORTED_PROGRAM_SCHEMA_VERSION);
      }
    });

    it("loadProgramProgress returns unsupported schema for future version", () => {
      const futureData = {
        schemaVersion: 999,
        programId: "cbti-core",
        programVersion: 1,
        status: "active",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: null,
        currentWeekId: "week-3",
        completedLessonIds: ["lesson-1", "lesson-2", "lesson-3"],
        skippedLessonIds: [],
        acceptedPlanIds: [],
        dismissedRecommendationIds: [],
        milestones: [],
        updatedAt: "2026-01-02T00:00:00.000Z",
        mysteriousNewField: "some-future-data",
      };
      mockStorage.set("somna:program-progress:v1", JSON.stringify(futureData));

      const loaded = loadProgramProgress(definition);
      expect(isUnsupportedSchema(loaded)).toBe(true);
      if (isUnsupportedSchema(loaded)) {
        expect(loaded.storedSchemaVersion).toBe(999);
        expect(loaded.supportedSchemaVersion).toBe(SUPPORTED_PROGRAM_SCHEMA_VERSION);
        // Raw data is preserved
        expect(loaded.raw).toEqual(futureData);
        // Fallback is safe initial state
        expect(loaded.fallback.status).toBe("not_started");
        expect(loaded.fallback.completedLessonIds).toEqual([]);
      }
    });

    it("loadProgramProgress preserves legacy data even when future schema is in canonical key", () => {
      // Put a future schema in canonical key
      const futureData = { schemaVersion: 999, stuff: "future" };
      mockStorage.set("somna:program-progress:v1", JSON.stringify(futureData));

      const loaded = loadProgramProgress(definition);
      expect(isUnsupportedSchema(loaded)).toBe(true);

      // The canonical key should NOT be modified
      const storedRaw = mockStorage.get("somna:program-progress:v1");
      expect(storedRaw).toBeTruthy();
      const stored = JSON.parse(storedRaw!);
      expect(stored.schemaVersion).toBe(999);
      expect(stored.stuff).toBe("future");
    });

    it("saveProgramProgress is blocked when stored schema is newer", () => {
      // Put a future schema in storage
      const futureData = { schemaVersion: 999, data: "future-stuff" };
      mockStorage.set("somna:program-progress:v1", JSON.stringify(futureData));

      // Try to save
      const p = createInitialProgress();
      const saved = saveProgramProgress(p);
      expect(saved).toBe(false);

      // The future data should still be there, untouched
      const storedRaw = mockStorage.get("somna:program-progress:v1");
      expect(storedRaw).toBeTruthy();
      const stored = JSON.parse(storedRaw!);
      expect(stored.schemaVersion).toBe(999);
      expect(stored.data).toBe("future-stuff");
    });

    it("saveProgramProgress succeeds when no data stored", () => {
      const p = createInitialProgress();
      const saved = saveProgramProgress(p);
      expect(saved).toBe(true);
      expect(mockStorage.get("somna:program-progress:v1")).toBeTruthy();
    });

    it("saveProgramProgress succeeds when stored schema is current", () => {
      const p1 = createInitialProgress();
      saveProgramProgress(p1);

      const p2: ProgramProgress = {
        ...p1,
        status: "active",
        completedLessonIds: [definition.lessons[0].id],
      };
      const saved = saveProgramProgress(p2);
      expect(saved).toBe(true);

      const loaded = loadProgramProgress(definition);
      expect(!isUnsupportedSchema(loaded) && loaded.status).toBe("active");
    });

    it("clearProgramProgress removes future-schema data (explicit deletion)", () => {
      const futureData = { schemaVersion: 999, data: "future" };
      mockStorage.set("somna:program-progress:v1", JSON.stringify(futureData));

      clearProgramProgress();
      expect(mockStorage.get("somna:program-progress:v1")).toBeUndefined();
    });

    it("exportProgramData includes raw unsupported data in export", () => {
      const futureData = { schemaVersion: 999, secretFutureData: "preserved" };
      mockStorage.set("somna:program-progress:v1", JSON.stringify(futureData));

      const exp = exportProgramData(definition);
      expect(exp.unsupportedSchemaVersion).toBe(999);
      expect(exp.unsupportedSchemaRaw).toEqual(futureData);
      // And the data is still there after export
      const stored = JSON.parse(mockStorage.get("somna:program-progress:v1")!);
      expect(stored.schemaVersion).toBe(999);
    });

    it("handles malformed JSON safely (falls back, no future-schema error)", () => {
      mockStorage.set("somna:program-progress:v1", "{ broken json");

      const loaded = loadProgramProgress(definition);
      // malformed → safeLocalStorageGet returns null → fresh start
      expect(isUnsupportedSchema(loaded)).toBe(false);
      if (!isUnsupportedSchema(loaded)) {
        expect(loaded.status).toBe("not_started");
      }
    });
  });

  // =========================================================================
  // loadProgramProgressResult — discriminated-union contract
  // =========================================================================

  describe("loadProgramProgressResult", () => {
    it("returns { status: 'empty' } when nothing stored", () => {
      const result = loadProgramProgressResult(definition);
      expect(result.status).toBe("empty");
      if (result.status === "empty") {
        expect(result.progress.status).toBe("not_started");
        expect(result.progress.completedLessonIds).toEqual([]);
      }
    });

    it("returns { status: 'ready' } for stored canonical v1 progress", () => {
      const initial = createInitialProgress();
      const withLesson: ProgramProgress = {
        ...initial,
        status: "active",
        startedAt: "2026-01-01T00:00:00.000Z",
        currentWeekId: "week-1",
        completedLessonIds: [definition.lessons[0].id],
      };
      saveProgramProgress(withLesson);

      const result = loadProgramProgressResult(definition);
      expect(result.status).toBe("ready");
      if (result.status === "ready") {
        expect(result.progress.status).toBe("active");
        expect(result.progress.completedLessonIds).toContain(definition.lessons[0].id);
      }
    });

    it("returns { status: 'migrated', fromVersion: 0 } for legacy data", () => {
      const legacyData = {
        completedLessons: [definition.lessons[0].id, definition.lessons[1].id],
      };
      mockStorage.set("cbtiProgramProgress", JSON.stringify(legacyData));

      const result = loadProgramProgressResult(definition);
      expect(result.status).toBe("migrated");
      if (result.status === "migrated") {
        expect(result.fromVersion).toBe(0);
        expect(result.progress.status).toBe("active");
        expect(result.progress.completedLessonIds).toHaveLength(2);
      }
    });

    it("returns { status: 'unsupported-version' } for future schema", () => {
      const futureData = {
        schemaVersion: 999,
        programId: "cbti-core",
        programVersion: 1,
        status: "active",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: null,
        currentWeekId: "week-3",
        completedLessonIds: ["lesson-1", "lesson-2"],
        skippedLessonIds: [],
        acceptedPlanIds: [],
        dismissedRecommendationIds: [],
        milestones: [],
        updatedAt: "2026-01-02T00:00:00.000Z",
        mysteriousNewField: "some-future-data",
      };
      mockStorage.set("somna:program-progress:v1", JSON.stringify(futureData));

      const result = loadProgramProgressResult(definition);
      expect(result.status).toBe("unsupported-version");
      if (result.status === "unsupported-version") {
        expect(result.storedVersion).toBe(999);
        expect(result.supportedVersion).toBe(SUPPORTED_PROGRAM_SCHEMA_VERSION);
        // Raw data preserved intact
        expect(result.raw).toEqual(futureData);
        // Fallback is safe initial state
        expect(result.fallback.status).toBe("not_started");
        expect(result.fallback.completedLessonIds).toEqual([]);
      }
    });

    it("unsupported-version: raw data is never modified on load", () => {
      const futureData = { schemaVersion: 999, secretData: "preserved" };
      mockStorage.set("somna:program-progress:v1", JSON.stringify(futureData));

      loadProgramProgressResult(definition);

      const storedRaw = mockStorage.get("somna:program-progress:v1");
      expect(storedRaw).toBeTruthy();
      const stored = JSON.parse(storedRaw!);
      expect(stored.schemaVersion).toBe(999);
      expect(stored.secretData).toBe("preserved");
    });

    it("unsupported-version: saveProgramProgress is blocked (no write-back, no downgrade)", () => {
      const futureData = { schemaVersion: 999, data: "future-stuff" };
      mockStorage.set("somna:program-progress:v1", JSON.stringify(futureData));

      const p = createInitialProgress();
      const saved = saveProgramProgress(p);
      expect(saved).toBe(false);

      // Data unchanged
      const stored = JSON.parse(mockStorage.get("somna:program-progress:v1")!);
      expect(stored.schemaVersion).toBe(999);
      expect(stored.data).toBe("future-stuff");
    });

    it("unsupported-version: no data deletion on load", () => {
      const futureData = { schemaVersion: 999, userProgress: "important" };
      mockStorage.set("somna:program-progress:v1", JSON.stringify(futureData));

      loadProgramProgressResult(definition);

      expect(mockStorage.has("somna:program-progress:v1")).toBe(true);
      const stored = JSON.parse(mockStorage.get("somna:program-progress:v1")!);
      expect(stored.userProgress).toBe("important");
    });
  });

  describe("deleteAllProgramData", () => {
    it("deletes all program-related data", () => {
      const p = createInitialProgress();
      saveProgramProgress(p);
      mockStorage.set("somna:program-plans:v1", JSON.stringify([]));
      mockStorage.set("cbtiProgramProgress", JSON.stringify({ completedLessons: [] }));

      deleteAllProgramData();

      expect(mockStorage.get("somna:program-progress:v1")).toBeUndefined();
      expect(mockStorage.get("somna:program-plans:v1")).toBeUndefined();
      expect(mockStorage.get("cbtiProgramProgress")).toBeUndefined();
    });

    it("does not delete unrelated data", () => {
      mockStorage.set("unrelated-key", "should-stay");
      deleteAllProgramData();
      expect(mockStorage.get("unrelated-key")).toBe("should-stay");
    });
  });
});
