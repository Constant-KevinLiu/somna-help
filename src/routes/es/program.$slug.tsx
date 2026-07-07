/**
 * Página de semana del programa CBT-I en español (/es/program/$slug).
 *
 * Reutiliza WeekPageTemplate de la ruta inglesa. El idioma se deriva
 * automáticamente de la ruta (/es/** → "es") vía useI18n(), por lo que el
 * contenido de cada semana se renderiza en español nativo (los textos
 * nativos viven en program-weeks.ts → week.i18n.es).
 *
 * Meta title/description y hreflang independientes en español.
 */

import { createFileRoute, notFound } from "@tanstack/react-router";
import { WeekPageTemplate } from "@/components/program/WeekPageTemplate";
import { getWeek, programWeeks } from "@/lib/program-weeks";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/es/program/$slug")({
  loader: ({ params }) => {
    const week = getWeek(params.slug);
    if (!week) throw notFound();
    return { week };
  },
  head: ({ loaderData }) => {
    const week = loaderData?.week;
    if (!week) {
      return {
        meta: [{ title: "Programa CBT-I — somna" }],
      };
    }
    const es = week.i18n.es!;
    return {
      meta: [
        { title: es.seoTitle },
        { name: "description", content: es.seoDescription },
        { property: "og:title", content: es.seoTitle },
        { property: "og:description", content: es.seoDescription },
        { property: "og:url", content: `https://somna.help/es/program/${week.slug}` },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "es_ES" },
      ],
      links: hreflangLinks(`/es/program/${week.slug}`),
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground/90">Semana no encontrada</h1>
      <p className="mt-3 text-muted-foreground">Esa semana del programa no existe.</p>
    </div>
  ),
  component: EsWeekRoute,
});

function EsWeekRoute() {
  const { week } = Route.useLoaderData();
  return <WeekPageTemplate week={week} />;
}

// Reference for static export hints
export const _allSlugs = programWeeks.map((w) => w.slug);
