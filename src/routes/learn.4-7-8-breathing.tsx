import { createFileRoute } from "@tanstack/react-router";
import { LearnLessonTemplate, learnHead } from "@/components/learn/LearnLessonTemplate";
import { useI18n } from "@/lib/i18n";
import { getLearnDict } from "@/lib/learn-i18n";

export const Route = createFileRoute("/learn/4-7-8-breathing")({
  component: Page,
  head: () => learnHead("4-7-8-breathing"),
});

function Page() {
  const { lang } = useI18n();
  const lesson = getLearnDict(lang).lessons["4-7-8-breathing"];
  return <LearnLessonTemplate slug="4-7-8-breathing" lesson={lesson} />;
}
