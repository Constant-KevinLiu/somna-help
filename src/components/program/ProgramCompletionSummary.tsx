import { Award, CheckCircle2, GraduationCap, Heart } from "lucide-react";
import { SafeLink } from "@/components/common/SafeLink";
import { useI18n } from "@/lib/i18n";
import { LANG_PREFIX } from "@/lib/lang-detect";
import { getProgramLessonUI } from "@/lib/program-lessons-i18n";
import { TOTAL_LESSONS } from "@/lib/program-lessons";
import type { ProgramProgress } from "@/lib/program/types";
import { programWeeks } from "@/lib/program-weeks";

type Props = {
  progress: ProgramProgress;
};

export function ProgramCompletionSummary({ progress }: Props) {
  const { lang } = useI18n();
  const ui = getProgramLessonUI(lang);
  const langPrefix = LANG_PREFIX[lang];

  const completedDate = progress.completedAt
    ? new Date(progress.completedAt).toLocaleDateString(
        lang === "zh" ? "zh-CN" : lang === "es" ? "es-ES" : lang === "pt" ? "pt-BR" : lang === "pl" ? "pl-PL" : lang === "de" ? "de-DE" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : null;

  const completedCount = progress.completedLessonIds.length;

  return (
    <section className="px-5 pb-8" aria-label={ui.completionTitle}>
      <div className="mx-auto max-w-3xl">
        <div className="glass-strong rounded-3xl border border-success/30 bg-success/[0.07] p-6 md:p-8">
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-success/40 bg-success/10">
            <GraduationCap className="h-8 w-8 text-success" />
          </div>

          {/* Title */}
          <h2 className="mt-5 text-center font-display text-xl text-foreground md:text-2xl">
            {ui.completionTitle}
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground md:text-base">
            {ui.completionSubtitle}
          </p>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-xs uppercase tracking-wider text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{ui.completionLessonsCount}</span>
              </div>
              <p className="mt-1 font-display text-xl text-foreground">
                {completedCount}
                <span className="text-sm text-muted-foreground"> / {TOTAL_LESSONS}</span>
              </p>
            </div>

            {completedDate && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {ui.completionDateLabel}
                </div>
                <p className="mt-1 font-display text-base text-foreground">
                  {completedDate}
                </p>
              </div>
            )}

            <div className="col-span-2 rounded-2xl border border-success/30 bg-success/10 p-4 text-center sm:col-span-1">
              <div className="flex items-center justify-center gap-1 text-xs uppercase tracking-wider text-success">
                <Award className="h-3.5 w-3.5" />
                <span>{ui.completionMilestone}</span>
              </div>
            </div>
          </div>

          {/* Review CTA */}
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <SafeLink
              to={`${langPrefix}/program`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {ui.reviewLessons}
            </SafeLink>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Heart className="mr-1 inline h-3 w-3" />
            {ui.completionDisclaimer}
          </p>
        </div>

        {/* Quick week review links */}
        <div className="mt-8">
          <h3 className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Award className="h-3.5 w-3.5 text-accent" />
            {ui.reviewLessons}
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {programWeeks.map((w) => {
              const wc = w.i18n[lang] ?? w.i18n.en!;
              return (
                <SafeLink
                  key={w.slug}
                  to={`${langPrefix}/program/${w.slug}`}
                  className="glass flex items-center gap-2 rounded-xl p-3 transition hover:bg-white/[0.06]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-medium text-primary-foreground">
                    {w.number}
                  </span>
                  <span className="truncate text-sm text-foreground">{wc.title}</span>
                </SafeLink>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
