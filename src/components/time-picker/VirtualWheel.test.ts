import { describe, it, expect } from "vitest";

import { createVirtualWheel, toDisplayIndex } from "./VirtualWheel";

const values = Array.from({ length: 12 }, (_, i) => String(i).padStart(2, "0"));

const config = {
  itemHeight: 48,
  visibleCount: 5,
  itemCount: values.length,
  loop: true,
  values,
};

describe("VirtualWheel", () => {
  it("createVirtualWheel renders only visible items plus buffer", () => {
    const wheel = createVirtualWheel(config);
    // visibleCount + 2 = 7 slots (5 visible + 1 buffer above + 1 buffer below)
    expect(wheel.slotCount).toBe(7);

    const state = wheel.update(0);
    expect(state.items.length).toBe(7);
    expect(state.centerIndex === 0).toBe(true);
    expect(state.normalizedCenterIndex).toBe(0);
  });

  it("virtual wheel reuses slot count regardless of offset", () => {
    const wheel = createVirtualWheel(config);
    const near = wheel.update(-48);
    const far = wheel.update(-10000);
    expect(near.items.length).toBe(far.items.length);
    expect(near.slotCount).toBe(far.slotCount);
  });

  it("normalizedCenterIndex wraps around for infinite wheels", () => {
    const wheel = createVirtualWheel(config);
    // 25 items down from index 0 = index 25, normalized for 12 items = 1
    const state = wheel.update(-48 * 25);
    expect(state.normalizedCenterIndex).toBe(1);
  });

  it("buffer items exist above and below the visible window", () => {
    const wheel = createVirtualWheel(config);
    const state = wheel.update(-48 * 5);
    // Center is index 5; visible half = 2; buffer adds one more on each side.
    // Items should go from index 2 to 8 (7 items total)
    // One above visible (index 2) and one below (index 8)
    const indices = state.items.map((item) => item.index);
    expect(indices[0]).toBe(2); // one above visible range
    expect(indices[indices.length - 1]).toBe(8); // one below visible range
  });
});

describe("toDisplayIndex", () => {
  it("normalizes loop indices", () => {
    expect(toDisplayIndex(0, 12)).toBe(0);
    expect(toDisplayIndex(12, 12)).toBe(0);
    expect(toDisplayIndex(-1, 12)).toBe(11);
  });
});
