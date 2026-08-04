/**
 * @vitest-environment jsdom
 *
 * useAnalyticsPageView Hook Tests
 *
 * Verifies that the hook correctly integrates with TanStack Router's
 * onResolved event and the GA4 module.
 *
 * Regression coverage:
 *  - Initial page load fires once
 *  - SPA navigation fires onResolved
 *  - Router event object passed to callback is never used as a string
 *  - Pathname is always a string primitive
 *  - Duplicate paths are deduplicated
 *  - Crawler suppression prevents all analytics loading
 *  - Analytics disabled when measurement ID is absent
 *  - Analytics failure never reaches React ErrorComponent
 *  - No duplicate page views
 */

import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from "vitest";
import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useAnalyticsPageView } from "./use-analytics-page-view";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockInitializeAnalytics = vi.fn();
const mockTrackPageView = vi.fn();
const mockIsAnalyticsEnabled = vi.fn();

vi.mock("@/lib/ga4", () => ({
  initializeAnalytics: (...args: unknown[]) => mockInitializeAnalytics(...args),
  trackPageView: (...args: unknown[]) => mockTrackPageView(...args),
  isAnalyticsEnabled: (...args: unknown[]) => mockIsAnalyticsEnabled(...args),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

type RouterState = {
  location: {
    pathname: string;
    search: string;
    hash: string;
  };
};

type OnResolvedListener = (event: unknown) => void;

function createMockRouter(initialPathname = "/", initialSearch = "", initialHash = "") {
  let state: RouterState = {
    location: { pathname: initialPathname, search: initialSearch, hash: initialHash },
  };

  const listeners = new Set<OnResolvedListener>();

  const subscribeFn = (eventType: string, fn: OnResolvedListener) => {
    if (eventType === "onResolved") {
      listeners.add(fn);
    }
    return () => {
      listeners.delete(fn);
    };
  };

  const subscribe = vi.fn(subscribeFn) as Mock;

  const router = {
    state,
    subscribe,
    // Test helper: trigger a navigation
    __navigate(pathname: string, search = "", hash = "") {
      state = { location: { pathname, search, hash } };
      router.state = state;
      // Fire onResolved with the event object (as TanStack Router does)
      const event = {
        type: "onResolved" as const,
        toLocation: { pathname, search, hash },
        pathChanged: true,
        hrefChanged: true,
        hashChanged: false,
      };
      listeners.forEach((fn) => fn(event));
    },
    __fireResolvedWithObject(obj: unknown) {
      listeners.forEach((fn) => fn(obj));
    },
    __listenerCount() {
      return listeners.size;
    },
  };

  return router as unknown as Parameters<typeof useAnalyticsPageView>[0] & {
    __navigate: (pathname: string, search?: string, hash?: string) => void;
    __fireResolvedWithObject: (obj: unknown) => void;
    __listenerCount: () => number;
    state: RouterState;
    subscribe: Mock;
  };
}

// ─── Test suite ──────────────────────────────────────────────────────────────

describe("useAnalyticsPageView", () => {
  beforeEach(() => {
    // Reset all mock implementations AND call history
    mockInitializeAnalytics.mockReset();
    mockTrackPageView.mockReset();
    mockIsAnalyticsEnabled.mockReset();
    mockIsAnalyticsEnabled.mockReturnValue(true);
    // Set up jsdom window
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
    document.title = "Test Page";
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // ── Initial page load ────────────────────────────────────────────────

  describe("initial page load", () => {
    it("fires one page view on mount with pathname/search/hash from router state", () => {
      const router = createMockRouter("/program", "?tab=sleep", "#overview");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      expect(mockInitializeAnalytics).toHaveBeenCalledTimes(1);
      expect(mockTrackPageView).toHaveBeenCalledTimes(1);

      const callArg = mockTrackPageView.mock.calls[0][0] as Record<string, unknown>;
      expect(callArg.pathname).toBe("/program");
      expect(callArg.search).toBe("?tab=sleep");
      expect(callArg.hash).toBe("#overview");
      expect(callArg.title).toBe("Test Page");
    });

    it("does not fire page view when analytics is disabled", () => {
      mockIsAnalyticsEnabled.mockReturnValue(false);
      const router = createMockRouter("/");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      expect(mockInitializeAnalytics).toHaveBeenCalledTimes(1);
      expect(mockTrackPageView).not.toHaveBeenCalled();
    });

    it("subscribes to onResolved after initial page view", () => {
      const router = createMockRouter("/");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      expect(router.subscribe).toHaveBeenCalledWith(
        "onResolved",
        expect.any(Function),
      );
    });
  });

  // ── SPA navigation ───────────────────────────────────────────────────

  describe("SPA navigation", () => {
    it("fires a page view on route change via onResolved", () => {
      const router = createMockRouter("/");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      // Initial page view
      expect(mockTrackPageView).toHaveBeenCalledTimes(1);

      // Navigate
      act(() => {
        (router as any).__navigate("/program");
      });

      expect(mockTrackPageView).toHaveBeenCalledTimes(2);
      const secondCall = mockTrackPageView.mock.calls[1][0] as Record<string, unknown>;
      expect(secondCall.pathname).toBe("/program");
    });

    it("fires multiple page views for multiple navigations", () => {
      const router = createMockRouter("/");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      act(() => {
        (router as any).__navigate("/learn");
      });
      act(() => {
        (router as any).__navigate("/program");
      });
      act(() => {
        (router as any).__navigate("/dashboard");
      });

      expect(mockTrackPageView).toHaveBeenCalledTimes(4); // initial + 3 navigations
    });
  });

  // ── Router event object contract ─────────────────────────────────────

  describe("router event object contract", () => {
    it("callback receives an event object but does not use it as path", () => {
      const router = createMockRouter("/");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      // Fire onResolved with a full event object (what TanStack Router sends)
      const eventObj = {
        type: "onResolved" as const,
        fromLocation: { pathname: "/", search: "", hash: "" },
        toLocation: { pathname: "/program", search: "", hash: "" },
        pathChanged: true,
        hrefChanged: true,
        hashChanged: false,
      };

      // First, update router state so the path is different
      (router as any).state = { location: { pathname: "/program", search: "", hash: "" } };

      act(() => {
        (router as any).__fireResolvedWithObject(eventObj);
      });

      // trackPageView should be called with normalized primitives,
      // NOT with the event object
      expect(mockTrackPageView).toHaveBeenCalledTimes(2); // initial + navigation

      const navCall = mockTrackPageView.mock.calls[1][0] as Record<string, unknown>;
      // The pathname must be a string from router.state, not the event object
      expect(typeof navCall.pathname).toBe("string");
      expect(navCall.pathname).toBe("/program");
      // The event object's top-level properties should NOT appear in input
      expect(navCall).not.toHaveProperty("toLocation");
      expect(navCall).not.toHaveProperty("fromLocation");
      expect(navCall).not.toHaveProperty("type");
    });

    it("REGRESSION: passing a router event object to callback does not cause 'Cannot convert object to primitive value'", () => {
      // This test simulates what happens if the hook accidentally uses
      // the event object as a string. The hook must never do this.
      const router = createMockRouter("/");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      const initialCalls = mockTrackPageView.mock.calls.length;

      // Fire with a plain object that could cause conversion errors
      const weirdObject = Object.create(null);
      weirdObject.toLocation = { pathname: "/test" };

      // Update router state too
      (router as any).state = { location: { pathname: "/test", search: "", hash: "" } };

      expect(() => {
        act(() => {
          (router as any).__fireResolvedWithObject(weirdObject);
        });
      }).not.toThrow();

      expect(() => {
        act(() => {
          (router as any).__fireResolvedWithObject(weirdObject);
        });
      }).not.toThrow(/Cannot convert object to primitive value/);

      // Page view should still fire (it reads from router.state, not the event)
      expect(mockTrackPageView.mock.calls.length).toBeGreaterThan(initialCalls);
    });
  });

  // ── Pathname as string validation ────────────────────────────────────

  describe("pathname is always a string", () => {
    it("passes pathname as string primitive to trackPageView", () => {
      const router = createMockRouter("/about");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      const callArg = mockTrackPageView.mock.calls[0][0] as Record<string, unknown>;
      expect(typeof callArg.pathname).toBe("string");
      expect(callArg.pathname).toBe("/about");
    });
  });

  // ── Missing / malformed pathname ─────────────────────────────────────

  describe("missing or malformed pathname", () => {
    it("skips page view when router state location is missing", () => {
      const router = createMockRouter("/");
      // Corrupt the state
      (router as any).state = { location: null };

      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      // Should not crash, and no page view should be emitted
      expect(mockTrackPageView).not.toHaveBeenCalled();
    });

    it("skips page view when pathname is not a string in router state", () => {
      const router = createMockRouter("/");
      (router as any).state = { location: { pathname: 12345, search: "", hash: "" } };

      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      expect(mockTrackPageView).not.toHaveBeenCalled();
    });
  });

  // ── Duplicate page view suppression ──────────────────────────────────

  describe("no duplicate page views", () => {
    it("does not fire duplicate page views for the same path", () => {
      const router = createMockRouter("/program");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      const initialCount = mockTrackPageView.mock.calls.length;

      // Fire onResolved multiple times with the same path
      act(() => {
        (router as any).__navigate("/program");
      });
      act(() => {
        (router as any).__navigate("/program");
      });
      act(() => {
        (router as any).__navigate("/program");
      });

      // Still only the initial page view
      expect(mockTrackPageView).toHaveBeenCalledTimes(initialCount);
    });

    it("fires once per unique path change", () => {
      const router = createMockRouter("/");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      act(() => {
        (router as any).__navigate("/a");
      });
      act(() => {
        (router as any).__navigate("/a"); // duplicate
      });
      act(() => {
        (router as any).__navigate("/b");
      });
      act(() => {
        (router as any).__navigate("/a"); // different from last
      });

      // Initial / + /a + /b + /a = 4
      expect(mockTrackPageView).toHaveBeenCalledTimes(4);
    });
  });

  // ── Crawler suppression ──────────────────────────────────────────────

  describe("crawler suppression", () => {
    it("does not initialize analytics for crawlers", () => {
      const router = createMockRouter("/");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: true }));

      expect(mockInitializeAnalytics).not.toHaveBeenCalled();
      expect(mockTrackPageView).not.toHaveBeenCalled();
      expect(router.subscribe).not.toHaveBeenCalled();
    });

    it("initializes and tracks for non-crawlers", () => {
      const router = createMockRouter("/");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      expect(mockInitializeAnalytics).toHaveBeenCalledTimes(1);
      expect(mockTrackPageView).toHaveBeenCalledTimes(1);
    });
  });

  // ── Analytics disabled ───────────────────────────────────────────────

  describe("analytics disabled when measurement ID is absent", () => {
    it("initializes but does not track when disabled", () => {
      mockIsAnalyticsEnabled.mockReturnValue(false);
      const router = createMockRouter("/");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      expect(mockInitializeAnalytics).toHaveBeenCalledTimes(1);
      expect(mockTrackPageView).not.toHaveBeenCalled();
      expect(router.subscribe).not.toHaveBeenCalled();
    });
  });

  // ── Analytics failure never reaches React ────────────────────────────

  describe("analytics failure never reaches React ErrorComponent", () => {
    it("does not throw when initializeAnalytics throws", () => {
      mockInitializeAnalytics.mockImplementation(() => {
        throw new Error("GA init failed");
      });

      const router = createMockRouter("/");

      // Should NOT throw — the hook's outer try/catch catches it
      expect(() => {
        renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));
      }).not.toThrow();
    });

    it("does not throw when trackPageView throws on initial load", () => {
      mockTrackPageView.mockImplementation(() => {
        throw new Error("trackPageView crash");
      });

      const router = createMockRouter("/");

      expect(() => {
        renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));
      }).not.toThrow();
    });

    it("does not throw when trackPageView throws during navigation", () => {
      // First let the initial page view succeed, then make it throw
      let shouldThrow = false;
      mockTrackPageView.mockImplementation(() => {
        if (shouldThrow) {
          throw new Error("navigation analytics crash");
        }
      });

      const router = createMockRouter("/");
      renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));

      const initialCallCount = mockTrackPageView.mock.calls.length;
      expect(initialCallCount).toBeGreaterThan(0);

      // Now make trackPageView throw
      shouldThrow = true;

      // Navigation should not throw — the inner defensive boundary catches it
      expect(() => {
        act(() => {
          (router as any).__navigate("/page2");
        });
      }).not.toThrow();
    });

    it("does not throw when router.subscribe throws", () => {
      const router = createMockRouter("/");
      router.subscribe.mockImplementation(() => {
        throw new Error("router subscribe failed");
      });

      expect(() => {
        renderHook(() => useAnalyticsPageView(router, { isCrawler: false }));
      }).not.toThrow();
    });
  });

  // ── Cleanup / unmount ────────────────────────────────────────────────

  describe("cleanup on unmount", () => {
    it("unsubscribes from router events on unmount", () => {
      const router = createMockRouter("/");
      const { unmount } = renderHook(() =>
        useAnalyticsPageView(router, { isCrawler: false }),
      );

      expect((router as any).__listenerCount()).toBe(1);

      unmount();

      expect((router as any).__listenerCount()).toBe(0);
    });
  });
});
