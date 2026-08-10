/**
 * Phase F — Weekly Reflection Prompts
 *
 * Rule-selected prompt generation. No AI, no randomness beyond seeded selection.
 *
 * Prompts are selected based on:
 * - How many days the user recorded this week
 * - Sleep pattern indicators (consistency, efficiency)
 * - Habit progress
 *
 * Users always see 3-4 prompts and may skip any.
 */

import type { SleepRecord } from "@/lib/sleep-records";
import type { HabitProgress } from "@/services/habit/habit-types";
import type { WeeklyReflectionPrompt, WeeklyReflectionPromptCategory } from "./types";
import { computeMetrics } from "../analytics/metrics";
import { overallSufficiency } from "../analytics/sufficiency";

// ============================================
// Prompt Catalog
// ============================================

const ALL_PROMPTS: WeeklyReflectionPrompt[] = [
  {
    id: "routine-consistency-1",
    category: "routine_consistency",
    textKey: "reflection.weekly.prompt.routine_consistency.1",
    placeholderKey: "reflection.weekly.placeholder.routine_consistency",
  },
  {
    id: "routine-consistency-2",
    category: "routine_consistency",
    textKey: "reflection.weekly.prompt.routine_consistency.2",
    placeholderKey: "reflection.weekly.placeholder.routine_consistency",
  },
  {
    id: "recording-ease-1",
    category: "recording_ease",
    textKey: "reflection.weekly.prompt.recording_ease.1",
    placeholderKey: "reflection.weekly.placeholder.recording_ease",
  },
  {
    id: "manageable-parts-1",
    category: "manageable_parts",
    textKey: "reflection.weekly.prompt.manageable_parts.1",
    placeholderKey: "reflection.weekly.placeholder.manageable_parts",
  },
  {
    id: "next-week-observation-1",
    category: "next_week_observation",
    textKey: "reflection.weekly.prompt.next_week_observation.1",
    placeholderKey: "reflection.weekly.placeholder.next_week_observation",
  },
  {
    id: "wins-1",
    category: "wins",
    textKey: "reflection.weekly.prompt.wins.1",
    placeholderKey: "reflection.weekly.placeholder.wins",
  },
  {
    id: "wins-2",
    category: "wins",
    textKey: "reflection.weekly.prompt.wins.2",
    placeholderKey: "reflection.weekly.placeholder.wins",
  },
  {
    id: "challenges-1",
    category: "challenges",
    textKey: "reflection.weekly.prompt.challenges.1",
    placeholderKey: "reflection.weekly.placeholder.challenges",
  },
  {
    id: "gratitude-1",
    category: "gratitude",
    textKey: "reflection.weekly.prompt.gratitude.1",
    placeholderKey: "reflection.weekly.placeholder.gratitude",
  },
  {
    id: "sleep-confidence-1",
    category: "sleep_confidence",
    textKey: "reflection.weekly.prompt.sleep_confidence.1",
    placeholderKey: "reflection.weekly.placeholder.sleep_confidence",
  },
];

// ============================================
// Prompt Selection Rules
// ============================================

/**
 * Select prompts for a weekly reflection session.
 *
 * Selection is deterministic and rule-based:
 * - Always include "next week observation" (future-focused)
 * - Always include a "wins" prompt (positive reinforcement)
 * - Then adapt based on the user's data patterns
 *
 * Returns 3-4 prompts.
 */
export function selectWeeklyPrompts(
  records: SleepRecord[],
  habitProgress: Map<string, HabitProgress>,
  weekStart: string,
): WeeklyReflectionPrompt[] {
  const selected: WeeklyReflectionPrompt[] = [];
  const recordCount = records.length;
  const suf = overallSufficiency(recordCount);

  // Always include: next week observation (future-focused)
  selected.push(getPromptByCategory("next_week_observation"));

  // Always include: wins (positive reinforcement)
  selected.push(getPromptByCategory("wins"));

  // Adaptive prompts based on data
  if (suf === "none" || suf === "insufficient") {
    // New users: focus on what made recording easy/hard
    selected.push(getPromptByCategory("recording_ease"));
    selected.push(getPromptByCategory("gratitude"));
  } else {
    const metrics = computeMetrics(records, 7);

    // Low consistency / variable schedule → routine prompt
    if (metrics.sleepRegularity === null || metrics.sleepRegularity < 70) {
      selected.push(getPromptByCategory("routine_consistency"));
    } else {
      // Good consistency → confidence prompt
      selected.push(getPromptByCategory("sleep_confidence"));
    }

    // Low efficiency → challenges prompt
    if (metrics.sleepEfficiency !== null && metrics.sleepEfficiency < 80) {
      selected.push(getPromptByCategory("challenges"));
    } else if (habitProgress.size > 0) {
      // Good sleep + has habits → manageable parts
      selected.push(getPromptByCategory("manageable_parts"));
    }
  }

  // Ensure 3-4 prompts, no duplicates by category
  const seenCategories = new Set<WeeklyReflectionPromptCategory>();
  const unique = selected.filter((p) => {
    if (seenCategories.has(p.category)) return false;
    seenCategories.add(p.category);
    return true;
  });

  // If we have fewer than 3, fill with defaults
  const defaults: WeeklyReflectionPromptCategory[] = [
    "manageable_parts",
    "gratitude",
    "challenges",
    "routine_consistency",
  ];

  while (unique.length < 3 && defaults.length > 0) {
    const cat = defaults.shift()!;
    if (!seenCategories.has(cat)) {
      unique.push(getPromptByCategory(cat));
      seenCategories.add(cat);
    }
  }

  return unique.slice(0, 4);
}

// ============================================
// Helper: Get first prompt of a category
// ============================================

function getPromptByCategory(category: WeeklyReflectionPromptCategory): WeeklyReflectionPrompt {
  const prompt = ALL_PROMPTS.find((p) => p.category === category);
  if (!prompt) {
    // Fallback to wins — should never happen
    return ALL_PROMPTS.find((p) => p.category === "wins")!;
  }
  return prompt;
}

// ============================================
// All prompts (for reference / full list)
// ============================================

export function getAllWeeklyPrompts(): WeeklyReflectionPrompt[] {
  return [...ALL_PROMPTS];
}
