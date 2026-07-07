/**
 * Página de Evaluación de sueño en español (/es/evaluacion).
 *
 * Textos nativos en español. Meta y hreflang independientes.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { loadEsDict } from "@/locales/es";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/es/evaluacion")({
  head: () => ({
    meta: [
      { title: "Test de sueño — somna" },
      {
        name: "description",
        content:
          "Una breve revisión para entender tu sueño y crear tu plan personalizado de CBT-I.",
      },
      { property: "og:title", content: "Test de sueño — somna" },
      { property: "og:locale", content: "es_ES" },
    ],
    links: hreflangLinks("/es/evaluacion"),
  }),
  component: EsAssessmentPage,
});

function EsAssessmentPage() {
  const t = loadEsDict();

  return (
    <section className="relative overflow-hidden px-5 pt-16 pb-20 md:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl animate-glow-pulse" />
      </div>
      <div className="mx-auto max-w-2xl text-center animate-fade-up">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
          <ClipboardCheck className="h-3 w-3 text-accent" />5 PREGUNTAS · 3 MINUTOS
        </div>
        <h1 className="font-display text-4xl leading-tight text-gradient md:text-5xl">
          {t["assess.title"]}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
          {t["assess.sub"]}
        </p>
        <div className="mt-8">
          <Link
            to="/es/assessment"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
          >
            {t["assess.start"]} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">{t["assess.support"]}</p>
      </div>
    </section>
  );
}
