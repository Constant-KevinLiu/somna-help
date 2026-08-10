/**
 * Hook for managing reflection drafts with autosave.
 *
 * Features:
 * - Debounced autosave after 1.5 seconds of inactivity
 * - Manual save
 * - Draft recovery on mount
 * - Save status tracking
 * - Word limit enforcement
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import type { Locale } from "@/content/content-types";
import type { LocalReflection, SaveStatus } from "@/lib/reflection/reflection-types";
import {
  saveReflection,
  getReflectionByDate,
  generateReflectionId,
  getLocalTimezone,
  todayLocalISO,
} from "@/lib/reflection/reflection-storage";
import { countWords, MAX_WORDS } from "@/lib/reflection/reflection-word-count";
import { selectDailyPrompts } from "@/lib/reflection/reflection-prompts";

interface UseReflectionDraftOptions {
  locale: Locale;
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
  manualSave: () => void;
  isEditing: boolean;
}

const AUTOSAVE_DEBOUNCE_MS = 1500;

export function useReflectionDraft({
  locale,
  initialDate,
}: UseReflectionDraftOptions): UseReflectionDraftReturn {
  const localDate = initialDate || todayLocalISO();
  const [content, setContentState] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasUnsavedChangesRef = useRef(false);

  const wordCount = countWords(content);
  const isAtWordLimit = wordCount >= MAX_WORDS;

  const prompts = selectDailyPrompts(localDate, locale);

  // Load existing draft on mount
  useEffect(() => {
    const existing = getReflectionByDate(localDate);
    if (existing) {
      setContentState(existing.content);
      setLastSavedAt(existing.updatedAt);
      setIsEditing(true);
    }
  }, [localDate]);

  // Autosave effect
  useEffect(() => {
    if (!hasUnsavedChangesRef.current) return;

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    setSaveStatus("unsaved");

    autosaveTimeoutRef.current = setTimeout(() => {
      performSave();
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [content]);

  // Flush pending save on page hide
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasUnsavedChangesRef.current) {
        performSave();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const performSave = useCallback(() => {
    setSaveStatus("saving");

    try {
      const existing = getReflectionByDate(localDate);
      const now = new Date().toISOString();

      const reflection: LocalReflection = {
        id: existing?.id || generateReflectionId(),
        localDate,
        timezone: getLocalTimezone(),
        locale,
        promptIds: prompts.map((p) => p.id),
        promptCategories: prompts.map((p) => p.category),
        content,
        wordCount,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        syncStatus: "local",
      };

      saveReflection(reflection);
      setLastSavedAt(now);
      setSaveStatus("saved");
      hasUnsavedChangesRef.current = false;
      setIsEditing(true);
    } catch (error) {
      setSaveStatus("error");
      console.error("[Reflection] Autosave failed:", error);
    }
  }, [localDate, locale, prompts, content, wordCount]);

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

  const manualSave = useCallback(() => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    performSave();
    toast.success(
      locale === "en"
        ? "Reflection saved successfully"
        : locale === "es"
          ? "Reflexión guardada correctamente"
          : locale === "pt-BR"
            ? "Reflexão salva com sucesso"
            : "Refleksja zapisana pomyślnie",
    );
  }, [performSave, locale]);

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
  };
}
