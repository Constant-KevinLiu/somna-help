import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useSleepI18n } from "@/lib/sleep-i18n";
import { PageHero } from "@/components/PageHero";
import { Moon, Sun, Wind, Flame, Sparkles } from "lucide-react";
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
  const chartData = last7Days(records).map((d) => ({
    day: d.date.slice(5),
    efficiency: d.efficiency,
  }));

  return (
    <>
      <PageHero eyebrow="TONIGHT" title={t("dash.title")} />
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-5xl space-y-6">
          <TodayPlanCard plan={plan} />

          <div className="grid gap-5 md:grid-cols-2">
            <LastNightCard record={last} trend={trend} weeklyAvg={weeklyAvg} />
            <SleepScoreCard score={last.sleepScore} />
          </div>

          <ChartCard data={chartData} />

          <div className="grid gap-5 md:grid-cols-2">
            <InsightCard records={records} trend={trend} />
            <StreakCard streak={streak} />
          </div>
        </div>
      </section>
    </>
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

function StreakCard({ streak }: { streak: number }) {
  const { t } = useSleepI18n();
  const milestones = [3, 7, 14, 30];
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("dash.streak")}</div>
      <div className="mt-2 flex items-center gap-3">
        <Flame className={`h-8 w-8 ${streak > 0 ? "text-accent" : "text-muted-foreground/50"}`} />
        <div>
          <span className="font-display text-5xl text-gradient">{streak}</span>
          <span className="ml-2 text-sm text-muted-foreground">{t("dash.streak.days")}</span>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {milestones.map((m) => {
          const reached = streak >= m;
          return (
            <div
              key={m}
              className={`rounded-2xl border px-2 py-3 text-center transition ${reached ? "border-accent/40 bg-accent/10" : "border-white/10 bg-white/5"}`}
            >
              <div className={`text-lg font-medium ${reached ? "text-gradient font-display" : "text-muted-foreground"}`}>{m}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("dash.streak.days")}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
