/**
 * Habit Engine — localStorage Persistence
 *
 * Follows the same defensive pattern as sleep-records.ts:
 * SSR guard, try/catch recovery, field-by-field validation,
 * and custom events for cross-tab reactivity.
 */
import {
  type Reminder,
  type ReminderOccurrence,
  type ReminderEvent,
  type NotificationPreferences,
  DEFAULT_NOTIFICATION_PREFS,
} from "./habit-types";
import {
  isBrowser,
  safeLocalStorageGet,
  safeLocalStorageSet,
} from "@/lib/safe-storage";

// ============================================
// Storage Keys
// ============================================
export const REMINDERS_KEY = "habitReminders";
export const OCCURRENCES_KEY = "reminderOccurrences";
export const EVENTS_KEY = "reminderEvents";
export const NOTIFICATION_PREFS_KEY = "notificationPrefs";

// ============================================
// Custom Events for Cross-Tab Reactivity
// ============================================
export const REMINDERS_CHANGED_EVENT = "somna-reminders-changed";
export const OCCURRENCES_CHANGED_EVENT = "somna-occurrences-changed";
export const EVENTS_CHANGED_EVENT = "somna-events-changed";

// ============================================
// Generic Storage Helpers
// ============================================
function loadFromStorage<T>(key: string, defaultValue: T): T {
  return safeLocalStorageGet<T>(key, defaultValue);
}

function saveToStorage<T>(key: string, value: T, eventName: string): void {
  safeLocalStorageSet(key, value, { dispatchEvent: eventName });
}

// ============================================
// Reminder Storage
// ============================================
export function loadReminders(): Reminder[] {
  return loadFromStorage<Reminder[]>(REMINDERS_KEY, []);
}

export function saveReminders(reminders: Reminder[]): void {
  saveToStorage(REMINDERS_KEY, reminders, REMINDERS_CHANGED_EVENT);
}

export function addReminder(reminder: Reminder): Reminder[] {
  const reminders = loadReminders();
  const updated = [...reminders, reminder];
  saveReminders(updated);
  return updated;
}

export function updateReminder(id: string, updates: Partial<Reminder>): Reminder | null {
  const reminders = loadReminders();
  const index = reminders.findIndex(r => r.id === id);
  if (index === -1) return null;

  const updated = {
    ...reminders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  reminders[index] = updated;
  saveReminders(reminders);
  return updated;
}

export function archiveReminder(id: string): Reminder | null {
  return updateReminder(id, {
    status: "archived",
    archivedAt: new Date().toISOString(),
  });
}

export function pauseReminder(id: string): Reminder | null {
  return updateReminder(id, { status: "paused" });
}

export function resumeReminder(id: string): Reminder | null {
  return updateReminder(id, { status: "active" });
}

// ============================================
// Occurrence Storage
// ============================================
export function loadOccurrences(): ReminderOccurrence[] {
  return loadFromStorage<ReminderOccurrence[]>(OCCURRENCES_KEY, []);
}

export function saveOccurrences(occurrences: ReminderOccurrence[]): void {
  saveToStorage(OCCURRENCES_KEY, occurrences, OCCURRENCES_CHANGED_EVENT);
}

export function addOccurrence(occurrence: ReminderOccurrence): ReminderOccurrence[] {
  const occurrences = loadOccurrences();
  const updated = [...occurrences, occurrence];
  saveOccurrences(updated);
  return updated;
}

export function updateOccurrence(id: string, updates: Partial<ReminderOccurrence>): ReminderOccurrence | null {
  const occurrences = loadOccurrences();
  const index = occurrences.findIndex(o => o.id === id);
  if (index === -1) return null;

  const updated = {
    ...occurrences[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  occurrences[index] = updated;
  saveOccurrences(occurrences);
  return updated;
}

export function getOccurrencesByReminder(reminderId: string): ReminderOccurrence[] {
  return loadOccurrences().filter(o => o.reminderId === reminderId);
}

export function getDueOccurrences(now: Date = new Date()): ReminderOccurrence[] {
  const nowIso = now.toISOString();
  return loadOccurrences().filter(o =>
    o.status === "scheduled" && o.dueAt <= nowIso
  );
}

export function getUndeliveredDueOccurrences(now: Date = new Date()): ReminderOccurrence[] {
  const nowIso = now.toISOString();
  return loadOccurrences().filter(o =>
    (o.status === "scheduled" || o.status === "due") && o.dueAt <= nowIso
  );
}

// ============================================
// Event Storage (Append-Only)
// ============================================
export function loadEvents(): ReminderEvent[] {
  return loadFromStorage<ReminderEvent[]>(EVENTS_KEY, []);
}

export function appendEvent(event: ReminderEvent): void {
  const events = loadEvents();
  // Keep only last 90 days of events to avoid quota issues
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const pruned = events.filter(e => new Date(e.timestamp) >= cutoff);
  saveToStorage(EVENTS_KEY, [...pruned, event], EVENTS_CHANGED_EVENT);
}

export function getEventsByReminder(reminderId: string): ReminderEvent[] {
  return loadEvents().filter(e => e.reminderId === reminderId);
}

// ============================================
// Notification Preferences Storage
// ============================================
export function loadNotificationPrefs(): NotificationPreferences {
  const stored = loadFromStorage<Partial<NotificationPreferences>>(
    NOTIFICATION_PREFS_KEY,
    {}
  );
  return { ...DEFAULT_NOTIFICATION_PREFS, ...stored };
}

export function saveNotificationPrefs(prefs: NotificationPreferences): void {
  saveToStorage(NOTIFICATION_PREFS_KEY, prefs, "somna-notification-prefs-changed");
}

export function updateNotificationPermission(permission: NotificationPermission): void {
  const prefs = loadNotificationPrefs();
  saveNotificationPrefs({
    ...prefs,
    permission,
    lastRequestedAt: new Date().toISOString(),
    userExplicitlyDenied: permission === "denied",
  });
}

// ============================================
// Storage Event Listeners
// ============================================
export function subscribeToReminderChanges(callback: (reminders: Reminder[]) => void): () => void {
  if (!isBrowser()) return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<Reminder[]>;
    callback(customEvent.detail || loadReminders());
  };

  window.addEventListener(REMINDERS_CHANGED_EVENT, handler);
  return () => window.removeEventListener(REMINDERS_CHANGED_EVENT, handler);
}

export function subscribeToOccurrenceChanges(callback: (occurrences: ReminderOccurrence[]) => void): () => void {
  if (!isBrowser()) return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<ReminderOccurrence[]>;
    callback(customEvent.detail || loadOccurrences());
  };

  window.addEventListener(OCCURRENCES_CHANGED_EVENT, handler);
  return () => window.removeEventListener(OCCURRENCES_CHANGED_EVENT, handler);
}
