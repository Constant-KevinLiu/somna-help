/**
 * SSR-safe hook that detects the user's `prefers-reduced-motion` preference.
 *
 * Returns `false` during SSR to avoid hydration mismatch; on the client it
 * reads `window.matchMedia` and subscribes to changes.
 *
 * Usage:
 *   const reduceMotion = useReducedMotion();
 *   <Chart isAnimationActive={!reduceMotion} />
 */
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setReduce(mql.matches);
    update();

    // Safari < 14 uses addListener, modern browsers use addEventListener
    if (mql.addEventListener) {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }
    if (mql.addListener) {
      mql.addListener(update);
      return () => mql.removeListener(update);
    }
  }, []);

  return reduce;
}
