/**
 * Crawler detection context.
 *
 * Populated in the root route (src/routes/__root.tsx) so every descendant
 * component can decide whether to suppress interactive UI such as cookie
 * consent banners, Turnstile widgets, or marketing modals for search-engine
 * crawlers.
 */

import { createContext, useContext } from "react";

export interface CrawlerContextValue {
  /** True when the current request is a recognized search-engine crawler. */
  isCrawler: boolean;
  /** The User-Agent string used for detection. */
  userAgent: string;
}

export const CrawlerContext = createContext<CrawlerContextValue>({
  isCrawler: false,
  userAgent: "",
});

/** Hook for child components to know whether they are rendering for a crawler. */
export function useCrawler(): CrawlerContextValue {
  return useContext(CrawlerContext);
}
