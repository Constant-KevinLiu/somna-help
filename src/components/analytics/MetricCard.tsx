/**
 * Phase F — Metric Card Component
 *
 * Displays a single sleep metric with its value, unit, and optional trend.
 * Accessible: aria-labels, semantic structure, color-agnostic trend indicators.
 */

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { TrendDirection } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  trend?: TrendDirection;
  trendValue?: string;
  subValue?: string;
  isLoading?: boolean;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  subValue,
  isLoading = false,
  className,
}: MetricCardProps) {
  const trendIcon = () => {
    if (!trend || trend === "insufficient_data" || trend === "mixed") return null;

    const Icon = trend === "improving" ? ArrowUp : trend === "declining" ? ArrowDown : Minus;
    const colorClass =
      trend === "improving"
        ? "text-green-400"
        : trend === "declining"
          ? "text-orange-400"
          : "text-muted-foreground";

    return (
      <span
        className={cn("inline-flex items-center gap-0.5 text-xs", colorClass)}
        aria-label={`Trend: ${trend}`}
      >
        <Icon className="h-3 w-3" />
        {trendValue}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div
        className={cn("rounded-2xl border border-white/10 bg-white/5 p-5 animate-pulse", className)}
      >
        <div className="h-4 w-20 rounded bg-white/10" />
        <div className="mt-2 h-8 w-16 rounded bg-white/10" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[0.07]",
        className,
      )}
      role="group"
      aria-label={`${label}: ${value}${unit ? ` ${unit}` : ""}`}
    >
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-3xl text-gradient">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      {trend && trendIcon()}
      {subValue && <div className="mt-1 text-xs text-muted-foreground">{subValue}</div>}
    </div>
  );
}
