/**
 * Página de lição individual do programa TCC-I em português
 * (/pt/program/$week/$lesson).
 *
 * Reutiliza LessonTemplate da rota inglesa. O idioma é derivado
 * automaticamente da rota (/pt/** → "pt") via useI18n(), por isso o
 * conteúdo de cada lição se renderiza em português (com fallback ao inglês
 * se a tradução pt ainda não existir).
 *
 * Meta title/description, hreflang bidirecional e canonical independentes,
 * gerados por lessonHead(lesson, "pt").
 */

import { createFileRoute, notFound } from "@tanstack/react-router";
import { LessonTemplate, lessonHead } from "@/components/program/LessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLessonMetaByWeekAndSlug, isValidWeekSlug, loadLesson } from "@/lib/program-lessons";

export const Route = createFileRoute("/pt/program/$week/$lesson")({
  loader: async ({ params }) => {
    if (!isValidWeekSlug(params.week)) throw notFound();
    const meta = getLessonMetaByWeekAndSlug(params.week, params.lesson);
    if (!meta) throw notFound();
    const lesson = await loadLesson(params.week, params.lesson);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    const lesson = loaderData?.lesson;
    if (!lesson) {
      return { meta: [{ title: "Lição TCC-I — somna" }] };
    }
    return lessonHead(lesson, "pt");
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground/90">Lição não encontrada</h1>
      <p className="mt-3 text-muted-foreground">Essa lição do programa não existe.</p>
    </div>
  ),
  component: PtLessonRoute,
});

function PtLessonRoute() {
  const { lesson } = Route.useLoaderData();
  const { lang } = useI18n();
  if (typeof document !== "undefined") {
    const c = lesson.i18n[lang] ?? lesson.i18n.en!;
    if (document.title !== c.seoTitle) document.title = c.seoTitle;
  }
  return <LessonTemplate lesson={lesson} />;
}
