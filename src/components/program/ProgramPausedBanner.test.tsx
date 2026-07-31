/**
 * ProgramPausedBanner — component regression tests
 *
 * Tests that the paused banner renders correctly and invokes callbacks.
 *
 * Presentational component — no state machine, no storage.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ProgramPausedBanner } from "./ProgramPausedBanner";

// -----------------------------------------------------------------------------
// Mock i18n + program UI strings
// -----------------------------------------------------------------------------

const mockUI = {
  pausedBannerTitle: "Program Paused",
  pausedBannerBody: "Your progress is preserved.",
  pausedProgressPreserved: "Progress preserved",
  resumeCta: "Resume Program",
};

vi.mock("@/lib/i18n", () => ({
  useI18n: () => ({ lang: "en", t: (k: string) => k }),
}));

vi.mock("@/lib/program-lessons-i18n", () => ({
  getProgramLessonUI: () => mockUI,
}));

describe("ProgramPausedBanner", () => {
  describe("full variant (default)", () => {
    it("renders paused message", () => {
      render(<ProgramPausedBanner />);
      expect(screen.getByText("Program Paused")).toBeInTheDocument();
      expect(screen.getByText("Your progress is preserved.")).toBeInTheDocument();
      expect(screen.getByText("Progress preserved")).toBeInTheDocument();
    });

    it("has accessible status semantics via role=status", () => {
      render(<ProgramPausedBanner />);
      const statusEl = screen.getByRole("status");
      expect(statusEl).toBeInTheDocument();
    });

    it("does not show resume button when onResume is not provided", () => {
      render(<ProgramPausedBanner />);
      expect(screen.queryByText("Resume Program")).not.toBeInTheDocument();
    });

    it("shows resume button when onResume is provided", () => {
      const onResume = vi.fn();
      render(<ProgramPausedBanner onResume={onResume} />);
      const button = screen.getByText("Resume Program");
      expect(button).toBeInTheDocument();
    });

    it("calls onResume when resume button is clicked", () => {
      const onResume = vi.fn();
      render(<ProgramPausedBanner onResume={onResume} />);
      const button = screen.getByText("Resume Program");
      fireEvent.click(button);
      expect(onResume).toHaveBeenCalledTimes(1);
    });
  });

  describe("compact variant", () => {
    it("renders compact paused banner with title", () => {
      render(<ProgramPausedBanner compact />);
      expect(screen.getByText("Program Paused")).toBeInTheDocument();
      expect(screen.getByText("Progress preserved")).toBeInTheDocument();
    });

    it("has role=status in compact mode", () => {
      render(<ProgramPausedBanner compact />);
      const statusEl = screen.getByRole("status");
      expect(statusEl).toBeInTheDocument();
    });

    it("shows resume button in compact mode when onResume provided", () => {
      const onResume = vi.fn();
      render(<ProgramPausedBanner compact onResume={onResume} />);
      const button = screen.getByText("Resume Program");
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
      expect(onResume).toHaveBeenCalledTimes(1);
    });
  });
});
