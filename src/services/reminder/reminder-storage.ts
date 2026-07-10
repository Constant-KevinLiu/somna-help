/**
 * Reminder Center — localStorage persistence layer.
 *
 * Follows the same defensive pattern as `sleep-records.ts` and
 * `program-progress.ts`: SSR guard, try/catch recovery, field-by-field
 * validation, and a custom event for in-tab reactivity.
 */
import { DEFAULT_REMINDER_SETTINGS, type ReminderSettings } from "./reminder-types";
import { validateReminderSettings } from "./reminder-validation";

/** localStorage key for reminder settings. */
export const REMINDER_SETTINGS_KEY = "reminderSettings";

/** Custom event dispatched on save, for in-tab reactivity. */
export const REMINDER_SETTINGS_EVENT = "somna-reminder-settings";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * Load reminder settings from localStorage.
 * Returns validated settings, or defaults if storage is empty/corrupted.
 */
export function loadReminderSettings(): ReminderSettings {
  if (!isBrowser()) return { ...DEFAULT_REMINDER_SETTINGS };
  try {
    const raw = window.localStorage.getItem(REMINDER_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_REMINDER_SETTINGS };
    const parsed = JSON.parse(raw);
    return validateReminderSettings(parsed);
  } catch {
    return { ...DEFAULT_REMINDER_SETTINGS };
  }
}

/**
 * Save reminder settings to localStorage and dispatch a custom event.
 * Silently ignores quota/private-mode errors.
 */
export function saveReminderSettings(settings: ReminderSettings): void {
  if (!isBrowser()) return;
  try {
    const toStore: ReminderSettings = {
      ...settings,
      reminderTime: settings.reminderTime || settings.eveningTime,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(toStore));
    window.dispatchEvent(new CustomEvent(REMINDER_SETTINGS_EVENT, { detail: toStore }));
  } catch {
    /* ignore quota / private mode errors */
  }
}
