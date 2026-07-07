/**
 * Página de semana do programa TCC-I em português (/pt/program/$slug).
 *
 * Reutiliza WeekPageTemplate da rota inglesa. O idioma é derivado
 * automaticamente da rota (/pt/** → "pt") via useI18n(), por isso o
 * conteúdo de cada semana se renderiza em português (com fallback ao inglês
 * se a tradução pt ainda não existir).
 */

import { createFileRoute, notFound } from "@tanstack/react-router";
import { WeekPageTemplate } from "@/components/program/WeekPageTemplate";
import { getWeek, programWeeks } from "@/lib/program-weeks";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/pt/program/$slug")({
  loader: ({ params }) => {
    const week = getWeek(params.slug);
    if (!week) throw notFound();
    return { week };
  },
  head: ({ loaderData }) => {
    const week = loaderData?.week;
    if (!week) {
      return {
        meta: [{ title: "Programa TCC-I — somna" }],
      };
    }
    const c = week.i18n.pt ?? week.i18n.en!;
    return {
      meta: [
        { title: c.seoTitle },
        { name: "description", content: c.seoDescription },
        { property: "og:title", content: c.seoTitle },
        { property: "og:description", content: c.seoDescription },
        { property: "og:url", content: `https://somna.help/pt/program/${week.slug}` },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pt_BR" },
      ],
      links: hreflangLinks(`/pt/program/${week.slug}`),
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground/90">Semana não encontrada</h1>
      <p className="mt-3 text-muted-foreground">Essa semana do programa não existe.</p>
    </div>
  ),
  component: PtWeekRoute,
});

function PtWeekRoute() {
  const { week } = Route.useLoaderData();
  return <WeekPageTemplate week={week} />;
}

// Reference for static export hints
export const _allSlugs = programWeeks.map((w) => w.slug);
