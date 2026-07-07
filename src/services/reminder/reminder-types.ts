/**
 * Reminder Center — shared types.
 *
 * These types are consumed by the storage layer, the validation layer, the
 * (future) provider implementations, and the Dashboard UI. Keeping them in a
 * single dependency-free module avoids circular imports between the service
 * and its consumers.
 */

/** Days of the week for the weekly summary reminder. */
export type Weekday =
  "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

/** Canonical reminder settings persisted to localStorage. */
export interface ReminderSettings {
  /** Master switch for email reminders. Default: false. */
  enabled: boolean;
  /** Lowercased, trimmed email address. Empty string when not set. */
  email: string;
  /** Morning reminder time, "HH:MM" 24h. Default: "07:30". */
  morningTime: string;
  /** Evening reminder time, "HH:MM" 24h. Default: "22:00". */
  eveningTime: string;
  /** Day of the week for the weekly summary. Default: "Sunday". */
  weeklyDay: Weekday;
  /** ISO timestamp of the last save. */
  updatedAt: string;
}

/** A single reminder to be dispatched through a provider. */
export interface ReminderPayload {
  /** Which reminder type this is. */
  type: "morning" | "evening" | "weekly";
  /** The user's settings at generation time. */
  settings: ReminderSettings;
  /** Localized subject line (future use). */
  subject: string;
  /** Localized body text (future use). */
  body: string;
}

/**
 * A delivery channel for reminders. Phase 1 ships only the EmailProvider stub.
 * Future providers (Web Push, WeChat, Calendar, Mobile Push) implement this
 * same interface so the Dashboard never needs to change.
 */
export interface ReminderProvider {
  /** Unique provider id, e.g. "email", "web-push". */
  readonly id: string;
  /** Human-readable label (i18n key). */
  readonly labelKey: string;
  /** Validate the address/credentials for this provider. */
  validate(settings: ReminderSettings): { valid: boolean; error?: string };
  /** Prepare (but do not send) a reminder payload. */
  prepare(payload: ReminderPayload): ReminderPayload;
  /** Send a reminder. Phase 1: stub only, resolves immediately. */
  send(payload: ReminderPayload): Promise<{ success: boolean; error?: string }>;
}

/** Default settings used on first load and when storage is corrupted. */
export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: false,
  email: "",
  morningTime: "07:30",
  eveningTime: "22:00",
  weeklyDay: "Sunday",
  updatedAt: "",
};

/** All valid weekday values, in display order. */
export const WEEKDAYS: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
