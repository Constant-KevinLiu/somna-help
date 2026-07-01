import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHead } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/learn/stimulus-control")({
  component: Page,
  head: () => learnHead("stimulus-control"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["stimulus-control"];
  return <LearnLessonTemplate slug="stimulus-control" lesson={lesson} />;
}
