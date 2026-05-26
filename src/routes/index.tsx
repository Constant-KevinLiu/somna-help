import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Moon, Calculator, Wind, Sparkles, Heart, ShieldCheck, Leaf } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "somna — Sleep Better, Starting Tonight" },
      { name: "description", content: "Science-based CBT-I sleep companion. Drug-free, gentle, and built for calm." },
    ],
  }),
});

function Index() {
  const { t } = useI18n();
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pt-16 pb-20 md:pt-28 md:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl animate-glow-pulse" />
          <div className="absolute right-10 top-20 h-40 w-40 rounded-full bg-accent/20 blur-3xl animate-float-slow" />
          <div className="absolute left-10 bottom-10 h-48 w-48 rounded-full bg-primary/20 blur-3xl animate-float-slow" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div className="animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-accent" />
              CBT-I · Evidence based
            </div>
            <h1 className="font-display text-5xl leading-[1.05] text-gradient md:text-6xl lg:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
              {t("hero.sub")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/program"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_0_40px_-10px_oklch(0.72_0.13_280/60%)] transition hover:scale-[1.02] hover:shadow-[0_0_60px_-10px_oklch(0.72_0.13_280/80%)]"
              >
                <Moon className="h-4 w-4" /> {t("cta.start")}
              </Link>
              <Link
                to="/calculator"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-foreground transition hover:bg-white/10"
              >
                <Calculator className="h-4 w-4" /> {t("cta.calc")}
              </Link>
            </div>
          </div>

          {/* Breathing circle */}
          <div className="relative flex h-[340px] items-center justify-center md:h-[440px]">
            <div className="absolute h-72 w-72 rounded-full bg-primary/20 blur-2xl animate-glow-pulse md:h-96 md:w-96" />
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40 animate-breathe md:h-72 md:w-72">
              <div className="flex h-40 w-40 items-center justify-center rounded-full glass-strong md:h-52 md:w-52">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">breathe</div>
                  <div className="mt-2 font-display text-2xl text-foreground">in · out</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center font-display text-3xl text-gradient md:text-4xl">{t("features.title")}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Sparkles, t: t("features.1.t"), d: t("features.1.d") },
              { icon: Calculator, t: t("features.2.t"), d: t("features.2.d") },
              { icon: Wind, t: t("features.3.t"), d: t("features.3.d") },
            ].map((f) => (
              <div key={f.t} className="glass rounded-3xl p-7 transition hover:-translate-y-1 hover:bg-white/[0.06]">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30">
                  <f.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-display text-xl">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-5xl glass-strong rounded-[2rem] p-8 md:p-14">
          <div className="text-center">
            <h2 className="font-display text-3xl text-gradient md:text-4xl">{t("trust.title")}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t("trust.sub")}</p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { icon: ShieldCheck, t: t("trust.1.t"), d: t("trust.1.d") },
              { icon: Leaf, t: t("trust.2.t"), d: t("trust.2.d") },
              { icon: Heart, t: t("trust.3.t"), d: t("trust.3.d") },
            ].map((f) => (
              <div key={f.t} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                  <f.icon className="h-5 w-5 text-success" />
                </div>
                <h3 className="font-display text-lg">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMOTIONAL */}
      <section className="relative overflow-hidden px-5 py-20 md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl text-gradient md:text-4xl">{t("emo.title")}</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {["emo.1", "emo.2", "emo.3", "emo.4"].map((k) => (
              <div key={k} className="glass rounded-2xl px-5 py-4 text-left text-sm text-muted-foreground">
                {t(k)}
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-xl font-display text-xl text-foreground/90 leading-relaxed">
            {t("emo.note")}
          </p>
          <Link
            to="/assessment"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
          >
            {t("assess.start")}
          </Link>
        </div>
      </section>
    </>
  );
}
