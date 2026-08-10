/**
 * ProgramDashboardCard — component regression tests
 *
 * Tests all lifecycle states: not-started, active, paused, completed,
 * unsupported-version.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ProgramDashboardCard } from "./ProgramDashboardCard";
import { createInitialProgress } from "@/lib/program/service";
import type { ProgramProgress, ProgramDefinition } from "@/lib/program/types";

// -----------------------------------------------------------------------------
// Mock dependencies
// -----------------------------------------------------------------------------

const mockUI = {
  dashProgramTitle: "CBT-I Program",
  dashCurrentWeek: "Current Week",
  dashCurrentLesson: "Current Lesson",
  dashCompletion: "Completion",
  dashRecommended: "Recommended",
  dashContinueLearning: "Continue Learning",
  dashStartProgram: "Start Program",
  dashPausedStatus: "Paused",
  dashResumeCta: "Resume",
  dashProgramComplete: "Program Complete",
  dashReviewCta: "Review",
  startProgramSubtitle: "Start your CBT-I journey",
  programStructureInfo: "6 weeks · 18 lessons · self-paced",
  pausedProgressPreserved: "Your progress is preserved.",
  statusNotStarted: "Not Started",
  statusActive: "Active",
  statusPaused: "Paused",
  statusCompleted: "Completed",
  statusCorrupted: "Corrupted",
  weekLabel: "Week",
  lessonLabel: "Lesson",
  completionLessonsCount: "Lessons",
  programPrivacyNote: "Private & secure.",
};

vi.mock("@/lib/i18n", () => ({
  useI18n: () => ({ lang: "en", t: (k: string) => k }),
}));

vi.mock("@/lib/program-lessons-i18n", () => ({
  getProgramLessonUI: () => mockUI,
}));

vi.mock("@/lib/lang-detect", () => ({
  LANG_PREFIX: { en: "/en" },
}));

vi.mock("@/lib/program-weeks", () => ({
  getWeekByNumber: (n: number) => ({
    slug: `week-${n}`,
    number: n,
    i18n: { en: { title: `Week ${n}` } },
  }),
}));

vi.mock("@/components/common/SafeLink", () => ({
  SafeLink: ({ children, to, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("./ProgramUnsupportedBanner", () => ({
  ProgramUnsupportedBanner: ({ compact }: { compact?: boolean }) => (
    <div data-testid="unsupported-banner" data-compact={compact ? "true" : "false"}>
      Unsupported version
    </div>
  ),
}));

// -----------------------------------------------------------------------------
// Mock useProgramService
// -----------------------------------------------------------------------------

let mockProgress: ProgramProgress;
let mockHydrated: boolean;
let mockIsUnsupported: boolean;
let mockLoadStatus: string;
let mockOverallCompletion: number;
let mockCurrentWeekId: string | null;
let mockNextLesson: { id: string; weekId: string; order: number } | null;
let mockStartFn: ReturnType<typeof vi.fn>;
let mockResumeFn: ReturnType<typeof vi.fn>;

vi.mock("@/lib/program/use-program-service", () => ({
  useProgramService: () => ({
    progress: mockProgress,
    hydrated: mockHydrated,
    loadStatus: mockLoadStatus,
    isUnsupportedSchema: mockIsUnsupported,
    unsupportedSchemaInfo: null,
    overallCompletion: mockOverallCompletion,
    currentWeekId: mockCurrentWeekId,
    recommendedNextLesson: mockNextLesson,
    milestones: [],
    earnedBadgeIds: [],
    definition: {} as ProgramDefinition,
    getWeekStatus: () => "available" as const,
    getWeekCompletion: () => 0,
    getWeekCompletedCount: () => 0,
    completeLesson: () => ({ status: "applied" as const }),
    uncompleteLesson: () => ({ status: "applied" as const }),
    toggleLesson: () => ({ status: "applied" as const }),
    startProgram: mockStartFn,
    pauseProgram: () => ({ status: "applied" as const }),
    resumeProgram: mockResumeFn,
  }),
}));

describe("ProgramDashboardCard", () => {
  beforeEach(() => {
    mockProgress = createInitialProgress();
    mockHydrated = true;
    mockIsUnsupported = false;
    mockLoadStatus = "empty";
    mockOverallCompletion = 0;
    mockCurrentWeekId = null;
    mockNextLesson = null;
    mockStartFn = vi.fn();
    mockResumeFn = vi.fn().mockReturnValue({ status: "applied" });
  });

  describe("not-started state", () => {
    beforeEach(() => {
      mockLoadStatus = "empty";
    });

    it("shows start CTA and not-started copy", () => {
      render(<ProgramDashboardCard />);
      expect(screen.getByText("Start your CBT-I journey")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Start Program" })).toBeInTheDocument();
    });

    it("does not show false 0% progress metrics (shows start-state copy instead)", () => {
      render(<ProgramDashboardCard />);
      // In not-started state, the metrics grid is not shown
      expect(screen.queryByText("Current Week")).not.toBeInTheDocument();
    });

    it("start button invokes canonical handler", () => {
      render(<ProgramDashboardCard />);
      fireEvent.click(screen.getByRole("button", { name: "Start Program" }));
      expect(mockStartFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("active state", () => {
    beforeEach(() => {
      mockProgress = {
        ...createInitialProgress(),
        status: "active",
        startedAt: "2025-01-01T00:00:00Z",
        currentWeekId: "week-1",
        completedLessonIds: ["lesson-1"],
      };
      mockLoadStatus = "ready";
      mockOverallCompletion = 17; // ~1/6 ≈ 17%
      mockCurrentWeekId = "week-1";
      mockNextLesson = { id: "lesson-2", weekId: "week-1", order: 2 };
    });

    it("shows progress metrics", () => {
      render(<ProgramDashboardCard />);
      expect(screen.getByText("Current Week")).toBeInTheDocument();
      expect(screen.getByText("Completion")).toBeInTheDocument();
      // Percentage may appear in multiple places (progress bar + label)
      const pctEls = screen.getAllByText("17%");
      expect(pctEls.length).toBeGreaterThanOrEqual(1);
    });

    it("shows continue learning CTA", () => {
      render(<ProgramDashboardCard />);
      expect(screen.getByText("Continue Learning")).toBeInTheDocument();
    });
  });

  describe("paused state", () => {
    beforeEach(() => {
      mockProgress = {
        ...createInitialProgress(),
        status: "paused",
        startedAt: "2025-01-01T00:00:00Z",
        currentWeekId: "week-1",
        completedLessonIds: ["lesson-1"],
      };
      mockLoadStatus = "ready";
      mockOverallCompletion = 17;
      mockCurrentWeekId = "week-1";
      mockNextLesson = { id: "lesson-2", weekId: "week-1", order: 2 };
    });

    it("shows paused status and resume CTA", () => {
      render(<ProgramDashboardCard />);
      // "Paused" may appear in multiple places (status badge + banner)
      const pausedEls = screen.getAllByText("Paused");
      expect(pausedEls.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByRole("button", { name: "Resume" })).toBeInTheDocument();
    });

    it("does not show not started — shows progress is preserved", () => {
      render(<ProgramDashboardCard />);
      // Should show progress metrics, not a start button
      expect(screen.getByText("Current Week")).toBeInTheDocument();
      const pctEls = screen.getAllByText("17%");
      expect(pctEls.length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText("Start Program")).not.toBeInTheDocument();
    });

    it("resume button invokes canonical handler", () => {
      render(<ProgramDashboardCard />);
      fireEvent.click(screen.getByRole("button", { name: "Resume" }));
      expect(mockResumeFn).toHaveBeenCalledTimes(1);
    });

    it("does not show 'Continue Learning' CTA (shows resume instead)", () => {
      render(<ProgramDashboardCard />);
      expect(screen.queryByText("Continue Learning")).not.toBeInTheDocument();
    });
  });

  describe("completed state", () => {
    beforeEach(() => {
      mockProgress = {
        ...createInitialProgress(),
        status: "completed",
        startedAt: "2025-01-01T00:00:00Z",
        completedAt: "2025-03-01T00:00:00Z",
        currentWeekId: "week-6",
        completedLessonIds: Array.from({ length: 18 }, (_, i) => `lesson-${i + 1}`),
      };
      mockLoadStatus = "ready";
      mockOverallCompletion = 100;
      mockCurrentWeekId = "week-6";
      mockNextLesson = null;
    });

    it("shows program complete state", () => {
      render(<ProgramDashboardCard />);
      const completeEls = screen.getAllByText("Program Complete");
      expect(completeEls.length).toBeGreaterThanOrEqual(1);
    });

    it("shows 100% completion (not 0% or not-started)", () => {
      render(<ProgramDashboardCard />);
      const pctEls = screen.getAllByText("100%");
      expect(pctEls.length).toBeGreaterThanOrEqual(1);
    });

    it("shows review link", () => {
      render(<ProgramDashboardCard />);
      expect(screen.getByText("Review")).toBeInTheDocument();
    });
  });

  describe("unsupported-version state", () => {
    beforeEach(() => {
      mockIsUnsupported = true;
      mockLoadStatus = "unsupported-version";
    });

    it("shows unsupported banner", () => {
      render(<ProgramDashboardCard />);
      expect(screen.getByTestId("unsupported-banner")).toBeInTheDocument();
    });

    it("does not show start/active/paused/completed content", () => {
      render(<ProgramDashboardCard />);
      expect(screen.queryByText("Start Program")).not.toBeInTheDocument();
      expect(screen.queryByText("Continue Learning")).not.toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    beforeEach(() => {
      mockHydrated = false;
    });

    it("shows loading pulse/skeleton", () => {
      render(<ProgramDashboardCard />);
      // The loading state shows a pulse skeleton — we can detect by absence of specific text
      expect(screen.queryByText("Start Program")).not.toBeInTheDocument();
      expect(screen.queryByText("Continue Learning")).not.toBeInTheDocument();
    });
  });
});
