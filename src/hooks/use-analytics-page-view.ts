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
    // SSR guard
    if (typeof window === "undefined") return;

    // Never load analytics for crawlers.
    if (isCrawler) return;

    // Initialize GA4 (idempotent — safe to call even if already initialized
    // by another component).
    initializeAnalytics();

    if (!isAnalyticsEnabled()) return;

    // ── Initial page view (after hydration) ────────────────────────────────
    const initialPath =
      router.state.location.pathname + router.state.location.search + router.state.location.hash;

    lastPathRef.current = initialPath;
    trackPageView({
      path: initialPath,
      title: document.title,
    });

    // ── Subscribe to route changes ─────────────────────────────────────────
    const unsubscribe = router.subscribe("onResolved", () => {
      const currentPath =
        router.state.location.pathname + router.state.location.search + router.state.location.hash;

      // Deduplicate: if the path hasn't changed, don't send another page view.
      // onResolved can fire for same-document navigations or internal re-resolves.
      if (currentPath === lastPathRef.current) return;

      lastPathRef.current = currentPath;
      trackPageView({
        path: currentPath,
        title: document.title,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [router, isCrawler]);
}
