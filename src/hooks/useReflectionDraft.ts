/**
 * Hook for managing reflection drafts with autosave.
 *
 * Features:
 * - Debounced autosave of draft (separate from committed history)
 * - Explicit Save commits to history and clears draft
 * - Draft recovery on mount
 * - Save status tracking
 * - Word limit enforcement
 * - Success toast only fires after successful persistence
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import type { ContentLocale } from "@/content/content-types";
import { getContentLocale } from "@/lib/locale-registry";
import type {
  LocalReflection,
  SaveStatus,
  ReflectionDraft,
} from "@/lib/reflection/reflection-types";
import {
  saveReflection,
  getReflectionByDate,
  generateReflectionId,
  getLocalTimezone,
  todayLocalISO,
  loadDraft,
  saveDraft,
  clearDraft,
} from "@/lib/reflection/reflection-storage";
import { countWords, MAX_WORDS } from "@/lib/reflection/reflection-word-count";
import { selectDailyPrompts } from "@/lib/reflection/reflection-prompts";
import type { SupportedLocale } from "@/lib/locale-registry";

interface UseReflectionDraftOptions {
  locale: SupportedLocale;
  initialDate?: string;
}

interface UseReflectionDraftReturn {
  content: string;
  setContent: (content: string) => void;
  wordCount: number;
  isAtWordLimit: boolean;
  prompts: ReturnType<typeof selectDailyPrompts>;
  saveStatus: SaveStatus;
  lastSavedAt: string | null;
  localDate: string;
  /** Explicitly save (commit) the reflection to history */
  manualSave: () => boolean;
  isEditing: boolean;
  contentLocale: ContentLocale;
}

const AUTOSAVE_DEBOUNCE_MS = 1500;

export function useReflectionDraft({
  locale,
  initialDate,
}: UseReflectionDraftOptions): UseReflectionDraftReturn {
  // Map UI locale to content locale (e.g. "pt" → "pt-BR")
  const contentLocale = getContentLocale(locale) as ContentLocale;

  const localDate = initialDate || todayLocalISO();
  const [content, setContentState] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasUnsavedChangesRef = useRef(false);

  const wordCount = countWords(content);
  const isAtWordLimit = wordCount >= MAX_WORDS;

  const prompts = selectDailyPrompts(localDate, contentLocale);

  // Load existing committed entry or draft on mount
  useEffect(() => {
    const committed = getReflectionByDate(localDate);
    if (committed) {
      setContentState(committed.content);
      setLastSavedAt(committed.updatedAt);
      setIsEditing(true);
      return;
    }

    // No committed entry — check for a draft
    const draft = loadDraft(localDate);
    if (draft) {
      setContentState(draft.content);
      setLastSavedAt(draft.updatedAt);
      setSaveStatus("unsaved");
      setIsEditing(false);
    }
  }, [localDate]);

  // Autosave draft effect (saves to draft storage, NOT committed history)
  useEffect(() => {
    if (!hasUnsavedChangesRef.current) return;

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    setSaveStatus("unsaved");

    autosaveTimeoutRef.current = setTimeout(() => {
      performDraftSave();
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [content]);

  // Flush pending draft save on page hide
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasUnsavedChangesRef.current) {
        performDraftSave();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  /**
   * Save the current content as a draft (does NOT commit to history).
   * Drafts are stored under a separate key and don't appear in history.
   */
  const performDraftSave = useCallback(() => {
    if (!hasUnsavedChangesRef.current) return;

    try {
      const draft: ReflectionDraft = {
        version: "1",
        localDate,
        locale: contentLocale,
        promptIds: prompts.map((p) => p.id),
        promptCategories: prompts.map((p) => p.category),
        content,
        wordCount,
        updatedAt: new Date().toISOString(),
      };

      saveDraft(draft);
      setLastSavedAt(draft.updatedAt);
      setSaveStatus("saved");
      hasUnsavedChangesRef.current = false;
    } catch (error) {
      setSaveStatus("error");
      console.error("[Reflection] Draft autosave failed:", error);
    }
  }, [localDate, contentLocale, prompts, content, wordCount]);

  /**
   * Explicitly commit the reflection to history.
   *
   * This is the real "Save Reflection" action:
   * 1. Writes to committed history storage
   * 2. Clears the draft
   * 3. Only shows success toast AFTER successful persistence
   *
   * Returns true if save succeeded, false otherwise.
   */
  const performCommit = useCallback((): boolean => {
    if (content.trim().length === 0) {
      return false;
    }

    setSaveStatus("saving");

    try {
      const existing = getReflectionByDate(localDate);
      const now = new Date().toISOString();

      const reflection: LocalReflection = {
        id: existing?.id || generateReflectionId(),
        localDate,
        timezone: getLocalTimezone(),
        locale: contentLocale,
        promptIds: prompts.map((p) => p.id),
        promptCategories: prompts.map((p) => p.category),
        content,
        wordCount,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        syncStatus: "local",
      };

      const saved = saveReflection(reflection);

      // Clear the draft since we've committed
      clearDraft();

      setLastSavedAt(saved.updatedAt);
      setSaveStatus("saved");
      hasUnsavedChangesRef.current = false;
      setIsEditing(true);

      return true;
    } catch (error) {
      setSaveStatus("error");
      console.error("[Reflection] Commit failed:", error);
      return false;
    }
  }, [localDate, contentLocale, prompts, content, wordCount]);

  const setContent = useCallback(
    (newContent: string) => {
      // Only enforce word limit when adding content
      const newWordCount = countWords(newContent);
      if (newWordCount > MAX_WORDS && newWordCount > wordCount) {
        return; // Block content that would exceed the limit
      }

      setContentState(newContent);
      hasUnsavedChangesRef.current = true;
    },
    [wordCount],
  );

  const manualSave = useCallback((): boolean => {
    // Cancel any pending draft autosave
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    const success = performCommit();

    // IMPORTANT: toast only fires if persistence succeeded
    if (success) {
      toast.success(
        contentLocale === "en"
          ? "Reflection saved successfully"
          : contentLocale === "es"
            ? "Reflexión guardada correctamente"
            : contentLocale === "pt-BR"
              ? "Reflexão salva com sucesso"
              : contentLocale === "pl"
                ? "Refleksja zapisana pomyślnie"
                : "Reflection saved successfully",
      );
    } else {
      toast.error(
        contentLocale === "en"
          ? "Could not save your reflection. Please try again."
          : contentLocale === "es"
            ? "No se pudo guardar tu reflexión. Inténtalo de nuevo."
            : contentLocale === "pt-BR"
              ? "Não foi possível salvar sua reflexão. Tente novamente."
              : contentLocale === "pl"
                ? "Nie udało się zapisać refleksji. Spróbuj ponownie."
                : "Could not save your reflection. Please try again.",
      );
    }

    return success;
  }, [performCommit, contentLocale]);

  return {
    content,
    setContent,
    wordCount,
    isAtWordLimit,
    prompts,
    saveStatus,
    lastSavedAt,
    localDate,
    manualSave,
    isEditing,
    contentLocale,
  };
}
