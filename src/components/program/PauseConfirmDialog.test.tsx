/**
 * PauseConfirmDialog — component regression tests
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { PauseConfirmDialog } from "./PauseConfirmDialog";

// -----------------------------------------------------------------------------
// Mock i18n
// -----------------------------------------------------------------------------

const mockUI = {
  pauseConfirmTitle: "Pause your program?",
  pauseConfirmBody: "Your progress will be preserved.",
  pauseConfirmCancel: "Cancel",
  pauseConfirmPause: "Pause Program",
};

vi.mock("@/lib/i18n", () => ({
  useI18n: () => ({ lang: "en", t: (k: string) => k }),
}));

vi.mock("@/lib/program-lessons-i18n", () => ({
  getProgramLessonUI: () => mockUI,
}));

describe("PauseConfirmDialog", () => {
  it("is not rendered when open is false", () => {
    render(<PauseConfirmDialog open={false} onOpenChange={() => {}} onConfirm={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens correctly when open is true", () => {
    render(<PauseConfirmDialog open={true} onOpenChange={() => {}} onConfirm={() => {}} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Pause your program?")).toBeInTheDocument();
    expect(screen.getByText("Your progress will be preserved.")).toBeInTheDocument();
  });

  it("cancel does not pause — calls onOpenChange(false) only", () => {
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    render(<PauseConfirmDialog open={true} onOpenChange={onOpenChange} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("confirm invokes pause and closes dialog", () => {
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    render(<PauseConfirmDialog open={true} onOpenChange={onOpenChange} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByText("Pause Program"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Escape key closes dialog without confirming", () => {
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    render(<PauseConfirmDialog open={true} onOpenChange={onOpenChange} onConfirm={onConfirm} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Escape does nothing when dialog is closed", () => {
    const onOpenChange = vi.fn();
    render(<PauseConfirmDialog open={false} onOpenChange={onOpenChange} onConfirm={() => {}} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("has proper aria-labelledby and aria-describedby", () => {
    render(<PauseConfirmDialog open={true} onOpenChange={() => {}} onConfirm={() => {}} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "pause-dialog-title");
    expect(dialog).toHaveAttribute("aria-describedby", "pause-dialog-body");
  });
});
