/**
 * Sleep Diary v2.3 — Reflection Schema Validation
 *
 * Type guards and schema validation for localStorage data.
 * Corrupted records are ignored gracefully.
 */

import { z } from "zod";
import type { LocalReflection, ReflectionStorage, ReflectionCategory } from "./reflection-types";

const REFLECTION_CATEGORIES: readonly ReflectionCategory[] = [
  "sleep-thoughts",
  "sleep-anxiety",
  "sleep-behaviors",
  "relaxation",
  "gratitude",
  "sleep-confidence",
  "stimulus-control",
  "sleep-restriction",
  "night-awakenings",
  "cognitive-reframing",
] as const;

const ReflectionCategorySchema = z.enum(REFLECTION_CATEGORIES);

const LocaleSchema = z.enum(["en", "es", "pt-BR", "pl"]);

const SyncStatusSchema = z.enum(["local", "pending", "synced", "conflict"]);

const LocalReflectionSchema = z.object({
  id: z.string().uuid().or(z.string().length(21)), // Allow nanoid-style too
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timezone: z.string(),
  locale: LocaleSchema,
  promptIds: z.array(z.string()),
  promptCategories: z.array(ReflectionCategorySchema),
  content: z.string(),
  wordCount: z.number().int().min(0).max(750),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  syncStatus: SyncStatusSchema,
});

const ReflectionStorageSchema = z.object({
  version: z.literal("1"),
  reflections: z.array(LocalReflectionSchema),
  lastSyncedAt: z.string().datetime().optional(),
});

/**
 * Validate a single reflection object.
 * Returns typed reflection if valid, null otherwise.
 */
export function validateReflection(data: unknown): LocalReflection | null {
  const result = LocalReflectionSchema.safeParse(data);
  return result.success ? result.data : null;
}

/**
 * Validate the entire reflection storage object.
 * Returns typed storage if valid, null otherwise.
 */
export function validateReflectionStorage(data: unknown): ReflectionStorage | null {
  const result = ReflectionStorageSchema.safeParse(data);
  return result.success ? result.data : null;
}

/**
 * Filter and validate an array of unknown records.
 * Returns only valid reflections.
 */
export function filterValidReflections(items: unknown[]): LocalReflection[] {
  return items
    .map((item) => validateReflection(item))
    .filter((r): r is LocalReflection => r !== null);
}

/**
 * Validate that a reflection has consistent data.
 * - wordCount matches actual content
 * - promptIds length matches promptCategories length
 */
export function isReflectionConsistent(reflection: LocalReflection): boolean {
  // Word count should be accurate
  const actualWordCount = reflection.content.split(/\s+/).filter((t) => t && /\p{L}/u.test(t)).length;
  if (Math.abs(actualWordCount - reflection.wordCount) > 2) {
    return false;
  }

  // Prompt arrays should have same length
  if (reflection.promptIds.length !== reflection.promptCategories.length) {
    return false;
  }

  // Should have 3 prompts (daily requirement)
  if (reflection.promptIds.length !== 3) {
    return false;
  }

  return true;
}
