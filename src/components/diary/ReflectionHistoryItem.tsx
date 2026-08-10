/**
 * History list item for past reflections.
 */

import type { LocalReflection } from "@/lib/reflection/reflection-types";
import type { Locale as ContentLocale } from "@/content/content-types";
import { getCategoryLabel } from "@/lib/reflection/reflection-prompts";
import { format } from "date-fns";
import { enUS, es, ptBR, pl } from "date-fns/locale";
import type { Locale as DateFnsLocale } from "date-fns";

interface ReflectionHistoryItemProps {
  reflection: LocalReflection;
  locale: ContentLocale;
  onEdit: () => void;
  onDelete: () => void;
}

const DATE_LOCALES: Partial<Record<ContentLocale, DateFnsLocale>> = {
  en: enUS,
  es: es,
  "pt-BR": ptBR,
  pl: pl,
};

export function ReflectionHistoryItem({
  reflection,
  locale,
  onEdit,
  onDelete,
}: ReflectionHistoryItemProps) {
  const dateLocale = DATE_LOCALES[locale] ?? enUS;
  const formattedDate = format(new Date(reflection.localDate), "MMMM d, yyyy", {
    locale: dateLocale,
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/8">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h4 className="text-sm font-medium text-foreground">{formattedDate}</h4>
          <p className="text-xs text-muted-foreground">
            {reflection.wordCount} {locale === "pl" ? "słów" : "words"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium transition hover:bg-white/20"
          >
            {locale === "en"
              ? "Edit"
              : locale === "es"
                ? "Editar"
                : locale === "pt-BR"
                  ? "Editar"
                  : "Edytuj"}
          </button>
          <button
            onClick={onDelete}
            className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
          >
            {locale === "en"
              ? "Delete"
              : locale === "es"
                ? "Eliminar"
                : locale === "pt-BR"
                  ? "Excluir"
                  : "Usuń"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {reflection.promptCategories.slice(0, 3).map((category) => (
          <span
            key={category}
            className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent/90"
          >
            {getCategoryLabel(category, locale)}
          </span>
        ))}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
        {reflection.content.slice(0, 150)}...
      </p>
    </div>
  );
}
