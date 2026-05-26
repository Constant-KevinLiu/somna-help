import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";

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
  const [bed, setBed] = useState("23:00");
  const [fall, setFall] = useState(20);
  const [wakes, setWakes] = useState(1);
  const [wake, setWake] = useState("07:00");
  const [quality, setQuality] = useState(4);
  const [mood, setMood] = useState(1);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <PageHero eyebrow="DIARY" title={t("diary.title")} sub={t("diary.sub")} />
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-xl">
          <form
            onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2500); }}
            className="glass-strong space-y-5 rounded-3xl p-6 md:p-8"
          >
            <Field label={t("diary.bedtime")}>
              <input type="time" value={bed} onChange={(e) => setBed(e.target.value)} className={inputCls} />
            </Field>
            <Field label={t("diary.wake")}>
              <input type="time" value={wake} onChange={(e) => setWake(e.target.value)} className={inputCls} />
            </Field>
            <Field label={t("diary.fall")}>
              <input type="number" min={0} value={fall} onChange={(e) => setFall(+e.target.value)} className={inputCls} />
            </Field>
            <Field label={t("diary.wakes")}>
              <input type="number" min={0} value={wakes} onChange={(e) => setWakes(+e.target.value)} className={inputCls} />
            </Field>
            <Field label={`${t("diary.quality")}: ${quality}/5`}>
              <input type="range" min={1} max={5} value={quality} onChange={(e) => setQuality(+e.target.value)} className="w-full accent-[oklch(0.78_0.12_285)]" />
            </Field>
            <Field label={t("diary.mood")}>
              <div className="flex justify-between gap-2">
                {moods.map((m, i) => (
                  <button type="button" key={i} onClick={() => setMood(i)}
                    className={`flex-1 rounded-2xl border py-3 text-2xl transition ${mood === i ? "border-accent bg-accent/15" : "border-white/10 bg-white/5"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </Field>

            <button type="submit" className="w-full rounded-full bg-gradient-to-r from-primary to-accent py-3.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.01]">
              {saved ? t("diary.saved") : t("diary.save")}
            </button>
          </form>
        </div>
      </section>
    </>
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
