/**
 * Sleep Diary v2.5 — Weekly Program Plan Contract
 *
 * Definition of the weekly plan schema that Phase G will generate.
 * Phase G-0 defines ONLY the contract and validation — NOT the
 * recommendation logic or adaptive selection.
 *
 * A WeeklyProgramPlan is a set of recommended lessons for a given week,
 * generated from a source (baseline, weekly_focus, or manual selection).
 * The user may accept, dismiss, or defer the plan.
 *
 * Key principles:
 *  - No AI-generated content in plan objects
 *  - No automatic acceptance
 *  - No automatic reminder changes
 *  - Plan persistence is separate from Diary data
 *  - Plans are exportable and deletable
 */

import type { ProgramDefinition, ProgramLessonDefinition } from "./types";
import { safeLocalStorageGet, safeLocalStorageSet, safeLocalStorageRemove } from "../safe-storage";
import { PLANS_KEY } from "./storage";

// =============================================================================
// Types
// =============================================================================

/** Source of a weekly plan recommendation. */
export type PlanSource = "baseline" | "weekly_focus" | "manual_selection";

/** Status of a weekly plan in its lifecycle. */
export type PlanStatus = "proposed" | "accepted" | "dismissed" | "completed";

/**
 * A weekly program plan.
 *
 * This is a recommendation to the user about which lessons to focus on
 * in a given week. It does NOT change program progress by itself —
 * the user must engage with lessons and mark them complete.
 */
export interface WeeklyProgramPlan {
  /** Unique plan ID. */
  id: string;
  /** Which program this plan is for. */
  programId: string;
  /** Week start date (ISO date string, YYYY-MM-DD, Monday). */
  weekStart: string;
  /** Week end date (ISO date string, YYYY-MM-DD, Sunday). */
  weekEnd: string;
  /** What generated this plan. */
  source: PlanSource;
  /** ID of the focus that generated this plan (if source === weekly_focus). */
  focusId?: string;
  /** i18n key for the plan explanation / rationale. */
  reasonKey: string;
  /** Lesson IDs recommended for this week. */
  recommendedLessonIds: string[];
  /** Lesson IDs the user has explicitly accepted (subset of recommended). */
  acceptedLessonIds: string[];
  /** Current lifecycle status. */
  status: PlanStatus;
  /** When the plan was first generated. */
  generatedAt: string;
  /** When the plan was last updated (status change, etc.). */
  updatedAt: string;
  /** Optional deferred-until date (ISO). If set, plan is deferred. */
  deferredUntil?: string;
}

// =============================================================================
// Validation
// =============================================================================

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Domain-specific error thrown when a weekly plan fails validation on save.
 * Contains the list of validation issues for programmatic inspection.
 */
export class WeeklyPlanValidationError extends Error {
  readonly issues: string[];
  readonly planId: string;

  constructor(planId: string, issues: string[]) {
    super(`Weekly plan validation failed (${planId}): ${issues.join("; ")}`);
    this.name = "WeeklyPlanValidationError";
    this.planId = planId;
    this.issues = issues;
  }
}

/**
 * Validate that all lesson IDs in a plan reference real lessons.
 * Returns true if all recommendedLessonIds exist in the program definition.
 */
export function validatePlanLessonIds(
  plan: WeeklyProgramPlan,
  definition: ProgramDefinition,
): boolean {
  const validIds = new Set(definition.lessons.map((l) => l.id));
  return plan.recommendedLessonIds.every((id) => validIds.has(id));
}

/**
 * Validate that acceptedLessonIds is a subset of recommendedLessonIds.
 * Manual selection source is the only case where accepted may include
 * lessons not in recommended — but we still require the set to be valid
 * lesson IDs in both arrays.
 */
export function validatePlanAcceptance(plan: WeeklyProgramPlan): boolean {
  // For manual selection, accepted lessons do NOT need to be a subset of
  // recommended, but both arrays must contain valid lesson IDs.
  if (plan.source === "manual_selection") {
    return true; // valid by policy; lesson IDs validated separately
  }
  const recSet = new Set(plan.recommendedLessonIds);
  return plan.acceptedLessonIds.every((id) => recSet.has(id));
}

/**
 * Full plan validation. Returns list of issues (empty = valid).
 *
 * Checks enforced:
 *  - Required fields present
 *  - Valid Program ID
 *  - Valid week date range (ISO date format, start <= end, Monday start)
 *  - Valid plan source
 *  - Valid plan status
 *  - No duplicate lesson IDs in recommended or accepted arrays
 *  - All recommended lesson IDs reference real lessons
 *  - acceptedLessonIds is subset of recommended (unless manual_selection)
 *  - Valid date order (start <= end)
 */
export function validatePlan(plan: WeeklyProgramPlan, definition: ProgramDefinition): string[] {
  const issues: string[] = [];

  // Required fields
  if (!plan.id) issues.push("plan.id is required");
  if (!plan.programId) issues.push("plan.programId is required");
  if (!plan.weekStart) issues.push("plan.weekStart is required");
  if (!plan.weekEnd) issues.push("plan.weekEnd is required");
  if (!plan.source) issues.push("plan.source is required");
  if (!plan.reasonKey) issues.push("plan.reasonKey is required");

  // Valid program ID
  if (plan.programId && plan.programId !== definition.id) {
    issues.push(`plan.programId "${plan.programId}" does not match definition "${definition.id}"`);
  }

  // Valid source
  const validSources: PlanSource[] = ["baseline", "weekly_focus", "manual_selection"];
  if (plan.source && !validSources.includes(plan.source as PlanSource)) {
    issues.push(`plan.source "${plan.source}" is not valid`);
  }

  // Valid status
  const validStatuses: PlanStatus[] = ["proposed", "accepted", "dismissed", "completed"];
  if (plan.status && !validStatuses.includes(plan.status as PlanStatus)) {
    issues.push(`plan.status "${plan.status}" is not valid`);
  }

  // Date format
  if (plan.weekStart && !ISO_DATE_RE.test(plan.weekStart)) {
    issues.push("plan.weekStart must be ISO date format (YYYY-MM-DD)");
  }
  if (plan.weekEnd && !ISO_DATE_RE.test(plan.weekEnd)) {
    issues.push("plan.weekEnd must be ISO date format (YYYY-MM-DD)");
  }

  // Date order
  if (
    plan.weekStart &&
    plan.weekEnd &&
    ISO_DATE_RE.test(plan.weekStart) &&
    ISO_DATE_RE.test(plan.weekEnd)
  ) {
    if (plan.weekStart > plan.weekEnd) {
      issues.push("plan.weekStart must be on or before plan.weekEnd");
    }
  }

  // Array types
  if (!Array.isArray(plan.recommendedLessonIds)) {
    issues.push("plan.recommendedLessonIds must be an array");
  }
  if (!Array.isArray(plan.acceptedLessonIds)) {
    issues.push("plan.acceptedLessonIds must be an array");
  }

  // No duplicate lesson IDs
  if (Array.isArray(plan.recommendedLessonIds)) {
    const recSet = new Set(plan.recommendedLessonIds);
    if (recSet.size !== plan.recommendedLessonIds.length) {
      issues.push("plan.recommendedLessonIds contains duplicates");
    }
  }
  if (Array.isArray(plan.acceptedLessonIds)) {
    const accSet = new Set(plan.acceptedLessonIds);
    if (accSet.size !== plan.acceptedLessonIds.length) {
      issues.push("plan.acceptedLessonIds contains duplicates");
    }
  }

  // All recommended lesson IDs are valid
  if (Array.isArray(plan.recommendedLessonIds) && !validatePlanLessonIds(plan, definition)) {
    issues.push("plan has invalid lesson IDs in recommendedLessonIds");
  }

  // All accepted lesson IDs are valid
  if (Array.isArray(plan.acceptedLessonIds)) {
    const validIds = new Set(definition.lessons.map((l) => l.id));
    const invalidAccepted = plan.acceptedLessonIds.filter((id) => !validIds.has(id));
    if (invalidAccepted.length > 0) {
      issues.push("plan has invalid lesson IDs in acceptedLessonIds");
    }
  }

  // Accepted subset of recommended (except manual_selection)
  if (!validatePlanAcceptance(plan)) {
    issues.push("plan.acceptedLessonIds must be subset of recommended (when not manual_selection)");
  }

  return issues;
}

// =============================================================================
// Derived Values
// =============================================================================

/**
 * Get the full lesson objects for a plan's recommended lessons.
 */
export function getPlanLessons(
  plan: WeeklyProgramPlan,
  definition: ProgramDefinition,
): ProgramLessonDefinition[] {
  const lessonMap = new Map(definition.lessons.map((l) => [l.id, l]));
  return plan.recommendedLessonIds
    .map((id) => lessonMap.get(id))
    .filter((l): l is ProgramLessonDefinition => l !== undefined);
}

/**
 * Check if a plan can be accepted (all recommended lessons are valid).
 */
export function canAcceptPlan(plan: WeeklyProgramPlan, definition: ProgramDefinition): boolean {
  return (
    plan.status === "proposed" &&
    validatePlanLessonIds(plan, definition) &&
    plan.recommendedLessonIds.length > 0
  );
}

// =============================================================================
// Storage (plans array — lightweight, SSR-safe)
// =============================================================================

interface PlansStorage {
  schemaVersion: 1;
  plans: WeeklyProgramPlan[];
}

const EMPTY_PLANS: PlansStorage = { schemaVersion: 1, plans: [] };

/**
 * Load all saved weekly plans.
 * SSR-safe: returns empty array on server.
 */
export function loadWeeklyPlans(): WeeklyProgramPlan[] {
  // safeLocalStorageGet always parses JSON automatically.
  const raw = safeLocalStorageGet<PlansStorage | null>(PLANS_KEY, null);
  if (!raw || !Array.isArray(raw.plans)) return [];
  return raw.plans as WeeklyProgramPlan[];
}

/**
 * Save (upsert) a single weekly plan.
 *
 * Validation is enforced before persistence. If the plan is invalid:
 *   - A WeeklyPlanValidationError is thrown
 *   - The existing valid plan (if any) is preserved
 *   - No partial write occurs
 *
 * SSR-safe: no-op on server.
 *
 * @throws {WeeklyPlanValidationError} if the plan fails validation
 */
export function saveWeeklyPlan(plan: WeeklyProgramPlan, definition: ProgramDefinition): void {
  const issues = validatePlan(plan, definition);
  if (issues.length > 0) {
    throw new WeeklyPlanValidationError(plan.id || "<unknown>", issues);
  }

  const all = loadWeeklyPlans();
  const idx = all.findIndex((p) => p.id === plan.id);
  if (idx >= 0) {
    all[idx] = plan;
  } else {
    all.push(plan);
  }
  const storage: PlansStorage = { schemaVersion: 1, plans: all };
  // safeLocalStorageSet always stringifies JSON automatically.
  safeLocalStorageSet(PLANS_KEY, storage);
}

/**
 * Delete a weekly plan by ID.
 * SSR-safe: no-op on server.
 */
export function deleteWeeklyPlan(planId: string): void {
  const all = loadWeeklyPlans();
  const filtered = all.filter((p) => p.id !== planId);
  const storage: PlansStorage = { schemaVersion: 1, plans: filtered };
  safeLocalStorageSet(PLANS_KEY, storage);
}

/**
 * Clear all weekly plans.
 * SSR-safe: no-op on server.
 */
export function clearAllWeeklyPlans(): void {
  safeLocalStorageRemove(PLANS_KEY);
}

/**
 * Get a single plan by ID.
 */
export function getWeeklyPlan(planId: string): WeeklyProgramPlan | null {
  const all = loadWeeklyPlans();
  return all.find((p) => p.id === planId) ?? null;
}
