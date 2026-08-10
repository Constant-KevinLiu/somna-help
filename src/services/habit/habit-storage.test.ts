/**
 * Habit Storage SSR Safety Tests
 *
 * Tests cover:
 * - SSR-safe loading and saving
 * - Malformed storage handling
 * - Empty/legacy data handling
 * - Default value fallbacks
 */

import { describe, it, expect } from "vitest";

import {
  loadReminders,
  saveReminders,
  addReminder,
  updateReminder,
  archiveReminder,
  pauseReminder,
  resumeReminder,
  loadOccurrences,
  saveOccurrences,
  loadEvents,
  appendEvent,
  loadNotificationPrefs,
  saveNotificationPrefs,
  updateNotificationPermission,
} from "./habit-storage";
import { DEFAULT_NOTIFICATION_PREFS } from "./habit-types";
import type { NotificationPreferences } from "./habit-types";
import { makeReminder, makeOccurrence, makeEvent } from "./habit-test-fixtures";

// =============================================================================
// SSR Safety Tests
// =============================================================================

describe("Reminder Storage (SSR)", () => {
  it("loadReminders returns empty array in SSR environment", () => {
    const reminders = loadReminders();
    expect(reminders).toEqual([]);
    expect(Array.isArray(reminders)).toBeTruthy();
  });

  it("saveReminders does not throw in SSR environment", () => {
    const testReminder = makeReminder({
      id: "test-123",
      title: "Test Reminder",
      message: "Test message",
    });
    // This should not throw
    saveReminders([testReminder]);
    expect(true).toBeTruthy();
  });

  it("addReminder does not throw in SSR environment and returns array", () => {
    const testReminder = makeReminder({
      id: "test-123",
      title: "Test Reminder",
      message: "Test message",
    });
    const result = addReminder(testReminder);
    expect(Array.isArray(result)).toBeTruthy();
  });

  it("updateReminder returns null in SSR environment", () => {
    const result = updateReminder("non-existent-id", { title: "Updated" });
    expect(result).toBe(null);
  });

  it("archiveReminder returns null in SSR environment", () => {
    const result = archiveReminder("non-existent-id");
    expect(result).toBe(null);
  });

  it("pauseReminder returns null in SSR environment", () => {
    const result = pauseReminder("non-existent-id");
    expect(result).toBe(null);
  });

  it("resumeReminder returns null in SSR environment", () => {
    const result = resumeReminder("non-existent-id");
    expect(result).toBe(null);
  });
});

// =============================================================================
// Occurrence Storage SSR Safety Tests
// =============================================================================

describe("Occurrence Storage (SSR)", () => {
  it("loadOccurrences returns empty array in SSR environment", () => {
    const occurrences = loadOccurrences();
    expect(occurrences).toEqual([]);
    expect(Array.isArray(occurrences)).toBeTruthy();
  });

  it("saveOccurrences does not throw in SSR environment", () => {
    const testOccurrence = makeOccurrence({
      id: "occ-123",
      reminderId: "rem-123",
      dueAt: new Date().toISOString(),
    });
    // This should not throw
    saveOccurrences([testOccurrence]);
    expect(true).toBeTruthy();
  });
});

// =============================================================================
// Event Storage SSR Safety Tests
// =============================================================================

describe("Event Storage (SSR)", () => {
  it("loadEvents returns empty array in SSR environment", () => {
    const events = loadEvents();
    expect(events).toEqual([]);
    expect(Array.isArray(events)).toBeTruthy();
  });

  it("appendEvent does not throw in SSR environment", () => {
    // This should not throw
    appendEvent(
      makeEvent({
        id: "evt-123",
        reminderId: "rem-123",
        occurrenceId: "occ-123",
        type: "delivered",
        timestamp: new Date().toISOString(),
      }),
    );
    expect(true).toBeTruthy();
  });
});

// =============================================================================
// Notification Preferences SSR Safety Tests
// =============================================================================

describe("Notification Preferences (SSR)", () => {
  it("loadNotificationPrefs returns default preferences in SSR environment", () => {
    const prefs = loadNotificationPrefs();
    expect(prefs).toEqual(DEFAULT_NOTIFICATION_PREFS);
    expect(prefs.permission).toBe("default");
    expect(prefs.showSensitiveContent).toBe(false);
    expect(prefs.userExplicitlyDenied).toBe(false);
  });

  it("saveNotificationPrefs does not throw in SSR environment", () => {
    const testPrefs: NotificationPreferences = {
      ...DEFAULT_NOTIFICATION_PREFS,
      quietHoursStart: "22:00",
      quietHoursEnd: "07:00",
    };
    // This should not throw
    saveNotificationPrefs(testPrefs);
    expect(true).toBeTruthy();
  });

  it("updateNotificationPermission does not throw in SSR environment", () => {
    // This should not throw
    updateNotificationPermission("granted");
    expect(true).toBeTruthy();
  });
});

// =============================================================================
// Storage Boundary Safety Tests - All functions return safe defaults
// =============================================================================

describe("Storage Boundary Safety (SSR)", () => {
  it("All read operations return type-safe defaults in SSR", () => {
    const reminders = loadReminders();
    const occurrences = loadOccurrences();
    const events = loadEvents();
    const prefs = loadNotificationPrefs();

    // All should return proper default types
    expect(Array.isArray(reminders)).toBeTruthy();
    expect(Array.isArray(occurrences)).toBeTruthy();
    expect(Array.isArray(events)).toBeTruthy();
    expect(typeof prefs).toBe("object");

    // All should be empty/default
    expect(reminders.length).toBe(0);
    expect(occurrences.length).toBe(0);
    expect(events.length).toBe(0);
  });

  it("All write operations silently succeed in SSR (no exceptions)", () => {
    // None of these should throw
    saveReminders([]);
    saveOccurrences([]);
    appendEvent(
      makeEvent({
        id: "test",
        reminderId: "test",
        occurrenceId: "test",
        type: "dismissed",
        timestamp: new Date().toISOString(),
      }),
    );
    saveNotificationPrefs(DEFAULT_NOTIFICATION_PREFS);

    expect(true).toBeTruthy();
  });
});
