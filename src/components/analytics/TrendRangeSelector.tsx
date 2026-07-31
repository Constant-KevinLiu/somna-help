/**
 * Phase F — Trend Range Selector
 *
 * 7 / 14 / 30 / 90 day window selector.
 * Accessible: button group with aria-pressed, keyboard nav.
 */

import type { WindowKey } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

interface TrendRangeSelectorProps {
  value: WindowKey;
  onChange: (window: WindowKey) => void;
  labels: Record<WindowKey, string>;
  className?: string;
}

const OPTIONS: WindowKey[] = [
  "7d",
  "14d",
  "30d",
  "90d",
];

export function TrendRangeSelector({
  value,
  onChange,
  labels,
  className,
}: TrendRangeSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Time range"
      className={cn(
        "inline-flex rounded-full border border-white/10 bg-white/5 p-1",
        className,
      )}
    >
      {OPTIONS.map((key) => {
        const isActive = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={isActive}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition",
              isActive
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5",
            )}
          >
            {labels[key]}
          </button>
        );
      })}
    </div>
  );
}
