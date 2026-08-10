/**
 * Unit tests for reflection statistics and streak calculation.
 */

import { describe, it, expect } from "vitest";
import type { LocalReflection } from "./reflection-types";
import {
  calculateReflectionStreak,
  calculateLongestStreak,
  countThisMonth,
} from "./reflection-stats";

const createReflection = (date: string): LocalReflection => ({
  id: `ref-${date}`,
  localDate: date,
  timezone: "UTC",
  locale: "en",
  promptIds: ["p1", "p2", "p3"],
  promptCategories: ["sleep-thoughts", "relaxation", "gratitude"],
  content: "Test content",
  wordCount: 5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  syncStatus: "local",
});

describe("calculateReflectionStreak", () => {
  it("returns 0 for empty reflections", () => {
    expect(calculateReflectionStreak([], "2024-01-15")).toBe(0);
  });

  it("returns 1 for single day streak with today entry", () => {
    const reflections = [createReflection("2024-01-15")];
    expect(calculateReflectionStreak(reflections, "2024-01-15")).toBe(1);
  });

  it("returns 1 for single day streak with yesterday entry", () => {
    const reflections = [createReflection("2024-01-14")];
    expect(calculateReflectionStreak(reflections, "2024-01-15")).toBe(1);
  });

  it("returns 3 for three consecutive days including today", () => {
    const reflections = [
      createReflection("2024-01-13"),
      createReflection("2024-01-14"),
      createReflection("2024-01-15"),
    ];
    expect(calculateReflectionStreak(reflections, "2024-01-15")).toBe(3);
  });

  it("returns 0 when streak is broken", () => {
    const reflections = [createReflection("2024-01-10"), createReflection("2024-01-11")];
    expect(calculateReflectionStreak(reflections, "2024-01-15")).toBe(0);
  });

  it("handles month boundaries", () => {
    const reflections = [
      createReflection("2024-01-30"),
      createReflection("2024-01-31"),
      createReflection("2024-02-01"),
    ];
    expect(calculateReflectionStreak(reflections, "2024-02-01")).toBe(3);
  });
});

describe("calculateLongestStreak", () => {
  it("returns 0 for empty reflections", () => {
    expect(calculateLongestStreak([])).toBe(0);
  });

  it("returns 1 for single reflection", () => {
    const reflections = [createReflection("2024-01-15")];
    expect(calculateLongestStreak(reflections)).toBe(1);
  });

  it("finds longest streak across history", () => {
    const reflections = [
      createReflection("2024-01-10"),
      createReflection("2024-01-11"),
      createReflection("2024-01-12"),
      // gap
      createReflection("2024-01-14"),
      createReflection("2024-01-15"),
    ];
    expect(calculateLongestStreak(reflections)).toBe(3);
  });
});

describe("countThisMonth", () => {
  it("returns 0 for empty reflections", () => {
    expect(countThisMonth([], "2024-01-15")).toBe(0);
  });

  it("counts only reflections in the same month", () => {
    const reflections = [
      createReflection("2024-01-10"),
      createReflection("2024-01-15"),
      createReflection("2024-02-01"),
    ];
    expect(countThisMonth(reflections, "2024-01-15")).toBe(2);
    expect(countThisMonth(reflections, "2024-02-01")).toBe(1);
  });
});
