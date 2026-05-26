import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/learn")({
  component: LearnPage,
  head: () => ({
    meta: [
      { title: "Learn — somna" },
      { name: "description", content: "Short reads on CBT-I, sleep science, and gentle habits." },
    ],
  }),
});

const cats = [
  { en: "All", zh: "全部" },
  { en: "CBT-I", zh: "CBT-I" },
  { en: "Sleep Science", zh: "睡眠科学" },
  { en: "Fall Asleep Faster", zh: "更快入睡" },
  { en: "Anxiety & Sleep", zh: "焦虑与睡眠" },
  { en: "Healthy Habits", zh: "健康习惯" },
];

const articles = [
  { cat: "CBT-I", en: "What is CBT-I, really?", zh: "CBT-I 究竟是什么?", desc_en: "The gentlest, most evidence-backed way back to sleep.", desc_zh: "回到睡眠最温柔、最循证的方式。", time: "5 min" },
  { cat: "Sleep Science", en: "The 90-minute sleep cycle", zh: "90 分钟睡眠周期", desc_en: "How natural rhythm shapes how rested you feel.", desc_zh: "自然节律如何塑造你的清醒程度。", time: "4 min" },
  { cat: "Fall Asleep Faster", en: "The 4-7-8 breath, explained", zh: "解读 4-7-8 呼吸法", desc_en: "A vagus-nerve trick for a calmer body.", desc_zh: "一个让身体放松的小窍门。", time: "3 min" },
  { cat: "Anxiety & Sleep", en: "When the mind won't quiet down", zh: "当思绪无法安静", desc_en: "Worry windows, journaling, and letting go.", desc_zh: "担忧时段、书写、与放下。", time: "6 min" },
  { cat: "Healthy Habits", en: "Light, caffeine, and your inner clock", zh: "光、咖啡因与你的生物钟", desc_en: "Three small shifts that change everything.", desc_zh: "三个小小改变,影响巨大。", time: "5 min" },
  { cat: "CBT-I", en: "Stimulus control in plain language", zh: "通俗易懂的刺激控制法", desc_en: "Why your bed should mean only sleep.", desc_zh: "为什么你的床只该意味着睡眠。", time: "4 min" },
];

function LearnPage() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState("All");
  const filtered = articles.filter((a) => active === "All" || a.cat === active);

  return (
    <>
      <PageHero eyebrow="LEARN" title={t("learn.title")} sub={t("learn.sub")} />
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c.en}
                onClick={() => setActive(c.en)}
                className={`rounded-full border px-4 py-1.5 text-xs transition ${
                  active === c.en
                    ? "border-accent bg-accent/15 text-foreground"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang === "zh" ? c.zh : c.en}
              </button>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <article key={i} className="glass group rounded-3xl p-6 transition hover:-translate-y-1 hover:bg-white/[0.06]">
                <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {a.cat}
                </div>
                <h3 className="font-display text-xl group-hover:text-gradient">{lang === "zh" ? a.zh : a.en}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{lang === "zh" ? a.desc_zh : a.desc_en}</p>
                <div className="mt-4 text-xs text-muted-foreground">{a.time} read</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
