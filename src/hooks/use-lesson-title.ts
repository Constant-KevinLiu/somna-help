/**
 * useLessonTitle — async hook to load a localized lesson title.
 *
 * Wraps loadLesson with a module-level cache so the same lesson's title
 * is never fetched twice in the same session. Returns null while loading;
 * callers fall back to their own default (e.g. "Lesson N").
 *
 * Used by:
 *   - LessonTemplate (related-lesson cards)
 *   - ProgramWeeklyFocusSection (suggested lesson link)
 */
import { useState, useEffect } from "react";
import { loadLesson } from "@/lib/program-lessons";
import type { Lang } from "@/lib/i18n";

// Module-level cache: key = `${weekSlug}/${lessonSlug}/${lang}`
const titleCache = new Map<string, string>();

export function useLessonTitle(
  weekSlug: string,
  lessonSlug: string,
  lang: Lang
): string | null {
  const cacheKey = `${weekSlug}/${lessonSlug}/${lang}`;
  const [title, setTitle] = useState<string | null>(
    () => titleCache.get(cacheKey) ?? null
  );

  useEffect(() => {
    if (titleCache.has(cacheKey)) {
      setTitle(titleCache.get(cacheKey)!);
      return;
    }
    let active = true;
    loadLesson(weekSlug, lessonSlug, lang)
      .then((lesson) => {
        if (!lesson || !active) return;
        const t = (lesson.i18n[lang] ?? lesson.i18n.en!).title;
        titleCache.set(cacheKey, t);
        setTitle(t);
      })
      .catch(() => {
        /* ignore — caller falls back to neutral label */
      });
    return () => {
      active = false;
    };
  }, [cacheKey, lang]);

  return title;
}
