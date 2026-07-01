import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Lock, BookOpen, Award } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { programLabels, programWeeks } from "@/lib/program-weeks";
import { getProgramLessonUI } from "@/lib/program-lessons-i18n";
import { getLessonsByWeek, TOTAL_LESSONS } from "@/lib/program-lessons";
import {
  useProgramProgress,
  weekCompletionPercent,
  weekCompletedCount,
  weekStatus,
  earnedBadges,
  resolveWeekSlug,
  type WeekStatus,
} from "@/lib/program-progress";

export const Route = createFileRoute("/program/")({
  component: ProgramPage,
  head: () => ({
    meta: [
      { title: "CBT-I Program — somna" },
      {
        name: "description",
        content:
          "An 18-lesson, 6-week CBT-I journey to rebuild your sleep, one gentle step at a time.",
      },
      { property: "og:title", content: "CBT-I Program — somna" },
      {
        property: "og:description",
        content:
          "An 18-lesson, 6-week CBT-I journey to rebuild your sleep, one gentle step at a time.",
      },
      { property: "og:url", content: "/program" },
    ],
    links: [{ rel: "canonical", href: "/program" }],
  }),
});

function ProgramPage() {
  const { t, lang } = useI18n();
  const labels = programLabels[lang];
  const ui = getProgramLessonUI(lang);
  const { progress, hydrated } = useProgramProgress();

  const overallPct = hydrated
    ? Math.round((progress.completedLessons.length / TOTAL_LESSONS) * 100)
    : 0;
  const badges = hydrated ? earnedBadges(progress) : [];

  return (
    <>
      <PageHero
        eyebrow="6-WEEK PROGRAM · 18 LESSONS"
        title={t("program.title")}
        sub={ui.programHubSub}
      >
        {/* Overall progress */}
        {hydrated && (
          <div className="mx-auto mt-2 max-w-md">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>{ui.completionLabel}</span>
              <span>{overallPct}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${overallPct}%` }}
                role="progressbar"
                aria-valuenow={overallPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={ui.completionLabel}
              />
            </div>
          </div>
        )}
      </PageHero>

      {/* Milestone badges */}
      {hydrated && badges.length > 0 && (
        <section className="px-5 pb-6" aria-label={ui.badgesTitle}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Award className="h-3.5 w-3.5 text-accent" /> {ui.badgesTitle}
            </div>
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs text-accent"
                >
                  <Award className="h-3 w-3" />
                  {b === "sleep-basics"
                    ? ui.badgeSleepBasics
                    : b === "sleep-consistency"
                      ? ui.badgeSleepConsistency
                      : ui.badgeCbtiGraduate}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 pb-16">
        <div className="mx-auto max-w-3xl">
          <ol className="relative space-y-4 border-l border-white/10 pl-6">
            {programWeeks.map((w) => {
              const wc = w.i18n[lang] ?? w.i18n.en;
              const shortSlug = resolveWeekSlug(w.slug) ?? w.slug;
              const weekLessons = getLessonsByWeek(shortSlug);
              const status: WeekStatus = hydrated ? weekStatus(progress, w.slug) : "available";
              const done = hydrated ? weekCompletedCount(progress, w.slug) : 0;
              const pct = hydrated ? weekCompletionPercent(progress, w.slug) : 0;
              const isLocked = status === "locked";

              return (
                <li key={w.slug} className="relative">
                  <span className="absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-medium text-primary-foreground">
                    {w.number}
                  </span>
                  <Link
                    to="/program/$slug"
                    params={{ slug: w.slug }}
                    aria-disabled={isLocked}
                    tabIndex={isLocked ? -1 : undefined}
                    className={`glass group block rounded-2xl p-5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isLocked ? "cursor-not-allowed opacity-60" : "hover:bg-white/[0.06]"
                    }`}
                    onClick={isLocked ? (e) => e.preventDefault() : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : isLocked ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : null}
                      <h3 className="font-display text-lg">
                        {labels.weekLabel} {w.number} · {wc.title}
                      </h3>
                      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{wc.shortDesc}</p>

                    {/* Lesson count + completion */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {weekLessons.length} {ui.programHubLessonsCount}
                      </span>
                      <span>
                        {done} / {weekLessons.length} {ui.programHubComplete}
                      </span>
                      <StatusPill status={status} ui={ui} />
                    </div>

                    {/* Week progress bar */}
                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
          <div className="mt-10 text-center">
            <Link
              to="/assessment"
              className="inline-flex rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              {t("assess.start")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function StatusPill({
  status,
  ui,
}: {
  status: WeekStatus;
  ui: ReturnType<typeof getProgramLessonUI>;
}) {
  const map = {
    locked: { label: ui.lockedWeek, cls: "border-white/10 bg-white/5 text-muted-foreground" },
    available: { label: ui.availableWeek, cls: "border-accent/30 bg-accent/10 text-accent" },
    completed: { label: ui.completedWeek, cls: "border-success/30 bg-success/10 text-success" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${s.cls}`}>
      {s.label}
    </span>
  );
}
