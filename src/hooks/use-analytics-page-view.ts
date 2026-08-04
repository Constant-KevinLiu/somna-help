/**
 * useAnalyticsPageView
 *
 * React hook that initializes GA4 and tracks page views on every successful
 * client-side route change using TanStack Router's `onResolved` event.
 *
 * Behavior:
 *  - Calls initializeAnalytics() once on mount (browser only).
 *  - Sends the initial page view after first mount.
 *  - Subscribes to router.onResolved and sends a page_view event each time
 *    the route successfully changes.
 *  - Skips duplicate page views for the same path (e.g. hash-only changes
 *    that don't actually navigate).
 *
 * SSR-safe: returns early on the server with no side effects.
 *
 * Fail-safe: the analytics hook itself is wrapped in a try/catch so that
 * ANY failure in analytics initialization, path computation, or emission
 * can never propagate into React's error boundary.
 *
 * TanStack Router `onResolved` callback contract:
 *   router.subscribe("onResolved", (event) => { ... })
 *   The callback receives a NavigationEventInfo object:
 *     { type: 'onResolved', fromLocation?, toLocation, pathChanged,
 *       hrefChanged, hashChanged }
 *   This hook IGNORES the event object and always reads from
 *   router.state.location, which is a stable ParsedLocation with
 *   string primitives (pathname, search, hash).
 *   The callback parameter is intentionally unused to prevent accidental
 *   use of the event object as a string.
 */

import { useEffect, useRef } from "react";
import type { AnyRouter } from "@tanstack/react-router";
import { initializeAnalytics, trackPageView, isAnalyticsEnabled } from "@/lib/ga4";

export function useAnalyticsPageView(
  router: AnyRouter,
  options: { isCrawler?: boolean } = {},
): void {
  const lastPathRef = useRef<string | null>(null);
  const isCrawler = options.isCrawler ?? false;

  useEffect(() => {
    // ── Outermost defensive boundary ──────────────────────────────────────
    // If ANYTHING goes wrong in analytics setup or tracking, the app must
    // continue to render. This try/catch catches errors during initialization,
    // subscription setup, and the initial page view emission.
    try {
      // SSR guard
      if (typeof window === "undefined") return;

      // Never load analytics for crawlers.
      if (isCrawler) return;

      // Initialize GA4 (idempotent — safe to call even if already initialized
      // by another component).
      initializeAnalytics();

      if (!isAnalyticsEnabled()) return;

      // ── Helper: read normalized primitives from router state ──────────
      function readPathFromRouter(): { pathname: string; search: string; hash: string } | null {
        const loc = router.state?.location;
        if (!loc) return null;
        const pathname = loc.pathname;
        const search = loc.search ?? "";
        const hash = loc.hash ?? "";
        // Defense-in-depth: confirm each is a string primitive
        if (typeof pathname !== "string") return null;
        if (typeof search !== "string") return null;
        if (typeof hash !== "string") return null;
        return { pathname, search, hash };
      }

      // ── Initial page view (after hydration) ────────────────────────────
      const initial = readPathFromRouter();
      if (initial) {
        const initialFull = initial.pathname + initial.search + initial.hash;
        lastPathRef.current = initialFull;
        trackPageView({
          pathname: initial.pathname,
          search: initial.search,
          hash: initial.hash,
          title: typeof document !== "undefined" ? document.title : undefined,
        });
      }

      // ── Subscribe to route changes ─────────────────────────────────────
      // The callback receives a router event object, but we intentionally
      // do not use it — we read directly from router.state.location which
      // always has string primitives for pathname/search/hash.
      const unsubscribe = router.subscribe("onResolved", () => {
        // Inner defensive boundary: analytics callback must never throw
        // into the router's event system.
        try {
          const current = readPathFromRouter();
          if (!current) return;

          const currentFull = current.pathname + current.search + current.hash;

          // Deduplicate: if the path hasn't changed, don't send another page view.
          // onResolved can fire for same-document navigations or internal re-resolves.
          if (currentFull === lastPathRef.current) return;

          lastPathRef.current = currentFull;
          trackPageView({
            pathname: current.pathname,
            search: current.search,
            hash: current.hash,
            title: typeof document !== "undefined" ? document.title : undefined,
          });
        } catch {
          // Analytics callback failure must never propagate.
        }
      });

      return () => {
        try {
          unsubscribe();
        } catch {
          // Unsubscribe failure is non-critical.
        }
      };
    } catch {
      // If analytics setup fails entirely, the app still renders normally.
      // Return no cleanup — there's nothing to clean up.
      return;
    }
  }, [router, isCrawler]);
}
