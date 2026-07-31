import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  BookOpen,
  Award,
  Pause,
  Play,
} from "lucide-react";
import { SafeLink } from "@/components/common/SafeLink";
import { useI18n } from "@/lib/i18n";
import { LANG_PREFIX } from "@/lib/lang-detect";
import { PageHero } from "@/components/PageHero";
import { programLabels, programWeeks } from "@/lib/program-weeks";
import { getProgramLessonUI } from "@/lib/program-lessons-i18n";
import { getLessonsByWeek, TOTAL_LESSONS } from "@/lib/program-lessons";
import { useProgramService } from "@/lib/program/use-program-service";
import { ProgramUnsupportedBanner } from "@/components/program/ProgramUnsupportedBanner";
import { ProgramStartCard } from "@/components/program/ProgramStartCard";
import { ProgramPausedBanner } from "@/components/program/ProgramPausedBanner";
import { ProgramCompletionSummary } from "@/components/program/ProgramCompletionSummary";
import { ProgramWeeklyFocusSection } from "@/components/program/ProgramWeeklyFocusSection";
import { PauseConfirmDialog } from "@/components/program/PauseConfirmDialog";
import type { WeekAccessStatus } from "@/lib/program/types";
import { generateWeeklyFocus } from "@/lib/analytics/weekly-focus";
import { loadRecords, type SleepRecord } from "@/lib/sleep-records";
import type { DataSufficiency } from "@/lib/analytics/types";
import { overallSufficiency } from "@/lib/analytics/sufficiency";
import type { HabitProgress } from "@/services/habit/habit-types";
import { getDateRange } from "@/lib/analytics/date-ranges";

/**
 * Resolve a week slug to its canonical short form ("week-1" .. "week-6").
 * Accepts both the short slug ("week-1") and the long slug
 * ("week-1-sleep-foundations").
 */
function resolveWeekSlug(weekSlug: string): string | null {
  const match = /^week-(\d+)(?:-|$)/.exec(weekSlug);
  if (!match) return null;
  const n = Number(match[1]);
  if (!Number.isInteger(n) || n < 1 || n > 6) return null;
  return `week-${n}`;
}

// Map internal WeekAccessStatus to the display-friendly type name used by UI
type WeekStatus = WeekAccessStatus | "current" | "in-progress";

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
      { property: "og:url", content: "https://somna.help/program" },
    ],
    links: [{ rel: "canonical", href: "https://somna.help/program" }],
  }),
});

function ProgramPage() {
  const { t, lang } = useI18n();
  const labels = programLabels[lang] ?? programLabels.en!;
  const ui = getProgramLessonUI(lang);
  const langPrefix = LANG_PREFIX[lang];
  const {
    hydrated,
    progress,
    overallCompletion,
    earnedBadgeIds,
    getWeekStatus,
    getWeekCompletion,
    getWeekCompletedCount,
    isUnsupportedSchema,
    loadStatus,
    startProgram,
    pauseProgram,
    resumeProgram,
    recommendedNextLesson,
    currentWeekId,
    definition,
  } = useProgramService();

  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [recordsHydrated, setRecordsHydrated] = useState(false);

  // Load sleep records and reminders on client side (for weekly focus)
  useEffect(() => {
    try {
      const records = loadRecords();
      setSleepRecords(records);
    } catch {
      setSleepRecords([]);
    }
    setRecordsHydrated(true);
  }, []);

  // Compute weekly focus and data sufficiency (client-side only)
  const range = getDateRange("7d", new Date());
  const windowRecords = recordsHydrated
    ? sleepRecords.filter((r) => r.date >= range.start && r.date <= range.end)
    : [];
  const dataSufficiency: DataSufficiency = overallSufficiency(windowRecords.length);
  const habitProgress: Map<string, HabitProgress> = new Map();
  const weeklyFocus =
    hydrated && recordsHydrated && !isUnsupportedSchema && progress.status !== "not_started"
      ? generateWeeklyFocus(windowRecords, habitProgress, new Date())
      : null;

  const isNotStarted = hydrated && !isUnsupportedSchema && progress.status === "not_started";
  const isActive = hydrated && !isUnsupportedSchema && progress.status === "active";
  const isPaused = hydrated && !isUnsupportedSchema && progress.status === "paused";
  const isCompleted = hydrated && !isUnsupportedSchema && progress.status === "completed";
  const isCorrupted = hydrated && loadStatus === "corrupted";

  const overallPct = hydrated && !isUnsupportedSchema ? overallCompletion : 0;
  const badges = hydrated && !isUnsupportedSchema ? earnedBadgeIds : [];
  const totalWeeks = definition.weeks.length;

  // Current week number for display
  const currentWeekNum = currentWeekId
    ? Number(currentWeekId.match(/week-(\d+)/)?.[1] ?? 1)
    : 1;

  return (
    <>
      {/* Hero — context differs by state */}
      <PageHero
        eyebrow={getHeroEyebrow(progress.status, isUnsupportedSchema, loadStatus, ui)}
        title={t("program.title")}
        sub={isCompleted ? ui.completionTitle : ui.programHubSub}
      >
        {/* Overall progress — show for active/paused/completed states */}
        {hydrated && !isUnsupportedSchema && !isNotStarted && (
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
            <div className="mt-2 text-center text-xs text-muted-foreground">
              {progress.completedLessonIds.length} {ui.lessonsCompletedLabel}
            </div>
          </div>
        )}
      </PageHero>

      {/* Unsupported schema warning */}
      <ProgramUnsupportedBanner />

      {/* Corrupted data warning */}
      {isCorrupted && (
        <section className="px-5 pt-4">
          <div className="mx-auto max-w-3xl">
            <div className="glass-strong rounded-2xl border border-destructive/30 bg-destructive/10 p-5">
              <p className="text-sm text-destructive">{ui.statusCorrupted}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {ui.unsupportedBody}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Not Started: Introduction card */}
      {isNotStarted && (
        <ProgramStartCard onStart={startProgram} totalWeeks={totalWeeks} />
      )}

      {/* Paused: Paused banner */}
      {isPaused && (
        <ProgramPausedBanner onResume={resumeProgram} />
      )}

      {/* Completed: Completion summary */}
      {isCompleted && (
        <ProgramCompletionSummary progress={progress} />
      )}

      {/* Weekly Focus — show for active and paused (but not not_started or unsupported) */}
      {hydrated && !isUnsupportedSchema && !isNotStarted && (
        <ProgramWeeklyFocusSection
          focus={weeklyFocus}
          dataSufficiency={dataSufficiency}
          definition={definition}
          currentWeekId={currentWeekId}
          recordCount={windowRecords.length}
          evidenceDays={7}
          t={t}
        />
      )}

      {/* Milestone badges */}
      {hydrated && badges.length > 0 && !isUnsupportedSchema && (
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

      {/* Week journey list — show for all non-unsupported states, but adapt behavior */}
      {!isUnsupportedSchema && (
        <section className="px-5 pb-16" aria-label={ui.lessonsLabel}>
          <div className="mx-auto max-w-3xl">
            {/* Header + action for active state */}
            {isActive && recommendedNextLesson && (
              <div className="mb-6">
                <SafeLink
                  to={`${langPrefix}/program/${recommendedNextLesson.weekId}/${recommendedNextLesson.id}`}
                  className="group flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/[0.07] p-4 transition hover:bg-accent/[0.12]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-accent/40">
                    <BookOpen className="h-4 w-4 text-foreground" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {ui.nextLesson}
                    </div>
                    <div className="mt-0.5 font-display text-base text-foreground">
                      {ui.lessonLabel} {recommendedNextLesson.order} · {ui.weekLabel} {currentWeekNum}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                    {ui.continue}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </SafeLink>

                {/* Pause action for active state */}
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPauseDialog(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
                  >
                    <Pause className="h-3.5 w-3.5" />
                    {ui.pauseProgram}
                  </button>
                </div>
              </div>
            )}

            {/* Paused: resume CTA above week list */}
            {isPaused && (
              <div className="mb-6 text-center">
                <button
                  type="button"
                  onClick={resumeProgram}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  <Play className="h-4 w-4" />
                  {ui.resumeCta}
                </button>
              </div>
            )}

            <ol className="relative space-y-4 border-l border-white/10 pl-6">
              {programWeeks.map((w) => {
                const wc = w.i18n[lang] ?? w.i18n.en!;
                const shortSlug = resolveWeekSlug(w.slug) ?? w.slug;
                const weekLessons = getLessonsByWeek(shortSlug);
                const baseStatus: WeekAccessStatus = hydrated ? getWeekStatus(shortSlug) : "available";
                const done = hydrated && !isUnsupportedSchema ? getWeekCompletedCount(shortSlug) : 0;
                const pct = hydrated && !isUnsupportedSchema ? getWeekCompletion(shortSlug) : 0;

                // Determine display status
                const displayStatus: WeekStatus = getWeekDisplayStatus(
                  baseStatus,
                  shortSlug,
                  currentWeekId,
                  done,
                  weekLessons.length,
                  progress.status
                );

                const isLocked = baseStatus === "locked" || isUnsupportedSchema || isPaused;
                const canInteract = !isLocked && !isCorrupted;

                return (
                  <li key={w.slug} className="relative">
                    <span className="absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-medium text-primary-foreground">
                      {w.number}
                    </span>
                    <Link
                      to="/program/$slug"
                      params={{ slug: w.slug }}
                      aria-disabled={!canInteract}
                      tabIndex={canInteract ? undefined : -1}
                      className={`glass group block rounded-2xl p-5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        canInteract
                          ? "hover:bg-white/[0.06]"
                          : "cursor-not-allowed opacity-60"
                      }`}
                      onClick={canInteract ? undefined : (e) => e.preventDefault()}
                    >
                      <div className="flex items-center gap-2">
                        {displayStatus === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : isLocked ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : displayStatus === "current" ? (
                          <BookOpen className="h-4 w-4 text-accent" />
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
                        <StatusPill status={displayStatus} ui={ui} />
                      </div>

                      {/* Week progress bar */}
                      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ width: `${pct}%` }}
                          role="progressbar"
                          aria-valuenow={pct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${labels.weekLabel} ${w.number} ${ui.completionLabel.toLowerCase()}`}
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>

            {/* Not started: assessment CTA at bottom */}
            {isNotStarted && (
              <div className="mt-10 text-center">
                <SafeLink
                  to={
                    lang === "pt" ? "/pt/assessment" : lang === "es" ? "/es/evaluacion" : "/assessment"
                  }
                  className="inline-flex rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground"
                >
                  {t("assess.start")}
                </SafeLink>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Pause confirm dialog */}
      <PauseConfirmDialog
        open={showPauseDialog}
        onOpenChange={setShowPauseDialog}
        onConfirm={pauseProgram}
      />
    </>
  );
}

// =============================================================================
// Helpers
// =============================================================================

function getWeekDisplayStatus(
  baseStatus: WeekAccessStatus,
  weekId: string,
  currentWeekId: string | null,
  completedCount: number,
  totalCount: number,
  programStatus: string
): WeekStatus {
  if (baseStatus === "completed") return "completed";
  if (baseStatus === "locked") return "locked";

  // Available — check if it's the current week or in-progress
  if (weekId === currentWeekId && programStatus === "active") {
    return "current";
  }
  if (completedCount > 0 && completedCount < totalCount) {
    return "in-progress";
  }

  return "available";
}

function getHeroEyebrow(
  status: string,
  isUnsupported: boolean,
  loadStatus: string,
  ui: ReturnType<typeof getProgramLessonUI>
): string {
  if (isUnsupported) return ui.unsupportedTitle;
  if (loadStatus === "corrupted") return ui.statusCorrupted;
  if (status === "not_started") return ui.statusNotStarted;
  if (status === "paused") return ui.statusPaused;
  if (status === "completed") return ui.statusCompleted;
  return `6-WEEK PROGRAM · ${TOTAL_LESSONS} LESSONS`;
}

function StatusPill({
  status,
  ui,
}: {
  status: WeekStatus;
  ui: ReturnType<typeof getProgramLessonUI>;
}) {
  const map: Record<WeekStatus, { label: string; cls: string }> = {
    locked: { label: ui.lockedWeek, cls: "border-white/10 bg-white/5 text-muted-foreground" },
    available: { label: ui.availableWeek, cls: "border-accent/30 bg-accent/10 text-accent" },
    "in-progress": { label: ui.weekInProgress, cls: "border-accent/30 bg-accent/10 text-accent" },
    current: { label: ui.weekCurrent, cls: "border-primary/40 bg-primary/15 text-primary" },
    completed: { label: ui.completedWeek, cls: "border-success/30 bg-success/10 text-success" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${s.cls}`}>
      {s.label}
    </span>
  );
}
