/**
 * Habit Engine — Event Store
 *
 * Append-only event log for all reminder actions.
 * Events are immutable and serve as the source of truth for habit history.
 */
import {
  type ReminderEvent,
  type ReminderEventType,
  type ReminderChannel,
  type Reminder,
  type ReminderOccurrence,
} from "./habit-types";
import { appendEvent, loadEvents } from "./habit-storage";
import { generateId } from "./habit-scheduler";

// ============================================
// Event Factory
// ============================================
export function createEvent(
  type: ReminderEventType,
  reminder: Reminder,
  options: {
    occurrence?: ReminderOccurrence;
    channel?: ReminderChannel;
    source?: "user" | "system" | "browser" | "diary_integration";
    metadata?: Record<string, unknown>;
  } = {},
): ReminderEvent {
  const now = new Date();

  return {
    id: generateId("evt"),
    reminderId: reminder.id,
    occurrenceId: options.occurrence?.id,
    type,
    timestamp: now.toISOString(),
    timezone: reminder.timezone,
    channel: options.channel,
    source: options.source || "system",
    metadata: options.metadata,
  };
}

// ============================================
// Event Logging Functions
// ============================================
export function logReminderCreated(reminder: Reminder): void {
  appendEvent(createEvent("created", reminder, { source: "user" }));
}

export function logReminderUpdated(reminder: Reminder): void {
  appendEvent(createEvent("updated", reminder, { source: "user" }));
}

export function logReminderPaused(reminder: Reminder): void {
  appendEvent(createEvent("paused", reminder, { source: "user" }));
}

export function logReminderResumed(reminder: Reminder): void {
  appendEvent(createEvent("resumed", reminder, { source: "user" }));
}

export function logReminderArchived(reminder: Reminder): void {
  appendEvent(createEvent("archived", reminder, { source: "user" }));
}

export function logOccurrenceScheduled(reminder: Reminder, occurrence: ReminderOccurrence): void {
  appendEvent(createEvent("scheduled", reminder, { occurrence, source: "system" }));
}

export function logOccurrenceDelivered(
  reminder: Reminder,
  occurrence: ReminderOccurrence,
  channel: ReminderChannel,
): void {
  appendEvent(createEvent("delivered", reminder, { occurrence, channel, source: "system" }));
}

export function logOccurrenceCompleted(
  reminder: Reminder,
  occurrence: ReminderOccurrence,
  source: "user" | "diary_integration" = "user",
): void {
  appendEvent(createEvent("completed", reminder, { occurrence, source }));
}

export function logOccurrenceSnoozed(
  reminder: Reminder,
  occurrence: ReminderOccurrence,
  snoozeMinutes: number,
): void {
  appendEvent(
    createEvent("snoozed", reminder, {
      occurrence,
      source: "user",
      metadata: { snoozeMinutes },
    }),
  );
}

export function logOccurrenceDismissed(reminder: Reminder, occurrence: ReminderOccurrence): void {
  appendEvent(createEvent("dismissed", reminder, { occurrence, source: "user" }));
}

export function logOccurrenceMissed(reminder: Reminder, occurrence: ReminderOccurrence): void {
  appendEvent(createEvent("missed", reminder, { occurrence, source: "system" }));
}

export function logNotificationPermissionGranted(reminder: Reminder): void {
  appendEvent(createEvent("permission_granted", reminder, { source: "browser" }));
}

export function logNotificationPermissionDenied(reminder: Reminder): void {
  appendEvent(createEvent("permission_denied", reminder, { source: "browser" }));
}

// ============================================
// Event Queries
// ============================================
export function getCompletionEvents(reminderId: string): ReminderEvent[] {
  return loadEvents().filter((e) => e.reminderId === reminderId && e.type === "completed");
}

export function getSnoozeEvents(reminderId: string): ReminderEvent[] {
  return loadEvents().filter((e) => e.reminderId === reminderId && e.type === "snoozed");
}

export function getMissedEvents(reminderId: string): ReminderEvent[] {
  return loadEvents().filter((e) => e.reminderId === reminderId && e.type === "missed");
}

export function getEventsByDateRange(
  reminderId: string,
  startDate: Date,
  endDate: Date,
): ReminderEvent[] {
  const start = startDate.toISOString();
  const end = endDate.toISOString();

  return loadEvents().filter(
    (e) => e.reminderId === reminderId && e.timestamp >= start && e.timestamp <= end,
  );
}

export function getEventCountByType(reminderId: string, type: ReminderEventType): number {
  return loadEvents().filter((e) => e.reminderId === reminderId && e.type === type).length;
}

// ============================================
// Event Reduction (Reconstruct State)
// ============================================
export function getCompletionCount(reminderId: string): number {
  return getCompletionEvents(reminderId).length;
}

export function getSnoozeCount(reminderId: string): number {
  return getSnoozeEvents(reminderId).length;
}

export function getMissedCount(reminderId: string): number {
  return getMissedEvents(reminderId).length;
}

/**
 * Calculate total opportunities for completion based on scheduled occurrences.
 * This provides the denominator for consistency rate.
 */
export function getTotalOpportunities(
  reminderId: string,
  startDate?: Date,
  endDate?: Date,
): number {
  // Count all non-cancelled occurrences within the date range
  const events = loadEvents().filter((e) => e.reminderId === reminderId);
  const relevantTypes: ReminderEventType[] = ["completed", "missed", "dismissed", "snoozed"];

  if (!startDate && !endDate) {
    return events.filter((e) => relevantTypes.includes(e.type)).length;
  }

  const start = startDate?.toISOString() || "1970-01-01";
  const end = endDate?.toISOString() || new Date().toISOString();

  return events.filter(
    (e) => relevantTypes.includes(e.type) && e.timestamp >= start && e.timestamp <= end,
  ).length;
}
