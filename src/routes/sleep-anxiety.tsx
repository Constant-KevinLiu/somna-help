import { createFileRoute } from "@tanstack/react-router";
import { CbtiArticleShell, cbtiHead } from "@/components/cbti/CbtiArticleShell";
import { useI18n, type Lang } from "@/lib/i18n";
import { getCbtiDict } from "@/lib/cbti-i18n";

export const Route = createFileRoute("/sleep-anxiety")({
  component: SleepAnxietyPage,
  head: () => cbtiHead("sleep-anxiety"),
});

const cycleSteps: Record<Lang, { title: string; desc: string }[]> = {
  en: [
    { title: "Bad night", desc: "Sleep was poor or fragmented." },
    { title: "Worry rises", desc: "\"What if tonight is bad too?\"" },
    { title: "Body activates", desc: "Cortisol up, heart rate up, hard to wind down." },
    { title: "Sleep gets harder", desc: "Next night is worse — confirming the fear." },
  ],
  zh: [
    { title: "糟糕的一晚", desc: "睡得不好或被打断。" },
    { title: "担忧上升", desc: "「今晚会不会又这样?」" },
    { title: "身体被激活", desc: "皮质醇升高、心率加快,难以平静。" },
    { title: "睡眠更难", desc: "下一晚更糟 —— 印证了担忧。" },
  ],
  es: [
    { title: "Mala noche", desc: "Sueño pobre o fragmentado." },
    { title: "Surge la preocupación", desc: "«¿Y si esta noche también?»" },
    { title: "El cuerpo se activa", desc: "Sube cortisol, sube el pulso, cuesta calmarse." },
    { title: "Dormir cuesta más", desc: "La siguiente noche empeora — y confirma el miedo." },
  ],
};

const headingByLang: Record<Lang, string> = {
  en: "The Sleep-Anxiety Cycle",
  zh: "睡眠–焦虑循环",
  es: "El ciclo sueño-ansiedad",
};

function SleepAnxietyPage() {
  const { lang } = useI18n();
  const article = getCbtiDict(lang).articles["sleep-anxiety"];
  const steps = cycleSteps[lang];

  return (
    <CbtiArticleShell slug="sleep-anxiety" article={article}>
      <div className="glass-strong rounded-3xl p-6 md:p-8">
        <h3 className="font-display text-xl text-foreground">{headingByLang[lang]}</h3>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={i} className="relative rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-primary-foreground">
                {i + 1}
              </div>
              <div className="mt-2 font-display text-sm text-foreground">{s.title}</div>
              <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-muted-foreground">↻</p>
      </div>
    </CbtiArticleShell>
  );
}
