/**
 * Phase F — Insight Section
 *
 * Container for insight cards. Shows prioritized list of 3-5 insights.
 * Handles empty and insufficient-data states gracefully.
 */

import { Lightbulb } from "lucide-react";
import type { InsightCard as InsightCardType } from "@/lib/analytics/types";
import { InsightCard } from "./InsightCard";

interface InsightSectionProps {
  insights: InsightCardType[];
  t: (key: string) => string;
  onInsightAction?: (action: string) => void;
}

export function InsightSection({ insights, t, onInsightAction }: InsightSectionProps) {
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Lightbulb className="h-3.5 w-3.5 text-accent" />
        {t("dashboard.analytics.insights")}
      </div>

      {insights.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} t={t} onAction={onInsightAction} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Keep recording to discover insights about your sleep patterns.
        </p>
      )}
    </div>
  );
}
