import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/assessment")({
  component: AssessPage,
  head: () => ({
    meta: [
      { title: "Sleep Assessment — somna" },
      { name: "description", content: "A short, supportive CBT-I check-in to understand your sleep." },
    ],
  }),
});

const questions = [
  { key: "assess.q1", options: [
    { en: "Under 15 min", zh: "少于 15 分钟", score: 0 },
    { en: "15–30 min", zh: "15–30 分钟", score: 1 },
    { en: "30–60 min", zh: "30–60 分钟", score: 2 },
    { en: "Over an hour", zh: "超过一小时", score: 3 },
  ]},
  { key: "assess.q2", options: [
    { en: "Rarely", zh: "很少", score: 0 },
    { en: "Once", zh: "1 次", score: 1 },
    { en: "2–3 times", zh: "2–3 次", score: 2 },
    { en: "Many times", zh: "多次", score: 3 },
  ]},
  { key: "assess.q3", options: [
    { en: "7–9 hours", zh: "7–9 小时", score: 0 },
    { en: "6–7 hours", zh: "6–7 小时", score: 1 },
    { en: "5–6 hours", zh: "5–6 小时", score: 2 },
    { en: "Under 5 hours", zh: "少于 5 小时", score: 3 },
  ]},
  { key: "assess.q4", options: [
    { en: "Calm", zh: "平静", score: 0 },
    { en: "A little tense", zh: "略有紧张", score: 1 },
    { en: "Often anxious", zh: "经常焦虑", score: 2 },
    { en: "Very anxious", zh: "非常焦虑", score: 3 },
  ]},
  { key: "assess.q5", options: [
    { en: "Refreshed", zh: "精神饱满", score: 0 },
    { en: "Okay", zh: "还行", score: 1 },
    { en: "Tired", zh: "疲惫", score: 2 },
    { en: "Exhausted", zh: "极度疲惫", score: 3 },
  ]},
];

function AssessPage() {
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
  const profile = score <= 4
    ? { en: "Mostly restful", zh: "大致良好", note_en: "Your sleep is mostly on track. A consistent schedule keeps it that way.", note_zh: "你的睡眠总体良好。保持规律的节律即可。" }
    : score <= 9
    ? { en: "Mild disruption", zh: "轻度困扰", note_en: "Some friction here and there. CBT-I habits will help quickly.", note_zh: "存在一些小困扰,CBT-I 的小习惯能很快带来改善。" }
    : { en: "Notable insomnia signs", zh: "明显的失眠信号", note_en: "This can change. Structured CBT-I is the gentlest, most effective starting point.", note_zh: "这一切是可以改变的。结构化的 CBT-I 是最温柔、有效的起点。" };

  return (
    <>
      <PageHero eyebrow="ASSESSMENT" title={t("assess.title")} sub={t("assess.sub")} />
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-xl">
          <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500" style={{ width: `${progress}%` }} />
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
                    {lang === "zh" ? o.zh : o.en}
                  </button>
                ))}
              </div>
              {answers[step] >= 2 && (
                <p className="mt-5 rounded-xl bg-success/10 px-4 py-3 text-sm text-success">{t("assess.support")}</p>
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
              <div className="text-xs uppercase tracking-[0.2em] text-accent">{t("assess.result")}</div>
              <h2 className="mt-3 font-display text-3xl text-gradient">
                {lang === "zh" ? profile.zh : profile.en}
              </h2>
              <div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30">
                <div className="text-center">
                  <div className="font-display text-3xl">{score}</div>
                  <div className="text-xs text-muted-foreground">/ {max}</div>
                </div>
              </div>
              <p className="mx-auto mt-6 max-w-sm text-sm text-muted-foreground">
                {lang === "zh" ? profile.note_zh : profile.note_en}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{t("assess.result.sub")}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to="/program" className="rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground">{t("cta.start")}</Link>
                <Link to="/dashboard" className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm">{t("nav.dashboard")}</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
