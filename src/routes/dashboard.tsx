import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useSleepI18n } from "@/lib/sleep-i18n";
import { PageHero } from "@/components/PageHero";
import { Flame, Moon, Sparkles, Sun, TrendingUp, Wind } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  currentStreak,
  efficiencyTrend,
  loadRecords,
  tonightPlan,
  type SleepRecord,
  weeklyAverageEfficiency,
} from "@/lib/sleep-records";

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
    console.log("sleepRecords", sleepRecords);
    setRecords(sleepRecords);
    setHydrated(true);
  }, []);

  const sortedRecords = useMemo(() => [...records].sort((a, b) => a.date.localeCompare(b.date)), [records]);
  const plan = tonightPlan(sortedRecords);
  const weeklyAvg = weeklyAverageEfficiency(sortedRecords);
  const streak = currentStreak(sortedRecords);
  const trend = efficiencyTrend(sortedRecords);
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

  const recommendation = buildRecommendation(sortedRecords, lang);
  console.log("chartData", chartData);
  console.log("brainRecommendation", recommendation);
  console.log("dashboard rendered");

  const greeting =
    lang === "zh" ? "晚上好，Kevin" : lang === "es" ? "Buenas noches, Kevin" : "Good evening, Kevin";

  if (!hydrated) {
    return <PageHero eyebrow={baseT("nav.dashboard")} title={greeting} />;
  }

  if (records.length === 0) {
    return (
      <>
        <PageHero eyebrow={baseT("nav.dashboard")} title={greeting} />
        <section className="px-5 pb-20">
          <div className="mx-auto max-w-xl glass-strong rounded-3xl p-8 text-center animate-fade-up">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h2 className="font-display text-2xl text-gradient">{t("dash.chart.empty")}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{t("dash.empty.body")}</p>
            <Link to="/diary" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]">
              {t("dash.empty.cta")}
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow={baseT("nav.dashboard")} title={greeting} />
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">{t("dash.today")}</div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <PlanTile icon={Moon} label={t("dash.bedtime")} value={plan.bedtime} />
              <PlanTile icon={Sun} label={t("dash.wake")} value={plan.wakeUpTime} />
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
                    <Wind className="h-4 w-4 text-accent" />
                  </span>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("dash.avoidScreens")}</div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">60 min</div>
              </div>
            </div>
            <Link to="/relax" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]">
              <Wind className="h-4 w-4" />
              {t("dash.startWindDown")}
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-strong rounded-3xl p-6 md:p-8">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("dash.lastNight")}</div>
              {latest && (
                <>
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <div>
                      <div className="font-display text-5xl text-gradient">{latest.sleepEfficiency}%</div>
                      <div className="mt-1 text-sm text-muted-foreground">{t("sleep.efficiency")}</div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{t("dash.trend")}</div>
                      <div className="mt-1 font-medium text-foreground">
                        {trend === null ? t("trend.flat") : trend > 0 ? t("trend.up", { n: Math.abs(trend) }) : trend < 0 ? t("trend.down", { n: Math.abs(trend) }) : t("trend.flat")}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="glass-strong rounded-3xl p-6 md:p-8">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("dash.insight")}</div>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">{getWeeklyInsight(sortedRecords, trend, t)}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="glass-strong rounded-3xl p-6 md:p-8">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("dash.last7")}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t("dash.last7Subtitle")}</div>
              {chartData.length > 0 && chartData.some((item) => item.efficiency !== null) ? (
                <div className="mt-4 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                      <CartesianGrid stroke="oklch(1 0 0 / 8%)" vertical={false} />
                      <XAxis dataKey="label" stroke="oklch(0.78 0.03 270)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} stroke="oklch(0.78 0.03 270)" fontSize={11} tickLine={false} axisLine={false} />
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
            <div className="glass-strong rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <Flame className="h-3.5 w-3.5 text-accent" />
                {t("dash.streak")}
              </div>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-5xl text-gradient">{streak}</span>
                <span className="pb-1 text-sm text-muted-foreground">{t("dash.streak.days")}</span>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {[3, 7, 14, 30].map((days) => (
                  <div key={days} className={`rounded-2xl border px-3 py-3 text-center ${streak >= days ? "border-accent/40 bg-accent/10" : "border-white/10 bg-white/5"}`}>
                    <div className="flex items-center justify-center gap-1 text-sm font-medium">
                      <Flame className={`h-4 w-4 ${streak >= days ? "text-accent" : "text-muted-foreground"}`} />
                      {days}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{t("dash.streak.days")}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("dash.recommendation.label")}</div>
            <div className="mt-3 flex items-center gap-2 text-sm text-accent">
              <TrendingUp className="h-4 w-4" />
              {t("dash.recommendation.title")}
            </div>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground/90">{recommendation}</p>
          </div>
        </div>
      </section>
    </>
  );
}

function PlanTile({ icon: Icon, label, value }: { icon: typeof Moon; label: string; value: string }) {
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

function getWeeklyInsight(records: SleepRecord[], trend: number | null, t: (key: string) => string) {
  if (records.length === 0) return t("dash.chart.empty");
  if (trend === null) return t("insight.collecting");
  if (trend >= 3) return t("insight.improving", { n: trend });
  if (trend <= -3) return t("insight.declining", { n: Math.abs(trend) });
  return t("insight.steady");
}

function buildRecommendation(records: SleepRecord[], lang: "en" | "zh" | "es") {
  if (records.length === 0) {
    return lang === "zh" ? "先记录几晚睡眠，再给你一个更贴合的建议。" : lang === "es" ? "Registra unas noches primero para recibir una recomendación más precisa." : "Log a few nights first so we can give a more precise recommendation.";
  }

  const latest = records[records.length - 1];
  const averageEfficiency = Math.round(records.reduce((sum, record) => sum + record.sleepEfficiency, 0) / records.length);

  if (lang === "zh") {
    if (latest.sleepLatency > 30 || latest.nightAwakenings > 2) {
      return "你的入睡时间偏长，夜间醒来次数也略多。建议先固定起床时间，并把睡前放松流程坚持下来。";
    }
    if (averageEfficiency >= 85) {
      return "你的睡眠效率正在改善。建议继续保持固定起床时间。";
    }
    return "建议把睡前屏幕时间缩短，并尽量在相同时间上床。";
  }

  if (lang === "es") {
    if (latest.sleepLatency > 30 || latest.nightAwakenings > 2) {
      return "Tu tiempo para quedarte dormido es más alto y te despiertas más veces durante la noche. Mantén una hora fija para despertarte y sigue una rutina tranquila antes de dormir.";
    }
    if (averageEfficiency >= 85) {
      return "Tu eficiencia del sueño está mejorando. Mantén una hora fija para despertarte.";
    }
    return "Intenta reducir el uso de pantallas antes de dormir y acostarte a horas parecidas.";
  }

  if (latest.sleepLatency > 30 || latest.nightAwakenings > 2) {
    return "Your sleep latency is a bit high and night awakenings are frequent. Keep a consistent wake-up time and follow a calm wind-down routine.";
  }
  if (averageEfficiency >= 85) {
    return "Your sleep efficiency is improving. Keep a consistent wake-up time.";
  }
  return "Try reducing screen time before bed and keeping your bedtime routine consistent.";
}


