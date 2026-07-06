import { createFileRoute, notFound } from "@tanstack/react-router";
import { LessonTemplate } from "@/components/program/LessonTemplate";
import { loadLesson } from "@/lib/program-lessons";
import { plLessonHeadFromLocales, plLessonTitleFromLocales } from "@/lib/pl-lesson-head";

export const Route = createFileRoute("/pl/program/week-5/common-insomnia-thoughts")({
  loader: async () => {
    const lesson = await loadLesson("week-5", "common-insomnia-thoughts", "pl");
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    const lesson = loaderData?.lesson;
    if (!lesson) return { meta: [{ title: "Lekcja CBT-I — somna" }] };
    return plLessonHeadFromLocales(lesson, "week5.lesson13");
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground/90">Lekcja nie została znaleziona</h1>
      <p className="mt-3 text-muted-foreground">Ta lekcja programu nie istnieje.</p>
    </div>
  ),
  component: PlLesson13Route,
});

function PlLesson13Route() {
  const { lesson } = Route.useLoaderData();
  if (typeof document !== "undefined") {
    const title = plLessonTitleFromLocales("week5.lesson13");
    if (document.title !== title) document.title = title;
  }
  return <LessonTemplate lesson={lesson} />;
}
