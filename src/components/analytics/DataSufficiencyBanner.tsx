/**
 * Phase F — Data Sufficiency Banner
 *
 * Tells users how much data they have and what insights are available.
 * Never hides the dashboard entirely — always shows something useful.
 *
 * Levels:
 * - none: 0 records — show empty state
 * - insufficient: 1-2 records — show what you have, tell user what's coming
 * - limited: 3-6 records — show trends with low confidence, flag uncertainty
 * - sufficient: 7+ records — full analytics
 */

import { Info, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import type { DataSufficiency } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

interface DataSufficiencyBannerProps {
  sufficiency: DataSufficiency;
  recordCount: number;
  periodDays: number;
  t: (key: string) => string;
  className?: string;
}

const SUFFICIENCY_CONFIG: Record<
  DataSufficiency,
  {
    icon: typeof Info;
    toneClass: string;
    iconClass: string;
    titleKey: string;
    bodyKey: string;
  }
> = {
  none: {
    icon: AlertCircle,
    toneClass: "border-white/10 bg-white/5",
    iconClass: "text-muted-foreground",
    titleKey: "analytics.sufficiency.none.title",
    bodyKey: "analytics.sufficiency.none.body",
  },
  insufficient: {
    icon: Sparkles,
    toneClass: "border-accent/20 bg-accent/5",
    iconClass: "text-accent",
    titleKey: "analytics.sufficiency.insufficient.title",
    bodyKey: "analytics.sufficiency.insufficient.body",
  },
  limited: {
    icon: Info,
    toneClass: "border-accent/30 bg-accent/10",
    iconClass: "text-accent",
    titleKey: "analytics.sufficiency.limited.title",
    bodyKey: "analytics.sufficiency.limited.body",
  },
  sufficient: {
    icon: CheckCircle2,
    toneClass: "border-green-500/20 bg-green-500/5",
    iconClass: "text-green-400",
    titleKey: "analytics.sufficiency.sufficient.title",
    bodyKey: "analytics.sufficiency.sufficient.body",
  },
};

export function DataSufficiencyBanner({
  sufficiency,
  recordCount,
  periodDays,
  t,
  className,
}: DataSufficiencyBannerProps) {
  const config = SUFFICIENCY_CONFIG[sufficiency];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        config.toneClass,
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", config.iconClass)} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            {t(config.titleKey)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t(config.bodyKey)}
          </p>
        </div>
      </div>
    </div>
  );
}
