import test from "node:test";
import assert from "node:assert/strict";

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

test("clamp restricts values to bounds", () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-3, 0, 10), 0);
  assert.equal(clamp(15, 0, 10), 10);
});

test("normalizeIndex wraps negative and overflow indices", () => {
  assert.equal(normalizeIndex(0, 12), 0);
  assert.equal(normalizeIndex(12, 12), 0);
  assert.equal(normalizeIndex(-1, 12), 11);
  assert.equal(normalizeIndex(25, 12), 1);
});

test("offsetToIndex converts pixel offset to nearest index", () => {
  assert.equal(offsetToIndex(0, 48), 0);
  assert.equal(offsetToIndex(-48, 48), 1);
  assert.equal(offsetToIndex(-72, 48), 2); // rounds up
  assert.equal(Object.is(offsetToIndex(0, 48), 0), true);
});

test("indexToOffset converts index to pixel offset", () => {
  assert.equal(indexToOffset(0, 48), 0);
  assert.equal(indexToOffset(3, 48), -144);
  assert.equal(Object.is(indexToOffset(0, 48), 0), true);
});

test("computeSnapIndex snaps to nearest valid value", () => {
  assert.equal(computeSnapIndex(-20, baseConfig), 0);
  assert.equal(computeSnapIndex(-40, baseConfig), 1);
  assert.equal(computeSnapIndex(-2976, baseConfig), normalizeIndex(62, 60));
});

test("computeSnapOffset returns normalized loop offset", () => {
  assert.equal(Object.is(computeSnapOffset(0, baseConfig), 0), true);
  assert.equal(computeSnapOffset(61, baseConfig), -48);
  assert.equal(computeSnapOffset(normalizeIndex(62, 60), baseConfig), -96);
});

test("computeMomentumDestination returns snap target for low velocity", () => {
  const dest = computeMomentumDestination(-12, 0.05, {
    ...baseConfig,
    friction: 0.92,
    minVelocity: 0.15,
    maxVelocity: 2.5,
    snapDuration: 160,
  });
  assert.equal(dest.targetIndex, 0);
  assert.equal(Object.is(dest.targetOffset, 0), true);
  assert.equal(dest.duration, 160);
});

test("computeMomentumDestination projects momentum for fast swipes", () => {
  const dest = computeMomentumDestination(0, 1.5, {
    ...baseConfig,
    friction: 0.92,
    minVelocity: 0.15,
    maxVelocity: 2.5,
    snapDuration: 160,
  });
  assert.ok(dest.targetIndex >= 0 && dest.targetIndex < 60);
  assert.ok(dest.duration >= 160);
  assert.ok(dest.duration <= 750);
});

test("easeOutCubic is smooth and bounded", () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.ok(easeOutCubic(0.5) > 0.5);
  assert.ok(easeOutCubic(1.5) === 1);
  assert.ok(easeOutCubic(-0.5) === 0);
});

test("projectMomentum returns zero for negligible velocity", () => {
  const result = projectMomentum(0, { friction: 0.92, itemHeight: 48 });
  assert.equal(result.distance, 0);
  assert.equal(result.duration, 0);
});
