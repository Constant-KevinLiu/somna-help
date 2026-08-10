/**
 * Phase F — Insight Card Component
 *
 * Explainable insight card with evidence disclosure.
 * Each card answers: what, evidence, time period, sample size, why shown, next step.
 *
 * Uses progressive disclosure — evidence details hidden behind a "Show details" toggle.
 */

import { useState } from "react";
import { ChevronDown, Info, Sparkles, TrendingUp, Target, Award } from "lucide-react";
import type { InsightCard as InsightCardType, InsightType } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  insight: InsightCardType;
  t: (key: string) => string;
  onAction?: (action: string) => void;
  className?: string;
}

const TYPE_ICONS: Record<InsightType, typeof Sparkles> = {
  trend: TrendingUp,
  pattern: Info,
  encouragement: Award,
  behavioral_focus: Target,
  metric: Sparkles,
};

const TYPE_BADGE_LABELS: Record<InsightType, string> = {
  trend: "Trend",
  pattern: "Pattern",
  encouragement: "Milestone",
  behavioral_focus: "Focus",
  metric: "Metric",
};

export function InsightCard({ insight, t, onAction, className }: InsightCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const Icon = TYPE_ICONS[insight.type];

  const confidenceLabel =
    insight.confidence === "high"
      ? "High confidence"
      : insight.confidence === "medium"
        ? "Medium confidence"
        : "Low confidence";

  return (
    <article
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[0.07]",
        className,
      )}
      aria-labelledby={`insight-${insight.id}-title`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
          <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-accent/80">
              {TYPE_BADGE_LABELS[insight.type]}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              · {confidenceLabel}
            </span>
          </div>
          <h3
            id={`insight-${insight.id}-title`}
            className="mt-1 font-display text-base text-foreground"
          >
            {t(insight.titleKey)}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">{t(insight.bodyKey)}</p>
        </div>
      </div>

      {/* Evidence disclosure */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          aria-expanded={showDetails}
          aria-controls={`insight-${insight.id}-evidence`}
          className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
        >
          <Info className="h-3 w-3" />
          {showDetails ? "Hide details" : "Show details"}
          <ChevronDown
            className={cn("h-3 w-3 transition-transform", showDetails && "rotate-180")}
          />
        </button>

        {showDetails && (
          <div
            id={`insight-${insight.id}-evidence`}
            className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-muted-foreground"
          >
            <dl className="space-y-1">
              <div className="flex justify-between">
                <dt>Period:</dt>
                <dd className="text-foreground/80">{insight.evidence.period}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Records used:</dt>
                <dd className="text-foreground/80">{insight.evidence.sampleSize}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Data sufficiency:</dt>
                <dd className="text-foreground/80 capitalize">
                  {insight.dataSufficiency.replace("_", " ")}
                </dd>
              </div>
              {insight.evidence.supportingPatterns &&
                insight.evidence.supportingPatterns.length > 0 && (
                  <div className="flex justify-between">
                    <dt>Supporting:</dt>
                    <dd className="text-foreground/80">
                      {insight.evidence.supportingPatterns.join(", ")}
                    </dd>
                  </div>
                )}
            </dl>
          </div>
        )}
      </div>

      {/* Action */}
      {insight.action && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => onAction?.(insight.action?.actionType ?? "info")}
            className="text-xs font-medium text-accent transition hover:text-accent/80"
          >
            {t(insight.action.labelKey)} →
          </button>
        </div>
      )}
    </article>
  );
}
