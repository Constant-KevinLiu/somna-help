import test from "node:test";
import assert from "node:assert/strict";

import { createVirtualWheel, toDisplayIndex } from "./VirtualWheel";

const values = Array.from({ length: 12 }, (_, i) => String(i).padStart(2, "0"));

const config = {
  itemHeight: 48,
  visibleCount: 5,
  itemCount: values.length,
  loop: true,
  values,
};

test("createVirtualWheel renders only visible items plus buffer", () => {
  const wheel = createVirtualWheel(config);
  assert.equal(wheel.slotCount, 7);

  const state = wheel.update(0);
  assert.equal(state.items.length, 7);
  assert.equal(state.normalizedCenterIndex, 0);
  assert.equal(state.items.find((i) => i.selected)?.value, "00");
});

test("virtual wheel reuses slot count regardless of offset", () => {
  const wheel = createVirtualWheel(config);
  const near = wheel.update(-48);
  const far = wheel.update(-10000);
  assert.equal(near.items.length, 7);
  assert.equal(far.items.length, 7);
});

test("normalizedCenterIndex wraps around for infinite wheels", () => {
  const wheel = createVirtualWheel(config);
  const state = wheel.update(-48 * 25);
  assert.equal(state.normalizedCenterIndex, 1);
});

test("buffer items exist above and below the visible window", () => {
  const wheel = createVirtualWheel(config);
  const state = wheel.update(-48 * 5);
  // Center is index 5; visible half = 2; buffer adds one more on each side.
  assert.equal(state.items[0]?.index, 2); // one above
  assert.equal(state.items[state.items.length - 1]?.index, 8); // one below
});

test("toDisplayIndex normalizes loop indices", () => {
  assert.equal(toDisplayIndex(0, 12), 0);
  assert.equal(toDisplayIndex(12, 12), 0);
  assert.equal(toDisplayIndex(-1, 12), 11);
});
