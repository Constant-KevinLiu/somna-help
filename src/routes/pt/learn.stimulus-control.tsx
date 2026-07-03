/**
 * Lição "Controle de estímulos" em português brasileiro
 * (/pt/learn/stimulus-control).
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHeadPt } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/pt/learn/stimulus-control")({
  component: Page,
  head: () => learnHeadPt("stimulus-control"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["stimulus-control"];
  return <LearnLessonTemplate slug="stimulus-control" lesson={lesson} />;
}
