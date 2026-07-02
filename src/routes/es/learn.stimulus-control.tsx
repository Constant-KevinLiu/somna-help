/**
 * Lección "Control de estímulos" en español (/es/learn/stimulus-control).
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHeadEs } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/es/learn/stimulus-control")({
  component: Page,
  head: () => learnHeadEs("stimulus-control"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["stimulus-control"];
  return <LearnLessonTemplate slug="stimulus-control" lesson={lesson} />;
}
