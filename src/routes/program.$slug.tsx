import { createFileRoute, notFound } from "@tanstack/react-router";
import { WeekPageTemplate } from "@/components/program/WeekPageTemplate";
import { getWeek, programWeeks } from "@/lib/program-weeks";

export const Route = createFileRoute("/program/$slug")({
  loader: ({ params }) => {
    const week = getWeek(params.slug);
    if (!week) throw notFound();
    return { week };
  },
  head: ({ loaderData }) => {
    const week = loaderData?.week;
    if (!week) {
      return {
        meta: [{ title: "CBT-I Program — somna" }],
      };
    }
    const en = week.i18n.en!;
    return {
      meta: [
        { title: en.seoTitle },
        { name: "description", content: en.seoDescription },
        { property: "og:title", content: en.seoTitle },
        { property: "og:description", content: en.seoDescription },
        { property: "og:url", content: `https://somna.help/program/${week.slug}` },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `https://somna.help/program/${week.slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground/90">Week not found</h1>
      <p className="mt-3 text-muted-foreground">That week of the program doesn't exist.</p>
    </div>
  ),
  component: WeekRoute,
});

function WeekRoute() {
  const { week } = Route.useLoaderData();
  return <WeekPageTemplate week={week} />;
}

// Reference for static export hints
export const _allSlugs = programWeeks.map((w) => w.slug);
