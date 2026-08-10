/**
 * ProgramCompletionSummary — component regression tests
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ProgramCompletionSummary } from "./ProgramCompletionSummary";
import { createInitialProgress } from "@/lib/program/service";
import { getProgramDefinition } from "@/lib/program/definition";

// -----------------------------------------------------------------------------
// Mock i18n + SafeLink + LANG_PREFIX + programWeeks
// -----------------------------------------------------------------------------

const mockUI = {
  completionTitle: "Congratulations!",
  completionSubtitle: "You've completed the CBT-I program.",
  completionLessonsCount: "Lessons Completed",
  completionDateLabel: "Completed",
  completionMilestone: "Milestone",
  reviewLessons: "Review Lessons",
  completionDisclaimer: "This is not medical advice.",
};

vi.mock("@/lib/i18n", () => ({
  useI18n: () => ({ lang: "en", t: (k: string) => k }),
}));

vi.mock("@/lib/program-lessons-i18n", () => ({
  getProgramLessonUI: () => mockUI,
}));

vi.mock("@/lib/lang-detect", () => ({
  LANG_PREFIX: { en: "/en", es: "/es", pt: "/pt", pl: "/pl", de: "/de", zh: "/zh" },
}));

vi.mock("@/lib/program-weeks", () => ({
  programWeeks: [
    { slug: "week-1-sleep-foundations", number: 1, i18n: { en: { title: "Week 1" } } },
    { slug: "week-2-stimulus-control", number: 2, i18n: { en: { title: "Week 2" } } },
    { slug: "week-3-sleep-restriction", number: 3, i18n: { en: { title: "Week 3" } } },
    { slug: "week-4-relaxation", number: 4, i18n: { en: { title: "Week 4" } } },
    { slug: "week-5-cognitive", number: 5, i18n: { en: { title: "Week 5" } } },
    { slug: "week-6-maintenance", number: 6, i18n: { en: { title: "Week 6" } } },
  ],
}));

vi.mock("@/components/common/SafeLink", () => ({
  SafeLink: ({ children, to, className, "aria-label": ariaLabel }: any) => (
    <a href={to} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

describe("ProgramCompletionSummary", () => {
  const definition = getProgramDefinition();

  function makeCompletedProgress() {
    const p = createInitialProgress();
    return {
      ...p,
      status: "completed" as const,
      startedAt: "2025-01-01T00:00:00Z",
      completedAt: "2025-03-15T00:00:00Z",
      completedLessonIds: definition.lessons.map((l) => l.id),
    };
  }

  it("shows completion copy", () => {
    const progress = makeCompletedProgress();
    render(<ProgramCompletionSummary progress={progress} />);

    expect(screen.getByText("Congratulations!")).toBeInTheDocument();
    expect(screen.getByText("You've completed the CBT-I program.")).toBeInTheDocument();
  });

  it("shows review action linking to program page", () => {
    const progress = makeCompletedProgress();
    render(<ProgramCompletionSummary progress={progress} />);

    const reviewLinks = screen.getAllByText("Review Lessons");
    expect(reviewLinks.length).toBeGreaterThanOrEqual(1);
    // Find the one that's an anchor
    const link = reviewLinks.find((el) => el.closest("a"));
    expect(link).toBeTruthy();
    expect(link!.closest("a")).toHaveAttribute("href", "/en/program");
  });

  it("does not make medical-success claims", () => {
    const progress = makeCompletedProgress();
    render(<ProgramCompletionSummary progress={progress} />);

    // Disclaimer is present
    expect(screen.getByText("This is not medical advice.")).toBeInTheDocument();

    // No "cured", "healed", "fixed" type language
    const text = (document.body.textContent ?? "").toLowerCase();
    expect(text).not.toContain("cure");
    expect(text).not.toContain("healed");
    expect(text).not.toContain("fixed your");
    expect(text).not.toContain("successfully treated");
    expect(text).not.toContain("sleep cured");
  });

  it("no automatic restart button", () => {
    const progress = makeCompletedProgress();
    render(<ProgramCompletionSummary progress={progress} />);

    // No "Restart" button
    expect(screen.queryByText(/restart/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/start again/i)).not.toBeInTheDocument();
  });

  it("shows completed lessons count", () => {
    const progress = makeCompletedProgress();
    render(<ProgramCompletionSummary progress={progress} />);

    expect(screen.getByText("Lessons Completed")).toBeInTheDocument();
    // Count should be 18
    expect(screen.getByText("18")).toBeInTheDocument();
  });

  it("shows week review links for all 6 weeks", () => {
    const progress = makeCompletedProgress();
    render(<ProgramCompletionSummary progress={progress} />);

    // There should be 6 week links
    const weekLinks = screen.getAllByText(/Week [1-6]/);
    expect(weekLinks.length).toBeGreaterThanOrEqual(6);
  });
});
