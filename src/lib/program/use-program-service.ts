/**
 * Sleep Diary v2.5 — useProgramService React Hook
 *
 * React hook that provides the Program service to UI components.
 * This is the single entry point for Program data in the React tree.
 *
 * All routes and components that need Program progress should use this hook
 * instead of importing from `@/lib/program-progress` (legacy).
 *
 * Guarantees:
 *  - SSR-safe: returns initial/not-started state on the server
 *  - Hydration-stable: first client render matches SSR
 *  - All writes go through event dispatching (applyEvent)
 *  - Legacy data is migrated transparently on first load
 *  - Forward-schema guard: future schema versions are read-only
 *  - Cross-tab / cross-component reactivity via custom event
 *
 * Usage:
 *   const {
 *     progress,
 *     hydrated,
 *     definition,
 *     completeLesson,
 *     uncompleteLesson,
 *     getWeekStatus,
 *     getWeekCompletion,
 *     overallCompletion,
 *     currentWeek,
 *     recommendedNext,
 *     milestones,
 *     isUnsupportedSchema,
 *   } = useProgramService();
 */

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import type {
  ProgramProgress,
  ProgramDefinition,
  ProgramMilestone,
  WeekAccessStatus,
  ProgramMutationBlockReason,
} from "./types";
import { applyEvent, createInitialProgress, CANONICAL_PROGRESS_KEY } from "./service";
import {
  loadProgramProgressResult,
  saveProgramProgress,
  isUnsupportedSchema as _isUnsupportedSchema,
  type UnsupportedProgramSchema,
} from "./storage";
import { getProgramDefinition } from "./definition";

// Custom event name for in-tab / cross-tab reactivity
const PROGRAM_CHANGE_EVENT = "somna-program-progress-change";

// =============================================================================
// Hook Return Type
// =============================================================================

export type ProgramLoadStatus =
  "loading" | "ready" | "empty" | "migrated" | "unsupported-version" | "corrupted";

/**
 * Result of a Program service action.
 *
 *  - "applied": action succeeded, state was updated and persisted
 *  - "blocked": action was rejected by the state machine; state unchanged
 *  - "unchanged": action was valid but a no-op (idempotent re-apply)
 *  - "unsupported-version": stored schema is newer; write skipped
 *
 * UI layers may use this for feedback (toasts, error states, etc.).
 */
export type ProgramActionResult =
  | { status: "applied" }
  | { status: "blocked"; reason: ProgramMutationBlockReason }
  | { status: "unchanged" }
  | { status: "unsupported-version" };

export interface UseProgramServiceResult {
  /** The canonical program definition. */
  definition: ProgramDefinition;
  /** Current program progress (may be fallback if schema is unsupported). */
  progress: ProgramProgress;
  /** Whether the client-side hydration has completed. */
  hydrated: boolean;
  /**
   * Load status of the program progress data.
   *
   *  - "loading": SSR / not yet hydrated
   *  - "ready": normal load, progress is user's real data
   *  - "empty": no stored progress (never started)
   *  - "migrated": data was migrated from legacy schema
   *  - "unsupported-version": stored schema is newer than supported
   *  - "corrupted": stored data was malformed
   */
  loadStatus: ProgramLoadStatus;
  /** If true, the stored data has a future schema version we don't understand. */
  isUnsupportedSchema: boolean;
  /** The unsupported-schema info (only set when isUnsupportedSchema is true). */
  unsupportedSchemaInfo: UnsupportedProgramSchema | null;
  /** Overall completion percentage (0-100). */
  overallCompletion: number;
  /** The current week ID (e.g. "week-1"), or null if not started. */
  currentWeekId: string | null;
  /** Recommended next lesson definition, or null if all complete / not started. */
  recommendedNextLesson: ReturnType<typeof import("./types").getRecommendedNextLesson>;
  /** Milestones from progress (ordered by definition). */
  milestones: ProgramMilestone[];
  /** Earned badges as simple string IDs (same shape as legacy for compat). */
  earnedBadgeIds: string[];

  /** Get access status for a week (locked/available/completed). */
  getWeekStatus: (weekId: string) => WeekAccessStatus;
  /** Get completion percentage for a week (0-100). */
  getWeekCompletion: (weekId: string) => number;
  /** Count completed lessons in a week. */
  getWeekCompletedCount: (weekId: string) => number;

  /** Mark a lesson as completed (idempotent). Dispatches lesson_completed event. */
  completeLesson: (lessonId: string, weekId: string) => ProgramActionResult;
  /** Un-mark a lesson as completed. Dispatches lesson_uncompleted event. */
  uncompleteLesson: (lessonId: string, weekId: string) => ProgramActionResult;
  /** Toggle lesson completion. */
  toggleLesson: (lessonId: string, weekId: string) => ProgramActionResult;

  /** Start the program (transition from not_started to active). */
  startProgram: () => ProgramActionResult;
  /** Pause the program. */
  pauseProgram: () => ProgramActionResult;
  /** Resume the program. */
  resumeProgram: () => ProgramActionResult;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export function useProgramService(): UseProgramServiceResult {
  const definition = useMemo(() => getProgramDefinition(), []);

  // SSR: start with initial progress (not_started, empty)
  const [progress, setProgress] = useState<ProgramProgress>(() => createInitialProgress());
  const [hydrated, setHydrated] = useState(false);
  const [loadStatus, setLoadStatus] = useState<ProgramLoadStatus>("loading");
  const [isUnsupportedSchema, setIsUnsupportedSchema] = useState(false);
  const [unsupportedSchemaInfo, setUnsupportedSchemaInfo] =
    useState<UnsupportedProgramSchema | null>(null);

  // Keep latest progress in a ref for event handlers to avoid stale closures
  const progressRef = useRef<ProgramProgress>(progress);
  progressRef.current = progress;

  const loadStatusRef = useRef<ProgramLoadStatus>("loading");
  loadStatusRef.current = loadStatus;

  const unsupportedRef = useRef(false);
  unsupportedRef.current = isUnsupportedSchema;

  // ===========================================================================
  // Load on mount (client-side only)
  // ===========================================================================

  useEffect(() => {
    const result = loadProgramProgressResult(definition);

    applyLoadResult(result);
    setHydrated(true);

    // Helper: apply a load result to React state
    function applyLoadResult(result: import("./storage").ProgramLoadResult) {
      switch (result.status) {
        case "ready":
        case "empty":
        case "migrated":
        case "corrupted":
          setIsUnsupportedSchema(false);
          setUnsupportedSchemaInfo(null);
          setProgress(result.progress);
          setLoadStatus(result.status);
          break;
        case "unsupported-version":
          setIsUnsupportedSchema(true);
          setUnsupportedSchemaInfo({
            kind: "unsupported_schema",
            storedSchemaVersion: result.storedVersion,
            supportedSchemaVersion: result.supportedVersion,
            raw: result.raw,
            fallback: result.fallback,
          });
          setProgress(result.fallback);
          setLoadStatus("unsupported-version");
          break;
      }
    }

    // Listen for cross-tab / cross-component changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CANONICAL_PROGRESS_KEY) {
        const reloaded = loadProgramProgressResult(definition);
        applyLoadResult(reloaded);
      }
    };

    const handleCustomChange = () => {
      const reloaded = loadProgramProgressResult(definition);
      applyLoadResult(reloaded);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(PROGRAM_CHANGE_EVENT, handleCustomChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(PROGRAM_CHANGE_EVENT, handleCustomChange as EventListener);
    };
  }, [definition]);

  // ===========================================================================
  // State mutation helpers
  // ===========================================================================

  const persistAndNotify = useCallback((next: ProgramProgress): boolean => {
    // Don't persist if we have an unsupported schema (never overwrite newer data)
    if (unsupportedRef.current) {
      if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
        console.warn(
          "[program-service] Write blocked: stored program schema is newer than supported.",
        );
      }
      return false;
    }

    const saved = saveProgramProgress(next);
    if (saved) {
      // Notify other components in the same tab
      const event = new CustomEvent(PROGRAM_CHANGE_EVENT);
      window.dispatchEvent(event);
    }
    return saved;
  }, []);

  // ===========================================================================
  // Public action methods
  // ===========================================================================

  const completeLesson = useCallback(
    (lessonId: string, weekId: string): ProgramActionResult => {
      // Write-blocked when schema is unsupported
      if (unsupportedRef.current) return { status: "unsupported-version" };
      const current = progressRef.current;
      const event: import("./types").LessonCompletedEvent = {
        type: "lesson_completed",
        lessonId,
        weekId,
        timestamp: new Date().toISOString(),
      };
      const result = applyEvent(current, event, definition);
      if (result.status === "applied") {
        setProgress(result.progress);
        persistAndNotify(result.progress);
        return { status: "applied" };
      }
      if (result.status === "blocked") {
        return { status: "blocked", reason: result.reason };
      }
      return { status: "unchanged" };
    },
    [definition, persistAndNotify],
  );

  const uncompleteLesson = useCallback(
    (lessonId: string, weekId: string): ProgramActionResult => {
      // Write-blocked when schema is unsupported
      if (unsupportedRef.current) return { status: "unsupported-version" };
      const current = progressRef.current;
      const event: import("./types").LessonUncompletedEvent = {
        type: "lesson_uncompleted",
        lessonId,
        weekId,
        timestamp: new Date().toISOString(),
      };
      const result = applyEvent(current, event, definition);
      if (result.status === "applied") {
        setProgress(result.progress);
        persistAndNotify(result.progress);
        return { status: "applied" };
      }
      if (result.status === "blocked") {
        return { status: "blocked", reason: result.reason };
      }
      return { status: "unchanged" };
    },
    [definition, persistAndNotify],
  );

  const toggleLesson = useCallback(
    (lessonId: string, weekId: string): ProgramActionResult => {
      const current = progressRef.current;
      if (current.completedLessonIds.includes(lessonId)) {
        return uncompleteLesson(lessonId, weekId);
      } else {
        return completeLesson(lessonId, weekId);
      }
    },
    [completeLesson, uncompleteLesson],
  );

  const startProgram = useCallback((): ProgramActionResult => {
    // Write-blocked when schema is unsupported
    if (unsupportedRef.current) return { status: "unsupported-version" };
    const current = progressRef.current;
    const event: import("./types").ProgramStartedEvent = {
      type: "program_started",
      programId: definition.id,
      timestamp: new Date().toISOString(),
    };
    const result = applyEvent(current, event, definition);
    if (result.status === "applied") {
      setProgress(result.progress);
      persistAndNotify(result.progress);
      return { status: "applied" };
    }
    if (result.status === "blocked") {
      return { status: "blocked", reason: result.reason };
    }
    return { status: "unchanged" };
  }, [definition, persistAndNotify]);

  const pauseProgram = useCallback((): ProgramActionResult => {
    // Write-blocked when schema is unsupported
    if (unsupportedRef.current) return { status: "unsupported-version" };
    const current = progressRef.current;
    const event: import("./types").ProgramPausedEvent = {
      type: "program_paused",
      programId: definition.id,
      timestamp: new Date().toISOString(),
    };
    const result = applyEvent(current, event, definition);
    if (result.status === "applied") {
      setProgress(result.progress);
      persistAndNotify(result.progress);
      return { status: "applied" };
    }
    if (result.status === "blocked") {
      return { status: "blocked", reason: result.reason };
    }
    return { status: "unchanged" };
  }, [definition, persistAndNotify]);

  const resumeProgram = useCallback((): ProgramActionResult => {
    // Write-blocked when schema is unsupported
    if (unsupportedRef.current) return { status: "unsupported-version" };
    const current = progressRef.current;
    const event: import("./types").ProgramResumedEvent = {
      type: "program_resumed",
      programId: definition.id,
      timestamp: new Date().toISOString(),
    };
    const result = applyEvent(current, event, definition);
    if (result.status === "applied") {
      setProgress(result.progress);
      persistAndNotify(result.progress);
      return { status: "applied" };
    }
    if (result.status === "blocked") {
      return { status: "blocked", reason: result.reason };
    }
    return { status: "unchanged" };
  }, [definition, persistAndNotify]);

  // ===========================================================================
  // Derived values
  // ===========================================================================

  const overallCompletion = useMemo(() => {
    const total = definition.lessons.length;
    if (total === 0) return 0;
    return Math.round((progress.completedLessonIds.length / total) * 100);
  }, [progress.completedLessonIds, definition.lessons.length]);

  const currentWeekId = useMemo(() => {
    // Use the currentWeekId from progress if set and valid
    if (progress.currentWeekId) {
      const week = definition.weeks.find((w) => w.id === progress.currentWeekId);
      if (week) return week.id;
    }
    // Derive from first incomplete lesson
    const nextLesson = definition.lessons.find((l) => !progress.completedLessonIds.includes(l.id));
    return nextLesson?.weekId ?? null;
  }, [progress.currentWeekId, progress.completedLessonIds, definition]);

  const recommendedNextLesson = useMemo(() => {
    return definition.lessons.find((l) => !progress.completedLessonIds.includes(l.id)) ?? null;
  }, [progress.completedLessonIds, definition.lessons]);

  const milestones = useMemo(() => progress.milestones, [progress.milestones]);

  const earnedBadgeIds = useMemo(
    () => progress.milestones.filter((m) => m.earnedAt !== null).map((m) => m.id),
    [progress.milestones],
  );

  // ===========================================================================
  // Per-week derived values (callable functions, not memoized per-week)
  // ===========================================================================

  const getWeekStatus = useCallback(
    (weekId: string): WeekAccessStatus => {
      const week = definition.weeks.find((w) => w.id === weekId);
      if (!week) return "locked";

      const completedInWeek = week.lessonIds.filter((id) =>
        progress.completedLessonIds.includes(id),
      ).length;

      if (completedInWeek === week.lessonIds.length && week.lessonIds.length > 0) {
        return "completed";
      }

      if (week.order === 1) return "available";

      // Previous week completed → available
      const prevWeek = definition.weeks.find((w) => w.order === week.order - 1);
      if (prevWeek) {
        const prevCompleted = prevWeek.lessonIds.filter((id) =>
          progress.completedLessonIds.includes(id),
        ).length;
        if (prevCompleted === prevWeek.lessonIds.length) return "available";
      }

      // User already started this week → available
      if (completedInWeek > 0) return "available";

      return "locked";
    },
    [progress.completedLessonIds, definition],
  );

  const getWeekCompletion = useCallback(
    (weekId: string): number => {
      const week = definition.weeks.find((w) => w.id === weekId);
      if (!week || week.lessonIds.length === 0) return 0;
      const done = week.lessonIds.filter((id) => progress.completedLessonIds.includes(id)).length;
      return Math.round((done / week.lessonIds.length) * 100);
    },
    [progress.completedLessonIds, definition],
  );

  const getWeekCompletedCount = useCallback(
    (weekId: string): number => {
      const week = definition.weeks.find((w) => w.id === weekId);
      if (!week) return 0;
      return week.lessonIds.filter((id) => progress.completedLessonIds.includes(id)).length;
    },
    [progress.completedLessonIds, definition],
  );

  // ===========================================================================
  // Return value
  // ===========================================================================

  return {
    definition,
    progress,
    hydrated,
    loadStatus,
    isUnsupportedSchema,
    unsupportedSchemaInfo,
    overallCompletion,
    currentWeekId,
    recommendedNextLesson,
    milestones,
    earnedBadgeIds,
    getWeekStatus,
    getWeekCompletion,
    getWeekCompletedCount,
    completeLesson,
    uncompleteLesson,
    toggleLesson,
    startProgram,
    pauseProgram,
    resumeProgram,
  };
}

// =============================================================================
// Export event name for debugging / cross-module use
// =============================================================================

export const PROGRAM_CHANGE_EVENT_NAME = PROGRAM_CHANGE_EVENT;
