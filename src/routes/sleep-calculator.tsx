import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { RelatedTools } from "@/components/RelatedTools";
import { FAQ, faqJsonLd } from "@/components/FAQ";
import { useI18n, useFmtTime } from "@/lib/i18n";
import { getCalcDict } from "@/lib/calc-i18n";
import { Moon, Clock } from "lucide-react";

type AgeGroup = "teen" | "young" | "adult" | "older";

const RANGES: Record<AgeGroup, { min: number; max: number }> = {
  teen: { min: 8, max: 10 },
  young: { min: 7, max: 9 },
  adult: { min: 7, max: 9 },
  older: { min: 7, max: 8 },
};

export const Route = createFileRoute("/sleep-calculator")({
  component: SleepCalculatorPage,
  head: () => {
    const d = getCalcDict("en");
    return {
      meta: [
        { title: d.sleep.meta.title },
        { name: "description", content: d.sleep.meta.desc },
        { property: "og:title", content: d.sleep.meta.title },
        { property: "og:description", content: d.sleep.meta.desc },
        { property: "og:url", content: "/sleep-calculator" },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: "/sleep-calculator" }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd(d.sleep.faqs)) }],
    };
  },
});

function SleepCalculatorPage() {
  const { lang } = useI18n();
  const fmt = useFmtTime();
  const d = getCalcDict(lang).sleep;
  const [age, setAge] = useState<AgeGroup>("adult");
  const [wake, setWake] = useState("07:00");

  const result = useMemo(() => {
    const r = RANGES[age];
    const [h, m] = wake.split(":").map(Number);
    const base = new Date();
    base.setHours(h, m, 0, 0);
    const earliest = new Date(base.getTime() - r.max * 60 * 60 * 1000);
    const latest = new Date(base.getTime() - r.min * 60 * 60 * 1000);
    return { range: r, bedFrom: fmt(earliest), bedTo: fmt(latest) };
  }, [age, wake, fmt]);

  return (
    <>
      <PageHero eyebrow={d.eyebrow} title={d.title} sub={d.sub} />

      <section className="px-5 pb-12">
        <div className="mx-auto max-w-2xl">
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <label className="block">
              <span className="text-sm text-muted-foreground">{d.ageLabel}</span>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(Object.keys(RANGES) as AgeGroup[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setAge(k)}
                    className={`rounded-2xl border px-4 py-3 text-sm transition ${
                      age === k
                        ? "border-accent bg-gradient-to-r from-primary/30 to-accent/30 text-foreground"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d.ages[k]}
                  </button>
                ))}
              </div>
            </label>

            <label className="mt-6 block">
              <span className="text-sm text-muted-foreground">{d.wakeLabel}</span>
              <input
                type="time"
                value={wake}
                onChange={(e) => setWake(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-display text-3xl text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
                <Clock className="h-3.5 w-3.5" /> {d.recommended}
              </div>
              <div className="mt-2 font-display text-3xl">
                {result.range.min}–{result.range.max} {d.hoursWord}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{d.ageNotes[age]}</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
                <Moon className="h-3.5 w-3.5" /> {d.suggestedBedtime}
              </div>
              <div className="mt-2 font-display text-3xl">
                {result.bedFrom} – {result.bedTo}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{d.toWake(wake)}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/calculator"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {d.cta}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16">
        <div className="mx-auto max-w-3xl glass-strong rounded-3xl p-6 md:p-8">
          <h2 className="font-display text-2xl">{d.whyTitle}</h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            {d.whyParas.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={d.faqs} />
      <RelatedTools exclude="/sleep-calculator" />
    </>
  );
}
