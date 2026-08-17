/**
 * Main Guided CBT-I Reflection card component.
 *
 * Integrates:
 * - Three daily prompts
 * - Text editor with word count
 * - Autosave status
 * - Manual save button
 * - History view toggle
 * - Progressive authentication entry point
 */

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { getContentLocale } from "@/lib/locale-registry";
import { useReflectionDraft } from "@/hooks/useReflectionDraft";
import { ReflectionPromptsList } from "./ReflectionPromptsList";
import { ReflectionEditor } from "./ReflectionEditor";
import { EN_REFLECTION_UI } from "@/content/en/diary/reflection-ui";
import { ES_REFLECTION_UI } from "@/content/es/diary/reflection-ui";
import { PT_BR_REFLECTION_UI } from "@/content/pt-BR/diary/reflection-ui";
import { PL_REFLECTION_UI } from "@/content/pl/diary/reflection-ui";
import type { ContentLocale } from "@/content/content-types";
import type { ReflectionUiStrings } from "@/content/en/diary/reflection-ui";
import { todayLocalISO } from "@/lib/reflection/reflection-storage";
import type { SupportedLocale } from "@/lib/locale-registry";

const UI_STRINGS: Partial<Record<ContentLocale, ReflectionUiStrings>> = {
  en: EN_REFLECTION_UI,
  es: ES_REFLECTION_UI,
  "pt-BR": PT_BR_REFLECTION_UI,
  pl: PL_REFLECTION_UI,
};

interface GuidedReflectionCardProps {
  onViewHistory: () => void;
  onOpenAuth?: () => void;
  /** Optional: notify parent after a successful save (for history refresh) */
  onSaved?: () => void;
}

export function GuidedReflectionCard({
  onViewHistory,
  onOpenAuth,
  onSaved,
}: GuidedReflectionCardProps) {
  const { lang } = useI18n();
  const uiLocale = lang as SupportedLocale;
  const contentLocale = getContentLocale(uiLocale) as ContentLocale;
  const strings = UI_STRINGS[contentLocale] ?? EN_REFLECTION_UI;

  const today = todayLocalISO();

  const {
    content,
    setContent,
    wordCount,
    isAtWordLimit,
    prompts,
    saveStatus,
    manualSave,
    isEditing,
  } = useReflectionDraft({ locale: uiLocale, initialDate: today });

  const handleSave = () => {
    const success = manualSave();
    if (success && onSaved) {
      onSaved();
    }
  };

  return (
    <div className="glass-strong space-y-6 rounded-3xl p-6 md:p-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{strings.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{strings.subtitle}</p>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-accent">
          {strings.promptsHeader}
        </h3>
        <ReflectionPromptsList prompts={prompts} locale={contentLocale} />
      </div>

      <ReflectionEditor
        content={content}
        onChange={setContent}
        wordCount={wordCount}
        isAtWordLimit={isAtWordLimit}
        saveStatus={saveStatus}
        locale={contentLocale}
        strings={strings}
        ariaLabel={strings.accessibility.editorLabel}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleSave}
          disabled={content.trim().length === 0}
          className="rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          {strings.saveButton}
        </button>

        <button
          onClick={onViewHistory}
          className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium transition hover:border-white/25 hover:bg-white/10"
        >
          {strings.historyButton}
        </button>

        {onOpenAuth && (
          <button
            onClick={onOpenAuth}
            className="text-sm text-muted-foreground underline decoration-dotted underline-offset-4 transition hover:text-foreground"
          >
            {strings.syncButton}
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground/70">{strings.privacy}</p>
    </div>
  );
}
