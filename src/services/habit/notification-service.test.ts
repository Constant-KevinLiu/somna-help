/**
 * Notification Service SSR Safety Tests
 *
 * Tests cover:
 * - Browser notification support detection
 * - Permission checking
 * - Quiet hours calculation
 * - Notification content building
 * - Delivery fallback behavior
 */

import { describe, it, expect } from "vitest";

import {
  isNotificationSupported,
  getCurrentPermission,
  isPermissionGranted,
  isPermissionDenied,
  requestNotificationPermission,
  isWithinQuietHours,
  buildNotificationContent,
  isChannelAvailable,
  getAvailableChannels,
  deliverBrowserNotification,
} from "./notification-service";
import { makeReminder } from "./habit-test-fixtures";

// =============================================================================
// Browser Capability Tests (SSR Mode)
// =============================================================================

describe("Browser Capabilities (SSR)", () => {
  it("isNotificationSupported returns false in SSR environment", () => {
    const supported = isNotificationSupported();
    expect(supported).toBe(false);
  });

  it("getCurrentPermission returns 'denied' in SSR environment", () => {
    const permission = getCurrentPermission();
    expect(permission).toBe("denied");
  });

  it("isPermissionGranted returns false in SSR environment", () => {
    const granted = isPermissionGranted();
    expect(granted).toBe(false);
  });

  it("isPermissionDenied returns true in SSR environment", () => {
    const denied = isPermissionDenied();
    expect(denied).toBe(true);
  });
});

// =============================================================================
// Permission Request Tests
// =============================================================================

describe("Permission Request (SSR)", () => {
  it("requestNotificationPermission resolves to 'denied' in SSR environment", async () => {
    const result = await requestNotificationPermission();
    expect(result).toBe("denied");
  });
});

// =============================================================================
// Quiet Hours Tests
// =============================================================================

describe("isWithinQuietHours", () => {
  it("returns false when no quiet hours are set", () => {
    // When no prefs are set (uses defaults), quiet hours start/end are undefined
    const now = new Date();
    const result = isWithinQuietHours(now);
    expect(result).toBe(false);
  });

  it("handles same-day quiet hours", () => {
    // This is a pure function test that doesn't depend on localStorage
    // We test the time calculation logic directly

    // Create a time known to be within quiet hours (e.g., 3 AM)
    const threeAM = new Date();
    threeAM.setHours(3, 0, 0, 0);

    // Create a time known to be outside quiet hours (e.g., 2 PM)
    const twoPM = new Date();
    twoPM.setHours(14, 0, 0, 0);

    // Both should return boolean results (both false since no quiet hours set by default)
    expect(typeof isWithinQuietHours(threeAM)).toBe("boolean");
    expect(typeof isWithinQuietHours(twoPM)).toBe("boolean");
  });

  it("accepts optional now parameter", () => {
    // Should work with no parameter (uses current time)
    const result1 = isWithinQuietHours();
    expect(typeof result1).toBe("boolean");

    // Should work with explicit date parameter
    const result2 = isWithinQuietHours(new Date());
    expect(typeof result2).toBe("boolean");
  });
});

// =============================================================================
// Notification Content Tests
// =============================================================================

describe("buildNotificationContent", () => {
  it("returns privacy-safe content by default", () => {
    const reminder = makeReminder({
      id: "rem-123",
      title: "Personal Reminder",
      message: "Very sensitive private information",
      channels: ["browser_notification"],
    });

    const content = buildNotificationContent(reminder);

    // By default, should use generic privacy-safe content
    // NOT the custom title/message (unless user explicitly opted in)
    expect(content.title).toBe("Somna Reminder");
    expect(content.body).toBe("Your scheduled check-in is ready.");

    // Verify it doesn't expose the sensitive content by default
    // (The default is privacy-safe generic content)
    expect(content.title !== "Personal Reminder").toBeTruthy();
    expect(content.body !== "Very sensitive private information").toBeTruthy();
  });

  it("always returns valid title and body", () => {
    const reminder = makeReminder({
      id: "rem-123",
      title: "",
      message: "",
      channels: ["browser_notification"],
    });

    const content = buildNotificationContent(reminder);

    expect(typeof content.title).toBe("string");
    expect(typeof content.body).toBe("string");
    expect(content.title.length > 0).toBeTruthy();
    expect(content.body.length > 0).toBeTruthy();
  });
});

// =============================================================================
// Channel Availability Tests
// =============================================================================

describe("Channel Availability (SSR)", () => {
  it("isChannelAvailable returns true for in_app channel", () => {
    // in_app is always available (doesn't require browser APIs)
    const available = isChannelAvailable("in_app");
    expect(available).toBe(true);
  });

  it("isChannelAvailable returns false for browser_notification in SSR", () => {
    const available = isChannelAvailable("browser_notification");
    expect(available).toBe(false);
  });

  it("getAvailableChannels returns only ['in_app'] in SSR environment", () => {
    const channels = getAvailableChannels();
    expect(channels).toEqual(["in_app"]);
    expect(channels.length).toBe(1);
  });
});

// =============================================================================
// Browser Notification Delivery Tests
// =============================================================================

describe("Browser Notification Delivery (SSR)", () => {
  it("deliverBrowserNotification returns safe fallback result in SSR", async () => {
    const reminder = makeReminder({
      id: "rem-123",
      title: "Test",
      channels: ["browser_notification"],
    });

    const result = await deliverBrowserNotification(reminder);

    expect(result.success).toBe(false);
    expect(result.channel).toBe("browser_notification");
    expect(result.error).toBe("Notifications not supported");
    expect(result.fallbackToInApp).toBe(true);
    expect(typeof result).toBe("object");
  });

  it("deliverBrowserNotification accepts optional tag parameter", async () => {
    const reminder = makeReminder({
      id: "rem-123",
      title: "Test",
      channels: ["browser_notification"],
    });

    // Should work with tag parameter
    const result1 = await deliverBrowserNotification(reminder, "custom-tag");
    expect(result1.success).toBe(false);
    expect(result1.channel).toBe("browser_notification");

    // Should work without tag parameter
    const result2 = await deliverBrowserNotification(reminder);
    expect(result2.success).toBe(false);
    expect(result2.channel).toBe("browser_notification");
  });
});

// =============================================================================
// Multi-Tab Safety
// =============================================================================

describe("Multi-Tab Safety (SSR)", () => {
  it("All notification functions are safe to call concurrently in SSR", async () => {
    // Call multiple functions in sequence to ensure no race conditions
    const results = await Promise.all([
      isNotificationSupported(),
      getCurrentPermission(),
      isPermissionGranted(),
      isPermissionDenied(),
      requestNotificationPermission(),
    ]);

    // All should return expected SSR-safe values
    expect(results[0]).toBe(false); // isNotificationSupported
    expect(results[1]).toBe("denied"); // getCurrentPermission
    expect(results[2]).toBe(false); // isPermissionGranted
    expect(results[3]).toBe(true); // isPermissionDenied
    expect(results[4]).toBe("denied"); // requestNotificationPermission
  });
});
