import test from "node:test";
import assert from "node:assert/strict";
import { createWheelRenderer } from "./WheelRenderer";
import { createVirtualWheel } from "./VirtualWheel";

const values = Array.from({ length: 12 }, (_, i) => String(i).padStart(2, "0"));

function makeContainer(): HTMLElement {
  // Minimal DOM shim for the renderer under Node's native test runner.
  const children: HTMLElement[] = [];
  const style = { transform: "" } as unknown as CSSStyleDeclaration;
  const el: HTMLElement = {
    style,
    children: children as unknown as HTMLCollection,
    appendChild(child: HTMLElement) {
      children.push(child);
      return child;
    },
    remove() {
      /* no-op in shim */
    },
    getAttribute() {
      return null;
    },
    setAttribute() {
      /* no-op */
    },
    classList: {
      add() {
        /* no-op */
      },
      remove() {
        /* no-op */
      },
      contains() {
        return false;
      },
    } as unknown as DOMTokenList,
  } as unknown as HTMLElement;
  return el;
}

function makeSlot(): HTMLElement {
  const el = makeContainer();
  el.textContent = "";
  return el;
}

test("renderer creates the configured number of slots", () => {
  const container = makeContainer();
  const renderer = createWheelRenderer({ container, itemHeight: 48, slotCount: 7 });
  assert.equal(container.children.length, 7);
  renderer.destroy();
});

test("renderer applies translate3d to container and slots", () => {
  const container = makeContainer();
  const wheel = createVirtualWheel({
    itemHeight: 48,
    visibleCount: 5,
    itemCount: values.length,
    loop: true,
    values,
  });
  const renderer = createWheelRenderer({
    container,
    itemHeight: 48,
    slotCount: wheel.slotCount,
  });
  const offset = -48 * 3;
  const state = wheel.update(offset);
  renderer.render(state, offset);

  // The container stays at the clipping origin; motion is baked into slots.
  assert.ok(container.style.transform.includes("translate3d"));

  const slots = Array.from(container.children);
  assert.ok(slots.every((slot) => (slot as HTMLElement).style.transform.includes("translate3d")));

  renderer.destroy();
});

test("renderer ignores invalid offset values", () => {
  const container = makeContainer();
  const wheel = createVirtualWheel({
    itemHeight: 48,
    visibleCount: 5,
    itemCount: values.length,
    loop: true,
    values,
  });
  const renderer = createWheelRenderer({ container, itemHeight: 48, slotCount: wheel.slotCount });
  const state = wheel.update(0);
  renderer.render(state, 0);
  const before = container.style.transform;

  renderer.render(state, NaN);
  assert.equal(container.style.transform, before);

  renderer.render(state, Infinity);
  assert.equal(container.style.transform, before);

  renderer.destroy();
});

test("renderer marks selected item with aria-selected and wheel-item-selected", () => {
  const container = makeContainer();
  const wheel = createVirtualWheel({
    itemHeight: 48,
    visibleCount: 5,
    itemCount: values.length,
    loop: true,
    values,
  });
  const renderer = createWheelRenderer({ container, itemHeight: 48, slotCount: wheel.slotCount });
  const state = wheel.update(0);
  renderer.render(state, 0);

  const slots = Array.from(container.children) as HTMLElement[];
  const selected = slots.find((slot) => slot.getAttribute("aria-selected") === "true");
  assert.ok(selected);
  assert.ok(selected?.classList.contains("wheel-item-selected"));
  assert.ok(!selected?.classList.contains("wheel-item-inactive"));

  renderer.destroy();
});
