/**
 * Lección "Ritmo circadiano" en español (/es/learn/circadian-rhythm).
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHeadEs } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/es/learn/circadian-rhythm")({
  component: Page,
  head: () => learnHeadEs("circadian-rhythm"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["circadian-rhythm"];
  return <LearnLessonTemplate slug="circadian-rhythm" lesson={lesson} />;
}
