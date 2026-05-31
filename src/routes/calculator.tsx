import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useI18n, useFmtTime } from "@/lib/i18n";
import { getCalcDict } from "@/lib/calc-i18n";
import { PageHero } from "@/components/PageHero";
import { Moon, Sun } from "lucide-react";

export const Route = createFileRoute("/calculator")({
  component: CalculatorPage,
  head: () => ({
    meta: [
      { title: "Sleep Calculator — somna" },
      { name: "description", content: "Find your ideal bedtime and wake time using natural 90-minute sleep cycles." },
    ],
  }),
});

const FALL_MIN = 15;

function CalculatorPage() {
  const { t, lang } = useI18n();
  const fmt = useFmtTime();
  const dict = getCalcDict(lang);
  const [mode, setMode] = useState<"wake" | "bed">("wake");
  const [time, setTime] = useState("07:00");

  const results = useMemo(() => {
    const [h, m] = time.split(":").map(Number);
    const base = new Date();
    base.setHours(h, m, 0, 0);
    return [6, 5, 4, 3].map((cycles) => {
      const d = new Date(base);
      const delta = (cycles * 90 + FALL_MIN) * 60 * 1000 * (mode === "wake" ? -1 : 1);
      d.setTime(d.getTime() + delta);
      return { cycles, hours: (cycles * 90) / 60, time: fmt(d) };
    });
  }, [time, mode]);

  return (
    <>
      <PageHero eyebrow="CALCULATOR" title={t("calc.title")} sub={t("calc.sub")} />
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-2xl">
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="mb-6 flex rounded-full border border-white/10 bg-white/5 p-1">
              {(["wake", "bed"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-full px-4 py-2 text-sm transition ${
                    mode === m ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {t(`calc.mode.${m}`)}
                </button>
              ))}
            </div>

            <label className="block">
              <span className="text-sm text-muted-foreground">{mode === "wake" ? t("calc.wake") : t("calc.bed")}</span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-display text-3xl text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          <h2 className="mt-10 mb-5 text-center font-display text-xl text-foreground/90">
            {mode === "wake" ? t("calc.results.bed") : t("calc.results.wake")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((r) => (
              <div key={r.cycles} className="glass flex items-center justify-between rounded-2xl p-5 transition hover:bg-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                    {mode === "wake" ? <Moon className="h-4 w-4 text-accent" /> : <Sun className="h-4 w-4 text-success" />}
                  </span>
                  <div>
                    <div className="font-display text-2xl">{r.time}</div>
                    <div className="text-xs text-muted-foreground">{r.hours}{dict.common.hoursShort} · {r.cycles} {dict.common.cyclesWord}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">{t("calc.fall")}</p>
        </div>
      </section>
    </>
  );
}
