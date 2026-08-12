/**
 * ReminderForm regression tests.
 *
 * Verifies:
 * - ReminderForm renders without throwing "useFormField should be used within <FormField>"
 * - All primary fields (title, message, schedule, time, channels) render correctly
 * - Form submission calls createReminder with expected values
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ReminderForm } from "./ReminderForm";
import type { Reminder } from "@/services/habit/habit-types";

// -----------------------------------------------------------------------------
// Polyfills for jsdom
// -----------------------------------------------------------------------------

beforeAll(() => {
  // ResizeObserver needed by Radix UI components (Select, Dialog, etc.)
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

const mockCreateReminder = vi.fn();
const mockEditReminder = vi.fn();

vi.mock("@/hooks/useReminders", () => ({
  useReminders: () => ({
    createReminder: mockCreateReminder,
    editReminder: mockEditReminder,
  }),
}));

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe("ReminderForm — useFormField context regression", () => {
  it("renders without throwing useFormField context error", () => {
    // If any FormLabel/FormControl/FormDescription/FormMessage is rendered
    // outside a FormField context, useFormField() throws and this test will fail.
    expect(() => {
      render(<ReminderForm onClose={vi.fn()} />);
    }).not.toThrow();
  });

  it("renders all primary form fields", () => {
    render(<ReminderForm onClose={vi.fn()} />);

    // Title field
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();

    // Message field
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();

    // Schedule section heading (rendered as h3, not FormLabel)
    expect(screen.getByRole("heading", { level: 3, name: /schedule/i })).toBeInTheDocument();

    // Time field
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();

    // Delivery Channels section heading
    expect(
      screen.getByRole("heading", { level: 3, name: /delivery channels/i }),
    ).toBeInTheDocument();

    // In-app reminder switch
    expect(screen.getByLabelText(/in-app reminder/i)).toBeInTheDocument();

    // Browser notification switch
    expect(screen.getByLabelText(/browser notification/i)).toBeInTheDocument();

    // Submit button
    expect(screen.getByRole("button", { name: /create reminder/i })).toBeInTheDocument();
  });

  it("calls createReminder with correct values on submit", async () => {
    const onClose = vi.fn();

    render(<ReminderForm onClose={onClose} />);

    // Fill in title
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Morning check-in" },
    });

    // Fill in message
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: "Time to log your sleep" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /create reminder/i }));

    await waitFor(() => {
      expect(mockCreateReminder).toHaveBeenCalledTimes(1);
    });

    expect(mockCreateReminder).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Morning check-in",
        message: "Time to log your sleep",
        schedule: expect.objectContaining({
          type: "daily",
          time: "08:00",
        }),
        channels: ["in_app"],
      }),
    );

    expect(onClose).toHaveBeenCalled();
  });

  it("renders edit mode with pre-filled values", () => {
    const reminder: Reminder = {
      id: "rem-123",
      ownerId: "anonymous",
      title: "Bedtime reminder",
      message: "Wind down and prepare for sleep",
      status: "active",
      channels: ["in_app", "browser_notification"],
      schedule: {
        type: "daily",
        time: "22:30",
      },
      timezone: "UTC",
      snoozeOptionsMinutes: [5, 10, 15],
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    };

    render(<ReminderForm reminder={reminder} onClose={vi.fn()} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue("Bedtime reminder");
    expect(screen.getByLabelText(/message/i)).toHaveValue("Wind down and prepare for sleep");
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });
});
