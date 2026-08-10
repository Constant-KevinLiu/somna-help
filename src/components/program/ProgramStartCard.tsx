import { BookOpen, Shield, Sparkles, Stethoscope } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getProgramLessonUI } from "@/lib/program-lessons-i18n";
import { TOTAL_LESSONS } from "@/lib/program-lessons";

type Props = {
  onStart: () => void;
  totalWeeks: number;
};

export function ProgramStartCard({ onStart, totalWeeks }: Props) {
  const { lang } = useI18n();
  const ui = getProgramLessonUI(lang);

  return (
    <section className="px-5 pb-8" aria-labelledby="program-start-title">
      <div className="mx-auto max-w-3xl">
        <div className="glass-strong rounded-3xl p-6 md:p-10">
          {/* Hero */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h2
              id="program-start-title"
              className="mt-5 font-display text-2xl text-foreground md:text-3xl"
            >
              {ui.startProgramTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {ui.startProgramSubtitle}
            </p>

            {/* Structure info */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 text-accent" />
              {totalWeeks} {ui.weekLabel.toLowerCase()} · {TOTAL_LESSONS}{" "}
              {ui.lessonsLabel.toLowerCase()} ·{" "}
              {ui.programStructureInfo.split("·")[2]?.trim() || "self-paced"}
            </div>
          </div>

          {/* What it does / doesn't */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 text-accent">
                <Shield className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">
                  {ui.programPrivacyNote.split(".")[0]}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{ui.programWhatItDoes}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Stethoscope className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">
                  {ui.programWhatItDoesNot.split(",")[0]}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{ui.programWhatItDoesNot}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {ui.startProgramCta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
