import { describe, it, expect } from "vitest";
import {
  toSyncProgress,
  fromCanonicalProgress,
  mergeLocalAndRemoteProgress,
  mergeCompletedLessons,
  resolveStatusConflict,
  mergeMilestones,
  resolveCurrentWeekId,
  resolveEarlierTimestamp,
} from "./sync-contracts";
import type { SyncProgramProgress, CanonicalProgramProgress } from "./sync-contracts";
import type { ProgramProgress, ProgramMilestone } from "./types";
import { createInitialProgress } from "./service";

describe("program/sync-contracts", () => {
  // =========================================================================
  // Serialization round-trip
  // =========================================================================

  describe("toSyncProgress / fromCanonicalProgress", () => {
    it("round-trips initial progress", () => {
      const local = createInitialProgress();
      const sync = toSyncProgress(local, "entity-123");
      expect(sync.schemaVersion).toBe(1);
      expect(sync.programId).toBe("cbti-core");
      expect(sync.status).toBe("not_started");
      expect(sync.entityId).toBe("entity-123");

      const canonical: CanonicalProgramProgress = {
        entityType: "program_progress",
        entityId: "entity-123",
        schemaVersion: 1,
        programId: sync.programId,
        programVersion: sync.programVersion,
        userId: "user-123" as never,
        canonical: true,
        status: sync.status,
        startedAt: sync.startedAt,
        completedAt: sync.completedAt,
        currentWeekId: sync.currentWeekId,
        completedLessonIds: sync.completedLessonIds,
        skippedLessonIds: sync.skippedLessonIds,
        acceptedPlanIds: sync.acceptedPlanIds,
        dismissedRecommendationIds: sync.dismissedRecommendationIds,
        milestones: sync.milestones,
        updatedAt: sync.updatedAt,
      };
      const back = fromCanonicalProgress(canonical);
      expect(back.status).toBe("not_started");
      expect(back.completedLessonIds).toEqual([]);
      expect(back.schemaVersion).toBe(1);
    });

    it("round-trips active progress with lessons and plans", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        startedAt: "2026-01-01T00:00:00.000Z",
        currentWeekId: "week-2",
        completedLessonIds: ["week-1-intro", "week-1-sleep-hygiene"],
        skippedLessonIds: ["week-1-relaxation"],
        acceptedPlanIds: ["plan-1"],
        dismissedRecommendationIds: ["plan:plan-2"],
      };

      const sync = toSyncProgress(local, "entity-456");
      expect(sync.completedLessonIds).toHaveLength(2);
      expect(sync.currentWeekId).toBe("week-2");

      const canonical: CanonicalProgramProgress = {
        entityType: "program_progress",
        entityId: "entity-456",
        schemaVersion: 1,
        programId: sync.programId,
        programVersion: sync.programVersion,
        userId: "user-123" as never,
        canonical: true,
        status: sync.status,
        startedAt: sync.startedAt,
        completedAt: sync.completedAt,
        currentWeekId: sync.currentWeekId,
        completedLessonIds: sync.completedLessonIds,
        skippedLessonIds: sync.skippedLessonIds,
        acceptedPlanIds: sync.acceptedPlanIds,
        dismissedRecommendationIds: sync.dismissedRecommendationIds,
        milestones: sync.milestones,
        updatedAt: sync.updatedAt,
      };
      const back = fromCanonicalProgress(canonical);
      expect(back.completedLessonIds).toEqual(local.completedLessonIds);
      expect(back.skippedLessonIds).toEqual(local.skippedLessonIds);
      expect(back.acceptedPlanIds).toEqual(local.acceptedPlanIds);
      expect(back.dismissedRecommendationIds).toEqual(local.dismissedRecommendationIds);
    });
  });

  // =========================================================================
  // Field-level merge strategies
  // =========================================================================

  describe("mergeCompletedLessons", () => {
    it("unions both sets", () => {
      const result = mergeCompletedLessons(["a", "b"], ["b", "c"]);
      expect(result.sort()).toEqual(["a", "b", "c"].sort());
    });

    it("handles empty local", () => {
      const result = mergeCompletedLessons([], ["a"]);
      expect(result).toEqual(["a"]);
    });

    it("handles empty remote", () => {
      const result = mergeCompletedLessons(["a"], []);
      expect(result).toEqual(["a"]);
    });
  });

  describe("resolveStatusConflict", () => {
    it("completed beats active", () => {
      expect(resolveStatusConflict("active", "completed")).toBe("completed");
      expect(resolveStatusConflict("completed", "active")).toBe("completed");
    });

    it("completed beats paused", () => {
      expect(resolveStatusConflict("paused", "completed")).toBe("completed");
    });

    it("active beats not_started", () => {
      expect(resolveStatusConflict("not_started", "active")).toBe("active");
    });

    it("paused beats not_started", () => {
      expect(resolveStatusConflict("not_started", "paused")).toBe("paused");
    });

    it("active and paused are same rank — returns local (first arg) when both are same rank", () => {
      // Both are rank 1, local wins
      expect(resolveStatusConflict("active", "paused")).toBe("active");
      expect(resolveStatusConflict("paused", "active")).toBe("paused");
    });

    it("same status returns same", () => {
      expect(resolveStatusConflict("active", "active")).toBe("active");
      expect(resolveStatusConflict("not_started", "not_started")).toBe("not_started");
    });
  });

  describe("mergeMilestones", () => {
    it("unions milestone IDs from both sides", () => {
      const local: ProgramMilestone[] = [
        {
          id: "sleep-basics",
          titleKey: "m.sleep-basics",
          descriptionKey: "m.sleep-basics-desc",
          earnedAt: "2026-01-01T00:00:00.000Z",
          weekId: "week-1",
        },
        {
          id: "habit-streak-7",
          titleKey: "m.streak",
          descriptionKey: "m.streak-desc",
          earnedAt: null,
        },
      ];
      const remote: ProgramMilestone[] = [
        {
          id: "sleep-basics",
          titleKey: "m.sleep-basics",
          descriptionKey: "m.sleep-basics-desc",
          earnedAt: "2025-12-31T00:00:00.000Z",
          weekId: "week-1",
        },
        {
          id: "program-completed",
          titleKey: "m.completed",
          descriptionKey: "m.completed-desc",
          earnedAt: null,
        },
      ];

      const result = mergeMilestones(local, remote);
      const ids = result.map((m) => m.id).sort();
      expect(ids).toEqual(["habit-streak-7", "program-completed", "sleep-basics"].sort());
    });

    it("keeps earlier timestamp for same milestone (earliest earns it first)", () => {
      const local: ProgramMilestone[] = [
        {
          id: "sleep-basics",
          earnedAt: "2026-01-05T00:00:00.000Z",
          titleKey: "m.sleep-basics",
          descriptionKey: "m.desc",
        },
      ];
      const remote: ProgramMilestone[] = [
        {
          id: "sleep-basics",
          earnedAt: "2026-01-01T00:00:00.000Z",
          titleKey: "m.sleep-basics",
          descriptionKey: "m.desc",
        },
      ];

      const result = mergeMilestones(local, remote);
      const milestone = result.find((m) => m.id === "sleep-basics");
      expect(milestone?.earnedAt).toBe("2026-01-01T00:00:00.000Z");
    });

    it("earned beats not earned (if remote has it earned, local doesn't)", () => {
      const local: ProgramMilestone[] = [
        {
          id: "sleep-basics",
          earnedAt: null,
          titleKey: "m.sleep-basics",
          descriptionKey: "m.desc",
        },
      ];
      const remote: ProgramMilestone[] = [
        {
          id: "sleep-basics",
          earnedAt: "2026-01-01T00:00:00.000Z",
          titleKey: "m.sleep-basics",
          descriptionKey: "m.desc",
        },
      ];

      const result = mergeMilestones(local, remote);
      const milestone = result.find((m) => m.id === "sleep-basics");
      expect(milestone?.earnedAt).toBe("2026-01-01T00:00:00.000Z");
    });

    it("earned beats not earned (if local has it earned, remote doesn't)", () => {
      const local: ProgramMilestone[] = [
        {
          id: "sleep-basics",
          earnedAt: "2026-01-01T00:00:00.000Z",
          titleKey: "m.sleep-basics",
          descriptionKey: "m.desc",
        },
      ];
      const remote: ProgramMilestone[] = [
        {
          id: "sleep-basics",
          earnedAt: null,
          titleKey: "m.sleep-basics",
          descriptionKey: "m.desc",
        },
      ];

      const result = mergeMilestones(local, remote);
      const milestone = result.find((m) => m.id === "sleep-basics");
      expect(milestone?.earnedAt).toBe("2026-01-01T00:00:00.000Z");
    });
  });

  describe("resolveCurrentWeekId", () => {
    it("LWW: uses remote weekId when remote timestamp is newer", () => {
      const result = resolveCurrentWeekId(
        "week-1",
        "2026-01-01T00:00:00.000Z",
        "week-3",
        "2026-01-15T00:00:00.000Z",
      );
      expect(result).toBe("week-3");
    });

    it("LWW: uses local weekId when local timestamp is newer", () => {
      const result = resolveCurrentWeekId(
        "week-3",
        "2026-01-15T00:00:00.000Z",
        "week-1",
        "2026-01-01T00:00:00.000Z",
      );
      expect(result).toBe("week-3");
    });

    it("returns null when both are null", () => {
      const result = resolveCurrentWeekId(
        null,
        "2026-01-01T00:00:00.000Z",
        null,
        "2026-01-15T00:00:00.000Z",
      );
      expect(result).toBeNull();
    });

    it("uses non-null value when only one has a value", () => {
      const result = resolveCurrentWeekId(
        null,
        "2026-01-01T00:00:00.000Z",
        "week-2",
        "2026-01-15T00:00:00.000Z",
      );
      expect(result).toBe("week-2");
    });
  });

  // =========================================================================
  // Full merge (anonymous → authenticated)
  // =========================================================================

  describe("mergeLocalAndRemoteProgress", () => {
    it("unions completed lessons from both sides", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        startedAt: "2026-01-01T00:00:00.000Z",
        currentWeekId: "week-2",
        completedLessonIds: ["lesson-1", "lesson-2"],
        updatedAt: "2026-01-05T00:00:00.000Z",
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        startedAt: "2025-12-15T00:00:00.000Z",
        currentWeekId: "week-3",
        completedLessonIds: ["lesson-2", "lesson-3"],
        updatedAt: "2026-01-03T00:00:00.000Z",
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.completedLessonIds.sort()).toEqual(["lesson-1", "lesson-2", "lesson-3"].sort());
    });

    it("LWW: local is newer → local currentWeekId wins", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        currentWeekId: "week-2",
        completedLessonIds: ["lesson-1"],
        updatedAt: "2026-01-10T00:00:00.000Z",
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        currentWeekId: "week-1",
        completedLessonIds: ["lesson-0"],
        updatedAt: "2026-01-01T00:00:00.000Z",
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.currentWeekId).toBe("week-2");
    });

    it("LWW: remote is newer → remote currentWeekId wins", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        currentWeekId: "week-1",
        completedLessonIds: ["lesson-0"],
        updatedAt: "2026-01-01T00:00:00.000Z",
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        currentWeekId: "week-3",
        completedLessonIds: ["lesson-1", "lesson-2"],
        updatedAt: "2026-01-10T00:00:00.000Z",
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.currentWeekId).toBe("week-3");
    });

    it("takes most advanced status (completed wins over active)", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        startedAt: "2026-01-01T00:00:00.000Z",
        currentWeekId: "week-2",
        completedLessonIds: ["lesson-1"],
        updatedAt: "2026-01-10T00:00:00.000Z",
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2025-12-01T00:00:00.000Z",
        completedAt: "2025-12-31T00:00:00.000Z",
        currentWeekId: "week-6",
        completedLessonIds: ["lesson-1", "lesson-2", "lesson-3"],
        updatedAt: "2025-12-31T00:00:00.000Z",
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.status).toBe("completed");
      expect(merged.completedAt).not.toBeNull();
    });

    it("keeps earlier startedAt", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        startedAt: "2026-01-10T00:00:00.000Z",
        completedLessonIds: ["lesson-1"],
        updatedAt: "2026-01-10T00:00:00.000Z",
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        startedAt: "2025-12-01T00:00:00.000Z",
        completedLessonIds: ["lesson-0"],
        updatedAt: "2026-01-05T00:00:00.000Z",
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.startedAt).toBe("2025-12-01T00:00:00.000Z");
    });

    // --- completedAt: earliest valid timestamp wins ---

    it("completedAt: local earlier wins when both completed", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "2026-02-01T00:00:00.000Z",
        completedLessonIds: ["lesson-1", "lesson-2"],
        currentWeekId: "week-6",
        updatedAt: "2026-02-01T00:00:00.000Z",
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "2026-02-15T00:00:00.000Z",
        completedLessonIds: ["lesson-1", "lesson-2"],
        currentWeekId: "week-6",
        updatedAt: "2026-02-15T00:00:00.000Z",
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.status).toBe("completed");
      expect(merged.completedAt).toBe("2026-02-01T00:00:00.000Z");
    });

    it("completedAt: remote earlier wins when both completed", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "2026-02-15T00:00:00.000Z",
        completedLessonIds: ["lesson-1", "lesson-2"],
        currentWeekId: "week-6",
        updatedAt: "2026-02-15T00:00:00.000Z",
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "2026-02-01T00:00:00.000Z",
        completedLessonIds: ["lesson-1", "lesson-2"],
        currentWeekId: "week-6",
        updatedAt: "2026-02-01T00:00:00.000Z",
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.status).toBe("completed");
      expect(merged.completedAt).toBe("2026-02-01T00:00:00.000Z");
    });

    it("completedAt: equal timestamps are stable", () => {
      const ts = "2026-02-14T12:00:00.000Z";
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: ts,
        completedLessonIds: ["lesson-1"],
        currentWeekId: "week-6",
        updatedAt: ts,
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: ts,
        completedLessonIds: ["lesson-1"],
        currentWeekId: "week-6",
        updatedAt: ts,
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.completedAt).toBe(ts);
    });

    it("completedAt: local null + remote timestamp → remote", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: null,
        completedLessonIds: ["lesson-1"],
        currentWeekId: "week-1",
        updatedAt: "2026-01-10T00:00:00.000Z",
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2025-12-01T00:00:00.000Z",
        completedAt: "2026-01-05T00:00:00.000Z",
        completedLessonIds: ["lesson-1", "lesson-2", "lesson-3"],
        currentWeekId: "week-6",
        updatedAt: "2026-01-05T00:00:00.000Z",
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.status).toBe("completed");
      expect(merged.completedAt).toBe("2026-01-05T00:00:00.000Z");
    });

    it("completedAt: local timestamp + remote null → local", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2025-12-01T00:00:00.000Z",
        completedAt: "2026-01-05T00:00:00.000Z",
        completedLessonIds: ["lesson-1", "lesson-2", "lesson-3"],
        currentWeekId: "week-6",
        updatedAt: "2026-01-05T00:00:00.000Z",
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: null,
        completedLessonIds: ["lesson-1"],
        currentWeekId: "week-1",
        updatedAt: "2026-01-10T00:00:00.000Z",
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.status).toBe("completed");
      expect(merged.completedAt).toBe("2026-01-05T00:00:00.000Z");
    });

    it("completedAt: both null + status not completed → null", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: null,
        completedLessonIds: ["lesson-1"],
        currentWeekId: "week-1",
        updatedAt: "2026-01-10T00:00:00.000Z",
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "active",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: null,
        completedLessonIds: ["lesson-2"],
        currentWeekId: "week-1",
        updatedAt: "2026-01-10T00:00:00.000Z",
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.status).toBe("active");
      expect(merged.completedAt).toBeNull();
    });

    it("completedAt: invalid local timestamp falls back to remote", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "not-a-real-date" as any,
        completedLessonIds: ["lesson-1", "lesson-2"],
        currentWeekId: "week-6",
        updatedAt: "2026-02-01T00:00:00.000Z",
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "2026-02-15T00:00:00.000Z",
        completedLessonIds: ["lesson-1", "lesson-2"],
        currentWeekId: "week-6",
        updatedAt: "2026-02-15T00:00:00.000Z",
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.completedAt).toBe("2026-02-15T00:00:00.000Z");
    });

    it("completedAt: invalid remote timestamp falls back to local", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "2026-02-01T00:00:00.000Z",
        completedLessonIds: ["lesson-1", "lesson-2"],
        currentWeekId: "week-6",
        updatedAt: "2026-02-01T00:00:00.000Z",
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "" as any,
        completedLessonIds: ["lesson-1", "lesson-2"],
        currentWeekId: "week-6",
        updatedAt: "2026-02-15T00:00:00.000Z",
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.completedAt).toBe("2026-02-01T00:00:00.000Z");
    });

    it("completedAt: timezone-offset equivalents are treated as same instant", () => {
      const local: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "2026-02-01T12:00:00.000Z",
        completedLessonIds: ["lesson-1"],
        currentWeekId: "week-6",
        updatedAt: "2026-02-01T12:00:00.000Z",
      };
      const remote: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "2026-02-01T08:00:00.000-04:00",
        completedLessonIds: ["lesson-1"],
        currentWeekId: "week-6",
        updatedAt: "2026-02-01T08:00:00.000-04:00",
      };

      const merged = mergeLocalAndRemoteProgress(local, remote);
      expect(merged.completedAt).toBeTruthy();
      // Both represent the same instant — local string is preserved (it's first arg)
      const mergedDate = new Date(merged.completedAt!).getTime();
      expect(mergedDate).toBe(new Date("2026-02-01T12:00:00.000Z").getTime());
    });

    it("merge is commutative for completedAt", () => {
      const a: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "2026-02-01T00:00:00.000Z",
        completedLessonIds: ["lesson-a"],
        currentWeekId: "week-6",
        updatedAt: "2026-02-01T00:00:00.000Z",
      };
      const b: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-05T00:00:00.000Z",
        completedAt: "2026-03-01T00:00:00.000Z",
        completedLessonIds: ["lesson-b"],
        currentWeekId: "week-6",
        updatedAt: "2026-03-01T00:00:00.000Z",
      };

      const ab = mergeLocalAndRemoteProgress(a, b);
      const ba = mergeLocalAndRemoteProgress(b, a);
      expect(ab.completedAt).toBe(ba.completedAt);
      expect(ab.status).toBe(ba.status);
      expect(ab.completedLessonIds.sort()).toEqual(ba.completedLessonIds.sort());
    });

    it("merge is idempotent for completedAt", () => {
      const progress: ProgramProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2026-01-01T00:00:00.000Z",
        completedAt: "2026-02-01T00:00:00.000Z",
        completedLessonIds: ["lesson-1", "lesson-2"],
        currentWeekId: "week-6",
        updatedAt: "2026-02-01T00:00:00.000Z",
      };

      const mergedOnce = mergeLocalAndRemoteProgress(progress, progress);
      const mergedTwice = mergeLocalAndRemoteProgress(mergedOnce, mergedOnce);
      // Note: updatedAt always regenerates, so we check completedAt specifically
      expect(mergedOnce.completedAt).toBe(progress.completedAt);
      expect(mergedTwice.completedAt).toBe(progress.completedAt);
    });
  });

  // =========================================================================
  // resolveEarlierTimestamp unit tests
  // =========================================================================

  describe("resolveEarlierTimestamp", () => {
    it("both null → null", () => {
      expect(resolveEarlierTimestamp(null, null)).toBeNull();
    });

    it("local value + remote null → local", () => {
      expect(resolveEarlierTimestamp("2026-01-01T00:00:00.000Z", null)).toBe(
        "2026-01-01T00:00:00.000Z",
      );
    });

    it("local null + remote value → remote", () => {
      expect(resolveEarlierTimestamp(null, "2026-01-01T00:00:00.000Z")).toBe(
        "2026-01-01T00:00:00.000Z",
      );
    });

    it("earlier of two valid timestamps wins", () => {
      expect(resolveEarlierTimestamp("2026-01-01T00:00:00.000Z", "2026-01-15T00:00:00.000Z")).toBe(
        "2026-01-01T00:00:00.000Z",
      );
      expect(resolveEarlierTimestamp("2026-01-15T00:00:00.000Z", "2026-01-01T00:00:00.000Z")).toBe(
        "2026-01-01T00:00:00.000Z",
      );
    });

    it("equal timestamps return first arg (stable)", () => {
      const ts = "2026-02-14T12:00:00.000Z";
      expect(resolveEarlierTimestamp(ts, ts)).toBe(ts);
    });

    it("invalid local timestamp treated as null", () => {
      expect(resolveEarlierTimestamp("not-a-date", "2026-01-01T00:00:00.000Z")).toBe(
        "2026-01-01T00:00:00.000Z",
      );
    });

    it("invalid remote timestamp treated as null", () => {
      expect(resolveEarlierTimestamp("2026-01-01T00:00:00.000Z", "garbage")).toBe(
        "2026-01-01T00:00:00.000Z",
      );
    });

    it("both invalid → null (never converts to current time)", () => {
      const before = Date.now();
      const result = resolveEarlierTimestamp("bad", "worse");
      const after = Date.now();
      expect(result).toBeNull();
      // Double-check: if it accidentally returned a current timestamp, it would
      // fall between before and after
      if (result !== null) {
        const t = new Date(result).getTime();
        expect(t < before || t > after).toBe(true); // should never happen
      }
    });

    it("empty string treated as invalid → null", () => {
      expect(resolveEarlierTimestamp("", "2026-01-01T00:00:00.000Z")).toBe(
        "2026-01-01T00:00:00.000Z",
      );
      expect(resolveEarlierTimestamp("2026-01-01T00:00:00.000Z", "")).toBe(
        "2026-01-01T00:00:00.000Z",
      );
    });

    it("timezone-offset equivalents return the first argument (same instant)", () => {
      const a = "2026-02-01T12:00:00.000Z";
      const b = "2026-02-01T08:00:00.000-04:00"; // same instant
      // Both represent the same moment; first arg is returned since they compare equal
      expect(resolveEarlierTimestamp(a, b)).toBe(a);
    });

    it("is commutative", () => {
      const a = "2026-01-01T00:00:00.000Z";
      const b = "2026-01-15T00:00:00.000Z";
      // Both orderings return the same value (the earlier one)
      expect(resolveEarlierTimestamp(a, b)).toBe(resolveEarlierTimestamp(b, a));
    });

    it("is idempotent", () => {
      const ts = "2026-01-01T00:00:00.000Z";
      const once = resolveEarlierTimestamp(ts, ts);
      const twice = resolveEarlierTimestamp(once, ts);
      expect(once).toBe(ts);
      expect(twice).toBe(ts);
    });
  });
});
