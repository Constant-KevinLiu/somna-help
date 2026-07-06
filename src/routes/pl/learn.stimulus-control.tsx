/**
 * Lekcja "Kontrola bodźców" po polsku (/pl/learn/stimulus-control).
 */

import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHeadPl } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/pl/learn/stimulus-control")({
  component: Page,
  head: () => learnHeadPl("stimulus-control"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["stimulus-control"];
  return <LearnLessonTemplate slug="stimulus-control" lesson={lesson} />;
}
