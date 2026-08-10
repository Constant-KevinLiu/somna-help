/**
 * Phase F — Weekly Summary Component
 *
 * Comprehensive weekly summary card.
 * Distinguishes: recorded data, derived metrics, interpretation.
 * Supports navigation between weeks.
 */

import { ChevronLeft, ChevronRight, Calendar, ClipboardCheck } from "lucide-react";
import type { WeeklySummary as WeeklySummaryType } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

interface WeeklySummaryProps {
  summary: WeeklySummaryType | null;
  t: (key: string) => string;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  className?: string;
}

export function WeeklySummary({
  summary,
  t,
  canGoPrev,
  canGoNext,
  onPrevWeek,
  onNextWeek,
  className,
}: WeeklySummaryProps) {
  if (!summary) {
    return (
      <div className={cn("glass-strong rounded-3xl p-6 md:p-8 animate-fade-up", className)}>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-accent" />
          {t("analytics.weekly.title")}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{t("analytics.weekly.empty")}</p>
      </div>
    );
  }

  const formatTime = (hhmm: string | null) => hhmm ?? "—";

  const formatMinutes = (min: number | null): string => {
    if (min === null) return "—";
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className={cn("glass-strong rounded-3xl p-6 md:p-8 animate-fade-up", className)}>
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-accent" />
          {t("analytics.weekly.title")}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevWeek}
            disabled={!canGoPrev}
            aria-label={t("analytics.weekly.previousWeek")}
            className={cn(
              "p-1.5 rounded-full transition",
              canGoPrev
                ? "text-muted-foreground hover:text-foreground hover:bg-white/5"
                : "text-muted-foreground/30 cursor-not-allowed",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-muted-foreground px-1">
            {summary.weekStart.slice(5)} — {summary.weekEnd.slice(5)}
          </span>
          <button
            type="button"
            onClick={onNextWeek}
            disabled={!canGoNext}
            aria-label={t("analytics.weekly.nextWeek")}
            className={cn(
              "p-1.5 rounded-full transition",
              canGoNext
                ? "text-muted-foreground hover:text-foreground hover:bg-white/5"
                : "text-muted-foreground/30 cursor-not-allowed",
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Completion bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{t("analytics.weekly.completion")}</span>
          <span>
            {summary.recordedNights} / {summary.eligibleDays} {t("analytics.unit.nights")}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{
              width: `${summary.diaryCompletionRate ?? 0}%`,
            }}
            role="progressbar"
            aria-valuenow={summary.diaryCompletionRate ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Key metrics grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricMini
          label={t("analytics.weekly.avgSleep")}
          value={formatMinutes(summary.avgTotalSleepTime)}
        />
        <MetricMini
          label={t("analytics.weekly.avgEfficiency")}
          value={summary.avgSleepEfficiency !== null ? `${summary.avgSleepEfficiency}%` : "—"}
        />
        <MetricMini
          label={t("analytics.weekly.avgLatency")}
          value={
            summary.avgSleepOnsetLatency !== null
              ? `${summary.avgSleepOnsetLatency} ${t("analytics.unit.minutes")}`
              : "—"
          }
        />
        <MetricMini
          label={t("analytics.weekly.regularity")}
          value={summary.sleepRegularity !== null ? `${summary.sleepRegularity}/100` : "—"}
        />
      </div>

      {/* Schedule */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("analytics.weekly.bedtime")}
          </div>
          <div className="mt-1 font-display text-2xl text-gradient">
            {formatTime(summary.avgBedtime)}
          </div>
          {summary.bedtimeVariability !== null && (
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              ± {summary.bedtimeVariability} {t("analytics.unit.minutes")}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("analytics.weekly.wakeTime")}
          </div>
          <div className="mt-1 font-display text-2xl text-gradient">
            {formatTime(summary.avgWakeTime)}
          </div>
          {summary.wakeTimeVariability !== null && (
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              ± {summary.wakeTimeVariability} {t("analytics.unit.minutes")}
            </div>
          )}
        </div>
      </div>

      {/* Reminder consistency (if data exists) */}
      {summary.activeReminderCount > 0 && summary.reminderCompletion !== null && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-accent" />
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("analytics.weekly.reminderCompletion")}
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-2xl text-gradient">
              {summary.reminderCompletion}%
            </span>
            <span className="text-xs text-muted-foreground">
              across {summary.activeReminderCount} reminder
              {summary.activeReminderCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Interpretation section */}
      {(summary.strongestPositivePattern || summary.areaToObserve) && (
        <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
          {summary.strongestPositivePattern && (
            <div>
              <div className="text-xs uppercase tracking-wider text-green-400/80">
                {t("analytics.weekly.strongestPattern")}
              </div>
              <p className="mt-1 text-sm text-foreground/80">
                {t(`analytics.pattern.${summary.strongestPositivePattern}`)}
              </p>
            </div>
          )}
          {summary.areaToObserve && (
            <div>
              <div className="text-xs uppercase tracking-wider text-accent/80">
                {t("analytics.weekly.areaToObserve")}
              </div>
              <p className="mt-1 text-sm text-foreground/80">
                {t(`analytics.pattern.${summary.areaToObserve}`)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MetricMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg text-gradient">{value}</div>
    </div>
  );
}
