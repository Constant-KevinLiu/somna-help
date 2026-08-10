/**
 * Habit Delivery Service SSR Safety Tests
 *
 * Tests cover:
 * - BroadcastChannel safety
 * - Multi-tab coordination
 * - Delivery lock mechanism
 * - Delivery decision logic
 */

import { describe, it, expect } from "vitest";

import {
  notifyDelivery,
  subscribeToRemoteDeliveries,
  shouldDeliverOccurrence,
  deliverOccurrence,
  deliverInApp,
  setInAppDeliveryCallback,
} from "./habit-delivery";
import type { Reminder, ReminderOccurrence, DeliveryResult } from "./habit-types";
import { makeReminder, makeOccurrence } from "./habit-test-fixtures";

// =============================================================================
// BroadcastChannel SSR Safety Tests
// =============================================================================

describe("BroadcastChannel SSR Safety", () => {
  it("notifyDelivery does not throw in SSR environment", () => {
    // This should not throw even though BroadcastChannel doesn't exist
    notifyDelivery("test-occurrence-id");
    expect(true).toBeTruthy();
  });

  it("subscribeToRemoteDeliveries returns no-op cleanup in SSR", () => {
    const callback = (occurrenceId: string) => {
      console.log("Delivery:", occurrenceId);
    };

    const cleanup = subscribeToRemoteDeliveries(callback);

    // Should return a function (cleanup)
    expect(typeof cleanup).toBe("function");

    // Calling cleanup should not throw
    cleanup();
    expect(true).toBeTruthy();
  });
});

// =============================================================================
// Delivery Decision Logic Tests
// =============================================================================

describe("shouldDeliverOccurrence", () => {
  it("returns false for inactive reminder", () => {
    const reminder = makeReminder({ id: "rem-123", status: "paused" });
    const occurrence = makeOccurrence({
      id: "occ-123",
      reminderId: "rem-123",
      dueAt: new Date().toISOString(),
    });

    const result = shouldDeliverOccurrence(reminder, occurrence);
    expect(result).toBe(false);
  });

  it("returns false for delivered occurrence", () => {
    const reminder = makeReminder({ id: "rem-123" });
    const occurrence = makeOccurrence({
      id: "occ-123",
      reminderId: "rem-123",
      dueAt: new Date().toISOString(),
      status: "delivered",
    });

    const result = shouldDeliverOccurrence(reminder, occurrence);
    expect(result).toBe(false);
  });

  it("returns false for future occurrence", () => {
    const reminder = makeReminder({ id: "rem-123" });
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);

    const occurrence = makeOccurrence({
      id: "occ-123",
      reminderId: "rem-123",
      dueAt: futureDate.toISOString(),
    });

    const result = shouldDeliverOccurrence(reminder, occurrence);
    expect(result).toBe(false);
  });

  it("returns true for due occurrence", () => {
    const reminder = makeReminder({ id: "rem-123" });
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 1);

    const occurrence = makeOccurrence({
      id: "occ-123",
      reminderId: "rem-123",
      dueAt: pastDate.toISOString(),
    });

    const result = shouldDeliverOccurrence(reminder, occurrence);
    expect(result).toBe(true);
  });

  // Test all resolved statuses
  const resolvedStatuses = [
    "delivered",
    "completed",
    "dismissed",
    "cancelled",
    "completed_by_related_action",
  ] as const;

  for (const status of resolvedStatuses) {
    it(`returns false for ${status} status`, () => {
      const reminder = makeReminder({ id: "rem-123" });
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      const occurrence = makeOccurrence({
        id: "occ-123",
        reminderId: "rem-123",
        dueAt: pastDate.toISOString(),
        status,
      });

      const result = shouldDeliverOccurrence(reminder, occurrence);
      expect(result).toBe(false);
    });
  }
});

// =============================================================================
// In-App Delivery Tests
// =============================================================================

describe("In-App Delivery", () => {
  it("deliverInApp returns error when no callback is registered", () => {
    const reminder = makeReminder({ id: "rem-123" });
    const occurrence = makeOccurrence({
      id: "occ-123",
      reminderId: "rem-123",
      dueAt: new Date().toISOString(),
    });

    const result: DeliveryResult = deliverInApp(reminder, occurrence);

    expect(result.success).toBe(false);
    expect(result.channel).toBe("in_app");
    expect(result.error).toBe("No in-app delivery handler registered");
  });

  it("setInAppDeliveryCallback does not throw in SSR", () => {
    const callback = () => {};
    setInAppDeliveryCallback(
      callback as unknown as (event: {
        reminder: Reminder;
        occurrence: ReminderOccurrence;
      }) => void,
    );
    expect(true).toBeTruthy();
  });
});

// =============================================================================
// Delivery Lock Tests (SSR Mode)
// =============================================================================

describe("Delivery Lock (SSR)", () => {
  it("mechanism does not crash in SSR environment", async () => {
    const reminder = makeReminder({ id: "rem-123" });
    const occurrence = makeOccurrence({
      id: "occ-123",
      reminderId: "rem-123",
      dueAt: new Date().toISOString(),
    });

    // This tests the acquireDeliveryLock function indirectly through deliverOccurrence
    // It should not throw even though localStorage is unavailable
    const result = await deliverOccurrence(reminder, occurrence);

    expect(result).toBeTruthy();
    expect(typeof result.success).toBe("boolean");
    expect(result.channel).toBe("in_app");
  });
});

// =============================================================================
// Full Delivery Flow Tests
// =============================================================================

describe("Full Delivery Flow (SSR)", () => {
  it("deliverOccurrence completes without errors in SSR", async () => {
    const reminder = makeReminder({
      id: "rem-123",
      title: "Test Reminder",
      message: "Test message",
    });
    const occurrence = makeOccurrence({
      id: "occ-123",
      reminderId: "rem-123",
      dueAt: new Date().toISOString(),
    });

    const result = await deliverOccurrence(reminder, occurrence);

    // Should return a valid DeliveryResult
    expect(result).toBeTruthy();
    expect(typeof result.success).toBe("boolean");
    expect(typeof result.channel).toBe("string");

    // At minimum, should have success status and channel
    expect("success" in result).toBeTruthy();
    expect("channel" in result).toBeTruthy();
  });

  it("Multiple delivery calls in rapid sequence do not crash in SSR", async () => {
    const reminder = makeReminder({ id: "rem-123" });
    const occurrences: ReminderOccurrence[] = [1, 2, 3, 4, 5].map((i) =>
      makeOccurrence({
        id: `occ-${i}`,
        reminderId: "rem-123",
        dueAt: new Date().toISOString(),
      }),
    );

    // Call delivery for all occurrences in parallel
    const results = await Promise.all(occurrences.map((occ) => deliverOccurrence(reminder, occ)));

    // All should complete without throwing
    expect(results.length).toBe(5);
    results.forEach((result) => {
      expect(result).toBeTruthy();
      expect(typeof result.success).toBe("boolean");
    });
  });
});
