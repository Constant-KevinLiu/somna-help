/**
 * Unit tests for deterministic prompt selection.
 */

import { describe, it, expect } from "vitest";
import { selectDailyPrompts, getDailyPromptIds } from "./reflection-prompts";
import type { Locale } from "@/content/content-types";

const LOCALES: Locale[] = ["en", "es", "pt-BR", "pl"];

describe("selectDailyPrompts", () => {
  it("returns exactly 3 prompts", () => {
    const prompts = selectDailyPrompts("2024-01-15", "en");
    expect(prompts).toHaveLength(3);
  });

  it("returns consistent prompts for same date and locale", () => {
    const prompts1 = selectDailyPrompts("2024-01-15", "en");
    const prompts2 = selectDailyPrompts("2024-01-15", "en");
    expect(prompts1.map((p) => p.id)).toEqual(prompts2.map((p) => p.id));
  });

  it("returns different prompts for different dates", () => {
    const prompts1 = selectDailyPrompts("2024-01-15", "en");
    const prompts2 = selectDailyPrompts("2024-01-16", "en");
    expect(prompts1.map((p) => p.id)).not.toEqual(prompts2.map((p) => p.id));
  });

  it("returns native prompts for each locale", () => {
    const enPrompts = selectDailyPrompts("2024-01-15", "en");
    const esPrompts = selectDailyPrompts("2024-01-15", "es");

    // English prompts should use English text
    expect(enPrompts[0].text).toMatch(/^[A-Za-z]/);
    // Spanish prompts should use Spanish text (different from English)
    expect(esPrompts[0].text).not.toBe(enPrompts[0].text);
  });

  it("prompts have unique IDs", () => {
    const prompts = selectDailyPrompts("2024-01-15", "en");
    const ids = prompts.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(3);
  });

  it("each locale has its own prompt set", () => {
    for (const locale of LOCALES) {
      const prompts = selectDailyPrompts("2024-01-15", locale);
      expect(prompts).toHaveLength(3);
      prompts.forEach((p) => {
        expect(p).toHaveProperty("id");
        expect(p).toHaveProperty("category");
        expect(p).toHaveProperty("text");
        expect(p.text.length).toBeGreaterThan(0);
      });
    }
  });
});

describe("getDailyPromptIds", () => {
  it("returns exactly 3 prompt IDs", () => {
    const ids = getDailyPromptIds("2024-01-15", "en");
    expect(ids).toHaveLength(3);
  });

  it("returns same IDs as selectDailyPrompts", () => {
    const prompts = selectDailyPrompts("2024-01-15", "en");
    const ids = getDailyPromptIds("2024-01-15", "en");
    expect(ids).toEqual(prompts.map((p) => p.id));
  });
});
