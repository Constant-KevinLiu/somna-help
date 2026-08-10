import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LANG_PREFIX } from "@/lib/lang-detect";
import { useSleepI18n } from "@/lib/sleep-i18n";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { PageHero } from "@/components/PageHero";
import { DashboardShareCard } from "@/components/DashboardShareCard";
import { SafeLink } from "@/components/common/SafeLink";
import {
  Flame,
  Moon,
  Sparkles,
  Sun,
  TrendingUp,
  Wind,
  Activity,
  ArrowRight,
  Bell,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  currentStreak,
  efficiencyTrend,
  loadRecords,
  type SleepRecord,
  weeklyAverageEfficiency,
} from "@/lib/sleep-records";
import { sleepWindow } from "@/lib/cbti-brain";
import { ProgramDashboardCard } from "@/components/program/ProgramDashboardCard";
import { loadReminders } from "@/services/habit/habit-storage";
import { calculateAllHabitProgress } from "@/services/habit/habit-progress";
import type { Reminder, HabitProgress } from "@/services/habit/habit-types";
import type { FocusUserAction } from "@/lib/analytics/types";

// Phase F — Analytics
import { useState as useStateHook } from "react";
import { useSleepAnalytics } from "@/hooks/useSleepAnalytics";
import type { WindowKey } from "@/lib/analytics/types";
import {
  TrendRangeSelector,
  InsightSection,
  WeeklySummary as WeeklySummaryCard,
  WeeklyFocusCard,
  WeeklyReflectionFlow,
  DataSufficiencyBanner,
  SleepChart,
} from "@/components/analytics";
import { getSavedFocus, saveFocusResponse, isFocusDismissed } from "@/lib/analytics/weekly-focus";
import { weekStart as getWeekStart } from "@/lib/analytics/date-ranges";
import { previousWeek, nextWeek } from "@/lib/analytics/weekly-summary";
import { BarChart3 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dash,
  head: () => ({
    meta: [
      { title: "Dashboard — somna" },
      { name: "description", content: "Your gentle sleep dashboard." },
    ],
  }),
});

export function Dash() {
  const { lang, t: baseT } = useI18n();
  const { t } = useSleepI18n();
  const langPrefix = LANG_PREFIX[lang];
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sleepRecords = loadRecords();
    setRecords(sleepRecords);
    setHydrated(true);
  }, []);

  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => a.date.localeCompare(b.date)),
    [records],
  );
  // Derived values are pure functions of sortedRecords — memoize so they don't
  // recompute on unrelated re-renders (e.g. opening the share modal).
  const plan = useMemo(() => sleepWindow(sortedRecords), [sortedRecords]);
  const weeklyAvg = useMemo(() => weeklyAverageEfficiency(sortedRecords), [sortedRecords]);
  const streak = useMemo(() => currentStreak(sortedRecords), [sortedRecords]);
  const trend = useMemo(() => efficiencyTrend(sortedRecords), [sortedRecords]);
  const latest = sortedRecords[sortedRecords.length - 1] ?? null;
  const chartData = useMemo(
    () =>
      sortedRecords.slice(-7).map((record) => ({
        date: record.date,
        label: record.date.slice(5),
        efficiency: record.sleepEfficiency,
      })),
    [sortedRecords],
  );

  // Screen cutoff = 60 minutes before bedtime, with a safe default for new users
  const screenCutoff = useMemo(
    () => (records.length === 0 ? "22:00" : shiftClock(plan.bedtime, -60)),
    [plan.bedtime, records.length],
  );

  const greeting = t("dash.greeting");

  // Load habit progress (client-side only)
  const reminders = useMemo(() => (hydrated ? loadReminders() : []), [hydrated]);
  const habitProgress = useMemo(() => calculateAllHabitProgress(reminders), [reminders]);
  const totalHabitCompletions = useMemo(
    () => Array.from(habitProgress.values()).reduce((sum, p) => sum + p.completionCount, 0),
    [habitProgress],
  );
  const activeRemindersCount = reminders.filter((r) => r.status === "active").length;

  // Phase F — Analytics state (client-side only)
  const [analyticsWindow, setAnalyticsWindow] = useStateHook<WindowKey>("30d");
  const [selectedWeek, setSelectedWeek] = useStateHook<string>(() => {
    if (typeof window === "undefined") return "";
    const today = new Date().toISOString().slice(0, 10);
    return today;
  });
  const [focusAction, setFocusAction] = useStateHook<string | null>(null);
  const [analyticsHydrated, setAnalyticsHydrated] = useStateHook(false);

  // Compute analytics
  const analytics = useSleepAnalytics(sortedRecords, analyticsWindow, habitProgress);

  // Load saved focus state
  useEffect(() => {
    setAnalyticsHydrated(true);
    const today = new Date().toISOString().slice(0, 10);
    const currentWeekStart = getWeekStart(today);
    const saved = getSavedFocus(currentWeekStart);
    if (saved) {
      setFocusAction(saved.userAction);
    } else {
      setFocusAction(null);
    }
  }, [analytics.weeklyFocus?.id]);

  const handleFocusAccept = () => {
    if (!analytics.weeklyFocus) return;
    const today = new Date().toISOString().slice(0, 10);
    const currentWeekStart = getWeekStart(today);
    saveFocusResponse(analytics.weeklyFocus, currentWeekStart, "accepted");
    setFocusAction("accepted");
  };

  const handleFocusDismiss = () => {
    if (!analytics.weeklyFocus) return;
    const today = new Date().toISOString().slice(0, 10);
    const currentWeekStart = getWeekStart(today);
    saveFocusResponse(analytics.weeklyFocus, currentWeekStart, "dismissed");
    setFocusAction("dismissed");
  };

  const handleFocusSave = () => {
    if (!analytics.weeklyFocus) return;
    const today = new Date().toISOString().slice(0, 10);
    const currentWeekStart = getWeekStart(today);
    saveFocusResponse(analytics.weeklyFocus, currentWeekStart, "saved");
    setFocusAction("saved");
  };

  const handlePrevWeek = () => {
    const prev = previousWeek(selectedWeek);
    setSelectedWeek(prev);
  };

  const handleNextWeek = () => {
    const next = nextWeek(selectedWeek);
    if (next) {
      setSelectedWeek(next);
    }
  };

  const isCurrentWeek = (() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayWeekStart = (() => {
      const d = new Date(today);
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      d.setDate(d.getDate() + diff);
      return d.toISOString().slice(0, 10);
    })();
    const selWeekStart = (() => {
      const d = new Date(selectedWeek);
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      d.setDate(d.getDate() + diff);
      return d.toISOString().slice(0, 10);
    })();
    return selWeekStart >= todayWeekStart;
  })();

  if (!hydrated) {
    return <PageHero eyebrow={baseT("nav.dashboard")} title={greeting} />;
  }

  if (records.length === 0) {
    return (
      <>
        <PageHero eyebrow={baseT("nav.dashboard")} title={greeting} />
        <section className="px-5 pb-20">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* CBT-I Program progress — shown even before sleep records exist */}
            <ProgramDashboardCard />

            <div className="mx-auto max-w-xl glass-strong rounded-3xl p-8 text-center animate-fade-up">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h2 className="font-display text-2xl text-gradient">{t("dash.chart.empty")}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{t("dash.empty.body")}</p>
              <SafeLink
                to={`${langPrefix}/diary`}
                className="mt-6 inline-flex rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
              >
                {t("dash.empty.cta")}
              </SafeLink>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Brain metrics
  const avgLatency = latest ? latest.sleepLatency : null;
  const brainExplanation = buildBrainExplanation(trend, t);

  return (
    <>
      <PageHero eyebrow={baseT("nav.dashboard")} title={greeting} />
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* SECTION 1 — Today's Recommendation (top, large, primary accent) */}
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-primary/25 via-accent/15 to-transparent p-6 md:p-8 animate-fade-up shadow-[0_0_60px_-20px_oklch(0.72_0.13_280/60%)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                {t("dash.today")}
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <PlanTile icon={Moon} label={t("dash.bedtime")} value={plan.bedtime} highlight />
                <PlanTile icon={Sun} label={t("dash.wake")} value={plan.wakeUpTime} highlight />
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
                      <Wind className="h-4 w-4 text-accent" />
                    </span>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {t("dash.avoidScreens", { time: screenCutoff })}
                    </div>
                  </div>
                </div>
              </div>
              <SafeLink
                to={`${langPrefix}/relax`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
              >
                <Wind className="h-4 w-4" />
                {t("dash.startWindDown")}
              </SafeLink>
            </div>
          </div>

          {/* SECTION 2 — True CBT-I Brain */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-accent" />
              {t("dash.brain.title")}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <BrainMetric
                label={t("dash.brain.efficiency")}
                value={weeklyAvg !== null ? `${weeklyAvg}%` : "—"}
              />
              <BrainMetric
                label={t("dash.brain.latency")}
                value={avgLatency !== null ? t("dash.latency.value", { n: avgLatency }) : "—"}
              />
              <BrainMetric
                label={t("dash.brain.trend")}
                value={
                  trend === null
                    ? t("trend.flat")
                    : trend > 0
                      ? t("trend.up", { n: Math.abs(trend) })
                      : trend < 0
                        ? t("trend.down", { n: Math.abs(trend) })
                        : t("trend.flat")
                }
              />
            </div>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-foreground/90">
              {brainExplanation}
            </p>
          </div>

          {/* SECTION 2b — CBT-I Program Progress */}
          <ProgramDashboardCard />

          {/* SECTION 3 — Last 7 Days Trend */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("dash.last7")}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{t("dash.last7Subtitle")}</div>
            {chartData.length > 0 && chartData.some((item) => item.efficiency !== null) ? (
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                    <CartesianGrid stroke="oklch(1 0 0 / 8%)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke="oklch(0.78 0.03 270)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="oklch(0.78 0.03 270)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.22 0.045 270)",
                        border: "1px solid oklch(1 0 0 / 10%)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number | string) => [`${value}%`, t("sleep.efficiency")]}
                    />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="oklch(0.78 0.12 285)"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "oklch(0.78 0.12 285)" }}
                      activeDot={{ r: 6 }}
                      connectNulls
                      isAnimationActive={!reduceMotion}
                      animationDuration={900}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="mt-4 flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5">
                <p className="text-sm text-muted-foreground">{t("dash.chart.empty")}</p>
              </div>
            )}
          </div>

          {/* SECTION 4 — Weekly Insight */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-accent" />
              {t("dash.insight")}
            </div>
            <p className="mt-3 text-base leading-relaxed text-foreground/90">
              {getWeeklyInsight(sortedRecords, trend, t)}
            </p>
          </div>

          {/* SECTION 5 — Streak */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-accent" />
              {t("dash.streak")}
            </div>
            <div className="mt-4 flex items-end gap-2">
              <span className="font-display text-5xl text-gradient">{streak}</span>
              <span className="pb-1 text-sm text-muted-foreground">{t("dash.streak.days")}</span>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-4">
              {[3, 7, 14, 30].map((days) => (
                <div
                  key={days}
                  className={`rounded-2xl border px-3 py-3 text-center ${streak >= days ? "border-accent/40 bg-accent/10" : "border-white/10 bg-white/5"}`}
                >
                  <div className="text-sm font-medium">{days}d</div>
                  <div className="text-xs text-muted-foreground">
                    {streak >= days ? t("dash.streak.achieved") : t("dash.streak.target")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =============================================
              PHASE F — BEHAVIOR ANALYTICS & INSIGHTS
              ============================================= */}

          {/* SECTION F1 — Analytics Overview with Trend Chart */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <BarChart3 className="h-3.5 w-3.5 text-accent" />
                {baseT("dashboard.analytics.title")}
              </div>
              <TrendRangeSelector
                value={analyticsWindow}
                onChange={setAnalyticsWindow}
                labels={{
                  "7d": baseT("analytics.window.7d"),
                  "14d": baseT("analytics.window.14d"),
                  "30d": baseT("analytics.window.30d"),
                  "90d": baseT("analytics.window.90d"),
                  thisWeek: baseT("analytics.window.thisWeek"),
                  lastWeek: baseT("analytics.window.lastWeek"),
                  thisMonth: baseT("analytics.window.thisMonth"),
                  lastMonth: baseT("analytics.window.lastMonth"),
                }}
              />
            </div>

            {/* Data sufficiency banner */}
            {analyticsHydrated && analytics.dataSufficiency !== "sufficient" && (
              <div className="mt-4">
                <DataSufficiencyBanner
                  sufficiency={analytics.dataSufficiency}
                  recordCount={analytics.records.length}
                  periodDays={30}
                  t={baseT}
                />
              </div>
            )}

            {/* Metrics grid */}
            {analyticsHydrated && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MetricMini
                  label={baseT("analytics.metric.efficiency")}
                  value={
                    analytics.metrics.sleepEfficiency !== null
                      ? `${analytics.metrics.sleepEfficiency}%`
                      : "—"
                  }
                />
                <MetricMini
                  label={baseT("analytics.metric.totalSleepTime")}
                  value={
                    analytics.metrics.totalSleepTime !== null
                      ? formatMinutes(analytics.metrics.totalSleepTime as number)
                      : "—"
                  }
                />
                <MetricMini
                  label={baseT("analytics.metric.sleepOnsetLatency")}
                  value={
                    analytics.metrics.sleepOnsetLatency !== null
                      ? `${analytics.metrics.sleepOnsetLatency}m`
                      : "—"
                  }
                />
                <MetricMini
                  label={baseT("analytics.metric.sleepRegularity")}
                  value={
                    analytics.metrics.sleepRegularity !== null
                      ? `${analytics.metrics.sleepRegularity}/100`
                      : "—"
                  }
                />
              </div>
            )}

            {/* Sleep chart */}
            {analyticsHydrated && analytics.records.length > 0 && (
              <div className="mt-5">
                <SleepChart records={analytics.records} window={analyticsWindow} t={baseT} />
              </div>
            )}
          </div>

          {/* SECTION F2 — Insights */}
          {analyticsHydrated && (
            <InsightSection insights={analytics.insights.slice(0, 4)} t={baseT} />
          )}

          {/* SECTION F3 — Weekly Summary + Weekly Focus (side by side on large screens) */}
          {analyticsHydrated && (
            <div className="grid gap-6 lg:grid-cols-2">
              <WeeklySummaryCard
                summary={analytics.weeklySummary}
                t={baseT}
                canGoPrev={true}
                canGoNext={!isCurrentWeek}
                onPrevWeek={handlePrevWeek}
                onNextWeek={handleNextWeek}
              />
              <WeeklyFocusCard
                focus={analytics.weeklyFocus}
                t={baseT}
                userAction={focusAction as FocusUserAction | undefined}
                onAccept={handleFocusAccept}
                onDismiss={handleFocusDismiss}
                onSave={handleFocusSave}
              />
            </div>
          )}

          {/* SECTION F4 — Weekly Reflection */}
          {analyticsHydrated && analytics.records.length >= 3 && (
            <WeeklyReflectionFlow
              records={sortedRecords}
              habitProgress={habitProgress}
              weekDate={selectedWeek}
              t={baseT}
              locale={lang}
            />
          )}

          {/* =============================================
              END PHASE F
              ============================================= */}

          {/* SECTION 6 — Habit Reminders */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <Bell className="h-3.5 w-3.5 text-accent" />
                Habit Reminders
              </div>
              {activeRemindersCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {activeRemindersCount} active reminder{activeRemindersCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {activeRemindersCount === 0 ? (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No active reminders yet. Set up gentle reminders to build consistent sleep habits.
                </p>
                <SafeLink
                  to={`${langPrefix}/reminders`}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
                >
                  <Bell className="h-4 w-4" />
                  Set Up Reminders
                </SafeLink>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {Array.from(habitProgress.values())
                  .slice(0, 3)
                  .map((progress: HabitProgress) => {
                    const reminder = reminders.find((r) => r.id === progress.reminderId);
                    if (!reminder) return null;
                    return (
                      <div
                        key={progress.reminderId}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                            <Bell className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <div className="font-medium">{reminder.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {progress.currentStreak} day streak · {progress.consistencyRate}%
                              consistency
                            </div>
                          </div>
                        </div>
                        <Flame className="h-5 w-5 text-orange-400" />
                      </div>
                    );
                  })}
                <SafeLink
                  to={`${langPrefix}/reminders`}
                  className="mt-2 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-3 text-sm transition hover:border-white/20 hover:bg-white/10"
                >
                  View All Reminders
                  <ArrowRight className="h-4 w-4" />
                </SafeLink>
              </div>
            )}
          </div>

          {/* Share CTA */}
          <DashboardShareCard efficiency={weeklyAvg} streak={streak} />
        </div>
      </section>
    </>
  );
}

function PlanTile({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof Moon;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${highlight ? "border-accent/30 bg-white/10" : "border-white/10 bg-white/5"}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
          <Icon className="h-4 w-4 text-accent" />
        </span>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
      <div className="mt-2 font-display text-4xl text-gradient">{value}</div>
    </div>
  );
}

function BrainMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl text-gradient">{value}</div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }: { to: string; icon: typeof Moon; label: string }) {
  return (
    <SafeLink
      to={to}
      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/10"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30">
        <Icon className="h-4 w-4 text-accent" />
      </span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </SafeLink>
  );
}

function shiftClock(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = (((h * 60 + m + minutes) % (24 * 60)) + 24 * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function buildBrainExplanation(
  trend: number | null,
  t: (key: string, vars?: Record<string, string | number>) => string,
) {
  if (trend === null) return t("dash.brain.collecting");
  return `${t("dash.brain.improved")} ${t("dash.brain.maintain")}`;
}

function getWeeklyInsight(
  records: SleepRecord[],
  trend: number | null,
  t: (key: string, vars?: Record<string, string | number>) => string,
) {
  if (records.length === 0) return t("dash.chart.empty");
  if (trend === null) return t("insight.collecting");
  if (trend >= 3) return t("insight.improving", { n: trend });
  if (trend <= -3) return t("insight.declining", { n: Math.abs(trend) });
  return t("insight.steady");
}

/** CBT-I Program progress card — shows current week, current lesson, completion %, and a CTA. */
function formatMinutes(min: number | string | null): string {
  if (min === null || min === undefined) return "—";
  const n = typeof min === "string" ? parseInt(min, 10) : min;
  if (isNaN(n)) return "—";
  const h = Math.floor(n / 60);
  const m = n % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function MetricMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg text-gradient">{value}</div>
    </div>
  );
}
