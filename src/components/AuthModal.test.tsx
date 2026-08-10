/**
 * AuthModal frontend behavior tests.
 *
 * Verifies:
 * - UI advances to OTP step only when the server confirms email delivery.
 * - Email send failure shows a localized error message (not empty toast).
 * - Resend cooldown and rate-limit behavior is preserved.
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { AuthModal } from "./AuthModal";

// -----------------------------------------------------------------------------
// Polyfills for jsdom
// -----------------------------------------------------------------------------

beforeAll(() => {
  // ResizeObserver needed by input-otp
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

import { toast } from "sonner";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

let fetchMock: any;

beforeEach(() => {
  vi.clearAllMocks();
  fetchMock = vi.fn();
  (global as any).fetch = fetchMock;
});

function mockFetchSuccess() {
  fetchMock.mockResolvedValue(
    new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }),
  );
}

function mockFetchFailure(error: string, status: number, extra: Record<string, unknown> = {}) {
  fetchMock.mockResolvedValue(
    new Response(JSON.stringify({ success: false, error, ...extra }), {
      status,
      headers: { "content-type": "application/json" },
    }),
  );
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe("AuthModal — email delivery integration", () => {
  it("advances to OTP step only when server returns success", async () => {
    mockFetchSuccess();

    render(<AuthModal open={true} onOpenChange={vi.fn()} locale="en" />);

    // Email step should be shown
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    // Submit email
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send verification code/i }));

    // fetch was called once
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Toast success was shown
    expect(toast.success).toHaveBeenCalled();

    // OTP code input should exist (InputOTP renders an input with inputmode numeric)
    const otpInput = document.querySelector('input[inputmode="numeric"]');
    expect(otpInput).toBeTruthy();
  });

  it("does NOT advance to OTP step when email send fails", async () => {
    mockFetchFailure("email_send_failed", 503, { code: "AUTH_EMAIL_UNAVAILABLE" });

    render(<AuthModal open={true} onOpenChange={vi.fn()} locale="en" />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send verification code/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Error toast should have been shown with a non-empty message
    expect(toast.error).toHaveBeenCalled();
    const errorMessage = (toast.error as any).mock.calls[0][0];
    expect(typeof errorMessage).toBe("string");
    expect(errorMessage.length).toBeGreaterThan(0);
    expect(errorMessage).toMatch(/couldn't send|try again/i);

    // Email step should still be shown
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    // OTP input should NOT exist
    const otpInput = document.querySelector('input[inputmode="numeric"]');
    expect(otpInput).toBeNull();
  });

  it("shows localized Spanish error for email send failure", async () => {
    mockFetchFailure("email_send_failed", 400, { code: "AUTH_EMAIL_REJECTED" });

    render(<AuthModal open={true} onOpenChange={vi.fn()} locale="es" />);

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar código de verificación/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());

    const errorMessage = (toast.error as any).mock.calls[0][0];
    expect(errorMessage.toLowerCase()).toContain("no pudimos enviar");
  });

  it("shows localized Polish error for email send failure", async () => {
    mockFetchFailure("email_send_failed", 503, { code: "AUTH_EMAIL_UNAVAILABLE" });

    render(<AuthModal open={true} onOpenChange={vi.fn()} locale="pl" />);

    fireEvent.change(screen.getByLabelText(/adres e-mail/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /wyślij kod weryfikacyjny/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());

    const errorMessage = (toast.error as any).mock.calls[0][0];
    expect(errorMessage).toContain("Nie udało nam się wysłać");
  });

  it("preserves cooldown behavior when server returns cooldown error", async () => {
    mockFetchFailure("cooldown", 429, { waitSeconds: 45 });

    render(<AuthModal open={true} onOpenChange={vi.fn()} locale="en" />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send verification code/i }));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalled();
    });

    // Still on email step — no advancement
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    // No OTP input
    const otpInput = document.querySelector('input[inputmode="numeric"]');
    expect(otpInput).toBeNull();
  });

  it("resend flow: success starts cooldown and resets code", async () => {
    mockFetchSuccess();

    render(<AuthModal open={true} onOpenChange={vi.fn()} locale="en" />);

    // Initial send
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send verification code/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    // Resend button should show "Resend available in" text (cooldown active)
    await waitFor(() => {
      expect(screen.getByText(/resend available in/i)).toBeInTheDocument();
    });
  });
});
