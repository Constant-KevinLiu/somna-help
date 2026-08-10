import { describe, it, expect, beforeEach } from "vitest";
import {
  createInitialProgress,
  applyEvent,
  migrateLegacyProgress,
  isLegacyProgress,
  DEFAULT_PROGRAM_ID,
} from "./service";
import type {
  ProgramProgress,
  ProgramDefinition,
  ProgramEvent,
  ProgramMutationResult,
} from "./types";
import { isValidStatusTransition, calculateOverallCompletion } from "./types";
import { getProgramDefinition } from "./definition";

describe("program/service", () => {
  let definition: ProgramDefinition;

  beforeEach(() => {
    definition = getProgramDefinition();
  });

  // Helper: unwrap an "applied" result or throw.
  function appliedOrThrow(result: ProgramMutationResult): ProgramProgress {
    if (result.status !== "applied") {
      throw new Error(`Expected applied, got ${result.status}`);
    }
    return result.progress;
  }

  // =========================================================================
  // Initial state
  // =========================================================================

  describe("createInitialProgress", () => {
    it("creates progress with not_started status", () => {
      const p = createInitialProgress();
      expect(p.status).toBe("not_started");
      expect(p.startedAt).toBeNull();
      expect(p.completedAt).toBeNull();
      expect(p.currentWeekId).toBeNull();
      expect(p.completedLessonIds).toEqual([]);
      expect(p.skippedLessonIds).toEqual([]);
      expect(p.schemaVersion).toBe(1);
      expect(p.programId).toBe(DEFAULT_PROGRAM_ID);
    });

    it("has 3 default milestones, all not earned", () => {
      const p = createInitialProgress();
      expect(p.milestones).toHaveLength(3);
      for (const m of p.milestones) {
        expect(m.earnedAt).toBeNull();
      }
    });

    it("has updatedAt timestamp", () => {
      const p = createInitialProgress();
      expect(p.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });

  // =========================================================================
  // Status transition rules
  // =========================================================================

  describe("isValidStatusTransition", () => {
    it("not_started → active is valid", () => {
      expect(isValidStatusTransition("not_started", "active")).toBe(true);
    });

    it("not_started → completed is NOT valid", () => {
      expect(isValidStatusTransition("not_started", "completed")).toBe(false);
    });

    it("active → paused is valid", () => {
      expect(isValidStatusTransition("active", "paused")).toBe(true);
    });

    it("active → completed is valid", () => {
      expect(isValidStatusTransition("active", "completed")).toBe(true);
    });

    it("paused → active is valid", () => {
      expect(isValidStatusTransition("paused", "active")).toBe(true);
    });

    it("paused → completed is valid", () => {
      expect(isValidStatusTransition("paused", "completed")).toBe(true);
    });

    it("completed → active is valid (reopen)", () => {
      expect(isValidStatusTransition("completed", "active")).toBe(true);
    });

    it("not_started → paused is NOT valid", () => {
      expect(isValidStatusTransition("not_started", "paused")).toBe(false);
    });
  });

  // =========================================================================
  // Program lifecycle events
  // =========================================================================

  describe("program_started event", () => {
    it("transitions not_started → active", () => {
      const p = createInitialProgress();
      const event: ProgramEvent = {
        type: "program_started",
        programId: "cbti-core",
        timestamp: "2026-01-01T00:00:00.000Z",
      };
      const result = applyEvent(p, event, definition);
      expect(result.status).toBe("applied");
      const next = appliedOrThrow(result);
      expect(next.status).toBe("active");
      expect(next.startedAt).toBe("2026-01-01T00:00:00.000Z");
      expect(next.currentWeekId).toBe("week-1");
    });

    it("is idempotent if already active", () => {
      let p = createInitialProgress();
      const event: ProgramEvent = {
        type: "program_started",
        programId: "cbti-core",
        timestamp: "2026-01-01T00:00:00.000Z",
      };
      const r1 = applyEvent(p, event, definition);
      expect(r1.status).toBe("applied");
      p = appliedOrThrow(r1);

      const r2 = applyEvent(
        p,
        {
          ...event,
          timestamp: "2026-01-02T00:00:00.000Z",
        },
        definition,
      );
      // Should not change because active → active is not a valid transition
      expect(r2.status).toBe("unchanged");
      expect(r2.progress.startedAt).toBe(p.startedAt);
    });
  });

  describe("program_paused / program_resumed", () => {
    it("pauses an active program", () => {
      let p = createInitialProgress();
      p = appliedOrThrow(
        applyEvent(
          p,
          {
            type: "program_started",
            programId: "cbti-core",
            timestamp: "2026-01-01T00:00:00.000Z",
          },
          definition,
        ),
      );

      const result = applyEvent(
        p,
        {
          type: "program_paused",
          programId: "cbti-core",
          timestamp: "2026-01-02T00:00:00.000Z",
        },
        definition,
      );

      expect(result.status).toBe("applied");
      expect(result.progress.status).toBe("paused");
    });

    it("resumes a paused program", () => {
      let p = createInitialProgress();
      p = appliedOrThrow(
        applyEvent(
          p,
          {
            type: "program_started",
            programId: "cbti-core",
            timestamp: "2026-01-01T00:00:00.000Z",
          },
          definition,
        ),
      );
      p = appliedOrThrow(
        applyEvent(
          p,
          {
            type: "program_paused",
            programId: "cbti-core",
            timestamp: "2026-01-02T00:00:00.000Z",
          },
          definition,
        ),
      );

      const result = applyEvent(
        p,
        {
          type: "program_resumed",
          programId: "cbti-core",
          timestamp: "2026-01-03T00:00:00.000Z",
        },
        definition,
      );

      expect(result.status).toBe("applied");
      expect(result.progress.status).toBe("active");
    });

    it("preserves progress through pause/resume cycle", () => {
      let p = createInitialProgress();
      // Start and complete a few lessons
      p = appliedOrThrow(
        applyEvent(
          p,
          {
            type: "program_started",
            programId: "cbti-core",
            timestamp: "2026-01-01T00:00:00.000Z",
          },
          definition,
        ),
      );
      p = appliedOrThrow(
        applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId: definition.lessons[0].id,
            weekId: definition.lessons[0].weekId,
            timestamp: "2026-01-02T00:00:00.000Z",
          },
          definition,
        ),
      );
      p = appliedOrThrow(
        applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId: definition.lessons[1].id,
            weekId: definition.lessons[1].weekId,
            timestamp: "2026-01-03T00:00:00.000Z",
          },
          definition,
        ),
      );

      const completedBefore = p.completedLessonIds.length;
      const weekBefore = p.currentWeekId;

      // Pause
      const pauseResult = applyEvent(
        p,
        {
          type: "program_paused",
          programId: "cbti-core",
          timestamp: "2026-01-04T00:00:00.000Z",
        },
        definition,
      );
      expect(pauseResult.status).toBe("applied");
      const paused = pauseResult.progress;

      expect(paused.status).toBe("paused");
      expect(paused.completedLessonIds.length).toBe(completedBefore);
      expect(paused.currentWeekId).toBe(weekBefore);

      // Resume
      const resumeResult = applyEvent(
        paused,
        {
          type: "program_resumed",
          programId: "cbti-core",
          timestamp: "2026-01-10T00:00:00.000Z",
        },
        definition,
      );
      expect(resumeResult.status).toBe("applied");
      const resumed = resumeResult.progress;

      expect(resumed.status).toBe("active");
      expect(resumed.completedLessonIds.length).toBe(completedBefore);
      expect(resumed.currentWeekId).toBe(weekBefore);
    });

    it("cannot pause a not_started program", () => {
      const p = createInitialProgress();
      const result = applyEvent(
        p,
        {
          type: "program_paused",
          programId: "cbti-core",
          timestamp: "2026-01-01T00:00:00.000Z",
        },
        definition,
      );

      expect(result.status).toBe("unchanged");
      expect(result.progress.status).toBe("not_started");
      // Reference-identical: no new object was created
      expect(result.progress).toBe(p);
    });

    it("cannot resume an active program (no-op)", () => {
      let p = createInitialProgress();
      p = appliedOrThrow(
        applyEvent(
          p,
          {
            type: "program_started",
            programId: "cbti-core",
            timestamp: "2026-01-01T00:00:00.000Z",
          },
          definition,
        ),
      );

      const result = applyEvent(
        p,
        {
          type: "program_resumed",
          programId: "cbti-core",
          timestamp: "2026-01-02T00:00:00.000Z",
        },
        definition,
      );

      expect(result.status).toBe("unchanged");
      expect(result.progress).toBe(p);
    });

    // -----------------------------------------------------------------------
    // Paused-state mutation enforcement (Phase G-1.1)
    // -----------------------------------------------------------------------

    describe("paused-state mutation enforcement", () => {
      function startAndPause(): ProgramProgress {
        let p = createInitialProgress();
        p = appliedOrThrow(
          applyEvent(
            p,
            {
              type: "program_started",
              programId: "cbti-core",
              timestamp: "2026-01-01T00:00:00.000Z",
            },
            definition,
          ),
        );
        // Complete one lesson before pausing
        p = appliedOrThrow(
          applyEvent(
            p,
            {
              type: "lesson_completed",
              lessonId: definition.lessons[0].id,
              weekId: definition.lessons[0].weekId,
              timestamp: "2026-01-02T00:00:00.000Z",
            },
            definition,
          ),
        );
        p = appliedOrThrow(
          applyEvent(
            p,
            {
              type: "program_paused",
              programId: "cbti-core",
              timestamp: "2026-01-03T00:00:00.000Z",
            },
            definition,
          ),
        );
        return p;
      }

      it("blocks lesson_completed when paused", () => {
        const p = startAndPause();
        const beforeCount = p.completedLessonIds.length;

        const result = applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId: definition.lessons[1].id,
            weekId: definition.lessons[1].weekId,
            timestamp: "2026-01-04T00:00:00.000Z",
          },
          definition,
        );

        expect(result.status).toBe("blocked");
        if (result.status === "blocked") {
          expect(result.reason).toBe("program-paused");
        }
        // State unchanged
        expect(result.progress).toBe(p);
        expect(result.progress.completedLessonIds.length).toBe(beforeCount);
        expect(result.progress.status).toBe("paused");
      });

      it("blocks lesson_uncompleted when paused", () => {
        const p = startAndPause();
        const beforeCount = p.completedLessonIds.length;

        const result = applyEvent(
          p,
          {
            type: "lesson_uncompleted",
            lessonId: definition.lessons[0].id,
            weekId: definition.lessons[0].weekId,
            timestamp: "2026-01-04T00:00:00.000Z",
          },
          definition,
        );

        expect(result.status).toBe("blocked");
        if (result.status === "blocked") {
          expect(result.reason).toBe("program-paused");
        }
        expect(result.progress).toBe(p);
        expect(result.progress.completedLessonIds.length).toBe(beforeCount);
      });

      it("blocks lesson_skipped when paused", () => {
        const p = startAndPause();

        const result = applyEvent(
          p,
          {
            type: "lesson_skipped",
            lessonId: definition.lessons[2].id,
            weekId: definition.lessons[2].weekId,
            timestamp: "2026-01-04T00:00:00.000Z",
          },
          definition,
        );

        expect(result.status).toBe("blocked");
        if (result.status === "blocked") {
          expect(result.reason).toBe("program-paused");
        }
        expect(result.progress.skippedLessonIds).toEqual([]);
      });

      it("blocks lesson_unskipped when paused", () => {
        // We need a paused program with a skipped lesson
        let p = createInitialProgress();
        p = appliedOrThrow(
          applyEvent(
            p,
            {
              type: "program_started",
              programId: "cbti-core",
              timestamp: "2026-01-01T00:00:00.000Z",
            },
            definition,
          ),
        );
        p = appliedOrThrow(
          applyEvent(
            p,
            {
              type: "lesson_skipped",
              lessonId: definition.lessons[2].id,
              weekId: definition.lessons[2].weekId,
              timestamp: "2026-01-02T00:00:00.000Z",
            },
            definition,
          ),
        );
        p = appliedOrThrow(
          applyEvent(
            p,
            {
              type: "program_paused",
              programId: "cbti-core",
              timestamp: "2026-01-03T00:00:00.000Z",
            },
            definition,
          ),
        );

        const result = applyEvent(
          p,
          {
            type: "lesson_unskipped",
            lessonId: definition.lessons[2].id,
            weekId: definition.lessons[2].weekId,
            timestamp: "2026-01-04T00:00:00.000Z",
          },
          definition,
        );

        expect(result.status).toBe("blocked");
        if (result.status === "blocked") {
          expect(result.reason).toBe("program-paused");
        }
        expect(result.progress.skippedLessonIds.length).toBe(1);
      });

      it("blocks weekly_plan_accepted when paused", () => {
        const p = startAndPause();

        const result = applyEvent(
          p,
          {
            type: "weekly_plan_accepted",
            planId: "plan-week-1-2026-01-05",
            timestamp: "2026-01-04T00:00:00.000Z",
          },
          definition,
        );

        expect(result.status).toBe("blocked");
        if (result.status === "blocked") {
          expect(result.reason).toBe("program-paused");
        }
        expect(result.progress.acceptedPlanIds).toEqual([]);
      });

      it("blocks weekly_plan_dismissed when paused", () => {
        const p = startAndPause();

        const result = applyEvent(
          p,
          {
            type: "weekly_plan_dismissed",
            planId: "plan-week-1-2026-01-05",
            timestamp: "2026-01-04T00:00:00.000Z",
          },
          definition,
        );

        expect(result.status).toBe("blocked");
        if (result.status === "blocked") {
          expect(result.reason).toBe("program-paused");
        }
        expect(result.progress.dismissedRecommendationIds).toEqual([]);
      });

      it("blocks milestone_earned when paused", () => {
        const p = startAndPause();

        const result = applyEvent(
          p,
          {
            type: "milestone_earned",
            milestoneId: "sleep-basics",
            timestamp: "2026-01-04T00:00:00.000Z",
          },
          definition,
        );

        expect(result.status).toBe("blocked");
        if (result.status === "blocked") {
          expect(result.reason).toBe("program-paused");
        }
        // Milestone not earned
        const milestone = result.progress.milestones.find((m) => m.id === "sleep-basics");
        expect(milestone?.earnedAt).toBeNull();
      });

      it("allows resume when paused (lifecycle transition, not mutation)", () => {
        const p = startAndPause();

        const result = applyEvent(
          p,
          {
            type: "program_resumed",
            programId: "cbti-core",
            timestamp: "2026-01-04T00:00:00.000Z",
          },
          definition,
        );

        expect(result.status).toBe("applied");
        expect(result.progress.status).toBe("active");
      });

      it("blocked events are deterministic (repeatable)", () => {
        const p = startAndPause();

        const r1 = applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId: definition.lessons[1].id,
            weekId: definition.lessons[1].weekId,
            timestamp: "2026-01-04T00:00:00.000Z",
          },
          definition,
        );

        const r2 = applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId: definition.lessons[1].id,
            weekId: definition.lessons[1].weekId,
            timestamp: "2026-01-05T00:00:00.000Z",
          },
          definition,
        );

        expect(r1.status).toBe("blocked");
        expect(r2.status).toBe("blocked");
        if (r1.status === "blocked" && r2.status === "blocked") {
          expect(r1.reason).toBe(r2.reason);
        }
        // Both return the exact same progress object
        expect(r1.progress).toBe(r2.progress);
        expect(r1.progress).toBe(p);
      });

      it("resume → complete lesson works after a blocked attempt", () => {
        let p = startAndPause();
        const lessonId = definition.lessons[1].id;
        const weekId = definition.lessons[1].weekId;

        // Attempt completion while paused — should be blocked
        const blockedResult = applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId,
            weekId,
            timestamp: "2026-01-04T00:00:00.000Z",
          },
          definition,
        );
        expect(blockedResult.status).toBe("blocked");

        // Resume
        const resumeResult = applyEvent(
          p,
          {
            type: "program_resumed",
            programId: "cbti-core",
            timestamp: "2026-01-05T00:00:00.000Z",
          },
          definition,
        );
        expect(resumeResult.status).toBe("applied");
        p = resumeResult.progress;

        // Now completion should work
        const completeResult = applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId,
            weekId,
            timestamp: "2026-01-06T00:00:00.000Z",
          },
          definition,
        );
        expect(completeResult.status).toBe("applied");
        expect(completeResult.progress.completedLessonIds).toContain(lessonId);
      });

      it("cannot pause when already paused (unchanged, not blocked)", () => {
        const p = startAndPause();

        const result = applyEvent(
          p,
          {
            type: "program_paused",
            programId: "cbti-core",
            timestamp: "2026-01-04T00:00:00.000Z",
          },
          definition,
        );

        // Pause when already paused is "unchanged" (invalid transition),
        // not "blocked" — it's a lifecycle transition guard, not a mutation guard
        expect(result.status).toBe("unchanged");
        expect(result.progress.status).toBe("paused");
      });

      it("cannot resume when already active (unchanged, not blocked)", () => {
        let p = createInitialProgress();
        p = appliedOrThrow(
          applyEvent(
            p,
            {
              type: "program_started",
              programId: "cbti-core",
              timestamp: "2026-01-01T00:00:00.000Z",
            },
            definition,
          ),
        );

        const result = applyEvent(
          p,
          {
            type: "program_resumed",
            programId: "cbti-core",
            timestamp: "2026-01-02T00:00:00.000Z",
          },
          definition,
        );

        expect(result.status).toBe("unchanged");
      });

      it("milestone updates (auto-detected) do not happen when lesson completion is blocked", () => {
        // Complete all week-1 lessons, then pause, then try to complete
        // week-1's final lesson — should be blocked, milestone not earned
        let p = createInitialProgress();
        p = appliedOrThrow(
          applyEvent(
            p,
            {
              type: "program_started",
              programId: "cbti-core",
              timestamp: "2026-01-01T00:00:00.000Z",
            },
            definition,
          ),
        );

        const week1Lessons = definition.lessons.filter((l) => l.weekId === "week-1");
        // Complete all but the last lesson of week 1
        for (let i = 0; i < week1Lessons.length - 1; i++) {
          p = appliedOrThrow(
            applyEvent(
              p,
              {
                type: "lesson_completed",
                lessonId: week1Lessons[i].id,
                weekId: "week-1",
                timestamp: `2026-01-0${i + 1}T00:00:00.000Z`,
              },
              definition,
            ),
          );
        }

        // Pause before the final week-1 lesson
        p = appliedOrThrow(
          applyEvent(
            p,
            {
              type: "program_paused",
              programId: "cbti-core",
              timestamp: "2026-01-05T00:00:00.000Z",
            },
            definition,
          ),
        );

        // Milestone not yet earned
        expect(p.milestones.find((m) => m.id === "sleep-basics")?.earnedAt).toBeNull();

        // Attempt to complete the final lesson — blocked
        const lastLesson = week1Lessons[week1Lessons.length - 1];
        const result = applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId: lastLesson.id,
            weekId: "week-1",
            timestamp: "2026-01-06T00:00:00.000Z",
          },
          definition,
        );

        expect(result.status).toBe("blocked");
        // Milestone still not earned
        expect(
          result.progress.milestones.find((m) => m.id === "sleep-basics")?.earnedAt,
        ).toBeNull();
      });
    });
  });

  // =========================================================================
  // Lesson completion
  // =========================================================================

  describe("lesson_completed event", () => {
    it("auto-starts the program on first lesson completion", () => {
      const p = createInitialProgress();
      const firstLesson = definition.lessons[0];

      const result = applyEvent(
        p,
        {
          type: "lesson_completed",
          lessonId: firstLesson.id,
          weekId: firstLesson.weekId,
          timestamp: "2026-01-01T00:00:00.000Z",
        },
        definition,
      );

      expect(result.status).toBe("applied");
      const next = appliedOrThrow(result);
      expect(next.status).toBe("active");
      expect(next.startedAt).toBe("2026-01-01T00:00:00.000Z");
      expect(next.completedLessonIds).toContain(firstLesson.id);
    });

    it("is idempotent (completing same lesson twice)", () => {
      let p = createInitialProgress();
      const firstLesson = definition.lessons[0];

      const r1 = applyEvent(
        p,
        {
          type: "lesson_completed",
          lessonId: firstLesson.id,
          weekId: firstLesson.weekId,
          timestamp: "2026-01-01T00:00:00.000Z",
        },
        definition,
      );
      expect(r1.status).toBe("applied");
      p = appliedOrThrow(r1);

      const countBefore = p.completedLessonIds.length;
      const r2 = applyEvent(
        p,
        {
          type: "lesson_completed",
          lessonId: firstLesson.id,
          weekId: firstLesson.weekId,
          timestamp: "2026-01-02T00:00:00.000Z",
        },
        definition,
      );

      expect(r2.status).toBe("unchanged");
      expect(r2.progress.completedLessonIds.length).toBe(countBefore);
    });

    it("earns sleep-basics milestone after week 1 completed", () => {
      let p = createInitialProgress();
      const week1Lessons = definition.lessons.filter((l) => l.weekId === "week-1");

      for (const lesson of week1Lessons) {
        const r = applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId: lesson.id,
            weekId: lesson.weekId,
            timestamp: "2026-01-01T00:00:00.000Z",
          },
          definition,
        );
        if (r.status === "applied") {
          p = r.progress;
        }
      }

      const milestone = p.milestones.find((m) => m.id === "sleep-basics");
      expect(milestone?.earnedAt).not.toBeNull();
    });

    it("sets status to completed when all lessons done", () => {
      let p = createInitialProgress();

      for (const lesson of definition.lessons) {
        const r = applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId: lesson.id,
            weekId: lesson.weekId,
            timestamp: "2026-01-01T00:00:00.000Z",
          },
          definition,
        );
        if (r.status === "applied") {
          p = r.progress;
        }
      }

      expect(p.status).toBe("completed");
      expect(p.completedAt).not.toBeNull();
    });
  });

  describe("lesson_uncompleted event", () => {
    it("removes a lesson from completed list", () => {
      let p = createInitialProgress();
      const lesson = definition.lessons[0];

      p = appliedOrThrow(
        applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId: lesson.id,
            weekId: lesson.weekId,
            timestamp: "2026-01-01T00:00:00.000Z",
          },
          definition,
        ),
      );

      const result = applyEvent(
        p,
        {
          type: "lesson_uncompleted",
          lessonId: lesson.id,
          weekId: lesson.weekId,
          timestamp: "2026-01-02T00:00:00.000Z",
        },
        definition,
      );

      expect(result.status).toBe("applied");
      const uncompleted = appliedOrThrow(result);
      expect(uncompleted.completedLessonIds).not.toContain(lesson.id);
    });

    it("reverts from completed → active when a lesson is unmarked", () => {
      let p = createInitialProgress();
      for (const lesson of definition.lessons) {
        const r = applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId: lesson.id,
            weekId: lesson.weekId,
            timestamp: "2026-01-01T00:00:00.000Z",
          },
          definition,
        );
        if (r.status === "applied") {
          p = r.progress;
        }
      }
      expect(p.status).toBe("completed");

      const result = applyEvent(
        p,
        {
          type: "lesson_uncompleted",
          lessonId: definition.lessons[0].id,
          weekId: definition.lessons[0].weekId,
          timestamp: "2026-01-02T00:00:00.000Z",
        },
        definition,
      );

      expect(result.status).toBe("applied");
      const uncompleted = appliedOrThrow(result);
      expect(uncompleted.status).toBe("active");
      expect(uncompleted.completedAt).toBeNull();
    });

    it("revokes a milestone when its week is no longer complete", () => {
      let p = createInitialProgress();
      const week1Lessons = definition.lessons.filter((l) => l.weekId === "week-1");

      for (const lesson of week1Lessons) {
        const r = applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId: lesson.id,
            weekId: lesson.weekId,
            timestamp: "2026-01-01T00:00:00.000Z",
          },
          definition,
        );
        if (r.status === "applied") {
          p = r.progress;
        }
      }
      expect(p.milestones.find((m) => m.id === "sleep-basics")?.earnedAt).not.toBeNull();

      const result = applyEvent(
        p,
        {
          type: "lesson_uncompleted",
          lessonId: week1Lessons[0].id,
          weekId: "week-1",
          timestamp: "2026-01-02T00:00:00.000Z",
        },
        definition,
      );

      expect(result.status).toBe("applied");
      const uncompleted = appliedOrThrow(result);
      expect(uncompleted.milestones.find((m) => m.id === "sleep-basics")?.earnedAt).toBeNull();
    });
  });

  describe("lesson_skipped / unskipped", () => {
    it("adds a lesson to skipped list", () => {
      const p = createInitialProgress();
      const lesson = definition.lessons[0];

      const result = applyEvent(
        p,
        {
          type: "lesson_skipped",
          lessonId: lesson.id,
          weekId: lesson.weekId,
          timestamp: "2026-01-01T00:00:00.000Z",
        },
        definition,
      );

      expect(result.status).toBe("applied");
      expect(result.progress.skippedLessonIds).toContain(lesson.id);
    });

    it("is idempotent", () => {
      let p = createInitialProgress();
      const lesson = definition.lessons[0];

      const r1 = applyEvent(
        p,
        {
          type: "lesson_skipped",
          lessonId: lesson.id,
          weekId: lesson.weekId,
          timestamp: "2026-01-01T00:00:00.000Z",
        },
        definition,
      );
      expect(r1.status).toBe("applied");
      p = r1.progress;

      const countBefore = p.skippedLessonIds.length;
      const r2 = applyEvent(
        p,
        {
          type: "lesson_skipped",
          lessonId: lesson.id,
          weekId: lesson.weekId,
          timestamp: "2026-01-02T00:00:00.000Z",
        },
        definition,
      );

      expect(r2.status).toBe("unchanged");
      expect(r2.progress.skippedLessonIds.length).toBe(countBefore);
    });
  });

  // =========================================================================
  // Derived values
  // =========================================================================

  describe("calculateOverallCompletion", () => {
    it("returns 0 for empty progress", () => {
      const p = createInitialProgress();
      expect(calculateOverallCompletion(p, definition)).toBe(0);
    });

    it("returns 100 when all lessons complete", () => {
      let p = createInitialProgress();
      for (const lesson of definition.lessons) {
        const r = applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId: lesson.id,
            weekId: lesson.weekId,
            timestamp: "2026-01-01T00:00:00.000Z",
          },
          definition,
        );
        if (r.status === "applied") {
          p = r.progress;
        }
      }
      expect(calculateOverallCompletion(p, definition)).toBe(100);
    });

    it("returns correct percentage for partial completion", () => {
      let p = createInitialProgress();
      // Complete first 9 lessons (half of 18)
      for (let i = 0; i < 9; i++) {
        const lesson = definition.lessons[i];
        const r = applyEvent(
          p,
          {
            type: "lesson_completed",
            lessonId: lesson.id,
            weekId: lesson.weekId,
            timestamp: "2026-01-01T00:00:00.000Z",
          },
          definition,
        );
        if (r.status === "applied") {
          p = r.progress;
        }
      }
      expect(calculateOverallCompletion(p, definition)).toBe(50);
    });
  });

  // =========================================================================
  // Migration
  // =========================================================================

  describe("isLegacyProgress", () => {
    it("returns true for legacy shape", () => {
      expect(isLegacyProgress({ completedLessons: ["lesson-1"] })).toBe(true);
    });

    it("returns false for modern shape (has schemaVersion)", () => {
      expect(
        isLegacyProgress({
          schemaVersion: 1,
          completedLessons: [],
        }),
      ).toBe(false);
    });

    it("returns false for null/undefined", () => {
      expect(isLegacyProgress(null)).toBe(false);
      expect(isLegacyProgress(undefined)).toBe(false);
      expect(isLegacyProgress({})).toBe(false);
    });
  });

  describe("migrateLegacyProgress", () => {
    it("migrates empty legacy to initial state", () => {
      const result = migrateLegacyProgress({ completedLessons: [] }, definition);
      expect(result.status).toBe("not_started");
      expect(result.schemaVersion).toBe(1);
    });

    it("migrates legacy with completed lessons", () => {
      const legacy = {
        completedLessons: [definition.lessons[0].id, definition.lessons[1].id],
      };
      const result = migrateLegacyProgress(legacy, definition);

      expect(result.status).toBe("active");
      expect(result.completedLessonIds).toHaveLength(2);
      expect(result.startedAt).not.toBeNull();
      expect(result.currentWeekId).toBe("week-1");
    });

    it("migrates fully completed legacy to completed status", () => {
      const allLessonIds = definition.lessons.map((l) => l.id);
      const legacy = { completedLessons: allLessonIds };
      const result = migrateLegacyProgress(legacy, definition);

      expect(result.status).toBe("completed");
      expect(result.completedAt).not.toBeNull();
    });

    it("filters out invalid lesson IDs", () => {
      const legacy = {
        completedLessons: [definition.lessons[0].id, "fake-lesson-that-does-not-exist"],
      };
      const result = migrateLegacyProgress(legacy, definition);
      expect(result.completedLessonIds).toHaveLength(1);
      expect(result.completedLessonIds).toContain(definition.lessons[0].id);
      expect(result.completedLessonIds).not.toContain("fake-lesson-that-does-not-exist");
    });

    it("modern shape passes through with validation", () => {
      const modern: ProgramProgress = createInitialProgress();
      const result = migrateLegacyProgress(modern, definition);
      expect(result.status).toBe("not_started");
      expect(result.schemaVersion).toBe(1);
    });

    it("null/undefined returns initial progress", () => {
      expect(migrateLegacyProgress(null, definition).status).toBe("not_started");
      expect(migrateLegacyProgress(undefined, definition).status).toBe("not_started");
    });
  });

  // =========================================================================
  // Weekly plan events
  // =========================================================================

  describe("weekly_plan events", () => {
    it("accepts a plan (adds to acceptedPlanIds)", () => {
      const p = createInitialProgress();
      const result = applyEvent(
        p,
        {
          type: "weekly_plan_accepted",
          planId: "plan-123",
          timestamp: "2026-01-01T00:00:00.000Z",
        },
        definition,
      );

      expect(result.status).toBe("applied");
      expect(result.progress.acceptedPlanIds).toContain("plan-123");
    });

    it("dismisses a plan (adds to dismissedRecommendationIds)", () => {
      const p = createInitialProgress();
      const result = applyEvent(
        p,
        {
          type: "weekly_plan_dismissed",
          planId: "plan-456",
          timestamp: "2026-01-01T00:00:00.000Z",
        },
        definition,
      );

      expect(result.status).toBe("applied");
      expect(result.progress.dismissedRecommendationIds).toContain("plan:plan-456");
    });
  });
});
