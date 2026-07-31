/**
 * Sleep Diary v2.5 — Weekly Focus → Program Recommendation Adapter
 *
 * Defines the contract between Phase F's Weekly Focus system and
 * the Phase G Program recommendation engine.
 *
 * IMPORTANT: This file contains TYPES and ADAPTER LOGIC ONLY.
 * It does NOT select lessons or generate recommendations.
 *
 * Architecture:
 *
 *   WeeklyFocus (Phase F, analytics domain)
 *        ↓  adapter
 *   ProgramRecommendationInput (stable domain contract)
 *        ↓  consumed by
 *   Program recommendation engine (Phase G — NOT built here)
 */

import type { SupportedLocale } from "../locale-registry";

// =============================================================================
// Weekly Focus Types (re-declared for boundary stability)
// =============================================================================
// We re-declare a minimal subset of WeeklyFocus types here so the Program
// domain does not need to import from the analytics domain directly.
// This prevents circular dependencies and keeps the contract explicit.

export type WeeklyFocusCategory =
  | "baseline_building"
  | "recording_consistency"
  | "wake_time_consistency"
  | "bedtime_observation"
  | "reminder_routine"
  | "maintenance";

export type DataSufficiency = "sufficient" | "insufficient" | "minimal";

export interface WeeklyFocusSummary {
  id: string;
  category: WeeklyFocusCategory;
  reasonKey: string;
  actionKey: string;
  generatedAt: string;
}

// =============================================================================
// Program Recommendation Input — the stable contract
// =============================================================================

/**
 * Input to the Phase G program recommendation engine.
 *
 * This is the ONLY thing the Program domain knows about Weekly Focus.
 * It does not import analytics code, recalculate metrics, or depend on React.
 *
 * Properties:
 *  - focusCategory: What the analytics system identified as the area to work on
 *  - evidenceWindow: Date range the focus was computed from
 *  - dataSufficiency: How much data the recommendation is based on
 *  - acceptedByUser: Whether the user has accepted this focus
 *  - locale: User's locale (for content selection, not display)
 */
export interface ProgramRecommendationInput {
  /** The focus category from analytics. */
  focusCategory: WeeklyFocusCategory;
  /** ID of the focus entry this input was built from. */
  focusId: string;
  /** The evidence window used to generate the focus. */
  evidenceWindow: {
    start: string; // ISO date string, inclusive
    end: string;   // ISO date string, inclusive
  };
  /** How much data backs this recommendation. */
  dataSufficiency: DataSufficiency;
  /** Whether the user has explicitly accepted this focus. */
  acceptedByUser: boolean;
  /** User's locale, for content selection (NOT for display strings). */
  locale: SupportedLocale;
  /** i18n key for the focus reason (pass-through, not interpreted by Program). */
  reasonKey: string;
}

// =============================================================================
// Adapter — WeeklyFocus → ProgramRecommendationInput
// =============================================================================

/**
 * Build a ProgramRecommendationInput from a WeeklyFocus summary.
 *
 * This is the ONLY place where analytics types touch program types.
 *
 * @param focus The weekly focus from analytics
 * @param evidenceStart Start of the data window (YYYY-MM-DD)
 * @param evidenceEnd End of the data window (YYYY-MM-DD)
 * @param dataSufficiency How much data backs this
 * @param acceptedByUser Whether user accepted this focus
 * @param locale User's locale
 */
export function buildProgramRecommendationInput(
  focus: WeeklyFocusSummary,
  evidenceStart: string,
  evidenceEnd: string,
  dataSufficiency: DataSufficiency,
  acceptedByUser: boolean,
  locale: SupportedLocale
): ProgramRecommendationInput {
  return {
    focusCategory: focus.category,
    focusId: focus.id,
    evidenceWindow: {
      start: evidenceStart,
      end: evidenceEnd,
    },
    dataSufficiency,
    acceptedByUser,
    locale,
    reasonKey: focus.reasonKey,
  };
}

/**
 * Map of focus categories to general lesson tags they relate to.
 *
 * This is NOT a recommendation engine. It's a simple categorical mapping
 * that Phase G can use as a starting point. The actual recommendation logic
 * belongs in Phase G, not G-0.
 *
 * Purpose: Documents the conceptual relationship between focus areas and
 * lesson domains. Does NOT select specific lessons.
 */
export const FOCUS_CATEGORY_TO_LESSON_DOMAINS: Record<
  WeeklyFocusCategory,
  string[]
> = {
  baseline_building: ["education", "habit"],
  recording_consistency: ["habit"],
  wake_time_consistency: ["stimulus-control", "habit"],
  bedtime_observation: ["stimulus-control", "relaxation"],
  reminder_routine: ["habit"],
  maintenance: ["maintenance", "cognitive"],
};
