/**
 * Reflection Timeline component — private, mobile-first history view.
 *
 * Inspired by timeline UX patterns but strictly private (no social features).
 * Reverse chronological, grouped by date, with expand/collapse per entry.
 *
 * Accessibility:
 * - All actions keyboard accessible
 * - Visible focus states
 * - ARIA labels for all interactive elements
 * - Semantic HTML structure
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { format, isToday, isYesterday } from "date-fns";
import { enUS, es, ptBR, pl } from "date-fns/locale";
import type { Locale as DateFnsLocale } from "date-fns";
import {
  Pencil,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  RefreshCw,
  PenLine,
} from "lucide-react";
import type { LocalReflection } from "@/lib/reflection/reflection-types";
import { getSortedReflections, deleteReflection } from "@/lib/reflection/reflection-storage";
import { getCategoryLabel } from "@/lib/reflection/reflection-prompts";
import type { ContentLocale } from "@/content/content-types";
import type { ReflectionUiStrings } from "@/content/en/diary/reflection-ui";

interface ReflectionTimelineProps {
  strings: ReflectionUiStrings;
  locale: ContentLocale;
  onEdit: (date: string) => void;
  /** Optional force-refresh trigger (increments when parent saves) */
  refreshKey?: number;
}

const DATE_LOCALES: Partial<Record<ContentLocale, DateFnsLocale>> = {
  en: enUS,
  es: es,
  "pt-BR": ptBR,
  pl: pl,
};

const EXCERPT_LENGTH = 180;
const LONG_ENTRY_THRESHOLD = 250;

/**
 * Group reflections by local date (YYYY-MM-DD).
 * Returns groups in reverse chronological order (newest date first).
 */
function groupByDate(reflections: LocalReflection[]): Array<{
  dateKey: string;
  label: string;
  isToday: boolean;
  isYesterday: boolean;
  entries: LocalReflection[];
}> {
  const groups = new Map<string, LocalReflection[]>();

  for (const r of reflections) {
    if (!groups.has(r.localDate)) {
      groups.set(r.localDate, []);
    }
    groups.get(r.localDate)!.push(r);
  }

  const sortedKeys = Array.from(groups.keys()).sort((a, b) => b.localeCompare(a));

  return sortedKeys.map((dateKey) => {
    const date = new Date(dateKey + "T00:00:00");
    const today = isToday(date);
    const yesterday = isYesterday(date);

    return {
      dateKey,
      entries: groups.get(dateKey)!,
      isToday: today,
      isYesterday: yesterday,
      label: dateKey, // filled in by caller with locale
    };
  });
}

export function ReflectionTimeline({
  strings,
  locale,
  onEdit,
  refreshKey = 0,
}: ReflectionTimelineProps) {
  const dateLocale = DATE_LOCALES[locale] ?? enUS;
  const [reflections, setReflections] = useState<LocalReflection[]>(() => getSortedReflections());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Refresh when parent signals a change (e.g. new save)
  useEffect(() => {
    setReflections(getSortedReflections());
  }, [refreshKey]);

  const groups = useMemo(() => groupByDate(reflections), [reflections]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleCopy = useCallback(
    async (content: string) => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(content);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement("textarea");
          textarea.value = content;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        toast.success(strings.toast.copied);
      } catch {
        toast.error(strings.toast.copyError);
      }
    },
    [strings.toast.copied, strings.toast.copyError],
  );

  const handleDelete = useCallback(
    (id: string) => {
      try {
        deleteReflection(id);
        setReflections(getSortedReflections());
        setExpandedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.success(strings.toast.deleted);
      } catch {
        toast.error(strings.toast.deleteError);
      }
      setDeleteTarget(null);
    },
    [strings.toast.deleted, strings.toast.deleteError],
  );

  const formatDateLabel = (dateKey: string, isToday_: boolean, isYesterday_: boolean): string => {
    if (isToday_) return strings.timeline.today;
    if (isYesterday_) return strings.timeline.yesterday;
    const date = new Date(dateKey + "T00:00:00");
    return format(date, "MMMM d, yyyy", { locale: dateLocale });
  };

  const getSyncLabel = (status: LocalReflection["syncStatus"]): string => {
    switch (status) {
      case "synced":
        return strings.timeline.synced;
      case "pending":
        return strings.timeline.pending;
      case "local":
      case "conflict":
      default:
        return strings.timeline.savedLocally;
    }
  };

  const getSyncIcon = (status: LocalReflection["syncStatus"]) => {
    switch (status) {
      case "synced":
        return <CheckCircle2 className="h-3 w-3" />;
      case "pending":
        return <RefreshCw className="h-3 w-3 animate-spin" />;
      case "local":
      case "conflict":
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  // Empty state
  if (reflections.length === 0) {
    return (
      <div className="glass-strong rounded-3xl p-6 md:p-8">
        <div className="py-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <PenLine className="h-6 w-6 text-accent" />
          </div>
          <p className="text-sm font-medium text-foreground">{strings.timeline.empty}</p>
          <p className="mt-2 text-sm text-muted-foreground">{strings.history.empty}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-3xl p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between px-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{strings.timeline.title}</h3>
          <p className="text-xs text-muted-foreground">
            {reflections.length} {strings.timeline.total}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group) => {
          const dateLabel = formatDateLabel(group.dateKey, group.isToday, group.isYesterday);

          return (
            <div key={group.dateKey} className="relative">
              {/* Date group header */}
              <div className="sticky top-0 z-10 mb-3 flex items-center gap-3 bg-background/50 px-1 backdrop-blur-sm">
                <div
                  className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    group.isToday ? "bg-accent/20 text-accent" : "bg-white/10 text-muted-foreground"
                  }`}
                >
                  {dateLabel}
                </div>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Entries for this date */}
              <div className="space-y-3 pl-2">
                {group.entries.map((reflection) => {
                  const isExpanded = expandedIds.has(reflection.id);
                  const isLong = reflection.content.length > LONG_ENTRY_THRESHOLD;
                  const showExpand = isLong || reflection.content.length > EXCERPT_LENGTH;
                  const displayContent =
                    !isExpanded && showExpand
                      ? reflection.content.slice(0, EXCERPT_LENGTH) + "…"
                      : reflection.content;

                  return (
                    <article
                      key={reflection.id}
                      className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06] focus-within:ring-2 focus-within:ring-accent/30"
                      aria-label={`Reflection from ${dateLabel}`}
                    >
                      {/* Category tags */}
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {reflection.promptCategories.slice(0, 3).map((category) => (
                          <span
                            key={category}
                            className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent/90"
                          >
                            {getCategoryLabel(category, locale)}
                          </span>
                        ))}
                      </div>

                      {/* Content */}
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                        {displayContent}
                      </p>

                      {/* Expand / Collapse */}
                      {showExpand && (
                        <button
                          onClick={() => toggleExpand(reflection.id)}
                          aria-expanded={isExpanded}
                          aria-label={
                            isExpanded
                              ? strings.accessibility.collapseEntry
                              : strings.accessibility.expandEntry
                          }
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent transition hover:text-accent/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background rounded-md"
                        >
                          {isExpanded ? (
                            <>
                              {strings.timeline.collapse}
                              <ChevronUp className="h-3 w-3" />
                            </>
                          ) : (
                            <>
                              {strings.timeline.expand}
                              <ChevronDown className="h-3 w-3" />
                            </>
                          )}
                        </button>
                      )}

                      {/* Footer: word count + sync status + actions */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span>
                            {reflection.wordCount} {strings.wordLimit}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            {getSyncIcon(reflection.syncStatus)}
                            <span>{getSyncLabel(reflection.syncStatus)}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEdit(reflection.localDate)}
                            aria-label={strings.accessibility.editEntry}
                            title={strings.timeline.edit}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition hover:bg-white/10 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">{strings.timeline.edit}</span>
                          </button>

                          <button
                            onClick={() => handleCopy(reflection.content)}
                            aria-label={strings.accessibility.copyEntry}
                            title={strings.timeline.copy}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition hover:bg-white/10 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span className="sr-only">{strings.timeline.copy}</span>
                          </button>

                          <button
                            onClick={() => setDeleteTarget(reflection.id)}
                            aria-label={strings.accessibility.deleteEntry}
                            title={strings.timeline.delete}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-300 transition hover:bg-red-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">{strings.timeline.delete}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="timeline-delete-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
            <h3 id="timeline-delete-title" className="text-base font-semibold text-foreground">
              {strings.timeline.delete}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{strings.timeline.deleteConfirm}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-white/25 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                {strings.timeline.cancel}
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                autoFocus
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {strings.timeline.deleteConfirmAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
