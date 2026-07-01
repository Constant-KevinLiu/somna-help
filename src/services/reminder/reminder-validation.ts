/**
 * Reminder Center — validation layer.
 *
 * Pure functions with no side effects. Used by the storage layer (to reject
 * corrupted data) and by the UI (to show inline form errors before saving).
 */
import {
  DEFAULT_REMINDER_SETTINGS,
  type ReminderSettings,
  type Weekday,
  WEEKDAYS,
} from "./reminder-types";

const TIME_FORMAT = /^([01]\d|2[0-3]):([0-5]\d)$/; // "HH:MM" 24h
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEEKDAY_SET = new Set<Weekday>(WEEKDAYS);

/** True if `value` is a valid "HH:MM" 24-hour time string. */
export function isValidTime(value: unknown): value is string {
  return typeof value === "string" && TIME_FORMAT.test(value);
}

/** True if `value` is a syntactically valid email (RFC 5322 simplified). */
export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_FORMAT.test(value);
}

/** True if `value` is one of the seven weekday constants. */
export function isValidWeekday(value: unknown): value is Weekday {
  return typeof value === "string" && WEEKDAY_SET.has(value as Weekday);
}

/**
 * Normalize an email: trim whitespace and lowercase. Returns "" for non-strings.
 * Does NOT validate — pair with `isValidEmail()` for that.
 */
export function normalizeEmail(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

/**
 * Validate a complete `ReminderSettings` object field-by-field.
 * Returns the validated settings on success, or the defaults on failure.
 *
 * This is the defensive narrowing pattern used across the codebase
 * (see `sleep-records.ts::loadRecords`): never trust parsed JSON shape.
 */
export function validateReminderSettings(raw: unknown): ReminderSettings {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_REMINDER_SETTINGS };
  const obj = raw as Record<string, unknown>;

  const enabled = typeof obj.enabled === "boolean" ? obj.enabled : false;
  const email = typeof obj.email === "string" ? normalizeEmail(obj.email) : "";
  const morningTime = isValidTime(obj.morningTime) ? obj.morningTime : "07:30";
  const eveningTime = isValidTime(obj.eveningTime) ? obj.eveningTime : "22:00";
  const weeklyDay = isValidWeekday(obj.weeklyDay) ? obj.weeklyDay : "Sunday";
  const updatedAt = typeof obj.updatedAt === "string" ? obj.updatedAt : "";

  return { enabled, email, morningTime, eveningTime, weeklyDay, updatedAt };
}

/**
 * Validate the email field for the UI form.
 * Returns null when valid, or an i18n error key when invalid.
 */
export function validateEmailForUI(email: string): string | null {
  const normalized = normalizeEmail(email);
  if (!normalized) return "reminder.error.emailEmpty";
  if (!isValidEmail(normalized)) return "reminder.error.emailInvalid";
  return null;
}
