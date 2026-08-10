/**
 * Sleep Diary v2.5 — Program ↔ Reminder Integration Contract
 *
 * Defines how the Program domain may request reminder support from the
 * Reminder service. This is a ONE-WAY contract:
 *
 *   Program → (requests) → Reminder service
 *
 * The Program domain CANNOT:
 *  - Directly create reminder events
 *  - Modify user reminder settings without confirmation
 *  - Infer lesson completion from reminder delivery
 *
 * The Reminder service OWNS:
 *  - Scheduling and delivery
 *  - Reminder settings persistence
 *  - Provider selection (email, push, etc.)
 *  - Delivery status tracking
 *
 * User confirmation is MANDATORY for any reminder change requested by Program.
 */

import type { SupportedLocale } from "../locale-registry";

// =============================================================================
// Program → Reminder Request
// =============================================================================

/**
 * A request from the Program domain to set up a lesson reminder.
 *
 * This is a REQUEST only — the reminder service decides whether and how
 * to schedule it, and the user must explicitly confirm.
 */
export interface ProgramReminderRequest {
  /** ID of the weekly plan this reminder is for. */
  planId: string;
  /** ID of the lesson this reminder is for. */
  lessonId: string;
  /** i18n key for why this reminder was suggested. */
  reasonKey: string;
  /** Preferred delivery window (local time). Optional. */
  preferredWindow?: {
    startLocalTime: string; // "HH:MM" 24h
    endLocalTime: string; // "HH:MM" 24h
  };
  /** Preferred days of the week (ISO weekday, 1=Monday ... 7=Sunday). */
  preferredDays?: number[];
  /** User's locale, for reminder content selection. */
  locale: SupportedLocale;
  /** When the request was generated. */
  generatedAt: string;
}

// =============================================================================
// Reminder → Program Outcome
// =============================================================================

/**
 * Status of a program reminder request, as reported back by the reminder service.
 *
 * The Program domain consumes these outcomes but does NOT interpret
 * reminder completion as lesson completion. Lesson completion is only
 * set by the user explicitly marking a lesson done.
 */
export type ProgramReminderStatus =
  | "requested" // User has been asked to confirm
  | "scheduled" // User confirmed, reminder is active
  | "declined" // User declined the reminder
  | "delivered" // Reminder was sent
  | "dismissed" // User dismissed the reminder
  | "cancelled"; // Reminder was cancelled

export interface ProgramReminderOutcome {
  /** The original request ID. */
  requestId: string;
  /** Current status. */
  status: ProgramReminderStatus;
  /** When the status last changed. */
  updatedAt: string;
}

// =============================================================================
// Boundary Rules (enforced by this contract module)
// =============================================================================

/**
 * Validate that a reminder request has the minimum required fields.
 * Does NOT validate schedule feasibility — that's the reminder service's job.
 */
export function validateReminderRequest(request: ProgramReminderRequest): string[] {
  const issues: string[] = [];

  if (!request.planId) issues.push("planId is required");
  if (!request.lessonId) issues.push("lessonId is required");
  if (!request.reasonKey) issues.push("reasonKey is required");
  if (!request.locale) issues.push("locale is required");

  if (request.preferredWindow) {
    if (!isValidTime(request.preferredWindow.startLocalTime)) {
      issues.push("preferredWindow.startLocalTime must be HH:MM");
    }
    if (!isValidTime(request.preferredWindow.endLocalTime)) {
      issues.push("preferredWindow.endLocalTime must be HH:MM");
    }
  }

  if (request.preferredDays) {
    if (!request.preferredDays.every((d) => d >= 1 && d <= 7)) {
      issues.push("preferredDays must be 1-7 (ISO weekday)");
    }
  }

  return issues;
}

/**
 * Check whether a reminder outcome should trigger a Program state change.
 *
 * ANSWER: Never. Program progress is separate from reminder delivery.
 * This function exists to make the boundary explicit in code.
 */
export function outcomeAffectsProgramProgress(_outcome: ProgramReminderOutcome): false {
  return false;
}

// =============================================================================
// Helpers
// =============================================================================

function isValidTime(s: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
}
