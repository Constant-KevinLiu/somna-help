/**
 * Strona indeksu polskiego Programu CBT-I (/pl/program/).
 *
 * - Teksty natywne po polsku.
 * - Niezależne meta title/description oraz hreflang.
 */

import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Moon, BookOpen, Award } from "lucide-react";
import { loadPlDict } from "@/locales/pl";
import { hreflangLinks } from "@/components/seo/Hreflang";
import { programWeeks } from "@/lib/program-weeks";
import { SafeLink } from "@/components/common/SafeLink";

export const Route = createFileRoute("/pl/program/")({
  head: () => ({
    meta: [
      { title: "Program CBT-I w 6 tygodni — somna" },
      {
        name: "description",
        content:
          "Sześciotygodniowa, łagodna podróż z 18 lekcjami, która krok po kroku odbudowuje sen na podstawie terapii CBT-I.",
      },
      { property: "og:title", content: "Program CBT-I w 6 tygodni — somna" },
      { property: "og:locale", content: "pl_PL" },
      { property: "og:url", content: "https://somna.help/pl/program" },
    ],
    links: hreflangLinks("/pl/program"),
  }),
  component: PlProgramPage,
});

function PlProgramPage() {
  const t = loadPlDict();
  const firstWeek = programWeeks[0];

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
            PROGRAM 6- TYGODNIOWY · 18 LEKCJI
          </div>
          <h1 className="font-display text-4xl leading-tight text-gradient md:text-5xl">
            {t["program.title"]}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            {t["program.sub"]}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SafeLink
              to={`/pl/program/${firstWeek?.slug ?? "week-1-sleep-foundations"}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
            >
              {t["cta.start"]} <ArrowRight className="h-4 w-4" />
            </SafeLink>
          </div>
        </div>
      </section>

      {/* CO ZAWIERA PROGRAM */}
      <section className="px-5 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl text-foreground md:text-3xl">
            Co zawiera program
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                t: "18 prowadzonych lekcji",
                d: "Każda lekcja trwa 5–10 minut i proponuje jedną małą, praktyczną zmianę.",
              },
              {
                icon: CheckCircle2,
                t: "Nawyki oparte na CBT-I",
                d: "Kontrola bodźców, ograniczenie snu i higiena snu — wyjaśnione krok po kroku.",
              },
              {
                icon: Award,
                t: "Kamienie milowe postępów",
                d: "Świętuj każdy etap i utrzymuj motywację tydzień po tygodniu.",
              },
            ].map((f, i) => (
              <div key={i} className="glass rounded-2xl border border-white/10 p-5">
                <f.icon className="h-5 w-5 text-accent" />
                <h3 className="mt-3 font-display text-lg text-foreground">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
