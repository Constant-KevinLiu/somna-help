import { describe, it, expect } from "vitest";

// WheelDebug is DOM-only and dev-only. Verify the module can be imported and
// that its public API surface matches the documented contract.

describe("WheelDebug", () => {
  it("module exports documented API", async () => {
    const mod = await import("./WheelDebug");
    expect(typeof mod.isWheelDebugEnabled).toBe("function");
    expect(typeof mod.getWheelDebugPanel).toBe("function");
    expect(typeof mod.updateWheelDebug).toBe("function");
    expect(typeof mod.copyWheelDebugState).toBe("function");
  });

  it("isWheelDebugEnabled is false outside browser", () => {
    // In the Node test runner there is no DOM, so the guard should return false.
    // We can't easily simulate import.meta.env.DEV here, but the fallback should
    // at least not throw.
    return import("./WheelDebug").then((mod) => {
      const result = mod.isWheelDebugEnabled();
      expect(result).toBe(false);
    });
  });

  it("copyWheelDebugState resolves without throwing", async () => {
    const mod = await import("./WheelDebug");
    // Should not reject even in SSR environment
    await expect(mod.copyWheelDebugState()).resolves.not.toThrow();
  });
});
