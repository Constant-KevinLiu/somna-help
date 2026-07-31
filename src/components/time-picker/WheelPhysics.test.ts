import { describe, it, expect } from "vitest";

import {
  clamp,
  normalizeIndex,
  offsetToIndex,
  indexToOffset,
  computeSnapIndex,
  computeSnapOffset,
  computeMomentumDestination,
  easeOutCubic,
  projectMomentum,
} from "./WheelPhysics";

const baseConfig = {
  itemHeight: 48,
  itemCount: 60,
  loop: true,
};

describe("clamp", () => {
  it("restricts values to bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("normalizeIndex", () => {
  it("wraps negative and overflow indices", () => {
    expect(normalizeIndex(0, 12)).toBe(0);
    expect(normalizeIndex(12, 12)).toBe(0);
    expect(normalizeIndex(-1, 12)).toBe(11);
    expect(normalizeIndex(13, 12)).toBe(1);
  });
});

describe("offsetToIndex", () => {
  it("converts pixel offset to nearest index", () => {
    expect(offsetToIndex(0, 48)).toBe(0);
    expect(offsetToIndex(-48, 48)).toBe(1);
    expect(offsetToIndex(-72, 48)).toBe(2); // rounds up
    expect(offsetToIndex(0, 48)).toBe(0);
  });
});

describe("indexToOffset", () => {
  it("converts index to pixel offset", () => {
    expect(indexToOffset(0, 48)).toBe(0);
    expect(indexToOffset(3, 48)).toBe(-144);
    expect(indexToOffset(0, 48)).toBe(0);
  });
});

describe("computeSnapIndex", () => {
  it("snaps to nearest valid value", () => {
    expect(computeSnapIndex(0, { itemHeight: 48, itemCount: 60, loop: true })).toBe(0);
    expect(computeSnapIndex(-48, { itemHeight: 48, itemCount: 60, loop: true })).toBe(1);
    expect(computeSnapIndex(-48 * 62, { itemHeight: 48, itemCount: 60, loop: true })).toBe(
      normalizeIndex(62, 60)
    );
  });
});

describe("computeSnapOffset", () => {
  it("returns normalized loop offset", () => {
    expect(computeSnapOffset(0, { itemHeight: 48, itemCount: 60, loop: true })).toBe(0);
    expect(computeSnapOffset(1, { itemHeight: 48, itemCount: 60, loop: true })).toBe(-48);
    expect(computeSnapOffset(2, baseConfig)).toBe(-96);
  });
});

describe("computeMomentumDestination", () => {
  it("returns snap target for low velocity", () => {
    const dest = computeMomentumDestination(-12, 0.05, {
      ...baseConfig,
      friction: 0.92,
      minVelocity: 0.15,
      maxVelocity: 2.5,
      snapDuration: 160,
    });
    // Low velocity: should snap to nearest index
    expect(dest.targetIndex).toBe(0);
    expect(dest.targetOffset).toBe(0);
    expect(dest.duration).toBe(160);
  });

  it("projects momentum for fast swipes", () => {
    const dest = computeMomentumDestination(0, 3, {
      ...baseConfig,
      friction: 0.99,
      minVelocity: 0.15,
      maxVelocity: 5,
      snapDuration: 160,
    });
    // Fast swipe: should travel multiple items
    expect(dest.targetIndex).toBeGreaterThan(0);
    expect(dest.targetOffset).not.toBe(0);
    expect(dest.duration).toBeGreaterThan(160);
  });
});

describe("easeOutCubic", () => {
  it("is smooth and bounded", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5) > 0.5).toBeTruthy();
    expect(easeOutCubic(1) === 1).toBeTruthy();
    expect(easeOutCubic(0) === 0).toBeTruthy();
  });
});

describe("projectMomentum", () => {
  it("returns zero for negligible velocity", () => {
    const result = projectMomentum(0, { friction: 0.92, itemHeight: 48 });
    expect(result.distance).toBe(0);
    expect(result.duration).toBe(0);
  });
});
