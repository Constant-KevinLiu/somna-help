/**
 * @vitest-environment jsdom
 *
 * GA4 Analytics Module Tests
 *
 * Tests the ga4.ts module in a jsdom environment to verify:
 *  - Absent/invalid measurement ID disables analytics safely
 *  - Initialization is browser-only and idempotent
 *  - Script is injected exactly once
 *  - Page views include page_location, page_path, page_title
 *  - Repeated identical calls don't fire duplicates (module-level guard)
 *  - Blocked script doesn't crash the app
 *
 * These tests mock the script network layer — they do NOT verify real GA
 * network delivery.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  resetAnalytics,
  isAnalyticsEnabled,
} from "./ga4";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function setupEnv(overrides: Record<string, string> = {}): void {
  // @ts-expect-error - vitest provides import.meta.env manipulation via vi.stubEnv
  vi.stubEnv("VITE_GA_MEASUREMENT_ID", overrides.VITE_GA_MEASUREMENT_ID ?? "");
  // @ts-expect-error - same
  vi.stubEnv("VITE_GA_ENABLE_IN_DEV", overrides.VITE_GA_ENABLE_IN_DEV ?? "true");
}

function countGtagScripts(): number {
  return document.querySelectorAll("script[data-ga-id]").length;
}

function getGtagCalls(): unknown[][] {
  if (!window.dataLayer) return [];
  return window.dataLayer as unknown[][];
}

// ─── Test suite ──────────────────────────────────────────────────────────────

describe("ga4", () => {
  beforeEach(() => {
    resetAnalytics();
    window.dataLayer = [];
    window.gtag = undefined;
    // Remove any leftover script tags
    document.querySelectorAll("script[data-ga-id]").forEach((s) => s.remove());
    // Reset location
    Object.defineProperty(window, "location", {
      value: {
        href: "https://somna.help/",
        origin: "https://somna.help",
        pathname: "/",
        search: "",
        hash: "",
      },
      writable: true,
      configurable: true,
    });
    document.title = "somna — Sleep Better, Starting Tonight";
  });

  afterEach(() => {
    resetAnalytics();
    vi.unstubAllEnvs();
  });

  // ── Disabled states ────────────────────────────────────────────────────

  describe("when measurement ID is absent", () => {
    beforeEach(() => {
      setupEnv({ VITE_GA_MEASUREMENT_ID: "" });
    });

    it("initializeAnalytics does not throw", () => {
      expect(() => initializeAnalytics()).not.toThrow();
    });

    it("isAnalyticsEnabled returns false", () => {
      initializeAnalytics();
      expect(isAnalyticsEnabled()).toBe(false);
    });

    it("no script is injected", () => {
      initializeAnalytics();
      expect(countGtagScripts()).toBe(0);
    });

    it("trackPageView is a safe no-op", () => {
      initializeAnalytics();
      expect(() => trackPageView({ path: "/" })).not.toThrow();
      expect(getGtagCalls()).toHaveLength(0);
    });

    it("trackEvent is a safe no-op", () => {
      initializeAnalytics();
      expect(() => trackEvent("test_event")).not.toThrow();
      expect(getGtagCalls()).toHaveLength(0);
    });
  });

  describe("when measurement ID has invalid format", () => {
    beforeEach(() => {
      setupEnv({ VITE_GA_MEASUREMENT_ID: "UA-12345-6" });
    });

    it("initialization is disabled without throwing", () => {
      expect(() => initializeAnalytics()).not.toThrow();
      expect(isAnalyticsEnabled()).toBe(false);
    });

    it("rejects lowercase g- prefix", () => {
      // Re-setup since reset doesn't reset env
      vi.stubEnv("VITE_GA_MEASUREMENT_ID", "g-abc123");
      expect(() => initializeAnalytics()).not.toThrow();
      expect(isAnalyticsEnabled()).toBe(false);
    });

    it("rejects empty G- prefix", () => {
      vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-");
      expect(() => initializeAnalytics()).not.toThrow();
      expect(isAnalyticsEnabled()).toBe(false);
    });
  });

  // ── Valid ID ───────────────────────────────────────────────────────────

  describe("with valid measurement ID", () => {
    const VALID_ID = "G-TEST12345";

    beforeEach(() => {
      setupEnv({
        VITE_GA_MEASUREMENT_ID: VALID_ID,
        VITE_GA_ENABLE_IN_DEV: "true",
      });
    });

    it("initialization creates dataLayer and gtag function", () => {
      initializeAnalytics();
      expect(Array.isArray(window.dataLayer)).toBe(true);
      expect(typeof window.gtag).toBe("function");
      expect(isAnalyticsEnabled()).toBe(true);
    });

    it("injects exactly one gtag script", () => {
      initializeAnalytics();
      expect(countGtagScripts()).toBe(1);
      const script = document.querySelector("script[data-ga-id]")!;
      expect(script.getAttribute("src")).toContain("googletagmanager.com/gtag/js");
      expect(script.getAttribute("src")).toContain("id=G-TEST12345");
      expect(script.async).toBe(true);
    });

    it("initialization is idempotent — second call does nothing", () => {
      initializeAnalytics();
      initializeAnalytics();
      expect(countGtagScripts()).toBe(1);
      // js + config calls should be present but not duplicated
      const calls = getGtagCalls();
      const jsCalls = calls.filter((c) => c[0] === "js");
      const configCalls = calls.filter((c) => c[0] === "config");
      expect(jsCalls.length).toBe(1);
      expect(configCalls.length).toBe(1);
    });

    it("config is set with send_page_view: false", () => {
      initializeAnalytics();
      const configCall = getGtagCalls().find((c) => c[0] === "config");
      expect(configCall).toBeDefined();
      const [, , options] = configCall!;
      expect(options).toEqual(expect.objectContaining({ send_page_view: false }));
    });

    // ── Page view tracking ──────────────────────────────────────────────

    it("trackPageView sends page_view event with location, path, and title", () => {
      initializeAnalytics();
      trackPageView({ path: "/program", title: "Program | somna" });

      const pageViewCall = getGtagCalls().find((c) => c[0] === "event" && c[1] === "page_view");
      expect(pageViewCall).toBeDefined();
      const params = pageViewCall![2] as Record<string, string>;
      expect(params.page_location).toBe("https://somna.help/program");
      expect(params.page_path).toBe("/program");
      expect(params.page_title).toBe("Program | somna");
    });

    it("trackPageView uses document.title when title is not provided", () => {
      initializeAnalytics();
      trackPageView({ path: "/dashboard" });

      const pageViewCall = getGtagCalls().find((c) => c[0] === "event" && c[1] === "page_view");
      const params = pageViewCall![2] as Record<string, string>;
      expect(params.page_title).toBe("somna — Sleep Better, Starting Tonight");
    });

    it("trackPageView sanitizes sensitive query parameters", () => {
      initializeAnalytics();
      trackPageView({ path: "/dashboard?token=abc123&email=user@test.com&tab=sleep" });

      const pageViewCall = getGtagCalls().find((c) => c[0] === "event" && c[1] === "page_view");
      const params = pageViewCall![2] as Record<string, string>;
      // tab=sleep is kept (non-sensitive)
      expect(params.page_path).toContain("tab=sleep");
      // token and email are stripped
      expect(params.page_path).not.toContain("token");
      expect(params.page_path).not.toContain("email");
      expect(params.page_path).not.toContain("abc123");
      expect(params.page_path).not.toContain("user@test.com");
    });

    it("trackPageView preserves hash fragments", () => {
      initializeAnalytics();
      trackPageView({ path: "/learn#stimulus-control" });

      const pageViewCall = getGtagCalls().find((c) => c[0] === "event" && c[1] === "page_view");
      const params = pageViewCall![2] as Record<string, string>;
      expect(params.page_path).toContain("#stimulus-control");
    });

    // ── Custom events ───────────────────────────────────────────────────

    it("trackEvent sends custom event with parameters", () => {
      initializeAnalytics();
      trackEvent("share_open", { context: "dashboard", count: 5 });

      const eventCall = getGtagCalls().find((c) => c[0] === "event" && c[1] === "share_open");
      expect(eventCall).toBeDefined();
      const params = eventCall![2] as Record<string, string | number>;
      expect(params.context).toBe("dashboard");
      expect(params.count).toBe(5);
    });

    it("trackEvent works without parameters", () => {
      initializeAnalytics();
      trackEvent("simple_event");

      const eventCall = getGtagCalls().find((c) => c[0] === "event" && c[1] === "simple_event");
      expect(eventCall).toBeDefined();
    });

    // ── Blocked script resilience ──────────────────────────────────────

    it("does not crash when script injection fails", () => {
      // Simulate appendChild throwing (e.g. CSP violation at DOM insertion)
      const appendSpy = vi.spyOn(document.head, "appendChild").mockImplementation(function (
        this: HTMLHeadElement,
        node: Node,
      ) {
        if (node instanceof HTMLScriptElement && node.src.includes("googletagmanager")) {
          throw new Error("Refused to load the script (CSP)");
        }
        return Node.prototype.appendChild.call(this, node) as Node;
      });

      try {
        // Should not throw — analytics silently degrades
        expect(() => initializeAnalytics()).not.toThrow();

        // Even without the script loaded, the stub gtag function still works
        // (events are queued in dataLayer, they just won't be sent to GA)
        trackPageView({ path: "/test" });
        const pageViews = getGtagCalls().filter((c) => c[0] === "event" && c[1] === "page_view");
        expect(pageViews.length).toBe(1);
      } finally {
        appendSpy.mockRestore();
      }
    });

    // ── Reset ──────────────────────────────────────────────────────────

    it("resetAnalytics clears state and removes script", () => {
      initializeAnalytics();
      expect(isAnalyticsEnabled()).toBe(true);
      expect(countGtagScripts()).toBe(1);

      resetAnalytics();
      expect(isAnalyticsEnabled()).toBe(false);
      expect(countGtagScripts()).toBe(0);
    });

    it("after reset, initializeAnalytics works again", () => {
      initializeAnalytics();
      resetAnalytics();
      initializeAnalytics();
      expect(isAnalyticsEnabled()).toBe(true);
      expect(countGtagScripts()).toBe(1);
    });
  });

  // ── Production-only behavior ───────────────────────────────────────────

  describe("production-only loading", () => {
    const VALID_ID = "G-PROD12345";

    it("disables in dev mode when VITE_GA_ENABLE_IN_DEV is not set", () => {
      setupEnv({
        VITE_GA_MEASUREMENT_ID: VALID_ID,
        VITE_GA_ENABLE_IN_DEV: "",
      });
      initializeAnalytics();
      expect(isAnalyticsEnabled()).toBe(false);
    });
  });
});
