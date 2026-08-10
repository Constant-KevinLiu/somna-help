/**
 * Unit tests for word counting and word limit enforcement.
 */

import { describe, it, expect } from "vitest";
import {
  countWords,
  truncateToWordLimit,
  wouldExceedLimit,
  MAX_WORDS,
} from "./reflection-word-count";

describe("countWords", () => {
  it("returns 0 for empty string", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
    expect(countWords("\n\n")).toBe(0);
  });

  it("counts single word correctly", () => {
    expect(countWords("hello")).toBe(1);
    expect(countWords("hello ")).toBe(1);
    expect(countWords(" hello")).toBe(1);
  });

  it("counts multiple words correctly", () => {
    expect(countWords("hello world")).toBe(2);
    expect(countWords("the quick brown fox")).toBe(4);
  });

  it("handles repeated whitespace", () => {
    expect(countWords("hello   world")).toBe(2);
    expect(countWords("hello\n\nworld")).toBe(2);
    expect(countWords("hello\t\tworld")).toBe(2);
  });

  it("ignores punctuation-only tokens", () => {
    expect(countWords("hello , world")).toBe(2);
    expect(countWords("hello ... world")).toBe(2);
    expect(countWords("hello 123 world")).toBe(2);
  });

  it("handles Unicode characters", () => {
    expect(countWords("café")).toBe(1);
    expect(countWords("niño")).toBe(1);
    expect(countWords("zęść")).toBe(1);
  });

  it("handles Spanish and Portuguese punctuation", () => {
    expect(countWords("¡Hola! ¿Cómo estás?")).toBe(3);
    expect(countWords("Olá! Tudo bem?")).toBe(3);
  });

  it("handles Polish diacritics", () => {
    expect(countWords("Cześć! Jak się masz?")).toBe(4);
  });
});

describe("wouldExceedLimit", () => {
  it("returns true when exceeding word limit", () => {
    const words = Array(MAX_WORDS + 1)
      .fill("word")
      .join(" ");
    expect(wouldExceedLimit("", words)).toBe(true);
  });

  it("returns false when within word limit", () => {
    const words = Array(MAX_WORDS - 1)
      .fill("word")
      .join(" ");
    expect(wouldExceedLimit("", words)).toBe(false);
  });
});

describe("truncateToWordLimit", () => {
  it("truncates content exceeding word limit", () => {
    const words = Array(MAX_WORDS + 10)
      .fill("word")
      .join(" ");
    const truncated = truncateToWordLimit(words);
    expect(countWords(truncated)).toBe(MAX_WORDS);
  });

  it("leaves content under limit unchanged", () => {
    const content = "hello world test";
    expect(truncateToWordLimit(content)).toBe(content);
  });
});
