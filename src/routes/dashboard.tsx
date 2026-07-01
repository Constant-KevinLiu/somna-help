import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useSleepI18n } from "@/lib/sleep-i18n";
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
  BookOpen,
  Activity,
  ArrowRight,
  GraduationCap,
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
import { getProgramLessonUI } from "@/lib/program-lessons-i18n";
import { TOTAL_LESSONS } from "@/lib/program-lessons";
import { getWeekByNumber, programWeeks } from "@/lib/program-weeks";
import {
  overallCompletionPercent,
  recommendedNextLesson,
  useProgramProgress,
} from "@/lib/program-progress";

export const Route = createFileRoute("/dashboard")({
  component: Dash,
  head: () => ({
    meta: [
      { title: "Dashboard — somna" },
      { name: "description", content: "Your gentle sleep dashboard." },
    ],
  }),
});

function Dash() {
  const { lang, t: baseT } = useI18n();
  const { t } = useSleepI18n();
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

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
            <ProgramProgressCard />

            <div className="mx-auto max-w-xl glass-strong rounded-3xl p-8 text-center animate-fade-up">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h2 className="font-display text-2xl text-gradient">{t("dash.chart.empty")}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{t("dash.empty.body")}</p>
              <Link
                to="/diary"
                className="mt-6 inline-flex rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
              >
                {t("dash.empty.cta")}
              </Link>
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
              <Link
                to="/relax"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
              >
                <Wind className="h-4 w-4" />
                {t("dash.startWindDown")}
              </Link>
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
          <ProgramProgressCard />

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
                      isAnimationActive
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
                  <div className="flex items-center justify-center gap-1 text-sm font-medium">
                    <Flame
                      className={`h-4 w-4 ${streak >= days ? "text-accent" : "text-muted-foreground"}`}
                    />
                    {days}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t("dash.streak.days")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5b — Share Progress */}
          <DashboardShareCard efficiency={weeklyAvg} streak={streak} />

          {/* SECTION 6 — Quick Actions */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("dash.actions.title")}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <QuickAction to="/diary" icon={Moon} label={t("dash.actions.log")} />
              <QuickAction to="/relax" icon={Wind} label={t("dash.actions.relax")} />
              <QuickAction to="/program" icon={BookOpen} label={t("dash.actions.program")} />
              <QuickAction to="/reminder" icon={Bell} label={t("dash.actions.reminder")} />
            </div>
          </div>
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
function ProgramProgressCard() {
  const { lang } = useI18n();
  const ui = getProgramLessonUI(lang);
  const { progress, hydrated } = useProgramProgress();

  if (!hydrated) {
    return (
      <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5 text-accent" />
          {ui.dashProgramTitle}
        </div>
        <div className="mt-4 h-24 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  const pct = overallCompletionPercent(progress);
  const nextLesson = recommendedNextLesson(progress);
  const isComplete = pct === 100;

  // Current week info
  const weekNumber = nextLesson ? nextLesson.weekNumber : 6;
  const currentWeek = getWeekByNumber(weekNumber);
  const weekLocale = currentWeek ? (currentWeek.i18n[lang] ?? currentWeek.i18n.en) : null;

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <GraduationCap className="h-3.5 w-3.5 text-accent" />
        {ui.dashProgramTitle}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <BrainMetric
          label={ui.dashCurrentWeek}
          value={weekLocale ? `${ui.weekLabel} ${weekNumber}` : "—"}
        />
        <BrainMetric
          label={ui.dashCurrentLesson}
          value={
            nextLesson ? `${ui.lessonLabel} ${nextLesson.lessonNumber}` : ui.dashProgramComplete
          }
        />
        <BrainMetric label={ui.dashCompletion} value={`${pct}%`} />
      </div>

      {/* Progress bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>
            {progress.completedLessons.length} / {TOTAL_LESSONS}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={ui.dashCompletion}
          />
        </div>
      </div>

      {/* Recommended next lesson CTA */}
      {nextLesson ? (
        <Link
          to="/program/$week/$lesson"
          params={{ week: nextLesson.weekSlug, lesson: nextLesson.slug }}
          className="group mt-5 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/[0.07] p-4 transition hover:bg-accent/[0.12]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40">
            <BookOpen className="h-4 w-4 text-foreground" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {ui.dashRecommended}
            </div>
            <div className="mt-0.5 font-display text-base text-foreground">
              {ui.lessonLabel} {nextLesson.lessonNumber}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
            {ui.dashContinueLearning}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      ) : (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-4">
          <GraduationCap className="h-5 w-5 shrink-0 text-success" />
          <p className="text-sm text-foreground/90">{ui.dashProgramComplete}</p>
        </div>
      )}

      {isComplete && <p className="mt-3 text-sm text-muted-foreground">{ui.dashProgramComplete}</p>}
    </div>
  );
}
