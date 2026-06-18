import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useSleepI18n } from "@/lib/sleep-i18n";
import { PageHero } from "@/components/PageHero";
import {
  computeEfficiency,
  computeScore,
  efficiencyTier,
  efficiencyColor,
  saveRecord,
  todayISO,
  type SleepRecord,
} from "@/lib/sleep-records";

export const Route = createFileRoute("/diary")({
  component: DiaryPage,
  head: () => ({
    meta: [
      { title: "Sleep Diary — somna" },
      { name: "description", content: "Gentle, judgment-free sleep tracking." },
    ],
  }),
});

const moods = ["😴", "🙂", "😐", "😟", "😩"];

function DiaryPage() {
  const { t } = useI18n();
  const { t: ts } = useSleepI18n();
  const [bed, setBed] = useState("23:00");
  const [fall, setFall] = useState(20);
  const [wakes, setWakes] = useState(1);
  const [wake, setWake] = useState("07:00");
  const [quality, setQuality] = useState(4);
  const [mood, setMood] = useState(4);
  const [feedback, setFeedback] = useState<SleepRecord | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const efficiency = computeEfficiency({
      bedtime: bed,
      wakeUpTime: wake,
      sleepLatency: fall,
      nightAwakenings: wakes,
    });
    const score = computeScore({
      sleepEfficiency: efficiency,
      sleepQuality: quality,
      mood,
    });
    const record: SleepRecord = {
      date: todayISO(),
      bedtime: bed,
      sleepLatency: fall,
      nightAwakenings: wakes,
      wakeUpTime: wake,
      sleepQuality: quality,
      mood,
      sleepEfficiency: efficiency,
      sleepScore: score,
    };
    saveRecord(record);
    setFeedback(record);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageHero eyebrow="DIARY" title={t("diary.title")} sub={t("diary.sub")} />
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-xl space-y-6">
          <form onSubmit={onSubmit} className="glass-strong space-y-5 rounded-3xl p-6 md:p-8">
            <Field label={t("diary.bedtime")}>
              <input type="time" value={bed} onChange={(e) => setBed(e.target.value)} className={inputCls} />
            </Field>
            <Field label={t("diary.fall")}>
              <input type="number" min={0} value={fall} onChange={(e) => setFall(+e.target.value)} className={inputCls} />
            </Field>
            <Field label={t("diary.wakes")}>
              <input type="number" min={0} value={wakes} onChange={(e) => setWakes(+e.target.value)} className={inputCls} />
            </Field>
            <Field label={t("diary.wake")}>
              <input type="time" value={wake} onChange={(e) => setWake(e.target.value)} className={inputCls} />
            </Field>
            <Field label={`${t("diary.quality")}: ${quality}/5`}>
              <input type="range" min={1} max={5} value={quality} onChange={(e) => setQuality(+e.target.value)} className="w-full accent-[oklch(0.78_0.12_285)]" />
            </Field>
            <Field label={t("diary.mood")}>
              <div className="flex justify-between gap-2">
                {moods.map((m, i) => (
                  <button type="button" key={i} onClick={() => setMood(i + 1)}
                    className={`flex-1 rounded-2xl border py-3 text-2xl transition ${mood === i + 1 ? "border-accent bg-accent/15" : "border-white/10 bg-white/5"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </Field>

            <button type="submit" className="w-full rounded-full bg-gradient-to-r from-primary to-accent py-3.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.01]">
              {t("diary.save")}
            </button>
          </form>

          {feedback && (
            <div className="space-y-4">
              <FeedbackCard record={feedback} />
              <Link to="/dashboard" className="block rounded-full border border-white/15 bg-white/5 px-5 py-3 text-center text-sm transition hover:border-white/25 hover:bg-white/10">
                {t("diary.cta.dashboard")}
              </Link>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground">{ts("diary.feedback.note")}</p>
        </div>
      </section>
    </>
  );
}

function FeedbackCard({ record }: { record: SleepRecord }) {
  const { t } = useSleepI18n();
  const tier = efficiencyTier(record.sleepEfficiency);
  const color = efficiencyColor(tier);
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {t("sleep.efficiency")}
      </div>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-display text-6xl" style={{ color }}>
          {record.sleepEfficiency}%
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${record.sleepEfficiency}%`, background: color }}
        />
      </div>
      <p className="mt-4 font-medium" style={{ color }}>{t(`sleep.fb.title.${tier}`)}</p>
      <p className="mt-1 text-sm text-muted-foreground">{t(`sleep.fb.body.${tier}`)}</p>
    </div>
  );
}

const inputCls = "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
