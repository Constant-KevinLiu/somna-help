import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { AssessmentShareCard } from "@/components/AssessmentShareCard";

export const Route = createFileRoute("/assessment")({
  component: AssessPage,
  head: () => ({
    meta: [
      { title: "Sleep Assessment — somna" },
      {
        name: "description",
        content: "A short, supportive CBT-I check-in to understand your sleep.",
      },
    ],
  }),
});

type LevelId = 1 | 2 | 3 | 4;

type LevelConfig = {
  id: LevelId;
  /** Soft gradient used for the profile ring + health bar. No red. */
  gradient: string;
  /** Solid accent color for the level badge. */
  color: string;
  /** Glow color for the profile halo. */
  glow: string;
};

const levels: LevelConfig[] = [
  {
    id: 1,
    gradient: "linear-gradient(135deg, #63D39A 0%, #7BE0B0 100%)",
    color: "#63D39A",
    glow: "oklch(0.78 0.14 155 / 45%)",
  },
  {
    id: 2,
    gradient: "linear-gradient(135deg, #7C8CFF 0%, #9BA8FF 100%)",
    color: "#7C8CFF",
    glow: "oklch(0.72 0.13 280 / 45%)",
  },
  {
    id: 3,
    gradient: "linear-gradient(135deg, #FFC978 0%, #FFD9A0 100%)",
    color: "#FFC978",
    glow: "oklch(0.82 0.13 80 / 45%)",
  },
  {
    id: 4,
    gradient: "linear-gradient(135deg, #9FA8FF 0%, #B8BFFF 100%)",
    color: "#9FA8FF",
    glow: "oklch(0.74 0.1 270 / 45%)",
  },
];

function getLevel(score: number): LevelConfig {
  if (score <= 3) return levels[0];
  if (score <= 7) return levels[1];
  if (score <= 11) return levels[2];
  return levels[3];
}

/** Health bar fills from left; higher score = lower health. We invert so
 *  healthier profiles show a fuller green/amber bar. */
function healthPercent(score: number, max: number) {
  const remaining = Math.max(0, max - score);
  return Math.round((remaining / max) * 100);
}

const questions = [
  {
    key: "assess.q1",
    options: [
      { en: "Under 15 min", zh: "少于 15 分钟", es: "Menos de 15 min", pt: "Menos de 15 min", score: 0 },
      { en: "15–30 min", zh: "15–30 分钟", es: "15–30 min", pt: "15–30 min", score: 1 },
      { en: "30–60 min", zh: "30–60 分钟", es: "30–60 min", pt: "30–60 min", score: 2 },
      { en: "Over an hour", zh: "超过一小时", es: "Más de una hora", pt: "Mais de uma hora", score: 3 },
    ],
  },
  {
    key: "assess.q2",
    options: [
      { en: "Rarely", zh: "很少", es: "Rara vez", pt: "Raramente", score: 0 },
      { en: "Once", zh: "1 次", es: "Una vez", pt: "Uma vez", score: 1 },
      { en: "2–3 times", zh: "2–3 次", es: "2–3 veces", pt: "2–3 vezes", score: 2 },
      { en: "Many times", zh: "多次", es: "Muchas veces", pt: "Várias vezes", score: 3 },
    ],
  },
  {
    key: "assess.q3",
    options: [
      { en: "7–9 hours", zh: "7–9 小时", es: "7–9 horas", pt: "7–9 horas", score: 0 },
      { en: "6–7 hours", zh: "6–7 小时", es: "6–7 horas", pt: "6–7 horas", score: 1 },
      { en: "5–6 hours", zh: "5–6 小时", es: "5–6 horas", pt: "5–6 horas", score: 2 },
      { en: "Under 5 hours", zh: "少于 5 小时", es: "Menos de 5 horas", pt: "Menos de 5 horas", score: 3 },
    ],
  },
  {
    key: "assess.q4",
    options: [
      { en: "Calm", zh: "平静", es: "Tranquilo", pt: "Calmo", score: 0 },
      { en: "A little tense", zh: "略有紧张", es: "Algo tenso", pt: "Um pouco tenso", score: 1 },
      { en: "Often anxious", zh: "经常焦虑", es: "A menudo ansioso", pt: "Muitas vezes ansioso", score: 2 },
      { en: "Very anxious", zh: "非常焦虑", es: "Muy ansioso", pt: "Muito ansioso", score: 3 },
    ],
  },
  {
    key: "assess.q5",
    options: [
      { en: "Refreshed", zh: "精神饱满", es: "Descansado", pt: "Descansado", score: 0 },
      { en: "Okay", zh: "还行", es: "Normal", pt: "Mais ou menos", score: 1 },
      { en: "Tired", zh: "疲惫", es: "Cansado", pt: "Cansado", score: 2 },
      { en: "Exhausted", zh: "极度疲惫", es: "Exhausto", pt: "Exausto", score: 3 },
    ],
  },
];

export function AssessPage() {
  const { t, lang } = useI18n();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const total = questions.length;
  const progress = done ? 100 : (step / total) * 100;

  const choose = (score: number) => {
    const next = [...answers];
    next[step] = score;
    setAnswers(next);
    setTimeout(() => {
      if (step + 1 < total) setStep(step + 1);
      else setDone(true);
    }, 250);
  };

  const score = answers.reduce((a, b) => a + (b ?? 0), 0);
  const max = total * 3;
  const level = getLevel(score);
  const levelKey = `assess.level${level.id}` as const;
  const health = healthPercent(score, max);

  return (
    <>
      <PageHero eyebrow={t("nav.assessment")} title={t("assess.title")} sub={t("assess.sub")} />
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-xl">
          <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {!done ? (
            <div key={step} className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {step + 1} / {total}
              </div>
              <h2 className="mt-3 font-display text-2xl md:text-3xl">{t(questions[step].key)}</h2>
              <div className="mt-6 grid gap-3">
                {questions[step].options.map((o, i) => (
                  <button
                    key={i}
                    onClick={() => choose(o.score)}
                    className={`w-full rounded-2xl border px-5 py-4 text-left text-base transition ${
                      answers[step] === o.score
                        ? "border-accent bg-accent/15 text-foreground"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
                    }`}
                  >
                    {lang === "zh"
                      ? o.zh
                      : lang === "es"
                        ? o.es
                        : lang === "pt"
                          ? o.pt
                          : o.en}
                  </button>
                ))}
              </div>
              {answers[step] >= 2 && (
                <p className="mt-5 rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
                  {t("assess.support")}
                </p>
              )}
              <div className="mt-6 flex justify-between">
                <button
                  disabled={step === 0}
                  onClick={() => setStep(Math.max(0, step - 1))}
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground disabled:opacity-30"
                >
                  {t("assess.back")}
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-strong rounded-3xl p-8 text-center animate-fade-up">
              <div className="text-xs uppercase tracking-[0.2em] text-accent">
                {t("assess.result")}
              </div>

              {/* Profile ring — no raw score, only the level name */}
              <div
                className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full"
                style={{
                  background: `radial-gradient(circle, ${level.glow} 0%, transparent 70%)`,
                }}
              >
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full"
                  style={{ background: level.gradient }}
                >
                  <span className="font-display text-2xl text-black/70">L{level.id}</span>
                </div>
              </div>

              <div className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t("assess.level.label")}
              </div>
              <h2 className="mt-2 font-display text-3xl text-gradient">{t(`${levelKey}.name`)}</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
                {t(`${levelKey}.desc`)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{t("assess.result.sub")}</p>

              {/* Sleep Health progress bar — soft gradient, no red */}
              <div className="mx-auto mt-7 max-w-sm text-left">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t("assess.health.label")}</span>
                  <span>{t("assess.health.note")}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${health}%`,
                      background: level.gradient,
                    }}
                  />
                </div>
              </div>

              {/* Stats — Sleep Efficiency · Recommended Program · Program Duration */}
              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                  <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {t("assess.stat.efficiency")}
                  </div>
                  <div className="mt-1.5 font-display text-base" style={{ color: level.color }}>
                    {t(`assess.stat.efficiency.value.l${level.id}`)}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                  <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {t("assess.stat.program")}
                  </div>
                  <div className="mt-1.5 font-display text-base" style={{ color: level.color }}>
                    {t(`assess.stat.program.value.l${level.id}`)}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                  <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {t("assess.stat.duration")}
                  </div>
                  <div className="mt-1.5 font-display text-base" style={{ color: level.color }}>
                    {t(`assess.stat.duration.value.l${level.id}`)}
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  to={lang === "es" ? "/es/program" : lang === "pt" ? "/pt/program" : "/program"}
                  className="rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  {t("assess.cta.program")}
                </Link>
                <Link
                  to={lang === "es" ? "/es/panel" : lang === "pt" ? "/pt/painel" : "/dashboard"}
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm"
                >
                  {t("assess.cta.dashboard")}
                </Link>
              </div>

              <div className="mt-8">
                <AssessmentShareCard
                  efficiencyLabel={t(`assess.stat.efficiency.value.l${level.id}`)}
                  sleepType={t(`${levelKey}.name`)}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
