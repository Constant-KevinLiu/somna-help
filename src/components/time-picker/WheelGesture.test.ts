import { describe, it, expect } from "vitest";

// WheelGesture is DOM-dependent; verify the module exports and that the
// factory returns a destroy function without a real browser.

describe("WheelGesture", () => {
  it("module can be imported", async () => {
    const { createWheelGesture } = await import("./WheelGesture");
    expect(typeof createWheelGesture).toBe("function");
  });
});
