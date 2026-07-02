/**
 * Página del Diario de sueño en español (/es/diario).
 *
 * Textos nativos en español. Meta y hreflang independientes.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { loadEsDict } from "@/locales/es";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/es/diario")({
  head: () => ({
    meta: [
      { title: "Diario de sueño — somna" },
      {
        name: "description",
        content:
          "Anota tu sueño en tres minutos cada mañana. Sin juicio, sin presión: solo entender qué pasa por la noche.",
      },
      { property: "og:title", content: "Diario de sueño — somna" },
      { property: "og:locale", content: "es_ES" },
    ],
    links: hreflangLinks("/es/diario"),
  }),
  component: EsDiaryPage,
});

function EsDiaryPage() {
  const t = loadEsDict();

  return (
    <section className="relative overflow-hidden px-5 pt-16 pb-20 md:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl animate-glow-pulse" />
      </div>
      <div className="mx-auto max-w-2xl text-center animate-fade-up">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
          <BookOpen className="h-3 w-3 text-accent" />
          3 MINUTOS CADA MAÑANA
        </div>
        <h1 className="font-display text-4xl leading-tight text-gradient md:text-5xl">
          {t["diary.title"]}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
          {t["diary.sub"]}
        </p>
        <div className="mt-8">
          <Link
            to="/es/diary"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
          >
            {t["diary.save"]} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
