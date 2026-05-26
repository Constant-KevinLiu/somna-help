import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Wind, Music, Heart } from "lucide-react";

export const Route = createFileRoute("/relax")({
  component: RelaxPage,
  head: () => ({
    meta: [
      { title: "Relax & Wind Down — somna" },
      { name: "description", content: "Breathing, meditation, and calming nighttime rituals." },
    ],
  }),
});

const phases = [
  { key: "relax.inhale", dur: 4 },
  { key: "relax.hold", dur: 7 },
  { key: "relax.exhale", dur: 8 },
] as const;

function RelaxPage() {
  const { t, lang } = useI18n();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<number>(0);
  const [sec, setSec] = useState<number>(phases[0].dur);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setSec((s) => {
        if (s > 1) return s - 1;
        setPhase((p) => {
          const np = (p + 1) % phases.length;
          setSec(phases[np].dur);
          return np;
        });
        return phases[(phase + 1) % phases.length].dur;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, phase]);

  const scale = phase === 0 ? "scale-110" : phase === 1 ? "scale-110" : "scale-90";

  const sessions = [
    { icon: Wind, en: "Body scan · 8 min", zh: "身体扫描 · 8 分钟" },
    { icon: Heart, en: "Letting go of the day · 10 min", zh: "放下白天 · 10 分钟" },
    { icon: Music, en: "Rain on leaves · 30 min", zh: "雨打树叶 · 30 分钟" },
    { icon: Wind, en: "Soft ocean · 45 min", zh: "海浪轻拍 · 45 分钟" },
    { icon: Heart, en: "Anxiety relief · 12 min", zh: "缓解焦虑 · 12 分钟" },
    { icon: Music, en: "Pink noise · loop", zh: "粉红噪音 · 循环" },
  ];

  return (
    <>
      <PageHero eyebrow="RELAX" title={t("relax.title")} sub={t("relax.sub")} />
      <section className="px-5 pb-12">
        <div className="mx-auto max-w-2xl">
          <div className="glass-strong rounded-3xl p-8 text-center">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">{t("relax.breathe")}</div>
            <p className="mt-2 text-sm text-muted-foreground">{t("relax.breathe.sub")}</p>

            <div className="relative mx-auto my-10 flex h-72 w-72 items-center justify-center">
              <div className="absolute h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
              <div className={`relative flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40 transition-transform duration-[1500ms] ease-in-out ${running ? scale : ""}`}>
                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full glass-strong">
                  <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t(phases[phase].key)}</div>
                  <div className="mt-1 font-display text-5xl">{sec}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setRunning(!running); setPhase(0); setSec(phases[0].dur); }}
              className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              {running ? t("relax.stop") : t("relax.start")}
            </button>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-5 transition hover:-translate-y-1 hover:bg-white/[0.06]">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                <s.icon className="h-4 w-4 text-accent" />
              </div>
              <div className="text-sm">{lang === "zh" ? s.zh : s.en}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
