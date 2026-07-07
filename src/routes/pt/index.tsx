/**
 * Página inicial em português (/pt).
 *
 * Renderiza o mesmo hero e seções que a home inglesa, mas com textos nativos
 * em português brasileiro tirados de src/locales/pt/common.json.
 *
 * O restante das páginas (/pt/diary, /pt/calculator, etc.) segue o mesmo
 * padrão: uma rota sob src/routes/pt/ que reutiliza o componente de página
 * inglês passando-lhe o idioma "pt".
 */

import { createFileRoute } from "@tanstack/react-router";
import { Moon, Calculator, Sparkles, ArrowRight } from "lucide-react";
import { loadPtDict, getPtString } from "@/locales/pt";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { SafeLink } from "@/components/common/SafeLink";

export const Route = createFileRoute("/pt/")({
  head: () => {
    const t = loadPtDict();
    const title = getPtString(t, "seo.home.title");
    const description = getPtString(t, "seo.home.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: getPtString(t, "seo.home.ogTitle") },
        { property: "og:description", content: getPtString(t, "seo.home.ogDescription") },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:type", content: "website" },
      ],
      links: hreflangLinks("/pt"),
    };
  },
  component: PtHome,
});

function PtHome() {
  const t = loadPtDict();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pt-16 pb-20 md:pt-28 md:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl animate-glow-pulse" />
          <div className="absolute right-10 top-20 h-40 w-40 rounded-full bg-accent/20 blur-3xl animate-float-slow" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div className="animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-accent" />
              {t["hero.badge"]}
            </div>
            <h1 className="font-display text-5xl leading-[1.05] text-gradient md:text-6xl lg:text-7xl">
              {t["hero.title"]}
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
              {t["hero.sub"]}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SafeLink
                to="/pt/program"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_0_40px_-10px_oklch(0.72_0.13_280/60%)] transition hover:scale-[1.02]"
              >
                <Moon className="h-4 w-4" /> {t["cta.start"]}
              </SafeLink>
              <SafeLink
                to="/pt/calculator"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-foreground transition hover:bg-white/10"
              >
                <Calculator className="h-4 w-4" /> {t["cta.calc"]}
              </SafeLink>
            </div>
          </div>

          {/* Círculo de respiração */}
          <div className="relative flex h-[340px] items-center justify-center md:h-[440px]">
            <div className="absolute h-72 w-72 rounded-full bg-primary/20 blur-2xl animate-glow-pulse md:h-96 md:w-96" />
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40 animate-breathe md:h-72 md:w-72">
              <div className="flex h-40 w-40 items-center justify-center rounded-full glass-strong md:h-52 md:w-52">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    respire
                  </div>
                  <div className="mt-2 font-display text-2xl text-foreground">entra · sai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl text-foreground md:text-4xl">
            {t["features.title"]}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { t: t["features.1.t"], d: t["features.1.d"], to: "/pt/program" },
              { t: t["features.2.t"], d: t["features.2.d"], to: "/pt/calculator" },
              { t: t["features.3.t"], d: t["features.3.d"], to: "/pt/relax" },
            ].map((f, i) => (
              <SafeLink
                key={i}
                to={f.to}
                className="glass group rounded-3xl border border-white/10 p-6 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <h3 className="font-display text-xl text-foreground group-hover:text-accent">
                  {f.t}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">{f.d}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs text-accent">
                  {t["cta.readMore"]}{" "}
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </SafeLink>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl text-foreground md:text-4xl">{t["trust.title"]}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t["trust.sub"]}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { t: t["trust.1.t"], d: t["trust.1.d"] },
              { t: t["trust.2.t"], d: t["trust.2.d"] },
              { t: t["trust.3.t"], d: t["trust.3.d"] },
            ].map((f, i) => (
              <div key={i} className="text-left">
                <h3 className="font-display text-lg text-foreground">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 to-accent/10 p-10 text-center">
          <h2 className="font-display text-3xl text-foreground md:text-4xl">{t["emo.note"]}</h2>
          <SafeLink
            to="/pt/program"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
          >
            {t["cta.start"]} <ArrowRight className="h-4 w-4" />
          </SafeLink>
        </div>
      </section>
    </>
  );
}
