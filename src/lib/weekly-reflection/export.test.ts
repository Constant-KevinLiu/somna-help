/**
 * Phase F — Weekly Reflection Export & Delete Tests
 *
 * Tests that weekly reflections are properly included in export
 * and delete-all flows.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  exportWeeklyReflections,
  deleteAllWeeklyReflections,
  countWeeklyReflections,
  safeLoadWeeklyReflections,
} from "./export";
import type { WeeklyReflection } from "./types";

const STORAGE_KEY = "somna.weekly-reflections.v1";

// Mock localStorage for tests
const mockStorage = new Map<string, string>();

beforeEach(() => {
  mockStorage.clear();
  // Mock window.localStorage for safe-storage functions
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
});

afterEach(() => {
  delete (globalThis as any).window;
  mockStorage.clear();
});

function makeReflection(
  overrides: Partial<WeeklyReflection> & { id: string; weekStart: string },
): WeeklyReflection {
  const { id, weekStart, weekEnd, ...rest } = overrides;
  return {
    id,
    weekStart,
    weekEnd: weekEnd ?? "2024-01-07",
    timezone: "America/New_York",
    locale: "en" as const,
    responses: [
      {
        promptId: "wins-1",
        category: "wins" as const,
        content: "I stuck to my bedtime all week.",
      },
    ],
    wordCount: 8,
    createdAt: "2024-01-07T12:00:00.000Z",
    updatedAt: "2024-01-07T12:00:00.000Z",
    syncStatus: "local" as const,
    ...rest,
  };
}

function saveReflections(reflections: WeeklyReflection[]): void {
  const data = { version: "1", reflections };
  mockStorage.set(STORAGE_KEY, JSON.stringify(data));
}

describe("weekly reflection export", () => {
  it("includes reflections in export", () => {
    saveReflections([
      makeReflection({ id: "wr_1", weekStart: "2024-01-01" }),
      makeReflection({ id: "wr_2", weekStart: "2024-01-08" }),
    ]);

    const exported = exportWeeklyReflections();

    expect(exported.length).toBe(2);
    expect(exported[0].id).toBe("wr_1");
    expect(exported[0].weekStart).toBe("2024-01-01");
    expect(exported[0].weekEnd).toBe("2024-01-07");
    expect(exported[0].timezone).toBe("America/New_York");
    expect(exported[0].prompts.length).toBe(1);
    expect(exported[0].prompts[0].id).toBe("wins-1");
    expect(exported[0].prompts[0].category).toBe("wins");
    expect(exported[0].prompts[0].response).toBe("I stuck to my bedtime all week.");
    expect(exported[0].wordCount).toBe(8);
    expect(exported[0].createdAt).toBeTruthy();
    expect(exported[0].updatedAt).toBeTruthy();
    expect(exported[0].schemaVersion).toBe("1");
  });

  it("empty reflection export is safe", () => {
    // No storage key set
    const exported = exportWeeklyReflections();
    expect(Array.isArray(exported)).toBe(true);
    expect(exported.length).toBe(0);
  });

  it("empty storage array exports empty array", () => {
    saveReflections([]);
    const exported = exportWeeklyReflections();
    expect(exported.length).toBe(0);
  });

  it("countWeeklyReflections returns correct count", () => {
    saveReflections([
      makeReflection({ id: "wr_1", weekStart: "2024-01-01" }),
      makeReflection({ id: "wr_2", weekStart: "2024-01-08" }),
      makeReflection({ id: "wr_3", weekStart: "2024-01-15" }),
    ]);
    expect(countWeeklyReflections()).toBe(3);
  });

  it("malformed stored reflections do not crash export", () => {
    // Store completely invalid data
    mockStorage.set(STORAGE_KEY, "this is not json at all!!!");
    const exported = exportWeeklyReflections();
    expect(Array.isArray(exported)).toBe(true);
    expect(exported.length).toBe(0);
  });

  it("partially malformed stored reflections are filtered safely", () => {
    // Store a mix of valid and invalid entries
    const badStorage = {
      version: "1",
      reflections: [
        makeReflection({ id: "wr_good", weekStart: "2024-01-01" }),
        { id: "bad_no_date", timezone: "UTC" }, // missing required fields
        null,
        "not an object",
      ],
    };
    mockStorage.set(STORAGE_KEY, JSON.stringify(badStorage));

    const exported = exportWeeklyReflections();
    // Only the valid one should survive
    expect(exported.length).toBe(1);
    expect(exported[0].id).toBe("wr_good");
  });

  it("does not expose sync internals in export format", () => {
    saveReflections([
      makeReflection({ id: "wr_1", weekStart: "2024-01-01", syncStatus: "synced" }),
    ]);

    const exported = exportWeeklyReflections();
    expect(exported.length).toBe(1);
    // Export format has prompts, not raw responses
    expect((exported[0] as any).syncStatus).toBeUndefined();
    expect((exported[0] as any).responses).toBeUndefined();
    expect(exported[0].prompts).toBeDefined();
  });
});

describe("weekly reflection delete all", () => {
  it("deleteAll removes all weekly reflections", () => {
    saveReflections([
      makeReflection({ id: "wr_1", weekStart: "2024-01-01" }),
      makeReflection({ id: "wr_2", weekStart: "2024-01-08" }),
    ]);

    expect(countWeeklyReflections()).toBe(2);

    deleteAllWeeklyReflections();

    expect(countWeeklyReflections()).toBe(0);
    expect(mockStorage.has(STORAGE_KEY)).toBe(false);
  });

  it("deleteAll on empty storage is safe", () => {
    // No storage entry yet
    expect(() => deleteAllWeeklyReflections()).not.toThrow();
    expect(mockStorage.has(STORAGE_KEY)).toBe(false);
  });

  it("deleteAll on malformed storage is safe", () => {
    mockStorage.set(STORAGE_KEY, "garbage data!!!");
    expect(() => deleteAllWeeklyReflections()).not.toThrow();
    expect(mockStorage.has(STORAGE_KEY)).toBe(false);
  });

  it("unrelated diary deletion does not remove reflections", () => {
    saveReflections([makeReflection({ id: "wr_1", weekStart: "2024-01-01" })]);

    // Simulate deleting a diary record (separate storage key)
    mockStorage.set("somna.sleep-records.v1", JSON.stringify([]));
    mockStorage.delete("somna.sleep-records.v1");

    // Weekly reflections should still be there
    expect(countWeeklyReflections()).toBe(1);
  });
});

describe("safeLoadWeeklyReflections", () => {
  it("returns empty array when no storage exists", () => {
    const result = safeLoadWeeklyReflections();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it("returns empty array for invalid JSON", () => {
    mockStorage.set(STORAGE_KEY, "{invalid json");
    const result = safeLoadWeeklyReflections();
    expect(result.length).toBe(0);
  });

  it("returns empty array for wrong version", () => {
    mockStorage.set(STORAGE_KEY, JSON.stringify({ version: "2", reflections: [] }));
    const result = safeLoadWeeklyReflections();
    expect(result.length).toBe(0);
  });

  it("filters out invalid entries", () => {
    const storage = {
      version: "1",
      reflections: [
        makeReflection({ id: "valid_1", weekStart: "2024-01-01" }),
        { id: "missing_date", weekEnd: "2024-01-07" }, // no weekStart
        { weekStart: "2024-01-08", weekEnd: "2024-01-14" }, // no id
        "string entry",
        null,
      ],
    };
    mockStorage.set(STORAGE_KEY, JSON.stringify(storage));

    const result = safeLoadWeeklyReflections();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("valid_1");
  });
});
