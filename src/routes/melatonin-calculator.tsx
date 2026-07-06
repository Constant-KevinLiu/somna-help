import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { RelatedTools } from "@/components/RelatedTools";
import { FAQ, faqJsonLd } from "@/components/FAQ";
import { SafeLink } from "@/components/common/SafeLink";
import { useI18n, useFmtTime } from "@/lib/i18n";
import { LANG_PREFIX } from "@/lib/lang-detect";
import { getCalcDict } from "@/lib/calc-i18n";
import { Pill, AlertTriangle } from "lucide-react";

type Onset = "fast" | "average" | "slow";
const ONSET_MIN: Record<Onset, number> = { fast: 15, average: 30, slow: 60 };

export const Route = createFileRoute("/melatonin-calculator")({
  component: MelatoninCalculatorPage,
  head: () => {
    const d = getCalcDict("en");
    return {
      meta: [
        { title: d.melatonin.meta.title },
        { name: "description", content: d.melatonin.meta.desc },
        { property: "og:title", content: d.melatonin.meta.title },
        { property: "og:description", content: d.melatonin.meta.desc },
        { property: "og:url", content: "https://somna.help/melatonin-calculator" },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: "https://somna.help/melatonin-calculator" }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(faqJsonLd(d.melatonin.faqs)) },
      ],
    };
  },
});

export function MelatoninCalculatorPage() {
  const { lang } = useI18n();
  const fmt = useFmtTime();
  const d = getCalcDict(lang).melatonin;
  const [bedtime, setBedtime] = useState("22:00");
  const [onset, setOnset] = useState<Onset>("average");

  const result = useMemo(() => {
    const [h, m] = bedtime.split(":").map(Number);
    const base = new Date();
    base.setHours(h, m, 0, 0);
    const early = new Date(base.getTime() - 120 * 60 * 1000);
    const late = new Date(base.getTime() - 60 * 60 * 1000);
    return { from: fmt(early), to: fmt(late), onsetMin: ONSET_MIN[onset] };
  }, [bedtime, onset, fmt]);

  return (
    <>
      <PageHero eyebrow={d.eyebrow} title={d.title} sub={d.sub} />

      <section className="px-5 pb-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p className="text-foreground/90">{d.disclaimer}</p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-10">
        <div className="mx-auto max-w-2xl">
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <label className="block">
              <span className="text-sm text-muted-foreground">{d.bedtimeLabel}</span>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-display text-3xl text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-ring"
              />
            </label>

            <div className="mt-6">
              <span className="text-sm text-muted-foreground">{d.onsetLabel}</span>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(Object.keys(ONSET_MIN) as Onset[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setOnset(k)}
                    className={`rounded-2xl border px-3 py-3 text-sm transition ${
                      onset === k
                        ? "border-accent bg-gradient-to-r from-primary/30 to-accent/30 text-foreground"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d.onset[k]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 glass-strong rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
              <Pill className="h-3.5 w-3.5" /> {d.recommendedWindow}
            </div>
            <div className="mt-2 font-display text-3xl">
              {result.from} – {result.to}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {d.windowNote(bedtime, result.onsetMin)}
            </p>
          </div>

          <div className="mt-8 text-center">
            <SafeLink
              to={`${LANG_PREFIX[lang]}/program`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {d.cta}
            </SafeLink>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16">
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
          {d.infoCards.map((c, i) => (
            <div key={i} className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <FAQ items={d.faqs} />
      <RelatedTools exclude={`${LANG_PREFIX[lang]}/melatonin-calculator`} />
    </>
  );
}
