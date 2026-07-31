/**
 * Reminder Center — localStorage persistence layer.
 *
 * Follows the same defensive pattern as `sleep-records.ts` and
 * `program-progress.ts`: SSR guard, try/catch recovery, field-by-field
 * validation, and a custom event for in-tab reactivity.
 */
import { DEFAULT_REMINDER_SETTINGS, type ReminderSettings } from "./reminder-types";
import { validateReminderSettings } from "./reminder-validation";
import { isBrowser, safeLocalStorageGet, safeLocalStorageSet } from "@/lib/safe-storage";

/** localStorage key for reminder settings. */
export const REMINDER_SETTINGS_KEY = "reminderSettings";

/** Custom event dispatched on save, for in-tab reactivity. */
export const REMINDER_SETTINGS_EVENT = "somna-reminder-settings";

/**
 * Load reminder settings from localStorage.
 * Returns validated settings, or defaults if storage is empty/corrupted.
 */
export function loadReminderSettings(): ReminderSettings {
  if (!isBrowser()) return { ...DEFAULT_REMINDER_SETTINGS };
  const raw = safeLocalStorageGet<Record<string, unknown> | null>(REMINDER_SETTINGS_KEY, null);
  if (!raw) return { ...DEFAULT_REMINDER_SETTINGS };
  return validateReminderSettings(raw);
}

/**
 * Save reminder settings to localStorage and dispatch a custom event.
 * Silently ignores quota/private-mode errors.
 */
export function saveReminderSettings(settings: ReminderSettings): void {
  if (!isBrowser()) return;
  const toStore: ReminderSettings = {
    ...settings,
    reminderTime: settings.reminderTime || settings.eveningTime,
    updatedAt: new Date().toISOString(),
  };
  safeLocalStorageSet(REMINDER_SETTINGS_KEY, toStore, {
    dispatchEvent: REMINDER_SETTINGS_EVENT,
  });
}
