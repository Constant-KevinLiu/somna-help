/**
 * Página índice del Programa CBT-I en español (/es/program/).
 *
 * - Textos nativos en español desde src/locales/es/common.json.
 * - NO depende del diccionario inglés ni de useI18n(); usa loadEsDict().
 * - Meta title/description independientes en español.
 * - hreflang bidireccional + canonical.
 *
 * Esta es la ruta índice bajo el layout /es/program. Las semanas individuales
 * se sirven desde /es/program/$slug (es/program.$slug.tsx).
 */

import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Moon, BookOpen, Award } from "lucide-react";
import { loadEsDict } from "@/locales/es";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { programWeeks } from "@/lib/program-weeks";
import { SafeLink } from "@/components/common/SafeLink";

export const Route = createFileRoute("/es/program/")({
  head: () => ({
    meta: [
      { title: "Programa CBT-I en 6 semanas — somna" },
      {
        name: "description",
        content:
          "Un viaje suave de 6 semanas y 18 lecciones para reconstruir tu sueño paso a paso, basado en la terapia CBT-I.",
      },
      { property: "og:title", content: "Programa CBT-I en 6 semanas — somna" },
      {
        property: "og:description",
        content:
          "Reconstruye tu sueño con un programa CBT-I de 6 semanas y 18 lecciones.",
      },
      { property: "og:url", content: "https://somna.help/es/program" },
      { property: "og:locale", content: "es_ES" },
    ],
    links: hreflangLinks("/es/program"),
  }),
  component: EsProgramIndexPage,
});

function EsProgramIndexPage() {
  const t = loadEsDict();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pt-16 pb-12 md:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl animate-glow-pulse" />
        </div>
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            <Moon className="h-3 w-3 text-accent" />
            PROGRAMA DE 6 SEMANAS · 18 LECCIONES
          </div>
          <h1 className="font-display text-4xl leading-tight text-gradient md:text-5xl">
            {t["program.title"]}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            {t["program.sub"]}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SafeLink
              to="/es/program/week-1-sleep-foundations"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
            >
              {t["cta.start"]} <ArrowRight className="h-4 w-4" />
            </SafeLink>
          </div>
        </div>
      </section>

      {/* QUÉ INCLUYE */}
      <section className="px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl text-foreground md:text-3xl">
            Qué incluye el programa
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                t: "18 lecciones guiadas",
                d: "Cada lección dura 5-10 minutos y te propone un pequeño cambio práctico.",
              },
              {
                icon: CheckCircle2,
                t: "Hábitos basados en CBT-I",
                d: "Control de estímulos, restricción del sueño y higiene del descanso.",
              },
              {
                icon: Award,
                t: "Insignias de progreso",
                d: "Celebra cada hito y mantén la motivación semana a semana.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="glass rounded-2xl border border-white/10 p-5"
              >
                <f.icon className="h-5 w-5 text-accent" />
                <h3 className="mt-3 font-display text-lg text-foreground">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEMANAS */}
      <section className="px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl text-foreground md:text-3xl">
            Las 6 semanas
          </h2>
          <div className="mt-8 space-y-3">
            {programWeeks.map((week, idx) => (
              <SafeLink
                key={week.slug}
                to={`/es/program/${week.slug}`}
                className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      Semana {idx + 1}
                    </div>
                    <h3 className="mt-1 font-display text-lg text-foreground">
                      {week.i18n.es!.title}
                    </h3>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </SafeLink>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center">
          <h2 className="font-display text-2xl text-foreground md:text-3xl">
            {t["emo.note"]}
          </h2>
          <SafeLink
            to="/es/program/week-1-sleep-foundations"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
          >
            {t["cta.start"]} <ArrowRight className="h-4 w-4" />
          </SafeLink>
        </div>
      </section>
    </>
  );
}
