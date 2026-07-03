/**
 * Lição "Ritmo circadiano" em português brasileiro (/pt/learn/circadian-rhythm).
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHeadPt } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/pt/learn/circadian-rhythm")({
  component: Page,
  head: () => learnHeadPt("circadian-rhythm"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["circadian-rhythm"];
  return <LearnLessonTemplate slug="circadian-rhythm" lesson={lesson} />;
}
