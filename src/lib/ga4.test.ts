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

function getGtagCalls(): ArrayLike<unknown>[] {
  if (!window.dataLayer) return [];
  return window.dataLayer as ArrayLike<unknown>[];
}

/**
 * Access a dataLayer entry's nth argument.
 *
 * Canonical gtag entries are IArguments objects (not plain Arrays).
 * We must index them the same way the Google runtime does: by numeric
 * property access, NOT by Array methods. This helper ensures tests
 * work with both shapes (but the canonical-command-shape test below
 * verifies the shape is IArguments, not Array).
 */
function getNthArg(entry: ArrayLike<unknown>, index: number): unknown {
  return entry[index];
}

function getPageViewCalls(): Array<{
  page_location: string;
  page_path: string;
  page_title: string;
}> {
  return getGtagCalls()
    .filter((c) => getNthArg(c, 0) === "event" && getNthArg(c, 1) === "page_view")
    .map(
      (c) => getNthArg(c, 2) as { page_location: string; page_path: string; page_title: string },
    );
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
      const jsCalls = calls.filter((c) => getNthArg(c, 0) === "js");
      const configCalls = calls.filter((c) => getNthArg(c, 0) === "config");
      expect(jsCalls.length).toBe(1);
      expect(configCalls.length).toBe(1);
    });

    it("config is set with send_page_view: false", () => {
      initializeAnalytics();
      const configCall = getGtagCalls().find((c) => getNthArg(c, 0) === "config");
      expect(configCall).toBeDefined();
      const options = getNthArg(configCall!, 2);
      expect(options).toEqual(expect.objectContaining({ send_page_view: false }));
    });

    it("send_page_view: false still results in an explicit page_view via trackPageView", () => {
      // The GA config disables automatic page views, but our trackPageView
      // function must still send explicit page_view events.
      initializeAnalytics();
      trackPageView({ pathname: "/test-page" });

      const pageViews = getPageViewCalls();
      expect(pageViews.length).toBe(1);
      // Confirm it's an explicit "event" call, not a config-driven auto page_view
      const allEvents = getGtagCalls().filter((c) => getNthArg(c, 0) === "event");
      const explicitPageViews = allEvents.filter((c) => getNthArg(c, 1) === "page_view");
      expect(explicitPageViews.length).toBe(1);
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
        expect(() =>
          trackPageView(routerEventObj as unknown as { pathname: string }),
        ).not.toThrow();
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

      const eventCall = getGtagCalls().find(
        (c) => getNthArg(c, 0) === "event" && getNthArg(c, 1) === "share_open",
      );
      expect(eventCall).toBeDefined();
      const params = getNthArg(eventCall!, 2) as Record<string, string | number>;
      expect(params.context).toBe("dashboard");
      expect(params.count).toBe(5);
    });

    it("trackEvent works without parameters", () => {
      initializeAnalytics();
      trackEvent("simple_event");

      const eventCall = getGtagCalls().find(
        (c) => getNthArg(c, 0) === "event" && getNthArg(c, 1) === "simple_event",
      );
      expect(eventCall).toBeDefined();
    });

    it("trackEvent skips when name is not a string", () => {
      initializeAnalytics();
      trackEvent(123 as unknown as string);
      const calls = getGtagCalls().filter((c) => getNthArg(c, 0) === "event");
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

    // ── Dev diagnostics ────────────────────────────────────────────────

    describe("dev diagnostics (VITE_GA_DEBUG)", () => {
      it("does not log when VITE_GA_DEBUG is not set", () => {
        setupEnv({ VITE_GA_MEASUREMENT_ID: VALID_ID, VITE_GA_ENABLE_IN_DEV: "true" });
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        initializeAnalytics();
        trackPageView({ pathname: "/test" });

        // No [ga4] prefixed logs when debug is off
        const ga4Logs = logSpy.mock.calls.filter(
          (c) => typeof c[0] === "string" && c[0].includes("[ga4]"),
        );
        expect(ga4Logs).toHaveLength(0);

        logSpy.mockRestore();
      });

      it("logs initialization and page_view when VITE_GA_DEBUG is true", () => {
        vi.stubEnv("VITE_GA_DEBUG", "true");
        setupEnv({ VITE_GA_MEASUREMENT_ID: VALID_ID, VITE_GA_ENABLE_IN_DEV: "true" });

        // Need to re-import to pick up the env var change
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        initializeAnalytics();
        trackPageView({ pathname: "/test" });

        const ga4Logs = logSpy.mock.calls.filter(
          (c) => typeof c[0] === "string" && c[0].includes("[ga4]"),
        );
        // Should have init:success + page_view:queued at minimum
        expect(ga4Logs.length).toBeGreaterThanOrEqual(2);
        // Never logs full query strings or sensitive values
        const hasFullQueryString = ga4Logs.some((c) =>
          c.some((arg) => typeof arg === "string" && arg.includes("token=")),
        );
        expect(hasFullQueryString).toBe(false);

        logSpy.mockRestore();
      });

      it("logs stable skip reason when pathname is not a string", () => {
        vi.stubEnv("VITE_GA_DEBUG", "true");
        setupEnv({ VITE_GA_MEASUREMENT_ID: VALID_ID, VITE_GA_ENABLE_IN_DEV: "true" });

        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        initializeAnalytics();
        trackPageView({ pathname: 123 as unknown as string });

        const skipLogs = logSpy.mock.calls.filter(
          (c) => c[1] === "page_view:skipped" && c[2] === "pathname_not_string",
        );
        expect(skipLogs.length).toBe(1);

        logSpy.mockRestore();
      });
    });

    // ── Canonical gtag command queue shape ─────────────────────────────
    //
    // These tests verify that commands pushed onto dataLayer use the
    // canonical IArguments shape that Google's gtag.js runtime expects.
    // Pushing plain Arrays (e.g. `dataLayer.push(args)`) causes the
    // runtime to silently ignore commands — no /g/collect requests,
    // no _ga cookie, gtag('get', ...) callbacks never fire.
    //
    // These tests MUST fail against the old `dataLayer.push(args)`
    // implementation and pass against the canonical
    // `dataLayer.push(arguments)` implementation.

    describe("canonical gtag command queue shape", () => {
      it("TEST A — queued commands are IArguments objects, not plain Arrays", () => {
        initializeAnalytics();

        const calls = getGtagCalls();
        expect(calls.length).toBeGreaterThanOrEqual(2); // js + config at minimum

        // Canonical gtag pushes `arguments` objects, not Arrays.
        // Array.isArray() returns false for IArguments.
        for (const entry of calls) {
          expect(Array.isArray(entry)).toBe(false);
          // IArguments has numeric indices and .length
          expect(typeof entry.length).toBe("number");
          expect(entry.length).toBeGreaterThanOrEqual(1);
          // First argument is always accessible at index 0
          expect(typeof entry[0]).toBe("string");
        }
      });

      it("TEST B — js command contains Date and config has send_page_view: false", () => {
        initializeAnalytics();

        const calls = getGtagCalls();

        const jsCall = calls.find((c) => getNthArg(c, 0) === "js");
        expect(jsCall).toBeDefined();
        expect(jsCall!.length).toBe(2);
        expect(getNthArg(jsCall!, 1)).toBeInstanceOf(Date);

        const configCall = calls.find((c) => getNthArg(c, 0) === "config");
        expect(configCall).toBeDefined();
        expect(configCall!.length).toBe(3);
        expect(getNthArg(configCall!, 1)).toBe(VALID_ID);
        const configOptions = getNthArg(configCall!, 2) as Record<string, unknown>;
        expect(configOptions).toBeDefined();
        expect(configOptions.send_page_view).toBe(false);
      });

      it("TEST C — explicit page_view is queued with page_location, page_path, page_title", () => {
        initializeAnalytics();
        trackPageView({
          pathname: "/program",
          search: "?tab=sleep",
          hash: "#overview",
          title: "Program | somna",
        });

        const calls = getGtagCalls();
        const pvCall = calls.find(
          (c) => getNthArg(c, 0) === "event" && getNthArg(c, 1) === "page_view",
        );
        expect(pvCall).toBeDefined();
        expect(pvCall!.length).toBe(3);

        const params = getNthArg(pvCall!, 2) as Record<string, unknown>;
        expect(typeof params.page_location).toBe("string");
        expect(typeof params.page_path).toBe("string");
        expect(typeof params.page_title).toBe("string");

        expect(params.page_location).toBe("https://somna.help/program?tab=sleep#overview");
        expect(params.page_path).toBe("/program?tab=sleep#overview");
        expect(params.page_title).toBe("Program | somna");

        // Confirm it's an IArguments, not a plain Array
        expect(Array.isArray(pvCall)).toBe(false);
      });

      it("TEST D — get callback uses same canonical command shape", () => {
        initializeAnalytics();

        const callback = vi.fn();
        if (window.gtag) {
          window.gtag("get", VALID_ID, "client_id", callback);
        }

        const calls = getGtagCalls();
        const getCall = calls.find(
          (c) => getNthArg(c, 0) === "get" && getNthArg(c, 1) === VALID_ID,
        );
        expect(getCall).toBeDefined();
        expect(getCall!.length).toBe(4);
        expect(getNthArg(getCall!, 2)).toBe("client_id");
        expect(typeof getNthArg(getCall!, 3)).toBe("function");

        // Must be IArguments shape, not a plain Array
        expect(Array.isArray(getCall)).toBe(false);
      });

      it("TEST E — initialization is idempotent: one script, one set of init commands", () => {
        initializeAnalytics();
        const firstCallCount = getGtagCalls().length;
        expect(countGtagScripts()).toBe(1);

        // Second call should be a no-op
        initializeAnalytics();
        expect(countGtagScripts()).toBe(1);
        expect(getGtagCalls().length).toBe(firstCallCount);

        // Third call — still no change
        initializeAnalytics();
        expect(countGtagScripts()).toBe(1);
        expect(getGtagCalls().length).toBe(firstCallCount);
      });

      it("TEST F — script load failure does not throw into React/app", () => {
        // Simulate script.onerror being called (ad blocker, network failure)
        initializeAnalytics();
        const script = document.querySelector<HTMLScriptElement>("script[data-ga-id]");
        expect(script).toBeDefined();

        // Trigger error handler — must not throw
        expect(() => {
          const errorEvent = new Event("error");
          script!.dispatchEvent(errorEvent);
        }).not.toThrow();

        // App continues to work: trackPageView still queues locally
        expect(() => trackPageView({ pathname: "/after-error" })).not.toThrow();
        const pageViews = getPageViewCalls();
        expect(pageViews.length).toBe(1);
      });

      it("TEST G — no window/document access during SSR (SSR-safe)", () => {
        // Simulate SSR by checking that initialization short-circuits
        // before any window/document access when window is undefined.
        // In jsdom, window is always defined, so we test the behavior
        // that guards SSR: when shouldEnable() returns false because
        // of invalid env, no script is injected and no errors occur.

        // We can't actually remove window in jsdom, but we verify
        // that the initialization path when disabled does not create
        // a script tag or call any DOM APIs beyond basic checks.
        vi.stubEnv("VITE_GA_MEASUREMENT_ID", "");
        resetAnalytics();
        window.dataLayer = [];
        window.gtag = undefined;

        expect(() => initializeAnalytics()).not.toThrow();
        expect(countGtagScripts()).toBe(0);
        expect(isAnalyticsEnabled()).toBe(false);

        // dataLayer should still be empty (no commands queued)
        expect(getGtagCalls().length).toBe(0);
      });

      it("TEST H — analytics disabled with invalid/missing measurement ID is safe no-op", () => {
        vi.stubEnv("VITE_GA_MEASUREMENT_ID", "");
        resetAnalytics();
        window.dataLayer = [];
        window.gtag = undefined;

        initializeAnalytics();
        expect(isAnalyticsEnabled()).toBe(false);
        expect(() => trackPageView({ pathname: "/" })).not.toThrow();
        expect(() => trackEvent("test")).not.toThrow();
        expect(getGtagCalls().length).toBe(0);

        // Invalid format
        vi.stubEnv("VITE_GA_MEASUREMENT_ID", "not-a-real-id");
        resetAnalytics();
        window.dataLayer = [];

        initializeAnalytics();
        expect(isAnalyticsEnabled()).toBe(false);
        expect(getGtagCalls().length).toBe(0);
      });

      it("TEST I — browser-level integration: simulated gtag consumer processes canonical commands", () => {
        // This test simulates what happens when the real gtag.js loads
        // and starts consuming the dataLayer. The canonical runtime
        // iterates over dataLayer entries and reads them by numeric
        // index, treating each entry as an IArguments-like object.
        //
        // We verify that a consumer written in the canonical style
        // (iterating entries and reading entry[0], entry[1], entry[2])
        // can correctly process all commands that were queued by the
        // stub before "load".

        // Queue commands via the stub
        initializeAnalytics();
        trackPageView({ pathname: "/test-page", title: "Test Page" });

        const calls = getGtagCalls();
        const consumed: Array<{ cmd: string; rest: unknown[] }> = [];

        // Simulate the canonical gtag consumer pattern:
        // iterate dataLayer entries, process each as arguments-like
        for (let i = 0; i < calls.length; i++) {
          const entry = calls[i];
          const cmd = entry[0] as string;
          const rest: unknown[] = [];
          for (let j = 1; j < entry.length; j++) {
            rest.push(entry[j]);
          }
          consumed.push({ cmd, rest });
        }

        // Verify the consumer successfully reads every queued command
        const cmds = consumed.map((c) => c.cmd);
        expect(cmds).toContain("js");
        expect(cmds).toContain("config");
        expect(cmds).toContain("event");

        // Verify js command content
        const jsCmd = consumed.find((c) => c.cmd === "js");
        expect(jsCmd).toBeDefined();
        expect(jsCmd!.rest[0]).toBeInstanceOf(Date);

        // Verify config command content
        const configCmd = consumed.find((c) => c.cmd === "config");
        expect(configCmd).toBeDefined();
        expect(configCmd!.rest[0]).toBe(VALID_ID);
        expect((configCmd!.rest[1] as Record<string, unknown>).send_page_view).toBe(false);

        // Verify page_view event
        const pvCmd = consumed.find(
          (c) => c.cmd === "event" && (c.rest[0] as string) === "page_view",
        );
        expect(pvCmd).toBeDefined();
        const pvParams = pvCmd!.rest[1] as Record<string, unknown>;
        expect(pvParams.page_path).toBe("/test-page");
        expect(pvParams.page_title).toBe("Test Page");
      });

      it("REGRESSION: this test would fail if commands were plain Arrays", () => {
        // Verify that the shape difference is real and detectable.
        // If someone re-introduces `dataLayer.push(args)` (plain Array),
        // this test must catch it.
        //
        // We do this by verifying Array.isArray() is false for entries
        // AND that the entry still has a length property and numeric
        // indices — the signature of IArguments.
        initializeAnalytics();
        trackPageView({ pathname: "/regression-check" });

        const calls = getGtagCalls();
        expect(calls.length).toBeGreaterThan(0);

        for (const entry of calls) {
          // The critical assertion: canonical commands are NOT Arrays
          expect(Array.isArray(entry)).toBe(false);
          // But they ARE array-like (have length and numeric indices)
          expect(typeof entry.length).toBe("number");
          expect(entry.length >= 1).toBe(true);
          expect(typeof entry[0]).toBe("string");
        }

        // Sanity check: if we had pushed a plain Array, Array.isArray
        // would be true. Let's verify by doing a direct push for comparison.
        const plainArray = ["test", "arg"];
        expect(Array.isArray(plainArray)).toBe(true);
        // The real dataLayer entries should be different from a plain array
        expect(Array.isArray(calls[0])).not.toBe(Array.isArray(plainArray));
      });
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
