import { Pause } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getProgramLessonUI } from "@/lib/program-lessons-i18n";

type Props = {
  onResume?: () => void;
  compact?: boolean;
};

export function ProgramPausedBanner({ onResume, compact = false }: Props) {
  const { lang } = useI18n();
  const ui = getProgramLessonUI(lang);

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/[0.07] p-4"
        role="status"
        aria-label={ui.pausedBannerTitle}
      >
        <Pause className="h-5 w-5 shrink-0 text-accent" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{ui.pausedBannerTitle}</p>
          <p className="text-xs text-muted-foreground">{ui.pausedProgressPreserved}</p>
        </div>
        {onResume && (
          <button
            type="button"
            onClick={onResume}
            className="shrink-0 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90"
          >
            {ui.resumeCta}
          </button>
        )}
      </div>
    );
  }

  return (
    <section className="px-5 pt-6" aria-label={ui.pausedBannerTitle}>
      <div className="mx-auto max-w-3xl">
        <div
          className="glass-strong rounded-3xl border border-accent/30 bg-accent/[0.07] p-6 md:p-8"
          role="status"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
              <Pause className="h-5 w-5 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg text-foreground">{ui.pausedBannerTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{ui.pausedBannerBody}</p>
              <p className="mt-2 text-xs text-accent">{ui.pausedProgressPreserved}</p>
              {onResume && (
                <button
                  type="button"
                  onClick={onResume}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  {ui.resumeCta}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
