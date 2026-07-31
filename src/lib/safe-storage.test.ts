/**
 * SSR Safety and Storage Boundary Tests
 *
 * Tests cover:
 * - SSR-safe storage helpers
 * - Malformed storage handling
 * - Missing key handling
 * - Browser API guards
 */

import { describe, it, expect } from "vitest";

import {
  isBrowser,
  isDocumentAvailable,
  isNavigatorAvailable,
  isBroadcastChannelSupported,
  isNotificationSupported,
  safeJsonParse,
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove,
  getSharedBroadcastChannel,
  closeSharedBroadcastChannel,
} from "./safe-storage";

// =============================================================================
// Environment Detection Tests (SSR Safety)
// =============================================================================

describe("Environment Detection (SSR)", () => {
  it("isBrowser returns false in Node.js SSR environment", () => {
    expect(isBrowser()).toBe(false);
  });

  it("isDocumentAvailable returns false in Node.js SSR environment", () => {
    expect(isDocumentAvailable()).toBe(false);
  });

  it("isNavigatorAvailable returns false in Node.js SSR environment", () => {
    expect(isNavigatorAvailable()).toBe(false);
  });

  it("isBroadcastChannelSupported returns false in Node.js SSR environment", () => {
    expect(isBroadcastChannelSupported()).toBe(false);
  });

  it("isNotificationSupported returns false in Node.js SSR environment", () => {
    expect(isNotificationSupported()).toBe(false);
  });
});

// =============================================================================
// Safe JSON Parsing Tests
// =============================================================================

describe("safeJsonParse", () => {
  it("returns default value for null input", () => {
    const defaultValue = { foo: "bar" };
    const result = safeJsonParse(null, defaultValue);
    expect(result).toEqual(defaultValue);
  });

  it("returns default value for malformed JSON", () => {
    const defaultValue = { foo: "bar" };
    const result = safeJsonParse("not valid json{{{", defaultValue);
    expect(result).toEqual(defaultValue);
  });

  it("returns parsed value for valid JSON", () => {
    const defaultValue = { foo: "bar" };
    const input = JSON.stringify({ hello: "world" });
    const result = safeJsonParse(input, defaultValue);
    expect(result).toEqual({ hello: "world" });
  });

  it("handles empty string", () => {
    const defaultValue = { foo: "bar" };
    const result = safeJsonParse("", defaultValue);
    expect(result).toEqual(defaultValue);
  });

  it("handles array JSON", () => {
    const defaultValue: string[] = [];
    const input = JSON.stringify(["a", "b", "c"]);
    const result = safeJsonParse(input, defaultValue);
    expect(result).toEqual(["a", "b", "c"]);
  });
});

// =============================================================================
// Safe LocalStorage Tests (SSR Mode)
// =============================================================================

describe("safeLocalStorage (SSR)", () => {
  it("safeLocalStorageGet returns default value in SSR environment", () => {
    const defaultValue = ["test", "data"];
    const result = safeLocalStorageGet("test-key", defaultValue);
    expect(result).toEqual(defaultValue);
  });

  it("safeLocalStorageGet handles object defaults correctly", () => {
    const defaultValue = { setting: true, count: 0 };
    const result = safeLocalStorageGet("test-key", defaultValue);
    expect(result).toEqual(defaultValue);
  });

  it("safeLocalStorageGet handles number defaults correctly", () => {
    const defaultValue = 42;
    const result = safeLocalStorageGet("test-key", defaultValue);
    expect(result).toBe(42);
  });

  it("safeLocalStorageGet handles null defaults correctly", () => {
    const defaultValue = null;
    const result = safeLocalStorageGet("test-key", defaultValue);
    expect(result).toBe(null);
  });

  it("safeLocalStorageSet does not throw in SSR environment", () => {
    // This should not throw
    safeLocalStorageSet("test-key", { some: "data" });
    // If we got here without throwing, the test passes
    expect(true).toBeTruthy();
  });

  it("safeLocalStorageSet with dispatchEvent does not throw in SSR environment", () => {
    // This should not throw even though dispatchEvent is requested
    safeLocalStorageSet("test-key", { some: "data" }, { dispatchEvent: "test-event" });
    expect(true).toBeTruthy();
  });

  it("safeLocalStorageRemove does not throw in SSR environment", () => {
    // This should not throw
    safeLocalStorageRemove("test-key");
    expect(true).toBeTruthy();
  });
});

// =============================================================================
// Broadcast Channel Tests (SSR Mode)
// =============================================================================

describe("Broadcast Channel (SSR)", () => {
  it("getSharedBroadcastChannel returns null in SSR environment", () => {
    const result = getSharedBroadcastChannel("test-channel");
    expect(result).toBe(null);
  });

  it("closeSharedBroadcastChannel does not throw in SSR environment", () => {
    // This should not throw
    closeSharedBroadcastChannel("test-channel");
    expect(true).toBeTruthy();
  });
});

// =============================================================================
// Storage Boundary Safety Tests
// =============================================================================

describe("Storage Boundary Safety", () => {
  it("All storage helpers are type-safe and preserve return types", () => {
    // These are compile-time tests that verify type inference works correctly
    // The fact that this file compiles means the types are working

    // String default
    const strResult = safeLocalStorageGet("key", "default");
    expect(strResult).toBe("default");

    // Number default
    const numResult = safeLocalStorageGet("key", 0);
    expect(numResult).toBe(0);

    // Boolean default
    const boolResult = safeLocalStorageGet("key", false);
    expect(boolResult).toBe(false);

    // Array default
    const arrResult = safeLocalStorageGet("key", [] as string[]);
    expect(Array.isArray(arrResult)).toBeTruthy();

    // Object default
    const objResult = safeLocalStorageGet("key", { foo: "bar" });
    expect(objResult.foo).toBe("bar");
    expect(objResult).toBeTruthy();
  });
});
