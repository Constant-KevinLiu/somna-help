/**
 * Phase F — Weekly Reflection Flow Component
 *
 * Guided weekly reflection with rule-selected prompts.
 * Users may skip any prompt, edit saved reflections, and all data is user-owned.
 *
 * Saving does NOT modify diary records — reflections are stored separately.
 */

import { useState, useEffect } from "react";
import { BookOpen, Save, Edit3, Trash2, ChevronRight, ChevronLeft } from "lucide-react";
import type { SleepRecord } from "@/lib/sleep-records";
import type { HabitProgress } from "@/services/habit/habit-types";
import type {
  WeeklyReflection,
  WeeklyReflectionPrompt,
  WeeklyReflectionResponse,
} from "@/lib/weekly-reflection/types";
import type { Locale } from "@/content/content-types";
import { selectWeeklyPrompts } from "@/lib/weekly-reflection/prompts";
import {
  getWeeklyReflectionByWeek,
  saveWeeklyReflection,
  deleteWeeklyReflection,
  generateWeeklyReflectionId,
  calculateWordCount,
  getLocalTimezone,
} from "@/lib/weekly-reflection/storage";
import { weekStart, weekEnd } from "@/lib/analytics/date-ranges";
import { cn } from "@/lib/utils";

interface WeeklyReflectionFlowProps {
  records: SleepRecord[];
  habitProgress: Map<string, HabitProgress>;
  weekDate: string;
  t: (key: string) => string;
  locale: string;
  className?: string;
}

export function WeeklyReflectionFlow({
  records,
  habitProgress,
  weekDate,
  t,
  locale,
  className,
}: WeeklyReflectionFlowProps) {
  const weekStartStr = weekStart(weekDate);
  const weekEndStr = weekEnd(weekDate);

  const [prompts, setPrompts] = useState<WeeklyReflectionPrompt[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [savedReflection, setSavedReflection] = useState<WeeklyReflection | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Load saved reflection and generate prompts (client-side only)
  useEffect(() => {
    setIsHydrated(true);

    // Load any saved reflection for this week
    const saved = getWeeklyReflectionByWeek(weekStartStr);
    if (saved) {
      setSavedReflection(saved);
      const responseMap: Record<string, string> = {};
      for (const resp of saved.responses) {
        responseMap[resp.promptId] = resp.content;
      }
      setResponses(responseMap);
    }

    // Generate prompts for this week's data
    const weekRecords = records.filter((r) => r.date >= weekStartStr && r.date <= weekEndStr);
    const selectedPrompts = selectWeeklyPrompts(weekRecords, habitProgress, weekStartStr);
    setPrompts(selectedPrompts);
  }, [weekStartStr, weekEndStr, records, habitProgress]);

  if (!isHydrated) {
    return (
      <div className={cn("glass-strong rounded-3xl p-6 md:p-8", className)}>
        <div className="h-20 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  const handleSave = () => {
    setSaveStatus("saving");

    try {
      const responseList: WeeklyReflectionResponse[] = prompts
        .filter((p) => responses[p.id] && responses[p.id].trim().length > 0)
        .map((p) => ({
          promptId: p.id,
          category: p.category,
          content: responses[p.id].trim(),
        }));

      if (responseList.length === 0 && !savedReflection) {
        setSaveStatus("idle");
        return;
      }

      const now = new Date().toISOString();
      const reflection: WeeklyReflection = savedReflection
        ? {
            ...savedReflection,
            responses: responseList,
            wordCount: calculateWordCount(responseList),
            updatedAt: now,
          }
        : {
            id: generateWeeklyReflectionId(),
            weekStart: weekStartStr,
            weekEnd: weekEndStr,
            timezone: getLocalTimezone(),
            locale: locale as Locale,
            responses: responseList,
            wordCount: calculateWordCount(responseList),
            createdAt: now,
            updatedAt: now,
            syncStatus: "local",
          };

      saveWeeklyReflection(reflection);
      setSavedReflection(reflection);
      setIsEditing(false);
      setSaveStatus("saved");

      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    }
  };

  const handleDelete = () => {
    if (!savedReflection) return;
    if (!confirm("Delete this week's reflection?")) return;

    deleteWeeklyReflection(savedReflection.id);
    setSavedReflection(null);
    setResponses({});
    setIsEditing(false);
  };

  const hasAnyResponse = Object.values(responses).some((v) => v.trim().length > 0);

  const totalWords = Object.values(responses).reduce(
    (count, text) => count + (text.trim() ? text.trim().split(/\s+/).length : 0),
    0,
  );

  const showSaved = savedReflection && !isEditing;

  return (
    <div className={cn("glass-strong rounded-3xl p-6 md:p-8 animate-fade-up", className)}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <BookOpen className="h-3.5 w-3.5 text-accent" />
        {t("reflection.weekly.title")}
      </div>

      <p className="mt-1 text-sm text-muted-foreground">{t("reflection.weekly.subtitle")}</p>

      {/* Saved view */}
      {showSaved && (
        <div className="mt-5 space-y-4">
          {savedReflection.responses.map((resp, idx) => {
            const prompt = prompts.find((p) => p.id === resp.promptId);
            if (!prompt) return null;
            return (
              <div
                key={resp.promptId}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="text-xs uppercase tracking-wider text-accent/80">
                  {idx + 1}. {t(prompt.textKey)}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {resp.content}
                </p>
              </div>
            );
          })}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {savedReflection.wordCount} {t("reflection.weekly.words")}
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1 text-accent hover:text-accent/80"
              >
                <Edit3 className="h-3 w-3" />
                {t("reflection.weekly.edit")}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1 text-red-400/70 hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
                {t("reflection.weekly.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / new view */}
      {!showSaved && prompts.length > 0 && (
        <div className="mt-5">
          <p className="text-sm text-foreground/80 mb-4">{t("reflection.weekly.intro")}</p>

          {/* Progress */}
          <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {currentPromptIdx + 1} / {prompts.length}
            </span>
            <span>
              {totalWords} {t("reflection.weekly.words")}
            </span>
          </div>

          {/* Current prompt */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-medium text-foreground">
              {t(prompts[currentPromptIdx].textKey)}
            </div>
            <textarea
              value={responses[prompts[currentPromptIdx].id] ?? ""}
              onChange={(e) =>
                setResponses({
                  ...responses,
                  [prompts[currentPromptIdx].id]: e.target.value,
                })
              }
              placeholder={t(prompts[currentPromptIdx].placeholderKey)}
              className="mt-3 w-full h-32 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 resize-none outline-none"
              aria-label={t(prompts[currentPromptIdx].textKey)}
            />
          </div>

          {/* Navigation */}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentPromptIdx(Math.max(0, currentPromptIdx - 1))}
              disabled={currentPromptIdx === 0}
              className={cn(
                "inline-flex items-center gap-1 text-sm",
                currentPromptIdx === 0
                  ? "text-muted-foreground/30 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              type="button"
              onClick={() => setCurrentPromptIdx(currentPromptIdx + 1)}
              disabled={currentPromptIdx >= prompts.length - 1}
              className={cn(
                "inline-flex items-center gap-1 text-sm",
                currentPromptIdx >= prompts.length - 1
                  ? "text-muted-foreground/30 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t("reflection.weekly.skip")}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Save button */}
          <div className="mt-5 flex items-center justify-end gap-3">
            {saveStatus === "saved" && (
              <span className="text-sm text-green-400">{t("reflection.weekly.saved")}</span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasAnyResponse || saveStatus === "saving"}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition",
                hasAnyResponse
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:scale-[1.02]"
                  : "bg-white/5 text-muted-foreground cursor-not-allowed",
              )}
            >
              <Save className="h-4 w-4" />
              {t("reflection.weekly.save")}
            </button>
          </div>
        </div>
      )}

      {/* Empty state (no prompts — shouldn't happen but safe) */}
      {prompts.length === 0 && !showSaved && (
        <p className="mt-4 text-sm text-muted-foreground">{t("reflection.weekly.empty")}</p>
      )}
    </div>
  );
}
