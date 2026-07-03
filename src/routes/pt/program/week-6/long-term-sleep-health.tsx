/**
 * Página estática da Lição 18 da Semana 6 do Programa TCC-I em português
 * brasileiro (/pt/program/week-6/long-term-sleep-health).
 *
 * - Conteúdo nativo em português brasileiro, lido de program-lessons-content.
 * - Meta title/description e palavras-chave lidos exclusivamente de
 *   src/locales/pt/week-6.json (sem tradução do inglês).
 * - hreflang bidirecional (en / es / pt + x-default) e canonical próprios.
 * - Rota 1:1 alinhada à versão inglesa /program/week-6/long-term-sleep-health.
 *
 * Esta rota estática tem precedência sobre a rota dinâmica
 * pt/program.$week.$lesson.tsx para o mesmo caminho.
 */

import { createFileRoute, notFound } from "@tanstack/react-router";
import { LessonTemplate } from "@/components/program/LessonTemplate";
import { useI18n } from "@/lib/i18n";
import { loadLesson } from "@/lib/program-lessons";
import { ptLessonHeadFromLocales } from "@/lib/pt-lesson-head";

export const Route = createFileRoute("/pt/program/week-6/long-term-sleep-health")({
  loader: async () => {
    const lesson = await loadLesson("week-6", "long-term-sleep-health");
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    const lesson = loaderData?.lesson;
    if (!lesson) {
      return { meta: [{ title: "Lição TCC-I — somna" }] };
    }
    return ptLessonHeadFromLocales(lesson, "week6.lesson18");
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground/90">Lição não encontrada</h1>
      <p className="mt-3 text-muted-foreground">
        Essa lição do programa não existe.
      </p>
    </div>
  ),
  component: PtLesson18Route,
});

function PtLesson18Route() {
  const { lesson } = Route.useLoaderData();
  const { lang } = useI18n();
  if (typeof document !== "undefined") {
    const c = lesson.i18n[lang] ?? lesson.i18n.en!;
    if (document.title !== c.seoTitle) document.title = c.seoTitle;
  }
  return <LessonTemplate lesson={lesson} />;
}
