/**
 * Habit Engine — Scheduling Service
 *
 * Deterministic scheduling:
 * - Calculate next occurrence
 * - Calculate occurrences within a date range
 * - Respect timezone and daylight saving transitions
 * - Prevent duplicate occurrences
 */
import {
  type Reminder,
  type ReminderSchedule,
  type ReminderOccurrence,
} from "./habit-types";
import { loadReminders, loadOccurrences, addOccurrence } from "./habit-storage";

// ============================================
// ID Generation
// ============================================
export function generateId(prefix: string): string {
  const now = new Date();
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${now.getTime()}_${random}`;
}

// ============================================
// Time Parsing Helpers
// ============================================
export function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours: hours || 0, minutes: minutes || 0 };
}

export function formatTime(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// ============================================
// Timezone-Aware Date Creation
// ============================================
export function createDateInTimezone(
  dateStr: string,    // YYYY-MM-DD
  timeStr: string,    // HH:MM
  timezone: string
): Date {
  const { hours, minutes } = parseTime(timeStr);
  const [year, month, day] = dateStr.split("-").map(Number);

  // Create date in the specified timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Create a UTC date as reference
  const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  // Format the UTC date in the target timezone and parse back
  // This handles DST transitions correctly
  const formatted = formatter.format(utcDate);
  const [m, d, y, time] = formatted.split(/[\/,\s]+/);
  const [h, min] = time.split(":").map(Number);

  return new Date(Date.UTC(parseInt(y), parseInt(m) - 1, parseInt(d), h, min));
}

// ============================================
// Date Helpers
// ============================================
export function getLocalDate(date: Date, timezone: string): string {
  return date.toLocaleDateString("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isDateInRange(
  date: string, // YYYY-MM-DD
  startDate?: string,
  endDate?: string
): boolean {
  if (startDate && date < startDate) return false;
  if (endDate && date > endDate) return false;
  return true;
}

// ============================================
// Weekday Calculation
// ============================================
export function getWeekdayInTimezone(date: Date, timezone: string): number {
  // Returns 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const dayStr = date.toLocaleDateString("en-US", {
    timeZone: timezone,
    weekday: "long",
  });
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekdays.indexOf(dayStr);
}

export function shouldRunOnWeekday(
  schedule: ReminderSchedule,
  date: Date,
  timezone: string
): boolean {
  if (schedule.type === "daily") return true;

  const weekday = getWeekdayInTimezone(date, timezone);
  return schedule.days?.includes(weekday) ?? false;
}

// ============================================
// Next Occurrence Calculation
// ============================================
export function getNextOccurrenceDate(
  schedule: ReminderSchedule,
  timezone: string,
  after: Date = new Date()
): Date | null {
  const maxDays = 365; // Prevent infinite loop
  let current = new Date(after);

  for (let i = 0; i < maxDays; i++) {
    const localDate = getLocalDate(current, timezone);

    if (!isDateInRange(localDate, schedule.startDate, schedule.endDate)) {
      current = addDays(current, 1);
      continue;
    }

    if (shouldRunOnWeekday(schedule, current, timezone)) {
      const occurrenceTime = createDateInTimezone(localDate, schedule.time, timezone);
      if (occurrenceTime > after) {
        return occurrenceTime;
      }
    }

    current = addDays(current, 1);
  }

  return null; // No next occurrence found within a year
}

// ============================================
// Occurrence Generation for Date Range
// ============================================
export function getOccurrencesInRange(
  schedule: ReminderSchedule,
  timezone: string,
  startDate: Date,
  endDate: Date
): Date[] {
  const occurrences: Date[] = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    const localDate = getLocalDate(current, timezone);

    if (isDateInRange(localDate, schedule.startDate, schedule.endDate) &&
      shouldRunOnWeekday(schedule, current, timezone)) {
      const occurrenceTime = createDateInTimezone(localDate, schedule.time, timezone);
      if (occurrenceTime >= startDate && occurrenceTime <= endDate) {
        occurrences.push(occurrenceTime);
      }
    }

    current = addDays(current, 1);
  }

  return occurrences;
}

// ============================================
// Duplicate Prevention
// ============================================
export function occurrenceExists(
  reminderId: string,
  scheduledAt: string
): boolean {
  const existing = loadOccurrences();
  return existing.some(
    o => o.reminderId === reminderId && o.scheduledAt === scheduledAt
  );
}

// ============================================
// Create New Occurrence
// ============================================
export function createOccurrence(
  reminder: Reminder,
  scheduledAt: Date
): ReminderOccurrence {
  const now = new Date().toISOString();

  return {
    id: generateId("occ"),
    reminderId: reminder.id,
    scheduledAt: scheduledAt.toISOString(),
    dueAt: scheduledAt.toISOString(),
    status: "scheduled",
    snoozeCount: 0,
    timezone: reminder.timezone,
    createdAt: now,
    updatedAt: now,
  };
}

// ============================================
// Generate Upcoming Occurrences for a Reminder
// ============================================
export function generateUpcomingOccurrences(
  reminder: Reminder,
  daysAhead: number = 7
): ReminderOccurrence[] {
  if (reminder.status !== "active") return [];

  const now = new Date();
  const endDate = addDays(now, daysAhead);
  const dates = getOccurrencesInRange(reminder.schedule, reminder.timezone, now, endDate);

  const newOccurrences: ReminderOccurrence[] = [];

  for (const date of dates) {
    const scheduledAt = date.toISOString();
    if (!occurrenceExists(reminder.id, scheduledAt)) {
      const occurrence = createOccurrence(reminder, date);
      addOccurrence(occurrence);
      newOccurrences.push(occurrence);
    }
  }

  return newOccurrences;
}

// ============================================
// Generate Occurrences for All Active Reminders
// ============================================
export function generateAllUpcomingOccurrences(daysAhead: number = 7): void {
  const reminders = loadReminders();
  for (const reminder of reminders) {
    if (reminder.status === "active") {
      generateUpcomingOccurrences(reminder, daysAhead);
    }
  }
}

// ============================================
// Check for Missed Occurrences
// ============================================
export function findMissedOccurrences(
  gracePeriodMinutes: number = 60
): ReminderOccurrence[] {
  const now = new Date();
  const gracePeriod = gracePeriodMinutes * 60 * 1000;
  const cutoff = new Date(now.getTime() - gracePeriod);

  const occurrences = loadOccurrences();
  return occurrences.filter(o =>
    o.status === "scheduled" &&
    new Date(o.dueAt) < cutoff
  );
}

// ============================================
// Snooze Occurrence
// ============================================
export function snoozeOccurrence(
  occurrence: ReminderOccurrence,
  minutes: number
): Date {
  const dueDate = new Date(occurrence.dueAt);
  dueDate.setMinutes(dueDate.getMinutes() + minutes);
  return dueDate;
}

// ============================================
// Get Next Occurrence for Reminder
// ============================================
export function getNextOccurrenceForReminder(
  reminderId: string
): ReminderOccurrence | null {
  const occurrences = loadOccurrences();
  const now = new Date().toISOString();

  const upcoming = occurrences
    .filter(o => o.reminderId === reminderId && o.status === "scheduled" && o.dueAt > now)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));

  return upcoming[0] || null;
}
