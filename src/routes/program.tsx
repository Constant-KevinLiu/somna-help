import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/program")({
  component: ProgramPage,
  head: () => ({
    meta: [
      { title: "CBT-I Program — somna" },
      { name: "description", content: "A 6-week gentle CBT-I journey to rebuild your sleep." },
    ],
  }),
});

const weeks = [
  { w: 1, en: "Sleep foundations", zh: "睡眠基础", desc_en: "Set a consistent wake time and start a gentle diary.", desc_zh: "建立稳定的起床时间,开启温柔的睡眠日记。" },
  { w: 2, en: "Stimulus control", zh: "刺激控制", desc_en: "Reconnect bed with sleep — and only sleep.", desc_zh: "让床只与睡眠产生联结。" },
  { w: 3, en: "Sleep restriction", zh: "睡眠限制", desc_en: "Compress time in bed to deepen your sleep drive.", desc_zh: "适度压缩在床时间,增强睡眠驱动。" },
  { w: 4, en: "Calming the mind", zh: "平静思绪", desc_en: "Wind-down rituals, breathing, worry release.", desc_zh: "睡前仪式、呼吸练习、释放担忧。" },
  { w: 5, en: "Cognitive reframing", zh: "认知重塑", desc_en: "Soften unhelpful thoughts about sleep.", desc_zh: "温柔松动那些关于睡眠的卡点。" },
  { w: 6, en: "Maintain & flourish", zh: "巩固与延续", desc_en: "Keep your gains. Sleep with trust again.", desc_zh: "巩固成果,重新信任睡眠。" },
];

function ProgramPage() {
  const { t, lang } = useI18n();
  return (
    <>
      <PageHero eyebrow="6-WEEK PROGRAM" title={t("program.title")} sub={t("program.sub")} />
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-3xl">
          <ol className="relative space-y-4 border-l border-white/10 pl-6">
            {weeks.map((w) => (
              <li key={w.w} className="relative">
                <span className="absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-medium text-primary-foreground">
                  {w.w}
                </span>
                <div className="glass rounded-2xl p-5 transition hover:bg-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <h3 className="font-display text-lg">Week {w.w} · {lang === "zh" ? w.zh : w.en}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{lang === "zh" ? w.desc_zh : w.desc_en}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Link to="/assessment" className="inline-flex rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground">
              {t("assess.start")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
