/**
 * Phase F — Weekly Focus Card
 *
 * Displays the rule-based weekly focus suggestion.
 * Users can accept, dismiss, or save.
 * Never auto-changes reminders or sleep schedule.
 */

import { useState } from "react";
import { Target, Check, X, Bookmark, Info } from "lucide-react";
import type { WeeklyFocus } from "@/lib/analytics/types";
import type { FocusUserAction } from "@/lib/analytics/weekly-focus";
import { cn } from "@/lib/utils";

interface WeeklyFocusCardProps {
  focus: WeeklyFocus | null;
  t: (key: string) => string;
  userAction?: FocusUserAction;
  onAccept?: () => void;
  onDismiss?: () => void;
  onSave?: () => void;
  className?: string;
}

export function WeeklyFocusCard({
  focus,
  t,
  userAction,
  onAccept,
  onDismiss,
  onSave,
  className,
}: WeeklyFocusCardProps) {
  // Hook must be called before any early return (rules of hooks).
  // State is only used when focus is non-null; initial value is fine either way.
  const [showDetails, setShowDetails] = useState(false);

  if (!focus) {
    return null;
  }

  const isDismissed = userAction === "dismissed";
  const isAccepted = userAction === "accepted";

  if (isDismissed) {
    return (
      <div
        className={cn(
          "glass-strong rounded-3xl p-6 md:p-8 animate-fade-up",
          className,
        )}
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Target className="h-3.5 w-3.5 text-accent" />
          {t("dashboard.analytics.focus")}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("analytics.focus.dismissed")}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "glass-strong rounded-3xl p-6 md:p-8 animate-fade-up",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Target className="h-3.5 w-3.5 text-accent" />
        {t("dashboard.analytics.focus")}
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {t("analytics.focus.subtitle")}
      </p>

      <div className="mt-4 rounded-2xl border border-accent/30 bg-accent/10 p-4">
        <div className="text-xs uppercase tracking-wider text-accent/80">
          {focus.category.replace(/_/g, " ")}
        </div>
        <p className="mt-2 text-base leading-relaxed text-foreground">
          {t(focus.actionKey)}
        </p>
        <p className="mt-2 text-sm text-foreground/70">
          {t(focus.reasonKey)}
        </p>
      </div>

      {/* Evidence toggle */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        aria-expanded={showDetails}
        className="mt-3 flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
      >
        <Info className="h-3 w-3" />
        {showDetails ? "Hide evidence" : "Why this focus?"}
      </button>

      {showDetails && (
        <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-muted-foreground">
          <dl className="space-y-1">
            <div className="flex justify-between">
              <dt>Based on:</dt>
              <dd className="text-foreground/80">{focus.evidence.sampleSize} records</dd>
            </div>
            <div className="flex justify-between">
              <dt>Generated:</dt>
              <dd className="text-foreground/80">
                {new Date(focus.generatedAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* Actions */}
      {!isAccepted ? (
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
          >
            <Check className="h-4 w-4" />
            {t("analytics.focus.accept")}
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm transition hover:bg-white/10"
          >
            <Bookmark className="h-4 w-4" />
            {t("analytics.focus.save")}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-muted-foreground transition hover:bg-white/10"
          >
            <X className="h-4 w-4" />
            {t("analytics.focus.dismiss")}
          </button>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
          <Check className="h-4 w-4" />
          {t("analytics.focus.accepted")}
        </div>
      )}
    </div>
  );
}
