/**
 * Habit Engine — Test Fixture Factories
 *
 * Reusable typed factories for test data.
 * Provides stable realistic defaults so tests can focus on what
 * they're actually testing instead of boilerplate fixture construction.
 */

import type {
  Reminder,
  ReminderOccurrence,
  ReminderEvent,
  ReminderSchedule,
  ReminderStatus,
  ReminderOccurrenceStatus,
  ReminderEventType,
  ReminderChannel,
} from "./habit-types";

const STABLE_ISO = "2025-01-15T12:00:00.000Z";

/**
 * Create a complete Reminder fixture with sensible defaults.
 * Any field can be overridden via the partial.
 */
export function makeReminder(overrides: Partial<Reminder> = {}): Reminder {
  const baseSchedule: ReminderSchedule = { type: "daily", time: "09:00" };
  return {
    id: "rem-test-001",
    ownerId: "anonymous",
    title: "Test Reminder",
    status: "active" as ReminderStatus,
    channels: ["in_app" as ReminderChannel],
    schedule: baseSchedule,
    timezone: "UTC",
    snoozeOptionsMinutes: [5, 10, 15],
    createdAt: STABLE_ISO,
    updatedAt: STABLE_ISO,
    ...overrides,
  };
}

/**
 * Create a complete ReminderOccurrence fixture with sensible defaults.
 * Any field can be overridden via the partial.
 */
export function makeOccurrence(overrides: Partial<ReminderOccurrence> = {}): ReminderOccurrence {
  return {
    id: "occ-test-001",
    reminderId: "rem-test-001",
    scheduledAt: STABLE_ISO,
    dueAt: STABLE_ISO,
    status: "scheduled" as ReminderOccurrenceStatus,
    snoozeCount: 0,
    timezone: "UTC",
    createdAt: STABLE_ISO,
    updatedAt: STABLE_ISO,
    ...overrides,
  };
}

/**
 * Create a complete ReminderEvent fixture with sensible defaults.
 * Any field can be overridden via the partial.
 */
export function makeEvent(overrides: Partial<ReminderEvent> = {}): ReminderEvent {
  return {
    id: "evt-test-001",
    reminderId: "rem-test-001",
    occurrenceId: "occ-test-001",
    type: "delivered" as ReminderEventType,
    timestamp: STABLE_ISO,
    timezone: "UTC",
    source: "system",
    ...overrides,
  };
}
