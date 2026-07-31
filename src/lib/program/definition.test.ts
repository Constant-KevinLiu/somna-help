import { describe, it, expect } from "vitest";
import { getProgramDefinition, validateProgramDefinition } from "./definition";
import type {
  ProgramDefinition,
  ProgramWeekDefinition,
  ProgramLessonDefinition,
} from "./types";

describe("program/definition", () => {
  describe("getProgramDefinition", () => {
    it("returns a valid definition with expected id and version", () => {
      const def = getProgramDefinition();
      expect(def.id).toBe("cbti-core");
      expect(def.version).toBe(1);
      expect(typeof def.version).toBe("number");
    });

    it("has 6 weeks", () => {
      const def = getProgramDefinition();
      expect(def.weeks).toHaveLength(6);
    });

    it("has 18 lessons (3 per week)", () => {
      const def = getProgramDefinition();
      expect(def.lessons).toHaveLength(18);
      for (const week of def.weeks) {
        const weekLessons = def.lessons.filter((l) => l.weekId === week.id);
        expect(weekLessons).toHaveLength(3);
      }
    });

    it("weeks are ordered 1-6", () => {
      const def = getProgramDefinition();
      const weekIds = def.weeks.map((w) => w.id);
      expect(weekIds).toEqual(["week-1", "week-2", "week-3", "week-4", "week-5", "week-6"]);
      const weekOrders = def.weeks.map((w) => w.order);
      expect(weekOrders).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("lessons have global order 1-18", () => {
      const def = getProgramDefinition();
      const orders = def.lessons.map((l) => l.order).sort((a, b) => a - b);
      expect(orders[0]).toBe(1);
      expect(orders[orders.length - 1]).toBe(18);
      expect(orders).toHaveLength(18);
    });

    it("all lessons have unique IDs", () => {
      const def = getProgramDefinition();
      const ids = def.lessons.map((l) => l.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("all lessons reference valid weeks", () => {
      const def = getProgramDefinition();
      const weekIds = new Set(def.weeks.map((w) => w.id));
      for (const lesson of def.lessons) {
        expect(weekIds.has(lesson.weekId)).toBe(true);
      }
    });

    it("every lesson has i18n keys for title and summary", () => {
      const def = getProgramDefinition();
      for (const lesson of def.lessons) {
        expect(lesson.titleKey).toBeTruthy();
        expect(lesson.summaryKey).toBeTruthy();
        expect(lesson.titleKey).toContain(".");
      }
    });

    it("every week has i18n keys for title and summary", () => {
      const def = getProgramDefinition();
      for (const week of def.weeks) {
        expect(week.titleKey).toBeTruthy();
        expect(week.summaryKey).toBeTruthy();
      }
    });

    it("returns the same instance (cached singleton)", () => {
      const def1 = getProgramDefinition();
      const def2 = getProgramDefinition();
      expect(def1).toBe(def2);
    });

    it("weeks have correct prerequisite chains", () => {
      const def = getProgramDefinition();
      // week-1 has no prerequisites
      expect(def.weeks[0].prerequisiteWeekIds).toBeUndefined();
      // week-2 requires week-1
      expect(def.weeks[1].prerequisiteWeekIds).toContain("week-1");
      // week-6 requires week-5
      expect(def.weeks[5].prerequisiteWeekIds).toContain("week-5");
    });

    it("all week.lessonIds reference real lessons", () => {
      const def = getProgramDefinition();
      const lessonIdSet = new Set(def.lessons.map((l) => l.id));
      for (const week of def.weeks) {
        for (const lessonId of week.lessonIds) {
          expect(lessonIdSet.has(lessonId)).toBe(true);
        }
      }
    });
  });

  describe("validateProgramDefinition (returns issues array)", () => {
    it("returns empty array for the real program definition", () => {
      const def = getProgramDefinition();
      const issues = validateProgramDefinition(def);
      expect(issues).toEqual([]);
    });

    it("reports duplicate lesson IDs", () => {
      const base = getProgramDefinition();
      const badDef: ProgramDefinition = {
        ...base,
        lessons: [
          ...base.lessons.slice(0, 5),
          { ...base.lessons[0] }, // duplicate
        ],
      };
      const issues = validateProgramDefinition(badDef);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues.some((i) => /duplicate/i.test(i))).toBe(true);
    });

    it("reports non-contiguous week order", () => {
      const base = getProgramDefinition();
      const badWeeks: ProgramWeekDefinition[] = [
        base.weeks[0],
        base.weeks[2], // skipped week-2
      ];
      const badDef: ProgramDefinition = {
        ...base,
        weeks: badWeeks,
        lessons: base.lessons.filter((l) => l.weekId === "week-1" || l.weekId === "week-3"),
      };
      const issues = validateProgramDefinition(badDef);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues.some((i) => /non-contiguous/i.test(i))).toBe(true);
    });

    it("reports when a lesson references a non-existent week (via week.lessonIds)", () => {
      const base = getProgramDefinition();
      // Create a week that references a bogus lesson
      const badWeek: ProgramWeekDefinition = {
        ...base.weeks[0],
        id: "week-bad",
        order: 99,
        lessonIds: ["does-not-exist-lesson"],
      };
      const badDef: ProgramDefinition = {
        ...base,
        weeks: [...base.weeks, badWeek],
      };
      const issues = validateProgramDefinition(badDef);
      expect(issues.some((i) => /missing lesson/i.test(i))).toBe(true);
    });

    it("reports duplicate week IDs", () => {
      const base = getProgramDefinition();
      const badDef: ProgramDefinition = {
        ...base,
        weeks: [...base.weeks, base.weeks[0]],
      };
      const issues = validateProgramDefinition(badDef);
      expect(issues.some((i) => /duplicate.*week/i.test(i))).toBe(true);
    });

    it("reports when relatedLessonIds reference non-existent lessons", () => {
      const base = getProgramDefinition();
      const badLesson: ProgramLessonDefinition = {
        ...base.lessons[0],
        id: "lesson-with-bad-related",
        relatedLessonIds: ["does-not-exist-xyz"],
      };
      const badDef: ProgramDefinition = {
        ...base,
        lessons: [...base.lessons, badLesson],
      };
      const issues = validateProgramDefinition(badDef);
      expect(issues.some((i) => /missing related/i.test(i))).toBe(true);
    });

    it("reports when prerequisiteWeekIds reference non-existent weeks", () => {
      const base = getProgramDefinition();
      const badWeek: ProgramWeekDefinition = {
        ...base.weeks[0],
        id: "week-orphan",
        order: 10,
        prerequisiteWeekIds: ["week-nonexistent"],
      };
      const badDef: ProgramDefinition = {
        ...base,
        weeks: [...base.weeks, badWeek],
      };
      const issues = validateProgramDefinition(badDef);
      expect(issues.some((i) => /missing prerequisite/i.test(i))).toBe(true);
    });
  });
});
