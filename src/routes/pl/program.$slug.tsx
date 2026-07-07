/**
 * Strona tygodnia programu CBT-I po polsku (/pl/program/$slug).
 *
 * Ponownie wykorzystuje WeekPageTemplate z trasy angielskiej. Język jest
 * wnioskowany automatycznie z trasy (/pl/** → "pl") przez useI18n().
 */

import { createFileRoute, notFound } from "@tanstack/react-router";
import { WeekPageTemplate } from "@/components/program/WeekPageTemplate";
import { getWeek, programWeeks } from "@/lib/program-weeks";
import { hreflangLinks } from "@/components/seo/Hreflang";

export const Route = createFileRoute("/pl/program/$slug")({
  loader: ({ params }) => {
    const week = getWeek(params.slug);
    if (!week) throw notFound();
    return { week };
  },
  head: ({ loaderData }) => {
    const week = loaderData?.week;
    if (!week) {
      return {
        meta: [{ title: "Program CBT-I — somna" }],
      };
    }
    const c = week.i18n.pl ?? week.i18n.en!;
    return {
      meta: [
        { title: c.seoTitle },
        { name: "description", content: c.seoDescription },
        { property: "og:title", content: c.seoTitle },
        { property: "og:description", content: c.seoDescription },
        { property: "og:url", content: `https://somna.help/pl/program/${week.slug}` },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pl_PL" },
      ],
      links: hreflangLinks(`/pl/program/${week.slug}`),
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground/90">Tydzień nie został znaleziony</h1>
      <p className="mt-3 text-muted-foreground">Ten tydzień programu nie istnieje.</p>
    </div>
  ),
  component: PlWeekRoute,
});

function PlWeekRoute() {
  const { week } = Route.useLoaderData();
  return <WeekPageTemplate week={week} />;
}

export const _allSlugs = programWeeks.map((w) => w.slug);
