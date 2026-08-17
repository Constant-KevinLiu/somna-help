/**
 * Reflection history view component.
 *
 * Features:
 * - List of all past reflections
 * - Edit and delete actions
 * - Delete confirmation dialog
 * - Empty state
 */

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { getContentLocale } from "@/lib/locale-registry";
import {
  getSortedReflections,
  deleteReflection,
  todayLocalISO,
} from "@/lib/reflection/reflection-storage";
import type { LocalReflection } from "@/lib/reflection/reflection-types";
import { ReflectionHistoryItem } from "./ReflectionHistoryItem";
import type { ContentLocale } from "@/content/content-types";
import { EN_REFLECTION_UI } from "@/content/en/diary/reflection-ui";
import { ES_REFLECTION_UI } from "@/content/es/diary/reflection-ui";
import { PT_BR_REFLECTION_UI } from "@/content/pt-BR/diary/reflection-ui";
import { PL_REFLECTION_UI } from "@/content/pl/diary/reflection-ui";
import type { SupportedLocale } from "@/lib/locale-registry";

const UI_STRINGS: Partial<
  Record<ContentLocale, import("@/content/en/diary/reflection-ui").ReflectionUiStrings>
> = {
  en: EN_REFLECTION_UI,
  es: ES_REFLECTION_UI,
  "pt-BR": PT_BR_REFLECTION_UI,
  pl: PL_REFLECTION_UI,
};

interface ReflectionHistoryProps {
  onBack: () => void;
  onEditDate: (date: string) => void;
}

export function ReflectionHistory({ onBack, onEditDate }: ReflectionHistoryProps) {
  const { lang } = useI18n();
  const uiLocale = lang as SupportedLocale;
  const contentLocale = getContentLocale(uiLocale) as ContentLocale;
  const strings = UI_STRINGS[contentLocale] ?? EN_REFLECTION_UI;

  const [reflections, setReflections] = useState<LocalReflection[]>(() => getSortedReflections());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setReflections(getSortedReflections());
  }, []);

  // Refresh when component mounts (in case data changed while hidden)
  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleDelete = (id: string) => {
    try {
      deleteReflection(id);
      refresh();
      toast.success(strings.toast.deleted);
    } catch (error) {
      toast.error(strings.toast.deleteError);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="glass-strong space-y-6 rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{strings.history.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {reflections.length} {strings.stats.total}
          </p>
        </div>
        <button
          onClick={onBack}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-white/25 hover:bg-white/10"
        >
          {strings.history.backToToday}
        </button>
      </div>

      {reflections.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">{strings.history.empty}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reflections.map((reflection) => (
            <ReflectionHistoryItem
              key={reflection.id}
              reflection={reflection}
              locale={contentLocale}
              onEdit={() => onEditDate(reflection.localDate)}
              onDelete={() => setDeleteTarget(reflection.id)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
            <h3 id="delete-dialog-title" className="text-base font-semibold text-foreground">
              {contentLocale === "en"
                ? "Delete Reflection"
                : contentLocale === "es"
                  ? "Eliminar Reflexión"
                  : contentLocale === "pt-BR"
                    ? "Excluir Reflexão"
                    : contentLocale === "pl"
                      ? "Usuń Refleksję"
                      : "Delete Reflection"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{strings.history.deleteConfirm}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-white/25 hover:bg-white/10"
              >
                {strings.history.cancel}
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-background"
              >
                {strings.history.deleteConfirmAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
