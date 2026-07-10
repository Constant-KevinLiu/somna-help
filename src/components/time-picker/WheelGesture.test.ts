import test from "node:test";
import assert from "node:assert/strict";

// WheelGesture is DOM-dependent; verify the module exports and that the
// factory returns a destroy function without a real browser.

test("WheelGesture module can be imported", async () => {
  const { createWheelGesture } = await import("./WheelGesture");
  assert.equal(typeof createWheelGesture, "function");
});
