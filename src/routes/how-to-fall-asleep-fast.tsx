import { createFileRoute } from "@tanstack/react-router";
import { CbtiArticleShell, cbtiHead } from "@/components/cbti/CbtiArticleShell";
import { useState } from "react";
import { Check } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";
import { getCbtiDict } from "@/lib/cbti-i18n";

export const Route = createFileRoute("/how-to-fall-asleep-fast")({
  component: FallAsleepFastPage,
  head: () => cbtiHead("how-to-fall-asleep-fast"),
});

const checklist: Partial<Record<Lang, string[]>> = {
  en: [
    "Dim the lights",
    "Stop screens 60 min before bed",
    "Cool the bedroom",
    "Skip late caffeine and alcohol",
    "Avoid clock-watching",
    "Slow your breathing",
    "Go to bed only when sleepy",
  ],
  zh: [
    "调暗灯光",
    "睡前 60 分钟停止使用屏幕",
    "保持卧室凉爽",
    "避免深夜咖啡因和酒精",
    "不要盯着时钟",
    "放慢呼吸",
    "只在感到困倦时上床",
  ],
  es: [
    "Atenúa las luces",
    "Sin pantallas 60 min antes de dormir",
    "Habitación fresca",
    "Evita cafeína y alcohol tardíos",
    "No mires el reloj",
    "Respira más lento",
    "Acuéstate solo con sueño",
  ],
};

const headingByLang: Partial<Record<Lang, string>> = {
  en: "Fall-Asleep Checklist",
  zh: "入睡清单",
  es: "Lista para dormirse",
};

export function FallAsleepFastPage() {
  const { lang } = useI18n();
  const article = getCbtiDict(lang).articles["how-to-fall-asleep-fast"];
  const items = checklist[lang] ?? checklist.en!;
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <CbtiArticleShell slug="how-to-fall-asleep-fast" article={article}>
      <div className="glass-strong rounded-3xl p-6 md:p-8">
        <h3 className="font-display text-xl text-foreground">{headingByLang[lang]}</h3>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {items.map((it, i) => {
            const on = checked.has(i);
            return (
              <li key={i}>
                <button
                  onClick={() => toggle(i)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    on
                      ? "border-accent bg-gradient-to-r from-primary/20 to-accent/20 text-foreground"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      on ? "border-accent bg-accent text-primary-foreground" : "border-white/20"
                    }`}
                  >
                    {on && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span>{it}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </CbtiArticleShell>
  );
}
