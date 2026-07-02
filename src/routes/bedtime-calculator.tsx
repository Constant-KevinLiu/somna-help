import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { RelatedTools } from "@/components/RelatedTools";
import { FAQ, faqJsonLd } from "@/components/FAQ";
import { useI18n, useFmtTime } from "@/lib/i18n";
import { getCalcDict } from "@/lib/calc-i18n";
import { Moon, Sparkles } from "lucide-react";

const FALL_MIN = 15;
const CYCLE_MIN = 90;

export const Route = createFileRoute("/bedtime-calculator")({
  component: BedtimeCalculatorPage,
  head: () => {
    const d = getCalcDict("en");
    return {
      meta: [
        { title: d.bedtime.meta.title },
        { name: "description", content: d.bedtime.meta.desc },
        { property: "og:title", content: d.bedtime.meta.title },
        { property: "og:description", content: d.bedtime.meta.desc },
        { property: "og:url", content: "/bedtime-calculator" },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: "/bedtime-calculator" }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(faqJsonLd(d.bedtime.faqs)) },
      ],
    };
  },
});

export function BedtimeCalculatorPage() {
  const { lang } = useI18n();
  const fmt = useFmtTime();
  const d = getCalcDict(lang).bedtime;
  const [wake, setWake] = useState("07:00");

  const results = useMemo(() => {
    const [h, m] = wake.split(":").map(Number);
    const base = new Date();
    base.setHours(h, m, 0, 0);
    return [7, 6, 5].map((cycles) => {
      const dt = new Date(base.getTime() - (cycles * CYCLE_MIN + FALL_MIN) * 60 * 1000);
      return { cycles, hours: (cycles * CYCLE_MIN) / 60, time: fmt(dt), best: cycles === 6 };
    });
  }, [wake, fmt]);

  return (
    <>
      <PageHero eyebrow={d.eyebrow} title={d.title} sub={d.sub} />

      <section className="px-5 pb-10">
        <div className="mx-auto max-w-2xl">
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <label className="block">
              <span className="text-sm text-muted-foreground">{d.wakeLabel}</span>
              <input
                type="time"
                value={wake}
                onChange={(e) => setWake(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-display text-3xl text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          <h2 className="mt-10 mb-5 text-center font-display text-xl text-foreground/90">
            {d.suggested}
          </h2>
          <div className="grid gap-3">
            {results.map((r) => (
              <div
                key={r.cycles}
                className={`glass relative flex items-center justify-between rounded-2xl p-5 transition hover:bg-white/[0.06] ${
                  r.best ? "ring-1 ring-accent/60" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                    <Moon className="h-4 w-4 text-accent" />
                  </span>
                  <div>
                    <div className="font-display text-2xl">{r.time}</div>
                    <div className="text-xs text-muted-foreground">
                      {d.cyclesSuffix(r.hours, r.cycles)}
                    </div>
                  </div>
                </div>
                {r.best && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-medium text-primary-foreground">
                    <Sparkles className="h-3 w-3" /> {d.bestLabel}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">{d.note}</p>

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

      <FAQ items={d.faqs} />
      <RelatedTools exclude="/bedtime-calculator" />
    </>
  );
}
