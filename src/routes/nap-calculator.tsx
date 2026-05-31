import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { RelatedTools } from "@/components/RelatedTools";
import { FAQ, faqJsonLd } from "@/components/FAQ";
import { useI18n, useFmtTime } from "@/lib/i18n";
import { getCalcDict } from "@/lib/calc-i18n";
import { Coffee, Brain, Battery } from "lucide-react";

const PRESETS = [10, 20, 30, 60, 90];

export const Route = createFileRoute("/nap-calculator")({
  component: NapCalculatorPage,
  head: () => {
    const d = getCalcDict("en");
    return {
      meta: [
        { title: d.nap.meta.title },
        { name: "description", content: d.nap.meta.desc },
        { property: "og:title", content: d.nap.meta.title },
        { property: "og:description", content: d.nap.meta.desc },
        { property: "og:url", content: "/nap-calculator" },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: "/nap-calculator" }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd(d.nap.faqs)) }],
    };
  },
});

function nowHHMM() {
  const dt = new Date();
  return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

function NapCalculatorPage() {
  const { lang } = useI18n();
  const fmt = useFmtTime();
  const d = getCalcDict(lang).nap;
  const [time, setTime] = useState(nowHHMM());
  const [selected, setSelected] = useState<number[]>([20, 30, 90]);

  const results = useMemo(() => {
    const [h, m] = time.split(":").map(Number);
    const base = new Date();
    base.setHours(h, m, 0, 0);
    return selected
      .slice()
      .sort((a, b) => a - b)
      .map((mins) => {
        const dt = new Date(base.getTime() + mins * 60 * 1000);
        return { mins, time: fmt(dt), benefit: d.benefits[mins] };
      });
  }, [time, selected, fmt, d.benefits]);

  const toggle = (m: number) => {
    setSelected((s) => (s.includes(m) ? s.filter((x) => x !== m) : [...s, m]));
  };

  return (
    <>
      <PageHero eyebrow={d.eyebrow} title={d.title} sub={d.sub} />

      <section className="px-5 pb-10">
        <div className="mx-auto max-w-2xl">
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <label className="block">
              <span className="text-sm text-muted-foreground">{d.currentTime}</span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-display text-3xl text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-ring"
              />
            </label>

            <div className="mt-6">
              <span className="text-sm text-muted-foreground">{d.napLength}</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {PRESETS.map((m) => (
                  <button
                    key={m}
                    onClick={() => toggle(m)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      selected.includes(m)
                        ? "border-accent bg-gradient-to-r from-primary/30 to-accent/30 text-foreground"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m} {d.minUnit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h2 className="mt-10 mb-5 text-center font-display text-xl text-foreground/90">{d.wakeSuggestions}</h2>
          <div className="grid gap-3">
            {results.map((r) => (
              <div key={r.mins} className="glass flex items-center justify-between rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                    <Coffee className="h-4 w-4 text-accent" />
                  </span>
                  <div>
                    <div className="font-display text-2xl">{r.time}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.mins} {d.minUnit} · {r.benefit.label}
                    </div>
                  </div>
                </div>
                <div className="hidden max-w-[12rem] text-right text-xs text-muted-foreground sm:block">
                  {r.benefit.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {d.cta}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16">
        <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-3">
          {d.quickCards.map((c, i) => {
            const Icon = [Battery, Brain, Coffee][i] ?? Coffee;
            return (
              <div key={i} className="glass rounded-2xl p-5">
                <Icon className="h-5 w-5 text-accent" />
                <div className="mt-2 font-display text-lg">{c.len}</div>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <FAQ items={d.faqs} />
      <RelatedTools exclude="/nap-calculator" />
    </>
  );
}
