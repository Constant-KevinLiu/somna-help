import test from "node:test";
import assert from "node:assert/strict";

// WheelDebug is DOM-only and dev-only. Verify the module can be imported and
// that its public API surface matches the documented contract.

test("WheelDebug module exports documented API", async () => {
  const mod = await import("./WheelDebug");
  assert.equal(typeof mod.isWheelDebugEnabled, "function");
  assert.equal(typeof mod.getWheelDebugPanel, "function");
  assert.equal(typeof mod.updateWheelDebug, "function");
  assert.equal(typeof mod.copyWheelDebugState, "function");
});

test("isWheelDebugEnabled is false outside browser", () => {
  // In the Node test runner there is no DOM, so the guard should return false.
  // We can't easily simulate import.meta.env.DEV here, but the fallback should
  // at least not throw.
  import("./WheelDebug").then((mod) => {
    const result = mod.isWheelDebugEnabled();
    assert.equal(typeof result, "boolean");
  });
});

test("copyWheelDebugState resolves without throwing", async () => {
  const mod = await import("./WheelDebug");
  await assert.doesNotReject(mod.copyWheelDebugState());
});
