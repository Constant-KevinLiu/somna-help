/**
 * Strona pojedynczej lekcji programu CBT-I po polsku
 * (/pl/program/$week/$lesson).
 *
 * Ponownie wykorzystuje LessonTemplate z trasy angielskiej. Język jest
 * wnioskowany automatycznie z trasy (/pl/** → "pl") przez useI18n().
 *
 * Meta title/description, hreflang czterojęzyczny (en/es/pt/pl) oraz
 * canonical są generowane przez lessonHead(lesson, "pl").
 */

import { createFileRoute, notFound } from "@tanstack/react-router";
import { LessonTemplate } from "@/components/program/LessonTemplate";
import {
  getLessonMetaByWeekAndSlug,
  isValidWeekSlug,
  loadLesson,
  lessonMetas,
} from "@/lib/program-lessons";
import { plLessonHeadFromLocales, plLessonTitleFromLocales } from "@/lib/pl-lesson-head";

export const Route = createFileRoute("/pl/program/$week/$lesson")({
  loader: async ({ params }) => {
    if (!isValidWeekSlug(params.week)) throw notFound();
    const meta = getLessonMetaByWeekAndSlug(params.week, params.lesson);
    if (!meta) throw notFound();
    const lesson = await loadLesson(params.week, params.lesson, "pl");
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    const lesson = loaderData?.lesson;
    if (!lesson) {
      return { meta: [{ title: "Lekcja CBT-I — somna" }] };
    }
    const key = lessonKeyFor(lesson.weekSlug, lesson.slug);
    return plLessonHeadFromLocales(lesson, key ?? "week1.lesson1");
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground/90">Lekcja nie została znaleziona</h1>
      <p className="mt-3 text-muted-foreground">
        Ta lekcja programu nie istnieje.
      </p>
    </div>
  ),
  component: PlLessonRoute,
});

function lessonKeyFor(weekSlug: string, lessonSlug: string): string | null {
  const meta = lessonMetas.find((m) => m.weekSlug === weekSlug && m.slug === lessonSlug);
  if (!meta) return null;
  const weekN = parseInt(weekSlug.replace("week-", ""), 10);
  return `week${weekN}.lesson${meta.lessonNumber}`;
}

function PlLessonRoute() {
  const { lesson } = Route.useLoaderData();
  if (typeof document !== "undefined") {
    const key = lessonKeyFor(lesson.weekSlug, lesson.slug);
    const title = key ? plLessonTitleFromLocales(key) : "Lekcja CBT-I — somna";
    if (document.title !== title) document.title = title;
  }
  return <LessonTemplate lesson={lesson} />;
}
