import { createFileRoute } from "@tanstack/react-router";
import { CbtiArticleShell, cbtiHead } from "@/components/cbti/CbtiArticleShell";
import { useI18n, type Lang } from "@/lib/i18n";
import { getCbtiDict } from "@/lib/cbti-i18n";

export const Route = createFileRoute("/cbt-i-guide")({
  component: CbtIGuidePage,
  head: () => cbtiHead("cbt-i-guide"),
});

const weekLabels: Record<Lang, string[]> = {
  en: ["Week 1–2", "Week 3–4", "Week 5–6", "Week 7–8"],
  zh: ["第 1–2 周", "第 3–4 周", "第 5–6 周", "第 7–8 周"],
  es: ["Semana 1–2", "Semana 3–4", "Semana 5–6", "Semana 7–8"],
};

const weekContent: Record<Lang, { title: string; desc: string }[]> = {
  en: [
    {
      title: "Baseline & Sleep Window",
      desc: "Start a sleep diary. Set a temporary, restricted time-in-bed window.",
    },
    {
      title: "Stimulus Control",
      desc: "Bed for sleep only. Get up if awake too long. Same wake time daily.",
    },
    {
      title: "Cognitive Work",
      desc: "Notice unhelpful sleep thoughts. Practice gentle reframes and acceptance.",
    },
    {
      title: "Consolidate & Expand",
      desc: "Gradually expand time in bed as sleep efficiency improves. Maintain the wins.",
    },
  ],
  zh: [
    { title: "基线与睡眠窗口", desc: "开始睡眠日记。设置一个暂时性的、受限的卧床时间窗口。" },
    { title: "刺激控制", desc: "床只用于睡眠。清醒过久就起身。每天固定起床时间。" },
    { title: "认知工作", desc: "识别无益的睡眠想法,练习温和的重构与接纳。" },
    { title: "巩固与扩展", desc: "随着睡眠效率提高,逐步扩展卧床时间。维持成果。" },
  ],
  es: [
    {
      title: "Línea base y ventana de sueño",
      desc: "Inicia un diario de sueño. Define una ventana de tiempo en cama restringida temporal.",
    },
    {
      title: "Control de estímulos",
      desc: "La cama solo para dormir. Levántate si llevas mucho despierto. Misma hora de despertar.",
    },
    {
      title: "Trabajo cognitivo",
      desc: "Detecta pensamientos poco útiles. Practica reencuadres suaves y aceptación.",
    },
    {
      title: "Consolidar y expandir",
      desc: "Amplía gradualmente el tiempo en cama según mejora la eficiencia. Mantén los logros.",
    },
  ],
};

const headingByLang: Record<Lang, string> = {
  en: "CBT-I Journey Timeline",
  zh: "CBT-I 旅程时间线",
  es: "Línea de tiempo TCC-I",
};

function CbtIGuidePage() {
  const { lang } = useI18n();
  const article = getCbtiDict(lang).articles["cbt-i-guide"];
  const labels = weekLabels[lang];
  const content = weekContent[lang];

  return (
    <CbtiArticleShell slug="cbt-i-guide" article={article}>
      <div className="glass-strong rounded-3xl p-6 md:p-8">
        <h3 className="font-display text-xl text-foreground">{headingByLang[lang]}</h3>
        <ol className="relative mt-6 space-y-6 border-l border-white/10 pl-6">
          {content.map((c, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <div className="text-xs uppercase tracking-widest text-accent">{labels[i]}</div>
              <div className="mt-1 font-display text-base text-foreground">{c.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </CbtiArticleShell>
  );
}
