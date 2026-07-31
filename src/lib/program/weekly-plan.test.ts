import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  validatePlanLessonIds,
  validatePlanAcceptance,
  validatePlan,
  loadWeeklyPlans,
  saveWeeklyPlan,
  deleteWeeklyPlan,
  clearAllWeeklyPlans,
  WeeklyPlanValidationError,
} from "./weekly-plan";
import type { WeeklyProgramPlan } from "./weekly-plan";
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
  // Also expose localStorage directly for tests that reference it
  (globalThis as any).localStorage = mockLocalStorage;
});

afterEach(() => {
  delete (globalThis as any).window;
  delete (globalThis as any).localStorage;
  mockStorage.clear();
});

// =============================================================================
// Test data
// =============================================================================

const definition = getProgramDefinition();
const validLessonId = definition.lessons[0].id;
const validLessonId2 = definition.lessons[1].id;

const VALID_PLAN_BASE = (): WeeklyProgramPlan => ({
  id: "plan-2026-w1",
  programId: "cbti-core",
  weekStart: "2026-01-05",
  weekEnd: "2026-01-11",
  source: "baseline",
  reasonKey: "program.plan.reason.baseline",
  recommendedLessonIds: [],
  acceptedLessonIds: [],
  status: "proposed",
  generatedAt: "2026-01-04T00:00:00.000Z",
  updatedAt: "2026-01-04T00:00:00.000Z",
});

// =============================================================================
// Validation
// =============================================================================

describe("program/weekly-plan validation", () => {
  describe("validatePlanLessonIds", () => {
    it("passes for empty array", () => {
      expect(validatePlanLessonIds({ ...VALID_PLAN_BASE() }, definition)).toBe(true);
    });

    it("passes for valid lesson IDs", () => {
      const plan = { ...VALID_PLAN_BASE(), recommendedLessonIds: [validLessonId, validLessonId2] };
      expect(validatePlanLessonIds(plan, definition)).toBe(true);
    });

    it("fails for invalid lesson IDs", () => {
      const plan = { ...VALID_PLAN_BASE(), recommendedLessonIds: ["does-not-exist-lesson-xyz"] };
      expect(validatePlanLessonIds(plan, definition)).toBe(false);
    });

    it("fails when mixed valid/invalid", () => {
      const plan = { ...VALID_PLAN_BASE(), recommendedLessonIds: [validLessonId, "bogus"] };
      expect(validatePlanLessonIds(plan, definition)).toBe(false);
    });
  });

  describe("validatePlanAcceptance", () => {
    it("accepted must be subset of recommended", () => {
      const plan = {
        ...VALID_PLAN_BASE(),
        recommendedLessonIds: [validLessonId, validLessonId2],
        acceptedLessonIds: [validLessonId],
        status: "accepted" as const,
      };
      expect(validatePlanAcceptance(plan)).toBe(true);
    });

    it("fails if accepted contains non-recommended lesson", () => {
      const plan = {
        ...VALID_PLAN_BASE(),
        recommendedLessonIds: [validLessonId],
        acceptedLessonIds: [validLessonId2],
        status: "accepted" as const,
      };
      expect(validatePlanAcceptance(plan)).toBe(false);
    });

    it("proposed status still validates acceptance subset", () => {
      const plan = {
        ...VALID_PLAN_BASE(),
        recommendedLessonIds: [validLessonId],
        acceptedLessonIds: [],
        status: "proposed" as const,
      };
      expect(validatePlanAcceptance(plan)).toBe(true);
    });
  });

  describe("validatePlan (returns issues array)", () => {
    it("returns empty array for a well-formed baseline plan", () => {
      const plan = { ...VALID_PLAN_BASE(), recommendedLessonIds: [validLessonId] };
      const issues = validatePlan(plan, definition);
      expect(issues).toEqual([]);
    });

    it("reports issue if id is empty", () => {
      const plan = { ...VALID_PLAN_BASE(), id: "" };
      const issues = validatePlan(plan, definition);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues.some((i) => i.includes("id"))).toBe(true);
    });

    it("reports issue if weekStart is empty", () => {
      const plan = { ...VALID_PLAN_BASE(), weekStart: "" };
      const issues = validatePlan(plan, definition);
      expect(issues.some((i) => i.includes("weekStart"))).toBe(true);
    });

    it("reports issue if source is empty (type-checked at runtime)", () => {
      const plan = { ...VALID_PLAN_BASE(), source: "" as WeeklyProgramPlan["source"] };
      const issues = validatePlan(plan, definition);
      expect(issues.some((i) => i.includes("source"))).toBe(true);
    });

    it("reports issue if status-related data is invalid (accepted not subset)", () => {
      const plan = {
        ...VALID_PLAN_BASE(),
        recommendedLessonIds: [validLessonId],
        acceptedLessonIds: [validLessonId2],
        status: "accepted" as const,
      };
      const issues = validatePlan(plan, definition);
      expect(issues.some((i) => i.includes("subset"))).toBe(true);
    });

    it("reports issue for invalid lesson IDs", () => {
      const plan = { ...VALID_PLAN_BASE(), recommendedLessonIds: ["bogus-lesson"] };
      const issues = validatePlan(plan, definition);
      expect(issues.some((i) => i.includes("invalid lesson"))).toBe(true);
    });
  });
});

// =============================================================================
// Storage
// =============================================================================

describe("program/weekly-plan storage", () => {
  it("loadWeeklyPlans returns empty array when nothing stored", () => {
    const plans = loadWeeklyPlans();
    expect(plans).toEqual([]);
  });

  it("saveWeeklyPlan adds a new plan", () => {
    const plan: WeeklyProgramPlan = {
      ...VALID_PLAN_BASE(),
      recommendedLessonIds: [validLessonId],
    };
    saveWeeklyPlan(plan, definition);

    const loaded = loadWeeklyPlans();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe("plan-2026-w1");
  });

  it("saveWeeklyPlan updates existing plan by id", () => {
    const plan1: WeeklyProgramPlan = {
      ...VALID_PLAN_BASE(),
      recommendedLessonIds: [validLessonId],
    };
    saveWeeklyPlan(plan1, definition);

    const plan2: WeeklyProgramPlan = {
      ...plan1,
      status: "accepted",
      acceptedLessonIds: [validLessonId],
      updatedAt: "2026-01-05T00:00:00.000Z",
    };
    saveWeeklyPlan(plan2, definition);

    const loaded = loadWeeklyPlans();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].status).toBe("accepted");
    expect(loaded[0].acceptedLessonIds).toContain(validLessonId);
  });

  it("saveWeeklyPlan throws WeeklyPlanValidationError for invalid plan", () => {
    const badPlan: WeeklyProgramPlan = {
      ...VALID_PLAN_BASE(),
      recommendedLessonIds: ["does-not-exist-xyz"],
    };
    expect(() => saveWeeklyPlan(badPlan, definition)).toThrow(WeeklyPlanValidationError);
    try {
      saveWeeklyPlan(badPlan, definition);
    } catch (e) {
      expect(e).toBeInstanceOf(WeeklyPlanValidationError);
      const err = e as WeeklyPlanValidationError;
      expect(err.planId).toBe("plan-2026-w1");
      expect(err.issues.length).toBeGreaterThan(0);
      expect(err.issues.some((i) => i.includes("invalid lesson"))).toBe(true);
    }
  });

  it("saveWeeklyPlan preserves previous valid plan when new one is invalid", () => {
    // Save a valid plan first
    const validPlan: WeeklyProgramPlan = {
      ...VALID_PLAN_BASE(),
      recommendedLessonIds: [validLessonId],
    };
    saveWeeklyPlan(validPlan, definition);
    expect(loadWeeklyPlans()).toHaveLength(1);

    // Try to save an invalid plan with the same id
    const badPlan: WeeklyProgramPlan = {
      ...VALID_PLAN_BASE(),
      recommendedLessonIds: ["bogus-lesson"],
    };
    expect(() => saveWeeklyPlan(badPlan, definition)).toThrow();

    // Original valid plan should still be there
    const loaded = loadWeeklyPlans();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].recommendedLessonIds).toEqual([validLessonId]);
  });

  it("saveWeeklyPlan rejects plan with wrong programId", () => {
    const badPlan: WeeklyProgramPlan = {
      ...VALID_PLAN_BASE(),
      programId: "some-other-program",
      recommendedLessonIds: [validLessonId],
    };
    expect(() => saveWeeklyPlan(badPlan, definition)).toThrow(/programId/);
  });

  it("saveWeeklyPlan rejects plan with duplicate lesson IDs", () => {
    const badPlan: WeeklyProgramPlan = {
      ...VALID_PLAN_BASE(),
      recommendedLessonIds: [validLessonId, validLessonId],
    };
    expect(() => saveWeeklyPlan(badPlan, definition)).toThrow(/duplicate/);
  });

  it("saveWeeklyPlan rejects plan with invalid date order", () => {
    const badPlan: WeeklyProgramPlan = {
      ...VALID_PLAN_BASE(),
      weekStart: "2026-01-11",
      weekEnd: "2026-01-05",
      recommendedLessonIds: [validLessonId],
    };
    expect(() => saveWeeklyPlan(badPlan, definition)).toThrow(/weekStart.*before.*weekEnd|weekStart.*on or before/);
  });

  it("saveWeeklyPlan rejects plan with invalid date format", () => {
    const badPlan: WeeklyProgramPlan = {
      ...VALID_PLAN_BASE(),
      weekStart: "not-a-date",
      recommendedLessonIds: [validLessonId],
    };
    expect(() => saveWeeklyPlan(badPlan, definition)).toThrow(/ISO date/);
  });

  it("saveWeeklyPlan rejects plan with invalid status", () => {
    const badPlan = {
      ...VALID_PLAN_BASE(),
      status: "weird_status" as never,
      recommendedLessonIds: [validLessonId],
    };
    expect(() => saveWeeklyPlan(badPlan, definition)).toThrow(/status.*not valid/);
  });

  it("manual_selection allows accepted lessons outside recommended", () => {
    const plan: WeeklyProgramPlan = {
      ...VALID_PLAN_BASE(),
      source: "manual_selection",
      recommendedLessonIds: [validLessonId],
      acceptedLessonIds: [validLessonId2], // not in recommended, but valid
      status: "accepted",
    };
    // Should NOT throw — manual_selection bypasses the subset rule
    // (both arrays must still contain valid lesson IDs, which they do here)
    expect(() => saveWeeklyPlan(plan, definition)).not.toThrow();
  });

  it("deleteWeeklyPlan removes a plan by id", () => {
    const plan: WeeklyProgramPlan = {
      ...VALID_PLAN_BASE(),
      recommendedLessonIds: [validLessonId],
    };
    saveWeeklyPlan(plan, definition);
    expect(loadWeeklyPlans()).toHaveLength(1);

    deleteWeeklyPlan("plan-2026-w1");
    expect(loadWeeklyPlans()).toHaveLength(0);
  });

  it("deleteWeeklyPlan is a no-op for missing id", () => {
    expect(() => deleteWeeklyPlan("nope")).not.toThrow();
  });

  it("clearAllWeeklyPlans removes all plans", () => {
    const plan1: WeeklyProgramPlan = {
      ...VALID_PLAN_BASE(),
      id: "plan-1",
      recommendedLessonIds: [validLessonId],
    };
    const plan2: WeeklyProgramPlan = {
      ...VALID_PLAN_BASE(),
      id: "plan-2",
      weekStart: "2026-01-12",
      weekEnd: "2026-01-18",
      recommendedLessonIds: [validLessonId],
    };
    saveWeeklyPlan(plan1, definition);
    saveWeeklyPlan(plan2, definition);
    expect(loadWeeklyPlans()).toHaveLength(2);

    clearAllWeeklyPlans();
    expect(loadWeeklyPlans()).toHaveLength(0);
  });

  it("handles malformed localStorage gracefully", () => {
    mockStorage.set("somna:program-plans:v1", "not-json{{{");
    const plans = loadWeeklyPlans();
    expect(plans).toEqual([]);
  });
});
