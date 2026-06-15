import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useSleepI18n } from "@/lib/sleep-i18n";
import { PageHero } from "@/components/PageHero";
import { Moon, Sun, Wind, Flame, Sparkles, Compass, MessageCircleHeart, Trophy, BedDouble } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  loadRecords,
  last7Days,
  weeklyAverageEfficiency,
  currentStreak,
  efficiencyTrend,
  tonightPlan,
  scoreTier,
  efficiencyTier,
  efficiencyColor,
  type SleepRecord,
} from "@/lib/sleep-records";
import {
  recommend,
  sleepWindow,
  coachMessageKey,
  achievements,
} from "@/lib/cbti-brain";

export const Route = createFileRoute("/dashboard")({
  component: Dash,
  head: () => ({
    meta: [
      { title: "Tonight's Sleep Plan — somna" },
      { name: "description", content: "Your gentle sleep dashboard." },
    ],
  }),
});

function Dash() {
  const { t } = useI18n();
  const { t: ts } = useSleepI18n();
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRecords(loadRecords());
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <PageHero eyebrow="TONIGHT" title={t("dash.title")} />;
  }

  if (records.length === 0) {
    return (
      <>
        <PageHero eyebrow="TONIGHT" title={t("dash.title")} />
        <section className="px-5 pb-20">
          <div className="mx-auto max-w-xl glass-strong rounded-3xl p-8 text-center animate-fade-up">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h2 className="font-display text-2xl text-gradient">{ts("dash.empty.title")}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{ts("dash.empty.body")}</p>
            <Link
              to="/diary"
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
            >
              {ts("dash.empty.cta")}
            </Link>
          </div>
        </section>
      </>
    );
  }

  const plan = tonightPlan(records);
  const last = records[records.length - 1];
  const weeklyAvg = weeklyAverageEfficiency(records);
  const streak = currentStreak(records);
  const trend = efficiencyTrend(records);
  const rec = recommend(records);
  const win = sleepWindow(records);
  const coach = coachMessageKey(records);
  const ach = achievements(streak);
  const chartData = last7Days(records).map((d) => ({
    day: d.date.slice(5),
    efficiency: d.efficiency,
  }));

  return (
    <>
      <PageHero eyebrow="TONIGHT" title={t("dash.title")} />
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-5xl space-y-6">
          <NextStepCard rec={rec} />

          <TodayPlanCard plan={plan} />

          <div className="grid gap-5 md:grid-cols-2">
            <SleepWindowCard win={win} />
            <CoachCard coach={coach} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <LastNightCard record={last} trend={trend} weeklyAvg={weeklyAvg} />
            <SleepScoreCard score={last.sleepScore} />
          </div>

          <ChartCard data={chartData} />

          <div className="grid gap-5 md:grid-cols-2">
            <InsightCard records={records} trend={trend} />
            <AchievementsCard streak={streak} items={ach} />
          </div>
        </div>
      </section>
    </>
  );
}

function NextStepCard({ rec }: { rec: ReturnType<typeof recommend> }) {
  const { t } = useSleepI18n();
  const vars = rec.efficiency !== null ? { n: rec.efficiency } : undefined;
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent p-6 md:p-8 animate-fade-up">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
        <Compass className="h-3.5 w-3.5" />
        {t("cbti.nextStep")}
      </div>
      <h2 className="mt-3 font-display text-2xl text-foreground/95 md:text-3xl">
        {t(rec.titleKey)}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {t(rec.reasonKey, vars)}
      </p>
    </div>
  );
}

function SleepWindowCard({ win }: { win: ReturnType<typeof sleepWindow> }) {
  const { t } = useSleepI18n();
  const hours = Math.floor(win.timeInBedMinutes / 60);
  const mins = win.timeInBedMinutes % 60;
  const adjLabel =
    win.adjustmentMinutes > 0
      ? t("cbti.window.adjust.expand", { n: win.adjustmentMinutes })
      : t("cbti.window.adjust.hold");
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <BedDouble className="h-3.5 w-3.5" />
        {t("cbti.window.title")}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("dash.bedtime")}</div>
          <div className="mt-1 font-display text-2xl text-gradient">{win.bedtime}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("dash.wake")}</div>
          <div className="mt-1 font-display text-2xl text-gradient">{win.wakeUpTime}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t("cbti.window.tib")}</span>
        <span className="font-medium">{hours}h {String(mins).padStart(2, "0")}m</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t("cbti.window.adjust")}</span>
        <span className="font-medium text-accent">{adjLabel}</span>
      </div>
    </div>
  );
}

function CoachCard({ coach }: { coach: { key: string; vars?: Record<string, string | number> } }) {
  const { t } = useSleepI18n();
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <MessageCircleHeart className="h-3.5 w-3.5" />
        {t("cbti.coach.title")}
      </div>
      <p className="mt-4 text-base leading-relaxed text-foreground/90">
        {t(coach.key, coach.vars)}
      </p>
    </div>
  );
}

function AchievementsCard({
  streak,
  items,
}: {
  streak: number;
  items: ReturnType<typeof achievements>;
}) {
  const { t } = useSleepI18n();
  const upcoming = items.find((a) => !a.unlocked);
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Trophy className="h-3.5 w-3.5" />
        {t("cbti.ach.title")}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Flame className={`h-7 w-7 ${streak > 0 ? "text-accent" : "text-muted-foreground/40"}`} />
        <div>
          <span className="font-display text-4xl text-gradient">{streak}</span>
          <span className="ml-2 text-sm text-muted-foreground">{t("dash.streak.days")}</span>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-5 gap-2">
        {items.map((a) => (
          <div
            key={a.days}
            className={`rounded-2xl border px-1 py-3 text-center transition ${
              a.unlocked
                ? "border-accent/40 bg-accent/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <div
              className={`text-base font-medium ${
                a.unlocked ? "text-gradient font-display" : "text-muted-foreground"
              }`}
            >
              {a.days}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
              {t("dash.streak.days")}
            </div>
          </div>
        ))}
      </div>
      {upcoming && (
        <p className="mt-3 text-xs text-muted-foreground">
          {t("cbti.ach.next", { n: Math.max(0, upcoming.days - streak) })}
        </p>
      )}
    </div>
  );
}

function TodayPlanCard({ plan }: { plan: { bedtime: string; wakeUpTime: string } }) {
  const { t } = useSleepI18n();
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="text-xs uppercase tracking-[0.2em] text-accent">{t("dash.today")}</div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <PlanTile icon={Moon} label={t("dash.bedtime")} value={plan.bedtime} />
        <PlanTile icon={Sun} label={t("dash.wake")} value={plan.wakeUpTime} />
      </div>
      <p className="mt-5 text-sm text-muted-foreground">· {t("dash.avoidScreens")}</p>
      <Link
        to="/relax"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
      >
        <Wind className="h-4 w-4" />
        {t("dash.startWindDown")}
      </Link>
    </div>
  );
}

function PlanTile({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
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

function LastNightCard({
  record,
  trend,
  weeklyAvg,
}: {
  record: SleepRecord;
  trend: number | null;
  weeklyAvg: number | null;
}) {
  const { t } = useSleepI18n();
  const tier = efficiencyTier(record.sleepEfficiency);
  const color = efficiencyColor(tier);
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("dash.lastNight")}</div>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-display text-5xl" style={{ color }}>{record.sleepEfficiency}%</span>
        <span className="text-xs text-muted-foreground">{t("sleep.efficiency")}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full transition-all" style={{ width: `${record.sleepEfficiency}%`, background: color }} />
      </div>
      <div className="mt-5 flex items-center justify-between text-sm">
        <div>
          <div className="text-muted-foreground">{t("dash.trend")}</div>
          <div className="mt-1 font-medium">
            {trend === null
              ? t("trend.flat")
              : trend > 0
                ? t("trend.up", { n: Math.abs(trend) })
                : trend < 0
                  ? t("trend.down", { n: Math.abs(trend) })
                  : t("trend.flat")}
          </div>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground">{t("dash.weeklyAvg")}</div>
          <div className="mt-1 font-medium">{weeklyAvg !== null ? `${weeklyAvg}%` : "—"}</div>
        </div>
      </div>
    </div>
  );
}

function SleepScoreCard({ score }: { score: number }) {
  const { t } = useSleepI18n();
  const tier = scoreTier(score);
  const color =
    tier === "good" ? "oklch(0.78 0.16 150)" : tier === "fair" ? "oklch(0.85 0.13 90)" : "oklch(0.74 0.16 55)";
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("sleep.score")}</div>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-display text-6xl" style={{ color }}>{score}</span>
        <span className="text-sm text-muted-foreground">/ 100</span>
      </div>
      <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium" style={{ color }}>
        {t(`sleep.score.${tier}`)}
      </div>
    </div>
  );
}

function ChartCard({ data }: { data: { day: string; efficiency: number | null }[] }) {
  const { t } = useSleepI18n();
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("dash.last7")}</div>
      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="oklch(1 0 0 / 8%)" vertical={false} />
            <XAxis dataKey="day" stroke="oklch(0.78 0.03 270)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} stroke="oklch(0.78 0.03 270)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "oklch(0.22 0.045 270)",
                border: "1px solid oklch(1 0 0 / 10%)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "oklch(0.78 0.03 270)" }}
              formatter={(v: any) => [v === null ? "—" : `${v}%`, t("sleep.efficiency")]}
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
    </div>
  );
}

function InsightCard({ records, trend }: { records: SleepRecord[]; trend: number | null }) {
  const { t } = useSleepI18n();
  let message: string;
  if (records.length === 1) message = t("insight.firstEntry");
  else if (records.length < 4) message = t("insight.collecting");
  else if (trend === null) message = t("insight.collecting");
  else if (trend >= 3) message = t("insight.improving", { n: trend });
  else if (trend <= -3) message = t("insight.declining", { n: Math.abs(trend) });
  else message = t("insight.steady");

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("dash.insight")}</div>
      <p className="mt-3 text-base leading-relaxed">{message}</p>
    </div>
  );
}


