/**
 * ProgramUnsupportedBanner — warning shown when stored program data
 * has a schema version newer than what this build of the app supports.
 *
 * Design principles:
 *   - SSR-safe: renders nothing on the server (banner only shows after
 *     hydration, when we know what's in localStorage)
 *   - Does NOT display raw user data, schema content, or localization keys
 *   - Does not block navigation away from Program pages
 *   - Compact variant for Dashboard / inline use
 *   - All strings are localized via getProgramLessonUI with English fallback
 */

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getProgramLessonUI } from "@/lib/program-lessons-i18n";
import { useProgramService } from "@/lib/program/use-program-service";

type Props = {
  /** If true, renders a compact one-line version (for Dashboard, cards). */
  compact?: boolean;
};

export function ProgramUnsupportedBanner({ compact = false }: Props) {
  const { lang } = useI18n();
  const ui = getProgramLessonUI(lang);
  const { hydrated, isUnsupportedSchema, unsupportedSchemaInfo } = useProgramService();

  // SSR-safe: before hydration we can't know if schema is unsupported,
  // so we render nothing to avoid a hydration mismatch.
  if (!hydrated) return null;

  if (!isUnsupportedSchema) return null;

  const storedVersion = unsupportedSchemaInfo?.storedSchemaVersion ?? "?";
  const supportedVersion = unsupportedSchemaInfo?.supportedSchemaVersion ?? "?";

  if (compact) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4"
      >
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground/90">
            {ui.unsupportedDashLabel}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {ui.unsupportedTitle}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="px-5 pb-4">
      <div className="mx-auto max-w-3xl">
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-4 rounded-2xl border border-accent/40 bg-accent/10 p-5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
            <AlertTriangle className="h-5 w-5 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg text-foreground">
              {ui.unsupportedTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {ui.unsupportedBody}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent/20"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {ui.unsupportedRefresh}
              </button>
              <span className="text-xs text-muted-foreground">
                v{String(supportedVersion)} supported · v{String(storedVersion)} stored
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
