import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useI18n, useFmtTime } from "@/lib/i18n";
import { getCalcDict } from "@/lib/calc-i18n";
import { PageHero } from "@/components/PageHero";
import { CalculatorShareCard } from "@/components/CalculatorShareCard";
import { Moon, Sun } from "lucide-react";
import { TimeWheelPicker } from "@/components/ui/TimeWheelPicker";

export const Route = createFileRoute("/calculator")({
  component: CalculatorPage,
  head: () => ({
    meta: [
      { title: "Sleep Calculator — somna" },
      {
        name: "description",
        content: "Find your ideal bedtime and wake time using natural 90-minute sleep cycles.",
      },
    ],
  }),
});

const FALL_MIN = 15;
const WAKE_KEY = "sleepCalculatorWakeTime";
const BED_KEY = "sleepCalculatorBedTime";
const DEFAULT_WAKE = "07:00";
const DEFAULT_BED = "23:00";

type CycleTier = {
  cycles: number;
  rank: number;
  /** tailwind border/bg/shadow classes for this tier */
  cardClass: string;
  badge?: "recommended" | "recovery";
  /** animate + glow for the recommended tiers (5 & 6) */
  highlight?: boolean;
};

const TIERS: CycleTier[] = [
  { cycles: 4, rank: 4, cardClass: "border-slate-500 bg-slate-900/30" },
  {
    cycles: 5,
    rank: 1,
    cardClass: "border-purple-400 bg-purple-500/15 shadow-purple-500/20",
    badge: "recommended",
    highlight: true,
  },
  {
    cycles: 6,
    rank: 2,
    cardClass: "border-emerald-400 bg-emerald-500/15 shadow-emerald-500/20",
    badge: "recommended",
    highlight: true,
  },
  {
    cycles: 7,
    rank: 3,
    cardClass: "border-amber-400 bg-amber-500/15 shadow-amber-500/20",
    badge: "recovery",
  },
];

export function CalculatorPage() {
  const { t, lang } = useI18n();
  const fmt = useFmtTime();
  const dict = getCalcDict(lang);
  const [mode, setMode] = useState<"wake" | "bed">("wake");
  const [time, setTime] = useState(DEFAULT_WAKE);

  // Restore last-used values per mode from localStorage.
  useEffect(() => {
    try {
      const savedWake = localStorage.getItem(WAKE_KEY);
      const savedBed = localStorage.getItem(BED_KEY);
      if (savedWake) {
        setMode("wake");
        setTime(savedWake);
      } else if (savedBed) {
        setMode("bed");
        setTime(savedBed);
      }
    } catch {
      /* localStorage unavailable — ignore */
    }
  }, []);

  // Persist the current value under the matching key whenever it changes.
  useEffect(() => {
    try {
      if (mode === "wake") localStorage.setItem(WAKE_KEY, time);
      else localStorage.setItem(BED_KEY, time);
    } catch {
      /* ignore */
    }
  }, [mode, time]);

  const handleMode = (m: "wake" | "bed") => {
    setMode(m);
    try {
      const saved = m === "wake" ? localStorage.getItem(WAKE_KEY) : localStorage.getItem(BED_KEY);
      setTime(saved ?? (m === "wake" ? DEFAULT_WAKE : DEFAULT_BED));
    } catch {
      setTime(m === "wake" ? DEFAULT_WAKE : DEFAULT_BED);
    }
  };

  const results = useMemo(() => {
    const [h, m] = time.split(":").map(Number);
    const base = new Date();
    base.setHours(h, m, 0, 0);
    return TIERS.map((tier) => {
      const d = new Date(base);
      const delta = (tier.cycles * 90 + FALL_MIN) * 60 * 1000 * (mode === "wake" ? -1 : 1);
      d.setTime(d.getTime() + delta);
      return { ...tier, hours: (tier.cycles * 90) / 60, time: fmt(d) };
    });
  }, [time, mode, fmt]);

  return (
    <>
      <PageHero eyebrow={t("nav.calculator")} title={t("calc.title")} sub={t("calc.sub")} />
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-2xl">
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="mb-6 flex rounded-full border border-white/10 bg-white/5 p-1">
              {(["wake", "bed"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => handleMode(m)}
                  className={`flex-1 rounded-full px-4 py-2 text-sm transition ${
                    mode === m
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {t(`calc.mode.${m}`)}
                </button>
              ))}
            </div>

            <label className="block">
              <span className="text-sm text-muted-foreground">
                {mode === "wake" ? t("calc.wake") : t("calc.bed")}
              </span>
              <TimeWheelPicker
                value={time}
                onChange={setTime}
                locale={lang}
                label={mode === "wake" ? t("calc.wake") : t("calc.bed")}
                className="mt-3 w-full"
              />
            </label>
          </div>

          <h2 className="mt-10 mb-5 text-center font-display text-xl text-foreground/90">
            {mode === "wake" ? t("calc.results.bed") : t("calc.results.wake")}
          </h2>

          {/* Result cards — stack vertically on mobile, 2-col on sm+ */}
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((r) => (
              <div
                key={r.cycles}
                className={`relative rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 ${
                  r.cardClass
                } ${r.highlight ? "shadow-lg hover:scale-[1.02]" : ""}`}
              >
                {/* Ranking label — upper right corner */}
                <span className="absolute right-4 top-4 font-display text-sm text-muted-foreground/80">
                  #{r.rank}
                </span>

                {/* Badge for recommended / recovery tiers */}
                {r.badge && (
                  <span
                    className={`mb-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      r.badge === "recommended"
                        ? "bg-purple-500/25 text-purple-200"
                        : "bg-amber-500/25 text-amber-200"
                    }`}
                  >
                    {r.badge === "recommended"
                      ? t("calc.badge.recommended")
                      : t("calc.badge.recovery")}
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                    {mode === "wake" ? (
                      <Moon className="h-4 w-4 text-accent" />
                    ) : (
                      <Sun className="h-4 w-4 text-success" />
                    )}
                  </span>
                  <div>
                    <div className="font-display text-2xl">{r.time}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.hours}
                      {dict.common.hoursShort} · {r.cycles} {dict.common.cyclesWord}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                  {t(`calc.tier.${r.cycles}.label`)}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">{t("calc.fall")}</p>

          {/* Explanatory section */}
          <div className="mt-8 glass-strong rounded-3xl p-6 md:p-8">
            <h3 className="font-display text-lg text-foreground/90">{t("calc.explain.title")}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("calc.explain.body")}
            </p>
          </div>

          {/* Share result */}
          <div className="mt-8">
            <CalculatorShareCard
              title={t("calc.title")}
              resultLines={results.slice(0, 2).map((r) => r.time)}
              context="sleep-calculator"
              filename="somna-sleep-calculator.png"
            />
          </div>
        </div>
      </section>
    </>
  );
}
