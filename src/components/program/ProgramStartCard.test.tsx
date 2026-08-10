/**
 * ProgramStartCard — component regression tests
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ProgramStartCard } from "./ProgramStartCard";

// -----------------------------------------------------------------------------
// Mock i18n
// -----------------------------------------------------------------------------

const mockUI = {
  startProgramTitle: "Start Your Sleep Journey",
  startProgramSubtitle: "A 6-week CBT-I program to improve your sleep.",
  weekLabel: "Week",
  lessonsLabel: "Lessons",
  programStructureInfo: "6 weeks · 18 lessons · self-paced",
  programPrivacyNote: "Private & secure.",
  programWhatItDoes: "Evidence-based CBT-I techniques.",
  programWhatItDoesNot: "Not medical advice.",
  startProgramCta: "Start Program",
};

vi.mock("@/lib/i18n", () => ({
  useI18n: () => ({ lang: "en", t: (k: string) => k }),
}));

vi.mock("@/lib/program-lessons-i18n", () => ({
  getProgramLessonUI: () => mockUI,
}));

describe("ProgramStartCard", () => {
  it("renders not-started content", () => {
    render(<ProgramStartCard onStart={() => {}} totalWeeks={6} />);

    expect(screen.getByText("Start Your Sleep Journey")).toBeInTheDocument();
    expect(screen.getByText("A 6-week CBT-I program to improve your sleep.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start Program" })).toBeInTheDocument();
  });

  it("start CTA invokes canonical handler", () => {
    const onStart = vi.fn();
    render(<ProgramStartCard onStart={onStart} totalWeeks={6} />);

    fireEvent.click(screen.getByRole("button", { name: "Start Program" }));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("shows structure info with week and lesson count", () => {
    const { container } = render(<ProgramStartCard onStart={() => {}} totalWeeks={6} />);

    // Find the structure info pill (rounded-full div with BookOpen icon)
    const pill = container.querySelector(".inline-flex.items-center.gap-2.rounded-full");
    expect(pill).not.toBeNull();
    const text = pill!.textContent ?? "";
    expect(text).toContain("6");
    expect(text).toContain("week");
    expect(text).toContain("18");
    expect(text).toContain("lesson");
  });

  it("has proper heading level", () => {
    render(<ProgramStartCard onStart={() => {}} totalWeeks={6} />);
    const heading = screen.getByRole("heading", { level: 2, name: "Start Your Sleep Journey" });
    expect(heading).toBeInTheDocument();
  });
});
