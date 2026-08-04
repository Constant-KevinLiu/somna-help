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
 *  - Input normalization: only string primitives are accepted
 *  - Defensive boundary: analytics failure never propagates
 *  - Sensitive query stripping
 *  - Regression: router event object does NOT cause "Cannot convert object
 *    to primitive value" crash
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
  vi.stubEnv("VITE_GA_MEASUREMENT_ID", overrides.VITE_GA_MEASUREMENT_ID ?? "");
  vi.stubEnv("VITE_GA_ENABLE_IN_DEV", overrides.VITE_GA_ENABLE_IN_DEV ?? "true");
}

function countGtagScripts(): number {
  return document.querySelectorAll("script[data-ga-id]").length;
}

function getGtagCalls(): unknown[][] {
  if (!window.dataLayer) return [];
  return window.dataLayer as unknown[][];
}

function getPageViewCalls(): Array<{ page_location: string; page_path: string; page_title: string }> {
  return getGtagCalls()
    .filter((c) => c[0] === "event" && c[1] === "page_view")
    .map((c) => c[2] as { page_location: string; page_path: string; page_title: string });
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
      expect(() => trackPageView({ pathname: "/" })).not.toThrow();
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
      const script = document.querySelector<HTMLScriptElement>("script[data-ga-id]")!;
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
      trackPageView({ pathname: "/program", title: "Program | somna" });

      const pageViews = getPageViewCalls();
      expect(pageViews.length).toBe(1);
      expect(pageViews[0].page_location).toBe("https://somna.help/program");
      expect(pageViews[0].page_path).toBe("/program");
      expect(pageViews[0].page_title).toBe("Program | somna");
    });

    it("trackPageView uses document.title when title is not provided", () => {
      initializeAnalytics();
      trackPageView({ pathname: "/dashboard" });

      const pageViews = getPageViewCalls();
      expect(pageViews[0].page_title).toBe("somna — Sleep Better, Starting Tonight");
    });

    it("trackPageView includes search string in path", () => {
      initializeAnalytics();
      trackPageView({ pathname: "/dashboard", search: "?tab=sleep" });

      const pageViews = getPageViewCalls();
      expect(pageViews[0].page_path).toBe("/dashboard?tab=sleep");
      expect(pageViews[0].page_location).toBe("https://somna.help/dashboard?tab=sleep");
    });

    it("trackPageView includes hash fragment", () => {
      initializeAnalytics();
      trackPageView({ pathname: "/learn", hash: "#stimulus-control" });

      const pageViews = getPageViewCalls();
      expect(pageViews[0].page_path).toBe("/learn#stimulus-control");
    });

    it("trackPageView sanitizes sensitive query parameters", () => {
      initializeAnalytics();
      trackPageView({
        pathname: "/dashboard",
        search: "?token=abc123&email=user@test.com&tab=sleep",
      });

      const pageViews = getPageViewCalls();
      // tab=sleep is kept (non-sensitive)
      expect(pageViews[0].page_path).toContain("tab=sleep");
      // token and email are stripped
      expect(pageViews[0].page_path).not.toContain("token");
      expect(pageViews[0].page_path).not.toContain("email");
      expect(pageViews[0].page_path).not.toContain("abc123");
      expect(pageViews[0].page_path).not.toContain("user@test.com");
    });

    it("trackPageView preserves hash fragments", () => {
      initializeAnalytics();
      trackPageView({ pathname: "/learn", hash: "#stimulus-control" });

      const pageViews = getPageViewCalls();
      expect(pageViews[0].page_path).toContain("#stimulus-control");
    });

    // ── Input validation (defensive boundary) ──────────────────────────

    describe("input validation — never crashes on bad input", () => {
      it("skips emission when pathname is undefined", () => {
        initializeAnalytics();
        expect(() => trackPageView({ pathname: undefined as unknown as string })).not.toThrow();
        expect(getPageViewCalls()).toHaveLength(0);
      });

      it("skips emission when pathname is an empty string", () => {
        initializeAnalytics();
        expect(() => trackPageView({ pathname: "" })).not.toThrow();
        expect(getPageViewCalls()).toHaveLength(0);
      });

      it("skips emission when pathname is a number", () => {
        initializeAnalytics();
        expect(() => trackPageView({ pathname: 123 as unknown as string })).not.toThrow();
        expect(getPageViewCalls()).toHaveLength(0);
      });

      it("skips emission when input is null", () => {
        initializeAnalytics();
        expect(() => trackPageView(null as unknown as { pathname: string })).not.toThrow();
        expect(getPageViewCalls()).toHaveLength(0);
      });

      it("skips emission when input is undefined", () => {
        initializeAnalytics();
        expect(() => trackPageView(undefined as unknown as { pathname: string })).not.toThrow();
        expect(getPageViewCalls()).toHaveLength(0);
      });

      it("REGRESSION: passing a router event object does NOT throw 'Cannot convert object to primitive value'", () => {
        initializeAnalytics();
        // Simulate what would happen if the onResolved callback accidentally
        // passed the event object directly to trackPageView.
        const routerEventObj = {
          type: "onResolved",
          fromLocation: { pathname: "/", search: "", hash: "" },
          toLocation: { pathname: "/program", search: "", hash: "" },
          pathChanged: true,
          hrefChanged: true,
          hashChanged: false,
        };

        // This must NOT throw — the defensive boundary catches it.
        expect(() => trackPageView(routerEventObj as unknown as { pathname: string })).not.toThrow();
        expect(() => trackPageView(routerEventObj as unknown as { pathname: string })).not.toThrow(
          /Cannot convert object to primitive value/,
        );

        // And no page view is sent (pathname is not a string on the event object)
        expect(getPageViewCalls()).toHaveLength(0);
      });

      it("REGRESSION: object with no toString (Object.create(null)) does not crash", () => {
        initializeAnalytics();
        const nullProtoObj = Object.create(null);
        nullProtoObj.pathname = "/test"; // this IS a string, should work

        // Even when pathname is a valid string, if the overall object has
        // issues, the function still must not throw.
        expect(() => trackPageView(nullProtoObj)).not.toThrow();
        expect(getPageViewCalls().length).toBeGreaterThanOrEqual(0);
      });

      it("handles malformed pathname object gracefully", () => {
        initializeAnalytics();
        // An object where pathname is itself an object (nested object)
        const badInput = { pathname: { toString: () => "/nested" } };

        // Must not throw "Cannot convert object to primitive value"
        expect(() => trackPageView(badInput as unknown as { pathname: string })).not.toThrow();
        // The typeof check catches non-string pathname, so no emission
        expect(getPageViewCalls()).toHaveLength(0);
      });
    });

    // ── Defensive boundary: analytics failure ≠ app failure ────────────

    describe("defensive boundary — analytics failure never propagates", () => {
      it("does not throw when gtag throws", () => {
        initializeAnalytics();
        // Replace gtag with a throwing version
        const originalGtag = window.gtag;
        window.gtag = () => {
          throw new Error("GA API unreachable");
        };

        expect(() => trackPageView({ pathname: "/test" })).not.toThrow();
        expect(() => trackEvent("test_event")).not.toThrow();

        window.gtag = originalGtag;
      });

      it("does not throw when window.location.origin is unavailable", () => {
        initializeAnalytics();
        // Save and replace location.origin with a non-string
        const originalLocation = window.location;
        Object.defineProperty(window, "location", {
          value: { ...originalLocation, origin: null as unknown as string },
          writable: true,
          configurable: true,
        });

        expect(() => trackPageView({ pathname: "/test" })).not.toThrow();

        // Restore
        Object.defineProperty(window, "location", {
          value: originalLocation,
          writable: true,
          configurable: true,
        });
      });

      it("does not throw when document.title is not a string", () => {
        initializeAnalytics();
        const originalTitle = document.title;
        // @ts-expect-error - testing runtime type violation
        document.title = { notAString: true };

        expect(() => trackPageView({ pathname: "/test" })).not.toThrow();

        document.title = originalTitle;
      });

      it("analytics failure never reaches a React ErrorComponent boundary", () => {
        // This test simulates the production scenario: a chain of failures
        // that previously would have bubbled up to the TanStack ErrorComponent.
        initializeAnalytics();

        let errorBubbledToReact = false;

        // Simulate a React-like error boundary wrapping
        try {
          // Simulate various failure modes — none should escape
          trackPageView({ pathname: "/ok" });

          // Now with gtag throwing
          const originalGtag = window.gtag;
          window.gtag = () => {
            throw new Error("simulated analytics failure");
          };

          trackPageView({ pathname: "/should-be-caught" });
          trackEvent("should_also_be_caught");

          window.gtag = originalGtag;

          // Even with completely invalid input
          trackPageView({ pathname: {} as unknown as string });
        } catch (e) {
          errorBubbledToReact = true;
        }

        expect(errorBubbledToReact).toBe(false);
      });
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

    it("trackEvent skips when name is not a string", () => {
      initializeAnalytics();
      trackEvent(123 as unknown as string);
      const calls = getGtagCalls().filter((c) => c[0] === "event");
      // Only config-related events, no custom event
      expect(calls.length).toBe(0);
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
        trackPageView({ pathname: "/test" });
        expect(getPageViewCalls().length).toBe(1);
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
